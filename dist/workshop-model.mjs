import { D as ze } from "./NoteDefaults-1xFW0br8.mjs";
const So = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function To(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: a, fieldNote: d, deskNote: m, fallback: I } = e, C = (T) => typeof T == "string" && T.trim().length > 0 && T.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(T);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? a !== "field" && a !== "desk" : a !== null) || a === void 0 || !C(d) || !C(m) || !C(I) ? null : { kind: n, version: o, stage: t, choice: a, fieldNote: d.trim(), deskNote: m.trim(), fallback: I.trim() };
}
function Ao(e) {
  return { ...e, stage: "review", choice: null };
}
function Oo(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function $o(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Ve = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Po(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: a, rightLabel: d } = e, m = (I) => typeof I == "string" && I.trim().length > 0 && I.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(I);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !m(a) || !m(d) ? null : { kind: n, version: o, mix: t, leftLabel: a.trim(), rightLabel: d.trim() };
}
function Lo({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === Ve.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === Ve.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === Ve.leftLabel && o === Ve.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function Te(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function Mt(e) {
  const n = new Map(e.cards.map((m) => [m.id, m])), o = new Map(e.lanes.map((m, I) => [m.id, I])), t = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  function d(m) {
    if (!t.has(m.id)) {
      if (a.has(m.id)) throw new Error("Release dependencies must be acyclic.");
      a.add(m.id);
      for (const I of m.dependsOn ?? []) {
        const C = n.get(I);
        if (!C) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(C.laneId) > o.get(m.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        d(C);
      }
      a.delete(m.id), t.add(m.id);
    }
  }
  for (const m of e.cards) d(m);
  for (const m of e.lanes) {
    if (m.station) throw new Error("Release windows cannot also be map stations.");
    if (Te(e, m.id) > (m.capacity ?? 1 / 0)) throw new Error(`Release "${m.label}" exceeds its point budget.`);
  }
}
function ln(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((w, g) => [w.id, g])), a = t.get(o);
  if (a === void 0) return null;
  const d = a < t.get(n.laneId), m = /* @__PURE__ */ new Set([n.id]), I = [n];
  for (; I.length; ) {
    const w = I.pop();
    for (const g of e.cards) {
      if (m.has(g.id)) continue;
      const y = t.get(g.laneId);
      (d ? y > a && w.dependsOn?.includes(g.id) : y < a && g.dependsOn?.includes(w.id)) && (m.add(g.id), I.push(g));
    }
  }
  if (e.cards.filter((w) => m.has(w.id)).some((w) => w.allowedLaneIds && !w.allowedLaneIds.includes(o))) return null;
  const T = { ...e, cards: e.cards.map((w) => m.has(w.id) ? { ...w, laneId: o } : w) }, k = e.lanes[a].capacity;
  return k !== void 0 && Te(T, o) > k ? null : T;
}
const Eo = {
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
}, Ln = /* @__PURE__ */ new Map(), Wt = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget" };
function No(e) {
  Ln.set(e.kind, e);
}
function _o(e) {
  return typeof e == "string" && Ln.has(e);
}
function we(e) {
  const n = Ln.get(e);
  if (!n) throw new Error(`The ${Wt[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Se = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Yn = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), En = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Nn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Ro = (e) => En(Nn(e)), Ft = [
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
], zt = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Ft.indexOf(e.toLowerCase()), jt = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function dt(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (a) => {
    const d = En(a);
    d && o.add(d);
  };
  t(e), t(Nn(e));
  for (const a of [...o]) t(a.replace(/^(?:the|my|our)\s+/i, ""));
  for (const a of [...o]) t(a.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const a of [...o]) t(a.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const yn = "[^\\p{L}\\p{N}]", Vn = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Yn(n) + "(?:$|" + yn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + yn + ")" + Yn(n) + "(?:$|" + yn + ")", "u").test(e)
], Zn = ["first", "second", "third", "fourth", "fifth"];
function Ht(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Zn.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(En(Nn(n)));
  if (!t) return null;
  const a = (t[1] ?? t[2]).toLowerCase(), d = a === "last" ? e.length - 1 : t[1] ? Zn.indexOf(a) : zt(a) - 1;
  return e[d] ?? null;
}
function bn(e, n, o, t, a) {
  const d = dt(n, o);
  if (d.some((I) => jt.test(I))) {
    const I = t && e.find((C) => C.id === t);
    return I ? { item: I, rank: 0 } : { pointing: !0 };
  }
  for (const I of d) {
    if (!I.startsWith("@")) continue;
    const C = e.find((T) => T.id === I.slice(1));
    if (C) return { item: C, rank: 0 };
  }
  for (const [I, C] of Vn.entries())
    for (const T of d) {
      const k = e.filter((w) => C(w.label.toLowerCase(), T.toLowerCase()));
      if (k.length === 1) return { item: k[0], rank: I };
      if (k.length > 1) return { several: k };
    }
  const m = a ? Ht(e, n, o) : null;
  return m ? { item: m, rank: Vn.length } : {};
}
class Xe extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function Sn(e, n, o, t, a = !1) {
  return { find: (C) => {
    const T = bn(e, C, n, t, a);
    if (T.item) return T.item;
    const k = dt(C, n), w = k[k.length - 1];
    if (T.pointing) throw new Xe("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (T.several) {
      const y = [...new Set(T.several.map(($) => $.label))];
      throw new Xe(y.length === 1 ? T.several.length + " " + o + "s are called " + P(y[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + P(w) + ": " + Se(y.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", T.several.map(($) => $.id));
    }
    const g = e.map((y) => y.label);
    throw new Xe("There is no " + o + " called " + P(w) + " here." + (g.length && g.length <= 6 ? " The " + o + "s are " + Se(g.map(P)) + "." : g.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((y) => y.id));
  }, attempt: (C) => bn(e, C, n, t, a).item ?? null, rank: (C) => bn(e, C, n, t, a).rank ?? 1 / 0 };
}
const Bt = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget"], he = [...Bt], Le = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], ct = ["launch-plan", "pipeline", "budget"];
function rn(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ee(e);
  return n || (e.kind === "release-plan" ? "release-plan" : Me(e) ?? "lanes");
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
  launchLanes: "A launch plan keeps the teams it came with. You can rename them and move tasks between them.",
  pipelineLanes: "A pipeline keeps the stages it came with. You can rename them and set how many deals a stage holds.",
  budgetLanes: "A budget keeps the teams it came with. Move money between them instead.",
  notTasks: "Only a launch plan's tasks take days and wait on each other.",
  notAmounts: "Only a pipeline's deals and a budget's line items carry an amount.",
  notTarget: "Only a pipeline has a forecast target.",
  notBudget: "Only a budget moves money between teams.",
  businessCards: "Cards on this board go where its rules let them."
}, Tn = { "launch-plan": W.launchLanes, pipeline: W.pipelineLanes, budget: W.budgetLanes }, le = (e, n) => Object.fromEntries(he.filter((o) => !e.includes(o)).map((o) => [o, n])), re = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), q = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), te = (e) => ({ type: "ref", of: "card", about: e }), vn = (e) => ({ map: e }), ue = le(["map"], W.notMap), fe = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), _n = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: re(120, "The new name, 1 to 120 characters of plain text.") },
    boards: he,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: q("The lane or step."), label: re(80, "The new name, 1 to 80 characters of plain text.") },
    boards: he,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: te("The card or token."), label: re(80, "The new name, 1 to 80 characters of plain text.") },
    boards: he,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: re(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...Tn }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: q("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...Tn }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: q("The lane or step it starts in."),
      label: re(80, "What the card says. On a map it may be left out: the token is numbered.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: fe("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: fe("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: fe("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...ct],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: te("The card or token.") },
    boards: he,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: te("The card or token."), lane: q("Where it goes.") },
    boards: he,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: te("The token.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: q("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: he.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": W.launchLanes, budget: W.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: te("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: Le,
    refusals: { ...vn(W.mapCardLanes), ...le([...Le, "map"], W.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: te("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...le(["release-plan"], W.notPoints), map: W.mapPoints }
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
    refusals: { ...le(["release-plan"], W.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: te("The card."),
      lane: q("The lane."),
      whenPresent: re(160, "What it says when the card is there."),
      whenAbsent: re(160, "What it says otherwise."),
      label: re(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: Le,
    refusals: { ...vn(W.mapOutcome), ...le([...Le, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: te("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: Le,
    refusals: { ...vn(W.mapOutcome), ...le([...Le, "map"], W.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: he,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: q("The lane or step."), before: q("Present it just before this one.", !0), after: q("Present it just after this one.", !0) },
    boards: he,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: q("The step it follows."), label: re(80, "The new step’s name."), outcome: re(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: q("The step it goes in front of."),
      from: q("Only the path from this step is taken over.", !0),
      label: re(80, "The new step’s name."),
      outcome: re(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: q("Where the path starts."), to: q("Where it leads.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: q("Where the path starts."), to: q("Where it leads.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: q("The step."), outcome: re(160, "What it says.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: q("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: q("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: q("The step."), alt: re(240, "What the picture shows.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: te("The task."), duration: fe("Its days, 1 to 60.", 60, 1, !0), lag: fe("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: te("The task that waits."), waitsOn: te("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: te("The task that waits."), waitsOn: te("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: fe("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: te("The deal or line item."), amount: fe("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: le(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: fe("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: le(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: q("The team giving."), to: q("The team receiving."), amount: fe("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: le(["budget"], W.notBudget)
  }
], Dt = new Map(_n.map((e) => [e.kind, e])), Gt = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function Ut(e, n) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, t = (a, d) => d ? { anyOf: [a, { type: "null" }] } : a;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...t({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...t({ type: "integer", minimum: e.min, maximum: Gt(e.max, n) }, e.nullable), description: e.about };
    case "image":
      return { ...t({
        type: "object",
        additionalProperties: !1,
        required: ["src", "alt"],
        properties: { src: { type: "string", minLength: 1, maxLength: 2048 }, alt: { type: "string", minLength: 1, maxLength: 240 } }
      }, !0), description: e.about };
    case "choice":
      return { enum: e.values, description: e.about };
  }
}
const ut = (e) => "optional" in e && e.optional === !0;
function Mo(e) {
  const n = e ? rn(J(e)) : void 0;
  return _n.map((o) => {
    const t = Object.entries(o.fields), a = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, m]) => !ut(m)).map(([m]) => m)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([m, I]) => [m, Ut(I, n)])) }
    }, d = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: a };
    return n && (d.accepted = o.boards.includes(n), d.accepted || (d.refusal = o.refusals[n])), d;
  });
}
const Ze = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function Kt(e, n) {
  const o = !!e.lanes[0]?.station, t = Sn(e.lanes, o ? Ze.step : Ze.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), a = Sn(e.cards, o ? Ze.token : Ze.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: a };
  const d = (m) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(m.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (m) => d(m) ?? a.find(m),
    attempt: (m) => d(m) ?? a.attempt(m),
    rank: (m) => d(m) ? 0 : a.rank(m)
  } };
}
class R {
  constructor(n, o, t = null, a, d, m) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = a, this.candidates = d, this.limits = m;
  }
}
function an(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function D(e, n, o = null, t) {
  try {
    return J(e);
  } catch (a) {
    throw new R(an(a instanceof Error ? a.message : String(a), n), "refused", o, t);
  }
}
function qt(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, a] of Object.entries(n.fields)) {
    const d = e[t];
    if (d === void 0) {
      if (ut(a)) continue;
      return n.kind + " needs " + t + ".";
    }
    const m = n.kind + " needs " + t + " as ";
    switch (a.type) {
      case "text":
        if (typeof d != "string") return m + "text.";
        break;
      case "ref":
        if (!o(d)) return m + "an id or a name.";
        break;
      case "refs":
        if (d === null && a.nullable) break;
        if (!Array.isArray(d) || d.length > a.max || !d.every(o)) return m + "a list of up to " + a.max + " ids or names" + (a.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (d === null && a.nullable) break;
        if (typeof d != "number" || !Number.isFinite(d)) return m + "a number" + (a.nullable ? " or null." : ".");
        break;
      case "image":
        if (d === null) break;
        if (!d || typeof d != "object" || typeof d.src != "string" || typeof d.alt != "string" || Object.keys(d).some((I) => I !== "src" && I !== "alt")) return m + "{src, alt} or null.";
        break;
      case "choice":
        if (!a.values.includes(d)) return m + a.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function Jt(e, n, o, t) {
  const a = structuredClone(e), d = o === "map", m = o === "release-plan", I = Kt(a, t), C = { lane: d ? "step" : "lane", card: d ? "token" : "card" };
  function T(r, h, b, S, A = null) {
    if (typeof b == "object") {
      const N = r.find((U) => U.id === b.id);
      if (!N) throw new R("That " + S + " is no longer on the workshop.", "gone", A);
      return N;
    }
    const E = r.find((N) => N.id === b);
    if (E) return E;
    try {
      return h.find(b);
    } catch (N) {
      if (!(N instanceof Xe)) throw N;
      const U = N.reason === "ambiguous" ? "ambiguous_reference" : N.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new R(N.message, U, A, void 0, N.candidates.length ? N.candidates : void 0);
    }
  }
  const k = (r, h = null) => T(a.lanes, I.lanes, r, "lane", h), w = (r, h = null) => T(a.cards, I.cards, r, "card", h), g = (r) => {
    try {
      return k(r);
    } catch {
      return null;
    }
  }, y = (r, h, b = {}, S = !0) => ({ board: r, said: h, changed: S, ...b }), $ = (r) => a.cards.filter((h) => h.laneId === r).length, _ = (r) => d ? "The presentation opens with " + P(r[0].label) + "." : "The presentation now runs " + r.map((h) => P(h.label)).join(", then ") + ".";
  if (ct.includes(o)) {
    n.kind === "add_card" && Qn(n, o, k(n.lane).id);
    const r = {
      card: (b) => w(b),
      lane: (b) => k(b),
      refuse: (b, S = {}) => {
        throw new R(b, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (b, S = null, A) => D(b, o, S, A),
      done: (b, S, A) => y(b, S, A)
    }, h = we(o).edit(a, n, r);
    if (h) return h;
  }
  switch (n.kind) {
    case "rename_workshop": {
      a.title = n.title;
      const r = D(a, o);
      return y(r, "Renamed the " + (d ? "map" : "workshop") + " to " + P(r.title) + ".");
    }
    case "rename_lane": {
      const r = k(n.lane), h = r.label;
      r.label = n.label;
      const b = D(a, o, r.id);
      return y(b, "Renamed " + P(h) + " to " + P(b.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = w(n.card), h = r.label;
      r.label = n.label;
      const b = D(a, o, r.laneId, r.id);
      return y(b, "Renamed " + P(h) + " to " + P(b.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new R("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new R("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = wo(a, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (b) {
        throw new R(an(b.message, o), "refused");
      }
      const h = r.lanes[r.lanes.length - 1];
      return y(r, "Added the lane " + P(h.label) + ".", { laneId: h.id });
    }
    case "remove_lane": {
      const r = k(n.lane), h = a.cards.filter((b) => b.laneId === r.id);
      if (d) {
        if (h.length) throw new R(P(h[0].label) + " is at " + P(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new R("A map needs at least two steps.", "refused", r.id);
      } else {
        if (h.length) throw new R(P(r.label) + " holds " + h.length + (h.length === 1 ? " card" : " cards") + ". Move or remove " + (h.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new R("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((b) => b !== r);
      for (const b of a.lanes) b.station && (b.station.next = b.station.next.filter((S) => S !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((b) => b !== r.id));
      for (const b of a.cards) b.allowedLaneIds && (b.allowedLaneIds = b.allowedLaneIds.filter((S) => S !== r.id));
      return Qe(a, (b) => b.laneId === r.id), y(D(a, o), "Removed the " + C.lane + " " + P(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = k(n.lane);
      if (d) {
        if (n.allowedLanes !== void 0) throw new R(W.mapCardLanes, "not_on_this_board", r.id);
        let A = n.label;
        if (A === void 0) {
          let M = a.cards.length + 1;
          for (; a.cards.some((Y) => Y.label === "Token " + M); ) M++;
          A = "Token " + M;
        }
        const E = new Set([...a.lanes, ...a.cards].map((M) => M.id));
        let N = 1;
        for (; E.has("token-" + N); ) N++;
        a.cards.push({ id: "token-" + N, label: A, laneId: r.id });
        const U = D(a, o, r.id);
        return y(U, "Added " + P(U.cards[U.cards.length - 1].label) + " at " + P(r.label) + ".", { laneId: r.id, cardId: "token-" + N });
      }
      if (Qn(n, o, r.id), n.label === void 0 || !n.label.trim()) throw new R("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new R("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && $(r.id) >= r.capacity)
        throw new R(P(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const h = n.allowedLanes && [...new Set(n.allowedLanes.map((A) => k(A).id))];
      let b;
      try {
        b = go(a, r.id, { label: n.label, ...h && { allowedLaneIds: h } });
      } catch (A) {
        throw new R(an(A.message, o), "refused", r.id);
      }
      const S = b.cards[b.cards.length - 1];
      return y(b, "Added " + P(S.label) + " to " + P(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = w(n.card);
      if (d && a.cards.length === 1) throw new R("A map needs at least one token.", "refused", r.laneId, r.id);
      if (m && a.cards.length === 1) throw new R("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && a.cards.length === 1) throw new R("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((h) => h !== r);
      for (const h of a.cards)
        h.dependsOn?.includes(r.id) && (h.dependsOn = h.dependsOn.filter((b) => b !== r.id), h.dependsOn.length || delete h.dependsOn);
      return Qe(a, (h) => h.cardId === r.id), y(D(a, o, r.laneId), "Removed the " + C.card + " " + P(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? a.lanes.find((S) => S.id === n.lane.id) ?? null : g(n.lane), h = w(n.card, r?.id ?? null), b = k(n.lane, h.laneId);
      return B(h, b);
    }
    case "advance_card": {
      const r = w(n.card), h = a.lanes.find((S) => S.id === r.laneId), b = h.station.next.map((S) => a.lanes.find((A) => A.id === S)).filter((S) => !!S);
      if (!b.length) throw new R(P(r.label) + " is at " + P(h.label) + ", and no path leads on from there.", "refused", h.id, r.id);
      if (b.length > 1)
        throw new R("From " + P(h.label) + " the path goes to " + b.map((S) => P(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + b[0].label + "”.", "refused", h.id, r.id);
      return B(r, b[0]);
    }
    case "set_lane_capacity": {
      const r = k(n.lane), h = d ? "token" : m ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, y(D(a, o, r.id), d ? "Removed the limit at " + P(r.label) + "." : P(r.label) + " now holds any number of " + h + "s.", { laneId: r.id });
      const b = m ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > b)
        throw new R((d ? "A step" : "A lane") + " can hold from 1 to " + b + " " + h + "s.", "refused", r.id);
      const S = m ? a.cards.reduce((A, E) => A + (E.laneId === r.id ? E.points ?? 1 : 0), 0) : $(r.id);
      if (S > n.capacity)
        throw new R(P(r.label) + " already holds " + S + " " + h + (S === 1 ? "" : "s") + ". Move some " + (d ? "on" : "out") + " first, or choose a higher " + (m ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, y(D(a, o, r.id), P(r.label) + " now holds up to " + n.capacity + " " + h + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = w(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, y(D(a, o, r.laneId, r.id), P(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const h = [...new Set(n.lanes.map((S) => k(S)))], b = a.lanes.find((S) => S.id === r.laneId);
      if (!h.includes(b)) throw new R(P(r.label) + " is in " + P(b.label) + " now. Include " + P(b.label) + ", or move the card first.", "refused", b.id, r.id);
      return r.allowedLaneIds = h.map((S) => S.id), y(D(a, o, r.laneId, r.id), P(r.label) + " can now go only in " + Se(h.map((S) => P(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = w(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new R("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, y(D(a, o, r.laneId, r.id), P(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = w(n.card), h = [...new Set(n.dependsOn.map((S) => w(S)))], b = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = h.filter((A) => r.dependsOn?.includes(A.id));
        if (!S.length) throw new R(P(r.label) + " does not depend on " + Se(h.map((A) => P(A.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((A) => !S.some((E) => E.id === A)), r.dependsOn.length || delete r.dependsOn, y(D(a, o, r.laneId, r.id), P(r.label) + " no longer depends on " + Se(S.map((A) => P(A.label))) + ".", b);
      }
      if (!h.length) {
        if (n.mode === "add") throw new R("Name the features " + P(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, y(D(a, o, r.laneId, r.id), P(r.label) + " no longer depends on anything.", b);
      }
      if (h.includes(r)) throw new R("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...h.map((S) => S.id)])], y(D(a, o, r.laneId, r.id), P(r.label) + " now depends on " + Se(h.map((S) => P(S.label))) + ".", b);
    }
    case "set_outcome": {
      const r = w(n.card), h = k(n.lane), b = a.signals ?? (a.signals = []), S = n.label, A = S === void 0 ? b.filter((M) => M.cardId === r.id && M.laneId === h.id) : b.filter((M) => M.cardId === r.id && M.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && A.length > 1) throw new R("Two outcomes on this card have that name.", "refused", h.id, r.id);
      if (!A.length && b.length >= 24) throw new R("A workshop can have up to 24 outcomes. Remove one first.", "refused", h.id, r.id);
      let E = 1;
      for (; b.some((M) => M.id === "signal-" + E); ) E++;
      const U = { label: S ?? A[0]?.label ?? (r.label + " in " + h.label).slice(0, 80).trim(), cardId: r.id, laneId: h.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return A.length ? Object.assign(A[0], U) : b.push({ id: "signal-" + E, ...U }), y(D(a, o, h.id, r.id), "When " + P(r.label) + " is in " + P(h.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: h.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = w(n.card), h = (a.signals ?? []).filter((b) => b.cardId === r.id);
      if (n.outcome === void 0) {
        if (!h.length) throw new R(P(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        Qe(a, (b) => b.cardId === r.id);
      } else {
        const b = T(h, Sn(h, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        Qe(a, (S) => S.id === b.id);
      }
      return y(D(a, o, r.laneId, r.id), "Removed the outcome from " + P(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((h) => k(h));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new R("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((h) => h.id), y(D(a, o), _(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new R("Say before or after, not both.", "invalid_edit");
      const r = k(n.lane), h = n.before ?? n.after, b = h === void 0 ? void 0 : k(h);
      if (b && b.id === r.id) throw new R("Choose two different scenes.", "refused", r.id);
      const S = Mn(a).filter((A) => A.id !== r.id);
      return S.splice(b ? S.findIndex((A) => A.id === b.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = S.map((A) => A.id), y(D(a, o, r.id), _(S), { laneId: r.id });
    }
    case "add_station": {
      const r = k(n.from);
      let h;
      try {
        h = st(a, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new R(S.message, "refused", r.id);
      }
      const b = h.lanes[h.lanes.length - 1];
      return y(h, "Added a path from " + P(r.label) + " to " + P(b.label) + ".", { laneId: b.id });
    }
    case "insert_station": {
      const r = k(n.before), h = n.from === void 0 ? void 0 : k(n.from), b = h ? [h] : a.lanes.filter((E) => E.station.next.includes(r.id));
      if (h && !h.station.next.includes(r.id))
        throw new R("There is no path from " + P(h.label) + " to " + P(r.label) + ". Try “Add " + n.label + " after " + h.label + "”.", "refused", h.id);
      if (!b.length) throw new R("Nothing leads to " + P(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = st(a, b[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (E) {
        throw new R(E.message, "refused", r.id);
      }
      const A = S.lanes[S.lanes.length - 1];
      for (const E of S.lanes)
        b.some((N) => N.id === E.id) && (E.station.next = [...new Set(E.station.next.map((N) => N === r.id ? A.id : N))]);
      return A.station.next = [r.id], y(D(S, o, A.id), "Added " + P(A.label) + " before " + P(r.label) + ".", { laneId: A.id });
    }
    case "connect_stations": {
      const r = k(n.from), h = k(n.to);
      if (r.id === h.id) throw new R("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(h.id) ? y(a, P(r.label) + " already leads to " + P(h.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(h.id), y(D(a, o, r.id), "Connected " + P(r.label) + " to " + P(h.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = k(n.from), h = k(n.to);
      if (!r.station.next.includes(h.id)) throw new R("There is no path between " + P(r.label) + " and " + P(h.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((b) => b !== h.id), y(D(a, o, r.id), "Removed the path from " + P(r.label) + " to " + P(h.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = k(n.station);
      return r.station.outcome = n.outcome, y(D(a, o, r.id), "Changed what happens at " + P(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = k(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), y(D(a, o, r.id), "Moved " + P(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = k(n.station);
      return n.image === null ? (delete r.station.image, y(D(a, o, r.id), "Removed the image at " + P(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, y(D(a, o, r.id), "Updated the image at " + P(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = k(n.station);
      if (!r.station.image) throw new R("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, y(D(a, o, r.id), "Updated the image description at " + P(r.label) + ".", { laneId: r.id });
    }
  }
  throw new R("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function B(r, h) {
    const b = { laneId: h.id, cardId: r.id };
    if (r.laneId === h.id)
      return y(e, P(r.label) + " is already " + (d ? "at " : "in ") + P(h.label) + ".", b, !1);
    const S = Re(e, r.id, h.id);
    if (!S) throw new R(en(e, r.id, h.id) ?? "That move is not available.", "refused", h.id, r.id);
    return y(D(S, o, h.id, r.id), "Moved " + P(r.label) + " to " + P(h.label) + ".", b);
  }
}
function Qn(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount"].find((a) => e[a] !== void 0 && !(n === "launch-plan" ? a !== "amount" : (n === "pipeline" || n === "budget") && a === "amount"));
  if (t) throw new R(t === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", o);
}
function Qe(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function He(e, n, o = {}) {
  const t = (T) => ({ refused: { index: 0, kind: null, laneId: null, ...T } });
  let a;
  try {
    a = J(e);
  } catch (T) {
    return t({ reason: "The workshop cannot be read: " + (T instanceof Error ? T.message : String(T)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const d = a, m = [];
  for (const [T, k] of n.entries()) {
    const w = k?.kind, g = typeof w == "string" ? Dt.get(w) : void 0;
    if (!k || typeof k != "object" || !g)
      return t({
        index: T,
        kind: typeof w == "string" ? w : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(w)) + ". The edits are " + Se(_n.map((r) => r.kind)) + "."
      });
    const y = qt(k, g);
    if (y) return t({ index: T, kind: g.kind, code: "invalid_edit", reason: y });
    const $ = rn(a);
    if (!g.boards.includes($))
      return t({ index: T, kind: g.kind, code: "not_on_this_board", reason: g.refusals[$] ?? "This workshop does not take " + g.kind + "." });
    let _;
    try {
      _ = Jt(a, k, $, o.selection);
    } catch (r) {
      if (!(r instanceof R)) throw r;
      return t({
        index: T,
        kind: g.kind,
        reason: r.reason,
        code: r.code,
        laneId: r.laneId,
        ...r.cardId && { cardId: r.cardId },
        ...r.candidates && { candidates: r.candidates },
        ...r.limits && { limits: r.limits }
      });
    }
    const B = Vt(a, _.board);
    if (B) return t({ index: T, kind: g.kind, reason: B, code: "not_on_this_board", laneId: _.laneId ?? null });
    a = _.board, m.push({
      index: T,
      kind: g.kind,
      said: _.said,
      changed: _.changed ?? !0,
      ..._.laneId && { laneId: _.laneId },
      ..._.cardId && { cardId: _.cardId }
    });
  }
  const I = new Map(d.cards.map((T) => [T.id, T.laneId])), C = a.cards.flatMap((T) => {
    const k = I.get(T.id);
    return k === void 0 || k === T.laneId ? [] : [{ cardId: T.id, fromLaneId: k, toLaneId: T.laneId }];
  });
  return { workshop: a, report: { edits: m, movedCards: C } };
}
const Yt = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map",
  "launch-plan": "launch plan",
  pipeline: "sales pipeline",
  budget: "budget"
};
function Vt(e, n) {
  const o = J(e), t = rn(o);
  let a;
  try {
    a = J(n);
  } catch (C) {
    return an(C instanceof Error ? C.message : String(C), t);
  }
  const d = rn(a), m = (C, T) => C.lanes.length === T.lanes.length && C.lanes.every((k) => T.lanes.some((w) => w.id === k.id)), I = (C, T) => C.lanes.every((k, w) => T.lanes[w]?.id === k.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && d !== t)
    return m(o, a) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !I(o, a)) return W.keepsOrder;
  if (ee(o) && d === t && !(m(o, a) && I(o, a))) return Tn[t];
  if (t === "release-plan" && d === "release-plan") {
    if (!m(o, a)) return W.releaseLanes;
    if (!I(o, a)) return W.releaseOrder;
    if (a.cards.some((C) => !o.cards.some((T) => T.id === C.id))) return W.releaseCards;
  }
  return t !== d ? "This slate holds a " + Yt[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
const Wo = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Fo(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const d of n.panels) {
    if (!d || typeof d.id != "string" || !/^[a-z][\w-]{0,31}$/.test(d.id) || typeof d.label != "string" || !d.label.trim() || d.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(d.artwork) || !(d.after === null || typeof d.after == "string")) return null;
    o.push({ id: d.id, label: d.label.trim(), artwork: d.artwork, after: d.after });
  }
  const t = new Map(o.map((d) => [d.id, d])), a = [...new Set(n.hung)];
  if (t.size !== o.length || a.length !== n.hung.length || a.some((d) => !t.has(d))) return null;
  for (const d of o) {
    const m = /* @__PURE__ */ new Set([d.id]);
    let I = d.after;
    for (; I !== null; ) {
      if (m.has(I) || !t.has(I) || a.includes(d.id) && !a.includes(I)) return null;
      m.add(I), I = t.get(I).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: a };
}
function Zt(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function zo(e, n) {
  return Zt(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const ft = ["firstPrint", "secondPrint", "thirdPrint"], ht = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function jo(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...ht, route: n.route };
  for (const t of ft) {
    const a = n[t];
    if (typeof a != "string" || !a.trim() || a.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = a.trim();
  }
  return o;
}
function Ho(e = new URLSearchParams()) {
  const n = { ...ht };
  for (const t of ft) {
    const a = e.get(t)?.trim();
    a && a.length <= 48 && (n[t] = a);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function Bo(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Qt(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = to(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), eo(n), n;
}
function Xt(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function eo(e) {
  return e && Xt(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Xn(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function no(e) {
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
function to(e) {
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
function In() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const et = "#1f7a5c", nt = "#5b9a85", xn = "#c2410c", oo = "#2f5fd0", ro = { canMove: !1, canSelect: !1 };
function ao(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function Do(e, n, o = {}) {
  let t = J(n);
  const a = o.kit, d = (s) => !!ee(s) && !a;
  if (d(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const m = a?.layer(e);
  let I = null, C = null, T = !!o.readOnly, k = T || d(t), w = !1;
  const g = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
  let r = null, h = null, b = null;
  const S = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  let E = null, N = null;
  function U(s, i) {
    N && clearTimeout(N.timer), N = { name: s, reason: i, timer: setTimeout(() => {
      N = null, w || z(C ?? t);
    }, 3e3) };
  }
  let M = Promise.resolve(), Y = null, G = ot(o.layout);
  const We = { ...o.style };
  let ae = /* @__PURE__ */ new Map(), ke = /* @__PURE__ */ new Set(), Ae = null, ne = !1;
  Oe(t);
  const K = o.origin ? { x: o.origin.x, y: o.origin.y } : io(e), ye = (s) => B.get(s) ?? s, se = (s) => ao(ye(s));
  function oe(s) {
    const i = _.get(s);
    if (i) return i;
    if (g.has(s) && !B.has(s) || !e.nodes.one?.(s)) return s;
    const c = Ct(s, (p) => !!e.nodes.one?.(p) || B.has(p));
    return _.set(s, c), B.set(c, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${c}".`), c;
  }
  const be = {
    governs(s) {
      if (g.get(s.id) !== s) return null;
      const i = se(s.id)?.kind;
      return i === "card" ? { canMove: !k, canEditText: !k && !C && t.kind !== "release-plan" } : i === "lane" ? { canMove: !1, canEditText: !k && !C } : i === "handle" ? { canMove: !k && !C, canEditText: !1 } : ro;
    },
    onStart(s, i) {
      const c = se(s.id), p = { x: i.x - (s.options.x ?? 0), y: i.y - (s.options.y ?? 0) };
      if (c.kind === "handle") {
        const u = !k && !C && a ? a.handleDrag(t, ye(s.id), p, G) : null;
        return u ? (V(), Ie(), N && (clearTimeout(N.timer), N = null), I = { name: ye(s.id), follow: u, last: null }, !0) : !1;
      }
      const x = c.key;
      if (k || C || !t.cards.some((u) => u.id === x)) return !1;
      V(), Ie();
      let l = null;
      try {
        l = (a?.chooser ?? o.chooseCandidate)?.(t, x, p, G) ?? null;
      } catch (u) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", u);
      }
      return r = { cardId: x, evaluate: l, grab: p, outcome: { kind: "home" } }, z(t, { skip: x }), !0;
    },
    onMove(s, i) {
      if (I) {
        I.last = I.follow(gn(i)), z(I.last.next, { grip: I.name }), H(o.onPreview, I.last.next === t ? null : I.last.next);
        return;
      }
      if (!r) return;
      const c = jn(r.cardId, i, r.evaluate);
      if (so(c, r.outcome)) return;
      r.outcome = c;
      const p = c.kind === "candidate" ? c.next : null;
      z(p ?? t, { skip: r.cardId }), H(o.onPreview, p);
    },
    onEnd(s, i) {
      if (I) {
        const { follow: u, name: f } = I, v = u(gn(i));
        I = null, H(o.onPreview, null), v.refusal ? (U(f, v.refusal), z(t), e.announce?.(v.refusal), H(o.onRefuse, { laneId: null, reason: v.refusal })) : Ye(v.next, {}) || z(t);
        const L = kn(t, f);
        return L ? { accept: !0, settle: L } : { accept: !1 };
      }
      if (!r) return { accept: !1 };
      const { cardId: c, evaluate: p } = r, x = jn(c, i, p), l = t.cards.find((u) => u.id === c);
      if (r = null, H(o.onPreview, null), x.kind === "candidate" && a) {
        if (!Ye(x.next, { cardId: c, laneId: x.laneId }, c))
          return z(t, { skip: c }), { accept: !1 };
        const u = kn(t, ye(s.id));
        return u ? { accept: !0, settle: u } : { accept: !0 };
      }
      if (x.kind === "candidate") {
        t = x.next, z(t, { skip: c });
        const u = t.lanes.find((v) => v.id === x.laneId);
        e.announce?.(`${l.label} moved to ${u.label}. ${pe(t, u.id)}.`), H(o.onChange, t, { cardId: c, laneId: x.laneId });
        const f = kn(t, ye(s.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (x.kind === "refused")
        Nt(l.label, { cardId: c, laneId: x.laneId, reason: x.reason });
      else if (x.kind === "outside" && nn(t) && !Ge()) {
        const u = tn(t, c);
        if (!u)
          return wn(c, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        z(t, { skip: c }), e.announce?.(u), H(o.onRefuse, { cardId: c, laneId: null, reason: u });
      } else
        z(t, { skip: c }), x.kind === "outside" && (e.announce?.(`${l.label} was not dropped on a lane. It stays where it was.`), H(o.onRefuse, { cardId: c, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (I) {
        I = null, H(o.onPreview, null), z(t);
        return;
      }
      const i = r && t.cards.find((c) => c.id === r.cardId);
      r = null, H(o.onPreview, null), z(t, { skip: se(s.id)?.key }), i && e.announce?.(`Move cancelled. ${i.label} stays where it was.`);
    },
    onTextCommit(s, i, c) {
      const p = se(s.id);
      if (!p || k || C) return !1;
      let x = i.replace(/\s+/g, " ").trim();
      const l = [], u = ee(t), f = u && p.kind === "card" ? we(u).renamed(t, p.key, x) : null;
      f && (x = f.label, l.push(...f.edits));
      const v = p.kind === "lane" ? { laneId: p.key, label: x } : { cardId: p.key, label: x };
      l.unshift(p.kind === "lane" ? { kind: "rename_lane", lane: { id: p.key }, label: x } : { kind: "rename_card", card: { id: p.key }, label: x });
      const L = He(t, l);
      if ("refused" in L) {
        const { reason: O } = L.refused;
        return e.announce?.(`${c} keeps its name. ${O}`), H(o.onRefuse, { ...p.kind === "lane" ? { laneId: p.key } : { cardId: p.key }, rename: v, reason: O }), !1;
      }
      return JSON.stringify(L.workshop) === JSON.stringify(t) ? (z(t), !1) : (t = L.workshop, z(t), e.announce?.(f ? L.report.edits.map((O) => O.said).join(" ") : `${c} renamed to ${x}.`), H(o.onChange, t, { rename: v, ...a ? { edits: l } : {} }), f ? !1 : x);
    },
    onKeyDown(s, i) {
      const c = se(s.id);
      if (k || C || r || I || i.ctrlKey || i.metaKey || i.altKey) return !1;
      const p = a?.keyEdit?.(t, ye(s.id), { key: i.key, shiftKey: i.shiftKey });
      if (p) {
        i.preventDefault();
        const l = He(t, p);
        return "refused" in l ? (e.announce?.(l.refused.reason), H(o.onRefuse, { laneId: l.refused.laneId, ...c?.kind === "card" ? { cardId: c.key } : {}, reason: l.refused.reason })) : Ye(l.workshop, c?.kind === "card" ? { cardId: c.key } : {}), !0;
      }
      if (c?.kind !== "card") return !1;
      const x = t.cards.find((l) => l.id === c.key);
      if (!x) return !1;
      if (i.key === "ArrowLeft" || i.key === "ArrowRight")
        return i.preventDefault(), Hn(x.id, i.key === "ArrowLeft" ? -1 : 1), !0;
      if ((i.key === "ArrowUp" || i.key === "ArrowDown") && Ot())
        return i.preventDefault(), Hn(x.id, i.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (h?.cardId !== x.id) return !1;
      if (i.key === "Enter") {
        i.preventDefault();
        const { laneId: l, next: u, spot: f } = h;
        if (h = null, l === null)
          return H(o.onPreview, null), wn(x.id, f), !0;
        const v = t;
        t = u, z(t), ve(l), H(o.onPreview, null);
        const L = t.lanes.find((O) => O.id === l);
        return e.announce?.(`${x.label} moved to ${L.label}. ${pe(t, l)}.`), H(o.onChange, t, { cardId: x.id, laneId: l, ...a ? { edits: a.editsBetween(v, t) } : {} }), !0;
      }
      return i.key === "Escape" ? (i.preventDefault(), Ie(), e.announce?.(`Move cancelled. ${x.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((i) => g.get(i.id) === i).map((i) => i.id);
      ne = s.length === 1, g.clear(), y.clear(), $.clear(), _.clear(), B.clear(), r = null, h = null, z(C ?? t, { animate: !1 }), s.length === 1 && (M = M.then(() => {
        ne = !1;
        const i = g.get(s[0]);
        if (!w && i && !(e.getSelectedNodes?.() ?? []).length) {
          const c = () => e.selectNodes?.([i]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
        }
        fn();
      }));
    }
  };
  be.onFreeMove = (s, i) => {
    if (!Ue() || s.options?.isComment) return hn();
    const c = Ke(i), p = qe(s), x = t.lanes.filter((u) => !Fe(s) && Ee(t, u.id, p) === null).map((u) => u.id), l = c ? Fe(s) ?? Ee(t, c, p) : null;
    b && b.noteId === s.id && b.laneId === c && b.refusal === l || (b = { noteId: s.id, laneId: c, refusal: l, open: x }, xe());
  }, be.onFreeDrop = (s, i, c) => {
    if (hn(), !Ue() || s.options?.isComment) return;
    const p = Ke(i);
    if (!p) return;
    const x = qe(s), l = t.lanes.find((f) => f.id === p), u = Fe(s) ?? Ee(t, p, x);
    return u ? (V(!1), E = { laneId: p, reason: u, timer: setTimeout(() => V(), 1500) }, xe(), e.announce?.(`${pn(x.label)} can't go in ${l.label}. ${u}`), H(o.onRefuse, { noteId: s.id, laneId: p, reason: u }), "refused") : (mn([{ node: s, offer: x, from: c }], p), "taken");
  }, be.onFreeGroupDrop = (s, i, c) => {
    if (hn(), !Ue() || s.some((f) => f.options?.isComment)) return;
    const p = Ke(i);
    if (!p) return;
    const x = t.lanes.find((f) => f.id === p), l = s.map((f) => ({ node: f, offer: qe(f) })), u = Pt(l, p);
    if (u) {
      V(!1), E = { laneId: p, reason: u, timer: setTimeout(() => V(), 1500) }, xe(), e.announce?.(`${Bn(l.map((f) => pn(f.offer.label)))} can't go in ${x.label}. ${u}`);
      for (const { node: f } of l) H(o.onRefuse, { noteId: f.id, laneId: p, reason: u });
      return "refused";
    }
    return mn(l.map((f, v) => ({ ...f, from: c?.[v] })), p), "taken";
  }, be.onFreeTextCommit = (s) => {
    if (!Ue() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const i = s.options ?? {}, c = Ke({ x: (i.x ?? 0) + (i.width ?? 0) / 2, y: (i.y ?? 0) + (i.height ?? 0) / 2 });
    if (!c) return;
    const p = qe(s), x = t.lanes.find((L) => L.id === c), l = Fe(s) ?? Ee(t, c, p);
    if (!l) {
      mn([{ node: s, offer: p }], c);
      return;
    }
    V(!1), E = { laneId: c, reason: l, timer: setTimeout(() => V(), 1500) }, xe(), e.announce?.(`${pn(p.label)} can't go in ${x.label}. ${l} It is beside the board.`), H(o.onRefuse, { noteId: s.id, laneId: c, reason: l });
    const { width: u } = Oe(t), f = Math.round(K.x + u + 32), v = Math.round(i.y ?? K.y);
    s.position(f, v, () => e.updateSelectionResizeRotate?.(), void 0, In() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Xn({ ...s.options, x: f, y: v })] });
  }, be.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...S] }), be.onUndoRestore = (s, i) => {
    if (w) return;
    const c = new Map((s?.cards ?? []).map((l) => [l.id, l])), p = new Map(s?.pairs ?? []), x = (l) => S.get(l) ?? p.get(l) ?? l;
    for (const l of i.added) {
      const u = x(l), f = t.cards.find((v) => v.id === u);
      f && (t = J({ ...t, cards: t.cards.filter((v) => v !== f) }), z(t), tt(H(o.onChange, t, { cardId: u, cardToNote: { noteId: l } })));
    }
    for (const l of i.removed) {
      const u = x(l), f = c.get(u);
      if (!f || t.cards.some((F) => F.id === u)) continue;
      const v = { id: u, label: f.label, ...f.look ? { look: f.look } : {}, ...f.asNote ? { asNote: f.asNote } : {} }, L = [f.laneId, ...t.lanes.map((F) => F.id)].find((F) => je(t, F, v));
      if (!L) {
        e.announce?.(`${f.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Lt(je(t, L, v), u, s?.cards ?? []), u !== l && S.set(l, u), z(t);
      const O = t.cards.findIndex((F) => F.id === u), j = t.cards.slice(O + 1).find((F) => F.laneId === L)?.id;
      tt(H(o.onChange, t, { cardId: u, laneId: L, noteToCard: {
        noteId: l,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...j ? { before: j } : {}
      } }));
    }
  };
  const Tt = e.setDragPolicy(be), At = o.onSelect && e.onSelectionChange?.(() => fn()), zn = () => {
    h && Ie();
  };
  e.element?.addEventListener?.("pointerdown", zn, !0), z(t, { animate: !1 });
  function jn(s, i, c) {
    const p = t.cards.find((O) => O.id === s);
    if (!p) return { kind: "outside" };
    if (a) {
      const O = gn(i), j = a.refusalAt(t, s, r?.grab ?? { x: 0, y: 0 }, O, G);
      if (j) return { kind: "refused", ...j };
      const { width: F, height: ie } = Oe(t);
      if (O.x < -40 || O.y < -40 || O.x > F + 40 || O.y > ie + 40) return { kind: "outside" };
      let Z = t;
      try {
        Z = c?.(O) ?? t;
      } catch (Pe) {
        console.warn("WORKSHOP: the board kit's chooser threw", Pe);
      }
      return JSON.stringify(Z) === JSON.stringify(t) ? { kind: "home" } : { kind: "candidate", laneId: Z.cards.find((Pe) => Pe.id === s)?.laneId ?? p.laneId, next: Z };
    }
    const x = t.lanes.map((O) => g.get(oe(X.column(O.id)))).filter(Boolean), l = e.hitTestNodes(i, x, { padding: 6 }), u = l ? se(l.id).key : null;
    if (!u) return { kind: "outside" };
    if (u === p.laneId) return { kind: "home" };
    const f = Re(t, s, u);
    if (!f) return { kind: "refused", laneId: u, reason: en(t, s, u) ?? "That move is not available." };
    if (!c) return { kind: "candidate", laneId: u, next: f };
    let v = null;
    try {
      v = c({ x: i.x - K.x, y: i.y - K.y });
    } catch (O) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", O), { kind: "candidate", laneId: u, next: f };
    }
    const L = v?.cards.find((O) => O.id === s)?.laneId;
    return !v || !L || L === p.laneId ? { kind: "home" } : { kind: "candidate", laneId: L, next: v };
  }
  function Ot() {
    return a ? !1 : new Set(Ne(t, { layout: G }).places.map((s) => s.row)).size > 1;
  }
  function Hn(s, i, c = !1) {
    const p = t.cards.find((O) => O.id === s), x = rt(t, s), l = h?.cardId === s && h.laneId === null ? h.side : void 0;
    if (l !== void 0) {
      if (c || i === l) return;
      const O = l > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Ie(), O.id === p.laneId) {
        ve(O.id, C ?? t), e.announce?.(`${p.label} is back in ${O.label}.`);
        return;
      }
      if (x.includes(O)) {
        const F = Re(t, s, O.id);
        h = { cardId: s, laneId: O.id, next: F }, z(F), ve(O.id, F), H(o.onPreview, F), e.announce?.(`${p.label} to ${O.label}: ${pe(F, O.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const j = en(t, s, O.id) ?? "That move is not available.";
      V(), E = { laneId: O.id, reason: j, timer: setTimeout(() => V(), 1500) }, z(C ?? t), ve(O.id, C ?? t), e.announce?.(`${p.label} can't move to ${O.label}. ${j}`), H(o.onRefuse, { cardId: s, laneId: O.id, reason: j });
      return;
    }
    const u = h?.cardId === s ? h.laneId : p.laneId;
    let f;
    if (c) {
      const { places: O } = Ne(t, { layout: G }), j = O.find((F) => F.laneId === u);
      f = O.filter((F) => F.column === j.column && (F.row - j.row) * i > 0).sort((F, ie) => (F.row - ie.row) * i).map((F) => t.lanes.find((ie) => ie.id === F.laneId));
    } else {
      const O = t.lanes.findIndex((j) => j.id === u);
      f = i > 0 ? t.lanes.slice(O + 1) : t.lanes.slice(0, O).reverse();
    }
    const v = f.find((O) => x.includes(O));
    if (V(), !v) {
      const O = f[0];
      if (!O) {
        if (!c && nn(t)) {
          const F = tn(t, s);
          if (F) {
            e.announce?.(F), H(o.onRefuse, { cardId: s, laneId: null, reason: F });
            return;
          }
          $t(p, i);
          return;
        }
        e.announce?.(`${p.label} has no lane to move to on that side.`);
        return;
      }
      const j = en(t, s, O.id) ?? "That move is not available.";
      E = { laneId: O.id, reason: j, timer: setTimeout(() => V(), 1500) }, z(h?.next ?? C ?? t), ve(O.id, h?.next ?? C ?? t), e.announce?.(`${p.label} can't move to ${O.label}. ${j}`), H(o.onRefuse, { cardId: s, laneId: O.id, reason: j });
      return;
    }
    if (v.id === p.laneId) {
      Ie(), ve(v.id, C ?? t), e.announce?.(`${p.label} is back in ${v.label}.`);
      return;
    }
    const L = Re(t, s, v.id);
    h = { cardId: s, laneId: v.id, next: L }, z(L), ve(v.id, L), H(o.onPreview, L), e.announce?.(`${p.label} to ${v.label}: ${pe(L, v.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function ve(s, i = t) {
    const c = a ? Rt(i, X.column(s)) : Ne(i, { layout: G, rows: Un() }).places.find((v) => v.laneId === s), p = e.canvas?.viewbox?.();
    if (!c || !p || !(p.width > 0) || !(p.height > 0)) return;
    const x = 16, l = (v, L, O, j) => L + x * 2 >= j || v - x < O ? v - x - O : v + L + x > O + j ? v + L + x - (O + j) : 0, u = l(K.x + c.x, c.width, p.x, p.width), f = l(K.y + c.y, c.height, p.y, p.height);
    (u || f) && e.panBy?.({ x: u, y: f });
  }
  function fn() {
    if (!o.onSelect || ne) return;
    const s = w ? [] : e.getSelectedNodes?.() ?? [], i = s.length === 1 && g.get(s[0].id) === s[0] ? se(s[0].id) : null, c = i?.kind === "card" ? { cardId: i.key } : i?.kind === "lane" ? { laneId: i.key } : null, p = c ? JSON.stringify(c) : null;
    p !== Ae && (Ae = p, H(o.onSelect, c));
  }
  function Ie() {
    h && (h = null, H(o.onPreview, null), z(C ?? t));
  }
  function $t(s, i) {
    const { width: c } = Oe(t), p = g.get(oe(X.card(s.id)))?.options, x = p?.width ?? 228, l = { x: i > 0 ? K.x + c + 32 : K.x - x - 32, y: p?.y ?? K.y }, u = at(t, s.id);
    h = { cardId: s.id, laneId: null, side: i, spot: l, next: t }, z(t), H(o.onPreview, u), e.announce?.(`${s.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ge() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ue() {
    return !w && !k && !C && !r && !Ge() && nn(t);
  }
  function hn() {
    b && (b = null, w || xe());
  }
  function Ke(s) {
    const i = t.lanes.map((p) => g.get(oe(X.column(p.id)))).filter(Boolean), c = e.hitTestNodes(s, i, { padding: 6 });
    return c ? se(c.id)?.key ?? null : null;
  }
  function qe(s) {
    const i = s.options ?? {}, c = fo({
      backgroundColor: i.backgroundColor,
      textColor: i.fontColor,
      fontFamily: i.fontFamily,
      fontSize: i.fontSize,
      borderColor: i.borderColor,
      borderWidth: i.borderWidth
    }), p = String(i.text ?? ""), x = p.replace(/\s+/g, " ").trim(), l = {};
    p.trim() !== x && p.length <= 400 && (l.text = p.trim()), typeof i.shape == "string" && /^[a-z]{1,24}$/i.test(i.shape) && (l.shape = i.shape);
    for (const u of ["width", "height"]) Number.isFinite(i[u]) && i[u] >= 10 && i[u] <= 4e3 && (l[u] = Math.round(i[u]));
    return { id: s.id, label: x, ...c ? { look: c } : {}, ...Object.keys(l).length ? { asNote: l } : {} };
  }
  function Bn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function Pt(s, i) {
    for (const { node: l } of s) {
      const u = Fe(l);
      if (u) return u;
    }
    const c = t.lanes.find((l) => l.id === i), p = t.cards.filter((l) => l.laneId === i).length;
    if (c.capacity !== void 0 && p + s.length > c.capacity) {
      const l = c.capacity - p;
      return l > 0 ? `It has room for ${l} more ${l === 1 ? "card" : "cards"}.` : `It already holds ${p} of ${c.capacity} ${c.capacity === 1 ? "card" : "cards"}.`;
    }
    let x = t;
    for (const { offer: l } of s) {
      const u = Ee(x, i, l);
      if (u) return u;
      x = je(x, i, l);
    }
    return null;
  }
  function Fe(s) {
    return (s.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((c) => c !== s && (c.relationships?.associations ?? []).some((p) => p.child === s || p.childId === s.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : s.options?.image ? "A note with a picture stays a note." : s.options?.link?.show && s.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const pn = (s) => s || "This note";
  function mn(s, i) {
    let c = t;
    const p = s.map(({ node: u, offer: f, from: v }) => {
      c = je(c, i, f);
      const L = { ...u.options ?? {}, ...v ? { x: v.x, y: v.y } : {} };
      return { node: u, card: c.cards[c.cards.length - 1], kept: L };
    });
    e.beginHostStep?.(), t = c;
    let x = t;
    for (const { node: u, card: f } of p)
      f.id !== u.id && S.set(u.id, f.id), A.set(oe(X.card(f.id)), { x: u.options?.x ?? 0, y: u.options?.y ?? 0 }), Je(() => e.removeNode(u.id));
    e.endHostStep?.(), z(t), Et(oe(X.card(p[0].card.id)));
    const l = t.lanes.find((u) => u.id === i);
    e.announce?.(p.length === 1 ? `${p[0].card.label} is now a card in ${l.label}. ${pe(t, i)}.` : `${Bn(p.map(({ card: u }) => u.label))} are now cards in ${l.label}. ${pe(t, i)}.`);
    for (const { node: u, card: f, kept: v } of p) {
      const L = { cardId: f.id, laneId: i, noteToCard: {
        noteId: u.id,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {}
      } }, O = () => {
        t !== x || !t.cards.some((j) => j.id === f.id) || (t = J({ ...t, cards: t.cards.filter((j) => j.id !== f.id) }), x = t, z(t));
      };
      Dn(H(o.onChange, t, L), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: u.id, isComment: !1 } }]);
      }, () => {
        if (!w) {
          if (O(), !e.nodes.one(v.id)) {
            e.beginHostStep?.();
            const j = Je(() => e.addNode({ ...v }));
            j && (j.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${f.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        w || (O(), e.announce?.(`Someone else put ${f.label} on the board first.`));
      });
    }
  }
  function wn(s, i) {
    const c = t.cards.find((Q) => Q.id === s), p = t.lanes.find((Q) => Q.id === c.laneId), x = t.cards.findIndex((Q) => Q.id === s), l = t.cards.slice(x + 1).find((Q) => Q.laneId === c.laneId)?.id, u = at(t, s), f = y.get(oe(X.card(s))) ?? {}, v = e.nodes.one(s) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : s, L = (We.cornerRadius ?? 0) > 0, O = c.asNote, j = O?.text !== void 0 && O.text.replace(/\s+/g, " ").trim() === c.label ? O.text : mo(t, c), F = {
      id: v,
      x: Math.round(i.x),
      y: Math.round(i.y),
      width: O?.width ?? f.width ?? 228,
      height: O?.height ?? f.height ?? 76,
      text: j,
      shape: O?.shape ?? (L ? "roundedrectangle" : "rectangle"),
      backgroundColor: c.look?.backgroundColor ?? f.backgroundColor,
      fontColor: c.look?.textColor ?? f.foregroundColor,
      fontSize: c.look?.fontSize ?? f.fontSize,
      borderColor: c.look?.borderColor ?? f.borderColor,
      borderWidth: c.look?.borderWidth ?? f.borderWidth,
      ...c.look?.fontFamily ?? f.fontFamily ? { fontFamily: c.look?.fontFamily ?? f.fontFamily } : {}
    };
    for (const Q of Object.keys(F)) F[Q] === void 0 && delete F[Q];
    e.beginHostStep?.(), t = u;
    const ie = t;
    v !== s ? S.set(v, s) : S.delete(v);
    const Z = Je(() => e.addNode(F));
    Z && (Z.announcedByCreator = !0), e.endHostStep?.(), z(t), Z?.ready?.then?.(() => {
      if (w || e.nodes.one(v) !== Z) return;
      const Q = () => e.selectNodes?.([Z]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(Q) : Q();
    }), e.announce?.(`${c.label} is now a note on the canvas. ${p.label}: ${pe(t, p.id)}.`);
    const Pe = () => {
      e.nodes.one(v) === Z && (e.beginHostStep?.(), Je(() => e.removeNode(v)), e.endHostStep?.());
    };
    Dn(H(o.onChange, t, { cardId: s, cardToNote: { noteId: v } }), () => {
      Z && e.nodes.one(v) === Z && e.sendHeld?.([{ type: "onNodeAdded", data: { id: v, nodeOptions: Xn(Z.options) } }]);
    }, () => {
      if (!w) {
        if (Pe(), t === ie && !t.cards.some((Q) => Q.id === s)) {
          const Q = { id: s, label: c.label, ...c.look ? { look: c.look } : {}, ...c.asNote ? { asNote: c.asNote } : {} }, Jn = je(t, c.laneId, Q, l);
          Jn && (t = Jn, z(t));
        }
        e.announce?.(`${c.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      w || (Pe(), e.announce?.(`Someone else took ${c.label} off the lanes first.`));
    });
  }
  function Lt(s, i, c) {
    const p = c.map((v) => v.id), x = p.indexOf(i), l = s.cards.find((v) => v.id === i);
    if (x < 0 || !l) return s;
    const u = s.cards.filter((v) => v !== l), f = u.findIndex((v) => p.indexOf(v.id) > x);
    return u.splice(f < 0 ? u.length : f, 0, l), J({ ...s, cards: u });
  }
  function Et(s) {
    M = M.then(() => {
      const i = g.get(s);
      if (w || !i) return;
      const c = () => e.selectNodes?.([i]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
    });
  }
  function Je(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Dn(s, i, c, p) {
    if (!s || typeof s.then != "function") return i();
    const x = s.then((l) => {
      l === !0 ? i() : l === !1 ? c() : l === "taken" && p();
    }, () => c());
    e.holdUntil?.(x);
  }
  function Nt(s, i) {
    V(!1), E = { laneId: i.laneId, reason: i.reason, timer: setTimeout(() => V(), 1500) }, z(t, { skip: i.cardId });
    const c = t.lanes.find((p) => p.id === i.laneId);
    e.announce?.(`${s} can't move to ${c?.label ?? "that lane"}. ${i.reason}`), H(o.onRefuse, i);
  }
  function V(s = !0) {
    E && (clearTimeout(E.timer), E = null, s && !w && xe());
  }
  function xe() {
    z(r && r.outcome.kind === "candidate" ? r.outcome.next : h?.next ?? C ?? t, { skip: r?.cardId });
  }
  function Gn(s) {
    const i = Kn(s, Un()), c = new Map(i.map((l) => [l.options.id, l.options])), p = (l, u, f, v = !1) => {
      const L = c.get(X.column(l));
      L && (L.borderColor = u, L.borderWidth = f, delete L.borderStyle);
      const O = v && c.get(X.lane(l));
      O && (O.borderColor = u, O.borderWidth = f);
    }, x = r?.cardId ?? h?.cardId;
    if (ae = /* @__PURE__ */ new Map(), x) {
      const l = t.cards.find((v) => v.id === x)?.laneId, u = rt(t, x);
      if (!a || a.laneCues)
        for (const v of u) v.id !== l && (p(v.id, nt, 2), ae.set(v.id, "open"));
      if (a?.laneCues) {
        for (const v of t.lanes) if (!u.includes(v)) {
          const L = c.get(X.column(v.id));
          L && (L.backgroundColor = "#e9e8e2"), ae.set(v.id, "closed");
        }
      }
      const f = r ? r.outcome : h?.laneId ? { kind: "candidate", laneId: h.laneId } : null;
      f?.kind === "candidate" && (p(f.laneId, et, 3, !0), ae.set(f.laneId, "over")), f?.kind === "refused" && (p(f.laneId, xn, 3), ae.set(f.laneId, "refused"));
    }
    if (b && !x) {
      for (const l of b.open) l !== b.laneId && (p(l, nt, 2), ae.set(l, "open"));
      b.laneId && !b.refusal && (p(b.laneId, et, 3, !0), ae.set(b.laneId, "over")), b.laneId && b.refusal && (p(b.laneId, xn, 3), ae.set(b.laneId, "refused"));
    }
    if (h?.laneId === null && h.spot) {
      const l = c.get(X.card(h.cardId));
      l && (l.xPos = h.spot.x, l.yPos = h.spot.y);
    }
    if (E) {
      ae.set(E.laneId, "refused"), p(E.laneId, xn, 3, !0);
      const l = c.get(X.caption(E.laneId));
      l && (l.text = E.reason, l.foregroundColor = "#b42318");
    }
    if (ke = /* @__PURE__ */ new Set(), C && s === C) {
      const l = (f, v) => JSON.stringify(f) === JSON.stringify(v), u = (f) => {
        const v = c.get(f);
        v && (v.borderStyle = "dashed", v.borderColor = oo, v.borderWidth = 2, ke.add(oe(f)));
      };
      for (const f of s.cards) l(f, t.cards.find((v) => v.id === f.id)) || u(X.card(f.id));
      for (const f of s.lanes) l(f, t.lanes.find((v) => v.id === f.id)) || u(X.lane(f.id));
    }
    for (const l of i) {
      l.options.id = oe(l.options.id);
      for (const u of l.relationships.associations)
        u.parentId = oe(u.parentId), u.childId = oe(u.childId);
    }
    return i;
  }
  function Un() {
    return r || h ? t.lanes.map((s) => t.cards.filter((i) => i.laneId === s.id).length) : void 0;
  }
  function z(s, i = {}) {
    if (w) return;
    Y = { model: s, skip: i.skip, grip: i.grip, animate: i.animate !== !1 };
    const c = Gn(s), p = [];
    for (const { options: l } of c) {
      const u = l.id;
      if (g.has(u)) continue;
      const f = A.get(u);
      A.delete(u);
      const v = f && i.animate !== !1 && !In() ? { ...l, xPos: f.x, yPos: f.y } : l, L = e.nodes.add(Qt(v));
      g.set(u, L), y.set(u, { ...v }), L.ready && p.push(L.ready.then(() => {
        if (g.get(u) !== L) return;
        L.applyGovernance?.(), se(u)?.kind === "column" && L.toBack?.(!1), se(u)?.kind === "handle" && L.svgGroup?.front?.();
        const O = qn(Y?.model ?? s, u);
        O && L.svgGroup?.node?.setAttribute("aria-label", O);
      }).catch(() => {
      }));
    }
    const x = Y;
    M = Promise.all([M, ...p]).then(() => {
      w || Y !== x || _t(Gn(x.model), x);
    }).catch((l) => console.warn("WORKSHOP: could not draw the workshop", l));
  }
  function _t(s, i) {
    const c = new Set(s.map((x) => x.options.id)), p = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [l, u] of [...g]) {
        if (c.has(l)) continue;
        for (const [v, L] of [...$])
          L.parentId !== l && L.childId !== l || (L.parent.relationships?.removeAssociation(v), $.delete(v));
        e.deselectNode?.(u), u.editor?.cancelInline?.(), g.delete(l), y.delete(l);
        const f = B.get(l);
        f && (B.delete(l), _.delete(f)), e.nodes.remove(l);
      }
      for (const { options: l } of s) {
        const u = l.id, f = g.get(u);
        if (!f?.svgGroup) continue;
        const v = y.get(u) ?? {}, L = f.editor?.isInlineEditing?.();
        (l.fontSize !== v.fontSize || l.foregroundColor !== v.foregroundColor) && (f.options.fontSize = l.fontSize, f.options.fontColor = l.foregroundColor, f.applyTextStyle?.()), l.text !== v.text && !L && f.setText?.(l.text), (l.width !== v.width || l.height !== v.height) && (l.vectorPath ? (f.options.width = l.width, f.options.height = l.height, f.setShape?.(f.options.shape, l.vectorPath), se(u)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(l.width, l.height)), l.backgroundColor !== v.backgroundColor && f.setColors?.(l.backgroundColor), (l.borderColor !== v.borderColor || l.borderWidth !== v.borderWidth || l.borderStyle !== v.borderStyle) && (f.options.borderColor = l.borderColor, f.options.borderWidth = l.borderWidth, f.options.borderStyle = l.borderStyle, f.applyBorder?.());
        const O = l.xPos !== v.xPos || l.yPos !== v.yPos || Math.abs((f.options.x ?? 0) - l.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - l.yPos) > 0.5;
        if (u !== (i.skip && oe(X.card(i.skip))) && u !== (i.grip && oe(i.grip)) && O) {
          const ie = i.animate && !In() ? 180 : 0, Z = p.includes(f) ? () => {
            !w && g.get(u) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Z && ie && p.length === 1 && f.resizeRotate?.disable?.(), f.position(l.xPos, l.yPos, Z, void 0, ie);
        }
        const j = qn(i.model, u);
        j && f.svgGroup.node.getAttribute("aria-label") !== j && f.svgGroup.node.setAttribute("aria-label", j), ke.has(u) ? f.svgGroup.node.setAttribute("data-workshop-proposed", "") : f.svgGroup.node.removeAttribute("data-workshop-proposed");
        const F = se(u);
        if (F?.kind === "column") {
          const ie = ae.get(F.key);
          ie ? f.svgGroup.node.setAttribute("data-workshop-drop", ie) : f.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        F?.kind === "handle" && f.svgGroup.front?.(), y.set(u, { ...l });
      }
      const x = /* @__PURE__ */ new Map();
      for (const l of s) for (const u of l.relationships.associations) x.set(u.id, u);
      for (const [l, u] of [...$])
        x.has(l) && g.get(u.parentId) === u.parent && g.get(u.childId) === u.child || (u.parent.relationships?.removeAssociation(l), $.delete(l));
      for (const [l, u] of x) {
        if ($.has(l)) continue;
        const f = g.get(u.parentId), v = g.get(u.childId);
        !f?.relationships || !v?.svgGroup || (f.relationships.addAssociation(v, no(u)), $.set(l, { parentId: u.parentId, childId: u.childId, parent: f, child: v }));
      }
    }), m) {
      const x = t.lanes.map((u) => g.get(oe(X.column(u.id)))?.svgGroup?.node).reduce((u, f) => f && (!u || u.compareDocumentPosition(f) & 4) ? f : u, null), l = i.model;
      m.draw(t, l === t ? null : l, {
        origin: K,
        layout: G,
        above: x,
        clamp: I?.last?.clampedReason ? { name: I.name, text: I.last.clampedReason } : !I && N ? { name: N.name, text: N.reason } : null,
        refused: !!I?.last?.refusal || !I && !!N,
        onUnlink: (u, f) => {
          if (k || C || r || I || Ge()) return;
          const v = He(t, [{ kind: "unlink_tasks", card: { id: u }, waitsOn: { id: f } }]);
          "refused" in v ? e.announce?.(v.refused.reason) : Ye(v.workshop, { cardId: u });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function gn(s) {
    return { x: s.x - K.x, y: s.y - K.y };
  }
  function Oe(s) {
    return a ? a.places(s, G) : { ...Ne(s, { layout: G }), parts: [] };
  }
  function Rt(s, i) {
    const c = a.places(s, G).parts.find((p) => p.name === i);
    return c ? { x: c.x, y: c.y, width: c.width, height: c.height } : void 0;
  }
  function Kn(s, i) {
    return a ? a.notes(s, G, K, We) : vo(s, { native: !0, origin: K, rows: i, layout: G, style: We }).nodes;
  }
  function Ye(s, i, c) {
    const p = a.editsBetween(t, s);
    if (!p.length) return !1;
    const x = He(t, p);
    return "refused" in x ? (e.announce?.(x.refused.reason), H(o.onRefuse, { ...i, laneId: x.refused.laneId, reason: x.refused.reason }), !1) : (t = x.workshop, z(t, { skip: c }), e.announce?.(x.report.edits.map((l) => l.said).join(" ")), H(o.onChange, t, { ...i, edits: p }), !0);
  }
  function qn(s, i) {
    const c = se(i);
    if (c?.kind === "lane") {
      const p = s.lanes.find((x) => x.id === c.key);
      return p ? `${p.label}, ${pe(s, p.id)}` : null;
    }
    if (c?.kind === "card") {
      const p = s.cards.find((l) => l.id === c.key), x = p && s.lanes.find((l) => l.id === p.laneId);
      return p && x ? `${p.label}, in ${x.label}` : null;
    }
    return c?.kind === "handle" ? a?.label?.(s, ye(i)) ?? null : null;
  }
  function kn(s, i) {
    const c = Kn(s).find((p) => p.options.id === i)?.options;
    return c ? { x: c.xPos, y: c.yPos } : null;
  }
  function $e() {
    (r || I) && e.cancelGovernedDrag?.("host"), r = null, I = null, h && (h = null, H(o.onPreview, null)), V(!1);
  }
  return {
    toCanvas(s) {
      if (w || k || Ge()) return "This workshop is view-only here.";
      if (!t.cards.some((x) => x.id === s)) return "That card is no longer on the board.";
      const i = tn(t, s);
      if (i) return i;
      h && Ie(), C && ($e(), C = null, z(t), e.refreshGovernance?.());
      const { width: c } = Oe(t), p = g.get(oe(X.card(s)))?.options;
      return wn(s, { x: K.x + c + 32, y: p?.y ?? K.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...K };
    },
    get layout() {
      return { ...G };
    },
    get bounds() {
      const { width: s, height: i } = Oe(t);
      return { x: K.x, y: K.y, width: s, height: i };
    },
    setLayout(s) {
      if (w) throw new Error("This workshop has been detached.");
      const i = ot(s);
      a ? a.places(t, i) : Ne(t, { layout: i }), JSON.stringify(i) !== JSON.stringify(G) && ($e(), G = i, z(C ?? t));
    },
    whenDrawn: () => M,
    update(s) {
      if (w) throw new Error("This workshop has been detached.");
      const i = J(s);
      $e(), t = i;
      const c = k;
      k = T || d(t), z(C ?? t), k !== c && e.refreshGovernance?.();
    },
    preview(s) {
      if (w) throw new Error("This workshop has been detached.");
      const i = s ? J(s) : null;
      $e(), C = i, z(C ?? t), e.refreshGovernance?.();
    },
    refuse(s, i) {
      const c = t.lanes.find((p) => p.id === s);
      w || !c || (V(!1), E = { laneId: s, reason: i, timer: setTimeout(() => V(), 1500) }, xe(), e.announce?.(`${c.label}: ${i}`));
    },
    setReadOnly(s) {
      T = !!s;
      const i = T || d(t);
      w || k === i || ($e(), k = i, z(C ?? t), e.refreshGovernance?.());
    },
    destroy() {
      w || ($e(), w = !0, N && clearTimeout(N.timer), e.element?.removeEventListener?.("pointerdown", zn, !0), At?.(), e.withPolicyAuthority(() => {
        for (const [s, i] of $) i.parent.relationships?.removeAssociation(s);
        for (const [s, i] of g)
          e.deselectNode?.(i), i.editor?.cancelInline?.(), e.nodes.one(s) === i && e.nodes.remove(s);
      }), $.clear(), g.clear(), y.clear(), _.clear(), B.clear(), Tt(), m?.destroy(), ne = !1, fn(), e.notifyNodeChanged?.());
    }
  };
}
function H(e, ...n) {
  try {
    return e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function tt(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
  }, () => {
  });
}
function so(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function ot(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function io(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const a of n)
    o = Math.max(o, (a.options.x ?? 0) + (a.options.width ?? 0)), t = Math.min(t, a.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const lo = ["launch-plan", "pipeline", "budget"];
function ee(e) {
  return lo.includes(e.kind) ? e.kind : void 0;
}
function me(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function de(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function pt(e) {
  const n = me(e);
  let o;
  try {
    o = new URL(de(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: de(n.alt, 240) };
}
function ce(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const co = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, uo = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function De(e) {
  const n = me(e), o = {}, t = (d) => {
    if (typeof d != "string" || !co.test(d)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return d;
  }, a = (d, m, I) => {
    if (typeof d != "number" || !Number.isFinite(d) || d < m || d > I) throw new Error("A card size is out of range.");
    return d;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !uo.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = a(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = a(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function fo(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        De({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return De(n);
}
function Rn(e) {
  const n = me(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string" || n.text.length > 400 || /[<>\u0000-\u0009\u000b-\u001f]/.test(n.text)) throw new Error("A card keeps plain words only.");
    o.text = n.text;
  }
  if (n.shape !== void 0) {
    if (typeof n.shape != "string" || !/^[a-z]{1,24}$/i.test(n.shape)) throw new Error("A card keeps a shape by its name only.");
    o.shape = n.shape;
  }
  for (const t of ["width", "height"]) {
    const a = n[t];
    if (a !== void 0) {
      if (typeof a != "number" || !Number.isFinite(a) || a < 10 || a > 4e3) throw new Error("A note size is out of range.");
      o[t] = a;
    }
  }
  return Object.keys(o).length ? o : void 0;
}
function Ce(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Mn({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((a) => a.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function ho(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const _e = (e) => "lane-" + e, ge = (e) => "card-" + e, dn = (e) => "image-" + e;
function Go(e) {
  const n = ho(e);
  return Mn(e).map((o) => {
    const t = e.cards.filter((m) => m.laneId === o.id), a = n.filter((m) => m.laneId === o.id), d = [_e(o.id)];
    return o.station?.image && d.push(dn(o.id)), { lane: o, cards: t, signals: a, nodeIds: [...d, ...t.map((m) => ge(m.id))] };
  });
}
const mt = 5, wt = 24, An = 3;
function J(e) {
  const n = me(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ee(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ee(n), a = t ? we(t) : void 0, d = { id: ce }, m = de(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > mt)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > wt)
    throw new Error("A workshop supports up to 24 cards.");
  if (a && n.cards.length > a.cards[0]) throw new Error(a.cards[1]);
  const I = n.lanes.map((w) => {
    const g = me(w), y = { id: ce(g.id), label: de(g.label) };
    if (g.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (g.capacity !== void 0) {
      const $ = o ? 576 : 24;
      if (typeof g.capacity != "number" || !Number.isInteger(g.capacity) || g.capacity < 1 || g.capacity > $)
        throw new Error(`Lane capacity must be a whole number from 1 to ${$}.`);
      y.capacity = g.capacity;
    }
    if (a?.readLane?.(g, y, d), g.station !== void 0) {
      const $ = me(g.station), _ = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= An)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray($.next) || $.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const B = $.next.map(ce);
      Ce(B, "onward stop"), y.station = { column: _($.column), row: _($.row), next: B, outcome: de($.outcome, 160) }, $.image !== void 0 && (y.station.image = pt($.image));
    }
    return y;
  }), C = I.map((w) => w.id);
  if (Ce(C, "lane ID"), t && I.some((w) => w.station)) throw new Error("A business board has no map stations.");
  if ((o || I.some((w) => w.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (I.some((w) => w.station)) {
    if (!I.every((w) => w.station)) throw new Error("Give every station on the map a position.");
    Ce(I.map((w) => w.station.column + "," + w.station.row), "map position");
    for (const w of I)
      if (w.station.next.some((g) => g === w.id || !C.includes(g))) throw new Error("Connect each stop to another station on this map.");
  }
  const T = n.cards.map((w) => {
    const g = me(w), y = { id: ce(g.id), label: de(g.label), laneId: ce(g.laneId) };
    if (!C.includes(y.laneId)) throw new Error("Card refers to an unknown lane.");
    if (g.allowedLaneIds !== void 0) {
      if (!Array.isArray(g.allowedLaneIds) || g.allowedLaneIds.length > I.length) throw new Error("Invalid allowed lanes.");
      if (y.allowedLaneIds = g.allowedLaneIds.map(ce), Ce(y.allowedLaneIds, "allowed lane"), !y.allowedLaneIds.includes(y.laneId) || !y.allowedLaneIds.every(($) => C.includes($)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (g.look !== void 0) {
      const $ = De(g.look);
      $ && (y.look = $);
    }
    if (g.asNote !== void 0) {
      const $ = Rn(g.asNote);
      $ && (y.asNote = $);
    }
    if (a?.readCard(g, y, d), o) {
      if (typeof g.points != "number" || !Number.isInteger(g.points) || g.points < 1 || g.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (y.points = g.points, g.dependsOn !== void 0) {
        if (!Array.isArray(g.dependsOn) || g.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        y.dependsOn = g.dependsOn.map(ce), Ce(y.dependsOn, "dependency");
      }
    }
    return y;
  });
  Ce(T.map((w) => w.id), "card ID");
  const k = { version: 1, title: m, lanes: I, cards: T };
  if (n.experience !== void 0) {
    const w = me(n.experience);
    if (w.version !== 1 || w.kind !== "customer-interviews" && w.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    k.experience = { version: 1, kind: w.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    k.signals = n.signals.map((w) => {
      const g = me(w), y = ce(g.cardId), $ = ce(g.laneId);
      if (!T.some((_) => _.id === y) || !C.includes($))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ce(g.id),
        label: de(g.label),
        cardId: y,
        laneId: $,
        whenPresent: de(g.whenPresent, 160),
        whenAbsent: de(g.whenAbsent, 160)
      };
    }), Ce(k.signals.map((w) => w.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    k.presentationOrder = Mn({ lanes: I, presentationOrder: n.presentationOrder }).map((w) => w.id);
  }
  if (o)
    return k.kind = "release-plan", Mt(k), k;
  if (t && a) {
    k.kind = t, a.readBoard(n, k, d);
    const w = a.validate(k);
    if (w) throw new Error(w);
    return k;
  }
  for (const w of I)
    if (T.filter((g) => g.laneId === w.id).length > (w.capacity ?? 1 / 0))
      throw new Error(`Lane "${w.label}" exceeds its capacity.`);
  return k;
}
const gt = 65536;
function Uo(e) {
  const n = JSON.stringify(J(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > gt) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function Ko(e) {
  if (e.length > gt) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return J(t);
}
function Wn(e, n, o) {
  const t = ee(e);
  return t ? we(t).planMove(e, n, o) : void 0;
}
function sn(e, n) {
  if (ee(e)) return e.lanes.filter((t) => Wn(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => ln(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((a) => a.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function On(e, n, o) {
  const t = e.cards.find((d) => d.id === n), a = Wn(e, n, o);
  if (a !== void 0) {
    if (!a) throw new Error("Move is unavailable.");
    return a;
  }
  if (t && e.kind === "release-plan") {
    const d = ln(e, t, o);
    if (!d) throw new Error("Move is unavailable.");
    return d;
  }
  if (!t || !sn(e, t).some((d) => d.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((d) => d === t ? { ...t, laneId: o } : d) };
}
function Re(e, n, o) {
  const t = e.cards.find((m) => m.id === n);
  if (!t || !e.lanes.some((m) => m.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return ln(e, t, o);
  const a = Wn(e, n, o);
  if (a !== void 0) return a;
  const d = Io(e, n, o);
  return d || (o === "prototype" && Me(e) === "customer-interviews" ? null : sn(e, t).some((m) => m.id === o) ? On(e, n, o) : null);
}
function rt(e, n) {
  return e.lanes.filter((o) => Re(e, n, o.id) !== null);
}
function en(e, n, o) {
  if (Re(e, n, o) !== null) return null;
  const t = e.cards.find((k) => k.id === n), a = e.lanes.find((k) => k.id === o);
  if (!t || !a) return "That move is not available.";
  const d = ee(e), m = d && we(d).refusal;
  if (m) return m(e, n, o);
  const I = `This card can't go in ${a.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return I;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return I;
    const k = Te(e, o), w = { ...e, lanes: e.lanes.map((y) => y === a ? { id: a.id, label: a.label } : y) }, g = ln(w, t, o);
    return g ? `Needs ${Te(g, o) - k} points. It already holds ${k} of ${a.capacity} points.` : I;
  }
  const C = e.lanes.find((k) => k.id === t.laneId);
  if (C?.station && !C.station.next.includes(o)) return `${a.label} can't be reached from ${C.label}.`;
  const T = e.cards.filter((k) => k.laneId === o).length;
  return a.capacity !== void 0 && T >= a.capacity ? `It already holds ${T} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : I;
}
function nn(e) {
  return (!e.kind || !!ee(e)) && !e.lanes.some((n) => n.station) && !Me(e);
}
const po = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function kt(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && po.test(n) && !o.has(n) ? n : un(e, "card");
}
function Ee(e, n, o) {
  const t = e.lanes.find((m) => m.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((m) => m.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Me(e)) return "This workshop keeps the cards it came with.";
  const a = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!a) return "A card needs some words. Type on the note first.";
  if (ee(e)) {
    const m = yt(e, n, o);
    return typeof m == "string" ? m : null;
  }
  if (a.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(a)) return "A card holds plain words only.";
  if (e.cards.length >= wt) return "A workshop holds up to 24 cards.";
  const d = e.cards.filter((m) => m.laneId === n).length;
  if (t.capacity !== void 0 && d >= t.capacity) return `It already holds ${d} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      De(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  if (o.asNote !== void 0)
    try {
      Rn(o.asNote);
    } catch {
      return "This note's shape or words can't be kept on a card.";
    }
  return null;
}
function je(e, n, o, t) {
  if (Ee(e, n, o) !== null) return null;
  if (ee(e)) {
    const T = yt(e, n, o), k = T.cards[T.cards.length - 1], w = t === void 0 ? -1 : e.cards.findIndex((g) => g.id === t && g.laneId === n);
    return w < 0 ? T : { ...T, cards: [...e.cards.slice(0, w), k, ...e.cards.slice(w)] };
  }
  const a = o.look === void 0 ? void 0 : De(o.look), d = o.asNote === void 0 ? void 0 : Rn(o.asNote), m = {
    id: kt(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: n,
    ...a ? { look: a } : {},
    ...d ? { asNote: d } : {}
  }, I = t === void 0 ? -1 : e.cards.findIndex((T) => T.id === t && T.laneId === n), C = I < 0 ? [...e.cards, m] : [...e.cards.slice(0, I), m, ...e.cards.slice(I)];
  return J({ ...e, cards: C });
}
function yt(e, n, o) {
  const t = we(ee(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const a = He(e, [{ kind: "add_card", lane: { id: n }, ...t }]);
  if ("refused" in a) return a.refused.reason;
  const d = a.workshop.cards;
  return d[d.length - 1] = { ...d[d.length - 1], id: kt(e, o.id) }, a.workshop;
}
function bt(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = ee(e);
  return o ? we(o).cardText(e, n) : n.label;
}
function mo(e, n) {
  const o = ee(e);
  return o ? we(o).noteText(e, n) : n.label;
}
function tn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!nn(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((d) => e.lanes.find((m) => m.id === d).label), a = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${a}, so it stays a card.`;
  }
  return null;
}
function at(e, n) {
  if (tn(e, n) !== null) return null;
  const o = e.cards.filter((t) => t.id !== n).map((t) => {
    if (!t.dependsOn?.includes(n)) return t;
    const a = { ...t, dependsOn: t.dependsOn.filter((d) => d !== n) };
    return a.dependsOn.length || delete a.dependsOn, a;
  });
  return J({ ...e, cards: o });
}
function pe(e, n) {
  const o = e.lanes.find((m) => m.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const m = Te(e, n);
    return o.capacity ? m + " / " + o.capacity + " points" : m + " points";
  }
  const t = ee(e);
  if (t) return we(t).caption(e, n);
  const a = xo(e, n);
  if (a) return "$" + a.amount + " · " + a.description;
  const d = e.cards.filter((m) => m.laneId === n).length;
  return o.capacity !== void 0 ? d + " of " + o.capacity : d + (d === 1 ? " card" : " cards");
}
const cn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, on = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function vt(e, n = cn, o = 28) {
  const { pitch: t, row: a, top: d } = n, m = !!e.lanes[0].station, I = e.lanes.map((k) => e.cards.filter((w) => w.laneId === k.id).length), C = d + Math.max(1, ...I) * a + 36, T = e.lanes.map((k, w) => ({
    x: m ? k.station.column * (t + o) : w * t,
    y: m ? k.station.row * C : 0
  }));
  return {
    points: T,
    width: Math.max(...T.map((k) => k.x)) + t,
    height: Math.max(...T.map((k, w) => k.y + d + (m ? Math.max(1, I[w]) : I[w] + 1) * a))
  };
}
function qo() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function un(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((a) => a.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function It(e) {
  const n = J(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function wo(e, n) {
  const o = It(e), t = un(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), J(o);
}
function go(e, n, o) {
  const t = It(e);
  return t.cards.push({
    id: un(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), J(t);
}
function Jo() {
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
function st(e, n, o) {
  const t = J(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const a = t.lanes.find((k) => k.id === n);
  if (!a?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= mt) throw new Error("A map can have up to five stations.");
  const d = de(o?.label), m = de(o?.outcome, 160), I = un(t, "station");
  let C, T = 1 / 0;
  for (let k = 0; k < An; k++)
    for (let w = 0; w < An; w++) {
      if (t.lanes.some((y) => y.station.column === w && y.station.row === k)) continue;
      const g = Math.abs(a.station.column - w) + Math.abs(a.station.row - k);
      g < T && (T = g, C = { column: w, row: k });
    }
  if (!C) throw new Error("There is no free station position.");
  return a.station.next.push(I), t.lanes.push({ id: I, label: d, station: { ...C, next: [], outcome: m, ...o.image === void 0 ? {} : { image: pt(o.image) } } }), t.presentationOrder?.push(I), t;
}
const Yo = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, xt = (e) => "caption-" + e, Be = (e) => "column-" + e, X = { lane: _e, card: ge, image: dn, caption: xt, column: Be };
function Ct(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Cn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), a = e, d = n;
  return t ? `M ${t} 0 H ${a - t} Q ${a} 0 ${a} ${t} V ${d - t} Q ${a} ${d} ${a - t} ${d} H ${t} Q 0 ${d} 0 ${d - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${a} V ${d} H 0 Z`;
}
function it(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function lt(e, n, o, t) {
  for (let a = n; a > 11; a--) {
    const d = Math.max(1, Math.floor(o / (a * 0.55)));
    if (e.split(`
`).reduce((I, C) => I + Math.max(1, Math.ceil(C.length / d)), 0) * a * 1.3 <= t) return a;
  }
  return Math.min(n, 11);
}
const St = 152, $n = St + 12, ko = 12;
function yo(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function Ne(e, n = {}) {
  const o = J(e), { pitch: t, row: a, top: d } = cn, m = o.lanes.map((g) => o.cards.filter((y) => y.laneId === g.id).length), I = (g) => Math.max(m[g], (Array.isArray(n.rows) ? n.rows[g] : n.rows) ?? 0), C = !!o.lanes[0].station, T = o.lanes.some((g) => g.station?.image), k = yo(n.layout, o.lanes.length), w = [];
  if (C) {
    const { points: g } = vt(o);
    o.lanes.forEach((y, $) => w.push({
      laneId: y.id,
      x: g[$].x,
      y: g[$].y + (T ? y.station.row * $n : 0),
      width: t,
      height: d + (y.station.image ? $n : 0) + Math.max(1, m[$]) * a,
      column: y.station.column,
      row: y.station.row
    }));
  } else {
    let g = 0;
    for (let y = 0; y < o.lanes.length; y += k) {
      const $ = o.lanes.slice(y, y + k), _ = d + (Math.max(...$.map((B, r) => I(y + r))) + 1) * a;
      $.forEach((B, r) => w.push({ laneId: B.id, x: r * t, y: g, width: t, height: _, column: r, row: y / k })), g += _ + ko;
    }
  }
  return { places: w, width: Math.max(...w.map((g) => g.x + g.width)), height: Math.max(...w.map((g) => g.y + g.height)) };
}
function bo(e, n) {
  const { pitch: o, width: t, row: a, height: d, top: m } = cn, I = n.origin ?? { x: 0, y: 0 }, C = !!e.lanes[0].station, { places: T } = Ne(e, n), k = n.style ?? {}, w = k.textColor ?? ze.fontColor, g = k.borderColor ?? ze.borderColor, y = k.borderWidth ?? ze.borderWidth, $ = k.cornerRadius ?? 0, _ = k.fontSize ?? ze.fontSize, B = k.laneFontSize ?? _ + 2, r = k.captionFontSize ?? Math.max(11, _ - 1), h = [], b = (A) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: Cn(A.width, A.height, $),
      foregroundColor: w,
      borderColor: g,
      borderWidth: y,
      ...k.fontFamily ? { fontFamily: k.fontFamily } : {},
      ...A
    }, relationships: { associations: [] } };
    return h.push(E), E;
  };
  e.lanes.forEach((A, E) => {
    const N = T[E], U = I.x + N.x, M = I.y + N.y, Y = A.station?.image;
    b({
      id: Be(A.id),
      text: "",
      name: A.label,
      xPos: U + 2,
      yPos: M,
      width: o - 4,
      height: N.height,
      vectorPath: Cn(o - 4, N.height, $ ? $ + 2 : 0),
      backgroundColor: C ? "#fcf9ed" : it(on[E], 0.6),
      borderColor: C ? "#a8b5aa" : it(on[E], 0.1),
      borderWidth: 1,
      ...C ? { borderStyle: "dashed" } : {}
    }), b({
      id: _e(A.id),
      text: A.label,
      name: A.label,
      xPos: U + 8,
      yPos: M + 6,
      width: t,
      height: 58,
      backgroundColor: on[E],
      fontSize: lt(A.label, B, t - 16, 50)
    }), b({
      id: xt(A.id),
      text: pe(e, A.id),
      name: A.label,
      xPos: U + 8,
      yPos: M + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: r
    }), Y && h.push({ options: {
      id: dn(A.id),
      name: Y.alt,
      text: "",
      xPos: U + 8,
      yPos: M + m,
      width: t,
      height: St,
      shapeHint: "rectangle",
      image: Y.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((G) => G.laneId === A.id).forEach((G, We) => {
      const ae = bt(e, G), ke = C ? t - 20 : t, Ae = C ? d - 6 : d, ne = C ? {} : { ...k.card, ...G.look }, K = C ? $ : k.card?.cornerRadius ?? $;
      b({
        id: ge(G.id),
        text: ae,
        name: G.label,
        xPos: U + (C ? 18 : 8),
        yPos: M + m + (Y ? $n : 0) + We * a,
        width: ke,
        height: Ae,
        ...K !== $ ? { vectorPath: Cn(ke, Ae, K) } : {},
        backgroundColor: C ? "#ffda75" : ne.backgroundColor ?? k.backgroundColor ?? ze.backgroundColor,
        ...ne.textColor ? { foregroundColor: ne.textColor } : {},
        ...ne.fontFamily ? { fontFamily: ne.fontFamily } : {},
        ...ne.borderColor ? { borderColor: ne.borderColor } : {},
        ...ne.borderWidth !== void 0 ? { borderWidth: ne.borderWidth } : {},
        fontSize: lt(ae, ne.fontSize ?? _, ke - 16, Ae - 8)
      });
    });
  });
  const S = new Map(h.map((A) => [A.options.id, A]));
  for (const A of e.lanes)
    A.station && (S.get(Be(A.id)).relationships.associations = A.station.next.map((E) => ({
      id: A.id + "-to-" + E,
      parentId: Be(A.id),
      childId: Be(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const A of e.cards)
      for (const E of A.dependsOn ?? []) {
        const N = ge(E), U = ge(A.id);
        S.get(N).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${A.id}`,
          parentId: N,
          childId: U,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const A = new Set(n.beside), E = new Set(h.map((M) => M.options.id)), N = /* @__PURE__ */ new Map();
    for (const M of [...E]) {
      if (!A.has(M)) continue;
      const Y = Ct(M, (G) => A.has(G) || E.has(G));
      E.add(Y), N.set(M, Y);
    }
    const U = (M) => N.get(M) ?? M;
    for (const M of h) {
      M.options.id = U(M.options.id);
      for (const Y of M.relationships.associations)
        Y.parentId = U(Y.parentId), Y.childId = U(Y.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: h };
}
function vo(e, n) {
  const o = J(e);
  if (n?.native) return bo(o, n);
  const { width: t, row: a, height: d, top: m } = cn, I = [];
  function C(y, $, _, B, r, h) {
    I.push({ options: {
      id: y,
      text: $,
      name: $,
      xPos: _,
      yPos: B,
      width: t,
      height: r,
      shapeHint: "rectangle",
      backgroundColor: h,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: T } = vt(o), k = 152, w = k + 12, g = o.lanes.some((y) => y.station?.image);
  o.lanes.forEach((y, $) => {
    const _ = T[$].x, B = T[$].y + (g ? (y.station?.row ?? 0) * w : 0), r = y.station?.image, h = o.kind === "release-plan" ? y.label + `
` + (y.capacity ? Te(o, y.id) + " / " + y.capacity + " points" : Te(o, y.id) + " points") : y.label;
    C(_e(y.id), h, _, B, m - 12, on[$]), r && I.push({ options: {
      id: dn(y.id),
      name: r.alt,
      text: "",
      xPos: _,
      yPos: B + m,
      width: t,
      height: k,
      shapeHint: "rectangle",
      image: r.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((b) => b.laneId === y.id).forEach((b, S) => C(ge(b.id), bt(o, b), _, B + m + (r ? w : 0) + S * a, d, "#fffdf6"));
  });
  for (const y of o.lanes) {
    if (!y.station) continue;
    const $ = I.find((_) => _.options.id === _e(y.id));
    $.relationships.associations = y.station.next.map((_) => ({ id: y.id + "-to-" + _, parentId: $.options.id, childId: _e(_), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), $.options.text = y.label + `
` + y.station.outcome, $.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const y = new Map(I.map(($) => [$.options.id, $]));
    for (const $ of o.cards)
      for (const _ of $.dependsOn ?? []) {
        const B = ge(_), r = ge($.id);
        y.get(B).relationships.associations.push({
          id: `dependency-${_.length}-${_}-${$.id}`,
          parentId: B,
          childId: r,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: I };
}
const Vo = {
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
}, Pn = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Fn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Zo() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Pn.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Pn.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function Qo() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Fn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Me(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Fn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => Pn.some((a) => a.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Io(e, n, o) {
  const t = Me(e), a = e.cards.find((m) => m.id === n);
  if (!t || !a || a.laneId === o) return null;
  let d = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const m = e.cards.find((I) => I.laneId === o);
    if (m) {
      if (!sn(e, m).some((I) => I.id === "interviews")) return null;
      d = On(e, m.id, "interviews");
    }
  }
  return sn(d, a).some((m) => m.id === o) ? On(d, n, o) : null;
}
function xo(e, n) {
  if (Me(e) !== "experiment-budget") return null;
  const o = Fn.find((d) => d.id === n), t = e.cards.filter((d) => d.laneId === n).length, a = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? a + " " + (a === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  ze as DEFAULT_NOTE_STYLE,
  Bt as WORKSHOP_BOARD_KINDS,
  Xe as WorkshopReferenceError,
  st as addWorkshopBranch,
  go as addWorkshopCard,
  wo as addWorkshopLane,
  He as applyWorkshopEdits,
  Do as attachWorkshop,
  sn as availableLanes,
  lo as businessBoardKinds,
  ee as businessKind,
  Zt as canHangPanel,
  Fn as channels,
  Vt as checkWorkshopReplacement,
  zt as countWord,
  Qo as createBudgetWorkshop,
  Zo as createInterviewWorkshop,
  qo as createLaneWorkshop,
  Jo as createWorkshopMap,
  Ko as decodeWorkshopFragment,
  Bo as describeFocusDarkroom,
  Mo as describeWorkshopEdits,
  Uo as encodeWorkshopFragment,
  $o as handoffSummary,
  zo as hangGalleryPanel,
  Vo as industrialWorkshop,
  Ho as initialFocusDarkroom,
  Pn as interviews,
  on as laneColors,
  Se as listed,
  Ve as listeningRoom,
  Lo as listeningRoomCaption,
  wt as maxWorkshopCards,
  Wo as moonGallery,
  On as moveWorkshopCard,
  Ro as named,
  Yo as nightTransfer,
  jo as normalizeFocusDarkroom,
  Po as normalizeListeningRoom,
  Fo as normalizeMoonGallery,
  To as normalizeOfflineHandoff,
  So as offlineHandoff,
  Io as planStartupMove,
  jt as pointing,
  ft as printFields,
  No as registerWorkshopRules,
  Te as releaseLoad,
  Eo as releasePlan,
  Oo as resolveHandoff,
  ho as resolveWorkshopSignals,
  Ao as reviewHandoff,
  P as said,
  Me as startupExperienceKind,
  En as unquoted,
  J as validateWorkshop,
  rn as workshopBoardKind,
  xo as workshopBudgetResult,
  Re as workshopCandidate,
  at as workshopCardAsNote,
  tn as workshopCardAsNoteRefusal,
  fo as workshopCardLookOf,
  mo as workshopCardNoteText,
  bt as workshopCardText,
  rt as workshopDestinations,
  _n as workshopEditKinds,
  Sn as workshopFinder,
  pe as workshopLaneCaption,
  Ne as workshopLanePlaces,
  cn as workshopLayout,
  X as workshopNodeIds,
  je as workshopNoteCandidate,
  Ee as workshopNoteRefusal,
  vt as workshopPositions,
  Mn as workshopPresentationLanes,
  Go as workshopPresentationScenes,
  Kt as workshopReferences,
  en as workshopRefusal,
  we as workshopRules,
  _o as workshopRulesLoaded,
  Ct as workshopStandInId,
  nn as workshopTakesNotes,
  vo as workshopToSlate
};
