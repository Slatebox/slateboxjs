import { D as We } from "./NoteDefaults-1xFW0br8.mjs";
const Ko = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Jo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: r, fieldNote: l, deskNote: u, fallback: w } = e, k = (I) => typeof I == "string" && I.trim().length > 0 && I.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(I);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !k(l) || !k(u) || !k(w) ? null : { kind: n, version: o, stage: t, choice: r, fieldNote: l.trim(), deskNote: u.trim(), fallback: w.trim() };
}
function Zo(e) {
  return { ...e, stage: "review", choice: null };
}
function Yo(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Vo(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Ye = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Qo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: r, rightLabel: l } = e, u = (w) => typeof w == "string" && w.trim().length > 0 && w.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(w);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !u(r) || !u(l) ? null : { kind: n, version: o, mix: t, leftLabel: r.trim(), rightLabel: l.trim() };
}
function Xo({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === Ye.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === Ye.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === Ye.leftLabel && o === Ye.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function ve(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function to(e) {
  const n = new Map(e.cards.map((u) => [u.id, u])), o = new Map(e.lanes.map((u, w) => [u.id, w])), t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function l(u) {
    if (!t.has(u.id)) {
      if (r.has(u.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(u.id);
      for (const w of u.dependsOn ?? []) {
        const k = n.get(w);
        if (!k) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(k.laneId) > o.get(u.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        l(k);
      }
      r.delete(u.id), t.add(u.id);
    }
  }
  for (const u of e.cards) l(u);
  for (const u of e.lanes) {
    if (u.station) throw new Error("Release windows cannot also be map stations.");
    if (ve(e, u.id) > (u.capacity ?? 1 / 0)) throw new Error(`Release "${u.label}" exceeds its point budget.`);
  }
}
function cn(e, n, o) {
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
  const I = { ...e, cards: e.cards.map((A) => u.has(A.id) ? { ...A, laneId: o } : A) }, v = e.lanes[r].capacity;
  return v !== void 0 && ve(I, o) > v ? null : I;
}
const er = {
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
}, nr = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function tr(e) {
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
function oo(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function or(e, n) {
  return oo(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const bt = ["firstPrint", "secondPrint", "thirdPrint"], It = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function rr(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...It, route: n.route };
  for (const t of bt) {
    const r = n[t];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = r.trim();
  }
  return o;
}
function ir(e = new URLSearchParams()) {
  const n = { ...It };
  for (const t of bt) {
    const r = e.get(t)?.trim();
    r && r.length <= 48 && (n[t] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function sr(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Ie = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], it = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), zn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Fn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ar = (e) => zn(Fn(e)), ro = [
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
], io = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : ro.indexOf(e.toLowerCase()), so = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function vt(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (r) => {
    const l = zn(r);
    l && o.add(l);
  };
  t(e), t(Fn(e));
  for (const r of [...o]) t(r.replace(/^(?:the|my|our)\s+/i, ""));
  for (const r of [...o]) t(r.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const r of [...o]) t(r.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const bn = "[^\\p{L}\\p{N}]", st = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + it(n) + "(?:$|" + bn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + bn + ")" + it(n) + "(?:$|" + bn + ")", "u").test(e)
], at = ["first", "second", "third", "fourth", "fifth"];
function ao(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + at.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(zn(Fn(n)));
  if (!t) return null;
  const r = (t[1] ?? t[2]).toLowerCase(), l = r === "last" ? e.length - 1 : t[1] ? at.indexOf(r) : io(r) - 1;
  return e[l] ?? null;
}
function In(e, n, o, t, r) {
  const l = vt(n, o);
  if (l.some((w) => so.test(w))) {
    const w = t && e.find((k) => k.id === t);
    return w ? { item: w, rank: 0 } : { pointing: !0 };
  }
  for (const w of l) {
    if (!w.startsWith("@")) continue;
    const k = e.find((I) => I.id === w.slice(1));
    if (k) return { item: k, rank: 0 };
  }
  for (const [w, k] of st.entries())
    for (const I of l) {
      const v = e.filter((A) => k(A.label.toLowerCase(), I.toLowerCase()));
      if (v.length === 1) return { item: v[0], rank: w };
      if (v.length > 1) return { several: v };
    }
  const u = r ? ao(e, n, o) : null;
  return u ? { item: u, rank: st.length } : {};
}
class en extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function Pn(e, n, o, t, r = !1) {
  return { find: (k) => {
    const I = In(e, k, n, t, r);
    if (I.item) return I.item;
    const v = vt(k, n), A = v[v.length - 1];
    if (I.pointing) throw new en("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (I.several) {
      const y = [...new Set(I.several.map((L) => L.label))];
      throw new en(y.length === 1 ? I.several.length + " " + o + "s are called " + P(y[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + P(A) + ": " + Ie(y.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", I.several.map((L) => L.id));
    }
    const S = e.map((y) => y.label);
    throw new en("There is no " + o + " called " + P(A) + " here." + (S.length && S.length <= 6 ? " The " + o + "s are " + Ie(S.map(P)) + "." : S.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((y) => y.id));
  }, attempt: (k) => In(e, k, n, t, r).item ?? null, rank: (k) => In(e, k, n, t, r).rank ?? 1 / 0 };
}
const we = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map"], vn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"];
function sn(e) {
  return e.lanes[0]?.station ? "map" : e.kind === "release-plan" ? "release-plan" : Oe(e) ?? "lanes";
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
  lines: "Lines join the cards of a lane workshop to notes and to each other. This board keeps the cards it came with."
}, ee = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), V = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), re = (e) => ({ type: "ref", of: "card", about: e }), xn = (e) => ({ map: e }), fe = { lanes: j.notMap, "release-plan": j.notMap, "customer-interviews": j.notMap, "experiment-budget": j.notMap }, jn = [
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
    refusals: { "release-plan": j.releaseLanes, "customer-interviews": j.keepsLanes, "experiment-budget": j.keepsLanes, map: j.mapAddLane }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: V("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": j.releaseLanes, "customer-interviews": j.keepsLanes, "experiment-budget": j.keepsLanes }
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
    refusals: { "release-plan": j.releaseCards, "customer-interviews": j.keepsCards }
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
    boards: vn,
    refusals: xn(j.mapCardLanes)
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: re("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { lanes: j.notPoints, "customer-interviews": j.notPoints, "experiment-budget": j.notPoints, map: j.mapPoints }
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
    refusals: { lanes: j.notDepends, "customer-interviews": j.notDepends, "experiment-budget": j.notDepends, map: j.notDepends }
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
    boards: vn,
    refusals: xn(j.mapOutcome)
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: re("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: vn,
    refusals: xn(j.mapOutcome)
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
    refusals: Ve()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: re("One card."), to: re("The other card.") },
    boards: ["lanes"],
    refusals: Ve()
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
    refusals: Ve()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: re("The card."), note: ee(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: Ve()
  }
];
function Ve() {
  return { "release-plan": j.lines, "customer-interviews": j.lines, "experiment-budget": j.lines, map: j.lines };
}
const lo = new Map(jn.map((e) => [e.kind, e])), co = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function fo(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: co(e.max, n) }, e.nullable), description: e.about };
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
const xt = (e) => "optional" in e && e.optional === !0;
function lr(e) {
  const n = e ? sn(Z(e)) : void 0;
  return jn.map((o) => {
    const t = Object.entries(o.fields), r = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, u]) => !xt(u)).map(([u]) => u)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([u, w]) => [u, fo(w, n)])) }
    }, l = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: r };
    return n && (l.accepted = o.boards.includes(n), l.accepted || (l.refusal = o.refusals[n])), l;
  });
}
const Qe = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?",
  card: "cards?|features?|notes?|items?|tasks?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function uo(e, n) {
  const o = !!e.lanes[0]?.station, t = Pn(e.lanes, o ? Qe.step : Qe.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), r = Pn(e.cards, o ? Qe.token : Qe.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
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
function an(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function q(e, n, o = null, t) {
  try {
    return Z(e);
  } catch (r) {
    throw new _(an(r instanceof Error ? r.message : String(r), n), "refused", o, t);
  }
}
function ho(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, r] of Object.entries(n.fields)) {
    const l = e[t];
    if (l === void 0) {
      if (xt(r)) continue;
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
function po(e, n, o, t) {
  const r = structuredClone(e), l = o === "map", u = o === "release-plan", w = uo(r, t), k = { lane: l ? "step" : "lane", card: l ? "token" : "card" };
  function I(i, m, x, C, $ = null) {
    if (typeof x == "object") {
      const M = i.find((K) => K.id === x.id);
      if (!M) throw new _("That " + C + " is no longer on the workshop.", "gone", $);
      return M;
    }
    const E = i.find((M) => M.id === x);
    if (E) return E;
    try {
      return m.find(x);
    } catch (M) {
      if (!(M instanceof en)) throw M;
      const K = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new _(M.message, K, $, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const v = (i, m = null) => I(r.lanes, w.lanes, i, "lane", m), A = (i, m = null) => I(r.cards, w.cards, i, "card", m), S = (i) => {
    try {
      return v(i);
    } catch {
      return null;
    }
  }, y = (i, m, x = {}, C = !0) => ({ board: i, said: m, changed: C, ...x }), L = (i) => r.cards.filter((m) => m.laneId === i).length, R = (i) => l ? "The presentation opens with " + P(i[0].label) + "." : "The presentation now runs " + i.map((m) => P(m.label)).join(", then ") + ".";
  switch (n.kind) {
    case "rename_workshop": {
      r.title = n.title;
      const i = q(r, o);
      return y(i, "Renamed the " + (l ? "map" : "workshop") + " to " + P(i.title) + ".");
    }
    case "rename_lane": {
      const i = v(n.lane), m = i.label;
      i.label = n.label;
      const x = q(r, o, i.id);
      return y(x, "Renamed " + P(m) + " to " + P(x.lanes.find((C) => C.id === i.id).label) + ".", { laneId: i.id });
    }
    case "rename_card": {
      const i = A(n.card), m = i.label;
      i.label = n.label;
      const x = q(r, o, i.laneId, i.id);
      return y(x, "Renamed " + P(m) + " to " + P(x.cards.find((C) => C.id === i.id).label) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "add_lane": {
      if (r.lanes.length >= 5) throw new _("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new _("A lane can hold from 1 to 24 cards.", "refused");
      let i;
      try {
        i = Fo(r, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new _(an(x.message, o), "refused");
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
      return Xe(r, (x) => x.laneId === i.id), y(q(r, o), "Removed the " + k.lane + " " + P(i.label) + ".", { laneId: i.id });
    }
    case "add_card": {
      const i = v(n.lane);
      if (l) {
        if (n.allowedLanes !== void 0) throw new _(j.mapCardLanes, "not_on_this_board", i.id);
        let $ = n.label;
        if ($ === void 0) {
          let N = r.cards.length + 1;
          for (; r.cards.some((H) => H.label === "Token " + N); ) N++;
          $ = "Token " + N;
        }
        const E = new Set([...r.lanes, ...r.cards].map((N) => N.id));
        let M = 1;
        for (; E.has("token-" + M); ) M++;
        r.cards.push({ id: "token-" + M, label: $, laneId: i.id });
        const K = q(r, o, i.id);
        return y(K, "Added " + P(K.cards[K.cards.length - 1].label) + " at " + P(i.label) + ".", { laneId: i.id, cardId: "token-" + M });
      }
      if (r.cards.length >= 24) throw new _("A workshop can have up to 24 cards. Remove one first.", "refused", i.id);
      if (i.capacity !== void 0 && L(i.id) >= i.capacity)
        throw new _(P(i.label) + " is full: it holds " + i.capacity + (i.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", i.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => v($).id))];
      let x;
      try {
        x = jo(r, i.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch ($) {
        throw new _(an($.message, o), "refused", i.id);
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
      return Xe(r, (m) => m.cardId === i.id), y(q(zo(r, i.id), o, i.laneId), "Removed the " + k.card + " " + P(i.label) + ".", { laneId: i.laneId, cardId: i.id });
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
        return delete i.capacity, y(q(r, o, i.id), l ? "Removed the limit at " + P(i.label) + "." : P(i.label) + " now holds any number of " + m + "s.", { laneId: i.id });
      const x = u ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > x)
        throw new _((l ? "A step" : "A lane") + " can hold from 1 to " + x + " " + m + "s.", "refused", i.id);
      const C = u ? r.cards.reduce(($, E) => $ + (E.laneId === i.id ? E.points ?? 1 : 0), 0) : L(i.id);
      if (C > n.capacity)
        throw new _(P(i.label) + " already holds " + C + " " + m + (C === 1 ? "" : "s") + ". Move some " + (l ? "on" : "out") + " first, or choose a higher " + (u ? "budget" : "number") + ".", "refused", i.id);
      return i.capacity = n.capacity, y(q(r, o, i.id), P(i.label) + " now holds up to " + n.capacity + " " + m + (n.capacity === 1 ? "" : "s") + ".", { laneId: i.id });
    }
    case "set_card_lanes": {
      const i = A(n.card);
      if (n.lanes === null)
        return delete i.allowedLaneIds, y(q(r, o, i.laneId, i.id), P(i.label) + " can now go in any lane.", { laneId: i.laneId, cardId: i.id });
      const m = [...new Set(n.lanes.map((C) => v(C)))], x = r.lanes.find((C) => C.id === i.laneId);
      if (!m.includes(x)) throw new _(P(i.label) + " is in " + P(x.label) + " now. Include " + P(x.label) + ", or move the card first.", "refused", x.id, i.id);
      return i.allowedLaneIds = m.map((C) => C.id), y(q(r, o, i.laneId, i.id), P(i.label) + " can now go only in " + Ie(m.map((C) => P(C.label))) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "set_card_points": {
      const i = A(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new _("A feature takes from 1 to 24 points.", "refused", i.laneId, i.id);
      return i.points = n.points, y(q(r, o, i.laneId, i.id), P(i.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: i.laneId, cardId: i.id });
    }
    case "set_card_dependencies": {
      const i = A(n.card), m = [...new Set(n.dependsOn.map((C) => A(C)))], x = { laneId: i.laneId, cardId: i.id };
      if (n.mode === "remove") {
        const C = m.filter(($) => i.dependsOn?.includes($.id));
        if (!C.length) throw new _(P(i.label) + " does not depend on " + Ie(m.map(($) => P($.label))) + ".", "refused", i.laneId, i.id);
        return i.dependsOn = i.dependsOn.filter(($) => !C.some((E) => E.id === $)), i.dependsOn.length || delete i.dependsOn, y(q(r, o, i.laneId, i.id), P(i.label) + " no longer depends on " + Ie(C.map(($) => P($.label))) + ".", x);
      }
      if (!m.length) {
        if (n.mode === "add") throw new _("Name the features " + P(i.label) + " depends on.", "refused", i.laneId, i.id);
        return delete i.dependsOn, y(q(r, o, i.laneId, i.id), P(i.label) + " no longer depends on anything.", x);
      }
      if (m.includes(i)) throw new _("A feature can’t depend on itself.", "refused", i.laneId, i.id);
      return i.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? i.dependsOn ?? [] : [], ...m.map((C) => C.id)])], y(q(r, o, i.laneId, i.id), P(i.label) + " now depends on " + Ie(m.map((C) => P(C.label))) + ".", x);
    }
    case "set_outcome": {
      const i = A(n.card), m = v(n.lane), x = r.signals ?? (r.signals = []), C = n.label, $ = C === void 0 ? x.filter((N) => N.cardId === i.id && N.laneId === m.id) : x.filter((N) => N.cardId === i.id && N.label.toLowerCase() === C.toLowerCase());
      if (C !== void 0 && $.length > 1) throw new _("Two outcomes on this card have that name.", "refused", m.id, i.id);
      if (!$.length && x.length >= 24) throw new _("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, i.id);
      let E = 1;
      for (; x.some((N) => N.id === "signal-" + E); ) E++;
      const K = { label: C ?? $[0]?.label ?? (i.label + " in " + m.label).slice(0, 80).trim(), cardId: i.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], K) : x.push({ id: "signal-" + E, ...K }), y(q(r, o, m.id, i.id), "When " + P(i.label) + " is in " + P(m.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: m.id, cardId: i.id });
    }
    case "remove_outcome": {
      const i = A(n.card), m = (r.signals ?? []).filter((x) => x.cardId === i.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new _(P(i.label) + " has no outcome to remove.", "refused", i.laneId, i.id);
        Xe(r, (x) => x.cardId === i.id);
      } else {
        const x = I(m, Pn(m, "outcomes?", "outcome"), n.outcome, "outcome", i.laneId);
        Xe(r, (C) => C.id === x.id);
      }
      return y(q(r, o, i.laneId, i.id), "Removed the outcome from " + P(i.label) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "set_presentation_order": {
      const i = n.lanes.map((m) => v(m));
      if (i.length !== r.lanes.length || new Set(i).size !== r.lanes.length) throw new _("Include each scene once in the presentation order.", "refused");
      return r.presentationOrder = i.map((m) => m.id), y(q(r, o), R(i));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new _("Say before or after, not both.", "invalid_edit");
      const i = v(n.lane), m = n.before ?? n.after, x = m === void 0 ? void 0 : v(m);
      if (x && x.id === i.id) throw new _("Choose two different scenes.", "refused", i.id);
      const C = Hn(r).filter(($) => $.id !== i.id);
      return C.splice(x ? C.findIndex(($) => $.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, i), r.presentationOrder = C.map(($) => $.id), y(q(r, o, i.id), R(C), { laneId: i.id });
    }
    case "add_station": {
      const i = v(n.from);
      let m;
      try {
        m = wt(r, i.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (C) {
        throw new _(C.message, "refused", i.id);
      }
      const x = m.lanes[m.lanes.length - 1];
      return y(m, "Added a path from " + P(i.label) + " to " + P(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const i = v(n.before), m = n.from === void 0 ? void 0 : v(n.from), x = m ? [m] : r.lanes.filter((E) => E.station.next.includes(i.id));
      if (m && !m.station.next.includes(i.id))
        throw new _("There is no path from " + P(m.label) + " to " + P(i.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!x.length) throw new _("Nothing leads to " + P(i.label) + " yet. Try “Add " + n.label + " after " + i.label + "”.", "refused", i.id);
      let C;
      try {
        C = wt(r, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (E) {
        throw new _(E.message, "refused", i.id);
      }
      const $ = C.lanes[C.lanes.length - 1];
      for (const E of C.lanes)
        x.some((M) => M.id === E.id) && (E.station.next = [...new Set(E.station.next.map((M) => M === i.id ? $.id : M))]);
      return $.station.next = [i.id], y(q(C, o, $.id), "Added " + P($.label) + " before " + P(i.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const i = v(n.from), m = v(n.to);
      if (i.id === m.id) throw new _("Connect two different steps.", "refused", i.id);
      return i.station.next.includes(m.id) ? y(r, P(i.label) + " already leads to " + P(m.label) + ".", { laneId: i.id }, !1) : (i.station.next.push(m.id), y(q(r, o, i.id), "Connected " + P(i.label) + " to " + P(m.label) + ".", { laneId: i.id }));
    }
    case "disconnect_stations": {
      const i = v(n.from), m = v(n.to);
      if (!i.station.next.includes(m.id)) throw new _("There is no path between " + P(i.label) + " and " + P(m.label) + ".", "refused", i.id);
      return i.station.next = i.station.next.filter((x) => x !== m.id), y(q(r, o, i.id), "Removed the path from " + P(i.label) + " to " + P(m.label) + ".", { laneId: i.id });
    }
    case "set_station_outcome": {
      const i = v(n.station);
      return i.station.outcome = n.outcome, y(q(r, o, i.id), "Changed what happens at " + P(i.label) + ".", { laneId: i.id });
    }
    case "set_station_position": {
      const i = v(n.station);
      return Object.assign(i.station, { column: n.column, row: n.row }), y(q(r, o, i.id), "Moved " + P(i.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: i.id });
    }
    case "set_station_image": {
      const i = v(n.station);
      return n.image === null ? (delete i.station.image, y(q(r, o, i.id), "Removed the image at " + P(i.label) + ".", { laneId: i.id })) : (i.station.image = { src: n.image.src, alt: n.image.alt }, y(q(r, o, i.id), "Updated the image at " + P(i.label) + ".", { laneId: i.id }));
    }
    case "set_station_image_alt": {
      const i = v(n.station);
      if (!i.station.image) throw new _("Add a station image before changing its description.", "refused", i.id);
      return i.station.image.alt = n.alt, y(q(r, o, i.id), "Updated the image description at " + P(i.label) + ".", { laneId: i.id });
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
        if (r.cards.some((H) => H.id === N) || r.lanes.some((H) => H.id === N))
          throw new _("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", i.laneId, i.id);
        x = N, C = "the note " + N, n.direction === "from_note" && ([m, x] = [x, m]);
      }
      const $ = Rt(r, m, x, n.label ? { label: n.label } : {}), E = De(r, $);
      if (E) throw new _(E, "refused", i.laneId, i.id);
      const M = on(r, $), K = m === i.id;
      return y(
        M,
        K ? "Drew a line from " + P(i.label) + " to " + C + "." : "Drew a line from " + C + " to " + P(i.label) + ".",
        { laneId: i.laneId, cardId: i.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const i = A(n.card), m = n.kind === "disconnect_cards" ? A(n.to, i.laneId).id : n.note.trim(), x = n.kind === "disconnect_cards" ? P(r.cards.find((E) => E.id === m).label) : "the note " + m, C = (E) => E.parentId === i.id && E.childId === m || E.parentId === m && E.childId === i.id, $ = r.lines ?? [];
      return $.some(C) ? (r.lines = $.filter((E) => !C(E)), y(q(r, o, i.laneId, i.id), "Took away the line between " + P(i.label) + " and " + x + ".", { laneId: i.laneId, cardId: i.id })) : y(e, P(i.label) + " and " + x + " are not joined by a line.", { laneId: i.laneId, cardId: i.id }, !1);
    }
  }
  function J(i, m) {
    const x = { laneId: m.id, cardId: i.id };
    if (i.laneId === m.id)
      return y(e, P(i.label) + " is already " + (l ? "at " : "in ") + P(m.label) + ".", x, !1);
    const C = Pe(e, i.id, m.id);
    if (!C) throw new _(nn(e, i.id, m.id) ?? "That move is not available.", "refused", m.id, i.id);
    return y(q(C, o, m.id, i.id), "Moved " + P(i.label) + " to " + P(m.label) + ".", x);
  }
}
function Xe(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function mo(e, n, o = {}) {
  const t = (I) => ({ refused: { index: 0, kind: null, laneId: null, ...I } });
  let r;
  try {
    r = Z(e);
  } catch (I) {
    return t({ reason: "The workshop cannot be read: " + (I instanceof Error ? I.message : String(I)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const l = r, u = [];
  for (const [I, v] of n.entries()) {
    const A = v?.kind, S = typeof A == "string" ? lo.get(A) : void 0;
    if (!v || typeof v != "object" || !S)
      return t({
        index: I,
        kind: typeof A == "string" ? A : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(A)) + ". The edits are " + Ie(jn.map((i) => i.kind)) + "."
      });
    const y = ho(v, S);
    if (y) return t({ index: I, kind: S.kind, code: "invalid_edit", reason: y });
    const L = sn(r);
    if (!S.boards.includes(L))
      return t({ index: I, kind: S.kind, code: "not_on_this_board", reason: S.refusals[L] ?? "This workshop does not take " + S.kind + "." });
    let R;
    try {
      R = po(r, v, L, o.selection);
    } catch (i) {
      if (!(i instanceof _)) throw i;
      return t({
        index: I,
        kind: S.kind,
        reason: i.reason,
        code: i.code,
        laneId: i.laneId,
        ...i.cardId && { cardId: i.cardId },
        ...i.candidates && { candidates: i.candidates }
      });
    }
    const J = go(r, R.board);
    if (J) return t({ index: I, kind: S.kind, reason: J, code: "not_on_this_board", laneId: R.laneId ?? null });
    r = R.board, u.push({
      index: I,
      kind: S.kind,
      said: R.said,
      changed: R.changed ?? !0,
      ...R.laneId && { laneId: R.laneId },
      ...R.cardId && { cardId: R.cardId }
    });
  }
  const w = new Map(l.cards.map((I) => [I.id, I.laneId])), k = r.cards.flatMap((I) => {
    const v = w.get(I.id);
    return v === void 0 || v === I.laneId ? [] : [{ cardId: I.id, fromLaneId: v, toLaneId: I.laneId }];
  });
  return { workshop: r, report: { edits: u, movedCards: k } };
}
const wo = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map"
};
function go(e, n) {
  const o = Z(e), t = sn(o);
  let r;
  try {
    r = Z(n);
  } catch (k) {
    return an(k instanceof Error ? k.message : String(k), t);
  }
  const l = sn(r), u = (k, I) => k.lanes.length === I.lanes.length && k.lanes.every((v) => I.lanes.some((A) => A.id === v.id)), w = (k, I) => k.lanes.every((v, A) => I.lanes[A]?.id === v.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && l !== t)
    return u(o, r) ? j.keepsCards : j.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !w(o, r)) return j.keepsOrder;
  if (t === "release-plan" && l === "release-plan") {
    if (!u(o, r)) return j.releaseLanes;
    if (!w(o, r)) return j.releaseOrder;
    if (r.cards.some((k) => !o.cards.some((I) => I.id === k.id))) return j.releaseCards;
  }
  return t !== l ? "This slate holds a " + wo[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
function yo(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Io(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), bo(n), n;
}
function ko(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function bo(e) {
  return e && ko(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function lt(e) {
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
function Io(e) {
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
function Cn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const dt = "#1f7a5c", ct = "#5b9a85", Sn = "#c2410c", vo = "#2f5fd0", xo = { canMove: !1, canSelect: !1 };
function Ao(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function dr(e, n, o = {}) {
  let t = Z(n), r = null, l = !!o.readOnly, u = !1;
  const w = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  let S = null, y = null, L = null;
  const R = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
  let i = null, m = Promise.resolve(), x = null, C = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const $ = { ...o.style };
  let E = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), K = null, N = !1;
  const H = /* @__PURE__ */ new Map();
  de(t, { layout: C });
  const G = o.origin ? { x: o.origin.x, y: o.origin.y } : So(e), He = (s) => A.get(s) ?? s, ne = (s) => Ao(He(s));
  function X(s) {
    const a = v.get(s);
    if (a) return a;
    if (w.has(s) && !A.has(s) || !e.nodes.one?.(s)) return s;
    const d = Ft(s, (c) => !!e.nodes.one?.(c) || A.has(c));
    return v.set(s, d), A.set(d, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const le = {
    governs(s) {
      if (w.get(s.id) !== s) return null;
      const a = ne(s.id)?.kind;
      return a === "card" ? { canMove: !l, canEditText: !l && !r && t.kind !== "release-plan", canConnect: _e() } : a === "lane" ? { canMove: !1, canEditText: !l && !r } : xo;
    },
    onStart(s, a) {
      const d = ne(s.id).key;
      if (l || r || !t.cards.some((f) => f.id === d)) return !1;
      te(), xe();
      const c = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      let b = null;
      try {
        b = o.chooseCandidate?.(t, d, c) ?? null;
      } catch (f) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", f);
      }
      return S = { cardId: d, evaluate: b, outcome: { kind: "home" } }, W(t, { skip: d }), !0;
    },
    onMove(s, a) {
      if (!S) return;
      const d = Gn(S.cardId, a, S.evaluate);
      if (Co(d, S.outcome)) return;
      S.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      W(c ?? t, { skip: S.cardId }), U(o.onPreview, c);
    },
    onEnd(s, a) {
      if (!S) return { accept: !1 };
      const { cardId: d, evaluate: c } = S, b = Gn(d, a, c), f = t.cards.find((p) => p.id === d);
      if (S = null, U(o.onPreview, null), b.kind === "candidate") {
        t = b.next, W(t, { skip: d });
        const p = t.lanes.find((g) => g.id === b.laneId);
        e.announce?.(`${Y(f)} moved to ${p.label}. ${he(t, p.id)}.`), U(o.onChange, t, { cardId: d, laneId: b.laneId });
        const h = eo(t, He(s.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (b.kind === "refused")
        Qt(Y(f), { cardId: d, laneId: b.laneId, reason: b.reason });
      else if (b.kind === "outside" && Fe(t) && !Ue()) {
        const p = tn(t, d);
        if (!p)
          return kn(d, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        W(t, { skip: d }), e.announce?.(p), U(o.onRefuse, { cardId: d, laneId: null, reason: p });
      } else
        W(t, { skip: d }), b.kind === "outside" && (e.announce?.(`${Y(f)} was not dropped on a lane. It stays where it was.`), U(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      const a = S && t.cards.find((d) => d.id === S.cardId);
      S = null, U(o.onPreview, null), W(t, { skip: ne(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Y(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const c = ne(s.id);
      if (!c || l || r) return !1;
      const b = a.replace(/\s+/g, " ").trim(), f = c.kind === "lane" ? { laneId: c.key, label: b } : { cardId: c.key, label: b }, p = mo(t, [c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: b } : { kind: "rename_card", card: { id: c.key }, label: b }]);
      if ("refused" in p) {
        const { reason: h } = p.refused;
        return e.announce?.(`${d} keeps its name. ${h}`), U(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: f, reason: h }), !1;
      }
      return b === d ? !1 : (t = p.workshop, W(t), e.announce?.(`${d} renamed to ${b}.`), U(o.onChange, t, { rename: f }), b);
    },
    onKeyDown(s, a) {
      const d = ne(s.id);
      if (d?.kind !== "card" || l || r || S || a.ctrlKey || a.metaKey || a.altKey) return !1;
      const c = t.cards.find((b) => b.id === d.key);
      if (!c) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), qn(c.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Ht())
        return a.preventDefault(), qn(c.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (y?.cardId !== c.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: b, next: f, spot: p } = y;
        if (y = null, b === null)
          return U(o.onPreview, null), kn(c.id, p), !0;
        t = f, W(t), ke(b), U(o.onPreview, null);
        const h = t.lanes.find((g) => g.id === b);
        return e.announce?.(`${Y(c)} moved to ${h.label}. ${he(t, b)}.`), U(o.onChange, t, { cardId: c.id, laneId: b }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), xe(), e.announce?.(`Move cancelled. ${Y(c)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => w.get(a.id) === a).map((a) => a.id);
      N = s.length === 1, w.clear(), k.clear(), I.clear(), H.clear(), v.clear(), A.clear(), S = null, y = null, W(r ?? t, { animate: !1 }), s.length === 1 && (m = m.then(() => {
        N = !1;
        const a = w.get(s[0]);
        if (!u && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        mn();
      }));
    }
  };
  le.onFreeMove = (s, a) => {
    if (!Ge() || s.options?.isComment) return wn();
    const d = qe(a), c = Ke(s), b = t.lanes.filter((p) => !Ne(s) && Te(t, p.id, c) === null).map((p) => p.id), f = d ? Ne(s) ?? Te(t, d, c) : null;
    L && L.noteId === s.id && L.laneId === d && L.refusal === f || (L = { noteId: s.id, laneId: d, refusal: f, open: b }, pe());
  }, le.onFreeDrop = (s, a, d) => {
    if (wn(), !Ge() || s.options?.isComment) return;
    const c = qe(a);
    if (!c) return;
    const b = Ke(s), f = t.lanes.find((h) => h.id === c), p = Ne(s) ?? Te(t, c, b);
    return p ? (te(!1), i = { laneId: c, reason: p, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${gn(b.label)} can't go in ${f.label}. ${p}`), U(o.onRefuse, { noteId: s.id, laneId: c, reason: p }), "refused") : (yn([{ node: s, offer: b, from: d }], c), "taken");
  }, le.onFreeGroupDrop = (s, a, d) => {
    if (wn(), !Ge() || s.some((h) => h.options?.isComment)) return;
    const c = qe(a);
    if (!c) return;
    const b = t.lanes.find((h) => h.id === c), f = s.map((h) => ({ node: h, offer: Ke(h) })), p = Gt(f, c);
    if (p) {
      te(!1), i = { laneId: c, reason: p, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${Kn(f.map((h) => gn(h.offer.label)))} can't go in ${b.label}. ${p}`);
      for (const { node: h } of f) U(o.onRefuse, { noteId: h.id, laneId: c, reason: p });
      return "refused";
    }
    return yn(f.map((h, g) => ({ ...h, from: d?.[g] })), c), "taken";
  }, le.onFreeTextCommit = (s) => {
    if (!Ge() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = qe({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = Ke(s), b = t.lanes.find((O) => O.id === d), f = Ne(s) ?? Te(t, d, c);
    if (!f) {
      yn([{ node: s, offer: c }], d);
      return;
    }
    te(!1), i = { laneId: d, reason: f, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${gn(c.label)} can't go in ${b.label}. ${f} It is beside the board.`), U(o.onRefuse, { noteId: s.id, laneId: d, reason: f });
    const { width: p } = de(t, { layout: C }), h = Math.round(G.x + p + 32), g = Math.round(a.y ?? G.y);
    s.position(h, g, () => e.updateSelectionResizeRotate?.(), void 0, Cn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [lt({ ...s.options, x: h, y: g })] });
  }, le.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...R], lines: (t.lines ?? []).map((s) => ({ ...s })) }), le.onUndoRestore = (s, a) => {
    if (u) return;
    const d = new Map((s?.cards ?? []).map((f) => [f.id, f])), c = new Map(s?.pairs ?? []), b = (f) => R.get(f) ?? c.get(f) ?? f;
    for (const f of a.added) {
      const p = b(f), h = t.cards.find((O) => O.id === p);
      if (!h) continue;
      t = Z({ ...t, cards: t.cards.filter((O) => O !== h), lines: Se(t.lines, p, f) }), W(t);
      const g = U(o.onChange, t, { cardId: p, cardToNote: { noteId: f } });
      e.holdTrade?.(f, g), Tn(g);
    }
    for (const f of a.removed) {
      const p = b(f), h = d.get(p);
      if (!h || t.cards.some((B) => B.id === p)) continue;
      const g = (s?.lines ?? []).filter((B) => B.parentId === p || B.childId === p), O = {
        id: p,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...g.length ? { lines: g } : {}
      }, T = [h.laneId, ...t.lanes.map((B) => B.id)].find((B) => ze(t, B, O));
      if (!T) {
        e.announce?.(`${Y(h)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Yt(ze(t, T, O), p, s?.cards ?? []), p !== f && R.set(f, p), W(t);
      const z = t.cards.findIndex((B) => B.id === p), D = t.cards.slice(z + 1).find((B) => B.laneId === T)?.id, F = U(o.onChange, t, { cardId: p, laneId: T, noteToCard: {
        noteId: f,
        label: h.label,
        ...h.look ? { look: h.look } : {},
        ...h.asNote ? { asNote: h.asNote } : {},
        ...D ? { before: D } : {},
        ...g.length ? { lines: Se(g, p, f) } : {}
      } });
      e.holdTrade?.(f, F), Tn(F);
    }
    Array.isArray(s?.lines) && Zt(s.lines);
  };
  let se = !1;
  le.onNodeAdded = (s) => {
    u || se || w.get(s.id) === s || (t.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (se = !0, queueMicrotask(() => {
      se = !1, u || pe();
    }));
  }, le.onLine = (s, a) => {
    u || queueMicrotask(() => {
      u || Kt(s, a);
    });
  };
  const Be = e.setDragPolicy(le), Dt = o.onSelect && e.onSelectionChange?.(() => mn()), Un = () => {
    y && xe();
  };
  e.element?.addEventListener?.("pointerdown", Un, !0), W(t, { animate: !1 });
  function Gn(s, a, d) {
    const c = t.cards.find((T) => T.id === s);
    if (!c) return { kind: "outside" };
    const b = t.lanes.map((T) => w.get(X(ie.column(T.id)))).filter(Boolean), f = e.hitTestNodes(a, b, { padding: 6 }), p = f ? ne(f.id).key : null;
    if (!p) return { kind: "outside" };
    if (p === c.laneId) return { kind: "home" };
    const h = Pe(t, s, p);
    if (!h) return { kind: "refused", laneId: p, reason: nn(t, s, p) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: p, next: h };
    let g = null;
    try {
      g = d({ x: a.x - G.x, y: a.y - G.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: p, next: h };
    }
    const O = g?.cards.find((T) => T.id === s)?.laneId;
    return !g || !O || O === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: O, next: g };
  }
  function Ht() {
    return new Set(de(t, { layout: C }).places.map((s) => s.row)).size > 1;
  }
  function qn(s, a, d = !1) {
    const c = t.cards.find((T) => T.id === s), b = ut(t, s), f = y?.cardId === s && y.laneId === null ? y.side : void 0;
    if (f !== void 0) {
      if (d || a === f) return;
      const T = f > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (xe(), T.id === c.laneId) {
        ke(T.id, r ?? t), e.announce?.(`${Y(c)} is back in ${T.label}.`);
        return;
      }
      if (b.includes(T)) {
        const D = Pe(t, s, T.id);
        y = { cardId: s, laneId: T.id, next: D }, W(D), ke(T.id, D), U(o.onPreview, D), e.announce?.(`${Y(c)} to ${T.label}: ${he(D, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const z = nn(t, s, T.id) ?? "That move is not available.";
      te(), i = { laneId: T.id, reason: z, timer: setTimeout(() => te(), 1500) }, W(r ?? t), ke(T.id, r ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${z}`), U(o.onRefuse, { cardId: s, laneId: T.id, reason: z });
      return;
    }
    const p = y?.cardId === s ? y.laneId : c.laneId;
    let h;
    if (d) {
      const { places: T } = de(t, { layout: C }), z = T.find((D) => D.laneId === p);
      h = T.filter((D) => D.column === z.column && (D.row - z.row) * a > 0).sort((D, F) => (D.row - F.row) * a).map((D) => t.lanes.find((F) => F.id === D.laneId));
    } else {
      const T = t.lanes.findIndex((z) => z.id === p);
      h = a > 0 ? t.lanes.slice(T + 1) : t.lanes.slice(0, T).reverse();
    }
    const g = h.find((T) => b.includes(T));
    if (te(), !g) {
      const T = h[0];
      if (!T) {
        if (!d && Fe(t)) {
          const D = tn(t, s);
          if (D) {
            e.announce?.(D), U(o.onRefuse, { cardId: s, laneId: null, reason: D });
            return;
          }
          Bt(c, a);
          return;
        }
        e.announce?.(`${Y(c)} has no lane to move to on that side.`);
        return;
      }
      const z = nn(t, s, T.id) ?? "That move is not available.";
      i = { laneId: T.id, reason: z, timer: setTimeout(() => te(), 1500) }, W(y?.next ?? r ?? t), ke(T.id, y?.next ?? r ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${z}`), U(o.onRefuse, { cardId: s, laneId: T.id, reason: z });
      return;
    }
    if (g.id === c.laneId) {
      xe(), ke(g.id, r ?? t), e.announce?.(`${Y(c)} is back in ${g.label}.`);
      return;
    }
    const O = Pe(t, s, g.id);
    y = { cardId: s, laneId: g.id, next: O }, W(O), ke(g.id, O), U(o.onPreview, O), e.announce?.(`${Y(c)} to ${g.label}: ${he(O, g.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function ke(s, a = t) {
    const d = de(a, { layout: C, rows: et() }).places.find((g) => g.laneId === s), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const b = 16, f = (g, O, T, z) => O + b * 2 >= z || g - b < T ? g - b - T : g + O + b > T + z ? g + O + b - (T + z) : 0, p = f(G.x + d.x, d.width, c.x, c.width), h = f(G.y + d.y, d.height, c.y, c.height);
    (p || h) && e.panBy?.({ x: p, y: h });
  }
  function mn() {
    if (!o.onSelect || N) return;
    const s = u ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && w.get(s[0].id) === s[0] ? ne(s[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== K && (K = c, U(o.onSelect, d));
  }
  function xe() {
    y && (y = null, U(o.onPreview, null), W(r ?? t));
  }
  function Bt(s, a) {
    const { width: d } = de(t, { layout: C }), c = w.get(X(ie.card(s.id)))?.options, b = c?.width ?? 228, f = { x: a > 0 ? G.x + d + 32 : G.x - b - 32, y: c?.y ?? G.y }, p = ht(t, s.id);
    y = { cardId: s.id, laneId: null, side: a, spot: f, next: t }, W(t), U(o.onPreview, p), e.announce?.(`${Y(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ue() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ge() {
    return !u && !l && !r && !S && !Ue() && Fe(t);
  }
  function wn() {
    L && (L = null, u || pe());
  }
  function qe(s) {
    const a = t.lanes.map((c) => w.get(X(ie.column(c.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? ne(d.id)?.key ?? null : null;
  }
  function Ke(s) {
    const a = s.options ?? {}, d = Pt({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), b = c.replace(/\s+/g, " ").trim(), f = {};
    c.trim() !== b && c.length <= 4e3 && (f.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (f.shape = a.shape);
    for (const h of ["width", "height"]) Number.isFinite(a[h]) && a[h] >= 10 && a[h] <= 4e3 && (f[h] = Math.round(a[h]));
    if (On(a.image)) {
      f.image = { src: a.image };
      for (const [h, g] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[g]) && a[g] >= 1 && a[g] <= 2e4 && (f.image[h] = a[g]);
    }
    a.link?.data && ft({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (f.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const p = Ut(s);
    return { id: s.id, label: b, ...d ? { look: d } : {}, ...Object.keys(f).length ? { asNote: f } : {}, ...p.length ? { lines: p } : {} };
  }
  function Ut(s) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!w.get(c) && w.get(c) === e.nodes.one(c);
    for (const c of s.relationships?.getAssociations?.() ?? [])
      !c.targetPoint && !d(c.childId) && a.set(c.id, Re(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === s || d(c.id)))
        for (const b of c.relationships?.getAssociations?.() ?? [])
          b.childId === s.id && !b.targetPoint && a.set(b.id, Re(b));
    for (const c of pt(t, s.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function Kn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function Gt(s, a) {
    for (const { node: f } of s) {
      const p = Ne(f);
      if (p) return p;
    }
    const d = t.lanes.find((f) => f.id === a), c = t.cards.filter((f) => f.laneId === a).length;
    if (d.capacity !== void 0 && c + s.length > d.capacity) {
      const f = d.capacity - c;
      return f > 0 ? `It has room for ${f} more ${f === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let b = t;
    for (const { offer: f } of s) {
      const p = Te(b, a, f);
      if (p) return p;
      b = ze(b, a, f);
    }
    return null;
  }
  function Ne(s) {
    if ((s.relationships?.getAssociations?.() ?? []).some((d) => d.targetPoint))
      return "A note with a line that ends on empty canvas stays a note. Join that line to a note first.";
    if (s.options?.image && !On(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !ft({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const gn = (s) => s || "This note", Y = (s) => s.label || "The empty card";
  function _e() {
    return !u && !l && !r && !Ue() && Fe(t);
  }
  function Re(s) {
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
    for (const d of ["sourceAnchor", "targetAnchor"]) {
      const c = s[d];
      c && Number.isFinite(c.x) && Number.isFinite(c.y) && (a[d] = { x: c.x, y: c.y });
    }
    return a;
  }
  function Jn(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function Zn(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (w.get(s.id) === s) {
      const a = ne(s.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment ? null : s.id;
  }
  function Yn(s, a) {
    if (s.cards.some((c) => c.id === a)) {
      const c = w.get(X(ie.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && w.get(a) !== d && d.svgGroup ? d : null;
  }
  function Vn(s) {
    const a = [];
    for (const d of s) {
      const c = e.nodes.one(d.parentId), b = e.nodes.one(d.childId);
      if (!c?.relationships || !b || w.get(c.id) === c || w.get(b.id) === b || c.relationships.hasAssociationId?.(d.id)) continue;
      const f = c.relationships.addAssociation(b, An(d));
      a.push({ type: "addRelationship", data: { ...f } });
    }
    return a;
  }
  function qt(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      const c = Yn(s, d.parentId), b = Yn(s, d.childId);
      if (!c || !b || c === b) continue;
      const f = w.get(c.id) !== c, p = f ? b : c, h = f ? c : b, g = f ? Jn({ ...d, parentId: p.id, childId: h.id }, d) : { ...d, parentId: p.id, childId: h.id }, O = JSON.stringify(g);
      a.add(d.id);
      const T = H.get(d.id);
      T && T.key === O && T.holder === p && T.other === h && p.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), p.relationships.addAssociation(h, An(g)), H.set(d.id, { holder: p, other: h, swapped: f, key: O }));
    }
    for (const [d, c] of [...H])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), H.delete(d));
  }
  function Je(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let Me = null;
  function Kt(s, a) {
    if (s === "addRelationship") {
      if (H.get(a?.id)?.holder.id === a?.parentId) return;
      const d = e.nodes.one(a?.parentId), c = a?.targetPoint ? null : e.nodes.one(a?.childId), b = Zn(d), f = Zn(c), p = Me?.lineId === a?.id ? t.lines?.find((T) => T.id === a?.id) : void 0;
      p && (Me = null);
      const h = (T) => {
        Je(a), p && W(r ?? t), e.announce?.(T), U(o.onRefuse, { reason: T, laneId: null });
      };
      if (!_e()) {
        Je(a), p && W(r ?? t);
        return;
      }
      if (!b || !f) return h(p ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      if (p) {
        const T = t.cards.some((B) => B.id === b), z = t.cards.some((B) => B.id === f);
        if (!T && !z) return be({ remove: p.id });
        const D = { ...Re(a), id: p.id, parentId: b, childId: f }, F = De(t, D);
        if (F) return h(F);
        Je(a), be({ set: D });
        return;
      }
      const g = Rt(t, b, f, Re(a)), O = De(t, g);
      if (O) return h(O);
      Je(a), be({ set: g });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...H].find(([b, f]) => (b === a?.id || !a?.id && f.other.id === a?.childId) && f.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = H.get(d);
      if (H.delete(d), e.nodes.one(c.holder.id) !== c.holder || e.nodes.one(c.other.id) !== c.other || !_e())
        return _e() || u ? void 0 : W(r ?? t);
      Me = { lineId: d }, queueMicrotask(() => {
        u || Me?.lineId !== d || (Me = null, be({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...H].find(([T, z]) => T === d?.associationId && z.holder.id === d?.id);
        if (!c) continue;
        const [b, f] = c, p = t.lines?.find((T) => T.id === b), h = f.holder.relationships?.getAssociations?.().find((T) => T.id === b);
        if (!p || !h) continue;
        if (!_e()) {
          W(r ?? t);
          continue;
        }
        const g = Re(h), O = f.swapped ? Jn({ ...g, id: p.id, parentId: p.parentId, childId: p.childId }, g) : { ...g, id: p.id, parentId: p.parentId, childId: p.childId };
        JSON.stringify(Jt(O)) !== JSON.stringify(p) && (H.set(b, { ...f, key: "" }), be({ set: O }));
      }
  }
  function Jt(s) {
    return on({ ...t, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function be(s) {
    const a = t.lines?.find((h) => h.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? on(t, s.set) : mt(t, s.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), W(r ?? t);
    const c = "set" in s ? s.set : a, b = [c.parentId, c.childId].map((h) => t.cards.find((g) => g.id === h)?.label ?? e.nodes.one(h)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), f = (h) => b[h] || "a note";
    e.announce?.("set" in s ? a ? `The line from ${f(0)} to ${f(1)} changed.` : `${f(0)} is joined to ${f(1)}.` : `The line from ${f(0)} to ${f(1)} was taken away.`);
    const p = U(o.onChange, t, { line: s });
    Tn(p, () => {
      if (u || t !== d) return;
      const h = a ? on(t, a) : "set" in s ? mt(t, s.set.id) : null;
      h && (t = h, W(r ?? t));
    });
  }
  function Zt(s) {
    const a = new Map(s.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || be({ remove: c });
    for (const [c, b] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(b) && De(t, b) === null && be({ set: b });
  }
  function yn(s, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), b = s.map(({ node: h, offer: g, from: O }) => {
      let T = g.lines;
      for (const [F, B] of c) T = Se(T, F, B);
      d = ze(d, a, { ...g, ...T ? { lines: T } : {} });
      const z = d.cards[d.cards.length - 1];
      z.id !== h.id && c.set(h.id, z.id);
      const D = { ...h.options ?? {}, ...O ? { x: O.x, y: O.y } : {} };
      return { node: h, card: z, kept: D, lines: Se(T ?? [], h.id, z.id) };
    });
    e.beginHostStep?.(), t = d;
    let f = t;
    for (const { node: h, card: g } of b)
      g.id !== h.id && R.set(h.id, g.id), J.set(X(ie.card(g.id)), { x: h.options?.x ?? 0, y: h.options?.y ?? 0 }), Ae(() => e.removeNode(h.id));
    e.endHostStep?.(), W(t), Vt(X(ie.card(b[0].card.id)));
    const p = t.lanes.find((h) => h.id === a);
    e.announce?.(b.length === 1 ? `${Y(b[0].card)} is now a card in ${p.label}. ${he(t, a)}.` : `${Kn(b.map(({ card: h }) => Y(h)))} are now cards in ${p.label}. ${he(t, a)}.`);
    for (const { node: h, card: g, kept: O, lines: T } of b) {
      const z = { cardId: g.id, laneId: a, noteToCard: {
        noteId: h.id,
        label: g.label,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...T.length ? { lines: T } : {}
      } }, D = () => {
        t !== f || !t.cards.some((B) => B.id === g.id) || (t = Z({ ...t, cards: t.cards.filter((B) => B.id !== g.id), lines: Se(t.lines, g.id, h.id) }), f = t, W(t));
      }, F = U(o.onChange, t, z);
      e.holdTrade?.(h.id, F), Qn(F, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: h.id, isComment: !1 } }]);
      }, () => {
        if (!u) {
          if (D(), !e.nodes.one(O.id)) {
            e.beginHostStep?.();
            const B = Ae(() => e.addNode({ ...O }));
            B && (B.announcedByCreator = !0), e.endHostStep?.();
            const me = Se(T, g.id, h.id).filter((Ze) => !t.cards.some((oe) => oe.id === Ze.parentId || oe.id === Ze.childId));
            B?.ready?.then?.(() => {
              u || Ae(() => Vn(me));
            });
          }
          e.announce?.(`${Y(g)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        u || (D(), e.keepTrade?.(h.id), e.announce?.(`Someone else put ${Y(g)} on the board first.`));
      });
    }
  }
  function kn(s, a) {
    const d = t.cards.find((Q) => Q.id === s), c = t.lanes.find((Q) => Q.id === d.laneId), b = t.cards.findIndex((Q) => Q.id === s), f = t.cards.slice(b + 1).find((Q) => Q.laneId === d.laneId)?.id, p = k.get(X(ie.card(s))) ?? {}, h = Ct(d), g = e.nodes.one(h) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : h, O = pt(t, s), { leave: T } = Wo(t, s, g), z = ht(t, s, g), D = ($.cornerRadius ?? 0) > 0, F = d.asNote, B = F?.text !== void 0 && St(F.text) === d.label ? F.text : d.label, me = {
      id: g,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: F?.width ?? p.width ?? 228,
      height: F?.height ?? p.height ?? 76,
      text: B,
      shape: F?.shape ?? (D ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? p.backgroundColor,
      fontColor: d.look?.textColor ?? p.foregroundColor,
      fontSize: d.look?.fontSize ?? p.fontSize,
      borderColor: d.look?.borderColor ?? p.borderColor,
      borderWidth: d.look?.borderWidth ?? p.borderWidth,
      ...d.look?.fontFamily ?? p.fontFamily ? { fontFamily: d.look?.fontFamily ?? p.fontFamily } : {}
    };
    F?.image && Object.assign(me, {
      image: F.image.src,
      ...F.image.width ? { imageOrigWidth: F.image.width } : {},
      ...F.image.height ? { imageOrigHeight: F.image.height } : {}
    }), F?.link && (me.link = { ...F.link });
    for (const Q of Object.keys(me)) me[Q] === void 0 && delete me[Q];
    e.beginHostStep?.(), t = z;
    const Ze = t;
    g !== s ? R.set(g, s) : R.delete(g);
    const oe = Ae(() => e.addNode(me));
    oe && (oe.announcedByCreator = !0), e.endHostStep?.(), W(t);
    const no = Promise.resolve(oe?.ready).then(() => u || !oe || e.nodes.one(g) !== oe ? [] : Ae(() => Vn(T))).catch(() => []);
    oe?.ready?.then?.(() => {
      if (u || e.nodes.one(g) !== oe) return;
      const Q = () => e.selectNodes?.([oe]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(Q) : Q();
    }), e.announce?.(`${Y(d)} is now a note on the canvas. ${c.label}: ${he(t, c.id)}.`);
    const tt = () => {
      e.nodes.one(g) === oe && (e.beginHostStep?.(), Ae(() => e.removeNode(g)), e.endHostStep?.());
    }, ot = U(o.onChange, t, { cardId: s, cardToNote: { noteId: g } });
    e.holdTrade?.(g, ot), Qn(ot, () => {
      no.then((Q) => {
        oe && e.nodes.one(g) === oe && e.sendHeld?.([{ type: "onNodeAdded", data: { id: g, nodeOptions: lt(oe.options) } }, ...Q]);
      });
    }, () => {
      if (!u) {
        if (tt(), t === Ze && !t.cards.some((Q) => Q.id === s)) {
          const Q = {
            id: s,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...O.length ? { lines: O } : {}
          }, rt = ze(t, d.laneId, Q, f);
          rt && (t = rt, W(t));
        }
        e.announce?.(`${Y(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      u || (tt(), e.keepTrade?.(g), e.announce?.(`Someone else took ${Y(d)} off the lanes first.`));
    });
  }
  function Yt(s, a, d) {
    const c = d.map((g) => g.id), b = c.indexOf(a), f = s.cards.find((g) => g.id === a);
    if (b < 0 || !f) return s;
    const p = s.cards.filter((g) => g !== f), h = p.findIndex((g) => c.indexOf(g.id) > b);
    return p.splice(h < 0 ? p.length : h, 0, f), Z({ ...s, cards: p });
  }
  function Vt(s) {
    m = m.then(() => {
      const a = w.get(s);
      if (u || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function Ae(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Qn(s, a, d, c) {
    if (!s || typeof s.then != "function") return a();
    const b = s.then((f) => {
      f === !0 ? a() : f === !1 ? d() : f === "taken" && c();
    }, () => d());
    e.holdUntil?.(b);
  }
  function Qt(s, a) {
    te(!1), i = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => te(), 1500) }, W(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), U(o.onRefuse, a);
  }
  function te(s = !0) {
    i && (clearTimeout(i.timer), i = null, s && !u && pe());
  }
  function pe() {
    W(S && S.outcome.kind === "candidate" ? S.outcome.next : y?.next ?? r ?? t, { skip: S?.cardId });
  }
  function Xn(s) {
    const a = kt(s, { native: !0, origin: G, rows: et(), layout: C, style: $ }).nodes, d = new Map(a.map((f) => [f.options.id, f.options])), c = (f, p, h, g = !1) => {
      const O = d.get(ie.column(f));
      O && (O.borderColor = p, O.borderWidth = h, delete O.borderStyle);
      const T = g && d.get(ie.lane(f));
      T && (T.borderColor = p, T.borderWidth = h);
    }, b = S?.cardId ?? y?.cardId;
    if (E = /* @__PURE__ */ new Map(), b) {
      const f = t.cards.find((h) => h.id === b)?.laneId;
      for (const h of ut(t, b)) h.id !== f && (c(h.id, ct, 2), E.set(h.id, "open"));
      const p = S ? S.outcome : y?.laneId ? { kind: "candidate", laneId: y.laneId } : null;
      p?.kind === "candidate" && (c(p.laneId, dt, 3, !0), E.set(p.laneId, "over")), p?.kind === "refused" && (c(p.laneId, Sn, 3), E.set(p.laneId, "refused"));
    }
    if (L && !b) {
      for (const f of L.open) f !== L.laneId && (c(f, ct, 2), E.set(f, "open"));
      L.laneId && !L.refusal && (c(L.laneId, dt, 3, !0), E.set(L.laneId, "over")), L.laneId && L.refusal && (c(L.laneId, Sn, 3), E.set(L.laneId, "refused"));
    }
    if (y?.laneId === null && y.spot) {
      const f = d.get(ie.card(y.cardId));
      f && (f.xPos = y.spot.x, f.yPos = y.spot.y);
    }
    if (i) {
      E.set(i.laneId, "refused"), c(i.laneId, Sn, 3, !0);
      const f = d.get(ie.caption(i.laneId));
      f && (f.text = i.reason, f.foregroundColor = "#b42318");
    }
    if (M = /* @__PURE__ */ new Set(), r && s === r) {
      const f = (h, g) => JSON.stringify(h) === JSON.stringify(g), p = (h) => {
        const g = d.get(h);
        g && (g.borderStyle = "dashed", g.borderColor = vo, g.borderWidth = 2, M.add(X(h)));
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
  function et() {
    return S || y ? t.lanes.map((s) => t.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function W(s, a = {}) {
    if (u) return;
    x = { model: s, skip: a.skip, animate: a.animate !== !1 };
    const d = Xn(s), c = [];
    for (const { options: f } of d) {
      const p = f.id;
      if (w.has(p)) continue;
      const h = J.get(p);
      J.delete(p);
      const g = h && a.animate !== !1 && !Cn() ? { ...f, xPos: h.x, yPos: h.y } : f, O = e.nodes.add(yo(g));
      w.set(p, O), k.set(p, { ...g }), O.ready && c.push(O.ready.then(() => {
        if (w.get(p) !== O) return;
        O.applyGovernance?.(), ne(p)?.kind === "column" && O.toBack?.(!1);
        const T = nt(x?.model ?? s, p);
        T && O.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const b = x;
    m = Promise.all([m, ...c]).then(() => {
      u || x !== b || Xt(Xn(b.model), b);
    }).catch((f) => console.warn("WORKSHOP: could not draw the workshop", f));
  }
  function Xt(s, a) {
    const d = new Set(s.map((b) => b.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [f, p] of [...w]) {
        if (d.has(f)) continue;
        for (const [g, O] of [...I])
          O.parentId !== f && O.childId !== f || (O.parent.relationships?.removeAssociation(g), I.delete(g));
        e.deselectNode?.(p), p.editor?.cancelInline?.(), w.delete(f), k.delete(f);
        const h = A.get(f);
        h && (A.delete(f), v.delete(h)), e.nodes.remove(f);
      }
      for (const { options: f } of s) {
        const p = f.id, h = w.get(p);
        if (!h?.svgGroup) continue;
        const g = k.get(p) ?? {}, O = h.editor?.isInlineEditing?.();
        (f.fontSize !== g.fontSize || f.foregroundColor !== g.foregroundColor) && (h.options.fontSize = f.fontSize, h.options.fontColor = f.foregroundColor, h.applyTextStyle?.()), f.text !== g.text && !O && h.setText?.(f.text), (f.width !== g.width || f.height !== g.height) && (f.vectorPath ? (h.options.width = f.width, h.options.height = f.height, h.setShape?.(h.options.shape, f.vectorPath), ne(p)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(f.width, f.height)), f.backgroundColor !== g.backgroundColor && h.setColors?.(f.backgroundColor), (f.borderColor !== g.borderColor || f.borderWidth !== g.borderWidth || f.borderStyle !== g.borderStyle) && (h.options.borderColor = f.borderColor, h.options.borderWidth = f.borderWidth, h.options.borderStyle = f.borderStyle, h.applyBorder?.());
        const T = f.xPos !== g.xPos || f.yPos !== g.yPos || Math.abs((h.options.x ?? 0) - f.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - f.yPos) > 0.5;
        if (p !== (a.skip && X(ie.card(a.skip))) && T) {
          const F = a.animate && !Cn() ? 180 : 0, B = c.includes(h) ? () => {
            !u && w.get(p) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          B && F && c.length === 1 && h.resizeRotate?.disable?.(), h.position(f.xPos, f.yPos, B, void 0, F);
        }
        const z = nt(a.model, p);
        z && h.svgGroup.node.getAttribute("aria-label") !== z && h.svgGroup.node.setAttribute("aria-label", z), M.has(p) ? h.svgGroup.node.setAttribute("data-workshop-proposed", "") : h.svgGroup.node.removeAttribute("data-workshop-proposed");
        const D = ne(p);
        if (D?.kind === "column") {
          const F = E.get(D.key);
          F ? h.svgGroup.node.setAttribute("data-workshop-drop", F) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        k.set(p, { ...f });
      }
      const b = /* @__PURE__ */ new Map();
      for (const f of s) for (const p of f.relationships.associations) b.set(p.id, p);
      for (const [f, p] of [...I])
        b.has(f) && w.get(p.parentId) === p.parent && w.get(p.childId) === p.child || (p.parent.relationships?.removeAssociation(f), I.delete(f));
      for (const [f, p] of b) {
        if (I.has(f)) continue;
        const h = w.get(p.parentId), g = w.get(p.childId);
        !h?.relationships || !g?.svgGroup || (h.relationships.addAssociation(g, An(p)), I.set(f, { parentId: p.parentId, childId: p.childId, parent: h, child: g }));
      }
      qt(a.model);
    }), e.notifyNodeChanged?.();
  }
  function nt(s, a) {
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
  function eo(s, a) {
    const d = kt(s, { native: !0, origin: G, layout: C, style: $ }).nodes.find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Ce() {
    S && e.cancelGovernedDrag?.("host"), S = null, y && (y = null, U(o.onPreview, null)), te(!1);
  }
  return {
    toCanvas(s) {
      if (u || l || Ue()) return "This workshop is view-only here.";
      if (!t.cards.some((b) => b.id === s)) return "That card is no longer on the board.";
      const a = tn(t, s);
      if (a) return a;
      y && xe(), r && (Ce(), r = null, W(t), e.refreshGovernance?.());
      const { width: d } = de(t, { layout: C }), c = w.get(X(ie.card(s)))?.options;
      return kn(s, { x: G.x + d + 32, y: c?.y ?? G.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...G };
    },
    get layout() {
      return { ...C };
    },
    get bounds() {
      const { width: s, height: a } = de(t, { layout: C });
      return { x: G.x, y: G.y, width: s, height: a };
    },
    setLayout(s) {
      if (u) throw new Error("This workshop has been detached.");
      const a = s?.lanesPerRow === void 0 ? {} : { lanesPerRow: s.lanesPerRow };
      de(t, { layout: a }), a.lanesPerRow !== C.lanesPerRow && (Ce(), C = a, W(r ?? t));
    },
    whenDrawn: () => m,
    update(s) {
      if (u) throw new Error("This workshop has been detached.");
      const a = Z(s);
      Ce(), t = a, W(r ?? t);
    },
    preview(s) {
      if (u) throw new Error("This workshop has been detached.");
      const a = s ? Z(s) : null;
      Ce(), r = a, W(r ?? t), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = t.lanes.find((c) => c.id === s);
      u || !d || (te(!1), i = { laneId: s, reason: a, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      u || l === !!s || (Ce(), l = !!s, W(r ?? t), e.refreshGovernance?.());
    },
    destroy() {
      u || (Ce(), u = !0, e.element?.removeEventListener?.("pointerdown", Un, !0), Dt?.(), e.withPolicyAuthority(() => {
        for (const [s, a] of H) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of I) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of w)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), I.clear(), H.clear(), w.clear(), k.clear(), v.clear(), A.clear(), Be(), N = !1, mn(), e.notifyNodeChanged?.());
    }
  };
}
function U(e, ...n) {
  try {
    return e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function Tn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function Co(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function So(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const r of n)
    o = Math.max(o, (r.options.x ?? 0) + (r.options.width ?? 0)), t = Math.min(t, r.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
function ae(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ce(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function To(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Dn(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Dn(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const At = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function Ln(e) {
  if (typeof e != "string" || !At.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function Ct(e) {
  return e.noteId ?? e.id;
}
function St(e) {
  const n = Dn(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function Tt(e) {
  const n = ae(e);
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
const $t = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, $o = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function En(e) {
  const n = ae(e), o = {}, t = (l) => {
    if (typeof l != "string" || !$t.test(l)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return l;
  }, r = (l, u, w) => {
    if (typeof l != "number" || !Number.isFinite(l) || l < u || l > w) throw new Error("A card size is out of range.");
    return l;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !$o.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = r(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = r(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Pt(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        En({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return En(n);
}
function On(e) {
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
function ft(e) {
  try {
    return !!ln({ link: e });
  } catch {
    return !1;
  }
}
function ln(e) {
  const n = ae(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const t = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (t.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    o.text = t;
  }
  if (n.image !== void 0) {
    const t = ae(n.image);
    if (!On(t.src)) throw new Error("A card keeps a picture by its web address only.");
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
    const t = ae(n.link), r = t.data;
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
const Le = 96, Po = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Lo = ["solid", "dashed", "dotted"];
function Ee(e) {
  const n = ae(e);
  if (typeof n.id != "string" || !Po.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: Ln(n.parentId), childId: Ln(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (r, l, u) => {
    const w = n[r];
    if (w != null) {
      if (typeof w != "number" || !Number.isFinite(w) || w < l || w > u) throw new Error("A line's look is out of range.");
      o[r] = w;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !$t.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Lo.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
  for (const r of ["sourceAnchor", "targetAnchor"]) {
    const l = n[r];
    if (l == null) continue;
    const u = ae(l), w = (k) => typeof k == "number" && Number.isFinite(k) && k >= 0 && k <= 1;
    if (!w(u.x) || !w(u.y) || Object.keys(u).some((k) => k !== "x" && k !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    o[r] = { x: u.x, y: u.y };
  }
  return o;
}
function Eo(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(Ee).filter((t) => n.has(t.parentId) || n.has(t.childId));
  if (ge(o.map((t) => t.id), "line ID"), o.length > Le) throw new Error(`A workshop holds up to ${Le} lines.`);
  return o;
}
function ge(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Hn({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((r) => r.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Oo(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const $e = (e) => "lane-" + e, ye = (e) => "card-" + e, fn = (e) => "image-" + e;
function cr(e) {
  const n = Oo(e);
  return Hn(e).map((o) => {
    const t = e.cards.filter((u) => u.laneId === o.id), r = n.filter((u) => u.laneId === o.id), l = [$e(o.id)];
    return o.station?.image && l.push(fn(o.id)), { lane: o, cards: t, signals: r, nodeIds: [...l, ...t.map((u) => ye(u.id))] };
  });
}
const Lt = 5, Nn = 24, _n = 3;
function Z(e) {
  const n = ae(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ce(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Lt)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > Nn)
    throw new Error("A workshop supports up to 24 cards.");
  const r = n.lanes.map((k) => {
    const I = ae(k), v = { id: ue(I.id), label: ce(I.label) };
    if (I.capacity !== void 0) {
      const A = o ? 576 : 24;
      if (typeof I.capacity != "number" || !Number.isInteger(I.capacity) || I.capacity < 1 || I.capacity > A)
        throw new Error(`Lane capacity must be a whole number from 1 to ${A}.`);
      v.capacity = I.capacity;
    }
    if (I.station !== void 0) {
      const A = ae(I.station), S = (L) => {
        if (typeof L != "number" || !Number.isInteger(L) || L < 0 || L >= _n)
          throw new Error("Use map coordinates from 0 to 2.");
        return L;
      };
      if (!Array.isArray(A.next) || A.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const y = A.next.map(ue);
      ge(y, "onward stop"), v.station = { column: S(A.column), row: S(A.row), next: y, outcome: ce(A.outcome, 160) }, A.image !== void 0 && (v.station.image = Tt(A.image));
    }
    return v;
  }), l = r.map((k) => k.id);
  if (ge(l, "lane ID"), (o || r.some((k) => k.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (r.some((k) => k.station)) {
    if (!r.every((k) => k.station)) throw new Error("Give every station on the map a position.");
    ge(r.map((k) => k.station.column + "," + k.station.row), "map position");
    for (const k of r)
      if (k.station.next.some((I) => I === k.id || !l.includes(I))) throw new Error("Connect each stop to another station on this map.");
  }
  const u = n.cards.map((k) => {
    const I = ae(k), v = { id: ue(I.id), label: To(I.label), laneId: ue(I.laneId) };
    if (!l.includes(v.laneId)) throw new Error("Card refers to an unknown lane.");
    if (I.allowedLaneIds !== void 0) {
      if (!Array.isArray(I.allowedLaneIds) || I.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (v.allowedLaneIds = I.allowedLaneIds.map(ue), ge(v.allowedLaneIds, "allowed lane"), !v.allowedLaneIds.includes(v.laneId) || !v.allowedLaneIds.every((A) => l.includes(A)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (I.look !== void 0) {
      const A = En(I.look);
      A && (v.look = A);
    }
    if (I.asNote !== void 0) {
      const A = ln(I.asNote);
      A && (v.asNote = A);
    }
    if (I.noteId !== void 0 && I.noteId !== v.id && (v.noteId = Ln(I.noteId)), o) {
      if (typeof I.points != "number" || !Number.isInteger(I.points) || I.points < 1 || I.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (v.points = I.points, I.dependsOn !== void 0) {
        if (!Array.isArray(I.dependsOn) || I.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        v.dependsOn = I.dependsOn.map(ue), ge(v.dependsOn, "dependency");
      }
    }
    return v;
  });
  ge(u.map((k) => k.id), "card ID");
  const w = { version: 1, title: t, lanes: r, cards: u };
  if (n.experience !== void 0) {
    const k = ae(n.experience);
    if (k.version !== 1 || k.kind !== "customer-interviews" && k.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    w.experience = { version: 1, kind: k.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    w.signals = n.signals.map((k) => {
      const I = ae(k), v = ue(I.cardId), A = ue(I.laneId);
      if (!u.some((S) => S.id === v) || !l.includes(A))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ue(I.id),
        label: ce(I.label),
        cardId: v,
        laneId: A,
        whenPresent: ce(I.whenPresent, 160),
        whenAbsent: ce(I.whenAbsent, 160)
      };
    }), ge(w.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0) {
    const k = Eo(n.lines, new Set(u.map((I) => I.id)));
    k.length && (w.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    w.presentationOrder = Hn({ lanes: r, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (o)
    return w.kind = "release-plan", to(w), w;
  for (const k of r)
    if (u.filter((I) => I.laneId === k.id).length > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return w;
}
const Et = 65536;
function fr(e) {
  const n = JSON.stringify(Z(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Et) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function ur(e) {
  if (e.length > Et) throw new Error("This workshop is too large to open from a link.");
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
function dn(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => cn(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((r) => r.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function Rn(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  if (t && e.kind === "release-plan") {
    const r = cn(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !dn(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
function Pe(e, n, o) {
  const t = e.cards.find((l) => l.id === n);
  if (!t || !e.lanes.some((l) => l.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return cn(e, t, o);
  const r = Uo(e, n, o);
  return r || (o === "prototype" && Oe(e) === "customer-interviews" ? null : dn(e, t).some((l) => l.id === o) ? Rn(e, n, o) : null);
}
function ut(e, n) {
  return e.lanes.filter((o) => Pe(e, n, o.id) !== null);
}
function nn(e, n, o) {
  if (Pe(e, n, o) !== null) return null;
  const t = e.cards.find((k) => k.id === n), r = e.lanes.find((k) => k.id === o);
  if (!t || !r) return "That move is not available.";
  const l = `This card can't go in ${r.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return l;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return l;
    const k = ve(e, o), I = { ...e, lanes: e.lanes.map((A) => A === r ? { id: r.id, label: r.label } : A) }, v = cn(I, t, o);
    return v ? `Needs ${ve(v, o) - k} points. It already holds ${k} of ${r.capacity} points.` : l;
  }
  const u = e.lanes.find((k) => k.id === t.laneId);
  if (u?.station && !u.station.next.includes(o)) return `${r.label} can't be reached from ${u.label}.`;
  const w = e.cards.filter((k) => k.laneId === o).length;
  return r.capacity !== void 0 && w >= r.capacity ? `It already holds ${w} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.` : l;
}
function Fe(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !Oe(e);
}
const No = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function _o(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && No.test(n) && !o.has(n) ? n : pn(e, "card");
}
function Te(e, n, o) {
  const t = e.lanes.find((l) => l.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((l) => l.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Oe(e)) return "This workshop keeps the cards it came with.";
  if (e.cards.length >= Nn) return `This board is at its size limit of ${Nn} cards. Remove a card to make room.`;
  const r = e.cards.filter((l) => l.laneId === n).length;
  if (t.capacity !== void 0 && r >= t.capacity) return `It already holds ${r} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const l = Ot(o.lines);
    if (!l) return "A line of this note can't be joined to a card.";
    const u = new Set((e.lines ?? []).map((w) => w.id));
    if ((e.lines?.length ?? 0) + l.filter((w) => !u.has(w.id)).length > Le)
      return `A workshop holds up to ${Le} lines.`;
  }
  return null;
}
function Ro(e) {
  try {
    return e && typeof e == "object" ? Pt(e) : void 0;
  } catch {
    return;
  }
}
function Mo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      ln({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? ln(n) : void 0;
}
function Ot(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let r = null;
    try {
      r = Ee(t);
    } catch {
      try {
        const { id: l, parentId: u, childId: w } = ae(t);
        r = Ee({ id: l, parentId: u, childId: w });
      } catch {
        r = null;
      }
    }
    if (!r) return null;
    o.push(r);
  }
  return o;
}
function un(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function Se(e, n, o) {
  return e && e.map((t) => un(t, n, o));
}
function Nt(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function ze(e, n, o, t) {
  if (Te(e, n, o) !== null) return null;
  const r = Ro(o.look), l = typeof o.label == "string" ? Dn(o.label) : "";
  let u = Mo(o.asNote);
  l.length > 80 && u?.text === void 0 && l.length <= 4e3 && (u = { ...u, text: l });
  const w = _o(e, o.id), k = w !== o.id && typeof o.id == "string" && At.test(o.id) ? o.id : void 0, I = {
    id: w,
    label: St(l),
    laneId: n,
    ...r ? { look: r } : {},
    ...u ? { asNote: u } : {},
    ...k ? { noteId: k } : {}
  }, v = t === void 0 ? -1 : e.cards.findIndex((y) => y.id === t && y.laneId === n), A = v < 0 ? [...e.cards, I] : [...e.cards.slice(0, v), I, ...e.cards.slice(v)], S = o.lines === void 0 ? void 0 : Nt(e, Ot(o.lines).map((y) => un(y, o.id, I.id)));
  return Z({ ...e, cards: A, ...S ? { lines: S } : {} });
}
function tn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!Fe(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((l) => e.lanes.find((u) => u.id === l).label), r = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${r}, so it stays a card.`;
  }
  return null;
}
function ht(e, n, o = _t(e, n)) {
  if (tn(e, n) !== null) return null;
  const t = e.lines?.map((r) => un(r, n, o));
  return Z({ ...e, cards: e.cards.filter((r) => r.id !== n), ...t ? { lines: t } : {} });
}
function Wo(e, n, o = _t(e, n)) {
  const t = new Set(e.cards.filter((u) => u.id !== n).map((u) => u.id)), r = (e.lines ?? []).filter((u) => u.parentId === n || u.childId === n).map((u) => un(u, n, o)), l = (u) => t.has(u.parentId) || t.has(u.childId);
  return { stay: r.filter(l), leave: r.filter((u) => !l(u)) };
}
function _t(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? Ct(o) : n;
}
function pt(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function De(e, n) {
  let o;
  try {
    o = Ee(n);
  } catch (l) {
    return l instanceof Error ? l.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((l) => l.id));
  return !t.has(o.parentId) && !t.has(o.childId) ? "That card is no longer on the board." : e.lanes.some((l) => l.id === o.parentId || l.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((l) => l.id === o.id) && (e.lines?.length ?? 0) >= Le ? `A workshop holds up to ${Le} lines.` : null;
}
function on(e, n) {
  return De(e, n) !== null ? null : Z({ ...e, lines: Nt(e, [Ee(n)]) });
}
function mt(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? Z({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function Rt(e, n, o, t = {}) {
  const r = new Set((e.lines ?? []).map((u) => u.id));
  let l = `${n}->${o}`;
  for (let u = 2; r.has(l); u++) l = `${n}->${o}~${u}`;
  return Ee({ showChildArrow: !0, ...t, id: l, parentId: n, childId: o });
}
function zo(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function he(e, n) {
  const o = e.lanes.find((l) => l.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const l = ve(e, n);
    return o.capacity ? l + " / " + o.capacity + " points" : l + " points";
  }
  const t = Go(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const r = e.cards.filter((l) => l.laneId === n).length;
  return o.capacity !== void 0 ? r + " of " + o.capacity : r + (r === 1 ? " card" : " cards");
}
const hn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, rn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Mt(e, n = hn, o = 28, t) {
  const { pitch: r, row: l, top: u } = n, w = !!e.lanes[0].station, k = e.lanes.map((A) => e.cards.filter((S) => S.laneId === A.id).length), I = u + Math.max(1, ...t ?? k) * l + 36, v = e.lanes.map((A, S) => ({
    x: w ? A.station.column * (r + o) : S * r,
    y: w ? A.station.row * I : 0
  }));
  return {
    points: v,
    width: Math.max(...v.map((A) => A.x)) + r,
    height: Math.max(...v.map((A, S) => A.y + u + (w ? Math.max(1, k[S]) : k[S] + 1) * l))
  };
}
function hr() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function pn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Wt(e) {
  const n = Z(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Fo(e, n) {
  const o = Wt(e), t = pn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Z(o);
}
function jo(e, n, o) {
  const t = Wt(e);
  return t.cards.push({
    id: pn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), Z(t);
}
function pr() {
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
function wt(e, n, o) {
  const t = Z(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = t.lanes.find((v) => v.id === n);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= Lt) throw new Error("A map can have up to five stations.");
  const l = ce(o?.label), u = ce(o?.outcome, 160), w = pn(t, "station");
  let k, I = 1 / 0;
  for (let v = 0; v < _n; v++)
    for (let A = 0; A < _n; A++) {
      if (t.lanes.some((y) => y.station.column === A && y.station.row === v)) continue;
      const S = Math.abs(r.station.column - A) + Math.abs(r.station.row - v);
      S < I && (I = S, k = { column: A, row: v });
    }
  if (!k) throw new Error("There is no free station position.");
  return r.station.next.push(w), t.lanes.push({ id: w, label: l, station: { ...k, next: [], outcome: u, ...o.image === void 0 ? {} : { image: Tt(o.image) } } }), t.presentationOrder?.push(w), t;
}
const mr = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, zt = (e) => "caption-" + e, je = (e) => "column-" + e, ie = { lane: $e, card: ye, image: fn, caption: zt, column: je };
function Ft(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function $n(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), r = e, l = n;
  return t ? `M ${t} 0 H ${r - t} Q ${r} 0 ${r} ${t} V ${l - t} Q ${r} ${l} ${r - t} ${l} H ${t} Q 0 ${l} 0 ${l - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${r} V ${l} H 0 Z`;
}
function gt(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function yt(e, n, o, t) {
  for (let r = n; r > 11; r--) {
    const l = Math.max(1, Math.floor(o / (r * 0.55)));
    if (e.split(`
`).reduce((w, k) => w + Math.max(1, Math.ceil(k.length / l)), 0) * r * 1.3 <= t) return r;
  }
  return Math.min(n, 11);
}
const jt = 152, Mn = jt + 12, Do = 12;
function Ho(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function de(e, n = {}) {
  const o = Z(e), { pitch: t, row: r, top: l } = hn, u = o.lanes.map((S) => o.cards.filter((y) => y.laneId === S.id).length), w = (S) => Math.max(u[S], (Array.isArray(n.rows) ? n.rows[S] : n.rows) ?? 0), k = !!o.lanes[0].station, I = o.lanes.some((S) => S.station?.image), v = Ho(n.layout, o.lanes.length), A = [];
  if (k) {
    const { points: S } = Mt(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((y, L) => A.push({
      laneId: y.id,
      x: S[L].x,
      y: S[L].y + (I ? y.station.row * Mn : 0),
      width: t,
      height: l + (y.station.image ? Mn : 0) + Math.max(1, w(L)) * r,
      column: y.station.column,
      row: y.station.row
    }));
  } else {
    let S = 0;
    for (let y = 0; y < o.lanes.length; y += v) {
      const L = o.lanes.slice(y, y + v), R = l + (Math.max(...L.map((J, i) => w(y + i))) + 1) * r;
      L.forEach((J, i) => A.push({ laneId: J.id, x: i * t, y: S, width: t, height: R, column: i, row: y / v })), S += R + Do;
    }
  }
  return { places: A, width: Math.max(...A.map((S) => S.x + S.width)), height: Math.max(...A.map((S) => S.y + S.height)) };
}
function Bo(e, n) {
  const { pitch: o, width: t, row: r, height: l, top: u } = hn, w = n.origin ?? { x: 0, y: 0 }, k = !!e.lanes[0].station, { places: I } = de(e, n), v = n.style ?? {}, A = v.textColor ?? We.fontColor, S = v.borderColor ?? We.borderColor, y = v.borderWidth ?? We.borderWidth, L = v.cornerRadius ?? 0, R = v.fontSize ?? We.fontSize, J = v.laneFontSize ?? R + 2, i = v.captionFontSize ?? Math.max(11, R - 1), m = [], x = ($) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: $n($.width, $.height, L),
      foregroundColor: A,
      borderColor: S,
      borderWidth: y,
      ...v.fontFamily ? { fontFamily: v.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return m.push(E), E;
  };
  e.lanes.forEach(($, E) => {
    const M = I[E], K = w.x + M.x, N = w.y + M.y, H = $.station?.image;
    x({
      id: je($.id),
      text: "",
      name: $.label,
      xPos: K + 2,
      yPos: N,
      width: o - 4,
      height: M.height,
      vectorPath: $n(o - 4, M.height, L ? L + 2 : 0),
      backgroundColor: k ? "#fcf9ed" : gt(rn[E], 0.6),
      borderColor: k ? "#a8b5aa" : gt(rn[E], 0.1),
      borderWidth: 1,
      ...k ? { borderStyle: "dashed" } : {}
    }), x({
      id: $e($.id),
      text: $.label,
      name: $.label,
      xPos: K + 8,
      yPos: N + 6,
      width: t,
      height: 58,
      backgroundColor: rn[E],
      fontSize: yt($.label, J, t - 16, 50)
    }), x({
      id: zt($.id),
      text: he(e, $.id),
      name: $.label,
      xPos: K + 8,
      yPos: N + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: i
    }), H && m.push({ options: {
      id: fn($.id),
      name: H.alt,
      text: "",
      xPos: K + 8,
      yPos: N + u,
      width: t,
      height: jt,
      shapeHint: "rectangle",
      image: H.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((G) => G.laneId === $.id).forEach((G, He) => {
      const ne = e.kind === "release-plan" ? G.label + `
` + G.points + " points" : G.label, X = k ? t - 20 : t, le = k ? l - 6 : l, se = k ? {} : { ...v.card, ...G.look }, Be = k ? L : v.card?.cornerRadius ?? L;
      x({
        id: ye(G.id),
        text: ne,
        name: G.label,
        xPos: K + (k ? 18 : 8),
        yPos: N + u + (H ? Mn : 0) + He * r,
        width: X,
        height: le,
        ...Be !== L ? { vectorPath: $n(X, le, Be) } : {},
        backgroundColor: k ? "#ffda75" : se.backgroundColor ?? v.backgroundColor ?? We.backgroundColor,
        ...se.textColor ? { foregroundColor: se.textColor } : {},
        ...se.fontFamily ? { fontFamily: se.fontFamily } : {},
        ...se.borderColor ? { borderColor: se.borderColor } : {},
        ...se.borderWidth !== void 0 ? { borderWidth: se.borderWidth } : {},
        fontSize: yt(ne, se.fontSize ?? R, X - 16, le - 8)
      });
    });
  });
  const C = new Map(m.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (C.get(je($.id)).relationships.associations = $.station.next.map((E) => ({
      id: $.id + "-to-" + E,
      parentId: je($.id),
      childId: je(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const E of $.dependsOn ?? []) {
        const M = ye(E), K = ye($.id);
        C.get(M).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${$.id}`,
          parentId: M,
          childId: K,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const $ = new Set(n.beside), E = new Set(m.map((N) => N.options.id)), M = /* @__PURE__ */ new Map();
    for (const N of [...E]) {
      if (!$.has(N)) continue;
      const H = Ft(N, (G) => $.has(G) || E.has(G));
      E.add(H), M.set(N, H);
    }
    const K = (N) => M.get(N) ?? N;
    for (const N of m) {
      N.options.id = K(N.options.id);
      for (const H of N.relationships.associations)
        H.parentId = K(H.parentId), H.childId = K(H.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: m };
}
function kt(e, n) {
  const o = Z(e);
  if (n?.native) return Bo(o, n);
  const { width: t, row: r, height: l, top: u } = hn, w = [];
  function k(y, L, R, J, i, m) {
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
  const { points: I } = Mt(o), v = 152, A = v + 12, S = o.lanes.some((y) => y.station?.image);
  o.lanes.forEach((y, L) => {
    const R = I[L].x, J = I[L].y + (S ? (y.station?.row ?? 0) * A : 0), i = y.station?.image, m = o.kind === "release-plan" ? y.label + `
` + (y.capacity ? ve(o, y.id) + " / " + y.capacity + " points" : ve(o, y.id) + " points") : y.label;
    k($e(y.id), m, R, J, u - 12, rn[L]), i && w.push({ options: {
      id: fn(y.id),
      name: i.alt,
      text: "",
      xPos: R,
      yPos: J + u,
      width: t,
      height: v,
      shapeHint: "rectangle",
      image: i.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((x) => x.laneId === y.id).forEach((x, C) => k(ye(x.id), o.kind === "release-plan" ? x.label + `
` + x.points + " points" : x.label, R, J + u + (i ? A : 0) + C * r, l, "#fffdf6"));
  });
  for (const y of o.lanes) {
    if (!y.station) continue;
    const L = w.find((R) => R.options.id === $e(y.id));
    L.relationships.associations = y.station.next.map((R) => ({ id: y.id + "-to-" + R, parentId: L.options.id, childId: $e(R), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), L.options.text = y.label + `
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
const wr = {
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
}, Wn = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Bn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function gr() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Wn.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Wn.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function yr() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Bn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Oe(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Bn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => Wn.some((r) => r.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Uo(e, n, o) {
  const t = Oe(e), r = e.cards.find((u) => u.id === n);
  if (!t || !r || r.laneId === o) return null;
  let l = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const u = e.cards.find((w) => w.laneId === o);
    if (u) {
      if (!dn(e, u).some((w) => w.id === "interviews")) return null;
      l = Rn(e, u.id, "interviews");
    }
  }
  return dn(l, r).some((u) => u.id === o) ? Rn(l, n, o) : null;
}
function Go(e, n) {
  if (Oe(e) !== "experiment-budget") return null;
  const o = Bn.find((l) => l.id === n), t = e.cards.filter((l) => l.laneId === n).length, r = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? r + " " + (r === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  We as DEFAULT_NOTE_STYLE,
  en as WorkshopReferenceError,
  wt as addWorkshopBranch,
  jo as addWorkshopCard,
  Fo as addWorkshopLane,
  mo as applyWorkshopEdits,
  dr as attachWorkshop,
  dn as availableLanes,
  oo as canHangPanel,
  Bn as channels,
  go as checkWorkshopReplacement,
  io as countWord,
  yr as createBudgetWorkshop,
  gr as createInterviewWorkshop,
  hr as createLaneWorkshop,
  pr as createWorkshopMap,
  ur as decodeWorkshopFragment,
  sr as describeFocusDarkroom,
  lr as describeWorkshopEdits,
  fr as encodeWorkshopFragment,
  Vo as handoffSummary,
  or as hangGalleryPanel,
  wr as industrialWorkshop,
  ir as initialFocusDarkroom,
  Wn as interviews,
  rn as laneColors,
  Ie as listed,
  Ye as listeningRoom,
  Xo as listeningRoomCaption,
  Nn as maxWorkshopCards,
  Le as maxWorkshopLines,
  nr as moonGallery,
  Rn as moveWorkshopCard,
  ar as named,
  mr as nightTransfer,
  rr as normalizeFocusDarkroom,
  Qo as normalizeListeningRoom,
  tr as normalizeMoonGallery,
  Jo as normalizeOfflineHandoff,
  Ko as offlineHandoff,
  Uo as planStartupMove,
  so as pointing,
  bt as printFields,
  ve as releaseLoad,
  er as releasePlan,
  Yo as resolveHandoff,
  Oo as resolveWorkshopSignals,
  Zo as reviewHandoff,
  P as said,
  Oe as startupExperienceKind,
  zn as unquoted,
  Z as validateWorkshop,
  sn as workshopBoardKind,
  Go as workshopBudgetResult,
  Pe as workshopCandidate,
  ht as workshopCardAsNote,
  tn as workshopCardAsNoteRefusal,
  St as workshopCardLabelOf,
  Wo as workshopCardLines,
  Pt as workshopCardLookOf,
  ut as workshopDestinations,
  jn as workshopEditKinds,
  Pn as workshopFinder,
  ft as workshopKeepsLink,
  On as workshopKeepsPicture,
  he as workshopLaneCaption,
  de as workshopLanePlaces,
  hn as workshopLayout,
  De as workshopLineRefusal,
  pt as workshopLinesOf,
  Rt as workshopNewLine,
  ie as workshopNodeIds,
  ze as workshopNoteCandidate,
  Ct as workshopNoteIdOf,
  Te as workshopNoteRefusal,
  Mt as workshopPositions,
  Hn as workshopPresentationLanes,
  cr as workshopPresentationScenes,
  uo as workshopReferences,
  nn as workshopRefusal,
  Se as workshopRenamedLines,
  Ft as workshopStandInId,
  Fe as workshopTakesNotes,
  kt as workshopToSlate,
  on as workshopWithLine,
  zo as workshopWithoutCardLines,
  mt as workshopWithoutLine
};
