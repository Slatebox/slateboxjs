import { D as He } from "./NoteDefaults-1xFW0br8.mjs";
const Mo = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Wo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: s, fieldNote: a, deskNote: m, fallback: g } = e, C = (P) => typeof P == "string" && P.trim().length > 0 && P.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(P);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? s !== "field" && s !== "desk" : s !== null) || s === void 0 || !C(a) || !C(m) || !C(g) ? null : { kind: n, version: o, stage: t, choice: s, fieldNote: a.trim(), deskNote: m.trim(), fallback: g.trim() };
}
function Fo(e) {
  return { ...e, stage: "review", choice: null };
}
function zo(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function jo(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Qe = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Ho(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: s, rightLabel: a } = e, m = (g) => typeof g == "string" && g.trim().length > 0 && g.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(g);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !m(s) || !m(a) ? null : { kind: n, version: o, mix: t, leftLabel: s.trim(), rightLabel: a.trim() };
}
function Do({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === Qe.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === Qe.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === Qe.leftLabel && o === Qe.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function $e(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function qt(e) {
  const n = new Map(e.cards.map((m) => [m.id, m])), o = new Map(e.lanes.map((m, g) => [m.id, g])), t = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
  function a(m) {
    if (!t.has(m.id)) {
      if (s.has(m.id)) throw new Error("Release dependencies must be acyclic.");
      s.add(m.id);
      for (const g of m.dependsOn ?? []) {
        const C = n.get(g);
        if (!C) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(C.laneId) > o.get(m.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        a(C);
      }
      s.delete(m.id), t.add(m.id);
    }
  }
  for (const m of e.cards) a(m);
  for (const m of e.lanes) {
    if (m.station) throw new Error("Release windows cannot also be map stations.");
    if ($e(e, m.id) > (m.capacity ?? 1 / 0)) throw new Error(`Release "${m.label}" exceeds its point budget.`);
  }
}
function un(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((h, k) => [h.id, k])), s = t.get(o);
  if (s === void 0) return null;
  const a = s < t.get(n.laneId), m = /* @__PURE__ */ new Set([n.id]), g = [n];
  for (; g.length; ) {
    const h = g.pop();
    for (const k of e.cards) {
      if (m.has(k.id)) continue;
      const S = t.get(k.laneId);
      (a ? S > s && h.dependsOn?.includes(k.id) : S < s && k.dependsOn?.includes(h.id)) && (m.add(k.id), g.push(k));
    }
  }
  if (e.cards.filter((h) => m.has(h.id)).some((h) => h.allowedLaneIds && !h.allowedLaneIds.includes(o))) return null;
  const P = { ...e, cards: e.cards.map((h) => m.has(h.id) ? { ...h, laneId: o } : h) }, v = e.lanes[s].capacity;
  return v !== void 0 && $e(P, o) > v ? null : P;
}
const Bo = {
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
}, Nn = /* @__PURE__ */ new Map(), Jt = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan" };
function Go(e) {
  Nn.set(e.kind, e);
}
function Uo(e) {
  return typeof e == "string" && Nn.has(e);
}
function he(e) {
  const n = Nn.get(e);
  if (!n) throw new Error(`The ${Jt[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let sn = null;
function Ko(e) {
  sn = e;
}
function qo() {
  return sn !== null;
}
function ce() {
  if (!sn) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return sn;
}
const O = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Ae = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], et = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Mn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Wn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Jo = (e) => Mn(Wn(e)), Yt = [
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
], Vt = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Yt.indexOf(e.toLowerCase()), Zt = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function wt(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (s) => {
    const a = Mn(s);
    a && o.add(a);
  };
  t(e), t(Wn(e));
  for (const s of [...o]) t(s.replace(/^(?:the|my|our)\s+/i, ""));
  for (const s of [...o]) t(s.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const s of [...o]) t(s.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const xn = "[^\\p{L}\\p{N}]", nt = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + et(n) + "(?:$|" + xn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + xn + ")" + et(n) + "(?:$|" + xn + ")", "u").test(e)
], tt = ["first", "second", "third", "fourth", "fifth"];
function Qt(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + tt.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Mn(Wn(n)));
  if (!t) return null;
  const s = (t[1] ?? t[2]).toLowerCase(), a = s === "last" ? e.length - 1 : t[1] ? tt.indexOf(s) : Vt(s) - 1;
  return e[a] ?? null;
}
function In(e, n, o, t, s) {
  const a = wt(n, o);
  if (a.some((g) => Zt.test(g))) {
    const g = t && e.find((C) => C.id === t);
    return g ? { item: g, rank: 0 } : { pointing: !0 };
  }
  for (const g of a) {
    if (!g.startsWith("@")) continue;
    const C = e.find((P) => P.id === g.slice(1));
    if (C) return { item: C, rank: 0 };
  }
  for (const [g, C] of nt.entries())
    for (const P of a) {
      const v = e.filter((h) => C(h.label.toLowerCase(), P.toLowerCase()));
      if (v.length === 1) return { item: v[0], rank: g };
      if (v.length > 1) return { several: v };
    }
  const m = s ? Qt(e, n, o) : null;
  return m ? { item: m, rank: nt.length } : {};
}
class nn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function $n(e, n, o, t, s = !1) {
  return { find: (C) => {
    const P = In(e, C, n, t, s);
    if (P.item) return P.item;
    const v = wt(C, n), h = v[v.length - 1];
    if (P.pointing) throw new nn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (P.several) {
      const S = [...new Set(P.several.map((x) => x.label))];
      throw new nn(S.length === 1 ? P.several.length + " " + o + "s are called " + O(S[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + O(h) + ": " + Ae(S.slice(0, 6).map(O)) + ". Use the whole name.", "ambiguous", P.several.map((x) => x.id));
    }
    const k = e.map((S) => S.label);
    throw new nn("There is no " + o + " called " + O(h) + " here." + (k.length && k.length <= 6 ? " The " + o + "s are " + Ae(k.map(O)) + "." : k.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((S) => S.id));
  }, attempt: (C) => In(e, C, n, t, s).item ?? null, rank: (C) => In(e, C, n, t, s).rank ?? 1 / 0 };
}
const gt = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan"], we = [...gt], _e = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], yt = gt.slice(5);
function ln(e) {
  if (e.lanes[0]?.station) return "map";
  const n = Z(e);
  return n || (e.kind === "release-plan" ? "release-plan" : ze(e) ?? "lanes");
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
  businessCards: "Cards on this board go where its rules let them.",
  noRules: "Only lane boards and pipelines take rules for now."
}, On = { "launch-plan": W.launchLanes, pipeline: W.pipelineLanes, budget: W.budgetLanes, "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires") }, oe = (e, n) => Object.fromEntries(we.filter((o) => !e.includes(o)).map((o) => [o, n])), te = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), J = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ae = (e) => ({ type: "ref", of: "card", about: e }), Cn = (e) => ({ map: e }), pe = oe(["map"], W.notMap), me = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), Pn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: te(120, "The new name, 1 to 120 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: J("The lane or step."), label: te(80, "The new name, 1 to 80 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ae("The card or token."), label: te(80, "The new name, 1 to 80 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: te(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...On }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: J("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...On }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: J("The lane or step it starts in."),
      label: te(80, "What the card says. On a map it may be left out: the token is numbered.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: me("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: me("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: me("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...yt],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ae("The card or token.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: ae("The card or token."), lane: J("Where it goes.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ae("The token.") },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: J("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: we.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": W.launchLanes, budget: W.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ae("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: _e,
    refusals: { ...Cn(W.mapCardLanes), ...oe([..._e, "map"], W.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ae("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...oe(["release-plan"], W.notPoints), map: W.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: ae("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...oe(["release-plan"], W.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ae("The card."),
      lane: J("The lane."),
      whenPresent: te(160, "What it says when the card is there."),
      whenAbsent: te(160, "What it says otherwise."),
      label: te(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: _e,
    refusals: { ...Cn(W.mapOutcome), ...oe([..._e, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ae("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: _e,
    refusals: { ...Cn(W.mapOutcome), ...oe([..._e, "map"], W.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: we,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: J("The lane or step."), before: J("Present it just before this one.", !0), after: J("Present it just after this one.", !0) },
    boards: we,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: J("The step it follows."), label: te(80, "The new step’s name."), outcome: te(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: J("The step it goes in front of."),
      from: J("Only the path from this step is taken over.", !0),
      label: te(80, "The new step’s name."),
      outcome: te(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: J("Where the path starts."), to: J("Where it leads.") },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: J("Where the path starts."), to: J("Where it leads.") },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: J("The step."), outcome: te(160, "What it says.") },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: J("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: J("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: J("The step."), alt: te(240, "What the picture shows.") },
    boards: ["map"],
    refusals: pe
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: ae("The task."), duration: me("Its days, 1 to 60.", 60, 1, !0), lag: me("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: oe(["launch-plan"], W.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ae("The task that waits."), waitsOn: ae("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: oe(["launch-plan"], W.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ae("The task that waits."), waitsOn: ae("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: oe(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: me("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: oe(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ae("The deal or line item."), amount: me("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: oe(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: me("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: oe(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: J("The team giving."), to: J("The team receiving."), amount: me("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: oe(["budget"], W.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: oe(["lanes", "pipeline"], W.noRules)
  },
  {
    kind: "set_rule",
    summary: "Change a rule: on, severity, max (a limit) or to (a path).",
    intent: !1,
    fields: {
      rule: te(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: oe(["lanes", "pipeline"], W.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: te(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: oe(["lanes", "pipeline"], W.noRules) }
], Xt = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", ot = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, eo = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function no(e, n) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, t = (s, a) => a ? { anyOf: [s, { type: "null" }] } : s;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...t({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...t({ type: "integer", minimum: e.min, maximum: eo(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: ot.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: o,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: o,
        to: { type: "array", items: o, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: o,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: o,
        ...ot.keys
      }, description: e.about };
  }
}
const kt = (e) => "optional" in e && e.optional === !0;
function Yo(e) {
  const n = e ? ln(Y(e)) : void 0;
  return Pn.map((o) => {
    const t = Object.entries(o.fields), s = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, m]) => !kt(m)).map(([m]) => m)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([m, g]) => [m, no(g, n)])) }
    }, a = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: s };
    return n && (a.accepted = o.boards.includes(n), a.accepted || (a.refusal = o.refusals[n])), a;
  });
}
const Xe = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function to(e, n) {
  const o = !!e.lanes[0]?.station, t = $n(e.lanes, o ? Xe.step : Xe.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), s = $n(e.cards, o ? Xe.token : Xe.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: s };
  const a = (m) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(m.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (m) => a(m) ?? s.find(m),
    attempt: (m) => a(m) ?? s.attempt(m),
    rank: (m) => a(m) ? 0 : s.rank(m)
  } };
}
class M {
  constructor(n, o, t = null, s, a, m) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = s, this.candidates = a, this.limits = m;
  }
}
function dn(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function G(e, n, o = null, t) {
  try {
    return Y(e);
  } catch (s) {
    throw new M(dn(s instanceof Error ? s.message : String(s), n), "refused", o, t);
  }
}
function oo(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, s] of Object.entries(n.fields)) {
    const a = e[t];
    if (a === void 0) {
      if (kt(s)) continue;
      return n.kind + " needs " + t + ".";
    }
    const m = n.kind + " needs " + t + " as ";
    switch (s.type) {
      case "text":
        if (typeof a != "string") return m + "text.";
        break;
      case "ref":
        if (!o(a)) return m + "an id or a name.";
        break;
      case "refs":
        if (a === null && s.nullable) break;
        if (!Array.isArray(a) || a.length > s.max || !a.every(o)) return m + "a list of up to " + s.max + " ids or names" + (s.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (a === null && s.nullable) break;
        if (typeof a != "number" || !Number.isFinite(a)) return m + "a number" + (s.nullable ? " or null." : ".");
        break;
      case "image":
        if (a === null) break;
        if (!a || typeof a != "object" || typeof a.src != "string" || typeof a.alt != "string" || Object.keys(a).some((g) => g !== "src" && g !== "alt")) return m + "{src, alt} or null.";
        break;
      case "choice":
        if (!s.values.includes(a)) return m + s.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof a != "boolean") return m + "true or false.";
        break;
      case "rule":
        if (!a || typeof a != "object" || Array.isArray(a) || typeof a.kind != "string") return m + "an object with a kind.";
        break;
    }
  }
  return null;
}
function ro(e, n, o, t, s) {
  const a = structuredClone(e), m = o === "map", g = o === "release-plan", C = to(a, t), P = { lane: m ? "step" : "lane", card: m ? "token" : "card" };
  function v(r, p, b, $, T = null) {
    if (typeof b == "object") {
      const _ = r.find((U) => U.id === b.id);
      if (!_) throw new M("That " + $ + " is no longer on the workshop.", "gone", T);
      return _;
    }
    const R = r.find((_) => _.id === b);
    if (R) return R;
    try {
      return p.find(b);
    } catch (_) {
      if (!(_ instanceof nn)) throw _;
      const U = _.reason === "ambiguous" ? "ambiguous_reference" : _.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new M(_.message, U, T, void 0, _.candidates.length ? _.candidates : void 0);
    }
  }
  const h = (r, p = null) => v(a.lanes, C.lanes, r, "lane", p), k = (r, p = null) => v(a.cards, C.cards, r, "card", p), S = (r) => {
    try {
      return h(r);
    } catch {
      return null;
    }
  }, x = (r, p, b = {}, $ = !0) => ({ board: r, said: p, changed: $, ...b }), D = (r) => a.cards.filter((p) => p.laneId === r).length, z = (r) => m ? "The presentation opens with " + O(r[0].label) + "." : "The presentation now runs " + r.map((p) => O(p.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return ce().edit(a, n, s, {
      lane: (r) => h(r),
      card: (r) => k(r),
      done: (r, p, b) => x(r, p, b),
      refuse: (r, p = {}) => {
        throw new M(r, p.code ?? "refused", p.laneId ?? null, p.cardId);
      }
    });
  if (yt.includes(o)) {
    n.kind === "add_card" && rt(n, o, h(n.lane).id);
    const r = {
      card: (b) => k(b),
      lane: (b) => h(b),
      refuse: (b, $ = {}) => {
        throw new M(b, $.code ?? "refused", $.laneId ?? null, $.cardId, void 0, $.limits);
      },
      settle: (b, $ = null, T) => G(b, o, $, T),
      done: (b, $, T) => x(b, $, T)
    }, p = he(o).edit(a, n, r);
    if (p) return p;
  }
  switch (n.kind) {
    case "rename_workshop": {
      a.title = n.title;
      const r = G(a, o);
      return x(r, "Renamed the " + (m ? "map" : "workshop") + " to " + O(r.title) + ".");
    }
    case "rename_lane": {
      const r = h(n.lane), p = r.label;
      r.label = n.label;
      const b = G(a, o, r.id);
      return x(b, "Renamed " + O(p) + " to " + O(b.lanes.find(($) => $.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = k(n.card), p = r.label;
      r.label = n.label;
      const b = G(a, o, r.laneId, r.id);
      return x(b, "Renamed " + O(p) + " to " + O(b.cards.find(($) => $.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new M("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new M("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Ao(a, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (b) {
        throw new M(dn(b.message, o), "refused");
      }
      const p = r.lanes[r.lanes.length - 1];
      return x(r, "Added the lane " + O(p.label) + ".", { laneId: p.id });
    }
    case "remove_lane": {
      const r = h(n.lane), p = a.cards.filter((b) => b.laneId === r.id);
      if (m) {
        if (p.length) throw new M(O(p[0].label) + " is at " + O(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new M("A map needs at least two steps.", "refused", r.id);
      } else {
        if (p.length) throw new M(O(r.label) + " holds " + p.length + (p.length === 1 ? " card" : " cards") + ". Move or remove " + (p.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new M("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((b) => b !== r);
      for (const b of a.lanes) b.station && (b.station.next = b.station.next.filter(($) => $ !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((b) => b !== r.id));
      for (const b of a.cards) b.allowedLaneIds && (b.allowedLaneIds = b.allowedLaneIds.filter(($) => $ !== r.id));
      return en(a, (b) => b.laneId === r.id), a.behaviour && (a.behaviour = ce().dropLane(a.behaviour, r.id)), x(G(a, o), "Removed the " + P.lane + " " + O(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = h(n.lane);
      if (m) {
        if (n.allowedLanes !== void 0) throw new M(W.mapCardLanes, "not_on_this_board", r.id);
        let T = n.label;
        if (T === void 0) {
          let j = a.cards.length + 1;
          for (; a.cards.some((V) => V.label === "Token " + j); ) j++;
          T = "Token " + j;
        }
        const R = new Set([...a.lanes, ...a.cards].map((j) => j.id));
        let _ = 1;
        for (; R.has("token-" + _); ) _++;
        a.cards.push({ id: "token-" + _, label: T, laneId: r.id });
        const U = G(a, o, r.id);
        return x(U, "Added " + O(U.cards[U.cards.length - 1].label) + " at " + O(r.label) + ".", { laneId: r.id, cardId: "token-" + _ });
      }
      if (rt(n, o, r.id), n.label === void 0 || !n.label.trim()) throw new M("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new M("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && D(r.id) >= r.capacity)
        throw new M(O(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const p = n.allowedLanes && [...new Set(n.allowedLanes.map((T) => h(T).id))];
      let b;
      try {
        b = $o(a, r.id, { label: n.label, ...p && { allowedLaneIds: p } });
      } catch (T) {
        throw new M(dn(T.message, o), "refused", r.id);
      }
      const $ = b.cards[b.cards.length - 1];
      return x(b, "Added " + O($.label) + " to " + O(r.label) + ".", { laneId: r.id, cardId: $.id });
    }
    case "remove_card": {
      const r = k(n.card);
      if (m && a.cards.length === 1) throw new M("A map needs at least one token.", "refused", r.laneId, r.id);
      if (g && a.cards.length === 1) throw new M("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && a.cards.length === 1) throw new M("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((p) => p !== r);
      for (const p of a.cards)
        p.dependsOn?.includes(r.id) && (p.dependsOn = p.dependsOn.filter((b) => b !== r.id), p.dependsOn.length || delete p.dependsOn);
      return en(a, (p) => p.cardId === r.id), x(G(a, o, r.laneId), "Removed the " + P.card + " " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? a.lanes.find(($) => $.id === n.lane.id) ?? null : S(n.lane), p = k(n.card, r?.id ?? null), b = h(n.lane, p.laneId);
      return E(p, b);
    }
    case "advance_card": {
      const r = k(n.card), p = a.lanes.find(($) => $.id === r.laneId), b = p.station.next.map(($) => a.lanes.find((T) => T.id === $)).filter(($) => !!$);
      if (!b.length) throw new M(O(r.label) + " is at " + O(p.label) + ", and no path leads on from there.", "refused", p.id, r.id);
      if (b.length > 1)
        throw new M("From " + O(p.label) + " the path goes to " + b.map(($) => O($.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + b[0].label + "”.", "refused", p.id, r.id);
      return E(r, b[0]);
    }
    case "set_lane_capacity": {
      const r = h(n.lane), p = a.behaviour && ce().setLimit(a, r.id, n.capacity, s);
      if (typeof p == "string") throw new M(p, "refused", r.id);
      if (p) return x(p, O(r.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: r.id });
      const b = m ? "token" : g ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, x(G(a, o, r.id), m ? "Removed the limit at " + O(r.label) + "." : O(r.label) + " now holds any number of " + b + "s.", { laneId: r.id });
      const $ = g ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > $)
        throw new M((m ? "A step" : "A lane") + " can hold from 1 to " + $ + " " + b + "s.", "refused", r.id);
      const T = g ? a.cards.reduce((R, _) => R + (_.laneId === r.id ? _.points ?? 1 : 0), 0) : D(r.id);
      if (T > n.capacity)
        throw new M(O(r.label) + " already holds " + T + " " + b + (T === 1 ? "" : "s") + ". Move some " + (m ? "on" : "out") + " first, or choose a higher " + (g ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, x(G(a, o, r.id), O(r.label) + " now holds up to " + n.capacity + " " + b + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = k(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, x(G(a, o, r.laneId, r.id), O(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const p = [...new Set(n.lanes.map(($) => h($)))], b = a.lanes.find(($) => $.id === r.laneId);
      if (!p.includes(b)) throw new M(O(r.label) + " is in " + O(b.label) + " now. Include " + O(b.label) + ", or move the card first.", "refused", b.id, r.id);
      return r.allowedLaneIds = p.map(($) => $.id), x(G(a, o, r.laneId, r.id), O(r.label) + " can now go only in " + Ae(p.map(($) => O($.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new M("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, x(G(a, o, r.laneId, r.id), O(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = k(n.card), p = [...new Set(n.dependsOn.map(($) => k($)))], b = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const $ = p.filter((T) => r.dependsOn?.includes(T.id));
        if (!$.length) throw new M(O(r.label) + " does not depend on " + Ae(p.map((T) => O(T.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((T) => !$.some((R) => R.id === T)), r.dependsOn.length || delete r.dependsOn, x(G(a, o, r.laneId, r.id), O(r.label) + " no longer depends on " + Ae($.map((T) => O(T.label))) + ".", b);
      }
      if (!p.length) {
        if (n.mode === "add") throw new M("Name the features " + O(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, x(G(a, o, r.laneId, r.id), O(r.label) + " no longer depends on anything.", b);
      }
      if (p.includes(r)) throw new M("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...p.map(($) => $.id)])], x(G(a, o, r.laneId, r.id), O(r.label) + " now depends on " + Ae(p.map(($) => O($.label))) + ".", b);
    }
    case "set_outcome": {
      const r = k(n.card), p = h(n.lane), b = a.signals ?? (a.signals = []), $ = n.label, T = $ === void 0 ? b.filter((j) => j.cardId === r.id && j.laneId === p.id) : b.filter((j) => j.cardId === r.id && j.label.toLowerCase() === $.toLowerCase());
      if ($ !== void 0 && T.length > 1) throw new M("Two outcomes on this card have that name.", "refused", p.id, r.id);
      if (!T.length && b.length >= 24) throw new M("A workshop can have up to 24 outcomes. Remove one first.", "refused", p.id, r.id);
      let R = 1;
      for (; b.some((j) => j.id === "signal-" + R); ) R++;
      const U = { label: $ ?? T[0]?.label ?? (r.label + " in " + p.label).slice(0, 80).trim(), cardId: r.id, laneId: p.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return T.length ? Object.assign(T[0], U) : b.push({ id: "signal-" + R, ...U }), x(G(a, o, p.id, r.id), "When " + O(r.label) + " is in " + O(p.label) + " the workshop says " + O(n.whenPresent) + ". Otherwise it says " + O(n.whenAbsent) + ".", { laneId: p.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = k(n.card), p = (a.signals ?? []).filter((b) => b.cardId === r.id);
      if (n.outcome === void 0) {
        if (!p.length) throw new M(O(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        en(a, (b) => b.cardId === r.id);
      } else {
        const b = v(p, $n(p, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        en(a, ($) => $.id === b.id);
      }
      return x(G(a, o, r.laneId, r.id), "Removed the outcome from " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((p) => h(p));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new M("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((p) => p.id), x(G(a, o), z(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new M("Say before or after, not both.", "invalid_edit");
      const r = h(n.lane), p = n.before ?? n.after, b = p === void 0 ? void 0 : h(p);
      if (b && b.id === r.id) throw new M("Choose two different scenes.", "refused", r.id);
      const $ = zn(a).filter((T) => T.id !== r.id);
      return $.splice(b ? $.findIndex((T) => T.id === b.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = $.map((T) => T.id), x(G(a, o, r.id), z($), { laneId: r.id });
    }
    case "add_station": {
      const r = h(n.from);
      let p;
      try {
        p = ht(a, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch ($) {
        throw new M($.message, "refused", r.id);
      }
      const b = p.lanes[p.lanes.length - 1];
      return x(p, "Added a path from " + O(r.label) + " to " + O(b.label) + ".", { laneId: b.id });
    }
    case "insert_station": {
      const r = h(n.before), p = n.from === void 0 ? void 0 : h(n.from), b = p ? [p] : a.lanes.filter((R) => R.station.next.includes(r.id));
      if (p && !p.station.next.includes(r.id))
        throw new M("There is no path from " + O(p.label) + " to " + O(r.label) + ". Try “Add " + n.label + " after " + p.label + "”.", "refused", p.id);
      if (!b.length) throw new M("Nothing leads to " + O(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let $;
      try {
        $ = ht(a, b[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (R) {
        throw new M(R.message, "refused", r.id);
      }
      const T = $.lanes[$.lanes.length - 1];
      for (const R of $.lanes)
        b.some((_) => _.id === R.id) && (R.station.next = [...new Set(R.station.next.map((_) => _ === r.id ? T.id : _))]);
      return T.station.next = [r.id], x(G($, o, T.id), "Added " + O(T.label) + " before " + O(r.label) + ".", { laneId: T.id });
    }
    case "connect_stations": {
      const r = h(n.from), p = h(n.to);
      if (r.id === p.id) throw new M("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(p.id) ? x(a, O(r.label) + " already leads to " + O(p.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(p.id), x(G(a, o, r.id), "Connected " + O(r.label) + " to " + O(p.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = h(n.from), p = h(n.to);
      if (!r.station.next.includes(p.id)) throw new M("There is no path between " + O(r.label) + " and " + O(p.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((b) => b !== p.id), x(G(a, o, r.id), "Removed the path from " + O(r.label) + " to " + O(p.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = h(n.station);
      return r.station.outcome = n.outcome, x(G(a, o, r.id), "Changed what happens at " + O(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = h(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), x(G(a, o, r.id), "Moved " + O(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = h(n.station);
      return n.image === null ? (delete r.station.image, x(G(a, o, r.id), "Removed the image at " + O(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, x(G(a, o, r.id), "Updated the image at " + O(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = h(n.station);
      if (!r.station.image) throw new M("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, x(G(a, o, r.id), "Updated the image description at " + O(r.label) + ".", { laneId: r.id });
    }
  }
  throw new M("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function E(r, p) {
    const b = { laneId: p.id, cardId: r.id };
    if (r.laneId === p.id)
      return x(e, O(r.label) + " is already " + (m ? "at " : "in ") + O(p.label) + ".", b, !1);
    const $ = Ge(e, r.id, p.id);
    if (!$) throw new M(tn(e, r.id, p.id) ?? "That move is not available.", "refused", p.id, r.id);
    return x(G($, o, p.id, r.id), "Moved " + O(r.label) + " to " + O(p.label) + ".", b);
  }
}
function rt(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount", "band"].find((s) => e[s] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? s !== "amount" && (s !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && s === "amount"));
  if (t) throw new M(t === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", o);
}
function en(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function Ne(e, n, o = {}) {
  const t = (v) => ({ refused: { index: 0, kind: null, laneId: null, ...v } });
  let s;
  try {
    s = Y(e);
  } catch (v) {
    return t({ reason: "The workshop cannot be read: " + (v instanceof Error ? v.message : String(v)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const a = s, m = [], g = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [v, h] of n.entries()) {
    const k = h?.kind, S = Pn.find((p) => p.kind === k);
    if (!h || typeof h != "object" || !S)
      return t({
        index: v,
        kind: typeof k == "string" ? k : null,
        code: "invalid_edit",
        reason: "There is no edit called " + O(String(k)) + ". The edits are " + Ae(Pn.map((p) => p.kind)) + "."
      });
    const x = oo(h, S);
    if (x) return t({ index: v, kind: S.kind, code: "invalid_edit", reason: x });
    const D = ln(s);
    if (!S.boards.includes(D))
      return t({ index: v, kind: S.kind, code: "not_on_this_board", reason: S.refusals[D] ?? "This workshop does not take " + S.kind + "." });
    let z;
    try {
      z = ro(s, h, D, o.selection, g);
    } catch (p) {
      if (!(p instanceof M)) throw p;
      return t({
        index: v,
        kind: S.kind,
        reason: p.reason,
        code: p.code,
        laneId: p.laneId,
        ...p.cardId && { cardId: p.cardId },
        ...p.candidates && { candidates: p.candidates },
        ...p.limits && { limits: p.limits }
      });
    }
    const E = s.behaviour && !Xt(S.kind) ? ce().check(s, z.board) : null;
    if (E && "refused" in E)
      return t({ index: v, kind: S.kind, reason: E.refused.sentence, code: "refused", laneId: E.refused.laneId, cardId: E.refused.cardId });
    const r = io(s, z.board);
    if (r) return t({ index: v, kind: S.kind, reason: r, code: "not_on_this_board", laneId: z.laneId ?? null });
    s = z.board, m.push({
      index: v,
      kind: S.kind,
      said: z.said,
      changed: z.changed ?? !0,
      ...z.laneId && { laneId: z.laneId },
      ...z.cardId && { cardId: z.cardId }
    });
  }
  const C = new Map(a.cards.map((v) => [v.id, v.laneId])), P = s.cards.flatMap((v) => {
    const h = C.get(v.id);
    return h === void 0 || h === v.laneId ? [] : [{ cardId: v.id, fromLaneId: h, toLaneId: v.laneId }];
  });
  return { workshop: s, report: { edits: m, movedCards: P } };
}
function ao(e, n) {
  const o = Z(e);
  if (o === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const t = e.lanes.find((s) => {
      const a = n.lanes.find((m) => m.id === s.id);
      return s.role !== a.role || s.probability !== a.probability;
    });
    if (t) return `${t.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (o === "budget") {
    const t = e.budget, s = n.budget;
    if (!s || t.total !== s.total || t.currency !== s.currency || t.step !== s.step) return "The total cannot change. Move money between teams instead.";
    const a = e.lanes.find((m) => {
      const g = n.lanes.find((C) => C.id === m.id);
      return m.floor !== g.floor || m.cap !== g.cap || m.capacity !== g.capacity;
    });
    if (a) return `${a.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((s) => s.id === t.id).capacity) ? W.launchLanes : o && he(o).fixed?.(e, n) || null;
}
const so = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map",
  "launch-plan": "launch plan",
  pipeline: "sales pipeline",
  budget: "budget",
  "hiring-plan": "hiring plan"
};
function io(e, n) {
  const o = Y(e), t = ln(o);
  let s;
  try {
    s = Y(n);
  } catch (C) {
    return dn(C instanceof Error ? C.message : String(C), t);
  }
  const a = ln(s), m = (C, P) => C.lanes.length === P.lanes.length && C.lanes.every((v) => P.lanes.some((h) => h.id === v.id)), g = (C, P) => C.lanes.every((v, h) => P.lanes[h]?.id === v.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && a !== t)
    return m(o, s) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !g(o, s)) return W.keepsOrder;
  if (Z(o) && a === t && !(m(o, s) && g(o, s))) return On[t];
  if (Z(o) && a === t) {
    const C = ao(o, s);
    if (C) return C;
  }
  if (t === "release-plan" && a === "release-plan") {
    if (!m(o, s)) return W.releaseLanes;
    if (!g(o, s)) return W.releaseOrder;
    if (s.cards.some((C) => !o.cards.some((P) => P.id === C.id))) return W.releaseCards;
  }
  return t !== a ? "This slate holds a " + so[t] + ", and it stays one. Start a new slate for another kind of workshop." : o.behaviour || s.behaviour ? ce().replacement(o, s) : null;
}
const Vo = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Zo(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const a of n.panels) {
    if (!a || typeof a.id != "string" || !/^[a-z][\w-]{0,31}$/.test(a.id) || typeof a.label != "string" || !a.label.trim() || a.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(a.artwork) || !(a.after === null || typeof a.after == "string")) return null;
    o.push({ id: a.id, label: a.label.trim(), artwork: a.artwork, after: a.after });
  }
  const t = new Map(o.map((a) => [a.id, a])), s = [...new Set(n.hung)];
  if (t.size !== o.length || s.length !== n.hung.length || s.some((a) => !t.has(a))) return null;
  for (const a of o) {
    const m = /* @__PURE__ */ new Set([a.id]);
    let g = a.after;
    for (; g !== null; ) {
      if (m.has(g) || !t.has(g) || s.includes(a.id) && !s.includes(g)) return null;
      m.add(g), g = t.get(g).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: s };
}
function lo(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function Qo(e, n) {
  return lo(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const bt = ["firstPrint", "secondPrint", "thirdPrint"], vt = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Xo(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...vt, route: n.route };
  for (const t of bt) {
    const s = n[t];
    if (typeof s != "string" || !s.trim() || s.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = s.trim();
  }
  return o;
}
function er(e = new URLSearchParams()) {
  const n = { ...vt };
  for (const t of bt) {
    const s = e.get(t)?.trim();
    s && s.length <= 48 && (n[t] = s);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function nr(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function co(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = po(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), fo(n), n;
}
function uo(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function fo(e) {
  return e && uo(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function at(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function ho(e) {
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
function po(e) {
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
function Sn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const st = "#1f7a5c", it = "#5b9a85", Tn = "#c2410c", mo = "#2f5fd0", wo = { canMove: !1, canSelect: !1 };
function go(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function tr(e, n, o = {}) {
  let t = Y(n);
  const s = o.kit, a = (i) => !!Z(i) && !s;
  if (a(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const m = s?.layer(e);
  let g = null, C = null, P = !!o.readOnly, v = P || a(t), h = !1;
  const k = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
  let E = null, r = null, p = null, b = null;
  const $ = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
  let R = null, _ = null;
  function U(i, l) {
    _ && clearTimeout(_.timer), _ = { name: i, reason: l, timer: setTimeout(() => {
      _ = null, h || H(C ?? t);
    }, 3e3) };
  }
  let j = Promise.resolve(), V = null, K = dt(o.layout);
  const Oe = { ...o.style };
  let ie = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Set(), Pe = null, re = !1;
  Le(t);
  const q = o.origin ? { x: o.origin.x, y: o.origin.y } : ko(e), ke = (i) => z.get(i) ?? i, le = (i) => go(ke(i));
  function se(i) {
    const l = D.get(i);
    if (l) return l;
    if (k.has(i) && !z.has(i) || !e.nodes.one?.(i)) return i;
    const u = Et(i, (w) => !!e.nodes.one?.(w) || z.has(w));
    return D.set(i, u), z.set(u, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${u}".`), u;
  }
  const xe = {
    governs(i) {
      if (k.get(i.id) !== i) return null;
      const l = le(i.id)?.kind;
      return l === "card" ? { canMove: !v, canEditText: !v && !C && t.kind !== "release-plan" } : l === "lane" ? { canMove: !1, canEditText: !v && !C } : l === "handle" ? { canMove: !v && !C, canEditText: !1 } : wo;
    },
    onStart(i, l) {
      const u = le(i.id), w = { x: l.x - (i.options.x ?? 0), y: l.y - (i.options.y ?? 0) };
      if (u.kind === "handle") {
        const d = !v && !C && s ? s.handleDrag(t, ke(i.id), w, K) : null;
        return d ? (Q(), Ce(), _ && (clearTimeout(_.timer), _ = null), g = { name: ke(i.id), follow: d, last: null }, !0) : !1;
      }
      const I = u.key;
      if (v || C || !t.cards.some((d) => d.id === I)) return !1;
      Q(), Ce();
      let c = null;
      try {
        c = (s?.chooser ?? o.chooseCandidate)?.(t, I, w, K) ?? null;
      } catch (d) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", d);
      }
      return E = { cardId: I, evaluate: c, grab: w, outcome: { kind: "home" } }, H(t, { skip: I }), !0;
    },
    onMove(i, l) {
      if (g) {
        g.last = g.follow(bn(l)), H(g.last.next, { grip: g.name }), B(o.onPreview, g.last.next === t ? null : g.last.next);
        return;
      }
      if (!E) return;
      const u = Gn(E.cardId, l, E.evaluate);
      if (yo(u, E.outcome)) return;
      E.outcome = u;
      const w = u.kind === "candidate" ? u.next : null;
      H(w ?? t, { skip: E.cardId }), B(o.onPreview, w);
    },
    onEnd(i, l) {
      if (g) {
        const { follow: d, name: f } = g, y = d(bn(l));
        g = null, B(o.onPreview, null), y.refusal ? (U(f, y.refusal), H(t), e.announce?.(y.refusal), B(o.onRefuse, { laneId: null, reason: y.refusal })) : Ze(y.next, {}) || H(t);
        const L = vn(t, f);
        return L ? { accept: !0, settle: L } : { accept: !1 };
      }
      if (!E) return { accept: !1 };
      const { cardId: u, evaluate: w } = E, I = Gn(u, l, w), c = t.cards.find((d) => d.id === u);
      if (E = null, B(o.onPreview, null), I.kind === "candidate" && s) {
        if (!Ze(I.next, { cardId: u, laneId: I.laneId }, u))
          return H(t, { skip: u }), { accept: !1 };
        I.said && (U("card-" + u, I.said), e.announce?.(I.said));
        const d = vn(t, ke(i.id));
        return d ? { accept: !0, settle: d } : { accept: !0 };
      }
      if (I.kind === "candidate") {
        t = I.next, H(t, { skip: u });
        const d = t.lanes.find((y) => y.id === I.laneId);
        e.announce?.(`${c.label} moved to ${d.label}. ${ge(t, d.id)}.`), B(o.onChange, t, { cardId: u, laneId: I.laneId });
        const f = vn(t, ke(i.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (I.kind === "refused")
        Gt(c.label, { cardId: u, laneId: I.laneId, reason: I.reason }), I.near && U("card-" + u, I.reason);
      else if (I.kind === "outside" && on(t) && !Ke()) {
        const d = rn(t, u);
        if (!d)
          return kn(u, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
        H(t, { skip: u }), e.announce?.(d), B(o.onRefuse, { cardId: u, laneId: null, reason: d });
      } else
        H(t, { skip: u }), I.kind === "outside" && (e.announce?.(`${c.label} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: u, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (g) {
        g = null, B(o.onPreview, null), H(t);
        return;
      }
      const l = E && t.cards.find((u) => u.id === E.cardId);
      E = null, B(o.onPreview, null), H(t, { skip: le(i.id)?.key }), l && e.announce?.(`Move cancelled. ${l.label} stays where it was.`);
    },
    onTextCommit(i, l, u) {
      const w = le(i.id);
      if (!w || v || C) return !1;
      let I = l.replace(/\s+/g, " ").trim();
      const c = [], d = Z(t), f = d && w.kind === "card" ? he(d).renamed(t, w.key, I) : null;
      f && (I = f.label, c.push(...f.edits));
      const y = w.kind === "lane" ? { laneId: w.key, label: I } : { cardId: w.key, label: I };
      c.unshift(w.kind === "lane" ? { kind: "rename_lane", lane: { id: w.key }, label: I } : { kind: "rename_card", card: { id: w.key }, label: I });
      const L = Ne(t, c);
      if ("refused" in L) {
        const { reason: A } = L.refused;
        return e.announce?.(`${u} keeps its name. ${A}`), B(o.onRefuse, { ...w.kind === "lane" ? { laneId: w.key } : { cardId: w.key }, rename: y, reason: A }), !1;
      }
      return JSON.stringify(L.workshop) === JSON.stringify(t) ? (H(t), !1) : (t = L.workshop, H(t), e.announce?.(f ? L.report.edits.map((A) => A.said).join(" ") : `${u} renamed to ${I}.`), B(o.onChange, t, { rename: y, ...s ? { edits: c } : {} }), f ? !1 : I);
    },
    onKeyDown(i, l) {
      const u = le(i.id);
      if (v || C || E || g || l.ctrlKey || l.metaKey || l.altKey) return !1;
      if (p && (p.node !== i.id || !["Enter", "Escape"].includes(l.key) && l.key.toLowerCase() !== p.key) && Kn(), p && l.key === "Escape")
        return l.preventDefault(), Kn(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (p && l.key === "Enter") {
        l.preventDefault();
        const d = p.choices[p.at];
        return p = null, B(o.onPreview, null), t = d.next, H(t), e.announce?.(d.done), B(o.onChange, t, { ...u?.kind === "card" ? { cardId: u.key } : {}, edits: d.edits }), !0;
      }
      const w = s?.keyChoices?.(t, ke(i.id), l.key);
      if (w) {
        l.preventDefault();
        const d = [], f = [];
        for (const A of typeof w == "string" ? [] : w) {
          const N = Ne(t, A.edits);
          "refused" in N ? f.push(`${A.said}: ${N.refused.reason}`) : d.push({ ...A, next: N.workshop, done: N.report.edits.map((F) => F.said).join(" ") });
        }
        if (!d.length)
          return e.announce?.(typeof w == "string" ? w : f.join(" ")), !0;
        const y = p && p.node === i.id ? (p.at + 1) % d.length : 0;
        p = { node: i.id, key: l.key.toLowerCase(), choices: d, at: y }, H(d[y].next), B(o.onPreview, d[y].next);
        const L = d.length > 1 ? ` (${y + 1} of ${d.length}). Press ${l.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${d[y].said}${L} Enter to make it, Escape to cancel.`), !0;
      }
      const I = s?.keyEdit?.(t, ke(i.id), { key: l.key, shiftKey: l.shiftKey });
      if (I) {
        l.preventDefault();
        const d = Ne(t, I);
        return "refused" in d ? (e.announce?.(d.refused.reason), B(o.onRefuse, { laneId: d.refused.laneId, ...u?.kind === "card" ? { cardId: u.key } : {}, reason: d.refused.reason })) : Ze(d.workshop, u?.kind === "card" ? { cardId: u.key } : {}), !0;
      }
      if (u?.kind !== "card") return !1;
      const c = t.cards.find((d) => d.id === u.key);
      if (!c) return !1;
      if (l.key === "ArrowLeft" || l.key === "ArrowRight")
        return l.preventDefault(), Un(c.id, l.key === "ArrowLeft" ? -1 : 1), !0;
      if ((l.key === "ArrowUp" || l.key === "ArrowDown") && zt())
        return l.preventDefault(), Un(c.id, l.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== c.id) return !1;
      if (l.key === "Enter") {
        l.preventDefault();
        const { laneId: d, next: f, spot: y } = r;
        if (r = null, d === null)
          return B(o.onPreview, null), kn(c.id, y), !0;
        const L = t;
        t = f, H(t), Ie(d), B(o.onPreview, null);
        const A = t.lanes.find((N) => N.id === d);
        return e.announce?.(`${c.label} moved to ${A.label}. ${ge(t, d)}.`), B(o.onChange, t, { cardId: c.id, laneId: d, ...s ? { edits: s.editsBetween(L, t) } : {} }), !0;
      }
      return l.key === "Escape" ? (l.preventDefault(), Ce(), e.announce?.(`Move cancelled. ${c.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((l) => k.get(l.id) === l).map((l) => l.id);
      re = i.length === 1, k.clear(), S.clear(), x.clear(), D.clear(), z.clear(), E = null, r = null, H(C ?? t, { animate: !1 }), i.length === 1 && (j = j.then(() => {
        re = !1;
        const l = k.get(i[0]);
        if (!h && l && !(e.getSelectedNodes?.() ?? []).length) {
          const u = () => e.selectNodes?.([l]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(u) : u();
        }
        mn();
      }));
    }
  };
  xe.onFreeMove = (i, l) => {
    if (!qe() || i.options?.isComment) return wn();
    const u = Je(l), w = Ye(i), I = t.lanes.filter((d) => !je(i) && Me(t, d.id, w) === null).map((d) => d.id), c = u ? je(i) ?? Me(t, u, w) : null;
    b && b.noteId === i.id && b.laneId === u && b.refusal === c || (b = { noteId: i.id, laneId: u, refusal: c, open: I }, Se());
  }, xe.onFreeDrop = (i, l, u) => {
    if (wn(), !qe() || i.options?.isComment) return;
    const w = Je(l);
    if (!w) return;
    const I = Ye(i), c = t.lanes.find((f) => f.id === w), d = je(i) ?? Me(t, w, I);
    return d ? (Q(!1), R = { laneId: w, reason: d, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${gn(I.label)} can't go in ${c.label}. ${d}`), B(o.onRefuse, { noteId: i.id, laneId: w, reason: d }), "refused") : (yn([{ node: i, offer: I, from: u }], w), "taken");
  }, xe.onFreeGroupDrop = (i, l, u) => {
    if (wn(), !qe() || i.some((f) => f.options?.isComment)) return;
    const w = Je(l);
    if (!w) return;
    const I = t.lanes.find((f) => f.id === w), c = i.map((f) => ({ node: f, offer: Ye(f) })), d = Ht(c, w);
    if (d) {
      Q(!1), R = { laneId: w, reason: d, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${qn(c.map((f) => gn(f.offer.label)))} can't go in ${I.label}. ${d}`);
      for (const { node: f } of c) B(o.onRefuse, { noteId: f.id, laneId: w, reason: d });
      return "refused";
    }
    return yn(c.map((f, y) => ({ ...f, from: u?.[y] })), w), "taken";
  }, xe.onFreeTextCommit = (i) => {
    if (!qe() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const l = i.options ?? {}, u = Je({ x: (l.x ?? 0) + (l.width ?? 0) / 2, y: (l.y ?? 0) + (l.height ?? 0) / 2 });
    if (!u) return;
    const w = Ye(i), I = t.lanes.find((L) => L.id === u), c = je(i) ?? Me(t, u, w);
    if (!c) {
      yn([{ node: i, offer: w }], u);
      return;
    }
    Q(!1), R = { laneId: u, reason: c, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${gn(w.label)} can't go in ${I.label}. ${c} It is beside the board.`), B(o.onRefuse, { noteId: i.id, laneId: u, reason: c });
    const { width: d } = Le(t), f = Math.round(q.x + d + 32), y = Math.round(l.y ?? q.y);
    i.position(f, y, () => e.updateSelectionResizeRotate?.(), void 0, Sn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [at({ ...i.options, x: f, y })] });
  }, xe.undoState = () => ({ cards: t.cards.map((i) => ({ ...i })), pairs: [...$] }), xe.onUndoRestore = (i, l) => {
    if (h) return;
    const u = new Map((i?.cards ?? []).map((c) => [c.id, c])), w = new Map(i?.pairs ?? []), I = (c) => $.get(c) ?? w.get(c) ?? c;
    for (const c of l.added) {
      const d = I(c), f = t.cards.find((y) => y.id === d);
      f && (t = Y({ ...t, cards: t.cards.filter((y) => y !== f) }), H(t), lt(B(o.onChange, t, { cardId: d, cardToNote: { noteId: c } })));
    }
    for (const c of l.removed) {
      const d = I(c), f = u.get(d);
      if (!f || t.cards.some((F) => F.id === d)) continue;
      const y = { id: d, label: f.label, ...f.look ? { look: f.look } : {}, ...f.asNote ? { asNote: f.asNote } : {} }, L = [f.laneId, ...t.lanes.map((F) => F.id)].find((F) => De(t, F, y));
      if (!L) {
        e.announce?.(`${f.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Dt(De(t, L, y), d, i?.cards ?? []), d !== c && $.set(c, d), H(t);
      const A = t.cards.findIndex((F) => F.id === d), N = t.cards.slice(A + 1).find((F) => F.laneId === L)?.id;
      lt(B(o.onChange, t, { cardId: d, laneId: L, noteToCard: {
        noteId: c,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...N ? { before: N } : {}
      } }));
    }
  };
  const Wt = e.setDragPolicy(xe), Ft = o.onSelect && e.onSelectionChange?.(() => mn()), Bn = () => {
    r && Ce();
  };
  e.element?.addEventListener?.("pointerdown", Bn, !0), H(t, { animate: !1 });
  function Gn(i, l, u) {
    const w = t.cards.find((A) => A.id === i);
    if (!w) return { kind: "outside" };
    if (s) {
      const A = bn(l), N = s.refusalAt(t, i, E?.grab ?? { x: 0, y: 0 }, A, K);
      if (N && !N.lands) return { kind: "refused", laneId: N.laneId, reason: N.reason };
      const { width: F, height: de } = Le(t);
      if (A.x < -40 || A.y < -40 || A.x > F + 40 || A.y > de + 40) return { kind: "outside" };
      let X = t;
      try {
        X = u?.(A) ?? t;
      } catch (Re) {
        console.warn("WORKSHOP: the board kit's chooser threw", Re);
      }
      return JSON.stringify(X) === JSON.stringify(t) ? N ? { kind: "refused", laneId: N.laneId, reason: N.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: X.cards.find((Re) => Re.id === i)?.laneId ?? w.laneId, next: X, ...N && { said: N.reason } };
    }
    const I = t.lanes.map((A) => k.get(se(ne.column(A.id)))).filter(Boolean), c = e.hitTestNodes(l, I, { padding: 6 }), d = c ? le(c.id).key : null;
    if (!d) return { kind: "outside" };
    if (d === w.laneId) return { kind: "home" };
    const f = Ge(t, i, d);
    if (!f) return { kind: "refused", laneId: d, reason: tn(t, i, d) ?? "That move is not available." };
    if (!u) return { kind: "candidate", laneId: d, next: f };
    let y = null;
    try {
      y = u({ x: l.x - q.x, y: l.y - q.y });
    } catch (A) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", A), { kind: "candidate", laneId: d, next: f };
    }
    const L = y?.cards.find((A) => A.id === i)?.laneId;
    return !y || !L || L === w.laneId ? { kind: "home" } : { kind: "candidate", laneId: L, next: y };
  }
  function zt() {
    return s ? !1 : new Set(We(t, { layout: K }).places.map((i) => i.row)).size > 1;
  }
  function Un(i, l, u = !1) {
    const w = t.cards.find((A) => A.id === i), I = ct(t, i), c = r?.cardId === i && r.laneId === null ? r.side : void 0;
    if (c !== void 0) {
      if (u || l === c) return;
      const A = c > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Ce(), A.id === w.laneId) {
        Ie(A.id, C ?? t), e.announce?.(`${w.label} is back in ${A.label}.`);
        return;
      }
      if (I.includes(A)) {
        const F = Ge(t, i, A.id);
        r = { cardId: i, laneId: A.id, next: F }, H(F), Ie(A.id, F), B(o.onPreview, F), e.announce?.(`${w.label} to ${A.label}: ${ge(F, A.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const N = tn(t, i, A.id) ?? "That move is not available.";
      Q(), R = { laneId: A.id, reason: N, timer: setTimeout(() => Q(), 1500) }, H(C ?? t), Ie(A.id, C ?? t), e.announce?.(`${w.label} can't move to ${A.label}. ${N}`), B(o.onRefuse, { cardId: i, laneId: A.id, reason: N });
      return;
    }
    const d = r?.cardId === i ? r.laneId : w.laneId;
    let f;
    if (u) {
      const { places: A } = We(t, { layout: K }), N = A.find((F) => F.laneId === d);
      f = A.filter((F) => F.column === N.column && (F.row - N.row) * l > 0).sort((F, de) => (F.row - de.row) * l).map((F) => t.lanes.find((de) => de.id === F.laneId));
    } else {
      const A = t.lanes.findIndex((N) => N.id === d);
      f = l > 0 ? t.lanes.slice(A + 1) : t.lanes.slice(0, A).reverse();
    }
    const y = f.find((A) => I.includes(A));
    if (Q(), !y) {
      const A = f[0];
      if (!A) {
        if (!u && on(t)) {
          const F = rn(t, i);
          if (F) {
            e.announce?.(F), B(o.onRefuse, { cardId: i, laneId: null, reason: F });
            return;
          }
          jt(w, l);
          return;
        }
        e.announce?.(`${w.label} has no lane to move to on that side.`);
        return;
      }
      const N = tn(t, i, A.id) ?? "That move is not available.";
      R = { laneId: A.id, reason: N, timer: setTimeout(() => Q(), 1500) }, H(r?.next ?? C ?? t), Ie(A.id, r?.next ?? C ?? t), e.announce?.(`${w.label} can't move to ${A.label}. ${N}`), B(o.onRefuse, { cardId: i, laneId: A.id, reason: N });
      return;
    }
    if (y.id === w.laneId) {
      Ce(), Ie(y.id, C ?? t), e.announce?.(`${w.label} is back in ${y.label}.`);
      return;
    }
    const L = Ge(t, i, y.id);
    r = { cardId: i, laneId: y.id, next: L }, H(L), Ie(y.id, L), B(o.onPreview, L), e.announce?.(`${w.label} to ${y.label}: ${ge(L, y.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ie(i, l = t) {
    const u = s ? Kt(l, ne.column(i)) : We(l, { layout: K, rows: Vn() }).places.find((y) => y.laneId === i), w = e.canvas?.viewbox?.();
    if (!u || !w || !(w.width > 0) || !(w.height > 0)) return;
    const I = 16, c = (y, L, A, N) => L + I * 2 >= N || y - I < A ? y - I - A : y + L + I > A + N ? y + L + I - (A + N) : 0, d = c(q.x + u.x, u.width, w.x, w.width), f = c(q.y + u.y, u.height, w.y, w.height);
    (d || f) && e.panBy?.({ x: d, y: f });
  }
  function mn() {
    if (!o.onSelect || re) return;
    const i = h ? [] : e.getSelectedNodes?.() ?? [], l = i.length === 1 && k.get(i[0].id) === i[0] ? le(i[0].id) : null, u = l?.kind === "card" ? { cardId: l.key } : l?.kind === "lane" ? { laneId: l.key } : null, w = u ? JSON.stringify(u) : null;
    w !== Pe && (Pe = w, B(o.onSelect, u));
  }
  function Kn() {
    p && (p = null, H(t), B(o.onPreview, null));
  }
  function Ce() {
    r && (r = null, B(o.onPreview, null), H(C ?? t));
  }
  function jt(i, l) {
    const { width: u } = Le(t), w = k.get(se(ne.card(i.id)))?.options, I = w?.width ?? 228, c = { x: l > 0 ? q.x + u + 32 : q.x - I - 32, y: w?.y ?? q.y }, d = ft(t, i.id);
    r = { cardId: i.id, laneId: null, side: l, spot: c, next: t }, H(t), B(o.onPreview, d), e.announce?.(`${i.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ke() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function qe() {
    return !h && !v && !C && !E && !Ke() && on(t);
  }
  function wn() {
    b && (b = null, h || Se());
  }
  function Je(i) {
    const l = t.lanes.map((w) => k.get(se(ne.column(w.id)))).filter(Boolean), u = e.hitTestNodes(i, l, { padding: 6 });
    return u ? le(u.id)?.key ?? null : null;
  }
  function Ye(i) {
    const l = i.options ?? {}, u = Io({
      backgroundColor: l.backgroundColor,
      textColor: l.fontColor,
      fontFamily: l.fontFamily,
      fontSize: l.fontSize,
      borderColor: l.borderColor,
      borderWidth: l.borderWidth
    }), w = String(l.text ?? ""), I = w.replace(/\s+/g, " ").trim(), c = {};
    w.trim() !== I && w.length <= 400 && (c.text = w.trim()), typeof l.shape == "string" && /^[a-z]{1,24}$/i.test(l.shape) && (c.shape = l.shape);
    for (const d of ["width", "height"]) Number.isFinite(l[d]) && l[d] >= 10 && l[d] <= 4e3 && (c[d] = Math.round(l[d]));
    return { id: i.id, label: I, ...u ? { look: u } : {}, ...Object.keys(c).length ? { asNote: c } : {} };
  }
  function qn(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function Ht(i, l) {
    for (const { node: c } of i) {
      const d = je(c);
      if (d) return d;
    }
    const u = t.lanes.find((c) => c.id === l), w = t.cards.filter((c) => c.laneId === l).length;
    if (u.capacity !== void 0 && w + i.length > u.capacity) {
      const c = u.capacity - w;
      return c > 0 ? `It has room for ${c} more ${c === 1 ? "card" : "cards"}.` : `It already holds ${w} of ${u.capacity} ${u.capacity === 1 ? "card" : "cards"}.`;
    }
    let I = t;
    for (const { offer: c } of i) {
      const d = Me(I, l, c);
      if (d) return d;
      I = De(I, l, c);
    }
    return null;
  }
  function je(i) {
    return (i.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((u) => u !== i && (u.relationships?.associations ?? []).some((w) => w.child === i || w.childId === i.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : i.options?.image ? "A note with a picture stays a note." : i.options?.link?.show && i.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const gn = (i) => i || "This note";
  function yn(i, l) {
    let u = t;
    const w = i.map(({ node: d, offer: f, from: y }) => {
      u = De(u, l, f);
      const L = { ...d.options ?? {}, ...y ? { x: y.x, y: y.y } : {} };
      return { node: d, card: u.cards[u.cards.length - 1], kept: L };
    });
    e.beginHostStep?.(), t = u;
    let I = t;
    for (const { node: d, card: f } of w)
      f.id !== d.id && $.set(d.id, f.id), T.set(se(ne.card(f.id)), { x: d.options?.x ?? 0, y: d.options?.y ?? 0 }), Ve(() => e.removeNode(d.id));
    e.endHostStep?.(), H(t), Bt(se(ne.card(w[0].card.id)));
    const c = t.lanes.find((d) => d.id === l);
    e.announce?.(w.length === 1 ? `${w[0].card.label} is now a card in ${c.label}. ${ge(t, l)}.` : `${qn(w.map(({ card: d }) => d.label))} are now cards in ${c.label}. ${ge(t, l)}.`);
    for (const { node: d, card: f, kept: y } of w) {
      const L = { cardId: f.id, laneId: l, noteToCard: {
        noteId: d.id,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {}
      } }, A = () => {
        t !== I || !t.cards.some((N) => N.id === f.id) || (t = Y({ ...t, cards: t.cards.filter((N) => N.id !== f.id) }), I = t, H(t));
      };
      Jn(B(o.onChange, t, L), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: d.id, isComment: !1 } }]);
      }, () => {
        if (!h) {
          if (A(), !e.nodes.one(y.id)) {
            e.beginHostStep?.();
            const N = Ve(() => e.addNode({ ...y }));
            N && (N.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${f.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        h || (A(), e.announce?.(`Someone else put ${f.label} on the board first.`));
      });
    }
  }
  function kn(i, l) {
    const u = t.cards.find((ee) => ee.id === i), w = t.lanes.find((ee) => ee.id === u.laneId), I = t.cards.findIndex((ee) => ee.id === i), c = t.cards.slice(I + 1).find((ee) => ee.laneId === u.laneId)?.id, d = ft(t, i), f = S.get(se(ne.card(i))) ?? {}, y = e.nodes.one(i) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : i, L = (Oe.cornerRadius ?? 0) > 0, A = u.asNote, N = A?.text !== void 0 && A.text.replace(/\s+/g, " ").trim() === u.label ? A.text : To(t, u), F = {
      id: y,
      x: Math.round(l.x),
      y: Math.round(l.y),
      width: A?.width ?? f.width ?? 228,
      height: A?.height ?? f.height ?? 76,
      text: N,
      shape: A?.shape ?? (L ? "roundedrectangle" : "rectangle"),
      backgroundColor: u.look?.backgroundColor ?? f.backgroundColor,
      fontColor: u.look?.textColor ?? f.foregroundColor,
      fontSize: u.look?.fontSize ?? f.fontSize,
      borderColor: u.look?.borderColor ?? f.borderColor,
      borderWidth: u.look?.borderWidth ?? f.borderWidth,
      ...u.look?.fontFamily ?? f.fontFamily ? { fontFamily: u.look?.fontFamily ?? f.fontFamily } : {}
    };
    for (const ee of Object.keys(F)) F[ee] === void 0 && delete F[ee];
    e.beginHostStep?.(), t = d;
    const de = t;
    y !== i ? $.set(y, i) : $.delete(y);
    const X = Ve(() => e.addNode(F));
    X && (X.announcedByCreator = !0), e.endHostStep?.(), H(t), X?.ready?.then?.(() => {
      if (h || e.nodes.one(y) !== X) return;
      const ee = () => e.selectNodes?.([X]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(ee) : ee();
    }), e.announce?.(`${u.label} is now a note on the canvas. ${w.label}: ${ge(t, w.id)}.`);
    const Re = () => {
      e.nodes.one(y) === X && (e.beginHostStep?.(), Ve(() => e.removeNode(y)), e.endHostStep?.());
    };
    Jn(B(o.onChange, t, { cardId: i, cardToNote: { noteId: y } }), () => {
      X && e.nodes.one(y) === X && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: at(X.options) } }]);
    }, () => {
      if (!h) {
        if (Re(), t === de && !t.cards.some((ee) => ee.id === i)) {
          const ee = { id: i, label: u.label, ...u.look ? { look: u.look } : {}, ...u.asNote ? { asNote: u.asNote } : {} }, Xn = De(t, u.laneId, ee, c);
          Xn && (t = Xn, H(t));
        }
        e.announce?.(`${u.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      h || (Re(), e.announce?.(`Someone else took ${u.label} off the lanes first.`));
    });
  }
  function Dt(i, l, u) {
    const w = u.map((y) => y.id), I = w.indexOf(l), c = i.cards.find((y) => y.id === l);
    if (I < 0 || !c) return i;
    const d = i.cards.filter((y) => y !== c), f = d.findIndex((y) => w.indexOf(y.id) > I);
    return d.splice(f < 0 ? d.length : f, 0, c), Y({ ...i, cards: d });
  }
  function Bt(i) {
    j = j.then(() => {
      const l = k.get(i);
      if (h || !l) return;
      const u = () => e.selectNodes?.([l]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(u) : u();
    });
  }
  function Ve(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function Jn(i, l, u, w) {
    if (!i || typeof i.then != "function") return l();
    const I = i.then((c) => {
      c === !0 ? l() : c === !1 ? u() : c === "taken" && w();
    }, () => u());
    e.holdUntil?.(I);
  }
  function Gt(i, l) {
    Q(!1), R = { laneId: l.laneId, reason: l.reason, timer: setTimeout(() => Q(), 1500) }, H(t, { skip: l.cardId });
    const u = t.lanes.find((w) => w.id === l.laneId);
    e.announce?.(`${i} can't move to ${u?.label ?? "that lane"}. ${l.reason}`), B(o.onRefuse, l);
  }
  function Q(i = !0) {
    R && (clearTimeout(R.timer), R = null, i && !h && Se());
  }
  function Se() {
    H(E && E.outcome.kind === "candidate" ? E.outcome.next : r?.next ?? C ?? t, { skip: E?.cardId });
  }
  function Yn(i) {
    const l = Zn(i, Vn()), u = new Map(l.map((c) => [c.options.id, c.options])), w = (c, d, f, y = !1) => {
      const L = u.get(ne.column(c));
      L && (L.borderColor = d, L.borderWidth = f, delete L.borderStyle);
      const A = y && u.get(ne.lane(c));
      A && (A.borderColor = d, A.borderWidth = f);
    }, I = E?.cardId ?? r?.cardId;
    if (ie = /* @__PURE__ */ new Map(), I) {
      const c = t.cards.find((y) => y.id === I)?.laneId, d = ct(t, I);
      if (!s || s.laneCues)
        for (const y of d) y.id !== c && (w(y.id, it, 2), ie.set(y.id, "open"));
      if (s?.laneCues) {
        for (const y of t.lanes) if (!d.includes(y)) {
          const L = u.get(ne.column(y.id));
          L && (L.backgroundColor = "#e9e8e2"), ie.set(y.id, "closed");
        }
      }
      const f = E ? E.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      f?.kind === "candidate" && (w(f.laneId, st, 3, !0), ie.set(f.laneId, "over")), f?.kind === "refused" && (w(f.laneId, Tn, 3), ie.set(f.laneId, "refused"));
    }
    if (b && !I) {
      for (const c of b.open) c !== b.laneId && (w(c, it, 2), ie.set(c, "open"));
      b.laneId && !b.refusal && (w(b.laneId, st, 3, !0), ie.set(b.laneId, "over")), b.laneId && b.refusal && (w(b.laneId, Tn, 3), ie.set(b.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const c = u.get(ne.card(r.cardId));
      c && (c.xPos = r.spot.x, c.yPos = r.spot.y);
    }
    if (R) {
      ie.set(R.laneId, "refused"), w(R.laneId, Tn, 3, !0);
      const c = u.get(ne.caption(R.laneId));
      c && (c.text = R.reason, c.foregroundColor = "#b42318");
    }
    if (ve = /* @__PURE__ */ new Set(), C && i === C) {
      const c = (f, y) => JSON.stringify(f) === JSON.stringify(y), d = (f) => {
        const y = u.get(f);
        y && (y.borderStyle = "dashed", y.borderColor = mo, y.borderWidth = 2, ve.add(se(f)));
      };
      for (const f of i.cards) c(f, t.cards.find((y) => y.id === f.id)) || d(ne.card(f.id));
      for (const f of i.lanes) c(f, t.lanes.find((y) => y.id === f.id)) || d(ne.lane(f.id));
    }
    for (const c of l) {
      c.options.id = se(c.options.id);
      for (const d of c.relationships.associations)
        d.parentId = se(d.parentId), d.childId = se(d.childId);
    }
    return l;
  }
  function Vn() {
    return E || r ? t.lanes.map((i) => t.cards.filter((l) => l.laneId === i.id).length) : void 0;
  }
  function H(i, l = {}) {
    if (h) return;
    V = { model: i, skip: l.skip, grip: l.grip, animate: l.animate !== !1 };
    const u = Yn(i), w = [];
    for (const { options: c } of u) {
      const d = c.id;
      if (k.has(d)) continue;
      const f = T.get(d);
      T.delete(d);
      const y = f && l.animate !== !1 && !Sn() ? { ...c, xPos: f.x, yPos: f.y } : c, L = e.nodes.add(co(y));
      k.set(d, L), S.set(d, { ...y }), L.ready && w.push(L.ready.then(() => {
        if (k.get(d) !== L) return;
        L.applyGovernance?.(), le(d)?.kind === "column" && L.toBack?.(!1), le(d)?.kind === "handle" && L.svgGroup?.front?.();
        const A = Qn(V?.model ?? i, d);
        A && L.svgGroup?.node?.setAttribute("aria-label", A);
      }).catch(() => {
      }));
    }
    const I = V;
    j = Promise.all([j, ...w]).then(() => {
      h || V !== I || Ut(Yn(I.model), I);
    }).catch((c) => console.warn("WORKSHOP: could not draw the workshop", c));
  }
  function Ut(i, l) {
    const u = new Set(i.map((I) => I.options.id)), w = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [c, d] of [...k]) {
        if (u.has(c)) continue;
        for (const [y, L] of [...x])
          L.parentId !== c && L.childId !== c || (L.parent.relationships?.removeAssociation(y), x.delete(y));
        e.deselectNode?.(d), d.editor?.cancelInline?.(), k.delete(c), S.delete(c);
        const f = z.get(c);
        f && (z.delete(c), D.delete(f)), e.nodes.remove(c);
      }
      for (const { options: c } of i) {
        const d = c.id, f = k.get(d);
        if (!f?.svgGroup) continue;
        const y = S.get(d) ?? {}, L = f.editor?.isInlineEditing?.();
        (c.fontSize !== y.fontSize || c.foregroundColor !== y.foregroundColor) && (f.options.fontSize = c.fontSize, f.options.fontColor = c.foregroundColor, f.applyTextStyle?.()), c.text !== y.text && !L && f.setText?.(c.text), (c.width !== y.width || c.height !== y.height) && (c.vectorPath ? (f.options.width = c.width, f.options.height = c.height, f.setShape?.(f.options.shape, c.vectorPath), le(d)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(c.width, c.height)), c.backgroundColor !== y.backgroundColor && f.setColors?.(c.backgroundColor), (c.borderColor !== y.borderColor || c.borderWidth !== y.borderWidth || c.borderStyle !== y.borderStyle) && (f.options.borderColor = c.borderColor, f.options.borderWidth = c.borderWidth, f.options.borderStyle = c.borderStyle, f.applyBorder?.());
        const A = c.xPos !== y.xPos || c.yPos !== y.yPos || Math.abs((f.options.x ?? 0) - c.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - c.yPos) > 0.5;
        if (d !== (l.skip && se(ne.card(l.skip))) && d !== (l.grip && se(l.grip)) && A) {
          const de = l.animate && !Sn() ? 180 : 0, X = w.includes(f) ? () => {
            !h && k.get(d) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          X && de && w.length === 1 && f.resizeRotate?.disable?.(), f.position(c.xPos, c.yPos, X, void 0, de);
        }
        const N = Qn(l.model, d);
        N && f.svgGroup.node.getAttribute("aria-label") !== N && f.svgGroup.node.setAttribute("aria-label", N), ve.has(d) ? f.svgGroup.node.setAttribute("data-workshop-proposed", "") : f.svgGroup.node.removeAttribute("data-workshop-proposed");
        const F = le(d);
        if (F?.kind === "column") {
          const de = ie.get(F.key);
          de ? f.svgGroup.node.setAttribute("data-workshop-drop", de) : f.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        F?.kind === "handle" && f.svgGroup.front?.(), S.set(d, { ...c });
      }
      const I = /* @__PURE__ */ new Map();
      for (const c of i) for (const d of c.relationships.associations) I.set(d.id, d);
      for (const [c, d] of [...x])
        I.has(c) && k.get(d.parentId) === d.parent && k.get(d.childId) === d.child || (d.parent.relationships?.removeAssociation(c), x.delete(c));
      for (const [c, d] of I) {
        if (x.has(c)) continue;
        const f = k.get(d.parentId), y = k.get(d.childId);
        !f?.relationships || !y?.svgGroup || (f.relationships.addAssociation(y, ho(d)), x.set(c, { parentId: d.parentId, childId: d.childId, parent: f, child: y }));
      }
    }), m) {
      const I = t.lanes.map((y) => k.get(se(ne.column(y.id)))?.svgGroup?.node).reduce((y, L) => L && (!y || y.compareDocumentPosition(L) & 4) ? L : y, null), c = l.model, d = e.canvas?.viewbox?.(), f = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - q.x, y: d.y - q.y, width: d.width, height: d.height } : null;
      m.draw(t, c === t ? null : c, {
        origin: q,
        layout: K,
        above: I,
        view: f,
        announce: (y) => e.announce?.(y),
        clamp: g?.last?.clampedReason ? { name: g.name, text: g.last.clampedReason } : E?.outcome.kind === "candidate" && E.outcome.said ? { name: "card-" + E.cardId, text: E.outcome.said } : !g && _ ? { name: _.name, text: _.reason } : null,
        refused: !!g?.last?.refusal || !g && !!_,
        onUnlink: (y, L) => {
          if (v || C || E || g || Ke()) return;
          const A = Ne(t, [{ kind: "unlink_tasks", card: { id: y }, waitsOn: { id: L } }]);
          "refused" in A ? e.announce?.(A.refused.reason) : Ze(A.workshop, { cardId: y });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function bn(i) {
    return { x: i.x - q.x, y: i.y - q.y };
  }
  function Le(i) {
    return s ? s.places(i, K) : { ...We(i, { layout: K }), parts: [] };
  }
  function Kt(i, l) {
    const u = s.places(i, K).parts.find((w) => w.name === l);
    return u ? { x: u.x, y: u.y, width: u.width, height: u.height } : void 0;
  }
  function Zn(i, l) {
    if (!s) return Eo(i, { native: !0, origin: q, rows: l, layout: K, style: Oe }).nodes;
    const u = s.notes(i, K, q, Oe);
    if (i.behaviour && u.length) {
      const w = u.map((f) => f.options), I = Math.min(...w.map((f) => f.xPos)), c = Math.max(...w.map((f) => f.xPos + f.width)), d = Mt(i, { x: I, y: Math.max(...w.map((f) => f.yPos + f.height)) + 16, width: Math.min(c - I, 484) }, Oe);
      d && u.push(d);
    }
    return u;
  }
  function Ze(i, l, u) {
    const w = s.editsBetween(t, i);
    if (!w.length) return !1;
    const I = Ne(t, w);
    return "refused" in I ? (e.announce?.(I.refused.reason), B(o.onRefuse, { ...l, laneId: I.refused.laneId, reason: I.refused.reason }), !1) : (t = I.workshop, H(t, { skip: u }), e.announce?.(I.report.edits.map((c) => c.said).join(" ")), B(o.onChange, t, { ...l, edits: w }), !0);
  }
  function Qn(i, l) {
    const u = le(l);
    if (u?.kind === "lane") {
      const w = i.lanes.find((I) => I.id === u.key);
      return w ? `${w.label}, ${ge(i, w.id)}` : null;
    }
    if (u?.kind === "card") {
      const w = i.cards.find((c) => c.id === u.key), I = w && i.lanes.find((c) => c.id === w.laneId);
      return w && I ? `${w.label}, in ${I.label}${s?.cardKeys ? ". " + s.cardKeys : ""}` : null;
    }
    return u?.kind === "handle" ? s?.label?.(i, ke(l)) ?? null : null;
  }
  function vn(i, l) {
    const u = Zn(i).find((w) => w.options.id === l)?.options;
    return u ? { x: u.xPos, y: u.yPos } : null;
  }
  function Ee() {
    (E || g) && e.cancelGovernedDrag?.("host"), E = null, g = null, r && (r = null, B(o.onPreview, null)), Q(!1);
  }
  return {
    toCanvas(i) {
      if (h || v || Ke()) return "This workshop is view-only here.";
      if (!t.cards.some((I) => I.id === i)) return "That card is no longer on the board.";
      const l = rn(t, i);
      if (l) return l;
      r && Ce(), C && (Ee(), C = null, H(t), e.refreshGovernance?.());
      const { width: u } = Le(t), w = k.get(se(ne.card(i)))?.options;
      return kn(i, { x: q.x + u + 32, y: w?.y ?? q.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...q };
    },
    get layout() {
      return { ...K };
    },
    get bounds() {
      const { width: i, height: l } = Le(t);
      return { x: q.x, y: q.y, width: i, height: l };
    },
    setLayout(i) {
      if (h) throw new Error("This workshop has been detached.");
      const l = dt(i);
      s ? s.places(t, l) : We(t, { layout: l }), JSON.stringify(l) !== JSON.stringify(K) && (Ee(), K = l, H(C ?? t));
    },
    whenDrawn: () => j,
    update(i) {
      if (h) throw new Error("This workshop has been detached.");
      const l = Y(i);
      Ee(), t = l;
      const u = v;
      v = P || a(t), H(C ?? t), v !== u && e.refreshGovernance?.();
    },
    preview(i) {
      if (h) throw new Error("This workshop has been detached.");
      const l = i ? Y(i) : null;
      Ee(), C = l, H(C ?? t), e.refreshGovernance?.();
    },
    refuse(i, l) {
      const u = t.lanes.find((w) => w.id === i);
      h || !u || (Q(!1), R = { laneId: i, reason: l, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${u.label}: ${l}`));
    },
    setReadOnly(i) {
      P = !!i;
      const l = P || a(t);
      h || v === l || (Ee(), v = l, H(C ?? t), e.refreshGovernance?.());
    },
    destroy() {
      h || (Ee(), h = !0, _ && clearTimeout(_.timer), e.element?.removeEventListener?.("pointerdown", Bn, !0), Ft?.(), e.withPolicyAuthority(() => {
        for (const [i, l] of x) l.parent.relationships?.removeAssociation(i);
        for (const [i, l] of k)
          e.deselectNode?.(l), l.editor?.cancelInline?.(), e.nodes.one(i) === l && e.nodes.remove(i);
      }), x.clear(), k.clear(), S.clear(), D.clear(), z.clear(), Wt(), m?.destroy(), re = !1, mn(), e.notifyNodeChanged?.());
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
function lt(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
  }, () => {
  });
}
function yo(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function dt(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function ko(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const s of n)
    o = Math.max(o, (s.options.x ?? 0) + (s.options.width ?? 0)), t = Math.min(t, s.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const bo = ["launch-plan", "pipeline", "budget", "hiring-plan"];
function Z(e) {
  return bo.includes(e.kind) ? e.kind : void 0;
}
function ye(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ue(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function xt(e) {
  const n = ye(e);
  let o;
  try {
    o = new URL(ue(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: ue(n.alt, 240) };
}
function fe(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const vo = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, xo = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Ue(e) {
  const n = ye(e), o = {}, t = (a) => {
    if (typeof a != "string" || !vo.test(a)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return a;
  }, s = (a, m, g) => {
    if (typeof a != "number" || !Number.isFinite(a) || a < m || a > g) throw new Error("A card size is out of range.");
    return a;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !xo.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = s(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = s(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Io(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        Ue({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Ue(n);
}
function Fn(e) {
  const n = ye(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string" || n.text.length > 400 || /[<>\u0000-\u0009\u000b-\u001f]/.test(n.text)) throw new Error("A card keeps plain words only.");
    o.text = n.text;
  }
  if (n.shape !== void 0) {
    if (typeof n.shape != "string" || !/^[a-z]{1,24}$/i.test(n.shape)) throw new Error("A card keeps a shape by its name only.");
    o.shape = n.shape;
  }
  for (const t of ["width", "height"]) {
    const s = n[t];
    if (s !== void 0) {
      if (typeof s != "number" || !Number.isFinite(s) || s < 10 || s > 4e3) throw new Error("A note size is out of range.");
      o[t] = s;
    }
  }
  return Object.keys(o).length ? o : void 0;
}
function Te(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function zn({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((s) => s.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Co(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Fe = (e) => "lane-" + e, be = (e) => "card-" + e, fn = (e) => "image-" + e;
function or(e) {
  const n = Co(e);
  return zn(e).map((o) => {
    const t = e.cards.filter((m) => m.laneId === o.id), s = n.filter((m) => m.laneId === o.id), a = [Fe(o.id)];
    return o.station?.image && a.push(fn(o.id)), { lane: o, cards: t, signals: s, nodeIds: [...a, ...t.map((m) => be(m.id))] };
  });
}
const It = 5, Ct = 24, Ln = 3;
function Y(e) {
  const n = ye(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !Z(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = Z(n), s = t ? he(t) : void 0, a = { id: fe }, m = ue(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > It)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > Ct)
    throw new Error("A workshop supports up to 24 cards.");
  if (s && n.cards.length > s.cards[0]) throw new Error(s.cards[1]);
  const g = n.lanes.map((h) => {
    const k = ye(h), S = { id: fe(k.id), label: ue(k.label) };
    if (k.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (k.capacity !== void 0) {
      const x = o ? 576 : 24;
      if (typeof k.capacity != "number" || !Number.isInteger(k.capacity) || k.capacity < 1 || k.capacity > x)
        throw new Error(`Lane capacity must be a whole number from 1 to ${x}.`);
      S.capacity = k.capacity;
    }
    if (s?.readLane?.(k, S, a), k.station !== void 0) {
      const x = ye(k.station), D = (E) => {
        if (typeof E != "number" || !Number.isInteger(E) || E < 0 || E >= Ln)
          throw new Error("Use map coordinates from 0 to 2.");
        return E;
      };
      if (!Array.isArray(x.next) || x.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const z = x.next.map(fe);
      Te(z, "onward stop"), S.station = { column: D(x.column), row: D(x.row), next: z, outcome: ue(x.outcome, 160) }, x.image !== void 0 && (S.station.image = xt(x.image));
    }
    return S;
  }), C = g.map((h) => h.id);
  if (Te(C, "lane ID"), t && g.some((h) => h.station)) throw new Error("A business board has no map stations.");
  if ((o || g.some((h) => h.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (g.some((h) => h.station)) {
    if (!g.every((h) => h.station)) throw new Error("Give every station on the map a position.");
    Te(g.map((h) => h.station.column + "," + h.station.row), "map position");
    for (const h of g)
      if (h.station.next.some((k) => k === h.id || !C.includes(k))) throw new Error("Connect each stop to another station on this map.");
  }
  const P = n.cards.map((h) => {
    const k = ye(h), S = { id: fe(k.id), label: ue(k.label), laneId: fe(k.laneId) };
    if (!C.includes(S.laneId)) throw new Error("Card refers to an unknown lane.");
    if (k.allowedLaneIds !== void 0) {
      if (!Array.isArray(k.allowedLaneIds) || k.allowedLaneIds.length > g.length) throw new Error("Invalid allowed lanes.");
      if (S.allowedLaneIds = k.allowedLaneIds.map(fe), Te(S.allowedLaneIds, "allowed lane"), !S.allowedLaneIds.includes(S.laneId) || !S.allowedLaneIds.every((x) => C.includes(x)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (k.look !== void 0) {
      const x = Ue(k.look);
      x && (S.look = x);
    }
    if (k.asNote !== void 0) {
      const x = Fn(k.asNote);
      x && (S.asNote = x);
    }
    if (s?.readCard(k, S, a), o) {
      if (typeof k.points != "number" || !Number.isInteger(k.points) || k.points < 1 || k.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (S.points = k.points, k.dependsOn !== void 0) {
        if (!Array.isArray(k.dependsOn) || k.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        S.dependsOn = k.dependsOn.map(fe), Te(S.dependsOn, "dependency");
      }
    }
    return S;
  });
  Te(P.map((h) => h.id), "card ID");
  const v = { version: 1, title: m, lanes: g, cards: P };
  if (n.experience !== void 0) {
    const h = ye(n.experience);
    if (h.version !== 1 || h.kind !== "customer-interviews" && h.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    v.experience = { version: 1, kind: h.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    v.signals = n.signals.map((h) => {
      const k = ye(h), S = fe(k.cardId), x = fe(k.laneId);
      if (!P.some((D) => D.id === S) || !C.includes(x))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: fe(k.id),
        label: ue(k.label),
        cardId: S,
        laneId: x,
        whenPresent: ue(k.whenPresent, 160),
        whenAbsent: ue(k.whenAbsent, 160)
      };
    }), Te(v.signals.map((h) => h.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    v.presentationOrder = zn({ lanes: g, presentationOrder: n.presentationOrder }).map((h) => h.id);
  }
  if (n.behaviour !== void 0 && (v.behaviour = ce().validate(n.behaviour, { ...v, kind: n.kind })), o)
    return v.kind = "release-plan", qt(v), v;
  if (t && s) {
    v.kind = t, s.readBoard(n, v, a);
    const h = s.validate(v);
    if (h) throw new Error(h);
    return v;
  }
  for (const h of g)
    if (P.filter((k) => k.laneId === h.id).length > (h.capacity ?? 1 / 0))
      throw new Error(`Lane "${h.label}" exceeds its capacity.`);
  return v;
}
const St = 65536;
function rr(e) {
  const n = JSON.stringify(Y(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > St) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function ar(e) {
  if (e.length > St) throw new Error("This workshop is too large to open from a link.");
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
function jn(e, n, o) {
  const t = Z(e);
  return t ? he(t).planMove(e, n, o) : void 0;
}
function cn(e, n) {
  if (Z(e)) return e.lanes.filter((t) => jn(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => un(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((s) => s.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function En(e, n, o) {
  const t = e.cards.find((a) => a.id === n), s = jn(e, n, o);
  if (s !== void 0) {
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (t && e.kind === "release-plan") {
    const a = un(e, t, o);
    if (!a) throw new Error("Move is unavailable.");
    return a;
  }
  if (!t || !cn(e, t).some((a) => a.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((a) => a === t ? { ...t, laneId: o } : a) };
}
function Ge(e, n, o) {
  const t = Tt(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in ce().check(e, t) ? null : t;
}
function Tt(e, n, o) {
  const t = e.cards.find((m) => m.id === n);
  if (!t || !e.lanes.some((m) => m.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return un(e, t, o);
  const s = jn(e, n, o);
  if (s !== void 0) return s;
  const a = Ro(e, n, o);
  return a || (o === "prototype" && ze(e) === "customer-interviews" ? null : cn(e, t).some((m) => m.id === o) ? En(e, n, o) : null);
}
function ct(e, n) {
  return e.lanes.filter((o) => Ge(e, n, o.id) !== null);
}
function tn(e, n, o) {
  const t = Tt(e, n, o);
  if (t !== null) {
    const h = t === e || !e.behaviour ? null : ce().check(e, t);
    return h && "refused" in h ? h.refused.sentence : null;
  }
  const s = e.cards.find((h) => h.id === n), a = e.lanes.find((h) => h.id === o);
  if (!s || !a) return "That move is not available.";
  const m = Z(e), g = m && he(m).refusal;
  if (g) return g(e, n, o);
  const C = `This card can't go in ${a.label}.`;
  if (s.allowedLaneIds && !s.allowedLaneIds.includes(o)) return C;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return C;
    const h = $e(e, o), k = { ...e, lanes: e.lanes.map((x) => x === a ? { id: a.id, label: a.label } : x) }, S = un(k, s, o);
    return S ? `Needs ${$e(S, o) - h} points. It already holds ${h} of ${a.capacity} points.` : C;
  }
  const P = e.lanes.find((h) => h.id === s.laneId);
  if (P?.station && !P.station.next.includes(o)) return `${a.label} can't be reached from ${P.label}.`;
  const v = e.cards.filter((h) => h.laneId === o).length;
  return a.capacity !== void 0 && v >= a.capacity ? `It already holds ${v} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : C;
}
function on(e) {
  return (!e.kind || !!Z(e)) && !e.lanes.some((n) => n.station) && !ze(e);
}
const So = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Hn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && So.test(n) && !o.has(n) ? n : pn(e, "card");
}
function Me(e, n, o) {
  const t = e.lanes.find((m) => m.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((m) => m.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (ze(e)) return "This workshop keeps the cards it came with.";
  const s = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!s) return "A card needs some words. Type on the note first.";
  if (Z(e)) {
    const m = At(e, n, o);
    return typeof m == "string" ? m : ut(e, m);
  }
  if (s.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(s)) return "A card holds plain words only.";
  if (e.cards.length >= Ct) return "A workshop holds up to 24 cards.";
  const a = e.cards.filter((m) => m.laneId === n).length;
  if (t.capacity !== void 0 && a >= t.capacity) return `It already holds ${a} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      Ue(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  if (o.asNote !== void 0)
    try {
      Fn(o.asNote);
    } catch {
      return "This note's shape or words can't be kept on a card.";
    }
  return ut(e, { ...e, cards: [...e.cards, { id: Hn(e, o.id), label: s, laneId: n }] });
}
function ut(e, n) {
  if (!e.behaviour) return null;
  const o = ce().check(e, n);
  return "refused" in o ? o.refused.sentence : null;
}
function De(e, n, o, t) {
  if (Me(e, n, o) !== null) return null;
  if (Z(e)) {
    const P = At(e, n, o), v = P.cards[P.cards.length - 1], h = t === void 0 ? -1 : e.cards.findIndex((k) => k.id === t && k.laneId === n);
    return h < 0 ? P : { ...P, cards: [...e.cards.slice(0, h), v, ...e.cards.slice(h)] };
  }
  const s = o.look === void 0 ? void 0 : Ue(o.look), a = o.asNote === void 0 ? void 0 : Fn(o.asNote), m = {
    id: Hn(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: n,
    ...s ? { look: s } : {},
    ...a ? { asNote: a } : {}
  }, g = t === void 0 ? -1 : e.cards.findIndex((P) => P.id === t && P.laneId === n), C = g < 0 ? [...e.cards, m] : [...e.cards.slice(0, g), m, ...e.cards.slice(g)];
  return Y({ ...e, cards: C });
}
function At(e, n, o) {
  const t = he(Z(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const s = Ne(e, [{ kind: "add_card", lane: { id: n }, ...t }]);
  if ("refused" in s) return s.refused.reason;
  const a = s.workshop.cards;
  return a[a.length - 1] = { ...a[a.length - 1], id: Hn(e, o.id) }, s.workshop;
}
function $t(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = Z(e);
  return o ? he(o).cardText(e, n) : n.label;
}
function To(e, n) {
  const o = Z(e);
  return o ? he(o).noteText(e, n) : n.label;
}
function rn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!on(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((a) => e.lanes.find((m) => m.id === a).label), s = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${s}, so it stays a card.`;
  }
  return null;
}
function ft(e, n) {
  if (rn(e, n) !== null) return null;
  const o = e.cards.filter((t) => t.id !== n).map((t) => {
    if (!t.dependsOn?.includes(n)) return t;
    const s = { ...t, dependsOn: t.dependsOn.filter((a) => a !== n) };
    return s.dependsOn.length || delete s.dependsOn, s;
  });
  return Y({ ...e, cards: o });
}
function ge(e, n) {
  const o = e.lanes.find((g) => g.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const g = $e(e, n);
    return o.capacity ? g + " / " + o.capacity + " points" : g + " points";
  }
  const t = Z(e);
  if (t) return he(t).caption(e, n);
  const s = _o(e, n);
  if (s) return "$" + s.amount + " · " + s.description;
  const a = e.cards.filter((g) => g.laneId === n).length, m = e.behaviour ? ce().laneLimit(e, n) : o.capacity;
  return m !== void 0 ? a + " of " + m : a + (a === 1 ? " card" : " cards");
}
const hn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, an = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Ot(e, n = hn, o = 28) {
  const { pitch: t, row: s, top: a } = n, m = !!e.lanes[0].station, g = e.lanes.map((v) => e.cards.filter((h) => h.laneId === v.id).length), C = a + Math.max(1, ...g) * s + 36, P = e.lanes.map((v, h) => ({
    x: m ? v.station.column * (t + o) : h * t,
    y: m ? v.station.row * C : 0
  }));
  return {
    points: P,
    width: Math.max(...P.map((v) => v.x)) + t,
    height: Math.max(...P.map((v, h) => v.y + a + (m ? Math.max(1, g[h]) : g[h] + 1) * s))
  };
}
function sr() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function pn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((s) => s.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Pt(e) {
  const n = Y(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Ao(e, n) {
  const o = Pt(e), t = pn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Y(o);
}
function $o(e, n, o) {
  const t = Pt(e);
  return t.cards.push({
    id: pn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), Y(t);
}
function ir() {
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
function ht(e, n, o) {
  const t = Y(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const s = t.lanes.find((v) => v.id === n);
  if (!s?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= It) throw new Error("A map can have up to five stations.");
  const a = ue(o?.label), m = ue(o?.outcome, 160), g = pn(t, "station");
  let C, P = 1 / 0;
  for (let v = 0; v < Ln; v++)
    for (let h = 0; h < Ln; h++) {
      if (t.lanes.some((S) => S.station.column === h && S.station.row === v)) continue;
      const k = Math.abs(s.station.column - h) + Math.abs(s.station.row - v);
      k < P && (P = k, C = { column: h, row: v });
    }
  if (!C) throw new Error("There is no free station position.");
  return s.station.next.push(g), t.lanes.push({ id: g, label: a, station: { ...C, next: [], outcome: m, ...o.image === void 0 ? {} : { image: xt(o.image) } } }), t.presentationOrder?.push(g), t;
}
const lr = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Lt = (e) => "caption-" + e, Be = (e) => "column-" + e, Oo = "rules-board", ne = { lane: Fe, card: be, image: fn, caption: Lt, column: Be, rules: Oo };
function Et(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function An(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), s = e, a = n;
  return t ? `M ${t} 0 H ${s - t} Q ${s} 0 ${s} ${t} V ${a - t} Q ${s} ${a} ${s - t} ${a} H ${t} Q 0 ${a} 0 ${a - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${s} V ${a} H 0 Z`;
}
function pt(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function mt(e, n, o, t) {
  for (let s = n; s > 11; s--) {
    const a = Math.max(1, Math.floor(o / (s * 0.55)));
    if (e.split(`
`).reduce((g, C) => g + Math.max(1, Math.ceil(C.length / a)), 0) * s * 1.3 <= t) return s;
  }
  return Math.min(n, 11);
}
const Rt = 152, Rn = Rt + 12, Po = 12;
function _t(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function We(e, n = {}) {
  const o = Y(e), { pitch: t, row: s, top: a } = hn, m = o.lanes.map((k) => o.cards.filter((S) => S.laneId === k.id).length), g = (k) => Math.max(m[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), C = !!o.lanes[0].station, P = o.lanes.some((k) => k.station?.image), v = _t(n.layout, o.lanes.length), h = [];
  if (C) {
    const { points: k } = Ot(o);
    o.lanes.forEach((S, x) => h.push({
      laneId: S.id,
      x: k[x].x,
      y: k[x].y + (P ? S.station.row * Rn : 0),
      width: t,
      height: a + (S.station.image ? Rn : 0) + Math.max(1, m[x]) * s,
      column: S.station.column,
      row: S.station.row
    }));
  } else {
    let k = Nt(o, v)?.below ?? 0;
    for (let S = 0; S < o.lanes.length; S += v) {
      const x = o.lanes.slice(S, S + v), D = a + (Math.max(...x.map((z, E) => g(S + E))) + 1) * s;
      x.forEach((z, E) => h.push({ laneId: z.id, x: E * t, y: k, width: t, height: D, column: E, row: S / v })), k += D + Po;
    }
  }
  return { places: h, width: Math.max(...h.map((k) => k.x + k.width)), height: Math.max(...h.map((k) => k.y + k.height)) };
}
function Nt(e, n, o = 2, t = 0) {
  const s = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? ce().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return s ? { note: s, below: s.options.height + 16 } : null;
}
function Lo(e, n) {
  const { pitch: o, width: t, row: s, height: a, top: m } = hn, g = n.origin ?? { x: 0, y: 0 }, C = !!e.lanes[0].station, { places: P } = We(e, n), v = n.style ?? {}, h = v.textColor ?? He.fontColor, k = v.borderColor ?? He.borderColor, S = v.borderWidth ?? He.borderWidth, x = v.cornerRadius ?? 0, D = v.fontSize ?? He.fontSize, z = v.laneFontSize ?? D + 2, E = v.captionFontSize ?? Math.max(11, D - 1), r = [], p = (T) => {
    const R = { options: {
      shapeHint: "rectangle",
      vectorPath: An(T.width, T.height, x),
      foregroundColor: h,
      borderColor: k,
      borderWidth: S,
      ...v.fontFamily ? { fontFamily: v.fontFamily } : {},
      ...T
    }, relationships: { associations: [] } };
    return r.push(R), R;
  };
  e.lanes.forEach((T, R) => {
    const _ = P[R], U = g.x + _.x, j = g.y + _.y, V = T.station?.image;
    p({
      id: Be(T.id),
      text: "",
      name: T.label,
      xPos: U + 2,
      yPos: j,
      width: o - 4,
      height: _.height,
      vectorPath: An(o - 4, _.height, x ? x + 2 : 0),
      backgroundColor: C ? "#fcf9ed" : pt(an[R], 0.6),
      borderColor: C ? "#a8b5aa" : pt(an[R], 0.1),
      borderWidth: 1,
      ...C ? { borderStyle: "dashed" } : {}
    }), p({
      id: Fe(T.id),
      text: T.label,
      name: T.label,
      xPos: U + 8,
      yPos: j + 6,
      width: t,
      height: 58,
      backgroundColor: an[R],
      fontSize: mt(T.label, z, t - 16, 50)
    }), p({
      id: Lt(T.id),
      text: ge(e, T.id),
      name: T.label,
      xPos: U + 8,
      yPos: j + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: E
    }), V && r.push({ options: {
      id: fn(T.id),
      name: V.alt,
      text: "",
      xPos: U + 8,
      yPos: j + m,
      width: t,
      height: Rt,
      shapeHint: "rectangle",
      image: V.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((K) => K.laneId === T.id).forEach((K, Oe) => {
      const ie = $t(e, K), ve = C ? t - 20 : t, Pe = C ? a - 6 : a, re = C ? {} : { ...v.card, ...K.look }, q = C ? x : v.card?.cornerRadius ?? x;
      p({
        id: be(K.id),
        text: ie,
        name: K.label,
        xPos: U + (C ? 18 : 8),
        yPos: j + m + (V ? Rn : 0) + Oe * s,
        width: ve,
        height: Pe,
        ...q !== x ? { vectorPath: An(ve, Pe, q) } : {},
        backgroundColor: C ? "#ffda75" : re.backgroundColor ?? v.backgroundColor ?? He.backgroundColor,
        ...re.textColor ? { foregroundColor: re.textColor } : {},
        ...re.fontFamily ? { fontFamily: re.fontFamily } : {},
        ...re.borderColor ? { borderColor: re.borderColor } : {},
        ...re.borderWidth !== void 0 ? { borderWidth: re.borderWidth } : {},
        fontSize: mt(ie, re.fontSize ?? D, ve - 16, Pe - 8)
      });
    });
  });
  const b = Nt(e, _t(n.layout, e.lanes.length), g.x + 2, g.y)?.note ?? Mt(e, {
    x: g.x,
    y: g.y + Math.max(...P.map((T) => T.y + T.height)) + 16,
    width: Math.min(Math.max(...P.map((T) => T.x + T.width)), o * 2) - 4
  }, v);
  b && r.push(b);
  const $ = new Map(r.map((T) => [T.options.id, T]));
  for (const T of e.lanes)
    T.station && ($.get(Be(T.id)).relationships.associations = T.station.next.map((R) => ({
      id: T.id + "-to-" + R,
      parentId: Be(T.id),
      childId: Be(R),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const T of e.cards)
      for (const R of T.dependsOn ?? []) {
        const _ = be(R), U = be(T.id);
        $.get(_).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${T.id}`,
          parentId: _,
          childId: U,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const T = new Set(n.beside), R = new Set(r.map((j) => j.options.id)), _ = /* @__PURE__ */ new Map();
    for (const j of [...R]) {
      if (!T.has(j)) continue;
      const V = Et(j, (K) => T.has(K) || R.has(K));
      R.add(V), _.set(j, V);
    }
    const U = (j) => _.get(j) ?? j;
    for (const j of r) {
      j.options.id = U(j.options.id);
      for (const V of j.relationships.associations)
        V.parentId = U(V.parentId), V.childId = U(V.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
function Mt(e, n, o = {}) {
  return e.behaviour ? ce().note(e, n, o) : null;
}
function Eo(e, n) {
  const o = Y(e);
  if (n?.native) return Lo(o, n);
  const { width: t, row: s, height: a, top: m } = hn, g = [];
  function C(S, x, D, z, E, r) {
    g.push({ options: {
      id: S,
      text: x,
      name: x,
      xPos: D,
      yPos: z,
      width: t,
      height: E,
      shapeHint: "rectangle",
      backgroundColor: r,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: P } = Ot(o), v = 152, h = v + 12, k = o.lanes.some((S) => S.station?.image);
  o.lanes.forEach((S, x) => {
    const D = P[x].x, z = P[x].y + (k ? (S.station?.row ?? 0) * h : 0), E = S.station?.image, r = o.kind === "release-plan" ? S.label + `
` + (S.capacity ? $e(o, S.id) + " / " + S.capacity + " points" : $e(o, S.id) + " points") : S.label;
    C(Fe(S.id), r, D, z, m - 12, an[x]), E && g.push({ options: {
      id: fn(S.id),
      name: E.alt,
      text: "",
      xPos: D,
      yPos: z + m,
      width: t,
      height: v,
      shapeHint: "rectangle",
      image: E.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((p) => p.laneId === S.id).forEach((p, b) => C(be(p.id), $t(o, p), D, z + m + (E ? h : 0) + b * s, a, "#fffdf6"));
  });
  for (const S of o.lanes) {
    if (!S.station) continue;
    const x = g.find((D) => D.options.id === Fe(S.id));
    x.relationships.associations = S.station.next.map((D) => ({ id: S.id + "-to-" + D, parentId: x.options.id, childId: Fe(D), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), x.options.text = S.label + `
` + S.station.outcome, x.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const S = new Map(g.map((x) => [x.options.id, x]));
    for (const x of o.cards)
      for (const D of x.dependsOn ?? []) {
        const z = be(D), E = be(x.id);
        S.get(z).relationships.associations.push({
          id: `dependency-${D.length}-${D}-${x.id}`,
          parentId: z,
          childId: E,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: g };
}
const dr = {
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
}, _n = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Dn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function cr() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: _n.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: _n.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function ur() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Dn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function ze(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Dn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => _n.some((s) => s.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Ro(e, n, o) {
  const t = ze(e), s = e.cards.find((m) => m.id === n);
  if (!t || !s || s.laneId === o) return null;
  let a = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const m = e.cards.find((g) => g.laneId === o);
    if (m) {
      if (!cn(e, m).some((g) => g.id === "interviews")) return null;
      a = En(e, m.id, "interviews");
    }
  }
  return cn(a, s).some((m) => m.id === o) ? En(a, n, o) : null;
}
function _o(e, n) {
  if (ze(e) !== "experiment-budget") return null;
  const o = Dn.find((a) => a.id === n), t = e.cards.filter((a) => a.laneId === n).length, s = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? s + " " + (s === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  He as DEFAULT_NOTE_STYLE,
  gt as WORKSHOP_BOARD_KINDS,
  nn as WorkshopReferenceError,
  ht as addWorkshopBranch,
  $o as addWorkshopCard,
  Ao as addWorkshopLane,
  Ne as applyWorkshopEdits,
  tr as attachWorkshop,
  cn as availableLanes,
  Mt as behaviourNote,
  bo as businessBoardKinds,
  Z as businessKind,
  lo as canHangPanel,
  Dn as channels,
  io as checkWorkshopReplacement,
  Vt as countWord,
  ur as createBudgetWorkshop,
  cr as createInterviewWorkshop,
  sr as createLaneWorkshop,
  ir as createWorkshopMap,
  ar as decodeWorkshopFragment,
  nr as describeFocusDarkroom,
  Yo as describeWorkshopEdits,
  rr as encodeWorkshopFragment,
  jo as handoffSummary,
  Qo as hangGalleryPanel,
  dr as industrialWorkshop,
  er as initialFocusDarkroom,
  _n as interviews,
  Xt as isRuleEdit,
  an as laneColors,
  Ae as listed,
  Qe as listeningRoom,
  Do as listeningRoomCaption,
  Ct as maxWorkshopCards,
  Vo as moonGallery,
  En as moveWorkshopCard,
  Jo as named,
  lr as nightTransfer,
  Xo as normalizeFocusDarkroom,
  Ho as normalizeListeningRoom,
  Zo as normalizeMoonGallery,
  Wo as normalizeOfflineHandoff,
  Mo as offlineHandoff,
  Ro as planStartupMove,
  Zt as pointing,
  bt as printFields,
  Ko as registerRulebook,
  Go as registerWorkshopRules,
  $e as releaseLoad,
  Bo as releasePlan,
  zo as resolveHandoff,
  Co as resolveWorkshopSignals,
  Fo as reviewHandoff,
  An as roundedBox,
  ce as rulebook,
  qo as rulebookLoaded,
  O as said,
  ze as startupExperienceKind,
  Mn as unquoted,
  Y as validateWorkshop,
  ln as workshopBoardKind,
  _o as workshopBudgetResult,
  Ge as workshopCandidate,
  ft as workshopCardAsNote,
  rn as workshopCardAsNoteRefusal,
  Io as workshopCardLookOf,
  To as workshopCardNoteText,
  $t as workshopCardText,
  ct as workshopDestinations,
  Pn as workshopEditKinds,
  $n as workshopFinder,
  ge as workshopLaneCaption,
  We as workshopLanePlaces,
  hn as workshopLayout,
  ne as workshopNodeIds,
  De as workshopNoteCandidate,
  Me as workshopNoteRefusal,
  Ot as workshopPositions,
  zn as workshopPresentationLanes,
  or as workshopPresentationScenes,
  to as workshopReferences,
  tn as workshopRefusal,
  ot as workshopRuleSchema,
  he as workshopRules,
  Uo as workshopRulesLoaded,
  Et as workshopStandInId,
  on as workshopTakesNotes,
  Eo as workshopToSlate
};
