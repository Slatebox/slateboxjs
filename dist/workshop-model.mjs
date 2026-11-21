import { D as _e } from "./NoteDefaults-1xFW0br8.mjs";
const Fo = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function jo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: r, fieldNote: l, deskNote: h, fallback: w } = e, g = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !g(l) || !g(h) || !g(w) ? null : { kind: n, version: o, stage: t, choice: r, fieldNote: l.trim(), deskNote: h.trim(), fallback: w.trim() };
}
function Do(e) {
  return { ...e, stage: "review", choice: null };
}
function Ho(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Bo(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const qe = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Uo(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: r, rightLabel: l } = e, h = (w) => typeof w == "string" && w.trim().length > 0 && w.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(w);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !h(r) || !h(l) ? null : { kind: n, version: o, mix: t, leftLabel: r.trim(), rightLabel: l.trim() };
}
function Go({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === qe.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === qe.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === qe.leftLabel && o === qe.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function be(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function Jt(e) {
  const n = new Map(e.cards.map((h) => [h.id, h])), o = new Map(e.lanes.map((h, w) => [h.id, w])), t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function l(h) {
    if (!t.has(h.id)) {
      if (r.has(h.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(h.id);
      for (const w of h.dependsOn ?? []) {
        const g = n.get(w);
        if (!g) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(g.laneId) > o.get(h.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        l(g);
      }
      r.delete(h.id), t.add(h.id);
    }
  }
  for (const h of e.cards) l(h);
  for (const h of e.lanes) {
    if (h.station) throw new Error("Release windows cannot also be map stations.");
    if (be(e, h.id) > (h.capacity ?? 1 / 0)) throw new Error(`Release "${h.label}" exceeds its point budget.`);
  }
}
function an(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((A, S) => [A.id, S])), r = t.get(o);
  if (r === void 0) return null;
  const l = r < t.get(n.laneId), h = /* @__PURE__ */ new Set([n.id]), w = [n];
  for (; w.length; ) {
    const A = w.pop();
    for (const S of e.cards) {
      if (h.has(S.id)) continue;
      const y = t.get(S.laneId);
      (l ? y > r && A.dependsOn?.includes(S.id) : y < r && S.dependsOn?.includes(A.id)) && (h.add(S.id), w.push(S));
    }
  }
  if (e.cards.filter((A) => h.has(A.id)).some((A) => A.allowedLaneIds && !A.allowedLaneIds.includes(o))) return null;
  const b = { ...e, cards: e.cards.map((A) => h.has(A.id) ? { ...A, laneId: o } : A) }, v = e.lanes[r].capacity;
  return v !== void 0 && be(b, o) > v ? null : b;
}
const qo = {
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
}, Ko = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Jo(e) {
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
    const h = /* @__PURE__ */ new Set([l.id]);
    let w = l.after;
    for (; w !== null; ) {
      if (h.has(w) || !t.has(w) || r.includes(l.id) && !r.includes(w)) return null;
      h.add(w), w = t.get(w).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: r };
}
function Yt(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function Yo(e, n) {
  return Yt(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const mt = ["firstPrint", "secondPrint", "thirdPrint"], wt = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Zo(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...wt, route: n.route };
  for (const t of mt) {
    const r = n[t];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = r.trim();
  }
  return o;
}
function Vo(e = new URLSearchParams()) {
  const n = { ...wt };
  for (const t of mt) {
    const r = e.get(t)?.trim();
    r && r.length <= 48 && (n[t] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function Qo(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", ke = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], et = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Rn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Mn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Xo = (e) => Rn(Mn(e)), Zt = [
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
], Vt = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Zt.indexOf(e.toLowerCase()), Qt = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function gt(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (r) => {
    const l = Rn(r);
    l && o.add(l);
  };
  t(e), t(Mn(e));
  for (const r of [...o]) t(r.replace(/^(?:the|my|our)\s+/i, ""));
  for (const r of [...o]) t(r.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const r of [...o]) t(r.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const kn = "[^\\p{L}\\p{N}]", nt = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + et(n) + "(?:$|" + kn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + kn + ")" + et(n) + "(?:$|" + kn + ")", "u").test(e)
], tt = ["first", "second", "third", "fourth", "fifth"];
function Xt(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + tt.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Rn(Mn(n)));
  if (!t) return null;
  const r = (t[1] ?? t[2]).toLowerCase(), l = r === "last" ? e.length - 1 : t[1] ? tt.indexOf(r) : Vt(r) - 1;
  return e[l] ?? null;
}
function bn(e, n, o, t, r) {
  const l = gt(n, o);
  if (l.some((w) => Qt.test(w))) {
    const w = t && e.find((g) => g.id === t);
    return w ? { item: w, rank: 0 } : { pointing: !0 };
  }
  for (const w of l) {
    if (!w.startsWith("@")) continue;
    const g = e.find((b) => b.id === w.slice(1));
    if (g) return { item: g, rank: 0 };
  }
  for (const [w, g] of nt.entries())
    for (const b of l) {
      const v = e.filter((A) => g(A.label.toLowerCase(), b.toLowerCase()));
      if (v.length === 1) return { item: v[0], rank: w };
      if (v.length > 1) return { several: v };
    }
  const h = r ? Xt(e, n, o) : null;
  return h ? { item: h, rank: nt.length } : {};
}
class Ze extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function $n(e, n, o, t, r = !1) {
  return { find: (g) => {
    const b = bn(e, g, n, t, r);
    if (b.item) return b.item;
    const v = gt(g, n), A = v[v.length - 1];
    if (b.pointing) throw new Ze("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (b.several) {
      const y = [...new Set(b.several.map((L) => L.label))];
      throw new Ze(y.length === 1 ? b.several.length + " " + o + "s are called " + P(y[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + P(A) + ": " + ke(y.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", b.several.map((L) => L.id));
    }
    const S = e.map((y) => y.label);
    throw new Ze("There is no " + o + " called " + P(A) + " here." + (S.length && S.length <= 6 ? " The " + o + "s are " + ke(S.map(P)) + "." : S.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((y) => y.id));
  }, attempt: (g) => bn(e, g, n, t, r).item ?? null, rank: (g) => bn(e, g, n, t, r).rank ?? 1 / 0 };
}
const me = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map"], In = ["lanes", "release-plan", "customer-interviews", "experiment-budget"];
function nn(e) {
  return e.lanes[0]?.station ? "map" : e.kind === "release-plan" ? "release-plan" : Le(e) ?? "lanes";
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
  lines: "Lines join the cards of a lane workshop to notes and to each other. This board keeps the cards it came with."
}, ee = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), Z = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), re = (e) => ({ type: "ref", of: "card", about: e }), vn = (e) => ({ map: e }), ue = { lanes: z.notMap, "release-plan": z.notMap, "customer-interviews": z.notMap, "experiment-budget": z.notMap }, Wn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ee(120, "The new name, 1 to 120 characters of plain text.") },
    boards: me,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: Z("The lane or step."), label: ee(80, "The new name, 1 to 80 characters of plain text.") },
    boards: me,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: re("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card." } },
    boards: me,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ee(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": z.releaseLanes, "customer-interviews": z.keepsLanes, "experiment-budget": z.keepsLanes, map: z.mapAddLane }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Z("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": z.releaseLanes, "customer-interviews": z.keepsLanes, "experiment-budget": z.keepsLanes }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: Z("The lane or step it starts in."),
      label: ee(80, "What the card says. Left out, the card is empty (on a map, the token is numbered).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." }
    },
    boards: ["lanes", "experiment-budget", "map"],
    refusals: { "release-plan": z.releaseCards, "customer-interviews": z.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: re("The card or token.") },
    boards: me,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: re("The card or token."), lane: Z("Where it goes.") },
    boards: me,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: re("The token.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: Z("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: me,
    refusals: {}
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: re("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: In,
    refusals: vn(z.mapCardLanes)
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: re("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { lanes: z.notPoints, "customer-interviews": z.notPoints, "experiment-budget": z.notPoints, map: z.mapPoints }
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
    refusals: { lanes: z.notDepends, "customer-interviews": z.notDepends, "experiment-budget": z.notDepends, map: z.notDepends }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: re("The card."),
      lane: Z("The lane."),
      whenPresent: ee(160, "What it says when the card is there."),
      whenAbsent: ee(160, "What it says otherwise."),
      label: ee(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: In,
    refusals: vn(z.mapOutcome)
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: re("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: In,
    refusals: vn(z.mapOutcome)
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: me,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: Z("The lane or step."), before: Z("Present it just before this one.", !0), after: Z("Present it just after this one.", !0) },
    boards: me,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: Z("The step it follows."), label: ee(80, "The new step’s name."), outcome: ee(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: Z("The step it goes in front of."),
      from: Z("Only the path from this step is taken over.", !0),
      label: ee(80, "The new step’s name."),
      outcome: ee(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: Z("Where the path starts."), to: Z("Where it leads.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: Z("Where the path starts."), to: Z("Where it leads.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: Z("The step."), outcome: ee(160, "What it says.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: Z("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: Z("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: Z("The step."), alt: ee(240, "What the picture shows.") },
    boards: ["map"],
    refusals: ue
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: re("The card the line starts at."), to: re("The card it points to."), label: ee(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: Ke()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: re("One card."), to: re("The other card.") },
    boards: ["lanes"],
    refusals: Ke()
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
    refusals: Ke()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: re("The card."), note: ee(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: Ke()
  }
];
function Ke() {
  return { "release-plan": z.lines, "customer-interviews": z.lines, "experiment-budget": z.lines, map: z.lines };
}
const eo = new Map(Wn.map((e) => [e.kind, e])), no = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function to(e, n) {
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
      return { ...t({ type: "integer", minimum: e.min, maximum: no(e.max, n) }, e.nullable), description: e.about };
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
const yt = (e) => "optional" in e && e.optional === !0;
function er(e) {
  const n = e ? nn(J(e)) : void 0;
  return Wn.map((o) => {
    const t = Object.entries(o.fields), r = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, h]) => !yt(h)).map(([h]) => h)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([h, w]) => [h, to(w, n)])) }
    }, l = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: r };
    return n && (l.accepted = o.boards.includes(n), l.accepted || (l.refusal = o.refusals[n])), l;
  });
}
const Je = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?",
  card: "cards?|features?|notes?|items?|tasks?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function oo(e, n) {
  const o = !!e.lanes[0]?.station, t = $n(e.lanes, o ? Je.step : Je.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), r = $n(e.cards, o ? Je.token : Je.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: r };
  const l = (h) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(h.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (h) => l(h) ?? r.find(h),
    attempt: (h) => l(h) ?? r.attempt(h),
    rank: (h) => l(h) ? 0 : r.rank(h)
  } };
}
class R {
  constructor(n, o, t = null, r, l) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = r, this.candidates = l;
  }
}
function tn(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function G(e, n, o = null, t) {
  try {
    return J(e);
  } catch (r) {
    throw new R(tn(r instanceof Error ? r.message : String(r), n), "refused", o, t);
  }
}
function ro(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, r] of Object.entries(n.fields)) {
    const l = e[t];
    if (l === void 0) {
      if (yt(r)) continue;
      return n.kind + " needs " + t + ".";
    }
    const h = n.kind + " needs " + t + " as ";
    switch (r.type) {
      case "text":
        if (typeof l != "string") return h + "text.";
        break;
      case "ref":
        if (!o(l)) return h + "an id or a name.";
        break;
      case "refs":
        if (l === null && r.nullable) break;
        if (!Array.isArray(l) || l.length > r.max || !l.every(o)) return h + "a list of up to " + r.max + " ids or names" + (r.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (l === null && r.nullable) break;
        if (typeof l != "number" || !Number.isFinite(l)) return h + "a number" + (r.nullable ? " or null." : ".");
        break;
      case "image":
        if (l === null) break;
        if (!l || typeof l != "object" || typeof l.src != "string" || typeof l.alt != "string" || Object.keys(l).some((w) => w !== "src" && w !== "alt")) return h + "{src, alt} or null.";
        break;
      case "choice":
        if (!r.values.includes(l)) return h + r.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function io(e, n, o, t) {
  const r = structuredClone(e), l = o === "map", h = o === "release-plan", w = oo(r, t), g = { lane: l ? "step" : "lane", card: l ? "token" : "card" };
  function b(i, m, x, C, $ = null) {
    if (typeof x == "object") {
      const W = i.find((q) => q.id === x.id);
      if (!W) throw new R("That " + C + " is no longer on the workshop.", "gone", $);
      return W;
    }
    const O = i.find((W) => W.id === x);
    if (O) return O;
    try {
      return m.find(x);
    } catch (W) {
      if (!(W instanceof Ze)) throw W;
      const q = W.reason === "ambiguous" ? "ambiguous_reference" : W.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new R(W.message, q, $, void 0, W.candidates.length ? W.candidates : void 0);
    }
  }
  const v = (i, m = null) => b(r.lanes, w.lanes, i, "lane", m), A = (i, m = null) => b(r.cards, w.cards, i, "card", m), S = (i) => {
    try {
      return v(i);
    } catch {
      return null;
    }
  }, y = (i, m, x = {}, C = !0) => ({ board: i, said: m, changed: C, ...x }), L = (i) => r.cards.filter((m) => m.laneId === i).length, M = (i) => l ? "The presentation opens with " + P(i[0].label) + "." : "The presentation now runs " + i.map((m) => P(m.label)).join(", then ") + ".";
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
      if (r.lanes.length >= 5) throw new R("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new R("A lane can hold from 1 to 24 cards.", "refused");
      let i;
      try {
        i = Oo(r, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new R(tn(x.message, o), "refused");
      }
      const m = i.lanes[i.lanes.length - 1];
      return y(i, "Added the lane " + P(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const i = v(n.lane), m = r.cards.filter((x) => x.laneId === i.id);
      if (l) {
        if (m.length) throw new R(P(m[0].label) + " is at " + P(i.label) + ". Move it to another step first.", "refused", i.id);
        if (r.lanes.length <= 2) throw new R("A map needs at least two steps.", "refused", i.id);
      } else {
        if (m.length) throw new R(P(i.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", i.id);
        if (r.lanes.length <= 2) throw new R("A workshop needs at least two lanes.", "refused", i.id);
      }
      r.lanes = r.lanes.filter((x) => x !== i);
      for (const x of r.lanes) x.station && (x.station.next = x.station.next.filter((C) => C !== i.id));
      r.presentationOrder && (r.presentationOrder = r.presentationOrder.filter((x) => x !== i.id));
      for (const x of r.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((C) => C !== i.id));
      return Ye(r, (x) => x.laneId === i.id), y(G(r, o), "Removed the " + g.lane + " " + P(i.label) + ".", { laneId: i.id });
    }
    case "add_card": {
      const i = v(n.lane);
      if (l) {
        if (n.allowedLanes !== void 0) throw new R(z.mapCardLanes, "not_on_this_board", i.id);
        let $ = n.label;
        if ($ === void 0) {
          let N = r.cards.length + 1;
          for (; r.cards.some((D) => D.label === "Token " + N); ) N++;
          $ = "Token " + N;
        }
        const O = new Set([...r.lanes, ...r.cards].map((N) => N.id));
        let W = 1;
        for (; O.has("token-" + W); ) W++;
        r.cards.push({ id: "token-" + W, label: $, laneId: i.id });
        const q = G(r, o, i.id);
        return y(q, "Added " + P(q.cards[q.cards.length - 1].label) + " at " + P(i.label) + ".", { laneId: i.id, cardId: "token-" + W });
      }
      if (r.cards.length >= 24) throw new R("A workshop can have up to 24 cards. Remove one first.", "refused", i.id);
      if (i.capacity !== void 0 && L(i.id) >= i.capacity)
        throw new R(P(i.label) + " is full: it holds " + i.capacity + (i.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", i.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => v($).id))];
      let x;
      try {
        x = Eo(r, i.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch ($) {
        throw new R(tn($.message, o), "refused", i.id);
      }
      const C = x.cards[x.cards.length - 1];
      return y(x, "Added " + (C.label ? P(C.label) : "an empty card") + " to " + P(i.label) + ".", { laneId: i.id, cardId: C.id });
    }
    case "remove_card": {
      const i = A(n.card);
      if (l && r.cards.length === 1) throw new R("A map needs at least one token.", "refused", i.laneId, i.id);
      if (h && r.cards.length === 1) throw new R("A release plan needs at least one feature.", "refused", i.laneId, i.id);
      r.cards = r.cards.filter((m) => m !== i);
      for (const m of r.cards)
        m.dependsOn?.includes(i.id) && (m.dependsOn = m.dependsOn.filter((x) => x !== i.id), m.dependsOn.length || delete m.dependsOn);
      return Ye(r, (m) => m.cardId === i.id), y(G(Lo(r, i.id), o, i.laneId), "Removed the " + g.card + " " + P(i.label) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "move_card": {
      const i = typeof n.lane == "object" ? r.lanes.find((C) => C.id === n.lane.id) ?? null : S(n.lane), m = A(n.card, i?.id ?? null), x = v(n.lane, m.laneId);
      return K(m, x);
    }
    case "advance_card": {
      const i = A(n.card), m = r.lanes.find((C) => C.id === i.laneId), x = m.station.next.map((C) => r.lanes.find(($) => $.id === C)).filter((C) => !!C);
      if (!x.length) throw new R(P(i.label) + " is at " + P(m.label) + ", and no path leads on from there.", "refused", m.id, i.id);
      if (x.length > 1)
        throw new R("From " + P(m.label) + " the path goes to " + x.map((C) => P(C.label)).join(" or ") + ". Say which, such as “Move " + i.label + " to " + x[0].label + "”.", "refused", m.id, i.id);
      return K(i, x[0]);
    }
    case "set_lane_capacity": {
      const i = v(n.lane), m = l ? "token" : h ? "point" : "card";
      if (n.capacity === null)
        return delete i.capacity, y(G(r, o, i.id), l ? "Removed the limit at " + P(i.label) + "." : P(i.label) + " now holds any number of " + m + "s.", { laneId: i.id });
      const x = h ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > x)
        throw new R((l ? "A step" : "A lane") + " can hold from 1 to " + x + " " + m + "s.", "refused", i.id);
      const C = h ? r.cards.reduce(($, O) => $ + (O.laneId === i.id ? O.points ?? 1 : 0), 0) : L(i.id);
      if (C > n.capacity)
        throw new R(P(i.label) + " already holds " + C + " " + m + (C === 1 ? "" : "s") + ". Move some " + (l ? "on" : "out") + " first, or choose a higher " + (h ? "budget" : "number") + ".", "refused", i.id);
      return i.capacity = n.capacity, y(G(r, o, i.id), P(i.label) + " now holds up to " + n.capacity + " " + m + (n.capacity === 1 ? "" : "s") + ".", { laneId: i.id });
    }
    case "set_card_lanes": {
      const i = A(n.card);
      if (n.lanes === null)
        return delete i.allowedLaneIds, y(G(r, o, i.laneId, i.id), P(i.label) + " can now go in any lane.", { laneId: i.laneId, cardId: i.id });
      const m = [...new Set(n.lanes.map((C) => v(C)))], x = r.lanes.find((C) => C.id === i.laneId);
      if (!m.includes(x)) throw new R(P(i.label) + " is in " + P(x.label) + " now. Include " + P(x.label) + ", or move the card first.", "refused", x.id, i.id);
      return i.allowedLaneIds = m.map((C) => C.id), y(G(r, o, i.laneId, i.id), P(i.label) + " can now go only in " + ke(m.map((C) => P(C.label))) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "set_card_points": {
      const i = A(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new R("A feature takes from 1 to 24 points.", "refused", i.laneId, i.id);
      return i.points = n.points, y(G(r, o, i.laneId, i.id), P(i.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: i.laneId, cardId: i.id });
    }
    case "set_card_dependencies": {
      const i = A(n.card), m = [...new Set(n.dependsOn.map((C) => A(C)))], x = { laneId: i.laneId, cardId: i.id };
      if (n.mode === "remove") {
        const C = m.filter(($) => i.dependsOn?.includes($.id));
        if (!C.length) throw new R(P(i.label) + " does not depend on " + ke(m.map(($) => P($.label))) + ".", "refused", i.laneId, i.id);
        return i.dependsOn = i.dependsOn.filter(($) => !C.some((O) => O.id === $)), i.dependsOn.length || delete i.dependsOn, y(G(r, o, i.laneId, i.id), P(i.label) + " no longer depends on " + ke(C.map(($) => P($.label))) + ".", x);
      }
      if (!m.length) {
        if (n.mode === "add") throw new R("Name the features " + P(i.label) + " depends on.", "refused", i.laneId, i.id);
        return delete i.dependsOn, y(G(r, o, i.laneId, i.id), P(i.label) + " no longer depends on anything.", x);
      }
      if (m.includes(i)) throw new R("A feature can’t depend on itself.", "refused", i.laneId, i.id);
      return i.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? i.dependsOn ?? [] : [], ...m.map((C) => C.id)])], y(G(r, o, i.laneId, i.id), P(i.label) + " now depends on " + ke(m.map((C) => P(C.label))) + ".", x);
    }
    case "set_outcome": {
      const i = A(n.card), m = v(n.lane), x = r.signals ?? (r.signals = []), C = n.label, $ = C === void 0 ? x.filter((N) => N.cardId === i.id && N.laneId === m.id) : x.filter((N) => N.cardId === i.id && N.label.toLowerCase() === C.toLowerCase());
      if (C !== void 0 && $.length > 1) throw new R("Two outcomes on this card have that name.", "refused", m.id, i.id);
      if (!$.length && x.length >= 24) throw new R("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, i.id);
      let O = 1;
      for (; x.some((N) => N.id === "signal-" + O); ) O++;
      const q = { label: C ?? $[0]?.label ?? (i.label + " in " + m.label).slice(0, 80).trim(), cardId: i.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], q) : x.push({ id: "signal-" + O, ...q }), y(G(r, o, m.id, i.id), "When " + P(i.label) + " is in " + P(m.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: m.id, cardId: i.id });
    }
    case "remove_outcome": {
      const i = A(n.card), m = (r.signals ?? []).filter((x) => x.cardId === i.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new R(P(i.label) + " has no outcome to remove.", "refused", i.laneId, i.id);
        Ye(r, (x) => x.cardId === i.id);
      } else {
        const x = b(m, $n(m, "outcomes?", "outcome"), n.outcome, "outcome", i.laneId);
        Ye(r, (C) => C.id === x.id);
      }
      return y(G(r, o, i.laneId, i.id), "Removed the outcome from " + P(i.label) + ".", { laneId: i.laneId, cardId: i.id });
    }
    case "set_presentation_order": {
      const i = n.lanes.map((m) => v(m));
      if (i.length !== r.lanes.length || new Set(i).size !== r.lanes.length) throw new R("Include each scene once in the presentation order.", "refused");
      return r.presentationOrder = i.map((m) => m.id), y(G(r, o), M(i));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new R("Say before or after, not both.", "invalid_edit");
      const i = v(n.lane), m = n.before ?? n.after, x = m === void 0 ? void 0 : v(m);
      if (x && x.id === i.id) throw new R("Choose two different scenes.", "refused", i.id);
      const C = zn(r).filter(($) => $.id !== i.id);
      return C.splice(x ? C.findIndex(($) => $.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, i), r.presentationOrder = C.map(($) => $.id), y(G(r, o, i.id), M(C), { laneId: i.id });
    }
    case "add_station": {
      const i = v(n.from);
      let m;
      try {
        m = ft(r, i.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (C) {
        throw new R(C.message, "refused", i.id);
      }
      const x = m.lanes[m.lanes.length - 1];
      return y(m, "Added a path from " + P(i.label) + " to " + P(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const i = v(n.before), m = n.from === void 0 ? void 0 : v(n.from), x = m ? [m] : r.lanes.filter((O) => O.station.next.includes(i.id));
      if (m && !m.station.next.includes(i.id))
        throw new R("There is no path from " + P(m.label) + " to " + P(i.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!x.length) throw new R("Nothing leads to " + P(i.label) + " yet. Try “Add " + n.label + " after " + i.label + "”.", "refused", i.id);
      let C;
      try {
        C = ft(r, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (O) {
        throw new R(O.message, "refused", i.id);
      }
      const $ = C.lanes[C.lanes.length - 1];
      for (const O of C.lanes)
        x.some((W) => W.id === O.id) && (O.station.next = [...new Set(O.station.next.map((W) => W === i.id ? $.id : W))]);
      return $.station.next = [i.id], y(G(C, o, $.id), "Added " + P($.label) + " before " + P(i.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const i = v(n.from), m = v(n.to);
      if (i.id === m.id) throw new R("Connect two different steps.", "refused", i.id);
      return i.station.next.includes(m.id) ? y(r, P(i.label) + " already leads to " + P(m.label) + ".", { laneId: i.id }, !1) : (i.station.next.push(m.id), y(G(r, o, i.id), "Connected " + P(i.label) + " to " + P(m.label) + ".", { laneId: i.id }));
    }
    case "disconnect_stations": {
      const i = v(n.from), m = v(n.to);
      if (!i.station.next.includes(m.id)) throw new R("There is no path between " + P(i.label) + " and " + P(m.label) + ".", "refused", i.id);
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
      if (!i.station.image) throw new R("Add a station image before changing its description.", "refused", i.id);
      return i.station.image.alt = n.alt, y(G(r, o, i.id), "Updated the image description at " + P(i.label) + ".", { laneId: i.id });
    }
    case "connect_cards":
    case "connect_note": {
      const i = A(n.card);
      let m = i.id, x, C;
      if (n.kind === "connect_cards") {
        const N = A(n.to, i.laneId);
        if (N.id === i.id) throw new R("A line joins two different cards.", "refused", i.laneId, i.id);
        x = N.id, C = P(N.label);
      } else {
        const N = n.note.trim();
        if (r.cards.some((D) => D.id === N) || r.lanes.some((D) => D.id === N))
          throw new R("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", i.laneId, i.id);
        x = N, C = "the note " + N, n.direction === "from_note" && ([m, x] = [x, m]);
      }
      const $ = $t(r, m, x, n.label ? { label: n.label } : {}), O = sn(r, $);
      if (O) throw new R(O, "refused", i.laneId, i.id);
      const W = Xe(r, $), q = m === i.id;
      return y(
        W,
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
  function K(i, m) {
    const x = { laneId: m.id, cardId: i.id };
    if (i.laneId === m.id)
      return y(e, P(i.label) + " is already " + (l ? "at " : "in ") + P(m.label) + ".", x, !1);
    const C = Te(e, i.id, m.id);
    if (!C) throw new R(Ve(e, i.id, m.id) ?? "That move is not available.", "refused", m.id, i.id);
    return y(G(C, o, m.id, i.id), "Moved " + P(i.label) + " to " + P(m.label) + ".", x);
  }
}
function Ye(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function so(e, n, o = {}) {
  const t = (b) => ({ refused: { index: 0, kind: null, laneId: null, ...b } });
  let r;
  try {
    r = J(e);
  } catch (b) {
    return t({ reason: "The workshop cannot be read: " + (b instanceof Error ? b.message : String(b)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const l = r, h = [];
  for (const [b, v] of n.entries()) {
    const A = v?.kind, S = typeof A == "string" ? eo.get(A) : void 0;
    if (!v || typeof v != "object" || !S)
      return t({
        index: b,
        kind: typeof A == "string" ? A : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(A)) + ". The edits are " + ke(Wn.map((i) => i.kind)) + "."
      });
    const y = ro(v, S);
    if (y) return t({ index: b, kind: S.kind, code: "invalid_edit", reason: y });
    const L = nn(r);
    if (!S.boards.includes(L))
      return t({ index: b, kind: S.kind, code: "not_on_this_board", reason: S.refusals[L] ?? "This workshop does not take " + S.kind + "." });
    let M;
    try {
      M = io(r, v, L, o.selection);
    } catch (i) {
      if (!(i instanceof R)) throw i;
      return t({
        index: b,
        kind: S.kind,
        reason: i.reason,
        code: i.code,
        laneId: i.laneId,
        ...i.cardId && { cardId: i.cardId },
        ...i.candidates && { candidates: i.candidates }
      });
    }
    const K = lo(r, M.board);
    if (K) return t({ index: b, kind: S.kind, reason: K, code: "not_on_this_board", laneId: M.laneId ?? null });
    r = M.board, h.push({
      index: b,
      kind: S.kind,
      said: M.said,
      changed: M.changed ?? !0,
      ...M.laneId && { laneId: M.laneId },
      ...M.cardId && { cardId: M.cardId }
    });
  }
  const w = new Map(l.cards.map((b) => [b.id, b.laneId])), g = r.cards.flatMap((b) => {
    const v = w.get(b.id);
    return v === void 0 || v === b.laneId ? [] : [{ cardId: b.id, fromLaneId: v, toLaneId: b.laneId }];
  });
  return { workshop: r, report: { edits: h, movedCards: g } };
}
const ao = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map"
};
function lo(e, n) {
  const o = J(e), t = nn(o);
  let r;
  try {
    r = J(n);
  } catch (g) {
    return tn(g instanceof Error ? g.message : String(g), t);
  }
  const l = nn(r), h = (g, b) => g.lanes.length === b.lanes.length && g.lanes.every((v) => b.lanes.some((A) => A.id === v.id)), w = (g, b) => g.lanes.every((v, A) => b.lanes[A]?.id === v.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && l !== t)
    return h(o, r) ? z.keepsCards : z.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !w(o, r)) return z.keepsOrder;
  if (t === "release-plan" && l === "release-plan") {
    if (!h(o, r)) return z.releaseLanes;
    if (!w(o, r)) return z.releaseOrder;
    if (r.cards.some((g) => !o.cards.some((b) => b.id === g.id))) return z.releaseCards;
  }
  return t !== l ? "This slate holds a " + ao[t] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
function co(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = ho(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), uo(n), n;
}
function fo(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function uo(e) {
  return e && fo(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function ot(e) {
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
function ho(e) {
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
const rt = "#1f7a5c", it = "#5b9a85", Cn = "#c2410c", po = "#2f5fd0", mo = { canMove: !1, canSelect: !1 };
function wo(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function nr(e, n, o = {}) {
  let t = J(n), r = null, l = !!o.readOnly, h = !1;
  const w = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  let S = null, y = null, L = null;
  const M = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map();
  let i = null, m = Promise.resolve(), x = null, C = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const $ = { ...o.style };
  let O = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Set(), q = null, N = !1;
  const D = /* @__PURE__ */ new Map();
  fe(t, { layout: C });
  const U = o.origin ? { x: o.origin.x, y: o.origin.y } : yo(e), ze = (s) => A.get(s) ?? s, ne = (s) => wo(ze(s));
  function X(s) {
    const a = v.get(s);
    if (a) return a;
    if (w.has(s) && !A.has(s) || !e.nodes.one?.(s)) return s;
    const d = Et(s, (c) => !!e.nodes.one?.(c) || A.has(c));
    return v.set(s, d), A.set(d, s), console.warn(`WORKSHOP: the slate already has a note named "${s}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const ae = {
    governs(s) {
      if (w.get(s.id) !== s) return null;
      const a = ne(s.id)?.kind;
      return a === "card" ? { canMove: !l, canEditText: !l && !r && t.kind !== "release-plan", canConnect: Ee() } : a === "lane" ? { canMove: !1, canEditText: !l && !r } : mo;
    },
    onStart(s, a) {
      const d = ne(s.id).key;
      if (l || r || !t.cards.some((f) => f.id === d)) return !1;
      te(), Ie();
      const c = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      let k = null;
      try {
        k = o.chooseCandidate?.(t, d, c) ?? null;
      } catch (f) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", f);
      }
      return S = { cardId: d, evaluate: k, outcome: { kind: "home" } }, F(t, { skip: d }), !0;
    },
    onMove(s, a) {
      if (!S) return;
      const d = Dn(S.cardId, a, S.evaluate);
      if (go(d, S.outcome)) return;
      S.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      F(c ?? t, { skip: S.cardId }), B(o.onPreview, c);
    },
    onEnd(s, a) {
      if (!S) return { accept: !1 };
      const { cardId: d, evaluate: c } = S, k = Dn(d, a, c), f = t.cards.find((p) => p.id === d);
      if (S = null, B(o.onPreview, null), k.kind === "candidate") {
        t = k.next, F(t, { skip: d });
        const p = t.lanes.find((I) => I.id === k.laneId);
        e.announce?.(`${Y(f)} moved to ${p.label}. ${he(t, p.id)}.`), B(o.onChange, t, { cardId: d, laneId: k.laneId });
        const u = Kt(t, ze(s.id));
        return u ? { accept: !0, settle: u } : { accept: !0 };
      }
      if (k.kind === "refused")
        Gt(Y(f), { cardId: d, laneId: k.laneId, reason: k.reason });
      else if (k.kind === "outside" && Me(t) && !je()) {
        const p = Qe(t, d);
        if (!p)
          return gn(d, { x: s.options.x ?? 0, y: s.options.y ?? 0 }), { accept: !0 };
        F(t, { skip: d }), e.announce?.(p), B(o.onRefuse, { cardId: d, laneId: null, reason: p });
      } else
        F(t, { skip: d }), k.kind === "outside" && (e.announce?.(`${Y(f)} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      const a = S && t.cards.find((d) => d.id === S.cardId);
      S = null, B(o.onPreview, null), F(t, { skip: ne(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Y(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const c = ne(s.id);
      if (!c || l || r) return !1;
      const k = a.replace(/\s+/g, " ").trim(), f = c.kind === "lane" ? { laneId: c.key, label: k } : { cardId: c.key, label: k }, p = so(t, [c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: k } : { kind: "rename_card", card: { id: c.key }, label: k }]);
      if ("refused" in p) {
        const { reason: u } = p.refused;
        return e.announce?.(`${d} keeps its name. ${u}`), B(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: f, reason: u }), !1;
      }
      return k === d ? !1 : (t = p.workshop, F(t), e.announce?.(`${d} renamed to ${k}.`), B(o.onChange, t, { rename: f }), k);
    },
    onKeyDown(s, a) {
      const d = ne(s.id);
      if (d?.kind !== "card" || l || r || S || a.ctrlKey || a.metaKey || a.altKey) return !1;
      const c = t.cards.find((k) => k.id === d.key);
      if (!c) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Hn(c.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Rt())
        return a.preventDefault(), Hn(c.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (y?.cardId !== c.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: k, next: f, spot: p } = y;
        if (y = null, k === null)
          return B(o.onPreview, null), gn(c.id, p), !0;
        t = f, F(t), ye(k), B(o.onPreview, null);
        const u = t.lanes.find((I) => I.id === k);
        return e.announce?.(`${Y(c)} moved to ${u.label}. ${he(t, k)}.`), B(o.onChange, t, { cardId: c.id, laneId: k }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Ie(), e.announce?.(`Move cancelled. ${Y(c)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => w.get(a.id) === a).map((a) => a.id);
      N = s.length === 1, w.clear(), g.clear(), b.clear(), D.clear(), v.clear(), A.clear(), S = null, y = null, F(r ?? t, { animate: !1 }), s.length === 1 && (m = m.then(() => {
        N = !1;
        const a = w.get(s[0]);
        if (!h && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        un();
      }));
    }
  };
  ae.onFreeMove = (s, a) => {
    if (!De() || s.options?.isComment) return hn();
    const d = He(a), c = Be(s), k = t.lanes.filter((p) => !Oe(s) && Ce(t, p.id, c) === null).map((p) => p.id), f = d ? Oe(s) ?? Ce(t, d, c) : null;
    L && L.noteId === s.id && L.laneId === d && L.refusal === f || (L = { noteId: s.id, laneId: d, refusal: f, open: k }, pe());
  }, ae.onFreeDrop = (s, a, d) => {
    if (hn(), !De() || s.options?.isComment) return;
    const c = He(a);
    if (!c) return;
    const k = Be(s), f = t.lanes.find((u) => u.id === c), p = Oe(s) ?? Ce(t, c, k);
    return p ? (te(!1), i = { laneId: c, reason: p, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${pn(k.label)} can't go in ${f.label}. ${p}`), B(o.onRefuse, { noteId: s.id, laneId: c, reason: p }), "refused") : (wn([{ node: s, offer: k, from: d }], c), "taken");
  }, ae.onFreeGroupDrop = (s, a, d) => {
    if (hn(), !De() || s.some((u) => u.options?.isComment)) return;
    const c = He(a);
    if (!c) return;
    const k = t.lanes.find((u) => u.id === c), f = s.map((u) => ({ node: u, offer: Be(u) })), p = zt(f, c);
    if (p) {
      te(!1), i = { laneId: c, reason: p, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${Bn(f.map((u) => pn(u.offer.label)))} can't go in ${k.label}. ${p}`);
      for (const { node: u } of f) B(o.onRefuse, { noteId: u.id, laneId: c, reason: p });
      return "refused";
    }
    return wn(f.map((u, I) => ({ ...u, from: d?.[I] })), c), "taken";
  }, ae.onFreeTextCommit = (s) => {
    if (!De() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = He({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = Be(s), k = t.lanes.find((E) => E.id === d), f = Oe(s) ?? Ce(t, d, c);
    if (!f) {
      wn([{ node: s, offer: c }], d);
      return;
    }
    te(!1), i = { laneId: d, reason: f, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${pn(c.label)} can't go in ${k.label}. ${f} It is beside the board.`), B(o.onRefuse, { noteId: s.id, laneId: d, reason: f });
    const { width: p } = fe(t, { layout: C }), u = Math.round(U.x + p + 32), I = Math.round(a.y ?? U.y);
    s.position(u, I, () => e.updateSelectionResizeRotate?.(), void 0, An() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [ot({ ...s.options, x: u, y: I })] });
  }, ae.undoState = () => ({ cards: t.cards.map((s) => ({ ...s })), pairs: [...M], lines: (t.lines ?? []).map((s) => ({ ...s })) }), ae.onUndoRestore = (s, a) => {
    if (h) return;
    const d = new Map((s?.cards ?? []).map((f) => [f.id, f])), c = new Map(s?.pairs ?? []), k = (f) => M.get(f) ?? c.get(f) ?? f;
    for (const f of a.added) {
      const p = k(f), u = t.cards.find((E) => E.id === p);
      if (!u) continue;
      t = J({ ...t, cards: t.cards.filter((E) => E !== u), lines: Ae(t.lines, p, f) }), F(t);
      const I = B(o.onChange, t, { cardId: p, cardToNote: { noteId: f } });
      e.holdTrade?.(f, I), Sn(I);
    }
    for (const f of a.removed) {
      const p = k(f), u = d.get(p);
      if (!u || t.cards.some((H) => H.id === p)) continue;
      const I = (s?.lines ?? []).filter((H) => H.parentId === p || H.childId === p), E = {
        id: p,
        label: u.label,
        ...u.look ? { look: u.look } : {},
        ...u.asNote ? { asNote: u.asNote } : {},
        ...I.length ? { lines: I } : {}
      }, T = [u.laneId, ...t.lanes.map((H) => H.id)].find((H) => Re(t, H, E));
      if (!T) {
        e.announce?.(`${Y(u)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Bt(Re(t, T, E), p, s?.cards ?? []), p !== f && M.set(f, p), F(t);
      const j = t.cards.findIndex((H) => H.id === p), _ = t.cards.slice(j + 1).find((H) => H.laneId === T)?.id, V = B(o.onChange, t, { cardId: p, laneId: T, noteToCard: {
        noteId: f,
        label: u.label,
        ...u.look ? { look: u.look } : {},
        ...u.asNote ? { asNote: u.asNote } : {},
        ..._ ? { before: _ } : {},
        ...I.length ? { lines: Ae(I, p, f) } : {}
      } });
      e.holdTrade?.(f, V), Sn(V);
    }
    Array.isArray(s?.lines) && Ht(s.lines);
  };
  let se = !1;
  ae.onNodeAdded = (s) => {
    h || se || w.get(s.id) === s || (t.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (se = !0, queueMicrotask(() => {
      se = !1, h || pe();
    }));
  }, ae.onLine = (s, a) => {
    h || queueMicrotask(() => {
      h || jt(s, a);
    });
  };
  const Fe = e.setDragPolicy(ae), _t = o.onSelect && e.onSelectionChange?.(() => un()), jn = () => {
    y && Ie();
  };
  e.element?.addEventListener?.("pointerdown", jn, !0), F(t, { animate: !1 });
  function Dn(s, a, d) {
    const c = t.cards.find((T) => T.id === s);
    if (!c) return { kind: "outside" };
    const k = t.lanes.map((T) => w.get(X(ie.column(T.id)))).filter(Boolean), f = e.hitTestNodes(a, k, { padding: 6 }), p = f ? ne(f.id).key : null;
    if (!p) return { kind: "outside" };
    if (p === c.laneId) return { kind: "home" };
    const u = Te(t, s, p);
    if (!u) return { kind: "refused", laneId: p, reason: Ve(t, s, p) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: p, next: u };
    let I = null;
    try {
      I = d({ x: a.x - U.x, y: a.y - U.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: p, next: u };
    }
    const E = I?.cards.find((T) => T.id === s)?.laneId;
    return !I || !E || E === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: E, next: I };
  }
  function Rt() {
    return new Set(fe(t, { layout: C }).places.map((s) => s.row)).size > 1;
  }
  function Hn(s, a, d = !1) {
    const c = t.cards.find((T) => T.id === s), k = at(t, s), f = y?.cardId === s && y.laneId === null ? y.side : void 0;
    if (f !== void 0) {
      if (d || a === f) return;
      const T = f > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Ie(), T.id === c.laneId) {
        ye(T.id, r ?? t), e.announce?.(`${Y(c)} is back in ${T.label}.`);
        return;
      }
      if (k.includes(T)) {
        const _ = Te(t, s, T.id);
        y = { cardId: s, laneId: T.id, next: _ }, F(_), ye(T.id, _), B(o.onPreview, _), e.announce?.(`${Y(c)} to ${T.label}: ${he(_, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const j = Ve(t, s, T.id) ?? "That move is not available.";
      te(), i = { laneId: T.id, reason: j, timer: setTimeout(() => te(), 1500) }, F(r ?? t), ye(T.id, r ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${j}`), B(o.onRefuse, { cardId: s, laneId: T.id, reason: j });
      return;
    }
    const p = y?.cardId === s ? y.laneId : c.laneId;
    let u;
    if (d) {
      const { places: T } = fe(t, { layout: C }), j = T.find((_) => _.laneId === p);
      u = T.filter((_) => _.column === j.column && (_.row - j.row) * a > 0).sort((_, V) => (_.row - V.row) * a).map((_) => t.lanes.find((V) => V.id === _.laneId));
    } else {
      const T = t.lanes.findIndex((j) => j.id === p);
      u = a > 0 ? t.lanes.slice(T + 1) : t.lanes.slice(0, T).reverse();
    }
    const I = u.find((T) => k.includes(T));
    if (te(), !I) {
      const T = u[0];
      if (!T) {
        if (!d && Me(t)) {
          const _ = Qe(t, s);
          if (_) {
            e.announce?.(_), B(o.onRefuse, { cardId: s, laneId: null, reason: _ });
            return;
          }
          Mt(c, a);
          return;
        }
        e.announce?.(`${Y(c)} has no lane to move to on that side.`);
        return;
      }
      const j = Ve(t, s, T.id) ?? "That move is not available.";
      i = { laneId: T.id, reason: j, timer: setTimeout(() => te(), 1500) }, F(y?.next ?? r ?? t), ye(T.id, y?.next ?? r ?? t), e.announce?.(`${Y(c)} can't move to ${T.label}. ${j}`), B(o.onRefuse, { cardId: s, laneId: T.id, reason: j });
      return;
    }
    if (I.id === c.laneId) {
      Ie(), ye(I.id, r ?? t), e.announce?.(`${Y(c)} is back in ${I.label}.`);
      return;
    }
    const E = Te(t, s, I.id);
    y = { cardId: s, laneId: I.id, next: E }, F(E), ye(I.id, E), B(o.onPreview, E), e.announce?.(`${Y(c)} to ${I.label}: ${he(E, I.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function ye(s, a = t) {
    const d = fe(a, { layout: C, rows: Yn() }).places.find((I) => I.laneId === s), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const k = 16, f = (I, E, T, j) => E + k * 2 >= j || I - k < T ? I - k - T : I + E + k > T + j ? I + E + k - (T + j) : 0, p = f(U.x + d.x, d.width, c.x, c.width), u = f(U.y + d.y, d.height, c.y, c.height);
    (p || u) && e.panBy?.({ x: p, y: u });
  }
  function un() {
    if (!o.onSelect || N) return;
    const s = h ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && w.get(s[0].id) === s[0] ? ne(s[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== q && (q = c, B(o.onSelect, d));
  }
  function Ie() {
    y && (y = null, B(o.onPreview, null), F(r ?? t));
  }
  function Mt(s, a) {
    const { width: d } = fe(t, { layout: C }), c = w.get(X(ie.card(s.id)))?.options, k = c?.width ?? 228, f = { x: a > 0 ? U.x + d + 32 : U.x - k - 32, y: c?.y ?? U.y }, p = lt(t, s.id);
    y = { cardId: s.id, laneId: null, side: a, spot: f, next: t }, F(t), B(o.onPreview, p), e.announce?.(`${Y(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function je() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function De() {
    return !h && !l && !r && !S && !je() && Me(t);
  }
  function hn() {
    L && (L = null, h || pe());
  }
  function He(s) {
    const a = t.lanes.map((c) => w.get(X(ie.column(c.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? ne(d.id)?.key ?? null : null;
  }
  function Be(s) {
    const a = s.options ?? {}, d = vt({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), k = c.replace(/\s+/g, " ").trim(), f = {};
    c.trim() !== k && c.length <= 4e3 && (f.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (f.shape = a.shape);
    for (const u of ["width", "height"]) Number.isFinite(a[u]) && a[u] >= 10 && a[u] <= 4e3 && (f[u] = Math.round(a[u]));
    if (Ln(a.image)) {
      f.image = { src: a.image };
      for (const [u, I] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[I]) && a[I] >= 1 && a[I] <= 2e4 && (f.image[u] = a[I]);
    }
    a.link?.data && st({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (f.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const p = Wt(s);
    return { id: s.id, label: k, ...d ? { look: d } : {}, ...Object.keys(f).length ? { asNote: f } : {}, ...p.length ? { lines: p } : {} };
  }
  function Wt(s) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!w.get(c) && w.get(c) === e.nodes.one(c);
    for (const c of s.relationships?.getAssociations?.() ?? [])
      !c.targetPoint && !d(c.childId) && a.set(c.id, Ue(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === s || d(c.id)))
        for (const k of c.relationships?.getAssociations?.() ?? [])
          k.childId === s.id && !k.targetPoint && a.set(k.id, Ue(k));
    for (const c of dt(t, s.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function Bn(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function zt(s, a) {
    for (const { node: f } of s) {
      const p = Oe(f);
      if (p) return p;
    }
    const d = t.lanes.find((f) => f.id === a), c = t.cards.filter((f) => f.laneId === a).length;
    if (d.capacity !== void 0 && c + s.length > d.capacity) {
      const f = d.capacity - c;
      return f > 0 ? `It has room for ${f} more ${f === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let k = t;
    for (const { offer: f } of s) {
      const p = Ce(k, a, f);
      if (p) return p;
      k = Re(k, a, f);
    }
    return null;
  }
  function Oe(s) {
    if ((s.relationships?.getAssociations?.() ?? []).some((d) => d.targetPoint))
      return "A note with a line that ends on empty canvas stays a note. Join that line to a note first.";
    if (s.options?.image && !Ln(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !st({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const pn = (s) => s || "This note", Y = (s) => s.label || "The empty card";
  function Ee() {
    return !h && !l && !r && !je() && Me(t);
  }
  function Ue(s) {
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
  function Un(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (w.get(s.id) === s) {
      const a = ne(s.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment ? null : s.id;
  }
  function Gn(s, a) {
    if (s.cards.some((c) => c.id === a)) {
      const c = w.get(X(ie.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && w.get(a) !== d && d.svgGroup ? d : null;
  }
  function qn(s) {
    const a = [];
    for (const d of s) {
      const c = e.nodes.one(d.parentId), k = e.nodes.one(d.childId);
      if (!c?.relationships || !k || w.get(c.id) === c || w.get(k.id) === k || c.relationships.hasAssociationId?.(d.id)) continue;
      const f = c.relationships.addAssociation(k, xn(d));
      a.push({ type: "addRelationship", data: { ...f } });
    }
    return a;
  }
  function Ft(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      const c = Gn(s, d.parentId), k = Gn(s, d.childId);
      if (!c || !k || c === k) continue;
      const f = w.get(c.id) !== c, p = f ? k : c, u = f ? c : k, I = { ...d, parentId: p.id, childId: u.id };
      f && (I.showParentArrow = d.showChildArrow ?? !0, I.showChildArrow = d.showParentArrow ?? !1);
      const E = JSON.stringify(I);
      a.add(d.id);
      const T = D.get(d.id);
      T && T.key === E && T.holder === p && T.other === u && p.relationships.hasAssociationId?.(d.id) || (T && e.nodes.one(T.holder.id) === T.holder && T.holder.relationships?.removeAssociation?.(d.id), p.relationships.addAssociation(u, xn(I)), D.set(d.id, { holder: p, other: u, swapped: f, key: E }));
    }
    for (const [d, c] of [...D])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), D.delete(d));
  }
  function mn(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  function jt(s, a) {
    if (s === "addRelationship") {
      if (D.get(a?.id)?.holder.id === a?.parentId) return;
      const d = e.nodes.one(a?.parentId), c = a?.targetPoint ? null : e.nodes.one(a?.childId), k = Un(d), f = Un(c), p = (E) => {
        mn(a), e.announce?.(E), B(o.onRefuse, { reason: E, laneId: null });
      };
      if (!Ee()) return mn(a);
      if (!k || !f) return p("A line from a card ends on a note or another card.");
      const u = $t(t, k, f, Ue(a)), I = sn(t, u);
      if (I) return p(I);
      mn(a), Ne({ set: u });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...D].find(([k, f]) => (k === a?.id || !a?.id && f.other.id === a?.childId) && f.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = D.get(d);
      if (D.delete(d), e.nodes.one(c.holder.id) !== c.holder || e.nodes.one(c.other.id) !== c.other || !Ee())
        return Ee() || h ? void 0 : F(r ?? t);
      Ne({ remove: d });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...D].find(([T, j]) => T === d?.associationId && j.holder.id === d?.id);
        if (!c) continue;
        const [k, f] = c, p = t.lines?.find((T) => T.id === k), u = f.holder.relationships?.getAssociations?.().find((T) => T.id === k);
        if (!p || !u) continue;
        if (!Ee()) {
          F(r ?? t);
          continue;
        }
        const E = { ...Ue(u), id: p.id, parentId: p.parentId, childId: p.childId };
        f.swapped && (E.showParentArrow = u.showChildArrow, E.showChildArrow = u.showParentArrow), JSON.stringify(Dt(E)) !== JSON.stringify(p) && (D.set(k, { ...f, key: "" }), Ne({ set: E }));
      }
  }
  function Dt(s) {
    return Xe({ ...t, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function Ne(s) {
    const a = t.lines?.find((u) => u.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? Xe(t, s.set) : ct(t, s.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), F(r ?? t);
    const c = "set" in s ? s.set : a, k = [c.parentId, c.childId].map((u) => t.cards.find((I) => I.id === u)?.label ?? e.nodes.one(u)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), f = (u) => k[u] || "a note";
    e.announce?.("set" in s ? a ? `The line from ${f(0)} to ${f(1)} changed.` : `${f(0)} is joined to ${f(1)}.` : `The line from ${f(0)} to ${f(1)} was taken away.`);
    const p = B(o.onChange, t, { line: s });
    Sn(p, () => {
      if (h || t !== d) return;
      const u = a ? Xe(t, a) : "set" in s ? ct(t, s.set.id) : null;
      u && (t = u, F(r ?? t));
    });
  }
  function Ht(s) {
    const a = new Map(s.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || Ne({ remove: c });
    for (const [c, k] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(k) && sn(t, k) === null && Ne({ set: k });
  }
  function wn(s, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), k = s.map(({ node: u, offer: I, from: E }) => {
      let T = I.lines;
      for (const [V, H] of c) T = Ae(T, V, H);
      d = Re(d, a, { ...I, ...T ? { lines: T } : {} });
      const j = d.cards[d.cards.length - 1];
      j.id !== u.id && c.set(u.id, j.id);
      const _ = { ...u.options ?? {}, ...E ? { x: E.x, y: E.y } : {} };
      return { node: u, card: j, kept: _, lines: Ae(T ?? [], u.id, j.id) };
    });
    e.beginHostStep?.(), t = d;
    let f = t;
    for (const { node: u, card: I } of k)
      I.id !== u.id && M.set(u.id, I.id), K.set(X(ie.card(I.id)), { x: u.options?.x ?? 0, y: u.options?.y ?? 0 }), ve(() => e.removeNode(u.id));
    e.endHostStep?.(), F(t), Ut(X(ie.card(k[0].card.id)));
    const p = t.lanes.find((u) => u.id === a);
    e.announce?.(k.length === 1 ? `${Y(k[0].card)} is now a card in ${p.label}. ${he(t, a)}.` : `${Bn(k.map(({ card: u }) => Y(u)))} are now cards in ${p.label}. ${he(t, a)}.`);
    for (const { node: u, card: I, kept: E, lines: T } of k) {
      const j = { cardId: I.id, laneId: a, noteToCard: {
        noteId: u.id,
        label: I.label,
        ...I.look ? { look: I.look } : {},
        ...I.asNote ? { asNote: I.asNote } : {},
        ...T.length ? { lines: T } : {}
      } }, _ = () => {
        t !== f || !t.cards.some((H) => H.id === I.id) || (t = J({ ...t, cards: t.cards.filter((H) => H.id !== I.id), lines: Ae(t.lines, I.id, u.id) }), f = t, F(t));
      }, V = B(o.onChange, t, j);
      e.holdTrade?.(u.id, V), Kn(V, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: u.id, isComment: !1 } }]);
      }, () => {
        if (!h) {
          if (_(), !e.nodes.one(E.id)) {
            e.beginHostStep?.();
            const H = ve(() => e.addNode({ ...E }));
            H && (H.announcedByCreator = !0), e.endHostStep?.();
            const yn = Ae(T, I.id, u.id).filter((oe) => !t.cards.some((Ge) => Ge.id === oe.parentId || Ge.id === oe.childId));
            H?.ready?.then?.(() => {
              h || ve(() => qn(yn));
            });
          }
          e.announce?.(`${Y(I)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        h || (_(), e.keepTrade?.(u.id), e.announce?.(`Someone else put ${Y(I)} on the board first.`));
      });
    }
  }
  function gn(s, a) {
    const d = t.cards.find((Q) => Q.id === s), c = t.lanes.find((Q) => Q.id === d.laneId), k = t.cards.findIndex((Q) => Q.id === s), f = t.cards.slice(k + 1).find((Q) => Q.laneId === d.laneId)?.id, p = g.get(X(ie.card(s))) ?? {}, u = e.nodes.one(s) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : s, I = dt(t, s), { leave: E } = Po(t, s, u), T = lt(t, s, u), j = ($.cornerRadius ?? 0) > 0, _ = d.asNote, V = _?.text !== void 0 && kt(_.text) === d.label ? _.text : d.label, H = {
      id: u,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: _?.width ?? p.width ?? 228,
      height: _?.height ?? p.height ?? 76,
      text: V,
      shape: _?.shape ?? (j ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? p.backgroundColor,
      fontColor: d.look?.textColor ?? p.foregroundColor,
      fontSize: d.look?.fontSize ?? p.fontSize,
      borderColor: d.look?.borderColor ?? p.borderColor,
      borderWidth: d.look?.borderWidth ?? p.borderWidth,
      ...d.look?.fontFamily ?? p.fontFamily ? { fontFamily: d.look?.fontFamily ?? p.fontFamily } : {}
    };
    _?.image && Object.assign(H, {
      image: _.image.src,
      ..._.image.width ? { imageOrigWidth: _.image.width } : {},
      ..._.image.height ? { imageOrigHeight: _.image.height } : {}
    }), _?.link && (H.link = { ..._.link });
    for (const Q of Object.keys(H)) H[Q] === void 0 && delete H[Q];
    e.beginHostStep?.(), t = T;
    const yn = t;
    u !== s ? M.set(u, s) : M.delete(u);
    const oe = ve(() => e.addNode(H));
    oe && (oe.announcedByCreator = !0), e.endHostStep?.(), F(t);
    const Ge = Promise.resolve(oe?.ready).then(() => h || !oe || e.nodes.one(u) !== oe ? [] : ve(() => qn(E))).catch(() => []);
    oe?.ready?.then?.(() => {
      if (h || e.nodes.one(u) !== oe) return;
      const Q = () => e.selectNodes?.([oe]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(Q) : Q();
    }), e.announce?.(`${Y(d)} is now a note on the canvas. ${c.label}: ${he(t, c.id)}.`);
    const Vn = () => {
      e.nodes.one(u) === oe && (e.beginHostStep?.(), ve(() => e.removeNode(u)), e.endHostStep?.());
    }, Qn = B(o.onChange, t, { cardId: s, cardToNote: { noteId: u } });
    e.holdTrade?.(u, Qn), Kn(Qn, () => {
      Ge.then((Q) => {
        oe && e.nodes.one(u) === oe && e.sendHeld?.([{ type: "onNodeAdded", data: { id: u, nodeOptions: ot(oe.options) } }, ...Q]);
      });
    }, () => {
      if (!h) {
        if (Vn(), t === yn && !t.cards.some((Q) => Q.id === s)) {
          const Q = {
            id: s,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...I.length ? { lines: I } : {}
          }, Xn = Re(t, d.laneId, Q, f);
          Xn && (t = Xn, F(t));
        }
        e.announce?.(`${Y(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      h || (Vn(), e.keepTrade?.(u), e.announce?.(`Someone else took ${Y(d)} off the lanes first.`));
    });
  }
  function Bt(s, a, d) {
    const c = d.map((I) => I.id), k = c.indexOf(a), f = s.cards.find((I) => I.id === a);
    if (k < 0 || !f) return s;
    const p = s.cards.filter((I) => I !== f), u = p.findIndex((I) => c.indexOf(I.id) > k);
    return p.splice(u < 0 ? p.length : u, 0, f), J({ ...s, cards: p });
  }
  function Ut(s) {
    m = m.then(() => {
      const a = w.get(s);
      if (h || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function ve(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function Kn(s, a, d, c) {
    if (!s || typeof s.then != "function") return a();
    const k = s.then((f) => {
      f === !0 ? a() : f === !1 ? d() : f === "taken" && c();
    }, () => d());
    e.holdUntil?.(k);
  }
  function Gt(s, a) {
    te(!1), i = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => te(), 1500) }, F(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), B(o.onRefuse, a);
  }
  function te(s = !0) {
    i && (clearTimeout(i.timer), i = null, s && !h && pe());
  }
  function pe() {
    F(S && S.outcome.kind === "candidate" ? S.outcome.next : y?.next ?? r ?? t, { skip: S?.cardId });
  }
  function Jn(s) {
    const a = pt(s, { native: !0, origin: U, rows: Yn(), layout: C, style: $ }).nodes, d = new Map(a.map((f) => [f.options.id, f.options])), c = (f, p, u, I = !1) => {
      const E = d.get(ie.column(f));
      E && (E.borderColor = p, E.borderWidth = u, delete E.borderStyle);
      const T = I && d.get(ie.lane(f));
      T && (T.borderColor = p, T.borderWidth = u);
    }, k = S?.cardId ?? y?.cardId;
    if (O = /* @__PURE__ */ new Map(), k) {
      const f = t.cards.find((u) => u.id === k)?.laneId;
      for (const u of at(t, k)) u.id !== f && (c(u.id, it, 2), O.set(u.id, "open"));
      const p = S ? S.outcome : y?.laneId ? { kind: "candidate", laneId: y.laneId } : null;
      p?.kind === "candidate" && (c(p.laneId, rt, 3, !0), O.set(p.laneId, "over")), p?.kind === "refused" && (c(p.laneId, Cn, 3), O.set(p.laneId, "refused"));
    }
    if (L && !k) {
      for (const f of L.open) f !== L.laneId && (c(f, it, 2), O.set(f, "open"));
      L.laneId && !L.refusal && (c(L.laneId, rt, 3, !0), O.set(L.laneId, "over")), L.laneId && L.refusal && (c(L.laneId, Cn, 3), O.set(L.laneId, "refused"));
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
    if (W = /* @__PURE__ */ new Set(), r && s === r) {
      const f = (u, I) => JSON.stringify(u) === JSON.stringify(I), p = (u) => {
        const I = d.get(u);
        I && (I.borderStyle = "dashed", I.borderColor = po, I.borderWidth = 2, W.add(X(u)));
      };
      for (const u of s.cards) f(u, t.cards.find((I) => I.id === u.id)) || p(ie.card(u.id));
      for (const u of s.lanes) f(u, t.lanes.find((I) => I.id === u.id)) || p(ie.lane(u.id));
    }
    for (const f of a) {
      f.options.id = X(f.options.id);
      for (const p of f.relationships.associations)
        p.parentId = X(p.parentId), p.childId = X(p.childId);
    }
    return a;
  }
  function Yn() {
    return S || y ? t.lanes.map((s) => t.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function F(s, a = {}) {
    if (h) return;
    x = { model: s, skip: a.skip, animate: a.animate !== !1 };
    const d = Jn(s), c = [];
    for (const { options: f } of d) {
      const p = f.id;
      if (w.has(p)) continue;
      const u = K.get(p);
      K.delete(p);
      const I = u && a.animate !== !1 && !An() ? { ...f, xPos: u.x, yPos: u.y } : f, E = e.nodes.add(co(I));
      w.set(p, E), g.set(p, { ...I }), E.ready && c.push(E.ready.then(() => {
        if (w.get(p) !== E) return;
        E.applyGovernance?.(), ne(p)?.kind === "column" && E.toBack?.(!1);
        const T = Zn(x?.model ?? s, p);
        T && E.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const k = x;
    m = Promise.all([m, ...c]).then(() => {
      h || x !== k || qt(Jn(k.model), k);
    }).catch((f) => console.warn("WORKSHOP: could not draw the workshop", f));
  }
  function qt(s, a) {
    const d = new Set(s.map((k) => k.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [f, p] of [...w]) {
        if (d.has(f)) continue;
        for (const [I, E] of [...b])
          E.parentId !== f && E.childId !== f || (E.parent.relationships?.removeAssociation(I), b.delete(I));
        e.deselectNode?.(p), p.editor?.cancelInline?.(), w.delete(f), g.delete(f);
        const u = A.get(f);
        u && (A.delete(f), v.delete(u)), e.nodes.remove(f);
      }
      for (const { options: f } of s) {
        const p = f.id, u = w.get(p);
        if (!u?.svgGroup) continue;
        const I = g.get(p) ?? {}, E = u.editor?.isInlineEditing?.();
        (f.fontSize !== I.fontSize || f.foregroundColor !== I.foregroundColor) && (u.options.fontSize = f.fontSize, u.options.fontColor = f.foregroundColor, u.applyTextStyle?.()), f.text !== I.text && !E && u.setText?.(f.text), (f.width !== I.width || f.height !== I.height) && (f.vectorPath ? (u.options.width = f.width, u.options.height = f.height, u.setShape?.(u.options.shape, f.vectorPath), ne(p)?.kind === "column" && u.toBack?.(!1)) : u.setSize?.(f.width, f.height)), f.backgroundColor !== I.backgroundColor && u.setColors?.(f.backgroundColor), (f.borderColor !== I.borderColor || f.borderWidth !== I.borderWidth || f.borderStyle !== I.borderStyle) && (u.options.borderColor = f.borderColor, u.options.borderWidth = f.borderWidth, u.options.borderStyle = f.borderStyle, u.applyBorder?.());
        const T = f.xPos !== I.xPos || f.yPos !== I.yPos || Math.abs((u.options.x ?? 0) - f.xPos) > 0.5 || Math.abs((u.options.y ?? 0) - f.yPos) > 0.5;
        if (p !== (a.skip && X(ie.card(a.skip))) && T) {
          const V = a.animate && !An() ? 180 : 0, H = c.includes(u) ? () => {
            !h && w.get(p) === u && (e.getSelectedNodes?.() ?? []).includes(u) && e.updateSelectionResizeRotate?.();
          } : void 0;
          H && V && c.length === 1 && u.resizeRotate?.disable?.(), u.position(f.xPos, f.yPos, H, void 0, V);
        }
        const j = Zn(a.model, p);
        j && u.svgGroup.node.getAttribute("aria-label") !== j && u.svgGroup.node.setAttribute("aria-label", j), W.has(p) ? u.svgGroup.node.setAttribute("data-workshop-proposed", "") : u.svgGroup.node.removeAttribute("data-workshop-proposed");
        const _ = ne(p);
        if (_?.kind === "column") {
          const V = O.get(_.key);
          V ? u.svgGroup.node.setAttribute("data-workshop-drop", V) : u.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        g.set(p, { ...f });
      }
      const k = /* @__PURE__ */ new Map();
      for (const f of s) for (const p of f.relationships.associations) k.set(p.id, p);
      for (const [f, p] of [...b])
        k.has(f) && w.get(p.parentId) === p.parent && w.get(p.childId) === p.child || (p.parent.relationships?.removeAssociation(f), b.delete(f));
      for (const [f, p] of k) {
        if (b.has(f)) continue;
        const u = w.get(p.parentId), I = w.get(p.childId);
        !u?.relationships || !I?.svgGroup || (u.relationships.addAssociation(I, xn(p)), b.set(f, { parentId: p.parentId, childId: p.childId, parent: u, child: I }));
      }
      Ft(a.model);
    }), e.notifyNodeChanged?.();
  }
  function Zn(s, a) {
    const d = ne(a);
    if (d?.kind === "lane") {
      const c = s.lanes.find((k) => k.id === d.key);
      return c ? `${c.label}, ${he(s, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = s.cards.find((f) => f.id === d.key), k = c && s.lanes.find((f) => f.id === c.laneId);
      return c && k ? `${c.label || "Empty card"}, in ${k.label}` : null;
    }
    return null;
  }
  function Kt(s, a) {
    const d = pt(s, { native: !0, origin: U, layout: C, style: $ }).nodes.find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function xe() {
    S && e.cancelGovernedDrag?.("host"), S = null, y && (y = null, B(o.onPreview, null)), te(!1);
  }
  return {
    toCanvas(s) {
      if (h || l || je()) return "This workshop is view-only here.";
      if (!t.cards.some((k) => k.id === s)) return "That card is no longer on the board.";
      const a = Qe(t, s);
      if (a) return a;
      y && Ie(), r && (xe(), r = null, F(t), e.refreshGovernance?.());
      const { width: d } = fe(t, { layout: C }), c = w.get(X(ie.card(s)))?.options;
      return gn(s, { x: U.x + d + 32, y: c?.y ?? U.y }), null;
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
      const { width: s, height: a } = fe(t, { layout: C });
      return { x: U.x, y: U.y, width: s, height: a };
    },
    setLayout(s) {
      if (h) throw new Error("This workshop has been detached.");
      const a = s?.lanesPerRow === void 0 ? {} : { lanesPerRow: s.lanesPerRow };
      fe(t, { layout: a }), a.lanesPerRow !== C.lanesPerRow && (xe(), C = a, F(r ?? t));
    },
    whenDrawn: () => m,
    update(s) {
      if (h) throw new Error("This workshop has been detached.");
      const a = J(s);
      xe(), t = a, F(r ?? t);
    },
    preview(s) {
      if (h) throw new Error("This workshop has been detached.");
      const a = s ? J(s) : null;
      xe(), r = a, F(r ?? t), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = t.lanes.find((c) => c.id === s);
      h || !d || (te(!1), i = { laneId: s, reason: a, timer: setTimeout(() => te(), 1500) }, pe(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      h || l === !!s || (xe(), l = !!s, F(r ?? t), e.refreshGovernance?.());
    },
    destroy() {
      h || (xe(), h = !0, e.element?.removeEventListener?.("pointerdown", jn, !0), _t?.(), e.withPolicyAuthority(() => {
        for (const [s, a] of D) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of b) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of w)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), b.clear(), D.clear(), w.clear(), g.clear(), v.clear(), A.clear(), Fe(), N = !1, un(), e.notifyNodeChanged?.());
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
function go(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function yo(e) {
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
function ko(e) {
  return e == null || typeof e == "string" && !e.trim() ? "" : ce(e);
}
function kt(e) {
  const n = String(e ?? "").replace(/\s+/g, " ").trim();
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function bt(e) {
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
function de(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const It = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, bo = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Pn(e) {
  const n = le(e), o = {}, t = (l) => {
    if (typeof l != "string" || !It.test(l)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return l;
  }, r = (l, h, w) => {
    if (typeof l != "number" || !Number.isFinite(l) || l < h || l > w) throw new Error("A card size is out of range.");
    return l;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !bo.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = r(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = r(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function vt(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        Pn({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return Pn(n);
}
function Ln(e) {
  if (typeof e != "string" || !e || e.length > 4096) return !1;
  if (/^\/(?!\/)/.test(e)) return !0;
  try {
    return ["https:", "http:"].includes(new URL(e).protocol);
  } catch {
    return !1;
  }
}
function st(e) {
  try {
    return !!on({ link: e });
  } catch {
    return !1;
  }
}
function on(e) {
  const n = le(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string" || n.text.length > 4e3 || /[<>\u0000-\u0009\u000b-\u001f]/.test(n.text)) throw new Error("A card keeps plain words only.");
    o.text = n.text;
  }
  if (n.image !== void 0) {
    const t = le(n.image);
    if (!Ln(t.src)) throw new Error("A card keeps a picture by its web address only.");
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
    if (!(typeof r == "string" ? r.length <= 2048 : !!r && typeof r == "object" && !Array.isArray(r) && JSON.stringify(r).length <= 2048 && Object.values(r).every((h) => typeof h == "string")) || t.type !== void 0 && (typeof t.type != "string" || !/^[A-Za-z]{1,40}$/.test(t.type)) || t.show !== void 0 && typeof t.show != "boolean") throw new Error("A card keeps a link as a note does.");
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
const $e = 96, Io = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, vo = ["solid", "dashed", "dotted"];
function Pe(e) {
  const n = le(e);
  if (typeof n.id != "string" || !Io.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: de(n.parentId), childId: de(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (r, l, h) => {
    const w = n[r];
    if (w != null) {
      if (typeof w != "number" || !Number.isFinite(w) || w < l || w > h) throw new Error("A line's look is out of range.");
      o[r] = w;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !It.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!vo.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
function xo(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(Pe).filter((t) => n.has(t.parentId) || n.has(t.childId));
  if (we(o.map((t) => t.id), "line ID"), o.length > $e) throw new Error(`A workshop holds up to ${$e} lines.`);
  return o;
}
function we(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function zn({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((r) => r.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Ao(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Se = (e) => "lane-" + e, ge = (e) => "card-" + e, ln = (e) => "image-" + e;
function tr(e) {
  const n = Ao(e);
  return zn(e).map((o) => {
    const t = e.cards.filter((h) => h.laneId === o.id), r = n.filter((h) => h.laneId === o.id), l = [Se(o.id)];
    return o.station?.image && l.push(ln(o.id)), { lane: o, cards: t, signals: r, nodeIds: [...l, ...t.map((h) => ge(h.id))] };
  });
}
const xt = 5, At = 24, On = 3;
function J(e) {
  const n = le(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ce(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > xt)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > At)
    throw new Error("A workshop supports up to 24 cards.");
  const r = n.lanes.map((g) => {
    const b = le(g), v = { id: de(b.id), label: ce(b.label) };
    if (b.capacity !== void 0) {
      const A = o ? 576 : 24;
      if (typeof b.capacity != "number" || !Number.isInteger(b.capacity) || b.capacity < 1 || b.capacity > A)
        throw new Error(`Lane capacity must be a whole number from 1 to ${A}.`);
      v.capacity = b.capacity;
    }
    if (b.station !== void 0) {
      const A = le(b.station), S = (L) => {
        if (typeof L != "number" || !Number.isInteger(L) || L < 0 || L >= On)
          throw new Error("Use map coordinates from 0 to 2.");
        return L;
      };
      if (!Array.isArray(A.next) || A.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const y = A.next.map(de);
      we(y, "onward stop"), v.station = { column: S(A.column), row: S(A.row), next: y, outcome: ce(A.outcome, 160) }, A.image !== void 0 && (v.station.image = bt(A.image));
    }
    return v;
  }), l = r.map((g) => g.id);
  if (we(l, "lane ID"), (o || r.some((g) => g.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (r.some((g) => g.station)) {
    if (!r.every((g) => g.station)) throw new Error("Give every station on the map a position.");
    we(r.map((g) => g.station.column + "," + g.station.row), "map position");
    for (const g of r)
      if (g.station.next.some((b) => b === g.id || !l.includes(b))) throw new Error("Connect each stop to another station on this map.");
  }
  const h = n.cards.map((g) => {
    const b = le(g), v = { id: de(b.id), label: ko(b.label), laneId: de(b.laneId) };
    if (!l.includes(v.laneId)) throw new Error("Card refers to an unknown lane.");
    if (b.allowedLaneIds !== void 0) {
      if (!Array.isArray(b.allowedLaneIds) || b.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (v.allowedLaneIds = b.allowedLaneIds.map(de), we(v.allowedLaneIds, "allowed lane"), !v.allowedLaneIds.includes(v.laneId) || !v.allowedLaneIds.every((A) => l.includes(A)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (b.look !== void 0) {
      const A = Pn(b.look);
      A && (v.look = A);
    }
    if (b.asNote !== void 0) {
      const A = on(b.asNote);
      A && (v.asNote = A);
    }
    if (o) {
      if (typeof b.points != "number" || !Number.isInteger(b.points) || b.points < 1 || b.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (v.points = b.points, b.dependsOn !== void 0) {
        if (!Array.isArray(b.dependsOn) || b.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        v.dependsOn = b.dependsOn.map(de), we(v.dependsOn, "dependency");
      }
    }
    return v;
  });
  we(h.map((g) => g.id), "card ID");
  const w = { version: 1, title: t, lanes: r, cards: h };
  if (n.experience !== void 0) {
    const g = le(n.experience);
    if (g.version !== 1 || g.kind !== "customer-interviews" && g.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    w.experience = { version: 1, kind: g.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    w.signals = n.signals.map((g) => {
      const b = le(g), v = de(b.cardId), A = de(b.laneId);
      if (!h.some((S) => S.id === v) || !l.includes(A))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: de(b.id),
        label: ce(b.label),
        cardId: v,
        laneId: A,
        whenPresent: ce(b.whenPresent, 160),
        whenAbsent: ce(b.whenAbsent, 160)
      };
    }), we(w.signals.map((g) => g.id), "placement outcome ID");
  }
  if (n.lines !== void 0) {
    const g = xo(n.lines, new Set(h.map((b) => b.id)));
    g.length && (w.lines = g);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    w.presentationOrder = zn({ lanes: r, presentationOrder: n.presentationOrder }).map((g) => g.id);
  }
  if (o)
    return w.kind = "release-plan", Jt(w), w;
  for (const g of r)
    if (h.filter((b) => b.laneId === g.id).length > (g.capacity ?? 1 / 0))
      throw new Error(`Lane "${g.label}" exceeds its capacity.`);
  return w;
}
const Ct = 65536;
function or(e) {
  const n = JSON.stringify(J(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Ct) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function rr(e) {
  if (e.length > Ct) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return J(t);
}
function rn(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => an(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((r) => r.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function En(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  if (t && e.kind === "release-plan") {
    const r = an(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !rn(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
function Te(e, n, o) {
  const t = e.cards.find((l) => l.id === n);
  if (!t || !e.lanes.some((l) => l.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return an(e, t, o);
  const r = Mo(e, n, o);
  return r || (o === "prototype" && Le(e) === "customer-interviews" ? null : rn(e, t).some((l) => l.id === o) ? En(e, n, o) : null);
}
function at(e, n) {
  return e.lanes.filter((o) => Te(e, n, o.id) !== null);
}
function Ve(e, n, o) {
  if (Te(e, n, o) !== null) return null;
  const t = e.cards.find((g) => g.id === n), r = e.lanes.find((g) => g.id === o);
  if (!t || !r) return "That move is not available.";
  const l = `This card can't go in ${r.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return l;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return l;
    const g = be(e, o), b = { ...e, lanes: e.lanes.map((A) => A === r ? { id: r.id, label: r.label } : A) }, v = an(b, t, o);
    return v ? `Needs ${be(v, o) - g} points. It already holds ${g} of ${r.capacity} points.` : l;
  }
  const h = e.lanes.find((g) => g.id === t.laneId);
  if (h?.station && !h.station.next.includes(o)) return `${r.label} can't be reached from ${h.label}.`;
  const w = e.cards.filter((g) => g.laneId === o).length;
  return r.capacity !== void 0 && w >= r.capacity ? `It already holds ${w} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.` : l;
}
function Me(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !Le(e);
}
const Co = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function So(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && Co.test(n) && !o.has(n) ? n : fn(e, "card");
}
function Ce(e, n, o) {
  const t = e.lanes.find((h) => h.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((h) => h.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Le(e)) return "This workshop keeps the cards it came with.";
  const r = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (/[<>\u0000-\u001f]/.test(r)) return "A card holds plain words only.";
  if (e.cards.length >= At) return "A workshop holds up to 24 cards.";
  const l = e.cards.filter((h) => h.laneId === n).length;
  if (t.capacity !== void 0 && l >= t.capacity) return `It already holds ${l} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const h = St(o.lines);
    if (!h) return "A line of this note can't be joined to a card.";
    const w = new Set((e.lines ?? []).map((g) => g.id));
    if ((e.lines?.length ?? 0) + h.filter((g) => !w.has(g.id)).length > $e)
      return `A workshop holds up to ${$e} lines.`;
  }
  return null;
}
function To(e) {
  try {
    return e && typeof e == "object" ? vt(e) : void 0;
  } catch {
    return;
  }
}
function $o(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      on({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? on(n) : void 0;
}
function St(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let r = null;
    try {
      r = Pe(t);
    } catch {
      try {
        const { id: l, parentId: h, childId: w } = le(t);
        r = Pe({ id: l, parentId: h, childId: w });
      } catch {
        r = null;
      }
    }
    if (!r) return null;
    o.push(r);
  }
  return o;
}
function dn(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function Ae(e, n, o) {
  return e && e.map((t) => dn(t, n, o));
}
function Tt(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function Re(e, n, o, t) {
  if (Ce(e, n, o) !== null) return null;
  const r = To(o.look), l = typeof o.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  let h = $o(o.asNote);
  l.length > 80 && h?.text === void 0 && l.length <= 4e3 && (h = { ...h, text: l });
  const w = {
    id: So(e, o.id),
    label: kt(l),
    laneId: n,
    ...r ? { look: r } : {},
    ...h ? { asNote: h } : {}
  }, g = t === void 0 ? -1 : e.cards.findIndex((A) => A.id === t && A.laneId === n), b = g < 0 ? [...e.cards, w] : [...e.cards.slice(0, g), w, ...e.cards.slice(g)], v = o.lines === void 0 ? void 0 : Tt(e, St(o.lines).map((A) => dn(A, o.id, w.id)));
  return J({ ...e, cards: b, ...v ? { lines: v } : {} });
}
function Qe(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!Me(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((l) => e.lanes.find((h) => h.id === l).label), r = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${r}, so it stays a card.`;
  }
  return null;
}
function lt(e, n, o = n) {
  if (Qe(e, n) !== null) return null;
  const t = e.lines?.map((r) => dn(r, n, o));
  return J({ ...e, cards: e.cards.filter((r) => r.id !== n), ...t ? { lines: t } : {} });
}
function Po(e, n, o = n) {
  const t = new Set(e.cards.filter((h) => h.id !== n).map((h) => h.id)), r = (e.lines ?? []).filter((h) => h.parentId === n || h.childId === n).map((h) => dn(h, n, o)), l = (h) => t.has(h.parentId) || t.has(h.childId);
  return { stay: r.filter(l), leave: r.filter((h) => !l(h)) };
}
function dt(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function sn(e, n) {
  let o;
  try {
    o = Pe(n);
  } catch (l) {
    return l instanceof Error ? l.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((l) => l.id));
  return !t.has(o.parentId) && !t.has(o.childId) ? "That card is no longer on the board." : e.lanes.some((l) => l.id === o.parentId || l.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((l) => l.id === o.id) && (e.lines?.length ?? 0) >= $e ? `A workshop holds up to ${$e} lines.` : null;
}
function Xe(e, n) {
  return sn(e, n) !== null ? null : J({ ...e, lines: Tt(e, [Pe(n)]) });
}
function ct(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? J({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function $t(e, n, o, t = {}) {
  const r = new Set((e.lines ?? []).map((h) => h.id));
  let l = `${n}->${o}`;
  for (let h = 2; r.has(l); h++) l = `${n}->${o}~${h}`;
  return Pe({ showChildArrow: !0, ...t, id: l, parentId: n, childId: o });
}
function Lo(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function he(e, n) {
  const o = e.lanes.find((l) => l.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const l = be(e, n);
    return o.capacity ? l + " / " + o.capacity + " points" : l + " points";
  }
  const t = Wo(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const r = e.cards.filter((l) => l.laneId === n).length;
  return o.capacity !== void 0 ? r + " of " + o.capacity : r + (r === 1 ? " card" : " cards");
}
const cn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, en = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Pt(e, n = cn, o = 28, t) {
  const { pitch: r, row: l, top: h } = n, w = !!e.lanes[0].station, g = e.lanes.map((A) => e.cards.filter((S) => S.laneId === A.id).length), b = h + Math.max(1, ...t ?? g) * l + 36, v = e.lanes.map((A, S) => ({
    x: w ? A.station.column * (r + o) : S * r,
    y: w ? A.station.row * b : 0
  }));
  return {
    points: v,
    width: Math.max(...v.map((A) => A.x)) + r,
    height: Math.max(...v.map((A, S) => A.y + h + (w ? Math.max(1, g[S]) : g[S] + 1) * l))
  };
}
function ir() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function fn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Lt(e) {
  const n = J(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Oo(e, n) {
  const o = Lt(e), t = fn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), J(o);
}
function Eo(e, n, o) {
  const t = Lt(e);
  return t.cards.push({
    id: fn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), J(t);
}
function sr() {
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
function ft(e, n, o) {
  const t = J(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = t.lanes.find((v) => v.id === n);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= xt) throw new Error("A map can have up to five stations.");
  const l = ce(o?.label), h = ce(o?.outcome, 160), w = fn(t, "station");
  let g, b = 1 / 0;
  for (let v = 0; v < On; v++)
    for (let A = 0; A < On; A++) {
      if (t.lanes.some((y) => y.station.column === A && y.station.row === v)) continue;
      const S = Math.abs(r.station.column - A) + Math.abs(r.station.row - v);
      S < b && (b = S, g = { column: A, row: v });
    }
  if (!g) throw new Error("There is no free station position.");
  return r.station.next.push(w), t.lanes.push({ id: w, label: l, station: { ...g, next: [], outcome: h, ...o.image === void 0 ? {} : { image: bt(o.image) } } }), t.presentationOrder?.push(w), t;
}
const ar = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Ot = (e) => "caption-" + e, We = (e) => "column-" + e, ie = { lane: Se, card: ge, image: ln, caption: Ot, column: We };
function Et(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Tn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), r = e, l = n;
  return t ? `M ${t} 0 H ${r - t} Q ${r} 0 ${r} ${t} V ${l - t} Q ${r} ${l} ${r - t} ${l} H ${t} Q 0 ${l} 0 ${l - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${r} V ${l} H 0 Z`;
}
function ut(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ht(e, n, o, t) {
  for (let r = n; r > 11; r--) {
    const l = Math.max(1, Math.floor(o / (r * 0.55)));
    if (e.split(`
`).reduce((w, g) => w + Math.max(1, Math.ceil(g.length / l)), 0) * r * 1.3 <= t) return r;
  }
  return Math.min(n, 11);
}
const Nt = 152, Nn = Nt + 12, No = 12;
function _o(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function fe(e, n = {}) {
  const o = J(e), { pitch: t, row: r, top: l } = cn, h = o.lanes.map((S) => o.cards.filter((y) => y.laneId === S.id).length), w = (S) => Math.max(h[S], (Array.isArray(n.rows) ? n.rows[S] : n.rows) ?? 0), g = !!o.lanes[0].station, b = o.lanes.some((S) => S.station?.image), v = _o(n.layout, o.lanes.length), A = [];
  if (g) {
    const { points: S } = Pt(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((y, L) => A.push({
      laneId: y.id,
      x: S[L].x,
      y: S[L].y + (b ? y.station.row * Nn : 0),
      width: t,
      height: l + (y.station.image ? Nn : 0) + Math.max(1, w(L)) * r,
      column: y.station.column,
      row: y.station.row
    }));
  } else {
    let S = 0;
    for (let y = 0; y < o.lanes.length; y += v) {
      const L = o.lanes.slice(y, y + v), M = l + (Math.max(...L.map((K, i) => w(y + i))) + 1) * r;
      L.forEach((K, i) => A.push({ laneId: K.id, x: i * t, y: S, width: t, height: M, column: i, row: y / v })), S += M + No;
    }
  }
  return { places: A, width: Math.max(...A.map((S) => S.x + S.width)), height: Math.max(...A.map((S) => S.y + S.height)) };
}
function Ro(e, n) {
  const { pitch: o, width: t, row: r, height: l, top: h } = cn, w = n.origin ?? { x: 0, y: 0 }, g = !!e.lanes[0].station, { places: b } = fe(e, n), v = n.style ?? {}, A = v.textColor ?? _e.fontColor, S = v.borderColor ?? _e.borderColor, y = v.borderWidth ?? _e.borderWidth, L = v.cornerRadius ?? 0, M = v.fontSize ?? _e.fontSize, K = v.laneFontSize ?? M + 2, i = v.captionFontSize ?? Math.max(11, M - 1), m = [], x = ($) => {
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
    const W = b[O], q = w.x + W.x, N = w.y + W.y, D = $.station?.image;
    x({
      id: We($.id),
      text: "",
      name: $.label,
      xPos: q + 2,
      yPos: N,
      width: o - 4,
      height: W.height,
      vectorPath: Tn(o - 4, W.height, L ? L + 2 : 0),
      backgroundColor: g ? "#fcf9ed" : ut(en[O], 0.6),
      borderColor: g ? "#a8b5aa" : ut(en[O], 0.1),
      borderWidth: 1,
      ...g ? { borderStyle: "dashed" } : {}
    }), x({
      id: Se($.id),
      text: $.label,
      name: $.label,
      xPos: q + 8,
      yPos: N + 6,
      width: t,
      height: 58,
      backgroundColor: en[O],
      fontSize: ht($.label, K, t - 16, 50)
    }), x({
      id: Ot($.id),
      text: he(e, $.id),
      name: $.label,
      xPos: q + 8,
      yPos: N + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: i
    }), D && m.push({ options: {
      id: ln($.id),
      name: D.alt,
      text: "",
      xPos: q + 8,
      yPos: N + h,
      width: t,
      height: Nt,
      shapeHint: "rectangle",
      image: D.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((U) => U.laneId === $.id).forEach((U, ze) => {
      const ne = e.kind === "release-plan" ? U.label + `
` + U.points + " points" : U.label, X = g ? t - 20 : t, ae = g ? l - 6 : l, se = g ? {} : { ...v.card, ...U.look }, Fe = g ? L : v.card?.cornerRadius ?? L;
      x({
        id: ge(U.id),
        text: ne,
        name: U.label,
        xPos: q + (g ? 18 : 8),
        yPos: N + h + (D ? Nn : 0) + ze * r,
        width: X,
        height: ae,
        ...Fe !== L ? { vectorPath: Tn(X, ae, Fe) } : {},
        backgroundColor: g ? "#ffda75" : se.backgroundColor ?? v.backgroundColor ?? _e.backgroundColor,
        ...se.textColor ? { foregroundColor: se.textColor } : {},
        ...se.fontFamily ? { fontFamily: se.fontFamily } : {},
        ...se.borderColor ? { borderColor: se.borderColor } : {},
        ...se.borderWidth !== void 0 ? { borderWidth: se.borderWidth } : {},
        fontSize: ht(ne, se.fontSize ?? M, X - 16, ae - 8)
      });
    });
  });
  const C = new Map(m.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (C.get(We($.id)).relationships.associations = $.station.next.map((O) => ({
      id: $.id + "-to-" + O,
      parentId: We($.id),
      childId: We(O),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const O of $.dependsOn ?? []) {
        const W = ge(O), q = ge($.id);
        C.get(W).relationships.associations.push({
          id: `dependency-${O.length}-${O}-${$.id}`,
          parentId: W,
          childId: q,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const $ = new Set(n.beside), O = new Set(m.map((N) => N.options.id)), W = /* @__PURE__ */ new Map();
    for (const N of [...O]) {
      if (!$.has(N)) continue;
      const D = Et(N, (U) => $.has(U) || O.has(U));
      O.add(D), W.set(N, D);
    }
    const q = (N) => W.get(N) ?? N;
    for (const N of m) {
      N.options.id = q(N.options.id);
      for (const D of N.relationships.associations)
        D.parentId = q(D.parentId), D.childId = q(D.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: m };
}
function pt(e, n) {
  const o = J(e);
  if (n?.native) return Ro(o, n);
  const { width: t, row: r, height: l, top: h } = cn, w = [];
  function g(y, L, M, K, i, m) {
    w.push({ options: {
      id: y,
      text: L,
      name: L,
      xPos: M,
      yPos: K,
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
  const { points: b } = Pt(o), v = 152, A = v + 12, S = o.lanes.some((y) => y.station?.image);
  o.lanes.forEach((y, L) => {
    const M = b[L].x, K = b[L].y + (S ? (y.station?.row ?? 0) * A : 0), i = y.station?.image, m = o.kind === "release-plan" ? y.label + `
` + (y.capacity ? be(o, y.id) + " / " + y.capacity + " points" : be(o, y.id) + " points") : y.label;
    g(Se(y.id), m, M, K, h - 12, en[L]), i && w.push({ options: {
      id: ln(y.id),
      name: i.alt,
      text: "",
      xPos: M,
      yPos: K + h,
      width: t,
      height: v,
      shapeHint: "rectangle",
      image: i.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((x) => x.laneId === y.id).forEach((x, C) => g(ge(x.id), o.kind === "release-plan" ? x.label + `
` + x.points + " points" : x.label, M, K + h + (i ? A : 0) + C * r, l, "#fffdf6"));
  });
  for (const y of o.lanes) {
    if (!y.station) continue;
    const L = w.find((M) => M.options.id === Se(y.id));
    L.relationships.associations = y.station.next.map((M) => ({ id: y.id + "-to-" + M, parentId: L.options.id, childId: Se(M), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), L.options.text = y.label + `
` + y.station.outcome, L.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const y = new Map(w.map((L) => [L.options.id, L]));
    for (const L of o.cards)
      for (const M of L.dependsOn ?? []) {
        const K = ge(M), i = ge(L.id);
        y.get(K).relationships.associations.push({
          id: `dependency-${M.length}-${M}-${L.id}`,
          parentId: K,
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
const lr = {
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
], Fn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function dr() {
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
function cr() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Fn.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Le(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Fn.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => _n.some((r) => r.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Mo(e, n, o) {
  const t = Le(e), r = e.cards.find((h) => h.id === n);
  if (!t || !r || r.laneId === o) return null;
  let l = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const h = e.cards.find((w) => w.laneId === o);
    if (h) {
      if (!rn(e, h).some((w) => w.id === "interviews")) return null;
      l = En(e, h.id, "interviews");
    }
  }
  return rn(l, r).some((h) => h.id === o) ? En(l, n, o) : null;
}
function Wo(e, n) {
  if (Le(e) !== "experiment-budget") return null;
  const o = Fn.find((l) => l.id === n), t = e.cards.filter((l) => l.laneId === n).length, r = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? r + " " + (r === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  _e as DEFAULT_NOTE_STYLE,
  Ze as WorkshopReferenceError,
  ft as addWorkshopBranch,
  Eo as addWorkshopCard,
  Oo as addWorkshopLane,
  so as applyWorkshopEdits,
  nr as attachWorkshop,
  rn as availableLanes,
  Yt as canHangPanel,
  Fn as channels,
  lo as checkWorkshopReplacement,
  Vt as countWord,
  cr as createBudgetWorkshop,
  dr as createInterviewWorkshop,
  ir as createLaneWorkshop,
  sr as createWorkshopMap,
  rr as decodeWorkshopFragment,
  Qo as describeFocusDarkroom,
  er as describeWorkshopEdits,
  or as encodeWorkshopFragment,
  Bo as handoffSummary,
  Yo as hangGalleryPanel,
  lr as industrialWorkshop,
  Vo as initialFocusDarkroom,
  _n as interviews,
  en as laneColors,
  ke as listed,
  qe as listeningRoom,
  Go as listeningRoomCaption,
  At as maxWorkshopCards,
  $e as maxWorkshopLines,
  Ko as moonGallery,
  En as moveWorkshopCard,
  Xo as named,
  ar as nightTransfer,
  Zo as normalizeFocusDarkroom,
  Uo as normalizeListeningRoom,
  Jo as normalizeMoonGallery,
  jo as normalizeOfflineHandoff,
  Fo as offlineHandoff,
  Mo as planStartupMove,
  Qt as pointing,
  mt as printFields,
  be as releaseLoad,
  qo as releasePlan,
  Ho as resolveHandoff,
  Ao as resolveWorkshopSignals,
  Do as reviewHandoff,
  P as said,
  Le as startupExperienceKind,
  Rn as unquoted,
  J as validateWorkshop,
  nn as workshopBoardKind,
  Wo as workshopBudgetResult,
  Te as workshopCandidate,
  lt as workshopCardAsNote,
  Qe as workshopCardAsNoteRefusal,
  kt as workshopCardLabelOf,
  Po as workshopCardLines,
  vt as workshopCardLookOf,
  at as workshopDestinations,
  Wn as workshopEditKinds,
  $n as workshopFinder,
  st as workshopKeepsLink,
  Ln as workshopKeepsPicture,
  he as workshopLaneCaption,
  fe as workshopLanePlaces,
  cn as workshopLayout,
  sn as workshopLineRefusal,
  dt as workshopLinesOf,
  $t as workshopNewLine,
  ie as workshopNodeIds,
  Re as workshopNoteCandidate,
  Ce as workshopNoteRefusal,
  Pt as workshopPositions,
  zn as workshopPresentationLanes,
  tr as workshopPresentationScenes,
  oo as workshopReferences,
  Ve as workshopRefusal,
  Ae as workshopRenamedLines,
  Et as workshopStandInId,
  Me as workshopTakesNotes,
  pt as workshopToSlate,
  Xe as workshopWithLine,
  Lo as workshopWithoutCardLines,
  ct as workshopWithoutLine
};
