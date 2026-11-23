import { D as Nn } from "./NoteDefaults-1xFW0br8.mjs";
const Ks = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function qs(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: c, fallback: p } = e, h = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !h(i) || !h(c) || !h(p) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: c.trim(), fallback: p.trim() };
}
function Js(e) {
  return { ...e, stage: "review", choice: null };
}
function Ys(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Zs(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const nt = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Vs(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, c = (p) => typeof p == "string" && p.trim().length > 0 && p.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(p);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !c(o) || !c(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function Xs({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === nt.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === nt.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === nt.leftLabel && t === nt.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
function en(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function Pi(e) {
  const n = new Map(e.cards.map((c) => [c.id, c])), t = new Map(e.lanes.map((c, p) => [c.id, p])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function i(c) {
    if (!r.has(c.id)) {
      if (o.has(c.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(c.id);
      for (const p of c.dependsOn ?? []) {
        const h = n.get(p);
        if (!h) throw new Error("A release dependency refers to an unknown feature.");
        if (t.get(h.laneId) > t.get(c.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(h);
      }
      o.delete(c.id), r.add(c.id);
    }
  }
  for (const c of e.cards) i(c);
  for (const c of e.lanes) {
    if (c.station) throw new Error("Release windows cannot also be map stations.");
    if (en(e, c.id) > (c.capacity ?? 1 / 0)) throw new Error(`Release "${c.label}" exceeds its point budget.`);
  }
}
function zn(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((x, b) => [x.id, b])), o = r.get(t);
  if (o === void 0) return null;
  const i = o < r.get(n.laneId), c = /* @__PURE__ */ new Set([n.id]), p = [n];
  for (; p.length; ) {
    const x = p.pop();
    for (const b of e.cards) {
      if (c.has(b.id)) continue;
      const L = r.get(b.laneId);
      (i ? L > o && x.dependsOn?.includes(b.id) : L < o && b.dependsOn?.includes(x.id)) && (c.add(b.id), p.push(b));
    }
  }
  if (e.cards.filter((x) => c.has(x.id)).some((x) => x.allowedLaneIds && !x.allowedLaneIds.includes(t))) return null;
  const C = { ...e, cards: e.cards.map((x) => c.has(x.id) ? { ...x, laneId: t } : x) }, y = e.lanes[o].capacity;
  return y !== void 0 && en(C, t) > y ? null : C;
}
const Qs = {
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
}, kt = /* @__PURE__ */ new Map(), Oi = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function ea(e) {
  kt.set(e.kind, e);
}
function na(e) {
  return typeof e == "string" && kt.has(e);
}
function nn(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? kt.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function ve(e) {
  const n = kt.get(e);
  if (!n) throw new Error(`The ${Oi[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let ft = null;
function ta(e) {
  ft = e;
}
function Ei() {
  return ft !== null;
}
function ke() {
  if (!ft) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return ft;
}
const O = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Qe = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Yo = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ho = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), po = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), oa = (e) => ho(po(e)), Mi = [
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
], Ni = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Mi.indexOf(e.toLowerCase()), _i = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function br(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = ho(o);
    i && t.add(i);
  };
  r(e), r(po(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const Dt = "[^\\p{L}\\p{N}]", Zo = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Yo(n) + "(?:$|" + Dt + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Dt + ")" + Yo(n) + "(?:$|" + Dt + ")", "u").test(e)
], Vo = ["first", "second", "third", "fourth", "fifth"];
function Ri(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + Vo.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(ho(po(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? Vo.indexOf(o) : Ni(o) - 1;
  return e[i] ?? null;
}
function jt(e, n, t, r, o) {
  const i = br(n, t);
  if (i.some((p) => _i.test(p))) {
    const p = r && e.find((h) => h.id === r);
    return p ? { item: p, rank: 0 } : { pointing: !0 };
  }
  for (const p of i) {
    if (!p.startsWith("@")) continue;
    const h = e.find((C) => C.id === p.slice(1));
    if (h) return { item: h, rank: 0 };
  }
  for (const [p, h] of Zo.entries())
    for (const C of i) {
      const y = e.filter((x) => h(x.label.toLowerCase(), C.toLowerCase()));
      if (y.length === 1) return { item: y[0], rank: p };
      if (y.length > 1) return { several: y };
    }
  const c = o ? Ri(e, n, t) : null;
  return c ? { item: c, rank: Zo.length } : {};
}
class lt extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function Yt(e, n, t, r, o = !1) {
  return { find: (h) => {
    const C = jt(e, h, n, r, o);
    if (C.item) return C.item;
    const y = br(h, n), x = y[y.length - 1];
    if (C.pointing) throw new lt("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const L = [...new Set(C.several.map((I) => I.label))];
      throw new lt(L.length === 1 ? C.several.length + " " + t + "s are called " + O(L[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + O(x) + ": " + Qe(L.slice(0, 6).map(O)) + ". Use the whole name.", "ambiguous", C.several.map((I) => I.id));
    }
    const b = e.map((L) => L.label);
    throw new lt("There is no " + t + " called " + O(x) + " here." + (b.length && b.length <= 6 ? " The " + t + "s are " + Qe(b.map(O)) + "." : b.length ? "" : " There are no " + t + "s yet."), "unknown", e.map((L) => L.id));
  }, attempt: (h) => jt(e, h, n, r, o).item ?? null, rank: (h) => jt(e, h, n, r, o).rank ?? 1 / 0 };
}
const vr = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Ne = [...vr], cn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], xr = vr.slice(5);
function ht(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ie(e);
  return n || (e.kind === "release-plan" ? "release-plan" : tn(e) ?? "lanes");
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
}, Zt = {
  "launch-plan": F.launchLanes,
  pipeline: F.pipelineLanes,
  budget: F.budgetLanes,
  "hiring-plan": F.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, fe = (e, n) => Object.fromEntries(Ne.filter((t) => !e.includes(t)).map((t) => [t, n])), ce = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), ne = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), oe = (e) => ({ type: "ref", of: "card", about: e }), Bt = (e) => ({ map: e }), Ee = fe(["map"], F.notMap), Te = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), Vt = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ce(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: ne("The lane or step."), label: ce(80, "The new name, 1 to 80 characters of plain text.") },
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
    fields: { label: ce(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, map: F.mapAddLane, ...Zt }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: ne("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, ...Zt }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: ne("The lane or step it starts in."),
      label: ce(80, "What the card says. Left out, the card takes the board’s name for a new item: “New card”, “New hire”, “New task”, “New deal” (on a map, a token is numbered; a free card is “New stop”).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Te("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Te("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Te("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...xr],
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
    refusals: { ...Bt(F.mapCardLanes), ...fe([...cn, "map"], F.businessCards) }
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
      whenPresent: ce(160, "What it says when the card is there."),
      whenAbsent: ce(160, "What it says otherwise."),
      label: ce(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: cn,
    refusals: { ...Bt(F.mapOutcome), ...fe([...cn, "map"], F.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: oe("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: cn,
    refusals: { ...Bt(F.mapOutcome), ...fe([...cn, "map"], F.businessCards) }
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
    fields: { from: ne("The step it follows."), label: ce(80, "The new step’s name."), outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0) },
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
      label: ce(80, "The new step’s name."),
      outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0)
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
    fields: { station: ne("The step."), outcome: ce(160, "What it says.") },
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
    fields: { station: ne("The step."), alt: ce(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: oe("The card the line starts at."), to: oe("The card it points to."), label: ce(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: tt()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: oe("One card."), to: oe("The other card.") },
    boards: ["lanes"],
    refusals: tt()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: oe("The card."),
      note: ce(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: ce(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: tt()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: oe("The card."), note: ce(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: tt()
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
      rule: ce(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], F.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: ce(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: fe(["lanes", "pipeline"], F.noRules) }
];
function tt() {
  return { ...fe(["lanes"], F.businessLines), "release-plan": F.lines, "customer-interviews": F.lines, "experiment-budget": F.lines, map: F.lines };
}
const Wi = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", Xo = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, Fi = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function Di(e, n) {
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
      return { ...r({ type: "integer", minimum: e.min, maximum: Fi(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: Xo.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...Xo.keys
      }, description: e.about };
  }
}
const Ir = (e) => "optional" in e && e.optional === !0;
function ra(e) {
  const n = e ? ht(X(e)) : void 0;
  return Vt.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, c]) => !Ir(c)).map(([c]) => c)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([c, p]) => [c, Di(p, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const ot = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function ji(e, n) {
  const t = !!e.lanes[0]?.station, r = Yt(e.lanes, t ? ot.step : ot.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = Yt(e.cards, t ? ot.token : ot.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const i = e.cards.filter((p) => !p.free), c = (p) => i.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(p.trim()) ? i[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (p) => c(p) ?? o.find(p),
    attempt: (p) => c(p) ?? o.attempt(p),
    rank: (p) => c(p) ? 0 : o.rank(p)
  } };
}
class j {
  constructor(n, t, r = null, o, i, c) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = i, this.limits = c;
  }
}
function pt(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function J(e, n, t = null, r) {
  try {
    return X(e);
  } catch (o) {
    throw new j(pt(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function Bi(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (Ir(o)) continue;
      return n.kind + " needs " + r + ".";
    }
    const c = n.kind + " needs " + r + " as ";
    switch (o.type) {
      case "text":
        if (typeof i != "string") return c + "text.";
        break;
      case "ref":
        if (!t(i)) return c + "an id or a name.";
        break;
      case "refs":
        if (i === null && o.nullable) break;
        if (!Array.isArray(i) || i.length > o.max || !i.every(t)) return c + "a list of up to " + o.max + " ids or names" + (o.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (i === null && o.nullable) break;
        if (typeof i != "number" || !Number.isFinite(i)) return c + "a number" + (o.nullable ? " or null." : ".");
        break;
      case "image":
        if (i === null) break;
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((p) => p !== "src" && p !== "alt")) return c + "{src, alt} or null.";
        break;
      case "choice":
        if (!o.values.includes(i)) return c + o.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof i != "boolean") return c + "true or false.";
        break;
      case "rule":
        if (!i || typeof i != "object" || Array.isArray(i) || typeof i.kind != "string") return c + "an object with a kind.";
        break;
    }
  }
  return null;
}
function Hi(e, n, t, r, o) {
  const i = structuredClone(e), c = t === "map", p = t === "release-plan", h = ji(i, r), C = { lane: c ? "step" : "lane", card: c ? "token" : "card" };
  function y(l, v, S, A, E = null) {
    if (typeof S == "object") {
      const W = l.find((B) => B.id === S.id);
      if (!W) throw new j("That " + A + " is no longer on the workshop.", "gone", E);
      return W;
    }
    const R = l.find((W) => W.id === S);
    if (R) return R;
    try {
      return v.find(S);
    } catch (W) {
      if (!(W instanceof lt)) throw W;
      const B = W.reason === "ambiguous" ? "ambiguous_reference" : W.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new j(W.message, B, E, void 0, W.candidates.length ? W.candidates : void 0);
    }
  }
  const x = (l, v = null) => y(i.lanes, h.lanes, l, "lane", v), b = (l, v = null) => y(i.cards, h.cards, l, "card", v), L = (l) => {
    try {
      return x(l);
    } catch {
      return null;
    }
  }, I = (l, v, S = {}, A = !0) => ({ board: l, said: v, changed: A, ...S }), $ = (l) => He(i, l), _ = (l) => c ? "The presentation opens with " + O(l[0].label) + "." : "The presentation now runs " + l.map((v) => O(v.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return ke().edit(i, n, o, {
      lane: (l) => x(l),
      card: (l) => b(l),
      done: (l, v, S) => I(l, v, S),
      refuse: (l, v = {}) => {
        throw new j(l, v.code ?? "refused", v.laneId ?? null, v.cardId);
      }
    });
  if (xr.includes(t)) {
    n.kind === "add_card" && Qo(n, t, x(n.lane).id);
    const l = {
      card: (S) => b(S),
      lane: (S) => x(S),
      refuse: (S, A = {}) => {
        throw new j(S, A.code ?? "refused", A.laneId ?? null, A.cardId, void 0, A.limits);
      },
      settle: (S, A = null, E) => J(S, t, A, E),
      done: (S, A, E) => I(S, A, E)
    }, v = ve(t).edit(i, n, l);
    if (v) return v;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const l = J(i, t);
      return I(l, "Renamed the " + (c ? "map" : "workshop") + " to " + O(l.title) + ".");
    }
    case "rename_lane": {
      const l = x(n.lane), v = l.label;
      l.label = n.label;
      const S = J(i, t, l.id);
      return I(S, "Renamed " + O(v) + " to " + O(S.lanes.find((A) => A.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = b(n.card), v = l.label;
      l.label = n.label;
      const S = J(i, t, l.laneId, l.id);
      return I(S, "Renamed " + O(v) + " to " + O(S.cards.find((A) => A.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new j("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new j("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = _s(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (S) {
        throw new j(pt(S.message, t), "refused");
      }
      const v = l.lanes[l.lanes.length - 1];
      return I(l, "Added the lane " + O(v.label) + ".", { laneId: v.id });
    }
    case "remove_lane": {
      const l = x(n.lane), v = i.cards.filter((S) => S.laneId === l.id);
      if (c) {
        if (v.length) throw new j(O(v[0].label) + " is at " + O(l.label) + ". Move it to another step first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new j("A map needs at least two steps.", "refused", l.id);
      } else {
        if (v.length) throw new j(O(l.label) + " holds " + v.length + (v.length === 1 ? " card" : " cards") + ". Move or remove " + (v.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new j("A workshop needs at least two columns.", "refused", l.id);
      }
      i.lanes = i.lanes.filter((S) => S !== l);
      for (const S of i.lanes) S.station && (S.station.next = S.station.next.filter((A) => A !== l.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((S) => S !== l.id));
      for (const S of i.cards) S.allowedLaneIds && (S.allowedLaneIds = S.allowedLaneIds.filter((A) => A !== l.id));
      return rt(i, (S) => S.laneId === l.id), i.behaviour && (i.behaviour = ke().dropLane(i.behaviour, l.id)), I(J(i, t), "Removed the " + C.lane + " " + O(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = x(n.lane);
      if (c) {
        if (n.allowedLanes !== void 0) throw new j(F.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new j("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const M = Un(i, "card");
          i.cards.push({ id: M, label: xt(n.label?.trim() || nn(i)), laneId: l.id, free: !0 });
          const z = J(i, t, l.id);
          return I(z, "Added " + O(z.cards.find((se) => se.id === M).label) + " to " + O(l.label) + ".", { laneId: l.id, cardId: M });
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
        return I(B, "Added " + O(B.cards[B.cards.length - 1].label) + " at " + O(l.label) + ".", { laneId: l.id, cardId: "token-" + W });
      }
      if (Qo(n, t, l.id), i.cards.length >= 24) throw new j("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && $(l.id) >= l.capacity)
        throw new j(O(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", l.id);
      const v = n.allowedLanes && [...new Set(n.allowedLanes.map((E) => x(E).id))];
      let S;
      try {
        S = Rs(i, l.id, { label: n.label?.trim() || nn(i), ...v && { allowedLaneIds: v } });
      } catch (E) {
        throw new j(pt(E.message, t), "refused", l.id);
      }
      const A = S.cards[S.cards.length - 1];
      return I(S, "Added " + (A.label ? O(A.label) : "an empty card") + " to " + O(l.label) + ".", { laneId: l.id, cardId: A.id });
    }
    case "remove_card": {
      const l = b(n.card);
      if (c && !l.free && i.cards.filter((v) => !v.free).length === 1) throw new j("A map needs at least one token.", "refused", l.laneId, l.id);
      if (p && i.cards.length === 1) throw new j("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new j("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      i.cards = i.cards.filter((v) => v !== l);
      for (const v of i.cards)
        v.dependsOn?.includes(l.id) && (v.dependsOn = v.dependsOn.filter((S) => S !== l.id), v.dependsOn.length || delete v.dependsOn);
      return rt(i, (v) => v.cardId === l.id), I(J(Es(i, l.id), t, l.laneId), "Removed the " + C.card + " " + O(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? i.lanes.find((A) => A.id === n.lane.id) ?? null : L(n.lane), v = b(n.card, l?.id ?? null), S = x(n.lane, v.laneId);
      return U(v, S);
    }
    case "advance_card": {
      const l = b(n.card), v = i.lanes.find((A) => A.id === l.laneId), S = v.station.next.map((A) => i.lanes.find((E) => E.id === A)).filter((A) => !!A);
      if (!S.length) throw new j(O(l.label) + " is at " + O(v.label) + ", and no path leads on from there.", "refused", v.id, l.id);
      if (S.length > 1)
        throw new j("From " + O(v.label) + " the path goes to " + S.map((A) => O(A.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + S[0].label + "”.", "refused", v.id, l.id);
      return U(l, S[0]);
    }
    case "set_lane_capacity": {
      const l = x(n.lane), v = i.behaviour && ke().setLimit(i, l.id, n.capacity, o);
      if (typeof v == "string") throw new j(v, "refused", l.id);
      if (v) return I(v, O(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const S = c ? "token" : p ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, I(J(i, t, l.id), c ? "Removed the limit at " + O(l.label) + "." : O(l.label) + " now holds any number of " + S + "s.", { laneId: l.id });
      const A = p ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > A)
        throw new j((c ? "A step" : "A lane") + " can hold from 1 to " + A + " " + S + "s.", "refused", l.id);
      const E = p ? i.cards.reduce((R, W) => R + (W.laneId === l.id ? W.points ?? 1 : 0), 0) : $(l.id);
      if (E > n.capacity)
        throw new j(O(l.label) + " already holds " + E + " " + S + (E === 1 ? "" : "s") + ". Move some " + (c ? "on" : "out") + " first, or choose a higher " + (p ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, I(J(i, t, l.id), O(l.label) + " now holds up to " + n.capacity + " " + S + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = b(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, I(J(i, t, l.laneId, l.id), O(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const v = [...new Set(n.lanes.map((A) => x(A)))], S = i.lanes.find((A) => A.id === l.laneId);
      if (!v.includes(S)) throw new j(O(l.label) + " is in " + O(S.label) + " now. Include " + O(S.label) + ", or move the card first.", "refused", S.id, l.id);
      return l.allowedLaneIds = v.map((A) => A.id), I(J(i, t, l.laneId, l.id), O(l.label) + " can now go only in " + Qe(v.map((A) => O(A.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = b(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new j("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, I(J(i, t, l.laneId, l.id), O(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = b(n.card), v = [...new Set(n.dependsOn.map((A) => b(A)))], S = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const A = v.filter((E) => l.dependsOn?.includes(E.id));
        if (!A.length) throw new j(O(l.label) + " does not depend on " + Qe(v.map((E) => O(E.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter((E) => !A.some((R) => R.id === E)), l.dependsOn.length || delete l.dependsOn, I(J(i, t, l.laneId, l.id), O(l.label) + " no longer depends on " + Qe(A.map((E) => O(E.label))) + ".", S);
      }
      if (!v.length) {
        if (n.mode === "add") throw new j("Name the features " + O(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, I(J(i, t, l.laneId, l.id), O(l.label) + " no longer depends on anything.", S);
      }
      if (v.includes(l)) throw new j("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...v.map((A) => A.id)])], I(J(i, t, l.laneId, l.id), O(l.label) + " now depends on " + Qe(v.map((A) => O(A.label))) + ".", S);
    }
    case "set_outcome": {
      const l = b(n.card), v = x(n.lane), S = i.signals ?? (i.signals = []), A = n.label, E = A === void 0 ? S.filter((M) => M.cardId === l.id && M.laneId === v.id) : S.filter((M) => M.cardId === l.id && M.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && E.length > 1) throw new j("Two outcomes on this card have that name.", "refused", v.id, l.id);
      if (!E.length && S.length >= 24) throw new j("A workshop can have up to 24 outcomes. Remove one first.", "refused", v.id, l.id);
      let R = 1;
      for (; S.some((M) => M.id === "signal-" + R); ) R++;
      const B = { label: A ?? E[0]?.label ?? (l.label + " in " + v.label).slice(0, 80).trim(), cardId: l.id, laneId: v.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return E.length ? Object.assign(E[0], B) : S.push({ id: "signal-" + R, ...B }), I(J(i, t, v.id, l.id), "When " + O(l.label) + " is in " + O(v.label) + " the workshop says " + O(n.whenPresent) + ". Otherwise it says " + O(n.whenAbsent) + ".", { laneId: v.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = b(n.card), v = (i.signals ?? []).filter((S) => S.cardId === l.id);
      if (n.outcome === void 0) {
        if (!v.length) throw new j(O(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        rt(i, (S) => S.cardId === l.id);
      } else {
        const S = y(v, Yt(v, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        rt(i, (A) => A.id === S.id);
      }
      return I(J(i, t, l.laneId, l.id), "Removed the outcome from " + O(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((v) => x(v));
      if (l.length !== i.lanes.length || new Set(l).size !== i.lanes.length) throw new j("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = l.map((v) => v.id), I(J(i, t), _(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new j("Say before or after, not both.", "invalid_edit");
      const l = x(n.lane), v = n.before ?? n.after, S = v === void 0 ? void 0 : x(v);
      if (S && S.id === l.id) throw new j("Choose two different scenes.", "refused", l.id);
      const A = yo(i).filter((E) => E.id !== l.id);
      return A.splice(S ? A.findIndex((E) => E.id === S.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), i.presentationOrder = A.map((E) => E.id), I(J(i, t, l.id), _(A), { laneId: l.id });
    }
    case "add_station": {
      const l = x(n.from);
      let v;
      try {
        v = wr(i, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new j(A.message, "refused", l.id);
      }
      const S = v.lanes[v.lanes.length - 1];
      return I(v, "Added a path from " + O(l.label) + " to " + O(S.label) + ".", { laneId: S.id });
    }
    case "insert_station": {
      const l = x(n.before), v = n.from === void 0 ? void 0 : x(n.from), S = v ? [v] : i.lanes.filter((R) => R.station.next.includes(l.id));
      if (v && !v.station.next.includes(l.id))
        throw new j("There is no path from " + O(v.label) + " to " + O(l.label) + ". Try “Add " + n.label + " after " + v.label + "”.", "refused", v.id);
      if (!S.length) throw new j("Nothing leads to " + O(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let A;
      try {
        A = wr(i, S[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (R) {
        throw new j(R.message, "refused", l.id);
      }
      const E = A.lanes[A.lanes.length - 1];
      for (const R of A.lanes)
        S.some((W) => W.id === R.id) && (R.station.next = [...new Set(R.station.next.map((W) => W === l.id ? E.id : W))]);
      return E.station.next = [l.id], I(J(A, t, E.id), "Added " + O(E.label) + " before " + O(l.label) + ".", { laneId: E.id });
    }
    case "connect_stations": {
      const l = x(n.from), v = x(n.to);
      if (l.id === v.id) throw new j("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(v.id) ? I(i, O(l.label) + " already leads to " + O(v.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(v.id), I(J(i, t, l.id), "Connected " + O(l.label) + " to " + O(v.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = x(n.from), v = x(n.to);
      if (!l.station.next.includes(v.id)) throw new j("There is no path between " + O(l.label) + " and " + O(v.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((S) => S !== v.id), I(J(i, t, l.id), "Removed the path from " + O(l.label) + " to " + O(v.label) + ".", { laneId: l.id });
    }
    case "set_station_outcome": {
      const l = x(n.station);
      return l.station.outcome = n.outcome, I(J(i, t, l.id), "Changed what happens at " + O(l.label) + ".", { laneId: l.id });
    }
    case "set_station_position": {
      const l = x(n.station);
      return Object.assign(l.station, { column: n.column, row: n.row }), I(J(i, t, l.id), "Moved " + O(l.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: l.id });
    }
    case "set_station_image": {
      const l = x(n.station);
      return n.image === null ? (delete l.station.image, I(J(i, t, l.id), "Removed the image at " + O(l.label) + ".", { laneId: l.id })) : (l.station.image = { src: n.image.src, alt: n.image.alt }, I(J(i, t, l.id), "Updated the image at " + O(l.label) + ".", { laneId: l.id }));
    }
    case "set_station_image_alt": {
      const l = x(n.station);
      if (!l.station.image) throw new j("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, I(J(i, t, l.id), "Updated the image description at " + O(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = b(n.card);
      let v = l.id, S, A;
      if (n.kind === "connect_cards") {
        const M = b(n.to, l.laneId);
        if (M.id === l.id) throw new j("A line joins two different cards.", "refused", l.laneId, l.id);
        S = M.id, A = O(M.label);
      } else {
        const M = n.note.trim();
        if (i.cards.some((z) => z.id === M) || i.lanes.some((z) => z.id === M))
          throw new j("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        S = M, A = "the note " + M, n.direction === "from_note" && ([v, S] = [S, v]);
      }
      const E = Vr(i, v, S, n.label ? { label: n.label } : {}), R = Bn(i, E);
      if (R) throw new j(R, "refused", l.laneId, l.id);
      const W = ut(i, E), B = v === l.id;
      return I(
        W,
        B ? "Drew a line from " + O(l.label) + " to " + A + "." : "Drew a line from " + A + " to " + O(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = b(n.card), v = n.kind === "disconnect_cards" ? b(n.to, l.laneId).id : n.note.trim(), S = n.kind === "disconnect_cards" ? O(i.cards.find((R) => R.id === v).label) : "the note " + v, A = (R) => R.parentId === l.id && R.childId === v || R.parentId === v && R.childId === l.id, E = i.lines ?? [];
      return E.some(A) ? (i.lines = E.filter((R) => !A(R)), I(J(i, t, l.laneId, l.id), "Took away the line between " + O(l.label) + " and " + S + ".", { laneId: l.laneId, cardId: l.id })) : I(e, O(l.label) + " and " + S + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new j("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function U(l, v) {
    const S = { laneId: v.id, cardId: l.id };
    if (l.laneId === v.id)
      return I(e, O(l.label) + " is already " + (c ? "at " : "in ") + O(v.label) + ".", S, !1);
    const A = Dn(e, l.id, v.id);
    if (!A) throw new j(jn(e, l.id, v.id) ?? "That move is not available.", "refused", v.id, l.id);
    return I(J(A, t, v.id, l.id), "Moved " + O(l.label) + " to " + O(v.label) + ".", S);
  }
}
function Qo(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new j(r === "amount" ? F.notAmounts : F.notTasks, "not_on_this_board", t);
}
function rt(e, n) {
  e.signals && (e.signals = e.signals.filter((t) => !n(t)), e.signals.length || delete e.signals);
}
function Ve(e, n, t = {}) {
  const r = (y) => ({ refused: { index: 0, kind: null, laneId: null, ...y } });
  let o;
  try {
    o = X(e);
  } catch (y) {
    return r({ reason: "The workshop cannot be read: " + (y instanceof Error ? y.message : String(y)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return r({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = o, c = [], p = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [y, x] of n.entries()) {
    const b = x?.kind, L = Vt.find((v) => v.kind === b);
    if (!x || typeof x != "object" || !L)
      return r({
        index: y,
        kind: typeof b == "string" ? b : null,
        code: "invalid_edit",
        reason: "There is no edit called " + O(String(b)) + ". The edits are " + Qe(Vt.map((v) => v.kind)) + "."
      });
    const I = Bi(x, L);
    if (I) return r({ index: y, kind: L.kind, code: "invalid_edit", reason: I });
    const $ = ht(o);
    if (!L.boards.includes($))
      return r({ index: y, kind: L.kind, code: "not_on_this_board", reason: L.refusals[$] ?? "This workshop does not take " + L.kind + "." });
    let _;
    try {
      _ = Hi(o, x, $, t.selection, p);
    } catch (v) {
      if (!(v instanceof j)) throw v;
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
    const U = o.behaviour && !Wi(L.kind) ? ke().check(o, _.board) : null;
    if (U && "refused" in U)
      return r({ index: y, kind: L.kind, reason: U.refused.sentence, code: "refused", laneId: U.refused.laneId, cardId: U.refused.cardId });
    const l = Ui(o, _.board);
    if (l) return r({ index: y, kind: L.kind, reason: l, code: "not_on_this_board", laneId: _.laneId ?? null });
    o = _.board, c.push({
      index: y,
      kind: L.kind,
      said: _.said,
      changed: _.changed ?? !0,
      ..._.laneId && { laneId: _.laneId },
      ..._.cardId && { cardId: _.cardId }
    });
  }
  const h = new Map(i.cards.map((y) => [y.id, y.laneId])), C = o.cards.flatMap((y) => {
    const x = h.get(y.id);
    return x === void 0 || x === y.laneId ? [] : [{ cardId: y.id, fromLaneId: x, toLaneId: y.laneId }];
  });
  return { workshop: o, report: { edits: c, movedCards: C } };
}
function zi(e, n) {
  const t = ie(e);
  if (t === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const r = e.lanes.find((o) => {
      const i = n.lanes.find((c) => c.id === o.id);
      return o.role !== i.role || o.probability !== i.probability;
    });
    if (r) return `${r.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (t === "budget") {
    const r = e.budget, o = n.budget;
    if (!o || r.currency !== o.currency || r.step !== o.step) return "A budget keeps its currency and its step.";
    const i = ve(t).fixed?.(e, n);
    if (i) return i;
    const c = e.lanes.find((p) => {
      const h = n.lanes.find((C) => C.id === p.id);
      return p.floor !== h.floor || p.cap !== h.cap || p.capacity !== h.capacity;
    });
    if (c) return `${c.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? F.launchLanes : t && ve(t).fixed?.(e, n) || null;
}
const Gi = {
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
function Ui(e, n) {
  const t = X(e), r = ht(t);
  let o;
  try {
    o = X(n);
  } catch (h) {
    return pt(h instanceof Error ? h.message : String(h), r);
  }
  const i = ht(o), c = (h, C) => h.lanes.length === C.lanes.length && h.lanes.every((y) => C.lanes.some((x) => x.id === y.id)), p = (h, C) => h.lanes.every((y, x) => C.lanes[x]?.id === y.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return c(t, o) ? F.keepsCards : F.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !p(t, o)) return F.keepsOrder;
  if (ie(t) && i === r && !(c(t, o) && p(t, o))) return Zt[r];
  if (ie(t) && i === r) {
    const h = zi(t, o);
    if (h) return h;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!c(t, o)) return F.releaseLanes;
    if (!p(t, o)) return F.releaseOrder;
    if (o.cards.some((h) => !t.cards.some((C) => C.id === h.id))) return F.releaseCards;
  }
  return r !== i ? "This board is a " + Gi[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? ke().replacement(t, o) : null;
}
const ia = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function sa(e) {
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
    const c = /* @__PURE__ */ new Set([i.id]);
    let p = i.after;
    for (; p !== null; ) {
      if (c.has(p) || !r.has(p) || o.includes(i.id) && !o.includes(p)) return null;
      c.add(p), p = r.get(p).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: t, hung: o };
}
function Ki(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function aa(e, n) {
  return Ki(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Ar = ["firstPrint", "secondPrint", "thirdPrint"], Sr = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function la(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Sr, route: n.route };
  for (const r of Ar) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function da(e = new URLSearchParams()) {
  const n = { ...Sr };
  for (const r of Ar) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function ca(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function qi(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Zi(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), Yi(n), n;
}
function Ji(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function Yi(e) {
  return e && Ji(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Ht(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function _n(e) {
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
function Zi(e) {
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
function it() {
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
}, Vi = "var(--slatebox-board-font, system-ui, sans-serif)", Xt = "http://www.w3.org/2000/svg", er = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function Me(e, n, t) {
  const r = document.createElementNS(Xt, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", er(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", er(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function pn(e, n, t, r, o) {
  const i = typeof document < "u" ? document.activeElement : null, c = i && e.contains(i) ? i.getAttribute("data-board-link") : null;
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
      C.style.setProperty("font-family", Vi), h.lines && h.lines.length > 1 ? h.lines.forEach((y, x) => {
        const b = Me("tspan", { x: h.x, dy: x ? h.lineHeight ?? Math.round((h.size ?? 13) * 1.25) : 0 });
        b.textContent = x < h.lines.length - 1 ? y + " " : y, C.appendChild(b);
      }) : C.textContent = h.text, e.appendChild(C);
    } else {
      if (h.unlink && t) {
        const { cardId: C, waitsOn: y, label: x } = h.unlink, b = y + ">" + C, L = r?.armed === b, I = Me("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": b,
          "aria-label": L ? x + ". " + (h.unlink.armed ?? "Tap again to remove it") + "." : x,
          role: "button",
          tabindex: 0,
          ...L ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: L ? hn.refuse : "transparent" });
        let $ = !1;
        I.addEventListener("pointerdown", (_) => {
          _.stopPropagation(), $ = _.pointerType === "touch" || _.pointerType === "pen";
        }), I.addEventListener("click", (_) => {
          if (_.stopPropagation(), $ && r && r.armed !== b) {
            r.arm(b);
            return;
          }
          r?.arm(null), t(C, y);
        }), I.addEventListener("keydown", (_) => {
          _.key !== "Enter" && _.key !== " " || (_.preventDefault(), _.stopPropagation(), t(C, y));
        }), I.addEventListener("focus", () => {
          I.style.setProperty("stroke", hn.accept), I.setAttribute("opacity", "0.35");
        }), I.addEventListener("blur", () => {
          L || (I.style.setProperty("stroke", "transparent"), I.removeAttribute("opacity"));
        }), e.appendChild(I), p.push(I);
      } else if (h.pick && o) {
        const { key: C, label: y } = h.pick, x = Me("path", {
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
        x.addEventListener("pointerdown", (b) => b.stopPropagation()), x.addEventListener("click", (b) => {
          b.stopPropagation(), o(C);
        }), x.addEventListener("keydown", (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), b.stopPropagation(), o(C));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", hn.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity");
        }), e.appendChild(x), p.push(x);
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
        const { x: C, y, angle: x } = h.arrow;
        e.appendChild(Me("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${y}) rotate(${x})`, "pointer-events": "none" }, { fill: h.color }));
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
  c && p.find((h) => h.getAttribute("data-board-link") === c)?.focus({ preventScroll: !0 });
}
function Xi(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(Xt, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(Xt, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let i = !1, c = null, p;
  const h = {
    armed: null,
    arm(y) {
      clearTimeout(p), h.armed = y, y && (p = setTimeout(() => h.arm(null), 5e3), c?.[2].announce?.(c[2].boardFocused && c[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), c && C.draw(...c);
    }
  }, C = {
    draw(y, x, b) {
      if (i || !t) return;
      c = [y, x, b];
      const { origin: L } = b, I = n(x ?? y, b, y), $ = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o])
        l.setAttribute("transform", `translate(${L.x} ${L.y})`), l.toggleAttribute("data-workshop-focused", !!b.boardFocused);
      pn(r, I.filter((l) => !$(l)), b.onUnlink, h, b.onPick), pn(o, I.filter($));
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
}, st = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, Qi = (e) => e.replace(/\.$/, ""), es = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function mo(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return ns(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, c = (p) => n.push(i ? { ...p, warn: i } : p);
    if (o.kind === "bin" && o.lane) c({ icon: "bin", text: st(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) c({ icon: "gate", text: st(e, o.into) + " needs " + (o.needs ?? []).map((p) => es[p] ?? p).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) c({ icon: "step", text: "One column at a time", seams: t.slice(1).map((p, h) => [t[h], p]) });
      else {
        const p = o.from, h = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(p)) === 1).map((C) => [p, C]);
        c({ icon: "oneway", text: st(e, p) + " → " + o.to.map((C) => st(e, C)).join(" or ") + " only", seams: h });
      }
  }
  return n;
}
function ns(e) {
  if (!Ei()) return [];
  let n;
  try {
    n = ke().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = Qi(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, c = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: c, text: ts(o), ...i && { warn: i } });
  }
  return t;
}
function ts(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const dt = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Cr(e, n, t, r, o = 12) {
  const i = o / 12, c = (h) => h.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, y, x) => `A${+y * i} ${+x * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, y, x) => `${+(n + +y * i).toFixed(1)},${+(t + +x * i).toFixed(1)}`), p = (h, C = 1.6) => ({ t: "path", d: c(h), color: r, width: C * i });
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
const wo = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function mt(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + dt(e.text, 13 * n, t) + 10 * n);
}
function at(e, n, t, r, o = {}) {
  const i = 24 * r, c = 10 * r, p = t.icon ? 17 * r : 0, h = mt(t, r, o.bold), C = o.ink ?? he.chipInk, y = [{
    t: "path",
    d: wo(e, n, h, i, i / 2),
    color: t.warn ? he.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? he.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && y.push(...Cr(t.icon, e + c, n + 6 * r, C, 12 * r)), y.push({ t: "text", x: e + c + p, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), y;
}
function nr(e, n, t, r) {
  return [
    { t: "path", d: wo(n - 11, t - 11, 22, 22, 11), color: he.badgeLine, width: 1, fill: he.badge, role: r },
    ...Cr(e, n - 6, t - 6, he.badgeInk)
  ];
}
const os = "Preview · not added yet", Lr = 6, rs = 2.5, $r = (e) => Math.round(Math.min(Lr, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, Qt = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function Tr(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(Lr, Math.max(1, t.scale ?? 1)), c = i > rs ? [] : mo(e), p = 18 * i, h = 30 * i, C = (R, W) => {
    const B = (t.narrow && W <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (dt(R, 18 * W, !0) <= B) return R;
    const M = Math.max(3, Math.floor(B / (18 * W * 0.58)) - 1);
    return R.slice(0, M).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, y = C(e.title, i), x = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), b = [], L = [2 + dt(C(e.title, 1), 18, !0) + 14];
  t.narrow && c.length && (L[0] = 1 / 0, L.push(2));
  for (const R of c) {
    const W = mt(R, 1);
    let B = L.findIndex((M) => M + W <= x);
    B < 0 && (L.push(2), B = L.length - 1), b.push({ x: L[B], row: B, item: R, width: W }), L[B] += W + 6;
  }
  const I = b.map((R) => ({ x: r + Math.round(R.x * i), row: R.row, item: R.item, width: mt(R.item, i) })), $ = Math.max(1, ...I.map((R) => R.row + 1)), _ = o - 14 * i - $ * h, U = !!(t.focused || t.draft), l = t.narrow ? 8 : 16, v = U ? { x: r - l, y: _ - 18 * i, width: n.width + 2 * l, height: o + n.height + l - (_ - 18 * i) } : null, S = Math.max(i, t.tagScale ?? i), A = v ? v.y - 12 * S : _, E = r + 2 + dt(y, p, !0);
  return { k: i, tagK: S, legend: c, placed: I, rows: $, title: y, titleY: _, titleSize: p, titleRight: E, rowH: h, frame: v, top: A };
}
function Pr(e, n, t = {}) {
  const r = Tr(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((y) => y.x + y.width)), c = o ? o.x : 0, p = r.top, h = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: c, y: p, width: h - c, height: C - p };
}
function tr(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: c, titleY: p, titleSize: h, rowH: C, frame: y } = Tr(e, n, t), x = n.x ?? 0, b = [];
  if (y) {
    const L = wo(y.x, y.y, y.width, y.height, 18);
    t.focused && b.push({ t: "path", d: L, color: he.focus, width: 12, strokeOpacity: 0.1, fill: he.focusTint, role: "focus-glow" }), b.push({
      t: "path",
      d: L,
      color: t.focused ? he.focus : he.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  b.push({ t: "text", x: x + 2, y: p + 19 * r, text: c, color: he.title, size: h, bold: !0, role: "board-title" });
  for (const L of i) b.push(...at(L.x, p + L.row * C + 2 * r, L.item, r));
  if (y) {
    const L = y.y - 12 * o;
    if (t.focused) {
      const I = { text: "Editing" };
      b.push(...at(y.x + 18, L, I, o, { fill: he.focus, ink: he.focusInk, bold: !0, role: "focus-tag" })), b.push(...at(
        y.x + 18 + mt(I, o, !0) + 6 * o,
        L,
        { text: "Done" },
        o,
        { fill: he.halo, ink: he.focus, line: he.focus, bold: !0, role: "focus-done" }
      ));
    } else
      b.push(...at(y.x + 18, L, { text: os }, o, { fill: he.previewFill, ink: he.previewInk, bold: !0, role: "draft-tag" }));
  }
  return b;
}
function or(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((c) => c.laneId === i);
  for (const i of mo(e)) {
    const c = i.lane ? o(i.lane) : void 0;
    c && r.push(...nr(i.icon, c.x + c.width - 22, c.y + 18, "badge-" + i.lane));
    for (const [p, h] of i.seams ?? []) {
      const C = o(p), y = o(h);
      !C || !y || C.row !== y.row || r.push(...nr(i.icon, (C.x + C.width + y.x) / 2, C.y + 35, "seam-" + p + ">" + h));
    }
  }
  return r;
}
function is(e) {
  const n = mo(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const ua = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, rr = "http://www.w3.org/2000/svg";
function ir(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function ss(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(rr, "g") : null, r = typeof document < "u" ? document.createElementNS(rr, "g") : null;
  for (const y of [t, r])
    y?.setAttribute("data-board-chrome", ""), y?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const c = (y) => ({ layout: y.layout, focused: y.focused, draft: y.draft, scale: y.scale, tagScale: y.tagScale, narrow: y.narrow, places: y.places, room: y.room }), p = (y, x) => {
    const b = Pr(y.board, y.size, x);
    return { x: y.origin.x + b.x, y: y.origin.y + b.y, width: b.width, height: b.height };
  }, h = (y) => ({ ...c(y), focused: !1, draft: !1, scale: 1, tagScale: 1 }), C = {
    get scope() {
      return i?.scope ?? "main";
    },
    get draft() {
      return !!i?.draft;
    },
    box(y) {
      if (!i) return null;
      const x = $r(y);
      return p(i, { ...c(i), scale: x, tagScale: Qt(y, !!(i.narrow && !i.draft), x) });
    },
    plainBox() {
      return i ? p(i, h(i)) : null;
    },
    paintPlain(y, x) {
      if (!i) return;
      const b = h(i);
      y.removeAttribute("data-workshop-focused"), pn(y, tr(i.board, { width: i.size.width, height: i.size.height }, b)), x && (x.removeAttribute("data-workshop-focused"), pn(x, or(i.board, b)));
    }
  };
  return ir(e).add(C), {
    draw(y) {
      if (o || !n || !t || !r) return;
      i = y;
      const x = c(y);
      for (const I of [t, r])
        I.setAttribute("transform", `translate(${y.origin.x} ${y.origin.y})`), I.toggleAttribute("data-workshop-focused", !!y.focused), I.toggleAttribute("data-workshop-draft", !!y.draft), I.setAttribute("data-board-scope", y.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", is(y.board)), pn(t, tr(y.board, { width: y.size.width, height: y.size.height }, x)), pn(r, or(y.board, x));
      const b = t.querySelector('[data-board-layer="focus-done-box"]');
      if (b && y.onDone) {
        const I = y.onDone;
        b.setAttribute("role", "button"), b.setAttribute("tabindex", "0"), b.setAttribute("aria-label", "Done changing " + y.board.title), b.setAttribute("pointer-events", "all"), b.setAttribute("cursor", "pointer"), b.addEventListener("pointerdown", ($) => $.stopPropagation()), b.addEventListener("click", ($) => {
          $.stopPropagation(), I();
        }), b.addEventListener("keydown", ($) => {
          const _ = $.key;
          _ !== "Enter" && _ !== " " || ($.preventDefault(), $.stopPropagation(), I());
        });
      }
      const L = y.under && y.under.parentNode === n ? y.under : null;
      L ? t.nextSibling !== L && n.insertBefore(t, L) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, ir(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const eo = "handle-_link-", no = "handle-_route-", Hn = 40, Or = 44;
function zt(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(Hn, Math.ceil(Or / n)));
}
function Er(e) {
  if (e.startsWith(eo)) return { kind: "link", from: e.slice(eo.length) };
  if (e.startsWith(no)) {
    const [n, t] = e.slice(no.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const Mr = (e) => !!e.lanes[0]?.station, je = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function go(e) {
  const { places: n } = _e(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function sr(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, c = n.y - o, p = i ? e.width / 2 / Math.abs(i) : 1 / 0, h = c ? e.height / 2 / Math.abs(c) : 1 / 0, C = Math.min(p, h), y = Math.hypot(i, c) || 1;
  return { x: r + i * C + i / y * t, y: o + c * C + c / y * t };
}
function Nr(e) {
  if (!Mr(e)) return [];
  const n = go(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const c = n.get(i);
        if (!c) continue;
        const p = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, h = { x: c.x + c.width / 2, y: c.y + c.height / 2 }, C = sr(o, h, -8), y = sr(c, p, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: y.x, y2: y.y });
      }
  }
  return t;
}
function as(e, n) {
  for (const [t, r] of go(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function _r(e, n, t = Hn) {
  if (!Mr(e)) return [];
  const r = go(e), o = t / Hn, i = (p, h, C, y, x) => ({ options: {
    id: p,
    name: y,
    text: x ? "+" : "",
    xPos: n.x + h - t / 2,
    yPos: n.y + C - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: wn(t, t, t / 2),
    backgroundColor: x ? "#2f5fd0" : "#fffef8",
    foregroundColor: x ? "#ffffff" : "#2f5fd0",
    borderColor: x ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), c = [];
  for (const p of e.lanes) {
    const h = r.get(p.id);
    h && c.push(i(eo + p.id, h.x + h.width, h.y + h.height, "Draw a path from " + p.label, !0));
  }
  for (const p of Nr(e))
    c.push(i(no + p.from + "~" + p.to, p.x2, p.y2, "End of the path from " + je(e, p.from) + " to " + je(e, p.to), !1));
  return c;
}
function ls(e, n) {
  const t = Er(n);
  return t ? t.kind === "link" ? `Draw a path from ${je(e, t.from)}: drag it onto another step.` : `End of the path from ${je(e, t.from)} to ${je(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function ds(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((c) => c.id === n.from);
  if (!r?.station || !e.lanes.some((c) => c.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${je(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((c) => c !== n.to) : r.station.next, i = e.lanes.map((c) => c.id === r.id ? { ...c, station: { ...c.station, next: [...o, t] } } : c);
  return { next: { ...e, lanes: i } };
}
function cs(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((p) => p.id === o.id)?.station?.next ?? [], c = o.station?.next ?? [];
    for (const p of i) c.includes(p) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: p } });
    for (const p of c) i.includes(p) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: p } });
  }
  return [...t, ...r];
}
function us(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? Hn, i = Math.max(24, o * Or / Hn);
  for (const c of Nr(e)) {
    const p = je(e, c.from) + " to " + je(e, c.to), h = `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`, C = !r && n.picked === c.key;
    t.push(r ? { t: "path", d: h, color: "transparent", width: 3, hit: i, unlink: { cardId: c.to, waitsOn: c.from, label: "Remove the path from " + p, armed: "Tap again to remove this path" } } : { t: "path", d: h, color: C ? hn.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: c.key, label: "Path from " + p + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const c = _r(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, p = c ? c.xPos + o + 6 : 0, h = c ? c.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: p, y: h, text: n.clamp.text, color: hn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
const ar = "#1f7a5c", lr = "#5b9a85", Gt = "#c2410c", fs = "#a8761b", hs = {
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
}, ps = { canMove: !1, canSelect: !1 }, Ut = "A card's line joins notes and cards on its own board.", Rn = /* @__PURE__ */ new WeakMap();
function ms(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function fa(e, n, t = {}) {
  const r = Kn(t.scope);
  let o = X(n);
  const i = t.kit, c = (s) => !!ie(s) && !i;
  if (c(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const p = i?.layer(e) ?? (o.lanes[0]?.station ? Xi(e, us) : void 0), h = t.chrome === !1 ? null : ss(e);
  let C = 1, y = 1, x = null, b = null, L = /* @__PURE__ */ new Set(), I = null, $ = null;
  const _ = !!t.draft, U = !!t.still;
  let l = !!t.readOnly || _ || U, v = l || c(o), S = !1;
  const A = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
  let M = null, z = null, se = null, ee = null;
  const ye = /* @__PURE__ */ new Map(), vn = /* @__PURE__ */ new Map(), on = /* @__PURE__ */ new Map();
  let te = null, pe = null;
  function ze(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, S || D($ ?? o);
    }, 3e3) };
  }
  let re = Promise.resolve(), Ge = null, ue = dr(t.layout), xe = ue;
  const At = { ...t.style };
  let Se = /* @__PURE__ */ new Map(), St = /* @__PURE__ */ new Set(), Io = null, Ce = !1, xn = zt(1), qn = null, In = null, Ue = null, Jn = !1;
  const we = /* @__PURE__ */ new Map();
  Re(o);
  const q = t.origin ? { x: t.origin.x, y: t.origin.y } : gs(e), Yn = r ? r + ":" : "", be = (s) => B.get(s) ?? (Yn ? s.startsWith(Yn) ? s.slice(Yn.length) : null : s), me = (s) => {
    const a = be(s);
    return a === null ? null : ms(a);
  };
  function ae(s) {
    const a = W.get(s);
    if (a) return a;
    const d = Yn + s;
    if (A.has(d) && !B.has(d) || !e.nodes.one?.(d)) return d;
    const f = ti(d, (m) => !!e.nodes.one?.(m) || B.has(m));
    return W.set(s, f), B.set(f, s), console.warn(`WORKSHOP: the slate already has a note named "${d}". It stays the slate's own; the workshop draws its note as "${f}".`), f;
  }
  function An(s, a = 1) {
    let d = [];
    try {
      d = t.avoid?.() ?? [];
    } catch (f) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", f);
    }
    return d.length ? Hs(s, d, a) : { x: s.x, y: s.y };
  }
  function ri(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (u) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", u);
    }
    const { width: d, height: f } = i ? i.places(o, ue) : Re(o);
    let m = 1 / 0;
    for (const u of a)
      [u.x, u.y, u.width, u.height].every(Number.isFinite) && u.x >= q.x + d && u.y < q.y + f && u.y + u.height > q.y && (m = Math.min(m, u.x - 32 - q.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function ii(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (d) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", d);
    }
    return a.some((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite) && s.x < d.x + d.width && s.x + s.width > d.x && s.y < d.y + d.height && s.y + s.height > d.y);
  }
  function si(s, a) {
    const d = [...Rn.get(e) ?? []].filter((g) => g !== Lt);
    if (!d.length) return null;
    const { id: f, note: m } = Wo(s, a), u = { id: f, options: m }, w = Jt(o, s).some((g) => o.cards.some((k) => k.id !== s && (k.id === g.parentId || k.id === g.childId)));
    for (const g of d) {
      let k = null;
      try {
        k = g.verdict(u, a);
      } catch (P) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", P);
      }
      if (k) return { board: g, ...k, reason: w ? Ut : k.reason };
    }
    return null;
  }
  function ai(s, a, d, f) {
    const { added: m, answer: u } = Xn(a, d, "", !0), w = An(d), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let k;
      try {
        k = s.take(m, f, w);
      } catch (N) {
        console.warn("WORKSHOP: another board could not take the card", N);
      }
      if (k === "taken") return;
      const P = Math.round(w.x), T = Math.round(w.y);
      m.position?.(P, T, () => e.updateSelectionResizeRotate?.(), void 0, it() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Ht({ ...m.options, x: P, y: T })] });
    };
    !u || typeof u.then != "function" ? g() : u.then((k) => {
      k === !0 && !S && g();
    }, () => {
    });
  }
  const Le = {
    governs(s) {
      if (A.get(s.id) !== s) return null;
      const a = me(s.id)?.kind;
      return a === "card" ? { canMove: !v, canEditText: !v && !$ && o.kind !== "release-plan", canConnect: Tn() } : a === "lane" ? { canMove: !1, canEditText: !v && !$ } : a === "handle" ? { canMove: !v && !$, canEditText: !1, ...!ue.narrow && { cursor: i ? "ew-resize" : "grab" } } : ps;
    },
    onStart(s, a) {
      const d = me(s.id), f = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const w = v || $ ? null : i ? i.handleDrag(o, be(s.id), f, ue) : $i(be(s.id));
        return w ? (le(), qe(), pe && (clearTimeout(pe.timer), pe = null), I = { name: be(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = d.key;
      if (v || $ || !o.cards.some((w) => w.id === m)) return !1;
      le(), qe();
      let u = null;
      try {
        u = (i?.chooser ?? t.chooseCandidate)?.(o, m, f, ue) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return M = { cardId: m, evaluate: u, grab: f, outcome: { kind: "home" } }, D(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (I) {
        I.last = I.follow(Ye(a)), D(I.last.next, { grip: I.name, layout: ri(I.last.layout) }), G(t.onPreview, I.last.next === o ? null : I.last.next);
        return;
      }
      if (!M) return;
      const d = $o(M.cardId, a, M.evaluate);
      if (ws(d, M.outcome)) return;
      M.outcome = d;
      const f = d.kind === "candidate" ? d.next : null;
      D(f ?? o, { skip: M.cardId }), G(t.onPreview, f);
    },
    onEnd(s, a) {
      if (I) {
        const { follow: w, name: g } = I, k = w(Ye(a));
        I = null, G(t.onPreview, null), k.refusal ? (ze(g, k.refusal), D(o), e.announce?.(k.refusal), G(t.onRefuse, { laneId: null, reason: k.refusal })) : et(k.next, {}) || D(o);
        const P = Ft(o, be(s.id));
        return P ? { accept: !0, settle: P } : { accept: !1 };
      }
      if (!M) return { accept: !1 };
      const { cardId: d, evaluate: f } = M, m = $o(d, a, f), u = o.cards.find((w) => w.id === d);
      if (M = null, G(t.onPreview, null), m.kind === "candidate" && i) {
        if (!et(m.next, { cardId: d, laneId: m.laneId }, d))
          return D(o, { skip: d }), { accept: !1 };
        m.said && (ze("card-" + d, m.said), e.announce?.(m.said));
        const w = Ft(o, be(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, D(o, { skip: d });
        const w = o.lanes.find((k) => k.id === m.laneId);
        e.announce?.(`${Z(u)} moved to ${w.label}. ${Fe(o, w.id)}.`), G(t.onChange, o, { cardId: d, laneId: m.laneId });
        const g = Ft(o, be(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused")
        Ii(Z(u), { cardId: d, laneId: m.laneId, reason: m.reason }), m.near && ze("card-" + d, m.reason);
      else if (m.kind === "outside" && qt() && !sn()) {
        const w = ct(o, d);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, k = si(d, a);
          if (k?.reason)
            return D(o, { skip: d }), k.board.flash(k.laneId, k.reason), e.announce?.(`${Z(u)} can't go in ${k.laneLabel}. ${k.reason} It stays where it was.`), G(t.onRefuse, { cardId: d, laneId: null, reason: k.reason }), { accept: !1 };
          if (k)
            return ai(k.board, d, g, a), { accept: !0 };
          const P = ii(g);
          return Xn(d, P ? An(g) : g, P ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        D(o, { skip: d }), e.announce?.(w), G(t.onRefuse, { cardId: d, laneId: null, reason: w });
      } else
        D(o, { skip: d }), m.kind === "outside" && (e.announce?.(`${Z(u)} was not dropped on a lane. It stays where it was.`), G(t.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (I) {
        I = null, G(t.onPreview, null), D(o);
        return;
      }
      const a = M && o.cards.find((d) => d.id === M.cardId);
      M = null, G(t.onPreview, null), D(o, { skip: me(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Z(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const f = me(s.id);
      if (!f || v || $) return !1;
      let m = a.replace(/\s+/g, " ").trim();
      const u = [], w = ie(o), g = w && f.kind === "card" ? ve(w).renamed(o, f.key, m) : null;
      g && (m = g.label, u.push(...g.edits));
      const k = f.kind === "lane" ? { laneId: f.key, label: m } : { cardId: f.key, label: m };
      u.unshift(f.kind === "lane" ? { kind: "rename_lane", lane: { id: f.key }, label: m } : { kind: "rename_card", card: { id: f.key }, label: m });
      const P = Ve(o, u);
      if ("refused" in P) {
        const { reason: T } = P.refused;
        return e.announce?.(`${d} keeps its name. ${T}`), G(t.onRefuse, { ...f.kind === "lane" ? { laneId: f.key } : { cardId: f.key }, rename: k, reason: T }), !1;
      }
      return JSON.stringify(P.workshop) === JSON.stringify(o) ? (D(o), !1) : (e.beginHostStep?.(), o = P.workshop, f.kind === "card" && vn.set(f.key, m), e.endHostStep?.(), D(o), e.announce?.(g ? P.report.edits.map((T) => T.said).join(" ") : `${d} renamed to ${m}.`), G(t.onChange, o, { rename: k, ...i ? { edits: u } : {} }), g ? !1 : m);
    },
    onKeyDown(s, a) {
      const d = me(s.id);
      if (v || $ || M || I || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (se && (se.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== se.key) && Po(), se && a.key === "Escape")
        return a.preventDefault(), Po(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (se && a.key === "Enter") {
        a.preventDefault();
        const w = se.choices[se.at];
        return se = null, G(t.onPreview, null), o = w.next, D(o), e.announce?.(w.done), G(t.onChange, o, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: w.edits }), !0;
      }
      const f = i?.keyChoices?.(o, be(s.id), a.key);
      if (f) {
        a.preventDefault();
        const w = [], g = [];
        for (const T of typeof f == "string" ? [] : f) {
          const N = Ve(o, T.edits);
          "refused" in N ? g.push(`${T.said}: ${N.refused.reason}`) : w.push({ ...T, next: N.workshop, done: N.report.edits.map((H) => H.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof f == "string" ? f : g.join(" ")), !0;
        const k = se && se.node === s.id ? (se.at + 1) % w.length : 0;
        se = { node: s.id, key: a.key.toLowerCase(), choices: w, at: k }, D(w[k].next), G(t.onPreview, w[k].next);
        const P = w.length > 1 ? ` (${k + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[k].said}${P} Enter to make it, Escape to cancel.`), !0;
      }
      const m = i?.keyEdit?.(o, be(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = Ve(o, m);
        return "refused" in w ? (e.announce?.(w.refused.reason), G(t.onRefuse, { laneId: w.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: w.refused.reason })) : et(w.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = o.cards.find((w) => w.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), To(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && ci())
        return a.preventDefault(), To(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (z?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: k } = z;
        if (z = null, w === null)
          return G(t.onPreview, null), Xn(u.id, k), !0;
        const P = o;
        o = g, D(o), Ke(w), G(t.onPreview, null);
        const T = o.lanes.find((N) => N.id === w);
        return e.announce?.(`${Z(u)} moved to ${T.label}. ${Fe(o, w)}.`), G(t.onChange, o, { cardId: u.id, laneId: w, ...i ? { edits: i.editsBetween(P, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), qe(), e.announce?.(`Move cancelled. ${Z(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => A.get(a.id) === a).map((a) => a.id);
      Jn = s.length === 1, A.clear(), E.clear(), R.clear(), we.clear(), W.clear(), B.clear(), M = null, z = null, D($ ?? o, { animate: !1 }), s.length === 1 && (re = re.then(() => {
        Jn = !1;
        const a = A.get(s[0]);
        if (!S && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        rn();
      }));
    }
  };
  Le.onFreeMove = (s, a) => {
    if (!Sn() || s.options?.isComment) return $t();
    const d = Cn(a), f = Ln(s), m = $n(s), u = o.lanes.filter((k) => !m && Xe(o, k.id, f) === null).map((k) => k.id), w = d && i?.noteUnder?.(o, Ye(a), ue);
    w && (f.under = w);
    const g = d ? m ?? Xe(o, d, f) : null;
    ee && ee.noteId === s.id && ee.laneId === d && ee.refusal === g || (ee = { noteId: s.id, laneId: d, refusal: g, open: u }, Oe());
  }, Le.onFreeDrop = (s, a, d) => {
    if ($t(), !Sn() || s.options?.isComment) return;
    const f = Cn(a);
    if (!f) return;
    const m = Ln(s), u = i?.noteUnder?.(o, Ye(a), ue);
    u && (m.under = u), Rt(m, a);
    const w = o.lanes.find((k) => k.id === f), g = $n(s) ?? Xe(o, f, m);
    return g ? (le(!1), te = { laneId: f, reason: g, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${Tt(m.label)} can't go in ${w.label}. ${g}`), G(t.onRefuse, { noteId: s.id, laneId: f, reason: g }), "refused") : (Et([{ node: s, offer: m, from: d }], f), "taken");
  }, Le.onFreeGroupDrop = (s, a, d) => {
    if ($t(), !Sn() || s.some((g) => g.options?.isComment)) return;
    const f = Cn(a);
    if (!f) return;
    const m = o.lanes.find((g) => g.id === f), u = s.map((g) => ({ node: g, offer: Rt(Ln(g), a) })), w = hi(u, f);
    if (w) {
      le(!1), te = { laneId: f, reason: w, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${Oo(u.map((g) => Tt(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of u) G(t.onRefuse, { noteId: g.id, laneId: f, reason: w });
      return "refused";
    }
    return Et(u.map((g, k) => ({ ...g, from: d?.[k] })), f), "taken";
  }, Le.onFreeTextCommit = (s) => {
    if (!Sn() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = { x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 }, f = Cn(d);
    if (!f) return;
    const m = Rt(Ln(s), d), u = o.lanes.find((N) => N.id === f), w = $n(s) ?? Xe(o, f, m);
    if (!w) {
      Et([{ node: s, offer: m }], f);
      return;
    }
    le(!1), te = { laneId: f, reason: w, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${Tt(m.label)} can't go in ${u.label}. ${w} It is beside the board.`), G(t.onRefuse, { noteId: s.id, laneId: f, reason: w });
    const { width: g } = Re(o), k = An({ x: q.x + g + 32, y: a.y ?? q.y, width: a.width ?? 0, height: a.height ?? 0 }), P = Math.round(k.x), T = Math.round(k.y);
    s.position(P, T, () => e.updateSelectionResizeRotate?.(), void 0, it() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Ht({ ...s.options, x: P, y: T })] });
  }, Le.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...ye], lines: (o.lines ?? []).map((s) => ({ ...s })) }), Le.onUndoRestore = (s, a) => {
    if (S) return;
    const d = new Map((s?.cards ?? []).map((u) => [u.id, u])), f = new Map(s?.pairs ?? []), m = (u) => ye.get(u) ?? f.get(u) ?? u;
    for (const u of a.added) {
      const w = m(u), g = o.cards.find((P) => P.id === w);
      if (!g || d.has(w)) continue;
      o = X({ ...o, cards: o.cards.filter((P) => P !== g), lines: un(o.lines, w, u) }), D(o);
      const k = G(t.onChange, o, { cardId: w, cardToNote: { noteId: u }, via: "undo" });
      e.holdTrade?.(u, k), Kt(k);
    }
    for (const u of a.removed) {
      const w = m(u), g = d.get(w);
      if (!g || o.cards.some((K) => K.id === w)) continue;
      const k = (s?.lines ?? []).filter((K) => K.parentId === w || K.childId === w), P = lo(o, g), T = {
        id: w,
        label: P,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...k.length ? { lines: k } : {}
      }, N = [g.laneId, ...o.lanes.map((K) => K.id)].find((K) => Wn(o, K, T));
      if (!N) {
        e.announce?.(`${Z(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = bi(Wn(o, N, T), w, s?.cards ?? []), w !== u && ye.set(u, w), D(o);
      const H = o.cards.findIndex((K) => K.id === w), V = o.cards.slice(H + 1).find((K) => K.laneId === N)?.id, Y = G(t.onChange, o, { cardId: w, laneId: N, noteToCard: {
        noteId: u,
        label: P,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...V ? { before: V } : {},
        ...k.length ? { lines: un(k, w, u) } : {}
      }, via: "undo" });
      e.holdTrade?.(u, Y), Kt(Y);
    }
    for (const u of d.values()) {
      const w = o.cards.find((P) => P.id === u.id);
      if (!w || w.label === u.label || vn.get(u.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: u.id }, label: u.label }], k = Ve(o, g);
      "refused" in k || (o = k.workshop, vn.set(u.id, u.label), D(o), e.announce?.(`${Z(w)} is called ${Z(u)} again.`), G(t.onChange, o, { rename: { cardId: u.id, label: u.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && ki(s.lines);
  };
  let Ct = !1;
  Le.onNodeAdded = (s) => {
    S || Ct || A.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (Ct = !0, queueMicrotask(() => {
      Ct = !1, S || Oe();
    }));
  }, Le.onLine = (s, a) => {
    S || queueMicrotask(() => {
      S || gi(s, a);
    });
  };
  const li = e.setDragPolicy(Le), Lt = {
    verdict(s, a) {
      if (!Sn()) return null;
      const d = Cn(a);
      if (!d) return null;
      const f = Ln(s), m = i?.noteUnder?.(o, Ye(a), ue);
      return m && (f.under = m), { laneId: d, laneLabel: o.lanes.find((u) => u.id === d).label, reason: $n(s) ?? Xe(o, d, f) };
    },
    take: (s, a, d) => Le.onFreeDrop?.(s, a, d),
    flash(s, a) {
      S || !o.lanes.some((d) => d.id === s) || (le(!1), te = { laneId: s, reason: a, timer: setTimeout(() => le(), 1500) }, Oe());
    }
  };
  Rn.has(e) || Rn.set(e, /* @__PURE__ */ new Set()), Rn.get(e).add(Lt);
  const di = t.onSelect || p ? e.onSelectionChange?.(() => {
    rn(), Ko();
  }) : void 0;
  let Zn = null;
  const Ao = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, f = d && A.has(d) ? Go(d) : null;
    f !== Zn && (Zn = f, Ko());
  };
  p && e.element?.addEventListener?.("pointerover", Ao);
  const So = (s) => {
    if (z && qe(), b && !s?.target?.closest?.("[data-board-pick]") && (b = null, Ie && dn(Ie), queueMicrotask(rn)), In = null, Ue && (clearTimeout(Ue), Ue = null), !s || S || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((u) => ae(Q.lane(u.id))));
    if ((e.getSelectedNodes?.() ?? []).some((u) => !a.has(u?.id))) return;
    const d = o.lanes.flatMap((u) => [Q.caption(u.id), Q.column(u.id)]).map((u) => A.get(ae(u))).filter(Boolean), f = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), d, { padding: 0 }) : null, m = f ? me(f.id) : null;
    m && (In = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, Co = (s) => {
    const a = In;
    In = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (Ue = setTimeout(() => {
      if (Ue = null, S || M || I || !o.lanes.some((f) => f.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = A.get(ae(Q.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, Lo = () => {
    In = null;
  };
  e.element?.addEventListener?.("pointerdown", So, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Co, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", Lo, !0), Si(), D(o, { animate: !1 });
  function $o(s, a, d) {
    const f = o.cards.find((T) => T.id === s);
    if (!f) return { kind: "outside" };
    if (i) {
      const T = Ye(a), N = i.refusalAt(o, s, M?.grab ?? { x: 0, y: 0 }, T, ue);
      if (N && !N.lands) return { kind: "refused", laneId: N.laneId, reason: N.reason };
      const { width: H, height: V } = Re(o);
      if (T.x < -40 || T.y < -40 || T.x > H + 40 || T.y > V + 40) return { kind: "outside" };
      let Y = o;
      try {
        Y = d?.(T) ?? o;
      } catch (K) {
        console.warn("WORKSHOP: the board kit's chooser threw", K);
      }
      return JSON.stringify(Y) === JSON.stringify(o) ? N ? { kind: "refused", laneId: N.laneId, reason: N.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: Y.cards.find((K) => K.id === s)?.laneId ?? f.laneId, next: Y, ...N && { said: N.reason } };
    }
    const m = o.lanes.map((T) => A.get(ae(Q.column(T.id)))).filter(Boolean), u = e.hitTestNodes(a, m, { padding: 6 }), w = u ? me(u.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === f.laneId) return { kind: "home" };
    const g = Dn(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: jn(o, s, w) ?? "That move is not available." };
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
  function ci() {
    return i ? !1 : new Set(_e(o, { layout: ue }).places.map((s) => s.row)).size > 1;
  }
  function To(s, a, d = !1) {
    const f = o.cards.find((T) => T.id === s), m = ur(o, s), u = z?.cardId === s && z.laneId === null ? z.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const T = u > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (qe(), T.id === f.laneId) {
        Ke(T.id, $ ?? o), e.announce?.(`${Z(f)} is back in ${T.label}.`);
        return;
      }
      if (m.includes(T)) {
        const H = Dn(o, s, T.id);
        z = { cardId: s, laneId: T.id, next: H }, D(H), Ke(T.id, H), G(t.onPreview, H), e.announce?.(`${Z(f)} to ${T.label}: ${Fe(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const N = jn(o, s, T.id) ?? "That move is not available.";
      le(), te = { laneId: T.id, reason: N, timer: setTimeout(() => le(), 1500) }, D($ ?? o), Ke(T.id, $ ?? o), e.announce?.(`${Z(f)} can't move to ${T.label}. ${N}`), G(t.onRefuse, { cardId: s, laneId: T.id, reason: N });
      return;
    }
    const w = z?.cardId === s ? z.laneId : f.laneId;
    let g;
    if (d) {
      const { places: T } = _e(o, { layout: ue }), N = T.find((H) => H.laneId === w);
      g = T.filter((H) => H.column === N.column && (H.row - N.row) * a > 0).sort((H, V) => (H.row - V.row) * a).map((H) => o.lanes.find((V) => V.id === H.laneId));
    } else {
      const T = o.lanes.findIndex((N) => N.id === w);
      g = a > 0 ? o.lanes.slice(T + 1) : o.lanes.slice(0, T).reverse();
    }
    const k = g.find((T) => m.includes(T));
    if (le(), !k) {
      const T = g[0];
      if (!T) {
        if (!d && qt()) {
          const H = ct(o, s);
          if (H) {
            e.announce?.(H), G(t.onRefuse, { cardId: s, laneId: null, reason: H });
            return;
          }
          ui(f, a);
          return;
        }
        e.announce?.(`${Z(f)} has no lane to move to on that side.`);
        return;
      }
      const N = jn(o, s, T.id) ?? "That move is not available.";
      te = { laneId: T.id, reason: N, timer: setTimeout(() => le(), 1500) }, D(z?.next ?? $ ?? o), Ke(T.id, z?.next ?? $ ?? o), e.announce?.(`${Z(f)} can't move to ${T.label}. ${N}`), G(t.onRefuse, { cardId: s, laneId: T.id, reason: N });
      return;
    }
    if (k.id === f.laneId) {
      qe(), Ke(k.id, $ ?? o), e.announce?.(`${Z(f)} is back in ${k.label}.`);
      return;
    }
    const P = Dn(o, s, k.id);
    z = { cardId: s, laneId: k.id, next: P }, D(P), Ke(k.id, P), G(t.onPreview, P), e.announce?.(`${Z(f)} to ${k.label}: ${Fe(P, k.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ke(s, a = o) {
    const d = i ? Ci(a, Q.column(s)) : _e(a, { layout: ue, rows: jo() }).places.find((k) => k.laneId === s), f = e.canvas?.viewbox?.();
    if (!d || !f || !(f.width > 0) || !(f.height > 0)) return;
    const m = 16, u = (k, P, T, N) => P + m * 2 >= N || k - m < T ? k - m - T : k + P + m > T + N ? k + P + m - (T + N) : 0, w = u(q.x + d.x, d.width, f.x, f.width), g = u(q.y + d.y, d.height, f.y, f.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function rn() {
    if (!t.onSelect || Jn) return;
    const s = S ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && A.get(s[0].id) === s[0] ? me(s[0].id) : null;
    b && s.some((w) => !L.has(w.id)) && (b = null, Ie && dn(Ie));
    const [d, f] = b ? b.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : d && f && !a ? { path: { from: d, to: f } } : null, u = m ? JSON.stringify(m) : null;
    u !== Io && (Io = u, G(t.onSelect, m));
  }
  function Po() {
    se && (se = null, D(o), G(t.onPreview, null));
  }
  function qe() {
    z && (z = null, G(t.onPreview, null), D($ ?? o));
  }
  function ui(s, a) {
    const { width: d } = Re(o), f = A.get(ae(Q.card(s.id)))?.options, m = f?.width ?? 228, u = An({
      x: a > 0 ? q.x + d + 32 : q.x - m - 32,
      y: f?.y ?? q.y,
      width: m,
      height: f?.height ?? 76
    }, a), w = pr(o, s.id);
    z = { cardId: s.id, laneId: null, side: a, spot: u, next: o }, D(o), G(t.onPreview, w), e.announce?.(`${Z(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function sn() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Sn() {
    return !S && !v && !$ && !M && !sn() && qt();
  }
  function $t() {
    ee && (ee = null, S || Oe());
  }
  function Cn(s) {
    const a = o.lanes.map((f) => A.get(ae(Q.column(f.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? me(d.id)?.key ?? null : null;
  }
  function Ln(s) {
    const a = s.options ?? {}, d = Dr({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), f = String(a.text ?? ""), m = f.replace(/\s+/g, " ").trim(), u = {};
    f.trim() !== m && f.length <= 4e3 && (u.text = f.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (u[g] = Math.round(a[g]));
    if (ro(a.image)) {
      u.image = { src: a.image };
      for (const [g, k] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[k]) && a[k] >= 1 && a[k] <= 2e4 && (u.image[g] = a[k]);
    }
    a.link?.data && cr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = fi(s);
    return { id: s.id, label: m, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...w.length ? { lines: w } : {} };
  }
  function fi(s) {
    const a = /* @__PURE__ */ new Map(), d = (f) => typeof f == "string" && !!A.get(f) && A.get(f) === e.nodes.one(f);
    for (const f of s.relationships?.getAssociations?.() ?? [])
      (f.targetPoint || !d(f.childId)) && a.set(f.id, Pn(f));
    for (const f of e.nodes?.allNodes ?? [])
      if (!(f === s || d(f.id)))
        for (const m of f.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, Pn(m));
    for (const f of Jt(o, s.id)) a.set(f.id, f);
    return [...a.values()];
  }
  function Oo(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function hi(s, a) {
    for (const { node: u } of s) {
      const w = $n(u);
      if (w) return w;
    }
    const d = o.lanes.find((u) => u.id === a), f = He(o, a);
    if (d.capacity !== void 0 && !d.station && f + s.length > d.capacity) {
      const u = d.capacity - f;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${f} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: u } of s) {
      const w = Xe(m, a, u);
      if (w) return w;
      m = Wn(m, a, u);
    }
    return null;
  }
  function $n(s) {
    if (s.options?.image && !ro(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !cr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : pi(s) ? Ut : null;
  }
  function an(s) {
    return !!s && A.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function pi(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && an(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !an(a))) {
        for (const d of a.relationships?.getAssociations?.() ?? []) if (d.childId === s.id && !d.targetPoint) return !0;
      }
    return !1;
  }
  const Tt = (s) => s || "This note", Z = (s) => s.label || "The empty card", Eo = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : hs[a] ?? "shape";
  }, Pt = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Mo = (s) => {
    const a = s.flatMap((d) => {
      const f = Eo(d.asNote?.shape);
      return f ? [{ card: d, word: f }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Pt(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: f }) => f === "shape" ? `${Z(d)} had its own shape` : `${Z(d)} was ${Pt(f)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, mi = (s) => {
    const a = Eo(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Pt(a)} again.` : "";
  };
  function Tn() {
    return !S && !v && !$ && !sn() && Cs(o);
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
  function No(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function _o(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (A.get(s.id) === s) {
      const a = me(s.id);
      return a?.kind === "card" && o.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || an(s) ? null : s.id;
  }
  function Ot(s, a) {
    if (s.cards.some((f) => f.id === a)) {
      const f = A.get(ae(Q.card(a)));
      return f?.relationships && f.svgGroup ? f : null;
    }
    const d = e.nodes.one(a);
    return d && A.get(a) !== d && !an(d) && d.svgGroup ? d : null;
  }
  function Ro(s) {
    const a = [];
    for (const d of s) {
      const f = e.nodes.one(d.parentId);
      if (!f?.relationships || A.get(f.id) === f || f.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const w = f.relationships.addFloatingAssociation(d.targetPoint, _n(d));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(d.childId);
      if (!m || A.get(m.id) === m) continue;
      const u = f.relationships.addAssociation(m, _n(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function wi(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const N = Ot(s, d.parentId);
        if (!N || A.get(N.id) !== N) continue;
        const H = { ...d, parentId: N.id }, V = JSON.stringify(H);
        a.add(d.id);
        const Y = we.get(d.id);
        if (Y && Y.key === V && Y.holder === N && !Y.other && N.relationships.hasAssociationId?.(d.id)) continue;
        Y && e.nodes.one(Y.holder.id) === Y.holder && Y.holder.relationships?.removeAssociation?.(d.id), N.relationships.addFloatingAssociation(d.targetPoint, _n(H)), we.set(d.id, { holder: N, other: null, swapped: !1, key: V });
        continue;
      }
      const f = Ot(s, d.parentId), m = Ot(s, d.childId);
      if (!f || !m || f === m) continue;
      const u = A.get(f.id) !== f, w = u ? m : f, g = u ? f : m, k = u ? No({ ...d, parentId: w.id, childId: g.id }, d) : { ...d, parentId: w.id, childId: g.id }, P = JSON.stringify(k);
      a.add(d.id);
      const T = we.get(d.id);
      T && T.key === P && T.holder === w && T.other === g && w.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), w.relationships.addAssociation(g, _n(k)), we.set(d.id, { holder: w, other: g, swapped: u, key: P }));
    }
    for (const [d, f] of [...we])
      a.has(d) || (e.nodes.one(f.holder.id) === f.holder && f.holder.relationships?.hasAssociationId?.(d) && f.holder.relationships.removeAssociation(d), we.delete(d));
  }
  function Vn(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let On = null;
  function gi(s, a) {
    if (s === "addRelationship") {
      if (we.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, f = e.nodes.one(a?.parentId), m = d ? null : e.nodes.one(a?.childId), u = _o(f), w = d ? null : _o(m);
      if (an(f)) return;
      const g = On?.lineId === a?.id ? o.lines?.find((H) => H.id === a?.id) : void 0;
      g && (On = null);
      const k = (H) => {
        Vn(a), g && D($ ?? o), e.announce?.(H), G(t.onRefuse, { reason: H, laneId: null });
      };
      if (!Tn()) {
        Vn(a), g && D($ ?? o);
        return;
      }
      if (an(m)) return k(Ut);
      if (!u || !w && !d) return k(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const P = d ? String(a.childId) : w;
      if (g) {
        const H = o.cards.some((We) => We.id === u), V = !d && o.cards.some((We) => We.id === w);
        if (!H && !V) return Je({ remove: g.id });
        const Y = { ...Pn(a), id: g.id, parentId: u, childId: P }, K = Bn(o, Y);
        if (K) return k(K);
        Vn(a), Je({ set: Y });
        return;
      }
      const T = Vr(o, u, P, Pn(a)), N = Bn(o, T);
      if (N) return k(N);
      Vn(a), Je({ set: T });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...we].find(([m, u]) => (m === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const f = we.get(d);
      if (we.delete(d), e.nodes.one(f.holder.id) !== f.holder || f.other && e.nodes.one(f.other.id) !== f.other || !Tn())
        return Tn() || S ? void 0 : D($ ?? o);
      On = { lineId: d }, queueMicrotask(() => {
        S || On?.lineId !== d || (On = null, Je({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const f = [...we].find(([T, N]) => T === d?.associationId && N.holder.id === d?.id);
        if (!f) continue;
        const [m, u] = f, w = o.lines?.find((T) => T.id === m), g = u.holder.relationships?.getAssociations?.().find((T) => T.id === m);
        if (!w || !g) continue;
        if (!Tn()) {
          D($ ?? o);
          continue;
        }
        const k = Pn(g), P = u.swapped ? No({ ...k, id: w.id, parentId: w.parentId, childId: w.childId }, k) : { ...k, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(yi(P)) !== JSON.stringify(w) && (we.set(m, { ...u, key: "" }), Je({ set: P }));
      }
  }
  function yi(s) {
    return ut({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function Je(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? ut(o, s.set) : mr(o, s.remove);
    if (!d || d === o) return;
    e.beginHostStep?.(), o = d, e.endHostStep?.(), D($ ?? o);
    const f = "set" in s ? s.set : a, m = [f.parentId, f.childId].map((g) => o.cards.find((k) => k.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (g) => m[g] || (g === 1 && f.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${u(0)} to ${u(1)} changed.` : f.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const w = G(t.onChange, o, { line: s });
    Kt(w, () => {
      if (S || o !== d) return;
      const g = a ? ut(o, a) : "set" in s ? mr(o, s.set.id) : null;
      g && (o = g, D($ ?? o));
    });
  }
  function ki(s) {
    const a = new Map(s.map((f) => [f.id, f])), d = new Map((o.lines ?? []).map((f) => [f.id, f]));
    for (const f of d.keys()) a.has(f) || Je({ remove: f });
    for (const [f, m] of a)
      JSON.stringify(d.get(f)) !== JSON.stringify(m) && Bn(o, m) === null && Je({ set: m });
  }
  function Et(s, a) {
    let d = o;
    const f = /* @__PURE__ */ new Map(), m = s.map(({ node: k, offer: P, from: T }) => {
      let N = P.lines;
      for (const [Y, K] of f) N = un(N, Y, K);
      d = Wn(d, a, { ...P, ...N ? { lines: N } : {} });
      const H = d.cards[d.cards.length - 1];
      H.id !== k.id && f.set(k.id, H.id);
      const V = { ...k.options ?? {}, ...T ? { x: T.x, y: T.y } : {} };
      return { node: k, card: H, kept: V, lines: un(N ?? [], k.id, H.id), under: P.under, day: P.day };
    });
    e.beginHostStep?.(), o = d;
    let u = o;
    for (const { node: k, card: P } of m)
      P.id !== k.id && ye.set(k.id, P.id), on.set(ae(Q.card(P.id)), { x: k.options?.x ?? 0, y: k.options?.y ?? 0 }), ln(() => e.removeNode(k.id));
    e.endHostStep?.(), D(o), vi(ae(Q.card(m[0].card.id)));
    const w = m.length === 1 && hr(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && xi(ae(Q.card(w.id)), w.label);
    const g = o.lanes.find((k) => k.id === a);
    e.announce?.(m.length === 1 ? `${Z(m[0].card)} is now a card in ${g.label}. ${Fe(o, a)}.${Mo([m[0].card])}` : `${Oo(m.map(({ card: k }) => Z(k)))} are now cards in ${g.label}. ${Fe(o, a)}.${Mo(m.map(({ card: k }) => k))}`);
    for (const { node: k, card: P, kept: T, lines: N, under: H, day: V } of m) {
      const Y = { cardId: P.id, laneId: a, noteToCard: {
        noteId: k.id,
        label: lo(o, P),
        ...H && { under: H },
        ...V !== void 0 && { day: V },
        ...P.look ? { look: P.look } : {},
        ...P.asNote ? { asNote: P.asNote } : {},
        ...N.length ? { lines: N } : {}
      } }, K = () => {
        o !== u || !o.cards.some(($e) => $e.id === P.id) || (o = X({ ...o, cards: o.cards.filter(($e) => $e.id !== P.id), lines: un(o.lines, P.id, k.id) }), u = o, D(o));
      }, We = G(t.onChange, o, Y);
      e.holdTrade?.(k.id, We), Fo(We, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: k.id, isComment: !1 } }]);
      }, () => {
        if (!S) {
          if (K(), !e.nodes.one(T.id)) {
            e.beginHostStep?.();
            const $e = ln(() => e.addNode({ ...T }));
            $e && ($e.announcedByCreator = !0), e.endHostStep?.();
            const En = un(N, P.id, k.id).filter((de) => !o.cards.some((Mn) => Mn.id === de.parentId || Mn.id === de.childId));
            $e?.ready?.then?.(() => {
              S || ln(() => Ro(En));
            });
          }
          e.announce?.(`${Z(P)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        S || (K(), e.keepTrade?.(k.id), e.announce?.(`Someone else put ${Z(P)} on the board first.`));
      });
    }
  }
  function Wo(s, a) {
    const d = o.cards.find((T) => T.id === s), f = E.get(ae(Q.card(s))) ?? {}, m = Rr(d), u = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = (At.cornerRadius ?? 0) > 0, g = d.asNote, k = hr(o, d), P = {
      id: u,
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
    return { id: u, note: P };
  }
  function Xn(s, a, d = "", f = !1) {
    const m = o.cards.find((de) => de.id === s), u = o.lanes.find((de) => de.id === m.laneId), w = o.cards.findIndex((de) => de.id === s), g = o.cards.slice(w + 1).find((de) => de.laneId === m.laneId)?.id, { id: k, note: P } = Wo(s, a), T = m.asNote, N = Jt(o, s), { leave: H } = Ps(o, s, k), V = pr(o, s, k);
    e.beginHostStep?.(), o = V;
    const Y = o;
    k !== s ? ye.set(k, s) : ye.delete(k);
    const K = ln(() => e.addNode(P));
    K && (K.announcedByCreator = !0), e.endHostStep?.(), D(o);
    const We = Promise.resolve(K?.ready).then(() => S || !K || e.nodes.one(k) !== K ? [] : ln(() => Ro(H))).catch(() => []);
    K?.ready?.then?.(() => {
      if (S || e.nodes.one(k) !== K) return;
      const de = () => e.selectNodes?.([K]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(de) : de();
    }), f || e.announce?.(`${Z(m)} is now a note on the canvas.${d} ${u.label}: ${Fe(o, u.id)}.${mi(T?.shape)}`);
    const $e = () => {
      e.nodes.one(k) === K && (e.beginHostStep?.(), ln(() => e.removeNode(k)), e.endHostStep?.());
    }, En = G(t.onChange, o, { cardId: s, cardToNote: { noteId: k } });
    return e.holdTrade?.(k, En), Fo(En, () => {
      We.then((de) => {
        K && e.nodes.one(k) === K && e.sendHeld?.([{ type: "onNodeAdded", data: { id: k, nodeOptions: Ht(K.options) } }, ...de]);
      });
    }, () => {
      if (!S) {
        if ($e(), o === Y && !o.cards.some((de) => de.id === s)) {
          const de = {
            id: s,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ...N.length ? { lines: N } : {}
          }, Mn = Wn(o, m.laneId, de, g);
          Mn && (o = Mn, D(o));
        }
        e.announce?.(`${Z(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      S || ($e(), e.keepTrade?.(k), e.announce?.(`Someone else took ${Z(m)} off the lanes first.`));
    }), { added: K, answer: En };
  }
  function bi(s, a, d) {
    const f = d.map((k) => k.id), m = f.indexOf(a), u = s.cards.find((k) => k.id === a);
    if (m < 0 || !u) return s;
    const w = s.cards.filter((k) => k !== u), g = w.findIndex((k) => f.indexOf(k.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, u), X({ ...s, cards: w });
  }
  function vi(s) {
    re = re.then(() => {
      const a = A.get(s);
      if (S || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function xi(s, a) {
    re = re.then(() => {
      const d = A.get(s);
      S || v || !d?.editor?.startInline || d.editor.startInline({ text: a, caret: "all" });
    });
  }
  function ln(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Fo(s, a, d, f) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && f();
    }, () => d());
    e.holdUntil?.(m);
  }
  function Ii(s, a) {
    le(!1), te = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => le(), 1500) }, D(o, { skip: a.cardId });
    const d = o.lanes.find((f) => f.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), G(t.onRefuse, a);
  }
  function le(s = !0) {
    te && (clearTimeout(te.timer), te = null, s && !S && Oe());
  }
  function Oe() {
    D(M && M.outcome.kind === "candidate" ? M.outcome.next : z?.next ?? $ ?? o, { skip: M?.cardId });
  }
  function Do(s) {
    const a = qo(s, jo()), d = new Map(a.map((u) => [u.options.id, u.options])), f = (u, w, g, k = !1) => {
      const P = d.get(Q.column(u));
      P && (P.borderColor = w, P.borderWidth = g, delete P.borderStyle);
      const T = k && d.get(Q.lane(u));
      T && (T.borderColor = w, T.borderWidth = g);
    }, m = M?.cardId ?? z?.cardId;
    if (Se = /* @__PURE__ */ new Map(), m) {
      const u = o.cards.find((k) => k.id === m)?.laneId, w = ur(o, m);
      if (!i || i.laneCues)
        for (const k of w) k.id !== u && (f(k.id, lr, 2), Se.set(k.id, "open"));
      if (i?.laneCues) {
        for (const k of o.lanes) if (!w.includes(k)) {
          const P = d.get(Q.column(k.id));
          P && (P.backgroundColor = "#e9e8e2"), Se.set(k.id, "closed");
        }
      }
      const g = M ? M.outcome : z?.laneId ? { kind: "candidate", laneId: z.laneId } : null;
      g?.kind === "candidate" && (f(g.laneId, ar, 3, !0), Se.set(g.laneId, "over")), g?.kind === "refused" && (f(g.laneId, Gt, 3), Se.set(g.laneId, "refused"));
    }
    if (ee && !m) {
      for (const u of ee.open) u !== ee.laneId && (f(u, lr, 2), Se.set(u, "open"));
      ee.laneId && !ee.refusal && (f(ee.laneId, ar, 3, !0), Se.set(ee.laneId, "over")), ee.laneId && ee.refusal && (f(ee.laneId, Gt, 3), Se.set(ee.laneId, "refused"));
    }
    if (z?.laneId === null && z.spot) {
      const u = d.get(Q.card(z.cardId));
      u && (u.xPos = z.spot.x, u.yPos = z.spot.y);
    }
    if (te) {
      Se.set(te.laneId, "refused"), f(te.laneId, Gt, 3, !0);
      const u = d.get(Q.caption(te.laneId));
      if (u && (u.text = te.reason, u.foregroundColor = "#b42318", !i)) {
        const w = d.get(Q.column(te.laneId));
        w && (u.xPos = w.xPos + 6, u.width = w.width - 12, u.height = 30, u.vectorPath = wn(u.width, 30, 0), u.backgroundColor = "transparent");
      }
    }
    if (St = /* @__PURE__ */ new Set(), $ && s === $) {
      const u = (g, k) => JSON.stringify(g) === JSON.stringify(k), w = (g) => {
        const k = d.get(g);
        k && (k.borderStyle = "dashed", k.borderColor = fs, k.borderWidth = 2, St.add(ae(g)));
      };
      for (const g of s.cards) u(g, o.cards.find((k) => k.id === g.id)) || w(Q.card(g.id));
      for (const g of s.lanes) u(g, o.lanes.find((k) => k.id === g.id)) || w(Q.lane(g.id));
    }
    for (const u of a) {
      u.options.id = ae(u.options.id);
      for (const w of u.relationships.associations)
        w.parentId = ae(w.parentId), w.childId = ae(w.childId);
    }
    return a;
  }
  function jo() {
    return M || z ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function D(s, a = {}) {
    if (S) return;
    xe = a.layout ?? ue, Ge = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Do(s), f = [];
    for (const { options: u } of d) {
      const w = u.id;
      if (A.has(w)) continue;
      const g = on.get(w);
      on.delete(w);
      const k = g && a.animate !== !1 && !it() ? { ...u, xPos: g.x, yPos: g.y } : u, P = e.nodes.add(qi(k));
      A.set(w, P), E.set(w, { ...k }), P.ready && f.push(P.ready.then(() => {
        if (A.get(w) !== P) return;
        P.applyGovernance?.(), me(w)?.kind === "column" && P.toBack?.(!1), me(w)?.kind === "handle" && P.svgGroup?.front?.();
        const T = Jo(Ge?.model ?? s, w);
        T && P.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const m = Ge;
    re = Promise.all([re, ...f]).then(() => {
      S || Ge !== m || Ai(Do(m.model), m);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function Ai(s, a) {
    const d = new Set(s.map((m) => m.options.id)), f = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, w] of [...A]) {
        if (d.has(u)) continue;
        for (const [k, P] of [...R])
          P.parentId !== u && P.childId !== u || (P.parent.relationships?.removeAssociation(k), R.delete(k));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), A.delete(u), E.delete(u);
        const g = B.get(u);
        g && (B.delete(u), W.delete(g)), e.nodes.remove(u);
      }
      for (const { options: u } of s) {
        const w = u.id, g = A.get(w);
        if (!g?.svgGroup) continue;
        const k = E.get(w) ?? {}, P = g.editor?.isInlineEditing?.();
        (u.fontSize !== k.fontSize || u.foregroundColor !== k.foregroundColor) && (g.options.fontSize = u.fontSize, g.options.fontColor = u.foregroundColor, g.applyTextStyle?.()), (u.width !== k.width || u.height !== k.height) && (u.vectorPath ? (g.options.width = u.width, g.options.height = u.height, g.setShape?.(g.options.shape, u.vectorPath), me(w)?.kind === "column" && g.toBack?.(!1)) : g.setSize?.(u.width, u.height)), u.text !== k.text && !P && g.setText?.(u.text), u.backgroundColor !== k.backgroundColor && g.setColors?.(u.backgroundColor), (u.borderColor !== k.borderColor || u.borderWidth !== k.borderWidth || u.borderStyle !== k.borderStyle) && (g.options.borderColor = u.borderColor, g.options.borderWidth = u.borderWidth, g.options.borderStyle = u.borderStyle, g.applyBorder?.());
        const T = u.xPos !== k.xPos || u.yPos !== k.yPos || Math.abs((g.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - u.yPos) > 0.5;
        if (w !== (a.skip && ae(Q.card(a.skip))) && w !== (a.grip && ae(a.grip)) && T) {
          const V = a.animate && !it() ? 180 : 0, Y = f.includes(g) ? () => {
            !S && A.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Y && V && f.length === 1 && g.resizeRotate?.disable?.(), g.position(u.xPos, u.yPos, Y, void 0, V);
        }
        const N = Jo(a.model, w);
        N && g.svgGroup.node.getAttribute("aria-label") !== N && g.svgGroup.node.setAttribute("aria-label", N), St.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", Ce), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", _);
        const H = me(w);
        if (H?.kind === "column") {
          const V = Se.get(H.key);
          V ? g.svgGroup.node.setAttribute("data-workshop-drop", V) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        H?.kind === "handle" && g.svgGroup.front?.(), E.set(w, { ...u });
      }
      const m = /* @__PURE__ */ new Map();
      for (const u of s) for (const w of u.relationships.associations) m.set(w.id, w);
      for (const [u, w] of [...R])
        m.has(u) && A.get(w.parentId) === w.parent && A.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(u), R.delete(u));
      for (const [u, w] of m) {
        if (R.has(u)) continue;
        const g = A.get(w.parentId), k = A.get(w.childId);
        !g?.relationships || !k?.svgGroup || (g.relationships.addAssociation(k, _n(w)), R.set(u, { parentId: w.parentId, childId: w.childId, parent: g, child: k }));
      }
      wi(a.model);
    }), dn(a.model), Bo = a.model, Nt(), e.notifyNodeChanged?.();
  }
  let Bo = null;
  function Mt() {
    return !!xe.narrow || xe.lanesPerRow === 1;
  }
  function Ho() {
    let s;
    try {
      s = Bs(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: xe, focused: Ce, draft: _, scale: C, tagScale: y, narrow: Mt(), room: s };
  }
  function zo() {
    if (U) return [1, 1];
    const s = Wt(), a = $r(s);
    return [a, Math.round(Qt(s, Mt() && !_, a) * 20) / 20];
  }
  function Nt() {
    if (!h || S) return;
    [C, y] = zo();
    const s = Bo ?? o, a = i ? i.places(s, xe) : _e(s, { layout: xe }), d = i || s.lanes[0]?.station ? void 0 : a.places;
    let f = null;
    for (const m of A.values()) {
      const u = m.svgGroup?.node;
      u?.parentNode && (!f || u.compareDocumentPosition(f) & 4) && (f = u);
    }
    h.draw({
      board: s,
      scope: r,
      origin: q,
      size: { width: a.width, height: a.height },
      ...Ho(),
      places: d,
      under: f,
      ...t.onFocusDone && { onDone: () => G(t.onFocusDone) }
    });
  }
  function Si() {
    const s = e.canvas?.node, a = zo;
    if ([C, y] = a(), U || !h || !s || typeof MutationObserver > "u") return;
    let d = null;
    const f = new MutationObserver(() => {
      d && clearTimeout(d), d = setTimeout(() => {
        d = null;
        const [m, u] = a();
        S || m === C && u === y || (C = m, y = u, Nt());
      }, 120);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), x = () => {
      f.disconnect(), d && clearTimeout(d);
    };
  }
  let Ie = null;
  function Go(s) {
    const a = me(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, be(s)) ?? null : null;
  }
  function Uo() {
    if (I) return i?.cardOfPart?.(o, I.name) ?? null;
    if (M) return M.cardId;
    if (Zn) return Zn;
    const s = S ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && A.get(s[0].id) === s[0] ? Go(s[0].id) : null;
  }
  let _t = null;
  function Ko() {
    S || !p || !Ie || Uo() !== _t && dn(Ie);
  }
  function dn(s) {
    if (p) {
      Ie = s, _t = Uo();
      const a = o.lanes.map((m) => A.get(ae(Q.column(m.id)))?.svgGroup?.node).reduce((m, u) => u && (!m || m.compareDocumentPosition(u) & 4) ? u : m, null), d = e.canvas?.viewbox?.(), f = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - q.x, y: d.y - q.y, width: d.width, height: d.height } : null;
      p.draw(o, s === o ? null : s, {
        origin: q,
        layout: xe,
        above: a,
        view: f,
        announce: (m) => e.announce?.(m),
        focus: _t,
        boardFocused: Ce,
        picked: b,
        onPick: Ti,
        gripSize: xn,
        clamp: I?.last?.clampedReason ? { name: I.name, text: I.last.clampedReason } : M?.outcome.kind === "candidate" && M.outcome.said ? { name: "card-" + M.cardId, text: M.outcome.said } : !I && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!I?.last?.refusal || !I && !!pe,
        onUnlink: (m, u) => {
          if (v || $ || M || I || sn()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: u }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: u } }, g = Ve(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : et(g.workshop, o.lanes[0]?.station ? { laneId: u } : { cardId: m });
        }
      });
    }
  }
  function Ye(s) {
    return { x: s.x - q.x, y: s.y - q.y };
  }
  function Rt(s, a) {
    const d = i?.noteDay?.(o, Ye(a), xe);
    return typeof d == "number" && Number.isFinite(d) && (s.day = d), s;
  }
  function Re(s) {
    return i ? i.places(s, xe) : { ..._e(s, { layout: ue }), parts: [] };
  }
  function Ci(s, a) {
    const d = i.places(s, xe).parts.find((f) => f.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function Wt() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function Li() {
    qn?.(), qn = null, xn = zt(Wt());
    const s = e.canvas?.node;
    if (!Qn() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const d = () => {
      if (a = null, S || !Qn()) return;
      if (I || M) {
        a = setTimeout(d, 250);
        return;
      }
      const m = zt(Wt());
      Math.abs(m - xn) < 2 || (xn = m, D($ ?? o));
    }, f = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(d, 200);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), qn = () => {
      f.disconnect(), a && clearTimeout(a);
    };
  }
  function Qn() {
    return !i && !!o.lanes[0]?.station && Ce && !v && !$ && !sn();
  }
  function $i(s) {
    const a = Er(s);
    if (!a || !Qn()) return null;
    const d = o;
    return (f) => {
      const m = as(d, f), u = ds(d, a, a.kind === "link" && m === a.from ? null : m);
      return u.next ? { next: u.next } : { next: d, clampedReason: u.refusal, refusal: u.refusal };
    };
  }
  function Ti(s) {
    if (S || Ce) return;
    const a = e.getSelectedNodes?.() ?? [];
    L = new Set(a.map((u) => u.id)), b = s, a.length && e.clearSelection?.(), Ie && dn(Ie), rn();
    const [d, f] = s.split(">"), m = (u) => o.lanes.find((w) => w.id === u)?.label ?? u;
    e.announce?.(`Path from ${m(d)} to ${m(f)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function qo(s, a) {
    if (!i) {
      const d = js(s, { native: !0, origin: q, rows: a, layout: ue, style: At }).nodes;
      return Qn() ? [...d, ..._r(o, q, xn)] : d;
    }
    return i.notes(s, xe, q, At);
  }
  function et(s, a, d) {
    const f = i ? i.editsBetween(o, s) : cs(o, s);
    if (!f.length) return !1;
    const m = Ve(o, f);
    return "refused" in m ? (e.announce?.(m.refused.reason), G(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, D(o, { skip: d }), e.announce?.(m.report.edits.map((u) => u.said).join(" ")), G(t.onChange, o, { ...a, edits: f }), !0);
  }
  function Jo(s, a) {
    const d = me(a);
    if (d?.kind === "lane" || d?.kind === "caption") {
      if (d.kind === "caption" && s.lanes.some((m) => m.station)) return null;
      const f = s.lanes.find((m) => m.id === d.key);
      return f ? `${f.label}, ${Fe(s, f.id)}` : null;
    }
    if (d?.kind === "card") {
      const f = s.cards.find((u) => u.id === d.key), m = f && s.lanes.find((u) => u.id === f.laneId);
      return f && m ? `${f.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? i ? i.label?.(s, be(a)) ?? null : ls(s, be(a)) : null;
  }
  function Ft(s, a) {
    const d = qo(s).find((f) => f.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Ze() {
    (M || I) && e.cancelGovernedDrag?.("host"), M = null, I = null, z && (z = null, G(t.onPreview, null)), le(!1);
  }
  return {
    toCanvas(s) {
      if (S || v || sn()) return "This workshop is view-only here.";
      if (!o.cards.some((u) => u.id === s)) return "That card is no longer on the board.";
      const a = ct(o, s);
      if (a) return a;
      z && qe(), $ && (Ze(), $ = null, D(o), e.refreshGovernance?.());
      const { width: d } = Re(o), f = A.get(ae(Q.card(s)))?.options, m = o.cards.find((u) => u.id === s);
      return Xn(s, An({
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
      const d = Pr(o, { width: s, height: a }, { ...Ho(), scale: 1, tagScale: Qt(1, Mt() && !_) });
      return { x: q.x + d.x, y: q.y + d.y, width: d.width, height: d.height };
    },
    get focused() {
      return Ce;
    },
    setFocused(s) {
      if (S) return;
      const a = Ce;
      Ce = !!s;
      for (const d of A.values()) d.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Ce);
      a !== Ce && (b && (b = null, queueMicrotask(rn)), !i && o.lanes[0]?.station ? (Ze(), Li(), D($ ?? o)) : Ie && dn(Ie), Nt());
    },
    setLayout(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = dr(s);
      i ? i.places(o, a) : _e(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(ue) && (Ze(), ue = a, D($ ?? o));
    },
    whenDrawn: () => re,
    update(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = X(s);
      Ze(), o = a;
      const d = v;
      v = l || c(o), D($ ?? o), v !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = s ? X(s) : null;
      Ze(), $ = a, D($ ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = o.lanes.find((f) => f.id === s);
      S || !d || (le(!1), te = { laneId: s, reason: a, timer: setTimeout(() => le(), 1500) }, Oe(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      l = !!s;
      const a = l || c(o);
      S || v === a || (Ze(), v = a, D($ ?? o), e.refreshGovernance?.());
    },
    destroy() {
      S || (Ze(), S = !0, Rn.get(e)?.delete(Lt), qn?.(), x?.(), h?.destroy(), pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", So, !0), Ue && clearTimeout(Ue), e.element?.ownerDocument?.removeEventListener?.("pointerup", Co, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", Lo, !0), di?.(), p && e.element?.removeEventListener?.("pointerover", Ao), e.withPolicyAuthority(() => {
        for (const [s, a] of we) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of R) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of A)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), R.clear(), we.clear(), A.clear(), E.clear(), W.clear(), B.clear(), li(), p?.destroy(), Jn = !1, rn(), e.notifyNodeChanged?.());
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
function Kt(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function ws(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function dr(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function gs(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const ys = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function ie(e) {
  return ys.includes(e.kind) ? e.kind : void 0;
}
function ge(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Ae(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function ks(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = bt(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function bt(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const vt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function to(e) {
  if (typeof e != "string" || !vt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function Rr(e) {
  return e.noteId ?? e.id;
}
function xt(e) {
  const n = bt(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function Wr(e) {
  const n = ge(e);
  let t;
  try {
    t = new URL(Ae(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (t.protocol !== "https:" || t.username || t.password || t.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: t.href, alt: Ae(n.alt, 240) };
}
function Pe(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Fr = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, bs = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function oo(e) {
  const n = ge(e), t = {}, r = (i) => {
    if (typeof i != "string" || !Fr.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, c, p) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < c || i > p) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !bs.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function Dr(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        oo({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return oo(n);
}
function ro(e) {
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
function cr(e) {
  try {
    return !!wt({ link: e });
  } catch {
    return !1;
  }
}
function wt(e) {
  const n = ge(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = ge(n.image);
    if (!ro(r.src)) throw new Error("A card keeps a picture by its web address only.");
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
    if (!(typeof o == "string" ? o.length <= 2048 : !!o && typeof o == "object" && !Array.isArray(o) && JSON.stringify(o).length <= 2048 && Object.values(o).every((c) => typeof c == "string")) || r.type !== void 0 && (typeof r.type != "string" || !/^[A-Za-z]{1,40}$/.test(r.type)) || r.show !== void 0 && typeof r.show != "boolean") throw new Error("A card keeps a link as a note does.");
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
const yn = 96, vs = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, xs = ["solid", "dashed", "dotted"], Is = 1e7;
function kn(e) {
  const n = ge(e);
  if (typeof n.id != "string" || !vs.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: to(n.parentId), childId: to(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, c) => {
    const p = n[o];
    if (p != null) {
      if (typeof p != "number" || !Number.isFinite(p) || p < i || p > c) throw new Error("A line's look is out of range.");
      t[o] = p;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !Fr.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!xs.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = ge(n.targetPoint), i = (c) => typeof c == "number" && Number.isFinite(c) && Math.abs(c) <= Is;
    if (!i(o.x) || !i(o.y) || Object.keys(o).some((c) => c !== "x" && c !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    t.targetPoint = { x: Math.round(o.x * 100) / 100, y: Math.round(o.y * 100) / 100 };
  }
  for (const o of ["sourceAnchor", "targetAnchor"]) {
    if (o === "targetAnchor" && t.targetPoint) continue;
    const i = n[o];
    if (i == null) continue;
    const c = ge(i), p = (h) => typeof h == "number" && Number.isFinite(h) && h >= 0 && h <= 1;
    if (!p(c.x) || !p(c.y) || Object.keys(c).some((h) => h !== "x" && h !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    t[o] = { x: c.x, y: c.y };
  }
  return t;
}
function As(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map(kn).map((r) => jr(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (De(t.map((r) => r.id), "line ID"), t.length > yn) throw new Error(`A workshop holds up to ${yn} lines.`);
  return t;
}
function jr(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function De(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function yo({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function Ss(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const gn = (e) => "lane-" + e, Be = (e) => "card-" + e, gt = (e) => "image-" + e;
function ha(e, n = {}) {
  const t = Ss(e), r = Q.of(n.scope);
  return yo(e).map((o) => {
    const i = e.cards.filter((h) => h.laneId === o.id), c = t.filter((h) => h.laneId === o.id), p = [r.lane(o.id)];
    return o.station?.image && p.push(r.image(o.id)), { lane: o, cards: i, signals: c, nodeIds: [...p, ...i.map((h) => r.card(h.id))] };
  });
}
const ko = 5, Fn = 24, io = 3;
function X(e) {
  const n = ge(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ie(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = ie(n), o = r ? ve(r) : void 0, i = { id: Pe }, c = Ae(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > ko)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const p = o?.cards ?? [Fn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > p[0]) throw new Error(p[1]);
  const h = n.lanes.map((b) => {
    const L = ge(b), I = { id: Pe(L.id), label: Ae(L.label) };
    if (L.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (L.capacity !== void 0) {
      const $ = t ? 576 : 24;
      if (typeof L.capacity != "number" || !Number.isInteger(L.capacity) || L.capacity < 1 || L.capacity > $)
        throw new Error(`Lane capacity must be a whole number from 1 to ${$}.`);
      I.capacity = L.capacity;
    }
    if (o?.readLane?.(L, I, i), L.station !== void 0) {
      const $ = ge(L.station), _ = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= io)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray($.next) || $.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const U = $.next.map(Pe);
      De(U, "onward stop"), I.station = { column: _($.column), row: _($.row), next: U, outcome: Ae($.outcome, 160) }, $.image !== void 0 && (I.station.image = Wr($.image));
    }
    return I;
  }), C = h.map((b) => b.id);
  if (De(C, "lane ID"), r && h.some((b) => b.station)) throw new Error("A business board has no map stations.");
  if ((t || h.some((b) => b.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (h.some((b) => b.station) && n.cards.every((b) => b?.free === !0))
    throw new Error("A map needs at least one token.");
  if (h.some((b) => b.station)) {
    if (!h.every((b) => b.station)) throw new Error("Give every station on the map a position.");
    De(h.map((b) => b.station.column + "," + b.station.row), "map position");
    for (const b of h)
      if (b.station.next.some((L) => L === b.id || !C.includes(L))) throw new Error("Connect each stop to another station on this map.");
  }
  const y = n.cards.map((b) => {
    const L = ge(b), I = { id: Pe(L.id), label: r ? Ae(L.label) : ks(L.label), laneId: Pe(L.laneId) };
    if (!C.includes(I.laneId)) throw new Error("Card refers to an unknown lane.");
    if (L.allowedLaneIds !== void 0) {
      if (!Array.isArray(L.allowedLaneIds) || L.allowedLaneIds.length > h.length) throw new Error("Invalid allowed lanes.");
      if (I.allowedLaneIds = L.allowedLaneIds.map(Pe), De(I.allowedLaneIds, "allowed lane"), !I.allowedLaneIds.includes(I.laneId) || !I.allowedLaneIds.every(($) => C.includes($)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (L.look !== void 0) {
      const $ = oo(L.look);
      $ && (I.look = $);
    }
    if (L.asNote !== void 0) {
      const $ = wt(L.asNote);
      $ && (I.asNote = $);
    }
    if (L.noteId !== void 0 && L.noteId !== I.id && (I.noteId = to(L.noteId)), L.free !== void 0) {
      if (L.free !== !0 || !h.some(($) => $.station)) throw new Error("Only a map’s cards can be free of its paths.");
      I.free = !0;
    }
    if (o?.readCard(L, I, i), t) {
      if (typeof L.points != "number" || !Number.isInteger(L.points) || L.points < 1 || L.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (I.points = L.points, L.dependsOn !== void 0) {
        if (!Array.isArray(L.dependsOn) || L.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        I.dependsOn = L.dependsOn.map(Pe), De(I.dependsOn, "dependency");
      }
    }
    return I;
  });
  De(y.map((b) => b.id), "card ID");
  const x = { version: 1, title: c, lanes: h, cards: y };
  if (n.experience !== void 0) {
    const b = ge(n.experience);
    if (b.version !== 1 || b.kind !== "customer-interviews" && b.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    x.experience = { version: 1, kind: b.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    x.signals = n.signals.map((b) => {
      const L = ge(b), I = Pe(L.cardId), $ = Pe(L.laneId);
      if (!y.some((_) => _.id === I) || !C.includes($))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Pe(L.id),
        label: Ae(L.label),
        cardId: I,
        laneId: $,
        whenPresent: Ae(L.whenPresent, 160),
        whenAbsent: Ae(L.whenAbsent, 160)
      };
    }), De(x.signals.map((b) => b.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const b = As(n.lines, new Set(y.map((L) => L.id)));
    b.length && (x.lines = b);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    x.presentationOrder = yo({ lanes: h, presentationOrder: n.presentationOrder }).map((b) => b.id);
  }
  if (n.behaviour !== void 0 && (x.behaviour = ke().validate(n.behaviour, { ...x, kind: n.kind })), t)
    return x.kind = "release-plan", Pi(x), x;
  if (r && o) {
    x.kind = r, o.readBoard(n, x, i);
    const b = o.validate(x);
    if (b) throw new Error(b);
    return x;
  }
  for (const b of h)
    if (He({ cards: y }, b.id) > (b.capacity ?? 1 / 0))
      throw new Error(`Lane "${b.label}" exceeds its capacity.`);
  return x;
}
function He(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const Br = 65536;
function pa(e) {
  const n = JSON.stringify(X(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > Br) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function ma(e) {
  if (e.length > Br) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), t = n.get("model");
  if (!e.startsWith("#") || !t || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let r;
  try {
    r = JSON.parse(t);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return X(r);
}
function bo(e, n, t) {
  const r = ie(e);
  return r ? ve(r).planMove(e, n, t) : void 0;
}
function yt(e, n) {
  if (ie(e)) return e.lanes.filter((r) => bo(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => zn(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && He(e, r.id) < (r.capacity ?? 1 / 0));
}
function so(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = bo(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = zn(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !yt(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? { ...r, laneId: t } : i) };
}
function Dn(e, n, t) {
  const r = Hr(e, n, t);
  return !r || r === e || !e.behaviour ? r : "refused" in ke().check(e, r) ? null : r;
}
function Hr(e, n, t) {
  const r = e.cards.find((c) => c.id === n);
  if (!r || !e.lanes.some((c) => c.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return zn(e, r, t);
  const o = bo(e, n, t);
  if (o !== void 0) return o;
  const i = zs(e, n, t);
  return i || (t === "prototype" && tn(e) === "customer-interviews" ? null : yt(e, r).some((c) => c.id === t) ? so(e, n, t) : null);
}
function ur(e, n) {
  return e.lanes.filter((t) => Dn(e, n, t.id) !== null);
}
function jn(e, n, t) {
  const r = Hr(e, n, t);
  if (r !== null) {
    const x = r === e || !e.behaviour ? null : ke().check(e, r);
    return x && "refused" in x ? x.refused.sentence : null;
  }
  const o = e.cards.find((x) => x.id === n), i = e.lanes.find((x) => x.id === t);
  if (!o || !i) return "That move is not available.";
  const c = ie(e), p = c && ve(c).refusal;
  if (p) return p(e, n, t);
  const h = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return h;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return h;
    const x = en(e, t), b = { ...e, lanes: e.lanes.map((I) => I === i ? { id: i.id, label: i.label } : I) }, L = zn(b, o, t);
    return L ? `Needs ${en(L, t) - x} points. It already holds ${x} of ${i.capacity} points.` : h;
  }
  const C = e.lanes.find((x) => x.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const y = He(e, t);
  if (i.capacity !== void 0 && y >= i.capacity && !(C?.station && o.free)) {
    const x = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${y} of ${i.capacity} ${x}.`;
  }
  return h;
}
function qt(e) {
  return !0;
}
function Cs(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !tn(e);
}
function Ls(e) {
  const n = tn(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function $s(e) {
  const n = bt(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const Ts = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function bn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && Ts.test(n) && !t.has(n) ? n : Un(e, "card");
}
function Xe(e, n, t) {
  const r = e.lanes.find((p) => p.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = Ls(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= Fn ? `This board is at its size limit of ${Fn} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : qr(e, n, t) ? null : jn(Kr(e, n, t), bn(e, t.id), n);
  if (ie(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const p = Jr(e, n, t);
    return typeof p == "string" ? p : fr(e, p);
  }
  if (e.cards.length >= Fn) return `This board is at its size limit of ${Fn} cards. Remove a card to make room.`;
  const i = e.lanes.some((p) => p.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const c = He(e, n);
  if (r.capacity !== void 0 && !i && c >= r.capacity) return `It already holds ${c} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const p = Gr(t.lines);
    if (!p) return "A line of this note can't be joined to a card.";
    const h = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + p.filter((C) => !h.has(C.id)).length > yn)
      return `A workshop holds up to ${yn} lines.`;
  }
  return fr(e, { ...e, cards: [...e.cards, { id: bn(e, t.id), label: xt(vo(t) || nn(e)), laneId: n }] });
}
function fr(e, n) {
  if (!e.behaviour) return null;
  const t = ke().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function zr(e) {
  try {
    return e && typeof e == "object" ? Dr(e) : void 0;
  } catch {
    return;
  }
}
function ao(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      wt({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? wt(n) : void 0;
}
function Gr(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = kn(r);
    } catch {
      const i = (p) => {
        const { id: h, parentId: C, childId: y, targetPoint: x } = ge(r);
        return kn({ id: h, parentId: C, childId: y, ...p ? { targetPoint: x } : {} });
      }, c = r?.targetPoint !== void 0 && r?.targetPoint !== null;
      try {
        o = i(!0);
      } catch {
        try {
          o = c ? null : i(!1);
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
function It(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function un(e, n, t) {
  return e && e.map((r) => It(r, n, t));
}
function Ur(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function Wn(e, n, t, r) {
  if (Xe(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return qr(e, n, t, r);
  if (ie(e)) {
    const $ = Jr(e, n, t), _ = $.cards[$.cards.length - 1], U = r === void 0 ? -1 : e.cards.findIndex((l) => l.id === r && l.laneId === n);
    return U < 0 ? $ : { ...$, cards: [...e.cards.slice(0, U), _, ...e.cards.slice(U)] };
  }
  const o = zr(t.look), i = vo(t), c = i || nn(e);
  let p = ao(t.asNote);
  i || (p = { ...p, text: "" }), c.length > 80 && p?.text === void 0 && c.length <= 4e3 && (p = { ...p, text: c });
  const h = bn(e, t.id), C = h !== t.id && typeof t.id == "string" && vt.test(t.id) ? t.id : void 0, y = e.lanes.some(($) => $.station), x = {
    id: h,
    label: xt(c),
    laneId: n,
    ...o ? { look: o } : {},
    ...p ? { asNote: p } : {},
    ...C ? { noteId: C } : {},
    ...y ? { free: !0 } : {}
  }, b = r === void 0 ? -1 : e.cards.findIndex(($) => $.id === r && $.laneId === n), L = b < 0 ? [...e.cards, x] : [...e.cards.slice(0, b), x, ...e.cards.slice(b)], I = t.lines === void 0 ? void 0 : Ur(e, Gr(t.lines).map(($) => It($, t.id, x.id)));
  return X({ ...e, cards: L, ...I ? { lines: I } : {} });
}
function Kr(e, n, t, r) {
  const { label: o, points: i } = $s(typeof t.label == "string" ? t.label : ""), c = bn(e, t.id), p = c !== t.id && typeof t.id == "string" && vt.test(t.id) ? t.id : void 0, h = { id: c, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...p ? { noteId: p } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((y) => y.id === r && y.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, h] : [...e.cards.slice(0, C), h, ...e.cards.slice(C)] };
}
function qr(e, n, t, r) {
  const o = Kr(e, n, t, r), i = bn(e, t.id), c = o.cards.find((h) => h.id === i);
  if (c.laneId === n) return X(o);
  const p = zn(o, c, n);
  return p ? X(p) : null;
}
function Jr(e, n, t) {
  const r = vo(t), o = ve(ie(e)).fromNote(e, r, nn(e, t.under));
  if (typeof o == "string") return o;
  const i = Ve(e, [{ kind: "add_card", lane: { id: n }, ...o, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const c = i.workshop.cards, p = bn(e, t.id), h = p !== t.id && typeof t.id == "string" && vt.test(t.id) ? t.id : void 0, C = zr(t.look), y = r ? ao(t.asNote) : { ...ao(t.asNote), text: "" };
  c[c.length - 1] = {
    ...c[c.length - 1],
    id: p,
    ...h ? { noteId: h } : {},
    ...C ? { look: C } : {},
    ...y ? { asNote: y } : {}
  };
  const x = ve(ie(e));
  return typeof t.day == "number" && Number.isFinite(t.day) && x.landNote ? x.landNote(i.workshop, p, t.day) : i.workshop;
}
function vo(e) {
  return typeof e?.label == "string" ? bt(e.label) : "";
}
function hr(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === nn(e, n.parentId) || n.label === nn(e)) ? "" : t !== void 0 && t !== "" && xt(t) === n.label ? t : lo(e, n);
}
function Yr(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = ie(e);
  return t ? ve(t).cardText(e, n) : n.label;
}
function lo(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = ie(e);
  return t ? ve(t).noteText(e, n) : n.label;
}
function ct(e, n) {
  const t = e.cards.find((r) => r.id === n);
  if (!t) return "That card is no longer on the board.";
  if (tn(e)) return "This card stays on the board.";
  if (e.lanes.some((r) => r.station) && !t.free) return "The token stays on the map.";
  if (e.kind === "release-plan") {
    const r = e.cards.find((o) => o.dependsOn?.includes(n));
    if (r) return `${r.label} depends on ${t.label}, so it stays a card.`;
  }
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((r) => r.cardId === n)) return `An outcome on this board depends on ${t.label}, so it stays a card.`;
  if (e.cards.some((r) => r.parentId === n)) return `${t.label} has cards under it, so it stays a card. Move them first.`;
  if (t.allowedLaneIds && t.allowedLaneIds.length < e.lanes.length) {
    const r = t.allowedLaneIds.map((i) => e.lanes.find((c) => c.id === i).label), o = r.length > 1 ? r.slice(0, -1).join(", ") + " or " + r.at(-1) : r[0];
    return `${t.label} may only be in ${o}, so it stays a card.`;
  }
  return null;
}
function pr(e, n, t = Zr(e, n)) {
  if (ct(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const c = { ...i, dependsOn: i.dependsOn.filter((p) => p !== n) };
    return c.dependsOn.length || delete c.dependsOn, c;
  }), o = e.lines?.map((i) => It(i, n, t));
  return X({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Ps(e, n, t = Zr(e, n)) {
  const r = new Set(e.cards.filter((c) => c.id !== n).map((c) => c.id)), o = (e.lines ?? []).filter((c) => c.parentId === n || c.childId === n).map((c) => It(c, n, t)), i = (c) => r.has(c.parentId) || r.has(c.childId);
  return { stay: o.filter(i), leave: o.filter((c) => !i(c)) };
}
function Zr(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? Rr(t) : n;
}
function Jt(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function Bn(e, n) {
  if (e.kind) return Os;
  let t;
  try {
    t = kn(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = jr(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= yn ? `A workshop holds up to ${yn} lines.` : null;
}
const Os = "Lines join the cards of a lane workshop to notes and to each other.";
function ut(e, n) {
  return Bn(e, n) !== null ? null : X({ ...e, lines: Ur(e, [kn(n)]) });
}
function mr(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? X({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function Vr(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((c) => c.id));
  let i = `${n}->${t}`;
  for (let c = 2; o.has(i); c++) i = `${n}->${t}~${c}`;
  return kn({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function Es(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function Ms(e, n) {
  return Xr(e, n, !1);
}
function Fe(e, n) {
  return Xr(e, n, !0);
}
function Xr(e, n, t) {
  const r = e.lanes.find((y) => y.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const y = en(e, n);
    return r.capacity ? y + (t ? " of " : " / ") + r.capacity + " points" : y + " points";
  }
  const o = ie(e);
  if (o) return ve(o).caption(e, n);
  const i = Gs(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const c = e.cards.filter((y) => y.laneId === n).length, p = e.behaviour ? ke().laneLimit(e, n) : r.capacity, h = He(e, n), C = (y) => y + (y === 1 ? " card" : " cards");
  return t ? p !== void 0 && h !== c ? h + " of " + p + " · " + C(c - h) : p !== void 0 ? c + " of " + p : C(c) : p !== void 0 && h !== c ? h + " / " + p + " · +" + (c - h) : p !== void 0 ? c + " / " + p : String(c);
}
function Ns(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || ie(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? ke().laneLimit(e, n) : t.capacity;
  return r !== void 0 && He(e, n) >= r;
}
const Gn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, fn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Qr(e, n = Gn, t = 28, r) {
  const { pitch: o, row: i, top: c } = n, p = !!e.lanes[0].station, h = e.lanes.map((x) => e.cards.filter((b) => b.laneId === x.id).length), C = c + Math.max(1, ...r ?? h) * i + 36, y = e.lanes.map((x, b) => ({
    x: p ? x.station.column * (o + t) : b * o,
    y: p ? x.station.row * C : 0
  }));
  return {
    points: y,
    width: Math.max(...y.map((x) => x.x)) + o,
    height: Math.max(...y.map((x, b) => x.y + c + (p ? Math.max(1, h[b]) : h[b] + 1) * i))
  };
}
function wa() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Un(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function ei(e) {
  const n = X(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function _s(e, n) {
  const t = ei(e), r = Un(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), X(t);
}
function Rs(e, n, t) {
  const r = ei(e);
  return r.cards.push({
    id: Un(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), X(r);
}
function ga() {
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
function wr(e, n, t) {
  const r = X(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((y) => y.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= ko) throw new Error("A map can have up to five stations.");
  const i = Ae(t?.label), c = Ae(t?.outcome, 160), p = Un(r, "station");
  let h, C = 1 / 0;
  for (let y = 0; y < io; y++)
    for (let x = 0; x < io; x++) {
      if (r.lanes.some((L) => L.station.column === x && L.station.row === y)) continue;
      const b = Math.abs(o.station.column - x) + Math.abs(o.station.row - y);
      b < C && (C = b, h = { column: x, row: y });
    }
  if (!h) throw new Error("There is no free station position.");
  return o.station.next.push(p), r.lanes.push({ id: p, label: i, station: { ...h, next: [], outcome: c, ...t.image === void 0 ? {} : { image: Wr(t.image) } } }), r.presentationOrder?.push(p), r;
}
const ya = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, co = (e) => "caption-" + e, mn = (e) => "column-" + e, gr = "rules-board";
function Kn(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function ka(e, n) {
  const t = Kn(n);
  return t ? t + ":" + e : e;
}
const Q = {
  lane: gn,
  card: Be,
  image: gt,
  caption: co,
  column: mn,
  rules: gr,
  of(e) {
    const n = Kn(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(gn(r)),
      card: (r) => t(Be(r)),
      image: (r) => t(gt(r)),
      caption: (r) => t(co(r)),
      column: (r) => t(mn(r)),
      rules: t(gr)
    };
  }
};
function ni(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function ti(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function wn(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function yr(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function kr(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((p, h) => p + Math.max(1, Math.ceil(h.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const oi = 152, uo = oi + 12, Ws = 12;
function Fs(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function _e(e, n = {}) {
  const t = X(e), { pitch: r, row: o, top: i } = Gn, c = t.lanes.map((b) => t.cards.filter((L) => L.laneId === b.id).length), p = (b) => Math.max(c[b], (Array.isArray(n.rows) ? n.rows[b] : n.rows) ?? 0), h = !!t.lanes[0].station, C = t.lanes.some((b) => b.station?.image), y = Fs(n.layout, t.lanes.length), x = [];
  if (h) {
    const { points: b } = Qr(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach((L, I) => x.push({
      laneId: L.id,
      x: b[I].x,
      y: b[I].y + (C ? L.station.row * uo : 0),
      width: r,
      height: i + (L.station.image ? uo : 0) + Math.max(1, p(I)) * o,
      column: L.station.column,
      row: L.station.row
    }));
  } else {
    let b = 0;
    for (let L = 0; L < t.lanes.length; L += y) {
      const I = t.lanes.slice(L, L + y), $ = i + (Math.max(...I.map((_, U) => p(L + U))) + 1) * o;
      I.forEach((_, U) => x.push({ laneId: _.id, x: U * r, y: b, width: r, height: $, column: U, row: L / y })), b += $ + Ws;
    }
  }
  return { places: x, width: Math.max(...x.map((b) => b.x + b.width)), height: Math.max(...x.map((b) => b.y + b.height)) };
}
function Ds(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: c } = Gn, p = n.origin ?? { x: 0, y: 0 }, h = !!e.lanes[0].station, { places: C } = _e(e, n), y = n.style ?? {}, x = y.textColor ?? Nn.fontColor, b = y.borderColor ?? Nn.borderColor, L = y.borderWidth ?? Nn.borderWidth, I = y.cornerRadius ?? 0, $ = y.fontSize ?? Nn.fontSize, _ = y.laneFontSize ?? $ + 2, U = y.captionFontSize ?? Math.max(11, $ - 1), l = [], v = (A) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: wn(A.width, A.height, I),
      foregroundColor: x,
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
      vectorPath: wn(t - 4, R.height, I ? I + 2 : 0),
      backgroundColor: h ? "#fcf9ed" : yr(fn[E], 0.6),
      borderColor: h ? "#a8b5aa" : yr(fn[E], 0.1),
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
      fontSize: kr(A.label, _, r - 16, 50)
    });
    const z = h ? "" : Ms(e, A.id), se = U, ee = h ? r : Math.min(r, Math.max(40, Math.ceil(z.length * se * 0.6) + 24));
    v({
      id: co(A.id),
      text: z,
      name: A.label,
      xPos: W + 8 + Math.round((r - ee) / 2),
      yPos: B + 68,
      width: ee,
      height: 22,
      vectorPath: wn(ee, 22, h ? 0 : 11),
      backgroundColor: h ? "transparent" : Ns(e, A.id) ? fn[E % fn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: se
    }), M && l.push({ options: {
      id: gt(A.id),
      name: M.alt,
      text: "",
      xPos: W + 8,
      yPos: B + c,
      width: r,
      height: oi,
      shapeHint: "rectangle",
      image: M.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((ye) => ye.laneId === A.id).forEach((ye, vn) => {
      const on = Yr(e, ye), te = h ? r - 20 : r, pe = h ? i - 6 : i, ze = h && !ye.free, re = ze ? {} : { ...y.card, ...ye.look }, Ge = ze ? I : y.card?.cornerRadius ?? I;
      v({
        id: Be(ye.id),
        text: on,
        name: ye.label,
        xPos: W + (h ? 18 : 8),
        yPos: B + c + (M ? uo : 0) + vn * o,
        width: te,
        height: pe,
        ...Ge !== I ? { vectorPath: wn(te, pe, Ge) } : {},
        backgroundColor: ze ? "#ffda75" : re.backgroundColor ?? y.backgroundColor ?? Nn.backgroundColor,
        ...re.textColor ? { foregroundColor: re.textColor } : {},
        ...re.fontFamily ? { fontFamily: re.fontFamily } : {},
        ...re.borderColor ? { borderColor: re.borderColor } : {},
        ...re.borderWidth !== void 0 ? { borderWidth: re.borderWidth } : {},
        fontSize: kr(on, re.fontSize ?? $, te - 16, pe - 8)
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
        const R = Be(E), W = Be(A.id);
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
  if (ni(l, Kn(n.scope)), n.beside) {
    const A = new Set(n.beside), E = new Set(l.map((B) => B.options.id)), R = /* @__PURE__ */ new Map();
    for (const B of [...E]) {
      if (!A.has(B)) continue;
      const M = ti(B, (z) => A.has(z) || E.has(z));
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
function ba(e, n, t = {}) {
  return e.behaviour ? ke().note(e, n, t) : null;
}
function js(e, n) {
  const t = X(e), r = Kn(n?.scope);
  if (n?.native) return Ds(t, n);
  const { width: o, row: i, height: c, top: p } = Gn, h = [];
  function C(I, $, _, U, l, v) {
    h.push({ options: {
      id: I,
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
  const { points: y } = Qr(t), x = 152, b = x + 12, L = t.lanes.some((I) => I.station?.image);
  t.lanes.forEach((I, $) => {
    const _ = y[$].x, U = y[$].y + (L ? (I.station?.row ?? 0) * b : 0), l = I.station?.image, v = t.kind === "release-plan" ? I.label + `
` + (I.capacity ? en(t, I.id) + " / " + I.capacity + " points" : en(t, I.id) + " points") : I.label;
    C(gn(I.id), v, _, U, p - 12, fn[$]), l && h.push({ options: {
      id: gt(I.id),
      name: l.alt,
      text: "",
      xPos: _,
      yPos: U + p,
      width: o,
      height: x,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((S) => S.laneId === I.id).forEach((S, A) => C(Be(S.id), Yr(t, S), _, U + p + (l ? b : 0) + A * i, c, "#fffdf6"));
  });
  for (const I of t.lanes) {
    if (!I.station) continue;
    const $ = h.find((_) => _.options.id === gn(I.id));
    $.relationships.associations = I.station.next.map((_) => ({ id: I.id + "-to-" + _, parentId: $.options.id, childId: gn(_), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), $.options.text = I.label + `
` + I.station.outcome, $.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const I = new Map(h.map(($) => [$.options.id, $]));
    for (const $ of t.cards)
      for (const _ of $.dependsOn ?? []) {
        const U = Be(_), l = Be($.id);
        I.get(U).relationships.associations.push({
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
  return ni(h, r), { options: { name: t.title }, shareId: "", nodes: h };
}
function Bs(e, n = {}, t) {
  const r = X(e), o = n.narrow ? void 0 : n.width;
  if (ie(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: p, height: h } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(p, o ?? 0), height: h };
  }
  const { width: i, height: c } = _e(r, {});
  return { width: Math.max(ko * Gn.pitch, i), height: c };
}
function Hs(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((c) => [c.x, c.y, c.width, c.height].every(Number.isFinite));
  for (let c = 0; c <= i.length; c++) {
    const p = i.find((h) => o < h.x + h.width + r && o + e.width > h.x - r && e.y < h.y + h.height + r && e.y + e.height > h.y - r);
    if (!p) break;
    o = t > 0 ? p.x + p.width + r : p.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const va = {
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
}, fo = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], xo = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function xa() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: fo.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: fo.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function Ia() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...xo.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function tn(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...xo.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => fo.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function zs(e, n, t) {
  const r = tn(e), o = e.cards.find((c) => c.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const c = e.cards.find((p) => p.laneId === t);
    if (c) {
      if (!yt(e, c).some((p) => p.id === "interviews")) return null;
      i = so(e, c.id, "interviews");
    }
  }
  return yt(i, o).some((c) => c.id === t) ? so(i, n, t) : null;
}
function Gs(e, n) {
  if (tn(e) !== "experiment-budget") return null;
  const t = xo.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  rs as CHROME_CHIPS_MAX_SCALE,
  Lr as CHROME_MAX_SCALE,
  Nn as DEFAULT_NOTE_STYLE,
  os as DRAFT_TAG,
  vr as WORKSHOP_BOARD_KINDS,
  lt as WorkshopReferenceError,
  wr as addWorkshopBranch,
  Rs as addWorkshopCard,
  _s as addWorkshopLane,
  Ve as applyWorkshopEdits,
  fa as attachWorkshop,
  yt as availableLanes,
  ba as behaviourNote,
  or as boardBadgeShapes,
  Pr as boardChromeBox,
  is as boardChromeLabel,
  Tr as boardChromeLayout,
  tr as boardChromeShapes,
  ua as boardChromeStyles,
  mo as boardLegend,
  ys as businessBoardKinds,
  ie as businessKind,
  Ki as canHangPanel,
  xo as channels,
  Ui as checkWorkshopReplacement,
  he as chromeInk,
  $r as chromeScaleAt,
  Qt as chromeTagScaleAt,
  Ni as countWord,
  Xi as createBoardLayer,
  Ia as createBudgetWorkshop,
  xa as createInterviewWorkshop,
  wa as createLaneWorkshop,
  ga as createWorkshopMap,
  ma as decodeWorkshopFragment,
  ca as describeFocusDarkroom,
  ra as describeWorkshopEdits,
  pa as encodeWorkshopFragment,
  Zs as handoffSummary,
  aa as hangGalleryPanel,
  va as industrialWorkshop,
  da as initialFocusDarkroom,
  fo as interviews,
  Wi as isRuleEdit,
  fn as laneColors,
  hn as layerInk,
  Qe as listed,
  nt as listeningRoom,
  Xs as listeningRoomCaption,
  Fn as maxWorkshopCards,
  yn as maxWorkshopLines,
  ia as moonGallery,
  so as moveWorkshopCard,
  oa as named,
  Un as nextWorkshopId,
  ya as nightTransfer,
  la as normalizeFocusDarkroom,
  Vs as normalizeListeningRoom,
  sa as normalizeMoonGallery,
  qs as normalizeOfflineHandoff,
  Ks as offlineHandoff,
  zs as planStartupMove,
  _i as pointing,
  Ar as printFields,
  ta as registerRulebook,
  ea as registerWorkshopRules,
  en as releaseLoad,
  Qs as releasePlan,
  pn as renderLayerShapes,
  Ys as resolveHandoff,
  Ss as resolveWorkshopSignals,
  Js as reviewHandoff,
  wn as roundedBox,
  ke as rulebook,
  Ei as rulebookLoaded,
  O as said,
  tn as startupExperienceKind,
  ho as unquoted,
  X as validateWorkshop,
  ht as workshopBoardKind,
  Kn as workshopBoardScope,
  Gs as workshopBudgetResult,
  Dn as workshopCandidate,
  pr as workshopCardAsNote,
  ct as workshopCardAsNoteRefusal,
  xt as workshopCardLabelOf,
  Ps as workshopCardLines,
  Dr as workshopCardLookOf,
  lo as workshopCardNoteText,
  hr as workshopCardNoteWords,
  Yr as workshopCardText,
  ur as workshopDestinations,
  Vt as workshopEditKinds,
  Yt as workshopFinder,
  Hs as workshopFreeSpot,
  cr as workshopKeepsLink,
  ro as workshopKeepsPicture,
  Ms as workshopLaneCaption,
  Ns as workshopLaneFull,
  He as workshopLaneHeld,
  _e as workshopLanePlaces,
  Fe as workshopLaneSpoken,
  Gn as workshopLayout,
  Bn as workshopLineRefusal,
  Jt as workshopLinesOf,
  Os as workshopLinesSentence,
  nn as workshopNewCardName,
  Vr as workshopNewLine,
  Q as workshopNodeIds,
  Wn as workshopNoteCandidate,
  Rr as workshopNoteIdOf,
  Xe as workshopNoteRefusal,
  Qr as workshopPositions,
  yo as workshopPresentationLanes,
  ha as workshopPresentationScenes,
  ji as workshopReferences,
  jn as workshopRefusal,
  un as workshopRenamedLines,
  Bs as workshopReserve,
  Xo as workshopRuleSchema,
  ve as workshopRules,
  na as workshopRulesLoaded,
  ka as workshopScopedId,
  ti as workshopStandInId,
  Cs as workshopTakesLines,
  qt as workshopTakesNotes,
  js as workshopToSlate,
  ut as workshopWithLine,
  Es as workshopWithoutCardLines,
  mr as workshopWithoutLine
};
