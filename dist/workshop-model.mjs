import { D as rn } from "./NoteDefaults-1xFW0br8.mjs";
const ei = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function ni(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: l, fieldNote: s, deskNote: p, fallback: b } = e, I = (P) => typeof P == "string" && P.trim().length > 0 && P.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(P);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? l !== "field" && l !== "desk" : l !== null) || l === void 0 || !I(s) || !I(p) || !I(b) ? null : { kind: n, version: o, stage: t, choice: l, fieldNote: s.trim(), deskNote: p.trim(), fallback: b.trim() };
}
function ti(e) {
  return { ...e, stage: "review", choice: null };
}
function oi(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function ri(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const bn = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function ii(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: l, rightLabel: s } = e, p = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !p(l) || !p(s) ? null : { kind: n, version: o, mix: t, leftLabel: l.trim(), rightLabel: s.trim() };
}
function si({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === bn.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === bn.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === bn.leftLabel && o === bn.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function je(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function sr(e) {
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
    if (je(e, p.id) > (p.capacity ?? 1 / 0)) throw new Error(`Release "${p.label}" exceeds its point budget.`);
  }
}
function _n(e, n, o) {
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
  const P = { ...e, cards: e.cards.map((y) => p.has(y.id) ? { ...y, laneId: o } : y) }, C = e.lanes[l].capacity;
  return C !== void 0 && je(P, o) > C ? null : P;
}
const ai = {
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
}, mt = /* @__PURE__ */ new Map(), ar = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function li(e) {
  mt.set(e.kind, e);
}
function di(e) {
  return typeof e == "string" && mt.has(e);
}
function ge(e) {
  const n = mt.get(e);
  if (!n) throw new Error(`The ${ar[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let $n = null;
function ci(e) {
  $n = e;
}
function ui() {
  return $n !== null;
}
function me() {
  if (!$n) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return $n;
}
const $ = (e) => "“" + e.replace(/[“”]/g, '"') + "”", We = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Yt = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), wt = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), gt = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), fi = (e) => wt(gt(e)), lr = [
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
], dr = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : lr.indexOf(e.toLowerCase()), cr = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function po(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (l) => {
    const s = wt(l);
    s && o.add(s);
  };
  t(e), t(gt(e));
  for (const l of [...o]) t(l.replace(/^(?:the|my|our)\s+/i, ""));
  for (const l of [...o]) t(l.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const l of [...o]) t(l.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const Vn = "[^\\p{L}\\p{N}]", Zt = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Yt(n) + "(?:$|" + Vn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Vn + ")" + Yt(n) + "(?:$|" + Vn + ")", "u").test(e)
], Vt = ["first", "second", "third", "fourth", "fifth"];
function ur(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Vt.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(wt(gt(n)));
  if (!t) return null;
  const l = (t[1] ?? t[2]).toLowerCase(), s = l === "last" ? e.length - 1 : t[1] ? Vt.indexOf(l) : dr(l) - 1;
  return e[s] ?? null;
}
function Qn(e, n, o, t, l) {
  const s = po(n, o);
  if (s.some((b) => cr.test(b))) {
    const b = t && e.find((I) => I.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of s) {
    if (!b.startsWith("@")) continue;
    const I = e.find((P) => P.id === b.slice(1));
    if (I) return { item: I, rank: 0 };
  }
  for (const [b, I] of Zt.entries())
    for (const P of s) {
      const C = e.filter((y) => I(y.label.toLowerCase(), P.toLowerCase()));
      if (C.length === 1) return { item: C[0], rank: b };
      if (C.length > 1) return { several: C };
    }
  const p = l ? ur(e, n, o) : null;
  return p ? { item: p, rank: Zt.length } : {};
}
class An extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function rt(e, n, o, t, l = !1) {
  return { find: (I) => {
    const P = Qn(e, I, n, t, l);
    if (P.item) return P.item;
    const C = po(I, n), y = C[C.length - 1];
    if (P.pointing) throw new An("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (P.several) {
      const v = [...new Set(P.several.map((A) => A.label))];
      throw new An(v.length === 1 ? P.several.length + " " + o + "s are called " + $(v[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + $(y) + ": " + We(v.slice(0, 6).map($)) + ". Use the whole name.", "ambiguous", P.several.map((A) => A.id));
    }
    const k = e.map((v) => v.label);
    throw new An("There is no " + o + " called " + $(y) + " here." + (k.length && k.length <= 6 ? " The " + o + "s are " + We(k.map($)) + "." : k.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((v) => v.id));
  }, attempt: (I) => Qn(e, I, n, t, l).item ?? null, rank: (I) => Qn(e, I, n, t, l).rank ?? 1 / 0 };
}
const mo = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], xe = [...mo], He = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], wo = mo.slice(5);
function On(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ae(e);
  return n || (e.kind === "release-plan" ? "release-plan" : Ze(e) ?? "lanes");
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
}, it = {
  "launch-plan": W.launchLanes,
  pipeline: W.pipelineLanes,
  budget: W.budgetLanes,
  "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, se = (e, n) => Object.fromEntries(xe.filter((o) => !e.includes(o)).map((o) => [o, n])), re = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), Q = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), te = (e) => ({ type: "ref", of: "card", about: e }), Xn = (e) => ({ map: e }), Ie = se(["map"], W.notMap), ye = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), st = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: re(120, "The new name, 1 to 120 characters of plain text.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: Q("The lane or step."), label: re(80, "The new name, 1 to 80 characters of plain text.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: te("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: xe,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: re(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...it }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Q("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...it }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: Q("The lane or step it starts in."),
      label: re(80, "What the card says. Left out, the card is empty (on a map, the token is numbered); a launch plan, pipeline, budget, hiring plan or nest board needs it.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: ye("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: ye("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: ye("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...wo],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: te("The card or token.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: te("The card or token."), lane: Q("Where it goes.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: te("The token.") },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: Q("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: xe.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": W.launchLanes, budget: W.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: te("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: He,
    refusals: { ...Xn(W.mapCardLanes), ...se([...He, "map"], W.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: te("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...se(["release-plan"], W.notPoints), map: W.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: te("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...se(["release-plan"], W.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: te("The card."),
      lane: Q("The lane."),
      whenPresent: re(160, "What it says when the card is there."),
      whenAbsent: re(160, "What it says otherwise."),
      label: re(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: He,
    refusals: { ...Xn(W.mapOutcome), ...se([...He, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: te("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: He,
    refusals: { ...Xn(W.mapOutcome), ...se([...He, "map"], W.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: xe,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: Q("The lane or step."), before: Q("Present it just before this one.", !0), after: Q("Present it just after this one.", !0) },
    boards: xe,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: Q("The step it follows."), label: re(80, "The new step’s name."), outcome: re(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: Q("The step it goes in front of."),
      from: Q("Only the path from this step is taken over.", !0),
      label: re(80, "The new step’s name."),
      outcome: re(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: Q("The step."), outcome: re(160, "What it says.") },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: Q("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: Q("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: Q("The step."), alt: re(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Ie
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: te("The card the line starts at."), to: te("The card it points to."), label: re(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: vn()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: te("One card."), to: te("The other card.") },
    boards: ["lanes"],
    refusals: vn()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: te("The card."),
      note: re(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: re(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: vn()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: te("The card."), note: re(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: vn()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: te("The task."), duration: ye("Its days, 1 to 60.", 60, 1, !0), lag: ye("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], W.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: te("The task that waits."), waitsOn: te("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], W.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: te("The task that waits."), waitsOn: te("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: ye("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: te("The deal or line item."), amount: ye("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: se(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: ye("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: se(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: Q("The team giving."), to: Q("The team receiving."), amount: ye("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: se(["budget"], W.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: ye("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: se(["budget"], W.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: se(["lanes", "pipeline"], W.noRules)
  },
  {
    kind: "set_rule",
    summary: "Change a rule: on, severity, max (a limit) or to (a path).",
    intent: !1,
    fields: {
      rule: re(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: se(["lanes", "pipeline"], W.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: re(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: se(["lanes", "pipeline"], W.noRules) }
];
function vn() {
  return { ...se(["lanes"], W.businessLines), "release-plan": W.lines, "customer-interviews": W.lines, "experiment-budget": W.lines, map: W.lines };
}
const fr = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", Qt = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, hr = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function pr(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: hr(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: Qt.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: o,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: o,
        to: { type: "array", items: o, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: o,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: o,
        ...Qt.keys
      }, description: e.about };
  }
}
const go = (e) => "optional" in e && e.optional === !0;
function hi(e) {
  const n = e ? On(V(e)) : void 0;
  return st.map((o) => {
    const t = Object.entries(o.fields), l = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, p]) => !go(p)).map(([p]) => p)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([p, b]) => [p, pr(b, n)])) }
    }, s = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: l };
    return n && (s.accepted = o.boards.includes(n), s.accepted || (s.refusal = o.refusals[n])), s;
  });
}
const In = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function mr(e, n) {
  const o = !!e.lanes[0]?.station, t = rt(e.lanes, o ? In.step : In.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), l = rt(e.cards, o ? In.token : In.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
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
function Pn(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function q(e, n, o = null, t) {
  try {
    return V(e);
  } catch (l) {
    throw new F(Pn(l instanceof Error ? l.message : String(l), n), "refused", o, t);
  }
}
function wr(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, l] of Object.entries(n.fields)) {
    const s = e[t];
    if (s === void 0) {
      if (go(l)) continue;
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
function gr(e, n, o, t, l) {
  const s = structuredClone(e), p = o === "map", b = o === "release-plan", I = mr(s, t), P = { lane: p ? "step" : "lane", card: p ? "token" : "card" };
  function C(r, m, x, S, L = null) {
    if (typeof x == "object") {
      const M = r.find((K) => K.id === x.id);
      if (!M) throw new F("That " + S + " is no longer on the workshop.", "gone", L);
      return M;
    }
    const E = r.find((M) => M.id === x);
    if (E) return E;
    try {
      return m.find(x);
    } catch (M) {
      if (!(M instanceof An)) throw M;
      const K = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new F(M.message, K, L, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const y = (r, m = null) => C(s.lanes, I.lanes, r, "lane", m), k = (r, m = null) => C(s.cards, I.cards, r, "card", m), v = (r) => {
    try {
      return y(r);
    } catch {
      return null;
    }
  }, A = (r, m, x = {}, S = !0) => ({ board: r, said: m, changed: S, ...x }), R = (r) => s.cards.filter((m) => m.laneId === r).length, D = (r) => p ? "The presentation opens with " + $(r[0].label) + "." : "The presentation now runs " + r.map((m) => $(m.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return me().edit(s, n, l, {
      lane: (r) => y(r),
      card: (r) => k(r),
      done: (r, m, x) => A(r, m, x),
      refuse: (r, m = {}) => {
        throw new F(r, m.code ?? "refused", m.laneId ?? null, m.cardId);
      }
    });
  if (wo.includes(o)) {
    n.kind === "add_card" && Xt(n, o, y(n.lane).id);
    const r = {
      card: (x) => k(x),
      lane: (x) => y(x),
      refuse: (x, S = {}) => {
        throw new F(x, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (x, S = null, L) => q(x, o, S, L),
      done: (x, S, L) => A(x, S, L)
    }, m = ge(o).edit(s, n, r);
    if (m) return m;
  }
  switch (n.kind) {
    case "rename_workshop": {
      s.title = n.title;
      const r = q(s, o);
      return A(r, "Renamed the " + (p ? "map" : "workshop") + " to " + $(r.title) + ".");
    }
    case "rename_lane": {
      const r = y(n.lane), m = r.label;
      r.label = n.label;
      const x = q(s, o, r.id);
      return A(x, "Renamed " + $(m) + " to " + $(x.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = k(n.card), m = r.label;
      r.label = n.label;
      const x = q(s, o, r.laneId, r.id);
      return A(x, "Renamed " + $(m) + " to " + $(x.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (s.lanes.length >= 5) throw new F("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new F("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Ur(s, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new F(Pn(x.message, o), "refused");
      }
      const m = r.lanes[r.lanes.length - 1];
      return A(r, "Added the lane " + $(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const r = y(n.lane), m = s.cards.filter((x) => x.laneId === r.id);
      if (p) {
        if (m.length) throw new F($(m[0].label) + " is at " + $(r.label) + ". Move it to another step first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new F("A map needs at least two steps.", "refused", r.id);
      } else {
        if (m.length) throw new F($(r.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new F("A workshop needs at least two lanes.", "refused", r.id);
      }
      s.lanes = s.lanes.filter((x) => x !== r);
      for (const x of s.lanes) x.station && (x.station.next = x.station.next.filter((S) => S !== r.id));
      s.presentationOrder && (s.presentationOrder = s.presentationOrder.filter((x) => x !== r.id));
      for (const x of s.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((S) => S !== r.id));
      return xn(s, (x) => x.laneId === r.id), s.behaviour && (s.behaviour = me().dropLane(s.behaviour, r.id)), A(q(s, o), "Removed the " + P.lane + " " + $(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = y(n.lane);
      if (p) {
        if (n.allowedLanes !== void 0) throw new F(W.mapCardLanes, "not_on_this_board", r.id);
        let L = n.label;
        if (L === void 0) {
          let j = s.cards.length + 1;
          for (; s.cards.some((Z) => Z.label === "Token " + j); ) j++;
          L = "Token " + j;
        }
        const E = new Set([...s.lanes, ...s.cards].map((j) => j.id));
        let M = 1;
        for (; E.has("token-" + M); ) M++;
        s.cards.push({ id: "token-" + M, label: L, laneId: r.id });
        const K = q(s, o, r.id);
        return A(K, "Added " + $(K.cards[K.cards.length - 1].label) + " at " + $(r.label) + ".", { laneId: r.id, cardId: "token-" + M });
      }
      if (Xt(n, o, r.id), s.cards.length >= 24) throw new F("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && R(r.id) >= r.capacity)
        throw new F($(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map((L) => y(L).id))];
      let x;
      try {
        x = qr(s, r.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch (L) {
        throw new F(Pn(L.message, o), "refused", r.id);
      }
      const S = x.cards[x.cards.length - 1];
      return A(x, "Added " + (S.label ? $(S.label) : "an empty card") + " to " + $(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = k(n.card);
      if (p && s.cards.length === 1) throw new F("A map needs at least one token.", "refused", r.laneId, r.id);
      if (b && s.cards.length === 1) throw new F("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && s.cards.length === 1) throw new F("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      s.cards = s.cards.filter((m) => m !== r);
      for (const m of s.cards)
        m.dependsOn?.includes(r.id) && (m.dependsOn = m.dependsOn.filter((x) => x !== r.id), m.dependsOn.length || delete m.dependsOn);
      return xn(s, (m) => m.cardId === r.id), A(q(Gr(s, r.id), o, r.laneId), "Removed the " + P.card + " " + $(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? s.lanes.find((S) => S.id === n.lane.id) ?? null : v(n.lane), m = k(n.card, r?.id ?? null), x = y(n.lane, m.laneId);
      return N(m, x);
    }
    case "advance_card": {
      const r = k(n.card), m = s.lanes.find((S) => S.id === r.laneId), x = m.station.next.map((S) => s.lanes.find((L) => L.id === S)).filter((S) => !!S);
      if (!x.length) throw new F($(r.label) + " is at " + $(m.label) + ", and no path leads on from there.", "refused", m.id, r.id);
      if (x.length > 1)
        throw new F("From " + $(m.label) + " the path goes to " + x.map((S) => $(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + x[0].label + "”.", "refused", m.id, r.id);
      return N(r, x[0]);
    }
    case "set_lane_capacity": {
      const r = y(n.lane), m = s.behaviour && me().setLimit(s, r.id, n.capacity, l);
      if (typeof m == "string") throw new F(m, "refused", r.id);
      if (m) return A(m, $(r.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: r.id });
      const x = p ? "token" : b ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, A(q(s, o, r.id), p ? "Removed the limit at " + $(r.label) + "." : $(r.label) + " now holds any number of " + x + "s.", { laneId: r.id });
      const S = b ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > S)
        throw new F((p ? "A step" : "A lane") + " can hold from 1 to " + S + " " + x + "s.", "refused", r.id);
      const L = b ? s.cards.reduce((E, M) => E + (M.laneId === r.id ? M.points ?? 1 : 0), 0) : R(r.id);
      if (L > n.capacity)
        throw new F($(r.label) + " already holds " + L + " " + x + (L === 1 ? "" : "s") + ". Move some " + (p ? "on" : "out") + " first, or choose a higher " + (b ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, A(q(s, o, r.id), $(r.label) + " now holds up to " + n.capacity + " " + x + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = k(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, A(q(s, o, r.laneId, r.id), $(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const m = [...new Set(n.lanes.map((S) => y(S)))], x = s.lanes.find((S) => S.id === r.laneId);
      if (!m.includes(x)) throw new F($(r.label) + " is in " + $(x.label) + " now. Include " + $(x.label) + ", or move the card first.", "refused", x.id, r.id);
      return r.allowedLaneIds = m.map((S) => S.id), A(q(s, o, r.laneId, r.id), $(r.label) + " can now go only in " + We(m.map((S) => $(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new F("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, A(q(s, o, r.laneId, r.id), $(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = k(n.card), m = [...new Set(n.dependsOn.map((S) => k(S)))], x = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = m.filter((L) => r.dependsOn?.includes(L.id));
        if (!S.length) throw new F($(r.label) + " does not depend on " + We(m.map((L) => $(L.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((L) => !S.some((E) => E.id === L)), r.dependsOn.length || delete r.dependsOn, A(q(s, o, r.laneId, r.id), $(r.label) + " no longer depends on " + We(S.map((L) => $(L.label))) + ".", x);
      }
      if (!m.length) {
        if (n.mode === "add") throw new F("Name the features " + $(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, A(q(s, o, r.laneId, r.id), $(r.label) + " no longer depends on anything.", x);
      }
      if (m.includes(r)) throw new F("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...m.map((S) => S.id)])], A(q(s, o, r.laneId, r.id), $(r.label) + " now depends on " + We(m.map((S) => $(S.label))) + ".", x);
    }
    case "set_outcome": {
      const r = k(n.card), m = y(n.lane), x = s.signals ?? (s.signals = []), S = n.label, L = S === void 0 ? x.filter((j) => j.cardId === r.id && j.laneId === m.id) : x.filter((j) => j.cardId === r.id && j.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && L.length > 1) throw new F("Two outcomes on this card have that name.", "refused", m.id, r.id);
      if (!L.length && x.length >= 24) throw new F("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, r.id);
      let E = 1;
      for (; x.some((j) => j.id === "signal-" + E); ) E++;
      const K = { label: S ?? L[0]?.label ?? (r.label + " in " + m.label).slice(0, 80).trim(), cardId: r.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return L.length ? Object.assign(L[0], K) : x.push({ id: "signal-" + E, ...K }), A(q(s, o, m.id, r.id), "When " + $(r.label) + " is in " + $(m.label) + " the workshop says " + $(n.whenPresent) + ". Otherwise it says " + $(n.whenAbsent) + ".", { laneId: m.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = k(n.card), m = (s.signals ?? []).filter((x) => x.cardId === r.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new F($(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        xn(s, (x) => x.cardId === r.id);
      } else {
        const x = C(m, rt(m, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        xn(s, (S) => S.id === x.id);
      }
      return A(q(s, o, r.laneId, r.id), "Removed the outcome from " + $(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((m) => y(m));
      if (r.length !== s.lanes.length || new Set(r).size !== s.lanes.length) throw new F("Include each scene once in the presentation order.", "refused");
      return s.presentationOrder = r.map((m) => m.id), A(q(s, o), D(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new F("Say before or after, not both.", "invalid_edit");
      const r = y(n.lane), m = n.before ?? n.after, x = m === void 0 ? void 0 : y(m);
      if (x && x.id === r.id) throw new F("Choose two different scenes.", "refused", r.id);
      const S = bt(s).filter((L) => L.id !== r.id);
      return S.splice(x ? S.findIndex((L) => L.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), s.presentationOrder = S.map((L) => L.id), A(q(s, o, r.id), D(S), { laneId: r.id });
    }
    case "add_station": {
      const r = y(n.from);
      let m;
      try {
        m = uo(s, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new F(S.message, "refused", r.id);
      }
      const x = m.lanes[m.lanes.length - 1];
      return A(m, "Added a path from " + $(r.label) + " to " + $(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const r = y(n.before), m = n.from === void 0 ? void 0 : y(n.from), x = m ? [m] : s.lanes.filter((E) => E.station.next.includes(r.id));
      if (m && !m.station.next.includes(r.id))
        throw new F("There is no path from " + $(m.label) + " to " + $(r.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!x.length) throw new F("Nothing leads to " + $(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = uo(s, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (E) {
        throw new F(E.message, "refused", r.id);
      }
      const L = S.lanes[S.lanes.length - 1];
      for (const E of S.lanes)
        x.some((M) => M.id === E.id) && (E.station.next = [...new Set(E.station.next.map((M) => M === r.id ? L.id : M))]);
      return L.station.next = [r.id], A(q(S, o, L.id), "Added " + $(L.label) + " before " + $(r.label) + ".", { laneId: L.id });
    }
    case "connect_stations": {
      const r = y(n.from), m = y(n.to);
      if (r.id === m.id) throw new F("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(m.id) ? A(s, $(r.label) + " already leads to " + $(m.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(m.id), A(q(s, o, r.id), "Connected " + $(r.label) + " to " + $(m.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = y(n.from), m = y(n.to);
      if (!r.station.next.includes(m.id)) throw new F("There is no path between " + $(r.label) + " and " + $(m.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((x) => x !== m.id), A(q(s, o, r.id), "Removed the path from " + $(r.label) + " to " + $(m.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = y(n.station);
      return r.station.outcome = n.outcome, A(q(s, o, r.id), "Changed what happens at " + $(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = y(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), A(q(s, o, r.id), "Moved " + $(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = y(n.station);
      return n.image === null ? (delete r.station.image, A(q(s, o, r.id), "Removed the image at " + $(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, A(q(s, o, r.id), "Updated the image at " + $(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = y(n.station);
      if (!r.station.image) throw new F("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, A(q(s, o, r.id), "Updated the image description at " + $(r.label) + ".", { laneId: r.id });
    }
    case "connect_cards":
    case "connect_note": {
      const r = k(n.card);
      let m = r.id, x, S;
      if (n.kind === "connect_cards") {
        const j = k(n.to, r.laneId);
        if (j.id === r.id) throw new F("A line joins two different cards.", "refused", r.laneId, r.id);
        x = j.id, S = $(j.label);
      } else {
        const j = n.note.trim();
        if (s.cards.some((Z) => Z.id === j) || s.lanes.some((Z) => Z.id === j))
          throw new F("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", r.laneId, r.id);
        x = j, S = "the note " + j, n.direction === "from_note" && ([m, x] = [x, m]);
      }
      const L = Ro(s, m, x, n.label ? { label: n.label } : {}), E = un(s, L);
      if (E) throw new F(E, "refused", r.laneId, r.id);
      const M = Sn(s, L), K = m === r.id;
      return A(
        M,
        K ? "Drew a line from " + $(r.label) + " to " + S + "." : "Drew a line from " + S + " to " + $(r.label) + ".",
        { laneId: r.laneId, cardId: r.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const r = k(n.card), m = n.kind === "disconnect_cards" ? k(n.to, r.laneId).id : n.note.trim(), x = n.kind === "disconnect_cards" ? $(s.cards.find((E) => E.id === m).label) : "the note " + m, S = (E) => E.parentId === r.id && E.childId === m || E.parentId === m && E.childId === r.id, L = s.lines ?? [];
      return L.some(S) ? (s.lines = L.filter((E) => !S(E)), A(q(s, o, r.laneId, r.id), "Took away the line between " + $(r.label) + " and " + x + ".", { laneId: r.laneId, cardId: r.id })) : A(e, $(r.label) + " and " + x + " are not joined by a line.", { laneId: r.laneId, cardId: r.id }, !1);
    }
  }
  throw new F("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function N(r, m) {
    const x = { laneId: m.id, cardId: r.id };
    if (r.laneId === m.id)
      return A(e, $(r.label) + " is already " + (p ? "at " : "in ") + $(m.label) + ".", x, !1);
    const S = cn(e, r.id, m.id);
    if (!S) throw new F(Cn(e, r.id, m.id) ?? "That move is not available.", "refused", m.id, r.id);
    return A(q(S, o, m.id, r.id), "Moved " + $(r.label) + " to " + $(m.label) + ".", x);
  }
}
function Xt(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount", "band"].find((l) => e[l] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? l !== "amount" && (l !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && l === "amount"));
  if (t) throw new F(t === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", o);
}
function xn(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function Ge(e, n, o = {}) {
  const t = (C) => ({ refused: { index: 0, kind: null, laneId: null, ...C } });
  let l;
  try {
    l = V(e);
  } catch (C) {
    return t({ reason: "The workshop cannot be read: " + (C instanceof Error ? C.message : String(C)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const s = l, p = [], b = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [C, y] of n.entries()) {
    const k = y?.kind, v = st.find((m) => m.kind === k);
    if (!y || typeof y != "object" || !v)
      return t({
        index: C,
        kind: typeof k == "string" ? k : null,
        code: "invalid_edit",
        reason: "There is no edit called " + $(String(k)) + ". The edits are " + We(st.map((m) => m.kind)) + "."
      });
    const A = wr(y, v);
    if (A) return t({ index: C, kind: v.kind, code: "invalid_edit", reason: A });
    const R = On(l);
    if (!v.boards.includes(R))
      return t({ index: C, kind: v.kind, code: "not_on_this_board", reason: v.refusals[R] ?? "This workshop does not take " + v.kind + "." });
    let D;
    try {
      D = gr(l, y, R, o.selection, b);
    } catch (m) {
      if (!(m instanceof F)) throw m;
      return t({
        index: C,
        kind: v.kind,
        reason: m.reason,
        code: m.code,
        laneId: m.laneId,
        ...m.cardId && { cardId: m.cardId },
        ...m.candidates && { candidates: m.candidates },
        ...m.limits && { limits: m.limits }
      });
    }
    const N = l.behaviour && !fr(v.kind) ? me().check(l, D.board) : null;
    if (N && "refused" in N)
      return t({ index: C, kind: v.kind, reason: N.refused.sentence, code: "refused", laneId: N.refused.laneId, cardId: N.refused.cardId });
    const r = br(l, D.board);
    if (r) return t({ index: C, kind: v.kind, reason: r, code: "not_on_this_board", laneId: D.laneId ?? null });
    l = D.board, p.push({
      index: C,
      kind: v.kind,
      said: D.said,
      changed: D.changed ?? !0,
      ...D.laneId && { laneId: D.laneId },
      ...D.cardId && { cardId: D.cardId }
    });
  }
  const I = new Map(s.cards.map((C) => [C.id, C.laneId])), P = l.cards.flatMap((C) => {
    const y = I.get(C.id);
    return y === void 0 || y === C.laneId ? [] : [{ cardId: C.id, fromLaneId: y, toLaneId: C.laneId }];
  });
  return { workshop: l, report: { edits: p, movedCards: P } };
}
function yr(e, n) {
  const o = ae(e);
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
    if (!l || t.currency !== l.currency || t.step !== l.step) return "A budget keeps its currency and its step.";
    const s = ge(o).fixed?.(e, n);
    if (s) return s;
    const p = e.lanes.find((b) => {
      const I = n.lanes.find((P) => P.id === b.id);
      return b.floor !== I.floor || b.cap !== I.cap || b.capacity !== I.capacity;
    });
    if (p) return `${p.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((l) => l.id === t.id).capacity) ? W.launchLanes : o && ge(o).fixed?.(e, n) || null;
}
const kr = {
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
function br(e, n) {
  const o = V(e), t = On(o);
  let l;
  try {
    l = V(n);
  } catch (I) {
    return Pn(I instanceof Error ? I.message : String(I), t);
  }
  const s = On(l), p = (I, P) => I.lanes.length === P.lanes.length && I.lanes.every((C) => P.lanes.some((y) => y.id === C.id)), b = (I, P) => I.lanes.every((C, y) => P.lanes[y]?.id === C.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && s !== t)
    return p(o, l) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, l)) return W.keepsOrder;
  if (ae(o) && s === t && !(p(o, l) && b(o, l))) return it[t];
  if (ae(o) && s === t) {
    const I = yr(o, l);
    if (I) return I;
  }
  if (t === "release-plan" && s === "release-plan") {
    if (!p(o, l)) return W.releaseLanes;
    if (!b(o, l)) return W.releaseOrder;
    if (l.cards.some((I) => !o.cards.some((P) => P.id === I.id))) return W.releaseCards;
  }
  return t !== s ? "This slate holds a " + kr[t] + ", and it stays one. Start a new slate for another kind of workshop." : o.behaviour || l.behaviour ? me().replacement(o, l) : null;
}
const pi = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function mi(e) {
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
function vr(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function wi(e, n) {
  return vr(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const yo = ["firstPrint", "secondPrint", "thirdPrint"], ko = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function gi(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...ko, route: n.route };
  for (const t of yo) {
    const l = n[t];
    if (typeof l != "string" || !l.trim() || l.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = l.trim();
  }
  return o;
}
function yi(e = new URLSearchParams()) {
  const n = { ...ko };
  for (const t of yo) {
    const l = e.get(t)?.trim();
    l && l.length <= 48 && (n[t] = l);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function ki(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Ir(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Cr(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), Ar(n), n;
}
function xr(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function Ar(e) {
  return e && xr(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function eo(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function sn(e) {
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
function Cr(e) {
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
function et() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const no = "#1f7a5c", to = "#5b9a85", nt = "#c2410c", Tr = "#2f5fd0", Sr = {
  diamond: "diamond",
  rhombus: "diamond",
  ellipse: "oval",
  oval: "oval",
  circle: "circle",
  star: "star",
  triangle: "triangle",
  pentagon: "pentagon",
  hexagon: "hexagon",
  octagon: "octagon",
  trapezium: "trapezium",
  parallelogram: "parallelogram",
  rarrow: "arrow",
  larrow: "arrow",
  arrow: "arrow",
  stickynote: "sticky note"
}, Lr = { canMove: !1, canSelect: !1 };
function $r(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function bi(e, n, o = {}) {
  let t = V(n);
  const l = o.kit, s = (i) => !!ae(i) && !l;
  if (s(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const p = l?.layer(e);
  let b = null, I = null, P = !!o.readOnly, C = P || s(t), y = !1;
  const k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let N = null, r = null, m = null, x = null;
  const S = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map();
  let E = null, M = null;
  function K(i, a) {
    M && clearTimeout(M.timer), M = { name: i, reason: a, timer: setTimeout(() => {
      M = null, y || z(I ?? t);
    }, 3e3) };
  }
  let j = Promise.resolve(), Z = null, J = oo(o.layout), Le = J;
  const $e = { ...o.style };
  let he = /* @__PURE__ */ new Map(), Oe = /* @__PURE__ */ new Set(), pe = null, Pe = !1, Ve = null, Ee = null, fn = !1;
  const ce = /* @__PURE__ */ new Map();
  ze(t);
  const ee = o.origin ? { x: o.origin.x, y: o.origin.y } : Pr(e), be = (i) => D.get(i) ?? i, de = (i) => $r(be(i));
  function ie(i) {
    const a = R.get(i);
    if (a) return a;
    if (k.has(i) && !D.has(i) || !e.nodes.one?.(i)) return i;
    const d = Fo(i, (c) => !!e.nodes.one?.(c) || D.has(c));
    return R.set(i, d), D.set(d, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const ve = {
    governs(i) {
      if (k.get(i.id) !== i) return null;
      const a = de(i.id)?.kind;
      return a === "card" ? { canMove: !C, canEditText: !C && !I && t.kind !== "release-plan", canConnect: en() } : a === "lane" ? { canMove: !1, canEditText: !C && !I } : a === "handle" ? { canMove: !C && !I, canEditText: !1, ...!J.narrow && { cursor: "ew-resize" } } : Lr;
    },
    onStart(i, a) {
      const d = de(i.id), c = { x: a.x - (i.options.x ?? 0), y: a.y - (i.options.y ?? 0) };
      if (d.kind === "handle") {
        const h = !C && !I && l ? l.handleDrag(t, be(i.id), c, J) : null;
        return h ? (le(), _e(), M && (clearTimeout(M.timer), M = null), b = { name: be(i.id), follow: h, last: null }, !0) : !1;
      }
      const w = d.key;
      if (C || I || !t.cards.some((h) => h.id === w)) return !1;
      le(), _e();
      let u = null;
      try {
        u = (l?.chooser ?? o.chooseCandidate)?.(t, w, c, J) ?? null;
      } catch (h) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", h);
      }
      return N = { cardId: w, evaluate: u, grab: c, outcome: { kind: "home" } }, z(t, { skip: w }), !0;
    },
    onMove(i, a) {
      if (b) {
        b.last = b.follow(on(a)), z(b.last.next, { grip: b.name, layout: b.last.layout }), B(o.onPreview, b.last.next === t ? null : b.last.next);
        return;
      }
      if (!N) return;
      const d = Lt(N.cardId, a, N.evaluate);
      if (Or(d, N.outcome)) return;
      N.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      z(c ?? t, { skip: N.cardId }), B(o.onPreview, c);
    },
    onEnd(i, a) {
      if (b) {
        const { follow: h, name: f } = b, g = h(on(a));
        b = null, B(o.onPreview, null), g.refusal ? (K(f, g.refusal), z(t), e.announce?.(g.refusal), B(o.onRefuse, { laneId: null, reason: g.refusal })) : yn(g.next, {}) || z(t);
        const O = Zn(t, f);
        return O ? { accept: !0, settle: O } : { accept: !1 };
      }
      if (!N) return { accept: !1 };
      const { cardId: d, evaluate: c } = N, w = Lt(d, a, c), u = t.cards.find((h) => h.id === d);
      if (N = null, B(o.onPreview, null), w.kind === "candidate" && l) {
        if (!yn(w.next, { cardId: d, laneId: w.laneId }, d))
          return z(t, { skip: d }), { accept: !1 };
        w.said && (K("card-" + d, w.said), e.announce?.(w.said));
        const h = Zn(t, be(i.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (w.kind === "candidate") {
        t = w.next, z(t, { skip: d });
        const h = t.lanes.find((g) => g.id === w.laneId);
        e.announce?.(`${Y(u)} moved to ${h.label}. ${Ae(t, h.id)}.`), B(o.onChange, t, { cardId: d, laneId: w.laneId });
        const f = Zn(t, be(i.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (w.kind === "refused")
        or(Y(u), { cardId: d, laneId: w.laneId, reason: w.reason }), w.near && K("card-" + d, w.reason);
      else if (w.kind === "outside" && ln(t) && !Qe()) {
        const h = Tn(t, d);
        if (!h)
          return Kn(d, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
        z(t, { skip: d }), e.announce?.(h), B(o.onRefuse, { cardId: d, laneId: null, reason: h });
      } else
        z(t, { skip: d }), w.kind === "outside" && (e.announce?.(`${Y(u)} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (b) {
        b = null, B(o.onPreview, null), z(t);
        return;
      }
      const a = N && t.cards.find((d) => d.id === N.cardId);
      N = null, B(o.onPreview, null), z(t, { skip: de(i.id)?.key }), a && e.announce?.(`Move cancelled. ${Y(a)} stays where it was.`);
    },
    onTextCommit(i, a, d) {
      const c = de(i.id);
      if (!c || C || I) return !1;
      let w = a.replace(/\s+/g, " ").trim();
      const u = [], h = ae(t), f = h && c.kind === "card" ? ge(h).renamed(t, c.key, w) : null;
      f && (w = f.label, u.push(...f.edits));
      const g = c.kind === "lane" ? { laneId: c.key, label: w } : { cardId: c.key, label: w };
      u.unshift(c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: w } : { kind: "rename_card", card: { id: c.key }, label: w });
      const O = Ge(t, u);
      if ("refused" in O) {
        const { reason: T } = O.refused;
        return e.announce?.(`${d} keeps its name. ${T}`), B(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: g, reason: T }), !1;
      }
      return JSON.stringify(O.workshop) === JSON.stringify(t) ? (z(t), !1) : (t = O.workshop, z(t), e.announce?.(f ? O.report.edits.map((T) => T.said).join(" ") : `${d} renamed to ${w}.`), B(o.onChange, t, { rename: g, ...l ? { edits: u } : {} }), f ? !1 : w);
    },
    onKeyDown(i, a) {
      const d = de(i.id);
      if (C || I || N || b || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (m && (m.node !== i.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== m.key) && Ot(), m && a.key === "Escape")
        return a.preventDefault(), Ot(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (m && a.key === "Enter") {
        a.preventDefault();
        const h = m.choices[m.at];
        return m = null, B(o.onPreview, null), t = h.next, z(t), e.announce?.(h.done), B(o.onChange, t, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: h.edits }), !0;
      }
      const c = l?.keyChoices?.(t, be(i.id), a.key);
      if (c) {
        a.preventDefault();
        const h = [], f = [];
        for (const T of typeof c == "string" ? [] : c) {
          const _ = Ge(t, T.edits);
          "refused" in _ ? f.push(`${T.said}: ${_.refused.reason}`) : h.push({ ...T, next: _.workshop, done: _.report.edits.map((H) => H.said).join(" ") });
        }
        if (!h.length)
          return e.announce?.(typeof c == "string" ? c : f.join(" ")), !0;
        const g = m && m.node === i.id ? (m.at + 1) % h.length : 0;
        m = { node: i.id, key: a.key.toLowerCase(), choices: h, at: g }, z(h[g].next), B(o.onPreview, h[g].next);
        const O = h.length > 1 ? ` (${g + 1} of ${h.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${h[g].said}${O} Enter to make it, Escape to cancel.`), !0;
      }
      const w = l?.keyEdit?.(t, be(i.id), { key: a.key, shiftKey: a.shiftKey });
      if (w) {
        a.preventDefault();
        const h = Ge(t, w);
        return "refused" in h ? (e.announce?.(h.refused.reason), B(o.onRefuse, { laneId: h.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: h.refused.reason })) : yn(h.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = t.cards.find((h) => h.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), $t(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && qo())
        return a.preventDefault(), $t(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: h, next: f, spot: g } = r;
        if (r = null, h === null)
          return B(o.onPreview, null), Kn(u.id, g), !0;
        const O = t;
        t = f, z(t), Ne(h), B(o.onPreview, null);
        const T = t.lanes.find((_) => _.id === h);
        return e.announce?.(`${Y(u)} moved to ${T.label}. ${Ae(t, h)}.`), B(o.onChange, t, { cardId: u.id, laneId: h, ...l ? { edits: l.editsBetween(O, t) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), _e(), e.announce?.(`Move cancelled. ${Y(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((a) => k.get(a.id) === a).map((a) => a.id);
      fn = i.length === 1, k.clear(), v.clear(), A.clear(), ce.clear(), R.clear(), D.clear(), N = null, r = null, z(I ?? t, { animate: !1 }), i.length === 1 && (j = j.then(() => {
        fn = !1;
        const a = k.get(i[0]);
        if (!y && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        Dn();
      }));
    }
  };
  ve.onFreeMove = (i, a) => {
    if (!pn() || i.options?.isComment) return Hn();
    const d = mn(a), c = wn(i), w = t.lanes.filter((f) => !Xe(i) && Ue(t, f.id, c) === null).map((f) => f.id), u = d && l?.noteUnder?.(t, on(a), J);
    u && (c.under = u);
    const h = d ? Xe(i) ?? Ue(t, d, c) : null;
    x && x.noteId === i.id && x.laneId === d && x.refusal === h || (x = { noteId: i.id, laneId: d, refusal: h, open: w }, Ce());
  }, ve.onFreeDrop = (i, a, d) => {
    if (Hn(), !pn() || i.options?.isComment) return;
    const c = mn(a);
    if (!c) return;
    const w = wn(i), u = l?.noteUnder?.(t, on(a), J);
    u && (w.under = u);
    const h = t.lanes.find((g) => g.id === c), f = Xe(i) ?? Ue(t, c, w);
    return f ? (le(!1), E = { laneId: c, reason: f, timer: setTimeout(() => le(), 1500) }, Ce(), e.announce?.(`${Bn(w.label)} can't go in ${h.label}. ${f}`), B(o.onRefuse, { noteId: i.id, laneId: c, reason: f }), "refused") : (qn([{ node: i, offer: w, from: d }], c), "taken");
  }, ve.onFreeGroupDrop = (i, a, d) => {
    if (Hn(), !pn() || i.some((f) => f.options?.isComment)) return;
    const c = mn(a);
    if (!c) return;
    const w = t.lanes.find((f) => f.id === c), u = i.map((f) => ({ node: f, offer: wn(f) })), h = Yo(u, c);
    if (h) {
      le(!1), E = { laneId: c, reason: h, timer: setTimeout(() => le(), 1500) }, Ce(), e.announce?.(`${Pt(u.map((f) => Bn(f.offer.label)))} can't go in ${w.label}. ${h}`);
      for (const { node: f } of u) B(o.onRefuse, { noteId: f.id, laneId: c, reason: h });
      return "refused";
    }
    return qn(u.map((f, g) => ({ ...f, from: d?.[g] })), c), "taken";
  }, ve.onFreeTextCommit = (i) => {
    if (!pn() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const a = i.options ?? {}, d = mn({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = wn(i), w = t.lanes.find((O) => O.id === d), u = Xe(i) ?? Ue(t, d, c);
    if (!u) {
      qn([{ node: i, offer: c }], d);
      return;
    }
    le(!1), E = { laneId: d, reason: u, timer: setTimeout(() => le(), 1500) }, Ce(), e.announce?.(`${Bn(c.label)} can't go in ${w.label}. ${u} It is beside the board.`), B(o.onRefuse, { noteId: i.id, laneId: d, reason: u });
    const { width: h } = ze(t), f = Math.round(ee.x + h + 32), g = Math.round(a.y ?? ee.y);
    i.position(f, g, () => e.updateSelectionResizeRotate?.(), void 0, et() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [eo({ ...i.options, x: f, y: g })] });
  }, ve.undoState = () => ({ cards: t.cards.map((i) => ({ ...i })), pairs: [...S], lines: (t.lines ?? []).map((i) => ({ ...i })) }), ve.onUndoRestore = (i, a) => {
    if (y) return;
    const d = new Map((i?.cards ?? []).map((u) => [u.id, u])), c = new Map(i?.pairs ?? []), w = (u) => S.get(u) ?? c.get(u) ?? u;
    for (const u of a.added) {
      const h = w(u), f = t.cards.find((O) => O.id === h);
      if (!f) continue;
      t = V({ ...t, cards: t.cards.filter((O) => O !== f), lines: Be(t.lines, h, u) }), z(t);
      const g = B(o.onChange, t, { cardId: h, cardToNote: { noteId: u }, via: "undo" });
      e.holdTrade?.(u, g), tt(g);
    }
    for (const u of a.removed) {
      const h = w(u), f = d.get(h);
      if (!f || t.cards.some((U) => U.id === h)) continue;
      const g = (i?.lines ?? []).filter((U) => U.parentId === h || U.childId === h), O = {
        id: h,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...g.length ? { lines: g } : {}
      }, T = [f.laneId, ...t.lanes.map((U) => U.id)].find((U) => an(t, U, O));
      if (!T) {
        e.announce?.(`${Y(f)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = nr(an(t, T, O), h, i?.cards ?? []), h !== u && S.set(u, h), z(t);
      const _ = t.cards.findIndex((U) => U.id === h), H = t.cards.slice(_ + 1).find((U) => U.laneId === T)?.id, G = B(o.onChange, t, { cardId: h, laneId: T, noteToCard: {
        noteId: u,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...H ? { before: H } : {},
        ...g.length ? { lines: Be(g, h, u) } : {}
      }, via: "undo" });
      e.holdTrade?.(u, G), tt(G);
    }
    Array.isArray(i?.lines) && er(i.lines);
  };
  let zn = !1;
  ve.onNodeAdded = (i) => {
    y || zn || k.get(i.id) === i || (t.lines ?? []).some((a) => a.parentId === i.id || a.childId === i.id) && (zn = !0, queueMicrotask(() => {
      zn = !1, y || Ce();
    }));
  }, ve.onLine = (i, a) => {
    y || queueMicrotask(() => {
      y || Qo(i, a);
    });
  };
  const Go = e.setDragPolicy(ve), Uo = o.onSelect || p ? e.onSelectionChange?.(() => {
    Dn(), Ht();
  }) : void 0;
  let hn = null;
  const At = (i) => {
    const d = i.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, c = d && k.has(d) ? zt(d) : null;
    c !== hn && (hn = c, Ht());
  };
  p && e.element?.addEventListener?.("pointerover", At);
  const Ct = (i) => {
    if (r && _e(), Ve = null, Ee && (clearTimeout(Ee), Ee = null), !i || y || typeof e.clientToWorld != "function" || typeof i.button == "number" && i.button !== 0 || i.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(t.lanes.map((u) => ie(X.lane(u.id))));
    if ((e.getSelectedNodes?.() ?? []).some((u) => !a.has(u?.id))) return;
    const d = t.lanes.flatMap((u) => [X.caption(u.id), X.column(u.id)]).map((u) => k.get(ie(u))).filter(Boolean), c = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: i.clientX, y: i.clientY }), d, { padding: 0 }) : null, w = c ? de(c.id) : null;
    w && (Ve = { pointerId: i.pointerId, laneId: w.key, x: i.clientX, y: i.clientY });
  }, Tt = (i) => {
    const a = Ve;
    Ve = null, !(!a || i.pointerId !== a.pointerId || Math.hypot(i.clientX - a.x, i.clientY - a.y) > 6) && (Ee = setTimeout(() => {
      if (Ee = null, y || N || b || !t.lanes.some((c) => c.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = k.get(ie(X.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, St = () => {
    Ve = null;
  };
  e.element?.addEventListener?.("pointerdown", Ct, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Tt, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", St, !0), z(t, { animate: !1 });
  function Lt(i, a, d) {
    const c = t.cards.find((T) => T.id === i);
    if (!c) return { kind: "outside" };
    if (l) {
      const T = on(a), _ = l.refusalAt(t, i, N?.grab ?? { x: 0, y: 0 }, T, J);
      if (_ && !_.lands) return { kind: "refused", laneId: _.laneId, reason: _.reason };
      const { width: H, height: G } = ze(t);
      if (T.x < -40 || T.y < -40 || T.x > H + 40 || T.y > G + 40) return { kind: "outside" };
      let U = t;
      try {
        U = d?.(T) ?? t;
      } catch (ne) {
        console.warn("WORKSHOP: the board kit's chooser threw", ne);
      }
      return JSON.stringify(U) === JSON.stringify(t) ? _ ? { kind: "refused", laneId: _.laneId, reason: _.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: U.cards.find((ne) => ne.id === i)?.laneId ?? c.laneId, next: U, ..._ && { said: _.reason } };
    }
    const w = t.lanes.map((T) => k.get(ie(X.column(T.id)))).filter(Boolean), u = e.hitTestNodes(a, w, { padding: 6 }), h = u ? de(u.id).key : null;
    if (!h) return { kind: "outside" };
    if (h === c.laneId) return { kind: "home" };
    const f = cn(t, i, h);
    if (!f) return { kind: "refused", laneId: h, reason: Cn(t, i, h) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: h, next: f };
    let g = null;
    try {
      g = d({ x: a.x - ee.x, y: a.y - ee.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: h, next: f };
    }
    const O = g?.cards.find((T) => T.id === i)?.laneId;
    return !g || !O || O === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: O, next: g };
  }
  function qo() {
    return l ? !1 : new Set(qe(t, { layout: J }).places.map((i) => i.row)).size > 1;
  }
  function $t(i, a, d = !1) {
    const c = t.cards.find((T) => T.id === i), w = io(t, i), u = r?.cardId === i && r.laneId === null ? r.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const T = u > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (_e(), T.id === c.laneId) {
        Ne(T.id, I ?? t), e.announce?.(`${Y(c)} is back in ${T.label}.`);
        return;
      }
      if (w.includes(T)) {
        const H = cn(t, i, T.id);
        r = { cardId: i, laneId: T.id, next: H }, z(H), Ne(T.id, H), B(o.onPreview, H), e.announce?.(`${Y(c)} to ${T.label}: ${Ae(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const _ = Cn(t, i, T.id) ?? "That move is not available.";
      le(), E = { laneId: T.id, reason: _, timer: setTimeout(() => le(), 1500) }, z(I ?? t), Ne(T.id, I ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${_}`), B(o.onRefuse, { cardId: i, laneId: T.id, reason: _ });
      return;
    }
    const h = r?.cardId === i ? r.laneId : c.laneId;
    let f;
    if (d) {
      const { places: T } = qe(t, { layout: J }), _ = T.find((H) => H.laneId === h);
      f = T.filter((H) => H.column === _.column && (H.row - _.row) * a > 0).sort((H, G) => (H.row - G.row) * a).map((H) => t.lanes.find((G) => G.id === H.laneId));
    } else {
      const T = t.lanes.findIndex((_) => _.id === h);
      f = a > 0 ? t.lanes.slice(T + 1) : t.lanes.slice(0, T).reverse();
    }
    const g = f.find((T) => w.includes(T));
    if (le(), !g) {
      const T = f[0];
      if (!T) {
        if (!d && ln(t)) {
          const H = Tn(t, i);
          if (H) {
            e.announce?.(H), B(o.onRefuse, { cardId: i, laneId: null, reason: H });
            return;
          }
          Ko(c, a);
          return;
        }
        e.announce?.(`${Y(c)} has no lane to move to on that side.`);
        return;
      }
      const _ = Cn(t, i, T.id) ?? "That move is not available.";
      E = { laneId: T.id, reason: _, timer: setTimeout(() => le(), 1500) }, z(r?.next ?? I ?? t), Ne(T.id, r?.next ?? I ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${_}`), B(o.onRefuse, { cardId: i, laneId: T.id, reason: _ });
      return;
    }
    if (g.id === c.laneId) {
      _e(), Ne(g.id, I ?? t), e.announce?.(`${Y(c)} is back in ${g.label}.`);
      return;
    }
    const O = cn(t, i, g.id);
    r = { cardId: i, laneId: g.id, next: O }, z(O), Ne(g.id, O), B(o.onPreview, O), e.announce?.(`${Y(c)} to ${g.label}: ${Ae(O, g.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ne(i, a = t) {
    const d = l ? ir(a, X.column(i)) : qe(a, { layout: J, rows: Ft() }).places.find((g) => g.laneId === i), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const w = 16, u = (g, O, T, _) => O + w * 2 >= _ || g - w < T ? g - w - T : g + O + w > T + _ ? g + O + w - (T + _) : 0, h = u(ee.x + d.x, d.width, c.x, c.width), f = u(ee.y + d.y, d.height, c.y, c.height);
    (h || f) && e.panBy?.({ x: h, y: f });
  }
  function Dn() {
    if (!o.onSelect || fn) return;
    const i = y ? [] : e.getSelectedNodes?.() ?? [], a = i.length === 1 && k.get(i[0].id) === i[0] ? de(i[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== pe && (pe = c, B(o.onSelect, d));
  }
  function Ot() {
    m && (m = null, z(t), B(o.onPreview, null));
  }
  function _e() {
    r && (r = null, B(o.onPreview, null), z(I ?? t));
  }
  function Ko(i, a) {
    const { width: d } = ze(t), c = k.get(ie(X.card(i.id)))?.options, w = c?.width ?? 228, u = { x: a > 0 ? ee.x + d + 32 : ee.x - w - 32, y: c?.y ?? ee.y }, h = ao(t, i.id);
    r = { cardId: i.id, laneId: null, side: a, spot: u, next: t }, z(t), B(o.onPreview, h), e.announce?.(`${Y(i)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Qe() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function pn() {
    return !y && !C && !I && !N && !Qe() && ln(t);
  }
  function Hn() {
    x && (x = null, y || Ce());
  }
  function mn(i) {
    const a = t.lanes.map((c) => k.get(ie(X.column(c.id)))).filter(Boolean), d = e.hitTestNodes(i, a, { padding: 6 });
    return d ? de(d.id)?.key ?? null : null;
  }
  function wn(i) {
    const a = i.options ?? {}, d = xo({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), w = c.replace(/\s+/g, " ").trim(), u = {};
    c.trim() !== w && c.length <= 4e3 && (u.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const f of ["width", "height"]) Number.isFinite(a[f]) && a[f] >= 10 && a[f] <= 4e3 && (u[f] = Math.round(a[f]));
    if (dt(a.image)) {
      u.image = { src: a.image };
      for (const [f, g] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[g]) && a[g] >= 1 && a[g] <= 2e4 && (u.image[f] = a[g]);
    }
    a.link?.data && ro({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const h = Jo(i);
    return { id: i.id, label: w, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...h.length ? { lines: h } : {} };
  }
  function Jo(i) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!k.get(c) && k.get(c) === e.nodes.one(c);
    for (const c of i.relationships?.getAssociations?.() ?? [])
      (c.targetPoint || !d(c.childId)) && a.set(c.id, nn(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === i || d(c.id)))
        for (const w of c.relationships?.getAssociations?.() ?? [])
          w.childId === i.id && !w.targetPoint && a.set(w.id, nn(w));
    for (const c of lo(t, i.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function Pt(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function Yo(i, a) {
    for (const { node: u } of i) {
      const h = Xe(u);
      if (h) return h;
    }
    const d = t.lanes.find((u) => u.id === a), c = t.cards.filter((u) => u.laneId === a).length;
    if (d.capacity !== void 0 && c + i.length > d.capacity) {
      const u = d.capacity - c;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let w = t;
    for (const { offer: u } of i) {
      const h = Ue(w, a, u);
      if (h) return h;
      w = an(w, a, u);
    }
    return null;
  }
  function Xe(i) {
    if (i.options?.image && !dt(i.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = i.options?.link;
    return a?.data && !ro({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const Bn = (i) => i || "This note", Y = (i) => i.label || "The empty card", Et = (i) => {
    const a = String(i ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : Sr[a] ?? "shape";
  }, Gn = (i) => (/^[aeiou]/i.test(i) ? "an " : "a ") + i, Nt = (i) => {
    const a = i.flatMap((d) => {
      const c = Et(d.asNote?.shape);
      return c ? [{ card: d, word: c }] : [];
    });
    if (!a.length) return "";
    if (i.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Gn(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: c }) => c === "shape" ? `${Y(d)} had its own shape` : `${Y(d)} was ${Gn(c)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, Zo = (i) => {
    const a = Et(i);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Gn(a)} again.` : "";
  };
  function en() {
    return !y && !C && !I && !Qe() && !t.kind && ln(t);
  }
  function nn(i) {
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
      const w = i[c];
      w != null && w !== "" && (a[c] = w);
    }
    for (const c of ["sourceAnchor", "targetAnchor"]) {
      const w = i[c];
      w && Number.isFinite(w.x) && Number.isFinite(w.y) && (a[c] = { x: w.x, y: w.y });
    }
    const d = i.targetPoint;
    return d && Number.isFinite(d.x) && Number.isFinite(d.y) && (a.targetPoint = { x: d.x, y: d.y }, delete a.targetAnchor), a;
  }
  function _t(i, a) {
    const d = { ...i };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function Rt(i) {
    if (!i || e.nodes.one(i.id) !== i) return null;
    if (k.get(i.id) === i) {
      const a = de(i.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return i.options?.isComment ? null : i.id;
  }
  function Un(i, a) {
    if (i.cards.some((c) => c.id === a)) {
      const c = k.get(ie(X.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && k.get(a) !== d && d.svgGroup ? d : null;
  }
  function Mt(i) {
    const a = [];
    for (const d of i) {
      const c = e.nodes.one(d.parentId);
      if (!c?.relationships || k.get(c.id) === c || c.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const h = c.relationships.addFloatingAssociation(d.targetPoint, sn(d));
        a.push({ type: "addRelationship", data: { ...h } });
        continue;
      }
      const w = e.nodes.one(d.childId);
      if (!w || k.get(w.id) === w) continue;
      const u = c.relationships.addAssociation(w, sn(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function Vo(i) {
    const a = /* @__PURE__ */ new Set();
    for (const d of i.lines ?? []) {
      if (d.targetPoint) {
        const _ = Un(i, d.parentId);
        if (!_ || k.get(_.id) !== _) continue;
        const H = { ...d, parentId: _.id }, G = JSON.stringify(H);
        a.add(d.id);
        const U = ce.get(d.id);
        if (U && U.key === G && U.holder === _ && !U.other && _.relationships.hasAssociationId?.(d.id)) continue;
        U && e.nodes.one(U.holder.id) === U.holder && U.holder.relationships?.removeAssociation?.(d.id), _.relationships.addFloatingAssociation(d.targetPoint, sn(H)), ce.set(d.id, { holder: _, other: null, swapped: !1, key: G });
        continue;
      }
      const c = Un(i, d.parentId), w = Un(i, d.childId);
      if (!c || !w || c === w) continue;
      const u = k.get(c.id) !== c, h = u ? w : c, f = u ? c : w, g = u ? _t({ ...d, parentId: h.id, childId: f.id }, d) : { ...d, parentId: h.id, childId: f.id }, O = JSON.stringify(g);
      a.add(d.id);
      const T = ce.get(d.id);
      T && T.key === O && T.holder === h && T.other === f && h.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), h.relationships.addAssociation(f, sn(g)), ce.set(d.id, { holder: h, other: f, swapped: u, key: O }));
    }
    for (const [d, c] of [...ce])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), ce.delete(d));
  }
  function gn(i) {
    const a = i.parentId ? e.nodes.one(i.parentId) : null, d = i.id ?? i.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !i.id) && a.relationships.removeAssociation(d);
    });
  }
  let tn = null;
  function Qo(i, a) {
    if (i === "addRelationship") {
      if (ce.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, c = e.nodes.one(a?.parentId), w = d ? null : e.nodes.one(a?.childId), u = Rt(c), h = d ? null : Rt(w), f = tn?.lineId === a?.id ? t.lines?.find((H) => H.id === a?.id) : void 0;
      f && (tn = null);
      const g = (H) => {
        gn(a), f && z(I ?? t), e.announce?.(H), B(o.onRefuse, { reason: H, laneId: null });
      };
      if (!en()) {
        gn(a), f && z(I ?? t);
        return;
      }
      if (!u || !h && !d) return g(f ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const O = d ? String(a.childId) : h;
      if (f) {
        const H = t.cards.some((Me) => Me.id === u), G = !d && t.cards.some((Me) => Me.id === h);
        if (!H && !G) return Re({ remove: f.id });
        const U = { ...nn(a), id: f.id, parentId: u, childId: O }, ne = un(t, U);
        if (ne) return g(ne);
        gn(a), Re({ set: U });
        return;
      }
      const T = Ro(t, u, O, nn(a)), _ = un(t, T);
      if (_) return g(_);
      gn(a), Re({ set: T });
      return;
    }
    if (i === "removeRelationship") {
      const d = [...ce].find(([w, u]) => (w === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = ce.get(d);
      if (ce.delete(d), e.nodes.one(c.holder.id) !== c.holder || c.other && e.nodes.one(c.other.id) !== c.other || !en())
        return en() || y ? void 0 : z(I ?? t);
      tn = { lineId: d }, queueMicrotask(() => {
        y || tn?.lineId !== d || (tn = null, Re({ remove: d }));
      });
      return;
    }
    if (i === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...ce].find(([T, _]) => T === d?.associationId && _.holder.id === d?.id);
        if (!c) continue;
        const [w, u] = c, h = t.lines?.find((T) => T.id === w), f = u.holder.relationships?.getAssociations?.().find((T) => T.id === w);
        if (!h || !f) continue;
        if (!en()) {
          z(I ?? t);
          continue;
        }
        const g = nn(f), O = u.swapped ? _t({ ...g, id: h.id, parentId: h.parentId, childId: h.childId }, g) : { ...g, id: h.id, parentId: h.parentId, childId: h.childId };
        JSON.stringify(Xo(O)) !== JSON.stringify(h) && (ce.set(w, { ...u, key: "" }), Re({ set: O }));
      }
  }
  function Xo(i) {
    return Sn({ ...t, lines: [] }, i)?.lines?.[0] ?? null;
  }
  function Re(i) {
    const a = t.lines?.find((f) => f.id === ("set" in i ? i.set.id : i.remove)), d = "set" in i ? Sn(t, i.set) : co(t, i.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), z(I ?? t);
    const c = "set" in i ? i.set : a, w = [c.parentId, c.childId].map((f) => t.cards.find((g) => g.id === f)?.label ?? e.nodes.one(f)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (f) => w[f] || (f === 1 && c.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in i ? a ? `The line from ${u(0)} to ${u(1)} changed.` : c.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const h = B(o.onChange, t, { line: i });
    tt(h, () => {
      if (y || t !== d) return;
      const f = a ? Sn(t, a) : "set" in i ? co(t, i.set.id) : null;
      f && (t = f, z(I ?? t));
    });
  }
  function er(i) {
    const a = new Map(i.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || Re({ remove: c });
    for (const [c, w] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(w) && un(t, w) === null && Re({ set: w });
  }
  function qn(i, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), w = i.map(({ node: f, offer: g, from: O }) => {
      let T = g.lines;
      for (const [G, U] of c) T = Be(T, G, U);
      d = an(d, a, { ...g, ...T ? { lines: T } : {} });
      const _ = d.cards[d.cards.length - 1];
      _.id !== f.id && c.set(f.id, _.id);
      const H = { ...f.options ?? {}, ...O ? { x: O.x, y: O.y } : {} };
      return { node: f, card: _, kept: H, lines: Be(T ?? [], f.id, _.id), under: g.under };
    });
    e.beginHostStep?.(), t = d;
    let u = t;
    for (const { node: f, card: g } of w)
      g.id !== f.id && S.set(f.id, g.id), L.set(ie(X.card(g.id)), { x: f.options?.x ?? 0, y: f.options?.y ?? 0 }), Fe(() => e.removeNode(f.id));
    e.endHostStep?.(), z(t), tr(ie(X.card(w[0].card.id)));
    const h = t.lanes.find((f) => f.id === a);
    e.announce?.(w.length === 1 ? `${Y(w[0].card)} is now a card in ${h.label}. ${Ae(t, a)}.${Nt([w[0].card])}` : `${Pt(w.map(({ card: f }) => Y(f)))} are now cards in ${h.label}. ${Ae(t, a)}.${Nt(w.map(({ card: f }) => f))}`);
    for (const { node: f, card: g, kept: O, lines: T, under: _ } of w) {
      const H = { cardId: g.id, laneId: a, noteToCard: {
        noteId: f.id,
        label: g.label,
        ..._ && { under: _ },
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...T.length ? { lines: T } : {}
      } }, G = () => {
        t !== u || !t.cards.some((ne) => ne.id === g.id) || (t = V({ ...t, cards: t.cards.filter((ne) => ne.id !== g.id), lines: Be(t.lines, g.id, f.id) }), u = t, z(t));
      }, U = B(o.onChange, t, H);
      e.holdTrade?.(f.id, U), Wt(U, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: f.id, isComment: !1 } }]);
      }, () => {
        if (!y) {
          if (G(), !e.nodes.one(O.id)) {
            e.beginHostStep?.();
            const ne = Fe(() => e.addNode({ ...O }));
            ne && (ne.announcedByCreator = !0), e.endHostStep?.();
            const Me = Be(T, g.id, f.id).filter((ue) => !t.cards.some((kn) => kn.id === ue.parentId || kn.id === ue.childId));
            ne?.ready?.then?.(() => {
              y || Fe(() => Mt(Me));
            });
          }
          e.announce?.(`${Y(g)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        y || (G(), e.keepTrade?.(f.id), e.announce?.(`Someone else put ${Y(g)} on the board first.`));
      });
    }
  }
  function Kn(i, a) {
    const d = t.cards.find((oe) => oe.id === i), c = t.lanes.find((oe) => oe.id === d.laneId), w = t.cards.findIndex((oe) => oe.id === i), u = t.cards.slice(w + 1).find((oe) => oe.laneId === d.laneId)?.id, h = v.get(ie(X.card(i))) ?? {}, f = bo(d), g = e.nodes.one(f) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : f, O = lo(t, i), { leave: T } = Hr(t, i, g), _ = ao(t, i, g), H = ($e.cornerRadius ?? 0) > 0, G = d.asNote, U = G?.text !== void 0 && kt(G.text) === d.label ? G.text : Dr(t, d), ne = {
      id: g,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: G?.width ?? h.width ?? 228,
      height: G?.height ?? h.height ?? 76,
      text: U,
      shape: G?.shape ?? (H ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? h.backgroundColor,
      fontColor: d.look?.textColor ?? h.foregroundColor,
      fontSize: d.look?.fontSize ?? h.fontSize,
      borderColor: d.look?.borderColor ?? h.borderColor,
      borderWidth: d.look?.borderWidth ?? h.borderWidth,
      ...d.look?.fontFamily ?? h.fontFamily ? { fontFamily: d.look?.fontFamily ?? h.fontFamily } : {}
    };
    G?.image && Object.assign(ne, {
      image: G.image.src,
      ...G.image.width ? { imageOrigWidth: G.image.width } : {},
      ...G.image.height ? { imageOrigHeight: G.image.height } : {}
    }), G?.link && (ne.link = { ...G.link });
    for (const oe of Object.keys(ne)) ne[oe] === void 0 && delete ne[oe];
    e.beginHostStep?.(), t = _;
    const Me = t;
    g !== i ? S.set(g, i) : S.delete(g);
    const ue = Fe(() => e.addNode(ne));
    ue && (ue.announcedByCreator = !0), e.endHostStep?.(), z(t);
    const kn = Promise.resolve(ue?.ready).then(() => y || !ue || e.nodes.one(g) !== ue ? [] : Fe(() => Mt(T))).catch(() => []);
    ue?.ready?.then?.(() => {
      if (y || e.nodes.one(g) !== ue) return;
      const oe = () => e.selectNodes?.([ue]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(oe) : oe();
    }), e.announce?.(`${Y(d)} is now a note on the canvas. ${c.label}: ${Ae(t, c.id)}.${Zo(G?.shape)}`);
    const qt = () => {
      e.nodes.one(g) === ue && (e.beginHostStep?.(), Fe(() => e.removeNode(g)), e.endHostStep?.());
    }, Kt = B(o.onChange, t, { cardId: i, cardToNote: { noteId: g } });
    e.holdTrade?.(g, Kt), Wt(Kt, () => {
      kn.then((oe) => {
        ue && e.nodes.one(g) === ue && e.sendHeld?.([{ type: "onNodeAdded", data: { id: g, nodeOptions: eo(ue.options) } }, ...oe]);
      });
    }, () => {
      if (!y) {
        if (qt(), t === Me && !t.cards.some((oe) => oe.id === i)) {
          const oe = {
            id: i,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...O.length ? { lines: O } : {}
          }, Jt = an(t, d.laneId, oe, u);
          Jt && (t = Jt, z(t));
        }
        e.announce?.(`${Y(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      y || (qt(), e.keepTrade?.(g), e.announce?.(`Someone else took ${Y(d)} off the lanes first.`));
    });
  }
  function nr(i, a, d) {
    const c = d.map((g) => g.id), w = c.indexOf(a), u = i.cards.find((g) => g.id === a);
    if (w < 0 || !u) return i;
    const h = i.cards.filter((g) => g !== u), f = h.findIndex((g) => c.indexOf(g.id) > w);
    return h.splice(f < 0 ? h.length : f, 0, u), V({ ...i, cards: h });
  }
  function tr(i) {
    j = j.then(() => {
      const a = k.get(i);
      if (y || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Fe(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function Wt(i, a, d, c) {
    if (!i || typeof i.then != "function") return a();
    const w = i.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && c();
    }, () => d());
    e.holdUntil?.(w);
  }
  function or(i, a) {
    le(!1), E = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => le(), 1500) }, z(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${i || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), B(o.onRefuse, a);
  }
  function le(i = !0) {
    E && (clearTimeout(E.timer), E = null, i && !y && Ce());
  }
  function Ce() {
    z(N && N.outcome.kind === "candidate" ? N.outcome.next : r?.next ?? I ?? t, { skip: N?.cardId });
  }
  function jt(i) {
    const a = Gt(i, Ft()), d = new Map(a.map((u) => [u.options.id, u.options])), c = (u, h, f, g = !1) => {
      const O = d.get(X.column(u));
      O && (O.borderColor = h, O.borderWidth = f, delete O.borderStyle);
      const T = g && d.get(X.lane(u));
      T && (T.borderColor = h, T.borderWidth = f);
    }, w = N?.cardId ?? r?.cardId;
    if (he = /* @__PURE__ */ new Map(), w) {
      const u = t.cards.find((g) => g.id === w)?.laneId, h = io(t, w);
      if (!l || l.laneCues)
        for (const g of h) g.id !== u && (c(g.id, to, 2), he.set(g.id, "open"));
      if (l?.laneCues) {
        for (const g of t.lanes) if (!h.includes(g)) {
          const O = d.get(X.column(g.id));
          O && (O.backgroundColor = "#e9e8e2"), he.set(g.id, "closed");
        }
      }
      const f = N ? N.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      f?.kind === "candidate" && (c(f.laneId, no, 3, !0), he.set(f.laneId, "over")), f?.kind === "refused" && (c(f.laneId, nt, 3), he.set(f.laneId, "refused"));
    }
    if (x && !w) {
      for (const u of x.open) u !== x.laneId && (c(u, to, 2), he.set(u, "open"));
      x.laneId && !x.refusal && (c(x.laneId, no, 3, !0), he.set(x.laneId, "over")), x.laneId && x.refusal && (c(x.laneId, nt, 3), he.set(x.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const u = d.get(X.card(r.cardId));
      u && (u.xPos = r.spot.x, u.yPos = r.spot.y);
    }
    if (E) {
      he.set(E.laneId, "refused"), c(E.laneId, nt, 3, !0);
      const u = d.get(X.caption(E.laneId));
      u && (u.text = E.reason, u.foregroundColor = "#b42318");
    }
    if (Oe = /* @__PURE__ */ new Set(), I && i === I) {
      const u = (f, g) => JSON.stringify(f) === JSON.stringify(g), h = (f) => {
        const g = d.get(f);
        g && (g.borderStyle = "dashed", g.borderColor = Tr, g.borderWidth = 2, Oe.add(ie(f)));
      };
      for (const f of i.cards) u(f, t.cards.find((g) => g.id === f.id)) || h(X.card(f.id));
      for (const f of i.lanes) u(f, t.lanes.find((g) => g.id === f.id)) || h(X.lane(f.id));
    }
    for (const u of a) {
      u.options.id = ie(u.options.id);
      for (const h of u.relationships.associations)
        h.parentId = ie(h.parentId), h.childId = ie(h.childId);
    }
    return a;
  }
  function Ft() {
    return N || r ? t.lanes.map((i) => t.cards.filter((a) => a.laneId === i.id).length) : void 0;
  }
  function z(i, a = {}) {
    if (y) return;
    Le = a.layout ?? J, Z = { model: i, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = jt(i), c = [];
    for (const { options: u } of d) {
      const h = u.id;
      if (k.has(h)) continue;
      const f = L.get(h);
      L.delete(h);
      const g = f && a.animate !== !1 && !et() ? { ...u, xPos: f.x, yPos: f.y } : u, O = e.nodes.add(Ir(g));
      k.set(h, O), v.set(h, { ...g }), O.ready && c.push(O.ready.then(() => {
        if (k.get(h) !== O) return;
        O.applyGovernance?.(), de(h)?.kind === "column" && O.toBack?.(!1), de(h)?.kind === "handle" && O.svgGroup?.front?.();
        const T = Ut(Z?.model ?? i, h);
        T && O.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const w = Z;
    j = Promise.all([j, ...c]).then(() => {
      y || Z !== w || rr(jt(w.model), w);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function rr(i, a) {
    const d = new Set(i.map((w) => w.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, h] of [...k]) {
        if (d.has(u)) continue;
        for (const [g, O] of [...A])
          O.parentId !== u && O.childId !== u || (O.parent.relationships?.removeAssociation(g), A.delete(g));
        e.deselectNode?.(h), h.editor?.cancelInline?.(), k.delete(u), v.delete(u);
        const f = D.get(u);
        f && (D.delete(u), R.delete(f)), e.nodes.remove(u);
      }
      for (const { options: u } of i) {
        const h = u.id, f = k.get(h);
        if (!f?.svgGroup) continue;
        const g = v.get(h) ?? {}, O = f.editor?.isInlineEditing?.();
        (u.fontSize !== g.fontSize || u.foregroundColor !== g.foregroundColor) && (f.options.fontSize = u.fontSize, f.options.fontColor = u.foregroundColor, f.applyTextStyle?.()), u.text !== g.text && !O && f.setText?.(u.text), (u.width !== g.width || u.height !== g.height) && (u.vectorPath ? (f.options.width = u.width, f.options.height = u.height, f.setShape?.(f.options.shape, u.vectorPath), de(h)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(u.width, u.height)), u.backgroundColor !== g.backgroundColor && f.setColors?.(u.backgroundColor), (u.borderColor !== g.borderColor || u.borderWidth !== g.borderWidth || u.borderStyle !== g.borderStyle) && (f.options.borderColor = u.borderColor, f.options.borderWidth = u.borderWidth, f.options.borderStyle = u.borderStyle, f.applyBorder?.());
        const T = u.xPos !== g.xPos || u.yPos !== g.yPos || Math.abs((f.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - u.yPos) > 0.5;
        if (h !== (a.skip && ie(X.card(a.skip))) && h !== (a.grip && ie(a.grip)) && T) {
          const G = a.animate && !et() ? 180 : 0, U = c.includes(f) ? () => {
            !y && k.get(h) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          U && G && c.length === 1 && f.resizeRotate?.disable?.(), f.position(u.xPos, u.yPos, U, void 0, G);
        }
        const _ = Ut(a.model, h);
        _ && f.svgGroup.node.getAttribute("aria-label") !== _ && f.svgGroup.node.setAttribute("aria-label", _), Oe.has(h) ? f.svgGroup.node.setAttribute("data-workshop-proposed", "") : f.svgGroup.node.removeAttribute("data-workshop-proposed"), f.svgGroup.node.toggleAttribute?.("data-workshop-focused", Pe);
        const H = de(h);
        if (H?.kind === "column") {
          const G = he.get(H.key);
          G ? f.svgGroup.node.setAttribute("data-workshop-drop", G) : f.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        H?.kind === "handle" && f.svgGroup.front?.(), v.set(h, { ...u });
      }
      const w = /* @__PURE__ */ new Map();
      for (const u of i) for (const h of u.relationships.associations) w.set(h.id, h);
      for (const [u, h] of [...A])
        w.has(u) && k.get(h.parentId) === h.parent && k.get(h.childId) === h.child || (h.parent.relationships?.removeAssociation(u), A.delete(u));
      for (const [u, h] of w) {
        if (A.has(u)) continue;
        const f = k.get(h.parentId), g = k.get(h.childId);
        !f?.relationships || !g?.svgGroup || (f.relationships.addAssociation(g, sn(h)), A.set(u, { parentId: h.parentId, childId: h.childId, parent: f, child: g }));
      }
      Vo(a.model);
    }), Bt(a.model), e.notifyNodeChanged?.();
  }
  let Jn = null;
  function zt(i) {
    const a = de(i);
    return a ? a.kind === "card" ? a.key : l?.cardOfPart?.(t, be(i)) ?? null : null;
  }
  function Dt() {
    if (b) return l?.cardOfPart?.(t, b.name) ?? null;
    if (N) return N.cardId;
    if (hn) return hn;
    const i = y ? [] : e.getSelectedNodes?.() ?? [];
    return i.length === 1 && k.get(i[0].id) === i[0] ? zt(i[0].id) : null;
  }
  let Yn = null;
  function Ht() {
    y || !p || !Jn || Dt() !== Yn && Bt(Jn);
  }
  function Bt(i) {
    if (p) {
      Jn = i, Yn = Dt();
      const a = t.lanes.map((w) => k.get(ie(X.column(w.id)))?.svgGroup?.node).reduce((w, u) => u && (!w || w.compareDocumentPosition(u) & 4) ? u : w, null), d = e.canvas?.viewbox?.(), c = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - ee.x, y: d.y - ee.y, width: d.width, height: d.height } : null;
      p.draw(t, i === t ? null : i, {
        origin: ee,
        layout: Le,
        above: a,
        view: c,
        announce: (w) => e.announce?.(w),
        focus: Yn,
        clamp: b?.last?.clampedReason ? { name: b.name, text: b.last.clampedReason } : N?.outcome.kind === "candidate" && N.outcome.said ? { name: "card-" + N.cardId, text: N.outcome.said } : !b && M ? { name: M.name, text: M.reason } : null,
        refused: !!b?.last?.refusal || !b && !!M,
        onUnlink: (w, u) => {
          if (C || I || N || b || Qe()) return;
          const h = Ge(t, [{ kind: "unlink_tasks", card: { id: w }, waitsOn: { id: u } }]);
          "refused" in h ? e.announce?.(h.refused.reason) : yn(h.workshop, { cardId: w });
        }
      });
    }
  }
  function on(i) {
    return { x: i.x - ee.x, y: i.y - ee.y };
  }
  function ze(i) {
    return l ? l.places(i, Le) : { ...qe(i, { layout: J }), parts: [] };
  }
  function ir(i, a) {
    const d = l.places(i, Le).parts.find((c) => c.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function Gt(i, a) {
    if (!l) return Zr(i, { native: !0, origin: ee, rows: a, layout: J, style: $e }).nodes;
    const d = l.notes(i, Le, ee, $e);
    if (i.behaviour && d.length) {
      const c = d.map((f) => f.options), w = Math.min(...c.map((f) => f.xPos)), u = Math.max(...c.map((f) => f.xPos + f.width)), h = Bo(i, { x: w, y: Math.max(...c.map((f) => f.yPos + f.height)) + 16, width: Math.min(u - w, 484) }, $e);
      h && d.push(h);
    }
    return d;
  }
  function yn(i, a, d) {
    const c = l.editsBetween(t, i);
    if (!c.length) return !1;
    const w = Ge(t, c);
    return "refused" in w ? (e.announce?.(w.refused.reason), B(o.onRefuse, { ...a, laneId: w.refused.laneId, reason: w.refused.reason }), !1) : (t = w.workshop, z(t, { skip: d }), e.announce?.(w.report.edits.map((u) => u.said).join(" ")), B(o.onChange, t, { ...a, edits: c }), !0);
  }
  function Ut(i, a) {
    const d = de(a);
    if (d?.kind === "lane") {
      const c = i.lanes.find((w) => w.id === d.key);
      return c ? `${c.label}, ${Ae(i, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = i.cards.find((u) => u.id === d.key), w = c && i.lanes.find((u) => u.id === c.laneId);
      return c && w ? `${c.label || "Empty card"}, in ${w.label}${l?.cardKeys ? ". " + l.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? l?.label?.(i, be(a)) ?? null : null;
  }
  function Zn(i, a) {
    const d = Gt(i).find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function De() {
    (N || b) && e.cancelGovernedDrag?.("host"), N = null, b = null, r && (r = null, B(o.onPreview, null)), le(!1);
  }
  return {
    toCanvas(i) {
      if (y || C || Qe()) return "This workshop is view-only here.";
      if (!t.cards.some((w) => w.id === i)) return "That card is no longer on the board.";
      const a = Tn(t, i);
      if (a) return a;
      r && _e(), I && (De(), I = null, z(t), e.refreshGovernance?.());
      const { width: d } = ze(t), c = k.get(ie(X.card(i)))?.options;
      return Kn(i, { x: ee.x + d + 32, y: c?.y ?? ee.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...ee };
    },
    get layout() {
      return { ...J };
    },
    get bounds() {
      const { width: i, height: a } = ze(t);
      return { x: ee.x, y: ee.y, width: i, height: a };
    },
    get focused() {
      return Pe;
    },
    setFocused(i) {
      if (!y) {
        Pe = !!i;
        for (const a of k.values()) a.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Pe);
      }
    },
    setLayout(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = oo(i);
      l ? l.places(t, a) : qe(t, { layout: a }), JSON.stringify(a) !== JSON.stringify(J) && (De(), J = a, z(I ?? t));
    },
    whenDrawn: () => j,
    update(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = V(i);
      De(), t = a;
      const d = C;
      C = P || s(t), z(I ?? t), C !== d && e.refreshGovernance?.();
    },
    preview(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = i ? V(i) : null;
      De(), I = a, z(I ?? t), e.refreshGovernance?.();
    },
    refuse(i, a) {
      const d = t.lanes.find((c) => c.id === i);
      y || !d || (le(!1), E = { laneId: i, reason: a, timer: setTimeout(() => le(), 1500) }, Ce(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(i) {
      P = !!i;
      const a = P || s(t);
      y || C === a || (De(), C = a, z(I ?? t), e.refreshGovernance?.());
    },
    destroy() {
      y || (De(), y = !0, M && clearTimeout(M.timer), e.element?.removeEventListener?.("pointerdown", Ct, !0), Ee && clearTimeout(Ee), e.element?.ownerDocument?.removeEventListener?.("pointerup", Tt, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", St, !0), Uo?.(), p && e.element?.removeEventListener?.("pointerover", At), e.withPolicyAuthority(() => {
        for (const [i, a] of ce) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(i);
        for (const [i, a] of A) a.parent.relationships?.removeAssociation(i);
        for (const [i, a] of k)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(i) === a && e.nodes.remove(i);
      }), A.clear(), ce.clear(), k.clear(), v.clear(), R.clear(), D.clear(), Go(), p?.destroy(), fn = !1, Dn(), e.notifyNodeChanged?.());
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
function tt(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function Or(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function oo(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function Pr(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const l of n)
    o = Math.max(o, (l.options.x ?? 0) + (l.options.width ?? 0)), t = Math.min(t, l.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const Er = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function ae(e) {
  return Er.includes(e.kind) ? e.kind : void 0;
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
function Nr(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Rn(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Rn(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const yt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function at(e) {
  if (typeof e != "string" || !yt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function bo(e) {
  return e.noteId ?? e.id;
}
function kt(e) {
  const n = Rn(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function vo(e) {
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
function ke(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Io = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, _r = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function lt(e) {
  const n = fe(e), o = {}, t = (s) => {
    if (typeof s != "string" || !Io.test(s)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return s;
  }, l = (s, p, b) => {
    if (typeof s != "number" || !Number.isFinite(s) || s < p || s > b) throw new Error("A card size is out of range.");
    return s;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !_r.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = l(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = l(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function xo(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        lt({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return lt(n);
}
function dt(e) {
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
function ro(e) {
  try {
    return !!En({ link: e });
  } catch {
    return !1;
  }
}
function En(e) {
  const n = fe(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const t = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (t.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    o.text = t;
  }
  if (n.image !== void 0) {
    const t = fe(n.image);
    if (!dt(t.src)) throw new Error("A card keeps a picture by its web address only.");
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
const Je = 96, Rr = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Mr = ["solid", "dashed", "dotted"], Wr = 1e7;
function Ye(e) {
  const n = fe(e);
  if (typeof n.id != "string" || !Rr.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: at(n.parentId), childId: at(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (l, s, p) => {
    const b = n[l];
    if (b != null) {
      if (typeof b != "number" || !Number.isFinite(b) || b < s || b > p) throw new Error("A line's look is out of range.");
      o[l] = b;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !Io.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Mr.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const l = fe(n.targetPoint), s = (p) => typeof p == "number" && Number.isFinite(p) && Math.abs(p) <= Wr;
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
function jr(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(Ye).map((t) => Ao(t, n)).filter((t) => t.targetPoint ? n.has(t.parentId) : n.has(t.parentId) || n.has(t.childId));
  if (Te(o.map((t) => t.id), "line ID"), o.length > Je) throw new Error(`A workshop holds up to ${Je} lines.`);
  return o;
}
function Ao(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: o, ...t } = e;
  return t;
}
function Te(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function bt({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((l) => l.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Fr(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Ke = (e) => "lane-" + e, Se = (e) => "card-" + e, Mn = (e) => "image-" + e;
function vi(e) {
  const n = Fr(e);
  return bt(e).map((o) => {
    const t = e.cards.filter((p) => p.laneId === o.id), l = n.filter((p) => p.laneId === o.id), s = [Ke(o.id)];
    return o.station?.image && s.push(Mn(o.id)), { lane: o, cards: t, signals: l, nodeIds: [...s, ...t.map((p) => Se(p.id))] };
  });
}
const Co = 5, ct = 24, ut = 3;
function V(e) {
  const n = fe(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ae(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ae(n), l = t ? ge(t) : void 0, s = { id: ke }, p = we(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Co)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const b = l?.cards ?? [ct, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > b[0]) throw new Error(b[1]);
  const I = n.lanes.map((k) => {
    const v = fe(k), A = { id: ke(v.id), label: we(v.label) };
    if (v.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (v.capacity !== void 0) {
      const R = o ? 576 : 24;
      if (typeof v.capacity != "number" || !Number.isInteger(v.capacity) || v.capacity < 1 || v.capacity > R)
        throw new Error(`Lane capacity must be a whole number from 1 to ${R}.`);
      A.capacity = v.capacity;
    }
    if (l?.readLane?.(v, A, s), v.station !== void 0) {
      const R = fe(v.station), D = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= ut)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray(R.next) || R.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const N = R.next.map(ke);
      Te(N, "onward stop"), A.station = { column: D(R.column), row: D(R.row), next: N, outcome: we(R.outcome, 160) }, R.image !== void 0 && (A.station.image = vo(R.image));
    }
    return A;
  }), P = I.map((k) => k.id);
  if (Te(P, "lane ID"), t && I.some((k) => k.station)) throw new Error("A business board has no map stations.");
  if ((o || I.some((k) => k.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (I.some((k) => k.station)) {
    if (!I.every((k) => k.station)) throw new Error("Give every station on the map a position.");
    Te(I.map((k) => k.station.column + "," + k.station.row), "map position");
    for (const k of I)
      if (k.station.next.some((v) => v === k.id || !P.includes(v))) throw new Error("Connect each stop to another station on this map.");
  }
  const C = n.cards.map((k) => {
    const v = fe(k), A = { id: ke(v.id), label: t ? we(v.label) : Nr(v.label), laneId: ke(v.laneId) };
    if (!P.includes(A.laneId)) throw new Error("Card refers to an unknown lane.");
    if (v.allowedLaneIds !== void 0) {
      if (!Array.isArray(v.allowedLaneIds) || v.allowedLaneIds.length > I.length) throw new Error("Invalid allowed lanes.");
      if (A.allowedLaneIds = v.allowedLaneIds.map(ke), Te(A.allowedLaneIds, "allowed lane"), !A.allowedLaneIds.includes(A.laneId) || !A.allowedLaneIds.every((R) => P.includes(R)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (v.look !== void 0) {
      const R = lt(v.look);
      R && (A.look = R);
    }
    if (v.asNote !== void 0) {
      const R = En(v.asNote);
      R && (A.asNote = R);
    }
    if (v.noteId !== void 0 && v.noteId !== A.id && (A.noteId = at(v.noteId)), l?.readCard(v, A, s), o) {
      if (typeof v.points != "number" || !Number.isInteger(v.points) || v.points < 1 || v.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (A.points = v.points, v.dependsOn !== void 0) {
        if (!Array.isArray(v.dependsOn) || v.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        A.dependsOn = v.dependsOn.map(ke), Te(A.dependsOn, "dependency");
      }
    }
    return A;
  });
  Te(C.map((k) => k.id), "card ID");
  const y = { version: 1, title: p, lanes: I, cards: C };
  if (n.experience !== void 0) {
    const k = fe(n.experience);
    if (k.version !== 1 || k.kind !== "customer-interviews" && k.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    y.experience = { version: 1, kind: k.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    y.signals = n.signals.map((k) => {
      const v = fe(k), A = ke(v.cardId), R = ke(v.laneId);
      if (!C.some((D) => D.id === A) || !P.includes(R))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ke(v.id),
        label: we(v.label),
        cardId: A,
        laneId: R,
        whenPresent: we(v.whenPresent, 160),
        whenAbsent: we(v.whenAbsent, 160)
      };
    }), Te(y.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !t) {
    const k = jr(n.lines, new Set(C.map((v) => v.id)));
    k.length && (y.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    y.presentationOrder = bt({ lanes: I, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (y.behaviour = me().validate(n.behaviour, { ...y, kind: n.kind })), o)
    return y.kind = "release-plan", sr(y), y;
  if (t && l) {
    y.kind = t, l.readBoard(n, y, s);
    const k = l.validate(y);
    if (k) throw new Error(k);
    return y;
  }
  for (const k of I)
    if (C.filter((v) => v.laneId === k.id).length > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return y;
}
const To = 65536;
function Ii(e) {
  const n = JSON.stringify(V(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > To) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function xi(e) {
  if (e.length > To) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return V(t);
}
function vt(e, n, o) {
  const t = ae(e);
  return t ? ge(t).planMove(e, n, o) : void 0;
}
function Nn(e, n) {
  if (ae(e)) return e.lanes.filter((t) => vt(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => _n(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((l) => l.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function ft(e, n, o) {
  const t = e.cards.find((s) => s.id === n), l = vt(e, n, o);
  if (l !== void 0) {
    if (!l) throw new Error("Move is unavailable.");
    return l;
  }
  if (t && e.kind === "release-plan") {
    const s = _n(e, t, o);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!t || !Nn(e, t).some((s) => s.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((s) => s === t ? { ...t, laneId: o } : s) };
}
function cn(e, n, o) {
  const t = So(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in me().check(e, t) ? null : t;
}
function So(e, n, o) {
  const t = e.cards.find((p) => p.id === n);
  if (!t || !e.lanes.some((p) => p.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return _n(e, t, o);
  const l = vt(e, n, o);
  if (l !== void 0) return l;
  const s = Vr(e, n, o);
  return s || (o === "prototype" && Ze(e) === "customer-interviews" ? null : Nn(e, t).some((p) => p.id === o) ? ft(e, n, o) : null);
}
function io(e, n) {
  return e.lanes.filter((o) => cn(e, n, o.id) !== null);
}
function Cn(e, n, o) {
  const t = So(e, n, o);
  if (t !== null) {
    const y = t === e || !e.behaviour ? null : me().check(e, t);
    return y && "refused" in y ? y.refused.sentence : null;
  }
  const l = e.cards.find((y) => y.id === n), s = e.lanes.find((y) => y.id === o);
  if (!l || !s) return "That move is not available.";
  const p = ae(e), b = p && ge(p).refusal;
  if (b) return b(e, n, o);
  const I = `This card can't go in ${s.label}.`;
  if (l.allowedLaneIds && !l.allowedLaneIds.includes(o)) return I;
  if (e.kind === "release-plan") {
    if (s.capacity === void 0) return I;
    const y = je(e, o), k = { ...e, lanes: e.lanes.map((A) => A === s ? { id: s.id, label: s.label } : A) }, v = _n(k, l, o);
    return v ? `Needs ${je(v, o) - y} points. It already holds ${y} of ${s.capacity} points.` : I;
  }
  const P = e.lanes.find((y) => y.id === l.laneId);
  if (P?.station && !P.station.next.includes(o)) return `${s.label} can't be reached from ${P.label}.`;
  const C = e.cards.filter((y) => y.laneId === o).length;
  return s.capacity !== void 0 && C >= s.capacity ? `It already holds ${C} of ${s.capacity} ${s.capacity === 1 ? "card" : "cards"}.` : I;
}
function ln(e) {
  return (!e.kind || !!ae(e)) && !e.lanes.some((n) => n.station) && !Ze(e);
}
const zr = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function It(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && zr.test(n) && !o.has(n) ? n : Fn(e, "card");
}
function Ue(e, n, o) {
  const t = e.lanes.find((s) => s.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((s) => s.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Ze(e)) return "This workshop keeps the cards it came with.";
  if (ae(e)) {
    if (!(typeof o?.label == "string" && Rn(o.label))) return "A card needs some words. Type on the note first.";
    if (Array.isArray(o.lines) ? o.lines.length : o.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const s = Eo(e, n, o);
    return typeof s == "string" ? s : so(e, s);
  }
  if (e.cards.length >= ct) return `This board is at its size limit of ${ct} cards. Remove a card to make room.`;
  const l = e.cards.filter((s) => s.laneId === n).length;
  if (t.capacity !== void 0 && l >= t.capacity) return `It already holds ${l} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const s = Oo(o.lines);
    if (!s) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((b) => b.id));
    if ((e.lines?.length ?? 0) + s.filter((b) => !p.has(b.id)).length > Je)
      return `A workshop holds up to ${Je} lines.`;
  }
  return so(e, { ...e, cards: [...e.cards, { id: It(e, o.id), label: kt(typeof o.label == "string" ? o.label : ""), laneId: n }] });
}
function so(e, n) {
  if (!e.behaviour) return null;
  const o = me().check(e, n);
  return "refused" in o ? o.refused.sentence : null;
}
function Lo(e) {
  try {
    return e && typeof e == "object" ? xo(e) : void 0;
  } catch {
    return;
  }
}
function $o(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      En({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? En(n) : void 0;
}
function Oo(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let l = null;
    try {
      l = Ye(t);
    } catch {
      const s = (b) => {
        const { id: I, parentId: P, childId: C, targetPoint: y } = fe(t);
        return Ye({ id: I, parentId: P, childId: C, ...b ? { targetPoint: y } : {} });
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
function Wn(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function Be(e, n, o) {
  return e && e.map((t) => Wn(t, n, o));
}
function Po(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function an(e, n, o, t) {
  if (Ue(e, n, o) !== null) return null;
  if (ae(e)) {
    const v = Eo(e, n, o), A = v.cards[v.cards.length - 1], R = t === void 0 ? -1 : e.cards.findIndex((D) => D.id === t && D.laneId === n);
    return R < 0 ? v : { ...v, cards: [...e.cards.slice(0, R), A, ...e.cards.slice(R)] };
  }
  const l = Lo(o.look), s = typeof o.label == "string" ? Rn(o.label) : "";
  let p = $o(o.asNote);
  s.length > 80 && p?.text === void 0 && s.length <= 4e3 && (p = { ...p, text: s });
  const b = It(e, o.id), I = b !== o.id && typeof o.id == "string" && yt.test(o.id) ? o.id : void 0, P = {
    id: b,
    label: kt(s),
    laneId: n,
    ...l ? { look: l } : {},
    ...p ? { asNote: p } : {},
    ...I ? { noteId: I } : {}
  }, C = t === void 0 ? -1 : e.cards.findIndex((v) => v.id === t && v.laneId === n), y = C < 0 ? [...e.cards, P] : [...e.cards.slice(0, C), P, ...e.cards.slice(C)], k = o.lines === void 0 ? void 0 : Po(e, Oo(o.lines).map((v) => Wn(v, o.id, P.id)));
  return V({ ...e, cards: y, ...k ? { lines: k } : {} });
}
function Eo(e, n, o) {
  const t = ge(ae(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const l = Ge(e, [{ kind: "add_card", lane: { id: n }, ...t, ...o.under && { under: { id: o.under } } }]);
  if ("refused" in l) return l.refused.reason;
  const s = l.workshop.cards, p = It(e, o.id), b = p !== o.id && typeof o.id == "string" && yt.test(o.id) ? o.id : void 0, I = Lo(o.look), P = $o(o.asNote);
  return s[s.length - 1] = {
    ...s[s.length - 1],
    id: p,
    ...b ? { noteId: b } : {},
    ...I ? { look: I } : {},
    ...P ? { asNote: P } : {}
  }, l.workshop;
}
function No(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = ae(e);
  return o ? ge(o).cardText(e, n) : n.label;
}
function Dr(e, n) {
  const o = ae(e);
  return o ? ge(o).noteText(e, n) : n.label;
}
function Tn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!ln(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (e.cards.some((t) => t.parentId === n)) return `${o.label} has cards under it, so it stays a card. Move them first.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((s) => e.lanes.find((p) => p.id === s).label), l = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${l}, so it stays a card.`;
  }
  return null;
}
function ao(e, n, o = _o(e, n)) {
  if (Tn(e, n) !== null) return null;
  const t = e.cards.filter((s) => s.id !== n).map((s) => {
    if (!s.dependsOn?.includes(n)) return s;
    const p = { ...s, dependsOn: s.dependsOn.filter((b) => b !== n) };
    return p.dependsOn.length || delete p.dependsOn, p;
  }), l = e.lines?.map((s) => Wn(s, n, o));
  return V({ ...e, cards: t, ...l ? { lines: l } : {} });
}
function Hr(e, n, o = _o(e, n)) {
  const t = new Set(e.cards.filter((p) => p.id !== n).map((p) => p.id)), l = (e.lines ?? []).filter((p) => p.parentId === n || p.childId === n).map((p) => Wn(p, n, o)), s = (p) => t.has(p.parentId) || t.has(p.childId);
  return { stay: l.filter(s), leave: l.filter((p) => !s(p)) };
}
function _o(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? bo(o) : n;
}
function lo(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function un(e, n) {
  if (e.kind) return Br;
  let o;
  try {
    o = Ye(n);
  } catch (s) {
    return s instanceof Error ? s.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((s) => s.id));
  return o = Ao(o, t), (o.targetPoint ? !t.has(o.parentId) : !t.has(o.parentId) && !t.has(o.childId)) ? "That card is no longer on the board." : e.lanes.some((s) => s.id === o.parentId || s.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((s) => s.id === o.id) && (e.lines?.length ?? 0) >= Je ? `A workshop holds up to ${Je} lines.` : null;
}
const Br = "Lines join the cards of a lane workshop to notes and to each other.";
function Sn(e, n) {
  return un(e, n) !== null ? null : V({ ...e, lines: Po(e, [Ye(n)]) });
}
function co(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? V({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function Ro(e, n, o, t = {}) {
  const l = new Set((e.lines ?? []).map((p) => p.id));
  let s = `${n}->${o}`;
  for (let p = 2; l.has(s); p++) s = `${n}->${o}~${p}`;
  return Ye({ showChildArrow: !0, ...t, id: s, parentId: n, childId: o });
}
function Gr(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function Ae(e, n) {
  const o = e.lanes.find((b) => b.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const b = je(e, n);
    return o.capacity ? b + " / " + o.capacity + " points" : b + " points";
  }
  const t = ae(e);
  if (t) return ge(t).caption(e, n);
  const l = Qr(e, n);
  if (l) return "$" + l.amount + " · " + l.description;
  const s = e.cards.filter((b) => b.laneId === n).length, p = e.behaviour ? me().laneLimit(e, n) : o.capacity;
  return p !== void 0 ? s + " of " + p : s + (s === 1 ? " card" : " cards");
}
const jn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Ln = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Mo(e, n = jn, o = 28, t) {
  const { pitch: l, row: s, top: p } = n, b = !!e.lanes[0].station, I = e.lanes.map((y) => e.cards.filter((k) => k.laneId === y.id).length), P = p + Math.max(1, ...t ?? I) * s + 36, C = e.lanes.map((y, k) => ({
    x: b ? y.station.column * (l + o) : k * l,
    y: b ? y.station.row * P : 0
  }));
  return {
    points: C,
    width: Math.max(...C.map((y) => y.x)) + l,
    height: Math.max(...C.map((y, k) => y.y + p + (b ? Math.max(1, I[k]) : I[k] + 1) * s))
  };
}
function Ai() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Fn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((l) => l.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Wo(e) {
  const n = V(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Ur(e, n) {
  const o = Wo(e), t = Fn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), V(o);
}
function qr(e, n, o) {
  const t = Wo(e);
  return t.cards.push({
    id: Fn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), V(t);
}
function Ci() {
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
function uo(e, n, o) {
  const t = V(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const l = t.lanes.find((C) => C.id === n);
  if (!l?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= Co) throw new Error("A map can have up to five stations.");
  const s = we(o?.label), p = we(o?.outcome, 160), b = Fn(t, "station");
  let I, P = 1 / 0;
  for (let C = 0; C < ut; C++)
    for (let y = 0; y < ut; y++) {
      if (t.lanes.some((v) => v.station.column === y && v.station.row === C)) continue;
      const k = Math.abs(l.station.column - y) + Math.abs(l.station.row - C);
      k < P && (P = k, I = { column: y, row: C });
    }
  if (!I) throw new Error("There is no free station position.");
  return l.station.next.push(b), t.lanes.push({ id: b, label: s, station: { ...I, next: [], outcome: p, ...o.image === void 0 ? {} : { image: vo(o.image) } } }), t.presentationOrder?.push(b), t;
}
const Ti = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, jo = (e) => "caption-" + e, dn = (e) => "column-" + e, Kr = "rules-board", X = { lane: Ke, card: Se, image: Mn, caption: jo, column: dn, rules: Kr };
function Fo(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function ot(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), l = e, s = n;
  return t ? `M ${t} 0 H ${l - t} Q ${l} 0 ${l} ${t} V ${s - t} Q ${l} ${s} ${l - t} ${s} H ${t} Q 0 ${s} 0 ${s - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${l} V ${s} H 0 Z`;
}
function fo(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ho(e, n, o, t) {
  for (let l = n; l > 11; l--) {
    const s = Math.max(1, Math.floor(o / (l * 0.55)));
    if (e.split(`
`).reduce((b, I) => b + Math.max(1, Math.ceil(I.length / s)), 0) * l * 1.3 <= t) return l;
  }
  return Math.min(n, 11);
}
const zo = 152, ht = zo + 12, Jr = 12;
function Do(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function qe(e, n = {}) {
  const o = V(e), { pitch: t, row: l, top: s } = jn, p = o.lanes.map((k) => o.cards.filter((v) => v.laneId === k.id).length), b = (k) => Math.max(p[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), I = !!o.lanes[0].station, P = o.lanes.some((k) => k.station?.image), C = Do(n.layout, o.lanes.length), y = [];
  if (I) {
    const { points: k } = Mo(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((v, A) => y.push({
      laneId: v.id,
      x: k[A].x,
      y: k[A].y + (P ? v.station.row * ht : 0),
      width: t,
      height: s + (v.station.image ? ht : 0) + Math.max(1, b(A)) * l,
      column: v.station.column,
      row: v.station.row
    }));
  } else {
    let k = Ho(o, C)?.below ?? 0;
    for (let v = 0; v < o.lanes.length; v += C) {
      const A = o.lanes.slice(v, v + C), R = s + (Math.max(...A.map((D, N) => b(v + N))) + 1) * l;
      A.forEach((D, N) => y.push({ laneId: D.id, x: N * t, y: k, width: t, height: R, column: N, row: v / C })), k += R + Jr;
    }
  }
  return { places: y, width: Math.max(...y.map((k) => k.x + k.width)), height: Math.max(...y.map((k) => k.y + k.height)) };
}
function Ho(e, n, o = 2, t = 0) {
  const l = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? me().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return l ? { note: l, below: l.options.height + 16 } : null;
}
function Yr(e, n) {
  const { pitch: o, width: t, row: l, height: s, top: p } = jn, b = n.origin ?? { x: 0, y: 0 }, I = !!e.lanes[0].station, { places: P } = qe(e, n), C = n.style ?? {}, y = C.textColor ?? rn.fontColor, k = C.borderColor ?? rn.borderColor, v = C.borderWidth ?? rn.borderWidth, A = C.cornerRadius ?? 0, R = C.fontSize ?? rn.fontSize, D = C.laneFontSize ?? R + 2, N = C.captionFontSize ?? Math.max(11, R - 1), r = [], m = (L) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: ot(L.width, L.height, A),
      foregroundColor: y,
      borderColor: k,
      borderWidth: v,
      ...C.fontFamily ? { fontFamily: C.fontFamily } : {},
      ...L
    }, relationships: { associations: [] } };
    return r.push(E), E;
  };
  e.lanes.forEach((L, E) => {
    const M = P[E], K = b.x + M.x, j = b.y + M.y, Z = L.station?.image;
    m({
      id: dn(L.id),
      text: "",
      name: L.label,
      xPos: K + 2,
      yPos: j,
      width: o - 4,
      height: M.height,
      vectorPath: ot(o - 4, M.height, A ? A + 2 : 0),
      backgroundColor: I ? "#fcf9ed" : fo(Ln[E], 0.6),
      borderColor: I ? "#a8b5aa" : fo(Ln[E], 0.1),
      borderWidth: 1,
      ...I ? { borderStyle: "dashed" } : {}
    }), m({
      id: Ke(L.id),
      text: L.label,
      name: L.label,
      xPos: K + 8,
      yPos: j + 6,
      width: t,
      height: 58,
      backgroundColor: Ln[E],
      fontSize: ho(L.label, D, t - 16, 50)
    }), m({
      id: jo(L.id),
      text: Ae(e, L.id),
      name: L.label,
      xPos: K + 8,
      yPos: j + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: N
    }), Z && r.push({ options: {
      id: Mn(L.id),
      name: Z.alt,
      text: "",
      xPos: K + 8,
      yPos: j + p,
      width: t,
      height: zo,
      shapeHint: "rectangle",
      image: Z.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((J) => J.laneId === L.id).forEach((J, Le) => {
      const $e = No(e, J), he = I ? t - 20 : t, Oe = I ? s - 6 : s, pe = I ? {} : { ...C.card, ...J.look }, Pe = I ? A : C.card?.cornerRadius ?? A;
      m({
        id: Se(J.id),
        text: $e,
        name: J.label,
        xPos: K + (I ? 18 : 8),
        yPos: j + p + (Z ? ht : 0) + Le * l,
        width: he,
        height: Oe,
        ...Pe !== A ? { vectorPath: ot(he, Oe, Pe) } : {},
        backgroundColor: I ? "#ffda75" : pe.backgroundColor ?? C.backgroundColor ?? rn.backgroundColor,
        ...pe.textColor ? { foregroundColor: pe.textColor } : {},
        ...pe.fontFamily ? { fontFamily: pe.fontFamily } : {},
        ...pe.borderColor ? { borderColor: pe.borderColor } : {},
        ...pe.borderWidth !== void 0 ? { borderWidth: pe.borderWidth } : {},
        fontSize: ho($e, pe.fontSize ?? R, he - 16, Oe - 8)
      });
    });
  });
  const x = Ho(e, Do(n.layout, e.lanes.length), b.x + 2, b.y)?.note ?? Bo(e, {
    x: b.x,
    y: b.y + Math.max(...P.map((L) => L.y + L.height)) + 16,
    width: Math.min(Math.max(...P.map((L) => L.x + L.width)), o * 2) - 4
  }, C);
  x && r.push(x);
  const S = new Map(r.map((L) => [L.options.id, L]));
  for (const L of e.lanes)
    L.station && (S.get(dn(L.id)).relationships.associations = L.station.next.map((E) => ({
      id: L.id + "-to-" + E,
      parentId: dn(L.id),
      childId: dn(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const L of e.cards)
      for (const E of L.dependsOn ?? []) {
        const M = Se(E), K = Se(L.id);
        S.get(M).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${L.id}`,
          parentId: M,
          childId: K,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const L = new Set(n.beside), E = new Set(r.map((j) => j.options.id)), M = /* @__PURE__ */ new Map();
    for (const j of [...E]) {
      if (!L.has(j)) continue;
      const Z = Fo(j, (J) => L.has(J) || E.has(J));
      E.add(Z), M.set(j, Z);
    }
    const K = (j) => M.get(j) ?? j;
    for (const j of r) {
      j.options.id = K(j.options.id);
      for (const Z of j.relationships.associations)
        Z.parentId = K(Z.parentId), Z.childId = K(Z.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
function Bo(e, n, o = {}) {
  return e.behaviour ? me().note(e, n, o) : null;
}
function Zr(e, n) {
  const o = V(e);
  if (n?.native) return Yr(o, n);
  const { width: t, row: l, height: s, top: p } = jn, b = [];
  function I(v, A, R, D, N, r) {
    b.push({ options: {
      id: v,
      text: A,
      name: A,
      xPos: R,
      yPos: D,
      width: t,
      height: N,
      shapeHint: "rectangle",
      backgroundColor: r,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: P } = Mo(o), C = 152, y = C + 12, k = o.lanes.some((v) => v.station?.image);
  o.lanes.forEach((v, A) => {
    const R = P[A].x, D = P[A].y + (k ? (v.station?.row ?? 0) * y : 0), N = v.station?.image, r = o.kind === "release-plan" ? v.label + `
` + (v.capacity ? je(o, v.id) + " / " + v.capacity + " points" : je(o, v.id) + " points") : v.label;
    I(Ke(v.id), r, R, D, p - 12, Ln[A]), N && b.push({ options: {
      id: Mn(v.id),
      name: N.alt,
      text: "",
      xPos: R,
      yPos: D + p,
      width: t,
      height: C,
      shapeHint: "rectangle",
      image: N.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((m) => m.laneId === v.id).forEach((m, x) => I(Se(m.id), No(o, m), R, D + p + (N ? y : 0) + x * l, s, "#fffdf6"));
  });
  for (const v of o.lanes) {
    if (!v.station) continue;
    const A = b.find((R) => R.options.id === Ke(v.id));
    A.relationships.associations = v.station.next.map((R) => ({ id: v.id + "-to-" + R, parentId: A.options.id, childId: Ke(R), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), A.options.text = v.label + `
` + v.station.outcome, A.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const v = new Map(b.map((A) => [A.options.id, A]));
    for (const A of o.cards)
      for (const R of A.dependsOn ?? []) {
        const D = Se(R), N = Se(A.id);
        v.get(D).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${A.id}`,
          parentId: D,
          childId: N,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: b };
}
const Si = {
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
}, pt = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], xt = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Li() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: pt.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: pt.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function $i() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...xt.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Ze(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...xt.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => pt.some((l) => l.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Vr(e, n, o) {
  const t = Ze(e), l = e.cards.find((p) => p.id === n);
  if (!t || !l || l.laneId === o) return null;
  let s = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const p = e.cards.find((b) => b.laneId === o);
    if (p) {
      if (!Nn(e, p).some((b) => b.id === "interviews")) return null;
      s = ft(e, p.id, "interviews");
    }
  }
  return Nn(s, l).some((p) => p.id === o) ? ft(s, n, o) : null;
}
function Qr(e, n) {
  if (Ze(e) !== "experiment-budget") return null;
  const o = xt.find((s) => s.id === n), t = e.cards.filter((s) => s.laneId === n).length, l = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? l + " " + (l === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  rn as DEFAULT_NOTE_STYLE,
  mo as WORKSHOP_BOARD_KINDS,
  An as WorkshopReferenceError,
  uo as addWorkshopBranch,
  qr as addWorkshopCard,
  Ur as addWorkshopLane,
  Ge as applyWorkshopEdits,
  bi as attachWorkshop,
  Nn as availableLanes,
  Bo as behaviourNote,
  Er as businessBoardKinds,
  ae as businessKind,
  vr as canHangPanel,
  xt as channels,
  br as checkWorkshopReplacement,
  dr as countWord,
  $i as createBudgetWorkshop,
  Li as createInterviewWorkshop,
  Ai as createLaneWorkshop,
  Ci as createWorkshopMap,
  xi as decodeWorkshopFragment,
  ki as describeFocusDarkroom,
  hi as describeWorkshopEdits,
  Ii as encodeWorkshopFragment,
  ri as handoffSummary,
  wi as hangGalleryPanel,
  Si as industrialWorkshop,
  yi as initialFocusDarkroom,
  pt as interviews,
  fr as isRuleEdit,
  Ln as laneColors,
  We as listed,
  bn as listeningRoom,
  si as listeningRoomCaption,
  ct as maxWorkshopCards,
  Je as maxWorkshopLines,
  pi as moonGallery,
  ft as moveWorkshopCard,
  fi as named,
  Ti as nightTransfer,
  gi as normalizeFocusDarkroom,
  ii as normalizeListeningRoom,
  mi as normalizeMoonGallery,
  ni as normalizeOfflineHandoff,
  ei as offlineHandoff,
  Vr as planStartupMove,
  cr as pointing,
  yo as printFields,
  ci as registerRulebook,
  li as registerWorkshopRules,
  je as releaseLoad,
  ai as releasePlan,
  oi as resolveHandoff,
  Fr as resolveWorkshopSignals,
  ti as reviewHandoff,
  ot as roundedBox,
  me as rulebook,
  ui as rulebookLoaded,
  $ as said,
  Ze as startupExperienceKind,
  wt as unquoted,
  V as validateWorkshop,
  On as workshopBoardKind,
  Qr as workshopBudgetResult,
  cn as workshopCandidate,
  ao as workshopCardAsNote,
  Tn as workshopCardAsNoteRefusal,
  kt as workshopCardLabelOf,
  Hr as workshopCardLines,
  xo as workshopCardLookOf,
  Dr as workshopCardNoteText,
  No as workshopCardText,
  io as workshopDestinations,
  st as workshopEditKinds,
  rt as workshopFinder,
  ro as workshopKeepsLink,
  dt as workshopKeepsPicture,
  Ae as workshopLaneCaption,
  qe as workshopLanePlaces,
  jn as workshopLayout,
  un as workshopLineRefusal,
  lo as workshopLinesOf,
  Br as workshopLinesSentence,
  Ro as workshopNewLine,
  X as workshopNodeIds,
  an as workshopNoteCandidate,
  bo as workshopNoteIdOf,
  Ue as workshopNoteRefusal,
  Mo as workshopPositions,
  bt as workshopPresentationLanes,
  vi as workshopPresentationScenes,
  mr as workshopReferences,
  Cn as workshopRefusal,
  Be as workshopRenamedLines,
  Qt as workshopRuleSchema,
  ge as workshopRules,
  di as workshopRulesLoaded,
  Fo as workshopStandInId,
  ln as workshopTakesNotes,
  Zr as workshopToSlate,
  Sn as workshopWithLine,
  Gr as workshopWithoutCardLines,
  co as workshopWithoutLine
};
