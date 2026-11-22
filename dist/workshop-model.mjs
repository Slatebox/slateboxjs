import { D as tn } from "./NoteDefaults-1xFW0br8.mjs";
const Ur = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Gr(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: l, fieldNote: i, deskNote: p, fallback: b } = e, I = (E) => typeof E == "string" && E.trim().length > 0 && E.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(E);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? l !== "field" && l !== "desk" : l !== null) || l === void 0 || !I(i) || !I(p) || !I(b) ? null : { kind: n, version: o, stage: t, choice: l, fieldNote: i.trim(), deskNote: p.trim(), fallback: b.trim() };
}
function Kr(e) {
  return { ...e, stage: "review", choice: null };
}
function qr(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Jr(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const gn = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Yr(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: l, rightLabel: i } = e, p = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !p(l) || !p(i) ? null : { kind: n, version: o, mix: t, leftLabel: l.trim(), rightLabel: i.trim() };
}
function Zr({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === gn.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === gn.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === gn.leftLabel && o === gn.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function We(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function Yo(e) {
  const n = new Map(e.cards.map((p) => [p.id, p])), o = new Map(e.lanes.map((p, b) => [p.id, b])), t = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  function i(p) {
    if (!t.has(p.id)) {
      if (l.has(p.id)) throw new Error("Release dependencies must be acyclic.");
      l.add(p.id);
      for (const b of p.dependsOn ?? []) {
        const I = n.get(b);
        if (!I) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(I.laneId) > o.get(p.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(I);
      }
      l.delete(p.id), t.add(p.id);
    }
  }
  for (const p of e.cards) i(p);
  for (const p of e.lanes) {
    if (p.station) throw new Error("Release windows cannot also be map stations.");
    if (We(e, p.id) > (p.capacity ?? 1 / 0)) throw new Error(`Release "${p.label}" exceeds its point budget.`);
  }
}
function $n(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((y, k) => [y.id, k])), l = t.get(o);
  if (l === void 0) return null;
  const i = l < t.get(n.laneId), p = /* @__PURE__ */ new Set([n.id]), b = [n];
  for (; b.length; ) {
    const y = b.pop();
    for (const k of e.cards) {
      if (p.has(k.id)) continue;
      const v = t.get(k.laneId);
      (i ? v > l && y.dependsOn?.includes(k.id) : v < l && k.dependsOn?.includes(y.id)) && (p.add(k.id), b.push(k));
    }
  }
  if (e.cards.filter((y) => p.has(y.id)).some((y) => y.allowedLaneIds && !y.allowedLaneIds.includes(o))) return null;
  const E = { ...e, cards: e.cards.map((y) => p.has(y.id) ? { ...y, laneId: o } : y) }, C = e.lanes[l].capacity;
  return C !== void 0 && We(E, o) > C ? null : E;
}
const Vr = {
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
}, ut = /* @__PURE__ */ new Map(), Zo = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function Qr(e) {
  ut.set(e.kind, e);
}
function Xr(e) {
  return typeof e == "string" && ut.has(e);
}
function ye(e) {
  const n = ut.get(e);
  if (!n) throw new Error(`The ${Zo[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let Tn = null;
function ei(e) {
  Tn = e;
}
function ni() {
  return Tn !== null;
}
function me() {
  if (!Tn) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return Tn;
}
const L = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Me = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Dt = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ft = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), ht = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ti = (e) => ft(ht(e)), Vo = [
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
], Qo = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Vo.indexOf(e.toLowerCase()), Xo = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function io(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (l) => {
    const i = ft(l);
    i && o.add(i);
  };
  t(e), t(ht(e));
  for (const l of [...o]) t(l.replace(/^(?:the|my|our)\s+/i, ""));
  for (const l of [...o]) t(l.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const l of [...o]) t(l.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const qn = "[^\\p{L}\\p{N}]", Ht = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Dt(n) + "(?:$|" + qn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + qn + ")" + Dt(n) + "(?:$|" + qn + ")", "u").test(e)
], Bt = ["first", "second", "third", "fourth", "fifth"];
function er(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Bt.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(ft(ht(n)));
  if (!t) return null;
  const l = (t[1] ?? t[2]).toLowerCase(), i = l === "last" ? e.length - 1 : t[1] ? Bt.indexOf(l) : Qo(l) - 1;
  return e[i] ?? null;
}
function Jn(e, n, o, t, l) {
  const i = io(n, o);
  if (i.some((b) => Xo.test(b))) {
    const b = t && e.find((I) => I.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of i) {
    if (!b.startsWith("@")) continue;
    const I = e.find((E) => E.id === b.slice(1));
    if (I) return { item: I, rank: 0 };
  }
  for (const [b, I] of Ht.entries())
    for (const E of i) {
      const C = e.filter((y) => I(y.label.toLowerCase(), E.toLowerCase()));
      if (C.length === 1) return { item: C[0], rank: b };
      if (C.length > 1) return { several: C };
    }
  const p = l ? er(e, n, o) : null;
  return p ? { item: p, rank: Ht.length } : {};
}
class vn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function et(e, n, o, t, l = !1) {
  return { find: (I) => {
    const E = Jn(e, I, n, t, l);
    if (E.item) return E.item;
    const C = io(I, n), y = C[C.length - 1];
    if (E.pointing) throw new vn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (E.several) {
      const v = [...new Set(E.several.map((A) => A.label))];
      throw new vn(v.length === 1 ? E.several.length + " " + o + "s are called " + L(v[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + L(y) + ": " + Me(v.slice(0, 6).map(L)) + ". Use the whole name.", "ambiguous", E.several.map((A) => A.id));
    }
    const k = e.map((v) => v.label);
    throw new vn("There is no " + o + " called " + L(y) + " here." + (k.length && k.length <= 6 ? " The " + o + "s are " + Me(k.map(L)) + "." : k.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((v) => v.id));
  }, attempt: (I) => Jn(e, I, n, t, l).item ?? null, rank: (I) => Jn(e, I, n, t, l).rank ?? 1 / 0 };
}
const so = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], xe = [...so], De = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], ao = so.slice(5);
function Sn(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ie(e);
  return n || (e.kind === "release-plan" ? "release-plan" : Ye(e) ?? "lanes");
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
}, nt = {
  "launch-plan": W.launchLanes,
  pipeline: W.pipelineLanes,
  budget: W.budgetLanes,
  "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, ae = (e, n) => Object.fromEntries(xe.filter((o) => !e.includes(o)).map((o) => [o, n])), oe = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), Q = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ne = (e) => ({ type: "ref", of: "card", about: e }), Yn = (e) => ({ map: e }), ve = ae(["map"], W.notMap), Ie = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), tt = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: oe(120, "The new name, 1 to 120 characters of plain text.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: Q("The lane or step."), label: oe(80, "The new name, 1 to 80 characters of plain text.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ne("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: xe,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: oe(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...nt }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Q("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...nt }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: Q("The lane or step it starts in."),
      label: oe(80, "What the card says. Left out, the card is empty (on a map, the token is numbered); a launch plan, pipeline, budget, hiring plan or nest board needs it.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Ie("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Ie("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Ie("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...ao],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ne("The card or token.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: ne("The card or token."), lane: Q("Where it goes.") },
    boards: xe,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ne("The token.") },
    boards: ["map"],
    refusals: ve
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
    fields: { card: ne("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: De,
    refusals: { ...Yn(W.mapCardLanes), ...ae([...De, "map"], W.businessCards) }
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
      lane: Q("The lane."),
      whenPresent: oe(160, "What it says when the card is there."),
      whenAbsent: oe(160, "What it says otherwise."),
      label: oe(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: De,
    refusals: { ...Yn(W.mapOutcome), ...ae([...De, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ne("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: De,
    refusals: { ...Yn(W.mapOutcome), ...ae([...De, "map"], W.businessCards) }
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
    fields: { from: Q("The step it follows."), label: oe(80, "The new step’s name."), outcome: oe(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: ve
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
    refusals: ve
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: ve
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: ve
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: Q("The step."), outcome: oe(160, "What it says.") },
    boards: ["map"],
    refusals: ve
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: Q("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: ve
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: Q("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: ve
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: Q("The step."), alt: oe(240, "What the picture shows.") },
    boards: ["map"],
    refusals: ve
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: ne("The card the line starts at."), to: ne("The card it points to."), label: oe(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: yn()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: ne("One card."), to: ne("The other card.") },
    boards: ["lanes"],
    refusals: yn()
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
    refusals: yn()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: ne("The card."), note: oe(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: yn()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: ne("The task."), duration: Ie("Its days, 1 to 60.", 60, 1, !0), lag: Ie("Days it waits, 0 or more.", 120, 0, !0) },
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
    fields: { day: Ie("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ne("The deal or line item."), amount: Ie("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: ae(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Ie("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: ae(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: Q("The team giving."), to: Q("The team receiving."), amount: Ie("Whole currency units.", 1e9, 1) },
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
      rule: oe(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: ae(["lanes", "pipeline"], W.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: oe(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: ae(["lanes", "pipeline"], W.noRules) }
];
function yn() {
  return { ...ae(["lanes"], W.businessLines), "release-plan": W.lines, "customer-interviews": W.lines, "experiment-budget": W.lines, map: W.lines };
}
const nr = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", Ut = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, tr = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function or(e, n) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, t = (l, i) => i ? { anyOf: [l, { type: "null" }] } : l;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: e.min ?? 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...t({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...t({ type: "integer", minimum: e.min, maximum: tr(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: Ut.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: o,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: o,
        to: { type: "array", items: o, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: o,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: o,
        ...Ut.keys
      }, description: e.about };
  }
}
const lo = (e) => "optional" in e && e.optional === !0;
function oi(e) {
  const n = e ? Sn(Z(e)) : void 0;
  return tt.map((o) => {
    const t = Object.entries(o.fields), l = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, p]) => !lo(p)).map(([p]) => p)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([p, b]) => [p, or(b, n)])) }
    }, i = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: l };
    return n && (i.accepted = o.boards.includes(n), i.accepted || (i.refusal = o.refusals[n])), i;
  });
}
const kn = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function rr(e, n) {
  const o = !!e.lanes[0]?.station, t = et(e.lanes, o ? kn.step : kn.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), l = et(e.cards, o ? kn.token : kn.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: l };
  const i = (p) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (p) => i(p) ?? l.find(p),
    attempt: (p) => i(p) ?? l.attempt(p),
    rank: (p) => i(p) ? 0 : l.rank(p)
  } };
}
class F {
  constructor(n, o, t = null, l, i, p) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = l, this.candidates = i, this.limits = p;
  }
}
function On(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function K(e, n, o = null, t) {
  try {
    return Z(e);
  } catch (l) {
    throw new F(On(l instanceof Error ? l.message : String(l), n), "refused", o, t);
  }
}
function ir(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, l] of Object.entries(n.fields)) {
    const i = e[t];
    if (i === void 0) {
      if (lo(l)) continue;
      return n.kind + " needs " + t + ".";
    }
    const p = n.kind + " needs " + t + " as ";
    switch (l.type) {
      case "text":
        if (typeof i != "string") return p + "text.";
        break;
      case "ref":
        if (!o(i)) return p + "an id or a name.";
        break;
      case "refs":
        if (i === null && l.nullable) break;
        if (!Array.isArray(i) || i.length > l.max || !i.every(o)) return p + "a list of up to " + l.max + " ids or names" + (l.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (i === null && l.nullable) break;
        if (typeof i != "number" || !Number.isFinite(i)) return p + "a number" + (l.nullable ? " or null." : ".");
        break;
      case "image":
        if (i === null) break;
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((b) => b !== "src" && b !== "alt")) return p + "{src, alt} or null.";
        break;
      case "choice":
        if (!l.values.includes(i)) return p + l.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof i != "boolean") return p + "true or false.";
        break;
      case "rule":
        if (!i || typeof i != "object" || Array.isArray(i) || typeof i.kind != "string") return p + "an object with a kind.";
        break;
    }
  }
  return null;
}
function sr(e, n, o, t, l) {
  const i = structuredClone(e), p = o === "map", b = o === "release-plan", I = rr(i, t), E = { lane: p ? "step" : "lane", card: p ? "token" : "card" };
  function C(r, m, x, S, O = null) {
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
      if (!(M instanceof vn)) throw M;
      const q = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new F(M.message, q, O, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const y = (r, m = null) => C(i.lanes, I.lanes, r, "lane", m), k = (r, m = null) => C(i.cards, I.cards, r, "card", m), v = (r) => {
    try {
      return y(r);
    } catch {
      return null;
    }
  }, A = (r, m, x = {}, S = !0) => ({ board: r, said: m, changed: S, ...x }), R = (r) => i.cards.filter((m) => m.laneId === r).length, D = (r) => p ? "The presentation opens with " + L(r[0].label) + "." : "The presentation now runs " + r.map((m) => L(m.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return me().edit(i, n, l, {
      lane: (r) => y(r),
      card: (r) => k(r),
      done: (r, m, x) => A(r, m, x),
      refuse: (r, m = {}) => {
        throw new F(r, m.code ?? "refused", m.laneId ?? null, m.cardId);
      }
    });
  if (ao.includes(o)) {
    n.kind === "add_card" && Gt(n, o, y(n.lane).id);
    const r = {
      card: (x) => k(x),
      lane: (x) => y(x),
      refuse: (x, S = {}) => {
        throw new F(x, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (x, S = null, O) => K(x, o, S, O),
      done: (x, S, O) => A(x, S, O)
    }, m = ye(o).edit(i, n, r);
    if (m) return m;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const r = K(i, o);
      return A(r, "Renamed the " + (p ? "map" : "workshop") + " to " + L(r.title) + ".");
    }
    case "rename_lane": {
      const r = y(n.lane), m = r.label;
      r.label = n.label;
      const x = K(i, o, r.id);
      return A(x, "Renamed " + L(m) + " to " + L(x.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = k(n.card), m = r.label;
      r.label = n.label;
      const x = K(i, o, r.laneId, r.id);
      return A(x, "Renamed " + L(m) + " to " + L(x.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new F("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new F("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Rr(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new F(On(x.message, o), "refused");
      }
      const m = r.lanes[r.lanes.length - 1];
      return A(r, "Added the lane " + L(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const r = y(n.lane), m = i.cards.filter((x) => x.laneId === r.id);
      if (p) {
        if (m.length) throw new F(L(m[0].label) + " is at " + L(r.label) + ". Move it to another step first.", "refused", r.id);
        if (i.lanes.length <= 2) throw new F("A map needs at least two steps.", "refused", r.id);
      } else {
        if (m.length) throw new F(L(r.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (i.lanes.length <= 2) throw new F("A workshop needs at least two lanes.", "refused", r.id);
      }
      i.lanes = i.lanes.filter((x) => x !== r);
      for (const x of i.lanes) x.station && (x.station.next = x.station.next.filter((S) => S !== r.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((x) => x !== r.id));
      for (const x of i.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((S) => S !== r.id));
      return bn(i, (x) => x.laneId === r.id), i.behaviour && (i.behaviour = me().dropLane(i.behaviour, r.id)), A(K(i, o), "Removed the " + E.lane + " " + L(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = y(n.lane);
      if (p) {
        if (n.allowedLanes !== void 0) throw new F(W.mapCardLanes, "not_on_this_board", r.id);
        let O = n.label;
        if (O === void 0) {
          let j = i.cards.length + 1;
          for (; i.cards.some((Y) => Y.label === "Token " + j); ) j++;
          O = "Token " + j;
        }
        const $ = new Set([...i.lanes, ...i.cards].map((j) => j.id));
        let M = 1;
        for (; $.has("token-" + M); ) M++;
        i.cards.push({ id: "token-" + M, label: O, laneId: r.id });
        const q = K(i, o, r.id);
        return A(q, "Added " + L(q.cards[q.cards.length - 1].label) + " at " + L(r.label) + ".", { laneId: r.id, cardId: "token-" + M });
      }
      if (Gt(n, o, r.id), i.cards.length >= 24) throw new F("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && R(r.id) >= r.capacity)
        throw new F(L(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map((O) => y(O).id))];
      let x;
      try {
        x = Mr(i, r.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch (O) {
        throw new F(On(O.message, o), "refused", r.id);
      }
      const S = x.cards[x.cards.length - 1];
      return A(x, "Added " + (S.label ? L(S.label) : "an empty card") + " to " + L(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = k(n.card);
      if (p && i.cards.length === 1) throw new F("A map needs at least one token.", "refused", r.laneId, r.id);
      if (b && i.cards.length === 1) throw new F("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && i.cards.length === 1) throw new F("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      i.cards = i.cards.filter((m) => m !== r);
      for (const m of i.cards)
        m.dependsOn?.includes(r.id) && (m.dependsOn = m.dependsOn.filter((x) => x !== r.id), m.dependsOn.length || delete m.dependsOn);
      return bn(i, (m) => m.cardId === r.id), A(K(_r(i, r.id), o, r.laneId), "Removed the " + E.card + " " + L(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? i.lanes.find((S) => S.id === n.lane.id) ?? null : v(n.lane), m = k(n.card, r?.id ?? null), x = y(n.lane, m.laneId);
      return _(m, x);
    }
    case "advance_card": {
      const r = k(n.card), m = i.lanes.find((S) => S.id === r.laneId), x = m.station.next.map((S) => i.lanes.find((O) => O.id === S)).filter((S) => !!S);
      if (!x.length) throw new F(L(r.label) + " is at " + L(m.label) + ", and no path leads on from there.", "refused", m.id, r.id);
      if (x.length > 1)
        throw new F("From " + L(m.label) + " the path goes to " + x.map((S) => L(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + x[0].label + "”.", "refused", m.id, r.id);
      return _(r, x[0]);
    }
    case "set_lane_capacity": {
      const r = y(n.lane), m = i.behaviour && me().setLimit(i, r.id, n.capacity, l);
      if (typeof m == "string") throw new F(m, "refused", r.id);
      if (m) return A(m, L(r.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: r.id });
      const x = p ? "token" : b ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, A(K(i, o, r.id), p ? "Removed the limit at " + L(r.label) + "." : L(r.label) + " now holds any number of " + x + "s.", { laneId: r.id });
      const S = b ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > S)
        throw new F((p ? "A step" : "A lane") + " can hold from 1 to " + S + " " + x + "s.", "refused", r.id);
      const O = b ? i.cards.reduce(($, M) => $ + (M.laneId === r.id ? M.points ?? 1 : 0), 0) : R(r.id);
      if (O > n.capacity)
        throw new F(L(r.label) + " already holds " + O + " " + x + (O === 1 ? "" : "s") + ". Move some " + (p ? "on" : "out") + " first, or choose a higher " + (b ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, A(K(i, o, r.id), L(r.label) + " now holds up to " + n.capacity + " " + x + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = k(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, A(K(i, o, r.laneId, r.id), L(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const m = [...new Set(n.lanes.map((S) => y(S)))], x = i.lanes.find((S) => S.id === r.laneId);
      if (!m.includes(x)) throw new F(L(r.label) + " is in " + L(x.label) + " now. Include " + L(x.label) + ", or move the card first.", "refused", x.id, r.id);
      return r.allowedLaneIds = m.map((S) => S.id), A(K(i, o, r.laneId, r.id), L(r.label) + " can now go only in " + Me(m.map((S) => L(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new F("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, A(K(i, o, r.laneId, r.id), L(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = k(n.card), m = [...new Set(n.dependsOn.map((S) => k(S)))], x = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = m.filter((O) => r.dependsOn?.includes(O.id));
        if (!S.length) throw new F(L(r.label) + " does not depend on " + Me(m.map((O) => L(O.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((O) => !S.some(($) => $.id === O)), r.dependsOn.length || delete r.dependsOn, A(K(i, o, r.laneId, r.id), L(r.label) + " no longer depends on " + Me(S.map((O) => L(O.label))) + ".", x);
      }
      if (!m.length) {
        if (n.mode === "add") throw new F("Name the features " + L(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, A(K(i, o, r.laneId, r.id), L(r.label) + " no longer depends on anything.", x);
      }
      if (m.includes(r)) throw new F("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...m.map((S) => S.id)])], A(K(i, o, r.laneId, r.id), L(r.label) + " now depends on " + Me(m.map((S) => L(S.label))) + ".", x);
    }
    case "set_outcome": {
      const r = k(n.card), m = y(n.lane), x = i.signals ?? (i.signals = []), S = n.label, O = S === void 0 ? x.filter((j) => j.cardId === r.id && j.laneId === m.id) : x.filter((j) => j.cardId === r.id && j.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && O.length > 1) throw new F("Two outcomes on this card have that name.", "refused", m.id, r.id);
      if (!O.length && x.length >= 24) throw new F("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, r.id);
      let $ = 1;
      for (; x.some((j) => j.id === "signal-" + $); ) $++;
      const q = { label: S ?? O[0]?.label ?? (r.label + " in " + m.label).slice(0, 80).trim(), cardId: r.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return O.length ? Object.assign(O[0], q) : x.push({ id: "signal-" + $, ...q }), A(K(i, o, m.id, r.id), "When " + L(r.label) + " is in " + L(m.label) + " the workshop says " + L(n.whenPresent) + ". Otherwise it says " + L(n.whenAbsent) + ".", { laneId: m.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = k(n.card), m = (i.signals ?? []).filter((x) => x.cardId === r.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new F(L(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        bn(i, (x) => x.cardId === r.id);
      } else {
        const x = C(m, et(m, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        bn(i, (S) => S.id === x.id);
      }
      return A(K(i, o, r.laneId, r.id), "Removed the outcome from " + L(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((m) => y(m));
      if (r.length !== i.lanes.length || new Set(r).size !== i.lanes.length) throw new F("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = r.map((m) => m.id), A(K(i, o), D(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new F("Say before or after, not both.", "invalid_edit");
      const r = y(n.lane), m = n.before ?? n.after, x = m === void 0 ? void 0 : y(m);
      if (x && x.id === r.id) throw new F("Choose two different scenes.", "refused", r.id);
      const S = wt(i).filter((O) => O.id !== r.id);
      return S.splice(x ? S.findIndex((O) => O.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), i.presentationOrder = S.map((O) => O.id), A(K(i, o, r.id), D(S), { laneId: r.id });
    }
    case "add_station": {
      const r = y(n.from);
      let m;
      try {
        m = to(i, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new F(S.message, "refused", r.id);
      }
      const x = m.lanes[m.lanes.length - 1];
      return A(m, "Added a path from " + L(r.label) + " to " + L(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const r = y(n.before), m = n.from === void 0 ? void 0 : y(n.from), x = m ? [m] : i.lanes.filter(($) => $.station.next.includes(r.id));
      if (m && !m.station.next.includes(r.id))
        throw new F("There is no path from " + L(m.label) + " to " + L(r.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!x.length) throw new F("Nothing leads to " + L(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = to(i, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch ($) {
        throw new F($.message, "refused", r.id);
      }
      const O = S.lanes[S.lanes.length - 1];
      for (const $ of S.lanes)
        x.some((M) => M.id === $.id) && ($.station.next = [...new Set($.station.next.map((M) => M === r.id ? O.id : M))]);
      return O.station.next = [r.id], A(K(S, o, O.id), "Added " + L(O.label) + " before " + L(r.label) + ".", { laneId: O.id });
    }
    case "connect_stations": {
      const r = y(n.from), m = y(n.to);
      if (r.id === m.id) throw new F("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(m.id) ? A(i, L(r.label) + " already leads to " + L(m.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(m.id), A(K(i, o, r.id), "Connected " + L(r.label) + " to " + L(m.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = y(n.from), m = y(n.to);
      if (!r.station.next.includes(m.id)) throw new F("There is no path between " + L(r.label) + " and " + L(m.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((x) => x !== m.id), A(K(i, o, r.id), "Removed the path from " + L(r.label) + " to " + L(m.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = y(n.station);
      return r.station.outcome = n.outcome, A(K(i, o, r.id), "Changed what happens at " + L(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = y(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), A(K(i, o, r.id), "Moved " + L(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = y(n.station);
      return n.image === null ? (delete r.station.image, A(K(i, o, r.id), "Removed the image at " + L(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, A(K(i, o, r.id), "Updated the image at " + L(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = y(n.station);
      if (!r.station.image) throw new F("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, A(K(i, o, r.id), "Updated the image description at " + L(r.label) + ".", { laneId: r.id });
    }
    case "connect_cards":
    case "connect_note": {
      const r = k(n.card);
      let m = r.id, x, S;
      if (n.kind === "connect_cards") {
        const j = k(n.to, r.laneId);
        if (j.id === r.id) throw new F("A line joins two different cards.", "refused", r.laneId, r.id);
        x = j.id, S = L(j.label);
      } else {
        const j = n.note.trim();
        if (i.cards.some((Y) => Y.id === j) || i.lanes.some((Y) => Y.id === j))
          throw new F("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", r.laneId, r.id);
        x = j, S = "the note " + j, n.direction === "from_note" && ([m, x] = [x, m]);
      }
      const O = Co(i, m, x, n.label ? { label: n.label } : {}), $ = dn(i, O);
      if ($) throw new F($, "refused", r.laneId, r.id);
      const M = An(i, O), q = m === r.id;
      return A(
        M,
        q ? "Drew a line from " + L(r.label) + " to " + S + "." : "Drew a line from " + S + " to " + L(r.label) + ".",
        { laneId: r.laneId, cardId: r.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const r = k(n.card), m = n.kind === "disconnect_cards" ? k(n.to, r.laneId).id : n.note.trim(), x = n.kind === "disconnect_cards" ? L(i.cards.find(($) => $.id === m).label) : "the note " + m, S = ($) => $.parentId === r.id && $.childId === m || $.parentId === m && $.childId === r.id, O = i.lines ?? [];
      return O.some(S) ? (i.lines = O.filter(($) => !S($)), A(K(i, o, r.laneId, r.id), "Took away the line between " + L(r.label) + " and " + x + ".", { laneId: r.laneId, cardId: r.id })) : A(e, L(r.label) + " and " + x + " are not joined by a line.", { laneId: r.laneId, cardId: r.id }, !1);
    }
  }
  throw new F("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function _(r, m) {
    const x = { laneId: m.id, cardId: r.id };
    if (r.laneId === m.id)
      return A(e, L(r.label) + " is already " + (p ? "at " : "in ") + L(m.label) + ".", x, !1);
    const S = ln(e, r.id, m.id);
    if (!S) throw new F(In(e, r.id, m.id) ?? "That move is not available.", "refused", m.id, r.id);
    return A(K(S, o, m.id, r.id), "Moved " + L(r.label) + " to " + L(m.label) + ".", x);
  }
}
function Gt(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount", "band"].find((l) => e[l] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? l !== "amount" && (l !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && l === "amount"));
  if (t) throw new F(t === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", o);
}
function bn(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function Be(e, n, o = {}) {
  const t = (C) => ({ refused: { index: 0, kind: null, laneId: null, ...C } });
  let l;
  try {
    l = Z(e);
  } catch (C) {
    return t({ reason: "The workshop cannot be read: " + (C instanceof Error ? C.message : String(C)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = l, p = [], b = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [C, y] of n.entries()) {
    const k = y?.kind, v = tt.find((m) => m.kind === k);
    if (!y || typeof y != "object" || !v)
      return t({
        index: C,
        kind: typeof k == "string" ? k : null,
        code: "invalid_edit",
        reason: "There is no edit called " + L(String(k)) + ". The edits are " + Me(tt.map((m) => m.kind)) + "."
      });
    const A = ir(y, v);
    if (A) return t({ index: C, kind: v.kind, code: "invalid_edit", reason: A });
    const R = Sn(l);
    if (!v.boards.includes(R))
      return t({ index: C, kind: v.kind, code: "not_on_this_board", reason: v.refusals[R] ?? "This workshop does not take " + v.kind + "." });
    let D;
    try {
      D = sr(l, y, R, o.selection, b);
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
    const _ = l.behaviour && !nr(v.kind) ? me().check(l, D.board) : null;
    if (_ && "refused" in _)
      return t({ index: C, kind: v.kind, reason: _.refused.sentence, code: "refused", laneId: _.refused.laneId, cardId: _.refused.cardId });
    const r = dr(l, D.board);
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
  const I = new Map(i.cards.map((C) => [C.id, C.laneId])), E = l.cards.flatMap((C) => {
    const y = I.get(C.id);
    return y === void 0 || y === C.laneId ? [] : [{ cardId: C.id, fromLaneId: y, toLaneId: C.laneId }];
  });
  return { workshop: l, report: { edits: p, movedCards: E } };
}
function ar(e, n) {
  const o = ie(e);
  if (o === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const t = e.lanes.find((l) => {
      const i = n.lanes.find((p) => p.id === l.id);
      return l.role !== i.role || l.probability !== i.probability;
    });
    if (t) return `${t.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (o === "budget") {
    const t = e.budget, l = n.budget;
    if (!l || t.total !== l.total || t.currency !== l.currency || t.step !== l.step) return "The total cannot change. Move money between teams instead.";
    const i = e.lanes.find((p) => {
      const b = n.lanes.find((I) => I.id === p.id);
      return p.floor !== b.floor || p.cap !== b.cap || p.capacity !== b.capacity;
    });
    if (i) return `${i.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((l) => l.id === t.id).capacity) ? W.launchLanes : o && ye(o).fixed?.(e, n) || null;
}
const lr = {
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
function dr(e, n) {
  const o = Z(e), t = Sn(o);
  let l;
  try {
    l = Z(n);
  } catch (I) {
    return On(I instanceof Error ? I.message : String(I), t);
  }
  const i = Sn(l), p = (I, E) => I.lanes.length === E.lanes.length && I.lanes.every((C) => E.lanes.some((y) => y.id === C.id)), b = (I, E) => I.lanes.every((C, y) => E.lanes[y]?.id === C.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && i !== t)
    return p(o, l) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, l)) return W.keepsOrder;
  if (ie(o) && i === t && !(p(o, l) && b(o, l))) return nt[t];
  if (ie(o) && i === t) {
    const I = ar(o, l);
    if (I) return I;
  }
  if (t === "release-plan" && i === "release-plan") {
    if (!p(o, l)) return W.releaseLanes;
    if (!b(o, l)) return W.releaseOrder;
    if (l.cards.some((I) => !o.cards.some((E) => E.id === I.id))) return W.releaseCards;
  }
  return t !== i ? "This slate holds a " + lr[t] + ", and it stays one. Start a new slate for another kind of workshop." : o.behaviour || l.behaviour ? me().replacement(o, l) : null;
}
const ri = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ii(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const i of n.panels) {
    if (!i || typeof i.id != "string" || !/^[a-z][\w-]{0,31}$/.test(i.id) || typeof i.label != "string" || !i.label.trim() || i.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(i.artwork) || !(i.after === null || typeof i.after == "string")) return null;
    o.push({ id: i.id, label: i.label.trim(), artwork: i.artwork, after: i.after });
  }
  const t = new Map(o.map((i) => [i.id, i])), l = [...new Set(n.hung)];
  if (t.size !== o.length || l.length !== n.hung.length || l.some((i) => !t.has(i))) return null;
  for (const i of o) {
    const p = /* @__PURE__ */ new Set([i.id]);
    let b = i.after;
    for (; b !== null; ) {
      if (p.has(b) || !t.has(b) || l.includes(i.id) && !l.includes(b)) return null;
      p.add(b), b = t.get(b).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: l };
}
function cr(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function si(e, n) {
  return cr(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const co = ["firstPrint", "secondPrint", "thirdPrint"], uo = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function ai(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...uo, route: n.route };
  for (const t of co) {
    const l = n[t];
    if (typeof l != "string" || !l.trim() || l.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = l.trim();
  }
  return o;
}
function li(e = new URLSearchParams()) {
  const n = { ...uo };
  for (const t of co) {
    const l = e.get(t)?.trim();
    l && l.length <= 48 && (n[t] = l);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function di(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function ur(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = pr(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), hr(n), n;
}
function fr(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function hr(e) {
  return e && fr(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Kt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function on(e) {
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
function pr(e) {
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
function Zn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const qt = "#1f7a5c", Jt = "#5b9a85", Vn = "#c2410c", mr = "#2f5fd0", wr = { canMove: !1, canSelect: !1 };
function gr(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ci(e, n, o = {}) {
  let t = Z(n);
  const l = o.kit, i = (s) => !!ie(s) && !l;
  if (i(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const p = l?.layer(e);
  let b = null, I = null, E = !!o.readOnly, C = E || i(t), y = !1;
  const k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let _ = null, r = null, m = null, x = null;
  const S = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map();
  let $ = null, M = null;
  function q(s, a) {
    M && clearTimeout(M.timer), M = { name: s, reason: a, timer: setTimeout(() => {
      M = null, y || z(I ?? t);
    }, 3e3) };
  }
  let j = Promise.resolve(), Y = null, J = Yt(o.layout), Oe = J;
  const Le = { ...o.style };
  let he = /* @__PURE__ */ new Map(), Pe = /* @__PURE__ */ new Set(), pe = null, $e = !1;
  const le = /* @__PURE__ */ new Map();
  Fe(t);
  const X = o.origin ? { x: o.origin.x, y: o.origin.y } : kr(e), ke = (s) => D.get(s) ?? s, de = (s) => gr(ke(s));
  function ce(s) {
    const a = R.get(s);
    if (a) return a;
    if (k.has(s) && !D.has(s) || !e.nodes.one?.(s)) return s;
    const d = Lo(s, (c) => !!e.nodes.one?.(c) || D.has(c));
    return R.set(s, d), D.set(d, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const be = {
    governs(s) {
      if (k.get(s.id) !== s) return null;
      const a = de(s.id)?.kind;
      return a === "card" ? { canMove: !C, canEditText: !C && !I && t.kind !== "release-plan", canConnect: Qe() } : a === "lane" ? { canMove: !1, canEditText: !C && !I } : a === "handle" ? { canMove: !C && !I, canEditText: !1, ...!J.narrow && { cursor: "ew-resize" } } : wr;
    },
    onStart(s, a) {
      const d = de(s.id), c = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const h = !C && !I && l ? l.handleDrag(t, ke(s.id), c, J) : null;
        return h ? (se(), Ne(), M && (clearTimeout(M.timer), M = null), b = { name: ke(s.id), follow: h, last: null }, !0) : !1;
      }
      const w = d.key;
      if (C || I || !t.cards.some((h) => h.id === w)) return !1;
      se(), Ne();
      let u = null;
      try {
        u = (l?.chooser ?? o.chooseCandidate)?.(t, w, c, J) ?? null;
      } catch (h) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", h);
      }
      return _ = { cardId: w, evaluate: u, grab: c, outcome: { kind: "home" } }, z(t, { skip: w }), !0;
    },
    onMove(s, a) {
      if (b) {
        b.last = b.follow(nn(a)), z(b.last.next, { grip: b.name, layout: b.last.layout }), B(o.onPreview, b.last.next === t ? null : b.last.next);
        return;
      }
      if (!_) return;
      const d = It(_.cardId, a, _.evaluate);
      if (yr(d, _.outcome)) return;
      _.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      z(c ?? t, { skip: _.cardId }), B(o.onPreview, c);
    },
    onEnd(s, a) {
      if (b) {
        const { follow: h, name: f } = b, g = h(nn(a));
        b = null, B(o.onPreview, null), g.refusal ? (q(f, g.refusal), z(t), e.announce?.(g.refusal), B(o.onRefuse, { laneId: null, reason: g.refusal })) : mn(g.next, {}) || z(t);
        const P = Kn(t, f);
        return P ? { accept: !0, settle: P } : { accept: !1 };
      }
      if (!_) return { accept: !1 };
      const { cardId: d, evaluate: c } = _, w = It(d, a, c), u = t.cards.find((h) => h.id === d);
      if (_ = null, B(o.onPreview, null), w.kind === "candidate" && l) {
        if (!mn(w.next, { cardId: d, laneId: w.laneId }, d))
          return z(t, { skip: d }), { accept: !1 };
        w.said && (q("card-" + d, w.said), e.announce?.(w.said));
        const h = Kn(t, ke(s.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (w.kind === "candidate") {
        t = w.next, z(t, { skip: d });
        const h = t.lanes.find((g) => g.id === w.laneId);
        e.announce?.(`${V(u)} moved to ${h.label}. ${Ae(t, h.id)}.`), B(o.onChange, t, { cardId: d, laneId: w.laneId });
        const f = Kn(t, ke(s.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (w.kind === "refused")
        Ko(V(u), { cardId: d, laneId: w.laneId, reason: w.reason }), w.near && q("card-" + d, w.reason);
      else if (w.kind === "outside" && sn(t) && !Ze()) {
        const h = xn(t, d);
        if (!h)
          return Bn(d, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        z(t, { skip: d }), e.announce?.(h), B(o.onRefuse, { cardId: d, laneId: null, reason: h });
      } else
        z(t, { skip: d }), w.kind === "outside" && (e.announce?.(`${V(u)} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (b) {
        b = null, B(o.onPreview, null), z(t);
        return;
      }
      const a = _ && t.cards.find((d) => d.id === _.cardId);
      _ = null, B(o.onPreview, null), z(t, { skip: de(s.id)?.key }), a && e.announce?.(`Move cancelled. ${V(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const c = de(s.id);
      if (!c || C || I) return !1;
      let w = a.replace(/\s+/g, " ").trim();
      const u = [], h = ie(t), f = h && c.kind === "card" ? ye(h).renamed(t, c.key, w) : null;
      f && (w = f.label, u.push(...f.edits));
      const g = c.kind === "lane" ? { laneId: c.key, label: w } : { cardId: c.key, label: w };
      u.unshift(c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: w } : { kind: "rename_card", card: { id: c.key }, label: w });
      const P = Be(t, u);
      if ("refused" in P) {
        const { reason: T } = P.refused;
        return e.announce?.(`${d} keeps its name. ${T}`), B(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: g, reason: T }), !1;
      }
      return JSON.stringify(P.workshop) === JSON.stringify(t) ? (z(t), !1) : (t = P.workshop, z(t), e.announce?.(f ? P.report.edits.map((T) => T.said).join(" ") : `${d} renamed to ${w}.`), B(o.onChange, t, { rename: g, ...l ? { edits: u } : {} }), f ? !1 : w);
    },
    onKeyDown(s, a) {
      const d = de(s.id);
      if (C || I || _ || b || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (m && (m.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== m.key) && At(), m && a.key === "Escape")
        return a.preventDefault(), At(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (m && a.key === "Enter") {
        a.preventDefault();
        const h = m.choices[m.at];
        return m = null, B(o.onPreview, null), t = h.next, z(t), e.announce?.(h.done), B(o.onChange, t, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: h.edits }), !0;
      }
      const c = l?.keyChoices?.(t, ke(s.id), a.key);
      if (c) {
        a.preventDefault();
        const h = [], f = [];
        for (const T of typeof c == "string" ? [] : c) {
          const N = Be(t, T.edits);
          "refused" in N ? f.push(`${T.said}: ${N.refused.reason}`) : h.push({ ...T, next: N.workshop, done: N.report.edits.map((H) => H.said).join(" ") });
        }
        if (!h.length)
          return e.announce?.(typeof c == "string" ? c : f.join(" ")), !0;
        const g = m && m.node === s.id ? (m.at + 1) % h.length : 0;
        m = { node: s.id, key: a.key.toLowerCase(), choices: h, at: g }, z(h[g].next), B(o.onPreview, h[g].next);
        const P = h.length > 1 ? ` (${g + 1} of ${h.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${h[g].said}${P} Enter to make it, Escape to cancel.`), !0;
      }
      const w = l?.keyEdit?.(t, ke(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (w) {
        a.preventDefault();
        const h = Be(t, w);
        return "refused" in h ? (e.announce?.(h.refused.reason), B(o.onRefuse, { laneId: h.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: h.refused.reason })) : mn(h.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = t.cards.find((h) => h.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), xt(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Mo())
        return a.preventDefault(), xt(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: h, next: f, spot: g } = r;
        if (r = null, h === null)
          return B(o.onPreview, null), Bn(u.id, g), !0;
        const P = t;
        t = f, z(t), Ee(h), B(o.onPreview, null);
        const T = t.lanes.find((N) => N.id === h);
        return e.announce?.(`${V(u)} moved to ${T.label}. ${Ae(t, h)}.`), B(o.onChange, t, { cardId: u.id, laneId: h, ...l ? { edits: l.editsBetween(P, t) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Ne(), e.announce?.(`Move cancelled. ${V(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => k.get(a.id) === a).map((a) => a.id);
      $e = s.length === 1, k.clear(), v.clear(), A.clear(), le.clear(), R.clear(), D.clear(), _ = null, r = null, z(I ?? t, { animate: !1 }), s.length === 1 && (j = j.then(() => {
        $e = !1;
        const a = k.get(s[0]);
        if (!y && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        jn();
      }));
    }
  };
  be.onFreeMove = (s, a) => {
    if (!un() || s.options?.isComment) return Fn();
    const d = fn(a), c = hn(s), w = t.lanes.filter((f) => !Ve(s) && Ue(t, f.id, c) === null).map((f) => f.id), u = d && l?.noteUnder?.(t, nn(a), J);
    u && (c.under = u);
    const h = d ? Ve(s) ?? Ue(t, d, c) : null;
    x && x.noteId === s.id && x.laneId === d && x.refusal === h || (x = { noteId: s.id, laneId: d, refusal: h, open: w }, Ce());
  }, be.onFreeDrop = (s, a, d) => {
    if (Fn(), !un() || s.options?.isComment) return;
    const c = fn(a);
    if (!c) return;
    const w = hn(s), u = l?.noteUnder?.(t, nn(a), J);
    u && (w.under = u);
    const h = t.lanes.find((g) => g.id === c), f = Ve(s) ?? Ue(t, c, w);
    return f ? (se(!1), $ = { laneId: c, reason: f, timer: setTimeout(() => se(), 1500) }, Ce(), e.announce?.(`${zn(w.label)} can't go in ${h.label}. ${f}`), B(o.onRefuse, { noteId: s.id, laneId: c, reason: f }), "refused") : (Hn([{ node: s, offer: w, from: d }], c), "taken");
  }, be.onFreeGroupDrop = (s, a, d) => {
    if (Fn(), !un() || s.some((f) => f.options?.isComment)) return;
    const c = fn(a);
    if (!c) return;
    const w = t.lanes.find((f) => f.id === c), u = s.map((f) => ({ node: f, offer: hn(f) })), h = Fo(u, c);
    if (h) {
      se(!1), $ = { laneId: c, reason: h, timer: setTimeout(() => se(), 1500) }, Ce(), e.announce?.(`${Ct(u.map((f) => zn(f.offer.label)))} can't go in ${w.label}. ${h}`);
      for (const { node: f } of u) B(o.onRefuse, { noteId: f.id, laneId: c, reason: h });
      return "refused";
    }
    return Hn(u.map((f, g) => ({ ...f, from: d?.[g] })), c), "taken";
  }, be.onFreeTextCommit = (s) => {
    if (!un() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = fn({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = hn(s), w = t.lanes.find((P) => P.id === d), u = Ve(s) ?? Ue(t, d, c);
    if (!u) {
      Hn([{ node: s, offer: c }], d);
      return;
    }
    se(!1), $ = { laneId: d, reason: u, timer: setTimeout(() => se(), 1500) }, Ce(), e.announce?.(`${zn(c.label)} can't go in ${w.label}. ${u} It is beside the board.`), B(o.onRefuse, { noteId: s.id, laneId: d, reason: u });
    const { width: h } = Fe(t), f = Math.round(X.x + h + 32), g = Math.round(a.y ?? X.y);
    s.position(f, g, () => e.updateSelectionResizeRotate?.(), void 0, Zn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Kt({ ...s.options, x: f, y: g })] });
  }, be.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...S], lines: (t.lines ?? []).map((s) => ({ ...s })) }), be.onUndoRestore = (s, a) => {
    if (y) return;
    const d = new Map((s?.cards ?? []).map((u) => [u.id, u])), c = new Map(s?.pairs ?? []), w = (u) => S.get(u) ?? c.get(u) ?? u;
    for (const u of a.added) {
      const h = w(u), f = t.cards.find((P) => P.id === h);
      if (!f) continue;
      t = Z({ ...t, cards: t.cards.filter((P) => P !== f), lines: He(t.lines, h, u) }), z(t);
      const g = B(o.onChange, t, { cardId: h, cardToNote: { noteId: u } });
      e.holdTrade?.(u, g), Qn(g);
    }
    for (const u of a.removed) {
      const h = w(u), f = d.get(h);
      if (!f || t.cards.some((G) => G.id === h)) continue;
      const g = (s?.lines ?? []).filter((G) => G.parentId === h || G.childId === h), P = {
        id: h,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...g.length ? { lines: g } : {}
      }, T = [f.laneId, ...t.lanes.map((G) => G.id)].find((G) => rn(t, G, P));
      if (!T) {
        e.announce?.(`${V(f)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Uo(rn(t, T, P), h, s?.cards ?? []), h !== u && S.set(u, h), z(t);
      const N = t.cards.findIndex((G) => G.id === h), H = t.cards.slice(N + 1).find((G) => G.laneId === T)?.id, U = B(o.onChange, t, { cardId: h, laneId: T, noteToCard: {
        noteId: u,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...H ? { before: H } : {},
        ...g.length ? { lines: He(g, h, u) } : {}
      } });
      e.holdTrade?.(u, U), Qn(U);
    }
    Array.isArray(s?.lines) && Bo(s.lines);
  };
  let Wn = !1;
  be.onNodeAdded = (s) => {
    y || Wn || k.get(s.id) === s || (t.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (Wn = !0, queueMicrotask(() => {
      Wn = !1, y || Ce();
    }));
  }, be.onLine = (s, a) => {
    y || queueMicrotask(() => {
      y || Do(s, a);
    });
  };
  const _o = e.setDragPolicy(be), Ro = o.onSelect || p ? e.onSelectionChange?.(() => {
    jn(), _t();
  }) : void 0;
  let cn = null;
  const bt = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, c = d && k.has(d) ? Et(d) : null;
    c !== cn && (cn = c, _t());
  };
  p && e.element?.addEventListener?.("pointerover", bt);
  const vt = () => {
    r && Ne();
  };
  e.element?.addEventListener?.("pointerdown", vt, !0), z(t, { animate: !1 });
  function It(s, a, d) {
    const c = t.cards.find((T) => T.id === s);
    if (!c) return { kind: "outside" };
    if (l) {
      const T = nn(a), N = l.refusalAt(t, s, _?.grab ?? { x: 0, y: 0 }, T, J);
      if (N && !N.lands) return { kind: "refused", laneId: N.laneId, reason: N.reason };
      const { width: H, height: U } = Fe(t);
      if (T.x < -40 || T.y < -40 || T.x > H + 40 || T.y > U + 40) return { kind: "outside" };
      let G = t;
      try {
        G = d?.(T) ?? t;
      } catch (ee) {
        console.warn("WORKSHOP: the board kit's chooser threw", ee);
      }
      return JSON.stringify(G) === JSON.stringify(t) ? N ? { kind: "refused", laneId: N.laneId, reason: N.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: G.cards.find((ee) => ee.id === s)?.laneId ?? c.laneId, next: G, ...N && { said: N.reason } };
    }
    const w = t.lanes.map((T) => k.get(ce(re.column(T.id)))).filter(Boolean), u = e.hitTestNodes(a, w, { padding: 6 }), h = u ? de(u.id).key : null;
    if (!h) return { kind: "outside" };
    if (h === c.laneId) return { kind: "home" };
    const f = ln(t, s, h);
    if (!f) return { kind: "refused", laneId: h, reason: In(t, s, h) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: h, next: f };
    let g = null;
    try {
      g = d({ x: a.x - X.x, y: a.y - X.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: h, next: f };
    }
    const P = g?.cards.find((T) => T.id === s)?.laneId;
    return !g || !P || P === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: P, next: g };
  }
  function Mo() {
    return l ? !1 : new Set(Ge(t, { layout: J }).places.map((s) => s.row)).size > 1;
  }
  function xt(s, a, d = !1) {
    const c = t.cards.find((T) => T.id === s), w = Vt(t, s), u = r?.cardId === s && r.laneId === null ? r.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const T = u > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Ne(), T.id === c.laneId) {
        Ee(T.id, I ?? t), e.announce?.(`${V(c)} is back in ${T.label}.`);
        return;
      }
      if (w.includes(T)) {
        const H = ln(t, s, T.id);
        r = { cardId: s, laneId: T.id, next: H }, z(H), Ee(T.id, H), B(o.onPreview, H), e.announce?.(`${V(c)} to ${T.label}: ${Ae(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const N = In(t, s, T.id) ?? "That move is not available.";
      se(), $ = { laneId: T.id, reason: N, timer: setTimeout(() => se(), 1500) }, z(I ?? t), Ee(T.id, I ?? t), e.announce?.(`${V(c)} can't move to ${T.label}. ${N}`), B(o.onRefuse, { cardId: s, laneId: T.id, reason: N });
      return;
    }
    const h = r?.cardId === s ? r.laneId : c.laneId;
    let f;
    if (d) {
      const { places: T } = Ge(t, { layout: J }), N = T.find((H) => H.laneId === h);
      f = T.filter((H) => H.column === N.column && (H.row - N.row) * a > 0).sort((H, U) => (H.row - U.row) * a).map((H) => t.lanes.find((U) => U.id === H.laneId));
    } else {
      const T = t.lanes.findIndex((N) => N.id === h);
      f = a > 0 ? t.lanes.slice(T + 1) : t.lanes.slice(0, T).reverse();
    }
    const g = f.find((T) => w.includes(T));
    if (se(), !g) {
      const T = f[0];
      if (!T) {
        if (!d && sn(t)) {
          const H = xn(t, s);
          if (H) {
            e.announce?.(H), B(o.onRefuse, { cardId: s, laneId: null, reason: H });
            return;
          }
          Wo(c, a);
          return;
        }
        e.announce?.(`${V(c)} has no lane to move to on that side.`);
        return;
      }
      const N = In(t, s, T.id) ?? "That move is not available.";
      $ = { laneId: T.id, reason: N, timer: setTimeout(() => se(), 1500) }, z(r?.next ?? I ?? t), Ee(T.id, r?.next ?? I ?? t), e.announce?.(`${V(c)} can't move to ${T.label}. ${N}`), B(o.onRefuse, { cardId: s, laneId: T.id, reason: N });
      return;
    }
    if (g.id === c.laneId) {
      Ne(), Ee(g.id, I ?? t), e.announce?.(`${V(c)} is back in ${g.label}.`);
      return;
    }
    const P = ln(t, s, g.id);
    r = { cardId: s, laneId: g.id, next: P }, z(P), Ee(g.id, P), B(o.onPreview, P), e.announce?.(`${V(c)} to ${g.label}: ${Ae(P, g.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ee(s, a = t) {
    const d = l ? Jo(a, re.column(s)) : Ge(a, { layout: J, rows: $t() }).places.find((g) => g.laneId === s), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const w = 16, u = (g, P, T, N) => P + w * 2 >= N || g - w < T ? g - w - T : g + P + w > T + N ? g + P + w - (T + N) : 0, h = u(X.x + d.x, d.width, c.x, c.width), f = u(X.y + d.y, d.height, c.y, c.height);
    (h || f) && e.panBy?.({ x: h, y: f });
  }
  function jn() {
    if (!o.onSelect || $e) return;
    const s = y ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && k.get(s[0].id) === s[0] ? de(s[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== pe && (pe = c, B(o.onSelect, d));
  }
  function At() {
    m && (m = null, z(t), B(o.onPreview, null));
  }
  function Ne() {
    r && (r = null, B(o.onPreview, null), z(I ?? t));
  }
  function Wo(s, a) {
    const { width: d } = Fe(t), c = k.get(ce(re.card(s.id)))?.options, w = c?.width ?? 228, u = { x: a > 0 ? X.x + d + 32 : X.x - w - 32, y: c?.y ?? X.y }, h = Xt(t, s.id);
    r = { cardId: s.id, laneId: null, side: a, spot: u, next: t }, z(t), B(o.onPreview, h), e.announce?.(`${V(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ze() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function un() {
    return !y && !C && !I && !_ && !Ze() && sn(t);
  }
  function Fn() {
    x && (x = null, y || Ce());
  }
  function fn(s) {
    const a = t.lanes.map((c) => k.get(ce(re.column(c.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? de(d.id)?.key ?? null : null;
  }
  function hn(s) {
    const a = s.options ?? {}, d = mo({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), w = c.replace(/\s+/g, " ").trim(), u = {};
    c.trim() !== w && c.length <= 4e3 && (u.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const f of ["width", "height"]) Number.isFinite(a[f]) && a[f] >= 10 && a[f] <= 4e3 && (u[f] = Math.round(a[f]));
    if (it(a.image)) {
      u.image = { src: a.image };
      for (const [f, g] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[g]) && a[g] >= 1 && a[g] <= 2e4 && (u.image[f] = a[g]);
    }
    a.link?.data && Zt({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const h = jo(s);
    return { id: s.id, label: w, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...h.length ? { lines: h } : {} };
  }
  function jo(s) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!k.get(c) && k.get(c) === e.nodes.one(c);
    for (const c of s.relationships?.getAssociations?.() ?? [])
      (c.targetPoint || !d(c.childId)) && a.set(c.id, Xe(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === s || d(c.id)))
        for (const w of c.relationships?.getAssociations?.() ?? [])
          w.childId === s.id && !w.targetPoint && a.set(w.id, Xe(w));
    for (const c of eo(t, s.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function Ct(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function Fo(s, a) {
    for (const { node: u } of s) {
      const h = Ve(u);
      if (h) return h;
    }
    const d = t.lanes.find((u) => u.id === a), c = t.cards.filter((u) => u.laneId === a).length;
    if (d.capacity !== void 0 && c + s.length > d.capacity) {
      const u = d.capacity - c;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let w = t;
    for (const { offer: u } of s) {
      const h = Ue(w, a, u);
      if (h) return h;
      w = rn(w, a, u);
    }
    return null;
  }
  function Ve(s) {
    if (s.options?.image && !it(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !Zt({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const zn = (s) => s || "This note", V = (s) => s.label || "The empty card";
  function Qe() {
    return !y && !C && !I && !Ze() && !t.kind && sn(t);
  }
  function Xe(s) {
    const a = { id: s.id, parentId: s.parentId, childId: s.childId };
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
      const w = s[c];
      w != null && w !== "" && (a[c] = w);
    }
    for (const c of ["sourceAnchor", "targetAnchor"]) {
      const w = s[c];
      w && Number.isFinite(w.x) && Number.isFinite(w.y) && (a[c] = { x: w.x, y: w.y });
    }
    const d = s.targetPoint;
    return d && Number.isFinite(d.x) && Number.isFinite(d.y) && (a.targetPoint = { x: d.x, y: d.y }, delete a.targetAnchor), a;
  }
  function Tt(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function St(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (k.get(s.id) === s) {
      const a = de(s.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment ? null : s.id;
  }
  function Dn(s, a) {
    if (s.cards.some((c) => c.id === a)) {
      const c = k.get(ce(re.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && k.get(a) !== d && d.svgGroup ? d : null;
  }
  function Ot(s) {
    const a = [];
    for (const d of s) {
      const c = e.nodes.one(d.parentId);
      if (!c?.relationships || k.get(c.id) === c || c.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const h = c.relationships.addFloatingAssociation(d.targetPoint, on(d));
        a.push({ type: "addRelationship", data: { ...h } });
        continue;
      }
      const w = e.nodes.one(d.childId);
      if (!w || k.get(w.id) === w) continue;
      const u = c.relationships.addAssociation(w, on(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function zo(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const N = Dn(s, d.parentId);
        if (!N || k.get(N.id) !== N) continue;
        const H = { ...d, parentId: N.id }, U = JSON.stringify(H);
        a.add(d.id);
        const G = le.get(d.id);
        if (G && G.key === U && G.holder === N && !G.other && N.relationships.hasAssociationId?.(d.id)) continue;
        G && e.nodes.one(G.holder.id) === G.holder && G.holder.relationships?.removeAssociation?.(d.id), N.relationships.addFloatingAssociation(d.targetPoint, on(H)), le.set(d.id, { holder: N, other: null, swapped: !1, key: U });
        continue;
      }
      const c = Dn(s, d.parentId), w = Dn(s, d.childId);
      if (!c || !w || c === w) continue;
      const u = k.get(c.id) !== c, h = u ? w : c, f = u ? c : w, g = u ? Tt({ ...d, parentId: h.id, childId: f.id }, d) : { ...d, parentId: h.id, childId: f.id }, P = JSON.stringify(g);
      a.add(d.id);
      const T = le.get(d.id);
      T && T.key === P && T.holder === h && T.other === f && h.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), h.relationships.addAssociation(f, on(g)), le.set(d.id, { holder: h, other: f, swapped: u, key: P }));
    }
    for (const [d, c] of [...le])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), le.delete(d));
  }
  function pn(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let en = null;
  function Do(s, a) {
    if (s === "addRelationship") {
      if (le.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, c = e.nodes.one(a?.parentId), w = d ? null : e.nodes.one(a?.childId), u = St(c), h = d ? null : St(w), f = en?.lineId === a?.id ? t.lines?.find((H) => H.id === a?.id) : void 0;
      f && (en = null);
      const g = (H) => {
        pn(a), f && z(I ?? t), e.announce?.(H), B(o.onRefuse, { reason: H, laneId: null });
      };
      if (!Qe()) {
        pn(a), f && z(I ?? t);
        return;
      }
      if (!u || !h && !d) return g(f ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const P = d ? String(a.childId) : h;
      if (f) {
        const H = t.cards.some((Re) => Re.id === u), U = !d && t.cards.some((Re) => Re.id === h);
        if (!H && !U) return _e({ remove: f.id });
        const G = { ...Xe(a), id: f.id, parentId: u, childId: P }, ee = dn(t, G);
        if (ee) return g(ee);
        pn(a), _e({ set: G });
        return;
      }
      const T = Co(t, u, P, Xe(a)), N = dn(t, T);
      if (N) return g(N);
      pn(a), _e({ set: T });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...le].find(([w, u]) => (w === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = le.get(d);
      if (le.delete(d), e.nodes.one(c.holder.id) !== c.holder || c.other && e.nodes.one(c.other.id) !== c.other || !Qe())
        return Qe() || y ? void 0 : z(I ?? t);
      en = { lineId: d }, queueMicrotask(() => {
        y || en?.lineId !== d || (en = null, _e({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...le].find(([T, N]) => T === d?.associationId && N.holder.id === d?.id);
        if (!c) continue;
        const [w, u] = c, h = t.lines?.find((T) => T.id === w), f = u.holder.relationships?.getAssociations?.().find((T) => T.id === w);
        if (!h || !f) continue;
        if (!Qe()) {
          z(I ?? t);
          continue;
        }
        const g = Xe(f), P = u.swapped ? Tt({ ...g, id: h.id, parentId: h.parentId, childId: h.childId }, g) : { ...g, id: h.id, parentId: h.parentId, childId: h.childId };
        JSON.stringify(Ho(P)) !== JSON.stringify(h) && (le.set(w, { ...u, key: "" }), _e({ set: P }));
      }
  }
  function Ho(s) {
    return An({ ...t, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function _e(s) {
    const a = t.lines?.find((f) => f.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? An(t, s.set) : no(t, s.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), z(I ?? t);
    const c = "set" in s ? s.set : a, w = [c.parentId, c.childId].map((f) => t.cards.find((g) => g.id === f)?.label ?? e.nodes.one(f)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (f) => w[f] || (f === 1 && c.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${u(0)} to ${u(1)} changed.` : c.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const h = B(o.onChange, t, { line: s });
    Qn(h, () => {
      if (y || t !== d) return;
      const f = a ? An(t, a) : "set" in s ? no(t, s.set.id) : null;
      f && (t = f, z(I ?? t));
    });
  }
  function Bo(s) {
    const a = new Map(s.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || _e({ remove: c });
    for (const [c, w] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(w) && dn(t, w) === null && _e({ set: w });
  }
  function Hn(s, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), w = s.map(({ node: f, offer: g, from: P }) => {
      let T = g.lines;
      for (const [U, G] of c) T = He(T, U, G);
      d = rn(d, a, { ...g, ...T ? { lines: T } : {} });
      const N = d.cards[d.cards.length - 1];
      N.id !== f.id && c.set(f.id, N.id);
      const H = { ...f.options ?? {}, ...P ? { x: P.x, y: P.y } : {} };
      return { node: f, card: N, kept: H, lines: He(T ?? [], f.id, N.id), under: g.under };
    });
    e.beginHostStep?.(), t = d;
    let u = t;
    for (const { node: f, card: g } of w)
      g.id !== f.id && S.set(f.id, g.id), O.set(ce(re.card(g.id)), { x: f.options?.x ?? 0, y: f.options?.y ?? 0 }), je(() => e.removeNode(f.id));
    e.endHostStep?.(), z(t), Go(ce(re.card(w[0].card.id)));
    const h = t.lanes.find((f) => f.id === a);
    e.announce?.(w.length === 1 ? `${V(w[0].card)} is now a card in ${h.label}. ${Ae(t, a)}.` : `${Ct(w.map(({ card: f }) => V(f)))} are now cards in ${h.label}. ${Ae(t, a)}.`);
    for (const { node: f, card: g, kept: P, lines: T, under: N } of w) {
      const H = { cardId: g.id, laneId: a, noteToCard: {
        noteId: f.id,
        label: g.label,
        ...N && { under: N },
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...T.length ? { lines: T } : {}
      } }, U = () => {
        t !== u || !t.cards.some((ee) => ee.id === g.id) || (t = Z({ ...t, cards: t.cards.filter((ee) => ee.id !== g.id), lines: He(t.lines, g.id, f.id) }), u = t, z(t));
      }, G = B(o.onChange, t, H);
      e.holdTrade?.(f.id, G), Lt(G, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: f.id, isComment: !1 } }]);
      }, () => {
        if (!y) {
          if (U(), !e.nodes.one(P.id)) {
            e.beginHostStep?.();
            const ee = je(() => e.addNode({ ...P }));
            ee && (ee.announcedByCreator = !0), e.endHostStep?.();
            const Re = He(T, g.id, f.id).filter((ue) => !t.cards.some((wn) => wn.id === ue.parentId || wn.id === ue.childId));
            ee?.ready?.then?.(() => {
              y || je(() => Ot(Re));
            });
          }
          e.announce?.(`${V(g)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        y || (U(), e.keepTrade?.(f.id), e.announce?.(`Someone else put ${V(g)} on the board first.`));
      });
    }
  }
  function Bn(s, a) {
    const d = t.cards.find((te) => te.id === s), c = t.lanes.find((te) => te.id === d.laneId), w = t.cards.findIndex((te) => te.id === s), u = t.cards.slice(w + 1).find((te) => te.laneId === d.laneId)?.id, h = v.get(ce(re.card(s))) ?? {}, f = fo(d), g = e.nodes.one(f) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : f, P = eo(t, s), { leave: T } = Er(t, s, g), N = Xt(t, s, g), H = (Le.cornerRadius ?? 0) > 0, U = d.asNote, G = U?.text !== void 0 && mt(U.text) === d.label ? U.text : $r(t, d), ee = {
      id: g,
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
    e.beginHostStep?.(), t = N;
    const Re = t;
    g !== s ? S.set(g, s) : S.delete(g);
    const ue = je(() => e.addNode(ee));
    ue && (ue.announcedByCreator = !0), e.endHostStep?.(), z(t);
    const wn = Promise.resolve(ue?.ready).then(() => y || !ue || e.nodes.one(g) !== ue ? [] : je(() => Ot(T))).catch(() => []);
    ue?.ready?.then?.(() => {
      if (y || e.nodes.one(g) !== ue) return;
      const te = () => e.selectNodes?.([ue]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(te) : te();
    }), e.announce?.(`${V(d)} is now a note on the canvas. ${c.label}: ${Ae(t, c.id)}.`);
    const jt = () => {
      e.nodes.one(g) === ue && (e.beginHostStep?.(), je(() => e.removeNode(g)), e.endHostStep?.());
    }, Ft = B(o.onChange, t, { cardId: s, cardToNote: { noteId: g } });
    e.holdTrade?.(g, Ft), Lt(Ft, () => {
      wn.then((te) => {
        ue && e.nodes.one(g) === ue && e.sendHeld?.([{ type: "onNodeAdded", data: { id: g, nodeOptions: Kt(ue.options) } }, ...te]);
      });
    }, () => {
      if (!y) {
        if (jt(), t === Re && !t.cards.some((te) => te.id === s)) {
          const te = {
            id: s,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...P.length ? { lines: P } : {}
          }, zt = rn(t, d.laneId, te, u);
          zt && (t = zt, z(t));
        }
        e.announce?.(`${V(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      y || (jt(), e.keepTrade?.(g), e.announce?.(`Someone else took ${V(d)} off the lanes first.`));
    });
  }
  function Uo(s, a, d) {
    const c = d.map((g) => g.id), w = c.indexOf(a), u = s.cards.find((g) => g.id === a);
    if (w < 0 || !u) return s;
    const h = s.cards.filter((g) => g !== u), f = h.findIndex((g) => c.indexOf(g.id) > w);
    return h.splice(f < 0 ? h.length : f, 0, u), Z({ ...s, cards: h });
  }
  function Go(s) {
    j = j.then(() => {
      const a = k.get(s);
      if (y || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function je(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Lt(s, a, d, c) {
    if (!s || typeof s.then != "function") return a();
    const w = s.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && c();
    }, () => d());
    e.holdUntil?.(w);
  }
  function Ko(s, a) {
    se(!1), $ = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => se(), 1500) }, z(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), B(o.onRefuse, a);
  }
  function se(s = !0) {
    $ && (clearTimeout($.timer), $ = null, s && !y && Ce());
  }
  function Ce() {
    z(_ && _.outcome.kind === "candidate" ? _.outcome.next : r?.next ?? I ?? t, { skip: _?.cardId });
  }
  function Pt(s) {
    const a = Mt(s, $t()), d = new Map(a.map((u) => [u.options.id, u.options])), c = (u, h, f, g = !1) => {
      const P = d.get(re.column(u));
      P && (P.borderColor = h, P.borderWidth = f, delete P.borderStyle);
      const T = g && d.get(re.lane(u));
      T && (T.borderColor = h, T.borderWidth = f);
    }, w = _?.cardId ?? r?.cardId;
    if (he = /* @__PURE__ */ new Map(), w) {
      const u = t.cards.find((g) => g.id === w)?.laneId, h = Vt(t, w);
      if (!l || l.laneCues)
        for (const g of h) g.id !== u && (c(g.id, Jt, 2), he.set(g.id, "open"));
      if (l?.laneCues) {
        for (const g of t.lanes) if (!h.includes(g)) {
          const P = d.get(re.column(g.id));
          P && (P.backgroundColor = "#e9e8e2"), he.set(g.id, "closed");
        }
      }
      const f = _ ? _.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      f?.kind === "candidate" && (c(f.laneId, qt, 3, !0), he.set(f.laneId, "over")), f?.kind === "refused" && (c(f.laneId, Vn, 3), he.set(f.laneId, "refused"));
    }
    if (x && !w) {
      for (const u of x.open) u !== x.laneId && (c(u, Jt, 2), he.set(u, "open"));
      x.laneId && !x.refusal && (c(x.laneId, qt, 3, !0), he.set(x.laneId, "over")), x.laneId && x.refusal && (c(x.laneId, Vn, 3), he.set(x.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const u = d.get(re.card(r.cardId));
      u && (u.xPos = r.spot.x, u.yPos = r.spot.y);
    }
    if ($) {
      he.set($.laneId, "refused"), c($.laneId, Vn, 3, !0);
      const u = d.get(re.caption($.laneId));
      u && (u.text = $.reason, u.foregroundColor = "#b42318");
    }
    if (Pe = /* @__PURE__ */ new Set(), I && s === I) {
      const u = (f, g) => JSON.stringify(f) === JSON.stringify(g), h = (f) => {
        const g = d.get(f);
        g && (g.borderStyle = "dashed", g.borderColor = mr, g.borderWidth = 2, Pe.add(ce(f)));
      };
      for (const f of s.cards) u(f, t.cards.find((g) => g.id === f.id)) || h(re.card(f.id));
      for (const f of s.lanes) u(f, t.lanes.find((g) => g.id === f.id)) || h(re.lane(f.id));
    }
    for (const u of a) {
      u.options.id = ce(u.options.id);
      for (const h of u.relationships.associations)
        h.parentId = ce(h.parentId), h.childId = ce(h.childId);
    }
    return a;
  }
  function $t() {
    return _ || r ? t.lanes.map((s) => t.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function z(s, a = {}) {
    if (y) return;
    Oe = a.layout ?? J, Y = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Pt(s), c = [];
    for (const { options: u } of d) {
      const h = u.id;
      if (k.has(h)) continue;
      const f = O.get(h);
      O.delete(h);
      const g = f && a.animate !== !1 && !Zn() ? { ...u, xPos: f.x, yPos: f.y } : u, P = e.nodes.add(ur(g));
      k.set(h, P), v.set(h, { ...g }), P.ready && c.push(P.ready.then(() => {
        if (k.get(h) !== P) return;
        P.applyGovernance?.(), de(h)?.kind === "column" && P.toBack?.(!1), de(h)?.kind === "handle" && P.svgGroup?.front?.();
        const T = Wt(Y?.model ?? s, h);
        T && P.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const w = Y;
    j = Promise.all([j, ...c]).then(() => {
      y || Y !== w || qo(Pt(w.model), w);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function qo(s, a) {
    const d = new Set(s.map((w) => w.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, h] of [...k]) {
        if (d.has(u)) continue;
        for (const [g, P] of [...A])
          P.parentId !== u && P.childId !== u || (P.parent.relationships?.removeAssociation(g), A.delete(g));
        e.deselectNode?.(h), h.editor?.cancelInline?.(), k.delete(u), v.delete(u);
        const f = D.get(u);
        f && (D.delete(u), R.delete(f)), e.nodes.remove(u);
      }
      for (const { options: u } of s) {
        const h = u.id, f = k.get(h);
        if (!f?.svgGroup) continue;
        const g = v.get(h) ?? {}, P = f.editor?.isInlineEditing?.();
        (u.fontSize !== g.fontSize || u.foregroundColor !== g.foregroundColor) && (f.options.fontSize = u.fontSize, f.options.fontColor = u.foregroundColor, f.applyTextStyle?.()), u.text !== g.text && !P && f.setText?.(u.text), (u.width !== g.width || u.height !== g.height) && (u.vectorPath ? (f.options.width = u.width, f.options.height = u.height, f.setShape?.(f.options.shape, u.vectorPath), de(h)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(u.width, u.height)), u.backgroundColor !== g.backgroundColor && f.setColors?.(u.backgroundColor), (u.borderColor !== g.borderColor || u.borderWidth !== g.borderWidth || u.borderStyle !== g.borderStyle) && (f.options.borderColor = u.borderColor, f.options.borderWidth = u.borderWidth, f.options.borderStyle = u.borderStyle, f.applyBorder?.());
        const T = u.xPos !== g.xPos || u.yPos !== g.yPos || Math.abs((f.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - u.yPos) > 0.5;
        if (h !== (a.skip && ce(re.card(a.skip))) && h !== (a.grip && ce(a.grip)) && T) {
          const U = a.animate && !Zn() ? 180 : 0, G = c.includes(f) ? () => {
            !y && k.get(h) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          G && U && c.length === 1 && f.resizeRotate?.disable?.(), f.position(u.xPos, u.yPos, G, void 0, U);
        }
        const N = Wt(a.model, h);
        N && f.svgGroup.node.getAttribute("aria-label") !== N && f.svgGroup.node.setAttribute("aria-label", N), Pe.has(h) ? f.svgGroup.node.setAttribute("data-workshop-proposed", "") : f.svgGroup.node.removeAttribute("data-workshop-proposed");
        const H = de(h);
        if (H?.kind === "column") {
          const U = he.get(H.key);
          U ? f.svgGroup.node.setAttribute("data-workshop-drop", U) : f.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        H?.kind === "handle" && f.svgGroup.front?.(), v.set(h, { ...u });
      }
      const w = /* @__PURE__ */ new Map();
      for (const u of s) for (const h of u.relationships.associations) w.set(h.id, h);
      for (const [u, h] of [...A])
        w.has(u) && k.get(h.parentId) === h.parent && k.get(h.childId) === h.child || (h.parent.relationships?.removeAssociation(u), A.delete(u));
      for (const [u, h] of w) {
        if (A.has(u)) continue;
        const f = k.get(h.parentId), g = k.get(h.childId);
        !f?.relationships || !g?.svgGroup || (f.relationships.addAssociation(g, on(h)), A.set(u, { parentId: h.parentId, childId: h.childId, parent: f, child: g }));
      }
      zo(a.model);
    }), Rt(a.model), e.notifyNodeChanged?.();
  }
  let Un = null;
  function Et(s) {
    const a = de(s);
    return a ? a.kind === "card" ? a.key : l?.cardOfPart?.(t, ke(s)) ?? null : null;
  }
  function Nt() {
    if (b) return l?.cardOfPart?.(t, b.name) ?? null;
    if (_) return _.cardId;
    if (cn) return cn;
    const s = y ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && k.get(s[0].id) === s[0] ? Et(s[0].id) : null;
  }
  let Gn = null;
  function _t() {
    y || !p || !Un || Nt() !== Gn && Rt(Un);
  }
  function Rt(s) {
    if (p) {
      Un = s, Gn = Nt();
      const a = t.lanes.map((w) => k.get(ce(re.column(w.id)))?.svgGroup?.node).reduce((w, u) => u && (!w || w.compareDocumentPosition(u) & 4) ? u : w, null), d = e.canvas?.viewbox?.(), c = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - X.x, y: d.y - X.y, width: d.width, height: d.height } : null;
      p.draw(t, s === t ? null : s, {
        origin: X,
        layout: Oe,
        above: a,
        view: c,
        announce: (w) => e.announce?.(w),
        focus: Gn,
        clamp: b?.last?.clampedReason ? { name: b.name, text: b.last.clampedReason } : _?.outcome.kind === "candidate" && _.outcome.said ? { name: "card-" + _.cardId, text: _.outcome.said } : !b && M ? { name: M.name, text: M.reason } : null,
        refused: !!b?.last?.refusal || !b && !!M,
        onUnlink: (w, u) => {
          if (C || I || _ || b || Ze()) return;
          const h = Be(t, [{ kind: "unlink_tasks", card: { id: w }, waitsOn: { id: u } }]);
          "refused" in h ? e.announce?.(h.refused.reason) : mn(h.workshop, { cardId: w });
        }
      });
    }
  }
  function nn(s) {
    return { x: s.x - X.x, y: s.y - X.y };
  }
  function Fe(s) {
    return l ? l.places(s, Oe) : { ...Ge(s, { layout: J }), parts: [] };
  }
  function Jo(s, a) {
    const d = l.places(s, Oe).parts.find((c) => c.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function Mt(s, a) {
    if (!l) return zr(s, { native: !0, origin: X, rows: a, layout: J, style: Le }).nodes;
    const d = l.notes(s, Oe, X, Le);
    if (s.behaviour && d.length) {
      const c = d.map((f) => f.options), w = Math.min(...c.map((f) => f.xPos)), u = Math.max(...c.map((f) => f.xPos + f.width)), h = No(s, { x: w, y: Math.max(...c.map((f) => f.yPos + f.height)) + 16, width: Math.min(u - w, 484) }, Le);
      h && d.push(h);
    }
    return d;
  }
  function mn(s, a, d) {
    const c = l.editsBetween(t, s);
    if (!c.length) return !1;
    const w = Be(t, c);
    return "refused" in w ? (e.announce?.(w.refused.reason), B(o.onRefuse, { ...a, laneId: w.refused.laneId, reason: w.refused.reason }), !1) : (t = w.workshop, z(t, { skip: d }), e.announce?.(w.report.edits.map((u) => u.said).join(" ")), B(o.onChange, t, { ...a, edits: c }), !0);
  }
  function Wt(s, a) {
    const d = de(a);
    if (d?.kind === "lane") {
      const c = s.lanes.find((w) => w.id === d.key);
      return c ? `${c.label}, ${Ae(s, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = s.cards.find((u) => u.id === d.key), w = c && s.lanes.find((u) => u.id === c.laneId);
      return c && w ? `${c.label || "Empty card"}, in ${w.label}${l?.cardKeys ? ". " + l.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? l?.label?.(s, ke(a)) ?? null : null;
  }
  function Kn(s, a) {
    const d = Mt(s).find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function ze() {
    (_ || b) && e.cancelGovernedDrag?.("host"), _ = null, b = null, r && (r = null, B(o.onPreview, null)), se(!1);
  }
  return {
    toCanvas(s) {
      if (y || C || Ze()) return "This workshop is view-only here.";
      if (!t.cards.some((w) => w.id === s)) return "That card is no longer on the board.";
      const a = xn(t, s);
      if (a) return a;
      r && Ne(), I && (ze(), I = null, z(t), e.refreshGovernance?.());
      const { width: d } = Fe(t), c = k.get(ce(re.card(s)))?.options;
      return Bn(s, { x: X.x + d + 32, y: c?.y ?? X.y }), null;
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
      const { width: s, height: a } = Fe(t);
      return { x: X.x, y: X.y, width: s, height: a };
    },
    setLayout(s) {
      if (y) throw new Error("This workshop has been detached.");
      const a = Yt(s);
      l ? l.places(t, a) : Ge(t, { layout: a }), JSON.stringify(a) !== JSON.stringify(J) && (ze(), J = a, z(I ?? t));
    },
    whenDrawn: () => j,
    update(s) {
      if (y) throw new Error("This workshop has been detached.");
      const a = Z(s);
      ze(), t = a;
      const d = C;
      C = E || i(t), z(I ?? t), C !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (y) throw new Error("This workshop has been detached.");
      const a = s ? Z(s) : null;
      ze(), I = a, z(I ?? t), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = t.lanes.find((c) => c.id === s);
      y || !d || (se(!1), $ = { laneId: s, reason: a, timer: setTimeout(() => se(), 1500) }, Ce(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      E = !!s;
      const a = E || i(t);
      y || C === a || (ze(), C = a, z(I ?? t), e.refreshGovernance?.());
    },
    destroy() {
      y || (ze(), y = !0, M && clearTimeout(M.timer), e.element?.removeEventListener?.("pointerdown", vt, !0), Ro?.(), p && e.element?.removeEventListener?.("pointerover", bt), e.withPolicyAuthority(() => {
        for (const [s, a] of le) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of A) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of k)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), A.clear(), le.clear(), k.clear(), v.clear(), R.clear(), D.clear(), _o(), p?.destroy(), $e = !1, jn(), e.notifyNodeChanged?.());
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
function Qn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function yr(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function Yt(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function kr(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const l of n)
    o = Math.max(o, (l.options.x ?? 0) + (l.options.width ?? 0)), t = Math.min(t, l.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const br = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function ie(e) {
  return br.includes(e.kind) ? e.kind : void 0;
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
function vr(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = En(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function En(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const pt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function ot(e) {
  if (typeof e != "string" || !pt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function fo(e) {
  return e.noteId ?? e.id;
}
function mt(e) {
  const n = En(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function ho(e) {
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
const po = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Ir = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function rt(e) {
  const n = fe(e), o = {}, t = (i) => {
    if (typeof i != "string" || !po.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, l = (i, p, b) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < p || i > b) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !Ir.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = l(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = l(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function mo(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        rt({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return rt(n);
}
function it(e) {
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
function Zt(e) {
  try {
    return !!Ln({ link: e });
  } catch {
    return !1;
  }
}
function Ln(e) {
  const n = fe(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const t = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (t.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    o.text = t;
  }
  if (n.image !== void 0) {
    const t = fe(n.image);
    if (!it(t.src)) throw new Error("A card keeps a picture by its web address only.");
    o.image = { src: t.src };
    for (const l of ["width", "height"]) {
      const i = t[l];
      if (i !== void 0) {
        if (typeof i != "number" || !Number.isFinite(i) || i < 1 || i > 2e4) throw new Error("A picture size is out of range.");
        o.image[l] = i;
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
const qe = 96, xr = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Ar = ["solid", "dashed", "dotted"], Cr = 1e7;
function Je(e) {
  const n = fe(e);
  if (typeof n.id != "string" || !xr.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: ot(n.parentId), childId: ot(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (l, i, p) => {
    const b = n[l];
    if (b != null) {
      if (typeof b != "number" || !Number.isFinite(b) || b < i || b > p) throw new Error("A line's look is out of range.");
      o[l] = b;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !po.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Ar.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const l = fe(n.targetPoint), i = (p) => typeof p == "number" && Number.isFinite(p) && Math.abs(p) <= Cr;
    if (!i(l.x) || !i(l.y) || Object.keys(l).some((p) => p !== "x" && p !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    o.targetPoint = { x: Math.round(l.x * 100) / 100, y: Math.round(l.y * 100) / 100 };
  }
  for (const l of ["sourceAnchor", "targetAnchor"]) {
    if (l === "targetAnchor" && o.targetPoint) continue;
    const i = n[l];
    if (i == null) continue;
    const p = fe(i), b = (I) => typeof I == "number" && Number.isFinite(I) && I >= 0 && I <= 1;
    if (!b(p.x) || !b(p.y) || Object.keys(p).some((I) => I !== "x" && I !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    o[l] = { x: p.x, y: p.y };
  }
  return o;
}
function Tr(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(Je).map((t) => wo(t, n)).filter((t) => t.targetPoint ? n.has(t.parentId) : n.has(t.parentId) || n.has(t.childId));
  if (Te(o.map((t) => t.id), "line ID"), o.length > qe) throw new Error(`A workshop holds up to ${qe} lines.`);
  return o;
}
function wo(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: o, ...t } = e;
  return t;
}
function Te(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function wt({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((l) => l.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Sr(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Ke = (e) => "lane-" + e, Se = (e) => "card-" + e, Nn = (e) => "image-" + e;
function ui(e) {
  const n = Sr(e);
  return wt(e).map((o) => {
    const t = e.cards.filter((p) => p.laneId === o.id), l = n.filter((p) => p.laneId === o.id), i = [Ke(o.id)];
    return o.station?.image && i.push(Nn(o.id)), { lane: o, cards: t, signals: l, nodeIds: [...i, ...t.map((p) => Se(p.id))] };
  });
}
const go = 5, st = 24, at = 3;
function Z(e) {
  const n = fe(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ie(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ie(n), l = t ? ye(t) : void 0, i = { id: ge }, p = we(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > go)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const b = l?.cards ?? [st, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > b[0]) throw new Error(b[1]);
  const I = n.lanes.map((k) => {
    const v = fe(k), A = { id: ge(v.id), label: we(v.label) };
    if (v.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (v.capacity !== void 0) {
      const R = o ? 576 : 24;
      if (typeof v.capacity != "number" || !Number.isInteger(v.capacity) || v.capacity < 1 || v.capacity > R)
        throw new Error(`Lane capacity must be a whole number from 1 to ${R}.`);
      A.capacity = v.capacity;
    }
    if (l?.readLane?.(v, A, i), v.station !== void 0) {
      const R = fe(v.station), D = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= at)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray(R.next) || R.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const _ = R.next.map(ge);
      Te(_, "onward stop"), A.station = { column: D(R.column), row: D(R.row), next: _, outcome: we(R.outcome, 160) }, R.image !== void 0 && (A.station.image = ho(R.image));
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
  const C = n.cards.map((k) => {
    const v = fe(k), A = { id: ge(v.id), label: t ? we(v.label) : vr(v.label), laneId: ge(v.laneId) };
    if (!E.includes(A.laneId)) throw new Error("Card refers to an unknown lane.");
    if (v.allowedLaneIds !== void 0) {
      if (!Array.isArray(v.allowedLaneIds) || v.allowedLaneIds.length > I.length) throw new Error("Invalid allowed lanes.");
      if (A.allowedLaneIds = v.allowedLaneIds.map(ge), Te(A.allowedLaneIds, "allowed lane"), !A.allowedLaneIds.includes(A.laneId) || !A.allowedLaneIds.every((R) => E.includes(R)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (v.look !== void 0) {
      const R = rt(v.look);
      R && (A.look = R);
    }
    if (v.asNote !== void 0) {
      const R = Ln(v.asNote);
      R && (A.asNote = R);
    }
    if (v.noteId !== void 0 && v.noteId !== A.id && (A.noteId = ot(v.noteId)), l?.readCard(v, A, i), o) {
      if (typeof v.points != "number" || !Number.isInteger(v.points) || v.points < 1 || v.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (A.points = v.points, v.dependsOn !== void 0) {
        if (!Array.isArray(v.dependsOn) || v.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        A.dependsOn = v.dependsOn.map(ge), Te(A.dependsOn, "dependency");
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
      const v = fe(k), A = ge(v.cardId), R = ge(v.laneId);
      if (!C.some((D) => D.id === A) || !E.includes(R))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ge(v.id),
        label: we(v.label),
        cardId: A,
        laneId: R,
        whenPresent: we(v.whenPresent, 160),
        whenAbsent: we(v.whenAbsent, 160)
      };
    }), Te(y.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !t) {
    const k = Tr(n.lines, new Set(C.map((v) => v.id)));
    k.length && (y.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    y.presentationOrder = wt({ lanes: I, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (y.behaviour = me().validate(n.behaviour, { ...y, kind: n.kind })), o)
    return y.kind = "release-plan", Yo(y), y;
  if (t && l) {
    y.kind = t, l.readBoard(n, y, i);
    const k = l.validate(y);
    if (k) throw new Error(k);
    return y;
  }
  for (const k of I)
    if (C.filter((v) => v.laneId === k.id).length > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return y;
}
const yo = 65536;
function fi(e) {
  const n = JSON.stringify(Z(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > yo) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function hi(e) {
  if (e.length > yo) throw new Error("This workshop is too large to open from a link.");
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
function gt(e, n, o) {
  const t = ie(e);
  return t ? ye(t).planMove(e, n, o) : void 0;
}
function Pn(e, n) {
  if (ie(e)) return e.lanes.filter((t) => gt(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => $n(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((l) => l.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function lt(e, n, o) {
  const t = e.cards.find((i) => i.id === n), l = gt(e, n, o);
  if (l !== void 0) {
    if (!l) throw new Error("Move is unavailable.");
    return l;
  }
  if (t && e.kind === "release-plan") {
    const i = $n(e, t, o);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!t || !Pn(e, t).some((i) => i.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((i) => i === t ? { ...t, laneId: o } : i) };
}
function ln(e, n, o) {
  const t = ko(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in me().check(e, t) ? null : t;
}
function ko(e, n, o) {
  const t = e.cards.find((p) => p.id === n);
  if (!t || !e.lanes.some((p) => p.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return $n(e, t, o);
  const l = gt(e, n, o);
  if (l !== void 0) return l;
  const i = Dr(e, n, o);
  return i || (o === "prototype" && Ye(e) === "customer-interviews" ? null : Pn(e, t).some((p) => p.id === o) ? lt(e, n, o) : null);
}
function Vt(e, n) {
  return e.lanes.filter((o) => ln(e, n, o.id) !== null);
}
function In(e, n, o) {
  const t = ko(e, n, o);
  if (t !== null) {
    const y = t === e || !e.behaviour ? null : me().check(e, t);
    return y && "refused" in y ? y.refused.sentence : null;
  }
  const l = e.cards.find((y) => y.id === n), i = e.lanes.find((y) => y.id === o);
  if (!l || !i) return "That move is not available.";
  const p = ie(e), b = p && ye(p).refusal;
  if (b) return b(e, n, o);
  const I = `This card can't go in ${i.label}.`;
  if (l.allowedLaneIds && !l.allowedLaneIds.includes(o)) return I;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return I;
    const y = We(e, o), k = { ...e, lanes: e.lanes.map((A) => A === i ? { id: i.id, label: i.label } : A) }, v = $n(k, l, o);
    return v ? `Needs ${We(v, o) - y} points. It already holds ${y} of ${i.capacity} points.` : I;
  }
  const E = e.lanes.find((y) => y.id === l.laneId);
  if (E?.station && !E.station.next.includes(o)) return `${i.label} can't be reached from ${E.label}.`;
  const C = e.cards.filter((y) => y.laneId === o).length;
  return i.capacity !== void 0 && C >= i.capacity ? `It already holds ${C} of ${i.capacity} ${i.capacity === 1 ? "card" : "cards"}.` : I;
}
function sn(e) {
  return (!e.kind || !!ie(e)) && !e.lanes.some((n) => n.station) && !Ye(e);
}
const Or = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function yt(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && Or.test(n) && !o.has(n) ? n : Mn(e, "card");
}
function Ue(e, n, o) {
  const t = e.lanes.find((i) => i.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((i) => i.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Ye(e)) return "This workshop keeps the cards it came with.";
  if (ie(e)) {
    if (!(typeof o?.label == "string" && En(o.label))) return "A card needs some words. Type on the note first.";
    if (Array.isArray(o.lines) ? o.lines.length : o.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const i = Io(e, n, o);
    return typeof i == "string" ? i : Qt(e, i);
  }
  if (e.cards.length >= st) return `This board is at its size limit of ${st} cards. Remove a card to make room.`;
  const l = e.cards.filter((i) => i.laneId === n).length;
  if (t.capacity !== void 0 && l >= t.capacity) return `It already holds ${l} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const i = bo(o.lines);
    if (!i) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((b) => b.id));
    if ((e.lines?.length ?? 0) + i.filter((b) => !p.has(b.id)).length > qe)
      return `A workshop holds up to ${qe} lines.`;
  }
  return Qt(e, { ...e, cards: [...e.cards, { id: yt(e, o.id), label: mt(typeof o.label == "string" ? o.label : ""), laneId: n }] });
}
function Qt(e, n) {
  if (!e.behaviour) return null;
  const o = me().check(e, n);
  return "refused" in o ? o.refused.sentence : null;
}
function Lr(e) {
  try {
    return e && typeof e == "object" ? mo(e) : void 0;
  } catch {
    return;
  }
}
function Pr(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      Ln({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? Ln(n) : void 0;
}
function bo(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let l = null;
    try {
      l = Je(t);
    } catch {
      const i = (b) => {
        const { id: I, parentId: E, childId: C, targetPoint: y } = fe(t);
        return Je({ id: I, parentId: E, childId: C, ...b ? { targetPoint: y } : {} });
      }, p = t?.targetPoint !== void 0 && t?.targetPoint !== null;
      try {
        l = i(!0);
      } catch {
        try {
          l = p ? null : i(!1);
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
function _n(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function He(e, n, o) {
  return e && e.map((t) => _n(t, n, o));
}
function vo(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function rn(e, n, o, t) {
  if (Ue(e, n, o) !== null) return null;
  if (ie(e)) {
    const v = Io(e, n, o), A = v.cards[v.cards.length - 1], R = t === void 0 ? -1 : e.cards.findIndex((D) => D.id === t && D.laneId === n);
    return R < 0 ? v : { ...v, cards: [...e.cards.slice(0, R), A, ...e.cards.slice(R)] };
  }
  const l = Lr(o.look), i = typeof o.label == "string" ? En(o.label) : "";
  let p = Pr(o.asNote);
  i.length > 80 && p?.text === void 0 && i.length <= 4e3 && (p = { ...p, text: i });
  const b = yt(e, o.id), I = b !== o.id && typeof o.id == "string" && pt.test(o.id) ? o.id : void 0, E = {
    id: b,
    label: mt(i),
    laneId: n,
    ...l ? { look: l } : {},
    ...p ? { asNote: p } : {},
    ...I ? { noteId: I } : {}
  }, C = t === void 0 ? -1 : e.cards.findIndex((v) => v.id === t && v.laneId === n), y = C < 0 ? [...e.cards, E] : [...e.cards.slice(0, C), E, ...e.cards.slice(C)], k = o.lines === void 0 ? void 0 : vo(e, bo(o.lines).map((v) => _n(v, o.id, E.id)));
  return Z({ ...e, cards: y, ...k ? { lines: k } : {} });
}
function Io(e, n, o) {
  const t = ye(ie(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const l = Be(e, [{ kind: "add_card", lane: { id: n }, ...t, ...o.under && { under: { id: o.under } } }]);
  if ("refused" in l) return l.refused.reason;
  const i = l.workshop.cards, p = yt(e, o.id), b = p !== o.id && typeof o.id == "string" && pt.test(o.id) ? o.id : void 0;
  return i[i.length - 1] = { ...i[i.length - 1], id: p, ...b ? { noteId: b } : {} }, l.workshop;
}
function xo(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = ie(e);
  return o ? ye(o).cardText(e, n) : n.label;
}
function $r(e, n) {
  const o = ie(e);
  return o ? ye(o).noteText(e, n) : n.label;
}
function xn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!sn(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (e.cards.some((t) => t.parentId === n)) return `${o.label} has cards under it, so it stays a card. Move them first.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((i) => e.lanes.find((p) => p.id === i).label), l = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${l}, so it stays a card.`;
  }
  return null;
}
function Xt(e, n, o = Ao(e, n)) {
  if (xn(e, n) !== null) return null;
  const t = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const p = { ...i, dependsOn: i.dependsOn.filter((b) => b !== n) };
    return p.dependsOn.length || delete p.dependsOn, p;
  }), l = e.lines?.map((i) => _n(i, n, o));
  return Z({ ...e, cards: t, ...l ? { lines: l } : {} });
}
function Er(e, n, o = Ao(e, n)) {
  const t = new Set(e.cards.filter((p) => p.id !== n).map((p) => p.id)), l = (e.lines ?? []).filter((p) => p.parentId === n || p.childId === n).map((p) => _n(p, n, o)), i = (p) => t.has(p.parentId) || t.has(p.childId);
  return { stay: l.filter(i), leave: l.filter((p) => !i(p)) };
}
function Ao(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? fo(o) : n;
}
function eo(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function dn(e, n) {
  if (e.kind) return Nr;
  let o;
  try {
    o = Je(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((i) => i.id));
  return o = wo(o, t), (o.targetPoint ? !t.has(o.parentId) : !t.has(o.parentId) && !t.has(o.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === o.parentId || i.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === o.id) && (e.lines?.length ?? 0) >= qe ? `A workshop holds up to ${qe} lines.` : null;
}
const Nr = "Lines join the cards of a lane workshop to notes and to each other.";
function An(e, n) {
  return dn(e, n) !== null ? null : Z({ ...e, lines: vo(e, [Je(n)]) });
}
function no(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? Z({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function Co(e, n, o, t = {}) {
  const l = new Set((e.lines ?? []).map((p) => p.id));
  let i = `${n}->${o}`;
  for (let p = 2; l.has(i); p++) i = `${n}->${o}~${p}`;
  return Je({ showChildArrow: !0, ...t, id: i, parentId: n, childId: o });
}
function _r(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function Ae(e, n) {
  const o = e.lanes.find((b) => b.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const b = We(e, n);
    return o.capacity ? b + " / " + o.capacity + " points" : b + " points";
  }
  const t = ie(e);
  if (t) return ye(t).caption(e, n);
  const l = Hr(e, n);
  if (l) return "$" + l.amount + " · " + l.description;
  const i = e.cards.filter((b) => b.laneId === n).length, p = e.behaviour ? me().laneLimit(e, n) : o.capacity;
  return p !== void 0 ? i + " of " + p : i + (i === 1 ? " card" : " cards");
}
const Rn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Cn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function To(e, n = Rn, o = 28, t) {
  const { pitch: l, row: i, top: p } = n, b = !!e.lanes[0].station, I = e.lanes.map((y) => e.cards.filter((k) => k.laneId === y.id).length), E = p + Math.max(1, ...t ?? I) * i + 36, C = e.lanes.map((y, k) => ({
    x: b ? y.station.column * (l + o) : k * l,
    y: b ? y.station.row * E : 0
  }));
  return {
    points: C,
    width: Math.max(...C.map((y) => y.x)) + l,
    height: Math.max(...C.map((y, k) => y.y + p + (b ? Math.max(1, I[k]) : I[k] + 1) * i))
  };
}
function pi() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Mn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((l) => l.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function So(e) {
  const n = Z(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Rr(e, n) {
  const o = So(e), t = Mn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Z(o);
}
function Mr(e, n, o) {
  const t = So(e);
  return t.cards.push({
    id: Mn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), Z(t);
}
function mi() {
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
function to(e, n, o) {
  const t = Z(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const l = t.lanes.find((C) => C.id === n);
  if (!l?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= go) throw new Error("A map can have up to five stations.");
  const i = we(o?.label), p = we(o?.outcome, 160), b = Mn(t, "station");
  let I, E = 1 / 0;
  for (let C = 0; C < at; C++)
    for (let y = 0; y < at; y++) {
      if (t.lanes.some((v) => v.station.column === y && v.station.row === C)) continue;
      const k = Math.abs(l.station.column - y) + Math.abs(l.station.row - C);
      k < E && (E = k, I = { column: y, row: C });
    }
  if (!I) throw new Error("There is no free station position.");
  return l.station.next.push(b), t.lanes.push({ id: b, label: i, station: { ...I, next: [], outcome: p, ...o.image === void 0 ? {} : { image: ho(o.image) } } }), t.presentationOrder?.push(b), t;
}
const wi = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Oo = (e) => "caption-" + e, an = (e) => "column-" + e, Wr = "rules-board", re = { lane: Ke, card: Se, image: Nn, caption: Oo, column: an, rules: Wr };
function Lo(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Xn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), l = e, i = n;
  return t ? `M ${t} 0 H ${l - t} Q ${l} 0 ${l} ${t} V ${i - t} Q ${l} ${i} ${l - t} ${i} H ${t} Q 0 ${i} 0 ${i - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${l} V ${i} H 0 Z`;
}
function oo(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ro(e, n, o, t) {
  for (let l = n; l > 11; l--) {
    const i = Math.max(1, Math.floor(o / (l * 0.55)));
    if (e.split(`
`).reduce((b, I) => b + Math.max(1, Math.ceil(I.length / i)), 0) * l * 1.3 <= t) return l;
  }
  return Math.min(n, 11);
}
const Po = 152, dt = Po + 12, jr = 12;
function $o(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function Ge(e, n = {}) {
  const o = Z(e), { pitch: t, row: l, top: i } = Rn, p = o.lanes.map((k) => o.cards.filter((v) => v.laneId === k.id).length), b = (k) => Math.max(p[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), I = !!o.lanes[0].station, E = o.lanes.some((k) => k.station?.image), C = $o(n.layout, o.lanes.length), y = [];
  if (I) {
    const { points: k } = To(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((v, A) => y.push({
      laneId: v.id,
      x: k[A].x,
      y: k[A].y + (E ? v.station.row * dt : 0),
      width: t,
      height: i + (v.station.image ? dt : 0) + Math.max(1, b(A)) * l,
      column: v.station.column,
      row: v.station.row
    }));
  } else {
    let k = Eo(o, C)?.below ?? 0;
    for (let v = 0; v < o.lanes.length; v += C) {
      const A = o.lanes.slice(v, v + C), R = i + (Math.max(...A.map((D, _) => b(v + _))) + 1) * l;
      A.forEach((D, _) => y.push({ laneId: D.id, x: _ * t, y: k, width: t, height: R, column: _, row: v / C })), k += R + jr;
    }
  }
  return { places: y, width: Math.max(...y.map((k) => k.x + k.width)), height: Math.max(...y.map((k) => k.y + k.height)) };
}
function Eo(e, n, o = 2, t = 0) {
  const l = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? me().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return l ? { note: l, below: l.options.height + 16 } : null;
}
function Fr(e, n) {
  const { pitch: o, width: t, row: l, height: i, top: p } = Rn, b = n.origin ?? { x: 0, y: 0 }, I = !!e.lanes[0].station, { places: E } = Ge(e, n), C = n.style ?? {}, y = C.textColor ?? tn.fontColor, k = C.borderColor ?? tn.borderColor, v = C.borderWidth ?? tn.borderWidth, A = C.cornerRadius ?? 0, R = C.fontSize ?? tn.fontSize, D = C.laneFontSize ?? R + 2, _ = C.captionFontSize ?? Math.max(11, R - 1), r = [], m = (O) => {
    const $ = { options: {
      shapeHint: "rectangle",
      vectorPath: Xn(O.width, O.height, A),
      foregroundColor: y,
      borderColor: k,
      borderWidth: v,
      ...C.fontFamily ? { fontFamily: C.fontFamily } : {},
      ...O
    }, relationships: { associations: [] } };
    return r.push($), $;
  };
  e.lanes.forEach((O, $) => {
    const M = E[$], q = b.x + M.x, j = b.y + M.y, Y = O.station?.image;
    m({
      id: an(O.id),
      text: "",
      name: O.label,
      xPos: q + 2,
      yPos: j,
      width: o - 4,
      height: M.height,
      vectorPath: Xn(o - 4, M.height, A ? A + 2 : 0),
      backgroundColor: I ? "#fcf9ed" : oo(Cn[$], 0.6),
      borderColor: I ? "#a8b5aa" : oo(Cn[$], 0.1),
      borderWidth: 1,
      ...I ? { borderStyle: "dashed" } : {}
    }), m({
      id: Ke(O.id),
      text: O.label,
      name: O.label,
      xPos: q + 8,
      yPos: j + 6,
      width: t,
      height: 58,
      backgroundColor: Cn[$],
      fontSize: ro(O.label, D, t - 16, 50)
    }), m({
      id: Oo(O.id),
      text: Ae(e, O.id),
      name: O.label,
      xPos: q + 8,
      yPos: j + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: _
    }), Y && r.push({ options: {
      id: Nn(O.id),
      name: Y.alt,
      text: "",
      xPos: q + 8,
      yPos: j + p,
      width: t,
      height: Po,
      shapeHint: "rectangle",
      image: Y.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((J) => J.laneId === O.id).forEach((J, Oe) => {
      const Le = xo(e, J), he = I ? t - 20 : t, Pe = I ? i - 6 : i, pe = I ? {} : { ...C.card, ...J.look }, $e = I ? A : C.card?.cornerRadius ?? A;
      m({
        id: Se(J.id),
        text: Le,
        name: J.label,
        xPos: q + (I ? 18 : 8),
        yPos: j + p + (Y ? dt : 0) + Oe * l,
        width: he,
        height: Pe,
        ...$e !== A ? { vectorPath: Xn(he, Pe, $e) } : {},
        backgroundColor: I ? "#ffda75" : pe.backgroundColor ?? C.backgroundColor ?? tn.backgroundColor,
        ...pe.textColor ? { foregroundColor: pe.textColor } : {},
        ...pe.fontFamily ? { fontFamily: pe.fontFamily } : {},
        ...pe.borderColor ? { borderColor: pe.borderColor } : {},
        ...pe.borderWidth !== void 0 ? { borderWidth: pe.borderWidth } : {},
        fontSize: ro(Le, pe.fontSize ?? R, he - 16, Pe - 8)
      });
    });
  });
  const x = Eo(e, $o(n.layout, e.lanes.length), b.x + 2, b.y)?.note ?? No(e, {
    x: b.x,
    y: b.y + Math.max(...E.map((O) => O.y + O.height)) + 16,
    width: Math.min(Math.max(...E.map((O) => O.x + O.width)), o * 2) - 4
  }, C);
  x && r.push(x);
  const S = new Map(r.map((O) => [O.options.id, O]));
  for (const O of e.lanes)
    O.station && (S.get(an(O.id)).relationships.associations = O.station.next.map(($) => ({
      id: O.id + "-to-" + $,
      parentId: an(O.id),
      childId: an($),
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
      const Y = Lo(j, (J) => O.has(J) || $.has(J));
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
function No(e, n, o = {}) {
  return e.behaviour ? me().note(e, n, o) : null;
}
function zr(e, n) {
  const o = Z(e);
  if (n?.native) return Fr(o, n);
  const { width: t, row: l, height: i, top: p } = Rn, b = [];
  function I(v, A, R, D, _, r) {
    b.push({ options: {
      id: v,
      text: A,
      name: A,
      xPos: R,
      yPos: D,
      width: t,
      height: _,
      shapeHint: "rectangle",
      backgroundColor: r,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: E } = To(o), C = 152, y = C + 12, k = o.lanes.some((v) => v.station?.image);
  o.lanes.forEach((v, A) => {
    const R = E[A].x, D = E[A].y + (k ? (v.station?.row ?? 0) * y : 0), _ = v.station?.image, r = o.kind === "release-plan" ? v.label + `
` + (v.capacity ? We(o, v.id) + " / " + v.capacity + " points" : We(o, v.id) + " points") : v.label;
    I(Ke(v.id), r, R, D, p - 12, Cn[A]), _ && b.push({ options: {
      id: Nn(v.id),
      name: _.alt,
      text: "",
      xPos: R,
      yPos: D + p,
      width: t,
      height: C,
      shapeHint: "rectangle",
      image: _.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((m) => m.laneId === v.id).forEach((m, x) => I(Se(m.id), xo(o, m), R, D + p + (_ ? y : 0) + x * l, i, "#fffdf6"));
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
        const D = Se(R), _ = Se(A.id);
        v.get(D).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${A.id}`,
          parentId: D,
          childId: _,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: b };
}
const gi = {
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
}, ct = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], kt = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function yi() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: ct.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: ct.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function ki() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...kt.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Ye(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...kt.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => ct.some((l) => l.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Dr(e, n, o) {
  const t = Ye(e), l = e.cards.find((p) => p.id === n);
  if (!t || !l || l.laneId === o) return null;
  let i = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const p = e.cards.find((b) => b.laneId === o);
    if (p) {
      if (!Pn(e, p).some((b) => b.id === "interviews")) return null;
      i = lt(e, p.id, "interviews");
    }
  }
  return Pn(i, l).some((p) => p.id === o) ? lt(i, n, o) : null;
}
function Hr(e, n) {
  if (Ye(e) !== "experiment-budget") return null;
  const o = kt.find((i) => i.id === n), t = e.cards.filter((i) => i.laneId === n).length, l = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? l + " " + (l === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  tn as DEFAULT_NOTE_STYLE,
  so as WORKSHOP_BOARD_KINDS,
  vn as WorkshopReferenceError,
  to as addWorkshopBranch,
  Mr as addWorkshopCard,
  Rr as addWorkshopLane,
  Be as applyWorkshopEdits,
  ci as attachWorkshop,
  Pn as availableLanes,
  No as behaviourNote,
  br as businessBoardKinds,
  ie as businessKind,
  cr as canHangPanel,
  kt as channels,
  dr as checkWorkshopReplacement,
  Qo as countWord,
  ki as createBudgetWorkshop,
  yi as createInterviewWorkshop,
  pi as createLaneWorkshop,
  mi as createWorkshopMap,
  hi as decodeWorkshopFragment,
  di as describeFocusDarkroom,
  oi as describeWorkshopEdits,
  fi as encodeWorkshopFragment,
  Jr as handoffSummary,
  si as hangGalleryPanel,
  gi as industrialWorkshop,
  li as initialFocusDarkroom,
  ct as interviews,
  nr as isRuleEdit,
  Cn as laneColors,
  Me as listed,
  gn as listeningRoom,
  Zr as listeningRoomCaption,
  st as maxWorkshopCards,
  qe as maxWorkshopLines,
  ri as moonGallery,
  lt as moveWorkshopCard,
  ti as named,
  wi as nightTransfer,
  ai as normalizeFocusDarkroom,
  Yr as normalizeListeningRoom,
  ii as normalizeMoonGallery,
  Gr as normalizeOfflineHandoff,
  Ur as offlineHandoff,
  Dr as planStartupMove,
  Xo as pointing,
  co as printFields,
  ei as registerRulebook,
  Qr as registerWorkshopRules,
  We as releaseLoad,
  Vr as releasePlan,
  qr as resolveHandoff,
  Sr as resolveWorkshopSignals,
  Kr as reviewHandoff,
  Xn as roundedBox,
  me as rulebook,
  ni as rulebookLoaded,
  L as said,
  Ye as startupExperienceKind,
  ft as unquoted,
  Z as validateWorkshop,
  Sn as workshopBoardKind,
  Hr as workshopBudgetResult,
  ln as workshopCandidate,
  Xt as workshopCardAsNote,
  xn as workshopCardAsNoteRefusal,
  mt as workshopCardLabelOf,
  Er as workshopCardLines,
  mo as workshopCardLookOf,
  $r as workshopCardNoteText,
  xo as workshopCardText,
  Vt as workshopDestinations,
  tt as workshopEditKinds,
  et as workshopFinder,
  Zt as workshopKeepsLink,
  it as workshopKeepsPicture,
  Ae as workshopLaneCaption,
  Ge as workshopLanePlaces,
  Rn as workshopLayout,
  dn as workshopLineRefusal,
  eo as workshopLinesOf,
  Nr as workshopLinesSentence,
  Co as workshopNewLine,
  re as workshopNodeIds,
  rn as workshopNoteCandidate,
  fo as workshopNoteIdOf,
  Ue as workshopNoteRefusal,
  To as workshopPositions,
  wt as workshopPresentationLanes,
  ui as workshopPresentationScenes,
  rr as workshopReferences,
  In as workshopRefusal,
  He as workshopRenamedLines,
  Ut as workshopRuleSchema,
  ye as workshopRules,
  Xr as workshopRulesLoaded,
  Lo as workshopStandInId,
  sn as workshopTakesNotes,
  zr as workshopToSlate,
  An as workshopWithLine,
  _r as workshopWithoutCardLines,
  no as workshopWithoutLine
};
