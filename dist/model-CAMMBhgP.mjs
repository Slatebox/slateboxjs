import { D as En } from "./NoteDefaults-1xFW0br8.mjs";
const Us = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Ks(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: u, fallback: p } = e, h = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !h(i) || !h(u) || !h(p) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: u.trim(), fallback: p.trim() };
}
function qs(e) {
  return { ...e, stage: "review", choice: null };
}
function Js(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Ys(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const et = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Zs(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, u = (p) => typeof p == "string" && p.trim().length > 0 && p.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(p);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !u(o) || !u(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function Vs({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === et.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === et.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === et.leftLabel && t === et.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
function Xe(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function Ti(e) {
  const n = new Map(e.cards.map((u) => [u.id, u])), t = new Map(e.lanes.map((u, p) => [u.id, p])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function i(u) {
    if (!r.has(u.id)) {
      if (o.has(u.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(u.id);
      for (const p of u.dependsOn ?? []) {
        const h = n.get(p);
        if (!h) throw new Error("A release dependency refers to an unknown feature.");
        if (t.get(h.laneId) > t.get(u.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(h);
      }
      o.delete(u.id), r.add(u.id);
    }
  }
  for (const u of e.cards) i(u);
  for (const u of e.lanes) {
    if (u.station) throw new Error("Release windows cannot also be map stations.");
    if (Xe(e, u.id) > (u.capacity ?? 1 / 0)) throw new Error(`Release "${u.label}" exceeds its point budget.`);
  }
}
function Bn(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((I, b) => [I.id, b])), o = r.get(t);
  if (o === void 0) return null;
  const i = o < r.get(n.laneId), u = /* @__PURE__ */ new Set([n.id]), p = [n];
  for (; p.length; ) {
    const I = p.pop();
    for (const b of e.cards) {
      if (u.has(b.id)) continue;
      const L = r.get(b.laneId);
      (i ? L > o && I.dependsOn?.includes(b.id) : L < o && b.dependsOn?.includes(I.id)) && (u.add(b.id), p.push(b));
    }
  }
  if (e.cards.filter((I) => u.has(I.id)).some((I) => I.allowedLaneIds && !I.allowedLaneIds.includes(t))) return null;
  const C = { ...e, cards: e.cards.map((I) => u.has(I.id) ? { ...I, laneId: t } : I) }, y = e.lanes[o].capacity;
  return y !== void 0 && Xe(C, t) > y ? null : C;
}
const Xs = {
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
}, yt = /* @__PURE__ */ new Map(), Pi = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function Qs(e) {
  yt.set(e.kind, e);
}
function ea(e) {
  return typeof e == "string" && yt.has(e);
}
function Qe(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? yt.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function Ae(e) {
  const n = yt.get(e);
  if (!n) throw new Error(`The ${Pi[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let ut = null;
function na(e) {
  ut = e;
}
function Oi() {
  return ut !== null;
}
function be() {
  if (!ut) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return ut;
}
const O = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Ve = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Jo = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), uo = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), fo = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ta = (e) => uo(fo(e)), Ei = [
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
], Mi = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Ei.indexOf(e.toLowerCase()), Ni = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function kr(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = uo(o);
    i && t.add(i);
  };
  r(e), r(fo(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const Wt = "[^\\p{L}\\p{N}]", Yo = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Jo(n) + "(?:$|" + Wt + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Wt + ")" + Jo(n) + "(?:$|" + Wt + ")", "u").test(e)
], Zo = ["first", "second", "third", "fourth", "fifth"];
function _i(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + Zo.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(uo(fo(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? Zo.indexOf(o) : Mi(o) - 1;
  return e[i] ?? null;
}
function Ft(e, n, t, r, o) {
  const i = kr(n, t);
  if (i.some((p) => Ni.test(p))) {
    const p = r && e.find((h) => h.id === r);
    return p ? { item: p, rank: 0 } : { pointing: !0 };
  }
  for (const p of i) {
    if (!p.startsWith("@")) continue;
    const h = e.find((C) => C.id === p.slice(1));
    if (h) return { item: h, rank: 0 };
  }
  for (const [p, h] of Yo.entries())
    for (const C of i) {
      const y = e.filter((I) => h(I.label.toLowerCase(), C.toLowerCase()));
      if (y.length === 1) return { item: y[0], rank: p };
      if (y.length > 1) return { several: y };
    }
  const u = o ? _i(e, n, t) : null;
  return u ? { item: u, rank: Yo.length } : {};
}
class at extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function qt(e, n, t, r, o = !1) {
  return { find: (h) => {
    const C = Ft(e, h, n, r, o);
    if (C.item) return C.item;
    const y = kr(h, n), I = y[y.length - 1];
    if (C.pointing) throw new at("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const L = [...new Set(C.several.map((x) => x.label))];
      throw new at(L.length === 1 ? C.several.length + " " + t + "s are called " + O(L[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + O(I) + ": " + Ve(L.slice(0, 6).map(O)) + ". Use the whole name.", "ambiguous", C.several.map((x) => x.id));
    }
    const b = e.map((L) => L.label);
    throw new at("There is no " + t + " called " + O(I) + " here." + (b.length && b.length <= 6 ? " The " + t + "s are " + Ve(b.map(O)) + "." : b.length ? "" : " There are no " + t + "s yet."), "unknown", e.map((L) => L.id));
  }, attempt: (h) => Ft(e, h, n, r, o).item ?? null, rank: (h) => Ft(e, h, n, r, o).rank ?? 1 / 0 };
}
const br = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Ne = [...br], cn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], vr = br.slice(5);
function ft(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ce(e);
  return n || (e.kind === "release-plan" ? "release-plan" : en(e) ?? "lanes");
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
  noRules: "Only boards of columns and pipelines take rules for now."
}, Jt = {
  "launch-plan": F.launchLanes,
  pipeline: F.pipelineLanes,
  budget: F.budgetLanes,
  "hiring-plan": F.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, fe = (e, n) => Object.fromEntries(Ne.filter((t) => !e.includes(t)).map((t) => [t, n])), de = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), ne = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), oe = (e) => ({ type: "ref", of: "card", about: e }), jt = (e) => ({ map: e }), Ee = fe(["map"], F.notMap), Te = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), Yt = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: de(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: ne("The lane or step."), label: de(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: oe("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: de(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, map: F.mapAddLane, ...Jt }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: ne("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, ...Jt }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: ne("The lane or step it starts in."),
      label: de(80, "What the card says. Left out, the card takes the board’s name for a new item: “New card”, “New hire”, “New task”, “New deal” (on a map, a token is numbered; a free card is “New stop”).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Te("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Te("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Te("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...vr],
    refusals: { "release-plan": F.releaseCards, "customer-interviews": F.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: oe("The card or token.") },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: oe("The card or token."), lane: ne("Where it goes.") },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: oe("The token.") },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: ne("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Ne.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": F.launchLanes, budget: F.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: oe("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: cn,
    refusals: { ...jt(F.mapCardLanes), ...fe([...cn, "map"], F.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: oe("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], F.notPoints), map: F.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: oe("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], F.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: oe("The card."),
      lane: ne("The lane."),
      whenPresent: de(160, "What it says when the card is there."),
      whenAbsent: de(160, "What it says otherwise."),
      label: de(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: cn,
    refusals: { ...jt(F.mapOutcome), ...fe([...cn, "map"], F.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: oe("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: cn,
    refusals: { ...jt(F.mapOutcome), ...fe([...cn, "map"], F.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: ne("The lane or step."), before: ne("Present it just before this one.", !0), after: ne("Present it just after this one.", !0) },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: ne("The step it follows."), label: de(80, "The new step’s name."), outcome: de(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: ne("The step it goes in front of."),
      from: ne("Only the path from this step is taken over.", !0),
      label: de(80, "The new step’s name."),
      outcome: de(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: ne("Where the path starts."), to: ne("Where it leads.") },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: ne("Where the path starts."), to: ne("Where it leads.") },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: ne("The step."), outcome: de(160, "What it says.") },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: ne("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: ne("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: ne("The step."), alt: de(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: oe("The card the line starts at."), to: oe("The card it points to."), label: de(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: nt()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: oe("One card."), to: oe("The other card.") },
    boards: ["lanes"],
    refusals: nt()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: oe("The card."),
      note: de(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: de(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: nt()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: oe("The card."), note: de(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: nt()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: oe("The task."), duration: Te("Its days, 1 to 60.", 60, 1, !0), lag: Te("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], F.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], F.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], F.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: Te("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], F.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: oe("The deal or line item."), amount: Te("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: fe(["pipeline", "budget"], F.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Te("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: fe(["pipeline"], F.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: ne("The team giving."), to: ne("The team receiving."), amount: Te("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: fe(["budget"], F.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: Te("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: fe(["budget"], F.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], F.noRules)
  },
  {
    kind: "set_rule",
    summary: "Change a rule: on, severity, max (a limit) or to (a path).",
    intent: !1,
    fields: {
      rule: de(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], F.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: de(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: fe(["lanes", "pipeline"], F.noRules) }
];
function nt() {
  return { ...fe(["lanes"], F.businessLines), "release-plan": F.lines, "customer-interviews": F.lines, "experiment-budget": F.lines, map: F.lines };
}
const Ri = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", Vo = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, Wi = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function Fi(e, n) {
  const t = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, r = (o, i) => i ? { anyOf: [o, { type: "null" }] } : o;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: e.min ?? 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...t, description: e.about };
    case "refs":
      return { ...r({ type: "array", items: t, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...r({ type: "integer", minimum: e.min, maximum: Wi(e.max, n) }, e.nullable), description: e.about };
    case "image":
      return { ...r({
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
        kind: { enum: Vo.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...Vo.keys
      }, description: e.about };
  }
}
const xr = (e) => "optional" in e && e.optional === !0;
function oa(e) {
  const n = e ? ft(V(e)) : void 0;
  return Yt.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, u]) => !xr(u)).map(([u]) => u)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([u, p]) => [u, Fi(p, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const tt = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function ji(e, n) {
  const t = !!e.lanes[0]?.station, r = qt(e.lanes, t ? tt.step : tt.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = qt(e.cards, t ? tt.token : tt.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const i = e.cards.filter((p) => !p.free), u = (p) => i.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(p.trim()) ? i[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (p) => u(p) ?? o.find(p),
    attempt: (p) => u(p) ?? o.attempt(p),
    rank: (p) => u(p) ? 0 : o.rank(p)
  } };
}
class D {
  constructor(n, t, r = null, o, i, u) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = i, this.limits = u;
  }
}
function ht(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function J(e, n, t = null, r) {
  try {
    return V(e);
  } catch (o) {
    throw new D(ht(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function Di(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (xr(o)) continue;
      return n.kind + " needs " + r + ".";
    }
    const u = n.kind + " needs " + r + " as ";
    switch (o.type) {
      case "text":
        if (typeof i != "string") return u + "text.";
        break;
      case "ref":
        if (!t(i)) return u + "an id or a name.";
        break;
      case "refs":
        if (i === null && o.nullable) break;
        if (!Array.isArray(i) || i.length > o.max || !i.every(t)) return u + "a list of up to " + o.max + " ids or names" + (o.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (i === null && o.nullable) break;
        if (typeof i != "number" || !Number.isFinite(i)) return u + "a number" + (o.nullable ? " or null." : ".");
        break;
      case "image":
        if (i === null) break;
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((p) => p !== "src" && p !== "alt")) return u + "{src, alt} or null.";
        break;
      case "choice":
        if (!o.values.includes(i)) return u + o.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof i != "boolean") return u + "true or false.";
        break;
      case "rule":
        if (!i || typeof i != "object" || Array.isArray(i) || typeof i.kind != "string") return u + "an object with a kind.";
        break;
    }
  }
  return null;
}
function Bi(e, n, t, r, o) {
  const i = structuredClone(e), u = t === "map", p = t === "release-plan", h = ji(i, r), C = { lane: u ? "step" : "lane", card: u ? "token" : "card" };
  function y(l, v, S, A, E = null) {
    if (typeof S == "object") {
      const W = l.find((B) => B.id === S.id);
      if (!W) throw new D("That " + A + " is no longer on the workshop.", "gone", E);
      return W;
    }
    const R = l.find((W) => W.id === S);
    if (R) return R;
    try {
      return v.find(S);
    } catch (W) {
      if (!(W instanceof at)) throw W;
      const B = W.reason === "ambiguous" ? "ambiguous_reference" : W.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new D(W.message, B, E, void 0, W.candidates.length ? W.candidates : void 0);
    }
  }
  const I = (l, v = null) => y(i.lanes, h.lanes, l, "lane", v), b = (l, v = null) => y(i.cards, h.cards, l, "card", v), L = (l) => {
    try {
      return I(l);
    } catch {
      return null;
    }
  }, x = (l, v, S = {}, A = !0) => ({ board: l, said: v, changed: A, ...S }), $ = (l) => Be(i, l), _ = (l) => u ? "The presentation opens with " + O(l[0].label) + "." : "The presentation now runs " + l.map((v) => O(v.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return be().edit(i, n, o, {
      lane: (l) => I(l),
      card: (l) => b(l),
      done: (l, v, S) => x(l, v, S),
      refuse: (l, v = {}) => {
        throw new D(l, v.code ?? "refused", v.laneId ?? null, v.cardId);
      }
    });
  if (vr.includes(t)) {
    n.kind === "add_card" && Xo(n, t, I(n.lane).id);
    const l = {
      card: (S) => b(S),
      lane: (S) => I(S),
      refuse: (S, A = {}) => {
        throw new D(S, A.code ?? "refused", A.laneId ?? null, A.cardId, void 0, A.limits);
      },
      settle: (S, A = null, E) => J(S, t, A, E),
      done: (S, A, E) => x(S, A, E)
    }, v = Ae(t).edit(i, n, l);
    if (v) return v;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const l = J(i, t);
      return x(l, "Renamed the " + (u ? "map" : "workshop") + " to " + O(l.title) + ".");
    }
    case "rename_lane": {
      const l = I(n.lane), v = l.label;
      l.label = n.label;
      const S = J(i, t, l.id);
      return x(S, "Renamed " + O(v) + " to " + O(S.lanes.find((A) => A.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = b(n.card), v = l.label;
      l.label = n.label;
      const S = J(i, t, l.laneId, l.id);
      return x(S, "Renamed " + O(v) + " to " + O(S.cards.find((A) => A.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new D("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new D("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = Ns(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (S) {
        throw new D(ht(S.message, t), "refused");
      }
      const v = l.lanes[l.lanes.length - 1];
      return x(l, "Added the lane " + O(v.label) + ".", { laneId: v.id });
    }
    case "remove_lane": {
      const l = I(n.lane), v = i.cards.filter((S) => S.laneId === l.id);
      if (u) {
        if (v.length) throw new D(O(v[0].label) + " is at " + O(l.label) + ". Move it to another step first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new D("A map needs at least two steps.", "refused", l.id);
      } else {
        if (v.length) throw new D(O(l.label) + " holds " + v.length + (v.length === 1 ? " card" : " cards") + ". Move or remove " + (v.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new D("A workshop needs at least two columns.", "refused", l.id);
      }
      i.lanes = i.lanes.filter((S) => S !== l);
      for (const S of i.lanes) S.station && (S.station.next = S.station.next.filter((A) => A !== l.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((S) => S !== l.id));
      for (const S of i.cards) S.allowedLaneIds && (S.allowedLaneIds = S.allowedLaneIds.filter((A) => A !== l.id));
      return ot(i, (S) => S.laneId === l.id), i.behaviour && (i.behaviour = be().dropLane(i.behaviour, l.id)), x(J(i, t), "Removed the " + C.lane + " " + O(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = I(n.lane);
      if (u) {
        if (n.allowedLanes !== void 0) throw new D(F.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new D("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const M = zn(i, "card");
          i.cards.push({ id: M, label: vt(n.label?.trim() || Qe(i)), laneId: l.id, free: !0 });
          const z = J(i, t, l.id);
          return x(z, "Added " + O(z.cards.find((ie) => ie.id === M).label) + " to " + O(l.label) + ".", { laneId: l.id, cardId: M });
        }
        let E = n.label;
        if (E === void 0) {
          let M = i.cards.length + 1;
          for (; i.cards.some((z) => z.label === "Token " + M); ) M++;
          E = "Token " + M;
        }
        const R = new Set([...i.lanes, ...i.cards].map((M) => M.id));
        let W = 1;
        for (; R.has("token-" + W); ) W++;
        i.cards.push({ id: "token-" + W, label: E, laneId: l.id });
        const B = J(i, t, l.id);
        return x(B, "Added " + O(B.cards[B.cards.length - 1].label) + " at " + O(l.label) + ".", { laneId: l.id, cardId: "token-" + W });
      }
      if (Xo(n, t, l.id), i.cards.length >= 24) throw new D("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && $(l.id) >= l.capacity)
        throw new D(O(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", l.id);
      const v = n.allowedLanes && [...new Set(n.allowedLanes.map((E) => I(E).id))];
      let S;
      try {
        S = _s(i, l.id, { label: n.label?.trim() || Qe(i), ...v && { allowedLaneIds: v } });
      } catch (E) {
        throw new D(ht(E.message, t), "refused", l.id);
      }
      const A = S.cards[S.cards.length - 1];
      return x(S, "Added " + (A.label ? O(A.label) : "an empty card") + " to " + O(l.label) + ".", { laneId: l.id, cardId: A.id });
    }
    case "remove_card": {
      const l = b(n.card);
      if (u && !l.free && i.cards.filter((v) => !v.free).length === 1) throw new D("A map needs at least one token.", "refused", l.laneId, l.id);
      if (p && i.cards.length === 1) throw new D("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new D("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      i.cards = i.cards.filter((v) => v !== l);
      for (const v of i.cards)
        v.dependsOn?.includes(l.id) && (v.dependsOn = v.dependsOn.filter((S) => S !== l.id), v.dependsOn.length || delete v.dependsOn);
      return ot(i, (v) => v.cardId === l.id), x(J(Os(i, l.id), t, l.laneId), "Removed the " + C.card + " " + O(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? i.lanes.find((A) => A.id === n.lane.id) ?? null : L(n.lane), v = b(n.card, l?.id ?? null), S = I(n.lane, v.laneId);
      return U(v, S);
    }
    case "advance_card": {
      const l = b(n.card), v = i.lanes.find((A) => A.id === l.laneId), S = v.station.next.map((A) => i.lanes.find((E) => E.id === A)).filter((A) => !!A);
      if (!S.length) throw new D(O(l.label) + " is at " + O(v.label) + ", and no path leads on from there.", "refused", v.id, l.id);
      if (S.length > 1)
        throw new D("From " + O(v.label) + " the path goes to " + S.map((A) => O(A.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + S[0].label + "”.", "refused", v.id, l.id);
      return U(l, S[0]);
    }
    case "set_lane_capacity": {
      const l = I(n.lane), v = i.behaviour && be().setLimit(i, l.id, n.capacity, o);
      if (typeof v == "string") throw new D(v, "refused", l.id);
      if (v) return x(v, O(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const S = u ? "token" : p ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, x(J(i, t, l.id), u ? "Removed the limit at " + O(l.label) + "." : O(l.label) + " now holds any number of " + S + "s.", { laneId: l.id });
      const A = p ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > A)
        throw new D((u ? "A step" : "A lane") + " can hold from 1 to " + A + " " + S + "s.", "refused", l.id);
      const E = p ? i.cards.reduce((R, W) => R + (W.laneId === l.id ? W.points ?? 1 : 0), 0) : $(l.id);
      if (E > n.capacity)
        throw new D(O(l.label) + " already holds " + E + " " + S + (E === 1 ? "" : "s") + ". Move some " + (u ? "on" : "out") + " first, or choose a higher " + (p ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, x(J(i, t, l.id), O(l.label) + " now holds up to " + n.capacity + " " + S + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = b(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, x(J(i, t, l.laneId, l.id), O(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const v = [...new Set(n.lanes.map((A) => I(A)))], S = i.lanes.find((A) => A.id === l.laneId);
      if (!v.includes(S)) throw new D(O(l.label) + " is in " + O(S.label) + " now. Include " + O(S.label) + ", or move the card first.", "refused", S.id, l.id);
      return l.allowedLaneIds = v.map((A) => A.id), x(J(i, t, l.laneId, l.id), O(l.label) + " can now go only in " + Ve(v.map((A) => O(A.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = b(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new D("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, x(J(i, t, l.laneId, l.id), O(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = b(n.card), v = [...new Set(n.dependsOn.map((A) => b(A)))], S = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const A = v.filter((E) => l.dependsOn?.includes(E.id));
        if (!A.length) throw new D(O(l.label) + " does not depend on " + Ve(v.map((E) => O(E.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter((E) => !A.some((R) => R.id === E)), l.dependsOn.length || delete l.dependsOn, x(J(i, t, l.laneId, l.id), O(l.label) + " no longer depends on " + Ve(A.map((E) => O(E.label))) + ".", S);
      }
      if (!v.length) {
        if (n.mode === "add") throw new D("Name the features " + O(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, x(J(i, t, l.laneId, l.id), O(l.label) + " no longer depends on anything.", S);
      }
      if (v.includes(l)) throw new D("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...v.map((A) => A.id)])], x(J(i, t, l.laneId, l.id), O(l.label) + " now depends on " + Ve(v.map((A) => O(A.label))) + ".", S);
    }
    case "set_outcome": {
      const l = b(n.card), v = I(n.lane), S = i.signals ?? (i.signals = []), A = n.label, E = A === void 0 ? S.filter((M) => M.cardId === l.id && M.laneId === v.id) : S.filter((M) => M.cardId === l.id && M.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && E.length > 1) throw new D("Two outcomes on this card have that name.", "refused", v.id, l.id);
      if (!E.length && S.length >= 24) throw new D("A workshop can have up to 24 outcomes. Remove one first.", "refused", v.id, l.id);
      let R = 1;
      for (; S.some((M) => M.id === "signal-" + R); ) R++;
      const B = { label: A ?? E[0]?.label ?? (l.label + " in " + v.label).slice(0, 80).trim(), cardId: l.id, laneId: v.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return E.length ? Object.assign(E[0], B) : S.push({ id: "signal-" + R, ...B }), x(J(i, t, v.id, l.id), "When " + O(l.label) + " is in " + O(v.label) + " the workshop says " + O(n.whenPresent) + ". Otherwise it says " + O(n.whenAbsent) + ".", { laneId: v.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = b(n.card), v = (i.signals ?? []).filter((S) => S.cardId === l.id);
      if (n.outcome === void 0) {
        if (!v.length) throw new D(O(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        ot(i, (S) => S.cardId === l.id);
      } else {
        const S = y(v, qt(v, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        ot(i, (A) => A.id === S.id);
      }
      return x(J(i, t, l.laneId, l.id), "Removed the outcome from " + O(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((v) => I(v));
      if (l.length !== i.lanes.length || new Set(l).size !== i.lanes.length) throw new D("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = l.map((v) => v.id), x(J(i, t), _(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new D("Say before or after, not both.", "invalid_edit");
      const l = I(n.lane), v = n.before ?? n.after, S = v === void 0 ? void 0 : I(v);
      if (S && S.id === l.id) throw new D("Choose two different scenes.", "refused", l.id);
      const A = wo(i).filter((E) => E.id !== l.id);
      return A.splice(S ? A.findIndex((E) => E.id === S.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), i.presentationOrder = A.map((E) => E.id), x(J(i, t, l.id), _(A), { laneId: l.id });
    }
    case "add_station": {
      const l = I(n.from);
      let v;
      try {
        v = mr(i, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new D(A.message, "refused", l.id);
      }
      const S = v.lanes[v.lanes.length - 1];
      return x(v, "Added a path from " + O(l.label) + " to " + O(S.label) + ".", { laneId: S.id });
    }
    case "insert_station": {
      const l = I(n.before), v = n.from === void 0 ? void 0 : I(n.from), S = v ? [v] : i.lanes.filter((R) => R.station.next.includes(l.id));
      if (v && !v.station.next.includes(l.id))
        throw new D("There is no path from " + O(v.label) + " to " + O(l.label) + ". Try “Add " + n.label + " after " + v.label + "”.", "refused", v.id);
      if (!S.length) throw new D("Nothing leads to " + O(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let A;
      try {
        A = mr(i, S[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (R) {
        throw new D(R.message, "refused", l.id);
      }
      const E = A.lanes[A.lanes.length - 1];
      for (const R of A.lanes)
        S.some((W) => W.id === R.id) && (R.station.next = [...new Set(R.station.next.map((W) => W === l.id ? E.id : W))]);
      return E.station.next = [l.id], x(J(A, t, E.id), "Added " + O(E.label) + " before " + O(l.label) + ".", { laneId: E.id });
    }
    case "connect_stations": {
      const l = I(n.from), v = I(n.to);
      if (l.id === v.id) throw new D("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(v.id) ? x(i, O(l.label) + " already leads to " + O(v.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(v.id), x(J(i, t, l.id), "Connected " + O(l.label) + " to " + O(v.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = I(n.from), v = I(n.to);
      if (!l.station.next.includes(v.id)) throw new D("There is no path between " + O(l.label) + " and " + O(v.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((S) => S !== v.id), x(J(i, t, l.id), "Removed the path from " + O(l.label) + " to " + O(v.label) + ".", { laneId: l.id });
    }
    case "set_station_outcome": {
      const l = I(n.station);
      return l.station.outcome = n.outcome, x(J(i, t, l.id), "Changed what happens at " + O(l.label) + ".", { laneId: l.id });
    }
    case "set_station_position": {
      const l = I(n.station);
      return Object.assign(l.station, { column: n.column, row: n.row }), x(J(i, t, l.id), "Moved " + O(l.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: l.id });
    }
    case "set_station_image": {
      const l = I(n.station);
      return n.image === null ? (delete l.station.image, x(J(i, t, l.id), "Removed the image at " + O(l.label) + ".", { laneId: l.id })) : (l.station.image = { src: n.image.src, alt: n.image.alt }, x(J(i, t, l.id), "Updated the image at " + O(l.label) + ".", { laneId: l.id }));
    }
    case "set_station_image_alt": {
      const l = I(n.station);
      if (!l.station.image) throw new D("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, x(J(i, t, l.id), "Updated the image description at " + O(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = b(n.card);
      let v = l.id, S, A;
      if (n.kind === "connect_cards") {
        const M = b(n.to, l.laneId);
        if (M.id === l.id) throw new D("A line joins two different cards.", "refused", l.laneId, l.id);
        S = M.id, A = O(M.label);
      } else {
        const M = n.note.trim();
        if (i.cards.some((z) => z.id === M) || i.lanes.some((z) => z.id === M))
          throw new D("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        S = M, A = "the note " + M, n.direction === "from_note" && ([v, S] = [S, v]);
      }
      const E = Zr(i, v, S, n.label ? { label: n.label } : {}), R = jn(i, E);
      if (R) throw new D(R, "refused", l.laneId, l.id);
      const W = ct(i, E), B = v === l.id;
      return x(
        W,
        B ? "Drew a line from " + O(l.label) + " to " + A + "." : "Drew a line from " + A + " to " + O(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = b(n.card), v = n.kind === "disconnect_cards" ? b(n.to, l.laneId).id : n.note.trim(), S = n.kind === "disconnect_cards" ? O(i.cards.find((R) => R.id === v).label) : "the note " + v, A = (R) => R.parentId === l.id && R.childId === v || R.parentId === v && R.childId === l.id, E = i.lines ?? [];
      return E.some(A) ? (i.lines = E.filter((R) => !A(R)), x(J(i, t, l.laneId, l.id), "Took away the line between " + O(l.label) + " and " + S + ".", { laneId: l.laneId, cardId: l.id })) : x(e, O(l.label) + " and " + S + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new D("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function U(l, v) {
    const S = { laneId: v.id, cardId: l.id };
    if (l.laneId === v.id)
      return x(e, O(l.label) + " is already " + (u ? "at " : "in ") + O(v.label) + ".", S, !1);
    const A = Wn(e, l.id, v.id);
    if (!A) throw new D(Fn(e, l.id, v.id) ?? "That move is not available.", "refused", v.id, l.id);
    return x(J(A, t, v.id, l.id), "Moved " + O(l.label) + " to " + O(v.label) + ".", S);
  }
}
function Xo(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new D(r === "amount" ? F.notAmounts : F.notTasks, "not_on_this_board", t);
}
function ot(e, n) {
  e.signals && (e.signals = e.signals.filter((t) => !n(t)), e.signals.length || delete e.signals);
}
function Ye(e, n, t = {}) {
  const r = (y) => ({ refused: { index: 0, kind: null, laneId: null, ...y } });
  let o;
  try {
    o = V(e);
  } catch (y) {
    return r({ reason: "The workshop cannot be read: " + (y instanceof Error ? y.message : String(y)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return r({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = o, u = [], p = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [y, I] of n.entries()) {
    const b = I?.kind, L = Yt.find((v) => v.kind === b);
    if (!I || typeof I != "object" || !L)
      return r({
        index: y,
        kind: typeof b == "string" ? b : null,
        code: "invalid_edit",
        reason: "There is no edit called " + O(String(b)) + ". The edits are " + Ve(Yt.map((v) => v.kind)) + "."
      });
    const x = Di(I, L);
    if (x) return r({ index: y, kind: L.kind, code: "invalid_edit", reason: x });
    const $ = ft(o);
    if (!L.boards.includes($))
      return r({ index: y, kind: L.kind, code: "not_on_this_board", reason: L.refusals[$] ?? "This workshop does not take " + L.kind + "." });
    let _;
    try {
      _ = Bi(o, I, $, t.selection, p);
    } catch (v) {
      if (!(v instanceof D)) throw v;
      return r({
        index: y,
        kind: L.kind,
        reason: v.reason,
        code: v.code,
        laneId: v.laneId,
        ...v.cardId && { cardId: v.cardId },
        ...v.candidates && { candidates: v.candidates },
        ...v.limits && { limits: v.limits }
      });
    }
    const U = o.behaviour && !Ri(L.kind) ? be().check(o, _.board) : null;
    if (U && "refused" in U)
      return r({ index: y, kind: L.kind, reason: U.refused.sentence, code: "refused", laneId: U.refused.laneId, cardId: U.refused.cardId });
    const l = Gi(o, _.board);
    if (l) return r({ index: y, kind: L.kind, reason: l, code: "not_on_this_board", laneId: _.laneId ?? null });
    o = _.board, u.push({
      index: y,
      kind: L.kind,
      said: _.said,
      changed: _.changed ?? !0,
      ..._.laneId && { laneId: _.laneId },
      ..._.cardId && { cardId: _.cardId }
    });
  }
  const h = new Map(i.cards.map((y) => [y.id, y.laneId])), C = o.cards.flatMap((y) => {
    const I = h.get(y.id);
    return I === void 0 || I === y.laneId ? [] : [{ cardId: y.id, fromLaneId: I, toLaneId: y.laneId }];
  });
  return { workshop: o, report: { edits: u, movedCards: C } };
}
function Hi(e, n) {
  const t = ce(e);
  if (t === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const r = e.lanes.find((o) => {
      const i = n.lanes.find((u) => u.id === o.id);
      return o.role !== i.role || o.probability !== i.probability;
    });
    if (r) return `${r.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (t === "budget") {
    const r = e.budget, o = n.budget;
    if (!o || r.currency !== o.currency || r.step !== o.step) return "A budget keeps its currency and its step.";
    const i = Ae(t).fixed?.(e, n);
    if (i) return i;
    const u = e.lanes.find((p) => {
      const h = n.lanes.find((C) => C.id === p.id);
      return p.floor !== h.floor || p.cap !== h.cap || p.capacity !== h.capacity;
    });
    if (u) return `${u.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? F.launchLanes : t && Ae(t).fixed?.(e, n) || null;
}
const zi = {
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
function Gi(e, n) {
  const t = V(e), r = ft(t);
  let o;
  try {
    o = V(n);
  } catch (h) {
    return ht(h instanceof Error ? h.message : String(h), r);
  }
  const i = ft(o), u = (h, C) => h.lanes.length === C.lanes.length && h.lanes.every((y) => C.lanes.some((I) => I.id === y.id)), p = (h, C) => h.lanes.every((y, I) => C.lanes[I]?.id === y.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return u(t, o) ? F.keepsCards : F.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !p(t, o)) return F.keepsOrder;
  if (ce(t) && i === r && !(u(t, o) && p(t, o))) return Jt[r];
  if (ce(t) && i === r) {
    const h = Hi(t, o);
    if (h) return h;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!u(t, o)) return F.releaseLanes;
    if (!p(t, o)) return F.releaseOrder;
    if (o.cards.some((h) => !t.cards.some((C) => C.id === h.id))) return F.releaseCards;
  }
  return r !== i ? "This board is a " + zi[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? be().replacement(t, o) : null;
}
const ra = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ia(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const t = [];
  for (const i of n.panels) {
    if (!i || typeof i.id != "string" || !/^[a-z][\w-]{0,31}$/.test(i.id) || typeof i.label != "string" || !i.label.trim() || i.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(i.artwork) || !(i.after === null || typeof i.after == "string")) return null;
    t.push({ id: i.id, label: i.label.trim(), artwork: i.artwork, after: i.after });
  }
  const r = new Map(t.map((i) => [i.id, i])), o = [...new Set(n.hung)];
  if (r.size !== t.length || o.length !== n.hung.length || o.some((i) => !r.has(i))) return null;
  for (const i of t) {
    const u = /* @__PURE__ */ new Set([i.id]);
    let p = i.after;
    for (; p !== null; ) {
      if (u.has(p) || !r.has(p) || o.includes(i.id) && !o.includes(p)) return null;
      u.add(p), p = r.get(p).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: t, hung: o };
}
function Ui(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function sa(e, n) {
  return Ui(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Ir = ["firstPrint", "secondPrint", "thirdPrint"], Ar = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function aa(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Ar, route: n.route };
  for (const r of Ir) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function la(e = new URLSearchParams()) {
  const n = { ...Ar };
  for (const r of Ir) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function da(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Ki(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Yi(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), Ji(n), n;
}
function qi(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function Ji(e) {
  return e && qi(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Dt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Mn(e) {
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
    label: e.label ?? "",
    ...typeof e.labelPosition == "number" && { labelPosition: e.labelPosition }
  };
}
function Yi(e) {
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
function rt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const hn = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)",
  /** Words set on the canvas itself (a plan's header and dates), not on a lane's pale fill: they follow the slate's background. */
  canvasInk: "var(--slatebox-board-canvas-ink, #34433f)",
  /** A phone's plan rows lie on the canvas: their grid, week lines and tracks follow the slate's background too. */
  canvasFaint: "var(--slatebox-board-canvas-grid, #d9ddd5)",
  canvasWeek: "var(--slatebox-board-canvas-week, #b5bdb3)",
  canvasTrack: "var(--slatebox-board-canvas-track, #e4e7df)",
  /** The canvas's own colour, for a halo behind words. */
  halo: "var(--slatebox-board-halo, #ffffff)"
}, Zi = "var(--slatebox-board-font, system-ui, sans-serif)", Zt = "http://www.w3.org/2000/svg", Qo = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function Me(e, n, t) {
  const r = document.createElementNS(Zt, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", Qo(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", Qo(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function pn(e, n, t, r, o) {
  const i = typeof document < "u" ? document.activeElement : null, u = i && e.contains(i) ? i.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const p = [];
  for (const h of n)
    if (h.t === "line")
      e.appendChild(Me("line", {
        x1: h.x1,
        y1: h.y1,
        x2: h.x2,
        y2: h.y2,
        "stroke-width": h.width ?? 1,
        ...h.dash ? { "stroke-dasharray": h.dash } : {}
      }, { stroke: h.color }));
    else if (h.t === "rect")
      e.appendChild(Me("rect", {
        x: h.x,
        y: h.y,
        width: Math.max(0, h.w),
        height: Math.max(0, h.h),
        rx: h.rx ?? 0,
        ...h.opacity !== void 0 ? { opacity: h.opacity } : {},
        ...h.role ? { "data-board-layer": h.role } : {}
      }, { fill: h.color }));
    else if (h.t === "text") {
      const C = Me("text", {
        x: h.x,
        y: h.y,
        "font-size": h.size ?? 13,
        "text-anchor": h.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...h.bold ? { "font-weight": 600 } : {},
        ...h.role ? { "data-board-layer": h.role } : {},
        ...h.halo ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
      }, { fill: h.color, ...h.halo ? { stroke: h.halo } : {} });
      C.style.setProperty("font-family", Zi), h.lines && h.lines.length > 1 ? h.lines.forEach((y, I) => {
        const b = Me("tspan", { x: h.x, dy: I ? h.lineHeight ?? Math.round((h.size ?? 13) * 1.25) : 0 });
        b.textContent = I < h.lines.length - 1 ? y + " " : y, C.appendChild(b);
      }) : C.textContent = h.text, e.appendChild(C);
    } else {
      if (h.unlink && t) {
        const { cardId: C, waitsOn: y, label: I } = h.unlink, b = y + ">" + C, L = r?.armed === b, x = Me("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": b,
          "aria-label": L ? I + ". " + (h.unlink.armed ?? "Tap again to remove it") + "." : I,
          role: "button",
          tabindex: 0,
          ...L ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: L ? hn.refuse : "transparent" });
        let $ = !1;
        x.addEventListener("pointerdown", (_) => {
          _.stopPropagation(), $ = _.pointerType === "touch" || _.pointerType === "pen";
        }), x.addEventListener("click", (_) => {
          if (_.stopPropagation(), $ && r && r.armed !== b) {
            r.arm(b);
            return;
          }
          r?.arm(null), t(C, y);
        }), x.addEventListener("keydown", (_) => {
          _.key !== "Enter" && _.key !== " " || (_.preventDefault(), _.stopPropagation(), t(C, y));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", hn.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          L || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), e.appendChild(x), p.push(x);
      } else if (h.pick && o) {
        const { key: C, label: y } = h.pick, I = Me("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": C,
          "data-board-pick": "",
          "aria-label": y,
          role: "button",
          tabindex: 0
        }, { stroke: "transparent" });
        I.addEventListener("pointerdown", (b) => b.stopPropagation()), I.addEventListener("click", (b) => {
          b.stopPropagation(), o(C);
        }), I.addEventListener("keydown", (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), b.stopPropagation(), o(C));
        }), I.addEventListener("focus", () => {
          I.style.setProperty("stroke", hn.accept), I.setAttribute("opacity", "0.35");
        }), I.addEventListener("blur", () => {
          I.style.setProperty("stroke", "transparent"), I.removeAttribute("opacity");
        }), e.appendChild(I), p.push(I);
      }
      if (e.appendChild(Me(
        "path",
        {
          d: h.d,
          fill: "none",
          "stroke-width": h.width ?? 1.5,
          "pointer-events": "none",
          ...h.dash ? { "stroke-dasharray": h.dash } : {},
          ...h.role ? { "data-board-layer": h.role } : {},
          ...h.strokeOpacity !== void 0 ? { "stroke-opacity": h.strokeOpacity } : {},
          ...h.fill ? { "stroke-linecap": "round", "stroke-linejoin": "round" } : {}
        },
        { stroke: h.color === "none" ? "transparent" : h.color, ...h.fill && h.fill !== "none" ? { fill: h.fill } : {} }
      )), h.arrow) {
        const { x: C, y, angle: I } = h.arrow;
        e.appendChild(Me("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${y}) rotate(${I})`, "pointer-events": "none" }, { fill: h.color }));
      }
      if (h.unlink && r?.armed === h.unlink.waitsOn + ">" + h.unlink.cardId && h.arrow) {
        const C = Me("text", {
          x: h.arrow.x - 6,
          y: h.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: hn.refuse });
        C.textContent = h.unlink.armed ?? "Tap again to remove this link", e.appendChild(C);
      }
    }
  u && p.find((h) => h.getAttribute("data-board-link") === u)?.focus({ preventScroll: !0 });
}
function Vi(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(Zt, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(Zt, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let i = !1, u = null, p;
  const h = {
    armed: null,
    arm(y) {
      clearTimeout(p), h.armed = y, y && (p = setTimeout(() => h.arm(null), 5e3), u?.[2].announce?.(u[2].boardFocused && u[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), u && C.draw(...u);
    }
  }, C = {
    draw(y, I, b) {
      if (i || !t) return;
      u = [y, I, b];
      const { origin: L } = b, x = n(I ?? y, b, y), $ = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o])
        l.setAttribute("transform", `translate(${L.x} ${L.y})`), l.toggleAttribute("data-workshop-focused", !!b.boardFocused);
      pn(r, x.filter((l) => !$(l)), b.onUnlink, h, b.onPick), pn(o, x.filter($));
      const _ = b.above && b.above.parentNode === t ? b.above : null, U = _ ? _.nextSibling : t.firstChild;
      (r.parentNode !== t || r.previousSibling !== _) && t.insertBefore(r, U === r ? r.nextSibling : U), o.firstChild && t.lastChild !== o ? t.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
    },
    destroy() {
      i = !0, clearTimeout(p), r.remove(), o.remove();
    }
  };
  return C;
}
const he = {
  title: "var(--slatebox-board-title, #1f3d33)",
  chip: "var(--slatebox-board-chip, #f2efe4)",
  chipInk: "var(--slatebox-board-chip-ink, #3d4b46)",
  focus: "var(--slatebox-board-focus, #1f4a3a)",
  focusInk: "var(--slatebox-board-focus-ink, #ffffff)",
  focusTint: "var(--slatebox-board-focus-tint, rgba(31, 74, 58, 0.045))",
  preview: "var(--slatebox-board-preview, #8a6a1f)",
  previewFill: "var(--slatebox-board-preview-fill, #f6cf86)",
  previewInk: "var(--slatebox-board-preview-ink, #1f3d33)",
  halo: "var(--slatebox-board-halo, #ffffff)",
  badge: "var(--slatebox-board-badge, #ffffff)",
  badgeLine: "var(--slatebox-board-grid, #d9ddd5)",
  badgeInk: "var(--slatebox-board-ink, #34433f)"
}, it = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, Xi = (e) => e.replace(/\.$/, ""), Qi = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function ho(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return es(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, u = (p) => n.push(i ? { ...p, warn: i } : p);
    if (o.kind === "bin" && o.lane) u({ icon: "bin", text: it(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) u({ icon: "gate", text: it(e, o.into) + " needs " + (o.needs ?? []).map((p) => Qi[p] ?? p).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) u({ icon: "step", text: "One column at a time", seams: t.slice(1).map((p, h) => [t[h], p]) });
      else {
        const p = o.from, h = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(p)) === 1).map((C) => [p, C]);
        u({ icon: "oneway", text: it(e, p) + " → " + o.to.map((C) => it(e, C)).join(" or ") + " only", seams: h });
      }
  }
  return n;
}
function es(e) {
  if (!Oi()) return [];
  let n;
  try {
    n = be().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = Xi(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, u = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: u, text: ns(o), ...i && { warn: i } });
  }
  return t;
}
function ns(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const lt = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Sr(e, n, t, r, o = 12) {
  const i = o / 12, u = (h) => h.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, y, I) => `A${+y * i} ${+I * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, y, I) => `${+(n + +y * i).toFixed(1)},${+(t + +I * i).toFixed(1)}`), p = (h, C = 1.6) => ({ t: "path", d: u(h), color: r, width: C * i });
  switch (e) {
    case "bin":
      return [p("M2,3 L10,3 M4.5,3 L4.5,1.5 L7.5,1.5 L7.5,3 M3,3 L3.8,11 L8.2,11 L9,3")];
    case "gate":
      return [p("M2,11 L2,3 L10,3 L10,11 M6,3 L6,11 M2,7 L10,7")];
    case "step":
      return [p("M4,2 L8,6 L4,10", 1.8)];
    case "oneway":
      return [p("M1,6 L10,6 M7,3 L10,6 L7,9", 1.8)];
    case "clock":
      return [p("M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,3.5 L6,6 L8,7.5")];
    case "flag":
      return [p("M3,11 L3,1.5 L10,3.5 L3,6")];
    case "push":
      return [p("M1,6 L7,6 M4.5,3.5 L7,6 L4.5,8.5 M9.5,2 L9.5,10", 1.7)];
    case "lock":
      return [p("M3,6 L9,6 L9,11 L3,11 Z M4.5,6 L4.5,4 Q6,1.5 7.5,4 L7.5,6")];
    default:
      return [p("M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,4 L6,6.5 M6,8.5 L6,8.6", 1.7)];
  }
}
const po = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function pt(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + lt(e.text, 13 * n, t) + 10 * n);
}
function st(e, n, t, r, o = {}) {
  const i = 24 * r, u = 10 * r, p = t.icon ? 17 * r : 0, h = pt(t, r, o.bold), C = o.ink ?? he.chipInk, y = [{
    t: "path",
    d: po(e, n, h, i, i / 2),
    color: t.warn ? he.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? he.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && y.push(...Sr(t.icon, e + u, n + 6 * r, C, 12 * r)), y.push({ t: "text", x: e + u + p, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), y;
}
function er(e, n, t, r) {
  return [
    { t: "path", d: po(n - 11, t - 11, 22, 22, 11), color: he.badgeLine, width: 1, fill: he.badge, role: r },
    ...Sr(e, n - 6, t - 6, he.badgeInk)
  ];
}
const ts = "Preview · not added yet", Cr = 6, os = 2.5, Lr = (e) => Math.round(Math.min(Cr, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, Vt = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function $r(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(Cr, Math.max(1, t.scale ?? 1)), u = i > os ? [] : ho(e), p = 18 * i, h = 30 * i, C = (R, W) => {
    const B = (t.narrow && W <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (lt(R, 18 * W, !0) <= B) return R;
    const M = Math.max(3, Math.floor(B / (18 * W * 0.58)) - 1);
    return R.slice(0, M).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, y = C(e.title, i), I = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), b = [], L = [2 + lt(C(e.title, 1), 18, !0) + 14];
  t.narrow && u.length && (L[0] = 1 / 0, L.push(2));
  for (const R of u) {
    const W = pt(R, 1);
    let B = L.findIndex((M) => M + W <= I);
    B < 0 && (L.push(2), B = L.length - 1), b.push({ x: L[B], row: B, item: R, width: W }), L[B] += W + 6;
  }
  const x = b.map((R) => ({ x: r + Math.round(R.x * i), row: R.row, item: R.item, width: pt(R.item, i) })), $ = Math.max(1, ...x.map((R) => R.row + 1)), _ = o - 14 * i - $ * h, U = !!(t.focused || t.draft), l = t.narrow ? 8 : 16, v = U ? { x: r - l, y: _ - 18 * i, width: n.width + 2 * l, height: o + n.height + l - (_ - 18 * i) } : null, S = Math.max(i, t.tagScale ?? i), A = v ? v.y - 12 * S : _, E = r + 2 + lt(y, p, !0);
  return { k: i, tagK: S, legend: u, placed: x, rows: $, title: y, titleY: _, titleSize: p, titleRight: E, rowH: h, frame: v, top: A };
}
function Tr(e, n, t = {}) {
  const r = $r(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((y) => y.x + y.width)), u = o ? o.x : 0, p = r.top, h = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: u, y: p, width: h - u, height: C - p };
}
function nr(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: u, titleY: p, titleSize: h, rowH: C, frame: y } = $r(e, n, t), I = n.x ?? 0, b = [];
  if (y) {
    const L = po(y.x, y.y, y.width, y.height, 18);
    t.focused && b.push({ t: "path", d: L, color: he.focus, width: 12, strokeOpacity: 0.1, fill: he.focusTint, role: "focus-glow" }), b.push({
      t: "path",
      d: L,
      color: t.focused ? he.focus : he.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  b.push({ t: "text", x: I + 2, y: p + 19 * r, text: u, color: he.title, size: h, bold: !0, role: "board-title" });
  for (const L of i) b.push(...st(L.x, p + L.row * C + 2 * r, L.item, r));
  if (y) {
    const L = y.y - 12 * o;
    if (t.focused) {
      const x = { text: "Editing" };
      b.push(...st(y.x + 18, L, x, o, { fill: he.focus, ink: he.focusInk, bold: !0, role: "focus-tag" })), b.push(...st(
        y.x + 18 + pt(x, o, !0) + 6 * o,
        L,
        { text: "Done" },
        o,
        { fill: he.halo, ink: he.focus, line: he.focus, bold: !0, role: "focus-done" }
      ));
    } else
      b.push(...st(y.x + 18, L, { text: ts }, o, { fill: he.previewFill, ink: he.previewInk, bold: !0, role: "draft-tag" }));
  }
  return b;
}
function tr(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((u) => u.laneId === i);
  for (const i of ho(e)) {
    const u = i.lane ? o(i.lane) : void 0;
    u && r.push(...er(i.icon, u.x + u.width - 22, u.y + 18, "badge-" + i.lane));
    for (const [p, h] of i.seams ?? []) {
      const C = o(p), y = o(h);
      !C || !y || C.row !== y.row || r.push(...er(i.icon, (C.x + C.width + y.x) / 2, C.y + 35, "seam-" + p + ">" + h));
    }
  }
  return r;
}
function rs(e) {
  const n = ho(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const ca = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, or = "http://www.w3.org/2000/svg";
function rr(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function is(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(or, "g") : null, r = typeof document < "u" ? document.createElementNS(or, "g") : null;
  for (const y of [t, r])
    y?.setAttribute("data-board-chrome", ""), y?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const u = (y) => ({ layout: y.layout, focused: y.focused, draft: y.draft, scale: y.scale, tagScale: y.tagScale, narrow: y.narrow, places: y.places, room: y.room }), p = (y, I) => {
    const b = Tr(y.board, y.size, I);
    return { x: y.origin.x + b.x, y: y.origin.y + b.y, width: b.width, height: b.height };
  }, h = (y) => ({ ...u(y), focused: !1, draft: !1, scale: 1, tagScale: 1 }), C = {
    get scope() {
      return i?.scope ?? "main";
    },
    get draft() {
      return !!i?.draft;
    },
    box(y) {
      if (!i) return null;
      const I = Lr(y);
      return p(i, { ...u(i), scale: I, tagScale: Vt(y, !!(i.narrow && !i.draft), I) });
    },
    plainBox() {
      return i ? p(i, h(i)) : null;
    },
    paintPlain(y, I) {
      if (!i) return;
      const b = h(i);
      y.removeAttribute("data-workshop-focused"), pn(y, nr(i.board, { width: i.size.width, height: i.size.height }, b)), I && (I.removeAttribute("data-workshop-focused"), pn(I, tr(i.board, b)));
    }
  };
  return rr(e).add(C), {
    draw(y) {
      if (o || !n || !t || !r) return;
      i = y;
      const I = u(y);
      for (const x of [t, r])
        x.setAttribute("transform", `translate(${y.origin.x} ${y.origin.y})`), x.toggleAttribute("data-workshop-focused", !!y.focused), x.toggleAttribute("data-workshop-draft", !!y.draft), x.setAttribute("data-board-scope", y.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", rs(y.board)), pn(t, nr(y.board, { width: y.size.width, height: y.size.height }, I)), pn(r, tr(y.board, I));
      const b = t.querySelector('[data-board-layer="focus-done-box"]');
      if (b && y.onDone) {
        const x = y.onDone;
        b.setAttribute("role", "button"), b.setAttribute("tabindex", "0"), b.setAttribute("aria-label", "Done changing " + y.board.title), b.setAttribute("pointer-events", "all"), b.setAttribute("cursor", "pointer"), b.addEventListener("pointerdown", ($) => $.stopPropagation()), b.addEventListener("click", ($) => {
          $.stopPropagation(), x();
        }), b.addEventListener("keydown", ($) => {
          const _ = $.key;
          _ !== "Enter" && _ !== " " || ($.preventDefault(), $.stopPropagation(), x());
        });
      }
      const L = y.under && y.under.parentNode === n ? y.under : null;
      L ? t.nextSibling !== L && n.insertBefore(t, L) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, rr(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const Xt = "handle-_link-", Qt = "handle-_route-", Dn = 40, Pr = 44;
function Bt(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(Dn, Math.ceil(Pr / n)));
}
function Or(e) {
  if (e.startsWith(Xt)) return { kind: "link", from: e.slice(Xt.length) };
  if (e.startsWith(Qt)) {
    const [n, t] = e.slice(Qt.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const Er = (e) => !!e.lanes[0]?.station, je = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function mo(e) {
  const { places: n } = _e(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function ir(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, u = n.y - o, p = i ? e.width / 2 / Math.abs(i) : 1 / 0, h = u ? e.height / 2 / Math.abs(u) : 1 / 0, C = Math.min(p, h), y = Math.hypot(i, u) || 1;
  return { x: r + i * C + i / y * t, y: o + u * C + u / y * t };
}
function Mr(e) {
  if (!Er(e)) return [];
  const n = mo(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const u = n.get(i);
        if (!u) continue;
        const p = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, h = { x: u.x + u.width / 2, y: u.y + u.height / 2 }, C = ir(o, h, -8), y = ir(u, p, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: y.x, y2: y.y });
      }
  }
  return t;
}
function ss(e, n) {
  for (const [t, r] of mo(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function Nr(e, n, t = Dn) {
  if (!Er(e)) return [];
  const r = mo(e), o = t / Dn, i = (p, h, C, y, I) => ({ options: {
    id: p,
    name: y,
    text: I ? "+" : "",
    xPos: n.x + h - t / 2,
    yPos: n.y + C - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: wn(t, t, t / 2),
    backgroundColor: I ? "#2f5fd0" : "#fffef8",
    foregroundColor: I ? "#ffffff" : "#2f5fd0",
    borderColor: I ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), u = [];
  for (const p of e.lanes) {
    const h = r.get(p.id);
    h && u.push(i(Xt + p.id, h.x + h.width, h.y + h.height, "Draw a path from " + p.label, !0));
  }
  for (const p of Mr(e))
    u.push(i(Qt + p.from + "~" + p.to, p.x2, p.y2, "End of the path from " + je(e, p.from) + " to " + je(e, p.to), !1));
  return u;
}
function as(e, n) {
  const t = Or(n);
  return t ? t.kind === "link" ? `Draw a path from ${je(e, t.from)}: drag it onto another step.` : `End of the path from ${je(e, t.from)} to ${je(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function ls(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((u) => u.id === n.from);
  if (!r?.station || !e.lanes.some((u) => u.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${je(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((u) => u !== n.to) : r.station.next, i = e.lanes.map((u) => u.id === r.id ? { ...u, station: { ...u.station, next: [...o, t] } } : u);
  return { next: { ...e, lanes: i } };
}
function ds(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((p) => p.id === o.id)?.station?.next ?? [], u = o.station?.next ?? [];
    for (const p of i) u.includes(p) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: p } });
    for (const p of u) i.includes(p) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: p } });
  }
  return [...t, ...r];
}
function cs(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? Dn, i = Math.max(24, o * Pr / Dn);
  for (const u of Mr(e)) {
    const p = je(e, u.from) + " to " + je(e, u.to), h = `M ${u.x1} ${u.y1} L ${u.x2} ${u.y2}`, C = !r && n.picked === u.key;
    t.push(r ? { t: "path", d: h, color: "transparent", width: 3, hit: i, unlink: { cardId: u.to, waitsOn: u.from, label: "Remove the path from " + p, armed: "Tap again to remove this path" } } : { t: "path", d: h, color: C ? hn.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: u.key, label: "Path from " + p + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const u = Nr(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, p = u ? u.xPos + o + 6 : 0, h = u ? u.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: p, y: h, text: n.clamp.text, color: hn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
const sr = "#1f7a5c", ar = "#5b9a85", Ht = "#c2410c", us = "#a8761b", fs = {
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
}, hs = { canMove: !1, canSelect: !1 }, zt = "A card's line joins notes and cards on its own board.", Nn = /* @__PURE__ */ new WeakMap();
function ps(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ua(e, n, t = {}) {
  const r = Gn(t.scope);
  let o = V(n);
  const i = t.kit, u = (s) => !!ce(s) && !i;
  if (u(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const p = i?.layer(e) ?? (o.lanes[0]?.station ? Vi(e, cs) : void 0), h = t.chrome === !1 ? null : is(e);
  let C = 1, y = 1, I = null, b = null, L = /* @__PURE__ */ new Set(), x = null, $ = null;
  const _ = !!t.draft, U = !!t.still;
  let l = !!t.readOnly || _ || U, v = l || u(o), S = !1;
  const A = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
  let M = null, z = null, ie = null, ee = null;
  const ye = /* @__PURE__ */ new Map(), vn = /* @__PURE__ */ new Map(), nn = /* @__PURE__ */ new Map();
  let te = null, pe = null;
  function He(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, S || j($ ?? o);
    }, 3e3) };
  }
  let re = Promise.resolve(), ze = null, ue = lr(t.layout), Se = ue;
  const It = { ...t.style };
  let Ce = /* @__PURE__ */ new Map(), At = /* @__PURE__ */ new Set(), vo = null, Le = !1, xn = Bt(1), Un = null, In = null, Ge = null, Kn = !1;
  const we = /* @__PURE__ */ new Map();
  Re(o);
  const q = t.origin ? { x: t.origin.x, y: t.origin.y } : ws(e), qn = r ? r + ":" : "", ve = (s) => B.get(s) ?? (qn ? s.startsWith(qn) ? s.slice(qn.length) : null : s), me = (s) => {
    const a = ve(s);
    return a === null ? null : ps(a);
  };
  function se(s) {
    const a = W.get(s);
    if (a) return a;
    const d = qn + s;
    if (A.has(d) && !B.has(d) || !e.nodes.one?.(d)) return d;
    const f = ni(d, (m) => !!e.nodes.one?.(m) || B.has(m));
    return W.set(s, f), B.set(f, s), console.warn(`WORKSHOP: the slate already has a note named "${d}". It stays the slate's own; the workshop draws its note as "${f}".`), f;
  }
  function An(s, a = 1) {
    let d = [];
    try {
      d = t.avoid?.() ?? [];
    } catch (f) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", f);
    }
    return d.length ? Bs(s, d, a) : { x: s.x, y: s.y };
  }
  function oi(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (c) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", c);
    }
    const { width: d, height: f } = i ? i.places(o, ue) : Re(o);
    let m = 1 / 0;
    for (const c of a)
      [c.x, c.y, c.width, c.height].every(Number.isFinite) && c.x >= q.x + d && c.y < q.y + f && c.y + c.height > q.y && (m = Math.min(m, c.x - 32 - q.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function ri(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (d) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", d);
    }
    return a.some((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite) && s.x < d.x + d.width && s.x + s.width > d.x && s.y < d.y + d.height && s.y + s.height > d.y);
  }
  function ii(s, a) {
    const d = [...Nn.get(e) ?? []].filter((g) => g !== Ct);
    if (!d.length) return null;
    const { id: f, note: m } = _o(s, a), c = { id: f, options: m }, w = Kt(o, s).some((g) => o.cards.some((k) => k.id !== s && (k.id === g.parentId || k.id === g.childId)));
    for (const g of d) {
      let k = null;
      try {
        k = g.verdict(c, a);
      } catch (P) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", P);
      }
      if (k) return { board: g, ...k, reason: w ? zt : k.reason };
    }
    return null;
  }
  function si(s, a, d, f) {
    const { added: m, answer: c } = Zn(a, d, "", !0), w = An(d), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let k;
      try {
        k = s.take(m, f, w);
      } catch (N) {
        console.warn("WORKSHOP: another board could not take the card", N);
      }
      if (k === "taken") return;
      const P = Math.round(w.x), T = Math.round(w.y);
      m.position?.(P, T, () => e.updateSelectionResizeRotate?.(), void 0, rt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Dt({ ...m.options, x: P, y: T })] });
    };
    !c || typeof c.then != "function" ? g() : c.then((k) => {
      k === !0 && !S && g();
    }, () => {
    });
  }
  const $e = {
    governs(s) {
      if (A.get(s.id) !== s) return null;
      const a = me(s.id)?.kind;
      return a === "card" ? { canMove: !v, canEditText: !v && !$ && o.kind !== "release-plan", canConnect: Tn() } : a === "lane" ? { canMove: !1, canEditText: !v && !$ } : a === "handle" ? { canMove: !v && !$, canEditText: !1, ...!ue.narrow && { cursor: i ? "ew-resize" : "grab" } } : hs;
    },
    onStart(s, a) {
      const d = me(s.id), f = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const w = v || $ ? null : i ? i.handleDrag(o, ve(s.id), f, ue) : Li(ve(s.id));
        return w ? (ae(), Ke(), pe && (clearTimeout(pe.timer), pe = null), x = { name: ve(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = d.key;
      if (v || $ || !o.cards.some((w) => w.id === m)) return !1;
      ae(), Ke();
      let c = null;
      try {
        c = (i?.chooser ?? t.chooseCandidate)?.(o, m, f, ue) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return M = { cardId: m, evaluate: c, grab: f, outcome: { kind: "home" } }, j(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (x) {
        x.last = x.follow(ln(a)), j(x.last.next, { grip: x.name, layout: oi(x.last.layout) }), G(t.onPreview, x.last.next === o ? null : x.last.next);
        return;
      }
      if (!M) return;
      const d = Co(M.cardId, a, M.evaluate);
      if (ms(d, M.outcome)) return;
      M.outcome = d;
      const f = d.kind === "candidate" ? d.next : null;
      j(f ?? o, { skip: M.cardId }), G(t.onPreview, f);
    },
    onEnd(s, a) {
      if (x) {
        const { follow: w, name: g } = x, k = w(ln(a));
        x = null, G(t.onPreview, null), k.refusal ? (He(g, k.refusal), j(o), e.announce?.(k.refusal), G(t.onRefuse, { laneId: null, reason: k.refusal })) : Xn(k.next, {}) || j(o);
        const P = Rt(o, ve(s.id));
        return P ? { accept: !0, settle: P } : { accept: !1 };
      }
      if (!M) return { accept: !1 };
      const { cardId: d, evaluate: f } = M, m = Co(d, a, f), c = o.cards.find((w) => w.id === d);
      if (M = null, G(t.onPreview, null), m.kind === "candidate" && i) {
        if (!Xn(m.next, { cardId: d, laneId: m.laneId }, d))
          return j(o, { skip: d }), { accept: !1 };
        m.said && (He("card-" + d, m.said), e.announce?.(m.said));
        const w = Rt(o, ve(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, j(o, { skip: d });
        const w = o.lanes.find((k) => k.id === m.laneId);
        e.announce?.(`${Z(c)} moved to ${w.label}. ${We(o, w.id)}.`), G(t.onChange, o, { cardId: d, laneId: m.laneId });
        const g = Rt(o, ve(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused")
        xi(Z(c), { cardId: d, laneId: m.laneId, reason: m.reason }), m.near && He("card-" + d, m.reason);
      else if (m.kind === "outside" && Ut() && !on()) {
        const w = dt(o, d);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, k = ii(d, a);
          if (k?.reason)
            return j(o, { skip: d }), k.board.flash(k.laneId, k.reason), e.announce?.(`${Z(c)} can't go in ${k.laneLabel}. ${k.reason} It stays where it was.`), G(t.onRefuse, { cardId: d, laneId: null, reason: k.reason }), { accept: !1 };
          if (k)
            return si(k.board, d, g, a), { accept: !0 };
          const P = ri(g);
          return Zn(d, P ? An(g) : g, P ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        j(o, { skip: d }), e.announce?.(w), G(t.onRefuse, { cardId: d, laneId: null, reason: w });
      } else
        j(o, { skip: d }), m.kind === "outside" && (e.announce?.(`${Z(c)} was not dropped on a lane. It stays where it was.`), G(t.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (x) {
        x = null, G(t.onPreview, null), j(o);
        return;
      }
      const a = M && o.cards.find((d) => d.id === M.cardId);
      M = null, G(t.onPreview, null), j(o, { skip: me(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Z(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const f = me(s.id);
      if (!f || v || $) return !1;
      let m = a.replace(/\s+/g, " ").trim();
      const c = [], w = ce(o), g = w && f.kind === "card" ? Ae(w).renamed(o, f.key, m) : null;
      g && (m = g.label, c.push(...g.edits));
      const k = f.kind === "lane" ? { laneId: f.key, label: m } : { cardId: f.key, label: m };
      c.unshift(f.kind === "lane" ? { kind: "rename_lane", lane: { id: f.key }, label: m } : { kind: "rename_card", card: { id: f.key }, label: m });
      const P = Ye(o, c);
      if ("refused" in P) {
        const { reason: T } = P.refused;
        return e.announce?.(`${d} keeps its name. ${T}`), G(t.onRefuse, { ...f.kind === "lane" ? { laneId: f.key } : { cardId: f.key }, rename: k, reason: T }), !1;
      }
      return JSON.stringify(P.workshop) === JSON.stringify(o) ? (j(o), !1) : (e.beginHostStep?.(), o = P.workshop, f.kind === "card" && vn.set(f.key, m), e.endHostStep?.(), j(o), e.announce?.(g ? P.report.edits.map((T) => T.said).join(" ") : `${d} renamed to ${m}.`), G(t.onChange, o, { rename: k, ...i ? { edits: c } : {} }), g ? !1 : m);
    },
    onKeyDown(s, a) {
      const d = me(s.id);
      if (v || $ || M || x || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (ie && (ie.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== ie.key) && $o(), ie && a.key === "Escape")
        return a.preventDefault(), $o(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (ie && a.key === "Enter") {
        a.preventDefault();
        const w = ie.choices[ie.at];
        return ie = null, G(t.onPreview, null), o = w.next, j(o), e.announce?.(w.done), G(t.onChange, o, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: w.edits }), !0;
      }
      const f = i?.keyChoices?.(o, ve(s.id), a.key);
      if (f) {
        a.preventDefault();
        const w = [], g = [];
        for (const T of typeof f == "string" ? [] : f) {
          const N = Ye(o, T.edits);
          "refused" in N ? g.push(`${T.said}: ${N.refused.reason}`) : w.push({ ...T, next: N.workshop, done: N.report.edits.map((H) => H.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof f == "string" ? f : g.join(" ")), !0;
        const k = ie && ie.node === s.id ? (ie.at + 1) % w.length : 0;
        ie = { node: s.id, key: a.key.toLowerCase(), choices: w, at: k }, j(w[k].next), G(t.onPreview, w[k].next);
        const P = w.length > 1 ? ` (${k + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[k].said}${P} Enter to make it, Escape to cancel.`), !0;
      }
      const m = i?.keyEdit?.(o, ve(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = Ye(o, m);
        return "refused" in w ? (e.announce?.(w.refused.reason), G(t.onRefuse, { laneId: w.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: w.refused.reason })) : Xn(w.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const c = o.cards.find((w) => w.id === d.key);
      if (!c) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Lo(c.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && di())
        return a.preventDefault(), Lo(c.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (z?.cardId !== c.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: k } = z;
        if (z = null, w === null)
          return G(t.onPreview, null), Zn(c.id, k), !0;
        const P = o;
        o = g, j(o), Ue(w), G(t.onPreview, null);
        const T = o.lanes.find((N) => N.id === w);
        return e.announce?.(`${Z(c)} moved to ${T.label}. ${We(o, w)}.`), G(t.onChange, o, { cardId: c.id, laneId: w, ...i ? { edits: i.editsBetween(P, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Ke(), e.announce?.(`Move cancelled. ${Z(c)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => A.get(a.id) === a).map((a) => a.id);
      Kn = s.length === 1, A.clear(), E.clear(), R.clear(), we.clear(), W.clear(), B.clear(), M = null, z = null, j($ ?? o, { animate: !1 }), s.length === 1 && (re = re.then(() => {
        Kn = !1;
        const a = A.get(s[0]);
        if (!S && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        tn();
      }));
    }
  };
  $e.onFreeMove = (s, a) => {
    if (!Sn() || s.options?.isComment) return Lt();
    const d = Cn(a), f = Ln(s), m = $n(s), c = o.lanes.filter((k) => !m && Ze(o, k.id, f) === null).map((k) => k.id), w = d && i?.noteUnder?.(o, ln(a), ue);
    w && (f.under = w);
    const g = d ? m ?? Ze(o, d, f) : null;
    ee && ee.noteId === s.id && ee.laneId === d && ee.refusal === g || (ee = { noteId: s.id, laneId: d, refusal: g, open: c }, Oe());
  }, $e.onFreeDrop = (s, a, d) => {
    if (Lt(), !Sn() || s.options?.isComment) return;
    const f = Cn(a);
    if (!f) return;
    const m = Ln(s), c = i?.noteUnder?.(o, ln(a), ue);
    c && (m.under = c);
    const w = o.lanes.find((k) => k.id === f), g = $n(s) ?? Ze(o, f, m);
    return g ? (ae(!1), te = { laneId: f, reason: g, timer: setTimeout(() => ae(), 1500) }, Oe(), e.announce?.(`${$t(m.label)} can't go in ${w.label}. ${g}`), G(t.onRefuse, { noteId: s.id, laneId: f, reason: g }), "refused") : (Ot([{ node: s, offer: m, from: d }], f), "taken");
  }, $e.onFreeGroupDrop = (s, a, d) => {
    if (Lt(), !Sn() || s.some((g) => g.options?.isComment)) return;
    const f = Cn(a);
    if (!f) return;
    const m = o.lanes.find((g) => g.id === f), c = s.map((g) => ({ node: g, offer: Ln(g) })), w = fi(c, f);
    if (w) {
      ae(!1), te = { laneId: f, reason: w, timer: setTimeout(() => ae(), 1500) }, Oe(), e.announce?.(`${To(c.map((g) => $t(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of c) G(t.onRefuse, { noteId: g.id, laneId: f, reason: w });
      return "refused";
    }
    return Ot(c.map((g, k) => ({ ...g, from: d?.[k] })), f), "taken";
  }, $e.onFreeTextCommit = (s) => {
    if (!Sn() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = Cn({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const f = Ln(s), m = o.lanes.find((T) => T.id === d), c = $n(s) ?? Ze(o, d, f);
    if (!c) {
      Ot([{ node: s, offer: f }], d);
      return;
    }
    ae(!1), te = { laneId: d, reason: c, timer: setTimeout(() => ae(), 1500) }, Oe(), e.announce?.(`${$t(f.label)} can't go in ${m.label}. ${c} It is beside the board.`), G(t.onRefuse, { noteId: s.id, laneId: d, reason: c });
    const { width: w } = Re(o), g = An({ x: q.x + w + 32, y: a.y ?? q.y, width: a.width ?? 0, height: a.height ?? 0 }), k = Math.round(g.x), P = Math.round(g.y);
    s.position(k, P, () => e.updateSelectionResizeRotate?.(), void 0, rt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Dt({ ...s.options, x: k, y: P })] });
  }, $e.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...ye], lines: (o.lines ?? []).map((s) => ({ ...s })) }), $e.onUndoRestore = (s, a) => {
    if (S) return;
    const d = new Map((s?.cards ?? []).map((c) => [c.id, c])), f = new Map(s?.pairs ?? []), m = (c) => ye.get(c) ?? f.get(c) ?? c;
    for (const c of a.added) {
      const w = m(c), g = o.cards.find((P) => P.id === w);
      if (!g || d.has(w)) continue;
      o = V({ ...o, cards: o.cards.filter((P) => P !== g), lines: un(o.lines, w, c) }), j(o);
      const k = G(t.onChange, o, { cardId: w, cardToNote: { noteId: c }, via: "undo" });
      e.holdTrade?.(c, k), Gt(k);
    }
    for (const c of a.removed) {
      const w = m(c), g = d.get(w);
      if (!g || o.cards.some((K) => K.id === w)) continue;
      const k = (s?.lines ?? []).filter((K) => K.parentId === w || K.childId === w), P = so(o, g), T = {
        id: w,
        label: P,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...k.length ? { lines: k } : {}
      }, N = [g.laneId, ...o.lanes.map((K) => K.id)].find((K) => _n(o, K, T));
      if (!N) {
        e.announce?.(`${Z(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = ki(_n(o, N, T), w, s?.cards ?? []), w !== c && ye.set(c, w), j(o);
      const H = o.cards.findIndex((K) => K.id === w), X = o.cards.slice(H + 1).find((K) => K.laneId === N)?.id, Y = G(t.onChange, o, { cardId: w, laneId: N, noteToCard: {
        noteId: c,
        label: P,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...X ? { before: X } : {},
        ...k.length ? { lines: un(k, w, c) } : {}
      }, via: "undo" });
      e.holdTrade?.(c, Y), Gt(Y);
    }
    for (const c of d.values()) {
      const w = o.cards.find((P) => P.id === c.id);
      if (!w || w.label === c.label || vn.get(c.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: c.id }, label: c.label }], k = Ye(o, g);
      "refused" in k || (o = k.workshop, vn.set(c.id, c.label), j(o), e.announce?.(`${Z(w)} is called ${Z(c)} again.`), G(t.onChange, o, { rename: { cardId: c.id, label: c.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && yi(s.lines);
  };
  let St = !1;
  $e.onNodeAdded = (s) => {
    S || St || A.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (St = !0, queueMicrotask(() => {
      St = !1, S || Oe();
    }));
  }, $e.onLine = (s, a) => {
    S || queueMicrotask(() => {
      S || wi(s, a);
    });
  };
  const ai = e.setDragPolicy($e), Ct = {
    verdict(s, a) {
      if (!Sn()) return null;
      const d = Cn(a);
      if (!d) return null;
      const f = Ln(s), m = i?.noteUnder?.(o, ln(a), ue);
      return m && (f.under = m), { laneId: d, laneLabel: o.lanes.find((c) => c.id === d).label, reason: $n(s) ?? Ze(o, d, f) };
    },
    take: (s, a, d) => $e.onFreeDrop?.(s, a, d),
    flash(s, a) {
      S || !o.lanes.some((d) => d.id === s) || (ae(!1), te = { laneId: s, reason: a, timer: setTimeout(() => ae(), 1500) }, Oe());
    }
  };
  Nn.has(e) || Nn.set(e, /* @__PURE__ */ new Set()), Nn.get(e).add(Ct);
  const li = t.onSelect || p ? e.onSelectionChange?.(() => {
    tn(), Go();
  }) : void 0;
  let Jn = null;
  const xo = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, f = d && A.has(d) ? Ho(d) : null;
    f !== Jn && (Jn = f, Go());
  };
  p && e.element?.addEventListener?.("pointerover", xo);
  const Io = (s) => {
    if (z && Ke(), b && !s?.target?.closest?.("[data-board-pick]") && (b = null, xe && an(xe), queueMicrotask(tn)), In = null, Ge && (clearTimeout(Ge), Ge = null), !s || S || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((c) => se(Q.lane(c.id))));
    if ((e.getSelectedNodes?.() ?? []).some((c) => !a.has(c?.id))) return;
    const d = o.lanes.flatMap((c) => [Q.caption(c.id), Q.column(c.id)]).map((c) => A.get(se(c))).filter(Boolean), f = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), d, { padding: 0 }) : null, m = f ? me(f.id) : null;
    m && (In = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, Ao = (s) => {
    const a = In;
    In = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (Ge = setTimeout(() => {
      if (Ge = null, S || M || x || !o.lanes.some((f) => f.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = A.get(se(Q.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, So = () => {
    In = null;
  };
  e.element?.addEventListener?.("pointerdown", Io, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Ao, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", So, !0), Ai(), j(o, { animate: !1 });
  function Co(s, a, d) {
    const f = o.cards.find((T) => T.id === s);
    if (!f) return { kind: "outside" };
    if (i) {
      const T = ln(a), N = i.refusalAt(o, s, M?.grab ?? { x: 0, y: 0 }, T, ue);
      if (N && !N.lands) return { kind: "refused", laneId: N.laneId, reason: N.reason };
      const { width: H, height: X } = Re(o);
      if (T.x < -40 || T.y < -40 || T.x > H + 40 || T.y > X + 40) return { kind: "outside" };
      let Y = o;
      try {
        Y = d?.(T) ?? o;
      } catch (K) {
        console.warn("WORKSHOP: the board kit's chooser threw", K);
      }
      return JSON.stringify(Y) === JSON.stringify(o) ? N ? { kind: "refused", laneId: N.laneId, reason: N.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: Y.cards.find((K) => K.id === s)?.laneId ?? f.laneId, next: Y, ...N && { said: N.reason } };
    }
    const m = o.lanes.map((T) => A.get(se(Q.column(T.id)))).filter(Boolean), c = e.hitTestNodes(a, m, { padding: 6 }), w = c ? me(c.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === f.laneId) return { kind: "home" };
    const g = Wn(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: Fn(o, s, w) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: w, next: g };
    let k = null;
    try {
      k = d({ x: a.x - q.x, y: a.y - q.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: w, next: g };
    }
    const P = k?.cards.find((T) => T.id === s)?.laneId;
    return !k || !P || P === f.laneId ? { kind: "home" } : { kind: "candidate", laneId: P, next: k };
  }
  function di() {
    return i ? !1 : new Set(_e(o, { layout: ue }).places.map((s) => s.row)).size > 1;
  }
  function Lo(s, a, d = !1) {
    const f = o.cards.find((T) => T.id === s), m = cr(o, s), c = z?.cardId === s && z.laneId === null ? z.side : void 0;
    if (c !== void 0) {
      if (d || a === c) return;
      const T = c > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (Ke(), T.id === f.laneId) {
        Ue(T.id, $ ?? o), e.announce?.(`${Z(f)} is back in ${T.label}.`);
        return;
      }
      if (m.includes(T)) {
        const H = Wn(o, s, T.id);
        z = { cardId: s, laneId: T.id, next: H }, j(H), Ue(T.id, H), G(t.onPreview, H), e.announce?.(`${Z(f)} to ${T.label}: ${We(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const N = Fn(o, s, T.id) ?? "That move is not available.";
      ae(), te = { laneId: T.id, reason: N, timer: setTimeout(() => ae(), 1500) }, j($ ?? o), Ue(T.id, $ ?? o), e.announce?.(`${Z(f)} can't move to ${T.label}. ${N}`), G(t.onRefuse, { cardId: s, laneId: T.id, reason: N });
      return;
    }
    const w = z?.cardId === s ? z.laneId : f.laneId;
    let g;
    if (d) {
      const { places: T } = _e(o, { layout: ue }), N = T.find((H) => H.laneId === w);
      g = T.filter((H) => H.column === N.column && (H.row - N.row) * a > 0).sort((H, X) => (H.row - X.row) * a).map((H) => o.lanes.find((X) => X.id === H.laneId));
    } else {
      const T = o.lanes.findIndex((N) => N.id === w);
      g = a > 0 ? o.lanes.slice(T + 1) : o.lanes.slice(0, T).reverse();
    }
    const k = g.find((T) => m.includes(T));
    if (ae(), !k) {
      const T = g[0];
      if (!T) {
        if (!d && Ut()) {
          const H = dt(o, s);
          if (H) {
            e.announce?.(H), G(t.onRefuse, { cardId: s, laneId: null, reason: H });
            return;
          }
          ci(f, a);
          return;
        }
        e.announce?.(`${Z(f)} has no lane to move to on that side.`);
        return;
      }
      const N = Fn(o, s, T.id) ?? "That move is not available.";
      te = { laneId: T.id, reason: N, timer: setTimeout(() => ae(), 1500) }, j(z?.next ?? $ ?? o), Ue(T.id, z?.next ?? $ ?? o), e.announce?.(`${Z(f)} can't move to ${T.label}. ${N}`), G(t.onRefuse, { cardId: s, laneId: T.id, reason: N });
      return;
    }
    if (k.id === f.laneId) {
      Ke(), Ue(k.id, $ ?? o), e.announce?.(`${Z(f)} is back in ${k.label}.`);
      return;
    }
    const P = Wn(o, s, k.id);
    z = { cardId: s, laneId: k.id, next: P }, j(P), Ue(k.id, P), G(t.onPreview, P), e.announce?.(`${Z(f)} to ${k.label}: ${We(P, k.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ue(s, a = o) {
    const d = i ? Si(a, Q.column(s)) : _e(a, { layout: ue, rows: Fo() }).places.find((k) => k.laneId === s), f = e.canvas?.viewbox?.();
    if (!d || !f || !(f.width > 0) || !(f.height > 0)) return;
    const m = 16, c = (k, P, T, N) => P + m * 2 >= N || k - m < T ? k - m - T : k + P + m > T + N ? k + P + m - (T + N) : 0, w = c(q.x + d.x, d.width, f.x, f.width), g = c(q.y + d.y, d.height, f.y, f.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function tn() {
    if (!t.onSelect || Kn) return;
    const s = S ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && A.get(s[0].id) === s[0] ? me(s[0].id) : null;
    b && s.some((w) => !L.has(w.id)) && (b = null, xe && an(xe));
    const [d, f] = b ? b.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : d && f && !a ? { path: { from: d, to: f } } : null, c = m ? JSON.stringify(m) : null;
    c !== vo && (vo = c, G(t.onSelect, m));
  }
  function $o() {
    ie && (ie = null, j(o), G(t.onPreview, null));
  }
  function Ke() {
    z && (z = null, G(t.onPreview, null), j($ ?? o));
  }
  function ci(s, a) {
    const { width: d } = Re(o), f = A.get(se(Q.card(s.id)))?.options, m = f?.width ?? 228, c = An({
      x: a > 0 ? q.x + d + 32 : q.x - m - 32,
      y: f?.y ?? q.y,
      width: m,
      height: f?.height ?? 76
    }, a), w = hr(o, s.id);
    z = { cardId: s.id, laneId: null, side: a, spot: c, next: o }, j(o), G(t.onPreview, w), e.announce?.(`${Z(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function on() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Sn() {
    return !S && !v && !$ && !M && !on() && Ut();
  }
  function Lt() {
    ee && (ee = null, S || Oe());
  }
  function Cn(s) {
    const a = o.lanes.map((f) => A.get(se(Q.column(f.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? me(d.id)?.key ?? null : null;
  }
  function Ln(s) {
    const a = s.options ?? {}, d = Fr({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), f = String(a.text ?? ""), m = f.replace(/\s+/g, " ").trim(), c = {};
    f.trim() !== m && f.length <= 4e3 && (c.text = f.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (c.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (c[g] = Math.round(a[g]));
    if (to(a.image)) {
      c.image = { src: a.image };
      for (const [g, k] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[k]) && a[k] >= 1 && a[k] <= 2e4 && (c.image[g] = a[k]);
    }
    a.link?.data && dr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (c.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = ui(s);
    return { id: s.id, label: m, ...d ? { look: d } : {}, ...Object.keys(c).length ? { asNote: c } : {}, ...w.length ? { lines: w } : {} };
  }
  function ui(s) {
    const a = /* @__PURE__ */ new Map(), d = (f) => typeof f == "string" && !!A.get(f) && A.get(f) === e.nodes.one(f);
    for (const f of s.relationships?.getAssociations?.() ?? [])
      (f.targetPoint || !d(f.childId)) && a.set(f.id, Pn(f));
    for (const f of e.nodes?.allNodes ?? [])
      if (!(f === s || d(f.id)))
        for (const m of f.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, Pn(m));
    for (const f of Kt(o, s.id)) a.set(f.id, f);
    return [...a.values()];
  }
  function To(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function fi(s, a) {
    for (const { node: c } of s) {
      const w = $n(c);
      if (w) return w;
    }
    const d = o.lanes.find((c) => c.id === a), f = Be(o, a);
    if (d.capacity !== void 0 && !d.station && f + s.length > d.capacity) {
      const c = d.capacity - f;
      return c > 0 ? `It has room for ${c} more ${c === 1 ? "card" : "cards"}.` : `It already holds ${f} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: c } of s) {
      const w = Ze(m, a, c);
      if (w) return w;
      m = _n(m, a, c);
    }
    return null;
  }
  function $n(s) {
    if (s.options?.image && !to(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !dr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : hi(s) ? zt : null;
  }
  function rn(s) {
    return !!s && A.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function hi(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && rn(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !rn(a))) {
        for (const d of a.relationships?.getAssociations?.() ?? []) if (d.childId === s.id && !d.targetPoint) return !0;
      }
    return !1;
  }
  const $t = (s) => s || "This note", Z = (s) => s.label || "The empty card", Po = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : fs[a] ?? "shape";
  }, Tt = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Oo = (s) => {
    const a = s.flatMap((d) => {
      const f = Po(d.asNote?.shape);
      return f ? [{ card: d, word: f }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Tt(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: f }) => f === "shape" ? `${Z(d)} had its own shape` : `${Z(d)} was ${Tt(f)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, pi = (s) => {
    const a = Po(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Tt(a)} again.` : "";
  };
  function Tn() {
    return !S && !v && !$ && !on() && Ss(o);
  }
  function Pn(s) {
    const a = { id: s.id, parentId: s.parentId, childId: s.childId };
    for (const f of [
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
      const m = s[f];
      m != null && m !== "" && (a[f] = m);
    }
    for (const f of ["sourceAnchor", "targetAnchor"]) {
      const m = s[f];
      m && Number.isFinite(m.x) && Number.isFinite(m.y) && (a[f] = { x: m.x, y: m.y });
    }
    const d = s.targetPoint;
    return d && Number.isFinite(d.x) && Number.isFinite(d.y) && (a.targetPoint = { x: d.x, y: d.y }, delete a.targetAnchor), a;
  }
  function Eo(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function Mo(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (A.get(s.id) === s) {
      const a = me(s.id);
      return a?.kind === "card" && o.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || rn(s) ? null : s.id;
  }
  function Pt(s, a) {
    if (s.cards.some((f) => f.id === a)) {
      const f = A.get(se(Q.card(a)));
      return f?.relationships && f.svgGroup ? f : null;
    }
    const d = e.nodes.one(a);
    return d && A.get(a) !== d && !rn(d) && d.svgGroup ? d : null;
  }
  function No(s) {
    const a = [];
    for (const d of s) {
      const f = e.nodes.one(d.parentId);
      if (!f?.relationships || A.get(f.id) === f || f.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const w = f.relationships.addFloatingAssociation(d.targetPoint, Mn(d));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(d.childId);
      if (!m || A.get(m.id) === m) continue;
      const c = f.relationships.addAssociation(m, Mn(d));
      a.push({ type: "addRelationship", data: { ...c } });
    }
    return a;
  }
  function mi(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const N = Pt(s, d.parentId);
        if (!N || A.get(N.id) !== N) continue;
        const H = { ...d, parentId: N.id }, X = JSON.stringify(H);
        a.add(d.id);
        const Y = we.get(d.id);
        if (Y && Y.key === X && Y.holder === N && !Y.other && N.relationships.hasAssociationId?.(d.id)) continue;
        Y && e.nodes.one(Y.holder.id) === Y.holder && Y.holder.relationships?.removeAssociation?.(d.id), N.relationships.addFloatingAssociation(d.targetPoint, Mn(H)), we.set(d.id, { holder: N, other: null, swapped: !1, key: X });
        continue;
      }
      const f = Pt(s, d.parentId), m = Pt(s, d.childId);
      if (!f || !m || f === m) continue;
      const c = A.get(f.id) !== f, w = c ? m : f, g = c ? f : m, k = c ? Eo({ ...d, parentId: w.id, childId: g.id }, d) : { ...d, parentId: w.id, childId: g.id }, P = JSON.stringify(k);
      a.add(d.id);
      const T = we.get(d.id);
      T && T.key === P && T.holder === w && T.other === g && w.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), w.relationships.addAssociation(g, Mn(k)), we.set(d.id, { holder: w, other: g, swapped: c, key: P }));
    }
    for (const [d, f] of [...we])
      a.has(d) || (e.nodes.one(f.holder.id) === f.holder && f.holder.relationships?.hasAssociationId?.(d) && f.holder.relationships.removeAssociation(d), we.delete(d));
  }
  function Yn(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let On = null;
  function wi(s, a) {
    if (s === "addRelationship") {
      if (we.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, f = e.nodes.one(a?.parentId), m = d ? null : e.nodes.one(a?.childId), c = Mo(f), w = d ? null : Mo(m);
      if (rn(f)) return;
      const g = On?.lineId === a?.id ? o.lines?.find((H) => H.id === a?.id) : void 0;
      g && (On = null);
      const k = (H) => {
        Yn(a), g && j($ ?? o), e.announce?.(H), G(t.onRefuse, { reason: H, laneId: null });
      };
      if (!Tn()) {
        Yn(a), g && j($ ?? o);
        return;
      }
      if (rn(m)) return k(zt);
      if (!c || !w && !d) return k(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const P = d ? String(a.childId) : w;
      if (g) {
        const H = o.cards.some((ke) => ke.id === c), X = !d && o.cards.some((ke) => ke.id === w);
        if (!H && !X) return qe({ remove: g.id });
        const Y = { ...Pn(a), id: g.id, parentId: c, childId: P }, K = jn(o, Y);
        if (K) return k(K);
        Yn(a), qe({ set: Y });
        return;
      }
      const T = Zr(o, c, P, Pn(a)), N = jn(o, T);
      if (N) return k(N);
      Yn(a), qe({ set: T });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...we].find(([m, c]) => (m === a?.id || !a?.id && c.other?.id === a?.childId) && c.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const f = we.get(d);
      if (we.delete(d), e.nodes.one(f.holder.id) !== f.holder || f.other && e.nodes.one(f.other.id) !== f.other || !Tn())
        return Tn() || S ? void 0 : j($ ?? o);
      On = { lineId: d }, queueMicrotask(() => {
        S || On?.lineId !== d || (On = null, qe({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const f = [...we].find(([T, N]) => T === d?.associationId && N.holder.id === d?.id);
        if (!f) continue;
        const [m, c] = f, w = o.lines?.find((T) => T.id === m), g = c.holder.relationships?.getAssociations?.().find((T) => T.id === m);
        if (!w || !g) continue;
        if (!Tn()) {
          j($ ?? o);
          continue;
        }
        const k = Pn(g), P = c.swapped ? Eo({ ...k, id: w.id, parentId: w.parentId, childId: w.childId }, k) : { ...k, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(gi(P)) !== JSON.stringify(w) && (we.set(m, { ...c, key: "" }), qe({ set: P }));
      }
  }
  function gi(s) {
    return ct({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function qe(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? ct(o, s.set) : pr(o, s.remove);
    if (!d || d === o) return;
    e.beginHostStep?.(), o = d, e.endHostStep?.(), j($ ?? o);
    const f = "set" in s ? s.set : a, m = [f.parentId, f.childId].map((g) => o.cards.find((k) => k.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), c = (g) => m[g] || (g === 1 && f.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${c(0)} to ${c(1)} changed.` : f.targetPoint ? `${c(0)} has a line to a point on the canvas.` : `${c(0)} is joined to ${c(1)}.` : `The line from ${c(0)} to ${c(1)} was taken away.`);
    const w = G(t.onChange, o, { line: s });
    Gt(w, () => {
      if (S || o !== d) return;
      const g = a ? ct(o, a) : "set" in s ? pr(o, s.set.id) : null;
      g && (o = g, j($ ?? o));
    });
  }
  function yi(s) {
    const a = new Map(s.map((f) => [f.id, f])), d = new Map((o.lines ?? []).map((f) => [f.id, f]));
    for (const f of d.keys()) a.has(f) || qe({ remove: f });
    for (const [f, m] of a)
      JSON.stringify(d.get(f)) !== JSON.stringify(m) && jn(o, m) === null && qe({ set: m });
  }
  function Ot(s, a) {
    let d = o;
    const f = /* @__PURE__ */ new Map(), m = s.map(({ node: k, offer: P, from: T }) => {
      let N = P.lines;
      for (const [Y, K] of f) N = un(N, Y, K);
      d = _n(d, a, { ...P, ...N ? { lines: N } : {} });
      const H = d.cards[d.cards.length - 1];
      H.id !== k.id && f.set(k.id, H.id);
      const X = { ...k.options ?? {}, ...T ? { x: T.x, y: T.y } : {} };
      return { node: k, card: H, kept: X, lines: un(N ?? [], k.id, H.id), under: P.under };
    });
    e.beginHostStep?.(), o = d;
    let c = o;
    for (const { node: k, card: P } of m)
      P.id !== k.id && ye.set(k.id, P.id), nn.set(se(Q.card(P.id)), { x: k.options?.x ?? 0, y: k.options?.y ?? 0 }), sn(() => e.removeNode(k.id));
    e.endHostStep?.(), j(o), bi(se(Q.card(m[0].card.id)));
    const w = m.length === 1 && fr(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && vi(se(Q.card(w.id)), w.label);
    const g = o.lanes.find((k) => k.id === a);
    e.announce?.(m.length === 1 ? `${Z(m[0].card)} is now a card in ${g.label}. ${We(o, a)}.${Oo([m[0].card])}` : `${To(m.map(({ card: k }) => Z(k)))} are now cards in ${g.label}. ${We(o, a)}.${Oo(m.map(({ card: k }) => k))}`);
    for (const { node: k, card: P, kept: T, lines: N, under: H } of m) {
      const X = { cardId: P.id, laneId: a, noteToCard: {
        noteId: k.id,
        label: so(o, P),
        ...H && { under: H },
        ...P.look ? { look: P.look } : {},
        ...P.asNote ? { asNote: P.asNote } : {},
        ...N.length ? { lines: N } : {}
      } }, Y = () => {
        o !== c || !o.cards.some((ke) => ke.id === P.id) || (o = V({ ...o, cards: o.cards.filter((ke) => ke.id !== P.id), lines: un(o.lines, P.id, k.id) }), c = o, j(o));
      }, K = G(t.onChange, o, X);
      e.holdTrade?.(k.id, K), Ro(K, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: k.id, isComment: !1 } }]);
      }, () => {
        if (!S) {
          if (Y(), !e.nodes.one(T.id)) {
            e.beginHostStep?.();
            const ke = sn(() => e.addNode({ ...T }));
            ke && (ke.announcedByCreator = !0), e.endHostStep?.();
            const Qn = un(N, P.id, k.id).filter((dn) => !o.cards.some((le) => le.id === dn.parentId || le.id === dn.childId));
            ke?.ready?.then?.(() => {
              S || sn(() => No(Qn));
            });
          }
          e.announce?.(`${Z(P)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        S || (Y(), e.keepTrade?.(k.id), e.announce?.(`Someone else put ${Z(P)} on the board first.`));
      });
    }
  }
  function _o(s, a) {
    const d = o.cards.find((T) => T.id === s), f = E.get(se(Q.card(s))) ?? {}, m = _r(d), c = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = (It.cornerRadius ?? 0) > 0, g = d.asNote, k = fr(o, d), P = {
      id: c,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: g?.width ?? f.width ?? 228,
      height: g?.height ?? f.height ?? 76,
      text: k,
      shape: g?.shape ?? (w ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? f.backgroundColor,
      fontColor: d.look?.textColor ?? f.foregroundColor,
      fontSize: d.look?.fontSize ?? f.fontSize,
      borderColor: d.look?.borderColor ?? f.borderColor,
      borderWidth: d.look?.borderWidth ?? f.borderWidth,
      ...d.look?.fontFamily ?? f.fontFamily ? { fontFamily: d.look?.fontFamily ?? f.fontFamily } : {}
    };
    g?.image && Object.assign(P, {
      image: g.image.src,
      ...g.image.width ? { imageOrigWidth: g.image.width } : {},
      ...g.image.height ? { imageOrigHeight: g.image.height } : {}
    }), g?.link && (P.link = { ...g.link });
    for (const T of Object.keys(P)) P[T] === void 0 && delete P[T];
    return { id: c, note: P };
  }
  function Zn(s, a, d = "", f = !1) {
    const m = o.cards.find((le) => le.id === s), c = o.lanes.find((le) => le.id === m.laneId), w = o.cards.findIndex((le) => le.id === s), g = o.cards.slice(w + 1).find((le) => le.laneId === m.laneId)?.id, { id: k, note: P } = _o(s, a), T = m.asNote, N = Kt(o, s), { leave: H } = Ts(o, s, k), X = hr(o, s, k);
    e.beginHostStep?.(), o = X;
    const Y = o;
    k !== s ? ye.set(k, s) : ye.delete(k);
    const K = sn(() => e.addNode(P));
    K && (K.announcedByCreator = !0), e.endHostStep?.(), j(o);
    const ke = Promise.resolve(K?.ready).then(() => S || !K || e.nodes.one(k) !== K ? [] : sn(() => No(H))).catch(() => []);
    K?.ready?.then?.(() => {
      if (S || e.nodes.one(k) !== K) return;
      const le = () => e.selectNodes?.([K]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(le) : le();
    }), f || e.announce?.(`${Z(m)} is now a note on the canvas.${d} ${c.label}: ${We(o, c.id)}.${pi(T?.shape)}`);
    const Qn = () => {
      e.nodes.one(k) === K && (e.beginHostStep?.(), sn(() => e.removeNode(k)), e.endHostStep?.());
    }, dn = G(t.onChange, o, { cardId: s, cardToNote: { noteId: k } });
    return e.holdTrade?.(k, dn), Ro(dn, () => {
      ke.then((le) => {
        K && e.nodes.one(k) === K && e.sendHeld?.([{ type: "onNodeAdded", data: { id: k, nodeOptions: Dt(K.options) } }, ...le]);
      });
    }, () => {
      if (!S) {
        if (Qn(), o === Y && !o.cards.some((le) => le.id === s)) {
          const le = {
            id: s,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ...N.length ? { lines: N } : {}
          }, qo = _n(o, m.laneId, le, g);
          qo && (o = qo, j(o));
        }
        e.announce?.(`${Z(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      S || (Qn(), e.keepTrade?.(k), e.announce?.(`Someone else took ${Z(m)} off the lanes first.`));
    }), { added: K, answer: dn };
  }
  function ki(s, a, d) {
    const f = d.map((k) => k.id), m = f.indexOf(a), c = s.cards.find((k) => k.id === a);
    if (m < 0 || !c) return s;
    const w = s.cards.filter((k) => k !== c), g = w.findIndex((k) => f.indexOf(k.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, c), V({ ...s, cards: w });
  }
  function bi(s) {
    re = re.then(() => {
      const a = A.get(s);
      if (S || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function vi(s, a) {
    re = re.then(() => {
      const d = A.get(s);
      S || v || !d?.editor?.startInline || d.editor.startInline({ text: a, caret: "all" });
    });
  }
  function sn(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Ro(s, a, d, f) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((c) => {
      c === !0 ? a() : c === !1 ? d() : c === "taken" && f();
    }, () => d());
    e.holdUntil?.(m);
  }
  function xi(s, a) {
    ae(!1), te = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => ae(), 1500) }, j(o, { skip: a.cardId });
    const d = o.lanes.find((f) => f.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), G(t.onRefuse, a);
  }
  function ae(s = !0) {
    te && (clearTimeout(te.timer), te = null, s && !S && Oe());
  }
  function Oe() {
    j(M && M.outcome.kind === "candidate" ? M.outcome.next : z?.next ?? $ ?? o, { skip: M?.cardId });
  }
  function Wo(s) {
    const a = Uo(s, Fo()), d = new Map(a.map((c) => [c.options.id, c.options])), f = (c, w, g, k = !1) => {
      const P = d.get(Q.column(c));
      P && (P.borderColor = w, P.borderWidth = g, delete P.borderStyle);
      const T = k && d.get(Q.lane(c));
      T && (T.borderColor = w, T.borderWidth = g);
    }, m = M?.cardId ?? z?.cardId;
    if (Ce = /* @__PURE__ */ new Map(), m) {
      const c = o.cards.find((k) => k.id === m)?.laneId, w = cr(o, m);
      if (!i || i.laneCues)
        for (const k of w) k.id !== c && (f(k.id, ar, 2), Ce.set(k.id, "open"));
      if (i?.laneCues) {
        for (const k of o.lanes) if (!w.includes(k)) {
          const P = d.get(Q.column(k.id));
          P && (P.backgroundColor = "#e9e8e2"), Ce.set(k.id, "closed");
        }
      }
      const g = M ? M.outcome : z?.laneId ? { kind: "candidate", laneId: z.laneId } : null;
      g?.kind === "candidate" && (f(g.laneId, sr, 3, !0), Ce.set(g.laneId, "over")), g?.kind === "refused" && (f(g.laneId, Ht, 3), Ce.set(g.laneId, "refused"));
    }
    if (ee && !m) {
      for (const c of ee.open) c !== ee.laneId && (f(c, ar, 2), Ce.set(c, "open"));
      ee.laneId && !ee.refusal && (f(ee.laneId, sr, 3, !0), Ce.set(ee.laneId, "over")), ee.laneId && ee.refusal && (f(ee.laneId, Ht, 3), Ce.set(ee.laneId, "refused"));
    }
    if (z?.laneId === null && z.spot) {
      const c = d.get(Q.card(z.cardId));
      c && (c.xPos = z.spot.x, c.yPos = z.spot.y);
    }
    if (te) {
      Ce.set(te.laneId, "refused"), f(te.laneId, Ht, 3, !0);
      const c = d.get(Q.caption(te.laneId));
      if (c && (c.text = te.reason, c.foregroundColor = "#b42318", !i)) {
        const w = d.get(Q.column(te.laneId));
        w && (c.xPos = w.xPos + 6, c.width = w.width - 12, c.height = 30, c.vectorPath = wn(c.width, 30, 0), c.backgroundColor = "transparent");
      }
    }
    if (At = /* @__PURE__ */ new Set(), $ && s === $) {
      const c = (g, k) => JSON.stringify(g) === JSON.stringify(k), w = (g) => {
        const k = d.get(g);
        k && (k.borderStyle = "dashed", k.borderColor = us, k.borderWidth = 2, At.add(se(g)));
      };
      for (const g of s.cards) c(g, o.cards.find((k) => k.id === g.id)) || w(Q.card(g.id));
      for (const g of s.lanes) c(g, o.lanes.find((k) => k.id === g.id)) || w(Q.lane(g.id));
    }
    for (const c of a) {
      c.options.id = se(c.options.id);
      for (const w of c.relationships.associations)
        w.parentId = se(w.parentId), w.childId = se(w.childId);
    }
    return a;
  }
  function Fo() {
    return M || z ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function j(s, a = {}) {
    if (S) return;
    Se = a.layout ?? ue, ze = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Wo(s), f = [];
    for (const { options: c } of d) {
      const w = c.id;
      if (A.has(w)) continue;
      const g = nn.get(w);
      nn.delete(w);
      const k = g && a.animate !== !1 && !rt() ? { ...c, xPos: g.x, yPos: g.y } : c, P = e.nodes.add(Ki(k));
      A.set(w, P), E.set(w, { ...k }), P.ready && f.push(P.ready.then(() => {
        if (A.get(w) !== P) return;
        P.applyGovernance?.(), me(w)?.kind === "column" && P.toBack?.(!1), me(w)?.kind === "handle" && P.svgGroup?.front?.();
        const T = Ko(ze?.model ?? s, w);
        T && P.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const m = ze;
    re = Promise.all([re, ...f]).then(() => {
      S || ze !== m || Ii(Wo(m.model), m);
    }).catch((c) => console.warn("WORKSHOP: could not draw the workshop", c));
  }
  function Ii(s, a) {
    const d = new Set(s.map((m) => m.options.id)), f = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [c, w] of [...A]) {
        if (d.has(c)) continue;
        for (const [k, P] of [...R])
          P.parentId !== c && P.childId !== c || (P.parent.relationships?.removeAssociation(k), R.delete(k));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), A.delete(c), E.delete(c);
        const g = B.get(c);
        g && (B.delete(c), W.delete(g)), e.nodes.remove(c);
      }
      for (const { options: c } of s) {
        const w = c.id, g = A.get(w);
        if (!g?.svgGroup) continue;
        const k = E.get(w) ?? {}, P = g.editor?.isInlineEditing?.();
        (c.fontSize !== k.fontSize || c.foregroundColor !== k.foregroundColor) && (g.options.fontSize = c.fontSize, g.options.fontColor = c.foregroundColor, g.applyTextStyle?.()), (c.width !== k.width || c.height !== k.height) && (c.vectorPath ? (g.options.width = c.width, g.options.height = c.height, g.setShape?.(g.options.shape, c.vectorPath), me(w)?.kind === "column" && g.toBack?.(!1)) : g.setSize?.(c.width, c.height)), c.text !== k.text && !P && g.setText?.(c.text), c.backgroundColor !== k.backgroundColor && g.setColors?.(c.backgroundColor), (c.borderColor !== k.borderColor || c.borderWidth !== k.borderWidth || c.borderStyle !== k.borderStyle) && (g.options.borderColor = c.borderColor, g.options.borderWidth = c.borderWidth, g.options.borderStyle = c.borderStyle, g.applyBorder?.());
        const T = c.xPos !== k.xPos || c.yPos !== k.yPos || Math.abs((g.options.x ?? 0) - c.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - c.yPos) > 0.5;
        if (w !== (a.skip && se(Q.card(a.skip))) && w !== (a.grip && se(a.grip)) && T) {
          const X = a.animate && !rt() ? 180 : 0, Y = f.includes(g) ? () => {
            !S && A.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Y && X && f.length === 1 && g.resizeRotate?.disable?.(), g.position(c.xPos, c.yPos, Y, void 0, X);
        }
        const N = Ko(a.model, w);
        N && g.svgGroup.node.getAttribute("aria-label") !== N && g.svgGroup.node.setAttribute("aria-label", N), At.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", Le), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", _);
        const H = me(w);
        if (H?.kind === "column") {
          const X = Ce.get(H.key);
          X ? g.svgGroup.node.setAttribute("data-workshop-drop", X) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        H?.kind === "handle" && g.svgGroup.front?.(), E.set(w, { ...c });
      }
      const m = /* @__PURE__ */ new Map();
      for (const c of s) for (const w of c.relationships.associations) m.set(w.id, w);
      for (const [c, w] of [...R])
        m.has(c) && A.get(w.parentId) === w.parent && A.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(c), R.delete(c));
      for (const [c, w] of m) {
        if (R.has(c)) continue;
        const g = A.get(w.parentId), k = A.get(w.childId);
        !g?.relationships || !k?.svgGroup || (g.relationships.addAssociation(k, Mn(w)), R.set(c, { parentId: w.parentId, childId: w.childId, parent: g, child: k }));
      }
      mi(a.model);
    }), an(a.model), jo = a.model, Mt(), e.notifyNodeChanged?.();
  }
  let jo = null;
  function Et() {
    return !!Se.narrow || Se.lanesPerRow === 1;
  }
  function Do() {
    let s;
    try {
      s = Ds(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: Se, focused: Le, draft: _, scale: C, tagScale: y, narrow: Et(), room: s };
  }
  function Bo() {
    if (U) return [1, 1];
    const s = _t(), a = Lr(s);
    return [a, Math.round(Vt(s, Et() && !_, a) * 20) / 20];
  }
  function Mt() {
    if (!h || S) return;
    [C, y] = Bo();
    const s = jo ?? o, a = i ? i.places(s, Se) : _e(s, { layout: Se }), d = i || s.lanes[0]?.station ? void 0 : a.places;
    let f = null;
    for (const m of A.values()) {
      const c = m.svgGroup?.node;
      c?.parentNode && (!f || c.compareDocumentPosition(f) & 4) && (f = c);
    }
    h.draw({
      board: s,
      scope: r,
      origin: q,
      size: { width: a.width, height: a.height },
      ...Do(),
      places: d,
      under: f,
      ...t.onFocusDone && { onDone: () => G(t.onFocusDone) }
    });
  }
  function Ai() {
    const s = e.canvas?.node, a = Bo;
    if ([C, y] = a(), U || !h || !s || typeof MutationObserver > "u") return;
    let d = null;
    const f = new MutationObserver(() => {
      d && clearTimeout(d), d = setTimeout(() => {
        d = null;
        const [m, c] = a();
        S || m === C && c === y || (C = m, y = c, Mt());
      }, 120);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), I = () => {
      f.disconnect(), d && clearTimeout(d);
    };
  }
  let xe = null;
  function Ho(s) {
    const a = me(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, ve(s)) ?? null : null;
  }
  function zo() {
    if (x) return i?.cardOfPart?.(o, x.name) ?? null;
    if (M) return M.cardId;
    if (Jn) return Jn;
    const s = S ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && A.get(s[0].id) === s[0] ? Ho(s[0].id) : null;
  }
  let Nt = null;
  function Go() {
    S || !p || !xe || zo() !== Nt && an(xe);
  }
  function an(s) {
    if (p) {
      xe = s, Nt = zo();
      const a = o.lanes.map((m) => A.get(se(Q.column(m.id)))?.svgGroup?.node).reduce((m, c) => c && (!m || m.compareDocumentPosition(c) & 4) ? c : m, null), d = e.canvas?.viewbox?.(), f = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - q.x, y: d.y - q.y, width: d.width, height: d.height } : null;
      p.draw(o, s === o ? null : s, {
        origin: q,
        layout: Se,
        above: a,
        view: f,
        announce: (m) => e.announce?.(m),
        focus: Nt,
        boardFocused: Le,
        picked: b,
        onPick: $i,
        gripSize: xn,
        clamp: x?.last?.clampedReason ? { name: x.name, text: x.last.clampedReason } : M?.outcome.kind === "candidate" && M.outcome.said ? { name: "card-" + M.cardId, text: M.outcome.said } : !x && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!x?.last?.refusal || !x && !!pe,
        onUnlink: (m, c) => {
          if (v || $ || M || x || on()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: c }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: c } }, g = Ye(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : Xn(g.workshop, o.lanes[0]?.station ? { laneId: c } : { cardId: m });
        }
      });
    }
  }
  function ln(s) {
    return { x: s.x - q.x, y: s.y - q.y };
  }
  function Re(s) {
    return i ? i.places(s, Se) : { ..._e(s, { layout: ue }), parts: [] };
  }
  function Si(s, a) {
    const d = i.places(s, Se).parts.find((f) => f.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function _t() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function Ci() {
    Un?.(), Un = null, xn = Bt(_t());
    const s = e.canvas?.node;
    if (!Vn() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const d = () => {
      if (a = null, S || !Vn()) return;
      if (x || M) {
        a = setTimeout(d, 250);
        return;
      }
      const m = Bt(_t());
      Math.abs(m - xn) < 2 || (xn = m, j($ ?? o));
    }, f = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(d, 200);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), Un = () => {
      f.disconnect(), a && clearTimeout(a);
    };
  }
  function Vn() {
    return !i && !!o.lanes[0]?.station && Le && !v && !$ && !on();
  }
  function Li(s) {
    const a = Or(s);
    if (!a || !Vn()) return null;
    const d = o;
    return (f) => {
      const m = ss(d, f), c = ls(d, a, a.kind === "link" && m === a.from ? null : m);
      return c.next ? { next: c.next } : { next: d, clampedReason: c.refusal, refusal: c.refusal };
    };
  }
  function $i(s) {
    if (S || Le) return;
    const a = e.getSelectedNodes?.() ?? [];
    L = new Set(a.map((c) => c.id)), b = s, a.length && e.clearSelection?.(), xe && an(xe), tn();
    const [d, f] = s.split(">"), m = (c) => o.lanes.find((w) => w.id === c)?.label ?? c;
    e.announce?.(`Path from ${m(d)} to ${m(f)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function Uo(s, a) {
    if (!i) {
      const d = js(s, { native: !0, origin: q, rows: a, layout: ue, style: It }).nodes;
      return Vn() ? [...d, ...Nr(o, q, xn)] : d;
    }
    return i.notes(s, Se, q, It);
  }
  function Xn(s, a, d) {
    const f = i ? i.editsBetween(o, s) : ds(o, s);
    if (!f.length) return !1;
    const m = Ye(o, f);
    return "refused" in m ? (e.announce?.(m.refused.reason), G(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, j(o, { skip: d }), e.announce?.(m.report.edits.map((c) => c.said).join(" ")), G(t.onChange, o, { ...a, edits: f }), !0);
  }
  function Ko(s, a) {
    const d = me(a);
    if (d?.kind === "lane") {
      const f = s.lanes.find((m) => m.id === d.key);
      return f ? `${f.label}, ${We(s, f.id)}` : null;
    }
    if (d?.kind === "card") {
      const f = s.cards.find((c) => c.id === d.key), m = f && s.lanes.find((c) => c.id === f.laneId);
      return f && m ? `${f.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? i ? i.label?.(s, ve(a)) ?? null : as(s, ve(a)) : null;
  }
  function Rt(s, a) {
    const d = Uo(s).find((f) => f.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Je() {
    (M || x) && e.cancelGovernedDrag?.("host"), M = null, x = null, z && (z = null, G(t.onPreview, null)), ae(!1);
  }
  return {
    toCanvas(s) {
      if (S || v || on()) return "This workshop is view-only here.";
      if (!o.cards.some((c) => c.id === s)) return "That card is no longer on the board.";
      const a = dt(o, s);
      if (a) return a;
      z && Ke(), $ && (Je(), $ = null, j(o), e.refreshGovernance?.());
      const { width: d } = Re(o), f = A.get(se(Q.card(s)))?.options, m = o.cards.find((c) => c.id === s);
      return Zn(s, An({
        x: q.x + d + 32,
        y: f?.y ?? q.y,
        width: m?.asNote?.width ?? f?.width ?? 228,
        height: m?.asNote?.height ?? f?.height ?? 76
      })), null;
    },
    get value() {
      return o;
    },
    get origin() {
      return { ...q };
    },
    get layout() {
      return { ...ue };
    },
    get bounds() {
      const { width: s, height: a } = Re(o);
      return { x: q.x, y: q.y, width: s, height: a };
    },
    get frame() {
      const { width: s, height: a } = Re(o);
      if (!h) return { x: q.x, y: q.y, width: s, height: a };
      const d = Tr(o, { width: s, height: a }, { ...Do(), scale: 1, tagScale: Vt(1, Et() && !_) });
      return { x: q.x + d.x, y: q.y + d.y, width: d.width, height: d.height };
    },
    get focused() {
      return Le;
    },
    setFocused(s) {
      if (S) return;
      const a = Le;
      Le = !!s;
      for (const d of A.values()) d.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Le);
      a !== Le && (b && (b = null, queueMicrotask(tn)), !i && o.lanes[0]?.station ? (Je(), Ci(), j($ ?? o)) : xe && an(xe), Mt());
    },
    setLayout(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = lr(s);
      i ? i.places(o, a) : _e(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(ue) && (Je(), ue = a, j($ ?? o));
    },
    whenDrawn: () => re,
    update(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = V(s);
      Je(), o = a;
      const d = v;
      v = l || u(o), j($ ?? o), v !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = s ? V(s) : null;
      Je(), $ = a, j($ ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = o.lanes.find((f) => f.id === s);
      S || !d || (ae(!1), te = { laneId: s, reason: a, timer: setTimeout(() => ae(), 1500) }, Oe(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      l = !!s;
      const a = l || u(o);
      S || v === a || (Je(), v = a, j($ ?? o), e.refreshGovernance?.());
    },
    destroy() {
      S || (Je(), S = !0, Nn.get(e)?.delete(Ct), Un?.(), I?.(), h?.destroy(), pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", Io, !0), Ge && clearTimeout(Ge), e.element?.ownerDocument?.removeEventListener?.("pointerup", Ao, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", So, !0), li?.(), p && e.element?.removeEventListener?.("pointerover", xo), e.withPolicyAuthority(() => {
        for (const [s, a] of we) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of R) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of A)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), R.clear(), we.clear(), A.clear(), E.clear(), W.clear(), B.clear(), ai(), p?.destroy(), Kn = !1, tn(), e.notifyNodeChanged?.());
    }
  };
}
function G(e, ...n) {
  try {
    return e?.(...n);
  } catch (t) {
    console.error("WORKSHOP: a host callback threw", t);
    return;
  }
}
function Gt(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function ms(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function lr(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function ws(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const gs = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function ce(e) {
  return gs.includes(e.kind) ? e.kind : void 0;
}
function ge(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Ie(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function ys(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = kt(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function kt(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const bt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function eo(e) {
  if (typeof e != "string" || !bt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function _r(e) {
  return e.noteId ?? e.id;
}
function vt(e) {
  const n = kt(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function Rr(e) {
  const n = ge(e);
  let t;
  try {
    t = new URL(Ie(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (t.protocol !== "https:" || t.username || t.password || t.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: t.href, alt: Ie(n.alt, 240) };
}
function Pe(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Wr = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, ks = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function no(e) {
  const n = ge(e), t = {}, r = (i) => {
    if (typeof i != "string" || !Wr.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, u, p) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < u || i > p) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !ks.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function Fr(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        no({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return no(n);
}
function to(e) {
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
function dr(e) {
  try {
    return !!mt({ link: e });
  } catch {
    return !1;
  }
}
function mt(e) {
  const n = ge(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = ge(n.image);
    if (!to(r.src)) throw new Error("A card keeps a picture by its web address only.");
    t.image = { src: r.src };
    for (const o of ["width", "height"]) {
      const i = r[o];
      if (i !== void 0) {
        if (typeof i != "number" || !Number.isFinite(i) || i < 1 || i > 2e4) throw new Error("A picture size is out of range.");
        t.image[o] = i;
      }
    }
  }
  if (n.link !== void 0) {
    const r = ge(n.link), o = r.data;
    if (!(typeof o == "string" ? o.length <= 2048 : !!o && typeof o == "object" && !Array.isArray(o) && JSON.stringify(o).length <= 2048 && Object.values(o).every((u) => typeof u == "string")) || r.type !== void 0 && (typeof r.type != "string" || !/^[A-Za-z]{1,40}$/.test(r.type)) || r.show !== void 0 && typeof r.show != "boolean") throw new Error("A card keeps a link as a note does.");
    t.link = {
      ...r.type !== void 0 ? { type: r.type } : {},
      data: o,
      ...r.show !== void 0 ? { show: r.show } : {}
    };
  }
  if (n.shape !== void 0) {
    if (typeof n.shape != "string" || !/^[a-z]{1,24}$/i.test(n.shape)) throw new Error("A card keeps a shape by its name only.");
    t.shape = n.shape;
  }
  for (const r of ["width", "height"]) {
    const o = n[r];
    if (o !== void 0) {
      if (typeof o != "number" || !Number.isFinite(o) || o < 10 || o > 4e3) throw new Error("A note size is out of range.");
      t[r] = o;
    }
  }
  return Object.keys(t).length ? t : void 0;
}
const yn = 96, bs = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, vs = ["solid", "dashed", "dotted"], xs = 1e7;
function kn(e) {
  const n = ge(e);
  if (typeof n.id != "string" || !bs.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: eo(n.parentId), childId: eo(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, u) => {
    const p = n[o];
    if (p != null) {
      if (typeof p != "number" || !Number.isFinite(p) || p < i || p > u) throw new Error("A line's look is out of range.");
      t[o] = p;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !Wr.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!vs.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
    t.lineDash = n.lineDash;
  }
  if (n.lineType !== void 0 && n.lineType !== null) {
    if (typeof n.lineType != "string" || !/^[a-z]{1,24}$/i.test(n.lineType)) throw new Error("A line keeps its kind by its name only.");
    t.lineType = n.lineType;
  }
  if (n.lineCurveType !== void 0 && n.lineCurveType !== null) {
    if (n.lineCurveType !== "cubic" && n.lineCurveType !== "quadratic") throw new Error("A line curves cubic or quadratic.");
    t.lineCurveType = n.lineCurveType;
  }
  if (n.lineEffect !== void 0 && n.lineEffect !== null && n.lineEffect !== "") {
    if (typeof n.lineEffect != "string" || !/^[a-z-]{1,24}$/i.test(n.lineEffect)) throw new Error("A line keeps its effect by its name only.");
    t.lineEffect = n.lineEffect;
  }
  for (const o of ["showParentArrow", "showChildArrow"])
    if (!(n[o] === void 0 || n[o] === null)) {
      if (typeof n[o] != "boolean") throw new Error("A line's arrows are on or off.");
      t[o] = n[o];
    }
  if (n.label !== void 0 && n.label !== null && n.label !== "") {
    if (typeof n.label != "string" || n.label.length > 200 || /[<>\u0000-\u001f]/.test(n.label)) throw new Error("A line's label is plain words, up to 200 characters.");
    t.label = n.label;
  }
  if (n.targetPoint !== void 0 && n.targetPoint !== null) {
    const o = ge(n.targetPoint), i = (u) => typeof u == "number" && Number.isFinite(u) && Math.abs(u) <= xs;
    if (!i(o.x) || !i(o.y) || Object.keys(o).some((u) => u !== "x" && u !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    t.targetPoint = { x: Math.round(o.x * 100) / 100, y: Math.round(o.y * 100) / 100 };
  }
  for (const o of ["sourceAnchor", "targetAnchor"]) {
    if (o === "targetAnchor" && t.targetPoint) continue;
    const i = n[o];
    if (i == null) continue;
    const u = ge(i), p = (h) => typeof h == "number" && Number.isFinite(h) && h >= 0 && h <= 1;
    if (!p(u.x) || !p(u.y) || Object.keys(u).some((h) => h !== "x" && h !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    t[o] = { x: u.x, y: u.y };
  }
  return t;
}
function Is(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map(kn).map((r) => jr(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (Fe(t.map((r) => r.id), "line ID"), t.length > yn) throw new Error(`A workshop holds up to ${yn} lines.`);
  return t;
}
function jr(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function Fe(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function wo({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function As(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const gn = (e) => "lane-" + e, De = (e) => "card-" + e, wt = (e) => "image-" + e;
function fa(e, n = {}) {
  const t = As(e), r = Q.of(n.scope);
  return wo(e).map((o) => {
    const i = e.cards.filter((h) => h.laneId === o.id), u = t.filter((h) => h.laneId === o.id), p = [r.lane(o.id)];
    return o.station?.image && p.push(r.image(o.id)), { lane: o, cards: i, signals: u, nodeIds: [...p, ...i.map((h) => r.card(h.id))] };
  });
}
const go = 5, Rn = 24, oo = 3;
function V(e) {
  const n = ge(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ce(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = ce(n), o = r ? Ae(r) : void 0, i = { id: Pe }, u = Ie(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > go)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const p = o?.cards ?? [Rn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > p[0]) throw new Error(p[1]);
  const h = n.lanes.map((b) => {
    const L = ge(b), x = { id: Pe(L.id), label: Ie(L.label) };
    if (L.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (L.capacity !== void 0) {
      const $ = t ? 576 : 24;
      if (typeof L.capacity != "number" || !Number.isInteger(L.capacity) || L.capacity < 1 || L.capacity > $)
        throw new Error(`Lane capacity must be a whole number from 1 to ${$}.`);
      x.capacity = L.capacity;
    }
    if (o?.readLane?.(L, x, i), L.station !== void 0) {
      const $ = ge(L.station), _ = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= oo)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray($.next) || $.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const U = $.next.map(Pe);
      Fe(U, "onward stop"), x.station = { column: _($.column), row: _($.row), next: U, outcome: Ie($.outcome, 160) }, $.image !== void 0 && (x.station.image = Rr($.image));
    }
    return x;
  }), C = h.map((b) => b.id);
  if (Fe(C, "lane ID"), r && h.some((b) => b.station)) throw new Error("A business board has no map stations.");
  if ((t || h.some((b) => b.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (h.some((b) => b.station) && n.cards.every((b) => b?.free === !0))
    throw new Error("A map needs at least one token.");
  if (h.some((b) => b.station)) {
    if (!h.every((b) => b.station)) throw new Error("Give every station on the map a position.");
    Fe(h.map((b) => b.station.column + "," + b.station.row), "map position");
    for (const b of h)
      if (b.station.next.some((L) => L === b.id || !C.includes(L))) throw new Error("Connect each stop to another station on this map.");
  }
  const y = n.cards.map((b) => {
    const L = ge(b), x = { id: Pe(L.id), label: r ? Ie(L.label) : ys(L.label), laneId: Pe(L.laneId) };
    if (!C.includes(x.laneId)) throw new Error("Card refers to an unknown lane.");
    if (L.allowedLaneIds !== void 0) {
      if (!Array.isArray(L.allowedLaneIds) || L.allowedLaneIds.length > h.length) throw new Error("Invalid allowed lanes.");
      if (x.allowedLaneIds = L.allowedLaneIds.map(Pe), Fe(x.allowedLaneIds, "allowed lane"), !x.allowedLaneIds.includes(x.laneId) || !x.allowedLaneIds.every(($) => C.includes($)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (L.look !== void 0) {
      const $ = no(L.look);
      $ && (x.look = $);
    }
    if (L.asNote !== void 0) {
      const $ = mt(L.asNote);
      $ && (x.asNote = $);
    }
    if (L.noteId !== void 0 && L.noteId !== x.id && (x.noteId = eo(L.noteId)), L.free !== void 0) {
      if (L.free !== !0 || !h.some(($) => $.station)) throw new Error("Only a map’s cards can be free of its paths.");
      x.free = !0;
    }
    if (o?.readCard(L, x, i), t) {
      if (typeof L.points != "number" || !Number.isInteger(L.points) || L.points < 1 || L.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (x.points = L.points, L.dependsOn !== void 0) {
        if (!Array.isArray(L.dependsOn) || L.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        x.dependsOn = L.dependsOn.map(Pe), Fe(x.dependsOn, "dependency");
      }
    }
    return x;
  });
  Fe(y.map((b) => b.id), "card ID");
  const I = { version: 1, title: u, lanes: h, cards: y };
  if (n.experience !== void 0) {
    const b = ge(n.experience);
    if (b.version !== 1 || b.kind !== "customer-interviews" && b.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    I.experience = { version: 1, kind: b.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    I.signals = n.signals.map((b) => {
      const L = ge(b), x = Pe(L.cardId), $ = Pe(L.laneId);
      if (!y.some((_) => _.id === x) || !C.includes($))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Pe(L.id),
        label: Ie(L.label),
        cardId: x,
        laneId: $,
        whenPresent: Ie(L.whenPresent, 160),
        whenAbsent: Ie(L.whenAbsent, 160)
      };
    }), Fe(I.signals.map((b) => b.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const b = Is(n.lines, new Set(y.map((L) => L.id)));
    b.length && (I.lines = b);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    I.presentationOrder = wo({ lanes: h, presentationOrder: n.presentationOrder }).map((b) => b.id);
  }
  if (n.behaviour !== void 0 && (I.behaviour = be().validate(n.behaviour, { ...I, kind: n.kind })), t)
    return I.kind = "release-plan", Ti(I), I;
  if (r && o) {
    I.kind = r, o.readBoard(n, I, i);
    const b = o.validate(I);
    if (b) throw new Error(b);
    return I;
  }
  for (const b of h)
    if (Be({ cards: y }, b.id) > (b.capacity ?? 1 / 0))
      throw new Error(`Lane "${b.label}" exceeds its capacity.`);
  return I;
}
function Be(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const Dr = 65536;
function ha(e) {
  const n = JSON.stringify(V(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > Dr) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function pa(e) {
  if (e.length > Dr) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), t = n.get("model");
  if (!e.startsWith("#") || !t || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let r;
  try {
    r = JSON.parse(t);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return V(r);
}
function yo(e, n, t) {
  const r = ce(e);
  return r ? Ae(r).planMove(e, n, t) : void 0;
}
function gt(e, n) {
  if (ce(e)) return e.lanes.filter((r) => yo(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => Bn(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && Be(e, r.id) < (r.capacity ?? 1 / 0));
}
function ro(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = yo(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = Bn(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !gt(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? { ...r, laneId: t } : i) };
}
function Wn(e, n, t) {
  const r = Br(e, n, t);
  return !r || r === e || !e.behaviour ? r : "refused" in be().check(e, r) ? null : r;
}
function Br(e, n, t) {
  const r = e.cards.find((u) => u.id === n);
  if (!r || !e.lanes.some((u) => u.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return Bn(e, r, t);
  const o = yo(e, n, t);
  if (o !== void 0) return o;
  const i = Hs(e, n, t);
  return i || (t === "prototype" && en(e) === "customer-interviews" ? null : gt(e, r).some((u) => u.id === t) ? ro(e, n, t) : null);
}
function cr(e, n) {
  return e.lanes.filter((t) => Wn(e, n, t.id) !== null);
}
function Fn(e, n, t) {
  const r = Br(e, n, t);
  if (r !== null) {
    const I = r === e || !e.behaviour ? null : be().check(e, r);
    return I && "refused" in I ? I.refused.sentence : null;
  }
  const o = e.cards.find((I) => I.id === n), i = e.lanes.find((I) => I.id === t);
  if (!o || !i) return "That move is not available.";
  const u = ce(e), p = u && Ae(u).refusal;
  if (p) return p(e, n, t);
  const h = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return h;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return h;
    const I = Xe(e, t), b = { ...e, lanes: e.lanes.map((x) => x === i ? { id: i.id, label: i.label } : x) }, L = Bn(b, o, t);
    return L ? `Needs ${Xe(L, t) - I} points. It already holds ${I} of ${i.capacity} points.` : h;
  }
  const C = e.lanes.find((I) => I.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const y = Be(e, t);
  if (i.capacity !== void 0 && y >= i.capacity && !(C?.station && o.free)) {
    const I = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${y} of ${i.capacity} ${I}.`;
  }
  return h;
}
function Ut(e) {
  return !0;
}
function Ss(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !en(e);
}
function Cs(e) {
  const n = en(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function Ls(e) {
  const n = kt(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const $s = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function bn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && $s.test(n) && !t.has(n) ? n : zn(e, "card");
}
function Ze(e, n, t) {
  const r = e.lanes.find((p) => p.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = Cs(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= Rn ? `This board is at its size limit of ${Rn} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : Kr(e, n, t) ? null : Fn(Ur(e, n, t), bn(e, t.id), n);
  if (ce(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const p = qr(e, n, t);
    return typeof p == "string" ? p : ur(e, p);
  }
  if (e.cards.length >= Rn) return `This board is at its size limit of ${Rn} cards. Remove a card to make room.`;
  const i = e.lanes.some((p) => p.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const u = Be(e, n);
  if (r.capacity !== void 0 && !i && u >= r.capacity) return `It already holds ${u} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const p = zr(t.lines);
    if (!p) return "A line of this note can't be joined to a card.";
    const h = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + p.filter((C) => !h.has(C.id)).length > yn)
      return `A workshop holds up to ${yn} lines.`;
  }
  return ur(e, { ...e, cards: [...e.cards, { id: bn(e, t.id), label: vt(ko(t) || Qe(e)), laneId: n }] });
}
function ur(e, n) {
  if (!e.behaviour) return null;
  const t = be().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function Hr(e) {
  try {
    return e && typeof e == "object" ? Fr(e) : void 0;
  } catch {
    return;
  }
}
function io(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      mt({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? mt(n) : void 0;
}
function zr(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = kn(r);
    } catch {
      const i = (p) => {
        const { id: h, parentId: C, childId: y, targetPoint: I } = ge(r);
        return kn({ id: h, parentId: C, childId: y, ...p ? { targetPoint: I } : {} });
      }, u = r?.targetPoint !== void 0 && r?.targetPoint !== null;
      try {
        o = i(!0);
      } catch {
        try {
          o = u ? null : i(!1);
        } catch {
          o = null;
        }
      }
    }
    if (!o) return null;
    t.push(o);
  }
  return t;
}
function xt(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function un(e, n, t) {
  return e && e.map((r) => xt(r, n, t));
}
function Gr(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function _n(e, n, t, r) {
  if (Ze(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return Kr(e, n, t, r);
  if (ce(e)) {
    const $ = qr(e, n, t), _ = $.cards[$.cards.length - 1], U = r === void 0 ? -1 : e.cards.findIndex((l) => l.id === r && l.laneId === n);
    return U < 0 ? $ : { ...$, cards: [...e.cards.slice(0, U), _, ...e.cards.slice(U)] };
  }
  const o = Hr(t.look), i = ko(t), u = i || Qe(e);
  let p = io(t.asNote);
  i || (p = { ...p, text: "" }), u.length > 80 && p?.text === void 0 && u.length <= 4e3 && (p = { ...p, text: u });
  const h = bn(e, t.id), C = h !== t.id && typeof t.id == "string" && bt.test(t.id) ? t.id : void 0, y = e.lanes.some(($) => $.station), I = {
    id: h,
    label: vt(u),
    laneId: n,
    ...o ? { look: o } : {},
    ...p ? { asNote: p } : {},
    ...C ? { noteId: C } : {},
    ...y ? { free: !0 } : {}
  }, b = r === void 0 ? -1 : e.cards.findIndex(($) => $.id === r && $.laneId === n), L = b < 0 ? [...e.cards, I] : [...e.cards.slice(0, b), I, ...e.cards.slice(b)], x = t.lines === void 0 ? void 0 : Gr(e, zr(t.lines).map(($) => xt($, t.id, I.id)));
  return V({ ...e, cards: L, ...x ? { lines: x } : {} });
}
function Ur(e, n, t, r) {
  const { label: o, points: i } = Ls(typeof t.label == "string" ? t.label : ""), u = bn(e, t.id), p = u !== t.id && typeof t.id == "string" && bt.test(t.id) ? t.id : void 0, h = { id: u, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...p ? { noteId: p } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((y) => y.id === r && y.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, h] : [...e.cards.slice(0, C), h, ...e.cards.slice(C)] };
}
function Kr(e, n, t, r) {
  const o = Ur(e, n, t, r), i = bn(e, t.id), u = o.cards.find((h) => h.id === i);
  if (u.laneId === n) return V(o);
  const p = Bn(o, u, n);
  return p ? V(p) : null;
}
function qr(e, n, t) {
  const r = ko(t), o = Ae(ce(e)).fromNote(e, r, Qe(e, t.under));
  if (typeof o == "string") return o;
  const i = Ye(e, [{ kind: "add_card", lane: { id: n }, ...o, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const u = i.workshop.cards, p = bn(e, t.id), h = p !== t.id && typeof t.id == "string" && bt.test(t.id) ? t.id : void 0, C = Hr(t.look), y = r ? io(t.asNote) : { ...io(t.asNote), text: "" };
  return u[u.length - 1] = {
    ...u[u.length - 1],
    id: p,
    ...h ? { noteId: h } : {},
    ...C ? { look: C } : {},
    ...y ? { asNote: y } : {}
  }, i.workshop;
}
function ko(e) {
  return typeof e?.label == "string" ? kt(e.label) : "";
}
function fr(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === Qe(e, n.parentId) || n.label === Qe(e)) ? "" : t !== void 0 && t !== "" && vt(t) === n.label ? t : so(e, n);
}
function Jr(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = ce(e);
  return t ? Ae(t).cardText(e, n) : n.label;
}
function so(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = ce(e);
  return t ? Ae(t).noteText(e, n) : n.label;
}
function dt(e, n) {
  const t = e.cards.find((r) => r.id === n);
  if (!t) return "That card is no longer on the board.";
  if (en(e)) return "This card stays on the board.";
  if (e.lanes.some((r) => r.station) && !t.free) return "The token stays on the map.";
  if (e.kind === "release-plan") {
    const r = e.cards.find((o) => o.dependsOn?.includes(n));
    if (r) return `${r.label} depends on ${t.label}, so it stays a card.`;
  }
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((r) => r.cardId === n)) return `An outcome on this board depends on ${t.label}, so it stays a card.`;
  if (e.cards.some((r) => r.parentId === n)) return `${t.label} has cards under it, so it stays a card. Move them first.`;
  if (t.allowedLaneIds && t.allowedLaneIds.length < e.lanes.length) {
    const r = t.allowedLaneIds.map((i) => e.lanes.find((u) => u.id === i).label), o = r.length > 1 ? r.slice(0, -1).join(", ") + " or " + r.at(-1) : r[0];
    return `${t.label} may only be in ${o}, so it stays a card.`;
  }
  return null;
}
function hr(e, n, t = Yr(e, n)) {
  if (dt(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const u = { ...i, dependsOn: i.dependsOn.filter((p) => p !== n) };
    return u.dependsOn.length || delete u.dependsOn, u;
  }), o = e.lines?.map((i) => xt(i, n, t));
  return V({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Ts(e, n, t = Yr(e, n)) {
  const r = new Set(e.cards.filter((u) => u.id !== n).map((u) => u.id)), o = (e.lines ?? []).filter((u) => u.parentId === n || u.childId === n).map((u) => xt(u, n, t)), i = (u) => r.has(u.parentId) || r.has(u.childId);
  return { stay: o.filter(i), leave: o.filter((u) => !i(u)) };
}
function Yr(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? _r(t) : n;
}
function Kt(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function jn(e, n) {
  if (e.kind) return Ps;
  let t;
  try {
    t = kn(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = jr(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= yn ? `A workshop holds up to ${yn} lines.` : null;
}
const Ps = "Lines join the cards of a lane workshop to notes and to each other.";
function ct(e, n) {
  return jn(e, n) !== null ? null : V({ ...e, lines: Gr(e, [kn(n)]) });
}
function pr(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? V({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function Zr(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((u) => u.id));
  let i = `${n}->${t}`;
  for (let u = 2; o.has(i); u++) i = `${n}->${t}~${u}`;
  return kn({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function Os(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function Es(e, n) {
  return Vr(e, n, !1);
}
function We(e, n) {
  return Vr(e, n, !0);
}
function Vr(e, n, t) {
  const r = e.lanes.find((y) => y.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const y = Xe(e, n);
    return r.capacity ? y + " / " + r.capacity + " points" : y + " points";
  }
  const o = ce(e);
  if (o) return Ae(o).caption(e, n);
  const i = zs(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const u = e.cards.filter((y) => y.laneId === n).length, p = e.behaviour ? be().laneLimit(e, n) : r.capacity, h = Be(e, n), C = (y) => y + (y === 1 ? " card" : " cards");
  return t ? p !== void 0 && h !== u ? h + " of " + p + " · " + C(u - h) : p !== void 0 ? u + " of " + p : C(u) : p !== void 0 && h !== u ? h + " / " + p + " · +" + (u - h) : p !== void 0 ? u + " / " + p : String(u);
}
function Ms(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || ce(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? be().laneLimit(e, n) : t.capacity;
  return r !== void 0 && Be(e, n) >= r;
}
const Hn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, fn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Xr(e, n = Hn, t = 28, r) {
  const { pitch: o, row: i, top: u } = n, p = !!e.lanes[0].station, h = e.lanes.map((I) => e.cards.filter((b) => b.laneId === I.id).length), C = u + Math.max(1, ...r ?? h) * i + 36, y = e.lanes.map((I, b) => ({
    x: p ? I.station.column * (o + t) : b * o,
    y: p ? I.station.row * C : 0
  }));
  return {
    points: y,
    width: Math.max(...y.map((I) => I.x)) + o,
    height: Math.max(...y.map((I, b) => I.y + u + (p ? Math.max(1, h[b]) : h[b] + 1) * i))
  };
}
function ma() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function zn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function Qr(e) {
  const n = V(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Ns(e, n) {
  const t = Qr(e), r = zn(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), V(t);
}
function _s(e, n, t) {
  const r = Qr(e);
  return r.cards.push({
    id: zn(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), V(r);
}
function wa() {
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
function mr(e, n, t) {
  const r = V(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((y) => y.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= go) throw new Error("A map can have up to five stations.");
  const i = Ie(t?.label), u = Ie(t?.outcome, 160), p = zn(r, "station");
  let h, C = 1 / 0;
  for (let y = 0; y < oo; y++)
    for (let I = 0; I < oo; I++) {
      if (r.lanes.some((L) => L.station.column === I && L.station.row === y)) continue;
      const b = Math.abs(o.station.column - I) + Math.abs(o.station.row - y);
      b < C && (C = b, h = { column: I, row: y });
    }
  if (!h) throw new Error("There is no free station position.");
  return o.station.next.push(p), r.lanes.push({ id: p, label: i, station: { ...h, next: [], outcome: u, ...t.image === void 0 ? {} : { image: Rr(t.image) } } }), r.presentationOrder?.push(p), r;
}
const ga = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, ao = (e) => "caption-" + e, mn = (e) => "column-" + e, wr = "rules-board";
function Gn(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function ya(e, n) {
  const t = Gn(n);
  return t ? t + ":" + e : e;
}
const Q = {
  lane: gn,
  card: De,
  image: wt,
  caption: ao,
  column: mn,
  rules: wr,
  of(e) {
    const n = Gn(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(gn(r)),
      card: (r) => t(De(r)),
      image: (r) => t(wt(r)),
      caption: (r) => t(ao(r)),
      column: (r) => t(mn(r)),
      rules: t(wr)
    };
  }
};
function ei(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function ni(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function wn(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function gr(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function yr(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((p, h) => p + Math.max(1, Math.ceil(h.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const ti = 152, lo = ti + 12, Rs = 12;
function Ws(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function _e(e, n = {}) {
  const t = V(e), { pitch: r, row: o, top: i } = Hn, u = t.lanes.map((b) => t.cards.filter((L) => L.laneId === b.id).length), p = (b) => Math.max(u[b], (Array.isArray(n.rows) ? n.rows[b] : n.rows) ?? 0), h = !!t.lanes[0].station, C = t.lanes.some((b) => b.station?.image), y = Ws(n.layout, t.lanes.length), I = [];
  if (h) {
    const { points: b } = Xr(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach((L, x) => I.push({
      laneId: L.id,
      x: b[x].x,
      y: b[x].y + (C ? L.station.row * lo : 0),
      width: r,
      height: i + (L.station.image ? lo : 0) + Math.max(1, p(x)) * o,
      column: L.station.column,
      row: L.station.row
    }));
  } else {
    let b = 0;
    for (let L = 0; L < t.lanes.length; L += y) {
      const x = t.lanes.slice(L, L + y), $ = i + (Math.max(...x.map((_, U) => p(L + U))) + 1) * o;
      x.forEach((_, U) => I.push({ laneId: _.id, x: U * r, y: b, width: r, height: $, column: U, row: L / y })), b += $ + Rs;
    }
  }
  return { places: I, width: Math.max(...I.map((b) => b.x + b.width)), height: Math.max(...I.map((b) => b.y + b.height)) };
}
function Fs(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: u } = Hn, p = n.origin ?? { x: 0, y: 0 }, h = !!e.lanes[0].station, { places: C } = _e(e, n), y = n.style ?? {}, I = y.textColor ?? En.fontColor, b = y.borderColor ?? En.borderColor, L = y.borderWidth ?? En.borderWidth, x = y.cornerRadius ?? 0, $ = y.fontSize ?? En.fontSize, _ = y.laneFontSize ?? $ + 2, U = y.captionFontSize ?? Math.max(11, $ - 1), l = [], v = (A) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: wn(A.width, A.height, x),
      foregroundColor: I,
      borderColor: b,
      borderWidth: L,
      ...y.fontFamily ? { fontFamily: y.fontFamily } : {},
      ...A
    }, relationships: { associations: [] } };
    return l.push(E), E;
  };
  e.lanes.forEach((A, E) => {
    const R = C[E], W = p.x + R.x, B = p.y + R.y, M = A.station?.image;
    v({
      id: mn(A.id),
      text: "",
      name: A.label,
      xPos: W + 2,
      yPos: B,
      width: t - 4,
      height: R.height,
      vectorPath: wn(t - 4, R.height, x ? x + 2 : 0),
      backgroundColor: h ? "#fcf9ed" : gr(fn[E], 0.6),
      borderColor: h ? "#a8b5aa" : gr(fn[E], 0.1),
      borderWidth: 1,
      ...h ? { borderStyle: "dashed" } : {}
    }), v({
      id: gn(A.id),
      text: A.label,
      name: A.label,
      xPos: W + 8,
      yPos: B + 6,
      width: r,
      height: 58,
      backgroundColor: fn[E],
      fontSize: yr(A.label, _, r - 16, 50)
    });
    const z = h ? "" : Es(e, A.id), ie = U, ee = h ? r : Math.min(r, Math.max(40, Math.ceil(z.length * ie * 0.6) + 24));
    v({
      id: ao(A.id),
      text: z,
      name: A.label,
      xPos: W + 8 + Math.round((r - ee) / 2),
      yPos: B + 68,
      width: ee,
      height: 22,
      vectorPath: wn(ee, 22, h ? 0 : 11),
      backgroundColor: h ? "transparent" : Ms(e, A.id) ? fn[E % fn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: ie
    }), M && l.push({ options: {
      id: wt(A.id),
      name: M.alt,
      text: "",
      xPos: W + 8,
      yPos: B + u,
      width: r,
      height: ti,
      shapeHint: "rectangle",
      image: M.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((ye) => ye.laneId === A.id).forEach((ye, vn) => {
      const nn = Jr(e, ye), te = h ? r - 20 : r, pe = h ? i - 6 : i, He = h && !ye.free, re = He ? {} : { ...y.card, ...ye.look }, ze = He ? x : y.card?.cornerRadius ?? x;
      v({
        id: De(ye.id),
        text: nn,
        name: ye.label,
        xPos: W + (h ? 18 : 8),
        yPos: B + u + (M ? lo : 0) + vn * o,
        width: te,
        height: pe,
        ...ze !== x ? { vectorPath: wn(te, pe, ze) } : {},
        backgroundColor: He ? "#ffda75" : re.backgroundColor ?? y.backgroundColor ?? En.backgroundColor,
        ...re.textColor ? { foregroundColor: re.textColor } : {},
        ...re.fontFamily ? { fontFamily: re.fontFamily } : {},
        ...re.borderColor ? { borderColor: re.borderColor } : {},
        ...re.borderWidth !== void 0 ? { borderWidth: re.borderWidth } : {},
        fontSize: yr(nn, re.fontSize ?? $, te - 16, pe - 8)
      });
    });
  });
  const S = new Map(l.map((A) => [A.options.id, A]));
  for (const A of e.lanes)
    A.station && (S.get(mn(A.id)).relationships.associations = A.station.next.map((E) => ({
      id: A.id + "-to-" + E,
      parentId: mn(A.id),
      childId: mn(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const A of e.cards)
      for (const E of A.dependsOn ?? []) {
        const R = De(E), W = De(A.id);
        S.get(R).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${A.id}`,
          parentId: R,
          childId: W,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (ei(l, Gn(n.scope)), n.beside) {
    const A = new Set(n.beside), E = new Set(l.map((B) => B.options.id)), R = /* @__PURE__ */ new Map();
    for (const B of [...E]) {
      if (!A.has(B)) continue;
      const M = ni(B, (z) => A.has(z) || E.has(z));
      E.add(M), R.set(B, M);
    }
    const W = (B) => R.get(B) ?? B;
    for (const B of l) {
      B.options.id = W(B.options.id);
      for (const M of B.relationships.associations)
        M.parentId = W(M.parentId), M.childId = W(M.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: l };
}
function ka(e, n, t = {}) {
  return e.behaviour ? be().note(e, n, t) : null;
}
function js(e, n) {
  const t = V(e), r = Gn(n?.scope);
  if (n?.native) return Fs(t, n);
  const { width: o, row: i, height: u, top: p } = Hn, h = [];
  function C(x, $, _, U, l, v) {
    h.push({ options: {
      id: x,
      text: $,
      name: $,
      xPos: _,
      yPos: U,
      width: o,
      height: l,
      shapeHint: "rectangle",
      backgroundColor: v,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: y } = Xr(t), I = 152, b = I + 12, L = t.lanes.some((x) => x.station?.image);
  t.lanes.forEach((x, $) => {
    const _ = y[$].x, U = y[$].y + (L ? (x.station?.row ?? 0) * b : 0), l = x.station?.image, v = t.kind === "release-plan" ? x.label + `
` + (x.capacity ? Xe(t, x.id) + " / " + x.capacity + " points" : Xe(t, x.id) + " points") : x.label;
    C(gn(x.id), v, _, U, p - 12, fn[$]), l && h.push({ options: {
      id: wt(x.id),
      name: l.alt,
      text: "",
      xPos: _,
      yPos: U + p,
      width: o,
      height: I,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((S) => S.laneId === x.id).forEach((S, A) => C(De(S.id), Jr(t, S), _, U + p + (l ? b : 0) + A * i, u, "#fffdf6"));
  });
  for (const x of t.lanes) {
    if (!x.station) continue;
    const $ = h.find((_) => _.options.id === gn(x.id));
    $.relationships.associations = x.station.next.map((_) => ({ id: x.id + "-to-" + _, parentId: $.options.id, childId: gn(_), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), $.options.text = x.label + `
` + x.station.outcome, $.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const x = new Map(h.map(($) => [$.options.id, $]));
    for (const $ of t.cards)
      for (const _ of $.dependsOn ?? []) {
        const U = De(_), l = De($.id);
        x.get(U).relationships.associations.push({
          id: `dependency-${_.length}-${_}-${$.id}`,
          parentId: U,
          childId: l,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return ei(h, r), { options: { name: t.title }, shareId: "", nodes: h };
}
function Ds(e, n = {}, t) {
  const r = V(e), o = n.narrow ? void 0 : n.width;
  if (ce(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: p, height: h } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(p, o ?? 0), height: h };
  }
  const { width: i, height: u } = _e(r, {});
  return { width: Math.max(go * Hn.pitch, i), height: u };
}
function Bs(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((u) => [u.x, u.y, u.width, u.height].every(Number.isFinite));
  for (let u = 0; u <= i.length; u++) {
    const p = i.find((h) => o < h.x + h.width + r && o + e.width > h.x - r && e.y < h.y + h.height + r && e.y + e.height > h.y - r);
    if (!p) break;
    o = t > 0 ? p.x + p.width + r : p.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const ba = {
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
}, co = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], bo = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function va() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: co.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: co.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function xa() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...bo.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function en(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...bo.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => co.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function Hs(e, n, t) {
  const r = en(e), o = e.cards.find((u) => u.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const u = e.cards.find((p) => p.laneId === t);
    if (u) {
      if (!gt(e, u).some((p) => p.id === "interviews")) return null;
      i = ro(e, u.id, "interviews");
    }
  }
  return gt(i, o).some((u) => u.id === t) ? ro(i, n, t) : null;
}
function zs(e, n) {
  if (en(e) !== "experiment-budget") return null;
  const t = bo.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  Ut as $,
  Hn as A,
  js as B,
  Xr as C,
  Xe as D,
  gt as E,
  ro as F,
  Ui as G,
  sa as H,
  Ir as I,
  en as J,
  As as K,
  zs as L,
  co as M,
  bo as N,
  Rn as O,
  gs as P,
  ce as Q,
  _r as R,
  vt as S,
  Fr as T,
  to as U,
  dr as V,
  yn as W,
  wo as X,
  fa as Y,
  ha as Z,
  pa as _,
  ji as a,
  Ks as a$,
  Ss as a0,
  Ze as a1,
  un as a2,
  _n as a3,
  fr as a4,
  Jr as a5,
  so as a6,
  dt as a7,
  hr as a8,
  Ts as a9,
  va as aA,
  xa as aB,
  Hs as aC,
  Xs as aD,
  be as aE,
  Oi as aF,
  Qe as aG,
  Ve as aH,
  uo as aI,
  ta as aJ,
  Mi as aK,
  Ni as aL,
  qt as aM,
  at as aN,
  ho as aO,
  nr as aP,
  tr as aQ,
  $r as aR,
  rs as aS,
  ca as aT,
  he as aU,
  ts as aV,
  Tr as aW,
  Lr as aX,
  Vt as aY,
  Cr as aZ,
  os as a_,
  Kt as aa,
  jn as ab,
  Ps as ac,
  ct as ad,
  pr as ae,
  Zr as af,
  Os as ag,
  Es as ah,
  We as ai,
  Ms as aj,
  ma as ak,
  zn as al,
  Ns as am,
  _s as an,
  wa as ao,
  mr as ap,
  ga as aq,
  Gn as ar,
  ya as as,
  Q as at,
  ni as au,
  _e as av,
  ka as aw,
  Ds as ax,
  Bs as ay,
  ba as az,
  Wn as b,
  Zs as b0,
  ra as b1,
  ia as b2,
  aa as b3,
  la as b4,
  da as b5,
  br as b6,
  ft as b7,
  Ri as b8,
  oa as b9,
  Gi as ba,
  Fn as c,
  ea as d,
  Be as e,
  wn as f,
  ua as g,
  Ye as h,
  Vi as i,
  Qs as j,
  Yt as k,
  hn as l,
  Vo as m,
  fn as n,
  cr as o,
  pn as p,
  Ys as q,
  na as r,
  O as s,
  qs as t,
  Js as u,
  V as v,
  Ae as w,
  Us as x,
  et as y,
  Vs as z
};
