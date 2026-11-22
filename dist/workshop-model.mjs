import { D as De } from "./NoteDefaults-1xFW0br8.mjs";
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
  const { kind: n, version: o, stage: t, choice: s, fieldNote: a, deskNote: p, fallback: b } = e, x = (P) => typeof P == "string" && P.trim().length > 0 && P.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(P);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? s !== "field" && s !== "desk" : s !== null) || s === void 0 || !x(a) || !x(p) || !x(b) ? null : { kind: n, version: o, stage: t, choice: s, fieldNote: a.trim(), deskNote: p.trim(), fallback: b.trim() };
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
const Xe = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Ho(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: s, rightLabel: a } = e, p = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !p(s) || !p(a) ? null : { kind: n, version: o, mix: t, leftLabel: s.trim(), rightLabel: a.trim() };
}
function Do({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === Xe.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === Xe.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === Xe.leftLabel && o === Xe.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function $e(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function qt(e) {
  const n = new Map(e.cards.map((p) => [p.id, p])), o = new Map(e.lanes.map((p, b) => [p.id, b])), t = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
  function a(p) {
    if (!t.has(p.id)) {
      if (s.has(p.id)) throw new Error("Release dependencies must be acyclic.");
      s.add(p.id);
      for (const b of p.dependsOn ?? []) {
        const x = n.get(b);
        if (!x) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(x.laneId) > o.get(p.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        a(x);
      }
      s.delete(p.id), t.add(p.id);
    }
  }
  for (const p of e.cards) a(p);
  for (const p of e.lanes) {
    if (p.station) throw new Error("Release windows cannot also be map stations.");
    if ($e(e, p.id) > (p.capacity ?? 1 / 0)) throw new Error(`Release "${p.label}" exceeds its point budget.`);
  }
}
function fn(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((w, y) => [w.id, y])), s = t.get(o);
  if (s === void 0) return null;
  const a = s < t.get(n.laneId), p = /* @__PURE__ */ new Set([n.id]), b = [n];
  for (; b.length; ) {
    const w = b.pop();
    for (const y of e.cards) {
      if (p.has(y.id)) continue;
      const k = t.get(y.laneId);
      (a ? k > s && w.dependsOn?.includes(y.id) : k < s && y.dependsOn?.includes(w.id)) && (p.add(y.id), b.push(y));
    }
  }
  if (e.cards.filter((w) => p.has(w.id)).some((w) => w.allowedLaneIds && !w.allowedLaneIds.includes(o))) return null;
  const P = { ...e, cards: e.cards.map((w) => p.has(w.id) ? { ...w, laneId: o } : w) }, S = e.lanes[s].capacity;
  return S !== void 0 && $e(P, o) > S ? null : P;
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
}, Nn = /* @__PURE__ */ new Map(), Jt = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function Uo(e) {
  Nn.set(e.kind, e);
}
function Go(e) {
  return typeof e == "string" && Nn.has(e);
}
function he(e) {
  const n = Nn.get(e);
  if (!n) throw new Error(`The ${Jt[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let ln = null;
function Ko(e) {
  ln = e;
}
function qo() {
  return ln !== null;
}
function ce() {
  if (!ln) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return ln;
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
  if (a.some((b) => Zt.test(b))) {
    const b = t && e.find((x) => x.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of a) {
    if (!b.startsWith("@")) continue;
    const x = e.find((P) => P.id === b.slice(1));
    if (x) return { item: x, rank: 0 };
  }
  for (const [b, x] of nt.entries())
    for (const P of a) {
      const S = e.filter((w) => x(w.label.toLowerCase(), P.toLowerCase()));
      if (S.length === 1) return { item: S[0], rank: b };
      if (S.length > 1) return { several: S };
    }
  const p = s ? Qt(e, n, o) : null;
  return p ? { item: p, rank: nt.length } : {};
}
class tn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function $n(e, n, o, t, s = !1) {
  return { find: (x) => {
    const P = In(e, x, n, t, s);
    if (P.item) return P.item;
    const S = wt(x, n), w = S[S.length - 1];
    if (P.pointing) throw new tn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (P.several) {
      const k = [...new Set(P.several.map((C) => C.label))];
      throw new tn(k.length === 1 ? P.several.length + " " + o + "s are called " + O(k[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + O(w) + ": " + Ae(k.slice(0, 6).map(O)) + ". Use the whole name.", "ambiguous", P.several.map((C) => C.id));
    }
    const y = e.map((k) => k.label);
    throw new tn("There is no " + o + " called " + O(w) + " here." + (y.length && y.length <= 6 ? " The " + o + "s are " + Ae(y.map(O)) + "." : y.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((k) => k.id));
  }, attempt: (x) => In(e, x, n, t, s).item ?? null, rank: (x) => In(e, x, n, t, s).rank ?? 1 / 0 };
}
const gt = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], we = [...gt], _e = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], yt = gt.slice(5);
function dn(e) {
  if (e.lanes[0]?.station) return "map";
  const n = Z(e);
  return n || (e.kind === "release-plan" ? "release-plan" : ze(e) ?? "lanes");
}
const z = {
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
}, On = {
  "launch-plan": z.launchLanes,
  pipeline: z.pipelineLanes,
  budget: z.budgetLanes,
  "hiring-plan": z.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, oe = (e, n) => Object.fromEntries(we.filter((o) => !e.includes(o)).map((o) => [o, n])), te = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), J = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ae = (e) => ({ type: "ref", of: "card", about: e }), Cn = (e) => ({ map: e }), pe = oe(["map"], z.notMap), me = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), Pn = [
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
    refusals: { "release-plan": z.releaseLanes, "customer-interviews": z.keepsLanes, "experiment-budget": z.keepsLanes, map: z.mapAddLane, ...On }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: J("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": z.releaseLanes, "customer-interviews": z.keepsLanes, "experiment-budget": z.keepsLanes, ...On }
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
    refusals: { "release-plan": z.releaseCards, "customer-interviews": z.keepsCards }
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
    refusals: { "launch-plan": z.launchLanes, budget: z.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ae("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: _e,
    refusals: { ...Cn(z.mapCardLanes), ...oe([..._e, "map"], z.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ae("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...oe(["release-plan"], z.notPoints), map: z.mapPoints }
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
    refusals: { ...oe(["release-plan"], z.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
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
    refusals: { ...Cn(z.mapOutcome), ...oe([..._e, "map"], z.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ae("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: _e,
    refusals: { ...Cn(z.mapOutcome), ...oe([..._e, "map"], z.businessCards) }
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
    refusals: oe(["launch-plan"], z.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ae("The task that waits."), waitsOn: ae("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: oe(["launch-plan"], z.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ae("The task that waits."), waitsOn: ae("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: oe(["launch-plan"], z.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: me("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: oe(["launch-plan"], z.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ae("The deal or line item."), amount: me("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: oe(["pipeline", "budget"], z.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: me("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: oe(["pipeline"], z.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: J("The team giving."), to: J("The team receiving."), amount: me("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: oe(["budget"], z.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: oe(["lanes", "pipeline"], z.noRules)
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
    refusals: oe(["lanes", "pipeline"], z.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: te(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: oe(["lanes", "pipeline"], z.noRules) }
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
  const n = e ? dn(Y(e)) : void 0;
  return Pn.map((o) => {
    const t = Object.entries(o.fields), s = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, p]) => !kt(p)).map(([p]) => p)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([p, b]) => [p, no(b, n)])) }
    }, a = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: s };
    return n && (a.accepted = o.boards.includes(n), a.accepted || (a.refusal = o.refusals[n])), a;
  });
}
const en = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function to(e, n) {
  const o = !!e.lanes[0]?.station, t = $n(e.lanes, o ? en.step : en.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), s = $n(e.cards, o ? en.token : en.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: s };
  const a = (p) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (p) => a(p) ?? s.find(p),
    attempt: (p) => a(p) ?? s.attempt(p),
    rank: (p) => a(p) ? 0 : s.rank(p)
  } };
}
class W {
  constructor(n, o, t = null, s, a, p) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = s, this.candidates = a, this.limits = p;
  }
}
function cn(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function U(e, n, o = null, t) {
  try {
    return Y(e);
  } catch (s) {
    throw new W(cn(s instanceof Error ? s.message : String(s), n), "refused", o, t);
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
    const p = n.kind + " needs " + t + " as ";
    switch (s.type) {
      case "text":
        if (typeof a != "string") return p + "text.";
        break;
      case "ref":
        if (!o(a)) return p + "an id or a name.";
        break;
      case "refs":
        if (a === null && s.nullable) break;
        if (!Array.isArray(a) || a.length > s.max || !a.every(o)) return p + "a list of up to " + s.max + " ids or names" + (s.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (a === null && s.nullable) break;
        if (typeof a != "number" || !Number.isFinite(a)) return p + "a number" + (s.nullable ? " or null." : ".");
        break;
      case "image":
        if (a === null) break;
        if (!a || typeof a != "object" || typeof a.src != "string" || typeof a.alt != "string" || Object.keys(a).some((b) => b !== "src" && b !== "alt")) return p + "{src, alt} or null.";
        break;
      case "choice":
        if (!s.values.includes(a)) return p + s.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof a != "boolean") return p + "true or false.";
        break;
      case "rule":
        if (!a || typeof a != "object" || Array.isArray(a) || typeof a.kind != "string") return p + "an object with a kind.";
        break;
    }
  }
  return null;
}
function ro(e, n, o, t, s) {
  const a = structuredClone(e), p = o === "map", b = o === "release-plan", x = to(a, t), P = { lane: p ? "step" : "lane", card: p ? "token" : "card" };
  function S(r, h, v, A, T = null) {
    if (typeof v == "object") {
      const N = r.find((K) => K.id === v.id);
      if (!N) throw new W("That " + A + " is no longer on the workshop.", "gone", T);
      return N;
    }
    const _ = r.find((N) => N.id === v);
    if (_) return _;
    try {
      return h.find(v);
    } catch (N) {
      if (!(N instanceof tn)) throw N;
      const K = N.reason === "ambiguous" ? "ambiguous_reference" : N.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new W(N.message, K, T, void 0, N.candidates.length ? N.candidates : void 0);
    }
  }
  const w = (r, h = null) => S(a.lanes, x.lanes, r, "lane", h), y = (r, h = null) => S(a.cards, x.cards, r, "card", h), k = (r) => {
    try {
      return w(r);
    } catch {
      return null;
    }
  }, C = (r, h, v = {}, A = !0) => ({ board: r, said: h, changed: A, ...v }), R = (r) => a.cards.filter((h) => h.laneId === r).length, j = (r) => p ? "The presentation opens with " + O(r[0].label) + "." : "The presentation now runs " + r.map((h) => O(h.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return ce().edit(a, n, s, {
      lane: (r) => w(r),
      card: (r) => y(r),
      done: (r, h, v) => C(r, h, v),
      refuse: (r, h = {}) => {
        throw new W(r, h.code ?? "refused", h.laneId ?? null, h.cardId);
      }
    });
  if (yt.includes(o)) {
    n.kind === "add_card" && rt(n, o, w(n.lane).id);
    const r = {
      card: (v) => y(v),
      lane: (v) => w(v),
      refuse: (v, A = {}) => {
        throw new W(v, A.code ?? "refused", A.laneId ?? null, A.cardId, void 0, A.limits);
      },
      settle: (v, A = null, T) => U(v, o, A, T),
      done: (v, A, T) => C(v, A, T)
    }, h = he(o).edit(a, n, r);
    if (h) return h;
  }
  switch (n.kind) {
    case "rename_workshop": {
      a.title = n.title;
      const r = U(a, o);
      return C(r, "Renamed the " + (p ? "map" : "workshop") + " to " + O(r.title) + ".");
    }
    case "rename_lane": {
      const r = w(n.lane), h = r.label;
      r.label = n.label;
      const v = U(a, o, r.id);
      return C(v, "Renamed " + O(h) + " to " + O(v.lanes.find((A) => A.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = y(n.card), h = r.label;
      r.label = n.label;
      const v = U(a, o, r.laneId, r.id);
      return C(v, "Renamed " + O(h) + " to " + O(v.cards.find((A) => A.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new W("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new W("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Ao(a, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (v) {
        throw new W(cn(v.message, o), "refused");
      }
      const h = r.lanes[r.lanes.length - 1];
      return C(r, "Added the lane " + O(h.label) + ".", { laneId: h.id });
    }
    case "remove_lane": {
      const r = w(n.lane), h = a.cards.filter((v) => v.laneId === r.id);
      if (p) {
        if (h.length) throw new W(O(h[0].label) + " is at " + O(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new W("A map needs at least two steps.", "refused", r.id);
      } else {
        if (h.length) throw new W(O(r.label) + " holds " + h.length + (h.length === 1 ? " card" : " cards") + ". Move or remove " + (h.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new W("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((v) => v !== r);
      for (const v of a.lanes) v.station && (v.station.next = v.station.next.filter((A) => A !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((v) => v !== r.id));
      for (const v of a.cards) v.allowedLaneIds && (v.allowedLaneIds = v.allowedLaneIds.filter((A) => A !== r.id));
      return nn(a, (v) => v.laneId === r.id), a.behaviour && (a.behaviour = ce().dropLane(a.behaviour, r.id)), C(U(a, o), "Removed the " + P.lane + " " + O(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = w(n.lane);
      if (p) {
        if (n.allowedLanes !== void 0) throw new W(z.mapCardLanes, "not_on_this_board", r.id);
        let T = n.label;
        if (T === void 0) {
          let H = a.cards.length + 1;
          for (; a.cards.some((V) => V.label === "Token " + H); ) H++;
          T = "Token " + H;
        }
        const _ = new Set([...a.lanes, ...a.cards].map((H) => H.id));
        let N = 1;
        for (; _.has("token-" + N); ) N++;
        a.cards.push({ id: "token-" + N, label: T, laneId: r.id });
        const K = U(a, o, r.id);
        return C(K, "Added " + O(K.cards[K.cards.length - 1].label) + " at " + O(r.label) + ".", { laneId: r.id, cardId: "token-" + N });
      }
      if (rt(n, o, r.id), n.label === void 0 || !n.label.trim()) throw new W("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new W("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && R(r.id) >= r.capacity)
        throw new W(O(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const h = n.allowedLanes && [...new Set(n.allowedLanes.map((T) => w(T).id))];
      let v;
      try {
        v = $o(a, r.id, { label: n.label, ...h && { allowedLaneIds: h } });
      } catch (T) {
        throw new W(cn(T.message, o), "refused", r.id);
      }
      const A = v.cards[v.cards.length - 1];
      return C(v, "Added " + O(A.label) + " to " + O(r.label) + ".", { laneId: r.id, cardId: A.id });
    }
    case "remove_card": {
      const r = y(n.card);
      if (p && a.cards.length === 1) throw new W("A map needs at least one token.", "refused", r.laneId, r.id);
      if (b && a.cards.length === 1) throw new W("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && a.cards.length === 1) throw new W("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((h) => h !== r);
      for (const h of a.cards)
        h.dependsOn?.includes(r.id) && (h.dependsOn = h.dependsOn.filter((v) => v !== r.id), h.dependsOn.length || delete h.dependsOn);
      return nn(a, (h) => h.cardId === r.id), C(U(a, o, r.laneId), "Removed the " + P.card + " " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? a.lanes.find((A) => A.id === n.lane.id) ?? null : k(n.lane), h = y(n.card, r?.id ?? null), v = w(n.lane, h.laneId);
      return E(h, v);
    }
    case "advance_card": {
      const r = y(n.card), h = a.lanes.find((A) => A.id === r.laneId), v = h.station.next.map((A) => a.lanes.find((T) => T.id === A)).filter((A) => !!A);
      if (!v.length) throw new W(O(r.label) + " is at " + O(h.label) + ", and no path leads on from there.", "refused", h.id, r.id);
      if (v.length > 1)
        throw new W("From " + O(h.label) + " the path goes to " + v.map((A) => O(A.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + v[0].label + "”.", "refused", h.id, r.id);
      return E(r, v[0]);
    }
    case "set_lane_capacity": {
      const r = w(n.lane), h = a.behaviour && ce().setLimit(a, r.id, n.capacity, s);
      if (typeof h == "string") throw new W(h, "refused", r.id);
      if (h) return C(h, O(r.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: r.id });
      const v = p ? "token" : b ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, C(U(a, o, r.id), p ? "Removed the limit at " + O(r.label) + "." : O(r.label) + " now holds any number of " + v + "s.", { laneId: r.id });
      const A = b ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > A)
        throw new W((p ? "A step" : "A lane") + " can hold from 1 to " + A + " " + v + "s.", "refused", r.id);
      const T = b ? a.cards.reduce((_, N) => _ + (N.laneId === r.id ? N.points ?? 1 : 0), 0) : R(r.id);
      if (T > n.capacity)
        throw new W(O(r.label) + " already holds " + T + " " + v + (T === 1 ? "" : "s") + ". Move some " + (p ? "on" : "out") + " first, or choose a higher " + (b ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, C(U(a, o, r.id), O(r.label) + " now holds up to " + n.capacity + " " + v + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = y(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, C(U(a, o, r.laneId, r.id), O(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const h = [...new Set(n.lanes.map((A) => w(A)))], v = a.lanes.find((A) => A.id === r.laneId);
      if (!h.includes(v)) throw new W(O(r.label) + " is in " + O(v.label) + " now. Include " + O(v.label) + ", or move the card first.", "refused", v.id, r.id);
      return r.allowedLaneIds = h.map((A) => A.id), C(U(a, o, r.laneId, r.id), O(r.label) + " can now go only in " + Ae(h.map((A) => O(A.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = y(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new W("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, C(U(a, o, r.laneId, r.id), O(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = y(n.card), h = [...new Set(n.dependsOn.map((A) => y(A)))], v = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const A = h.filter((T) => r.dependsOn?.includes(T.id));
        if (!A.length) throw new W(O(r.label) + " does not depend on " + Ae(h.map((T) => O(T.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((T) => !A.some((_) => _.id === T)), r.dependsOn.length || delete r.dependsOn, C(U(a, o, r.laneId, r.id), O(r.label) + " no longer depends on " + Ae(A.map((T) => O(T.label))) + ".", v);
      }
      if (!h.length) {
        if (n.mode === "add") throw new W("Name the features " + O(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, C(U(a, o, r.laneId, r.id), O(r.label) + " no longer depends on anything.", v);
      }
      if (h.includes(r)) throw new W("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...h.map((A) => A.id)])], C(U(a, o, r.laneId, r.id), O(r.label) + " now depends on " + Ae(h.map((A) => O(A.label))) + ".", v);
    }
    case "set_outcome": {
      const r = y(n.card), h = w(n.lane), v = a.signals ?? (a.signals = []), A = n.label, T = A === void 0 ? v.filter((H) => H.cardId === r.id && H.laneId === h.id) : v.filter((H) => H.cardId === r.id && H.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && T.length > 1) throw new W("Two outcomes on this card have that name.", "refused", h.id, r.id);
      if (!T.length && v.length >= 24) throw new W("A workshop can have up to 24 outcomes. Remove one first.", "refused", h.id, r.id);
      let _ = 1;
      for (; v.some((H) => H.id === "signal-" + _); ) _++;
      const K = { label: A ?? T[0]?.label ?? (r.label + " in " + h.label).slice(0, 80).trim(), cardId: r.id, laneId: h.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return T.length ? Object.assign(T[0], K) : v.push({ id: "signal-" + _, ...K }), C(U(a, o, h.id, r.id), "When " + O(r.label) + " is in " + O(h.label) + " the workshop says " + O(n.whenPresent) + ". Otherwise it says " + O(n.whenAbsent) + ".", { laneId: h.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = y(n.card), h = (a.signals ?? []).filter((v) => v.cardId === r.id);
      if (n.outcome === void 0) {
        if (!h.length) throw new W(O(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        nn(a, (v) => v.cardId === r.id);
      } else {
        const v = S(h, $n(h, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        nn(a, (A) => A.id === v.id);
      }
      return C(U(a, o, r.laneId, r.id), "Removed the outcome from " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((h) => w(h));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new W("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((h) => h.id), C(U(a, o), j(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new W("Say before or after, not both.", "invalid_edit");
      const r = w(n.lane), h = n.before ?? n.after, v = h === void 0 ? void 0 : w(h);
      if (v && v.id === r.id) throw new W("Choose two different scenes.", "refused", r.id);
      const A = zn(a).filter((T) => T.id !== r.id);
      return A.splice(v ? A.findIndex((T) => T.id === v.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = A.map((T) => T.id), C(U(a, o, r.id), j(A), { laneId: r.id });
    }
    case "add_station": {
      const r = w(n.from);
      let h;
      try {
        h = ht(a, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new W(A.message, "refused", r.id);
      }
      const v = h.lanes[h.lanes.length - 1];
      return C(h, "Added a path from " + O(r.label) + " to " + O(v.label) + ".", { laneId: v.id });
    }
    case "insert_station": {
      const r = w(n.before), h = n.from === void 0 ? void 0 : w(n.from), v = h ? [h] : a.lanes.filter((_) => _.station.next.includes(r.id));
      if (h && !h.station.next.includes(r.id))
        throw new W("There is no path from " + O(h.label) + " to " + O(r.label) + ". Try “Add " + n.label + " after " + h.label + "”.", "refused", h.id);
      if (!v.length) throw new W("Nothing leads to " + O(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let A;
      try {
        A = ht(a, v[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (_) {
        throw new W(_.message, "refused", r.id);
      }
      const T = A.lanes[A.lanes.length - 1];
      for (const _ of A.lanes)
        v.some((N) => N.id === _.id) && (_.station.next = [...new Set(_.station.next.map((N) => N === r.id ? T.id : N))]);
      return T.station.next = [r.id], C(U(A, o, T.id), "Added " + O(T.label) + " before " + O(r.label) + ".", { laneId: T.id });
    }
    case "connect_stations": {
      const r = w(n.from), h = w(n.to);
      if (r.id === h.id) throw new W("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(h.id) ? C(a, O(r.label) + " already leads to " + O(h.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(h.id), C(U(a, o, r.id), "Connected " + O(r.label) + " to " + O(h.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = w(n.from), h = w(n.to);
      if (!r.station.next.includes(h.id)) throw new W("There is no path between " + O(r.label) + " and " + O(h.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((v) => v !== h.id), C(U(a, o, r.id), "Removed the path from " + O(r.label) + " to " + O(h.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = w(n.station);
      return r.station.outcome = n.outcome, C(U(a, o, r.id), "Changed what happens at " + O(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = w(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), C(U(a, o, r.id), "Moved " + O(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = w(n.station);
      return n.image === null ? (delete r.station.image, C(U(a, o, r.id), "Removed the image at " + O(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, C(U(a, o, r.id), "Updated the image at " + O(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = w(n.station);
      if (!r.station.image) throw new W("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, C(U(a, o, r.id), "Updated the image description at " + O(r.label) + ".", { laneId: r.id });
    }
  }
  throw new W("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function E(r, h) {
    const v = { laneId: h.id, cardId: r.id };
    if (r.laneId === h.id)
      return C(e, O(r.label) + " is already " + (p ? "at " : "in ") + O(h.label) + ".", v, !1);
    const A = Ge(e, r.id, h.id);
    if (!A) throw new W(on(e, r.id, h.id) ?? "That move is not available.", "refused", h.id, r.id);
    return C(U(A, o, h.id, r.id), "Moved " + O(r.label) + " to " + O(h.label) + ".", v);
  }
}
function rt(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount", "band"].find((s) => e[s] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? s !== "amount" && (s !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && s === "amount"));
  if (t) throw new W(t === "amount" ? z.notAmounts : z.notTasks, "not_on_this_board", o);
}
function nn(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function Ne(e, n, o = {}) {
  const t = (S) => ({ refused: { index: 0, kind: null, laneId: null, ...S } });
  let s;
  try {
    s = Y(e);
  } catch (S) {
    return t({ reason: "The workshop cannot be read: " + (S instanceof Error ? S.message : String(S)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const a = s, p = [], b = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [S, w] of n.entries()) {
    const y = w?.kind, k = Pn.find((h) => h.kind === y);
    if (!w || typeof w != "object" || !k)
      return t({
        index: S,
        kind: typeof y == "string" ? y : null,
        code: "invalid_edit",
        reason: "There is no edit called " + O(String(y)) + ". The edits are " + Ae(Pn.map((h) => h.kind)) + "."
      });
    const C = oo(w, k);
    if (C) return t({ index: S, kind: k.kind, code: "invalid_edit", reason: C });
    const R = dn(s);
    if (!k.boards.includes(R))
      return t({ index: S, kind: k.kind, code: "not_on_this_board", reason: k.refusals[R] ?? "This workshop does not take " + k.kind + "." });
    let j;
    try {
      j = ro(s, w, R, o.selection, b);
    } catch (h) {
      if (!(h instanceof W)) throw h;
      return t({
        index: S,
        kind: k.kind,
        reason: h.reason,
        code: h.code,
        laneId: h.laneId,
        ...h.cardId && { cardId: h.cardId },
        ...h.candidates && { candidates: h.candidates },
        ...h.limits && { limits: h.limits }
      });
    }
    const E = s.behaviour && !Xt(k.kind) ? ce().check(s, j.board) : null;
    if (E && "refused" in E)
      return t({ index: S, kind: k.kind, reason: E.refused.sentence, code: "refused", laneId: E.refused.laneId, cardId: E.refused.cardId });
    const r = io(s, j.board);
    if (r) return t({ index: S, kind: k.kind, reason: r, code: "not_on_this_board", laneId: j.laneId ?? null });
    s = j.board, p.push({
      index: S,
      kind: k.kind,
      said: j.said,
      changed: j.changed ?? !0,
      ...j.laneId && { laneId: j.laneId },
      ...j.cardId && { cardId: j.cardId }
    });
  }
  const x = new Map(a.cards.map((S) => [S.id, S.laneId])), P = s.cards.flatMap((S) => {
    const w = x.get(S.id);
    return w === void 0 || w === S.laneId ? [] : [{ cardId: S.id, fromLaneId: w, toLaneId: S.laneId }];
  });
  return { workshop: s, report: { edits: p, movedCards: P } };
}
function ao(e, n) {
  const o = Z(e);
  if (o === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const t = e.lanes.find((s) => {
      const a = n.lanes.find((p) => p.id === s.id);
      return s.role !== a.role || s.probability !== a.probability;
    });
    if (t) return `${t.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (o === "budget") {
    const t = e.budget, s = n.budget;
    if (!s || t.total !== s.total || t.currency !== s.currency || t.step !== s.step) return "The total cannot change. Move money between teams instead.";
    const a = e.lanes.find((p) => {
      const b = n.lanes.find((x) => x.id === p.id);
      return p.floor !== b.floor || p.cap !== b.cap || p.capacity !== b.capacity;
    });
    if (a) return `${a.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((s) => s.id === t.id).capacity) ? z.launchLanes : o && he(o).fixed?.(e, n) || null;
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
  "hiring-plan": "hiring plan",
  nest: "nested board"
};
function io(e, n) {
  const o = Y(e), t = dn(o);
  let s;
  try {
    s = Y(n);
  } catch (x) {
    return cn(x instanceof Error ? x.message : String(x), t);
  }
  const a = dn(s), p = (x, P) => x.lanes.length === P.lanes.length && x.lanes.every((S) => P.lanes.some((w) => w.id === S.id)), b = (x, P) => x.lanes.every((S, w) => P.lanes[w]?.id === S.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && a !== t)
    return p(o, s) ? z.keepsCards : z.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, s)) return z.keepsOrder;
  if (Z(o) && a === t && !(p(o, s) && b(o, s))) return On[t];
  if (Z(o) && a === t) {
    const x = ao(o, s);
    if (x) return x;
  }
  if (t === "release-plan" && a === "release-plan") {
    if (!p(o, s)) return z.releaseLanes;
    if (!b(o, s)) return z.releaseOrder;
    if (s.cards.some((x) => !o.cards.some((P) => P.id === x.id))) return z.releaseCards;
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
    const p = /* @__PURE__ */ new Set([a.id]);
    let b = a.after;
    for (; b !== null; ) {
      if (p.has(b) || !t.has(b) || s.includes(a.id) && !s.includes(b)) return null;
      p.add(b), b = t.get(b).after;
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
  const p = s?.layer(e);
  let b = null, x = null, P = !!o.readOnly, S = P || a(t), w = !1;
  const y = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
  let E = null, r = null, h = null, v = null;
  const A = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
  let _ = null, N = null;
  function K(i, l) {
    N && clearTimeout(N.timer), N = { name: i, reason: l, timer: setTimeout(() => {
      N = null, w || D(x ?? t);
    }, 3e3) };
  }
  let H = Promise.resolve(), V = null, G = dt(o.layout);
  const Oe = { ...o.style };
  let ie = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Set(), Pe = null, re = !1;
  Le(t);
  const q = o.origin ? { x: o.origin.x, y: o.origin.y } : ko(e), ke = (i) => j.get(i) ?? i, le = (i) => go(ke(i));
  function se(i) {
    const l = R.get(i);
    if (l) return l;
    if (y.has(i) && !j.has(i) || !e.nodes.one?.(i)) return i;
    const u = Et(i, (m) => !!e.nodes.one?.(m) || j.has(m));
    return R.set(i, u), j.set(u, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${u}".`), u;
  }
  const xe = {
    governs(i) {
      if (y.get(i.id) !== i) return null;
      const l = le(i.id)?.kind;
      return l === "card" ? { canMove: !S, canEditText: !S && !x && t.kind !== "release-plan" } : l === "lane" ? { canMove: !1, canEditText: !S && !x } : l === "handle" ? { canMove: !S && !x, canEditText: !1 } : wo;
    },
    onStart(i, l) {
      const u = le(i.id), m = { x: l.x - (i.options.x ?? 0), y: l.y - (i.options.y ?? 0) };
      if (u.kind === "handle") {
        const d = !S && !x && s ? s.handleDrag(t, ke(i.id), m, G) : null;
        return d ? (Q(), Ce(), N && (clearTimeout(N.timer), N = null), b = { name: ke(i.id), follow: d, last: null }, !0) : !1;
      }
      const I = u.key;
      if (S || x || !t.cards.some((d) => d.id === I)) return !1;
      Q(), Ce();
      let c = null;
      try {
        c = (s?.chooser ?? o.chooseCandidate)?.(t, I, m, G) ?? null;
      } catch (d) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", d);
      }
      return E = { cardId: I, evaluate: c, grab: m, outcome: { kind: "home" } }, D(t, { skip: I }), !0;
    },
    onMove(i, l) {
      if (b) {
        b.last = b.follow(He(l)), D(b.last.next, { grip: b.name }), B(o.onPreview, b.last.next === t ? null : b.last.next);
        return;
      }
      if (!E) return;
      const u = Un(E.cardId, l, E.evaluate);
      if (yo(u, E.outcome)) return;
      E.outcome = u;
      const m = u.kind === "candidate" ? u.next : null;
      D(m ?? t, { skip: E.cardId }), B(o.onPreview, m);
    },
    onEnd(i, l) {
      if (b) {
        const { follow: d, name: f } = b, g = d(He(l));
        b = null, B(o.onPreview, null), g.refusal ? (K(f, g.refusal), D(t), e.announce?.(g.refusal), B(o.onRefuse, { laneId: null, reason: g.refusal })) : Qe(g.next, {}) || D(t);
        const L = vn(t, f);
        return L ? { accept: !0, settle: L } : { accept: !1 };
      }
      if (!E) return { accept: !1 };
      const { cardId: u, evaluate: m } = E, I = Un(u, l, m), c = t.cards.find((d) => d.id === u);
      if (E = null, B(o.onPreview, null), I.kind === "candidate" && s) {
        if (!Qe(I.next, { cardId: u, laneId: I.laneId }, u))
          return D(t, { skip: u }), { accept: !1 };
        I.said && (K("card-" + u, I.said), e.announce?.(I.said));
        const d = vn(t, ke(i.id));
        return d ? { accept: !0, settle: d } : { accept: !0 };
      }
      if (I.kind === "candidate") {
        t = I.next, D(t, { skip: u });
        const d = t.lanes.find((g) => g.id === I.laneId);
        e.announce?.(`${c.label} moved to ${d.label}. ${ge(t, d.id)}.`), B(o.onChange, t, { cardId: u, laneId: I.laneId });
        const f = vn(t, ke(i.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (I.kind === "refused")
        Ut(c.label, { cardId: u, laneId: I.laneId, reason: I.reason }), I.near && K("card-" + u, I.reason);
      else if (I.kind === "outside" && rn(t) && !qe()) {
        const d = an(t, u);
        if (!d)
          return bn(u, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
        D(t, { skip: u }), e.announce?.(d), B(o.onRefuse, { cardId: u, laneId: null, reason: d });
      } else
        D(t, { skip: u }), I.kind === "outside" && (e.announce?.(`${c.label} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: u, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (b) {
        b = null, B(o.onPreview, null), D(t);
        return;
      }
      const l = E && t.cards.find((u) => u.id === E.cardId);
      E = null, B(o.onPreview, null), D(t, { skip: le(i.id)?.key }), l && e.announce?.(`Move cancelled. ${l.label} stays where it was.`);
    },
    onTextCommit(i, l, u) {
      const m = le(i.id);
      if (!m || S || x) return !1;
      let I = l.replace(/\s+/g, " ").trim();
      const c = [], d = Z(t), f = d && m.kind === "card" ? he(d).renamed(t, m.key, I) : null;
      f && (I = f.label, c.push(...f.edits));
      const g = m.kind === "lane" ? { laneId: m.key, label: I } : { cardId: m.key, label: I };
      c.unshift(m.kind === "lane" ? { kind: "rename_lane", lane: { id: m.key }, label: I } : { kind: "rename_card", card: { id: m.key }, label: I });
      const L = Ne(t, c);
      if ("refused" in L) {
        const { reason: $ } = L.refused;
        return e.announce?.(`${u} keeps its name. ${$}`), B(o.onRefuse, { ...m.kind === "lane" ? { laneId: m.key } : { cardId: m.key }, rename: g, reason: $ }), !1;
      }
      return JSON.stringify(L.workshop) === JSON.stringify(t) ? (D(t), !1) : (t = L.workshop, D(t), e.announce?.(f ? L.report.edits.map(($) => $.said).join(" ") : `${u} renamed to ${I}.`), B(o.onChange, t, { rename: g, ...s ? { edits: c } : {} }), f ? !1 : I);
    },
    onKeyDown(i, l) {
      const u = le(i.id);
      if (S || x || E || b || l.ctrlKey || l.metaKey || l.altKey) return !1;
      if (h && (h.node !== i.id || !["Enter", "Escape"].includes(l.key) && l.key.toLowerCase() !== h.key) && Kn(), h && l.key === "Escape")
        return l.preventDefault(), Kn(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (h && l.key === "Enter") {
        l.preventDefault();
        const d = h.choices[h.at];
        return h = null, B(o.onPreview, null), t = d.next, D(t), e.announce?.(d.done), B(o.onChange, t, { ...u?.kind === "card" ? { cardId: u.key } : {}, edits: d.edits }), !0;
      }
      const m = s?.keyChoices?.(t, ke(i.id), l.key);
      if (m) {
        l.preventDefault();
        const d = [], f = [];
        for (const $ of typeof m == "string" ? [] : m) {
          const F = Ne(t, $.edits);
          "refused" in F ? f.push(`${$.said}: ${F.refused.reason}`) : d.push({ ...$, next: F.workshop, done: F.report.edits.map((M) => M.said).join(" ") });
        }
        if (!d.length)
          return e.announce?.(typeof m == "string" ? m : f.join(" ")), !0;
        const g = h && h.node === i.id ? (h.at + 1) % d.length : 0;
        h = { node: i.id, key: l.key.toLowerCase(), choices: d, at: g }, D(d[g].next), B(o.onPreview, d[g].next);
        const L = d.length > 1 ? ` (${g + 1} of ${d.length}). Press ${l.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${d[g].said}${L} Enter to make it, Escape to cancel.`), !0;
      }
      const I = s?.keyEdit?.(t, ke(i.id), { key: l.key, shiftKey: l.shiftKey });
      if (I) {
        l.preventDefault();
        const d = Ne(t, I);
        return "refused" in d ? (e.announce?.(d.refused.reason), B(o.onRefuse, { laneId: d.refused.laneId, ...u?.kind === "card" ? { cardId: u.key } : {}, reason: d.refused.reason })) : Qe(d.workshop, u?.kind === "card" ? { cardId: u.key } : {}), !0;
      }
      if (u?.kind !== "card") return !1;
      const c = t.cards.find((d) => d.id === u.key);
      if (!c) return !1;
      if (l.key === "ArrowLeft" || l.key === "ArrowRight")
        return l.preventDefault(), Gn(c.id, l.key === "ArrowLeft" ? -1 : 1), !0;
      if ((l.key === "ArrowUp" || l.key === "ArrowDown") && zt())
        return l.preventDefault(), Gn(c.id, l.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== c.id) return !1;
      if (l.key === "Enter") {
        l.preventDefault();
        const { laneId: d, next: f, spot: g } = r;
        if (r = null, d === null)
          return B(o.onPreview, null), bn(c.id, g), !0;
        const L = t;
        t = f, D(t), Ie(d), B(o.onPreview, null);
        const $ = t.lanes.find((F) => F.id === d);
        return e.announce?.(`${c.label} moved to ${$.label}. ${ge(t, d)}.`), B(o.onChange, t, { cardId: c.id, laneId: d, ...s ? { edits: s.editsBetween(L, t) } : {} }), !0;
      }
      return l.key === "Escape" ? (l.preventDefault(), Ce(), e.announce?.(`Move cancelled. ${c.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((l) => y.get(l.id) === l).map((l) => l.id);
      re = i.length === 1, y.clear(), k.clear(), C.clear(), R.clear(), j.clear(), E = null, r = null, D(x ?? t, { animate: !1 }), i.length === 1 && (H = H.then(() => {
        re = !1;
        const l = y.get(i[0]);
        if (!w && l && !(e.getSelectedNodes?.() ?? []).length) {
          const u = () => e.selectNodes?.([l]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(u) : u();
        }
        wn();
      }));
    }
  };
  xe.onFreeMove = (i, l) => {
    if (!Je() || i.options?.isComment) return gn();
    const u = Ye(l), m = Ve(i), I = t.lanes.filter((f) => !je(i) && Me(t, f.id, m) === null).map((f) => f.id), c = u && s?.noteUnder?.(t, He(l), G);
    c && (m.under = c);
    const d = u ? je(i) ?? Me(t, u, m) : null;
    v && v.noteId === i.id && v.laneId === u && v.refusal === d || (v = { noteId: i.id, laneId: u, refusal: d, open: I }, Se());
  }, xe.onFreeDrop = (i, l, u) => {
    if (gn(), !Je() || i.options?.isComment) return;
    const m = Ye(l);
    if (!m) return;
    const I = Ve(i), c = s?.noteUnder?.(t, He(l), G);
    c && (I.under = c);
    const d = t.lanes.find((g) => g.id === m), f = je(i) ?? Me(t, m, I);
    return f ? (Q(!1), _ = { laneId: m, reason: f, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${yn(I.label)} can't go in ${d.label}. ${f}`), B(o.onRefuse, { noteId: i.id, laneId: m, reason: f }), "refused") : (kn([{ node: i, offer: I, from: u }], m), "taken");
  }, xe.onFreeGroupDrop = (i, l, u) => {
    if (gn(), !Je() || i.some((f) => f.options?.isComment)) return;
    const m = Ye(l);
    if (!m) return;
    const I = t.lanes.find((f) => f.id === m), c = i.map((f) => ({ node: f, offer: Ve(f) })), d = Ht(c, m);
    if (d) {
      Q(!1), _ = { laneId: m, reason: d, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${qn(c.map((f) => yn(f.offer.label)))} can't go in ${I.label}. ${d}`);
      for (const { node: f } of c) B(o.onRefuse, { noteId: f.id, laneId: m, reason: d });
      return "refused";
    }
    return kn(c.map((f, g) => ({ ...f, from: u?.[g] })), m), "taken";
  }, xe.onFreeTextCommit = (i) => {
    if (!Je() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const l = i.options ?? {}, u = Ye({ x: (l.x ?? 0) + (l.width ?? 0) / 2, y: (l.y ?? 0) + (l.height ?? 0) / 2 });
    if (!u) return;
    const m = Ve(i), I = t.lanes.find((L) => L.id === u), c = je(i) ?? Me(t, u, m);
    if (!c) {
      kn([{ node: i, offer: m }], u);
      return;
    }
    Q(!1), _ = { laneId: u, reason: c, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${yn(m.label)} can't go in ${I.label}. ${c} It is beside the board.`), B(o.onRefuse, { noteId: i.id, laneId: u, reason: c });
    const { width: d } = Le(t), f = Math.round(q.x + d + 32), g = Math.round(l.y ?? q.y);
    i.position(f, g, () => e.updateSelectionResizeRotate?.(), void 0, Sn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [at({ ...i.options, x: f, y: g })] });
  }, xe.undoState = () => ({ cards: t.cards.map((i) => ({ ...i })), pairs: [...A] }), xe.onUndoRestore = (i, l) => {
    if (w) return;
    const u = new Map((i?.cards ?? []).map((c) => [c.id, c])), m = new Map(i?.pairs ?? []), I = (c) => A.get(c) ?? m.get(c) ?? c;
    for (const c of l.added) {
      const d = I(c), f = t.cards.find((g) => g.id === d);
      f && (t = Y({ ...t, cards: t.cards.filter((g) => g !== f) }), D(t), lt(B(o.onChange, t, { cardId: d, cardToNote: { noteId: c } })));
    }
    for (const c of l.removed) {
      const d = I(c), f = u.get(d);
      if (!f || t.cards.some((M) => M.id === d)) continue;
      const g = { id: d, label: f.label, ...f.look ? { look: f.look } : {}, ...f.asNote ? { asNote: f.asNote } : {} }, L = [f.laneId, ...t.lanes.map((M) => M.id)].find((M) => Be(t, M, g));
      if (!L) {
        e.announce?.(`${f.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Dt(Be(t, L, g), d, i?.cards ?? []), d !== c && A.set(c, d), D(t);
      const $ = t.cards.findIndex((M) => M.id === d), F = t.cards.slice($ + 1).find((M) => M.laneId === L)?.id;
      lt(B(o.onChange, t, { cardId: d, laneId: L, noteToCard: {
        noteId: c,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...F ? { before: F } : {}
      } }));
    }
  };
  const Wt = e.setDragPolicy(xe), Ft = o.onSelect && e.onSelectionChange?.(() => wn()), Bn = () => {
    r && Ce();
  };
  e.element?.addEventListener?.("pointerdown", Bn, !0), D(t, { animate: !1 });
  function Un(i, l, u) {
    const m = t.cards.find(($) => $.id === i);
    if (!m) return { kind: "outside" };
    if (s) {
      const $ = He(l), F = s.refusalAt(t, i, E?.grab ?? { x: 0, y: 0 }, $, G);
      if (F && !F.lands) return { kind: "refused", laneId: F.laneId, reason: F.reason };
      const { width: M, height: de } = Le(t);
      if ($.x < -40 || $.y < -40 || $.x > M + 40 || $.y > de + 40) return { kind: "outside" };
      let X = t;
      try {
        X = u?.($) ?? t;
      } catch (Re) {
        console.warn("WORKSHOP: the board kit's chooser threw", Re);
      }
      return JSON.stringify(X) === JSON.stringify(t) ? F ? { kind: "refused", laneId: F.laneId, reason: F.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: X.cards.find((Re) => Re.id === i)?.laneId ?? m.laneId, next: X, ...F && { said: F.reason } };
    }
    const I = t.lanes.map(($) => y.get(se(ne.column($.id)))).filter(Boolean), c = e.hitTestNodes(l, I, { padding: 6 }), d = c ? le(c.id).key : null;
    if (!d) return { kind: "outside" };
    if (d === m.laneId) return { kind: "home" };
    const f = Ge(t, i, d);
    if (!f) return { kind: "refused", laneId: d, reason: on(t, i, d) ?? "That move is not available." };
    if (!u) return { kind: "candidate", laneId: d, next: f };
    let g = null;
    try {
      g = u({ x: l.x - q.x, y: l.y - q.y });
    } catch ($) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", $), { kind: "candidate", laneId: d, next: f };
    }
    const L = g?.cards.find(($) => $.id === i)?.laneId;
    return !g || !L || L === m.laneId ? { kind: "home" } : { kind: "candidate", laneId: L, next: g };
  }
  function zt() {
    return s ? !1 : new Set(We(t, { layout: G }).places.map((i) => i.row)).size > 1;
  }
  function Gn(i, l, u = !1) {
    const m = t.cards.find(($) => $.id === i), I = ct(t, i), c = r?.cardId === i && r.laneId === null ? r.side : void 0;
    if (c !== void 0) {
      if (u || l === c) return;
      const $ = c > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Ce(), $.id === m.laneId) {
        Ie($.id, x ?? t), e.announce?.(`${m.label} is back in ${$.label}.`);
        return;
      }
      if (I.includes($)) {
        const M = Ge(t, i, $.id);
        r = { cardId: i, laneId: $.id, next: M }, D(M), Ie($.id, M), B(o.onPreview, M), e.announce?.(`${m.label} to ${$.label}: ${ge(M, $.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const F = on(t, i, $.id) ?? "That move is not available.";
      Q(), _ = { laneId: $.id, reason: F, timer: setTimeout(() => Q(), 1500) }, D(x ?? t), Ie($.id, x ?? t), e.announce?.(`${m.label} can't move to ${$.label}. ${F}`), B(o.onRefuse, { cardId: i, laneId: $.id, reason: F });
      return;
    }
    const d = r?.cardId === i ? r.laneId : m.laneId;
    let f;
    if (u) {
      const { places: $ } = We(t, { layout: G }), F = $.find((M) => M.laneId === d);
      f = $.filter((M) => M.column === F.column && (M.row - F.row) * l > 0).sort((M, de) => (M.row - de.row) * l).map((M) => t.lanes.find((de) => de.id === M.laneId));
    } else {
      const $ = t.lanes.findIndex((F) => F.id === d);
      f = l > 0 ? t.lanes.slice($ + 1) : t.lanes.slice(0, $).reverse();
    }
    const g = f.find(($) => I.includes($));
    if (Q(), !g) {
      const $ = f[0];
      if (!$) {
        if (!u && rn(t)) {
          const M = an(t, i);
          if (M) {
            e.announce?.(M), B(o.onRefuse, { cardId: i, laneId: null, reason: M });
            return;
          }
          jt(m, l);
          return;
        }
        e.announce?.(`${m.label} has no lane to move to on that side.`);
        return;
      }
      const F = on(t, i, $.id) ?? "That move is not available.";
      _ = { laneId: $.id, reason: F, timer: setTimeout(() => Q(), 1500) }, D(r?.next ?? x ?? t), Ie($.id, r?.next ?? x ?? t), e.announce?.(`${m.label} can't move to ${$.label}. ${F}`), B(o.onRefuse, { cardId: i, laneId: $.id, reason: F });
      return;
    }
    if (g.id === m.laneId) {
      Ce(), Ie(g.id, x ?? t), e.announce?.(`${m.label} is back in ${g.label}.`);
      return;
    }
    const L = Ge(t, i, g.id);
    r = { cardId: i, laneId: g.id, next: L }, D(L), Ie(g.id, L), B(o.onPreview, L), e.announce?.(`${m.label} to ${g.label}: ${ge(L, g.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ie(i, l = t) {
    const u = s ? Kt(l, ne.column(i)) : We(l, { layout: G, rows: Vn() }).places.find((g) => g.laneId === i), m = e.canvas?.viewbox?.();
    if (!u || !m || !(m.width > 0) || !(m.height > 0)) return;
    const I = 16, c = (g, L, $, F) => L + I * 2 >= F || g - I < $ ? g - I - $ : g + L + I > $ + F ? g + L + I - ($ + F) : 0, d = c(q.x + u.x, u.width, m.x, m.width), f = c(q.y + u.y, u.height, m.y, m.height);
    (d || f) && e.panBy?.({ x: d, y: f });
  }
  function wn() {
    if (!o.onSelect || re) return;
    const i = w ? [] : e.getSelectedNodes?.() ?? [], l = i.length === 1 && y.get(i[0].id) === i[0] ? le(i[0].id) : null, u = l?.kind === "card" ? { cardId: l.key } : l?.kind === "lane" ? { laneId: l.key } : null, m = u ? JSON.stringify(u) : null;
    m !== Pe && (Pe = m, B(o.onSelect, u));
  }
  function Kn() {
    h && (h = null, D(t), B(o.onPreview, null));
  }
  function Ce() {
    r && (r = null, B(o.onPreview, null), D(x ?? t));
  }
  function jt(i, l) {
    const { width: u } = Le(t), m = y.get(se(ne.card(i.id)))?.options, I = m?.width ?? 228, c = { x: l > 0 ? q.x + u + 32 : q.x - I - 32, y: m?.y ?? q.y }, d = ft(t, i.id);
    r = { cardId: i.id, laneId: null, side: l, spot: c, next: t }, D(t), B(o.onPreview, d), e.announce?.(`${i.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function qe() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Je() {
    return !w && !S && !x && !E && !qe() && rn(t);
  }
  function gn() {
    v && (v = null, w || Se());
  }
  function Ye(i) {
    const l = t.lanes.map((m) => y.get(se(ne.column(m.id)))).filter(Boolean), u = e.hitTestNodes(i, l, { padding: 6 });
    return u ? le(u.id)?.key ?? null : null;
  }
  function Ve(i) {
    const l = i.options ?? {}, u = Io({
      backgroundColor: l.backgroundColor,
      textColor: l.fontColor,
      fontFamily: l.fontFamily,
      fontSize: l.fontSize,
      borderColor: l.borderColor,
      borderWidth: l.borderWidth
    }), m = String(l.text ?? ""), I = m.replace(/\s+/g, " ").trim(), c = {};
    m.trim() !== I && m.length <= 400 && (c.text = m.trim()), typeof l.shape == "string" && /^[a-z]{1,24}$/i.test(l.shape) && (c.shape = l.shape);
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
    const u = t.lanes.find((c) => c.id === l), m = t.cards.filter((c) => c.laneId === l).length;
    if (u.capacity !== void 0 && m + i.length > u.capacity) {
      const c = u.capacity - m;
      return c > 0 ? `It has room for ${c} more ${c === 1 ? "card" : "cards"}.` : `It already holds ${m} of ${u.capacity} ${u.capacity === 1 ? "card" : "cards"}.`;
    }
    let I = t;
    for (const { offer: c } of i) {
      const d = Me(I, l, c);
      if (d) return d;
      I = Be(I, l, c);
    }
    return null;
  }
  function je(i) {
    return (i.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((u) => u !== i && (u.relationships?.associations ?? []).some((m) => m.child === i || m.childId === i.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : i.options?.image ? "A note with a picture stays a note." : i.options?.link?.show && i.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const yn = (i) => i || "This note";
  function kn(i, l) {
    let u = t;
    const m = i.map(({ node: d, offer: f, from: g }) => {
      u = Be(u, l, f);
      const L = { ...d.options ?? {}, ...g ? { x: g.x, y: g.y } : {} };
      return { node: d, card: u.cards[u.cards.length - 1], kept: L, under: f.under };
    });
    e.beginHostStep?.(), t = u;
    let I = t;
    for (const { node: d, card: f } of m)
      f.id !== d.id && A.set(d.id, f.id), T.set(se(ne.card(f.id)), { x: d.options?.x ?? 0, y: d.options?.y ?? 0 }), Ze(() => e.removeNode(d.id));
    e.endHostStep?.(), D(t), Bt(se(ne.card(m[0].card.id)));
    const c = t.lanes.find((d) => d.id === l);
    e.announce?.(m.length === 1 ? `${m[0].card.label} is now a card in ${c.label}. ${ge(t, l)}.` : `${qn(m.map(({ card: d }) => d.label))} are now cards in ${c.label}. ${ge(t, l)}.`);
    for (const { node: d, card: f, kept: g, under: L } of m) {
      const $ = { cardId: f.id, laneId: l, noteToCard: {
        noteId: d.id,
        label: f.label,
        ...L && { under: L },
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {}
      } }, F = () => {
        t !== I || !t.cards.some((M) => M.id === f.id) || (t = Y({ ...t, cards: t.cards.filter((M) => M.id !== f.id) }), I = t, D(t));
      };
      Jn(B(o.onChange, t, $), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: d.id, isComment: !1 } }]);
      }, () => {
        if (!w) {
          if (F(), !e.nodes.one(g.id)) {
            e.beginHostStep?.();
            const M = Ze(() => e.addNode({ ...g }));
            M && (M.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${f.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        w || (F(), e.announce?.(`Someone else put ${f.label} on the board first.`));
      });
    }
  }
  function bn(i, l) {
    const u = t.cards.find((ee) => ee.id === i), m = t.lanes.find((ee) => ee.id === u.laneId), I = t.cards.findIndex((ee) => ee.id === i), c = t.cards.slice(I + 1).find((ee) => ee.laneId === u.laneId)?.id, d = ft(t, i), f = k.get(se(ne.card(i))) ?? {}, g = e.nodes.one(i) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : i, L = (Oe.cornerRadius ?? 0) > 0, $ = u.asNote, F = $?.text !== void 0 && $.text.replace(/\s+/g, " ").trim() === u.label ? $.text : To(t, u), M = {
      id: g,
      x: Math.round(l.x),
      y: Math.round(l.y),
      width: $?.width ?? f.width ?? 228,
      height: $?.height ?? f.height ?? 76,
      text: F,
      shape: $?.shape ?? (L ? "roundedrectangle" : "rectangle"),
      backgroundColor: u.look?.backgroundColor ?? f.backgroundColor,
      fontColor: u.look?.textColor ?? f.foregroundColor,
      fontSize: u.look?.fontSize ?? f.fontSize,
      borderColor: u.look?.borderColor ?? f.borderColor,
      borderWidth: u.look?.borderWidth ?? f.borderWidth,
      ...u.look?.fontFamily ?? f.fontFamily ? { fontFamily: u.look?.fontFamily ?? f.fontFamily } : {}
    };
    for (const ee of Object.keys(M)) M[ee] === void 0 && delete M[ee];
    e.beginHostStep?.(), t = d;
    const de = t;
    g !== i ? A.set(g, i) : A.delete(g);
    const X = Ze(() => e.addNode(M));
    X && (X.announcedByCreator = !0), e.endHostStep?.(), D(t), X?.ready?.then?.(() => {
      if (w || e.nodes.one(g) !== X) return;
      const ee = () => e.selectNodes?.([X]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(ee) : ee();
    }), e.announce?.(`${u.label} is now a note on the canvas. ${m.label}: ${ge(t, m.id)}.`);
    const Re = () => {
      e.nodes.one(g) === X && (e.beginHostStep?.(), Ze(() => e.removeNode(g)), e.endHostStep?.());
    };
    Jn(B(o.onChange, t, { cardId: i, cardToNote: { noteId: g } }), () => {
      X && e.nodes.one(g) === X && e.sendHeld?.([{ type: "onNodeAdded", data: { id: g, nodeOptions: at(X.options) } }]);
    }, () => {
      if (!w) {
        if (Re(), t === de && !t.cards.some((ee) => ee.id === i)) {
          const ee = { id: i, label: u.label, ...u.look ? { look: u.look } : {}, ...u.asNote ? { asNote: u.asNote } : {} }, Xn = Be(t, u.laneId, ee, c);
          Xn && (t = Xn, D(t));
        }
        e.announce?.(`${u.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      w || (Re(), e.announce?.(`Someone else took ${u.label} off the lanes first.`));
    });
  }
  function Dt(i, l, u) {
    const m = u.map((g) => g.id), I = m.indexOf(l), c = i.cards.find((g) => g.id === l);
    if (I < 0 || !c) return i;
    const d = i.cards.filter((g) => g !== c), f = d.findIndex((g) => m.indexOf(g.id) > I);
    return d.splice(f < 0 ? d.length : f, 0, c), Y({ ...i, cards: d });
  }
  function Bt(i) {
    H = H.then(() => {
      const l = y.get(i);
      if (w || !l) return;
      const u = () => e.selectNodes?.([l]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(u) : u();
    });
  }
  function Ze(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function Jn(i, l, u, m) {
    if (!i || typeof i.then != "function") return l();
    const I = i.then((c) => {
      c === !0 ? l() : c === !1 ? u() : c === "taken" && m();
    }, () => u());
    e.holdUntil?.(I);
  }
  function Ut(i, l) {
    Q(!1), _ = { laneId: l.laneId, reason: l.reason, timer: setTimeout(() => Q(), 1500) }, D(t, { skip: l.cardId });
    const u = t.lanes.find((m) => m.id === l.laneId);
    e.announce?.(`${i} can't move to ${u?.label ?? "that lane"}. ${l.reason}`), B(o.onRefuse, l);
  }
  function Q(i = !0) {
    _ && (clearTimeout(_.timer), _ = null, i && !w && Se());
  }
  function Se() {
    D(E && E.outcome.kind === "candidate" ? E.outcome.next : r?.next ?? x ?? t, { skip: E?.cardId });
  }
  function Yn(i) {
    const l = Zn(i, Vn()), u = new Map(l.map((c) => [c.options.id, c.options])), m = (c, d, f, g = !1) => {
      const L = u.get(ne.column(c));
      L && (L.borderColor = d, L.borderWidth = f, delete L.borderStyle);
      const $ = g && u.get(ne.lane(c));
      $ && ($.borderColor = d, $.borderWidth = f);
    }, I = E?.cardId ?? r?.cardId;
    if (ie = /* @__PURE__ */ new Map(), I) {
      const c = t.cards.find((g) => g.id === I)?.laneId, d = ct(t, I);
      if (!s || s.laneCues)
        for (const g of d) g.id !== c && (m(g.id, it, 2), ie.set(g.id, "open"));
      if (s?.laneCues) {
        for (const g of t.lanes) if (!d.includes(g)) {
          const L = u.get(ne.column(g.id));
          L && (L.backgroundColor = "#e9e8e2"), ie.set(g.id, "closed");
        }
      }
      const f = E ? E.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      f?.kind === "candidate" && (m(f.laneId, st, 3, !0), ie.set(f.laneId, "over")), f?.kind === "refused" && (m(f.laneId, Tn, 3), ie.set(f.laneId, "refused"));
    }
    if (v && !I) {
      for (const c of v.open) c !== v.laneId && (m(c, it, 2), ie.set(c, "open"));
      v.laneId && !v.refusal && (m(v.laneId, st, 3, !0), ie.set(v.laneId, "over")), v.laneId && v.refusal && (m(v.laneId, Tn, 3), ie.set(v.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const c = u.get(ne.card(r.cardId));
      c && (c.xPos = r.spot.x, c.yPos = r.spot.y);
    }
    if (_) {
      ie.set(_.laneId, "refused"), m(_.laneId, Tn, 3, !0);
      const c = u.get(ne.caption(_.laneId));
      c && (c.text = _.reason, c.foregroundColor = "#b42318");
    }
    if (ve = /* @__PURE__ */ new Set(), x && i === x) {
      const c = (f, g) => JSON.stringify(f) === JSON.stringify(g), d = (f) => {
        const g = u.get(f);
        g && (g.borderStyle = "dashed", g.borderColor = mo, g.borderWidth = 2, ve.add(se(f)));
      };
      for (const f of i.cards) c(f, t.cards.find((g) => g.id === f.id)) || d(ne.card(f.id));
      for (const f of i.lanes) c(f, t.lanes.find((g) => g.id === f.id)) || d(ne.lane(f.id));
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
  function D(i, l = {}) {
    if (w) return;
    V = { model: i, skip: l.skip, grip: l.grip, animate: l.animate !== !1 };
    const u = Yn(i), m = [];
    for (const { options: c } of u) {
      const d = c.id;
      if (y.has(d)) continue;
      const f = T.get(d);
      T.delete(d);
      const g = f && l.animate !== !1 && !Sn() ? { ...c, xPos: f.x, yPos: f.y } : c, L = e.nodes.add(co(g));
      y.set(d, L), k.set(d, { ...g }), L.ready && m.push(L.ready.then(() => {
        if (y.get(d) !== L) return;
        L.applyGovernance?.(), le(d)?.kind === "column" && L.toBack?.(!1), le(d)?.kind === "handle" && L.svgGroup?.front?.();
        const $ = Qn(V?.model ?? i, d);
        $ && L.svgGroup?.node?.setAttribute("aria-label", $);
      }).catch(() => {
      }));
    }
    const I = V;
    H = Promise.all([H, ...m]).then(() => {
      w || V !== I || Gt(Yn(I.model), I);
    }).catch((c) => console.warn("WORKSHOP: could not draw the workshop", c));
  }
  function Gt(i, l) {
    const u = new Set(i.map((I) => I.options.id)), m = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [c, d] of [...y]) {
        if (u.has(c)) continue;
        for (const [g, L] of [...C])
          L.parentId !== c && L.childId !== c || (L.parent.relationships?.removeAssociation(g), C.delete(g));
        e.deselectNode?.(d), d.editor?.cancelInline?.(), y.delete(c), k.delete(c);
        const f = j.get(c);
        f && (j.delete(c), R.delete(f)), e.nodes.remove(c);
      }
      for (const { options: c } of i) {
        const d = c.id, f = y.get(d);
        if (!f?.svgGroup) continue;
        const g = k.get(d) ?? {}, L = f.editor?.isInlineEditing?.();
        (c.fontSize !== g.fontSize || c.foregroundColor !== g.foregroundColor) && (f.options.fontSize = c.fontSize, f.options.fontColor = c.foregroundColor, f.applyTextStyle?.()), c.text !== g.text && !L && f.setText?.(c.text), (c.width !== g.width || c.height !== g.height) && (c.vectorPath ? (f.options.width = c.width, f.options.height = c.height, f.setShape?.(f.options.shape, c.vectorPath), le(d)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(c.width, c.height)), c.backgroundColor !== g.backgroundColor && f.setColors?.(c.backgroundColor), (c.borderColor !== g.borderColor || c.borderWidth !== g.borderWidth || c.borderStyle !== g.borderStyle) && (f.options.borderColor = c.borderColor, f.options.borderWidth = c.borderWidth, f.options.borderStyle = c.borderStyle, f.applyBorder?.());
        const $ = c.xPos !== g.xPos || c.yPos !== g.yPos || Math.abs((f.options.x ?? 0) - c.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - c.yPos) > 0.5;
        if (d !== (l.skip && se(ne.card(l.skip))) && d !== (l.grip && se(l.grip)) && $) {
          const de = l.animate && !Sn() ? 180 : 0, X = m.includes(f) ? () => {
            !w && y.get(d) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          X && de && m.length === 1 && f.resizeRotate?.disable?.(), f.position(c.xPos, c.yPos, X, void 0, de);
        }
        const F = Qn(l.model, d);
        F && f.svgGroup.node.getAttribute("aria-label") !== F && f.svgGroup.node.setAttribute("aria-label", F), ve.has(d) ? f.svgGroup.node.setAttribute("data-workshop-proposed", "") : f.svgGroup.node.removeAttribute("data-workshop-proposed");
        const M = le(d);
        if (M?.kind === "column") {
          const de = ie.get(M.key);
          de ? f.svgGroup.node.setAttribute("data-workshop-drop", de) : f.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        M?.kind === "handle" && f.svgGroup.front?.(), k.set(d, { ...c });
      }
      const I = /* @__PURE__ */ new Map();
      for (const c of i) for (const d of c.relationships.associations) I.set(d.id, d);
      for (const [c, d] of [...C])
        I.has(c) && y.get(d.parentId) === d.parent && y.get(d.childId) === d.child || (d.parent.relationships?.removeAssociation(c), C.delete(c));
      for (const [c, d] of I) {
        if (C.has(c)) continue;
        const f = y.get(d.parentId), g = y.get(d.childId);
        !f?.relationships || !g?.svgGroup || (f.relationships.addAssociation(g, ho(d)), C.set(c, { parentId: d.parentId, childId: d.childId, parent: f, child: g }));
      }
    }), p) {
      const I = t.lanes.map((g) => y.get(se(ne.column(g.id)))?.svgGroup?.node).reduce((g, L) => L && (!g || g.compareDocumentPosition(L) & 4) ? L : g, null), c = l.model, d = e.canvas?.viewbox?.(), f = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - q.x, y: d.y - q.y, width: d.width, height: d.height } : null;
      p.draw(t, c === t ? null : c, {
        origin: q,
        layout: G,
        above: I,
        view: f,
        announce: (g) => e.announce?.(g),
        clamp: b?.last?.clampedReason ? { name: b.name, text: b.last.clampedReason } : E?.outcome.kind === "candidate" && E.outcome.said ? { name: "card-" + E.cardId, text: E.outcome.said } : !b && N ? { name: N.name, text: N.reason } : null,
        refused: !!b?.last?.refusal || !b && !!N,
        onUnlink: (g, L) => {
          if (S || x || E || b || qe()) return;
          const $ = Ne(t, [{ kind: "unlink_tasks", card: { id: g }, waitsOn: { id: L } }]);
          "refused" in $ ? e.announce?.($.refused.reason) : Qe($.workshop, { cardId: g });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function He(i) {
    return { x: i.x - q.x, y: i.y - q.y };
  }
  function Le(i) {
    return s ? s.places(i, G) : { ...We(i, { layout: G }), parts: [] };
  }
  function Kt(i, l) {
    const u = s.places(i, G).parts.find((m) => m.name === l);
    return u ? { x: u.x, y: u.y, width: u.width, height: u.height } : void 0;
  }
  function Zn(i, l) {
    if (!s) return Eo(i, { native: !0, origin: q, rows: l, layout: G, style: Oe }).nodes;
    const u = s.notes(i, G, q, Oe);
    if (i.behaviour && u.length) {
      const m = u.map((f) => f.options), I = Math.min(...m.map((f) => f.xPos)), c = Math.max(...m.map((f) => f.xPos + f.width)), d = Mt(i, { x: I, y: Math.max(...m.map((f) => f.yPos + f.height)) + 16, width: Math.min(c - I, 484) }, Oe);
      d && u.push(d);
    }
    return u;
  }
  function Qe(i, l, u) {
    const m = s.editsBetween(t, i);
    if (!m.length) return !1;
    const I = Ne(t, m);
    return "refused" in I ? (e.announce?.(I.refused.reason), B(o.onRefuse, { ...l, laneId: I.refused.laneId, reason: I.refused.reason }), !1) : (t = I.workshop, D(t, { skip: u }), e.announce?.(I.report.edits.map((c) => c.said).join(" ")), B(o.onChange, t, { ...l, edits: m }), !0);
  }
  function Qn(i, l) {
    const u = le(l);
    if (u?.kind === "lane") {
      const m = i.lanes.find((I) => I.id === u.key);
      return m ? `${m.label}, ${ge(i, m.id)}` : null;
    }
    if (u?.kind === "card") {
      const m = i.cards.find((c) => c.id === u.key), I = m && i.lanes.find((c) => c.id === m.laneId);
      return m && I ? `${m.label}, in ${I.label}${s?.cardKeys ? ". " + s.cardKeys : ""}` : null;
    }
    return u?.kind === "handle" ? s?.label?.(i, ke(l)) ?? null : null;
  }
  function vn(i, l) {
    const u = Zn(i).find((m) => m.options.id === l)?.options;
    return u ? { x: u.xPos, y: u.yPos } : null;
  }
  function Ee() {
    (E || b) && e.cancelGovernedDrag?.("host"), E = null, b = null, r && (r = null, B(o.onPreview, null)), Q(!1);
  }
  return {
    toCanvas(i) {
      if (w || S || qe()) return "This workshop is view-only here.";
      if (!t.cards.some((I) => I.id === i)) return "That card is no longer on the board.";
      const l = an(t, i);
      if (l) return l;
      r && Ce(), x && (Ee(), x = null, D(t), e.refreshGovernance?.());
      const { width: u } = Le(t), m = y.get(se(ne.card(i)))?.options;
      return bn(i, { x: q.x + u + 32, y: m?.y ?? q.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...q };
    },
    get layout() {
      return { ...G };
    },
    get bounds() {
      const { width: i, height: l } = Le(t);
      return { x: q.x, y: q.y, width: i, height: l };
    },
    setLayout(i) {
      if (w) throw new Error("This workshop has been detached.");
      const l = dt(i);
      s ? s.places(t, l) : We(t, { layout: l }), JSON.stringify(l) !== JSON.stringify(G) && (Ee(), G = l, D(x ?? t));
    },
    whenDrawn: () => H,
    update(i) {
      if (w) throw new Error("This workshop has been detached.");
      const l = Y(i);
      Ee(), t = l;
      const u = S;
      S = P || a(t), D(x ?? t), S !== u && e.refreshGovernance?.();
    },
    preview(i) {
      if (w) throw new Error("This workshop has been detached.");
      const l = i ? Y(i) : null;
      Ee(), x = l, D(x ?? t), e.refreshGovernance?.();
    },
    refuse(i, l) {
      const u = t.lanes.find((m) => m.id === i);
      w || !u || (Q(!1), _ = { laneId: i, reason: l, timer: setTimeout(() => Q(), 1500) }, Se(), e.announce?.(`${u.label}: ${l}`));
    },
    setReadOnly(i) {
      P = !!i;
      const l = P || a(t);
      w || S === l || (Ee(), S = l, D(x ?? t), e.refreshGovernance?.());
    },
    destroy() {
      w || (Ee(), w = !0, N && clearTimeout(N.timer), e.element?.removeEventListener?.("pointerdown", Bn, !0), Ft?.(), e.withPolicyAuthority(() => {
        for (const [i, l] of C) l.parent.relationships?.removeAssociation(i);
        for (const [i, l] of y)
          e.deselectNode?.(l), l.editor?.cancelInline?.(), e.nodes.one(i) === l && e.nodes.remove(i);
      }), C.clear(), y.clear(), k.clear(), R.clear(), j.clear(), Wt(), p?.destroy(), re = !1, wn(), e.notifyNodeChanged?.());
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
const bo = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
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
function Ke(e) {
  const n = ye(e), o = {}, t = (a) => {
    if (typeof a != "string" || !vo.test(a)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return a;
  }, s = (a, p, b) => {
    if (typeof a != "number" || !Number.isFinite(a) || a < p || a > b) throw new Error("A card size is out of range.");
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
        Ke({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Ke(n);
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
const Fe = (e) => "lane-" + e, be = (e) => "card-" + e, hn = (e) => "image-" + e;
function or(e) {
  const n = Co(e);
  return zn(e).map((o) => {
    const t = e.cards.filter((p) => p.laneId === o.id), s = n.filter((p) => p.laneId === o.id), a = [Fe(o.id)];
    return o.station?.image && a.push(hn(o.id)), { lane: o, cards: t, signals: s, nodeIds: [...a, ...t.map((p) => be(p.id))] };
  });
}
const It = 5, Ct = 24, Ln = 3;
function Y(e) {
  const n = ye(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !Z(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = Z(n), s = t ? he(t) : void 0, a = { id: fe }, p = ue(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > It)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const b = s?.cards ?? [Ct, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > b[0]) throw new Error(b[1]);
  const x = n.lanes.map((y) => {
    const k = ye(y), C = { id: fe(k.id), label: ue(k.label) };
    if (k.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (k.capacity !== void 0) {
      const R = o ? 576 : 24;
      if (typeof k.capacity != "number" || !Number.isInteger(k.capacity) || k.capacity < 1 || k.capacity > R)
        throw new Error(`Lane capacity must be a whole number from 1 to ${R}.`);
      C.capacity = k.capacity;
    }
    if (s?.readLane?.(k, C, a), k.station !== void 0) {
      const R = ye(k.station), j = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= Ln)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray(R.next) || R.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const E = R.next.map(fe);
      Te(E, "onward stop"), C.station = { column: j(R.column), row: j(R.row), next: E, outcome: ue(R.outcome, 160) }, R.image !== void 0 && (C.station.image = xt(R.image));
    }
    return C;
  }), P = x.map((y) => y.id);
  if (Te(P, "lane ID"), t && x.some((y) => y.station)) throw new Error("A business board has no map stations.");
  if ((o || x.some((y) => y.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (x.some((y) => y.station)) {
    if (!x.every((y) => y.station)) throw new Error("Give every station on the map a position.");
    Te(x.map((y) => y.station.column + "," + y.station.row), "map position");
    for (const y of x)
      if (y.station.next.some((k) => k === y.id || !P.includes(k))) throw new Error("Connect each stop to another station on this map.");
  }
  const S = n.cards.map((y) => {
    const k = ye(y), C = { id: fe(k.id), label: ue(k.label), laneId: fe(k.laneId) };
    if (!P.includes(C.laneId)) throw new Error("Card refers to an unknown lane.");
    if (k.allowedLaneIds !== void 0) {
      if (!Array.isArray(k.allowedLaneIds) || k.allowedLaneIds.length > x.length) throw new Error("Invalid allowed lanes.");
      if (C.allowedLaneIds = k.allowedLaneIds.map(fe), Te(C.allowedLaneIds, "allowed lane"), !C.allowedLaneIds.includes(C.laneId) || !C.allowedLaneIds.every((R) => P.includes(R)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (k.look !== void 0) {
      const R = Ke(k.look);
      R && (C.look = R);
    }
    if (k.asNote !== void 0) {
      const R = Fn(k.asNote);
      R && (C.asNote = R);
    }
    if (s?.readCard(k, C, a), o) {
      if (typeof k.points != "number" || !Number.isInteger(k.points) || k.points < 1 || k.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (C.points = k.points, k.dependsOn !== void 0) {
        if (!Array.isArray(k.dependsOn) || k.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        C.dependsOn = k.dependsOn.map(fe), Te(C.dependsOn, "dependency");
      }
    }
    return C;
  });
  Te(S.map((y) => y.id), "card ID");
  const w = { version: 1, title: p, lanes: x, cards: S };
  if (n.experience !== void 0) {
    const y = ye(n.experience);
    if (y.version !== 1 || y.kind !== "customer-interviews" && y.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    w.experience = { version: 1, kind: y.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    w.signals = n.signals.map((y) => {
      const k = ye(y), C = fe(k.cardId), R = fe(k.laneId);
      if (!S.some((j) => j.id === C) || !P.includes(R))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: fe(k.id),
        label: ue(k.label),
        cardId: C,
        laneId: R,
        whenPresent: ue(k.whenPresent, 160),
        whenAbsent: ue(k.whenAbsent, 160)
      };
    }), Te(w.signals.map((y) => y.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    w.presentationOrder = zn({ lanes: x, presentationOrder: n.presentationOrder }).map((y) => y.id);
  }
  if (n.behaviour !== void 0 && (w.behaviour = ce().validate(n.behaviour, { ...w, kind: n.kind })), o)
    return w.kind = "release-plan", qt(w), w;
  if (t && s) {
    w.kind = t, s.readBoard(n, w, a);
    const y = s.validate(w);
    if (y) throw new Error(y);
    return w;
  }
  for (const y of x)
    if (S.filter((k) => k.laneId === y.id).length > (y.capacity ?? 1 / 0))
      throw new Error(`Lane "${y.label}" exceeds its capacity.`);
  return w;
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
function un(e, n) {
  if (Z(e)) return e.lanes.filter((t) => jn(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => fn(e, n, t.id) !== null);
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
    const a = fn(e, t, o);
    if (!a) throw new Error("Move is unavailable.");
    return a;
  }
  if (!t || !un(e, t).some((a) => a.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((a) => a === t ? { ...t, laneId: o } : a) };
}
function Ge(e, n, o) {
  const t = Tt(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in ce().check(e, t) ? null : t;
}
function Tt(e, n, o) {
  const t = e.cards.find((p) => p.id === n);
  if (!t || !e.lanes.some((p) => p.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return fn(e, t, o);
  const s = jn(e, n, o);
  if (s !== void 0) return s;
  const a = Ro(e, n, o);
  return a || (o === "prototype" && ze(e) === "customer-interviews" ? null : un(e, t).some((p) => p.id === o) ? En(e, n, o) : null);
}
function ct(e, n) {
  return e.lanes.filter((o) => Ge(e, n, o.id) !== null);
}
function on(e, n, o) {
  const t = Tt(e, n, o);
  if (t !== null) {
    const w = t === e || !e.behaviour ? null : ce().check(e, t);
    return w && "refused" in w ? w.refused.sentence : null;
  }
  const s = e.cards.find((w) => w.id === n), a = e.lanes.find((w) => w.id === o);
  if (!s || !a) return "That move is not available.";
  const p = Z(e), b = p && he(p).refusal;
  if (b) return b(e, n, o);
  const x = `This card can't go in ${a.label}.`;
  if (s.allowedLaneIds && !s.allowedLaneIds.includes(o)) return x;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return x;
    const w = $e(e, o), y = { ...e, lanes: e.lanes.map((C) => C === a ? { id: a.id, label: a.label } : C) }, k = fn(y, s, o);
    return k ? `Needs ${$e(k, o) - w} points. It already holds ${w} of ${a.capacity} points.` : x;
  }
  const P = e.lanes.find((w) => w.id === s.laneId);
  if (P?.station && !P.station.next.includes(o)) return `${a.label} can't be reached from ${P.label}.`;
  const S = e.cards.filter((w) => w.laneId === o).length;
  return a.capacity !== void 0 && S >= a.capacity ? `It already holds ${S} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : x;
}
function rn(e) {
  return (!e.kind || !!Z(e)) && !e.lanes.some((n) => n.station) && !ze(e);
}
const So = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Hn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && So.test(n) && !o.has(n) ? n : mn(e, "card");
}
function Me(e, n, o) {
  const t = e.lanes.find((p) => p.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((p) => p.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (ze(e)) return "This workshop keeps the cards it came with.";
  const s = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!s) return "A card needs some words. Type on the note first.";
  if (Z(e)) {
    const p = At(e, n, o);
    return typeof p == "string" ? p : ut(e, p);
  }
  if (s.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(s)) return "A card holds plain words only.";
  if (e.cards.length >= Ct) return "A workshop holds up to 24 cards.";
  const a = e.cards.filter((p) => p.laneId === n).length;
  if (t.capacity !== void 0 && a >= t.capacity) return `It already holds ${a} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      Ke(o.look);
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
function Be(e, n, o, t) {
  if (Me(e, n, o) !== null) return null;
  if (Z(e)) {
    const P = At(e, n, o), S = P.cards[P.cards.length - 1], w = t === void 0 ? -1 : e.cards.findIndex((y) => y.id === t && y.laneId === n);
    return w < 0 ? P : { ...P, cards: [...e.cards.slice(0, w), S, ...e.cards.slice(w)] };
  }
  const s = o.look === void 0 ? void 0 : Ke(o.look), a = o.asNote === void 0 ? void 0 : Fn(o.asNote), p = {
    id: Hn(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: n,
    ...s ? { look: s } : {},
    ...a ? { asNote: a } : {}
  }, b = t === void 0 ? -1 : e.cards.findIndex((P) => P.id === t && P.laneId === n), x = b < 0 ? [...e.cards, p] : [...e.cards.slice(0, b), p, ...e.cards.slice(b)];
  return Y({ ...e, cards: x });
}
function At(e, n, o) {
  const t = he(Z(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const s = Ne(e, [{ kind: "add_card", lane: { id: n }, ...t, ...o.under && { under: { id: o.under } } }]);
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
function an(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!rn(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (e.cards.some((t) => t.parentId === n)) return `${o.label} has cards under it, so it stays a card. Move them first.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((a) => e.lanes.find((p) => p.id === a).label), s = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${s}, so it stays a card.`;
  }
  return null;
}
function ft(e, n) {
  if (an(e, n) !== null) return null;
  const o = e.cards.filter((t) => t.id !== n).map((t) => {
    if (!t.dependsOn?.includes(n)) return t;
    const s = { ...t, dependsOn: t.dependsOn.filter((a) => a !== n) };
    return s.dependsOn.length || delete s.dependsOn, s;
  });
  return Y({ ...e, cards: o });
}
function ge(e, n) {
  const o = e.lanes.find((b) => b.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const b = $e(e, n);
    return o.capacity ? b + " / " + o.capacity + " points" : b + " points";
  }
  const t = Z(e);
  if (t) return he(t).caption(e, n);
  const s = _o(e, n);
  if (s) return "$" + s.amount + " · " + s.description;
  const a = e.cards.filter((b) => b.laneId === n).length, p = e.behaviour ? ce().laneLimit(e, n) : o.capacity;
  return p !== void 0 ? a + " of " + p : a + (a === 1 ? " card" : " cards");
}
const pn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, sn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Ot(e, n = pn, o = 28) {
  const { pitch: t, row: s, top: a } = n, p = !!e.lanes[0].station, b = e.lanes.map((S) => e.cards.filter((w) => w.laneId === S.id).length), x = a + Math.max(1, ...b) * s + 36, P = e.lanes.map((S, w) => ({
    x: p ? S.station.column * (t + o) : w * t,
    y: p ? S.station.row * x : 0
  }));
  return {
    points: P,
    width: Math.max(...P.map((S) => S.x)) + t,
    height: Math.max(...P.map((S, w) => S.y + a + (p ? Math.max(1, b[w]) : b[w] + 1) * s))
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
function mn(e, n) {
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
  const o = Pt(e), t = mn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Y(o);
}
function $o(e, n, o) {
  const t = Pt(e);
  return t.cards.push({
    id: mn(t, "card"),
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
  const s = t.lanes.find((S) => S.id === n);
  if (!s?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= It) throw new Error("A map can have up to five stations.");
  const a = ue(o?.label), p = ue(o?.outcome, 160), b = mn(t, "station");
  let x, P = 1 / 0;
  for (let S = 0; S < Ln; S++)
    for (let w = 0; w < Ln; w++) {
      if (t.lanes.some((k) => k.station.column === w && k.station.row === S)) continue;
      const y = Math.abs(s.station.column - w) + Math.abs(s.station.row - S);
      y < P && (P = y, x = { column: w, row: S });
    }
  if (!x) throw new Error("There is no free station position.");
  return s.station.next.push(b), t.lanes.push({ id: b, label: a, station: { ...x, next: [], outcome: p, ...o.image === void 0 ? {} : { image: xt(o.image) } } }), t.presentationOrder?.push(b), t;
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
}, Lt = (e) => "caption-" + e, Ue = (e) => "column-" + e, Oo = "rules-board", ne = { lane: Fe, card: be, image: hn, caption: Lt, column: Ue, rules: Oo };
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
`).reduce((b, x) => b + Math.max(1, Math.ceil(x.length / a)), 0) * s * 1.3 <= t) return s;
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
  const o = Y(e), { pitch: t, row: s, top: a } = pn, p = o.lanes.map((y) => o.cards.filter((k) => k.laneId === y.id).length), b = (y) => Math.max(p[y], (Array.isArray(n.rows) ? n.rows[y] : n.rows) ?? 0), x = !!o.lanes[0].station, P = o.lanes.some((y) => y.station?.image), S = _t(n.layout, o.lanes.length), w = [];
  if (x) {
    const { points: y } = Ot(o);
    o.lanes.forEach((k, C) => w.push({
      laneId: k.id,
      x: y[C].x,
      y: y[C].y + (P ? k.station.row * Rn : 0),
      width: t,
      height: a + (k.station.image ? Rn : 0) + Math.max(1, p[C]) * s,
      column: k.station.column,
      row: k.station.row
    }));
  } else {
    let y = Nt(o, S)?.below ?? 0;
    for (let k = 0; k < o.lanes.length; k += S) {
      const C = o.lanes.slice(k, k + S), R = a + (Math.max(...C.map((j, E) => b(k + E))) + 1) * s;
      C.forEach((j, E) => w.push({ laneId: j.id, x: E * t, y, width: t, height: R, column: E, row: k / S })), y += R + Po;
    }
  }
  return { places: w, width: Math.max(...w.map((y) => y.x + y.width)), height: Math.max(...w.map((y) => y.y + y.height)) };
}
function Nt(e, n, o = 2, t = 0) {
  const s = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? ce().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return s ? { note: s, below: s.options.height + 16 } : null;
}
function Lo(e, n) {
  const { pitch: o, width: t, row: s, height: a, top: p } = pn, b = n.origin ?? { x: 0, y: 0 }, x = !!e.lanes[0].station, { places: P } = We(e, n), S = n.style ?? {}, w = S.textColor ?? De.fontColor, y = S.borderColor ?? De.borderColor, k = S.borderWidth ?? De.borderWidth, C = S.cornerRadius ?? 0, R = S.fontSize ?? De.fontSize, j = S.laneFontSize ?? R + 2, E = S.captionFontSize ?? Math.max(11, R - 1), r = [], h = (T) => {
    const _ = { options: {
      shapeHint: "rectangle",
      vectorPath: An(T.width, T.height, C),
      foregroundColor: w,
      borderColor: y,
      borderWidth: k,
      ...S.fontFamily ? { fontFamily: S.fontFamily } : {},
      ...T
    }, relationships: { associations: [] } };
    return r.push(_), _;
  };
  e.lanes.forEach((T, _) => {
    const N = P[_], K = b.x + N.x, H = b.y + N.y, V = T.station?.image;
    h({
      id: Ue(T.id),
      text: "",
      name: T.label,
      xPos: K + 2,
      yPos: H,
      width: o - 4,
      height: N.height,
      vectorPath: An(o - 4, N.height, C ? C + 2 : 0),
      backgroundColor: x ? "#fcf9ed" : pt(sn[_], 0.6),
      borderColor: x ? "#a8b5aa" : pt(sn[_], 0.1),
      borderWidth: 1,
      ...x ? { borderStyle: "dashed" } : {}
    }), h({
      id: Fe(T.id),
      text: T.label,
      name: T.label,
      xPos: K + 8,
      yPos: H + 6,
      width: t,
      height: 58,
      backgroundColor: sn[_],
      fontSize: mt(T.label, j, t - 16, 50)
    }), h({
      id: Lt(T.id),
      text: ge(e, T.id),
      name: T.label,
      xPos: K + 8,
      yPos: H + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: E
    }), V && r.push({ options: {
      id: hn(T.id),
      name: V.alt,
      text: "",
      xPos: K + 8,
      yPos: H + p,
      width: t,
      height: Rt,
      shapeHint: "rectangle",
      image: V.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((G) => G.laneId === T.id).forEach((G, Oe) => {
      const ie = $t(e, G), ve = x ? t - 20 : t, Pe = x ? a - 6 : a, re = x ? {} : { ...S.card, ...G.look }, q = x ? C : S.card?.cornerRadius ?? C;
      h({
        id: be(G.id),
        text: ie,
        name: G.label,
        xPos: K + (x ? 18 : 8),
        yPos: H + p + (V ? Rn : 0) + Oe * s,
        width: ve,
        height: Pe,
        ...q !== C ? { vectorPath: An(ve, Pe, q) } : {},
        backgroundColor: x ? "#ffda75" : re.backgroundColor ?? S.backgroundColor ?? De.backgroundColor,
        ...re.textColor ? { foregroundColor: re.textColor } : {},
        ...re.fontFamily ? { fontFamily: re.fontFamily } : {},
        ...re.borderColor ? { borderColor: re.borderColor } : {},
        ...re.borderWidth !== void 0 ? { borderWidth: re.borderWidth } : {},
        fontSize: mt(ie, re.fontSize ?? R, ve - 16, Pe - 8)
      });
    });
  });
  const v = Nt(e, _t(n.layout, e.lanes.length), b.x + 2, b.y)?.note ?? Mt(e, {
    x: b.x,
    y: b.y + Math.max(...P.map((T) => T.y + T.height)) + 16,
    width: Math.min(Math.max(...P.map((T) => T.x + T.width)), o * 2) - 4
  }, S);
  v && r.push(v);
  const A = new Map(r.map((T) => [T.options.id, T]));
  for (const T of e.lanes)
    T.station && (A.get(Ue(T.id)).relationships.associations = T.station.next.map((_) => ({
      id: T.id + "-to-" + _,
      parentId: Ue(T.id),
      childId: Ue(_),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const T of e.cards)
      for (const _ of T.dependsOn ?? []) {
        const N = be(_), K = be(T.id);
        A.get(N).relationships.associations.push({
          id: `dependency-${_.length}-${_}-${T.id}`,
          parentId: N,
          childId: K,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const T = new Set(n.beside), _ = new Set(r.map((H) => H.options.id)), N = /* @__PURE__ */ new Map();
    for (const H of [..._]) {
      if (!T.has(H)) continue;
      const V = Et(H, (G) => T.has(G) || _.has(G));
      _.add(V), N.set(H, V);
    }
    const K = (H) => N.get(H) ?? H;
    for (const H of r) {
      H.options.id = K(H.options.id);
      for (const V of H.relationships.associations)
        V.parentId = K(V.parentId), V.childId = K(V.childId);
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
  const { width: t, row: s, height: a, top: p } = pn, b = [];
  function x(k, C, R, j, E, r) {
    b.push({ options: {
      id: k,
      text: C,
      name: C,
      xPos: R,
      yPos: j,
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
  const { points: P } = Ot(o), S = 152, w = S + 12, y = o.lanes.some((k) => k.station?.image);
  o.lanes.forEach((k, C) => {
    const R = P[C].x, j = P[C].y + (y ? (k.station?.row ?? 0) * w : 0), E = k.station?.image, r = o.kind === "release-plan" ? k.label + `
` + (k.capacity ? $e(o, k.id) + " / " + k.capacity + " points" : $e(o, k.id) + " points") : k.label;
    x(Fe(k.id), r, R, j, p - 12, sn[C]), E && b.push({ options: {
      id: hn(k.id),
      name: E.alt,
      text: "",
      xPos: R,
      yPos: j + p,
      width: t,
      height: S,
      shapeHint: "rectangle",
      image: E.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((h) => h.laneId === k.id).forEach((h, v) => x(be(h.id), $t(o, h), R, j + p + (E ? w : 0) + v * s, a, "#fffdf6"));
  });
  for (const k of o.lanes) {
    if (!k.station) continue;
    const C = b.find((R) => R.options.id === Fe(k.id));
    C.relationships.associations = k.station.next.map((R) => ({ id: k.id + "-to-" + R, parentId: C.options.id, childId: Fe(R), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), C.options.text = k.label + `
` + k.station.outcome, C.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const k = new Map(b.map((C) => [C.options.id, C]));
    for (const C of o.cards)
      for (const R of C.dependsOn ?? []) {
        const j = be(R), E = be(C.id);
        k.get(j).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${C.id}`,
          parentId: j,
          childId: E,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: b };
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
  const t = ze(e), s = e.cards.find((p) => p.id === n);
  if (!t || !s || s.laneId === o) return null;
  let a = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const p = e.cards.find((b) => b.laneId === o);
    if (p) {
      if (!un(e, p).some((b) => b.id === "interviews")) return null;
      a = En(e, p.id, "interviews");
    }
  }
  return un(a, s).some((p) => p.id === o) ? En(a, n, o) : null;
}
function _o(e, n) {
  if (ze(e) !== "experiment-budget") return null;
  const o = Dn.find((a) => a.id === n), t = e.cards.filter((a) => a.laneId === n).length, s = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? s + " " + (s === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  De as DEFAULT_NOTE_STYLE,
  gt as WORKSHOP_BOARD_KINDS,
  tn as WorkshopReferenceError,
  ht as addWorkshopBranch,
  $o as addWorkshopCard,
  Ao as addWorkshopLane,
  Ne as applyWorkshopEdits,
  tr as attachWorkshop,
  un as availableLanes,
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
  sn as laneColors,
  Ae as listed,
  Xe as listeningRoom,
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
  Uo as registerWorkshopRules,
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
  dn as workshopBoardKind,
  _o as workshopBudgetResult,
  Ge as workshopCandidate,
  ft as workshopCardAsNote,
  an as workshopCardAsNoteRefusal,
  Io as workshopCardLookOf,
  To as workshopCardNoteText,
  $t as workshopCardText,
  ct as workshopDestinations,
  Pn as workshopEditKinds,
  $n as workshopFinder,
  ge as workshopLaneCaption,
  We as workshopLanePlaces,
  pn as workshopLayout,
  ne as workshopNodeIds,
  Be as workshopNoteCandidate,
  Me as workshopNoteRefusal,
  Ot as workshopPositions,
  zn as workshopPresentationLanes,
  or as workshopPresentationScenes,
  to as workshopReferences,
  on as workshopRefusal,
  ot as workshopRuleSchema,
  he as workshopRules,
  Go as workshopRulesLoaded,
  Et as workshopStandInId,
  rn as workshopTakesNotes,
  Eo as workshopToSlate
};
