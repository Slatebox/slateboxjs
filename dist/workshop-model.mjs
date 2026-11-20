import { D as Te } from "./NoteDefaults-1xFW0br8.mjs";
const Yt = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Vt(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: a, fieldNote: i, deskNote: u, fallback: b } = e, y = (g) => typeof g == "string" && g.trim().length > 0 && g.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(g);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? a !== "field" && a !== "desk" : a !== null) || a === void 0 || !y(i) || !y(u) || !y(b) ? null : { kind: n, version: o, stage: t, choice: a, fieldNote: i.trim(), deskNote: u.trim(), fallback: b.trim() };
}
function Zt(e) {
  return { ...e, stage: "review", choice: null };
}
function Jt(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Qt(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const _e = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Xt(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: a, rightLabel: i } = e, u = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !u(a) || !u(i) ? null : { kind: n, version: o, mix: t, leftLabel: a.trim(), rightLabel: i.trim() };
}
function eo({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === _e.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === _e.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === _e.leftLabel && o === _e.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function ge(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function ct(e) {
  const n = new Map(e.cards.map((u) => [u.id, u])), o = new Map(e.lanes.map((u, b) => [u.id, b])), t = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  function i(u) {
    if (!t.has(u.id)) {
      if (a.has(u.id)) throw new Error("Release dependencies must be acyclic.");
      a.add(u.id);
      for (const b of u.dependsOn ?? []) {
        const y = n.get(b);
        if (!y) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(y.laneId) > o.get(u.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(y);
      }
      a.delete(u.id), t.add(u.id);
    }
  }
  for (const u of e.cards) i(u);
  for (const u of e.lanes) {
    if (u.station) throw new Error("Release windows cannot also be map stations.");
    if (ge(e, u.id) > (u.capacity ?? 1 / 0)) throw new Error(`Release "${u.label}" exceeds its point budget.`);
  }
}
function Ke(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((I, A) => [I.id, A])), a = t.get(o);
  if (a === void 0) return null;
  const i = a < t.get(n.laneId), u = /* @__PURE__ */ new Set([n.id]), b = [n];
  for (; b.length; ) {
    const I = b.pop();
    for (const A of e.cards) {
      if (u.has(A.id)) continue;
      const w = t.get(A.laneId);
      (i ? w > a && I.dependsOn?.includes(A.id) : w < a && A.dependsOn?.includes(I.id)) && (u.add(A.id), b.push(A));
    }
  }
  if (e.cards.filter((I) => u.has(I.id)).some((I) => I.allowedLaneIds && !I.allowedLaneIds.includes(o))) return null;
  const g = { ...e, cards: e.cards.map((I) => u.has(I.id) ? { ...I, laneId: o } : I) }, k = e.lanes[a].capacity;
  return k !== void 0 && ge(g, o) > k ? null : g;
}
const no = {
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
}, to = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function oo(e) {
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
    const u = /* @__PURE__ */ new Set([i.id]);
    let b = i.after;
    for (; b !== null; ) {
      if (u.has(b) || !t.has(b) || a.includes(i.id) && !a.includes(b)) return null;
      u.add(b), b = t.get(b).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: a };
}
function ut(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function ro(e, n) {
  return ut(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Bn = ["firstPrint", "secondPrint", "thirdPrint"], Un = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function ao(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...Un, route: n.route };
  for (const t of Bn) {
    const a = n[t];
    if (typeof a != "string" || !a.trim() || a.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = a.trim();
  }
  return o;
}
function so(e = new URLSearchParams()) {
  const n = { ...Un };
  for (const t of Bn) {
    const a = e.get(t)?.trim();
    a && a.length <= 48 && (n[t] = a);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function io(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
const T = (e) => "“" + e.replace(/[“”]/g, '"') + "”", we = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Ln = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), wn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), gn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), lo = (e) => wn(gn(e)), ft = [
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
], ht = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : ft.indexOf(e.toLowerCase()), pt = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Gn(e, n) {
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
const on = "[^\\p{L}\\p{N}]", On = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Ln(n) + "(?:$|" + on + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + on + ")" + Ln(n) + "(?:$|" + on + ")", "u").test(e)
], En = ["first", "second", "third", "fourth", "fifth"];
function mt(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + En.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(wn(gn(n)));
  if (!t) return null;
  const a = (t[1] ?? t[2]).toLowerCase(), i = a === "last" ? e.length - 1 : t[1] ? En.indexOf(a) : ht(a) - 1;
  return e[i] ?? null;
}
function rn(e, n, o, t, a) {
  const i = Gn(n, o);
  if (i.some((b) => pt.test(b))) {
    const b = t && e.find((y) => y.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of i) {
    if (!b.startsWith("@")) continue;
    const y = e.find((g) => g.id === b.slice(1));
    if (y) return { item: y, rank: 0 };
  }
  for (const [b, y] of On.entries())
    for (const g of i) {
      const k = e.filter((I) => y(I.label.toLowerCase(), g.toLowerCase()));
      if (k.length === 1) return { item: k[0], rank: b };
      if (k.length > 1) return { several: k };
    }
  const u = a ? mt(e, n, o) : null;
  return u ? { item: u, rank: On.length } : {};
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
    const k = Gn(y, n), I = k[k.length - 1];
    if (g.pointing) throw new Fe("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (g.several) {
      const w = [...new Set(g.several.map((P) => P.label))];
      throw new Fe(w.length === 1 ? g.several.length + " " + o + "s are called " + T(w[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + T(I) + ": " + we(w.slice(0, 6).map(T)) + ". Use the whole name.", "ambiguous", g.several.map((P) => P.id));
    }
    const A = e.map((w) => w.label);
    throw new Fe("There is no " + o + " called " + T(I) + " here." + (A.length && A.length <= 6 ? " The " + o + "s are " + we(A.map(T)) + "." : A.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((w) => w.id));
  }, attempt: (y) => rn(e, y, n, t, a).item ?? null, rank: (y) => rn(e, y, n, t, a).rank ?? 1 / 0 };
}
const ue = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map"], an = ["lanes", "release-plan", "customer-interviews", "experiment-budget"];
function Ue(e) {
  return e.lanes[0]?.station ? "map" : e.kind === "release-plan" ? "release-plan" : xe(e) ?? "lanes";
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
}, J = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), K = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), se = (e) => ({ type: "ref", of: "card", about: e }), sn = (e) => ({ map: e }), ie = { lanes: F.notMap, "release-plan": F.notMap, "customer-interviews": F.notMap, "experiment-budget": F.notMap }, yn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: J(120, "The new name, 1 to 120 characters of plain text.") },
    boards: ue,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: K("The lane or step."), label: J(80, "The new name, 1 to 80 characters of plain text.") },
    boards: ue,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: se("The card or token."), label: J(80, "The new name, 1 to 80 characters of plain text.") },
    boards: ue,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: J(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, map: F.mapAddLane }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: K("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: K("The lane or step it starts in."),
      label: J(80, "What the card says. On a map it may be left out: the token is numbered.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." }
    },
    boards: ["lanes", "experiment-budget", "map"],
    refusals: { "release-plan": F.releaseCards, "customer-interviews": F.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: se("The card or token.") },
    boards: ue,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: se("The card or token."), lane: K("Where it goes.") },
    boards: ue,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: se("The token.") },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: K("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: ue,
    refusals: {}
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: se("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: an,
    refusals: sn(F.mapCardLanes)
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: se("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { lanes: F.notPoints, "customer-interviews": F.notPoints, "experiment-budget": F.notPoints, map: F.mapPoints }
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
    refusals: { lanes: F.notDepends, "customer-interviews": F.notDepends, "experiment-budget": F.notDepends, map: F.notDepends }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: se("The card."),
      lane: K("The lane."),
      whenPresent: J(160, "What it says when the card is there."),
      whenAbsent: J(160, "What it says otherwise."),
      label: J(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: an,
    refusals: sn(F.mapOutcome)
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: se("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: an,
    refusals: sn(F.mapOutcome)
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: ue,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: K("The lane or step."), before: K("Present it just before this one.", !0), after: K("Present it just after this one.", !0) },
    boards: ue,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: K("The step it follows."), label: J(80, "The new step’s name."), outcome: J(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: K("The step it goes in front of."),
      from: K("Only the path from this step is taken over.", !0),
      label: J(80, "The new step’s name."),
      outcome: J(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: K("Where the path starts."), to: K("Where it leads.") },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: K("Where the path starts."), to: K("Where it leads.") },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: K("The step."), outcome: J(160, "What it says.") },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: K("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: K("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: ie
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: K("The step."), alt: J(240, "What the picture shows.") },
    boards: ["map"],
    refusals: ie
  }
], wt = new Map(yn.map((e) => [e.kind, e])), gt = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function yt(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: gt(e.max, n) }, e.nullable), description: e.about };
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
const qn = (e) => "optional" in e && e.optional === !0;
function co(e) {
  const n = e ? Ue(q(e)) : void 0;
  return yn.map((o) => {
    const t = Object.entries(o.fields), a = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, u]) => !qn(u)).map(([u]) => u)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([u, b]) => [u, yt(b, n)])) }
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
function bt(e, n) {
  const o = !!e.lanes[0]?.station, t = un(e.lanes, o ? We.step : We.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), a = un(e.cards, o ? We.token : We.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: a };
  const i = (u) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(u.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (u) => i(u) ?? a.find(u),
    attempt: (u) => i(u) ?? a.attempt(u),
    rank: (u) => i(u) ? 0 : a.rank(u)
  } };
}
class M {
  constructor(n, o, t = null, a, i) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = a, this.candidates = i;
  }
}
function Ge(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function B(e, n, o = null, t) {
  try {
    return q(e);
  } catch (a) {
    throw new M(Ge(a instanceof Error ? a.message : String(a), n), "refused", o, t);
  }
}
function kt(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, a] of Object.entries(n.fields)) {
    const i = e[t];
    if (i === void 0) {
      if (qn(a)) continue;
      return n.kind + " needs " + t + ".";
    }
    const u = n.kind + " needs " + t + " as ";
    switch (a.type) {
      case "text":
        if (typeof i != "string") return u + "text.";
        break;
      case "ref":
        if (!o(i)) return u + "an id or a name.";
        break;
      case "refs":
        if (i === null && a.nullable) break;
        if (!Array.isArray(i) || i.length > a.max || !i.every(o)) return u + "a list of up to " + a.max + " ids or names" + (a.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (i === null && a.nullable) break;
        if (typeof i != "number" || !Number.isFinite(i)) return u + "a number" + (a.nullable ? " or null." : ".");
        break;
      case "image":
        if (i === null) break;
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((b) => b !== "src" && b !== "alt")) return u + "{src, alt} or null.";
        break;
      case "choice":
        if (!a.values.includes(i)) return u + a.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function vt(e, n, o, t) {
  const a = structuredClone(e), i = o === "map", u = o === "release-plan", b = bt(a, t), y = { lane: i ? "step" : "lane", card: i ? "token" : "card" };
  function g(r, p, v, C, $ = null) {
    if (typeof v == "object") {
      const _ = r.find((D) => D.id === v.id);
      if (!_) throw new M("That " + C + " is no longer on the workshop.", "gone", $);
      return _;
    }
    const O = r.find((_) => _.id === v);
    if (O) return O;
    try {
      return p.find(v);
    } catch (_) {
      if (!(_ instanceof Fe)) throw _;
      const D = _.reason === "ambiguous" ? "ambiguous_reference" : _.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new M(_.message, D, $, void 0, _.candidates.length ? _.candidates : void 0);
    }
  }
  const k = (r, p = null) => g(a.lanes, b.lanes, r, "lane", p), I = (r, p = null) => g(a.cards, b.cards, r, "card", p), A = (r) => {
    try {
      return k(r);
    } catch {
      return null;
    }
  }, w = (r, p, v = {}, C = !0) => ({ board: r, said: p, changed: C, ...v }), P = (r) => a.cards.filter((p) => p.laneId === r).length, N = (r) => i ? "The presentation opens with " + T(r[0].label) + "." : "The presentation now runs " + r.map((p) => T(p.label)).join(", then ") + ".";
  switch (n.kind) {
    case "rename_workshop": {
      a.title = n.title;
      const r = B(a, o);
      return w(r, "Renamed the " + (i ? "map" : "workshop") + " to " + T(r.title) + ".");
    }
    case "rename_lane": {
      const r = k(n.lane), p = r.label;
      r.label = n.label;
      const v = B(a, o, r.id);
      return w(v, "Renamed " + T(p) + " to " + T(v.lanes.find((C) => C.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = I(n.card), p = r.label;
      r.label = n.label;
      const v = B(a, o, r.laneId, r.id);
      return w(v, "Renamed " + T(p) + " to " + T(v.cards.find((C) => C.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new M("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new M("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Ht(a, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (v) {
        throw new M(Ge(v.message, o), "refused");
      }
      const p = r.lanes[r.lanes.length - 1];
      return w(r, "Added the lane " + T(p.label) + ".", { laneId: p.id });
    }
    case "remove_lane": {
      const r = k(n.lane), p = a.cards.filter((v) => v.laneId === r.id);
      if (i) {
        if (p.length) throw new M(T(p[0].label) + " is at " + T(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new M("A map needs at least two steps.", "refused", r.id);
      } else {
        if (p.length) throw new M(T(r.label) + " holds " + p.length + (p.length === 1 ? " card" : " cards") + ". Move or remove " + (p.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new M("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((v) => v !== r);
      for (const v of a.lanes) v.station && (v.station.next = v.station.next.filter((C) => C !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((v) => v !== r.id));
      for (const v of a.cards) v.allowedLaneIds && (v.allowedLaneIds = v.allowedLaneIds.filter((C) => C !== r.id));
      return ze(a, (v) => v.laneId === r.id), w(B(a, o), "Removed the " + y.lane + " " + T(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = k(n.lane);
      if (i) {
        if (n.allowedLanes !== void 0) throw new M(F.mapCardLanes, "not_on_this_board", r.id);
        let $ = n.label;
        if ($ === void 0) {
          let E = a.cards.length + 1;
          for (; a.cards.some((Y) => Y.label === "Token " + E); ) E++;
          $ = "Token " + E;
        }
        const O = new Set([...a.lanes, ...a.cards].map((E) => E.id));
        let _ = 1;
        for (; O.has("token-" + _); ) _++;
        a.cards.push({ id: "token-" + _, label: $, laneId: r.id });
        const D = B(a, o, r.id);
        return w(D, "Added " + T(D.cards[D.cards.length - 1].label) + " at " + T(r.label) + ".", { laneId: r.id, cardId: "token-" + _ });
      }
      if (n.label === void 0 || !n.label.trim()) throw new M("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new M("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && P(r.id) >= r.capacity)
        throw new M(T(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const p = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => k($).id))];
      let v;
      try {
        v = jt(a, r.id, { label: n.label, ...p && { allowedLaneIds: p } });
      } catch ($) {
        throw new M(Ge($.message, o), "refused", r.id);
      }
      const C = v.cards[v.cards.length - 1];
      return w(v, "Added " + T(C.label) + " to " + T(r.label) + ".", { laneId: r.id, cardId: C.id });
    }
    case "remove_card": {
      const r = I(n.card);
      if (i && a.cards.length === 1) throw new M("A map needs at least one token.", "refused", r.laneId, r.id);
      if (u && a.cards.length === 1) throw new M("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((p) => p !== r);
      for (const p of a.cards)
        p.dependsOn?.includes(r.id) && (p.dependsOn = p.dependsOn.filter((v) => v !== r.id), p.dependsOn.length || delete p.dependsOn);
      return ze(a, (p) => p.cardId === r.id), w(B(a, o, r.laneId), "Removed the " + y.card + " " + T(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? a.lanes.find((C) => C.id === n.lane.id) ?? null : A(n.lane), p = I(n.card, r?.id ?? null), v = k(n.lane, p.laneId);
      return G(p, v);
    }
    case "advance_card": {
      const r = I(n.card), p = a.lanes.find((C) => C.id === r.laneId), v = p.station.next.map((C) => a.lanes.find(($) => $.id === C)).filter((C) => !!C);
      if (!v.length) throw new M(T(r.label) + " is at " + T(p.label) + ", and no path leads on from there.", "refused", p.id, r.id);
      if (v.length > 1)
        throw new M("From " + T(p.label) + " the path goes to " + v.map((C) => T(C.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + v[0].label + "”.", "refused", p.id, r.id);
      return G(r, v[0]);
    }
    case "set_lane_capacity": {
      const r = k(n.lane), p = i ? "token" : u ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, w(B(a, o, r.id), i ? "Removed the limit at " + T(r.label) + "." : T(r.label) + " now holds any number of " + p + "s.", { laneId: r.id });
      const v = u ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > v)
        throw new M((i ? "A step" : "A lane") + " can hold from 1 to " + v + " " + p + "s.", "refused", r.id);
      const C = u ? a.cards.reduce(($, O) => $ + (O.laneId === r.id ? O.points ?? 1 : 0), 0) : P(r.id);
      if (C > n.capacity)
        throw new M(T(r.label) + " already holds " + C + " " + p + (C === 1 ? "" : "s") + ". Move some " + (i ? "on" : "out") + " first, or choose a higher " + (u ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, w(B(a, o, r.id), T(r.label) + " now holds up to " + n.capacity + " " + p + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = I(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, w(B(a, o, r.laneId, r.id), T(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const p = [...new Set(n.lanes.map((C) => k(C)))], v = a.lanes.find((C) => C.id === r.laneId);
      if (!p.includes(v)) throw new M(T(r.label) + " is in " + T(v.label) + " now. Include " + T(v.label) + ", or move the card first.", "refused", v.id, r.id);
      return r.allowedLaneIds = p.map((C) => C.id), w(B(a, o, r.laneId, r.id), T(r.label) + " can now go only in " + we(p.map((C) => T(C.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = I(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new M("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, w(B(a, o, r.laneId, r.id), T(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = I(n.card), p = [...new Set(n.dependsOn.map((C) => I(C)))], v = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const C = p.filter(($) => r.dependsOn?.includes($.id));
        if (!C.length) throw new M(T(r.label) + " does not depend on " + we(p.map(($) => T($.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter(($) => !C.some((O) => O.id === $)), r.dependsOn.length || delete r.dependsOn, w(B(a, o, r.laneId, r.id), T(r.label) + " no longer depends on " + we(C.map(($) => T($.label))) + ".", v);
      }
      if (!p.length) {
        if (n.mode === "add") throw new M("Name the features " + T(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, w(B(a, o, r.laneId, r.id), T(r.label) + " no longer depends on anything.", v);
      }
      if (p.includes(r)) throw new M("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...p.map((C) => C.id)])], w(B(a, o, r.laneId, r.id), T(r.label) + " now depends on " + we(p.map((C) => T(C.label))) + ".", v);
    }
    case "set_outcome": {
      const r = I(n.card), p = k(n.lane), v = a.signals ?? (a.signals = []), C = n.label, $ = C === void 0 ? v.filter((E) => E.cardId === r.id && E.laneId === p.id) : v.filter((E) => E.cardId === r.id && E.label.toLowerCase() === C.toLowerCase());
      if (C !== void 0 && $.length > 1) throw new M("Two outcomes on this card have that name.", "refused", p.id, r.id);
      if (!$.length && v.length >= 24) throw new M("A workshop can have up to 24 outcomes. Remove one first.", "refused", p.id, r.id);
      let O = 1;
      for (; v.some((E) => E.id === "signal-" + O); ) O++;
      const D = { label: C ?? $[0]?.label ?? (r.label + " in " + p.label).slice(0, 80).trim(), cardId: r.id, laneId: p.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], D) : v.push({ id: "signal-" + O, ...D }), w(B(a, o, p.id, r.id), "When " + T(r.label) + " is in " + T(p.label) + " the workshop says " + T(n.whenPresent) + ". Otherwise it says " + T(n.whenAbsent) + ".", { laneId: p.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = I(n.card), p = (a.signals ?? []).filter((v) => v.cardId === r.id);
      if (n.outcome === void 0) {
        if (!p.length) throw new M(T(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        ze(a, (v) => v.cardId === r.id);
      } else {
        const v = g(p, un(p, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        ze(a, (C) => C.id === v.id);
      }
      return w(B(a, o, r.laneId, r.id), "Removed the outcome from " + T(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((p) => k(p));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new M("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((p) => p.id), w(B(a, o), N(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new M("Say before or after, not both.", "invalid_edit");
      const r = k(n.lane), p = n.before ?? n.after, v = p === void 0 ? void 0 : k(p);
      if (v && v.id === r.id) throw new M("Choose two different scenes.", "refused", r.id);
      const C = kn(a).filter(($) => $.id !== r.id);
      return C.splice(v ? C.findIndex(($) => $.id === v.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = C.map(($) => $.id), w(B(a, o, r.id), N(C), { laneId: r.id });
    }
    case "add_station": {
      const r = k(n.from);
      let p;
      try {
        p = Fn(a, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (C) {
        throw new M(C.message, "refused", r.id);
      }
      const v = p.lanes[p.lanes.length - 1];
      return w(p, "Added a path from " + T(r.label) + " to " + T(v.label) + ".", { laneId: v.id });
    }
    case "insert_station": {
      const r = k(n.before), p = n.from === void 0 ? void 0 : k(n.from), v = p ? [p] : a.lanes.filter((O) => O.station.next.includes(r.id));
      if (p && !p.station.next.includes(r.id))
        throw new M("There is no path from " + T(p.label) + " to " + T(r.label) + ". Try “Add " + n.label + " after " + p.label + "”.", "refused", p.id);
      if (!v.length) throw new M("Nothing leads to " + T(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let C;
      try {
        C = Fn(a, v[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (O) {
        throw new M(O.message, "refused", r.id);
      }
      const $ = C.lanes[C.lanes.length - 1];
      for (const O of C.lanes)
        v.some((_) => _.id === O.id) && (O.station.next = [...new Set(O.station.next.map((_) => _ === r.id ? $.id : _))]);
      return $.station.next = [r.id], w(B(C, o, $.id), "Added " + T($.label) + " before " + T(r.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const r = k(n.from), p = k(n.to);
      if (r.id === p.id) throw new M("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(p.id) ? w(a, T(r.label) + " already leads to " + T(p.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(p.id), w(B(a, o, r.id), "Connected " + T(r.label) + " to " + T(p.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = k(n.from), p = k(n.to);
      if (!r.station.next.includes(p.id)) throw new M("There is no path between " + T(r.label) + " and " + T(p.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((v) => v !== p.id), w(B(a, o, r.id), "Removed the path from " + T(r.label) + " to " + T(p.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = k(n.station);
      return r.station.outcome = n.outcome, w(B(a, o, r.id), "Changed what happens at " + T(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = k(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), w(B(a, o, r.id), "Moved " + T(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = k(n.station);
      return n.image === null ? (delete r.station.image, w(B(a, o, r.id), "Removed the image at " + T(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, w(B(a, o, r.id), "Updated the image at " + T(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = k(n.station);
      if (!r.station.image) throw new M("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, w(B(a, o, r.id), "Updated the image description at " + T(r.label) + ".", { laneId: r.id });
    }
  }
  function G(r, p) {
    const v = { laneId: p.id, cardId: r.id };
    if (r.laneId === p.id)
      return w(e, T(r.label) + " is already " + (i ? "at " : "in ") + T(p.label) + ".", v, !1);
    const C = Ie(e, r.id, p.id);
    if (!C) throw new M(He(e, r.id, p.id) ?? "That move is not available.", "refused", p.id, r.id);
    return w(B(C, o, p.id, r.id), "Moved " + T(r.label) + " to " + T(p.label) + ".", v);
  }
}
function ze(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function It(e, n, o = {}) {
  const t = (g) => ({ refused: { index: 0, kind: null, laneId: null, ...g } });
  let a;
  try {
    a = q(e);
  } catch (g) {
    return t({ reason: "The workshop cannot be read: " + (g instanceof Error ? g.message : String(g)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = a, u = [];
  for (const [g, k] of n.entries()) {
    const I = k?.kind, A = typeof I == "string" ? wt.get(I) : void 0;
    if (!k || typeof k != "object" || !A)
      return t({
        index: g,
        kind: typeof I == "string" ? I : null,
        code: "invalid_edit",
        reason: "There is no edit called " + T(String(I)) + ". The edits are " + we(yn.map((r) => r.kind)) + "."
      });
    const w = kt(k, A);
    if (w) return t({ index: g, kind: A.kind, code: "invalid_edit", reason: w });
    const P = Ue(a);
    if (!A.boards.includes(P))
      return t({ index: g, kind: A.kind, code: "not_on_this_board", reason: A.refusals[P] ?? "This workshop does not take " + A.kind + "." });
    let N;
    try {
      N = vt(a, k, P, o.selection);
    } catch (r) {
      if (!(r instanceof M)) throw r;
      return t({
        index: g,
        kind: A.kind,
        reason: r.reason,
        code: r.code,
        laneId: r.laneId,
        ...r.cardId && { cardId: r.cardId },
        ...r.candidates && { candidates: r.candidates }
      });
    }
    const G = Ct(a, N.board);
    if (G) return t({ index: g, kind: A.kind, reason: G, code: "not_on_this_board", laneId: N.laneId ?? null });
    a = N.board, u.push({
      index: g,
      kind: A.kind,
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
  return { workshop: a, report: { edits: u, movedCards: y } };
}
const xt = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map"
};
function Ct(e, n) {
  const o = q(e), t = Ue(o);
  let a;
  try {
    a = q(n);
  } catch (y) {
    return Ge(y instanceof Error ? y.message : String(y), t);
  }
  const i = Ue(a), u = (y, g) => y.lanes.length === g.lanes.length && y.lanes.every((k) => g.lanes.some((I) => I.id === k.id)), b = (y, g) => y.lanes.every((k, I) => g.lanes[I]?.id === k.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && i !== t)
    return u(o, a) ? F.keepsCards : F.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, a)) return F.keepsOrder;
  if (t === "release-plan" && i === "release-plan") {
    if (!u(o, a)) return F.releaseLanes;
    if (!b(o, a)) return F.releaseOrder;
    if (a.cards.some((y) => !o.cards.some((g) => g.id === y.id))) return F.releaseCards;
  }
  return t !== i ? "This slate holds a " + xt[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
function St(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Pt(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), $t(n), n;
}
function At(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function $t(e) {
  return e && At(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Rn(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Tt(e) {
  return {
    id: e.id || `${e.parentId}->${e.childId}`,
    childId: e.childId,
    parentId: e.parentId,
    isStraightLine: e.isStraightLine ?? e.blnStraight ?? !1,
    lineColor: e.lineColor || "#666666",
    lineEffect: e.lineEffect || "",
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
function Pt(e) {
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
const Nn = "#1f7a5c", Mn = "#5b9a85", dn = "#c2410c", Lt = { canMove: !1, canSelect: !1 };
function Ot(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function uo(e, n, o = {}) {
  let t = q(n), a = null, i = !!o.readOnly, u = !1;
  const b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  let A = null, w = null, P = null;
  const N = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map();
  let r = null, p = Promise.resolve(), v = null, C = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const $ = { ...o.style };
  let O = /* @__PURE__ */ new Map(), _ = null, D = !1;
  ae(t, { layout: C });
  const E = o.origin ? { x: o.origin.x, y: o.origin.y } : Rt(e), Y = (s) => I.get(s) ?? s, U = (s) => Ot(Y(s));
  function Q(s) {
    const d = k.get(s);
    if (d) return d;
    if (b.has(s) && !I.has(s) || !e.nodes.one?.(s)) return s;
    const c = et(s, (h) => !!e.nodes.one?.(h) || I.has(h));
    return k.set(s, c), I.set(c, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${c}".`), c;
  }
  const re = {
    governs(s) {
      if (b.get(s.id) !== s) return null;
      const d = U(s.id)?.kind;
      return d === "card" ? { canMove: !i, canEditText: !i && !a && t.kind !== "release-plan" } : d === "lane" ? { canMove: !1, canEditText: !i && !a } : Lt;
    },
    onStart(s, d) {
      const c = U(s.id).key;
      if (i || a || !t.cards.some((l) => l.id === c)) return !1;
      Z(), ye();
      const h = { x: d.x - (s.options.x ?? 0), y: d.y - (s.options.y ?? 0) };
      let x = null;
      try {
        x = o.chooseCandidate?.(t, c, h) ?? null;
      } catch (l) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", l);
      }
      return A = { cardId: c, evaluate: x, outcome: { kind: "home" } }, H(t, { skip: c }), !0;
    },
    onMove(s, d) {
      if (!A) return;
      const c = Ae(A.cardId, d, A.evaluate);
      if (Et(c, A.outcome)) return;
      A.outcome = c;
      const h = c.kind === "candidate" ? c.next : null;
      H(h ?? t, { skip: A.cardId }), j(o.onPreview, h);
    },
    onEnd(s, d) {
      if (!A) return { accept: !1 };
      const { cardId: c, evaluate: h } = A, x = Ae(c, d, h), l = t.cards.find((f) => f.id === c);
      if (A = null, j(o.onPreview, null), x.kind === "candidate") {
        t = x.next, H(t, { skip: c });
        const f = t.lanes.find((S) => S.id === x.laneId);
        e.announce?.(`${l.label} moved to ${f.label}. ${de(t, f.id)}.`), j(o.onChange, t, { cardId: c, laneId: x.laneId });
        const m = dt(t, Y(s.id));
        return m ? { accept: !0, settle: m } : { accept: !0 };
      }
      if (x.kind === "refused")
        it(l.label, { cardId: c, laneId: x.laneId, reason: x.reason });
      else if (x.kind === "outside" && je(t) && !Qe()) {
        const f = De(t, c);
        if (!f)
          return tn(c, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        H(t, { skip: c }), e.announce?.(f), j(o.onRefuse, { cardId: c, laneId: null, reason: f });
      } else
        H(t, { skip: c }), x.kind === "outside" && (e.announce?.(`${l.label} was not dropped on a lane. It stays where it was.`), j(o.onRefuse, { cardId: c, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      const d = A && t.cards.find((c) => c.id === A.cardId);
      A = null, j(o.onPreview, null), H(t, { skip: U(s.id)?.key }), d && e.announce?.(`Move cancelled. ${d.label} stays where it was.`);
    },
    onTextCommit(s, d, c) {
      const h = U(s.id);
      if (!h || i || a) return !1;
      const x = d.replace(/\s+/g, " ").trim(), l = h.kind === "lane" ? { laneId: h.key, label: x } : { cardId: h.key, label: x }, f = It(t, [h.kind === "lane" ? { kind: "rename_lane", lane: { id: h.key }, label: x } : { kind: "rename_card", card: { id: h.key }, label: x }]);
      if ("refused" in f) {
        const { reason: m } = f.refused;
        return e.announce?.(`${c} keeps its name. ${m}`), j(o.onRefuse, { ...h.kind === "lane" ? { laneId: h.key } : { cardId: h.key }, rename: l, reason: m }), !1;
      }
      return x === c ? !1 : (t = f.workshop, H(t), e.announce?.(`${c} renamed to ${x}.`), j(o.onChange, t, { rename: l }), x);
    },
    onKeyDown(s, d) {
      const c = U(s.id);
      if (c?.kind !== "card" || i || a || A || d.ctrlKey || d.metaKey || d.altKey) return !1;
      const h = t.cards.find((x) => x.id === c.key);
      if (!h) return !1;
      if (d.key === "ArrowLeft" || d.key === "ArrowRight")
        return d.preventDefault(), In(h.id, d.key === "ArrowLeft" ? -1 : 1), !0;
      if ((d.key === "ArrowUp" || d.key === "ArrowDown") && tt())
        return d.preventDefault(), In(h.id, d.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (w?.cardId !== h.id) return !1;
      if (d.key === "Enter") {
        d.preventDefault();
        const { laneId: x, next: l, spot: f } = w;
        if (w = null, x === null)
          return j(o.onPreview, null), tn(h.id, f), !0;
        t = l, H(t), he(x), j(o.onPreview, null);
        const m = t.lanes.find((S) => S.id === x);
        return e.announce?.(`${h.label} moved to ${m.label}. ${de(t, x)}.`), j(o.onChange, t, { cardId: h.id, laneId: x }), !0;
      }
      return d.key === "Escape" ? (d.preventDefault(), ye(), e.announce?.(`Move cancelled. ${h.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((d) => b.get(d.id) === d).map((d) => d.id);
      D = s.length === 1, b.clear(), y.clear(), g.clear(), k.clear(), I.clear(), A = null, w = null, H(a ?? t, { animate: !1 }), s.length === 1 && (p = p.then(() => {
        D = !1;
        const d = b.get(s[0]);
        if (!u && d && !(e.getSelectedNodes?.() ?? []).length) {
          const c = () => e.selectNodes?.([d]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
        }
        Je();
      }));
    }
  };
  re.onFreeMove = (s, d) => {
    if (!Ee() || s.options?.isComment) return Xe();
    const c = Re(d), h = Ne(s), x = t.lanes.filter((f) => !$e(s) && ke(t, f.id, h) === null).map((f) => f.id), l = c ? $e(s) ?? ke(t, c, h) : null;
    P && P.noteId === s.id && P.laneId === c && P.refusal === l || (P = { noteId: s.id, laneId: c, refusal: l, open: x }, pe());
  }, re.onFreeDrop = (s, d, c) => {
    if (Xe(), !Ee() || s.options?.isComment) return;
    const h = Re(d);
    if (!h) return;
    const x = Ne(s), l = t.lanes.find((m) => m.id === h), f = $e(s) ?? ke(t, h, x);
    return f ? (Z(!1), r = { laneId: h, reason: f, timer: setTimeout(() => Z(), 1500) }, pe(), e.announce?.(`${en(x.label)} can't go in ${l.label}. ${f}`), j(o.onRefuse, { noteId: s.id, laneId: h, reason: f }), "refused") : (nn([{ node: s, offer: x, from: c }], h), "taken");
  }, re.onFreeGroupDrop = (s, d, c) => {
    if (Xe(), !Ee() || s.some((m) => m.options?.isComment)) return;
    const h = Re(d);
    if (!h) return;
    const x = t.lanes.find((m) => m.id === h), l = s.map((m) => ({ node: m, offer: Ne(m) })), f = rt(l, h);
    if (f) {
      Z(!1), r = { laneId: h, reason: f, timer: setTimeout(() => Z(), 1500) }, pe(), e.announce?.(`${xn(l.map((m) => en(m.offer.label)))} can't go in ${x.label}. ${f}`);
      for (const { node: m } of l) j(o.onRefuse, { noteId: m.id, laneId: h, reason: f });
      return "refused";
    }
    return nn(l.map((m, S) => ({ ...m, from: c?.[S] })), h), "taken";
  }, re.onFreeTextCommit = (s) => {
    if (!Ee() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const d = s.options ?? {}, c = Re({ x: (d.x ?? 0) + (d.width ?? 0) / 2, y: (d.y ?? 0) + (d.height ?? 0) / 2 });
    if (!c) return;
    const h = Ne(s), x = t.lanes.find((R) => R.id === c), l = $e(s) ?? ke(t, c, h);
    if (!l) {
      nn([{ node: s, offer: h }], c);
      return;
    }
    Z(!1), r = { laneId: c, reason: l, timer: setTimeout(() => Z(), 1500) }, pe(), e.announce?.(`${en(h.label)} can't go in ${x.label}. ${l} It is beside the board.`), j(o.onRefuse, { noteId: s.id, laneId: c, reason: l });
    const { width: f } = ae(t, { layout: C }), m = Math.round(E.x + f + 32), S = Math.round(d.y ?? E.y);
    s.position(m, S, () => e.updateSelectionResizeRotate?.(), void 0, ln() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Rn({ ...s.options, x: m, y: S })] });
  }, re.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...N] }), re.onUndoRestore = (s, d) => {
    if (u) return;
    const c = new Map((s?.cards ?? []).map((l) => [l.id, l])), h = new Map(s?.pairs ?? []), x = (l) => N.get(l) ?? h.get(l) ?? l;
    for (const l of d.added) {
      const f = x(l), m = t.cards.find((S) => S.id === f);
      m && (t = q({ ...t, cards: t.cards.filter((S) => S !== m) }), H(t), _n(j(o.onChange, t, { cardId: f, cardToNote: { noteId: l } })));
    }
    for (const l of d.removed) {
      const f = x(l), m = c.get(f);
      if (!m || t.cards.some((W) => W.id === f)) continue;
      const S = { id: f, label: m.label, ...m.look ? { look: m.look } : {}, ...m.asNote ? { asNote: m.asNote } : {} }, R = [m.laneId, ...t.lanes.map((W) => W.id)].find((W) => Pe(t, W, S));
      if (!R) {
        e.announce?.(`${m.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = at(Pe(t, R, S), f, s?.cards ?? []), f !== l && N.set(l, f), H(t);
      const L = t.cards.findIndex((W) => W.id === f), z = t.cards.slice(L + 1).find((W) => W.laneId === R)?.id;
      _n(j(o.onChange, t, { cardId: f, laneId: R, noteToCard: {
        noteId: l,
        label: m.label,
        ...m.look ? { look: m.look } : {},
        ...m.asNote ? { asNote: m.asNote } : {},
        ...z ? { before: z } : {}
      } }));
    }
  };
  const Ce = e.setDragPolicy(re), Se = o.onSelect && e.onSelectionChange?.(() => Je()), X = () => {
    w && ye();
  };
  e.element?.addEventListener?.("pointerdown", X, !0), H(t, { animate: !1 });
  function Ae(s, d, c) {
    const h = t.cards.find((L) => L.id === s);
    if (!h) return { kind: "outside" };
    const x = t.lanes.map((L) => b.get(Q(ne.column(L.id)))).filter(Boolean), l = e.hitTestNodes(d, x, { padding: 6 }), f = l ? U(l.id).key : null;
    if (!f) return { kind: "outside" };
    if (f === h.laneId) return { kind: "home" };
    const m = Ie(t, s, f);
    if (!m) return { kind: "refused", laneId: f, reason: He(t, s, f) ?? "That move is not available." };
    if (!c) return { kind: "candidate", laneId: f, next: m };
    let S = null;
    try {
      S = c({ x: d.x - E.x, y: d.y - E.y });
    } catch (L) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", L), { kind: "candidate", laneId: f, next: m };
    }
    const R = S?.cards.find((L) => L.id === s)?.laneId;
    return !S || !R || R === h.laneId ? { kind: "home" } : { kind: "candidate", laneId: R, next: S };
  }
  function tt() {
    return new Set(ae(t, { layout: C }).places.map((s) => s.row)).size > 1;
  }
  function In(s, d, c = !1) {
    const h = t.cards.find((L) => L.id === s), x = Wn(t, s), l = w?.cardId === s && w.laneId === null ? w.side : void 0;
    if (l !== void 0) {
      if (c || d === l) return;
      const L = l > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (ye(), L.id === h.laneId) {
        he(L.id, a ?? t), e.announce?.(`${h.label} is back in ${L.label}.`);
        return;
      }
      if (x.includes(L)) {
        const W = Ie(t, s, L.id);
        w = { cardId: s, laneId: L.id, next: W }, H(W), he(L.id, W), j(o.onPreview, W), e.announce?.(`${h.label} to ${L.label}: ${de(W, L.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const z = He(t, s, L.id) ?? "That move is not available.";
      Z(), r = { laneId: L.id, reason: z, timer: setTimeout(() => Z(), 1500) }, H(a ?? t), he(L.id, a ?? t), e.announce?.(`${h.label} can't move to ${L.label}. ${z}`), j(o.onRefuse, { cardId: s, laneId: L.id, reason: z });
      return;
    }
    const f = w?.cardId === s ? w.laneId : h.laneId;
    let m;
    if (c) {
      const { places: L } = ae(t, { layout: C }), z = L.find((W) => W.laneId === f);
      m = L.filter((W) => W.column === z.column && (W.row - z.row) * d > 0).sort((W, te) => (W.row - te.row) * d).map((W) => t.lanes.find((te) => te.id === W.laneId));
    } else {
      const L = t.lanes.findIndex((z) => z.id === f);
      m = d > 0 ? t.lanes.slice(L + 1) : t.lanes.slice(0, L).reverse();
    }
    const S = m.find((L) => x.includes(L));
    if (Z(), !S) {
      const L = m[0];
      if (!L) {
        if (!c && je(t)) {
          const W = De(t, s);
          if (W) {
            e.announce?.(W), j(o.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          ot(h, d);
          return;
        }
        e.announce?.(`${h.label} has no lane to move to on that side.`);
        return;
      }
      const z = He(t, s, L.id) ?? "That move is not available.";
      r = { laneId: L.id, reason: z, timer: setTimeout(() => Z(), 1500) }, H(w?.next ?? a ?? t), he(L.id, w?.next ?? a ?? t), e.announce?.(`${h.label} can't move to ${L.label}. ${z}`), j(o.onRefuse, { cardId: s, laneId: L.id, reason: z });
      return;
    }
    if (S.id === h.laneId) {
      ye(), he(S.id, a ?? t), e.announce?.(`${h.label} is back in ${S.label}.`);
      return;
    }
    const R = Ie(t, s, S.id);
    w = { cardId: s, laneId: S.id, next: R }, H(R), he(S.id, R), j(o.onPreview, R), e.announce?.(`${h.label} to ${S.label}: ${de(R, S.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function he(s, d = t) {
    const c = ae(d, { layout: C, rows: An() }).places.find((S) => S.laneId === s), h = e.canvas?.viewbox?.();
    if (!c || !h || !(h.width > 0) || !(h.height > 0)) return;
    const x = 16, l = (S, R, L, z) => R + x * 2 >= z || S - x < L ? S - x - L : S + R + x > L + z ? S + R + x - (L + z) : 0, f = l(E.x + c.x, c.width, h.x, h.width), m = l(E.y + c.y, c.height, h.y, h.height);
    (f || m) && e.panBy?.({ x: f, y: m });
  }
  function Je() {
    if (!o.onSelect || D) return;
    const s = u ? [] : e.getSelectedNodes?.() ?? [], d = s.length === 1 && b.get(s[0].id) === s[0] ? U(s[0].id) : null, c = d?.kind === "card" ? { cardId: d.key } : d?.kind === "lane" ? { laneId: d.key } : null, h = c ? JSON.stringify(c) : null;
    h !== _ && (_ = h, j(o.onSelect, c));
  }
  function ye() {
    w && (w = null, j(o.onPreview, null), H(a ?? t));
  }
  function ot(s, d) {
    const { width: c } = ae(t, { layout: C }), h = b.get(Q(ne.card(s.id)))?.options, x = h?.width ?? 228, l = { x: d > 0 ? E.x + c + 32 : E.x - x - 32, y: h?.y ?? E.y }, f = zn(t, s.id);
    w = { cardId: s.id, laneId: null, side: d, spot: l, next: t }, H(t), j(o.onPreview, f), e.announce?.(`${s.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Qe() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ee() {
    return !u && !i && !a && !A && !Qe() && je(t);
  }
  function Xe() {
    P && (P = null, u || pe());
  }
  function Re(s) {
    const d = t.lanes.map((h) => b.get(Q(ne.column(h.id)))).filter(Boolean), c = e.hitTestNodes(s, d, { padding: 6 });
    return c ? U(c.id)?.key ?? null : null;
  }
  function Ne(s) {
    const d = s.options ?? {}, c = _t({
      backgroundColor: d.backgroundColor,
      textColor: d.fontColor,
      fontFamily: d.fontFamily,
      fontSize: d.fontSize,
      borderColor: d.borderColor,
      borderWidth: d.borderWidth
    }), h = String(d.text ?? ""), x = h.replace(/\s+/g, " ").trim(), l = {};
    h.trim() !== x && h.length <= 400 && (l.text = h.trim()), typeof d.shape == "string" && /^[a-z]{1,24}$/i.test(d.shape) && (l.shape = d.shape);
    for (const f of ["width", "height"]) Number.isFinite(d[f]) && d[f] >= 10 && d[f] <= 4e3 && (l[f] = Math.round(d[f]));
    return { id: s.id, label: x, ...c ? { look: c } : {}, ...Object.keys(l).length ? { asNote: l } : {} };
  }
  function xn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function rt(s, d) {
    for (const { node: l } of s) {
      const f = $e(l);
      if (f) return f;
    }
    const c = t.lanes.find((l) => l.id === d), h = t.cards.filter((l) => l.laneId === d).length;
    if (c.capacity !== void 0 && h + s.length > c.capacity) {
      const l = c.capacity - h;
      return l > 0 ? `It has room for ${l} more ${l === 1 ? "card" : "cards"}.` : `It already holds ${h} of ${c.capacity} ${c.capacity === 1 ? "card" : "cards"}.`;
    }
    let x = t;
    for (const { offer: l } of s) {
      const f = ke(x, d, l);
      if (f) return f;
      x = Pe(x, d, l);
    }
    return null;
  }
  function $e(s) {
    return (s.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((c) => c !== s && (c.relationships?.associations ?? []).some((h) => h.child === s || h.childId === s.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : s.options?.image ? "A note with a picture stays a note." : s.options?.link?.show && s.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const en = (s) => s || "This note";
  function nn(s, d) {
    let c = t;
    const h = s.map(({ node: f, offer: m, from: S }) => {
      c = Pe(c, d, m);
      const R = { ...f.options ?? {}, ...S ? { x: S.x, y: S.y } : {} };
      return { node: f, card: c.cards[c.cards.length - 1], kept: R };
    });
    e.beginHostStep?.(), t = c;
    let x = t;
    for (const { node: f, card: m } of h)
      m.id !== f.id && N.set(f.id, m.id), G.set(Q(ne.card(m.id)), { x: f.options?.x ?? 0, y: f.options?.y ?? 0 }), Me(() => e.removeNode(f.id));
    e.endHostStep?.(), H(t), st(Q(ne.card(h[0].card.id)));
    const l = t.lanes.find((f) => f.id === d);
    e.announce?.(h.length === 1 ? `${h[0].card.label} is now a card in ${l.label}. ${de(t, d)}.` : `${xn(h.map(({ card: f }) => f.label))} are now cards in ${l.label}. ${de(t, d)}.`);
    for (const { node: f, card: m, kept: S } of h) {
      const R = { cardId: m.id, laneId: d, noteToCard: {
        noteId: f.id,
        label: m.label,
        ...m.look ? { look: m.look } : {},
        ...m.asNote ? { asNote: m.asNote } : {}
      } }, L = () => {
        t !== x || !t.cards.some((z) => z.id === m.id) || (t = q({ ...t, cards: t.cards.filter((z) => z.id !== m.id) }), x = t, H(t));
      };
      Cn(j(o.onChange, t, R), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: f.id, isComment: !1 } }]);
      }, () => {
        if (!u) {
          if (L(), !e.nodes.one(S.id)) {
            e.beginHostStep?.();
            const z = Me(() => e.addNode({ ...S }));
            z && (z.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${m.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        u || (L(), e.announce?.(`Someone else put ${m.label} on the board first.`));
      });
    }
  }
  function tn(s, d) {
    const c = t.cards.find((V) => V.id === s), h = t.lanes.find((V) => V.id === c.laneId), x = t.cards.findIndex((V) => V.id === s), l = t.cards.slice(x + 1).find((V) => V.laneId === c.laneId)?.id, f = zn(t, s), m = y.get(Q(ne.card(s))) ?? {}, S = e.nodes.one(s) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : s, R = ($.cornerRadius ?? 0) > 0, L = c.asNote, z = L?.text !== void 0 && L.text.replace(/\s+/g, " ").trim() === c.label ? L.text : c.label, W = {
      id: S,
      x: Math.round(d.x),
      y: Math.round(d.y),
      width: L?.width ?? m.width ?? 228,
      height: L?.height ?? m.height ?? 76,
      text: z,
      shape: L?.shape ?? (R ? "roundedrectangle" : "rectangle"),
      backgroundColor: c.look?.backgroundColor ?? m.backgroundColor,
      fontColor: c.look?.textColor ?? m.foregroundColor,
      fontSize: c.look?.fontSize ?? m.fontSize,
      borderColor: c.look?.borderColor ?? m.borderColor,
      borderWidth: c.look?.borderWidth ?? m.borderWidth,
      ...c.look?.fontFamily ?? m.fontFamily ? { fontFamily: c.look?.fontFamily ?? m.fontFamily } : {}
    };
    for (const V of Object.keys(W)) W[V] === void 0 && delete W[V];
    e.beginHostStep?.(), t = f;
    const te = t;
    S !== s ? N.set(S, s) : N.delete(S);
    const ee = Me(() => e.addNode(W));
    ee && (ee.announcedByCreator = !0), e.endHostStep?.(), H(t), ee?.ready?.then?.(() => {
      if (u || e.nodes.one(S) !== ee) return;
      const V = () => e.selectNodes?.([ee]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(V) : V();
    }), e.announce?.(`${c.label} is now a note on the canvas. ${h.label}: ${de(t, h.id)}.`);
    const Tn = () => {
      e.nodes.one(S) === ee && (e.beginHostStep?.(), Me(() => e.removeNode(S)), e.endHostStep?.());
    };
    Cn(j(o.onChange, t, { cardId: s, cardToNote: { noteId: S } }), () => {
      ee && e.nodes.one(S) === ee && e.sendHeld?.([{ type: "onNodeAdded", data: { id: S, nodeOptions: Rn(ee.options) } }]);
    }, () => {
      if (!u) {
        if (Tn(), t === te && !t.cards.some((V) => V.id === s)) {
          const V = { id: s, label: c.label, ...c.look ? { look: c.look } : {}, ...c.asNote ? { asNote: c.asNote } : {} }, Pn = Pe(t, c.laneId, V, l);
          Pn && (t = Pn, H(t));
        }
        e.announce?.(`${c.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      u || (Tn(), e.announce?.(`Someone else took ${c.label} off the lanes first.`));
    });
  }
  function at(s, d, c) {
    const h = c.map((S) => S.id), x = h.indexOf(d), l = s.cards.find((S) => S.id === d);
    if (x < 0 || !l) return s;
    const f = s.cards.filter((S) => S !== l), m = f.findIndex((S) => h.indexOf(S.id) > x);
    return f.splice(m < 0 ? f.length : m, 0, l), q({ ...s, cards: f });
  }
  function st(s) {
    p = p.then(() => {
      const d = b.get(s);
      if (u || !d) return;
      const c = () => e.selectNodes?.([d]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
    });
  }
  function Me(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Cn(s, d, c, h) {
    if (!s || typeof s.then != "function") return d();
    const x = s.then((l) => {
      l === !0 ? d() : l === !1 ? c() : l === "taken" && h();
    }, () => c());
    e.holdUntil?.(x);
  }
  function it(s, d) {
    Z(!1), r = { laneId: d.laneId, reason: d.reason, timer: setTimeout(() => Z(), 1500) }, H(t, { skip: d.cardId });
    const c = t.lanes.find((h) => h.id === d.laneId);
    e.announce?.(`${s} can't move to ${c?.label ?? "that lane"}. ${d.reason}`), j(o.onRefuse, d);
  }
  function Z(s = !0) {
    r && (clearTimeout(r.timer), r = null, s && !u && pe());
  }
  function pe() {
    H(A && A.outcome.kind === "candidate" ? A.outcome.next : w?.next ?? a ?? t, { skip: A?.cardId });
  }
  function Sn(s) {
    const d = Dn(s, { native: !0, origin: E, rows: An(), layout: C, style: $ }).nodes, c = new Map(d.map((l) => [l.options.id, l.options])), h = (l, f, m, S = !1) => {
      const R = c.get(ne.column(l));
      R && (R.borderColor = f, R.borderWidth = m, delete R.borderStyle);
      const L = S && c.get(ne.lane(l));
      L && (L.borderColor = f, L.borderWidth = m);
    }, x = A?.cardId ?? w?.cardId;
    if (O = /* @__PURE__ */ new Map(), x) {
      const l = t.cards.find((m) => m.id === x)?.laneId;
      for (const m of Wn(t, x)) m.id !== l && (h(m.id, Mn, 2), O.set(m.id, "open"));
      const f = A ? A.outcome : w?.laneId ? { kind: "candidate", laneId: w.laneId } : null;
      f?.kind === "candidate" && (h(f.laneId, Nn, 3, !0), O.set(f.laneId, "over")), f?.kind === "refused" && (h(f.laneId, dn, 3), O.set(f.laneId, "refused"));
    }
    if (P && !x) {
      for (const l of P.open) l !== P.laneId && (h(l, Mn, 2), O.set(l, "open"));
      P.laneId && !P.refusal && (h(P.laneId, Nn, 3, !0), O.set(P.laneId, "over")), P.laneId && P.refusal && (h(P.laneId, dn, 3), O.set(P.laneId, "refused"));
    }
    if (w?.laneId === null && w.spot) {
      const l = c.get(ne.card(w.cardId));
      l && (l.xPos = w.spot.x, l.yPos = w.spot.y);
    }
    if (r) {
      O.set(r.laneId, "refused"), h(r.laneId, dn, 3, !0);
      const l = c.get(ne.caption(r.laneId));
      l && (l.text = r.reason, l.foregroundColor = "#b42318");
    }
    for (const l of d) {
      l.options.id = Q(l.options.id);
      for (const f of l.relationships.associations)
        f.parentId = Q(f.parentId), f.childId = Q(f.childId);
    }
    return d;
  }
  function An() {
    return A || w ? t.lanes.map((s) => t.cards.filter((d) => d.laneId === s.id).length) : void 0;
  }
  function H(s, d = {}) {
    if (u) return;
    v = { model: s, skip: d.skip, animate: d.animate !== !1 };
    const c = Sn(s), h = [];
    for (const { options: l } of c) {
      const f = l.id;
      if (b.has(f)) continue;
      const m = G.get(f);
      G.delete(f);
      const S = m && d.animate !== !1 && !ln() ? { ...l, xPos: m.x, yPos: m.y } : l, R = e.nodes.add(St(S));
      b.set(f, R), y.set(f, { ...S }), R.ready && h.push(R.ready.then(() => {
        if (b.get(f) !== R) return;
        R.applyGovernance?.(), U(f)?.kind === "column" && R.toBack?.(!1);
        const L = $n(v?.model ?? s, f);
        L && R.svgGroup?.node?.setAttribute("aria-label", L);
      }).catch(() => {
      }));
    }
    const x = v;
    p = Promise.all([p, ...h]).then(() => {
      u || v !== x || lt(Sn(x.model), x);
    }).catch((l) => console.warn("WORKSHOP: could not draw the workshop", l));
  }
  function lt(s, d) {
    const c = new Set(s.map((x) => x.options.id)), h = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [l, f] of [...b]) {
        if (c.has(l)) continue;
        for (const [S, R] of [...g])
          R.parentId !== l && R.childId !== l || (R.parent.relationships?.removeAssociation(S), g.delete(S));
        e.deselectNode?.(f), f.editor?.cancelInline?.(), b.delete(l), y.delete(l);
        const m = I.get(l);
        m && (I.delete(l), k.delete(m)), e.nodes.remove(l);
      }
      for (const { options: l } of s) {
        const f = l.id, m = b.get(f);
        if (!m?.svgGroup) continue;
        const S = y.get(f) ?? {}, R = m.editor?.isInlineEditing?.();
        (l.fontSize !== S.fontSize || l.foregroundColor !== S.foregroundColor) && (m.options.fontSize = l.fontSize, m.options.fontColor = l.foregroundColor, m.applyTextStyle?.()), l.text !== S.text && !R && m.setText?.(l.text), (l.width !== S.width || l.height !== S.height) && (l.vectorPath ? (m.options.width = l.width, m.options.height = l.height, m.setShape?.(m.options.shape, l.vectorPath), U(f)?.kind === "column" && m.toBack?.(!1)) : m.setSize?.(l.width, l.height)), l.backgroundColor !== S.backgroundColor && m.setColors?.(l.backgroundColor), (l.borderColor !== S.borderColor || l.borderWidth !== S.borderWidth || l.borderStyle !== S.borderStyle) && (m.options.borderColor = l.borderColor, m.options.borderWidth = l.borderWidth, m.options.borderStyle = l.borderStyle, m.applyBorder?.());
        const L = l.xPos !== S.xPos || l.yPos !== S.yPos || Math.abs((m.options.x ?? 0) - l.xPos) > 0.5 || Math.abs((m.options.y ?? 0) - l.yPos) > 0.5;
        if (f !== (d.skip && Q(ne.card(d.skip))) && L) {
          const te = d.animate && !ln() ? 180 : 0, ee = h.includes(m) ? () => {
            !u && b.get(f) === m && (e.getSelectedNodes?.() ?? []).includes(m) && e.updateSelectionResizeRotate?.();
          } : void 0;
          ee && te && h.length === 1 && m.resizeRotate?.disable?.(), m.position(l.xPos, l.yPos, ee, void 0, te);
        }
        const z = $n(d.model, f);
        z && m.svgGroup.node.getAttribute("aria-label") !== z && m.svgGroup.node.setAttribute("aria-label", z);
        const W = U(f);
        if (W?.kind === "column") {
          const te = O.get(W.key);
          te ? m.svgGroup.node.setAttribute("data-workshop-drop", te) : m.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        y.set(f, { ...l });
      }
      const x = /* @__PURE__ */ new Map();
      for (const l of s) for (const f of l.relationships.associations) x.set(f.id, f);
      for (const [l, f] of [...g])
        x.has(l) && b.get(f.parentId) === f.parent && b.get(f.childId) === f.child || (f.parent.relationships?.removeAssociation(l), g.delete(l));
      for (const [l, f] of x) {
        if (g.has(l)) continue;
        const m = b.get(f.parentId), S = b.get(f.childId);
        !m?.relationships || !S?.svgGroup || (m.relationships.addAssociation(S, Tt(f)), g.set(l, { parentId: f.parentId, childId: f.childId, parent: m, child: S }));
      }
    }), e.notifyNodeChanged?.();
  }
  function $n(s, d) {
    const c = U(d);
    if (c?.kind === "lane") {
      const h = s.lanes.find((x) => x.id === c.key);
      return h ? `${h.label}, ${de(s, h.id)}` : null;
    }
    if (c?.kind === "card") {
      const h = s.cards.find((l) => l.id === c.key), x = h && s.lanes.find((l) => l.id === h.laneId);
      return h && x ? `${h.label}, in ${x.label}` : null;
    }
    return null;
  }
  function dt(s, d) {
    const c = Dn(s, { native: !0, origin: E, layout: C, style: $ }).nodes.find((h) => h.options.id === d)?.options;
    return c ? { x: c.xPos, y: c.yPos } : null;
  }
  function be() {
    A && e.cancelGovernedDrag?.("host"), A = null, w && (w = null, j(o.onPreview, null)), Z(!1);
  }
  return {
    toCanvas(s) {
      if (u || i || Qe()) return "This workshop is view-only here.";
      if (!t.cards.some((x) => x.id === s)) return "That card is no longer on the board.";
      const d = De(t, s);
      if (d) return d;
      w && ye(), a && (be(), a = null, H(t), e.refreshGovernance?.());
      const { width: c } = ae(t, { layout: C }), h = b.get(Q(ne.card(s)))?.options;
      return tn(s, { x: E.x + c + 32, y: h?.y ?? E.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...E };
    },
    get layout() {
      return { ...C };
    },
    get bounds() {
      const { width: s, height: d } = ae(t, { layout: C });
      return { x: E.x, y: E.y, width: s, height: d };
    },
    setLayout(s) {
      if (u) throw new Error("This workshop has been detached.");
      const d = s?.lanesPerRow === void 0 ? {} : { lanesPerRow: s.lanesPerRow };
      ae(t, { layout: d }), d.lanesPerRow !== C.lanesPerRow && (be(), C = d, H(a ?? t));
    },
    whenDrawn: () => p,
    update(s) {
      if (u) throw new Error("This workshop has been detached.");
      const d = q(s);
      be(), t = d, H(a ?? t);
    },
    preview(s) {
      if (u) throw new Error("This workshop has been detached.");
      const d = s ? q(s) : null;
      be(), a = d, H(a ?? t), e.refreshGovernance?.();
    },
    refuse(s, d) {
      const c = t.lanes.find((h) => h.id === s);
      u || !c || (Z(!1), r = { laneId: s, reason: d, timer: setTimeout(() => Z(), 1500) }, pe(), e.announce?.(`${c.label}: ${d}`));
    },
    setReadOnly(s) {
      u || i === !!s || (be(), i = !!s, H(a ?? t), e.refreshGovernance?.());
    },
    destroy() {
      u || (be(), u = !0, e.element?.removeEventListener?.("pointerdown", X, !0), Se?.(), e.withPolicyAuthority(() => {
        for (const [s, d] of g) d.parent.relationships?.removeAssociation(s);
        for (const [s, d] of b)
          e.deselectNode?.(d), d.editor?.cancelInline?.(), e.nodes.one(s) === d && e.nodes.remove(s);
      }), g.clear(), b.clear(), y.clear(), k.clear(), I.clear(), Ce(), D = !1, Je(), e.notifyNodeChanged?.());
    }
  };
}
function j(e, ...n) {
  try {
    return e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function _n(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
  }, () => {
  });
}
function Et(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function Rt(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const a of n)
    o = Math.max(o, (a.options.x ?? 0) + (a.options.width ?? 0)), t = Math.min(t, a.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
function ce(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function oe(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Kn(e) {
  const n = ce(e);
  let o;
  try {
    o = new URL(oe(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: oe(n.alt, 240) };
}
function le(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Nt = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Mt = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Oe(e) {
  const n = ce(e), o = {}, t = (i) => {
    if (typeof i != "string" || !Nt.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, a = (i, u, b) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < u || i > b) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !Mt.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = a(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = a(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function _t(e) {
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
  const n = ce(e), o = {};
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
function me(e, n) {
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
function Wt(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const ve = (e) => "lane-" + e, fe = (e) => "card-" + e, Ye = (e) => "image-" + e;
function fo(e) {
  const n = Wt(e);
  return kn(e).map((o) => {
    const t = e.cards.filter((u) => u.laneId === o.id), a = n.filter((u) => u.laneId === o.id), i = [ve(o.id)];
    return o.station?.image && i.push(Ye(o.id)), { lane: o, cards: t, signals: a, nodeIds: [...i, ...t.map((u) => fe(u.id))] };
  });
}
const Yn = 5, Vn = 24, fn = 3;
function q(e) {
  const n = ce(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = oe(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Yn)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > Vn)
    throw new Error("A workshop supports up to 24 cards.");
  const a = n.lanes.map((y) => {
    const g = ce(y), k = { id: le(g.id), label: oe(g.label) };
    if (g.capacity !== void 0) {
      const I = o ? 576 : 24;
      if (typeof g.capacity != "number" || !Number.isInteger(g.capacity) || g.capacity < 1 || g.capacity > I)
        throw new Error(`Lane capacity must be a whole number from 1 to ${I}.`);
      k.capacity = g.capacity;
    }
    if (g.station !== void 0) {
      const I = ce(g.station), A = (P) => {
        if (typeof P != "number" || !Number.isInteger(P) || P < 0 || P >= fn)
          throw new Error("Use map coordinates from 0 to 2.");
        return P;
      };
      if (!Array.isArray(I.next) || I.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const w = I.next.map(le);
      me(w, "onward stop"), k.station = { column: A(I.column), row: A(I.row), next: w, outcome: oe(I.outcome, 160) }, I.image !== void 0 && (k.station.image = Kn(I.image));
    }
    return k;
  }), i = a.map((y) => y.id);
  if (me(i, "lane ID"), (o || a.some((y) => y.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (a.some((y) => y.station)) {
    if (!a.every((y) => y.station)) throw new Error("Give every station on the map a position.");
    me(a.map((y) => y.station.column + "," + y.station.row), "map position");
    for (const y of a)
      if (y.station.next.some((g) => g === y.id || !i.includes(g))) throw new Error("Connect each stop to another station on this map.");
  }
  const u = n.cards.map((y) => {
    const g = ce(y), k = { id: le(g.id), label: oe(g.label), laneId: le(g.laneId) };
    if (!i.includes(k.laneId)) throw new Error("Card refers to an unknown lane.");
    if (g.allowedLaneIds !== void 0) {
      if (!Array.isArray(g.allowedLaneIds) || g.allowedLaneIds.length > a.length) throw new Error("Invalid allowed lanes.");
      if (k.allowedLaneIds = g.allowedLaneIds.map(le), me(k.allowedLaneIds, "allowed lane"), !k.allowedLaneIds.includes(k.laneId) || !k.allowedLaneIds.every((I) => i.includes(I)))
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
        k.dependsOn = g.dependsOn.map(le), me(k.dependsOn, "dependency");
      }
    }
    return k;
  });
  me(u.map((y) => y.id), "card ID");
  const b = { version: 1, title: t, lanes: a, cards: u };
  if (n.experience !== void 0) {
    const y = ce(n.experience);
    if (y.version !== 1 || y.kind !== "customer-interviews" && y.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    b.experience = { version: 1, kind: y.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    b.signals = n.signals.map((y) => {
      const g = ce(y), k = le(g.cardId), I = le(g.laneId);
      if (!u.some((A) => A.id === k) || !i.includes(I))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: le(g.id),
        label: oe(g.label),
        cardId: k,
        laneId: I,
        whenPresent: oe(g.whenPresent, 160),
        whenAbsent: oe(g.whenAbsent, 160)
      };
    }), me(b.signals.map((y) => y.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    b.presentationOrder = kn({ lanes: a, presentationOrder: n.presentationOrder }).map((y) => y.id);
  }
  if (o)
    return b.kind = "release-plan", ct(b), b;
  for (const y of a)
    if (u.filter((g) => g.laneId === y.id).length > (y.capacity ?? 1 / 0))
      throw new Error(`Lane "${y.label}" exceeds its capacity.`);
  return b;
}
const Zn = 65536;
function ho(e) {
  const n = JSON.stringify(q(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Zn) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function po(e) {
  if (e.length > Zn) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return q(t);
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
function Ie(e, n, o) {
  const t = e.cards.find((i) => i.id === n);
  if (!t || !e.lanes.some((i) => i.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return Ke(e, t, o);
  const a = Gt(e, n, o);
  return a || (o === "prototype" && xe(e) === "customer-interviews" ? null : qe(e, t).some((i) => i.id === o) ? hn(e, n, o) : null);
}
function Wn(e, n) {
  return e.lanes.filter((o) => Ie(e, n, o.id) !== null);
}
function He(e, n, o) {
  if (Ie(e, n, o) !== null) return null;
  const t = e.cards.find((y) => y.id === n), a = e.lanes.find((y) => y.id === o);
  if (!t || !a) return "That move is not available.";
  const i = `This card can't go in ${a.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return i;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return i;
    const y = ge(e, o), g = { ...e, lanes: e.lanes.map((I) => I === a ? { id: a.id, label: a.label } : I) }, k = Ke(g, t, o);
    return k ? `Needs ${ge(k, o) - y} points. It already holds ${y} of ${a.capacity} points.` : i;
  }
  const u = e.lanes.find((y) => y.id === t.laneId);
  if (u?.station && !u.station.next.includes(o)) return `${a.label} can't be reached from ${u.label}.`;
  const b = e.cards.filter((y) => y.laneId === o).length;
  return a.capacity !== void 0 && b >= a.capacity ? `It already holds ${b} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : i;
}
function je(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !xe(e);
}
const zt = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Ft(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && zt.test(n) && !o.has(n) ? n : Ze(e, "card");
}
function ke(e, n, o) {
  const t = e.lanes.find((u) => u.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((u) => u.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (xe(e)) return "This workshop keeps the cards it came with.";
  const a = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!a) return "A card needs some words. Type on the note first.";
  if (a.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(a)) return "A card holds plain words only.";
  if (e.cards.length >= Vn) return "A workshop holds up to 24 cards.";
  const i = e.cards.filter((u) => u.laneId === n).length;
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
  if (ke(e, n, o) !== null) return null;
  const a = o.look === void 0 ? void 0 : Oe(o.look), i = o.asNote === void 0 ? void 0 : bn(o.asNote), u = {
    id: Ft(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: n,
    ...a ? { look: a } : {},
    ...i ? { asNote: i } : {}
  }, b = t === void 0 ? -1 : e.cards.findIndex((g) => g.id === t && g.laneId === n), y = b < 0 ? [...e.cards, u] : [...e.cards.slice(0, b), u, ...e.cards.slice(b)];
  return q({ ...e, cards: y });
}
function De(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!je(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((i) => e.lanes.find((u) => u.id === i).label), a = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${a}, so it stays a card.`;
  }
  return null;
}
function zn(e, n) {
  return De(e, n) !== null ? null : q({ ...e, cards: e.cards.filter((o) => o.id !== n) });
}
function de(e, n) {
  const o = e.lanes.find((i) => i.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const i = ge(e, n);
    return o.capacity ? i + " / " + o.capacity + " points" : i + " points";
  }
  const t = qt(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const a = e.cards.filter((i) => i.laneId === n).length;
  return o.capacity !== void 0 ? a + " of " + o.capacity : a + (a === 1 ? " card" : " cards");
}
const Ve = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Be = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Jn(e, n = Ve, o = 28) {
  const { pitch: t, row: a, top: i } = n, u = !!e.lanes[0].station, b = e.lanes.map((k) => e.cards.filter((I) => I.laneId === k.id).length), y = i + Math.max(1, ...b) * a + 36, g = e.lanes.map((k, I) => ({
    x: u ? k.station.column * (t + o) : I * t,
    y: u ? k.station.row * y : 0
  }));
  return {
    points: g,
    width: Math.max(...g.map((k) => k.x)) + t,
    height: Math.max(...g.map((k, I) => k.y + i + (u ? Math.max(1, b[I]) : b[I] + 1) * a))
  };
}
function mo() {
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
function Qn(e) {
  const n = q(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Ht(e, n) {
  const o = Qn(e), t = Ze(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), q(o);
}
function jt(e, n, o) {
  const t = Qn(e);
  return t.cards.push({
    id: Ze(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), q(t);
}
function wo() {
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
function Fn(e, n, o) {
  const t = q(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const a = t.lanes.find((k) => k.id === n);
  if (!a?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= Yn) throw new Error("A map can have up to five stations.");
  const i = oe(o?.label), u = oe(o?.outcome, 160), b = Ze(t, "station");
  let y, g = 1 / 0;
  for (let k = 0; k < fn; k++)
    for (let I = 0; I < fn; I++) {
      if (t.lanes.some((w) => w.station.column === I && w.station.row === k)) continue;
      const A = Math.abs(a.station.column - I) + Math.abs(a.station.row - k);
      A < g && (g = A, y = { column: I, row: k });
    }
  if (!y) throw new Error("There is no free station position.");
  return a.station.next.push(b), t.lanes.push({ id: b, label: i, station: { ...y, next: [], outcome: u, ...o.image === void 0 ? {} : { image: Kn(o.image) } } }), t.presentationOrder?.push(b), t;
}
const go = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Xn = (e) => "caption-" + e, Le = (e) => "column-" + e, ne = { lane: ve, card: fe, image: Ye, caption: Xn, column: Le };
function et(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function cn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), a = e, i = n;
  return t ? `M ${t} 0 H ${a - t} Q ${a} 0 ${a} ${t} V ${i - t} Q ${a} ${i} ${a - t} ${i} H ${t} Q 0 ${i} 0 ${i - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${a} V ${i} H 0 Z`;
}
function Hn(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function jn(e, n, o, t) {
  for (let a = n; a > 11; a--) {
    const i = Math.max(1, Math.floor(o / (a * 0.55)));
    if (e.split(`
`).reduce((b, y) => b + Math.max(1, Math.ceil(y.length / i)), 0) * a * 1.3 <= t) return a;
  }
  return Math.min(n, 11);
}
const nt = 152, pn = nt + 12, Dt = 12;
function Bt(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function ae(e, n = {}) {
  const o = q(e), { pitch: t, row: a, top: i } = Ve, u = o.lanes.map((A) => o.cards.filter((w) => w.laneId === A.id).length), b = (A) => Math.max(u[A], (Array.isArray(n.rows) ? n.rows[A] : n.rows) ?? 0), y = !!o.lanes[0].station, g = o.lanes.some((A) => A.station?.image), k = Bt(n.layout, o.lanes.length), I = [];
  if (y) {
    const { points: A } = Jn(o);
    o.lanes.forEach((w, P) => I.push({
      laneId: w.id,
      x: A[P].x,
      y: A[P].y + (g ? w.station.row * pn : 0),
      width: t,
      height: i + (w.station.image ? pn : 0) + Math.max(1, u[P]) * a,
      column: w.station.column,
      row: w.station.row
    }));
  } else {
    let A = 0;
    for (let w = 0; w < o.lanes.length; w += k) {
      const P = o.lanes.slice(w, w + k), N = i + (Math.max(...P.map((G, r) => b(w + r))) + 1) * a;
      P.forEach((G, r) => I.push({ laneId: G.id, x: r * t, y: A, width: t, height: N, column: r, row: w / k })), A += N + Dt;
    }
  }
  return { places: I, width: Math.max(...I.map((A) => A.x + A.width)), height: Math.max(...I.map((A) => A.y + A.height)) };
}
function Ut(e, n) {
  const { pitch: o, width: t, row: a, height: i, top: u } = Ve, b = n.origin ?? { x: 0, y: 0 }, y = !!e.lanes[0].station, { places: g } = ae(e, n), k = n.style ?? {}, I = k.textColor ?? Te.fontColor, A = k.borderColor ?? Te.borderColor, w = k.borderWidth ?? Te.borderWidth, P = k.cornerRadius ?? 0, N = k.fontSize ?? Te.fontSize, G = k.laneFontSize ?? N + 2, r = k.captionFontSize ?? Math.max(11, N - 1), p = [], v = ($) => {
    const O = { options: {
      shapeHint: "rectangle",
      vectorPath: cn($.width, $.height, P),
      foregroundColor: I,
      borderColor: A,
      borderWidth: w,
      ...k.fontFamily ? { fontFamily: k.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return p.push(O), O;
  };
  e.lanes.forEach(($, O) => {
    const _ = g[O], D = b.x + _.x, E = b.y + _.y, Y = $.station?.image;
    v({
      id: Le($.id),
      text: "",
      name: $.label,
      xPos: D + 2,
      yPos: E,
      width: o - 4,
      height: _.height,
      vectorPath: cn(o - 4, _.height, P ? P + 2 : 0),
      backgroundColor: y ? "#fcf9ed" : Hn(Be[O], 0.6),
      borderColor: y ? "#a8b5aa" : Hn(Be[O], 0.1),
      borderWidth: 1,
      ...y ? { borderStyle: "dashed" } : {}
    }), v({
      id: ve($.id),
      text: $.label,
      name: $.label,
      xPos: D + 8,
      yPos: E + 6,
      width: t,
      height: 58,
      backgroundColor: Be[O],
      fontSize: jn($.label, G, t - 16, 50)
    }), v({
      id: Xn($.id),
      text: de(e, $.id),
      name: $.label,
      xPos: D + 8,
      yPos: E + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: r
    }), Y && p.push({ options: {
      id: Ye($.id),
      name: Y.alt,
      text: "",
      xPos: D + 8,
      yPos: E + u,
      width: t,
      height: nt,
      shapeHint: "rectangle",
      image: Y.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((U) => U.laneId === $.id).forEach((U, Q) => {
      const re = e.kind === "release-plan" ? U.label + `
` + U.points + " points" : U.label, Ce = y ? t - 20 : t, Se = y ? i - 6 : i, X = y ? {} : { ...k.card, ...U.look }, Ae = y ? P : k.card?.cornerRadius ?? P;
      v({
        id: fe(U.id),
        text: re,
        name: U.label,
        xPos: D + (y ? 18 : 8),
        yPos: E + u + (Y ? pn : 0) + Q * a,
        width: Ce,
        height: Se,
        ...Ae !== P ? { vectorPath: cn(Ce, Se, Ae) } : {},
        backgroundColor: y ? "#ffda75" : X.backgroundColor ?? k.backgroundColor ?? Te.backgroundColor,
        ...X.textColor ? { foregroundColor: X.textColor } : {},
        ...X.fontFamily ? { fontFamily: X.fontFamily } : {},
        ...X.borderColor ? { borderColor: X.borderColor } : {},
        ...X.borderWidth !== void 0 ? { borderWidth: X.borderWidth } : {},
        fontSize: jn(re, X.fontSize ?? N, Ce - 16, Se - 8)
      });
    });
  });
  const C = new Map(p.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (C.get(Le($.id)).relationships.associations = $.station.next.map((O) => ({
      id: $.id + "-to-" + O,
      parentId: Le($.id),
      childId: Le(O),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const O of $.dependsOn ?? []) {
        const _ = fe(O), D = fe($.id);
        C.get(_).relationships.associations.push({
          id: `dependency-${O.length}-${O}-${$.id}`,
          parentId: _,
          childId: D,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const $ = new Set(n.beside), O = new Set(p.map((E) => E.options.id)), _ = /* @__PURE__ */ new Map();
    for (const E of [...O]) {
      if (!$.has(E)) continue;
      const Y = et(E, (U) => $.has(U) || O.has(U));
      O.add(Y), _.set(E, Y);
    }
    const D = (E) => _.get(E) ?? E;
    for (const E of p) {
      E.options.id = D(E.options.id);
      for (const Y of E.relationships.associations)
        Y.parentId = D(Y.parentId), Y.childId = D(Y.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: p };
}
function Dn(e, n) {
  const o = q(e);
  if (n?.native) return Ut(o, n);
  const { width: t, row: a, height: i, top: u } = Ve, b = [];
  function y(w, P, N, G, r, p) {
    b.push({ options: {
      id: w,
      text: P,
      name: P,
      xPos: N,
      yPos: G,
      width: t,
      height: r,
      shapeHint: "rectangle",
      backgroundColor: p,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: g } = Jn(o), k = 152, I = k + 12, A = o.lanes.some((w) => w.station?.image);
  o.lanes.forEach((w, P) => {
    const N = g[P].x, G = g[P].y + (A ? (w.station?.row ?? 0) * I : 0), r = w.station?.image, p = o.kind === "release-plan" ? w.label + `
` + (w.capacity ? ge(o, w.id) + " / " + w.capacity + " points" : ge(o, w.id) + " points") : w.label;
    y(ve(w.id), p, N, G, u - 12, Be[P]), r && b.push({ options: {
      id: Ye(w.id),
      name: r.alt,
      text: "",
      xPos: N,
      yPos: G + u,
      width: t,
      height: k,
      shapeHint: "rectangle",
      image: r.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((v) => v.laneId === w.id).forEach((v, C) => y(fe(v.id), o.kind === "release-plan" ? v.label + `
` + v.points + " points" : v.label, N, G + u + (r ? I : 0) + C * a, i, "#fffdf6"));
  });
  for (const w of o.lanes) {
    if (!w.station) continue;
    const P = b.find((N) => N.options.id === ve(w.id));
    P.relationships.associations = w.station.next.map((N) => ({ id: w.id + "-to-" + N, parentId: P.options.id, childId: ve(N), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), P.options.text = w.label + `
` + w.station.outcome, P.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const w = new Map(b.map((P) => [P.options.id, P]));
    for (const P of o.cards)
      for (const N of P.dependsOn ?? []) {
        const G = fe(N), r = fe(P.id);
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
const yo = {
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
function bo() {
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
function ko() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...vn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function xe(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...vn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => mn.some((a) => a.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Gt(e, n, o) {
  const t = xe(e), a = e.cards.find((u) => u.id === n);
  if (!t || !a || a.laneId === o) return null;
  let i = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const u = e.cards.find((b) => b.laneId === o);
    if (u) {
      if (!qe(e, u).some((b) => b.id === "interviews")) return null;
      i = hn(e, u.id, "interviews");
    }
  }
  return qe(i, a).some((u) => u.id === o) ? hn(i, n, o) : null;
}
function qt(e, n) {
  if (xe(e) !== "experiment-budget") return null;
  const o = vn.find((i) => i.id === n), t = e.cards.filter((i) => i.laneId === n).length, a = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? a + " " + (a === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  Te as DEFAULT_NOTE_STYLE,
  Fe as WorkshopReferenceError,
  Fn as addWorkshopBranch,
  jt as addWorkshopCard,
  Ht as addWorkshopLane,
  It as applyWorkshopEdits,
  uo as attachWorkshop,
  qe as availableLanes,
  ut as canHangPanel,
  vn as channels,
  Ct as checkWorkshopReplacement,
  ht as countWord,
  ko as createBudgetWorkshop,
  bo as createInterviewWorkshop,
  mo as createLaneWorkshop,
  wo as createWorkshopMap,
  po as decodeWorkshopFragment,
  io as describeFocusDarkroom,
  co as describeWorkshopEdits,
  ho as encodeWorkshopFragment,
  Qt as handoffSummary,
  ro as hangGalleryPanel,
  yo as industrialWorkshop,
  so as initialFocusDarkroom,
  mn as interviews,
  Be as laneColors,
  we as listed,
  _e as listeningRoom,
  eo as listeningRoomCaption,
  Vn as maxWorkshopCards,
  to as moonGallery,
  hn as moveWorkshopCard,
  lo as named,
  go as nightTransfer,
  ao as normalizeFocusDarkroom,
  Xt as normalizeListeningRoom,
  oo as normalizeMoonGallery,
  Vt as normalizeOfflineHandoff,
  Yt as offlineHandoff,
  Gt as planStartupMove,
  pt as pointing,
  Bn as printFields,
  ge as releaseLoad,
  no as releasePlan,
  Jt as resolveHandoff,
  Wt as resolveWorkshopSignals,
  Zt as reviewHandoff,
  T as said,
  xe as startupExperienceKind,
  wn as unquoted,
  q as validateWorkshop,
  Ue as workshopBoardKind,
  qt as workshopBudgetResult,
  Ie as workshopCandidate,
  zn as workshopCardAsNote,
  De as workshopCardAsNoteRefusal,
  _t as workshopCardLookOf,
  Wn as workshopDestinations,
  yn as workshopEditKinds,
  un as workshopFinder,
  de as workshopLaneCaption,
  ae as workshopLanePlaces,
  Ve as workshopLayout,
  ne as workshopNodeIds,
  Pe as workshopNoteCandidate,
  ke as workshopNoteRefusal,
  Jn as workshopPositions,
  kn as workshopPresentationLanes,
  fo as workshopPresentationScenes,
  bt as workshopReferences,
  He as workshopRefusal,
  et as workshopStandInId,
  je as workshopTakesNotes,
  Dn as workshopToSlate
};
