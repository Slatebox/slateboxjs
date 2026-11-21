import { D as $e } from "./NoteDefaults-1xFW0br8.mjs";
const Jt = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Qt(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: a, fieldNote: i, deskNote: f, fallback: b } = e, y = (g) => typeof g == "string" && g.trim().length > 0 && g.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(g);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? a !== "field" && a !== "desk" : a !== null) || a === void 0 || !y(i) || !y(f) || !y(b) ? null : { kind: n, version: o, stage: t, choice: a, fieldNote: i.trim(), deskNote: f.trim(), fallback: b.trim() };
}
function Xt(e) {
  return { ...e, stage: "review", choice: null };
}
function eo(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function no(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const _e = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function to(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: a, rightLabel: i } = e, f = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !f(a) || !f(i) ? null : { kind: n, version: o, mix: t, leftLabel: a.trim(), rightLabel: i.trim() };
}
function oo({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === _e.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === _e.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === _e.leftLabel && o === _e.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function ye(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function ft(e) {
  const n = new Map(e.cards.map((f) => [f.id, f])), o = new Map(e.lanes.map((f, b) => [f.id, b])), t = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  function i(f) {
    if (!t.has(f.id)) {
      if (a.has(f.id)) throw new Error("Release dependencies must be acyclic.");
      a.add(f.id);
      for (const b of f.dependsOn ?? []) {
        const y = n.get(b);
        if (!y) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(y.laneId) > o.get(f.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(y);
      }
      a.delete(f.id), t.add(f.id);
    }
  }
  for (const f of e.cards) i(f);
  for (const f of e.lanes) {
    if (f.station) throw new Error("Release windows cannot also be map stations.");
    if (ye(e, f.id) > (f.capacity ?? 1 / 0)) throw new Error(`Release "${f.label}" exceeds its point budget.`);
  }
}
function Ke(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((I, S) => [I.id, S])), a = t.get(o);
  if (a === void 0) return null;
  const i = a < t.get(n.laneId), f = /* @__PURE__ */ new Set([n.id]), b = [n];
  for (; b.length; ) {
    const I = b.pop();
    for (const S of e.cards) {
      if (f.has(S.id)) continue;
      const w = t.get(S.laneId);
      (i ? w > a && I.dependsOn?.includes(S.id) : w < a && S.dependsOn?.includes(I.id)) && (f.add(S.id), b.push(S));
    }
  }
  if (e.cards.filter((I) => f.has(I.id)).some((I) => I.allowedLaneIds && !I.allowedLaneIds.includes(o))) return null;
  const g = { ...e, cards: e.cards.map((I) => f.has(I.id) ? { ...I, laneId: o } : I) }, k = e.lanes[a].capacity;
  return k !== void 0 && ye(g, o) > k ? null : g;
}
const ro = {
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
}, ao = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function so(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const i of n.panels) {
    if (!i || typeof i.id != "string" || !/^[a-z][\w-]{0,31}$/.test(i.id) || typeof i.label != "string" || !i.label.trim() || i.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(i.artwork) || !(i.after === null || typeof i.after == "string")) return null;
    o.push({ id: i.id, label: i.label.trim(), artwork: i.artwork, after: i.after });
  }
  const t = new Map(o.map((i) => [i.id, i])), a = [...new Set(n.hung)];
  if (t.size !== o.length || a.length !== n.hung.length || a.some((i) => !t.has(i))) return null;
  for (const i of o) {
    const f = /* @__PURE__ */ new Set([i.id]);
    let b = i.after;
    for (; b !== null; ) {
      if (f.has(b) || !t.has(b) || a.includes(i.id) && !a.includes(b)) return null;
      f.add(b), b = t.get(b).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: a };
}
function ht(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function io(e, n) {
  return ht(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Gn = ["firstPrint", "secondPrint", "thirdPrint"], qn = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function lo(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...qn, route: n.route };
  for (const t of Gn) {
    const a = n[t];
    if (typeof a != "string" || !a.trim() || a.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = a.trim();
  }
  return o;
}
function co(e = new URLSearchParams()) {
  const n = { ...qn };
  for (const t of Gn) {
    const a = e.get(t)?.trim();
    a && a.length <= 48 && (n[t] = a);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function uo(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
const $ = (e) => "“" + e.replace(/[“”]/g, '"') + "”", ge = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], En = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), wn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), gn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), fo = (e) => wn(gn(e)), pt = [
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
], mt = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : pt.indexOf(e.toLowerCase()), wt = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Kn(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (a) => {
    const i = wn(a);
    i && o.add(i);
  };
  t(e), t(gn(e));
  for (const a of [...o]) t(a.replace(/^(?:the|my|our)\s+/i, ""));
  for (const a of [...o]) t(a.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const a of [...o]) t(a.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const on = "[^\\p{L}\\p{N}]", Nn = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + En(n) + "(?:$|" + on + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + on + ")" + En(n) + "(?:$|" + on + ")", "u").test(e)
], Rn = ["first", "second", "third", "fourth", "fifth"];
function gt(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Rn.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(wn(gn(n)));
  if (!t) return null;
  const a = (t[1] ?? t[2]).toLowerCase(), i = a === "last" ? e.length - 1 : t[1] ? Rn.indexOf(a) : mt(a) - 1;
  return e[i] ?? null;
}
function rn(e, n, o, t, a) {
  const i = Kn(n, o);
  if (i.some((b) => wt.test(b))) {
    const b = t && e.find((y) => y.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of i) {
    if (!b.startsWith("@")) continue;
    const y = e.find((g) => g.id === b.slice(1));
    if (y) return { item: y, rank: 0 };
  }
  for (const [b, y] of Nn.entries())
    for (const g of i) {
      const k = e.filter((I) => y(I.label.toLowerCase(), g.toLowerCase()));
      if (k.length === 1) return { item: k[0], rank: b };
      if (k.length > 1) return { several: k };
    }
  const f = a ? gt(e, n, o) : null;
  return f ? { item: f, rank: Nn.length } : {};
}
class Fe extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function un(e, n, o, t, a = !1) {
  return { find: (y) => {
    const g = rn(e, y, n, t, a);
    if (g.item) return g.item;
    const k = Kn(y, n), I = k[k.length - 1];
    if (g.pointing) throw new Fe("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (g.several) {
      const w = [...new Set(g.several.map((P) => P.label))];
      throw new Fe(w.length === 1 ? g.several.length + " " + o + "s are called " + $(w[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + $(I) + ": " + ge(w.slice(0, 6).map($)) + ". Use the whole name.", "ambiguous", g.several.map((P) => P.id));
    }
    const S = e.map((w) => w.label);
    throw new Fe("There is no " + o + " called " + $(I) + " here." + (S.length && S.length <= 6 ? " The " + o + "s are " + ge(S.map($)) + "." : S.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((w) => w.id));
  }, attempt: (y) => rn(e, y, n, t, a).item ?? null, rank: (y) => rn(e, y, n, t, a).rank ?? 1 / 0 };
}
const fe = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map"], an = ["lanes", "release-plan", "customer-interviews", "experiment-budget"];
function Ue(e) {
  return e.lanes[0]?.station ? "map" : e.kind === "release-plan" ? "release-plan" : Ce(e) ?? "lanes";
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
  mapOutcome: "A map says what happens when a token reaches a step. Change what that step says instead."
}, ee = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), Y = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ie = (e) => ({ type: "ref", of: "card", about: e }), sn = (e) => ({ map: e }), le = { lanes: F.notMap, "release-plan": F.notMap, "customer-interviews": F.notMap, "experiment-budget": F.notMap }, yn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ee(120, "The new name, 1 to 120 characters of plain text.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: Y("The lane or step."), label: ee(80, "The new name, 1 to 80 characters of plain text.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ie("The card or token."), label: ee(80, "The new name, 1 to 80 characters of plain text.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ee(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, map: F.mapAddLane }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Y("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: Y("The lane or step it starts in."),
      label: ee(80, "What the card says. On a map it may be left out: the token is numbered.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." }
    },
    boards: ["lanes", "experiment-budget", "map"],
    refusals: { "release-plan": F.releaseCards, "customer-interviews": F.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ie("The card or token.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: ie("The card or token."), lane: Y("Where it goes.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ie("The token.") },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: Y("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: fe,
    refusals: {}
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ie("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: an,
    refusals: sn(F.mapCardLanes)
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ie("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { lanes: F.notPoints, "customer-interviews": F.notPoints, "experiment-budget": F.notPoints, map: F.mapPoints }
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
    refusals: { lanes: F.notDepends, "customer-interviews": F.notDepends, "experiment-budget": F.notDepends, map: F.notDepends }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ie("The card."),
      lane: Y("The lane."),
      whenPresent: ee(160, "What it says when the card is there."),
      whenAbsent: ee(160, "What it says otherwise."),
      label: ee(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: an,
    refusals: sn(F.mapOutcome)
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ie("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: an,
    refusals: sn(F.mapOutcome)
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: fe,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: Y("The lane or step."), before: Y("Present it just before this one.", !0), after: Y("Present it just after this one.", !0) },
    boards: fe,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: Y("The step it follows."), label: ee(80, "The new step’s name."), outcome: ee(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: Y("The step it goes in front of."),
      from: Y("Only the path from this step is taken over.", !0),
      label: ee(80, "The new step’s name."),
      outcome: ee(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: Y("Where the path starts."), to: Y("Where it leads.") },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: Y("Where the path starts."), to: Y("Where it leads.") },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: Y("The step."), outcome: ee(160, "What it says.") },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: Y("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: Y("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: Y("The step."), alt: ee(240, "What the picture shows.") },
    boards: ["map"],
    refusals: le
  }
], yt = new Map(yn.map((e) => [e.kind, e])), bt = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function kt(e, n) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, t = (a, i) => i ? { anyOf: [a, { type: "null" }] } : a;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...t({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...t({ type: "integer", minimum: e.min, maximum: bt(e.max, n) }, e.nullable), description: e.about };
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
const Yn = (e) => "optional" in e && e.optional === !0;
function ho(e) {
  const n = e ? Ue(K(e)) : void 0;
  return yn.map((o) => {
    const t = Object.entries(o.fields), a = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, f]) => !Yn(f)).map(([f]) => f)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([f, b]) => [f, kt(b, n)])) }
    }, i = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: a };
    return n && (i.accepted = o.boards.includes(n), i.accepted || (i.refusal = o.refusals[n])), i;
  });
}
const We = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?",
  card: "cards?|features?|notes?|items?|tasks?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function vt(e, n) {
  const o = !!e.lanes[0]?.station, t = un(e.lanes, o ? We.step : We.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), a = un(e.cards, o ? We.token : We.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: a };
  const i = (f) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(f.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (f) => i(f) ?? a.find(f),
    attempt: (f) => i(f) ?? a.attempt(f),
    rank: (f) => i(f) ? 0 : a.rank(f)
  } };
}
class R {
  constructor(n, o, t = null, a, i) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = a, this.candidates = i;
  }
}
function Ge(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function B(e, n, o = null, t) {
  try {
    return K(e);
  } catch (a) {
    throw new R(Ge(a instanceof Error ? a.message : String(a), n), "refused", o, t);
  }
}
function It(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, a] of Object.entries(n.fields)) {
    const i = e[t];
    if (i === void 0) {
      if (Yn(a)) continue;
      return n.kind + " needs " + t + ".";
    }
    const f = n.kind + " needs " + t + " as ";
    switch (a.type) {
      case "text":
        if (typeof i != "string") return f + "text.";
        break;
      case "ref":
        if (!o(i)) return f + "an id or a name.";
        break;
      case "refs":
        if (i === null && a.nullable) break;
        if (!Array.isArray(i) || i.length > a.max || !i.every(o)) return f + "a list of up to " + a.max + " ids or names" + (a.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (i === null && a.nullable) break;
        if (typeof i != "number" || !Number.isFinite(i)) return f + "a number" + (a.nullable ? " or null." : ".");
        break;
      case "image":
        if (i === null) break;
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((b) => b !== "src" && b !== "alt")) return f + "{src, alt} or null.";
        break;
      case "choice":
        if (!a.values.includes(i)) return f + a.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function xt(e, n, o, t) {
  const a = structuredClone(e), i = o === "map", f = o === "release-plan", b = vt(a, t), y = { lane: i ? "step" : "lane", card: i ? "token" : "card" };
  function g(r, m, v, A, T = null) {
    if (typeof v == "object") {
      const M = r.find((U) => U.id === v.id);
      if (!M) throw new R("That " + A + " is no longer on the workshop.", "gone", T);
      return M;
    }
    const O = r.find((M) => M.id === v);
    if (O) return O;
    try {
      return m.find(v);
    } catch (M) {
      if (!(M instanceof Fe)) throw M;
      const U = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new R(M.message, U, T, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const k = (r, m = null) => g(a.lanes, b.lanes, r, "lane", m), I = (r, m = null) => g(a.cards, b.cards, r, "card", m), S = (r) => {
    try {
      return k(r);
    } catch {
      return null;
    }
  }, w = (r, m, v = {}, A = !0) => ({ board: r, said: m, changed: A, ...v }), P = (r) => a.cards.filter((m) => m.laneId === r).length, N = (r) => i ? "The presentation opens with " + $(r[0].label) + "." : "The presentation now runs " + r.map((m) => $(m.label)).join(", then ") + ".";
  switch (n.kind) {
    case "rename_workshop": {
      a.title = n.title;
      const r = B(a, o);
      return w(r, "Renamed the " + (i ? "map" : "workshop") + " to " + $(r.title) + ".");
    }
    case "rename_lane": {
      const r = k(n.lane), m = r.label;
      r.label = n.label;
      const v = B(a, o, r.id);
      return w(v, "Renamed " + $(m) + " to " + $(v.lanes.find((A) => A.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = I(n.card), m = r.label;
      r.label = n.label;
      const v = B(a, o, r.laneId, r.id);
      return w(v, "Renamed " + $(m) + " to " + $(v.cards.find((A) => A.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new R("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new R("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Bt(a, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (v) {
        throw new R(Ge(v.message, o), "refused");
      }
      const m = r.lanes[r.lanes.length - 1];
      return w(r, "Added the lane " + $(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const r = k(n.lane), m = a.cards.filter((v) => v.laneId === r.id);
      if (i) {
        if (m.length) throw new R($(m[0].label) + " is at " + $(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new R("A map needs at least two steps.", "refused", r.id);
      } else {
        if (m.length) throw new R($(r.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new R("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((v) => v !== r);
      for (const v of a.lanes) v.station && (v.station.next = v.station.next.filter((A) => A !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((v) => v !== r.id));
      for (const v of a.cards) v.allowedLaneIds && (v.allowedLaneIds = v.allowedLaneIds.filter((A) => A !== r.id));
      return ze(a, (v) => v.laneId === r.id), w(B(a, o), "Removed the " + y.lane + " " + $(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = k(n.lane);
      if (i) {
        if (n.allowedLanes !== void 0) throw new R(F.mapCardLanes, "not_on_this_board", r.id);
        let T = n.label;
        if (T === void 0) {
          let _ = a.cards.length + 1;
          for (; a.cards.some((z) => z.label === "Token " + _); ) _++;
          T = "Token " + _;
        }
        const O = new Set([...a.lanes, ...a.cards].map((_) => _.id));
        let M = 1;
        for (; O.has("token-" + M); ) M++;
        a.cards.push({ id: "token-" + M, label: T, laneId: r.id });
        const U = B(a, o, r.id);
        return w(U, "Added " + $(U.cards[U.cards.length - 1].label) + " at " + $(r.label) + ".", { laneId: r.id, cardId: "token-" + M });
      }
      if (n.label === void 0 || !n.label.trim()) throw new R("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new R("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && P(r.id) >= r.capacity)
        throw new R($(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map((T) => k(T).id))];
      let v;
      try {
        v = Ut(a, r.id, { label: n.label, ...m && { allowedLaneIds: m } });
      } catch (T) {
        throw new R(Ge(T.message, o), "refused", r.id);
      }
      const A = v.cards[v.cards.length - 1];
      return w(v, "Added " + $(A.label) + " to " + $(r.label) + ".", { laneId: r.id, cardId: A.id });
    }
    case "remove_card": {
      const r = I(n.card);
      if (i && a.cards.length === 1) throw new R("A map needs at least one token.", "refused", r.laneId, r.id);
      if (f && a.cards.length === 1) throw new R("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((m) => m !== r);
      for (const m of a.cards)
        m.dependsOn?.includes(r.id) && (m.dependsOn = m.dependsOn.filter((v) => v !== r.id), m.dependsOn.length || delete m.dependsOn);
      return ze(a, (m) => m.cardId === r.id), w(B(a, o, r.laneId), "Removed the " + y.card + " " + $(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? a.lanes.find((A) => A.id === n.lane.id) ?? null : S(n.lane), m = I(n.card, r?.id ?? null), v = k(n.lane, m.laneId);
      return G(m, v);
    }
    case "advance_card": {
      const r = I(n.card), m = a.lanes.find((A) => A.id === r.laneId), v = m.station.next.map((A) => a.lanes.find((T) => T.id === A)).filter((A) => !!A);
      if (!v.length) throw new R($(r.label) + " is at " + $(m.label) + ", and no path leads on from there.", "refused", m.id, r.id);
      if (v.length > 1)
        throw new R("From " + $(m.label) + " the path goes to " + v.map((A) => $(A.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + v[0].label + "”.", "refused", m.id, r.id);
      return G(r, v[0]);
    }
    case "set_lane_capacity": {
      const r = k(n.lane), m = i ? "token" : f ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, w(B(a, o, r.id), i ? "Removed the limit at " + $(r.label) + "." : $(r.label) + " now holds any number of " + m + "s.", { laneId: r.id });
      const v = f ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > v)
        throw new R((i ? "A step" : "A lane") + " can hold from 1 to " + v + " " + m + "s.", "refused", r.id);
      const A = f ? a.cards.reduce((T, O) => T + (O.laneId === r.id ? O.points ?? 1 : 0), 0) : P(r.id);
      if (A > n.capacity)
        throw new R($(r.label) + " already holds " + A + " " + m + (A === 1 ? "" : "s") + ". Move some " + (i ? "on" : "out") + " first, or choose a higher " + (f ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, w(B(a, o, r.id), $(r.label) + " now holds up to " + n.capacity + " " + m + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = I(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, w(B(a, o, r.laneId, r.id), $(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const m = [...new Set(n.lanes.map((A) => k(A)))], v = a.lanes.find((A) => A.id === r.laneId);
      if (!m.includes(v)) throw new R($(r.label) + " is in " + $(v.label) + " now. Include " + $(v.label) + ", or move the card first.", "refused", v.id, r.id);
      return r.allowedLaneIds = m.map((A) => A.id), w(B(a, o, r.laneId, r.id), $(r.label) + " can now go only in " + ge(m.map((A) => $(A.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = I(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new R("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, w(B(a, o, r.laneId, r.id), $(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = I(n.card), m = [...new Set(n.dependsOn.map((A) => I(A)))], v = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const A = m.filter((T) => r.dependsOn?.includes(T.id));
        if (!A.length) throw new R($(r.label) + " does not depend on " + ge(m.map((T) => $(T.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((T) => !A.some((O) => O.id === T)), r.dependsOn.length || delete r.dependsOn, w(B(a, o, r.laneId, r.id), $(r.label) + " no longer depends on " + ge(A.map((T) => $(T.label))) + ".", v);
      }
      if (!m.length) {
        if (n.mode === "add") throw new R("Name the features " + $(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, w(B(a, o, r.laneId, r.id), $(r.label) + " no longer depends on anything.", v);
      }
      if (m.includes(r)) throw new R("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...m.map((A) => A.id)])], w(B(a, o, r.laneId, r.id), $(r.label) + " now depends on " + ge(m.map((A) => $(A.label))) + ".", v);
    }
    case "set_outcome": {
      const r = I(n.card), m = k(n.lane), v = a.signals ?? (a.signals = []), A = n.label, T = A === void 0 ? v.filter((_) => _.cardId === r.id && _.laneId === m.id) : v.filter((_) => _.cardId === r.id && _.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && T.length > 1) throw new R("Two outcomes on this card have that name.", "refused", m.id, r.id);
      if (!T.length && v.length >= 24) throw new R("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, r.id);
      let O = 1;
      for (; v.some((_) => _.id === "signal-" + O); ) O++;
      const U = { label: A ?? T[0]?.label ?? (r.label + " in " + m.label).slice(0, 80).trim(), cardId: r.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return T.length ? Object.assign(T[0], U) : v.push({ id: "signal-" + O, ...U }), w(B(a, o, m.id, r.id), "When " + $(r.label) + " is in " + $(m.label) + " the workshop says " + $(n.whenPresent) + ". Otherwise it says " + $(n.whenAbsent) + ".", { laneId: m.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = I(n.card), m = (a.signals ?? []).filter((v) => v.cardId === r.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new R($(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        ze(a, (v) => v.cardId === r.id);
      } else {
        const v = g(m, un(m, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        ze(a, (A) => A.id === v.id);
      }
      return w(B(a, o, r.laneId, r.id), "Removed the outcome from " + $(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((m) => k(m));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new R("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((m) => m.id), w(B(a, o), N(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new R("Say before or after, not both.", "invalid_edit");
      const r = k(n.lane), m = n.before ?? n.after, v = m === void 0 ? void 0 : k(m);
      if (v && v.id === r.id) throw new R("Choose two different scenes.", "refused", r.id);
      const A = kn(a).filter((T) => T.id !== r.id);
      return A.splice(v ? A.findIndex((T) => T.id === v.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = A.map((T) => T.id), w(B(a, o, r.id), N(A), { laneId: r.id });
    }
    case "add_station": {
      const r = k(n.from);
      let m;
      try {
        m = jn(a, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new R(A.message, "refused", r.id);
      }
      const v = m.lanes[m.lanes.length - 1];
      return w(m, "Added a path from " + $(r.label) + " to " + $(v.label) + ".", { laneId: v.id });
    }
    case "insert_station": {
      const r = k(n.before), m = n.from === void 0 ? void 0 : k(n.from), v = m ? [m] : a.lanes.filter((O) => O.station.next.includes(r.id));
      if (m && !m.station.next.includes(r.id))
        throw new R("There is no path from " + $(m.label) + " to " + $(r.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!v.length) throw new R("Nothing leads to " + $(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let A;
      try {
        A = jn(a, v[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (O) {
        throw new R(O.message, "refused", r.id);
      }
      const T = A.lanes[A.lanes.length - 1];
      for (const O of A.lanes)
        v.some((M) => M.id === O.id) && (O.station.next = [...new Set(O.station.next.map((M) => M === r.id ? T.id : M))]);
      return T.station.next = [r.id], w(B(A, o, T.id), "Added " + $(T.label) + " before " + $(r.label) + ".", { laneId: T.id });
    }
    case "connect_stations": {
      const r = k(n.from), m = k(n.to);
      if (r.id === m.id) throw new R("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(m.id) ? w(a, $(r.label) + " already leads to " + $(m.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(m.id), w(B(a, o, r.id), "Connected " + $(r.label) + " to " + $(m.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = k(n.from), m = k(n.to);
      if (!r.station.next.includes(m.id)) throw new R("There is no path between " + $(r.label) + " and " + $(m.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((v) => v !== m.id), w(B(a, o, r.id), "Removed the path from " + $(r.label) + " to " + $(m.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = k(n.station);
      return r.station.outcome = n.outcome, w(B(a, o, r.id), "Changed what happens at " + $(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = k(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), w(B(a, o, r.id), "Moved " + $(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = k(n.station);
      return n.image === null ? (delete r.station.image, w(B(a, o, r.id), "Removed the image at " + $(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, w(B(a, o, r.id), "Updated the image at " + $(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = k(n.station);
      if (!r.station.image) throw new R("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, w(B(a, o, r.id), "Updated the image description at " + $(r.label) + ".", { laneId: r.id });
    }
  }
  function G(r, m) {
    const v = { laneId: m.id, cardId: r.id };
    if (r.laneId === m.id)
      return w(e, $(r.label) + " is already " + (i ? "at " : "in ") + $(m.label) + ".", v, !1);
    const A = xe(e, r.id, m.id);
    if (!A) throw new R(He(e, r.id, m.id) ?? "That move is not available.", "refused", m.id, r.id);
    return w(B(A, o, m.id, r.id), "Moved " + $(r.label) + " to " + $(m.label) + ".", v);
  }
}
function ze(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function Ct(e, n, o = {}) {
  const t = (g) => ({ refused: { index: 0, kind: null, laneId: null, ...g } });
  let a;
  try {
    a = K(e);
  } catch (g) {
    return t({ reason: "The workshop cannot be read: " + (g instanceof Error ? g.message : String(g)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = a, f = [];
  for (const [g, k] of n.entries()) {
    const I = k?.kind, S = typeof I == "string" ? yt.get(I) : void 0;
    if (!k || typeof k != "object" || !S)
      return t({
        index: g,
        kind: typeof I == "string" ? I : null,
        code: "invalid_edit",
        reason: "There is no edit called " + $(String(I)) + ". The edits are " + ge(yn.map((r) => r.kind)) + "."
      });
    const w = It(k, S);
    if (w) return t({ index: g, kind: S.kind, code: "invalid_edit", reason: w });
    const P = Ue(a);
    if (!S.boards.includes(P))
      return t({ index: g, kind: S.kind, code: "not_on_this_board", reason: S.refusals[P] ?? "This workshop does not take " + S.kind + "." });
    let N;
    try {
      N = xt(a, k, P, o.selection);
    } catch (r) {
      if (!(r instanceof R)) throw r;
      return t({
        index: g,
        kind: S.kind,
        reason: r.reason,
        code: r.code,
        laneId: r.laneId,
        ...r.cardId && { cardId: r.cardId },
        ...r.candidates && { candidates: r.candidates }
      });
    }
    const G = At(a, N.board);
    if (G) return t({ index: g, kind: S.kind, reason: G, code: "not_on_this_board", laneId: N.laneId ?? null });
    a = N.board, f.push({
      index: g,
      kind: S.kind,
      said: N.said,
      changed: N.changed ?? !0,
      ...N.laneId && { laneId: N.laneId },
      ...N.cardId && { cardId: N.cardId }
    });
  }
  const b = new Map(i.cards.map((g) => [g.id, g.laneId])), y = a.cards.flatMap((g) => {
    const k = b.get(g.id);
    return k === void 0 || k === g.laneId ? [] : [{ cardId: g.id, fromLaneId: k, toLaneId: g.laneId }];
  });
  return { workshop: a, report: { edits: f, movedCards: y } };
}
const St = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map"
};
function At(e, n) {
  const o = K(e), t = Ue(o);
  let a;
  try {
    a = K(n);
  } catch (y) {
    return Ge(y instanceof Error ? y.message : String(y), t);
  }
  const i = Ue(a), f = (y, g) => y.lanes.length === g.lanes.length && y.lanes.every((k) => g.lanes.some((I) => I.id === k.id)), b = (y, g) => y.lanes.every((k, I) => g.lanes[I]?.id === k.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && i !== t)
    return f(o, a) ? F.keepsCards : F.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, a)) return F.keepsOrder;
  if (t === "release-plan" && i === "release-plan") {
    if (!f(o, a)) return F.releaseLanes;
    if (!b(o, a)) return F.releaseOrder;
    if (a.cards.some((y) => !o.cards.some((g) => g.id === y.id))) return F.releaseCards;
  }
  return t !== i ? "This slate holds a " + St[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
function Tt(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Ot(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), Pt(n), n;
}
function $t(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function Pt(e) {
  return e && $t(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Mn(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Lt(e) {
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
function Ot(e) {
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
function ln() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const _n = "#1f7a5c", Wn = "#5b9a85", dn = "#c2410c", Et = "#2f5fd0", Nt = { canMove: !1, canSelect: !1 };
function Rt(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function po(e, n, o = {}) {
  let t = K(n), a = null, i = !!o.readOnly, f = !1;
  const b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  let S = null, w = null, P = null;
  const N = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map();
  let r = null, m = Promise.resolve(), v = null, A = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const T = { ...o.style };
  let O = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), U = null, _ = !1;
  se(t, { layout: A });
  const z = o.origin ? { x: o.origin.x, y: o.origin.y } : _t(e), Q = (s) => I.get(s) ?? s, X = (s) => Rt(Q(s));
  function J(s) {
    const d = k.get(s);
    if (d) return d;
    if (b.has(s) && !I.has(s) || !e.nodes.one?.(s)) return s;
    const c = tt(s, (p) => !!e.nodes.one?.(p) || I.has(p));
    return k.set(s, c), I.set(c, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${c}".`), c;
  }
  const re = {
    governs(s) {
      if (b.get(s.id) !== s) return null;
      const d = X(s.id)?.kind;
      return d === "card" ? { canMove: !i, canEditText: !i && !a && t.kind !== "release-plan" } : d === "lane" ? { canMove: !1, canEditText: !i && !a } : Nt;
    },
    onStart(s, d) {
      const c = X(s.id).key;
      if (i || a || !t.cards.some((l) => l.id === c)) return !1;
      Z(), be();
      const p = { x: d.x - (s.options.x ?? 0), y: d.y - (s.options.y ?? 0) };
      let C = null;
      try {
        C = o.chooseCandidate?.(t, c, p) ?? null;
      } catch (l) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", l);
      }
      return S = { cardId: c, evaluate: C, outcome: { kind: "home" } }, H(t, { skip: c }), !0;
    },
    onMove(s, d) {
      if (!S) return;
      const c = In(S.cardId, d, S.evaluate);
      if (Mt(c, S.outcome)) return;
      S.outcome = c;
      const p = c.kind === "candidate" ? c.next : null;
      H(p ?? t, { skip: S.cardId }), D(o.onPreview, p);
    },
    onEnd(s, d) {
      if (!S) return { accept: !1 };
      const { cardId: c, evaluate: p } = S, C = In(c, d, p), l = t.cards.find((u) => u.id === c);
      if (S = null, D(o.onPreview, null), C.kind === "candidate") {
        t = C.next, H(t, { skip: c });
        const u = t.lanes.find((x) => x.id === C.laneId);
        e.announce?.(`${l.label} moved to ${u.label}. ${ce(t, u.id)}.`), D(o.onChange, t, { cardId: c, laneId: C.laneId });
        const h = ut(t, Q(s.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (C.kind === "refused")
        dt(l.label, { cardId: c, laneId: C.laneId, reason: C.reason });
      else if (C.kind === "outside" && je(t) && !Qe()) {
        const u = De(t, c);
        if (!u)
          return tn(c, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        H(t, { skip: c }), e.announce?.(u), D(o.onRefuse, { cardId: c, laneId: null, reason: u });
      } else
        H(t, { skip: c }), C.kind === "outside" && (e.announce?.(`${l.label} was not dropped on a lane. It stays where it was.`), D(o.onRefuse, { cardId: c, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      const d = S && t.cards.find((c) => c.id === S.cardId);
      S = null, D(o.onPreview, null), H(t, { skip: X(s.id)?.key }), d && e.announce?.(`Move cancelled. ${d.label} stays where it was.`);
    },
    onTextCommit(s, d, c) {
      const p = X(s.id);
      if (!p || i || a) return !1;
      const C = d.replace(/\s+/g, " ").trim(), l = p.kind === "lane" ? { laneId: p.key, label: C } : { cardId: p.key, label: C }, u = Ct(t, [p.kind === "lane" ? { kind: "rename_lane", lane: { id: p.key }, label: C } : { kind: "rename_card", card: { id: p.key }, label: C }]);
      if ("refused" in u) {
        const { reason: h } = u.refused;
        return e.announce?.(`${c} keeps its name. ${h}`), D(o.onRefuse, { ...p.kind === "lane" ? { laneId: p.key } : { cardId: p.key }, rename: l, reason: h }), !1;
      }
      return C === c ? !1 : (t = u.workshop, H(t), e.announce?.(`${c} renamed to ${C}.`), D(o.onChange, t, { rename: l }), C);
    },
    onKeyDown(s, d) {
      const c = X(s.id);
      if (c?.kind !== "card" || i || a || S || d.ctrlKey || d.metaKey || d.altKey) return !1;
      const p = t.cards.find((C) => C.id === c.key);
      if (!p) return !1;
      if (d.key === "ArrowLeft" || d.key === "ArrowRight")
        return d.preventDefault(), xn(p.id, d.key === "ArrowLeft" ? -1 : 1), !0;
      if ((d.key === "ArrowUp" || d.key === "ArrowDown") && rt())
        return d.preventDefault(), xn(p.id, d.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (w?.cardId !== p.id) return !1;
      if (d.key === "Enter") {
        d.preventDefault();
        const { laneId: C, next: l, spot: u } = w;
        if (w = null, C === null)
          return D(o.onPreview, null), tn(p.id, u), !0;
        t = l, H(t), pe(C), D(o.onPreview, null);
        const h = t.lanes.find((x) => x.id === C);
        return e.announce?.(`${p.label} moved to ${h.label}. ${ce(t, C)}.`), D(o.onChange, t, { cardId: p.id, laneId: C }), !0;
      }
      return d.key === "Escape" ? (d.preventDefault(), be(), e.announce?.(`Move cancelled. ${p.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((d) => b.get(d.id) === d).map((d) => d.id);
      _ = s.length === 1, b.clear(), y.clear(), g.clear(), k.clear(), I.clear(), S = null, w = null, H(a ?? t, { animate: !1 }), s.length === 1 && (m = m.then(() => {
        _ = !1;
        const d = b.get(s[0]);
        if (!f && d && !(e.getSelectedNodes?.() ?? []).length) {
          const c = () => e.selectNodes?.([d]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
        }
        Je();
      }));
    }
  };
  re.onFreeMove = (s, d) => {
    if (!Ee() || s.options?.isComment) return Xe();
    const c = Ne(d), p = Re(s), C = t.lanes.filter((u) => !Te(s) && ve(t, u.id, p) === null).map((u) => u.id), l = c ? Te(s) ?? ve(t, c, p) : null;
    P && P.noteId === s.id && P.laneId === c && P.refusal === l || (P = { noteId: s.id, laneId: c, refusal: l, open: C }, me());
  }, re.onFreeDrop = (s, d, c) => {
    if (Xe(), !Ee() || s.options?.isComment) return;
    const p = Ne(d);
    if (!p) return;
    const C = Re(s), l = t.lanes.find((h) => h.id === p), u = Te(s) ?? ve(t, p, C);
    return u ? (Z(!1), r = { laneId: p, reason: u, timer: setTimeout(() => Z(), 1500) }, me(), e.announce?.(`${en(C.label)} can't go in ${l.label}. ${u}`), D(o.onRefuse, { noteId: s.id, laneId: p, reason: u }), "refused") : (nn([{ node: s, offer: C, from: c }], p), "taken");
  }, re.onFreeGroupDrop = (s, d, c) => {
    if (Xe(), !Ee() || s.some((h) => h.options?.isComment)) return;
    const p = Ne(d);
    if (!p) return;
    const C = t.lanes.find((h) => h.id === p), l = s.map((h) => ({ node: h, offer: Re(h) })), u = st(l, p);
    if (u) {
      Z(!1), r = { laneId: p, reason: u, timer: setTimeout(() => Z(), 1500) }, me(), e.announce?.(`${Cn(l.map((h) => en(h.offer.label)))} can't go in ${C.label}. ${u}`);
      for (const { node: h } of l) D(o.onRefuse, { noteId: h.id, laneId: p, reason: u });
      return "refused";
    }
    return nn(l.map((h, x) => ({ ...h, from: c?.[x] })), p), "taken";
  }, re.onFreeTextCommit = (s) => {
    if (!Ee() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const d = s.options ?? {}, c = Ne({ x: (d.x ?? 0) + (d.width ?? 0) / 2, y: (d.y ?? 0) + (d.height ?? 0) / 2 });
    if (!c) return;
    const p = Re(s), C = t.lanes.find((E) => E.id === c), l = Te(s) ?? ve(t, c, p);
    if (!l) {
      nn([{ node: s, offer: p }], c);
      return;
    }
    Z(!1), r = { laneId: c, reason: l, timer: setTimeout(() => Z(), 1500) }, me(), e.announce?.(`${en(p.label)} can't go in ${C.label}. ${l} It is beside the board.`), D(o.onRefuse, { noteId: s.id, laneId: c, reason: l });
    const { width: u } = se(t, { layout: A }), h = Math.round(z.x + u + 32), x = Math.round(d.y ?? z.y);
    s.position(h, x, () => e.updateSelectionResizeRotate?.(), void 0, ln() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Mn({ ...s.options, x: h, y: x })] });
  }, re.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...N] }), re.onUndoRestore = (s, d) => {
    if (f) return;
    const c = new Map((s?.cards ?? []).map((l) => [l.id, l])), p = new Map(s?.pairs ?? []), C = (l) => N.get(l) ?? p.get(l) ?? l;
    for (const l of d.added) {
      const u = C(l), h = t.cards.find((E) => E.id === u);
      if (!h) continue;
      t = K({ ...t, cards: t.cards.filter((E) => E !== h) }), H(t);
      const x = D(o.onChange, t, { cardId: u, cardToNote: { noteId: l } });
      e.holdTrade?.(l, x), zn(x);
    }
    for (const l of d.removed) {
      const u = C(l), h = c.get(u);
      if (!h || t.cards.some((q) => q.id === u)) continue;
      const x = { id: u, label: h.label, ...h.look ? { look: h.look } : {}, ...h.asNote ? { asNote: h.asNote } : {} }, E = [h.laneId, ...t.lanes.map((q) => q.id)].find((q) => Pe(t, q, x));
      if (!E) {
        e.announce?.(`${h.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = it(Pe(t, E, x), u, s?.cards ?? []), u !== l && N.set(l, u), H(t);
      const L = t.cards.findIndex((q) => q.id === u), j = t.cards.slice(L + 1).find((q) => q.laneId === E)?.id, W = D(o.onChange, t, { cardId: u, laneId: E, noteToCard: {
        noteId: l,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...j ? { before: j } : {}
      } });
      e.holdTrade?.(l, W), zn(W);
    }
  };
  const Se = e.setDragPolicy(re), te = o.onSelect && e.onSelectionChange?.(() => Je()), Ae = () => {
    w && be();
  };
  e.element?.addEventListener?.("pointerdown", Ae, !0), H(t, { animate: !1 });
  function In(s, d, c) {
    const p = t.cards.find((L) => L.id === s);
    if (!p) return { kind: "outside" };
    const C = t.lanes.map((L) => b.get(J(ne.column(L.id)))).filter(Boolean), l = e.hitTestNodes(d, C, { padding: 6 }), u = l ? X(l.id).key : null;
    if (!u) return { kind: "outside" };
    if (u === p.laneId) return { kind: "home" };
    const h = xe(t, s, u);
    if (!h) return { kind: "refused", laneId: u, reason: He(t, s, u) ?? "That move is not available." };
    if (!c) return { kind: "candidate", laneId: u, next: h };
    let x = null;
    try {
      x = c({ x: d.x - z.x, y: d.y - z.y });
    } catch (L) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", L), { kind: "candidate", laneId: u, next: h };
    }
    const E = x?.cards.find((L) => L.id === s)?.laneId;
    return !x || !E || E === p.laneId ? { kind: "home" } : { kind: "candidate", laneId: E, next: x };
  }
  function rt() {
    return new Set(se(t, { layout: A }).places.map((s) => s.row)).size > 1;
  }
  function xn(s, d, c = !1) {
    const p = t.cards.find((L) => L.id === s), C = Fn(t, s), l = w?.cardId === s && w.laneId === null ? w.side : void 0;
    if (l !== void 0) {
      if (c || d === l) return;
      const L = l > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (be(), L.id === p.laneId) {
        pe(L.id, a ?? t), e.announce?.(`${p.label} is back in ${L.label}.`);
        return;
      }
      if (C.includes(L)) {
        const W = xe(t, s, L.id);
        w = { cardId: s, laneId: L.id, next: W }, H(W), pe(L.id, W), D(o.onPreview, W), e.announce?.(`${p.label} to ${L.label}: ${ce(W, L.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const j = He(t, s, L.id) ?? "That move is not available.";
      Z(), r = { laneId: L.id, reason: j, timer: setTimeout(() => Z(), 1500) }, H(a ?? t), pe(L.id, a ?? t), e.announce?.(`${p.label} can't move to ${L.label}. ${j}`), D(o.onRefuse, { cardId: s, laneId: L.id, reason: j });
      return;
    }
    const u = w?.cardId === s ? w.laneId : p.laneId;
    let h;
    if (c) {
      const { places: L } = se(t, { layout: A }), j = L.find((W) => W.laneId === u);
      h = L.filter((W) => W.column === j.column && (W.row - j.row) * d > 0).sort((W, q) => (W.row - q.row) * d).map((W) => t.lanes.find((q) => q.id === W.laneId));
    } else {
      const L = t.lanes.findIndex((j) => j.id === u);
      h = d > 0 ? t.lanes.slice(L + 1) : t.lanes.slice(0, L).reverse();
    }
    const x = h.find((L) => C.includes(L));
    if (Z(), !x) {
      const L = h[0];
      if (!L) {
        if (!c && je(t)) {
          const W = De(t, s);
          if (W) {
            e.announce?.(W), D(o.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          at(p, d);
          return;
        }
        e.announce?.(`${p.label} has no lane to move to on that side.`);
        return;
      }
      const j = He(t, s, L.id) ?? "That move is not available.";
      r = { laneId: L.id, reason: j, timer: setTimeout(() => Z(), 1500) }, H(w?.next ?? a ?? t), pe(L.id, w?.next ?? a ?? t), e.announce?.(`${p.label} can't move to ${L.label}. ${j}`), D(o.onRefuse, { cardId: s, laneId: L.id, reason: j });
      return;
    }
    if (x.id === p.laneId) {
      be(), pe(x.id, a ?? t), e.announce?.(`${p.label} is back in ${x.label}.`);
      return;
    }
    const E = xe(t, s, x.id);
    w = { cardId: s, laneId: x.id, next: E }, H(E), pe(x.id, E), D(o.onPreview, E), e.announce?.(`${p.label} to ${x.label}: ${ce(E, x.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function pe(s, d = t) {
    const c = se(d, { layout: A, rows: Tn() }).places.find((x) => x.laneId === s), p = e.canvas?.viewbox?.();
    if (!c || !p || !(p.width > 0) || !(p.height > 0)) return;
    const C = 16, l = (x, E, L, j) => E + C * 2 >= j || x - C < L ? x - C - L : x + E + C > L + j ? x + E + C - (L + j) : 0, u = l(z.x + c.x, c.width, p.x, p.width), h = l(z.y + c.y, c.height, p.y, p.height);
    (u || h) && e.panBy?.({ x: u, y: h });
  }
  function Je() {
    if (!o.onSelect || _) return;
    const s = f ? [] : e.getSelectedNodes?.() ?? [], d = s.length === 1 && b.get(s[0].id) === s[0] ? X(s[0].id) : null, c = d?.kind === "card" ? { cardId: d.key } : d?.kind === "lane" ? { laneId: d.key } : null, p = c ? JSON.stringify(c) : null;
    p !== U && (U = p, D(o.onSelect, c));
  }
  function be() {
    w && (w = null, D(o.onPreview, null), H(a ?? t));
  }
  function at(s, d) {
    const { width: c } = se(t, { layout: A }), p = b.get(J(ne.card(s.id)))?.options, C = p?.width ?? 228, l = { x: d > 0 ? z.x + c + 32 : z.x - C - 32, y: p?.y ?? z.y }, u = Hn(t, s.id);
    w = { cardId: s.id, laneId: null, side: d, spot: l, next: t }, H(t), D(o.onPreview, u), e.announce?.(`${s.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Qe() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ee() {
    return !f && !i && !a && !S && !Qe() && je(t);
  }
  function Xe() {
    P && (P = null, f || me());
  }
  function Ne(s) {
    const d = t.lanes.map((p) => b.get(J(ne.column(p.id)))).filter(Boolean), c = e.hitTestNodes(s, d, { padding: 6 });
    return c ? X(c.id)?.key ?? null : null;
  }
  function Re(s) {
    const d = s.options ?? {}, c = Ft({
      backgroundColor: d.backgroundColor,
      textColor: d.fontColor,
      fontFamily: d.fontFamily,
      fontSize: d.fontSize,
      borderColor: d.borderColor,
      borderWidth: d.borderWidth
    }), p = String(d.text ?? ""), C = p.replace(/\s+/g, " ").trim(), l = {};
    p.trim() !== C && p.length <= 400 && (l.text = p.trim()), typeof d.shape == "string" && /^[a-z]{1,24}$/i.test(d.shape) && (l.shape = d.shape);
    for (const u of ["width", "height"]) Number.isFinite(d[u]) && d[u] >= 10 && d[u] <= 4e3 && (l[u] = Math.round(d[u]));
    return { id: s.id, label: C, ...c ? { look: c } : {}, ...Object.keys(l).length ? { asNote: l } : {} };
  }
  function Cn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function st(s, d) {
    for (const { node: l } of s) {
      const u = Te(l);
      if (u) return u;
    }
    const c = t.lanes.find((l) => l.id === d), p = t.cards.filter((l) => l.laneId === d).length;
    if (c.capacity !== void 0 && p + s.length > c.capacity) {
      const l = c.capacity - p;
      return l > 0 ? `It has room for ${l} more ${l === 1 ? "card" : "cards"}.` : `It already holds ${p} of ${c.capacity} ${c.capacity === 1 ? "card" : "cards"}.`;
    }
    let C = t;
    for (const { offer: l } of s) {
      const u = ve(C, d, l);
      if (u) return u;
      C = Pe(C, d, l);
    }
    return null;
  }
  function Te(s) {
    return (s.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((c) => c !== s && (c.relationships?.associations ?? []).some((p) => p.child === s || p.childId === s.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : s.options?.image ? "A note with a picture stays a note." : s.options?.link?.show && s.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const en = (s) => s || "This note";
  function nn(s, d) {
    let c = t;
    const p = s.map(({ node: u, offer: h, from: x }) => {
      c = Pe(c, d, h);
      const E = { ...u.options ?? {}, ...x ? { x: x.x, y: x.y } : {} };
      return { node: u, card: c.cards[c.cards.length - 1], kept: E };
    });
    e.beginHostStep?.(), t = c;
    let C = t;
    for (const { node: u, card: h } of p)
      h.id !== u.id && N.set(u.id, h.id), G.set(J(ne.card(h.id)), { x: u.options?.x ?? 0, y: u.options?.y ?? 0 }), Me(() => e.removeNode(u.id));
    e.endHostStep?.(), H(t), lt(J(ne.card(p[0].card.id)));
    const l = t.lanes.find((u) => u.id === d);
    e.announce?.(p.length === 1 ? `${p[0].card.label} is now a card in ${l.label}. ${ce(t, d)}.` : `${Cn(p.map(({ card: u }) => u.label))} are now cards in ${l.label}. ${ce(t, d)}.`);
    for (const { node: u, card: h, kept: x } of p) {
      const E = { cardId: h.id, laneId: d, noteToCard: {
        noteId: u.id,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {}
      } }, L = () => {
        t !== C || !t.cards.some((W) => W.id === h.id) || (t = K({ ...t, cards: t.cards.filter((W) => W.id !== h.id) }), C = t, H(t));
      }, j = D(o.onChange, t, E);
      e.holdTrade?.(u.id, j), Sn(j, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: u.id, isComment: !1 } }]);
      }, () => {
        if (!f) {
          if (L(), !e.nodes.one(x.id)) {
            e.beginHostStep?.();
            const W = Me(() => e.addNode({ ...x }));
            W && (W.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${h.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        f || (L(), e.keepTrade?.(u.id), e.announce?.(`Someone else put ${h.label} on the board first.`));
      });
    }
  }
  function tn(s, d) {
    const c = t.cards.find((V) => V.id === s), p = t.lanes.find((V) => V.id === c.laneId), C = t.cards.findIndex((V) => V.id === s), l = t.cards.slice(C + 1).find((V) => V.laneId === c.laneId)?.id, u = Hn(t, s), h = y.get(J(ne.card(s))) ?? {}, x = e.nodes.one(s) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : s, E = (T.cornerRadius ?? 0) > 0, L = c.asNote, j = L?.text !== void 0 && L.text.replace(/\s+/g, " ").trim() === c.label ? L.text : c.label, W = {
      id: x,
      x: Math.round(d.x),
      y: Math.round(d.y),
      width: L?.width ?? h.width ?? 228,
      height: L?.height ?? h.height ?? 76,
      text: j,
      shape: L?.shape ?? (E ? "roundedrectangle" : "rectangle"),
      backgroundColor: c.look?.backgroundColor ?? h.backgroundColor,
      fontColor: c.look?.textColor ?? h.foregroundColor,
      fontSize: c.look?.fontSize ?? h.fontSize,
      borderColor: c.look?.borderColor ?? h.borderColor,
      borderWidth: c.look?.borderWidth ?? h.borderWidth,
      ...c.look?.fontFamily ?? h.fontFamily ? { fontFamily: c.look?.fontFamily ?? h.fontFamily } : {}
    };
    for (const V of Object.keys(W)) W[V] === void 0 && delete W[V];
    e.beginHostStep?.(), t = u;
    const q = t;
    x !== s ? N.set(x, s) : N.delete(x);
    const oe = Me(() => e.addNode(W));
    oe && (oe.announcedByCreator = !0), e.endHostStep?.(), H(t), oe?.ready?.then?.(() => {
      if (f || e.nodes.one(x) !== oe) return;
      const V = () => e.selectNodes?.([oe]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(V) : V();
    }), e.announce?.(`${c.label} is now a note on the canvas. ${p.label}: ${ce(t, p.id)}.`);
    const Pn = () => {
      e.nodes.one(x) === oe && (e.beginHostStep?.(), Me(() => e.removeNode(x)), e.endHostStep?.());
    }, Ln = D(o.onChange, t, { cardId: s, cardToNote: { noteId: x } });
    e.holdTrade?.(x, Ln), Sn(Ln, () => {
      oe && e.nodes.one(x) === oe && e.sendHeld?.([{ type: "onNodeAdded", data: { id: x, nodeOptions: Mn(oe.options) } }]);
    }, () => {
      if (!f) {
        if (Pn(), t === q && !t.cards.some((V) => V.id === s)) {
          const V = { id: s, label: c.label, ...c.look ? { look: c.look } : {}, ...c.asNote ? { asNote: c.asNote } : {} }, On = Pe(t, c.laneId, V, l);
          On && (t = On, H(t));
        }
        e.announce?.(`${c.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      f || (Pn(), e.keepTrade?.(x), e.announce?.(`Someone else took ${c.label} off the lanes first.`));
    });
  }
  function it(s, d, c) {
    const p = c.map((x) => x.id), C = p.indexOf(d), l = s.cards.find((x) => x.id === d);
    if (C < 0 || !l) return s;
    const u = s.cards.filter((x) => x !== l), h = u.findIndex((x) => p.indexOf(x.id) > C);
    return u.splice(h < 0 ? u.length : h, 0, l), K({ ...s, cards: u });
  }
  function lt(s) {
    m = m.then(() => {
      const d = b.get(s);
      if (f || !d) return;
      const c = () => e.selectNodes?.([d]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
    });
  }
  function Me(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Sn(s, d, c, p) {
    if (!s || typeof s.then != "function") return d();
    const C = s.then((l) => {
      l === !0 ? d() : l === !1 ? c() : l === "taken" && p();
    }, () => c());
    e.holdUntil?.(C);
  }
  function dt(s, d) {
    Z(!1), r = { laneId: d.laneId, reason: d.reason, timer: setTimeout(() => Z(), 1500) }, H(t, { skip: d.cardId });
    const c = t.lanes.find((p) => p.id === d.laneId);
    e.announce?.(`${s} can't move to ${c?.label ?? "that lane"}. ${d.reason}`), D(o.onRefuse, d);
  }
  function Z(s = !0) {
    r && (clearTimeout(r.timer), r = null, s && !f && me());
  }
  function me() {
    H(S && S.outcome.kind === "candidate" ? S.outcome.next : w?.next ?? a ?? t, { skip: S?.cardId });
  }
  function An(s) {
    const d = Un(s, { native: !0, origin: z, rows: Tn(), layout: A, style: T }).nodes, c = new Map(d.map((l) => [l.options.id, l.options])), p = (l, u, h, x = !1) => {
      const E = c.get(ne.column(l));
      E && (E.borderColor = u, E.borderWidth = h, delete E.borderStyle);
      const L = x && c.get(ne.lane(l));
      L && (L.borderColor = u, L.borderWidth = h);
    }, C = S?.cardId ?? w?.cardId;
    if (O = /* @__PURE__ */ new Map(), C) {
      const l = t.cards.find((h) => h.id === C)?.laneId;
      for (const h of Fn(t, C)) h.id !== l && (p(h.id, Wn, 2), O.set(h.id, "open"));
      const u = S ? S.outcome : w?.laneId ? { kind: "candidate", laneId: w.laneId } : null;
      u?.kind === "candidate" && (p(u.laneId, _n, 3, !0), O.set(u.laneId, "over")), u?.kind === "refused" && (p(u.laneId, dn, 3), O.set(u.laneId, "refused"));
    }
    if (P && !C) {
      for (const l of P.open) l !== P.laneId && (p(l, Wn, 2), O.set(l, "open"));
      P.laneId && !P.refusal && (p(P.laneId, _n, 3, !0), O.set(P.laneId, "over")), P.laneId && P.refusal && (p(P.laneId, dn, 3), O.set(P.laneId, "refused"));
    }
    if (w?.laneId === null && w.spot) {
      const l = c.get(ne.card(w.cardId));
      l && (l.xPos = w.spot.x, l.yPos = w.spot.y);
    }
    if (r) {
      O.set(r.laneId, "refused"), p(r.laneId, dn, 3, !0);
      const l = c.get(ne.caption(r.laneId));
      l && (l.text = r.reason, l.foregroundColor = "#b42318");
    }
    if (M = /* @__PURE__ */ new Set(), a && s === a) {
      const l = (h, x) => JSON.stringify(h) === JSON.stringify(x), u = (h) => {
        const x = c.get(h);
        x && (x.borderStyle = "dashed", x.borderColor = Et, x.borderWidth = 2, M.add(J(h)));
      };
      for (const h of s.cards) l(h, t.cards.find((x) => x.id === h.id)) || u(ne.card(h.id));
      for (const h of s.lanes) l(h, t.lanes.find((x) => x.id === h.id)) || u(ne.lane(h.id));
    }
    for (const l of d) {
      l.options.id = J(l.options.id);
      for (const u of l.relationships.associations)
        u.parentId = J(u.parentId), u.childId = J(u.childId);
    }
    return d;
  }
  function Tn() {
    return S || w ? t.lanes.map((s) => t.cards.filter((d) => d.laneId === s.id).length) : void 0;
  }
  function H(s, d = {}) {
    if (f) return;
    v = { model: s, skip: d.skip, animate: d.animate !== !1 };
    const c = An(s), p = [];
    for (const { options: l } of c) {
      const u = l.id;
      if (b.has(u)) continue;
      const h = G.get(u);
      G.delete(u);
      const x = h && d.animate !== !1 && !ln() ? { ...l, xPos: h.x, yPos: h.y } : l, E = e.nodes.add(Tt(x));
      b.set(u, E), y.set(u, { ...x }), E.ready && p.push(E.ready.then(() => {
        if (b.get(u) !== E) return;
        E.applyGovernance?.(), X(u)?.kind === "column" && E.toBack?.(!1);
        const L = $n(v?.model ?? s, u);
        L && E.svgGroup?.node?.setAttribute("aria-label", L);
      }).catch(() => {
      }));
    }
    const C = v;
    m = Promise.all([m, ...p]).then(() => {
      f || v !== C || ct(An(C.model), C);
    }).catch((l) => console.warn("WORKSHOP: could not draw the workshop", l));
  }
  function ct(s, d) {
    const c = new Set(s.map((C) => C.options.id)), p = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [l, u] of [...b]) {
        if (c.has(l)) continue;
        for (const [x, E] of [...g])
          E.parentId !== l && E.childId !== l || (E.parent.relationships?.removeAssociation(x), g.delete(x));
        e.deselectNode?.(u), u.editor?.cancelInline?.(), b.delete(l), y.delete(l);
        const h = I.get(l);
        h && (I.delete(l), k.delete(h)), e.nodes.remove(l);
      }
      for (const { options: l } of s) {
        const u = l.id, h = b.get(u);
        if (!h?.svgGroup) continue;
        const x = y.get(u) ?? {}, E = h.editor?.isInlineEditing?.();
        (l.fontSize !== x.fontSize || l.foregroundColor !== x.foregroundColor) && (h.options.fontSize = l.fontSize, h.options.fontColor = l.foregroundColor, h.applyTextStyle?.()), l.text !== x.text && !E && h.setText?.(l.text), (l.width !== x.width || l.height !== x.height) && (l.vectorPath ? (h.options.width = l.width, h.options.height = l.height, h.setShape?.(h.options.shape, l.vectorPath), X(u)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(l.width, l.height)), l.backgroundColor !== x.backgroundColor && h.setColors?.(l.backgroundColor), (l.borderColor !== x.borderColor || l.borderWidth !== x.borderWidth || l.borderStyle !== x.borderStyle) && (h.options.borderColor = l.borderColor, h.options.borderWidth = l.borderWidth, h.options.borderStyle = l.borderStyle, h.applyBorder?.());
        const L = l.xPos !== x.xPos || l.yPos !== x.yPos || Math.abs((h.options.x ?? 0) - l.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - l.yPos) > 0.5;
        if (u !== (d.skip && J(ne.card(d.skip))) && L) {
          const q = d.animate && !ln() ? 180 : 0, oe = p.includes(h) ? () => {
            !f && b.get(u) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          oe && q && p.length === 1 && h.resizeRotate?.disable?.(), h.position(l.xPos, l.yPos, oe, void 0, q);
        }
        const j = $n(d.model, u);
        j && h.svgGroup.node.getAttribute("aria-label") !== j && h.svgGroup.node.setAttribute("aria-label", j), M.has(u) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed");
        const W = X(u);
        if (W?.kind === "column") {
          const q = O.get(W.key);
          q ? h.svgGroup.node.setAttribute("data-workshop-drop", q) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        y.set(u, { ...l });
      }
      const C = /* @__PURE__ */ new Map();
      for (const l of s) for (const u of l.relationships.associations) C.set(u.id, u);
      for (const [l, u] of [...g])
        C.has(l) && b.get(u.parentId) === u.parent && b.get(u.childId) === u.child || (u.parent.relationships?.removeAssociation(l), g.delete(l));
      for (const [l, u] of C) {
        if (g.has(l)) continue;
        const h = b.get(u.parentId), x = b.get(u.childId);
        !h?.relationships || !x?.svgGroup || (h.relationships.addAssociation(x, Lt(u)), g.set(l, { parentId: u.parentId, childId: u.childId, parent: h, child: x }));
      }
    }), e.notifyNodeChanged?.();
  }
  function $n(s, d) {
    const c = X(d);
    if (c?.kind === "lane") {
      const p = s.lanes.find((C) => C.id === c.key);
      return p ? `${p.label}, ${ce(s, p.id)}` : null;
    }
    if (c?.kind === "card") {
      const p = s.cards.find((l) => l.id === c.key), C = p && s.lanes.find((l) => l.id === p.laneId);
      return p && C ? `${p.label}, in ${C.label}` : null;
    }
    return null;
  }
  function ut(s, d) {
    const c = Un(s, { native: !0, origin: z, layout: A, style: T }).nodes.find((p) => p.options.id === d)?.options;
    return c ? { x: c.xPos, y: c.yPos } : null;
  }
  function ke() {
    S && e.cancelGovernedDrag?.("host"), S = null, w && (w = null, D(o.onPreview, null)), Z(!1);
  }
  return {
    toCanvas(s) {
      if (f || i || Qe()) return "This workshop is view-only here.";
      if (!t.cards.some((C) => C.id === s)) return "That card is no longer on the board.";
      const d = De(t, s);
      if (d) return d;
      w && be(), a && (ke(), a = null, H(t), e.refreshGovernance?.());
      const { width: c } = se(t, { layout: A }), p = b.get(J(ne.card(s)))?.options;
      return tn(s, { x: z.x + c + 32, y: p?.y ?? z.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...z };
    },
    get layout() {
      return { ...A };
    },
    get bounds() {
      const { width: s, height: d } = se(t, { layout: A });
      return { x: z.x, y: z.y, width: s, height: d };
    },
    setLayout(s) {
      if (f) throw new Error("This workshop has been detached.");
      const d = s?.lanesPerRow === void 0 ? {} : { lanesPerRow: s.lanesPerRow };
      se(t, { layout: d }), d.lanesPerRow !== A.lanesPerRow && (ke(), A = d, H(a ?? t));
    },
    whenDrawn: () => m,
    update(s) {
      if (f) throw new Error("This workshop has been detached.");
      const d = K(s);
      ke(), t = d, H(a ?? t);
    },
    preview(s) {
      if (f) throw new Error("This workshop has been detached.");
      const d = s ? K(s) : null;
      ke(), a = d, H(a ?? t), e.refreshGovernance?.();
    },
    refuse(s, d) {
      const c = t.lanes.find((p) => p.id === s);
      f || !c || (Z(!1), r = { laneId: s, reason: d, timer: setTimeout(() => Z(), 1500) }, me(), e.announce?.(`${c.label}: ${d}`));
    },
    setReadOnly(s) {
      f || i === !!s || (ke(), i = !!s, H(a ?? t), e.refreshGovernance?.());
    },
    destroy() {
      f || (ke(), f = !0, e.element?.removeEventListener?.("pointerdown", Ae, !0), te?.(), e.withPolicyAuthority(() => {
        for (const [s, d] of g) d.parent.relationships?.removeAssociation(s);
        for (const [s, d] of b)
          e.deselectNode?.(d), d.editor?.cancelInline?.(), e.nodes.one(s) === d && e.nodes.remove(s);
      }), g.clear(), b.clear(), y.clear(), k.clear(), I.clear(), Se(), _ = !1, Je(), e.notifyNodeChanged?.());
    }
  };
}
function D(e, ...n) {
  try {
    return e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function zn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
  }, () => {
  });
}
function Mt(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function _t(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const a of n)
    o = Math.max(o, (a.options.x ?? 0) + (a.options.width ?? 0)), t = Math.min(t, a.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
function ue(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ae(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Vn(e) {
  const n = ue(e);
  let o;
  try {
    o = new URL(ae(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: ae(n.alt, 240) };
}
function de(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Wt = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, zt = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Oe(e) {
  const n = ue(e), o = {}, t = (i) => {
    if (typeof i != "string" || !Wt.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, a = (i, f, b) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < f || i > b) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !zt.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = a(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = a(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Ft(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        Oe({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Oe(n);
}
function bn(e) {
  const n = ue(e), o = {};
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
function we(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function kn({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((a) => a.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Ht(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Ie = (e) => "lane-" + e, he = (e) => "card-" + e, Ye = (e) => "image-" + e;
function mo(e) {
  const n = Ht(e);
  return kn(e).map((o) => {
    const t = e.cards.filter((f) => f.laneId === o.id), a = n.filter((f) => f.laneId === o.id), i = [Ie(o.id)];
    return o.station?.image && i.push(Ye(o.id)), { lane: o, cards: t, signals: a, nodeIds: [...i, ...t.map((f) => he(f.id))] };
  });
}
const Zn = 5, Jn = 24, fn = 3;
function K(e) {
  const n = ue(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ae(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Zn)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > Jn)
    throw new Error("A workshop supports up to 24 cards.");
  const a = n.lanes.map((y) => {
    const g = ue(y), k = { id: de(g.id), label: ae(g.label) };
    if (g.capacity !== void 0) {
      const I = o ? 576 : 24;
      if (typeof g.capacity != "number" || !Number.isInteger(g.capacity) || g.capacity < 1 || g.capacity > I)
        throw new Error(`Lane capacity must be a whole number from 1 to ${I}.`);
      k.capacity = g.capacity;
    }
    if (g.station !== void 0) {
      const I = ue(g.station), S = (P) => {
        if (typeof P != "number" || !Number.isInteger(P) || P < 0 || P >= fn)
          throw new Error("Use map coordinates from 0 to 2.");
        return P;
      };
      if (!Array.isArray(I.next) || I.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const w = I.next.map(de);
      we(w, "onward stop"), k.station = { column: S(I.column), row: S(I.row), next: w, outcome: ae(I.outcome, 160) }, I.image !== void 0 && (k.station.image = Vn(I.image));
    }
    return k;
  }), i = a.map((y) => y.id);
  if (we(i, "lane ID"), (o || a.some((y) => y.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (a.some((y) => y.station)) {
    if (!a.every((y) => y.station)) throw new Error("Give every station on the map a position.");
    we(a.map((y) => y.station.column + "," + y.station.row), "map position");
    for (const y of a)
      if (y.station.next.some((g) => g === y.id || !i.includes(g))) throw new Error("Connect each stop to another station on this map.");
  }
  const f = n.cards.map((y) => {
    const g = ue(y), k = { id: de(g.id), label: ae(g.label), laneId: de(g.laneId) };
    if (!i.includes(k.laneId)) throw new Error("Card refers to an unknown lane.");
    if (g.allowedLaneIds !== void 0) {
      if (!Array.isArray(g.allowedLaneIds) || g.allowedLaneIds.length > a.length) throw new Error("Invalid allowed lanes.");
      if (k.allowedLaneIds = g.allowedLaneIds.map(de), we(k.allowedLaneIds, "allowed lane"), !k.allowedLaneIds.includes(k.laneId) || !k.allowedLaneIds.every((I) => i.includes(I)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (g.look !== void 0) {
      const I = Oe(g.look);
      I && (k.look = I);
    }
    if (g.asNote !== void 0) {
      const I = bn(g.asNote);
      I && (k.asNote = I);
    }
    if (o) {
      if (typeof g.points != "number" || !Number.isInteger(g.points) || g.points < 1 || g.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (k.points = g.points, g.dependsOn !== void 0) {
        if (!Array.isArray(g.dependsOn) || g.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        k.dependsOn = g.dependsOn.map(de), we(k.dependsOn, "dependency");
      }
    }
    return k;
  });
  we(f.map((y) => y.id), "card ID");
  const b = { version: 1, title: t, lanes: a, cards: f };
  if (n.experience !== void 0) {
    const y = ue(n.experience);
    if (y.version !== 1 || y.kind !== "customer-interviews" && y.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    b.experience = { version: 1, kind: y.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    b.signals = n.signals.map((y) => {
      const g = ue(y), k = de(g.cardId), I = de(g.laneId);
      if (!f.some((S) => S.id === k) || !i.includes(I))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: de(g.id),
        label: ae(g.label),
        cardId: k,
        laneId: I,
        whenPresent: ae(g.whenPresent, 160),
        whenAbsent: ae(g.whenAbsent, 160)
      };
    }), we(b.signals.map((y) => y.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    b.presentationOrder = kn({ lanes: a, presentationOrder: n.presentationOrder }).map((y) => y.id);
  }
  if (o)
    return b.kind = "release-plan", ft(b), b;
  for (const y of a)
    if (f.filter((g) => g.laneId === y.id).length > (y.capacity ?? 1 / 0))
      throw new Error(`Lane "${y.label}" exceeds its capacity.`);
  return b;
}
const Qn = 65536;
function wo(e) {
  const n = JSON.stringify(K(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Qn) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function go(e) {
  if (e.length > Qn) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return K(t);
}
function qe(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => Ke(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((a) => a.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function hn(e, n, o) {
  const t = e.cards.find((a) => a.id === n);
  if (t && e.kind === "release-plan") {
    const a = Ke(e, t, o);
    if (!a) throw new Error("Move is unavailable.");
    return a;
  }
  if (!t || !qe(e, t).some((a) => a.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((a) => a === t ? { ...t, laneId: o } : a) };
}
function xe(e, n, o) {
  const t = e.cards.find((i) => i.id === n);
  if (!t || !e.lanes.some((i) => i.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return Ke(e, t, o);
  const a = Yt(e, n, o);
  return a || (o === "prototype" && Ce(e) === "customer-interviews" ? null : qe(e, t).some((i) => i.id === o) ? hn(e, n, o) : null);
}
function Fn(e, n) {
  return e.lanes.filter((o) => xe(e, n, o.id) !== null);
}
function He(e, n, o) {
  if (xe(e, n, o) !== null) return null;
  const t = e.cards.find((y) => y.id === n), a = e.lanes.find((y) => y.id === o);
  if (!t || !a) return "That move is not available.";
  const i = `This card can't go in ${a.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return i;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return i;
    const y = ye(e, o), g = { ...e, lanes: e.lanes.map((I) => I === a ? { id: a.id, label: a.label } : I) }, k = Ke(g, t, o);
    return k ? `Needs ${ye(k, o) - y} points. It already holds ${y} of ${a.capacity} points.` : i;
  }
  const f = e.lanes.find((y) => y.id === t.laneId);
  if (f?.station && !f.station.next.includes(o)) return `${a.label} can't be reached from ${f.label}.`;
  const b = e.cards.filter((y) => y.laneId === o).length;
  return a.capacity !== void 0 && b >= a.capacity ? `It already holds ${b} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : i;
}
function je(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !Ce(e);
}
const jt = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Dt(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && jt.test(n) && !o.has(n) ? n : Ze(e, "card");
}
function ve(e, n, o) {
  const t = e.lanes.find((f) => f.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((f) => f.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Ce(e)) return "This workshop keeps the cards it came with.";
  const a = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!a) return "A card needs some words. Type on the note first.";
  if (a.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(a)) return "A card holds plain words only.";
  if (e.cards.length >= Jn) return "A workshop holds up to 24 cards.";
  const i = e.cards.filter((f) => f.laneId === n).length;
  if (t.capacity !== void 0 && i >= t.capacity) return `It already holds ${i} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      Oe(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  if (o.asNote !== void 0)
    try {
      bn(o.asNote);
    } catch {
      return "This note's shape or words can't be kept on a card.";
    }
  return null;
}
function Pe(e, n, o, t) {
  if (ve(e, n, o) !== null) return null;
  const a = o.look === void 0 ? void 0 : Oe(o.look), i = o.asNote === void 0 ? void 0 : bn(o.asNote), f = {
    id: Dt(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: n,
    ...a ? { look: a } : {},
    ...i ? { asNote: i } : {}
  }, b = t === void 0 ? -1 : e.cards.findIndex((g) => g.id === t && g.laneId === n), y = b < 0 ? [...e.cards, f] : [...e.cards.slice(0, b), f, ...e.cards.slice(b)];
  return K({ ...e, cards: y });
}
function De(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!je(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((i) => e.lanes.find((f) => f.id === i).label), a = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${a}, so it stays a card.`;
  }
  return null;
}
function Hn(e, n) {
  return De(e, n) !== null ? null : K({ ...e, cards: e.cards.filter((o) => o.id !== n) });
}
function ce(e, n) {
  const o = e.lanes.find((i) => i.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const i = ye(e, n);
    return o.capacity ? i + " / " + o.capacity + " points" : i + " points";
  }
  const t = Vt(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const a = e.cards.filter((i) => i.laneId === n).length;
  return o.capacity !== void 0 ? a + " of " + o.capacity : a + (a === 1 ? " card" : " cards");
}
const Ve = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Be = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Xn(e, n = Ve, o = 28, t) {
  const { pitch: a, row: i, top: f } = n, b = !!e.lanes[0].station, y = e.lanes.map((I) => e.cards.filter((S) => S.laneId === I.id).length), g = f + Math.max(1, ...t ?? y) * i + 36, k = e.lanes.map((I, S) => ({
    x: b ? I.station.column * (a + o) : S * a,
    y: b ? I.station.row * g : 0
  }));
  return {
    points: k,
    width: Math.max(...k.map((I) => I.x)) + a,
    height: Math.max(...k.map((I, S) => I.y + f + (b ? Math.max(1, y[S]) : y[S] + 1) * i))
  };
}
function yo() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Ze(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((a) => a.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function et(e) {
  const n = K(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Bt(e, n) {
  const o = et(e), t = Ze(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), K(o);
}
function Ut(e, n, o) {
  const t = et(e);
  return t.cards.push({
    id: Ze(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), K(t);
}
function bo() {
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
function jn(e, n, o) {
  const t = K(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const a = t.lanes.find((k) => k.id === n);
  if (!a?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= Zn) throw new Error("A map can have up to five stations.");
  const i = ae(o?.label), f = ae(o?.outcome, 160), b = Ze(t, "station");
  let y, g = 1 / 0;
  for (let k = 0; k < fn; k++)
    for (let I = 0; I < fn; I++) {
      if (t.lanes.some((w) => w.station.column === I && w.station.row === k)) continue;
      const S = Math.abs(a.station.column - I) + Math.abs(a.station.row - k);
      S < g && (g = S, y = { column: I, row: k });
    }
  if (!y) throw new Error("There is no free station position.");
  return a.station.next.push(b), t.lanes.push({ id: b, label: i, station: { ...y, next: [], outcome: f, ...o.image === void 0 ? {} : { image: Vn(o.image) } } }), t.presentationOrder?.push(b), t;
}
const ko = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, nt = (e) => "caption-" + e, Le = (e) => "column-" + e, ne = { lane: Ie, card: he, image: Ye, caption: nt, column: Le };
function tt(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function cn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), a = e, i = n;
  return t ? `M ${t} 0 H ${a - t} Q ${a} 0 ${a} ${t} V ${i - t} Q ${a} ${i} ${a - t} ${i} H ${t} Q 0 ${i} 0 ${i - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${a} V ${i} H 0 Z`;
}
function Dn(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function Bn(e, n, o, t) {
  for (let a = n; a > 11; a--) {
    const i = Math.max(1, Math.floor(o / (a * 0.55)));
    if (e.split(`
`).reduce((b, y) => b + Math.max(1, Math.ceil(y.length / i)), 0) * a * 1.3 <= t) return a;
  }
  return Math.min(n, 11);
}
const ot = 152, pn = ot + 12, Gt = 12;
function qt(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function se(e, n = {}) {
  const o = K(e), { pitch: t, row: a, top: i } = Ve, f = o.lanes.map((S) => o.cards.filter((w) => w.laneId === S.id).length), b = (S) => Math.max(f[S], (Array.isArray(n.rows) ? n.rows[S] : n.rows) ?? 0), y = !!o.lanes[0].station, g = o.lanes.some((S) => S.station?.image), k = qt(n.layout, o.lanes.length), I = [];
  if (y) {
    const { points: S } = Xn(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((w, P) => I.push({
      laneId: w.id,
      x: S[P].x,
      y: S[P].y + (g ? w.station.row * pn : 0),
      width: t,
      height: i + (w.station.image ? pn : 0) + Math.max(1, b(P)) * a,
      column: w.station.column,
      row: w.station.row
    }));
  } else {
    let S = 0;
    for (let w = 0; w < o.lanes.length; w += k) {
      const P = o.lanes.slice(w, w + k), N = i + (Math.max(...P.map((G, r) => b(w + r))) + 1) * a;
      P.forEach((G, r) => I.push({ laneId: G.id, x: r * t, y: S, width: t, height: N, column: r, row: w / k })), S += N + Gt;
    }
  }
  return { places: I, width: Math.max(...I.map((S) => S.x + S.width)), height: Math.max(...I.map((S) => S.y + S.height)) };
}
function Kt(e, n) {
  const { pitch: o, width: t, row: a, height: i, top: f } = Ve, b = n.origin ?? { x: 0, y: 0 }, y = !!e.lanes[0].station, { places: g } = se(e, n), k = n.style ?? {}, I = k.textColor ?? $e.fontColor, S = k.borderColor ?? $e.borderColor, w = k.borderWidth ?? $e.borderWidth, P = k.cornerRadius ?? 0, N = k.fontSize ?? $e.fontSize, G = k.laneFontSize ?? N + 2, r = k.captionFontSize ?? Math.max(11, N - 1), m = [], v = (T) => {
    const O = { options: {
      shapeHint: "rectangle",
      vectorPath: cn(T.width, T.height, P),
      foregroundColor: I,
      borderColor: S,
      borderWidth: w,
      ...k.fontFamily ? { fontFamily: k.fontFamily } : {},
      ...T
    }, relationships: { associations: [] } };
    return m.push(O), O;
  };
  e.lanes.forEach((T, O) => {
    const M = g[O], U = b.x + M.x, _ = b.y + M.y, z = T.station?.image;
    v({
      id: Le(T.id),
      text: "",
      name: T.label,
      xPos: U + 2,
      yPos: _,
      width: o - 4,
      height: M.height,
      vectorPath: cn(o - 4, M.height, P ? P + 2 : 0),
      backgroundColor: y ? "#fcf9ed" : Dn(Be[O], 0.6),
      borderColor: y ? "#a8b5aa" : Dn(Be[O], 0.1),
      borderWidth: 1,
      ...y ? { borderStyle: "dashed" } : {}
    }), v({
      id: Ie(T.id),
      text: T.label,
      name: T.label,
      xPos: U + 8,
      yPos: _ + 6,
      width: t,
      height: 58,
      backgroundColor: Be[O],
      fontSize: Bn(T.label, G, t - 16, 50)
    }), v({
      id: nt(T.id),
      text: ce(e, T.id),
      name: T.label,
      xPos: U + 8,
      yPos: _ + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: r
    }), z && m.push({ options: {
      id: Ye(T.id),
      name: z.alt,
      text: "",
      xPos: U + 8,
      yPos: _ + f,
      width: t,
      height: ot,
      shapeHint: "rectangle",
      image: z.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((Q) => Q.laneId === T.id).forEach((Q, X) => {
      const J = e.kind === "release-plan" ? Q.label + `
` + Q.points + " points" : Q.label, re = y ? t - 20 : t, Se = y ? i - 6 : i, te = y ? {} : { ...k.card, ...Q.look }, Ae = y ? P : k.card?.cornerRadius ?? P;
      v({
        id: he(Q.id),
        text: J,
        name: Q.label,
        xPos: U + (y ? 18 : 8),
        yPos: _ + f + (z ? pn : 0) + X * a,
        width: re,
        height: Se,
        ...Ae !== P ? { vectorPath: cn(re, Se, Ae) } : {},
        backgroundColor: y ? "#ffda75" : te.backgroundColor ?? k.backgroundColor ?? $e.backgroundColor,
        ...te.textColor ? { foregroundColor: te.textColor } : {},
        ...te.fontFamily ? { fontFamily: te.fontFamily } : {},
        ...te.borderColor ? { borderColor: te.borderColor } : {},
        ...te.borderWidth !== void 0 ? { borderWidth: te.borderWidth } : {},
        fontSize: Bn(J, te.fontSize ?? N, re - 16, Se - 8)
      });
    });
  });
  const A = new Map(m.map((T) => [T.options.id, T]));
  for (const T of e.lanes)
    T.station && (A.get(Le(T.id)).relationships.associations = T.station.next.map((O) => ({
      id: T.id + "-to-" + O,
      parentId: Le(T.id),
      childId: Le(O),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const T of e.cards)
      for (const O of T.dependsOn ?? []) {
        const M = he(O), U = he(T.id);
        A.get(M).relationships.associations.push({
          id: `dependency-${O.length}-${O}-${T.id}`,
          parentId: M,
          childId: U,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const T = new Set(n.beside), O = new Set(m.map((_) => _.options.id)), M = /* @__PURE__ */ new Map();
    for (const _ of [...O]) {
      if (!T.has(_)) continue;
      const z = tt(_, (Q) => T.has(Q) || O.has(Q));
      O.add(z), M.set(_, z);
    }
    const U = (_) => M.get(_) ?? _;
    for (const _ of m) {
      _.options.id = U(_.options.id);
      for (const z of _.relationships.associations)
        z.parentId = U(z.parentId), z.childId = U(z.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: m };
}
function Un(e, n) {
  const o = K(e);
  if (n?.native) return Kt(o, n);
  const { width: t, row: a, height: i, top: f } = Ve, b = [];
  function y(w, P, N, G, r, m) {
    b.push({ options: {
      id: w,
      text: P,
      name: P,
      xPos: N,
      yPos: G,
      width: t,
      height: r,
      shapeHint: "rectangle",
      backgroundColor: m,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: g } = Xn(o), k = 152, I = k + 12, S = o.lanes.some((w) => w.station?.image);
  o.lanes.forEach((w, P) => {
    const N = g[P].x, G = g[P].y + (S ? (w.station?.row ?? 0) * I : 0), r = w.station?.image, m = o.kind === "release-plan" ? w.label + `
` + (w.capacity ? ye(o, w.id) + " / " + w.capacity + " points" : ye(o, w.id) + " points") : w.label;
    y(Ie(w.id), m, N, G, f - 12, Be[P]), r && b.push({ options: {
      id: Ye(w.id),
      name: r.alt,
      text: "",
      xPos: N,
      yPos: G + f,
      width: t,
      height: k,
      shapeHint: "rectangle",
      image: r.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((v) => v.laneId === w.id).forEach((v, A) => y(he(v.id), o.kind === "release-plan" ? v.label + `
` + v.points + " points" : v.label, N, G + f + (r ? I : 0) + A * a, i, "#fffdf6"));
  });
  for (const w of o.lanes) {
    if (!w.station) continue;
    const P = b.find((N) => N.options.id === Ie(w.id));
    P.relationships.associations = w.station.next.map((N) => ({ id: w.id + "-to-" + N, parentId: P.options.id, childId: Ie(N), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), P.options.text = w.label + `
` + w.station.outcome, P.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const w = new Map(b.map((P) => [P.options.id, P]));
    for (const P of o.cards)
      for (const N of P.dependsOn ?? []) {
        const G = he(N), r = he(P.id);
        w.get(G).relationships.associations.push({
          id: `dependency-${N.length}-${N}-${P.id}`,
          parentId: G,
          childId: r,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: b };
}
const vo = {
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
}, mn = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], vn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Io() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: mn.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: mn.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function xo() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...vn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Ce(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...vn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => mn.some((a) => a.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Yt(e, n, o) {
  const t = Ce(e), a = e.cards.find((f) => f.id === n);
  if (!t || !a || a.laneId === o) return null;
  let i = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const f = e.cards.find((b) => b.laneId === o);
    if (f) {
      if (!qe(e, f).some((b) => b.id === "interviews")) return null;
      i = hn(e, f.id, "interviews");
    }
  }
  return qe(i, a).some((f) => f.id === o) ? hn(i, n, o) : null;
}
function Vt(e, n) {
  if (Ce(e) !== "experiment-budget") return null;
  const o = vn.find((i) => i.id === n), t = e.cards.filter((i) => i.laneId === n).length, a = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? a + " " + (a === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  $e as DEFAULT_NOTE_STYLE,
  Fe as WorkshopReferenceError,
  jn as addWorkshopBranch,
  Ut as addWorkshopCard,
  Bt as addWorkshopLane,
  Ct as applyWorkshopEdits,
  po as attachWorkshop,
  qe as availableLanes,
  ht as canHangPanel,
  vn as channels,
  At as checkWorkshopReplacement,
  mt as countWord,
  xo as createBudgetWorkshop,
  Io as createInterviewWorkshop,
  yo as createLaneWorkshop,
  bo as createWorkshopMap,
  go as decodeWorkshopFragment,
  uo as describeFocusDarkroom,
  ho as describeWorkshopEdits,
  wo as encodeWorkshopFragment,
  no as handoffSummary,
  io as hangGalleryPanel,
  vo as industrialWorkshop,
  co as initialFocusDarkroom,
  mn as interviews,
  Be as laneColors,
  ge as listed,
  _e as listeningRoom,
  oo as listeningRoomCaption,
  Jn as maxWorkshopCards,
  ao as moonGallery,
  hn as moveWorkshopCard,
  fo as named,
  ko as nightTransfer,
  lo as normalizeFocusDarkroom,
  to as normalizeListeningRoom,
  so as normalizeMoonGallery,
  Qt as normalizeOfflineHandoff,
  Jt as offlineHandoff,
  Yt as planStartupMove,
  wt as pointing,
  Gn as printFields,
  ye as releaseLoad,
  ro as releasePlan,
  eo as resolveHandoff,
  Ht as resolveWorkshopSignals,
  Xt as reviewHandoff,
  $ as said,
  Ce as startupExperienceKind,
  wn as unquoted,
  K as validateWorkshop,
  Ue as workshopBoardKind,
  Vt as workshopBudgetResult,
  xe as workshopCandidate,
  Hn as workshopCardAsNote,
  De as workshopCardAsNoteRefusal,
  Ft as workshopCardLookOf,
  Fn as workshopDestinations,
  yn as workshopEditKinds,
  un as workshopFinder,
  ce as workshopLaneCaption,
  se as workshopLanePlaces,
  Ve as workshopLayout,
  ne as workshopNodeIds,
  Pe as workshopNoteCandidate,
  ve as workshopNoteRefusal,
  Xn as workshopPositions,
  kn as workshopPresentationLanes,
  mo as workshopPresentationScenes,
  vt as workshopReferences,
  He as workshopRefusal,
  tt as workshopStandInId,
  je as workshopTakesNotes,
  Un as workshopToSlate
};
