import { D as vn } from "./NoteDefaults-BjVBa8YH.mjs";
const za = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Ba(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: d, fallback: u } = e, f = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !f(i) || !f(d) || !f(u) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: d.trim(), fallback: u.trim() };
}
function Ha(e) {
  return { ...e, stage: "review", choice: null };
}
function Ga(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Ua(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const ft = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function qa(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, d = (u) => typeof u == "string" && u.trim().length > 0 && u.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(u);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !d(o) || !d(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function Ka({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === ft.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === ft.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === ft.leftLabel && t === ft.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
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
}, St = { "q-do-now": "Do now", "q-plan": "Plan it", "q-later": "Later", "q-skip": "Skip" }, is = { borders: ["subtle", "strong"], headers: ["subtle", "strong"], headerSize: ["large"], fill: ["soft", "strong"], density: ["compact"] };
function ss(e, n) {
  if (e == null) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A board’s appearance is an object.");
  const t = e, r = {};
  for (const [o, i] of Object.entries(is))
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
function as(e) {
  return [...e.lanes.map((n) => n.id), ...e.kind === "nest" && e.nest?.layout === "matrix" ? Object.keys(St) : []];
}
const ls = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e);
function Je(e, n) {
  if (!ls(e)) return e;
  const t = n > 0 ? 255 : 0, r = Math.abs(n), o = (i) => Math.round(parseInt(e.slice(i, i + 2), 16) * (1 - r) + t * r).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ds(e, n, t) {
  const r = e && /^(column|lane|caption|card)-(.+)$/.exec(n);
  if (!r) return t;
  const o = e, [, i, d] = r, u = { ...t }, f = o.colors?.[d] && Ln[o.colors[d]];
  return i === "column" ? (f ? (u.fill = Je(f, o.fill === "soft" ? 0.75 : o.fill === "strong" ? 0.3 : 0.55), u.line = Je(f, -0.25)) : o.fill && (u.fill = Je(u.fill, o.fill === "soft" ? 0.5 : -0.1)), o.borders === "strong" && (u.lineWidth = 3, u.line = Je(u.line ?? u.fill, -0.45)), o.borders === "subtle" && (u.lineWidth = 1, u.line = Je(u.line, 0.6)), o.lines && (u.lineWidth = Math.max(2, u.lineWidth ?? 1), u.line = "#4b5a55")) : i === "lane" || i === "caption" && /^q-|^axis-/.test(d) ? (f && i === "lane" && (u.fill = f), o.headers === "strong" && (u.weight = "bold", i === "lane" && (u.fill = Je(u.fill, -0.12), u.lineWidth = 2, u.line = Je(u.fill, -0.4))), o.headers === "subtle" && i === "lane" && (u.fill = Je(u.fill, 0.5), u.lineWidth = 0), o.headerSize && u.fontSize && (u.fontSize = Math.min(36, Math.round(u.fontSize * 1.3)))) : i === "card" && o.density && u.height && (u.height = Math.max(28, Math.round(u.height * 0.72)), u.fontSize && (u.fontSize = Math.max(11, u.fontSize - 2))), u;
}
const mr = {
  borders: { strong: "stronger column borders", subtle: "lighter column borders", normal: "standard column borders" },
  headers: { strong: "bolder headers", subtle: "quieter headers", normal: "standard headers" },
  headerSize: { large: "bigger headers", normal: "standard-size headers" },
  fill: { strong: "deeper column colors", soft: "a softer background", normal: "standard column colors" },
  lines: { true: "grid lines", false: "no grid lines" },
  density: { compact: "compact cards", normal: "roomy cards" }
};
function cs(e, n, t) {
  const r = { ...e.appearance, colors: { ...e.appearance?.colors } }, o = { ...n };
  n.emphasis && (o.borders ?? (o.borders = n.emphasis), o.headers ?? (o.headers = n.emphasis), o.fill ?? (o.fill = n.emphasis === "subtle" ? "soft" : n.emphasis));
  const i = [];
  for (const k of Object.keys(mr)) {
    const L = o[k];
    L !== void 0 && (i.push(mr[k][String(L)]), L === "normal" || L === !1 ? delete r[k] : r[k] = L);
  }
  const d = r.colors;
  n.color !== void 0 && t && (n.color === "none" ? (delete d[t.key], i.push(t.label + " in its own color")) : (d[t.key] = n.color, i.push(t.label + " in " + n.color))), Object.keys(d).length || delete r.colors;
  const u = JSON.stringify(e.appearance ?? {}), f = Object.keys(r).length ? r : void 0, C = JSON.stringify(f ?? {}) !== u, I = { ...e, appearance: f };
  f || delete I.appearance;
  const v = i.length < 2 ? i.join("") : i.slice(0, -1).join(", ") + " and " + i.at(-1);
  return { board: I, changed: C, said: C ? "The board now has " + v + "." : "The board already has " + v + "." };
}
function Ja(e, n) {
  const t = e.appearance ?? {}, r = n.appearance ?? {}, o = {};
  for (const d of ["borders", "headers", "headerSize", "fill", "density"]) t[d] !== r[d] && (o[d] = r[d] ?? "normal");
  !!t.lines != !!r.lines && (o.lines = !!r.lines);
  const i = Object.keys(o).length ? [{ kind: "set_appearance", ...o }] : [];
  for (const d of /* @__PURE__ */ new Set([...Object.keys(t.colors ?? {}), ...Object.keys(r.colors ?? {})]))
    t.colors?.[d] !== r.colors?.[d] && i.push({ kind: "set_appearance", lane: { id: d }, color: r.colors?.[d] ?? "none" });
  return i;
}
function Ya(e, n) {
  const t = e.appearance ?? {}, r = t.borders === "strong" && t.headers === "strong", o = (d, u, f, C, I) => ({ id: "look:" + d, label: u, on: f, said: C + ". " + u + " now.", edit: { kind: "set_appearance", ...I } }), i = Object.keys(Ln);
  return {
    rail: [
      o("emphasis", r ? "Look: strong" : "Look: standard", r, r ? "Standard columns" : "Stronger columns", { emphasis: r ? "normal" : "strong" }),
      o("density", t.density ? "Cards: compact" : "Cards: roomy", !!t.density, t.density ? "Roomy cards" : "Compact cards", { density: t.density ? "normal" : "compact" }),
      o("lines", t.lines ? "Lines: on" : "Lines: off", !!t.lines, t.lines ? "No grid lines" : "Grid lines", { lines: !t.lines })
    ],
    swatches: n.flatMap((d) => {
      const u = e.lanes.find((I) => I.id === d)?.label ?? St[d], f = t.colors?.[d], C = i[i.indexOf(f) + 1];
      return u && (e.nest?.layout !== "matrix" || St[d]) ? [{
        key: d,
        now: f ?? null,
        swatch: f ? Ln[f] : "#ffffff",
        sentence: u + ": " + (f ?? "own color"),
        said: u + " in " + (C ?? "its own color") + ". Now " + (f ?? "its own color") + ".",
        edit: { kind: "set_appearance", lane: { id: d }, color: C ?? "none" }
      }] : [];
    })
  };
}
function un(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function us(e) {
  const n = new Map(e.cards.map((d) => [d.id, d])), t = new Map(e.lanes.map((d, u) => [d.id, u])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function i(d) {
    if (!r.has(d.id)) {
      if (o.has(d.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(d.id);
      for (const u of d.dependsOn ?? []) {
        const f = n.get(u);
        if (!f) throw new Error("A release dependency refers to an unknown feature.");
        if (t.get(f.laneId) > t.get(d.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(f);
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
  const C = { ...e, cards: e.cards.map((v) => d.has(v.id) ? { ...v, laneId: t } : v) }, I = e.lanes[o].capacity;
  return I !== void 0 && un(C, t) > I ? null : C;
}
const Za = {
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
}, Pt = /* @__PURE__ */ new Map(), fs = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board", grid: "grid sheet" };
function Va(e) {
  Pt.set(e.kind, e);
}
function Xa(e) {
  return typeof e == "string" && Pt.has(e);
}
function fn(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? Pt.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function ve(e) {
  const n = Pt.get(e);
  if (!n) throw new Error(`The ${fs[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let Ct = null;
function Qa(e) {
  Ct = e;
}
function hs() {
  return Ct !== null;
}
function be() {
  if (!Ct) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return Ct;
}
const M = (e) => "“" + e.replace(/[“”]/g, '"') + "”", dn = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], wr = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Mo = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Po = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), el = (e) => Mo(Po(e)), ps = [
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
], ms = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : ps.indexOf(e.toLowerCase()), ws = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Hr(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = Mo(o);
    i && t.add(i);
  };
  r(e), r(Po(e));
  for (const o of [...t]) r(o.replace(/^(?:the|my|our)\s+/i, ""));
  for (const o of [...t]) r(o.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const o of [...t]) r(o.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...t];
}
const to = "[^\\p{L}\\p{N}]", gr = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + wr(n) + "(?:$|" + to + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + to + ")" + wr(n) + "(?:$|" + to + ")", "u").test(e)
], yr = ["first", "second", "third", "fourth", "fifth"];
function gs(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + yr.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Mo(Po(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? yr.indexOf(o) : ms(o) - 1;
  return e[i] ?? null;
}
function oo(e, n, t, r, o) {
  const i = Hr(n, t);
  if (i.some((u) => ws.test(u))) {
    const u = r && e.find((f) => f.id === r);
    return u ? { item: u, rank: 0 } : { pointing: !0 };
  }
  for (const u of i) {
    if (!u.startsWith("@")) continue;
    const f = e.find((C) => C.id === u.slice(1));
    if (f) return { item: f, rank: 0 };
  }
  for (const [u, f] of gr.entries())
    for (const C of i) {
      const I = e.filter((v) => f(v.label.toLowerCase(), C.toLowerCase()));
      if (I.length === 1) return { item: I[0], rank: u };
      if (I.length > 1) return { several: I };
    }
  const d = o ? gs(e, n, t) : null;
  return d ? { item: d, rank: gr.length } : {};
}
class bt extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function ho(e, n, t, r, o = !1) {
  return { find: (f) => {
    const C = oo(e, f, n, r, o);
    if (C.item) return C.item;
    const I = Hr(f, n), v = I[I.length - 1];
    if (C.pointing) throw new bt("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const L = [...new Set(C.several.map((x) => x.label))];
      throw new bt(L.length === 1 ? C.several.length + " " + t + "s are called " + M(L[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + M(v) + ": " + dn(L.slice(0, 6).map(M)) + ". Use the whole name.", "ambiguous", C.several.map((x) => x.id));
    }
    const k = e.map((L) => L.label);
    throw new bt("There is no " + t + " called " + M(v) + " here." + (k.length && k.length <= 6 ? " The " + t + "s are " + dn(k.map(M)) + "." : k.length ? "" : " There are no " + t + "s yet."), "unknown", e.map((L) => L.id));
  }, attempt: (f) => oo(e, f, n, r, o).item ?? null, rank: (f) => oo(e, f, n, r, o).rank ?? 1 / 0 };
}
const Gr = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest", "grid"], _e = [...Gr], kn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Ur = Gr.slice(5);
function Lt(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ne(e);
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
}, po = {
  "launch-plan": G.launchLanes,
  pipeline: G.pipelineLanes,
  budget: G.budgetLanes,
  "hiring-plan": G.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them.",
  grid: "A grid sheet keeps its tray first. Add a page, or remove one, instead."
}, ue = (e, n) => Object.fromEntries(_e.filter((t) => !e.includes(t)).map((t) => [t, n])), ce = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), oe = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ie = (e) => ({ type: "ref", of: "card", about: e }), ro = (e) => ({ map: e }), De = ue(["map"], G.notMap), Pe = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), mo = [
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
    fields: { lane: oe("The lane or step."), label: ce(80, "The new name, 1 to 80 characters of plain text.") },
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
    refusals: { "release-plan": G.releaseLanes, "customer-interviews": G.keepsLanes, "experiment-budget": G.keepsLanes, map: G.mapAddLane, ...po }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: oe("The lane or step.") },
    boards: ["lanes", "map", "grid"],
    refusals: { "release-plan": G.releaseLanes, "customer-interviews": G.keepsLanes, "experiment-budget": G.keepsLanes, ...po }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: oe("The lane or step it starts in."),
      label: ce(80, "What the card says. Left out, the card takes the board’s name for a new item: “New card”, “New hire”, “New task”, “New deal” (on a map, a token is numbered; a free card is “New stop”).", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: Pe("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Pe("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Pe("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...Ur],
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
      lane: oe("Where it goes."),
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
    refusals: De
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: oe("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: _e.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": G.launchLanes, budget: G.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ie("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: kn,
    refusals: { ...ro(G.mapCardLanes), ...ue([...kn, "map"], G.businessCards) }
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
      lane: oe("The lane."),
      whenPresent: ce(160, "What it says when the card is there."),
      whenAbsent: ce(160, "What it says otherwise."),
      label: ce(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: kn,
    refusals: { ...ro(G.mapOutcome), ...ue([...kn, "map"], G.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ie("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: kn,
    refusals: { ...ro(G.mapOutcome), ...ue([...kn, "map"], G.businessCards) }
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
    fields: { lane: oe("The lane or step."), before: oe("Present it just before this one.", !0), after: oe("Present it just after this one.", !0) },
    boards: _e,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: oe("The step it follows."), label: ce(80, "The new step’s name."), outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: oe("The step it goes in front of."),
      from: oe("Only the path from this step is taken over.", !0),
      label: ce(80, "The new step’s name."),
      outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: oe("Where the path starts."), to: oe("Where it leads.") },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: oe("Where the path starts."), to: oe("Where it leads.") },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: oe("The step."), outcome: ce(160, "What it says.") },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: oe("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: oe("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: oe("The step."), alt: ce(240, "What the picture shows.") },
    boards: ["map"],
    refusals: De
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: ie("The card the line starts at."), to: ie("The card it points to."), label: ce(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: ht()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: ie("One card."), to: ie("The other card.") },
    boards: ["lanes"],
    refusals: ht()
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
    refusals: ht()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: ie("The card."), note: ce(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: ht()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: {
      card: ie("The task."),
      duration: Pe("Its days, 1 to 60.", 60, 1, !0),
      lag: Pe("Days it waits after what it waits on ends, 0 or more (below 0, with override: it starts before what it waits on ends).", 120, -120, !0),
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
    fields: { day: Pe("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: ue(["launch-plan"], G.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ie("The deal or line item."), amount: Pe("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: ue(["pipeline", "budget"], G.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Pe("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: ue(["pipeline"], G.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: oe("The team giving."), to: oe("The team receiving."), amount: Pe("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: ue(["budget"], G.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: Pe("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
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
      lane: oe("With color: the lane (on a 2 by 2, also a quadrant by name).", !0),
      color: sn([...Object.keys(Ln), "none"], "With lane: its color, or none for its own.")
    },
    boards: _e,
    refusals: {}
  }
];
function sn(e, n) {
  return { type: "choice", values: e, optional: !0, about: n };
}
function ht() {
  return { ...ue(["lanes"], G.businessLines), "release-plan": G.lines, "customer-interviews": G.lines, "experiment-budget": G.lines, map: G.lines };
}
const ys = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", kr = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, ks = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function bs(e, n) {
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
      return { ...r({ type: "integer", minimum: e.min, maximum: ks(e.max, n) }, e.nullable), description: e.about };
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
    case "number":
      return { type: "number", minimum: e.min, maximum: e.max, description: e.about };
    case "words":
      return { type: "array", items: { type: "string", minLength: 1, maxLength: e.each }, minItems: e.min, maxItems: e.max, description: e.about };
    case "rule":
      return { type: "object", required: ["kind"], additionalProperties: !1, properties: {
        kind: { enum: kr.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: t,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: t,
        to: { type: "array", items: t, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: t,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: t,
        ...kr.keys
      }, description: e.about };
  }
}
const qr = (e) => "optional" in e && e.optional === !0;
function nl(e) {
  const n = e ? Lt(Q(e)) : void 0;
  return mo.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, d]) => !qr(d)).map(([d]) => d)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([d, u]) => [d, bs(u, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const pt = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function vs(e, n) {
  const t = !!e.lanes[0]?.station, r = ho(e.lanes, t ? pt.step : pt.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = ho(e.cards, t ? pt.token : pt.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
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
function Ot(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function V(e, n, t = null, r) {
  try {
    return Q(e);
  } catch (o) {
    throw new B(Ot(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function xs(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (qr(o)) continue;
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
      case "number":
        if (typeof i != "number" || !Number.isFinite(i)) return d + "a number.";
        break;
      case "words":
        if (!Array.isArray(i) || i.length > o.max || !i.every((u) => typeof u == "string")) return d + "a list of up to " + o.max + " words.";
        break;
      case "rule":
        if (!i || typeof i != "object" || Array.isArray(i) || typeof i.kind != "string") return d + "an object with a kind.";
        break;
    }
  }
  return null;
}
function Is(e, n, t, r, o) {
  const i = structuredClone(e), d = t === "map", u = t === "release-plan", f = vs(i, r), C = { lane: d ? "step" : "lane", card: d ? "token" : "card" };
  function I(c, b, S, A, $ = null) {
    if (typeof S == "object") {
      const j = c.find((F) => F.id === S.id);
      if (!j) throw new B("That " + A + " is no longer on the workshop.", "gone", $);
      return j;
    }
    const _ = c.find((j) => j.id === S);
    if (_) return _;
    try {
      return b.find(S);
    } catch (j) {
      if (!(j instanceof bt)) throw j;
      const F = j.reason === "ambiguous" ? "ambiguous_reference" : j.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new B(j.message, F, $, void 0, j.candidates.length ? j.candidates : void 0);
    }
  }
  const v = (c, b = null) => I(i.lanes, f.lanes, c, "lane", b), k = (c, b = null) => I(i.cards, f.cards, c, "card", b), L = (c) => {
    try {
      return v(c);
    } catch {
      return null;
    }
  }, x = (c, b, S = {}, A = !0) => ({ board: c, said: b, changed: A, ...S }), O = (c) => Qe(i, c), D = (c) => d ? "The presentation opens with " + M(c[0].label) + "." : "The presentation now runs " + c.map((b) => M(b.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return be().edit(i, n, o, {
      lane: (c) => v(c),
      card: (c) => k(c),
      done: (c, b, S) => x(c, b, S),
      refuse: (c, b = {}) => {
        throw new B(c, b.code ?? "refused", b.laneId ?? null, b.cardId);
      }
    });
  if (n.kind === "set_appearance") {
    const { kind: c, lane: b, ...S } = n;
    if (!Object.keys(S).length) throw new B("Say how the board should look: stronger borders, bolder headers, grid lines, compact cards or a column’s color.", "invalid_edit");
    if (S.color === void 0 != (b === void 0)) throw new B("A color is for one column: name the column and the color.", "invalid_edit");
    let A;
    if (b !== void 0) {
      const _ = typeof b == "string" ? b.trim().toLowerCase().replace(/^the\s+|\s+(?:quadrant|square|column|lane)$/g, "") : "", j = i.kind === "nest" && i.nest?.layout === "matrix" ? Object.entries(St).find(([P, U]) => (typeof b == "object" ? b.id : _) === P || _ === P.slice(2) || _ === U.toLowerCase()) : void 0, F = j ? null : v(b);
      A = j ? { key: j[0], label: j[1] } : { key: F.id, label: F.label };
    }
    const $ = cs(i, S, A);
    return x($.board, $.said, A && !A.key.startsWith("q-") ? { laneId: A.key } : {}, $.changed);
  }
  if (Ur.includes(t)) {
    n.kind === "add_card" && br(n, t, v(n.lane).id);
    const c = {
      card: (S) => k(S),
      lane: (S) => v(S),
      refuse: (S, A = {}) => {
        throw new B(S, A.code ?? "refused", A.laneId ?? null, A.cardId, void 0, A.limits);
      },
      settle: (S, A = null, $) => V(S, t, A, $),
      done: (S, A, $) => x(S, A, $),
      who: { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() }
    }, b = ve(t).edit(i, n, c);
    if (b) return b;
  }
  switch (n.kind) {
    case "rename_workshop": {
      i.title = n.title;
      const c = V(i, t);
      return x(c, "Renamed the " + (d ? "map" : "workshop") + " to " + M(c.title) + ".");
    }
    case "rename_lane": {
      const c = v(n.lane), b = c.label;
      c.label = n.label;
      const S = V(i, t, c.id);
      return x(S, "Renamed " + M(b) + " to " + M(S.lanes.find((A) => A.id === c.id).label) + ".", { laneId: c.id });
    }
    case "rename_card": {
      const c = k(n.card), b = c.label;
      c.label = n.label;
      const S = V(i, t, c.laneId, c.id);
      return x(S, "Renamed " + M(b) + " to " + M(S.cards.find((A) => A.id === c.id).label) + ".", { laneId: c.laneId, cardId: c.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new B("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new B("A lane can hold from 1 to 24 cards.", "refused");
      let c;
      try {
        c = Ta(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (S) {
        throw new B(Ot(S.message, t), "refused");
      }
      const b = c.lanes[c.lanes.length - 1];
      return x(c, "Added the lane " + M(b.label) + ".", { laneId: b.id });
    }
    case "remove_lane": {
      const c = v(n.lane), b = i.cards.filter((S) => S.laneId === c.id);
      if (d) {
        if (b.length) throw new B(M(b[0].label) + " is at " + M(c.label) + ". Move it to another step first.", "refused", c.id);
        if (i.lanes.length <= 2) throw new B("A map needs at least two steps.", "refused", c.id);
      } else {
        if (b.length) throw new B(M(c.label) + " holds " + b.length + (b.length === 1 ? " card" : " cards") + ". Move or remove " + (b.length === 1 ? "it" : "them") + " first.", "refused", c.id);
        if (i.lanes.length <= 2) throw new B("A workshop needs at least two columns.", "refused", c.id);
      }
      i.lanes = i.lanes.filter((S) => S !== c);
      for (const S of i.lanes) S.station && (S.station.next = S.station.next.filter((A) => A !== c.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((S) => S !== c.id));
      for (const S of i.cards) S.allowedLaneIds && (S.allowedLaneIds = S.allowedLaneIds.filter((A) => A !== c.id));
      return mt(i, (S) => S.laneId === c.id), i.behaviour && (i.behaviour = be().dropLane(i.behaviour, c.id)), x(V(i, t), "Removed the " + C.lane + " " + M(c.label) + ".", { laneId: c.id });
    }
    case "add_card": {
      const c = v(n.lane);
      if (d) {
        if (n.allowedLanes !== void 0) throw new B(G.mapCardLanes, "not_on_this_board", c.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new B("A workshop can have up to 24 cards. Remove one first.", "refused", c.id);
          const P = et(i, "card");
          i.cards.push({ id: P, label: Rt(n.label?.trim() || fn(i)), laneId: c.id, free: !0 });
          const U = V(i, t, c.id);
          return x(U, "Added " + M(U.cards.find((xe) => xe.id === P).label) + " to " + M(c.label) + ".", { laneId: c.id, cardId: P });
        }
        let $ = n.label;
        if ($ === void 0) {
          let P = i.cards.length + 1;
          for (; i.cards.some((U) => U.label === "Token " + P); ) P++;
          $ = "Token " + P;
        }
        const _ = new Set([...i.lanes, ...i.cards].map((P) => P.id));
        let j = 1;
        for (; _.has("token-" + j); ) j++;
        i.cards.push({ id: "token-" + j, label: $, laneId: c.id });
        const F = V(i, t, c.id);
        return x(F, "Added " + M(F.cards[F.cards.length - 1].label) + " at " + M(c.label) + ".", { laneId: c.id, cardId: "token-" + j });
      }
      if (br(n, t, c.id), i.cards.length >= 24) throw new B("A workshop can have up to 24 cards. Remove one first.", "refused", c.id);
      if (c.capacity !== void 0 && O(c.id) >= c.capacity)
        throw new B(M(c.label) + " is full: it holds " + c.capacity + (c.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", c.id);
      const b = n.allowedLanes && [...new Set(n.allowedLanes.map(($) => v($).id))];
      let S;
      try {
        S = Ea(i, c.id, { label: n.label?.trim() || fn(i), ...b && { allowedLaneIds: b } });
      } catch ($) {
        throw new B(Ot($.message, t), "refused", c.id);
      }
      const A = S.cards[S.cards.length - 1];
      return x(S, "Added " + (A.label ? M(A.label) : "an empty card") + " to " + M(c.label) + ".", { laneId: c.id, cardId: A.id });
    }
    case "remove_card": {
      const c = k(n.card);
      if (d && !c.free && i.cards.filter((b) => !b.free).length === 1) throw new B("A map needs at least one token.", "refused", c.laneId, c.id);
      if (u && i.cards.length === 1) throw new B("A release plan needs at least one feature.", "refused", c.laneId, c.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new B("A launch plan needs at least one task.", "refused", c.laneId, c.id);
      i.cards = i.cards.filter((b) => b !== c);
      for (const b of i.cards)
        b.dependsOn?.includes(c.id) && (b.dependsOn = b.dependsOn.filter((S) => S !== c.id), b.dependsOn.length || delete b.dependsOn);
      return mt(i, (b) => b.cardId === c.id), x(V(Oa(i, c.id), t, c.laneId), "Removed the " + C.card + " " + M(c.label) + ".", { laneId: c.laneId, cardId: c.id });
    }
    case "move_card": {
      const c = typeof n.lane == "object" ? i.lanes.find((A) => A.id === n.lane.id) ?? null : L(n.lane), b = k(n.card, c?.id ?? null), S = v(n.lane, b.laneId);
      return J(b, S, n.override === !0);
    }
    case "advance_card": {
      const c = k(n.card), b = i.lanes.find((A) => A.id === c.laneId), S = b.station.next.map((A) => i.lanes.find(($) => $.id === A)).filter((A) => !!A);
      if (!S.length) throw new B(M(c.label) + " is at " + M(b.label) + ", and no path leads on from there.", "refused", b.id, c.id);
      if (S.length > 1)
        throw new B("From " + M(b.label) + " the path goes to " + S.map((A) => M(A.label)).join(" or ") + ". Say which, such as “Move " + c.label + " to " + S[0].label + "”.", "refused", b.id, c.id);
      return J(c, S[0]);
    }
    case "set_lane_capacity": {
      const c = v(n.lane), b = i.behaviour && be().setLimit(i, c.id, n.capacity, o);
      if (typeof b == "string") throw new B(b, "refused", c.id);
      if (b) return x(b, M(c.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: c.id });
      const S = d ? "token" : u ? "point" : "card";
      if (n.capacity === null)
        return delete c.capacity, x(V(i, t, c.id), d ? "Removed the limit at " + M(c.label) + "." : M(c.label) + " now holds any number of " + S + "s.", { laneId: c.id });
      const A = u ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > A)
        throw new B((d ? "A step" : "A lane") + " can hold from 1 to " + A + " " + S + "s.", "refused", c.id);
      const $ = u ? i.cards.reduce((_, j) => _ + (j.laneId === c.id ? j.points ?? 1 : 0), 0) : O(c.id);
      if ($ > n.capacity)
        throw new B(M(c.label) + " already holds " + $ + " " + S + ($ === 1 ? "" : "s") + ". Move some " + (d ? "on" : "out") + " first, or choose a higher " + (u ? "budget" : "number") + ".", "refused", c.id);
      return c.capacity = n.capacity, x(V(i, t, c.id), M(c.label) + " now holds up to " + n.capacity + " " + S + (n.capacity === 1 ? "" : "s") + ".", { laneId: c.id });
    }
    case "set_card_lanes": {
      const c = k(n.card);
      if (n.lanes === null)
        return delete c.allowedLaneIds, x(V(i, t, c.laneId, c.id), M(c.label) + " can now go in any lane.", { laneId: c.laneId, cardId: c.id });
      const b = [...new Set(n.lanes.map((A) => v(A)))], S = i.lanes.find((A) => A.id === c.laneId);
      if (!b.includes(S)) throw new B(M(c.label) + " is in " + M(S.label) + " now. Include " + M(S.label) + ", or move the card first.", "refused", S.id, c.id);
      return c.allowedLaneIds = b.map((A) => A.id), x(V(i, t, c.laneId, c.id), M(c.label) + " can now go only in " + dn(b.map((A) => M(A.label))) + ".", { laneId: c.laneId, cardId: c.id });
    }
    case "set_card_points": {
      const c = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new B("A feature takes from 1 to 24 points.", "refused", c.laneId, c.id);
      return c.points = n.points, x(V(i, t, c.laneId, c.id), M(c.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: c.laneId, cardId: c.id });
    }
    case "set_card_dependencies": {
      const c = k(n.card), b = [...new Set(n.dependsOn.map((A) => k(A)))], S = { laneId: c.laneId, cardId: c.id };
      if (n.mode === "remove") {
        const A = b.filter(($) => c.dependsOn?.includes($.id));
        if (!A.length) throw new B(M(c.label) + " does not depend on " + dn(b.map(($) => M($.label))) + ".", "refused", c.laneId, c.id);
        return c.dependsOn = c.dependsOn.filter(($) => !A.some((_) => _.id === $)), c.dependsOn.length || delete c.dependsOn, x(V(i, t, c.laneId, c.id), M(c.label) + " no longer depends on " + dn(A.map(($) => M($.label))) + ".", S);
      }
      if (!b.length) {
        if (n.mode === "add") throw new B("Name the features " + M(c.label) + " depends on.", "refused", c.laneId, c.id);
        return delete c.dependsOn, x(V(i, t, c.laneId, c.id), M(c.label) + " no longer depends on anything.", S);
      }
      if (b.includes(c)) throw new B("A feature can’t depend on itself.", "refused", c.laneId, c.id);
      return c.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? c.dependsOn ?? [] : [], ...b.map((A) => A.id)])], x(V(i, t, c.laneId, c.id), M(c.label) + " now depends on " + dn(b.map((A) => M(A.label))) + ".", S);
    }
    case "set_outcome": {
      const c = k(n.card), b = v(n.lane), S = i.signals ?? (i.signals = []), A = n.label, $ = A === void 0 ? S.filter((P) => P.cardId === c.id && P.laneId === b.id) : S.filter((P) => P.cardId === c.id && P.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && $.length > 1) throw new B("Two outcomes on this card have that name.", "refused", b.id, c.id);
      if (!$.length && S.length >= 24) throw new B("A workshop can have up to 24 outcomes. Remove one first.", "refused", b.id, c.id);
      let _ = 1;
      for (; S.some((P) => P.id === "signal-" + _); ) _++;
      const F = { label: A ?? $[0]?.label ?? (c.label + " in " + b.label).slice(0, 80).trim(), cardId: c.id, laneId: b.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return $.length ? Object.assign($[0], F) : S.push({ id: "signal-" + _, ...F }), x(V(i, t, b.id, c.id), "When " + M(c.label) + " is in " + M(b.label) + " the workshop says " + M(n.whenPresent) + ". Otherwise it says " + M(n.whenAbsent) + ".", { laneId: b.id, cardId: c.id });
    }
    case "remove_outcome": {
      const c = k(n.card), b = (i.signals ?? []).filter((S) => S.cardId === c.id);
      if (n.outcome === void 0) {
        if (!b.length) throw new B(M(c.label) + " has no outcome to remove.", "refused", c.laneId, c.id);
        mt(i, (S) => S.cardId === c.id);
      } else {
        const S = I(b, ho(b, "outcomes?", "outcome"), n.outcome, "outcome", c.laneId);
        mt(i, (A) => A.id === S.id);
      }
      return x(V(i, t, c.laneId, c.id), "Removed the outcome from " + M(c.label) + ".", { laneId: c.laneId, cardId: c.id });
    }
    case "set_presentation_order": {
      const c = n.lanes.map((b) => v(b));
      if (c.length !== i.lanes.length || new Set(c).size !== i.lanes.length) throw new B("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = c.map((b) => b.id), x(V(i, t), D(c));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new B("Say before or after, not both.", "invalid_edit");
      const c = v(n.lane), b = n.before ?? n.after, S = b === void 0 ? void 0 : v(b);
      if (S && S.id === c.id) throw new B("Choose two different scenes.", "refused", c.id);
      const A = Wo(i).filter(($) => $.id !== c.id);
      return A.splice(S ? A.findIndex(($) => $.id === S.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, c), i.presentationOrder = A.map(($) => $.id), x(V(i, t, c.id), D(A), { laneId: c.id });
    }
    case "add_station": {
      const c = v(n.from);
      let b;
      try {
        b = Dr(i, c.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new B(A.message, "refused", c.id);
      }
      const S = b.lanes[b.lanes.length - 1];
      return x(b, "Added a path from " + M(c.label) + " to " + M(S.label) + ".", { laneId: S.id });
    }
    case "insert_station": {
      const c = v(n.before), b = n.from === void 0 ? void 0 : v(n.from), S = b ? [b] : i.lanes.filter((_) => _.station.next.includes(c.id));
      if (b && !b.station.next.includes(c.id))
        throw new B("There is no path from " + M(b.label) + " to " + M(c.label) + ". Try “Add " + n.label + " after " + b.label + "”.", "refused", b.id);
      if (!S.length) throw new B("Nothing leads to " + M(c.label) + " yet. Try “Add " + n.label + " after " + c.label + "”.", "refused", c.id);
      let A;
      try {
        A = Dr(i, S[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (_) {
        throw new B(_.message, "refused", c.id);
      }
      const $ = A.lanes[A.lanes.length - 1];
      for (const _ of A.lanes)
        S.some((j) => j.id === _.id) && (_.station.next = [...new Set(_.station.next.map((j) => j === c.id ? $.id : j))]);
      return $.station.next = [c.id], x(V(A, t, $.id), "Added " + M($.label) + " before " + M(c.label) + ".", { laneId: $.id });
    }
    case "connect_stations": {
      const c = v(n.from), b = v(n.to);
      if (c.id === b.id) throw new B("Connect two different steps.", "refused", c.id);
      return c.station.next.includes(b.id) ? x(i, M(c.label) + " already leads to " + M(b.label) + ".", { laneId: c.id }, !1) : (c.station.next.push(b.id), x(V(i, t, c.id), "Connected " + M(c.label) + " to " + M(b.label) + ".", { laneId: c.id }));
    }
    case "disconnect_stations": {
      const c = v(n.from), b = v(n.to);
      if (!c.station.next.includes(b.id)) throw new B("There is no path between " + M(c.label) + " and " + M(b.label) + ".", "refused", c.id);
      return c.station.next = c.station.next.filter((S) => S !== b.id), x(V(i, t, c.id), "Removed the path from " + M(c.label) + " to " + M(b.label) + ".", { laneId: c.id });
    }
    case "set_station_outcome": {
      const c = v(n.station);
      return c.station.outcome = n.outcome, x(V(i, t, c.id), "Changed what happens at " + M(c.label) + ".", { laneId: c.id });
    }
    case "set_station_position": {
      const c = v(n.station);
      return Object.assign(c.station, { column: n.column, row: n.row }), x(V(i, t, c.id), "Moved " + M(c.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: c.id });
    }
    case "set_station_image": {
      const c = v(n.station);
      return n.image === null ? (delete c.station.image, x(V(i, t, c.id), "Removed the image at " + M(c.label) + ".", { laneId: c.id })) : (c.station.image = { src: n.image.src, alt: n.image.alt }, x(V(i, t, c.id), "Updated the image at " + M(c.label) + ".", { laneId: c.id }));
    }
    case "set_station_image_alt": {
      const c = v(n.station);
      if (!c.station.image) throw new B("Add a station image before changing its description.", "refused", c.id);
      return c.station.image.alt = n.alt, x(V(i, t, c.id), "Updated the image description at " + M(c.label) + ".", { laneId: c.id });
    }
    case "connect_cards":
    case "connect_note": {
      const c = k(n.card);
      let b = c.id, S, A;
      if (n.kind === "connect_cards") {
        const P = k(n.to, c.laneId);
        if (P.id === c.id) throw new B("A line joins two different cards.", "refused", c.laneId, c.id);
        S = P.id, A = M(P.label);
      } else {
        const P = n.note.trim();
        if (i.cards.some((U) => U.id === P) || i.lanes.some((U) => U.id === P))
          throw new B("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", c.laneId, c.id);
        S = P, A = "the note " + P, n.direction === "from_note" && ([b, S] = [S, b]);
      }
      const $ = Ii(i, b, S, n.label ? { label: n.label } : {}), _ = Zn(i, $);
      if (_) throw new B(_, "refused", c.laneId, c.id);
      const j = At(i, $), F = b === c.id;
      return x(
        j,
        F ? "Drew a line from " + M(c.label) + " to " + A + "." : "Drew a line from " + A + " to " + M(c.label) + ".",
        { laneId: c.laneId, cardId: c.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const c = k(n.card), b = n.kind === "disconnect_cards" ? k(n.to, c.laneId).id : n.note.trim(), S = n.kind === "disconnect_cards" ? M(i.cards.find((_) => _.id === b).label) : "the note " + b, A = (_) => _.parentId === c.id && _.childId === b || _.parentId === b && _.childId === c.id, $ = i.lines ?? [];
      return $.some(A) ? (i.lines = $.filter((_) => !A(_)), x(V(i, t, c.laneId, c.id), "Took away the line between " + M(c.label) + " and " + S + ".", { laneId: c.laneId, cardId: c.id })) : x(e, M(c.label) + " and " + S + " are not joined by a line.", { laneId: c.laneId, cardId: c.id }, !1);
    }
  }
  throw new B("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function J(c, b, S = !1) {
    const A = { laneId: b.id, cardId: c.id };
    if (c.laneId === b.id)
      return x(e, M(c.label) + " is already " + (d ? "at " : "in ") + M(b.label) + ".", A, !1);
    const $ = cn(e, c.id, b.id);
    if (!$) {
      const _ = Be(e, c.id, b.id) ?? "That move is not available.", j = Xn(e, c.id, b.id, { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() });
      if (S && j) return x(V(j, t, b.id, c.id), "Moved " + M(c.label) + " to " + M(b.label) + " anyway. " + _, A);
      const F = new B(_, "refused", b.id, c.id);
      throw j && (F.overridable = !0), F;
    }
    return x(V($, t, b.id, c.id), "Moved " + M(c.label) + " to " + M(b.label) + ".", A);
  }
}
function br(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new B(r === "amount" ? G.notAmounts : G.notTasks, "not_on_this_board", t);
}
function mt(e, n) {
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
  const i = o, d = [], u = [], f = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [v, k] of n.entries()) {
    const L = k?.kind, x = mo.find(($) => $.kind === L);
    if (!k || typeof k != "object" || !x)
      return r({
        index: v,
        kind: typeof L == "string" ? L : null,
        code: "invalid_edit",
        reason: "There is no edit called " + M(String(L)) + ". The edits are " + dn(mo.map(($) => $.kind)) + "."
      });
    const O = xs(k, x);
    if (O) return r({ index: v, kind: x.kind, code: "invalid_edit", reason: O });
    const D = Lt(o);
    if (!x.boards.includes(D))
      return r({ index: v, kind: x.kind, code: "not_on_this_board", reason: x.refusals[D] ?? "This workshop does not take " + x.kind + "." });
    const J = (k.kind === "move_card" || k.kind === "set_task" || k.kind === "nest_card" || k.kind === "place_tile") && k.override !== !0, c = ($, _) => {
      if (!J || $ !== "refused") return { reason: _ };
      const j = $e(o, [{ ...k, override: !0 }], t);
      return "refused" in j ? { reason: _ } : { reason: j.report.overrides?.[0]?.sentence ?? _, overridable: !0 };
    };
    let b;
    try {
      b = Is(o, k, D, t.selection, f);
    } catch ($) {
      if (!($ instanceof B)) throw $;
      const _ = $.overridable ? { reason: $.reason, overridable: !0 } : c($.code, $.reason);
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
    const S = o.behaviour && !ys(x.kind) && x.kind !== "set_appearance" ? be().check(o, b.board) : null;
    if (S && "refused" in S)
      return r({ index: v, kind: x.kind, ...c("refused", S.refused.sentence), code: "refused", laneId: S.refused.laneId, cardId: S.refused.cardId });
    const A = Cs(o, b.board);
    if (A) return r({ index: v, kind: x.kind, reason: A, code: "not_on_this_board", laneId: b.laneId ?? null });
    if (k.override === !0)
      for (const $ of b.board.cards)
        $.override && ka(o, $) && u.push({ index: v, cardId: $.id, laneId: $.laneId, fromLaneId: $.override.from, sentence: $.override.sentence });
    o = b.board, d.push({
      index: v,
      kind: x.kind,
      said: b.said,
      changed: b.changed ?? !0,
      ...b.laneId && { laneId: b.laneId },
      ...b.cardId && { cardId: b.cardId }
    });
  }
  const C = new Map(i.cards.map((v) => [v.id, v.laneId])), I = o.cards.flatMap((v) => {
    const k = C.get(v.id);
    return k === void 0 || k === v.laneId ? [] : [{ cardId: v.id, fromLaneId: k, toLaneId: v.laneId }];
  });
  return { workshop: o, report: { edits: d, movedCards: I, ...u.length && { overrides: u } } };
}
function As(e, n) {
  const t = ne(e);
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
    const i = ve(t).fixed?.(e, n);
    if (i) return i;
    const d = e.lanes.find((u) => {
      const f = n.lanes.find((C) => C.id === u.id);
      return u.floor !== f.floor || u.cap !== f.cap || u.capacity !== f.capacity;
    });
    if (d) return `${d.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? G.launchLanes : t && ve(t).fixed?.(e, n) || null;
}
const Ss = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map",
  "launch-plan": "launch plan",
  pipeline: "sales pipeline",
  budget: "budget",
  "hiring-plan": "hiring plan",
  nest: "nested board",
  grid: "grid sheet"
};
function Cs(e, n) {
  const t = Q(e), r = Lt(t);
  let o;
  try {
    o = Q(n);
  } catch (f) {
    return Ot(f instanceof Error ? f.message : String(f), r);
  }
  const i = Lt(o), d = (f, C) => f.lanes.length === C.lanes.length && f.lanes.every((I) => C.lanes.some((v) => v.id === I.id)), u = (f, C) => f.lanes.every((I, v) => C.lanes[v]?.id === I.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return d(t, o) ? G.keepsCards : G.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !u(t, o)) return G.keepsOrder;
  if (ne(t) && i === r && r !== "grid" && !(d(t, o) && u(t, o))) return po[r];
  if (ne(t) && i === r) {
    const f = As(t, o);
    if (f) return f;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!d(t, o)) return G.releaseLanes;
    if (!u(t, o)) return G.releaseOrder;
    if (o.cards.some((f) => !t.cards.some((C) => C.id === f.id))) return G.releaseCards;
  }
  return r !== i ? "This board is a " + Ss[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? be().replacement(t, o) : null;
}
const Ls = 48, Yn = 44, vr = 4, Os = 40, Kr = 22, $s = 84, Ts = (e) => Math.min(Yn, Math.max(Kr, Math.ceil(e * 1.45) + 14)), Es = 98, Ms = 88;
function Jr(e, n, t, r = 228, o = Kr) {
  const i = { x: e + 8, y: n + 6, width: r - Ls, height: Os }, d = i.y + i.height + vr, u = Math.min($s, t), f = { x: e + 8 + r - Yn - vr - u, y: d + (Yn - o) / 2, width: u, height: o };
  return { label: i, counter: f, strip: { x: e + 8, y: d, width: r, height: Yn } };
}
function Ps(e, n, t, r) {
  for (let C = n; C > 11; C--) {
    const I = Math.max(1, Math.floor(t / (C * 0.55)));
    if (e.split(`
`).reduce((k, L) => k + Math.max(1, Math.ceil(L.length / I)), 0) * C * 1.3 <= r) return { text: e, fontSize: C };
  }
  const o = Math.min(n, 11), d = Math.max(1, Math.floor(t / (o * 0.55))) * Math.max(1, Math.floor(r / (o * 1.3)));
  if (e.length <= d) return { text: e, fontSize: o };
  const u = e.slice(0, Math.max(1, d - 1)), f = u.lastIndexOf(" ");
  return { text: (f > d / 2 ? u.slice(0, f) : u).trimEnd() + "…", fontSize: o };
}
function tl(e, n) {
  return e.x < n.x + n.width && n.x < e.x + e.width && e.y < n.y + n.height && n.y < e.y + e.height;
}
function Ns(e, n, t) {
  const r = (o) => o && { x: o.x, y: o.y, width: o.width, height: o.height };
  return { width: n, height: t, places: e.filter((o) => o.name.startsWith("column-")).map((o) => {
    const i = o.name.slice(7), d = e.find((f) => f.name === "lane-" + i) ?? (i.startsWith("q-") ? e.find((f) => f.name === "caption-" + i) : void 0), u = d?.name.startsWith("lane-") ? e.find((f) => f.name === "caption-" + i && f.text) : void 0;
    return { laneId: i, x: o.x, y: o.y, width: o.width, height: o.height, row: 0, ...d && { label: r(d) }, ...u && { caption: r(u) } };
  }) };
}
const ol = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function rl(e) {
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
function _s(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function il(e, n) {
  return _s(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const Yr = ["firstPrint", "secondPrint", "thirdPrint"], Zr = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function sl(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Zr, route: n.route };
  for (const r of Yr) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function al(e = new URLSearchParams()) {
  const n = { ...Zr };
  for (const r of Yr) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function ll(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Rs(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Ds(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), js(n), n;
}
function Ws(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function js(e) {
  return e && Ws(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function io(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function qn(e) {
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
function Ds(e) {
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
function wt() {
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
}, Fs = "var(--slatebox-board-font, system-ui, sans-serif)", wo = "http://www.w3.org/2000/svg", xr = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function Fe(e, n, t) {
  const r = document.createElementNS(wo, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", xr(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", xr(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function An(e, n, t, r, o) {
  const i = typeof document < "u" ? document.activeElement : null, d = i && e.contains(i) ? i.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const u = [];
  for (const f of n)
    if (f.t === "line")
      e.appendChild(Fe("line", {
        x1: f.x1,
        y1: f.y1,
        x2: f.x2,
        y2: f.y2,
        "stroke-width": f.width ?? 1,
        ...f.dash ? { "stroke-dasharray": f.dash } : {}
      }, { stroke: f.color }));
    else if (f.t === "rect")
      e.appendChild(Fe("rect", {
        x: f.x,
        y: f.y,
        width: Math.max(0, f.w),
        height: Math.max(0, f.h),
        rx: f.rx ?? 0,
        ...f.opacity !== void 0 ? { opacity: f.opacity } : {},
        ...f.role ? { "data-board-layer": f.role } : {}
      }, { fill: f.color }));
    else if (f.t === "text") {
      const C = Fe("text", {
        x: f.x,
        y: f.y,
        "font-size": f.size ?? 13,
        "text-anchor": f.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...f.bold ? { "font-weight": 600 } : {},
        ...f.role ? { "data-board-layer": f.role } : {},
        ...f.halo ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
      }, { fill: f.color, ...f.halo ? { stroke: f.halo } : {} });
      C.style.setProperty("font-family", Fs), f.lines && f.lines.length > 1 ? f.lines.forEach((I, v) => {
        const k = Fe("tspan", { x: f.x, dy: v ? f.lineHeight ?? Math.round((f.size ?? 13) * 1.25) : 0 });
        k.textContent = v < f.lines.length - 1 ? I + " " : I, C.appendChild(k);
      }) : C.textContent = f.text, e.appendChild(C);
    } else {
      if (f.unlink && t) {
        const { cardId: C, waitsOn: I, label: v } = f.unlink, k = I + ">" + C, L = r?.armed === k, x = Fe("path", {
          d: f.d,
          fill: "none",
          "stroke-width": f.hit ?? 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": k,
          "aria-label": L ? v + ". " + (f.unlink.armed ?? "Tap again to remove it") + "." : v,
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
          r?.arm(null), t(C, I);
        }), x.addEventListener("keydown", (D) => {
          D.key !== "Enter" && D.key !== " " || (D.preventDefault(), D.stopPropagation(), t(C, I));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", In.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          L || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), e.appendChild(x), u.push(x);
      } else if (f.pick && o) {
        const { key: C, label: I } = f.pick, v = Fe("path", {
          d: f.d,
          fill: "none",
          "stroke-width": f.hit ?? 24,
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
          v.style.setProperty("stroke", In.accept), v.setAttribute("opacity", "0.35");
        }), v.addEventListener("blur", () => {
          v.style.setProperty("stroke", "transparent"), v.removeAttribute("opacity");
        }), e.appendChild(v), u.push(v);
      }
      if (e.appendChild(Fe(
        "path",
        {
          d: f.d,
          fill: "none",
          "stroke-width": f.width ?? 1.5,
          "pointer-events": "none",
          ...f.dash ? { "stroke-dasharray": f.dash } : {},
          ...f.role ? { "data-board-layer": f.role } : {},
          ...f.strokeOpacity !== void 0 ? { "stroke-opacity": f.strokeOpacity } : {},
          ...f.fill ? { "stroke-linecap": "round", "stroke-linejoin": "round" } : {}
        },
        { stroke: f.color === "none" ? "transparent" : f.color, ...f.fill && f.fill !== "none" ? { fill: f.fill } : {} }
      )), f.arrow) {
        const { x: C, y: I, angle: v } = f.arrow;
        e.appendChild(Fe("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${I}) rotate(${v})`, "pointer-events": "none" }, { fill: f.color }));
      }
      if (f.unlink && r?.armed === f.unlink.waitsOn + ">" + f.unlink.cardId && f.arrow) {
        const C = Fe("text", {
          x: f.arrow.x - 6,
          y: f.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: In.refuse });
        C.textContent = f.unlink.armed ?? "Tap again to remove this link", e.appendChild(C);
      }
    }
  d && u.find((f) => f.getAttribute("data-board-link") === d)?.focus({ preventScroll: !0 });
}
function zs(e, n, t = {}) {
  const r = e?.canvas?.node, o = document.createElementNS(wo, "g");
  o.setAttribute("data-board-layer", ""), t.exportNever && o.setAttribute("data-export-never", ""), o.setAttribute("pointer-events", "none");
  const i = document.createElementNS(wo, "g");
  i.setAttribute("data-board-layer-top", ""), i.setAttribute("pointer-events", "none");
  let d = !1, u = null, f;
  const C = {
    armed: null,
    arm(v) {
      clearTimeout(f), C.armed = v, v && (f = setTimeout(() => C.arm(null), 5e3), u?.[2].announce?.(u[2].boardFocused && u[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), u && I.draw(...u);
    }
  }, I = {
    draw(v, k, L) {
      if (d || !r) return;
      u = [v, k, L];
      const { origin: x } = L, O = n(k ?? v, L, v), D = (b) => b.t === "text" && (b.role === "clamp" || b.role === "refusal") || b.t === "rect" && !!b.role?.startsWith("grip-");
      for (const b of [o, i])
        b.setAttribute("transform", `translate(${x.x} ${x.y})`), b.toggleAttribute("data-workshop-focused", !!L.boardFocused);
      An(o, O.filter((b) => !D(b)), L.onUnlink, C, L.onPick), An(i, O.filter(D));
      const J = L.above && L.above.parentNode === r ? L.above : null, c = J ? J.nextSibling : r.firstChild;
      (o.parentNode !== r || o.previousSibling !== J) && r.insertBefore(o, c === o ? o.nextSibling : c), i.firstChild && r.lastChild !== i ? r.appendChild(i) : !i.firstChild && i.parentNode && i.remove();
    },
    destroy() {
      d = !0, clearTimeout(f), o.remove(), i.remove();
    }
  };
  return I;
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
}, gt = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, Bs = (e) => e.replace(/\.$/, ""), Hs = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function No(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return Gs(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, d = (u) => n.push(i ? { ...u, warn: i } : u);
    if (o.kind === "bin" && o.lane) d({ icon: "bin", text: gt(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) d({ icon: "gate", text: gt(e, o.into) + " needs " + (o.needs ?? []).map((u) => Hs[u] ?? u).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) d({ icon: "step", text: "One column at a time", seams: t.slice(1).map((u, f) => [t[f], u]) });
      else {
        const u = o.from, f = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(u)) === 1).map((C) => [u, C]);
        d({ icon: "oneway", text: gt(e, u) + " → " + o.to.map((C) => gt(e, C)).join(" or ") + " only", seams: f });
      }
  }
  return n;
}
function Gs(e) {
  if (!hs()) return [];
  let n;
  try {
    n = be().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = Bs(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, d = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: d, text: Us(o), ...i && { warn: i } });
  }
  return t;
}
function Us(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const vt = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Vr(e, n, t, r, o = 12) {
  const i = o / 12, d = (f) => f.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, I, v) => `A${+I * i} ${+v * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, I, v) => `${+(n + +I * i).toFixed(1)},${+(t + +v * i).toFixed(1)}`), u = (f, C = 1.6) => ({ t: "path", d: d(f), color: r, width: C * i });
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
const _o = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function $t(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + vt(e.text, 13 * n, t) + 10 * n);
}
function yt(e, n, t, r, o = {}) {
  const i = 24 * r, d = 10 * r, u = t.icon ? 17 * r : 0, f = $t(t, r, o.bold), C = o.ink ?? fe.chipInk, I = [{
    t: "path",
    d: _o(e, n, f, i, i / 2),
    color: t.warn ? fe.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? fe.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && I.push(...Vr(t.icon, e + d, n + 6 * r, C, 12 * r)), I.push({ t: "text", x: e + d + u, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), I;
}
function Ir(e, n, t, r) {
  return [
    { t: "path", d: _o(n - 11, t - 11, 22, 22, 11), color: fe.badgeLine, width: 1, fill: fe.badge, role: r },
    ...Vr(e, n - 6, t - 6, fe.badgeInk)
  ];
}
const qs = "Preview · not added yet", Xr = 6, Ks = 2.5, go = (e) => Math.round(Math.min(Xr, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, xt = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function Qr(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(Xr, Math.max(1, t.scale ?? 1)), d = i > Ks ? [] : No(e), u = 18 * i, f = 30 * i, C = (_, j) => {
    const F = (t.narrow && j <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (vt(_, 18 * j, !0) <= F) return _;
    const P = Math.max(3, Math.floor(F / (18 * j * 0.58)) - 1);
    return _.slice(0, P).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, I = C(e.title, i), v = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), k = [], L = [2 + vt(C(e.title, 1), 18, !0) + 14];
  t.narrow && d.length && (L[0] = 1 / 0, L.push(2));
  for (const _ of d) {
    const j = $t(_, 1);
    let F = L.findIndex((P) => P + j <= v);
    F < 0 && (L.push(2), F = L.length - 1), k.push({ x: L[F], row: F, item: _, width: j }), L[F] += j + 6;
  }
  const x = k.map((_) => ({ x: r + Math.round(_.x * i), row: _.row, item: _.item, width: $t(_.item, i) })), O = Math.max(1, ...x.map((_) => _.row + 1)), D = o - 14 * i - O * f, J = !!(t.focused || t.draft), c = t.narrow ? 8 : 16, b = J ? { x: r - c, y: D - 18 * i, width: n.width + 2 * c, height: o + n.height + c - (D - 18 * i) } : null, S = Math.max(i, t.tagScale ?? i), A = b ? b.y - 12 * S : D, $ = r + 2 + vt(I, u, !0);
  return { k: i, tagK: S, legend: d, placed: x, rows: O, title: I, titleY: D, titleSize: u, titleRight: $, rowH: f, frame: b, top: A };
}
function yo(e, n, t = {}) {
  const r = Qr(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((I) => I.x + I.width)), d = o ? o.x : 0, u = r.top, f = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: d, y: u, width: f - d, height: C - u };
}
function Ar(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: d, titleY: u, titleSize: f, rowH: C, frame: I } = Qr(e, n, t), v = n.x ?? 0, k = [];
  if (I) {
    const L = _o(I.x, I.y, I.width, I.height, 18);
    t.focused && k.push({ t: "path", d: L, color: fe.focus, width: 12, strokeOpacity: 0.1, fill: fe.focusTint, role: "focus-glow" }), k.push({
      t: "path",
      d: L,
      color: t.focused ? fe.focus : fe.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  k.push({ t: "text", x: v + 2, y: u + 19 * r, text: d, color: fe.title, size: f, bold: !0, role: "board-title" });
  for (const L of i) k.push(...yt(L.x, u + L.row * C + 2 * r, L.item, r));
  if (I) {
    const L = I.y - 12 * o;
    if (t.focused) {
      const x = { text: "Editing" };
      k.push(...yt(I.x + 18, L, x, o, { fill: fe.focus, ink: fe.focusInk, bold: !0, role: "focus-tag" })), k.push(...yt(
        I.x + 18 + $t(x, o, !0) + 6 * o,
        L,
        { text: "Done" },
        o,
        { fill: fe.halo, ink: fe.focus, line: fe.focus, bold: !0, role: "focus-done" }
      ));
    } else
      k.push(...yt(I.x + 18, L, { text: qs }, o, { fill: fe.previewFill, ink: fe.previewInk, bold: !0, role: "draft-tag" }));
  }
  return k;
}
function Sr(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((d) => d.laneId === i);
  for (const i of No(e)) {
    const d = i.lane ? o(i.lane) : void 0;
    if (d) {
      const { label: u, strip: f } = Jr(d.x, d.y, 0);
      r.push(...Ir(i.icon, u.x + Yn / 2, f.y + f.height / 2, "badge-" + i.lane));
    }
    for (const [u, f] of i.seams ?? []) {
      const C = o(u), I = o(f);
      !C || !I || C.row !== I.row || r.push(...Ir(i.icon, (C.x + C.width + I.x) / 2, C.y + Es + Ms / 2, "seam-" + u + ">" + f));
    }
  }
  return r;
}
function Js(e) {
  const n = No(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const dl = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, Cr = "http://www.w3.org/2000/svg";
function Lr(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function Ys(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(Cr, "g") : null, r = typeof document < "u" ? document.createElementNS(Cr, "g") : null;
  for (const I of [t, r])
    I?.setAttribute("data-board-chrome", ""), I?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const d = (I) => ({ layout: I.layout, focused: I.focused, draft: I.draft, scale: I.scale, tagScale: I.tagScale, narrow: I.narrow, places: I.places, room: I.room }), u = (I, v) => {
    const k = yo(I.board, I.size, v);
    return { x: I.origin.x + k.x, y: I.origin.y + k.y, width: k.width, height: k.height };
  }, f = (I) => ({ ...d(I), focused: !1, draft: !1, scale: 1, tagScale: 1 }), C = {
    get scope() {
      return i?.scope ?? "main";
    },
    get draft() {
      return !!i?.draft;
    },
    box(I) {
      if (!i) return null;
      const v = go(I);
      return u(i, { ...d(i), scale: v, tagScale: xt(I, !!(i.narrow && !i.draft), v) });
    },
    plainBox() {
      return i ? u(i, f(i)) : null;
    },
    paintPlain(I, v) {
      if (!i) return;
      const k = f(i);
      I.removeAttribute("data-workshop-focused"), An(I, Ar(i.board, { width: i.size.width, height: i.size.height }, k)), v && (v.removeAttribute("data-workshop-focused"), An(v, Sr(i.board, k)));
    }
  };
  return Lr(e).add(C), {
    draw(I) {
      if (o || !n || !t || !r) return;
      i = I;
      const v = d(I);
      for (const x of [t, r])
        x.setAttribute("transform", `translate(${I.origin.x} ${I.origin.y})`), x.toggleAttribute("data-workshop-focused", !!I.focused), x.toggleAttribute("data-workshop-draft", !!I.draft), x.setAttribute("data-board-scope", I.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", Js(I.board)), An(t, Ar(I.board, { width: I.size.width, height: I.size.height }, v)), An(r, Sr(I.board, v));
      const k = t.querySelector('[data-board-layer="focus-done-box"]');
      if (k && I.onDone) {
        const x = I.onDone;
        k.setAttribute("role", "button"), k.setAttribute("tabindex", "0"), k.setAttribute("aria-label", "Done changing " + I.board.title), k.setAttribute("pointer-events", "all"), k.setAttribute("cursor", "pointer"), k.addEventListener("pointerdown", (O) => O.stopPropagation()), k.addEventListener("click", (O) => {
          O.stopPropagation(), x();
        }), k.addEventListener("keydown", (O) => {
          const D = O.key;
          D !== "Enter" && D !== " " || (O.preventDefault(), O.stopPropagation(), x());
        });
      }
      const L = I.under && I.under.parentNode === n ? I.under : null;
      L ? t.nextSibling !== L && n.insertBefore(t, L) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, Lr(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const ko = "handle-_link-", bo = "handle-_route-", Vn = 40, ei = 44;
function so(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(Vn, Math.ceil(ei / n)));
}
function ni(e) {
  if (e.startsWith(ko)) return { kind: "link", from: e.slice(ko.length) };
  if (e.startsWith(bo)) {
    const [n, t] = e.slice(bo.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const ti = (e) => !!e.lanes[0]?.station, Ve = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function Ro(e) {
  const { places: n } = ze(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function Or(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, d = n.y - o, u = i ? e.width / 2 / Math.abs(i) : 1 / 0, f = d ? e.height / 2 / Math.abs(d) : 1 / 0, C = Math.min(u, f), I = Math.hypot(i, d) || 1;
  return { x: r + i * C + i / I * t, y: o + d * C + d / I * t };
}
function oi(e) {
  if (!ti(e)) return [];
  const n = Ro(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const d = n.get(i);
        if (!d) continue;
        const u = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, f = { x: d.x + d.width / 2, y: d.y + d.height / 2 }, C = Or(o, f, -8), I = Or(d, u, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: I.x, y2: I.y });
      }
  }
  return t;
}
function Zs(e, n) {
  for (const [t, r] of Ro(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function ri(e, n, t = Vn) {
  if (!ti(e)) return [];
  const r = Ro(e), o = t / Vn, i = (u, f, C, I, v) => ({ options: {
    id: u,
    name: I,
    text: v ? "+" : "",
    xPos: n.x + f - t / 2,
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
    const f = r.get(u.id);
    f && d.push(i(ko + u.id, f.x + f.width, f.y + f.height, "Draw a path from " + u.label, !0));
  }
  for (const u of oi(e))
    d.push(i(bo + u.from + "~" + u.to, u.x2, u.y2, "End of the path from " + Ve(e, u.from) + " to " + Ve(e, u.to), !1));
  return d;
}
function Vs(e, n) {
  const t = ni(n);
  return t ? t.kind === "link" ? `Draw a path from ${Ve(e, t.from)}: drag it onto another step.` : `End of the path from ${Ve(e, t.from)} to ${Ve(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function Xs(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((d) => d.id === n.from);
  if (!r?.station || !e.lanes.some((d) => d.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${Ve(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((d) => d !== n.to) : r.station.next, i = e.lanes.map((d) => d.id === r.id ? { ...d, station: { ...d.station, next: [...o, t] } } : d);
  return { next: { ...e, lanes: i } };
}
function Qs(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((u) => u.id === o.id)?.station?.next ?? [], d = o.station?.next ?? [];
    for (const u of i) d.includes(u) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: u } });
    for (const u of d) i.includes(u) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: u } });
  }
  return [...t, ...r];
}
function ea(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? Vn, i = Math.max(24, o * ei / Vn);
  for (const d of oi(e)) {
    const u = Ve(e, d.from) + " to " + Ve(e, d.to), f = `M ${d.x1} ${d.y1} L ${d.x2} ${d.y2}`, C = !r && n.picked === d.key;
    t.push(r ? { t: "path", d: f, color: "transparent", width: 3, hit: i, unlink: { cardId: d.to, waitsOn: d.from, label: "Remove the path from " + u, armed: "Tap again to remove this path" } } : { t: "path", d: f, color: C ? In.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: d.key, label: "Path from " + u + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const d = ri(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, u = d ? d.xPos + o + 6 : 0, f = d ? d.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: u, y: f, text: n.clamp.text, color: In.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
let ii = null;
const vo = /* @__PURE__ */ new Set();
function cl(e) {
  ii = e;
  for (const n of vo) n();
}
const $r = "#1f7a5c", Tr = "#5b9a85", ao = "#c2410c", na = "#a8761b", ta = {
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
}, oa = { canMove: !1, canSelect: !1 }, lo = "A card's line joins notes and cards on its own board.", Kn = /* @__PURE__ */ new WeakMap();
function ra(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ul(e, n, t = {}) {
  const r = nt(t.scope);
  let o = Q(n);
  const i = t.kit, d = (s) => !!ne(s) && !i;
  if (d(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const u = i?.layer(e) ?? (o.lanes[0]?.station ? zs(e, ea) : void 0), f = t.chrome === !1 ? null : Ys(e);
  let C = 1, I = 1, v = null, k = null, L = /* @__PURE__ */ new Set(), x = null, O = null;
  const D = !!t.draft, J = !!t.still;
  let c = !!t.readOnly || D || J, b = c || d(o), S = !1;
  const A = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
  let P = null, U = null, xe = null, he = null, se = null;
  const He = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Ce = /* @__PURE__ */ new Map();
  let ae = null, pe = null;
  function en(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, S || z(O ?? o);
    }, 3e3) };
  }
  let Ie = Promise.resolve(), Ge = null, X = Mr(t.layout), me = X;
  const tt = { ...t.style };
  let Ee = /* @__PURE__ */ new Map(), Dt = /* @__PURE__ */ new Set(), Ho = null, Le = !1, ot = t.controls ?? "off", nn = null, Ft = null;
  const Go = () => gn();
  vo.add(Go);
  let Mn = so(1), rt = null, Pn = null, tn = null, it = !1;
  const we = /* @__PURE__ */ new Map();
  je(o);
  const Y = t.origin ? { x: t.origin.x, y: t.origin.y } : sa(e), st = r ? r + ":" : "", Ae = (s) => F.get(s) ?? (st ? s.startsWith(st) ? s.slice(st.length) : null : s), Uo = (s) => ge(s)?.kind === "column" && !/^column-q-/.test(Ae(s) ?? ""), ge = (s) => {
    const a = Ae(s);
    return a === null ? null : ra(a);
  };
  function le(s) {
    const a = j.get(s);
    if (a) return a;
    const l = st + s;
    if (A.has(l) && !F.has(l) || !e.nodes.one?.(l)) return l;
    const p = $i(l, (m) => !!e.nodes.one?.(m) || F.has(m));
    return j.set(s, p), F.set(p, s), console.warn(`WORKSHOP: the slate already has a note named "${l}". It stays the slate's own; the workshop draws its note as "${p}".`), p;
  }
  function Nn(s, a = 1) {
    let l = [];
    try {
      l = t.avoid?.() ?? [];
    } catch (p) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", p);
    }
    return l.length ? Wa(s, l, a) : { x: s.x, y: s.y };
  }
  function Mi(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (h) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", h);
    }
    const { width: l, height: p } = i ? i.places(o, X) : je(o);
    let m = 1 / 0;
    for (const h of a)
      [h.x, h.y, h.width, h.height].every(Number.isFinite) && h.x >= Y.x + l && h.y < Y.y + p && h.y + h.height > Y.y && (m = Math.min(m, h.x - 32 - Y.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function Pi(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (l) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", l);
    }
    return a.some((l) => [l.x, l.y, l.width, l.height].every(Number.isFinite) && s.x < l.x + l.width && s.x + s.width > l.x && s.y < l.y + l.height && s.y + s.height > l.y);
  }
  function Ni(s, a) {
    const l = [...Kn.get(e) ?? []].filter((g) => g !== Bt);
    if (!l.length) return null;
    const { id: p, note: m } = ir(s, a), h = { id: p, options: m }, w = fo(o, s).some((g) => o.cards.some((y) => y.id !== s && (y.id === g.parentId || y.id === g.childId)));
    for (const g of l) {
      let y = null;
      try {
        y = g.verdict(h, a);
      } catch (T) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", T);
      }
      if (y) return { board: g, ...y, reason: w ? lo : y.reason };
    }
    return null;
  }
  function _i(s, a, l, p) {
    const { added: m, answer: h } = dt(a, l, "", !0), w = Nn(l), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let y;
      try {
        y = s.take(m, p, w);
      } catch (R) {
        console.warn("WORKSHOP: another board could not take the card", R);
      }
      if (y === "taken") return;
      const T = Math.round(w.x), E = Math.round(w.y);
      m.position?.(T, E, () => e.updateSelectionResizeRotate?.(), void 0, wt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [io({ ...m.options, x: T, y: E })] });
    };
    !h || typeof h.then != "function" ? g() : h.then((y) => {
      y === !0 && !S && g();
    }, () => {
    });
  }
  const Me = {
    governs(s) {
      if (A.get(s.id) !== s) return null;
      const a = ge(s.id)?.kind;
      return a === "card" ? { canMove: !b, canEditText: !b && !O && o.kind !== "release-plan", canConnect: Dn() } : a === "lane" ? { canMove: !1, canEditText: !b && !O } : a === "handle" ? { canMove: !b && !O, canEditText: !1, ...!X.narrow && { cursor: i ? "ew-resize" : "grab" }, ...X.narrow && { edgePan: !1 } } : oa;
    },
    onStart(s, a) {
      const l = ge(s.id), p = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (l.kind === "handle") {
        const w = b || O ? null : i ? i.handleDrag(o, Ae(s.id), p, X) : os(Ae(s.id));
        return w ? (re(), qe(), pe && (clearTimeout(pe.timer), pe = null), x = { name: Ae(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = l.key;
      if (b || O || !o.cards.some((w) => w.id === m)) return !1;
      re(), qe();
      let h = null;
      try {
        h = (i?.chooser ?? t.chooseCandidate)?.(o, m, p, X) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return P = { cardId: m, evaluate: h, grab: p, outcome: { kind: "home" } }, z(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (x) {
        x.last = x.follow(Ke(a)), z(x.last.next, { grip: x.name, layout: Mi(x.last.layout) }), q(t.onPreview, x.last.next === o ? null : x.last.next);
        return;
      }
      if (!P) return;
      const l = Zo(P.cardId, a, P.evaluate);
      if (ia(l, P.outcome)) return;
      P.outcome = l;
      const p = l.kind === "candidate" ? l.next : null;
      z(p ?? o, { skip: P.cardId }), q(t.onPreview, p);
    },
    onEnd(s, a) {
      if (x) {
        const { follow: w, name: g } = x, y = w(Ke(a));
        if (x = null, q(t.onPreview, null), y.refusal) {
          en(g, y.refusal), z(o), e.announce?.(y.refusal), q(t.onRefuse, { laneId: null, reason: y.refusal });
          const E = y.override && Er(y.override.edit);
          E && Bn(E, o.cards.find((R) => R.id === E)?.laneId ?? "", y.refusal, y.override);
        } else ut(y.next, {}) || z(o);
        const T = no(o, Ae(s.id));
        return T ? { accept: !0, settle: T } : { accept: !1 };
      }
      if (!P) return { accept: !1 };
      const { cardId: l, evaluate: p } = P, m = Zo(l, a, p), h = o.cards.find((w) => w.id === l);
      if (P = null, q(t.onPreview, null), m.kind === "candidate" && i) {
        if (!ut(m.next, { cardId: l, laneId: m.laneId }, l))
          return z(o, { skip: l }), { accept: !1 };
        m.said && (en("card-" + l, m.said), e.announce?.(m.said));
        const w = no(o, Ae(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, z(o, { skip: l });
        const w = o.lanes.find((y) => y.id === m.laneId);
        e.announce?.(`${Z(h)} moved to ${w.label}. ${Ye(o, w.id)}.`), q(t.onChange, o, { cardId: l, laneId: m.laneId });
        const g = no(o, Ae(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused") {
        const w = m.override ? m.override.to ?? i?.overrideWords?.(o, m.override.edit) : void 0;
        Vi(Z(h), { cardId: l, laneId: m.laneId, reason: m.reason }, w ?? (i && m.laneId === h.laneId ? "there" : void 0)), m.near && en("card-" + l, m.reason), i ? m.override && Bn(l, m.laneId, m.reason, m.override) : m.near || Bn(l, m.laneId, m.reason);
      } else if (m.kind === "outside" && uo() && !Re()) {
        const w = It(o, l);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, y = Ni(l, a);
          if (y?.reason)
            return z(o, { skip: l }), y.board.flash(y.laneId, y.reason), e.announce?.(`${Z(h)} can't go in ${y.laneLabel}. ${y.reason} It stays where it was.`), q(t.onRefuse, { cardId: l, laneId: null, reason: y.reason }), { accept: !1 };
          if (y)
            return _i(y.board, l, g, a), { accept: !0 };
          const T = Pi(g);
          return dt(l, T ? Nn(g) : g, T ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        z(o, { skip: l }), e.announce?.(w), q(t.onRefuse, { cardId: l, laneId: null, reason: w });
      } else
        z(o, { skip: l }), m.kind === "outside" && (e.announce?.(`${Z(h)} was not dropped on a lane. It stays where it was.`), q(t.onRefuse, { cardId: l, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (x) {
        x = null, q(t.onPreview, null), z(o);
        return;
      }
      const a = P && o.cards.find((l) => l.id === P.cardId);
      P = null, q(t.onPreview, null), z(o, { skip: ge(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Z(a)} stays where it was.`);
    },
    onTextCommit(s, a, l) {
      const p = ge(s.id);
      if (!p || b || O) return !1;
      const m = p.kind === "card" ? pi(o.cards.find((N) => N.id === p.key) ?? {}) : null;
      m && (a = a.split(`
`).filter((N) => N.trim() !== m).join(`
`));
      let h = a.replace(/\s+/g, " ").trim();
      const w = p.kind === "lane" ? o.lanes.find((N) => N.id === p.key)?.label : void 0;
      w && h.endsWith("…") && w !== h && w.startsWith(h.slice(0, -1).trimEnd()) && (h = w);
      const g = [], y = ne(o), T = y && p.kind === "card" ? ve(y).renamed(o, p.key, h) : null;
      T && (h = T.label, g.push(...T.edits));
      const E = p.kind === "lane" ? { laneId: p.key, label: h } : { cardId: p.key, label: h };
      g.unshift(p.kind === "lane" ? { kind: "rename_lane", lane: { id: p.key }, label: h } : { kind: "rename_card", card: { id: p.key }, label: h });
      const R = $e(o, g);
      if ("refused" in R) {
        const { reason: N } = R.refused;
        return e.announce?.(`${l} keeps its name. ${N}`), q(t.onRefuse, { ...p.kind === "lane" ? { laneId: p.key } : { cardId: p.key }, rename: E, reason: N }), !1;
      }
      if (JSON.stringify(R.workshop) === JSON.stringify(o))
        return z(o), !1;
      const K = p.kind === "card";
      return K && e.beginHostStep?.(), o = R.workshop, p.kind === "card" && Se.set(p.key, h), K && e.endHostStep?.(), z(o), e.announce?.(T ? R.report.edits.map((N) => N.said).join(" ") : `${l} renamed to ${h}.`), q(t.onChange, o, { rename: E, ...i ? { edits: g } : {} }), T ? !1 : h;
    },
    onKeyDown(s, a) {
      const l = ge(s.id);
      if (b || O || P || x || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (he && (he.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== he.key) && Xo(), he && a.key === "Escape")
        return a.preventDefault(), Xo(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (he && a.key === "Enter") {
        a.preventDefault();
        const w = he.choices[he.at];
        return he = null, q(t.onPreview, null), o = w.next, z(o), e.announce?.(w.done), q(t.onChange, o, { ...l?.kind === "card" ? { cardId: l.key } : {}, edits: w.edits }), !0;
      }
      const p = i?.keyChoices?.(o, Ae(s.id), a.key);
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
      const m = i?.keyEdit?.(o, Ae(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = $e(o, m);
        if ("refused" in w) {
          e.announce?.(w.refused.reason), q(t.onRefuse, { laneId: w.refused.laneId, ...l?.kind === "card" ? { cardId: l.key } : {}, reason: w.refused.reason });
          const g = m.length === 1 && w.refused.overridable ? Er(m[0]) : null;
          g && Bn(g, o.cards.find((y) => y.id === g)?.laneId ?? "", w.refused.reason, { edit: m[0] });
        } else ut(w.workshop, l?.kind === "card" ? { cardId: l.key } : {});
        return !0;
      }
      if (l?.kind !== "card") return !1;
      const h = o.cards.find((w) => w.id === l.key);
      if (!h) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Vo(h.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && ji())
        return a.preventDefault(), Vo(h.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (U?.cardId !== h.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: y } = U;
        if (U = null, w === null)
          return q(t.onPreview, null), dt(h.id, y), !0;
        const T = o;
        o = g, z(o), Ue(w), q(t.onPreview, null);
        const E = o.lanes.find((R) => R.id === w);
        return e.announce?.(`${Z(h)} moved to ${E.label}. ${Ye(o, w)}.`), q(t.onChange, o, { cardId: h.id, laneId: w, ...i ? { edits: i.editsBetween(T, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), qe(), e.announce?.(`Move cancelled. ${Z(h)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => A.get(a.id) === a).map((a) => a.id);
      it = s.length === 1, A.clear(), $.clear(), _.clear(), we.clear(), j.clear(), F.clear(), P = null, U = null, z(O ?? o, { animate: !1 }), s.length === 1 && (Ie = Ie.then(() => {
        it = !1;
        const a = A.get(s[0]);
        if (!S && a && !(e.getSelectedNodes?.() ?? []).length) {
          const l = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(l) : l();
        }
        pn();
      }));
    }
  };
  Me.onFreeMove = (s, a) => {
    if (!_n() || s.options?.isComment) return Ht();
    const l = Rn(a), p = Wn(s), m = jn(s), h = o.lanes.filter((y) => !m && an(o, y.id, p) === null).map((y) => y.id), w = l && i?.noteUnder?.(o, Ke(a), X);
    w && (p.under = w), Qt(p, a);
    const g = l ? m ?? an(o, l, p) : null;
    se && se.noteId === s.id && se.laneId === l && se.refusal === g || (se = { noteId: s.id, laneId: l, refusal: g, open: h }, We());
  }, Me.onFreeDrop = (s, a, l) => {
    if (Ht(), !_n() || s.options?.isComment) return;
    const p = Rn(a);
    if (!p) return;
    const m = Wn(s), h = i?.noteUnder?.(o, Ke(a), X);
    h && (m.under = h), Xt(m, a), Qt(m, a);
    const w = o.lanes.find((y) => y.id === p), g = jn(s) ?? an(o, p, m);
    return g ? (re(!1), ae = { laneId: p, reason: g, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${Gt(m.label)} can't go in ${w.label}. ${g}`), q(t.onRefuse, { noteId: s.id, laneId: p, reason: g }), "refused") : (Kt([{ node: s, offer: m, from: l }], p), "taken");
  }, Me.onFreeGroupDrop = (s, a, l) => {
    if (Ht(), !_n() || s.some((g) => g.options?.isComment)) return;
    const p = Rn(a);
    if (!p) return;
    const m = o.lanes.find((g) => g.id === p), h = s.map((g) => ({ node: g, offer: Xt(Wn(g), a) })), w = zi(h, p);
    if (w) {
      re(!1), ae = { laneId: p, reason: w, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${Qo(h.map((g) => Gt(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of h) q(t.onRefuse, { noteId: g.id, laneId: p, reason: w });
      return "refused";
    }
    return Kt(h.map((g, y) => ({ ...g, from: l?.[y] })), p), "taken";
  }, Me.onFreeTextCommit = (s) => {
    if (!_n() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, l = { x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 }, p = Rn(l);
    if (!p) return;
    const m = Xt(Wn(s), l), h = o.lanes.find((R) => R.id === p), w = jn(s) ?? an(o, p, m);
    if (!w) {
      Kt([{ node: s, offer: m }], p);
      return;
    }
    re(!1), ae = { laneId: p, reason: w, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${Gt(m.label)} can't go in ${h.label}. ${w} It is beside the board.`), q(t.onRefuse, { noteId: s.id, laneId: p, reason: w });
    const { width: g } = je(o), y = Nn({ x: Y.x + g + 32, y: a.y ?? Y.y, width: a.width ?? 0, height: a.height ?? 0 }), T = Math.round(y.x), E = Math.round(y.y);
    s.position(T, E, () => e.updateSelectionResizeRotate?.(), void 0, wt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [io({ ...s.options, x: T, y: E })] });
  }, Me.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...He], lines: (o.lines ?? []).map((s) => ({ ...s })) }), Me.onUndoRestore = (s, a) => {
    if (S) return;
    const l = new Map((s?.cards ?? []).map((h) => [h.id, h])), p = new Map(s?.pairs ?? []), m = (h) => He.get(h) ?? p.get(h) ?? h;
    for (const h of a.added) {
      const w = m(h), g = o.cards.find((T) => T.id === w);
      if (!g || l.has(w)) continue;
      o = Q({ ...o, cards: o.cards.filter((T) => T !== g), lines: bn(o.lines, w, h) }), z(o);
      const y = q(t.onChange, o, { cardId: w, cardToNote: { noteId: h }, via: "undo" });
      e.holdTrade?.(h, y), co(y);
    }
    for (const h of a.removed) {
      const w = m(h), g = l.get(w);
      if (!g || o.cards.some((W) => W.id === w)) continue;
      const y = (s?.lines ?? []).filter((W) => W.parentId === w || W.childId === w), T = Oo(o, g), E = {
        id: w,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...y.length ? { lines: y } : {}
      }, R = [g.laneId, ...o.lanes.map((W) => W.id)].find((W) => Jn(o, W, E));
      if (!R) {
        e.announce?.(`${Z(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = Ji(Jn(o, R, E), w, s?.cards ?? []), w !== h && He.set(h, w), z(o);
      const K = o.cards.findIndex((W) => W.id === w), N = o.cards.slice(K + 1).find((W) => W.laneId === R)?.id, H = q(t.onChange, o, { cardId: w, laneId: R, noteToCard: {
        noteId: h,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...N ? { before: N } : {},
        ...y.length ? { lines: bn(y, w, h) } : {}
      }, via: "undo" });
      e.holdTrade?.(h, H), co(H);
    }
    for (const h of l.values()) {
      const w = o.cards.find((T) => T.id === h.id);
      if (!w || w.label === h.label || Se.get(h.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: h.id }, label: h.label }], y = $e(o, g);
      "refused" in y || (o = y.workshop, Se.set(h.id, h.label), z(o), e.announce?.(`${Z(w)} is called ${Z(h)} again.`), q(t.onChange, o, { rename: { cardId: h.id, label: h.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && Ki(s.lines);
  };
  let zt = !1;
  Me.onNodeAdded = (s) => {
    S || zt || A.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (zt = !0, queueMicrotask(() => {
      zt = !1, S || We();
    }));
  }, Me.onLine = (s, a) => {
    S || queueMicrotask(() => {
      S || Ui(s, a);
    });
  };
  const Ri = e.setDragPolicy(Me), Bt = {
    verdict(s, a) {
      if (!_n()) return null;
      const l = Rn(a);
      if (!l) return null;
      const p = Wn(s), m = i?.noteUnder?.(o, Ke(a), X);
      return m && (p.under = m), Qt(p, a), { laneId: l, laneLabel: o.lanes.find((h) => h.id === l).label, reason: jn(s) ?? an(o, l, p) };
    },
    take: (s, a, l) => Me.onFreeDrop?.(s, a, l),
    flash(s, a) {
      S || !o.lanes.some((l) => l.id === s) || (re(!1), ae = { laneId: s, reason: a, timer: setTimeout(() => re(), 1500) }, We());
    }
  };
  Kn.has(e) || Kn.set(e, /* @__PURE__ */ new Set()), Kn.get(e).add(Bt);
  const Wi = t.onSelect || u || t.onRuleEdit ? e.onSelectionChange?.(() => {
    pn(), fr(), ot === "selected" && gn();
  }) : void 0;
  let at = null;
  const qo = (s) => {
    const l = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, p = l && A.has(l) ? cr(l) : null;
    p !== at && (at = p, fr());
  };
  u && e.element?.addEventListener?.("pointerover", qo);
  const Ko = (s) => {
    if (U && qe(), k && !s?.target?.closest?.("[data-board-pick]") && (k = null, Oe && yn(Oe), queueMicrotask(pn)), Pn = null, tn && (clearTimeout(tn), tn = null), !s || S || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((h) => le(ee.lane(h.id))));
    if ((e.getSelectedNodes?.() ?? []).some((h) => !a.has(h?.id))) return;
    const l = o.lanes.flatMap((h) => [ee.caption(h.id), ee.column(h.id)]).map((h) => A.get(le(h))).filter(Boolean), p = l.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), l, { padding: 0 }) : null, m = p ? ge(p.id) : null;
    m && (Pn = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, Jo = (s) => {
    const a = Pn;
    Pn = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (tn = setTimeout(() => {
      if (tn = null, S || P || x || !o.lanes.some((p) => p.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const l = A.get(le(ee.lane(a.laneId)));
      l && e.selectNodes?.([l]);
    }, 350));
  }, Yo = () => {
    Pn = null;
  };
  e.element?.addEventListener?.("pointerdown", Ko, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Jo, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", Yo, !0), es(), z(o, { animate: !1 });
  function Zo(s, a, l) {
    const p = o.cards.find((E) => E.id === s);
    if (!p) return { kind: "outside" };
    if (i) {
      const E = Ke(a), R = i.refusalAt(o, s, P?.grab ?? { x: 0, y: 0 }, E, X);
      if (R && !R.lands) return { kind: "refused", laneId: R.laneId, reason: R.reason, ...R.override && { override: R.override } };
      const { width: K, height: N } = je(o), H = E.y >= 0 && E.y <= N;
      if (R?.override && H && (E.x < -40 || E.x > K + 40)) return { kind: "refused", laneId: R.laneId, reason: R.reason, override: R.override };
      if (E.x < -40 || E.y < -40 || E.x > K + 40 || E.y > N + 40) return { kind: "outside" };
      let W = o;
      try {
        W = l?.(E) ?? o;
      } catch (te) {
        console.warn("WORKSHOP: the board kit's chooser threw", te);
      }
      return JSON.stringify(W) === JSON.stringify(o) ? R ? { kind: "refused", laneId: R.laneId, reason: R.reason, near: !0, ...R.override && { override: R.override } } : { kind: "home" } : { kind: "candidate", laneId: W.cards.find((te) => te.id === s)?.laneId ?? p.laneId, next: W, ...R && { said: R.reason } };
    }
    const m = o.lanes.map((E) => A.get(le(ee.column(E.id)))).filter(Boolean), h = e.hitTestNodes(a, m, { padding: 6 }), w = h ? ge(h.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === p.laneId) return { kind: "home" };
    const g = cn(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: Be(o, s, w) ?? "That move is not available." };
    if (!l) return { kind: "candidate", laneId: w, next: g };
    let y = null;
    try {
      y = l({ x: a.x - Y.x, y: a.y - Y.y });
    } catch (E) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", E), { kind: "candidate", laneId: w, next: g };
    }
    const T = y?.cards.find((E) => E.id === s)?.laneId;
    return !y || !T || T === p.laneId ? { kind: "home" } : { kind: "candidate", laneId: T, next: y };
  }
  function ji() {
    return i ? !1 : new Set(ze(o, { layout: X }).places.map((s) => s.row)).size > 1;
  }
  function Vo(s, a, l = !1) {
    const p = o.cards.find((N) => N.id === s), m = Nr(o, s), h = U?.cardId === s && U.laneId === null ? U.side : void 0;
    if (h !== void 0) {
      if (l || a === h) return;
      const N = h > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (qe(), N.id === p.laneId) {
        Ue(N.id, O ?? o), e.announce?.(`${Z(p)} is back in ${N.label}.`);
        return;
      }
      if (m.includes(N)) {
        const W = cn(o, s, N.id);
        U = { cardId: s, laneId: N.id, next: W }, z(W), Ue(N.id, W), q(t.onPreview, W), e.announce?.(`${Z(p)} to ${N.label}: ${Ye(W, N.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const H = Be(o, s, N.id) ?? "That move is not available.";
      re(), ae = { laneId: N.id, reason: H, timer: setTimeout(() => re(), 1500) }, z(O ?? o), Ue(N.id, O ?? o), e.announce?.(`${Z(p)} can't move to ${N.label}. ${H}`), q(t.onRefuse, { cardId: s, laneId: N.id, reason: H });
      return;
    }
    const w = U?.cardId === s ? U.laneId : p.laneId;
    let g;
    if (l) {
      const { places: N } = ze(o, { layout: X }), H = N.find((W) => W.laneId === w);
      g = N.filter((W) => W.column === H.column && (W.row - H.row) * a > 0).sort((W, te) => (W.row - te.row) * a).map((W) => o.lanes.find((te) => te.id === W.laneId));
    } else {
      const N = o.lanes.findIndex((H) => H.id === w);
      g = a > 0 ? o.lanes.slice(N + 1) : o.lanes.slice(0, N).reverse();
    }
    const y = g[0] && !m.includes(g[0]) ? g[0] : null, T = y !== null && xe?.cardId === s && xe.laneId === y.id;
    if (xe = null, y && !T) {
      const N = Be(o, s, y.id) ?? "That move is not available.", H = i ? { edit: { kind: "move_card", card: { id: s }, lane: { id: y.id } } } : void 0;
      if (!!t.confirmOverride && !b && !O && !Re() && (i ? !("refused" in $e(o, [{ ...H.edit, override: !0 }], { actor: { by: "check", via: "chat" } })) : Xn(o, s, y.id, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) !== null)) {
        re(), qe(), ae = { laneId: y.id, reason: N, timer: setTimeout(() => re(), 1500) }, z(O ?? o), Ue(y.id, O ?? o), e.announce?.(`${Z(p)} can't move to ${y.label} by this board's rules. ${N} Move it anyway? Cancel, then press the arrow again to pass over it.`), xe = { cardId: s, laneId: y.id }, Bn(s, y.id, N, H);
        return;
      }
    }
    const E = g.find((N) => m.includes(N)), R = y && E ? `${Z(p)} can't go in ${y.label}: ${Be(o, s, y.id) ?? "that move is not available."} ` : "";
    if (re(), !E) {
      const N = g[0];
      if (!N) {
        if (!l && uo()) {
          const W = It(o, s);
          if (W) {
            e.announce?.(W), q(t.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          Di(p, a);
          return;
        }
        e.announce?.(`${Z(p)} has no lane to move to on that side.`);
        return;
      }
      const H = Be(o, s, N.id) ?? "That move is not available.";
      ae = { laneId: N.id, reason: H, timer: setTimeout(() => re(), 1500) }, z(U?.next ?? O ?? o), Ue(N.id, U?.next ?? O ?? o), e.announce?.(`${Z(p)} can't move to ${N.label}. ${H}`), q(t.onRefuse, { cardId: s, laneId: N.id, reason: H });
      return;
    }
    if (E.id === p.laneId) {
      qe(), Ue(E.id, O ?? o), e.announce?.(`${Z(p)} is back in ${E.label}.`);
      return;
    }
    const K = cn(o, s, E.id);
    U = { cardId: s, laneId: E.id, next: K }, z(K), Ue(E.id, K), q(t.onPreview, K), e.announce?.(`${R}${Z(p)} to ${E.label}: ${Ye(K, E.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Ue(s, a = o) {
    const l = i ? ns(a, ee.column(s)) : ze(a, { layout: X, rows: lr() }).places.find((y) => y.laneId === s), p = e.canvas?.viewbox?.();
    if (!l || !p || !(p.width > 0) || !(p.height > 0)) return;
    const m = 16, h = (y, T, E, R) => T + m * 2 >= R || y - m < E ? y - m - E : y + T + m > E + R ? y + T + m - (E + R) : 0, w = h(Y.x + l.x, l.width, p.x, p.width), g = h(Y.y + l.y, l.height, p.y, p.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function pn() {
    if (!t.onSelect || it) return;
    const s = S ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && A.get(s[0].id) === s[0] ? ge(s[0].id) : null;
    k && s.some((w) => !L.has(w.id)) && (k = null, Oe && yn(Oe));
    const [l, p] = k ? k.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : l && p && !a ? { path: { from: l, to: p } } : null, h = m ? JSON.stringify(m) : null;
    h !== Ho && (Ho = h, q(t.onSelect, m));
  }
  function Xo() {
    he && (he = null, z(o), q(t.onPreview, null));
  }
  function qe() {
    U && (U = null, q(t.onPreview, null), z(O ?? o));
  }
  function Di(s, a) {
    const { width: l } = je(o), p = A.get(le(ee.card(s.id)))?.options, m = p?.width ?? 228, h = Nn({
      x: a > 0 ? Y.x + l + 32 : Y.x - m - 32,
      y: p?.y ?? Y.y,
      width: m,
      height: p?.height ?? 76
    }, a), w = Wr(o, s.id);
    U = { cardId: s.id, laneId: null, side: a, spot: h, next: o }, z(o), q(t.onPreview, w), e.announce?.(`${Z(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Re() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function _n() {
    return !S && !b && !O && !P && !Re() && uo();
  }
  function Ht() {
    se && (se = null, S || We());
  }
  function Rn(s) {
    const a = o.lanes.map((p) => A.get(le(ee.column(p.id)))).filter(Boolean), l = e.hitTestNodes(s, a, { padding: 6 });
    return l ? ge(l.id)?.key ?? null : null;
  }
  function Wn(s) {
    const a = s.options ?? {}, l = di({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), p = String(a.text ?? ""), m = p.replace(/\s+/g, " ").trim(), h = {};
    p.trim() !== m && p.length <= 4e3 && (h.text = p.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (h.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (h[g] = Math.round(a[g]));
    if (Ao(a.image)) {
      h.image = { src: a.image };
      for (const [g, y] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[y]) && a[y] >= 1 && a[y] <= 2e4 && (h.image[g] = a[y]);
    }
    a.link?.data && Pr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (h.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = Fi(s);
    return { id: s.id, label: m, ...l ? { look: l } : {}, ...Object.keys(h).length ? { asNote: h } : {}, ...w.length ? { lines: w } : {} };
  }
  function Fi(s) {
    const a = /* @__PURE__ */ new Map(), l = (p) => typeof p == "string" && !!A.get(p) && A.get(p) === e.nodes.one(p);
    for (const p of s.relationships?.getAssociations?.() ?? [])
      (p.targetPoint || !l(p.childId)) && a.set(p.id, Fn(p));
    for (const p of e.nodes?.allNodes ?? [])
      if (!(p === s || l(p.id)))
        for (const m of p.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, Fn(m));
    for (const p of fo(o, s.id)) a.set(p.id, p);
    return [...a.values()];
  }
  function Qo(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function zi(s, a) {
    for (const { node: h } of s) {
      const w = jn(h);
      if (w) return w;
    }
    const l = o.lanes.find((h) => h.id === a), p = Qe(o, a);
    if (l.capacity !== void 0 && !l.station && p + s.length > l.capacity) {
      const h = l.capacity - p;
      return h > 0 ? `It has room for ${h} more ${h === 1 ? "card" : "cards"}.` : `It already holds ${p} of ${l.capacity} ${l.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: h } of s) {
      const w = an(m, a, h);
      if (w) return w;
      m = Jn(m, a, h);
    }
    return null;
  }
  function jn(s) {
    if (s.options?.image && !Ao(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !Pr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : Bi(s) ? lo : null;
  }
  function mn(s) {
    return !!s && A.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function Bi(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && mn(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !mn(a))) {
        for (const l of a.relationships?.getAssociations?.() ?? []) if (l.childId === s.id && !l.targetPoint) return !0;
      }
    return !1;
  }
  const Gt = (s) => s || "This note", Z = (s) => s.label || "The empty card", er = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : ta[a] ?? "shape";
  }, Ut = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, nr = (s) => {
    const a = s.flatMap((l) => {
      const p = er(l.asNote?.shape);
      return p ? [{ card: l, word: p }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: l } = a[0];
      return l === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Ut(l)}: drag it off the board to get its ${l} back.`;
    }
    return " " + a.map(({ card: l, word: p }) => p === "shape" ? `${Z(l)} had its own shape` : `${Z(l)} was ${Ut(p)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, Hi = (s) => {
    const a = er(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Ut(a)} again.` : "";
  };
  function Dn() {
    return !S && !b && !O && !Re() && xa(o);
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
    const l = s.targetPoint;
    return l && Number.isFinite(l.x) && Number.isFinite(l.y) && (a.targetPoint = { x: l.x, y: l.y }, delete a.targetAnchor), a;
  }
  function tr(s, a) {
    const l = { ...s };
    return l.showParentArrow = a.showChildArrow ?? !0, l.showChildArrow = a.showParentArrow ?? !1, delete l.sourceAnchor, delete l.targetAnchor, a.targetAnchor && (l.sourceAnchor = a.targetAnchor), a.sourceAnchor && (l.targetAnchor = a.sourceAnchor), l;
  }
  function or(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (A.get(s.id) === s) {
      const a = ge(s.id);
      return a?.kind === "card" && o.cards.some((l) => l.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || mn(s) ? null : s.id;
  }
  function qt(s, a) {
    if (s.cards.some((p) => p.id === a)) {
      const p = A.get(le(ee.card(a)));
      return p?.relationships && p.svgGroup ? p : null;
    }
    const l = e.nodes.one(a);
    return l && A.get(a) !== l && !mn(l) && l.svgGroup ? l : null;
  }
  function rr(s) {
    const a = [];
    for (const l of s) {
      const p = e.nodes.one(l.parentId);
      if (!p?.relationships || A.get(p.id) === p || p.relationships.hasAssociationId?.(l.id)) continue;
      if (l.targetPoint) {
        const w = p.relationships.addFloatingAssociation(l.targetPoint, qn(l));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(l.childId);
      if (!m || A.get(m.id) === m) continue;
      const h = p.relationships.addAssociation(m, qn(l));
      a.push({ type: "addRelationship", data: { ...h } });
    }
    return a;
  }
  function Gi(s) {
    const a = /* @__PURE__ */ new Set();
    for (const l of s.lines ?? []) {
      if (l.targetPoint) {
        const R = qt(s, l.parentId);
        if (!R || A.get(R.id) !== R) continue;
        const K = { ...l, parentId: R.id }, N = JSON.stringify(K);
        a.add(l.id);
        const H = we.get(l.id);
        if (H && H.key === N && H.holder === R && !H.other && R.relationships.hasAssociationId?.(l.id)) continue;
        H && e.nodes.one(H.holder.id) === H.holder && H.holder.relationships?.removeAssociation?.(l.id), R.relationships.addFloatingAssociation(l.targetPoint, qn(K)), we.set(l.id, { holder: R, other: null, swapped: !1, key: N });
        continue;
      }
      const p = qt(s, l.parentId), m = qt(s, l.childId);
      if (!p || !m || p === m) continue;
      const h = A.get(p.id) !== p, w = h ? m : p, g = h ? p : m, y = h ? tr({ ...l, parentId: w.id, childId: g.id }, l) : { ...l, parentId: w.id, childId: g.id }, T = JSON.stringify(y);
      a.add(l.id);
      const E = we.get(l.id);
      E && E.key === T && E.holder === w && E.other === g && w.relationships.hasAssociationId?.(l.id) || (E && e.nodes.one(E.holder.id) === E.holder && E.holder.relationships?.removeAssociation?.(l.id), w.relationships.addAssociation(g, qn(y)), we.set(l.id, { holder: w, other: g, swapped: h, key: T }));
    }
    for (const [l, p] of [...we])
      a.has(l) || (e.nodes.one(p.holder.id) === p.holder && p.holder.relationships?.hasAssociationId?.(l) && p.holder.relationships.removeAssociation(l), we.delete(l));
  }
  function lt(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, l = s.id ?? s.childId;
    !a?.relationships || !l || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(l) || !s.id) && a.relationships.removeAssociation(l);
    });
  }
  let zn = null;
  function Ui(s, a) {
    if (s === "addRelationship") {
      if (we.get(a?.id)?.holder.id === a?.parentId) return;
      const l = !!a?.targetPoint, p = e.nodes.one(a?.parentId), m = l ? null : e.nodes.one(a?.childId), h = or(p), w = l ? null : or(m);
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
      if (mn(m)) return y(lo);
      if (!h || !w && !l) return y(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const T = l ? String(a.childId) : w;
      if (g) {
        const K = o.cards.some((te) => te.id === h), N = !l && o.cards.some((te) => te.id === w);
        if (!K && !N) return on({ remove: g.id });
        const H = { ...Fn(a), id: g.id, parentId: h, childId: T }, W = Zn(o, H);
        if (W) return y(W);
        lt(a), on({ set: H });
        return;
      }
      const E = Ii(o, h, T, Fn(a)), R = Zn(o, E);
      if (R) return y(R);
      lt(a), on({ set: E });
      return;
    }
    if (s === "removeRelationship") {
      const l = [...we].find(([m, h]) => (m === a?.id || !a?.id && h.other?.id === a?.childId) && h.holder.id === a?.parentId)?.[0];
      if (!l) return;
      const p = we.get(l);
      if (we.delete(l), e.nodes.one(p.holder.id) !== p.holder || p.other && e.nodes.one(p.other.id) !== p.other || !Dn())
        return Dn() || S ? void 0 : z(O ?? o);
      zn = { lineId: l }, queueMicrotask(() => {
        S || zn?.lineId !== l || (zn = null, on({ remove: l }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const l of Array.isArray(a) ? a : [a]) {
        const p = [...we].find(([E, R]) => E === l?.associationId && R.holder.id === l?.id);
        if (!p) continue;
        const [m, h] = p, w = o.lines?.find((E) => E.id === m), g = h.holder.relationships?.getAssociations?.().find((E) => E.id === m);
        if (!w || !g) continue;
        if (!Dn()) {
          z(O ?? o);
          continue;
        }
        const y = Fn(g), T = h.swapped ? tr({ ...y, id: w.id, parentId: w.parentId, childId: w.childId }, y) : { ...y, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(qi(T)) !== JSON.stringify(w) && (we.set(m, { ...h, key: "" }), on({ set: T }));
      }
  }
  function qi(s) {
    return At({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function on(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), l = "set" in s ? At(o, s.set) : jr(o, s.remove);
    if (!l || l === o) return;
    e.beginHostStep?.(), o = l, e.endHostStep?.(), z(O ?? o);
    const p = "set" in s ? s.set : a, m = [p.parentId, p.childId].map((g) => o.cards.find((y) => y.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), h = (g) => m[g] || (g === 1 && p.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${h(0)} to ${h(1)} changed.` : p.targetPoint ? `${h(0)} has a line to a point on the canvas.` : `${h(0)} is joined to ${h(1)}.` : `The line from ${h(0)} to ${h(1)} was taken away.`);
    const w = q(t.onChange, o, { line: s });
    co(w, () => {
      if (S || o !== l) return;
      const g = a ? At(o, a) : "set" in s ? jr(o, s.set.id) : null;
      g && (o = g, z(O ?? o));
    });
  }
  function Ki(s) {
    const a = new Map(s.map((p) => [p.id, p])), l = new Map((o.lines ?? []).map((p) => [p.id, p]));
    for (const p of l.keys()) a.has(p) || on({ remove: p });
    for (const [p, m] of a)
      JSON.stringify(l.get(p)) !== JSON.stringify(m) && Zn(o, m) === null && on({ set: m });
  }
  function Kt(s, a) {
    let l = o;
    const p = /* @__PURE__ */ new Map(), m = s.map(({ node: y, offer: T, from: E }) => {
      let R = T.lines;
      for (const [H, W] of p) R = bn(R, H, W);
      l = Jn(l, a, { ...T, ...R ? { lines: R } : {} });
      const K = l.cards[l.cards.length - 1];
      K.id !== y.id && p.set(y.id, K.id);
      const N = { ...y.options ?? {}, ...E ? { x: E.x, y: E.y } : {} };
      return { node: y, card: K, kept: N, lines: bn(R ?? [], y.id, K.id), under: T.under, day: T.day };
    });
    e.beginHostStep?.(), o = l;
    let h = o;
    for (const { node: y, card: T } of m)
      T.id !== y.id && He.set(y.id, T.id), Ce.set(le(ee.card(T.id)), { x: y.options?.x ?? 0, y: y.options?.y ?? 0 }), wn(() => e.removeNode(y.id));
    e.endHostStep?.(), z(o), Yi(le(ee.card(m[0].card.id)));
    const w = m.length === 1 && Rr(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && Zi(le(ee.card(w.id)), w.label);
    const g = o.lanes.find((y) => y.id === a);
    e.announce?.(m.length === 1 ? `${Z(m[0].card)} is now a card in ${g.label}. ${Ye(o, a)}.${nr([m[0].card])}` : `${Qo(m.map(({ card: y }) => Z(y)))} are now cards in ${g.label}. ${Ye(o, a)}.${nr(m.map(({ card: y }) => y))}`);
    for (const { node: y, card: T, kept: E, lines: R, under: K, day: N } of m) {
      const H = { cardId: T.id, laneId: a, noteToCard: {
        noteId: y.id,
        label: Oo(o, T),
        ...K && { under: K },
        ...N !== void 0 && { day: N },
        ...T.look ? { look: T.look } : {},
        ...T.asNote ? { asNote: T.asNote } : {},
        ...R.length ? { lines: R } : {}
      } }, W = () => {
        o !== h || !o.cards.some((ke) => ke.id === T.id) || (o = Q({ ...o, cards: o.cards.filter((ke) => ke.id !== T.id), lines: bn(o.lines, T.id, y.id) }), h = o, z(o));
      }, te = q(t.onChange, o, H);
      e.holdTrade?.(y.id, te), sr(te, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: y.id, isComment: !1 } }]);
      }, () => {
        if (!S) {
          if (W(), !e.nodes.one(E.id)) {
            e.beginHostStep?.();
            const ke = wn(() => e.addNode({ ...E }));
            ke && (ke.announcedByCreator = !0), e.endHostStep?.();
            const Gn = bn(R, T.id, y.id).filter((de) => !o.cards.some((Un) => Un.id === de.parentId || Un.id === de.childId));
            ke?.ready?.then?.(() => {
              S || wn(() => rr(Gn));
            });
          }
          e.announce?.(`${Z(T)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        S || (W(), e.keepTrade?.(y.id), e.announce?.(`Someone else put ${Z(T)} on the board first.`));
      });
    }
  }
  function ir(s, a) {
    const l = o.cards.find((E) => E.id === s), p = $.get(le(ee.card(s))) ?? {}, m = si(l), h = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = (tt.cornerRadius ?? 0) > 0, g = l.asNote, y = Rr(o, l), T = {
      id: h,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: g?.width ?? p.width ?? 228,
      height: g?.height ?? p.height ?? 76,
      text: y,
      shape: g?.shape ?? (w ? "roundedrectangle" : "rectangle"),
      backgroundColor: l.look?.backgroundColor ?? p.backgroundColor,
      fontColor: l.look?.textColor ?? p.foregroundColor,
      fontSize: l.look?.fontSize ?? p.fontSize,
      borderColor: l.look?.borderColor ?? p.borderColor,
      borderWidth: l.look?.borderWidth ?? p.borderWidth,
      ...l.look?.fontFamily ?? p.fontFamily ? { fontFamily: l.look?.fontFamily ?? p.fontFamily } : {}
    };
    g?.image && Object.assign(T, {
      image: g.image.src,
      ...g.image.width ? { imageOrigWidth: g.image.width } : {},
      ...g.image.height ? { imageOrigHeight: g.image.height } : {}
    }), g?.link && (T.link = { ...g.link });
    for (const E of Object.keys(T)) T[E] === void 0 && delete T[E];
    return { id: h, note: T };
  }
  function dt(s, a, l = "", p = !1) {
    const m = o.cards.find((de) => de.id === s), h = o.lanes.find((de) => de.id === m.laneId), w = o.cards.findIndex((de) => de.id === s), g = o.cards.slice(w + 1).find((de) => de.laneId === m.laneId)?.id, { id: y, note: T } = ir(s, a), E = m.asNote, R = fo(o, s), { leave: K } = Ca(o, s, y), N = Wr(o, s, y);
    e.beginHostStep?.(), o = N;
    const H = o;
    y !== s ? He.set(y, s) : He.delete(y);
    const W = wn(() => e.addNode(T));
    W && (W.announcedByCreator = !0), e.endHostStep?.(), z(o);
    const te = Promise.resolve(W?.ready).then(() => S || !W || e.nodes.one(y) !== W ? [] : wn(() => rr(K))).catch(() => []);
    W?.ready?.then?.(() => {
      if (S || e.nodes.one(y) !== W) return;
      const de = () => e.selectNodes?.([W]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(de) : de();
    }), p || e.announce?.(`${Z(m)} is now a note on the canvas.${l} ${h.label}: ${Ye(o, h.id)}.${Hi(E?.shape)}`);
    const ke = () => {
      e.nodes.one(y) === W && (e.beginHostStep?.(), wn(() => e.removeNode(y)), e.endHostStep?.());
    }, Gn = q(t.onChange, o, { cardId: s, cardToNote: { noteId: y } });
    return e.holdTrade?.(y, Gn), sr(Gn, () => {
      te.then((de) => {
        W && e.nodes.one(y) === W && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: io(W.options) } }, ...de]);
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
          }, Un = Jn(o, m.laneId, de, g);
          Un && (o = Un, z(o));
        }
        e.announce?.(`${Z(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      S || (ke(), e.keepTrade?.(y), e.announce?.(`Someone else took ${Z(m)} off the lanes first.`));
    }), { added: W, answer: Gn };
  }
  function Ji(s, a, l) {
    const p = l.map((y) => y.id), m = p.indexOf(a), h = s.cards.find((y) => y.id === a);
    if (m < 0 || !h) return s;
    const w = s.cards.filter((y) => y !== h), g = w.findIndex((y) => p.indexOf(y.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, h), Q({ ...s, cards: w });
  }
  function Yi(s) {
    Ie = Ie.then(() => {
      const a = A.get(s);
      if (S || !a) return;
      const l = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(l) : l();
    });
  }
  function Zi(s, a) {
    Ie = Ie.then(() => {
      const l = A.get(s);
      S || b || !l?.editor?.startInline || l.editor.startInline({ text: a, caret: "all" });
    });
  }
  function wn(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function sr(s, a, l, p) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((h) => {
      h === !0 ? a() : h === !1 ? l() : h === "taken" && p();
    }, () => l());
    e.holdUntil?.(m);
  }
  function Bn(s, a, l, p) {
    if (!t.confirmOverride || b || O || Re()) return;
    const m = { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }, h = (N, H) => {
      if (!p) {
        const te = Xn(N, s, a, H);
        return te && { next: te };
      }
      const W = $e(N, [{ ...p.edit, override: !0 }], { actor: { by: H.by, via: "chat" }, now: H.at });
      return "refused" in W ? null : { next: W.workshop, said: W.report.edits.map((te) => te.said).join(" ") };
    }, w = h(o, m);
    if (!w) return;
    const g = o.cards.find((N) => N.id === s), y = o.lanes.find((N) => N.id === a);
    if (!g) return;
    const T = w.next.cards.find((N) => N.id === s)?.override?.sentence ?? l, E = p?.to ?? (p && i?.overrideWords?.(o, p.edit));
    let R;
    const K = { cardId: s, laneId: a, card: g.label, lane: y?.label ?? "", reason: T, ...E && { to: E } };
    try {
      R = t.confirmOverride(K);
    } catch (N) {
      console.error("WORKSHOP: confirmOverride threw", N);
      return;
    }
    Promise.resolve(R).then((N) => {
      if (N !== !0 || S || b || O || Re()) return;
      const H = o.cards.find((ke) => ke.id === s), W = H && h(o, { by: q(t.overrideBy) || "You", at: (/* @__PURE__ */ new Date()).toISOString() });
      if (!H || !W) {
        e.announce?.(`${H ? Z(H) : "That card"} can't be moved ${E ?? "to " + (y?.label ?? "there")} now.`);
        return;
      }
      o = W.next, z(o), e.announce?.(W.said ?? `${Z(H)} moved to ${y?.label ?? ""} anyway. ${T}`);
      const te = o.cards.find((ke) => ke.id === s)?.laneId ?? a;
      q(t.onChange, o, { cardId: s, laneId: te, override: !0, reason: T, ...p && { edits: [{ ...p.edit, override: !0 }] } });
    }, () => {
    });
  }
  function Vi(s, a, l) {
    re(!1), ae = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => re(), 1500) }, z(o, { skip: a.cardId });
    const p = o.lanes.find((m) => m.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move ${l ?? "to " + (p?.label ?? "that lane")}. ${a.reason}`), q(t.onRefuse, a);
  }
  function re(s = !0) {
    ae && (clearTimeout(ae.timer), ae = null, s && !S && We());
  }
  function We() {
    z(P && P.outcome.kind === "candidate" ? P.outcome.next : U?.next ?? O ?? o, { skip: P?.cardId });
  }
  function ar(s) {
    const a = hr(s, lr()), l = new Map(a.map((h) => [h.options.id, h.options])), p = (h, w, g, y = !1) => {
      const T = l.get(ee.column(h));
      T && (T.borderColor = w, T.borderWidth = g, delete T.borderStyle);
      const E = y && l.get(ee.lane(h));
      E && (E.borderColor = w, E.borderWidth = g);
    }, m = P?.cardId ?? U?.cardId;
    if (Ee = /* @__PURE__ */ new Map(), m) {
      const h = o.cards.find((y) => y.id === m)?.laneId, w = Nr(o, m);
      if (!i || i.laneCues)
        for (const y of w) y.id !== h && (p(y.id, Tr, 2), Ee.set(y.id, "open"));
      if (i?.laneCues) {
        for (const y of o.lanes) if (!w.includes(y)) {
          const T = l.get(ee.column(y.id));
          T && (T.backgroundColor = "#e9e8e2"), Ee.set(y.id, "closed");
        }
      }
      const g = P ? P.outcome : U?.laneId ? { kind: "candidate", laneId: U.laneId } : null;
      g?.kind === "candidate" && (p(g.laneId, $r, 3, !0), Ee.set(g.laneId, "over")), g?.kind === "refused" && (p(g.laneId, ao, 3), Ee.set(g.laneId, "refused"));
    }
    if (se && !m) {
      for (const h of se.open) h !== se.laneId && (p(h, Tr, 2), Ee.set(h, "open"));
      se.laneId && !se.refusal && (p(se.laneId, $r, 3, !0), Ee.set(se.laneId, "over")), se.laneId && se.refusal && (p(se.laneId, ao, 3), Ee.set(se.laneId, "refused"));
    }
    if (U?.laneId === null && U.spot) {
      const h = l.get(ee.card(U.cardId));
      h && (h.xPos = U.spot.x, h.yPos = U.spot.y);
    }
    if (ae) {
      Ee.set(ae.laneId, "refused"), p(ae.laneId, ao, 3, !0);
      const h = l.get(ee.caption(ae.laneId));
      if (h && (h.text = ae.reason, h.foregroundColor = "#b42318", !i)) {
        const w = l.get(ee.column(ae.laneId));
        w && (h.xPos = w.xPos + 6, h.width = w.width - 12, h.height = 30, h.vectorPath = ln(h.width, 30, 0), h.backgroundColor = "transparent");
      }
    }
    if (Dt = /* @__PURE__ */ new Set(), O && s === O) {
      const h = (g, y) => JSON.stringify(g) === JSON.stringify(y), w = (g) => {
        const y = l.get(g);
        y && (y.borderStyle = "dashed", y.borderColor = na, y.borderWidth = 2, Dt.add(le(g)));
      };
      for (const g of s.cards) h(g, o.cards.find((y) => y.id === g.id)) || w(ee.card(g.id));
      for (const g of s.lanes) h(g, o.lanes.find((y) => y.id === g.id)) || w(ee.lane(g.id));
    }
    for (const h of a) {
      h.options.id = le(h.options.id);
      for (const w of h.relationships.associations)
        w.parentId = le(w.parentId), w.childId = le(w.childId);
    }
    return a;
  }
  function lr() {
    return P || U ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function z(s, a = {}) {
    if (S) return;
    me = a.layout ?? X, Ge = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const l = ar(s), p = [];
    for (const { options: h } of l) {
      const w = h.id;
      if (A.has(w)) continue;
      const g = Ce.get(w);
      Ce.delete(w);
      const y = g && a.animate !== !1 && !wt() ? { ...h, xPos: g.x, yPos: g.y } : h, T = e.nodes.add(Rs(y));
      A.set(w, T), $.set(w, { ...y }), T.ready && p.push(T.ready.then(() => {
        if (A.get(w) !== T) return;
        T.applyGovernance?.(), Uo(w) && T.toBack?.(!1), ge(w)?.kind === "handle" && T.svgGroup?.front?.();
        const E = pr(Ge?.model ?? s, w);
        E && T.svgGroup?.node?.setAttribute("aria-label", E);
      }).catch(() => {
      }));
    }
    const m = Ge;
    Ie = Promise.all([Ie, ...p]).then(() => {
      S || Ge !== m || Xi(ar(m.model), m);
    }).catch((h) => console.warn("WORKSHOP: could not draw the workshop", h));
  }
  function Xi(s, a) {
    const l = new Set(s.map((m) => m.options.id)), p = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [h, w] of [...A]) {
        if (l.has(h)) continue;
        for (const [y, T] of [..._])
          T.parentId !== h && T.childId !== h || (T.parent.relationships?.removeAssociation(y), _.delete(y));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), A.delete(h), $.delete(h);
        const g = F.get(h);
        g && (F.delete(h), j.delete(g)), e.nodes.remove(h);
      }
      for (const { options: h } of s) {
        const w = h.id, g = A.get(w);
        if (!g?.svgGroup) continue;
        const y = $.get(w) ?? {}, T = g.editor?.isInlineEditing?.();
        (h.fontSize !== y.fontSize || h.foregroundColor !== y.foregroundColor || h.fontWeight !== y.fontWeight) && (g.options.fontSize = h.fontSize, g.options.fontColor = h.foregroundColor, g.options.fontWeight = h.fontWeight, g.applyTextStyle?.()), (h.width !== y.width || h.height !== y.height) && (h.vectorPath ? (g.options.width = h.width, g.options.height = h.height, g.setShape?.(g.options.shape, h.vectorPath), Uo(w) && g.toBack?.(!1)) : g.setSize?.(h.width, h.height)), h.text !== y.text && !T && g.setText?.(h.text), h.backgroundColor !== y.backgroundColor && g.setColors?.(h.backgroundColor), (h.borderColor !== y.borderColor || h.borderWidth !== y.borderWidth || h.borderStyle !== y.borderStyle) && (g.options.borderColor = h.borderColor, g.options.borderWidth = h.borderWidth, g.options.borderStyle = h.borderStyle, g.applyBorder?.());
        const E = h.xPos !== y.xPos || h.yPos !== y.yPos || Math.abs((g.options.x ?? 0) - h.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - h.yPos) > 0.5;
        if (w !== (a.skip && le(ee.card(a.skip))) && w !== (a.grip && le(a.grip)) && E) {
          const N = a.animate && !wt() ? 180 : 0, H = p.includes(g) ? () => {
            !S && A.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          H && N && p.length === 1 && g.resizeRotate?.disable?.(), g.position(h.xPos, h.yPos, H, void 0, N);
        }
        const R = pr(a.model, w);
        R && g.svgGroup.node.getAttribute("aria-label") !== R && g.svgGroup.node.setAttribute("aria-label", R), Dt.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", Le), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", D);
        const K = ge(w);
        if (K?.kind === "column") {
          const N = Ee.get(K.key);
          N ? g.svgGroup.node.setAttribute("data-workshop-drop", N) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        K?.kind === "handle" && g.svgGroup.front?.(), $.set(w, { ...h });
      }
      const m = /* @__PURE__ */ new Map();
      for (const h of s) for (const w of h.relationships.associations) m.set(w.id, w);
      for (const [h, w] of [..._])
        m.has(h) && A.get(w.parentId) === w.parent && A.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(h), _.delete(h));
      for (const [h, w] of m) {
        if (_.has(h)) continue;
        const g = A.get(w.parentId), y = A.get(w.childId);
        !g?.relationships || !y?.svgGroup || (g.relationships.addAssociation(y, qn(w)), _.set(h, { parentId: w.parentId, childId: w.childId, parent: g, child: y }));
      }
      Gi(a.model);
    }), yn(a.model), Jt = a.model, Zt(), e.notifyNodeChanged?.();
  }
  let Jt = null;
  function Hn() {
    return !!me.narrow || me.lanesPerRow === 1;
  }
  function Yt() {
    let s;
    try {
      s = Ra(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: me, focused: Le, draft: D, scale: C, tagScale: I, narrow: Hn(), room: s };
  }
  function dr() {
    if (J) return [1, 1];
    const s = eo(), a = go(s);
    return [a, Math.round(xt(s, Hn() && !D, a) * 20) / 20];
  }
  function Zt() {
    if (!f || S) return;
    [C, I] = dr();
    const s = Jt ?? o, a = i ? i.places(s, me) : ze(s, { layout: me }), l = i || s.lanes[0]?.station ? void 0 : a.places;
    let p = null;
    for (const w of A.values()) {
      const g = w.svgGroup?.node;
      g?.parentNode && (!p || g.compareDocumentPosition(p) & 4) && (p = g);
    }
    f.draw({
      board: s,
      scope: r,
      origin: Y,
      size: { width: a.width, height: a.height },
      ...Yt(),
      places: l,
      under: p,
      ...t.onFocusDone && { onDone: () => q(t.onFocusDone) }
    });
    const m = i ? Ns(a.parts, a.width, a.height).places : void 0;
    Ft = { places: l?.map((w) => ({ ...w, ...Ei(s, w, tt) })) ?? m, width: a.width, height: a.height }, gn();
  }
  function Qi() {
    return (S ? [] : e.getSelectedNodes?.() ?? []).some((a) => A.get(a.id) === a);
  }
  function gn() {
    const s = ii, a = Jt ?? o;
    if (!!!(s && Ft && !S && !b && !D && !J && !O && ot !== "off" && (ot === "always" || Le || Qi()))) {
      nn?.remove(), nn = null;
      return;
    }
    let p;
    try {
      p = s.controls(a, Ft, { scale: Math.min(2, C), finger: Hn() });
    } catch {
      p = [];
    }
    nn ? nn.update(p, Y) : nn = s.draw(e, r ?? "main", p, {
      origin: Y,
      announce: (m) => e.announce?.(m),
      onRuleEdit: (m, h) => {
        if (S || b || !t.onRuleEdit) return !1;
        const w = q(t.onRuleEdit, m, h);
        return w instanceof Promise ? w.then(Boolean, () => !1) : !!w;
      }
    });
  }
  function es() {
    const s = e.canvas?.node, a = dr;
    if ([C, I] = a(), J || !f || !s || typeof MutationObserver > "u") return;
    let l = null;
    const p = new MutationObserver(() => {
      l && clearTimeout(l), l = setTimeout(() => {
        l = null;
        const [m, h] = a();
        S || m === C && h === I || (C = m, I = h, Zt());
      }, 120);
    });
    p.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), v = () => {
      p.disconnect(), l && clearTimeout(l);
    };
  }
  let Oe = null;
  function cr(s) {
    const a = ge(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, Ae(s)) ?? null : null;
  }
  function ur() {
    if (x) return i?.cardOfPart?.(o, x.name) ?? null;
    if (P) return P.cardId;
    if (at) return at;
    const s = S ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && A.get(s[0].id) === s[0] ? cr(s[0].id) : null;
  }
  let Vt = null;
  function fr() {
    S || !u || !Oe || ur() !== Vt && yn(Oe);
  }
  function yn(s) {
    if (u) {
      Oe = s, Vt = ur();
      const a = o.lanes.map((m) => A.get(le(ee.column(m.id)))?.svgGroup?.node).reduce((m, h) => h && (!m || m.compareDocumentPosition(h) & 4) ? h : m, null), l = e.canvas?.viewbox?.(), p = l && [l.x, l.y, l.width, l.height].every(Number.isFinite) ? { x: l.x - Y.x, y: l.y - Y.y, width: l.width, height: l.height } : null;
      u.draw(o, s === o ? null : s, {
        origin: Y,
        layout: me,
        above: a,
        view: p,
        announce: (m) => e.announce?.(m),
        focus: Vt,
        boardFocused: Le,
        picked: k,
        onPick: rs,
        gripSize: Mn,
        clamp: x?.last?.clampedReason ? { name: x.name, text: x.last.clampedReason } : P?.outcome.kind === "candidate" && P.outcome.said ? { name: "card-" + P.cardId, text: P.outcome.said } : !x && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!x?.last?.refusal || !x && !!pe,
        onUnlink: (m, h) => {
          if (b || O || P || x || Re()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: h }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: h } }, g = $e(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : ut(g.workshop, o.lanes[0]?.station ? { laneId: h } : { cardId: m });
        }
      });
    }
  }
  function Ke(s) {
    return { x: s.x - Y.x, y: s.y - Y.y };
  }
  function Xt(s, a) {
    const l = i?.noteDay?.(o, Ke(a), me);
    return typeof l == "number" && Number.isFinite(l) && (s.day = l), s;
  }
  function Qt(s, a) {
    const l = i?.noteCell?.(o, Ke(a), me);
    return l ? s.cell = l : delete s.cell, s;
  }
  function je(s) {
    return i ? i.places(s, me) : { ...ze(s, { layout: X }), parts: [] };
  }
  function ns(s, a) {
    const l = i.places(s, me).parts.find((p) => p.name === a);
    return l ? { x: l.x, y: l.y, width: l.width, height: l.height } : void 0;
  }
  function eo() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function ts() {
    rt?.(), rt = null, Mn = so(eo());
    const s = e.canvas?.node;
    if (!ct() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const l = () => {
      if (a = null, S || !ct()) return;
      if (x || P) {
        a = setTimeout(l, 250);
        return;
      }
      const m = so(eo());
      Math.abs(m - Mn) < 2 || (Mn = m, z(O ?? o));
    }, p = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(l, 200);
    });
    p.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), rt = () => {
      p.disconnect(), a && clearTimeout(a);
    };
  }
  function ct() {
    return !i && !!o.lanes[0]?.station && Le && !b && !O && !Re();
  }
  function os(s) {
    const a = ni(s);
    if (!a || !ct()) return null;
    const l = o;
    return (p) => {
      const m = Zs(l, p), h = Xs(l, a, a.kind === "link" && m === a.from ? null : m);
      return h.next ? { next: h.next } : { next: l, clampedReason: h.refusal, refusal: h.refusal };
    };
  }
  function rs(s) {
    if (S || Le) return;
    const a = e.getSelectedNodes?.() ?? [];
    L = new Set(a.map((h) => h.id)), k = s, a.length && e.clearSelection?.(), Oe && yn(Oe), pn();
    const [l, p] = s.split(">"), m = (h) => o.lanes.find((w) => w.id === h)?.label ?? h;
    e.announce?.(`Path from ${m(l)} to ${m(p)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function hr(s, a) {
    if (!i) {
      const l = _a(s, { native: !0, origin: Y, rows: a, layout: X, style: tt }).nodes;
      return ct() ? [...l, ...ri(o, Y, Mn)] : l;
    }
    return i.notes(s, me, Y, tt);
  }
  function ut(s, a, l) {
    const p = i ? i.editsBetween(o, s) : Qs(o, s);
    if (!p.length) return !1;
    const m = $e(o, p);
    return "refused" in m ? (e.announce?.(m.refused.reason), q(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, z(o, { skip: l }), e.announce?.(m.report.edits.map((h) => h.said).join(" ")), q(t.onChange, o, { ...a, edits: p }), !0);
  }
  function pr(s, a) {
    const l = ge(a);
    if (l?.kind === "lane" || l?.kind === "caption") {
      if (l.kind === "caption" && s.lanes.some((m) => m.station)) return null;
      const p = s.lanes.find((m) => m.id === l.key);
      return p ? `${p.label}, ${Ye(s, p.id)}` : null;
    }
    if (l?.kind === "card") {
      const p = s.cards.find((h) => h.id === l.key), m = p && s.lanes.find((h) => h.id === p.laneId);
      return p && m ? `${p.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return l?.kind === "handle" ? i ? i.label?.(s, Ae(a)) ?? null : Vs(s, Ae(a)) : null;
  }
  function no(s, a) {
    const l = hr(s).find((p) => p.options.id === a)?.options;
    return l ? { x: l.xPos, y: l.yPos } : null;
  }
  function rn() {
    (P || x) && e.cancelGovernedDrag?.("host"), P = null, x = null, U && (U = null, q(t.onPreview, null)), re(!1);
  }
  return {
    toCanvas(s) {
      if (S || b || Re()) return "This workshop is view-only here.";
      if (!o.cards.some((h) => h.id === s)) return "That card is no longer on the board.";
      const a = It(o, s);
      if (a) return a;
      U && qe(), O && (rn(), O = null, z(o), e.refreshGovernance?.());
      const { width: l } = je(o), p = A.get(le(ee.card(s)))?.options, m = o.cards.find((h) => h.id === s);
      return dt(s, Nn({
        x: Y.x + l + 32,
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
      const { width: s, height: a } = je(o);
      return { x: Y.x, y: Y.y, width: s, height: a };
    },
    get frame() {
      const { width: s, height: a } = je(o);
      if (!f) return { x: Y.x, y: Y.y, width: s, height: a };
      const l = yo(o, { width: s, height: a }, { ...Yt(), scale: 1, tagScale: xt(1, Hn() && !D) });
      return { x: Y.x + l.x, y: Y.y + l.y, width: l.width, height: l.height };
    },
    frameAt(s) {
      const { width: a, height: l } = je(o);
      if (!f) return { x: Y.x, y: Y.y, width: a, height: l };
      const p = J ? 1 : go(s), m = yo(o, { width: a, height: l }, { ...Yt(), scale: p, tagScale: J ? 1 : Math.round(xt(s, Hn() && !D, p) * 20) / 20 });
      return { x: Y.x + m.x, y: Y.y + m.y, width: m.width, height: m.height };
    },
    get focused() {
      return Le;
    },
    setFocused(s) {
      if (S) return;
      const a = Le;
      Le = !!s;
      for (const l of A.values()) l.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Le);
      a !== Le && (k && (k = null, queueMicrotask(pn)), !i && o.lanes[0]?.station ? (rn(), ts(), z(O ?? o)) : Oe && yn(Oe), Zt());
    },
    setControls(s) {
      S || (ot = s === "always" || s === "selected" ? s : "off", gn());
    },
    setLayout(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = Mr(s);
      i ? i.places(o, a) : ze(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(X) && (rn(), X = a, z(O ?? o));
    },
    whenDrawn: () => Ie,
    update(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = Q(s);
      rn(), o = a;
      const l = b;
      b = c || d(o), z(O ?? o), b !== l && e.refreshGovernance?.();
    },
    preview(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = s ? Q(s) : null;
      rn(), O = a, gn(), z(O ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const l = o.lanes.find((p) => p.id === s);
      S || !l || (re(!1), ae = { laneId: s, reason: a, timer: setTimeout(() => re(), 1500) }, We(), e.announce?.(`${l.label}: ${a}`));
    },
    setReadOnly(s) {
      c = !!s;
      const a = c || d(o);
      S || b === a || (rn(), b = a, gn(), z(O ?? o), e.refreshGovernance?.());
    },
    destroy() {
      S || (rn(), S = !0, Kn.get(e)?.delete(Bt), rt?.(), v?.(), f?.destroy(), vo.delete(Go), nn?.remove(), nn = null, pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", Ko, !0), tn && clearTimeout(tn), e.element?.ownerDocument?.removeEventListener?.("pointerup", Jo, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", Yo, !0), Wi?.(), u && e.element?.removeEventListener?.("pointerover", qo), e.withPolicyAuthority(() => {
        for (const [s, a] of we) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of _) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of A)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), _.clear(), we.clear(), A.clear(), $.clear(), j.clear(), F.clear(), Ri(), u?.destroy(), it = !1, pn(), e.notifyNodeChanged?.());
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
function co(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function Er(e) {
  const n = "card" in e ? e.card : null;
  return n && typeof n == "object" && typeof n.id == "string" ? n.id : null;
}
function ia(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function Mr(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function sa(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const aa = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest", "grid"];
function ne(e) {
  return aa.includes(e.kind) ? e.kind : void 0;
}
function ye(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Te(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function la(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Nt(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Nt(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
function kt(e) {
  const n = ne(e);
  return n ? ve(n).cards[0] : ui;
}
const _t = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function xo(e) {
  if (typeof e != "string" || !_t.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function si(e) {
  return e.noteId ?? e.id;
}
function Rt(e) {
  const n = Nt(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function ai(e) {
  const n = ye(e);
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
const li = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, da = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Io(e) {
  const n = ye(e), t = {}, r = (i) => {
    if (typeof i != "string" || !li.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, d, u) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < d || i > u) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !da.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function di(e) {
  const n = {};
  for (const [t, r] of Object.entries(e ?? {}))
    if (r !== void 0)
      try {
        Io({ [t]: r }) && (n[t] = r);
      } catch {
      }
  return Io(n);
}
function Ao(e) {
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
function Pr(e) {
  try {
    return !!Tt({ link: e });
  } catch {
    return !1;
  }
}
function Tt(e) {
  const n = ye(e), t = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const r = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (r.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    t.text = r;
  }
  if (n.image !== void 0) {
    const r = ye(n.image);
    if (!Ao(r.src)) throw new Error("A card keeps a picture by its web address only.");
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
    const r = ye(n.link), o = r.data;
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
const On = 96, ca = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, ua = ["solid", "dashed", "dotted"], fa = 1e7;
function $n(e) {
  const n = ye(e);
  if (typeof n.id != "string" || !ca.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: xo(n.parentId), childId: xo(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, d) => {
    const u = n[o];
    if (u != null) {
      if (typeof u != "number" || !Number.isFinite(u) || u < i || u > d) throw new Error("A line's look is out of range.");
      t[o] = u;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !li.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!ua.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = ye(n.targetPoint), i = (d) => typeof d == "number" && Number.isFinite(d) && Math.abs(d) <= fa;
    if (!i(o.x) || !i(o.y) || Object.keys(o).some((d) => d !== "x" && d !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    t.targetPoint = { x: Math.round(o.x * 100) / 100, y: Math.round(o.y * 100) / 100 };
  }
  for (const o of ["sourceAnchor", "targetAnchor"]) {
    if (o === "targetAnchor" && t.targetPoint) continue;
    const i = n[o];
    if (i == null) continue;
    const d = ye(i), u = (f) => typeof f == "number" && Number.isFinite(f) && f >= 0 && f <= 1;
    if (!u(d.x) || !u(d.y) || Object.keys(d).some((f) => f !== "x" && f !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    t[o] = { x: d.x, y: d.y };
  }
  return t;
}
function ha(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map($n).map((r) => ci(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (Ze(t.map((r) => r.id), "line ID"), t.length > On) throw new Error(`A workshop holds up to ${On} lines.`);
  return t;
}
function ci(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function Ze(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Wo({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (t) => {
    const r = e.find((o) => o.id === t);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function pa(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const Cn = (e) => "lane-" + e, Xe = (e) => "card-" + e, Et = (e) => "image-" + e;
function fl(e, n = {}) {
  const t = pa(e), r = ee.of(n.scope);
  return Wo(e).map((o) => {
    const i = e.cards.filter((f) => f.laneId === o.id), d = t.filter((f) => f.laneId === o.id), u = [r.lane(o.id)];
    return o.station?.image && u.push(r.image(o.id)), { lane: o, cards: i, signals: d, nodeIds: [...u, ...i.map((f) => r.card(f.id))] };
  });
}
const jo = 5, ui = 24, So = 3;
function ma(e, n, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A move made anyway says who made it, when, and past which rule.");
  const r = e, o = (d, u) => typeof d == "string" && d.trim().length > 0 && d.length <= u && !/[\u0000-\u001f\u007f<>]/.test(d), i = r.was === void 0 ? void 0 : wa(r.was);
  if (!o(r.by, 80) || !o(r.at, 40) || Number.isNaN(Date.parse(r.at)) || !o(r.sentence, 300) || typeof r.from != "string" || !n.includes(r.from) || r.from === t && !i || Object.keys(r).some((d) => !["by", "at", "sentence", "from", "was"].includes(d)))
    throw new Error("A move made anyway says who made it, when, past which rule, and the lane it came from.");
  return { by: r.by, at: r.at, sentence: r.sentence, from: r.from, ...i && { was: i } };
}
function wa(e) {
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
  const n = ye(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ne(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = ne(n), o = r ? ve(r) : void 0, i = { id: Ne }, d = Te(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > jo)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const u = o?.cards ?? [ui, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > u[0]) throw new Error(u[1]);
  const f = n.lanes.map((k) => {
    const L = ye(k), x = { id: Ne(L.id), label: Te(L.label) };
    if (L.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (L.capacity !== void 0) {
      const O = t ? 576 : 24;
      if (typeof L.capacity != "number" || !Number.isInteger(L.capacity) || L.capacity < 1 || L.capacity > O)
        throw new Error(`Lane capacity must be a whole number from 1 to ${O}.`);
      x.capacity = L.capacity;
    }
    if (o?.readLane?.(L, x, i), L.station !== void 0) {
      const O = ye(L.station), D = (c) => {
        if (typeof c != "number" || !Number.isInteger(c) || c < 0 || c >= So)
          throw new Error("Use map coordinates from 0 to 2.");
        return c;
      };
      if (!Array.isArray(O.next) || O.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const J = O.next.map(Ne);
      Ze(J, "onward stop"), x.station = { column: D(O.column), row: D(O.row), next: J, outcome: Te(O.outcome, 160) }, O.image !== void 0 && (x.station.image = ai(O.image));
    }
    return x;
  }), C = f.map((k) => k.id);
  if (Ze(C, "lane ID"), r && f.some((k) => k.station)) throw new Error("A business board has no map stations.");
  if ((t || f.some((k) => k.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (f.some((k) => k.station) && n.cards.every((k) => k?.free === !0))
    throw new Error("A map needs at least one token.");
  if (f.some((k) => k.station)) {
    if (!f.every((k) => k.station)) throw new Error("Give every station on the map a position.");
    Ze(f.map((k) => k.station.column + "," + k.station.row), "map position");
    for (const k of f)
      if (k.station.next.some((L) => L === k.id || !C.includes(L))) throw new Error("Connect each stop to another station on this map.");
  }
  const I = n.cards.map((k) => {
    const L = ye(k), x = { id: Ne(L.id), label: r ? Te(L.label) : la(L.label), laneId: Ne(L.laneId) };
    if (!C.includes(x.laneId)) throw new Error("Card refers to an unknown lane.");
    if (L.override !== void 0) {
      if (t || n.experience !== void 0) throw new Error("A release plan’s and a startup experience’s cards are never moved past a rule.");
      x.override = ma(L.override, C, x.laneId);
    }
    if (L.allowedLaneIds !== void 0) {
      if (!Array.isArray(L.allowedLaneIds) || L.allowedLaneIds.length > f.length) throw new Error("Invalid allowed lanes.");
      if (x.allowedLaneIds = L.allowedLaneIds.map(Ne), Ze(x.allowedLaneIds, "allowed lane"), !x.allowedLaneIds.includes(x.laneId) && !x.override || !x.allowedLaneIds.every((O) => C.includes(O)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (L.look !== void 0) {
      const O = Io(L.look);
      O && (x.look = O);
    }
    if (L.asNote !== void 0) {
      const O = Tt(L.asNote);
      O && (x.asNote = O);
    }
    if (L.noteId !== void 0 && L.noteId !== x.id && (x.noteId = xo(L.noteId)), L.free !== void 0) {
      if (L.free !== !0 || !f.some((O) => O.station)) throw new Error("Only a map’s cards can be free of its paths.");
      x.free = !0;
    }
    if (o?.readCard(L, x, i), t) {
      if (typeof L.points != "number" || !Number.isInteger(L.points) || L.points < 1 || L.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (x.points = L.points, L.dependsOn !== void 0) {
        if (!Array.isArray(L.dependsOn) || L.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        x.dependsOn = L.dependsOn.map(Ne), Ze(x.dependsOn, "dependency");
      }
    }
    return x;
  });
  Ze(I.map((k) => k.id), "card ID");
  const v = { version: 1, title: d, lanes: f, cards: I };
  if (n.experience !== void 0) {
    const k = ye(n.experience);
    if (k.version !== 1 || k.kind !== "customer-interviews" && k.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    v.experience = { version: 1, kind: k.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    v.signals = n.signals.map((k) => {
      const L = ye(k), x = Ne(L.cardId), O = Ne(L.laneId);
      if (!I.some((D) => D.id === x) || !C.includes(O))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Ne(L.id),
        label: Te(L.label),
        cardId: x,
        laneId: O,
        whenPresent: Te(L.whenPresent, 160),
        whenAbsent: Te(L.whenAbsent, 160)
      };
    }), Ze(v.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const k = ha(n.lines, new Set(I.map((L) => L.id)));
    k.length && (v.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    v.presentationOrder = Wo({ lanes: f, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (v.behaviour = be().validate(n.behaviour, { ...v, kind: n.kind })), n.appearance !== void 0) {
    const k = ss(n.appearance, as({ lanes: f, kind: n.kind, nest: n.nest }));
    k && (v.appearance = k);
  }
  if (t)
    return v.kind = "release-plan", us(v), v;
  if (r && o) {
    v.kind = r, o.readBoard(n, v, i);
    const k = o.validate(v);
    if (k) throw new Error(k);
    return v;
  }
  for (const k of f)
    if (Qe({ cards: I.filter((L) => !L.override) }, k.id) > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return v;
}
function Qe(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const fi = 65536;
function hl(e) {
  const n = JSON.stringify(Q(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > fi) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function pl(e) {
  if (e.length > fi) throw new Error("This workshop is too large to open from a link.");
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
function Do(e, n, t) {
  const r = ne(e);
  return r ? ve(r).planMove(e, n, t) : void 0;
}
function Mt(e, n) {
  if (ne(e)) return e.lanes.filter((r) => Do(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => Qn(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && Qe(e, r.id) < (r.capacity ?? 1 / 0));
}
function Co(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = Do(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = Qn(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !Mt(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? Wt({ ...r, laneId: t }) : i) };
}
function ga(e, n, t) {
  if (!n.cards.find((u) => u.id === t)?.override) return n;
  const o = { ...n, cards: n.cards.map((u) => u.id === t ? Wt(u) : u) };
  let i = !1;
  try {
    Q(o);
  } catch {
    i = !0;
  }
  const d = ne(e);
  return !i && d && (i = ve(d).pastRule?.(o, t) ?? !1), !i && e.behaviour && (i = "refused" in be().check(e, o)), i ? n : o;
}
function Wt(e) {
  if (!e.override) return e;
  const { override: n, ...t } = e;
  return t;
}
function cn(e, n, t) {
  const r = Fo(e, n, t);
  if (!r || r === e) return r;
  const o = ga(e, r, n);
  return e.behaviour && "refused" in be().check(e, o) ? null : o;
}
function ya(e) {
  return e.kind !== "release-plan" && !e.experience;
}
function ml(e, n) {
  return e.cards.some((t) => t.override) || n.cards.some((t) => t.override);
}
function ka(e, n) {
  if (!n.override) return !1;
  const t = e.cards.find((r) => r.id === n.id)?.override;
  return !t || JSON.stringify(t) !== JSON.stringify(n.override);
}
function wl(e, n) {
  const t = e.cards.find((o) => o.id === n.id)?.override;
  if (!t || n.override) return !1;
  const r = t.was ?? {};
  return n.laneId === t.from && (r.lag === void 0 || (n.lag ?? 0) === r.lag) && (r.duration === void 0 || n.duration === r.duration) && (r.parentId === void 0 || (n.parentId ?? null) === r.parentId);
}
function gl(e, n) {
  return e.cards.some((t) => t.laneId === n && t.override !== void 0);
}
function yl(e, n, t) {
  const r = e.cards.find((o) => o.id === n);
  return !r || !e.lanes.some((o) => o.id === t) ? "That card or lane is no longer on the board." : r.laneId === t || cn(e, n, t) || Xn(e, n, t, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) ? null : Be(e, n, t) ?? "That move is not available.";
}
function hi(e) {
  return { by: String(e.by || "Someone").replace(/[\u0000-\u001f\u007f<>]/g, "").slice(0, 80) || "Someone", at: e.at };
}
function ba(e, n, t, r) {
  return { ...hi(t), sentence: (n || "That move is not available.").slice(0, 300), from: e.laneId, ...r && { was: r } };
}
function Xn(e, n, t, r) {
  const o = e.cards.find((C) => C.id === n);
  if (!o || o.laneId === t || !e.lanes.some((C) => C.id === t) || !ya(e) || cn(e, n, t)) return null;
  const i = Be(e, n, t) ?? "That move is not available.", d = Fo(e, n, t), u = d && d !== e ? d : ne(e) ? { ...e, cards: [...e.cards.filter((C) => C.id !== n), o] } : e, f = ba(o, i, r);
  try {
    return Q({ ...u, cards: u.cards.map((C) => C.id === n ? { ...Wt(C), laneId: t, override: f } : C) });
  } catch {
    return null;
  }
}
function kl(e, n, t) {
  const r = new Map(e.cards.map((i) => [i.id, i]));
  if (!n.cards.some((i) => i.override || r.get(i.id)?.override)) return n;
  const o = n.cards.map((i) => {
    const d = r.get(i.id), u = Wt(i);
    if (!d) return u;
    const f = d.laneId !== i.laneId, C = (d.lag ?? 0) !== (i.lag ?? 0) || d.duration !== i.duration || (d.parentId ?? null) !== (i.parentId ?? null);
    if (!f && !C) return d.override ? { ...u, override: d.override } : u;
    if (!i.override) return u;
    if (f && !C) {
      const x = Xn(e, i.id, i.laneId, t)?.cards.find((O) => O.id === i.id)?.override;
      return x ? { ...u, override: x } : u;
    }
    const I = e.kind === "launch-plan" || e.kind === "hiring-plan", v = ne(e) === "nest" ? [{ kind: "nest_card", card: { id: i.id }, ...i.parentId ? { under: { id: i.parentId } } : { lane: { id: i.laneId } }, override: !0 }] : I ? [
      { kind: "set_task", card: { id: i.id }, lag: i.lag ?? 0, duration: i.duration ?? 1, override: !0 },
      ...f ? [{ kind: "move_card", card: { id: i.id }, lane: { id: i.laneId }, override: !0 }] : []
    ] : [];
    if (!v.length) return u;
    const k = $e(e, v, { actor: { by: hi(t).by, via: "chat" }, now: t.at }), L = "refused" in k ? void 0 : k.workshop.cards.find((x) => x.id === i.id);
    return L?.override && L.laneId === i.laneId && (L.lag ?? 0) === (i.lag ?? 0) && L.duration === i.duration && (L.parentId ?? null) === (i.parentId ?? null) ? { ...u, override: L.override } : u;
  });
  return { ...n, cards: o };
}
const va = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function pi(e) {
  if (!e.override) return null;
  const n = new Date(e.override.at), t = Number.isNaN(n.getTime()) ? "" : " · " + va[n.getMonth()] + " " + n.getDate();
  return "Moved anyway by " + e.override.by + t;
}
function Fo(e, n, t) {
  const r = e.cards.find((d) => d.id === n);
  if (!r || !e.lanes.some((d) => d.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return Qn(e, r, t);
  const o = Do(e, n, t);
  if (o !== void 0) return o;
  const i = ja(e, n, t);
  return i || (t === "prototype" && hn(e) === "customer-interviews" ? null : Mt(e, r).some((d) => d.id === t) ? Co(e, n, t) : null);
}
function Nr(e, n) {
  return e.lanes.filter((t) => cn(e, n, t.id) !== null);
}
function Be(e, n, t) {
  const r = Fo(e, n, t);
  if (r !== null) {
    const v = r === e || !e.behaviour ? null : be().check(e, r);
    return v && "refused" in v ? v.refused.sentence : null;
  }
  const o = e.cards.find((v) => v.id === n), i = e.lanes.find((v) => v.id === t);
  if (!o || !i) return "That move is not available.";
  const d = ne(e), u = d && ve(d).refusal;
  if (u) return u(e, n, t);
  const f = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return f;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return f;
    const v = un(e, t), k = { ...e, lanes: e.lanes.map((x) => x === i ? { id: i.id, label: i.label } : x) }, L = Qn(k, o, t);
    return L ? `Needs ${un(L, t) - v} points. It already holds ${v} of ${i.capacity} points.` : f;
  }
  const C = e.lanes.find((v) => v.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const I = Qe(e, t);
  if (i.capacity !== void 0 && I >= i.capacity && !(C?.station && o.free)) {
    const v = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${I} of ${i.capacity} ${v}.`;
  }
  return f;
}
function uo(e) {
  return !0;
}
function xa(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !hn(e);
}
function Ia(e) {
  const n = hn(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function Aa(e) {
  const n = Nt(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const Sa = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Tn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && Sa.test(n) && !t.has(n) ? n : et(e, "card");
}
function an(e, n, t) {
  const r = e.lanes.find((u) => u.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = Ia(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= kt(e) ? `This board is at its size limit of ${kt(e)} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : ki(e, n, t) ? null : Be(yi(e, n, t), Tn(e, t.id), n);
  if (ne(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const u = bi(e, n, t);
    return typeof u == "string" ? u : _r(e, u);
  }
  if (e.cards.length >= kt(e)) return `This board is at its size limit of ${kt(e)} cards. Remove a card to make room.`;
  const i = e.lanes.some((u) => u.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const d = Qe(e, n);
  if (r.capacity !== void 0 && !i && d >= r.capacity) return `It already holds ${d} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const u = wi(t.lines);
    if (!u) return "A line of this note can't be joined to a card.";
    const f = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + u.filter((C) => !f.has(C.id)).length > On)
      return `A workshop holds up to ${On} lines.`;
  }
  return _r(e, { ...e, cards: [...e.cards, { id: Tn(e, t.id), label: Rt(zo(t) || fn(e)), laneId: n }] });
}
function _r(e, n) {
  if (!e.behaviour) return null;
  const t = be().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function mi(e) {
  try {
    return e && typeof e == "object" ? di(e) : void 0;
  } catch {
    return;
  }
}
function Lo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [t, r] of Object.entries(e))
    try {
      Tt({ [t]: r }) && (n[t] = r);
    } catch {
    }
  return Object.keys(n).length ? Tt(n) : void 0;
}
function wi(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = $n(r);
    } catch {
      const i = (u) => {
        const { id: f, parentId: C, childId: I, targetPoint: v } = ye(r);
        return $n({ id: f, parentId: C, childId: I, ...u ? { targetPoint: v } : {} });
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
function jt(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function bn(e, n, t) {
  return e && e.map((r) => jt(r, n, t));
}
function gi(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function Jn(e, n, t, r) {
  if (an(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return ki(e, n, t, r);
  if (ne(e)) {
    const O = bi(e, n, t), D = O.cards[O.cards.length - 1], J = r === void 0 ? -1 : e.cards.findIndex((c) => c.id === r && c.laneId === n);
    return J < 0 ? O : { ...O, cards: [...e.cards.slice(0, J), D, ...e.cards.slice(J)] };
  }
  const o = mi(t.look), i = zo(t), d = i || fn(e);
  let u = Lo(t.asNote);
  i || (u = { ...u, text: "" }), d.length > 80 && u?.text === void 0 && d.length <= 4e3 && (u = { ...u, text: d });
  const f = Tn(e, t.id), C = f !== t.id && typeof t.id == "string" && _t.test(t.id) ? t.id : void 0, I = e.lanes.some((O) => O.station), v = {
    id: f,
    label: Rt(d),
    laneId: n,
    ...o ? { look: o } : {},
    ...u ? { asNote: u } : {},
    ...C ? { noteId: C } : {},
    ...I ? { free: !0 } : {}
  }, k = r === void 0 ? -1 : e.cards.findIndex((O) => O.id === r && O.laneId === n), L = k < 0 ? [...e.cards, v] : [...e.cards.slice(0, k), v, ...e.cards.slice(k)], x = t.lines === void 0 ? void 0 : gi(e, wi(t.lines).map((O) => jt(O, t.id, v.id)));
  return Q({ ...e, cards: L, ...x ? { lines: x } : {} });
}
function yi(e, n, t, r) {
  const { label: o, points: i } = Aa(typeof t.label == "string" ? t.label : ""), d = Tn(e, t.id), u = d !== t.id && typeof t.id == "string" && _t.test(t.id) ? t.id : void 0, f = { id: d, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...u ? { noteId: u } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((I) => I.id === r && I.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, f] : [...e.cards.slice(0, C), f, ...e.cards.slice(C)] };
}
function ki(e, n, t, r) {
  const o = yi(e, n, t, r), i = Tn(e, t.id), d = o.cards.find((f) => f.id === i);
  if (d.laneId === n) return Q(o);
  const u = Qn(o, d, n);
  return u ? Q(u) : null;
}
function bi(e, n, t) {
  const r = zo(t), o = ve(ne(e)).fromNote(e, r, fn(e, t.under), t);
  if (typeof o == "string") return o;
  const i = $e(e, [{
    kind: "add_card",
    lane: { id: n },
    ...o,
    ...t.under && { under: { id: t.under } },
    ...t.cell && { row: t.cell.row, col: t.cell.col }
  }]);
  if ("refused" in i) return i.refused.reason;
  const d = i.workshop.cards, u = Tn(e, t.id), f = u !== t.id && typeof t.id == "string" && _t.test(t.id) ? t.id : void 0, C = mi(t.look), I = r ? Lo(t.asNote) : { ...Lo(t.asNote), text: "" };
  d[d.length - 1] = {
    ...d[d.length - 1],
    id: u,
    ...f ? { noteId: f } : {},
    ...C ? { look: C } : {},
    ...I ? { asNote: I } : {}
  };
  const v = ve(ne(e));
  return typeof t.day == "number" && Number.isFinite(t.day) && v.landNote ? v.landNote(i.workshop, u, t.day) : i.workshop;
}
function zo(e) {
  return typeof e?.label == "string" ? Nt(e.label) : "";
}
function Rr(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === fn(e, n.parentId) || n.label === fn(e)) ? "" : t !== void 0 && t !== "" && Rt(t) === n.label ? t : Oo(e, n);
}
function vi(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = ne(e), r = pi(n), o = t ? ve(t).cardText(e, n) : n.label;
  return r ? o + `
` + r : o;
}
function Oo(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = ne(e);
  return t ? ve(t).noteText(e, n) : n.label;
}
function It(e, n) {
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
function Wr(e, n, t = xi(e, n)) {
  if (It(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const d = { ...i, dependsOn: i.dependsOn.filter((u) => u !== n) };
    return d.dependsOn.length || delete d.dependsOn, d;
  }), o = e.lines?.map((i) => jt(i, n, t));
  return Q({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function Ca(e, n, t = xi(e, n)) {
  const r = new Set(e.cards.filter((d) => d.id !== n).map((d) => d.id)), o = (e.lines ?? []).filter((d) => d.parentId === n || d.childId === n).map((d) => jt(d, n, t)), i = (d) => r.has(d.parentId) || r.has(d.childId);
  return { stay: o.filter(i), leave: o.filter((d) => !i(d)) };
}
function xi(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? si(t) : n;
}
function fo(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function Zn(e, n) {
  if (e.kind) return La;
  let t;
  try {
    t = $n(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = ci(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= On ? `A workshop holds up to ${On} lines.` : null;
}
const La = "Lines join the cards of a lane workshop to notes and to each other.";
function At(e, n) {
  return Zn(e, n) !== null ? null : Q({ ...e, lines: gi(e, [$n(n)]) });
}
function jr(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? Q({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function Ii(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((d) => d.id));
  let i = `${n}->${t}`;
  for (let d = 2; o.has(i); d++) i = `${n}->${t}~${d}`;
  return $n({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function Oa(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function Ai(e, n) {
  return Si(e, n, !1);
}
function Ye(e, n) {
  return Si(e, n, !0);
}
function Si(e, n, t) {
  const r = e.lanes.find((I) => I.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const I = un(e, n);
    return r.capacity ? I + (t ? " of " : " / ") + r.capacity + " points" : I + " points";
  }
  const o = ne(e);
  if (o) return ve(o).caption(e, n);
  const i = Da(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const d = e.cards.filter((I) => I.laneId === n).length, u = e.behaviour ? be().laneLimit(e, n) : r.capacity, f = Qe(e, n), C = (I) => I + (I === 1 ? " card" : " cards");
  return t ? u !== void 0 && f !== d ? f + " of " + u + " · " + C(d - f) : u !== void 0 ? d + " of " + u : C(d) : u !== void 0 && f !== d ? f + " / " + u + " · +" + (d - f) : u !== void 0 ? d + " / " + u : String(d);
}
function $a(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || ne(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? be().laneLimit(e, n) : t.capacity;
  return r !== void 0 && Qe(e, n) >= r;
}
const En = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, xn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Ci(e, n = En, t = 28, r) {
  const { pitch: o, row: i, top: d } = n, u = !!e.lanes[0].station, f = e.lanes.map((v) => e.cards.filter((k) => k.laneId === v.id).length), C = d + Math.max(1, ...r ?? f) * i + 36, I = e.lanes.map((v, k) => ({
    x: u ? v.station.column * (o + t) : k * o,
    y: u ? v.station.row * C : 0
  }));
  return {
    points: I,
    width: Math.max(...I.map((v) => v.x)) + o,
    height: Math.max(...I.map((v, k) => v.y + d + (u ? Math.max(1, f[k]) : f[k] + 1) * i))
  };
}
function bl() {
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
function Li(e) {
  const n = Q(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Ta(e, n) {
  const t = Li(e), r = et(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), Q(t);
}
function Ea(e, n, t) {
  const r = Li(e);
  return r.cards.push({
    id: et(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), Q(r);
}
function vl() {
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
function Dr(e, n, t) {
  const r = Q(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((I) => I.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= jo) throw new Error("A map can have up to five stations.");
  const i = Te(t?.label), d = Te(t?.outcome, 160), u = et(r, "station");
  let f, C = 1 / 0;
  for (let I = 0; I < So; I++)
    for (let v = 0; v < So; v++) {
      if (r.lanes.some((L) => L.station.column === v && L.station.row === I)) continue;
      const k = Math.abs(o.station.column - v) + Math.abs(o.station.row - I);
      k < C && (C = k, f = { column: v, row: I });
    }
  if (!f) throw new Error("There is no free station position.");
  return o.station.next.push(u), r.lanes.push({ id: u, label: i, station: { ...f, next: [], outcome: d, ...t.image === void 0 ? {} : { image: ai(t.image) } } }), r.presentationOrder?.push(u), r;
}
const xl = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, $o = (e) => "caption-" + e, Sn = (e) => "column-" + e, Fr = "rules-board";
function nt(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function Il(e, n) {
  const t = nt(n);
  return t ? t + ":" + e : e;
}
const ee = {
  lane: Cn,
  card: Xe,
  image: Et,
  caption: $o,
  column: Sn,
  rules: Fr,
  of(e) {
    const n = nt(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(Cn(r)),
      card: (r) => t(Xe(r)),
      image: (r) => t(Et(r)),
      caption: (r) => t($o(r)),
      column: (r) => t(Sn(r)),
      rules: t(Fr)
    };
  }
};
function Oi(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function $i(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function ln(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function zr(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function Br(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((u, f) => u + Math.max(1, Math.ceil(f.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const Ti = 152, To = Ti + 12, Ma = 12;
function Pa(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function ze(e, n = {}) {
  const t = Q(e), { pitch: r, row: o, top: i } = En, d = t.lanes.map((k) => t.cards.filter((L) => L.laneId === k.id).length), u = (k) => Math.max(d[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), f = !!t.lanes[0].station, C = t.lanes.some((k) => k.station?.image), I = Pa(n.layout, t.lanes.length), v = [];
  if (f) {
    const { points: k } = Ci(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach((L, x) => v.push({
      laneId: L.id,
      x: k[x].x,
      y: k[x].y + (C ? L.station.row * To : 0),
      width: r,
      height: i + (L.station.image ? To : 0) + Math.max(1, u(x)) * o,
      column: L.station.column,
      row: L.station.row
    }));
  } else {
    let k = 0;
    for (let L = 0; L < t.lanes.length; L += I) {
      const x = t.lanes.slice(L, L + I), O = i + (Math.max(...x.map((D, J) => u(L + J))) + 1) * o;
      x.forEach((D, J) => v.push({ laneId: D.id, x: J * r, y: k, width: r, height: O, column: J, row: L / I })), k += O + Ma;
    }
  }
  return { places: v, width: Math.max(...v.map((k) => k.x + k.width)), height: Math.max(...v.map((k) => k.y + k.height)) };
}
function Ei(e, n, t = {}) {
  const r = t.captionFontSize ?? Math.max(11, (t.fontSize ?? vn.fontSize) - 1), o = Ai(e, n.laneId), { label: i, counter: d } = Jr(n.x, n.y, Math.max(40, Math.ceil(o.length * r * 0.6) + 24), En.width, Ts(r));
  return { label: i, value: d };
}
function Na(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: d } = En, u = n.origin ?? { x: 0, y: 0 }, f = !!e.lanes[0].station, { places: C } = ze(e, n), I = n.style ?? {}, v = I.textColor ?? vn.fontColor, k = I.borderColor ?? vn.borderColor, L = I.borderWidth ?? vn.borderWidth, x = I.cornerRadius ?? 0, O = I.fontSize ?? vn.fontSize, D = I.laneFontSize ?? O + 2, J = I.captionFontSize ?? Math.max(11, O - 1), c = [], b = (A) => {
    const $ = { options: {
      shapeHint: "rectangle",
      vectorPath: ln(A.width, A.height, x),
      foregroundColor: v,
      borderColor: k,
      borderWidth: L,
      ...I.fontFamily ? { fontFamily: I.fontFamily } : {},
      ...A
    }, relationships: { associations: [] } };
    return c.push($), $;
  };
  if (e.lanes.forEach((A, $) => {
    const _ = C[$], j = u.x + _.x, F = u.y + _.y, P = A.station?.image;
    b({
      id: Sn(A.id),
      text: "",
      name: A.label,
      xPos: j + 2,
      yPos: F,
      width: t - 4,
      height: _.height,
      vectorPath: ln(t - 4, _.height, x ? x + 2 : 0),
      backgroundColor: f ? "#fcf9ed" : zr(xn[$], 0.6),
      borderColor: f ? "#a8b5aa" : zr(xn[$], 0.1),
      borderWidth: 1,
      ...f ? { borderStyle: "dashed" } : {}
    });
    const U = f ? null : Ei(e, _, I), xe = U?.label ?? { x: j + 8 - u.x, y: F + 6 - u.y, width: r, height: 58 }, he = Ps(A.label, D, xe.width - 16, xe.height - 8);
    b({
      id: Cn(A.id),
      text: he.text,
      name: A.label,
      xPos: u.x + xe.x,
      yPos: u.y + xe.y,
      width: xe.width,
      height: xe.height,
      backgroundColor: xn[$],
      fontSize: he.fontSize
    });
    const se = f ? "" : Ai(e, A.id), He = J, Se = U?.value ?? { x: j + 8 - u.x, y: F + 68 - u.y, width: r, height: 22 };
    b({
      id: $o(A.id),
      text: se,
      name: A.label,
      xPos: u.x + Se.x,
      yPos: u.y + Se.y,
      width: Se.width,
      height: Se.height,
      vectorPath: ln(Se.width, Se.height, f ? 0 : Math.round(Se.height / 2)),
      backgroundColor: f ? "transparent" : $a(e, A.id) ? xn[$ % xn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: He
    }), P && c.push({ options: {
      id: Et(A.id),
      name: P.alt,
      text: "",
      xPos: j + 8,
      yPos: F + d,
      width: r,
      height: Ti,
      shapeHint: "rectangle",
      image: P.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((Ce) => Ce.laneId === A.id).forEach((Ce, ae) => {
      const pe = vi(e, Ce), en = f ? r - 20 : r, Ie = f ? i - 6 : i, Ge = f && !Ce.free, X = Ge ? {} : { ...I.card, ...Ce.look }, me = Ge ? x : I.card?.cornerRadius ?? x;
      b({
        id: Xe(Ce.id),
        text: pe,
        name: Ce.label,
        xPos: j + (f ? 18 : 8),
        yPos: F + d + (P ? To : 0) + ae * o,
        width: en,
        height: Ie,
        ...me !== x ? { vectorPath: ln(en, Ie, me) } : {},
        backgroundColor: Ge ? "#ffda75" : X.backgroundColor ?? I.backgroundColor ?? vn.backgroundColor,
        ...X.textColor ? { foregroundColor: X.textColor } : {},
        ...X.fontFamily ? { fontFamily: X.fontFamily } : {},
        ...X.borderColor ? { borderColor: X.borderColor } : {},
        ...X.borderWidth !== void 0 ? { borderWidth: X.borderWidth } : {},
        fontSize: Br(pe, X.fontSize ?? O, en - 16, Ie - 8)
      });
    });
  }), e.appearance) for (const { options: A } of c) {
    const $ = ds(e.appearance, A.id, {
      fill: A.backgroundColor,
      line: A.borderColor,
      lineWidth: A.borderWidth,
      fontSize: A.fontSize,
      height: A.height
    });
    $.height !== A.height && (A.vectorPath = ln(A.width, $.height, I.card?.cornerRadius ?? x), $.fontSize = Br(String(A.text ?? ""), $.fontSize ?? O, A.width - 16, $.height - 8)), Object.assign(A, { backgroundColor: $.fill, borderColor: $.line, borderWidth: $.lineWidth, fontSize: $.fontSize, height: $.height }, $.weight && { fontWeight: $.weight });
  }
  const S = new Map(c.map((A) => [A.options.id, A]));
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
        const _ = Xe($), j = Xe(A.id);
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
  if (Oi(c, nt(n.scope)), n.beside) {
    const A = new Set(n.beside), $ = new Set(c.map((F) => F.options.id)), _ = /* @__PURE__ */ new Map();
    for (const F of [...$]) {
      if (!A.has(F)) continue;
      const P = $i(F, (U) => A.has(U) || $.has(U));
      $.add(P), _.set(F, P);
    }
    const j = (F) => _.get(F) ?? F;
    for (const F of c) {
      F.options.id = j(F.options.id);
      for (const P of F.relationships.associations)
        P.parentId = j(P.parentId), P.childId = j(P.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: c };
}
function Al(e, n, t = {}) {
  return e.behaviour ? be().note(e, n, t) : null;
}
function _a(e, n) {
  const t = Q(e), r = nt(n?.scope);
  if (n?.native) return Na(t, n);
  const { width: o, row: i, height: d, top: u } = En, f = [];
  function C(x, O, D, J, c, b) {
    f.push({ options: {
      id: x,
      text: O,
      name: O,
      xPos: D,
      yPos: J,
      width: o,
      height: c,
      shapeHint: "rectangle",
      backgroundColor: b,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: I } = Ci(t), v = 152, k = v + 12, L = t.lanes.some((x) => x.station?.image);
  t.lanes.forEach((x, O) => {
    const D = I[O].x, J = I[O].y + (L ? (x.station?.row ?? 0) * k : 0), c = x.station?.image, b = t.kind === "release-plan" ? x.label + `
` + (x.capacity ? un(t, x.id) + " / " + x.capacity + " points" : un(t, x.id) + " points") : x.label;
    C(Cn(x.id), b, D, J, u - 12, xn[O]), c && f.push({ options: {
      id: Et(x.id),
      name: c.alt,
      text: "",
      xPos: D,
      yPos: J + u,
      width: o,
      height: v,
      shapeHint: "rectangle",
      image: c.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((S) => S.laneId === x.id).forEach((S, A) => C(Xe(S.id), vi(t, S), D, J + u + (c ? k : 0) + A * i, d, "#fffdf6"));
  });
  for (const x of t.lanes) {
    if (!x.station) continue;
    const O = f.find((D) => D.options.id === Cn(x.id));
    O.relationships.associations = x.station.next.map((D) => ({ id: x.id + "-to-" + D, parentId: O.options.id, childId: Cn(D), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), O.options.text = x.label + `
` + x.station.outcome, O.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const x = new Map(f.map((O) => [O.options.id, O]));
    for (const O of t.cards)
      for (const D of O.dependsOn ?? []) {
        const J = Xe(D), c = Xe(O.id);
        x.get(J).relationships.associations.push({
          id: `dependency-${D.length}-${D}-${O.id}`,
          parentId: J,
          childId: c,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return Oi(f, r), { options: { name: t.title }, shareId: "", nodes: f };
}
function Ra(e, n = {}, t) {
  const r = Q(e), o = n.narrow ? void 0 : n.width;
  if (ne(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: u, height: f } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(u, o ?? 0), height: f };
  }
  const { width: i, height: d } = ze(r, {});
  return { width: Math.max(jo * En.pitch, i), height: d };
}
function Wa(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite));
  for (let d = 0; d <= i.length; d++) {
    const u = i.find((f) => o < f.x + f.width + r && o + e.width > f.x - r && e.y < f.y + f.height + r && e.y + e.height > f.y - r);
    if (!u) break;
    o = t > 0 ? u.x + u.width + r : u.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const Sl = {
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
}, Eo = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Bo = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Cl() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Eo.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Eo.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function Ll() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Bo.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function hn(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Bo.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => Eo.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function ja(e, n, t) {
  const r = hn(e), o = e.cards.find((d) => d.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const d = e.cards.find((u) => u.laneId === t);
    if (d) {
      if (!Mt(e, d).some((u) => u.id === "interviews")) return null;
      i = Co(e, d.id, "interviews");
    }
  }
  return Mt(i, o).some((d) => d.id === t) ? Co(i, n, t) : null;
}
function Da(e, n) {
  if (hn(e) !== "experiment-budget") return null;
  const t = Bo.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  Ks as CHROME_CHIPS_MAX_SCALE,
  Xr as CHROME_MAX_SCALE,
  vn as DEFAULT_NOTE_STYLE,
  qs as DRAFT_TAG,
  Ls as H,
  Os as L,
  Gr as WORKSHOP_BOARD_KINDS,
  bt as WorkshopReferenceError,
  Yn as a,
  Dr as addWorkshopBranch,
  Ea as addWorkshopCard,
  Ta as addWorkshopLane,
  Ya as appearanceChips,
  Ja as appearanceEditsBetween,
  as as appearanceKeys,
  ds as appearanceLook,
  Ln as appearancePalette,
  St as appearanceQuadrants,
  $e as applyWorkshopEdits,
  ul as attachWorkshop,
  Mt as availableLanes,
  vr as b,
  Al as behaviourNote,
  Je as blend,
  Sr as boardBadgeShapes,
  yo as boardChromeBox,
  Js as boardChromeLabel,
  Qr as boardChromeLayout,
  Ar as boardChromeShapes,
  dl as boardChromeStyles,
  No as boardLegend,
  aa as businessBoardKinds,
  ne as businessKind,
  tl as c,
  _s as canHangPanel,
  Bo as channels,
  Cs as checkWorkshopReplacement,
  fe as chromeInk,
  go as chromeScaleAt,
  xt as chromeTagScaleAt,
  ms as countWord,
  zs as createBoardLayer,
  Ll as createBudgetWorkshop,
  Cl as createInterviewWorkshop,
  bl as createLaneWorkshop,
  vl as createWorkshopMap,
  pl as decodeWorkshopFragment,
  ll as describeFocusDarkroom,
  nl as describeWorkshopEdits,
  hl as encodeWorkshopFragment,
  Ps as f,
  Ua as handoffSummary,
  il as hangGalleryPanel,
  Sl as industrialWorkshop,
  al as initialFocusDarkroom,
  Eo as interviews,
  ys as isRuleEdit,
  xn as laneColors,
  In as layerInk,
  dn as listed,
  ft as listeningRoom,
  Ka as listeningRoomCaption,
  ui as maxWorkshopCards,
  On as maxWorkshopLines,
  ol as moonGallery,
  Co as moveWorkshopCard,
  el as named,
  et as nextWorkshopId,
  xl as nightTransfer,
  sl as normalizeFocusDarkroom,
  qa as normalizeListeningRoom,
  rl as normalizeMoonGallery,
  Ba as normalizeOfflineHandoff,
  za as offlineHandoff,
  ja as planStartupMove,
  ws as pointing,
  Yr as printFields,
  Ns as r,
  ss as readAppearance,
  cl as registerRuleControls,
  Qa as registerRulebook,
  Va as registerWorkshopRules,
  un as releaseLoad,
  Za as releasePlan,
  An as renderLayerShapes,
  Ga as resolveHandoff,
  pa as resolveWorkshopSignals,
  Ha as reviewHandoff,
  ln as roundedBox,
  be as rulebook,
  hs as rulebookLoaded,
  M as said,
  hn as startupExperienceKind,
  Mo as unquoted,
  Q as validateWorkshop,
  cs as withAppearance,
  Lt as workshopBoardKind,
  nt as workshopBoardScope,
  Da as workshopBudgetResult,
  cn as workshopCandidate,
  Wr as workshopCardAsNote,
  It as workshopCardAsNoteRefusal,
  Rt as workshopCardLabelOf,
  Ca as workshopCardLines,
  di as workshopCardLookOf,
  Oo as workshopCardNoteText,
  Rr as workshopCardNoteWords,
  vi as workshopCardText,
  Nr as workshopDestinations,
  mo as workshopEditKinds,
  ho as workshopFinder,
  Wa as workshopFreeSpot,
  ka as workshopFreshOverride,
  yl as workshopHardLimit,
  ml as workshopHasMarks,
  Pr as workshopKeepsLink,
  Ao as workshopKeepsPicture,
  Ai as workshopLaneCaption,
  $a as workshopLaneFull,
  Ei as workshopLaneHeader,
  Qe as workshopLaneHeld,
  gl as workshopLaneOverridden,
  ze as workshopLanePlaces,
  Ye as workshopLaneSpoken,
  En as workshopLayout,
  Zn as workshopLineRefusal,
  fo as workshopLinesOf,
  La as workshopLinesSentence,
  fn as workshopNewCardName,
  Ii as workshopNewLine,
  ee as workshopNodeIds,
  Jn as workshopNoteCandidate,
  si as workshopNoteIdOf,
  an as workshopNoteRefusal,
  Xn as workshopOverrideCandidate,
  pi as workshopOverrideLine,
  ba as workshopOverrideMark,
  wl as workshopOverrideUndone,
  Ci as workshopPositions,
  Wo as workshopPresentationLanes,
  fl as workshopPresentationScenes,
  vs as workshopReferences,
  Be as workshopRefusal,
  bn as workshopRenamedLines,
  Ra as workshopReserve,
  kr as workshopRuleSchema,
  ve as workshopRules,
  Xa as workshopRulesLoaded,
  Il as workshopScopedId,
  ga as workshopShedMark,
  kl as workshopStampOverrides,
  $i as workshopStandInId,
  xa as workshopTakesLines,
  uo as workshopTakesNotes,
  _a as workshopToSlate,
  At as workshopWithLine,
  Oa as workshopWithoutCardLines,
  jr as workshopWithoutLine
};
