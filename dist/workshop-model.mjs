import { D as Dn } from "./NoteDefaults-BjVBa8YH.mjs";
const pa = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function ma(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: c, fallback: h } = e, p = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !p(i) || !p(c) || !p(h) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: c.trim(), fallback: h.trim() };
}
function wa(e) {
  return { ...e, stage: "review", choice: null };
}
function ga(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function ya(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const lt = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function ka(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, c = (h) => typeof h == "string" && h.trim().length > 0 && h.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(h);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !c(o) || !c(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function ba({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === lt.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === lt.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === lt.leftLabel && t === lt.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
function sn(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function Ui(e) {
  const n = new Map(e.cards.map((c) => [c.id, c])), t = new Map(e.lanes.map((c, h) => [c.id, h])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function i(c) {
    if (!r.has(c.id)) {
      if (o.has(c.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(c.id);
      for (const h of c.dependsOn ?? []) {
        const p = n.get(h);
        if (!p) throw new Error("A release dependency refers to an unknown feature.");
        if (t.get(p.laneId) > t.get(c.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(p);
      }
      o.delete(c.id), r.add(c.id);
    }
  }
  for (const c of e.cards) i(c);
  for (const c of e.lanes) {
    if (c.station) throw new Error("Release windows cannot also be map stations.");
    if (sn(e, c.id) > (c.capacity ?? 1 / 0)) throw new Error(`Release "${c.label}" exceeds its point budget.`);
  }
}
function qn(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((v, k) => [v.id, k])), o = r.get(t);
  if (o === void 0) return null;
  const i = o < r.get(n.laneId), c = /* @__PURE__ */ new Set([n.id]), h = [n];
  for (; h.length; ) {
    const v = h.pop();
    for (const k of e.cards) {
      if (c.has(k.id)) continue;
      const $ = r.get(k.laneId);
      (i ? $ > o && v.dependsOn?.includes(k.id) : $ < o && k.dependsOn?.includes(v.id)) && (c.add(k.id), h.push(k));
    }
  }
  if (e.cards.filter((v) => c.has(v.id)).some((v) => v.allowedLaneIds && !v.allowedLaneIds.includes(t))) return null;
  const C = { ...e, cards: e.cards.map((v) => c.has(v.id) ? { ...v, laneId: t } : v) }, I = e.lanes[o].capacity;
  return I !== void 0 && sn(C, t) > I ? null : C;
}
const va = {
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
}, Ct = /* @__PURE__ */ new Map(), Ki = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function xa(e) {
  Ct.set(e.kind, e);
}
function Ia(e) {
  return typeof e == "string" && Ct.has(e);
}
function an(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? Ct.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function ve(e) {
  const n = Ct.get(e);
  if (!n) throw new Error(`The ${Ki[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let kt = null;
function Aa(e) {
  kt = e;
}
function qi() {
  return kt !== null;
}
function be() {
  if (!kt) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return kt;
}
const E = (e) => "“" + e.replace(/[“”]/g, '"') + "”", on = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], sr = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Io = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Ao = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Sa = (e) => Io(Ao(e)), Ji = [
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
], Yi = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Ji.indexOf(e.toLowerCase()), Zi = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Er(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = Io(o);
    i && t.add(i);
  };
  r(e), r(Ao(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const Jt = "[^\\p{L}\\p{N}]", ar = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + sr(n) + "(?:$|" + Jt + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Jt + ")" + sr(n) + "(?:$|" + Jt + ")", "u").test(e)
], lr = ["first", "second", "third", "fourth", "fifth"];
function Vi(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + lr.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Io(Ao(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? lr.indexOf(o) : Yi(o) - 1;
  return e[i] ?? null;
}
function Yt(e, n, t, r, o) {
  const i = Er(n, t);
  if (i.some((h) => Zi.test(h))) {
    const h = r && e.find((p) => p.id === r);
    return h ? { item: h, rank: 0 } : { pointing: !0 };
  }
  for (const h of i) {
    if (!h.startsWith("@")) continue;
    const p = e.find((C) => C.id === h.slice(1));
    if (p) return { item: p, rank: 0 };
  }
  for (const [h, p] of ar.entries())
    for (const C of i) {
      const I = e.filter((v) => p(v.label.toLowerCase(), C.toLowerCase()));
      if (I.length === 1) return { item: I[0], rank: h };
      if (I.length > 1) return { several: I };
    }
  const c = o ? Vi(e, n, t) : null;
  return c ? { item: c, rank: ar.length } : {};
}
class mt extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function ro(e, n, t, r, o = !1) {
  return { find: (p) => {
    const C = Yt(e, p, n, r, o);
    if (C.item) return C.item;
    const I = Er(p, n), v = I[I.length - 1];
    if (C.pointing) throw new mt("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const $ = [...new Set(C.several.map((b) => b.label))];
      throw new mt($.length === 1 ? C.several.length + " " + t + "s are called " + E($[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + E(v) + ": " + on($.slice(0, 6).map(E)) + ". Use the whole name.", "ambiguous", C.several.map((b) => b.id));
    }
    const k = e.map(($) => $.label);
    throw new mt("There is no " + t + " called " + E(v) + " here." + (k.length && k.length <= 6 ? " The " + t + "s are " + on(k.map(E)) + "." : k.length ? "" : " There are no " + t + "s yet."), "unknown", e.map(($) => $.id));
  }, attempt: (p) => Yt(e, p, n, r, o).item ?? null, rank: (p) => Yt(e, p, n, r, o).rank ?? 1 / 0 };
}
const Mr = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Fe = [...Mr], mn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Nr = Mr.slice(5);
function bt(e) {
  if (e.lanes[0]?.station) return "map";
  const n = te(e);
  return n || (e.kind === "release-plan" ? "release-plan" : ln(e) ?? "lanes");
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
}, io = {
  "launch-plan": z.launchLanes,
  pipeline: z.pipelineLanes,
  budget: z.budgetLanes,
  "hiring-plan": z.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, fe = (e, n) => Object.fromEntries(Fe.filter((t) => !e.includes(t)).map((t) => [t, n])), ce = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), re = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), se = (e) => ({ type: "ref", of: "card", about: e }), Zt = (e) => ({ map: e }), Re = fe(["map"], z.notMap), Pe = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), so = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ce(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Fe,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: re("The lane or step."), label: ce(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Fe,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: se("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Fe,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ce(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": z.releaseLanes, "customer-interviews": z.keepsLanes, "experiment-budget": z.keepsLanes, map: z.mapAddLane, ...io }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: re("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": z.releaseLanes, "customer-interviews": z.keepsLanes, "experiment-budget": z.keepsLanes, ...io }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: re("The lane or step it starts in."),
      label: ce(80, "What the card says. Left out, the card takes the board’s name for a new item: “New card”, “New hire”, “New task”, “New deal” (on a map, a token is numbered; a free card is “New stop”).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Pe("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Pe("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Pe("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...Nr],
    refusals: { "release-plan": z.releaseCards, "customer-interviews": z.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: se("The card or token.") },
    boards: Fe,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: {
      card: se("The card or token."),
      lane: re("Where it goes."),
      override: { type: "flag", optional: !0, about: "True to move it anyway when a rule refuses it, once the person agreed to break that rule (every board but release plans and startup experiences). The card shows who moved it anyway and when." }
    },
    boards: Fe,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: se("The token.") },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: re("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Fe.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": z.launchLanes, budget: z.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: se("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: mn,
    refusals: { ...Zt(z.mapCardLanes), ...fe([...mn, "map"], z.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: se("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], z.notPoints), map: z.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: se("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], z.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: se("The card."),
      lane: re("The lane."),
      whenPresent: ce(160, "What it says when the card is there."),
      whenAbsent: ce(160, "What it says otherwise."),
      label: ce(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: mn,
    refusals: { ...Zt(z.mapOutcome), ...fe([...mn, "map"], z.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: se("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: mn,
    refusals: { ...Zt(z.mapOutcome), ...fe([...mn, "map"], z.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: Fe,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: re("The lane or step."), before: re("Present it just before this one.", !0), after: re("Present it just after this one.", !0) },
    boards: Fe,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: re("The step it follows."), label: ce(80, "The new step’s name."), outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: re("The step it goes in front of."),
      from: re("Only the path from this step is taken over.", !0),
      label: ce(80, "The new step’s name."),
      outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: re("Where the path starts."), to: re("Where it leads.") },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: re("Where the path starts."), to: re("Where it leads.") },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: re("The step."), outcome: ce(160, "What it says.") },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: re("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: re("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: re("The step."), alt: ce(240, "What the picture shows.") },
    boards: ["map"],
    refusals: Re
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: se("The card the line starts at."), to: se("The card it points to."), label: ce(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: dt()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: se("One card."), to: se("The other card.") },
    boards: ["lanes"],
    refusals: dt()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: se("The card."),
      note: ce(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: ce(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: dt()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: se("The card."), note: ce(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: dt()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: {
      card: se("The task."),
      duration: Pe("Its days, 1 to 60.", 60, 1, !0),
      lag: Pe("Days it waits after what it waits on ends, 0 or more (below 0, with override: it starts before what it waits on ends).", 120, -120, !0),
      override: { type: "flag", optional: !0, about: "True to set it anyway when a rule refuses it (a lock, a freeze, an overlap, the line, what it waits on), once the person agreed to break that rule. The task shows who moved it anyway and when." }
    },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], z.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: se("The task that waits."), waitsOn: se("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], z.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: se("The task that waits."), waitsOn: se("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], z.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: Pe("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], z.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: se("The deal or line item."), amount: Pe("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: fe(["pipeline", "budget"], z.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Pe("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: fe(["pipeline"], z.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: re("The team giving."), to: re("The team receiving."), amount: Pe("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: fe(["budget"], z.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: Pe("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: fe(["budget"], z.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], z.noRules)
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
    refusals: fe(["lanes", "pipeline"], z.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: ce(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: fe(["lanes", "pipeline"], z.noRules) }
];
function dt() {
  return { ...fe(["lanes"], z.businessLines), "release-plan": z.lines, "customer-interviews": z.lines, "experiment-budget": z.lines, map: z.lines };
}
const Xi = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", dr = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, Qi = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function es(e, n) {
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
      return { ...r({ type: "integer", minimum: e.min, maximum: Qi(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: dr.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...dr.keys
      }, description: e.about };
  }
}
const _r = (e) => "optional" in e && e.optional === !0;
function Ca(e) {
  const n = e ? bt(X(e)) : void 0;
  return so.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, c]) => !_r(c)).map(([c]) => c)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([c, h]) => [c, es(h, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const ct = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function ns(e, n) {
  const t = !!e.lanes[0]?.station, r = ro(e.lanes, t ? ct.step : ct.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = ro(e.cards, t ? ct.token : ct.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const i = e.cards.filter((h) => !h.free), c = (h) => i.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(h.trim()) ? i[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(h.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (h) => c(h) ?? o.find(h),
    attempt: (h) => c(h) ?? o.attempt(h),
    rank: (h) => c(h) ? 0 : o.rank(h)
  } };
}
class G {
  constructor(n, t, r = null, o, i, c) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = i, this.limits = c;
  }
}
function vt(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function V(e, n, t = null, r) {
  try {
    return X(e);
  } catch (o) {
    throw new G(vt(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function ts(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (_r(o)) continue;
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
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((h) => h !== "src" && h !== "alt")) return c + "{src, alt} or null.";
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
function os(e, n, t, r, o) {
  const i = structuredClone(e), c = t === "map", h = t === "release-plan", p = ns(i, r), C = { lane: c ? "step" : "lane", card: c ? "token" : "card" };
  function I(l, x, A, S, T = null) {
    if (typeof A == "object") {
      const D = l.find((j) => j.id === A.id);
      if (!D) throw new G("That " + S + " is no longer on the workshop.", "gone", T);
      return D;
    }
    const _ = l.find((D) => D.id === A);
    if (_) return _;
    try {
      return x.find(A);
    } catch (D) {
      if (!(D instanceof mt)) throw D;
      const j = D.reason === "ambiguous" ? "ambiguous_reference" : D.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new G(D.message, j, T, void 0, D.candidates.length ? D.candidates : void 0);
    }
  }
  const v = (l, x = null) => I(i.lanes, p.lanes, l, "lane", x), k = (l, x = null) => I(i.cards, p.cards, l, "card", x), $ = (l) => {
    try {
      return v(l);
    } catch {
      return null;
    }
  }, b = (l, x, A = {}, S = !0) => ({ board: l, said: x, changed: S, ...A }), L = (l) => Ye(i, l), F = (l) => c ? "The presentation opens with " + E(l[0].label) + "." : "The presentation now runs " + l.map((x) => E(x.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return be().edit(i, n, o, {
      lane: (l) => v(l),
      card: (l) => k(l),
      done: (l, x, A) => b(l, x, A),
      refuse: (l, x = {}) => {
        throw new G(l, x.code ?? "refused", x.laneId ?? null, x.cardId);
      }
    });
  if (Nr.includes(t)) {
    n.kind === "add_card" && cr(n, t, v(n.lane).id);
    const l = {
      card: (A) => k(A),
      lane: (A) => v(A),
      refuse: (A, S = {}) => {
        throw new G(A, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (A, S = null, T) => V(A, t, S, T),
      done: (A, S, T) => b(A, S, T),
      who: { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() }
    }, x = ve(t).edit(i, n, l);
    if (x) return x;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const l = V(i, t);
      return b(l, "Renamed the " + (c ? "map" : "workshop") + " to " + E(l.title) + ".");
    }
    case "rename_lane": {
      const l = v(n.lane), x = l.label;
      l.label = n.label;
      const A = V(i, t, l.id);
      return b(A, "Renamed " + E(x) + " to " + E(A.lanes.find((S) => S.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = k(n.card), x = l.label;
      l.label = n.label;
      const A = V(i, t, l.laneId, l.id);
      return b(A, "Renamed " + E(x) + " to " + E(A.cards.find((S) => S.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new G("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new G("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = oa(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (A) {
        throw new G(vt(A.message, t), "refused");
      }
      const x = l.lanes[l.lanes.length - 1];
      return b(l, "Added the lane " + E(x.label) + ".", { laneId: x.id });
    }
    case "remove_lane": {
      const l = v(n.lane), x = i.cards.filter((A) => A.laneId === l.id);
      if (c) {
        if (x.length) throw new G(E(x[0].label) + " is at " + E(l.label) + ". Move it to another step first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new G("A map needs at least two steps.", "refused", l.id);
      } else {
        if (x.length) throw new G(E(l.label) + " holds " + x.length + (x.length === 1 ? " card" : " cards") + ". Move or remove " + (x.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new G("A workshop needs at least two columns.", "refused", l.id);
      }
      i.lanes = i.lanes.filter((A) => A !== l);
      for (const A of i.lanes) A.station && (A.station.next = A.station.next.filter((S) => S !== l.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((A) => A !== l.id));
      for (const A of i.cards) A.allowedLaneIds && (A.allowedLaneIds = A.allowedLaneIds.filter((S) => S !== l.id));
      return ut(i, (A) => A.laneId === l.id), i.behaviour && (i.behaviour = be().dropLane(i.behaviour, l.id)), b(V(i, t), "Removed the " + C.lane + " " + E(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = v(n.lane);
      if (c) {
        if (n.allowedLanes !== void 0) throw new G(z.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new G("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const M = Yn(i, "card");
          i.cards.push({ id: M, label: Tt(n.label?.trim() || an(i)), laneId: l.id, free: !0 });
          const q = V(i, t, l.id);
          return b(q, "Added " + E(q.cards.find((Me) => Me.id === M).label) + " to " + E(l.label) + ".", { laneId: l.id, cardId: M });
        }
        let T = n.label;
        if (T === void 0) {
          let M = i.cards.length + 1;
          for (; i.cards.some((q) => q.label === "Token " + M); ) M++;
          T = "Token " + M;
        }
        const _ = new Set([...i.lanes, ...i.cards].map((M) => M.id));
        let D = 1;
        for (; _.has("token-" + D); ) D++;
        i.cards.push({ id: "token-" + D, label: T, laneId: l.id });
        const j = V(i, t, l.id);
        return b(j, "Added " + E(j.cards[j.cards.length - 1].label) + " at " + E(l.label) + ".", { laneId: l.id, cardId: "token-" + D });
      }
      if (cr(n, t, l.id), i.cards.length >= 24) throw new G("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && L(l.id) >= l.capacity)
        throw new G(E(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", l.id);
      const x = n.allowedLanes && [...new Set(n.allowedLanes.map((T) => v(T).id))];
      let A;
      try {
        A = ra(i, l.id, { label: n.label?.trim() || an(i), ...x && { allowedLaneIds: x } });
      } catch (T) {
        throw new G(vt(T.message, t), "refused", l.id);
      }
      const S = A.cards[A.cards.length - 1];
      return b(A, "Added " + (S.label ? E(S.label) : "an empty card") + " to " + E(l.label) + ".", { laneId: l.id, cardId: S.id });
    }
    case "remove_card": {
      const l = k(n.card);
      if (c && !l.free && i.cards.filter((x) => !x.free).length === 1) throw new G("A map needs at least one token.", "refused", l.laneId, l.id);
      if (h && i.cards.length === 1) throw new G("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new G("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      i.cards = i.cards.filter((x) => x !== l);
      for (const x of i.cards)
        x.dependsOn?.includes(l.id) && (x.dependsOn = x.dependsOn.filter((A) => A !== l.id), x.dependsOn.length || delete x.dependsOn);
      return ut(i, (x) => x.cardId === l.id), b(V(ea(i, l.id), t, l.laneId), "Removed the " + C.card + " " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? i.lanes.find((S) => S.id === n.lane.id) ?? null : $(n.lane), x = k(n.card, l?.id ?? null), A = v(n.lane, x.laneId);
      return J(x, A, n.override === !0);
    }
    case "advance_card": {
      const l = k(n.card), x = i.lanes.find((S) => S.id === l.laneId), A = x.station.next.map((S) => i.lanes.find((T) => T.id === S)).filter((S) => !!S);
      if (!A.length) throw new G(E(l.label) + " is at " + E(x.label) + ", and no path leads on from there.", "refused", x.id, l.id);
      if (A.length > 1)
        throw new G("From " + E(x.label) + " the path goes to " + A.map((S) => E(S.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + A[0].label + "”.", "refused", x.id, l.id);
      return J(l, A[0]);
    }
    case "set_lane_capacity": {
      const l = v(n.lane), x = i.behaviour && be().setLimit(i, l.id, n.capacity, o);
      if (typeof x == "string") throw new G(x, "refused", l.id);
      if (x) return b(x, E(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const A = c ? "token" : h ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, b(V(i, t, l.id), c ? "Removed the limit at " + E(l.label) + "." : E(l.label) + " now holds any number of " + A + "s.", { laneId: l.id });
      const S = h ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > S)
        throw new G((c ? "A step" : "A lane") + " can hold from 1 to " + S + " " + A + "s.", "refused", l.id);
      const T = h ? i.cards.reduce((_, D) => _ + (D.laneId === l.id ? D.points ?? 1 : 0), 0) : L(l.id);
      if (T > n.capacity)
        throw new G(E(l.label) + " already holds " + T + " " + A + (T === 1 ? "" : "s") + ". Move some " + (c ? "on" : "out") + " first, or choose a higher " + (h ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, b(V(i, t, l.id), E(l.label) + " now holds up to " + n.capacity + " " + A + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = k(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, b(V(i, t, l.laneId, l.id), E(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const x = [...new Set(n.lanes.map((S) => v(S)))], A = i.lanes.find((S) => S.id === l.laneId);
      if (!x.includes(A)) throw new G(E(l.label) + " is in " + E(A.label) + " now. Include " + E(A.label) + ", or move the card first.", "refused", A.id, l.id);
      return l.allowedLaneIds = x.map((S) => S.id), b(V(i, t, l.laneId, l.id), E(l.label) + " can now go only in " + on(x.map((S) => E(S.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new G("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, b(V(i, t, l.laneId, l.id), E(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = k(n.card), x = [...new Set(n.dependsOn.map((S) => k(S)))], A = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const S = x.filter((T) => l.dependsOn?.includes(T.id));
        if (!S.length) throw new G(E(l.label) + " does not depend on " + on(x.map((T) => E(T.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter((T) => !S.some((_) => _.id === T)), l.dependsOn.length || delete l.dependsOn, b(V(i, t, l.laneId, l.id), E(l.label) + " no longer depends on " + on(S.map((T) => E(T.label))) + ".", A);
      }
      if (!x.length) {
        if (n.mode === "add") throw new G("Name the features " + E(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, b(V(i, t, l.laneId, l.id), E(l.label) + " no longer depends on anything.", A);
      }
      if (x.includes(l)) throw new G("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...x.map((S) => S.id)])], b(V(i, t, l.laneId, l.id), E(l.label) + " now depends on " + on(x.map((S) => E(S.label))) + ".", A);
    }
    case "set_outcome": {
      const l = k(n.card), x = v(n.lane), A = i.signals ?? (i.signals = []), S = n.label, T = S === void 0 ? A.filter((M) => M.cardId === l.id && M.laneId === x.id) : A.filter((M) => M.cardId === l.id && M.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && T.length > 1) throw new G("Two outcomes on this card have that name.", "refused", x.id, l.id);
      if (!T.length && A.length >= 24) throw new G("A workshop can have up to 24 outcomes. Remove one first.", "refused", x.id, l.id);
      let _ = 1;
      for (; A.some((M) => M.id === "signal-" + _); ) _++;
      const j = { label: S ?? T[0]?.label ?? (l.label + " in " + x.label).slice(0, 80).trim(), cardId: l.id, laneId: x.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return T.length ? Object.assign(T[0], j) : A.push({ id: "signal-" + _, ...j }), b(V(i, t, x.id, l.id), "When " + E(l.label) + " is in " + E(x.label) + " the workshop says " + E(n.whenPresent) + ". Otherwise it says " + E(n.whenAbsent) + ".", { laneId: x.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = k(n.card), x = (i.signals ?? []).filter((A) => A.cardId === l.id);
      if (n.outcome === void 0) {
        if (!x.length) throw new G(E(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        ut(i, (A) => A.cardId === l.id);
      } else {
        const A = I(x, ro(x, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        ut(i, (S) => S.id === A.id);
      }
      return b(V(i, t, l.laneId, l.id), "Removed the outcome from " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((x) => v(x));
      if (l.length !== i.lanes.length || new Set(l).size !== i.lanes.length) throw new G("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = l.map((x) => x.id), b(V(i, t), F(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new G("Say before or after, not both.", "invalid_edit");
      const l = v(n.lane), x = n.before ?? n.after, A = x === void 0 ? void 0 : v(x);
      if (A && A.id === l.id) throw new G("Choose two different scenes.", "refused", l.id);
      const S = Lo(i).filter((T) => T.id !== l.id);
      return S.splice(A ? S.findIndex((T) => T.id === A.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), i.presentationOrder = S.map((T) => T.id), b(V(i, t, l.id), F(S), { laneId: l.id });
    }
    case "add_station": {
      const l = v(n.from);
      let x;
      try {
        x = Lr(i, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new G(S.message, "refused", l.id);
      }
      const A = x.lanes[x.lanes.length - 1];
      return b(x, "Added a path from " + E(l.label) + " to " + E(A.label) + ".", { laneId: A.id });
    }
    case "insert_station": {
      const l = v(n.before), x = n.from === void 0 ? void 0 : v(n.from), A = x ? [x] : i.lanes.filter((_) => _.station.next.includes(l.id));
      if (x && !x.station.next.includes(l.id))
        throw new G("There is no path from " + E(x.label) + " to " + E(l.label) + ". Try “Add " + n.label + " after " + x.label + "”.", "refused", x.id);
      if (!A.length) throw new G("Nothing leads to " + E(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let S;
      try {
        S = Lr(i, A[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (_) {
        throw new G(_.message, "refused", l.id);
      }
      const T = S.lanes[S.lanes.length - 1];
      for (const _ of S.lanes)
        A.some((D) => D.id === _.id) && (_.station.next = [...new Set(_.station.next.map((D) => D === l.id ? T.id : D))]);
      return T.station.next = [l.id], b(V(S, t, T.id), "Added " + E(T.label) + " before " + E(l.label) + ".", { laneId: T.id });
    }
    case "connect_stations": {
      const l = v(n.from), x = v(n.to);
      if (l.id === x.id) throw new G("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(x.id) ? b(i, E(l.label) + " already leads to " + E(x.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(x.id), b(V(i, t, l.id), "Connected " + E(l.label) + " to " + E(x.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = v(n.from), x = v(n.to);
      if (!l.station.next.includes(x.id)) throw new G("There is no path between " + E(l.label) + " and " + E(x.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((A) => A !== x.id), b(V(i, t, l.id), "Removed the path from " + E(l.label) + " to " + E(x.label) + ".", { laneId: l.id });
    }
    case "set_station_outcome": {
      const l = v(n.station);
      return l.station.outcome = n.outcome, b(V(i, t, l.id), "Changed what happens at " + E(l.label) + ".", { laneId: l.id });
    }
    case "set_station_position": {
      const l = v(n.station);
      return Object.assign(l.station, { column: n.column, row: n.row }), b(V(i, t, l.id), "Moved " + E(l.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: l.id });
    }
    case "set_station_image": {
      const l = v(n.station);
      return n.image === null ? (delete l.station.image, b(V(i, t, l.id), "Removed the image at " + E(l.label) + ".", { laneId: l.id })) : (l.station.image = { src: n.image.src, alt: n.image.alt }, b(V(i, t, l.id), "Updated the image at " + E(l.label) + ".", { laneId: l.id }));
    }
    case "set_station_image_alt": {
      const l = v(n.station);
      if (!l.station.image) throw new G("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, b(V(i, t, l.id), "Updated the image description at " + E(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = k(n.card);
      let x = l.id, A, S;
      if (n.kind === "connect_cards") {
        const M = k(n.to, l.laneId);
        if (M.id === l.id) throw new G("A line joins two different cards.", "refused", l.laneId, l.id);
        A = M.id, S = E(M.label);
      } else {
        const M = n.note.trim();
        if (i.cards.some((q) => q.id === M) || i.lanes.some((q) => q.id === M))
          throw new G("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        A = M, S = "the note " + M, n.direction === "from_note" && ([x, A] = [A, x]);
      }
      const T = ui(i, x, A, n.label ? { label: n.label } : {}), _ = Gn(i, T);
      if (_) throw new G(_, "refused", l.laneId, l.id);
      const D = yt(i, T), j = x === l.id;
      return b(
        D,
        j ? "Drew a line from " + E(l.label) + " to " + S + "." : "Drew a line from " + S + " to " + E(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = k(n.card), x = n.kind === "disconnect_cards" ? k(n.to, l.laneId).id : n.note.trim(), A = n.kind === "disconnect_cards" ? E(i.cards.find((_) => _.id === x).label) : "the note " + x, S = (_) => _.parentId === l.id && _.childId === x || _.parentId === x && _.childId === l.id, T = i.lines ?? [];
      return T.some(S) ? (i.lines = T.filter((_) => !S(_)), b(V(i, t, l.laneId, l.id), "Took away the line between " + E(l.label) + " and " + A + ".", { laneId: l.laneId, cardId: l.id })) : b(e, E(l.label) + " and " + A + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new G("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function J(l, x, A = !1) {
    const S = { laneId: x.id, cardId: l.id };
    if (l.laneId === x.id)
      return b(e, E(l.label) + " is already " + (c ? "at " : "in ") + E(x.label) + ".", S, !1);
    const T = rn(e, l.id, x.id);
    if (!T) {
      const _ = je(e, l.id, x.id) ?? "That move is not available.", D = Kn(e, l.id, x.id, { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() });
      if (A && D) return b(V(D, t, x.id, l.id), "Moved " + E(l.label) + " to " + E(x.label) + " anyway. " + _, S);
      const j = new G(_, "refused", x.id, l.id);
      throw D && (j.overridable = !0), j;
    }
    return b(V(T, t, x.id, l.id), "Moved " + E(l.label) + " to " + E(x.label) + ".", S);
  }
}
function cr(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new G(r === "amount" ? z.notAmounts : z.notTasks, "not_on_this_board", t);
}
function ut(e, n) {
  e.signals && (e.signals = e.signals.filter((t) => !n(t)), e.signals.length || delete e.signals);
}
function $e(e, n, t = {}) {
  const r = (v) => ({ refused: { index: 0, kind: null, laneId: null, ...v } });
  let o;
  try {
    o = X(e);
  } catch (v) {
    return r({ reason: "The workshop cannot be read: " + (v instanceof Error ? v.message : String(v)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return r({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = o, c = [], h = [], p = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [v, k] of n.entries()) {
    const $ = k?.kind, b = so.find((T) => T.kind === $);
    if (!k || typeof k != "object" || !b)
      return r({
        index: v,
        kind: typeof $ == "string" ? $ : null,
        code: "invalid_edit",
        reason: "There is no edit called " + E(String($)) + ". The edits are " + on(so.map((T) => T.kind)) + "."
      });
    const L = ts(k, b);
    if (L) return r({ index: v, kind: b.kind, code: "invalid_edit", reason: L });
    const F = bt(o);
    if (!b.boards.includes(F))
      return r({ index: v, kind: b.kind, code: "not_on_this_board", reason: b.refusals[F] ?? "This workshop does not take " + b.kind + "." });
    const J = (k.kind === "move_card" || k.kind === "set_task" || k.kind === "nest_card") && k.override !== !0, l = (T, _) => {
      if (!J || T !== "refused") return { reason: _ };
      const D = $e(o, [{ ...k, override: !0 }], t);
      return "refused" in D ? { reason: _ } : { reason: D.report.overrides?.[0]?.sentence ?? _, overridable: !0 };
    };
    let x;
    try {
      x = os(o, k, F, t.selection, p);
    } catch (T) {
      if (!(T instanceof G)) throw T;
      const _ = T.overridable ? { reason: T.reason, overridable: !0 } : l(T.code, T.reason);
      return r({
        index: v,
        kind: b.kind,
        ..._,
        code: T.code,
        laneId: T.laneId,
        ...T.cardId && { cardId: T.cardId },
        ...T.candidates && { candidates: T.candidates },
        ...T.limits && { limits: T.limits }
      });
    }
    const A = o.behaviour && !Xi(b.kind) ? be().check(o, x.board) : null;
    if (A && "refused" in A)
      return r({ index: v, kind: b.kind, ...l("refused", A.refused.sentence), code: "refused", laneId: A.refused.laneId, cardId: A.refused.cardId });
    const S = ss(o, x.board);
    if (S) return r({ index: v, kind: b.kind, reason: S, code: "not_on_this_board", laneId: x.laneId ?? null });
    if (k.override === !0)
      for (const T of x.board.cards)
        T.override && Us(o, T) && h.push({ index: v, cardId: T.id, laneId: T.laneId, fromLaneId: T.override.from, sentence: T.override.sentence });
    o = x.board, c.push({
      index: v,
      kind: b.kind,
      said: x.said,
      changed: x.changed ?? !0,
      ...x.laneId && { laneId: x.laneId },
      ...x.cardId && { cardId: x.cardId }
    });
  }
  const C = new Map(i.cards.map((v) => [v.id, v.laneId])), I = o.cards.flatMap((v) => {
    const k = C.get(v.id);
    return k === void 0 || k === v.laneId ? [] : [{ cardId: v.id, fromLaneId: k, toLaneId: v.laneId }];
  });
  return { workshop: o, report: { edits: c, movedCards: I, ...h.length && { overrides: h } } };
}
function rs(e, n) {
  const t = te(e);
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
    const c = e.lanes.find((h) => {
      const p = n.lanes.find((C) => C.id === h.id);
      return h.floor !== p.floor || h.cap !== p.cap || h.capacity !== p.capacity;
    });
    if (c) return `${c.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? z.launchLanes : t && ve(t).fixed?.(e, n) || null;
}
const is = {
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
function ss(e, n) {
  const t = X(e), r = bt(t);
  let o;
  try {
    o = X(n);
  } catch (p) {
    return vt(p instanceof Error ? p.message : String(p), r);
  }
  const i = bt(o), c = (p, C) => p.lanes.length === C.lanes.length && p.lanes.every((I) => C.lanes.some((v) => v.id === I.id)), h = (p, C) => p.lanes.every((I, v) => C.lanes[v]?.id === I.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return c(t, o) ? z.keepsCards : z.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !h(t, o)) return z.keepsOrder;
  if (te(t) && i === r && !(c(t, o) && h(t, o))) return io[r];
  if (te(t) && i === r) {
    const p = rs(t, o);
    if (p) return p;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!c(t, o)) return z.releaseLanes;
    if (!h(t, o)) return z.releaseOrder;
    if (o.cards.some((p) => !t.cards.some((C) => C.id === p.id))) return z.releaseCards;
  }
  return r !== i ? "This board is a " + is[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? be().replacement(t, o) : null;
}
const $a = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function La(e) {
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
    let h = i.after;
    for (; h !== null; ) {
      if (c.has(h) || !r.has(h) || o.includes(i.id) && !o.includes(h)) return null;
      c.add(h), h = r.get(h).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: t, hung: o };
}
function as(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function Ta(e, n) {
  return as(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Rr = ["firstPrint", "secondPrint", "thirdPrint"], Wr = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Oa(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Wr, route: n.route };
  for (const r of Rr) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function Pa(e = new URLSearchParams()) {
  const n = { ...Wr };
  for (const r of Rr) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function Ea(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function ls(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = us(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), cs(n), n;
}
function ds(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function cs(e) {
  return e && ds(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Vt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function jn(e) {
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
function us(e) {
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
function ft() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const yn = {
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
}, fs = "var(--slatebox-board-font, system-ui, sans-serif)", ao = "http://www.w3.org/2000/svg", ur = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function We(e, n, t) {
  const r = document.createElementNS(ao, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", ur(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", ur(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function kn(e, n, t, r, o) {
  const i = typeof document < "u" ? document.activeElement : null, c = i && e.contains(i) ? i.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const h = [];
  for (const p of n)
    if (p.t === "line")
      e.appendChild(We("line", {
        x1: p.x1,
        y1: p.y1,
        x2: p.x2,
        y2: p.y2,
        "stroke-width": p.width ?? 1,
        ...p.dash ? { "stroke-dasharray": p.dash } : {}
      }, { stroke: p.color }));
    else if (p.t === "rect")
      e.appendChild(We("rect", {
        x: p.x,
        y: p.y,
        width: Math.max(0, p.w),
        height: Math.max(0, p.h),
        rx: p.rx ?? 0,
        ...p.opacity !== void 0 ? { opacity: p.opacity } : {},
        ...p.role ? { "data-board-layer": p.role } : {}
      }, { fill: p.color }));
    else if (p.t === "text") {
      const C = We("text", {
        x: p.x,
        y: p.y,
        "font-size": p.size ?? 13,
        "text-anchor": p.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...p.bold ? { "font-weight": 600 } : {},
        ...p.role ? { "data-board-layer": p.role } : {},
        ...p.halo ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
      }, { fill: p.color, ...p.halo ? { stroke: p.halo } : {} });
      C.style.setProperty("font-family", fs), p.lines && p.lines.length > 1 ? p.lines.forEach((I, v) => {
        const k = We("tspan", { x: p.x, dy: v ? p.lineHeight ?? Math.round((p.size ?? 13) * 1.25) : 0 });
        k.textContent = v < p.lines.length - 1 ? I + " " : I, C.appendChild(k);
      }) : C.textContent = p.text, e.appendChild(C);
    } else {
      if (p.unlink && t) {
        const { cardId: C, waitsOn: I, label: v } = p.unlink, k = I + ">" + C, $ = r?.armed === k, b = We("path", {
          d: p.d,
          fill: "none",
          "stroke-width": p.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": k,
          "aria-label": $ ? v + ". " + (p.unlink.armed ?? "Tap again to remove it") + "." : v,
          role: "button",
          tabindex: 0,
          ...$ ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: $ ? yn.refuse : "transparent" });
        let L = !1;
        b.addEventListener("pointerdown", (F) => {
          F.stopPropagation(), L = F.pointerType === "touch" || F.pointerType === "pen";
        }), b.addEventListener("click", (F) => {
          if (F.stopPropagation(), L && r && r.armed !== k) {
            r.arm(k);
            return;
          }
          r?.arm(null), t(C, I);
        }), b.addEventListener("keydown", (F) => {
          F.key !== "Enter" && F.key !== " " || (F.preventDefault(), F.stopPropagation(), t(C, I));
        }), b.addEventListener("focus", () => {
          b.style.setProperty("stroke", yn.accept), b.setAttribute("opacity", "0.35");
        }), b.addEventListener("blur", () => {
          $ || (b.style.setProperty("stroke", "transparent"), b.removeAttribute("opacity"));
        }), e.appendChild(b), h.push(b);
      } else if (p.pick && o) {
        const { key: C, label: I } = p.pick, v = We("path", {
          d: p.d,
          fill: "none",
          "stroke-width": p.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": C,
          "data-board-pick": "",
          "aria-label": I,
          role: "button",
          tabindex: 0
        }, { stroke: "transparent" });
        v.addEventListener("pointerdown", (k) => k.stopPropagation()), v.addEventListener("click", (k) => {
          k.stopPropagation(), o(C);
        }), v.addEventListener("keydown", (k) => {
          k.key !== "Enter" && k.key !== " " || (k.preventDefault(), k.stopPropagation(), o(C));
        }), v.addEventListener("focus", () => {
          v.style.setProperty("stroke", yn.accept), v.setAttribute("opacity", "0.35");
        }), v.addEventListener("blur", () => {
          v.style.setProperty("stroke", "transparent"), v.removeAttribute("opacity");
        }), e.appendChild(v), h.push(v);
      }
      if (e.appendChild(We(
        "path",
        {
          d: p.d,
          fill: "none",
          "stroke-width": p.width ?? 1.5,
          "pointer-events": "none",
          ...p.dash ? { "stroke-dasharray": p.dash } : {},
          ...p.role ? { "data-board-layer": p.role } : {},
          ...p.strokeOpacity !== void 0 ? { "stroke-opacity": p.strokeOpacity } : {},
          ...p.fill ? { "stroke-linecap": "round", "stroke-linejoin": "round" } : {}
        },
        { stroke: p.color === "none" ? "transparent" : p.color, ...p.fill && p.fill !== "none" ? { fill: p.fill } : {} }
      )), p.arrow) {
        const { x: C, y: I, angle: v } = p.arrow;
        e.appendChild(We("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${I}) rotate(${v})`, "pointer-events": "none" }, { fill: p.color }));
      }
      if (p.unlink && r?.armed === p.unlink.waitsOn + ">" + p.unlink.cardId && p.arrow) {
        const C = We("text", {
          x: p.arrow.x - 6,
          y: p.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: yn.refuse });
        C.textContent = p.unlink.armed ?? "Tap again to remove this link", e.appendChild(C);
      }
    }
  c && h.find((p) => p.getAttribute("data-board-link") === c)?.focus({ preventScroll: !0 });
}
function hs(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(ao, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(ao, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let i = !1, c = null, h;
  const p = {
    armed: null,
    arm(I) {
      clearTimeout(h), p.armed = I, I && (h = setTimeout(() => p.arm(null), 5e3), c?.[2].announce?.(c[2].boardFocused && c[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), c && C.draw(...c);
    }
  }, C = {
    draw(I, v, k) {
      if (i || !t) return;
      c = [I, v, k];
      const { origin: $ } = k, b = n(v ?? I, k, I), L = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o])
        l.setAttribute("transform", `translate(${$.x} ${$.y})`), l.toggleAttribute("data-workshop-focused", !!k.boardFocused);
      kn(r, b.filter((l) => !L(l)), k.onUnlink, p, k.onPick), kn(o, b.filter(L));
      const F = k.above && k.above.parentNode === t ? k.above : null, J = F ? F.nextSibling : t.firstChild;
      (r.parentNode !== t || r.previousSibling !== F) && t.insertBefore(r, J === r ? r.nextSibling : J), o.firstChild && t.lastChild !== o ? t.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
    },
    destroy() {
      i = !0, clearTimeout(h), r.remove(), o.remove();
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
}, ht = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, ps = (e) => e.replace(/\.$/, ""), ms = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function So(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return ws(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, c = (h) => n.push(i ? { ...h, warn: i } : h);
    if (o.kind === "bin" && o.lane) c({ icon: "bin", text: ht(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) c({ icon: "gate", text: ht(e, o.into) + " needs " + (o.needs ?? []).map((h) => ms[h] ?? h).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) c({ icon: "step", text: "One column at a time", seams: t.slice(1).map((h, p) => [t[p], h]) });
      else {
        const h = o.from, p = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(h)) === 1).map((C) => [h, C]);
        c({ icon: "oneway", text: ht(e, h) + " → " + o.to.map((C) => ht(e, C)).join(" or ") + " only", seams: p });
      }
  }
  return n;
}
function ws(e) {
  if (!qi()) return [];
  let n;
  try {
    n = be().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = ps(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, c = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: c, text: gs(o), ...i && { warn: i } });
  }
  return t;
}
function gs(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const wt = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Fr(e, n, t, r, o = 12) {
  const i = o / 12, c = (p) => p.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, I, v) => `A${+I * i} ${+v * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, I, v) => `${+(n + +I * i).toFixed(1)},${+(t + +v * i).toFixed(1)}`), h = (p, C = 1.6) => ({ t: "path", d: c(p), color: r, width: C * i });
  switch (e) {
    case "bin":
      return [h("M2,3 L10,3 M4.5,3 L4.5,1.5 L7.5,1.5 L7.5,3 M3,3 L3.8,11 L8.2,11 L9,3")];
    case "gate":
      return [h("M2,11 L2,3 L10,3 L10,11 M6,3 L6,11 M2,7 L10,7")];
    case "step":
      return [h("M4,2 L8,6 L4,10", 1.8)];
    case "oneway":
      return [h("M1,6 L10,6 M7,3 L10,6 L7,9", 1.8)];
    case "clock":
      return [h("M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,3.5 L6,6 L8,7.5")];
    case "flag":
      return [h("M3,11 L3,1.5 L10,3.5 L3,6")];
    case "push":
      return [h("M1,6 L7,6 M4.5,3.5 L7,6 L4.5,8.5 M9.5,2 L9.5,10", 1.7)];
    case "lock":
      return [h("M3,6 L9,6 L9,11 L3,11 Z M4.5,6 L4.5,4 Q6,1.5 7.5,4 L7.5,6")];
    default:
      return [h("M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,4 L6,6.5 M6,8.5 L6,8.6", 1.7)];
  }
}
const Co = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function xt(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + wt(e.text, 13 * n, t) + 10 * n);
}
function pt(e, n, t, r, o = {}) {
  const i = 24 * r, c = 10 * r, h = t.icon ? 17 * r : 0, p = xt(t, r, o.bold), C = o.ink ?? he.chipInk, I = [{
    t: "path",
    d: Co(e, n, p, i, i / 2),
    color: t.warn ? he.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? he.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && I.push(...Fr(t.icon, e + c, n + 6 * r, C, 12 * r)), I.push({ t: "text", x: e + c + h, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), I;
}
function fr(e, n, t, r) {
  return [
    { t: "path", d: Co(n - 11, t - 11, 22, 22, 11), color: he.badgeLine, width: 1, fill: he.badge, role: r },
    ...Fr(e, n - 6, t - 6, he.badgeInk)
  ];
}
const ys = "Preview · not added yet", Dr = 6, ks = 2.5, jr = (e) => Math.round(Math.min(Dr, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, lo = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function Br(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(Dr, Math.max(1, t.scale ?? 1)), c = i > ks ? [] : So(e), h = 18 * i, p = 30 * i, C = (_, D) => {
    const j = (t.narrow && D <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (wt(_, 18 * D, !0) <= j) return _;
    const M = Math.max(3, Math.floor(j / (18 * D * 0.58)) - 1);
    return _.slice(0, M).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, I = C(e.title, i), v = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), k = [], $ = [2 + wt(C(e.title, 1), 18, !0) + 14];
  t.narrow && c.length && ($[0] = 1 / 0, $.push(2));
  for (const _ of c) {
    const D = xt(_, 1);
    let j = $.findIndex((M) => M + D <= v);
    j < 0 && ($.push(2), j = $.length - 1), k.push({ x: $[j], row: j, item: _, width: D }), $[j] += D + 6;
  }
  const b = k.map((_) => ({ x: r + Math.round(_.x * i), row: _.row, item: _.item, width: xt(_.item, i) })), L = Math.max(1, ...b.map((_) => _.row + 1)), F = o - 14 * i - L * p, J = !!(t.focused || t.draft), l = t.narrow ? 8 : 16, x = J ? { x: r - l, y: F - 18 * i, width: n.width + 2 * l, height: o + n.height + l - (F - 18 * i) } : null, A = Math.max(i, t.tagScale ?? i), S = x ? x.y - 12 * A : F, T = r + 2 + wt(I, h, !0);
  return { k: i, tagK: A, legend: c, placed: b, rows: L, title: I, titleY: F, titleSize: h, titleRight: T, rowH: p, frame: x, top: S };
}
function Hr(e, n, t = {}) {
  const r = Br(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((I) => I.x + I.width)), c = o ? o.x : 0, h = r.top, p = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: c, y: h, width: p - c, height: C - h };
}
function hr(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: c, titleY: h, titleSize: p, rowH: C, frame: I } = Br(e, n, t), v = n.x ?? 0, k = [];
  if (I) {
    const $ = Co(I.x, I.y, I.width, I.height, 18);
    t.focused && k.push({ t: "path", d: $, color: he.focus, width: 12, strokeOpacity: 0.1, fill: he.focusTint, role: "focus-glow" }), k.push({
      t: "path",
      d: $,
      color: t.focused ? he.focus : he.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  k.push({ t: "text", x: v + 2, y: h + 19 * r, text: c, color: he.title, size: p, bold: !0, role: "board-title" });
  for (const $ of i) k.push(...pt($.x, h + $.row * C + 2 * r, $.item, r));
  if (I) {
    const $ = I.y - 12 * o;
    if (t.focused) {
      const b = { text: "Editing" };
      k.push(...pt(I.x + 18, $, b, o, { fill: he.focus, ink: he.focusInk, bold: !0, role: "focus-tag" })), k.push(...pt(
        I.x + 18 + xt(b, o, !0) + 6 * o,
        $,
        { text: "Done" },
        o,
        { fill: he.halo, ink: he.focus, line: he.focus, bold: !0, role: "focus-done" }
      ));
    } else
      k.push(...pt(I.x + 18, $, { text: ys }, o, { fill: he.previewFill, ink: he.previewInk, bold: !0, role: "draft-tag" }));
  }
  return k;
}
function pr(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((c) => c.laneId === i);
  for (const i of So(e)) {
    const c = i.lane ? o(i.lane) : void 0;
    c && r.push(...fr(i.icon, c.x + c.width - 22, c.y + 18, "badge-" + i.lane));
    for (const [h, p] of i.seams ?? []) {
      const C = o(h), I = o(p);
      !C || !I || C.row !== I.row || r.push(...fr(i.icon, (C.x + C.width + I.x) / 2, C.y + 35, "seam-" + h + ">" + p));
    }
  }
  return r;
}
function bs(e) {
  const n = So(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const Ma = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, mr = "http://www.w3.org/2000/svg";
function wr(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function vs(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(mr, "g") : null, r = typeof document < "u" ? document.createElementNS(mr, "g") : null;
  for (const I of [t, r])
    I?.setAttribute("data-board-chrome", ""), I?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const c = (I) => ({ layout: I.layout, focused: I.focused, draft: I.draft, scale: I.scale, tagScale: I.tagScale, narrow: I.narrow, places: I.places, room: I.room }), h = (I, v) => {
    const k = Hr(I.board, I.size, v);
    return { x: I.origin.x + k.x, y: I.origin.y + k.y, width: k.width, height: k.height };
  }, p = (I) => ({ ...c(I), focused: !1, draft: !1, scale: 1, tagScale: 1 }), C = {
    get scope() {
      return i?.scope ?? "main";
    },
    get draft() {
      return !!i?.draft;
    },
    box(I) {
      if (!i) return null;
      const v = jr(I);
      return h(i, { ...c(i), scale: v, tagScale: lo(I, !!(i.narrow && !i.draft), v) });
    },
    plainBox() {
      return i ? h(i, p(i)) : null;
    },
    paintPlain(I, v) {
      if (!i) return;
      const k = p(i);
      I.removeAttribute("data-workshop-focused"), kn(I, hr(i.board, { width: i.size.width, height: i.size.height }, k)), v && (v.removeAttribute("data-workshop-focused"), kn(v, pr(i.board, k)));
    }
  };
  return wr(e).add(C), {
    draw(I) {
      if (o || !n || !t || !r) return;
      i = I;
      const v = c(I);
      for (const b of [t, r])
        b.setAttribute("transform", `translate(${I.origin.x} ${I.origin.y})`), b.toggleAttribute("data-workshop-focused", !!I.focused), b.toggleAttribute("data-workshop-draft", !!I.draft), b.setAttribute("data-board-scope", I.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", bs(I.board)), kn(t, hr(I.board, { width: I.size.width, height: I.size.height }, v)), kn(r, pr(I.board, v));
      const k = t.querySelector('[data-board-layer="focus-done-box"]');
      if (k && I.onDone) {
        const b = I.onDone;
        k.setAttribute("role", "button"), k.setAttribute("tabindex", "0"), k.setAttribute("aria-label", "Done changing " + I.board.title), k.setAttribute("pointer-events", "all"), k.setAttribute("cursor", "pointer"), k.addEventListener("pointerdown", (L) => L.stopPropagation()), k.addEventListener("click", (L) => {
          L.stopPropagation(), b();
        }), k.addEventListener("keydown", (L) => {
          const F = L.key;
          F !== "Enter" && F !== " " || (L.preventDefault(), L.stopPropagation(), b());
        });
      }
      const $ = I.under && I.under.parentNode === n ? I.under : null;
      $ ? t.nextSibling !== $ && n.insertBefore(t, $) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, wr(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const co = "handle-_link-", uo = "handle-_route-", Un = 40, zr = 44;
function Xt(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(Un, Math.ceil(zr / n)));
}
function Gr(e) {
  if (e.startsWith(co)) return { kind: "link", from: e.slice(co.length) };
  if (e.startsWith(uo)) {
    const [n, t] = e.slice(uo.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const Ur = (e) => !!e.lanes[0]?.station, qe = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function $o(e) {
  const { places: n } = De(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function gr(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, c = n.y - o, h = i ? e.width / 2 / Math.abs(i) : 1 / 0, p = c ? e.height / 2 / Math.abs(c) : 1 / 0, C = Math.min(h, p), I = Math.hypot(i, c) || 1;
  return { x: r + i * C + i / I * t, y: o + c * C + c / I * t };
}
function Kr(e) {
  if (!Ur(e)) return [];
  const n = $o(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const c = n.get(i);
        if (!c) continue;
        const h = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, p = { x: c.x + c.width / 2, y: c.y + c.height / 2 }, C = gr(o, p, -8), I = gr(c, h, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: I.x, y2: I.y });
      }
  }
  return t;
}
function xs(e, n) {
  for (const [t, r] of $o(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function qr(e, n, t = Un) {
  if (!Ur(e)) return [];
  const r = $o(e), o = t / Un, i = (h, p, C, I, v) => ({ options: {
    id: h,
    name: I,
    text: v ? "+" : "",
    xPos: n.x + p - t / 2,
    yPos: n.y + C - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: vn(t, t, t / 2),
    backgroundColor: v ? "#2f5fd0" : "#fffef8",
    foregroundColor: v ? "#ffffff" : "#2f5fd0",
    borderColor: v ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), c = [];
  for (const h of e.lanes) {
    const p = r.get(h.id);
    p && c.push(i(co + h.id, p.x + p.width, p.y + p.height, "Draw a path from " + h.label, !0));
  }
  for (const h of Kr(e))
    c.push(i(uo + h.from + "~" + h.to, h.x2, h.y2, "End of the path from " + qe(e, h.from) + " to " + qe(e, h.to), !1));
  return c;
}
function Is(e, n) {
  const t = Gr(n);
  return t ? t.kind === "link" ? `Draw a path from ${qe(e, t.from)}: drag it onto another step.` : `End of the path from ${qe(e, t.from)} to ${qe(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function As(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((c) => c.id === n.from);
  if (!r?.station || !e.lanes.some((c) => c.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${qe(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((c) => c !== n.to) : r.station.next, i = e.lanes.map((c) => c.id === r.id ? { ...c, station: { ...c.station, next: [...o, t] } } : c);
  return { next: { ...e, lanes: i } };
}
function Ss(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((h) => h.id === o.id)?.station?.next ?? [], c = o.station?.next ?? [];
    for (const h of i) c.includes(h) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: h } });
    for (const h of c) i.includes(h) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: h } });
  }
  return [...t, ...r];
}
function Cs(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? Un, i = Math.max(24, o * zr / Un);
  for (const c of Kr(e)) {
    const h = qe(e, c.from) + " to " + qe(e, c.to), p = `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`, C = !r && n.picked === c.key;
    t.push(r ? { t: "path", d: p, color: "transparent", width: 3, hit: i, unlink: { cardId: c.to, waitsOn: c.from, label: "Remove the path from " + h, armed: "Tap again to remove this path" } } : { t: "path", d: p, color: C ? yn.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: c.key, label: "Path from " + h + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const c = qr(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, h = c ? c.xPos + o + 6 : 0, p = c ? c.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: h, y: p, text: n.clamp.text, color: yn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
let Jr = null;
const fo = /* @__PURE__ */ new Set();
function Na(e) {
  Jr = e;
  for (const n of fo) n();
}
const yr = "#1f7a5c", kr = "#5b9a85", Qt = "#c2410c", $s = "#a8761b", Ls = {
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
}, Ts = { canMove: !1, canSelect: !1 }, eo = "A card's line joins notes and cards on its own board.", Bn = /* @__PURE__ */ new WeakMap();
function Os(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function _a(e, n, t = {}) {
  const r = Zn(t.scope);
  let o = X(n);
  const i = t.kit, c = (s) => !!te(s) && !i;
  if (c(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const h = i?.layer(e) ?? (o.lanes[0]?.station ? hs(e, Cs) : void 0), p = t.chrome === !1 ? null : vs(e);
  let C = 1, I = 1, v = null, k = null, $ = /* @__PURE__ */ new Set(), b = null, L = null;
  const F = !!t.draft, J = !!t.still;
  let l = !!t.readOnly || F || J, x = l || c(o), A = !1;
  const S = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
  let M = null, q = null, Me = null, ue = null, Q = null;
  const Be = /* @__PURE__ */ new Map(), dn = /* @__PURE__ */ new Map(), Ze = /* @__PURE__ */ new Map();
  let oe = null, pe = null;
  function ye(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, A || B(L ?? o);
    }, 3e3) };
  }
  let xe = Promise.resolve(), Vn = null, ae = vr(t.layout), Ae = ae;
  const Et = { ...t.style };
  let Te = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Set(), No = null, Se = !1, Xn = t.controls ?? "off", Ve = null, Nt = null;
  const _o = () => hn();
  fo.add(_o);
  let Cn = Xt(1), Qn = null, $n = null, Xe = null, et = !1;
  const we = /* @__PURE__ */ new Map();
  Ge(o);
  const Y = t.origin ? { x: t.origin.x, y: t.origin.y } : Es(e), nt = r ? r + ":" : "", Ie = (s) => j.get(s) ?? (nt ? s.startsWith(nt) ? s.slice(nt.length) : null : s), me = (s) => {
    const a = Ie(s);
    return a === null ? null : Os(a);
  };
  function le(s) {
    const a = D.get(s);
    if (a) return a;
    const d = nt + s;
    if (S.has(d) && !j.has(d) || !e.nodes.one?.(d)) return d;
    const f = wi(d, (m) => !!e.nodes.one?.(m) || j.has(m));
    return D.set(s, f), j.set(f, s), console.warn(`WORKSHOP: the slate already has a note named "${d}". It stays the slate's own; the workshop draws its note as "${f}".`), f;
  }
  function Ln(s, a = 1) {
    let d = [];
    try {
      d = t.avoid?.() ?? [];
    } catch (f) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", f);
    }
    return d.length ? ca(s, d, a) : { x: s.x, y: s.y };
  }
  function yi(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (u) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", u);
    }
    const { width: d, height: f } = i ? i.places(o, ae) : Ge(o);
    let m = 1 / 0;
    for (const u of a)
      [u.x, u.y, u.width, u.height].every(Number.isFinite) && u.x >= Y.x + d && u.y < Y.y + f && u.y + u.height > Y.y && (m = Math.min(m, u.x - 32 - Y.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function ki(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (d) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", d);
    }
    return a.some((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite) && s.x < d.x + d.width && s.x + s.width > d.x && s.y < d.y + d.height && s.y + s.height > d.y);
  }
  function bi(s, a) {
    const d = [...Bn.get(e) ?? []].filter((g) => g !== Rt);
    if (!d.length) return null;
    const { id: f, note: m } = Yo(s, a), u = { id: f, options: m }, w = oo(o, s).some((g) => o.cards.some((y) => y.id !== s && (y.id === g.parentId || y.id === g.childId)));
    for (const g of d) {
      let y = null;
      try {
        y = g.verdict(u, a);
      } catch (O) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", O);
      }
      if (y) return { board: g, ...y, reason: w ? eo : y.reason };
    }
    return null;
  }
  function vi(s, a, d, f) {
    const { added: m, answer: u } = rt(a, d, "", !0), w = Ln(d), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let y;
      try {
        y = s.take(m, f, w);
      } catch (N) {
        console.warn("WORKSHOP: another board could not take the card", N);
      }
      if (y === "taken") return;
      const O = Math.round(w.x), P = Math.round(w.y);
      m.position?.(O, P, () => e.updateSelectionResizeRotate?.(), void 0, ft() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Vt({ ...m.options, x: O, y: P })] });
    };
    !u || typeof u.then != "function" ? g() : u.then((y) => {
      y === !0 && !A && g();
    }, () => {
    });
  }
  const Oe = {
    governs(s) {
      if (S.get(s.id) !== s) return null;
      const a = me(s.id)?.kind;
      return a === "card" ? { canMove: !x, canEditText: !x && !L && o.kind !== "release-plan", canConnect: Mn() } : a === "lane" ? { canMove: !1, canEditText: !x && !L } : a === "handle" ? { canMove: !x && !L, canEditText: !1, ...!ae.narrow && { cursor: i ? "ew-resize" : "grab" }, ...ae.narrow && { edgePan: !1 } } : Ts;
    },
    onStart(s, a) {
      const d = me(s.id), f = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const w = x || L ? null : i ? i.handleDrag(o, Ie(s.id), f, ae) : zi(Ie(s.id));
        return w ? (ie(), ze(), pe && (clearTimeout(pe.timer), pe = null), b = { name: Ie(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = d.key;
      if (x || L || !o.cards.some((w) => w.id === m)) return !1;
      ie(), ze();
      let u = null;
      try {
        u = (i?.chooser ?? t.chooseCandidate)?.(o, m, f, ae) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return M = { cardId: m, evaluate: u, grab: f, outcome: { kind: "home" } }, B(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (b) {
        b.last = b.follow(en(a)), B(b.last.next, { grip: b.name, layout: yi(b.last.layout) }), K(t.onPreview, b.last.next === o ? null : b.last.next);
        return;
      }
      if (!M) return;
      const d = jo(M.cardId, a, M.evaluate);
      if (Ps(d, M.outcome)) return;
      M.outcome = d;
      const f = d.kind === "candidate" ? d.next : null;
      B(f ?? o, { skip: M.cardId }), K(t.onPreview, f);
    },
    onEnd(s, a) {
      if (b) {
        const { follow: w, name: g } = b, y = w(en(a));
        if (b = null, K(t.onPreview, null), y.refusal) {
          ye(g, y.refusal), B(o), e.announce?.(y.refusal), K(t.onRefuse, { laneId: null, reason: y.refusal });
          const P = y.override && br(y.override.edit);
          P && Rn(P, o.cards.find((N) => N.id === P)?.laneId ?? "", y.refusal, y.override);
        } else at(y.next, {}) || B(o);
        const O = qt(o, Ie(s.id));
        return O ? { accept: !0, settle: O } : { accept: !1 };
      }
      if (!M) return { accept: !1 };
      const { cardId: d, evaluate: f } = M, m = jo(d, a, f), u = o.cards.find((w) => w.id === d);
      if (M = null, K(t.onPreview, null), m.kind === "candidate" && i) {
        if (!at(m.next, { cardId: d, laneId: m.laneId }, d))
          return B(o, { skip: d }), { accept: !1 };
        m.said && (ye("card-" + d, m.said), e.announce?.(m.said));
        const w = qt(o, Ie(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, B(o, { skip: d });
        const w = o.lanes.find((y) => y.id === m.laneId);
        e.announce?.(`${Z(u)} moved to ${w.label}. ${Ue(o, w.id)}.`), K(t.onChange, o, { cardId: d, laneId: m.laneId });
        const g = qt(o, Ie(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused") {
        const w = m.override ? m.override.to ?? i?.overrideWords?.(o, m.override.edit) : void 0;
        Wi(Z(u), { cardId: d, laneId: m.laneId, reason: m.reason }, w ?? (i && m.laneId === u.laneId ? "there" : void 0)), m.near && ye("card-" + d, m.reason), i ? m.override && Rn(d, m.laneId, m.reason, m.override) : m.near || Rn(d, m.laneId, m.reason);
      } else if (m.kind === "outside" && to() && !Ne()) {
        const w = gt(o, d);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, y = bi(d, a);
          if (y?.reason)
            return B(o, { skip: d }), y.board.flash(y.laneId, y.reason), e.announce?.(`${Z(u)} can't go in ${y.laneLabel}. ${y.reason} It stays where it was.`), K(t.onRefuse, { cardId: d, laneId: null, reason: y.reason }), { accept: !1 };
          if (y)
            return vi(y.board, d, g, a), { accept: !0 };
          const O = ki(g);
          return rt(d, O ? Ln(g) : g, O ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        B(o, { skip: d }), e.announce?.(w), K(t.onRefuse, { cardId: d, laneId: null, reason: w });
      } else
        B(o, { skip: d }), m.kind === "outside" && (e.announce?.(`${Z(u)} was not dropped on a lane. It stays where it was.`), K(t.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (b) {
        b = null, K(t.onPreview, null), B(o);
        return;
      }
      const a = M && o.cards.find((d) => d.id === M.cardId);
      M = null, K(t.onPreview, null), B(o, { skip: me(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Z(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const f = me(s.id);
      if (!f || x || L) return !1;
      const m = f.kind === "card" ? ti(o.cards.find((U) => U.id === f.key) ?? {}) : null;
      m && (a = a.split(`
`).filter((U) => U.trim() !== m).join(`
`));
      let u = a.replace(/\s+/g, " ").trim();
      const w = [], g = te(o), y = g && f.kind === "card" ? ve(g).renamed(o, f.key, u) : null;
      y && (u = y.label, w.push(...y.edits));
      const O = f.kind === "lane" ? { laneId: f.key, label: u } : { cardId: f.key, label: u };
      w.unshift(f.kind === "lane" ? { kind: "rename_lane", lane: { id: f.key }, label: u } : { kind: "rename_card", card: { id: f.key }, label: u });
      const P = $e(o, w);
      if ("refused" in P) {
        const { reason: U } = P.refused;
        return e.announce?.(`${d} keeps its name. ${U}`), K(t.onRefuse, { ...f.kind === "lane" ? { laneId: f.key } : { cardId: f.key }, rename: O, reason: U }), !1;
      }
      if (JSON.stringify(P.workshop) === JSON.stringify(o))
        return B(o), !1;
      const N = f.kind === "card";
      return N && e.beginHostStep?.(), o = P.workshop, f.kind === "card" && dn.set(f.key, u), N && e.endHostStep?.(), B(o), e.announce?.(y ? P.report.edits.map((U) => U.said).join(" ") : `${d} renamed to ${u}.`), K(t.onChange, o, { rename: O, ...i ? { edits: w } : {} }), y ? !1 : u;
    },
    onKeyDown(s, a) {
      const d = me(s.id);
      if (x || L || M || b || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (ue && (ue.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== ue.key) && Ho(), ue && a.key === "Escape")
        return a.preventDefault(), Ho(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (ue && a.key === "Enter") {
        a.preventDefault();
        const w = ue.choices[ue.at];
        return ue = null, K(t.onPreview, null), o = w.next, B(o), e.announce?.(w.done), K(t.onChange, o, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: w.edits }), !0;
      }
      const f = i?.keyChoices?.(o, Ie(s.id), a.key);
      if (f) {
        a.preventDefault();
        const w = [], g = [];
        for (const P of typeof f == "string" ? [] : f) {
          const N = $e(o, P.edits);
          "refused" in N ? g.push(`${P.said}: ${N.refused.reason}`) : w.push({ ...P, next: N.workshop, done: N.report.edits.map((U) => U.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof f == "string" ? f : g.join(" ")), !0;
        const y = ue && ue.node === s.id ? (ue.at + 1) % w.length : 0;
        ue = { node: s.id, key: a.key.toLowerCase(), choices: w, at: y }, B(w[y].next), K(t.onPreview, w[y].next);
        const O = w.length > 1 ? ` (${y + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[y].said}${O} Enter to make it, Escape to cancel.`), !0;
      }
      const m = i?.keyEdit?.(o, Ie(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = $e(o, m);
        if ("refused" in w) {
          e.announce?.(w.refused.reason), K(t.onRefuse, { laneId: w.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: w.refused.reason });
          const g = m.length === 1 && w.refused.overridable ? br(m[0]) : null;
          g && Rn(g, o.cards.find((y) => y.id === g)?.laneId ?? "", w.refused.reason, { edit: m[0] });
        } else at(w.workshop, d?.kind === "card" ? { cardId: d.key } : {});
        return !0;
      }
      if (d?.kind !== "card") return !1;
      const u = o.cards.find((w) => w.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Bo(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Ai())
        return a.preventDefault(), Bo(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (q?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: y } = q;
        if (q = null, w === null)
          return K(t.onPreview, null), rt(u.id, y), !0;
        const O = o;
        o = g, B(o), He(w), K(t.onPreview, null);
        const P = o.lanes.find((N) => N.id === w);
        return e.announce?.(`${Z(u)} moved to ${P.label}. ${Ue(o, w)}.`), K(t.onChange, o, { cardId: u.id, laneId: w, ...i ? { edits: i.editsBetween(O, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), ze(), e.announce?.(`Move cancelled. ${Z(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => S.get(a.id) === a).map((a) => a.id);
      et = s.length === 1, S.clear(), T.clear(), _.clear(), we.clear(), D.clear(), j.clear(), M = null, q = null, B(L ?? o, { animate: !1 }), s.length === 1 && (xe = xe.then(() => {
        et = !1;
        const a = S.get(s[0]);
        if (!A && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        cn();
      }));
    }
  };
  Oe.onFreeMove = (s, a) => {
    if (!Tn() || s.options?.isComment) return Wt();
    const d = On(a), f = Pn(s), m = En(s), u = o.lanes.filter((y) => !m && tn(o, y.id, f) === null).map((y) => y.id), w = d && i?.noteUnder?.(o, en(a), ae);
    w && (f.under = w);
    const g = d ? m ?? tn(o, d, f) : null;
    Q && Q.noteId === s.id && Q.laneId === d && Q.refusal === g || (Q = { noteId: s.id, laneId: d, refusal: g, open: u }, _e());
  }, Oe.onFreeDrop = (s, a, d) => {
    if (Wt(), !Tn() || s.options?.isComment) return;
    const f = On(a);
    if (!f) return;
    const m = Pn(s), u = i?.noteUnder?.(o, en(a), ae);
    u && (m.under = u), Ut(m, a);
    const w = o.lanes.find((y) => y.id === f), g = En(s) ?? tn(o, f, m);
    return g ? (ie(!1), oe = { laneId: f, reason: g, timer: setTimeout(() => ie(), 1500) }, _e(), e.announce?.(`${Ft(m.label)} can't go in ${w.label}. ${g}`), K(t.onRefuse, { noteId: s.id, laneId: f, reason: g }), "refused") : (Bt([{ node: s, offer: m, from: d }], f), "taken");
  }, Oe.onFreeGroupDrop = (s, a, d) => {
    if (Wt(), !Tn() || s.some((g) => g.options?.isComment)) return;
    const f = On(a);
    if (!f) return;
    const m = o.lanes.find((g) => g.id === f), u = s.map((g) => ({ node: g, offer: Ut(Pn(g), a) })), w = $i(u, f);
    if (w) {
      ie(!1), oe = { laneId: f, reason: w, timer: setTimeout(() => ie(), 1500) }, _e(), e.announce?.(`${zo(u.map((g) => Ft(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of u) K(t.onRefuse, { noteId: g.id, laneId: f, reason: w });
      return "refused";
    }
    return Bt(u.map((g, y) => ({ ...g, from: d?.[y] })), f), "taken";
  }, Oe.onFreeTextCommit = (s) => {
    if (!Tn() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = { x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 }, f = On(d);
    if (!f) return;
    const m = Ut(Pn(s), d), u = o.lanes.find((N) => N.id === f), w = En(s) ?? tn(o, f, m);
    if (!w) {
      Bt([{ node: s, offer: m }], f);
      return;
    }
    ie(!1), oe = { laneId: f, reason: w, timer: setTimeout(() => ie(), 1500) }, _e(), e.announce?.(`${Ft(m.label)} can't go in ${u.label}. ${w} It is beside the board.`), K(t.onRefuse, { noteId: s.id, laneId: f, reason: w });
    const { width: g } = Ge(o), y = Ln({ x: Y.x + g + 32, y: a.y ?? Y.y, width: a.width ?? 0, height: a.height ?? 0 }), O = Math.round(y.x), P = Math.round(y.y);
    s.position(O, P, () => e.updateSelectionResizeRotate?.(), void 0, ft() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Vt({ ...s.options, x: O, y: P })] });
  }, Oe.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...Be], lines: (o.lines ?? []).map((s) => ({ ...s })) }), Oe.onUndoRestore = (s, a) => {
    if (A) return;
    const d = new Map((s?.cards ?? []).map((u) => [u.id, u])), f = new Map(s?.pairs ?? []), m = (u) => Be.get(u) ?? f.get(u) ?? u;
    for (const u of a.added) {
      const w = m(u), g = o.cards.find((O) => O.id === w);
      if (!g || d.has(w)) continue;
      o = X({ ...o, cards: o.cards.filter((O) => O !== g), lines: wn(o.lines, w, u) }), B(o);
      const y = K(t.onChange, o, { cardId: w, cardToNote: { noteId: u }, via: "undo" });
      e.holdTrade?.(u, y), no(y);
    }
    for (const u of a.removed) {
      const w = m(u), g = d.get(w);
      if (!g || o.cards.some((W) => W.id === w)) continue;
      const y = (s?.lines ?? []).filter((W) => W.parentId === w || W.childId === w), O = ko(o, g), P = {
        id: w,
        label: O,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...y.length ? { lines: y } : {}
      }, N = [g.laneId, ...o.lanes.map((W) => W.id)].find((W) => Hn(o, W, P));
      if (!N) {
        e.announce?.(`${Z(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = Ni(Hn(o, N, P), w, s?.cards ?? []), w !== u && Be.set(u, w), B(o);
      const U = o.cards.findIndex((W) => W.id === w), R = o.cards.slice(U + 1).find((W) => W.laneId === N)?.id, H = K(t.onChange, o, { cardId: w, laneId: N, noteToCard: {
        noteId: u,
        label: O,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...R ? { before: R } : {},
        ...y.length ? { lines: wn(y, w, u) } : {}
      }, via: "undo" });
      e.holdTrade?.(u, H), no(H);
    }
    for (const u of d.values()) {
      const w = o.cards.find((O) => O.id === u.id);
      if (!w || w.label === u.label || dn.get(u.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: u.id }, label: u.label }], y = $e(o, g);
      "refused" in y || (o = y.workshop, dn.set(u.id, u.label), B(o), e.announce?.(`${Z(w)} is called ${Z(u)} again.`), K(t.onChange, o, { rename: { cardId: u.id, label: u.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && Mi(s.lines);
  };
  let _t = !1;
  Oe.onNodeAdded = (s) => {
    A || _t || S.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (_t = !0, queueMicrotask(() => {
      _t = !1, A || _e();
    }));
  }, Oe.onLine = (s, a) => {
    A || queueMicrotask(() => {
      A || Pi(s, a);
    });
  };
  const xi = e.setDragPolicy(Oe), Rt = {
    verdict(s, a) {
      if (!Tn()) return null;
      const d = On(a);
      if (!d) return null;
      const f = Pn(s), m = i?.noteUnder?.(o, en(a), ae);
      return m && (f.under = m), { laneId: d, laneLabel: o.lanes.find((u) => u.id === d).label, reason: En(s) ?? tn(o, d, f) };
    },
    take: (s, a, d) => Oe.onFreeDrop?.(s, a, d),
    flash(s, a) {
      A || !o.lanes.some((d) => d.id === s) || (ie(!1), oe = { laneId: s, reason: a, timer: setTimeout(() => ie(), 1500) }, _e());
    }
  };
  Bn.has(e) || Bn.set(e, /* @__PURE__ */ new Set()), Bn.get(e).add(Rt);
  const Ii = t.onSelect || h || t.onRuleEdit ? e.onSelectionChange?.(() => {
    cn(), or(), Xn === "selected" && hn();
  }) : void 0;
  let tt = null;
  const Ro = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, f = d && S.has(d) ? nr(d) : null;
    f !== tt && (tt = f, or());
  };
  h && e.element?.addEventListener?.("pointerover", Ro);
  const Wo = (s) => {
    if (q && ze(), k && !s?.target?.closest?.("[data-board-pick]") && (k = null, Ce && pn(Ce), queueMicrotask(cn)), $n = null, Xe && (clearTimeout(Xe), Xe = null), !s || A || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((u) => le(ee.lane(u.id))));
    if ((e.getSelectedNodes?.() ?? []).some((u) => !a.has(u?.id))) return;
    const d = o.lanes.flatMap((u) => [ee.caption(u.id), ee.column(u.id)]).map((u) => S.get(le(u))).filter(Boolean), f = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), d, { padding: 0 }) : null, m = f ? me(f.id) : null;
    m && ($n = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, Fo = (s) => {
    const a = $n;
    $n = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (Xe = setTimeout(() => {
      if (Xe = null, A || M || b || !o.lanes.some((f) => f.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = S.get(le(ee.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, Do = () => {
    $n = null;
  };
  e.element?.addEventListener?.("pointerdown", Wo, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Fo, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", Do, !0), ji(), B(o, { animate: !1 });
  function jo(s, a, d) {
    const f = o.cards.find((P) => P.id === s);
    if (!f) return { kind: "outside" };
    if (i) {
      const P = en(a), N = i.refusalAt(o, s, M?.grab ?? { x: 0, y: 0 }, P, ae);
      if (N && !N.lands) return { kind: "refused", laneId: N.laneId, reason: N.reason, ...N.override && { override: N.override } };
      const { width: U, height: R } = Ge(o), H = P.y >= 0 && P.y <= R;
      if (N?.override && H && (P.x < -40 || P.x > U + 40)) return { kind: "refused", laneId: N.laneId, reason: N.reason, override: N.override };
      if (P.x < -40 || P.y < -40 || P.x > U + 40 || P.y > R + 40) return { kind: "outside" };
      let W = o;
      try {
        W = d?.(P) ?? o;
      } catch (ne) {
        console.warn("WORKSHOP: the board kit's chooser threw", ne);
      }
      return JSON.stringify(W) === JSON.stringify(o) ? N ? { kind: "refused", laneId: N.laneId, reason: N.reason, near: !0, ...N.override && { override: N.override } } : { kind: "home" } : { kind: "candidate", laneId: W.cards.find((ne) => ne.id === s)?.laneId ?? f.laneId, next: W, ...N && { said: N.reason } };
    }
    const m = o.lanes.map((P) => S.get(le(ee.column(P.id)))).filter(Boolean), u = e.hitTestNodes(a, m, { padding: 6 }), w = u ? me(u.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === f.laneId) return { kind: "home" };
    const g = rn(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: je(o, s, w) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: w, next: g };
    let y = null;
    try {
      y = d({ x: a.x - Y.x, y: a.y - Y.y });
    } catch (P) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", P), { kind: "candidate", laneId: w, next: g };
    }
    const O = y?.cards.find((P) => P.id === s)?.laneId;
    return !y || !O || O === f.laneId ? { kind: "home" } : { kind: "candidate", laneId: O, next: y };
  }
  function Ai() {
    return i ? !1 : new Set(De(o, { layout: ae }).places.map((s) => s.row)).size > 1;
  }
  function Bo(s, a, d = !1) {
    const f = o.cards.find((R) => R.id === s), m = Ir(o, s), u = q?.cardId === s && q.laneId === null ? q.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const R = u > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (ze(), R.id === f.laneId) {
        He(R.id, L ?? o), e.announce?.(`${Z(f)} is back in ${R.label}.`);
        return;
      }
      if (m.includes(R)) {
        const W = rn(o, s, R.id);
        q = { cardId: s, laneId: R.id, next: W }, B(W), He(R.id, W), K(t.onPreview, W), e.announce?.(`${Z(f)} to ${R.label}: ${Ue(W, R.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const H = je(o, s, R.id) ?? "That move is not available.";
      ie(), oe = { laneId: R.id, reason: H, timer: setTimeout(() => ie(), 1500) }, B(L ?? o), He(R.id, L ?? o), e.announce?.(`${Z(f)} can't move to ${R.label}. ${H}`), K(t.onRefuse, { cardId: s, laneId: R.id, reason: H });
      return;
    }
    const w = q?.cardId === s ? q.laneId : f.laneId;
    let g;
    if (d) {
      const { places: R } = De(o, { layout: ae }), H = R.find((W) => W.laneId === w);
      g = R.filter((W) => W.column === H.column && (W.row - H.row) * a > 0).sort((W, ne) => (W.row - ne.row) * a).map((W) => o.lanes.find((ne) => ne.id === W.laneId));
    } else {
      const R = o.lanes.findIndex((H) => H.id === w);
      g = a > 0 ? o.lanes.slice(R + 1) : o.lanes.slice(0, R).reverse();
    }
    const y = g[0] && !m.includes(g[0]) ? g[0] : null, O = y !== null && Me?.cardId === s && Me.laneId === y.id;
    if (Me = null, y && !O) {
      const R = je(o, s, y.id) ?? "That move is not available.", H = i ? { edit: { kind: "move_card", card: { id: s }, lane: { id: y.id } } } : void 0;
      if (!!t.confirmOverride && !x && !L && !Ne() && (i ? !("refused" in $e(o, [{ ...H.edit, override: !0 }], { actor: { by: "check", via: "chat" } })) : Kn(o, s, y.id, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) !== null)) {
        ie(), ze(), oe = { laneId: y.id, reason: R, timer: setTimeout(() => ie(), 1500) }, B(L ?? o), He(y.id, L ?? o), e.announce?.(`${Z(f)} can't move to ${y.label} by this board's rules. ${R} Move it anyway? Cancel, then press the arrow again to pass over it.`), Me = { cardId: s, laneId: y.id }, Rn(s, y.id, R, H);
        return;
      }
    }
    const P = g.find((R) => m.includes(R)), N = y && P ? `${Z(f)} can't go in ${y.label}: ${je(o, s, y.id) ?? "that move is not available."} ` : "";
    if (ie(), !P) {
      const R = g[0];
      if (!R) {
        if (!d && to()) {
          const W = gt(o, s);
          if (W) {
            e.announce?.(W), K(t.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          Si(f, a);
          return;
        }
        e.announce?.(`${Z(f)} has no lane to move to on that side.`);
        return;
      }
      const H = je(o, s, R.id) ?? "That move is not available.";
      oe = { laneId: R.id, reason: H, timer: setTimeout(() => ie(), 1500) }, B(q?.next ?? L ?? o), He(R.id, q?.next ?? L ?? o), e.announce?.(`${Z(f)} can't move to ${R.label}. ${H}`), K(t.onRefuse, { cardId: s, laneId: R.id, reason: H });
      return;
    }
    if (P.id === f.laneId) {
      ze(), He(P.id, L ?? o), e.announce?.(`${Z(f)} is back in ${P.label}.`);
      return;
    }
    const U = rn(o, s, P.id);
    q = { cardId: s, laneId: P.id, next: U }, B(U), He(P.id, U), K(t.onPreview, U), e.announce?.(`${N}${Z(f)} to ${P.label}: ${Ue(U, P.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function He(s, a = o) {
    const d = i ? Bi(a, ee.column(s)) : De(a, { layout: ae, rows: Xo() }).places.find((y) => y.laneId === s), f = e.canvas?.viewbox?.();
    if (!d || !f || !(f.width > 0) || !(f.height > 0)) return;
    const m = 16, u = (y, O, P, N) => O + m * 2 >= N || y - m < P ? y - m - P : y + O + m > P + N ? y + O + m - (P + N) : 0, w = u(Y.x + d.x, d.width, f.x, f.width), g = u(Y.y + d.y, d.height, f.y, f.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function cn() {
    if (!t.onSelect || et) return;
    const s = A ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && S.get(s[0].id) === s[0] ? me(s[0].id) : null;
    k && s.some((w) => !$.has(w.id)) && (k = null, Ce && pn(Ce));
    const [d, f] = k ? k.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : d && f && !a ? { path: { from: d, to: f } } : null, u = m ? JSON.stringify(m) : null;
    u !== No && (No = u, K(t.onSelect, m));
  }
  function Ho() {
    ue && (ue = null, B(o), K(t.onPreview, null));
  }
  function ze() {
    q && (q = null, K(t.onPreview, null), B(L ?? o));
  }
  function Si(s, a) {
    const { width: d } = Ge(o), f = S.get(le(ee.card(s.id)))?.options, m = f?.width ?? 228, u = Ln({
      x: a > 0 ? Y.x + d + 32 : Y.x - m - 32,
      y: f?.y ?? Y.y,
      width: m,
      height: f?.height ?? 76
    }, a), w = Cr(o, s.id);
    q = { cardId: s.id, laneId: null, side: a, spot: u, next: o }, B(o), K(t.onPreview, w), e.announce?.(`${Z(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ne() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Tn() {
    return !A && !x && !L && !M && !Ne() && to();
  }
  function Wt() {
    Q && (Q = null, A || _e());
  }
  function On(s) {
    const a = o.lanes.map((f) => S.get(le(ee.column(f.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? me(d.id)?.key ?? null : null;
  }
  function Pn(s) {
    const a = s.options ?? {}, d = Xr({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), f = String(a.text ?? ""), m = f.replace(/\s+/g, " ").trim(), u = {};
    f.trim() !== m && f.length <= 4e3 && (u.text = f.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (u[g] = Math.round(a[g]));
    if (mo(a.image)) {
      u.image = { src: a.image };
      for (const [g, y] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[y]) && a[y] >= 1 && a[y] <= 2e4 && (u.image[g] = a[y]);
    }
    a.link?.data && xr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = Ci(s);
    return { id: s.id, label: m, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...w.length ? { lines: w } : {} };
  }
  function Ci(s) {
    const a = /* @__PURE__ */ new Map(), d = (f) => typeof f == "string" && !!S.get(f) && S.get(f) === e.nodes.one(f);
    for (const f of s.relationships?.getAssociations?.() ?? [])
      (f.targetPoint || !d(f.childId)) && a.set(f.id, Nn(f));
    for (const f of e.nodes?.allNodes ?? [])
      if (!(f === s || d(f.id)))
        for (const m of f.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, Nn(m));
    for (const f of oo(o, s.id)) a.set(f.id, f);
    return [...a.values()];
  }
  function zo(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function $i(s, a) {
    for (const { node: u } of s) {
      const w = En(u);
      if (w) return w;
    }
    const d = o.lanes.find((u) => u.id === a), f = Ye(o, a);
    if (d.capacity !== void 0 && !d.station && f + s.length > d.capacity) {
      const u = d.capacity - f;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${f} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: u } of s) {
      const w = tn(m, a, u);
      if (w) return w;
      m = Hn(m, a, u);
    }
    return null;
  }
  function En(s) {
    if (s.options?.image && !mo(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !xr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : Li(s) ? eo : null;
  }
  function un(s) {
    return !!s && S.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function Li(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && un(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !un(a))) {
        for (const d of a.relationships?.getAssociations?.() ?? []) if (d.childId === s.id && !d.targetPoint) return !0;
      }
    return !1;
  }
  const Ft = (s) => s || "This note", Z = (s) => s.label || "The empty card", Go = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : Ls[a] ?? "shape";
  }, Dt = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Uo = (s) => {
    const a = s.flatMap((d) => {
      const f = Go(d.asNote?.shape);
      return f ? [{ card: d, word: f }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Dt(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: f }) => f === "shape" ? `${Z(d)} had its own shape` : `${Z(d)} was ${Dt(f)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, Ti = (s) => {
    const a = Go(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Dt(a)} again.` : "";
  };
  function Mn() {
    return !A && !x && !L && !Ne() && Js(o);
  }
  function Nn(s) {
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
  function Ko(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function qo(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (S.get(s.id) === s) {
      const a = me(s.id);
      return a?.kind === "card" && o.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || un(s) ? null : s.id;
  }
  function jt(s, a) {
    if (s.cards.some((f) => f.id === a)) {
      const f = S.get(le(ee.card(a)));
      return f?.relationships && f.svgGroup ? f : null;
    }
    const d = e.nodes.one(a);
    return d && S.get(a) !== d && !un(d) && d.svgGroup ? d : null;
  }
  function Jo(s) {
    const a = [];
    for (const d of s) {
      const f = e.nodes.one(d.parentId);
      if (!f?.relationships || S.get(f.id) === f || f.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const w = f.relationships.addFloatingAssociation(d.targetPoint, jn(d));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(d.childId);
      if (!m || S.get(m.id) === m) continue;
      const u = f.relationships.addAssociation(m, jn(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function Oi(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const N = jt(s, d.parentId);
        if (!N || S.get(N.id) !== N) continue;
        const U = { ...d, parentId: N.id }, R = JSON.stringify(U);
        a.add(d.id);
        const H = we.get(d.id);
        if (H && H.key === R && H.holder === N && !H.other && N.relationships.hasAssociationId?.(d.id)) continue;
        H && e.nodes.one(H.holder.id) === H.holder && H.holder.relationships?.removeAssociation?.(d.id), N.relationships.addFloatingAssociation(d.targetPoint, jn(U)), we.set(d.id, { holder: N, other: null, swapped: !1, key: R });
        continue;
      }
      const f = jt(s, d.parentId), m = jt(s, d.childId);
      if (!f || !m || f === m) continue;
      const u = S.get(f.id) !== f, w = u ? m : f, g = u ? f : m, y = u ? Ko({ ...d, parentId: w.id, childId: g.id }, d) : { ...d, parentId: w.id, childId: g.id }, O = JSON.stringify(y);
      a.add(d.id);
      const P = we.get(d.id);
      P && P.key === O && P.holder === w && P.other === g && w.relationships.hasAssociationId?.(d.id) || (P && e.nodes.one(P.holder.id) === P.holder && P.holder.relationships?.removeAssociation?.(d.id), w.relationships.addAssociation(g, jn(y)), we.set(d.id, { holder: w, other: g, swapped: u, key: O }));
    }
    for (const [d, f] of [...we])
      a.has(d) || (e.nodes.one(f.holder.id) === f.holder && f.holder.relationships?.hasAssociationId?.(d) && f.holder.relationships.removeAssociation(d), we.delete(d));
  }
  function ot(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let _n = null;
  function Pi(s, a) {
    if (s === "addRelationship") {
      if (we.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, f = e.nodes.one(a?.parentId), m = d ? null : e.nodes.one(a?.childId), u = qo(f), w = d ? null : qo(m);
      if (un(f)) return;
      const g = _n?.lineId === a?.id ? o.lines?.find((U) => U.id === a?.id) : void 0;
      g && (_n = null);
      const y = (U) => {
        ot(a), g && B(L ?? o), e.announce?.(U), K(t.onRefuse, { reason: U, laneId: null });
      };
      if (!Mn()) {
        ot(a), g && B(L ?? o);
        return;
      }
      if (un(m)) return y(eo);
      if (!u || !w && !d) return y(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const O = d ? String(a.childId) : w;
      if (g) {
        const U = o.cards.some((ne) => ne.id === u), R = !d && o.cards.some((ne) => ne.id === w);
        if (!U && !R) return Qe({ remove: g.id });
        const H = { ...Nn(a), id: g.id, parentId: u, childId: O }, W = Gn(o, H);
        if (W) return y(W);
        ot(a), Qe({ set: H });
        return;
      }
      const P = ui(o, u, O, Nn(a)), N = Gn(o, P);
      if (N) return y(N);
      ot(a), Qe({ set: P });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...we].find(([m, u]) => (m === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const f = we.get(d);
      if (we.delete(d), e.nodes.one(f.holder.id) !== f.holder || f.other && e.nodes.one(f.other.id) !== f.other || !Mn())
        return Mn() || A ? void 0 : B(L ?? o);
      _n = { lineId: d }, queueMicrotask(() => {
        A || _n?.lineId !== d || (_n = null, Qe({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const f = [...we].find(([P, N]) => P === d?.associationId && N.holder.id === d?.id);
        if (!f) continue;
        const [m, u] = f, w = o.lines?.find((P) => P.id === m), g = u.holder.relationships?.getAssociations?.().find((P) => P.id === m);
        if (!w || !g) continue;
        if (!Mn()) {
          B(L ?? o);
          continue;
        }
        const y = Nn(g), O = u.swapped ? Ko({ ...y, id: w.id, parentId: w.parentId, childId: w.childId }, y) : { ...y, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(Ei(O)) !== JSON.stringify(w) && (we.set(m, { ...u, key: "" }), Qe({ set: O }));
      }
  }
  function Ei(s) {
    return yt({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function Qe(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? yt(o, s.set) : $r(o, s.remove);
    if (!d || d === o) return;
    e.beginHostStep?.(), o = d, e.endHostStep?.(), B(L ?? o);
    const f = "set" in s ? s.set : a, m = [f.parentId, f.childId].map((g) => o.cards.find((y) => y.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (g) => m[g] || (g === 1 && f.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${u(0)} to ${u(1)} changed.` : f.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const w = K(t.onChange, o, { line: s });
    no(w, () => {
      if (A || o !== d) return;
      const g = a ? yt(o, a) : "set" in s ? $r(o, s.set.id) : null;
      g && (o = g, B(L ?? o));
    });
  }
  function Mi(s) {
    const a = new Map(s.map((f) => [f.id, f])), d = new Map((o.lines ?? []).map((f) => [f.id, f]));
    for (const f of d.keys()) a.has(f) || Qe({ remove: f });
    for (const [f, m] of a)
      JSON.stringify(d.get(f)) !== JSON.stringify(m) && Gn(o, m) === null && Qe({ set: m });
  }
  function Bt(s, a) {
    let d = o;
    const f = /* @__PURE__ */ new Map(), m = s.map(({ node: y, offer: O, from: P }) => {
      let N = O.lines;
      for (const [H, W] of f) N = wn(N, H, W);
      d = Hn(d, a, { ...O, ...N ? { lines: N } : {} });
      const U = d.cards[d.cards.length - 1];
      U.id !== y.id && f.set(y.id, U.id);
      const R = { ...y.options ?? {}, ...P ? { x: P.x, y: P.y } : {} };
      return { node: y, card: U, kept: R, lines: wn(N ?? [], y.id, U.id), under: O.under, day: O.day };
    });
    e.beginHostStep?.(), o = d;
    let u = o;
    for (const { node: y, card: O } of m)
      O.id !== y.id && Be.set(y.id, O.id), Ze.set(le(ee.card(O.id)), { x: y.options?.x ?? 0, y: y.options?.y ?? 0 }), fn(() => e.removeNode(y.id));
    e.endHostStep?.(), B(o), _i(le(ee.card(m[0].card.id)));
    const w = m.length === 1 && Sr(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && Ri(le(ee.card(w.id)), w.label);
    const g = o.lanes.find((y) => y.id === a);
    e.announce?.(m.length === 1 ? `${Z(m[0].card)} is now a card in ${g.label}. ${Ue(o, a)}.${Uo([m[0].card])}` : `${zo(m.map(({ card: y }) => Z(y)))} are now cards in ${g.label}. ${Ue(o, a)}.${Uo(m.map(({ card: y }) => y))}`);
    for (const { node: y, card: O, kept: P, lines: N, under: U, day: R } of m) {
      const H = { cardId: O.id, laneId: a, noteToCard: {
        noteId: y.id,
        label: ko(o, O),
        ...U && { under: U },
        ...R !== void 0 && { day: R },
        ...O.look ? { look: O.look } : {},
        ...O.asNote ? { asNote: O.asNote } : {},
        ...N.length ? { lines: N } : {}
      } }, W = () => {
        o !== u || !o.cards.some((ke) => ke.id === O.id) || (o = X({ ...o, cards: o.cards.filter((ke) => ke.id !== O.id), lines: wn(o.lines, O.id, y.id) }), u = o, B(o));
      }, ne = K(t.onChange, o, H);
      e.holdTrade?.(y.id, ne), Zo(ne, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: y.id, isComment: !1 } }]);
      }, () => {
        if (!A) {
          if (W(), !e.nodes.one(P.id)) {
            e.beginHostStep?.();
            const ke = fn(() => e.addNode({ ...P }));
            ke && (ke.announcedByCreator = !0), e.endHostStep?.();
            const Wn = wn(N, O.id, y.id).filter((de) => !o.cards.some((Fn) => Fn.id === de.parentId || Fn.id === de.childId));
            ke?.ready?.then?.(() => {
              A || fn(() => Jo(Wn));
            });
          }
          e.announce?.(`${Z(O)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        A || (W(), e.keepTrade?.(y.id), e.announce?.(`Someone else put ${Z(O)} on the board first.`));
      });
    }
  }
  function Yo(s, a) {
    const d = o.cards.find((P) => P.id === s), f = T.get(le(ee.card(s))) ?? {}, m = Yr(d), u = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = (Et.cornerRadius ?? 0) > 0, g = d.asNote, y = Sr(o, d), O = {
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
    for (const P of Object.keys(O)) O[P] === void 0 && delete O[P];
    return { id: u, note: O };
  }
  function rt(s, a, d = "", f = !1) {
    const m = o.cards.find((de) => de.id === s), u = o.lanes.find((de) => de.id === m.laneId), w = o.cards.findIndex((de) => de.id === s), g = o.cards.slice(w + 1).find((de) => de.laneId === m.laneId)?.id, { id: y, note: O } = Yo(s, a), P = m.asNote, N = oo(o, s), { leave: U } = Xs(o, s, y), R = Cr(o, s, y);
    e.beginHostStep?.(), o = R;
    const H = o;
    y !== s ? Be.set(y, s) : Be.delete(y);
    const W = fn(() => e.addNode(O));
    W && (W.announcedByCreator = !0), e.endHostStep?.(), B(o);
    const ne = Promise.resolve(W?.ready).then(() => A || !W || e.nodes.one(y) !== W ? [] : fn(() => Jo(U))).catch(() => []);
    W?.ready?.then?.(() => {
      if (A || e.nodes.one(y) !== W) return;
      const de = () => e.selectNodes?.([W]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(de) : de();
    }), f || e.announce?.(`${Z(m)} is now a note on the canvas.${d} ${u.label}: ${Ue(o, u.id)}.${Ti(P?.shape)}`);
    const ke = () => {
      e.nodes.one(y) === W && (e.beginHostStep?.(), fn(() => e.removeNode(y)), e.endHostStep?.());
    }, Wn = K(t.onChange, o, { cardId: s, cardToNote: { noteId: y } });
    return e.holdTrade?.(y, Wn), Zo(Wn, () => {
      ne.then((de) => {
        W && e.nodes.one(y) === W && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: Vt(W.options) } }, ...de]);
      });
    }, () => {
      if (!A) {
        if (ke(), o === H && !o.cards.some((de) => de.id === s)) {
          const de = {
            id: s,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ...N.length ? { lines: N } : {}
          }, Fn = Hn(o, m.laneId, de, g);
          Fn && (o = Fn, B(o));
        }
        e.announce?.(`${Z(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      A || (ke(), e.keepTrade?.(y), e.announce?.(`Someone else took ${Z(m)} off the lanes first.`));
    }), { added: W, answer: Wn };
  }
  function Ni(s, a, d) {
    const f = d.map((y) => y.id), m = f.indexOf(a), u = s.cards.find((y) => y.id === a);
    if (m < 0 || !u) return s;
    const w = s.cards.filter((y) => y !== u), g = w.findIndex((y) => f.indexOf(y.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, u), X({ ...s, cards: w });
  }
  function _i(s) {
    xe = xe.then(() => {
      const a = S.get(s);
      if (A || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Ri(s, a) {
    xe = xe.then(() => {
      const d = S.get(s);
      A || x || !d?.editor?.startInline || d.editor.startInline({ text: a, caret: "all" });
    });
  }
  function fn(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Zo(s, a, d, f) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && f();
    }, () => d());
    e.holdUntil?.(m);
  }
  function Rn(s, a, d, f) {
    if (!t.confirmOverride || x || L || Ne()) return;
    const m = { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }, u = (R, H) => {
      if (!f) {
        const ne = Kn(R, s, a, H);
        return ne && { next: ne };
      }
      const W = $e(R, [{ ...f.edit, override: !0 }], { actor: { by: H.by, via: "chat" }, now: H.at });
      return "refused" in W ? null : { next: W.workshop, said: W.report.edits.map((ne) => ne.said).join(" ") };
    }, w = u(o, m);
    if (!w) return;
    const g = o.cards.find((R) => R.id === s), y = o.lanes.find((R) => R.id === a);
    if (!g) return;
    const O = w.next.cards.find((R) => R.id === s)?.override?.sentence ?? d, P = f?.to ?? (f && i?.overrideWords?.(o, f.edit));
    let N;
    const U = { cardId: s, laneId: a, card: g.label, lane: y?.label ?? "", reason: O, ...P && { to: P } };
    try {
      N = t.confirmOverride(U);
    } catch (R) {
      console.error("WORKSHOP: confirmOverride threw", R);
      return;
    }
    Promise.resolve(N).then((R) => {
      if (R !== !0 || A || x || L || Ne()) return;
      const H = o.cards.find((ke) => ke.id === s), W = H && u(o, { by: K(t.overrideBy) || "You", at: (/* @__PURE__ */ new Date()).toISOString() });
      if (!H || !W) {
        e.announce?.(`${H ? Z(H) : "That card"} can't be moved ${P ?? "to " + (y?.label ?? "there")} now.`);
        return;
      }
      o = W.next, B(o), e.announce?.(W.said ?? `${Z(H)} moved to ${y?.label ?? ""} anyway. ${O}`);
      const ne = o.cards.find((ke) => ke.id === s)?.laneId ?? a;
      K(t.onChange, o, { cardId: s, laneId: ne, override: !0, reason: O, ...f && { edits: [{ ...f.edit, override: !0 }] } });
    }, () => {
    });
  }
  function Wi(s, a, d) {
    ie(!1), oe = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => ie(), 1500) }, B(o, { skip: a.cardId });
    const f = o.lanes.find((m) => m.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move ${d ?? "to " + (f?.label ?? "that lane")}. ${a.reason}`), K(t.onRefuse, a);
  }
  function ie(s = !0) {
    oe && (clearTimeout(oe.timer), oe = null, s && !A && _e());
  }
  function _e() {
    B(M && M.outcome.kind === "candidate" ? M.outcome.next : q?.next ?? L ?? o, { skip: M?.cardId });
  }
  function Vo(s) {
    const a = rr(s, Xo()), d = new Map(a.map((u) => [u.options.id, u.options])), f = (u, w, g, y = !1) => {
      const O = d.get(ee.column(u));
      O && (O.borderColor = w, O.borderWidth = g, delete O.borderStyle);
      const P = y && d.get(ee.lane(u));
      P && (P.borderColor = w, P.borderWidth = g);
    }, m = M?.cardId ?? q?.cardId;
    if (Te = /* @__PURE__ */ new Map(), m) {
      const u = o.cards.find((y) => y.id === m)?.laneId, w = Ir(o, m);
      if (!i || i.laneCues)
        for (const y of w) y.id !== u && (f(y.id, kr, 2), Te.set(y.id, "open"));
      if (i?.laneCues) {
        for (const y of o.lanes) if (!w.includes(y)) {
          const O = d.get(ee.column(y.id));
          O && (O.backgroundColor = "#e9e8e2"), Te.set(y.id, "closed");
        }
      }
      const g = M ? M.outcome : q?.laneId ? { kind: "candidate", laneId: q.laneId } : null;
      g?.kind === "candidate" && (f(g.laneId, yr, 3, !0), Te.set(g.laneId, "over")), g?.kind === "refused" && (f(g.laneId, Qt, 3), Te.set(g.laneId, "refused"));
    }
    if (Q && !m) {
      for (const u of Q.open) u !== Q.laneId && (f(u, kr, 2), Te.set(u, "open"));
      Q.laneId && !Q.refusal && (f(Q.laneId, yr, 3, !0), Te.set(Q.laneId, "over")), Q.laneId && Q.refusal && (f(Q.laneId, Qt, 3), Te.set(Q.laneId, "refused"));
    }
    if (q?.laneId === null && q.spot) {
      const u = d.get(ee.card(q.cardId));
      u && (u.xPos = q.spot.x, u.yPos = q.spot.y);
    }
    if (oe) {
      Te.set(oe.laneId, "refused"), f(oe.laneId, Qt, 3, !0);
      const u = d.get(ee.caption(oe.laneId));
      if (u && (u.text = oe.reason, u.foregroundColor = "#b42318", !i)) {
        const w = d.get(ee.column(oe.laneId));
        w && (u.xPos = w.xPos + 6, u.width = w.width - 12, u.height = 30, u.vectorPath = vn(u.width, 30, 0), u.backgroundColor = "transparent");
      }
    }
    if (Mt = /* @__PURE__ */ new Set(), L && s === L) {
      const u = (g, y) => JSON.stringify(g) === JSON.stringify(y), w = (g) => {
        const y = d.get(g);
        y && (y.borderStyle = "dashed", y.borderColor = $s, y.borderWidth = 2, Mt.add(le(g)));
      };
      for (const g of s.cards) u(g, o.cards.find((y) => y.id === g.id)) || w(ee.card(g.id));
      for (const g of s.lanes) u(g, o.lanes.find((y) => y.id === g.id)) || w(ee.lane(g.id));
    }
    for (const u of a) {
      u.options.id = le(u.options.id);
      for (const w of u.relationships.associations)
        w.parentId = le(w.parentId), w.childId = le(w.childId);
    }
    return a;
  }
  function Xo() {
    return M || q ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function B(s, a = {}) {
    if (A) return;
    Ae = a.layout ?? ae, Vn = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Vo(s), f = [];
    for (const { options: u } of d) {
      const w = u.id;
      if (S.has(w)) continue;
      const g = Ze.get(w);
      Ze.delete(w);
      const y = g && a.animate !== !1 && !ft() ? { ...u, xPos: g.x, yPos: g.y } : u, O = e.nodes.add(ls(y));
      S.set(w, O), T.set(w, { ...y }), O.ready && f.push(O.ready.then(() => {
        if (S.get(w) !== O) return;
        O.applyGovernance?.(), me(w)?.kind === "column" && O.toBack?.(!1), me(w)?.kind === "handle" && O.svgGroup?.front?.();
        const P = ir(Vn?.model ?? s, w);
        P && O.svgGroup?.node?.setAttribute("aria-label", P);
      }).catch(() => {
      }));
    }
    const m = Vn;
    xe = Promise.all([xe, ...f]).then(() => {
      A || Vn !== m || Fi(Vo(m.model), m);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function Fi(s, a) {
    const d = new Set(s.map((m) => m.options.id)), f = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [u, w] of [...S]) {
        if (d.has(u)) continue;
        for (const [y, O] of [..._])
          O.parentId !== u && O.childId !== u || (O.parent.relationships?.removeAssociation(y), _.delete(y));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), S.delete(u), T.delete(u);
        const g = j.get(u);
        g && (j.delete(u), D.delete(g)), e.nodes.remove(u);
      }
      for (const { options: u } of s) {
        const w = u.id, g = S.get(w);
        if (!g?.svgGroup) continue;
        const y = T.get(w) ?? {}, O = g.editor?.isInlineEditing?.();
        (u.fontSize !== y.fontSize || u.foregroundColor !== y.foregroundColor) && (g.options.fontSize = u.fontSize, g.options.fontColor = u.foregroundColor, g.applyTextStyle?.()), (u.width !== y.width || u.height !== y.height) && (u.vectorPath ? (g.options.width = u.width, g.options.height = u.height, g.setShape?.(g.options.shape, u.vectorPath), me(w)?.kind === "column" && g.toBack?.(!1)) : g.setSize?.(u.width, u.height)), u.text !== y.text && !O && g.setText?.(u.text), u.backgroundColor !== y.backgroundColor && g.setColors?.(u.backgroundColor), (u.borderColor !== y.borderColor || u.borderWidth !== y.borderWidth || u.borderStyle !== y.borderStyle) && (g.options.borderColor = u.borderColor, g.options.borderWidth = u.borderWidth, g.options.borderStyle = u.borderStyle, g.applyBorder?.());
        const P = u.xPos !== y.xPos || u.yPos !== y.yPos || Math.abs((g.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - u.yPos) > 0.5;
        if (w !== (a.skip && le(ee.card(a.skip))) && w !== (a.grip && le(a.grip)) && P) {
          const R = a.animate && !ft() ? 180 : 0, H = f.includes(g) ? () => {
            !A && S.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          H && R && f.length === 1 && g.resizeRotate?.disable?.(), g.position(u.xPos, u.yPos, H, void 0, R);
        }
        const N = ir(a.model, w);
        N && g.svgGroup.node.getAttribute("aria-label") !== N && g.svgGroup.node.setAttribute("aria-label", N), Mt.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", Se), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", F);
        const U = me(w);
        if (U?.kind === "column") {
          const R = Te.get(U.key);
          R ? g.svgGroup.node.setAttribute("data-workshop-drop", R) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        U?.kind === "handle" && g.svgGroup.front?.(), T.set(w, { ...u });
      }
      const m = /* @__PURE__ */ new Map();
      for (const u of s) for (const w of u.relationships.associations) m.set(w.id, w);
      for (const [u, w] of [..._])
        m.has(u) && S.get(w.parentId) === w.parent && S.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(u), _.delete(u));
      for (const [u, w] of m) {
        if (_.has(u)) continue;
        const g = S.get(w.parentId), y = S.get(w.childId);
        !g?.relationships || !y?.svgGroup || (g.relationships.addAssociation(y, jn(w)), _.set(u, { parentId: w.parentId, childId: w.childId, parent: g, child: y }));
      }
      Oi(a.model);
    }), pn(a.model), Ht = a.model, zt(), e.notifyNodeChanged?.();
  }
  let Ht = null;
  function it() {
    return !!Ae.narrow || Ae.lanesPerRow === 1;
  }
  function Qo() {
    let s;
    try {
      s = da(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: Ae, focused: Se, draft: F, scale: C, tagScale: I, narrow: it(), room: s };
  }
  function er() {
    if (J) return [1, 1];
    const s = Kt(), a = jr(s);
    return [a, Math.round(lo(s, it() && !F, a) * 20) / 20];
  }
  function zt() {
    if (!p || A) return;
    [C, I] = er();
    const s = Ht ?? o, a = i ? i.places(s, Ae) : De(s, { layout: Ae }), d = i || s.lanes[0]?.station ? void 0 : a.places;
    let f = null;
    for (const u of S.values()) {
      const w = u.svgGroup?.node;
      w?.parentNode && (!f || w.compareDocumentPosition(f) & 4) && (f = w);
    }
    p.draw({
      board: s,
      scope: r,
      origin: Y,
      size: { width: a.width, height: a.height },
      ...Qo(),
      places: d,
      under: f,
      ...t.onFocusDone && { onDone: () => K(t.onFocusDone) }
    });
    const m = i ? a.parts.filter((u) => u.name.startsWith("column-")).map((u) => ({ laneId: u.name.slice(7), x: u.x, y: u.y, width: u.width, height: u.height, row: 0 })) : void 0;
    Nt = { places: d ?? m, width: a.width, height: a.height }, hn();
  }
  function Di() {
    return (A ? [] : e.getSelectedNodes?.() ?? []).some((a) => S.get(a.id) === a);
  }
  function hn() {
    const s = Jr, a = Ht ?? o;
    if (!!!(s && Nt && !A && !x && !F && !J && !L && Xn !== "off" && (Xn === "always" || Se || Di()))) {
      Ve?.remove(), Ve = null;
      return;
    }
    let f;
    try {
      f = s.controls(a, Nt, { scale: Math.min(2, C), finger: it() });
    } catch {
      f = [];
    }
    Ve ? Ve.update(f, Y) : Ve = s.draw(e, r ?? "main", f, {
      origin: Y,
      announce: (m) => e.announce?.(m),
      onRuleEdit: (m, u) => {
        if (A || x || !t.onRuleEdit) return !1;
        const w = K(t.onRuleEdit, m, u);
        return w instanceof Promise ? w.then(Boolean, () => !1) : !!w;
      }
    });
  }
  function ji() {
    const s = e.canvas?.node, a = er;
    if ([C, I] = a(), J || !p || !s || typeof MutationObserver > "u") return;
    let d = null;
    const f = new MutationObserver(() => {
      d && clearTimeout(d), d = setTimeout(() => {
        d = null;
        const [m, u] = a();
        A || m === C && u === I || (C = m, I = u, zt());
      }, 120);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), v = () => {
      f.disconnect(), d && clearTimeout(d);
    };
  }
  let Ce = null;
  function nr(s) {
    const a = me(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, Ie(s)) ?? null : null;
  }
  function tr() {
    if (b) return i?.cardOfPart?.(o, b.name) ?? null;
    if (M) return M.cardId;
    if (tt) return tt;
    const s = A ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && S.get(s[0].id) === s[0] ? nr(s[0].id) : null;
  }
  let Gt = null;
  function or() {
    A || !h || !Ce || tr() !== Gt && pn(Ce);
  }
  function pn(s) {
    if (h) {
      Ce = s, Gt = tr();
      const a = o.lanes.map((m) => S.get(le(ee.column(m.id)))?.svgGroup?.node).reduce((m, u) => u && (!m || m.compareDocumentPosition(u) & 4) ? u : m, null), d = e.canvas?.viewbox?.(), f = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - Y.x, y: d.y - Y.y, width: d.width, height: d.height } : null;
      h.draw(o, s === o ? null : s, {
        origin: Y,
        layout: Ae,
        above: a,
        view: f,
        announce: (m) => e.announce?.(m),
        focus: Gt,
        boardFocused: Se,
        picked: k,
        onPick: Gi,
        gripSize: Cn,
        clamp: b?.last?.clampedReason ? { name: b.name, text: b.last.clampedReason } : M?.outcome.kind === "candidate" && M.outcome.said ? { name: "card-" + M.cardId, text: M.outcome.said } : !b && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!b?.last?.refusal || !b && !!pe,
        onUnlink: (m, u) => {
          if (x || L || M || b || Ne()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: u }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: u } }, g = $e(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : at(g.workshop, o.lanes[0]?.station ? { laneId: u } : { cardId: m });
        }
      });
    }
  }
  function en(s) {
    return { x: s.x - Y.x, y: s.y - Y.y };
  }
  function Ut(s, a) {
    const d = i?.noteDay?.(o, en(a), Ae);
    return typeof d == "number" && Number.isFinite(d) && (s.day = d), s;
  }
  function Ge(s) {
    return i ? i.places(s, Ae) : { ...De(s, { layout: ae }), parts: [] };
  }
  function Bi(s, a) {
    const d = i.places(s, Ae).parts.find((f) => f.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function Kt() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function Hi() {
    Qn?.(), Qn = null, Cn = Xt(Kt());
    const s = e.canvas?.node;
    if (!st() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const d = () => {
      if (a = null, A || !st()) return;
      if (b || M) {
        a = setTimeout(d, 250);
        return;
      }
      const m = Xt(Kt());
      Math.abs(m - Cn) < 2 || (Cn = m, B(L ?? o));
    }, f = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(d, 200);
    });
    f.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), Qn = () => {
      f.disconnect(), a && clearTimeout(a);
    };
  }
  function st() {
    return !i && !!o.lanes[0]?.station && Se && !x && !L && !Ne();
  }
  function zi(s) {
    const a = Gr(s);
    if (!a || !st()) return null;
    const d = o;
    return (f) => {
      const m = xs(d, f), u = As(d, a, a.kind === "link" && m === a.from ? null : m);
      return u.next ? { next: u.next } : { next: d, clampedReason: u.refusal, refusal: u.refusal };
    };
  }
  function Gi(s) {
    if (A || Se) return;
    const a = e.getSelectedNodes?.() ?? [];
    $ = new Set(a.map((u) => u.id)), k = s, a.length && e.clearSelection?.(), Ce && pn(Ce), cn();
    const [d, f] = s.split(">"), m = (u) => o.lanes.find((w) => w.id === u)?.label ?? u;
    e.announce?.(`Path from ${m(d)} to ${m(f)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function rr(s, a) {
    if (!i) {
      const d = la(s, { native: !0, origin: Y, rows: a, layout: ae, style: Et }).nodes;
      return st() ? [...d, ...qr(o, Y, Cn)] : d;
    }
    return i.notes(s, Ae, Y, Et);
  }
  function at(s, a, d) {
    const f = i ? i.editsBetween(o, s) : Ss(o, s);
    if (!f.length) return !1;
    const m = $e(o, f);
    return "refused" in m ? (e.announce?.(m.refused.reason), K(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, B(o, { skip: d }), e.announce?.(m.report.edits.map((u) => u.said).join(" ")), K(t.onChange, o, { ...a, edits: f }), !0);
  }
  function ir(s, a) {
    const d = me(a);
    if (d?.kind === "lane" || d?.kind === "caption") {
      if (d.kind === "caption" && s.lanes.some((m) => m.station)) return null;
      const f = s.lanes.find((m) => m.id === d.key);
      return f ? `${f.label}, ${Ue(s, f.id)}` : null;
    }
    if (d?.kind === "card") {
      const f = s.cards.find((u) => u.id === d.key), m = f && s.lanes.find((u) => u.id === f.laneId);
      return f && m ? `${f.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? i ? i.label?.(s, Ie(a)) ?? null : Is(s, Ie(a)) : null;
  }
  function qt(s, a) {
    const d = rr(s).find((f) => f.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function nn() {
    (M || b) && e.cancelGovernedDrag?.("host"), M = null, b = null, q && (q = null, K(t.onPreview, null)), ie(!1);
  }
  return {
    toCanvas(s) {
      if (A || x || Ne()) return "This workshop is view-only here.";
      if (!o.cards.some((u) => u.id === s)) return "That card is no longer on the board.";
      const a = gt(o, s);
      if (a) return a;
      q && ze(), L && (nn(), L = null, B(o), e.refreshGovernance?.());
      const { width: d } = Ge(o), f = S.get(le(ee.card(s)))?.options, m = o.cards.find((u) => u.id === s);
      return rt(s, Ln({
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
      return { ...ae };
    },
    get bounds() {
      const { width: s, height: a } = Ge(o);
      return { x: Y.x, y: Y.y, width: s, height: a };
    },
    get frame() {
      const { width: s, height: a } = Ge(o);
      if (!p) return { x: Y.x, y: Y.y, width: s, height: a };
      const d = Hr(o, { width: s, height: a }, { ...Qo(), scale: 1, tagScale: lo(1, it() && !F) });
      return { x: Y.x + d.x, y: Y.y + d.y, width: d.width, height: d.height };
    },
    get focused() {
      return Se;
    },
    setFocused(s) {
      if (A) return;
      const a = Se;
      Se = !!s;
      for (const d of S.values()) d.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Se);
      a !== Se && (k && (k = null, queueMicrotask(cn)), !i && o.lanes[0]?.station ? (nn(), Hi(), B(L ?? o)) : Ce && pn(Ce), zt());
    },
    setControls(s) {
      A || (Xn = s === "always" || s === "selected" ? s : "off", hn());
    },
    setLayout(s) {
      if (A) throw new Error("This workshop has been detached.");
      const a = vr(s);
      i ? i.places(o, a) : De(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(ae) && (nn(), ae = a, B(L ?? o));
    },
    whenDrawn: () => xe,
    update(s) {
      if (A) throw new Error("This workshop has been detached.");
      const a = X(s);
      nn(), o = a;
      const d = x;
      x = l || c(o), B(L ?? o), x !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (A) throw new Error("This workshop has been detached.");
      const a = s ? X(s) : null;
      nn(), L = a, hn(), B(L ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = o.lanes.find((f) => f.id === s);
      A || !d || (ie(!1), oe = { laneId: s, reason: a, timer: setTimeout(() => ie(), 1500) }, _e(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      l = !!s;
      const a = l || c(o);
      A || x === a || (nn(), x = a, hn(), B(L ?? o), e.refreshGovernance?.());
    },
    destroy() {
      A || (nn(), A = !0, Bn.get(e)?.delete(Rt), Qn?.(), v?.(), p?.destroy(), fo.delete(_o), Ve?.remove(), Ve = null, pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", Wo, !0), Xe && clearTimeout(Xe), e.element?.ownerDocument?.removeEventListener?.("pointerup", Fo, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", Do, !0), Ii?.(), h && e.element?.removeEventListener?.("pointerover", Ro), e.withPolicyAuthority(() => {
        for (const [s, a] of we) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of _) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of S)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), _.clear(), we.clear(), S.clear(), T.clear(), D.clear(), j.clear(), xi(), h?.destroy(), et = !1, cn(), e.notifyNodeChanged?.());
    }
  };
}
function K(e, ...n) {
  try {
    return e?.(...n);
  } catch (t) {
    console.error("WORKSHOP: a host callback threw", t);
    return;
  }
}
function no(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function br(e) {
  const n = "card" in e ? e.card : null;
  return n && typeof n == "object" && typeof n.id == "string" ? n.id : null;
}
function Ps(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function vr(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function Es(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const Ms = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function te(e) {
  return Ms.includes(e.kind) ? e.kind : void 0;
}
function ge(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Le(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Ns(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = $t(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function $t(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const Lt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function ho(e) {
  if (typeof e != "string" || !Lt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function Yr(e) {
  return e.noteId ?? e.id;
}
function Tt(e) {
  const n = $t(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function Zr(e) {
  const n = ge(e);
  let t;
  try {
    t = new URL(Le(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (t.protocol !== "https:" || t.username || t.password || t.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: t.href, alt: Le(n.alt, 240) };
}
function Ee(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Vr = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, _s = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function po(e) {
  const n = ge(e), t = {}, r = (i) => {
    if (typeof i != "string" || !Vr.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, c, h) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < c || i > h) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !_s.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function Xr(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        po({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return po(n);
}
function mo(e) {
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
function xr(e) {
  try {
    return !!It({ link: e });
  } catch {
    return !1;
  }
}
function It(e) {
  const n = ge(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = ge(n.image);
    if (!mo(r.src)) throw new Error("A card keeps a picture by its web address only.");
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
const In = 96, Rs = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Ws = ["solid", "dashed", "dotted"], Fs = 1e7;
function An(e) {
  const n = ge(e);
  if (typeof n.id != "string" || !Rs.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: ho(n.parentId), childId: ho(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, c) => {
    const h = n[o];
    if (h != null) {
      if (typeof h != "number" || !Number.isFinite(h) || h < i || h > c) throw new Error("A line's look is out of range.");
      t[o] = h;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !Vr.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Ws.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = ge(n.targetPoint), i = (c) => typeof c == "number" && Number.isFinite(c) && Math.abs(c) <= Fs;
    if (!i(o.x) || !i(o.y) || Object.keys(o).some((c) => c !== "x" && c !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    t.targetPoint = { x: Math.round(o.x * 100) / 100, y: Math.round(o.y * 100) / 100 };
  }
  for (const o of ["sourceAnchor", "targetAnchor"]) {
    if (o === "targetAnchor" && t.targetPoint) continue;
    const i = n[o];
    if (i == null) continue;
    const c = ge(i), h = (p) => typeof p == "number" && Number.isFinite(p) && p >= 0 && p <= 1;
    if (!h(c.x) || !h(c.y) || Object.keys(c).some((p) => p !== "x" && p !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    t[o] = { x: c.x, y: c.y };
  }
  return t;
}
function Ds(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map(An).map((r) => Qr(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (Ke(t.map((r) => r.id), "line ID"), t.length > In) throw new Error(`A workshop holds up to ${In} lines.`);
  return t;
}
function Qr(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function Ke(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Lo({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function js(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const xn = (e) => "lane-" + e, Je = (e) => "card-" + e, At = (e) => "image-" + e;
function Ra(e, n = {}) {
  const t = js(e), r = ee.of(n.scope);
  return Lo(e).map((o) => {
    const i = e.cards.filter((p) => p.laneId === o.id), c = t.filter((p) => p.laneId === o.id), h = [r.lane(o.id)];
    return o.station?.image && h.push(r.image(o.id)), { lane: o, cards: i, signals: c, nodeIds: [...h, ...i.map((p) => r.card(p.id))] };
  });
}
const To = 5, zn = 24, wo = 3;
function Bs(e, n, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A move made anyway says who made it, when, and past which rule.");
  const r = e, o = (c, h) => typeof c == "string" && c.trim().length > 0 && c.length <= h && !/[\u0000-\u001f\u007f<>]/.test(c), i = r.was === void 0 ? void 0 : Hs(r.was);
  if (!o(r.by, 80) || !o(r.at, 40) || Number.isNaN(Date.parse(r.at)) || !o(r.sentence, 300) || typeof r.from != "string" || !n.includes(r.from) || r.from === t && !i || Object.keys(r).some((c) => !["by", "at", "sentence", "from", "was"].includes(c)))
    throw new Error("A move made anyway says who made it, when, past which rule, and the lane it came from.");
  return { by: r.by, at: r.at, sentence: r.sentence, from: r.from, ...i && { was: i } };
}
function Hs(e) {
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
  if (n.kind !== void 0 && n.kind !== "release-plan" && !te(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = te(n), o = r ? ve(r) : void 0, i = { id: Ee }, c = Le(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > To)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const h = o?.cards ?? [zn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > h[0]) throw new Error(h[1]);
  const p = n.lanes.map((k) => {
    const $ = ge(k), b = { id: Ee($.id), label: Le($.label) };
    if ($.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if ($.capacity !== void 0) {
      const L = t ? 576 : 24;
      if (typeof $.capacity != "number" || !Number.isInteger($.capacity) || $.capacity < 1 || $.capacity > L)
        throw new Error(`Lane capacity must be a whole number from 1 to ${L}.`);
      b.capacity = $.capacity;
    }
    if (o?.readLane?.($, b, i), $.station !== void 0) {
      const L = ge($.station), F = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= wo)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray(L.next) || L.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const J = L.next.map(Ee);
      Ke(J, "onward stop"), b.station = { column: F(L.column), row: F(L.row), next: J, outcome: Le(L.outcome, 160) }, L.image !== void 0 && (b.station.image = Zr(L.image));
    }
    return b;
  }), C = p.map((k) => k.id);
  if (Ke(C, "lane ID"), r && p.some((k) => k.station)) throw new Error("A business board has no map stations.");
  if ((t || p.some((k) => k.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (p.some((k) => k.station) && n.cards.every((k) => k?.free === !0))
    throw new Error("A map needs at least one token.");
  if (p.some((k) => k.station)) {
    if (!p.every((k) => k.station)) throw new Error("Give every station on the map a position.");
    Ke(p.map((k) => k.station.column + "," + k.station.row), "map position");
    for (const k of p)
      if (k.station.next.some(($) => $ === k.id || !C.includes($))) throw new Error("Connect each stop to another station on this map.");
  }
  const I = n.cards.map((k) => {
    const $ = ge(k), b = { id: Ee($.id), label: r ? Le($.label) : Ns($.label), laneId: Ee($.laneId) };
    if (!C.includes(b.laneId)) throw new Error("Card refers to an unknown lane.");
    if ($.override !== void 0) {
      if (t || n.experience !== void 0) throw new Error("A release plan’s and a startup experience’s cards are never moved past a rule.");
      b.override = Bs($.override, C, b.laneId);
    }
    if ($.allowedLaneIds !== void 0) {
      if (!Array.isArray($.allowedLaneIds) || $.allowedLaneIds.length > p.length) throw new Error("Invalid allowed lanes.");
      if (b.allowedLaneIds = $.allowedLaneIds.map(Ee), Ke(b.allowedLaneIds, "allowed lane"), !b.allowedLaneIds.includes(b.laneId) && !b.override || !b.allowedLaneIds.every((L) => C.includes(L)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if ($.look !== void 0) {
      const L = po($.look);
      L && (b.look = L);
    }
    if ($.asNote !== void 0) {
      const L = It($.asNote);
      L && (b.asNote = L);
    }
    if ($.noteId !== void 0 && $.noteId !== b.id && (b.noteId = ho($.noteId)), $.free !== void 0) {
      if ($.free !== !0 || !p.some((L) => L.station)) throw new Error("Only a map’s cards can be free of its paths.");
      b.free = !0;
    }
    if (o?.readCard($, b, i), t) {
      if (typeof $.points != "number" || !Number.isInteger($.points) || $.points < 1 || $.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (b.points = $.points, $.dependsOn !== void 0) {
        if (!Array.isArray($.dependsOn) || $.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        b.dependsOn = $.dependsOn.map(Ee), Ke(b.dependsOn, "dependency");
      }
    }
    return b;
  });
  Ke(I.map((k) => k.id), "card ID");
  const v = { version: 1, title: c, lanes: p, cards: I };
  if (n.experience !== void 0) {
    const k = ge(n.experience);
    if (k.version !== 1 || k.kind !== "customer-interviews" && k.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    v.experience = { version: 1, kind: k.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    v.signals = n.signals.map((k) => {
      const $ = ge(k), b = Ee($.cardId), L = Ee($.laneId);
      if (!I.some((F) => F.id === b) || !C.includes(L))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Ee($.id),
        label: Le($.label),
        cardId: b,
        laneId: L,
        whenPresent: Le($.whenPresent, 160),
        whenAbsent: Le($.whenAbsent, 160)
      };
    }), Ke(v.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const k = Ds(n.lines, new Set(I.map(($) => $.id)));
    k.length && (v.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    v.presentationOrder = Lo({ lanes: p, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (v.behaviour = be().validate(n.behaviour, { ...v, kind: n.kind })), t)
    return v.kind = "release-plan", Ui(v), v;
  if (r && o) {
    v.kind = r, o.readBoard(n, v, i);
    const k = o.validate(v);
    if (k) throw new Error(k);
    return v;
  }
  for (const k of p)
    if (Ye({ cards: I.filter(($) => !$.override) }, k.id) > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return v;
}
function Ye(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const ei = 65536;
function Wa(e) {
  const n = JSON.stringify(X(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > ei) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function Fa(e) {
  if (e.length > ei) throw new Error("This workshop is too large to open from a link.");
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
function Oo(e, n, t) {
  const r = te(e);
  return r ? ve(r).planMove(e, n, t) : void 0;
}
function St(e, n) {
  if (te(e)) return e.lanes.filter((r) => Oo(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => qn(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && Ye(e, r.id) < (r.capacity ?? 1 / 0));
}
function go(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = Oo(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = qn(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !St(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? Ot({ ...r, laneId: t }) : i) };
}
function zs(e, n, t) {
  if (!n.cards.find((h) => h.id === t)?.override) return n;
  const o = { ...n, cards: n.cards.map((h) => h.id === t ? Ot(h) : h) };
  let i = !1;
  try {
    X(o);
  } catch {
    i = !0;
  }
  const c = te(e);
  return !i && c && (i = ve(c).pastRule?.(o, t) ?? !1), !i && e.behaviour && (i = "refused" in be().check(e, o)), i ? n : o;
}
function Ot(e) {
  if (!e.override) return e;
  const { override: n, ...t } = e;
  return t;
}
function rn(e, n, t) {
  const r = Po(e, n, t);
  if (!r || r === e) return r;
  const o = zs(e, r, n);
  return e.behaviour && "refused" in be().check(e, o) ? null : o;
}
function Gs(e) {
  return e.kind !== "release-plan" && !e.experience;
}
function Da(e, n) {
  return e.cards.some((t) => t.override) || n.cards.some((t) => t.override);
}
function Us(e, n) {
  if (!n.override) return !1;
  const t = e.cards.find((r) => r.id === n.id)?.override;
  return !t || JSON.stringify(t) !== JSON.stringify(n.override);
}
function ja(e, n) {
  const t = e.cards.find((o) => o.id === n.id)?.override;
  if (!t || n.override) return !1;
  const r = t.was ?? {};
  return n.laneId === t.from && (r.lag === void 0 || (n.lag ?? 0) === r.lag) && (r.duration === void 0 || n.duration === r.duration) && (r.parentId === void 0 || (n.parentId ?? null) === r.parentId);
}
function Ba(e, n) {
  return e.cards.some((t) => t.laneId === n && t.override !== void 0);
}
function Ha(e, n, t) {
  const r = e.cards.find((o) => o.id === n);
  return !r || !e.lanes.some((o) => o.id === t) ? "That card or lane is no longer on the board." : r.laneId === t || rn(e, n, t) || Kn(e, n, t, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) ? null : je(e, n, t) ?? "That move is not available.";
}
function ni(e) {
  return { by: String(e.by || "Someone").replace(/[\u0000-\u001f\u007f<>]/g, "").slice(0, 80) || "Someone", at: e.at };
}
function Ks(e, n, t, r) {
  return { ...ni(t), sentence: (n || "That move is not available.").slice(0, 300), from: e.laneId, ...r && { was: r } };
}
function Kn(e, n, t, r) {
  const o = e.cards.find((C) => C.id === n);
  if (!o || o.laneId === t || !e.lanes.some((C) => C.id === t) || !Gs(e) || rn(e, n, t)) return null;
  const i = je(e, n, t) ?? "That move is not available.", c = Po(e, n, t), h = c && c !== e ? c : te(e) ? { ...e, cards: [...e.cards.filter((C) => C.id !== n), o] } : e, p = Ks(o, i, r);
  try {
    return X({ ...h, cards: h.cards.map((C) => C.id === n ? { ...Ot(C), laneId: t, override: p } : C) });
  } catch {
    return null;
  }
}
function za(e, n, t) {
  const r = new Map(e.cards.map((i) => [i.id, i]));
  if (!n.cards.some((i) => i.override || r.get(i.id)?.override)) return n;
  const o = n.cards.map((i) => {
    const c = r.get(i.id), h = Ot(i);
    if (!c) return h;
    const p = c.laneId !== i.laneId, C = (c.lag ?? 0) !== (i.lag ?? 0) || c.duration !== i.duration || (c.parentId ?? null) !== (i.parentId ?? null);
    if (!p && !C) return c.override ? { ...h, override: c.override } : h;
    if (!i.override) return h;
    if (p && !C) {
      const b = Kn(e, i.id, i.laneId, t)?.cards.find((L) => L.id === i.id)?.override;
      return b ? { ...h, override: b } : h;
    }
    const I = e.kind === "launch-plan" || e.kind === "hiring-plan", v = te(e) === "nest" ? [{ kind: "nest_card", card: { id: i.id }, ...i.parentId ? { under: { id: i.parentId } } : { lane: { id: i.laneId } }, override: !0 }] : I ? [
      { kind: "set_task", card: { id: i.id }, lag: i.lag ?? 0, duration: i.duration ?? 1, override: !0 },
      ...p ? [{ kind: "move_card", card: { id: i.id }, lane: { id: i.laneId }, override: !0 }] : []
    ] : [];
    if (!v.length) return h;
    const k = $e(e, v, { actor: { by: ni(t).by, via: "chat" }, now: t.at }), $ = "refused" in k ? void 0 : k.workshop.cards.find((b) => b.id === i.id);
    return $?.override && $.laneId === i.laneId && ($.lag ?? 0) === (i.lag ?? 0) && $.duration === i.duration && ($.parentId ?? null) === (i.parentId ?? null) ? { ...h, override: $.override } : h;
  });
  return { ...n, cards: o };
}
const qs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function ti(e) {
  if (!e.override) return null;
  const n = new Date(e.override.at), t = Number.isNaN(n.getTime()) ? "" : " · " + n.getDate() + " " + qs[n.getMonth()];
  return "Moved anyway by " + e.override.by + t;
}
function Po(e, n, t) {
  const r = e.cards.find((c) => c.id === n);
  if (!r || !e.lanes.some((c) => c.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return qn(e, r, t);
  const o = Oo(e, n, t);
  if (o !== void 0) return o;
  const i = ua(e, n, t);
  return i || (t === "prototype" && ln(e) === "customer-interviews" ? null : St(e, r).some((c) => c.id === t) ? go(e, n, t) : null);
}
function Ir(e, n) {
  return e.lanes.filter((t) => rn(e, n, t.id) !== null);
}
function je(e, n, t) {
  const r = Po(e, n, t);
  if (r !== null) {
    const v = r === e || !e.behaviour ? null : be().check(e, r);
    return v && "refused" in v ? v.refused.sentence : null;
  }
  const o = e.cards.find((v) => v.id === n), i = e.lanes.find((v) => v.id === t);
  if (!o || !i) return "That move is not available.";
  const c = te(e), h = c && ve(c).refusal;
  if (h) return h(e, n, t);
  const p = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return p;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return p;
    const v = sn(e, t), k = { ...e, lanes: e.lanes.map((b) => b === i ? { id: i.id, label: i.label } : b) }, $ = qn(k, o, t);
    return $ ? `Needs ${sn($, t) - v} points. It already holds ${v} of ${i.capacity} points.` : p;
  }
  const C = e.lanes.find((v) => v.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const I = Ye(e, t);
  if (i.capacity !== void 0 && I >= i.capacity && !(C?.station && o.free)) {
    const v = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${I} of ${i.capacity} ${v}.`;
  }
  return p;
}
function to(e) {
  return !0;
}
function Js(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !ln(e);
}
function Ys(e) {
  const n = ln(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function Zs(e) {
  const n = $t(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const Vs = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Sn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && Vs.test(n) && !t.has(n) ? n : Yn(e, "card");
}
function tn(e, n, t) {
  const r = e.lanes.find((h) => h.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = Ys(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= zn ? `This board is at its size limit of ${zn} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : ai(e, n, t) ? null : je(si(e, n, t), Sn(e, t.id), n);
  if (te(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const h = li(e, n, t);
    return typeof h == "string" ? h : Ar(e, h);
  }
  if (e.cards.length >= zn) return `This board is at its size limit of ${zn} cards. Remove a card to make room.`;
  const i = e.lanes.some((h) => h.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const c = Ye(e, n);
  if (r.capacity !== void 0 && !i && c >= r.capacity) return `It already holds ${c} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const h = ri(t.lines);
    if (!h) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + h.filter((C) => !p.has(C.id)).length > In)
      return `A workshop holds up to ${In} lines.`;
  }
  return Ar(e, { ...e, cards: [...e.cards, { id: Sn(e, t.id), label: Tt(Eo(t) || an(e)), laneId: n }] });
}
function Ar(e, n) {
  if (!e.behaviour) return null;
  const t = be().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function oi(e) {
  try {
    return e && typeof e == "object" ? Xr(e) : void 0;
  } catch {
    return;
  }
}
function yo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      It({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? It(n) : void 0;
}
function ri(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = An(r);
    } catch {
      const i = (h) => {
        const { id: p, parentId: C, childId: I, targetPoint: v } = ge(r);
        return An({ id: p, parentId: C, childId: I, ...h ? { targetPoint: v } : {} });
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
function Pt(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function wn(e, n, t) {
  return e && e.map((r) => Pt(r, n, t));
}
function ii(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function Hn(e, n, t, r) {
  if (tn(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return ai(e, n, t, r);
  if (te(e)) {
    const L = li(e, n, t), F = L.cards[L.cards.length - 1], J = r === void 0 ? -1 : e.cards.findIndex((l) => l.id === r && l.laneId === n);
    return J < 0 ? L : { ...L, cards: [...e.cards.slice(0, J), F, ...e.cards.slice(J)] };
  }
  const o = oi(t.look), i = Eo(t), c = i || an(e);
  let h = yo(t.asNote);
  i || (h = { ...h, text: "" }), c.length > 80 && h?.text === void 0 && c.length <= 4e3 && (h = { ...h, text: c });
  const p = Sn(e, t.id), C = p !== t.id && typeof t.id == "string" && Lt.test(t.id) ? t.id : void 0, I = e.lanes.some((L) => L.station), v = {
    id: p,
    label: Tt(c),
    laneId: n,
    ...o ? { look: o } : {},
    ...h ? { asNote: h } : {},
    ...C ? { noteId: C } : {},
    ...I ? { free: !0 } : {}
  }, k = r === void 0 ? -1 : e.cards.findIndex((L) => L.id === r && L.laneId === n), $ = k < 0 ? [...e.cards, v] : [...e.cards.slice(0, k), v, ...e.cards.slice(k)], b = t.lines === void 0 ? void 0 : ii(e, ri(t.lines).map((L) => Pt(L, t.id, v.id)));
  return X({ ...e, cards: $, ...b ? { lines: b } : {} });
}
function si(e, n, t, r) {
  const { label: o, points: i } = Zs(typeof t.label == "string" ? t.label : ""), c = Sn(e, t.id), h = c !== t.id && typeof t.id == "string" && Lt.test(t.id) ? t.id : void 0, p = { id: c, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...h ? { noteId: h } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((I) => I.id === r && I.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, p] : [...e.cards.slice(0, C), p, ...e.cards.slice(C)] };
}
function ai(e, n, t, r) {
  const o = si(e, n, t, r), i = Sn(e, t.id), c = o.cards.find((p) => p.id === i);
  if (c.laneId === n) return X(o);
  const h = qn(o, c, n);
  return h ? X(h) : null;
}
function li(e, n, t) {
  const r = Eo(t), o = ve(te(e)).fromNote(e, r, an(e, t.under));
  if (typeof o == "string") return o;
  const i = $e(e, [{ kind: "add_card", lane: { id: n }, ...o, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const c = i.workshop.cards, h = Sn(e, t.id), p = h !== t.id && typeof t.id == "string" && Lt.test(t.id) ? t.id : void 0, C = oi(t.look), I = r ? yo(t.asNote) : { ...yo(t.asNote), text: "" };
  c[c.length - 1] = {
    ...c[c.length - 1],
    id: h,
    ...p ? { noteId: p } : {},
    ...C ? { look: C } : {},
    ...I ? { asNote: I } : {}
  };
  const v = ve(te(e));
  return typeof t.day == "number" && Number.isFinite(t.day) && v.landNote ? v.landNote(i.workshop, h, t.day) : i.workshop;
}
function Eo(e) {
  return typeof e?.label == "string" ? $t(e.label) : "";
}
function Sr(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === an(e, n.parentId) || n.label === an(e)) ? "" : t !== void 0 && t !== "" && Tt(t) === n.label ? t : ko(e, n);
}
function di(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = te(e), r = ti(n), o = t ? ve(t).cardText(e, n) : n.label;
  return r ? o + `
` + r : o;
}
function ko(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = te(e);
  return t ? ve(t).noteText(e, n) : n.label;
}
function gt(e, n) {
  const t = e.cards.find((r) => r.id === n);
  if (!t) return "That card is no longer on the board.";
  if (ln(e)) return "This card stays on the board.";
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
function Cr(e, n, t = ci(e, n)) {
  if (gt(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const c = { ...i, dependsOn: i.dependsOn.filter((h) => h !== n) };
    return c.dependsOn.length || delete c.dependsOn, c;
  }), o = e.lines?.map((i) => Pt(i, n, t));
  return X({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Xs(e, n, t = ci(e, n)) {
  const r = new Set(e.cards.filter((c) => c.id !== n).map((c) => c.id)), o = (e.lines ?? []).filter((c) => c.parentId === n || c.childId === n).map((c) => Pt(c, n, t)), i = (c) => r.has(c.parentId) || r.has(c.childId);
  return { stay: o.filter(i), leave: o.filter((c) => !i(c)) };
}
function ci(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? Yr(t) : n;
}
function oo(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function Gn(e, n) {
  if (e.kind) return Qs;
  let t;
  try {
    t = An(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = Qr(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= In ? `A workshop holds up to ${In} lines.` : null;
}
const Qs = "Lines join the cards of a lane workshop to notes and to each other.";
function yt(e, n) {
  return Gn(e, n) !== null ? null : X({ ...e, lines: ii(e, [An(n)]) });
}
function $r(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? X({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function ui(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((c) => c.id));
  let i = `${n}->${t}`;
  for (let c = 2; o.has(i); c++) i = `${n}->${t}~${c}`;
  return An({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function ea(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function na(e, n) {
  return fi(e, n, !1);
}
function Ue(e, n) {
  return fi(e, n, !0);
}
function fi(e, n, t) {
  const r = e.lanes.find((I) => I.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const I = sn(e, n);
    return r.capacity ? I + (t ? " of " : " / ") + r.capacity + " points" : I + " points";
  }
  const o = te(e);
  if (o) return ve(o).caption(e, n);
  const i = fa(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const c = e.cards.filter((I) => I.laneId === n).length, h = e.behaviour ? be().laneLimit(e, n) : r.capacity, p = Ye(e, n), C = (I) => I + (I === 1 ? " card" : " cards");
  return t ? h !== void 0 && p !== c ? p + " of " + h + " · " + C(c - p) : h !== void 0 ? c + " of " + h : C(c) : h !== void 0 && p !== c ? p + " / " + h + " · +" + (c - p) : h !== void 0 ? c + " / " + h : String(c);
}
function ta(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || te(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? be().laneLimit(e, n) : t.capacity;
  return r !== void 0 && Ye(e, n) >= r;
}
const Jn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, gn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function hi(e, n = Jn, t = 28, r) {
  const { pitch: o, row: i, top: c } = n, h = !!e.lanes[0].station, p = e.lanes.map((v) => e.cards.filter((k) => k.laneId === v.id).length), C = c + Math.max(1, ...r ?? p) * i + 36, I = e.lanes.map((v, k) => ({
    x: h ? v.station.column * (o + t) : k * o,
    y: h ? v.station.row * C : 0
  }));
  return {
    points: I,
    width: Math.max(...I.map((v) => v.x)) + o,
    height: Math.max(...I.map((v, k) => v.y + c + (h ? Math.max(1, p[k]) : p[k] + 1) * i))
  };
}
function Ga() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Yn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function pi(e) {
  const n = X(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function oa(e, n) {
  const t = pi(e), r = Yn(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), X(t);
}
function ra(e, n, t) {
  const r = pi(e);
  return r.cards.push({
    id: Yn(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), X(r);
}
function Ua() {
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
function Lr(e, n, t) {
  const r = X(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((I) => I.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= To) throw new Error("A map can have up to five stations.");
  const i = Le(t?.label), c = Le(t?.outcome, 160), h = Yn(r, "station");
  let p, C = 1 / 0;
  for (let I = 0; I < wo; I++)
    for (let v = 0; v < wo; v++) {
      if (r.lanes.some(($) => $.station.column === v && $.station.row === I)) continue;
      const k = Math.abs(o.station.column - v) + Math.abs(o.station.row - I);
      k < C && (C = k, p = { column: v, row: I });
    }
  if (!p) throw new Error("There is no free station position.");
  return o.station.next.push(h), r.lanes.push({ id: h, label: i, station: { ...p, next: [], outcome: c, ...t.image === void 0 ? {} : { image: Zr(t.image) } } }), r.presentationOrder?.push(h), r;
}
const Ka = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, bo = (e) => "caption-" + e, bn = (e) => "column-" + e, Tr = "rules-board";
function Zn(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function qa(e, n) {
  const t = Zn(n);
  return t ? t + ":" + e : e;
}
const ee = {
  lane: xn,
  card: Je,
  image: At,
  caption: bo,
  column: bn,
  rules: Tr,
  of(e) {
    const n = Zn(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(xn(r)),
      card: (r) => t(Je(r)),
      image: (r) => t(At(r)),
      caption: (r) => t(bo(r)),
      column: (r) => t(bn(r)),
      rules: t(Tr)
    };
  }
};
function mi(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function wi(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function vn(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function Or(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function Pr(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((h, p) => h + Math.max(1, Math.ceil(p.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const gi = 152, vo = gi + 12, ia = 12;
function sa(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function De(e, n = {}) {
  const t = X(e), { pitch: r, row: o, top: i } = Jn, c = t.lanes.map((k) => t.cards.filter(($) => $.laneId === k.id).length), h = (k) => Math.max(c[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), p = !!t.lanes[0].station, C = t.lanes.some((k) => k.station?.image), I = sa(n.layout, t.lanes.length), v = [];
  if (p) {
    const { points: k } = hi(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach(($, b) => v.push({
      laneId: $.id,
      x: k[b].x,
      y: k[b].y + (C ? $.station.row * vo : 0),
      width: r,
      height: i + ($.station.image ? vo : 0) + Math.max(1, h(b)) * o,
      column: $.station.column,
      row: $.station.row
    }));
  } else {
    let k = 0;
    for (let $ = 0; $ < t.lanes.length; $ += I) {
      const b = t.lanes.slice($, $ + I), L = i + (Math.max(...b.map((F, J) => h($ + J))) + 1) * o;
      b.forEach((F, J) => v.push({ laneId: F.id, x: J * r, y: k, width: r, height: L, column: J, row: $ / I })), k += L + ia;
    }
  }
  return { places: v, width: Math.max(...v.map((k) => k.x + k.width)), height: Math.max(...v.map((k) => k.y + k.height)) };
}
function aa(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: c } = Jn, h = n.origin ?? { x: 0, y: 0 }, p = !!e.lanes[0].station, { places: C } = De(e, n), I = n.style ?? {}, v = I.textColor ?? Dn.fontColor, k = I.borderColor ?? Dn.borderColor, $ = I.borderWidth ?? Dn.borderWidth, b = I.cornerRadius ?? 0, L = I.fontSize ?? Dn.fontSize, F = I.laneFontSize ?? L + 2, J = I.captionFontSize ?? Math.max(11, L - 1), l = [], x = (S) => {
    const T = { options: {
      shapeHint: "rectangle",
      vectorPath: vn(S.width, S.height, b),
      foregroundColor: v,
      borderColor: k,
      borderWidth: $,
      ...I.fontFamily ? { fontFamily: I.fontFamily } : {},
      ...S
    }, relationships: { associations: [] } };
    return l.push(T), T;
  };
  e.lanes.forEach((S, T) => {
    const _ = C[T], D = h.x + _.x, j = h.y + _.y, M = S.station?.image;
    x({
      id: bn(S.id),
      text: "",
      name: S.label,
      xPos: D + 2,
      yPos: j,
      width: t - 4,
      height: _.height,
      vectorPath: vn(t - 4, _.height, b ? b + 2 : 0),
      backgroundColor: p ? "#fcf9ed" : Or(gn[T], 0.6),
      borderColor: p ? "#a8b5aa" : Or(gn[T], 0.1),
      borderWidth: 1,
      ...p ? { borderStyle: "dashed" } : {}
    }), x({
      id: xn(S.id),
      text: S.label,
      name: S.label,
      xPos: D + 8,
      yPos: j + 6,
      width: r,
      height: 58,
      backgroundColor: gn[T],
      fontSize: Pr(S.label, F, r - 16, 50)
    });
    const q = p ? "" : na(e, S.id), Me = J, ue = p ? r : Math.min(r, Math.max(40, Math.ceil(q.length * Me * 0.6) + 24));
    x({
      id: bo(S.id),
      text: q,
      name: S.label,
      xPos: D + 8 + Math.round((r - ue) / 2),
      yPos: j + 68,
      width: ue,
      height: 22,
      vectorPath: vn(ue, 22, p ? 0 : 11),
      backgroundColor: p ? "transparent" : ta(e, S.id) ? gn[T % gn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: Me
    }), M && l.push({ options: {
      id: At(S.id),
      name: M.alt,
      text: "",
      xPos: D + 8,
      yPos: j + c,
      width: r,
      height: gi,
      shapeHint: "rectangle",
      image: M.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((Q) => Q.laneId === S.id).forEach((Q, Be) => {
      const dn = di(e, Q), Ze = p ? r - 20 : r, oe = p ? i - 6 : i, pe = p && !Q.free, ye = pe ? {} : { ...I.card, ...Q.look }, xe = pe ? b : I.card?.cornerRadius ?? b;
      x({
        id: Je(Q.id),
        text: dn,
        name: Q.label,
        xPos: D + (p ? 18 : 8),
        yPos: j + c + (M ? vo : 0) + Be * o,
        width: Ze,
        height: oe,
        ...xe !== b ? { vectorPath: vn(Ze, oe, xe) } : {},
        backgroundColor: pe ? "#ffda75" : ye.backgroundColor ?? I.backgroundColor ?? Dn.backgroundColor,
        ...ye.textColor ? { foregroundColor: ye.textColor } : {},
        ...ye.fontFamily ? { fontFamily: ye.fontFamily } : {},
        ...ye.borderColor ? { borderColor: ye.borderColor } : {},
        ...ye.borderWidth !== void 0 ? { borderWidth: ye.borderWidth } : {},
        fontSize: Pr(dn, ye.fontSize ?? L, Ze - 16, oe - 8)
      });
    });
  });
  const A = new Map(l.map((S) => [S.options.id, S]));
  for (const S of e.lanes)
    S.station && (A.get(bn(S.id)).relationships.associations = S.station.next.map((T) => ({
      id: S.id + "-to-" + T,
      parentId: bn(S.id),
      childId: bn(T),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const S of e.cards)
      for (const T of S.dependsOn ?? []) {
        const _ = Je(T), D = Je(S.id);
        A.get(_).relationships.associations.push({
          id: `dependency-${T.length}-${T}-${S.id}`,
          parentId: _,
          childId: D,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (mi(l, Zn(n.scope)), n.beside) {
    const S = new Set(n.beside), T = new Set(l.map((j) => j.options.id)), _ = /* @__PURE__ */ new Map();
    for (const j of [...T]) {
      if (!S.has(j)) continue;
      const M = wi(j, (q) => S.has(q) || T.has(q));
      T.add(M), _.set(j, M);
    }
    const D = (j) => _.get(j) ?? j;
    for (const j of l) {
      j.options.id = D(j.options.id);
      for (const M of j.relationships.associations)
        M.parentId = D(M.parentId), M.childId = D(M.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: l };
}
function Ja(e, n, t = {}) {
  return e.behaviour ? be().note(e, n, t) : null;
}
function la(e, n) {
  const t = X(e), r = Zn(n?.scope);
  if (n?.native) return aa(t, n);
  const { width: o, row: i, height: c, top: h } = Jn, p = [];
  function C(b, L, F, J, l, x) {
    p.push({ options: {
      id: b,
      text: L,
      name: L,
      xPos: F,
      yPos: J,
      width: o,
      height: l,
      shapeHint: "rectangle",
      backgroundColor: x,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: I } = hi(t), v = 152, k = v + 12, $ = t.lanes.some((b) => b.station?.image);
  t.lanes.forEach((b, L) => {
    const F = I[L].x, J = I[L].y + ($ ? (b.station?.row ?? 0) * k : 0), l = b.station?.image, x = t.kind === "release-plan" ? b.label + `
` + (b.capacity ? sn(t, b.id) + " / " + b.capacity + " points" : sn(t, b.id) + " points") : b.label;
    C(xn(b.id), x, F, J, h - 12, gn[L]), l && p.push({ options: {
      id: At(b.id),
      name: l.alt,
      text: "",
      xPos: F,
      yPos: J + h,
      width: o,
      height: v,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((A) => A.laneId === b.id).forEach((A, S) => C(Je(A.id), di(t, A), F, J + h + (l ? k : 0) + S * i, c, "#fffdf6"));
  });
  for (const b of t.lanes) {
    if (!b.station) continue;
    const L = p.find((F) => F.options.id === xn(b.id));
    L.relationships.associations = b.station.next.map((F) => ({ id: b.id + "-to-" + F, parentId: L.options.id, childId: xn(F), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), L.options.text = b.label + `
` + b.station.outcome, L.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const b = new Map(p.map((L) => [L.options.id, L]));
    for (const L of t.cards)
      for (const F of L.dependsOn ?? []) {
        const J = Je(F), l = Je(L.id);
        b.get(J).relationships.associations.push({
          id: `dependency-${F.length}-${F}-${L.id}`,
          parentId: J,
          childId: l,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return mi(p, r), { options: { name: t.title }, shareId: "", nodes: p };
}
function da(e, n = {}, t) {
  const r = X(e), o = n.narrow ? void 0 : n.width;
  if (te(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: h, height: p } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(h, o ?? 0), height: p };
  }
  const { width: i, height: c } = De(r, {});
  return { width: Math.max(To * Jn.pitch, i), height: c };
}
function ca(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((c) => [c.x, c.y, c.width, c.height].every(Number.isFinite));
  for (let c = 0; c <= i.length; c++) {
    const h = i.find((p) => o < p.x + p.width + r && o + e.width > p.x - r && e.y < p.y + p.height + r && e.y + e.height > p.y - r);
    if (!h) break;
    o = t > 0 ? h.x + h.width + r : h.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const Ya = {
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
}, xo = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Mo = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Za() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: xo.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: xo.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function Va() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Mo.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function ln(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Mo.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => xo.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function ua(e, n, t) {
  const r = ln(e), o = e.cards.find((c) => c.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const c = e.cards.find((h) => h.laneId === t);
    if (c) {
      if (!St(e, c).some((h) => h.id === "interviews")) return null;
      i = go(e, c.id, "interviews");
    }
  }
  return St(i, o).some((c) => c.id === t) ? go(i, n, t) : null;
}
function fa(e, n) {
  if (ln(e) !== "experiment-budget") return null;
  const t = Mo.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  ks as CHROME_CHIPS_MAX_SCALE,
  Dr as CHROME_MAX_SCALE,
  Dn as DEFAULT_NOTE_STYLE,
  ys as DRAFT_TAG,
  Mr as WORKSHOP_BOARD_KINDS,
  mt as WorkshopReferenceError,
  Lr as addWorkshopBranch,
  ra as addWorkshopCard,
  oa as addWorkshopLane,
  $e as applyWorkshopEdits,
  _a as attachWorkshop,
  St as availableLanes,
  Ja as behaviourNote,
  pr as boardBadgeShapes,
  Hr as boardChromeBox,
  bs as boardChromeLabel,
  Br as boardChromeLayout,
  hr as boardChromeShapes,
  Ma as boardChromeStyles,
  So as boardLegend,
  Ms as businessBoardKinds,
  te as businessKind,
  as as canHangPanel,
  Mo as channels,
  ss as checkWorkshopReplacement,
  he as chromeInk,
  jr as chromeScaleAt,
  lo as chromeTagScaleAt,
  Yi as countWord,
  hs as createBoardLayer,
  Va as createBudgetWorkshop,
  Za as createInterviewWorkshop,
  Ga as createLaneWorkshop,
  Ua as createWorkshopMap,
  Fa as decodeWorkshopFragment,
  Ea as describeFocusDarkroom,
  Ca as describeWorkshopEdits,
  Wa as encodeWorkshopFragment,
  ya as handoffSummary,
  Ta as hangGalleryPanel,
  Ya as industrialWorkshop,
  Pa as initialFocusDarkroom,
  xo as interviews,
  Xi as isRuleEdit,
  gn as laneColors,
  yn as layerInk,
  on as listed,
  lt as listeningRoom,
  ba as listeningRoomCaption,
  zn as maxWorkshopCards,
  In as maxWorkshopLines,
  $a as moonGallery,
  go as moveWorkshopCard,
  Sa as named,
  Yn as nextWorkshopId,
  Ka as nightTransfer,
  Oa as normalizeFocusDarkroom,
  ka as normalizeListeningRoom,
  La as normalizeMoonGallery,
  ma as normalizeOfflineHandoff,
  pa as offlineHandoff,
  ua as planStartupMove,
  Zi as pointing,
  Rr as printFields,
  Na as registerRuleControls,
  Aa as registerRulebook,
  xa as registerWorkshopRules,
  sn as releaseLoad,
  va as releasePlan,
  kn as renderLayerShapes,
  ga as resolveHandoff,
  js as resolveWorkshopSignals,
  wa as reviewHandoff,
  vn as roundedBox,
  be as rulebook,
  qi as rulebookLoaded,
  E as said,
  ln as startupExperienceKind,
  Io as unquoted,
  X as validateWorkshop,
  bt as workshopBoardKind,
  Zn as workshopBoardScope,
  fa as workshopBudgetResult,
  rn as workshopCandidate,
  Cr as workshopCardAsNote,
  gt as workshopCardAsNoteRefusal,
  Tt as workshopCardLabelOf,
  Xs as workshopCardLines,
  Xr as workshopCardLookOf,
  ko as workshopCardNoteText,
  Sr as workshopCardNoteWords,
  di as workshopCardText,
  Ir as workshopDestinations,
  so as workshopEditKinds,
  ro as workshopFinder,
  ca as workshopFreeSpot,
  Us as workshopFreshOverride,
  Ha as workshopHardLimit,
  Da as workshopHasMarks,
  xr as workshopKeepsLink,
  mo as workshopKeepsPicture,
  na as workshopLaneCaption,
  ta as workshopLaneFull,
  Ye as workshopLaneHeld,
  Ba as workshopLaneOverridden,
  De as workshopLanePlaces,
  Ue as workshopLaneSpoken,
  Jn as workshopLayout,
  Gn as workshopLineRefusal,
  oo as workshopLinesOf,
  Qs as workshopLinesSentence,
  an as workshopNewCardName,
  ui as workshopNewLine,
  ee as workshopNodeIds,
  Hn as workshopNoteCandidate,
  Yr as workshopNoteIdOf,
  tn as workshopNoteRefusal,
  Kn as workshopOverrideCandidate,
  ti as workshopOverrideLine,
  Ks as workshopOverrideMark,
  ja as workshopOverrideUndone,
  hi as workshopPositions,
  Lo as workshopPresentationLanes,
  Ra as workshopPresentationScenes,
  ns as workshopReferences,
  je as workshopRefusal,
  wn as workshopRenamedLines,
  da as workshopReserve,
  dr as workshopRuleSchema,
  ve as workshopRules,
  Ia as workshopRulesLoaded,
  qa as workshopScopedId,
  zs as workshopShedMark,
  za as workshopStampOverrides,
  wi as workshopStandInId,
  Js as workshopTakesLines,
  to as workshopTakesNotes,
  la as workshopToSlate,
  yt as workshopWithLine,
  ea as workshopWithoutCardLines,
  $r as workshopWithoutLine
};
