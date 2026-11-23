import { D as wn } from "./NoteDefaults-1xFW0br8.mjs";
const js = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Fs(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: i, fieldNote: r, deskNote: c, fallback: w } = e, m = (T) => typeof T == "string" && T.trim().length > 0 && T.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(T);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? i !== "field" && i !== "desk" : i !== null) || i === void 0 || !m(r) || !m(c) || !m(w) ? null : { kind: n, version: o, stage: t, choice: i, fieldNote: r.trim(), deskNote: c.trim(), fallback: w.trim() };
}
function zs(e) {
  return { ...e, stage: "review", choice: null };
}
function Ds(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Bs(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const jn = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Hs(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: i, rightLabel: r } = e, c = (w) => typeof w == "string" && w.trim().length > 0 && w.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(w);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !c(i) || !c(r) ? null : { kind: n, version: o, mix: t, leftLabel: i.trim(), rightLabel: r.trim() };
}
function Gs({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === jn.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === jn.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === jn.leftLabel && o === jn.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function He(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function Rr(e) {
  const n = new Map(e.cards.map((c) => [c.id, c])), o = new Map(e.lanes.map((c, w) => [c.id, w])), t = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  function r(c) {
    if (!t.has(c.id)) {
      if (i.has(c.id)) throw new Error("Release dependencies must be acyclic.");
      i.add(c.id);
      for (const w of c.dependsOn ?? []) {
        const m = n.get(w);
        if (!m) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(m.laneId) > o.get(c.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        r(m);
      }
      i.delete(c.id), t.add(c.id);
    }
  }
  for (const c of e.cards) r(c);
  for (const c of e.lanes) {
    if (c.station) throw new Error("Release windows cannot also be map stations.");
    if (He(e, c.id) > (c.capacity ?? 1 / 0)) throw new Error(`Release "${c.label}" exceeds its point budget.`);
  }
}
function Cn(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((A, v) => [A.id, v])), i = t.get(o);
  if (i === void 0) return null;
  const r = i < t.get(n.laneId), c = /* @__PURE__ */ new Set([n.id]), w = [n];
  for (; w.length; ) {
    const A = w.pop();
    for (const v of e.cards) {
      if (c.has(v.id)) continue;
      const k = t.get(v.laneId);
      (r ? k > i && A.dependsOn?.includes(v.id) : k < i && v.dependsOn?.includes(A.id)) && (c.add(v.id), w.push(v));
    }
  }
  if (e.cards.filter((A) => c.has(A.id)).some((A) => A.allowedLaneIds && !A.allowedLaneIds.includes(o))) return null;
  const T = { ...e, cards: e.cards.map((A) => c.has(A.id) ? { ...A, laneId: o } : A) }, I = e.lanes[i].capacity;
  return I !== void 0 && He(T, o) > I ? null : T;
}
const Us = {
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
}, _t = /* @__PURE__ */ new Map(), Wr = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function qs(e) {
  _t.set(e.kind, e);
}
function Ks(e) {
  return typeof e == "string" && _t.has(e);
}
function be(e) {
  const n = _t.get(e);
  if (!n) throw new Error(`The ${Wr[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let Kn = null;
function Js(e) {
  Kn = e;
}
function Ys() {
  return Kn !== null;
}
function ge() {
  if (!Kn) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return Kn;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Be = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], ho = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Mt = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Rt = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Zs = (e) => Mt(Rt(e)), jr = [
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
], Fr = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : jr.indexOf(e.toLowerCase()), zr = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function _o(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (i) => {
    const r = Mt(i);
    r && o.add(r);
  };
  t(e), t(Rt(e));
  for (const i of [...o]) t(i.replace(/^(?:the|my|our)\s+/i, ""));
  for (const i of [...o]) t(i.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const i of [...o]) t(i.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const ft = "[^\\p{L}\\p{N}]", po = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + ho(n) + "(?:$|" + ft + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + ft + ")" + ho(n) + "(?:$|" + ft + ")", "u").test(e)
], mo = ["first", "second", "third", "fourth", "fifth"];
function Dr(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + mo.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Mt(Rt(n)));
  if (!t) return null;
  const i = (t[1] ?? t[2]).toLowerCase(), r = i === "last" ? e.length - 1 : t[1] ? mo.indexOf(i) : Fr(i) - 1;
  return e[r] ?? null;
}
function ht(e, n, o, t, i) {
  const r = _o(n, o);
  if (r.some((w) => zr.test(w))) {
    const w = t && e.find((m) => m.id === t);
    return w ? { item: w, rank: 0 } : { pointing: !0 };
  }
  for (const w of r) {
    if (!w.startsWith("@")) continue;
    const m = e.find((T) => T.id === w.slice(1));
    if (m) return { item: m, rank: 0 };
  }
  for (const [w, m] of po.entries())
    for (const T of r) {
      const I = e.filter((A) => m(A.label.toLowerCase(), T.toLowerCase()));
      if (I.length === 1) return { item: I[0], rank: w };
      if (I.length > 1) return { several: I };
    }
  const c = i ? Dr(e, n, o) : null;
  return c ? { item: c, rank: po.length } : {};
}
class Bn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function vt(e, n, o, t, i = !1) {
  return { find: (m) => {
    const T = ht(e, m, n, t, i);
    if (T.item) return T.item;
    const I = _o(m, n), A = I[I.length - 1];
    if (T.pointing) throw new Bn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (T.several) {
      const k = [...new Set(T.several.map((b) => b.label))];
      throw new Bn(k.length === 1 ? T.several.length + " " + o + "s are called " + P(k[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + P(A) + ": " + Be(k.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", T.several.map((b) => b.id));
    }
    const v = e.map((k) => k.label);
    throw new Bn("There is no " + o + " called " + P(A) + " here." + (v.length && v.length <= 6 ? " The " + o + "s are " + Be(v.map(P)) + "." : v.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((k) => k.id));
  }, attempt: (m) => ht(e, m, n, t, i).item ?? null, rank: (m) => ht(e, m, n, t, i).rank ?? 1 / 0 };
}
const Mo = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Le = [...Mo], Qe = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Ro = Mo.slice(5);
function Jn(e) {
  if (e.lanes[0]?.station) return "map";
  const n = de(e);
  return n || (e.kind === "release-plan" ? "release-plan" : Ue(e) ?? "lanes");
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
}, xt = {
  "launch-plan": W.launchLanes,
  pipeline: W.pipelineLanes,
  budget: W.budgetLanes,
  "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, ae = (e, n) => Object.fromEntries(Le.filter((o) => !e.includes(o)).map((o) => [o, n])), re = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), X = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ne = (e) => ({ type: "ref", of: "card", about: e }), pt = (e) => ({ map: e }), Te = ae(["map"], W.notMap), ve = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), It = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: re(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: X("The lane or step."), label: re(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ne("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Le,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: re(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...xt }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: X("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...xt }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: X("The lane or step it starts in."),
      label: re(80, "What the card says. Left out, the card is empty (on a map, the token is numbered); a launch plan, pipeline, budget, hiring plan or nest board needs it.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: ve("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: ve("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: ve("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...Ro],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ne("The card or token.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: ne("The card or token."), lane: X("Where it goes.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ne("The token.") },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: X("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Le.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": W.launchLanes, budget: W.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ne("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: Qe,
    refusals: { ...pt(W.mapCardLanes), ...ae([...Qe, "map"], W.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ne("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...ae(["release-plan"], W.notPoints), map: W.mapPoints }
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
    refusals: { ...ae(["release-plan"], W.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ne("The card."),
      lane: X("The lane."),
      whenPresent: re(160, "What it says when the card is there."),
      whenAbsent: re(160, "What it says otherwise."),
      label: re(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: Qe,
    refusals: { ...pt(W.mapOutcome), ...ae([...Qe, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ne("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: Qe,
    refusals: { ...pt(W.mapOutcome), ...ae([...Qe, "map"], W.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: Le,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: X("The lane or step."), before: X("Present it just before this one.", !0), after: X("Present it just after this one.", !0) },
    boards: Le,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: X("The step it follows."), label: re(80, "The new step’s name."), outcome: re(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: X("The step it goes in front of."),
      from: X("Only the path from this step is taken over.", !0),
      label: re(80, "The new step’s name."),
      outcome: re(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: X("Where the path starts."), to: X("Where it leads.") },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: X("Where the path starts."), to: X("Where it leads.") },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: X("The step."), outcome: re(160, "What it says.") },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: X("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: X("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: X("The step."), alt: re(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Te
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: ne("The card the line starts at."), to: ne("The card it points to."), label: re(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: Fn()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: ne("One card."), to: ne("The other card.") },
    boards: ["lanes"],
    refusals: Fn()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: ne("The card."),
      note: re(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: re(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: Fn()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: ne("The card."), note: re(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: Fn()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: ne("The task."), duration: ve("Its days, 1 to 60.", 60, 1, !0), lag: ve("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ne("The task that waits."), waitsOn: ne("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ne("The task that waits."), waitsOn: ne("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: ve("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ne("The deal or line item."), amount: ve("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: ae(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: ve("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: ae(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: X("The team giving."), to: X("The team receiving."), amount: ve("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: ae(["budget"], W.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: ve("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: ae(["budget"], W.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: ae(["lanes", "pipeline"], W.noRules)
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
    refusals: ae(["lanes", "pipeline"], W.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: re(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: ae(["lanes", "pipeline"], W.noRules) }
];
function Fn() {
  return { ...ae(["lanes"], W.businessLines), "release-plan": W.lines, "customer-interviews": W.lines, "experiment-budget": W.lines, map: W.lines };
}
const Br = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", wo = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, Hr = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function Gr(e, n) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, t = (i, r) => r ? { anyOf: [i, { type: "null" }] } : i;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: e.min ?? 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...t({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...t({ type: "integer", minimum: e.min, maximum: Hr(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: wo.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: o,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: o,
        to: { type: "array", items: o, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: o,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: o,
        ...wo.keys
      }, description: e.about };
  }
}
const Wo = (e) => "optional" in e && e.optional === !0;
function Vs(e) {
  const n = e ? Jn(Y(e)) : void 0;
  return It.map((o) => {
    const t = Object.entries(o.fields), i = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, c]) => !Wo(c)).map(([c]) => c)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([c, w]) => [c, Gr(w, n)])) }
    }, r = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: i };
    return n && (r.accepted = o.boards.includes(n), r.accepted || (r.refusal = o.refusals[n])), r;
  });
}
const zn = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function Ur(e, n) {
  const o = !!e.lanes[0]?.station, t = vt(e.lanes, o ? zn.step : zn.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), i = vt(e.cards, o ? zn.token : zn.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: i };
  const r = e.cards.filter((w) => !w.free), c = (w) => r.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(w.trim()) ? r[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(w.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (w) => c(w) ?? i.find(w),
    attempt: (w) => c(w) ?? i.attempt(w),
    rank: (w) => c(w) ? 0 : i.rank(w)
  } };
}
class j {
  constructor(n, o, t = null, i, r, c) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = i, this.candidates = r, this.limits = c;
  }
}
function Yn(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function K(e, n, o = null, t) {
  try {
    return Y(e);
  } catch (i) {
    throw new j(Yn(i instanceof Error ? i.message : String(i), n), "refused", o, t);
  }
}
function qr(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, i] of Object.entries(n.fields)) {
    const r = e[t];
    if (r === void 0) {
      if (Wo(i)) continue;
      return n.kind + " needs " + t + ".";
    }
    const c = n.kind + " needs " + t + " as ";
    switch (i.type) {
      case "text":
        if (typeof r != "string") return c + "text.";
        break;
      case "ref":
        if (!o(r)) return c + "an id or a name.";
        break;
      case "refs":
        if (r === null && i.nullable) break;
        if (!Array.isArray(r) || r.length > i.max || !r.every(o)) return c + "a list of up to " + i.max + " ids or names" + (i.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (r === null && i.nullable) break;
        if (typeof r != "number" || !Number.isFinite(r)) return c + "a number" + (i.nullable ? " or null." : ".");
        break;
      case "image":
        if (r === null) break;
        if (!r || typeof r != "object" || typeof r.src != "string" || typeof r.alt != "string" || Object.keys(r).some((w) => w !== "src" && w !== "alt")) return c + "{src, alt} or null.";
        break;
      case "choice":
        if (!i.values.includes(r)) return c + i.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof r != "boolean") return c + "true or false.";
        break;
      case "rule":
        if (!r || typeof r != "object" || Array.isArray(r) || typeof r.kind != "string") return c + "an object with a kind.";
        break;
    }
  }
  return null;
}
function Kr(e, n, o, t, i) {
  const r = structuredClone(e), c = o === "map", w = o === "release-plan", m = Ur(r, t), T = { lane: c ? "step" : "lane", card: c ? "token" : "card" };
  function I(a, g, C, $, S = null) {
    if (typeof C == "object") {
      const D = a.find((H) => H.id === C.id);
      if (!D) throw new j("That " + $ + " is no longer on the workshop.", "gone", S);
      return D;
    }
    const M = a.find((D) => D.id === C);
    if (M) return M;
    try {
      return g.find(C);
    } catch (D) {
      if (!(D instanceof Bn)) throw D;
      const H = D.reason === "ambiguous" ? "ambiguous_reference" : D.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new j(D.message, H, S, void 0, D.candidates.length ? D.candidates : void 0);
    }
  }
  const A = (a, g = null) => I(r.lanes, m.lanes, a, "lane", g), v = (a, g = null) => I(r.cards, m.cards, a, "card", g), k = (a) => {
    try {
      return A(a);
    } catch {
      return null;
    }
  }, b = (a, g, C = {}, $ = !0) => ({ board: a, said: g, changed: $, ...C }), E = (a) => Ge(r, a), _ = (a) => c ? "The presentation opens with " + P(a[0].label) + "." : "The presentation now runs " + a.map((g) => P(g.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return ge().edit(r, n, i, {
      lane: (a) => A(a),
      card: (a) => v(a),
      done: (a, g, C) => b(a, g, C),
      refuse: (a, g = {}) => {
        throw new j(a, g.code ?? "refused", g.laneId ?? null, g.cardId);
      }
    });
  if (Ro.includes(o)) {
    n.kind === "add_card" && go(n, o, A(n.lane).id);
    const a = {
      card: (C) => v(C),
      lane: (C) => A(C),
      refuse: (C, $ = {}) => {
        throw new j(C, $.code ?? "refused", $.laneId ?? null, $.cardId, void 0, $.limits);
      },
      settle: (C, $ = null, S) => K(C, o, $, S),
      done: (C, $, S) => b(C, $, S)
    }, g = be(o).edit(r, n, a);
    if (g) return g;
  }
  switch (n.kind) {
    case "rename_workshop": {
      r.title = n.title;
      const a = K(r, o);
      return b(a, "Renamed the " + (c ? "map" : "workshop") + " to " + P(a.title) + ".");
    }
    case "rename_lane": {
      const a = A(n.lane), g = a.label;
      a.label = n.label;
      const C = K(r, o, a.id);
      return b(C, "Renamed " + P(g) + " to " + P(C.lanes.find(($) => $.id === a.id).label) + ".", { laneId: a.id });
    }
    case "rename_card": {
      const a = v(n.card), g = a.label;
      a.label = n.label;
      const C = K(r, o, a.laneId, a.id);
      return b(C, "Renamed " + P(g) + " to " + P(C.cards.find(($) => $.id === a.id).label) + ".", { laneId: a.laneId, cardId: a.id });
    }
    case "add_lane": {
      if (r.lanes.length >= 5) throw new j("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new j("A lane can hold from 1 to 24 cards.", "refused");
      let a;
      try {
        a = $s(r, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (C) {
        throw new j(Yn(C.message, o), "refused");
      }
      const g = a.lanes[a.lanes.length - 1];
      return b(a, "Added the lane " + P(g.label) + ".", { laneId: g.id });
    }
    case "remove_lane": {
      const a = A(n.lane), g = r.cards.filter((C) => C.laneId === a.id);
      if (c) {
        if (g.length) throw new j(P(g[0].label) + " is at " + P(a.label) + ". Move it to another step first.", "refused", a.id);
        if (r.lanes.length <= 2) throw new j("A map needs at least two steps.", "refused", a.id);
      } else {
        if (g.length) throw new j(P(a.label) + " holds " + g.length + (g.length === 1 ? " card" : " cards") + ". Move or remove " + (g.length === 1 ? "it" : "them") + " first.", "refused", a.id);
        if (r.lanes.length <= 2) throw new j("A workshop needs at least two lanes.", "refused", a.id);
      }
      r.lanes = r.lanes.filter((C) => C !== a);
      for (const C of r.lanes) C.station && (C.station.next = C.station.next.filter(($) => $ !== a.id));
      r.presentationOrder && (r.presentationOrder = r.presentationOrder.filter((C) => C !== a.id));
      for (const C of r.cards) C.allowedLaneIds && (C.allowedLaneIds = C.allowedLaneIds.filter(($) => $ !== a.id));
      return Dn(r, (C) => C.laneId === a.id), r.behaviour && (r.behaviour = ge().dropLane(r.behaviour, a.id)), b(K(r, o), "Removed the " + T.lane + " " + P(a.label) + ".", { laneId: a.id });
    }
    case "add_card": {
      const a = A(n.lane);
      if (c) {
        if (n.allowedLanes !== void 0) throw new j(W.mapCardLanes, "not_on_this_board", a.id);
        if (n.free) {
          if (r.cards.length >= 24) throw new j("A workshop can have up to 24 cards. Remove one first.", "refused", a.id);
          const R = Sn(r, "card");
          r.cards.push({ id: R, label: Xn(n.label?.trim() ?? ""), laneId: a.id, free: !0 });
          const Z = K(r, o, a.id);
          return b(Z, "Added " + (n.label?.trim() ? P(n.label.trim()) : "an empty card") + " to " + P(a.label) + ".", { laneId: a.id, cardId: R });
        }
        let S = n.label;
        if (S === void 0) {
          let R = r.cards.length + 1;
          for (; r.cards.some((Z) => Z.label === "Token " + R); ) R++;
          S = "Token " + R;
        }
        const M = new Set([...r.lanes, ...r.cards].map((R) => R.id));
        let D = 1;
        for (; M.has("token-" + D); ) D++;
        r.cards.push({ id: "token-" + D, label: S, laneId: a.id });
        const H = K(r, o, a.id);
        return b(H, "Added " + P(H.cards[H.cards.length - 1].label) + " at " + P(a.label) + ".", { laneId: a.id, cardId: "token-" + D });
      }
      if (go(n, o, a.id), r.cards.length >= 24) throw new j("A workshop can have up to 24 cards. Remove one first.", "refused", a.id);
      if (a.capacity !== void 0 && E(a.id) >= a.capacity)
        throw new j(P(a.label) + " is full: it holds " + a.capacity + (a.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", a.id);
      const g = n.allowedLanes && [...new Set(n.allowedLanes.map((S) => A(S).id))];
      let C;
      try {
        C = Ps(r, a.id, { label: n.label?.trim() ?? "", ...g && { allowedLaneIds: g } });
      } catch (S) {
        throw new j(Yn(S.message, o), "refused", a.id);
      }
      const $ = C.cards[C.cards.length - 1];
      return b(C, "Added " + ($.label ? P($.label) : "an empty card") + " to " + P(a.label) + ".", { laneId: a.id, cardId: $.id });
    }
    case "remove_card": {
      const a = v(n.card);
      if (c && !a.free && r.cards.filter((g) => !g.free).length === 1) throw new j("A map needs at least one token.", "refused", a.laneId, a.id);
      if (w && r.cards.length === 1) throw new j("A release plan needs at least one feature.", "refused", a.laneId, a.id);
      if (o === "launch-plan" && r.cards.length === 1) throw new j("A launch plan needs at least one task.", "refused", a.laneId, a.id);
      r.cards = r.cards.filter((g) => g !== a);
      for (const g of r.cards)
        g.dependsOn?.includes(a.id) && (g.dependsOn = g.dependsOn.filter((C) => C !== a.id), g.dependsOn.length || delete g.dependsOn);
      return Dn(r, (g) => g.cardId === a.id), b(K(Ls(r, a.id), o, a.laneId), "Removed the " + T.card + " " + P(a.label) + ".", { laneId: a.laneId, cardId: a.id });
    }
    case "move_card": {
      const a = typeof n.lane == "object" ? r.lanes.find(($) => $.id === n.lane.id) ?? null : k(n.lane), g = v(n.card, a?.id ?? null), C = A(n.lane, g.laneId);
      return U(g, C);
    }
    case "advance_card": {
      const a = v(n.card), g = r.lanes.find(($) => $.id === a.laneId), C = g.station.next.map(($) => r.lanes.find((S) => S.id === $)).filter(($) => !!$);
      if (!C.length) throw new j(P(a.label) + " is at " + P(g.label) + ", and no path leads on from there.", "refused", g.id, a.id);
      if (C.length > 1)
        throw new j("From " + P(g.label) + " the path goes to " + C.map(($) => P($.label)).join(" or ") + ". Say which, such as “Move " + a.label + " to " + C[0].label + "”.", "refused", g.id, a.id);
      return U(a, C[0]);
    }
    case "set_lane_capacity": {
      const a = A(n.lane), g = r.behaviour && ge().setLimit(r, a.id, n.capacity, i);
      if (typeof g == "string") throw new j(g, "refused", a.id);
      if (g) return b(g, P(a.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: a.id });
      const C = c ? "token" : w ? "point" : "card";
      if (n.capacity === null)
        return delete a.capacity, b(K(r, o, a.id), c ? "Removed the limit at " + P(a.label) + "." : P(a.label) + " now holds any number of " + C + "s.", { laneId: a.id });
      const $ = w ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > $)
        throw new j((c ? "A step" : "A lane") + " can hold from 1 to " + $ + " " + C + "s.", "refused", a.id);
      const S = w ? r.cards.reduce((M, D) => M + (D.laneId === a.id ? D.points ?? 1 : 0), 0) : E(a.id);
      if (S > n.capacity)
        throw new j(P(a.label) + " already holds " + S + " " + C + (S === 1 ? "" : "s") + ". Move some " + (c ? "on" : "out") + " first, or choose a higher " + (w ? "budget" : "number") + ".", "refused", a.id);
      return a.capacity = n.capacity, b(K(r, o, a.id), P(a.label) + " now holds up to " + n.capacity + " " + C + (n.capacity === 1 ? "" : "s") + ".", { laneId: a.id });
    }
    case "set_card_lanes": {
      const a = v(n.card);
      if (n.lanes === null)
        return delete a.allowedLaneIds, b(K(r, o, a.laneId, a.id), P(a.label) + " can now go in any lane.", { laneId: a.laneId, cardId: a.id });
      const g = [...new Set(n.lanes.map(($) => A($)))], C = r.lanes.find(($) => $.id === a.laneId);
      if (!g.includes(C)) throw new j(P(a.label) + " is in " + P(C.label) + " now. Include " + P(C.label) + ", or move the card first.", "refused", C.id, a.id);
      return a.allowedLaneIds = g.map(($) => $.id), b(K(r, o, a.laneId, a.id), P(a.label) + " can now go only in " + Be(g.map(($) => P($.label))) + ".", { laneId: a.laneId, cardId: a.id });
    }
    case "set_card_points": {
      const a = v(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new j("A feature takes from 1 to 24 points.", "refused", a.laneId, a.id);
      return a.points = n.points, b(K(r, o, a.laneId, a.id), P(a.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: a.laneId, cardId: a.id });
    }
    case "set_card_dependencies": {
      const a = v(n.card), g = [...new Set(n.dependsOn.map(($) => v($)))], C = { laneId: a.laneId, cardId: a.id };
      if (n.mode === "remove") {
        const $ = g.filter((S) => a.dependsOn?.includes(S.id));
        if (!$.length) throw new j(P(a.label) + " does not depend on " + Be(g.map((S) => P(S.label))) + ".", "refused", a.laneId, a.id);
        return a.dependsOn = a.dependsOn.filter((S) => !$.some((M) => M.id === S)), a.dependsOn.length || delete a.dependsOn, b(K(r, o, a.laneId, a.id), P(a.label) + " no longer depends on " + Be($.map((S) => P(S.label))) + ".", C);
      }
      if (!g.length) {
        if (n.mode === "add") throw new j("Name the features " + P(a.label) + " depends on.", "refused", a.laneId, a.id);
        return delete a.dependsOn, b(K(r, o, a.laneId, a.id), P(a.label) + " no longer depends on anything.", C);
      }
      if (g.includes(a)) throw new j("A feature can’t depend on itself.", "refused", a.laneId, a.id);
      return a.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? a.dependsOn ?? [] : [], ...g.map(($) => $.id)])], b(K(r, o, a.laneId, a.id), P(a.label) + " now depends on " + Be(g.map(($) => P($.label))) + ".", C);
    }
    case "set_outcome": {
      const a = v(n.card), g = A(n.lane), C = r.signals ?? (r.signals = []), $ = n.label, S = $ === void 0 ? C.filter((R) => R.cardId === a.id && R.laneId === g.id) : C.filter((R) => R.cardId === a.id && R.label.toLowerCase() === $.toLowerCase());
      if ($ !== void 0 && S.length > 1) throw new j("Two outcomes on this card have that name.", "refused", g.id, a.id);
      if (!S.length && C.length >= 24) throw new j("A workshop can have up to 24 outcomes. Remove one first.", "refused", g.id, a.id);
      let M = 1;
      for (; C.some((R) => R.id === "signal-" + M); ) M++;
      const H = { label: $ ?? S[0]?.label ?? (a.label + " in " + g.label).slice(0, 80).trim(), cardId: a.id, laneId: g.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return S.length ? Object.assign(S[0], H) : C.push({ id: "signal-" + M, ...H }), b(K(r, o, g.id, a.id), "When " + P(a.label) + " is in " + P(g.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: g.id, cardId: a.id });
    }
    case "remove_outcome": {
      const a = v(n.card), g = (r.signals ?? []).filter((C) => C.cardId === a.id);
      if (n.outcome === void 0) {
        if (!g.length) throw new j(P(a.label) + " has no outcome to remove.", "refused", a.laneId, a.id);
        Dn(r, (C) => C.cardId === a.id);
      } else {
        const C = I(g, vt(g, "outcomes?", "outcome"), n.outcome, "outcome", a.laneId);
        Dn(r, ($) => $.id === C.id);
      }
      return b(K(r, o, a.laneId, a.id), "Removed the outcome from " + P(a.label) + ".", { laneId: a.laneId, cardId: a.id });
    }
    case "set_presentation_order": {
      const a = n.lanes.map((g) => A(g));
      if (a.length !== r.lanes.length || new Set(a).size !== r.lanes.length) throw new j("Include each scene once in the presentation order.", "refused");
      return r.presentationOrder = a.map((g) => g.id), b(K(r, o), _(a));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new j("Say before or after, not both.", "invalid_edit");
      const a = A(n.lane), g = n.before ?? n.after, C = g === void 0 ? void 0 : A(g);
      if (C && C.id === a.id) throw new j("Choose two different scenes.", "refused", a.id);
      const $ = jt(r).filter((S) => S.id !== a.id);
      return $.splice(C ? $.findIndex((S) => S.id === C.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, a), r.presentationOrder = $.map((S) => S.id), b(K(r, o, a.id), _($), { laneId: a.id });
    }
    case "add_station": {
      const a = A(n.from);
      let g;
      try {
        g = Oo(r, a.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch ($) {
        throw new j($.message, "refused", a.id);
      }
      const C = g.lanes[g.lanes.length - 1];
      return b(g, "Added a path from " + P(a.label) + " to " + P(C.label) + ".", { laneId: C.id });
    }
    case "insert_station": {
      const a = A(n.before), g = n.from === void 0 ? void 0 : A(n.from), C = g ? [g] : r.lanes.filter((M) => M.station.next.includes(a.id));
      if (g && !g.station.next.includes(a.id))
        throw new j("There is no path from " + P(g.label) + " to " + P(a.label) + ". Try “Add " + n.label + " after " + g.label + "”.", "refused", g.id);
      if (!C.length) throw new j("Nothing leads to " + P(a.label) + " yet. Try “Add " + n.label + " after " + a.label + "”.", "refused", a.id);
      let $;
      try {
        $ = Oo(r, C[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (M) {
        throw new j(M.message, "refused", a.id);
      }
      const S = $.lanes[$.lanes.length - 1];
      for (const M of $.lanes)
        C.some((D) => D.id === M.id) && (M.station.next = [...new Set(M.station.next.map((D) => D === a.id ? S.id : D))]);
      return S.station.next = [a.id], b(K($, o, S.id), "Added " + P(S.label) + " before " + P(a.label) + ".", { laneId: S.id });
    }
    case "connect_stations": {
      const a = A(n.from), g = A(n.to);
      if (a.id === g.id) throw new j("Connect two different steps.", "refused", a.id);
      return a.station.next.includes(g.id) ? b(r, P(a.label) + " already leads to " + P(g.label) + ".", { laneId: a.id }, !1) : (a.station.next.push(g.id), b(K(r, o, a.id), "Connected " + P(a.label) + " to " + P(g.label) + ".", { laneId: a.id }));
    }
    case "disconnect_stations": {
      const a = A(n.from), g = A(n.to);
      if (!a.station.next.includes(g.id)) throw new j("There is no path between " + P(a.label) + " and " + P(g.label) + ".", "refused", a.id);
      return a.station.next = a.station.next.filter((C) => C !== g.id), b(K(r, o, a.id), "Removed the path from " + P(a.label) + " to " + P(g.label) + ".", { laneId: a.id });
    }
    case "set_station_outcome": {
      const a = A(n.station);
      return a.station.outcome = n.outcome, b(K(r, o, a.id), "Changed what happens at " + P(a.label) + ".", { laneId: a.id });
    }
    case "set_station_position": {
      const a = A(n.station);
      return Object.assign(a.station, { column: n.column, row: n.row }), b(K(r, o, a.id), "Moved " + P(a.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: a.id });
    }
    case "set_station_image": {
      const a = A(n.station);
      return n.image === null ? (delete a.station.image, b(K(r, o, a.id), "Removed the image at " + P(a.label) + ".", { laneId: a.id })) : (a.station.image = { src: n.image.src, alt: n.image.alt }, b(K(r, o, a.id), "Updated the image at " + P(a.label) + ".", { laneId: a.id }));
    }
    case "set_station_image_alt": {
      const a = A(n.station);
      if (!a.station.image) throw new j("Add a station image before changing its description.", "refused", a.id);
      return a.station.image.alt = n.alt, b(K(r, o, a.id), "Updated the image description at " + P(a.label) + ".", { laneId: a.id });
    }
    case "connect_cards":
    case "connect_note": {
      const a = v(n.card);
      let g = a.id, C, $;
      if (n.kind === "connect_cards") {
        const R = v(n.to, a.laneId);
        if (R.id === a.id) throw new j("A line joins two different cards.", "refused", a.laneId, a.id);
        C = R.id, $ = P(R.label);
      } else {
        const R = n.note.trim();
        if (r.cards.some((Z) => Z.id === R) || r.lanes.some((Z) => Z.id === R))
          throw new j("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", a.laneId, a.id);
        C = R, $ = "the note " + R, n.direction === "from_note" && ([g, C] = [C, g]);
      }
      const S = lr(r, g, C, n.label ? { label: n.label } : {}), M = In(r, S);
      if (M) throw new j(M, "refused", a.laneId, a.id);
      const D = Gn(r, S), H = g === a.id;
      return b(
        D,
        H ? "Drew a line from " + P(a.label) + " to " + $ + "." : "Drew a line from " + $ + " to " + P(a.label) + ".",
        { laneId: a.laneId, cardId: a.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const a = v(n.card), g = n.kind === "disconnect_cards" ? v(n.to, a.laneId).id : n.note.trim(), C = n.kind === "disconnect_cards" ? P(r.cards.find((M) => M.id === g).label) : "the note " + g, $ = (M) => M.parentId === a.id && M.childId === g || M.parentId === g && M.childId === a.id, S = r.lines ?? [];
      return S.some($) ? (r.lines = S.filter((M) => !$(M)), b(K(r, o, a.laneId, a.id), "Took away the line between " + P(a.label) + " and " + C + ".", { laneId: a.laneId, cardId: a.id })) : b(e, P(a.label) + " and " + C + " are not joined by a line.", { laneId: a.laneId, cardId: a.id }, !1);
    }
  }
  throw new j("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function U(a, g) {
    const C = { laneId: g.id, cardId: a.id };
    if (a.laneId === g.id)
      return b(e, P(a.label) + " is already " + (c ? "at " : "in ") + P(g.label) + ".", C, !1);
    const $ = vn(e, a.id, g.id);
    if (!$) throw new j(xn(e, a.id, g.id) ?? "That move is not available.", "refused", g.id, a.id);
    return b(K($, o, g.id, a.id), "Moved " + P(a.label) + " to " + P(g.label) + ".", C);
  }
}
function go(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount", "band"].find((i) => e[i] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? i !== "amount" && (i !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && i === "amount"));
  if (t) throw new j(t === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", o);
}
function Dn(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function en(e, n, o = {}) {
  const t = (I) => ({ refused: { index: 0, kind: null, laneId: null, ...I } });
  let i;
  try {
    i = Y(e);
  } catch (I) {
    return t({ reason: "The workshop cannot be read: " + (I instanceof Error ? I.message : String(I)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const r = i, c = [], w = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [I, A] of n.entries()) {
    const v = A?.kind, k = It.find((g) => g.kind === v);
    if (!A || typeof A != "object" || !k)
      return t({
        index: I,
        kind: typeof v == "string" ? v : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(v)) + ". The edits are " + Be(It.map((g) => g.kind)) + "."
      });
    const b = qr(A, k);
    if (b) return t({ index: I, kind: k.kind, code: "invalid_edit", reason: b });
    const E = Jn(i);
    if (!k.boards.includes(E))
      return t({ index: I, kind: k.kind, code: "not_on_this_board", reason: k.refusals[E] ?? "This workshop does not take " + k.kind + "." });
    let _;
    try {
      _ = Kr(i, A, E, o.selection, w);
    } catch (g) {
      if (!(g instanceof j)) throw g;
      return t({
        index: I,
        kind: k.kind,
        reason: g.reason,
        code: g.code,
        laneId: g.laneId,
        ...g.cardId && { cardId: g.cardId },
        ...g.candidates && { candidates: g.candidates },
        ...g.limits && { limits: g.limits }
      });
    }
    const U = i.behaviour && !Br(k.kind) ? ge().check(i, _.board) : null;
    if (U && "refused" in U)
      return t({ index: I, kind: k.kind, reason: U.refused.sentence, code: "refused", laneId: U.refused.laneId, cardId: U.refused.cardId });
    const a = Zr(i, _.board);
    if (a) return t({ index: I, kind: k.kind, reason: a, code: "not_on_this_board", laneId: _.laneId ?? null });
    i = _.board, c.push({
      index: I,
      kind: k.kind,
      said: _.said,
      changed: _.changed ?? !0,
      ..._.laneId && { laneId: _.laneId },
      ..._.cardId && { cardId: _.cardId }
    });
  }
  const m = new Map(r.cards.map((I) => [I.id, I.laneId])), T = i.cards.flatMap((I) => {
    const A = m.get(I.id);
    return A === void 0 || A === I.laneId ? [] : [{ cardId: I.id, fromLaneId: A, toLaneId: I.laneId }];
  });
  return { workshop: i, report: { edits: c, movedCards: T } };
}
function Jr(e, n) {
  const o = de(e);
  if (o === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const t = e.lanes.find((i) => {
      const r = n.lanes.find((c) => c.id === i.id);
      return i.role !== r.role || i.probability !== r.probability;
    });
    if (t) return `${t.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (o === "budget") {
    const t = e.budget, i = n.budget;
    if (!i || t.currency !== i.currency || t.step !== i.step) return "A budget keeps its currency and its step.";
    const r = be(o).fixed?.(e, n);
    if (r) return r;
    const c = e.lanes.find((w) => {
      const m = n.lanes.find((T) => T.id === w.id);
      return w.floor !== m.floor || w.cap !== m.cap || w.capacity !== m.capacity;
    });
    if (c) return `${c.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((i) => i.id === t.id).capacity) ? W.launchLanes : o && be(o).fixed?.(e, n) || null;
}
const Yr = {
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
function Zr(e, n) {
  const o = Y(e), t = Jn(o);
  let i;
  try {
    i = Y(n);
  } catch (m) {
    return Yn(m instanceof Error ? m.message : String(m), t);
  }
  const r = Jn(i), c = (m, T) => m.lanes.length === T.lanes.length && m.lanes.every((I) => T.lanes.some((A) => A.id === I.id)), w = (m, T) => m.lanes.every((I, A) => T.lanes[A]?.id === I.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && r !== t)
    return c(o, i) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !w(o, i)) return W.keepsOrder;
  if (de(o) && r === t && !(c(o, i) && w(o, i))) return xt[t];
  if (de(o) && r === t) {
    const m = Jr(o, i);
    if (m) return m;
  }
  if (t === "release-plan" && r === "release-plan") {
    if (!c(o, i)) return W.releaseLanes;
    if (!w(o, i)) return W.releaseOrder;
    if (i.cards.some((m) => !o.cards.some((T) => T.id === m.id))) return W.releaseCards;
  }
  return t !== r ? "This slate holds a " + Yr[t] + ", and it stays one. Start a new slate for another kind of workshop." : o.behaviour || i.behaviour ? ge().replacement(o, i) : null;
}
const Qs = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Xs(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const r of n.panels) {
    if (!r || typeof r.id != "string" || !/^[a-z][\w-]{0,31}$/.test(r.id) || typeof r.label != "string" || !r.label.trim() || r.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(r.artwork) || !(r.after === null || typeof r.after == "string")) return null;
    o.push({ id: r.id, label: r.label.trim(), artwork: r.artwork, after: r.after });
  }
  const t = new Map(o.map((r) => [r.id, r])), i = [...new Set(n.hung)];
  if (t.size !== o.length || i.length !== n.hung.length || i.some((r) => !t.has(r))) return null;
  for (const r of o) {
    const c = /* @__PURE__ */ new Set([r.id]);
    let w = r.after;
    for (; w !== null; ) {
      if (c.has(w) || !t.has(w) || i.includes(r.id) && !i.includes(w)) return null;
      c.add(w), w = t.get(w).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: i };
}
function Vr(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function ei(e, n) {
  return Vr(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const jo = ["firstPrint", "secondPrint", "thirdPrint"], Fo = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function ni(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...Fo, route: n.route };
  for (const t of jo) {
    const i = n[t];
    if (typeof i != "string" || !i.trim() || i.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = i.trim();
  }
  return o;
}
function ti(e = new URLSearchParams()) {
  const n = { ...Fo };
  for (const t of jo) {
    const i = e.get(t)?.trim();
    i && i.length <= 48 && (n[t] = i);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function oi(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Qr(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = ns(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), es(n), n;
}
function Xr(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function es(e) {
  return e && Xr(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function yo(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function gn(e) {
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
function ns(e) {
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
function mt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const tn = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, At = "http://www.w3.org/2000/svg", ko = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function Se(e, n, o) {
  const t = document.createElementNS(At, e);
  for (const [i, r] of Object.entries(n)) t.setAttribute(i, String(r));
  return o?.fill && (t.setAttribute("fill", ko(o.fill)), t.style.setProperty("fill", o.fill)), o?.stroke && (t.setAttribute("stroke", ko(o.stroke)), t.style.setProperty("stroke", o.stroke)), t;
}
function bo(e, n, o, t, i) {
  const r = typeof document < "u" ? document.activeElement : null, c = r && e.contains(r) ? r.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const w = [];
  for (const m of n)
    if (m.t === "line")
      e.appendChild(Se("line", {
        x1: m.x1,
        y1: m.y1,
        x2: m.x2,
        y2: m.y2,
        "stroke-width": m.width ?? 1,
        ...m.dash ? { "stroke-dasharray": m.dash } : {}
      }, { stroke: m.color }));
    else if (m.t === "rect")
      e.appendChild(Se("rect", {
        x: m.x,
        y: m.y,
        width: Math.max(0, m.w),
        height: Math.max(0, m.h),
        rx: m.rx ?? 0,
        ...m.opacity !== void 0 ? { opacity: m.opacity } : {},
        ...m.role ? { "data-board-layer": m.role } : {}
      }, { fill: m.color }));
    else if (m.t === "text") {
      const T = Se("text", {
        x: m.x,
        y: m.y,
        "font-size": m.size ?? 13,
        "text-anchor": m.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...m.bold ? { "font-weight": 600 } : {},
        ...m.role ? { "data-board-layer": m.role } : {}
      }, { fill: m.color });
      m.lines && m.lines.length > 1 ? m.lines.forEach((I, A) => {
        const v = Se("tspan", { x: m.x, dy: A ? m.lineHeight ?? Math.round((m.size ?? 13) * 1.25) : 0 });
        v.textContent = A < m.lines.length - 1 ? I + " " : I, T.appendChild(v);
      }) : T.textContent = m.text, e.appendChild(T);
    } else {
      if (m.unlink && o) {
        const { cardId: T, waitsOn: I, label: A } = m.unlink, v = I + ">" + T, k = t?.armed === v, b = Se("path", {
          d: m.d,
          fill: "none",
          "stroke-width": m.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": v,
          "aria-label": k ? A + ". " + (m.unlink.armed ?? "Tap again to remove it") + "." : A,
          role: "button",
          tabindex: 0,
          ...k ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: k ? tn.refuse : "transparent" });
        let E = !1;
        b.addEventListener("pointerdown", (_) => {
          _.stopPropagation(), E = _.pointerType === "touch" || _.pointerType === "pen";
        }), b.addEventListener("click", (_) => {
          if (_.stopPropagation(), E && t && t.armed !== v) {
            t.arm(v);
            return;
          }
          t?.arm(null), o(T, I);
        }), b.addEventListener("keydown", (_) => {
          _.key !== "Enter" && _.key !== " " || (_.preventDefault(), _.stopPropagation(), o(T, I));
        }), b.addEventListener("focus", () => {
          b.style.setProperty("stroke", tn.accept), b.setAttribute("opacity", "0.35");
        }), b.addEventListener("blur", () => {
          k || (b.style.setProperty("stroke", "transparent"), b.removeAttribute("opacity"));
        }), e.appendChild(b), w.push(b);
      } else if (m.pick && i) {
        const { key: T, label: I } = m.pick, A = Se("path", {
          d: m.d,
          fill: "none",
          "stroke-width": m.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": T,
          "data-board-pick": "",
          "aria-label": I,
          role: "button",
          tabindex: 0
        }, { stroke: "transparent" });
        A.addEventListener("pointerdown", (v) => v.stopPropagation()), A.addEventListener("click", (v) => {
          v.stopPropagation(), i(T);
        }), A.addEventListener("keydown", (v) => {
          v.key !== "Enter" && v.key !== " " || (v.preventDefault(), v.stopPropagation(), i(T));
        }), A.addEventListener("focus", () => {
          A.style.setProperty("stroke", tn.accept), A.setAttribute("opacity", "0.35");
        }), A.addEventListener("blur", () => {
          A.style.setProperty("stroke", "transparent"), A.removeAttribute("opacity");
        }), e.appendChild(A), w.push(A);
      }
      if (e.appendChild(Se("path", { d: m.d, fill: "none", "stroke-width": m.width ?? 1.5, "pointer-events": "none" }, { stroke: m.color })), m.arrow) {
        const { x: T, y: I, angle: A } = m.arrow;
        e.appendChild(Se("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${T} ${I}) rotate(${A})`, "pointer-events": "none" }, { fill: m.color }));
      }
      if (m.unlink && t?.armed === m.unlink.waitsOn + ">" + m.unlink.cardId && m.arrow) {
        const T = Se("text", {
          x: m.arrow.x - 6,
          y: m.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: tn.refuse });
        T.textContent = m.unlink.armed ?? "Tap again to remove this link", e.appendChild(T);
      }
    }
  c && w.find((m) => m.getAttribute("data-board-link") === c)?.focus({ preventScroll: !0 });
}
function ts(e, n) {
  const o = e?.canvas?.node, t = document.createElementNS(At, "g");
  t.setAttribute("data-board-layer", ""), t.setAttribute("pointer-events", "none");
  const i = document.createElementNS(At, "g");
  i.setAttribute("data-board-layer-top", ""), i.setAttribute("pointer-events", "none");
  let r = !1, c = null, w;
  const m = {
    armed: null,
    arm(I) {
      clearTimeout(w), m.armed = I, I && (w = setTimeout(() => m.arm(null), 5e3), c?.[2].announce?.(c[2].boardFocused && c[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), c && T.draw(...c);
    }
  }, T = {
    draw(I, A, v) {
      if (r || !o) return;
      c = [I, A, v];
      const { origin: k } = v, b = n(A ?? I, v, I), E = (a) => a.t === "text" && (a.role === "clamp" || a.role === "refusal") || a.t === "rect" && !!a.role?.startsWith("grip-");
      for (const a of [t, i]) a.setAttribute("transform", `translate(${k.x} ${k.y})`);
      bo(t, b.filter((a) => !E(a)), v.onUnlink, m, v.onPick), bo(i, b.filter(E));
      const _ = v.above && v.above.parentNode === o ? v.above : null, U = _ ? _.nextSibling : o.firstChild;
      (t.parentNode !== o || t.previousSibling !== _) && o.insertBefore(t, U === t ? t.nextSibling : U), i.firstChild && o.lastChild !== i ? o.appendChild(i) : !i.firstChild && i.parentNode && i.remove();
    },
    destroy() {
      r = !0, clearTimeout(w), t.remove(), i.remove();
    }
  };
  return T;
}
const Ct = "handle-_link-", Tt = "handle-_route-", An = 40, zo = 44;
function wt(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(An, Math.ceil(zo / n)));
}
function Do(e) {
  if (e.startsWith(Ct)) return { kind: "link", from: e.slice(Ct.length) };
  if (e.startsWith(Tt)) {
    const [n, o] = e.slice(Tt.length).split("~");
    return n && o ? { kind: "route", from: n, to: o } : null;
  }
  return null;
}
const Bo = (e) => !!e.lanes[0]?.station, Ne = (e, n) => e.lanes.find((o) => o.id === n)?.label ?? n;
function Wt(e) {
  const { places: n } = De(e);
  return new Map(n.map((o) => [o.laneId, { x: o.x + 2, y: o.y, width: o.width - 4, height: o.height }]));
}
function vo(e, n, o = 4) {
  const t = e.x + e.width / 2, i = e.y + e.height / 2, r = n.x - t, c = n.y - i, w = r ? e.width / 2 / Math.abs(r) : 1 / 0, m = c ? e.height / 2 / Math.abs(c) : 1 / 0, T = Math.min(w, m), I = Math.hypot(r, c) || 1;
  return { x: t + r * T + r / I * o, y: i + c * T + c / I * o };
}
function Ho(e) {
  if (!Bo(e)) return [];
  const n = Wt(e), o = [];
  for (const t of e.lanes) {
    const i = n.get(t.id);
    if (i)
      for (const r of t.station.next) {
        const c = n.get(r);
        if (!c) continue;
        const w = { x: i.x + i.width / 2, y: i.y + i.height / 2 }, m = { x: c.x + c.width / 2, y: c.y + c.height / 2 }, T = vo(i, m, -8), I = vo(c, w, -8);
        o.push({ key: t.id + ">" + r, from: t.id, to: r, x1: T.x, y1: T.y, x2: I.x, y2: I.y });
      }
  }
  return o;
}
function os(e, n) {
  for (const [o, t] of Wt(e))
    if (n.x >= t.x && n.x <= t.x + t.width && n.y >= t.y && n.y <= t.y + t.height) return o;
  return null;
}
function Go(e, n, o = An) {
  if (!Bo(e)) return [];
  const t = Wt(e), i = o / An, r = (w, m, T, I, A) => ({ options: {
    id: w,
    name: I,
    text: A ? "+" : "",
    xPos: n.x + m - o / 2,
    yPos: n.y + T - o / 2,
    width: o,
    height: o,
    shapeHint: "rectangle",
    vectorPath: qn(o, o, o / 2),
    backgroundColor: A ? "#2f5fd0" : "#fffef8",
    foregroundColor: A ? "#ffffff" : "#2f5fd0",
    borderColor: A ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * i),
    fontSize: Math.round(22 * i)
  }, relationships: { associations: [] } }), c = [];
  for (const w of e.lanes) {
    const m = t.get(w.id);
    m && c.push(r(Ct + w.id, m.x + m.width, m.y + m.height, "Draw a path from " + w.label, !0));
  }
  for (const w of Ho(e))
    c.push(r(Tt + w.from + "~" + w.to, w.x2, w.y2, "End of the path from " + Ne(e, w.from) + " to " + Ne(e, w.to), !1));
  return c;
}
function rs(e, n) {
  const o = Do(n);
  return o ? o.kind === "link" ? `Draw a path from ${Ne(e, o.from)}: drag it onto another step.` : `End of the path from ${Ne(e, o.from)} to ${Ne(e, o.to)}: drag it onto another step to move the path there.` : null;
}
function ss(e, n, o) {
  if (o === null || n.kind === "route" && o === n.to) return { next: e };
  const t = e.lanes.find((c) => c.id === n.from);
  if (!t?.station || !e.lanes.some((c) => c.id === o)) return { next: e };
  if (o === t.id) return { next: null, refusal: "A path joins two different steps." };
  if (t.station.next.includes(o)) return { next: null, refusal: `${t.label} already leads to ${Ne(e, o)}.` };
  const i = n.kind === "route" ? t.station.next.filter((c) => c !== n.to) : t.station.next, r = e.lanes.map((c) => c.id === t.id ? { ...c, station: { ...c.station, next: [...i, o] } } : c);
  return { next: { ...e, lanes: r } };
}
function is(e, n) {
  const o = [], t = [];
  for (const i of n.lanes) {
    const r = e.lanes.find((w) => w.id === i.id)?.station?.next ?? [], c = i.station?.next ?? [];
    for (const w of r) c.includes(w) || o.push({ kind: "disconnect_stations", from: { id: i.id }, to: { id: w } });
    for (const w of c) r.includes(w) || t.push({ kind: "connect_stations", from: { id: i.id }, to: { id: w } });
  }
  return [...o, ...t];
}
function as(e, n) {
  const o = [], t = !!n.boardFocused, i = n.gripSize ?? An, r = Math.max(24, i * zo / An);
  for (const c of Ho(e)) {
    const w = Ne(e, c.from) + " to " + Ne(e, c.to), m = `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`, T = !t && n.picked === c.key;
    o.push(t ? { t: "path", d: m, color: "transparent", width: 3, hit: r, unlink: { cardId: c.to, waitsOn: c.from, label: "Remove the path from " + w, armed: "Tap again to remove this path" } } : { t: "path", d: m, color: T ? tn.accept : "transparent", width: T ? 5 : 3, hit: r, pick: { key: c.key, label: "Path from " + w + (T ? ", selected" : "") } });
  }
  if (n.clamp) {
    const c = Go(e, { x: 0, y: 0 }, i).find((T) => T.options.id === n.clamp.name)?.options, w = c ? c.xPos + i + 6 : 0, m = c ? c.yPos + i / 2 + 5 : 0;
    o.push({ t: "text", x: w, y: m, text: n.clamp.text, color: tn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return o;
}
const xo = "#1f7a5c", Io = "#5b9a85", gt = "#c2410c", ls = "#2f5fd0", ds = {
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
}, cs = { canMove: !1, canSelect: !1 };
function us(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ri(e, n, o = {}) {
  let t = Y(n);
  const i = o.kit, r = (s) => !!de(s) && !i;
  if (r(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const c = i?.layer(e) ?? (t.lanes[0]?.station ? ts(e, as) : void 0);
  let w = null, m = /* @__PURE__ */ new Set(), T = null, I = null, A = !!o.readOnly, v = A || r(t), k = !1;
  const b = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  let g = null, C = null, $ = null, S = null;
  const M = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let H = null, R = null;
  function Z(s, l) {
    R && clearTimeout(R.timer), R = { name: s, reason: l, timer: setTimeout(() => {
      R = null, k || F(I ?? t);
    }, 3e3) };
  }
  let se = Promise.resolve(), qe = null, te = Ao(o.layout), Ie = te;
  const Pe = { ...o.style };
  let pe = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Set(), ln = null, Ae = !1, dn = wt(1), Ln = null, cn = null, Me = null, $n = !1;
  const ue = /* @__PURE__ */ new Map();
  Ve(t);
  const Q = o.origin ? { x: o.origin.x, y: o.origin.y } : hs(e), we = (s) => a.get(s) ?? s, ce = (s) => us(we(s));
  function ie(s) {
    const l = U.get(s);
    if (l) return l;
    if (b.has(s) && !a.has(s) || !e.nodes.one?.(s)) return s;
    const d = fr(s, (u) => !!e.nodes.one?.(u) || a.has(u));
    return U.set(s, d), a.set(d, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const Ce = {
    governs(s) {
      if (b.get(s.id) !== s) return null;
      const l = ce(s.id)?.kind;
      return l === "card" ? { canMove: !v, canEditText: !v && !I && t.kind !== "release-plan", canConnect: fn() } : l === "lane" ? { canMove: !1, canEditText: !v && !I } : l === "handle" ? { canMove: !v && !I, canEditText: !1, ...!te.narrow && { cursor: i ? "ew-resize" : "grab" } } : cs;
    },
    onStart(s, l) {
      const d = ce(s.id), u = { x: l.x - (s.options.x ?? 0), y: l.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const p = v || I ? null : i ? i.handleDrag(t, we(s.id), u, te) : _r(we(s.id));
        return p ? (le(), We(), R && (clearTimeout(R.timer), R = null), T = { name: we(s.id), follow: p, last: null }, !0) : !1;
      }
      const y = d.key;
      if (v || I || !t.cards.some((p) => p.id === y)) return !1;
      le(), We();
      let f = null;
      try {
        f = (i?.chooser ?? o.chooseCandidate)?.(t, y, u, te) ?? null;
      } catch (p) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", p);
      }
      return g = { cardId: y, evaluate: f, grab: u, outcome: { kind: "home" } }, F(t, { skip: y }), !0;
    },
    onMove(s, l) {
      if (T) {
        T.last = T.follow(mn(l)), F(T.last.next, { grip: T.name, layout: T.last.layout }), B(o.onPreview, T.last.next === t ? null : T.last.next);
        return;
      }
      if (!g) return;
      const d = Ut(g.cardId, l, g.evaluate);
      if (fs(d, g.outcome)) return;
      g.outcome = d;
      const u = d.kind === "candidate" ? d.next : null;
      F(u ?? t, { skip: g.cardId }), B(o.onPreview, u);
    },
    onEnd(s, l) {
      if (T) {
        const { follow: p, name: h } = T, x = p(mn(l));
        T = null, B(o.onPreview, null), x.refusal ? (Z(h, x.refusal), F(t), e.announce?.(x.refusal), B(o.onRefuse, { laneId: null, reason: x.refusal })) : Rn(x.next, {}) || F(t);
        const O = ut(t, we(s.id));
        return O ? { accept: !0, settle: O } : { accept: !1 };
      }
      if (!g) return { accept: !1 };
      const { cardId: d, evaluate: u } = g, y = Ut(d, l, u), f = t.cards.find((p) => p.id === d);
      if (g = null, B(o.onPreview, null), y.kind === "candidate" && i) {
        if (!Rn(y.next, { cardId: d, laneId: y.laneId }, d))
          return F(t, { skip: d }), { accept: !1 };
        y.said && (Z("card-" + d, y.said), e.announce?.(y.said));
        const p = ut(t, we(s.id));
        return p ? { accept: !0, settle: p } : { accept: !0 };
      }
      if (y.kind === "candidate") {
        t = y.next, F(t, { skip: d });
        const p = t.lanes.find((x) => x.id === y.laneId);
        e.announce?.(`${V(f)} moved to ${p.label}. ${$e(t, p.id)}.`), B(o.onChange, t, { cardId: d, laneId: y.laneId });
        const h = ut(t, we(s.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (y.kind === "refused")
        Pr(V(f), { cardId: d, laneId: y.laneId, reason: y.reason }), y.near && Z("card-" + d, y.reason);
      else if (y.kind === "outside" && kt() && !Je()) {
        const p = Hn(t, d);
        if (!p)
          return dt(d, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        F(t, { skip: d }), e.announce?.(p), B(o.onRefuse, { cardId: d, laneId: null, reason: p });
      } else
        F(t, { skip: d }), y.kind === "outside" && (e.announce?.(`${V(f)} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (T) {
        T = null, B(o.onPreview, null), F(t);
        return;
      }
      const l = g && t.cards.find((d) => d.id === g.cardId);
      g = null, B(o.onPreview, null), F(t, { skip: ce(s.id)?.key }), l && e.announce?.(`Move cancelled. ${V(l)} stays where it was.`);
    },
    onTextCommit(s, l, d) {
      const u = ce(s.id);
      if (!u || v || I) return !1;
      let y = l.replace(/\s+/g, " ").trim();
      const f = [], p = de(t), h = p && u.kind === "card" ? be(p).renamed(t, u.key, y) : null;
      h && (y = h.label, f.push(...h.edits));
      const x = u.kind === "lane" ? { laneId: u.key, label: y } : { cardId: u.key, label: y };
      f.unshift(u.kind === "lane" ? { kind: "rename_lane", lane: { id: u.key }, label: y } : { kind: "rename_card", card: { id: u.key }, label: y });
      const O = en(t, f);
      if ("refused" in O) {
        const { reason: L } = O.refused;
        return e.announce?.(`${d} keeps its name. ${L}`), B(o.onRefuse, { ...u.kind === "lane" ? { laneId: u.key } : { cardId: u.key }, rename: x, reason: L }), !1;
      }
      return JSON.stringify(O.workshop) === JSON.stringify(t) ? (F(t), !1) : (t = O.workshop, F(t), e.announce?.(h ? O.report.edits.map((L) => L.said).join(" ") : `${d} renamed to ${y}.`), B(o.onChange, t, { rename: x, ...i ? { edits: f } : {} }), h ? !1 : y);
    },
    onKeyDown(s, l) {
      const d = ce(s.id);
      if (v || I || g || T || l.ctrlKey || l.metaKey || l.altKey) return !1;
      if ($ && ($.node !== s.id || !["Enter", "Escape"].includes(l.key) && l.key.toLowerCase() !== $.key) && Kt(), $ && l.key === "Escape")
        return l.preventDefault(), Kt(), e.announce?.("Cancelled. Nothing changed."), !0;
      if ($ && l.key === "Enter") {
        l.preventDefault();
        const p = $.choices[$.at];
        return $ = null, B(o.onPreview, null), t = p.next, F(t), e.announce?.(p.done), B(o.onChange, t, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: p.edits }), !0;
      }
      const u = i?.keyChoices?.(t, we(s.id), l.key);
      if (u) {
        l.preventDefault();
        const p = [], h = [];
        for (const L of typeof u == "string" ? [] : u) {
          const N = en(t, L.edits);
          "refused" in N ? h.push(`${L.said}: ${N.refused.reason}`) : p.push({ ...L, next: N.workshop, done: N.report.edits.map((z) => z.said).join(" ") });
        }
        if (!p.length)
          return e.announce?.(typeof u == "string" ? u : h.join(" ")), !0;
        const x = $ && $.node === s.id ? ($.at + 1) % p.length : 0;
        $ = { node: s.id, key: l.key.toLowerCase(), choices: p, at: x }, F(p[x].next), B(o.onPreview, p[x].next);
        const O = p.length > 1 ? ` (${x + 1} of ${p.length}). Press ${l.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${p[x].said}${O} Enter to make it, Escape to cancel.`), !0;
      }
      const y = i?.keyEdit?.(t, we(s.id), { key: l.key, shiftKey: l.shiftKey });
      if (y) {
        l.preventDefault();
        const p = en(t, y);
        return "refused" in p ? (e.announce?.(p.refused.reason), B(o.onRefuse, { laneId: p.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: p.refused.reason })) : Rn(p.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const f = t.cards.find((p) => p.id === d.key);
      if (!f) return !1;
      if (l.key === "ArrowLeft" || l.key === "ArrowRight")
        return l.preventDefault(), qt(f.id, l.key === "ArrowLeft" ? -1 : 1), !0;
      if ((l.key === "ArrowUp" || l.key === "ArrowDown") && kr())
        return l.preventDefault(), qt(f.id, l.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (C?.cardId !== f.id) return !1;
      if (l.key === "Enter") {
        l.preventDefault();
        const { laneId: p, next: h, spot: x } = C;
        if (C = null, p === null)
          return B(o.onPreview, null), dt(f.id, x), !0;
        const O = t;
        t = h, F(t), Re(p), B(o.onPreview, null);
        const L = t.lanes.find((N) => N.id === p);
        return e.announce?.(`${V(f)} moved to ${L.label}. ${$e(t, p)}.`), B(o.onChange, t, { cardId: f.id, laneId: p, ...i ? { edits: i.editsBetween(O, t) } : {} }), !0;
      }
      return l.key === "Escape" ? (l.preventDefault(), We(), e.announce?.(`Move cancelled. ${V(f)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((l) => b.get(l.id) === l).map((l) => l.id);
      $n = s.length === 1, b.clear(), E.clear(), _.clear(), ue.clear(), U.clear(), a.clear(), g = null, C = null, F(I ?? t, { animate: !1 }), s.length === 1 && (se = se.then(() => {
        $n = !1;
        const l = b.get(s[0]);
        if (!k && l && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([l]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        Ke();
      }));
    }
  };
  Ce.onFreeMove = (s, l) => {
    if (!On() || s.options?.isComment) return rt();
    const d = En(l), u = Nn(s), y = t.lanes.filter((h) => !un(s) && nn(t, h.id, u) === null).map((h) => h.id), f = d && i?.noteUnder?.(t, mn(l), te);
    f && (u.under = f);
    const p = d ? un(s) ?? nn(t, d, u) : null;
    S && S.noteId === s.id && S.laneId === d && S.refusal === p || (S = { noteId: s.id, laneId: d, refusal: p, open: y }, Oe());
  }, Ce.onFreeDrop = (s, l, d) => {
    if (rt(), !On() || s.options?.isComment) return;
    const u = En(l);
    if (!u) return;
    const y = Nn(s), f = i?.noteUnder?.(t, mn(l), te);
    f && (y.under = f);
    const p = t.lanes.find((x) => x.id === u), h = un(s) ?? nn(t, u, y);
    return h ? (le(!1), H = { laneId: u, reason: h, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${st(y.label)} can't go in ${p.label}. ${h}`), B(o.onRefuse, { noteId: s.id, laneId: u, reason: h }), "refused") : (lt([{ node: s, offer: y, from: d }], u), "taken");
  }, Ce.onFreeGroupDrop = (s, l, d) => {
    if (rt(), !On() || s.some((h) => h.options?.isComment)) return;
    const u = En(l);
    if (!u) return;
    const y = t.lanes.find((h) => h.id === u), f = s.map((h) => ({ node: h, offer: Nn(h) })), p = xr(f, u);
    if (p) {
      le(!1), H = { laneId: u, reason: p, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${Jt(f.map((h) => st(h.offer.label)))} can't go in ${y.label}. ${p}`);
      for (const { node: h } of f) B(o.onRefuse, { noteId: h.id, laneId: u, reason: p });
      return "refused";
    }
    return lt(f.map((h, x) => ({ ...h, from: d?.[x] })), u), "taken";
  }, Ce.onFreeTextCommit = (s) => {
    if (!On() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const l = s.options ?? {}, d = En({ x: (l.x ?? 0) + (l.width ?? 0) / 2, y: (l.y ?? 0) + (l.height ?? 0) / 2 });
    if (!d) return;
    const u = Nn(s), y = t.lanes.find((O) => O.id === d), f = un(s) ?? nn(t, d, u);
    if (!f) {
      lt([{ node: s, offer: u }], d);
      return;
    }
    le(!1), H = { laneId: d, reason: f, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${st(u.label)} can't go in ${y.label}. ${f} It is beside the board.`), B(o.onRefuse, { noteId: s.id, laneId: d, reason: f });
    const { width: p } = Ve(t), h = Math.round(Q.x + p + 32), x = Math.round(l.y ?? Q.y);
    s.position(h, x, () => e.updateSelectionResizeRotate?.(), void 0, mt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [yo({ ...s.options, x: h, y: x })] });
  }, Ce.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...M], lines: (t.lines ?? []).map((s) => ({ ...s })) }), Ce.onUndoRestore = (s, l) => {
    if (k) return;
    const d = new Map((s?.cards ?? []).map((f) => [f.id, f])), u = new Map(s?.pairs ?? []), y = (f) => M.get(f) ?? u.get(f) ?? f;
    for (const f of l.added) {
      const p = y(f), h = t.cards.find((O) => O.id === p);
      if (!h) continue;
      t = Y({ ...t, cards: t.cards.filter((O) => O !== h), lines: Xe(t.lines, p, f) }), F(t);
      const x = B(o.onChange, t, { cardId: p, cardToNote: { noteId: f }, via: "undo" });
      e.holdTrade?.(f, x), yt(x);
    }
    for (const f of l.removed) {
      const p = y(f), h = d.get(p);
      if (!h || t.cards.some((q) => q.id === p)) continue;
      const x = (s?.lines ?? []).filter((q) => q.parentId === p || q.childId === p), O = bt(t, h), L = {
        id: p,
        label: O,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...x.length ? { lines: x } : {}
      }, N = [h.laneId, ...t.lanes.map((q) => q.id)].find((q) => yn(t, q, L));
      if (!N) {
        e.announce?.(`${V(h)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Lr(yn(t, N, L), p, s?.cards ?? []), p !== f && M.set(f, p), F(t);
      const z = t.cards.findIndex((q) => q.id === p), G = t.cards.slice(z + 1).find((q) => q.laneId === N)?.id, J = B(o.onChange, t, { cardId: p, laneId: N, noteToCard: {
        noteId: f,
        label: O,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...G ? { before: G } : {},
        ...x.length ? { lines: Xe(x, p, f) } : {}
      }, via: "undo" });
      e.holdTrade?.(f, J), yt(J);
    }
    Array.isArray(s?.lines) && Sr(s.lines);
  };
  let ot = !1;
  Ce.onNodeAdded = (s) => {
    k || ot || b.get(s.id) === s || (t.lines ?? []).some((l) => l.parentId === s.id || l.childId === s.id) && (ot = !0, queueMicrotask(() => {
      ot = !1, k || Oe();
    }));
  }, Ce.onLine = (s, l) => {
    k || queueMicrotask(() => {
      k || Cr(s, l);
    });
  };
  const gr = e.setDragPolicy(Ce), yr = o.onSelect || c ? e.onSelectionChange?.(() => {
    Ke(), so();
  }) : void 0;
  let Pn = null;
  const Dt = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, u = d && b.has(d) ? oo(d) : null;
    u !== Pn && (Pn = u, so());
  };
  c && e.element?.addEventListener?.("pointerover", Dt);
  const Bt = (s) => {
    if (C && We(), w && !s?.target?.closest?.("[data-board-pick]") && (w = null, ye && Ze(ye), queueMicrotask(Ke)), cn = null, Me && (clearTimeout(Me), Me = null), !s || k || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const l = new Set(t.lanes.map((f) => ie(ee.lane(f.id))));
    if ((e.getSelectedNodes?.() ?? []).some((f) => !l.has(f?.id))) return;
    const d = t.lanes.flatMap((f) => [ee.caption(f.id), ee.column(f.id)]).map((f) => b.get(ie(f))).filter(Boolean), u = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), d, { padding: 0 }) : null, y = u ? ce(u.id) : null;
    y && (cn = { pointerId: s.pointerId, laneId: y.key, x: s.clientX, y: s.clientY });
  }, Ht = (s) => {
    const l = cn;
    cn = null, !(!l || s.pointerId !== l.pointerId || Math.hypot(s.clientX - l.x, s.clientY - l.y) > 6) && (Me = setTimeout(() => {
      if (Me = null, k || g || T || !t.lanes.some((u) => u.id === l.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = b.get(ie(ee.lane(l.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, Gt = () => {
    cn = null;
  };
  e.element?.addEventListener?.("pointerdown", Bt, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Ht, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", Gt, !0), F(t, { animate: !1 });
  function Ut(s, l, d) {
    const u = t.cards.find((L) => L.id === s);
    if (!u) return { kind: "outside" };
    if (i) {
      const L = mn(l), N = i.refusalAt(t, s, g?.grab ?? { x: 0, y: 0 }, L, te);
      if (N && !N.lands) return { kind: "refused", laneId: N.laneId, reason: N.reason };
      const { width: z, height: G } = Ve(t);
      if (L.x < -40 || L.y < -40 || L.x > z + 40 || L.y > G + 40) return { kind: "outside" };
      let J = t;
      try {
        J = d?.(L) ?? t;
      } catch (q) {
        console.warn("WORKSHOP: the board kit's chooser threw", q);
      }
      return JSON.stringify(J) === JSON.stringify(t) ? N ? { kind: "refused", laneId: N.laneId, reason: N.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: J.cards.find((q) => q.id === s)?.laneId ?? u.laneId, next: J, ...N && { said: N.reason } };
    }
    const y = t.lanes.map((L) => b.get(ie(ee.column(L.id)))).filter(Boolean), f = e.hitTestNodes(l, y, { padding: 6 }), p = f ? ce(f.id).key : null;
    if (!p) return { kind: "outside" };
    if (p === u.laneId) return { kind: "home" };
    const h = vn(t, s, p);
    if (!h) return { kind: "refused", laneId: p, reason: xn(t, s, p) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: p, next: h };
    let x = null;
    try {
      x = d({ x: l.x - Q.x, y: l.y - Q.y });
    } catch (L) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", L), { kind: "candidate", laneId: p, next: h };
    }
    const O = x?.cards.find((L) => L.id === s)?.laneId;
    return !x || !O || O === u.laneId ? { kind: "home" } : { kind: "candidate", laneId: O, next: x };
  }
  function kr() {
    return i ? !1 : new Set(De(t, { layout: te }).places.map((s) => s.row)).size > 1;
  }
  function qt(s, l, d = !1) {
    const u = t.cards.find((L) => L.id === s), y = To(t, s), f = C?.cardId === s && C.laneId === null ? C.side : void 0;
    if (f !== void 0) {
      if (d || l === f) return;
      const L = f > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (We(), L.id === u.laneId) {
        Re(L.id, I ?? t), e.announce?.(`${V(u)} is back in ${L.label}.`);
        return;
      }
      if (y.includes(L)) {
        const z = vn(t, s, L.id);
        C = { cardId: s, laneId: L.id, next: z }, F(z), Re(L.id, z), B(o.onPreview, z), e.announce?.(`${V(u)} to ${L.label}: ${$e(z, L.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const N = xn(t, s, L.id) ?? "That move is not available.";
      le(), H = { laneId: L.id, reason: N, timer: setTimeout(() => le(), 1500) }, F(I ?? t), Re(L.id, I ?? t), e.announce?.(`${V(u)} can't move to ${L.label}. ${N}`), B(o.onRefuse, { cardId: s, laneId: L.id, reason: N });
      return;
    }
    const p = C?.cardId === s ? C.laneId : u.laneId;
    let h;
    if (d) {
      const { places: L } = De(t, { layout: te }), N = L.find((z) => z.laneId === p);
      h = L.filter((z) => z.column === N.column && (z.row - N.row) * l > 0).sort((z, G) => (z.row - G.row) * l).map((z) => t.lanes.find((G) => G.id === z.laneId));
    } else {
      const L = t.lanes.findIndex((N) => N.id === p);
      h = l > 0 ? t.lanes.slice(L + 1) : t.lanes.slice(0, L).reverse();
    }
    const x = h.find((L) => y.includes(L));
    if (le(), !x) {
      const L = h[0];
      if (!L) {
        if (!d && kt()) {
          const z = Hn(t, s);
          if (z) {
            e.announce?.(z), B(o.onRefuse, { cardId: s, laneId: null, reason: z });
            return;
          }
          br(u, l);
          return;
        }
        e.announce?.(`${V(u)} has no lane to move to on that side.`);
        return;
      }
      const N = xn(t, s, L.id) ?? "That move is not available.";
      H = { laneId: L.id, reason: N, timer: setTimeout(() => le(), 1500) }, F(C?.next ?? I ?? t), Re(L.id, C?.next ?? I ?? t), e.announce?.(`${V(u)} can't move to ${L.label}. ${N}`), B(o.onRefuse, { cardId: s, laneId: L.id, reason: N });
      return;
    }
    if (x.id === u.laneId) {
      We(), Re(x.id, I ?? t), e.announce?.(`${V(u)} is back in ${x.label}.`);
      return;
    }
    const O = vn(t, s, x.id);
    C = { cardId: s, laneId: x.id, next: O }, F(O), Re(x.id, O), B(o.onPreview, O), e.announce?.(`${V(u)} to ${x.label}: ${$e(O, x.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Re(s, l = t) {
    const d = i ? Er(l, ee.column(s)) : De(l, { layout: te, rows: to() }).places.find((x) => x.laneId === s), u = e.canvas?.viewbox?.();
    if (!d || !u || !(u.width > 0) || !(u.height > 0)) return;
    const y = 16, f = (x, O, L, N) => O + y * 2 >= N || x - y < L ? x - y - L : x + O + y > L + N ? x + O + y - (L + N) : 0, p = f(Q.x + d.x, d.width, u.x, u.width), h = f(Q.y + d.y, d.height, u.y, u.height);
    (p || h) && e.panBy?.({ x: p, y: h });
  }
  function Ke() {
    if (!o.onSelect || $n) return;
    const s = k ? [] : e.getSelectedNodes?.() ?? [], l = s.length === 1 && b.get(s[0].id) === s[0] ? ce(s[0].id) : null;
    w && s.some((p) => !m.has(p.id)) && (w = null, ye && Ze(ye));
    const [d, u] = w ? w.split(">") : [], y = l?.kind === "card" ? { cardId: l.key } : l?.kind === "lane" ? { laneId: l.key } : d && u && !l ? { path: { from: d, to: u } } : null, f = y ? JSON.stringify(y) : null;
    f !== ln && (ln = f, B(o.onSelect, y));
  }
  function Kt() {
    $ && ($ = null, F(t), B(o.onPreview, null));
  }
  function We() {
    C && (C = null, B(o.onPreview, null), F(I ?? t));
  }
  function br(s, l) {
    const { width: d } = Ve(t), u = b.get(ie(ee.card(s.id)))?.options, y = u?.width ?? 228, f = { x: l > 0 ? Q.x + d + 32 : Q.x - y - 32, y: u?.y ?? Q.y }, p = Lo(t, s.id);
    C = { cardId: s.id, laneId: null, side: l, spot: f, next: t }, F(t), B(o.onPreview, p), e.announce?.(`${V(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Je() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function On() {
    return !k && !v && !I && !g && !Je() && kt();
  }
  function rt() {
    S && (S = null, k || Oe());
  }
  function En(s) {
    const l = t.lanes.map((u) => b.get(ie(ee.column(u.id)))).filter(Boolean), d = e.hitTestNodes(s, l, { padding: 6 });
    return d ? ce(d.id)?.key ?? null : null;
  }
  function Nn(s) {
    const l = s.options ?? {}, d = Jo({
      backgroundColor: l.backgroundColor,
      textColor: l.fontColor,
      fontFamily: l.fontFamily,
      fontSize: l.fontSize,
      borderColor: l.borderColor,
      borderWidth: l.borderWidth
    }), u = String(l.text ?? ""), y = u.replace(/\s+/g, " ").trim(), f = {};
    u.trim() !== y && u.length <= 4e3 && (f.text = u.trim()), typeof l.shape == "string" && /^[a-z]{1,24}$/i.test(l.shape) && (f.shape = l.shape);
    for (const h of ["width", "height"]) Number.isFinite(l[h]) && l[h] >= 10 && l[h] <= 4e3 && (f[h] = Math.round(l[h]));
    if ($t(l.image)) {
      f.image = { src: l.image };
      for (const [h, x] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(l[x]) && l[x] >= 1 && l[x] <= 2e4 && (f.image[h] = l[x]);
    }
    l.link?.data && Co({ ...l.link.type ? { type: l.link.type } : {}, data: l.link.data, ...typeof l.link.show == "boolean" ? { show: l.link.show } : {} }) && (f.link = { ...l.link.type ? { type: l.link.type } : {}, data: l.link.data, ...typeof l.link.show == "boolean" ? { show: l.link.show } : {} });
    const p = vr(s);
    return { id: s.id, label: y, ...d ? { look: d } : {}, ...Object.keys(f).length ? { asNote: f } : {}, ...p.length ? { lines: p } : {} };
  }
  function vr(s) {
    const l = /* @__PURE__ */ new Map(), d = (u) => typeof u == "string" && !!b.get(u) && b.get(u) === e.nodes.one(u);
    for (const u of s.relationships?.getAssociations?.() ?? [])
      (u.targetPoint || !d(u.childId)) && l.set(u.id, hn(u));
    for (const u of e.nodes?.allNodes ?? [])
      if (!(u === s || d(u.id)))
        for (const y of u.relationships?.getAssociations?.() ?? [])
          y.childId === s.id && !y.targetPoint && l.set(y.id, hn(y));
    for (const u of $o(t, s.id)) l.set(u.id, u);
    return [...l.values()];
  }
  function Jt(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function xr(s, l) {
    for (const { node: f } of s) {
      const p = un(f);
      if (p) return p;
    }
    const d = t.lanes.find((f) => f.id === l), u = Ge(t, l);
    if (d.capacity !== void 0 && !d.station && u + s.length > d.capacity) {
      const f = d.capacity - u;
      return f > 0 ? `It has room for ${f} more ${f === 1 ? "card" : "cards"}.` : `It already holds ${u} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let y = t;
    for (const { offer: f } of s) {
      const p = nn(y, l, f);
      if (p) return p;
      y = yn(y, l, f);
    }
    return null;
  }
  function un(s) {
    if (s.options?.image && !$t(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const l = s.options?.link;
    return l?.data && !Co({ ...l.type ? { type: l.type } : {}, data: l.data }) ? "A note with this link stays a note." : null;
  }
  const st = (s) => s || "This note", V = (s) => s.label || "The empty card", Yt = (s) => {
    const l = String(s ?? "").toLowerCase();
    return l === "" || l === "rectangle" || l === "roundedrectangle" ? null : ds[l] ?? "shape";
  }, it = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Zt = (s) => {
    const l = s.flatMap((d) => {
      const u = Yt(d.asNote?.shape);
      return u ? [{ card: d, word: u }] : [];
    });
    if (!l.length) return "";
    if (s.length === 1) {
      const { word: d } = l[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${it(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + l.map(({ card: d, word: u }) => u === "shape" ? `${V(d)} had its own shape` : `${V(d)} was ${it(u)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, Ir = (s) => {
    const l = Yt(s);
    return l ? l === "shape" ? " It has its shape back." : ` It is ${it(l)} again.` : "";
  };
  function fn() {
    return !k && !v && !I && !Je() && xs(t);
  }
  function hn(s) {
    const l = { id: s.id, parentId: s.parentId, childId: s.childId };
    for (const u of [
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
      const y = s[u];
      y != null && y !== "" && (l[u] = y);
    }
    for (const u of ["sourceAnchor", "targetAnchor"]) {
      const y = s[u];
      y && Number.isFinite(y.x) && Number.isFinite(y.y) && (l[u] = { x: y.x, y: y.y });
    }
    const d = s.targetPoint;
    return d && Number.isFinite(d.x) && Number.isFinite(d.y) && (l.targetPoint = { x: d.x, y: d.y }, delete l.targetAnchor), l;
  }
  function Vt(s, l) {
    const d = { ...s };
    return d.showParentArrow = l.showChildArrow ?? !0, d.showChildArrow = l.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, l.targetAnchor && (d.sourceAnchor = l.targetAnchor), l.sourceAnchor && (d.targetAnchor = l.sourceAnchor), d;
  }
  function Qt(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (b.get(s.id) === s) {
      const l = ce(s.id);
      return l?.kind === "card" && t.cards.some((d) => d.id === l.key) ? l.key : null;
    }
    return s.options?.isComment ? null : s.id;
  }
  function at(s, l) {
    if (s.cards.some((u) => u.id === l)) {
      const u = b.get(ie(ee.card(l)));
      return u?.relationships && u.svgGroup ? u : null;
    }
    const d = e.nodes.one(l);
    return d && b.get(l) !== d && d.svgGroup ? d : null;
  }
  function Xt(s) {
    const l = [];
    for (const d of s) {
      const u = e.nodes.one(d.parentId);
      if (!u?.relationships || b.get(u.id) === u || u.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const p = u.relationships.addFloatingAssociation(d.targetPoint, gn(d));
        l.push({ type: "addRelationship", data: { ...p } });
        continue;
      }
      const y = e.nodes.one(d.childId);
      if (!y || b.get(y.id) === y) continue;
      const f = u.relationships.addAssociation(y, gn(d));
      l.push({ type: "addRelationship", data: { ...f } });
    }
    return l;
  }
  function Ar(s) {
    const l = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const N = at(s, d.parentId);
        if (!N || b.get(N.id) !== N) continue;
        const z = { ...d, parentId: N.id }, G = JSON.stringify(z);
        l.add(d.id);
        const J = ue.get(d.id);
        if (J && J.key === G && J.holder === N && !J.other && N.relationships.hasAssociationId?.(d.id)) continue;
        J && e.nodes.one(J.holder.id) === J.holder && J.holder.relationships?.removeAssociation?.(d.id), N.relationships.addFloatingAssociation(d.targetPoint, gn(z)), ue.set(d.id, { holder: N, other: null, swapped: !1, key: G });
        continue;
      }
      const u = at(s, d.parentId), y = at(s, d.childId);
      if (!u || !y || u === y) continue;
      const f = b.get(u.id) !== u, p = f ? y : u, h = f ? u : y, x = f ? Vt({ ...d, parentId: p.id, childId: h.id }, d) : { ...d, parentId: p.id, childId: h.id }, O = JSON.stringify(x);
      l.add(d.id);
      const L = ue.get(d.id);
      L && L.key === O && L.holder === p && L.other === h && p.relationships.hasAssociationId?.(d.id) || (L && e.nodes.one(L.holder.id) === L.holder && L.holder.relationships?.removeAssociation?.(d.id), p.relationships.addAssociation(h, gn(x)), ue.set(d.id, { holder: p, other: h, swapped: f, key: O }));
    }
    for (const [d, u] of [...ue])
      l.has(d) || (e.nodes.one(u.holder.id) === u.holder && u.holder.relationships?.hasAssociationId?.(d) && u.holder.relationships.removeAssociation(d), ue.delete(d));
  }
  function _n(s) {
    const l = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !l?.relationships || !d || e.withPolicyAuthority(() => {
      (l.relationships.hasAssociationId?.(d) || !s.id) && l.relationships.removeAssociation(d);
    });
  }
  let pn = null;
  function Cr(s, l) {
    if (s === "addRelationship") {
      if (ue.get(l?.id)?.holder.id === l?.parentId) return;
      const d = !!l?.targetPoint, u = e.nodes.one(l?.parentId), y = d ? null : e.nodes.one(l?.childId), f = Qt(u), p = d ? null : Qt(y), h = pn?.lineId === l?.id ? t.lines?.find((z) => z.id === l?.id) : void 0;
      h && (pn = null);
      const x = (z) => {
        _n(l), h && F(I ?? t), e.announce?.(z), B(o.onRefuse, { reason: z, laneId: null });
      };
      if (!fn()) {
        _n(l), h && F(I ?? t);
        return;
      }
      if (!f || !p && !d) return x(h ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const O = d ? String(l.childId) : p;
      if (h) {
        const z = t.cards.some((ze) => ze.id === f), G = !d && t.cards.some((ze) => ze.id === p);
        if (!z && !G) return je({ remove: h.id });
        const J = { ...hn(l), id: h.id, parentId: f, childId: O }, q = In(t, J);
        if (q) return x(q);
        _n(l), je({ set: J });
        return;
      }
      const L = lr(t, f, O, hn(l)), N = In(t, L);
      if (N) return x(N);
      _n(l), je({ set: L });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...ue].find(([y, f]) => (y === l?.id || !l?.id && f.other?.id === l?.childId) && f.holder.id === l?.parentId)?.[0];
      if (!d) return;
      const u = ue.get(d);
      if (ue.delete(d), e.nodes.one(u.holder.id) !== u.holder || u.other && e.nodes.one(u.other.id) !== u.other || !fn())
        return fn() || k ? void 0 : F(I ?? t);
      pn = { lineId: d }, queueMicrotask(() => {
        k || pn?.lineId !== d || (pn = null, je({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(l) ? l : [l]) {
        const u = [...ue].find(([L, N]) => L === d?.associationId && N.holder.id === d?.id);
        if (!u) continue;
        const [y, f] = u, p = t.lines?.find((L) => L.id === y), h = f.holder.relationships?.getAssociations?.().find((L) => L.id === y);
        if (!p || !h) continue;
        if (!fn()) {
          F(I ?? t);
          continue;
        }
        const x = hn(h), O = f.swapped ? Vt({ ...x, id: p.id, parentId: p.parentId, childId: p.childId }, x) : { ...x, id: p.id, parentId: p.parentId, childId: p.childId };
        JSON.stringify(Tr(O)) !== JSON.stringify(p) && (ue.set(y, { ...f, key: "" }), je({ set: O }));
      }
  }
  function Tr(s) {
    return Gn({ ...t, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function je(s) {
    const l = t.lines?.find((h) => h.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? Gn(t, s.set) : Po(t, s.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), F(I ?? t);
    const u = "set" in s ? s.set : l, y = [u.parentId, u.childId].map((h) => t.cards.find((x) => x.id === h)?.label ?? e.nodes.one(h)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), f = (h) => y[h] || (h === 1 && u.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? l ? `The line from ${f(0)} to ${f(1)} changed.` : u.targetPoint ? `${f(0)} has a line to a point on the canvas.` : `${f(0)} is joined to ${f(1)}.` : `The line from ${f(0)} to ${f(1)} was taken away.`);
    const p = B(o.onChange, t, { line: s });
    yt(p, () => {
      if (k || t !== d) return;
      const h = l ? Gn(t, l) : "set" in s ? Po(t, s.set.id) : null;
      h && (t = h, F(I ?? t));
    });
  }
  function Sr(s) {
    const l = new Map(s.map((u) => [u.id, u])), d = new Map((t.lines ?? []).map((u) => [u.id, u]));
    for (const u of d.keys()) l.has(u) || je({ remove: u });
    for (const [u, y] of l)
      JSON.stringify(d.get(u)) !== JSON.stringify(y) && In(t, y) === null && je({ set: y });
  }
  function lt(s, l) {
    let d = t;
    const u = /* @__PURE__ */ new Map(), y = s.map(({ node: h, offer: x, from: O }) => {
      let L = x.lines;
      for (const [G, J] of u) L = Xe(L, G, J);
      d = yn(d, l, { ...x, ...L ? { lines: L } : {} });
      const N = d.cards[d.cards.length - 1];
      N.id !== h.id && u.set(h.id, N.id);
      const z = { ...h.options ?? {}, ...O ? { x: O.x, y: O.y } : {} };
      return { node: h, card: N, kept: z, lines: Xe(L ?? [], h.id, N.id), under: x.under };
    });
    e.beginHostStep?.(), t = d;
    let f = t;
    for (const { node: h, card: x } of y)
      x.id !== h.id && M.set(h.id, x.id), D.set(ie(ee.card(x.id)), { x: h.options?.x ?? 0, y: h.options?.y ?? 0 }), Ye(() => e.removeNode(h.id));
    e.endHostStep?.(), F(t), $r(ie(ee.card(y[0].card.id)));
    const p = t.lanes.find((h) => h.id === l);
    e.announce?.(y.length === 1 ? `${V(y[0].card)} is now a card in ${p.label}. ${$e(t, l)}.${Zt([y[0].card])}` : `${Jt(y.map(({ card: h }) => V(h)))} are now cards in ${p.label}. ${$e(t, l)}.${Zt(y.map(({ card: h }) => h))}`);
    for (const { node: h, card: x, kept: O, lines: L, under: N } of y) {
      const z = { cardId: x.id, laneId: l, noteToCard: {
        noteId: h.id,
        label: bt(t, x),
        ...N && { under: N },
        ...x.look ? { look: x.look } : {},
        ...x.asNote ? { asNote: x.asNote } : {},
        ...L.length ? { lines: L } : {}
      } }, G = () => {
        t !== f || !t.cards.some((q) => q.id === x.id) || (t = Y({ ...t, cards: t.cards.filter((q) => q.id !== x.id), lines: Xe(t.lines, x.id, h.id) }), f = t, F(t));
      }, J = B(o.onChange, t, z);
      e.holdTrade?.(h.id, J), eo(J, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: h.id, isComment: !1 } }]);
      }, () => {
        if (!k) {
          if (G(), !e.nodes.one(O.id)) {
            e.beginHostStep?.();
            const q = Ye(() => e.addNode({ ...O }));
            q && (q.announcedByCreator = !0), e.endHostStep?.();
            const ze = Xe(L, x.id, h.id).filter((fe) => !t.cards.some((Wn) => Wn.id === fe.parentId || Wn.id === fe.childId));
            q?.ready?.then?.(() => {
              k || Ye(() => Xt(ze));
            });
          }
          e.announce?.(`${V(x)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        k || (G(), e.keepTrade?.(h.id), e.announce?.(`Someone else put ${V(x)} on the board first.`));
      });
    }
  }
  function dt(s, l) {
    const d = t.cards.find((oe) => oe.id === s), u = t.lanes.find((oe) => oe.id === d.laneId), y = t.cards.findIndex((oe) => oe.id === s), f = t.cards.slice(y + 1).find((oe) => oe.laneId === d.laneId)?.id, p = E.get(ie(ee.card(s))) ?? {}, h = Uo(d), x = e.nodes.one(h) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : h, O = $o(t, s), { leave: L } = Ts(t, s, x), N = Lo(t, s, x), z = (Pe.cornerRadius ?? 0) > 0, G = d.asNote, J = G?.text !== void 0 && Xn(G.text) === d.label ? G.text : bt(t, d), q = {
      id: x,
      x: Math.round(l.x),
      y: Math.round(l.y),
      width: G?.width ?? p.width ?? 228,
      height: G?.height ?? p.height ?? 76,
      text: J,
      shape: G?.shape ?? (z ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? p.backgroundColor,
      fontColor: d.look?.textColor ?? p.foregroundColor,
      fontSize: d.look?.fontSize ?? p.fontSize,
      borderColor: d.look?.borderColor ?? p.borderColor,
      borderWidth: d.look?.borderWidth ?? p.borderWidth,
      ...d.look?.fontFamily ?? p.fontFamily ? { fontFamily: d.look?.fontFamily ?? p.fontFamily } : {}
    };
    G?.image && Object.assign(q, {
      image: G.image.src,
      ...G.image.width ? { imageOrigWidth: G.image.width } : {},
      ...G.image.height ? { imageOrigHeight: G.image.height } : {}
    }), G?.link && (q.link = { ...G.link });
    for (const oe of Object.keys(q)) q[oe] === void 0 && delete q[oe];
    e.beginHostStep?.(), t = N;
    const ze = t;
    x !== s ? M.set(x, s) : M.delete(x);
    const fe = Ye(() => e.addNode(q));
    fe && (fe.announcedByCreator = !0), e.endHostStep?.(), F(t);
    const Wn = Promise.resolve(fe?.ready).then(() => k || !fe || e.nodes.one(x) !== fe ? [] : Ye(() => Xt(L))).catch(() => []);
    fe?.ready?.then?.(() => {
      if (k || e.nodes.one(x) !== fe) return;
      const oe = () => e.selectNodes?.([fe]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(oe) : oe();
    }), e.announce?.(`${V(d)} is now a note on the canvas. ${u.label}: ${$e(t, u.id)}.${Ir(G?.shape)}`);
    const co = () => {
      e.nodes.one(x) === fe && (e.beginHostStep?.(), Ye(() => e.removeNode(x)), e.endHostStep?.());
    }, uo = B(o.onChange, t, { cardId: s, cardToNote: { noteId: x } });
    e.holdTrade?.(x, uo), eo(uo, () => {
      Wn.then((oe) => {
        fe && e.nodes.one(x) === fe && e.sendHeld?.([{ type: "onNodeAdded", data: { id: x, nodeOptions: yo(fe.options) } }, ...oe]);
      });
    }, () => {
      if (!k) {
        if (co(), t === ze && !t.cards.some((oe) => oe.id === s)) {
          const oe = {
            id: s,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...O.length ? { lines: O } : {}
          }, fo = yn(t, d.laneId, oe, f);
          fo && (t = fo, F(t));
        }
        e.announce?.(`${V(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      k || (co(), e.keepTrade?.(x), e.announce?.(`Someone else took ${V(d)} off the lanes first.`));
    });
  }
  function Lr(s, l, d) {
    const u = d.map((x) => x.id), y = u.indexOf(l), f = s.cards.find((x) => x.id === l);
    if (y < 0 || !f) return s;
    const p = s.cards.filter((x) => x !== f), h = p.findIndex((x) => u.indexOf(x.id) > y);
    return p.splice(h < 0 ? p.length : h, 0, f), Y({ ...s, cards: p });
  }
  function $r(s) {
    se = se.then(() => {
      const l = b.get(s);
      if (k || !l) return;
      const d = () => e.selectNodes?.([l]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Ye(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function eo(s, l, d, u) {
    if (!s || typeof s.then != "function") return l();
    const y = s.then((f) => {
      f === !0 ? l() : f === !1 ? d() : f === "taken" && u();
    }, () => d());
    e.holdUntil?.(y);
  }
  function Pr(s, l) {
    le(!1), H = { laneId: l.laneId, reason: l.reason, timer: setTimeout(() => le(), 1500) }, F(t, { skip: l.cardId });
    const d = t.lanes.find((u) => u.id === l.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${l.reason}`), B(o.onRefuse, l);
  }
  function le(s = !0) {
    H && (clearTimeout(H.timer), H = null, s && !k && Oe());
  }
  function Oe() {
    F(g && g.outcome.kind === "candidate" ? g.outcome.next : C?.next ?? I ?? t, { skip: g?.cardId });
  }
  function no(s) {
    const l = ao(s, to()), d = new Map(l.map((f) => [f.options.id, f.options])), u = (f, p, h, x = !1) => {
      const O = d.get(ee.column(f));
      O && (O.borderColor = p, O.borderWidth = h, delete O.borderStyle);
      const L = x && d.get(ee.lane(f));
      L && (L.borderColor = p, L.borderWidth = h);
    }, y = g?.cardId ?? C?.cardId;
    if (pe = /* @__PURE__ */ new Map(), y) {
      const f = t.cards.find((x) => x.id === y)?.laneId, p = To(t, y);
      if (!i || i.laneCues)
        for (const x of p) x.id !== f && (u(x.id, Io, 2), pe.set(x.id, "open"));
      if (i?.laneCues) {
        for (const x of t.lanes) if (!p.includes(x)) {
          const O = d.get(ee.column(x.id));
          O && (O.backgroundColor = "#e9e8e2"), pe.set(x.id, "closed");
        }
      }
      const h = g ? g.outcome : C?.laneId ? { kind: "candidate", laneId: C.laneId } : null;
      h?.kind === "candidate" && (u(h.laneId, xo, 3, !0), pe.set(h.laneId, "over")), h?.kind === "refused" && (u(h.laneId, gt, 3), pe.set(h.laneId, "refused"));
    }
    if (S && !y) {
      for (const f of S.open) f !== S.laneId && (u(f, Io, 2), pe.set(f, "open"));
      S.laneId && !S.refusal && (u(S.laneId, xo, 3, !0), pe.set(S.laneId, "over")), S.laneId && S.refusal && (u(S.laneId, gt, 3), pe.set(S.laneId, "refused"));
    }
    if (C?.laneId === null && C.spot) {
      const f = d.get(ee.card(C.cardId));
      f && (f.xPos = C.spot.x, f.yPos = C.spot.y);
    }
    if (H) {
      pe.set(H.laneId, "refused"), u(H.laneId, gt, 3, !0);
      const f = d.get(ee.caption(H.laneId));
      f && (f.text = H.reason, f.foregroundColor = "#b42318");
    }
    if (me = /* @__PURE__ */ new Set(), I && s === I) {
      const f = (h, x) => JSON.stringify(h) === JSON.stringify(x), p = (h) => {
        const x = d.get(h);
        x && (x.borderStyle = "dashed", x.borderColor = ls, x.borderWidth = 2, me.add(ie(h)));
      };
      for (const h of s.cards) f(h, t.cards.find((x) => x.id === h.id)) || p(ee.card(h.id));
      for (const h of s.lanes) f(h, t.lanes.find((x) => x.id === h.id)) || p(ee.lane(h.id));
    }
    for (const f of l) {
      f.options.id = ie(f.options.id);
      for (const p of f.relationships.associations)
        p.parentId = ie(p.parentId), p.childId = ie(p.childId);
    }
    return l;
  }
  function to() {
    return g || C ? t.lanes.map((s) => t.cards.filter((l) => l.laneId === s.id).length) : void 0;
  }
  function F(s, l = {}) {
    if (k) return;
    Ie = l.layout ?? te, qe = { model: s, skip: l.skip, grip: l.grip, animate: l.animate !== !1 };
    const d = no(s), u = [];
    for (const { options: f } of d) {
      const p = f.id;
      if (b.has(p)) continue;
      const h = D.get(p);
      D.delete(p);
      const x = h && l.animate !== !1 && !mt() ? { ...f, xPos: h.x, yPos: h.y } : f, O = e.nodes.add(Qr(x));
      b.set(p, O), E.set(p, { ...x }), O.ready && u.push(O.ready.then(() => {
        if (b.get(p) !== O) return;
        O.applyGovernance?.(), ce(p)?.kind === "column" && O.toBack?.(!1), ce(p)?.kind === "handle" && O.svgGroup?.front?.();
        const L = lo(qe?.model ?? s, p);
        L && O.svgGroup?.node?.setAttribute("aria-label", L);
      }).catch(() => {
      }));
    }
    const y = qe;
    se = Promise.all([se, ...u]).then(() => {
      k || qe !== y || Or(no(y.model), y);
    }).catch((f) => console.warn("WORKSHOP: could not draw the workshop", f));
  }
  function Or(s, l) {
    const d = new Set(s.map((y) => y.options.id)), u = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [f, p] of [...b]) {
        if (d.has(f)) continue;
        for (const [x, O] of [..._])
          O.parentId !== f && O.childId !== f || (O.parent.relationships?.removeAssociation(x), _.delete(x));
        e.deselectNode?.(p), p.editor?.cancelInline?.(), b.delete(f), E.delete(f);
        const h = a.get(f);
        h && (a.delete(f), U.delete(h)), e.nodes.remove(f);
      }
      for (const { options: f } of s) {
        const p = f.id, h = b.get(p);
        if (!h?.svgGroup) continue;
        const x = E.get(p) ?? {}, O = h.editor?.isInlineEditing?.();
        (f.fontSize !== x.fontSize || f.foregroundColor !== x.foregroundColor) && (h.options.fontSize = f.fontSize, h.options.fontColor = f.foregroundColor, h.applyTextStyle?.()), f.text !== x.text && !O && h.setText?.(f.text), (f.width !== x.width || f.height !== x.height) && (f.vectorPath ? (h.options.width = f.width, h.options.height = f.height, h.setShape?.(h.options.shape, f.vectorPath), ce(p)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(f.width, f.height)), f.backgroundColor !== x.backgroundColor && h.setColors?.(f.backgroundColor), (f.borderColor !== x.borderColor || f.borderWidth !== x.borderWidth || f.borderStyle !== x.borderStyle) && (h.options.borderColor = f.borderColor, h.options.borderWidth = f.borderWidth, h.options.borderStyle = f.borderStyle, h.applyBorder?.());
        const L = f.xPos !== x.xPos || f.yPos !== x.yPos || Math.abs((h.options.x ?? 0) - f.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - f.yPos) > 0.5;
        if (p !== (l.skip && ie(ee.card(l.skip))) && p !== (l.grip && ie(l.grip)) && L) {
          const G = l.animate && !mt() ? 180 : 0, J = u.includes(h) ? () => {
            !k && b.get(p) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          J && G && u.length === 1 && h.resizeRotate?.disable?.(), h.position(f.xPos, f.yPos, J, void 0, G);
        }
        const N = lo(l.model, p);
        N && h.svgGroup.node.getAttribute("aria-label") !== N && h.svgGroup.node.setAttribute("aria-label", N), me.has(p) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed"), h.svgGroup.node.toggleAttribute?.("data-workshop-focused", Ae);
        const z = ce(p);
        if (z?.kind === "column") {
          const G = pe.get(z.key);
          G ? h.svgGroup.node.setAttribute("data-workshop-drop", G) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        z?.kind === "handle" && h.svgGroup.front?.(), E.set(p, { ...f });
      }
      const y = /* @__PURE__ */ new Map();
      for (const f of s) for (const p of f.relationships.associations) y.set(p.id, p);
      for (const [f, p] of [..._])
        y.has(f) && b.get(p.parentId) === p.parent && b.get(p.childId) === p.child || (p.parent.relationships?.removeAssociation(f), _.delete(f));
      for (const [f, p] of y) {
        if (_.has(f)) continue;
        const h = b.get(p.parentId), x = b.get(p.childId);
        !h?.relationships || !x?.svgGroup || (h.relationships.addAssociation(x, gn(p)), _.set(f, { parentId: p.parentId, childId: p.childId, parent: h, child: x }));
      }
      Ar(l.model);
    }), Ze(l.model), e.notifyNodeChanged?.();
  }
  let ye = null;
  function oo(s) {
    const l = ce(s);
    return l ? l.kind === "card" ? l.key : i?.cardOfPart?.(t, we(s)) ?? null : null;
  }
  function ro() {
    if (T) return i?.cardOfPart?.(t, T.name) ?? null;
    if (g) return g.cardId;
    if (Pn) return Pn;
    const s = k ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && b.get(s[0].id) === s[0] ? oo(s[0].id) : null;
  }
  let ct = null;
  function so() {
    k || !c || !ye || ro() !== ct && Ze(ye);
  }
  function Ze(s) {
    if (c) {
      ye = s, ct = ro();
      const l = t.lanes.map((y) => b.get(ie(ee.column(y.id)))?.svgGroup?.node).reduce((y, f) => f && (!y || y.compareDocumentPosition(f) & 4) ? f : y, null), d = e.canvas?.viewbox?.(), u = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - Q.x, y: d.y - Q.y, width: d.width, height: d.height } : null;
      c.draw(t, s === t ? null : s, {
        origin: Q,
        layout: Ie,
        above: l,
        view: u,
        announce: (y) => e.announce?.(y),
        focus: ct,
        boardFocused: Ae,
        picked: w,
        onPick: Mr,
        gripSize: dn,
        clamp: T?.last?.clampedReason ? { name: T.name, text: T.last.clampedReason } : g?.outcome.kind === "candidate" && g.outcome.said ? { name: "card-" + g.cardId, text: g.outcome.said } : !T && R ? { name: R.name, text: R.reason } : null,
        refused: !!T?.last?.refusal || !T && !!R,
        onUnlink: (y, f) => {
          if (v || I || g || T || Je()) return;
          const p = t.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: f }, to: { id: y } } : { kind: "unlink_tasks", card: { id: y }, waitsOn: { id: f } }, h = en(t, [p]);
          "refused" in h ? e.announce?.(h.refused.reason) : Rn(h.workshop, t.lanes[0]?.station ? { laneId: f } : { cardId: y });
        }
      });
    }
  }
  function mn(s) {
    return { x: s.x - Q.x, y: s.y - Q.y };
  }
  function Ve(s) {
    return i ? i.places(s, Ie) : { ...De(s, { layout: te }), parts: [] };
  }
  function Er(s, l) {
    const d = i.places(s, Ie).parts.find((u) => u.name === l);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function io() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function Nr() {
    Ln?.(), Ln = null, dn = wt(io());
    const s = e.canvas?.node;
    if (!Mn() || !s || typeof MutationObserver > "u") return;
    let l = null;
    const d = () => {
      if (l = null, k || !Mn()) return;
      if (T || g) {
        l = setTimeout(d, 250);
        return;
      }
      const y = wt(io());
      Math.abs(y - dn) < 2 || (dn = y, F(I ?? t));
    }, u = new MutationObserver(() => {
      l && clearTimeout(l), l = setTimeout(d, 200);
    });
    u.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), Ln = () => {
      u.disconnect(), l && clearTimeout(l);
    };
  }
  function Mn() {
    return !i && !!t.lanes[0]?.station && Ae && !v && !I && !Je();
  }
  function _r(s) {
    const l = Do(s);
    if (!l || !Mn()) return null;
    const d = t;
    return (u) => {
      const y = os(d, u), f = ss(d, l, l.kind === "link" && y === l.from ? null : y);
      return f.next ? { next: f.next } : { next: d, clampedReason: f.refusal, refusal: f.refusal };
    };
  }
  function Mr(s) {
    if (k || Ae) return;
    const l = e.getSelectedNodes?.() ?? [];
    m = new Set(l.map((f) => f.id)), w = s, l.length && e.clearSelection?.(), ye && Ze(ye), Ke();
    const [d, u] = s.split(">"), y = (f) => t.lanes.find((p) => p.id === f)?.label ?? f;
    e.announce?.(`Path from ${y(d)} to ${y(u)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function ao(s, l) {
    if (!i) {
      const u = _s(s, { native: !0, origin: Q, rows: l, layout: te, style: Pe }).nodes;
      return Mn() ? [...u, ...Go(t, Q, dn)] : u;
    }
    const d = i.notes(s, Ie, Q, Pe);
    if (s.behaviour && d.length) {
      const u = d.map((h) => h.options), y = Math.min(...u.map((h) => h.xPos)), f = Math.max(...u.map((h) => h.xPos + h.width)), p = wr(s, { x: y, y: Math.max(...u.map((h) => h.yPos + h.height)) + 16, width: Math.min(f - y, 484) }, Pe);
      p && d.push(p);
    }
    return d;
  }
  function Rn(s, l, d) {
    const u = i ? i.editsBetween(t, s) : is(t, s);
    if (!u.length) return !1;
    const y = en(t, u);
    return "refused" in y ? (e.announce?.(y.refused.reason), B(o.onRefuse, { ...l, laneId: y.refused.laneId, reason: y.refused.reason }), !1) : (t = y.workshop, F(t, { skip: d }), e.announce?.(y.report.edits.map((f) => f.said).join(" ")), B(o.onChange, t, { ...l, edits: u }), !0);
  }
  function lo(s, l) {
    const d = ce(l);
    if (d?.kind === "lane") {
      const u = s.lanes.find((y) => y.id === d.key);
      return u ? `${u.label}, ${$e(s, u.id)}` : null;
    }
    if (d?.kind === "card") {
      const u = s.cards.find((f) => f.id === d.key), y = u && s.lanes.find((f) => f.id === u.laneId);
      return u && y ? `${u.label || "Empty card"}, in ${y.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? i ? i.label?.(s, we(l)) ?? null : rs(s, we(l)) : null;
  }
  function ut(s, l) {
    const d = ao(s).find((u) => u.options.id === l)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Fe() {
    (g || T) && e.cancelGovernedDrag?.("host"), g = null, T = null, C && (C = null, B(o.onPreview, null)), le(!1);
  }
  return {
    toCanvas(s) {
      if (k || v || Je()) return "This workshop is view-only here.";
      if (!t.cards.some((y) => y.id === s)) return "That card is no longer on the board.";
      const l = Hn(t, s);
      if (l) return l;
      C && We(), I && (Fe(), I = null, F(t), e.refreshGovernance?.());
      const { width: d } = Ve(t), u = b.get(ie(ee.card(s)))?.options;
      return dt(s, { x: Q.x + d + 32, y: u?.y ?? Q.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...Q };
    },
    get layout() {
      return { ...te };
    },
    get bounds() {
      const { width: s, height: l } = Ve(t);
      return { x: Q.x, y: Q.y, width: s, height: l };
    },
    get focused() {
      return Ae;
    },
    setFocused(s) {
      if (k) return;
      const l = Ae;
      Ae = !!s;
      for (const d of b.values()) d.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Ae);
      l !== Ae && (w && (w = null, queueMicrotask(Ke)), !i && t.lanes[0]?.station ? (Fe(), Nr(), F(I ?? t)) : ye && Ze(ye));
    },
    setLayout(s) {
      if (k) throw new Error("This workshop has been detached.");
      const l = Ao(s);
      i ? i.places(t, l) : De(t, { layout: l }), JSON.stringify(l) !== JSON.stringify(te) && (Fe(), te = l, F(I ?? t));
    },
    whenDrawn: () => se,
    update(s) {
      if (k) throw new Error("This workshop has been detached.");
      const l = Y(s);
      Fe(), t = l;
      const d = v;
      v = A || r(t), F(I ?? t), v !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (k) throw new Error("This workshop has been detached.");
      const l = s ? Y(s) : null;
      Fe(), I = l, F(I ?? t), e.refreshGovernance?.();
    },
    refuse(s, l) {
      const d = t.lanes.find((u) => u.id === s);
      k || !d || (le(!1), H = { laneId: s, reason: l, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${d.label}: ${l}`));
    },
    setReadOnly(s) {
      A = !!s;
      const l = A || r(t);
      k || v === l || (Fe(), v = l, F(I ?? t), e.refreshGovernance?.());
    },
    destroy() {
      k || (Fe(), k = !0, Ln?.(), R && clearTimeout(R.timer), e.element?.removeEventListener?.("pointerdown", Bt, !0), Me && clearTimeout(Me), e.element?.ownerDocument?.removeEventListener?.("pointerup", Ht, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", Gt, !0), yr?.(), c && e.element?.removeEventListener?.("pointerover", Dt), e.withPolicyAuthority(() => {
        for (const [s, l] of ue) e.nodes.one(l.holder.id) === l.holder && l.holder.relationships?.removeAssociation?.(s);
        for (const [s, l] of _) l.parent.relationships?.removeAssociation(s);
        for (const [s, l] of b)
          e.deselectNode?.(l), l.editor?.cancelInline?.(), e.nodes.one(s) === l && e.nodes.remove(s);
      }), _.clear(), ue.clear(), b.clear(), E.clear(), U.clear(), a.clear(), gr(), c?.destroy(), $n = !1, Ke(), e.notifyNodeChanged?.());
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
function yt(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function fs(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function Ao(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function hs(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const i of n)
    o = Math.max(o, (i.options.x ?? 0) + (i.options.width ?? 0)), t = Math.min(t, i.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const ps = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function de(e) {
  return ps.includes(e.kind) ? e.kind : void 0;
}
function he(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ke(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function ms(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Tn(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Tn(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const Qn = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function St(e) {
  if (typeof e != "string" || !Qn.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function Uo(e) {
  return e.noteId ?? e.id;
}
function Xn(e) {
  const n = Tn(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function qo(e) {
  const n = he(e);
  let o;
  try {
    o = new URL(ke(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: ke(n.alt, 240) };
}
function xe(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Ko = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, ws = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Lt(e) {
  const n = he(e), o = {}, t = (r) => {
    if (typeof r != "string" || !Ko.test(r)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return r;
  }, i = (r, c, w) => {
    if (typeof r != "number" || !Number.isFinite(r) || r < c || r > w) throw new Error("A card size is out of range.");
    return r;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !ws.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = i(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = i(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Jo(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        Lt({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Lt(n);
}
function $t(e) {
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
function Co(e) {
  try {
    return !!Zn({ link: e });
  } catch {
    return !1;
  }
}
function Zn(e) {
  const n = he(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const t = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (t.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    o.text = t;
  }
  if (n.image !== void 0) {
    const t = he(n.image);
    if (!$t(t.src)) throw new Error("A card keeps a picture by its web address only.");
    o.image = { src: t.src };
    for (const i of ["width", "height"]) {
      const r = t[i];
      if (r !== void 0) {
        if (typeof r != "number" || !Number.isFinite(r) || r < 1 || r > 2e4) throw new Error("A picture size is out of range.");
        o.image[i] = r;
      }
    }
  }
  if (n.link !== void 0) {
    const t = he(n.link), i = t.data;
    if (!(typeof i == "string" ? i.length <= 2048 : !!i && typeof i == "object" && !Array.isArray(i) && JSON.stringify(i).length <= 2048 && Object.values(i).every((c) => typeof c == "string")) || t.type !== void 0 && (typeof t.type != "string" || !/^[A-Za-z]{1,40}$/.test(t.type)) || t.show !== void 0 && typeof t.show != "boolean") throw new Error("A card keeps a link as a note does.");
    o.link = {
      ...t.type !== void 0 ? { type: t.type } : {},
      data: i,
      ...t.show !== void 0 ? { show: t.show } : {}
    };
  }
  if (n.shape !== void 0) {
    if (typeof n.shape != "string" || !/^[a-z]{1,24}$/i.test(n.shape)) throw new Error("A card keeps a shape by its name only.");
    o.shape = n.shape;
  }
  for (const t of ["width", "height"]) {
    const i = n[t];
    if (i !== void 0) {
      if (typeof i != "number" || !Number.isFinite(i) || i < 10 || i > 4e3) throw new Error("A note size is out of range.");
      o[t] = i;
    }
  }
  return Object.keys(o).length ? o : void 0;
}
const rn = 96, gs = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, ys = ["solid", "dashed", "dotted"], ks = 1e7;
function sn(e) {
  const n = he(e);
  if (typeof n.id != "string" || !gs.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: St(n.parentId), childId: St(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (i, r, c) => {
    const w = n[i];
    if (w != null) {
      if (typeof w != "number" || !Number.isFinite(w) || w < r || w > c) throw new Error("A line's look is out of range.");
      o[i] = w;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !Ko.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!ys.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
  for (const i of ["showParentArrow", "showChildArrow"])
    if (!(n[i] === void 0 || n[i] === null)) {
      if (typeof n[i] != "boolean") throw new Error("A line's arrows are on or off.");
      o[i] = n[i];
    }
  if (n.label !== void 0 && n.label !== null && n.label !== "") {
    if (typeof n.label != "string" || n.label.length > 200 || /[<>\u0000-\u001f]/.test(n.label)) throw new Error("A line's label is plain words, up to 200 characters.");
    o.label = n.label;
  }
  if (n.targetPoint !== void 0 && n.targetPoint !== null) {
    const i = he(n.targetPoint), r = (c) => typeof c == "number" && Number.isFinite(c) && Math.abs(c) <= ks;
    if (!r(i.x) || !r(i.y) || Object.keys(i).some((c) => c !== "x" && c !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    o.targetPoint = { x: Math.round(i.x * 100) / 100, y: Math.round(i.y * 100) / 100 };
  }
  for (const i of ["sourceAnchor", "targetAnchor"]) {
    if (i === "targetAnchor" && o.targetPoint) continue;
    const r = n[i];
    if (r == null) continue;
    const c = he(r), w = (m) => typeof m == "number" && Number.isFinite(m) && m >= 0 && m <= 1;
    if (!w(c.x) || !w(c.y) || Object.keys(c).some((m) => m !== "x" && m !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    o[i] = { x: c.x, y: c.y };
  }
  return o;
}
function bs(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(sn).map((t) => Yo(t, n)).filter((t) => t.targetPoint ? n.has(t.parentId) : n.has(t.parentId) || n.has(t.childId));
  if (Ee(o.map((t) => t.id), "line ID"), o.length > rn) throw new Error(`A workshop holds up to ${rn} lines.`);
  return o;
}
function Yo(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: o, ...t } = e;
  return t;
}
function Ee(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function jt({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((i) => i.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function vs(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const on = (e) => "lane-" + e, _e = (e) => "card-" + e, et = (e) => "image-" + e;
function si(e) {
  const n = vs(e);
  return jt(e).map((o) => {
    const t = e.cards.filter((c) => c.laneId === o.id), i = n.filter((c) => c.laneId === o.id), r = [on(o.id)];
    return o.station?.image && r.push(et(o.id)), { lane: o, cards: t, signals: i, nodeIds: [...r, ...t.map((c) => _e(c.id))] };
  });
}
const Zo = 5, kn = 24, Pt = 3;
function Y(e) {
  const n = he(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !de(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = de(n), i = t ? be(t) : void 0, r = { id: xe }, c = ke(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Zo)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const w = i?.cards ?? [kn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > w[0]) throw new Error(w[1]);
  const m = n.lanes.map((v) => {
    const k = he(v), b = { id: xe(k.id), label: ke(k.label) };
    if (k.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (k.capacity !== void 0) {
      const E = o ? 576 : 24;
      if (typeof k.capacity != "number" || !Number.isInteger(k.capacity) || k.capacity < 1 || k.capacity > E)
        throw new Error(`Lane capacity must be a whole number from 1 to ${E}.`);
      b.capacity = k.capacity;
    }
    if (i?.readLane?.(k, b, r), k.station !== void 0) {
      const E = he(k.station), _ = (a) => {
        if (typeof a != "number" || !Number.isInteger(a) || a < 0 || a >= Pt)
          throw new Error("Use map coordinates from 0 to 2.");
        return a;
      };
      if (!Array.isArray(E.next) || E.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const U = E.next.map(xe);
      Ee(U, "onward stop"), b.station = { column: _(E.column), row: _(E.row), next: U, outcome: ke(E.outcome, 160) }, E.image !== void 0 && (b.station.image = qo(E.image));
    }
    return b;
  }), T = m.map((v) => v.id);
  if (Ee(T, "lane ID"), t && m.some((v) => v.station)) throw new Error("A business board has no map stations.");
  if ((o || m.some((v) => v.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (m.some((v) => v.station) && n.cards.every((v) => v?.free === !0))
    throw new Error("A map needs at least one token.");
  if (m.some((v) => v.station)) {
    if (!m.every((v) => v.station)) throw new Error("Give every station on the map a position.");
    Ee(m.map((v) => v.station.column + "," + v.station.row), "map position");
    for (const v of m)
      if (v.station.next.some((k) => k === v.id || !T.includes(k))) throw new Error("Connect each stop to another station on this map.");
  }
  const I = n.cards.map((v) => {
    const k = he(v), b = { id: xe(k.id), label: t ? ke(k.label) : ms(k.label), laneId: xe(k.laneId) };
    if (!T.includes(b.laneId)) throw new Error("Card refers to an unknown lane.");
    if (k.allowedLaneIds !== void 0) {
      if (!Array.isArray(k.allowedLaneIds) || k.allowedLaneIds.length > m.length) throw new Error("Invalid allowed lanes.");
      if (b.allowedLaneIds = k.allowedLaneIds.map(xe), Ee(b.allowedLaneIds, "allowed lane"), !b.allowedLaneIds.includes(b.laneId) || !b.allowedLaneIds.every((E) => T.includes(E)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (k.look !== void 0) {
      const E = Lt(k.look);
      E && (b.look = E);
    }
    if (k.asNote !== void 0) {
      const E = Zn(k.asNote);
      E && (b.asNote = E);
    }
    if (k.noteId !== void 0 && k.noteId !== b.id && (b.noteId = St(k.noteId)), k.free !== void 0) {
      if (k.free !== !0 || !m.some((E) => E.station)) throw new Error("Only a map’s cards can be free of its paths.");
      b.free = !0;
    }
    if (i?.readCard(k, b, r), o) {
      if (typeof k.points != "number" || !Number.isInteger(k.points) || k.points < 1 || k.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (b.points = k.points, k.dependsOn !== void 0) {
        if (!Array.isArray(k.dependsOn) || k.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        b.dependsOn = k.dependsOn.map(xe), Ee(b.dependsOn, "dependency");
      }
    }
    return b;
  });
  Ee(I.map((v) => v.id), "card ID");
  const A = { version: 1, title: c, lanes: m, cards: I };
  if (n.experience !== void 0) {
    const v = he(n.experience);
    if (v.version !== 1 || v.kind !== "customer-interviews" && v.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    A.experience = { version: 1, kind: v.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    A.signals = n.signals.map((v) => {
      const k = he(v), b = xe(k.cardId), E = xe(k.laneId);
      if (!I.some((_) => _.id === b) || !T.includes(E))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: xe(k.id),
        label: ke(k.label),
        cardId: b,
        laneId: E,
        whenPresent: ke(k.whenPresent, 160),
        whenAbsent: ke(k.whenAbsent, 160)
      };
    }), Ee(A.signals.map((v) => v.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !t) {
    const v = bs(n.lines, new Set(I.map((k) => k.id)));
    v.length && (A.lines = v);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    A.presentationOrder = jt({ lanes: m, presentationOrder: n.presentationOrder }).map((v) => v.id);
  }
  if (n.behaviour !== void 0 && (A.behaviour = ge().validate(n.behaviour, { ...A, kind: n.kind })), o)
    return A.kind = "release-plan", Rr(A), A;
  if (t && i) {
    A.kind = t, i.readBoard(n, A, r);
    const v = i.validate(A);
    if (v) throw new Error(v);
    return A;
  }
  for (const v of m)
    if (Ge({ cards: I }, v.id) > (v.capacity ?? 1 / 0))
      throw new Error(`Lane "${v.label}" exceeds its capacity.`);
  return A;
}
function Ge(e, n) {
  return e.cards.filter((o) => o.laneId === n && !o.free).length;
}
const Vo = 65536;
function ii(e) {
  const n = JSON.stringify(Y(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Vo) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function ai(e) {
  if (e.length > Vo) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return Y(t);
}
function Ft(e, n, o) {
  const t = de(e);
  return t ? be(t).planMove(e, n, o) : void 0;
}
function Vn(e, n) {
  if (de(e)) return e.lanes.filter((t) => Ft(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => Cn(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return o && n.free ? e.lanes : e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && Ge(e, t.id) < (t.capacity ?? 1 / 0));
}
function Ot(e, n, o) {
  const t = e.cards.find((r) => r.id === n), i = Ft(e, n, o);
  if (i !== void 0) {
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (t && e.kind === "release-plan") {
    const r = Cn(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !Vn(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
function vn(e, n, o) {
  const t = Qo(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in ge().check(e, t) ? null : t;
}
function Qo(e, n, o) {
  const t = e.cards.find((c) => c.id === n);
  if (!t || !e.lanes.some((c) => c.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return Cn(e, t, o);
  const i = Ft(e, n, o);
  if (i !== void 0) return i;
  const r = Ms(e, n, o);
  return r || (o === "prototype" && Ue(e) === "customer-interviews" ? null : Vn(e, t).some((c) => c.id === o) ? Ot(e, n, o) : null);
}
function To(e, n) {
  return e.lanes.filter((o) => vn(e, n, o.id) !== null);
}
function xn(e, n, o) {
  const t = Qo(e, n, o);
  if (t !== null) {
    const A = t === e || !e.behaviour ? null : ge().check(e, t);
    return A && "refused" in A ? A.refused.sentence : null;
  }
  const i = e.cards.find((A) => A.id === n), r = e.lanes.find((A) => A.id === o);
  if (!i || !r) return "That move is not available.";
  const c = de(e), w = c && be(c).refusal;
  if (w) return w(e, n, o);
  const m = `This card can't go in ${r.label}.`;
  if (i.allowedLaneIds && !i.allowedLaneIds.includes(o)) return m;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return m;
    const A = He(e, o), v = { ...e, lanes: e.lanes.map((b) => b === r ? { id: r.id, label: r.label } : b) }, k = Cn(v, i, o);
    return k ? `Needs ${He(k, o) - A} points. It already holds ${A} of ${r.capacity} points.` : m;
  }
  const T = e.lanes.find((A) => A.id === i.laneId);
  if (T?.station && !i.free && !T.station.next.includes(o)) return `${r.label} can't be reached from ${T.label}.`;
  const I = Ge(e, o);
  if (r.capacity !== void 0 && I >= r.capacity && !(T?.station && i.free)) {
    const A = T?.station ? r.capacity === 1 ? "token" : "tokens" : r.capacity === 1 ? "card" : "cards";
    return `It already holds ${I} of ${r.capacity} ${A}.`;
  }
  return m;
}
function kt(e) {
  return !0;
}
function xs(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !Ue(e);
}
function Is(e) {
  const n = Ue(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function As(e) {
  const n = Tn(e), o = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), t = o ? Number(o[2]) : 1;
  return { label: (o ? o[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, t)) };
}
const Cs = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function an(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && Cs.test(n) && !o.has(n) ? n : Sn(e, "card");
}
function nn(e, n, o) {
  const t = e.lanes.find((w) => w.id === n);
  if (!t) return "That lane is no longer on the board.";
  const i = Is(e);
  if (i) return i;
  if (e.kind === "release-plan")
    return e.cards.length >= kn ? `This board is at its size limit of ${kn} cards. Remove a card to make room.` : (Array.isArray(o?.lines) ? o.lines.length : o?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : rr(e, n, o) ? null : xn(or(e, n, o), an(e, o.id), n);
  if (de(e)) {
    if (!(typeof o?.label == "string" && Tn(o.label))) return "A card needs some words. Type on the note first.";
    if (Array.isArray(o.lines) ? o.lines.length : o.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const w = sr(e, n, o);
    return typeof w == "string" ? w : So(e, w);
  }
  if (e.cards.length >= kn) return `This board is at its size limit of ${kn} cards. Remove a card to make room.`;
  const r = e.lanes.some((w) => w.station);
  if (r && (Array.isArray(o?.lines) ? o.lines.length : o?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const c = Ge(e, n);
  if (t.capacity !== void 0 && !r && c >= t.capacity) return `It already holds ${c} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const w = nr(o.lines);
    if (!w) return "A line of this note can't be joined to a card.";
    const m = new Set((e.lines ?? []).map((T) => T.id));
    if ((e.lines?.length ?? 0) + w.filter((T) => !m.has(T.id)).length > rn)
      return `A workshop holds up to ${rn} lines.`;
  }
  return So(e, { ...e, cards: [...e.cards, { id: an(e, o.id), label: Xn(typeof o.label == "string" ? o.label : ""), laneId: n }] });
}
function So(e, n) {
  if (!e.behaviour) return null;
  const o = ge().check(e, n);
  return "refused" in o ? o.refused.sentence : null;
}
function Xo(e) {
  try {
    return e && typeof e == "object" ? Jo(e) : void 0;
  } catch {
    return;
  }
}
function er(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      Zn({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? Zn(n) : void 0;
}
function nr(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let i = null;
    try {
      i = sn(t);
    } catch {
      const r = (w) => {
        const { id: m, parentId: T, childId: I, targetPoint: A } = he(t);
        return sn({ id: m, parentId: T, childId: I, ...w ? { targetPoint: A } : {} });
      }, c = t?.targetPoint !== void 0 && t?.targetPoint !== null;
      try {
        i = r(!0);
      } catch {
        try {
          i = c ? null : r(!1);
        } catch {
          i = null;
        }
      }
    }
    if (!i) return null;
    o.push(i);
  }
  return o;
}
function nt(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function Xe(e, n, o) {
  return e && e.map((t) => nt(t, n, o));
}
function tr(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function yn(e, n, o, t) {
  if (nn(e, n, o) !== null) return null;
  if (e.kind === "release-plan") return rr(e, n, o, t);
  if (de(e)) {
    const b = sr(e, n, o), E = b.cards[b.cards.length - 1], _ = t === void 0 ? -1 : e.cards.findIndex((U) => U.id === t && U.laneId === n);
    return _ < 0 ? b : { ...b, cards: [...e.cards.slice(0, _), E, ...e.cards.slice(_)] };
  }
  const i = Xo(o.look), r = typeof o.label == "string" ? Tn(o.label) : "";
  let c = er(o.asNote);
  r.length > 80 && c?.text === void 0 && r.length <= 4e3 && (c = { ...c, text: r });
  const w = an(e, o.id), m = w !== o.id && typeof o.id == "string" && Qn.test(o.id) ? o.id : void 0, T = e.lanes.some((b) => b.station), I = {
    id: w,
    label: Xn(r),
    laneId: n,
    ...i ? { look: i } : {},
    ...c ? { asNote: c } : {},
    ...m ? { noteId: m } : {},
    ...T ? { free: !0 } : {}
  }, A = t === void 0 ? -1 : e.cards.findIndex((b) => b.id === t && b.laneId === n), v = A < 0 ? [...e.cards, I] : [...e.cards.slice(0, A), I, ...e.cards.slice(A)], k = o.lines === void 0 ? void 0 : tr(e, nr(o.lines).map((b) => nt(b, o.id, I.id)));
  return Y({ ...e, cards: v, ...k ? { lines: k } : {} });
}
function or(e, n, o, t) {
  const { label: i, points: r } = As(typeof o.label == "string" ? o.label : ""), c = an(e, o.id), w = c !== o.id && typeof o.id == "string" && Qn.test(o.id) ? o.id : void 0, m = { id: c, label: i, laneId: e.lanes[e.lanes.length - 1].id, points: r, ...w ? { noteId: w } : {} }, T = t === void 0 ? -1 : e.cards.findIndex((I) => I.id === t && I.laneId === n);
  return { ...e, cards: T < 0 ? [...e.cards, m] : [...e.cards.slice(0, T), m, ...e.cards.slice(T)] };
}
function rr(e, n, o, t) {
  const i = or(e, n, o, t), r = an(e, o.id), c = i.cards.find((m) => m.id === r);
  if (c.laneId === n) return Y(i);
  const w = Cn(i, c, n);
  return w ? Y(w) : null;
}
function sr(e, n, o) {
  const t = be(de(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const i = en(e, [{ kind: "add_card", lane: { id: n }, ...t, ...o.under && { under: { id: o.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const r = i.workshop.cards, c = an(e, o.id), w = c !== o.id && typeof o.id == "string" && Qn.test(o.id) ? o.id : void 0, m = Xo(o.look), T = er(o.asNote);
  return r[r.length - 1] = {
    ...r[r.length - 1],
    id: c,
    ...w ? { noteId: w } : {},
    ...m ? { look: m } : {},
    ...T ? { asNote: T } : {}
  }, i.workshop;
}
function ir(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = de(e);
  return o ? be(o).cardText(e, n) : n.label;
}
function bt(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const o = de(e);
  return o ? be(o).noteText(e, n) : n.label;
}
function Hn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (Ue(e)) return "This card stays on the board.";
  if (e.lanes.some((t) => t.station) && !o.free) return "The token stays on the map.";
  if (e.kind === "release-plan") {
    const t = e.cards.find((i) => i.dependsOn?.includes(n));
    if (t) return `${t.label} depends on ${o.label}, so it stays a card.`;
  }
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (e.cards.some((t) => t.parentId === n)) return `${o.label} has cards under it, so it stays a card. Move them first.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((r) => e.lanes.find((c) => c.id === r).label), i = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${i}, so it stays a card.`;
  }
  return null;
}
function Lo(e, n, o = ar(e, n)) {
  if (Hn(e, n) !== null) return null;
  const t = e.cards.filter((r) => r.id !== n).map((r) => {
    if (!r.dependsOn?.includes(n)) return r;
    const c = { ...r, dependsOn: r.dependsOn.filter((w) => w !== n) };
    return c.dependsOn.length || delete c.dependsOn, c;
  }), i = e.lines?.map((r) => nt(r, n, o));
  return Y({ ...e, cards: t, ...i ? { lines: i } : {} });
}
function Ts(e, n, o = ar(e, n)) {
  const t = new Set(e.cards.filter((c) => c.id !== n).map((c) => c.id)), i = (e.lines ?? []).filter((c) => c.parentId === n || c.childId === n).map((c) => nt(c, n, o)), r = (c) => t.has(c.parentId) || t.has(c.childId);
  return { stay: i.filter(r), leave: i.filter((c) => !r(c)) };
}
function ar(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? Uo(o) : n;
}
function $o(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function In(e, n) {
  if (e.kind) return Ss;
  let o;
  try {
    o = sn(n);
  } catch (r) {
    return r instanceof Error ? r.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((r) => r.id));
  return o = Yo(o, t), (o.targetPoint ? !t.has(o.parentId) : !t.has(o.parentId) && !t.has(o.childId)) ? "That card is no longer on the board." : e.lanes.some((r) => r.id === o.parentId || r.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((r) => r.id === o.id) && (e.lines?.length ?? 0) >= rn ? `A workshop holds up to ${rn} lines.` : null;
}
const Ss = "Lines join the cards of a lane workshop to notes and to each other.";
function Gn(e, n) {
  return In(e, n) !== null ? null : Y({ ...e, lines: tr(e, [sn(n)]) });
}
function Po(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? Y({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function lr(e, n, o, t = {}) {
  const i = new Set((e.lines ?? []).map((c) => c.id));
  let r = `${n}->${o}`;
  for (let c = 2; i.has(r); c++) r = `${n}->${o}~${c}`;
  return sn({ showChildArrow: !0, ...t, id: r, parentId: n, childId: o });
}
function Ls(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function $e(e, n) {
  const o = e.lanes.find((m) => m.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const m = He(e, n);
    return o.capacity ? m + " / " + o.capacity + " points" : m + " points";
  }
  const t = de(e);
  if (t) return be(t).caption(e, n);
  const i = Rs(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const r = e.cards.filter((m) => m.laneId === n).length, c = e.behaviour ? ge().laneLimit(e, n) : o.capacity, w = Ge(e, n);
  return c !== void 0 && w !== r ? w + " of " + c + " · " + (r - w) + (r - w === 1 ? " card" : " cards") : c !== void 0 ? r + " of " + c : r + (r === 1 ? " card" : " cards");
}
const tt = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Un = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function dr(e, n = tt, o = 28, t) {
  const { pitch: i, row: r, top: c } = n, w = !!e.lanes[0].station, m = e.lanes.map((A) => e.cards.filter((v) => v.laneId === A.id).length), T = c + Math.max(1, ...t ?? m) * r + 36, I = e.lanes.map((A, v) => ({
    x: w ? A.station.column * (i + o) : v * i,
    y: w ? A.station.row * T : 0
  }));
  return {
    points: I,
    width: Math.max(...I.map((A) => A.x)) + i,
    height: Math.max(...I.map((A, v) => A.y + c + (w ? Math.max(1, m[v]) : m[v] + 1) * r))
  };
}
function li() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Sn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((i) => i.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function cr(e) {
  const n = Y(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function $s(e, n) {
  const o = cr(e), t = Sn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Y(o);
}
function Ps(e, n, o) {
  const t = cr(e);
  return t.cards.push({
    id: Sn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), Y(t);
}
function di() {
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
function Oo(e, n, o) {
  const t = Y(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const i = t.lanes.find((I) => I.id === n);
  if (!i?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= Zo) throw new Error("A map can have up to five stations.");
  const r = ke(o?.label), c = ke(o?.outcome, 160), w = Sn(t, "station");
  let m, T = 1 / 0;
  for (let I = 0; I < Pt; I++)
    for (let A = 0; A < Pt; A++) {
      if (t.lanes.some((k) => k.station.column === A && k.station.row === I)) continue;
      const v = Math.abs(i.station.column - A) + Math.abs(i.station.row - I);
      v < T && (T = v, m = { column: A, row: I });
    }
  if (!m) throw new Error("There is no free station position.");
  return i.station.next.push(w), t.lanes.push({ id: w, label: r, station: { ...m, next: [], outcome: c, ...o.image === void 0 ? {} : { image: qo(o.image) } } }), t.presentationOrder?.push(w), t;
}
const ci = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, ur = (e) => "caption-" + e, bn = (e) => "column-" + e, Os = "rules-board", ee = { lane: on, card: _e, image: et, caption: ur, column: bn, rules: Os };
function fr(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function qn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), i = e, r = n;
  return t ? `M ${t} 0 H ${i - t} Q ${i} 0 ${i} ${t} V ${r - t} Q ${i} ${r} ${i - t} ${r} H ${t} Q 0 ${r} 0 ${r - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${i} V ${r} H 0 Z`;
}
function Eo(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function No(e, n, o, t) {
  for (let i = n; i > 11; i--) {
    const r = Math.max(1, Math.floor(o / (i * 0.55)));
    if (e.split(`
`).reduce((w, m) => w + Math.max(1, Math.ceil(m.length / r)), 0) * i * 1.3 <= t) return i;
  }
  return Math.min(n, 11);
}
const hr = 152, Et = hr + 12, Es = 12;
function pr(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function De(e, n = {}) {
  const o = Y(e), { pitch: t, row: i, top: r } = tt, c = o.lanes.map((v) => o.cards.filter((k) => k.laneId === v.id).length), w = (v) => Math.max(c[v], (Array.isArray(n.rows) ? n.rows[v] : n.rows) ?? 0), m = !!o.lanes[0].station, T = o.lanes.some((v) => v.station?.image), I = pr(n.layout, o.lanes.length), A = [];
  if (m) {
    const { points: v } = dr(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((k, b) => A.push({
      laneId: k.id,
      x: v[b].x,
      y: v[b].y + (T ? k.station.row * Et : 0),
      width: t,
      height: r + (k.station.image ? Et : 0) + Math.max(1, w(b)) * i,
      column: k.station.column,
      row: k.station.row
    }));
  } else {
    let v = mr(o, I)?.below ?? 0;
    for (let k = 0; k < o.lanes.length; k += I) {
      const b = o.lanes.slice(k, k + I), E = r + (Math.max(...b.map((_, U) => w(k + U))) + 1) * i;
      b.forEach((_, U) => A.push({ laneId: _.id, x: U * t, y: v, width: t, height: E, column: U, row: k / I })), v += E + Es;
    }
  }
  return { places: A, width: Math.max(...A.map((v) => v.x + v.width)), height: Math.max(...A.map((v) => v.y + v.height)) };
}
function mr(e, n, o = 2, t = 0) {
  const i = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? ge().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return i ? { note: i, below: i.options.height + 16 } : null;
}
function Ns(e, n) {
  const { pitch: o, width: t, row: i, height: r, top: c } = tt, w = n.origin ?? { x: 0, y: 0 }, m = !!e.lanes[0].station, { places: T } = De(e, n), I = n.style ?? {}, A = I.textColor ?? wn.fontColor, v = I.borderColor ?? wn.borderColor, k = I.borderWidth ?? wn.borderWidth, b = I.cornerRadius ?? 0, E = I.fontSize ?? wn.fontSize, _ = I.laneFontSize ?? E + 2, U = I.captionFontSize ?? Math.max(11, E - 1), a = [], g = (S) => {
    const M = { options: {
      shapeHint: "rectangle",
      vectorPath: qn(S.width, S.height, b),
      foregroundColor: A,
      borderColor: v,
      borderWidth: k,
      ...I.fontFamily ? { fontFamily: I.fontFamily } : {},
      ...S
    }, relationships: { associations: [] } };
    return a.push(M), M;
  };
  e.lanes.forEach((S, M) => {
    const D = T[M], H = w.x + D.x, R = w.y + D.y, Z = S.station?.image;
    g({
      id: bn(S.id),
      text: "",
      name: S.label,
      xPos: H + 2,
      yPos: R,
      width: o - 4,
      height: D.height,
      vectorPath: qn(o - 4, D.height, b ? b + 2 : 0),
      backgroundColor: m ? "#fcf9ed" : Eo(Un[M], 0.6),
      borderColor: m ? "#a8b5aa" : Eo(Un[M], 0.1),
      borderWidth: 1,
      ...m ? { borderStyle: "dashed" } : {}
    }), g({
      id: on(S.id),
      text: S.label,
      name: S.label,
      xPos: H + 8,
      yPos: R + 6,
      width: t,
      height: 58,
      backgroundColor: Un[M],
      fontSize: No(S.label, _, t - 16, 50)
    }), g({
      id: ur(S.id),
      text: $e(e, S.id),
      name: S.label,
      xPos: H + 8,
      yPos: R + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: U
    }), Z && a.push({ options: {
      id: et(S.id),
      name: Z.alt,
      text: "",
      xPos: H + 8,
      yPos: R + c,
      width: t,
      height: hr,
      shapeHint: "rectangle",
      image: Z.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((se) => se.laneId === S.id).forEach((se, qe) => {
      const te = ir(e, se), Ie = m ? t - 20 : t, Pe = m ? r - 6 : r, pe = m && !se.free, me = pe ? {} : { ...I.card, ...se.look }, ln = pe ? b : I.card?.cornerRadius ?? b;
      g({
        id: _e(se.id),
        text: te,
        name: se.label,
        xPos: H + (m ? 18 : 8),
        yPos: R + c + (Z ? Et : 0) + qe * i,
        width: Ie,
        height: Pe,
        ...ln !== b ? { vectorPath: qn(Ie, Pe, ln) } : {},
        backgroundColor: pe ? "#ffda75" : me.backgroundColor ?? I.backgroundColor ?? wn.backgroundColor,
        ...me.textColor ? { foregroundColor: me.textColor } : {},
        ...me.fontFamily ? { fontFamily: me.fontFamily } : {},
        ...me.borderColor ? { borderColor: me.borderColor } : {},
        ...me.borderWidth !== void 0 ? { borderWidth: me.borderWidth } : {},
        fontSize: No(te, me.fontSize ?? E, Ie - 16, Pe - 8)
      });
    });
  });
  const C = mr(e, pr(n.layout, e.lanes.length), w.x + 2, w.y)?.note ?? wr(e, {
    x: w.x,
    y: w.y + Math.max(...T.map((S) => S.y + S.height)) + 16,
    width: Math.min(Math.max(...T.map((S) => S.x + S.width)), o * 2) - 4
  }, I);
  C && a.push(C);
  const $ = new Map(a.map((S) => [S.options.id, S]));
  for (const S of e.lanes)
    S.station && ($.get(bn(S.id)).relationships.associations = S.station.next.map((M) => ({
      id: S.id + "-to-" + M,
      parentId: bn(S.id),
      childId: bn(M),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const S of e.cards)
      for (const M of S.dependsOn ?? []) {
        const D = _e(M), H = _e(S.id);
        $.get(D).relationships.associations.push({
          id: `dependency-${M.length}-${M}-${S.id}`,
          parentId: D,
          childId: H,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const S = new Set(n.beside), M = new Set(a.map((R) => R.options.id)), D = /* @__PURE__ */ new Map();
    for (const R of [...M]) {
      if (!S.has(R)) continue;
      const Z = fr(R, (se) => S.has(se) || M.has(se));
      M.add(Z), D.set(R, Z);
    }
    const H = (R) => D.get(R) ?? R;
    for (const R of a) {
      R.options.id = H(R.options.id);
      for (const Z of R.relationships.associations)
        Z.parentId = H(Z.parentId), Z.childId = H(Z.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: a };
}
function wr(e, n, o = {}) {
  return e.behaviour ? ge().note(e, n, o) : null;
}
function _s(e, n) {
  const o = Y(e);
  if (n?.native) return Ns(o, n);
  const { width: t, row: i, height: r, top: c } = tt, w = [];
  function m(k, b, E, _, U, a) {
    w.push({ options: {
      id: k,
      text: b,
      name: b,
      xPos: E,
      yPos: _,
      width: t,
      height: U,
      shapeHint: "rectangle",
      backgroundColor: a,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: T } = dr(o), I = 152, A = I + 12, v = o.lanes.some((k) => k.station?.image);
  o.lanes.forEach((k, b) => {
    const E = T[b].x, _ = T[b].y + (v ? (k.station?.row ?? 0) * A : 0), U = k.station?.image, a = o.kind === "release-plan" ? k.label + `
` + (k.capacity ? He(o, k.id) + " / " + k.capacity + " points" : He(o, k.id) + " points") : k.label;
    m(on(k.id), a, E, _, c - 12, Un[b]), U && w.push({ options: {
      id: et(k.id),
      name: U.alt,
      text: "",
      xPos: E,
      yPos: _ + c,
      width: t,
      height: I,
      shapeHint: "rectangle",
      image: U.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((g) => g.laneId === k.id).forEach((g, C) => m(_e(g.id), ir(o, g), E, _ + c + (U ? A : 0) + C * i, r, "#fffdf6"));
  });
  for (const k of o.lanes) {
    if (!k.station) continue;
    const b = w.find((E) => E.options.id === on(k.id));
    b.relationships.associations = k.station.next.map((E) => ({ id: k.id + "-to-" + E, parentId: b.options.id, childId: on(E), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), b.options.text = k.label + `
` + k.station.outcome, b.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const k = new Map(w.map((b) => [b.options.id, b]));
    for (const b of o.cards)
      for (const E of b.dependsOn ?? []) {
        const _ = _e(E), U = _e(b.id);
        k.get(_).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${b.id}`,
          parentId: _,
          childId: U,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: w };
}
const ui = {
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
}, Nt = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], zt = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function fi() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Nt.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Nt.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function hi() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...zt.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Ue(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...zt.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => Nt.some((i) => i.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Ms(e, n, o) {
  const t = Ue(e), i = e.cards.find((c) => c.id === n);
  if (!t || !i || i.laneId === o) return null;
  let r = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const c = e.cards.find((w) => w.laneId === o);
    if (c) {
      if (!Vn(e, c).some((w) => w.id === "interviews")) return null;
      r = Ot(e, c.id, "interviews");
    }
  }
  return Vn(r, i).some((c) => c.id === o) ? Ot(r, n, o) : null;
}
function Rs(e, n) {
  if (Ue(e) !== "experiment-budget") return null;
  const o = zt.find((r) => r.id === n), t = e.cards.filter((r) => r.laneId === n).length, i = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? i + " " + (i === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  kt as $,
  tt as A,
  _s as B,
  dr as C,
  He as D,
  Vn as E,
  Ot as F,
  Vr as G,
  ei as H,
  jo as I,
  Ue as J,
  vs as K,
  Rs as L,
  Nt as M,
  zt as N,
  kn as O,
  ps as P,
  de as Q,
  Uo as R,
  Xn as S,
  Jo as T,
  $t as U,
  Co as V,
  rn as W,
  jt as X,
  si as Y,
  ii as Z,
  ai as _,
  Ur as a,
  xs as a0,
  nn as a1,
  Xe as a2,
  yn as a3,
  ir as a4,
  bt as a5,
  Hn as a6,
  Lo as a7,
  Ts as a8,
  $o as a9,
  Mt as aA,
  Zs as aB,
  Fr as aC,
  zr as aD,
  vt as aE,
  Bn as aF,
  Fs as aG,
  Hs as aH,
  Qs as aI,
  Xs as aJ,
  ni as aK,
  ti as aL,
  oi as aM,
  Mo as aN,
  Jn as aO,
  Br as aP,
  Vs as aQ,
  Zr as aR,
  In as aa,
  Ss as ab,
  Gn as ac,
  Po as ad,
  lr as ae,
  Ls as af,
  $e as ag,
  li as ah,
  Sn as ai,
  $s as aj,
  Ps as ak,
  di as al,
  Oo as am,
  ci as an,
  ee as ao,
  fr as ap,
  De as aq,
  wr as ar,
  ui as as,
  fi as at,
  hi as au,
  Ms as av,
  Us as aw,
  ge as ax,
  Ys as ay,
  Be as az,
  vn as b,
  xn as c,
  Ks as d,
  Ge as e,
  qn as f,
  ri as g,
  en as h,
  ts as i,
  qs as j,
  It as k,
  tn as l,
  wo as m,
  Un as n,
  To as o,
  bo as p,
  Bs as q,
  Js as r,
  P as s,
  zs as t,
  Ds as u,
  Y as v,
  be as w,
  js as x,
  jn as y,
  Gs as z
};
