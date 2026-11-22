import { D as Re } from "./NoteDefaults-1xFW0br8.mjs";
const Go = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function qo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: r, fieldNote: l, deskNote: u, fallback: w } = e, I = (k) => typeof k == "string" && k.trim().length > 0 && k.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(k);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !I(l) || !I(u) || !I(w) ? null : { kind: n, version: o, stage: t, choice: r, fieldNote: l.trim(), deskNote: u.trim(), fallback: w.trim() };
}
function Ko(e) {
  return { ...e, stage: "review", choice: null };
}
function Jo(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Zo(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Ke = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Yo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: r, rightLabel: l } = e, u = (w) => typeof w == "string" && w.trim().length > 0 && w.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(w);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !u(r) || !u(l) ? null : { kind: n, version: o, mix: t, leftLabel: r.trim(), rightLabel: l.trim() };
}
function Vo({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === Ke.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === Ke.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === Ke.leftLabel && o === Ke.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function Ie(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function eo(e) {
  const n = new Map(e.cards.map((u) => [u.id, u])), o = new Map(e.lanes.map((u, w) => [u.id, w])), t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function l(u) {
    if (!t.has(u.id)) {
      if (r.has(u.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(u.id);
      for (const w of u.dependsOn ?? []) {
        const I = n.get(w);
        if (!I) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(I.laneId) > o.get(u.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        l(I);
      }
      r.delete(u.id), t.add(u.id);
    }
  }
  for (const u of e.cards) l(u);
  for (const u of e.lanes) {
    if (u.station) throw new Error("Release windows cannot also be map stations.");
    if (Ie(e, u.id) > (u.capacity ?? 1 / 0)) throw new Error(`Release "${u.label}" exceeds its point budget.`);
  }
}
function ln(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((A, S) => [A.id, S])), r = t.get(o);
  if (r === void 0) return null;
  const l = r < t.get(n.laneId), u = /* @__PURE__ */ new Set([n.id]), w = [n];
  for (; w.length; ) {
    const A = w.pop();
    for (const S of e.cards) {
      if (u.has(S.id)) continue;
      const y = t.get(S.laneId);
      (l ? y > r && A.dependsOn?.includes(S.id) : y < r && S.dependsOn?.includes(A.id)) && (u.add(S.id), w.push(S));
    }
  }
  if (e.cards.filter((A) => u.has(A.id)).some((A) => A.allowedLaneIds && !A.allowedLaneIds.includes(o))) return null;
  const k = { ...e, cards: e.cards.map((A) => u.has(A.id) ? { ...A, laneId: o } : A) }, v = e.lanes[r].capacity;
  return v !== void 0 && Ie(k, o) > v ? null : k;
}
const Qo = {
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
}, Xo = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function er(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const l of n.panels) {
    if (!l || typeof l.id != "string" || !/^[a-z][\w-]{0,31}$/.test(l.id) || typeof l.label != "string" || !l.label.trim() || l.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(l.artwork) || !(l.after === null || typeof l.after == "string")) return null;
    o.push({ id: l.id, label: l.label.trim(), artwork: l.artwork, after: l.after });
  }
  const t = new Map(o.map((l) => [l.id, l])), r = [...new Set(n.hung)];
  if (t.size !== o.length || r.length !== n.hung.length || r.some((l) => !t.has(l))) return null;
  for (const l of o) {
    const u = /* @__PURE__ */ new Set([l.id]);
    let w = l.after;
    for (; w !== null; ) {
      if (u.has(w) || !t.has(w) || r.includes(l.id) && !r.includes(w)) return null;
      u.add(w), w = t.get(w).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: r };
}
function no(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function nr(e, n) {
  return no(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const yt = ["firstPrint", "secondPrint", "thirdPrint"], kt = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function tr(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...kt, route: n.route };
  for (const t of yt) {
    const r = n[t];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = r.trim();
  }
  return o;
}
function or(e = new URLSearchParams()) {
  const n = { ...kt };
  for (const t of yt) {
    const r = e.get(t)?.trim();
    r && r.length <= 48 && (n[t] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function rr(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", be = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], ot = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Wn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), zn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ir = (e) => Wn(zn(e)), to = [
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
], oo = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : to.indexOf(e.toLowerCase()), ro = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function bt(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (r) => {
    const l = Wn(r);
    l && o.add(l);
  };
  t(e), t(zn(e));
  for (const r of [...o]) t(r.replace(/^(?:the|my|our)\s+/i, ""));
  for (const r of [...o]) t(r.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const r of [...o]) t(r.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const kn = "[^\\p{L}\\p{N}]", rt = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + ot(n) + "(?:$|" + kn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + kn + ")" + ot(n) + "(?:$|" + kn + ")", "u").test(e)
], it = ["first", "second", "third", "fourth", "fifth"];
function io(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + it.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Wn(zn(n)));
  if (!t) return null;
  const r = (t[1] ?? t[2]).toLowerCase(), l = r === "last" ? e.length - 1 : t[1] ? it.indexOf(r) : oo(r) - 1;
  return e[l] ?? null;
}
function bn(e, n, o, t, r) {
  const l = bt(n, o);
  if (l.some((w) => ro.test(w))) {
    const w = t && e.find((I) => I.id === t);
    return w ? { item: w, rank: 0 } : { pointing: !0 };
  }
  for (const w of l) {
    if (!w.startsWith("@")) continue;
    const I = e.find((k) => k.id === w.slice(1));
    if (I) return { item: I, rank: 0 };
  }
  for (const [w, I] of rt.entries())
    for (const k of l) {
      const v = e.filter((A) => I(A.label.toLowerCase(), k.toLowerCase()));
      if (v.length === 1) return { item: v[0], rank: w };
      if (v.length > 1) return { several: v };
    }
  const u = r ? io(e, n, o) : null;
  return u ? { item: u, rank: rt.length } : {};
}
class Ve extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function $n(e, n, o, t, r = !1) {
  return { find: (I) => {
    const k = bn(e, I, n, t, r);
    if (k.item) return k.item;
    const v = bt(I, n), A = v[v.length - 1];
    if (k.pointing) throw new Ve("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (k.several) {
      const y = [...new Set(k.several.map((L) => L.label))];
      throw new Ve(y.length === 1 ? k.several.length + " " + o + "s are called " + P(y[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + P(A) + ": " + be(y.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", k.several.map((L) => L.id));
    }
    const S = e.map((y) => y.label);
    throw new Ve("There is no " + o + " called " + P(A) + " here." + (S.length && S.length <= 6 ? " The " + o + "s are " + be(S.map(P)) + "." : S.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((y) => y.id));
  }, attempt: (I) => bn(e, I, n, t, r).item ?? null, rank: (I) => bn(e, I, n, t, r).rank ?? 1 / 0 };
}
const we = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map"], In = ["lanes", "release-plan", "customer-interviews", "experiment-budget"];
function tn(e) {
  return e.lanes[0]?.station ? "map" : e.kind === "release-plan" ? "release-plan" : Ee(e) ?? "lanes";
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
  lines: "Lines join the cards of a lane workshop to notes and to each other. This board keeps the cards it came with."
}, ee = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), V = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), re = (e) => ({ type: "ref", of: "card", about: e }), vn = (e) => ({ map: e }), fe = { lanes: W.notMap, "release-plan": W.notMap, "customer-interviews": W.notMap, "experiment-budget": W.notMap }, Fn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ee(120, "The new name, 1 to 120 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: V("The lane or step."), label: ee(80, "The new name, 1 to 80 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: re("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card." } },
    boards: we,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ee(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: V("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: V("The lane or step it starts in."),
      label: ee(80, "What the card says. Left out, the card is empty (on a map, the token is numbered).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." }
    },
    boards: ["lanes", "experiment-budget", "map"],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: re("The card or token.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: re("The card or token."), lane: V("Where it goes.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: re("The token.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: V("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: we,
    refusals: {}
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: re("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: In,
    refusals: vn(W.mapCardLanes)
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: re("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { lanes: W.notPoints, "customer-interviews": W.notPoints, "experiment-budget": W.notPoints, map: W.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: re("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { lanes: W.notDepends, "customer-interviews": W.notDepends, "experiment-budget": W.notDepends, map: W.notDepends }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: re("The card."),
      lane: V("The lane."),
      whenPresent: ee(160, "What it says when the card is there."),
      whenAbsent: ee(160, "What it says otherwise."),
      label: ee(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: In,
    refusals: vn(W.mapOutcome)
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: re("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: In,
    refusals: vn(W.mapOutcome)
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
    fields: { lane: V("The lane or step."), before: V("Present it just before this one.", !0), after: V("Present it just after this one.", !0) },
    boards: we,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: V("The step it follows."), label: ee(80, "The new step’s name."), outcome: ee(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: V("The step it goes in front of."),
      from: V("Only the path from this step is taken over.", !0),
      label: ee(80, "The new step’s name."),
      outcome: ee(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: V("Where the path starts."), to: V("Where it leads.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: V("Where the path starts."), to: V("Where it leads.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: V("The step."), outcome: ee(160, "What it says.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: V("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: V("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: V("The step."), alt: ee(240, "What the picture shows.") },
    boards: ["map"],
    refusals: fe
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: re("The card the line starts at."), to: re("The card it points to."), label: ee(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: Je()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: re("One card."), to: re("The other card.") },
    boards: ["lanes"],
    refusals: Je()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: re("The card."),
      note: ee(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: ee(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: Je()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: re("The card."), note: ee(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: Je()
  }
];
function Je() {
  return { "release-plan": W.lines, "customer-interviews": W.lines, "experiment-budget": W.lines, map: W.lines };
}
const so = new Map(Fn.map((e) => [e.kind, e])), ao = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function lo(e, n) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, t = (r, l) => l ? { anyOf: [r, { type: "null" }] } : r;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: e.min ?? 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...t({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...t({ type: "integer", minimum: e.min, maximum: ao(e.max, n) }, e.nullable), description: e.about };
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
const It = (e) => "optional" in e && e.optional === !0;
function sr(e) {
  const n = e ? tn(Z(e)) : void 0;
  return Fn.map((o) => {
    const t = Object.entries(o.fields), r = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, u]) => !It(u)).map(([u]) => u)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([u, w]) => [u, lo(w, n)])) }
    }, l = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: r };
    return n && (l.accepted = o.boards.includes(n), l.accepted || (l.refusal = o.refusals[n])), l;
  });
}
const Ze = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?",
  card: "cards?|features?|notes?|items?|tasks?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function co(e, n) {
  const o = !!e.lanes[0]?.station, t = $n(e.lanes, o ? Ze.step : Ze.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), r = $n(e.cards, o ? Ze.token : Ze.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: r };
  const l = (u) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(u.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (u) => l(u) ?? r.find(u),
    attempt: (u) => l(u) ?? r.attempt(u),
    rank: (u) => l(u) ? 0 : r.rank(u)
  } };
}
class _ {
  constructor(n, o, t = null, r, l) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = r, this.candidates = l;
  }
}
function on(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function G(e, n, o = null, t) {
  try {
    return Z(e);
  } catch (r) {
    throw new _(on(r instanceof Error ? r.message : String(r), n), "refused", o, t);
  }
}
function fo(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, r] of Object.entries(n.fields)) {
    const l = e[t];
    if (l === void 0) {
      if (It(r)) continue;
      return n.kind + " needs " + t + ".";
    }
    const u = n.kind + " needs " + t + " as ";
    switch (r.type) {
      case "text":
        if (typeof l != "string") return u + "text.";
        break;
      case "ref":
        if (!o(l)) return u + "an id or a name.";
        break;
      case "refs":
        if (l === null && r.nullable) break;
        if (!Array.isArray(l) || l.length > r.max || !l.every(o)) return u + "a list of up to " + r.max + " ids or names" + (r.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (l === null && r.nullable) break;
        if (typeof l != "number" || !Number.isFinite(l)) return u + "a number" + (r.nullable ? " or null." : ".");
        break;
      case "image":
        if (l === null) break;
        if (!l || typeof l != "object" || typeof l.src != "string" || typeof l.alt != "string" || Object.keys(l).some((w) => w !== "src" && w !== "alt")) return u + "{src, alt} or null.";
        break;
      case "choice":
        if (!r.values.includes(l)) return u + r.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function uo(e, n, o, t) {
  const r = structuredClone(e), l = o === "map", u = o === "release-plan", w = co(r, t), I = { lane: l ? "step" : "lane", card: l ? "token" : "card" };
  function k(i, m, x, C, $ = null) {
    if (typeof x == "object") {
      const M = i.find((q) => q.id === x.id);
      if (!M) throw new _("That " + C + " is no longer on the workshop.", "gone", $);
      return M;
    }
    const O = i.find((M) => M.id === x);
    if (O) return O;
    try {
      return m.find(x);
    } catch (M) {
      if (!(M instanceof Ve)) throw M;
      const q = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new _(M.message, q, $, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const v = (i, m = null) => k(r.lanes, w.lanes, i, "lane", m), A = (i, m = null) => k(r.cards, w.cards, i, "card", m), S = (i) => {
    try {
      return v(i);
    } catch {
      return null;
    }
  }, y = (i, m, x = {}, C = !0) => ({ board: i, said: m, changed: C, ...x }), L = (i) => r.cards.filter((m) => m.laneId === i).length, R = (i) => l ? "The presentation opens with " + P(i[0].label) + "." : "The presentation now runs " + i.map((m) => P(m.label)).join(", then ") + ".";
  switch (n.kind) {
    case "rename_workshop": {
      r.title = n.title;
      const i = G(r, o);
      return y(i, "Renamed the " + (l ? "map" : "workshop") + " to " + P(i.title) + ".");
    }
    case "rename_lane": {
      const i = v(n.lane), m = i.label;
      i.label = n.label;
      const x = G(r, o, i.id);
      return y(x, "Renamed " + P(m) + " to " + P(x.lanes.find((C) => C.id === i.id).label) + ".", { laneId: i.id });
    }
    case "rename_card": {
      const i = A(n.card), m = i.label;
      i.label = n.label;
      const x = G(r, o, i.laneId, i.id);
      return y(x, "Renamed " + P(m) + " to " + P(x.cards.find((C) => C.id === i.id).label) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "add_lane": {
      if (r.lanes.length >= 5) throw new _("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new _("A lane can hold from 1 to 24 cards.", "refused");
      let i;
      try {
        i = Wo(r, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new _(on(x.message, o), "refused");
      }
      const m = i.lanes[i.lanes.length - 1];
      return y(i, "Added the lane " + P(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const i = v(n.lane), m = r.cards.filter((x) => x.laneId === i.id);
      if (l) {
        if (m.length) throw new _(P(m[0].label) + " is at " + P(i.label) + ". Move it to another step first.", "refused", i.id);
        if (r.lanes.length <= 2) throw new _("A map needs at least two steps.", "refused", i.id);
      } else {
        if (m.length) throw new _(P(i.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", i.id);
        if (r.lanes.length <= 2) throw new _("A workshop needs at least two lanes.", "refused", i.id);
      }
      r.lanes = r.lanes.filter((x) => x !== i);
      for (const x of r.lanes) x.station && (x.station.next = x.station.next.filter((C) => C !== i.id));
      r.presentationOrder && (r.presentationOrder = r.presentationOrder.filter((x) => x !== i.id));
      for (const x of r.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((C) => C !== i.id));
      return Ye(r, (x) => x.laneId === i.id), y(G(r, o), "Removed the " + I.lane + " " + P(i.label) + ".", { laneId: i.id });
    }
    case "add_card": {
      const i = v(n.lane);
      if (l) {
        if (n.allowedLanes !== void 0) throw new _(W.mapCardLanes, "not_on_this_board", i.id);
        let $ = n.label;
        if ($ === void 0) {
          let N = r.cards.length + 1;
          for (; r.cards.some((j) => j.label === "Token " + N); ) N++;
          $ = "Token " + N;
        }
        const O = new Set([...r.lanes, ...r.cards].map((N) => N.id));
        let M = 1;
        for (; O.has("token-" + M); ) M++;
        r.cards.push({ id: "token-" + M, label: $, laneId: i.id });
        const q = G(r, o, i.id);
        return y(q, "Added " + P(q.cards[q.cards.length - 1].label) + " at " + P(i.label) + ".", { laneId: i.id, cardId: "token-" + M });
      }
      if (r.cards.length >= 24) throw new _("A workshop can have up to 24 cards. Remove one first.", "refused", i.id);
      if (i.capacity !== void 0 && L(i.id) >= i.capacity)
        throw new _(P(i.label) + " is full: it holds " + i.capacity + (i.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", i.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => v($).id))];
      let x;
      try {
        x = zo(r, i.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch ($) {
        throw new _(on($.message, o), "refused", i.id);
      }
      const C = x.cards[x.cards.length - 1];
      return y(x, "Added " + (C.label ? P(C.label) : "an empty card") + " to " + P(i.label) + ".", { laneId: i.id, cardId: C.id });
    }
    case "remove_card": {
      const i = A(n.card);
      if (l && r.cards.length === 1) throw new _("A map needs at least one token.", "refused", i.laneId, i.id);
      if (u && r.cards.length === 1) throw new _("A release plan needs at least one feature.", "refused", i.laneId, i.id);
      r.cards = r.cards.filter((m) => m !== i);
      for (const m of r.cards)
        m.dependsOn?.includes(i.id) && (m.dependsOn = m.dependsOn.filter((x) => x !== i.id), m.dependsOn.length || delete m.dependsOn);
      return Ye(r, (m) => m.cardId === i.id), y(G(Mo(r, i.id), o, i.laneId), "Removed the " + I.card + " " + P(i.label) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "move_card": {
      const i = typeof n.lane == "object" ? r.lanes.find((C) => C.id === n.lane.id) ?? null : S(n.lane), m = A(n.card, i?.id ?? null), x = v(n.lane, m.laneId);
      return J(m, x);
    }
    case "advance_card": {
      const i = A(n.card), m = r.lanes.find((C) => C.id === i.laneId), x = m.station.next.map((C) => r.lanes.find(($) => $.id === C)).filter((C) => !!C);
      if (!x.length) throw new _(P(i.label) + " is at " + P(m.label) + ", and no path leads on from there.", "refused", m.id, i.id);
      if (x.length > 1)
        throw new _("From " + P(m.label) + " the path goes to " + x.map((C) => P(C.label)).join(" or ") + ". Say which, such as “Move " + i.label + " to " + x[0].label + "”.", "refused", m.id, i.id);
      return J(i, x[0]);
    }
    case "set_lane_capacity": {
      const i = v(n.lane), m = l ? "token" : u ? "point" : "card";
      if (n.capacity === null)
        return delete i.capacity, y(G(r, o, i.id), l ? "Removed the limit at " + P(i.label) + "." : P(i.label) + " now holds any number of " + m + "s.", { laneId: i.id });
      const x = u ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > x)
        throw new _((l ? "A step" : "A lane") + " can hold from 1 to " + x + " " + m + "s.", "refused", i.id);
      const C = u ? r.cards.reduce(($, O) => $ + (O.laneId === i.id ? O.points ?? 1 : 0), 0) : L(i.id);
      if (C > n.capacity)
        throw new _(P(i.label) + " already holds " + C + " " + m + (C === 1 ? "" : "s") + ". Move some " + (l ? "on" : "out") + " first, or choose a higher " + (u ? "budget" : "number") + ".", "refused", i.id);
      return i.capacity = n.capacity, y(G(r, o, i.id), P(i.label) + " now holds up to " + n.capacity + " " + m + (n.capacity === 1 ? "" : "s") + ".", { laneId: i.id });
    }
    case "set_card_lanes": {
      const i = A(n.card);
      if (n.lanes === null)
        return delete i.allowedLaneIds, y(G(r, o, i.laneId, i.id), P(i.label) + " can now go in any lane.", { laneId: i.laneId, cardId: i.id });
      const m = [...new Set(n.lanes.map((C) => v(C)))], x = r.lanes.find((C) => C.id === i.laneId);
      if (!m.includes(x)) throw new _(P(i.label) + " is in " + P(x.label) + " now. Include " + P(x.label) + ", or move the card first.", "refused", x.id, i.id);
      return i.allowedLaneIds = m.map((C) => C.id), y(G(r, o, i.laneId, i.id), P(i.label) + " can now go only in " + be(m.map((C) => P(C.label))) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "set_card_points": {
      const i = A(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new _("A feature takes from 1 to 24 points.", "refused", i.laneId, i.id);
      return i.points = n.points, y(G(r, o, i.laneId, i.id), P(i.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: i.laneId, cardId: i.id });
    }
    case "set_card_dependencies": {
      const i = A(n.card), m = [...new Set(n.dependsOn.map((C) => A(C)))], x = { laneId: i.laneId, cardId: i.id };
      if (n.mode === "remove") {
        const C = m.filter(($) => i.dependsOn?.includes($.id));
        if (!C.length) throw new _(P(i.label) + " does not depend on " + be(m.map(($) => P($.label))) + ".", "refused", i.laneId, i.id);
        return i.dependsOn = i.dependsOn.filter(($) => !C.some((O) => O.id === $)), i.dependsOn.length || delete i.dependsOn, y(G(r, o, i.laneId, i.id), P(i.label) + " no longer depends on " + be(C.map(($) => P($.label))) + ".", x);
      }
      if (!m.length) {
        if (n.mode === "add") throw new _("Name the features " + P(i.label) + " depends on.", "refused", i.laneId, i.id);
        return delete i.dependsOn, y(G(r, o, i.laneId, i.id), P(i.label) + " no longer depends on anything.", x);
      }
      if (m.includes(i)) throw new _("A feature can’t depend on itself.", "refused", i.laneId, i.id);
      return i.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? i.dependsOn ?? [] : [], ...m.map((C) => C.id)])], y(G(r, o, i.laneId, i.id), P(i.label) + " now depends on " + be(m.map((C) => P(C.label))) + ".", x);
    }
    case "set_outcome": {
      const i = A(n.card), m = v(n.lane), x = r.signals ?? (r.signals = []), C = n.label, $ = C === void 0 ? x.filter((N) => N.cardId === i.id && N.laneId === m.id) : x.filter((N) => N.cardId === i.id && N.label.toLowerCase() === C.toLowerCase());
      if (C !== void 0 && $.length > 1) throw new _("Two outcomes on this card have that name.", "refused", m.id, i.id);
      if (!$.length && x.length >= 24) throw new _("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, i.id);
      let O = 1;
      for (; x.some((N) => N.id === "signal-" + O); ) O++;
      const q = { label: C ?? $[0]?.label ?? (i.label + " in " + m.label).slice(0, 80).trim(), cardId: i.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], q) : x.push({ id: "signal-" + O, ...q }), y(G(r, o, m.id, i.id), "When " + P(i.label) + " is in " + P(m.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: m.id, cardId: i.id });
    }
    case "remove_outcome": {
      const i = A(n.card), m = (r.signals ?? []).filter((x) => x.cardId === i.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new _(P(i.label) + " has no outcome to remove.", "refused", i.laneId, i.id);
        Ye(r, (x) => x.cardId === i.id);
      } else {
        const x = k(m, $n(m, "outcomes?", "outcome"), n.outcome, "outcome", i.laneId);
        Ye(r, (C) => C.id === x.id);
      }
      return y(G(r, o, i.laneId, i.id), "Removed the outcome from " + P(i.label) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "set_presentation_order": {
      const i = n.lanes.map((m) => v(m));
      if (i.length !== r.lanes.length || new Set(i).size !== r.lanes.length) throw new _("Include each scene once in the presentation order.", "refused");
      return r.presentationOrder = i.map((m) => m.id), y(G(r, o), R(i));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new _("Say before or after, not both.", "invalid_edit");
      const i = v(n.lane), m = n.before ?? n.after, x = m === void 0 ? void 0 : v(m);
      if (x && x.id === i.id) throw new _("Choose two different scenes.", "refused", i.id);
      const C = Dn(r).filter(($) => $.id !== i.id);
      return C.splice(x ? C.findIndex(($) => $.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, i), r.presentationOrder = C.map(($) => $.id), y(G(r, o, i.id), R(C), { laneId: i.id });
    }
    case "add_station": {
      const i = v(n.from);
      let m;
      try {
        m = pt(r, i.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (C) {
        throw new _(C.message, "refused", i.id);
      }
      const x = m.lanes[m.lanes.length - 1];
      return y(m, "Added a path from " + P(i.label) + " to " + P(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const i = v(n.before), m = n.from === void 0 ? void 0 : v(n.from), x = m ? [m] : r.lanes.filter((O) => O.station.next.includes(i.id));
      if (m && !m.station.next.includes(i.id))
        throw new _("There is no path from " + P(m.label) + " to " + P(i.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!x.length) throw new _("Nothing leads to " + P(i.label) + " yet. Try “Add " + n.label + " after " + i.label + "”.", "refused", i.id);
      let C;
      try {
        C = pt(r, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (O) {
        throw new _(O.message, "refused", i.id);
      }
      const $ = C.lanes[C.lanes.length - 1];
      for (const O of C.lanes)
        x.some((M) => M.id === O.id) && (O.station.next = [...new Set(O.station.next.map((M) => M === i.id ? $.id : M))]);
      return $.station.next = [i.id], y(G(C, o, $.id), "Added " + P($.label) + " before " + P(i.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const i = v(n.from), m = v(n.to);
      if (i.id === m.id) throw new _("Connect two different steps.", "refused", i.id);
      return i.station.next.includes(m.id) ? y(r, P(i.label) + " already leads to " + P(m.label) + ".", { laneId: i.id }, !1) : (i.station.next.push(m.id), y(G(r, o, i.id), "Connected " + P(i.label) + " to " + P(m.label) + ".", { laneId: i.id }));
    }
    case "disconnect_stations": {
      const i = v(n.from), m = v(n.to);
      if (!i.station.next.includes(m.id)) throw new _("There is no path between " + P(i.label) + " and " + P(m.label) + ".", "refused", i.id);
      return i.station.next = i.station.next.filter((x) => x !== m.id), y(G(r, o, i.id), "Removed the path from " + P(i.label) + " to " + P(m.label) + ".", { laneId: i.id });
    }
    case "set_station_outcome": {
      const i = v(n.station);
      return i.station.outcome = n.outcome, y(G(r, o, i.id), "Changed what happens at " + P(i.label) + ".", { laneId: i.id });
    }
    case "set_station_position": {
      const i = v(n.station);
      return Object.assign(i.station, { column: n.column, row: n.row }), y(G(r, o, i.id), "Moved " + P(i.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: i.id });
    }
    case "set_station_image": {
      const i = v(n.station);
      return n.image === null ? (delete i.station.image, y(G(r, o, i.id), "Removed the image at " + P(i.label) + ".", { laneId: i.id })) : (i.station.image = { src: n.image.src, alt: n.image.alt }, y(G(r, o, i.id), "Updated the image at " + P(i.label) + ".", { laneId: i.id }));
    }
    case "set_station_image_alt": {
      const i = v(n.station);
      if (!i.station.image) throw new _("Add a station image before changing its description.", "refused", i.id);
      return i.station.image.alt = n.alt, y(G(r, o, i.id), "Updated the image description at " + P(i.label) + ".", { laneId: i.id });
    }
    case "connect_cards":
    case "connect_note": {
      const i = A(n.card);
      let m = i.id, x, C;
      if (n.kind === "connect_cards") {
        const N = A(n.to, i.laneId);
        if (N.id === i.id) throw new _("A line joins two different cards.", "refused", i.laneId, i.id);
        x = N.id, C = P(N.label);
      } else {
        const N = n.note.trim();
        if (r.cards.some((j) => j.id === N) || r.lanes.some((j) => j.id === N))
          throw new _("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", i.laneId, i.id);
        x = N, C = "the note " + N, n.direction === "from_note" && ([m, x] = [x, m]);
      }
      const $ = Nt(r, m, x, n.label ? { label: n.label } : {}), O = an(r, $);
      if (O) throw new _(O, "refused", i.laneId, i.id);
      const M = en(r, $), q = m === i.id;
      return y(
        M,
        q ? "Drew a line from " + P(i.label) + " to " + C + "." : "Drew a line from " + C + " to " + P(i.label) + ".",
        { laneId: i.laneId, cardId: i.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const i = A(n.card), m = n.kind === "disconnect_cards" ? A(n.to, i.laneId).id : n.note.trim(), x = n.kind === "disconnect_cards" ? P(r.cards.find((O) => O.id === m).label) : "the note " + m, C = (O) => O.parentId === i.id && O.childId === m || O.parentId === m && O.childId === i.id, $ = r.lines ?? [];
      return $.some(C) ? (r.lines = $.filter((O) => !C(O)), y(G(r, o, i.laneId, i.id), "Took away the line between " + P(i.label) + " and " + x + ".", { laneId: i.laneId, cardId: i.id })) : y(e, P(i.label) + " and " + x + " are not joined by a line.", { laneId: i.laneId, cardId: i.id }, !1);
    }
  }
  function J(i, m) {
    const x = { laneId: m.id, cardId: i.id };
    if (i.laneId === m.id)
      return y(e, P(i.label) + " is already " + (l ? "at " : "in ") + P(m.label) + ".", x, !1);
    const C = $e(e, i.id, m.id);
    if (!C) throw new _(Qe(e, i.id, m.id) ?? "That move is not available.", "refused", m.id, i.id);
    return y(G(C, o, m.id, i.id), "Moved " + P(i.label) + " to " + P(m.label) + ".", x);
  }
}
function Ye(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function ho(e, n, o = {}) {
  const t = (k) => ({ refused: { index: 0, kind: null, laneId: null, ...k } });
  let r;
  try {
    r = Z(e);
  } catch (k) {
    return t({ reason: "The workshop cannot be read: " + (k instanceof Error ? k.message : String(k)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const l = r, u = [];
  for (const [k, v] of n.entries()) {
    const A = v?.kind, S = typeof A == "string" ? so.get(A) : void 0;
    if (!v || typeof v != "object" || !S)
      return t({
        index: k,
        kind: typeof A == "string" ? A : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(A)) + ". The edits are " + be(Fn.map((i) => i.kind)) + "."
      });
    const y = fo(v, S);
    if (y) return t({ index: k, kind: S.kind, code: "invalid_edit", reason: y });
    const L = tn(r);
    if (!S.boards.includes(L))
      return t({ index: k, kind: S.kind, code: "not_on_this_board", reason: S.refusals[L] ?? "This workshop does not take " + S.kind + "." });
    let R;
    try {
      R = uo(r, v, L, o.selection);
    } catch (i) {
      if (!(i instanceof _)) throw i;
      return t({
        index: k,
        kind: S.kind,
        reason: i.reason,
        code: i.code,
        laneId: i.laneId,
        ...i.cardId && { cardId: i.cardId },
        ...i.candidates && { candidates: i.candidates }
      });
    }
    const J = mo(r, R.board);
    if (J) return t({ index: k, kind: S.kind, reason: J, code: "not_on_this_board", laneId: R.laneId ?? null });
    r = R.board, u.push({
      index: k,
      kind: S.kind,
      said: R.said,
      changed: R.changed ?? !0,
      ...R.laneId && { laneId: R.laneId },
      ...R.cardId && { cardId: R.cardId }
    });
  }
  const w = new Map(l.cards.map((k) => [k.id, k.laneId])), I = r.cards.flatMap((k) => {
    const v = w.get(k.id);
    return v === void 0 || v === k.laneId ? [] : [{ cardId: k.id, fromLaneId: v, toLaneId: k.laneId }];
  });
  return { workshop: r, report: { edits: u, movedCards: I } };
}
const po = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map"
};
function mo(e, n) {
  const o = Z(e), t = tn(o);
  let r;
  try {
    r = Z(n);
  } catch (I) {
    return on(I instanceof Error ? I.message : String(I), t);
  }
  const l = tn(r), u = (I, k) => I.lanes.length === k.lanes.length && I.lanes.every((v) => k.lanes.some((A) => A.id === v.id)), w = (I, k) => I.lanes.every((v, A) => k.lanes[A]?.id === v.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && l !== t)
    return u(o, r) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !w(o, r)) return W.keepsOrder;
  if (t === "release-plan" && l === "release-plan") {
    if (!u(o, r)) return W.releaseLanes;
    if (!w(o, r)) return W.releaseOrder;
    if (r.cards.some((I) => !o.cards.some((k) => k.id === I.id))) return W.releaseCards;
  }
  return t !== l ? "This slate holds a " + po[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
function wo(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = ko(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), yo(n), n;
}
function go(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function yo(e) {
  return e && go(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function st(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function xn(e) {
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
function ko(e) {
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
function An() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const at = "#1f7a5c", lt = "#5b9a85", Cn = "#c2410c", bo = "#2f5fd0", Io = { canMove: !1, canSelect: !1 };
function vo(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ar(e, n, o = {}) {
  let t = Z(n), r = null, l = !!o.readOnly, u = !1;
  const w = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  let S = null, y = null, L = null;
  const R = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
  let i = null, m = Promise.resolve(), x = null, C = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const $ = { ...o.style };
  let O = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), q = null, N = !1;
  const j = /* @__PURE__ */ new Map();
  de(t, { layout: C });
  const U = o.origin ? { x: o.origin.x, y: o.origin.y } : Ao(e), Fe = (s) => A.get(s) ?? s, ne = (s) => vo(Fe(s));
  function X(s) {
    const a = v.get(s);
    if (a) return a;
    if (w.has(s) && !A.has(s) || !e.nodes.one?.(s)) return s;
    const d = Wt(s, (c) => !!e.nodes.one?.(c) || A.has(c));
    return v.set(s, d), A.set(d, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const ae = {
    governs(s) {
      if (w.get(s.id) !== s) return null;
      const a = ne(s.id)?.kind;
      return a === "card" ? { canMove: !l, canEditText: !l && !r && t.kind !== "release-plan", canConnect: Ne() } : a === "lane" ? { canMove: !1, canEditText: !l && !r } : Io;
    },
    onStart(s, a) {
      const d = ne(s.id).key;
      if (l || r || !t.cards.some((f) => f.id === d)) return !1;
      te(), ve();
      const c = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      let b = null;
      try {
        b = o.chooseCandidate?.(t, d, c) ?? null;
      } catch (f) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", f);
      }
      return S = { cardId: d, evaluate: b, outcome: { kind: "home" } }, z(t, { skip: d }), !0;
    },
    onMove(s, a) {
      if (!S) return;
      const d = Un(S.cardId, a, S.evaluate);
      if (xo(d, S.outcome)) return;
      S.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      z(c ?? t, { skip: S.cardId }), B(o.onPreview, c);
    },
    onEnd(s, a) {
      if (!S) return { accept: !1 };
      const { cardId: d, evaluate: c } = S, b = Un(d, a, c), f = t.cards.find((p) => p.id === d);
      if (S = null, B(o.onPreview, null), b.kind === "candidate") {
        t = b.next, z(t, { skip: d });
        const p = t.lanes.find((g) => g.id === b.laneId);
        e.announce?.(`${Y(f)} moved to ${p.label}. ${he(t, p.id)}.`), B(o.onChange, t, { cardId: d, laneId: b.laneId });
        const h = Qt(t, Fe(s.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (b.kind === "refused")
        Yt(Y(f), { cardId: d, laneId: b.laneId, reason: b.reason });
      else if (b.kind === "outside" && We(t) && !De()) {
        const p = Xe(t, d);
        if (!p)
          return yn(d, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        z(t, { skip: d }), e.announce?.(p), B(o.onRefuse, { cardId: d, laneId: null, reason: p });
      } else
        z(t, { skip: d }), b.kind === "outside" && (e.announce?.(`${Y(f)} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      const a = S && t.cards.find((d) => d.id === S.cardId);
      S = null, B(o.onPreview, null), z(t, { skip: ne(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Y(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const c = ne(s.id);
      if (!c || l || r) return !1;
      const b = a.replace(/\s+/g, " ").trim(), f = c.kind === "lane" ? { laneId: c.key, label: b } : { cardId: c.key, label: b }, p = ho(t, [c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: b } : { kind: "rename_card", card: { id: c.key }, label: b }]);
      if ("refused" in p) {
        const { reason: h } = p.refused;
        return e.announce?.(`${d} keeps its name. ${h}`), B(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: f, reason: h }), !1;
      }
      return b === d ? !1 : (t = p.workshop, z(t), e.announce?.(`${d} renamed to ${b}.`), B(o.onChange, t, { rename: f }), b);
    },
    onKeyDown(s, a) {
      const d = ne(s.id);
      if (d?.kind !== "card" || l || r || S || a.ctrlKey || a.metaKey || a.altKey) return !1;
      const c = t.cards.find((b) => b.id === d.key);
      if (!c) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Gn(c.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && jt())
        return a.preventDefault(), Gn(c.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (y?.cardId !== c.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: b, next: f, spot: p } = y;
        if (y = null, b === null)
          return B(o.onPreview, null), yn(c.id, p), !0;
        t = f, z(t), ke(b), B(o.onPreview, null);
        const h = t.lanes.find((g) => g.id === b);
        return e.announce?.(`${Y(c)} moved to ${h.label}. ${he(t, b)}.`), B(o.onChange, t, { cardId: c.id, laneId: b }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), ve(), e.announce?.(`Move cancelled. ${Y(c)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => w.get(a.id) === a).map((a) => a.id);
      N = s.length === 1, w.clear(), I.clear(), k.clear(), j.clear(), v.clear(), A.clear(), S = null, y = null, z(r ?? t, { animate: !1 }), s.length === 1 && (m = m.then(() => {
        N = !1;
        const a = w.get(s[0]);
        if (!u && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        hn();
      }));
    }
  };
  ae.onFreeMove = (s, a) => {
    if (!He() || s.options?.isComment) return pn();
    const d = Be(a), c = Ue(s), b = t.lanes.filter((p) => !Oe(s) && Se(t, p.id, c) === null).map((p) => p.id), f = d ? Oe(s) ?? Se(t, d, c) : null;
    L && L.noteId === s.id && L.laneId === d && L.refusal === f || (L = { noteId: s.id, laneId: d, refusal: f, open: b }, pe());
  }, ae.onFreeDrop = (s, a, d) => {
    if (pn(), !He() || s.options?.isComment) return;
    const c = Be(a);
    if (!c) return;
    const b = Ue(s), f = t.lanes.find((h) => h.id === c), p = Oe(s) ?? Se(t, c, b);
    return p ? (te(!1), i = { laneId: c, reason: p, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${mn(b.label)} can't go in ${f.label}. ${p}`), B(o.onRefuse, { noteId: s.id, laneId: c, reason: p }), "refused") : (gn([{ node: s, offer: b, from: d }], c), "taken");
  }, ae.onFreeGroupDrop = (s, a, d) => {
    if (pn(), !He() || s.some((h) => h.options?.isComment)) return;
    const c = Be(a);
    if (!c) return;
    const b = t.lanes.find((h) => h.id === c), f = s.map((h) => ({ node: h, offer: Ue(h) })), p = Bt(f, c);
    if (p) {
      te(!1), i = { laneId: c, reason: p, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${qn(f.map((h) => mn(h.offer.label)))} can't go in ${b.label}. ${p}`);
      for (const { node: h } of f) B(o.onRefuse, { noteId: h.id, laneId: c, reason: p });
      return "refused";
    }
    return gn(f.map((h, g) => ({ ...h, from: d?.[g] })), c), "taken";
  }, ae.onFreeTextCommit = (s) => {
    if (!He() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = Be({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = Ue(s), b = t.lanes.find((E) => E.id === d), f = Oe(s) ?? Se(t, d, c);
    if (!f) {
      gn([{ node: s, offer: c }], d);
      return;
    }
    te(!1), i = { laneId: d, reason: f, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${mn(c.label)} can't go in ${b.label}. ${f} It is beside the board.`), B(o.onRefuse, { noteId: s.id, laneId: d, reason: f });
    const { width: p } = de(t, { layout: C }), h = Math.round(U.x + p + 32), g = Math.round(a.y ?? U.y);
    s.position(h, g, () => e.updateSelectionResizeRotate?.(), void 0, An() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [st({ ...s.options, x: h, y: g })] });
  }, ae.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...R], lines: (t.lines ?? []).map((s) => ({ ...s })) }), ae.onUndoRestore = (s, a) => {
    if (u) return;
    const d = new Map((s?.cards ?? []).map((f) => [f.id, f])), c = new Map(s?.pairs ?? []), b = (f) => R.get(f) ?? c.get(f) ?? f;
    for (const f of a.added) {
      const p = b(f), h = t.cards.find((E) => E.id === p);
      if (!h) continue;
      t = Z({ ...t, cards: t.cards.filter((E) => E !== h), lines: Ce(t.lines, p, f) }), z(t);
      const g = B(o.onChange, t, { cardId: p, cardToNote: { noteId: f } });
      e.holdTrade?.(f, g), Sn(g);
    }
    for (const f of a.removed) {
      const p = b(f), h = d.get(p);
      if (!h || t.cards.some((K) => K.id === p)) continue;
      const g = (s?.lines ?? []).filter((K) => K.parentId === p || K.childId === p), E = {
        id: p,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...g.length ? { lines: g } : {}
      }, T = [h.laneId, ...t.lanes.map((K) => K.id)].find((K) => Me(t, K, E));
      if (!T) {
        e.announce?.(`${Y(h)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Jt(Me(t, T, E), p, s?.cards ?? []), p !== f && R.set(f, p), z(t);
      const F = t.cards.findIndex((K) => K.id === p), H = t.cards.slice(F + 1).find((K) => K.laneId === T)?.id, D = B(o.onChange, t, { cardId: p, laneId: T, noteToCard: {
        noteId: f,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...H ? { before: H } : {},
        ...g.length ? { lines: Ce(g, p, f) } : {}
      } });
      e.holdTrade?.(f, D), Sn(D);
    }
    Array.isArray(s?.lines) && Kt(s.lines);
  };
  let se = !1;
  ae.onNodeAdded = (s) => {
    u || se || w.get(s.id) === s || (t.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (se = !0, queueMicrotask(() => {
      se = !1, u || pe();
    }));
  }, ae.onLine = (s, a) => {
    u || queueMicrotask(() => {
      u || Gt(s, a);
    });
  };
  const je = e.setDragPolicy(ae), Ft = o.onSelect && e.onSelectionChange?.(() => hn()), Bn = () => {
    y && ve();
  };
  e.element?.addEventListener?.("pointerdown", Bn, !0), z(t, { animate: !1 });
  function Un(s, a, d) {
    const c = t.cards.find((T) => T.id === s);
    if (!c) return { kind: "outside" };
    const b = t.lanes.map((T) => w.get(X(ie.column(T.id)))).filter(Boolean), f = e.hitTestNodes(a, b, { padding: 6 }), p = f ? ne(f.id).key : null;
    if (!p) return { kind: "outside" };
    if (p === c.laneId) return { kind: "home" };
    const h = $e(t, s, p);
    if (!h) return { kind: "refused", laneId: p, reason: Qe(t, s, p) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: p, next: h };
    let g = null;
    try {
      g = d({ x: a.x - U.x, y: a.y - U.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: p, next: h };
    }
    const E = g?.cards.find((T) => T.id === s)?.laneId;
    return !g || !E || E === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: E, next: g };
  }
  function jt() {
    return new Set(de(t, { layout: C }).places.map((s) => s.row)).size > 1;
  }
  function Gn(s, a, d = !1) {
    const c = t.cards.find((T) => T.id === s), b = ct(t, s), f = y?.cardId === s && y.laneId === null ? y.side : void 0;
    if (f !== void 0) {
      if (d || a === f) return;
      const T = f > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (ve(), T.id === c.laneId) {
        ke(T.id, r ?? t), e.announce?.(`${Y(c)} is back in ${T.label}.`);
        return;
      }
      if (b.includes(T)) {
        const H = $e(t, s, T.id);
        y = { cardId: s, laneId: T.id, next: H }, z(H), ke(T.id, H), B(o.onPreview, H), e.announce?.(`${Y(c)} to ${T.label}: ${he(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const F = Qe(t, s, T.id) ?? "That move is not available.";
      te(), i = { laneId: T.id, reason: F, timer: setTimeout(() => te(), 1500) }, z(r ?? t), ke(T.id, r ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${F}`), B(o.onRefuse, { cardId: s, laneId: T.id, reason: F });
      return;
    }
    const p = y?.cardId === s ? y.laneId : c.laneId;
    let h;
    if (d) {
      const { places: T } = de(t, { layout: C }), F = T.find((H) => H.laneId === p);
      h = T.filter((H) => H.column === F.column && (H.row - F.row) * a > 0).sort((H, D) => (H.row - D.row) * a).map((H) => t.lanes.find((D) => D.id === H.laneId));
    } else {
      const T = t.lanes.findIndex((F) => F.id === p);
      h = a > 0 ? t.lanes.slice(T + 1) : t.lanes.slice(0, T).reverse();
    }
    const g = h.find((T) => b.includes(T));
    if (te(), !g) {
      const T = h[0];
      if (!T) {
        if (!d && We(t)) {
          const H = Xe(t, s);
          if (H) {
            e.announce?.(H), B(o.onRefuse, { cardId: s, laneId: null, reason: H });
            return;
          }
          Dt(c, a);
          return;
        }
        e.announce?.(`${Y(c)} has no lane to move to on that side.`);
        return;
      }
      const F = Qe(t, s, T.id) ?? "That move is not available.";
      i = { laneId: T.id, reason: F, timer: setTimeout(() => te(), 1500) }, z(y?.next ?? r ?? t), ke(T.id, y?.next ?? r ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${F}`), B(o.onRefuse, { cardId: s, laneId: T.id, reason: F });
      return;
    }
    if (g.id === c.laneId) {
      ve(), ke(g.id, r ?? t), e.announce?.(`${Y(c)} is back in ${g.label}.`);
      return;
    }
    const E = $e(t, s, g.id);
    y = { cardId: s, laneId: g.id, next: E }, z(E), ke(g.id, E), B(o.onPreview, E), e.announce?.(`${Y(c)} to ${g.label}: ${he(E, g.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function ke(s, a = t) {
    const d = de(a, { layout: C, rows: Qn() }).places.find((g) => g.laneId === s), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const b = 16, f = (g, E, T, F) => E + b * 2 >= F || g - b < T ? g - b - T : g + E + b > T + F ? g + E + b - (T + F) : 0, p = f(U.x + d.x, d.width, c.x, c.width), h = f(U.y + d.y, d.height, c.y, c.height);
    (p || h) && e.panBy?.({ x: p, y: h });
  }
  function hn() {
    if (!o.onSelect || N) return;
    const s = u ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && w.get(s[0].id) === s[0] ? ne(s[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== q && (q = c, B(o.onSelect, d));
  }
  function ve() {
    y && (y = null, B(o.onPreview, null), z(r ?? t));
  }
  function Dt(s, a) {
    const { width: d } = de(t, { layout: C }), c = w.get(X(ie.card(s.id)))?.options, b = c?.width ?? 228, f = { x: a > 0 ? U.x + d + 32 : U.x - b - 32, y: c?.y ?? U.y }, p = ft(t, s.id);
    y = { cardId: s.id, laneId: null, side: a, spot: f, next: t }, z(t), B(o.onPreview, p), e.announce?.(`${Y(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function De() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function He() {
    return !u && !l && !r && !S && !De() && We(t);
  }
  function pn() {
    L && (L = null, u || pe());
  }
  function Be(s) {
    const a = t.lanes.map((c) => w.get(X(ie.column(c.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? ne(d.id)?.key ?? null : null;
  }
  function Ue(s) {
    const a = s.options ?? {}, d = Tt({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), b = c.replace(/\s+/g, " ").trim(), f = {};
    c.trim() !== b && c.length <= 4e3 && (f.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (f.shape = a.shape);
    for (const h of ["width", "height"]) Number.isFinite(a[h]) && a[h] >= 10 && a[h] <= 4e3 && (f[h] = Math.round(a[h]));
    if (En(a.image)) {
      f.image = { src: a.image };
      for (const [h, g] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[g]) && a[g] >= 1 && a[g] <= 2e4 && (f.image[h] = a[g]);
    }
    a.link?.data && dt({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (f.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const p = Ht(s);
    return { id: s.id, label: b, ...d ? { look: d } : {}, ...Object.keys(f).length ? { asNote: f } : {}, ...p.length ? { lines: p } : {} };
  }
  function Ht(s) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!w.get(c) && w.get(c) === e.nodes.one(c);
    for (const c of s.relationships?.getAssociations?.() ?? [])
      !c.targetPoint && !d(c.childId) && a.set(c.id, Ge(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === s || d(c.id)))
        for (const b of c.relationships?.getAssociations?.() ?? [])
          b.childId === s.id && !b.targetPoint && a.set(b.id, Ge(b));
    for (const c of ut(t, s.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function qn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function Bt(s, a) {
    for (const { node: f } of s) {
      const p = Oe(f);
      if (p) return p;
    }
    const d = t.lanes.find((f) => f.id === a), c = t.cards.filter((f) => f.laneId === a).length;
    if (d.capacity !== void 0 && c + s.length > d.capacity) {
      const f = d.capacity - c;
      return f > 0 ? `It has room for ${f} more ${f === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let b = t;
    for (const { offer: f } of s) {
      const p = Se(b, a, f);
      if (p) return p;
      b = Me(b, a, f);
    }
    return null;
  }
  function Oe(s) {
    if ((s.relationships?.getAssociations?.() ?? []).some((d) => d.targetPoint))
      return "A note with a line that ends on empty canvas stays a note. Join that line to a note first.";
    if (s.options?.image && !En(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !dt({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const mn = (s) => s || "This note", Y = (s) => s.label || "The empty card";
  function Ne() {
    return !u && !l && !r && !De() && We(t);
  }
  function Ge(s) {
    const a = { id: s.id, parentId: s.parentId, childId: s.childId };
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
      const c = s[d];
      c != null && c !== "" && (a[d] = c);
    }
    return a;
  }
  function Kn(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (w.get(s.id) === s) {
      const a = ne(s.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment ? null : s.id;
  }
  function Jn(s, a) {
    if (s.cards.some((c) => c.id === a)) {
      const c = w.get(X(ie.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && w.get(a) !== d && d.svgGroup ? d : null;
  }
  function Zn(s) {
    const a = [];
    for (const d of s) {
      const c = e.nodes.one(d.parentId), b = e.nodes.one(d.childId);
      if (!c?.relationships || !b || w.get(c.id) === c || w.get(b.id) === b || c.relationships.hasAssociationId?.(d.id)) continue;
      const f = c.relationships.addAssociation(b, xn(d));
      a.push({ type: "addRelationship", data: { ...f } });
    }
    return a;
  }
  function Ut(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      const c = Jn(s, d.parentId), b = Jn(s, d.childId);
      if (!c || !b || c === b) continue;
      const f = w.get(c.id) !== c, p = f ? b : c, h = f ? c : b, g = { ...d, parentId: p.id, childId: h.id };
      f && (g.showParentArrow = d.showChildArrow ?? !0, g.showChildArrow = d.showParentArrow ?? !1);
      const E = JSON.stringify(g);
      a.add(d.id);
      const T = j.get(d.id);
      T && T.key === E && T.holder === p && T.other === h && p.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), p.relationships.addAssociation(h, xn(g)), j.set(d.id, { holder: p, other: h, swapped: f, key: E }));
    }
    for (const [d, c] of [...j])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), j.delete(d));
  }
  function wn(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  function Gt(s, a) {
    if (s === "addRelationship") {
      if (j.get(a?.id)?.holder.id === a?.parentId) return;
      const d = e.nodes.one(a?.parentId), c = a?.targetPoint ? null : e.nodes.one(a?.childId), b = Kn(d), f = Kn(c), p = (E) => {
        wn(a), e.announce?.(E), B(o.onRefuse, { reason: E, laneId: null });
      };
      if (!Ne()) return wn(a);
      if (!b || !f) return p("A line from a card ends on a note or another card.");
      const h = Nt(t, b, f, Ge(a)), g = an(t, h);
      if (g) return p(g);
      wn(a), _e({ set: h });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...j].find(([b, f]) => (b === a?.id || !a?.id && f.other.id === a?.childId) && f.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = j.get(d);
      if (j.delete(d), e.nodes.one(c.holder.id) !== c.holder || e.nodes.one(c.other.id) !== c.other || !Ne())
        return Ne() || u ? void 0 : z(r ?? t);
      _e({ remove: d });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...j].find(([T, F]) => T === d?.associationId && F.holder.id === d?.id);
        if (!c) continue;
        const [b, f] = c, p = t.lines?.find((T) => T.id === b), h = f.holder.relationships?.getAssociations?.().find((T) => T.id === b);
        if (!p || !h) continue;
        if (!Ne()) {
          z(r ?? t);
          continue;
        }
        const E = { ...Ge(h), id: p.id, parentId: p.parentId, childId: p.childId };
        f.swapped && (E.showParentArrow = h.showChildArrow, E.showChildArrow = h.showParentArrow), JSON.stringify(qt(E)) !== JSON.stringify(p) && (j.set(b, { ...f, key: "" }), _e({ set: E }));
      }
  }
  function qt(s) {
    return en({ ...t, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function _e(s) {
    const a = t.lines?.find((h) => h.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? en(t, s.set) : ht(t, s.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), z(r ?? t);
    const c = "set" in s ? s.set : a, b = [c.parentId, c.childId].map((h) => t.cards.find((g) => g.id === h)?.label ?? e.nodes.one(h)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), f = (h) => b[h] || "a note";
    e.announce?.("set" in s ? a ? `The line from ${f(0)} to ${f(1)} changed.` : `${f(0)} is joined to ${f(1)}.` : `The line from ${f(0)} to ${f(1)} was taken away.`);
    const p = B(o.onChange, t, { line: s });
    Sn(p, () => {
      if (u || t !== d) return;
      const h = a ? en(t, a) : "set" in s ? ht(t, s.set.id) : null;
      h && (t = h, z(r ?? t));
    });
  }
  function Kt(s) {
    const a = new Map(s.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || _e({ remove: c });
    for (const [c, b] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(b) && an(t, b) === null && _e({ set: b });
  }
  function gn(s, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), b = s.map(({ node: h, offer: g, from: E }) => {
      let T = g.lines;
      for (const [D, K] of c) T = Ce(T, D, K);
      d = Me(d, a, { ...g, ...T ? { lines: T } : {} });
      const F = d.cards[d.cards.length - 1];
      F.id !== h.id && c.set(h.id, F.id);
      const H = { ...h.options ?? {}, ...E ? { x: E.x, y: E.y } : {} };
      return { node: h, card: F, kept: H, lines: Ce(T ?? [], h.id, F.id) };
    });
    e.beginHostStep?.(), t = d;
    let f = t;
    for (const { node: h, card: g } of b)
      g.id !== h.id && R.set(h.id, g.id), J.set(X(ie.card(g.id)), { x: h.options?.x ?? 0, y: h.options?.y ?? 0 }), xe(() => e.removeNode(h.id));
    e.endHostStep?.(), z(t), Zt(X(ie.card(b[0].card.id)));
    const p = t.lanes.find((h) => h.id === a);
    e.announce?.(b.length === 1 ? `${Y(b[0].card)} is now a card in ${p.label}. ${he(t, a)}.` : `${qn(b.map(({ card: h }) => Y(h)))} are now cards in ${p.label}. ${he(t, a)}.`);
    for (const { node: h, card: g, kept: E, lines: T } of b) {
      const F = { cardId: g.id, laneId: a, noteToCard: {
        noteId: h.id,
        label: g.label,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...T.length ? { lines: T } : {}
      } }, H = () => {
        t !== f || !t.cards.some((K) => K.id === g.id) || (t = Z({ ...t, cards: t.cards.filter((K) => K.id !== g.id), lines: Ce(t.lines, g.id, h.id) }), f = t, z(t));
      }, D = B(o.onChange, t, F);
      e.holdTrade?.(h.id, D), Yn(D, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: h.id, isComment: !1 } }]);
      }, () => {
        if (!u) {
          if (H(), !e.nodes.one(E.id)) {
            e.beginHostStep?.();
            const K = xe(() => e.addNode({ ...E }));
            K && (K.announcedByCreator = !0), e.endHostStep?.();
            const me = Ce(T, g.id, h.id).filter((qe) => !t.cards.some((oe) => oe.id === qe.parentId || oe.id === qe.childId));
            K?.ready?.then?.(() => {
              u || xe(() => Zn(me));
            });
          }
          e.announce?.(`${Y(g)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        u || (H(), e.keepTrade?.(h.id), e.announce?.(`Someone else put ${Y(g)} on the board first.`));
      });
    }
  }
  function yn(s, a) {
    const d = t.cards.find((Q) => Q.id === s), c = t.lanes.find((Q) => Q.id === d.laneId), b = t.cards.findIndex((Q) => Q.id === s), f = t.cards.slice(b + 1).find((Q) => Q.laneId === d.laneId)?.id, p = I.get(X(ie.card(s))) ?? {}, h = xt(d), g = e.nodes.one(h) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : h, E = ut(t, s), { leave: T } = Ro(t, s, g), F = ft(t, s, g), H = ($.cornerRadius ?? 0) > 0, D = d.asNote, K = D?.text !== void 0 && At(D.text) === d.label ? D.text : d.label, me = {
      id: g,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: D?.width ?? p.width ?? 228,
      height: D?.height ?? p.height ?? 76,
      text: K,
      shape: D?.shape ?? (H ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? p.backgroundColor,
      fontColor: d.look?.textColor ?? p.foregroundColor,
      fontSize: d.look?.fontSize ?? p.fontSize,
      borderColor: d.look?.borderColor ?? p.borderColor,
      borderWidth: d.look?.borderWidth ?? p.borderWidth,
      ...d.look?.fontFamily ?? p.fontFamily ? { fontFamily: d.look?.fontFamily ?? p.fontFamily } : {}
    };
    D?.image && Object.assign(me, {
      image: D.image.src,
      ...D.image.width ? { imageOrigWidth: D.image.width } : {},
      ...D.image.height ? { imageOrigHeight: D.image.height } : {}
    }), D?.link && (me.link = { ...D.link });
    for (const Q of Object.keys(me)) me[Q] === void 0 && delete me[Q];
    e.beginHostStep?.(), t = F;
    const qe = t;
    g !== s ? R.set(g, s) : R.delete(g);
    const oe = xe(() => e.addNode(me));
    oe && (oe.announcedByCreator = !0), e.endHostStep?.(), z(t);
    const Xt = Promise.resolve(oe?.ready).then(() => u || !oe || e.nodes.one(g) !== oe ? [] : xe(() => Zn(T))).catch(() => []);
    oe?.ready?.then?.(() => {
      if (u || e.nodes.one(g) !== oe) return;
      const Q = () => e.selectNodes?.([oe]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(Q) : Q();
    }), e.announce?.(`${Y(d)} is now a note on the canvas. ${c.label}: ${he(t, c.id)}.`);
    const et = () => {
      e.nodes.one(g) === oe && (e.beginHostStep?.(), xe(() => e.removeNode(g)), e.endHostStep?.());
    }, nt = B(o.onChange, t, { cardId: s, cardToNote: { noteId: g } });
    e.holdTrade?.(g, nt), Yn(nt, () => {
      Xt.then((Q) => {
        oe && e.nodes.one(g) === oe && e.sendHeld?.([{ type: "onNodeAdded", data: { id: g, nodeOptions: st(oe.options) } }, ...Q]);
      });
    }, () => {
      if (!u) {
        if (et(), t === qe && !t.cards.some((Q) => Q.id === s)) {
          const Q = {
            id: s,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...E.length ? { lines: E } : {}
          }, tt = Me(t, d.laneId, Q, f);
          tt && (t = tt, z(t));
        }
        e.announce?.(`${Y(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      u || (et(), e.keepTrade?.(g), e.announce?.(`Someone else took ${Y(d)} off the lanes first.`));
    });
  }
  function Jt(s, a, d) {
    const c = d.map((g) => g.id), b = c.indexOf(a), f = s.cards.find((g) => g.id === a);
    if (b < 0 || !f) return s;
    const p = s.cards.filter((g) => g !== f), h = p.findIndex((g) => c.indexOf(g.id) > b);
    return p.splice(h < 0 ? p.length : h, 0, f), Z({ ...s, cards: p });
  }
  function Zt(s) {
    m = m.then(() => {
      const a = w.get(s);
      if (u || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function xe(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Yn(s, a, d, c) {
    if (!s || typeof s.then != "function") return a();
    const b = s.then((f) => {
      f === !0 ? a() : f === !1 ? d() : f === "taken" && c();
    }, () => d());
    e.holdUntil?.(b);
  }
  function Yt(s, a) {
    te(!1), i = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => te(), 1500) }, z(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), B(o.onRefuse, a);
  }
  function te(s = !0) {
    i && (clearTimeout(i.timer), i = null, s && !u && pe());
  }
  function pe() {
    z(S && S.outcome.kind === "candidate" ? S.outcome.next : y?.next ?? r ?? t, { skip: S?.cardId });
  }
  function Vn(s) {
    const a = gt(s, { native: !0, origin: U, rows: Qn(), layout: C, style: $ }).nodes, d = new Map(a.map((f) => [f.options.id, f.options])), c = (f, p, h, g = !1) => {
      const E = d.get(ie.column(f));
      E && (E.borderColor = p, E.borderWidth = h, delete E.borderStyle);
      const T = g && d.get(ie.lane(f));
      T && (T.borderColor = p, T.borderWidth = h);
    }, b = S?.cardId ?? y?.cardId;
    if (O = /* @__PURE__ */ new Map(), b) {
      const f = t.cards.find((h) => h.id === b)?.laneId;
      for (const h of ct(t, b)) h.id !== f && (c(h.id, lt, 2), O.set(h.id, "open"));
      const p = S ? S.outcome : y?.laneId ? { kind: "candidate", laneId: y.laneId } : null;
      p?.kind === "candidate" && (c(p.laneId, at, 3, !0), O.set(p.laneId, "over")), p?.kind === "refused" && (c(p.laneId, Cn, 3), O.set(p.laneId, "refused"));
    }
    if (L && !b) {
      for (const f of L.open) f !== L.laneId && (c(f, lt, 2), O.set(f, "open"));
      L.laneId && !L.refusal && (c(L.laneId, at, 3, !0), O.set(L.laneId, "over")), L.laneId && L.refusal && (c(L.laneId, Cn, 3), O.set(L.laneId, "refused"));
    }
    if (y?.laneId === null && y.spot) {
      const f = d.get(ie.card(y.cardId));
      f && (f.xPos = y.spot.x, f.yPos = y.spot.y);
    }
    if (i) {
      O.set(i.laneId, "refused"), c(i.laneId, Cn, 3, !0);
      const f = d.get(ie.caption(i.laneId));
      f && (f.text = i.reason, f.foregroundColor = "#b42318");
    }
    if (M = /* @__PURE__ */ new Set(), r && s === r) {
      const f = (h, g) => JSON.stringify(h) === JSON.stringify(g), p = (h) => {
        const g = d.get(h);
        g && (g.borderStyle = "dashed", g.borderColor = bo, g.borderWidth = 2, M.add(X(h)));
      };
      for (const h of s.cards) f(h, t.cards.find((g) => g.id === h.id)) || p(ie.card(h.id));
      for (const h of s.lanes) f(h, t.lanes.find((g) => g.id === h.id)) || p(ie.lane(h.id));
    }
    for (const f of a) {
      f.options.id = X(f.options.id);
      for (const p of f.relationships.associations)
        p.parentId = X(p.parentId), p.childId = X(p.childId);
    }
    return a;
  }
  function Qn() {
    return S || y ? t.lanes.map((s) => t.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function z(s, a = {}) {
    if (u) return;
    x = { model: s, skip: a.skip, animate: a.animate !== !1 };
    const d = Vn(s), c = [];
    for (const { options: f } of d) {
      const p = f.id;
      if (w.has(p)) continue;
      const h = J.get(p);
      J.delete(p);
      const g = h && a.animate !== !1 && !An() ? { ...f, xPos: h.x, yPos: h.y } : f, E = e.nodes.add(wo(g));
      w.set(p, E), I.set(p, { ...g }), E.ready && c.push(E.ready.then(() => {
        if (w.get(p) !== E) return;
        E.applyGovernance?.(), ne(p)?.kind === "column" && E.toBack?.(!1);
        const T = Xn(x?.model ?? s, p);
        T && E.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const b = x;
    m = Promise.all([m, ...c]).then(() => {
      u || x !== b || Vt(Vn(b.model), b);
    }).catch((f) => console.warn("WORKSHOP: could not draw the workshop", f));
  }
  function Vt(s, a) {
    const d = new Set(s.map((b) => b.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [f, p] of [...w]) {
        if (d.has(f)) continue;
        for (const [g, E] of [...k])
          E.parentId !== f && E.childId !== f || (E.parent.relationships?.removeAssociation(g), k.delete(g));
        e.deselectNode?.(p), p.editor?.cancelInline?.(), w.delete(f), I.delete(f);
        const h = A.get(f);
        h && (A.delete(f), v.delete(h)), e.nodes.remove(f);
      }
      for (const { options: f } of s) {
        const p = f.id, h = w.get(p);
        if (!h?.svgGroup) continue;
        const g = I.get(p) ?? {}, E = h.editor?.isInlineEditing?.();
        (f.fontSize !== g.fontSize || f.foregroundColor !== g.foregroundColor) && (h.options.fontSize = f.fontSize, h.options.fontColor = f.foregroundColor, h.applyTextStyle?.()), f.text !== g.text && !E && h.setText?.(f.text), (f.width !== g.width || f.height !== g.height) && (f.vectorPath ? (h.options.width = f.width, h.options.height = f.height, h.setShape?.(h.options.shape, f.vectorPath), ne(p)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(f.width, f.height)), f.backgroundColor !== g.backgroundColor && h.setColors?.(f.backgroundColor), (f.borderColor !== g.borderColor || f.borderWidth !== g.borderWidth || f.borderStyle !== g.borderStyle) && (h.options.borderColor = f.borderColor, h.options.borderWidth = f.borderWidth, h.options.borderStyle = f.borderStyle, h.applyBorder?.());
        const T = f.xPos !== g.xPos || f.yPos !== g.yPos || Math.abs((h.options.x ?? 0) - f.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - f.yPos) > 0.5;
        if (p !== (a.skip && X(ie.card(a.skip))) && T) {
          const D = a.animate && !An() ? 180 : 0, K = c.includes(h) ? () => {
            !u && w.get(p) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          K && D && c.length === 1 && h.resizeRotate?.disable?.(), h.position(f.xPos, f.yPos, K, void 0, D);
        }
        const F = Xn(a.model, p);
        F && h.svgGroup.node.getAttribute("aria-label") !== F && h.svgGroup.node.setAttribute("aria-label", F), M.has(p) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed");
        const H = ne(p);
        if (H?.kind === "column") {
          const D = O.get(H.key);
          D ? h.svgGroup.node.setAttribute("data-workshop-drop", D) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        I.set(p, { ...f });
      }
      const b = /* @__PURE__ */ new Map();
      for (const f of s) for (const p of f.relationships.associations) b.set(p.id, p);
      for (const [f, p] of [...k])
        b.has(f) && w.get(p.parentId) === p.parent && w.get(p.childId) === p.child || (p.parent.relationships?.removeAssociation(f), k.delete(f));
      for (const [f, p] of b) {
        if (k.has(f)) continue;
        const h = w.get(p.parentId), g = w.get(p.childId);
        !h?.relationships || !g?.svgGroup || (h.relationships.addAssociation(g, xn(p)), k.set(f, { parentId: p.parentId, childId: p.childId, parent: h, child: g }));
      }
      Ut(a.model);
    }), e.notifyNodeChanged?.();
  }
  function Xn(s, a) {
    const d = ne(a);
    if (d?.kind === "lane") {
      const c = s.lanes.find((b) => b.id === d.key);
      return c ? `${c.label}, ${he(s, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = s.cards.find((f) => f.id === d.key), b = c && s.lanes.find((f) => f.id === c.laneId);
      return c && b ? `${c.label || "Empty card"}, in ${b.label}` : null;
    }
    return null;
  }
  function Qt(s, a) {
    const d = gt(s, { native: !0, origin: U, layout: C, style: $ }).nodes.find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Ae() {
    S && e.cancelGovernedDrag?.("host"), S = null, y && (y = null, B(o.onPreview, null)), te(!1);
  }
  return {
    toCanvas(s) {
      if (u || l || De()) return "This workshop is view-only here.";
      if (!t.cards.some((b) => b.id === s)) return "That card is no longer on the board.";
      const a = Xe(t, s);
      if (a) return a;
      y && ve(), r && (Ae(), r = null, z(t), e.refreshGovernance?.());
      const { width: d } = de(t, { layout: C }), c = w.get(X(ie.card(s)))?.options;
      return yn(s, { x: U.x + d + 32, y: c?.y ?? U.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...U };
    },
    get layout() {
      return { ...C };
    },
    get bounds() {
      const { width: s, height: a } = de(t, { layout: C });
      return { x: U.x, y: U.y, width: s, height: a };
    },
    setLayout(s) {
      if (u) throw new Error("This workshop has been detached.");
      const a = s?.lanesPerRow === void 0 ? {} : { lanesPerRow: s.lanesPerRow };
      de(t, { layout: a }), a.lanesPerRow !== C.lanesPerRow && (Ae(), C = a, z(r ?? t));
    },
    whenDrawn: () => m,
    update(s) {
      if (u) throw new Error("This workshop has been detached.");
      const a = Z(s);
      Ae(), t = a, z(r ?? t);
    },
    preview(s) {
      if (u) throw new Error("This workshop has been detached.");
      const a = s ? Z(s) : null;
      Ae(), r = a, z(r ?? t), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = t.lanes.find((c) => c.id === s);
      u || !d || (te(!1), i = { laneId: s, reason: a, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      u || l === !!s || (Ae(), l = !!s, z(r ?? t), e.refreshGovernance?.());
    },
    destroy() {
      u || (Ae(), u = !0, e.element?.removeEventListener?.("pointerdown", Bn, !0), Ft?.(), e.withPolicyAuthority(() => {
        for (const [s, a] of j) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of k) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of w)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), k.clear(), j.clear(), w.clear(), I.clear(), v.clear(), A.clear(), je(), N = !1, hn(), e.notifyNodeChanged?.());
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
function Sn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function xo(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function Ao(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const r of n)
    o = Math.max(o, (r.options.x ?? 0) + (r.options.width ?? 0)), t = Math.min(t, r.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
function le(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ce(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Co(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = jn(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function jn(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const vt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function Pn(e) {
  if (typeof e != "string" || !vt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function xt(e) {
  return e.noteId ?? e.id;
}
function At(e) {
  const n = jn(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function Ct(e) {
  const n = le(e);
  let o;
  try {
    o = new URL(ce(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: ce(n.alt, 240) };
}
function ue(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const St = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, So = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Ln(e) {
  const n = le(e), o = {}, t = (l) => {
    if (typeof l != "string" || !St.test(l)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return l;
  }, r = (l, u, w) => {
    if (typeof l != "number" || !Number.isFinite(l) || l < u || l > w) throw new Error("A card size is out of range.");
    return l;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !So.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = r(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = r(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Tt(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        Ln({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Ln(n);
}
function En(e) {
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
function dt(e) {
  try {
    return !!rn({ link: e });
  } catch {
    return !1;
  }
}
function rn(e) {
  const n = le(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const t = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (t.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    o.text = t;
  }
  if (n.image !== void 0) {
    const t = le(n.image);
    if (!En(t.src)) throw new Error("A card keeps a picture by its web address only.");
    o.image = { src: t.src };
    for (const r of ["width", "height"]) {
      const l = t[r];
      if (l !== void 0) {
        if (typeof l != "number" || !Number.isFinite(l) || l < 1 || l > 2e4) throw new Error("A picture size is out of range.");
        o.image[r] = l;
      }
    }
  }
  if (n.link !== void 0) {
    const t = le(n.link), r = t.data;
    if (!(typeof r == "string" ? r.length <= 2048 : !!r && typeof r == "object" && !Array.isArray(r) && JSON.stringify(r).length <= 2048 && Object.values(r).every((u) => typeof u == "string")) || t.type !== void 0 && (typeof t.type != "string" || !/^[A-Za-z]{1,40}$/.test(t.type)) || t.show !== void 0 && typeof t.show != "boolean") throw new Error("A card keeps a link as a note does.");
    o.link = {
      ...t.type !== void 0 ? { type: t.type } : {},
      data: r,
      ...t.show !== void 0 ? { show: t.show } : {}
    };
  }
  if (n.shape !== void 0) {
    if (typeof n.shape != "string" || !/^[a-z]{1,24}$/i.test(n.shape)) throw new Error("A card keeps a shape by its name only.");
    o.shape = n.shape;
  }
  for (const t of ["width", "height"]) {
    const r = n[t];
    if (r !== void 0) {
      if (typeof r != "number" || !Number.isFinite(r) || r < 10 || r > 4e3) throw new Error("A note size is out of range.");
      o[t] = r;
    }
  }
  return Object.keys(o).length ? o : void 0;
}
const Pe = 96, To = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, $o = ["solid", "dashed", "dotted"];
function Le(e) {
  const n = le(e);
  if (typeof n.id != "string" || !To.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: Pn(n.parentId), childId: Pn(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (r, l, u) => {
    const w = n[r];
    if (w != null) {
      if (typeof w != "number" || !Number.isFinite(w) || w < l || w > u) throw new Error("A line's look is out of range.");
      o[r] = w;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !St.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!$o.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
  for (const r of ["showParentArrow", "showChildArrow"])
    if (!(n[r] === void 0 || n[r] === null)) {
      if (typeof n[r] != "boolean") throw new Error("A line's arrows are on or off.");
      o[r] = n[r];
    }
  if (n.label !== void 0 && n.label !== null && n.label !== "") {
    if (typeof n.label != "string" || n.label.length > 200 || /[<>\u0000-\u001f]/.test(n.label)) throw new Error("A line's label is plain words, up to 200 characters.");
    o.label = n.label;
  }
  return o;
}
function Po(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(Le).filter((t) => n.has(t.parentId) || n.has(t.childId));
  if (ge(o.map((t) => t.id), "line ID"), o.length > Pe) throw new Error(`A workshop holds up to ${Pe} lines.`);
  return o;
}
function ge(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Dn({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((r) => r.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Lo(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Te = (e) => "lane-" + e, ye = (e) => "card-" + e, dn = (e) => "image-" + e;
function lr(e) {
  const n = Lo(e);
  return Dn(e).map((o) => {
    const t = e.cards.filter((u) => u.laneId === o.id), r = n.filter((u) => u.laneId === o.id), l = [Te(o.id)];
    return o.station?.image && l.push(dn(o.id)), { lane: o, cards: t, signals: r, nodeIds: [...l, ...t.map((u) => ye(u.id))] };
  });
}
const $t = 5, On = 24, Nn = 3;
function Z(e) {
  const n = le(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ce(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > $t)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > On)
    throw new Error("A workshop supports up to 24 cards.");
  const r = n.lanes.map((I) => {
    const k = le(I), v = { id: ue(k.id), label: ce(k.label) };
    if (k.capacity !== void 0) {
      const A = o ? 576 : 24;
      if (typeof k.capacity != "number" || !Number.isInteger(k.capacity) || k.capacity < 1 || k.capacity > A)
        throw new Error(`Lane capacity must be a whole number from 1 to ${A}.`);
      v.capacity = k.capacity;
    }
    if (k.station !== void 0) {
      const A = le(k.station), S = (L) => {
        if (typeof L != "number" || !Number.isInteger(L) || L < 0 || L >= Nn)
          throw new Error("Use map coordinates from 0 to 2.");
        return L;
      };
      if (!Array.isArray(A.next) || A.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const y = A.next.map(ue);
      ge(y, "onward stop"), v.station = { column: S(A.column), row: S(A.row), next: y, outcome: ce(A.outcome, 160) }, A.image !== void 0 && (v.station.image = Ct(A.image));
    }
    return v;
  }), l = r.map((I) => I.id);
  if (ge(l, "lane ID"), (o || r.some((I) => I.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (r.some((I) => I.station)) {
    if (!r.every((I) => I.station)) throw new Error("Give every station on the map a position.");
    ge(r.map((I) => I.station.column + "," + I.station.row), "map position");
    for (const I of r)
      if (I.station.next.some((k) => k === I.id || !l.includes(k))) throw new Error("Connect each stop to another station on this map.");
  }
  const u = n.cards.map((I) => {
    const k = le(I), v = { id: ue(k.id), label: Co(k.label), laneId: ue(k.laneId) };
    if (!l.includes(v.laneId)) throw new Error("Card refers to an unknown lane.");
    if (k.allowedLaneIds !== void 0) {
      if (!Array.isArray(k.allowedLaneIds) || k.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (v.allowedLaneIds = k.allowedLaneIds.map(ue), ge(v.allowedLaneIds, "allowed lane"), !v.allowedLaneIds.includes(v.laneId) || !v.allowedLaneIds.every((A) => l.includes(A)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (k.look !== void 0) {
      const A = Ln(k.look);
      A && (v.look = A);
    }
    if (k.asNote !== void 0) {
      const A = rn(k.asNote);
      A && (v.asNote = A);
    }
    if (k.noteId !== void 0 && k.noteId !== v.id && (v.noteId = Pn(k.noteId)), o) {
      if (typeof k.points != "number" || !Number.isInteger(k.points) || k.points < 1 || k.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (v.points = k.points, k.dependsOn !== void 0) {
        if (!Array.isArray(k.dependsOn) || k.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        v.dependsOn = k.dependsOn.map(ue), ge(v.dependsOn, "dependency");
      }
    }
    return v;
  });
  ge(u.map((I) => I.id), "card ID");
  const w = { version: 1, title: t, lanes: r, cards: u };
  if (n.experience !== void 0) {
    const I = le(n.experience);
    if (I.version !== 1 || I.kind !== "customer-interviews" && I.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    w.experience = { version: 1, kind: I.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    w.signals = n.signals.map((I) => {
      const k = le(I), v = ue(k.cardId), A = ue(k.laneId);
      if (!u.some((S) => S.id === v) || !l.includes(A))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ue(k.id),
        label: ce(k.label),
        cardId: v,
        laneId: A,
        whenPresent: ce(k.whenPresent, 160),
        whenAbsent: ce(k.whenAbsent, 160)
      };
    }), ge(w.signals.map((I) => I.id), "placement outcome ID");
  }
  if (n.lines !== void 0) {
    const I = Po(n.lines, new Set(u.map((k) => k.id)));
    I.length && (w.lines = I);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    w.presentationOrder = Dn({ lanes: r, presentationOrder: n.presentationOrder }).map((I) => I.id);
  }
  if (o)
    return w.kind = "release-plan", eo(w), w;
  for (const I of r)
    if (u.filter((k) => k.laneId === I.id).length > (I.capacity ?? 1 / 0))
      throw new Error(`Lane "${I.label}" exceeds its capacity.`);
  return w;
}
const Pt = 65536;
function dr(e) {
  const n = JSON.stringify(Z(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Pt) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function cr(e) {
  if (e.length > Pt) throw new Error("This workshop is too large to open from a link.");
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
function sn(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => ln(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((r) => r.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function _n(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  if (t && e.kind === "release-plan") {
    const r = ln(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !sn(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
function $e(e, n, o) {
  const t = e.cards.find((l) => l.id === n);
  if (!t || !e.lanes.some((l) => l.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return ln(e, t, o);
  const r = Ho(e, n, o);
  return r || (o === "prototype" && Ee(e) === "customer-interviews" ? null : sn(e, t).some((l) => l.id === o) ? _n(e, n, o) : null);
}
function ct(e, n) {
  return e.lanes.filter((o) => $e(e, n, o.id) !== null);
}
function Qe(e, n, o) {
  if ($e(e, n, o) !== null) return null;
  const t = e.cards.find((I) => I.id === n), r = e.lanes.find((I) => I.id === o);
  if (!t || !r) return "That move is not available.";
  const l = `This card can't go in ${r.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return l;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return l;
    const I = Ie(e, o), k = { ...e, lanes: e.lanes.map((A) => A === r ? { id: r.id, label: r.label } : A) }, v = ln(k, t, o);
    return v ? `Needs ${Ie(v, o) - I} points. It already holds ${I} of ${r.capacity} points.` : l;
  }
  const u = e.lanes.find((I) => I.id === t.laneId);
  if (u?.station && !u.station.next.includes(o)) return `${r.label} can't be reached from ${u.label}.`;
  const w = e.cards.filter((I) => I.laneId === o).length;
  return r.capacity !== void 0 && w >= r.capacity ? `It already holds ${w} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.` : l;
}
function We(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !Ee(e);
}
const Eo = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Oo(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && Eo.test(n) && !o.has(n) ? n : un(e, "card");
}
function Se(e, n, o) {
  const t = e.lanes.find((l) => l.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((l) => l.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Ee(e)) return "This workshop keeps the cards it came with.";
  if (e.cards.length >= On) return `This board is at its size limit of ${On} cards. Remove a card to make room.`;
  const r = e.cards.filter((l) => l.laneId === n).length;
  if (t.capacity !== void 0 && r >= t.capacity) return `It already holds ${r} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const l = Lt(o.lines);
    if (!l) return "A line of this note can't be joined to a card.";
    const u = new Set((e.lines ?? []).map((w) => w.id));
    if ((e.lines?.length ?? 0) + l.filter((w) => !u.has(w.id)).length > Pe)
      return `A workshop holds up to ${Pe} lines.`;
  }
  return null;
}
function No(e) {
  try {
    return e && typeof e == "object" ? Tt(e) : void 0;
  } catch {
    return;
  }
}
function _o(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      rn({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? rn(n) : void 0;
}
function Lt(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let r = null;
    try {
      r = Le(t);
    } catch {
      try {
        const { id: l, parentId: u, childId: w } = le(t);
        r = Le({ id: l, parentId: u, childId: w });
      } catch {
        r = null;
      }
    }
    if (!r) return null;
    o.push(r);
  }
  return o;
}
function cn(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function Ce(e, n, o) {
  return e && e.map((t) => cn(t, n, o));
}
function Et(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function Me(e, n, o, t) {
  if (Se(e, n, o) !== null) return null;
  const r = No(o.look), l = typeof o.label == "string" ? jn(o.label) : "";
  let u = _o(o.asNote);
  l.length > 80 && u?.text === void 0 && l.length <= 4e3 && (u = { ...u, text: l });
  const w = Oo(e, o.id), I = w !== o.id && typeof o.id == "string" && vt.test(o.id) ? o.id : void 0, k = {
    id: w,
    label: At(l),
    laneId: n,
    ...r ? { look: r } : {},
    ...u ? { asNote: u } : {},
    ...I ? { noteId: I } : {}
  }, v = t === void 0 ? -1 : e.cards.findIndex((y) => y.id === t && y.laneId === n), A = v < 0 ? [...e.cards, k] : [...e.cards.slice(0, v), k, ...e.cards.slice(v)], S = o.lines === void 0 ? void 0 : Et(e, Lt(o.lines).map((y) => cn(y, o.id, k.id)));
  return Z({ ...e, cards: A, ...S ? { lines: S } : {} });
}
function Xe(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!We(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((l) => e.lanes.find((u) => u.id === l).label), r = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${r}, so it stays a card.`;
  }
  return null;
}
function ft(e, n, o = Ot(e, n)) {
  if (Xe(e, n) !== null) return null;
  const t = e.lines?.map((r) => cn(r, n, o));
  return Z({ ...e, cards: e.cards.filter((r) => r.id !== n), ...t ? { lines: t } : {} });
}
function Ro(e, n, o = Ot(e, n)) {
  const t = new Set(e.cards.filter((u) => u.id !== n).map((u) => u.id)), r = (e.lines ?? []).filter((u) => u.parentId === n || u.childId === n).map((u) => cn(u, n, o)), l = (u) => t.has(u.parentId) || t.has(u.childId);
  return { stay: r.filter(l), leave: r.filter((u) => !l(u)) };
}
function Ot(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? xt(o) : n;
}
function ut(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function an(e, n) {
  let o;
  try {
    o = Le(n);
  } catch (l) {
    return l instanceof Error ? l.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((l) => l.id));
  return !t.has(o.parentId) && !t.has(o.childId) ? "That card is no longer on the board." : e.lanes.some((l) => l.id === o.parentId || l.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((l) => l.id === o.id) && (e.lines?.length ?? 0) >= Pe ? `A workshop holds up to ${Pe} lines.` : null;
}
function en(e, n) {
  return an(e, n) !== null ? null : Z({ ...e, lines: Et(e, [Le(n)]) });
}
function ht(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? Z({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function Nt(e, n, o, t = {}) {
  const r = new Set((e.lines ?? []).map((u) => u.id));
  let l = `${n}->${o}`;
  for (let u = 2; r.has(l); u++) l = `${n}->${o}~${u}`;
  return Le({ showChildArrow: !0, ...t, id: l, parentId: n, childId: o });
}
function Mo(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function he(e, n) {
  const o = e.lanes.find((l) => l.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const l = Ie(e, n);
    return o.capacity ? l + " / " + o.capacity + " points" : l + " points";
  }
  const t = Bo(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const r = e.cards.filter((l) => l.laneId === n).length;
  return o.capacity !== void 0 ? r + " of " + o.capacity : r + (r === 1 ? " card" : " cards");
}
const fn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, nn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function _t(e, n = fn, o = 28, t) {
  const { pitch: r, row: l, top: u } = n, w = !!e.lanes[0].station, I = e.lanes.map((A) => e.cards.filter((S) => S.laneId === A.id).length), k = u + Math.max(1, ...t ?? I) * l + 36, v = e.lanes.map((A, S) => ({
    x: w ? A.station.column * (r + o) : S * r,
    y: w ? A.station.row * k : 0
  }));
  return {
    points: v,
    width: Math.max(...v.map((A) => A.x)) + r,
    height: Math.max(...v.map((A, S) => A.y + u + (w ? Math.max(1, I[S]) : I[S] + 1) * l))
  };
}
function fr() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function un(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Rt(e) {
  const n = Z(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Wo(e, n) {
  const o = Rt(e), t = un(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Z(o);
}
function zo(e, n, o) {
  const t = Rt(e);
  return t.cards.push({
    id: un(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), Z(t);
}
function ur() {
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
function pt(e, n, o) {
  const t = Z(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = t.lanes.find((v) => v.id === n);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= $t) throw new Error("A map can have up to five stations.");
  const l = ce(o?.label), u = ce(o?.outcome, 160), w = un(t, "station");
  let I, k = 1 / 0;
  for (let v = 0; v < Nn; v++)
    for (let A = 0; A < Nn; A++) {
      if (t.lanes.some((y) => y.station.column === A && y.station.row === v)) continue;
      const S = Math.abs(r.station.column - A) + Math.abs(r.station.row - v);
      S < k && (k = S, I = { column: A, row: v });
    }
  if (!I) throw new Error("There is no free station position.");
  return r.station.next.push(w), t.lanes.push({ id: w, label: l, station: { ...I, next: [], outcome: u, ...o.image === void 0 ? {} : { image: Ct(o.image) } } }), t.presentationOrder?.push(w), t;
}
const hr = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Mt = (e) => "caption-" + e, ze = (e) => "column-" + e, ie = { lane: Te, card: ye, image: dn, caption: Mt, column: ze };
function Wt(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Tn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), r = e, l = n;
  return t ? `M ${t} 0 H ${r - t} Q ${r} 0 ${r} ${t} V ${l - t} Q ${r} ${l} ${r - t} ${l} H ${t} Q 0 ${l} 0 ${l - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${r} V ${l} H 0 Z`;
}
function mt(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function wt(e, n, o, t) {
  for (let r = n; r > 11; r--) {
    const l = Math.max(1, Math.floor(o / (r * 0.55)));
    if (e.split(`
`).reduce((w, I) => w + Math.max(1, Math.ceil(I.length / l)), 0) * r * 1.3 <= t) return r;
  }
  return Math.min(n, 11);
}
const zt = 152, Rn = zt + 12, Fo = 12;
function jo(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function de(e, n = {}) {
  const o = Z(e), { pitch: t, row: r, top: l } = fn, u = o.lanes.map((S) => o.cards.filter((y) => y.laneId === S.id).length), w = (S) => Math.max(u[S], (Array.isArray(n.rows) ? n.rows[S] : n.rows) ?? 0), I = !!o.lanes[0].station, k = o.lanes.some((S) => S.station?.image), v = jo(n.layout, o.lanes.length), A = [];
  if (I) {
    const { points: S } = _t(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((y, L) => A.push({
      laneId: y.id,
      x: S[L].x,
      y: S[L].y + (k ? y.station.row * Rn : 0),
      width: t,
      height: l + (y.station.image ? Rn : 0) + Math.max(1, w(L)) * r,
      column: y.station.column,
      row: y.station.row
    }));
  } else {
    let S = 0;
    for (let y = 0; y < o.lanes.length; y += v) {
      const L = o.lanes.slice(y, y + v), R = l + (Math.max(...L.map((J, i) => w(y + i))) + 1) * r;
      L.forEach((J, i) => A.push({ laneId: J.id, x: i * t, y: S, width: t, height: R, column: i, row: y / v })), S += R + Fo;
    }
  }
  return { places: A, width: Math.max(...A.map((S) => S.x + S.width)), height: Math.max(...A.map((S) => S.y + S.height)) };
}
function Do(e, n) {
  const { pitch: o, width: t, row: r, height: l, top: u } = fn, w = n.origin ?? { x: 0, y: 0 }, I = !!e.lanes[0].station, { places: k } = de(e, n), v = n.style ?? {}, A = v.textColor ?? Re.fontColor, S = v.borderColor ?? Re.borderColor, y = v.borderWidth ?? Re.borderWidth, L = v.cornerRadius ?? 0, R = v.fontSize ?? Re.fontSize, J = v.laneFontSize ?? R + 2, i = v.captionFontSize ?? Math.max(11, R - 1), m = [], x = ($) => {
    const O = { options: {
      shapeHint: "rectangle",
      vectorPath: Tn($.width, $.height, L),
      foregroundColor: A,
      borderColor: S,
      borderWidth: y,
      ...v.fontFamily ? { fontFamily: v.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return m.push(O), O;
  };
  e.lanes.forEach(($, O) => {
    const M = k[O], q = w.x + M.x, N = w.y + M.y, j = $.station?.image;
    x({
      id: ze($.id),
      text: "",
      name: $.label,
      xPos: q + 2,
      yPos: N,
      width: o - 4,
      height: M.height,
      vectorPath: Tn(o - 4, M.height, L ? L + 2 : 0),
      backgroundColor: I ? "#fcf9ed" : mt(nn[O], 0.6),
      borderColor: I ? "#a8b5aa" : mt(nn[O], 0.1),
      borderWidth: 1,
      ...I ? { borderStyle: "dashed" } : {}
    }), x({
      id: Te($.id),
      text: $.label,
      name: $.label,
      xPos: q + 8,
      yPos: N + 6,
      width: t,
      height: 58,
      backgroundColor: nn[O],
      fontSize: wt($.label, J, t - 16, 50)
    }), x({
      id: Mt($.id),
      text: he(e, $.id),
      name: $.label,
      xPos: q + 8,
      yPos: N + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: i
    }), j && m.push({ options: {
      id: dn($.id),
      name: j.alt,
      text: "",
      xPos: q + 8,
      yPos: N + u,
      width: t,
      height: zt,
      shapeHint: "rectangle",
      image: j.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((U) => U.laneId === $.id).forEach((U, Fe) => {
      const ne = e.kind === "release-plan" ? U.label + `
` + U.points + " points" : U.label, X = I ? t - 20 : t, ae = I ? l - 6 : l, se = I ? {} : { ...v.card, ...U.look }, je = I ? L : v.card?.cornerRadius ?? L;
      x({
        id: ye(U.id),
        text: ne,
        name: U.label,
        xPos: q + (I ? 18 : 8),
        yPos: N + u + (j ? Rn : 0) + Fe * r,
        width: X,
        height: ae,
        ...je !== L ? { vectorPath: Tn(X, ae, je) } : {},
        backgroundColor: I ? "#ffda75" : se.backgroundColor ?? v.backgroundColor ?? Re.backgroundColor,
        ...se.textColor ? { foregroundColor: se.textColor } : {},
        ...se.fontFamily ? { fontFamily: se.fontFamily } : {},
        ...se.borderColor ? { borderColor: se.borderColor } : {},
        ...se.borderWidth !== void 0 ? { borderWidth: se.borderWidth } : {},
        fontSize: wt(ne, se.fontSize ?? R, X - 16, ae - 8)
      });
    });
  });
  const C = new Map(m.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (C.get(ze($.id)).relationships.associations = $.station.next.map((O) => ({
      id: $.id + "-to-" + O,
      parentId: ze($.id),
      childId: ze(O),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const O of $.dependsOn ?? []) {
        const M = ye(O), q = ye($.id);
        C.get(M).relationships.associations.push({
          id: `dependency-${O.length}-${O}-${$.id}`,
          parentId: M,
          childId: q,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const $ = new Set(n.beside), O = new Set(m.map((N) => N.options.id)), M = /* @__PURE__ */ new Map();
    for (const N of [...O]) {
      if (!$.has(N)) continue;
      const j = Wt(N, (U) => $.has(U) || O.has(U));
      O.add(j), M.set(N, j);
    }
    const q = (N) => M.get(N) ?? N;
    for (const N of m) {
      N.options.id = q(N.options.id);
      for (const j of N.relationships.associations)
        j.parentId = q(j.parentId), j.childId = q(j.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: m };
}
function gt(e, n) {
  const o = Z(e);
  if (n?.native) return Do(o, n);
  const { width: t, row: r, height: l, top: u } = fn, w = [];
  function I(y, L, R, J, i, m) {
    w.push({ options: {
      id: y,
      text: L,
      name: L,
      xPos: R,
      yPos: J,
      width: t,
      height: i,
      shapeHint: "rectangle",
      backgroundColor: m,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: k } = _t(o), v = 152, A = v + 12, S = o.lanes.some((y) => y.station?.image);
  o.lanes.forEach((y, L) => {
    const R = k[L].x, J = k[L].y + (S ? (y.station?.row ?? 0) * A : 0), i = y.station?.image, m = o.kind === "release-plan" ? y.label + `
` + (y.capacity ? Ie(o, y.id) + " / " + y.capacity + " points" : Ie(o, y.id) + " points") : y.label;
    I(Te(y.id), m, R, J, u - 12, nn[L]), i && w.push({ options: {
      id: dn(y.id),
      name: i.alt,
      text: "",
      xPos: R,
      yPos: J + u,
      width: t,
      height: v,
      shapeHint: "rectangle",
      image: i.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((x) => x.laneId === y.id).forEach((x, C) => I(ye(x.id), o.kind === "release-plan" ? x.label + `
` + x.points + " points" : x.label, R, J + u + (i ? A : 0) + C * r, l, "#fffdf6"));
  });
  for (const y of o.lanes) {
    if (!y.station) continue;
    const L = w.find((R) => R.options.id === Te(y.id));
    L.relationships.associations = y.station.next.map((R) => ({ id: y.id + "-to-" + R, parentId: L.options.id, childId: Te(R), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), L.options.text = y.label + `
` + y.station.outcome, L.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const y = new Map(w.map((L) => [L.options.id, L]));
    for (const L of o.cards)
      for (const R of L.dependsOn ?? []) {
        const J = ye(R), i = ye(L.id);
        y.get(J).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${L.id}`,
          parentId: J,
          childId: i,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: w };
}
const pr = {
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
}, Mn = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Hn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function mr() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Mn.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Mn.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function wr() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Hn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Ee(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Hn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => Mn.some((r) => r.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Ho(e, n, o) {
  const t = Ee(e), r = e.cards.find((u) => u.id === n);
  if (!t || !r || r.laneId === o) return null;
  let l = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const u = e.cards.find((w) => w.laneId === o);
    if (u) {
      if (!sn(e, u).some((w) => w.id === "interviews")) return null;
      l = _n(e, u.id, "interviews");
    }
  }
  return sn(l, r).some((u) => u.id === o) ? _n(l, n, o) : null;
}
function Bo(e, n) {
  if (Ee(e) !== "experiment-budget") return null;
  const o = Hn.find((l) => l.id === n), t = e.cards.filter((l) => l.laneId === n).length, r = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? r + " " + (r === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  Re as DEFAULT_NOTE_STYLE,
  Ve as WorkshopReferenceError,
  pt as addWorkshopBranch,
  zo as addWorkshopCard,
  Wo as addWorkshopLane,
  ho as applyWorkshopEdits,
  ar as attachWorkshop,
  sn as availableLanes,
  no as canHangPanel,
  Hn as channels,
  mo as checkWorkshopReplacement,
  oo as countWord,
  wr as createBudgetWorkshop,
  mr as createInterviewWorkshop,
  fr as createLaneWorkshop,
  ur as createWorkshopMap,
  cr as decodeWorkshopFragment,
  rr as describeFocusDarkroom,
  sr as describeWorkshopEdits,
  dr as encodeWorkshopFragment,
  Zo as handoffSummary,
  nr as hangGalleryPanel,
  pr as industrialWorkshop,
  or as initialFocusDarkroom,
  Mn as interviews,
  nn as laneColors,
  be as listed,
  Ke as listeningRoom,
  Vo as listeningRoomCaption,
  On as maxWorkshopCards,
  Pe as maxWorkshopLines,
  Xo as moonGallery,
  _n as moveWorkshopCard,
  ir as named,
  hr as nightTransfer,
  tr as normalizeFocusDarkroom,
  Yo as normalizeListeningRoom,
  er as normalizeMoonGallery,
  qo as normalizeOfflineHandoff,
  Go as offlineHandoff,
  Ho as planStartupMove,
  ro as pointing,
  yt as printFields,
  Ie as releaseLoad,
  Qo as releasePlan,
  Jo as resolveHandoff,
  Lo as resolveWorkshopSignals,
  Ko as reviewHandoff,
  P as said,
  Ee as startupExperienceKind,
  Wn as unquoted,
  Z as validateWorkshop,
  tn as workshopBoardKind,
  Bo as workshopBudgetResult,
  $e as workshopCandidate,
  ft as workshopCardAsNote,
  Xe as workshopCardAsNoteRefusal,
  At as workshopCardLabelOf,
  Ro as workshopCardLines,
  Tt as workshopCardLookOf,
  ct as workshopDestinations,
  Fn as workshopEditKinds,
  $n as workshopFinder,
  dt as workshopKeepsLink,
  En as workshopKeepsPicture,
  he as workshopLaneCaption,
  de as workshopLanePlaces,
  fn as workshopLayout,
  an as workshopLineRefusal,
  ut as workshopLinesOf,
  Nt as workshopNewLine,
  ie as workshopNodeIds,
  Me as workshopNoteCandidate,
  xt as workshopNoteIdOf,
  Se as workshopNoteRefusal,
  _t as workshopPositions,
  Dn as workshopPresentationLanes,
  lr as workshopPresentationScenes,
  co as workshopReferences,
  Qe as workshopRefusal,
  Ce as workshopRenamedLines,
  Wt as workshopStandInId,
  We as workshopTakesNotes,
  gt as workshopToSlate,
  en as workshopWithLine,
  Mo as workshopWithoutCardLines,
  ht as workshopWithoutLine
};
