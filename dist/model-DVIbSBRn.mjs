import { D as In } from "./NoteDefaults-1xFW0br8.mjs";
const Qs = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Xs(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: s, deskNote: f, fallback: g } = e, p = (L) => typeof L == "string" && L.trim().length > 0 && L.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(L);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !p(s) || !p(f) || !p(g) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: s.trim(), deskNote: f.trim(), fallback: g.trim() };
}
function ei(e) {
  return { ...e, stage: "review", choice: null };
}
function ni(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function ti(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Un = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function oi(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: s } = e, f = (g) => typeof g == "string" && g.trim().length > 0 && g.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(g);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !f(o) || !f(s) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: s.trim() };
}
function ri({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === Un.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === Un.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === Un.leftLabel && t === Un.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
function Ue(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function Zr(e) {
  const n = new Map(e.cards.map((f) => [f.id, f])), t = new Map(e.lanes.map((f, g) => [f.id, g])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function s(f) {
    if (!r.has(f.id)) {
      if (o.has(f.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(f.id);
      for (const g of f.dependsOn ?? []) {
        const p = n.get(g);
        if (!p) throw new Error("A release dependency refers to an unknown feature.");
        if (t.get(p.laneId) > t.get(f.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(p);
      }
      o.delete(f.id), r.add(f.id);
    }
  }
  for (const f of e.cards) s(f);
  for (const f of e.lanes) {
    if (f.station) throw new Error("Release windows cannot also be map stations.");
    if (Ue(e, f.id) > (f.capacity ?? 1 / 0)) throw new Error(`Release "${f.label}" exceeds its point budget.`);
  }
}
function En(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((k, I) => [k.id, I])), o = r.get(t);
  if (o === void 0) return null;
  const s = o < r.get(n.laneId), f = /* @__PURE__ */ new Set([n.id]), g = [n];
  for (; g.length; ) {
    const k = g.pop();
    for (const I of e.cards) {
      if (f.has(I.id)) continue;
      const C = r.get(I.laneId);
      (s ? C > o && k.dependsOn?.includes(I.id) : C < o && I.dependsOn?.includes(k.id)) && (f.add(I.id), g.push(I));
    }
  }
  if (e.cards.filter((k) => f.has(k.id)).some((k) => k.allowedLaneIds && !k.allowedLaneIds.includes(t))) return null;
  const L = { ...e, cards: e.cards.map((k) => f.has(k.id) ? { ...k, laneId: t } : k) }, A = e.lanes[o].capacity;
  return A !== void 0 && Ue(L, t) > A ? null : L;
}
const si = {
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
}, Gt = /* @__PURE__ */ new Map(), Vr = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function ii(e) {
  Gt.set(e.kind, e);
}
function ai(e) {
  return typeof e == "string" && Gt.has(e);
}
function ye(e) {
  const n = Gt.get(e);
  if (!n) throw new Error(`The ${Vr[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let nt = null;
function li(e) {
  nt = e;
}
function di() {
  return nt !== null;
}
function me() {
  if (!nt) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return nt;
}
const E = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Ge = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Ao = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Ut = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Kt = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ci = (e) => Ut(Kt(e)), Qr = [
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
], Xr = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Qr.indexOf(e.toLowerCase()), es = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Go(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const s = Ut(o);
    s && t.add(s);
  };
  r(e), r(Kt(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const kt = "[^\\p{L}\\p{N}]", Co = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Ao(n) + "(?:$|" + kt + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + kt + ")" + Ao(n) + "(?:$|" + kt + ")", "u").test(e)
], So = ["first", "second", "third", "fourth", "fifth"];
function ns(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + So.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Ut(Kt(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), s = o === "last" ? e.length - 1 : r[1] ? So.indexOf(o) : Xr(o) - 1;
  return e[s] ?? null;
}
function bt(e, n, t, r, o) {
  const s = Go(n, t);
  if (s.some((g) => es.test(g))) {
    const g = r && e.find((p) => p.id === r);
    return g ? { item: g, rank: 0 } : { pointing: !0 };
  }
  for (const g of s) {
    if (!g.startsWith("@")) continue;
    const p = e.find((L) => L.id === g.slice(1));
    if (p) return { item: p, rank: 0 };
  }
  for (const [g, p] of Co.entries())
    for (const L of s) {
      const A = e.filter((k) => p(k.label.toLowerCase(), L.toLowerCase()));
      if (A.length === 1) return { item: A[0], rank: g };
      if (A.length > 1) return { several: A };
    }
  const f = o ? ns(e, n, t) : null;
  return f ? { item: f, rank: Co.length } : {};
}
class Zn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function $t(e, n, t, r, o = !1) {
  return { find: (p) => {
    const L = bt(e, p, n, r, o);
    if (L.item) return L.item;
    const A = Go(p, n), k = A[A.length - 1];
    if (L.pointing) throw new Zn("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (L.several) {
      const C = [...new Set(L.several.map((b) => b.label))];
      throw new Zn(C.length === 1 ? L.several.length + " " + t + "s are called " + E(C[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + E(k) + ": " + Ge(C.slice(0, 6).map(E)) + ". Use the whole name.", "ambiguous", L.several.map((b) => b.id));
    }
    const I = e.map((C) => C.label);
    throw new Zn("There is no " + t + " called " + E(k) + " here." + (I.length && I.length <= 6 ? " The " + t + "s are " + Ge(I.map(E)) + "." : I.length ? "" : " There are no " + t + "s yet."), "unknown", e.map((C) => C.id));
  }, attempt: (p) => bt(e, p, n, r, o).item ?? null, rank: (p) => bt(e, p, n, r, o).rank ?? 1 / 0 };
}
const Uo = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Le = [...Uo], tn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Ko = Uo.slice(5);
function tt(e) {
  if (e.lanes[0]?.station) return "map";
  const n = le(e);
  return n || (e.kind === "release-plan" ? "release-plan" : qe(e) ?? "lanes");
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
}, Ot = {
  "launch-plan": W.launchLanes,
  pipeline: W.pipelineLanes,
  budget: W.budgetLanes,
  "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, ae = (e, n) => Object.fromEntries(Le.filter((t) => !e.includes(t)).map((t) => [t, n])), se = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), ne = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), oe = (e) => ({ type: "ref", of: "card", about: e }), vt = (e) => ({ map: e }), Se = ae(["map"], W.notMap), be = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), Et = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: se(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: ne("The lane or step."), label: se(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: oe("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Le,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: se(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...Ot }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: ne("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...Ot }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: ne("The lane or step it starts in."),
      label: se(80, "What the card says. Left out, the card is empty (on a map, the token is numbered); a launch plan, pipeline, budget, hiring plan or nest board needs it.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: be("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: be("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: be("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...Ko],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: oe("The card or token.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: oe("The card or token."), lane: ne("Where it goes.") },
    boards: Le,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: oe("The token.") },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: ne("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Le.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": W.launchLanes, budget: W.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: oe("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: tn,
    refusals: { ...vt(W.mapCardLanes), ...ae([...tn, "map"], W.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: oe("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...ae(["release-plan"], W.notPoints), map: W.mapPoints }
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
    refusals: { ...ae(["release-plan"], W.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: oe("The card."),
      lane: ne("The lane."),
      whenPresent: se(160, "What it says when the card is there."),
      whenAbsent: se(160, "What it says otherwise."),
      label: se(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: tn,
    refusals: { ...vt(W.mapOutcome), ...ae([...tn, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: oe("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: tn,
    refusals: { ...vt(W.mapOutcome), ...ae([...tn, "map"], W.businessCards) }
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
    fields: { lane: ne("The lane or step."), before: ne("Present it just before this one.", !0), after: ne("Present it just after this one.", !0) },
    boards: Le,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: ne("The step it follows."), label: se(80, "The new step’s name."), outcome: se(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: ne("The step it goes in front of."),
      from: ne("Only the path from this step is taken over.", !0),
      label: se(80, "The new step’s name."),
      outcome: se(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: ne("Where the path starts."), to: ne("Where it leads.") },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: ne("Where the path starts."), to: ne("Where it leads.") },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: ne("The step."), outcome: se(160, "What it says.") },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: ne("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: ne("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: ne("The step."), alt: se(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Se
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: oe("The card the line starts at."), to: oe("The card it points to."), label: se(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: Kn()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: oe("One card."), to: oe("The other card.") },
    boards: ["lanes"],
    refusals: Kn()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: oe("The card."),
      note: se(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: se(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: Kn()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: oe("The card."), note: se(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: Kn()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: oe("The task."), duration: be("Its days, 1 to 60.", 60, 1, !0), lag: be("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: be("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: oe("The deal or line item."), amount: be("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: ae(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: be("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: ae(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: ne("The team giving."), to: ne("The team receiving."), amount: be("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: ae(["budget"], W.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: be("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
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
      rule: se(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: ae(["lanes", "pipeline"], W.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: se(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: ae(["lanes", "pipeline"], W.noRules) }
];
function Kn() {
  return { ...ae(["lanes"], W.businessLines), "release-plan": W.lines, "customer-interviews": W.lines, "experiment-budget": W.lines, map: W.lines };
}
const ts = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", To = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, os = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function rs(e, n) {
  const t = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, r = (o, s) => s ? { anyOf: [o, { type: "null" }] } : o;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: e.min ?? 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...t, description: e.about };
    case "refs":
      return { ...r({ type: "array", items: t, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...r({ type: "integer", minimum: e.min, maximum: os(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: To.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...To.keys
      }, description: e.about };
  }
}
const qo = (e) => "optional" in e && e.optional === !0;
function ui(e) {
  const n = e ? tt(V(e)) : void 0;
  return Et.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, f]) => !qo(f)).map(([f]) => f)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([f, g]) => [f, rs(g, n)])) }
    }, s = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (s.accepted = t.boards.includes(n), s.accepted || (s.refusal = t.refusals[n])), s;
  });
}
const qn = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function ss(e, n) {
  const t = !!e.lanes[0]?.station, r = $t(e.lanes, t ? qn.step : qn.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = $t(e.cards, t ? qn.token : qn.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const s = e.cards.filter((g) => !g.free), f = (g) => s.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(g.trim()) ? s[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(g.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (g) => f(g) ?? o.find(g),
    attempt: (g) => f(g) ?? o.attempt(g),
    rank: (g) => f(g) ? 0 : o.rank(g)
  } };
}
class F {
  constructor(n, t, r = null, o, s, f) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = s, this.limits = f;
  }
}
function ot(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function K(e, n, t = null, r) {
  try {
    return V(e);
  } catch (o) {
    throw new F(ot(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function is(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const s = e[r];
    if (s === void 0) {
      if (qo(o)) continue;
      return n.kind + " needs " + r + ".";
    }
    const f = n.kind + " needs " + r + " as ";
    switch (o.type) {
      case "text":
        if (typeof s != "string") return f + "text.";
        break;
      case "ref":
        if (!t(s)) return f + "an id or a name.";
        break;
      case "refs":
        if (s === null && o.nullable) break;
        if (!Array.isArray(s) || s.length > o.max || !s.every(t)) return f + "a list of up to " + o.max + " ids or names" + (o.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (s === null && o.nullable) break;
        if (typeof s != "number" || !Number.isFinite(s)) return f + "a number" + (o.nullable ? " or null." : ".");
        break;
      case "image":
        if (s === null) break;
        if (!s || typeof s != "object" || typeof s.src != "string" || typeof s.alt != "string" || Object.keys(s).some((g) => g !== "src" && g !== "alt")) return f + "{src, alt} or null.";
        break;
      case "choice":
        if (!o.values.includes(s)) return f + o.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof s != "boolean") return f + "true or false.";
        break;
      case "rule":
        if (!s || typeof s != "object" || Array.isArray(s) || typeof s.kind != "string") return f + "an object with a kind.";
        break;
    }
  }
  return null;
}
function as(e, n, t, r, o) {
  const s = structuredClone(e), f = t === "map", g = t === "release-plan", p = ss(s, r), L = { lane: f ? "step" : "lane", card: f ? "token" : "card" };
  function A(l, v, x, S, $ = null) {
    if (typeof x == "object") {
      const D = l.find((J) => J.id === x.id);
      if (!D) throw new F("That " + S + " is no longer on the workshop.", "gone", $);
      return D;
    }
    const N = l.find((D) => D.id === x);
    if (N) return N;
    try {
      return v.find(x);
    } catch (D) {
      if (!(D instanceof Zn)) throw D;
      const J = D.reason === "ambiguous" ? "ambiguous_reference" : D.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new F(D.message, J, $, void 0, D.candidates.length ? D.candidates : void 0);
    }
  }
  const k = (l, v = null) => A(s.lanes, p.lanes, l, "lane", v), I = (l, v = null) => A(s.cards, p.cards, l, "card", v), C = (l) => {
    try {
      return k(l);
    } catch {
      return null;
    }
  }, b = (l, v, x = {}, S = !0) => ({ board: l, said: v, changed: S, ...x }), P = (l) => Ke(s, l), _ = (l) => f ? "The presentation opens with " + E(l[0].label) + "." : "The presentation now runs " + l.map((v) => E(v.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return me().edit(s, n, o, {
      lane: (l) => k(l),
      card: (l) => I(l),
      done: (l, v, x) => b(l, v, x),
      refuse: (l, v = {}) => {
        throw new F(l, v.code ?? "refused", v.laneId ?? null, v.cardId);
      }
    });
  if (Ko.includes(t)) {
    n.kind === "add_card" && Lo(n, t, k(n.lane).id);
    const l = {
      card: (x) => I(x),
      lane: (x) => k(x),
      refuse: (x, S = {}) => {
        throw new F(x, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (x, S = null, $) => K(x, t, S, $),
      done: (x, S, $) => b(x, S, $)
    }, v = ye(t).edit(s, n, l);
    if (v) return v;
  }
  switch (n.kind) {
    case "rename_workshop": {
      s.title = n.title;
      const l = K(s, t);
      return b(l, "Renamed the " + (f ? "map" : "workshop") + " to " + E(l.title) + ".");
    }
    case "rename_lane": {
      const l = k(n.lane), v = l.label;
      l.label = n.label;
      const x = K(s, t, l.id);
      return b(x, "Renamed " + E(v) + " to " + E(x.lanes.find((S) => S.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = I(n.card), v = l.label;
      l.label = n.label;
      const x = K(s, t, l.laneId, l.id);
      return b(x, "Renamed " + E(v) + " to " + E(x.cards.find((S) => S.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (s.lanes.length >= 5) throw new F("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new F("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = Hs(s, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new F(ot(x.message, t), "refused");
      }
      const v = l.lanes[l.lanes.length - 1];
      return b(l, "Added the lane " + E(v.label) + ".", { laneId: v.id });
    }
    case "remove_lane": {
      const l = k(n.lane), v = s.cards.filter((x) => x.laneId === l.id);
      if (f) {
        if (v.length) throw new F(E(v[0].label) + " is at " + E(l.label) + ". Move it to another step first.", "refused", l.id);
        if (s.lanes.length <= 2) throw new F("A map needs at least two steps.", "refused", l.id);
      } else {
        if (v.length) throw new F(E(l.label) + " holds " + v.length + (v.length === 1 ? " card" : " cards") + ". Move or remove " + (v.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (s.lanes.length <= 2) throw new F("A workshop needs at least two lanes.", "refused", l.id);
      }
      s.lanes = s.lanes.filter((x) => x !== l);
      for (const x of s.lanes) x.station && (x.station.next = x.station.next.filter((S) => S !== l.id));
      s.presentationOrder && (s.presentationOrder = s.presentationOrder.filter((x) => x !== l.id));
      for (const x of s.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((S) => S !== l.id));
      return Jn(s, (x) => x.laneId === l.id), s.behaviour && (s.behaviour = me().dropLane(s.behaviour, l.id)), b(K(s, t), "Removed the " + L.lane + " " + E(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = k(n.lane);
      if (f) {
        if (n.allowedLanes !== void 0) throw new F(W.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (s.cards.length >= 24) throw new F("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const R = _n(s, "card");
          s.cards.push({ id: R, label: lt(n.label?.trim() ?? ""), laneId: l.id, free: !0 });
          const U = K(s, t, l.id);
          return b(U, "Added " + (n.label?.trim() ? E(n.label.trim()) : "an empty card") + " to " + E(l.label) + ".", { laneId: l.id, cardId: R });
        }
        let $ = n.label;
        if ($ === void 0) {
          let R = s.cards.length + 1;
          for (; s.cards.some((U) => U.label === "Token " + R); ) R++;
          $ = "Token " + R;
        }
        const N = new Set([...s.lanes, ...s.cards].map((R) => R.id));
        let D = 1;
        for (; N.has("token-" + D); ) D++;
        s.cards.push({ id: "token-" + D, label: $, laneId: l.id });
        const J = K(s, t, l.id);
        return b(J, "Added " + E(J.cards[J.cards.length - 1].label) + " at " + E(l.label) + ".", { laneId: l.id, cardId: "token-" + D });
      }
      if (Lo(n, t, l.id), s.cards.length >= 24) throw new F("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && P(l.id) >= l.capacity)
        throw new F(E(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", l.id);
      const v = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => k($).id))];
      let x;
      try {
        x = Gs(s, l.id, { label: n.label?.trim() ?? "", ...v && { allowedLaneIds: v } });
      } catch ($) {
        throw new F(ot($.message, t), "refused", l.id);
      }
      const S = x.cards[x.cards.length - 1];
      return b(x, "Added " + (S.label ? E(S.label) : "an empty card") + " to " + E(l.label) + ".", { laneId: l.id, cardId: S.id });
    }
    case "remove_card": {
      const l = I(n.card);
      if (f && !l.free && s.cards.filter((v) => !v.free).length === 1) throw new F("A map needs at least one token.", "refused", l.laneId, l.id);
      if (g && s.cards.length === 1) throw new F("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && s.cards.length === 1) throw new F("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      s.cards = s.cards.filter((v) => v !== l);
      for (const v of s.cards)
        v.dependsOn?.includes(l.id) && (v.dependsOn = v.dependsOn.filter((x) => x !== l.id), v.dependsOn.length || delete v.dependsOn);
      return Jn(s, (v) => v.cardId === l.id), b(K(Bs(s, l.id), t, l.laneId), "Removed the " + L.card + " " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? s.lanes.find((S) => S.id === n.lane.id) ?? null : C(n.lane), v = I(n.card, l?.id ?? null), x = k(n.lane, v.laneId);
      return B(v, x);
    }
    case "advance_card": {
      const l = I(n.card), v = s.lanes.find((S) => S.id === l.laneId), x = v.station.next.map((S) => s.lanes.find(($) => $.id === S)).filter((S) => !!S);
      if (!x.length) throw new F(E(l.label) + " is at " + E(v.label) + ", and no path leads on from there.", "refused", v.id, l.id);
      if (x.length > 1)
        throw new F("From " + E(v.label) + " the path goes to " + x.map((S) => E(S.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + x[0].label + "”.", "refused", v.id, l.id);
      return B(l, x[0]);
    }
    case "set_lane_capacity": {
      const l = k(n.lane), v = s.behaviour && me().setLimit(s, l.id, n.capacity, o);
      if (typeof v == "string") throw new F(v, "refused", l.id);
      if (v) return b(v, E(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const x = f ? "token" : g ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, b(K(s, t, l.id), f ? "Removed the limit at " + E(l.label) + "." : E(l.label) + " now holds any number of " + x + "s.", { laneId: l.id });
      const S = g ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > S)
        throw new F((f ? "A step" : "A lane") + " can hold from 1 to " + S + " " + x + "s.", "refused", l.id);
      const $ = g ? s.cards.reduce((N, D) => N + (D.laneId === l.id ? D.points ?? 1 : 0), 0) : P(l.id);
      if ($ > n.capacity)
        throw new F(E(l.label) + " already holds " + $ + " " + x + ($ === 1 ? "" : "s") + ". Move some " + (f ? "on" : "out") + " first, or choose a higher " + (g ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, b(K(s, t, l.id), E(l.label) + " now holds up to " + n.capacity + " " + x + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = I(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, b(K(s, t, l.laneId, l.id), E(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const v = [...new Set(n.lanes.map((S) => k(S)))], x = s.lanes.find((S) => S.id === l.laneId);
      if (!v.includes(x)) throw new F(E(l.label) + " is in " + E(x.label) + " now. Include " + E(x.label) + ", or move the card first.", "refused", x.id, l.id);
      return l.allowedLaneIds = v.map((S) => S.id), b(K(s, t, l.laneId, l.id), E(l.label) + " can now go only in " + Ge(v.map((S) => E(S.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = I(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new F("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, b(K(s, t, l.laneId, l.id), E(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = I(n.card), v = [...new Set(n.dependsOn.map((S) => I(S)))], x = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const S = v.filter(($) => l.dependsOn?.includes($.id));
        if (!S.length) throw new F(E(l.label) + " does not depend on " + Ge(v.map(($) => E($.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter(($) => !S.some((N) => N.id === $)), l.dependsOn.length || delete l.dependsOn, b(K(s, t, l.laneId, l.id), E(l.label) + " no longer depends on " + Ge(S.map(($) => E($.label))) + ".", x);
      }
      if (!v.length) {
        if (n.mode === "add") throw new F("Name the features " + E(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, b(K(s, t, l.laneId, l.id), E(l.label) + " no longer depends on anything.", x);
      }
      if (v.includes(l)) throw new F("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...v.map((S) => S.id)])], b(K(s, t, l.laneId, l.id), E(l.label) + " now depends on " + Ge(v.map((S) => E(S.label))) + ".", x);
    }
    case "set_outcome": {
      const l = I(n.card), v = k(n.lane), x = s.signals ?? (s.signals = []), S = n.label, $ = S === void 0 ? x.filter((R) => R.cardId === l.id && R.laneId === v.id) : x.filter((R) => R.cardId === l.id && R.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && $.length > 1) throw new F("Two outcomes on this card have that name.", "refused", v.id, l.id);
      if (!$.length && x.length >= 24) throw new F("A workshop can have up to 24 outcomes. Remove one first.", "refused", v.id, l.id);
      let N = 1;
      for (; x.some((R) => R.id === "signal-" + N); ) N++;
      const J = { label: S ?? $[0]?.label ?? (l.label + " in " + v.label).slice(0, 80).trim(), cardId: l.id, laneId: v.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], J) : x.push({ id: "signal-" + N, ...J }), b(K(s, t, v.id, l.id), "When " + E(l.label) + " is in " + E(v.label) + " the workshop says " + E(n.whenPresent) + ". Otherwise it says " + E(n.whenAbsent) + ".", { laneId: v.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = I(n.card), v = (s.signals ?? []).filter((x) => x.cardId === l.id);
      if (n.outcome === void 0) {
        if (!v.length) throw new F(E(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        Jn(s, (x) => x.cardId === l.id);
      } else {
        const x = A(v, $t(v, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        Jn(s, (S) => S.id === x.id);
      }
      return b(K(s, t, l.laneId, l.id), "Removed the outcome from " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((v) => k(v));
      if (l.length !== s.lanes.length || new Set(l).size !== s.lanes.length) throw new F("Include each scene once in the presentation order.", "refused");
      return s.presentationOrder = l.map((v) => v.id), b(K(s, t), _(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new F("Say before or after, not both.", "invalid_edit");
      const l = k(n.lane), v = n.before ?? n.after, x = v === void 0 ? void 0 : k(v);
      if (x && x.id === l.id) throw new F("Choose two different scenes.", "refused", l.id);
      const S = Jt(s).filter(($) => $.id !== l.id);
      return S.splice(x ? S.findIndex(($) => $.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), s.presentationOrder = S.map(($) => $.id), b(K(s, t, l.id), _(S), { laneId: l.id });
    }
    case "add_station": {
      const l = k(n.from);
      let v;
      try {
        v = Do(s, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new F(S.message, "refused", l.id);
      }
      const x = v.lanes[v.lanes.length - 1];
      return b(v, "Added a path from " + E(l.label) + " to " + E(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const l = k(n.before), v = n.from === void 0 ? void 0 : k(n.from), x = v ? [v] : s.lanes.filter((N) => N.station.next.includes(l.id));
      if (v && !v.station.next.includes(l.id))
        throw new F("There is no path from " + E(v.label) + " to " + E(l.label) + ". Try “Add " + n.label + " after " + v.label + "”.", "refused", v.id);
      if (!x.length) throw new F("Nothing leads to " + E(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let S;
      try {
        S = Do(s, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (N) {
        throw new F(N.message, "refused", l.id);
      }
      const $ = S.lanes[S.lanes.length - 1];
      for (const N of S.lanes)
        x.some((D) => D.id === N.id) && (N.station.next = [...new Set(N.station.next.map((D) => D === l.id ? $.id : D))]);
      return $.station.next = [l.id], b(K(S, t, $.id), "Added " + E($.label) + " before " + E(l.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const l = k(n.from), v = k(n.to);
      if (l.id === v.id) throw new F("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(v.id) ? b(s, E(l.label) + " already leads to " + E(v.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(v.id), b(K(s, t, l.id), "Connected " + E(l.label) + " to " + E(v.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = k(n.from), v = k(n.to);
      if (!l.station.next.includes(v.id)) throw new F("There is no path between " + E(l.label) + " and " + E(v.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((x) => x !== v.id), b(K(s, t, l.id), "Removed the path from " + E(l.label) + " to " + E(v.label) + ".", { laneId: l.id });
    }
    case "set_station_outcome": {
      const l = k(n.station);
      return l.station.outcome = n.outcome, b(K(s, t, l.id), "Changed what happens at " + E(l.label) + ".", { laneId: l.id });
    }
    case "set_station_position": {
      const l = k(n.station);
      return Object.assign(l.station, { column: n.column, row: n.row }), b(K(s, t, l.id), "Moved " + E(l.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: l.id });
    }
    case "set_station_image": {
      const l = k(n.station);
      return n.image === null ? (delete l.station.image, b(K(s, t, l.id), "Removed the image at " + E(l.label) + ".", { laneId: l.id })) : (l.station.image = { src: n.image.src, alt: n.image.alt }, b(K(s, t, l.id), "Updated the image at " + E(l.label) + ".", { laneId: l.id }));
    }
    case "set_station_image_alt": {
      const l = k(n.station);
      if (!l.station.image) throw new F("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, b(K(s, t, l.id), "Updated the image description at " + E(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = I(n.card);
      let v = l.id, x, S;
      if (n.kind === "connect_cards") {
        const R = I(n.to, l.laneId);
        if (R.id === l.id) throw new F("A line joins two different cards.", "refused", l.laneId, l.id);
        x = R.id, S = E(R.label);
      } else {
        const R = n.note.trim();
        if (s.cards.some((U) => U.id === R) || s.lanes.some((U) => U.id === R))
          throw new F("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        x = R, S = "the note " + R, n.direction === "from_note" && ([v, x] = [x, v]);
      }
      const $ = gr(s, v, x, n.label ? { label: n.label } : {}), N = $n(s, $);
      if (N) throw new F(N, "refused", l.laneId, l.id);
      const D = Qn(s, $), J = v === l.id;
      return b(
        D,
        J ? "Drew a line from " + E(l.label) + " to " + S + "." : "Drew a line from " + S + " to " + E(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = I(n.card), v = n.kind === "disconnect_cards" ? I(n.to, l.laneId).id : n.note.trim(), x = n.kind === "disconnect_cards" ? E(s.cards.find((N) => N.id === v).label) : "the note " + v, S = (N) => N.parentId === l.id && N.childId === v || N.parentId === v && N.childId === l.id, $ = s.lines ?? [];
      return $.some(S) ? (s.lines = $.filter((N) => !S(N)), b(K(s, t, l.laneId, l.id), "Took away the line between " + E(l.label) + " and " + x + ".", { laneId: l.laneId, cardId: l.id })) : b(e, E(l.label) + " and " + x + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new F("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function B(l, v) {
    const x = { laneId: v.id, cardId: l.id };
    if (l.laneId === v.id)
      return b(e, E(l.label) + " is already " + (f ? "at " : "in ") + E(v.label) + ".", x, !1);
    const S = Ln(e, l.id, v.id);
    if (!S) throw new F(Pn(e, l.id, v.id) ?? "That move is not available.", "refused", v.id, l.id);
    return b(K(S, t, v.id, l.id), "Moved " + E(l.label) + " to " + E(v.label) + ".", x);
  }
}
function Lo(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new F(r === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", t);
}
function Jn(e, n) {
  e.signals && (e.signals = e.signals.filter((t) => !n(t)), e.signals.length || delete e.signals);
}
function rn(e, n, t = {}) {
  const r = (A) => ({ refused: { index: 0, kind: null, laneId: null, ...A } });
  let o;
  try {
    o = V(e);
  } catch (A) {
    return r({ reason: "The workshop cannot be read: " + (A instanceof Error ? A.message : String(A)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return r({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const s = o, f = [], g = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [A, k] of n.entries()) {
    const I = k?.kind, C = Et.find((v) => v.kind === I);
    if (!k || typeof k != "object" || !C)
      return r({
        index: A,
        kind: typeof I == "string" ? I : null,
        code: "invalid_edit",
        reason: "There is no edit called " + E(String(I)) + ". The edits are " + Ge(Et.map((v) => v.kind)) + "."
      });
    const b = is(k, C);
    if (b) return r({ index: A, kind: C.kind, code: "invalid_edit", reason: b });
    const P = tt(o);
    if (!C.boards.includes(P))
      return r({ index: A, kind: C.kind, code: "not_on_this_board", reason: C.refusals[P] ?? "This workshop does not take " + C.kind + "." });
    let _;
    try {
      _ = as(o, k, P, t.selection, g);
    } catch (v) {
      if (!(v instanceof F)) throw v;
      return r({
        index: A,
        kind: C.kind,
        reason: v.reason,
        code: v.code,
        laneId: v.laneId,
        ...v.cardId && { cardId: v.cardId },
        ...v.candidates && { candidates: v.candidates },
        ...v.limits && { limits: v.limits }
      });
    }
    const B = o.behaviour && !ts(C.kind) ? me().check(o, _.board) : null;
    if (B && "refused" in B)
      return r({ index: A, kind: C.kind, reason: B.refused.sentence, code: "refused", laneId: B.refused.laneId, cardId: B.refused.cardId });
    const l = cs(o, _.board);
    if (l) return r({ index: A, kind: C.kind, reason: l, code: "not_on_this_board", laneId: _.laneId ?? null });
    o = _.board, f.push({
      index: A,
      kind: C.kind,
      said: _.said,
      changed: _.changed ?? !0,
      ..._.laneId && { laneId: _.laneId },
      ..._.cardId && { cardId: _.cardId }
    });
  }
  const p = new Map(s.cards.map((A) => [A.id, A.laneId])), L = o.cards.flatMap((A) => {
    const k = p.get(A.id);
    return k === void 0 || k === A.laneId ? [] : [{ cardId: A.id, fromLaneId: k, toLaneId: A.laneId }];
  });
  return { workshop: o, report: { edits: f, movedCards: L } };
}
function ls(e, n) {
  const t = le(e);
  if (t === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const r = e.lanes.find((o) => {
      const s = n.lanes.find((f) => f.id === o.id);
      return o.role !== s.role || o.probability !== s.probability;
    });
    if (r) return `${r.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (t === "budget") {
    const r = e.budget, o = n.budget;
    if (!o || r.currency !== o.currency || r.step !== o.step) return "A budget keeps its currency and its step.";
    const s = ye(t).fixed?.(e, n);
    if (s) return s;
    const f = e.lanes.find((g) => {
      const p = n.lanes.find((L) => L.id === g.id);
      return g.floor !== p.floor || g.cap !== p.cap || g.capacity !== p.capacity;
    });
    if (f) return `${f.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? W.launchLanes : t && ye(t).fixed?.(e, n) || null;
}
const ds = {
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
function cs(e, n) {
  const t = V(e), r = tt(t);
  let o;
  try {
    o = V(n);
  } catch (p) {
    return ot(p instanceof Error ? p.message : String(p), r);
  }
  const s = tt(o), f = (p, L) => p.lanes.length === L.lanes.length && p.lanes.every((A) => L.lanes.some((k) => k.id === A.id)), g = (p, L) => p.lanes.every((A, k) => L.lanes[k]?.id === A.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && s !== r)
    return f(t, o) ? W.keepsCards : W.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !g(t, o)) return W.keepsOrder;
  if (le(t) && s === r && !(f(t, o) && g(t, o))) return Ot[r];
  if (le(t) && s === r) {
    const p = ls(t, o);
    if (p) return p;
  }
  if (r === "release-plan" && s === "release-plan") {
    if (!f(t, o)) return W.releaseLanes;
    if (!g(t, o)) return W.releaseOrder;
    if (o.cards.some((p) => !t.cards.some((L) => L.id === p.id))) return W.releaseCards;
  }
  return r !== s ? "This board is a " + ds[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? me().replacement(t, o) : null;
}
const fi = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function hi(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const t = [];
  for (const s of n.panels) {
    if (!s || typeof s.id != "string" || !/^[a-z][\w-]{0,31}$/.test(s.id) || typeof s.label != "string" || !s.label.trim() || s.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(s.artwork) || !(s.after === null || typeof s.after == "string")) return null;
    t.push({ id: s.id, label: s.label.trim(), artwork: s.artwork, after: s.after });
  }
  const r = new Map(t.map((s) => [s.id, s])), o = [...new Set(n.hung)];
  if (r.size !== t.length || o.length !== n.hung.length || o.some((s) => !r.has(s))) return null;
  for (const s of t) {
    const f = /* @__PURE__ */ new Set([s.id]);
    let g = s.after;
    for (; g !== null; ) {
      if (f.has(g) || !r.has(g) || o.includes(s.id) && !o.includes(g)) return null;
      f.add(g), g = r.get(g).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: t, hung: o };
}
function us(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function pi(e, n) {
  return us(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Jo = ["firstPrint", "secondPrint", "thirdPrint"], Yo = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function mi(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Yo, route: n.route };
  for (const r of Jo) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function wi(e = new URLSearchParams()) {
  const n = { ...Yo };
  for (const r of Jo) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function gi(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function fs(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = ms(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), ps(n), n;
}
function hs(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function ps(e) {
  return e && hs(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function xt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function An(e) {
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
function ms(e) {
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
function Yn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const sn = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, Nt = "http://www.w3.org/2000/svg", Po = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function Te(e, n, t) {
  const r = document.createElementNS(Nt, e);
  for (const [o, s] of Object.entries(n)) r.setAttribute(o, String(s));
  return t?.fill && (r.setAttribute("fill", Po(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", Po(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function $o(e, n, t, r, o) {
  const s = typeof document < "u" ? document.activeElement : null, f = s && e.contains(s) ? s.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const g = [];
  for (const p of n)
    if (p.t === "line")
      e.appendChild(Te("line", {
        x1: p.x1,
        y1: p.y1,
        x2: p.x2,
        y2: p.y2,
        "stroke-width": p.width ?? 1,
        ...p.dash ? { "stroke-dasharray": p.dash } : {}
      }, { stroke: p.color }));
    else if (p.t === "rect")
      e.appendChild(Te("rect", {
        x: p.x,
        y: p.y,
        width: Math.max(0, p.w),
        height: Math.max(0, p.h),
        rx: p.rx ?? 0,
        ...p.opacity !== void 0 ? { opacity: p.opacity } : {},
        ...p.role ? { "data-board-layer": p.role } : {}
      }, { fill: p.color }));
    else if (p.t === "text") {
      const L = Te("text", {
        x: p.x,
        y: p.y,
        "font-size": p.size ?? 13,
        "text-anchor": p.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...p.bold ? { "font-weight": 600 } : {},
        ...p.role ? { "data-board-layer": p.role } : {}
      }, { fill: p.color });
      p.lines && p.lines.length > 1 ? p.lines.forEach((A, k) => {
        const I = Te("tspan", { x: p.x, dy: k ? p.lineHeight ?? Math.round((p.size ?? 13) * 1.25) : 0 });
        I.textContent = k < p.lines.length - 1 ? A + " " : A, L.appendChild(I);
      }) : L.textContent = p.text, e.appendChild(L);
    } else {
      if (p.unlink && t) {
        const { cardId: L, waitsOn: A, label: k } = p.unlink, I = A + ">" + L, C = r?.armed === I, b = Te("path", {
          d: p.d,
          fill: "none",
          "stroke-width": p.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": I,
          "aria-label": C ? k + ". " + (p.unlink.armed ?? "Tap again to remove it") + "." : k,
          role: "button",
          tabindex: 0,
          ...C ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: C ? sn.refuse : "transparent" });
        let P = !1;
        b.addEventListener("pointerdown", (_) => {
          _.stopPropagation(), P = _.pointerType === "touch" || _.pointerType === "pen";
        }), b.addEventListener("click", (_) => {
          if (_.stopPropagation(), P && r && r.armed !== I) {
            r.arm(I);
            return;
          }
          r?.arm(null), t(L, A);
        }), b.addEventListener("keydown", (_) => {
          _.key !== "Enter" && _.key !== " " || (_.preventDefault(), _.stopPropagation(), t(L, A));
        }), b.addEventListener("focus", () => {
          b.style.setProperty("stroke", sn.accept), b.setAttribute("opacity", "0.35");
        }), b.addEventListener("blur", () => {
          C || (b.style.setProperty("stroke", "transparent"), b.removeAttribute("opacity"));
        }), e.appendChild(b), g.push(b);
      } else if (p.pick && o) {
        const { key: L, label: A } = p.pick, k = Te("path", {
          d: p.d,
          fill: "none",
          "stroke-width": p.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": L,
          "data-board-pick": "",
          "aria-label": A,
          role: "button",
          tabindex: 0
        }, { stroke: "transparent" });
        k.addEventListener("pointerdown", (I) => I.stopPropagation()), k.addEventListener("click", (I) => {
          I.stopPropagation(), o(L);
        }), k.addEventListener("keydown", (I) => {
          I.key !== "Enter" && I.key !== " " || (I.preventDefault(), I.stopPropagation(), o(L));
        }), k.addEventListener("focus", () => {
          k.style.setProperty("stroke", sn.accept), k.setAttribute("opacity", "0.35");
        }), k.addEventListener("blur", () => {
          k.style.setProperty("stroke", "transparent"), k.removeAttribute("opacity");
        }), e.appendChild(k), g.push(k);
      }
      if (e.appendChild(Te("path", { d: p.d, fill: "none", "stroke-width": p.width ?? 1.5, "pointer-events": "none" }, { stroke: p.color })), p.arrow) {
        const { x: L, y: A, angle: k } = p.arrow;
        e.appendChild(Te("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${L} ${A}) rotate(${k})`, "pointer-events": "none" }, { fill: p.color }));
      }
      if (p.unlink && r?.armed === p.unlink.waitsOn + ">" + p.unlink.cardId && p.arrow) {
        const L = Te("text", {
          x: p.arrow.x - 6,
          y: p.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: sn.refuse });
        L.textContent = p.unlink.armed ?? "Tap again to remove this link", e.appendChild(L);
      }
    }
  f && g.find((p) => p.getAttribute("data-board-link") === f)?.focus({ preventScroll: !0 });
}
function ws(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(Nt, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(Nt, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let s = !1, f = null, g;
  const p = {
    armed: null,
    arm(A) {
      clearTimeout(g), p.armed = A, A && (g = setTimeout(() => p.arm(null), 5e3), f?.[2].announce?.(f[2].boardFocused && f[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), f && L.draw(...f);
    }
  }, L = {
    draw(A, k, I) {
      if (s || !t) return;
      f = [A, k, I];
      const { origin: C } = I, b = n(k ?? A, I, A), P = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o]) l.setAttribute("transform", `translate(${C.x} ${C.y})`);
      $o(r, b.filter((l) => !P(l)), I.onUnlink, p, I.onPick), $o(o, b.filter(P));
      const _ = I.above && I.above.parentNode === t ? I.above : null, B = _ ? _.nextSibling : t.firstChild;
      (r.parentNode !== t || r.previousSibling !== _) && t.insertBefore(r, B === r ? r.nextSibling : B), o.firstChild && t.lastChild !== o ? t.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
    },
    destroy() {
      s = !0, clearTimeout(g), r.remove(), o.remove();
    }
  };
  return L;
}
const Mt = "handle-_link-", _t = "handle-_route-", On = 40, Zo = 44;
function It(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(On, Math.ceil(Zo / n)));
}
function Vo(e) {
  if (e.startsWith(Mt)) return { kind: "link", from: e.slice(Mt.length) };
  if (e.startsWith(_t)) {
    const [n, t] = e.slice(_t.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const Qo = (e) => !!e.lanes[0]?.station, Ne = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function qt(e) {
  const { places: n } = Ee(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function Oo(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, s = n.x - r, f = n.y - o, g = s ? e.width / 2 / Math.abs(s) : 1 / 0, p = f ? e.height / 2 / Math.abs(f) : 1 / 0, L = Math.min(g, p), A = Math.hypot(s, f) || 1;
  return { x: r + s * L + s / A * t, y: o + f * L + f / A * t };
}
function Xo(e) {
  if (!Qo(e)) return [];
  const n = qt(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const s of r.station.next) {
        const f = n.get(s);
        if (!f) continue;
        const g = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, p = { x: f.x + f.width / 2, y: f.y + f.height / 2 }, L = Oo(o, p, -8), A = Oo(f, g, -8);
        t.push({ key: r.id + ">" + s, from: r.id, to: s, x1: L.x, y1: L.y, x2: A.x, y2: A.y });
      }
  }
  return t;
}
function gs(e, n) {
  for (const [t, r] of qt(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function er(e, n, t = On) {
  if (!Qo(e)) return [];
  const r = qt(e), o = t / On, s = (g, p, L, A, k) => ({ options: {
    id: g,
    name: A,
    text: k ? "+" : "",
    xPos: n.x + p - t / 2,
    yPos: n.y + L - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: et(t, t, t / 2),
    backgroundColor: k ? "#2f5fd0" : "#fffef8",
    foregroundColor: k ? "#ffffff" : "#2f5fd0",
    borderColor: k ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), f = [];
  for (const g of e.lanes) {
    const p = r.get(g.id);
    p && f.push(s(Mt + g.id, p.x + p.width, p.y + p.height, "Draw a path from " + g.label, !0));
  }
  for (const g of Xo(e))
    f.push(s(_t + g.from + "~" + g.to, g.x2, g.y2, "End of the path from " + Ne(e, g.from) + " to " + Ne(e, g.to), !1));
  return f;
}
function ys(e, n) {
  const t = Vo(n);
  return t ? t.kind === "link" ? `Draw a path from ${Ne(e, t.from)}: drag it onto another step.` : `End of the path from ${Ne(e, t.from)} to ${Ne(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function ks(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((f) => f.id === n.from);
  if (!r?.station || !e.lanes.some((f) => f.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${Ne(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((f) => f !== n.to) : r.station.next, s = e.lanes.map((f) => f.id === r.id ? { ...f, station: { ...f.station, next: [...o, t] } } : f);
  return { next: { ...e, lanes: s } };
}
function bs(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const s = e.lanes.find((g) => g.id === o.id)?.station?.next ?? [], f = o.station?.next ?? [];
    for (const g of s) f.includes(g) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: g } });
    for (const g of f) s.includes(g) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: g } });
  }
  return [...t, ...r];
}
function vs(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? On, s = Math.max(24, o * Zo / On);
  for (const f of Xo(e)) {
    const g = Ne(e, f.from) + " to " + Ne(e, f.to), p = `M ${f.x1} ${f.y1} L ${f.x2} ${f.y2}`, L = !r && n.picked === f.key;
    t.push(r ? { t: "path", d: p, color: "transparent", width: 3, hit: s, unlink: { cardId: f.to, waitsOn: f.from, label: "Remove the path from " + g, armed: "Tap again to remove this path" } } : { t: "path", d: p, color: L ? sn.accept : "transparent", width: L ? 5 : 3, hit: s, pick: { key: f.key, label: "Path from " + g + (L ? ", selected" : "") } });
  }
  if (n.clamp) {
    const f = er(e, { x: 0, y: 0 }, o).find((L) => L.options.id === n.clamp.name)?.options, g = f ? f.xPos + o + 6 : 0, p = f ? f.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: g, y: p, text: n.clamp.text, color: sn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
const Eo = "#1f7a5c", No = "#5b9a85", At = "#c2410c", xs = "#2f5fd0", Is = {
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
}, As = { canMove: !1, canSelect: !1 }, Ct = "A card's line joins notes and cards on its own board.", Cn = /* @__PURE__ */ new WeakMap();
function Cs(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function yi(e, n, t = {}) {
  const r = Rn(t.scope);
  let o = V(n);
  const s = t.kit, f = (i) => !!le(i) && !s;
  if (f(o) && !t.readOnly) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const g = s?.layer(e) ?? (o.lanes[0]?.station ? ws(e, vs) : void 0);
  let p = null, L = /* @__PURE__ */ new Set(), A = null, k = null, I = !!t.readOnly, C = I || f(o), b = !1;
  const P = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  let x = null, S = null, $ = null, N = null;
  const D = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
  let R = null, U = null;
  function he(i, a) {
    U && clearTimeout(U.timer), U = { name: i, reason: a, timer: setTimeout(() => {
      U = null, b || j(k ?? o);
    }, 3e3) };
  }
  let xe = Promise.resolve(), _e = null, ee = Mo(t.layout), Ie = ee;
  const $e = { ...t.style };
  let te = /* @__PURE__ */ new Map(), Je = /* @__PURE__ */ new Set(), Qt = null, Ae = !1, fn = It(1), Wn = null, hn = null, Re = null, Fn = !1;
  const ue = /* @__PURE__ */ new Map();
  De(o);
  const Y = t.origin ? { x: t.origin.x, y: t.origin.y } : Ts(e), jn = r ? r + ":" : "", pe = (i) => v.get(i) ?? (jn ? i.startsWith(jn) ? i.slice(jn.length) : null : i), de = (i) => {
    const a = pe(i);
    return a === null ? null : Cs(a);
  };
  function ie(i) {
    const a = l.get(i);
    if (a) return a;
    const d = jn + i;
    if (P.has(d) && !v.has(d) || !e.nodes.one?.(d)) return d;
    const c = vr(d, (m) => !!e.nodes.one?.(m) || v.has(m));
    return l.set(i, c), v.set(c, i), console.warn(`WORKSHOP: the slate already has a note named "${d}". It stays the slate's own; the workshop draws its note as "${c}".`), c;
  }
  function pn(i, a = 1) {
    let d = [];
    try {
      d = t.avoid?.() ?? [];
    } catch (c) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", c);
    }
    return d.length ? Js(i, d, a) : { x: i.x, y: i.y };
  }
  function Sr(i) {
    if (!i?.dayWidth) return i;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (u) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", u);
    }
    const { width: d, height: c } = s ? s.places(o, ee) : De(o);
    let m = 1 / 0;
    for (const u of a)
      [u.x, u.y, u.width, u.height].every(Number.isFinite) && u.x >= Y.x + d && u.y < Y.y + c && u.y + u.height > Y.y && (m = Math.min(m, u.x - 32 - Y.x));
    return Number.isFinite(m) ? { ...i, maxWidth: m } : i;
  }
  function Tr(i) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (d) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", d);
    }
    return a.some((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite) && i.x < d.x + d.width && i.x + i.width > d.x && i.y < d.y + d.height && i.y + i.height > d.y);
  }
  function Lr(i, a) {
    const d = [...Cn.get(e) ?? []].filter((h) => h !== ut);
    if (!d.length) return null;
    const { id: c, note: m } = ho(i, a), u = { id: c, options: m }, w = Pt(o, i).some((h) => o.cards.some((y) => y.id !== i && (y.id === h.parentId || y.id === h.childId)));
    for (const h of d) {
      let y = null;
      try {
        y = h.verdict(u, a);
      } catch (O) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", O);
      }
      if (y) return { board: h, ...y, reason: w ? Ct : y.reason };
    }
    return null;
  }
  function Pr(i, a, d, c) {
    const { added: m, answer: u } = Bn(a, d, "", !0), w = pn(d), h = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let y;
      try {
        y = i.take(m, c, w);
      } catch (M) {
        console.warn("WORKSHOP: another board could not take the card", M);
      }
      if (y === "taken") return;
      const O = Math.round(w.x), T = Math.round(w.y);
      m.position?.(O, T, () => e.updateSelectionResizeRotate?.(), void 0, Yn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [xt({ ...m.options, x: O, y: T })] });
    };
    !u || typeof u.then != "function" ? h() : u.then((y) => {
      y === !0 && !b && h();
    }, () => {
    });
  }
  const ke = {
    governs(i) {
      if (P.get(i.id) !== i) return null;
      const a = de(i.id)?.kind;
      return a === "card" ? { canMove: !C, canEditText: !C && !k && o.kind !== "release-plan", canConnect: kn() } : a === "lane" ? { canMove: !1, canEditText: !C && !k } : a === "handle" ? { canMove: !C && !k, canEditText: !1, ...!ee.narrow && { cursor: s ? "ew-resize" : "grab" } } : As;
    },
    onStart(i, a) {
      const d = de(i.id), c = { x: a.x - (i.options.x ?? 0), y: a.y - (i.options.y ?? 0) };
      if (d.kind === "handle") {
        const w = C || k ? null : s ? s.handleDrag(o, pe(i.id), c, ee) : Jr(pe(i.id));
        return w ? (re(), Fe(), U && (clearTimeout(U.timer), U = null), A = { name: pe(i.id), follow: w, last: null }, !0) : !1;
      }
      const m = d.key;
      if (C || k || !o.cards.some((w) => w.id === m)) return !1;
      re(), Fe();
      let u = null;
      try {
        u = (s?.chooser ?? t.chooseCandidate)?.(o, m, c, ee) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return x = { cardId: m, evaluate: u, grab: c, outcome: { kind: "home" } }, j(o, { skip: m }), !0;
    },
    onMove(i, a) {
      if (A) {
        A.last = A.follow(en(a)), j(A.last.next, { grip: A.name, layout: Sr(A.last.layout) }), H(t.onPreview, A.last.next === o ? null : A.last.next);
        return;
      }
      if (!x) return;
      const d = oo(x.cardId, a, x.evaluate);
      if (Ss(d, x.outcome)) return;
      x.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      j(c ?? o, { skip: x.cardId }), H(t.onPreview, c);
    },
    onEnd(i, a) {
      if (A) {
        const { follow: w, name: h } = A, y = w(en(a));
        A = null, H(t.onPreview, null), y.refusal ? (he(h, y.refusal), j(o), e.announce?.(y.refusal), H(t.onRefuse, { laneId: null, reason: y.refusal })) : Gn(y.next, {}) || j(o);
        const O = yt(o, pe(i.id));
        return O ? { accept: !0, settle: O } : { accept: !1 };
      }
      if (!x) return { accept: !1 };
      const { cardId: d, evaluate: c } = x, m = oo(d, a, c), u = o.cards.find((w) => w.id === d);
      if (x = null, H(t.onPreview, null), m.kind === "candidate" && s) {
        if (!Gn(m.next, { cardId: d, laneId: m.laneId }, d))
          return j(o, { skip: d }), { accept: !1 };
        m.said && (he("card-" + d, m.said), e.announce?.(m.said));
        const w = yt(o, pe(i.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, j(o, { skip: d });
        const w = o.lanes.find((y) => y.id === m.laneId);
        e.announce?.(`${Q(u)} moved to ${w.label}. ${Pe(o, w.id)}.`), H(t.onChange, o, { cardId: d, laneId: m.laneId });
        const h = yt(o, pe(i.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (m.kind === "refused")
        Gr(Q(u), { cardId: d, laneId: m.laneId, reason: m.reason }), m.near && he("card-" + d, m.reason);
      else if (m.kind === "outside" && Tt() && !Ze()) {
        const w = Vn(o, d);
        if (!w) {
          const h = { x: i.options.x ?? 0, y: i.options.y ?? 0, width: i.options.width ?? 228, height: i.options.height ?? 76 }, y = Lr(d, a);
          if (y?.reason)
            return j(o, { skip: d }), y.board.flash(y.laneId, y.reason), e.announce?.(`${Q(u)} can't go in ${y.laneLabel}. ${y.reason} It stays where it was.`), H(t.onRefuse, { cardId: d, laneId: null, reason: y.reason }), { accept: !1 };
          if (y)
            return Pr(y.board, d, h, a), { accept: !0 };
          const O = Tr(h);
          return Bn(d, O ? pn(h) : h, O ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        j(o, { skip: d }), e.announce?.(w), H(t.onRefuse, { cardId: d, laneId: null, reason: w });
      } else
        j(o, { skip: d }), m.kind === "outside" && (e.announce?.(`${Q(u)} was not dropped on a lane. It stays where it was.`), H(t.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (A) {
        A = null, H(t.onPreview, null), j(o);
        return;
      }
      const a = x && o.cards.find((d) => d.id === x.cardId);
      x = null, H(t.onPreview, null), j(o, { skip: de(i.id)?.key }), a && e.announce?.(`Move cancelled. ${Q(a)} stays where it was.`);
    },
    onTextCommit(i, a, d) {
      const c = de(i.id);
      if (!c || C || k) return !1;
      let m = a.replace(/\s+/g, " ").trim();
      const u = [], w = le(o), h = w && c.kind === "card" ? ye(w).renamed(o, c.key, m) : null;
      h && (m = h.label, u.push(...h.edits));
      const y = c.kind === "lane" ? { laneId: c.key, label: m } : { cardId: c.key, label: m };
      u.unshift(c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: m } : { kind: "rename_card", card: { id: c.key }, label: m });
      const O = rn(o, u);
      if ("refused" in O) {
        const { reason: T } = O.refused;
        return e.announce?.(`${d} keeps its name. ${T}`), H(t.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: y, reason: T }), !1;
      }
      return JSON.stringify(O.workshop) === JSON.stringify(o) ? (j(o), !1) : (o = O.workshop, j(o), e.announce?.(h ? O.report.edits.map((T) => T.said).join(" ") : `${d} renamed to ${m}.`), H(t.onChange, o, { rename: y, ...s ? { edits: u } : {} }), h ? !1 : m);
    },
    onKeyDown(i, a) {
      const d = de(i.id);
      if (C || k || x || A || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if ($ && ($.node !== i.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== $.key) && so(), $ && a.key === "Escape")
        return a.preventDefault(), so(), e.announce?.("Cancelled. Nothing changed."), !0;
      if ($ && a.key === "Enter") {
        a.preventDefault();
        const w = $.choices[$.at];
        return $ = null, H(t.onPreview, null), o = w.next, j(o), e.announce?.(w.done), H(t.onChange, o, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: w.edits }), !0;
      }
      const c = s?.keyChoices?.(o, pe(i.id), a.key);
      if (c) {
        a.preventDefault();
        const w = [], h = [];
        for (const T of typeof c == "string" ? [] : c) {
          const M = rn(o, T.edits);
          "refused" in M ? h.push(`${T.said}: ${M.refused.reason}`) : w.push({ ...T, next: M.workshop, done: M.report.edits.map((z) => z.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof c == "string" ? c : h.join(" ")), !0;
        const y = $ && $.node === i.id ? ($.at + 1) % w.length : 0;
        $ = { node: i.id, key: a.key.toLowerCase(), choices: w, at: y }, j(w[y].next), H(t.onPreview, w[y].next);
        const O = w.length > 1 ? ` (${y + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[y].said}${O} Enter to make it, Escape to cancel.`), !0;
      }
      const m = s?.keyEdit?.(o, pe(i.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = rn(o, m);
        return "refused" in w ? (e.announce?.(w.refused.reason), H(t.onRefuse, { laneId: w.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: w.refused.reason })) : Gn(w.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = o.cards.find((w) => w.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), ro(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Er())
        return a.preventDefault(), ro(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (S?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: h, spot: y } = S;
        if (S = null, w === null)
          return H(t.onPreview, null), Bn(u.id, y), !0;
        const O = o;
        o = h, j(o), We(w), H(t.onPreview, null);
        const T = o.lanes.find((M) => M.id === w);
        return e.announce?.(`${Q(u)} moved to ${T.label}. ${Pe(o, w)}.`), H(t.onChange, o, { cardId: u.id, laneId: w, ...s ? { edits: s.editsBetween(O, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Fe(), e.announce?.(`Move cancelled. ${Q(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((a) => P.get(a.id) === a).map((a) => a.id);
      Fn = i.length === 1, P.clear(), _.clear(), B.clear(), ue.clear(), l.clear(), v.clear(), x = null, S = null, j(k ?? o, { animate: !1 }), i.length === 1 && (xe = xe.then(() => {
        Fn = !1;
        const a = P.get(i[0]);
        if (!b && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        Ye();
      }));
    }
  };
  ke.onFreeMove = (i, a) => {
    if (!mn() || i.options?.isComment) return ft();
    const d = wn(a), c = gn(i), m = yn(i), u = o.lanes.filter((y) => !m && He(o, y.id, c) === null).map((y) => y.id), w = d && s?.noteUnder?.(o, en(a), ee);
    w && (c.under = w);
    const h = d ? m ?? He(o, d, c) : null;
    N && N.noteId === i.id && N.laneId === d && N.refusal === h || (N = { noteId: i.id, laneId: d, refusal: h, open: u }, Ce());
  }, ke.onFreeDrop = (i, a, d) => {
    if (ft(), !mn() || i.options?.isComment) return;
    const c = wn(a);
    if (!c) return;
    const m = gn(i), u = s?.noteUnder?.(o, en(a), ee);
    u && (m.under = u);
    const w = o.lanes.find((y) => y.id === c), h = yn(i) ?? He(o, c, m);
    return h ? (re(!1), R = { laneId: c, reason: h, timer: setTimeout(() => re(), 1500) }, Ce(), e.announce?.(`${ht(m.label)} can't go in ${w.label}. ${h}`), H(t.onRefuse, { noteId: i.id, laneId: c, reason: h }), "refused") : (wt([{ node: i, offer: m, from: d }], c), "taken");
  }, ke.onFreeGroupDrop = (i, a, d) => {
    if (ft(), !mn() || i.some((h) => h.options?.isComment)) return;
    const c = wn(a);
    if (!c) return;
    const m = o.lanes.find((h) => h.id === c), u = i.map((h) => ({ node: h, offer: gn(h) })), w = _r(u, c);
    if (w) {
      re(!1), R = { laneId: c, reason: w, timer: setTimeout(() => re(), 1500) }, Ce(), e.announce?.(`${io(u.map((h) => ht(h.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: h } of u) H(t.onRefuse, { noteId: h.id, laneId: c, reason: w });
      return "refused";
    }
    return wt(u.map((h, y) => ({ ...h, from: d?.[y] })), c), "taken";
  }, ke.onFreeTextCommit = (i) => {
    if (!mn() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const a = i.options ?? {}, d = wn({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = gn(i), m = o.lanes.find((T) => T.id === d), u = yn(i) ?? He(o, d, c);
    if (!u) {
      wt([{ node: i, offer: c }], d);
      return;
    }
    re(!1), R = { laneId: d, reason: u, timer: setTimeout(() => re(), 1500) }, Ce(), e.announce?.(`${ht(c.label)} can't go in ${m.label}. ${u} It is beside the board.`), H(t.onRefuse, { noteId: i.id, laneId: d, reason: u });
    const { width: w } = De(o), h = pn({ x: Y.x + w + 32, y: a.y ?? Y.y, width: a.width ?? 0, height: a.height ?? 0 }), y = Math.round(h.x), O = Math.round(h.y);
    i.position(y, O, () => e.updateSelectionResizeRotate?.(), void 0, Yn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [xt({ ...i.options, x: y, y: O })] });
  }, ke.undoState = () => ({ cards: o.cards.map((i) => ({ ...i })), pairs: [...D], lines: (o.lines ?? []).map((i) => ({ ...i })) }), ke.onUndoRestore = (i, a) => {
    if (b) return;
    const d = new Map((i?.cards ?? []).map((u) => [u.id, u])), c = new Map(i?.pairs ?? []), m = (u) => D.get(u) ?? c.get(u) ?? u;
    for (const u of a.added) {
      const w = m(u), h = o.cards.find((O) => O.id === w);
      if (!h || d.has(w)) continue;
      o = V({ ...o, cards: o.cards.filter((O) => O !== h), lines: on(o.lines, w, u) }), j(o);
      const y = H(t.onChange, o, { cardId: w, cardToNote: { noteId: u }, via: "undo" });
      e.holdTrade?.(u, y), St(y);
    }
    for (const u of a.removed) {
      const w = m(u), h = d.get(w);
      if (!h || o.cards.some((G) => G.id === w)) continue;
      const y = (i?.lines ?? []).filter((G) => G.parentId === w || G.childId === w), O = Lt(o, h), T = {
        id: w,
        label: O,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...y.length ? { lines: y } : {}
      }, M = [h.laneId, ...o.lanes.map((G) => G.id)].find((G) => Sn(o, G, T));
      if (!M) {
        e.announce?.(`${Q(h)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = Br(Sn(o, M, T), w, i?.cards ?? []), w !== u && D.set(u, w), j(o);
      const z = o.cards.findIndex((G) => G.id === w), Z = o.cards.slice(z + 1).find((G) => G.laneId === M)?.id, q = H(t.onChange, o, { cardId: w, laneId: M, noteToCard: {
        noteId: u,
        label: O,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...Z ? { before: Z } : {},
        ...y.length ? { lines: on(y, w, u) } : {}
      }, via: "undo" });
      e.holdTrade?.(u, q), St(q);
    }
    Array.isArray(i?.lines) && zr(i.lines);
  };
  let ct = !1;
  ke.onNodeAdded = (i) => {
    b || ct || P.get(i.id) === i || (o.lines ?? []).some((a) => a.parentId === i.id || a.childId === i.id) && (ct = !0, queueMicrotask(() => {
      ct = !1, b || Ce();
    }));
  }, ke.onLine = (i, a) => {
    b || queueMicrotask(() => {
      b || jr(i, a);
    });
  };
  const $r = e.setDragPolicy(ke), ut = {
    verdict(i, a) {
      if (!mn()) return null;
      const d = wn(a);
      if (!d) return null;
      const c = gn(i), m = s?.noteUnder?.(o, en(a), ee);
      return m && (c.under = m), { laneId: d, laneLabel: o.lanes.find((u) => u.id === d).label, reason: yn(i) ?? He(o, d, c) };
    },
    take: (i, a, d) => ke.onFreeDrop?.(i, a, d),
    flash(i, a) {
      b || !o.lanes.some((d) => d.id === i) || (re(!1), R = { laneId: i, reason: a, timer: setTimeout(() => re(), 1500) }, Ce());
    }
  };
  Cn.has(e) || Cn.set(e, /* @__PURE__ */ new Set()), Cn.get(e).add(ut);
  const Or = t.onSelect || g ? e.onSelectionChange?.(() => {
    Ye(), ko();
  }) : void 0;
  let Dn = null;
  const Xt = (i) => {
    const d = i.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, c = d && P.has(d) ? go(d) : null;
    c !== Dn && (Dn = c, ko());
  };
  g && e.element?.addEventListener?.("pointerover", Xt);
  const eo = (i) => {
    if (S && Fe(), p && !i?.target?.closest?.("[data-board-pick]") && (p = null, we && Xe(we), queueMicrotask(Ye)), hn = null, Re && (clearTimeout(Re), Re = null), !i || b || typeof e.clientToWorld != "function" || typeof i.button == "number" && i.button !== 0 || i.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((u) => ie(X.lane(u.id))));
    if ((e.getSelectedNodes?.() ?? []).some((u) => !a.has(u?.id))) return;
    const d = o.lanes.flatMap((u) => [X.caption(u.id), X.column(u.id)]).map((u) => P.get(ie(u))).filter(Boolean), c = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: i.clientX, y: i.clientY }), d, { padding: 0 }) : null, m = c ? de(c.id) : null;
    m && (hn = { pointerId: i.pointerId, laneId: m.key, x: i.clientX, y: i.clientY });
  }, no = (i) => {
    const a = hn;
    hn = null, !(!a || i.pointerId !== a.pointerId || Math.hypot(i.clientX - a.x, i.clientY - a.y) > 6) && (Re = setTimeout(() => {
      if (Re = null, b || x || A || !o.lanes.some((c) => c.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = P.get(ie(X.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, to = () => {
    hn = null;
  };
  e.element?.addEventListener?.("pointerdown", eo, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", no, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", to, !0), j(o, { animate: !1 });
  function oo(i, a, d) {
    const c = o.cards.find((T) => T.id === i);
    if (!c) return { kind: "outside" };
    if (s) {
      const T = en(a), M = s.refusalAt(o, i, x?.grab ?? { x: 0, y: 0 }, T, ee);
      if (M && !M.lands) return { kind: "refused", laneId: M.laneId, reason: M.reason };
      const { width: z, height: Z } = De(o);
      if (T.x < -40 || T.y < -40 || T.x > z + 40 || T.y > Z + 40) return { kind: "outside" };
      let q = o;
      try {
        q = d?.(T) ?? o;
      } catch (G) {
        console.warn("WORKSHOP: the board kit's chooser threw", G);
      }
      return JSON.stringify(q) === JSON.stringify(o) ? M ? { kind: "refused", laneId: M.laneId, reason: M.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: q.cards.find((G) => G.id === i)?.laneId ?? c.laneId, next: q, ...M && { said: M.reason } };
    }
    const m = o.lanes.map((T) => P.get(ie(X.column(T.id)))).filter(Boolean), u = e.hitTestNodes(a, m, { padding: 6 }), w = u ? de(u.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === c.laneId) return { kind: "home" };
    const h = Ln(o, i, w);
    if (!h) return { kind: "refused", laneId: w, reason: Pn(o, i, w) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: w, next: h };
    let y = null;
    try {
      y = d({ x: a.x - Y.x, y: a.y - Y.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: w, next: h };
    }
    const O = y?.cards.find((T) => T.id === i)?.laneId;
    return !y || !O || O === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: O, next: y };
  }
  function Er() {
    return s ? !1 : new Set(Ee(o, { layout: ee }).places.map((i) => i.row)).size > 1;
  }
  function ro(i, a, d = !1) {
    const c = o.cards.find((T) => T.id === i), m = Ro(o, i), u = S?.cardId === i && S.laneId === null ? S.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const T = u > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (Fe(), T.id === c.laneId) {
        We(T.id, k ?? o), e.announce?.(`${Q(c)} is back in ${T.label}.`);
        return;
      }
      if (m.includes(T)) {
        const z = Ln(o, i, T.id);
        S = { cardId: i, laneId: T.id, next: z }, j(z), We(T.id, z), H(t.onPreview, z), e.announce?.(`${Q(c)} to ${T.label}: ${Pe(z, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const M = Pn(o, i, T.id) ?? "That move is not available.";
      re(), R = { laneId: T.id, reason: M, timer: setTimeout(() => re(), 1500) }, j(k ?? o), We(T.id, k ?? o), e.announce?.(`${Q(c)} can't move to ${T.label}. ${M}`), H(t.onRefuse, { cardId: i, laneId: T.id, reason: M });
      return;
    }
    const w = S?.cardId === i ? S.laneId : c.laneId;
    let h;
    if (d) {
      const { places: T } = Ee(o, { layout: ee }), M = T.find((z) => z.laneId === w);
      h = T.filter((z) => z.column === M.column && (z.row - M.row) * a > 0).sort((z, Z) => (z.row - Z.row) * a).map((z) => o.lanes.find((Z) => Z.id === z.laneId));
    } else {
      const T = o.lanes.findIndex((M) => M.id === w);
      h = a > 0 ? o.lanes.slice(T + 1) : o.lanes.slice(0, T).reverse();
    }
    const y = h.find((T) => m.includes(T));
    if (re(), !y) {
      const T = h[0];
      if (!T) {
        if (!d && Tt()) {
          const z = Vn(o, i);
          if (z) {
            e.announce?.(z), H(t.onRefuse, { cardId: i, laneId: null, reason: z });
            return;
          }
          Nr(c, a);
          return;
        }
        e.announce?.(`${Q(c)} has no lane to move to on that side.`);
        return;
      }
      const M = Pn(o, i, T.id) ?? "That move is not available.";
      R = { laneId: T.id, reason: M, timer: setTimeout(() => re(), 1500) }, j(S?.next ?? k ?? o), We(T.id, S?.next ?? k ?? o), e.announce?.(`${Q(c)} can't move to ${T.label}. ${M}`), H(t.onRefuse, { cardId: i, laneId: T.id, reason: M });
      return;
    }
    if (y.id === c.laneId) {
      Fe(), We(y.id, k ?? o), e.announce?.(`${Q(c)} is back in ${y.label}.`);
      return;
    }
    const O = Ln(o, i, y.id);
    S = { cardId: i, laneId: y.id, next: O }, j(O), We(y.id, O), H(t.onPreview, O), e.announce?.(`${Q(c)} to ${y.label}: ${Pe(O, y.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function We(i, a = o) {
    const d = s ? Kr(a, X.column(i)) : Ee(a, { layout: ee, rows: wo() }).places.find((y) => y.laneId === i), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const m = 16, u = (y, O, T, M) => O + m * 2 >= M || y - m < T ? y - m - T : y + O + m > T + M ? y + O + m - (T + M) : 0, w = u(Y.x + d.x, d.width, c.x, c.width), h = u(Y.y + d.y, d.height, c.y, c.height);
    (w || h) && e.panBy?.({ x: w, y: h });
  }
  function Ye() {
    if (!t.onSelect || Fn) return;
    const i = b ? [] : e.getSelectedNodes?.() ?? [], a = i.length === 1 && P.get(i[0].id) === i[0] ? de(i[0].id) : null;
    p && i.some((w) => !L.has(w.id)) && (p = null, we && Xe(we));
    const [d, c] = p ? p.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : d && c && !a ? { path: { from: d, to: c } } : null, u = m ? JSON.stringify(m) : null;
    u !== Qt && (Qt = u, H(t.onSelect, m));
  }
  function so() {
    $ && ($ = null, j(o), H(t.onPreview, null));
  }
  function Fe() {
    S && (S = null, H(t.onPreview, null), j(k ?? o));
  }
  function Nr(i, a) {
    const { width: d } = De(o), c = P.get(ie(X.card(i.id)))?.options, m = c?.width ?? 228, u = pn({
      x: a > 0 ? Y.x + d + 32 : Y.x - m - 32,
      y: c?.y ?? Y.y,
      width: m,
      height: c?.height ?? 76
    }, a), w = Fo(o, i.id);
    S = { cardId: i.id, laneId: null, side: a, spot: u, next: o }, j(o), H(t.onPreview, w), e.announce?.(`${Q(i)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ze() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function mn() {
    return !b && !C && !k && !x && !Ze() && Tt();
  }
  function ft() {
    N && (N = null, b || Ce());
  }
  function wn(i) {
    const a = o.lanes.map((c) => P.get(ie(X.column(c.id)))).filter(Boolean), d = e.hitTestNodes(i, a, { padding: 6 });
    return d ? de(d.id)?.key ?? null : null;
  }
  function gn(i) {
    const a = i.options ?? {}, d = rr({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), m = c.replace(/\s+/g, " ").trim(), u = {};
    c.trim() !== m && c.length <= 4e3 && (u.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const h of ["width", "height"]) Number.isFinite(a[h]) && a[h] >= 10 && a[h] <= 4e3 && (u[h] = Math.round(a[h]));
    if (Ft(a.image)) {
      u.image = { src: a.image };
      for (const [h, y] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[y]) && a[y] >= 1 && a[y] <= 2e4 && (u.image[h] = a[y]);
    }
    a.link?.data && _o({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = Mr(i);
    return { id: i.id, label: m, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...w.length ? { lines: w } : {} };
  }
  function Mr(i) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!P.get(c) && P.get(c) === e.nodes.one(c);
    for (const c of i.relationships?.getAssociations?.() ?? [])
      (c.targetPoint || !d(c.childId)) && a.set(c.id, bn(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === i || d(c.id)))
        for (const m of c.relationships?.getAssociations?.() ?? [])
          m.childId === i.id && !m.targetPoint && a.set(m.id, bn(m));
    for (const c of Pt(o, i.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function io(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function _r(i, a) {
    for (const { node: u } of i) {
      const w = yn(u);
      if (w) return w;
    }
    const d = o.lanes.find((u) => u.id === a), c = Ke(o, a);
    if (d.capacity !== void 0 && !d.station && c + i.length > d.capacity) {
      const u = d.capacity - c;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: u } of i) {
      const w = He(m, a, u);
      if (w) return w;
      m = Sn(m, a, u);
    }
    return null;
  }
  function yn(i) {
    if (i.options?.image && !Ft(i.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = i.options?.link;
    return a?.data && !_o({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : Rr(i) ? Ct : null;
  }
  function Ve(i) {
    return !!i && P.get(i.id) !== i && !!e.isDerivedNode?.(i);
  }
  function Rr(i) {
    for (const a of i.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && Ve(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === i || !Ve(a))) {
        for (const d of a.relationships?.getAssociations?.() ?? []) if (d.childId === i.id && !d.targetPoint) return !0;
      }
    return !1;
  }
  const ht = (i) => i || "This note", Q = (i) => i.label || "The empty card", ao = (i) => {
    const a = String(i ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : Is[a] ?? "shape";
  }, pt = (i) => (/^[aeiou]/i.test(i) ? "an " : "a ") + i, lo = (i) => {
    const a = i.flatMap((d) => {
      const c = ao(d.asNote?.shape);
      return c ? [{ card: d, word: c }] : [];
    });
    if (!a.length) return "";
    if (i.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${pt(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: c }) => c === "shape" ? `${Q(d)} had its own shape` : `${Q(d)} was ${pt(c)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, Wr = (i) => {
    const a = ao(i);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${pt(a)} again.` : "";
  };
  function kn() {
    return !b && !C && !k && !Ze() && Rs(o);
  }
  function bn(i) {
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
      const m = i[c];
      m != null && m !== "" && (a[c] = m);
    }
    for (const c of ["sourceAnchor", "targetAnchor"]) {
      const m = i[c];
      m && Number.isFinite(m.x) && Number.isFinite(m.y) && (a[c] = { x: m.x, y: m.y });
    }
    const d = i.targetPoint;
    return d && Number.isFinite(d.x) && Number.isFinite(d.y) && (a.targetPoint = { x: d.x, y: d.y }, delete a.targetAnchor), a;
  }
  function co(i, a) {
    const d = { ...i };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function uo(i) {
    if (!i || e.nodes.one(i.id) !== i) return null;
    if (P.get(i.id) === i) {
      const a = de(i.id);
      return a?.kind === "card" && o.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return i.options?.isComment || Ve(i) ? null : i.id;
  }
  function mt(i, a) {
    if (i.cards.some((c) => c.id === a)) {
      const c = P.get(ie(X.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && P.get(a) !== d && !Ve(d) && d.svgGroup ? d : null;
  }
  function fo(i) {
    const a = [];
    for (const d of i) {
      const c = e.nodes.one(d.parentId);
      if (!c?.relationships || P.get(c.id) === c || c.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const w = c.relationships.addFloatingAssociation(d.targetPoint, An(d));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(d.childId);
      if (!m || P.get(m.id) === m) continue;
      const u = c.relationships.addAssociation(m, An(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function Fr(i) {
    const a = /* @__PURE__ */ new Set();
    for (const d of i.lines ?? []) {
      if (d.targetPoint) {
        const M = mt(i, d.parentId);
        if (!M || P.get(M.id) !== M) continue;
        const z = { ...d, parentId: M.id }, Z = JSON.stringify(z);
        a.add(d.id);
        const q = ue.get(d.id);
        if (q && q.key === Z && q.holder === M && !q.other && M.relationships.hasAssociationId?.(d.id)) continue;
        q && e.nodes.one(q.holder.id) === q.holder && q.holder.relationships?.removeAssociation?.(d.id), M.relationships.addFloatingAssociation(d.targetPoint, An(z)), ue.set(d.id, { holder: M, other: null, swapped: !1, key: Z });
        continue;
      }
      const c = mt(i, d.parentId), m = mt(i, d.childId);
      if (!c || !m || c === m) continue;
      const u = P.get(c.id) !== c, w = u ? m : c, h = u ? c : m, y = u ? co({ ...d, parentId: w.id, childId: h.id }, d) : { ...d, parentId: w.id, childId: h.id }, O = JSON.stringify(y);
      a.add(d.id);
      const T = ue.get(d.id);
      T && T.key === O && T.holder === w && T.other === h && w.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), w.relationships.addAssociation(h, An(y)), ue.set(d.id, { holder: w, other: h, swapped: u, key: O }));
    }
    for (const [d, c] of [...ue])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), ue.delete(d));
  }
  function zn(i) {
    const a = i.parentId ? e.nodes.one(i.parentId) : null, d = i.id ?? i.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !i.id) && a.relationships.removeAssociation(d);
    });
  }
  let vn = null;
  function jr(i, a) {
    if (i === "addRelationship") {
      if (ue.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, c = e.nodes.one(a?.parentId), m = d ? null : e.nodes.one(a?.childId), u = uo(c), w = d ? null : uo(m);
      if (Ve(c)) return;
      const h = vn?.lineId === a?.id ? o.lines?.find((z) => z.id === a?.id) : void 0;
      h && (vn = null);
      const y = (z) => {
        zn(a), h && j(k ?? o), e.announce?.(z), H(t.onRefuse, { reason: z, laneId: null });
      };
      if (!kn()) {
        zn(a), h && j(k ?? o);
        return;
      }
      if (Ve(m)) return y(Ct);
      if (!u || !w && !d) return y(h ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const O = d ? String(a.childId) : w;
      if (h) {
        const z = o.cards.some((Be) => Be.id === u), Z = !d && o.cards.some((Be) => Be.id === w);
        if (!z && !Z) return je({ remove: h.id });
        const q = { ...bn(a), id: h.id, parentId: u, childId: O }, G = $n(o, q);
        if (G) return y(G);
        zn(a), je({ set: q });
        return;
      }
      const T = gr(o, u, O, bn(a)), M = $n(o, T);
      if (M) return y(M);
      zn(a), je({ set: T });
      return;
    }
    if (i === "removeRelationship") {
      const d = [...ue].find(([m, u]) => (m === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = ue.get(d);
      if (ue.delete(d), e.nodes.one(c.holder.id) !== c.holder || c.other && e.nodes.one(c.other.id) !== c.other || !kn())
        return kn() || b ? void 0 : j(k ?? o);
      vn = { lineId: d }, queueMicrotask(() => {
        b || vn?.lineId !== d || (vn = null, je({ remove: d }));
      });
      return;
    }
    if (i === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...ue].find(([T, M]) => T === d?.associationId && M.holder.id === d?.id);
        if (!c) continue;
        const [m, u] = c, w = o.lines?.find((T) => T.id === m), h = u.holder.relationships?.getAssociations?.().find((T) => T.id === m);
        if (!w || !h) continue;
        if (!kn()) {
          j(k ?? o);
          continue;
        }
        const y = bn(h), O = u.swapped ? co({ ...y, id: w.id, parentId: w.parentId, childId: w.childId }, y) : { ...y, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(Dr(O)) !== JSON.stringify(w) && (ue.set(m, { ...u, key: "" }), je({ set: O }));
      }
  }
  function Dr(i) {
    return Qn({ ...o, lines: [] }, i)?.lines?.[0] ?? null;
  }
  function je(i) {
    const a = o.lines?.find((h) => h.id === ("set" in i ? i.set.id : i.remove)), d = "set" in i ? Qn(o, i.set) : jo(o, i.remove);
    if (!d || d === o) return;
    e.beginHostStep?.(), o = d, e.endHostStep?.(), j(k ?? o);
    const c = "set" in i ? i.set : a, m = [c.parentId, c.childId].map((h) => o.cards.find((y) => y.id === h)?.label ?? e.nodes.one(h)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (h) => m[h] || (h === 1 && c.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in i ? a ? `The line from ${u(0)} to ${u(1)} changed.` : c.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const w = H(t.onChange, o, { line: i });
    St(w, () => {
      if (b || o !== d) return;
      const h = a ? Qn(o, a) : "set" in i ? jo(o, i.set.id) : null;
      h && (o = h, j(k ?? o));
    });
  }
  function zr(i) {
    const a = new Map(i.map((c) => [c.id, c])), d = new Map((o.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || je({ remove: c });
    for (const [c, m] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(m) && $n(o, m) === null && je({ set: m });
  }
  function wt(i, a) {
    let d = o;
    const c = /* @__PURE__ */ new Map(), m = i.map(({ node: h, offer: y, from: O }) => {
      let T = y.lines;
      for (const [Z, q] of c) T = on(T, Z, q);
      d = Sn(d, a, { ...y, ...T ? { lines: T } : {} });
      const M = d.cards[d.cards.length - 1];
      M.id !== h.id && c.set(h.id, M.id);
      const z = { ...h.options ?? {}, ...O ? { x: O.x, y: O.y } : {} };
      return { node: h, card: M, kept: z, lines: on(T ?? [], h.id, M.id), under: y.under };
    });
    e.beginHostStep?.(), o = d;
    let u = o;
    for (const { node: h, card: y } of m)
      y.id !== h.id && D.set(h.id, y.id), J.set(ie(X.card(y.id)), { x: h.options?.x ?? 0, y: h.options?.y ?? 0 }), Qe(() => e.removeNode(h.id));
    e.endHostStep?.(), j(o), Hr(ie(X.card(m[0].card.id)));
    const w = o.lanes.find((h) => h.id === a);
    e.announce?.(m.length === 1 ? `${Q(m[0].card)} is now a card in ${w.label}. ${Pe(o, a)}.${lo([m[0].card])}` : `${io(m.map(({ card: h }) => Q(h)))} are now cards in ${w.label}. ${Pe(o, a)}.${lo(m.map(({ card: h }) => h))}`);
    for (const { node: h, card: y, kept: O, lines: T, under: M } of m) {
      const z = { cardId: y.id, laneId: a, noteToCard: {
        noteId: h.id,
        label: Lt(o, y),
        ...M && { under: M },
        ...y.look ? { look: y.look } : {},
        ...y.asNote ? { asNote: y.asNote } : {},
        ...T.length ? { lines: T } : {}
      } }, Z = () => {
        o !== u || !o.cards.some((G) => G.id === y.id) || (o = V({ ...o, cards: o.cards.filter((G) => G.id !== y.id), lines: on(o.lines, y.id, h.id) }), u = o, j(o));
      }, q = H(t.onChange, o, z);
      e.holdTrade?.(h.id, q), po(q, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: h.id, isComment: !1 } }]);
      }, () => {
        if (!b) {
          if (Z(), !e.nodes.one(O.id)) {
            e.beginHostStep?.();
            const G = Qe(() => e.addNode({ ...O }));
            G && (G.announcedByCreator = !0), e.endHostStep?.();
            const Be = on(T, y.id, h.id).filter((xn) => !o.cards.some((nn) => nn.id === xn.parentId || nn.id === xn.childId));
            G?.ready?.then?.(() => {
              b || Qe(() => fo(Be));
            });
          }
          e.announce?.(`${Q(y)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        b || (Z(), e.keepTrade?.(h.id), e.announce?.(`Someone else put ${Q(y)} on the board first.`));
      });
    }
  }
  function ho(i, a) {
    const d = o.cards.find((T) => T.id === i), c = _.get(ie(X.card(i))) ?? {}, m = nr(d), u = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = ($e.cornerRadius ?? 0) > 0, h = d.asNote, y = h?.text !== void 0 && lt(h.text) === d.label ? h.text : Lt(o, d), O = {
      id: u,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: h?.width ?? c.width ?? 228,
      height: h?.height ?? c.height ?? 76,
      text: y,
      shape: h?.shape ?? (w ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? c.backgroundColor,
      fontColor: d.look?.textColor ?? c.foregroundColor,
      fontSize: d.look?.fontSize ?? c.fontSize,
      borderColor: d.look?.borderColor ?? c.borderColor,
      borderWidth: d.look?.borderWidth ?? c.borderWidth,
      ...d.look?.fontFamily ?? c.fontFamily ? { fontFamily: d.look?.fontFamily ?? c.fontFamily } : {}
    };
    h?.image && Object.assign(O, {
      image: h.image.src,
      ...h.image.width ? { imageOrigWidth: h.image.width } : {},
      ...h.image.height ? { imageOrigHeight: h.image.height } : {}
    }), h?.link && (O.link = { ...h.link });
    for (const T of Object.keys(O)) O[T] === void 0 && delete O[T];
    return { id: u, note: O };
  }
  function Bn(i, a, d = "", c = !1) {
    const m = o.cards.find((ce) => ce.id === i), u = o.lanes.find((ce) => ce.id === m.laneId), w = o.cards.findIndex((ce) => ce.id === i), h = o.cards.slice(w + 1).find((ce) => ce.laneId === m.laneId)?.id, { id: y, note: O } = ho(i, a), T = m.asNote, M = Pt(o, i), { leave: z } = Ds(o, i, y), Z = Fo(o, i, y);
    e.beginHostStep?.(), o = Z;
    const q = o;
    y !== i ? D.set(y, i) : D.delete(y);
    const G = Qe(() => e.addNode(O));
    G && (G.announcedByCreator = !0), e.endHostStep?.(), j(o);
    const Be = Promise.resolve(G?.ready).then(() => b || !G || e.nodes.one(y) !== G ? [] : Qe(() => fo(z))).catch(() => []);
    G?.ready?.then?.(() => {
      if (b || e.nodes.one(y) !== G) return;
      const ce = () => e.selectNodes?.([G]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(ce) : ce();
    }), c || e.announce?.(`${Q(m)} is now a note on the canvas.${d} ${u.label}: ${Pe(o, u.id)}.${Wr(T?.shape)}`);
    const xn = () => {
      e.nodes.one(y) === G && (e.beginHostStep?.(), Qe(() => e.removeNode(y)), e.endHostStep?.());
    }, nn = H(t.onChange, o, { cardId: i, cardToNote: { noteId: y } });
    return e.holdTrade?.(y, nn), po(nn, () => {
      Be.then((ce) => {
        G && e.nodes.one(y) === G && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: xt(G.options) } }, ...ce]);
      });
    }, () => {
      if (!b) {
        if (xn(), o === q && !o.cards.some((ce) => ce.id === i)) {
          const ce = {
            id: i,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ...M.length ? { lines: M } : {}
          }, Io = Sn(o, m.laneId, ce, h);
          Io && (o = Io, j(o));
        }
        e.announce?.(`${Q(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      b || (xn(), e.keepTrade?.(y), e.announce?.(`Someone else took ${Q(m)} off the lanes first.`));
    }), { added: G, answer: nn };
  }
  function Br(i, a, d) {
    const c = d.map((y) => y.id), m = c.indexOf(a), u = i.cards.find((y) => y.id === a);
    if (m < 0 || !u) return i;
    const w = i.cards.filter((y) => y !== u), h = w.findIndex((y) => c.indexOf(y.id) > m);
    return w.splice(h < 0 ? w.length : h, 0, u), V({ ...i, cards: w });
  }
  function Hr(i) {
    xe = xe.then(() => {
      const a = P.get(i);
      if (b || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Qe(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function po(i, a, d, c) {
    if (!i || typeof i.then != "function") return a();
    const m = i.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && c();
    }, () => d());
    e.holdUntil?.(m);
  }
  function Gr(i, a) {
    re(!1), R = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => re(), 1500) }, j(o, { skip: a.cardId });
    const d = o.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${i || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), H(t.onRefuse, a);
  }
  function re(i = !0) {
    R && (clearTimeout(R.timer), R = null, i && !b && Ce());
  }
  function Ce() {
    j(x && x.outcome.kind === "candidate" ? x.outcome.next : S?.next ?? k ?? o, { skip: x?.cardId });
  }
  function mo(i) {
    const a = vo(i, wo()), d = new Map(a.map((u) => [u.options.id, u.options])), c = (u, w, h, y = !1) => {
      const O = d.get(X.column(u));
      O && (O.borderColor = w, O.borderWidth = h, delete O.borderStyle);
      const T = y && d.get(X.lane(u));
      T && (T.borderColor = w, T.borderWidth = h);
    }, m = x?.cardId ?? S?.cardId;
    if (te = /* @__PURE__ */ new Map(), m) {
      const u = o.cards.find((y) => y.id === m)?.laneId, w = Ro(o, m);
      if (!s || s.laneCues)
        for (const y of w) y.id !== u && (c(y.id, No, 2), te.set(y.id, "open"));
      if (s?.laneCues) {
        for (const y of o.lanes) if (!w.includes(y)) {
          const O = d.get(X.column(y.id));
          O && (O.backgroundColor = "#e9e8e2"), te.set(y.id, "closed");
        }
      }
      const h = x ? x.outcome : S?.laneId ? { kind: "candidate", laneId: S.laneId } : null;
      h?.kind === "candidate" && (c(h.laneId, Eo, 3, !0), te.set(h.laneId, "over")), h?.kind === "refused" && (c(h.laneId, At, 3), te.set(h.laneId, "refused"));
    }
    if (N && !m) {
      for (const u of N.open) u !== N.laneId && (c(u, No, 2), te.set(u, "open"));
      N.laneId && !N.refusal && (c(N.laneId, Eo, 3, !0), te.set(N.laneId, "over")), N.laneId && N.refusal && (c(N.laneId, At, 3), te.set(N.laneId, "refused"));
    }
    if (S?.laneId === null && S.spot) {
      const u = d.get(X.card(S.cardId));
      u && (u.xPos = S.spot.x, u.yPos = S.spot.y);
    }
    if (R) {
      te.set(R.laneId, "refused"), c(R.laneId, At, 3, !0);
      const u = d.get(X.caption(R.laneId));
      u && (u.text = R.reason, u.foregroundColor = "#b42318");
    }
    if (Je = /* @__PURE__ */ new Set(), k && i === k) {
      const u = (h, y) => JSON.stringify(h) === JSON.stringify(y), w = (h) => {
        const y = d.get(h);
        y && (y.borderStyle = "dashed", y.borderColor = xs, y.borderWidth = 2, Je.add(ie(h)));
      };
      for (const h of i.cards) u(h, o.cards.find((y) => y.id === h.id)) || w(X.card(h.id));
      for (const h of i.lanes) u(h, o.lanes.find((y) => y.id === h.id)) || w(X.lane(h.id));
    }
    for (const u of a) {
      u.options.id = ie(u.options.id);
      for (const w of u.relationships.associations)
        w.parentId = ie(w.parentId), w.childId = ie(w.childId);
    }
    return a;
  }
  function wo() {
    return x || S ? o.lanes.map((i) => o.cards.filter((a) => a.laneId === i.id).length) : void 0;
  }
  function j(i, a = {}) {
    if (b) return;
    Ie = a.layout ?? ee, _e = { model: i, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = mo(i), c = [];
    for (const { options: u } of d) {
      const w = u.id;
      if (P.has(w)) continue;
      const h = J.get(w);
      J.delete(w);
      const y = h && a.animate !== !1 && !Yn() ? { ...u, xPos: h.x, yPos: h.y } : u, O = e.nodes.add(fs(y));
      P.set(w, O), _.set(w, { ...y }), O.ready && c.push(O.ready.then(() => {
        if (P.get(w) !== O) return;
        O.applyGovernance?.(), de(w)?.kind === "column" && O.toBack?.(!1), de(w)?.kind === "handle" && O.svgGroup?.front?.();
        const T = xo(_e?.model ?? i, w);
        T && O.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const m = _e;
    xe = Promise.all([xe, ...c]).then(() => {
      b || _e !== m || Ur(mo(m.model), m);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function Ur(i, a) {
    const d = new Set(i.map((m) => m.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, w] of [...P]) {
        if (d.has(u)) continue;
        for (const [y, O] of [...B])
          O.parentId !== u && O.childId !== u || (O.parent.relationships?.removeAssociation(y), B.delete(y));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), P.delete(u), _.delete(u);
        const h = v.get(u);
        h && (v.delete(u), l.delete(h)), e.nodes.remove(u);
      }
      for (const { options: u } of i) {
        const w = u.id, h = P.get(w);
        if (!h?.svgGroup) continue;
        const y = _.get(w) ?? {}, O = h.editor?.isInlineEditing?.();
        (u.fontSize !== y.fontSize || u.foregroundColor !== y.foregroundColor) && (h.options.fontSize = u.fontSize, h.options.fontColor = u.foregroundColor, h.applyTextStyle?.()), u.text !== y.text && !O && h.setText?.(u.text), (u.width !== y.width || u.height !== y.height) && (u.vectorPath ? (h.options.width = u.width, h.options.height = u.height, h.setShape?.(h.options.shape, u.vectorPath), de(w)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(u.width, u.height)), u.backgroundColor !== y.backgroundColor && h.setColors?.(u.backgroundColor), (u.borderColor !== y.borderColor || u.borderWidth !== y.borderWidth || u.borderStyle !== y.borderStyle) && (h.options.borderColor = u.borderColor, h.options.borderWidth = u.borderWidth, h.options.borderStyle = u.borderStyle, h.applyBorder?.());
        const T = u.xPos !== y.xPos || u.yPos !== y.yPos || Math.abs((h.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - u.yPos) > 0.5;
        if (w !== (a.skip && ie(X.card(a.skip))) && w !== (a.grip && ie(a.grip)) && T) {
          const Z = a.animate && !Yn() ? 180 : 0, q = c.includes(h) ? () => {
            !b && P.get(w) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          q && Z && c.length === 1 && h.resizeRotate?.disable?.(), h.position(u.xPos, u.yPos, q, void 0, Z);
        }
        const M = xo(a.model, w);
        M && h.svgGroup.node.getAttribute("aria-label") !== M && h.svgGroup.node.setAttribute("aria-label", M), Je.has(w) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed"), h.svgGroup.node.toggleAttribute?.("data-workshop-focused", Ae);
        const z = de(w);
        if (z?.kind === "column") {
          const Z = te.get(z.key);
          Z ? h.svgGroup.node.setAttribute("data-workshop-drop", Z) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        z?.kind === "handle" && h.svgGroup.front?.(), _.set(w, { ...u });
      }
      const m = /* @__PURE__ */ new Map();
      for (const u of i) for (const w of u.relationships.associations) m.set(w.id, w);
      for (const [u, w] of [...B])
        m.has(u) && P.get(w.parentId) === w.parent && P.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(u), B.delete(u));
      for (const [u, w] of m) {
        if (B.has(u)) continue;
        const h = P.get(w.parentId), y = P.get(w.childId);
        !h?.relationships || !y?.svgGroup || (h.relationships.addAssociation(y, An(w)), B.set(u, { parentId: w.parentId, childId: w.childId, parent: h, child: y }));
      }
      Fr(a.model);
    }), Xe(a.model), e.notifyNodeChanged?.();
  }
  let we = null;
  function go(i) {
    const a = de(i);
    return a ? a.kind === "card" ? a.key : s?.cardOfPart?.(o, pe(i)) ?? null : null;
  }
  function yo() {
    if (A) return s?.cardOfPart?.(o, A.name) ?? null;
    if (x) return x.cardId;
    if (Dn) return Dn;
    const i = b ? [] : e.getSelectedNodes?.() ?? [];
    return i.length === 1 && P.get(i[0].id) === i[0] ? go(i[0].id) : null;
  }
  let gt = null;
  function ko() {
    b || !g || !we || yo() !== gt && Xe(we);
  }
  function Xe(i) {
    if (g) {
      we = i, gt = yo();
      const a = o.lanes.map((m) => P.get(ie(X.column(m.id)))?.svgGroup?.node).reduce((m, u) => u && (!m || m.compareDocumentPosition(u) & 4) ? u : m, null), d = e.canvas?.viewbox?.(), c = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - Y.x, y: d.y - Y.y, width: d.width, height: d.height } : null;
      g.draw(o, i === o ? null : i, {
        origin: Y,
        layout: Ie,
        above: a,
        view: c,
        announce: (m) => e.announce?.(m),
        focus: gt,
        boardFocused: Ae,
        picked: p,
        onPick: Yr,
        gripSize: fn,
        clamp: A?.last?.clampedReason ? { name: A.name, text: A.last.clampedReason } : x?.outcome.kind === "candidate" && x.outcome.said ? { name: "card-" + x.cardId, text: x.outcome.said } : !A && U ? { name: U.name, text: U.reason } : null,
        refused: !!A?.last?.refusal || !A && !!U,
        onUnlink: (m, u) => {
          if (C || k || x || A || Ze()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: u }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: u } }, h = rn(o, [w]);
          "refused" in h ? e.announce?.(h.refused.reason) : Gn(h.workshop, o.lanes[0]?.station ? { laneId: u } : { cardId: m });
        }
      });
    }
  }
  function en(i) {
    return { x: i.x - Y.x, y: i.y - Y.y };
  }
  function De(i) {
    return s ? s.places(i, Ie) : { ...Ee(i, { layout: ee }), parts: [] };
  }
  function Kr(i, a) {
    const d = s.places(i, Ie).parts.find((c) => c.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function bo() {
    try {
      const i = e.getZoom?.();
      return typeof i == "number" && i > 0 ? i : 1;
    } catch {
      return 1;
    }
  }
  function qr() {
    Wn?.(), Wn = null, fn = It(bo());
    const i = e.canvas?.node;
    if (!Hn() || !i || typeof MutationObserver > "u") return;
    let a = null;
    const d = () => {
      if (a = null, b || !Hn()) return;
      if (A || x) {
        a = setTimeout(d, 250);
        return;
      }
      const m = It(bo());
      Math.abs(m - fn) < 2 || (fn = m, j(k ?? o));
    }, c = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(d, 200);
    });
    c.observe(i, { attributes: !0, attributeFilter: ["viewBox"] }), Wn = () => {
      c.disconnect(), a && clearTimeout(a);
    };
  }
  function Hn() {
    return !s && !!o.lanes[0]?.station && Ae && !C && !k && !Ze();
  }
  function Jr(i) {
    const a = Vo(i);
    if (!a || !Hn()) return null;
    const d = o;
    return (c) => {
      const m = gs(d, c), u = ks(d, a, a.kind === "link" && m === a.from ? null : m);
      return u.next ? { next: u.next } : { next: d, clampedReason: u.refusal, refusal: u.refusal };
    };
  }
  function Yr(i) {
    if (b || Ae) return;
    const a = e.getSelectedNodes?.() ?? [];
    L = new Set(a.map((u) => u.id)), p = i, a.length && e.clearSelection?.(), we && Xe(we), Ye();
    const [d, c] = i.split(">"), m = (u) => o.lanes.find((w) => w.id === u)?.label ?? u;
    e.announce?.(`Path from ${m(d)} to ${m(c)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function vo(i, a) {
    if (!s) {
      const c = qs(i, { native: !0, origin: Y, rows: a, layout: ee, style: $e }).nodes;
      return Hn() ? [...c, ...er(o, Y, fn)] : c;
    }
    const d = s.notes(i, Ie, Y, $e);
    if (i.behaviour && d.length) {
      const c = d.map((h) => h.options), m = Math.min(...c.map((h) => h.xPos)), u = Math.max(...c.map((h) => h.xPos + h.width)), w = Cr(i, { x: m, y: Math.max(...c.map((h) => h.yPos + h.height)) + 16, width: Math.min(u - m, 484) }, $e);
      w && d.push(w);
    }
    return d;
  }
  function Gn(i, a, d) {
    const c = s ? s.editsBetween(o, i) : bs(o, i);
    if (!c.length) return !1;
    const m = rn(o, c);
    return "refused" in m ? (e.announce?.(m.refused.reason), H(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, j(o, { skip: d }), e.announce?.(m.report.edits.map((u) => u.said).join(" ")), H(t.onChange, o, { ...a, edits: c }), !0);
  }
  function xo(i, a) {
    const d = de(a);
    if (d?.kind === "lane") {
      const c = i.lanes.find((m) => m.id === d.key);
      return c ? `${c.label}, ${Pe(i, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = i.cards.find((u) => u.id === d.key), m = c && i.lanes.find((u) => u.id === c.laneId);
      return c && m ? `${c.label || "Empty card"}, in ${m.label}${s?.cardKeys ? ". " + s.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? s ? s.label?.(i, pe(a)) ?? null : ys(i, pe(a)) : null;
  }
  function yt(i, a) {
    const d = vo(i).find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function ze() {
    (x || A) && e.cancelGovernedDrag?.("host"), x = null, A = null, S && (S = null, H(t.onPreview, null)), re(!1);
  }
  return {
    toCanvas(i) {
      if (b || C || Ze()) return "This workshop is view-only here.";
      if (!o.cards.some((u) => u.id === i)) return "That card is no longer on the board.";
      const a = Vn(o, i);
      if (a) return a;
      S && Fe(), k && (ze(), k = null, j(o), e.refreshGovernance?.());
      const { width: d } = De(o), c = P.get(ie(X.card(i)))?.options, m = o.cards.find((u) => u.id === i);
      return Bn(i, pn({
        x: Y.x + d + 32,
        y: c?.y ?? Y.y,
        width: m?.asNote?.width ?? c?.width ?? 228,
        height: m?.asNote?.height ?? c?.height ?? 76
      })), null;
    },
    get value() {
      return o;
    },
    get origin() {
      return { ...Y };
    },
    get layout() {
      return { ...ee };
    },
    get bounds() {
      const { width: i, height: a } = De(o);
      return { x: Y.x, y: Y.y, width: i, height: a };
    },
    get focused() {
      return Ae;
    },
    setFocused(i) {
      if (b) return;
      const a = Ae;
      Ae = !!i;
      for (const d of P.values()) d.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Ae);
      a !== Ae && (p && (p = null, queueMicrotask(Ye)), !s && o.lanes[0]?.station ? (ze(), qr(), j(k ?? o)) : we && Xe(we));
    },
    setLayout(i) {
      if (b) throw new Error("This workshop has been detached.");
      const a = Mo(i);
      s ? s.places(o, a) : Ee(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(ee) && (ze(), ee = a, j(k ?? o));
    },
    whenDrawn: () => xe,
    update(i) {
      if (b) throw new Error("This workshop has been detached.");
      const a = V(i);
      ze(), o = a;
      const d = C;
      C = I || f(o), j(k ?? o), C !== d && e.refreshGovernance?.();
    },
    preview(i) {
      if (b) throw new Error("This workshop has been detached.");
      const a = i ? V(i) : null;
      ze(), k = a, j(k ?? o), e.refreshGovernance?.();
    },
    refuse(i, a) {
      const d = o.lanes.find((c) => c.id === i);
      b || !d || (re(!1), R = { laneId: i, reason: a, timer: setTimeout(() => re(), 1500) }, Ce(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(i) {
      I = !!i;
      const a = I || f(o);
      b || C === a || (ze(), C = a, j(k ?? o), e.refreshGovernance?.());
    },
    destroy() {
      b || (ze(), b = !0, Cn.get(e)?.delete(ut), Wn?.(), U && clearTimeout(U.timer), e.element?.removeEventListener?.("pointerdown", eo, !0), Re && clearTimeout(Re), e.element?.ownerDocument?.removeEventListener?.("pointerup", no, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", to, !0), Or?.(), g && e.element?.removeEventListener?.("pointerover", Xt), e.withPolicyAuthority(() => {
        for (const [i, a] of ue) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(i);
        for (const [i, a] of B) a.parent.relationships?.removeAssociation(i);
        for (const [i, a] of P)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(i) === a && e.nodes.remove(i);
      }), B.clear(), ue.clear(), P.clear(), _.clear(), l.clear(), v.clear(), $r(), g?.destroy(), Fn = !1, Ye(), e.notifyNodeChanged?.());
    }
  };
}
function H(e, ...n) {
  try {
    return e?.(...n);
  } catch (t) {
    console.error("WORKSHOP: a host callback threw", t);
    return;
  }
}
function St(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function Ss(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function Mo(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function Ts(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const Ls = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function le(e) {
  return Ls.includes(e.kind) ? e.kind : void 0;
}
function fe(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ge(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Ps(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Nn(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Nn(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const at = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function Rt(e) {
  if (typeof e != "string" || !at.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function nr(e) {
  return e.noteId ?? e.id;
}
function lt(e) {
  const n = Nn(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function tr(e) {
  const n = fe(e);
  let t;
  try {
    t = new URL(ge(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (t.protocol !== "https:" || t.username || t.password || t.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: t.href, alt: ge(n.alt, 240) };
}
function ve(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const or = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, $s = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Wt(e) {
  const n = fe(e), t = {}, r = (s) => {
    if (typeof s != "string" || !or.test(s)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return s;
  }, o = (s, f, g) => {
    if (typeof s != "number" || !Number.isFinite(s) || s < f || s > g) throw new Error("A card size is out of range.");
    return s;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !$s.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function rr(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        Wt({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return Wt(n);
}
function Ft(e) {
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
function _o(e) {
  try {
    return !!rt({ link: e });
  } catch {
    return !1;
  }
}
function rt(e) {
  const n = fe(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = fe(n.image);
    if (!Ft(r.src)) throw new Error("A card keeps a picture by its web address only.");
    t.image = { src: r.src };
    for (const o of ["width", "height"]) {
      const s = r[o];
      if (s !== void 0) {
        if (typeof s != "number" || !Number.isFinite(s) || s < 1 || s > 2e4) throw new Error("A picture size is out of range.");
        t.image[o] = s;
      }
    }
  }
  if (n.link !== void 0) {
    const r = fe(n.link), o = r.data;
    if (!(typeof o == "string" ? o.length <= 2048 : !!o && typeof o == "object" && !Array.isArray(o) && JSON.stringify(o).length <= 2048 && Object.values(o).every((f) => typeof f == "string")) || r.type !== void 0 && (typeof r.type != "string" || !/^[A-Za-z]{1,40}$/.test(r.type)) || r.show !== void 0 && typeof r.show != "boolean") throw new Error("A card keeps a link as a note does.");
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
const dn = 96, Os = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Es = ["solid", "dashed", "dotted"], Ns = 1e7;
function cn(e) {
  const n = fe(e);
  if (typeof n.id != "string" || !Os.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: Rt(n.parentId), childId: Rt(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, s, f) => {
    const g = n[o];
    if (g != null) {
      if (typeof g != "number" || !Number.isFinite(g) || g < s || g > f) throw new Error("A line's look is out of range.");
      t[o] = g;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !or.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Es.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = fe(n.targetPoint), s = (f) => typeof f == "number" && Number.isFinite(f) && Math.abs(f) <= Ns;
    if (!s(o.x) || !s(o.y) || Object.keys(o).some((f) => f !== "x" && f !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    t.targetPoint = { x: Math.round(o.x * 100) / 100, y: Math.round(o.y * 100) / 100 };
  }
  for (const o of ["sourceAnchor", "targetAnchor"]) {
    if (o === "targetAnchor" && t.targetPoint) continue;
    const s = n[o];
    if (s == null) continue;
    const f = fe(s), g = (p) => typeof p == "number" && Number.isFinite(p) && p >= 0 && p <= 1;
    if (!g(f.x) || !g(f.y) || Object.keys(f).some((p) => p !== "x" && p !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    t[o] = { x: f.x, y: f.y };
  }
  return t;
}
function Ms(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map(cn).map((r) => sr(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (Oe(t.map((r) => r.id), "line ID"), t.length > dn) throw new Error(`A workshop holds up to ${dn} lines.`);
  return t;
}
function sr(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function Oe(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Jt({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function _s(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const ln = (e) => "lane-" + e, Me = (e) => "card-" + e, st = (e) => "image-" + e;
function ki(e, n = {}) {
  const t = _s(e), r = X.of(n.scope);
  return Jt(e).map((o) => {
    const s = e.cards.filter((p) => p.laneId === o.id), f = t.filter((p) => p.laneId === o.id), g = [r.lane(o.id)];
    return o.station?.image && g.push(r.image(o.id)), { lane: o, cards: s, signals: f, nodeIds: [...g, ...s.map((p) => r.card(p.id))] };
  });
}
const Yt = 5, Tn = 24, jt = 3;
function V(e) {
  const n = fe(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !le(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = le(n), o = r ? ye(r) : void 0, s = { id: ve }, f = ge(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Yt)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const g = o?.cards ?? [Tn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > g[0]) throw new Error(g[1]);
  const p = n.lanes.map((I) => {
    const C = fe(I), b = { id: ve(C.id), label: ge(C.label) };
    if (C.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (C.capacity !== void 0) {
      const P = t ? 576 : 24;
      if (typeof C.capacity != "number" || !Number.isInteger(C.capacity) || C.capacity < 1 || C.capacity > P)
        throw new Error(`Lane capacity must be a whole number from 1 to ${P}.`);
      b.capacity = C.capacity;
    }
    if (o?.readLane?.(C, b, s), C.station !== void 0) {
      const P = fe(C.station), _ = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= jt)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray(P.next) || P.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const B = P.next.map(ve);
      Oe(B, "onward stop"), b.station = { column: _(P.column), row: _(P.row), next: B, outcome: ge(P.outcome, 160) }, P.image !== void 0 && (b.station.image = tr(P.image));
    }
    return b;
  }), L = p.map((I) => I.id);
  if (Oe(L, "lane ID"), r && p.some((I) => I.station)) throw new Error("A business board has no map stations.");
  if ((t || p.some((I) => I.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (p.some((I) => I.station) && n.cards.every((I) => I?.free === !0))
    throw new Error("A map needs at least one token.");
  if (p.some((I) => I.station)) {
    if (!p.every((I) => I.station)) throw new Error("Give every station on the map a position.");
    Oe(p.map((I) => I.station.column + "," + I.station.row), "map position");
    for (const I of p)
      if (I.station.next.some((C) => C === I.id || !L.includes(C))) throw new Error("Connect each stop to another station on this map.");
  }
  const A = n.cards.map((I) => {
    const C = fe(I), b = { id: ve(C.id), label: r ? ge(C.label) : Ps(C.label), laneId: ve(C.laneId) };
    if (!L.includes(b.laneId)) throw new Error("Card refers to an unknown lane.");
    if (C.allowedLaneIds !== void 0) {
      if (!Array.isArray(C.allowedLaneIds) || C.allowedLaneIds.length > p.length) throw new Error("Invalid allowed lanes.");
      if (b.allowedLaneIds = C.allowedLaneIds.map(ve), Oe(b.allowedLaneIds, "allowed lane"), !b.allowedLaneIds.includes(b.laneId) || !b.allowedLaneIds.every((P) => L.includes(P)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (C.look !== void 0) {
      const P = Wt(C.look);
      P && (b.look = P);
    }
    if (C.asNote !== void 0) {
      const P = rt(C.asNote);
      P && (b.asNote = P);
    }
    if (C.noteId !== void 0 && C.noteId !== b.id && (b.noteId = Rt(C.noteId)), C.free !== void 0) {
      if (C.free !== !0 || !p.some((P) => P.station)) throw new Error("Only a map’s cards can be free of its paths.");
      b.free = !0;
    }
    if (o?.readCard(C, b, s), t) {
      if (typeof C.points != "number" || !Number.isInteger(C.points) || C.points < 1 || C.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (b.points = C.points, C.dependsOn !== void 0) {
        if (!Array.isArray(C.dependsOn) || C.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        b.dependsOn = C.dependsOn.map(ve), Oe(b.dependsOn, "dependency");
      }
    }
    return b;
  });
  Oe(A.map((I) => I.id), "card ID");
  const k = { version: 1, title: f, lanes: p, cards: A };
  if (n.experience !== void 0) {
    const I = fe(n.experience);
    if (I.version !== 1 || I.kind !== "customer-interviews" && I.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    k.experience = { version: 1, kind: I.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    k.signals = n.signals.map((I) => {
      const C = fe(I), b = ve(C.cardId), P = ve(C.laneId);
      if (!A.some((_) => _.id === b) || !L.includes(P))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ve(C.id),
        label: ge(C.label),
        cardId: b,
        laneId: P,
        whenPresent: ge(C.whenPresent, 160),
        whenAbsent: ge(C.whenAbsent, 160)
      };
    }), Oe(k.signals.map((I) => I.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const I = Ms(n.lines, new Set(A.map((C) => C.id)));
    I.length && (k.lines = I);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    k.presentationOrder = Jt({ lanes: p, presentationOrder: n.presentationOrder }).map((I) => I.id);
  }
  if (n.behaviour !== void 0 && (k.behaviour = me().validate(n.behaviour, { ...k, kind: n.kind })), t)
    return k.kind = "release-plan", Zr(k), k;
  if (r && o) {
    k.kind = r, o.readBoard(n, k, s);
    const I = o.validate(k);
    if (I) throw new Error(I);
    return k;
  }
  for (const I of p)
    if (Ke({ cards: A }, I.id) > (I.capacity ?? 1 / 0))
      throw new Error(`Lane "${I.label}" exceeds its capacity.`);
  return k;
}
function Ke(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const ir = 65536;
function bi(e) {
  const n = JSON.stringify(V(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > ir) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function vi(e) {
  if (e.length > ir) throw new Error("This workshop is too large to open from a link.");
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
function Zt(e, n, t) {
  const r = le(e);
  return r ? ye(r).planMove(e, n, t) : void 0;
}
function it(e, n) {
  if (le(e)) return e.lanes.filter((r) => Zt(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => En(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && Ke(e, r.id) < (r.capacity ?? 1 / 0));
}
function Dt(e, n, t) {
  const r = e.cards.find((s) => s.id === n), o = Zt(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const s = En(e, r, t);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!r || !it(e, r).some((s) => s.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((s) => s === r ? { ...r, laneId: t } : s) };
}
function Ln(e, n, t) {
  const r = ar(e, n, t);
  return !r || r === e || !e.behaviour ? r : "refused" in me().check(e, r) ? null : r;
}
function ar(e, n, t) {
  const r = e.cards.find((f) => f.id === n);
  if (!r || !e.lanes.some((f) => f.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return En(e, r, t);
  const o = Zt(e, n, t);
  if (o !== void 0) return o;
  const s = Ys(e, n, t);
  return s || (t === "prototype" && qe(e) === "customer-interviews" ? null : it(e, r).some((f) => f.id === t) ? Dt(e, n, t) : null);
}
function Ro(e, n) {
  return e.lanes.filter((t) => Ln(e, n, t.id) !== null);
}
function Pn(e, n, t) {
  const r = ar(e, n, t);
  if (r !== null) {
    const k = r === e || !e.behaviour ? null : me().check(e, r);
    return k && "refused" in k ? k.refused.sentence : null;
  }
  const o = e.cards.find((k) => k.id === n), s = e.lanes.find((k) => k.id === t);
  if (!o || !s) return "That move is not available.";
  const f = le(e), g = f && ye(f).refusal;
  if (g) return g(e, n, t);
  const p = `This card can't go in ${s.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return p;
  if (e.kind === "release-plan") {
    if (s.capacity === void 0) return p;
    const k = Ue(e, t), I = { ...e, lanes: e.lanes.map((b) => b === s ? { id: s.id, label: s.label } : b) }, C = En(I, o, t);
    return C ? `Needs ${Ue(C, t) - k} points. It already holds ${k} of ${s.capacity} points.` : p;
  }
  const L = e.lanes.find((k) => k.id === o.laneId);
  if (L?.station && !o.free && !L.station.next.includes(t)) return `${s.label} can't be reached from ${L.label}.`;
  const A = Ke(e, t);
  if (s.capacity !== void 0 && A >= s.capacity && !(L?.station && o.free)) {
    const k = L?.station ? s.capacity === 1 ? "token" : "tokens" : s.capacity === 1 ? "card" : "cards";
    return `It already holds ${A} of ${s.capacity} ${k}.`;
  }
  return p;
}
function Tt(e) {
  return !0;
}
function Rs(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !qe(e);
}
function Ws(e) {
  const n = qe(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function Fs(e) {
  const n = Nn(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const js = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function un(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && js.test(n) && !t.has(n) ? n : _n(e, "card");
}
function He(e, n, t) {
  const r = e.lanes.find((g) => g.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = Ws(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= Tn ? `This board is at its size limit of ${Tn} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : hr(e, n, t) ? null : Pn(fr(e, n, t), un(e, t.id), n);
  if (le(e)) {
    if (!(typeof t?.label == "string" && Nn(t.label))) return "A card needs some words. Type on the note first.";
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const g = pr(e, n, t);
    return typeof g == "string" ? g : Wo(e, g);
  }
  if (e.cards.length >= Tn) return `This board is at its size limit of ${Tn} cards. Remove a card to make room.`;
  const s = e.lanes.some((g) => g.station);
  if (s && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const f = Ke(e, n);
  if (r.capacity !== void 0 && !s && f >= r.capacity) return `It already holds ${f} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const g = cr(t.lines);
    if (!g) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((L) => L.id));
    if ((e.lines?.length ?? 0) + g.filter((L) => !p.has(L.id)).length > dn)
      return `A workshop holds up to ${dn} lines.`;
  }
  return Wo(e, { ...e, cards: [...e.cards, { id: un(e, t.id), label: lt(typeof t.label == "string" ? t.label : ""), laneId: n }] });
}
function Wo(e, n) {
  if (!e.behaviour) return null;
  const t = me().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function lr(e) {
  try {
    return e && typeof e == "object" ? rr(e) : void 0;
  } catch {
    return;
  }
}
function dr(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      rt({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? rt(n) : void 0;
}
function cr(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = cn(r);
    } catch {
      const s = (g) => {
        const { id: p, parentId: L, childId: A, targetPoint: k } = fe(r);
        return cn({ id: p, parentId: L, childId: A, ...g ? { targetPoint: k } : {} });
      }, f = r?.targetPoint !== void 0 && r?.targetPoint !== null;
      try {
        o = s(!0);
      } catch {
        try {
          o = f ? null : s(!1);
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
function dt(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function on(e, n, t) {
  return e && e.map((r) => dt(r, n, t));
}
function ur(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function Sn(e, n, t, r) {
  if (He(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return hr(e, n, t, r);
  if (le(e)) {
    const b = pr(e, n, t), P = b.cards[b.cards.length - 1], _ = r === void 0 ? -1 : e.cards.findIndex((B) => B.id === r && B.laneId === n);
    return _ < 0 ? b : { ...b, cards: [...e.cards.slice(0, _), P, ...e.cards.slice(_)] };
  }
  const o = lr(t.look), s = typeof t.label == "string" ? Nn(t.label) : "";
  let f = dr(t.asNote);
  s.length > 80 && f?.text === void 0 && s.length <= 4e3 && (f = { ...f, text: s });
  const g = un(e, t.id), p = g !== t.id && typeof t.id == "string" && at.test(t.id) ? t.id : void 0, L = e.lanes.some((b) => b.station), A = {
    id: g,
    label: lt(s),
    laneId: n,
    ...o ? { look: o } : {},
    ...f ? { asNote: f } : {},
    ...p ? { noteId: p } : {},
    ...L ? { free: !0 } : {}
  }, k = r === void 0 ? -1 : e.cards.findIndex((b) => b.id === r && b.laneId === n), I = k < 0 ? [...e.cards, A] : [...e.cards.slice(0, k), A, ...e.cards.slice(k)], C = t.lines === void 0 ? void 0 : ur(e, cr(t.lines).map((b) => dt(b, t.id, A.id)));
  return V({ ...e, cards: I, ...C ? { lines: C } : {} });
}
function fr(e, n, t, r) {
  const { label: o, points: s } = Fs(typeof t.label == "string" ? t.label : ""), f = un(e, t.id), g = f !== t.id && typeof t.id == "string" && at.test(t.id) ? t.id : void 0, p = { id: f, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: s, ...g ? { noteId: g } : {} }, L = r === void 0 ? -1 : e.cards.findIndex((A) => A.id === r && A.laneId === n);
  return { ...e, cards: L < 0 ? [...e.cards, p] : [...e.cards.slice(0, L), p, ...e.cards.slice(L)] };
}
function hr(e, n, t, r) {
  const o = fr(e, n, t, r), s = un(e, t.id), f = o.cards.find((p) => p.id === s);
  if (f.laneId === n) return V(o);
  const g = En(o, f, n);
  return g ? V(g) : null;
}
function pr(e, n, t) {
  const r = ye(le(e)).fromNote(e, t.label);
  if (typeof r == "string") return r;
  const o = rn(e, [{ kind: "add_card", lane: { id: n }, ...r, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in o) return o.refused.reason;
  const s = o.workshop.cards, f = un(e, t.id), g = f !== t.id && typeof t.id == "string" && at.test(t.id) ? t.id : void 0, p = lr(t.look), L = dr(t.asNote);
  return s[s.length - 1] = {
    ...s[s.length - 1],
    id: f,
    ...g ? { noteId: g } : {},
    ...p ? { look: p } : {},
    ...L ? { asNote: L } : {}
  }, o.workshop;
}
function mr(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = le(e);
  return t ? ye(t).cardText(e, n) : n.label;
}
function Lt(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = le(e);
  return t ? ye(t).noteText(e, n) : n.label;
}
function Vn(e, n) {
  const t = e.cards.find((r) => r.id === n);
  if (!t) return "That card is no longer on the board.";
  if (qe(e)) return "This card stays on the board.";
  if (e.lanes.some((r) => r.station) && !t.free) return "The token stays on the map.";
  if (e.kind === "release-plan") {
    const r = e.cards.find((o) => o.dependsOn?.includes(n));
    if (r) return `${r.label} depends on ${t.label}, so it stays a card.`;
  }
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((r) => r.cardId === n)) return `An outcome on this board depends on ${t.label}, so it stays a card.`;
  if (e.cards.some((r) => r.parentId === n)) return `${t.label} has cards under it, so it stays a card. Move them first.`;
  if (t.allowedLaneIds && t.allowedLaneIds.length < e.lanes.length) {
    const r = t.allowedLaneIds.map((s) => e.lanes.find((f) => f.id === s).label), o = r.length > 1 ? r.slice(0, -1).join(", ") + " or " + r.at(-1) : r[0];
    return `${t.label} may only be in ${o}, so it stays a card.`;
  }
  return null;
}
function Fo(e, n, t = wr(e, n)) {
  if (Vn(e, n) !== null) return null;
  const r = e.cards.filter((s) => s.id !== n).map((s) => {
    if (!s.dependsOn?.includes(n)) return s;
    const f = { ...s, dependsOn: s.dependsOn.filter((g) => g !== n) };
    return f.dependsOn.length || delete f.dependsOn, f;
  }), o = e.lines?.map((s) => dt(s, n, t));
  return V({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Ds(e, n, t = wr(e, n)) {
  const r = new Set(e.cards.filter((f) => f.id !== n).map((f) => f.id)), o = (e.lines ?? []).filter((f) => f.parentId === n || f.childId === n).map((f) => dt(f, n, t)), s = (f) => r.has(f.parentId) || r.has(f.childId);
  return { stay: o.filter(s), leave: o.filter((f) => !s(f)) };
}
function wr(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? nr(t) : n;
}
function Pt(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function $n(e, n) {
  if (e.kind) return zs;
  let t;
  try {
    t = cn(n);
  } catch (s) {
    return s instanceof Error ? s.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((s) => s.id));
  return t = sr(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((s) => s.id === t.parentId || s.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((s) => s.id === t.id) && (e.lines?.length ?? 0) >= dn ? `A workshop holds up to ${dn} lines.` : null;
}
const zs = "Lines join the cards of a lane workshop to notes and to each other.";
function Qn(e, n) {
  return $n(e, n) !== null ? null : V({ ...e, lines: ur(e, [cn(n)]) });
}
function jo(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? V({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function gr(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((f) => f.id));
  let s = `${n}->${t}`;
  for (let f = 2; o.has(s); f++) s = `${n}->${t}~${f}`;
  return cn({ showChildArrow: !0, ...r, id: s, parentId: n, childId: t });
}
function Bs(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function Pe(e, n) {
  const t = e.lanes.find((p) => p.id === n);
  if (!t) return "";
  if (e.kind === "release-plan") {
    const p = Ue(e, n);
    return t.capacity ? p + " / " + t.capacity + " points" : p + " points";
  }
  const r = le(e);
  if (r) return ye(r).caption(e, n);
  const o = Zs(e, n);
  if (o) return "$" + o.amount + " · " + o.description;
  const s = e.cards.filter((p) => p.laneId === n).length, f = e.behaviour ? me().laneLimit(e, n) : t.capacity, g = Ke(e, n);
  return f !== void 0 && g !== s ? g + " of " + f + " · " + (s - g) + (s - g === 1 ? " card" : " cards") : f !== void 0 ? s + " of " + f : s + (s === 1 ? " card" : " cards");
}
const Mn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Xn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function yr(e, n = Mn, t = 28, r) {
  const { pitch: o, row: s, top: f } = n, g = !!e.lanes[0].station, p = e.lanes.map((k) => e.cards.filter((I) => I.laneId === k.id).length), L = f + Math.max(1, ...r ?? p) * s + 36, A = e.lanes.map((k, I) => ({
    x: g ? k.station.column * (o + t) : I * o,
    y: g ? k.station.row * L : 0
  }));
  return {
    points: A,
    width: Math.max(...A.map((k) => k.x)) + o,
    height: Math.max(...A.map((k, I) => k.y + f + (g ? Math.max(1, p[I]) : p[I] + 1) * s))
  };
}
function xi() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function _n(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function kr(e) {
  const n = V(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Hs(e, n) {
  const t = kr(e), r = _n(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), V(t);
}
function Gs(e, n, t) {
  const r = kr(e);
  return r.cards.push({
    id: _n(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), V(r);
}
function Ii() {
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
function Do(e, n, t) {
  const r = V(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((A) => A.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= Yt) throw new Error("A map can have up to five stations.");
  const s = ge(t?.label), f = ge(t?.outcome, 160), g = _n(r, "station");
  let p, L = 1 / 0;
  for (let A = 0; A < jt; A++)
    for (let k = 0; k < jt; k++) {
      if (r.lanes.some((C) => C.station.column === k && C.station.row === A)) continue;
      const I = Math.abs(o.station.column - k) + Math.abs(o.station.row - A);
      I < L && (L = I, p = { column: k, row: A });
    }
  if (!p) throw new Error("There is no free station position.");
  return o.station.next.push(g), r.lanes.push({ id: g, label: s, station: { ...p, next: [], outcome: f, ...t.image === void 0 ? {} : { image: tr(t.image) } } }), r.presentationOrder?.push(g), r;
}
const Ai = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, zt = (e) => "caption-" + e, an = (e) => "column-" + e, zo = "rules-board";
function Rn(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function Ci(e, n) {
  const t = Rn(n);
  return t ? t + ":" + e : e;
}
const X = {
  lane: ln,
  card: Me,
  image: st,
  caption: zt,
  column: an,
  rules: zo,
  of(e) {
    const n = Rn(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(ln(r)),
      card: (r) => t(Me(r)),
      image: (r) => t(st(r)),
      caption: (r) => t(zt(r)),
      column: (r) => t(an(r)),
      rules: t(zo)
    };
  }
};
function br(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function vr(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function et(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, s = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${s - r} Q ${o} ${s} ${o - r} ${s} H ${r} Q 0 ${s} 0 ${s - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${s} H 0 Z`;
}
function Bo(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function Ho(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const s = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((g, p) => g + Math.max(1, Math.ceil(p.length / s)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const xr = 152, Bt = xr + 12, Us = 12;
function Ir(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function Ee(e, n = {}) {
  const t = V(e), { pitch: r, row: o, top: s } = Mn, f = t.lanes.map((I) => t.cards.filter((C) => C.laneId === I.id).length), g = (I) => Math.max(f[I], (Array.isArray(n.rows) ? n.rows[I] : n.rows) ?? 0), p = !!t.lanes[0].station, L = t.lanes.some((I) => I.station?.image), A = Ir(n.layout, t.lanes.length), k = [];
  if (p) {
    const { points: I } = yr(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach((C, b) => k.push({
      laneId: C.id,
      x: I[b].x,
      y: I[b].y + (L ? C.station.row * Bt : 0),
      width: r,
      height: s + (C.station.image ? Bt : 0) + Math.max(1, g(b)) * o,
      column: C.station.column,
      row: C.station.row
    }));
  } else {
    let I = Ar(t, A)?.below ?? 0;
    for (let C = 0; C < t.lanes.length; C += A) {
      const b = t.lanes.slice(C, C + A), P = s + (Math.max(...b.map((_, B) => g(C + B))) + 1) * o;
      b.forEach((_, B) => k.push({ laneId: _.id, x: B * r, y: I, width: r, height: P, column: B, row: C / A })), I += P + Us;
    }
  }
  return { places: k, width: Math.max(...k.map((I) => I.x + I.width)), height: Math.max(...k.map((I) => I.y + I.height)) };
}
function Ar(e, n, t = 2, r = 0) {
  const o = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? me().note(e, { x: t, y: r, width: 240 }, { fontSize: 14 }) : null;
  return o ? { note: o, below: o.options.height + 16 } : null;
}
function Ks(e, n) {
  const { pitch: t, width: r, row: o, height: s, top: f } = Mn, g = n.origin ?? { x: 0, y: 0 }, p = !!e.lanes[0].station, { places: L } = Ee(e, n), A = n.style ?? {}, k = A.textColor ?? In.fontColor, I = A.borderColor ?? In.borderColor, C = A.borderWidth ?? In.borderWidth, b = A.cornerRadius ?? 0, P = A.fontSize ?? In.fontSize, _ = A.laneFontSize ?? P + 2, B = A.captionFontSize ?? Math.max(11, P - 1), l = [], v = ($) => {
    const N = { options: {
      shapeHint: "rectangle",
      vectorPath: et($.width, $.height, b),
      foregroundColor: k,
      borderColor: I,
      borderWidth: C,
      ...A.fontFamily ? { fontFamily: A.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return l.push(N), N;
  };
  e.lanes.forEach(($, N) => {
    const D = L[N], J = g.x + D.x, R = g.y + D.y, U = $.station?.image;
    v({
      id: an($.id),
      text: "",
      name: $.label,
      xPos: J + 2,
      yPos: R,
      width: t - 4,
      height: D.height,
      vectorPath: et(t - 4, D.height, b ? b + 2 : 0),
      backgroundColor: p ? "#fcf9ed" : Bo(Xn[N], 0.6),
      borderColor: p ? "#a8b5aa" : Bo(Xn[N], 0.1),
      borderWidth: 1,
      ...p ? { borderStyle: "dashed" } : {}
    }), v({
      id: ln($.id),
      text: $.label,
      name: $.label,
      xPos: J + 8,
      yPos: R + 6,
      width: r,
      height: 58,
      backgroundColor: Xn[N],
      fontSize: Ho($.label, _, r - 16, 50)
    }), v({
      id: zt($.id),
      text: Pe(e, $.id),
      name: $.label,
      xPos: J + 8,
      yPos: R + 66,
      width: r,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: B
    }), U && l.push({ options: {
      id: st($.id),
      name: U.alt,
      text: "",
      xPos: J + 8,
      yPos: R + f,
      width: r,
      height: xr,
      shapeHint: "rectangle",
      image: U.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((he) => he.laneId === $.id).forEach((he, xe) => {
      const _e = mr(e, he), ee = p ? r - 20 : r, Ie = p ? s - 6 : s, $e = p && !he.free, te = $e ? {} : { ...A.card, ...he.look }, Je = $e ? b : A.card?.cornerRadius ?? b;
      v({
        id: Me(he.id),
        text: _e,
        name: he.label,
        xPos: J + (p ? 18 : 8),
        yPos: R + f + (U ? Bt : 0) + xe * o,
        width: ee,
        height: Ie,
        ...Je !== b ? { vectorPath: et(ee, Ie, Je) } : {},
        backgroundColor: $e ? "#ffda75" : te.backgroundColor ?? A.backgroundColor ?? In.backgroundColor,
        ...te.textColor ? { foregroundColor: te.textColor } : {},
        ...te.fontFamily ? { fontFamily: te.fontFamily } : {},
        ...te.borderColor ? { borderColor: te.borderColor } : {},
        ...te.borderWidth !== void 0 ? { borderWidth: te.borderWidth } : {},
        fontSize: Ho(_e, te.fontSize ?? P, ee - 16, Ie - 8)
      });
    });
  });
  const x = Ar(e, Ir(n.layout, e.lanes.length), g.x + 2, g.y)?.note ?? Cr(e, {
    x: g.x,
    y: g.y + Math.max(...L.map(($) => $.y + $.height)) + 16,
    width: Math.min(Math.max(...L.map(($) => $.x + $.width)), t * 2) - 4
  }, A);
  x && l.push(x);
  const S = new Map(l.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (S.get(an($.id)).relationships.associations = $.station.next.map((N) => ({
      id: $.id + "-to-" + N,
      parentId: an($.id),
      childId: an(N),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const N of $.dependsOn ?? []) {
        const D = Me(N), J = Me($.id);
        S.get(D).relationships.associations.push({
          id: `dependency-${N.length}-${N}-${$.id}`,
          parentId: D,
          childId: J,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (br(l, Rn(n.scope)), n.beside) {
    const $ = new Set(n.beside), N = new Set(l.map((R) => R.options.id)), D = /* @__PURE__ */ new Map();
    for (const R of [...N]) {
      if (!$.has(R)) continue;
      const U = vr(R, (he) => $.has(he) || N.has(he));
      N.add(U), D.set(R, U);
    }
    const J = (R) => D.get(R) ?? R;
    for (const R of l) {
      R.options.id = J(R.options.id);
      for (const U of R.relationships.associations)
        U.parentId = J(U.parentId), U.childId = J(U.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: l };
}
function Cr(e, n, t = {}) {
  return e.behaviour ? me().note(e, n, t) : null;
}
function qs(e, n) {
  const t = V(e), r = Rn(n?.scope);
  if (n?.native) return Ks(t, n);
  const { width: o, row: s, height: f, top: g } = Mn, p = [];
  function L(b, P, _, B, l, v) {
    p.push({ options: {
      id: b,
      text: P,
      name: P,
      xPos: _,
      yPos: B,
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
  const { points: A } = yr(t), k = 152, I = k + 12, C = t.lanes.some((b) => b.station?.image);
  t.lanes.forEach((b, P) => {
    const _ = A[P].x, B = A[P].y + (C ? (b.station?.row ?? 0) * I : 0), l = b.station?.image, v = t.kind === "release-plan" ? b.label + `
` + (b.capacity ? Ue(t, b.id) + " / " + b.capacity + " points" : Ue(t, b.id) + " points") : b.label;
    L(ln(b.id), v, _, B, g - 12, Xn[P]), l && p.push({ options: {
      id: st(b.id),
      name: l.alt,
      text: "",
      xPos: _,
      yPos: B + g,
      width: o,
      height: k,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((x) => x.laneId === b.id).forEach((x, S) => L(Me(x.id), mr(t, x), _, B + g + (l ? I : 0) + S * s, f, "#fffdf6"));
  });
  for (const b of t.lanes) {
    if (!b.station) continue;
    const P = p.find((_) => _.options.id === ln(b.id));
    P.relationships.associations = b.station.next.map((_) => ({ id: b.id + "-to-" + _, parentId: P.options.id, childId: ln(_), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), P.options.text = b.label + `
` + b.station.outcome, P.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const b = new Map(p.map((P) => [P.options.id, P]));
    for (const P of t.cards)
      for (const _ of P.dependsOn ?? []) {
        const B = Me(_), l = Me(P.id);
        b.get(B).relationships.associations.push({
          id: `dependency-${_.length}-${_}-${P.id}`,
          parentId: B,
          childId: l,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return br(p, r), { options: { name: t.title }, shareId: "", nodes: p };
}
function Si(e, n = {}, t) {
  const r = V(e), o = n.narrow ? void 0 : n.width;
  if (le(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: g, height: p } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(g, o ?? 0), height: p };
  }
  const { width: s, height: f } = Ee(r, {});
  return { width: Math.max(Yt * Mn.pitch, s), height: f };
}
function Js(e, n, t = 1, r = 32) {
  let o = e.x;
  const s = n.filter((f) => [f.x, f.y, f.width, f.height].every(Number.isFinite));
  for (let f = 0; f <= s.length; f++) {
    const g = s.find((p) => o < p.x + p.width + r && o + e.width > p.x - r && e.y < p.y + p.height + r && e.y + e.height > p.y - r);
    if (!g) break;
    o = t > 0 ? g.x + g.width + r : g.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const Ti = {
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
}, Ht = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Vt = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Li() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Ht.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Ht.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function Pi() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Vt.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function qe(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Vt.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => Ht.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function Ys(e, n, t) {
  const r = qe(e), o = e.cards.find((f) => f.id === n);
  if (!r || !o || o.laneId === t) return null;
  let s = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const f = e.cards.find((g) => g.laneId === t);
    if (f) {
      if (!it(e, f).some((g) => g.id === "interviews")) return null;
      s = Dt(e, f.id, "interviews");
    }
  }
  return it(s, o).some((f) => f.id === t) ? Dt(s, n, t) : null;
}
function Zs(e, n) {
  if (qe(e) !== "experiment-budget") return null;
  const t = Vt.find((s) => s.id === n), r = e.cards.filter((s) => s.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  Tt as $,
  Mn as A,
  qs as B,
  yr as C,
  Ue as D,
  it as E,
  Dt as F,
  us as G,
  pi as H,
  Jo as I,
  qe as J,
  _s as K,
  Zs as L,
  Ht as M,
  Vt as N,
  Tn as O,
  Ls as P,
  le as Q,
  nr as R,
  lt as S,
  rr as T,
  Ft as U,
  _o as V,
  dn as W,
  Jt as X,
  ki as Y,
  bi as Z,
  vi as _,
  ss as a,
  Rs as a0,
  He as a1,
  on as a2,
  Sn as a3,
  mr as a4,
  Lt as a5,
  Vn as a6,
  Fo as a7,
  Ds as a8,
  Pt as a9,
  si as aA,
  me as aB,
  di as aC,
  Ge as aD,
  Ut as aE,
  ci as aF,
  Xr as aG,
  es as aH,
  $t as aI,
  Zn as aJ,
  Xs as aK,
  oi as aL,
  fi as aM,
  hi as aN,
  mi as aO,
  wi as aP,
  gi as aQ,
  Uo as aR,
  tt as aS,
  ts as aT,
  ui as aU,
  cs as aV,
  $n as aa,
  zs as ab,
  Qn as ac,
  jo as ad,
  gr as ae,
  Bs as af,
  Pe as ag,
  xi as ah,
  _n as ai,
  Hs as aj,
  Gs as ak,
  Ii as al,
  Do as am,
  Ai as an,
  Rn as ao,
  Ci as ap,
  X as aq,
  vr as ar,
  Ee as as,
  Cr as at,
  Si as au,
  Js as av,
  Ti as aw,
  Li as ax,
  Pi as ay,
  Ys as az,
  Ln as b,
  Pn as c,
  ai as d,
  Ke as e,
  et as f,
  yi as g,
  rn as h,
  ws as i,
  ii as j,
  Et as k,
  sn as l,
  To as m,
  Xn as n,
  Ro as o,
  $o as p,
  ti as q,
  li as r,
  E as s,
  ei as t,
  ni as u,
  V as v,
  ye as w,
  Qs as x,
  Un as y,
  ri as z
};
