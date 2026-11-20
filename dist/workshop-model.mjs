import { D as Te } from "./NoteDefaults-1xFW0br8.mjs";
const Zt = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Jt(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: a, fieldNote: i, deskNote: u, fallback: b } = e, y = (g) => typeof g == "string" && g.trim().length > 0 && g.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(g);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? a !== "field" && a !== "desk" : a !== null) || a === void 0 || !y(i) || !y(u) || !y(b) ? null : { kind: n, version: o, stage: t, choice: a, fieldNote: i.trim(), deskNote: u.trim(), fallback: b.trim() };
}
function Qt(e) {
  return { ...e, stage: "review", choice: null };
}
function Xt(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function eo(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const _e = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function no(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: a, rightLabel: i } = e, u = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !u(a) || !u(i) ? null : { kind: n, version: o, mix: t, leftLabel: a.trim(), rightLabel: i.trim() };
}
function to({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === _e.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === _e.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === _e.leftLabel && o === _e.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function ye(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function ut(e) {
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
    if (ye(e, u.id) > (u.capacity ?? 1 / 0)) throw new Error(`Release "${u.label}" exceeds its point budget.`);
  }
}
function Ke(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((x, A) => [x.id, A])), a = t.get(o);
  if (a === void 0) return null;
  const i = a < t.get(n.laneId), u = /* @__PURE__ */ new Set([n.id]), b = [n];
  for (; b.length; ) {
    const x = b.pop();
    for (const A of e.cards) {
      if (u.has(A.id)) continue;
      const w = t.get(A.laneId);
      (i ? w > a && x.dependsOn?.includes(A.id) : w < a && A.dependsOn?.includes(x.id)) && (u.add(A.id), b.push(A));
    }
  }
  if (e.cards.filter((x) => u.has(x.id)).some((x) => x.allowedLaneIds && !x.allowedLaneIds.includes(o))) return null;
  const g = { ...e, cards: e.cards.map((x) => u.has(x.id) ? { ...x, laneId: o } : x) }, k = e.lanes[a].capacity;
  return k !== void 0 && ye(g, o) > k ? null : g;
}
const oo = {
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
}, ro = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ao(e) {
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
function ft(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function so(e, n) {
  return ft(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Un = ["firstPrint", "secondPrint", "thirdPrint"], Gn = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function io(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...Gn, route: n.route };
  for (const t of Un) {
    const a = n[t];
    if (typeof a != "string" || !a.trim() || a.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = a.trim();
  }
  return o;
}
function lo(e = new URLSearchParams()) {
  const n = { ...Gn };
  for (const t of Un) {
    const a = e.get(t)?.trim();
    a && a.length <= 48 && (n[t] = a);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function co(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
const T = (e) => "“" + e.replace(/[“”]/g, '"') + "”", ge = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], On = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), wn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), gn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), uo = (e) => wn(gn(e)), ht = [
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
], pt = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : ht.indexOf(e.toLowerCase()), mt = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function qn(e, n) {
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
const on = "[^\\p{L}\\p{N}]", En = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + On(n) + "(?:$|" + on + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + on + ")" + On(n) + "(?:$|" + on + ")", "u").test(e)
], Nn = ["first", "second", "third", "fourth", "fifth"];
function wt(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Nn.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(wn(gn(n)));
  if (!t) return null;
  const a = (t[1] ?? t[2]).toLowerCase(), i = a === "last" ? e.length - 1 : t[1] ? Nn.indexOf(a) : pt(a) - 1;
  return e[i] ?? null;
}
function rn(e, n, o, t, a) {
  const i = qn(n, o);
  if (i.some((b) => mt.test(b))) {
    const b = t && e.find((y) => y.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of i) {
    if (!b.startsWith("@")) continue;
    const y = e.find((g) => g.id === b.slice(1));
    if (y) return { item: y, rank: 0 };
  }
  for (const [b, y] of En.entries())
    for (const g of i) {
      const k = e.filter((x) => y(x.label.toLowerCase(), g.toLowerCase()));
      if (k.length === 1) return { item: k[0], rank: b };
      if (k.length > 1) return { several: k };
    }
  const u = a ? wt(e, n, o) : null;
  return u ? { item: u, rank: En.length } : {};
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
    const k = qn(y, n), x = k[k.length - 1];
    if (g.pointing) throw new Fe("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (g.several) {
      const w = [...new Set(g.several.map((P) => P.label))];
      throw new Fe(w.length === 1 ? g.several.length + " " + o + "s are called " + T(w[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + T(x) + ": " + ge(w.slice(0, 6).map(T)) + ". Use the whole name.", "ambiguous", g.several.map((P) => P.id));
    }
    const A = e.map((w) => w.label);
    throw new Fe("There is no " + o + " called " + T(x) + " here." + (A.length && A.length <= 6 ? " The " + o + "s are " + ge(A.map(T)) + "." : A.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((w) => w.id));
  }, attempt: (y) => rn(e, y, n, t, a).item ?? null, rank: (y) => rn(e, y, n, t, a).rank ?? 1 / 0 };
}
const fe = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map"], an = ["lanes", "release-plan", "customer-interviews", "experiment-budget"];
function Ue(e) {
  return e.lanes[0]?.station ? "map" : e.kind === "release-plan" ? "release-plan" : Ce(e) ?? "lanes";
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
  mapOutcome: "A map says what happens when a token reaches a step. Change what that step says instead."
}, X = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), K = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ie = (e) => ({ type: "ref", of: "card", about: e }), sn = (e) => ({ map: e }), le = { lanes: H.notMap, "release-plan": H.notMap, "customer-interviews": H.notMap, "experiment-budget": H.notMap }, yn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: X(120, "The new name, 1 to 120 characters of plain text.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: K("The lane or step."), label: X(80, "The new name, 1 to 80 characters of plain text.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ie("The card or token."), label: X(80, "The new name, 1 to 80 characters of plain text.") },
    boards: fe,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: X(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": H.releaseLanes, "customer-interviews": H.keepsLanes, "experiment-budget": H.keepsLanes, map: H.mapAddLane }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: K("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": H.releaseLanes, "customer-interviews": H.keepsLanes, "experiment-budget": H.keepsLanes }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: K("The lane or step it starts in."),
      label: X(80, "What the card says. On a map it may be left out: the token is numbered.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." }
    },
    boards: ["lanes", "experiment-budget", "map"],
    refusals: { "release-plan": H.releaseCards, "customer-interviews": H.keepsCards }
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
    fields: { card: ie("The card or token."), lane: K("Where it goes.") },
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
    fields: { lane: K("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: fe,
    refusals: {}
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ie("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: an,
    refusals: sn(H.mapCardLanes)
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ie("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { lanes: H.notPoints, "customer-interviews": H.notPoints, "experiment-budget": H.notPoints, map: H.mapPoints }
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
    refusals: { lanes: H.notDepends, "customer-interviews": H.notDepends, "experiment-budget": H.notDepends, map: H.notDepends }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ie("The card."),
      lane: K("The lane."),
      whenPresent: X(160, "What it says when the card is there."),
      whenAbsent: X(160, "What it says otherwise."),
      label: X(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: an,
    refusals: sn(H.mapOutcome)
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ie("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: an,
    refusals: sn(H.mapOutcome)
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
    fields: { lane: K("The lane or step."), before: K("Present it just before this one.", !0), after: K("Present it just after this one.", !0) },
    boards: fe,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: K("The step it follows."), label: X(80, "The new step’s name."), outcome: X(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: K("The step it goes in front of."),
      from: K("Only the path from this step is taken over.", !0),
      label: X(80, "The new step’s name."),
      outcome: X(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: K("Where the path starts."), to: K("Where it leads.") },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: K("Where the path starts."), to: K("Where it leads.") },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: K("The step."), outcome: X(160, "What it says.") },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: K("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: K("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: le
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: K("The step."), alt: X(240, "What the picture shows.") },
    boards: ["map"],
    refusals: le
  }
], gt = new Map(yn.map((e) => [e.kind, e])), yt = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function bt(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: yt(e.max, n) }, e.nullable), description: e.about };
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
const Kn = (e) => "optional" in e && e.optional === !0;
function fo(e) {
  const n = e ? Ue(q(e)) : void 0;
  return yn.map((o) => {
    const t = Object.entries(o.fields), a = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, u]) => !Kn(u)).map(([u]) => u)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([u, b]) => [u, bt(b, n)])) }
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
function kt(e, n) {
  const o = !!e.lanes[0]?.station, t = un(e.lanes, o ? We.step : We.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), a = un(e.cards, o ? We.token : We.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: a };
  const i = (u) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(u.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (u) => i(u) ?? a.find(u),
    attempt: (u) => i(u) ?? a.attempt(u),
    rank: (u) => i(u) ? 0 : a.rank(u)
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
    return q(e);
  } catch (a) {
    throw new R(Ge(a instanceof Error ? a.message : String(a), n), "refused", o, t);
  }
}
function vt(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, a] of Object.entries(n.fields)) {
    const i = e[t];
    if (i === void 0) {
      if (Kn(a)) continue;
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
function It(e, n, o, t) {
  const a = structuredClone(e), i = o === "map", u = o === "release-plan", b = kt(a, t), y = { lane: i ? "step" : "lane", card: i ? "token" : "card" };
  function g(r, m, v, S, $ = null) {
    if (typeof v == "object") {
      const M = r.find((U) => U.id === v.id);
      if (!M) throw new R("That " + S + " is no longer on the workshop.", "gone", $);
      return M;
    }
    const O = r.find((M) => M.id === v);
    if (O) return O;
    try {
      return m.find(v);
    } catch (M) {
      if (!(M instanceof Fe)) throw M;
      const U = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new R(M.message, U, $, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const k = (r, m = null) => g(a.lanes, b.lanes, r, "lane", m), x = (r, m = null) => g(a.cards, b.cards, r, "card", m), A = (r) => {
    try {
      return k(r);
    } catch {
      return null;
    }
  }, w = (r, m, v = {}, S = !0) => ({ board: r, said: m, changed: S, ...v }), P = (r) => a.cards.filter((m) => m.laneId === r).length, N = (r) => i ? "The presentation opens with " + T(r[0].label) + "." : "The presentation now runs " + r.map((m) => T(m.label)).join(", then ") + ".";
  switch (n.kind) {
    case "rename_workshop": {
      a.title = n.title;
      const r = B(a, o);
      return w(r, "Renamed the " + (i ? "map" : "workshop") + " to " + T(r.title) + ".");
    }
    case "rename_lane": {
      const r = k(n.lane), m = r.label;
      r.label = n.label;
      const v = B(a, o, r.id);
      return w(v, "Renamed " + T(m) + " to " + T(v.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = x(n.card), m = r.label;
      r.label = n.label;
      const v = B(a, o, r.laneId, r.id);
      return w(v, "Renamed " + T(m) + " to " + T(v.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new R("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new R("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Dt(a, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (v) {
        throw new R(Ge(v.message, o), "refused");
      }
      const m = r.lanes[r.lanes.length - 1];
      return w(r, "Added the lane " + T(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const r = k(n.lane), m = a.cards.filter((v) => v.laneId === r.id);
      if (i) {
        if (m.length) throw new R(T(m[0].label) + " is at " + T(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new R("A map needs at least two steps.", "refused", r.id);
      } else {
        if (m.length) throw new R(T(r.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new R("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((v) => v !== r);
      for (const v of a.lanes) v.station && (v.station.next = v.station.next.filter((S) => S !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((v) => v !== r.id));
      for (const v of a.cards) v.allowedLaneIds && (v.allowedLaneIds = v.allowedLaneIds.filter((S) => S !== r.id));
      return ze(a, (v) => v.laneId === r.id), w(B(a, o), "Removed the " + y.lane + " " + T(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = k(n.lane);
      if (i) {
        if (n.allowedLanes !== void 0) throw new R(H.mapCardLanes, "not_on_this_board", r.id);
        let $ = n.label;
        if ($ === void 0) {
          let _ = a.cards.length + 1;
          for (; a.cards.some((F) => F.label === "Token " + _); ) _++;
          $ = "Token " + _;
        }
        const O = new Set([...a.lanes, ...a.cards].map((_) => _.id));
        let M = 1;
        for (; O.has("token-" + M); ) M++;
        a.cards.push({ id: "token-" + M, label: $, laneId: r.id });
        const U = B(a, o, r.id);
        return w(U, "Added " + T(U.cards[U.cards.length - 1].label) + " at " + T(r.label) + ".", { laneId: r.id, cardId: "token-" + M });
      }
      if (n.label === void 0 || !n.label.trim()) throw new R("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new R("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && P(r.id) >= r.capacity)
        throw new R(T(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => k($).id))];
      let v;
      try {
        v = Bt(a, r.id, { label: n.label, ...m && { allowedLaneIds: m } });
      } catch ($) {
        throw new R(Ge($.message, o), "refused", r.id);
      }
      const S = v.cards[v.cards.length - 1];
      return w(v, "Added " + T(S.label) + " to " + T(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = x(n.card);
      if (i && a.cards.length === 1) throw new R("A map needs at least one token.", "refused", r.laneId, r.id);
      if (u && a.cards.length === 1) throw new R("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((m) => m !== r);
      for (const m of a.cards)
        m.dependsOn?.includes(r.id) && (m.dependsOn = m.dependsOn.filter((v) => v !== r.id), m.dependsOn.length || delete m.dependsOn);
      return ze(a, (m) => m.cardId === r.id), w(B(a, o, r.laneId), "Removed the " + y.card + " " + T(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? a.lanes.find((S) => S.id === n.lane.id) ?? null : A(n.lane), m = x(n.card, r?.id ?? null), v = k(n.lane, m.laneId);
      return G(m, v);
    }
    case "advance_card": {
      const r = x(n.card), m = a.lanes.find((S) => S.id === r.laneId), v = m.station.next.map((S) => a.lanes.find(($) => $.id === S)).filter((S) => !!S);
      if (!v.length) throw new R(T(r.label) + " is at " + T(m.label) + ", and no path leads on from there.", "refused", m.id, r.id);
      if (v.length > 1)
        throw new R("From " + T(m.label) + " the path goes to " + v.map((S) => T(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + v[0].label + "”.", "refused", m.id, r.id);
      return G(r, v[0]);
    }
    case "set_lane_capacity": {
      const r = k(n.lane), m = i ? "token" : u ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, w(B(a, o, r.id), i ? "Removed the limit at " + T(r.label) + "." : T(r.label) + " now holds any number of " + m + "s.", { laneId: r.id });
      const v = u ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > v)
        throw new R((i ? "A step" : "A lane") + " can hold from 1 to " + v + " " + m + "s.", "refused", r.id);
      const S = u ? a.cards.reduce(($, O) => $ + (O.laneId === r.id ? O.points ?? 1 : 0), 0) : P(r.id);
      if (S > n.capacity)
        throw new R(T(r.label) + " already holds " + S + " " + m + (S === 1 ? "" : "s") + ". Move some " + (i ? "on" : "out") + " first, or choose a higher " + (u ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, w(B(a, o, r.id), T(r.label) + " now holds up to " + n.capacity + " " + m + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = x(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, w(B(a, o, r.laneId, r.id), T(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const m = [...new Set(n.lanes.map((S) => k(S)))], v = a.lanes.find((S) => S.id === r.laneId);
      if (!m.includes(v)) throw new R(T(r.label) + " is in " + T(v.label) + " now. Include " + T(v.label) + ", or move the card first.", "refused", v.id, r.id);
      return r.allowedLaneIds = m.map((S) => S.id), w(B(a, o, r.laneId, r.id), T(r.label) + " can now go only in " + ge(m.map((S) => T(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = x(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new R("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, w(B(a, o, r.laneId, r.id), T(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = x(n.card), m = [...new Set(n.dependsOn.map((S) => x(S)))], v = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = m.filter(($) => r.dependsOn?.includes($.id));
        if (!S.length) throw new R(T(r.label) + " does not depend on " + ge(m.map(($) => T($.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter(($) => !S.some((O) => O.id === $)), r.dependsOn.length || delete r.dependsOn, w(B(a, o, r.laneId, r.id), T(r.label) + " no longer depends on " + ge(S.map(($) => T($.label))) + ".", v);
      }
      if (!m.length) {
        if (n.mode === "add") throw new R("Name the features " + T(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, w(B(a, o, r.laneId, r.id), T(r.label) + " no longer depends on anything.", v);
      }
      if (m.includes(r)) throw new R("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...m.map((S) => S.id)])], w(B(a, o, r.laneId, r.id), T(r.label) + " now depends on " + ge(m.map((S) => T(S.label))) + ".", v);
    }
    case "set_outcome": {
      const r = x(n.card), m = k(n.lane), v = a.signals ?? (a.signals = []), S = n.label, $ = S === void 0 ? v.filter((_) => _.cardId === r.id && _.laneId === m.id) : v.filter((_) => _.cardId === r.id && _.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && $.length > 1) throw new R("Two outcomes on this card have that name.", "refused", m.id, r.id);
      if (!$.length && v.length >= 24) throw new R("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, r.id);
      let O = 1;
      for (; v.some((_) => _.id === "signal-" + O); ) O++;
      const U = { label: S ?? $[0]?.label ?? (r.label + " in " + m.label).slice(0, 80).trim(), cardId: r.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], U) : v.push({ id: "signal-" + O, ...U }), w(B(a, o, m.id, r.id), "When " + T(r.label) + " is in " + T(m.label) + " the workshop says " + T(n.whenPresent) + ". Otherwise it says " + T(n.whenAbsent) + ".", { laneId: m.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = x(n.card), m = (a.signals ?? []).filter((v) => v.cardId === r.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new R(T(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        ze(a, (v) => v.cardId === r.id);
      } else {
        const v = g(m, un(m, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        ze(a, (S) => S.id === v.id);
      }
      return w(B(a, o, r.laneId, r.id), "Removed the outcome from " + T(r.label) + ".", { laneId: r.laneId, cardId: r.id });
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
      const S = kn(a).filter(($) => $.id !== r.id);
      return S.splice(v ? S.findIndex(($) => $.id === v.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = S.map(($) => $.id), w(B(a, o, r.id), N(S), { laneId: r.id });
    }
    case "add_station": {
      const r = k(n.from);
      let m;
      try {
        m = Hn(a, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new R(S.message, "refused", r.id);
      }
      const v = m.lanes[m.lanes.length - 1];
      return w(m, "Added a path from " + T(r.label) + " to " + T(v.label) + ".", { laneId: v.id });
    }
    case "insert_station": {
      const r = k(n.before), m = n.from === void 0 ? void 0 : k(n.from), v = m ? [m] : a.lanes.filter((O) => O.station.next.includes(r.id));
      if (m && !m.station.next.includes(r.id))
        throw new R("There is no path from " + T(m.label) + " to " + T(r.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!v.length) throw new R("Nothing leads to " + T(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = Hn(a, v[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (O) {
        throw new R(O.message, "refused", r.id);
      }
      const $ = S.lanes[S.lanes.length - 1];
      for (const O of S.lanes)
        v.some((M) => M.id === O.id) && (O.station.next = [...new Set(O.station.next.map((M) => M === r.id ? $.id : M))]);
      return $.station.next = [r.id], w(B(S, o, $.id), "Added " + T($.label) + " before " + T(r.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const r = k(n.from), m = k(n.to);
      if (r.id === m.id) throw new R("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(m.id) ? w(a, T(r.label) + " already leads to " + T(m.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(m.id), w(B(a, o, r.id), "Connected " + T(r.label) + " to " + T(m.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = k(n.from), m = k(n.to);
      if (!r.station.next.includes(m.id)) throw new R("There is no path between " + T(r.label) + " and " + T(m.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((v) => v !== m.id), w(B(a, o, r.id), "Removed the path from " + T(r.label) + " to " + T(m.label) + ".", { laneId: r.id });
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
      if (!r.station.image) throw new R("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, w(B(a, o, r.id), "Updated the image description at " + T(r.label) + ".", { laneId: r.id });
    }
  }
  function G(r, m) {
    const v = { laneId: m.id, cardId: r.id };
    if (r.laneId === m.id)
      return w(e, T(r.label) + " is already " + (i ? "at " : "in ") + T(m.label) + ".", v, !1);
    const S = xe(e, r.id, m.id);
    if (!S) throw new R(He(e, r.id, m.id) ?? "That move is not available.", "refused", m.id, r.id);
    return w(B(S, o, m.id, r.id), "Moved " + T(r.label) + " to " + T(m.label) + ".", v);
  }
}
function ze(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function xt(e, n, o = {}) {
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
    const x = k?.kind, A = typeof x == "string" ? gt.get(x) : void 0;
    if (!k || typeof k != "object" || !A)
      return t({
        index: g,
        kind: typeof x == "string" ? x : null,
        code: "invalid_edit",
        reason: "There is no edit called " + T(String(x)) + ". The edits are " + ge(yn.map((r) => r.kind)) + "."
      });
    const w = vt(k, A);
    if (w) return t({ index: g, kind: A.kind, code: "invalid_edit", reason: w });
    const P = Ue(a);
    if (!A.boards.includes(P))
      return t({ index: g, kind: A.kind, code: "not_on_this_board", reason: A.refusals[P] ?? "This workshop does not take " + A.kind + "." });
    let N;
    try {
      N = It(a, k, P, o.selection);
    } catch (r) {
      if (!(r instanceof R)) throw r;
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
    const G = St(a, N.board);
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
const Ct = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map"
};
function St(e, n) {
  const o = q(e), t = Ue(o);
  let a;
  try {
    a = q(n);
  } catch (y) {
    return Ge(y instanceof Error ? y.message : String(y), t);
  }
  const i = Ue(a), u = (y, g) => y.lanes.length === g.lanes.length && y.lanes.every((k) => g.lanes.some((x) => x.id === k.id)), b = (y, g) => y.lanes.every((k, x) => g.lanes[x]?.id === k.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && i !== t)
    return u(o, a) ? H.keepsCards : H.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, a)) return H.keepsOrder;
  if (t === "release-plan" && i === "release-plan") {
    if (!u(o, a)) return H.releaseLanes;
    if (!b(o, a)) return H.releaseOrder;
    if (a.cards.some((y) => !o.cards.some((g) => g.id === y.id))) return H.releaseCards;
  }
  return t !== i ? "This slate holds a " + Ct[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
function At(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Lt(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), Tt(n), n;
}
function $t(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function Tt(e) {
  return e && $t(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Rn(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Pt(e) {
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
function Lt(e) {
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
const Mn = "#1f7a5c", _n = "#5b9a85", dn = "#c2410c", Ot = "#2f5fd0", Et = { canMove: !1, canSelect: !1 };
function Nt(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ho(e, n, o = {}) {
  let t = q(n), a = null, i = !!o.readOnly, u = !1;
  const b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map();
  let A = null, w = null, P = null;
  const N = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map();
  let r = null, m = Promise.resolve(), v = null, S = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const $ = { ...o.style };
  let O = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), U = null, _ = !1;
  se(t, { layout: S });
  const F = o.origin ? { x: o.origin.x, y: o.origin.y } : Mt(e), J = (s) => x.get(s) ?? s, Q = (s) => Nt(J(s));
  function Z(s) {
    const d = k.get(s);
    if (d) return d;
    if (b.has(s) && !x.has(s) || !e.nodes.one?.(s)) return s;
    const c = nt(s, (p) => !!e.nodes.one?.(p) || x.has(p));
    return k.set(s, c), x.set(c, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${c}".`), c;
  }
  const oe = {
    governs(s) {
      if (b.get(s.id) !== s) return null;
      const d = Q(s.id)?.kind;
      return d === "card" ? { canMove: !i, canEditText: !i && !a && t.kind !== "release-plan" } : d === "lane" ? { canMove: !1, canEditText: !i && !a } : Et;
    },
    onStart(s, d) {
      const c = Q(s.id).key;
      if (i || a || !t.cards.some((l) => l.id === c)) return !1;
      V(), be();
      const p = { x: d.x - (s.options.x ?? 0), y: d.y - (s.options.y ?? 0) };
      let C = null;
      try {
        C = o.chooseCandidate?.(t, c, p) ?? null;
      } catch (l) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", l);
      }
      return A = { cardId: c, evaluate: C, outcome: { kind: "home" } }, j(t, { skip: c }), !0;
    },
    onMove(s, d) {
      if (!A) return;
      const c = In(A.cardId, d, A.evaluate);
      if (Rt(c, A.outcome)) return;
      A.outcome = c;
      const p = c.kind === "candidate" ? c.next : null;
      j(p ?? t, { skip: A.cardId }), D(o.onPreview, p);
    },
    onEnd(s, d) {
      if (!A) return { accept: !1 };
      const { cardId: c, evaluate: p } = A, C = In(c, d, p), l = t.cards.find((f) => f.id === c);
      if (A = null, D(o.onPreview, null), C.kind === "candidate") {
        t = C.next, j(t, { skip: c });
        const f = t.lanes.find((I) => I.id === C.laneId);
        e.announce?.(`${l.label} moved to ${f.label}. ${ce(t, f.id)}.`), D(o.onChange, t, { cardId: c, laneId: C.laneId });
        const h = ct(t, J(s.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (C.kind === "refused")
        lt(l.label, { cardId: c, laneId: C.laneId, reason: C.reason });
      else if (C.kind === "outside" && je(t) && !Qe()) {
        const f = De(t, c);
        if (!f)
          return tn(c, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        j(t, { skip: c }), e.announce?.(f), D(o.onRefuse, { cardId: c, laneId: null, reason: f });
      } else
        j(t, { skip: c }), C.kind === "outside" && (e.announce?.(`${l.label} was not dropped on a lane. It stays where it was.`), D(o.onRefuse, { cardId: c, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      const d = A && t.cards.find((c) => c.id === A.cardId);
      A = null, D(o.onPreview, null), j(t, { skip: Q(s.id)?.key }), d && e.announce?.(`Move cancelled. ${d.label} stays where it was.`);
    },
    onTextCommit(s, d, c) {
      const p = Q(s.id);
      if (!p || i || a) return !1;
      const C = d.replace(/\s+/g, " ").trim(), l = p.kind === "lane" ? { laneId: p.key, label: C } : { cardId: p.key, label: C }, f = xt(t, [p.kind === "lane" ? { kind: "rename_lane", lane: { id: p.key }, label: C } : { kind: "rename_card", card: { id: p.key }, label: C }]);
      if ("refused" in f) {
        const { reason: h } = f.refused;
        return e.announce?.(`${c} keeps its name. ${h}`), D(o.onRefuse, { ...p.kind === "lane" ? { laneId: p.key } : { cardId: p.key }, rename: l, reason: h }), !1;
      }
      return C === c ? !1 : (t = f.workshop, j(t), e.announce?.(`${c} renamed to ${C}.`), D(o.onChange, t, { rename: l }), C);
    },
    onKeyDown(s, d) {
      const c = Q(s.id);
      if (c?.kind !== "card" || i || a || A || d.ctrlKey || d.metaKey || d.altKey) return !1;
      const p = t.cards.find((C) => C.id === c.key);
      if (!p) return !1;
      if (d.key === "ArrowLeft" || d.key === "ArrowRight")
        return d.preventDefault(), xn(p.id, d.key === "ArrowLeft" ? -1 : 1), !0;
      if ((d.key === "ArrowUp" || d.key === "ArrowDown") && ot())
        return d.preventDefault(), xn(p.id, d.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (w?.cardId !== p.id) return !1;
      if (d.key === "Enter") {
        d.preventDefault();
        const { laneId: C, next: l, spot: f } = w;
        if (w = null, C === null)
          return D(o.onPreview, null), tn(p.id, f), !0;
        t = l, j(t), pe(C), D(o.onPreview, null);
        const h = t.lanes.find((I) => I.id === C);
        return e.announce?.(`${p.label} moved to ${h.label}. ${ce(t, C)}.`), D(o.onChange, t, { cardId: p.id, laneId: C }), !0;
      }
      return d.key === "Escape" ? (d.preventDefault(), be(), e.announce?.(`Move cancelled. ${p.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((d) => b.get(d.id) === d).map((d) => d.id);
      _ = s.length === 1, b.clear(), y.clear(), g.clear(), k.clear(), x.clear(), A = null, w = null, j(a ?? t, { animate: !1 }), s.length === 1 && (m = m.then(() => {
        _ = !1;
        const d = b.get(s[0]);
        if (!u && d && !(e.getSelectedNodes?.() ?? []).length) {
          const c = () => e.selectNodes?.([d]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
        }
        Je();
      }));
    }
  };
  oe.onFreeMove = (s, d) => {
    if (!Ee() || s.options?.isComment) return Xe();
    const c = Ne(d), p = Re(s), C = t.lanes.filter((f) => !$e(s) && ve(t, f.id, p) === null).map((f) => f.id), l = c ? $e(s) ?? ve(t, c, p) : null;
    P && P.noteId === s.id && P.laneId === c && P.refusal === l || (P = { noteId: s.id, laneId: c, refusal: l, open: C }, me());
  }, oe.onFreeDrop = (s, d, c) => {
    if (Xe(), !Ee() || s.options?.isComment) return;
    const p = Ne(d);
    if (!p) return;
    const C = Re(s), l = t.lanes.find((h) => h.id === p), f = $e(s) ?? ve(t, p, C);
    return f ? (V(!1), r = { laneId: p, reason: f, timer: setTimeout(() => V(), 1500) }, me(), e.announce?.(`${en(C.label)} can't go in ${l.label}. ${f}`), D(o.onRefuse, { noteId: s.id, laneId: p, reason: f }), "refused") : (nn([{ node: s, offer: C, from: c }], p), "taken");
  }, oe.onFreeGroupDrop = (s, d, c) => {
    if (Xe(), !Ee() || s.some((h) => h.options?.isComment)) return;
    const p = Ne(d);
    if (!p) return;
    const C = t.lanes.find((h) => h.id === p), l = s.map((h) => ({ node: h, offer: Re(h) })), f = at(l, p);
    if (f) {
      V(!1), r = { laneId: p, reason: f, timer: setTimeout(() => V(), 1500) }, me(), e.announce?.(`${Cn(l.map((h) => en(h.offer.label)))} can't go in ${C.label}. ${f}`);
      for (const { node: h } of l) D(o.onRefuse, { noteId: h.id, laneId: p, reason: f });
      return "refused";
    }
    return nn(l.map((h, I) => ({ ...h, from: c?.[I] })), p), "taken";
  }, oe.onFreeTextCommit = (s) => {
    if (!Ee() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const d = s.options ?? {}, c = Ne({ x: (d.x ?? 0) + (d.width ?? 0) / 2, y: (d.y ?? 0) + (d.height ?? 0) / 2 });
    if (!c) return;
    const p = Re(s), C = t.lanes.find((E) => E.id === c), l = $e(s) ?? ve(t, c, p);
    if (!l) {
      nn([{ node: s, offer: p }], c);
      return;
    }
    V(!1), r = { laneId: c, reason: l, timer: setTimeout(() => V(), 1500) }, me(), e.announce?.(`${en(p.label)} can't go in ${C.label}. ${l} It is beside the board.`), D(o.onRefuse, { noteId: s.id, laneId: c, reason: l });
    const { width: f } = se(t, { layout: S }), h = Math.round(F.x + f + 32), I = Math.round(d.y ?? F.y);
    s.position(h, I, () => e.updateSelectionResizeRotate?.(), void 0, ln() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Rn({ ...s.options, x: h, y: I })] });
  }, oe.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...N] }), oe.onUndoRestore = (s, d) => {
    if (u) return;
    const c = new Map((s?.cards ?? []).map((l) => [l.id, l])), p = new Map(s?.pairs ?? []), C = (l) => N.get(l) ?? p.get(l) ?? l;
    for (const l of d.added) {
      const f = C(l), h = t.cards.find((I) => I.id === f);
      h && (t = q({ ...t, cards: t.cards.filter((I) => I !== h) }), j(t), Wn(D(o.onChange, t, { cardId: f, cardToNote: { noteId: l } })));
    }
    for (const l of d.removed) {
      const f = C(l), h = c.get(f);
      if (!h || t.cards.some((W) => W.id === f)) continue;
      const I = { id: f, label: h.label, ...h.look ? { look: h.look } : {}, ...h.asNote ? { asNote: h.asNote } : {} }, E = [h.laneId, ...t.lanes.map((W) => W.id)].find((W) => Pe(t, W, I));
      if (!E) {
        e.announce?.(`${h.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = st(Pe(t, E, I), f, s?.cards ?? []), f !== l && N.set(l, f), j(t);
      const L = t.cards.findIndex((W) => W.id === f), z = t.cards.slice(L + 1).find((W) => W.laneId === E)?.id;
      Wn(D(o.onChange, t, { cardId: f, laneId: E, noteToCard: {
        noteId: l,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...z ? { before: z } : {}
      } }));
    }
  };
  const Se = e.setDragPolicy(oe), ne = o.onSelect && e.onSelectionChange?.(() => Je()), Ae = () => {
    w && be();
  };
  e.element?.addEventListener?.("pointerdown", Ae, !0), j(t, { animate: !1 });
  function In(s, d, c) {
    const p = t.cards.find((L) => L.id === s);
    if (!p) return { kind: "outside" };
    const C = t.lanes.map((L) => b.get(Z(ee.column(L.id)))).filter(Boolean), l = e.hitTestNodes(d, C, { padding: 6 }), f = l ? Q(l.id).key : null;
    if (!f) return { kind: "outside" };
    if (f === p.laneId) return { kind: "home" };
    const h = xe(t, s, f);
    if (!h) return { kind: "refused", laneId: f, reason: He(t, s, f) ?? "That move is not available." };
    if (!c) return { kind: "candidate", laneId: f, next: h };
    let I = null;
    try {
      I = c({ x: d.x - F.x, y: d.y - F.y });
    } catch (L) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", L), { kind: "candidate", laneId: f, next: h };
    }
    const E = I?.cards.find((L) => L.id === s)?.laneId;
    return !I || !E || E === p.laneId ? { kind: "home" } : { kind: "candidate", laneId: E, next: I };
  }
  function ot() {
    return new Set(se(t, { layout: S }).places.map((s) => s.row)).size > 1;
  }
  function xn(s, d, c = !1) {
    const p = t.cards.find((L) => L.id === s), C = zn(t, s), l = w?.cardId === s && w.laneId === null ? w.side : void 0;
    if (l !== void 0) {
      if (c || d === l) return;
      const L = l > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (be(), L.id === p.laneId) {
        pe(L.id, a ?? t), e.announce?.(`${p.label} is back in ${L.label}.`);
        return;
      }
      if (C.includes(L)) {
        const W = xe(t, s, L.id);
        w = { cardId: s, laneId: L.id, next: W }, j(W), pe(L.id, W), D(o.onPreview, W), e.announce?.(`${p.label} to ${L.label}: ${ce(W, L.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const z = He(t, s, L.id) ?? "That move is not available.";
      V(), r = { laneId: L.id, reason: z, timer: setTimeout(() => V(), 1500) }, j(a ?? t), pe(L.id, a ?? t), e.announce?.(`${p.label} can't move to ${L.label}. ${z}`), D(o.onRefuse, { cardId: s, laneId: L.id, reason: z });
      return;
    }
    const f = w?.cardId === s ? w.laneId : p.laneId;
    let h;
    if (c) {
      const { places: L } = se(t, { layout: S }), z = L.find((W) => W.laneId === f);
      h = L.filter((W) => W.column === z.column && (W.row - z.row) * d > 0).sort((W, re) => (W.row - re.row) * d).map((W) => t.lanes.find((re) => re.id === W.laneId));
    } else {
      const L = t.lanes.findIndex((z) => z.id === f);
      h = d > 0 ? t.lanes.slice(L + 1) : t.lanes.slice(0, L).reverse();
    }
    const I = h.find((L) => C.includes(L));
    if (V(), !I) {
      const L = h[0];
      if (!L) {
        if (!c && je(t)) {
          const W = De(t, s);
          if (W) {
            e.announce?.(W), D(o.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          rt(p, d);
          return;
        }
        e.announce?.(`${p.label} has no lane to move to on that side.`);
        return;
      }
      const z = He(t, s, L.id) ?? "That move is not available.";
      r = { laneId: L.id, reason: z, timer: setTimeout(() => V(), 1500) }, j(w?.next ?? a ?? t), pe(L.id, w?.next ?? a ?? t), e.announce?.(`${p.label} can't move to ${L.label}. ${z}`), D(o.onRefuse, { cardId: s, laneId: L.id, reason: z });
      return;
    }
    if (I.id === p.laneId) {
      be(), pe(I.id, a ?? t), e.announce?.(`${p.label} is back in ${I.label}.`);
      return;
    }
    const E = xe(t, s, I.id);
    w = { cardId: s, laneId: I.id, next: E }, j(E), pe(I.id, E), D(o.onPreview, E), e.announce?.(`${p.label} to ${I.label}: ${ce(E, I.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function pe(s, d = t) {
    const c = se(d, { layout: S, rows: $n() }).places.find((I) => I.laneId === s), p = e.canvas?.viewbox?.();
    if (!c || !p || !(p.width > 0) || !(p.height > 0)) return;
    const C = 16, l = (I, E, L, z) => E + C * 2 >= z || I - C < L ? I - C - L : I + E + C > L + z ? I + E + C - (L + z) : 0, f = l(F.x + c.x, c.width, p.x, p.width), h = l(F.y + c.y, c.height, p.y, p.height);
    (f || h) && e.panBy?.({ x: f, y: h });
  }
  function Je() {
    if (!o.onSelect || _) return;
    const s = u ? [] : e.getSelectedNodes?.() ?? [], d = s.length === 1 && b.get(s[0].id) === s[0] ? Q(s[0].id) : null, c = d?.kind === "card" ? { cardId: d.key } : d?.kind === "lane" ? { laneId: d.key } : null, p = c ? JSON.stringify(c) : null;
    p !== U && (U = p, D(o.onSelect, c));
  }
  function be() {
    w && (w = null, D(o.onPreview, null), j(a ?? t));
  }
  function rt(s, d) {
    const { width: c } = se(t, { layout: S }), p = b.get(Z(ee.card(s.id)))?.options, C = p?.width ?? 228, l = { x: d > 0 ? F.x + c + 32 : F.x - C - 32, y: p?.y ?? F.y }, f = Fn(t, s.id);
    w = { cardId: s.id, laneId: null, side: d, spot: l, next: t }, j(t), D(o.onPreview, f), e.announce?.(`${s.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Qe() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ee() {
    return !u && !i && !a && !A && !Qe() && je(t);
  }
  function Xe() {
    P && (P = null, u || me());
  }
  function Ne(s) {
    const d = t.lanes.map((p) => b.get(Z(ee.column(p.id)))).filter(Boolean), c = e.hitTestNodes(s, d, { padding: 6 });
    return c ? Q(c.id)?.key ?? null : null;
  }
  function Re(s) {
    const d = s.options ?? {}, c = zt({
      backgroundColor: d.backgroundColor,
      textColor: d.fontColor,
      fontFamily: d.fontFamily,
      fontSize: d.fontSize,
      borderColor: d.borderColor,
      borderWidth: d.borderWidth
    }), p = String(d.text ?? ""), C = p.replace(/\s+/g, " ").trim(), l = {};
    p.trim() !== C && p.length <= 400 && (l.text = p.trim()), typeof d.shape == "string" && /^[a-z]{1,24}$/i.test(d.shape) && (l.shape = d.shape);
    for (const f of ["width", "height"]) Number.isFinite(d[f]) && d[f] >= 10 && d[f] <= 4e3 && (l[f] = Math.round(d[f]));
    return { id: s.id, label: C, ...c ? { look: c } : {}, ...Object.keys(l).length ? { asNote: l } : {} };
  }
  function Cn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function at(s, d) {
    for (const { node: l } of s) {
      const f = $e(l);
      if (f) return f;
    }
    const c = t.lanes.find((l) => l.id === d), p = t.cards.filter((l) => l.laneId === d).length;
    if (c.capacity !== void 0 && p + s.length > c.capacity) {
      const l = c.capacity - p;
      return l > 0 ? `It has room for ${l} more ${l === 1 ? "card" : "cards"}.` : `It already holds ${p} of ${c.capacity} ${c.capacity === 1 ? "card" : "cards"}.`;
    }
    let C = t;
    for (const { offer: l } of s) {
      const f = ve(C, d, l);
      if (f) return f;
      C = Pe(C, d, l);
    }
    return null;
  }
  function $e(s) {
    return (s.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((c) => c !== s && (c.relationships?.associations ?? []).some((p) => p.child === s || p.childId === s.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : s.options?.image ? "A note with a picture stays a note." : s.options?.link?.show && s.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const en = (s) => s || "This note";
  function nn(s, d) {
    let c = t;
    const p = s.map(({ node: f, offer: h, from: I }) => {
      c = Pe(c, d, h);
      const E = { ...f.options ?? {}, ...I ? { x: I.x, y: I.y } : {} };
      return { node: f, card: c.cards[c.cards.length - 1], kept: E };
    });
    e.beginHostStep?.(), t = c;
    let C = t;
    for (const { node: f, card: h } of p)
      h.id !== f.id && N.set(f.id, h.id), G.set(Z(ee.card(h.id)), { x: f.options?.x ?? 0, y: f.options?.y ?? 0 }), Me(() => e.removeNode(f.id));
    e.endHostStep?.(), j(t), it(Z(ee.card(p[0].card.id)));
    const l = t.lanes.find((f) => f.id === d);
    e.announce?.(p.length === 1 ? `${p[0].card.label} is now a card in ${l.label}. ${ce(t, d)}.` : `${Cn(p.map(({ card: f }) => f.label))} are now cards in ${l.label}. ${ce(t, d)}.`);
    for (const { node: f, card: h, kept: I } of p) {
      const E = { cardId: h.id, laneId: d, noteToCard: {
        noteId: f.id,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {}
      } }, L = () => {
        t !== C || !t.cards.some((z) => z.id === h.id) || (t = q({ ...t, cards: t.cards.filter((z) => z.id !== h.id) }), C = t, j(t));
      };
      Sn(D(o.onChange, t, E), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: f.id, isComment: !1 } }]);
      }, () => {
        if (!u) {
          if (L(), !e.nodes.one(I.id)) {
            e.beginHostStep?.();
            const z = Me(() => e.addNode({ ...I }));
            z && (z.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${h.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        u || (L(), e.announce?.(`Someone else put ${h.label} on the board first.`));
      });
    }
  }
  function tn(s, d) {
    const c = t.cards.find((Y) => Y.id === s), p = t.lanes.find((Y) => Y.id === c.laneId), C = t.cards.findIndex((Y) => Y.id === s), l = t.cards.slice(C + 1).find((Y) => Y.laneId === c.laneId)?.id, f = Fn(t, s), h = y.get(Z(ee.card(s))) ?? {}, I = e.nodes.one(s) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : s, E = ($.cornerRadius ?? 0) > 0, L = c.asNote, z = L?.text !== void 0 && L.text.replace(/\s+/g, " ").trim() === c.label ? L.text : c.label, W = {
      id: I,
      x: Math.round(d.x),
      y: Math.round(d.y),
      width: L?.width ?? h.width ?? 228,
      height: L?.height ?? h.height ?? 76,
      text: z,
      shape: L?.shape ?? (E ? "roundedrectangle" : "rectangle"),
      backgroundColor: c.look?.backgroundColor ?? h.backgroundColor,
      fontColor: c.look?.textColor ?? h.foregroundColor,
      fontSize: c.look?.fontSize ?? h.fontSize,
      borderColor: c.look?.borderColor ?? h.borderColor,
      borderWidth: c.look?.borderWidth ?? h.borderWidth,
      ...c.look?.fontFamily ?? h.fontFamily ? { fontFamily: c.look?.fontFamily ?? h.fontFamily } : {}
    };
    for (const Y of Object.keys(W)) W[Y] === void 0 && delete W[Y];
    e.beginHostStep?.(), t = f;
    const re = t;
    I !== s ? N.set(I, s) : N.delete(I);
    const te = Me(() => e.addNode(W));
    te && (te.announcedByCreator = !0), e.endHostStep?.(), j(t), te?.ready?.then?.(() => {
      if (u || e.nodes.one(I) !== te) return;
      const Y = () => e.selectNodes?.([te]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(Y) : Y();
    }), e.announce?.(`${c.label} is now a note on the canvas. ${p.label}: ${ce(t, p.id)}.`);
    const Pn = () => {
      e.nodes.one(I) === te && (e.beginHostStep?.(), Me(() => e.removeNode(I)), e.endHostStep?.());
    };
    Sn(D(o.onChange, t, { cardId: s, cardToNote: { noteId: I } }), () => {
      te && e.nodes.one(I) === te && e.sendHeld?.([{ type: "onNodeAdded", data: { id: I, nodeOptions: Rn(te.options) } }]);
    }, () => {
      if (!u) {
        if (Pn(), t === re && !t.cards.some((Y) => Y.id === s)) {
          const Y = { id: s, label: c.label, ...c.look ? { look: c.look } : {}, ...c.asNote ? { asNote: c.asNote } : {} }, Ln = Pe(t, c.laneId, Y, l);
          Ln && (t = Ln, j(t));
        }
        e.announce?.(`${c.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      u || (Pn(), e.announce?.(`Someone else took ${c.label} off the lanes first.`));
    });
  }
  function st(s, d, c) {
    const p = c.map((I) => I.id), C = p.indexOf(d), l = s.cards.find((I) => I.id === d);
    if (C < 0 || !l) return s;
    const f = s.cards.filter((I) => I !== l), h = f.findIndex((I) => p.indexOf(I.id) > C);
    return f.splice(h < 0 ? f.length : h, 0, l), q({ ...s, cards: f });
  }
  function it(s) {
    m = m.then(() => {
      const d = b.get(s);
      if (u || !d) return;
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
  function lt(s, d) {
    V(!1), r = { laneId: d.laneId, reason: d.reason, timer: setTimeout(() => V(), 1500) }, j(t, { skip: d.cardId });
    const c = t.lanes.find((p) => p.id === d.laneId);
    e.announce?.(`${s} can't move to ${c?.label ?? "that lane"}. ${d.reason}`), D(o.onRefuse, d);
  }
  function V(s = !0) {
    r && (clearTimeout(r.timer), r = null, s && !u && me());
  }
  function me() {
    j(A && A.outcome.kind === "candidate" ? A.outcome.next : w?.next ?? a ?? t, { skip: A?.cardId });
  }
  function An(s) {
    const d = Bn(s, { native: !0, origin: F, rows: $n(), layout: S, style: $ }).nodes, c = new Map(d.map((l) => [l.options.id, l.options])), p = (l, f, h, I = !1) => {
      const E = c.get(ee.column(l));
      E && (E.borderColor = f, E.borderWidth = h, delete E.borderStyle);
      const L = I && c.get(ee.lane(l));
      L && (L.borderColor = f, L.borderWidth = h);
    }, C = A?.cardId ?? w?.cardId;
    if (O = /* @__PURE__ */ new Map(), C) {
      const l = t.cards.find((h) => h.id === C)?.laneId;
      for (const h of zn(t, C)) h.id !== l && (p(h.id, _n, 2), O.set(h.id, "open"));
      const f = A ? A.outcome : w?.laneId ? { kind: "candidate", laneId: w.laneId } : null;
      f?.kind === "candidate" && (p(f.laneId, Mn, 3, !0), O.set(f.laneId, "over")), f?.kind === "refused" && (p(f.laneId, dn, 3), O.set(f.laneId, "refused"));
    }
    if (P && !C) {
      for (const l of P.open) l !== P.laneId && (p(l, _n, 2), O.set(l, "open"));
      P.laneId && !P.refusal && (p(P.laneId, Mn, 3, !0), O.set(P.laneId, "over")), P.laneId && P.refusal && (p(P.laneId, dn, 3), O.set(P.laneId, "refused"));
    }
    if (w?.laneId === null && w.spot) {
      const l = c.get(ee.card(w.cardId));
      l && (l.xPos = w.spot.x, l.yPos = w.spot.y);
    }
    if (r) {
      O.set(r.laneId, "refused"), p(r.laneId, dn, 3, !0);
      const l = c.get(ee.caption(r.laneId));
      l && (l.text = r.reason, l.foregroundColor = "#b42318");
    }
    if (M = /* @__PURE__ */ new Set(), a && s === a) {
      const l = (h, I) => JSON.stringify(h) === JSON.stringify(I), f = (h) => {
        const I = c.get(h);
        I && (I.borderStyle = "dashed", I.borderColor = Ot, I.borderWidth = 2, M.add(Z(h)));
      };
      for (const h of s.cards) l(h, t.cards.find((I) => I.id === h.id)) || f(ee.card(h.id));
      for (const h of s.lanes) l(h, t.lanes.find((I) => I.id === h.id)) || f(ee.lane(h.id));
    }
    for (const l of d) {
      l.options.id = Z(l.options.id);
      for (const f of l.relationships.associations)
        f.parentId = Z(f.parentId), f.childId = Z(f.childId);
    }
    return d;
  }
  function $n() {
    return A || w ? t.lanes.map((s) => t.cards.filter((d) => d.laneId === s.id).length) : void 0;
  }
  function j(s, d = {}) {
    if (u) return;
    v = { model: s, skip: d.skip, animate: d.animate !== !1 };
    const c = An(s), p = [];
    for (const { options: l } of c) {
      const f = l.id;
      if (b.has(f)) continue;
      const h = G.get(f);
      G.delete(f);
      const I = h && d.animate !== !1 && !ln() ? { ...l, xPos: h.x, yPos: h.y } : l, E = e.nodes.add(At(I));
      b.set(f, E), y.set(f, { ...I }), E.ready && p.push(E.ready.then(() => {
        if (b.get(f) !== E) return;
        E.applyGovernance?.(), Q(f)?.kind === "column" && E.toBack?.(!1);
        const L = Tn(v?.model ?? s, f);
        L && E.svgGroup?.node?.setAttribute("aria-label", L);
      }).catch(() => {
      }));
    }
    const C = v;
    m = Promise.all([m, ...p]).then(() => {
      u || v !== C || dt(An(C.model), C);
    }).catch((l) => console.warn("WORKSHOP: could not draw the workshop", l));
  }
  function dt(s, d) {
    const c = new Set(s.map((C) => C.options.id)), p = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [l, f] of [...b]) {
        if (c.has(l)) continue;
        for (const [I, E] of [...g])
          E.parentId !== l && E.childId !== l || (E.parent.relationships?.removeAssociation(I), g.delete(I));
        e.deselectNode?.(f), f.editor?.cancelInline?.(), b.delete(l), y.delete(l);
        const h = x.get(l);
        h && (x.delete(l), k.delete(h)), e.nodes.remove(l);
      }
      for (const { options: l } of s) {
        const f = l.id, h = b.get(f);
        if (!h?.svgGroup) continue;
        const I = y.get(f) ?? {}, E = h.editor?.isInlineEditing?.();
        (l.fontSize !== I.fontSize || l.foregroundColor !== I.foregroundColor) && (h.options.fontSize = l.fontSize, h.options.fontColor = l.foregroundColor, h.applyTextStyle?.()), l.text !== I.text && !E && h.setText?.(l.text), (l.width !== I.width || l.height !== I.height) && (l.vectorPath ? (h.options.width = l.width, h.options.height = l.height, h.setShape?.(h.options.shape, l.vectorPath), Q(f)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(l.width, l.height)), l.backgroundColor !== I.backgroundColor && h.setColors?.(l.backgroundColor), (l.borderColor !== I.borderColor || l.borderWidth !== I.borderWidth || l.borderStyle !== I.borderStyle) && (h.options.borderColor = l.borderColor, h.options.borderWidth = l.borderWidth, h.options.borderStyle = l.borderStyle, h.applyBorder?.());
        const L = l.xPos !== I.xPos || l.yPos !== I.yPos || Math.abs((h.options.x ?? 0) - l.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - l.yPos) > 0.5;
        if (f !== (d.skip && Z(ee.card(d.skip))) && L) {
          const re = d.animate && !ln() ? 180 : 0, te = p.includes(h) ? () => {
            !u && b.get(f) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          te && re && p.length === 1 && h.resizeRotate?.disable?.(), h.position(l.xPos, l.yPos, te, void 0, re);
        }
        const z = Tn(d.model, f);
        z && h.svgGroup.node.getAttribute("aria-label") !== z && h.svgGroup.node.setAttribute("aria-label", z), M.has(f) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed");
        const W = Q(f);
        if (W?.kind === "column") {
          const re = O.get(W.key);
          re ? h.svgGroup.node.setAttribute("data-workshop-drop", re) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        y.set(f, { ...l });
      }
      const C = /* @__PURE__ */ new Map();
      for (const l of s) for (const f of l.relationships.associations) C.set(f.id, f);
      for (const [l, f] of [...g])
        C.has(l) && b.get(f.parentId) === f.parent && b.get(f.childId) === f.child || (f.parent.relationships?.removeAssociation(l), g.delete(l));
      for (const [l, f] of C) {
        if (g.has(l)) continue;
        const h = b.get(f.parentId), I = b.get(f.childId);
        !h?.relationships || !I?.svgGroup || (h.relationships.addAssociation(I, Pt(f)), g.set(l, { parentId: f.parentId, childId: f.childId, parent: h, child: I }));
      }
    }), e.notifyNodeChanged?.();
  }
  function Tn(s, d) {
    const c = Q(d);
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
  function ct(s, d) {
    const c = Bn(s, { native: !0, origin: F, layout: S, style: $ }).nodes.find((p) => p.options.id === d)?.options;
    return c ? { x: c.xPos, y: c.yPos } : null;
  }
  function ke() {
    A && e.cancelGovernedDrag?.("host"), A = null, w && (w = null, D(o.onPreview, null)), V(!1);
  }
  return {
    toCanvas(s) {
      if (u || i || Qe()) return "This workshop is view-only here.";
      if (!t.cards.some((C) => C.id === s)) return "That card is no longer on the board.";
      const d = De(t, s);
      if (d) return d;
      w && be(), a && (ke(), a = null, j(t), e.refreshGovernance?.());
      const { width: c } = se(t, { layout: S }), p = b.get(Z(ee.card(s)))?.options;
      return tn(s, { x: F.x + c + 32, y: p?.y ?? F.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...F };
    },
    get layout() {
      return { ...S };
    },
    get bounds() {
      const { width: s, height: d } = se(t, { layout: S });
      return { x: F.x, y: F.y, width: s, height: d };
    },
    setLayout(s) {
      if (u) throw new Error("This workshop has been detached.");
      const d = s?.lanesPerRow === void 0 ? {} : { lanesPerRow: s.lanesPerRow };
      se(t, { layout: d }), d.lanesPerRow !== S.lanesPerRow && (ke(), S = d, j(a ?? t));
    },
    whenDrawn: () => m,
    update(s) {
      if (u) throw new Error("This workshop has been detached.");
      const d = q(s);
      ke(), t = d, j(a ?? t);
    },
    preview(s) {
      if (u) throw new Error("This workshop has been detached.");
      const d = s ? q(s) : null;
      ke(), a = d, j(a ?? t), e.refreshGovernance?.();
    },
    refuse(s, d) {
      const c = t.lanes.find((p) => p.id === s);
      u || !c || (V(!1), r = { laneId: s, reason: d, timer: setTimeout(() => V(), 1500) }, me(), e.announce?.(`${c.label}: ${d}`));
    },
    setReadOnly(s) {
      u || i === !!s || (ke(), i = !!s, j(a ?? t), e.refreshGovernance?.());
    },
    destroy() {
      u || (ke(), u = !0, e.element?.removeEventListener?.("pointerdown", Ae, !0), ne?.(), e.withPolicyAuthority(() => {
        for (const [s, d] of g) d.parent.relationships?.removeAssociation(s);
        for (const [s, d] of b)
          e.deselectNode?.(d), d.editor?.cancelInline?.(), e.nodes.one(s) === d && e.nodes.remove(s);
      }), g.clear(), b.clear(), y.clear(), k.clear(), x.clear(), Se(), _ = !1, Je(), e.notifyNodeChanged?.());
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
function Wn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
  }, () => {
  });
}
function Rt(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function Mt(e) {
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
function Yn(e) {
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
const _t = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Wt = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Oe(e) {
  const n = ue(e), o = {}, t = (i) => {
    if (typeof i != "string" || !_t.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, a = (i, u, b) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < u || i > b) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !Wt.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = a(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = a(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function zt(e) {
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
function Ft(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Ie = (e) => "lane-" + e, he = (e) => "card-" + e, Ye = (e) => "image-" + e;
function po(e) {
  const n = Ft(e);
  return kn(e).map((o) => {
    const t = e.cards.filter((u) => u.laneId === o.id), a = n.filter((u) => u.laneId === o.id), i = [Ie(o.id)];
    return o.station?.image && i.push(Ye(o.id)), { lane: o, cards: t, signals: a, nodeIds: [...i, ...t.map((u) => he(u.id))] };
  });
}
const Vn = 5, Zn = 24, fn = 3;
function q(e) {
  const n = ue(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ae(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Vn)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > Zn)
    throw new Error("A workshop supports up to 24 cards.");
  const a = n.lanes.map((y) => {
    const g = ue(y), k = { id: de(g.id), label: ae(g.label) };
    if (g.capacity !== void 0) {
      const x = o ? 576 : 24;
      if (typeof g.capacity != "number" || !Number.isInteger(g.capacity) || g.capacity < 1 || g.capacity > x)
        throw new Error(`Lane capacity must be a whole number from 1 to ${x}.`);
      k.capacity = g.capacity;
    }
    if (g.station !== void 0) {
      const x = ue(g.station), A = (P) => {
        if (typeof P != "number" || !Number.isInteger(P) || P < 0 || P >= fn)
          throw new Error("Use map coordinates from 0 to 2.");
        return P;
      };
      if (!Array.isArray(x.next) || x.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const w = x.next.map(de);
      we(w, "onward stop"), k.station = { column: A(x.column), row: A(x.row), next: w, outcome: ae(x.outcome, 160) }, x.image !== void 0 && (k.station.image = Yn(x.image));
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
  const u = n.cards.map((y) => {
    const g = ue(y), k = { id: de(g.id), label: ae(g.label), laneId: de(g.laneId) };
    if (!i.includes(k.laneId)) throw new Error("Card refers to an unknown lane.");
    if (g.allowedLaneIds !== void 0) {
      if (!Array.isArray(g.allowedLaneIds) || g.allowedLaneIds.length > a.length) throw new Error("Invalid allowed lanes.");
      if (k.allowedLaneIds = g.allowedLaneIds.map(de), we(k.allowedLaneIds, "allowed lane"), !k.allowedLaneIds.includes(k.laneId) || !k.allowedLaneIds.every((x) => i.includes(x)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (g.look !== void 0) {
      const x = Oe(g.look);
      x && (k.look = x);
    }
    if (g.asNote !== void 0) {
      const x = bn(g.asNote);
      x && (k.asNote = x);
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
  we(u.map((y) => y.id), "card ID");
  const b = { version: 1, title: t, lanes: a, cards: u };
  if (n.experience !== void 0) {
    const y = ue(n.experience);
    if (y.version !== 1 || y.kind !== "customer-interviews" && y.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    b.experience = { version: 1, kind: y.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    b.signals = n.signals.map((y) => {
      const g = ue(y), k = de(g.cardId), x = de(g.laneId);
      if (!u.some((A) => A.id === k) || !i.includes(x))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: de(g.id),
        label: ae(g.label),
        cardId: k,
        laneId: x,
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
    return b.kind = "release-plan", ut(b), b;
  for (const y of a)
    if (u.filter((g) => g.laneId === y.id).length > (y.capacity ?? 1 / 0))
      throw new Error(`Lane "${y.label}" exceeds its capacity.`);
  return b;
}
const Jn = 65536;
function mo(e) {
  const n = JSON.stringify(q(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Jn) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function wo(e) {
  if (e.length > Jn) throw new Error("This workshop is too large to open from a link.");
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
function xe(e, n, o) {
  const t = e.cards.find((i) => i.id === n);
  if (!t || !e.lanes.some((i) => i.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return Ke(e, t, o);
  const a = Kt(e, n, o);
  return a || (o === "prototype" && Ce(e) === "customer-interviews" ? null : qe(e, t).some((i) => i.id === o) ? hn(e, n, o) : null);
}
function zn(e, n) {
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
    const y = ye(e, o), g = { ...e, lanes: e.lanes.map((x) => x === a ? { id: a.id, label: a.label } : x) }, k = Ke(g, t, o);
    return k ? `Needs ${ye(k, o) - y} points. It already holds ${y} of ${a.capacity} points.` : i;
  }
  const u = e.lanes.find((y) => y.id === t.laneId);
  if (u?.station && !u.station.next.includes(o)) return `${a.label} can't be reached from ${u.label}.`;
  const b = e.cards.filter((y) => y.laneId === o).length;
  return a.capacity !== void 0 && b >= a.capacity ? `It already holds ${b} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : i;
}
function je(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !Ce(e);
}
const Ht = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function jt(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && Ht.test(n) && !o.has(n) ? n : Ze(e, "card");
}
function ve(e, n, o) {
  const t = e.lanes.find((u) => u.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((u) => u.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Ce(e)) return "This workshop keeps the cards it came with.";
  const a = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!a) return "A card needs some words. Type on the note first.";
  if (a.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(a)) return "A card holds plain words only.";
  if (e.cards.length >= Zn) return "A workshop holds up to 24 cards.";
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
  if (ve(e, n, o) !== null) return null;
  const a = o.look === void 0 ? void 0 : Oe(o.look), i = o.asNote === void 0 ? void 0 : bn(o.asNote), u = {
    id: jt(e, o.id),
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
function Fn(e, n) {
  return De(e, n) !== null ? null : q({ ...e, cards: e.cards.filter((o) => o.id !== n) });
}
function ce(e, n) {
  const o = e.lanes.find((i) => i.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const i = ye(e, n);
    return o.capacity ? i + " / " + o.capacity + " points" : i + " points";
  }
  const t = Yt(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const a = e.cards.filter((i) => i.laneId === n).length;
  return o.capacity !== void 0 ? a + " of " + o.capacity : a + (a === 1 ? " card" : " cards");
}
const Ve = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Be = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Qn(e, n = Ve, o = 28) {
  const { pitch: t, row: a, top: i } = n, u = !!e.lanes[0].station, b = e.lanes.map((k) => e.cards.filter((x) => x.laneId === k.id).length), y = i + Math.max(1, ...b) * a + 36, g = e.lanes.map((k, x) => ({
    x: u ? k.station.column * (t + o) : x * t,
    y: u ? k.station.row * y : 0
  }));
  return {
    points: g,
    width: Math.max(...g.map((k) => k.x)) + t,
    height: Math.max(...g.map((k, x) => k.y + i + (u ? Math.max(1, b[x]) : b[x] + 1) * a))
  };
}
function go() {
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
function Xn(e) {
  const n = q(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Dt(e, n) {
  const o = Xn(e), t = Ze(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), q(o);
}
function Bt(e, n, o) {
  const t = Xn(e);
  return t.cards.push({
    id: Ze(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), q(t);
}
function yo() {
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
function Hn(e, n, o) {
  const t = q(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const a = t.lanes.find((k) => k.id === n);
  if (!a?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= Vn) throw new Error("A map can have up to five stations.");
  const i = ae(o?.label), u = ae(o?.outcome, 160), b = Ze(t, "station");
  let y, g = 1 / 0;
  for (let k = 0; k < fn; k++)
    for (let x = 0; x < fn; x++) {
      if (t.lanes.some((w) => w.station.column === x && w.station.row === k)) continue;
      const A = Math.abs(a.station.column - x) + Math.abs(a.station.row - k);
      A < g && (g = A, y = { column: x, row: k });
    }
  if (!y) throw new Error("There is no free station position.");
  return a.station.next.push(b), t.lanes.push({ id: b, label: i, station: { ...y, next: [], outcome: u, ...o.image === void 0 ? {} : { image: Yn(o.image) } } }), t.presentationOrder?.push(b), t;
}
const bo = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, et = (e) => "caption-" + e, Le = (e) => "column-" + e, ee = { lane: Ie, card: he, image: Ye, caption: et, column: Le };
function nt(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function cn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), a = e, i = n;
  return t ? `M ${t} 0 H ${a - t} Q ${a} 0 ${a} ${t} V ${i - t} Q ${a} ${i} ${a - t} ${i} H ${t} Q 0 ${i} 0 ${i - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${a} V ${i} H 0 Z`;
}
function jn(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function Dn(e, n, o, t) {
  for (let a = n; a > 11; a--) {
    const i = Math.max(1, Math.floor(o / (a * 0.55)));
    if (e.split(`
`).reduce((b, y) => b + Math.max(1, Math.ceil(y.length / i)), 0) * a * 1.3 <= t) return a;
  }
  return Math.min(n, 11);
}
const tt = 152, pn = tt + 12, Ut = 12;
function Gt(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function se(e, n = {}) {
  const o = q(e), { pitch: t, row: a, top: i } = Ve, u = o.lanes.map((A) => o.cards.filter((w) => w.laneId === A.id).length), b = (A) => Math.max(u[A], (Array.isArray(n.rows) ? n.rows[A] : n.rows) ?? 0), y = !!o.lanes[0].station, g = o.lanes.some((A) => A.station?.image), k = Gt(n.layout, o.lanes.length), x = [];
  if (y) {
    const { points: A } = Qn(o);
    o.lanes.forEach((w, P) => x.push({
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
      P.forEach((G, r) => x.push({ laneId: G.id, x: r * t, y: A, width: t, height: N, column: r, row: w / k })), A += N + Ut;
    }
  }
  return { places: x, width: Math.max(...x.map((A) => A.x + A.width)), height: Math.max(...x.map((A) => A.y + A.height)) };
}
function qt(e, n) {
  const { pitch: o, width: t, row: a, height: i, top: u } = Ve, b = n.origin ?? { x: 0, y: 0 }, y = !!e.lanes[0].station, { places: g } = se(e, n), k = n.style ?? {}, x = k.textColor ?? Te.fontColor, A = k.borderColor ?? Te.borderColor, w = k.borderWidth ?? Te.borderWidth, P = k.cornerRadius ?? 0, N = k.fontSize ?? Te.fontSize, G = k.laneFontSize ?? N + 2, r = k.captionFontSize ?? Math.max(11, N - 1), m = [], v = ($) => {
    const O = { options: {
      shapeHint: "rectangle",
      vectorPath: cn($.width, $.height, P),
      foregroundColor: x,
      borderColor: A,
      borderWidth: w,
      ...k.fontFamily ? { fontFamily: k.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return m.push(O), O;
  };
  e.lanes.forEach(($, O) => {
    const M = g[O], U = b.x + M.x, _ = b.y + M.y, F = $.station?.image;
    v({
      id: Le($.id),
      text: "",
      name: $.label,
      xPos: U + 2,
      yPos: _,
      width: o - 4,
      height: M.height,
      vectorPath: cn(o - 4, M.height, P ? P + 2 : 0),
      backgroundColor: y ? "#fcf9ed" : jn(Be[O], 0.6),
      borderColor: y ? "#a8b5aa" : jn(Be[O], 0.1),
      borderWidth: 1,
      ...y ? { borderStyle: "dashed" } : {}
    }), v({
      id: Ie($.id),
      text: $.label,
      name: $.label,
      xPos: U + 8,
      yPos: _ + 6,
      width: t,
      height: 58,
      backgroundColor: Be[O],
      fontSize: Dn($.label, G, t - 16, 50)
    }), v({
      id: et($.id),
      text: ce(e, $.id),
      name: $.label,
      xPos: U + 8,
      yPos: _ + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: r
    }), F && m.push({ options: {
      id: Ye($.id),
      name: F.alt,
      text: "",
      xPos: U + 8,
      yPos: _ + u,
      width: t,
      height: tt,
      shapeHint: "rectangle",
      image: F.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((J) => J.laneId === $.id).forEach((J, Q) => {
      const Z = e.kind === "release-plan" ? J.label + `
` + J.points + " points" : J.label, oe = y ? t - 20 : t, Se = y ? i - 6 : i, ne = y ? {} : { ...k.card, ...J.look }, Ae = y ? P : k.card?.cornerRadius ?? P;
      v({
        id: he(J.id),
        text: Z,
        name: J.label,
        xPos: U + (y ? 18 : 8),
        yPos: _ + u + (F ? pn : 0) + Q * a,
        width: oe,
        height: Se,
        ...Ae !== P ? { vectorPath: cn(oe, Se, Ae) } : {},
        backgroundColor: y ? "#ffda75" : ne.backgroundColor ?? k.backgroundColor ?? Te.backgroundColor,
        ...ne.textColor ? { foregroundColor: ne.textColor } : {},
        ...ne.fontFamily ? { fontFamily: ne.fontFamily } : {},
        ...ne.borderColor ? { borderColor: ne.borderColor } : {},
        ...ne.borderWidth !== void 0 ? { borderWidth: ne.borderWidth } : {},
        fontSize: Dn(Z, ne.fontSize ?? N, oe - 16, Se - 8)
      });
    });
  });
  const S = new Map(m.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (S.get(Le($.id)).relationships.associations = $.station.next.map((O) => ({
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
        const M = he(O), U = he($.id);
        S.get(M).relationships.associations.push({
          id: `dependency-${O.length}-${O}-${$.id}`,
          parentId: M,
          childId: U,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const $ = new Set(n.beside), O = new Set(m.map((_) => _.options.id)), M = /* @__PURE__ */ new Map();
    for (const _ of [...O]) {
      if (!$.has(_)) continue;
      const F = nt(_, (J) => $.has(J) || O.has(J));
      O.add(F), M.set(_, F);
    }
    const U = (_) => M.get(_) ?? _;
    for (const _ of m) {
      _.options.id = U(_.options.id);
      for (const F of _.relationships.associations)
        F.parentId = U(F.parentId), F.childId = U(F.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: m };
}
function Bn(e, n) {
  const o = q(e);
  if (n?.native) return qt(o, n);
  const { width: t, row: a, height: i, top: u } = Ve, b = [];
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
  const { points: g } = Qn(o), k = 152, x = k + 12, A = o.lanes.some((w) => w.station?.image);
  o.lanes.forEach((w, P) => {
    const N = g[P].x, G = g[P].y + (A ? (w.station?.row ?? 0) * x : 0), r = w.station?.image, m = o.kind === "release-plan" ? w.label + `
` + (w.capacity ? ye(o, w.id) + " / " + w.capacity + " points" : ye(o, w.id) + " points") : w.label;
    y(Ie(w.id), m, N, G, u - 12, Be[P]), r && b.push({ options: {
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
    }, relationships: { associations: [] } }), o.cards.filter((v) => v.laneId === w.id).forEach((v, S) => y(he(v.id), o.kind === "release-plan" ? v.label + `
` + v.points + " points" : v.label, N, G + u + (r ? x : 0) + S * a, i, "#fffdf6"));
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
const ko = {
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
function vo() {
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
function Io() {
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
function Kt(e, n, o) {
  const t = Ce(e), a = e.cards.find((u) => u.id === n);
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
function Yt(e, n) {
  if (Ce(e) !== "experiment-budget") return null;
  const o = vn.find((i) => i.id === n), t = e.cards.filter((i) => i.laneId === n).length, a = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? a + " " + (a === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  Te as DEFAULT_NOTE_STYLE,
  Fe as WorkshopReferenceError,
  Hn as addWorkshopBranch,
  Bt as addWorkshopCard,
  Dt as addWorkshopLane,
  xt as applyWorkshopEdits,
  ho as attachWorkshop,
  qe as availableLanes,
  ft as canHangPanel,
  vn as channels,
  St as checkWorkshopReplacement,
  pt as countWord,
  Io as createBudgetWorkshop,
  vo as createInterviewWorkshop,
  go as createLaneWorkshop,
  yo as createWorkshopMap,
  wo as decodeWorkshopFragment,
  co as describeFocusDarkroom,
  fo as describeWorkshopEdits,
  mo as encodeWorkshopFragment,
  eo as handoffSummary,
  so as hangGalleryPanel,
  ko as industrialWorkshop,
  lo as initialFocusDarkroom,
  mn as interviews,
  Be as laneColors,
  ge as listed,
  _e as listeningRoom,
  to as listeningRoomCaption,
  Zn as maxWorkshopCards,
  ro as moonGallery,
  hn as moveWorkshopCard,
  uo as named,
  bo as nightTransfer,
  io as normalizeFocusDarkroom,
  no as normalizeListeningRoom,
  ao as normalizeMoonGallery,
  Jt as normalizeOfflineHandoff,
  Zt as offlineHandoff,
  Kt as planStartupMove,
  mt as pointing,
  Un as printFields,
  ye as releaseLoad,
  oo as releasePlan,
  Xt as resolveHandoff,
  Ft as resolveWorkshopSignals,
  Qt as reviewHandoff,
  T as said,
  Ce as startupExperienceKind,
  wn as unquoted,
  q as validateWorkshop,
  Ue as workshopBoardKind,
  Yt as workshopBudgetResult,
  xe as workshopCandidate,
  Fn as workshopCardAsNote,
  De as workshopCardAsNoteRefusal,
  zt as workshopCardLookOf,
  zn as workshopDestinations,
  yn as workshopEditKinds,
  un as workshopFinder,
  ce as workshopLaneCaption,
  se as workshopLanePlaces,
  Ve as workshopLayout,
  ee as workshopNodeIds,
  Pe as workshopNoteCandidate,
  ve as workshopNoteRefusal,
  Qn as workshopPositions,
  kn as workshopPresentationLanes,
  po as workshopPresentationScenes,
  kt as workshopReferences,
  He as workshopRefusal,
  nt as workshopStandInId,
  je as workshopTakesNotes,
  Bn as workshopToSlate
};
