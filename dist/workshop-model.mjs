import { D as en } from "./NoteDefaults-1xFW0br8.mjs";
const _r = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Nr(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: l, fieldNote: s, deskNote: p, fallback: k } = e, x = (P) => typeof P == "string" && P.trim().length > 0 && P.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(P);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? l !== "field" && l !== "desk" : l !== null) || l === void 0 || !x(s) || !x(p) || !x(k) ? null : { kind: n, version: o, stage: t, choice: l, fieldNote: s.trim(), deskNote: p.trim(), fallback: k.trim() };
}
function Rr(e) {
  return { ...e, stage: "review", choice: null };
}
function Mr(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Wr(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const hn = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function jr(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: l, rightLabel: s } = e, p = (k) => typeof k == "string" && k.trim().length > 0 && k.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(k);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !p(l) || !p(s) ? null : { kind: n, version: o, mix: t, leftLabel: l.trim(), rightLabel: s.trim() };
}
function zr({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === hn.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === hn.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === hn.leftLabel && o === hn.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function _e(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function zo(e) {
  const n = new Map(e.cards.map((p) => [p.id, p])), o = new Map(e.lanes.map((p, k) => [p.id, k])), t = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  function s(p) {
    if (!t.has(p.id)) {
      if (l.has(p.id)) throw new Error("Release dependencies must be acyclic.");
      l.add(p.id);
      for (const k of p.dependsOn ?? []) {
        const x = n.get(k);
        if (!x) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(x.laneId) > o.get(p.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(x);
      }
      l.delete(p.id), t.add(p.id);
    }
  }
  for (const p of e.cards) s(p);
  for (const p of e.lanes) {
    if (p.station) throw new Error("Release windows cannot also be map stations.");
    if (_e(e, p.id) > (p.capacity ?? 1 / 0)) throw new Error(`Release "${p.label}" exceeds its point budget.`);
  }
}
function Sn(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((g, y) => [g.id, y])), l = t.get(o);
  if (l === void 0) return null;
  const s = l < t.get(n.laneId), p = /* @__PURE__ */ new Set([n.id]), k = [n];
  for (; k.length; ) {
    const g = k.pop();
    for (const y of e.cards) {
      if (p.has(y.id)) continue;
      const v = t.get(y.laneId);
      (s ? v > l && g.dependsOn?.includes(y.id) : v < l && y.dependsOn?.includes(g.id)) && (p.add(y.id), k.push(y));
    }
  }
  if (e.cards.filter((g) => p.has(g.id)).some((g) => g.allowedLaneIds && !g.allowedLaneIds.includes(o))) return null;
  const P = { ...e, cards: e.cards.map((g) => p.has(g.id) ? { ...g, laneId: o } : g) }, T = e.lanes[l].capacity;
  return T !== void 0 && _e(P, o) > T ? null : P;
}
const Fr = {
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
}, it = /* @__PURE__ */ new Map(), Fo = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function Dr(e) {
  it.set(e.kind, e);
}
function Hr(e) {
  return typeof e == "string" && it.has(e);
}
function ye(e) {
  const n = it.get(e);
  if (!n) throw new Error(`The ${Fo[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let In = null;
function Br(e) {
  In = e;
}
function Ur() {
  return In !== null;
}
function me() {
  if (!In) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return In;
}
const $ = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Pe = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Pt = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), at = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), lt = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Gr = (e) => at(lt(e)), Do = [
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
], Ho = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Do.indexOf(e.toLowerCase()), Bo = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Zt(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (l) => {
    const s = at(l);
    s && o.add(s);
  };
  t(e), t(lt(e));
  for (const l of [...o]) t(l.replace(/^(?:the|my|our)\s+/i, ""));
  for (const l of [...o]) t(l.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const l of [...o]) t(l.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const Dn = "[^\\p{L}\\p{N}]", _t = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Pt(n) + "(?:$|" + Dn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Dn + ")" + Pt(n) + "(?:$|" + Dn + ")", "u").test(e)
], Nt = ["first", "second", "third", "fourth", "fifth"];
function Uo(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Nt.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(at(lt(n)));
  if (!t) return null;
  const l = (t[1] ?? t[2]).toLowerCase(), s = l === "last" ? e.length - 1 : t[1] ? Nt.indexOf(l) : Ho(l) - 1;
  return e[s] ?? null;
}
function Hn(e, n, o, t, l) {
  const s = Zt(n, o);
  if (s.some((k) => Bo.test(k))) {
    const k = t && e.find((x) => x.id === t);
    return k ? { item: k, rank: 0 } : { pointing: !0 };
  }
  for (const k of s) {
    if (!k.startsWith("@")) continue;
    const x = e.find((P) => P.id === k.slice(1));
    if (x) return { item: x, rank: 0 };
  }
  for (const [k, x] of _t.entries())
    for (const P of s) {
      const T = e.filter((g) => x(g.label.toLowerCase(), P.toLowerCase()));
      if (T.length === 1) return { item: T[0], rank: k };
      if (T.length > 1) return { several: T };
    }
  const p = l ? Uo(e, n, o) : null;
  return p ? { item: p, rank: _t.length } : {};
}
class gn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function Yn(e, n, o, t, l = !1) {
  return { find: (x) => {
    const P = Hn(e, x, n, t, l);
    if (P.item) return P.item;
    const T = Zt(x, n), g = T[T.length - 1];
    if (P.pointing) throw new gn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (P.several) {
      const v = [...new Set(P.several.map((A) => A.label))];
      throw new gn(v.length === 1 ? P.several.length + " " + o + "s are called " + $(v[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + $(g) + ": " + Pe(v.slice(0, 6).map($)) + ". Use the whole name.", "ambiguous", P.several.map((A) => A.id));
    }
    const y = e.map((v) => v.label);
    throw new gn("There is no " + o + " called " + $(g) + " here." + (y.length && y.length <= 6 ? " The " + o + "s are " + Pe(y.map($)) + "." : y.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((v) => v.id));
  }, attempt: (x) => Hn(e, x, n, t, l).item ?? null, rank: (x) => Hn(e, x, n, t, l).rank ?? 1 / 0 };
}
const Vt = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Ie = [...Vt], ze = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Qt = Vt.slice(5);
function xn(e) {
  if (e.lanes[0]?.station) return "map";
  const n = se(e);
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
}, Zn = {
  "launch-plan": W.launchLanes,
  pipeline: W.pipelineLanes,
  budget: W.budgetLanes,
  "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, ae = (e, n) => Object.fromEntries(Ie.filter((o) => !e.includes(o)).map((o) => [o, n])), te = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), Q = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ee = (e) => ({ type: "ref", of: "card", about: e }), Bn = (e) => ({ map: e }), be = ae(["map"], W.notMap), ve = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), Vn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: te(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: Q("The lane or step."), label: te(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ee("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: te(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...Zn }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Q("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...Zn }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: Q("The lane or step it starts in."),
      label: te(80, "What the card says. Left out, the card is empty (on a map, the token is numbered); a launch plan, pipeline, budget, hiring plan or nest board needs it.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: ve("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: ve("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: ve("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...Qt],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ee("The card or token.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: ee("The card or token."), lane: Q("Where it goes.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ee("The token.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: Q("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Ie.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": W.launchLanes, budget: W.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ee("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: ze,
    refusals: { ...Bn(W.mapCardLanes), ...ae([...ze, "map"], W.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ee("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...ae(["release-plan"], W.notPoints), map: W.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: ee("The feature."),
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
      card: ee("The card."),
      lane: Q("The lane."),
      whenPresent: te(160, "What it says when the card is there."),
      whenAbsent: te(160, "What it says otherwise."),
      label: te(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: ze,
    refusals: { ...Bn(W.mapOutcome), ...ae([...ze, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ee("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: ze,
    refusals: { ...Bn(W.mapOutcome), ...ae([...ze, "map"], W.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: Q("The lane or step."), before: Q("Present it just before this one.", !0), after: Q("Present it just after this one.", !0) },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: Q("The step it follows."), label: te(80, "The new step’s name."), outcome: te(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: Q("The step it goes in front of."),
      from: Q("Only the path from this step is taken over.", !0),
      label: te(80, "The new step’s name."),
      outcome: te(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: Q("The step."), outcome: te(160, "What it says.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: Q("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: Q("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: Q("The step."), alt: te(240, "What the picture shows.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: ee("The card the line starts at."), to: ee("The card it points to."), label: te(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: pn()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: ee("One card."), to: ee("The other card.") },
    boards: ["lanes"],
    refusals: pn()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: ee("The card."),
      note: te(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: te(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: pn()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: ee("The card."), note: te(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: pn()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: ee("The task."), duration: ve("Its days, 1 to 60.", 60, 1, !0), lag: ve("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ee("The task that waits."), waitsOn: ee("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ee("The task that waits."), waitsOn: ee("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: ve("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: ae(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ee("The deal or line item."), amount: ve("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: ae(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: ve("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: ae(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: Q("The team giving."), to: Q("The team receiving."), amount: ve("Whole currency units.", 1e9, 1) },
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
      rule: te(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: ae(["lanes", "pipeline"], W.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: te(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: ae(["lanes", "pipeline"], W.noRules) }
];
function pn() {
  return { ...ae(["lanes"], W.businessLines), "release-plan": W.lines, "customer-interviews": W.lines, "experiment-budget": W.lines, map: W.lines };
}
const Go = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", Rt = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, Ko = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function qo(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: Ko(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: Rt.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: o,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: o,
        to: { type: "array", items: o, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: o,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: o,
        ...Rt.keys
      }, description: e.about };
  }
}
const Xt = (e) => "optional" in e && e.optional === !0;
function Kr(e) {
  const n = e ? xn(Z(e)) : void 0;
  return Vn.map((o) => {
    const t = Object.entries(o.fields), l = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, p]) => !Xt(p)).map(([p]) => p)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([p, k]) => [p, qo(k, n)])) }
    }, s = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: l };
    return n && (s.accepted = o.boards.includes(n), s.accepted || (s.refusal = o.refusals[n])), s;
  });
}
const mn = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function Jo(e, n) {
  const o = !!e.lanes[0]?.station, t = Yn(e.lanes, o ? mn.step : mn.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), l = Yn(e.cards, o ? mn.token : mn.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: l };
  const s = (p) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (p) => s(p) ?? l.find(p),
    attempt: (p) => s(p) ?? l.attempt(p),
    rank: (p) => s(p) ? 0 : l.rank(p)
  } };
}
class z {
  constructor(n, o, t = null, l, s, p) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = l, this.candidates = s, this.limits = p;
  }
}
function An(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function K(e, n, o = null, t) {
  try {
    return Z(e);
  } catch (l) {
    throw new z(An(l instanceof Error ? l.message : String(l), n), "refused", o, t);
  }
}
function Yo(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, l] of Object.entries(n.fields)) {
    const s = e[t];
    if (s === void 0) {
      if (Xt(l)) continue;
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
        if (!s || typeof s != "object" || typeof s.src != "string" || typeof s.alt != "string" || Object.keys(s).some((k) => k !== "src" && k !== "alt")) return p + "{src, alt} or null.";
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
function Zo(e, n, o, t, l) {
  const s = structuredClone(e), p = o === "map", k = o === "release-plan", x = Jo(s, t), P = { lane: p ? "step" : "lane", card: p ? "token" : "card" };
  function T(r, m, I, S, L = null) {
    if (typeof I == "object") {
      const R = r.find((q) => q.id === I.id);
      if (!R) throw new z("That " + S + " is no longer on the workshop.", "gone", L);
      return R;
    }
    const E = r.find((R) => R.id === I);
    if (E) return E;
    try {
      return m.find(I);
    } catch (R) {
      if (!(R instanceof gn)) throw R;
      const q = R.reason === "ambiguous" ? "ambiguous_reference" : R.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new z(R.message, q, L, void 0, R.candidates.length ? R.candidates : void 0);
    }
  }
  const g = (r, m = null) => T(s.lanes, x.lanes, r, "lane", m), y = (r, m = null) => T(s.cards, x.cards, r, "card", m), v = (r) => {
    try {
      return g(r);
    } catch {
      return null;
    }
  }, A = (r, m, I = {}, S = !0) => ({ board: r, said: m, changed: S, ...I }), _ = (r) => s.cards.filter((m) => m.laneId === r).length, D = (r) => p ? "The presentation opens with " + $(r[0].label) + "." : "The presentation now runs " + r.map((m) => $(m.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return me().edit(s, n, l, {
      lane: (r) => g(r),
      card: (r) => y(r),
      done: (r, m, I) => A(r, m, I),
      refuse: (r, m = {}) => {
        throw new z(r, m.code ?? "refused", m.laneId ?? null, m.cardId);
      }
    });
  if (Qt.includes(o)) {
    n.kind === "add_card" && Mt(n, o, g(n.lane).id);
    const r = {
      card: (I) => y(I),
      lane: (I) => g(I),
      refuse: (I, S = {}) => {
        throw new z(I, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (I, S = null, L) => K(I, o, S, L),
      done: (I, S, L) => A(I, S, L)
    }, m = ye(o).edit(s, n, r);
    if (m) return m;
  }
  switch (n.kind) {
    case "rename_workshop": {
      s.title = n.title;
      const r = K(s, o);
      return A(r, "Renamed the " + (p ? "map" : "workshop") + " to " + $(r.title) + ".");
    }
    case "rename_lane": {
      const r = g(n.lane), m = r.label;
      r.label = n.label;
      const I = K(s, o, r.id);
      return A(I, "Renamed " + $(m) + " to " + $(I.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = y(n.card), m = r.label;
      r.label = n.label;
      const I = K(s, o, r.laneId, r.id);
      return A(I, "Renamed " + $(m) + " to " + $(I.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (s.lanes.length >= 5) throw new z("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new z("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Ar(s, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (I) {
        throw new z(An(I.message, o), "refused");
      }
      const m = r.lanes[r.lanes.length - 1];
      return A(r, "Added the lane " + $(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const r = g(n.lane), m = s.cards.filter((I) => I.laneId === r.id);
      if (p) {
        if (m.length) throw new z($(m[0].label) + " is at " + $(r.label) + ". Move it to another step first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new z("A map needs at least two steps.", "refused", r.id);
      } else {
        if (m.length) throw new z($(r.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new z("A workshop needs at least two lanes.", "refused", r.id);
      }
      s.lanes = s.lanes.filter((I) => I !== r);
      for (const I of s.lanes) I.station && (I.station.next = I.station.next.filter((S) => S !== r.id));
      s.presentationOrder && (s.presentationOrder = s.presentationOrder.filter((I) => I !== r.id));
      for (const I of s.cards) I.allowedLaneIds && (I.allowedLaneIds = I.allowedLaneIds.filter((S) => S !== r.id));
      return wn(s, (I) => I.laneId === r.id), s.behaviour && (s.behaviour = me().dropLane(s.behaviour, r.id)), A(K(s, o), "Removed the " + P.lane + " " + $(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = g(n.lane);
      if (p) {
        if (n.allowedLanes !== void 0) throw new z(W.mapCardLanes, "not_on_this_board", r.id);
        let L = n.label;
        if (L === void 0) {
          let j = s.cards.length + 1;
          for (; s.cards.some((Y) => Y.label === "Token " + j); ) j++;
          L = "Token " + j;
        }
        const E = new Set([...s.lanes, ...s.cards].map((j) => j.id));
        let R = 1;
        for (; E.has("token-" + R); ) R++;
        s.cards.push({ id: "token-" + R, label: L, laneId: r.id });
        const q = K(s, o, r.id);
        return A(q, "Added " + $(q.cards[q.cards.length - 1].label) + " at " + $(r.label) + ".", { laneId: r.id, cardId: "token-" + R });
      }
      if (Mt(n, o, r.id), s.cards.length >= 24) throw new z("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && _(r.id) >= r.capacity)
        throw new z($(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map((L) => g(L).id))];
      let I;
      try {
        I = Cr(s, r.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch (L) {
        throw new z(An(L.message, o), "refused", r.id);
      }
      const S = I.cards[I.cards.length - 1];
      return A(I, "Added " + (S.label ? $(S.label) : "an empty card") + " to " + $(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = y(n.card);
      if (p && s.cards.length === 1) throw new z("A map needs at least one token.", "refused", r.laneId, r.id);
      if (k && s.cards.length === 1) throw new z("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && s.cards.length === 1) throw new z("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      s.cards = s.cards.filter((m) => m !== r);
      for (const m of s.cards)
        m.dependsOn?.includes(r.id) && (m.dependsOn = m.dependsOn.filter((I) => I !== r.id), m.dependsOn.length || delete m.dependsOn);
      return wn(s, (m) => m.cardId === r.id), A(K(xr(s, r.id), o, r.laneId), "Removed the " + P.card + " " + $(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? s.lanes.find((S) => S.id === n.lane.id) ?? null : v(n.lane), m = y(n.card, r?.id ?? null), I = g(n.lane, m.laneId);
      return N(m, I);
    }
    case "advance_card": {
      const r = y(n.card), m = s.lanes.find((S) => S.id === r.laneId), I = m.station.next.map((S) => s.lanes.find((L) => L.id === S)).filter((S) => !!S);
      if (!I.length) throw new z($(r.label) + " is at " + $(m.label) + ", and no path leads on from there.", "refused", m.id, r.id);
      if (I.length > 1)
        throw new z("From " + $(m.label) + " the path goes to " + I.map((S) => $(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + I[0].label + "”.", "refused", m.id, r.id);
      return N(r, I[0]);
    }
    case "set_lane_capacity": {
      const r = g(n.lane), m = s.behaviour && me().setLimit(s, r.id, n.capacity, l);
      if (typeof m == "string") throw new z(m, "refused", r.id);
      if (m) return A(m, $(r.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: r.id });
      const I = p ? "token" : k ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, A(K(s, o, r.id), p ? "Removed the limit at " + $(r.label) + "." : $(r.label) + " now holds any number of " + I + "s.", { laneId: r.id });
      const S = k ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > S)
        throw new z((p ? "A step" : "A lane") + " can hold from 1 to " + S + " " + I + "s.", "refused", r.id);
      const L = k ? s.cards.reduce((E, R) => E + (R.laneId === r.id ? R.points ?? 1 : 0), 0) : _(r.id);
      if (L > n.capacity)
        throw new z($(r.label) + " already holds " + L + " " + I + (L === 1 ? "" : "s") + ". Move some " + (p ? "on" : "out") + " first, or choose a higher " + (k ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, A(K(s, o, r.id), $(r.label) + " now holds up to " + n.capacity + " " + I + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = y(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, A(K(s, o, r.laneId, r.id), $(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const m = [...new Set(n.lanes.map((S) => g(S)))], I = s.lanes.find((S) => S.id === r.laneId);
      if (!m.includes(I)) throw new z($(r.label) + " is in " + $(I.label) + " now. Include " + $(I.label) + ", or move the card first.", "refused", I.id, r.id);
      return r.allowedLaneIds = m.map((S) => S.id), A(K(s, o, r.laneId, r.id), $(r.label) + " can now go only in " + Pe(m.map((S) => $(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = y(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new z("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, A(K(s, o, r.laneId, r.id), $(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = y(n.card), m = [...new Set(n.dependsOn.map((S) => y(S)))], I = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = m.filter((L) => r.dependsOn?.includes(L.id));
        if (!S.length) throw new z($(r.label) + " does not depend on " + Pe(m.map((L) => $(L.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((L) => !S.some((E) => E.id === L)), r.dependsOn.length || delete r.dependsOn, A(K(s, o, r.laneId, r.id), $(r.label) + " no longer depends on " + Pe(S.map((L) => $(L.label))) + ".", I);
      }
      if (!m.length) {
        if (n.mode === "add") throw new z("Name the features " + $(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, A(K(s, o, r.laneId, r.id), $(r.label) + " no longer depends on anything.", I);
      }
      if (m.includes(r)) throw new z("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...m.map((S) => S.id)])], A(K(s, o, r.laneId, r.id), $(r.label) + " now depends on " + Pe(m.map((S) => $(S.label))) + ".", I);
    }
    case "set_outcome": {
      const r = y(n.card), m = g(n.lane), I = s.signals ?? (s.signals = []), S = n.label, L = S === void 0 ? I.filter((j) => j.cardId === r.id && j.laneId === m.id) : I.filter((j) => j.cardId === r.id && j.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && L.length > 1) throw new z("Two outcomes on this card have that name.", "refused", m.id, r.id);
      if (!L.length && I.length >= 24) throw new z("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, r.id);
      let E = 1;
      for (; I.some((j) => j.id === "signal-" + E); ) E++;
      const q = { label: S ?? L[0]?.label ?? (r.label + " in " + m.label).slice(0, 80).trim(), cardId: r.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return L.length ? Object.assign(L[0], q) : I.push({ id: "signal-" + E, ...q }), A(K(s, o, m.id, r.id), "When " + $(r.label) + " is in " + $(m.label) + " the workshop says " + $(n.whenPresent) + ". Otherwise it says " + $(n.whenAbsent) + ".", { laneId: m.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = y(n.card), m = (s.signals ?? []).filter((I) => I.cardId === r.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new z($(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        wn(s, (I) => I.cardId === r.id);
      } else {
        const I = T(m, Yn(m, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        wn(s, (S) => S.id === I.id);
      }
      return A(K(s, o, r.laneId, r.id), "Removed the outcome from " + $(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((m) => g(m));
      if (r.length !== s.lanes.length || new Set(r).size !== s.lanes.length) throw new z("Include each scene once in the presentation order.", "refused");
      return s.presentationOrder = r.map((m) => m.id), A(K(s, o), D(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new z("Say before or after, not both.", "invalid_edit");
      const r = g(n.lane), m = n.before ?? n.after, I = m === void 0 ? void 0 : g(m);
      if (I && I.id === r.id) throw new z("Choose two different scenes.", "refused", r.id);
      const S = ut(s).filter((L) => L.id !== r.id);
      return S.splice(I ? S.findIndex((L) => L.id === I.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), s.presentationOrder = S.map((L) => L.id), A(K(s, o, r.id), D(S), { laneId: r.id });
    }
    case "add_station": {
      const r = g(n.from);
      let m;
      try {
        m = qt(s, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new z(S.message, "refused", r.id);
      }
      const I = m.lanes[m.lanes.length - 1];
      return A(m, "Added a path from " + $(r.label) + " to " + $(I.label) + ".", { laneId: I.id });
    }
    case "insert_station": {
      const r = g(n.before), m = n.from === void 0 ? void 0 : g(n.from), I = m ? [m] : s.lanes.filter((E) => E.station.next.includes(r.id));
      if (m && !m.station.next.includes(r.id))
        throw new z("There is no path from " + $(m.label) + " to " + $(r.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!I.length) throw new z("Nothing leads to " + $(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = qt(s, I[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (E) {
        throw new z(E.message, "refused", r.id);
      }
      const L = S.lanes[S.lanes.length - 1];
      for (const E of S.lanes)
        I.some((R) => R.id === E.id) && (E.station.next = [...new Set(E.station.next.map((R) => R === r.id ? L.id : R))]);
      return L.station.next = [r.id], A(K(S, o, L.id), "Added " + $(L.label) + " before " + $(r.label) + ".", { laneId: L.id });
    }
    case "connect_stations": {
      const r = g(n.from), m = g(n.to);
      if (r.id === m.id) throw new z("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(m.id) ? A(s, $(r.label) + " already leads to " + $(m.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(m.id), A(K(s, o, r.id), "Connected " + $(r.label) + " to " + $(m.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = g(n.from), m = g(n.to);
      if (!r.station.next.includes(m.id)) throw new z("There is no path between " + $(r.label) + " and " + $(m.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((I) => I !== m.id), A(K(s, o, r.id), "Removed the path from " + $(r.label) + " to " + $(m.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = g(n.station);
      return r.station.outcome = n.outcome, A(K(s, o, r.id), "Changed what happens at " + $(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = g(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), A(K(s, o, r.id), "Moved " + $(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = g(n.station);
      return n.image === null ? (delete r.station.image, A(K(s, o, r.id), "Removed the image at " + $(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, A(K(s, o, r.id), "Updated the image at " + $(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = g(n.station);
      if (!r.station.image) throw new z("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, A(K(s, o, r.id), "Updated the image description at " + $(r.label) + ".", { laneId: r.id });
    }
    case "connect_cards":
    case "connect_note": {
      const r = y(n.card);
      let m = r.id, I, S;
      if (n.kind === "connect_cards") {
        const j = y(n.to, r.laneId);
        if (j.id === r.id) throw new z("A line joins two different cards.", "refused", r.laneId, r.id);
        I = j.id, S = $(j.label);
      } else {
        const j = n.note.trim();
        if (s.cards.some((Y) => Y.id === j) || s.lanes.some((Y) => Y.id === j))
          throw new z("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", r.laneId, r.id);
        I = j, S = "the note " + j, n.direction === "from_note" && ([m, I] = [I, m]);
      }
      const L = mo(s, m, I, n.label ? { label: n.label } : {}), E = sn(s, L);
      if (E) throw new z(E, "refused", r.laneId, r.id);
      const R = bn(s, L), q = m === r.id;
      return A(
        R,
        q ? "Drew a line from " + $(r.label) + " to " + S + "." : "Drew a line from " + S + " to " + $(r.label) + ".",
        { laneId: r.laneId, cardId: r.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const r = y(n.card), m = n.kind === "disconnect_cards" ? y(n.to, r.laneId).id : n.note.trim(), I = n.kind === "disconnect_cards" ? $(s.cards.find((E) => E.id === m).label) : "the note " + m, S = (E) => E.parentId === r.id && E.childId === m || E.parentId === m && E.childId === r.id, L = s.lines ?? [];
      return L.some(S) ? (s.lines = L.filter((E) => !S(E)), A(K(s, o, r.laneId, r.id), "Took away the line between " + $(r.label) + " and " + I + ".", { laneId: r.laneId, cardId: r.id })) : A(e, $(r.label) + " and " + I + " are not joined by a line.", { laneId: r.laneId, cardId: r.id }, !1);
    }
  }
  throw new z("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function N(r, m) {
    const I = { laneId: m.id, cardId: r.id };
    if (r.laneId === m.id)
      return A(e, $(r.label) + " is already " + (p ? "at " : "in ") + $(m.label) + ".", I, !1);
    const S = rn(e, r.id, m.id);
    if (!S) throw new z(yn(e, r.id, m.id) ?? "That move is not available.", "refused", m.id, r.id);
    return A(K(S, o, m.id, r.id), "Moved " + $(r.label) + " to " + $(m.label) + ".", I);
  }
}
function Mt(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount", "band"].find((l) => e[l] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? l !== "amount" && (l !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && l === "amount"));
  if (t) throw new z(t === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", o);
}
function wn(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function De(e, n, o = {}) {
  const t = (T) => ({ refused: { index: 0, kind: null, laneId: null, ...T } });
  let l;
  try {
    l = Z(e);
  } catch (T) {
    return t({ reason: "The workshop cannot be read: " + (T instanceof Error ? T.message : String(T)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const s = l, p = [], k = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [T, g] of n.entries()) {
    const y = g?.kind, v = Vn.find((m) => m.kind === y);
    if (!g || typeof g != "object" || !v)
      return t({
        index: T,
        kind: typeof y == "string" ? y : null,
        code: "invalid_edit",
        reason: "There is no edit called " + $(String(y)) + ". The edits are " + Pe(Vn.map((m) => m.kind)) + "."
      });
    const A = Yo(g, v);
    if (A) return t({ index: T, kind: v.kind, code: "invalid_edit", reason: A });
    const _ = xn(l);
    if (!v.boards.includes(_))
      return t({ index: T, kind: v.kind, code: "not_on_this_board", reason: v.refusals[_] ?? "This workshop does not take " + v.kind + "." });
    let D;
    try {
      D = Zo(l, g, _, o.selection, k);
    } catch (m) {
      if (!(m instanceof z)) throw m;
      return t({
        index: T,
        kind: v.kind,
        reason: m.reason,
        code: m.code,
        laneId: m.laneId,
        ...m.cardId && { cardId: m.cardId },
        ...m.candidates && { candidates: m.candidates },
        ...m.limits && { limits: m.limits }
      });
    }
    const N = l.behaviour && !Go(v.kind) ? me().check(l, D.board) : null;
    if (N && "refused" in N)
      return t({ index: T, kind: v.kind, reason: N.refused.sentence, code: "refused", laneId: N.refused.laneId, cardId: N.refused.cardId });
    const r = Xo(l, D.board);
    if (r) return t({ index: T, kind: v.kind, reason: r, code: "not_on_this_board", laneId: D.laneId ?? null });
    l = D.board, p.push({
      index: T,
      kind: v.kind,
      said: D.said,
      changed: D.changed ?? !0,
      ...D.laneId && { laneId: D.laneId },
      ...D.cardId && { cardId: D.cardId }
    });
  }
  const x = new Map(s.cards.map((T) => [T.id, T.laneId])), P = l.cards.flatMap((T) => {
    const g = x.get(T.id);
    return g === void 0 || g === T.laneId ? [] : [{ cardId: T.id, fromLaneId: g, toLaneId: T.laneId }];
  });
  return { workshop: l, report: { edits: p, movedCards: P } };
}
function Vo(e, n) {
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
      const k = n.lanes.find((x) => x.id === p.id);
      return p.floor !== k.floor || p.cap !== k.cap || p.capacity !== k.capacity;
    });
    if (s) return `${s.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((l) => l.id === t.id).capacity) ? W.launchLanes : o && ye(o).fixed?.(e, n) || null;
}
const Qo = {
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
function Xo(e, n) {
  const o = Z(e), t = xn(o);
  let l;
  try {
    l = Z(n);
  } catch (x) {
    return An(x instanceof Error ? x.message : String(x), t);
  }
  const s = xn(l), p = (x, P) => x.lanes.length === P.lanes.length && x.lanes.every((T) => P.lanes.some((g) => g.id === T.id)), k = (x, P) => x.lanes.every((T, g) => P.lanes[g]?.id === T.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && s !== t)
    return p(o, l) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !k(o, l)) return W.keepsOrder;
  if (se(o) && s === t && !(p(o, l) && k(o, l))) return Zn[t];
  if (se(o) && s === t) {
    const x = Vo(o, l);
    if (x) return x;
  }
  if (t === "release-plan" && s === "release-plan") {
    if (!p(o, l)) return W.releaseLanes;
    if (!k(o, l)) return W.releaseOrder;
    if (l.cards.some((x) => !o.cards.some((P) => P.id === x.id))) return W.releaseCards;
  }
  return t !== s ? "This slate holds a " + Qo[t] + ", and it stays one. Start a new slate for another kind of workshop." : o.behaviour || l.behaviour ? me().replacement(o, l) : null;
}
const qr = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Jr(e) {
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
    let k = s.after;
    for (; k !== null; ) {
      if (p.has(k) || !t.has(k) || l.includes(s.id) && !l.includes(k)) return null;
      p.add(k), k = t.get(k).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: l };
}
function er(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function Yr(e, n) {
  return er(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const eo = ["firstPrint", "secondPrint", "thirdPrint"], no = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Zr(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...no, route: n.route };
  for (const t of eo) {
    const l = n[t];
    if (typeof l != "string" || !l.trim() || l.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = l.trim();
  }
  return o;
}
function Vr(e = new URLSearchParams()) {
  const n = { ...no };
  for (const t of eo) {
    const l = e.get(t)?.trim();
    l && l.length <= 48 && (n[t] = l);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function Qr(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function nr(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = rr(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), or(n), n;
}
function tr(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function or(e) {
  return e && tr(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Wt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Un(e) {
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
function rr(e) {
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
function Gn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const jt = "#1f7a5c", zt = "#5b9a85", Kn = "#c2410c", sr = "#2f5fd0", ir = { canMove: !1, canSelect: !1 };
function ar(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function Xr(e, n, o = {}) {
  let t = Z(n);
  const l = o.kit, s = (i) => !!se(i) && !l;
  if (s(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const p = l?.layer(e);
  let k = null, x = null, P = !!o.readOnly, T = P || s(t), g = !1;
  const y = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let N = null, r = null, m = null, I = null;
  const S = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map();
  let E = null, R = null;
  function q(i, a) {
    R && clearTimeout(R.timer), R = { name: i, reason: a, timer: setTimeout(() => {
      R = null, g || F(x ?? t);
    }, 3e3) };
  }
  let j = Promise.resolve(), Y = null, J = Ft(o.layout);
  const Ne = { ...o.style };
  let pe = /* @__PURE__ */ new Map(), Le = /* @__PURE__ */ new Set(), Re = null, de = !1;
  const le = /* @__PURE__ */ new Map();
  We(t);
  const X = o.origin ? { x: o.origin.x, y: o.origin.y } : dr(e), Ae = (i) => D.get(i) ?? i, fe = (i) => ar(Ae(i));
  function ce(i) {
    const a = _.get(i);
    if (a) return a;
    if (y.has(i) && !D.has(i) || !e.nodes.one?.(i)) return i;
    const d = ko(i, (c) => !!e.nodes.one?.(c) || D.has(c));
    return _.set(i, d), D.set(d, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const ke = {
    governs(i) {
      if (y.get(i.id) !== i) return null;
      const a = fe(i.id)?.kind;
      return a === "card" ? { canMove: !T, canEditText: !T && !x && t.kind !== "release-plan", canConnect: Ze() } : a === "lane" ? { canMove: !1, canEditText: !T && !x } : a === "handle" ? { canMove: !T && !x, canEditText: !1 } : ir;
    },
    onStart(i, a) {
      const d = fe(i.id), c = { x: a.x - (i.options.x ?? 0), y: a.y - (i.options.y ?? 0) };
      if (d.kind === "handle") {
        const f = !T && !x && l ? l.handleDrag(t, Ae(i.id), c, J) : null;
        return f ? (ie(), $e(), R && (clearTimeout(R.timer), R = null), k = { name: Ae(i.id), follow: f, last: null }, !0) : !1;
      }
      const b = d.key;
      if (T || x || !t.cards.some((f) => f.id === b)) return !1;
      ie(), $e();
      let u = null;
      try {
        u = (l?.chooser ?? o.chooseCandidate)?.(t, b, c, J) ?? null;
      } catch (f) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", f);
      }
      return N = { cardId: b, evaluate: u, grab: c, outcome: { kind: "home" } }, F(t, { skip: b }), !0;
    },
    onMove(i, a) {
      if (k) {
        k.last = k.follow(Xe(a)), F(k.last.next, { grip: k.name }), H(o.onPreview, k.last.next === t ? null : k.last.next);
        return;
      }
      if (!N) return;
      const d = wt(N.cardId, a, N.evaluate);
      if (lr(d, N.outcome)) return;
      N.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      F(c ?? t, { skip: N.cardId }), H(o.onPreview, c);
    },
    onEnd(i, a) {
      if (k) {
        const { follow: f, name: h } = k, w = f(Xe(a));
        k = null, H(o.onPreview, null), w.refusal ? (q(h, w.refusal), F(t), e.announce?.(w.refusal), H(o.onRefuse, { laneId: null, reason: w.refusal })) : un(w.next, {}) || F(t);
        const O = zn(t, h);
        return O ? { accept: !0, settle: O } : { accept: !1 };
      }
      if (!N) return { accept: !1 };
      const { cardId: d, evaluate: c } = N, b = wt(d, a, c), u = t.cards.find((f) => f.id === d);
      if (N = null, H(o.onPreview, null), b.kind === "candidate" && l) {
        if (!un(b.next, { cardId: d, laneId: b.laneId }, d))
          return F(t, { skip: d }), { accept: !1 };
        b.said && (q("card-" + d, b.said), e.announce?.(b.said));
        const f = zn(t, Ae(i.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (b.kind === "candidate") {
        t = b.next, F(t, { skip: d });
        const f = t.lanes.find((w) => w.id === b.laneId);
        e.announce?.(`${V(u)} moved to ${f.label}. ${xe(t, f.id)}.`), H(o.onChange, t, { cardId: d, laneId: b.laneId });
        const h = zn(t, Ae(i.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (b.kind === "refused")
        Mo(V(u), { cardId: d, laneId: b.laneId, reason: b.reason }), b.near && q("card-" + d, b.reason);
      else if (b.kind === "outside" && tn(t) && !Je()) {
        const f = kn(t, d);
        if (!f)
          return jn(d, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
        F(t, { skip: d }), e.announce?.(f), H(o.onRefuse, { cardId: d, laneId: null, reason: f });
      } else
        F(t, { skip: d }), b.kind === "outside" && (e.announce?.(`${V(u)} was not dropped on a lane. It stays where it was.`), H(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (k) {
        k = null, H(o.onPreview, null), F(t);
        return;
      }
      const a = N && t.cards.find((d) => d.id === N.cardId);
      N = null, H(o.onPreview, null), F(t, { skip: fe(i.id)?.key }), a && e.announce?.(`Move cancelled. ${V(a)} stays where it was.`);
    },
    onTextCommit(i, a, d) {
      const c = fe(i.id);
      if (!c || T || x) return !1;
      let b = a.replace(/\s+/g, " ").trim();
      const u = [], f = se(t), h = f && c.kind === "card" ? ye(f).renamed(t, c.key, b) : null;
      h && (b = h.label, u.push(...h.edits));
      const w = c.kind === "lane" ? { laneId: c.key, label: b } : { cardId: c.key, label: b };
      u.unshift(c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: b } : { kind: "rename_card", card: { id: c.key }, label: b });
      const O = De(t, u);
      if ("refused" in O) {
        const { reason: C } = O.refused;
        return e.announce?.(`${d} keeps its name. ${C}`), H(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: w, reason: C }), !1;
      }
      return JSON.stringify(O.workshop) === JSON.stringify(t) ? (F(t), !1) : (t = O.workshop, F(t), e.announce?.(h ? O.report.edits.map((C) => C.said).join(" ") : `${d} renamed to ${b}.`), H(o.onChange, t, { rename: w, ...l ? { edits: u } : {} }), h ? !1 : b);
    },
    onKeyDown(i, a) {
      const d = fe(i.id);
      if (T || x || N || k || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (m && (m.node !== i.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== m.key) && yt(), m && a.key === "Escape")
        return a.preventDefault(), yt(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (m && a.key === "Enter") {
        a.preventDefault();
        const f = m.choices[m.at];
        return m = null, H(o.onPreview, null), t = f.next, F(t), e.announce?.(f.done), H(o.onChange, t, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: f.edits }), !0;
      }
      const c = l?.keyChoices?.(t, Ae(i.id), a.key);
      if (c) {
        a.preventDefault();
        const f = [], h = [];
        for (const C of typeof c == "string" ? [] : c) {
          const M = De(t, C.edits);
          "refused" in M ? h.push(`${C.said}: ${M.refused.reason}`) : f.push({ ...C, next: M.workshop, done: M.report.edits.map((B) => B.said).join(" ") });
        }
        if (!f.length)
          return e.announce?.(typeof c == "string" ? c : h.join(" ")), !0;
        const w = m && m.node === i.id ? (m.at + 1) % f.length : 0;
        m = { node: i.id, key: a.key.toLowerCase(), choices: f, at: w }, F(f[w].next), H(o.onPreview, f[w].next);
        const O = f.length > 1 ? ` (${w + 1} of ${f.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${f[w].said}${O} Enter to make it, Escape to cancel.`), !0;
      }
      const b = l?.keyEdit?.(t, Ae(i.id), { key: a.key, shiftKey: a.shiftKey });
      if (b) {
        a.preventDefault();
        const f = De(t, b);
        return "refused" in f ? (e.announce?.(f.refused.reason), H(o.onRefuse, { laneId: f.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: f.refused.reason })) : un(f.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = t.cards.find((f) => f.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), gt(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && To())
        return a.preventDefault(), gt(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: f, next: h, spot: w } = r;
        if (r = null, f === null)
          return H(o.onPreview, null), jn(u.id, w), !0;
        const O = t;
        t = h, F(t), Oe(f), H(o.onPreview, null);
        const C = t.lanes.find((M) => M.id === f);
        return e.announce?.(`${V(u)} moved to ${C.label}. ${xe(t, f)}.`), H(o.onChange, t, { cardId: u.id, laneId: f, ...l ? { edits: l.editsBetween(O, t) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), $e(), e.announce?.(`Move cancelled. ${V(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((a) => y.get(a.id) === a).map((a) => a.id);
      de = i.length === 1, y.clear(), v.clear(), A.clear(), le.clear(), _.clear(), D.clear(), N = null, r = null, F(x ?? t, { animate: !1 }), i.length === 1 && (j = j.then(() => {
        de = !1;
        const a = y.get(i[0]);
        if (!g && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        Nn();
      }));
    }
  };
  ke.onFreeMove = (i, a) => {
    if (!an() || i.options?.isComment) return Rn();
    const d = ln(a), c = dn(i), b = t.lanes.filter((h) => !Ye(i) && He(t, h.id, c) === null).map((h) => h.id), u = d && l?.noteUnder?.(t, Xe(a), J);
    u && (c.under = u);
    const f = d ? Ye(i) ?? He(t, d, c) : null;
    I && I.noteId === i.id && I.laneId === d && I.refusal === f || (I = { noteId: i.id, laneId: d, refusal: f, open: b }, Ce());
  }, ke.onFreeDrop = (i, a, d) => {
    if (Rn(), !an() || i.options?.isComment) return;
    const c = ln(a);
    if (!c) return;
    const b = dn(i), u = l?.noteUnder?.(t, Xe(a), J);
    u && (b.under = u);
    const f = t.lanes.find((w) => w.id === c), h = Ye(i) ?? He(t, c, b);
    return h ? (ie(!1), E = { laneId: c, reason: h, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${Mn(b.label)} can't go in ${f.label}. ${h}`), H(o.onRefuse, { noteId: i.id, laneId: c, reason: h }), "refused") : (Wn([{ node: i, offer: b, from: d }], c), "taken");
  }, ke.onFreeGroupDrop = (i, a, d) => {
    if (Rn(), !an() || i.some((h) => h.options?.isComment)) return;
    const c = ln(a);
    if (!c) return;
    const b = t.lanes.find((h) => h.id === c), u = i.map((h) => ({ node: h, offer: dn(h) })), f = Oo(u, c);
    if (f) {
      ie(!1), E = { laneId: c, reason: f, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${kt(u.map((h) => Mn(h.offer.label)))} can't go in ${b.label}. ${f}`);
      for (const { node: h } of u) H(o.onRefuse, { noteId: h.id, laneId: c, reason: f });
      return "refused";
    }
    return Wn(u.map((h, w) => ({ ...h, from: d?.[w] })), c), "taken";
  }, ke.onFreeTextCommit = (i) => {
    if (!an() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const a = i.options ?? {}, d = ln({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = dn(i), b = t.lanes.find((O) => O.id === d), u = Ye(i) ?? He(t, d, c);
    if (!u) {
      Wn([{ node: i, offer: c }], d);
      return;
    }
    ie(!1), E = { laneId: d, reason: u, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${Mn(c.label)} can't go in ${b.label}. ${u} It is beside the board.`), H(o.onRefuse, { noteId: i.id, laneId: d, reason: u });
    const { width: f } = We(t), h = Math.round(X.x + f + 32), w = Math.round(a.y ?? X.y);
    i.position(h, w, () => e.updateSelectionResizeRotate?.(), void 0, Gn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Wt({ ...i.options, x: h, y: w })] });
  }, ke.undoState = () => ({ cards: t.cards.map((i) => ({ ...i })), pairs: [...S], lines: (t.lines ?? []).map((i) => ({ ...i })) }), ke.onUndoRestore = (i, a) => {
    if (g) return;
    const d = new Map((i?.cards ?? []).map((u) => [u.id, u])), c = new Map(i?.pairs ?? []), b = (u) => S.get(u) ?? c.get(u) ?? u;
    for (const u of a.added) {
      const f = b(u), h = t.cards.find((O) => O.id === f);
      if (!h) continue;
      t = Z({ ...t, cards: t.cards.filter((O) => O !== h), lines: Fe(t.lines, f, u) }), F(t);
      const w = H(o.onChange, t, { cardId: f, cardToNote: { noteId: u } });
      e.holdTrade?.(u, w), qn(w);
    }
    for (const u of a.removed) {
      const f = b(u), h = d.get(f);
      if (!h || t.cards.some((G) => G.id === f)) continue;
      const w = (i?.lines ?? []).filter((G) => G.parentId === f || G.childId === f), O = {
        id: f,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...w.length ? { lines: w } : {}
      }, C = [h.laneId, ...t.lanes.map((G) => G.id)].find((G) => nn(t, G, O));
      if (!C) {
        e.announce?.(`${V(h)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = No(nn(t, C, O), f, i?.cards ?? []), f !== u && S.set(u, f), F(t);
      const M = t.cards.findIndex((G) => G.id === f), B = t.cards.slice(M + 1).find((G) => G.laneId === C)?.id, U = H(o.onChange, t, { cardId: f, laneId: C, noteToCard: {
        noteId: u,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...B ? { before: B } : {},
        ...w.length ? { lines: Fe(w, f, u) } : {}
      } });
      e.holdTrade?.(u, U), qn(U);
    }
    Array.isArray(i?.lines) && _o(i.lines);
  };
  let _n = !1;
  ke.onNodeAdded = (i) => {
    g || _n || y.get(i.id) === i || (t.lines ?? []).some((a) => a.parentId === i.id || a.childId === i.id) && (_n = !0, queueMicrotask(() => {
      _n = !1, g || Ce();
    }));
  }, ke.onLine = (i, a) => {
    g || queueMicrotask(() => {
      g || Eo(i, a);
    });
  };
  const Ao = e.setDragPolicy(ke), Co = o.onSelect && e.onSelectionChange?.(() => Nn()), mt = () => {
    r && $e();
  };
  e.element?.addEventListener?.("pointerdown", mt, !0), F(t, { animate: !1 });
  function wt(i, a, d) {
    const c = t.cards.find((C) => C.id === i);
    if (!c) return { kind: "outside" };
    if (l) {
      const C = Xe(a), M = l.refusalAt(t, i, N?.grab ?? { x: 0, y: 0 }, C, J);
      if (M && !M.lands) return { kind: "refused", laneId: M.laneId, reason: M.reason };
      const { width: B, height: U } = We(t);
      if (C.x < -40 || C.y < -40 || C.x > B + 40 || C.y > U + 40) return { kind: "outside" };
      let G = t;
      try {
        G = d?.(C) ?? t;
      } catch (oe) {
        console.warn("WORKSHOP: the board kit's chooser threw", oe);
      }
      return JSON.stringify(G) === JSON.stringify(t) ? M ? { kind: "refused", laneId: M.laneId, reason: M.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: G.cards.find((oe) => oe.id === i)?.laneId ?? c.laneId, next: G, ...M && { said: M.reason } };
    }
    const b = t.lanes.map((C) => y.get(ce(re.column(C.id)))).filter(Boolean), u = e.hitTestNodes(a, b, { padding: 6 }), f = u ? fe(u.id).key : null;
    if (!f) return { kind: "outside" };
    if (f === c.laneId) return { kind: "home" };
    const h = rn(t, i, f);
    if (!h) return { kind: "refused", laneId: f, reason: yn(t, i, f) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: f, next: h };
    let w = null;
    try {
      w = d({ x: a.x - X.x, y: a.y - X.y });
    } catch (C) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", C), { kind: "candidate", laneId: f, next: h };
    }
    const O = w?.cards.find((C) => C.id === i)?.laneId;
    return !w || !O || O === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: O, next: w };
  }
  function To() {
    return l ? !1 : new Set(Be(t, { layout: J }).places.map((i) => i.row)).size > 1;
  }
  function gt(i, a, d = !1) {
    const c = t.cards.find((C) => C.id === i), b = Ht(t, i), u = r?.cardId === i && r.laneId === null ? r.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const C = u > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if ($e(), C.id === c.laneId) {
        Oe(C.id, x ?? t), e.announce?.(`${V(c)} is back in ${C.label}.`);
        return;
      }
      if (b.includes(C)) {
        const B = rn(t, i, C.id);
        r = { cardId: i, laneId: C.id, next: B }, F(B), Oe(C.id, B), H(o.onPreview, B), e.announce?.(`${V(c)} to ${C.label}: ${xe(B, C.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const M = yn(t, i, C.id) ?? "That move is not available.";
      ie(), E = { laneId: C.id, reason: M, timer: setTimeout(() => ie(), 1500) }, F(x ?? t), Oe(C.id, x ?? t), e.announce?.(`${V(c)} can't move to ${C.label}. ${M}`), H(o.onRefuse, { cardId: i, laneId: C.id, reason: M });
      return;
    }
    const f = r?.cardId === i ? r.laneId : c.laneId;
    let h;
    if (d) {
      const { places: C } = Be(t, { layout: J }), M = C.find((B) => B.laneId === f);
      h = C.filter((B) => B.column === M.column && (B.row - M.row) * a > 0).sort((B, U) => (B.row - U.row) * a).map((B) => t.lanes.find((U) => U.id === B.laneId));
    } else {
      const C = t.lanes.findIndex((M) => M.id === f);
      h = a > 0 ? t.lanes.slice(C + 1) : t.lanes.slice(0, C).reverse();
    }
    const w = h.find((C) => b.includes(C));
    if (ie(), !w) {
      const C = h[0];
      if (!C) {
        if (!d && tn(t)) {
          const B = kn(t, i);
          if (B) {
            e.announce?.(B), H(o.onRefuse, { cardId: i, laneId: null, reason: B });
            return;
          }
          So(c, a);
          return;
        }
        e.announce?.(`${V(c)} has no lane to move to on that side.`);
        return;
      }
      const M = yn(t, i, C.id) ?? "That move is not available.";
      E = { laneId: C.id, reason: M, timer: setTimeout(() => ie(), 1500) }, F(r?.next ?? x ?? t), Oe(C.id, r?.next ?? x ?? t), e.announce?.(`${V(c)} can't move to ${C.label}. ${M}`), H(o.onRefuse, { cardId: i, laneId: C.id, reason: M });
      return;
    }
    if (w.id === c.laneId) {
      $e(), Oe(w.id, x ?? t), e.announce?.(`${V(c)} is back in ${w.label}.`);
      return;
    }
    const O = rn(t, i, w.id);
    r = { cardId: i, laneId: w.id, next: O }, F(O), Oe(w.id, O), H(o.onPreview, O), e.announce?.(`${V(c)} to ${w.label}: ${xe(O, w.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Oe(i, a = t) {
    const d = l ? jo(a, re.column(i)) : Be(a, { layout: J, rows: Tt() }).places.find((w) => w.laneId === i), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const b = 16, u = (w, O, C, M) => O + b * 2 >= M || w - b < C ? w - b - C : w + O + b > C + M ? w + O + b - (C + M) : 0, f = u(X.x + d.x, d.width, c.x, c.width), h = u(X.y + d.y, d.height, c.y, c.height);
    (f || h) && e.panBy?.({ x: f, y: h });
  }
  function Nn() {
    if (!o.onSelect || de) return;
    const i = g ? [] : e.getSelectedNodes?.() ?? [], a = i.length === 1 && y.get(i[0].id) === i[0] ? fe(i[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== Re && (Re = c, H(o.onSelect, d));
  }
  function yt() {
    m && (m = null, F(t), H(o.onPreview, null));
  }
  function $e() {
    r && (r = null, H(o.onPreview, null), F(x ?? t));
  }
  function So(i, a) {
    const { width: d } = We(t), c = y.get(ce(re.card(i.id)))?.options, b = c?.width ?? 228, u = { x: a > 0 ? X.x + d + 32 : X.x - b - 32, y: c?.y ?? X.y }, f = Ut(t, i.id);
    r = { cardId: i.id, laneId: null, side: a, spot: u, next: t }, F(t), H(o.onPreview, f), e.announce?.(`${V(i)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Je() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function an() {
    return !g && !T && !x && !N && !Je() && tn(t);
  }
  function Rn() {
    I && (I = null, g || Ce());
  }
  function ln(i) {
    const a = t.lanes.map((c) => y.get(ce(re.column(c.id)))).filter(Boolean), d = e.hitTestNodes(i, a, { padding: 6 });
    return d ? fe(d.id)?.key ?? null : null;
  }
  function dn(i) {
    const a = i.options ?? {}, d = so({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), b = c.replace(/\s+/g, " ").trim(), u = {};
    c.trim() !== b && c.length <= 4e3 && (u.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const h of ["width", "height"]) Number.isFinite(a[h]) && a[h] >= 10 && a[h] <= 4e3 && (u[h] = Math.round(a[h]));
    if (et(a.image)) {
      u.image = { src: a.image };
      for (const [h, w] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[w]) && a[w] >= 1 && a[w] <= 2e4 && (u.image[h] = a[w]);
    }
    a.link?.data && Dt({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const f = Lo(i);
    return { id: i.id, label: b, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...f.length ? { lines: f } : {} };
  }
  function Lo(i) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!y.get(c) && y.get(c) === e.nodes.one(c);
    for (const c of i.relationships?.getAssociations?.() ?? [])
      !c.targetPoint && !d(c.childId) && a.set(c.id, Ve(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === i || d(c.id)))
        for (const b of c.relationships?.getAssociations?.() ?? [])
          b.childId === i.id && !b.targetPoint && a.set(b.id, Ve(b));
    for (const c of Gt(t, i.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function kt(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function Oo(i, a) {
    for (const { node: u } of i) {
      const f = Ye(u);
      if (f) return f;
    }
    const d = t.lanes.find((u) => u.id === a), c = t.cards.filter((u) => u.laneId === a).length;
    if (d.capacity !== void 0 && c + i.length > d.capacity) {
      const u = d.capacity - c;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let b = t;
    for (const { offer: u } of i) {
      const f = He(b, a, u);
      if (f) return f;
      b = nn(b, a, u);
    }
    return null;
  }
  function Ye(i) {
    if ((i.relationships?.getAssociations?.() ?? []).some((d) => d.targetPoint))
      return "A note with a line that ends on empty canvas stays a note. Join that line to a note first.";
    if (i.options?.image && !et(i.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = i.options?.link;
    return a?.data && !Dt({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const Mn = (i) => i || "This note", V = (i) => i.label || "The empty card";
  function Ze() {
    return !g && !T && !x && !Je() && !t.kind && tn(t);
  }
  function Ve(i) {
    const a = { id: i.id, parentId: i.parentId, childId: i.childId };
    for (const d of [
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
      const c = i[d];
      c != null && c !== "" && (a[d] = c);
    }
    for (const d of ["sourceAnchor", "targetAnchor"]) {
      const c = i[d];
      c && Number.isFinite(c.x) && Number.isFinite(c.y) && (a[d] = { x: c.x, y: c.y });
    }
    return a;
  }
  function bt(i, a) {
    const d = { ...i };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function vt(i) {
    if (!i || e.nodes.one(i.id) !== i) return null;
    if (y.get(i.id) === i) {
      const a = fe(i.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return i.options?.isComment ? null : i.id;
  }
  function It(i, a) {
    if (i.cards.some((c) => c.id === a)) {
      const c = y.get(ce(re.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && y.get(a) !== d && d.svgGroup ? d : null;
  }
  function xt(i) {
    const a = [];
    for (const d of i) {
      const c = e.nodes.one(d.parentId), b = e.nodes.one(d.childId);
      if (!c?.relationships || !b || y.get(c.id) === c || y.get(b.id) === b || c.relationships.hasAssociationId?.(d.id)) continue;
      const u = c.relationships.addAssociation(b, Un(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function $o(i) {
    const a = /* @__PURE__ */ new Set();
    for (const d of i.lines ?? []) {
      const c = It(i, d.parentId), b = It(i, d.childId);
      if (!c || !b || c === b) continue;
      const u = y.get(c.id) !== c, f = u ? b : c, h = u ? c : b, w = u ? bt({ ...d, parentId: f.id, childId: h.id }, d) : { ...d, parentId: f.id, childId: h.id }, O = JSON.stringify(w);
      a.add(d.id);
      const C = le.get(d.id);
      C && C.key === O && C.holder === f && C.other === h && f.relationships.hasAssociationId?.(d.id) || (C && e.nodes.one(C.holder.id) === C.holder && C.holder.relationships?.removeAssociation?.(d.id), f.relationships.addAssociation(h, Un(w)), le.set(d.id, { holder: f, other: h, swapped: u, key: O }));
    }
    for (const [d, c] of [...le])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), le.delete(d));
  }
  function cn(i) {
    const a = i.parentId ? e.nodes.one(i.parentId) : null, d = i.id ?? i.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !i.id) && a.relationships.removeAssociation(d);
    });
  }
  let Qe = null;
  function Eo(i, a) {
    if (i === "addRelationship") {
      if (le.get(a?.id)?.holder.id === a?.parentId) return;
      const d = e.nodes.one(a?.parentId), c = a?.targetPoint ? null : e.nodes.one(a?.childId), b = vt(d), u = vt(c), f = Qe?.lineId === a?.id ? t.lines?.find((C) => C.id === a?.id) : void 0;
      f && (Qe = null);
      const h = (C) => {
        cn(a), f && F(x ?? t), e.announce?.(C), H(o.onRefuse, { reason: C, laneId: null });
      };
      if (!Ze()) {
        cn(a), f && F(x ?? t);
        return;
      }
      if (!b || !u) return h(f ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      if (f) {
        const C = t.cards.some((G) => G.id === b), M = t.cards.some((G) => G.id === u);
        if (!C && !M) return Ee({ remove: f.id });
        const B = { ...Ve(a), id: f.id, parentId: b, childId: u }, U = sn(t, B);
        if (U) return h(U);
        cn(a), Ee({ set: B });
        return;
      }
      const w = mo(t, b, u, Ve(a)), O = sn(t, w);
      if (O) return h(O);
      cn(a), Ee({ set: w });
      return;
    }
    if (i === "removeRelationship") {
      const d = [...le].find(([b, u]) => (b === a?.id || !a?.id && u.other.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = le.get(d);
      if (le.delete(d), e.nodes.one(c.holder.id) !== c.holder || e.nodes.one(c.other.id) !== c.other || !Ze())
        return Ze() || g ? void 0 : F(x ?? t);
      Qe = { lineId: d }, queueMicrotask(() => {
        g || Qe?.lineId !== d || (Qe = null, Ee({ remove: d }));
      });
      return;
    }
    if (i === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...le].find(([C, M]) => C === d?.associationId && M.holder.id === d?.id);
        if (!c) continue;
        const [b, u] = c, f = t.lines?.find((C) => C.id === b), h = u.holder.relationships?.getAssociations?.().find((C) => C.id === b);
        if (!f || !h) continue;
        if (!Ze()) {
          F(x ?? t);
          continue;
        }
        const w = Ve(h), O = u.swapped ? bt({ ...w, id: f.id, parentId: f.parentId, childId: f.childId }, w) : { ...w, id: f.id, parentId: f.parentId, childId: f.childId };
        JSON.stringify(Po(O)) !== JSON.stringify(f) && (le.set(b, { ...u, key: "" }), Ee({ set: O }));
      }
  }
  function Po(i) {
    return bn({ ...t, lines: [] }, i)?.lines?.[0] ?? null;
  }
  function Ee(i) {
    const a = t.lines?.find((h) => h.id === ("set" in i ? i.set.id : i.remove)), d = "set" in i ? bn(t, i.set) : Kt(t, i.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), F(x ?? t);
    const c = "set" in i ? i.set : a, b = [c.parentId, c.childId].map((h) => t.cards.find((w) => w.id === h)?.label ?? e.nodes.one(h)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (h) => b[h] || "a note";
    e.announce?.("set" in i ? a ? `The line from ${u(0)} to ${u(1)} changed.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const f = H(o.onChange, t, { line: i });
    qn(f, () => {
      if (g || t !== d) return;
      const h = a ? bn(t, a) : "set" in i ? Kt(t, i.set.id) : null;
      h && (t = h, F(x ?? t));
    });
  }
  function _o(i) {
    const a = new Map(i.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || Ee({ remove: c });
    for (const [c, b] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(b) && sn(t, b) === null && Ee({ set: b });
  }
  function Wn(i, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), b = i.map(({ node: h, offer: w, from: O }) => {
      let C = w.lines;
      for (const [U, G] of c) C = Fe(C, U, G);
      d = nn(d, a, { ...w, ...C ? { lines: C } : {} });
      const M = d.cards[d.cards.length - 1];
      M.id !== h.id && c.set(h.id, M.id);
      const B = { ...h.options ?? {}, ...O ? { x: O.x, y: O.y } : {} };
      return { node: h, card: M, kept: B, lines: Fe(C ?? [], h.id, M.id), under: w.under };
    });
    e.beginHostStep?.(), t = d;
    let u = t;
    for (const { node: h, card: w } of b)
      w.id !== h.id && S.set(h.id, w.id), L.set(ce(re.card(w.id)), { x: h.options?.x ?? 0, y: h.options?.y ?? 0 }), Me(() => e.removeNode(h.id));
    e.endHostStep?.(), F(t), Ro(ce(re.card(b[0].card.id)));
    const f = t.lanes.find((h) => h.id === a);
    e.announce?.(b.length === 1 ? `${V(b[0].card)} is now a card in ${f.label}. ${xe(t, a)}.` : `${kt(b.map(({ card: h }) => V(h)))} are now cards in ${f.label}. ${xe(t, a)}.`);
    for (const { node: h, card: w, kept: O, lines: C, under: M } of b) {
      const B = { cardId: w.id, laneId: a, noteToCard: {
        noteId: h.id,
        label: w.label,
        ...M && { under: M },
        ...w.look ? { look: w.look } : {},
        ...w.asNote ? { asNote: w.asNote } : {},
        ...C.length ? { lines: C } : {}
      } }, U = () => {
        t !== u || !t.cards.some((oe) => oe.id === w.id) || (t = Z({ ...t, cards: t.cards.filter((oe) => oe.id !== w.id), lines: Fe(t.lines, w.id, h.id) }), u = t, F(t));
      }, G = H(o.onChange, t, B);
      e.holdTrade?.(h.id, G), At(G, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: h.id, isComment: !1 } }]);
      }, () => {
        if (!g) {
          if (U(), !e.nodes.one(O.id)) {
            e.beginHostStep?.();
            const oe = Me(() => e.addNode({ ...O }));
            oe && (oe.announcedByCreator = !0), e.endHostStep?.();
            const Fn = Fe(C, w.id, h.id).filter((ue) => !t.cards.some((fn) => fn.id === ue.parentId || fn.id === ue.childId));
            oe?.ready?.then?.(() => {
              g || Me(() => xt(Fn));
            });
          }
          e.announce?.(`${V(w)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        g || (U(), e.keepTrade?.(h.id), e.announce?.(`Someone else put ${V(w)} on the board first.`));
      });
    }
  }
  function jn(i, a) {
    const d = t.cards.find((ne) => ne.id === i), c = t.lanes.find((ne) => ne.id === d.laneId), b = t.cards.findIndex((ne) => ne.id === i), u = t.cards.slice(b + 1).find((ne) => ne.laneId === d.laneId)?.id, f = v.get(ce(re.card(i))) ?? {}, h = to(d), w = e.nodes.one(h) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : h, O = Gt(t, i), { leave: C } = vr(t, i, w), M = Ut(t, i, w), B = (Ne.cornerRadius ?? 0) > 0, U = d.asNote, G = U?.text !== void 0 && ct(U.text) === d.label ? U.text : br(t, d), oe = {
      id: w,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: U?.width ?? f.width ?? 228,
      height: U?.height ?? f.height ?? 76,
      text: G,
      shape: U?.shape ?? (B ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? f.backgroundColor,
      fontColor: d.look?.textColor ?? f.foregroundColor,
      fontSize: d.look?.fontSize ?? f.fontSize,
      borderColor: d.look?.borderColor ?? f.borderColor,
      borderWidth: d.look?.borderWidth ?? f.borderWidth,
      ...d.look?.fontFamily ?? f.fontFamily ? { fontFamily: d.look?.fontFamily ?? f.fontFamily } : {}
    };
    U?.image && Object.assign(oe, {
      image: U.image.src,
      ...U.image.width ? { imageOrigWidth: U.image.width } : {},
      ...U.image.height ? { imageOrigHeight: U.image.height } : {}
    }), U?.link && (oe.link = { ...U.link });
    for (const ne of Object.keys(oe)) oe[ne] === void 0 && delete oe[ne];
    e.beginHostStep?.(), t = M;
    const Fn = t;
    w !== i ? S.set(w, i) : S.delete(w);
    const ue = Me(() => e.addNode(oe));
    ue && (ue.announcedByCreator = !0), e.endHostStep?.(), F(t);
    const fn = Promise.resolve(ue?.ready).then(() => g || !ue || e.nodes.one(w) !== ue ? [] : Me(() => xt(C))).catch(() => []);
    ue?.ready?.then?.(() => {
      if (g || e.nodes.one(w) !== ue) return;
      const ne = () => e.selectNodes?.([ue]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(ne) : ne();
    }), e.announce?.(`${V(d)} is now a note on the canvas. ${c.label}: ${xe(t, c.id)}.`);
    const Ot = () => {
      e.nodes.one(w) === ue && (e.beginHostStep?.(), Me(() => e.removeNode(w)), e.endHostStep?.());
    }, $t = H(o.onChange, t, { cardId: i, cardToNote: { noteId: w } });
    e.holdTrade?.(w, $t), At($t, () => {
      fn.then((ne) => {
        ue && e.nodes.one(w) === ue && e.sendHeld?.([{ type: "onNodeAdded", data: { id: w, nodeOptions: Wt(ue.options) } }, ...ne]);
      });
    }, () => {
      if (!g) {
        if (Ot(), t === Fn && !t.cards.some((ne) => ne.id === i)) {
          const ne = {
            id: i,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...O.length ? { lines: O } : {}
          }, Et = nn(t, d.laneId, ne, u);
          Et && (t = Et, F(t));
        }
        e.announce?.(`${V(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      g || (Ot(), e.keepTrade?.(w), e.announce?.(`Someone else took ${V(d)} off the lanes first.`));
    });
  }
  function No(i, a, d) {
    const c = d.map((w) => w.id), b = c.indexOf(a), u = i.cards.find((w) => w.id === a);
    if (b < 0 || !u) return i;
    const f = i.cards.filter((w) => w !== u), h = f.findIndex((w) => c.indexOf(w.id) > b);
    return f.splice(h < 0 ? f.length : h, 0, u), Z({ ...i, cards: f });
  }
  function Ro(i) {
    j = j.then(() => {
      const a = y.get(i);
      if (g || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Me(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function At(i, a, d, c) {
    if (!i || typeof i.then != "function") return a();
    const b = i.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && c();
    }, () => d());
    e.holdUntil?.(b);
  }
  function Mo(i, a) {
    ie(!1), E = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => ie(), 1500) }, F(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${i || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), H(o.onRefuse, a);
  }
  function ie(i = !0) {
    E && (clearTimeout(E.timer), E = null, i && !g && Ce());
  }
  function Ce() {
    F(N && N.outcome.kind === "candidate" ? N.outcome.next : r?.next ?? x ?? t, { skip: N?.cardId });
  }
  function Ct(i) {
    const a = St(i, Tt()), d = new Map(a.map((u) => [u.options.id, u.options])), c = (u, f, h, w = !1) => {
      const O = d.get(re.column(u));
      O && (O.borderColor = f, O.borderWidth = h, delete O.borderStyle);
      const C = w && d.get(re.lane(u));
      C && (C.borderColor = f, C.borderWidth = h);
    }, b = N?.cardId ?? r?.cardId;
    if (pe = /* @__PURE__ */ new Map(), b) {
      const u = t.cards.find((w) => w.id === b)?.laneId, f = Ht(t, b);
      if (!l || l.laneCues)
        for (const w of f) w.id !== u && (c(w.id, zt, 2), pe.set(w.id, "open"));
      if (l?.laneCues) {
        for (const w of t.lanes) if (!f.includes(w)) {
          const O = d.get(re.column(w.id));
          O && (O.backgroundColor = "#e9e8e2"), pe.set(w.id, "closed");
        }
      }
      const h = N ? N.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      h?.kind === "candidate" && (c(h.laneId, jt, 3, !0), pe.set(h.laneId, "over")), h?.kind === "refused" && (c(h.laneId, Kn, 3), pe.set(h.laneId, "refused"));
    }
    if (I && !b) {
      for (const u of I.open) u !== I.laneId && (c(u, zt, 2), pe.set(u, "open"));
      I.laneId && !I.refusal && (c(I.laneId, jt, 3, !0), pe.set(I.laneId, "over")), I.laneId && I.refusal && (c(I.laneId, Kn, 3), pe.set(I.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const u = d.get(re.card(r.cardId));
      u && (u.xPos = r.spot.x, u.yPos = r.spot.y);
    }
    if (E) {
      pe.set(E.laneId, "refused"), c(E.laneId, Kn, 3, !0);
      const u = d.get(re.caption(E.laneId));
      u && (u.text = E.reason, u.foregroundColor = "#b42318");
    }
    if (Le = /* @__PURE__ */ new Set(), x && i === x) {
      const u = (h, w) => JSON.stringify(h) === JSON.stringify(w), f = (h) => {
        const w = d.get(h);
        w && (w.borderStyle = "dashed", w.borderColor = sr, w.borderWidth = 2, Le.add(ce(h)));
      };
      for (const h of i.cards) u(h, t.cards.find((w) => w.id === h.id)) || f(re.card(h.id));
      for (const h of i.lanes) u(h, t.lanes.find((w) => w.id === h.id)) || f(re.lane(h.id));
    }
    for (const u of a) {
      u.options.id = ce(u.options.id);
      for (const f of u.relationships.associations)
        f.parentId = ce(f.parentId), f.childId = ce(f.childId);
    }
    return a;
  }
  function Tt() {
    return N || r ? t.lanes.map((i) => t.cards.filter((a) => a.laneId === i.id).length) : void 0;
  }
  function F(i, a = {}) {
    if (g) return;
    Y = { model: i, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Ct(i), c = [];
    for (const { options: u } of d) {
      const f = u.id;
      if (y.has(f)) continue;
      const h = L.get(f);
      L.delete(f);
      const w = h && a.animate !== !1 && !Gn() ? { ...u, xPos: h.x, yPos: h.y } : u, O = e.nodes.add(nr(w));
      y.set(f, O), v.set(f, { ...w }), O.ready && c.push(O.ready.then(() => {
        if (y.get(f) !== O) return;
        O.applyGovernance?.(), fe(f)?.kind === "column" && O.toBack?.(!1), fe(f)?.kind === "handle" && O.svgGroup?.front?.();
        const C = Lt(Y?.model ?? i, f);
        C && O.svgGroup?.node?.setAttribute("aria-label", C);
      }).catch(() => {
      }));
    }
    const b = Y;
    j = Promise.all([j, ...c]).then(() => {
      g || Y !== b || Wo(Ct(b.model), b);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function Wo(i, a) {
    const d = new Set(i.map((b) => b.options.id)), c = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [u, f] of [...y]) {
        if (d.has(u)) continue;
        for (const [w, O] of [...A])
          O.parentId !== u && O.childId !== u || (O.parent.relationships?.removeAssociation(w), A.delete(w));
        e.deselectNode?.(f), f.editor?.cancelInline?.(), y.delete(u), v.delete(u);
        const h = D.get(u);
        h && (D.delete(u), _.delete(h)), e.nodes.remove(u);
      }
      for (const { options: u } of i) {
        const f = u.id, h = y.get(f);
        if (!h?.svgGroup) continue;
        const w = v.get(f) ?? {}, O = h.editor?.isInlineEditing?.();
        (u.fontSize !== w.fontSize || u.foregroundColor !== w.foregroundColor) && (h.options.fontSize = u.fontSize, h.options.fontColor = u.foregroundColor, h.applyTextStyle?.()), u.text !== w.text && !O && h.setText?.(u.text), (u.width !== w.width || u.height !== w.height) && (u.vectorPath ? (h.options.width = u.width, h.options.height = u.height, h.setShape?.(h.options.shape, u.vectorPath), fe(f)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(u.width, u.height)), u.backgroundColor !== w.backgroundColor && h.setColors?.(u.backgroundColor), (u.borderColor !== w.borderColor || u.borderWidth !== w.borderWidth || u.borderStyle !== w.borderStyle) && (h.options.borderColor = u.borderColor, h.options.borderWidth = u.borderWidth, h.options.borderStyle = u.borderStyle, h.applyBorder?.());
        const C = u.xPos !== w.xPos || u.yPos !== w.yPos || Math.abs((h.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - u.yPos) > 0.5;
        if (f !== (a.skip && ce(re.card(a.skip))) && f !== (a.grip && ce(a.grip)) && C) {
          const U = a.animate && !Gn() ? 180 : 0, G = c.includes(h) ? () => {
            !g && y.get(f) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          G && U && c.length === 1 && h.resizeRotate?.disable?.(), h.position(u.xPos, u.yPos, G, void 0, U);
        }
        const M = Lt(a.model, f);
        M && h.svgGroup.node.getAttribute("aria-label") !== M && h.svgGroup.node.setAttribute("aria-label", M), Le.has(f) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed");
        const B = fe(f);
        if (B?.kind === "column") {
          const U = pe.get(B.key);
          U ? h.svgGroup.node.setAttribute("data-workshop-drop", U) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        B?.kind === "handle" && h.svgGroup.front?.(), v.set(f, { ...u });
      }
      const b = /* @__PURE__ */ new Map();
      for (const u of i) for (const f of u.relationships.associations) b.set(f.id, f);
      for (const [u, f] of [...A])
        b.has(u) && y.get(f.parentId) === f.parent && y.get(f.childId) === f.child || (f.parent.relationships?.removeAssociation(u), A.delete(u));
      for (const [u, f] of b) {
        if (A.has(u)) continue;
        const h = y.get(f.parentId), w = y.get(f.childId);
        !h?.relationships || !w?.svgGroup || (h.relationships.addAssociation(w, Un(f)), A.set(u, { parentId: f.parentId, childId: f.childId, parent: h, child: w }));
      }
      $o(a.model);
    }), p) {
      const b = t.lanes.map((w) => y.get(ce(re.column(w.id)))?.svgGroup?.node).reduce((w, O) => O && (!w || w.compareDocumentPosition(O) & 4) ? O : w, null), u = a.model, f = e.canvas?.viewbox?.(), h = f && [f.x, f.y, f.width, f.height].every(Number.isFinite) ? { x: f.x - X.x, y: f.y - X.y, width: f.width, height: f.height } : null;
      p.draw(t, u === t ? null : u, {
        origin: X,
        layout: J,
        above: b,
        view: h,
        announce: (w) => e.announce?.(w),
        clamp: k?.last?.clampedReason ? { name: k.name, text: k.last.clampedReason } : N?.outcome.kind === "candidate" && N.outcome.said ? { name: "card-" + N.cardId, text: N.outcome.said } : !k && R ? { name: R.name, text: R.reason } : null,
        refused: !!k?.last?.refusal || !k && !!R,
        onUnlink: (w, O) => {
          if (T || x || N || k || Je()) return;
          const C = De(t, [{ kind: "unlink_tasks", card: { id: w }, waitsOn: { id: O } }]);
          "refused" in C ? e.announce?.(C.refused.reason) : un(C.workshop, { cardId: w });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function Xe(i) {
    return { x: i.x - X.x, y: i.y - X.y };
  }
  function We(i) {
    return l ? l.places(i, J) : { ...Be(i, { layout: J }), parts: [] };
  }
  function jo(i, a) {
    const d = l.places(i, J).parts.find((c) => c.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function St(i, a) {
    if (!l) return Or(i, { native: !0, origin: X, rows: a, layout: J, style: Ne }).nodes;
    const d = l.notes(i, J, X, Ne);
    if (i.behaviour && d.length) {
      const c = d.map((h) => h.options), b = Math.min(...c.map((h) => h.xPos)), u = Math.max(...c.map((h) => h.xPos + h.width)), f = xo(i, { x: b, y: Math.max(...c.map((h) => h.yPos + h.height)) + 16, width: Math.min(u - b, 484) }, Ne);
      f && d.push(f);
    }
    return d;
  }
  function un(i, a, d) {
    const c = l.editsBetween(t, i);
    if (!c.length) return !1;
    const b = De(t, c);
    return "refused" in b ? (e.announce?.(b.refused.reason), H(o.onRefuse, { ...a, laneId: b.refused.laneId, reason: b.refused.reason }), !1) : (t = b.workshop, F(t, { skip: d }), e.announce?.(b.report.edits.map((u) => u.said).join(" ")), H(o.onChange, t, { ...a, edits: c }), !0);
  }
  function Lt(i, a) {
    const d = fe(a);
    if (d?.kind === "lane") {
      const c = i.lanes.find((b) => b.id === d.key);
      return c ? `${c.label}, ${xe(i, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = i.cards.find((u) => u.id === d.key), b = c && i.lanes.find((u) => u.id === c.laneId);
      return c && b ? `${c.label || "Empty card"}, in ${b.label}${l?.cardKeys ? ". " + l.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? l?.label?.(i, Ae(a)) ?? null : null;
  }
  function zn(i, a) {
    const d = St(i).find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function je() {
    (N || k) && e.cancelGovernedDrag?.("host"), N = null, k = null, r && (r = null, H(o.onPreview, null)), ie(!1);
  }
  return {
    toCanvas(i) {
      if (g || T || Je()) return "This workshop is view-only here.";
      if (!t.cards.some((b) => b.id === i)) return "That card is no longer on the board.";
      const a = kn(t, i);
      if (a) return a;
      r && $e(), x && (je(), x = null, F(t), e.refreshGovernance?.());
      const { width: d } = We(t), c = y.get(ce(re.card(i)))?.options;
      return jn(i, { x: X.x + d + 32, y: c?.y ?? X.y }), null;
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
      const { width: i, height: a } = We(t);
      return { x: X.x, y: X.y, width: i, height: a };
    },
    setLayout(i) {
      if (g) throw new Error("This workshop has been detached.");
      const a = Ft(i);
      l ? l.places(t, a) : Be(t, { layout: a }), JSON.stringify(a) !== JSON.stringify(J) && (je(), J = a, F(x ?? t));
    },
    whenDrawn: () => j,
    update(i) {
      if (g) throw new Error("This workshop has been detached.");
      const a = Z(i);
      je(), t = a;
      const d = T;
      T = P || s(t), F(x ?? t), T !== d && e.refreshGovernance?.();
    },
    preview(i) {
      if (g) throw new Error("This workshop has been detached.");
      const a = i ? Z(i) : null;
      je(), x = a, F(x ?? t), e.refreshGovernance?.();
    },
    refuse(i, a) {
      const d = t.lanes.find((c) => c.id === i);
      g || !d || (ie(!1), E = { laneId: i, reason: a, timer: setTimeout(() => ie(), 1500) }, Ce(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(i) {
      P = !!i;
      const a = P || s(t);
      g || T === a || (je(), T = a, F(x ?? t), e.refreshGovernance?.());
    },
    destroy() {
      g || (je(), g = !0, R && clearTimeout(R.timer), e.element?.removeEventListener?.("pointerdown", mt, !0), Co?.(), e.withPolicyAuthority(() => {
        for (const [i, a] of le) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(i);
        for (const [i, a] of A) a.parent.relationships?.removeAssociation(i);
        for (const [i, a] of y)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(i) === a && e.nodes.remove(i);
      }), A.clear(), le.clear(), y.clear(), v.clear(), _.clear(), D.clear(), Ao(), p?.destroy(), de = !1, Nn(), e.notifyNodeChanged?.());
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
function qn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function lr(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function Ft(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function dr(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const l of n)
    o = Math.max(o, (l.options.x ?? 0) + (l.options.width ?? 0)), t = Math.min(t, l.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const cr = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function se(e) {
  return cr.includes(e.kind) ? e.kind : void 0;
}
function he(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function we(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function ur(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Ln(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Ln(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const dt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function Qn(e) {
  if (typeof e != "string" || !dt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function to(e) {
  return e.noteId ?? e.id;
}
function ct(e) {
  const n = Ln(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function oo(e) {
  const n = he(e);
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
const ro = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, fr = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Xn(e) {
  const n = he(e), o = {}, t = (s) => {
    if (typeof s != "string" || !ro.test(s)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return s;
  }, l = (s, p, k) => {
    if (typeof s != "number" || !Number.isFinite(s) || s < p || s > k) throw new Error("A card size is out of range.");
    return s;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !fr.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = l(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = l(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function so(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        Xn({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Xn(n);
}
function et(e) {
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
function Dt(e) {
  try {
    return !!Cn({ link: e });
  } catch {
    return !1;
  }
}
function Cn(e) {
  const n = he(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const t = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (t.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    o.text = t;
  }
  if (n.image !== void 0) {
    const t = he(n.image);
    if (!et(t.src)) throw new Error("A card keeps a picture by its web address only.");
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
    const t = he(n.link), l = t.data;
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
const Ge = 96, hr = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, pr = ["solid", "dashed", "dotted"];
function Ke(e) {
  const n = he(e);
  if (typeof n.id != "string" || !hr.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: Qn(n.parentId), childId: Qn(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (l, s, p) => {
    const k = n[l];
    if (k != null) {
      if (typeof k != "number" || !Number.isFinite(k) || k < s || k > p) throw new Error("A line's look is out of range.");
      o[l] = k;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !ro.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!pr.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
  for (const l of ["sourceAnchor", "targetAnchor"]) {
    const s = n[l];
    if (s == null) continue;
    const p = he(s), k = (x) => typeof x == "number" && Number.isFinite(x) && x >= 0 && x <= 1;
    if (!k(p.x) || !k(p.y) || Object.keys(p).some((x) => x !== "x" && x !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    o[l] = { x: p.x, y: p.y };
  }
  return o;
}
function mr(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(Ke).filter((t) => n.has(t.parentId) || n.has(t.childId));
  if (Te(o.map((t) => t.id), "line ID"), o.length > Ge) throw new Error(`A workshop holds up to ${Ge} lines.`);
  return o;
}
function Te(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function ut({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((l) => l.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function wr(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Ue = (e) => "lane-" + e, Se = (e) => "card-" + e, On = (e) => "image-" + e;
function es(e) {
  const n = wr(e);
  return ut(e).map((o) => {
    const t = e.cards.filter((p) => p.laneId === o.id), l = n.filter((p) => p.laneId === o.id), s = [Ue(o.id)];
    return o.station?.image && s.push(On(o.id)), { lane: o, cards: t, signals: l, nodeIds: [...s, ...t.map((p) => Se(p.id))] };
  });
}
const io = 5, nt = 24, tt = 3;
function Z(e) {
  const n = he(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !se(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = se(n), l = t ? ye(t) : void 0, s = { id: ge }, p = we(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > io)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const k = l?.cards ?? [nt, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > k[0]) throw new Error(k[1]);
  const x = n.lanes.map((y) => {
    const v = he(y), A = { id: ge(v.id), label: we(v.label) };
    if (v.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (v.capacity !== void 0) {
      const _ = o ? 576 : 24;
      if (typeof v.capacity != "number" || !Number.isInteger(v.capacity) || v.capacity < 1 || v.capacity > _)
        throw new Error(`Lane capacity must be a whole number from 1 to ${_}.`);
      A.capacity = v.capacity;
    }
    if (l?.readLane?.(v, A, s), v.station !== void 0) {
      const _ = he(v.station), D = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= tt)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray(_.next) || _.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const N = _.next.map(ge);
      Te(N, "onward stop"), A.station = { column: D(_.column), row: D(_.row), next: N, outcome: we(_.outcome, 160) }, _.image !== void 0 && (A.station.image = oo(_.image));
    }
    return A;
  }), P = x.map((y) => y.id);
  if (Te(P, "lane ID"), t && x.some((y) => y.station)) throw new Error("A business board has no map stations.");
  if ((o || x.some((y) => y.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (x.some((y) => y.station)) {
    if (!x.every((y) => y.station)) throw new Error("Give every station on the map a position.");
    Te(x.map((y) => y.station.column + "," + y.station.row), "map position");
    for (const y of x)
      if (y.station.next.some((v) => v === y.id || !P.includes(v))) throw new Error("Connect each stop to another station on this map.");
  }
  const T = n.cards.map((y) => {
    const v = he(y), A = { id: ge(v.id), label: t ? we(v.label) : ur(v.label), laneId: ge(v.laneId) };
    if (!P.includes(A.laneId)) throw new Error("Card refers to an unknown lane.");
    if (v.allowedLaneIds !== void 0) {
      if (!Array.isArray(v.allowedLaneIds) || v.allowedLaneIds.length > x.length) throw new Error("Invalid allowed lanes.");
      if (A.allowedLaneIds = v.allowedLaneIds.map(ge), Te(A.allowedLaneIds, "allowed lane"), !A.allowedLaneIds.includes(A.laneId) || !A.allowedLaneIds.every((_) => P.includes(_)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (v.look !== void 0) {
      const _ = Xn(v.look);
      _ && (A.look = _);
    }
    if (v.asNote !== void 0) {
      const _ = Cn(v.asNote);
      _ && (A.asNote = _);
    }
    if (v.noteId !== void 0 && v.noteId !== A.id && (A.noteId = Qn(v.noteId)), l?.readCard(v, A, s), o) {
      if (typeof v.points != "number" || !Number.isInteger(v.points) || v.points < 1 || v.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (A.points = v.points, v.dependsOn !== void 0) {
        if (!Array.isArray(v.dependsOn) || v.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        A.dependsOn = v.dependsOn.map(ge), Te(A.dependsOn, "dependency");
      }
    }
    return A;
  });
  Te(T.map((y) => y.id), "card ID");
  const g = { version: 1, title: p, lanes: x, cards: T };
  if (n.experience !== void 0) {
    const y = he(n.experience);
    if (y.version !== 1 || y.kind !== "customer-interviews" && y.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    g.experience = { version: 1, kind: y.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    g.signals = n.signals.map((y) => {
      const v = he(y), A = ge(v.cardId), _ = ge(v.laneId);
      if (!T.some((D) => D.id === A) || !P.includes(_))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ge(v.id),
        label: we(v.label),
        cardId: A,
        laneId: _,
        whenPresent: we(v.whenPresent, 160),
        whenAbsent: we(v.whenAbsent, 160)
      };
    }), Te(g.signals.map((y) => y.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !t) {
    const y = mr(n.lines, new Set(T.map((v) => v.id)));
    y.length && (g.lines = y);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    g.presentationOrder = ut({ lanes: x, presentationOrder: n.presentationOrder }).map((y) => y.id);
  }
  if (n.behaviour !== void 0 && (g.behaviour = me().validate(n.behaviour, { ...g, kind: n.kind })), o)
    return g.kind = "release-plan", zo(g), g;
  if (t && l) {
    g.kind = t, l.readBoard(n, g, s);
    const y = l.validate(g);
    if (y) throw new Error(y);
    return g;
  }
  for (const y of x)
    if (T.filter((v) => v.laneId === y.id).length > (y.capacity ?? 1 / 0))
      throw new Error(`Lane "${y.label}" exceeds its capacity.`);
  return g;
}
const ao = 65536;
function ns(e) {
  const n = JSON.stringify(Z(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > ao) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function ts(e) {
  if (e.length > ao) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return Z(t);
}
function ft(e, n, o) {
  const t = se(e);
  return t ? ye(t).planMove(e, n, o) : void 0;
}
function Tn(e, n) {
  if (se(e)) return e.lanes.filter((t) => ft(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => Sn(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((l) => l.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function ot(e, n, o) {
  const t = e.cards.find((s) => s.id === n), l = ft(e, n, o);
  if (l !== void 0) {
    if (!l) throw new Error("Move is unavailable.");
    return l;
  }
  if (t && e.kind === "release-plan") {
    const s = Sn(e, t, o);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!t || !Tn(e, t).some((s) => s.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((s) => s === t ? { ...t, laneId: o } : s) };
}
function rn(e, n, o) {
  const t = lo(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in me().check(e, t) ? null : t;
}
function lo(e, n, o) {
  const t = e.cards.find((p) => p.id === n);
  if (!t || !e.lanes.some((p) => p.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return Sn(e, t, o);
  const l = ft(e, n, o);
  if (l !== void 0) return l;
  const s = $r(e, n, o);
  return s || (o === "prototype" && qe(e) === "customer-interviews" ? null : Tn(e, t).some((p) => p.id === o) ? ot(e, n, o) : null);
}
function Ht(e, n) {
  return e.lanes.filter((o) => rn(e, n, o.id) !== null);
}
function yn(e, n, o) {
  const t = lo(e, n, o);
  if (t !== null) {
    const g = t === e || !e.behaviour ? null : me().check(e, t);
    return g && "refused" in g ? g.refused.sentence : null;
  }
  const l = e.cards.find((g) => g.id === n), s = e.lanes.find((g) => g.id === o);
  if (!l || !s) return "That move is not available.";
  const p = se(e), k = p && ye(p).refusal;
  if (k) return k(e, n, o);
  const x = `This card can't go in ${s.label}.`;
  if (l.allowedLaneIds && !l.allowedLaneIds.includes(o)) return x;
  if (e.kind === "release-plan") {
    if (s.capacity === void 0) return x;
    const g = _e(e, o), y = { ...e, lanes: e.lanes.map((A) => A === s ? { id: s.id, label: s.label } : A) }, v = Sn(y, l, o);
    return v ? `Needs ${_e(v, o) - g} points. It already holds ${g} of ${s.capacity} points.` : x;
  }
  const P = e.lanes.find((g) => g.id === l.laneId);
  if (P?.station && !P.station.next.includes(o)) return `${s.label} can't be reached from ${P.label}.`;
  const T = e.cards.filter((g) => g.laneId === o).length;
  return s.capacity !== void 0 && T >= s.capacity ? `It already holds ${T} of ${s.capacity} ${s.capacity === 1 ? "card" : "cards"}.` : x;
}
function tn(e) {
  return (!e.kind || !!se(e)) && !e.lanes.some((n) => n.station) && !qe(e);
}
const gr = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function ht(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && gr.test(n) && !o.has(n) ? n : Pn(e, "card");
}
function He(e, n, o) {
  const t = e.lanes.find((s) => s.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((s) => s.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (qe(e)) return "This workshop keeps the cards it came with.";
  if (se(e)) {
    if (!(typeof o?.label == "string" && Ln(o.label))) return "A card needs some words. Type on the note first.";
    if (Array.isArray(o.lines) ? o.lines.length : o.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const s = fo(e, n, o);
    return typeof s == "string" ? s : Bt(e, s);
  }
  if (e.cards.length >= nt) return `This board is at its size limit of ${nt} cards. Remove a card to make room.`;
  const l = e.cards.filter((s) => s.laneId === n).length;
  if (t.capacity !== void 0 && l >= t.capacity) return `It already holds ${l} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const s = co(o.lines);
    if (!s) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((k) => k.id));
    if ((e.lines?.length ?? 0) + s.filter((k) => !p.has(k.id)).length > Ge)
      return `A workshop holds up to ${Ge} lines.`;
  }
  return Bt(e, { ...e, cards: [...e.cards, { id: ht(e, o.id), label: ct(typeof o.label == "string" ? o.label : ""), laneId: n }] });
}
function Bt(e, n) {
  if (!e.behaviour) return null;
  const o = me().check(e, n);
  return "refused" in o ? o.refused.sentence : null;
}
function yr(e) {
  try {
    return e && typeof e == "object" ? so(e) : void 0;
  } catch {
    return;
  }
}
function kr(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      Cn({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? Cn(n) : void 0;
}
function co(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let l = null;
    try {
      l = Ke(t);
    } catch {
      try {
        const { id: s, parentId: p, childId: k } = he(t);
        l = Ke({ id: s, parentId: p, childId: k });
      } catch {
        l = null;
      }
    }
    if (!l) return null;
    o.push(l);
  }
  return o;
}
function $n(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function Fe(e, n, o) {
  return e && e.map((t) => $n(t, n, o));
}
function uo(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function nn(e, n, o, t) {
  if (He(e, n, o) !== null) return null;
  if (se(e)) {
    const v = fo(e, n, o), A = v.cards[v.cards.length - 1], _ = t === void 0 ? -1 : e.cards.findIndex((D) => D.id === t && D.laneId === n);
    return _ < 0 ? v : { ...v, cards: [...e.cards.slice(0, _), A, ...e.cards.slice(_)] };
  }
  const l = yr(o.look), s = typeof o.label == "string" ? Ln(o.label) : "";
  let p = kr(o.asNote);
  s.length > 80 && p?.text === void 0 && s.length <= 4e3 && (p = { ...p, text: s });
  const k = ht(e, o.id), x = k !== o.id && typeof o.id == "string" && dt.test(o.id) ? o.id : void 0, P = {
    id: k,
    label: ct(s),
    laneId: n,
    ...l ? { look: l } : {},
    ...p ? { asNote: p } : {},
    ...x ? { noteId: x } : {}
  }, T = t === void 0 ? -1 : e.cards.findIndex((v) => v.id === t && v.laneId === n), g = T < 0 ? [...e.cards, P] : [...e.cards.slice(0, T), P, ...e.cards.slice(T)], y = o.lines === void 0 ? void 0 : uo(e, co(o.lines).map((v) => $n(v, o.id, P.id)));
  return Z({ ...e, cards: g, ...y ? { lines: y } : {} });
}
function fo(e, n, o) {
  const t = ye(se(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const l = De(e, [{ kind: "add_card", lane: { id: n }, ...t, ...o.under && { under: { id: o.under } } }]);
  if ("refused" in l) return l.refused.reason;
  const s = l.workshop.cards, p = ht(e, o.id), k = p !== o.id && typeof o.id == "string" && dt.test(o.id) ? o.id : void 0;
  return s[s.length - 1] = { ...s[s.length - 1], id: p, ...k ? { noteId: k } : {} }, l.workshop;
}
function ho(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = se(e);
  return o ? ye(o).cardText(e, n) : n.label;
}
function br(e, n) {
  const o = se(e);
  return o ? ye(o).noteText(e, n) : n.label;
}
function kn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!tn(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (e.cards.some((t) => t.parentId === n)) return `${o.label} has cards under it, so it stays a card. Move them first.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((s) => e.lanes.find((p) => p.id === s).label), l = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${l}, so it stays a card.`;
  }
  return null;
}
function Ut(e, n, o = po(e, n)) {
  if (kn(e, n) !== null) return null;
  const t = e.cards.filter((s) => s.id !== n).map((s) => {
    if (!s.dependsOn?.includes(n)) return s;
    const p = { ...s, dependsOn: s.dependsOn.filter((k) => k !== n) };
    return p.dependsOn.length || delete p.dependsOn, p;
  }), l = e.lines?.map((s) => $n(s, n, o));
  return Z({ ...e, cards: t, ...l ? { lines: l } : {} });
}
function vr(e, n, o = po(e, n)) {
  const t = new Set(e.cards.filter((p) => p.id !== n).map((p) => p.id)), l = (e.lines ?? []).filter((p) => p.parentId === n || p.childId === n).map((p) => $n(p, n, o)), s = (p) => t.has(p.parentId) || t.has(p.childId);
  return { stay: l.filter(s), leave: l.filter((p) => !s(p)) };
}
function po(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? to(o) : n;
}
function Gt(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function sn(e, n) {
  if (e.kind) return Ir;
  let o;
  try {
    o = Ke(n);
  } catch (s) {
    return s instanceof Error ? s.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((s) => s.id));
  return !t.has(o.parentId) && !t.has(o.childId) ? "That card is no longer on the board." : e.lanes.some((s) => s.id === o.parentId || s.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((s) => s.id === o.id) && (e.lines?.length ?? 0) >= Ge ? `A workshop holds up to ${Ge} lines.` : null;
}
const Ir = "Lines join the cards of a lane workshop to notes and to each other.";
function bn(e, n) {
  return sn(e, n) !== null ? null : Z({ ...e, lines: uo(e, [Ke(n)]) });
}
function Kt(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? Z({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function mo(e, n, o, t = {}) {
  const l = new Set((e.lines ?? []).map((p) => p.id));
  let s = `${n}->${o}`;
  for (let p = 2; l.has(s); p++) s = `${n}->${o}~${p}`;
  return Ke({ showChildArrow: !0, ...t, id: s, parentId: n, childId: o });
}
function xr(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function xe(e, n) {
  const o = e.lanes.find((k) => k.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const k = _e(e, n);
    return o.capacity ? k + " / " + o.capacity + " points" : k + " points";
  }
  const t = se(e);
  if (t) return ye(t).caption(e, n);
  const l = Er(e, n);
  if (l) return "$" + l.amount + " · " + l.description;
  const s = e.cards.filter((k) => k.laneId === n).length, p = e.behaviour ? me().laneLimit(e, n) : o.capacity;
  return p !== void 0 ? s + " of " + p : s + (s === 1 ? " card" : " cards");
}
const En = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, vn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function wo(e, n = En, o = 28, t) {
  const { pitch: l, row: s, top: p } = n, k = !!e.lanes[0].station, x = e.lanes.map((g) => e.cards.filter((y) => y.laneId === g.id).length), P = p + Math.max(1, ...t ?? x) * s + 36, T = e.lanes.map((g, y) => ({
    x: k ? g.station.column * (l + o) : y * l,
    y: k ? g.station.row * P : 0
  }));
  return {
    points: T,
    width: Math.max(...T.map((g) => g.x)) + l,
    height: Math.max(...T.map((g, y) => g.y + p + (k ? Math.max(1, x[y]) : x[y] + 1) * s))
  };
}
function os() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Pn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((l) => l.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function go(e) {
  const n = Z(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Ar(e, n) {
  const o = go(e), t = Pn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Z(o);
}
function Cr(e, n, o) {
  const t = go(e);
  return t.cards.push({
    id: Pn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), Z(t);
}
function rs() {
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
function qt(e, n, o) {
  const t = Z(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const l = t.lanes.find((T) => T.id === n);
  if (!l?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= io) throw new Error("A map can have up to five stations.");
  const s = we(o?.label), p = we(o?.outcome, 160), k = Pn(t, "station");
  let x, P = 1 / 0;
  for (let T = 0; T < tt; T++)
    for (let g = 0; g < tt; g++) {
      if (t.lanes.some((v) => v.station.column === g && v.station.row === T)) continue;
      const y = Math.abs(l.station.column - g) + Math.abs(l.station.row - T);
      y < P && (P = y, x = { column: g, row: T });
    }
  if (!x) throw new Error("There is no free station position.");
  return l.station.next.push(k), t.lanes.push({ id: k, label: s, station: { ...x, next: [], outcome: p, ...o.image === void 0 ? {} : { image: oo(o.image) } } }), t.presentationOrder?.push(k), t;
}
const ss = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, yo = (e) => "caption-" + e, on = (e) => "column-" + e, Tr = "rules-board", re = { lane: Ue, card: Se, image: On, caption: yo, column: on, rules: Tr };
function ko(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Jn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), l = e, s = n;
  return t ? `M ${t} 0 H ${l - t} Q ${l} 0 ${l} ${t} V ${s - t} Q ${l} ${s} ${l - t} ${s} H ${t} Q 0 ${s} 0 ${s - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${l} V ${s} H 0 Z`;
}
function Jt(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function Yt(e, n, o, t) {
  for (let l = n; l > 11; l--) {
    const s = Math.max(1, Math.floor(o / (l * 0.55)));
    if (e.split(`
`).reduce((k, x) => k + Math.max(1, Math.ceil(x.length / s)), 0) * l * 1.3 <= t) return l;
  }
  return Math.min(n, 11);
}
const bo = 152, rt = bo + 12, Sr = 12;
function vo(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function Be(e, n = {}) {
  const o = Z(e), { pitch: t, row: l, top: s } = En, p = o.lanes.map((y) => o.cards.filter((v) => v.laneId === y.id).length), k = (y) => Math.max(p[y], (Array.isArray(n.rows) ? n.rows[y] : n.rows) ?? 0), x = !!o.lanes[0].station, P = o.lanes.some((y) => y.station?.image), T = vo(n.layout, o.lanes.length), g = [];
  if (x) {
    const { points: y } = wo(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((v, A) => g.push({
      laneId: v.id,
      x: y[A].x,
      y: y[A].y + (P ? v.station.row * rt : 0),
      width: t,
      height: s + (v.station.image ? rt : 0) + Math.max(1, k(A)) * l,
      column: v.station.column,
      row: v.station.row
    }));
  } else {
    let y = Io(o, T)?.below ?? 0;
    for (let v = 0; v < o.lanes.length; v += T) {
      const A = o.lanes.slice(v, v + T), _ = s + (Math.max(...A.map((D, N) => k(v + N))) + 1) * l;
      A.forEach((D, N) => g.push({ laneId: D.id, x: N * t, y, width: t, height: _, column: N, row: v / T })), y += _ + Sr;
    }
  }
  return { places: g, width: Math.max(...g.map((y) => y.x + y.width)), height: Math.max(...g.map((y) => y.y + y.height)) };
}
function Io(e, n, o = 2, t = 0) {
  const l = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? me().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return l ? { note: l, below: l.options.height + 16 } : null;
}
function Lr(e, n) {
  const { pitch: o, width: t, row: l, height: s, top: p } = En, k = n.origin ?? { x: 0, y: 0 }, x = !!e.lanes[0].station, { places: P } = Be(e, n), T = n.style ?? {}, g = T.textColor ?? en.fontColor, y = T.borderColor ?? en.borderColor, v = T.borderWidth ?? en.borderWidth, A = T.cornerRadius ?? 0, _ = T.fontSize ?? en.fontSize, D = T.laneFontSize ?? _ + 2, N = T.captionFontSize ?? Math.max(11, _ - 1), r = [], m = (L) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: Jn(L.width, L.height, A),
      foregroundColor: g,
      borderColor: y,
      borderWidth: v,
      ...T.fontFamily ? { fontFamily: T.fontFamily } : {},
      ...L
    }, relationships: { associations: [] } };
    return r.push(E), E;
  };
  e.lanes.forEach((L, E) => {
    const R = P[E], q = k.x + R.x, j = k.y + R.y, Y = L.station?.image;
    m({
      id: on(L.id),
      text: "",
      name: L.label,
      xPos: q + 2,
      yPos: j,
      width: o - 4,
      height: R.height,
      vectorPath: Jn(o - 4, R.height, A ? A + 2 : 0),
      backgroundColor: x ? "#fcf9ed" : Jt(vn[E], 0.6),
      borderColor: x ? "#a8b5aa" : Jt(vn[E], 0.1),
      borderWidth: 1,
      ...x ? { borderStyle: "dashed" } : {}
    }), m({
      id: Ue(L.id),
      text: L.label,
      name: L.label,
      xPos: q + 8,
      yPos: j + 6,
      width: t,
      height: 58,
      backgroundColor: vn[E],
      fontSize: Yt(L.label, D, t - 16, 50)
    }), m({
      id: yo(L.id),
      text: xe(e, L.id),
      name: L.label,
      xPos: q + 8,
      yPos: j + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: N
    }), Y && r.push({ options: {
      id: On(L.id),
      name: Y.alt,
      text: "",
      xPos: q + 8,
      yPos: j + p,
      width: t,
      height: bo,
      shapeHint: "rectangle",
      image: Y.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((J) => J.laneId === L.id).forEach((J, Ne) => {
      const pe = ho(e, J), Le = x ? t - 20 : t, Re = x ? s - 6 : s, de = x ? {} : { ...T.card, ...J.look }, le = x ? A : T.card?.cornerRadius ?? A;
      m({
        id: Se(J.id),
        text: pe,
        name: J.label,
        xPos: q + (x ? 18 : 8),
        yPos: j + p + (Y ? rt : 0) + Ne * l,
        width: Le,
        height: Re,
        ...le !== A ? { vectorPath: Jn(Le, Re, le) } : {},
        backgroundColor: x ? "#ffda75" : de.backgroundColor ?? T.backgroundColor ?? en.backgroundColor,
        ...de.textColor ? { foregroundColor: de.textColor } : {},
        ...de.fontFamily ? { fontFamily: de.fontFamily } : {},
        ...de.borderColor ? { borderColor: de.borderColor } : {},
        ...de.borderWidth !== void 0 ? { borderWidth: de.borderWidth } : {},
        fontSize: Yt(pe, de.fontSize ?? _, Le - 16, Re - 8)
      });
    });
  });
  const I = Io(e, vo(n.layout, e.lanes.length), k.x + 2, k.y)?.note ?? xo(e, {
    x: k.x,
    y: k.y + Math.max(...P.map((L) => L.y + L.height)) + 16,
    width: Math.min(Math.max(...P.map((L) => L.x + L.width)), o * 2) - 4
  }, T);
  I && r.push(I);
  const S = new Map(r.map((L) => [L.options.id, L]));
  for (const L of e.lanes)
    L.station && (S.get(on(L.id)).relationships.associations = L.station.next.map((E) => ({
      id: L.id + "-to-" + E,
      parentId: on(L.id),
      childId: on(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const L of e.cards)
      for (const E of L.dependsOn ?? []) {
        const R = Se(E), q = Se(L.id);
        S.get(R).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${L.id}`,
          parentId: R,
          childId: q,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const L = new Set(n.beside), E = new Set(r.map((j) => j.options.id)), R = /* @__PURE__ */ new Map();
    for (const j of [...E]) {
      if (!L.has(j)) continue;
      const Y = ko(j, (J) => L.has(J) || E.has(J));
      E.add(Y), R.set(j, Y);
    }
    const q = (j) => R.get(j) ?? j;
    for (const j of r) {
      j.options.id = q(j.options.id);
      for (const Y of j.relationships.associations)
        Y.parentId = q(Y.parentId), Y.childId = q(Y.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
function xo(e, n, o = {}) {
  return e.behaviour ? me().note(e, n, o) : null;
}
function Or(e, n) {
  const o = Z(e);
  if (n?.native) return Lr(o, n);
  const { width: t, row: l, height: s, top: p } = En, k = [];
  function x(v, A, _, D, N, r) {
    k.push({ options: {
      id: v,
      text: A,
      name: A,
      xPos: _,
      yPos: D,
      width: t,
      height: N,
      shapeHint: "rectangle",
      backgroundColor: r,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: P } = wo(o), T = 152, g = T + 12, y = o.lanes.some((v) => v.station?.image);
  o.lanes.forEach((v, A) => {
    const _ = P[A].x, D = P[A].y + (y ? (v.station?.row ?? 0) * g : 0), N = v.station?.image, r = o.kind === "release-plan" ? v.label + `
` + (v.capacity ? _e(o, v.id) + " / " + v.capacity + " points" : _e(o, v.id) + " points") : v.label;
    x(Ue(v.id), r, _, D, p - 12, vn[A]), N && k.push({ options: {
      id: On(v.id),
      name: N.alt,
      text: "",
      xPos: _,
      yPos: D + p,
      width: t,
      height: T,
      shapeHint: "rectangle",
      image: N.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((m) => m.laneId === v.id).forEach((m, I) => x(Se(m.id), ho(o, m), _, D + p + (N ? g : 0) + I * l, s, "#fffdf6"));
  });
  for (const v of o.lanes) {
    if (!v.station) continue;
    const A = k.find((_) => _.options.id === Ue(v.id));
    A.relationships.associations = v.station.next.map((_) => ({ id: v.id + "-to-" + _, parentId: A.options.id, childId: Ue(_), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), A.options.text = v.label + `
` + v.station.outcome, A.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const v = new Map(k.map((A) => [A.options.id, A]));
    for (const A of o.cards)
      for (const _ of A.dependsOn ?? []) {
        const D = Se(_), N = Se(A.id);
        v.get(D).relationships.associations.push({
          id: `dependency-${_.length}-${_}-${A.id}`,
          parentId: D,
          childId: N,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: k };
}
const is = {
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
}, st = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], pt = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function as() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: st.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: st.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function ls() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...pt.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function qe(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...pt.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => st.some((l) => l.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function $r(e, n, o) {
  const t = qe(e), l = e.cards.find((p) => p.id === n);
  if (!t || !l || l.laneId === o) return null;
  let s = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const p = e.cards.find((k) => k.laneId === o);
    if (p) {
      if (!Tn(e, p).some((k) => k.id === "interviews")) return null;
      s = ot(e, p.id, "interviews");
    }
  }
  return Tn(s, l).some((p) => p.id === o) ? ot(s, n, o) : null;
}
function Er(e, n) {
  if (qe(e) !== "experiment-budget") return null;
  const o = pt.find((s) => s.id === n), t = e.cards.filter((s) => s.laneId === n).length, l = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? l + " " + (l === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  en as DEFAULT_NOTE_STYLE,
  Vt as WORKSHOP_BOARD_KINDS,
  gn as WorkshopReferenceError,
  qt as addWorkshopBranch,
  Cr as addWorkshopCard,
  Ar as addWorkshopLane,
  De as applyWorkshopEdits,
  Xr as attachWorkshop,
  Tn as availableLanes,
  xo as behaviourNote,
  cr as businessBoardKinds,
  se as businessKind,
  er as canHangPanel,
  pt as channels,
  Xo as checkWorkshopReplacement,
  Ho as countWord,
  ls as createBudgetWorkshop,
  as as createInterviewWorkshop,
  os as createLaneWorkshop,
  rs as createWorkshopMap,
  ts as decodeWorkshopFragment,
  Qr as describeFocusDarkroom,
  Kr as describeWorkshopEdits,
  ns as encodeWorkshopFragment,
  Wr as handoffSummary,
  Yr as hangGalleryPanel,
  is as industrialWorkshop,
  Vr as initialFocusDarkroom,
  st as interviews,
  Go as isRuleEdit,
  vn as laneColors,
  Pe as listed,
  hn as listeningRoom,
  zr as listeningRoomCaption,
  nt as maxWorkshopCards,
  Ge as maxWorkshopLines,
  qr as moonGallery,
  ot as moveWorkshopCard,
  Gr as named,
  ss as nightTransfer,
  Zr as normalizeFocusDarkroom,
  jr as normalizeListeningRoom,
  Jr as normalizeMoonGallery,
  Nr as normalizeOfflineHandoff,
  _r as offlineHandoff,
  $r as planStartupMove,
  Bo as pointing,
  eo as printFields,
  Br as registerRulebook,
  Dr as registerWorkshopRules,
  _e as releaseLoad,
  Fr as releasePlan,
  Mr as resolveHandoff,
  wr as resolveWorkshopSignals,
  Rr as reviewHandoff,
  Jn as roundedBox,
  me as rulebook,
  Ur as rulebookLoaded,
  $ as said,
  qe as startupExperienceKind,
  at as unquoted,
  Z as validateWorkshop,
  xn as workshopBoardKind,
  Er as workshopBudgetResult,
  rn as workshopCandidate,
  Ut as workshopCardAsNote,
  kn as workshopCardAsNoteRefusal,
  ct as workshopCardLabelOf,
  vr as workshopCardLines,
  so as workshopCardLookOf,
  br as workshopCardNoteText,
  ho as workshopCardText,
  Ht as workshopDestinations,
  Vn as workshopEditKinds,
  Yn as workshopFinder,
  Dt as workshopKeepsLink,
  et as workshopKeepsPicture,
  xe as workshopLaneCaption,
  Be as workshopLanePlaces,
  En as workshopLayout,
  sn as workshopLineRefusal,
  Gt as workshopLinesOf,
  Ir as workshopLinesSentence,
  mo as workshopNewLine,
  re as workshopNodeIds,
  nn as workshopNoteCandidate,
  to as workshopNoteIdOf,
  He as workshopNoteRefusal,
  wo as workshopPositions,
  ut as workshopPresentationLanes,
  es as workshopPresentationScenes,
  Jo as workshopReferences,
  yn as workshopRefusal,
  Fe as workshopRenamedLines,
  Rt as workshopRuleSchema,
  ye as workshopRules,
  Hr as workshopRulesLoaded,
  ko as workshopStandInId,
  tn as workshopTakesNotes,
  Or as workshopToSlate,
  bn as workshopWithLine,
  xr as workshopWithoutCardLines,
  Kt as workshopWithoutLine
};
