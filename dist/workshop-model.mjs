import { D as tn } from "./NoteDefaults-1xFW0br8.mjs";
const Yr = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Zr(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: l, fieldNote: s, deskNote: p, fallback: b } = e, I = (P) => typeof P == "string" && P.trim().length > 0 && P.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(P);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? l !== "field" && l !== "desk" : l !== null) || l === void 0 || !I(s) || !I(p) || !I(b) ? null : { kind: n, version: o, stage: t, choice: l, fieldNote: s.trim(), deskNote: p.trim(), fallback: b.trim() };
}
function Vr(e) {
  return { ...e, stage: "review", choice: null };
}
function Qr(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Xr(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const gn = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function es(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: l, rightLabel: s } = e, p = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !p(l) || !p(s) ? null : { kind: n, version: o, mix: t, leftLabel: l.trim(), rightLabel: s.trim() };
}
function ns({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === gn.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === gn.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === gn.leftLabel && o === gn.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function We(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function nr(e) {
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
    if (We(e, p.id) > (p.capacity ?? 1 / 0)) throw new Error(`Release "${p.label}" exceeds its point budget.`);
  }
}
function Pn(e, n, o) {
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
  return C !== void 0 && We(P, o) > C ? null : P;
}
const ts = {
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
}, ft = /* @__PURE__ */ new Map(), tr = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function os(e) {
  ft.set(e.kind, e);
}
function rs(e) {
  return typeof e == "string" && ft.has(e);
}
function ye(e) {
  const n = ft.get(e);
  if (!n) throw new Error(`The ${tr[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let Tn = null;
function ss(e) {
  Tn = e;
}
function is() {
  return Tn !== null;
}
function me() {
  if (!Tn) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return Tn;
}
const O = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Me = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Ut = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ht = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), pt = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), as = (e) => ht(pt(e)), or = [
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
], rr = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : or.indexOf(e.toLowerCase()), sr = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function lo(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (l) => {
    const s = ht(l);
    s && o.add(s);
  };
  t(e), t(pt(e));
  for (const l of [...o]) t(l.replace(/^(?:the|my|our)\s+/i, ""));
  for (const l of [...o]) t(l.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const l of [...o]) t(l.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const Jn = "[^\\p{L}\\p{N}]", Gt = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Ut(n) + "(?:$|" + Jn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Jn + ")" + Ut(n) + "(?:$|" + Jn + ")", "u").test(e)
], Kt = ["first", "second", "third", "fourth", "fifth"];
function ir(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Kt.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(ht(pt(n)));
  if (!t) return null;
  const l = (t[1] ?? t[2]).toLowerCase(), s = l === "last" ? e.length - 1 : t[1] ? Kt.indexOf(l) : rr(l) - 1;
  return e[s] ?? null;
}
function Yn(e, n, o, t, l) {
  const s = lo(n, o);
  if (s.some((b) => sr.test(b))) {
    const b = t && e.find((I) => I.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of s) {
    if (!b.startsWith("@")) continue;
    const I = e.find((P) => P.id === b.slice(1));
    if (I) return { item: I, rank: 0 };
  }
  for (const [b, I] of Gt.entries())
    for (const P of s) {
      const C = e.filter((y) => I(y.label.toLowerCase(), P.toLowerCase()));
      if (C.length === 1) return { item: C[0], rank: b };
      if (C.length > 1) return { several: C };
    }
  const p = l ? ir(e, n, o) : null;
  return p ? { item: p, rank: Gt.length } : {};
}
class vn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function nt(e, n, o, t, l = !1) {
  return { find: (I) => {
    const P = Yn(e, I, n, t, l);
    if (P.item) return P.item;
    const C = lo(I, n), y = C[C.length - 1];
    if (P.pointing) throw new vn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (P.several) {
      const v = [...new Set(P.several.map((A) => A.label))];
      throw new vn(v.length === 1 ? P.several.length + " " + o + "s are called " + O(v[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + O(y) + ": " + Me(v.slice(0, 6).map(O)) + ". Use the whole name.", "ambiguous", P.several.map((A) => A.id));
    }
    const k = e.map((v) => v.label);
    throw new vn("There is no " + o + " called " + O(y) + " here." + (k.length && k.length <= 6 ? " The " + o + "s are " + Me(k.map(O)) + "." : k.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((v) => v.id));
  }, attempt: (I) => Yn(e, I, n, t, l).item ?? null, rank: (I) => Yn(e, I, n, t, l).rank ?? 1 / 0 };
}
const co = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], xe = [...co], De = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], uo = co.slice(5);
function Sn(e) {
  if (e.lanes[0]?.station) return "map";
  const n = se(e);
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
}, tt = {
  "launch-plan": W.launchLanes,
  pipeline: W.pipelineLanes,
  budget: W.budgetLanes,
  "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, ae = (e, n) => Object.fromEntries(xe.filter((o) => !e.includes(o)).map((o) => [o, n])), oe = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), Q = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ne = (e) => ({ type: "ref", of: "card", about: e }), Zn = (e) => ({ map: e }), ve = ae(["map"], W.notMap), Ie = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), ot = [
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
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...tt }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Q("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...tt }
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
    boards: ["lanes", "experiment-budget", "map", ...uo],
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
    refusals: { ...Zn(W.mapCardLanes), ...ae([...De, "map"], W.businessCards) }
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
    refusals: { ...Zn(W.mapOutcome), ...ae([...De, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ne("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: De,
    refusals: { ...Zn(W.mapOutcome), ...ae([...De, "map"], W.businessCards) }
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
const ar = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", qt = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, lr = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function dr(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: lr(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: qt.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: o,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: o,
        to: { type: "array", items: o, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: o,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: o,
        ...qt.keys
      }, description: e.about };
  }
}
const fo = (e) => "optional" in e && e.optional === !0;
function ls(e) {
  const n = e ? Sn(V(e)) : void 0;
  return ot.map((o) => {
    const t = Object.entries(o.fields), l = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, p]) => !fo(p)).map(([p]) => p)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([p, b]) => [p, dr(b, n)])) }
    }, s = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: l };
    return n && (s.accepted = o.boards.includes(n), s.accepted || (s.refusal = o.refusals[n])), s;
  });
}
const kn = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function cr(e, n) {
  const o = !!e.lanes[0]?.station, t = nt(e.lanes, o ? kn.step : kn.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), l = nt(e.cards, o ? kn.token : kn.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
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
function $n(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function K(e, n, o = null, t) {
  try {
    return V(e);
  } catch (l) {
    throw new F($n(l instanceof Error ? l.message : String(l), n), "refused", o, t);
  }
}
function ur(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, l] of Object.entries(n.fields)) {
    const s = e[t];
    if (s === void 0) {
      if (fo(l)) continue;
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
function fr(e, n, o, t, l) {
  const s = structuredClone(e), p = o === "map", b = o === "release-plan", I = cr(s, t), P = { lane: p ? "step" : "lane", card: p ? "token" : "card" };
  function C(r, m, x, S, $ = null) {
    if (typeof x == "object") {
      const M = r.find((q) => q.id === x.id);
      if (!M) throw new F("That " + S + " is no longer on the workshop.", "gone", $);
      return M;
    }
    const E = r.find((M) => M.id === x);
    if (E) return E;
    try {
      return m.find(x);
    } catch (M) {
      if (!(M instanceof vn)) throw M;
      const q = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new F(M.message, q, $, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const y = (r, m = null) => C(s.lanes, I.lanes, r, "lane", m), k = (r, m = null) => C(s.cards, I.cards, r, "card", m), v = (r) => {
    try {
      return y(r);
    } catch {
      return null;
    }
  }, A = (r, m, x = {}, S = !0) => ({ board: r, said: m, changed: S, ...x }), R = (r) => s.cards.filter((m) => m.laneId === r).length, D = (r) => p ? "The presentation opens with " + O(r[0].label) + "." : "The presentation now runs " + r.map((m) => O(m.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return me().edit(s, n, l, {
      lane: (r) => y(r),
      card: (r) => k(r),
      done: (r, m, x) => A(r, m, x),
      refuse: (r, m = {}) => {
        throw new F(r, m.code ?? "refused", m.laneId ?? null, m.cardId);
      }
    });
  if (uo.includes(o)) {
    n.kind === "add_card" && Jt(n, o, y(n.lane).id);
    const r = {
      card: (x) => k(x),
      lane: (x) => y(x),
      refuse: (x, S = {}) => {
        throw new F(x, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (x, S = null, $) => K(x, o, S, $),
      done: (x, S, $) => A(x, S, $)
    }, m = ye(o).edit(s, n, r);
    if (m) return m;
  }
  switch (n.kind) {
    case "rename_workshop": {
      s.title = n.title;
      const r = K(s, o);
      return A(r, "Renamed the " + (p ? "map" : "workshop") + " to " + O(r.title) + ".");
    }
    case "rename_lane": {
      const r = y(n.lane), m = r.label;
      r.label = n.label;
      const x = K(s, o, r.id);
      return A(x, "Renamed " + O(m) + " to " + O(x.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = k(n.card), m = r.label;
      r.label = n.label;
      const x = K(s, o, r.laneId, r.id);
      return A(x, "Renamed " + O(m) + " to " + O(x.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (s.lanes.length >= 5) throw new F("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new F("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = zr(s, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new F($n(x.message, o), "refused");
      }
      const m = r.lanes[r.lanes.length - 1];
      return A(r, "Added the lane " + O(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const r = y(n.lane), m = s.cards.filter((x) => x.laneId === r.id);
      if (p) {
        if (m.length) throw new F(O(m[0].label) + " is at " + O(r.label) + ". Move it to another step first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new F("A map needs at least two steps.", "refused", r.id);
      } else {
        if (m.length) throw new F(O(r.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new F("A workshop needs at least two lanes.", "refused", r.id);
      }
      s.lanes = s.lanes.filter((x) => x !== r);
      for (const x of s.lanes) x.station && (x.station.next = x.station.next.filter((S) => S !== r.id));
      s.presentationOrder && (s.presentationOrder = s.presentationOrder.filter((x) => x !== r.id));
      for (const x of s.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((S) => S !== r.id));
      return bn(s, (x) => x.laneId === r.id), s.behaviour && (s.behaviour = me().dropLane(s.behaviour, r.id)), A(K(s, o), "Removed the " + P.lane + " " + O(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = y(n.lane);
      if (p) {
        if (n.allowedLanes !== void 0) throw new F(W.mapCardLanes, "not_on_this_board", r.id);
        let $ = n.label;
        if ($ === void 0) {
          let j = s.cards.length + 1;
          for (; s.cards.some((Z) => Z.label === "Token " + j); ) j++;
          $ = "Token " + j;
        }
        const E = new Set([...s.lanes, ...s.cards].map((j) => j.id));
        let M = 1;
        for (; E.has("token-" + M); ) M++;
        s.cards.push({ id: "token-" + M, label: $, laneId: r.id });
        const q = K(s, o, r.id);
        return A(q, "Added " + O(q.cards[q.cards.length - 1].label) + " at " + O(r.label) + ".", { laneId: r.id, cardId: "token-" + M });
      }
      if (Jt(n, o, r.id), s.cards.length >= 24) throw new F("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && R(r.id) >= r.capacity)
        throw new F(O(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => y($).id))];
      let x;
      try {
        x = Dr(s, r.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch ($) {
        throw new F($n($.message, o), "refused", r.id);
      }
      const S = x.cards[x.cards.length - 1];
      return A(x, "Added " + (S.label ? O(S.label) : "an empty card") + " to " + O(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = k(n.card);
      if (p && s.cards.length === 1) throw new F("A map needs at least one token.", "refused", r.laneId, r.id);
      if (b && s.cards.length === 1) throw new F("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && s.cards.length === 1) throw new F("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      s.cards = s.cards.filter((m) => m !== r);
      for (const m of s.cards)
        m.dependsOn?.includes(r.id) && (m.dependsOn = m.dependsOn.filter((x) => x !== r.id), m.dependsOn.length || delete m.dependsOn);
      return bn(s, (m) => m.cardId === r.id), A(K(Fr(s, r.id), o, r.laneId), "Removed the " + P.card + " " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? s.lanes.find((S) => S.id === n.lane.id) ?? null : v(n.lane), m = k(n.card, r?.id ?? null), x = y(n.lane, m.laneId);
      return _(m, x);
    }
    case "advance_card": {
      const r = k(n.card), m = s.lanes.find((S) => S.id === r.laneId), x = m.station.next.map((S) => s.lanes.find(($) => $.id === S)).filter((S) => !!S);
      if (!x.length) throw new F(O(r.label) + " is at " + O(m.label) + ", and no path leads on from there.", "refused", m.id, r.id);
      if (x.length > 1)
        throw new F("From " + O(m.label) + " the path goes to " + x.map((S) => O(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + x[0].label + "”.", "refused", m.id, r.id);
      return _(r, x[0]);
    }
    case "set_lane_capacity": {
      const r = y(n.lane), m = s.behaviour && me().setLimit(s, r.id, n.capacity, l);
      if (typeof m == "string") throw new F(m, "refused", r.id);
      if (m) return A(m, O(r.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: r.id });
      const x = p ? "token" : b ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, A(K(s, o, r.id), p ? "Removed the limit at " + O(r.label) + "." : O(r.label) + " now holds any number of " + x + "s.", { laneId: r.id });
      const S = b ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > S)
        throw new F((p ? "A step" : "A lane") + " can hold from 1 to " + S + " " + x + "s.", "refused", r.id);
      const $ = b ? s.cards.reduce((E, M) => E + (M.laneId === r.id ? M.points ?? 1 : 0), 0) : R(r.id);
      if ($ > n.capacity)
        throw new F(O(r.label) + " already holds " + $ + " " + x + ($ === 1 ? "" : "s") + ". Move some " + (p ? "on" : "out") + " first, or choose a higher " + (b ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, A(K(s, o, r.id), O(r.label) + " now holds up to " + n.capacity + " " + x + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = k(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, A(K(s, o, r.laneId, r.id), O(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const m = [...new Set(n.lanes.map((S) => y(S)))], x = s.lanes.find((S) => S.id === r.laneId);
      if (!m.includes(x)) throw new F(O(r.label) + " is in " + O(x.label) + " now. Include " + O(x.label) + ", or move the card first.", "refused", x.id, r.id);
      return r.allowedLaneIds = m.map((S) => S.id), A(K(s, o, r.laneId, r.id), O(r.label) + " can now go only in " + Me(m.map((S) => O(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new F("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, A(K(s, o, r.laneId, r.id), O(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = k(n.card), m = [...new Set(n.dependsOn.map((S) => k(S)))], x = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = m.filter(($) => r.dependsOn?.includes($.id));
        if (!S.length) throw new F(O(r.label) + " does not depend on " + Me(m.map(($) => O($.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter(($) => !S.some((E) => E.id === $)), r.dependsOn.length || delete r.dependsOn, A(K(s, o, r.laneId, r.id), O(r.label) + " no longer depends on " + Me(S.map(($) => O($.label))) + ".", x);
      }
      if (!m.length) {
        if (n.mode === "add") throw new F("Name the features " + O(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, A(K(s, o, r.laneId, r.id), O(r.label) + " no longer depends on anything.", x);
      }
      if (m.includes(r)) throw new F("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...m.map((S) => S.id)])], A(K(s, o, r.laneId, r.id), O(r.label) + " now depends on " + Me(m.map((S) => O(S.label))) + ".", x);
    }
    case "set_outcome": {
      const r = k(n.card), m = y(n.lane), x = s.signals ?? (s.signals = []), S = n.label, $ = S === void 0 ? x.filter((j) => j.cardId === r.id && j.laneId === m.id) : x.filter((j) => j.cardId === r.id && j.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && $.length > 1) throw new F("Two outcomes on this card have that name.", "refused", m.id, r.id);
      if (!$.length && x.length >= 24) throw new F("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, r.id);
      let E = 1;
      for (; x.some((j) => j.id === "signal-" + E); ) E++;
      const q = { label: S ?? $[0]?.label ?? (r.label + " in " + m.label).slice(0, 80).trim(), cardId: r.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], q) : x.push({ id: "signal-" + E, ...q }), A(K(s, o, m.id, r.id), "When " + O(r.label) + " is in " + O(m.label) + " the workshop says " + O(n.whenPresent) + ". Otherwise it says " + O(n.whenAbsent) + ".", { laneId: m.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = k(n.card), m = (s.signals ?? []).filter((x) => x.cardId === r.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new F(O(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        bn(s, (x) => x.cardId === r.id);
      } else {
        const x = C(m, nt(m, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        bn(s, (S) => S.id === x.id);
      }
      return A(K(s, o, r.laneId, r.id), "Removed the outcome from " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
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
      const S = gt(s).filter(($) => $.id !== r.id);
      return S.splice(x ? S.findIndex(($) => $.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), s.presentationOrder = S.map(($) => $.id), A(K(s, o, r.id), D(S), { laneId: r.id });
    }
    case "add_station": {
      const r = y(n.from);
      let m;
      try {
        m = so(s, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new F(S.message, "refused", r.id);
      }
      const x = m.lanes[m.lanes.length - 1];
      return A(m, "Added a path from " + O(r.label) + " to " + O(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const r = y(n.before), m = n.from === void 0 ? void 0 : y(n.from), x = m ? [m] : s.lanes.filter((E) => E.station.next.includes(r.id));
      if (m && !m.station.next.includes(r.id))
        throw new F("There is no path from " + O(m.label) + " to " + O(r.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!x.length) throw new F("Nothing leads to " + O(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = so(s, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (E) {
        throw new F(E.message, "refused", r.id);
      }
      const $ = S.lanes[S.lanes.length - 1];
      for (const E of S.lanes)
        x.some((M) => M.id === E.id) && (E.station.next = [...new Set(E.station.next.map((M) => M === r.id ? $.id : M))]);
      return $.station.next = [r.id], A(K(S, o, $.id), "Added " + O($.label) + " before " + O(r.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const r = y(n.from), m = y(n.to);
      if (r.id === m.id) throw new F("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(m.id) ? A(s, O(r.label) + " already leads to " + O(m.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(m.id), A(K(s, o, r.id), "Connected " + O(r.label) + " to " + O(m.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = y(n.from), m = y(n.to);
      if (!r.station.next.includes(m.id)) throw new F("There is no path between " + O(r.label) + " and " + O(m.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((x) => x !== m.id), A(K(s, o, r.id), "Removed the path from " + O(r.label) + " to " + O(m.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = y(n.station);
      return r.station.outcome = n.outcome, A(K(s, o, r.id), "Changed what happens at " + O(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = y(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), A(K(s, o, r.id), "Moved " + O(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = y(n.station);
      return n.image === null ? (delete r.station.image, A(K(s, o, r.id), "Removed the image at " + O(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, A(K(s, o, r.id), "Updated the image at " + O(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = y(n.station);
      if (!r.station.image) throw new F("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, A(K(s, o, r.id), "Updated the image description at " + O(r.label) + ".", { laneId: r.id });
    }
    case "connect_cards":
    case "connect_note": {
      const r = k(n.card);
      let m = r.id, x, S;
      if (n.kind === "connect_cards") {
        const j = k(n.to, r.laneId);
        if (j.id === r.id) throw new F("A line joins two different cards.", "refused", r.laneId, r.id);
        x = j.id, S = O(j.label);
      } else {
        const j = n.note.trim();
        if (s.cards.some((Z) => Z.id === j) || s.lanes.some((Z) => Z.id === j))
          throw new F("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", r.laneId, r.id);
        x = j, S = "the note " + j, n.direction === "from_note" && ([m, x] = [x, m]);
      }
      const $ = Lo(s, m, x, n.label ? { label: n.label } : {}), E = dn(s, $);
      if (E) throw new F(E, "refused", r.laneId, r.id);
      const M = An(s, $), q = m === r.id;
      return A(
        M,
        q ? "Drew a line from " + O(r.label) + " to " + S + "." : "Drew a line from " + S + " to " + O(r.label) + ".",
        { laneId: r.laneId, cardId: r.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const r = k(n.card), m = n.kind === "disconnect_cards" ? k(n.to, r.laneId).id : n.note.trim(), x = n.kind === "disconnect_cards" ? O(s.cards.find((E) => E.id === m).label) : "the note " + m, S = (E) => E.parentId === r.id && E.childId === m || E.parentId === m && E.childId === r.id, $ = s.lines ?? [];
      return $.some(S) ? (s.lines = $.filter((E) => !S(E)), A(K(s, o, r.laneId, r.id), "Took away the line between " + O(r.label) + " and " + x + ".", { laneId: r.laneId, cardId: r.id })) : A(e, O(r.label) + " and " + x + " are not joined by a line.", { laneId: r.laneId, cardId: r.id }, !1);
    }
  }
  throw new F("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function _(r, m) {
    const x = { laneId: m.id, cardId: r.id };
    if (r.laneId === m.id)
      return A(e, O(r.label) + " is already " + (p ? "at " : "in ") + O(m.label) + ".", x, !1);
    const S = ln(e, r.id, m.id);
    if (!S) throw new F(In(e, r.id, m.id) ?? "That move is not available.", "refused", m.id, r.id);
    return A(K(S, o, m.id, r.id), "Moved " + O(r.label) + " to " + O(m.label) + ".", x);
  }
}
function Jt(e, n, o) {
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
    l = V(e);
  } catch (C) {
    return t({ reason: "The workshop cannot be read: " + (C instanceof Error ? C.message : String(C)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const s = l, p = [], b = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [C, y] of n.entries()) {
    const k = y?.kind, v = ot.find((m) => m.kind === k);
    if (!y || typeof y != "object" || !v)
      return t({
        index: C,
        kind: typeof k == "string" ? k : null,
        code: "invalid_edit",
        reason: "There is no edit called " + O(String(k)) + ". The edits are " + Me(ot.map((m) => m.kind)) + "."
      });
    const A = ur(y, v);
    if (A) return t({ index: C, kind: v.kind, code: "invalid_edit", reason: A });
    const R = Sn(l);
    if (!v.boards.includes(R))
      return t({ index: C, kind: v.kind, code: "not_on_this_board", reason: v.refusals[R] ?? "This workshop does not take " + v.kind + "." });
    let D;
    try {
      D = fr(l, y, R, o.selection, b);
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
    const _ = l.behaviour && !ar(v.kind) ? me().check(l, D.board) : null;
    if (_ && "refused" in _)
      return t({ index: C, kind: v.kind, reason: _.refused.sentence, code: "refused", laneId: _.refused.laneId, cardId: _.refused.cardId });
    const r = mr(l, D.board);
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
function hr(e, n) {
  const o = se(e);
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
const pr = {
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
function mr(e, n) {
  const o = V(e), t = Sn(o);
  let l;
  try {
    l = V(n);
  } catch (I) {
    return $n(I instanceof Error ? I.message : String(I), t);
  }
  const s = Sn(l), p = (I, P) => I.lanes.length === P.lanes.length && I.lanes.every((C) => P.lanes.some((y) => y.id === C.id)), b = (I, P) => I.lanes.every((C, y) => P.lanes[y]?.id === C.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && s !== t)
    return p(o, l) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, l)) return W.keepsOrder;
  if (se(o) && s === t && !(p(o, l) && b(o, l))) return tt[t];
  if (se(o) && s === t) {
    const I = hr(o, l);
    if (I) return I;
  }
  if (t === "release-plan" && s === "release-plan") {
    if (!p(o, l)) return W.releaseLanes;
    if (!b(o, l)) return W.releaseOrder;
    if (l.cards.some((I) => !o.cards.some((P) => P.id === I.id))) return W.releaseCards;
  }
  return t !== s ? "This slate holds a " + pr[t] + ", and it stays one. Start a new slate for another kind of workshop." : o.behaviour || l.behaviour ? me().replacement(o, l) : null;
}
const ds = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function cs(e) {
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
function wr(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function us(e, n) {
  return wr(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const ho = ["firstPrint", "secondPrint", "thirdPrint"], po = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function fs(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...po, route: n.route };
  for (const t of ho) {
    const l = n[t];
    if (typeof l != "string" || !l.trim() || l.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = l.trim();
  }
  return o;
}
function hs(e = new URLSearchParams()) {
  const n = { ...po };
  for (const t of ho) {
    const l = e.get(t)?.trim();
    l && l.length <= 48 && (n[t] = l);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function ps(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function gr(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = br(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), kr(n), n;
}
function yr(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function kr(e) {
  return e && yr(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Yt(e) {
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
function br(e) {
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
function Vn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const Zt = "#1f7a5c", Vt = "#5b9a85", Qn = "#c2410c", vr = "#2f5fd0", Ir = {
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
}, xr = { canMove: !1, canSelect: !1 };
function Ar(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ms(e, n, o = {}) {
  let t = V(n);
  const l = o.kit, s = (i) => !!se(i) && !l;
  if (s(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const p = l?.layer(e);
  let b = null, I = null, P = !!o.readOnly, C = P || s(t), y = !1;
  const k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let _ = null, r = null, m = null, x = null;
  const S = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
  let E = null, M = null;
  function q(i, a) {
    M && clearTimeout(M.timer), M = { name: i, reason: a, timer: setTimeout(() => {
      M = null, y || z(I ?? t);
    }, 3e3) };
  }
  let j = Promise.resolve(), Z = null, J = Qt(o.layout), $e = J;
  const Oe = { ...o.style };
  let he = /* @__PURE__ */ new Map(), Le = /* @__PURE__ */ new Set(), pe = null, Pe = !1;
  const le = /* @__PURE__ */ new Map();
  Fe(t);
  const X = o.origin ? { x: o.origin.x, y: o.origin.y } : Tr(e), ke = (i) => D.get(i) ?? i, de = (i) => Ar(ke(i));
  function ce(i) {
    const a = R.get(i);
    if (a) return a;
    if (k.has(i) && !D.has(i) || !e.nodes.one?.(i)) return i;
    const d = _o(i, (c) => !!e.nodes.one?.(c) || D.has(c));
    return R.set(i, d), D.set(d, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const be = {
    governs(i) {
      if (k.get(i.id) !== i) return null;
      const a = de(i.id)?.kind;
      return a === "card" ? { canMove: !C, canEditText: !C && !I && t.kind !== "release-plan", canConnect: Qe() } : a === "lane" ? { canMove: !1, canEditText: !C && !I } : a === "handle" ? { canMove: !C && !I, canEditText: !1, ...!J.narrow && { cursor: "ew-resize" } } : xr;
    },
    onStart(i, a) {
      const d = de(i.id), c = { x: a.x - (i.options.x ?? 0), y: a.y - (i.options.y ?? 0) };
      if (d.kind === "handle") {
        const h = !C && !I && l ? l.handleDrag(t, ke(i.id), c, J) : null;
        return h ? (ie(), Ne(), M && (clearTimeout(M.timer), M = null), b = { name: ke(i.id), follow: h, last: null }, !0) : !1;
      }
      const w = d.key;
      if (C || I || !t.cards.some((h) => h.id === w)) return !1;
      ie(), Ne();
      let u = null;
      try {
        u = (l?.chooser ?? o.chooseCandidate)?.(t, w, c, J) ?? null;
      } catch (h) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", h);
      }
      return _ = { cardId: w, evaluate: u, grab: c, outcome: { kind: "home" } }, z(t, { skip: w }), !0;
    },
    onMove(i, a) {
      if (b) {
        b.last = b.follow(nn(a)), z(b.last.next, { grip: b.name, layout: b.last.layout }), B(o.onPreview, b.last.next === t ? null : b.last.next);
        return;
      }
      if (!_) return;
      const d = xt(_.cardId, a, _.evaluate);
      if (Cr(d, _.outcome)) return;
      _.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      z(c ?? t, { skip: _.cardId }), B(o.onPreview, c);
    },
    onEnd(i, a) {
      if (b) {
        const { follow: h, name: f } = b, g = h(nn(a));
        b = null, B(o.onPreview, null), g.refusal ? (q(f, g.refusal), z(t), e.announce?.(g.refusal), B(o.onRefuse, { laneId: null, reason: g.refusal })) : mn(g.next, {}) || z(t);
        const L = qn(t, f);
        return L ? { accept: !0, settle: L } : { accept: !1 };
      }
      if (!_) return { accept: !1 };
      const { cardId: d, evaluate: c } = _, w = xt(d, a, c), u = t.cards.find((h) => h.id === d);
      if (_ = null, B(o.onPreview, null), w.kind === "candidate" && l) {
        if (!mn(w.next, { cardId: d, laneId: w.laneId }, d))
          return z(t, { skip: d }), { accept: !1 };
        w.said && (q("card-" + d, w.said), e.announce?.(w.said));
        const h = qn(t, ke(i.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (w.kind === "candidate") {
        t = w.next, z(t, { skip: d });
        const h = t.lanes.find((g) => g.id === w.laneId);
        e.announce?.(`${Y(u)} moved to ${h.label}. ${Ae(t, h.id)}.`), B(o.onChange, t, { cardId: d, laneId: w.laneId });
        const f = qn(t, ke(i.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (w.kind === "refused")
        Qo(Y(u), { cardId: d, laneId: w.laneId, reason: w.reason }), w.near && q("card-" + d, w.reason);
      else if (w.kind === "outside" && sn(t) && !Ze()) {
        const h = xn(t, d);
        if (!h)
          return Un(d, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
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
      const a = _ && t.cards.find((d) => d.id === _.cardId);
      _ = null, B(o.onPreview, null), z(t, { skip: de(i.id)?.key }), a && e.announce?.(`Move cancelled. ${Y(a)} stays where it was.`);
    },
    onTextCommit(i, a, d) {
      const c = de(i.id);
      if (!c || C || I) return !1;
      let w = a.replace(/\s+/g, " ").trim();
      const u = [], h = se(t), f = h && c.kind === "card" ? ye(h).renamed(t, c.key, w) : null;
      f && (w = f.label, u.push(...f.edits));
      const g = c.kind === "lane" ? { laneId: c.key, label: w } : { cardId: c.key, label: w };
      u.unshift(c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: w } : { kind: "rename_card", card: { id: c.key }, label: w });
      const L = Be(t, u);
      if ("refused" in L) {
        const { reason: T } = L.refused;
        return e.announce?.(`${d} keeps its name. ${T}`), B(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: g, reason: T }), !1;
      }
      return JSON.stringify(L.workshop) === JSON.stringify(t) ? (z(t), !1) : (t = L.workshop, z(t), e.announce?.(f ? L.report.edits.map((T) => T.said).join(" ") : `${d} renamed to ${w}.`), B(o.onChange, t, { rename: g, ...l ? { edits: u } : {} }), f ? !1 : w);
    },
    onKeyDown(i, a) {
      const d = de(i.id);
      if (C || I || _ || b || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (m && (m.node !== i.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== m.key) && Ct(), m && a.key === "Escape")
        return a.preventDefault(), Ct(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (m && a.key === "Enter") {
        a.preventDefault();
        const h = m.choices[m.at];
        return m = null, B(o.onPreview, null), t = h.next, z(t), e.announce?.(h.done), B(o.onChange, t, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: h.edits }), !0;
      }
      const c = l?.keyChoices?.(t, ke(i.id), a.key);
      if (c) {
        a.preventDefault();
        const h = [], f = [];
        for (const T of typeof c == "string" ? [] : c) {
          const N = Be(t, T.edits);
          "refused" in N ? f.push(`${T.said}: ${N.refused.reason}`) : h.push({ ...T, next: N.workshop, done: N.report.edits.map((H) => H.said).join(" ") });
        }
        if (!h.length)
          return e.announce?.(typeof c == "string" ? c : f.join(" ")), !0;
        const g = m && m.node === i.id ? (m.at + 1) % h.length : 0;
        m = { node: i.id, key: a.key.toLowerCase(), choices: h, at: g }, z(h[g].next), B(o.onPreview, h[g].next);
        const L = h.length > 1 ? ` (${g + 1} of ${h.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${h[g].said}${L} Enter to make it, Escape to cancel.`), !0;
      }
      const w = l?.keyEdit?.(t, ke(i.id), { key: a.key, shiftKey: a.shiftKey });
      if (w) {
        a.preventDefault();
        const h = Be(t, w);
        return "refused" in h ? (e.announce?.(h.refused.reason), B(o.onRefuse, { laneId: h.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: h.refused.reason })) : mn(h.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = t.cards.find((h) => h.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), At(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Do())
        return a.preventDefault(), At(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: h, next: f, spot: g } = r;
        if (r = null, h === null)
          return B(o.onPreview, null), Un(u.id, g), !0;
        const L = t;
        t = f, z(t), Ee(h), B(o.onPreview, null);
        const T = t.lanes.find((N) => N.id === h);
        return e.announce?.(`${Y(u)} moved to ${T.label}. ${Ae(t, h)}.`), B(o.onChange, t, { cardId: u.id, laneId: h, ...l ? { edits: l.editsBetween(L, t) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Ne(), e.announce?.(`Move cancelled. ${Y(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((a) => k.get(a.id) === a).map((a) => a.id);
      Pe = i.length === 1, k.clear(), v.clear(), A.clear(), le.clear(), R.clear(), D.clear(), _ = null, r = null, z(I ?? t, { animate: !1 }), i.length === 1 && (j = j.then(() => {
        Pe = !1;
        const a = k.get(i[0]);
        if (!y && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        jn();
      }));
    }
  };
  be.onFreeMove = (i, a) => {
    if (!un() || i.options?.isComment) return Fn();
    const d = fn(a), c = hn(i), w = t.lanes.filter((f) => !Ve(i) && Ue(t, f.id, c) === null).map((f) => f.id), u = d && l?.noteUnder?.(t, nn(a), J);
    u && (c.under = u);
    const h = d ? Ve(i) ?? Ue(t, d, c) : null;
    x && x.noteId === i.id && x.laneId === d && x.refusal === h || (x = { noteId: i.id, laneId: d, refusal: h, open: w }, Ce());
  }, be.onFreeDrop = (i, a, d) => {
    if (Fn(), !un() || i.options?.isComment) return;
    const c = fn(a);
    if (!c) return;
    const w = hn(i), u = l?.noteUnder?.(t, nn(a), J);
    u && (w.under = u);
    const h = t.lanes.find((g) => g.id === c), f = Ve(i) ?? Ue(t, c, w);
    return f ? (ie(!1), E = { laneId: c, reason: f, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${zn(w.label)} can't go in ${h.label}. ${f}`), B(o.onRefuse, { noteId: i.id, laneId: c, reason: f }), "refused") : (Bn([{ node: i, offer: w, from: d }], c), "taken");
  }, be.onFreeGroupDrop = (i, a, d) => {
    if (Fn(), !un() || i.some((f) => f.options?.isComment)) return;
    const c = fn(a);
    if (!c) return;
    const w = t.lanes.find((f) => f.id === c), u = i.map((f) => ({ node: f, offer: hn(f) })), h = Uo(u, c);
    if (h) {
      ie(!1), E = { laneId: c, reason: h, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${Tt(u.map((f) => zn(f.offer.label)))} can't go in ${w.label}. ${h}`);
      for (const { node: f } of u) B(o.onRefuse, { noteId: f.id, laneId: c, reason: h });
      return "refused";
    }
    return Bn(u.map((f, g) => ({ ...f, from: d?.[g] })), c), "taken";
  }, be.onFreeTextCommit = (i) => {
    if (!un() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const a = i.options ?? {}, d = fn({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = hn(i), w = t.lanes.find((L) => L.id === d), u = Ve(i) ?? Ue(t, d, c);
    if (!u) {
      Bn([{ node: i, offer: c }], d);
      return;
    }
    ie(!1), E = { laneId: d, reason: u, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${zn(c.label)} can't go in ${w.label}. ${u} It is beside the board.`), B(o.onRefuse, { noteId: i.id, laneId: d, reason: u });
    const { width: h } = Fe(t), f = Math.round(X.x + h + 32), g = Math.round(a.y ?? X.y);
    i.position(f, g, () => e.updateSelectionResizeRotate?.(), void 0, Vn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Yt({ ...i.options, x: f, y: g })] });
  }, be.undoState = () => ({ cards: t.cards.map((i) => ({ ...i })), pairs: [...S], lines: (t.lines ?? []).map((i) => ({ ...i })) }), be.onUndoRestore = (i, a) => {
    if (y) return;
    const d = new Map((i?.cards ?? []).map((u) => [u.id, u])), c = new Map(i?.pairs ?? []), w = (u) => S.get(u) ?? c.get(u) ?? u;
    for (const u of a.added) {
      const h = w(u), f = t.cards.find((L) => L.id === h);
      if (!f) continue;
      t = V({ ...t, cards: t.cards.filter((L) => L !== f), lines: He(t.lines, h, u) }), z(t);
      const g = B(o.onChange, t, { cardId: h, cardToNote: { noteId: u }, via: "undo" });
      e.holdTrade?.(u, g), Xn(g);
    }
    for (const u of a.removed) {
      const h = w(u), f = d.get(h);
      if (!f || t.cards.some((G) => G.id === h)) continue;
      const g = (i?.lines ?? []).filter((G) => G.parentId === h || G.childId === h), L = {
        id: h,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...g.length ? { lines: g } : {}
      }, T = [f.laneId, ...t.lanes.map((G) => G.id)].find((G) => rn(t, G, L));
      if (!T) {
        e.announce?.(`${Y(f)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Zo(rn(t, T, L), h, i?.cards ?? []), h !== u && S.set(u, h), z(t);
      const N = t.cards.findIndex((G) => G.id === h), H = t.cards.slice(N + 1).find((G) => G.laneId === T)?.id, U = B(o.onChange, t, { cardId: h, laneId: T, noteToCard: {
        noteId: u,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...H ? { before: H } : {},
        ...g.length ? { lines: He(g, h, u) } : {}
      }, via: "undo" });
      e.holdTrade?.(u, U), Xn(U);
    }
    Array.isArray(i?.lines) && Yo(i.lines);
  };
  let Wn = !1;
  be.onNodeAdded = (i) => {
    y || Wn || k.get(i.id) === i || (t.lines ?? []).some((a) => a.parentId === i.id || a.childId === i.id) && (Wn = !0, queueMicrotask(() => {
      Wn = !1, y || Ce();
    }));
  }, be.onLine = (i, a) => {
    y || queueMicrotask(() => {
      y || qo(i, a);
    });
  };
  const Fo = e.setDragPolicy(be), zo = o.onSelect || p ? e.onSelectionChange?.(() => {
    jn(), Wt();
  }) : void 0;
  let cn = null;
  const vt = (i) => {
    const d = i.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, c = d && k.has(d) ? Rt(d) : null;
    c !== cn && (cn = c, Wt());
  };
  p && e.element?.addEventListener?.("pointerover", vt);
  const It = () => {
    r && Ne();
  };
  e.element?.addEventListener?.("pointerdown", It, !0), z(t, { animate: !1 });
  function xt(i, a, d) {
    const c = t.cards.find((T) => T.id === i);
    if (!c) return { kind: "outside" };
    if (l) {
      const T = nn(a), N = l.refusalAt(t, i, _?.grab ?? { x: 0, y: 0 }, T, J);
      if (N && !N.lands) return { kind: "refused", laneId: N.laneId, reason: N.reason };
      const { width: H, height: U } = Fe(t);
      if (T.x < -40 || T.y < -40 || T.x > H + 40 || T.y > U + 40) return { kind: "outside" };
      let G = t;
      try {
        G = d?.(T) ?? t;
      } catch (ee) {
        console.warn("WORKSHOP: the board kit's chooser threw", ee);
      }
      return JSON.stringify(G) === JSON.stringify(t) ? N ? { kind: "refused", laneId: N.laneId, reason: N.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: G.cards.find((ee) => ee.id === i)?.laneId ?? c.laneId, next: G, ...N && { said: N.reason } };
    }
    const w = t.lanes.map((T) => k.get(ce(re.column(T.id)))).filter(Boolean), u = e.hitTestNodes(a, w, { padding: 6 }), h = u ? de(u.id).key : null;
    if (!h) return { kind: "outside" };
    if (h === c.laneId) return { kind: "home" };
    const f = ln(t, i, h);
    if (!f) return { kind: "refused", laneId: h, reason: In(t, i, h) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: h, next: f };
    let g = null;
    try {
      g = d({ x: a.x - X.x, y: a.y - X.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: h, next: f };
    }
    const L = g?.cards.find((T) => T.id === i)?.laneId;
    return !g || !L || L === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: L, next: g };
  }
  function Do() {
    return l ? !1 : new Set(Ge(t, { layout: J }).places.map((i) => i.row)).size > 1;
  }
  function At(i, a, d = !1) {
    const c = t.cards.find((T) => T.id === i), w = eo(t, i), u = r?.cardId === i && r.laneId === null ? r.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const T = u > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Ne(), T.id === c.laneId) {
        Ee(T.id, I ?? t), e.announce?.(`${Y(c)} is back in ${T.label}.`);
        return;
      }
      if (w.includes(T)) {
        const H = ln(t, i, T.id);
        r = { cardId: i, laneId: T.id, next: H }, z(H), Ee(T.id, H), B(o.onPreview, H), e.announce?.(`${Y(c)} to ${T.label}: ${Ae(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const N = In(t, i, T.id) ?? "That move is not available.";
      ie(), E = { laneId: T.id, reason: N, timer: setTimeout(() => ie(), 1500) }, z(I ?? t), Ee(T.id, I ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${N}`), B(o.onRefuse, { cardId: i, laneId: T.id, reason: N });
      return;
    }
    const h = r?.cardId === i ? r.laneId : c.laneId;
    let f;
    if (d) {
      const { places: T } = Ge(t, { layout: J }), N = T.find((H) => H.laneId === h);
      f = T.filter((H) => H.column === N.column && (H.row - N.row) * a > 0).sort((H, U) => (H.row - U.row) * a).map((H) => t.lanes.find((U) => U.id === H.laneId));
    } else {
      const T = t.lanes.findIndex((N) => N.id === h);
      f = a > 0 ? t.lanes.slice(T + 1) : t.lanes.slice(0, T).reverse();
    }
    const g = f.find((T) => w.includes(T));
    if (ie(), !g) {
      const T = f[0];
      if (!T) {
        if (!d && sn(t)) {
          const H = xn(t, i);
          if (H) {
            e.announce?.(H), B(o.onRefuse, { cardId: i, laneId: null, reason: H });
            return;
          }
          Ho(c, a);
          return;
        }
        e.announce?.(`${Y(c)} has no lane to move to on that side.`);
        return;
      }
      const N = In(t, i, T.id) ?? "That move is not available.";
      E = { laneId: T.id, reason: N, timer: setTimeout(() => ie(), 1500) }, z(r?.next ?? I ?? t), Ee(T.id, r?.next ?? I ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${N}`), B(o.onRefuse, { cardId: i, laneId: T.id, reason: N });
      return;
    }
    if (g.id === c.laneId) {
      Ne(), Ee(g.id, I ?? t), e.announce?.(`${Y(c)} is back in ${g.label}.`);
      return;
    }
    const L = ln(t, i, g.id);
    r = { cardId: i, laneId: g.id, next: L }, z(L), Ee(g.id, L), B(o.onPreview, L), e.announce?.(`${Y(c)} to ${g.label}: ${Ae(L, g.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ee(i, a = t) {
    const d = l ? er(a, re.column(i)) : Ge(a, { layout: J, rows: _t() }).places.find((g) => g.laneId === i), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const w = 16, u = (g, L, T, N) => L + w * 2 >= N || g - w < T ? g - w - T : g + L + w > T + N ? g + L + w - (T + N) : 0, h = u(X.x + d.x, d.width, c.x, c.width), f = u(X.y + d.y, d.height, c.y, c.height);
    (h || f) && e.panBy?.({ x: h, y: f });
  }
  function jn() {
    if (!o.onSelect || Pe) return;
    const i = y ? [] : e.getSelectedNodes?.() ?? [], a = i.length === 1 && k.get(i[0].id) === i[0] ? de(i[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== pe && (pe = c, B(o.onSelect, d));
  }
  function Ct() {
    m && (m = null, z(t), B(o.onPreview, null));
  }
  function Ne() {
    r && (r = null, B(o.onPreview, null), z(I ?? t));
  }
  function Ho(i, a) {
    const { width: d } = Fe(t), c = k.get(ce(re.card(i.id)))?.options, w = c?.width ?? 228, u = { x: a > 0 ? X.x + d + 32 : X.x - w - 32, y: c?.y ?? X.y }, h = to(t, i.id);
    r = { cardId: i.id, laneId: null, side: a, spot: u, next: t }, z(t), B(o.onPreview, h), e.announce?.(`${Y(i)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
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
  function fn(i) {
    const a = t.lanes.map((c) => k.get(ce(re.column(c.id)))).filter(Boolean), d = e.hitTestNodes(i, a, { padding: 6 });
    return d ? de(d.id)?.key ?? null : null;
  }
  function hn(i) {
    const a = i.options ?? {}, d = yo({
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
    a.link?.data && Xt({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const h = Bo(i);
    return { id: i.id, label: w, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...h.length ? { lines: h } : {} };
  }
  function Bo(i) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!k.get(c) && k.get(c) === e.nodes.one(c);
    for (const c of i.relationships?.getAssociations?.() ?? [])
      (c.targetPoint || !d(c.childId)) && a.set(c.id, Xe(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === i || d(c.id)))
        for (const w of c.relationships?.getAssociations?.() ?? [])
          w.childId === i.id && !w.targetPoint && a.set(w.id, Xe(w));
    for (const c of oo(t, i.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function Tt(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function Uo(i, a) {
    for (const { node: u } of i) {
      const h = Ve(u);
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
      w = rn(w, a, u);
    }
    return null;
  }
  function Ve(i) {
    if (i.options?.image && !it(i.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = i.options?.link;
    return a?.data && !Xt({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const zn = (i) => i || "This note", Y = (i) => i.label || "The empty card", St = (i) => {
    const a = String(i ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : Ir[a] ?? "shape";
  }, Dn = (i) => (/^[aeiou]/i.test(i) ? "an " : "a ") + i, $t = (i) => {
    const a = i.flatMap((d) => {
      const c = St(d.asNote?.shape);
      return c ? [{ card: d, word: c }] : [];
    });
    if (!a.length) return "";
    if (i.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Dn(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: c }) => c === "shape" ? `${Y(d)} had its own shape` : `${Y(d)} was ${Dn(c)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, Go = (i) => {
    const a = St(i);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Dn(a)} again.` : "";
  };
  function Qe() {
    return !y && !C && !I && !Ze() && !t.kind && sn(t);
  }
  function Xe(i) {
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
  function Ot(i, a) {
    const d = { ...i };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function Lt(i) {
    if (!i || e.nodes.one(i.id) !== i) return null;
    if (k.get(i.id) === i) {
      const a = de(i.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return i.options?.isComment ? null : i.id;
  }
  function Hn(i, a) {
    if (i.cards.some((c) => c.id === a)) {
      const c = k.get(ce(re.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && k.get(a) !== d && d.svgGroup ? d : null;
  }
  function Pt(i) {
    const a = [];
    for (const d of i) {
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
  function Ko(i) {
    const a = /* @__PURE__ */ new Set();
    for (const d of i.lines ?? []) {
      if (d.targetPoint) {
        const N = Hn(i, d.parentId);
        if (!N || k.get(N.id) !== N) continue;
        const H = { ...d, parentId: N.id }, U = JSON.stringify(H);
        a.add(d.id);
        const G = le.get(d.id);
        if (G && G.key === U && G.holder === N && !G.other && N.relationships.hasAssociationId?.(d.id)) continue;
        G && e.nodes.one(G.holder.id) === G.holder && G.holder.relationships?.removeAssociation?.(d.id), N.relationships.addFloatingAssociation(d.targetPoint, on(H)), le.set(d.id, { holder: N, other: null, swapped: !1, key: U });
        continue;
      }
      const c = Hn(i, d.parentId), w = Hn(i, d.childId);
      if (!c || !w || c === w) continue;
      const u = k.get(c.id) !== c, h = u ? w : c, f = u ? c : w, g = u ? Ot({ ...d, parentId: h.id, childId: f.id }, d) : { ...d, parentId: h.id, childId: f.id }, L = JSON.stringify(g);
      a.add(d.id);
      const T = le.get(d.id);
      T && T.key === L && T.holder === h && T.other === f && h.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), h.relationships.addAssociation(f, on(g)), le.set(d.id, { holder: h, other: f, swapped: u, key: L }));
    }
    for (const [d, c] of [...le])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), le.delete(d));
  }
  function pn(i) {
    const a = i.parentId ? e.nodes.one(i.parentId) : null, d = i.id ?? i.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !i.id) && a.relationships.removeAssociation(d);
    });
  }
  let en = null;
  function qo(i, a) {
    if (i === "addRelationship") {
      if (le.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, c = e.nodes.one(a?.parentId), w = d ? null : e.nodes.one(a?.childId), u = Lt(c), h = d ? null : Lt(w), f = en?.lineId === a?.id ? t.lines?.find((H) => H.id === a?.id) : void 0;
      f && (en = null);
      const g = (H) => {
        pn(a), f && z(I ?? t), e.announce?.(H), B(o.onRefuse, { reason: H, laneId: null });
      };
      if (!Qe()) {
        pn(a), f && z(I ?? t);
        return;
      }
      if (!u || !h && !d) return g(f ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const L = d ? String(a.childId) : h;
      if (f) {
        const H = t.cards.some((Re) => Re.id === u), U = !d && t.cards.some((Re) => Re.id === h);
        if (!H && !U) return _e({ remove: f.id });
        const G = { ...Xe(a), id: f.id, parentId: u, childId: L }, ee = dn(t, G);
        if (ee) return g(ee);
        pn(a), _e({ set: G });
        return;
      }
      const T = Lo(t, u, L, Xe(a)), N = dn(t, T);
      if (N) return g(N);
      pn(a), _e({ set: T });
      return;
    }
    if (i === "removeRelationship") {
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
    if (i === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...le].find(([T, N]) => T === d?.associationId && N.holder.id === d?.id);
        if (!c) continue;
        const [w, u] = c, h = t.lines?.find((T) => T.id === w), f = u.holder.relationships?.getAssociations?.().find((T) => T.id === w);
        if (!h || !f) continue;
        if (!Qe()) {
          z(I ?? t);
          continue;
        }
        const g = Xe(f), L = u.swapped ? Ot({ ...g, id: h.id, parentId: h.parentId, childId: h.childId }, g) : { ...g, id: h.id, parentId: h.parentId, childId: h.childId };
        JSON.stringify(Jo(L)) !== JSON.stringify(h) && (le.set(w, { ...u, key: "" }), _e({ set: L }));
      }
  }
  function Jo(i) {
    return An({ ...t, lines: [] }, i)?.lines?.[0] ?? null;
  }
  function _e(i) {
    const a = t.lines?.find((f) => f.id === ("set" in i ? i.set.id : i.remove)), d = "set" in i ? An(t, i.set) : ro(t, i.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), z(I ?? t);
    const c = "set" in i ? i.set : a, w = [c.parentId, c.childId].map((f) => t.cards.find((g) => g.id === f)?.label ?? e.nodes.one(f)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (f) => w[f] || (f === 1 && c.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in i ? a ? `The line from ${u(0)} to ${u(1)} changed.` : c.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const h = B(o.onChange, t, { line: i });
    Xn(h, () => {
      if (y || t !== d) return;
      const f = a ? An(t, a) : "set" in i ? ro(t, i.set.id) : null;
      f && (t = f, z(I ?? t));
    });
  }
  function Yo(i) {
    const a = new Map(i.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || _e({ remove: c });
    for (const [c, w] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(w) && dn(t, w) === null && _e({ set: w });
  }
  function Bn(i, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), w = i.map(({ node: f, offer: g, from: L }) => {
      let T = g.lines;
      for (const [U, G] of c) T = He(T, U, G);
      d = rn(d, a, { ...g, ...T ? { lines: T } : {} });
      const N = d.cards[d.cards.length - 1];
      N.id !== f.id && c.set(f.id, N.id);
      const H = { ...f.options ?? {}, ...L ? { x: L.x, y: L.y } : {} };
      return { node: f, card: N, kept: H, lines: He(T ?? [], f.id, N.id), under: g.under };
    });
    e.beginHostStep?.(), t = d;
    let u = t;
    for (const { node: f, card: g } of w)
      g.id !== f.id && S.set(f.id, g.id), $.set(ce(re.card(g.id)), { x: f.options?.x ?? 0, y: f.options?.y ?? 0 }), je(() => e.removeNode(f.id));
    e.endHostStep?.(), z(t), Vo(ce(re.card(w[0].card.id)));
    const h = t.lanes.find((f) => f.id === a);
    e.announce?.(w.length === 1 ? `${Y(w[0].card)} is now a card in ${h.label}. ${Ae(t, a)}.${$t([w[0].card])}` : `${Tt(w.map(({ card: f }) => Y(f)))} are now cards in ${h.label}. ${Ae(t, a)}.${$t(w.map(({ card: f }) => f))}`);
    for (const { node: f, card: g, kept: L, lines: T, under: N } of w) {
      const H = { cardId: g.id, laneId: a, noteToCard: {
        noteId: f.id,
        label: g.label,
        ...N && { under: N },
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...T.length ? { lines: T } : {}
      } }, U = () => {
        t !== u || !t.cards.some((ee) => ee.id === g.id) || (t = V({ ...t, cards: t.cards.filter((ee) => ee.id !== g.id), lines: He(t.lines, g.id, f.id) }), u = t, z(t));
      }, G = B(o.onChange, t, H);
      e.holdTrade?.(f.id, G), Et(G, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: f.id, isComment: !1 } }]);
      }, () => {
        if (!y) {
          if (U(), !e.nodes.one(L.id)) {
            e.beginHostStep?.();
            const ee = je(() => e.addNode({ ...L }));
            ee && (ee.announcedByCreator = !0), e.endHostStep?.();
            const Re = He(T, g.id, f.id).filter((ue) => !t.cards.some((wn) => wn.id === ue.parentId || wn.id === ue.childId));
            ee?.ready?.then?.(() => {
              y || je(() => Pt(Re));
            });
          }
          e.announce?.(`${Y(g)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        y || (U(), e.keepTrade?.(f.id), e.announce?.(`Someone else put ${Y(g)} on the board first.`));
      });
    }
  }
  function Un(i, a) {
    const d = t.cards.find((te) => te.id === i), c = t.lanes.find((te) => te.id === d.laneId), w = t.cards.findIndex((te) => te.id === i), u = t.cards.slice(w + 1).find((te) => te.laneId === d.laneId)?.id, h = v.get(ce(re.card(i))) ?? {}, f = mo(d), g = e.nodes.one(f) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : f, L = oo(t, i), { leave: T } = Wr(t, i, g), N = to(t, i, g), H = (Oe.cornerRadius ?? 0) > 0, U = d.asNote, G = U?.text !== void 0 && wt(U.text) === d.label ? U.text : Mr(t, d), ee = {
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
    g !== i ? S.set(g, i) : S.delete(g);
    const ue = je(() => e.addNode(ee));
    ue && (ue.announcedByCreator = !0), e.endHostStep?.(), z(t);
    const wn = Promise.resolve(ue?.ready).then(() => y || !ue || e.nodes.one(g) !== ue ? [] : je(() => Pt(T))).catch(() => []);
    ue?.ready?.then?.(() => {
      if (y || e.nodes.one(g) !== ue) return;
      const te = () => e.selectNodes?.([ue]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(te) : te();
    }), e.announce?.(`${Y(d)} is now a note on the canvas. ${c.label}: ${Ae(t, c.id)}.${Go(U?.shape)}`);
    const Dt = () => {
      e.nodes.one(g) === ue && (e.beginHostStep?.(), je(() => e.removeNode(g)), e.endHostStep?.());
    }, Ht = B(o.onChange, t, { cardId: i, cardToNote: { noteId: g } });
    e.holdTrade?.(g, Ht), Et(Ht, () => {
      wn.then((te) => {
        ue && e.nodes.one(g) === ue && e.sendHeld?.([{ type: "onNodeAdded", data: { id: g, nodeOptions: Yt(ue.options) } }, ...te]);
      });
    }, () => {
      if (!y) {
        if (Dt(), t === Re && !t.cards.some((te) => te.id === i)) {
          const te = {
            id: i,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...L.length ? { lines: L } : {}
          }, Bt = rn(t, d.laneId, te, u);
          Bt && (t = Bt, z(t));
        }
        e.announce?.(`${Y(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      y || (Dt(), e.keepTrade?.(g), e.announce?.(`Someone else took ${Y(d)} off the lanes first.`));
    });
  }
  function Zo(i, a, d) {
    const c = d.map((g) => g.id), w = c.indexOf(a), u = i.cards.find((g) => g.id === a);
    if (w < 0 || !u) return i;
    const h = i.cards.filter((g) => g !== u), f = h.findIndex((g) => c.indexOf(g.id) > w);
    return h.splice(f < 0 ? h.length : f, 0, u), V({ ...i, cards: h });
  }
  function Vo(i) {
    j = j.then(() => {
      const a = k.get(i);
      if (y || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function je(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function Et(i, a, d, c) {
    if (!i || typeof i.then != "function") return a();
    const w = i.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && c();
    }, () => d());
    e.holdUntil?.(w);
  }
  function Qo(i, a) {
    ie(!1), E = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => ie(), 1500) }, z(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${i || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), B(o.onRefuse, a);
  }
  function ie(i = !0) {
    E && (clearTimeout(E.timer), E = null, i && !y && Ce());
  }
  function Ce() {
    z(_ && _.outcome.kind === "candidate" ? _.outcome.next : r?.next ?? I ?? t, { skip: _?.cardId });
  }
  function Nt(i) {
    const a = Ft(i, _t()), d = new Map(a.map((u) => [u.options.id, u.options])), c = (u, h, f, g = !1) => {
      const L = d.get(re.column(u));
      L && (L.borderColor = h, L.borderWidth = f, delete L.borderStyle);
      const T = g && d.get(re.lane(u));
      T && (T.borderColor = h, T.borderWidth = f);
    }, w = _?.cardId ?? r?.cardId;
    if (he = /* @__PURE__ */ new Map(), w) {
      const u = t.cards.find((g) => g.id === w)?.laneId, h = eo(t, w);
      if (!l || l.laneCues)
        for (const g of h) g.id !== u && (c(g.id, Vt, 2), he.set(g.id, "open"));
      if (l?.laneCues) {
        for (const g of t.lanes) if (!h.includes(g)) {
          const L = d.get(re.column(g.id));
          L && (L.backgroundColor = "#e9e8e2"), he.set(g.id, "closed");
        }
      }
      const f = _ ? _.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      f?.kind === "candidate" && (c(f.laneId, Zt, 3, !0), he.set(f.laneId, "over")), f?.kind === "refused" && (c(f.laneId, Qn, 3), he.set(f.laneId, "refused"));
    }
    if (x && !w) {
      for (const u of x.open) u !== x.laneId && (c(u, Vt, 2), he.set(u, "open"));
      x.laneId && !x.refusal && (c(x.laneId, Zt, 3, !0), he.set(x.laneId, "over")), x.laneId && x.refusal && (c(x.laneId, Qn, 3), he.set(x.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const u = d.get(re.card(r.cardId));
      u && (u.xPos = r.spot.x, u.yPos = r.spot.y);
    }
    if (E) {
      he.set(E.laneId, "refused"), c(E.laneId, Qn, 3, !0);
      const u = d.get(re.caption(E.laneId));
      u && (u.text = E.reason, u.foregroundColor = "#b42318");
    }
    if (Le = /* @__PURE__ */ new Set(), I && i === I) {
      const u = (f, g) => JSON.stringify(f) === JSON.stringify(g), h = (f) => {
        const g = d.get(f);
        g && (g.borderStyle = "dashed", g.borderColor = vr, g.borderWidth = 2, Le.add(ce(f)));
      };
      for (const f of i.cards) u(f, t.cards.find((g) => g.id === f.id)) || h(re.card(f.id));
      for (const f of i.lanes) u(f, t.lanes.find((g) => g.id === f.id)) || h(re.lane(f.id));
    }
    for (const u of a) {
      u.options.id = ce(u.options.id);
      for (const h of u.relationships.associations)
        h.parentId = ce(h.parentId), h.childId = ce(h.childId);
    }
    return a;
  }
  function _t() {
    return _ || r ? t.lanes.map((i) => t.cards.filter((a) => a.laneId === i.id).length) : void 0;
  }
  function z(i, a = {}) {
    if (y) return;
    $e = a.layout ?? J, Z = { model: i, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Nt(i), c = [];
    for (const { options: u } of d) {
      const h = u.id;
      if (k.has(h)) continue;
      const f = $.get(h);
      $.delete(h);
      const g = f && a.animate !== !1 && !Vn() ? { ...u, xPos: f.x, yPos: f.y } : u, L = e.nodes.add(gr(g));
      k.set(h, L), v.set(h, { ...g }), L.ready && c.push(L.ready.then(() => {
        if (k.get(h) !== L) return;
        L.applyGovernance?.(), de(h)?.kind === "column" && L.toBack?.(!1), de(h)?.kind === "handle" && L.svgGroup?.front?.();
        const T = zt(Z?.model ?? i, h);
        T && L.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const w = Z;
    j = Promise.all([j, ...c]).then(() => {
      y || Z !== w || Xo(Nt(w.model), w);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function Xo(i, a) {
    const d = new Set(i.map((w) => w.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, h] of [...k]) {
        if (d.has(u)) continue;
        for (const [g, L] of [...A])
          L.parentId !== u && L.childId !== u || (L.parent.relationships?.removeAssociation(g), A.delete(g));
        e.deselectNode?.(h), h.editor?.cancelInline?.(), k.delete(u), v.delete(u);
        const f = D.get(u);
        f && (D.delete(u), R.delete(f)), e.nodes.remove(u);
      }
      for (const { options: u } of i) {
        const h = u.id, f = k.get(h);
        if (!f?.svgGroup) continue;
        const g = v.get(h) ?? {}, L = f.editor?.isInlineEditing?.();
        (u.fontSize !== g.fontSize || u.foregroundColor !== g.foregroundColor) && (f.options.fontSize = u.fontSize, f.options.fontColor = u.foregroundColor, f.applyTextStyle?.()), u.text !== g.text && !L && f.setText?.(u.text), (u.width !== g.width || u.height !== g.height) && (u.vectorPath ? (f.options.width = u.width, f.options.height = u.height, f.setShape?.(f.options.shape, u.vectorPath), de(h)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(u.width, u.height)), u.backgroundColor !== g.backgroundColor && f.setColors?.(u.backgroundColor), (u.borderColor !== g.borderColor || u.borderWidth !== g.borderWidth || u.borderStyle !== g.borderStyle) && (f.options.borderColor = u.borderColor, f.options.borderWidth = u.borderWidth, f.options.borderStyle = u.borderStyle, f.applyBorder?.());
        const T = u.xPos !== g.xPos || u.yPos !== g.yPos || Math.abs((f.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - u.yPos) > 0.5;
        if (h !== (a.skip && ce(re.card(a.skip))) && h !== (a.grip && ce(a.grip)) && T) {
          const U = a.animate && !Vn() ? 180 : 0, G = c.includes(f) ? () => {
            !y && k.get(h) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          G && U && c.length === 1 && f.resizeRotate?.disable?.(), f.position(u.xPos, u.yPos, G, void 0, U);
        }
        const N = zt(a.model, h);
        N && f.svgGroup.node.getAttribute("aria-label") !== N && f.svgGroup.node.setAttribute("aria-label", N), Le.has(h) ? f.svgGroup.node.setAttribute("data-workshop-proposed", "") : f.svgGroup.node.removeAttribute("data-workshop-proposed");
        const H = de(h);
        if (H?.kind === "column") {
          const U = he.get(H.key);
          U ? f.svgGroup.node.setAttribute("data-workshop-drop", U) : f.svgGroup.node.removeAttribute("data-workshop-drop");
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
        !f?.relationships || !g?.svgGroup || (f.relationships.addAssociation(g, on(h)), A.set(u, { parentId: h.parentId, childId: h.childId, parent: f, child: g }));
      }
      Ko(a.model);
    }), jt(a.model), e.notifyNodeChanged?.();
  }
  let Gn = null;
  function Rt(i) {
    const a = de(i);
    return a ? a.kind === "card" ? a.key : l?.cardOfPart?.(t, ke(i)) ?? null : null;
  }
  function Mt() {
    if (b) return l?.cardOfPart?.(t, b.name) ?? null;
    if (_) return _.cardId;
    if (cn) return cn;
    const i = y ? [] : e.getSelectedNodes?.() ?? [];
    return i.length === 1 && k.get(i[0].id) === i[0] ? Rt(i[0].id) : null;
  }
  let Kn = null;
  function Wt() {
    y || !p || !Gn || Mt() !== Kn && jt(Gn);
  }
  function jt(i) {
    if (p) {
      Gn = i, Kn = Mt();
      const a = t.lanes.map((w) => k.get(ce(re.column(w.id)))?.svgGroup?.node).reduce((w, u) => u && (!w || w.compareDocumentPosition(u) & 4) ? u : w, null), d = e.canvas?.viewbox?.(), c = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - X.x, y: d.y - X.y, width: d.width, height: d.height } : null;
      p.draw(t, i === t ? null : i, {
        origin: X,
        layout: $e,
        above: a,
        view: c,
        announce: (w) => e.announce?.(w),
        focus: Kn,
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
  function nn(i) {
    return { x: i.x - X.x, y: i.y - X.y };
  }
  function Fe(i) {
    return l ? l.places(i, $e) : { ...Ge(i, { layout: J }), parts: [] };
  }
  function er(i, a) {
    const d = l.places(i, $e).parts.find((c) => c.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function Ft(i, a) {
    if (!l) return Gr(i, { native: !0, origin: X, rows: a, layout: J, style: Oe }).nodes;
    const d = l.notes(i, $e, X, Oe);
    if (i.behaviour && d.length) {
      const c = d.map((f) => f.options), w = Math.min(...c.map((f) => f.xPos)), u = Math.max(...c.map((f) => f.xPos + f.width)), h = jo(i, { x: w, y: Math.max(...c.map((f) => f.yPos + f.height)) + 16, width: Math.min(u - w, 484) }, Oe);
      h && d.push(h);
    }
    return d;
  }
  function mn(i, a, d) {
    const c = l.editsBetween(t, i);
    if (!c.length) return !1;
    const w = Be(t, c);
    return "refused" in w ? (e.announce?.(w.refused.reason), B(o.onRefuse, { ...a, laneId: w.refused.laneId, reason: w.refused.reason }), !1) : (t = w.workshop, z(t, { skip: d }), e.announce?.(w.report.edits.map((u) => u.said).join(" ")), B(o.onChange, t, { ...a, edits: c }), !0);
  }
  function zt(i, a) {
    const d = de(a);
    if (d?.kind === "lane") {
      const c = i.lanes.find((w) => w.id === d.key);
      return c ? `${c.label}, ${Ae(i, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = i.cards.find((u) => u.id === d.key), w = c && i.lanes.find((u) => u.id === c.laneId);
      return c && w ? `${c.label || "Empty card"}, in ${w.label}${l?.cardKeys ? ". " + l.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? l?.label?.(i, ke(a)) ?? null : null;
  }
  function qn(i, a) {
    const d = Ft(i).find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function ze() {
    (_ || b) && e.cancelGovernedDrag?.("host"), _ = null, b = null, r && (r = null, B(o.onPreview, null)), ie(!1);
  }
  return {
    toCanvas(i) {
      if (y || C || Ze()) return "This workshop is view-only here.";
      if (!t.cards.some((w) => w.id === i)) return "That card is no longer on the board.";
      const a = xn(t, i);
      if (a) return a;
      r && Ne(), I && (ze(), I = null, z(t), e.refreshGovernance?.());
      const { width: d } = Fe(t), c = k.get(ce(re.card(i)))?.options;
      return Un(i, { x: X.x + d + 32, y: c?.y ?? X.y }), null;
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
      const { width: i, height: a } = Fe(t);
      return { x: X.x, y: X.y, width: i, height: a };
    },
    setLayout(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = Qt(i);
      l ? l.places(t, a) : Ge(t, { layout: a }), JSON.stringify(a) !== JSON.stringify(J) && (ze(), J = a, z(I ?? t));
    },
    whenDrawn: () => j,
    update(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = V(i);
      ze(), t = a;
      const d = C;
      C = P || s(t), z(I ?? t), C !== d && e.refreshGovernance?.();
    },
    preview(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = i ? V(i) : null;
      ze(), I = a, z(I ?? t), e.refreshGovernance?.();
    },
    refuse(i, a) {
      const d = t.lanes.find((c) => c.id === i);
      y || !d || (ie(!1), E = { laneId: i, reason: a, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(i) {
      P = !!i;
      const a = P || s(t);
      y || C === a || (ze(), C = a, z(I ?? t), e.refreshGovernance?.());
    },
    destroy() {
      y || (ze(), y = !0, M && clearTimeout(M.timer), e.element?.removeEventListener?.("pointerdown", It, !0), zo?.(), p && e.element?.removeEventListener?.("pointerover", vt), e.withPolicyAuthority(() => {
        for (const [i, a] of le) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(i);
        for (const [i, a] of A) a.parent.relationships?.removeAssociation(i);
        for (const [i, a] of k)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(i) === a && e.nodes.remove(i);
      }), A.clear(), le.clear(), k.clear(), v.clear(), R.clear(), D.clear(), Fo(), p?.destroy(), Pe = !1, jn(), e.notifyNodeChanged?.());
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
function Xn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function Cr(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function Qt(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function Tr(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const l of n)
    o = Math.max(o, (l.options.x ?? 0) + (l.options.width ?? 0)), t = Math.min(t, l.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const Sr = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function se(e) {
  return Sr.includes(e.kind) ? e.kind : void 0;
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
function $r(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = En(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function En(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const mt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function rt(e) {
  if (typeof e != "string" || !mt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function mo(e) {
  return e.noteId ?? e.id;
}
function wt(e) {
  const n = En(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function wo(e) {
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
const go = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Or = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function st(e) {
  const n = fe(e), o = {}, t = (s) => {
    if (typeof s != "string" || !go.test(s)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return s;
  }, l = (s, p, b) => {
    if (typeof s != "number" || !Number.isFinite(s) || s < p || s > b) throw new Error("A card size is out of range.");
    return s;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !Or.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = l(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = l(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function yo(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        st({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return st(n);
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
function Xt(e) {
  try {
    return !!On({ link: e });
  } catch {
    return !1;
  }
}
function On(e) {
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
const qe = 96, Lr = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Pr = ["solid", "dashed", "dotted"], Er = 1e7;
function Je(e) {
  const n = fe(e);
  if (typeof n.id != "string" || !Lr.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: rt(n.parentId), childId: rt(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (l, s, p) => {
    const b = n[l];
    if (b != null) {
      if (typeof b != "number" || !Number.isFinite(b) || b < s || b > p) throw new Error("A line's look is out of range.");
      o[l] = b;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !go.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Pr.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const l = fe(n.targetPoint), s = (p) => typeof p == "number" && Number.isFinite(p) && Math.abs(p) <= Er;
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
function Nr(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(Je).map((t) => ko(t, n)).filter((t) => t.targetPoint ? n.has(t.parentId) : n.has(t.parentId) || n.has(t.childId));
  if (Te(o.map((t) => t.id), "line ID"), o.length > qe) throw new Error(`A workshop holds up to ${qe} lines.`);
  return o;
}
function ko(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: o, ...t } = e;
  return t;
}
function Te(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function gt({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((l) => l.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function _r(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Ke = (e) => "lane-" + e, Se = (e) => "card-" + e, Nn = (e) => "image-" + e;
function ws(e) {
  const n = _r(e);
  return gt(e).map((o) => {
    const t = e.cards.filter((p) => p.laneId === o.id), l = n.filter((p) => p.laneId === o.id), s = [Ke(o.id)];
    return o.station?.image && s.push(Nn(o.id)), { lane: o, cards: t, signals: l, nodeIds: [...s, ...t.map((p) => Se(p.id))] };
  });
}
const bo = 5, at = 24, lt = 3;
function V(e) {
  const n = fe(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !se(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = se(n), l = t ? ye(t) : void 0, s = { id: ge }, p = we(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > bo)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const b = l?.cards ?? [at, "A workshop supports up to 24 cards."];
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
    if (l?.readLane?.(v, A, s), v.station !== void 0) {
      const R = fe(v.station), D = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= lt)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray(R.next) || R.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const _ = R.next.map(ge);
      Te(_, "onward stop"), A.station = { column: D(R.column), row: D(R.row), next: _, outcome: we(R.outcome, 160) }, R.image !== void 0 && (A.station.image = wo(R.image));
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
    const v = fe(k), A = { id: ge(v.id), label: t ? we(v.label) : $r(v.label), laneId: ge(v.laneId) };
    if (!P.includes(A.laneId)) throw new Error("Card refers to an unknown lane.");
    if (v.allowedLaneIds !== void 0) {
      if (!Array.isArray(v.allowedLaneIds) || v.allowedLaneIds.length > I.length) throw new Error("Invalid allowed lanes.");
      if (A.allowedLaneIds = v.allowedLaneIds.map(ge), Te(A.allowedLaneIds, "allowed lane"), !A.allowedLaneIds.includes(A.laneId) || !A.allowedLaneIds.every((R) => P.includes(R)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (v.look !== void 0) {
      const R = st(v.look);
      R && (A.look = R);
    }
    if (v.asNote !== void 0) {
      const R = On(v.asNote);
      R && (A.asNote = R);
    }
    if (v.noteId !== void 0 && v.noteId !== A.id && (A.noteId = rt(v.noteId)), l?.readCard(v, A, s), o) {
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
      if (!C.some((D) => D.id === A) || !P.includes(R))
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
    const k = Nr(n.lines, new Set(C.map((v) => v.id)));
    k.length && (y.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    y.presentationOrder = gt({ lanes: I, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (y.behaviour = me().validate(n.behaviour, { ...y, kind: n.kind })), o)
    return y.kind = "release-plan", nr(y), y;
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
const vo = 65536;
function gs(e) {
  const n = JSON.stringify(V(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > vo) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function ys(e) {
  if (e.length > vo) throw new Error("This workshop is too large to open from a link.");
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
function yt(e, n, o) {
  const t = se(e);
  return t ? ye(t).planMove(e, n, o) : void 0;
}
function Ln(e, n) {
  if (se(e)) return e.lanes.filter((t) => yt(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => Pn(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((l) => l.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function dt(e, n, o) {
  const t = e.cards.find((s) => s.id === n), l = yt(e, n, o);
  if (l !== void 0) {
    if (!l) throw new Error("Move is unavailable.");
    return l;
  }
  if (t && e.kind === "release-plan") {
    const s = Pn(e, t, o);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!t || !Ln(e, t).some((s) => s.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((s) => s === t ? { ...t, laneId: o } : s) };
}
function ln(e, n, o) {
  const t = Io(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in me().check(e, t) ? null : t;
}
function Io(e, n, o) {
  const t = e.cards.find((p) => p.id === n);
  if (!t || !e.lanes.some((p) => p.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return Pn(e, t, o);
  const l = yt(e, n, o);
  if (l !== void 0) return l;
  const s = Kr(e, n, o);
  return s || (o === "prototype" && Ye(e) === "customer-interviews" ? null : Ln(e, t).some((p) => p.id === o) ? dt(e, n, o) : null);
}
function eo(e, n) {
  return e.lanes.filter((o) => ln(e, n, o.id) !== null);
}
function In(e, n, o) {
  const t = Io(e, n, o);
  if (t !== null) {
    const y = t === e || !e.behaviour ? null : me().check(e, t);
    return y && "refused" in y ? y.refused.sentence : null;
  }
  const l = e.cards.find((y) => y.id === n), s = e.lanes.find((y) => y.id === o);
  if (!l || !s) return "That move is not available.";
  const p = se(e), b = p && ye(p).refusal;
  if (b) return b(e, n, o);
  const I = `This card can't go in ${s.label}.`;
  if (l.allowedLaneIds && !l.allowedLaneIds.includes(o)) return I;
  if (e.kind === "release-plan") {
    if (s.capacity === void 0) return I;
    const y = We(e, o), k = { ...e, lanes: e.lanes.map((A) => A === s ? { id: s.id, label: s.label } : A) }, v = Pn(k, l, o);
    return v ? `Needs ${We(v, o) - y} points. It already holds ${y} of ${s.capacity} points.` : I;
  }
  const P = e.lanes.find((y) => y.id === l.laneId);
  if (P?.station && !P.station.next.includes(o)) return `${s.label} can't be reached from ${P.label}.`;
  const C = e.cards.filter((y) => y.laneId === o).length;
  return s.capacity !== void 0 && C >= s.capacity ? `It already holds ${C} of ${s.capacity} ${s.capacity === 1 ? "card" : "cards"}.` : I;
}
function sn(e) {
  return (!e.kind || !!se(e)) && !e.lanes.some((n) => n.station) && !Ye(e);
}
const Rr = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function kt(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && Rr.test(n) && !o.has(n) ? n : Mn(e, "card");
}
function Ue(e, n, o) {
  const t = e.lanes.find((s) => s.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((s) => s.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Ye(e)) return "This workshop keeps the cards it came with.";
  if (se(e)) {
    if (!(typeof o?.label == "string" && En(o.label))) return "A card needs some words. Type on the note first.";
    if (Array.isArray(o.lines) ? o.lines.length : o.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const s = So(e, n, o);
    return typeof s == "string" ? s : no(e, s);
  }
  if (e.cards.length >= at) return `This board is at its size limit of ${at} cards. Remove a card to make room.`;
  const l = e.cards.filter((s) => s.laneId === n).length;
  if (t.capacity !== void 0 && l >= t.capacity) return `It already holds ${l} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const s = Co(o.lines);
    if (!s) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((b) => b.id));
    if ((e.lines?.length ?? 0) + s.filter((b) => !p.has(b.id)).length > qe)
      return `A workshop holds up to ${qe} lines.`;
  }
  return no(e, { ...e, cards: [...e.cards, { id: kt(e, o.id), label: wt(typeof o.label == "string" ? o.label : ""), laneId: n }] });
}
function no(e, n) {
  if (!e.behaviour) return null;
  const o = me().check(e, n);
  return "refused" in o ? o.refused.sentence : null;
}
function xo(e) {
  try {
    return e && typeof e == "object" ? yo(e) : void 0;
  } catch {
    return;
  }
}
function Ao(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      On({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? On(n) : void 0;
}
function Co(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let l = null;
    try {
      l = Je(t);
    } catch {
      const s = (b) => {
        const { id: I, parentId: P, childId: C, targetPoint: y } = fe(t);
        return Je({ id: I, parentId: P, childId: C, ...b ? { targetPoint: y } : {} });
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
function _n(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function He(e, n, o) {
  return e && e.map((t) => _n(t, n, o));
}
function To(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function rn(e, n, o, t) {
  if (Ue(e, n, o) !== null) return null;
  if (se(e)) {
    const v = So(e, n, o), A = v.cards[v.cards.length - 1], R = t === void 0 ? -1 : e.cards.findIndex((D) => D.id === t && D.laneId === n);
    return R < 0 ? v : { ...v, cards: [...e.cards.slice(0, R), A, ...e.cards.slice(R)] };
  }
  const l = xo(o.look), s = typeof o.label == "string" ? En(o.label) : "";
  let p = Ao(o.asNote);
  s.length > 80 && p?.text === void 0 && s.length <= 4e3 && (p = { ...p, text: s });
  const b = kt(e, o.id), I = b !== o.id && typeof o.id == "string" && mt.test(o.id) ? o.id : void 0, P = {
    id: b,
    label: wt(s),
    laneId: n,
    ...l ? { look: l } : {},
    ...p ? { asNote: p } : {},
    ...I ? { noteId: I } : {}
  }, C = t === void 0 ? -1 : e.cards.findIndex((v) => v.id === t && v.laneId === n), y = C < 0 ? [...e.cards, P] : [...e.cards.slice(0, C), P, ...e.cards.slice(C)], k = o.lines === void 0 ? void 0 : To(e, Co(o.lines).map((v) => _n(v, o.id, P.id)));
  return V({ ...e, cards: y, ...k ? { lines: k } : {} });
}
function So(e, n, o) {
  const t = ye(se(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const l = Be(e, [{ kind: "add_card", lane: { id: n }, ...t, ...o.under && { under: { id: o.under } } }]);
  if ("refused" in l) return l.refused.reason;
  const s = l.workshop.cards, p = kt(e, o.id), b = p !== o.id && typeof o.id == "string" && mt.test(o.id) ? o.id : void 0, I = xo(o.look), P = Ao(o.asNote);
  return s[s.length - 1] = {
    ...s[s.length - 1],
    id: p,
    ...b ? { noteId: b } : {},
    ...I ? { look: I } : {},
    ...P ? { asNote: P } : {}
  }, l.workshop;
}
function $o(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = se(e);
  return o ? ye(o).cardText(e, n) : n.label;
}
function Mr(e, n) {
  const o = se(e);
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
    const t = o.allowedLaneIds.map((s) => e.lanes.find((p) => p.id === s).label), l = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${l}, so it stays a card.`;
  }
  return null;
}
function to(e, n, o = Oo(e, n)) {
  if (xn(e, n) !== null) return null;
  const t = e.cards.filter((s) => s.id !== n).map((s) => {
    if (!s.dependsOn?.includes(n)) return s;
    const p = { ...s, dependsOn: s.dependsOn.filter((b) => b !== n) };
    return p.dependsOn.length || delete p.dependsOn, p;
  }), l = e.lines?.map((s) => _n(s, n, o));
  return V({ ...e, cards: t, ...l ? { lines: l } : {} });
}
function Wr(e, n, o = Oo(e, n)) {
  const t = new Set(e.cards.filter((p) => p.id !== n).map((p) => p.id)), l = (e.lines ?? []).filter((p) => p.parentId === n || p.childId === n).map((p) => _n(p, n, o)), s = (p) => t.has(p.parentId) || t.has(p.childId);
  return { stay: l.filter(s), leave: l.filter((p) => !s(p)) };
}
function Oo(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? mo(o) : n;
}
function oo(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function dn(e, n) {
  if (e.kind) return jr;
  let o;
  try {
    o = Je(n);
  } catch (s) {
    return s instanceof Error ? s.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((s) => s.id));
  return o = ko(o, t), (o.targetPoint ? !t.has(o.parentId) : !t.has(o.parentId) && !t.has(o.childId)) ? "That card is no longer on the board." : e.lanes.some((s) => s.id === o.parentId || s.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((s) => s.id === o.id) && (e.lines?.length ?? 0) >= qe ? `A workshop holds up to ${qe} lines.` : null;
}
const jr = "Lines join the cards of a lane workshop to notes and to each other.";
function An(e, n) {
  return dn(e, n) !== null ? null : V({ ...e, lines: To(e, [Je(n)]) });
}
function ro(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? V({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function Lo(e, n, o, t = {}) {
  const l = new Set((e.lines ?? []).map((p) => p.id));
  let s = `${n}->${o}`;
  for (let p = 2; l.has(s); p++) s = `${n}->${o}~${p}`;
  return Je({ showChildArrow: !0, ...t, id: s, parentId: n, childId: o });
}
function Fr(e, n) {
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
  const t = se(e);
  if (t) return ye(t).caption(e, n);
  const l = qr(e, n);
  if (l) return "$" + l.amount + " · " + l.description;
  const s = e.cards.filter((b) => b.laneId === n).length, p = e.behaviour ? me().laneLimit(e, n) : o.capacity;
  return p !== void 0 ? s + " of " + p : s + (s === 1 ? " card" : " cards");
}
const Rn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Cn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Po(e, n = Rn, o = 28, t) {
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
function ks() {
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
function Eo(e) {
  const n = V(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function zr(e, n) {
  const o = Eo(e), t = Mn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), V(o);
}
function Dr(e, n, o) {
  const t = Eo(e);
  return t.cards.push({
    id: Mn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), V(t);
}
function bs() {
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
function so(e, n, o) {
  const t = V(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const l = t.lanes.find((C) => C.id === n);
  if (!l?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= bo) throw new Error("A map can have up to five stations.");
  const s = we(o?.label), p = we(o?.outcome, 160), b = Mn(t, "station");
  let I, P = 1 / 0;
  for (let C = 0; C < lt; C++)
    for (let y = 0; y < lt; y++) {
      if (t.lanes.some((v) => v.station.column === y && v.station.row === C)) continue;
      const k = Math.abs(l.station.column - y) + Math.abs(l.station.row - C);
      k < P && (P = k, I = { column: y, row: C });
    }
  if (!I) throw new Error("There is no free station position.");
  return l.station.next.push(b), t.lanes.push({ id: b, label: s, station: { ...I, next: [], outcome: p, ...o.image === void 0 ? {} : { image: wo(o.image) } } }), t.presentationOrder?.push(b), t;
}
const vs = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, No = (e) => "caption-" + e, an = (e) => "column-" + e, Hr = "rules-board", re = { lane: Ke, card: Se, image: Nn, caption: No, column: an, rules: Hr };
function _o(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function et(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), l = e, s = n;
  return t ? `M ${t} 0 H ${l - t} Q ${l} 0 ${l} ${t} V ${s - t} Q ${l} ${s} ${l - t} ${s} H ${t} Q 0 ${s} 0 ${s - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${l} V ${s} H 0 Z`;
}
function io(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ao(e, n, o, t) {
  for (let l = n; l > 11; l--) {
    const s = Math.max(1, Math.floor(o / (l * 0.55)));
    if (e.split(`
`).reduce((b, I) => b + Math.max(1, Math.ceil(I.length / s)), 0) * l * 1.3 <= t) return l;
  }
  return Math.min(n, 11);
}
const Ro = 152, ct = Ro + 12, Br = 12;
function Mo(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function Ge(e, n = {}) {
  const o = V(e), { pitch: t, row: l, top: s } = Rn, p = o.lanes.map((k) => o.cards.filter((v) => v.laneId === k.id).length), b = (k) => Math.max(p[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), I = !!o.lanes[0].station, P = o.lanes.some((k) => k.station?.image), C = Mo(n.layout, o.lanes.length), y = [];
  if (I) {
    const { points: k } = Po(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((v, A) => y.push({
      laneId: v.id,
      x: k[A].x,
      y: k[A].y + (P ? v.station.row * ct : 0),
      width: t,
      height: s + (v.station.image ? ct : 0) + Math.max(1, b(A)) * l,
      column: v.station.column,
      row: v.station.row
    }));
  } else {
    let k = Wo(o, C)?.below ?? 0;
    for (let v = 0; v < o.lanes.length; v += C) {
      const A = o.lanes.slice(v, v + C), R = s + (Math.max(...A.map((D, _) => b(v + _))) + 1) * l;
      A.forEach((D, _) => y.push({ laneId: D.id, x: _ * t, y: k, width: t, height: R, column: _, row: v / C })), k += R + Br;
    }
  }
  return { places: y, width: Math.max(...y.map((k) => k.x + k.width)), height: Math.max(...y.map((k) => k.y + k.height)) };
}
function Wo(e, n, o = 2, t = 0) {
  const l = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? me().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return l ? { note: l, below: l.options.height + 16 } : null;
}
function Ur(e, n) {
  const { pitch: o, width: t, row: l, height: s, top: p } = Rn, b = n.origin ?? { x: 0, y: 0 }, I = !!e.lanes[0].station, { places: P } = Ge(e, n), C = n.style ?? {}, y = C.textColor ?? tn.fontColor, k = C.borderColor ?? tn.borderColor, v = C.borderWidth ?? tn.borderWidth, A = C.cornerRadius ?? 0, R = C.fontSize ?? tn.fontSize, D = C.laneFontSize ?? R + 2, _ = C.captionFontSize ?? Math.max(11, R - 1), r = [], m = ($) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: et($.width, $.height, A),
      foregroundColor: y,
      borderColor: k,
      borderWidth: v,
      ...C.fontFamily ? { fontFamily: C.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return r.push(E), E;
  };
  e.lanes.forEach(($, E) => {
    const M = P[E], q = b.x + M.x, j = b.y + M.y, Z = $.station?.image;
    m({
      id: an($.id),
      text: "",
      name: $.label,
      xPos: q + 2,
      yPos: j,
      width: o - 4,
      height: M.height,
      vectorPath: et(o - 4, M.height, A ? A + 2 : 0),
      backgroundColor: I ? "#fcf9ed" : io(Cn[E], 0.6),
      borderColor: I ? "#a8b5aa" : io(Cn[E], 0.1),
      borderWidth: 1,
      ...I ? { borderStyle: "dashed" } : {}
    }), m({
      id: Ke($.id),
      text: $.label,
      name: $.label,
      xPos: q + 8,
      yPos: j + 6,
      width: t,
      height: 58,
      backgroundColor: Cn[E],
      fontSize: ao($.label, D, t - 16, 50)
    }), m({
      id: No($.id),
      text: Ae(e, $.id),
      name: $.label,
      xPos: q + 8,
      yPos: j + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: _
    }), Z && r.push({ options: {
      id: Nn($.id),
      name: Z.alt,
      text: "",
      xPos: q + 8,
      yPos: j + p,
      width: t,
      height: Ro,
      shapeHint: "rectangle",
      image: Z.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((J) => J.laneId === $.id).forEach((J, $e) => {
      const Oe = $o(e, J), he = I ? t - 20 : t, Le = I ? s - 6 : s, pe = I ? {} : { ...C.card, ...J.look }, Pe = I ? A : C.card?.cornerRadius ?? A;
      m({
        id: Se(J.id),
        text: Oe,
        name: J.label,
        xPos: q + (I ? 18 : 8),
        yPos: j + p + (Z ? ct : 0) + $e * l,
        width: he,
        height: Le,
        ...Pe !== A ? { vectorPath: et(he, Le, Pe) } : {},
        backgroundColor: I ? "#ffda75" : pe.backgroundColor ?? C.backgroundColor ?? tn.backgroundColor,
        ...pe.textColor ? { foregroundColor: pe.textColor } : {},
        ...pe.fontFamily ? { fontFamily: pe.fontFamily } : {},
        ...pe.borderColor ? { borderColor: pe.borderColor } : {},
        ...pe.borderWidth !== void 0 ? { borderWidth: pe.borderWidth } : {},
        fontSize: ao(Oe, pe.fontSize ?? R, he - 16, Le - 8)
      });
    });
  });
  const x = Wo(e, Mo(n.layout, e.lanes.length), b.x + 2, b.y)?.note ?? jo(e, {
    x: b.x,
    y: b.y + Math.max(...P.map(($) => $.y + $.height)) + 16,
    width: Math.min(Math.max(...P.map(($) => $.x + $.width)), o * 2) - 4
  }, C);
  x && r.push(x);
  const S = new Map(r.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (S.get(an($.id)).relationships.associations = $.station.next.map((E) => ({
      id: $.id + "-to-" + E,
      parentId: an($.id),
      childId: an(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const E of $.dependsOn ?? []) {
        const M = Se(E), q = Se($.id);
        S.get(M).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${$.id}`,
          parentId: M,
          childId: q,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const $ = new Set(n.beside), E = new Set(r.map((j) => j.options.id)), M = /* @__PURE__ */ new Map();
    for (const j of [...E]) {
      if (!$.has(j)) continue;
      const Z = _o(j, (J) => $.has(J) || E.has(J));
      E.add(Z), M.set(j, Z);
    }
    const q = (j) => M.get(j) ?? j;
    for (const j of r) {
      j.options.id = q(j.options.id);
      for (const Z of j.relationships.associations)
        Z.parentId = q(Z.parentId), Z.childId = q(Z.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
function jo(e, n, o = {}) {
  return e.behaviour ? me().note(e, n, o) : null;
}
function Gr(e, n) {
  const o = V(e);
  if (n?.native) return Ur(o, n);
  const { width: t, row: l, height: s, top: p } = Rn, b = [];
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
  const { points: P } = Po(o), C = 152, y = C + 12, k = o.lanes.some((v) => v.station?.image);
  o.lanes.forEach((v, A) => {
    const R = P[A].x, D = P[A].y + (k ? (v.station?.row ?? 0) * y : 0), _ = v.station?.image, r = o.kind === "release-plan" ? v.label + `
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
    }, relationships: { associations: [] } }), o.cards.filter((m) => m.laneId === v.id).forEach((m, x) => I(Se(m.id), $o(o, m), R, D + p + (_ ? y : 0) + x * l, s, "#fffdf6"));
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
const Is = {
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
}, ut = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], bt = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function xs() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: ut.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: ut.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function As() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...bt.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Ye(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...bt.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => ut.some((l) => l.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Kr(e, n, o) {
  const t = Ye(e), l = e.cards.find((p) => p.id === n);
  if (!t || !l || l.laneId === o) return null;
  let s = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const p = e.cards.find((b) => b.laneId === o);
    if (p) {
      if (!Ln(e, p).some((b) => b.id === "interviews")) return null;
      s = dt(e, p.id, "interviews");
    }
  }
  return Ln(s, l).some((p) => p.id === o) ? dt(s, n, o) : null;
}
function qr(e, n) {
  if (Ye(e) !== "experiment-budget") return null;
  const o = bt.find((s) => s.id === n), t = e.cards.filter((s) => s.laneId === n).length, l = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? l + " " + (l === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  tn as DEFAULT_NOTE_STYLE,
  co as WORKSHOP_BOARD_KINDS,
  vn as WorkshopReferenceError,
  so as addWorkshopBranch,
  Dr as addWorkshopCard,
  zr as addWorkshopLane,
  Be as applyWorkshopEdits,
  ms as attachWorkshop,
  Ln as availableLanes,
  jo as behaviourNote,
  Sr as businessBoardKinds,
  se as businessKind,
  wr as canHangPanel,
  bt as channels,
  mr as checkWorkshopReplacement,
  rr as countWord,
  As as createBudgetWorkshop,
  xs as createInterviewWorkshop,
  ks as createLaneWorkshop,
  bs as createWorkshopMap,
  ys as decodeWorkshopFragment,
  ps as describeFocusDarkroom,
  ls as describeWorkshopEdits,
  gs as encodeWorkshopFragment,
  Xr as handoffSummary,
  us as hangGalleryPanel,
  Is as industrialWorkshop,
  hs as initialFocusDarkroom,
  ut as interviews,
  ar as isRuleEdit,
  Cn as laneColors,
  Me as listed,
  gn as listeningRoom,
  ns as listeningRoomCaption,
  at as maxWorkshopCards,
  qe as maxWorkshopLines,
  ds as moonGallery,
  dt as moveWorkshopCard,
  as as named,
  vs as nightTransfer,
  fs as normalizeFocusDarkroom,
  es as normalizeListeningRoom,
  cs as normalizeMoonGallery,
  Zr as normalizeOfflineHandoff,
  Yr as offlineHandoff,
  Kr as planStartupMove,
  sr as pointing,
  ho as printFields,
  ss as registerRulebook,
  os as registerWorkshopRules,
  We as releaseLoad,
  ts as releasePlan,
  Qr as resolveHandoff,
  _r as resolveWorkshopSignals,
  Vr as reviewHandoff,
  et as roundedBox,
  me as rulebook,
  is as rulebookLoaded,
  O as said,
  Ye as startupExperienceKind,
  ht as unquoted,
  V as validateWorkshop,
  Sn as workshopBoardKind,
  qr as workshopBudgetResult,
  ln as workshopCandidate,
  to as workshopCardAsNote,
  xn as workshopCardAsNoteRefusal,
  wt as workshopCardLabelOf,
  Wr as workshopCardLines,
  yo as workshopCardLookOf,
  Mr as workshopCardNoteText,
  $o as workshopCardText,
  eo as workshopDestinations,
  ot as workshopEditKinds,
  nt as workshopFinder,
  Xt as workshopKeepsLink,
  it as workshopKeepsPicture,
  Ae as workshopLaneCaption,
  Ge as workshopLanePlaces,
  Rn as workshopLayout,
  dn as workshopLineRefusal,
  oo as workshopLinesOf,
  jr as workshopLinesSentence,
  Lo as workshopNewLine,
  re as workshopNodeIds,
  rn as workshopNoteCandidate,
  mo as workshopNoteIdOf,
  Ue as workshopNoteRefusal,
  Po as workshopPositions,
  gt as workshopPresentationLanes,
  ws as workshopPresentationScenes,
  cr as workshopReferences,
  In as workshopRefusal,
  He as workshopRenamedLines,
  qt as workshopRuleSchema,
  ye as workshopRules,
  rs as workshopRulesLoaded,
  _o as workshopStandInId,
  sn as workshopTakesNotes,
  Gr as workshopToSlate,
  An as workshopWithLine,
  Fr as workshopWithoutCardLines,
  ro as workshopWithoutLine
};
