import { D as vn } from "./NoteDefaults-BjVBa8YH.mjs";
const Da = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Fa(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: d, fallback: u } = e, h = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !h(i) || !h(d) || !h(u) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: d.trim(), fallback: u.trim() };
}
function za(e) {
  return { ...e, stage: "review", choice: null };
}
function Ba(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Ha(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const ht = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Ga(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, d = (u) => typeof u == "string" && u.trim().length > 0 && u.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(u);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !d(o) || !d(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function Ua({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === ht.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === ht.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === ht.leftLabel && t === ht.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
const Ln = {
  red: "#f4b6b6",
  orange: "#f9cf9f",
  yellow: "#fbe79b",
  green: "#bfe3b4",
  blue: "#b9d4f1",
  purple: "#d7c3ee",
  pink: "#f6c1dc",
  teal: "#b2e0dc",
  brown: "#dcc3a8",
  gray: "#e0e0e0"
}, At = { "q-do-now": "Do now", "q-plan": "Plan it", "q-later": "Later", "q-skip": "Skip" }, os = { borders: ["subtle", "strong"], headers: ["subtle", "strong"], headerSize: ["large"], fill: ["soft", "strong"], density: ["compact"] };
function rs(e, n) {
  if (e == null) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A board’s appearance is an object.");
  const t = e, r = {};
  for (const [o, i] of Object.entries(os))
    if (t[o] !== void 0) {
      if (!i.includes(t[o])) throw new Error(`A board’s ${o} is ${i.join(" or ")}.`);
      r[o] = t[o];
    }
  if (t.lines !== void 0 && typeof t.lines != "boolean") throw new Error("A board’s lines are on or off.");
  if (t.lines && (r.lines = !0), t.colors !== void 0) {
    if (!t.colors || typeof t.colors != "object" || Array.isArray(t.colors)) throw new Error("A board’s colors are by column.");
    const o = {};
    for (const [i, d] of Object.entries(t.colors))
      if (n.includes(i)) {
        if (typeof d != "string" || !Ln[d]) throw new Error("Use a color such as " + Object.keys(Ln).slice(0, 4).join(", ") + ".");
        o[i] = d;
      }
    Object.keys(o).length && (r.colors = o);
  }
  return Object.keys(r).length ? r : void 0;
}
function is(e) {
  return [...e.lanes.map((n) => n.id), ...e.kind === "nest" && e.nest?.layout === "matrix" ? Object.keys(At) : []];
}
const ss = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e);
function Ke(e, n) {
  if (!ss(e)) return e;
  const t = n > 0 ? 255 : 0, r = Math.abs(n), o = (i) => Math.round(parseInt(e.slice(i, i + 2), 16) * (1 - r) + t * r).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function as(e, n, t) {
  const r = e && /^(column|lane|caption|card)-(.+)$/.exec(n);
  if (!r) return t;
  const o = e, [, i, d] = r, u = { ...t }, h = o.colors?.[d] && Ln[o.colors[d]];
  return i === "column" ? (h ? (u.fill = Ke(h, o.fill === "soft" ? 0.75 : o.fill === "strong" ? 0.3 : 0.55), u.line = Ke(h, -0.25)) : o.fill && (u.fill = Ke(u.fill, o.fill === "soft" ? 0.5 : -0.1)), o.borders === "strong" && (u.lineWidth = 3, u.line = Ke(u.line ?? u.fill, -0.45)), o.borders === "subtle" && (u.lineWidth = 1, u.line = Ke(u.line, 0.6)), o.lines && (u.lineWidth = Math.max(2, u.lineWidth ?? 1), u.line = "#4b5a55")) : i === "lane" || i === "caption" && /^q-|^axis-/.test(d) ? (h && i === "lane" && (u.fill = h), o.headers === "strong" && (u.weight = "bold", i === "lane" && (u.fill = Ke(u.fill, -0.12), u.lineWidth = 2, u.line = Ke(u.fill, -0.4))), o.headers === "subtle" && i === "lane" && (u.fill = Ke(u.fill, 0.5), u.lineWidth = 0), o.headerSize && u.fontSize && (u.fontSize = Math.min(36, Math.round(u.fontSize * 1.3)))) : i === "card" && o.density && u.height && (u.height = Math.max(28, Math.round(u.height * 0.72)), u.fontSize && (u.fontSize = Math.max(11, u.fontSize - 2))), u;
}
const fr = {
  borders: { strong: "stronger column borders", subtle: "lighter column borders", normal: "standard column borders" },
  headers: { strong: "bolder headers", subtle: "quieter headers", normal: "standard headers" },
  headerSize: { large: "bigger headers", normal: "standard-size headers" },
  fill: { strong: "deeper column colors", soft: "a softer background", normal: "standard column colors" },
  lines: { true: "grid lines", false: "no grid lines" },
  density: { compact: "compact cards", normal: "roomy cards" }
};
function ls(e, n, t) {
  const r = { ...e.appearance, colors: { ...e.appearance?.colors } }, o = { ...n };
  n.emphasis && (o.borders ?? (o.borders = n.emphasis), o.headers ?? (o.headers = n.emphasis), o.fill ?? (o.fill = n.emphasis === "subtle" ? "soft" : n.emphasis));
  const i = [];
  for (const k of Object.keys(fr)) {
    const L = o[k];
    L !== void 0 && (i.push(fr[k][String(L)]), L === "normal" || L === !1 ? delete r[k] : r[k] = L);
  }
  const d = r.colors;
  n.color !== void 0 && t && (n.color === "none" ? (delete d[t.key], i.push(t.label + " in its own color")) : (d[t.key] = n.color, i.push(t.label + " in " + n.color))), Object.keys(d).length || delete r.colors;
  const u = JSON.stringify(e.appearance ?? {}), h = Object.keys(r).length ? r : void 0, C = JSON.stringify(h ?? {}) !== u, b = { ...e, appearance: h };
  h || delete b.appearance;
  const v = i.length < 2 ? i.join("") : i.slice(0, -1).join(", ") + " and " + i.at(-1);
  return { board: b, changed: C, said: C ? "The board now has " + v + "." : "The board already has " + v + "." };
}
function qa(e, n) {
  const t = e.appearance ?? {}, r = n.appearance ?? {}, o = {};
  for (const d of ["borders", "headers", "headerSize", "fill", "density"]) t[d] !== r[d] && (o[d] = r[d] ?? "normal");
  !!t.lines != !!r.lines && (o.lines = !!r.lines);
  const i = Object.keys(o).length ? [{ kind: "set_appearance", ...o }] : [];
  for (const d of /* @__PURE__ */ new Set([...Object.keys(t.colors ?? {}), ...Object.keys(r.colors ?? {})]))
    t.colors?.[d] !== r.colors?.[d] && i.push({ kind: "set_appearance", lane: { id: d }, color: r.colors?.[d] ?? "none" });
  return i;
}
function Ka(e, n) {
  const t = e.appearance ?? {}, r = t.borders === "strong" && t.headers === "strong", o = (d, u, h, C, b) => ({ id: "look:" + d, label: u, on: h, said: C + ". " + u + " now.", edit: { kind: "set_appearance", ...b } }), i = Object.keys(Ln);
  return {
    rail: [
      o("emphasis", r ? "Look: strong" : "Look: standard", r, r ? "Standard columns" : "Stronger columns", { emphasis: r ? "normal" : "strong" }),
      o("density", t.density ? "Cards: compact" : "Cards: roomy", !!t.density, t.density ? "Roomy cards" : "Compact cards", { density: t.density ? "normal" : "compact" }),
      o("lines", t.lines ? "Lines: on" : "Lines: off", !!t.lines, t.lines ? "No grid lines" : "Grid lines", { lines: !t.lines })
    ],
    swatches: n.flatMap((d) => {
      const u = e.lanes.find((b) => b.id === d)?.label ?? At[d], h = t.colors?.[d], C = i[i.indexOf(h) + 1];
      return u && (e.nest?.layout !== "matrix" || At[d]) ? [{
        key: d,
        now: h ?? null,
        swatch: h ? Ln[h] : "#ffffff",
        sentence: u + ": " + (h ?? "own color"),
        said: u + " in " + (C ?? "its own color") + ". Now " + (h ?? "its own color") + ".",
        edit: { kind: "set_appearance", lane: { id: d }, color: C ?? "none" }
      }] : [];
    })
  };
}
function un(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function ds(e) {
  const n = new Map(e.cards.map((d) => [d.id, d])), t = new Map(e.lanes.map((d, u) => [d.id, u])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function i(d) {
    if (!r.has(d.id)) {
      if (o.has(d.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(d.id);
      for (const u of d.dependsOn ?? []) {
        const h = n.get(u);
        if (!h) throw new Error("A release dependency refers to an unknown feature.");
        if (t.get(h.laneId) > t.get(d.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(h);
      }
      o.delete(d.id), r.add(d.id);
    }
  }
  for (const d of e.cards) i(d);
  for (const d of e.lanes) {
    if (d.station) throw new Error("Release windows cannot also be map stations.");
    if (un(e, d.id) > (d.capacity ?? 1 / 0)) throw new Error(`Release "${d.label}" exceeds its point budget.`);
  }
}
function Qn(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((v, k) => [v.id, k])), o = r.get(t);
  if (o === void 0) return null;
  const i = o < r.get(n.laneId), d = /* @__PURE__ */ new Set([n.id]), u = [n];
  for (; u.length; ) {
    const v = u.pop();
    for (const k of e.cards) {
      if (d.has(k.id)) continue;
      const L = r.get(k.laneId);
      (i ? L > o && v.dependsOn?.includes(k.id) : L < o && k.dependsOn?.includes(v.id)) && (d.add(k.id), u.push(k));
    }
  }
  if (e.cards.filter((v) => d.has(v.id)).some((v) => v.allowedLaneIds && !v.allowedLaneIds.includes(t))) return null;
  const C = { ...e, cards: e.cards.map((v) => d.has(v.id) ? { ...v, laneId: t } : v) }, b = e.lanes[o].capacity;
  return b !== void 0 && un(C, t) > b ? null : C;
}
const Ja = {
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
}, Pt = /* @__PURE__ */ new Map(), cs = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function Ya(e) {
  Pt.set(e.kind, e);
}
function Za(e) {
  return typeof e == "string" && Pt.has(e);
}
function fn(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? Pt.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function Ae(e) {
  const n = Pt.get(e);
  if (!n) throw new Error(`The ${cs[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let St = null;
function Va(e) {
  St = e;
}
function us() {
  return St !== null;
}
function be() {
  if (!St) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return St;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", dn = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], hr = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Oo = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), $o = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Xa = (e) => Oo($o(e)), fs = [
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
], hs = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : fs.indexOf(e.toLowerCase()), ps = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Fr(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = Oo(o);
    i && t.add(i);
  };
  r(e), r($o(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const Qt = "[^\\p{L}\\p{N}]", pr = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + hr(n) + "(?:$|" + Qt + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Qt + ")" + hr(n) + "(?:$|" + Qt + ")", "u").test(e)
], mr = ["first", "second", "third", "fourth", "fifth"];
function ms(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + mr.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Oo($o(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? mr.indexOf(o) : hs(o) - 1;
  return e[i] ?? null;
}
function eo(e, n, t, r, o) {
  const i = Fr(n, t);
  if (i.some((u) => ps.test(u))) {
    const u = r && e.find((h) => h.id === r);
    return u ? { item: u, rank: 0 } : { pointing: !0 };
  }
  for (const u of i) {
    if (!u.startsWith("@")) continue;
    const h = e.find((C) => C.id === u.slice(1));
    if (h) return { item: h, rank: 0 };
  }
  for (const [u, h] of pr.entries())
    for (const C of i) {
      const b = e.filter((v) => h(v.label.toLowerCase(), C.toLowerCase()));
      if (b.length === 1) return { item: b[0], rank: u };
      if (b.length > 1) return { several: b };
    }
  const d = o ? ms(e, n, t) : null;
  return d ? { item: d, rank: pr.length } : {};
}
class bt extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function co(e, n, t, r, o = !1) {
  return { find: (h) => {
    const C = eo(e, h, n, r, o);
    if (C.item) return C.item;
    const b = Fr(h, n), v = b[b.length - 1];
    if (C.pointing) throw new bt("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const L = [...new Set(C.several.map((x) => x.label))];
      throw new bt(L.length === 1 ? C.several.length + " " + t + "s are called " + P(L[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + P(v) + ": " + dn(L.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", C.several.map((x) => x.id));
    }
    const k = e.map((L) => L.label);
    throw new bt("There is no " + t + " called " + P(v) + " here." + (k.length && k.length <= 6 ? " The " + t + "s are " + dn(k.map(P)) + "." : k.length ? "" : " There are no " + t + "s yet."), "unknown", e.map((L) => L.id));
  }, attempt: (h) => eo(e, h, n, r, o).item ?? null, rank: (h) => eo(e, h, n, r, o).rank ?? 1 / 0 };
}
const zr = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], _e = [...zr], kn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Br = zr.slice(5);
function Ct(e) {
  if (e.lanes[0]?.station) return "map";
  const n = oe(e);
  return n || (e.kind === "release-plan" ? "release-plan" : hn(e) ?? "lanes");
}
const G = {
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
}, uo = {
  "launch-plan": G.launchLanes,
  pipeline: G.pipelineLanes,
  budget: G.budgetLanes,
  "hiring-plan": G.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, ue = (e, n) => Object.fromEntries(_e.filter((t) => !e.includes(t)).map((t) => [t, n])), ce = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), te = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ie = (e) => ({ type: "ref", of: "card", about: e }), no = (e) => ({ map: e }), je = ue(["map"], G.notMap), Me = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), fo = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ce(120, "The new name, 1 to 120 characters of plain text.") },
    boards: _e,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: te("The lane or step."), label: ce(80, "The new name, 1 to 80 characters of plain text.") },
    boards: _e,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ie("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: _e,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ce(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": G.releaseLanes, "customer-interviews": G.keepsLanes, "experiment-budget": G.keepsLanes, map: G.mapAddLane, ...uo }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: te("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": G.releaseLanes, "customer-interviews": G.keepsLanes, "experiment-budget": G.keepsLanes, ...uo }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: te("The lane or step it starts in."),
      label: ce(80, "What the card says. Left out, the card takes the board’s name for a new item: “New card”, “New hire”, “New task”, “New deal” (on a map, a token is numbered; a free card is “New stop”).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Me("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Me("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Me("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...Br],
    refusals: { "release-plan": G.releaseCards, "customer-interviews": G.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ie("The card or token.") },
    boards: _e,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: {
      card: ie("The card or token."),
      lane: te("Where it goes."),
      override: { type: "flag", optional: !0, about: "True to move it anyway when a rule refuses it, once the person agreed to break that rule (every board but release plans and startup experiences). The card shows who moved it anyway and when." }
    },
    boards: _e,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ie("The token.") },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: te("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: _e.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": G.launchLanes, budget: G.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ie("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: kn,
    refusals: { ...no(G.mapCardLanes), ...ue([...kn, "map"], G.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ie("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...ue(["release-plan"], G.notPoints), map: G.mapPoints }
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
    refusals: { ...ue(["release-plan"], G.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ie("The card."),
      lane: te("The lane."),
      whenPresent: ce(160, "What it says when the card is there."),
      whenAbsent: ce(160, "What it says otherwise."),
      label: ce(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: kn,
    refusals: { ...no(G.mapOutcome), ...ue([...kn, "map"], G.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ie("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: kn,
    refusals: { ...no(G.mapOutcome), ...ue([...kn, "map"], G.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: _e,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: te("The lane or step."), before: te("Present it just before this one.", !0), after: te("Present it just after this one.", !0) },
    boards: _e,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: te("The step it follows."), label: ce(80, "The new step’s name."), outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: te("The step it goes in front of."),
      from: te("Only the path from this step is taken over.", !0),
      label: ce(80, "The new step’s name."),
      outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: te("Where the path starts."), to: te("Where it leads.") },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: te("Where the path starts."), to: te("Where it leads.") },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: te("The step."), outcome: ce(160, "What it says.") },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: te("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: te("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: te("The step."), alt: ce(240, "What the picture shows.") },
    boards: ["map"],
    refusals: je
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: ie("The card the line starts at."), to: ie("The card it points to."), label: ce(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: pt()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: ie("One card."), to: ie("The other card.") },
    boards: ["lanes"],
    refusals: pt()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: ie("The card."),
      note: ce(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: ce(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: pt()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: ie("The card."), note: ce(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: pt()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: {
      card: ie("The task."),
      duration: Me("Its days, 1 to 60.", 60, 1, !0),
      lag: Me("Days it waits after what it waits on ends, 0 or more (below 0, with override: it starts before what it waits on ends).", 120, -120, !0),
      override: { type: "flag", optional: !0, about: "True to set it anyway when a rule refuses it (a lock, a freeze, an overlap, the line, what it waits on), once the person agreed to break that rule. The task shows who moved it anyway and when." }
    },
    boards: ["launch-plan"],
    refusals: ue(["launch-plan"], G.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ie("The task that waits."), waitsOn: ie("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ue(["launch-plan"], G.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ie("The task that waits."), waitsOn: ie("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: ue(["launch-plan"], G.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: Me("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: ue(["launch-plan"], G.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ie("The deal or line item."), amount: Me("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: ue(["pipeline", "budget"], G.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Me("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: ue(["pipeline"], G.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: te("The team giving."), to: te("The team receiving."), amount: Me("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: ue(["budget"], G.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: Me("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: ue(["budget"], G.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: ue(["lanes", "pipeline"], G.noRules)
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
    refusals: ue(["lanes", "pipeline"], G.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: ce(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: ue(["lanes", "pipeline"], G.noRules) },
  {
    kind: "set_appearance",
    summary: "Change how the board looks, on every kind of board; it moves nothing. Give one or more of the looks, or a lane with a color.",
    intent: !0,
    fields: {
      emphasis: sn(["subtle", "normal", "strong"], "Borders, headers and fills together."),
      borders: sn(["subtle", "normal", "strong"], "The columns’ outlines."),
      headers: sn(["subtle", "normal", "strong"], "Column headers: strong is bold with a deeper fill."),
      headerSize: sn(["normal", "large"], "Header text size."),
      fill: sn(["soft", "normal", "strong"], "The columns’ fills: soft is a softer background."),
      lines: { type: "flag", optional: !0, about: "Grid lines between the columns (a 2 by 2’s quadrant lines)." },
      density: sn(["normal", "compact"], "Card size."),
      lane: te("With color: the lane (on a 2 by 2, also a quadrant by name).", !0),
      color: sn([...Object.keys(Ln), "none"], "With lane: its color, or none for its own.")
    },
    boards: _e,
    refusals: {}
  }
];
function sn(e, n) {
  return { type: "choice", values: e, optional: !0, about: n };
}
function pt() {
  return { ...ue(["lanes"], G.businessLines), "release-plan": G.lines, "customer-interviews": G.lines, "experiment-budget": G.lines, map: G.lines };
}
const ws = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", wr = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, gs = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function ys(e, n) {
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
      return { ...r({ type: "integer", minimum: e.min, maximum: gs(e.max, n) }, e.nullable), description: e.about };
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
        kind: { enum: wr.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...wr.keys
      }, description: e.about };
  }
}
const Hr = (e) => "optional" in e && e.optional === !0;
function Qa(e) {
  const n = e ? Ct(Q(e)) : void 0;
  return fo.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, d]) => !Hr(d)).map(([d]) => d)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([d, u]) => [d, ys(u, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const mt = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function ks(e, n) {
  const t = !!e.lanes[0]?.station, r = co(e.lanes, t ? mt.step : mt.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = co(e.cards, t ? mt.token : mt.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const i = e.cards.filter((u) => !u.free), d = (u) => i.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(u.trim()) ? i[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(u.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (u) => d(u) ?? o.find(u),
    attempt: (u) => d(u) ?? o.attempt(u),
    rank: (u) => d(u) ? 0 : o.rank(u)
  } };
}
class B {
  constructor(n, t, r = null, o, i, d) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = i, this.limits = d;
  }
}
function Lt(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function V(e, n, t = null, r) {
  try {
    return Q(e);
  } catch (o) {
    throw new B(Lt(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function bs(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (Hr(o)) continue;
      return n.kind + " needs " + r + ".";
    }
    const d = n.kind + " needs " + r + " as ";
    switch (o.type) {
      case "text":
        if (typeof i != "string") return d + "text.";
        break;
      case "ref":
        if (!t(i)) return d + "an id or a name.";
        break;
      case "refs":
        if (i === null && o.nullable) break;
        if (!Array.isArray(i) || i.length > o.max || !i.every(t)) return d + "a list of up to " + o.max + " ids or names" + (o.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (i === null && o.nullable) break;
        if (typeof i != "number" || !Number.isFinite(i)) return d + "a number" + (o.nullable ? " or null." : ".");
        break;
      case "image":
        if (i === null) break;
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((u) => u !== "src" && u !== "alt")) return d + "{src, alt} or null.";
        break;
      case "choice":
        if (!o.values.includes(i)) return d + o.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof i != "boolean") return d + "true or false.";
        break;
      case "rule":
        if (!i || typeof i != "object" || Array.isArray(i) || typeof i.kind != "string") return d + "an object with a kind.";
        break;
    }
  }
  return null;
}
function vs(e, n, t, r, o) {
  const i = structuredClone(e), d = t === "map", u = t === "release-plan", h = ks(i, r), C = { lane: d ? "step" : "lane", card: d ? "token" : "card" };
  function b(l, I, S, A, $ = null) {
    if (typeof S == "object") {
      const j = l.find((F) => F.id === S.id);
      if (!j) throw new B("That " + A + " is no longer on the workshop.", "gone", $);
      return j;
    }
    const _ = l.find((j) => j.id === S);
    if (_) return _;
    try {
      return I.find(S);
    } catch (j) {
      if (!(j instanceof bt)) throw j;
      const F = j.reason === "ambiguous" ? "ambiguous_reference" : j.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new B(j.message, F, $, void 0, j.candidates.length ? j.candidates : void 0);
    }
  }
  const v = (l, I = null) => b(i.lanes, h.lanes, l, "lane", I), k = (l, I = null) => b(i.cards, h.cards, l, "card", I), L = (l) => {
    try {
      return v(l);
    } catch {
      return null;
    }
  }, x = (l, I, S = {}, A = !0) => ({ board: l, said: I, changed: A, ...S }), O = (l) => Xe(i, l), D = (l) => d ? "The presentation opens with " + P(l[0].label) + "." : "The presentation now runs " + l.map((I) => P(I.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return be().edit(i, n, o, {
      lane: (l) => v(l),
      card: (l) => k(l),
      done: (l, I, S) => x(l, I, S),
      refuse: (l, I = {}) => {
        throw new B(l, I.code ?? "refused", I.laneId ?? null, I.cardId);
      }
    });
  if (n.kind === "set_appearance") {
    const { kind: l, lane: I, ...S } = n;
    if (!Object.keys(S).length) throw new B("Say how the board should look: stronger borders, bolder headers, grid lines, compact cards or a column’s color.", "invalid_edit");
    if (S.color === void 0 != (I === void 0)) throw new B("A color is for one column: name the column and the color.", "invalid_edit");
    let A;
    if (I !== void 0) {
      const _ = typeof I == "string" ? I.trim().toLowerCase().replace(/^the\s+|\s+(?:quadrant|square|column|lane)$/g, "") : "", j = i.kind === "nest" && i.nest?.layout === "matrix" ? Object.entries(At).find(([M, U]) => (typeof I == "object" ? I.id : _) === M || _ === M.slice(2) || _ === U.toLowerCase()) : void 0, F = j ? null : v(I);
      A = j ? { key: j[0], label: j[1] } : { key: F.id, label: F.label };
    }
    const $ = ls(i, S, A);
    return x($.board, $.said, A && !A.key.startsWith("q-") ? { laneId: A.key } : {}, $.changed);
  }
  if (Br.includes(t)) {
    n.kind === "add_card" && gr(n, t, v(n.lane).id);
    const l = {
      card: (S) => k(S),
      lane: (S) => v(S),
      refuse: (S, A = {}) => {
        throw new B(S, A.code ?? "refused", A.laneId ?? null, A.cardId, void 0, A.limits);
      },
      settle: (S, A = null, $) => V(S, t, A, $),
      done: (S, A, $) => x(S, A, $),
      who: { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() }
    }, I = Ae(t).edit(i, n, l);
    if (I) return I;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const l = V(i, t);
      return x(l, "Renamed the " + (d ? "map" : "workshop") + " to " + P(l.title) + ".");
    }
    case "rename_lane": {
      const l = v(n.lane), I = l.label;
      l.label = n.label;
      const S = V(i, t, l.id);
      return x(S, "Renamed " + P(I) + " to " + P(S.lanes.find((A) => A.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = k(n.card), I = l.label;
      l.label = n.label;
      const S = V(i, t, l.laneId, l.id);
      return x(S, "Renamed " + P(I) + " to " + P(S.cards.find((A) => A.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new B("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new B("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = Oa(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (S) {
        throw new B(Lt(S.message, t), "refused");
      }
      const I = l.lanes[l.lanes.length - 1];
      return x(l, "Added the lane " + P(I.label) + ".", { laneId: I.id });
    }
    case "remove_lane": {
      const l = v(n.lane), I = i.cards.filter((S) => S.laneId === l.id);
      if (d) {
        if (I.length) throw new B(P(I[0].label) + " is at " + P(l.label) + ". Move it to another step first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new B("A map needs at least two steps.", "refused", l.id);
      } else {
        if (I.length) throw new B(P(l.label) + " holds " + I.length + (I.length === 1 ? " card" : " cards") + ". Move or remove " + (I.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new B("A workshop needs at least two columns.", "refused", l.id);
      }
      i.lanes = i.lanes.filter((S) => S !== l);
      for (const S of i.lanes) S.station && (S.station.next = S.station.next.filter((A) => A !== l.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((S) => S !== l.id));
      for (const S of i.cards) S.allowedLaneIds && (S.allowedLaneIds = S.allowedLaneIds.filter((A) => A !== l.id));
      return wt(i, (S) => S.laneId === l.id), i.behaviour && (i.behaviour = be().dropLane(i.behaviour, l.id)), x(V(i, t), "Removed the " + C.lane + " " + P(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = v(n.lane);
      if (d) {
        if (n.allowedLanes !== void 0) throw new B(G.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new B("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const M = et(i, "card");
          i.cards.push({ id: M, label: _t(n.label?.trim() || fn(i)), laneId: l.id, free: !0 });
          const U = V(i, t, l.id);
          return x(U, "Added " + P(U.cards.find((ve) => ve.id === M).label) + " to " + P(l.label) + ".", { laneId: l.id, cardId: M });
        }
        let $ = n.label;
        if ($ === void 0) {
          let M = i.cards.length + 1;
          for (; i.cards.some((U) => U.label === "Token " + M); ) M++;
          $ = "Token " + M;
        }
        const _ = new Set([...i.lanes, ...i.cards].map((M) => M.id));
        let j = 1;
        for (; _.has("token-" + j); ) j++;
        i.cards.push({ id: "token-" + j, label: $, laneId: l.id });
        const F = V(i, t, l.id);
        return x(F, "Added " + P(F.cards[F.cards.length - 1].label) + " at " + P(l.label) + ".", { laneId: l.id, cardId: "token-" + j });
      }
      if (gr(n, t, l.id), i.cards.length >= 24) throw new B("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && O(l.id) >= l.capacity)
        throw new B(P(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", l.id);
      const I = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => v($).id))];
      let S;
      try {
        S = $a(i, l.id, { label: n.label?.trim() || fn(i), ...I && { allowedLaneIds: I } });
      } catch ($) {
        throw new B(Lt($.message, t), "refused", l.id);
      }
      const A = S.cards[S.cards.length - 1];
      return x(S, "Added " + (A.label ? P(A.label) : "an empty card") + " to " + P(l.label) + ".", { laneId: l.id, cardId: A.id });
    }
    case "remove_card": {
      const l = k(n.card);
      if (d && !l.free && i.cards.filter((I) => !I.free).length === 1) throw new B("A map needs at least one token.", "refused", l.laneId, l.id);
      if (u && i.cards.length === 1) throw new B("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new B("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      i.cards = i.cards.filter((I) => I !== l);
      for (const I of i.cards)
        I.dependsOn?.includes(l.id) && (I.dependsOn = I.dependsOn.filter((S) => S !== l.id), I.dependsOn.length || delete I.dependsOn);
      return wt(i, (I) => I.cardId === l.id), x(V(Ca(i, l.id), t, l.laneId), "Removed the " + C.card + " " + P(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? i.lanes.find((A) => A.id === n.lane.id) ?? null : L(n.lane), I = k(n.card, l?.id ?? null), S = v(n.lane, I.laneId);
      return J(I, S, n.override === !0);
    }
    case "advance_card": {
      const l = k(n.card), I = i.lanes.find((A) => A.id === l.laneId), S = I.station.next.map((A) => i.lanes.find(($) => $.id === A)).filter((A) => !!A);
      if (!S.length) throw new B(P(l.label) + " is at " + P(I.label) + ", and no path leads on from there.", "refused", I.id, l.id);
      if (S.length > 1)
        throw new B("From " + P(I.label) + " the path goes to " + S.map((A) => P(A.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + S[0].label + "”.", "refused", I.id, l.id);
      return J(l, S[0]);
    }
    case "set_lane_capacity": {
      const l = v(n.lane), I = i.behaviour && be().setLimit(i, l.id, n.capacity, o);
      if (typeof I == "string") throw new B(I, "refused", l.id);
      if (I) return x(I, P(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const S = d ? "token" : u ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, x(V(i, t, l.id), d ? "Removed the limit at " + P(l.label) + "." : P(l.label) + " now holds any number of " + S + "s.", { laneId: l.id });
      const A = u ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > A)
        throw new B((d ? "A step" : "A lane") + " can hold from 1 to " + A + " " + S + "s.", "refused", l.id);
      const $ = u ? i.cards.reduce((_, j) => _ + (j.laneId === l.id ? j.points ?? 1 : 0), 0) : O(l.id);
      if ($ > n.capacity)
        throw new B(P(l.label) + " already holds " + $ + " " + S + ($ === 1 ? "" : "s") + ". Move some " + (d ? "on" : "out") + " first, or choose a higher " + (u ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, x(V(i, t, l.id), P(l.label) + " now holds up to " + n.capacity + " " + S + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = k(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, x(V(i, t, l.laneId, l.id), P(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const I = [...new Set(n.lanes.map((A) => v(A)))], S = i.lanes.find((A) => A.id === l.laneId);
      if (!I.includes(S)) throw new B(P(l.label) + " is in " + P(S.label) + " now. Include " + P(S.label) + ", or move the card first.", "refused", S.id, l.id);
      return l.allowedLaneIds = I.map((A) => A.id), x(V(i, t, l.laneId, l.id), P(l.label) + " can now go only in " + dn(I.map((A) => P(A.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new B("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, x(V(i, t, l.laneId, l.id), P(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = k(n.card), I = [...new Set(n.dependsOn.map((A) => k(A)))], S = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const A = I.filter(($) => l.dependsOn?.includes($.id));
        if (!A.length) throw new B(P(l.label) + " does not depend on " + dn(I.map(($) => P($.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter(($) => !A.some((_) => _.id === $)), l.dependsOn.length || delete l.dependsOn, x(V(i, t, l.laneId, l.id), P(l.label) + " no longer depends on " + dn(A.map(($) => P($.label))) + ".", S);
      }
      if (!I.length) {
        if (n.mode === "add") throw new B("Name the features " + P(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, x(V(i, t, l.laneId, l.id), P(l.label) + " no longer depends on anything.", S);
      }
      if (I.includes(l)) throw new B("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...I.map((A) => A.id)])], x(V(i, t, l.laneId, l.id), P(l.label) + " now depends on " + dn(I.map((A) => P(A.label))) + ".", S);
    }
    case "set_outcome": {
      const l = k(n.card), I = v(n.lane), S = i.signals ?? (i.signals = []), A = n.label, $ = A === void 0 ? S.filter((M) => M.cardId === l.id && M.laneId === I.id) : S.filter((M) => M.cardId === l.id && M.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && $.length > 1) throw new B("Two outcomes on this card have that name.", "refused", I.id, l.id);
      if (!$.length && S.length >= 24) throw new B("A workshop can have up to 24 outcomes. Remove one first.", "refused", I.id, l.id);
      let _ = 1;
      for (; S.some((M) => M.id === "signal-" + _); ) _++;
      const F = { label: A ?? $[0]?.label ?? (l.label + " in " + I.label).slice(0, 80).trim(), cardId: l.id, laneId: I.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], F) : S.push({ id: "signal-" + _, ...F }), x(V(i, t, I.id, l.id), "When " + P(l.label) + " is in " + P(I.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: I.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = k(n.card), I = (i.signals ?? []).filter((S) => S.cardId === l.id);
      if (n.outcome === void 0) {
        if (!I.length) throw new B(P(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        wt(i, (S) => S.cardId === l.id);
      } else {
        const S = b(I, co(I, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        wt(i, (A) => A.id === S.id);
      }
      return x(V(i, t, l.laneId, l.id), "Removed the outcome from " + P(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((I) => v(I));
      if (l.length !== i.lanes.length || new Set(l).size !== i.lanes.length) throw new B("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = l.map((I) => I.id), x(V(i, t), D(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new B("Say before or after, not both.", "invalid_edit");
      const l = v(n.lane), I = n.before ?? n.after, S = I === void 0 ? void 0 : v(I);
      if (S && S.id === l.id) throw new B("Choose two different scenes.", "refused", l.id);
      const A = Mo(i).filter(($) => $.id !== l.id);
      return A.splice(S ? A.findIndex(($) => $.id === S.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), i.presentationOrder = A.map(($) => $.id), x(V(i, t, l.id), D(A), { laneId: l.id });
    }
    case "add_station": {
      const l = v(n.from);
      let I;
      try {
        I = Rr(i, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new B(A.message, "refused", l.id);
      }
      const S = I.lanes[I.lanes.length - 1];
      return x(I, "Added a path from " + P(l.label) + " to " + P(S.label) + ".", { laneId: S.id });
    }
    case "insert_station": {
      const l = v(n.before), I = n.from === void 0 ? void 0 : v(n.from), S = I ? [I] : i.lanes.filter((_) => _.station.next.includes(l.id));
      if (I && !I.station.next.includes(l.id))
        throw new B("There is no path from " + P(I.label) + " to " + P(l.label) + ". Try “Add " + n.label + " after " + I.label + "”.", "refused", I.id);
      if (!S.length) throw new B("Nothing leads to " + P(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let A;
      try {
        A = Rr(i, S[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (_) {
        throw new B(_.message, "refused", l.id);
      }
      const $ = A.lanes[A.lanes.length - 1];
      for (const _ of A.lanes)
        S.some((j) => j.id === _.id) && (_.station.next = [...new Set(_.station.next.map((j) => j === l.id ? $.id : j))]);
      return $.station.next = [l.id], x(V(A, t, $.id), "Added " + P($.label) + " before " + P(l.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const l = v(n.from), I = v(n.to);
      if (l.id === I.id) throw new B("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(I.id) ? x(i, P(l.label) + " already leads to " + P(I.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(I.id), x(V(i, t, l.id), "Connected " + P(l.label) + " to " + P(I.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = v(n.from), I = v(n.to);
      if (!l.station.next.includes(I.id)) throw new B("There is no path between " + P(l.label) + " and " + P(I.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((S) => S !== I.id), x(V(i, t, l.id), "Removed the path from " + P(l.label) + " to " + P(I.label) + ".", { laneId: l.id });
    }
    case "set_station_outcome": {
      const l = v(n.station);
      return l.station.outcome = n.outcome, x(V(i, t, l.id), "Changed what happens at " + P(l.label) + ".", { laneId: l.id });
    }
    case "set_station_position": {
      const l = v(n.station);
      return Object.assign(l.station, { column: n.column, row: n.row }), x(V(i, t, l.id), "Moved " + P(l.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: l.id });
    }
    case "set_station_image": {
      const l = v(n.station);
      return n.image === null ? (delete l.station.image, x(V(i, t, l.id), "Removed the image at " + P(l.label) + ".", { laneId: l.id })) : (l.station.image = { src: n.image.src, alt: n.image.alt }, x(V(i, t, l.id), "Updated the image at " + P(l.label) + ".", { laneId: l.id }));
    }
    case "set_station_image_alt": {
      const l = v(n.station);
      if (!l.station.image) throw new B("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, x(V(i, t, l.id), "Updated the image description at " + P(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = k(n.card);
      let I = l.id, S, A;
      if (n.kind === "connect_cards") {
        const M = k(n.to, l.laneId);
        if (M.id === l.id) throw new B("A line joins two different cards.", "refused", l.laneId, l.id);
        S = M.id, A = P(M.label);
      } else {
        const M = n.note.trim();
        if (i.cards.some((U) => U.id === M) || i.lanes.some((U) => U.id === M))
          throw new B("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        S = M, A = "the note " + M, n.direction === "from_note" && ([I, S] = [S, I]);
      }
      const $ = vi(i, I, S, n.label ? { label: n.label } : {}), _ = Zn(i, $);
      if (_) throw new B(_, "refused", l.laneId, l.id);
      const j = It(i, $), F = I === l.id;
      return x(
        j,
        F ? "Drew a line from " + P(l.label) + " to " + A + "." : "Drew a line from " + A + " to " + P(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = k(n.card), I = n.kind === "disconnect_cards" ? k(n.to, l.laneId).id : n.note.trim(), S = n.kind === "disconnect_cards" ? P(i.cards.find((_) => _.id === I).label) : "the note " + I, A = (_) => _.parentId === l.id && _.childId === I || _.parentId === I && _.childId === l.id, $ = i.lines ?? [];
      return $.some(A) ? (i.lines = $.filter((_) => !A(_)), x(V(i, t, l.laneId, l.id), "Took away the line between " + P(l.label) + " and " + S + ".", { laneId: l.laneId, cardId: l.id })) : x(e, P(l.label) + " and " + S + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new B("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function J(l, I, S = !1) {
    const A = { laneId: I.id, cardId: l.id };
    if (l.laneId === I.id)
      return x(e, P(l.label) + " is already " + (d ? "at " : "in ") + P(I.label) + ".", A, !1);
    const $ = cn(e, l.id, I.id);
    if (!$) {
      const _ = ze(e, l.id, I.id) ?? "That move is not available.", j = Xn(e, l.id, I.id, { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() });
      if (S && j) return x(V(j, t, I.id, l.id), "Moved " + P(l.label) + " to " + P(I.label) + " anyway. " + _, A);
      const F = new B(_, "refused", I.id, l.id);
      throw j && (F.overridable = !0), F;
    }
    return x(V($, t, I.id, l.id), "Moved " + P(l.label) + " to " + P(I.label) + ".", A);
  }
}
function gr(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new B(r === "amount" ? G.notAmounts : G.notTasks, "not_on_this_board", t);
}
function wt(e, n) {
  e.signals && (e.signals = e.signals.filter((t) => !n(t)), e.signals.length || delete e.signals);
}
function $e(e, n, t = {}) {
  const r = (v) => ({ refused: { index: 0, kind: null, laneId: null, ...v } });
  let o;
  try {
    o = Q(e);
  } catch (v) {
    return r({ reason: "The workshop cannot be read: " + (v instanceof Error ? v.message : String(v)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return r({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const i = o, d = [], u = [], h = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [v, k] of n.entries()) {
    const L = k?.kind, x = fo.find(($) => $.kind === L);
    if (!k || typeof k != "object" || !x)
      return r({
        index: v,
        kind: typeof L == "string" ? L : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(L)) + ". The edits are " + dn(fo.map(($) => $.kind)) + "."
      });
    const O = bs(k, x);
    if (O) return r({ index: v, kind: x.kind, code: "invalid_edit", reason: O });
    const D = Ct(o);
    if (!x.boards.includes(D))
      return r({ index: v, kind: x.kind, code: "not_on_this_board", reason: x.refusals[D] ?? "This workshop does not take " + x.kind + "." });
    const J = (k.kind === "move_card" || k.kind === "set_task" || k.kind === "nest_card") && k.override !== !0, l = ($, _) => {
      if (!J || $ !== "refused") return { reason: _ };
      const j = $e(o, [{ ...k, override: !0 }], t);
      return "refused" in j ? { reason: _ } : { reason: j.report.overrides?.[0]?.sentence ?? _, overridable: !0 };
    };
    let I;
    try {
      I = vs(o, k, D, t.selection, h);
    } catch ($) {
      if (!($ instanceof B)) throw $;
      const _ = $.overridable ? { reason: $.reason, overridable: !0 } : l($.code, $.reason);
      return r({
        index: v,
        kind: x.kind,
        ..._,
        code: $.code,
        laneId: $.laneId,
        ...$.cardId && { cardId: $.cardId },
        ...$.candidates && { candidates: $.candidates },
        ...$.limits && { limits: $.limits }
      });
    }
    const S = o.behaviour && !ws(x.kind) && x.kind !== "set_appearance" ? be().check(o, I.board) : null;
    if (S && "refused" in S)
      return r({ index: v, kind: x.kind, ...l("refused", S.refused.sentence), code: "refused", laneId: S.refused.laneId, cardId: S.refused.cardId });
    const A = As(o, I.board);
    if (A) return r({ index: v, kind: x.kind, reason: A, code: "not_on_this_board", laneId: I.laneId ?? null });
    if (k.override === !0)
      for (const $ of I.board.cards)
        $.override && ga(o, $) && u.push({ index: v, cardId: $.id, laneId: $.laneId, fromLaneId: $.override.from, sentence: $.override.sentence });
    o = I.board, d.push({
      index: v,
      kind: x.kind,
      said: I.said,
      changed: I.changed ?? !0,
      ...I.laneId && { laneId: I.laneId },
      ...I.cardId && { cardId: I.cardId }
    });
  }
  const C = new Map(i.cards.map((v) => [v.id, v.laneId])), b = o.cards.flatMap((v) => {
    const k = C.get(v.id);
    return k === void 0 || k === v.laneId ? [] : [{ cardId: v.id, fromLaneId: k, toLaneId: v.laneId }];
  });
  return { workshop: o, report: { edits: d, movedCards: b, ...u.length && { overrides: u } } };
}
function xs(e, n) {
  const t = oe(e);
  if (t === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const r = e.lanes.find((o) => {
      const i = n.lanes.find((d) => d.id === o.id);
      return o.role !== i.role || o.probability !== i.probability;
    });
    if (r) return `${r.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (t === "budget") {
    const r = e.budget, o = n.budget;
    if (!o || r.currency !== o.currency || r.step !== o.step) return "A budget keeps its currency and its step.";
    const i = Ae(t).fixed?.(e, n);
    if (i) return i;
    const d = e.lanes.find((u) => {
      const h = n.lanes.find((C) => C.id === u.id);
      return u.floor !== h.floor || u.cap !== h.cap || u.capacity !== h.capacity;
    });
    if (d) return `${d.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? G.launchLanes : t && Ae(t).fixed?.(e, n) || null;
}
const Is = {
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
function As(e, n) {
  const t = Q(e), r = Ct(t);
  let o;
  try {
    o = Q(n);
  } catch (h) {
    return Lt(h instanceof Error ? h.message : String(h), r);
  }
  const i = Ct(o), d = (h, C) => h.lanes.length === C.lanes.length && h.lanes.every((b) => C.lanes.some((v) => v.id === b.id)), u = (h, C) => h.lanes.every((b, v) => C.lanes[v]?.id === b.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return d(t, o) ? G.keepsCards : G.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !u(t, o)) return G.keepsOrder;
  if (oe(t) && i === r && !(d(t, o) && u(t, o))) return uo[r];
  if (oe(t) && i === r) {
    const h = xs(t, o);
    if (h) return h;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!d(t, o)) return G.releaseLanes;
    if (!u(t, o)) return G.releaseOrder;
    if (o.cards.some((h) => !t.cards.some((C) => C.id === h.id))) return G.releaseCards;
  }
  return r !== i ? "This board is a " + Is[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? be().replacement(t, o) : null;
}
const Ss = 48, Yn = 44, yr = 4, Cs = 40, Gr = 22, Ls = 84, Os = (e) => Math.min(Yn, Math.max(Gr, Math.ceil(e * 1.45) + 14)), $s = 98, Ts = 88;
function Ur(e, n, t, r = 228, o = Gr) {
  const i = { x: e + 8, y: n + 6, width: r - Ss, height: Cs }, d = i.y + i.height + yr, u = Math.min(Ls, t), h = { x: e + 8 + r - Yn - yr - u, y: d + (Yn - o) / 2, width: u, height: o };
  return { label: i, counter: h, strip: { x: e + 8, y: d, width: r, height: Yn } };
}
function Es(e, n, t, r) {
  for (let C = n; C > 11; C--) {
    const b = Math.max(1, Math.floor(t / (C * 0.55)));
    if (e.split(`
`).reduce((k, L) => k + Math.max(1, Math.ceil(L.length / b)), 0) * C * 1.3 <= r) return { text: e, fontSize: C };
  }
  const o = Math.min(n, 11), d = Math.max(1, Math.floor(t / (o * 0.55))) * Math.max(1, Math.floor(r / (o * 1.3)));
  if (e.length <= d) return { text: e, fontSize: o };
  const u = e.slice(0, Math.max(1, d - 1)), h = u.lastIndexOf(" ");
  return { text: (h > d / 2 ? u.slice(0, h) : u).trimEnd() + "…", fontSize: o };
}
function el(e, n) {
  return e.x < n.x + n.width && n.x < e.x + e.width && e.y < n.y + n.height && n.y < e.y + e.height;
}
function Ps(e, n, t) {
  const r = (o) => o && { x: o.x, y: o.y, width: o.width, height: o.height };
  return { width: n, height: t, places: e.filter((o) => o.name.startsWith("column-")).map((o) => {
    const i = o.name.slice(7), d = e.find((h) => h.name === "lane-" + i) ?? (i.startsWith("q-") ? e.find((h) => h.name === "caption-" + i) : void 0), u = d?.name.startsWith("lane-") ? e.find((h) => h.name === "caption-" + i && h.text) : void 0;
    return { laneId: i, x: o.x, y: o.y, width: o.width, height: o.height, row: 0, ...d && { label: r(d) }, ...u && { caption: r(u) } };
  }) };
}
const nl = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function tl(e) {
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
    const d = /* @__PURE__ */ new Set([i.id]);
    let u = i.after;
    for (; u !== null; ) {
      if (d.has(u) || !r.has(u) || o.includes(i.id) && !o.includes(u)) return null;
      d.add(u), u = r.get(u).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: t, hung: o };
}
function Ms(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function ol(e, n) {
  return Ms(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const qr = ["firstPrint", "secondPrint", "thirdPrint"], Kr = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function rl(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Kr, route: n.route };
  for (const r of qr) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function il(e = new URLSearchParams()) {
  const n = { ...Kr };
  for (const r of qr) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function sl(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Ns(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Ws(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), Rs(n), n;
}
function _s(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function Rs(e) {
  return e && _s(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function to(e) {
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
    label: e.label ?? "",
    ...typeof e.labelPosition == "number" && { labelPosition: e.labelPosition }
  };
}
function Ws(e) {
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
function gt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const In = {
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
}, js = "var(--slatebox-board-font, system-ui, sans-serif)", ho = "http://www.w3.org/2000/svg", kr = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function De(e, n, t) {
  const r = document.createElementNS(ho, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", kr(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", kr(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function An(e, n, t, r, o) {
  const i = typeof document < "u" ? document.activeElement : null, d = i && e.contains(i) ? i.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const u = [];
  for (const h of n)
    if (h.t === "line")
      e.appendChild(De("line", {
        x1: h.x1,
        y1: h.y1,
        x2: h.x2,
        y2: h.y2,
        "stroke-width": h.width ?? 1,
        ...h.dash ? { "stroke-dasharray": h.dash } : {}
      }, { stroke: h.color }));
    else if (h.t === "rect")
      e.appendChild(De("rect", {
        x: h.x,
        y: h.y,
        width: Math.max(0, h.w),
        height: Math.max(0, h.h),
        rx: h.rx ?? 0,
        ...h.opacity !== void 0 ? { opacity: h.opacity } : {},
        ...h.role ? { "data-board-layer": h.role } : {}
      }, { fill: h.color }));
    else if (h.t === "text") {
      const C = De("text", {
        x: h.x,
        y: h.y,
        "font-size": h.size ?? 13,
        "text-anchor": h.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...h.bold ? { "font-weight": 600 } : {},
        ...h.role ? { "data-board-layer": h.role } : {},
        ...h.halo ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
      }, { fill: h.color, ...h.halo ? { stroke: h.halo } : {} });
      C.style.setProperty("font-family", js), h.lines && h.lines.length > 1 ? h.lines.forEach((b, v) => {
        const k = De("tspan", { x: h.x, dy: v ? h.lineHeight ?? Math.round((h.size ?? 13) * 1.25) : 0 });
        k.textContent = v < h.lines.length - 1 ? b + " " : b, C.appendChild(k);
      }) : C.textContent = h.text, e.appendChild(C);
    } else {
      if (h.unlink && t) {
        const { cardId: C, waitsOn: b, label: v } = h.unlink, k = b + ">" + C, L = r?.armed === k, x = De("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": k,
          "aria-label": L ? v + ". " + (h.unlink.armed ?? "Tap again to remove it") + "." : v,
          role: "button",
          tabindex: 0,
          ...L ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: L ? In.refuse : "transparent" });
        let O = !1;
        x.addEventListener("pointerdown", (D) => {
          D.stopPropagation(), O = D.pointerType === "touch" || D.pointerType === "pen";
        }), x.addEventListener("click", (D) => {
          if (D.stopPropagation(), O && r && r.armed !== k) {
            r.arm(k);
            return;
          }
          r?.arm(null), t(C, b);
        }), x.addEventListener("keydown", (D) => {
          D.key !== "Enter" && D.key !== " " || (D.preventDefault(), D.stopPropagation(), t(C, b));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", In.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          L || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), e.appendChild(x), u.push(x);
      } else if (h.pick && o) {
        const { key: C, label: b } = h.pick, v = De("path", {
          d: h.d,
          fill: "none",
          "stroke-width": h.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": C,
          "data-board-pick": "",
          "aria-label": b,
          role: "button",
          tabindex: 0
        }, { stroke: "transparent" });
        v.addEventListener("pointerdown", (k) => k.stopPropagation()), v.addEventListener("click", (k) => {
          k.stopPropagation(), o(C);
        }), v.addEventListener("keydown", (k) => {
          k.key !== "Enter" && k.key !== " " || (k.preventDefault(), k.stopPropagation(), o(C));
        }), v.addEventListener("focus", () => {
          v.style.setProperty("stroke", In.accept), v.setAttribute("opacity", "0.35");
        }), v.addEventListener("blur", () => {
          v.style.setProperty("stroke", "transparent"), v.removeAttribute("opacity");
        }), e.appendChild(v), u.push(v);
      }
      if (e.appendChild(De(
        "path",
        {
          d: h.d,
          fill: "none",
          "stroke-width": h.width ?? 1.5,
          "pointer-events": "none",
          ...h.dash ? { "stroke-dasharray": h.dash } : {},
          ...h.role ? { "data-board-layer": h.role } : {},
          ...h.strokeOpacity !== void 0 ? { "stroke-opacity": h.strokeOpacity } : {},
          ...h.fill ? { "stroke-linecap": "round", "stroke-linejoin": "round" } : {}
        },
        { stroke: h.color === "none" ? "transparent" : h.color, ...h.fill && h.fill !== "none" ? { fill: h.fill } : {} }
      )), h.arrow) {
        const { x: C, y: b, angle: v } = h.arrow;
        e.appendChild(De("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${b}) rotate(${v})`, "pointer-events": "none" }, { fill: h.color }));
      }
      if (h.unlink && r?.armed === h.unlink.waitsOn + ">" + h.unlink.cardId && h.arrow) {
        const C = De("text", {
          x: h.arrow.x - 6,
          y: h.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: In.refuse });
        C.textContent = h.unlink.armed ?? "Tap again to remove this link", e.appendChild(C);
      }
    }
  d && u.find((h) => h.getAttribute("data-board-link") === d)?.focus({ preventScroll: !0 });
}
function Ds(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(ho, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(ho, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let i = !1, d = null, u;
  const h = {
    armed: null,
    arm(b) {
      clearTimeout(u), h.armed = b, b && (u = setTimeout(() => h.arm(null), 5e3), d?.[2].announce?.(d[2].boardFocused && d[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), d && C.draw(...d);
    }
  }, C = {
    draw(b, v, k) {
      if (i || !t) return;
      d = [b, v, k];
      const { origin: L } = k, x = n(v ?? b, k, b), O = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o])
        l.setAttribute("transform", `translate(${L.x} ${L.y})`), l.toggleAttribute("data-workshop-focused", !!k.boardFocused);
      An(r, x.filter((l) => !O(l)), k.onUnlink, h, k.onPick), An(o, x.filter(O));
      const D = k.above && k.above.parentNode === t ? k.above : null, J = D ? D.nextSibling : t.firstChild;
      (r.parentNode !== t || r.previousSibling !== D) && t.insertBefore(r, J === r ? r.nextSibling : J), o.firstChild && t.lastChild !== o ? t.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
    },
    destroy() {
      i = !0, clearTimeout(u), r.remove(), o.remove();
    }
  };
  return C;
}
const fe = {
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
}, yt = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, Fs = (e) => e.replace(/\.$/, ""), zs = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function To(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return Bs(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, d = (u) => n.push(i ? { ...u, warn: i } : u);
    if (o.kind === "bin" && o.lane) d({ icon: "bin", text: yt(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) d({ icon: "gate", text: yt(e, o.into) + " needs " + (o.needs ?? []).map((u) => zs[u] ?? u).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) d({ icon: "step", text: "One column at a time", seams: t.slice(1).map((u, h) => [t[h], u]) });
      else {
        const u = o.from, h = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(u)) === 1).map((C) => [u, C]);
        d({ icon: "oneway", text: yt(e, u) + " → " + o.to.map((C) => yt(e, C)).join(" or ") + " only", seams: h });
      }
  }
  return n;
}
function Bs(e) {
  if (!us()) return [];
  let n;
  try {
    n = be().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = Fs(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, d = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: d, text: Hs(o), ...i && { warn: i } });
  }
  return t;
}
function Hs(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const vt = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Jr(e, n, t, r, o = 12) {
  const i = o / 12, d = (h) => h.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, b, v) => `A${+b * i} ${+v * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, b, v) => `${+(n + +b * i).toFixed(1)},${+(t + +v * i).toFixed(1)}`), u = (h, C = 1.6) => ({ t: "path", d: d(h), color: r, width: C * i });
  switch (e) {
    case "bin":
      return [u("M2,3 L10,3 M4.5,3 L4.5,1.5 L7.5,1.5 L7.5,3 M3,3 L3.8,11 L8.2,11 L9,3")];
    case "gate":
      return [u("M2,11 L2,3 L10,3 L10,11 M6,3 L6,11 M2,7 L10,7")];
    case "step":
      return [u("M4,2 L8,6 L4,10", 1.8)];
    case "oneway":
      return [u("M1,6 L10,6 M7,3 L10,6 L7,9", 1.8)];
    case "clock":
      return [u("M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,3.5 L6,6 L8,7.5")];
    case "flag":
      return [u("M3,11 L3,1.5 L10,3.5 L3,6")];
    case "push":
      return [u("M1,6 L7,6 M4.5,3.5 L7,6 L4.5,8.5 M9.5,2 L9.5,10", 1.7)];
    case "lock":
      return [u("M3,6 L9,6 L9,11 L3,11 Z M4.5,6 L4.5,4 Q6,1.5 7.5,4 L7.5,6")];
    default:
      return [u("M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,4 L6,6.5 M6,8.5 L6,8.6", 1.7)];
  }
}
const Eo = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function Ot(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + vt(e.text, 13 * n, t) + 10 * n);
}
function kt(e, n, t, r, o = {}) {
  const i = 24 * r, d = 10 * r, u = t.icon ? 17 * r : 0, h = Ot(t, r, o.bold), C = o.ink ?? fe.chipInk, b = [{
    t: "path",
    d: Eo(e, n, h, i, i / 2),
    color: t.warn ? fe.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? fe.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && b.push(...Jr(t.icon, e + d, n + 6 * r, C, 12 * r)), b.push({ t: "text", x: e + d + u, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), b;
}
function br(e, n, t, r) {
  return [
    { t: "path", d: Eo(n - 11, t - 11, 22, 22, 11), color: fe.badgeLine, width: 1, fill: fe.badge, role: r },
    ...Jr(e, n - 6, t - 6, fe.badgeInk)
  ];
}
const Gs = "Preview · not added yet", Yr = 6, Us = 2.5, Zr = (e) => Math.round(Math.min(Yr, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, po = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function Vr(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(Yr, Math.max(1, t.scale ?? 1)), d = i > Us ? [] : To(e), u = 18 * i, h = 30 * i, C = (_, j) => {
    const F = (t.narrow && j <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (vt(_, 18 * j, !0) <= F) return _;
    const M = Math.max(3, Math.floor(F / (18 * j * 0.58)) - 1);
    return _.slice(0, M).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, b = C(e.title, i), v = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), k = [], L = [2 + vt(C(e.title, 1), 18, !0) + 14];
  t.narrow && d.length && (L[0] = 1 / 0, L.push(2));
  for (const _ of d) {
    const j = Ot(_, 1);
    let F = L.findIndex((M) => M + j <= v);
    F < 0 && (L.push(2), F = L.length - 1), k.push({ x: L[F], row: F, item: _, width: j }), L[F] += j + 6;
  }
  const x = k.map((_) => ({ x: r + Math.round(_.x * i), row: _.row, item: _.item, width: Ot(_.item, i) })), O = Math.max(1, ...x.map((_) => _.row + 1)), D = o - 14 * i - O * h, J = !!(t.focused || t.draft), l = t.narrow ? 8 : 16, I = J ? { x: r - l, y: D - 18 * i, width: n.width + 2 * l, height: o + n.height + l - (D - 18 * i) } : null, S = Math.max(i, t.tagScale ?? i), A = I ? I.y - 12 * S : D, $ = r + 2 + vt(b, u, !0);
  return { k: i, tagK: S, legend: d, placed: x, rows: O, title: b, titleY: D, titleSize: u, titleRight: $, rowH: h, frame: I, top: A };
}
function Xr(e, n, t = {}) {
  const r = Vr(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((b) => b.x + b.width)), d = o ? o.x : 0, u = r.top, h = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: d, y: u, width: h - d, height: C - u };
}
function vr(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: d, titleY: u, titleSize: h, rowH: C, frame: b } = Vr(e, n, t), v = n.x ?? 0, k = [];
  if (b) {
    const L = Eo(b.x, b.y, b.width, b.height, 18);
    t.focused && k.push({ t: "path", d: L, color: fe.focus, width: 12, strokeOpacity: 0.1, fill: fe.focusTint, role: "focus-glow" }), k.push({
      t: "path",
      d: L,
      color: t.focused ? fe.focus : fe.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  k.push({ t: "text", x: v + 2, y: u + 19 * r, text: d, color: fe.title, size: h, bold: !0, role: "board-title" });
  for (const L of i) k.push(...kt(L.x, u + L.row * C + 2 * r, L.item, r));
  if (b) {
    const L = b.y - 12 * o;
    if (t.focused) {
      const x = { text: "Editing" };
      k.push(...kt(b.x + 18, L, x, o, { fill: fe.focus, ink: fe.focusInk, bold: !0, role: "focus-tag" })), k.push(...kt(
        b.x + 18 + Ot(x, o, !0) + 6 * o,
        L,
        { text: "Done" },
        o,
        { fill: fe.halo, ink: fe.focus, line: fe.focus, bold: !0, role: "focus-done" }
      ));
    } else
      k.push(...kt(b.x + 18, L, { text: Gs }, o, { fill: fe.previewFill, ink: fe.previewInk, bold: !0, role: "draft-tag" }));
  }
  return k;
}
function xr(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((d) => d.laneId === i);
  for (const i of To(e)) {
    const d = i.lane ? o(i.lane) : void 0;
    if (d) {
      const { label: u, strip: h } = Ur(d.x, d.y, 0);
      r.push(...br(i.icon, u.x + Yn / 2, h.y + h.height / 2, "badge-" + i.lane));
    }
    for (const [u, h] of i.seams ?? []) {
      const C = o(u), b = o(h);
      !C || !b || C.row !== b.row || r.push(...br(i.icon, (C.x + C.width + b.x) / 2, C.y + $s + Ts / 2, "seam-" + u + ">" + h));
    }
  }
  return r;
}
function qs(e) {
  const n = To(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const al = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, Ir = "http://www.w3.org/2000/svg";
function Ar(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function Ks(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(Ir, "g") : null, r = typeof document < "u" ? document.createElementNS(Ir, "g") : null;
  for (const b of [t, r])
    b?.setAttribute("data-board-chrome", ""), b?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const d = (b) => ({ layout: b.layout, focused: b.focused, draft: b.draft, scale: b.scale, tagScale: b.tagScale, narrow: b.narrow, places: b.places, room: b.room }), u = (b, v) => {
    const k = Xr(b.board, b.size, v);
    return { x: b.origin.x + k.x, y: b.origin.y + k.y, width: k.width, height: k.height };
  }, h = (b) => ({ ...d(b), focused: !1, draft: !1, scale: 1, tagScale: 1 }), C = {
    get scope() {
      return i?.scope ?? "main";
    },
    get draft() {
      return !!i?.draft;
    },
    box(b) {
      if (!i) return null;
      const v = Zr(b);
      return u(i, { ...d(i), scale: v, tagScale: po(b, !!(i.narrow && !i.draft), v) });
    },
    plainBox() {
      return i ? u(i, h(i)) : null;
    },
    paintPlain(b, v) {
      if (!i) return;
      const k = h(i);
      b.removeAttribute("data-workshop-focused"), An(b, vr(i.board, { width: i.size.width, height: i.size.height }, k)), v && (v.removeAttribute("data-workshop-focused"), An(v, xr(i.board, k)));
    }
  };
  return Ar(e).add(C), {
    draw(b) {
      if (o || !n || !t || !r) return;
      i = b;
      const v = d(b);
      for (const x of [t, r])
        x.setAttribute("transform", `translate(${b.origin.x} ${b.origin.y})`), x.toggleAttribute("data-workshop-focused", !!b.focused), x.toggleAttribute("data-workshop-draft", !!b.draft), x.setAttribute("data-board-scope", b.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", qs(b.board)), An(t, vr(b.board, { width: b.size.width, height: b.size.height }, v)), An(r, xr(b.board, v));
      const k = t.querySelector('[data-board-layer="focus-done-box"]');
      if (k && b.onDone) {
        const x = b.onDone;
        k.setAttribute("role", "button"), k.setAttribute("tabindex", "0"), k.setAttribute("aria-label", "Done changing " + b.board.title), k.setAttribute("pointer-events", "all"), k.setAttribute("cursor", "pointer"), k.addEventListener("pointerdown", (O) => O.stopPropagation()), k.addEventListener("click", (O) => {
          O.stopPropagation(), x();
        }), k.addEventListener("keydown", (O) => {
          const D = O.key;
          D !== "Enter" && D !== " " || (O.preventDefault(), O.stopPropagation(), x());
        });
      }
      const L = b.under && b.under.parentNode === n ? b.under : null;
      L ? t.nextSibling !== L && n.insertBefore(t, L) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, Ar(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const mo = "handle-_link-", wo = "handle-_route-", Vn = 40, Qr = 44;
function oo(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(Vn, Math.ceil(Qr / n)));
}
function ei(e) {
  if (e.startsWith(mo)) return { kind: "link", from: e.slice(mo.length) };
  if (e.startsWith(wo)) {
    const [n, t] = e.slice(wo.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const ni = (e) => !!e.lanes[0]?.station, Ze = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function Po(e) {
  const { places: n } = Fe(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function Sr(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, d = n.y - o, u = i ? e.width / 2 / Math.abs(i) : 1 / 0, h = d ? e.height / 2 / Math.abs(d) : 1 / 0, C = Math.min(u, h), b = Math.hypot(i, d) || 1;
  return { x: r + i * C + i / b * t, y: o + d * C + d / b * t };
}
function ti(e) {
  if (!ni(e)) return [];
  const n = Po(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const d = n.get(i);
        if (!d) continue;
        const u = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, h = { x: d.x + d.width / 2, y: d.y + d.height / 2 }, C = Sr(o, h, -8), b = Sr(d, u, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: b.x, y2: b.y });
      }
  }
  return t;
}
function Js(e, n) {
  for (const [t, r] of Po(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function oi(e, n, t = Vn) {
  if (!ni(e)) return [];
  const r = Po(e), o = t / Vn, i = (u, h, C, b, v) => ({ options: {
    id: u,
    name: b,
    text: v ? "+" : "",
    xPos: n.x + h - t / 2,
    yPos: n.y + C - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: ln(t, t, t / 2),
    backgroundColor: v ? "#2f5fd0" : "#fffef8",
    foregroundColor: v ? "#ffffff" : "#2f5fd0",
    borderColor: v ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), d = [];
  for (const u of e.lanes) {
    const h = r.get(u.id);
    h && d.push(i(mo + u.id, h.x + h.width, h.y + h.height, "Draw a path from " + u.label, !0));
  }
  for (const u of ti(e))
    d.push(i(wo + u.from + "~" + u.to, u.x2, u.y2, "End of the path from " + Ze(e, u.from) + " to " + Ze(e, u.to), !1));
  return d;
}
function Ys(e, n) {
  const t = ei(n);
  return t ? t.kind === "link" ? `Draw a path from ${Ze(e, t.from)}: drag it onto another step.` : `End of the path from ${Ze(e, t.from)} to ${Ze(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function Zs(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((d) => d.id === n.from);
  if (!r?.station || !e.lanes.some((d) => d.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${Ze(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((d) => d !== n.to) : r.station.next, i = e.lanes.map((d) => d.id === r.id ? { ...d, station: { ...d.station, next: [...o, t] } } : d);
  return { next: { ...e, lanes: i } };
}
function Vs(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((u) => u.id === o.id)?.station?.next ?? [], d = o.station?.next ?? [];
    for (const u of i) d.includes(u) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: u } });
    for (const u of d) i.includes(u) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: u } });
  }
  return [...t, ...r];
}
function Xs(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? Vn, i = Math.max(24, o * Qr / Vn);
  for (const d of ti(e)) {
    const u = Ze(e, d.from) + " to " + Ze(e, d.to), h = `M ${d.x1} ${d.y1} L ${d.x2} ${d.y2}`, C = !r && n.picked === d.key;
    t.push(r ? { t: "path", d: h, color: "transparent", width: 3, hit: i, unlink: { cardId: d.to, waitsOn: d.from, label: "Remove the path from " + u, armed: "Tap again to remove this path" } } : { t: "path", d: h, color: C ? In.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: d.key, label: "Path from " + u + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const d = oi(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, u = d ? d.xPos + o + 6 : 0, h = d ? d.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: u, y: h, text: n.clamp.text, color: In.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
let ri = null;
const go = /* @__PURE__ */ new Set();
function ll(e) {
  ri = e;
  for (const n of go) n();
}
const Cr = "#1f7a5c", Lr = "#5b9a85", ro = "#c2410c", Qs = "#a8761b", ea = {
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
}, na = { canMove: !1, canSelect: !1 }, io = "A card's line joins notes and cards on its own board.", qn = /* @__PURE__ */ new WeakMap();
function ta(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function dl(e, n, t = {}) {
  const r = nt(t.scope);
  let o = Q(n);
  const i = t.kit, d = (s) => !!oe(s) && !i;
  if (d(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const u = i?.layer(e) ?? (o.lanes[0]?.station ? Ds(e, Xs) : void 0), h = t.chrome === !1 ? null : Ks(e);
  let C = 1, b = 1, v = null, k = null, L = /* @__PURE__ */ new Set(), x = null, O = null;
  const D = !!t.draft, J = !!t.still;
  let l = !!t.readOnly || D || J, I = l || d(o), S = !1;
  const A = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
  let M = null, U = null, ve = null, he = null, se = null;
  const Be = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Ce = /* @__PURE__ */ new Map();
  let ae = null, pe = null;
  function Qe(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, S || z(O ?? o);
    }, 3e3) };
  }
  let xe = Promise.resolve(), He = null, X = $r(t.layout), ye = X;
  const tt = { ...t.style };
  let Ee = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Set(), Do = null, Le = !1, ot = t.controls ?? "off", en = null, Dt = null;
  const Fo = () => gn();
  go.add(Fo);
  let Pn = oo(1), rt = null, Mn = null, nn = null, it = !1;
  const me = /* @__PURE__ */ new Map();
  qe(o);
  const Y = t.origin ? { x: t.origin.x, y: t.origin.y } : ra(e), st = r ? r + ":" : "", Ie = (s) => F.get(s) ?? (st ? s.startsWith(st) ? s.slice(st.length) : null : s), zo = (s) => we(s)?.kind === "column" && !/^column-q-/.test(Ie(s) ?? ""), we = (s) => {
    const a = Ie(s);
    return a === null ? null : ta(a);
  };
  function le(s) {
    const a = j.get(s);
    if (a) return a;
    const c = st + s;
    if (A.has(c) && !F.has(c) || !e.nodes.one?.(c)) return c;
    const p = Li(c, (m) => !!e.nodes.one?.(m) || F.has(m));
    return j.set(s, p), F.set(p, s), console.warn(`WORKSHOP: the slate already has a note named "${c}". It stays the slate's own; the workshop draws its note as "${p}".`), p;
  }
  function Nn(s, a = 1) {
    let c = [];
    try {
      c = t.avoid?.() ?? [];
    } catch (p) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", p);
    }
    return c.length ? _a(s, c, a) : { x: s.x, y: s.y };
  }
  function Ti(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (f) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", f);
    }
    const { width: c, height: p } = i ? i.places(o, X) : qe(o);
    let m = 1 / 0;
    for (const f of a)
      [f.x, f.y, f.width, f.height].every(Number.isFinite) && f.x >= Y.x + c && f.y < Y.y + p && f.y + f.height > Y.y && (m = Math.min(m, f.x - 32 - Y.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function Ei(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (c) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", c);
    }
    return a.some((c) => [c.x, c.y, c.width, c.height].every(Number.isFinite) && s.x < c.x + c.width && s.x + s.width > c.x && s.y < c.y + c.height && s.y + s.height > c.y);
  }
  function Pi(s, a) {
    const c = [...qn.get(e) ?? []].filter((g) => g !== zt);
    if (!c.length) return null;
    const { id: p, note: m } = nr(s, a), f = { id: p, options: m }, w = lo(o, s).some((g) => o.cards.some((y) => y.id !== s && (y.id === g.parentId || y.id === g.childId)));
    for (const g of c) {
      let y = null;
      try {
        y = g.verdict(f, a);
      } catch (T) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", T);
      }
      if (y) return { board: g, ...y, reason: w ? io : y.reason };
    }
    return null;
  }
  function Mi(s, a, c, p) {
    const { added: m, answer: f } = dt(a, c, "", !0), w = Nn(c), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let y;
      try {
        y = s.take(m, p, w);
      } catch (R) {
        console.warn("WORKSHOP: another board could not take the card", R);
      }
      if (y === "taken") return;
      const T = Math.round(w.x), E = Math.round(w.y);
      m.position?.(T, E, () => e.updateSelectionResizeRotate?.(), void 0, gt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [to({ ...m.options, x: T, y: E })] });
    };
    !f || typeof f.then != "function" ? g() : f.then((y) => {
      y === !0 && !S && g();
    }, () => {
    });
  }
  const Pe = {
    governs(s) {
      if (A.get(s.id) !== s) return null;
      const a = we(s.id)?.kind;
      return a === "card" ? { canMove: !I, canEditText: !I && !O && o.kind !== "release-plan", canConnect: Dn() } : a === "lane" ? { canMove: !1, canEditText: !I && !O } : a === "handle" ? { canMove: !I && !O, canEditText: !1, ...!X.narrow && { cursor: i ? "ew-resize" : "grab" }, ...X.narrow && { edgePan: !1 } } : na;
    },
    onStart(s, a) {
      const c = we(s.id), p = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (c.kind === "handle") {
        const w = I || O ? null : i ? i.handleDrag(o, Ie(s.id), p, X) : ns(Ie(s.id));
        return w ? (re(), Ue(), pe && (clearTimeout(pe.timer), pe = null), x = { name: Ie(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = c.key;
      if (I || O || !o.cards.some((w) => w.id === m)) return !1;
      re(), Ue();
      let f = null;
      try {
        f = (i?.chooser ?? t.chooseCandidate)?.(o, m, p, X) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return M = { cardId: m, evaluate: f, grab: p, outcome: { kind: "home" } }, z(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (x) {
        x.last = x.follow(on(a)), z(x.last.next, { grip: x.name, layout: Ti(x.last.layout) }), q(t.onPreview, x.last.next === o ? null : x.last.next);
        return;
      }
      if (!M) return;
      const c = qo(M.cardId, a, M.evaluate);
      if (oa(c, M.outcome)) return;
      M.outcome = c;
      const p = c.kind === "candidate" ? c.next : null;
      z(p ?? o, { skip: M.cardId }), q(t.onPreview, p);
    },
    onEnd(s, a) {
      if (x) {
        const { follow: w, name: g } = x, y = w(on(a));
        if (x = null, q(t.onPreview, null), y.refusal) {
          Qe(g, y.refusal), z(o), e.announce?.(y.refusal), q(t.onRefuse, { laneId: null, reason: y.refusal });
          const E = y.override && Or(y.override.edit);
          E && Bn(E, o.cards.find((R) => R.id === E)?.laneId ?? "", y.refusal, y.override);
        } else ft(y.next, {}) || z(o);
        const T = Xt(o, Ie(s.id));
        return T ? { accept: !0, settle: T } : { accept: !1 };
      }
      if (!M) return { accept: !1 };
      const { cardId: c, evaluate: p } = M, m = qo(c, a, p), f = o.cards.find((w) => w.id === c);
      if (M = null, q(t.onPreview, null), m.kind === "candidate" && i) {
        if (!ft(m.next, { cardId: c, laneId: m.laneId }, c))
          return z(o, { skip: c }), { accept: !1 };
        m.said && (Qe("card-" + c, m.said), e.announce?.(m.said));
        const w = Xt(o, Ie(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, z(o, { skip: c });
        const w = o.lanes.find((y) => y.id === m.laneId);
        e.announce?.(`${Z(f)} moved to ${w.label}. ${Je(o, w.id)}.`), q(t.onChange, o, { cardId: c, laneId: m.laneId });
        const g = Xt(o, Ie(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused") {
        const w = m.override ? m.override.to ?? i?.overrideWords?.(o, m.override.edit) : void 0;
        Yi(Z(f), { cardId: c, laneId: m.laneId, reason: m.reason }, w ?? (i && m.laneId === f.laneId ? "there" : void 0)), m.near && Qe("card-" + c, m.reason), i ? m.override && Bn(c, m.laneId, m.reason, m.override) : m.near || Bn(c, m.laneId, m.reason);
      } else if (m.kind === "outside" && ao() && !Re()) {
        const w = xt(o, c);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, y = Pi(c, a);
          if (y?.reason)
            return z(o, { skip: c }), y.board.flash(y.laneId, y.reason), e.announce?.(`${Z(f)} can't go in ${y.laneLabel}. ${y.reason} It stays where it was.`), q(t.onRefuse, { cardId: c, laneId: null, reason: y.reason }), { accept: !1 };
          if (y)
            return Mi(y.board, c, g, a), { accept: !0 };
          const T = Ei(g);
          return dt(c, T ? Nn(g) : g, T ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        z(o, { skip: c }), e.announce?.(w), q(t.onRefuse, { cardId: c, laneId: null, reason: w });
      } else
        z(o, { skip: c }), m.kind === "outside" && (e.announce?.(`${Z(f)} was not dropped on a lane. It stays where it was.`), q(t.onRefuse, { cardId: c, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (x) {
        x = null, q(t.onPreview, null), z(o);
        return;
      }
      const a = M && o.cards.find((c) => c.id === M.cardId);
      M = null, q(t.onPreview, null), z(o, { skip: we(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Z(a)} stays where it was.`);
    },
    onTextCommit(s, a, c) {
      const p = we(s.id);
      if (!p || I || O) return !1;
      const m = p.kind === "card" ? fi(o.cards.find((N) => N.id === p.key) ?? {}) : null;
      m && (a = a.split(`
`).filter((N) => N.trim() !== m).join(`
`));
      let f = a.replace(/\s+/g, " ").trim();
      const w = p.kind === "lane" ? o.lanes.find((N) => N.id === p.key)?.label : void 0;
      w && f.endsWith("…") && w !== f && w.startsWith(f.slice(0, -1).trimEnd()) && (f = w);
      const g = [], y = oe(o), T = y && p.kind === "card" ? Ae(y).renamed(o, p.key, f) : null;
      T && (f = T.label, g.push(...T.edits));
      const E = p.kind === "lane" ? { laneId: p.key, label: f } : { cardId: p.key, label: f };
      g.unshift(p.kind === "lane" ? { kind: "rename_lane", lane: { id: p.key }, label: f } : { kind: "rename_card", card: { id: p.key }, label: f });
      const R = $e(o, g);
      if ("refused" in R) {
        const { reason: N } = R.refused;
        return e.announce?.(`${c} keeps its name. ${N}`), q(t.onRefuse, { ...p.kind === "lane" ? { laneId: p.key } : { cardId: p.key }, rename: E, reason: N }), !1;
      }
      if (JSON.stringify(R.workshop) === JSON.stringify(o))
        return z(o), !1;
      const K = p.kind === "card";
      return K && e.beginHostStep?.(), o = R.workshop, p.kind === "card" && Se.set(p.key, f), K && e.endHostStep?.(), z(o), e.announce?.(T ? R.report.edits.map((N) => N.said).join(" ") : `${c} renamed to ${f}.`), q(t.onChange, o, { rename: E, ...i ? { edits: g } : {} }), T ? !1 : f;
    },
    onKeyDown(s, a) {
      const c = we(s.id);
      if (I || O || M || x || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (he && (he.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== he.key) && Jo(), he && a.key === "Escape")
        return a.preventDefault(), Jo(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (he && a.key === "Enter") {
        a.preventDefault();
        const w = he.choices[he.at];
        return he = null, q(t.onPreview, null), o = w.next, z(o), e.announce?.(w.done), q(t.onChange, o, { ...c?.kind === "card" ? { cardId: c.key } : {}, edits: w.edits }), !0;
      }
      const p = i?.keyChoices?.(o, Ie(s.id), a.key);
      if (p) {
        a.preventDefault();
        const w = [], g = [];
        for (const E of typeof p == "string" ? [] : p) {
          const R = $e(o, E.edits);
          "refused" in R ? g.push(`${E.said}: ${R.refused.reason}`) : w.push({ ...E, next: R.workshop, done: R.report.edits.map((K) => K.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof p == "string" ? p : g.join(" ")), !0;
        const y = he && he.node === s.id ? (he.at + 1) % w.length : 0;
        he = { node: s.id, key: a.key.toLowerCase(), choices: w, at: y }, z(w[y].next), q(t.onPreview, w[y].next);
        const T = w.length > 1 ? ` (${y + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[y].said}${T} Enter to make it, Escape to cancel.`), !0;
      }
      const m = i?.keyEdit?.(o, Ie(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = $e(o, m);
        if ("refused" in w) {
          e.announce?.(w.refused.reason), q(t.onRefuse, { laneId: w.refused.laneId, ...c?.kind === "card" ? { cardId: c.key } : {}, reason: w.refused.reason });
          const g = m.length === 1 && w.refused.overridable ? Or(m[0]) : null;
          g && Bn(g, o.cards.find((y) => y.id === g)?.laneId ?? "", w.refused.reason, { edit: m[0] });
        } else ft(w.workshop, c?.kind === "card" ? { cardId: c.key } : {});
        return !0;
      }
      if (c?.kind !== "card") return !1;
      const f = o.cards.find((w) => w.id === c.key);
      if (!f) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Ko(f.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Ri())
        return a.preventDefault(), Ko(f.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (U?.cardId !== f.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: y } = U;
        if (U = null, w === null)
          return q(t.onPreview, null), dt(f.id, y), !0;
        const T = o;
        o = g, z(o), Ge(w), q(t.onPreview, null);
        const E = o.lanes.find((R) => R.id === w);
        return e.announce?.(`${Z(f)} moved to ${E.label}. ${Je(o, w)}.`), q(t.onChange, o, { cardId: f.id, laneId: w, ...i ? { edits: i.editsBetween(T, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Ue(), e.announce?.(`Move cancelled. ${Z(f)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => A.get(a.id) === a).map((a) => a.id);
      it = s.length === 1, A.clear(), $.clear(), _.clear(), me.clear(), j.clear(), F.clear(), M = null, U = null, z(O ?? o, { animate: !1 }), s.length === 1 && (xe = xe.then(() => {
        it = !1;
        const a = A.get(s[0]);
        if (!S && a && !(e.getSelectedNodes?.() ?? []).length) {
          const c = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
        }
        pn();
      }));
    }
  };
  Pe.onFreeMove = (s, a) => {
    if (!_n() || s.options?.isComment) return Bt();
    const c = Rn(a), p = Wn(s), m = jn(s), f = o.lanes.filter((y) => !m && an(o, y.id, p) === null).map((y) => y.id), w = c && i?.noteUnder?.(o, on(a), X);
    w && (p.under = w);
    const g = c ? m ?? an(o, c, p) : null;
    se && se.noteId === s.id && se.laneId === c && se.refusal === g || (se = { noteId: s.id, laneId: c, refusal: g, open: f }, We());
  }, Pe.onFreeDrop = (s, a, c) => {
    if (Bt(), !_n() || s.options?.isComment) return;
    const p = Rn(a);
    if (!p) return;
    const m = Wn(s), f = i?.noteUnder?.(o, on(a), X);
    f && (m.under = f), Zt(m, a);
    const w = o.lanes.find((y) => y.id === p), g = jn(s) ?? an(o, p, m);
    return g ? (re(!1), ae = { laneId: p, reason: g, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${Ht(m.label)} can't go in ${w.label}. ${g}`), q(t.onRefuse, { noteId: s.id, laneId: p, reason: g }), "refused") : (qt([{ node: s, offer: m, from: c }], p), "taken");
  }, Pe.onFreeGroupDrop = (s, a, c) => {
    if (Bt(), !_n() || s.some((g) => g.options?.isComment)) return;
    const p = Rn(a);
    if (!p) return;
    const m = o.lanes.find((g) => g.id === p), f = s.map((g) => ({ node: g, offer: Zt(Wn(g), a) })), w = Di(f, p);
    if (w) {
      re(!1), ae = { laneId: p, reason: w, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${Yo(f.map((g) => Ht(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of f) q(t.onRefuse, { noteId: g.id, laneId: p, reason: w });
      return "refused";
    }
    return qt(f.map((g, y) => ({ ...g, from: c?.[y] })), p), "taken";
  }, Pe.onFreeTextCommit = (s) => {
    if (!_n() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, c = { x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 }, p = Rn(c);
    if (!p) return;
    const m = Zt(Wn(s), c), f = o.lanes.find((R) => R.id === p), w = jn(s) ?? an(o, p, m);
    if (!w) {
      qt([{ node: s, offer: m }], p);
      return;
    }
    re(!1), ae = { laneId: p, reason: w, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${Ht(m.label)} can't go in ${f.label}. ${w} It is beside the board.`), q(t.onRefuse, { noteId: s.id, laneId: p, reason: w });
    const { width: g } = qe(o), y = Nn({ x: Y.x + g + 32, y: a.y ?? Y.y, width: a.width ?? 0, height: a.height ?? 0 }), T = Math.round(y.x), E = Math.round(y.y);
    s.position(T, E, () => e.updateSelectionResizeRotate?.(), void 0, gt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [to({ ...s.options, x: T, y: E })] });
  }, Pe.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...Be], lines: (o.lines ?? []).map((s) => ({ ...s })) }), Pe.onUndoRestore = (s, a) => {
    if (S) return;
    const c = new Map((s?.cards ?? []).map((f) => [f.id, f])), p = new Map(s?.pairs ?? []), m = (f) => Be.get(f) ?? p.get(f) ?? f;
    for (const f of a.added) {
      const w = m(f), g = o.cards.find((T) => T.id === w);
      if (!g || c.has(w)) continue;
      o = Q({ ...o, cards: o.cards.filter((T) => T !== g), lines: bn(o.lines, w, f) }), z(o);
      const y = q(t.onChange, o, { cardId: w, cardToNote: { noteId: f }, via: "undo" });
      e.holdTrade?.(f, y), so(y);
    }
    for (const f of a.removed) {
      const w = m(f), g = c.get(w);
      if (!g || o.cards.some((W) => W.id === w)) continue;
      const y = (s?.lines ?? []).filter((W) => W.parentId === w || W.childId === w), T = Ao(o, g), E = {
        id: w,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...y.length ? { lines: y } : {}
      }, R = [g.laneId, ...o.lanes.map((W) => W.id)].find((W) => Kn(o, W, E));
      if (!R) {
        e.announce?.(`${Z(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = qi(Kn(o, R, E), w, s?.cards ?? []), w !== f && Be.set(f, w), z(o);
      const K = o.cards.findIndex((W) => W.id === w), N = o.cards.slice(K + 1).find((W) => W.laneId === R)?.id, H = q(t.onChange, o, { cardId: w, laneId: R, noteToCard: {
        noteId: f,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...N ? { before: N } : {},
        ...y.length ? { lines: bn(y, w, f) } : {}
      }, via: "undo" });
      e.holdTrade?.(f, H), so(H);
    }
    for (const f of c.values()) {
      const w = o.cards.find((T) => T.id === f.id);
      if (!w || w.label === f.label || Se.get(f.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: f.id }, label: f.label }], y = $e(o, g);
      "refused" in y || (o = y.workshop, Se.set(f.id, f.label), z(o), e.announce?.(`${Z(w)} is called ${Z(f)} again.`), q(t.onChange, o, { rename: { cardId: f.id, label: f.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && Ui(s.lines);
  };
  let Ft = !1;
  Pe.onNodeAdded = (s) => {
    S || Ft || A.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (Ft = !0, queueMicrotask(() => {
      Ft = !1, S || We();
    }));
  }, Pe.onLine = (s, a) => {
    S || queueMicrotask(() => {
      S || Hi(s, a);
    });
  };
  const Ni = e.setDragPolicy(Pe), zt = {
    verdict(s, a) {
      if (!_n()) return null;
      const c = Rn(a);
      if (!c) return null;
      const p = Wn(s), m = i?.noteUnder?.(o, on(a), X);
      return m && (p.under = m), { laneId: c, laneLabel: o.lanes.find((f) => f.id === c).label, reason: jn(s) ?? an(o, c, p) };
    },
    take: (s, a, c) => Pe.onFreeDrop?.(s, a, c),
    flash(s, a) {
      S || !o.lanes.some((c) => c.id === s) || (re(!1), ae = { laneId: s, reason: a, timer: setTimeout(() => re(), 1500) }, We());
    }
  };
  qn.has(e) || qn.set(e, /* @__PURE__ */ new Set()), qn.get(e).add(zt);
  const _i = t.onSelect || u || t.onRuleEdit ? e.onSelectionChange?.(() => {
    pn(), dr(), ot === "selected" && gn();
  }) : void 0;
  let at = null;
  const Bo = (s) => {
    const c = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, p = c && A.has(c) ? ar(c) : null;
    p !== at && (at = p, dr());
  };
  u && e.element?.addEventListener?.("pointerover", Bo);
  const Ho = (s) => {
    if (U && Ue(), k && !s?.target?.closest?.("[data-board-pick]") && (k = null, Oe && yn(Oe), queueMicrotask(pn)), Mn = null, nn && (clearTimeout(nn), nn = null), !s || S || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((f) => le(ee.lane(f.id))));
    if ((e.getSelectedNodes?.() ?? []).some((f) => !a.has(f?.id))) return;
    const c = o.lanes.flatMap((f) => [ee.caption(f.id), ee.column(f.id)]).map((f) => A.get(le(f))).filter(Boolean), p = c.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), c, { padding: 0 }) : null, m = p ? we(p.id) : null;
    m && (Mn = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, Go = (s) => {
    const a = Mn;
    Mn = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (nn = setTimeout(() => {
      if (nn = null, S || M || x || !o.lanes.some((p) => p.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const c = A.get(le(ee.lane(a.laneId)));
      c && e.selectNodes?.([c]);
    }, 350));
  }, Uo = () => {
    Mn = null;
  };
  e.element?.addEventListener?.("pointerdown", Ho, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Go, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", Uo, !0), Xi(), z(o, { animate: !1 });
  function qo(s, a, c) {
    const p = o.cards.find((E) => E.id === s);
    if (!p) return { kind: "outside" };
    if (i) {
      const E = on(a), R = i.refusalAt(o, s, M?.grab ?? { x: 0, y: 0 }, E, X);
      if (R && !R.lands) return { kind: "refused", laneId: R.laneId, reason: R.reason, ...R.override && { override: R.override } };
      const { width: K, height: N } = qe(o), H = E.y >= 0 && E.y <= N;
      if (R?.override && H && (E.x < -40 || E.x > K + 40)) return { kind: "refused", laneId: R.laneId, reason: R.reason, override: R.override };
      if (E.x < -40 || E.y < -40 || E.x > K + 40 || E.y > N + 40) return { kind: "outside" };
      let W = o;
      try {
        W = c?.(E) ?? o;
      } catch (ne) {
        console.warn("WORKSHOP: the board kit's chooser threw", ne);
      }
      return JSON.stringify(W) === JSON.stringify(o) ? R ? { kind: "refused", laneId: R.laneId, reason: R.reason, near: !0, ...R.override && { override: R.override } } : { kind: "home" } : { kind: "candidate", laneId: W.cards.find((ne) => ne.id === s)?.laneId ?? p.laneId, next: W, ...R && { said: R.reason } };
    }
    const m = o.lanes.map((E) => A.get(le(ee.column(E.id)))).filter(Boolean), f = e.hitTestNodes(a, m, { padding: 6 }), w = f ? we(f.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === p.laneId) return { kind: "home" };
    const g = cn(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: ze(o, s, w) ?? "That move is not available." };
    if (!c) return { kind: "candidate", laneId: w, next: g };
    let y = null;
    try {
      y = c({ x: a.x - Y.x, y: a.y - Y.y });
    } catch (E) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", E), { kind: "candidate", laneId: w, next: g };
    }
    const T = y?.cards.find((E) => E.id === s)?.laneId;
    return !y || !T || T === p.laneId ? { kind: "home" } : { kind: "candidate", laneId: T, next: y };
  }
  function Ri() {
    return i ? !1 : new Set(Fe(o, { layout: X }).places.map((s) => s.row)).size > 1;
  }
  function Ko(s, a, c = !1) {
    const p = o.cards.find((N) => N.id === s), m = Er(o, s), f = U?.cardId === s && U.laneId === null ? U.side : void 0;
    if (f !== void 0) {
      if (c || a === f) return;
      const N = f > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (Ue(), N.id === p.laneId) {
        Ge(N.id, O ?? o), e.announce?.(`${Z(p)} is back in ${N.label}.`);
        return;
      }
      if (m.includes(N)) {
        const W = cn(o, s, N.id);
        U = { cardId: s, laneId: N.id, next: W }, z(W), Ge(N.id, W), q(t.onPreview, W), e.announce?.(`${Z(p)} to ${N.label}: ${Je(W, N.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const H = ze(o, s, N.id) ?? "That move is not available.";
      re(), ae = { laneId: N.id, reason: H, timer: setTimeout(() => re(), 1500) }, z(O ?? o), Ge(N.id, O ?? o), e.announce?.(`${Z(p)} can't move to ${N.label}. ${H}`), q(t.onRefuse, { cardId: s, laneId: N.id, reason: H });
      return;
    }
    const w = U?.cardId === s ? U.laneId : p.laneId;
    let g;
    if (c) {
      const { places: N } = Fe(o, { layout: X }), H = N.find((W) => W.laneId === w);
      g = N.filter((W) => W.column === H.column && (W.row - H.row) * a > 0).sort((W, ne) => (W.row - ne.row) * a).map((W) => o.lanes.find((ne) => ne.id === W.laneId));
    } else {
      const N = o.lanes.findIndex((H) => H.id === w);
      g = a > 0 ? o.lanes.slice(N + 1) : o.lanes.slice(0, N).reverse();
    }
    const y = g[0] && !m.includes(g[0]) ? g[0] : null, T = y !== null && ve?.cardId === s && ve.laneId === y.id;
    if (ve = null, y && !T) {
      const N = ze(o, s, y.id) ?? "That move is not available.", H = i ? { edit: { kind: "move_card", card: { id: s }, lane: { id: y.id } } } : void 0;
      if (!!t.confirmOverride && !I && !O && !Re() && (i ? !("refused" in $e(o, [{ ...H.edit, override: !0 }], { actor: { by: "check", via: "chat" } })) : Xn(o, s, y.id, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) !== null)) {
        re(), Ue(), ae = { laneId: y.id, reason: N, timer: setTimeout(() => re(), 1500) }, z(O ?? o), Ge(y.id, O ?? o), e.announce?.(`${Z(p)} can't move to ${y.label} by this board's rules. ${N} Move it anyway? Cancel, then press the arrow again to pass over it.`), ve = { cardId: s, laneId: y.id }, Bn(s, y.id, N, H);
        return;
      }
    }
    const E = g.find((N) => m.includes(N)), R = y && E ? `${Z(p)} can't go in ${y.label}: ${ze(o, s, y.id) ?? "that move is not available."} ` : "";
    if (re(), !E) {
      const N = g[0];
      if (!N) {
        if (!c && ao()) {
          const W = xt(o, s);
          if (W) {
            e.announce?.(W), q(t.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          Wi(p, a);
          return;
        }
        e.announce?.(`${Z(p)} has no lane to move to on that side.`);
        return;
      }
      const H = ze(o, s, N.id) ?? "That move is not available.";
      ae = { laneId: N.id, reason: H, timer: setTimeout(() => re(), 1500) }, z(U?.next ?? O ?? o), Ge(N.id, U?.next ?? O ?? o), e.announce?.(`${Z(p)} can't move to ${N.label}. ${H}`), q(t.onRefuse, { cardId: s, laneId: N.id, reason: H });
      return;
    }
    if (E.id === p.laneId) {
      Ue(), Ge(E.id, O ?? o), e.announce?.(`${Z(p)} is back in ${E.label}.`);
      return;
    }
    const K = cn(o, s, E.id);
    U = { cardId: s, laneId: E.id, next: K }, z(K), Ge(E.id, K), q(t.onPreview, K), e.announce?.(`${R}${Z(p)} to ${E.label}: ${Je(K, E.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ge(s, a = o) {
    const c = i ? Qi(a, ee.column(s)) : Fe(a, { layout: X, rows: rr() }).places.find((y) => y.laneId === s), p = e.canvas?.viewbox?.();
    if (!c || !p || !(p.width > 0) || !(p.height > 0)) return;
    const m = 16, f = (y, T, E, R) => T + m * 2 >= R || y - m < E ? y - m - E : y + T + m > E + R ? y + T + m - (E + R) : 0, w = f(Y.x + c.x, c.width, p.x, p.width), g = f(Y.y + c.y, c.height, p.y, p.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function pn() {
    if (!t.onSelect || it) return;
    const s = S ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && A.get(s[0].id) === s[0] ? we(s[0].id) : null;
    k && s.some((w) => !L.has(w.id)) && (k = null, Oe && yn(Oe));
    const [c, p] = k ? k.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : c && p && !a ? { path: { from: c, to: p } } : null, f = m ? JSON.stringify(m) : null;
    f !== Do && (Do = f, q(t.onSelect, m));
  }
  function Jo() {
    he && (he = null, z(o), q(t.onPreview, null));
  }
  function Ue() {
    U && (U = null, q(t.onPreview, null), z(O ?? o));
  }
  function Wi(s, a) {
    const { width: c } = qe(o), p = A.get(le(ee.card(s.id)))?.options, m = p?.width ?? 228, f = Nn({
      x: a > 0 ? Y.x + c + 32 : Y.x - m - 32,
      y: p?.y ?? Y.y,
      width: m,
      height: p?.height ?? 76
    }, a), w = Nr(o, s.id);
    U = { cardId: s.id, laneId: null, side: a, spot: f, next: o }, z(o), q(t.onPreview, w), e.announce?.(`${Z(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Re() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function _n() {
    return !S && !I && !O && !M && !Re() && ao();
  }
  function Bt() {
    se && (se = null, S || We());
  }
  function Rn(s) {
    const a = o.lanes.map((p) => A.get(le(ee.column(p.id)))).filter(Boolean), c = e.hitTestNodes(s, a, { padding: 6 });
    return c ? we(c.id)?.key ?? null : null;
  }
  function Wn(s) {
    const a = s.options ?? {}, c = li({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), p = String(a.text ?? ""), m = p.replace(/\s+/g, " ").trim(), f = {};
    p.trim() !== m && p.length <= 4e3 && (f.text = p.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (f.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (f[g] = Math.round(a[g]));
    if (bo(a.image)) {
      f.image = { src: a.image };
      for (const [g, y] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[y]) && a[y] >= 1 && a[y] <= 2e4 && (f.image[g] = a[y]);
    }
    a.link?.data && Tr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (f.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = ji(s);
    return { id: s.id, label: m, ...c ? { look: c } : {}, ...Object.keys(f).length ? { asNote: f } : {}, ...w.length ? { lines: w } : {} };
  }
  function ji(s) {
    const a = /* @__PURE__ */ new Map(), c = (p) => typeof p == "string" && !!A.get(p) && A.get(p) === e.nodes.one(p);
    for (const p of s.relationships?.getAssociations?.() ?? [])
      (p.targetPoint || !c(p.childId)) && a.set(p.id, Fn(p));
    for (const p of e.nodes?.allNodes ?? [])
      if (!(p === s || c(p.id)))
        for (const m of p.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, Fn(m));
    for (const p of lo(o, s.id)) a.set(p.id, p);
    return [...a.values()];
  }
  function Yo(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function Di(s, a) {
    for (const { node: f } of s) {
      const w = jn(f);
      if (w) return w;
    }
    const c = o.lanes.find((f) => f.id === a), p = Xe(o, a);
    if (c.capacity !== void 0 && !c.station && p + s.length > c.capacity) {
      const f = c.capacity - p;
      return f > 0 ? `It has room for ${f} more ${f === 1 ? "card" : "cards"}.` : `It already holds ${p} of ${c.capacity} ${c.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: f } of s) {
      const w = an(m, a, f);
      if (w) return w;
      m = Kn(m, a, f);
    }
    return null;
  }
  function jn(s) {
    if (s.options?.image && !bo(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !Tr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : Fi(s) ? io : null;
  }
  function mn(s) {
    return !!s && A.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function Fi(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && mn(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !mn(a))) {
        for (const c of a.relationships?.getAssociations?.() ?? []) if (c.childId === s.id && !c.targetPoint) return !0;
      }
    return !1;
  }
  const Ht = (s) => s || "This note", Z = (s) => s.label || "The empty card", Zo = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : ea[a] ?? "shape";
  }, Gt = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Vo = (s) => {
    const a = s.flatMap((c) => {
      const p = Zo(c.asNote?.shape);
      return p ? [{ card: c, word: p }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: c } = a[0];
      return c === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Gt(c)}: drag it off the board to get its ${c} back.`;
    }
    return " " + a.map(({ card: c, word: p }) => p === "shape" ? `${Z(c)} had its own shape` : `${Z(c)} was ${Gt(p)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, zi = (s) => {
    const a = Zo(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Gt(a)} again.` : "";
  };
  function Dn() {
    return !S && !I && !O && !Re() && ba(o);
  }
  function Fn(s) {
    const a = { id: s.id, parentId: s.parentId, childId: s.childId };
    for (const p of [
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
      const m = s[p];
      m != null && m !== "" && (a[p] = m);
    }
    for (const p of ["sourceAnchor", "targetAnchor"]) {
      const m = s[p];
      m && Number.isFinite(m.x) && Number.isFinite(m.y) && (a[p] = { x: m.x, y: m.y });
    }
    const c = s.targetPoint;
    return c && Number.isFinite(c.x) && Number.isFinite(c.y) && (a.targetPoint = { x: c.x, y: c.y }, delete a.targetAnchor), a;
  }
  function Xo(s, a) {
    const c = { ...s };
    return c.showParentArrow = a.showChildArrow ?? !0, c.showChildArrow = a.showParentArrow ?? !1, delete c.sourceAnchor, delete c.targetAnchor, a.targetAnchor && (c.sourceAnchor = a.targetAnchor), a.sourceAnchor && (c.targetAnchor = a.sourceAnchor), c;
  }
  function Qo(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (A.get(s.id) === s) {
      const a = we(s.id);
      return a?.kind === "card" && o.cards.some((c) => c.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || mn(s) ? null : s.id;
  }
  function Ut(s, a) {
    if (s.cards.some((p) => p.id === a)) {
      const p = A.get(le(ee.card(a)));
      return p?.relationships && p.svgGroup ? p : null;
    }
    const c = e.nodes.one(a);
    return c && A.get(a) !== c && !mn(c) && c.svgGroup ? c : null;
  }
  function er(s) {
    const a = [];
    for (const c of s) {
      const p = e.nodes.one(c.parentId);
      if (!p?.relationships || A.get(p.id) === p || p.relationships.hasAssociationId?.(c.id)) continue;
      if (c.targetPoint) {
        const w = p.relationships.addFloatingAssociation(c.targetPoint, Un(c));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(c.childId);
      if (!m || A.get(m.id) === m) continue;
      const f = p.relationships.addAssociation(m, Un(c));
      a.push({ type: "addRelationship", data: { ...f } });
    }
    return a;
  }
  function Bi(s) {
    const a = /* @__PURE__ */ new Set();
    for (const c of s.lines ?? []) {
      if (c.targetPoint) {
        const R = Ut(s, c.parentId);
        if (!R || A.get(R.id) !== R) continue;
        const K = { ...c, parentId: R.id }, N = JSON.stringify(K);
        a.add(c.id);
        const H = me.get(c.id);
        if (H && H.key === N && H.holder === R && !H.other && R.relationships.hasAssociationId?.(c.id)) continue;
        H && e.nodes.one(H.holder.id) === H.holder && H.holder.relationships?.removeAssociation?.(c.id), R.relationships.addFloatingAssociation(c.targetPoint, Un(K)), me.set(c.id, { holder: R, other: null, swapped: !1, key: N });
        continue;
      }
      const p = Ut(s, c.parentId), m = Ut(s, c.childId);
      if (!p || !m || p === m) continue;
      const f = A.get(p.id) !== p, w = f ? m : p, g = f ? p : m, y = f ? Xo({ ...c, parentId: w.id, childId: g.id }, c) : { ...c, parentId: w.id, childId: g.id }, T = JSON.stringify(y);
      a.add(c.id);
      const E = me.get(c.id);
      E && E.key === T && E.holder === w && E.other === g && w.relationships.hasAssociationId?.(c.id) || (E && e.nodes.one(E.holder.id) === E.holder && E.holder.relationships?.removeAssociation?.(c.id), w.relationships.addAssociation(g, Un(y)), me.set(c.id, { holder: w, other: g, swapped: f, key: T }));
    }
    for (const [c, p] of [...me])
      a.has(c) || (e.nodes.one(p.holder.id) === p.holder && p.holder.relationships?.hasAssociationId?.(c) && p.holder.relationships.removeAssociation(c), me.delete(c));
  }
  function lt(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, c = s.id ?? s.childId;
    !a?.relationships || !c || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(c) || !s.id) && a.relationships.removeAssociation(c);
    });
  }
  let zn = null;
  function Hi(s, a) {
    if (s === "addRelationship") {
      if (me.get(a?.id)?.holder.id === a?.parentId) return;
      const c = !!a?.targetPoint, p = e.nodes.one(a?.parentId), m = c ? null : e.nodes.one(a?.childId), f = Qo(p), w = c ? null : Qo(m);
      if (mn(p)) return;
      const g = zn?.lineId === a?.id ? o.lines?.find((K) => K.id === a?.id) : void 0;
      g && (zn = null);
      const y = (K) => {
        lt(a), g && z(O ?? o), e.announce?.(K), q(t.onRefuse, { reason: K, laneId: null });
      };
      if (!Dn()) {
        lt(a), g && z(O ?? o);
        return;
      }
      if (mn(m)) return y(io);
      if (!f || !w && !c) return y(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const T = c ? String(a.childId) : w;
      if (g) {
        const K = o.cards.some((ne) => ne.id === f), N = !c && o.cards.some((ne) => ne.id === w);
        if (!K && !N) return tn({ remove: g.id });
        const H = { ...Fn(a), id: g.id, parentId: f, childId: T }, W = Zn(o, H);
        if (W) return y(W);
        lt(a), tn({ set: H });
        return;
      }
      const E = vi(o, f, T, Fn(a)), R = Zn(o, E);
      if (R) return y(R);
      lt(a), tn({ set: E });
      return;
    }
    if (s === "removeRelationship") {
      const c = [...me].find(([m, f]) => (m === a?.id || !a?.id && f.other?.id === a?.childId) && f.holder.id === a?.parentId)?.[0];
      if (!c) return;
      const p = me.get(c);
      if (me.delete(c), e.nodes.one(p.holder.id) !== p.holder || p.other && e.nodes.one(p.other.id) !== p.other || !Dn())
        return Dn() || S ? void 0 : z(O ?? o);
      zn = { lineId: c }, queueMicrotask(() => {
        S || zn?.lineId !== c || (zn = null, tn({ remove: c }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const c of Array.isArray(a) ? a : [a]) {
        const p = [...me].find(([E, R]) => E === c?.associationId && R.holder.id === c?.id);
        if (!p) continue;
        const [m, f] = p, w = o.lines?.find((E) => E.id === m), g = f.holder.relationships?.getAssociations?.().find((E) => E.id === m);
        if (!w || !g) continue;
        if (!Dn()) {
          z(O ?? o);
          continue;
        }
        const y = Fn(g), T = f.swapped ? Xo({ ...y, id: w.id, parentId: w.parentId, childId: w.childId }, y) : { ...y, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(Gi(T)) !== JSON.stringify(w) && (me.set(m, { ...f, key: "" }), tn({ set: T }));
      }
  }
  function Gi(s) {
    return It({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function tn(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), c = "set" in s ? It(o, s.set) : _r(o, s.remove);
    if (!c || c === o) return;
    e.beginHostStep?.(), o = c, e.endHostStep?.(), z(O ?? o);
    const p = "set" in s ? s.set : a, m = [p.parentId, p.childId].map((g) => o.cards.find((y) => y.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), f = (g) => m[g] || (g === 1 && p.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${f(0)} to ${f(1)} changed.` : p.targetPoint ? `${f(0)} has a line to a point on the canvas.` : `${f(0)} is joined to ${f(1)}.` : `The line from ${f(0)} to ${f(1)} was taken away.`);
    const w = q(t.onChange, o, { line: s });
    so(w, () => {
      if (S || o !== c) return;
      const g = a ? It(o, a) : "set" in s ? _r(o, s.set.id) : null;
      g && (o = g, z(O ?? o));
    });
  }
  function Ui(s) {
    const a = new Map(s.map((p) => [p.id, p])), c = new Map((o.lines ?? []).map((p) => [p.id, p]));
    for (const p of c.keys()) a.has(p) || tn({ remove: p });
    for (const [p, m] of a)
      JSON.stringify(c.get(p)) !== JSON.stringify(m) && Zn(o, m) === null && tn({ set: m });
  }
  function qt(s, a) {
    let c = o;
    const p = /* @__PURE__ */ new Map(), m = s.map(({ node: y, offer: T, from: E }) => {
      let R = T.lines;
      for (const [H, W] of p) R = bn(R, H, W);
      c = Kn(c, a, { ...T, ...R ? { lines: R } : {} });
      const K = c.cards[c.cards.length - 1];
      K.id !== y.id && p.set(y.id, K.id);
      const N = { ...y.options ?? {}, ...E ? { x: E.x, y: E.y } : {} };
      return { node: y, card: K, kept: N, lines: bn(R ?? [], y.id, K.id), under: T.under, day: T.day };
    });
    e.beginHostStep?.(), o = c;
    let f = o;
    for (const { node: y, card: T } of m)
      T.id !== y.id && Be.set(y.id, T.id), Ce.set(le(ee.card(T.id)), { x: y.options?.x ?? 0, y: y.options?.y ?? 0 }), wn(() => e.removeNode(y.id));
    e.endHostStep?.(), z(o), Ki(le(ee.card(m[0].card.id)));
    const w = m.length === 1 && Mr(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && Ji(le(ee.card(w.id)), w.label);
    const g = o.lanes.find((y) => y.id === a);
    e.announce?.(m.length === 1 ? `${Z(m[0].card)} is now a card in ${g.label}. ${Je(o, a)}.${Vo([m[0].card])}` : `${Yo(m.map(({ card: y }) => Z(y)))} are now cards in ${g.label}. ${Je(o, a)}.${Vo(m.map(({ card: y }) => y))}`);
    for (const { node: y, card: T, kept: E, lines: R, under: K, day: N } of m) {
      const H = { cardId: T.id, laneId: a, noteToCard: {
        noteId: y.id,
        label: Ao(o, T),
        ...K && { under: K },
        ...N !== void 0 && { day: N },
        ...T.look ? { look: T.look } : {},
        ...T.asNote ? { asNote: T.asNote } : {},
        ...R.length ? { lines: R } : {}
      } }, W = () => {
        o !== f || !o.cards.some((ke) => ke.id === T.id) || (o = Q({ ...o, cards: o.cards.filter((ke) => ke.id !== T.id), lines: bn(o.lines, T.id, y.id) }), f = o, z(o));
      }, ne = q(t.onChange, o, H);
      e.holdTrade?.(y.id, ne), tr(ne, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: y.id, isComment: !1 } }]);
      }, () => {
        if (!S) {
          if (W(), !e.nodes.one(E.id)) {
            e.beginHostStep?.();
            const ke = wn(() => e.addNode({ ...E }));
            ke && (ke.announcedByCreator = !0), e.endHostStep?.();
            const Hn = bn(R, T.id, y.id).filter((de) => !o.cards.some((Gn) => Gn.id === de.parentId || Gn.id === de.childId));
            ke?.ready?.then?.(() => {
              S || wn(() => er(Hn));
            });
          }
          e.announce?.(`${Z(T)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        S || (W(), e.keepTrade?.(y.id), e.announce?.(`Someone else put ${Z(T)} on the board first.`));
      });
    }
  }
  function nr(s, a) {
    const c = o.cards.find((E) => E.id === s), p = $.get(le(ee.card(s))) ?? {}, m = ii(c), f = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = (tt.cornerRadius ?? 0) > 0, g = c.asNote, y = Mr(o, c), T = {
      id: f,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: g?.width ?? p.width ?? 228,
      height: g?.height ?? p.height ?? 76,
      text: y,
      shape: g?.shape ?? (w ? "roundedrectangle" : "rectangle"),
      backgroundColor: c.look?.backgroundColor ?? p.backgroundColor,
      fontColor: c.look?.textColor ?? p.foregroundColor,
      fontSize: c.look?.fontSize ?? p.fontSize,
      borderColor: c.look?.borderColor ?? p.borderColor,
      borderWidth: c.look?.borderWidth ?? p.borderWidth,
      ...c.look?.fontFamily ?? p.fontFamily ? { fontFamily: c.look?.fontFamily ?? p.fontFamily } : {}
    };
    g?.image && Object.assign(T, {
      image: g.image.src,
      ...g.image.width ? { imageOrigWidth: g.image.width } : {},
      ...g.image.height ? { imageOrigHeight: g.image.height } : {}
    }), g?.link && (T.link = { ...g.link });
    for (const E of Object.keys(T)) T[E] === void 0 && delete T[E];
    return { id: f, note: T };
  }
  function dt(s, a, c = "", p = !1) {
    const m = o.cards.find((de) => de.id === s), f = o.lanes.find((de) => de.id === m.laneId), w = o.cards.findIndex((de) => de.id === s), g = o.cards.slice(w + 1).find((de) => de.laneId === m.laneId)?.id, { id: y, note: T } = nr(s, a), E = m.asNote, R = lo(o, s), { leave: K } = Aa(o, s, y), N = Nr(o, s, y);
    e.beginHostStep?.(), o = N;
    const H = o;
    y !== s ? Be.set(y, s) : Be.delete(y);
    const W = wn(() => e.addNode(T));
    W && (W.announcedByCreator = !0), e.endHostStep?.(), z(o);
    const ne = Promise.resolve(W?.ready).then(() => S || !W || e.nodes.one(y) !== W ? [] : wn(() => er(K))).catch(() => []);
    W?.ready?.then?.(() => {
      if (S || e.nodes.one(y) !== W) return;
      const de = () => e.selectNodes?.([W]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(de) : de();
    }), p || e.announce?.(`${Z(m)} is now a note on the canvas.${c} ${f.label}: ${Je(o, f.id)}.${zi(E?.shape)}`);
    const ke = () => {
      e.nodes.one(y) === W && (e.beginHostStep?.(), wn(() => e.removeNode(y)), e.endHostStep?.());
    }, Hn = q(t.onChange, o, { cardId: s, cardToNote: { noteId: y } });
    return e.holdTrade?.(y, Hn), tr(Hn, () => {
      ne.then((de) => {
        W && e.nodes.one(y) === W && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: to(W.options) } }, ...de]);
      });
    }, () => {
      if (!S) {
        if (ke(), o === H && !o.cards.some((de) => de.id === s)) {
          const de = {
            id: s,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ...R.length ? { lines: R } : {}
          }, Gn = Kn(o, m.laneId, de, g);
          Gn && (o = Gn, z(o));
        }
        e.announce?.(`${Z(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      S || (ke(), e.keepTrade?.(y), e.announce?.(`Someone else took ${Z(m)} off the lanes first.`));
    }), { added: W, answer: Hn };
  }
  function qi(s, a, c) {
    const p = c.map((y) => y.id), m = p.indexOf(a), f = s.cards.find((y) => y.id === a);
    if (m < 0 || !f) return s;
    const w = s.cards.filter((y) => y !== f), g = w.findIndex((y) => p.indexOf(y.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, f), Q({ ...s, cards: w });
  }
  function Ki(s) {
    xe = xe.then(() => {
      const a = A.get(s);
      if (S || !a) return;
      const c = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(c) : c();
    });
  }
  function Ji(s, a) {
    xe = xe.then(() => {
      const c = A.get(s);
      S || I || !c?.editor?.startInline || c.editor.startInline({ text: a, caret: "all" });
    });
  }
  function wn(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function tr(s, a, c, p) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((f) => {
      f === !0 ? a() : f === !1 ? c() : f === "taken" && p();
    }, () => c());
    e.holdUntil?.(m);
  }
  function Bn(s, a, c, p) {
    if (!t.confirmOverride || I || O || Re()) return;
    const m = { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }, f = (N, H) => {
      if (!p) {
        const ne = Xn(N, s, a, H);
        return ne && { next: ne };
      }
      const W = $e(N, [{ ...p.edit, override: !0 }], { actor: { by: H.by, via: "chat" }, now: H.at });
      return "refused" in W ? null : { next: W.workshop, said: W.report.edits.map((ne) => ne.said).join(" ") };
    }, w = f(o, m);
    if (!w) return;
    const g = o.cards.find((N) => N.id === s), y = o.lanes.find((N) => N.id === a);
    if (!g) return;
    const T = w.next.cards.find((N) => N.id === s)?.override?.sentence ?? c, E = p?.to ?? (p && i?.overrideWords?.(o, p.edit));
    let R;
    const K = { cardId: s, laneId: a, card: g.label, lane: y?.label ?? "", reason: T, ...E && { to: E } };
    try {
      R = t.confirmOverride(K);
    } catch (N) {
      console.error("WORKSHOP: confirmOverride threw", N);
      return;
    }
    Promise.resolve(R).then((N) => {
      if (N !== !0 || S || I || O || Re()) return;
      const H = o.cards.find((ke) => ke.id === s), W = H && f(o, { by: q(t.overrideBy) || "You", at: (/* @__PURE__ */ new Date()).toISOString() });
      if (!H || !W) {
        e.announce?.(`${H ? Z(H) : "That card"} can't be moved ${E ?? "to " + (y?.label ?? "there")} now.`);
        return;
      }
      o = W.next, z(o), e.announce?.(W.said ?? `${Z(H)} moved to ${y?.label ?? ""} anyway. ${T}`);
      const ne = o.cards.find((ke) => ke.id === s)?.laneId ?? a;
      q(t.onChange, o, { cardId: s, laneId: ne, override: !0, reason: T, ...p && { edits: [{ ...p.edit, override: !0 }] } });
    }, () => {
    });
  }
  function Yi(s, a, c) {
    re(!1), ae = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => re(), 1500) }, z(o, { skip: a.cardId });
    const p = o.lanes.find((m) => m.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move ${c ?? "to " + (p?.label ?? "that lane")}. ${a.reason}`), q(t.onRefuse, a);
  }
  function re(s = !0) {
    ae && (clearTimeout(ae.timer), ae = null, s && !S && We());
  }
  function We() {
    z(M && M.outcome.kind === "candidate" ? M.outcome.next : U?.next ?? O ?? o, { skip: M?.cardId });
  }
  function or(s) {
    const a = cr(s, rr()), c = new Map(a.map((f) => [f.options.id, f.options])), p = (f, w, g, y = !1) => {
      const T = c.get(ee.column(f));
      T && (T.borderColor = w, T.borderWidth = g, delete T.borderStyle);
      const E = y && c.get(ee.lane(f));
      E && (E.borderColor = w, E.borderWidth = g);
    }, m = M?.cardId ?? U?.cardId;
    if (Ee = /* @__PURE__ */ new Map(), m) {
      const f = o.cards.find((y) => y.id === m)?.laneId, w = Er(o, m);
      if (!i || i.laneCues)
        for (const y of w) y.id !== f && (p(y.id, Lr, 2), Ee.set(y.id, "open"));
      if (i?.laneCues) {
        for (const y of o.lanes) if (!w.includes(y)) {
          const T = c.get(ee.column(y.id));
          T && (T.backgroundColor = "#e9e8e2"), Ee.set(y.id, "closed");
        }
      }
      const g = M ? M.outcome : U?.laneId ? { kind: "candidate", laneId: U.laneId } : null;
      g?.kind === "candidate" && (p(g.laneId, Cr, 3, !0), Ee.set(g.laneId, "over")), g?.kind === "refused" && (p(g.laneId, ro, 3), Ee.set(g.laneId, "refused"));
    }
    if (se && !m) {
      for (const f of se.open) f !== se.laneId && (p(f, Lr, 2), Ee.set(f, "open"));
      se.laneId && !se.refusal && (p(se.laneId, Cr, 3, !0), Ee.set(se.laneId, "over")), se.laneId && se.refusal && (p(se.laneId, ro, 3), Ee.set(se.laneId, "refused"));
    }
    if (U?.laneId === null && U.spot) {
      const f = c.get(ee.card(U.cardId));
      f && (f.xPos = U.spot.x, f.yPos = U.spot.y);
    }
    if (ae) {
      Ee.set(ae.laneId, "refused"), p(ae.laneId, ro, 3, !0);
      const f = c.get(ee.caption(ae.laneId));
      if (f && (f.text = ae.reason, f.foregroundColor = "#b42318", !i)) {
        const w = c.get(ee.column(ae.laneId));
        w && (f.xPos = w.xPos + 6, f.width = w.width - 12, f.height = 30, f.vectorPath = ln(f.width, 30, 0), f.backgroundColor = "transparent");
      }
    }
    if (jt = /* @__PURE__ */ new Set(), O && s === O) {
      const f = (g, y) => JSON.stringify(g) === JSON.stringify(y), w = (g) => {
        const y = c.get(g);
        y && (y.borderStyle = "dashed", y.borderColor = Qs, y.borderWidth = 2, jt.add(le(g)));
      };
      for (const g of s.cards) f(g, o.cards.find((y) => y.id === g.id)) || w(ee.card(g.id));
      for (const g of s.lanes) f(g, o.lanes.find((y) => y.id === g.id)) || w(ee.lane(g.id));
    }
    for (const f of a) {
      f.options.id = le(f.options.id);
      for (const w of f.relationships.associations)
        w.parentId = le(w.parentId), w.childId = le(w.childId);
    }
    return a;
  }
  function rr() {
    return M || U ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function z(s, a = {}) {
    if (S) return;
    ye = a.layout ?? X, He = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const c = or(s), p = [];
    for (const { options: f } of c) {
      const w = f.id;
      if (A.has(w)) continue;
      const g = Ce.get(w);
      Ce.delete(w);
      const y = g && a.animate !== !1 && !gt() ? { ...f, xPos: g.x, yPos: g.y } : f, T = e.nodes.add(Ns(y));
      A.set(w, T), $.set(w, { ...y }), T.ready && p.push(T.ready.then(() => {
        if (A.get(w) !== T) return;
        T.applyGovernance?.(), zo(w) && T.toBack?.(!1), we(w)?.kind === "handle" && T.svgGroup?.front?.();
        const E = ur(He?.model ?? s, w);
        E && T.svgGroup?.node?.setAttribute("aria-label", E);
      }).catch(() => {
      }));
    }
    const m = He;
    xe = Promise.all([xe, ...p]).then(() => {
      S || He !== m || Zi(or(m.model), m);
    }).catch((f) => console.warn("WORKSHOP: could not draw the workshop", f));
  }
  function Zi(s, a) {
    const c = new Set(s.map((m) => m.options.id)), p = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [f, w] of [...A]) {
        if (c.has(f)) continue;
        for (const [y, T] of [..._])
          T.parentId !== f && T.childId !== f || (T.parent.relationships?.removeAssociation(y), _.delete(y));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), A.delete(f), $.delete(f);
        const g = F.get(f);
        g && (F.delete(f), j.delete(g)), e.nodes.remove(f);
      }
      for (const { options: f } of s) {
        const w = f.id, g = A.get(w);
        if (!g?.svgGroup) continue;
        const y = $.get(w) ?? {}, T = g.editor?.isInlineEditing?.();
        (f.fontSize !== y.fontSize || f.foregroundColor !== y.foregroundColor || f.fontWeight !== y.fontWeight) && (g.options.fontSize = f.fontSize, g.options.fontColor = f.foregroundColor, g.options.fontWeight = f.fontWeight, g.applyTextStyle?.()), (f.width !== y.width || f.height !== y.height) && (f.vectorPath ? (g.options.width = f.width, g.options.height = f.height, g.setShape?.(g.options.shape, f.vectorPath), zo(w) && g.toBack?.(!1)) : g.setSize?.(f.width, f.height)), f.text !== y.text && !T && g.setText?.(f.text), f.backgroundColor !== y.backgroundColor && g.setColors?.(f.backgroundColor), (f.borderColor !== y.borderColor || f.borderWidth !== y.borderWidth || f.borderStyle !== y.borderStyle) && (g.options.borderColor = f.borderColor, g.options.borderWidth = f.borderWidth, g.options.borderStyle = f.borderStyle, g.applyBorder?.());
        const E = f.xPos !== y.xPos || f.yPos !== y.yPos || Math.abs((g.options.x ?? 0) - f.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - f.yPos) > 0.5;
        if (w !== (a.skip && le(ee.card(a.skip))) && w !== (a.grip && le(a.grip)) && E) {
          const N = a.animate && !gt() ? 180 : 0, H = p.includes(g) ? () => {
            !S && A.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          H && N && p.length === 1 && g.resizeRotate?.disable?.(), g.position(f.xPos, f.yPos, H, void 0, N);
        }
        const R = ur(a.model, w);
        R && g.svgGroup.node.getAttribute("aria-label") !== R && g.svgGroup.node.setAttribute("aria-label", R), jt.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", Le), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", D);
        const K = we(w);
        if (K?.kind === "column") {
          const N = Ee.get(K.key);
          N ? g.svgGroup.node.setAttribute("data-workshop-drop", N) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        K?.kind === "handle" && g.svgGroup.front?.(), $.set(w, { ...f });
      }
      const m = /* @__PURE__ */ new Map();
      for (const f of s) for (const w of f.relationships.associations) m.set(w.id, w);
      for (const [f, w] of [..._])
        m.has(f) && A.get(w.parentId) === w.parent && A.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(f), _.delete(f));
      for (const [f, w] of m) {
        if (_.has(f)) continue;
        const g = A.get(w.parentId), y = A.get(w.childId);
        !g?.relationships || !y?.svgGroup || (g.relationships.addAssociation(y, Un(w)), _.set(f, { parentId: w.parentId, childId: w.childId, parent: g, child: y }));
      }
      Bi(a.model);
    }), yn(a.model), Kt = a.model, Jt(), e.notifyNodeChanged?.();
  }
  let Kt = null;
  function ct() {
    return !!ye.narrow || ye.lanesPerRow === 1;
  }
  function ir() {
    let s;
    try {
      s = Na(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: ye, focused: Le, draft: D, scale: C, tagScale: b, narrow: ct(), room: s };
  }
  function sr() {
    if (J) return [1, 1];
    const s = Vt(), a = Zr(s);
    return [a, Math.round(po(s, ct() && !D, a) * 20) / 20];
  }
  function Jt() {
    if (!h || S) return;
    [C, b] = sr();
    const s = Kt ?? o, a = i ? i.places(s, ye) : Fe(s, { layout: ye }), c = i || s.lanes[0]?.station ? void 0 : a.places;
    let p = null;
    for (const w of A.values()) {
      const g = w.svgGroup?.node;
      g?.parentNode && (!p || g.compareDocumentPosition(p) & 4) && (p = g);
    }
    h.draw({
      board: s,
      scope: r,
      origin: Y,
      size: { width: a.width, height: a.height },
      ...ir(),
      places: c,
      under: p,
      ...t.onFocusDone && { onDone: () => q(t.onFocusDone) }
    });
    const m = i ? Ps(a.parts, a.width, a.height).places : void 0;
    Dt = { places: c?.map((w) => ({ ...w, ...$i(s, w, tt) })) ?? m, width: a.width, height: a.height }, gn();
  }
  function Vi() {
    return (S ? [] : e.getSelectedNodes?.() ?? []).some((a) => A.get(a.id) === a);
  }
  function gn() {
    const s = ri, a = Kt ?? o;
    if (!!!(s && Dt && !S && !I && !D && !J && !O && ot !== "off" && (ot === "always" || Le || Vi()))) {
      en?.remove(), en = null;
      return;
    }
    let p;
    try {
      p = s.controls(a, Dt, { scale: Math.min(2, C), finger: ct() });
    } catch {
      p = [];
    }
    en ? en.update(p, Y) : en = s.draw(e, r ?? "main", p, {
      origin: Y,
      announce: (m) => e.announce?.(m),
      onRuleEdit: (m, f) => {
        if (S || I || !t.onRuleEdit) return !1;
        const w = q(t.onRuleEdit, m, f);
        return w instanceof Promise ? w.then(Boolean, () => !1) : !!w;
      }
    });
  }
  function Xi() {
    const s = e.canvas?.node, a = sr;
    if ([C, b] = a(), J || !h || !s || typeof MutationObserver > "u") return;
    let c = null;
    const p = new MutationObserver(() => {
      c && clearTimeout(c), c = setTimeout(() => {
        c = null;
        const [m, f] = a();
        S || m === C && f === b || (C = m, b = f, Jt());
      }, 120);
    });
    p.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), v = () => {
      p.disconnect(), c && clearTimeout(c);
    };
  }
  let Oe = null;
  function ar(s) {
    const a = we(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, Ie(s)) ?? null : null;
  }
  function lr() {
    if (x) return i?.cardOfPart?.(o, x.name) ?? null;
    if (M) return M.cardId;
    if (at) return at;
    const s = S ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && A.get(s[0].id) === s[0] ? ar(s[0].id) : null;
  }
  let Yt = null;
  function dr() {
    S || !u || !Oe || lr() !== Yt && yn(Oe);
  }
  function yn(s) {
    if (u) {
      Oe = s, Yt = lr();
      const a = o.lanes.map((m) => A.get(le(ee.column(m.id)))?.svgGroup?.node).reduce((m, f) => f && (!m || m.compareDocumentPosition(f) & 4) ? f : m, null), c = e.canvas?.viewbox?.(), p = c && [c.x, c.y, c.width, c.height].every(Number.isFinite) ? { x: c.x - Y.x, y: c.y - Y.y, width: c.width, height: c.height } : null;
      u.draw(o, s === o ? null : s, {
        origin: Y,
        layout: ye,
        above: a,
        view: p,
        announce: (m) => e.announce?.(m),
        focus: Yt,
        boardFocused: Le,
        picked: k,
        onPick: ts,
        gripSize: Pn,
        clamp: x?.last?.clampedReason ? { name: x.name, text: x.last.clampedReason } : M?.outcome.kind === "candidate" && M.outcome.said ? { name: "card-" + M.cardId, text: M.outcome.said } : !x && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!x?.last?.refusal || !x && !!pe,
        onUnlink: (m, f) => {
          if (I || O || M || x || Re()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: f }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: f } }, g = $e(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : ft(g.workshop, o.lanes[0]?.station ? { laneId: f } : { cardId: m });
        }
      });
    }
  }
  function on(s) {
    return { x: s.x - Y.x, y: s.y - Y.y };
  }
  function Zt(s, a) {
    const c = i?.noteDay?.(o, on(a), ye);
    return typeof c == "number" && Number.isFinite(c) && (s.day = c), s;
  }
  function qe(s) {
    return i ? i.places(s, ye) : { ...Fe(s, { layout: X }), parts: [] };
  }
  function Qi(s, a) {
    const c = i.places(s, ye).parts.find((p) => p.name === a);
    return c ? { x: c.x, y: c.y, width: c.width, height: c.height } : void 0;
  }
  function Vt() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function es() {
    rt?.(), rt = null, Pn = oo(Vt());
    const s = e.canvas?.node;
    if (!ut() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const c = () => {
      if (a = null, S || !ut()) return;
      if (x || M) {
        a = setTimeout(c, 250);
        return;
      }
      const m = oo(Vt());
      Math.abs(m - Pn) < 2 || (Pn = m, z(O ?? o));
    }, p = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(c, 200);
    });
    p.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), rt = () => {
      p.disconnect(), a && clearTimeout(a);
    };
  }
  function ut() {
    return !i && !!o.lanes[0]?.station && Le && !I && !O && !Re();
  }
  function ns(s) {
    const a = ei(s);
    if (!a || !ut()) return null;
    const c = o;
    return (p) => {
      const m = Js(c, p), f = Zs(c, a, a.kind === "link" && m === a.from ? null : m);
      return f.next ? { next: f.next } : { next: c, clampedReason: f.refusal, refusal: f.refusal };
    };
  }
  function ts(s) {
    if (S || Le) return;
    const a = e.getSelectedNodes?.() ?? [];
    L = new Set(a.map((f) => f.id)), k = s, a.length && e.clearSelection?.(), Oe && yn(Oe), pn();
    const [c, p] = s.split(">"), m = (f) => o.lanes.find((w) => w.id === f)?.label ?? f;
    e.announce?.(`Path from ${m(c)} to ${m(p)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function cr(s, a) {
    if (!i) {
      const c = Ma(s, { native: !0, origin: Y, rows: a, layout: X, style: tt }).nodes;
      return ut() ? [...c, ...oi(o, Y, Pn)] : c;
    }
    return i.notes(s, ye, Y, tt);
  }
  function ft(s, a, c) {
    const p = i ? i.editsBetween(o, s) : Vs(o, s);
    if (!p.length) return !1;
    const m = $e(o, p);
    return "refused" in m ? (e.announce?.(m.refused.reason), q(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, z(o, { skip: c }), e.announce?.(m.report.edits.map((f) => f.said).join(" ")), q(t.onChange, o, { ...a, edits: p }), !0);
  }
  function ur(s, a) {
    const c = we(a);
    if (c?.kind === "lane" || c?.kind === "caption") {
      if (c.kind === "caption" && s.lanes.some((m) => m.station)) return null;
      const p = s.lanes.find((m) => m.id === c.key);
      return p ? `${p.label}, ${Je(s, p.id)}` : null;
    }
    if (c?.kind === "card") {
      const p = s.cards.find((f) => f.id === c.key), m = p && s.lanes.find((f) => f.id === p.laneId);
      return p && m ? `${p.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return c?.kind === "handle" ? i ? i.label?.(s, Ie(a)) ?? null : Ys(s, Ie(a)) : null;
  }
  function Xt(s, a) {
    const c = cr(s).find((p) => p.options.id === a)?.options;
    return c ? { x: c.xPos, y: c.yPos } : null;
  }
  function rn() {
    (M || x) && e.cancelGovernedDrag?.("host"), M = null, x = null, U && (U = null, q(t.onPreview, null)), re(!1);
  }
  return {
    toCanvas(s) {
      if (S || I || Re()) return "This workshop is view-only here.";
      if (!o.cards.some((f) => f.id === s)) return "That card is no longer on the board.";
      const a = xt(o, s);
      if (a) return a;
      U && Ue(), O && (rn(), O = null, z(o), e.refreshGovernance?.());
      const { width: c } = qe(o), p = A.get(le(ee.card(s)))?.options, m = o.cards.find((f) => f.id === s);
      return dt(s, Nn({
        x: Y.x + c + 32,
        y: p?.y ?? Y.y,
        width: m?.asNote?.width ?? p?.width ?? 228,
        height: m?.asNote?.height ?? p?.height ?? 76
      })), null;
    },
    get value() {
      return o;
    },
    get origin() {
      return { ...Y };
    },
    get layout() {
      return { ...X };
    },
    get bounds() {
      const { width: s, height: a } = qe(o);
      return { x: Y.x, y: Y.y, width: s, height: a };
    },
    get frame() {
      const { width: s, height: a } = qe(o);
      if (!h) return { x: Y.x, y: Y.y, width: s, height: a };
      const c = Xr(o, { width: s, height: a }, { ...ir(), scale: 1, tagScale: po(1, ct() && !D) });
      return { x: Y.x + c.x, y: Y.y + c.y, width: c.width, height: c.height };
    },
    get focused() {
      return Le;
    },
    setFocused(s) {
      if (S) return;
      const a = Le;
      Le = !!s;
      for (const c of A.values()) c.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Le);
      a !== Le && (k && (k = null, queueMicrotask(pn)), !i && o.lanes[0]?.station ? (rn(), es(), z(O ?? o)) : Oe && yn(Oe), Jt());
    },
    setControls(s) {
      S || (ot = s === "always" || s === "selected" ? s : "off", gn());
    },
    setLayout(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = $r(s);
      i ? i.places(o, a) : Fe(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(X) && (rn(), X = a, z(O ?? o));
    },
    whenDrawn: () => xe,
    update(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = Q(s);
      rn(), o = a;
      const c = I;
      I = l || d(o), z(O ?? o), I !== c && e.refreshGovernance?.();
    },
    preview(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = s ? Q(s) : null;
      rn(), O = a, gn(), z(O ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const c = o.lanes.find((p) => p.id === s);
      S || !c || (re(!1), ae = { laneId: s, reason: a, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${c.label}: ${a}`));
    },
    setReadOnly(s) {
      l = !!s;
      const a = l || d(o);
      S || I === a || (rn(), I = a, gn(), z(O ?? o), e.refreshGovernance?.());
    },
    destroy() {
      S || (rn(), S = !0, qn.get(e)?.delete(zt), rt?.(), v?.(), h?.destroy(), go.delete(Fo), en?.remove(), en = null, pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", Ho, !0), nn && clearTimeout(nn), e.element?.ownerDocument?.removeEventListener?.("pointerup", Go, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", Uo, !0), _i?.(), u && e.element?.removeEventListener?.("pointerover", Bo), e.withPolicyAuthority(() => {
        for (const [s, a] of me) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of _) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of A)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), _.clear(), me.clear(), A.clear(), $.clear(), j.clear(), F.clear(), Ni(), u?.destroy(), it = !1, pn(), e.notifyNodeChanged?.());
    }
  };
}
function q(e, ...n) {
  try {
    return e?.(...n);
  } catch (t) {
    console.error("WORKSHOP: a host callback threw", t);
    return;
  }
}
function so(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function Or(e) {
  const n = "card" in e ? e.card : null;
  return n && typeof n == "object" && typeof n.id == "string" ? n.id : null;
}
function oa(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function $r(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function ra(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const ia = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function oe(e) {
  return ia.includes(e.kind) ? e.kind : void 0;
}
function ge(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Te(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function sa(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Mt(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Mt(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const Nt = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function yo(e) {
  if (typeof e != "string" || !Nt.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function ii(e) {
  return e.noteId ?? e.id;
}
function _t(e) {
  const n = Mt(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function si(e) {
  const n = ge(e);
  let t;
  try {
    t = new URL(Te(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (t.protocol !== "https:" || t.username || t.password || t.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: t.href, alt: Te(n.alt, 240) };
}
function Ne(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const ai = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, aa = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function ko(e) {
  const n = ge(e), t = {}, r = (i) => {
    if (typeof i != "string" || !ai.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, d, u) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < d || i > u) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !aa.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function li(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        ko({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return ko(n);
}
function bo(e) {
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
function Tr(e) {
  try {
    return !!$t({ link: e });
  } catch {
    return !1;
  }
}
function $t(e) {
  const n = ge(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = ge(n.image);
    if (!bo(r.src)) throw new Error("A card keeps a picture by its web address only.");
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
    if (!(typeof o == "string" ? o.length <= 2048 : !!o && typeof o == "object" && !Array.isArray(o) && JSON.stringify(o).length <= 2048 && Object.values(o).every((d) => typeof d == "string")) || r.type !== void 0 && (typeof r.type != "string" || !/^[A-Za-z]{1,40}$/.test(r.type)) || r.show !== void 0 && typeof r.show != "boolean") throw new Error("A card keeps a link as a note does.");
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
const On = 96, la = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, da = ["solid", "dashed", "dotted"], ca = 1e7;
function $n(e) {
  const n = ge(e);
  if (typeof n.id != "string" || !la.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: yo(n.parentId), childId: yo(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, d) => {
    const u = n[o];
    if (u != null) {
      if (typeof u != "number" || !Number.isFinite(u) || u < i || u > d) throw new Error("A line's look is out of range.");
      t[o] = u;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !ai.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!da.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = ge(n.targetPoint), i = (d) => typeof d == "number" && Number.isFinite(d) && Math.abs(d) <= ca;
    if (!i(o.x) || !i(o.y) || Object.keys(o).some((d) => d !== "x" && d !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    t.targetPoint = { x: Math.round(o.x * 100) / 100, y: Math.round(o.y * 100) / 100 };
  }
  for (const o of ["sourceAnchor", "targetAnchor"]) {
    if (o === "targetAnchor" && t.targetPoint) continue;
    const i = n[o];
    if (i == null) continue;
    const d = ge(i), u = (h) => typeof h == "number" && Number.isFinite(h) && h >= 0 && h <= 1;
    if (!u(d.x) || !u(d.y) || Object.keys(d).some((h) => h !== "x" && h !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    t[o] = { x: d.x, y: d.y };
  }
  return t;
}
function ua(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map($n).map((r) => di(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (Ye(t.map((r) => r.id), "line ID"), t.length > On) throw new Error(`A workshop holds up to ${On} lines.`);
  return t;
}
function di(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function Ye(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Mo({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function fa(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const Cn = (e) => "lane-" + e, Ve = (e) => "card-" + e, Tt = (e) => "image-" + e;
function cl(e, n = {}) {
  const t = fa(e), r = ee.of(n.scope);
  return Mo(e).map((o) => {
    const i = e.cards.filter((h) => h.laneId === o.id), d = t.filter((h) => h.laneId === o.id), u = [r.lane(o.id)];
    return o.station?.image && u.push(r.image(o.id)), { lane: o, cards: i, signals: d, nodeIds: [...u, ...i.map((h) => r.card(h.id))] };
  });
}
const No = 5, Jn = 24, vo = 3;
function ha(e, n, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A move made anyway says who made it, when, and past which rule.");
  const r = e, o = (d, u) => typeof d == "string" && d.trim().length > 0 && d.length <= u && !/[\u0000-\u001f\u007f<>]/.test(d), i = r.was === void 0 ? void 0 : pa(r.was);
  if (!o(r.by, 80) || !o(r.at, 40) || Number.isNaN(Date.parse(r.at)) || !o(r.sentence, 300) || typeof r.from != "string" || !n.includes(r.from) || r.from === t && !i || Object.keys(r).some((d) => !["by", "at", "sentence", "from", "was"].includes(d)))
    throw new Error("A move made anyway says who made it, when, past which rule, and the lane it came from.");
  return { by: r.by, at: r.at, sentence: r.sentence, from: r.from, ...i && { was: i } };
}
function pa(e) {
  const n = () => new Error("A move made anyway says what it changed as it was before.");
  if (!e || typeof e != "object" || Array.isArray(e)) throw n();
  const t = e, r = Object.keys(t);
  if (!r.length || r.some((i) => !["lag", "duration", "parentId"].includes(i))) throw n();
  const o = {};
  for (const i of ["lag", "duration"]) {
    if (t[i] === void 0) continue;
    const d = t[i];
    if (typeof d != "number" || !Number.isInteger(d) || Math.abs(d) > 1e3) throw n();
    o[i] = d;
  }
  if (t.parentId !== void 0) {
    if (t.parentId !== null && (typeof t.parentId != "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(t.parentId))) throw n();
    o.parentId = t.parentId;
  }
  return o;
}
function Q(e) {
  const n = ge(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !oe(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = oe(n), o = r ? Ae(r) : void 0, i = { id: Ne }, d = Te(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > No)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const u = o?.cards ?? [Jn, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > u[0]) throw new Error(u[1]);
  const h = n.lanes.map((k) => {
    const L = ge(k), x = { id: Ne(L.id), label: Te(L.label) };
    if (L.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (L.capacity !== void 0) {
      const O = t ? 576 : 24;
      if (typeof L.capacity != "number" || !Number.isInteger(L.capacity) || L.capacity < 1 || L.capacity > O)
        throw new Error(`Lane capacity must be a whole number from 1 to ${O}.`);
      x.capacity = L.capacity;
    }
    if (o?.readLane?.(L, x, i), L.station !== void 0) {
      const O = ge(L.station), D = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= vo)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray(O.next) || O.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const J = O.next.map(Ne);
      Ye(J, "onward stop"), x.station = { column: D(O.column), row: D(O.row), next: J, outcome: Te(O.outcome, 160) }, O.image !== void 0 && (x.station.image = si(O.image));
    }
    return x;
  }), C = h.map((k) => k.id);
  if (Ye(C, "lane ID"), r && h.some((k) => k.station)) throw new Error("A business board has no map stations.");
  if ((t || h.some((k) => k.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (h.some((k) => k.station) && n.cards.every((k) => k?.free === !0))
    throw new Error("A map needs at least one token.");
  if (h.some((k) => k.station)) {
    if (!h.every((k) => k.station)) throw new Error("Give every station on the map a position.");
    Ye(h.map((k) => k.station.column + "," + k.station.row), "map position");
    for (const k of h)
      if (k.station.next.some((L) => L === k.id || !C.includes(L))) throw new Error("Connect each stop to another station on this map.");
  }
  const b = n.cards.map((k) => {
    const L = ge(k), x = { id: Ne(L.id), label: r ? Te(L.label) : sa(L.label), laneId: Ne(L.laneId) };
    if (!C.includes(x.laneId)) throw new Error("Card refers to an unknown lane.");
    if (L.override !== void 0) {
      if (t || n.experience !== void 0) throw new Error("A release plan’s and a startup experience’s cards are never moved past a rule.");
      x.override = ha(L.override, C, x.laneId);
    }
    if (L.allowedLaneIds !== void 0) {
      if (!Array.isArray(L.allowedLaneIds) || L.allowedLaneIds.length > h.length) throw new Error("Invalid allowed lanes.");
      if (x.allowedLaneIds = L.allowedLaneIds.map(Ne), Ye(x.allowedLaneIds, "allowed lane"), !x.allowedLaneIds.includes(x.laneId) && !x.override || !x.allowedLaneIds.every((O) => C.includes(O)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (L.look !== void 0) {
      const O = ko(L.look);
      O && (x.look = O);
    }
    if (L.asNote !== void 0) {
      const O = $t(L.asNote);
      O && (x.asNote = O);
    }
    if (L.noteId !== void 0 && L.noteId !== x.id && (x.noteId = yo(L.noteId)), L.free !== void 0) {
      if (L.free !== !0 || !h.some((O) => O.station)) throw new Error("Only a map’s cards can be free of its paths.");
      x.free = !0;
    }
    if (o?.readCard(L, x, i), t) {
      if (typeof L.points != "number" || !Number.isInteger(L.points) || L.points < 1 || L.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (x.points = L.points, L.dependsOn !== void 0) {
        if (!Array.isArray(L.dependsOn) || L.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        x.dependsOn = L.dependsOn.map(Ne), Ye(x.dependsOn, "dependency");
      }
    }
    return x;
  });
  Ye(b.map((k) => k.id), "card ID");
  const v = { version: 1, title: d, lanes: h, cards: b };
  if (n.experience !== void 0) {
    const k = ge(n.experience);
    if (k.version !== 1 || k.kind !== "customer-interviews" && k.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    v.experience = { version: 1, kind: k.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    v.signals = n.signals.map((k) => {
      const L = ge(k), x = Ne(L.cardId), O = Ne(L.laneId);
      if (!b.some((D) => D.id === x) || !C.includes(O))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Ne(L.id),
        label: Te(L.label),
        cardId: x,
        laneId: O,
        whenPresent: Te(L.whenPresent, 160),
        whenAbsent: Te(L.whenAbsent, 160)
      };
    }), Ye(v.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const k = ua(n.lines, new Set(b.map((L) => L.id)));
    k.length && (v.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    v.presentationOrder = Mo({ lanes: h, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (v.behaviour = be().validate(n.behaviour, { ...v, kind: n.kind })), n.appearance !== void 0) {
    const k = rs(n.appearance, is({ lanes: h, kind: n.kind, nest: n.nest }));
    k && (v.appearance = k);
  }
  if (t)
    return v.kind = "release-plan", ds(v), v;
  if (r && o) {
    v.kind = r, o.readBoard(n, v, i);
    const k = o.validate(v);
    if (k) throw new Error(k);
    return v;
  }
  for (const k of h)
    if (Xe({ cards: b.filter((L) => !L.override) }, k.id) > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return v;
}
function Xe(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const ci = 65536;
function ul(e) {
  const n = JSON.stringify(Q(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > ci) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function fl(e) {
  if (e.length > ci) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), t = n.get("model");
  if (!e.startsWith("#") || !t || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let r;
  try {
    r = JSON.parse(t);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return Q(r);
}
function _o(e, n, t) {
  const r = oe(e);
  return r ? Ae(r).planMove(e, n, t) : void 0;
}
function Et(e, n) {
  if (oe(e)) return e.lanes.filter((r) => _o(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => Qn(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && Xe(e, r.id) < (r.capacity ?? 1 / 0));
}
function xo(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = _o(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = Qn(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !Et(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? Rt({ ...r, laneId: t }) : i) };
}
function ma(e, n, t) {
  if (!n.cards.find((u) => u.id === t)?.override) return n;
  const o = { ...n, cards: n.cards.map((u) => u.id === t ? Rt(u) : u) };
  let i = !1;
  try {
    Q(o);
  } catch {
    i = !0;
  }
  const d = oe(e);
  return !i && d && (i = Ae(d).pastRule?.(o, t) ?? !1), !i && e.behaviour && (i = "refused" in be().check(e, o)), i ? n : o;
}
function Rt(e) {
  if (!e.override) return e;
  const { override: n, ...t } = e;
  return t;
}
function cn(e, n, t) {
  const r = Ro(e, n, t);
  if (!r || r === e) return r;
  const o = ma(e, r, n);
  return e.behaviour && "refused" in be().check(e, o) ? null : o;
}
function wa(e) {
  return e.kind !== "release-plan" && !e.experience;
}
function hl(e, n) {
  return e.cards.some((t) => t.override) || n.cards.some((t) => t.override);
}
function ga(e, n) {
  if (!n.override) return !1;
  const t = e.cards.find((r) => r.id === n.id)?.override;
  return !t || JSON.stringify(t) !== JSON.stringify(n.override);
}
function pl(e, n) {
  const t = e.cards.find((o) => o.id === n.id)?.override;
  if (!t || n.override) return !1;
  const r = t.was ?? {};
  return n.laneId === t.from && (r.lag === void 0 || (n.lag ?? 0) === r.lag) && (r.duration === void 0 || n.duration === r.duration) && (r.parentId === void 0 || (n.parentId ?? null) === r.parentId);
}
function ml(e, n) {
  return e.cards.some((t) => t.laneId === n && t.override !== void 0);
}
function wl(e, n, t) {
  const r = e.cards.find((o) => o.id === n);
  return !r || !e.lanes.some((o) => o.id === t) ? "That card or lane is no longer on the board." : r.laneId === t || cn(e, n, t) || Xn(e, n, t, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) ? null : ze(e, n, t) ?? "That move is not available.";
}
function ui(e) {
  return { by: String(e.by || "Someone").replace(/[\u0000-\u001f\u007f<>]/g, "").slice(0, 80) || "Someone", at: e.at };
}
function ya(e, n, t, r) {
  return { ...ui(t), sentence: (n || "That move is not available.").slice(0, 300), from: e.laneId, ...r && { was: r } };
}
function Xn(e, n, t, r) {
  const o = e.cards.find((C) => C.id === n);
  if (!o || o.laneId === t || !e.lanes.some((C) => C.id === t) || !wa(e) || cn(e, n, t)) return null;
  const i = ze(e, n, t) ?? "That move is not available.", d = Ro(e, n, t), u = d && d !== e ? d : oe(e) ? { ...e, cards: [...e.cards.filter((C) => C.id !== n), o] } : e, h = ya(o, i, r);
  try {
    return Q({ ...u, cards: u.cards.map((C) => C.id === n ? { ...Rt(C), laneId: t, override: h } : C) });
  } catch {
    return null;
  }
}
function gl(e, n, t) {
  const r = new Map(e.cards.map((i) => [i.id, i]));
  if (!n.cards.some((i) => i.override || r.get(i.id)?.override)) return n;
  const o = n.cards.map((i) => {
    const d = r.get(i.id), u = Rt(i);
    if (!d) return u;
    const h = d.laneId !== i.laneId, C = (d.lag ?? 0) !== (i.lag ?? 0) || d.duration !== i.duration || (d.parentId ?? null) !== (i.parentId ?? null);
    if (!h && !C) return d.override ? { ...u, override: d.override } : u;
    if (!i.override) return u;
    if (h && !C) {
      const x = Xn(e, i.id, i.laneId, t)?.cards.find((O) => O.id === i.id)?.override;
      return x ? { ...u, override: x } : u;
    }
    const b = e.kind === "launch-plan" || e.kind === "hiring-plan", v = oe(e) === "nest" ? [{ kind: "nest_card", card: { id: i.id }, ...i.parentId ? { under: { id: i.parentId } } : { lane: { id: i.laneId } }, override: !0 }] : b ? [
      { kind: "set_task", card: { id: i.id }, lag: i.lag ?? 0, duration: i.duration ?? 1, override: !0 },
      ...h ? [{ kind: "move_card", card: { id: i.id }, lane: { id: i.laneId }, override: !0 }] : []
    ] : [];
    if (!v.length) return u;
    const k = $e(e, v, { actor: { by: ui(t).by, via: "chat" }, now: t.at }), L = "refused" in k ? void 0 : k.workshop.cards.find((x) => x.id === i.id);
    return L?.override && L.laneId === i.laneId && (L.lag ?? 0) === (i.lag ?? 0) && L.duration === i.duration && (L.parentId ?? null) === (i.parentId ?? null) ? { ...u, override: L.override } : u;
  });
  return { ...n, cards: o };
}
const ka = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fi(e) {
  if (!e.override) return null;
  const n = new Date(e.override.at), t = Number.isNaN(n.getTime()) ? "" : " · " + ka[n.getMonth()] + " " + n.getDate();
  return "Moved anyway by " + e.override.by + t;
}
function Ro(e, n, t) {
  const r = e.cards.find((d) => d.id === n);
  if (!r || !e.lanes.some((d) => d.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return Qn(e, r, t);
  const o = _o(e, n, t);
  if (o !== void 0) return o;
  const i = Ra(e, n, t);
  return i || (t === "prototype" && hn(e) === "customer-interviews" ? null : Et(e, r).some((d) => d.id === t) ? xo(e, n, t) : null);
}
function Er(e, n) {
  return e.lanes.filter((t) => cn(e, n, t.id) !== null);
}
function ze(e, n, t) {
  const r = Ro(e, n, t);
  if (r !== null) {
    const v = r === e || !e.behaviour ? null : be().check(e, r);
    return v && "refused" in v ? v.refused.sentence : null;
  }
  const o = e.cards.find((v) => v.id === n), i = e.lanes.find((v) => v.id === t);
  if (!o || !i) return "That move is not available.";
  const d = oe(e), u = d && Ae(d).refusal;
  if (u) return u(e, n, t);
  const h = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return h;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return h;
    const v = un(e, t), k = { ...e, lanes: e.lanes.map((x) => x === i ? { id: i.id, label: i.label } : x) }, L = Qn(k, o, t);
    return L ? `Needs ${un(L, t) - v} points. It already holds ${v} of ${i.capacity} points.` : h;
  }
  const C = e.lanes.find((v) => v.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const b = Xe(e, t);
  if (i.capacity !== void 0 && b >= i.capacity && !(C?.station && o.free)) {
    const v = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${b} of ${i.capacity} ${v}.`;
  }
  return h;
}
function ao(e) {
  return !0;
}
function ba(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !hn(e);
}
function va(e) {
  const n = hn(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function xa(e) {
  const n = Mt(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const Ia = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Tn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && Ia.test(n) && !t.has(n) ? n : et(e, "card");
}
function an(e, n, t) {
  const r = e.lanes.find((u) => u.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = va(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= Jn ? `This board is at its size limit of ${Jn} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : gi(e, n, t) ? null : ze(wi(e, n, t), Tn(e, t.id), n);
  if (oe(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const u = yi(e, n, t);
    return typeof u == "string" ? u : Pr(e, u);
  }
  if (e.cards.length >= Jn) return `This board is at its size limit of ${Jn} cards. Remove a card to make room.`;
  const i = e.lanes.some((u) => u.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const d = Xe(e, n);
  if (r.capacity !== void 0 && !i && d >= r.capacity) return `It already holds ${d} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const u = pi(t.lines);
    if (!u) return "A line of this note can't be joined to a card.";
    const h = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + u.filter((C) => !h.has(C.id)).length > On)
      return `A workshop holds up to ${On} lines.`;
  }
  return Pr(e, { ...e, cards: [...e.cards, { id: Tn(e, t.id), label: _t(Wo(t) || fn(e)), laneId: n }] });
}
function Pr(e, n) {
  if (!e.behaviour) return null;
  const t = be().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function hi(e) {
  try {
    return e && typeof e == "object" ? li(e) : void 0;
  } catch {
    return;
  }
}
function Io(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      $t({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? $t(n) : void 0;
}
function pi(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = $n(r);
    } catch {
      const i = (u) => {
        const { id: h, parentId: C, childId: b, targetPoint: v } = ge(r);
        return $n({ id: h, parentId: C, childId: b, ...u ? { targetPoint: v } : {} });
      }, d = r?.targetPoint !== void 0 && r?.targetPoint !== null;
      try {
        o = i(!0);
      } catch {
        try {
          o = d ? null : i(!1);
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
function Wt(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function bn(e, n, t) {
  return e && e.map((r) => Wt(r, n, t));
}
function mi(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function Kn(e, n, t, r) {
  if (an(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return gi(e, n, t, r);
  if (oe(e)) {
    const O = yi(e, n, t), D = O.cards[O.cards.length - 1], J = r === void 0 ? -1 : e.cards.findIndex((l) => l.id === r && l.laneId === n);
    return J < 0 ? O : { ...O, cards: [...e.cards.slice(0, J), D, ...e.cards.slice(J)] };
  }
  const o = hi(t.look), i = Wo(t), d = i || fn(e);
  let u = Io(t.asNote);
  i || (u = { ...u, text: "" }), d.length > 80 && u?.text === void 0 && d.length <= 4e3 && (u = { ...u, text: d });
  const h = Tn(e, t.id), C = h !== t.id && typeof t.id == "string" && Nt.test(t.id) ? t.id : void 0, b = e.lanes.some((O) => O.station), v = {
    id: h,
    label: _t(d),
    laneId: n,
    ...o ? { look: o } : {},
    ...u ? { asNote: u } : {},
    ...C ? { noteId: C } : {},
    ...b ? { free: !0 } : {}
  }, k = r === void 0 ? -1 : e.cards.findIndex((O) => O.id === r && O.laneId === n), L = k < 0 ? [...e.cards, v] : [...e.cards.slice(0, k), v, ...e.cards.slice(k)], x = t.lines === void 0 ? void 0 : mi(e, pi(t.lines).map((O) => Wt(O, t.id, v.id)));
  return Q({ ...e, cards: L, ...x ? { lines: x } : {} });
}
function wi(e, n, t, r) {
  const { label: o, points: i } = xa(typeof t.label == "string" ? t.label : ""), d = Tn(e, t.id), u = d !== t.id && typeof t.id == "string" && Nt.test(t.id) ? t.id : void 0, h = { id: d, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...u ? { noteId: u } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((b) => b.id === r && b.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, h] : [...e.cards.slice(0, C), h, ...e.cards.slice(C)] };
}
function gi(e, n, t, r) {
  const o = wi(e, n, t, r), i = Tn(e, t.id), d = o.cards.find((h) => h.id === i);
  if (d.laneId === n) return Q(o);
  const u = Qn(o, d, n);
  return u ? Q(u) : null;
}
function yi(e, n, t) {
  const r = Wo(t), o = Ae(oe(e)).fromNote(e, r, fn(e, t.under));
  if (typeof o == "string") return o;
  const i = $e(e, [{ kind: "add_card", lane: { id: n }, ...o, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const d = i.workshop.cards, u = Tn(e, t.id), h = u !== t.id && typeof t.id == "string" && Nt.test(t.id) ? t.id : void 0, C = hi(t.look), b = r ? Io(t.asNote) : { ...Io(t.asNote), text: "" };
  d[d.length - 1] = {
    ...d[d.length - 1],
    id: u,
    ...h ? { noteId: h } : {},
    ...C ? { look: C } : {},
    ...b ? { asNote: b } : {}
  };
  const v = Ae(oe(e));
  return typeof t.day == "number" && Number.isFinite(t.day) && v.landNote ? v.landNote(i.workshop, u, t.day) : i.workshop;
}
function Wo(e) {
  return typeof e?.label == "string" ? Mt(e.label) : "";
}
function Mr(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === fn(e, n.parentId) || n.label === fn(e)) ? "" : t !== void 0 && t !== "" && _t(t) === n.label ? t : Ao(e, n);
}
function ki(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = oe(e), r = fi(n), o = t ? Ae(t).cardText(e, n) : n.label;
  return r ? o + `
` + r : o;
}
function Ao(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = oe(e);
  return t ? Ae(t).noteText(e, n) : n.label;
}
function xt(e, n) {
  const t = e.cards.find((r) => r.id === n);
  if (!t) return "That card is no longer on the board.";
  if (hn(e)) return "This card stays on the board.";
  if (e.lanes.some((r) => r.station) && !t.free) return "The token stays on the map.";
  if (e.kind === "release-plan") {
    const r = e.cards.find((o) => o.dependsOn?.includes(n));
    if (r) return `${r.label} depends on ${t.label}, so it stays a card.`;
  }
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((r) => r.cardId === n)) return `An outcome on this board depends on ${t.label}, so it stays a card.`;
  if (e.cards.some((r) => r.parentId === n)) return `${t.label} has cards under it, so it stays a card. Move them first.`;
  if (t.allowedLaneIds && t.allowedLaneIds.length < e.lanes.length) {
    const r = t.allowedLaneIds.map((i) => e.lanes.find((d) => d.id === i).label), o = r.length > 1 ? r.slice(0, -1).join(", ") + " or " + r.at(-1) : r[0];
    return `${t.label} may only be in ${o}, so it stays a card.`;
  }
  return null;
}
function Nr(e, n, t = bi(e, n)) {
  if (xt(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const d = { ...i, dependsOn: i.dependsOn.filter((u) => u !== n) };
    return d.dependsOn.length || delete d.dependsOn, d;
  }), o = e.lines?.map((i) => Wt(i, n, t));
  return Q({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Aa(e, n, t = bi(e, n)) {
  const r = new Set(e.cards.filter((d) => d.id !== n).map((d) => d.id)), o = (e.lines ?? []).filter((d) => d.parentId === n || d.childId === n).map((d) => Wt(d, n, t)), i = (d) => r.has(d.parentId) || r.has(d.childId);
  return { stay: o.filter(i), leave: o.filter((d) => !i(d)) };
}
function bi(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? ii(t) : n;
}
function lo(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function Zn(e, n) {
  if (e.kind) return Sa;
  let t;
  try {
    t = $n(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = di(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= On ? `A workshop holds up to ${On} lines.` : null;
}
const Sa = "Lines join the cards of a lane workshop to notes and to each other.";
function It(e, n) {
  return Zn(e, n) !== null ? null : Q({ ...e, lines: mi(e, [$n(n)]) });
}
function _r(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? Q({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function vi(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((d) => d.id));
  let i = `${n}->${t}`;
  for (let d = 2; o.has(i); d++) i = `${n}->${t}~${d}`;
  return $n({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function Ca(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function xi(e, n) {
  return Ii(e, n, !1);
}
function Je(e, n) {
  return Ii(e, n, !0);
}
function Ii(e, n, t) {
  const r = e.lanes.find((b) => b.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const b = un(e, n);
    return r.capacity ? b + (t ? " of " : " / ") + r.capacity + " points" : b + " points";
  }
  const o = oe(e);
  if (o) return Ae(o).caption(e, n);
  const i = Wa(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const d = e.cards.filter((b) => b.laneId === n).length, u = e.behaviour ? be().laneLimit(e, n) : r.capacity, h = Xe(e, n), C = (b) => b + (b === 1 ? " card" : " cards");
  return t ? u !== void 0 && h !== d ? h + " of " + u + " · " + C(d - h) : u !== void 0 ? d + " of " + u : C(d) : u !== void 0 && h !== d ? h + " / " + u + " · +" + (d - h) : u !== void 0 ? d + " / " + u : String(d);
}
function La(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || oe(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? be().laneLimit(e, n) : t.capacity;
  return r !== void 0 && Xe(e, n) >= r;
}
const En = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, xn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Ai(e, n = En, t = 28, r) {
  const { pitch: o, row: i, top: d } = n, u = !!e.lanes[0].station, h = e.lanes.map((v) => e.cards.filter((k) => k.laneId === v.id).length), C = d + Math.max(1, ...r ?? h) * i + 36, b = e.lanes.map((v, k) => ({
    x: u ? v.station.column * (o + t) : k * o,
    y: u ? v.station.row * C : 0
  }));
  return {
    points: b,
    width: Math.max(...b.map((v) => v.x)) + o,
    height: Math.max(...b.map((v, k) => v.y + d + (u ? Math.max(1, h[k]) : h[k] + 1) * i))
  };
}
function yl() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function et(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function Si(e) {
  const n = Q(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Oa(e, n) {
  const t = Si(e), r = et(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), Q(t);
}
function $a(e, n, t) {
  const r = Si(e);
  return r.cards.push({
    id: et(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), Q(r);
}
function kl() {
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
function Rr(e, n, t) {
  const r = Q(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((b) => b.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= No) throw new Error("A map can have up to five stations.");
  const i = Te(t?.label), d = Te(t?.outcome, 160), u = et(r, "station");
  let h, C = 1 / 0;
  for (let b = 0; b < vo; b++)
    for (let v = 0; v < vo; v++) {
      if (r.lanes.some((L) => L.station.column === v && L.station.row === b)) continue;
      const k = Math.abs(o.station.column - v) + Math.abs(o.station.row - b);
      k < C && (C = k, h = { column: v, row: b });
    }
  if (!h) throw new Error("There is no free station position.");
  return o.station.next.push(u), r.lanes.push({ id: u, label: i, station: { ...h, next: [], outcome: d, ...t.image === void 0 ? {} : { image: si(t.image) } } }), r.presentationOrder?.push(u), r;
}
const bl = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, So = (e) => "caption-" + e, Sn = (e) => "column-" + e, Wr = "rules-board";
function nt(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function vl(e, n) {
  const t = nt(n);
  return t ? t + ":" + e : e;
}
const ee = {
  lane: Cn,
  card: Ve,
  image: Tt,
  caption: So,
  column: Sn,
  rules: Wr,
  of(e) {
    const n = nt(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(Cn(r)),
      card: (r) => t(Ve(r)),
      image: (r) => t(Tt(r)),
      caption: (r) => t(So(r)),
      column: (r) => t(Sn(r)),
      rules: t(Wr)
    };
  }
};
function Ci(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function Li(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function ln(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function jr(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function Dr(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((u, h) => u + Math.max(1, Math.ceil(h.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const Oi = 152, Co = Oi + 12, Ta = 12;
function Ea(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function Fe(e, n = {}) {
  const t = Q(e), { pitch: r, row: o, top: i } = En, d = t.lanes.map((k) => t.cards.filter((L) => L.laneId === k.id).length), u = (k) => Math.max(d[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), h = !!t.lanes[0].station, C = t.lanes.some((k) => k.station?.image), b = Ea(n.layout, t.lanes.length), v = [];
  if (h) {
    const { points: k } = Ai(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach((L, x) => v.push({
      laneId: L.id,
      x: k[x].x,
      y: k[x].y + (C ? L.station.row * Co : 0),
      width: r,
      height: i + (L.station.image ? Co : 0) + Math.max(1, u(x)) * o,
      column: L.station.column,
      row: L.station.row
    }));
  } else {
    let k = 0;
    for (let L = 0; L < t.lanes.length; L += b) {
      const x = t.lanes.slice(L, L + b), O = i + (Math.max(...x.map((D, J) => u(L + J))) + 1) * o;
      x.forEach((D, J) => v.push({ laneId: D.id, x: J * r, y: k, width: r, height: O, column: J, row: L / b })), k += O + Ta;
    }
  }
  return { places: v, width: Math.max(...v.map((k) => k.x + k.width)), height: Math.max(...v.map((k) => k.y + k.height)) };
}
function $i(e, n, t = {}) {
  const r = t.captionFontSize ?? Math.max(11, (t.fontSize ?? vn.fontSize) - 1), o = xi(e, n.laneId), { label: i, counter: d } = Ur(n.x, n.y, Math.max(40, Math.ceil(o.length * r * 0.6) + 24), En.width, Os(r));
  return { label: i, value: d };
}
function Pa(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: d } = En, u = n.origin ?? { x: 0, y: 0 }, h = !!e.lanes[0].station, { places: C } = Fe(e, n), b = n.style ?? {}, v = b.textColor ?? vn.fontColor, k = b.borderColor ?? vn.borderColor, L = b.borderWidth ?? vn.borderWidth, x = b.cornerRadius ?? 0, O = b.fontSize ?? vn.fontSize, D = b.laneFontSize ?? O + 2, J = b.captionFontSize ?? Math.max(11, O - 1), l = [], I = (A) => {
    const $ = { options: {
      shapeHint: "rectangle",
      vectorPath: ln(A.width, A.height, x),
      foregroundColor: v,
      borderColor: k,
      borderWidth: L,
      ...b.fontFamily ? { fontFamily: b.fontFamily } : {},
      ...A
    }, relationships: { associations: [] } };
    return l.push($), $;
  };
  if (e.lanes.forEach((A, $) => {
    const _ = C[$], j = u.x + _.x, F = u.y + _.y, M = A.station?.image;
    I({
      id: Sn(A.id),
      text: "",
      name: A.label,
      xPos: j + 2,
      yPos: F,
      width: t - 4,
      height: _.height,
      vectorPath: ln(t - 4, _.height, x ? x + 2 : 0),
      backgroundColor: h ? "#fcf9ed" : jr(xn[$], 0.6),
      borderColor: h ? "#a8b5aa" : jr(xn[$], 0.1),
      borderWidth: 1,
      ...h ? { borderStyle: "dashed" } : {}
    });
    const U = h ? null : $i(e, _, b), ve = U?.label ?? { x: j + 8 - u.x, y: F + 6 - u.y, width: r, height: 58 }, he = Es(A.label, D, ve.width - 16, ve.height - 8);
    I({
      id: Cn(A.id),
      text: he.text,
      name: A.label,
      xPos: u.x + ve.x,
      yPos: u.y + ve.y,
      width: ve.width,
      height: ve.height,
      backgroundColor: xn[$],
      fontSize: he.fontSize
    });
    const se = h ? "" : xi(e, A.id), Be = J, Se = U?.value ?? { x: j + 8 - u.x, y: F + 68 - u.y, width: r, height: 22 };
    I({
      id: So(A.id),
      text: se,
      name: A.label,
      xPos: u.x + Se.x,
      yPos: u.y + Se.y,
      width: Se.width,
      height: Se.height,
      vectorPath: ln(Se.width, Se.height, h ? 0 : Math.round(Se.height / 2)),
      backgroundColor: h ? "transparent" : La(e, A.id) ? xn[$ % xn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: Be
    }), M && l.push({ options: {
      id: Tt(A.id),
      name: M.alt,
      text: "",
      xPos: j + 8,
      yPos: F + d,
      width: r,
      height: Oi,
      shapeHint: "rectangle",
      image: M.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((Ce) => Ce.laneId === A.id).forEach((Ce, ae) => {
      const pe = ki(e, Ce), Qe = h ? r - 20 : r, xe = h ? i - 6 : i, He = h && !Ce.free, X = He ? {} : { ...b.card, ...Ce.look }, ye = He ? x : b.card?.cornerRadius ?? x;
      I({
        id: Ve(Ce.id),
        text: pe,
        name: Ce.label,
        xPos: j + (h ? 18 : 8),
        yPos: F + d + (M ? Co : 0) + ae * o,
        width: Qe,
        height: xe,
        ...ye !== x ? { vectorPath: ln(Qe, xe, ye) } : {},
        backgroundColor: He ? "#ffda75" : X.backgroundColor ?? b.backgroundColor ?? vn.backgroundColor,
        ...X.textColor ? { foregroundColor: X.textColor } : {},
        ...X.fontFamily ? { fontFamily: X.fontFamily } : {},
        ...X.borderColor ? { borderColor: X.borderColor } : {},
        ...X.borderWidth !== void 0 ? { borderWidth: X.borderWidth } : {},
        fontSize: Dr(pe, X.fontSize ?? O, Qe - 16, xe - 8)
      });
    });
  }), e.appearance) for (const { options: A } of l) {
    const $ = as(e.appearance, A.id, {
      fill: A.backgroundColor,
      line: A.borderColor,
      lineWidth: A.borderWidth,
      fontSize: A.fontSize,
      height: A.height
    });
    $.height !== A.height && (A.vectorPath = ln(A.width, $.height, b.card?.cornerRadius ?? x), $.fontSize = Dr(String(A.text ?? ""), $.fontSize ?? O, A.width - 16, $.height - 8)), Object.assign(A, { backgroundColor: $.fill, borderColor: $.line, borderWidth: $.lineWidth, fontSize: $.fontSize, height: $.height }, $.weight && { fontWeight: $.weight });
  }
  const S = new Map(l.map((A) => [A.options.id, A]));
  for (const A of e.lanes)
    A.station && (S.get(Sn(A.id)).relationships.associations = A.station.next.map(($) => ({
      id: A.id + "-to-" + $,
      parentId: Sn(A.id),
      childId: Sn($),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const A of e.cards)
      for (const $ of A.dependsOn ?? []) {
        const _ = Ve($), j = Ve(A.id);
        S.get(_).relationships.associations.push({
          id: `dependency-${$.length}-${$}-${A.id}`,
          parentId: _,
          childId: j,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (Ci(l, nt(n.scope)), n.beside) {
    const A = new Set(n.beside), $ = new Set(l.map((F) => F.options.id)), _ = /* @__PURE__ */ new Map();
    for (const F of [...$]) {
      if (!A.has(F)) continue;
      const M = Li(F, (U) => A.has(U) || $.has(U));
      $.add(M), _.set(F, M);
    }
    const j = (F) => _.get(F) ?? F;
    for (const F of l) {
      F.options.id = j(F.options.id);
      for (const M of F.relationships.associations)
        M.parentId = j(M.parentId), M.childId = j(M.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: l };
}
function xl(e, n, t = {}) {
  return e.behaviour ? be().note(e, n, t) : null;
}
function Ma(e, n) {
  const t = Q(e), r = nt(n?.scope);
  if (n?.native) return Pa(t, n);
  const { width: o, row: i, height: d, top: u } = En, h = [];
  function C(x, O, D, J, l, I) {
    h.push({ options: {
      id: x,
      text: O,
      name: O,
      xPos: D,
      yPos: J,
      width: o,
      height: l,
      shapeHint: "rectangle",
      backgroundColor: I,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: b } = Ai(t), v = 152, k = v + 12, L = t.lanes.some((x) => x.station?.image);
  t.lanes.forEach((x, O) => {
    const D = b[O].x, J = b[O].y + (L ? (x.station?.row ?? 0) * k : 0), l = x.station?.image, I = t.kind === "release-plan" ? x.label + `
` + (x.capacity ? un(t, x.id) + " / " + x.capacity + " points" : un(t, x.id) + " points") : x.label;
    C(Cn(x.id), I, D, J, u - 12, xn[O]), l && h.push({ options: {
      id: Tt(x.id),
      name: l.alt,
      text: "",
      xPos: D,
      yPos: J + u,
      width: o,
      height: v,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((S) => S.laneId === x.id).forEach((S, A) => C(Ve(S.id), ki(t, S), D, J + u + (l ? k : 0) + A * i, d, "#fffdf6"));
  });
  for (const x of t.lanes) {
    if (!x.station) continue;
    const O = h.find((D) => D.options.id === Cn(x.id));
    O.relationships.associations = x.station.next.map((D) => ({ id: x.id + "-to-" + D, parentId: O.options.id, childId: Cn(D), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), O.options.text = x.label + `
` + x.station.outcome, O.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const x = new Map(h.map((O) => [O.options.id, O]));
    for (const O of t.cards)
      for (const D of O.dependsOn ?? []) {
        const J = Ve(D), l = Ve(O.id);
        x.get(J).relationships.associations.push({
          id: `dependency-${D.length}-${D}-${O.id}`,
          parentId: J,
          childId: l,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return Ci(h, r), { options: { name: t.title }, shareId: "", nodes: h };
}
function Na(e, n = {}, t) {
  const r = Q(e), o = n.narrow ? void 0 : n.width;
  if (oe(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: u, height: h } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(u, o ?? 0), height: h };
  }
  const { width: i, height: d } = Fe(r, {});
  return { width: Math.max(No * En.pitch, i), height: d };
}
function _a(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite));
  for (let d = 0; d <= i.length; d++) {
    const u = i.find((h) => o < h.x + h.width + r && o + e.width > h.x - r && e.y < h.y + h.height + r && e.y + e.height > h.y - r);
    if (!u) break;
    o = t > 0 ? u.x + u.width + r : u.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const Il = {
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
}, Lo = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], jo = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Al() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Lo.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Lo.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function Sl() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...jo.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function hn(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...jo.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => Lo.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function Ra(e, n, t) {
  const r = hn(e), o = e.cards.find((d) => d.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const d = e.cards.find((u) => u.laneId === t);
    if (d) {
      if (!Et(e, d).some((u) => u.id === "interviews")) return null;
      i = xo(e, d.id, "interviews");
    }
  }
  return Et(i, o).some((d) => d.id === t) ? xo(i, n, t) : null;
}
function Wa(e, n) {
  if (hn(e) !== "experiment-budget") return null;
  const t = jo.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  Us as CHROME_CHIPS_MAX_SCALE,
  Yr as CHROME_MAX_SCALE,
  vn as DEFAULT_NOTE_STYLE,
  Gs as DRAFT_TAG,
  Ss as H,
  Cs as L,
  zr as WORKSHOP_BOARD_KINDS,
  bt as WorkshopReferenceError,
  Yn as a,
  Rr as addWorkshopBranch,
  $a as addWorkshopCard,
  Oa as addWorkshopLane,
  Ka as appearanceChips,
  qa as appearanceEditsBetween,
  is as appearanceKeys,
  as as appearanceLook,
  Ln as appearancePalette,
  At as appearanceQuadrants,
  $e as applyWorkshopEdits,
  dl as attachWorkshop,
  Et as availableLanes,
  yr as b,
  xl as behaviourNote,
  Ke as blend,
  xr as boardBadgeShapes,
  Xr as boardChromeBox,
  qs as boardChromeLabel,
  Vr as boardChromeLayout,
  vr as boardChromeShapes,
  al as boardChromeStyles,
  To as boardLegend,
  ia as businessBoardKinds,
  oe as businessKind,
  el as c,
  Ms as canHangPanel,
  jo as channels,
  As as checkWorkshopReplacement,
  fe as chromeInk,
  Zr as chromeScaleAt,
  po as chromeTagScaleAt,
  hs as countWord,
  Ds as createBoardLayer,
  Sl as createBudgetWorkshop,
  Al as createInterviewWorkshop,
  yl as createLaneWorkshop,
  kl as createWorkshopMap,
  fl as decodeWorkshopFragment,
  sl as describeFocusDarkroom,
  Qa as describeWorkshopEdits,
  ul as encodeWorkshopFragment,
  Es as f,
  Ha as handoffSummary,
  ol as hangGalleryPanel,
  Il as industrialWorkshop,
  il as initialFocusDarkroom,
  Lo as interviews,
  ws as isRuleEdit,
  xn as laneColors,
  In as layerInk,
  dn as listed,
  ht as listeningRoom,
  Ua as listeningRoomCaption,
  Jn as maxWorkshopCards,
  On as maxWorkshopLines,
  nl as moonGallery,
  xo as moveWorkshopCard,
  Xa as named,
  et as nextWorkshopId,
  bl as nightTransfer,
  rl as normalizeFocusDarkroom,
  Ga as normalizeListeningRoom,
  tl as normalizeMoonGallery,
  Fa as normalizeOfflineHandoff,
  Da as offlineHandoff,
  Ra as planStartupMove,
  ps as pointing,
  qr as printFields,
  Ps as r,
  rs as readAppearance,
  ll as registerRuleControls,
  Va as registerRulebook,
  Ya as registerWorkshopRules,
  un as releaseLoad,
  Ja as releasePlan,
  An as renderLayerShapes,
  Ba as resolveHandoff,
  fa as resolveWorkshopSignals,
  za as reviewHandoff,
  ln as roundedBox,
  be as rulebook,
  us as rulebookLoaded,
  P as said,
  hn as startupExperienceKind,
  Oo as unquoted,
  Q as validateWorkshop,
  ls as withAppearance,
  Ct as workshopBoardKind,
  nt as workshopBoardScope,
  Wa as workshopBudgetResult,
  cn as workshopCandidate,
  Nr as workshopCardAsNote,
  xt as workshopCardAsNoteRefusal,
  _t as workshopCardLabelOf,
  Aa as workshopCardLines,
  li as workshopCardLookOf,
  Ao as workshopCardNoteText,
  Mr as workshopCardNoteWords,
  ki as workshopCardText,
  Er as workshopDestinations,
  fo as workshopEditKinds,
  co as workshopFinder,
  _a as workshopFreeSpot,
  ga as workshopFreshOverride,
  wl as workshopHardLimit,
  hl as workshopHasMarks,
  Tr as workshopKeepsLink,
  bo as workshopKeepsPicture,
  xi as workshopLaneCaption,
  La as workshopLaneFull,
  $i as workshopLaneHeader,
  Xe as workshopLaneHeld,
  ml as workshopLaneOverridden,
  Fe as workshopLanePlaces,
  Je as workshopLaneSpoken,
  En as workshopLayout,
  Zn as workshopLineRefusal,
  lo as workshopLinesOf,
  Sa as workshopLinesSentence,
  fn as workshopNewCardName,
  vi as workshopNewLine,
  ee as workshopNodeIds,
  Kn as workshopNoteCandidate,
  ii as workshopNoteIdOf,
  an as workshopNoteRefusal,
  Xn as workshopOverrideCandidate,
  fi as workshopOverrideLine,
  ya as workshopOverrideMark,
  pl as workshopOverrideUndone,
  Ai as workshopPositions,
  Mo as workshopPresentationLanes,
  cl as workshopPresentationScenes,
  ks as workshopReferences,
  ze as workshopRefusal,
  bn as workshopRenamedLines,
  Na as workshopReserve,
  wr as workshopRuleSchema,
  Ae as workshopRules,
  Za as workshopRulesLoaded,
  vl as workshopScopedId,
  ma as workshopShedMark,
  gl as workshopStampOverrides,
  Li as workshopStandInId,
  ba as workshopTakesLines,
  ao as workshopTakesNotes,
  Ma as workshopToSlate,
  It as workshopWithLine,
  Ca as workshopWithoutCardLines,
  _r as workshopWithoutLine
};
