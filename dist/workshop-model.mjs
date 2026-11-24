import { D as Wn } from "./NoteDefaults-1xFW0br8.mjs";
const oa = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function ra(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: c, fallback: p } = e, h = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !h(i) || !h(c) || !h(p) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: c.trim(), fallback: p.trim() };
}
function ia(e) {
  return { ...e, stage: "review", choice: null };
}
function sa(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function aa(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const ot = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function la(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, c = (p) => typeof p == "string" && p.trim().length > 0 && p.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(p);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !c(o) || !c(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function da({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === ot.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === ot.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === ot.leftLabel && t === ot.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
function on(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function Ri(e) {
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
function Un(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((x, b) => [x.id, b])), o = r.get(t);
  if (o === void 0) return null;
  const i = o < r.get(n.laneId), c = /* @__PURE__ */ new Set([n.id]), p = [n];
  for (; p.length; ) {
    const x = p.pop();
    for (const b of e.cards) {
      if (c.has(b.id)) continue;
      const $ = r.get(b.laneId);
      (i ? $ > o && x.dependsOn?.includes(b.id) : $ < o && b.dependsOn?.includes(x.id)) && (c.add(b.id), p.push(b));
    }
  }
  if (e.cards.filter((x) => c.has(x.id)).some((x) => x.allowedLaneIds && !x.allowedLaneIds.includes(t))) return null;
  const C = { ...e, cards: e.cards.map((x) => c.has(x.id) ? { ...x, laneId: t } : x) }, k = e.lanes[o].capacity;
  return k !== void 0 && on(C, t) > k ? null : C;
}
const ca = {
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
}, vt = /* @__PURE__ */ new Map(), Wi = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function ua(e) {
  vt.set(e.kind, e);
}
function fa(e) {
  return typeof e == "string" && vt.has(e);
}
function rn(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? vt.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function ve(e) {
  const n = vt.get(e);
  if (!n) throw new Error(`The ${Wi[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let pt = null;
function ha(e) {
  pt = e;
}
function Fi() {
  return pt !== null;
}
function ke() {
  if (!pt) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return pt;
}
const E = (e) => "“" + e.replace(/[“”]/g, '"') + "”", nn = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Qo = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), wo = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), go = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), pa = (e) => wo(go(e)), Di = [
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
], ji = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Di.indexOf(e.toLowerCase()), Bi = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Sr(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = wo(o);
    i && t.add(i);
  };
  r(e), r(go(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const Ht = "[^\\p{L}\\p{N}]", er = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Qo(n) + "(?:$|" + Ht + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Ht + ")" + Qo(n) + "(?:$|" + Ht + ")", "u").test(e)
], nr = ["first", "second", "third", "fourth", "fifth"];
function Hi(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + nr.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(wo(go(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? nr.indexOf(o) : ji(o) - 1;
  return e[i] ?? null;
}
function zt(e, n, t, r, o) {
  const i = Sr(n, t);
  if (i.some((p) => Bi.test(p))) {
    const p = r && e.find((h) => h.id === r);
    return p ? { item: p, rank: 0 } : { pointing: !0 };
  }
  for (const p of i) {
    if (!p.startsWith("@")) continue;
    const h = e.find((C) => C.id === p.slice(1));
    if (h) return { item: h, rank: 0 };
  }
  for (const [p, h] of er.entries())
    for (const C of i) {
      const k = e.filter((x) => h(x.label.toLowerCase(), C.toLowerCase()));
      if (k.length === 1) return { item: k[0], rank: p };
      if (k.length > 1) return { several: k };
    }
  const c = o ? Hi(e, n, t) : null;
  return c ? { item: c, rank: er.length } : {};
}
class ct extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function Xt(e, n, t, r, o = !1) {
  return { find: (h) => {
    const C = zt(e, h, n, r, o);
    if (C.item) return C.item;
    const k = Sr(h, n), x = k[k.length - 1];
    if (C.pointing) throw new ct("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const $ = [...new Set(C.several.map((I) => I.label))];
      throw new ct($.length === 1 ? C.several.length + " " + t + "s are called " + E($[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + E(x) + ": " + nn($.slice(0, 6).map(E)) + ". Use the whole name.", "ambiguous", C.several.map((I) => I.id));
    }
    const b = e.map(($) => $.label);
    throw new ct("There is no " + t + " called " + E(x) + " here." + (b.length && b.length <= 6 ? " The " + t + "s are " + nn(b.map(E)) + "." : b.length ? "" : " There are no " + t + "s yet."), "unknown", e.map(($) => $.id));
  }, attempt: (h) => zt(e, h, n, r, o).item ?? null, rank: (h) => zt(e, h, n, r, o).rank ?? 1 / 0 };
}
const Cr = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Re = [...Cr], fn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], $r = Cr.slice(5);
function mt(e) {
  if (e.lanes[0]?.station) return "map";
  const n = oe(e);
  return n || (e.kind === "release-plan" ? "release-plan" : sn(e) ?? "lanes");
}
const H = {
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
}, Qt = {
  "launch-plan": H.launchLanes,
  pipeline: H.pipelineLanes,
  budget: H.budgetLanes,
  "hiring-plan": H.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, fe = (e, n) => Object.fromEntries(Re.filter((t) => !e.includes(t)).map((t) => [t, n])), ue = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), te = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ie = (e) => ({ type: "ref", of: "card", about: e }), Gt = (e) => ({ map: e }), Ne = fe(["map"], H.notMap), Oe = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), eo = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ue(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Re,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: te("The lane or step."), label: ue(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Re,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ie("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Re,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ue(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": H.releaseLanes, "customer-interviews": H.keepsLanes, "experiment-budget": H.keepsLanes, map: H.mapAddLane, ...Qt }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: te("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": H.releaseLanes, "customer-interviews": H.keepsLanes, "experiment-budget": H.keepsLanes, ...Qt }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: te("The lane or step it starts in."),
      label: ue(80, "What the card says. Left out, the card takes the board’s name for a new item: “New card”, “New hire”, “New task”, “New deal” (on a map, a token is numbered; a free card is “New stop”).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Oe("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Oe("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Oe("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...$r],
    refusals: { "release-plan": H.releaseCards, "customer-interviews": H.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ie("The card or token.") },
    boards: Re,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: {
      card: ie("The card or token."),
      lane: te("Where it goes."),
      override: { type: "flag", optional: !0, about: "True to move it anyway when a rule refuses it, once the person agreed to break that rule (every board but release plans and startup experiences). The card shows who moved it anyway and when." }
    },
    boards: Re,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ie("The token.") },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: te("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Re.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": H.launchLanes, budget: H.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ie("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: fn,
    refusals: { ...Gt(H.mapCardLanes), ...fe([...fn, "map"], H.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ie("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], H.notPoints), map: H.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: ie("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], H.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ie("The card."),
      lane: te("The lane."),
      whenPresent: ue(160, "What it says when the card is there."),
      whenAbsent: ue(160, "What it says otherwise."),
      label: ue(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: fn,
    refusals: { ...Gt(H.mapOutcome), ...fe([...fn, "map"], H.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ie("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: fn,
    refusals: { ...Gt(H.mapOutcome), ...fe([...fn, "map"], H.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: Re,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: te("The lane or step."), before: te("Present it just before this one.", !0), after: te("Present it just after this one.", !0) },
    boards: Re,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: te("The step it follows."), label: ue(80, "The new step’s name."), outcome: ue(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: te("The step it goes in front of."),
      from: te("Only the path from this step is taken over.", !0),
      label: ue(80, "The new step’s name."),
      outcome: ue(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: te("Where the path starts."), to: te("Where it leads.") },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: te("Where the path starts."), to: te("Where it leads.") },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: te("The step."), outcome: ue(160, "What it says.") },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: te("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: te("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: te("The step."), alt: ue(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Ne
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: ie("The card the line starts at."), to: ie("The card it points to."), label: ue(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: rt()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: ie("One card."), to: ie("The other card.") },
    boards: ["lanes"],
    refusals: rt()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: ie("The card."),
      note: ue(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: ue(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: rt()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: ie("The card."), note: ue(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: rt()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: {
      card: ie("The task."),
      duration: Oe("Its days, 1 to 60.", 60, 1, !0),
      lag: Oe("Days it waits after what it waits on ends, 0 or more (below 0, with override: it starts before what it waits on ends).", 120, -120, !0),
      override: { type: "flag", optional: !0, about: "True to set it anyway when a rule refuses it (a lock, a freeze, an overlap, the line, what it waits on), once the person agreed to break that rule. The task shows who moved it anyway and when." }
    },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], H.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ie("The task that waits."), waitsOn: ie("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], H.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ie("The task that waits."), waitsOn: ie("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], H.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: Oe("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], H.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ie("The deal or line item."), amount: Oe("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: fe(["pipeline", "budget"], H.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Oe("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: fe(["pipeline"], H.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: te("The team giving."), to: te("The team receiving."), amount: Oe("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: fe(["budget"], H.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: Oe("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: fe(["budget"], H.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], H.noRules)
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
    refusals: fe(["lanes", "pipeline"], H.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: ue(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: fe(["lanes", "pipeline"], H.noRules) }
];
function rt() {
  return { ...fe(["lanes"], H.businessLines), "release-plan": H.lines, "customer-interviews": H.lines, "experiment-budget": H.lines, map: H.lines };
}
const zi = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", tr = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, Gi = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function Ui(e, n) {
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
      return { ...r({ type: "integer", minimum: e.min, maximum: Gi(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: tr.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...tr.keys
      }, description: e.about };
  }
}
const Lr = (e) => "optional" in e && e.optional === !0;
function ma(e) {
  const n = e ? mt(X(e)) : void 0;
  return eo.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, c]) => !Lr(c)).map(([c]) => c)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([c, p]) => [c, Ui(p, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const it = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function Ki(e, n) {
  const t = !!e.lanes[0]?.station, r = Xt(e.lanes, t ? it.step : it.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = Xt(e.cards, t ? it.token : it.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const i = e.cards.filter((p) => !p.free), c = (p) => i.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(p.trim()) ? i[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (p) => c(p) ?? o.find(p),
    attempt: (p) => c(p) ?? o.attempt(p),
    rank: (p) => c(p) ? 0 : o.rank(p)
  } };
}
class z {
  constructor(n, t, r = null, o, i, c) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = i, this.limits = c;
  }
}
function wt(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function V(e, n, t = null, r) {
  try {
    return X(e);
  } catch (o) {
    throw new z(wt(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function qi(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (Lr(o)) continue;
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
function Ji(e, n, t, r, o) {
  const i = structuredClone(e), c = t === "map", p = t === "release-plan", h = Ki(i, r), C = { lane: c ? "step" : "lane", card: c ? "token" : "card" };
  function k(l, A, S, v, M = null) {
    if (typeof S == "object") {
      const F = l.find((D) => D.id === S.id);
      if (!F) throw new z("That " + v + " is no longer on the workshop.", "gone", M);
      return F;
    }
    const R = l.find((F) => F.id === S);
    if (R) return R;
    try {
      return A.find(S);
    } catch (F) {
      if (!(F instanceof ct)) throw F;
      const D = F.reason === "ambiguous" ? "ambiguous_reference" : F.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new z(F.message, D, M, void 0, F.candidates.length ? F.candidates : void 0);
    }
  }
  const x = (l, A = null) => k(i.lanes, h.lanes, l, "lane", A), b = (l, A = null) => k(i.cards, h.cards, l, "card", A), $ = (l) => {
    try {
      return x(l);
    } catch {
      return null;
    }
  }, I = (l, A, S = {}, v = !0) => ({ board: l, said: A, changed: v, ...S }), L = (l) => qe(i, l), W = (l) => c ? "The presentation opens with " + E(l[0].label) + "." : "The presentation now runs " + l.map((A) => E(A.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return ke().edit(i, n, o, {
      lane: (l) => x(l),
      card: (l) => b(l),
      done: (l, A, S) => I(l, A, S),
      refuse: (l, A = {}) => {
        throw new z(l, A.code ?? "refused", A.laneId ?? null, A.cardId);
      }
    });
  if ($r.includes(t)) {
    n.kind === "add_card" && or(n, t, x(n.lane).id);
    const l = {
      card: (S) => b(S),
      lane: (S) => x(S),
      refuse: (S, v = {}) => {
        throw new z(S, v.code ?? "refused", v.laneId ?? null, v.cardId, void 0, v.limits);
      },
      settle: (S, v = null, M) => V(S, t, v, M),
      done: (S, v, M) => I(S, v, M),
      who: { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() }
    }, A = ve(t).edit(i, n, l);
    if (A) return A;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const l = V(i, t);
      return I(l, "Renamed the " + (c ? "map" : "workshop") + " to " + E(l.title) + ".");
    }
    case "rename_lane": {
      const l = x(n.lane), A = l.label;
      l.label = n.label;
      const S = V(i, t, l.id);
      return I(S, "Renamed " + E(A) + " to " + E(S.lanes.find((v) => v.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = b(n.card), A = l.label;
      l.label = n.label;
      const S = V(i, t, l.laneId, l.id);
      return I(S, "Renamed " + E(A) + " to " + E(S.cards.find((v) => v.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new z("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new z("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = Ks(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (S) {
        throw new z(wt(S.message, t), "refused");
      }
      const A = l.lanes[l.lanes.length - 1];
      return I(l, "Added the lane " + E(A.label) + ".", { laneId: A.id });
    }
    case "remove_lane": {
      const l = x(n.lane), A = i.cards.filter((S) => S.laneId === l.id);
      if (c) {
        if (A.length) throw new z(E(A[0].label) + " is at " + E(l.label) + ". Move it to another step first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new z("A map needs at least two steps.", "refused", l.id);
      } else {
        if (A.length) throw new z(E(l.label) + " holds " + A.length + (A.length === 1 ? " card" : " cards") + ". Move or remove " + (A.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new z("A workshop needs at least two columns.", "refused", l.id);
      }
      i.lanes = i.lanes.filter((S) => S !== l);
      for (const S of i.lanes) S.station && (S.station.next = S.station.next.filter((v) => v !== l.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((S) => S !== l.id));
      for (const S of i.cards) S.allowedLaneIds && (S.allowedLaneIds = S.allowedLaneIds.filter((v) => v !== l.id));
      return st(i, (S) => S.laneId === l.id), i.behaviour && (i.behaviour = ke().dropLane(i.behaviour, l.id)), I(V(i, t), "Removed the " + C.lane + " " + E(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = x(n.lane);
      if (c) {
        if (n.allowedLanes !== void 0) throw new z(H.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new z("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const N = qn(i, "card");
          i.cards.push({ id: N, label: At(n.label?.trim() || rn(i)), laneId: l.id, free: !0 });
          const U = V(i, t, l.id);
          return I(U, "Added " + E(U.cards.find((ae) => ae.id === N).label) + " to " + E(l.label) + ".", { laneId: l.id, cardId: N });
        }
        let M = n.label;
        if (M === void 0) {
          let N = i.cards.length + 1;
          for (; i.cards.some((U) => U.label === "Token " + N); ) N++;
          M = "Token " + N;
        }
        const R = new Set([...i.lanes, ...i.cards].map((N) => N.id));
        let F = 1;
        for (; R.has("token-" + F); ) F++;
        i.cards.push({ id: "token-" + F, label: M, laneId: l.id });
        const D = V(i, t, l.id);
        return I(D, "Added " + E(D.cards[D.cards.length - 1].label) + " at " + E(l.label) + ".", { laneId: l.id, cardId: "token-" + F });
      }
      if (or(n, t, l.id), i.cards.length >= 24) throw new z("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && L(l.id) >= l.capacity)
        throw new z(E(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", l.id);
      const A = n.allowedLanes && [...new Set(n.allowedLanes.map((M) => x(M).id))];
      let S;
      try {
        S = qs(i, l.id, { label: n.label?.trim() || rn(i), ...A && { allowedLaneIds: A } });
      } catch (M) {
        throw new z(wt(M.message, t), "refused", l.id);
      }
      const v = S.cards[S.cards.length - 1];
      return I(S, "Added " + (v.label ? E(v.label) : "an empty card") + " to " + E(l.label) + ".", { laneId: l.id, cardId: v.id });
    }
    case "remove_card": {
      const l = b(n.card);
      if (c && !l.free && i.cards.filter((A) => !A.free).length === 1) throw new z("A map needs at least one token.", "refused", l.laneId, l.id);
      if (p && i.cards.length === 1) throw new z("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new z("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      i.cards = i.cards.filter((A) => A !== l);
      for (const A of i.cards)
        A.dependsOn?.includes(l.id) && (A.dependsOn = A.dependsOn.filter((S) => S !== l.id), A.dependsOn.length || delete A.dependsOn);
      return st(i, (A) => A.cardId === l.id), I(V(zs(i, l.id), t, l.laneId), "Removed the " + C.card + " " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? i.lanes.find((v) => v.id === n.lane.id) ?? null : $(n.lane), A = b(n.card, l?.id ?? null), S = x(n.lane, A.laneId);
      return J(A, S, n.override === !0);
    }
    case "advance_card": {
      const l = b(n.card), A = i.lanes.find((v) => v.id === l.laneId), S = A.station.next.map((v) => i.lanes.find((M) => M.id === v)).filter((v) => !!v);
      if (!S.length) throw new z(E(l.label) + " is at " + E(A.label) + ", and no path leads on from there.", "refused", A.id, l.id);
      if (S.length > 1)
        throw new z("From " + E(A.label) + " the path goes to " + S.map((v) => E(v.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + S[0].label + "”.", "refused", A.id, l.id);
      return J(l, S[0]);
    }
    case "set_lane_capacity": {
      const l = x(n.lane), A = i.behaviour && ke().setLimit(i, l.id, n.capacity, o);
      if (typeof A == "string") throw new z(A, "refused", l.id);
      if (A) return I(A, E(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const S = c ? "token" : p ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, I(V(i, t, l.id), c ? "Removed the limit at " + E(l.label) + "." : E(l.label) + " now holds any number of " + S + "s.", { laneId: l.id });
      const v = p ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > v)
        throw new z((c ? "A step" : "A lane") + " can hold from 1 to " + v + " " + S + "s.", "refused", l.id);
      const M = p ? i.cards.reduce((R, F) => R + (F.laneId === l.id ? F.points ?? 1 : 0), 0) : L(l.id);
      if (M > n.capacity)
        throw new z(E(l.label) + " already holds " + M + " " + S + (M === 1 ? "" : "s") + ". Move some " + (c ? "on" : "out") + " first, or choose a higher " + (p ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, I(V(i, t, l.id), E(l.label) + " now holds up to " + n.capacity + " " + S + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = b(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, I(V(i, t, l.laneId, l.id), E(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const A = [...new Set(n.lanes.map((v) => x(v)))], S = i.lanes.find((v) => v.id === l.laneId);
      if (!A.includes(S)) throw new z(E(l.label) + " is in " + E(S.label) + " now. Include " + E(S.label) + ", or move the card first.", "refused", S.id, l.id);
      return l.allowedLaneIds = A.map((v) => v.id), I(V(i, t, l.laneId, l.id), E(l.label) + " can now go only in " + nn(A.map((v) => E(v.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = b(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new z("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, I(V(i, t, l.laneId, l.id), E(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = b(n.card), A = [...new Set(n.dependsOn.map((v) => b(v)))], S = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const v = A.filter((M) => l.dependsOn?.includes(M.id));
        if (!v.length) throw new z(E(l.label) + " does not depend on " + nn(A.map((M) => E(M.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter((M) => !v.some((R) => R.id === M)), l.dependsOn.length || delete l.dependsOn, I(V(i, t, l.laneId, l.id), E(l.label) + " no longer depends on " + nn(v.map((M) => E(M.label))) + ".", S);
      }
      if (!A.length) {
        if (n.mode === "add") throw new z("Name the features " + E(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, I(V(i, t, l.laneId, l.id), E(l.label) + " no longer depends on anything.", S);
      }
      if (A.includes(l)) throw new z("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...A.map((v) => v.id)])], I(V(i, t, l.laneId, l.id), E(l.label) + " now depends on " + nn(A.map((v) => E(v.label))) + ".", S);
    }
    case "set_outcome": {
      const l = b(n.card), A = x(n.lane), S = i.signals ?? (i.signals = []), v = n.label, M = v === void 0 ? S.filter((N) => N.cardId === l.id && N.laneId === A.id) : S.filter((N) => N.cardId === l.id && N.label.toLowerCase() === v.toLowerCase());
      if (v !== void 0 && M.length > 1) throw new z("Two outcomes on this card have that name.", "refused", A.id, l.id);
      if (!M.length && S.length >= 24) throw new z("A workshop can have up to 24 outcomes. Remove one first.", "refused", A.id, l.id);
      let R = 1;
      for (; S.some((N) => N.id === "signal-" + R); ) R++;
      const D = { label: v ?? M[0]?.label ?? (l.label + " in " + A.label).slice(0, 80).trim(), cardId: l.id, laneId: A.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return M.length ? Object.assign(M[0], D) : S.push({ id: "signal-" + R, ...D }), I(V(i, t, A.id, l.id), "When " + E(l.label) + " is in " + E(A.label) + " the workshop says " + E(n.whenPresent) + ". Otherwise it says " + E(n.whenAbsent) + ".", { laneId: A.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = b(n.card), A = (i.signals ?? []).filter((S) => S.cardId === l.id);
      if (n.outcome === void 0) {
        if (!A.length) throw new z(E(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        st(i, (S) => S.cardId === l.id);
      } else {
        const S = k(A, Xt(A, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        st(i, (v) => v.id === S.id);
      }
      return I(V(i, t, l.laneId, l.id), "Removed the outcome from " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((A) => x(A));
      if (l.length !== i.lanes.length || new Set(l).size !== i.lanes.length) throw new z("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = l.map((A) => A.id), I(V(i, t), W(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new z("Say before or after, not both.", "invalid_edit");
      const l = x(n.lane), A = n.before ?? n.after, S = A === void 0 ? void 0 : x(A);
      if (S && S.id === l.id) throw new z("Choose two different scenes.", "refused", l.id);
      const v = vo(i).filter((M) => M.id !== l.id);
      return v.splice(S ? v.findIndex((M) => M.id === S.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), i.presentationOrder = v.map((M) => M.id), I(V(i, t, l.id), W(v), { laneId: l.id });
    }
    case "add_station": {
      const l = x(n.from);
      let A;
      try {
        A = vr(i, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (v) {
        throw new z(v.message, "refused", l.id);
      }
      const S = A.lanes[A.lanes.length - 1];
      return I(A, "Added a path from " + E(l.label) + " to " + E(S.label) + ".", { laneId: S.id });
    }
    case "insert_station": {
      const l = x(n.before), A = n.from === void 0 ? void 0 : x(n.from), S = A ? [A] : i.lanes.filter((R) => R.station.next.includes(l.id));
      if (A && !A.station.next.includes(l.id))
        throw new z("There is no path from " + E(A.label) + " to " + E(l.label) + ". Try “Add " + n.label + " after " + A.label + "”.", "refused", A.id);
      if (!S.length) throw new z("Nothing leads to " + E(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let v;
      try {
        v = vr(i, S[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (R) {
        throw new z(R.message, "refused", l.id);
      }
      const M = v.lanes[v.lanes.length - 1];
      for (const R of v.lanes)
        S.some((F) => F.id === R.id) && (R.station.next = [...new Set(R.station.next.map((F) => F === l.id ? M.id : F))]);
      return M.station.next = [l.id], I(V(v, t, M.id), "Added " + E(M.label) + " before " + E(l.label) + ".", { laneId: M.id });
    }
    case "connect_stations": {
      const l = x(n.from), A = x(n.to);
      if (l.id === A.id) throw new z("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(A.id) ? I(i, E(l.label) + " already leads to " + E(A.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(A.id), I(V(i, t, l.id), "Connected " + E(l.label) + " to " + E(A.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = x(n.from), A = x(n.to);
      if (!l.station.next.includes(A.id)) throw new z("There is no path between " + E(l.label) + " and " + E(A.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((S) => S !== A.id), I(V(i, t, l.id), "Removed the path from " + E(l.label) + " to " + E(A.label) + ".", { laneId: l.id });
    }
    case "set_station_outcome": {
      const l = x(n.station);
      return l.station.outcome = n.outcome, I(V(i, t, l.id), "Changed what happens at " + E(l.label) + ".", { laneId: l.id });
    }
    case "set_station_position": {
      const l = x(n.station);
      return Object.assign(l.station, { column: n.column, row: n.row }), I(V(i, t, l.id), "Moved " + E(l.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: l.id });
    }
    case "set_station_image": {
      const l = x(n.station);
      return n.image === null ? (delete l.station.image, I(V(i, t, l.id), "Removed the image at " + E(l.label) + ".", { laneId: l.id })) : (l.station.image = { src: n.image.src, alt: n.image.alt }, I(V(i, t, l.id), "Updated the image at " + E(l.label) + ".", { laneId: l.id }));
    }
    case "set_station_image_alt": {
      const l = x(n.station);
      if (!l.station.image) throw new z("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, I(V(i, t, l.id), "Updated the image description at " + E(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = b(n.card);
      let A = l.id, S, v;
      if (n.kind === "connect_cards") {
        const N = b(n.to, l.laneId);
        if (N.id === l.id) throw new z("A line joins two different cards.", "refused", l.laneId, l.id);
        S = N.id, v = E(N.label);
      } else {
        const N = n.note.trim();
        if (i.cards.some((U) => U.id === N) || i.lanes.some((U) => U.id === N))
          throw new z("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        S = N, v = "the note " + N, n.direction === "from_note" && ([A, S] = [S, A]);
      }
      const M = oi(i, A, S, n.label ? { label: n.label } : {}), R = Hn(i, M);
      if (R) throw new z(R, "refused", l.laneId, l.id);
      const F = ht(i, M), D = A === l.id;
      return I(
        F,
        D ? "Drew a line from " + E(l.label) + " to " + v + "." : "Drew a line from " + v + " to " + E(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = b(n.card), A = n.kind === "disconnect_cards" ? b(n.to, l.laneId).id : n.note.trim(), S = n.kind === "disconnect_cards" ? E(i.cards.find((R) => R.id === A).label) : "the note " + A, v = (R) => R.parentId === l.id && R.childId === A || R.parentId === A && R.childId === l.id, M = i.lines ?? [];
      return M.some(v) ? (i.lines = M.filter((R) => !v(R)), I(V(i, t, l.laneId, l.id), "Took away the line between " + E(l.label) + " and " + S + ".", { laneId: l.laneId, cardId: l.id })) : I(e, E(l.label) + " and " + S + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new z("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function J(l, A, S = !1) {
    const v = { laneId: A.id, cardId: l.id };
    if (l.laneId === A.id)
      return I(e, E(l.label) + " is already " + (c ? "at " : "in ") + E(A.label) + ".", v, !1);
    const M = tn(e, l.id, A.id);
    if (!M) {
      const R = Fe(e, l.id, A.id) ?? "That move is not available.", F = Gn(e, l.id, A.id, { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() });
      if (S && F) return I(V(F, t, A.id, l.id), "Moved " + E(l.label) + " to " + E(A.label) + " anyway. " + R, v);
      const D = new z(R, "refused", A.id, l.id);
      throw F && (D.overridable = !0), D;
    }
    return I(V(M, t, A.id, l.id), "Moved " + E(l.label) + " to " + E(A.label) + ".", v);
  }
}
function or(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new z(r === "amount" ? H.notAmounts : H.notTasks, "not_on_this_board", t);
}
function st(e, n) {
  e.signals && (e.signals = e.signals.filter((t) => !n(t)), e.signals.length || delete e.signals);
}
function Ae(e, n, t = {}) {
  const r = (k) => ({ refused: { index: 0, kind: null, laneId: null, ...k } });
  let o;
  try {
    o = X(e);
  } catch (k) {
    return r({ reason: "The workshop cannot be read: " + (k instanceof Error ? k.message : String(k)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return r({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = o, c = [], p = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [k, x] of n.entries()) {
    const b = x?.kind, $ = eo.find((v) => v.kind === b);
    if (!x || typeof x != "object" || !$)
      return r({
        index: k,
        kind: typeof b == "string" ? b : null,
        code: "invalid_edit",
        reason: "There is no edit called " + E(String(b)) + ". The edits are " + nn(eo.map((v) => v.kind)) + "."
      });
    const I = qi(x, $);
    if (I) return r({ index: k, kind: $.kind, code: "invalid_edit", reason: I });
    const L = mt(o);
    if (!$.boards.includes(L))
      return r({ index: k, kind: $.kind, code: "not_on_this_board", reason: $.refusals[L] ?? "This workshop does not take " + $.kind + "." });
    const W = (x.kind === "move_card" || x.kind === "set_task" || x.kind === "nest_card") && x.override !== !0, J = (v) => W && v === "refused" && !("refused" in Ae(o, [{ ...x, override: !0 }], t));
    let l;
    try {
      l = Ji(o, x, L, t.selection, p);
    } catch (v) {
      if (!(v instanceof z)) throw v;
      return r({
        index: k,
        kind: $.kind,
        reason: v.reason,
        code: v.code,
        laneId: v.laneId,
        ...(v.overridable || J(v.code)) && { overridable: !0 },
        ...v.cardId && { cardId: v.cardId },
        ...v.candidates && { candidates: v.candidates },
        ...v.limits && { limits: v.limits }
      });
    }
    const A = o.behaviour && !zi($.kind) ? ke().check(o, l.board) : null;
    if (A && "refused" in A)
      return r({
        index: k,
        kind: $.kind,
        reason: A.refused.sentence,
        code: "refused",
        laneId: A.refused.laneId,
        cardId: A.refused.cardId,
        ...J("refused") && { overridable: !0 }
      });
    const S = Vi(o, l.board);
    if (S) return r({ index: k, kind: $.kind, reason: S, code: "not_on_this_board", laneId: l.laneId ?? null });
    o = l.board, c.push({
      index: k,
      kind: $.kind,
      said: l.said,
      changed: l.changed ?? !0,
      ...l.laneId && { laneId: l.laneId },
      ...l.cardId && { cardId: l.cardId }
    });
  }
  const h = new Map(i.cards.map((k) => [k.id, k.laneId])), C = o.cards.flatMap((k) => {
    const x = h.get(k.id);
    return x === void 0 || x === k.laneId ? [] : [{ cardId: k.id, fromLaneId: x, toLaneId: k.laneId }];
  });
  return { workshop: o, report: { edits: c, movedCards: C } };
}
function Yi(e, n) {
  const t = oe(e);
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
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? H.launchLanes : t && ve(t).fixed?.(e, n) || null;
}
const Zi = {
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
function Vi(e, n) {
  const t = X(e), r = mt(t);
  let o;
  try {
    o = X(n);
  } catch (h) {
    return wt(h instanceof Error ? h.message : String(h), r);
  }
  const i = mt(o), c = (h, C) => h.lanes.length === C.lanes.length && h.lanes.every((k) => C.lanes.some((x) => x.id === k.id)), p = (h, C) => h.lanes.every((k, x) => C.lanes[x]?.id === k.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return c(t, o) ? H.keepsCards : H.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !p(t, o)) return H.keepsOrder;
  if (oe(t) && i === r && !(c(t, o) && p(t, o))) return Qt[r];
  if (oe(t) && i === r) {
    const h = Yi(t, o);
    if (h) return h;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!c(t, o)) return H.releaseLanes;
    if (!p(t, o)) return H.releaseOrder;
    if (o.cards.some((h) => !t.cards.some((C) => C.id === h.id))) return H.releaseCards;
  }
  return r !== i ? "This board is a " + Zi[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? ke().replacement(t, o) : null;
}
const wa = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ga(e) {
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
function Xi(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function ya(e, n) {
  return Xi(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Tr = ["firstPrint", "secondPrint", "thirdPrint"], Or = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function ka(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Or, route: n.route };
  for (const r of Tr) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function ba(e = new URLSearchParams()) {
  const n = { ...Or };
  for (const r of Tr) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function va(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Qi(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = ts(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), ns(n), n;
}
function es(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function ns(e) {
  return e && es(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Ut(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Fn(e) {
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
function ts(e) {
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
function at() {
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
}, os = "var(--slatebox-board-font, system-ui, sans-serif)", no = "http://www.w3.org/2000/svg", rr = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function _e(e, n, t) {
  const r = document.createElementNS(no, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", rr(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", rr(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function wn(e, n, t, r, o) {
  const i = typeof document < "u" ? document.activeElement : null, c = i && e.contains(i) ? i.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const p = [];
  for (const h of n)
    if (h.t === "line")
      e.appendChild(_e("line", {
        x1: h.x1,
        y1: h.y1,
        x2: h.x2,
        y2: h.y2,
        "stroke-width": h.width ?? 1,
        ...h.dash ? { "stroke-dasharray": h.dash } : {}
      }, { stroke: h.color }));
    else if (h.t === "rect")
      e.appendChild(_e("rect", {
        x: h.x,
        y: h.y,
        width: Math.max(0, h.w),
        height: Math.max(0, h.h),
        rx: h.rx ?? 0,
        ...h.opacity !== void 0 ? { opacity: h.opacity } : {},
        ...h.role ? { "data-board-layer": h.role } : {}
      }, { fill: h.color }));
    else if (h.t === "text") {
      const C = _e("text", {
        x: h.x,
        y: h.y,
        "font-size": h.size ?? 13,
        "text-anchor": h.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...h.bold ? { "font-weight": 600 } : {},
        ...h.role ? { "data-board-layer": h.role } : {},
        ...h.halo ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
      }, { fill: h.color, ...h.halo ? { stroke: h.halo } : {} });
      C.style.setProperty("font-family", os), h.lines && h.lines.length > 1 ? h.lines.forEach((k, x) => {
        const b = _e("tspan", { x: h.x, dy: x ? h.lineHeight ?? Math.round((h.size ?? 13) * 1.25) : 0 });
        b.textContent = x < h.lines.length - 1 ? k + " " : k, C.appendChild(b);
      }) : C.textContent = h.text, e.appendChild(C);
    } else {
      if (h.unlink && t) {
        const { cardId: C, waitsOn: k, label: x } = h.unlink, b = k + ">" + C, $ = r?.armed === b, I = _e("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": b,
          "aria-label": $ ? x + ". " + (h.unlink.armed ?? "Tap again to remove it") + "." : x,
          role: "button",
          tabindex: 0,
          ...$ ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: $ ? mn.refuse : "transparent" });
        let L = !1;
        I.addEventListener("pointerdown", (W) => {
          W.stopPropagation(), L = W.pointerType === "touch" || W.pointerType === "pen";
        }), I.addEventListener("click", (W) => {
          if (W.stopPropagation(), L && r && r.armed !== b) {
            r.arm(b);
            return;
          }
          r?.arm(null), t(C, k);
        }), I.addEventListener("keydown", (W) => {
          W.key !== "Enter" && W.key !== " " || (W.preventDefault(), W.stopPropagation(), t(C, k));
        }), I.addEventListener("focus", () => {
          I.style.setProperty("stroke", mn.accept), I.setAttribute("opacity", "0.35");
        }), I.addEventListener("blur", () => {
          $ || (I.style.setProperty("stroke", "transparent"), I.removeAttribute("opacity"));
        }), e.appendChild(I), p.push(I);
      } else if (h.pick && o) {
        const { key: C, label: k } = h.pick, x = _e("path", {
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
        x.addEventListener("pointerdown", (b) => b.stopPropagation()), x.addEventListener("click", (b) => {
          b.stopPropagation(), o(C);
        }), x.addEventListener("keydown", (b) => {
          b.key !== "Enter" && b.key !== " " || (b.preventDefault(), b.stopPropagation(), o(C));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", mn.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity");
        }), e.appendChild(x), p.push(x);
      }
      if (e.appendChild(_e(
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
        const { x: C, y: k, angle: x } = h.arrow;
        e.appendChild(_e("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${k}) rotate(${x})`, "pointer-events": "none" }, { fill: h.color }));
      }
      if (h.unlink && r?.armed === h.unlink.waitsOn + ">" + h.unlink.cardId && h.arrow) {
        const C = _e("text", {
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
function rs(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(no, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(no, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let i = !1, c = null, p;
  const h = {
    armed: null,
    arm(k) {
      clearTimeout(p), h.armed = k, k && (p = setTimeout(() => h.arm(null), 5e3), c?.[2].announce?.(c[2].boardFocused && c[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), c && C.draw(...c);
    }
  }, C = {
    draw(k, x, b) {
      if (i || !t) return;
      c = [k, x, b];
      const { origin: $ } = b, I = n(x ?? k, b, k), L = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o])
        l.setAttribute("transform", `translate(${$.x} ${$.y})`), l.toggleAttribute("data-workshop-focused", !!b.boardFocused);
      wn(r, I.filter((l) => !L(l)), b.onUnlink, h, b.onPick), wn(o, I.filter(L));
      const W = b.above && b.above.parentNode === t ? b.above : null, J = W ? W.nextSibling : t.firstChild;
      (r.parentNode !== t || r.previousSibling !== W) && t.insertBefore(r, J === r ? r.nextSibling : J), o.firstChild && t.lastChild !== o ? t.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
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
}, lt = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, is = (e) => e.replace(/\.$/, ""), ss = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function yo(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return as(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, c = (p) => n.push(i ? { ...p, warn: i } : p);
    if (o.kind === "bin" && o.lane) c({ icon: "bin", text: lt(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) c({ icon: "gate", text: lt(e, o.into) + " needs " + (o.needs ?? []).map((p) => ss[p] ?? p).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) c({ icon: "step", text: "One column at a time", seams: t.slice(1).map((p, h) => [t[h], p]) });
      else {
        const p = o.from, h = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(p)) === 1).map((C) => [p, C]);
        c({ icon: "oneway", text: lt(e, p) + " → " + o.to.map((C) => lt(e, C)).join(" or ") + " only", seams: h });
      }
  }
  return n;
}
function as(e) {
  if (!Fi()) return [];
  let n;
  try {
    n = ke().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = is(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, c = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: c, text: ls(o), ...i && { warn: i } });
  }
  return t;
}
function ls(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const ut = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Pr(e, n, t, r, o = 12) {
  const i = o / 12, c = (h) => h.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, k, x) => `A${+k * i} ${+x * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, k, x) => `${+(n + +k * i).toFixed(1)},${+(t + +x * i).toFixed(1)}`), p = (h, C = 1.6) => ({ t: "path", d: c(h), color: r, width: C * i });
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
const ko = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function gt(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + ut(e.text, 13 * n, t) + 10 * n);
}
function dt(e, n, t, r, o = {}) {
  const i = 24 * r, c = 10 * r, p = t.icon ? 17 * r : 0, h = gt(t, r, o.bold), C = o.ink ?? he.chipInk, k = [{
    t: "path",
    d: ko(e, n, h, i, i / 2),
    color: t.warn ? he.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? he.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && k.push(...Pr(t.icon, e + c, n + 6 * r, C, 12 * r)), k.push({ t: "text", x: e + c + p, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), k;
}
function ir(e, n, t, r) {
  return [
    { t: "path", d: ko(n - 11, t - 11, 22, 22, 11), color: he.badgeLine, width: 1, fill: he.badge, role: r },
    ...Pr(e, n - 6, t - 6, he.badgeInk)
  ];
}
const ds = "Preview · not added yet", Er = 6, cs = 2.5, Mr = (e) => Math.round(Math.min(Er, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, to = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function Nr(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(Er, Math.max(1, t.scale ?? 1)), c = i > cs ? [] : yo(e), p = 18 * i, h = 30 * i, C = (R, F) => {
    const D = (t.narrow && F <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (ut(R, 18 * F, !0) <= D) return R;
    const N = Math.max(3, Math.floor(D / (18 * F * 0.58)) - 1);
    return R.slice(0, N).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, k = C(e.title, i), x = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), b = [], $ = [2 + ut(C(e.title, 1), 18, !0) + 14];
  t.narrow && c.length && ($[0] = 1 / 0, $.push(2));
  for (const R of c) {
    const F = gt(R, 1);
    let D = $.findIndex((N) => N + F <= x);
    D < 0 && ($.push(2), D = $.length - 1), b.push({ x: $[D], row: D, item: R, width: F }), $[D] += F + 6;
  }
  const I = b.map((R) => ({ x: r + Math.round(R.x * i), row: R.row, item: R.item, width: gt(R.item, i) })), L = Math.max(1, ...I.map((R) => R.row + 1)), W = o - 14 * i - L * h, J = !!(t.focused || t.draft), l = t.narrow ? 8 : 16, A = J ? { x: r - l, y: W - 18 * i, width: n.width + 2 * l, height: o + n.height + l - (W - 18 * i) } : null, S = Math.max(i, t.tagScale ?? i), v = A ? A.y - 12 * S : W, M = r + 2 + ut(k, p, !0);
  return { k: i, tagK: S, legend: c, placed: I, rows: L, title: k, titleY: W, titleSize: p, titleRight: M, rowH: h, frame: A, top: v };
}
function _r(e, n, t = {}) {
  const r = Nr(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((k) => k.x + k.width)), c = o ? o.x : 0, p = r.top, h = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: c, y: p, width: h - c, height: C - p };
}
function sr(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: c, titleY: p, titleSize: h, rowH: C, frame: k } = Nr(e, n, t), x = n.x ?? 0, b = [];
  if (k) {
    const $ = ko(k.x, k.y, k.width, k.height, 18);
    t.focused && b.push({ t: "path", d: $, color: he.focus, width: 12, strokeOpacity: 0.1, fill: he.focusTint, role: "focus-glow" }), b.push({
      t: "path",
      d: $,
      color: t.focused ? he.focus : he.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  b.push({ t: "text", x: x + 2, y: p + 19 * r, text: c, color: he.title, size: h, bold: !0, role: "board-title" });
  for (const $ of i) b.push(...dt($.x, p + $.row * C + 2 * r, $.item, r));
  if (k) {
    const $ = k.y - 12 * o;
    if (t.focused) {
      const I = { text: "Editing" };
      b.push(...dt(k.x + 18, $, I, o, { fill: he.focus, ink: he.focusInk, bold: !0, role: "focus-tag" })), b.push(...dt(
        k.x + 18 + gt(I, o, !0) + 6 * o,
        $,
        { text: "Done" },
        o,
        { fill: he.halo, ink: he.focus, line: he.focus, bold: !0, role: "focus-done" }
      ));
    } else
      b.push(...dt(k.x + 18, $, { text: ds }, o, { fill: he.previewFill, ink: he.previewInk, bold: !0, role: "draft-tag" }));
  }
  return b;
}
function ar(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((c) => c.laneId === i);
  for (const i of yo(e)) {
    const c = i.lane ? o(i.lane) : void 0;
    c && r.push(...ir(i.icon, c.x + c.width - 22, c.y + 18, "badge-" + i.lane));
    for (const [p, h] of i.seams ?? []) {
      const C = o(p), k = o(h);
      !C || !k || C.row !== k.row || r.push(...ir(i.icon, (C.x + C.width + k.x) / 2, C.y + 35, "seam-" + p + ">" + h));
    }
  }
  return r;
}
function us(e) {
  const n = yo(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const xa = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, lr = "http://www.w3.org/2000/svg";
function dr(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function fs(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(lr, "g") : null, r = typeof document < "u" ? document.createElementNS(lr, "g") : null;
  for (const k of [t, r])
    k?.setAttribute("data-board-chrome", ""), k?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const c = (k) => ({ layout: k.layout, focused: k.focused, draft: k.draft, scale: k.scale, tagScale: k.tagScale, narrow: k.narrow, places: k.places, room: k.room }), p = (k, x) => {
    const b = _r(k.board, k.size, x);
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
      const x = Mr(k);
      return p(i, { ...c(i), scale: x, tagScale: to(k, !!(i.narrow && !i.draft), x) });
    },
    plainBox() {
      return i ? p(i, h(i)) : null;
    },
    paintPlain(k, x) {
      if (!i) return;
      const b = h(i);
      k.removeAttribute("data-workshop-focused"), wn(k, sr(i.board, { width: i.size.width, height: i.size.height }, b)), x && (x.removeAttribute("data-workshop-focused"), wn(x, ar(i.board, b)));
    }
  };
  return dr(e).add(C), {
    draw(k) {
      if (o || !n || !t || !r) return;
      i = k;
      const x = c(k);
      for (const I of [t, r])
        I.setAttribute("transform", `translate(${k.origin.x} ${k.origin.y})`), I.toggleAttribute("data-workshop-focused", !!k.focused), I.toggleAttribute("data-workshop-draft", !!k.draft), I.setAttribute("data-board-scope", k.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", us(k.board)), wn(t, sr(k.board, { width: k.size.width, height: k.size.height }, x)), wn(r, ar(k.board, x));
      const b = t.querySelector('[data-board-layer="focus-done-box"]');
      if (b && k.onDone) {
        const I = k.onDone;
        b.setAttribute("role", "button"), b.setAttribute("tabindex", "0"), b.setAttribute("aria-label", "Done changing " + k.board.title), b.setAttribute("pointer-events", "all"), b.setAttribute("cursor", "pointer"), b.addEventListener("pointerdown", (L) => L.stopPropagation()), b.addEventListener("click", (L) => {
          L.stopPropagation(), I();
        }), b.addEventListener("keydown", (L) => {
          const W = L.key;
          W !== "Enter" && W !== " " || (L.preventDefault(), L.stopPropagation(), I());
        });
      }
      const $ = k.under && k.under.parentNode === n ? k.under : null;
      $ ? t.nextSibling !== $ && n.insertBefore(t, $) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, dr(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const oo = "handle-_link-", ro = "handle-_route-", zn = 40, Rr = 44;
function Kt(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(zn, Math.ceil(Rr / n)));
}
function Wr(e) {
  if (e.startsWith(oo)) return { kind: "link", from: e.slice(oo.length) };
  if (e.startsWith(ro)) {
    const [n, t] = e.slice(ro.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const Fr = (e) => !!e.lanes[0]?.station, Ue = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function bo(e) {
  const { places: n } = We(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function cr(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, c = n.y - o, p = i ? e.width / 2 / Math.abs(i) : 1 / 0, h = c ? e.height / 2 / Math.abs(c) : 1 / 0, C = Math.min(p, h), k = Math.hypot(i, c) || 1;
  return { x: r + i * C + i / k * t, y: o + c * C + c / k * t };
}
function Dr(e) {
  if (!Fr(e)) return [];
  const n = bo(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const c = n.get(i);
        if (!c) continue;
        const p = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, h = { x: c.x + c.width / 2, y: c.y + c.height / 2 }, C = cr(o, h, -8), k = cr(c, p, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: k.x, y2: k.y });
      }
  }
  return t;
}
function hs(e, n) {
  for (const [t, r] of bo(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function jr(e, n, t = zn) {
  if (!Fr(e)) return [];
  const r = bo(e), o = t / zn, i = (p, h, C, k, x) => ({ options: {
    id: p,
    name: k,
    text: x ? "+" : "",
    xPos: n.x + h - t / 2,
    yPos: n.y + C - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: yn(t, t, t / 2),
    backgroundColor: x ? "#2f5fd0" : "#fffef8",
    foregroundColor: x ? "#ffffff" : "#2f5fd0",
    borderColor: x ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), c = [];
  for (const p of e.lanes) {
    const h = r.get(p.id);
    h && c.push(i(oo + p.id, h.x + h.width, h.y + h.height, "Draw a path from " + p.label, !0));
  }
  for (const p of Dr(e))
    c.push(i(ro + p.from + "~" + p.to, p.x2, p.y2, "End of the path from " + Ue(e, p.from) + " to " + Ue(e, p.to), !1));
  return c;
}
function ps(e, n) {
  const t = Wr(n);
  return t ? t.kind === "link" ? `Draw a path from ${Ue(e, t.from)}: drag it onto another step.` : `End of the path from ${Ue(e, t.from)} to ${Ue(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function ms(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((c) => c.id === n.from);
  if (!r?.station || !e.lanes.some((c) => c.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${Ue(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((c) => c !== n.to) : r.station.next, i = e.lanes.map((c) => c.id === r.id ? { ...c, station: { ...c.station, next: [...o, t] } } : c);
  return { next: { ...e, lanes: i } };
}
function ws(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((p) => p.id === o.id)?.station?.next ?? [], c = o.station?.next ?? [];
    for (const p of i) c.includes(p) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: p } });
    for (const p of c) i.includes(p) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: p } });
  }
  return [...t, ...r];
}
function gs(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? zn, i = Math.max(24, o * Rr / zn);
  for (const c of Dr(e)) {
    const p = Ue(e, c.from) + " to " + Ue(e, c.to), h = `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`, C = !r && n.picked === c.key;
    t.push(r ? { t: "path", d: h, color: "transparent", width: 3, hit: i, unlink: { cardId: c.to, waitsOn: c.from, label: "Remove the path from " + p, armed: "Tap again to remove this path" } } : { t: "path", d: h, color: C ? mn.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: c.key, label: "Path from " + p + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const c = jr(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, p = c ? c.xPos + o + 6 : 0, h = c ? c.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: p, y: h, text: n.clamp.text, color: mn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
const ur = "#1f7a5c", fr = "#5b9a85", qt = "#c2410c", ys = "#a8761b", ks = {
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
}, bs = { canMove: !1, canSelect: !1 }, Jt = "A card's line joins notes and cards on its own board.", Dn = /* @__PURE__ */ new WeakMap();
function vs(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function Ia(e, n, t = {}) {
  const r = Jn(t.scope);
  let o = X(n);
  const i = t.kit, c = (s) => !!oe(s) && !i;
  if (c(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const p = i?.layer(e) ?? (o.lanes[0]?.station ? rs(e, gs) : void 0), h = t.chrome === !1 ? null : fs(e);
  let C = 1, k = 1, x = null, b = null, $ = /* @__PURE__ */ new Set(), I = null, L = null;
  const W = !!t.draft, J = !!t.still;
  let l = !!t.readOnly || W || J, A = l || c(o), S = !1;
  const v = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let N = null, U = null, ae = null, ee = null;
  const ye = /* @__PURE__ */ new Map(), In = /* @__PURE__ */ new Map(), an = /* @__PURE__ */ new Map();
  let ne = null, pe = null;
  function Je(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, S || j(L ?? o);
    }, 3e3) };
  }
  let se = Promise.resolve(), Ye = null, le = pr(t.layout), xe = le;
  const $t = { ...t.style };
  let Ce = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Set(), $o = null, $e = !1, An = Kt(1), Yn = null, Sn = null, Ze = null, Zn = !1;
  const we = /* @__PURE__ */ new Map();
  Be(o);
  const Y = t.origin ? { x: t.origin.x, y: t.origin.y } : Is(e), Vn = r ? r + ":" : "", be = (s) => D.get(s) ?? (Vn ? s.startsWith(Vn) ? s.slice(Vn.length) : null : s), me = (s) => {
    const a = be(s);
    return a === null ? null : vs(a);
  };
  function de(s) {
    const a = F.get(s);
    if (a) return a;
    const d = Vn + s;
    if (v.has(d) && !D.has(d) || !e.nodes.one?.(d)) return d;
    const f = li(d, (m) => !!e.nodes.one?.(m) || D.has(m));
    return F.set(s, f), D.set(f, s), console.warn(`WORKSHOP: the slate already has a note named "${d}". It stays the slate's own; the workshop draws its note as "${f}".`), f;
  }
  function Cn(s, a = 1) {
    let d = [];
    try {
      d = t.avoid?.() ?? [];
    } catch (f) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", f);
    }
    return d.length ? Qs(s, d, a) : { x: s.x, y: s.y };
  }
  function ci(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (u) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", u);
    }
    const { width: d, height: f } = i ? i.places(o, le) : Be(o);
    let m = 1 / 0;
    for (const u of a)
      [u.x, u.y, u.width, u.height].every(Number.isFinite) && u.x >= Y.x + d && u.y < Y.y + f && u.y + u.height > Y.y && (m = Math.min(m, u.x - 32 - Y.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function ui(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (d) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", d);
    }
    return a.some((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite) && s.x < d.x + d.width && s.x + s.width > d.x && s.y < d.y + d.height && s.y + s.height > d.y);
  }
  function fi(s, a) {
    const d = [...Dn.get(e) ?? []].filter((g) => g !== Ot);
    if (!d.length) return null;
    const { id: f, note: m } = Bo(s, a), u = { id: f, options: m }, w = Vt(o, s).some((g) => o.cards.some((y) => y.id !== s && (y.id === g.parentId || y.id === g.childId)));
    for (const g of d) {
      let y = null;
      try {
        y = g.verdict(u, a);
      } catch (T) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", T);
      }
      if (y) return { board: g, ...y, reason: w ? Jt : y.reason };
    }
    return null;
  }
  function hi(s, a, d, f) {
    const { added: m, answer: u } = et(a, d, "", !0), w = Cn(d), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let y;
      try {
        y = s.take(m, f, w);
      } catch (P) {
        console.warn("WORKSHOP: another board could not take the card", P);
      }
      if (y === "taken") return;
      const T = Math.round(w.x), O = Math.round(w.y);
      m.position?.(T, O, () => e.updateSelectionResizeRotate?.(), void 0, at() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Ut({ ...m.options, x: T, y: O })] });
    };
    !u || typeof u.then != "function" ? g() : u.then((y) => {
      y === !0 && !S && g();
    }, () => {
    });
  }
  const Le = {
    governs(s) {
      if (v.get(s.id) !== s) return null;
      const a = me(s.id)?.kind;
      return a === "card" ? { canMove: !A, canEditText: !A && !L && o.kind !== "release-plan", canConnect: Pn() } : a === "lane" ? { canMove: !1, canEditText: !A && !L } : a === "handle" ? { canMove: !A && !L, canEditText: !1, ...!le.narrow && { cursor: i ? "ew-resize" : "grab" }, ...le.narrow && { edgePan: !1 } } : bs;
    },
    onStart(s, a) {
      const d = me(s.id), f = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const w = A || L ? null : i ? i.handleDrag(o, be(s.id), f, le) : Ni(be(s.id));
        return w ? (re(), je(), pe && (clearTimeout(pe.timer), pe = null), I = { name: be(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = d.key;
      if (A || L || !o.cards.some((w) => w.id === m)) return !1;
      re(), je();
      let u = null;
      try {
        u = (i?.chooser ?? t.chooseCandidate)?.(o, m, f, le) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return N = { cardId: m, evaluate: u, grab: f, outcome: { kind: "home" } }, j(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (I) {
        I.last = I.follow(Xe(a)), j(I.last.next, { grip: I.name, layout: ci(I.last.layout) }), G(t.onPreview, I.last.next === o ? null : I.last.next);
        return;
      }
      if (!N) return;
      const d = Eo(N.cardId, a, N.evaluate);
      if (xs(d, N.outcome)) return;
      N.outcome = d;
      const f = d.kind === "candidate" ? d.next : null;
      j(f ?? o, { skip: N.cardId }), G(t.onPreview, f);
    },
    onEnd(s, a) {
      if (I) {
        const { follow: w, name: g } = I, y = w(Xe(a));
        if (I = null, G(t.onPreview, null), y.refusal) {
          Je(g, y.refusal), j(o), e.announce?.(y.refusal), G(t.onRefuse, { laneId: null, reason: y.refusal });
          const O = y.override && hr(y.override.edit);
          O && Nn(O, o.cards.find((P) => P.id === O)?.laneId ?? "", y.refusal, y.override);
        } else tt(y.next, {}) || j(o);
        const T = Bt(o, be(s.id));
        return T ? { accept: !0, settle: T } : { accept: !1 };
      }
      if (!N) return { accept: !1 };
      const { cardId: d, evaluate: f } = N, m = Eo(d, a, f), u = o.cards.find((w) => w.id === d);
      if (N = null, G(t.onPreview, null), m.kind === "candidate" && i) {
        if (!tt(m.next, { cardId: d, laneId: m.laneId }, d))
          return j(o, { skip: d }), { accept: !1 };
        m.said && (Je("card-" + d, m.said), e.announce?.(m.said));
        const w = Bt(o, be(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, j(o, { skip: d });
        const w = o.lanes.find((y) => y.id === m.laneId);
        e.announce?.(`${Z(u)} moved to ${w.label}. ${ze(o, w.id)}.`), G(t.onChange, o, { cardId: d, laneId: m.laneId });
        const g = Bt(o, be(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused")
        Ti(Z(u), { cardId: d, laneId: m.laneId, reason: m.reason }), m.near && Je("card-" + d, m.reason), i ? m.override && Nn(d, m.laneId, m.reason, m.override) : m.near || Nn(d, m.laneId, m.reason);
      else if (m.kind === "outside" && Zt() && !Ee()) {
        const w = ft(o, d);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, y = fi(d, a);
          if (y?.reason)
            return j(o, { skip: d }), y.board.flash(y.laneId, y.reason), e.announce?.(`${Z(u)} can't go in ${y.laneLabel}. ${y.reason} It stays where it was.`), G(t.onRefuse, { cardId: d, laneId: null, reason: y.reason }), { accept: !1 };
          if (y)
            return hi(y.board, d, g, a), { accept: !0 };
          const T = ui(g);
          return et(d, T ? Cn(g) : g, T ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        j(o, { skip: d }), e.announce?.(w), G(t.onRefuse, { cardId: d, laneId: null, reason: w });
      } else
        j(o, { skip: d }), m.kind === "outside" && (e.announce?.(`${Z(u)} was not dropped on a lane. It stays where it was.`), G(t.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (I) {
        I = null, G(t.onPreview, null), j(o);
        return;
      }
      const a = N && o.cards.find((d) => d.id === N.cardId);
      N = null, G(t.onPreview, null), j(o, { skip: me(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Z(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const f = me(s.id);
      if (!f || A || L) return !1;
      const m = f.kind === "card" ? Jr(o.cards.find((P) => P.id === f.key) ?? {}) : null;
      m && (a = a.split(`
`).filter((P) => P.trim() !== m).join(`
`));
      let u = a.replace(/\s+/g, " ").trim();
      const w = [], g = oe(o), y = g && f.kind === "card" ? ve(g).renamed(o, f.key, u) : null;
      y && (u = y.label, w.push(...y.edits));
      const T = f.kind === "lane" ? { laneId: f.key, label: u } : { cardId: f.key, label: u };
      w.unshift(f.kind === "lane" ? { kind: "rename_lane", lane: { id: f.key }, label: u } : { kind: "rename_card", card: { id: f.key }, label: u });
      const O = Ae(o, w);
      if ("refused" in O) {
        const { reason: P } = O.refused;
        return e.announce?.(`${d} keeps its name. ${P}`), G(t.onRefuse, { ...f.kind === "lane" ? { laneId: f.key } : { cardId: f.key }, rename: T, reason: P }), !1;
      }
      return JSON.stringify(O.workshop) === JSON.stringify(o) ? (j(o), !1) : (e.beginHostStep?.(), o = O.workshop, f.kind === "card" && In.set(f.key, u), e.endHostStep?.(), j(o), e.announce?.(y ? O.report.edits.map((P) => P.said).join(" ") : `${d} renamed to ${u}.`), G(t.onChange, o, { rename: T, ...i ? { edits: w } : {} }), y ? !1 : u);
    },
    onKeyDown(s, a) {
      const d = me(s.id);
      if (A || L || N || I || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (ae && (ae.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== ae.key) && No(), ae && a.key === "Escape")
        return a.preventDefault(), No(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (ae && a.key === "Enter") {
        a.preventDefault();
        const w = ae.choices[ae.at];
        return ae = null, G(t.onPreview, null), o = w.next, j(o), e.announce?.(w.done), G(t.onChange, o, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: w.edits }), !0;
      }
      const f = i?.keyChoices?.(o, be(s.id), a.key);
      if (f) {
        a.preventDefault();
        const w = [], g = [];
        for (const O of typeof f == "string" ? [] : f) {
          const P = Ae(o, O.edits);
          "refused" in P ? g.push(`${O.said}: ${P.refused.reason}`) : w.push({ ...O, next: P.workshop, done: P.report.edits.map((_) => _.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof f == "string" ? f : g.join(" ")), !0;
        const y = ae && ae.node === s.id ? (ae.at + 1) % w.length : 0;
        ae = { node: s.id, key: a.key.toLowerCase(), choices: w, at: y }, j(w[y].next), G(t.onPreview, w[y].next);
        const T = w.length > 1 ? ` (${y + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[y].said}${T} Enter to make it, Escape to cancel.`), !0;
      }
      const m = i?.keyEdit?.(o, be(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = Ae(o, m);
        if ("refused" in w) {
          e.announce?.(w.refused.reason), G(t.onRefuse, { laneId: w.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: w.refused.reason });
          const g = m.length === 1 && w.refused.overridable ? hr(m[0]) : null;
          g && Nn(g, o.cards.find((y) => y.id === g)?.laneId ?? "", w.refused.reason, { edit: m[0] });
        } else tt(w.workshop, d?.kind === "card" ? { cardId: d.key } : {});
        return !0;
      }
      if (d?.kind !== "card") return !1;
      const u = o.cards.find((w) => w.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Mo(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && wi())
        return a.preventDefault(), Mo(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (U?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: y } = U;
        if (U = null, w === null)
          return G(t.onPreview, null), et(u.id, y), !0;
        const T = o;
        o = g, j(o), De(w), G(t.onPreview, null);
        const O = o.lanes.find((P) => P.id === w);
        return e.announce?.(`${Z(u)} moved to ${O.label}. ${ze(o, w)}.`), G(t.onChange, o, { cardId: u.id, laneId: w, ...i ? { edits: i.editsBetween(T, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), je(), e.announce?.(`Move cancelled. ${Z(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => v.get(a.id) === a).map((a) => a.id);
      Zn = s.length === 1, v.clear(), M.clear(), R.clear(), we.clear(), F.clear(), D.clear(), N = null, U = null, j(L ?? o, { animate: !1 }), s.length === 1 && (se = se.then(() => {
        Zn = !1;
        const a = v.get(s[0]);
        if (!S && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        ln();
      }));
    }
  };
  Le.onFreeMove = (s, a) => {
    if (!$n() || s.options?.isComment) return Pt();
    const d = Ln(a), f = Tn(s), m = On(s), u = o.lanes.filter((y) => !m && en(o, y.id, f) === null).map((y) => y.id), w = d && i?.noteUnder?.(o, Xe(a), le);
    w && (f.under = w);
    const g = d ? m ?? en(o, d, f) : null;
    ee && ee.noteId === s.id && ee.laneId === d && ee.refusal === g || (ee = { noteId: s.id, laneId: d, refusal: g, open: u }, Me());
  }, Le.onFreeDrop = (s, a, d) => {
    if (Pt(), !$n() || s.options?.isComment) return;
    const f = Ln(a);
    if (!f) return;
    const m = Tn(s), u = i?.noteUnder?.(o, Xe(a), le);
    u && (m.under = u), Dt(m, a);
    const w = o.lanes.find((y) => y.id === f), g = On(s) ?? en(o, f, m);
    return g ? (re(!1), ne = { laneId: f, reason: g, timer: setTimeout(() => re(), 1500) }, Me(), e.announce?.(`${Et(m.label)} can't go in ${w.label}. ${g}`), G(t.onRefuse, { noteId: s.id, laneId: f, reason: g }), "refused") : (_t([{ node: s, offer: m, from: d }], f), "taken");
  }, Le.onFreeGroupDrop = (s, a, d) => {
    if (Pt(), !$n() || s.some((g) => g.options?.isComment)) return;
    const f = Ln(a);
    if (!f) return;
    const m = o.lanes.find((g) => g.id === f), u = s.map((g) => ({ node: g, offer: Dt(Tn(g), a) })), w = ki(u, f);
    if (w) {
      re(!1), ne = { laneId: f, reason: w, timer: setTimeout(() => re(), 1500) }, Me(), e.announce?.(`${_o(u.map((g) => Et(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of u) G(t.onRefuse, { noteId: g.id, laneId: f, reason: w });
      return "refused";
    }
    return _t(u.map((g, y) => ({ ...g, from: d?.[y] })), f), "taken";
  }, Le.onFreeTextCommit = (s) => {
    if (!$n() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = { x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 }, f = Ln(d);
    if (!f) return;
    const m = Dt(Tn(s), d), u = o.lanes.find((P) => P.id === f), w = On(s) ?? en(o, f, m);
    if (!w) {
      _t([{ node: s, offer: m }], f);
      return;
    }
    re(!1), ne = { laneId: f, reason: w, timer: setTimeout(() => re(), 1500) }, Me(), e.announce?.(`${Et(m.label)} can't go in ${u.label}. ${w} It is beside the board.`), G(t.onRefuse, { noteId: s.id, laneId: f, reason: w });
    const { width: g } = Be(o), y = Cn({ x: Y.x + g + 32, y: a.y ?? Y.y, width: a.width ?? 0, height: a.height ?? 0 }), T = Math.round(y.x), O = Math.round(y.y);
    s.position(T, O, () => e.updateSelectionResizeRotate?.(), void 0, at() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Ut({ ...s.options, x: T, y: O })] });
  }, Le.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...ye], lines: (o.lines ?? []).map((s) => ({ ...s })) }), Le.onUndoRestore = (s, a) => {
    if (S) return;
    const d = new Map((s?.cards ?? []).map((u) => [u.id, u])), f = new Map(s?.pairs ?? []), m = (u) => ye.get(u) ?? f.get(u) ?? u;
    for (const u of a.added) {
      const w = m(u), g = o.cards.find((T) => T.id === w);
      if (!g || d.has(w)) continue;
      o = X({ ...o, cards: o.cards.filter((T) => T !== g), lines: hn(o.lines, w, u) }), j(o);
      const y = G(t.onChange, o, { cardId: w, cardToNote: { noteId: u }, via: "undo" });
      e.holdTrade?.(u, y), Yt(y);
    }
    for (const u of a.removed) {
      const w = m(u), g = d.get(w);
      if (!g || o.cards.some((q) => q.id === w)) continue;
      const y = (s?.lines ?? []).filter((q) => q.parentId === w || q.childId === w), T = fo(o, g), O = {
        id: w,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...y.length ? { lines: y } : {}
      }, P = [g.laneId, ...o.lanes.map((q) => q.id)].find((q) => jn(o, q, O));
      if (!P) {
        e.announce?.(`${Z(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = Ci(jn(o, P, O), w, s?.cards ?? []), w !== u && ye.set(u, w), j(o);
      const _ = o.cards.findIndex((q) => q.id === w), K = o.cards.slice(_ + 1).find((q) => q.laneId === P)?.id, B = G(t.onChange, o, { cardId: w, laneId: P, noteToCard: {
        noteId: u,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...K ? { before: K } : {},
        ...y.length ? { lines: hn(y, w, u) } : {}
      }, via: "undo" });
      e.holdTrade?.(u, B), Yt(B);
    }
    for (const u of d.values()) {
      const w = o.cards.find((T) => T.id === u.id);
      if (!w || w.label === u.label || In.get(u.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: u.id }, label: u.label }], y = Ae(o, g);
      "refused" in y || (o = y.workshop, In.set(u.id, u.label), j(o), e.announce?.(`${Z(w)} is called ${Z(u)} again.`), G(t.onChange, o, { rename: { cardId: u.id, label: u.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && Si(s.lines);
  };
  let Tt = !1;
  Le.onNodeAdded = (s) => {
    S || Tt || v.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (Tt = !0, queueMicrotask(() => {
      Tt = !1, S || Me();
    }));
  }, Le.onLine = (s, a) => {
    S || queueMicrotask(() => {
      S || Ii(s, a);
    });
  };
  const pi = e.setDragPolicy(Le), Ot = {
    verdict(s, a) {
      if (!$n()) return null;
      const d = Ln(a);
      if (!d) return null;
      const f = Tn(s), m = i?.noteUnder?.(o, Xe(a), le);
      return m && (f.under = m), { laneId: d, laneLabel: o.lanes.find((u) => u.id === d).label, reason: On(s) ?? en(o, d, f) };
    },
    take: (s, a, d) => Le.onFreeDrop?.(s, a, d),
    flash(s, a) {
      S || !o.lanes.some((d) => d.id === s) || (re(!1), ne = { laneId: s, reason: a, timer: setTimeout(() => re(), 1500) }, Me());
    }
  };
  Dn.has(e) || Dn.set(e, /* @__PURE__ */ new Set()), Dn.get(e).add(Ot);
  const mi = t.onSelect || p ? e.onSelectionChange?.(() => {
    ln(), Zo();
  }) : void 0;
  let Xn = null;
  const Lo = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, f = d && v.has(d) ? Jo(d) : null;
    f !== Xn && (Xn = f, Zo());
  };
  p && e.element?.addEventListener?.("pointerover", Lo);
  const To = (s) => {
    if (U && je(), b && !s?.target?.closest?.("[data-board-pick]") && (b = null, Ie && un(Ie), queueMicrotask(ln)), Sn = null, Ze && (clearTimeout(Ze), Ze = null), !s || S || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((u) => de(Q.lane(u.id))));
    if ((e.getSelectedNodes?.() ?? []).some((u) => !a.has(u?.id))) return;
    const d = o.lanes.flatMap((u) => [Q.caption(u.id), Q.column(u.id)]).map((u) => v.get(de(u))).filter(Boolean), f = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), d, { padding: 0 }) : null, m = f ? me(f.id) : null;
    m && (Sn = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, Oo = (s) => {
    const a = Sn;
    Sn = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (Ze = setTimeout(() => {
      if (Ze = null, S || N || I || !o.lanes.some((f) => f.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = v.get(de(Q.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, Po = () => {
    Sn = null;
  };
  e.element?.addEventListener?.("pointerdown", To, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Oo, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", Po, !0), Pi(), j(o, { animate: !1 });
  function Eo(s, a, d) {
    const f = o.cards.find((O) => O.id === s);
    if (!f) return { kind: "outside" };
    if (i) {
      const O = Xe(a), P = i.refusalAt(o, s, N?.grab ?? { x: 0, y: 0 }, O, le);
      if (P && !P.lands) return { kind: "refused", laneId: P.laneId, reason: P.reason, ...P.override && { override: P.override } };
      const { width: _, height: K } = Be(o);
      if (O.x < -40 || O.y < -40 || O.x > _ + 40 || O.y > K + 40) return { kind: "outside" };
      let B = o;
      try {
        B = d?.(O) ?? o;
      } catch (q) {
        console.warn("WORKSHOP: the board kit's chooser threw", q);
      }
      return JSON.stringify(B) === JSON.stringify(o) ? P ? { kind: "refused", laneId: P.laneId, reason: P.reason, near: !0, ...P.override && { override: P.override } } : { kind: "home" } : { kind: "candidate", laneId: B.cards.find((q) => q.id === s)?.laneId ?? f.laneId, next: B, ...P && { said: P.reason } };
    }
    const m = o.lanes.map((O) => v.get(de(Q.column(O.id)))).filter(Boolean), u = e.hitTestNodes(a, m, { padding: 6 }), w = u ? me(u.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === f.laneId) return { kind: "home" };
    const g = tn(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: Fe(o, s, w) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: w, next: g };
    let y = null;
    try {
      y = d({ x: a.x - Y.x, y: a.y - Y.y });
    } catch (O) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", O), { kind: "candidate", laneId: w, next: g };
    }
    const T = y?.cards.find((O) => O.id === s)?.laneId;
    return !y || !T || T === f.laneId ? { kind: "home" } : { kind: "candidate", laneId: T, next: y };
  }
  function wi() {
    return i ? !1 : new Set(We(o, { layout: le }).places.map((s) => s.row)).size > 1;
  }
  function Mo(s, a, d = !1) {
    const f = o.cards.find((_) => _.id === s), m = wr(o, s), u = U?.cardId === s && U.laneId === null ? U.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const _ = u > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (je(), _.id === f.laneId) {
        De(_.id, L ?? o), e.announce?.(`${Z(f)} is back in ${_.label}.`);
        return;
      }
      if (m.includes(_)) {
        const B = tn(o, s, _.id);
        U = { cardId: s, laneId: _.id, next: B }, j(B), De(_.id, B), G(t.onPreview, B), e.announce?.(`${Z(f)} to ${_.label}: ${ze(B, _.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const K = Fe(o, s, _.id) ?? "That move is not available.";
      re(), ne = { laneId: _.id, reason: K, timer: setTimeout(() => re(), 1500) }, j(L ?? o), De(_.id, L ?? o), e.announce?.(`${Z(f)} can't move to ${_.label}. ${K}`), G(t.onRefuse, { cardId: s, laneId: _.id, reason: K });
      return;
    }
    const w = U?.cardId === s ? U.laneId : f.laneId;
    let g;
    if (d) {
      const { places: _ } = We(o, { layout: le }), K = _.find((B) => B.laneId === w);
      g = _.filter((B) => B.column === K.column && (B.row - K.row) * a > 0).sort((B, q) => (B.row - q.row) * a).map((B) => o.lanes.find((q) => q.id === B.laneId));
    } else {
      const _ = o.lanes.findIndex((K) => K.id === w);
      g = a > 0 ? o.lanes.slice(_ + 1) : o.lanes.slice(0, _).reverse();
    }
    const y = g[0] && !m.includes(g[0]) ? g[0] : null;
    if (y) {
      const _ = Fe(o, s, y.id) ?? "That move is not available.", K = i ? { edit: { kind: "move_card", card: { id: s }, lane: { id: y.id } } } : void 0;
      if (!!t.confirmOverride && !A && !L && !Ee() && (i ? !("refused" in Ae(o, [{ ...K.edit, override: !0 }], { actor: { by: "check", via: "chat" } })) : Gn(o, s, y.id, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) !== null)) {
        re(), je(), ne = { laneId: y.id, reason: _, timer: setTimeout(() => re(), 1500) }, j(L ?? o), De(y.id, L ?? o), e.announce?.(`${Z(f)} can't move to ${y.label} by this board's rules. ${_} Move it anyway?`), Nn(s, y.id, _, K);
        return;
      }
    }
    const T = g.find((_) => m.includes(_)), O = y && T ? `${Z(f)} can't go in ${y.label}: ${Fe(o, s, y.id) ?? "that move is not available."} ` : "";
    if (re(), !T) {
      const _ = g[0];
      if (!_) {
        if (!d && Zt()) {
          const B = ft(o, s);
          if (B) {
            e.announce?.(B), G(t.onRefuse, { cardId: s, laneId: null, reason: B });
            return;
          }
          gi(f, a);
          return;
        }
        e.announce?.(`${Z(f)} has no lane to move to on that side.`);
        return;
      }
      const K = Fe(o, s, _.id) ?? "That move is not available.";
      ne = { laneId: _.id, reason: K, timer: setTimeout(() => re(), 1500) }, j(U?.next ?? L ?? o), De(_.id, U?.next ?? L ?? o), e.announce?.(`${Z(f)} can't move to ${_.label}. ${K}`), G(t.onRefuse, { cardId: s, laneId: _.id, reason: K });
      return;
    }
    if (T.id === f.laneId) {
      je(), De(T.id, L ?? o), e.announce?.(`${Z(f)} is back in ${T.label}.`);
      return;
    }
    const P = tn(o, s, T.id);
    U = { cardId: s, laneId: T.id, next: P }, j(P), De(T.id, P), G(t.onPreview, P), e.announce?.(`${O}${Z(f)} to ${T.label}: ${ze(P, T.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function De(s, a = o) {
    const d = i ? Ei(a, Q.column(s)) : We(a, { layout: le, rows: Go() }).places.find((y) => y.laneId === s), f = e.canvas?.viewbox?.();
    if (!d || !f || !(f.width > 0) || !(f.height > 0)) return;
    const m = 16, u = (y, T, O, P) => T + m * 2 >= P || y - m < O ? y - m - O : y + T + m > O + P ? y + T + m - (O + P) : 0, w = u(Y.x + d.x, d.width, f.x, f.width), g = u(Y.y + d.y, d.height, f.y, f.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function ln() {
    if (!t.onSelect || Zn) return;
    const s = S ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && v.get(s[0].id) === s[0] ? me(s[0].id) : null;
    b && s.some((w) => !$.has(w.id)) && (b = null, Ie && un(Ie));
    const [d, f] = b ? b.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : d && f && !a ? { path: { from: d, to: f } } : null, u = m ? JSON.stringify(m) : null;
    u !== $o && ($o = u, G(t.onSelect, m));
  }
  function No() {
    ae && (ae = null, j(o), G(t.onPreview, null));
  }
  function je() {
    U && (U = null, G(t.onPreview, null), j(L ?? o));
  }
  function gi(s, a) {
    const { width: d } = Be(o), f = v.get(de(Q.card(s.id)))?.options, m = f?.width ?? 228, u = Cn({
      x: a > 0 ? Y.x + d + 32 : Y.x - m - 32,
      y: f?.y ?? Y.y,
      width: m,
      height: f?.height ?? 76
    }, a), w = kr(o, s.id);
    U = { cardId: s.id, laneId: null, side: a, spot: u, next: o }, j(o), G(t.onPreview, w), e.announce?.(`${Z(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ee() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function $n() {
    return !S && !A && !L && !N && !Ee() && Zt();
  }
  function Pt() {
    ee && (ee = null, S || Me());
  }
  function Ln(s) {
    const a = o.lanes.map((f) => v.get(de(Q.column(f.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? me(d.id)?.key ?? null : null;
  }
  function Tn(s) {
    const a = s.options ?? {}, d = Gr({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), f = String(a.text ?? ""), m = f.replace(/\s+/g, " ").trim(), u = {};
    f.trim() !== m && f.length <= 4e3 && (u.text = f.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (u[g] = Math.round(a[g]));
    if (ao(a.image)) {
      u.image = { src: a.image };
      for (const [g, y] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[y]) && a[y] >= 1 && a[y] <= 2e4 && (u.image[g] = a[y]);
    }
    a.link?.data && mr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = yi(s);
    return { id: s.id, label: m, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...w.length ? { lines: w } : {} };
  }
  function yi(s) {
    const a = /* @__PURE__ */ new Map(), d = (f) => typeof f == "string" && !!v.get(f) && v.get(f) === e.nodes.one(f);
    for (const f of s.relationships?.getAssociations?.() ?? [])
      (f.targetPoint || !d(f.childId)) && a.set(f.id, En(f));
    for (const f of e.nodes?.allNodes ?? [])
      if (!(f === s || d(f.id)))
        for (const m of f.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, En(m));
    for (const f of Vt(o, s.id)) a.set(f.id, f);
    return [...a.values()];
  }
  function _o(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function ki(s, a) {
    for (const { node: u } of s) {
      const w = On(u);
      if (w) return w;
    }
    const d = o.lanes.find((u) => u.id === a), f = qe(o, a);
    if (d.capacity !== void 0 && !d.station && f + s.length > d.capacity) {
      const u = d.capacity - f;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${f} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: u } of s) {
      const w = en(m, a, u);
      if (w) return w;
      m = jn(m, a, u);
    }
    return null;
  }
  function On(s) {
    if (s.options?.image && !ao(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !mr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : bi(s) ? Jt : null;
  }
  function dn(s) {
    return !!s && v.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function bi(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && dn(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !dn(a))) {
        for (const d of a.relationships?.getAssociations?.() ?? []) if (d.childId === s.id && !d.targetPoint) return !0;
      }
    return !1;
  }
  const Et = (s) => s || "This note", Z = (s) => s.label || "The empty card", Ro = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : ks[a] ?? "shape";
  }, Mt = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Wo = (s) => {
    const a = s.flatMap((d) => {
      const f = Ro(d.asNote?.shape);
      return f ? [{ card: d, word: f }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Mt(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: f }) => f === "shape" ? `${Z(d)} had its own shape` : `${Z(d)} was ${Mt(f)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, vi = (s) => {
    const a = Ro(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Mt(a)} again.` : "";
  };
  function Pn() {
    return !S && !A && !L && !Ee() && Ws(o);
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
  function Fo(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function Do(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (v.get(s.id) === s) {
      const a = me(s.id);
      return a?.kind === "card" && o.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || dn(s) ? null : s.id;
  }
  function Nt(s, a) {
    if (s.cards.some((f) => f.id === a)) {
      const f = v.get(de(Q.card(a)));
      return f?.relationships && f.svgGroup ? f : null;
    }
    const d = e.nodes.one(a);
    return d && v.get(a) !== d && !dn(d) && d.svgGroup ? d : null;
  }
  function jo(s) {
    const a = [];
    for (const d of s) {
      const f = e.nodes.one(d.parentId);
      if (!f?.relationships || v.get(f.id) === f || f.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const w = f.relationships.addFloatingAssociation(d.targetPoint, Fn(d));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(d.childId);
      if (!m || v.get(m.id) === m) continue;
      const u = f.relationships.addAssociation(m, Fn(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function xi(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const P = Nt(s, d.parentId);
        if (!P || v.get(P.id) !== P) continue;
        const _ = { ...d, parentId: P.id }, K = JSON.stringify(_);
        a.add(d.id);
        const B = we.get(d.id);
        if (B && B.key === K && B.holder === P && !B.other && P.relationships.hasAssociationId?.(d.id)) continue;
        B && e.nodes.one(B.holder.id) === B.holder && B.holder.relationships?.removeAssociation?.(d.id), P.relationships.addFloatingAssociation(d.targetPoint, Fn(_)), we.set(d.id, { holder: P, other: null, swapped: !1, key: K });
        continue;
      }
      const f = Nt(s, d.parentId), m = Nt(s, d.childId);
      if (!f || !m || f === m) continue;
      const u = v.get(f.id) !== f, w = u ? m : f, g = u ? f : m, y = u ? Fo({ ...d, parentId: w.id, childId: g.id }, d) : { ...d, parentId: w.id, childId: g.id }, T = JSON.stringify(y);
      a.add(d.id);
      const O = we.get(d.id);
      O && O.key === T && O.holder === w && O.other === g && w.relationships.hasAssociationId?.(d.id) || (O && e.nodes.one(O.holder.id) === O.holder && O.holder.relationships?.removeAssociation?.(d.id), w.relationships.addAssociation(g, Fn(y)), we.set(d.id, { holder: w, other: g, swapped: u, key: T }));
    }
    for (const [d, f] of [...we])
      a.has(d) || (e.nodes.one(f.holder.id) === f.holder && f.holder.relationships?.hasAssociationId?.(d) && f.holder.relationships.removeAssociation(d), we.delete(d));
  }
  function Qn(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let Mn = null;
  function Ii(s, a) {
    if (s === "addRelationship") {
      if (we.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, f = e.nodes.one(a?.parentId), m = d ? null : e.nodes.one(a?.childId), u = Do(f), w = d ? null : Do(m);
      if (dn(f)) return;
      const g = Mn?.lineId === a?.id ? o.lines?.find((_) => _.id === a?.id) : void 0;
      g && (Mn = null);
      const y = (_) => {
        Qn(a), g && j(L ?? o), e.announce?.(_), G(t.onRefuse, { reason: _, laneId: null });
      };
      if (!Pn()) {
        Qn(a), g && j(L ?? o);
        return;
      }
      if (dn(m)) return y(Jt);
      if (!u || !w && !d) return y(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const T = d ? String(a.childId) : w;
      if (g) {
        const _ = o.cards.some((He) => He.id === u), K = !d && o.cards.some((He) => He.id === w);
        if (!_ && !K) return Ve({ remove: g.id });
        const B = { ...En(a), id: g.id, parentId: u, childId: T }, q = Hn(o, B);
        if (q) return y(q);
        Qn(a), Ve({ set: B });
        return;
      }
      const O = oi(o, u, T, En(a)), P = Hn(o, O);
      if (P) return y(P);
      Qn(a), Ve({ set: O });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...we].find(([m, u]) => (m === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const f = we.get(d);
      if (we.delete(d), e.nodes.one(f.holder.id) !== f.holder || f.other && e.nodes.one(f.other.id) !== f.other || !Pn())
        return Pn() || S ? void 0 : j(L ?? o);
      Mn = { lineId: d }, queueMicrotask(() => {
        S || Mn?.lineId !== d || (Mn = null, Ve({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const f = [...we].find(([O, P]) => O === d?.associationId && P.holder.id === d?.id);
        if (!f) continue;
        const [m, u] = f, w = o.lines?.find((O) => O.id === m), g = u.holder.relationships?.getAssociations?.().find((O) => O.id === m);
        if (!w || !g) continue;
        if (!Pn()) {
          j(L ?? o);
          continue;
        }
        const y = En(g), T = u.swapped ? Fo({ ...y, id: w.id, parentId: w.parentId, childId: w.childId }, y) : { ...y, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(Ai(T)) !== JSON.stringify(w) && (we.set(m, { ...u, key: "" }), Ve({ set: T }));
      }
  }
  function Ai(s) {
    return ht({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function Ve(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? ht(o, s.set) : br(o, s.remove);
    if (!d || d === o) return;
    e.beginHostStep?.(), o = d, e.endHostStep?.(), j(L ?? o);
    const f = "set" in s ? s.set : a, m = [f.parentId, f.childId].map((g) => o.cards.find((y) => y.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (g) => m[g] || (g === 1 && f.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${u(0)} to ${u(1)} changed.` : f.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const w = G(t.onChange, o, { line: s });
    Yt(w, () => {
      if (S || o !== d) return;
      const g = a ? ht(o, a) : "set" in s ? br(o, s.set.id) : null;
      g && (o = g, j(L ?? o));
    });
  }
  function Si(s) {
    const a = new Map(s.map((f) => [f.id, f])), d = new Map((o.lines ?? []).map((f) => [f.id, f]));
    for (const f of d.keys()) a.has(f) || Ve({ remove: f });
    for (const [f, m] of a)
      JSON.stringify(d.get(f)) !== JSON.stringify(m) && Hn(o, m) === null && Ve({ set: m });
  }
  function _t(s, a) {
    let d = o;
    const f = /* @__PURE__ */ new Map(), m = s.map(({ node: y, offer: T, from: O }) => {
      let P = T.lines;
      for (const [B, q] of f) P = hn(P, B, q);
      d = jn(d, a, { ...T, ...P ? { lines: P } : {} });
      const _ = d.cards[d.cards.length - 1];
      _.id !== y.id && f.set(y.id, _.id);
      const K = { ...y.options ?? {}, ...O ? { x: O.x, y: O.y } : {} };
      return { node: y, card: _, kept: K, lines: hn(P ?? [], y.id, _.id), under: T.under, day: T.day };
    });
    e.beginHostStep?.(), o = d;
    let u = o;
    for (const { node: y, card: T } of m)
      T.id !== y.id && ye.set(y.id, T.id), an.set(de(Q.card(T.id)), { x: y.options?.x ?? 0, y: y.options?.y ?? 0 }), cn(() => e.removeNode(y.id));
    e.endHostStep?.(), j(o), $i(de(Q.card(m[0].card.id)));
    const w = m.length === 1 && yr(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && Li(de(Q.card(w.id)), w.label);
    const g = o.lanes.find((y) => y.id === a);
    e.announce?.(m.length === 1 ? `${Z(m[0].card)} is now a card in ${g.label}. ${ze(o, a)}.${Wo([m[0].card])}` : `${_o(m.map(({ card: y }) => Z(y)))} are now cards in ${g.label}. ${ze(o, a)}.${Wo(m.map(({ card: y }) => y))}`);
    for (const { node: y, card: T, kept: O, lines: P, under: _, day: K } of m) {
      const B = { cardId: T.id, laneId: a, noteToCard: {
        noteId: y.id,
        label: fo(o, T),
        ..._ && { under: _ },
        ...K !== void 0 && { day: K },
        ...T.look ? { look: T.look } : {},
        ...T.asNote ? { asNote: T.asNote } : {},
        ...P.length ? { lines: P } : {}
      } }, q = () => {
        o !== u || !o.cards.some((Te) => Te.id === T.id) || (o = X({ ...o, cards: o.cards.filter((Te) => Te.id !== T.id), lines: hn(o.lines, T.id, y.id) }), u = o, j(o));
      }, He = G(t.onChange, o, B);
      e.holdTrade?.(y.id, He), Ho(He, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: y.id, isComment: !1 } }]);
      }, () => {
        if (!S) {
          if (q(), !e.nodes.one(O.id)) {
            e.beginHostStep?.();
            const Te = cn(() => e.addNode({ ...O }));
            Te && (Te.announcedByCreator = !0), e.endHostStep?.();
            const _n = hn(P, T.id, y.id).filter((ce) => !o.cards.some((Rn) => Rn.id === ce.parentId || Rn.id === ce.childId));
            Te?.ready?.then?.(() => {
              S || cn(() => jo(_n));
            });
          }
          e.announce?.(`${Z(T)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        S || (q(), e.keepTrade?.(y.id), e.announce?.(`Someone else put ${Z(T)} on the board first.`));
      });
    }
  }
  function Bo(s, a) {
    const d = o.cards.find((O) => O.id === s), f = M.get(de(Q.card(s))) ?? {}, m = Br(d), u = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = ($t.cornerRadius ?? 0) > 0, g = d.asNote, y = yr(o, d), T = {
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
    g?.image && Object.assign(T, {
      image: g.image.src,
      ...g.image.width ? { imageOrigWidth: g.image.width } : {},
      ...g.image.height ? { imageOrigHeight: g.image.height } : {}
    }), g?.link && (T.link = { ...g.link });
    for (const O of Object.keys(T)) T[O] === void 0 && delete T[O];
    return { id: u, note: T };
  }
  function et(s, a, d = "", f = !1) {
    const m = o.cards.find((ce) => ce.id === s), u = o.lanes.find((ce) => ce.id === m.laneId), w = o.cards.findIndex((ce) => ce.id === s), g = o.cards.slice(w + 1).find((ce) => ce.laneId === m.laneId)?.id, { id: y, note: T } = Bo(s, a), O = m.asNote, P = Vt(o, s), { leave: _ } = Bs(o, s, y), K = kr(o, s, y);
    e.beginHostStep?.(), o = K;
    const B = o;
    y !== s ? ye.set(y, s) : ye.delete(y);
    const q = cn(() => e.addNode(T));
    q && (q.announcedByCreator = !0), e.endHostStep?.(), j(o);
    const He = Promise.resolve(q?.ready).then(() => S || !q || e.nodes.one(y) !== q ? [] : cn(() => jo(_))).catch(() => []);
    q?.ready?.then?.(() => {
      if (S || e.nodes.one(y) !== q) return;
      const ce = () => e.selectNodes?.([q]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(ce) : ce();
    }), f || e.announce?.(`${Z(m)} is now a note on the canvas.${d} ${u.label}: ${ze(o, u.id)}.${vi(O?.shape)}`);
    const Te = () => {
      e.nodes.one(y) === q && (e.beginHostStep?.(), cn(() => e.removeNode(y)), e.endHostStep?.());
    }, _n = G(t.onChange, o, { cardId: s, cardToNote: { noteId: y } });
    return e.holdTrade?.(y, _n), Ho(_n, () => {
      He.then((ce) => {
        q && e.nodes.one(y) === q && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: Ut(q.options) } }, ...ce]);
      });
    }, () => {
      if (!S) {
        if (Te(), o === B && !o.cards.some((ce) => ce.id === s)) {
          const ce = {
            id: s,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ...P.length ? { lines: P } : {}
          }, Rn = jn(o, m.laneId, ce, g);
          Rn && (o = Rn, j(o));
        }
        e.announce?.(`${Z(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      S || (Te(), e.keepTrade?.(y), e.announce?.(`Someone else took ${Z(m)} off the lanes first.`));
    }), { added: q, answer: _n };
  }
  function Ci(s, a, d) {
    const f = d.map((y) => y.id), m = f.indexOf(a), u = s.cards.find((y) => y.id === a);
    if (m < 0 || !u) return s;
    const w = s.cards.filter((y) => y !== u), g = w.findIndex((y) => f.indexOf(y.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, u), X({ ...s, cards: w });
  }
  function $i(s) {
    se = se.then(() => {
      const a = v.get(s);
      if (S || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Li(s, a) {
    se = se.then(() => {
      const d = v.get(s);
      S || A || !d?.editor?.startInline || d.editor.startInline({ text: a, caret: "all" });
    });
  }
  function cn(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Ho(s, a, d, f) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && f();
    }, () => d());
    e.holdUntil?.(m);
  }
  function Nn(s, a, d, f) {
    if (!t.confirmOverride || A || L || Ee()) return;
    const m = { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }, u = (O, P) => {
      if (!f) {
        const K = Gn(O, s, a, P);
        return K && { next: K };
      }
      const _ = Ae(O, [{ ...f.edit, override: !0 }], { actor: { by: P.by, via: "chat" }, now: P.at });
      return "refused" in _ ? null : { next: _.workshop, said: _.report.edits.map((K) => K.said).join(" ") };
    };
    if (!u(o, m)) return;
    const w = o.cards.find((O) => O.id === s), g = o.lanes.find((O) => O.id === a);
    if (!w) return;
    let y;
    const T = { cardId: s, laneId: a, card: w.label, lane: g?.label ?? "", reason: d, ...f?.to && { to: f.to } };
    try {
      y = t.confirmOverride(T);
    } catch (O) {
      console.error("WORKSHOP: confirmOverride threw", O);
      return;
    }
    Promise.resolve(y).then((O) => {
      if (O !== !0 || S || A || L || Ee()) return;
      const P = o.cards.find((B) => B.id === s), _ = P && u(o, { by: G(t.overrideBy) || "You", at: (/* @__PURE__ */ new Date()).toISOString() });
      if (!P || !_) {
        e.announce?.(`${P ? Z(P) : "That card"} can't be moved ${f?.to ?? "to " + (g?.label ?? "there")} now.`);
        return;
      }
      o = _.next, j(o), e.announce?.(_.said ?? `${Z(P)} moved to ${g?.label ?? ""} anyway. ${d}`);
      const K = o.cards.find((B) => B.id === s)?.laneId ?? a;
      G(t.onChange, o, { cardId: s, laneId: K, override: !0, ...f && { edits: [{ ...f.edit, override: !0 }] } });
    }, () => {
    });
  }
  function Ti(s, a) {
    re(!1), ne = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => re(), 1500) }, j(o, { skip: a.cardId });
    const d = o.lanes.find((f) => f.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), G(t.onRefuse, a);
  }
  function re(s = !0) {
    ne && (clearTimeout(ne.timer), ne = null, s && !S && Me());
  }
  function Me() {
    j(N && N.outcome.kind === "candidate" ? N.outcome.next : U?.next ?? L ?? o, { skip: N?.cardId });
  }
  function zo(s) {
    const a = Vo(s, Go()), d = new Map(a.map((u) => [u.options.id, u.options])), f = (u, w, g, y = !1) => {
      const T = d.get(Q.column(u));
      T && (T.borderColor = w, T.borderWidth = g, delete T.borderStyle);
      const O = y && d.get(Q.lane(u));
      O && (O.borderColor = w, O.borderWidth = g);
    }, m = N?.cardId ?? U?.cardId;
    if (Ce = /* @__PURE__ */ new Map(), m) {
      const u = o.cards.find((y) => y.id === m)?.laneId, w = wr(o, m);
      if (!i || i.laneCues)
        for (const y of w) y.id !== u && (f(y.id, fr, 2), Ce.set(y.id, "open"));
      if (i?.laneCues) {
        for (const y of o.lanes) if (!w.includes(y)) {
          const T = d.get(Q.column(y.id));
          T && (T.backgroundColor = "#e9e8e2"), Ce.set(y.id, "closed");
        }
      }
      const g = N ? N.outcome : U?.laneId ? { kind: "candidate", laneId: U.laneId } : null;
      g?.kind === "candidate" && (f(g.laneId, ur, 3, !0), Ce.set(g.laneId, "over")), g?.kind === "refused" && (f(g.laneId, qt, 3), Ce.set(g.laneId, "refused"));
    }
    if (ee && !m) {
      for (const u of ee.open) u !== ee.laneId && (f(u, fr, 2), Ce.set(u, "open"));
      ee.laneId && !ee.refusal && (f(ee.laneId, ur, 3, !0), Ce.set(ee.laneId, "over")), ee.laneId && ee.refusal && (f(ee.laneId, qt, 3), Ce.set(ee.laneId, "refused"));
    }
    if (U?.laneId === null && U.spot) {
      const u = d.get(Q.card(U.cardId));
      u && (u.xPos = U.spot.x, u.yPos = U.spot.y);
    }
    if (ne) {
      Ce.set(ne.laneId, "refused"), f(ne.laneId, qt, 3, !0);
      const u = d.get(Q.caption(ne.laneId));
      if (u && (u.text = ne.reason, u.foregroundColor = "#b42318", !i)) {
        const w = d.get(Q.column(ne.laneId));
        w && (u.xPos = w.xPos + 6, u.width = w.width - 12, u.height = 30, u.vectorPath = yn(u.width, 30, 0), u.backgroundColor = "transparent");
      }
    }
    if (Lt = /* @__PURE__ */ new Set(), L && s === L) {
      const u = (g, y) => JSON.stringify(g) === JSON.stringify(y), w = (g) => {
        const y = d.get(g);
        y && (y.borderStyle = "dashed", y.borderColor = ys, y.borderWidth = 2, Lt.add(de(g)));
      };
      for (const g of s.cards) u(g, o.cards.find((y) => y.id === g.id)) || w(Q.card(g.id));
      for (const g of s.lanes) u(g, o.lanes.find((y) => y.id === g.id)) || w(Q.lane(g.id));
    }
    for (const u of a) {
      u.options.id = de(u.options.id);
      for (const w of u.relationships.associations)
        w.parentId = de(w.parentId), w.childId = de(w.childId);
    }
    return a;
  }
  function Go() {
    return N || U ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function j(s, a = {}) {
    if (S) return;
    xe = a.layout ?? le, Ye = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = zo(s), f = [];
    for (const { options: u } of d) {
      const w = u.id;
      if (v.has(w)) continue;
      const g = an.get(w);
      an.delete(w);
      const y = g && a.animate !== !1 && !at() ? { ...u, xPos: g.x, yPos: g.y } : u, T = e.nodes.add(Qi(y));
      v.set(w, T), M.set(w, { ...y }), T.ready && f.push(T.ready.then(() => {
        if (v.get(w) !== T) return;
        T.applyGovernance?.(), me(w)?.kind === "column" && T.toBack?.(!1), me(w)?.kind === "handle" && T.svgGroup?.front?.();
        const O = Xo(Ye?.model ?? s, w);
        O && T.svgGroup?.node?.setAttribute("aria-label", O);
      }).catch(() => {
      }));
    }
    const m = Ye;
    se = Promise.all([se, ...f]).then(() => {
      S || Ye !== m || Oi(zo(m.model), m);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function Oi(s, a) {
    const d = new Set(s.map((m) => m.options.id)), f = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, w] of [...v]) {
        if (d.has(u)) continue;
        for (const [y, T] of [...R])
          T.parentId !== u && T.childId !== u || (T.parent.relationships?.removeAssociation(y), R.delete(y));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), v.delete(u), M.delete(u);
        const g = D.get(u);
        g && (D.delete(u), F.delete(g)), e.nodes.remove(u);
      }
      for (const { options: u } of s) {
        const w = u.id, g = v.get(w);
        if (!g?.svgGroup) continue;
        const y = M.get(w) ?? {}, T = g.editor?.isInlineEditing?.();
        (u.fontSize !== y.fontSize || u.foregroundColor !== y.foregroundColor) && (g.options.fontSize = u.fontSize, g.options.fontColor = u.foregroundColor, g.applyTextStyle?.()), (u.width !== y.width || u.height !== y.height) && (u.vectorPath ? (g.options.width = u.width, g.options.height = u.height, g.setShape?.(g.options.shape, u.vectorPath), me(w)?.kind === "column" && g.toBack?.(!1)) : g.setSize?.(u.width, u.height)), u.text !== y.text && !T && g.setText?.(u.text), u.backgroundColor !== y.backgroundColor && g.setColors?.(u.backgroundColor), (u.borderColor !== y.borderColor || u.borderWidth !== y.borderWidth || u.borderStyle !== y.borderStyle) && (g.options.borderColor = u.borderColor, g.options.borderWidth = u.borderWidth, g.options.borderStyle = u.borderStyle, g.applyBorder?.());
        const O = u.xPos !== y.xPos || u.yPos !== y.yPos || Math.abs((g.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - u.yPos) > 0.5;
        if (w !== (a.skip && de(Q.card(a.skip))) && w !== (a.grip && de(a.grip)) && O) {
          const K = a.animate && !at() ? 180 : 0, B = f.includes(g) ? () => {
            !S && v.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          B && K && f.length === 1 && g.resizeRotate?.disable?.(), g.position(u.xPos, u.yPos, B, void 0, K);
        }
        const P = Xo(a.model, w);
        P && g.svgGroup.node.getAttribute("aria-label") !== P && g.svgGroup.node.setAttribute("aria-label", P), Lt.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", $e), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", W);
        const _ = me(w);
        if (_?.kind === "column") {
          const K = Ce.get(_.key);
          K ? g.svgGroup.node.setAttribute("data-workshop-drop", K) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        _?.kind === "handle" && g.svgGroup.front?.(), M.set(w, { ...u });
      }
      const m = /* @__PURE__ */ new Map();
      for (const u of s) for (const w of u.relationships.associations) m.set(w.id, w);
      for (const [u, w] of [...R])
        m.has(u) && v.get(w.parentId) === w.parent && v.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(u), R.delete(u));
      for (const [u, w] of m) {
        if (R.has(u)) continue;
        const g = v.get(w.parentId), y = v.get(w.childId);
        !g?.relationships || !y?.svgGroup || (g.relationships.addAssociation(y, Fn(w)), R.set(u, { parentId: w.parentId, childId: w.childId, parent: g, child: y }));
      }
      xi(a.model);
    }), un(a.model), Uo = a.model, Wt(), e.notifyNodeChanged?.();
  }
  let Uo = null;
  function Rt() {
    return !!xe.narrow || xe.lanesPerRow === 1;
  }
  function Ko() {
    let s;
    try {
      s = Xs(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: xe, focused: $e, draft: W, scale: C, tagScale: k, narrow: Rt(), room: s };
  }
  function qo() {
    if (J) return [1, 1];
    const s = jt(), a = Mr(s);
    return [a, Math.round(to(s, Rt() && !W, a) * 20) / 20];
  }
  function Wt() {
    if (!h || S) return;
    [C, k] = qo();
    const s = Uo ?? o, a = i ? i.places(s, xe) : We(s, { layout: xe }), d = i || s.lanes[0]?.station ? void 0 : a.places;
    let f = null;
    for (const m of v.values()) {
      const u = m.svgGroup?.node;
      u?.parentNode && (!f || u.compareDocumentPosition(f) & 4) && (f = u);
    }
    h.draw({
      board: s,
      scope: r,
      origin: Y,
      size: { width: a.width, height: a.height },
      ...Ko(),
      places: d,
      under: f,
      ...t.onFocusDone && { onDone: () => G(t.onFocusDone) }
    });
  }
  function Pi() {
    const s = e.canvas?.node, a = qo;
    if ([C, k] = a(), J || !h || !s || typeof MutationObserver > "u") return;
    let d = null;
    const f = new MutationObserver(() => {
      d && clearTimeout(d), d = setTimeout(() => {
        d = null;
        const [m, u] = a();
        S || m === C && u === k || (C = m, k = u, Wt());
      }, 120);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), x = () => {
      f.disconnect(), d && clearTimeout(d);
    };
  }
  let Ie = null;
  function Jo(s) {
    const a = me(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, be(s)) ?? null : null;
  }
  function Yo() {
    if (I) return i?.cardOfPart?.(o, I.name) ?? null;
    if (N) return N.cardId;
    if (Xn) return Xn;
    const s = S ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && v.get(s[0].id) === s[0] ? Jo(s[0].id) : null;
  }
  let Ft = null;
  function Zo() {
    S || !p || !Ie || Yo() !== Ft && un(Ie);
  }
  function un(s) {
    if (p) {
      Ie = s, Ft = Yo();
      const a = o.lanes.map((m) => v.get(de(Q.column(m.id)))?.svgGroup?.node).reduce((m, u) => u && (!m || m.compareDocumentPosition(u) & 4) ? u : m, null), d = e.canvas?.viewbox?.(), f = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - Y.x, y: d.y - Y.y, width: d.width, height: d.height } : null;
      p.draw(o, s === o ? null : s, {
        origin: Y,
        layout: xe,
        above: a,
        view: f,
        announce: (m) => e.announce?.(m),
        focus: Ft,
        boardFocused: $e,
        picked: b,
        onPick: _i,
        gripSize: An,
        clamp: I?.last?.clampedReason ? { name: I.name, text: I.last.clampedReason } : N?.outcome.kind === "candidate" && N.outcome.said ? { name: "card-" + N.cardId, text: N.outcome.said } : !I && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!I?.last?.refusal || !I && !!pe,
        onUnlink: (m, u) => {
          if (A || L || N || I || Ee()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: u }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: u } }, g = Ae(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : tt(g.workshop, o.lanes[0]?.station ? { laneId: u } : { cardId: m });
        }
      });
    }
  }
  function Xe(s) {
    return { x: s.x - Y.x, y: s.y - Y.y };
  }
  function Dt(s, a) {
    const d = i?.noteDay?.(o, Xe(a), xe);
    return typeof d == "number" && Number.isFinite(d) && (s.day = d), s;
  }
  function Be(s) {
    return i ? i.places(s, xe) : { ...We(s, { layout: le }), parts: [] };
  }
  function Ei(s, a) {
    const d = i.places(s, xe).parts.find((f) => f.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function jt() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function Mi() {
    Yn?.(), Yn = null, An = Kt(jt());
    const s = e.canvas?.node;
    if (!nt() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const d = () => {
      if (a = null, S || !nt()) return;
      if (I || N) {
        a = setTimeout(d, 250);
        return;
      }
      const m = Kt(jt());
      Math.abs(m - An) < 2 || (An = m, j(L ?? o));
    }, f = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(d, 200);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), Yn = () => {
      f.disconnect(), a && clearTimeout(a);
    };
  }
  function nt() {
    return !i && !!o.lanes[0]?.station && $e && !A && !L && !Ee();
  }
  function Ni(s) {
    const a = Wr(s);
    if (!a || !nt()) return null;
    const d = o;
    return (f) => {
      const m = hs(d, f), u = ms(d, a, a.kind === "link" && m === a.from ? null : m);
      return u.next ? { next: u.next } : { next: d, clampedReason: u.refusal, refusal: u.refusal };
    };
  }
  function _i(s) {
    if (S || $e) return;
    const a = e.getSelectedNodes?.() ?? [];
    $ = new Set(a.map((u) => u.id)), b = s, a.length && e.clearSelection?.(), Ie && un(Ie), ln();
    const [d, f] = s.split(">"), m = (u) => o.lanes.find((w) => w.id === u)?.label ?? u;
    e.announce?.(`Path from ${m(d)} to ${m(f)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function Vo(s, a) {
    if (!i) {
      const d = Vs(s, { native: !0, origin: Y, rows: a, layout: le, style: $t }).nodes;
      return nt() ? [...d, ...jr(o, Y, An)] : d;
    }
    return i.notes(s, xe, Y, $t);
  }
  function tt(s, a, d) {
    const f = i ? i.editsBetween(o, s) : ws(o, s);
    if (!f.length) return !1;
    const m = Ae(o, f);
    return "refused" in m ? (e.announce?.(m.refused.reason), G(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, j(o, { skip: d }), e.announce?.(m.report.edits.map((u) => u.said).join(" ")), G(t.onChange, o, { ...a, edits: f }), !0);
  }
  function Xo(s, a) {
    const d = me(a);
    if (d?.kind === "lane" || d?.kind === "caption") {
      if (d.kind === "caption" && s.lanes.some((m) => m.station)) return null;
      const f = s.lanes.find((m) => m.id === d.key);
      return f ? `${f.label}, ${ze(s, f.id)}` : null;
    }
    if (d?.kind === "card") {
      const f = s.cards.find((u) => u.id === d.key), m = f && s.lanes.find((u) => u.id === f.laneId);
      return f && m ? `${f.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? i ? i.label?.(s, be(a)) ?? null : ps(s, be(a)) : null;
  }
  function Bt(s, a) {
    const d = Vo(s).find((f) => f.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Qe() {
    (N || I) && e.cancelGovernedDrag?.("host"), N = null, I = null, U && (U = null, G(t.onPreview, null)), re(!1);
  }
  return {
    toCanvas(s) {
      if (S || A || Ee()) return "This workshop is view-only here.";
      if (!o.cards.some((u) => u.id === s)) return "That card is no longer on the board.";
      const a = ft(o, s);
      if (a) return a;
      U && je(), L && (Qe(), L = null, j(o), e.refreshGovernance?.());
      const { width: d } = Be(o), f = v.get(de(Q.card(s)))?.options, m = o.cards.find((u) => u.id === s);
      return et(s, Cn({
        x: Y.x + d + 32,
        y: f?.y ?? Y.y,
        width: m?.asNote?.width ?? f?.width ?? 228,
        height: m?.asNote?.height ?? f?.height ?? 76
      })), null;
    },
    get value() {
      return o;
    },
    get origin() {
      return { ...Y };
    },
    get layout() {
      return { ...le };
    },
    get bounds() {
      const { width: s, height: a } = Be(o);
      return { x: Y.x, y: Y.y, width: s, height: a };
    },
    get frame() {
      const { width: s, height: a } = Be(o);
      if (!h) return { x: Y.x, y: Y.y, width: s, height: a };
      const d = _r(o, { width: s, height: a }, { ...Ko(), scale: 1, tagScale: to(1, Rt() && !W) });
      return { x: Y.x + d.x, y: Y.y + d.y, width: d.width, height: d.height };
    },
    get focused() {
      return $e;
    },
    setFocused(s) {
      if (S) return;
      const a = $e;
      $e = !!s;
      for (const d of v.values()) d.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", $e);
      a !== $e && (b && (b = null, queueMicrotask(ln)), !i && o.lanes[0]?.station ? (Qe(), Mi(), j(L ?? o)) : Ie && un(Ie), Wt());
    },
    setLayout(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = pr(s);
      i ? i.places(o, a) : We(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(le) && (Qe(), le = a, j(L ?? o));
    },
    whenDrawn: () => se,
    update(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = X(s);
      Qe(), o = a;
      const d = A;
      A = l || c(o), j(L ?? o), A !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = s ? X(s) : null;
      Qe(), L = a, j(L ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = o.lanes.find((f) => f.id === s);
      S || !d || (re(!1), ne = { laneId: s, reason: a, timer: setTimeout(() => re(), 1500) }, Me(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      l = !!s;
      const a = l || c(o);
      S || A === a || (Qe(), A = a, j(L ?? o), e.refreshGovernance?.());
    },
    destroy() {
      S || (Qe(), S = !0, Dn.get(e)?.delete(Ot), Yn?.(), x?.(), h?.destroy(), pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", To, !0), Ze && clearTimeout(Ze), e.element?.ownerDocument?.removeEventListener?.("pointerup", Oo, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", Po, !0), mi?.(), p && e.element?.removeEventListener?.("pointerover", Lo), e.withPolicyAuthority(() => {
        for (const [s, a] of we) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of R) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of v)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), R.clear(), we.clear(), v.clear(), M.clear(), F.clear(), D.clear(), pi(), p?.destroy(), Zn = !1, ln(), e.notifyNodeChanged?.());
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
function Yt(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function hr(e) {
  const n = "card" in e ? e.card : null;
  return n && typeof n == "object" && typeof n.id == "string" ? n.id : null;
}
function xs(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function pr(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function Is(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const As = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function oe(e) {
  return As.includes(e.kind) ? e.kind : void 0;
}
function ge(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Se(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Ss(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = xt(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function xt(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const It = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function io(e) {
  if (typeof e != "string" || !It.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function Br(e) {
  return e.noteId ?? e.id;
}
function At(e) {
  const n = xt(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function Hr(e) {
  const n = ge(e);
  let t;
  try {
    t = new URL(Se(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (t.protocol !== "https:" || t.username || t.password || t.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: t.href, alt: Se(n.alt, 240) };
}
function Pe(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const zr = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Cs = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function so(e) {
  const n = ge(e), t = {}, r = (i) => {
    if (typeof i != "string" || !zr.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, c, p) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < c || i > p) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !Cs.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function Gr(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        so({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return so(n);
}
function ao(e) {
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
function mr(e) {
  try {
    return !!yt({ link: e });
  } catch {
    return !1;
  }
}
function yt(e) {
  const n = ge(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = ge(n.image);
    if (!ao(r.src)) throw new Error("A card keeps a picture by its web address only.");
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
const bn = 96, $s = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Ls = ["solid", "dashed", "dotted"], Ts = 1e7;
function vn(e) {
  const n = ge(e);
  if (typeof n.id != "string" || !$s.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: io(n.parentId), childId: io(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, c) => {
    const p = n[o];
    if (p != null) {
      if (typeof p != "number" || !Number.isFinite(p) || p < i || p > c) throw new Error("A line's look is out of range.");
      t[o] = p;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !zr.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Ls.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = ge(n.targetPoint), i = (c) => typeof c == "number" && Number.isFinite(c) && Math.abs(c) <= Ts;
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
function Os(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map(vn).map((r) => Ur(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (Ge(t.map((r) => r.id), "line ID"), t.length > bn) throw new Error(`A workshop holds up to ${bn} lines.`);
  return t;
}
function Ur(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function Ge(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function vo({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function Ps(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const kn = (e) => "lane-" + e, Ke = (e) => "card-" + e, kt = (e) => "image-" + e;
function Aa(e, n = {}) {
  const t = Ps(e), r = Q.of(n.scope);
  return vo(e).map((o) => {
    const i = e.cards.filter((h) => h.laneId === o.id), c = t.filter((h) => h.laneId === o.id), p = [r.lane(o.id)];
    return o.station?.image && p.push(r.image(o.id)), { lane: o, cards: i, signals: c, nodeIds: [...p, ...i.map((h) => r.card(h.id))] };
  });
}
const xo = 5, Bn = 24, lo = 3;
function Es(e, n, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A move made anyway says who made it, when, and past which rule.");
  const r = e, o = (c, p) => typeof c == "string" && c.trim().length > 0 && c.length <= p && !/[\u0000-\u001f\u007f<>]/.test(c), i = r.was === void 0 ? void 0 : Ms(r.was);
  if (!o(r.by, 80) || !o(r.at, 40) || Number.isNaN(Date.parse(r.at)) || !o(r.sentence, 300) || typeof r.from != "string" || !n.includes(r.from) || r.from === t && !i || Object.keys(r).some((c) => !["by", "at", "sentence", "from", "was"].includes(c)))
    throw new Error("A move made anyway says who made it, when, past which rule, and the lane it came from.");
  return { by: r.by, at: r.at, sentence: r.sentence, from: r.from, ...i && { was: i } };
}
function Ms(e) {
  const n = () => new Error("A move made anyway says what it changed as it was before.");
  if (!e || typeof e != "object" || Array.isArray(e)) throw n();
  const t = e, r = Object.keys(t);
  if (!r.length || r.some((i) => !["lag", "duration", "parentId"].includes(i))) throw n();
  const o = {};
  for (const i of ["lag", "duration"]) {
    if (t[i] === void 0) continue;
    const c = t[i];
    if (typeof c != "number" || !Number.isInteger(c) || Math.abs(c) > 1e3) throw n();
    o[i] = c;
  }
  if (t.parentId !== void 0) {
    if (t.parentId !== null && (typeof t.parentId != "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(t.parentId))) throw n();
    o.parentId = t.parentId;
  }
  return o;
}
function X(e) {
  const n = ge(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !oe(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = oe(n), o = r ? ve(r) : void 0, i = { id: Pe }, c = Se(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > xo)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const p = o?.cards ?? [Bn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > p[0]) throw new Error(p[1]);
  const h = n.lanes.map((b) => {
    const $ = ge(b), I = { id: Pe($.id), label: Se($.label) };
    if ($.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if ($.capacity !== void 0) {
      const L = t ? 576 : 24;
      if (typeof $.capacity != "number" || !Number.isInteger($.capacity) || $.capacity < 1 || $.capacity > L)
        throw new Error(`Lane capacity must be a whole number from 1 to ${L}.`);
      I.capacity = $.capacity;
    }
    if (o?.readLane?.($, I, i), $.station !== void 0) {
      const L = ge($.station), W = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= lo)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray(L.next) || L.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const J = L.next.map(Pe);
      Ge(J, "onward stop"), I.station = { column: W(L.column), row: W(L.row), next: J, outcome: Se(L.outcome, 160) }, L.image !== void 0 && (I.station.image = Hr(L.image));
    }
    return I;
  }), C = h.map((b) => b.id);
  if (Ge(C, "lane ID"), r && h.some((b) => b.station)) throw new Error("A business board has no map stations.");
  if ((t || h.some((b) => b.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (h.some((b) => b.station) && n.cards.every((b) => b?.free === !0))
    throw new Error("A map needs at least one token.");
  if (h.some((b) => b.station)) {
    if (!h.every((b) => b.station)) throw new Error("Give every station on the map a position.");
    Ge(h.map((b) => b.station.column + "," + b.station.row), "map position");
    for (const b of h)
      if (b.station.next.some(($) => $ === b.id || !C.includes($))) throw new Error("Connect each stop to another station on this map.");
  }
  const k = n.cards.map((b) => {
    const $ = ge(b), I = { id: Pe($.id), label: r ? Se($.label) : Ss($.label), laneId: Pe($.laneId) };
    if (!C.includes(I.laneId)) throw new Error("Card refers to an unknown lane.");
    if ($.override !== void 0) {
      if (t || n.experience !== void 0) throw new Error("A release plan’s and a startup experience’s cards are never moved past a rule.");
      I.override = Es($.override, C, I.laneId);
    }
    if ($.allowedLaneIds !== void 0) {
      if (!Array.isArray($.allowedLaneIds) || $.allowedLaneIds.length > h.length) throw new Error("Invalid allowed lanes.");
      if (I.allowedLaneIds = $.allowedLaneIds.map(Pe), Ge(I.allowedLaneIds, "allowed lane"), !I.allowedLaneIds.includes(I.laneId) && !I.override || !I.allowedLaneIds.every((L) => C.includes(L)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if ($.look !== void 0) {
      const L = so($.look);
      L && (I.look = L);
    }
    if ($.asNote !== void 0) {
      const L = yt($.asNote);
      L && (I.asNote = L);
    }
    if ($.noteId !== void 0 && $.noteId !== I.id && (I.noteId = io($.noteId)), $.free !== void 0) {
      if ($.free !== !0 || !h.some((L) => L.station)) throw new Error("Only a map’s cards can be free of its paths.");
      I.free = !0;
    }
    if (o?.readCard($, I, i), t) {
      if (typeof $.points != "number" || !Number.isInteger($.points) || $.points < 1 || $.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (I.points = $.points, $.dependsOn !== void 0) {
        if (!Array.isArray($.dependsOn) || $.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        I.dependsOn = $.dependsOn.map(Pe), Ge(I.dependsOn, "dependency");
      }
    }
    return I;
  });
  Ge(k.map((b) => b.id), "card ID");
  const x = { version: 1, title: c, lanes: h, cards: k };
  if (n.experience !== void 0) {
    const b = ge(n.experience);
    if (b.version !== 1 || b.kind !== "customer-interviews" && b.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    x.experience = { version: 1, kind: b.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    x.signals = n.signals.map((b) => {
      const $ = ge(b), I = Pe($.cardId), L = Pe($.laneId);
      if (!k.some((W) => W.id === I) || !C.includes(L))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Pe($.id),
        label: Se($.label),
        cardId: I,
        laneId: L,
        whenPresent: Se($.whenPresent, 160),
        whenAbsent: Se($.whenAbsent, 160)
      };
    }), Ge(x.signals.map((b) => b.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const b = Os(n.lines, new Set(k.map(($) => $.id)));
    b.length && (x.lines = b);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    x.presentationOrder = vo({ lanes: h, presentationOrder: n.presentationOrder }).map((b) => b.id);
  }
  if (n.behaviour !== void 0 && (x.behaviour = ke().validate(n.behaviour, { ...x, kind: n.kind })), t)
    return x.kind = "release-plan", Ri(x), x;
  if (r && o) {
    x.kind = r, o.readBoard(n, x, i);
    const b = o.validate(x);
    if (b) throw new Error(b);
    return x;
  }
  for (const b of h)
    if (qe({ cards: k.filter(($) => !$.override) }, b.id) > (b.capacity ?? 1 / 0))
      throw new Error(`Lane "${b.label}" exceeds its capacity.`);
  return x;
}
function qe(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const Kr = 65536;
function Sa(e) {
  const n = JSON.stringify(X(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > Kr) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function Ca(e) {
  if (e.length > Kr) throw new Error("This workshop is too large to open from a link.");
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
function Io(e, n, t) {
  const r = oe(e);
  return r ? ve(r).planMove(e, n, t) : void 0;
}
function bt(e, n) {
  if (oe(e)) return e.lanes.filter((r) => Io(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => Un(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && qe(e, r.id) < (r.capacity ?? 1 / 0));
}
function co(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = Io(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = Un(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !bt(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? St({ ...r, laneId: t }) : i) };
}
function St(e) {
  if (!e.override) return e;
  const { override: n, ...t } = e;
  return t;
}
function tn(e, n, t) {
  const r = Ao(e, n, t);
  if (!r || r === e) return r;
  const o = r.cards.some((i) => i.id === n && i.override) ? { ...r, cards: r.cards.map((i) => i.id === n ? St(i) : i) } : r;
  return e.behaviour && "refused" in ke().check(e, o) ? null : o;
}
function Ns(e) {
  return e.kind !== "release-plan" && !e.experience;
}
function $a(e, n) {
  return e.cards.some((t) => t.override) || n.cards.some((t) => t.override);
}
function La(e, n) {
  if (!n.override) return !1;
  const t = e.cards.find((r) => r.id === n.id)?.override;
  return !t || JSON.stringify(t) !== JSON.stringify(n.override);
}
function Ta(e, n) {
  const t = e.cards.find((o) => o.id === n.id)?.override;
  if (!t || n.override) return !1;
  const r = t.was ?? {};
  return n.laneId === t.from && (r.lag === void 0 || (n.lag ?? 0) === r.lag) && (r.duration === void 0 || n.duration === r.duration) && (r.parentId === void 0 || (n.parentId ?? null) === r.parentId);
}
function Oa(e, n) {
  return e.cards.some((t) => t.laneId === n && t.override !== void 0);
}
function Pa(e, n, t) {
  const r = e.cards.find((o) => o.id === n);
  return !r || !e.lanes.some((o) => o.id === t) ? "That card or lane is no longer on the board." : r.laneId === t || tn(e, n, t) || Gn(e, n, t, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) ? null : Fe(e, n, t) ?? "That move is not available.";
}
function qr(e) {
  return { by: String(e.by || "Someone").replace(/[\u0000-\u001f\u007f<>]/g, "").slice(0, 80) || "Someone", at: e.at };
}
function _s(e, n, t, r) {
  return { ...qr(t), sentence: (n || "That move is not available.").slice(0, 300), from: e.laneId, ...r && { was: r } };
}
function Gn(e, n, t, r) {
  const o = e.cards.find((C) => C.id === n);
  if (!o || o.laneId === t || !e.lanes.some((C) => C.id === t) || !Ns(e) || tn(e, n, t)) return null;
  const i = Fe(e, n, t) ?? "That move is not available.", c = Ao(e, n, t), p = c && c !== e ? c : oe(e) ? { ...e, cards: [...e.cards.filter((C) => C.id !== n), o] } : e, h = _s(o, i, r);
  try {
    return X({ ...p, cards: p.cards.map((C) => C.id === n ? { ...St(C), laneId: t, override: h } : C) });
  } catch {
    return null;
  }
}
function Ea(e, n, t) {
  const r = new Map(e.cards.map((i) => [i.id, i]));
  if (!n.cards.some((i) => i.override || r.get(i.id)?.override)) return n;
  const o = n.cards.map((i) => {
    const c = r.get(i.id), p = St(i);
    if (!c) return p;
    const h = c.laneId !== i.laneId, C = (c.lag ?? 0) !== (i.lag ?? 0) || c.duration !== i.duration || (c.parentId ?? null) !== (i.parentId ?? null);
    if (!h && !C) return c.override ? { ...p, override: c.override } : p;
    if (!i.override) return p;
    if (h && !C) {
      const $ = Gn(e, i.id, i.laneId, t)?.cards.find((I) => I.id === i.id)?.override;
      return $ ? { ...p, override: $ } : p;
    }
    const k = oe(e) === "nest" ? { kind: "nest_card", card: { id: i.id }, ...i.parentId ? { under: { id: i.parentId } } : { lane: { id: i.laneId } }, override: !0 } : e.kind === "launch-plan" || e.kind === "hiring-plan" ? { kind: "set_task", card: { id: i.id }, lag: i.lag ?? 0, duration: i.duration ?? 1, override: !0 } : null;
    if (!k) return p;
    const x = Ae(e, [k], { actor: { by: qr(t).by, via: "chat" }, now: t.at }), b = "refused" in x ? void 0 : x.workshop.cards.find(($) => $.id === i.id);
    return b?.override && b.laneId === i.laneId && (b.lag ?? 0) === (i.lag ?? 0) && b.duration === i.duration && (b.parentId ?? null) === (i.parentId ?? null) ? { ...p, override: b.override } : p;
  });
  return { ...n, cards: o };
}
const Rs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function Jr(e) {
  if (!e.override) return null;
  const n = new Date(e.override.at), t = Number.isNaN(n.getTime()) ? "" : " · " + n.getUTCDate() + " " + Rs[n.getUTCMonth()];
  return "Moved anyway by " + e.override.by + t;
}
function Ao(e, n, t) {
  const r = e.cards.find((c) => c.id === n);
  if (!r || !e.lanes.some((c) => c.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return Un(e, r, t);
  const o = Io(e, n, t);
  if (o !== void 0) return o;
  const i = ea(e, n, t);
  return i || (t === "prototype" && sn(e) === "customer-interviews" ? null : bt(e, r).some((c) => c.id === t) ? co(e, n, t) : null);
}
function wr(e, n) {
  return e.lanes.filter((t) => tn(e, n, t.id) !== null);
}
function Fe(e, n, t) {
  const r = Ao(e, n, t);
  if (r !== null) {
    const x = r === e || !e.behaviour ? null : ke().check(e, r);
    return x && "refused" in x ? x.refused.sentence : null;
  }
  const o = e.cards.find((x) => x.id === n), i = e.lanes.find((x) => x.id === t);
  if (!o || !i) return "That move is not available.";
  const c = oe(e), p = c && ve(c).refusal;
  if (p) return p(e, n, t);
  const h = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return h;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return h;
    const x = on(e, t), b = { ...e, lanes: e.lanes.map((I) => I === i ? { id: i.id, label: i.label } : I) }, $ = Un(b, o, t);
    return $ ? `Needs ${on($, t) - x} points. It already holds ${x} of ${i.capacity} points.` : h;
  }
  const C = e.lanes.find((x) => x.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const k = qe(e, t);
  if (i.capacity !== void 0 && k >= i.capacity && !(C?.station && o.free)) {
    const x = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${k} of ${i.capacity} ${x}.`;
  }
  return h;
}
function Zt(e) {
  return !0;
}
function Ws(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !sn(e);
}
function Fs(e) {
  const n = sn(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function Ds(e) {
  const n = xt(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const js = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function xn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && js.test(n) && !t.has(n) ? n : qn(e, "card");
}
function en(e, n, t) {
  const r = e.lanes.find((p) => p.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = Fs(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= Bn ? `This board is at its size limit of ${Bn} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : Qr(e, n, t) ? null : Fe(Xr(e, n, t), xn(e, t.id), n);
  if (oe(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const p = ei(e, n, t);
    return typeof p == "string" ? p : gr(e, p);
  }
  if (e.cards.length >= Bn) return `This board is at its size limit of ${Bn} cards. Remove a card to make room.`;
  const i = e.lanes.some((p) => p.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const c = qe(e, n);
  if (r.capacity !== void 0 && !i && c >= r.capacity) return `It already holds ${c} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const p = Zr(t.lines);
    if (!p) return "A line of this note can't be joined to a card.";
    const h = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + p.filter((C) => !h.has(C.id)).length > bn)
      return `A workshop holds up to ${bn} lines.`;
  }
  return gr(e, { ...e, cards: [...e.cards, { id: xn(e, t.id), label: At(So(t) || rn(e)), laneId: n }] });
}
function gr(e, n) {
  if (!e.behaviour) return null;
  const t = ke().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function Yr(e) {
  try {
    return e && typeof e == "object" ? Gr(e) : void 0;
  } catch {
    return;
  }
}
function uo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      yt({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? yt(n) : void 0;
}
function Zr(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = vn(r);
    } catch {
      const i = (p) => {
        const { id: h, parentId: C, childId: k, targetPoint: x } = ge(r);
        return vn({ id: h, parentId: C, childId: k, ...p ? { targetPoint: x } : {} });
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
function Ct(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function hn(e, n, t) {
  return e && e.map((r) => Ct(r, n, t));
}
function Vr(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function jn(e, n, t, r) {
  if (en(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return Qr(e, n, t, r);
  if (oe(e)) {
    const L = ei(e, n, t), W = L.cards[L.cards.length - 1], J = r === void 0 ? -1 : e.cards.findIndex((l) => l.id === r && l.laneId === n);
    return J < 0 ? L : { ...L, cards: [...e.cards.slice(0, J), W, ...e.cards.slice(J)] };
  }
  const o = Yr(t.look), i = So(t), c = i || rn(e);
  let p = uo(t.asNote);
  i || (p = { ...p, text: "" }), c.length > 80 && p?.text === void 0 && c.length <= 4e3 && (p = { ...p, text: c });
  const h = xn(e, t.id), C = h !== t.id && typeof t.id == "string" && It.test(t.id) ? t.id : void 0, k = e.lanes.some((L) => L.station), x = {
    id: h,
    label: At(c),
    laneId: n,
    ...o ? { look: o } : {},
    ...p ? { asNote: p } : {},
    ...C ? { noteId: C } : {},
    ...k ? { free: !0 } : {}
  }, b = r === void 0 ? -1 : e.cards.findIndex((L) => L.id === r && L.laneId === n), $ = b < 0 ? [...e.cards, x] : [...e.cards.slice(0, b), x, ...e.cards.slice(b)], I = t.lines === void 0 ? void 0 : Vr(e, Zr(t.lines).map((L) => Ct(L, t.id, x.id)));
  return X({ ...e, cards: $, ...I ? { lines: I } : {} });
}
function Xr(e, n, t, r) {
  const { label: o, points: i } = Ds(typeof t.label == "string" ? t.label : ""), c = xn(e, t.id), p = c !== t.id && typeof t.id == "string" && It.test(t.id) ? t.id : void 0, h = { id: c, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...p ? { noteId: p } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((k) => k.id === r && k.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, h] : [...e.cards.slice(0, C), h, ...e.cards.slice(C)] };
}
function Qr(e, n, t, r) {
  const o = Xr(e, n, t, r), i = xn(e, t.id), c = o.cards.find((h) => h.id === i);
  if (c.laneId === n) return X(o);
  const p = Un(o, c, n);
  return p ? X(p) : null;
}
function ei(e, n, t) {
  const r = So(t), o = ve(oe(e)).fromNote(e, r, rn(e, t.under));
  if (typeof o == "string") return o;
  const i = Ae(e, [{ kind: "add_card", lane: { id: n }, ...o, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const c = i.workshop.cards, p = xn(e, t.id), h = p !== t.id && typeof t.id == "string" && It.test(t.id) ? t.id : void 0, C = Yr(t.look), k = r ? uo(t.asNote) : { ...uo(t.asNote), text: "" };
  c[c.length - 1] = {
    ...c[c.length - 1],
    id: p,
    ...h ? { noteId: h } : {},
    ...C ? { look: C } : {},
    ...k ? { asNote: k } : {}
  };
  const x = ve(oe(e));
  return typeof t.day == "number" && Number.isFinite(t.day) && x.landNote ? x.landNote(i.workshop, p, t.day) : i.workshop;
}
function So(e) {
  return typeof e?.label == "string" ? xt(e.label) : "";
}
function yr(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === rn(e, n.parentId) || n.label === rn(e)) ? "" : t !== void 0 && t !== "" && At(t) === n.label ? t : fo(e, n);
}
function ni(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = oe(e), r = Jr(n), o = t ? ve(t).cardText(e, n) : n.label;
  return r ? o + `
` + r : o;
}
function fo(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = oe(e);
  return t ? ve(t).noteText(e, n) : n.label;
}
function ft(e, n) {
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
function kr(e, n, t = ti(e, n)) {
  if (ft(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const c = { ...i, dependsOn: i.dependsOn.filter((p) => p !== n) };
    return c.dependsOn.length || delete c.dependsOn, c;
  }), o = e.lines?.map((i) => Ct(i, n, t));
  return X({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Bs(e, n, t = ti(e, n)) {
  const r = new Set(e.cards.filter((c) => c.id !== n).map((c) => c.id)), o = (e.lines ?? []).filter((c) => c.parentId === n || c.childId === n).map((c) => Ct(c, n, t)), i = (c) => r.has(c.parentId) || r.has(c.childId);
  return { stay: o.filter(i), leave: o.filter((c) => !i(c)) };
}
function ti(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? Br(t) : n;
}
function Vt(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function Hn(e, n) {
  if (e.kind) return Hs;
  let t;
  try {
    t = vn(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = Ur(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= bn ? `A workshop holds up to ${bn} lines.` : null;
}
const Hs = "Lines join the cards of a lane workshop to notes and to each other.";
function ht(e, n) {
  return Hn(e, n) !== null ? null : X({ ...e, lines: Vr(e, [vn(n)]) });
}
function br(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? X({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function oi(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((c) => c.id));
  let i = `${n}->${t}`;
  for (let c = 2; o.has(i); c++) i = `${n}->${t}~${c}`;
  return vn({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function zs(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function Gs(e, n) {
  return ri(e, n, !1);
}
function ze(e, n) {
  return ri(e, n, !0);
}
function ri(e, n, t) {
  const r = e.lanes.find((k) => k.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const k = on(e, n);
    return r.capacity ? k + (t ? " of " : " / ") + r.capacity + " points" : k + " points";
  }
  const o = oe(e);
  if (o) return ve(o).caption(e, n);
  const i = na(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const c = e.cards.filter((k) => k.laneId === n).length, p = e.behaviour ? ke().laneLimit(e, n) : r.capacity, h = qe(e, n), C = (k) => k + (k === 1 ? " card" : " cards");
  return t ? p !== void 0 && h !== c ? h + " of " + p + " · " + C(c - h) : p !== void 0 ? c + " of " + p : C(c) : p !== void 0 && h !== c ? h + " / " + p + " · +" + (c - h) : p !== void 0 ? c + " / " + p : String(c);
}
function Us(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || oe(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? ke().laneLimit(e, n) : t.capacity;
  return r !== void 0 && qe(e, n) >= r;
}
const Kn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, pn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function ii(e, n = Kn, t = 28, r) {
  const { pitch: o, row: i, top: c } = n, p = !!e.lanes[0].station, h = e.lanes.map((x) => e.cards.filter((b) => b.laneId === x.id).length), C = c + Math.max(1, ...r ?? h) * i + 36, k = e.lanes.map((x, b) => ({
    x: p ? x.station.column * (o + t) : b * o,
    y: p ? x.station.row * C : 0
  }));
  return {
    points: k,
    width: Math.max(...k.map((x) => x.x)) + o,
    height: Math.max(...k.map((x, b) => x.y + c + (p ? Math.max(1, h[b]) : h[b] + 1) * i))
  };
}
function Ma() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function qn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function si(e) {
  const n = X(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Ks(e, n) {
  const t = si(e), r = qn(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), X(t);
}
function qs(e, n, t) {
  const r = si(e);
  return r.cards.push({
    id: qn(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), X(r);
}
function Na() {
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
function vr(e, n, t) {
  const r = X(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((k) => k.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= xo) throw new Error("A map can have up to five stations.");
  const i = Se(t?.label), c = Se(t?.outcome, 160), p = qn(r, "station");
  let h, C = 1 / 0;
  for (let k = 0; k < lo; k++)
    for (let x = 0; x < lo; x++) {
      if (r.lanes.some(($) => $.station.column === x && $.station.row === k)) continue;
      const b = Math.abs(o.station.column - x) + Math.abs(o.station.row - k);
      b < C && (C = b, h = { column: x, row: k });
    }
  if (!h) throw new Error("There is no free station position.");
  return o.station.next.push(p), r.lanes.push({ id: p, label: i, station: { ...h, next: [], outcome: c, ...t.image === void 0 ? {} : { image: Hr(t.image) } } }), r.presentationOrder?.push(p), r;
}
const _a = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, ho = (e) => "caption-" + e, gn = (e) => "column-" + e, xr = "rules-board";
function Jn(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function Ra(e, n) {
  const t = Jn(n);
  return t ? t + ":" + e : e;
}
const Q = {
  lane: kn,
  card: Ke,
  image: kt,
  caption: ho,
  column: gn,
  rules: xr,
  of(e) {
    const n = Jn(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(kn(r)),
      card: (r) => t(Ke(r)),
      image: (r) => t(kt(r)),
      caption: (r) => t(ho(r)),
      column: (r) => t(gn(r)),
      rules: t(xr)
    };
  }
};
function ai(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function li(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function yn(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function Ir(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function Ar(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((p, h) => p + Math.max(1, Math.ceil(h.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const di = 152, po = di + 12, Js = 12;
function Ys(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function We(e, n = {}) {
  const t = X(e), { pitch: r, row: o, top: i } = Kn, c = t.lanes.map((b) => t.cards.filter(($) => $.laneId === b.id).length), p = (b) => Math.max(c[b], (Array.isArray(n.rows) ? n.rows[b] : n.rows) ?? 0), h = !!t.lanes[0].station, C = t.lanes.some((b) => b.station?.image), k = Ys(n.layout, t.lanes.length), x = [];
  if (h) {
    const { points: b } = ii(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach(($, I) => x.push({
      laneId: $.id,
      x: b[I].x,
      y: b[I].y + (C ? $.station.row * po : 0),
      width: r,
      height: i + ($.station.image ? po : 0) + Math.max(1, p(I)) * o,
      column: $.station.column,
      row: $.station.row
    }));
  } else {
    let b = 0;
    for (let $ = 0; $ < t.lanes.length; $ += k) {
      const I = t.lanes.slice($, $ + k), L = i + (Math.max(...I.map((W, J) => p($ + J))) + 1) * o;
      I.forEach((W, J) => x.push({ laneId: W.id, x: J * r, y: b, width: r, height: L, column: J, row: $ / k })), b += L + Js;
    }
  }
  return { places: x, width: Math.max(...x.map((b) => b.x + b.width)), height: Math.max(...x.map((b) => b.y + b.height)) };
}
function Zs(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: c } = Kn, p = n.origin ?? { x: 0, y: 0 }, h = !!e.lanes[0].station, { places: C } = We(e, n), k = n.style ?? {}, x = k.textColor ?? Wn.fontColor, b = k.borderColor ?? Wn.borderColor, $ = k.borderWidth ?? Wn.borderWidth, I = k.cornerRadius ?? 0, L = k.fontSize ?? Wn.fontSize, W = k.laneFontSize ?? L + 2, J = k.captionFontSize ?? Math.max(11, L - 1), l = [], A = (v) => {
    const M = { options: {
      shapeHint: "rectangle",
      vectorPath: yn(v.width, v.height, I),
      foregroundColor: x,
      borderColor: b,
      borderWidth: $,
      ...k.fontFamily ? { fontFamily: k.fontFamily } : {},
      ...v
    }, relationships: { associations: [] } };
    return l.push(M), M;
  };
  e.lanes.forEach((v, M) => {
    const R = C[M], F = p.x + R.x, D = p.y + R.y, N = v.station?.image;
    A({
      id: gn(v.id),
      text: "",
      name: v.label,
      xPos: F + 2,
      yPos: D,
      width: t - 4,
      height: R.height,
      vectorPath: yn(t - 4, R.height, I ? I + 2 : 0),
      backgroundColor: h ? "#fcf9ed" : Ir(pn[M], 0.6),
      borderColor: h ? "#a8b5aa" : Ir(pn[M], 0.1),
      borderWidth: 1,
      ...h ? { borderStyle: "dashed" } : {}
    }), A({
      id: kn(v.id),
      text: v.label,
      name: v.label,
      xPos: F + 8,
      yPos: D + 6,
      width: r,
      height: 58,
      backgroundColor: pn[M],
      fontSize: Ar(v.label, W, r - 16, 50)
    });
    const U = h ? "" : Gs(e, v.id), ae = J, ee = h ? r : Math.min(r, Math.max(40, Math.ceil(U.length * ae * 0.6) + 24));
    A({
      id: ho(v.id),
      text: U,
      name: v.label,
      xPos: F + 8 + Math.round((r - ee) / 2),
      yPos: D + 68,
      width: ee,
      height: 22,
      vectorPath: yn(ee, 22, h ? 0 : 11),
      backgroundColor: h ? "transparent" : Us(e, v.id) ? pn[M % pn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: ae
    }), N && l.push({ options: {
      id: kt(v.id),
      name: N.alt,
      text: "",
      xPos: F + 8,
      yPos: D + c,
      width: r,
      height: di,
      shapeHint: "rectangle",
      image: N.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((ye) => ye.laneId === v.id).forEach((ye, In) => {
      const an = ni(e, ye), ne = h ? r - 20 : r, pe = h ? i - 6 : i, Je = h && !ye.free, se = Je ? {} : { ...k.card, ...ye.look }, Ye = Je ? I : k.card?.cornerRadius ?? I;
      A({
        id: Ke(ye.id),
        text: an,
        name: ye.label,
        xPos: F + (h ? 18 : 8),
        yPos: D + c + (N ? po : 0) + In * o,
        width: ne,
        height: pe,
        ...Ye !== I ? { vectorPath: yn(ne, pe, Ye) } : {},
        backgroundColor: Je ? "#ffda75" : se.backgroundColor ?? k.backgroundColor ?? Wn.backgroundColor,
        ...se.textColor ? { foregroundColor: se.textColor } : {},
        ...se.fontFamily ? { fontFamily: se.fontFamily } : {},
        ...se.borderColor ? { borderColor: se.borderColor } : {},
        ...se.borderWidth !== void 0 ? { borderWidth: se.borderWidth } : {},
        fontSize: Ar(an, se.fontSize ?? L, ne - 16, pe - 8)
      });
    });
  });
  const S = new Map(l.map((v) => [v.options.id, v]));
  for (const v of e.lanes)
    v.station && (S.get(gn(v.id)).relationships.associations = v.station.next.map((M) => ({
      id: v.id + "-to-" + M,
      parentId: gn(v.id),
      childId: gn(M),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const v of e.cards)
      for (const M of v.dependsOn ?? []) {
        const R = Ke(M), F = Ke(v.id);
        S.get(R).relationships.associations.push({
          id: `dependency-${M.length}-${M}-${v.id}`,
          parentId: R,
          childId: F,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (ai(l, Jn(n.scope)), n.beside) {
    const v = new Set(n.beside), M = new Set(l.map((D) => D.options.id)), R = /* @__PURE__ */ new Map();
    for (const D of [...M]) {
      if (!v.has(D)) continue;
      const N = li(D, (U) => v.has(U) || M.has(U));
      M.add(N), R.set(D, N);
    }
    const F = (D) => R.get(D) ?? D;
    for (const D of l) {
      D.options.id = F(D.options.id);
      for (const N of D.relationships.associations)
        N.parentId = F(N.parentId), N.childId = F(N.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: l };
}
function Wa(e, n, t = {}) {
  return e.behaviour ? ke().note(e, n, t) : null;
}
function Vs(e, n) {
  const t = X(e), r = Jn(n?.scope);
  if (n?.native) return Zs(t, n);
  const { width: o, row: i, height: c, top: p } = Kn, h = [];
  function C(I, L, W, J, l, A) {
    h.push({ options: {
      id: I,
      text: L,
      name: L,
      xPos: W,
      yPos: J,
      width: o,
      height: l,
      shapeHint: "rectangle",
      backgroundColor: A,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: k } = ii(t), x = 152, b = x + 12, $ = t.lanes.some((I) => I.station?.image);
  t.lanes.forEach((I, L) => {
    const W = k[L].x, J = k[L].y + ($ ? (I.station?.row ?? 0) * b : 0), l = I.station?.image, A = t.kind === "release-plan" ? I.label + `
` + (I.capacity ? on(t, I.id) + " / " + I.capacity + " points" : on(t, I.id) + " points") : I.label;
    C(kn(I.id), A, W, J, p - 12, pn[L]), l && h.push({ options: {
      id: kt(I.id),
      name: l.alt,
      text: "",
      xPos: W,
      yPos: J + p,
      width: o,
      height: x,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((S) => S.laneId === I.id).forEach((S, v) => C(Ke(S.id), ni(t, S), W, J + p + (l ? b : 0) + v * i, c, "#fffdf6"));
  });
  for (const I of t.lanes) {
    if (!I.station) continue;
    const L = h.find((W) => W.options.id === kn(I.id));
    L.relationships.associations = I.station.next.map((W) => ({ id: I.id + "-to-" + W, parentId: L.options.id, childId: kn(W), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), L.options.text = I.label + `
` + I.station.outcome, L.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const I = new Map(h.map((L) => [L.options.id, L]));
    for (const L of t.cards)
      for (const W of L.dependsOn ?? []) {
        const J = Ke(W), l = Ke(L.id);
        I.get(J).relationships.associations.push({
          id: `dependency-${W.length}-${W}-${L.id}`,
          parentId: J,
          childId: l,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return ai(h, r), { options: { name: t.title }, shareId: "", nodes: h };
}
function Xs(e, n = {}, t) {
  const r = X(e), o = n.narrow ? void 0 : n.width;
  if (oe(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: p, height: h } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(p, o ?? 0), height: h };
  }
  const { width: i, height: c } = We(r, {});
  return { width: Math.max(xo * Kn.pitch, i), height: c };
}
function Qs(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((c) => [c.x, c.y, c.width, c.height].every(Number.isFinite));
  for (let c = 0; c <= i.length; c++) {
    const p = i.find((h) => o < h.x + h.width + r && o + e.width > h.x - r && e.y < h.y + h.height + r && e.y + e.height > h.y - r);
    if (!p) break;
    o = t > 0 ? p.x + p.width + r : p.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const Fa = {
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
}, mo = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Co = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Da() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: mo.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: mo.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function ja() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Co.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function sn(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Co.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => mo.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function ea(e, n, t) {
  const r = sn(e), o = e.cards.find((c) => c.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const c = e.cards.find((p) => p.laneId === t);
    if (c) {
      if (!bt(e, c).some((p) => p.id === "interviews")) return null;
      i = co(e, c.id, "interviews");
    }
  }
  return bt(i, o).some((c) => c.id === t) ? co(i, n, t) : null;
}
function na(e, n) {
  if (sn(e) !== "experiment-budget") return null;
  const t = Co.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  cs as CHROME_CHIPS_MAX_SCALE,
  Er as CHROME_MAX_SCALE,
  Wn as DEFAULT_NOTE_STYLE,
  ds as DRAFT_TAG,
  Cr as WORKSHOP_BOARD_KINDS,
  ct as WorkshopReferenceError,
  vr as addWorkshopBranch,
  qs as addWorkshopCard,
  Ks as addWorkshopLane,
  Ae as applyWorkshopEdits,
  Ia as attachWorkshop,
  bt as availableLanes,
  Wa as behaviourNote,
  ar as boardBadgeShapes,
  _r as boardChromeBox,
  us as boardChromeLabel,
  Nr as boardChromeLayout,
  sr as boardChromeShapes,
  xa as boardChromeStyles,
  yo as boardLegend,
  As as businessBoardKinds,
  oe as businessKind,
  Xi as canHangPanel,
  Co as channels,
  Vi as checkWorkshopReplacement,
  he as chromeInk,
  Mr as chromeScaleAt,
  to as chromeTagScaleAt,
  ji as countWord,
  rs as createBoardLayer,
  ja as createBudgetWorkshop,
  Da as createInterviewWorkshop,
  Ma as createLaneWorkshop,
  Na as createWorkshopMap,
  Ca as decodeWorkshopFragment,
  va as describeFocusDarkroom,
  ma as describeWorkshopEdits,
  Sa as encodeWorkshopFragment,
  aa as handoffSummary,
  ya as hangGalleryPanel,
  Fa as industrialWorkshop,
  ba as initialFocusDarkroom,
  mo as interviews,
  zi as isRuleEdit,
  pn as laneColors,
  mn as layerInk,
  nn as listed,
  ot as listeningRoom,
  da as listeningRoomCaption,
  Bn as maxWorkshopCards,
  bn as maxWorkshopLines,
  wa as moonGallery,
  co as moveWorkshopCard,
  pa as named,
  qn as nextWorkshopId,
  _a as nightTransfer,
  ka as normalizeFocusDarkroom,
  la as normalizeListeningRoom,
  ga as normalizeMoonGallery,
  ra as normalizeOfflineHandoff,
  oa as offlineHandoff,
  ea as planStartupMove,
  Bi as pointing,
  Tr as printFields,
  ha as registerRulebook,
  ua as registerWorkshopRules,
  on as releaseLoad,
  ca as releasePlan,
  wn as renderLayerShapes,
  sa as resolveHandoff,
  Ps as resolveWorkshopSignals,
  ia as reviewHandoff,
  yn as roundedBox,
  ke as rulebook,
  Fi as rulebookLoaded,
  E as said,
  sn as startupExperienceKind,
  wo as unquoted,
  X as validateWorkshop,
  mt as workshopBoardKind,
  Jn as workshopBoardScope,
  na as workshopBudgetResult,
  tn as workshopCandidate,
  kr as workshopCardAsNote,
  ft as workshopCardAsNoteRefusal,
  At as workshopCardLabelOf,
  Bs as workshopCardLines,
  Gr as workshopCardLookOf,
  fo as workshopCardNoteText,
  yr as workshopCardNoteWords,
  ni as workshopCardText,
  wr as workshopDestinations,
  eo as workshopEditKinds,
  Xt as workshopFinder,
  Qs as workshopFreeSpot,
  La as workshopFreshOverride,
  Pa as workshopHardLimit,
  $a as workshopHasMarks,
  mr as workshopKeepsLink,
  ao as workshopKeepsPicture,
  Gs as workshopLaneCaption,
  Us as workshopLaneFull,
  qe as workshopLaneHeld,
  Oa as workshopLaneOverridden,
  We as workshopLanePlaces,
  ze as workshopLaneSpoken,
  Kn as workshopLayout,
  Hn as workshopLineRefusal,
  Vt as workshopLinesOf,
  Hs as workshopLinesSentence,
  rn as workshopNewCardName,
  oi as workshopNewLine,
  Q as workshopNodeIds,
  jn as workshopNoteCandidate,
  Br as workshopNoteIdOf,
  en as workshopNoteRefusal,
  Gn as workshopOverrideCandidate,
  Jr as workshopOverrideLine,
  _s as workshopOverrideMark,
  Ta as workshopOverrideUndone,
  ii as workshopPositions,
  vo as workshopPresentationLanes,
  Aa as workshopPresentationScenes,
  Ki as workshopReferences,
  Fe as workshopRefusal,
  hn as workshopRenamedLines,
  Xs as workshopReserve,
  tr as workshopRuleSchema,
  ve as workshopRules,
  fa as workshopRulesLoaded,
  Ra as workshopScopedId,
  Ea as workshopStampOverrides,
  li as workshopStandInId,
  Ws as workshopTakesLines,
  Zt as workshopTakesNotes,
  Vs as workshopToSlate,
  ht as workshopWithLine,
  zs as workshopWithoutCardLines,
  br as workshopWithoutLine
};
