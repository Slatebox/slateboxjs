import { D as He } from "./NoteDefaults-1xFW0br8.mjs";
const $o = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Oo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: a, fieldNote: d, deskNote: p, fallback: v } = e, I = (A) => typeof A == "string" && A.trim().length > 0 && A.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(A);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? a !== "field" && a !== "desk" : a !== null) || a === void 0 || !I(d) || !I(p) || !I(v) ? null : { kind: n, version: o, stage: t, choice: a, fieldNote: d.trim(), deskNote: p.trim(), fallback: v.trim() };
}
function Po(e) {
  return { ...e, stage: "review", choice: null };
}
function Lo(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Eo(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Ze = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function No(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: a, rightLabel: d } = e, p = (v) => typeof v == "string" && v.trim().length > 0 && v.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(v);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !p(a) || !p(d) ? null : { kind: n, version: o, mix: t, leftLabel: a.trim(), rightLabel: d.trim() };
}
function _o({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === Ze.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === Ze.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === Ze.leftLabel && o === Ze.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function $e(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function Ft(e) {
  const n = new Map(e.cards.map((p) => [p.id, p])), o = new Map(e.lanes.map((p, v) => [p.id, v])), t = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  function d(p) {
    if (!t.has(p.id)) {
      if (a.has(p.id)) throw new Error("Release dependencies must be acyclic.");
      a.add(p.id);
      for (const v of p.dependsOn ?? []) {
        const I = n.get(v);
        if (!I) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(I.laneId) > o.get(p.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        d(I);
      }
      a.delete(p.id), t.add(p.id);
    }
  }
  for (const p of e.cards) d(p);
  for (const p of e.lanes) {
    if (p.station) throw new Error("Release windows cannot also be map stations.");
    if ($e(e, p.id) > (p.capacity ?? 1 / 0)) throw new Error(`Release "${p.label}" exceeds its point budget.`);
  }
}
function dn(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((g, y) => [g.id, y])), a = t.get(o);
  if (a === void 0) return null;
  const d = a < t.get(n.laneId), p = /* @__PURE__ */ new Set([n.id]), v = [n];
  for (; v.length; ) {
    const g = v.pop();
    for (const y of e.cards) {
      if (p.has(y.id)) continue;
      const b = t.get(y.laneId);
      (d ? b > a && g.dependsOn?.includes(y.id) : b < a && y.dependsOn?.includes(g.id)) && (p.add(y.id), v.push(y));
    }
  }
  if (e.cards.filter((g) => p.has(g.id)).some((g) => g.allowedLaneIds && !g.allowedLaneIds.includes(o))) return null;
  const A = { ...e, cards: e.cards.map((g) => p.has(g.id) ? { ...g, laneId: o } : g) }, k = e.lanes[a].capacity;
  return k !== void 0 && $e(A, o) > k ? null : A;
}
const Ro = {
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
}, En = /* @__PURE__ */ new Map(), zt = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget" };
function Mo(e) {
  En.set(e.kind, e);
}
function Wo(e) {
  return typeof e == "string" && En.has(e);
}
function ge(e) {
  const n = En.get(e);
  if (!n) throw new Error(`The ${zt[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Ae = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Zn = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Nn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), _n = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Fo = (e) => Nn(_n(e)), jt = [
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
], Ht = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : jt.indexOf(e.toLowerCase()), Bt = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function ut(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (a) => {
    const d = Nn(a);
    d && o.add(d);
  };
  t(e), t(_n(e));
  for (const a of [...o]) t(a.replace(/^(?:the|my|our)\s+/i, ""));
  for (const a of [...o]) t(a.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const a of [...o]) t(a.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const bn = "[^\\p{L}\\p{N}]", Qn = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Zn(n) + "(?:$|" + bn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + bn + ")" + Zn(n) + "(?:$|" + bn + ")", "u").test(e)
], Xn = ["first", "second", "third", "fourth", "fifth"];
function Dt(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Xn.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Nn(_n(n)));
  if (!t) return null;
  const a = (t[1] ?? t[2]).toLowerCase(), d = a === "last" ? e.length - 1 : t[1] ? Xn.indexOf(a) : Ht(a) - 1;
  return e[d] ?? null;
}
function vn(e, n, o, t, a) {
  const d = ut(n, o);
  if (d.some((v) => Bt.test(v))) {
    const v = t && e.find((I) => I.id === t);
    return v ? { item: v, rank: 0 } : { pointing: !0 };
  }
  for (const v of d) {
    if (!v.startsWith("@")) continue;
    const I = e.find((A) => A.id === v.slice(1));
    if (I) return { item: I, rank: 0 };
  }
  for (const [v, I] of Qn.entries())
    for (const A of d) {
      const k = e.filter((g) => I(g.label.toLowerCase(), A.toLowerCase()));
      if (k.length === 1) return { item: k[0], rank: v };
      if (k.length > 1) return { several: k };
    }
  const p = a ? Dt(e, n, o) : null;
  return p ? { item: p, rank: Qn.length } : {};
}
class en extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function Tn(e, n, o, t, a = !1) {
  return { find: (I) => {
    const A = vn(e, I, n, t, a);
    if (A.item) return A.item;
    const k = ut(I, n), g = k[k.length - 1];
    if (A.pointing) throw new en("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (A.several) {
      const b = [...new Set(A.several.map((O) => O.label))];
      throw new en(b.length === 1 ? A.several.length + " " + o + "s are called " + P(b[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + P(g) + ": " + Ae(b.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", A.several.map((O) => O.id));
    }
    const y = e.map((b) => b.label);
    throw new en("There is no " + o + " called " + P(g) + " here." + (y.length && y.length <= 6 ? " The " + o + "s are " + Ae(y.map(P)) + "." : y.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((b) => b.id));
  }, attempt: (I) => vn(e, I, n, t, a).item ?? null, rank: (I) => vn(e, I, n, t, a).rank ?? 1 / 0 };
}
const Gt = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget"], pe = [...Gt], Ne = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], ft = ["launch-plan", "pipeline", "budget"];
function an(e) {
  if (e.lanes[0]?.station) return "map";
  const n = Y(e);
  return n || (e.kind === "release-plan" ? "release-plan" : ze(e) ?? "lanes");
}
const F = {
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
}, An = { "launch-plan": F.launchLanes, pipeline: F.pipelineLanes, budget: F.budgetLanes }, de = (e, n) => Object.fromEntries(pe.filter((o) => !e.includes(o)).map((o) => [o, n])), ae = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), K = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ne = (e) => ({ type: "ref", of: "card", about: e }), xn = (e) => ({ map: e }), fe = de(["map"], F.notMap), he = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), Rn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ae(120, "The new name, 1 to 120 characters of plain text.") },
    boards: pe,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: K("The lane or step."), label: ae(80, "The new name, 1 to 80 characters of plain text.") },
    boards: pe,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ne("The card or token."), label: ae(80, "The new name, 1 to 80 characters of plain text.") },
    boards: pe,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ae(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, map: F.mapAddLane, ...An }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: K("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, ...An }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: K("The lane or step it starts in."),
      label: ae(80, "What the card says. On a map it may be left out: the token is numbered.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: he("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: he("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: he("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...ft],
    refusals: { "release-plan": F.releaseCards, "customer-interviews": F.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ne("The card or token.") },
    boards: pe,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: ne("The card or token."), lane: K("Where it goes.") },
    boards: pe,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ne("The token.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: K("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: pe.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": F.launchLanes, budget: F.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ne("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: Ne,
    refusals: { ...xn(F.mapCardLanes), ...de([...Ne, "map"], F.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ne("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...de(["release-plan"], F.notPoints), map: F.mapPoints }
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
    refusals: { ...de(["release-plan"], F.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ne("The card."),
      lane: K("The lane."),
      whenPresent: ae(160, "What it says when the card is there."),
      whenAbsent: ae(160, "What it says otherwise."),
      label: ae(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: Ne,
    refusals: { ...xn(F.mapOutcome), ...de([...Ne, "map"], F.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ne("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: Ne,
    refusals: { ...xn(F.mapOutcome), ...de([...Ne, "map"], F.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: pe,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: K("The lane or step."), before: K("Present it just before this one.", !0), after: K("Present it just after this one.", !0) },
    boards: pe,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: K("The step it follows."), label: ae(80, "The new step’s name."), outcome: ae(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: K("The step it goes in front of."),
      from: K("Only the path from this step is taken over.", !0),
      label: ae(80, "The new step’s name."),
      outcome: ae(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: K("Where the path starts."), to: K("Where it leads.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: K("Where the path starts."), to: K("Where it leads.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: K("The step."), outcome: ae(160, "What it says.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: K("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: K("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: K("The step."), alt: ae(240, "What the picture shows.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: ne("The task."), duration: he("Its days, 1 to 60.", 60, 1, !0), lag: he("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: de(["launch-plan"], F.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ne("The task that waits."), waitsOn: ne("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: de(["launch-plan"], F.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ne("The task that waits."), waitsOn: ne("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: de(["launch-plan"], F.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: he("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: de(["launch-plan"], F.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ne("The deal or line item."), amount: he("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: de(["pipeline", "budget"], F.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: he("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: de(["pipeline"], F.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: K("The team giving."), to: K("The team receiving."), amount: he("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: de(["budget"], F.notBudget)
  }
], Ut = new Map(Rn.map((e) => [e.kind, e])), Kt = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function qt(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: Kt(e.max, n) }, e.nullable), description: e.about };
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
const ht = (e) => "optional" in e && e.optional === !0;
function zo(e) {
  const n = e ? an(J(e)) : void 0;
  return Rn.map((o) => {
    const t = Object.entries(o.fields), a = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, p]) => !ht(p)).map(([p]) => p)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([p, v]) => [p, qt(v, n)])) }
    }, d = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: a };
    return n && (d.accepted = o.boards.includes(n), d.accepted || (d.refusal = o.refusals[n])), d;
  });
}
const Qe = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function Jt(e, n) {
  const o = !!e.lanes[0]?.station, t = Tn(e.lanes, o ? Qe.step : Qe.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), a = Tn(e.cards, o ? Qe.token : Qe.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: a };
  const d = (p) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (p) => d(p) ?? a.find(p),
    attempt: (p) => d(p) ?? a.attempt(p),
    rank: (p) => d(p) ? 0 : a.rank(p)
  } };
}
class _ {
  constructor(n, o, t = null, a, d, p) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = a, this.candidates = d, this.limits = p;
  }
}
function sn(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function G(e, n, o = null, t) {
  try {
    return J(e);
  } catch (a) {
    throw new _(sn(a instanceof Error ? a.message : String(a), n), "refused", o, t);
  }
}
function Yt(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, a] of Object.entries(n.fields)) {
    const d = e[t];
    if (d === void 0) {
      if (ht(a)) continue;
      return n.kind + " needs " + t + ".";
    }
    const p = n.kind + " needs " + t + " as ";
    switch (a.type) {
      case "text":
        if (typeof d != "string") return p + "text.";
        break;
      case "ref":
        if (!o(d)) return p + "an id or a name.";
        break;
      case "refs":
        if (d === null && a.nullable) break;
        if (!Array.isArray(d) || d.length > a.max || !d.every(o)) return p + "a list of up to " + a.max + " ids or names" + (a.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (d === null && a.nullable) break;
        if (typeof d != "number" || !Number.isFinite(d)) return p + "a number" + (a.nullable ? " or null." : ".");
        break;
      case "image":
        if (d === null) break;
        if (!d || typeof d != "object" || typeof d.src != "string" || typeof d.alt != "string" || Object.keys(d).some((v) => v !== "src" && v !== "alt")) return p + "{src, alt} or null.";
        break;
      case "choice":
        if (!a.values.includes(d)) return p + a.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function Vt(e, n, o, t) {
  const a = structuredClone(e), d = o === "map", p = o === "release-plan", v = Jt(a, t), I = { lane: d ? "step" : "lane", card: d ? "token" : "card" };
  function A(r, f, x, S, $ = null) {
    if (typeof x == "object") {
      const E = r.find((H) => H.id === x.id);
      if (!E) throw new _("That " + S + " is no longer on the workshop.", "gone", $);
      return E;
    }
    const R = r.find((E) => E.id === x);
    if (R) return R;
    try {
      return f.find(x);
    } catch (E) {
      if (!(E instanceof en)) throw E;
      const H = E.reason === "ambiguous" ? "ambiguous_reference" : E.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new _(E.message, H, $, void 0, E.candidates.length ? E.candidates : void 0);
    }
  }
  const k = (r, f = null) => A(a.lanes, v.lanes, r, "lane", f), g = (r, f = null) => A(a.cards, v.cards, r, "card", f), y = (r) => {
    try {
      return k(r);
    } catch {
      return null;
    }
  }, b = (r, f, x = {}, S = !0) => ({ board: r, said: f, changed: S, ...x }), O = (r) => a.cards.filter((f) => f.laneId === r).length, N = (r) => d ? "The presentation opens with " + P(r[0].label) + "." : "The presentation now runs " + r.map((f) => P(f.label)).join(", then ") + ".";
  if (ft.includes(o)) {
    n.kind === "add_card" && et(n, o, k(n.lane).id);
    const r = {
      card: (x) => g(x),
      lane: (x) => k(x),
      refuse: (x, S = {}) => {
        throw new _(x, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (x, S = null, $) => G(x, o, S, $),
      done: (x, S, $) => b(x, S, $)
    }, f = ge(o).edit(a, n, r);
    if (f) return f;
  }
  switch (n.kind) {
    case "rename_workshop": {
      a.title = n.title;
      const r = G(a, o);
      return b(r, "Renamed the " + (d ? "map" : "workshop") + " to " + P(r.title) + ".");
    }
    case "rename_lane": {
      const r = k(n.lane), f = r.label;
      r.label = n.label;
      const x = G(a, o, r.id);
      return b(x, "Renamed " + P(f) + " to " + P(x.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = g(n.card), f = r.label;
      r.label = n.label;
      const x = G(a, o, r.laneId, r.id);
      return b(x, "Renamed " + P(f) + " to " + P(x.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new _("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new _("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = ko(a, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new _(sn(x.message, o), "refused");
      }
      const f = r.lanes[r.lanes.length - 1];
      return b(r, "Added the lane " + P(f.label) + ".", { laneId: f.id });
    }
    case "remove_lane": {
      const r = k(n.lane), f = a.cards.filter((x) => x.laneId === r.id);
      if (d) {
        if (f.length) throw new _(P(f[0].label) + " is at " + P(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new _("A map needs at least two steps.", "refused", r.id);
      } else {
        if (f.length) throw new _(P(r.label) + " holds " + f.length + (f.length === 1 ? " card" : " cards") + ". Move or remove " + (f.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new _("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((x) => x !== r);
      for (const x of a.lanes) x.station && (x.station.next = x.station.next.filter((S) => S !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((x) => x !== r.id));
      for (const x of a.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((S) => S !== r.id));
      return Xe(a, (x) => x.laneId === r.id), b(G(a, o), "Removed the " + I.lane + " " + P(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = k(n.lane);
      if (d) {
        if (n.allowedLanes !== void 0) throw new _(F.mapCardLanes, "not_on_this_board", r.id);
        let $ = n.label;
        if ($ === void 0) {
          let B = a.cards.length + 1;
          for (; a.cards.some((U) => U.label === "Token " + B); ) B++;
          $ = "Token " + B;
        }
        const R = new Set([...a.lanes, ...a.cards].map((B) => B.id));
        let E = 1;
        for (; R.has("token-" + E); ) E++;
        a.cards.push({ id: "token-" + E, label: $, laneId: r.id });
        const H = G(a, o, r.id);
        return b(H, "Added " + P(H.cards[H.cards.length - 1].label) + " at " + P(r.label) + ".", { laneId: r.id, cardId: "token-" + E });
      }
      if (et(n, o, r.id), n.label === void 0 || !n.label.trim()) throw new _("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new _("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && O(r.id) >= r.capacity)
        throw new _(P(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const f = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => k($).id))];
      let x;
      try {
        x = bo(a, r.id, { label: n.label, ...f && { allowedLaneIds: f } });
      } catch ($) {
        throw new _(sn($.message, o), "refused", r.id);
      }
      const S = x.cards[x.cards.length - 1];
      return b(x, "Added " + P(S.label) + " to " + P(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = g(n.card);
      if (d && a.cards.length === 1) throw new _("A map needs at least one token.", "refused", r.laneId, r.id);
      if (p && a.cards.length === 1) throw new _("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && a.cards.length === 1) throw new _("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((f) => f !== r);
      for (const f of a.cards)
        f.dependsOn?.includes(r.id) && (f.dependsOn = f.dependsOn.filter((x) => x !== r.id), f.dependsOn.length || delete f.dependsOn);
      return Xe(a, (f) => f.cardId === r.id), b(G(a, o, r.laneId), "Removed the " + I.card + " " + P(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? a.lanes.find((S) => S.id === n.lane.id) ?? null : y(n.lane), f = g(n.card, r?.id ?? null), x = k(n.lane, f.laneId);
      return D(f, x);
    }
    case "advance_card": {
      const r = g(n.card), f = a.lanes.find((S) => S.id === r.laneId), x = f.station.next.map((S) => a.lanes.find(($) => $.id === S)).filter((S) => !!S);
      if (!x.length) throw new _(P(r.label) + " is at " + P(f.label) + ", and no path leads on from there.", "refused", f.id, r.id);
      if (x.length > 1)
        throw new _("From " + P(f.label) + " the path goes to " + x.map((S) => P(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + x[0].label + "”.", "refused", f.id, r.id);
      return D(r, x[0]);
    }
    case "set_lane_capacity": {
      const r = k(n.lane), f = d ? "token" : p ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, b(G(a, o, r.id), d ? "Removed the limit at " + P(r.label) + "." : P(r.label) + " now holds any number of " + f + "s.", { laneId: r.id });
      const x = p ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > x)
        throw new _((d ? "A step" : "A lane") + " can hold from 1 to " + x + " " + f + "s.", "refused", r.id);
      const S = p ? a.cards.reduce(($, R) => $ + (R.laneId === r.id ? R.points ?? 1 : 0), 0) : O(r.id);
      if (S > n.capacity)
        throw new _(P(r.label) + " already holds " + S + " " + f + (S === 1 ? "" : "s") + ". Move some " + (d ? "on" : "out") + " first, or choose a higher " + (p ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, b(G(a, o, r.id), P(r.label) + " now holds up to " + n.capacity + " " + f + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = g(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, b(G(a, o, r.laneId, r.id), P(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const f = [...new Set(n.lanes.map((S) => k(S)))], x = a.lanes.find((S) => S.id === r.laneId);
      if (!f.includes(x)) throw new _(P(r.label) + " is in " + P(x.label) + " now. Include " + P(x.label) + ", or move the card first.", "refused", x.id, r.id);
      return r.allowedLaneIds = f.map((S) => S.id), b(G(a, o, r.laneId, r.id), P(r.label) + " can now go only in " + Ae(f.map((S) => P(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = g(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new _("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, b(G(a, o, r.laneId, r.id), P(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = g(n.card), f = [...new Set(n.dependsOn.map((S) => g(S)))], x = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = f.filter(($) => r.dependsOn?.includes($.id));
        if (!S.length) throw new _(P(r.label) + " does not depend on " + Ae(f.map(($) => P($.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter(($) => !S.some((R) => R.id === $)), r.dependsOn.length || delete r.dependsOn, b(G(a, o, r.laneId, r.id), P(r.label) + " no longer depends on " + Ae(S.map(($) => P($.label))) + ".", x);
      }
      if (!f.length) {
        if (n.mode === "add") throw new _("Name the features " + P(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, b(G(a, o, r.laneId, r.id), P(r.label) + " no longer depends on anything.", x);
      }
      if (f.includes(r)) throw new _("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...f.map((S) => S.id)])], b(G(a, o, r.laneId, r.id), P(r.label) + " now depends on " + Ae(f.map((S) => P(S.label))) + ".", x);
    }
    case "set_outcome": {
      const r = g(n.card), f = k(n.lane), x = a.signals ?? (a.signals = []), S = n.label, $ = S === void 0 ? x.filter((B) => B.cardId === r.id && B.laneId === f.id) : x.filter((B) => B.cardId === r.id && B.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && $.length > 1) throw new _("Two outcomes on this card have that name.", "refused", f.id, r.id);
      if (!$.length && x.length >= 24) throw new _("A workshop can have up to 24 outcomes. Remove one first.", "refused", f.id, r.id);
      let R = 1;
      for (; x.some((B) => B.id === "signal-" + R); ) R++;
      const H = { label: S ?? $[0]?.label ?? (r.label + " in " + f.label).slice(0, 80).trim(), cardId: r.id, laneId: f.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], H) : x.push({ id: "signal-" + R, ...H }), b(G(a, o, f.id, r.id), "When " + P(r.label) + " is in " + P(f.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: f.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = g(n.card), f = (a.signals ?? []).filter((x) => x.cardId === r.id);
      if (n.outcome === void 0) {
        if (!f.length) throw new _(P(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        Xe(a, (x) => x.cardId === r.id);
      } else {
        const x = A(f, Tn(f, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        Xe(a, (S) => S.id === x.id);
      }
      return b(G(a, o, r.laneId, r.id), "Removed the outcome from " + P(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((f) => k(f));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new _("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((f) => f.id), b(G(a, o), N(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new _("Say before or after, not both.", "invalid_edit");
      const r = k(n.lane), f = n.before ?? n.after, x = f === void 0 ? void 0 : k(f);
      if (x && x.id === r.id) throw new _("Choose two different scenes.", "refused", r.id);
      const S = Wn(a).filter(($) => $.id !== r.id);
      return S.splice(x ? S.findIndex(($) => $.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = S.map(($) => $.id), b(G(a, o, r.id), N(S), { laneId: r.id });
    }
    case "add_station": {
      const r = k(n.from);
      let f;
      try {
        f = lt(a, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new _(S.message, "refused", r.id);
      }
      const x = f.lanes[f.lanes.length - 1];
      return b(f, "Added a path from " + P(r.label) + " to " + P(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const r = k(n.before), f = n.from === void 0 ? void 0 : k(n.from), x = f ? [f] : a.lanes.filter((R) => R.station.next.includes(r.id));
      if (f && !f.station.next.includes(r.id))
        throw new _("There is no path from " + P(f.label) + " to " + P(r.label) + ". Try “Add " + n.label + " after " + f.label + "”.", "refused", f.id);
      if (!x.length) throw new _("Nothing leads to " + P(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = lt(a, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (R) {
        throw new _(R.message, "refused", r.id);
      }
      const $ = S.lanes[S.lanes.length - 1];
      for (const R of S.lanes)
        x.some((E) => E.id === R.id) && (R.station.next = [...new Set(R.station.next.map((E) => E === r.id ? $.id : E))]);
      return $.station.next = [r.id], b(G(S, o, $.id), "Added " + P($.label) + " before " + P(r.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const r = k(n.from), f = k(n.to);
      if (r.id === f.id) throw new _("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(f.id) ? b(a, P(r.label) + " already leads to " + P(f.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(f.id), b(G(a, o, r.id), "Connected " + P(r.label) + " to " + P(f.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = k(n.from), f = k(n.to);
      if (!r.station.next.includes(f.id)) throw new _("There is no path between " + P(r.label) + " and " + P(f.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((x) => x !== f.id), b(G(a, o, r.id), "Removed the path from " + P(r.label) + " to " + P(f.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = k(n.station);
      return r.station.outcome = n.outcome, b(G(a, o, r.id), "Changed what happens at " + P(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = k(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), b(G(a, o, r.id), "Moved " + P(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = k(n.station);
      return n.image === null ? (delete r.station.image, b(G(a, o, r.id), "Removed the image at " + P(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, b(G(a, o, r.id), "Updated the image at " + P(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = k(n.station);
      if (!r.station.image) throw new _("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, b(G(a, o, r.id), "Updated the image description at " + P(r.label) + ".", { laneId: r.id });
    }
  }
  throw new _("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function D(r, f) {
    const x = { laneId: f.id, cardId: r.id };
    if (r.laneId === f.id)
      return b(e, P(r.label) + " is already " + (d ? "at " : "in ") + P(f.label) + ".", x, !1);
    const S = Fe(e, r.id, f.id);
    if (!S) throw new _(nn(e, r.id, f.id) ?? "That move is not available.", "refused", f.id, r.id);
    return b(G(S, o, f.id, r.id), "Moved " + P(r.label) + " to " + P(f.label) + ".", x);
  }
}
function et(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount"].find((a) => e[a] !== void 0 && !(n === "launch-plan" ? a !== "amount" : (n === "pipeline" || n === "budget") && a === "amount"));
  if (t) throw new _(t === "amount" ? F.notAmounts : F.notTasks, "not_on_this_board", o);
}
function Xe(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function _e(e, n, o = {}) {
  const t = (A) => ({ refused: { index: 0, kind: null, laneId: null, ...A } });
  let a;
  try {
    a = J(e);
  } catch (A) {
    return t({ reason: "The workshop cannot be read: " + (A instanceof Error ? A.message : String(A)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const d = a, p = [];
  for (const [A, k] of n.entries()) {
    const g = k?.kind, y = typeof g == "string" ? Ut.get(g) : void 0;
    if (!k || typeof k != "object" || !y)
      return t({
        index: A,
        kind: typeof g == "string" ? g : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(g)) + ". The edits are " + Ae(Rn.map((r) => r.kind)) + "."
      });
    const b = Yt(k, y);
    if (b) return t({ index: A, kind: y.kind, code: "invalid_edit", reason: b });
    const O = an(a);
    if (!y.boards.includes(O))
      return t({ index: A, kind: y.kind, code: "not_on_this_board", reason: y.refusals[O] ?? "This workshop does not take " + y.kind + "." });
    let N;
    try {
      N = Vt(a, k, O, o.selection);
    } catch (r) {
      if (!(r instanceof _)) throw r;
      return t({
        index: A,
        kind: y.kind,
        reason: r.reason,
        code: r.code,
        laneId: r.laneId,
        ...r.cardId && { cardId: r.cardId },
        ...r.candidates && { candidates: r.candidates },
        ...r.limits && { limits: r.limits }
      });
    }
    const D = Xt(a, N.board);
    if (D) return t({ index: A, kind: y.kind, reason: D, code: "not_on_this_board", laneId: N.laneId ?? null });
    a = N.board, p.push({
      index: A,
      kind: y.kind,
      said: N.said,
      changed: N.changed ?? !0,
      ...N.laneId && { laneId: N.laneId },
      ...N.cardId && { cardId: N.cardId }
    });
  }
  const v = new Map(d.cards.map((A) => [A.id, A.laneId])), I = a.cards.flatMap((A) => {
    const k = v.get(A.id);
    return k === void 0 || k === A.laneId ? [] : [{ cardId: A.id, fromLaneId: k, toLaneId: A.laneId }];
  });
  return { workshop: a, report: { edits: p, movedCards: I } };
}
function Zt(e, n) {
  const o = Y(e);
  if (o === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const t = e.lanes.find((a) => {
      const d = n.lanes.find((p) => p.id === a.id);
      return a.role !== d.role || a.probability !== d.probability;
    });
    if (t) return `${t.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (o === "budget") {
    const t = e.budget, a = n.budget;
    if (!a || t.total !== a.total || t.currency !== a.currency || t.step !== a.step) return "The total cannot change. Move money between teams instead.";
    const d = e.lanes.find((p) => {
      const v = n.lanes.find((I) => I.id === p.id);
      return p.floor !== v.floor || p.cap !== v.cap || p.capacity !== v.capacity;
    });
    if (d) return `${d.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((a) => a.id === t.id).capacity) ? F.launchLanes : null;
}
const Qt = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map",
  "launch-plan": "launch plan",
  pipeline: "sales pipeline",
  budget: "budget"
};
function Xt(e, n) {
  const o = J(e), t = an(o);
  let a;
  try {
    a = J(n);
  } catch (I) {
    return sn(I instanceof Error ? I.message : String(I), t);
  }
  const d = an(a), p = (I, A) => I.lanes.length === A.lanes.length && I.lanes.every((k) => A.lanes.some((g) => g.id === k.id)), v = (I, A) => I.lanes.every((k, g) => A.lanes[g]?.id === k.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && d !== t)
    return p(o, a) ? F.keepsCards : F.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !v(o, a)) return F.keepsOrder;
  if (Y(o) && d === t && !(p(o, a) && v(o, a))) return An[t];
  if (Y(o) && d === t) {
    const I = Zt(o, a);
    if (I) return I;
  }
  if (t === "release-plan" && d === "release-plan") {
    if (!p(o, a)) return F.releaseLanes;
    if (!v(o, a)) return F.releaseOrder;
    if (a.cards.some((I) => !o.cards.some((A) => A.id === I.id))) return F.releaseCards;
  }
  return t !== d ? "This slate holds a " + Qt[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
const jo = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Ho(e) {
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
    const p = /* @__PURE__ */ new Set([d.id]);
    let v = d.after;
    for (; v !== null; ) {
      if (p.has(v) || !t.has(v) || a.includes(d.id) && !a.includes(v)) return null;
      p.add(v), v = t.get(v).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: a };
}
function eo(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function Bo(e, n) {
  return eo(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const pt = ["firstPrint", "secondPrint", "thirdPrint"], mt = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Do(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...mt, route: n.route };
  for (const t of pt) {
    const a = n[t];
    if (typeof a != "string" || !a.trim() || a.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = a.trim();
  }
  return o;
}
function Go(e = new URLSearchParams()) {
  const n = { ...mt };
  for (const t of pt) {
    const a = e.get(t)?.trim();
    a && a.length <= 48 && (n[t] = a);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function Uo(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function no(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = ao(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), oo(n), n;
}
function to(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function oo(e) {
  return e && to(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function nt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function ro(e) {
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
function ao(e) {
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
const tt = "#1f7a5c", ot = "#5b9a85", Cn = "#c2410c", so = "#2f5fd0", io = { canMove: !1, canSelect: !1 };
function lo(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function Ko(e, n, o = {}) {
  let t = J(n);
  const a = o.kit, d = (s) => !!Y(s) && !a;
  if (d(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const p = a?.layer(e);
  let v = null, I = null, A = !!o.readOnly, k = A || d(t), g = !1;
  const y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let r = null, f = null, x = null, S = null;
  const $ = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
  let E = null, H = null;
  function B(s, i) {
    H && clearTimeout(H.timer), H = { name: s, reason: i, timer: setTimeout(() => {
      H = null, g || z(I ?? t);
    }, 3e3) };
  }
  let U = Promise.resolve(), te = null, V = at(o.layout);
  const Oe = { ...o.style };
  let oe = /* @__PURE__ */ new Map(), be = /* @__PURE__ */ new Set(), se = null, ve = !1;
  Pe(t);
  const q = o.origin ? { x: o.origin.x, y: o.origin.y } : uo(e), ye = (s) => D.get(s) ?? s, ie = (s) => lo(ye(s));
  function re(s) {
    const i = N.get(s);
    if (i) return i;
    if (y.has(s) && !D.has(s) || !e.nodes.one?.(s)) return s;
    const u = Tt(s, (m) => !!e.nodes.one?.(m) || D.has(m));
    return N.set(s, u), D.set(u, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${u}".`), u;
  }
  const xe = {
    governs(s) {
      if (y.get(s.id) !== s) return null;
      const i = ie(s.id)?.kind;
      return i === "card" ? { canMove: !k, canEditText: !k && !I && t.kind !== "release-plan" } : i === "lane" ? { canMove: !1, canEditText: !k && !I } : i === "handle" ? { canMove: !k && !I, canEditText: !1 } : io;
    },
    onStart(s, i) {
      const u = ie(s.id), m = { x: i.x - (s.options.x ?? 0), y: i.y - (s.options.y ?? 0) };
      if (u.kind === "handle") {
        const l = !k && !I && a ? a.handleDrag(t, ye(s.id), m, V) : null;
        return l ? (Z(), Ce(), H && (clearTimeout(H.timer), H = null), v = { name: ye(s.id), follow: l, last: null }, !0) : !1;
      }
      const C = u.key;
      if (k || I || !t.cards.some((l) => l.id === C)) return !1;
      Z(), Ce();
      let c = null;
      try {
        c = (a?.chooser ?? o.chooseCandidate)?.(t, C, m, V) ?? null;
      } catch (l) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", l);
      }
      return r = { cardId: C, evaluate: c, grab: m, outcome: { kind: "home" } }, z(t, { skip: C }), !0;
    },
    onMove(s, i) {
      if (v) {
        v.last = v.follow(yn(i)), z(v.last.next, { grip: v.name }), j(o.onPreview, v.last.next === t ? null : v.last.next);
        return;
      }
      if (!r) return;
      const u = Hn(r.cardId, i, r.evaluate);
      if (co(u, r.outcome)) return;
      r.outcome = u;
      const m = u.kind === "candidate" ? u.next : null;
      z(m ?? t, { skip: r.cardId }), j(o.onPreview, m);
    },
    onEnd(s, i) {
      if (v) {
        const { follow: l, name: h } = v, w = l(yn(i));
        v = null, j(o.onPreview, null), w.refusal ? (B(h, w.refusal), z(t), e.announce?.(w.refusal), j(o.onRefuse, { laneId: null, reason: w.refusal })) : Ve(w.next, {}) || z(t);
        const L = kn(t, h);
        return L ? { accept: !0, settle: L } : { accept: !1 };
      }
      if (!r) return { accept: !1 };
      const { cardId: u, evaluate: m } = r, C = Hn(u, i, m), c = t.cards.find((l) => l.id === u);
      if (r = null, j(o.onPreview, null), C.kind === "candidate" && a) {
        if (!Ve(C.next, { cardId: u, laneId: C.laneId }, u))
          return z(t, { skip: u }), { accept: !1 };
        const l = kn(t, ye(s.id));
        return l ? { accept: !0, settle: l } : { accept: !0 };
      }
      if (C.kind === "candidate") {
        t = C.next, z(t, { skip: u });
        const l = t.lanes.find((w) => w.id === C.laneId);
        e.announce?.(`${c.label} moved to ${l.label}. ${me(t, l.id)}.`), j(o.onChange, t, { cardId: u, laneId: C.laneId });
        const h = kn(t, ye(s.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (C.kind === "refused")
        Rt(c.label, { cardId: u, laneId: C.laneId, reason: C.reason });
      else if (C.kind === "outside" && tn(t) && !Ue()) {
        const l = on(t, u);
        if (!l)
          return gn(u, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        z(t, { skip: u }), e.announce?.(l), j(o.onRefuse, { cardId: u, laneId: null, reason: l });
      } else
        z(t, { skip: u }), C.kind === "outside" && (e.announce?.(`${c.label} was not dropped on a lane. It stays where it was.`), j(o.onRefuse, { cardId: u, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (v) {
        v = null, j(o.onPreview, null), z(t);
        return;
      }
      const i = r && t.cards.find((u) => u.id === r.cardId);
      r = null, j(o.onPreview, null), z(t, { skip: ie(s.id)?.key }), i && e.announce?.(`Move cancelled. ${i.label} stays where it was.`);
    },
    onTextCommit(s, i, u) {
      const m = ie(s.id);
      if (!m || k || I) return !1;
      let C = i.replace(/\s+/g, " ").trim();
      const c = [], l = Y(t), h = l && m.kind === "card" ? ge(l).renamed(t, m.key, C) : null;
      h && (C = h.label, c.push(...h.edits));
      const w = m.kind === "lane" ? { laneId: m.key, label: C } : { cardId: m.key, label: C };
      c.unshift(m.kind === "lane" ? { kind: "rename_lane", lane: { id: m.key }, label: C } : { kind: "rename_card", card: { id: m.key }, label: C });
      const L = _e(t, c);
      if ("refused" in L) {
        const { reason: T } = L.refused;
        return e.announce?.(`${u} keeps its name. ${T}`), j(o.onRefuse, { ...m.kind === "lane" ? { laneId: m.key } : { cardId: m.key }, rename: w, reason: T }), !1;
      }
      return JSON.stringify(L.workshop) === JSON.stringify(t) ? (z(t), !1) : (t = L.workshop, z(t), e.announce?.(h ? L.report.edits.map((T) => T.said).join(" ") : `${u} renamed to ${C}.`), j(o.onChange, t, { rename: w, ...a ? { edits: c } : {} }), h ? !1 : C);
    },
    onKeyDown(s, i) {
      const u = ie(s.id);
      if (k || I || r || v || i.ctrlKey || i.metaKey || i.altKey) return !1;
      if (x && (x.node !== s.id || !["Enter", "Escape"].includes(i.key) && i.key.toLowerCase() !== x.key) && Dn(), x && i.key === "Escape")
        return i.preventDefault(), Dn(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (x && i.key === "Enter") {
        i.preventDefault();
        const l = x.choices[x.at];
        return x = null, j(o.onPreview, null), t = l.next, z(t), e.announce?.(l.done), j(o.onChange, t, { ...u?.kind === "card" ? { cardId: u.key } : {}, edits: l.edits }), !0;
      }
      const m = a?.keyChoices?.(t, ye(s.id), i.key);
      if (m) {
        i.preventDefault();
        const l = [], h = [];
        for (const T of typeof m == "string" ? [] : m) {
          const M = _e(t, T.edits);
          "refused" in M ? h.push(`${T.said}: ${M.refused.reason}`) : l.push({ ...T, next: M.workshop, done: M.report.edits.map((W) => W.said).join(" ") });
        }
        if (!l.length)
          return e.announce?.(typeof m == "string" ? m : h.join(" ")), !0;
        const w = x && x.node === s.id ? (x.at + 1) % l.length : 0;
        x = { node: s.id, key: i.key.toLowerCase(), choices: l, at: w }, z(l[w].next), j(o.onPreview, l[w].next);
        const L = l.length > 1 ? ` (${w + 1} of ${l.length}). Press ${i.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${l[w].said}${L} Enter to make it, Escape to cancel.`), !0;
      }
      const C = a?.keyEdit?.(t, ye(s.id), { key: i.key, shiftKey: i.shiftKey });
      if (C) {
        i.preventDefault();
        const l = _e(t, C);
        return "refused" in l ? (e.announce?.(l.refused.reason), j(o.onRefuse, { laneId: l.refused.laneId, ...u?.kind === "card" ? { cardId: u.key } : {}, reason: l.refused.reason })) : Ve(l.workshop, u?.kind === "card" ? { cardId: u.key } : {}), !0;
      }
      if (u?.kind !== "card") return !1;
      const c = t.cards.find((l) => l.id === u.key);
      if (!c) return !1;
      if (i.key === "ArrowLeft" || i.key === "ArrowRight")
        return i.preventDefault(), Bn(c.id, i.key === "ArrowLeft" ? -1 : 1), !0;
      if ((i.key === "ArrowUp" || i.key === "ArrowDown") && Pt())
        return i.preventDefault(), Bn(c.id, i.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (f?.cardId !== c.id) return !1;
      if (i.key === "Enter") {
        i.preventDefault();
        const { laneId: l, next: h, spot: w } = f;
        if (f = null, l === null)
          return j(o.onPreview, null), gn(c.id, w), !0;
        const L = t;
        t = h, z(t), Ie(l), j(o.onPreview, null);
        const T = t.lanes.find((M) => M.id === l);
        return e.announce?.(`${c.label} moved to ${T.label}. ${me(t, l)}.`), j(o.onChange, t, { cardId: c.id, laneId: l, ...a ? { edits: a.editsBetween(L, t) } : {} }), !0;
      }
      return i.key === "Escape" ? (i.preventDefault(), Ce(), e.announce?.(`Move cancelled. ${c.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((i) => y.get(i.id) === i).map((i) => i.id);
      ve = s.length === 1, y.clear(), b.clear(), O.clear(), N.clear(), D.clear(), r = null, f = null, z(I ?? t, { animate: !1 }), s.length === 1 && (U = U.then(() => {
        ve = !1;
        const i = y.get(s[0]);
        if (!g && i && !(e.getSelectedNodes?.() ?? []).length) {
          const u = () => e.selectNodes?.([i]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(u) : u();
        }
        hn();
      }));
    }
  };
  xe.onFreeMove = (s, i) => {
    if (!Ke() || s.options?.isComment) return pn();
    const u = qe(i), m = Je(s), C = t.lanes.filter((l) => !je(s) && Re(t, l.id, m) === null).map((l) => l.id), c = u ? je(s) ?? Re(t, u, m) : null;
    S && S.noteId === s.id && S.laneId === u && S.refusal === c || (S = { noteId: s.id, laneId: u, refusal: c, open: C }, Se());
  }, xe.onFreeDrop = (s, i, u) => {
    if (pn(), !Ke() || s.options?.isComment) return;
    const m = qe(i);
    if (!m) return;
    const C = Je(s), c = t.lanes.find((h) => h.id === m), l = je(s) ?? Re(t, m, C);
    return l ? (Z(!1), E = { laneId: m, reason: l, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${mn(C.label)} can't go in ${c.label}. ${l}`), j(o.onRefuse, { noteId: s.id, laneId: m, reason: l }), "refused") : (wn([{ node: s, offer: C, from: u }], m), "taken");
  }, xe.onFreeGroupDrop = (s, i, u) => {
    if (pn(), !Ke() || s.some((h) => h.options?.isComment)) return;
    const m = qe(i);
    if (!m) return;
    const C = t.lanes.find((h) => h.id === m), c = s.map((h) => ({ node: h, offer: Je(h) })), l = Et(c, m);
    if (l) {
      Z(!1), E = { laneId: m, reason: l, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${Gn(c.map((h) => mn(h.offer.label)))} can't go in ${C.label}. ${l}`);
      for (const { node: h } of c) j(o.onRefuse, { noteId: h.id, laneId: m, reason: l });
      return "refused";
    }
    return wn(c.map((h, w) => ({ ...h, from: u?.[w] })), m), "taken";
  }, xe.onFreeTextCommit = (s) => {
    if (!Ke() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const i = s.options ?? {}, u = qe({ x: (i.x ?? 0) + (i.width ?? 0) / 2, y: (i.y ?? 0) + (i.height ?? 0) / 2 });
    if (!u) return;
    const m = Je(s), C = t.lanes.find((L) => L.id === u), c = je(s) ?? Re(t, u, m);
    if (!c) {
      wn([{ node: s, offer: m }], u);
      return;
    }
    Z(!1), E = { laneId: u, reason: c, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${mn(m.label)} can't go in ${C.label}. ${c} It is beside the board.`), j(o.onRefuse, { noteId: s.id, laneId: u, reason: c });
    const { width: l } = Pe(t), h = Math.round(q.x + l + 32), w = Math.round(i.y ?? q.y);
    s.position(h, w, () => e.updateSelectionResizeRotate?.(), void 0, In() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [nt({ ...s.options, x: h, y: w })] });
  }, xe.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...$] }), xe.onUndoRestore = (s, i) => {
    if (g) return;
    const u = new Map((s?.cards ?? []).map((c) => [c.id, c])), m = new Map(s?.pairs ?? []), C = (c) => $.get(c) ?? m.get(c) ?? c;
    for (const c of i.added) {
      const l = C(c), h = t.cards.find((w) => w.id === l);
      h && (t = J({ ...t, cards: t.cards.filter((w) => w !== h) }), z(t), rt(j(o.onChange, t, { cardId: l, cardToNote: { noteId: c } })));
    }
    for (const c of i.removed) {
      const l = C(c), h = u.get(l);
      if (!h || t.cards.some((W) => W.id === l)) continue;
      const w = { id: l, label: h.label, ...h.look ? { look: h.look } : {}, ...h.asNote ? { asNote: h.asNote } : {} }, L = [h.laneId, ...t.lanes.map((W) => W.id)].find((W) => Be(t, W, w));
      if (!L) {
        e.announce?.(`${h.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Nt(Be(t, L, w), l, s?.cards ?? []), l !== c && $.set(c, l), z(t);
      const T = t.cards.findIndex((W) => W.id === l), M = t.cards.slice(T + 1).find((W) => W.laneId === L)?.id;
      rt(j(o.onChange, t, { cardId: l, laneId: L, noteToCard: {
        noteId: c,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...M ? { before: M } : {}
      } }));
    }
  };
  const $t = e.setDragPolicy(xe), Ot = o.onSelect && e.onSelectionChange?.(() => hn()), jn = () => {
    f && Ce();
  };
  e.element?.addEventListener?.("pointerdown", jn, !0), z(t, { animate: !1 });
  function Hn(s, i, u) {
    const m = t.cards.find((T) => T.id === s);
    if (!m) return { kind: "outside" };
    if (a) {
      const T = yn(i), M = a.refusalAt(t, s, r?.grab ?? { x: 0, y: 0 }, T, V);
      if (M) return { kind: "refused", ...M };
      const { width: W, height: le } = Pe(t);
      if (T.x < -40 || T.y < -40 || T.x > W + 40 || T.y > le + 40) return { kind: "outside" };
      let Q = t;
      try {
        Q = u?.(T) ?? t;
      } catch (Ee) {
        console.warn("WORKSHOP: the board kit's chooser threw", Ee);
      }
      return JSON.stringify(Q) === JSON.stringify(t) ? { kind: "home" } : { kind: "candidate", laneId: Q.cards.find((Ee) => Ee.id === s)?.laneId ?? m.laneId, next: Q };
    }
    const C = t.lanes.map((T) => y.get(re(ee.column(T.id)))).filter(Boolean), c = e.hitTestNodes(i, C, { padding: 6 }), l = c ? ie(c.id).key : null;
    if (!l) return { kind: "outside" };
    if (l === m.laneId) return { kind: "home" };
    const h = Fe(t, s, l);
    if (!h) return { kind: "refused", laneId: l, reason: nn(t, s, l) ?? "That move is not available." };
    if (!u) return { kind: "candidate", laneId: l, next: h };
    let w = null;
    try {
      w = u({ x: i.x - q.x, y: i.y - q.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: l, next: h };
    }
    const L = w?.cards.find((T) => T.id === s)?.laneId;
    return !w || !L || L === m.laneId ? { kind: "home" } : { kind: "candidate", laneId: L, next: w };
  }
  function Pt() {
    return a ? !1 : new Set(Me(t, { layout: V }).places.map((s) => s.row)).size > 1;
  }
  function Bn(s, i, u = !1) {
    const m = t.cards.find((T) => T.id === s), C = st(t, s), c = f?.cardId === s && f.laneId === null ? f.side : void 0;
    if (c !== void 0) {
      if (u || i === c) return;
      const T = c > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Ce(), T.id === m.laneId) {
        Ie(T.id, I ?? t), e.announce?.(`${m.label} is back in ${T.label}.`);
        return;
      }
      if (C.includes(T)) {
        const W = Fe(t, s, T.id);
        f = { cardId: s, laneId: T.id, next: W }, z(W), Ie(T.id, W), j(o.onPreview, W), e.announce?.(`${m.label} to ${T.label}: ${me(W, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const M = nn(t, s, T.id) ?? "That move is not available.";
      Z(), E = { laneId: T.id, reason: M, timer: setTimeout(() => Z(), 1500) }, z(I ?? t), Ie(T.id, I ?? t), e.announce?.(`${m.label} can't move to ${T.label}. ${M}`), j(o.onRefuse, { cardId: s, laneId: T.id, reason: M });
      return;
    }
    const l = f?.cardId === s ? f.laneId : m.laneId;
    let h;
    if (u) {
      const { places: T } = Me(t, { layout: V }), M = T.find((W) => W.laneId === l);
      h = T.filter((W) => W.column === M.column && (W.row - M.row) * i > 0).sort((W, le) => (W.row - le.row) * i).map((W) => t.lanes.find((le) => le.id === W.laneId));
    } else {
      const T = t.lanes.findIndex((M) => M.id === l);
      h = i > 0 ? t.lanes.slice(T + 1) : t.lanes.slice(0, T).reverse();
    }
    const w = h.find((T) => C.includes(T));
    if (Z(), !w) {
      const T = h[0];
      if (!T) {
        if (!u && tn(t)) {
          const W = on(t, s);
          if (W) {
            e.announce?.(W), j(o.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          Lt(m, i);
          return;
        }
        e.announce?.(`${m.label} has no lane to move to on that side.`);
        return;
      }
      const M = nn(t, s, T.id) ?? "That move is not available.";
      E = { laneId: T.id, reason: M, timer: setTimeout(() => Z(), 1500) }, z(f?.next ?? I ?? t), Ie(T.id, f?.next ?? I ?? t), e.announce?.(`${m.label} can't move to ${T.label}. ${M}`), j(o.onRefuse, { cardId: s, laneId: T.id, reason: M });
      return;
    }
    if (w.id === m.laneId) {
      Ce(), Ie(w.id, I ?? t), e.announce?.(`${m.label} is back in ${w.label}.`);
      return;
    }
    const L = Fe(t, s, w.id);
    f = { cardId: s, laneId: w.id, next: L }, z(L), Ie(w.id, L), j(o.onPreview, L), e.announce?.(`${m.label} to ${w.label}: ${me(L, w.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ie(s, i = t) {
    const u = a ? Wt(i, ee.column(s)) : Me(i, { layout: V, rows: qn() }).places.find((w) => w.laneId === s), m = e.canvas?.viewbox?.();
    if (!u || !m || !(m.width > 0) || !(m.height > 0)) return;
    const C = 16, c = (w, L, T, M) => L + C * 2 >= M || w - C < T ? w - C - T : w + L + C > T + M ? w + L + C - (T + M) : 0, l = c(q.x + u.x, u.width, m.x, m.width), h = c(q.y + u.y, u.height, m.y, m.height);
    (l || h) && e.panBy?.({ x: l, y: h });
  }
  function hn() {
    if (!o.onSelect || ve) return;
    const s = g ? [] : e.getSelectedNodes?.() ?? [], i = s.length === 1 && y.get(s[0].id) === s[0] ? ie(s[0].id) : null, u = i?.kind === "card" ? { cardId: i.key } : i?.kind === "lane" ? { laneId: i.key } : null, m = u ? JSON.stringify(u) : null;
    m !== se && (se = m, j(o.onSelect, u));
  }
  function Dn() {
    x && (x = null, z(t), j(o.onPreview, null));
  }
  function Ce() {
    f && (f = null, j(o.onPreview, null), z(I ?? t));
  }
  function Lt(s, i) {
    const { width: u } = Pe(t), m = y.get(re(ee.card(s.id)))?.options, C = m?.width ?? 228, c = { x: i > 0 ? q.x + u + 32 : q.x - C - 32, y: m?.y ?? q.y }, l = it(t, s.id);
    f = { cardId: s.id, laneId: null, side: i, spot: c, next: t }, z(t), j(o.onPreview, l), e.announce?.(`${s.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ue() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ke() {
    return !g && !k && !I && !r && !Ue() && tn(t);
  }
  function pn() {
    S && (S = null, g || Se());
  }
  function qe(s) {
    const i = t.lanes.map((m) => y.get(re(ee.column(m.id)))).filter(Boolean), u = e.hitTestNodes(s, i, { padding: 6 });
    return u ? ie(u.id)?.key ?? null : null;
  }
  function Je(s) {
    const i = s.options ?? {}, u = mo({
      backgroundColor: i.backgroundColor,
      textColor: i.fontColor,
      fontFamily: i.fontFamily,
      fontSize: i.fontSize,
      borderColor: i.borderColor,
      borderWidth: i.borderWidth
    }), m = String(i.text ?? ""), C = m.replace(/\s+/g, " ").trim(), c = {};
    m.trim() !== C && m.length <= 400 && (c.text = m.trim()), typeof i.shape == "string" && /^[a-z]{1,24}$/i.test(i.shape) && (c.shape = i.shape);
    for (const l of ["width", "height"]) Number.isFinite(i[l]) && i[l] >= 10 && i[l] <= 4e3 && (c[l] = Math.round(i[l]));
    return { id: s.id, label: C, ...u ? { look: u } : {}, ...Object.keys(c).length ? { asNote: c } : {} };
  }
  function Gn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function Et(s, i) {
    for (const { node: c } of s) {
      const l = je(c);
      if (l) return l;
    }
    const u = t.lanes.find((c) => c.id === i), m = t.cards.filter((c) => c.laneId === i).length;
    if (u.capacity !== void 0 && m + s.length > u.capacity) {
      const c = u.capacity - m;
      return c > 0 ? `It has room for ${c} more ${c === 1 ? "card" : "cards"}.` : `It already holds ${m} of ${u.capacity} ${u.capacity === 1 ? "card" : "cards"}.`;
    }
    let C = t;
    for (const { offer: c } of s) {
      const l = Re(C, i, c);
      if (l) return l;
      C = Be(C, i, c);
    }
    return null;
  }
  function je(s) {
    return (s.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((u) => u !== s && (u.relationships?.associations ?? []).some((m) => m.child === s || m.childId === s.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : s.options?.image ? "A note with a picture stays a note." : s.options?.link?.show && s.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const mn = (s) => s || "This note";
  function wn(s, i) {
    let u = t;
    const m = s.map(({ node: l, offer: h, from: w }) => {
      u = Be(u, i, h);
      const L = { ...l.options ?? {}, ...w ? { x: w.x, y: w.y } : {} };
      return { node: l, card: u.cards[u.cards.length - 1], kept: L };
    });
    e.beginHostStep?.(), t = u;
    let C = t;
    for (const { node: l, card: h } of m)
      h.id !== l.id && $.set(l.id, h.id), R.set(re(ee.card(h.id)), { x: l.options?.x ?? 0, y: l.options?.y ?? 0 }), Ye(() => e.removeNode(l.id));
    e.endHostStep?.(), z(t), _t(re(ee.card(m[0].card.id)));
    const c = t.lanes.find((l) => l.id === i);
    e.announce?.(m.length === 1 ? `${m[0].card.label} is now a card in ${c.label}. ${me(t, i)}.` : `${Gn(m.map(({ card: l }) => l.label))} are now cards in ${c.label}. ${me(t, i)}.`);
    for (const { node: l, card: h, kept: w } of m) {
      const L = { cardId: h.id, laneId: i, noteToCard: {
        noteId: l.id,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {}
      } }, T = () => {
        t !== C || !t.cards.some((M) => M.id === h.id) || (t = J({ ...t, cards: t.cards.filter((M) => M.id !== h.id) }), C = t, z(t));
      };
      Un(j(o.onChange, t, L), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: l.id, isComment: !1 } }]);
      }, () => {
        if (!g) {
          if (T(), !e.nodes.one(w.id)) {
            e.beginHostStep?.();
            const M = Ye(() => e.addNode({ ...w }));
            M && (M.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${h.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        g || (T(), e.announce?.(`Someone else put ${h.label} on the board first.`));
      });
    }
  }
  function gn(s, i) {
    const u = t.cards.find((X) => X.id === s), m = t.lanes.find((X) => X.id === u.laneId), C = t.cards.findIndex((X) => X.id === s), c = t.cards.slice(C + 1).find((X) => X.laneId === u.laneId)?.id, l = it(t, s), h = b.get(re(ee.card(s))) ?? {}, w = e.nodes.one(s) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : s, L = (Oe.cornerRadius ?? 0) > 0, T = u.asNote, M = T?.text !== void 0 && T.text.replace(/\s+/g, " ").trim() === u.label ? T.text : yo(t, u), W = {
      id: w,
      x: Math.round(i.x),
      y: Math.round(i.y),
      width: T?.width ?? h.width ?? 228,
      height: T?.height ?? h.height ?? 76,
      text: M,
      shape: T?.shape ?? (L ? "roundedrectangle" : "rectangle"),
      backgroundColor: u.look?.backgroundColor ?? h.backgroundColor,
      fontColor: u.look?.textColor ?? h.foregroundColor,
      fontSize: u.look?.fontSize ?? h.fontSize,
      borderColor: u.look?.borderColor ?? h.borderColor,
      borderWidth: u.look?.borderWidth ?? h.borderWidth,
      ...u.look?.fontFamily ?? h.fontFamily ? { fontFamily: u.look?.fontFamily ?? h.fontFamily } : {}
    };
    for (const X of Object.keys(W)) W[X] === void 0 && delete W[X];
    e.beginHostStep?.(), t = l;
    const le = t;
    w !== s ? $.set(w, s) : $.delete(w);
    const Q = Ye(() => e.addNode(W));
    Q && (Q.announcedByCreator = !0), e.endHostStep?.(), z(t), Q?.ready?.then?.(() => {
      if (g || e.nodes.one(w) !== Q) return;
      const X = () => e.selectNodes?.([Q]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(X) : X();
    }), e.announce?.(`${u.label} is now a note on the canvas. ${m.label}: ${me(t, m.id)}.`);
    const Ee = () => {
      e.nodes.one(w) === Q && (e.beginHostStep?.(), Ye(() => e.removeNode(w)), e.endHostStep?.());
    };
    Un(j(o.onChange, t, { cardId: s, cardToNote: { noteId: w } }), () => {
      Q && e.nodes.one(w) === Q && e.sendHeld?.([{ type: "onNodeAdded", data: { id: w, nodeOptions: nt(Q.options) } }]);
    }, () => {
      if (!g) {
        if (Ee(), t === le && !t.cards.some((X) => X.id === s)) {
          const X = { id: s, label: u.label, ...u.look ? { look: u.look } : {}, ...u.asNote ? { asNote: u.asNote } : {} }, Vn = Be(t, u.laneId, X, c);
          Vn && (t = Vn, z(t));
        }
        e.announce?.(`${u.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      g || (Ee(), e.announce?.(`Someone else took ${u.label} off the lanes first.`));
    });
  }
  function Nt(s, i, u) {
    const m = u.map((w) => w.id), C = m.indexOf(i), c = s.cards.find((w) => w.id === i);
    if (C < 0 || !c) return s;
    const l = s.cards.filter((w) => w !== c), h = l.findIndex((w) => m.indexOf(w.id) > C);
    return l.splice(h < 0 ? l.length : h, 0, c), J({ ...s, cards: l });
  }
  function _t(s) {
    U = U.then(() => {
      const i = y.get(s);
      if (g || !i) return;
      const u = () => e.selectNodes?.([i]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(u) : u();
    });
  }
  function Ye(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Un(s, i, u, m) {
    if (!s || typeof s.then != "function") return i();
    const C = s.then((c) => {
      c === !0 ? i() : c === !1 ? u() : c === "taken" && m();
    }, () => u());
    e.holdUntil?.(C);
  }
  function Rt(s, i) {
    Z(!1), E = { laneId: i.laneId, reason: i.reason, timer: setTimeout(() => Z(), 1500) }, z(t, { skip: i.cardId });
    const u = t.lanes.find((m) => m.id === i.laneId);
    e.announce?.(`${s} can't move to ${u?.label ?? "that lane"}. ${i.reason}`), j(o.onRefuse, i);
  }
  function Z(s = !0) {
    E && (clearTimeout(E.timer), E = null, s && !g && Se());
  }
  function Se() {
    z(r && r.outcome.kind === "candidate" ? r.outcome.next : f?.next ?? I ?? t, { skip: r?.cardId });
  }
  function Kn(s) {
    const i = Jn(s, qn()), u = new Map(i.map((c) => [c.options.id, c.options])), m = (c, l, h, w = !1) => {
      const L = u.get(ee.column(c));
      L && (L.borderColor = l, L.borderWidth = h, delete L.borderStyle);
      const T = w && u.get(ee.lane(c));
      T && (T.borderColor = l, T.borderWidth = h);
    }, C = r?.cardId ?? f?.cardId;
    if (oe = /* @__PURE__ */ new Map(), C) {
      const c = t.cards.find((w) => w.id === C)?.laneId, l = st(t, C);
      if (!a || a.laneCues)
        for (const w of l) w.id !== c && (m(w.id, ot, 2), oe.set(w.id, "open"));
      if (a?.laneCues) {
        for (const w of t.lanes) if (!l.includes(w)) {
          const L = u.get(ee.column(w.id));
          L && (L.backgroundColor = "#e9e8e2"), oe.set(w.id, "closed");
        }
      }
      const h = r ? r.outcome : f?.laneId ? { kind: "candidate", laneId: f.laneId } : null;
      h?.kind === "candidate" && (m(h.laneId, tt, 3, !0), oe.set(h.laneId, "over")), h?.kind === "refused" && (m(h.laneId, Cn, 3), oe.set(h.laneId, "refused"));
    }
    if (S && !C) {
      for (const c of S.open) c !== S.laneId && (m(c, ot, 2), oe.set(c, "open"));
      S.laneId && !S.refusal && (m(S.laneId, tt, 3, !0), oe.set(S.laneId, "over")), S.laneId && S.refusal && (m(S.laneId, Cn, 3), oe.set(S.laneId, "refused"));
    }
    if (f?.laneId === null && f.spot) {
      const c = u.get(ee.card(f.cardId));
      c && (c.xPos = f.spot.x, c.yPos = f.spot.y);
    }
    if (E) {
      oe.set(E.laneId, "refused"), m(E.laneId, Cn, 3, !0);
      const c = u.get(ee.caption(E.laneId));
      c && (c.text = E.reason, c.foregroundColor = "#b42318");
    }
    if (be = /* @__PURE__ */ new Set(), I && s === I) {
      const c = (h, w) => JSON.stringify(h) === JSON.stringify(w), l = (h) => {
        const w = u.get(h);
        w && (w.borderStyle = "dashed", w.borderColor = so, w.borderWidth = 2, be.add(re(h)));
      };
      for (const h of s.cards) c(h, t.cards.find((w) => w.id === h.id)) || l(ee.card(h.id));
      for (const h of s.lanes) c(h, t.lanes.find((w) => w.id === h.id)) || l(ee.lane(h.id));
    }
    for (const c of i) {
      c.options.id = re(c.options.id);
      for (const l of c.relationships.associations)
        l.parentId = re(l.parentId), l.childId = re(l.childId);
    }
    return i;
  }
  function qn() {
    return r || f ? t.lanes.map((s) => t.cards.filter((i) => i.laneId === s.id).length) : void 0;
  }
  function z(s, i = {}) {
    if (g) return;
    te = { model: s, skip: i.skip, grip: i.grip, animate: i.animate !== !1 };
    const u = Kn(s), m = [];
    for (const { options: c } of u) {
      const l = c.id;
      if (y.has(l)) continue;
      const h = R.get(l);
      R.delete(l);
      const w = h && i.animate !== !1 && !In() ? { ...c, xPos: h.x, yPos: h.y } : c, L = e.nodes.add(no(w));
      y.set(l, L), b.set(l, { ...w }), L.ready && m.push(L.ready.then(() => {
        if (y.get(l) !== L) return;
        L.applyGovernance?.(), ie(l)?.kind === "column" && L.toBack?.(!1), ie(l)?.kind === "handle" && L.svgGroup?.front?.();
        const T = Yn(te?.model ?? s, l);
        T && L.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const C = te;
    U = Promise.all([U, ...m]).then(() => {
      g || te !== C || Mt(Kn(C.model), C);
    }).catch((c) => console.warn("WORKSHOP: could not draw the workshop", c));
  }
  function Mt(s, i) {
    const u = new Set(s.map((C) => C.options.id)), m = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [c, l] of [...y]) {
        if (u.has(c)) continue;
        for (const [w, L] of [...O])
          L.parentId !== c && L.childId !== c || (L.parent.relationships?.removeAssociation(w), O.delete(w));
        e.deselectNode?.(l), l.editor?.cancelInline?.(), y.delete(c), b.delete(c);
        const h = D.get(c);
        h && (D.delete(c), N.delete(h)), e.nodes.remove(c);
      }
      for (const { options: c } of s) {
        const l = c.id, h = y.get(l);
        if (!h?.svgGroup) continue;
        const w = b.get(l) ?? {}, L = h.editor?.isInlineEditing?.();
        (c.fontSize !== w.fontSize || c.foregroundColor !== w.foregroundColor) && (h.options.fontSize = c.fontSize, h.options.fontColor = c.foregroundColor, h.applyTextStyle?.()), c.text !== w.text && !L && h.setText?.(c.text), (c.width !== w.width || c.height !== w.height) && (c.vectorPath ? (h.options.width = c.width, h.options.height = c.height, h.setShape?.(h.options.shape, c.vectorPath), ie(l)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(c.width, c.height)), c.backgroundColor !== w.backgroundColor && h.setColors?.(c.backgroundColor), (c.borderColor !== w.borderColor || c.borderWidth !== w.borderWidth || c.borderStyle !== w.borderStyle) && (h.options.borderColor = c.borderColor, h.options.borderWidth = c.borderWidth, h.options.borderStyle = c.borderStyle, h.applyBorder?.());
        const T = c.xPos !== w.xPos || c.yPos !== w.yPos || Math.abs((h.options.x ?? 0) - c.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - c.yPos) > 0.5;
        if (l !== (i.skip && re(ee.card(i.skip))) && l !== (i.grip && re(i.grip)) && T) {
          const le = i.animate && !In() ? 180 : 0, Q = m.includes(h) ? () => {
            !g && y.get(l) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Q && le && m.length === 1 && h.resizeRotate?.disable?.(), h.position(c.xPos, c.yPos, Q, void 0, le);
        }
        const M = Yn(i.model, l);
        M && h.svgGroup.node.getAttribute("aria-label") !== M && h.svgGroup.node.setAttribute("aria-label", M), be.has(l) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed");
        const W = ie(l);
        if (W?.kind === "column") {
          const le = oe.get(W.key);
          le ? h.svgGroup.node.setAttribute("data-workshop-drop", le) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        W?.kind === "handle" && h.svgGroup.front?.(), b.set(l, { ...c });
      }
      const C = /* @__PURE__ */ new Map();
      for (const c of s) for (const l of c.relationships.associations) C.set(l.id, l);
      for (const [c, l] of [...O])
        C.has(c) && y.get(l.parentId) === l.parent && y.get(l.childId) === l.child || (l.parent.relationships?.removeAssociation(c), O.delete(c));
      for (const [c, l] of C) {
        if (O.has(c)) continue;
        const h = y.get(l.parentId), w = y.get(l.childId);
        !h?.relationships || !w?.svgGroup || (h.relationships.addAssociation(w, ro(l)), O.set(c, { parentId: l.parentId, childId: l.childId, parent: h, child: w }));
      }
    }), p) {
      const C = t.lanes.map((w) => y.get(re(ee.column(w.id)))?.svgGroup?.node).reduce((w, L) => L && (!w || w.compareDocumentPosition(L) & 4) ? L : w, null), c = i.model, l = e.canvas?.viewbox?.(), h = l && [l.x, l.y, l.width, l.height].every(Number.isFinite) ? { x: l.x - q.x, y: l.y - q.y, width: l.width, height: l.height } : null;
      p.draw(t, c === t ? null : c, {
        origin: q,
        layout: V,
        above: C,
        view: h,
        announce: (w) => e.announce?.(w),
        clamp: v?.last?.clampedReason ? { name: v.name, text: v.last.clampedReason } : !v && H ? { name: H.name, text: H.reason } : null,
        refused: !!v?.last?.refusal || !v && !!H,
        onUnlink: (w, L) => {
          if (k || I || r || v || Ue()) return;
          const T = _e(t, [{ kind: "unlink_tasks", card: { id: w }, waitsOn: { id: L } }]);
          "refused" in T ? e.announce?.(T.refused.reason) : Ve(T.workshop, { cardId: w });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function yn(s) {
    return { x: s.x - q.x, y: s.y - q.y };
  }
  function Pe(s) {
    return a ? a.places(s, V) : { ...Me(s, { layout: V }), parts: [] };
  }
  function Wt(s, i) {
    const u = a.places(s, V).parts.find((m) => m.name === i);
    return u ? { x: u.x, y: u.y, width: u.width, height: u.height } : void 0;
  }
  function Jn(s, i) {
    return a ? a.notes(s, V, q, Oe) : Co(s, { native: !0, origin: q, rows: i, layout: V, style: Oe }).nodes;
  }
  function Ve(s, i, u) {
    const m = a.editsBetween(t, s);
    if (!m.length) return !1;
    const C = _e(t, m);
    return "refused" in C ? (e.announce?.(C.refused.reason), j(o.onRefuse, { ...i, laneId: C.refused.laneId, reason: C.refused.reason }), !1) : (t = C.workshop, z(t, { skip: u }), e.announce?.(C.report.edits.map((c) => c.said).join(" ")), j(o.onChange, t, { ...i, edits: m }), !0);
  }
  function Yn(s, i) {
    const u = ie(i);
    if (u?.kind === "lane") {
      const m = s.lanes.find((C) => C.id === u.key);
      return m ? `${m.label}, ${me(s, m.id)}` : null;
    }
    if (u?.kind === "card") {
      const m = s.cards.find((c) => c.id === u.key), C = m && s.lanes.find((c) => c.id === m.laneId);
      return m && C ? `${m.label}, in ${C.label}${a?.cardKeys ? ". " + a.cardKeys : ""}` : null;
    }
    return u?.kind === "handle" ? a?.label?.(s, ye(i)) ?? null : null;
  }
  function kn(s, i) {
    const u = Jn(s).find((m) => m.options.id === i)?.options;
    return u ? { x: u.xPos, y: u.yPos } : null;
  }
  function Le() {
    (r || v) && e.cancelGovernedDrag?.("host"), r = null, v = null, f && (f = null, j(o.onPreview, null)), Z(!1);
  }
  return {
    toCanvas(s) {
      if (g || k || Ue()) return "This workshop is view-only here.";
      if (!t.cards.some((C) => C.id === s)) return "That card is no longer on the board.";
      const i = on(t, s);
      if (i) return i;
      f && Ce(), I && (Le(), I = null, z(t), e.refreshGovernance?.());
      const { width: u } = Pe(t), m = y.get(re(ee.card(s)))?.options;
      return gn(s, { x: q.x + u + 32, y: m?.y ?? q.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...q };
    },
    get layout() {
      return { ...V };
    },
    get bounds() {
      const { width: s, height: i } = Pe(t);
      return { x: q.x, y: q.y, width: s, height: i };
    },
    setLayout(s) {
      if (g) throw new Error("This workshop has been detached.");
      const i = at(s);
      a ? a.places(t, i) : Me(t, { layout: i }), JSON.stringify(i) !== JSON.stringify(V) && (Le(), V = i, z(I ?? t));
    },
    whenDrawn: () => U,
    update(s) {
      if (g) throw new Error("This workshop has been detached.");
      const i = J(s);
      Le(), t = i;
      const u = k;
      k = A || d(t), z(I ?? t), k !== u && e.refreshGovernance?.();
    },
    preview(s) {
      if (g) throw new Error("This workshop has been detached.");
      const i = s ? J(s) : null;
      Le(), I = i, z(I ?? t), e.refreshGovernance?.();
    },
    refuse(s, i) {
      const u = t.lanes.find((m) => m.id === s);
      g || !u || (Z(!1), E = { laneId: s, reason: i, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${u.label}: ${i}`));
    },
    setReadOnly(s) {
      A = !!s;
      const i = A || d(t);
      g || k === i || (Le(), k = i, z(I ?? t), e.refreshGovernance?.());
    },
    destroy() {
      g || (Le(), g = !0, H && clearTimeout(H.timer), e.element?.removeEventListener?.("pointerdown", jn, !0), Ot?.(), e.withPolicyAuthority(() => {
        for (const [s, i] of O) i.parent.relationships?.removeAssociation(s);
        for (const [s, i] of y)
          e.deselectNode?.(i), i.editor?.cancelInline?.(), e.nodes.one(s) === i && e.nodes.remove(s);
      }), O.clear(), y.clear(), b.clear(), N.clear(), D.clear(), $t(), p?.destroy(), ve = !1, hn(), e.notifyNodeChanged?.());
    }
  };
}
function j(e, ...n) {
  try {
    return e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function rt(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
  }, () => {
  });
}
function co(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function at(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function uo(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const a of n)
    o = Math.max(o, (a.options.x ?? 0) + (a.options.width ?? 0)), t = Math.min(t, a.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const fo = ["launch-plan", "pipeline", "budget"];
function Y(e) {
  return fo.includes(e.kind) ? e.kind : void 0;
}
function we(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ce(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function wt(e) {
  const n = we(e);
  let o;
  try {
    o = new URL(ce(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: ce(n.alt, 240) };
}
function ue(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const ho = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, po = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Ge(e) {
  const n = we(e), o = {}, t = (d) => {
    if (typeof d != "string" || !ho.test(d)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return d;
  }, a = (d, p, v) => {
    if (typeof d != "number" || !Number.isFinite(d) || d < p || d > v) throw new Error("A card size is out of range.");
    return d;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !po.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = a(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = a(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function mo(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        Ge({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Ge(n);
}
function Mn(e) {
  const n = we(e), o = {};
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
function Te(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Wn({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((a) => a.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function wo(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const We = (e) => "lane-" + e, ke = (e) => "card-" + e, cn = (e) => "image-" + e;
function qo(e) {
  const n = wo(e);
  return Wn(e).map((o) => {
    const t = e.cards.filter((p) => p.laneId === o.id), a = n.filter((p) => p.laneId === o.id), d = [We(o.id)];
    return o.station?.image && d.push(cn(o.id)), { lane: o, cards: t, signals: a, nodeIds: [...d, ...t.map((p) => ke(p.id))] };
  });
}
const gt = 5, yt = 24, $n = 3;
function J(e) {
  const n = we(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !Y(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = Y(n), a = t ? ge(t) : void 0, d = { id: ue }, p = ce(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > gt)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > yt)
    throw new Error("A workshop supports up to 24 cards.");
  if (a && n.cards.length > a.cards[0]) throw new Error(a.cards[1]);
  const v = n.lanes.map((g) => {
    const y = we(g), b = { id: ue(y.id), label: ce(y.label) };
    if (y.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (y.capacity !== void 0) {
      const O = o ? 576 : 24;
      if (typeof y.capacity != "number" || !Number.isInteger(y.capacity) || y.capacity < 1 || y.capacity > O)
        throw new Error(`Lane capacity must be a whole number from 1 to ${O}.`);
      b.capacity = y.capacity;
    }
    if (a?.readLane?.(y, b, d), y.station !== void 0) {
      const O = we(y.station), N = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= $n)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray(O.next) || O.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const D = O.next.map(ue);
      Te(D, "onward stop"), b.station = { column: N(O.column), row: N(O.row), next: D, outcome: ce(O.outcome, 160) }, O.image !== void 0 && (b.station.image = wt(O.image));
    }
    return b;
  }), I = v.map((g) => g.id);
  if (Te(I, "lane ID"), t && v.some((g) => g.station)) throw new Error("A business board has no map stations.");
  if ((o || v.some((g) => g.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (v.some((g) => g.station)) {
    if (!v.every((g) => g.station)) throw new Error("Give every station on the map a position.");
    Te(v.map((g) => g.station.column + "," + g.station.row), "map position");
    for (const g of v)
      if (g.station.next.some((y) => y === g.id || !I.includes(y))) throw new Error("Connect each stop to another station on this map.");
  }
  const A = n.cards.map((g) => {
    const y = we(g), b = { id: ue(y.id), label: ce(y.label), laneId: ue(y.laneId) };
    if (!I.includes(b.laneId)) throw new Error("Card refers to an unknown lane.");
    if (y.allowedLaneIds !== void 0) {
      if (!Array.isArray(y.allowedLaneIds) || y.allowedLaneIds.length > v.length) throw new Error("Invalid allowed lanes.");
      if (b.allowedLaneIds = y.allowedLaneIds.map(ue), Te(b.allowedLaneIds, "allowed lane"), !b.allowedLaneIds.includes(b.laneId) || !b.allowedLaneIds.every((O) => I.includes(O)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (y.look !== void 0) {
      const O = Ge(y.look);
      O && (b.look = O);
    }
    if (y.asNote !== void 0) {
      const O = Mn(y.asNote);
      O && (b.asNote = O);
    }
    if (a?.readCard(y, b, d), o) {
      if (typeof y.points != "number" || !Number.isInteger(y.points) || y.points < 1 || y.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (b.points = y.points, y.dependsOn !== void 0) {
        if (!Array.isArray(y.dependsOn) || y.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        b.dependsOn = y.dependsOn.map(ue), Te(b.dependsOn, "dependency");
      }
    }
    return b;
  });
  Te(A.map((g) => g.id), "card ID");
  const k = { version: 1, title: p, lanes: v, cards: A };
  if (n.experience !== void 0) {
    const g = we(n.experience);
    if (g.version !== 1 || g.kind !== "customer-interviews" && g.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    k.experience = { version: 1, kind: g.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    k.signals = n.signals.map((g) => {
      const y = we(g), b = ue(y.cardId), O = ue(y.laneId);
      if (!A.some((N) => N.id === b) || !I.includes(O))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ue(y.id),
        label: ce(y.label),
        cardId: b,
        laneId: O,
        whenPresent: ce(y.whenPresent, 160),
        whenAbsent: ce(y.whenAbsent, 160)
      };
    }), Te(k.signals.map((g) => g.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    k.presentationOrder = Wn({ lanes: v, presentationOrder: n.presentationOrder }).map((g) => g.id);
  }
  if (o)
    return k.kind = "release-plan", Ft(k), k;
  if (t && a) {
    k.kind = t, a.readBoard(n, k, d);
    const g = a.validate(k);
    if (g) throw new Error(g);
    return k;
  }
  for (const g of v)
    if (A.filter((y) => y.laneId === g.id).length > (g.capacity ?? 1 / 0))
      throw new Error(`Lane "${g.label}" exceeds its capacity.`);
  return k;
}
const kt = 65536;
function Jo(e) {
  const n = JSON.stringify(J(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > kt) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function Yo(e) {
  if (e.length > kt) throw new Error("This workshop is too large to open from a link.");
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
function Fn(e, n, o) {
  const t = Y(e);
  return t ? ge(t).planMove(e, n, o) : void 0;
}
function ln(e, n) {
  if (Y(e)) return e.lanes.filter((t) => Fn(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => dn(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((a) => a.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function On(e, n, o) {
  const t = e.cards.find((d) => d.id === n), a = Fn(e, n, o);
  if (a !== void 0) {
    if (!a) throw new Error("Move is unavailable.");
    return a;
  }
  if (t && e.kind === "release-plan") {
    const d = dn(e, t, o);
    if (!d) throw new Error("Move is unavailable.");
    return d;
  }
  if (!t || !ln(e, t).some((d) => d.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((d) => d === t ? { ...t, laneId: o } : d) };
}
function Fe(e, n, o) {
  const t = e.cards.find((p) => p.id === n);
  if (!t || !e.lanes.some((p) => p.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return dn(e, t, o);
  const a = Fn(e, n, o);
  if (a !== void 0) return a;
  const d = So(e, n, o);
  return d || (o === "prototype" && ze(e) === "customer-interviews" ? null : ln(e, t).some((p) => p.id === o) ? On(e, n, o) : null);
}
function st(e, n) {
  return e.lanes.filter((o) => Fe(e, n, o.id) !== null);
}
function nn(e, n, o) {
  if (Fe(e, n, o) !== null) return null;
  const t = e.cards.find((k) => k.id === n), a = e.lanes.find((k) => k.id === o);
  if (!t || !a) return "That move is not available.";
  const d = Y(e), p = d && ge(d).refusal;
  if (p) return p(e, n, o);
  const v = `This card can't go in ${a.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return v;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return v;
    const k = $e(e, o), g = { ...e, lanes: e.lanes.map((b) => b === a ? { id: a.id, label: a.label } : b) }, y = dn(g, t, o);
    return y ? `Needs ${$e(y, o) - k} points. It already holds ${k} of ${a.capacity} points.` : v;
  }
  const I = e.lanes.find((k) => k.id === t.laneId);
  if (I?.station && !I.station.next.includes(o)) return `${a.label} can't be reached from ${I.label}.`;
  const A = e.cards.filter((k) => k.laneId === o).length;
  return a.capacity !== void 0 && A >= a.capacity ? `It already holds ${A} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : v;
}
function tn(e) {
  return (!e.kind || !!Y(e)) && !e.lanes.some((n) => n.station) && !ze(e);
}
const go = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function bt(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && go.test(n) && !o.has(n) ? n : fn(e, "card");
}
function Re(e, n, o) {
  const t = e.lanes.find((p) => p.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((p) => p.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (ze(e)) return "This workshop keeps the cards it came with.";
  const a = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!a) return "A card needs some words. Type on the note first.";
  if (Y(e)) {
    const p = vt(e, n, o);
    return typeof p == "string" ? p : null;
  }
  if (a.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(a)) return "A card holds plain words only.";
  if (e.cards.length >= yt) return "A workshop holds up to 24 cards.";
  const d = e.cards.filter((p) => p.laneId === n).length;
  if (t.capacity !== void 0 && d >= t.capacity) return `It already holds ${d} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      Ge(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  if (o.asNote !== void 0)
    try {
      Mn(o.asNote);
    } catch {
      return "This note's shape or words can't be kept on a card.";
    }
  return null;
}
function Be(e, n, o, t) {
  if (Re(e, n, o) !== null) return null;
  if (Y(e)) {
    const A = vt(e, n, o), k = A.cards[A.cards.length - 1], g = t === void 0 ? -1 : e.cards.findIndex((y) => y.id === t && y.laneId === n);
    return g < 0 ? A : { ...A, cards: [...e.cards.slice(0, g), k, ...e.cards.slice(g)] };
  }
  const a = o.look === void 0 ? void 0 : Ge(o.look), d = o.asNote === void 0 ? void 0 : Mn(o.asNote), p = {
    id: bt(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: n,
    ...a ? { look: a } : {},
    ...d ? { asNote: d } : {}
  }, v = t === void 0 ? -1 : e.cards.findIndex((A) => A.id === t && A.laneId === n), I = v < 0 ? [...e.cards, p] : [...e.cards.slice(0, v), p, ...e.cards.slice(v)];
  return J({ ...e, cards: I });
}
function vt(e, n, o) {
  const t = ge(Y(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const a = _e(e, [{ kind: "add_card", lane: { id: n }, ...t }]);
  if ("refused" in a) return a.refused.reason;
  const d = a.workshop.cards;
  return d[d.length - 1] = { ...d[d.length - 1], id: bt(e, o.id) }, a.workshop;
}
function xt(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = Y(e);
  return o ? ge(o).cardText(e, n) : n.label;
}
function yo(e, n) {
  const o = Y(e);
  return o ? ge(o).noteText(e, n) : n.label;
}
function on(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!tn(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((d) => e.lanes.find((p) => p.id === d).label), a = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${a}, so it stays a card.`;
  }
  return null;
}
function it(e, n) {
  if (on(e, n) !== null) return null;
  const o = e.cards.filter((t) => t.id !== n).map((t) => {
    if (!t.dependsOn?.includes(n)) return t;
    const a = { ...t, dependsOn: t.dependsOn.filter((d) => d !== n) };
    return a.dependsOn.length || delete a.dependsOn, a;
  });
  return J({ ...e, cards: o });
}
function me(e, n) {
  const o = e.lanes.find((p) => p.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const p = $e(e, n);
    return o.capacity ? p + " / " + o.capacity + " points" : p + " points";
  }
  const t = Y(e);
  if (t) return ge(t).caption(e, n);
  const a = To(e, n);
  if (a) return "$" + a.amount + " · " + a.description;
  const d = e.cards.filter((p) => p.laneId === n).length;
  return o.capacity !== void 0 ? d + " of " + o.capacity : d + (d === 1 ? " card" : " cards");
}
const un = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, rn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function It(e, n = un, o = 28) {
  const { pitch: t, row: a, top: d } = n, p = !!e.lanes[0].station, v = e.lanes.map((k) => e.cards.filter((g) => g.laneId === k.id).length), I = d + Math.max(1, ...v) * a + 36, A = e.lanes.map((k, g) => ({
    x: p ? k.station.column * (t + o) : g * t,
    y: p ? k.station.row * I : 0
  }));
  return {
    points: A,
    width: Math.max(...A.map((k) => k.x)) + t,
    height: Math.max(...A.map((k, g) => k.y + d + (p ? Math.max(1, v[g]) : v[g] + 1) * a))
  };
}
function Vo() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function fn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((a) => a.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Ct(e) {
  const n = J(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function ko(e, n) {
  const o = Ct(e), t = fn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), J(o);
}
function bo(e, n, o) {
  const t = Ct(e);
  return t.cards.push({
    id: fn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), J(t);
}
function Zo() {
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
function lt(e, n, o) {
  const t = J(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const a = t.lanes.find((k) => k.id === n);
  if (!a?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= gt) throw new Error("A map can have up to five stations.");
  const d = ce(o?.label), p = ce(o?.outcome, 160), v = fn(t, "station");
  let I, A = 1 / 0;
  for (let k = 0; k < $n; k++)
    for (let g = 0; g < $n; g++) {
      if (t.lanes.some((b) => b.station.column === g && b.station.row === k)) continue;
      const y = Math.abs(a.station.column - g) + Math.abs(a.station.row - k);
      y < A && (A = y, I = { column: g, row: k });
    }
  if (!I) throw new Error("There is no free station position.");
  return a.station.next.push(v), t.lanes.push({ id: v, label: d, station: { ...I, next: [], outcome: p, ...o.image === void 0 ? {} : { image: wt(o.image) } } }), t.presentationOrder?.push(v), t;
}
const Qo = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, St = (e) => "caption-" + e, De = (e) => "column-" + e, ee = { lane: We, card: ke, image: cn, caption: St, column: De };
function Tt(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Sn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), a = e, d = n;
  return t ? `M ${t} 0 H ${a - t} Q ${a} 0 ${a} ${t} V ${d - t} Q ${a} ${d} ${a - t} ${d} H ${t} Q 0 ${d} 0 ${d - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${a} V ${d} H 0 Z`;
}
function dt(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ct(e, n, o, t) {
  for (let a = n; a > 11; a--) {
    const d = Math.max(1, Math.floor(o / (a * 0.55)));
    if (e.split(`
`).reduce((v, I) => v + Math.max(1, Math.ceil(I.length / d)), 0) * a * 1.3 <= t) return a;
  }
  return Math.min(n, 11);
}
const At = 152, Pn = At + 12, vo = 12;
function xo(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function Me(e, n = {}) {
  const o = J(e), { pitch: t, row: a, top: d } = un, p = o.lanes.map((y) => o.cards.filter((b) => b.laneId === y.id).length), v = (y) => Math.max(p[y], (Array.isArray(n.rows) ? n.rows[y] : n.rows) ?? 0), I = !!o.lanes[0].station, A = o.lanes.some((y) => y.station?.image), k = xo(n.layout, o.lanes.length), g = [];
  if (I) {
    const { points: y } = It(o);
    o.lanes.forEach((b, O) => g.push({
      laneId: b.id,
      x: y[O].x,
      y: y[O].y + (A ? b.station.row * Pn : 0),
      width: t,
      height: d + (b.station.image ? Pn : 0) + Math.max(1, p[O]) * a,
      column: b.station.column,
      row: b.station.row
    }));
  } else {
    let y = 0;
    for (let b = 0; b < o.lanes.length; b += k) {
      const O = o.lanes.slice(b, b + k), N = d + (Math.max(...O.map((D, r) => v(b + r))) + 1) * a;
      O.forEach((D, r) => g.push({ laneId: D.id, x: r * t, y, width: t, height: N, column: r, row: b / k })), y += N + vo;
    }
  }
  return { places: g, width: Math.max(...g.map((y) => y.x + y.width)), height: Math.max(...g.map((y) => y.y + y.height)) };
}
function Io(e, n) {
  const { pitch: o, width: t, row: a, height: d, top: p } = un, v = n.origin ?? { x: 0, y: 0 }, I = !!e.lanes[0].station, { places: A } = Me(e, n), k = n.style ?? {}, g = k.textColor ?? He.fontColor, y = k.borderColor ?? He.borderColor, b = k.borderWidth ?? He.borderWidth, O = k.cornerRadius ?? 0, N = k.fontSize ?? He.fontSize, D = k.laneFontSize ?? N + 2, r = k.captionFontSize ?? Math.max(11, N - 1), f = [], x = ($) => {
    const R = { options: {
      shapeHint: "rectangle",
      vectorPath: Sn($.width, $.height, O),
      foregroundColor: g,
      borderColor: y,
      borderWidth: b,
      ...k.fontFamily ? { fontFamily: k.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return f.push(R), R;
  };
  e.lanes.forEach(($, R) => {
    const E = A[R], H = v.x + E.x, B = v.y + E.y, U = $.station?.image;
    x({
      id: De($.id),
      text: "",
      name: $.label,
      xPos: H + 2,
      yPos: B,
      width: o - 4,
      height: E.height,
      vectorPath: Sn(o - 4, E.height, O ? O + 2 : 0),
      backgroundColor: I ? "#fcf9ed" : dt(rn[R], 0.6),
      borderColor: I ? "#a8b5aa" : dt(rn[R], 0.1),
      borderWidth: 1,
      ...I ? { borderStyle: "dashed" } : {}
    }), x({
      id: We($.id),
      text: $.label,
      name: $.label,
      xPos: H + 8,
      yPos: B + 6,
      width: t,
      height: 58,
      backgroundColor: rn[R],
      fontSize: ct($.label, D, t - 16, 50)
    }), x({
      id: St($.id),
      text: me(e, $.id),
      name: $.label,
      xPos: H + 8,
      yPos: B + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: r
    }), U && f.push({ options: {
      id: cn($.id),
      name: U.alt,
      text: "",
      xPos: H + 8,
      yPos: B + p,
      width: t,
      height: At,
      shapeHint: "rectangle",
      image: U.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((te) => te.laneId === $.id).forEach((te, V) => {
      const Oe = xt(e, te), oe = I ? t - 20 : t, be = I ? d - 6 : d, se = I ? {} : { ...k.card, ...te.look }, ve = I ? O : k.card?.cornerRadius ?? O;
      x({
        id: ke(te.id),
        text: Oe,
        name: te.label,
        xPos: H + (I ? 18 : 8),
        yPos: B + p + (U ? Pn : 0) + V * a,
        width: oe,
        height: be,
        ...ve !== O ? { vectorPath: Sn(oe, be, ve) } : {},
        backgroundColor: I ? "#ffda75" : se.backgroundColor ?? k.backgroundColor ?? He.backgroundColor,
        ...se.textColor ? { foregroundColor: se.textColor } : {},
        ...se.fontFamily ? { fontFamily: se.fontFamily } : {},
        ...se.borderColor ? { borderColor: se.borderColor } : {},
        ...se.borderWidth !== void 0 ? { borderWidth: se.borderWidth } : {},
        fontSize: ct(Oe, se.fontSize ?? N, oe - 16, be - 8)
      });
    });
  });
  const S = new Map(f.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (S.get(De($.id)).relationships.associations = $.station.next.map((R) => ({
      id: $.id + "-to-" + R,
      parentId: De($.id),
      childId: De(R),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const R of $.dependsOn ?? []) {
        const E = ke(R), H = ke($.id);
        S.get(E).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${$.id}`,
          parentId: E,
          childId: H,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const $ = new Set(n.beside), R = new Set(f.map((B) => B.options.id)), E = /* @__PURE__ */ new Map();
    for (const B of [...R]) {
      if (!$.has(B)) continue;
      const U = Tt(B, (te) => $.has(te) || R.has(te));
      R.add(U), E.set(B, U);
    }
    const H = (B) => E.get(B) ?? B;
    for (const B of f) {
      B.options.id = H(B.options.id);
      for (const U of B.relationships.associations)
        U.parentId = H(U.parentId), U.childId = H(U.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: f };
}
function Co(e, n) {
  const o = J(e);
  if (n?.native) return Io(o, n);
  const { width: t, row: a, height: d, top: p } = un, v = [];
  function I(b, O, N, D, r, f) {
    v.push({ options: {
      id: b,
      text: O,
      name: O,
      xPos: N,
      yPos: D,
      width: t,
      height: r,
      shapeHint: "rectangle",
      backgroundColor: f,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: A } = It(o), k = 152, g = k + 12, y = o.lanes.some((b) => b.station?.image);
  o.lanes.forEach((b, O) => {
    const N = A[O].x, D = A[O].y + (y ? (b.station?.row ?? 0) * g : 0), r = b.station?.image, f = o.kind === "release-plan" ? b.label + `
` + (b.capacity ? $e(o, b.id) + " / " + b.capacity + " points" : $e(o, b.id) + " points") : b.label;
    I(We(b.id), f, N, D, p - 12, rn[O]), r && v.push({ options: {
      id: cn(b.id),
      name: r.alt,
      text: "",
      xPos: N,
      yPos: D + p,
      width: t,
      height: k,
      shapeHint: "rectangle",
      image: r.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((x) => x.laneId === b.id).forEach((x, S) => I(ke(x.id), xt(o, x), N, D + p + (r ? g : 0) + S * a, d, "#fffdf6"));
  });
  for (const b of o.lanes) {
    if (!b.station) continue;
    const O = v.find((N) => N.options.id === We(b.id));
    O.relationships.associations = b.station.next.map((N) => ({ id: b.id + "-to-" + N, parentId: O.options.id, childId: We(N), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), O.options.text = b.label + `
` + b.station.outcome, O.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const b = new Map(v.map((O) => [O.options.id, O]));
    for (const O of o.cards)
      for (const N of O.dependsOn ?? []) {
        const D = ke(N), r = ke(O.id);
        b.get(D).relationships.associations.push({
          id: `dependency-${N.length}-${N}-${O.id}`,
          parentId: D,
          childId: r,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: v };
}
const Xo = {
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
}, Ln = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], zn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function er() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Ln.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Ln.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function nr() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...zn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function ze(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...zn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => Ln.some((a) => a.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function So(e, n, o) {
  const t = ze(e), a = e.cards.find((p) => p.id === n);
  if (!t || !a || a.laneId === o) return null;
  let d = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const p = e.cards.find((v) => v.laneId === o);
    if (p) {
      if (!ln(e, p).some((v) => v.id === "interviews")) return null;
      d = On(e, p.id, "interviews");
    }
  }
  return ln(d, a).some((p) => p.id === o) ? On(d, n, o) : null;
}
function To(e, n) {
  if (ze(e) !== "experiment-budget") return null;
  const o = zn.find((d) => d.id === n), t = e.cards.filter((d) => d.laneId === n).length, a = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? a + " " + (a === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  He as DEFAULT_NOTE_STYLE,
  Gt as WORKSHOP_BOARD_KINDS,
  en as WorkshopReferenceError,
  lt as addWorkshopBranch,
  bo as addWorkshopCard,
  ko as addWorkshopLane,
  _e as applyWorkshopEdits,
  Ko as attachWorkshop,
  ln as availableLanes,
  fo as businessBoardKinds,
  Y as businessKind,
  eo as canHangPanel,
  zn as channels,
  Xt as checkWorkshopReplacement,
  Ht as countWord,
  nr as createBudgetWorkshop,
  er as createInterviewWorkshop,
  Vo as createLaneWorkshop,
  Zo as createWorkshopMap,
  Yo as decodeWorkshopFragment,
  Uo as describeFocusDarkroom,
  zo as describeWorkshopEdits,
  Jo as encodeWorkshopFragment,
  Eo as handoffSummary,
  Bo as hangGalleryPanel,
  Xo as industrialWorkshop,
  Go as initialFocusDarkroom,
  Ln as interviews,
  rn as laneColors,
  Ae as listed,
  Ze as listeningRoom,
  _o as listeningRoomCaption,
  yt as maxWorkshopCards,
  jo as moonGallery,
  On as moveWorkshopCard,
  Fo as named,
  Qo as nightTransfer,
  Do as normalizeFocusDarkroom,
  No as normalizeListeningRoom,
  Ho as normalizeMoonGallery,
  Oo as normalizeOfflineHandoff,
  $o as offlineHandoff,
  So as planStartupMove,
  Bt as pointing,
  pt as printFields,
  Mo as registerWorkshopRules,
  $e as releaseLoad,
  Ro as releasePlan,
  Lo as resolveHandoff,
  wo as resolveWorkshopSignals,
  Po as reviewHandoff,
  P as said,
  ze as startupExperienceKind,
  Nn as unquoted,
  J as validateWorkshop,
  an as workshopBoardKind,
  To as workshopBudgetResult,
  Fe as workshopCandidate,
  it as workshopCardAsNote,
  on as workshopCardAsNoteRefusal,
  mo as workshopCardLookOf,
  yo as workshopCardNoteText,
  xt as workshopCardText,
  st as workshopDestinations,
  Rn as workshopEditKinds,
  Tn as workshopFinder,
  me as workshopLaneCaption,
  Me as workshopLanePlaces,
  un as workshopLayout,
  ee as workshopNodeIds,
  Be as workshopNoteCandidate,
  Re as workshopNoteRefusal,
  It as workshopPositions,
  Wn as workshopPresentationLanes,
  qo as workshopPresentationScenes,
  Jt as workshopReferences,
  nn as workshopRefusal,
  ge as workshopRules,
  Wo as workshopRulesLoaded,
  Tt as workshopStandInId,
  tn as workshopTakesNotes,
  Co as workshopToSlate
};
