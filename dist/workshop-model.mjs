import { D as Rn } from "./NoteDefaults-1xFW0br8.mjs";
const Qs = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function ea(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: c, fallback: p } = e, h = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !h(i) || !h(c) || !h(p) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: c.trim(), fallback: p.trim() };
}
function na(e) {
  return { ...e, stage: "review", choice: null };
}
function ta(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function oa(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const tt = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function ra(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, c = (p) => typeof p == "string" && p.trim().length > 0 && p.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(p);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !c(o) || !c(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function ia({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === tt.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === tt.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === tt.leftLabel && t === tt.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
function on(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function Ni(e) {
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
    if (on(e, c.id) > (c.capacity ?? 1 / 0)) throw new Error(`Release "${c.label}" exceeds its point budget.`);
  }
}
function Gn(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((I, b) => [I.id, b])), o = r.get(t);
  if (o === void 0) return null;
  const i = o < r.get(n.laneId), c = /* @__PURE__ */ new Set([n.id]), p = [n];
  for (; p.length; ) {
    const I = p.pop();
    for (const b of e.cards) {
      if (c.has(b.id)) continue;
      const $ = r.get(b.laneId);
      (i ? $ > o && I.dependsOn?.includes(b.id) : $ < o && b.dependsOn?.includes(I.id)) && (c.add(b.id), p.push(b));
    }
  }
  if (e.cards.filter((I) => c.has(I.id)).some((I) => I.allowedLaneIds && !I.allowedLaneIds.includes(t))) return null;
  const C = { ...e, cards: e.cards.map((I) => c.has(I.id) ? { ...I, laneId: t } : I) }, k = e.lanes[o].capacity;
  return k !== void 0 && on(C, t) > k ? null : C;
}
const sa = {
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
}, bt = /* @__PURE__ */ new Map(), _i = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function aa(e) {
  bt.set(e.kind, e);
}
function la(e) {
  return typeof e == "string" && bt.has(e);
}
function rn(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? bt.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function ve(e) {
  const n = bt.get(e);
  if (!n) throw new Error(`The ${_i[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let ht = null;
function da(e) {
  ht = e;
}
function Ri() {
  return ht !== null;
}
function ke() {
  if (!ht) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return ht;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", en = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Xo = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), mo = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), wo = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ca = (e) => mo(wo(e)), Wi = [
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
], Fi = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Wi.indexOf(e.toLowerCase()), Di = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Ir(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = mo(o);
    i && t.add(i);
  };
  r(e), r(wo(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const Bt = "[^\\p{L}\\p{N}]", Qo = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Xo(n) + "(?:$|" + Bt + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Bt + ")" + Xo(n) + "(?:$|" + Bt + ")", "u").test(e)
], er = ["first", "second", "third", "fourth", "fifth"];
function ji(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + er.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(mo(wo(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? er.indexOf(o) : Fi(o) - 1;
  return e[i] ?? null;
}
function Ht(e, n, t, r, o) {
  const i = Ir(n, t);
  if (i.some((p) => Di.test(p))) {
    const p = r && e.find((h) => h.id === r);
    return p ? { item: p, rank: 0 } : { pointing: !0 };
  }
  for (const p of i) {
    if (!p.startsWith("@")) continue;
    const h = e.find((C) => C.id === p.slice(1));
    if (h) return { item: h, rank: 0 };
  }
  for (const [p, h] of Qo.entries())
    for (const C of i) {
      const k = e.filter((I) => h(I.label.toLowerCase(), C.toLowerCase()));
      if (k.length === 1) return { item: k[0], rank: p };
      if (k.length > 1) return { several: k };
    }
  const c = o ? ji(e, n, t) : null;
  return c ? { item: c, rank: Qo.length } : {};
}
class dt extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function Vt(e, n, t, r, o = !1) {
  return { find: (h) => {
    const C = Ht(e, h, n, r, o);
    if (C.item) return C.item;
    const k = Ir(h, n), I = k[k.length - 1];
    if (C.pointing) throw new dt("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const $ = [...new Set(C.several.map((x) => x.label))];
      throw new dt($.length === 1 ? C.several.length + " " + t + "s are called " + P($[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + P(I) + ": " + en($.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", C.several.map((x) => x.id));
    }
    const b = e.map(($) => $.label);
    throw new dt("There is no " + t + " called " + P(I) + " here." + (b.length && b.length <= 6 ? " The " + t + "s are " + en(b.map(P)) + "." : b.length ? "" : " There are no " + t + "s yet."), "unknown", e.map(($) => $.id));
  }, attempt: (h) => Ht(e, h, n, r, o).item ?? null, rank: (h) => Ht(e, h, n, r, o).rank ?? 1 / 0 };
}
const Ar = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Ne = [...Ar], fn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Sr = Ar.slice(5);
function pt(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ie(e);
  return n || (e.kind === "release-plan" ? "release-plan" : sn(e) ?? "lanes");
}
const j = {
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
}, Xt = {
  "launch-plan": j.launchLanes,
  pipeline: j.pipelineLanes,
  budget: j.budgetLanes,
  "hiring-plan": j.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, fe = (e, n) => Object.fromEntries(Ne.filter((t) => !e.includes(t)).map((t) => [t, n])), ue = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), ne = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), oe = (e) => ({ type: "ref", of: "card", about: e }), zt = (e) => ({ map: e }), Ee = fe(["map"], j.notMap), Te = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), Qt = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ue(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Ne,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: ne("The lane or step."), label: ue(80, "The new name, 1 to 80 characters of plain text.") },
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
    fields: { label: ue(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": j.releaseLanes, "customer-interviews": j.keepsLanes, "experiment-budget": j.keepsLanes, map: j.mapAddLane, ...Xt }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: ne("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": j.releaseLanes, "customer-interviews": j.keepsLanes, "experiment-budget": j.keepsLanes, ...Xt }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: ne("The lane or step it starts in."),
      label: ue(80, "What the card says. Left out, the card takes the board’s name for a new item: “New card”, “New hire”, “New task”, “New deal” (on a map, a token is numbered; a free card is “New stop”).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Te("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Te("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Te("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...Sr],
    refusals: { "release-plan": j.releaseCards, "customer-interviews": j.keepsCards }
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
    fields: {
      card: oe("The card or token."),
      lane: ne("Where it goes."),
      override: { type: "flag", optional: !0, about: "True to move it anyway when a rule refuses it (lane boards and maps), once the person agreed to break that rule. The card shows who moved it anyway and when." }
    },
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
    refusals: { "launch-plan": j.launchLanes, budget: j.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: oe("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: fn,
    refusals: { ...zt(j.mapCardLanes), ...fe([...fn, "map"], j.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: oe("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], j.notPoints), map: j.mapPoints }
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
    refusals: { ...fe(["release-plan"], j.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: oe("The card."),
      lane: ne("The lane."),
      whenPresent: ue(160, "What it says when the card is there."),
      whenAbsent: ue(160, "What it says otherwise."),
      label: ue(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: fn,
    refusals: { ...zt(j.mapOutcome), ...fe([...fn, "map"], j.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: oe("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: fn,
    refusals: { ...zt(j.mapOutcome), ...fe([...fn, "map"], j.businessCards) }
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
    fields: { from: ne("The step it follows."), label: ue(80, "The new step’s name."), outcome: ue(160, "What it says when a token arrives. Left out, its name.", !0) },
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
      label: ue(80, "The new step’s name."),
      outcome: ue(160, "What it says when a token arrives. Left out, its name.", !0)
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
    fields: { station: ne("The step."), outcome: ue(160, "What it says.") },
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
    fields: { station: ne("The step."), alt: ue(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Ee
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: oe("The card the line starts at."), to: oe("The card it points to."), label: ue(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: ot()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: oe("One card."), to: oe("The other card.") },
    boards: ["lanes"],
    refusals: ot()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: oe("The card."),
      note: ue(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: ue(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: ot()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: oe("The card."), note: ue(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: ot()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: oe("The task."), duration: Te("Its days, 1 to 60.", 60, 1, !0), lag: Te("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], j.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], j.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], j.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: Te("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], j.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: oe("The deal or line item."), amount: Te("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: fe(["pipeline", "budget"], j.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Te("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: fe(["pipeline"], j.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: ne("The team giving."), to: ne("The team receiving."), amount: Te("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: fe(["budget"], j.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: Te("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: fe(["budget"], j.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], j.noRules)
  },
  {
    kind: "set_rule",
    summary: "Change a rule: on, severity, max (a limit) or to (a path).",
    intent: !1,
    fields: {
      rule: ue(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], j.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: ue(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: fe(["lanes", "pipeline"], j.noRules) }
];
function ot() {
  return { ...fe(["lanes"], j.businessLines), "release-plan": j.lines, "customer-interviews": j.lines, "experiment-budget": j.lines, map: j.lines };
}
const Bi = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", nr = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, Hi = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function zi(e, n) {
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
      return { ...r({ type: "integer", minimum: e.min, maximum: Hi(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: nr.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...nr.keys
      }, description: e.about };
  }
}
const Cr = (e) => "optional" in e && e.optional === !0;
function ua(e) {
  const n = e ? pt(V(e)) : void 0;
  return Qt.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, c]) => !Cr(c)).map(([c]) => c)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([c, p]) => [c, zi(p, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const rt = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function Gi(e, n) {
  const t = !!e.lanes[0]?.station, r = Vt(e.lanes, t ? rt.step : rt.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = Vt(e.cards, t ? rt.token : rt.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const i = e.cards.filter((p) => !p.free), c = (p) => i.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(p.trim()) ? i[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (p) => c(p) ?? o.find(p),
    attempt: (p) => c(p) ?? o.attempt(p),
    rank: (p) => c(p) ? 0 : o.rank(p)
  } };
}
class B {
  constructor(n, t, r = null, o, i, c) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = i, this.limits = c;
  }
}
function mt(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function J(e, n, t = null, r) {
  try {
    return V(e);
  } catch (o) {
    throw new B(mt(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function Ui(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (Cr(o)) continue;
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
function Ki(e, n, t, r, o) {
  const i = structuredClone(e), c = t === "map", p = t === "release-plan", h = Gi(i, r), C = { lane: c ? "step" : "lane", card: c ? "token" : "card" };
  function k(l, v, S, A, E = null) {
    if (typeof S == "object") {
      const W = l.find((F) => F.id === S.id);
      if (!W) throw new B("That " + A + " is no longer on the workshop.", "gone", E);
      return W;
    }
    const R = l.find((W) => W.id === S);
    if (R) return R;
    try {
      return v.find(S);
    } catch (W) {
      if (!(W instanceof dt)) throw W;
      const F = W.reason === "ambiguous" ? "ambiguous_reference" : W.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new B(W.message, F, E, void 0, W.candidates.length ? W.candidates : void 0);
    }
  }
  const I = (l, v = null) => k(i.lanes, h.lanes, l, "lane", v), b = (l, v = null) => k(i.cards, h.cards, l, "card", v), $ = (l) => {
    try {
      return I(l);
    } catch {
      return null;
    }
  }, x = (l, v, S = {}, A = !0) => ({ board: l, said: v, changed: A, ...S }), L = (l) => ze(i, l), _ = (l) => c ? "The presentation opens with " + P(l[0].label) + "." : "The presentation now runs " + l.map((v) => P(v.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return ke().edit(i, n, o, {
      lane: (l) => I(l),
      card: (l) => b(l),
      done: (l, v, S) => x(l, v, S),
      refuse: (l, v = {}) => {
        throw new B(l, v.code ?? "refused", v.laneId ?? null, v.cardId);
      }
    });
  if (Sr.includes(t)) {
    n.kind === "add_card" && tr(n, t, I(n.lane).id);
    const l = {
      card: (S) => b(S),
      lane: (S) => I(S),
      refuse: (S, A = {}) => {
        throw new B(S, A.code ?? "refused", A.laneId ?? null, A.cardId, void 0, A.limits);
      },
      settle: (S, A = null, E) => J(S, t, A, E),
      done: (S, A, E) => x(S, A, E)
    }, v = ve(t).edit(i, n, l);
    if (v) return v;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const l = J(i, t);
      return x(l, "Renamed the " + (c ? "map" : "workshop") + " to " + P(l.title) + ".");
    }
    case "rename_lane": {
      const l = I(n.lane), v = l.label;
      l.label = n.label;
      const S = J(i, t, l.id);
      return x(S, "Renamed " + P(v) + " to " + P(S.lanes.find((A) => A.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = b(n.card), v = l.label;
      l.label = n.label;
      const S = J(i, t, l.laneId, l.id);
      return x(S, "Renamed " + P(v) + " to " + P(S.cards.find((A) => A.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new B("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new B("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = Hs(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (S) {
        throw new B(mt(S.message, t), "refused");
      }
      const v = l.lanes[l.lanes.length - 1];
      return x(l, "Added the lane " + P(v.label) + ".", { laneId: v.id });
    }
    case "remove_lane": {
      const l = I(n.lane), v = i.cards.filter((S) => S.laneId === l.id);
      if (c) {
        if (v.length) throw new B(P(v[0].label) + " is at " + P(l.label) + ". Move it to another step first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new B("A map needs at least two steps.", "refused", l.id);
      } else {
        if (v.length) throw new B(P(l.label) + " holds " + v.length + (v.length === 1 ? " card" : " cards") + ". Move or remove " + (v.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new B("A workshop needs at least two columns.", "refused", l.id);
      }
      i.lanes = i.lanes.filter((S) => S !== l);
      for (const S of i.lanes) S.station && (S.station.next = S.station.next.filter((A) => A !== l.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((S) => S !== l.id));
      for (const S of i.cards) S.allowedLaneIds && (S.allowedLaneIds = S.allowedLaneIds.filter((A) => A !== l.id));
      return it(i, (S) => S.laneId === l.id), i.behaviour && (i.behaviour = ke().dropLane(i.behaviour, l.id)), x(J(i, t), "Removed the " + C.lane + " " + P(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = I(n.lane);
      if (c) {
        if (n.allowedLanes !== void 0) throw new B(j.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new B("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const N = Kn(i, "card");
          i.cards.push({ id: N, label: It(n.label?.trim() || rn(i)), laneId: l.id, free: !0 });
          const G = J(i, t, l.id);
          return x(G, "Added " + P(G.cards.find((se) => se.id === N).label) + " to " + P(l.label) + ".", { laneId: l.id, cardId: N });
        }
        let E = n.label;
        if (E === void 0) {
          let N = i.cards.length + 1;
          for (; i.cards.some((G) => G.label === "Token " + N); ) N++;
          E = "Token " + N;
        }
        const R = new Set([...i.lanes, ...i.cards].map((N) => N.id));
        let W = 1;
        for (; R.has("token-" + W); ) W++;
        i.cards.push({ id: "token-" + W, label: E, laneId: l.id });
        const F = J(i, t, l.id);
        return x(F, "Added " + P(F.cards[F.cards.length - 1].label) + " at " + P(l.label) + ".", { laneId: l.id, cardId: "token-" + W });
      }
      if (tr(n, t, l.id), i.cards.length >= 24) throw new B("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && L(l.id) >= l.capacity)
        throw new B(P(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", l.id);
      const v = n.allowedLanes && [...new Set(n.allowedLanes.map((E) => I(E).id))];
      let S;
      try {
        S = zs(i, l.id, { label: n.label?.trim() || rn(i), ...v && { allowedLaneIds: v } });
      } catch (E) {
        throw new B(mt(E.message, t), "refused", l.id);
      }
      const A = S.cards[S.cards.length - 1];
      return x(S, "Added " + (A.label ? P(A.label) : "an empty card") + " to " + P(l.label) + ".", { laneId: l.id, cardId: A.id });
    }
    case "remove_card": {
      const l = b(n.card);
      if (c && !l.free && i.cards.filter((v) => !v.free).length === 1) throw new B("A map needs at least one token.", "refused", l.laneId, l.id);
      if (p && i.cards.length === 1) throw new B("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new B("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      i.cards = i.cards.filter((v) => v !== l);
      for (const v of i.cards)
        v.dependsOn?.includes(l.id) && (v.dependsOn = v.dependsOn.filter((S) => S !== l.id), v.dependsOn.length || delete v.dependsOn);
      return it(i, (v) => v.cardId === l.id), x(J(Ds(i, l.id), t, l.laneId), "Removed the " + C.card + " " + P(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? i.lanes.find((A) => A.id === n.lane.id) ?? null : $(n.lane), v = b(n.card, l?.id ?? null), S = I(n.lane, v.laneId);
      return U(v, S, n.override === !0);
    }
    case "advance_card": {
      const l = b(n.card), v = i.lanes.find((A) => A.id === l.laneId), S = v.station.next.map((A) => i.lanes.find((E) => E.id === A)).filter((A) => !!A);
      if (!S.length) throw new B(P(l.label) + " is at " + P(v.label) + ", and no path leads on from there.", "refused", v.id, l.id);
      if (S.length > 1)
        throw new B("From " + P(v.label) + " the path goes to " + S.map((A) => P(A.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + S[0].label + "”.", "refused", v.id, l.id);
      return U(l, S[0]);
    }
    case "set_lane_capacity": {
      const l = I(n.lane), v = i.behaviour && ke().setLimit(i, l.id, n.capacity, o);
      if (typeof v == "string") throw new B(v, "refused", l.id);
      if (v) return x(v, P(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const S = c ? "token" : p ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, x(J(i, t, l.id), c ? "Removed the limit at " + P(l.label) + "." : P(l.label) + " now holds any number of " + S + "s.", { laneId: l.id });
      const A = p ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > A)
        throw new B((c ? "A step" : "A lane") + " can hold from 1 to " + A + " " + S + "s.", "refused", l.id);
      const E = p ? i.cards.reduce((R, W) => R + (W.laneId === l.id ? W.points ?? 1 : 0), 0) : L(l.id);
      if (E > n.capacity)
        throw new B(P(l.label) + " already holds " + E + " " + S + (E === 1 ? "" : "s") + ". Move some " + (c ? "on" : "out") + " first, or choose a higher " + (p ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, x(J(i, t, l.id), P(l.label) + " now holds up to " + n.capacity + " " + S + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = b(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, x(J(i, t, l.laneId, l.id), P(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const v = [...new Set(n.lanes.map((A) => I(A)))], S = i.lanes.find((A) => A.id === l.laneId);
      if (!v.includes(S)) throw new B(P(l.label) + " is in " + P(S.label) + " now. Include " + P(S.label) + ", or move the card first.", "refused", S.id, l.id);
      return l.allowedLaneIds = v.map((A) => A.id), x(J(i, t, l.laneId, l.id), P(l.label) + " can now go only in " + en(v.map((A) => P(A.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = b(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new B("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, x(J(i, t, l.laneId, l.id), P(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = b(n.card), v = [...new Set(n.dependsOn.map((A) => b(A)))], S = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const A = v.filter((E) => l.dependsOn?.includes(E.id));
        if (!A.length) throw new B(P(l.label) + " does not depend on " + en(v.map((E) => P(E.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter((E) => !A.some((R) => R.id === E)), l.dependsOn.length || delete l.dependsOn, x(J(i, t, l.laneId, l.id), P(l.label) + " no longer depends on " + en(A.map((E) => P(E.label))) + ".", S);
      }
      if (!v.length) {
        if (n.mode === "add") throw new B("Name the features " + P(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, x(J(i, t, l.laneId, l.id), P(l.label) + " no longer depends on anything.", S);
      }
      if (v.includes(l)) throw new B("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...v.map((A) => A.id)])], x(J(i, t, l.laneId, l.id), P(l.label) + " now depends on " + en(v.map((A) => P(A.label))) + ".", S);
    }
    case "set_outcome": {
      const l = b(n.card), v = I(n.lane), S = i.signals ?? (i.signals = []), A = n.label, E = A === void 0 ? S.filter((N) => N.cardId === l.id && N.laneId === v.id) : S.filter((N) => N.cardId === l.id && N.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && E.length > 1) throw new B("Two outcomes on this card have that name.", "refused", v.id, l.id);
      if (!E.length && S.length >= 24) throw new B("A workshop can have up to 24 outcomes. Remove one first.", "refused", v.id, l.id);
      let R = 1;
      for (; S.some((N) => N.id === "signal-" + R); ) R++;
      const F = { label: A ?? E[0]?.label ?? (l.label + " in " + v.label).slice(0, 80).trim(), cardId: l.id, laneId: v.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return E.length ? Object.assign(E[0], F) : S.push({ id: "signal-" + R, ...F }), x(J(i, t, v.id, l.id), "When " + P(l.label) + " is in " + P(v.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: v.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = b(n.card), v = (i.signals ?? []).filter((S) => S.cardId === l.id);
      if (n.outcome === void 0) {
        if (!v.length) throw new B(P(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        it(i, (S) => S.cardId === l.id);
      } else {
        const S = k(v, Vt(v, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        it(i, (A) => A.id === S.id);
      }
      return x(J(i, t, l.laneId, l.id), "Removed the outcome from " + P(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((v) => I(v));
      if (l.length !== i.lanes.length || new Set(l).size !== i.lanes.length) throw new B("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = l.map((v) => v.id), x(J(i, t), _(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new B("Say before or after, not both.", "invalid_edit");
      const l = I(n.lane), v = n.before ?? n.after, S = v === void 0 ? void 0 : I(v);
      if (S && S.id === l.id) throw new B("Choose two different scenes.", "refused", l.id);
      const A = bo(i).filter((E) => E.id !== l.id);
      return A.splice(S ? A.findIndex((E) => E.id === S.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), i.presentationOrder = A.map((E) => E.id), x(J(i, t, l.id), _(A), { laneId: l.id });
    }
    case "add_station": {
      const l = I(n.from);
      let v;
      try {
        v = kr(i, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new B(A.message, "refused", l.id);
      }
      const S = v.lanes[v.lanes.length - 1];
      return x(v, "Added a path from " + P(l.label) + " to " + P(S.label) + ".", { laneId: S.id });
    }
    case "insert_station": {
      const l = I(n.before), v = n.from === void 0 ? void 0 : I(n.from), S = v ? [v] : i.lanes.filter((R) => R.station.next.includes(l.id));
      if (v && !v.station.next.includes(l.id))
        throw new B("There is no path from " + P(v.label) + " to " + P(l.label) + ". Try “Add " + n.label + " after " + v.label + "”.", "refused", v.id);
      if (!S.length) throw new B("Nothing leads to " + P(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let A;
      try {
        A = kr(i, S[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (R) {
        throw new B(R.message, "refused", l.id);
      }
      const E = A.lanes[A.lanes.length - 1];
      for (const R of A.lanes)
        S.some((W) => W.id === R.id) && (R.station.next = [...new Set(R.station.next.map((W) => W === l.id ? E.id : W))]);
      return E.station.next = [l.id], x(J(A, t, E.id), "Added " + P(E.label) + " before " + P(l.label) + ".", { laneId: E.id });
    }
    case "connect_stations": {
      const l = I(n.from), v = I(n.to);
      if (l.id === v.id) throw new B("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(v.id) ? x(i, P(l.label) + " already leads to " + P(v.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(v.id), x(J(i, t, l.id), "Connected " + P(l.label) + " to " + P(v.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = I(n.from), v = I(n.to);
      if (!l.station.next.includes(v.id)) throw new B("There is no path between " + P(l.label) + " and " + P(v.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((S) => S !== v.id), x(J(i, t, l.id), "Removed the path from " + P(l.label) + " to " + P(v.label) + ".", { laneId: l.id });
    }
    case "set_station_outcome": {
      const l = I(n.station);
      return l.station.outcome = n.outcome, x(J(i, t, l.id), "Changed what happens at " + P(l.label) + ".", { laneId: l.id });
    }
    case "set_station_position": {
      const l = I(n.station);
      return Object.assign(l.station, { column: n.column, row: n.row }), x(J(i, t, l.id), "Moved " + P(l.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: l.id });
    }
    case "set_station_image": {
      const l = I(n.station);
      return n.image === null ? (delete l.station.image, x(J(i, t, l.id), "Removed the image at " + P(l.label) + ".", { laneId: l.id })) : (l.station.image = { src: n.image.src, alt: n.image.alt }, x(J(i, t, l.id), "Updated the image at " + P(l.label) + ".", { laneId: l.id }));
    }
    case "set_station_image_alt": {
      const l = I(n.station);
      if (!l.station.image) throw new B("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, x(J(i, t, l.id), "Updated the image description at " + P(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = b(n.card);
      let v = l.id, S, A;
      if (n.kind === "connect_cards") {
        const N = b(n.to, l.laneId);
        if (N.id === l.id) throw new B("A line joins two different cards.", "refused", l.laneId, l.id);
        S = N.id, A = P(N.label);
      } else {
        const N = n.note.trim();
        if (i.cards.some((G) => G.id === N) || i.lanes.some((G) => G.id === N))
          throw new B("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        S = N, A = "the note " + N, n.direction === "from_note" && ([v, S] = [S, v]);
      }
      const E = ei(i, v, S, n.label ? { label: n.label } : {}), R = Bn(i, E);
      if (R) throw new B(R, "refused", l.laneId, l.id);
      const W = ft(i, E), F = v === l.id;
      return x(
        W,
        F ? "Drew a line from " + P(l.label) + " to " + A + "." : "Drew a line from " + A + " to " + P(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = b(n.card), v = n.kind === "disconnect_cards" ? b(n.to, l.laneId).id : n.note.trim(), S = n.kind === "disconnect_cards" ? P(i.cards.find((R) => R.id === v).label) : "the note " + v, A = (R) => R.parentId === l.id && R.childId === v || R.parentId === v && R.childId === l.id, E = i.lines ?? [];
      return E.some(A) ? (i.lines = E.filter((R) => !A(R)), x(J(i, t, l.laneId, l.id), "Took away the line between " + P(l.label) + " and " + S + ".", { laneId: l.laneId, cardId: l.id })) : x(e, P(l.label) + " and " + S + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new B("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function U(l, v, S = !1) {
    const A = { laneId: v.id, cardId: l.id };
    if (l.laneId === v.id)
      return x(e, P(l.label) + " is already " + (c ? "at " : "in ") + P(v.label) + ".", A, !1);
    const E = nn(e, l.id, v.id);
    if (!E) {
      const R = tn(e, l.id, v.id) ?? "That move is not available.", W = zn(e, l.id, v.id, { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() });
      if (S && W) return x(J(W, t, v.id, l.id), "Moved " + P(l.label) + " to " + P(v.label) + " anyway. " + R, A);
      const F = new B(R, "refused", v.id, l.id);
      throw W && (F.overridable = !0), F;
    }
    return x(J(E, t, v.id, l.id), "Moved " + P(l.label) + " to " + P(v.label) + ".", A);
  }
}
function tr(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new B(r === "amount" ? j.notAmounts : j.notTasks, "not_on_this_board", t);
}
function it(e, n) {
  e.signals && (e.signals = e.signals.filter((t) => !n(t)), e.signals.length || delete e.signals);
}
function Xe(e, n, t = {}) {
  const r = (k) => ({ refused: { index: 0, kind: null, laneId: null, ...k } });
  let o;
  try {
    o = V(e);
  } catch (k) {
    return r({ reason: "The workshop cannot be read: " + (k instanceof Error ? k.message : String(k)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return r({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = o, c = [], p = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [k, I] of n.entries()) {
    const b = I?.kind, $ = Qt.find((v) => v.kind === b);
    if (!I || typeof I != "object" || !$)
      return r({
        index: k,
        kind: typeof b == "string" ? b : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(b)) + ". The edits are " + en(Qt.map((v) => v.kind)) + "."
      });
    const x = Ui(I, $);
    if (x) return r({ index: k, kind: $.kind, code: "invalid_edit", reason: x });
    const L = pt(o);
    if (!$.boards.includes(L))
      return r({ index: k, kind: $.kind, code: "not_on_this_board", reason: $.refusals[L] ?? "This workshop does not take " + $.kind + "." });
    let _;
    try {
      _ = Ki(o, I, L, t.selection, p);
    } catch (v) {
      if (!(v instanceof B)) throw v;
      return r({
        index: k,
        kind: $.kind,
        reason: v.reason,
        code: v.code,
        laneId: v.laneId,
        ...v.overridable && { overridable: !0 },
        ...v.cardId && { cardId: v.cardId },
        ...v.candidates && { candidates: v.candidates },
        ...v.limits && { limits: v.limits }
      });
    }
    const U = o.behaviour && !Bi($.kind) ? ke().check(o, _.board) : null;
    if (U && "refused" in U)
      return r({ index: k, kind: $.kind, reason: U.refused.sentence, code: "refused", laneId: U.refused.laneId, cardId: U.refused.cardId });
    const l = Yi(o, _.board);
    if (l) return r({ index: k, kind: $.kind, reason: l, code: "not_on_this_board", laneId: _.laneId ?? null });
    o = _.board, c.push({
      index: k,
      kind: $.kind,
      said: _.said,
      changed: _.changed ?? !0,
      ..._.laneId && { laneId: _.laneId },
      ..._.cardId && { cardId: _.cardId }
    });
  }
  const h = new Map(i.cards.map((k) => [k.id, k.laneId])), C = o.cards.flatMap((k) => {
    const I = h.get(k.id);
    return I === void 0 || I === k.laneId ? [] : [{ cardId: k.id, fromLaneId: I, toLaneId: k.laneId }];
  });
  return { workshop: o, report: { edits: c, movedCards: C } };
}
function qi(e, n) {
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
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? j.launchLanes : t && ve(t).fixed?.(e, n) || null;
}
const Ji = {
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
function Yi(e, n) {
  const t = V(e), r = pt(t);
  let o;
  try {
    o = V(n);
  } catch (h) {
    return mt(h instanceof Error ? h.message : String(h), r);
  }
  const i = pt(o), c = (h, C) => h.lanes.length === C.lanes.length && h.lanes.every((k) => C.lanes.some((I) => I.id === k.id)), p = (h, C) => h.lanes.every((k, I) => C.lanes[I]?.id === k.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return c(t, o) ? j.keepsCards : j.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !p(t, o)) return j.keepsOrder;
  if (ie(t) && i === r && !(c(t, o) && p(t, o))) return Xt[r];
  if (ie(t) && i === r) {
    const h = qi(t, o);
    if (h) return h;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!c(t, o)) return j.releaseLanes;
    if (!p(t, o)) return j.releaseOrder;
    if (o.cards.some((h) => !t.cards.some((C) => C.id === h.id))) return j.releaseCards;
  }
  return r !== i ? "This board is a " + Ji[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? ke().replacement(t, o) : null;
}
const fa = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ha(e) {
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
function Zi(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function pa(e, n) {
  return Zi(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const $r = ["firstPrint", "secondPrint", "thirdPrint"], Lr = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function ma(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Lr, route: n.route };
  for (const r of $r) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function wa(e = new URLSearchParams()) {
  const n = { ...Lr };
  for (const r of $r) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function ga(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Vi(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = es(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), Qi(n), n;
}
function Xi(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function Qi(e) {
  return e && Xi(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Gt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Wn(e) {
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
function es(e) {
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
function st() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const mn = {
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
}, ns = "var(--slatebox-board-font, system-ui, sans-serif)", eo = "http://www.w3.org/2000/svg", or = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function Me(e, n, t) {
  const r = document.createElementNS(eo, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", or(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", or(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function wn(e, n, t, r, o) {
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
      C.style.setProperty("font-family", ns), h.lines && h.lines.length > 1 ? h.lines.forEach((k, I) => {
        const b = Me("tspan", { x: h.x, dy: I ? h.lineHeight ?? Math.round((h.size ?? 13) * 1.25) : 0 });
        b.textContent = I < h.lines.length - 1 ? k + " " : k, C.appendChild(b);
      }) : C.textContent = h.text, e.appendChild(C);
    } else {
      if (h.unlink && t) {
        const { cardId: C, waitsOn: k, label: I } = h.unlink, b = k + ">" + C, $ = r?.armed === b, x = Me("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": b,
          "aria-label": $ ? I + ". " + (h.unlink.armed ?? "Tap again to remove it") + "." : I,
          role: "button",
          tabindex: 0,
          ...$ ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: $ ? mn.refuse : "transparent" });
        let L = !1;
        x.addEventListener("pointerdown", (_) => {
          _.stopPropagation(), L = _.pointerType === "touch" || _.pointerType === "pen";
        }), x.addEventListener("click", (_) => {
          if (_.stopPropagation(), L && r && r.armed !== b) {
            r.arm(b);
            return;
          }
          r?.arm(null), t(C, k);
        }), x.addEventListener("keydown", (_) => {
          _.key !== "Enter" && _.key !== " " || (_.preventDefault(), _.stopPropagation(), t(C, k));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", mn.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          $ || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), e.appendChild(x), p.push(x);
      } else if (h.pick && o) {
        const { key: C, label: k } = h.pick, I = Me("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": C,
          "data-board-pick": "",
          "aria-label": k,
          role: "button",
          tabindex: 0
        }, { stroke: "transparent" });
        I.addEventListener("pointerdown", (b) => b.stopPropagation()), I.addEventListener("click", (b) => {
          b.stopPropagation(), o(C);
        }), I.addEventListener("keydown", (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), b.stopPropagation(), o(C));
        }), I.addEventListener("focus", () => {
          I.style.setProperty("stroke", mn.accept), I.setAttribute("opacity", "0.35");
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
        const { x: C, y: k, angle: I } = h.arrow;
        e.appendChild(Me("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${k}) rotate(${I})`, "pointer-events": "none" }, { fill: h.color }));
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
        }, { fill: mn.refuse });
        C.textContent = h.unlink.armed ?? "Tap again to remove this link", e.appendChild(C);
      }
    }
  c && p.find((h) => h.getAttribute("data-board-link") === c)?.focus({ preventScroll: !0 });
}
function ts(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(eo, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(eo, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let i = !1, c = null, p;
  const h = {
    armed: null,
    arm(k) {
      clearTimeout(p), h.armed = k, k && (p = setTimeout(() => h.arm(null), 5e3), c?.[2].announce?.(c[2].boardFocused && c[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), c && C.draw(...c);
    }
  }, C = {
    draw(k, I, b) {
      if (i || !t) return;
      c = [k, I, b];
      const { origin: $ } = b, x = n(I ?? k, b, k), L = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o])
        l.setAttribute("transform", `translate(${$.x} ${$.y})`), l.toggleAttribute("data-workshop-focused", !!b.boardFocused);
      wn(r, x.filter((l) => !L(l)), b.onUnlink, h, b.onPick), wn(o, x.filter(L));
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
}, at = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, os = (e) => e.replace(/\.$/, ""), rs = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function go(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return is(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, c = (p) => n.push(i ? { ...p, warn: i } : p);
    if (o.kind === "bin" && o.lane) c({ icon: "bin", text: at(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) c({ icon: "gate", text: at(e, o.into) + " needs " + (o.needs ?? []).map((p) => rs[p] ?? p).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) c({ icon: "step", text: "One column at a time", seams: t.slice(1).map((p, h) => [t[h], p]) });
      else {
        const p = o.from, h = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(p)) === 1).map((C) => [p, C]);
        c({ icon: "oneway", text: at(e, p) + " → " + o.to.map((C) => at(e, C)).join(" or ") + " only", seams: h });
      }
  }
  return n;
}
function is(e) {
  if (!Ri()) return [];
  let n;
  try {
    n = ke().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = os(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, c = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: c, text: ss(o), ...i && { warn: i } });
  }
  return t;
}
function ss(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const ct = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Tr(e, n, t, r, o = 12) {
  const i = o / 12, c = (h) => h.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, k, I) => `A${+k * i} ${+I * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, k, I) => `${+(n + +k * i).toFixed(1)},${+(t + +I * i).toFixed(1)}`), p = (h, C = 1.6) => ({ t: "path", d: c(h), color: r, width: C * i });
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
const yo = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function wt(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + ct(e.text, 13 * n, t) + 10 * n);
}
function lt(e, n, t, r, o = {}) {
  const i = 24 * r, c = 10 * r, p = t.icon ? 17 * r : 0, h = wt(t, r, o.bold), C = o.ink ?? he.chipInk, k = [{
    t: "path",
    d: yo(e, n, h, i, i / 2),
    color: t.warn ? he.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? he.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && k.push(...Tr(t.icon, e + c, n + 6 * r, C, 12 * r)), k.push({ t: "text", x: e + c + p, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), k;
}
function rr(e, n, t, r) {
  return [
    { t: "path", d: yo(n - 11, t - 11, 22, 22, 11), color: he.badgeLine, width: 1, fill: he.badge, role: r },
    ...Tr(e, n - 6, t - 6, he.badgeInk)
  ];
}
const as = "Preview · not added yet", Or = 6, ls = 2.5, Pr = (e) => Math.round(Math.min(Or, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, no = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function Er(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(Or, Math.max(1, t.scale ?? 1)), c = i > ls ? [] : go(e), p = 18 * i, h = 30 * i, C = (R, W) => {
    const F = (t.narrow && W <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (ct(R, 18 * W, !0) <= F) return R;
    const N = Math.max(3, Math.floor(F / (18 * W * 0.58)) - 1);
    return R.slice(0, N).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, k = C(e.title, i), I = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), b = [], $ = [2 + ct(C(e.title, 1), 18, !0) + 14];
  t.narrow && c.length && ($[0] = 1 / 0, $.push(2));
  for (const R of c) {
    const W = wt(R, 1);
    let F = $.findIndex((N) => N + W <= I);
    F < 0 && ($.push(2), F = $.length - 1), b.push({ x: $[F], row: F, item: R, width: W }), $[F] += W + 6;
  }
  const x = b.map((R) => ({ x: r + Math.round(R.x * i), row: R.row, item: R.item, width: wt(R.item, i) })), L = Math.max(1, ...x.map((R) => R.row + 1)), _ = o - 14 * i - L * h, U = !!(t.focused || t.draft), l = t.narrow ? 8 : 16, v = U ? { x: r - l, y: _ - 18 * i, width: n.width + 2 * l, height: o + n.height + l - (_ - 18 * i) } : null, S = Math.max(i, t.tagScale ?? i), A = v ? v.y - 12 * S : _, E = r + 2 + ct(k, p, !0);
  return { k: i, tagK: S, legend: c, placed: x, rows: L, title: k, titleY: _, titleSize: p, titleRight: E, rowH: h, frame: v, top: A };
}
function Mr(e, n, t = {}) {
  const r = Er(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((k) => k.x + k.width)), c = o ? o.x : 0, p = r.top, h = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: c, y: p, width: h - c, height: C - p };
}
function ir(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: c, titleY: p, titleSize: h, rowH: C, frame: k } = Er(e, n, t), I = n.x ?? 0, b = [];
  if (k) {
    const $ = yo(k.x, k.y, k.width, k.height, 18);
    t.focused && b.push({ t: "path", d: $, color: he.focus, width: 12, strokeOpacity: 0.1, fill: he.focusTint, role: "focus-glow" }), b.push({
      t: "path",
      d: $,
      color: t.focused ? he.focus : he.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  b.push({ t: "text", x: I + 2, y: p + 19 * r, text: c, color: he.title, size: h, bold: !0, role: "board-title" });
  for (const $ of i) b.push(...lt($.x, p + $.row * C + 2 * r, $.item, r));
  if (k) {
    const $ = k.y - 12 * o;
    if (t.focused) {
      const x = { text: "Editing" };
      b.push(...lt(k.x + 18, $, x, o, { fill: he.focus, ink: he.focusInk, bold: !0, role: "focus-tag" })), b.push(...lt(
        k.x + 18 + wt(x, o, !0) + 6 * o,
        $,
        { text: "Done" },
        o,
        { fill: he.halo, ink: he.focus, line: he.focus, bold: !0, role: "focus-done" }
      ));
    } else
      b.push(...lt(k.x + 18, $, { text: as }, o, { fill: he.previewFill, ink: he.previewInk, bold: !0, role: "draft-tag" }));
  }
  return b;
}
function sr(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((c) => c.laneId === i);
  for (const i of go(e)) {
    const c = i.lane ? o(i.lane) : void 0;
    c && r.push(...rr(i.icon, c.x + c.width - 22, c.y + 18, "badge-" + i.lane));
    for (const [p, h] of i.seams ?? []) {
      const C = o(p), k = o(h);
      !C || !k || C.row !== k.row || r.push(...rr(i.icon, (C.x + C.width + k.x) / 2, C.y + 35, "seam-" + p + ">" + h));
    }
  }
  return r;
}
function ds(e) {
  const n = go(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const ya = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, ar = "http://www.w3.org/2000/svg";
function lr(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function cs(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(ar, "g") : null, r = typeof document < "u" ? document.createElementNS(ar, "g") : null;
  for (const k of [t, r])
    k?.setAttribute("data-board-chrome", ""), k?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const c = (k) => ({ layout: k.layout, focused: k.focused, draft: k.draft, scale: k.scale, tagScale: k.tagScale, narrow: k.narrow, places: k.places, room: k.room }), p = (k, I) => {
    const b = Mr(k.board, k.size, I);
    return { x: k.origin.x + b.x, y: k.origin.y + b.y, width: b.width, height: b.height };
  }, h = (k) => ({ ...c(k), focused: !1, draft: !1, scale: 1, tagScale: 1 }), C = {
    get scope() {
      return i?.scope ?? "main";
    },
    get draft() {
      return !!i?.draft;
    },
    box(k) {
      if (!i) return null;
      const I = Pr(k);
      return p(i, { ...c(i), scale: I, tagScale: no(k, !!(i.narrow && !i.draft), I) });
    },
    plainBox() {
      return i ? p(i, h(i)) : null;
    },
    paintPlain(k, I) {
      if (!i) return;
      const b = h(i);
      k.removeAttribute("data-workshop-focused"), wn(k, ir(i.board, { width: i.size.width, height: i.size.height }, b)), I && (I.removeAttribute("data-workshop-focused"), wn(I, sr(i.board, b)));
    }
  };
  return lr(e).add(C), {
    draw(k) {
      if (o || !n || !t || !r) return;
      i = k;
      const I = c(k);
      for (const x of [t, r])
        x.setAttribute("transform", `translate(${k.origin.x} ${k.origin.y})`), x.toggleAttribute("data-workshop-focused", !!k.focused), x.toggleAttribute("data-workshop-draft", !!k.draft), x.setAttribute("data-board-scope", k.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", ds(k.board)), wn(t, ir(k.board, { width: k.size.width, height: k.size.height }, I)), wn(r, sr(k.board, I));
      const b = t.querySelector('[data-board-layer="focus-done-box"]');
      if (b && k.onDone) {
        const x = k.onDone;
        b.setAttribute("role", "button"), b.setAttribute("tabindex", "0"), b.setAttribute("aria-label", "Done changing " + k.board.title), b.setAttribute("pointer-events", "all"), b.setAttribute("cursor", "pointer"), b.addEventListener("pointerdown", (L) => L.stopPropagation()), b.addEventListener("click", (L) => {
          L.stopPropagation(), x();
        }), b.addEventListener("keydown", (L) => {
          const _ = L.key;
          _ !== "Enter" && _ !== " " || (L.preventDefault(), L.stopPropagation(), x());
        });
      }
      const $ = k.under && k.under.parentNode === n ? k.under : null;
      $ ? t.nextSibling !== $ && n.insertBefore(t, $) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, lr(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const to = "handle-_link-", oo = "handle-_route-", Hn = 40, Nr = 44;
function Ut(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(Hn, Math.ceil(Nr / n)));
}
function _r(e) {
  if (e.startsWith(to)) return { kind: "link", from: e.slice(to.length) };
  if (e.startsWith(oo)) {
    const [n, t] = e.slice(oo.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const Rr = (e) => !!e.lanes[0]?.station, Be = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function ko(e) {
  const { places: n } = _e(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function dr(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, c = n.y - o, p = i ? e.width / 2 / Math.abs(i) : 1 / 0, h = c ? e.height / 2 / Math.abs(c) : 1 / 0, C = Math.min(p, h), k = Math.hypot(i, c) || 1;
  return { x: r + i * C + i / k * t, y: o + c * C + c / k * t };
}
function Wr(e) {
  if (!Rr(e)) return [];
  const n = ko(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const c = n.get(i);
        if (!c) continue;
        const p = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, h = { x: c.x + c.width / 2, y: c.y + c.height / 2 }, C = dr(o, h, -8), k = dr(c, p, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: k.x, y2: k.y });
      }
  }
  return t;
}
function us(e, n) {
  for (const [t, r] of ko(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function Fr(e, n, t = Hn) {
  if (!Rr(e)) return [];
  const r = ko(e), o = t / Hn, i = (p, h, C, k, I) => ({ options: {
    id: p,
    name: k,
    text: I ? "+" : "",
    xPos: n.x + h - t / 2,
    yPos: n.y + C - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: yn(t, t, t / 2),
    backgroundColor: I ? "#2f5fd0" : "#fffef8",
    foregroundColor: I ? "#ffffff" : "#2f5fd0",
    borderColor: I ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), c = [];
  for (const p of e.lanes) {
    const h = r.get(p.id);
    h && c.push(i(to + p.id, h.x + h.width, h.y + h.height, "Draw a path from " + p.label, !0));
  }
  for (const p of Wr(e))
    c.push(i(oo + p.from + "~" + p.to, p.x2, p.y2, "End of the path from " + Be(e, p.from) + " to " + Be(e, p.to), !1));
  return c;
}
function fs(e, n) {
  const t = _r(n);
  return t ? t.kind === "link" ? `Draw a path from ${Be(e, t.from)}: drag it onto another step.` : `End of the path from ${Be(e, t.from)} to ${Be(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function hs(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((c) => c.id === n.from);
  if (!r?.station || !e.lanes.some((c) => c.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${Be(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((c) => c !== n.to) : r.station.next, i = e.lanes.map((c) => c.id === r.id ? { ...c, station: { ...c.station, next: [...o, t] } } : c);
  return { next: { ...e, lanes: i } };
}
function ps(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((p) => p.id === o.id)?.station?.next ?? [], c = o.station?.next ?? [];
    for (const p of i) c.includes(p) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: p } });
    for (const p of c) i.includes(p) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: p } });
  }
  return [...t, ...r];
}
function ms(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? Hn, i = Math.max(24, o * Nr / Hn);
  for (const c of Wr(e)) {
    const p = Be(e, c.from) + " to " + Be(e, c.to), h = `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`, C = !r && n.picked === c.key;
    t.push(r ? { t: "path", d: h, color: "transparent", width: 3, hit: i, unlink: { cardId: c.to, waitsOn: c.from, label: "Remove the path from " + p, armed: "Tap again to remove this path" } } : { t: "path", d: h, color: C ? mn.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: c.key, label: "Path from " + p + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const c = Fr(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, p = c ? c.xPos + o + 6 : 0, h = c ? c.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: p, y: h, text: n.clamp.text, color: mn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
const cr = "#1f7a5c", ur = "#5b9a85", Kt = "#c2410c", ws = "#a8761b", gs = {
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
}, ys = { canMove: !1, canSelect: !1 }, qt = "A card's line joins notes and cards on its own board.", Fn = /* @__PURE__ */ new WeakMap();
function ks(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ka(e, n, t = {}) {
  const r = qn(t.scope);
  let o = V(n);
  const i = t.kit, c = (s) => !!ie(s) && !i;
  if (c(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const p = i?.layer(e) ?? (o.lanes[0]?.station ? ts(e, ms) : void 0), h = t.chrome === !1 ? null : cs(e);
  let C = 1, k = 1, I = null, b = null, $ = /* @__PURE__ */ new Set(), x = null, L = null;
  const _ = !!t.draft, U = !!t.still;
  let l = !!t.readOnly || _ || U, v = l || c(o), S = !1;
  const A = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
  let N = null, G = null, se = null, ee = null;
  const ye = /* @__PURE__ */ new Map(), In = /* @__PURE__ */ new Map(), an = /* @__PURE__ */ new Map();
  let te = null, pe = null;
  function Ge(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, S || D(L ?? o);
    }, 3e3) };
  }
  let re = Promise.resolve(), Ue = null, ae = fr(t.layout), xe = ae;
  const Ct = { ...t.style };
  let Se = /* @__PURE__ */ new Map(), $t = /* @__PURE__ */ new Set(), Co = null, Ce = !1, An = Ut(1), Jn = null, Sn = null, Ke = null, Yn = !1;
  const we = /* @__PURE__ */ new Map();
  We(o);
  const q = t.origin ? { x: t.origin.x, y: t.origin.y } : vs(e), Zn = r ? r + ":" : "", be = (s) => F.get(s) ?? (Zn ? s.startsWith(Zn) ? s.slice(Zn.length) : null : s), me = (s) => {
    const a = be(s);
    return a === null ? null : ks(a);
  };
  function le(s) {
    const a = W.get(s);
    if (a) return a;
    const d = Zn + s;
    if (A.has(d) && !F.has(d) || !e.nodes.one?.(d)) return d;
    const f = ii(d, (m) => !!e.nodes.one?.(m) || F.has(m));
    return W.set(s, f), F.set(f, s), console.warn(`WORKSHOP: the slate already has a note named "${d}". It stays the slate's own; the workshop draws its note as "${f}".`), f;
  }
  function Cn(s, a = 1) {
    let d = [];
    try {
      d = t.avoid?.() ?? [];
    } catch (f) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", f);
    }
    return d.length ? Ys(s, d, a) : { x: s.x, y: s.y };
  }
  function ai(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (u) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", u);
    }
    const { width: d, height: f } = i ? i.places(o, ae) : We(o);
    let m = 1 / 0;
    for (const u of a)
      [u.x, u.y, u.width, u.height].every(Number.isFinite) && u.x >= q.x + d && u.y < q.y + f && u.y + u.height > q.y && (m = Math.min(m, u.x - 32 - q.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function li(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (d) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", d);
    }
    return a.some((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite) && s.x < d.x + d.width && s.x + s.width > d.x && s.y < d.y + d.height && s.y + s.height > d.y);
  }
  function di(s, a) {
    const d = [...Fn.get(e) ?? []].filter((g) => g !== Tt);
    if (!d.length) return null;
    const { id: f, note: m } = jo(s, a), u = { id: f, options: m }, w = Zt(o, s).some((g) => o.cards.some((y) => y.id !== s && (y.id === g.parentId || y.id === g.childId)));
    for (const g of d) {
      let y = null;
      try {
        y = g.verdict(u, a);
      } catch (O) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", O);
      }
      if (y) return { board: g, ...y, reason: w ? qt : y.reason };
    }
    return null;
  }
  function ci(s, a, d, f) {
    const { added: m, answer: u } = Qn(a, d, "", !0), w = Cn(d), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let y;
      try {
        y = s.take(m, f, w);
      } catch (M) {
        console.warn("WORKSHOP: another board could not take the card", M);
      }
      if (y === "taken") return;
      const O = Math.round(w.x), T = Math.round(w.y);
      m.position?.(O, T, () => e.updateSelectionResizeRotate?.(), void 0, st() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Gt({ ...m.options, x: O, y: T })] });
    };
    !u || typeof u.then != "function" ? g() : u.then((y) => {
      y === !0 && !S && g();
    }, () => {
    });
  }
  const $e = {
    governs(s) {
      if (A.get(s.id) !== s) return null;
      const a = me(s.id)?.kind;
      return a === "card" ? { canMove: !v, canEditText: !v && !L && o.kind !== "release-plan", canConnect: Pn() } : a === "lane" ? { canMove: !1, canEditText: !v && !L } : a === "handle" ? { canMove: !v && !L, canEditText: !1, ...!ae.narrow && { cursor: i ? "ew-resize" : "grab" }, ...ae.narrow && { edgePan: !1 } } : ys;
    },
    onStart(s, a) {
      const d = me(s.id), f = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const w = v || L ? null : i ? i.handleDrag(o, be(s.id), f, ae) : Ei(be(s.id));
        return w ? (de(), Je(), pe && (clearTimeout(pe.timer), pe = null), x = { name: be(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = d.key;
      if (v || L || !o.cards.some((w) => w.id === m)) return !1;
      de(), Je();
      let u = null;
      try {
        u = (i?.chooser ?? t.chooseCandidate)?.(o, m, f, ae) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return N = { cardId: m, evaluate: u, grab: f, outcome: { kind: "home" } }, D(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (x) {
        x.last = x.follow(Ze(a)), D(x.last.next, { grip: x.name, layout: ai(x.last.layout) }), z(t.onPreview, x.last.next === o ? null : x.last.next);
        return;
      }
      if (!N) return;
      const d = Po(N.cardId, a, N.evaluate);
      if (bs(d, N.outcome)) return;
      N.outcome = d;
      const f = d.kind === "candidate" ? d.next : null;
      D(f ?? o, { skip: N.cardId }), z(t.onPreview, f);
    },
    onEnd(s, a) {
      if (x) {
        const { follow: w, name: g } = x, y = w(Ze(a));
        x = null, z(t.onPreview, null), y.refusal ? (Ge(g, y.refusal), D(o), e.announce?.(y.refusal), z(t.onRefuse, { laneId: null, reason: y.refusal })) : nt(y.next, {}) || D(o);
        const O = jt(o, be(s.id));
        return O ? { accept: !0, settle: O } : { accept: !1 };
      }
      if (!N) return { accept: !1 };
      const { cardId: d, evaluate: f } = N, m = Po(d, a, f), u = o.cards.find((w) => w.id === d);
      if (N = null, z(t.onPreview, null), m.kind === "candidate" && i) {
        if (!nt(m.next, { cardId: d, laneId: m.laneId }, d))
          return D(o, { skip: d }), { accept: !1 };
        m.said && (Ge("card-" + d, m.said), e.announce?.(m.said));
        const w = jt(o, be(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, D(o, { skip: d });
        const w = o.lanes.find((y) => y.id === m.laneId);
        e.announce?.(`${Y(u)} moved to ${w.label}. ${De(o, w.id)}.`), z(t.onChange, o, { cardId: d, laneId: m.laneId });
        const g = jt(o, be(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused")
        $i(Y(u), { cardId: d, laneId: m.laneId, reason: m.reason }), m.near ? Ge("card-" + d, m.reason) : Ci(d, m.laneId, m.reason);
      else if (m.kind === "outside" && Yt() && !Re()) {
        const w = ut(o, d);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, y = di(d, a);
          if (y?.reason)
            return D(o, { skip: d }), y.board.flash(y.laneId, y.reason), e.announce?.(`${Y(u)} can't go in ${y.laneLabel}. ${y.reason} It stays where it was.`), z(t.onRefuse, { cardId: d, laneId: null, reason: y.reason }), { accept: !1 };
          if (y)
            return ci(y.board, d, g, a), { accept: !0 };
          const O = li(g);
          return Qn(d, O ? Cn(g) : g, O ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        D(o, { skip: d }), e.announce?.(w), z(t.onRefuse, { cardId: d, laneId: null, reason: w });
      } else
        D(o, { skip: d }), m.kind === "outside" && (e.announce?.(`${Y(u)} was not dropped on a lane. It stays where it was.`), z(t.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (x) {
        x = null, z(t.onPreview, null), D(o);
        return;
      }
      const a = N && o.cards.find((d) => d.id === N.cardId);
      N = null, z(t.onPreview, null), D(o, { skip: me(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Y(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const f = me(s.id);
      if (!f || v || L) return !1;
      const m = f.kind === "card" ? Ur(o.cards.find((M) => M.id === f.key) ?? {}) : null;
      m && (a = a.split(`
`).filter((M) => M.trim() !== m).join(`
`));
      let u = a.replace(/\s+/g, " ").trim();
      const w = [], g = ie(o), y = g && f.kind === "card" ? ve(g).renamed(o, f.key, u) : null;
      y && (u = y.label, w.push(...y.edits));
      const O = f.kind === "lane" ? { laneId: f.key, label: u } : { cardId: f.key, label: u };
      w.unshift(f.kind === "lane" ? { kind: "rename_lane", lane: { id: f.key }, label: u } : { kind: "rename_card", card: { id: f.key }, label: u });
      const T = Xe(o, w);
      if ("refused" in T) {
        const { reason: M } = T.refused;
        return e.announce?.(`${d} keeps its name. ${M}`), z(t.onRefuse, { ...f.kind === "lane" ? { laneId: f.key } : { cardId: f.key }, rename: O, reason: M }), !1;
      }
      return JSON.stringify(T.workshop) === JSON.stringify(o) ? (D(o), !1) : (e.beginHostStep?.(), o = T.workshop, f.kind === "card" && In.set(f.key, u), e.endHostStep?.(), D(o), e.announce?.(y ? T.report.edits.map((M) => M.said).join(" ") : `${d} renamed to ${u}.`), z(t.onChange, o, { rename: O, ...i ? { edits: w } : {} }), y ? !1 : u);
    },
    onKeyDown(s, a) {
      const d = me(s.id);
      if (v || L || N || x || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (se && (se.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== se.key) && Mo(), se && a.key === "Escape")
        return a.preventDefault(), Mo(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (se && a.key === "Enter") {
        a.preventDefault();
        const w = se.choices[se.at];
        return se = null, z(t.onPreview, null), o = w.next, D(o), e.announce?.(w.done), z(t.onChange, o, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: w.edits }), !0;
      }
      const f = i?.keyChoices?.(o, be(s.id), a.key);
      if (f) {
        a.preventDefault();
        const w = [], g = [];
        for (const T of typeof f == "string" ? [] : f) {
          const M = Xe(o, T.edits);
          "refused" in M ? g.push(`${T.said}: ${M.refused.reason}`) : w.push({ ...T, next: M.workshop, done: M.report.edits.map((H) => H.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof f == "string" ? f : g.join(" ")), !0;
        const y = se && se.node === s.id ? (se.at + 1) % w.length : 0;
        se = { node: s.id, key: a.key.toLowerCase(), choices: w, at: y }, D(w[y].next), z(t.onPreview, w[y].next);
        const O = w.length > 1 ? ` (${y + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[y].said}${O} Enter to make it, Escape to cancel.`), !0;
      }
      const m = i?.keyEdit?.(o, be(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = Xe(o, m);
        return "refused" in w ? (e.announce?.(w.refused.reason), z(t.onRefuse, { laneId: w.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: w.refused.reason })) : nt(w.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = o.cards.find((w) => w.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Eo(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && hi())
        return a.preventDefault(), Eo(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (G?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: y } = G;
        if (G = null, w === null)
          return z(t.onPreview, null), Qn(u.id, y), !0;
        const O = o;
        o = g, D(o), qe(w), z(t.onPreview, null);
        const T = o.lanes.find((M) => M.id === w);
        return e.announce?.(`${Y(u)} moved to ${T.label}. ${De(o, w)}.`), z(t.onChange, o, { cardId: u.id, laneId: w, ...i ? { edits: i.editsBetween(O, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Je(), e.announce?.(`Move cancelled. ${Y(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => A.get(a.id) === a).map((a) => a.id);
      Yn = s.length === 1, A.clear(), E.clear(), R.clear(), we.clear(), W.clear(), F.clear(), N = null, G = null, D(L ?? o, { animate: !1 }), s.length === 1 && (re = re.then(() => {
        Yn = !1;
        const a = A.get(s[0]);
        if (!S && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        ln();
      }));
    }
  };
  $e.onFreeMove = (s, a) => {
    if (!$n() || s.options?.isComment) return Ot();
    const d = Ln(a), f = Tn(s), m = On(s), u = o.lanes.filter((y) => !m && Qe(o, y.id, f) === null).map((y) => y.id), w = d && i?.noteUnder?.(o, Ze(a), ae);
    w && (f.under = w);
    const g = d ? m ?? Qe(o, d, f) : null;
    ee && ee.noteId === s.id && ee.laneId === d && ee.refusal === g || (ee = { noteId: s.id, laneId: d, refusal: g, open: u }, Pe());
  }, $e.onFreeDrop = (s, a, d) => {
    if (Ot(), !$n() || s.options?.isComment) return;
    const f = Ln(a);
    if (!f) return;
    const m = Tn(s), u = i?.noteUnder?.(o, Ze(a), ae);
    u && (m.under = u), Ft(m, a);
    const w = o.lanes.find((y) => y.id === f), g = On(s) ?? Qe(o, f, m);
    return g ? (de(!1), te = { laneId: f, reason: g, timer: setTimeout(() => de(), 1500) }, Pe(), e.announce?.(`${Pt(m.label)} can't go in ${w.label}. ${g}`), z(t.onRefuse, { noteId: s.id, laneId: f, reason: g }), "refused") : (Nt([{ node: s, offer: m, from: d }], f), "taken");
  }, $e.onFreeGroupDrop = (s, a, d) => {
    if (Ot(), !$n() || s.some((g) => g.options?.isComment)) return;
    const f = Ln(a);
    if (!f) return;
    const m = o.lanes.find((g) => g.id === f), u = s.map((g) => ({ node: g, offer: Ft(Tn(g), a) })), w = wi(u, f);
    if (w) {
      de(!1), te = { laneId: f, reason: w, timer: setTimeout(() => de(), 1500) }, Pe(), e.announce?.(`${No(u.map((g) => Pt(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of u) z(t.onRefuse, { noteId: g.id, laneId: f, reason: w });
      return "refused";
    }
    return Nt(u.map((g, y) => ({ ...g, from: d?.[y] })), f), "taken";
  }, $e.onFreeTextCommit = (s) => {
    if (!$n() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = { x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 }, f = Ln(d);
    if (!f) return;
    const m = Ft(Tn(s), d), u = o.lanes.find((M) => M.id === f), w = On(s) ?? Qe(o, f, m);
    if (!w) {
      Nt([{ node: s, offer: m }], f);
      return;
    }
    de(!1), te = { laneId: f, reason: w, timer: setTimeout(() => de(), 1500) }, Pe(), e.announce?.(`${Pt(m.label)} can't go in ${u.label}. ${w} It is beside the board.`), z(t.onRefuse, { noteId: s.id, laneId: f, reason: w });
    const { width: g } = We(o), y = Cn({ x: q.x + g + 32, y: a.y ?? q.y, width: a.width ?? 0, height: a.height ?? 0 }), O = Math.round(y.x), T = Math.round(y.y);
    s.position(O, T, () => e.updateSelectionResizeRotate?.(), void 0, st() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Gt({ ...s.options, x: O, y: T })] });
  }, $e.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...ye], lines: (o.lines ?? []).map((s) => ({ ...s })) }), $e.onUndoRestore = (s, a) => {
    if (S) return;
    const d = new Map((s?.cards ?? []).map((u) => [u.id, u])), f = new Map(s?.pairs ?? []), m = (u) => ye.get(u) ?? f.get(u) ?? u;
    for (const u of a.added) {
      const w = m(u), g = o.cards.find((O) => O.id === w);
      if (!g || d.has(w)) continue;
      o = V({ ...o, cards: o.cards.filter((O) => O !== g), lines: hn(o.lines, w, u) }), D(o);
      const y = z(t.onChange, o, { cardId: w, cardToNote: { noteId: u }, via: "undo" });
      e.holdTrade?.(u, y), Jt(y);
    }
    for (const u of a.removed) {
      const w = m(u), g = d.get(w);
      if (!g || o.cards.some((K) => K.id === w)) continue;
      const y = (s?.lines ?? []).filter((K) => K.parentId === w || K.childId === w), O = uo(o, g), T = {
        id: w,
        label: O,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...y.length ? { lines: y } : {}
      }, M = [g.laneId, ...o.lanes.map((K) => K.id)].find((K) => Dn(o, K, T));
      if (!M) {
        e.announce?.(`${Y(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = Ii(Dn(o, M, T), w, s?.cards ?? []), w !== u && ye.set(u, w), D(o);
      const H = o.cards.findIndex((K) => K.id === w), X = o.cards.slice(H + 1).find((K) => K.laneId === M)?.id, Z = z(t.onChange, o, { cardId: w, laneId: M, noteToCard: {
        noteId: u,
        label: O,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...X ? { before: X } : {},
        ...y.length ? { lines: hn(y, w, u) } : {}
      }, via: "undo" });
      e.holdTrade?.(u, Z), Jt(Z);
    }
    for (const u of d.values()) {
      const w = o.cards.find((O) => O.id === u.id);
      if (!w || w.label === u.label || In.get(u.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: u.id }, label: u.label }], y = Xe(o, g);
      "refused" in y || (o = y.workshop, In.set(u.id, u.label), D(o), e.announce?.(`${Y(w)} is called ${Y(u)} again.`), z(t.onChange, o, { rename: { cardId: u.id, label: u.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && xi(s.lines);
  };
  let Lt = !1;
  $e.onNodeAdded = (s) => {
    S || Lt || A.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (Lt = !0, queueMicrotask(() => {
      Lt = !1, S || Pe();
    }));
  }, $e.onLine = (s, a) => {
    S || queueMicrotask(() => {
      S || bi(s, a);
    });
  };
  const ui = e.setDragPolicy($e), Tt = {
    verdict(s, a) {
      if (!$n()) return null;
      const d = Ln(a);
      if (!d) return null;
      const f = Tn(s), m = i?.noteUnder?.(o, Ze(a), ae);
      return m && (f.under = m), { laneId: d, laneLabel: o.lanes.find((u) => u.id === d).label, reason: On(s) ?? Qe(o, d, f) };
    },
    take: (s, a, d) => $e.onFreeDrop?.(s, a, d),
    flash(s, a) {
      S || !o.lanes.some((d) => d.id === s) || (de(!1), te = { laneId: s, reason: a, timer: setTimeout(() => de(), 1500) }, Pe());
    }
  };
  Fn.has(e) || Fn.set(e, /* @__PURE__ */ new Set()), Fn.get(e).add(Tt);
  const fi = t.onSelect || p ? e.onSelectionChange?.(() => {
    ln(), Yo();
  }) : void 0;
  let Vn = null;
  const $o = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, f = d && A.has(d) ? qo(d) : null;
    f !== Vn && (Vn = f, Yo());
  };
  p && e.element?.addEventListener?.("pointerover", $o);
  const Lo = (s) => {
    if (G && Je(), b && !s?.target?.closest?.("[data-board-pick]") && (b = null, Ie && un(Ie), queueMicrotask(ln)), Sn = null, Ke && (clearTimeout(Ke), Ke = null), !s || S || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((u) => le(Q.lane(u.id))));
    if ((e.getSelectedNodes?.() ?? []).some((u) => !a.has(u?.id))) return;
    const d = o.lanes.flatMap((u) => [Q.caption(u.id), Q.column(u.id)]).map((u) => A.get(le(u))).filter(Boolean), f = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), d, { padding: 0 }) : null, m = f ? me(f.id) : null;
    m && (Sn = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, To = (s) => {
    const a = Sn;
    Sn = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (Ke = setTimeout(() => {
      if (Ke = null, S || N || x || !o.lanes.some((f) => f.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = A.get(le(Q.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, Oo = () => {
    Sn = null;
  };
  e.element?.addEventListener?.("pointerdown", Lo, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", To, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", Oo, !0), Ti(), D(o, { animate: !1 });
  function Po(s, a, d) {
    const f = o.cards.find((T) => T.id === s);
    if (!f) return { kind: "outside" };
    if (i) {
      const T = Ze(a), M = i.refusalAt(o, s, N?.grab ?? { x: 0, y: 0 }, T, ae);
      if (M && !M.lands) return { kind: "refused", laneId: M.laneId, reason: M.reason };
      const { width: H, height: X } = We(o);
      if (T.x < -40 || T.y < -40 || T.x > H + 40 || T.y > X + 40) return { kind: "outside" };
      let Z = o;
      try {
        Z = d?.(T) ?? o;
      } catch (K) {
        console.warn("WORKSHOP: the board kit's chooser threw", K);
      }
      return JSON.stringify(Z) === JSON.stringify(o) ? M ? { kind: "refused", laneId: M.laneId, reason: M.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: Z.cards.find((K) => K.id === s)?.laneId ?? f.laneId, next: Z, ...M && { said: M.reason } };
    }
    const m = o.lanes.map((T) => A.get(le(Q.column(T.id)))).filter(Boolean), u = e.hitTestNodes(a, m, { padding: 6 }), w = u ? me(u.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === f.laneId) return { kind: "home" };
    const g = nn(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: tn(o, s, w) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: w, next: g };
    let y = null;
    try {
      y = d({ x: a.x - q.x, y: a.y - q.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: w, next: g };
    }
    const O = y?.cards.find((T) => T.id === s)?.laneId;
    return !y || !O || O === f.laneId ? { kind: "home" } : { kind: "candidate", laneId: O, next: y };
  }
  function hi() {
    return i ? !1 : new Set(_e(o, { layout: ae }).places.map((s) => s.row)).size > 1;
  }
  function Eo(s, a, d = !1) {
    const f = o.cards.find((T) => T.id === s), m = pr(o, s), u = G?.cardId === s && G.laneId === null ? G.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const T = u > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (Je(), T.id === f.laneId) {
        qe(T.id, L ?? o), e.announce?.(`${Y(f)} is back in ${T.label}.`);
        return;
      }
      if (m.includes(T)) {
        const H = nn(o, s, T.id);
        G = { cardId: s, laneId: T.id, next: H }, D(H), qe(T.id, H), z(t.onPreview, H), e.announce?.(`${Y(f)} to ${T.label}: ${De(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const M = tn(o, s, T.id) ?? "That move is not available.";
      de(), te = { laneId: T.id, reason: M, timer: setTimeout(() => de(), 1500) }, D(L ?? o), qe(T.id, L ?? o), e.announce?.(`${Y(f)} can't move to ${T.label}. ${M}`), z(t.onRefuse, { cardId: s, laneId: T.id, reason: M });
      return;
    }
    const w = G?.cardId === s ? G.laneId : f.laneId;
    let g;
    if (d) {
      const { places: T } = _e(o, { layout: ae }), M = T.find((H) => H.laneId === w);
      g = T.filter((H) => H.column === M.column && (H.row - M.row) * a > 0).sort((H, X) => (H.row - X.row) * a).map((H) => o.lanes.find((X) => X.id === H.laneId));
    } else {
      const T = o.lanes.findIndex((M) => M.id === w);
      g = a > 0 ? o.lanes.slice(T + 1) : o.lanes.slice(0, T).reverse();
    }
    const y = g.find((T) => m.includes(T));
    if (de(), !y) {
      const T = g[0];
      if (!T) {
        if (!d && Yt()) {
          const H = ut(o, s);
          if (H) {
            e.announce?.(H), z(t.onRefuse, { cardId: s, laneId: null, reason: H });
            return;
          }
          pi(f, a);
          return;
        }
        e.announce?.(`${Y(f)} has no lane to move to on that side.`);
        return;
      }
      const M = tn(o, s, T.id) ?? "That move is not available.";
      te = { laneId: T.id, reason: M, timer: setTimeout(() => de(), 1500) }, D(G?.next ?? L ?? o), qe(T.id, G?.next ?? L ?? o), e.announce?.(`${Y(f)} can't move to ${T.label}. ${M}`), z(t.onRefuse, { cardId: s, laneId: T.id, reason: M });
      return;
    }
    if (y.id === f.laneId) {
      Je(), qe(y.id, L ?? o), e.announce?.(`${Y(f)} is back in ${y.label}.`);
      return;
    }
    const O = nn(o, s, y.id);
    G = { cardId: s, laneId: y.id, next: O }, D(O), qe(y.id, O), z(t.onPreview, O), e.announce?.(`${Y(f)} to ${y.label}: ${De(O, y.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function qe(s, a = o) {
    const d = i ? Oi(a, Q.column(s)) : _e(a, { layout: ae, rows: zo() }).places.find((y) => y.laneId === s), f = e.canvas?.viewbox?.();
    if (!d || !f || !(f.width > 0) || !(f.height > 0)) return;
    const m = 16, u = (y, O, T, M) => O + m * 2 >= M || y - m < T ? y - m - T : y + O + m > T + M ? y + O + m - (T + M) : 0, w = u(q.x + d.x, d.width, f.x, f.width), g = u(q.y + d.y, d.height, f.y, f.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function ln() {
    if (!t.onSelect || Yn) return;
    const s = S ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && A.get(s[0].id) === s[0] ? me(s[0].id) : null;
    b && s.some((w) => !$.has(w.id)) && (b = null, Ie && un(Ie));
    const [d, f] = b ? b.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : d && f && !a ? { path: { from: d, to: f } } : null, u = m ? JSON.stringify(m) : null;
    u !== Co && (Co = u, z(t.onSelect, m));
  }
  function Mo() {
    se && (se = null, D(o), z(t.onPreview, null));
  }
  function Je() {
    G && (G = null, z(t.onPreview, null), D(L ?? o));
  }
  function pi(s, a) {
    const { width: d } = We(o), f = A.get(le(Q.card(s.id)))?.options, m = f?.width ?? 228, u = Cn({
      x: a > 0 ? q.x + d + 32 : q.x - m - 32,
      y: f?.y ?? q.y,
      width: m,
      height: f?.height ?? 76
    }, a), w = gr(o, s.id);
    G = { cardId: s.id, laneId: null, side: a, spot: u, next: o }, D(o), z(t.onPreview, w), e.announce?.(`${Y(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Re() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function $n() {
    return !S && !v && !L && !N && !Re() && Yt();
  }
  function Ot() {
    ee && (ee = null, S || Pe());
  }
  function Ln(s) {
    const a = o.lanes.map((f) => A.get(le(Q.column(f.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? me(d.id)?.key ?? null : null;
  }
  function Tn(s) {
    const a = s.options ?? {}, d = Hr({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), f = String(a.text ?? ""), m = f.replace(/\s+/g, " ").trim(), u = {};
    f.trim() !== m && f.length <= 4e3 && (u.text = f.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (u[g] = Math.round(a[g]));
    if (so(a.image)) {
      u.image = { src: a.image };
      for (const [g, y] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[y]) && a[y] >= 1 && a[y] <= 2e4 && (u.image[g] = a[y]);
    }
    a.link?.data && hr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = mi(s);
    return { id: s.id, label: m, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...w.length ? { lines: w } : {} };
  }
  function mi(s) {
    const a = /* @__PURE__ */ new Map(), d = (f) => typeof f == "string" && !!A.get(f) && A.get(f) === e.nodes.one(f);
    for (const f of s.relationships?.getAssociations?.() ?? [])
      (f.targetPoint || !d(f.childId)) && a.set(f.id, En(f));
    for (const f of e.nodes?.allNodes ?? [])
      if (!(f === s || d(f.id)))
        for (const m of f.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, En(m));
    for (const f of Zt(o, s.id)) a.set(f.id, f);
    return [...a.values()];
  }
  function No(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function wi(s, a) {
    for (const { node: u } of s) {
      const w = On(u);
      if (w) return w;
    }
    const d = o.lanes.find((u) => u.id === a), f = ze(o, a);
    if (d.capacity !== void 0 && !d.station && f + s.length > d.capacity) {
      const u = d.capacity - f;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${f} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: u } of s) {
      const w = Qe(m, a, u);
      if (w) return w;
      m = Dn(m, a, u);
    }
    return null;
  }
  function On(s) {
    if (s.options?.image && !so(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !hr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : gi(s) ? qt : null;
  }
  function dn(s) {
    return !!s && A.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function gi(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && dn(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !dn(a))) {
        for (const d of a.relationships?.getAssociations?.() ?? []) if (d.childId === s.id && !d.targetPoint) return !0;
      }
    return !1;
  }
  const Pt = (s) => s || "This note", Y = (s) => s.label || "The empty card", _o = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : gs[a] ?? "shape";
  }, Et = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Ro = (s) => {
    const a = s.flatMap((d) => {
      const f = _o(d.asNote?.shape);
      return f ? [{ card: d, word: f }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Et(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: f }) => f === "shape" ? `${Y(d)} had its own shape` : `${Y(d)} was ${Et(f)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, yi = (s) => {
    const a = _o(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Et(a)} again.` : "";
  };
  function Pn() {
    return !S && !v && !L && !Re() && Ms(o);
  }
  function En(s) {
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
  function Wo(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function Fo(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (A.get(s.id) === s) {
      const a = me(s.id);
      return a?.kind === "card" && o.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || dn(s) ? null : s.id;
  }
  function Mt(s, a) {
    if (s.cards.some((f) => f.id === a)) {
      const f = A.get(le(Q.card(a)));
      return f?.relationships && f.svgGroup ? f : null;
    }
    const d = e.nodes.one(a);
    return d && A.get(a) !== d && !dn(d) && d.svgGroup ? d : null;
  }
  function Do(s) {
    const a = [];
    for (const d of s) {
      const f = e.nodes.one(d.parentId);
      if (!f?.relationships || A.get(f.id) === f || f.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const w = f.relationships.addFloatingAssociation(d.targetPoint, Wn(d));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(d.childId);
      if (!m || A.get(m.id) === m) continue;
      const u = f.relationships.addAssociation(m, Wn(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function ki(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const M = Mt(s, d.parentId);
        if (!M || A.get(M.id) !== M) continue;
        const H = { ...d, parentId: M.id }, X = JSON.stringify(H);
        a.add(d.id);
        const Z = we.get(d.id);
        if (Z && Z.key === X && Z.holder === M && !Z.other && M.relationships.hasAssociationId?.(d.id)) continue;
        Z && e.nodes.one(Z.holder.id) === Z.holder && Z.holder.relationships?.removeAssociation?.(d.id), M.relationships.addFloatingAssociation(d.targetPoint, Wn(H)), we.set(d.id, { holder: M, other: null, swapped: !1, key: X });
        continue;
      }
      const f = Mt(s, d.parentId), m = Mt(s, d.childId);
      if (!f || !m || f === m) continue;
      const u = A.get(f.id) !== f, w = u ? m : f, g = u ? f : m, y = u ? Wo({ ...d, parentId: w.id, childId: g.id }, d) : { ...d, parentId: w.id, childId: g.id }, O = JSON.stringify(y);
      a.add(d.id);
      const T = we.get(d.id);
      T && T.key === O && T.holder === w && T.other === g && w.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), w.relationships.addAssociation(g, Wn(y)), we.set(d.id, { holder: w, other: g, swapped: u, key: O }));
    }
    for (const [d, f] of [...we])
      a.has(d) || (e.nodes.one(f.holder.id) === f.holder && f.holder.relationships?.hasAssociationId?.(d) && f.holder.relationships.removeAssociation(d), we.delete(d));
  }
  function Xn(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let Mn = null;
  function bi(s, a) {
    if (s === "addRelationship") {
      if (we.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, f = e.nodes.one(a?.parentId), m = d ? null : e.nodes.one(a?.childId), u = Fo(f), w = d ? null : Fo(m);
      if (dn(f)) return;
      const g = Mn?.lineId === a?.id ? o.lines?.find((H) => H.id === a?.id) : void 0;
      g && (Mn = null);
      const y = (H) => {
        Xn(a), g && D(L ?? o), e.announce?.(H), z(t.onRefuse, { reason: H, laneId: null });
      };
      if (!Pn()) {
        Xn(a), g && D(L ?? o);
        return;
      }
      if (dn(m)) return y(qt);
      if (!u || !w && !d) return y(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const O = d ? String(a.childId) : w;
      if (g) {
        const H = o.cards.some((Fe) => Fe.id === u), X = !d && o.cards.some((Fe) => Fe.id === w);
        if (!H && !X) return Ye({ remove: g.id });
        const Z = { ...En(a), id: g.id, parentId: u, childId: O }, K = Bn(o, Z);
        if (K) return y(K);
        Xn(a), Ye({ set: Z });
        return;
      }
      const T = ei(o, u, O, En(a)), M = Bn(o, T);
      if (M) return y(M);
      Xn(a), Ye({ set: T });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...we].find(([m, u]) => (m === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const f = we.get(d);
      if (we.delete(d), e.nodes.one(f.holder.id) !== f.holder || f.other && e.nodes.one(f.other.id) !== f.other || !Pn())
        return Pn() || S ? void 0 : D(L ?? o);
      Mn = { lineId: d }, queueMicrotask(() => {
        S || Mn?.lineId !== d || (Mn = null, Ye({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const f = [...we].find(([T, M]) => T === d?.associationId && M.holder.id === d?.id);
        if (!f) continue;
        const [m, u] = f, w = o.lines?.find((T) => T.id === m), g = u.holder.relationships?.getAssociations?.().find((T) => T.id === m);
        if (!w || !g) continue;
        if (!Pn()) {
          D(L ?? o);
          continue;
        }
        const y = En(g), O = u.swapped ? Wo({ ...y, id: w.id, parentId: w.parentId, childId: w.childId }, y) : { ...y, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(vi(O)) !== JSON.stringify(w) && (we.set(m, { ...u, key: "" }), Ye({ set: O }));
      }
  }
  function vi(s) {
    return ft({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function Ye(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? ft(o, s.set) : yr(o, s.remove);
    if (!d || d === o) return;
    e.beginHostStep?.(), o = d, e.endHostStep?.(), D(L ?? o);
    const f = "set" in s ? s.set : a, m = [f.parentId, f.childId].map((g) => o.cards.find((y) => y.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (g) => m[g] || (g === 1 && f.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${u(0)} to ${u(1)} changed.` : f.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const w = z(t.onChange, o, { line: s });
    Jt(w, () => {
      if (S || o !== d) return;
      const g = a ? ft(o, a) : "set" in s ? yr(o, s.set.id) : null;
      g && (o = g, D(L ?? o));
    });
  }
  function xi(s) {
    const a = new Map(s.map((f) => [f.id, f])), d = new Map((o.lines ?? []).map((f) => [f.id, f]));
    for (const f of d.keys()) a.has(f) || Ye({ remove: f });
    for (const [f, m] of a)
      JSON.stringify(d.get(f)) !== JSON.stringify(m) && Bn(o, m) === null && Ye({ set: m });
  }
  function Nt(s, a) {
    let d = o;
    const f = /* @__PURE__ */ new Map(), m = s.map(({ node: y, offer: O, from: T }) => {
      let M = O.lines;
      for (const [Z, K] of f) M = hn(M, Z, K);
      d = Dn(d, a, { ...O, ...M ? { lines: M } : {} });
      const H = d.cards[d.cards.length - 1];
      H.id !== y.id && f.set(y.id, H.id);
      const X = { ...y.options ?? {}, ...T ? { x: T.x, y: T.y } : {} };
      return { node: y, card: H, kept: X, lines: hn(M ?? [], y.id, H.id), under: O.under, day: O.day };
    });
    e.beginHostStep?.(), o = d;
    let u = o;
    for (const { node: y, card: O } of m)
      O.id !== y.id && ye.set(y.id, O.id), an.set(le(Q.card(O.id)), { x: y.options?.x ?? 0, y: y.options?.y ?? 0 }), cn(() => e.removeNode(y.id));
    e.endHostStep?.(), D(o), Ai(le(Q.card(m[0].card.id)));
    const w = m.length === 1 && wr(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && Si(le(Q.card(w.id)), w.label);
    const g = o.lanes.find((y) => y.id === a);
    e.announce?.(m.length === 1 ? `${Y(m[0].card)} is now a card in ${g.label}. ${De(o, a)}.${Ro([m[0].card])}` : `${No(m.map(({ card: y }) => Y(y)))} are now cards in ${g.label}. ${De(o, a)}.${Ro(m.map(({ card: y }) => y))}`);
    for (const { node: y, card: O, kept: T, lines: M, under: H, day: X } of m) {
      const Z = { cardId: O.id, laneId: a, noteToCard: {
        noteId: y.id,
        label: uo(o, O),
        ...H && { under: H },
        ...X !== void 0 && { day: X },
        ...O.look ? { look: O.look } : {},
        ...O.asNote ? { asNote: O.asNote } : {},
        ...M.length ? { lines: M } : {}
      } }, K = () => {
        o !== u || !o.cards.some((Le) => Le.id === O.id) || (o = V({ ...o, cards: o.cards.filter((Le) => Le.id !== O.id), lines: hn(o.lines, O.id, y.id) }), u = o, D(o));
      }, Fe = z(t.onChange, o, Z);
      e.holdTrade?.(y.id, Fe), Bo(Fe, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: y.id, isComment: !1 } }]);
      }, () => {
        if (!S) {
          if (K(), !e.nodes.one(T.id)) {
            e.beginHostStep?.();
            const Le = cn(() => e.addNode({ ...T }));
            Le && (Le.announcedByCreator = !0), e.endHostStep?.();
            const Nn = hn(M, O.id, y.id).filter((ce) => !o.cards.some((_n) => _n.id === ce.parentId || _n.id === ce.childId));
            Le?.ready?.then?.(() => {
              S || cn(() => Do(Nn));
            });
          }
          e.announce?.(`${Y(O)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        S || (K(), e.keepTrade?.(y.id), e.announce?.(`Someone else put ${Y(O)} on the board first.`));
      });
    }
  }
  function jo(s, a) {
    const d = o.cards.find((T) => T.id === s), f = E.get(le(Q.card(s))) ?? {}, m = Dr(d), u = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = (Ct.cornerRadius ?? 0) > 0, g = d.asNote, y = wr(o, d), O = {
      id: u,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: g?.width ?? f.width ?? 228,
      height: g?.height ?? f.height ?? 76,
      text: y,
      shape: g?.shape ?? (w ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? f.backgroundColor,
      fontColor: d.look?.textColor ?? f.foregroundColor,
      fontSize: d.look?.fontSize ?? f.fontSize,
      borderColor: d.look?.borderColor ?? f.borderColor,
      borderWidth: d.look?.borderWidth ?? f.borderWidth,
      ...d.look?.fontFamily ?? f.fontFamily ? { fontFamily: d.look?.fontFamily ?? f.fontFamily } : {}
    };
    g?.image && Object.assign(O, {
      image: g.image.src,
      ...g.image.width ? { imageOrigWidth: g.image.width } : {},
      ...g.image.height ? { imageOrigHeight: g.image.height } : {}
    }), g?.link && (O.link = { ...g.link });
    for (const T of Object.keys(O)) O[T] === void 0 && delete O[T];
    return { id: u, note: O };
  }
  function Qn(s, a, d = "", f = !1) {
    const m = o.cards.find((ce) => ce.id === s), u = o.lanes.find((ce) => ce.id === m.laneId), w = o.cards.findIndex((ce) => ce.id === s), g = o.cards.slice(w + 1).find((ce) => ce.laneId === m.laneId)?.id, { id: y, note: O } = jo(s, a), T = m.asNote, M = Zt(o, s), { leave: H } = Ws(o, s, y), X = gr(o, s, y);
    e.beginHostStep?.(), o = X;
    const Z = o;
    y !== s ? ye.set(y, s) : ye.delete(y);
    const K = cn(() => e.addNode(O));
    K && (K.announcedByCreator = !0), e.endHostStep?.(), D(o);
    const Fe = Promise.resolve(K?.ready).then(() => S || !K || e.nodes.one(y) !== K ? [] : cn(() => Do(H))).catch(() => []);
    K?.ready?.then?.(() => {
      if (S || e.nodes.one(y) !== K) return;
      const ce = () => e.selectNodes?.([K]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(ce) : ce();
    }), f || e.announce?.(`${Y(m)} is now a note on the canvas.${d} ${u.label}: ${De(o, u.id)}.${yi(T?.shape)}`);
    const Le = () => {
      e.nodes.one(y) === K && (e.beginHostStep?.(), cn(() => e.removeNode(y)), e.endHostStep?.());
    }, Nn = z(t.onChange, o, { cardId: s, cardToNote: { noteId: y } });
    return e.holdTrade?.(y, Nn), Bo(Nn, () => {
      Fe.then((ce) => {
        K && e.nodes.one(y) === K && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: Gt(K.options) } }, ...ce]);
      });
    }, () => {
      if (!S) {
        if (Le(), o === Z && !o.cards.some((ce) => ce.id === s)) {
          const ce = {
            id: s,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ...M.length ? { lines: M } : {}
          }, _n = Dn(o, m.laneId, ce, g);
          _n && (o = _n, D(o));
        }
        e.announce?.(`${Y(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      S || (Le(), e.keepTrade?.(y), e.announce?.(`Someone else took ${Y(m)} off the lanes first.`));
    }), { added: K, answer: Nn };
  }
  function Ii(s, a, d) {
    const f = d.map((y) => y.id), m = f.indexOf(a), u = s.cards.find((y) => y.id === a);
    if (m < 0 || !u) return s;
    const w = s.cards.filter((y) => y !== u), g = w.findIndex((y) => f.indexOf(y.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, u), V({ ...s, cards: w });
  }
  function Ai(s) {
    re = re.then(() => {
      const a = A.get(s);
      if (S || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Si(s, a) {
    re = re.then(() => {
      const d = A.get(s);
      S || v || !d?.editor?.startInline || d.editor.startInline({ text: a, caret: "all" });
    });
  }
  function cn(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Bo(s, a, d, f) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && f();
    }, () => d());
    e.holdUntil?.(m);
  }
  function Ci(s, a, d) {
    if (!t.confirmOverride || v || L || Re()) return;
    const f = { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() };
    if (!zn(o, s, a, f)) return;
    const m = o.cards.find((g) => g.id === s), u = o.lanes.find((g) => g.id === a);
    let w;
    try {
      w = t.confirmOverride({ cardId: s, laneId: a, card: m.label, lane: u.label, reason: d });
    } catch (g) {
      console.error("WORKSHOP: confirmOverride threw", g);
      return;
    }
    Promise.resolve(w).then((g) => {
      if (g !== !0 || S || v || L || Re()) return;
      const y = o.cards.find((T) => T.id === s), O = y && zn(o, s, a, { by: z(t.overrideBy) || "You", at: (/* @__PURE__ */ new Date()).toISOString() });
      if (!y || !O) {
        e.announce?.(`${y ? Y(y) : "That card"} can't be moved to ${u.label} now.`);
        return;
      }
      o = O, D(o), e.announce?.(`${Y(y)} moved to ${u.label} anyway. ${d}`), z(t.onChange, o, { cardId: s, laneId: a, override: !0 });
    }, () => {
    });
  }
  function $i(s, a) {
    de(!1), te = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => de(), 1500) }, D(o, { skip: a.cardId });
    const d = o.lanes.find((f) => f.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), z(t.onRefuse, a);
  }
  function de(s = !0) {
    te && (clearTimeout(te.timer), te = null, s && !S && Pe());
  }
  function Pe() {
    D(N && N.outcome.kind === "candidate" ? N.outcome.next : G?.next ?? L ?? o, { skip: N?.cardId });
  }
  function Ho(s) {
    const a = Zo(s, zo()), d = new Map(a.map((u) => [u.options.id, u.options])), f = (u, w, g, y = !1) => {
      const O = d.get(Q.column(u));
      O && (O.borderColor = w, O.borderWidth = g, delete O.borderStyle);
      const T = y && d.get(Q.lane(u));
      T && (T.borderColor = w, T.borderWidth = g);
    }, m = N?.cardId ?? G?.cardId;
    if (Se = /* @__PURE__ */ new Map(), m) {
      const u = o.cards.find((y) => y.id === m)?.laneId, w = pr(o, m);
      if (!i || i.laneCues)
        for (const y of w) y.id !== u && (f(y.id, ur, 2), Se.set(y.id, "open"));
      if (i?.laneCues) {
        for (const y of o.lanes) if (!w.includes(y)) {
          const O = d.get(Q.column(y.id));
          O && (O.backgroundColor = "#e9e8e2"), Se.set(y.id, "closed");
        }
      }
      const g = N ? N.outcome : G?.laneId ? { kind: "candidate", laneId: G.laneId } : null;
      g?.kind === "candidate" && (f(g.laneId, cr, 3, !0), Se.set(g.laneId, "over")), g?.kind === "refused" && (f(g.laneId, Kt, 3), Se.set(g.laneId, "refused"));
    }
    if (ee && !m) {
      for (const u of ee.open) u !== ee.laneId && (f(u, ur, 2), Se.set(u, "open"));
      ee.laneId && !ee.refusal && (f(ee.laneId, cr, 3, !0), Se.set(ee.laneId, "over")), ee.laneId && ee.refusal && (f(ee.laneId, Kt, 3), Se.set(ee.laneId, "refused"));
    }
    if (G?.laneId === null && G.spot) {
      const u = d.get(Q.card(G.cardId));
      u && (u.xPos = G.spot.x, u.yPos = G.spot.y);
    }
    if (te) {
      Se.set(te.laneId, "refused"), f(te.laneId, Kt, 3, !0);
      const u = d.get(Q.caption(te.laneId));
      if (u && (u.text = te.reason, u.foregroundColor = "#b42318", !i)) {
        const w = d.get(Q.column(te.laneId));
        w && (u.xPos = w.xPos + 6, u.width = w.width - 12, u.height = 30, u.vectorPath = yn(u.width, 30, 0), u.backgroundColor = "transparent");
      }
    }
    if ($t = /* @__PURE__ */ new Set(), L && s === L) {
      const u = (g, y) => JSON.stringify(g) === JSON.stringify(y), w = (g) => {
        const y = d.get(g);
        y && (y.borderStyle = "dashed", y.borderColor = ws, y.borderWidth = 2, $t.add(le(g)));
      };
      for (const g of s.cards) u(g, o.cards.find((y) => y.id === g.id)) || w(Q.card(g.id));
      for (const g of s.lanes) u(g, o.lanes.find((y) => y.id === g.id)) || w(Q.lane(g.id));
    }
    for (const u of a) {
      u.options.id = le(u.options.id);
      for (const w of u.relationships.associations)
        w.parentId = le(w.parentId), w.childId = le(w.childId);
    }
    return a;
  }
  function zo() {
    return N || G ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function D(s, a = {}) {
    if (S) return;
    xe = a.layout ?? ae, Ue = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Ho(s), f = [];
    for (const { options: u } of d) {
      const w = u.id;
      if (A.has(w)) continue;
      const g = an.get(w);
      an.delete(w);
      const y = g && a.animate !== !1 && !st() ? { ...u, xPos: g.x, yPos: g.y } : u, O = e.nodes.add(Vi(y));
      A.set(w, O), E.set(w, { ...y }), O.ready && f.push(O.ready.then(() => {
        if (A.get(w) !== O) return;
        O.applyGovernance?.(), me(w)?.kind === "column" && O.toBack?.(!1), me(w)?.kind === "handle" && O.svgGroup?.front?.();
        const T = Vo(Ue?.model ?? s, w);
        T && O.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const m = Ue;
    re = Promise.all([re, ...f]).then(() => {
      S || Ue !== m || Li(Ho(m.model), m);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function Li(s, a) {
    const d = new Set(s.map((m) => m.options.id)), f = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, w] of [...A]) {
        if (d.has(u)) continue;
        for (const [y, O] of [...R])
          O.parentId !== u && O.childId !== u || (O.parent.relationships?.removeAssociation(y), R.delete(y));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), A.delete(u), E.delete(u);
        const g = F.get(u);
        g && (F.delete(u), W.delete(g)), e.nodes.remove(u);
      }
      for (const { options: u } of s) {
        const w = u.id, g = A.get(w);
        if (!g?.svgGroup) continue;
        const y = E.get(w) ?? {}, O = g.editor?.isInlineEditing?.();
        (u.fontSize !== y.fontSize || u.foregroundColor !== y.foregroundColor) && (g.options.fontSize = u.fontSize, g.options.fontColor = u.foregroundColor, g.applyTextStyle?.()), (u.width !== y.width || u.height !== y.height) && (u.vectorPath ? (g.options.width = u.width, g.options.height = u.height, g.setShape?.(g.options.shape, u.vectorPath), me(w)?.kind === "column" && g.toBack?.(!1)) : g.setSize?.(u.width, u.height)), u.text !== y.text && !O && g.setText?.(u.text), u.backgroundColor !== y.backgroundColor && g.setColors?.(u.backgroundColor), (u.borderColor !== y.borderColor || u.borderWidth !== y.borderWidth || u.borderStyle !== y.borderStyle) && (g.options.borderColor = u.borderColor, g.options.borderWidth = u.borderWidth, g.options.borderStyle = u.borderStyle, g.applyBorder?.());
        const T = u.xPos !== y.xPos || u.yPos !== y.yPos || Math.abs((g.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - u.yPos) > 0.5;
        if (w !== (a.skip && le(Q.card(a.skip))) && w !== (a.grip && le(a.grip)) && T) {
          const X = a.animate && !st() ? 180 : 0, Z = f.includes(g) ? () => {
            !S && A.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Z && X && f.length === 1 && g.resizeRotate?.disable?.(), g.position(u.xPos, u.yPos, Z, void 0, X);
        }
        const M = Vo(a.model, w);
        M && g.svgGroup.node.getAttribute("aria-label") !== M && g.svgGroup.node.setAttribute("aria-label", M), $t.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", Ce), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", _);
        const H = me(w);
        if (H?.kind === "column") {
          const X = Se.get(H.key);
          X ? g.svgGroup.node.setAttribute("data-workshop-drop", X) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        H?.kind === "handle" && g.svgGroup.front?.(), E.set(w, { ...u });
      }
      const m = /* @__PURE__ */ new Map();
      for (const u of s) for (const w of u.relationships.associations) m.set(w.id, w);
      for (const [u, w] of [...R])
        m.has(u) && A.get(w.parentId) === w.parent && A.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(u), R.delete(u));
      for (const [u, w] of m) {
        if (R.has(u)) continue;
        const g = A.get(w.parentId), y = A.get(w.childId);
        !g?.relationships || !y?.svgGroup || (g.relationships.addAssociation(y, Wn(w)), R.set(u, { parentId: w.parentId, childId: w.childId, parent: g, child: y }));
      }
      ki(a.model);
    }), un(a.model), Go = a.model, Rt(), e.notifyNodeChanged?.();
  }
  let Go = null;
  function _t() {
    return !!xe.narrow || xe.lanesPerRow === 1;
  }
  function Uo() {
    let s;
    try {
      s = Js(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: xe, focused: Ce, draft: _, scale: C, tagScale: k, narrow: _t(), room: s };
  }
  function Ko() {
    if (U) return [1, 1];
    const s = Dt(), a = Pr(s);
    return [a, Math.round(no(s, _t() && !_, a) * 20) / 20];
  }
  function Rt() {
    if (!h || S) return;
    [C, k] = Ko();
    const s = Go ?? o, a = i ? i.places(s, xe) : _e(s, { layout: xe }), d = i || s.lanes[0]?.station ? void 0 : a.places;
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
      ...Uo(),
      places: d,
      under: f,
      ...t.onFocusDone && { onDone: () => z(t.onFocusDone) }
    });
  }
  function Ti() {
    const s = e.canvas?.node, a = Ko;
    if ([C, k] = a(), U || !h || !s || typeof MutationObserver > "u") return;
    let d = null;
    const f = new MutationObserver(() => {
      d && clearTimeout(d), d = setTimeout(() => {
        d = null;
        const [m, u] = a();
        S || m === C && u === k || (C = m, k = u, Rt());
      }, 120);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), I = () => {
      f.disconnect(), d && clearTimeout(d);
    };
  }
  let Ie = null;
  function qo(s) {
    const a = me(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, be(s)) ?? null : null;
  }
  function Jo() {
    if (x) return i?.cardOfPart?.(o, x.name) ?? null;
    if (N) return N.cardId;
    if (Vn) return Vn;
    const s = S ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && A.get(s[0].id) === s[0] ? qo(s[0].id) : null;
  }
  let Wt = null;
  function Yo() {
    S || !p || !Ie || Jo() !== Wt && un(Ie);
  }
  function un(s) {
    if (p) {
      Ie = s, Wt = Jo();
      const a = o.lanes.map((m) => A.get(le(Q.column(m.id)))?.svgGroup?.node).reduce((m, u) => u && (!m || m.compareDocumentPosition(u) & 4) ? u : m, null), d = e.canvas?.viewbox?.(), f = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - q.x, y: d.y - q.y, width: d.width, height: d.height } : null;
      p.draw(o, s === o ? null : s, {
        origin: q,
        layout: xe,
        above: a,
        view: f,
        announce: (m) => e.announce?.(m),
        focus: Wt,
        boardFocused: Ce,
        picked: b,
        onPick: Mi,
        gripSize: An,
        clamp: x?.last?.clampedReason ? { name: x.name, text: x.last.clampedReason } : N?.outcome.kind === "candidate" && N.outcome.said ? { name: "card-" + N.cardId, text: N.outcome.said } : !x && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!x?.last?.refusal || !x && !!pe,
        onUnlink: (m, u) => {
          if (v || L || N || x || Re()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: u }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: u } }, g = Xe(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : nt(g.workshop, o.lanes[0]?.station ? { laneId: u } : { cardId: m });
        }
      });
    }
  }
  function Ze(s) {
    return { x: s.x - q.x, y: s.y - q.y };
  }
  function Ft(s, a) {
    const d = i?.noteDay?.(o, Ze(a), xe);
    return typeof d == "number" && Number.isFinite(d) && (s.day = d), s;
  }
  function We(s) {
    return i ? i.places(s, xe) : { ..._e(s, { layout: ae }), parts: [] };
  }
  function Oi(s, a) {
    const d = i.places(s, xe).parts.find((f) => f.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function Dt() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function Pi() {
    Jn?.(), Jn = null, An = Ut(Dt());
    const s = e.canvas?.node;
    if (!et() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const d = () => {
      if (a = null, S || !et()) return;
      if (x || N) {
        a = setTimeout(d, 250);
        return;
      }
      const m = Ut(Dt());
      Math.abs(m - An) < 2 || (An = m, D(L ?? o));
    }, f = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(d, 200);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), Jn = () => {
      f.disconnect(), a && clearTimeout(a);
    };
  }
  function et() {
    return !i && !!o.lanes[0]?.station && Ce && !v && !L && !Re();
  }
  function Ei(s) {
    const a = _r(s);
    if (!a || !et()) return null;
    const d = o;
    return (f) => {
      const m = us(d, f), u = hs(d, a, a.kind === "link" && m === a.from ? null : m);
      return u.next ? { next: u.next } : { next: d, clampedReason: u.refusal, refusal: u.refusal };
    };
  }
  function Mi(s) {
    if (S || Ce) return;
    const a = e.getSelectedNodes?.() ?? [];
    $ = new Set(a.map((u) => u.id)), b = s, a.length && e.clearSelection?.(), Ie && un(Ie), ln();
    const [d, f] = s.split(">"), m = (u) => o.lanes.find((w) => w.id === u)?.label ?? u;
    e.announce?.(`Path from ${m(d)} to ${m(f)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function Zo(s, a) {
    if (!i) {
      const d = qs(s, { native: !0, origin: q, rows: a, layout: ae, style: Ct }).nodes;
      return et() ? [...d, ...Fr(o, q, An)] : d;
    }
    return i.notes(s, xe, q, Ct);
  }
  function nt(s, a, d) {
    const f = i ? i.editsBetween(o, s) : ps(o, s);
    if (!f.length) return !1;
    const m = Xe(o, f);
    return "refused" in m ? (e.announce?.(m.refused.reason), z(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, D(o, { skip: d }), e.announce?.(m.report.edits.map((u) => u.said).join(" ")), z(t.onChange, o, { ...a, edits: f }), !0);
  }
  function Vo(s, a) {
    const d = me(a);
    if (d?.kind === "lane" || d?.kind === "caption") {
      if (d.kind === "caption" && s.lanes.some((m) => m.station)) return null;
      const f = s.lanes.find((m) => m.id === d.key);
      return f ? `${f.label}, ${De(s, f.id)}` : null;
    }
    if (d?.kind === "card") {
      const f = s.cards.find((u) => u.id === d.key), m = f && s.lanes.find((u) => u.id === f.laneId);
      return f && m ? `${f.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? i ? i.label?.(s, be(a)) ?? null : fs(s, be(a)) : null;
  }
  function jt(s, a) {
    const d = Zo(s).find((f) => f.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Ve() {
    (N || x) && e.cancelGovernedDrag?.("host"), N = null, x = null, G && (G = null, z(t.onPreview, null)), de(!1);
  }
  return {
    toCanvas(s) {
      if (S || v || Re()) return "This workshop is view-only here.";
      if (!o.cards.some((u) => u.id === s)) return "That card is no longer on the board.";
      const a = ut(o, s);
      if (a) return a;
      G && Je(), L && (Ve(), L = null, D(o), e.refreshGovernance?.());
      const { width: d } = We(o), f = A.get(le(Q.card(s)))?.options, m = o.cards.find((u) => u.id === s);
      return Qn(s, Cn({
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
      return { ...ae };
    },
    get bounds() {
      const { width: s, height: a } = We(o);
      return { x: q.x, y: q.y, width: s, height: a };
    },
    get frame() {
      const { width: s, height: a } = We(o);
      if (!h) return { x: q.x, y: q.y, width: s, height: a };
      const d = Mr(o, { width: s, height: a }, { ...Uo(), scale: 1, tagScale: no(1, _t() && !_) });
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
      a !== Ce && (b && (b = null, queueMicrotask(ln)), !i && o.lanes[0]?.station ? (Ve(), Pi(), D(L ?? o)) : Ie && un(Ie), Rt());
    },
    setLayout(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = fr(s);
      i ? i.places(o, a) : _e(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(ae) && (Ve(), ae = a, D(L ?? o));
    },
    whenDrawn: () => re,
    update(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = V(s);
      Ve(), o = a;
      const d = v;
      v = l || c(o), D(L ?? o), v !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = s ? V(s) : null;
      Ve(), L = a, D(L ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = o.lanes.find((f) => f.id === s);
      S || !d || (de(!1), te = { laneId: s, reason: a, timer: setTimeout(() => de(), 1500) }, Pe(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      l = !!s;
      const a = l || c(o);
      S || v === a || (Ve(), v = a, D(L ?? o), e.refreshGovernance?.());
    },
    destroy() {
      S || (Ve(), S = !0, Fn.get(e)?.delete(Tt), Jn?.(), I?.(), h?.destroy(), pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", Lo, !0), Ke && clearTimeout(Ke), e.element?.ownerDocument?.removeEventListener?.("pointerup", To, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", Oo, !0), fi?.(), p && e.element?.removeEventListener?.("pointerover", $o), e.withPolicyAuthority(() => {
        for (const [s, a] of we) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of R) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of A)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), R.clear(), we.clear(), A.clear(), E.clear(), W.clear(), F.clear(), ui(), p?.destroy(), Yn = !1, ln(), e.notifyNodeChanged?.());
    }
  };
}
function z(e, ...n) {
  try {
    return e?.(...n);
  } catch (t) {
    console.error("WORKSHOP: a host callback threw", t);
    return;
  }
}
function Jt(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function bs(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function fr(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function vs(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const xs = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function ie(e) {
  return xs.includes(e.kind) ? e.kind : void 0;
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
function Is(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = vt(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function vt(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const xt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function ro(e) {
  if (typeof e != "string" || !xt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function Dr(e) {
  return e.noteId ?? e.id;
}
function It(e) {
  const n = vt(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function jr(e) {
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
function Oe(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Br = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, As = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function io(e) {
  const n = ge(e), t = {}, r = (i) => {
    if (typeof i != "string" || !Br.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, c, p) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < c || i > p) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !As.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function Hr(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        io({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return io(n);
}
function so(e) {
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
function hr(e) {
  try {
    return !!gt({ link: e });
  } catch {
    return !1;
  }
}
function gt(e) {
  const n = ge(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = ge(n.image);
    if (!so(r.src)) throw new Error("A card keeps a picture by its web address only.");
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
const bn = 96, Ss = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Cs = ["solid", "dashed", "dotted"], $s = 1e7;
function vn(e) {
  const n = ge(e);
  if (typeof n.id != "string" || !Ss.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: ro(n.parentId), childId: ro(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, c) => {
    const p = n[o];
    if (p != null) {
      if (typeof p != "number" || !Number.isFinite(p) || p < i || p > c) throw new Error("A line's look is out of range.");
      t[o] = p;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !Br.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Cs.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = ge(n.targetPoint), i = (c) => typeof c == "number" && Number.isFinite(c) && Math.abs(c) <= $s;
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
function Ls(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map(vn).map((r) => zr(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (je(t.map((r) => r.id), "line ID"), t.length > bn) throw new Error(`A workshop holds up to ${bn} lines.`);
  return t;
}
function zr(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function je(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function bo({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function Ts(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const kn = (e) => "lane-" + e, He = (e) => "card-" + e, yt = (e) => "image-" + e;
function ba(e, n = {}) {
  const t = Ts(e), r = Q.of(n.scope);
  return bo(e).map((o) => {
    const i = e.cards.filter((h) => h.laneId === o.id), c = t.filter((h) => h.laneId === o.id), p = [r.lane(o.id)];
    return o.station?.image && p.push(r.image(o.id)), { lane: o, cards: i, signals: c, nodeIds: [...p, ...i.map((h) => r.card(h.id))] };
  });
}
const vo = 5, jn = 24, ao = 3;
function Os(e, n, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A move made anyway says who made it, when, and past which rule.");
  const r = e, o = (i, c) => typeof i == "string" && i.trim().length > 0 && i.length <= c && !/[\u0000-\u001f\u007f<>]/.test(i);
  if (!o(r.by, 80) || !o(r.at, 40) || Number.isNaN(Date.parse(r.at)) || !o(r.sentence, 300) || typeof r.from != "string" || !n.includes(r.from) || r.from === t || Object.keys(r).some((i) => !["by", "at", "sentence", "from"].includes(i)))
    throw new Error("A move made anyway says who made it, when, past which rule, and the lane it came from.");
  return { by: r.by, at: r.at, sentence: r.sentence, from: r.from };
}
function V(e) {
  const n = ge(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ie(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = ie(n), o = r ? ve(r) : void 0, i = { id: Oe }, c = Ae(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > vo)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const p = o?.cards ?? [jn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > p[0]) throw new Error(p[1]);
  const h = n.lanes.map((b) => {
    const $ = ge(b), x = { id: Oe($.id), label: Ae($.label) };
    if ($.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if ($.capacity !== void 0) {
      const L = t ? 576 : 24;
      if (typeof $.capacity != "number" || !Number.isInteger($.capacity) || $.capacity < 1 || $.capacity > L)
        throw new Error(`Lane capacity must be a whole number from 1 to ${L}.`);
      x.capacity = $.capacity;
    }
    if (o?.readLane?.($, x, i), $.station !== void 0) {
      const L = ge($.station), _ = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= ao)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray(L.next) || L.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const U = L.next.map(Oe);
      je(U, "onward stop"), x.station = { column: _(L.column), row: _(L.row), next: U, outcome: Ae(L.outcome, 160) }, L.image !== void 0 && (x.station.image = jr(L.image));
    }
    return x;
  }), C = h.map((b) => b.id);
  if (je(C, "lane ID"), r && h.some((b) => b.station)) throw new Error("A business board has no map stations.");
  if ((t || h.some((b) => b.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (h.some((b) => b.station) && n.cards.every((b) => b?.free === !0))
    throw new Error("A map needs at least one token.");
  if (h.some((b) => b.station)) {
    if (!h.every((b) => b.station)) throw new Error("Give every station on the map a position.");
    je(h.map((b) => b.station.column + "," + b.station.row), "map position");
    for (const b of h)
      if (b.station.next.some(($) => $ === b.id || !C.includes($))) throw new Error("Connect each stop to another station on this map.");
  }
  const k = n.cards.map((b) => {
    const $ = ge(b), x = { id: Oe($.id), label: r ? Ae($.label) : Is($.label), laneId: Oe($.laneId) };
    if (!C.includes(x.laneId)) throw new Error("Card refers to an unknown lane.");
    if ($.override !== void 0) {
      if (r || t || n.experience !== void 0) throw new Error("Only the cards of lane boards and maps are moved past a rule.");
      x.override = Os($.override, C, x.laneId);
    }
    if ($.allowedLaneIds !== void 0) {
      if (!Array.isArray($.allowedLaneIds) || $.allowedLaneIds.length > h.length) throw new Error("Invalid allowed lanes.");
      if (x.allowedLaneIds = $.allowedLaneIds.map(Oe), je(x.allowedLaneIds, "allowed lane"), !x.allowedLaneIds.includes(x.laneId) && !x.override || !x.allowedLaneIds.every((L) => C.includes(L)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if ($.look !== void 0) {
      const L = io($.look);
      L && (x.look = L);
    }
    if ($.asNote !== void 0) {
      const L = gt($.asNote);
      L && (x.asNote = L);
    }
    if ($.noteId !== void 0 && $.noteId !== x.id && (x.noteId = ro($.noteId)), $.free !== void 0) {
      if ($.free !== !0 || !h.some((L) => L.station)) throw new Error("Only a map’s cards can be free of its paths.");
      x.free = !0;
    }
    if (o?.readCard($, x, i), t) {
      if (typeof $.points != "number" || !Number.isInteger($.points) || $.points < 1 || $.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (x.points = $.points, $.dependsOn !== void 0) {
        if (!Array.isArray($.dependsOn) || $.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        x.dependsOn = $.dependsOn.map(Oe), je(x.dependsOn, "dependency");
      }
    }
    return x;
  });
  je(k.map((b) => b.id), "card ID");
  const I = { version: 1, title: c, lanes: h, cards: k };
  if (n.experience !== void 0) {
    const b = ge(n.experience);
    if (b.version !== 1 || b.kind !== "customer-interviews" && b.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    I.experience = { version: 1, kind: b.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    I.signals = n.signals.map((b) => {
      const $ = ge(b), x = Oe($.cardId), L = Oe($.laneId);
      if (!k.some((_) => _.id === x) || !C.includes(L))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Oe($.id),
        label: Ae($.label),
        cardId: x,
        laneId: L,
        whenPresent: Ae($.whenPresent, 160),
        whenAbsent: Ae($.whenAbsent, 160)
      };
    }), je(I.signals.map((b) => b.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const b = Ls(n.lines, new Set(k.map(($) => $.id)));
    b.length && (I.lines = b);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    I.presentationOrder = bo({ lanes: h, presentationOrder: n.presentationOrder }).map((b) => b.id);
  }
  if (n.behaviour !== void 0 && (I.behaviour = ke().validate(n.behaviour, { ...I, kind: n.kind })), t)
    return I.kind = "release-plan", Ni(I), I;
  if (r && o) {
    I.kind = r, o.readBoard(n, I, i);
    const b = o.validate(I);
    if (b) throw new Error(b);
    return I;
  }
  for (const b of h)
    if (ze({ cards: k.filter(($) => !$.override) }, b.id) > (b.capacity ?? 1 / 0))
      throw new Error(`Lane "${b.label}" exceeds its capacity.`);
  return I;
}
function ze(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const Gr = 65536;
function va(e) {
  const n = JSON.stringify(V(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > Gr) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function xa(e) {
  if (e.length > Gr) throw new Error("This workshop is too large to open from a link.");
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
function xo(e, n, t) {
  const r = ie(e);
  return r ? ve(r).planMove(e, n, t) : void 0;
}
function kt(e, n) {
  if (ie(e)) return e.lanes.filter((r) => xo(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => Gn(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && ze(e, r.id) < (r.capacity ?? 1 / 0));
}
function lo(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = xo(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = Gn(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !kt(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? At({ ...r, laneId: t }) : i) };
}
function At(e) {
  if (!e.override) return e;
  const { override: n, ...t } = e;
  return t;
}
function nn(e, n, t) {
  const r = Io(e, n, t);
  if (!r || r === e) return r;
  const o = r.cards.some((i) => i.id === n && i.override) ? { ...r, cards: r.cards.map((i) => i.id === n ? At(i) : i) } : r;
  return e.behaviour && "refused" in ke().check(e, o) ? null : o;
}
function Ps(e) {
  return !e.kind && !e.experience;
}
function Ia(e, n, t) {
  const r = e.cards.find((o) => o.id === n);
  return !r || !e.lanes.some((o) => o.id === t) ? "That card or lane is no longer on the board." : r.laneId === t || nn(e, n, t) || zn(e, n, t, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) ? null : tn(e, n, t) ?? "That move is not available.";
}
function zn(e, n, t, r) {
  const o = e.cards.find((C) => C.id === n);
  if (!o || o.laneId === t || !e.lanes.some((C) => C.id === t) || !Ps(e) || nn(e, n, t)) return null;
  const i = (tn(e, n, t) ?? "That move is not available.").slice(0, 300), c = Io(e, n, t), p = c && c !== e ? c : e, h = { by: String(r.by || "Someone").replace(/[\u0000-\u001f\u007f<>]/g, "").slice(0, 80) || "Someone", at: r.at, sentence: i, from: o.laneId };
  try {
    return V({ ...p, cards: p.cards.map((C) => C.id === n ? { ...At(C), laneId: t, override: h } : C) });
  } catch {
    return null;
  }
}
function Aa(e, n, t) {
  const r = new Map(e.cards.map((i) => [i.id, i]));
  if (!n.cards.some((i) => i.override || r.get(i.id)?.override)) return n;
  const o = n.cards.map((i) => {
    const c = r.get(i.id), p = At(i);
    if (!c) return p;
    if (c.laneId === i.laneId) return c.override ? { ...p, override: c.override } : p;
    if (!i.override) return p;
    const h = zn(e, i.id, i.laneId, t);
    return h?.cards.find((C) => C.id === i.id)?.override ? { ...p, override: h.cards.find((C) => C.id === i.id).override } : p;
  });
  return { ...n, cards: o };
}
const Es = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function Ur(e) {
  if (!e.override) return null;
  const n = new Date(e.override.at), t = Number.isNaN(n.getTime()) ? "" : " · " + n.getUTCDate() + " " + Es[n.getUTCMonth()];
  return "Moved anyway by " + e.override.by + t;
}
function Io(e, n, t) {
  const r = e.cards.find((c) => c.id === n);
  if (!r || !e.lanes.some((c) => c.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return Gn(e, r, t);
  const o = xo(e, n, t);
  if (o !== void 0) return o;
  const i = Zs(e, n, t);
  return i || (t === "prototype" && sn(e) === "customer-interviews" ? null : kt(e, r).some((c) => c.id === t) ? lo(e, n, t) : null);
}
function pr(e, n) {
  return e.lanes.filter((t) => nn(e, n, t.id) !== null);
}
function tn(e, n, t) {
  const r = Io(e, n, t);
  if (r !== null) {
    const I = r === e || !e.behaviour ? null : ke().check(e, r);
    return I && "refused" in I ? I.refused.sentence : null;
  }
  const o = e.cards.find((I) => I.id === n), i = e.lanes.find((I) => I.id === t);
  if (!o || !i) return "That move is not available.";
  const c = ie(e), p = c && ve(c).refusal;
  if (p) return p(e, n, t);
  const h = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return h;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return h;
    const I = on(e, t), b = { ...e, lanes: e.lanes.map((x) => x === i ? { id: i.id, label: i.label } : x) }, $ = Gn(b, o, t);
    return $ ? `Needs ${on($, t) - I} points. It already holds ${I} of ${i.capacity} points.` : h;
  }
  const C = e.lanes.find((I) => I.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const k = ze(e, t);
  if (i.capacity !== void 0 && k >= i.capacity && !(C?.station && o.free)) {
    const I = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${k} of ${i.capacity} ${I}.`;
  }
  return h;
}
function Yt(e) {
  return !0;
}
function Ms(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !sn(e);
}
function Ns(e) {
  const n = sn(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function _s(e) {
  const n = vt(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const Rs = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function xn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && Rs.test(n) && !t.has(n) ? n : Kn(e, "card");
}
function Qe(e, n, t) {
  const r = e.lanes.find((p) => p.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = Ns(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= jn ? `This board is at its size limit of ${jn} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : Zr(e, n, t) ? null : tn(Yr(e, n, t), xn(e, t.id), n);
  if (ie(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const p = Vr(e, n, t);
    return typeof p == "string" ? p : mr(e, p);
  }
  if (e.cards.length >= jn) return `This board is at its size limit of ${jn} cards. Remove a card to make room.`;
  const i = e.lanes.some((p) => p.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const c = ze(e, n);
  if (r.capacity !== void 0 && !i && c >= r.capacity) return `It already holds ${c} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const p = qr(t.lines);
    if (!p) return "A line of this note can't be joined to a card.";
    const h = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + p.filter((C) => !h.has(C.id)).length > bn)
      return `A workshop holds up to ${bn} lines.`;
  }
  return mr(e, { ...e, cards: [...e.cards, { id: xn(e, t.id), label: It(Ao(t) || rn(e)), laneId: n }] });
}
function mr(e, n) {
  if (!e.behaviour) return null;
  const t = ke().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function Kr(e) {
  try {
    return e && typeof e == "object" ? Hr(e) : void 0;
  } catch {
    return;
  }
}
function co(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      gt({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? gt(n) : void 0;
}
function qr(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = vn(r);
    } catch {
      const i = (p) => {
        const { id: h, parentId: C, childId: k, targetPoint: I } = ge(r);
        return vn({ id: h, parentId: C, childId: k, ...p ? { targetPoint: I } : {} });
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
function St(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function hn(e, n, t) {
  return e && e.map((r) => St(r, n, t));
}
function Jr(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function Dn(e, n, t, r) {
  if (Qe(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return Zr(e, n, t, r);
  if (ie(e)) {
    const L = Vr(e, n, t), _ = L.cards[L.cards.length - 1], U = r === void 0 ? -1 : e.cards.findIndex((l) => l.id === r && l.laneId === n);
    return U < 0 ? L : { ...L, cards: [...e.cards.slice(0, U), _, ...e.cards.slice(U)] };
  }
  const o = Kr(t.look), i = Ao(t), c = i || rn(e);
  let p = co(t.asNote);
  i || (p = { ...p, text: "" }), c.length > 80 && p?.text === void 0 && c.length <= 4e3 && (p = { ...p, text: c });
  const h = xn(e, t.id), C = h !== t.id && typeof t.id == "string" && xt.test(t.id) ? t.id : void 0, k = e.lanes.some((L) => L.station), I = {
    id: h,
    label: It(c),
    laneId: n,
    ...o ? { look: o } : {},
    ...p ? { asNote: p } : {},
    ...C ? { noteId: C } : {},
    ...k ? { free: !0 } : {}
  }, b = r === void 0 ? -1 : e.cards.findIndex((L) => L.id === r && L.laneId === n), $ = b < 0 ? [...e.cards, I] : [...e.cards.slice(0, b), I, ...e.cards.slice(b)], x = t.lines === void 0 ? void 0 : Jr(e, qr(t.lines).map((L) => St(L, t.id, I.id)));
  return V({ ...e, cards: $, ...x ? { lines: x } : {} });
}
function Yr(e, n, t, r) {
  const { label: o, points: i } = _s(typeof t.label == "string" ? t.label : ""), c = xn(e, t.id), p = c !== t.id && typeof t.id == "string" && xt.test(t.id) ? t.id : void 0, h = { id: c, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...p ? { noteId: p } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((k) => k.id === r && k.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, h] : [...e.cards.slice(0, C), h, ...e.cards.slice(C)] };
}
function Zr(e, n, t, r) {
  const o = Yr(e, n, t, r), i = xn(e, t.id), c = o.cards.find((h) => h.id === i);
  if (c.laneId === n) return V(o);
  const p = Gn(o, c, n);
  return p ? V(p) : null;
}
function Vr(e, n, t) {
  const r = Ao(t), o = ve(ie(e)).fromNote(e, r, rn(e, t.under));
  if (typeof o == "string") return o;
  const i = Xe(e, [{ kind: "add_card", lane: { id: n }, ...o, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const c = i.workshop.cards, p = xn(e, t.id), h = p !== t.id && typeof t.id == "string" && xt.test(t.id) ? t.id : void 0, C = Kr(t.look), k = r ? co(t.asNote) : { ...co(t.asNote), text: "" };
  c[c.length - 1] = {
    ...c[c.length - 1],
    id: p,
    ...h ? { noteId: h } : {},
    ...C ? { look: C } : {},
    ...k ? { asNote: k } : {}
  };
  const I = ve(ie(e));
  return typeof t.day == "number" && Number.isFinite(t.day) && I.landNote ? I.landNote(i.workshop, p, t.day) : i.workshop;
}
function Ao(e) {
  return typeof e?.label == "string" ? vt(e.label) : "";
}
function wr(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === rn(e, n.parentId) || n.label === rn(e)) ? "" : t !== void 0 && t !== "" && It(t) === n.label ? t : uo(e, n);
}
function Xr(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = ie(e);
  if (t) return ve(t).cardText(e, n);
  const r = Ur(n);
  return r ? n.label + `
` + r : n.label;
}
function uo(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = ie(e);
  return t ? ve(t).noteText(e, n) : n.label;
}
function ut(e, n) {
  const t = e.cards.find((r) => r.id === n);
  if (!t) return "That card is no longer on the board.";
  if (sn(e)) return "This card stays on the board.";
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
function gr(e, n, t = Qr(e, n)) {
  if (ut(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const c = { ...i, dependsOn: i.dependsOn.filter((p) => p !== n) };
    return c.dependsOn.length || delete c.dependsOn, c;
  }), o = e.lines?.map((i) => St(i, n, t));
  return V({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Ws(e, n, t = Qr(e, n)) {
  const r = new Set(e.cards.filter((c) => c.id !== n).map((c) => c.id)), o = (e.lines ?? []).filter((c) => c.parentId === n || c.childId === n).map((c) => St(c, n, t)), i = (c) => r.has(c.parentId) || r.has(c.childId);
  return { stay: o.filter(i), leave: o.filter((c) => !i(c)) };
}
function Qr(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? Dr(t) : n;
}
function Zt(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function Bn(e, n) {
  if (e.kind) return Fs;
  let t;
  try {
    t = vn(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = zr(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= bn ? `A workshop holds up to ${bn} lines.` : null;
}
const Fs = "Lines join the cards of a lane workshop to notes and to each other.";
function ft(e, n) {
  return Bn(e, n) !== null ? null : V({ ...e, lines: Jr(e, [vn(n)]) });
}
function yr(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? V({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function ei(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((c) => c.id));
  let i = `${n}->${t}`;
  for (let c = 2; o.has(i); c++) i = `${n}->${t}~${c}`;
  return vn({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function Ds(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function js(e, n) {
  return ni(e, n, !1);
}
function De(e, n) {
  return ni(e, n, !0);
}
function ni(e, n, t) {
  const r = e.lanes.find((k) => k.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const k = on(e, n);
    return r.capacity ? k + (t ? " of " : " / ") + r.capacity + " points" : k + " points";
  }
  const o = ie(e);
  if (o) return ve(o).caption(e, n);
  const i = Vs(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const c = e.cards.filter((k) => k.laneId === n).length, p = e.behaviour ? ke().laneLimit(e, n) : r.capacity, h = ze(e, n), C = (k) => k + (k === 1 ? " card" : " cards");
  return t ? p !== void 0 && h !== c ? h + " of " + p + " · " + C(c - h) : p !== void 0 ? c + " of " + p : C(c) : p !== void 0 && h !== c ? h + " / " + p + " · +" + (c - h) : p !== void 0 ? c + " / " + p : String(c);
}
function Bs(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || ie(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? ke().laneLimit(e, n) : t.capacity;
  return r !== void 0 && ze(e, n) >= r;
}
const Un = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, pn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function ti(e, n = Un, t = 28, r) {
  const { pitch: o, row: i, top: c } = n, p = !!e.lanes[0].station, h = e.lanes.map((I) => e.cards.filter((b) => b.laneId === I.id).length), C = c + Math.max(1, ...r ?? h) * i + 36, k = e.lanes.map((I, b) => ({
    x: p ? I.station.column * (o + t) : b * o,
    y: p ? I.station.row * C : 0
  }));
  return {
    points: k,
    width: Math.max(...k.map((I) => I.x)) + o,
    height: Math.max(...k.map((I, b) => I.y + c + (p ? Math.max(1, h[b]) : h[b] + 1) * i))
  };
}
function Sa() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Kn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function oi(e) {
  const n = V(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Hs(e, n) {
  const t = oi(e), r = Kn(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), V(t);
}
function zs(e, n, t) {
  const r = oi(e);
  return r.cards.push({
    id: Kn(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), V(r);
}
function Ca() {
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
function kr(e, n, t) {
  const r = V(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((k) => k.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= vo) throw new Error("A map can have up to five stations.");
  const i = Ae(t?.label), c = Ae(t?.outcome, 160), p = Kn(r, "station");
  let h, C = 1 / 0;
  for (let k = 0; k < ao; k++)
    for (let I = 0; I < ao; I++) {
      if (r.lanes.some(($) => $.station.column === I && $.station.row === k)) continue;
      const b = Math.abs(o.station.column - I) + Math.abs(o.station.row - k);
      b < C && (C = b, h = { column: I, row: k });
    }
  if (!h) throw new Error("There is no free station position.");
  return o.station.next.push(p), r.lanes.push({ id: p, label: i, station: { ...h, next: [], outcome: c, ...t.image === void 0 ? {} : { image: jr(t.image) } } }), r.presentationOrder?.push(p), r;
}
const $a = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, fo = (e) => "caption-" + e, gn = (e) => "column-" + e, br = "rules-board";
function qn(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function La(e, n) {
  const t = qn(n);
  return t ? t + ":" + e : e;
}
const Q = {
  lane: kn,
  card: He,
  image: yt,
  caption: fo,
  column: gn,
  rules: br,
  of(e) {
    const n = qn(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(kn(r)),
      card: (r) => t(He(r)),
      image: (r) => t(yt(r)),
      caption: (r) => t(fo(r)),
      column: (r) => t(gn(r)),
      rules: t(br)
    };
  }
};
function ri(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function ii(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function yn(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function vr(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function xr(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((p, h) => p + Math.max(1, Math.ceil(h.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const si = 152, ho = si + 12, Gs = 12;
function Us(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function _e(e, n = {}) {
  const t = V(e), { pitch: r, row: o, top: i } = Un, c = t.lanes.map((b) => t.cards.filter(($) => $.laneId === b.id).length), p = (b) => Math.max(c[b], (Array.isArray(n.rows) ? n.rows[b] : n.rows) ?? 0), h = !!t.lanes[0].station, C = t.lanes.some((b) => b.station?.image), k = Us(n.layout, t.lanes.length), I = [];
  if (h) {
    const { points: b } = ti(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach(($, x) => I.push({
      laneId: $.id,
      x: b[x].x,
      y: b[x].y + (C ? $.station.row * ho : 0),
      width: r,
      height: i + ($.station.image ? ho : 0) + Math.max(1, p(x)) * o,
      column: $.station.column,
      row: $.station.row
    }));
  } else {
    let b = 0;
    for (let $ = 0; $ < t.lanes.length; $ += k) {
      const x = t.lanes.slice($, $ + k), L = i + (Math.max(...x.map((_, U) => p($ + U))) + 1) * o;
      x.forEach((_, U) => I.push({ laneId: _.id, x: U * r, y: b, width: r, height: L, column: U, row: $ / k })), b += L + Gs;
    }
  }
  return { places: I, width: Math.max(...I.map((b) => b.x + b.width)), height: Math.max(...I.map((b) => b.y + b.height)) };
}
function Ks(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: c } = Un, p = n.origin ?? { x: 0, y: 0 }, h = !!e.lanes[0].station, { places: C } = _e(e, n), k = n.style ?? {}, I = k.textColor ?? Rn.fontColor, b = k.borderColor ?? Rn.borderColor, $ = k.borderWidth ?? Rn.borderWidth, x = k.cornerRadius ?? 0, L = k.fontSize ?? Rn.fontSize, _ = k.laneFontSize ?? L + 2, U = k.captionFontSize ?? Math.max(11, L - 1), l = [], v = (A) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: yn(A.width, A.height, x),
      foregroundColor: I,
      borderColor: b,
      borderWidth: $,
      ...k.fontFamily ? { fontFamily: k.fontFamily } : {},
      ...A
    }, relationships: { associations: [] } };
    return l.push(E), E;
  };
  e.lanes.forEach((A, E) => {
    const R = C[E], W = p.x + R.x, F = p.y + R.y, N = A.station?.image;
    v({
      id: gn(A.id),
      text: "",
      name: A.label,
      xPos: W + 2,
      yPos: F,
      width: t - 4,
      height: R.height,
      vectorPath: yn(t - 4, R.height, x ? x + 2 : 0),
      backgroundColor: h ? "#fcf9ed" : vr(pn[E], 0.6),
      borderColor: h ? "#a8b5aa" : vr(pn[E], 0.1),
      borderWidth: 1,
      ...h ? { borderStyle: "dashed" } : {}
    }), v({
      id: kn(A.id),
      text: A.label,
      name: A.label,
      xPos: W + 8,
      yPos: F + 6,
      width: r,
      height: 58,
      backgroundColor: pn[E],
      fontSize: xr(A.label, _, r - 16, 50)
    });
    const G = h ? "" : js(e, A.id), se = U, ee = h ? r : Math.min(r, Math.max(40, Math.ceil(G.length * se * 0.6) + 24));
    v({
      id: fo(A.id),
      text: G,
      name: A.label,
      xPos: W + 8 + Math.round((r - ee) / 2),
      yPos: F + 68,
      width: ee,
      height: 22,
      vectorPath: yn(ee, 22, h ? 0 : 11),
      backgroundColor: h ? "transparent" : Bs(e, A.id) ? pn[E % pn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: se
    }), N && l.push({ options: {
      id: yt(A.id),
      name: N.alt,
      text: "",
      xPos: W + 8,
      yPos: F + c,
      width: r,
      height: si,
      shapeHint: "rectangle",
      image: N.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((ye) => ye.laneId === A.id).forEach((ye, In) => {
      const an = Xr(e, ye), te = h ? r - 20 : r, pe = h ? i - 6 : i, Ge = h && !ye.free, re = Ge ? {} : { ...k.card, ...ye.look }, Ue = Ge ? x : k.card?.cornerRadius ?? x;
      v({
        id: He(ye.id),
        text: an,
        name: ye.label,
        xPos: W + (h ? 18 : 8),
        yPos: F + c + (N ? ho : 0) + In * o,
        width: te,
        height: pe,
        ...Ue !== x ? { vectorPath: yn(te, pe, Ue) } : {},
        backgroundColor: Ge ? "#ffda75" : re.backgroundColor ?? k.backgroundColor ?? Rn.backgroundColor,
        ...re.textColor ? { foregroundColor: re.textColor } : {},
        ...re.fontFamily ? { fontFamily: re.fontFamily } : {},
        ...re.borderColor ? { borderColor: re.borderColor } : {},
        ...re.borderWidth !== void 0 ? { borderWidth: re.borderWidth } : {},
        fontSize: xr(an, re.fontSize ?? L, te - 16, pe - 8)
      });
    });
  });
  const S = new Map(l.map((A) => [A.options.id, A]));
  for (const A of e.lanes)
    A.station && (S.get(gn(A.id)).relationships.associations = A.station.next.map((E) => ({
      id: A.id + "-to-" + E,
      parentId: gn(A.id),
      childId: gn(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const A of e.cards)
      for (const E of A.dependsOn ?? []) {
        const R = He(E), W = He(A.id);
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
  if (ri(l, qn(n.scope)), n.beside) {
    const A = new Set(n.beside), E = new Set(l.map((F) => F.options.id)), R = /* @__PURE__ */ new Map();
    for (const F of [...E]) {
      if (!A.has(F)) continue;
      const N = ii(F, (G) => A.has(G) || E.has(G));
      E.add(N), R.set(F, N);
    }
    const W = (F) => R.get(F) ?? F;
    for (const F of l) {
      F.options.id = W(F.options.id);
      for (const N of F.relationships.associations)
        N.parentId = W(N.parentId), N.childId = W(N.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: l };
}
function Ta(e, n, t = {}) {
  return e.behaviour ? ke().note(e, n, t) : null;
}
function qs(e, n) {
  const t = V(e), r = qn(n?.scope);
  if (n?.native) return Ks(t, n);
  const { width: o, row: i, height: c, top: p } = Un, h = [];
  function C(x, L, _, U, l, v) {
    h.push({ options: {
      id: x,
      text: L,
      name: L,
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
  const { points: k } = ti(t), I = 152, b = I + 12, $ = t.lanes.some((x) => x.station?.image);
  t.lanes.forEach((x, L) => {
    const _ = k[L].x, U = k[L].y + ($ ? (x.station?.row ?? 0) * b : 0), l = x.station?.image, v = t.kind === "release-plan" ? x.label + `
` + (x.capacity ? on(t, x.id) + " / " + x.capacity + " points" : on(t, x.id) + " points") : x.label;
    C(kn(x.id), v, _, U, p - 12, pn[L]), l && h.push({ options: {
      id: yt(x.id),
      name: l.alt,
      text: "",
      xPos: _,
      yPos: U + p,
      width: o,
      height: I,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((S) => S.laneId === x.id).forEach((S, A) => C(He(S.id), Xr(t, S), _, U + p + (l ? b : 0) + A * i, c, "#fffdf6"));
  });
  for (const x of t.lanes) {
    if (!x.station) continue;
    const L = h.find((_) => _.options.id === kn(x.id));
    L.relationships.associations = x.station.next.map((_) => ({ id: x.id + "-to-" + _, parentId: L.options.id, childId: kn(_), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), L.options.text = x.label + `
` + x.station.outcome, L.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const x = new Map(h.map((L) => [L.options.id, L]));
    for (const L of t.cards)
      for (const _ of L.dependsOn ?? []) {
        const U = He(_), l = He(L.id);
        x.get(U).relationships.associations.push({
          id: `dependency-${_.length}-${_}-${L.id}`,
          parentId: U,
          childId: l,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return ri(h, r), { options: { name: t.title }, shareId: "", nodes: h };
}
function Js(e, n = {}, t) {
  const r = V(e), o = n.narrow ? void 0 : n.width;
  if (ie(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: p, height: h } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(p, o ?? 0), height: h };
  }
  const { width: i, height: c } = _e(r, {});
  return { width: Math.max(vo * Un.pitch, i), height: c };
}
function Ys(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((c) => [c.x, c.y, c.width, c.height].every(Number.isFinite));
  for (let c = 0; c <= i.length; c++) {
    const p = i.find((h) => o < h.x + h.width + r && o + e.width > h.x - r && e.y < h.y + h.height + r && e.y + e.height > h.y - r);
    if (!p) break;
    o = t > 0 ? p.x + p.width + r : p.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const Oa = {
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
}, po = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], So = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Pa() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: po.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: po.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function Ea() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...So.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function sn(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...So.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => po.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function Zs(e, n, t) {
  const r = sn(e), o = e.cards.find((c) => c.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const c = e.cards.find((p) => p.laneId === t);
    if (c) {
      if (!kt(e, c).some((p) => p.id === "interviews")) return null;
      i = lo(e, c.id, "interviews");
    }
  }
  return kt(i, o).some((c) => c.id === t) ? lo(i, n, t) : null;
}
function Vs(e, n) {
  if (sn(e) !== "experiment-budget") return null;
  const t = So.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  ls as CHROME_CHIPS_MAX_SCALE,
  Or as CHROME_MAX_SCALE,
  Rn as DEFAULT_NOTE_STYLE,
  as as DRAFT_TAG,
  Ar as WORKSHOP_BOARD_KINDS,
  dt as WorkshopReferenceError,
  kr as addWorkshopBranch,
  zs as addWorkshopCard,
  Hs as addWorkshopLane,
  Xe as applyWorkshopEdits,
  ka as attachWorkshop,
  kt as availableLanes,
  Ta as behaviourNote,
  sr as boardBadgeShapes,
  Mr as boardChromeBox,
  ds as boardChromeLabel,
  Er as boardChromeLayout,
  ir as boardChromeShapes,
  ya as boardChromeStyles,
  go as boardLegend,
  xs as businessBoardKinds,
  ie as businessKind,
  Zi as canHangPanel,
  So as channels,
  Yi as checkWorkshopReplacement,
  he as chromeInk,
  Pr as chromeScaleAt,
  no as chromeTagScaleAt,
  Fi as countWord,
  ts as createBoardLayer,
  Ea as createBudgetWorkshop,
  Pa as createInterviewWorkshop,
  Sa as createLaneWorkshop,
  Ca as createWorkshopMap,
  xa as decodeWorkshopFragment,
  ga as describeFocusDarkroom,
  ua as describeWorkshopEdits,
  va as encodeWorkshopFragment,
  oa as handoffSummary,
  pa as hangGalleryPanel,
  Oa as industrialWorkshop,
  wa as initialFocusDarkroom,
  po as interviews,
  Bi as isRuleEdit,
  pn as laneColors,
  mn as layerInk,
  en as listed,
  tt as listeningRoom,
  ia as listeningRoomCaption,
  jn as maxWorkshopCards,
  bn as maxWorkshopLines,
  fa as moonGallery,
  lo as moveWorkshopCard,
  ca as named,
  Kn as nextWorkshopId,
  $a as nightTransfer,
  ma as normalizeFocusDarkroom,
  ra as normalizeListeningRoom,
  ha as normalizeMoonGallery,
  ea as normalizeOfflineHandoff,
  Qs as offlineHandoff,
  Zs as planStartupMove,
  Di as pointing,
  $r as printFields,
  da as registerRulebook,
  aa as registerWorkshopRules,
  on as releaseLoad,
  sa as releasePlan,
  wn as renderLayerShapes,
  ta as resolveHandoff,
  Ts as resolveWorkshopSignals,
  na as reviewHandoff,
  yn as roundedBox,
  ke as rulebook,
  Ri as rulebookLoaded,
  P as said,
  sn as startupExperienceKind,
  mo as unquoted,
  V as validateWorkshop,
  pt as workshopBoardKind,
  qn as workshopBoardScope,
  Vs as workshopBudgetResult,
  nn as workshopCandidate,
  gr as workshopCardAsNote,
  ut as workshopCardAsNoteRefusal,
  It as workshopCardLabelOf,
  Ws as workshopCardLines,
  Hr as workshopCardLookOf,
  uo as workshopCardNoteText,
  wr as workshopCardNoteWords,
  Xr as workshopCardText,
  pr as workshopDestinations,
  Qt as workshopEditKinds,
  Vt as workshopFinder,
  Ys as workshopFreeSpot,
  Ia as workshopHardLimit,
  hr as workshopKeepsLink,
  so as workshopKeepsPicture,
  js as workshopLaneCaption,
  Bs as workshopLaneFull,
  ze as workshopLaneHeld,
  _e as workshopLanePlaces,
  De as workshopLaneSpoken,
  Un as workshopLayout,
  Bn as workshopLineRefusal,
  Zt as workshopLinesOf,
  Fs as workshopLinesSentence,
  rn as workshopNewCardName,
  ei as workshopNewLine,
  Q as workshopNodeIds,
  Dn as workshopNoteCandidate,
  Dr as workshopNoteIdOf,
  Qe as workshopNoteRefusal,
  zn as workshopOverrideCandidate,
  Ur as workshopOverrideLine,
  ti as workshopPositions,
  bo as workshopPresentationLanes,
  ba as workshopPresentationScenes,
  Gi as workshopReferences,
  tn as workshopRefusal,
  hn as workshopRenamedLines,
  Js as workshopReserve,
  nr as workshopRuleSchema,
  ve as workshopRules,
  la as workshopRulesLoaded,
  La as workshopScopedId,
  Aa as workshopStampOverrides,
  ii as workshopStandInId,
  Ms as workshopTakesLines,
  Yt as workshopTakesNotes,
  qs as workshopToSlate,
  ft as workshopWithLine,
  Ds as workshopWithoutCardLines,
  yr as workshopWithoutLine
};
