import { D as zn } from "./NoteDefaults-BjVBa8YH.mjs";
const Ca = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function $a(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, stage: r, choice: o, fieldNote: i, deskNote: c, fallback: u } = e, p = (C) => typeof C == "string" && C.trim().length > 0 && C.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(C);
  return n !== "offline-handoff" || t !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !p(i) || !p(c) || !p(u) ? null : { kind: n, version: t, stage: r, choice: o, fieldNote: i.trim(), deskNote: c.trim(), fallback: u.trim() };
}
function Oa(e) {
  return { ...e, stage: "review", choice: null };
}
function La(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Ta(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const ut = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Pa(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: t, mix: r, leftLabel: o, rightLabel: i } = e, c = (u) => typeof u == "string" && u.trim().length > 0 && u.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(u);
  return n !== "listening-room" || t !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !c(o) || !c(i) ? null : { kind: n, version: t, mix: r, leftLabel: o.trim(), rightLabel: i.trim() };
}
function Ea({ mix: e, leftLabel: n, rightLabel: t }) {
  return e < 0.32 ? n === ut.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? t === ut.rightLabel ? "Glass chimes ring, then fade." : "You hear " + t + "." : n === ut.leftLabel && t === ut.rightLabel ? "Rain and glass chimes overlap." : n + " and " + t + " overlap.";
}
const Sn = {
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
}, xt = { "q-do-now": "Do now", "q-plan": "Plan it", "q-later": "Later", "q-skip": "Skip" }, Vi = { borders: ["subtle", "strong"], headers: ["subtle", "strong"], headerSize: ["large"], fill: ["soft", "strong"], density: ["compact"] };
function Qi(e, n) {
  if (e == null) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A board’s appearance is an object.");
  const t = e, r = {};
  for (const [o, i] of Object.entries(Vi))
    if (t[o] !== void 0) {
      if (!i.includes(t[o])) throw new Error(`A board’s ${o} is ${i.join(" or ")}.`);
      r[o] = t[o];
    }
  if (t.lines !== void 0 && typeof t.lines != "boolean") throw new Error("A board’s lines are on or off.");
  if (t.lines && (r.lines = !0), t.colors !== void 0) {
    if (!t.colors || typeof t.colors != "object" || Array.isArray(t.colors)) throw new Error("A board’s colors are by column.");
    const o = {};
    for (const [i, c] of Object.entries(t.colors))
      if (n.includes(i)) {
        if (typeof c != "string" || !Sn[c]) throw new Error("Use a color such as " + Object.keys(Sn).slice(0, 4).join(", ") + ".");
        o[i] = c;
      }
    Object.keys(o).length && (r.colors = o);
  }
  return Object.keys(r).length ? r : void 0;
}
function Xi(e) {
  return [...e.lanes.map((n) => n.id), ...e.kind === "nest" && e.nest?.layout === "matrix" ? Object.keys(xt) : []];
}
const es = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e);
function qe(e, n) {
  if (!es(e)) return e;
  const t = n > 0 ? 255 : 0, r = Math.abs(n), o = (i) => Math.round(parseInt(e.slice(i, i + 2), 16) * (1 - r) + t * r).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ns(e, n, t) {
  const r = e && /^(column|lane|caption|card)-(.+)$/.exec(n);
  if (!r) return t;
  const o = e, [, i, c] = r, u = { ...t }, p = o.colors?.[c] && Sn[o.colors[c]];
  return i === "column" ? (p ? (u.fill = qe(p, o.fill === "soft" ? 0.75 : o.fill === "strong" ? 0.3 : 0.55), u.line = qe(p, -0.25)) : o.fill && (u.fill = qe(u.fill, o.fill === "soft" ? 0.5 : -0.1)), o.borders === "strong" && (u.lineWidth = 3, u.line = qe(u.line ?? u.fill, -0.45)), o.borders === "subtle" && (u.lineWidth = 1, u.line = qe(u.line, 0.6)), o.lines && (u.lineWidth = Math.max(2, u.lineWidth ?? 1), u.line = "#4b5a55")) : i === "lane" || i === "caption" && /^q-|^axis-/.test(c) ? (p && i === "lane" && (u.fill = p), o.headers === "strong" && (u.weight = "bold", i === "lane" && (u.fill = qe(u.fill, -0.12), u.lineWidth = 2, u.line = qe(u.fill, -0.4))), o.headers === "subtle" && i === "lane" && (u.fill = qe(u.fill, 0.5), u.lineWidth = 0), o.headerSize && u.fontSize && (u.fontSize = Math.min(36, Math.round(u.fontSize * 1.3)))) : i === "card" && o.density && u.height && (u.height = Math.max(28, Math.round(u.height * 0.72)), u.fontSize && (u.fontSize = Math.max(11, u.fontSize - 2))), u;
}
const fr = {
  borders: { strong: "stronger column borders", subtle: "lighter column borders", normal: "standard column borders" },
  headers: { strong: "bolder headers", subtle: "quieter headers", normal: "standard headers" },
  headerSize: { large: "bigger headers", normal: "standard-size headers" },
  fill: { strong: "deeper column colors", soft: "a softer background", normal: "standard column colors" },
  lines: { true: "grid lines", false: "no grid lines" },
  density: { compact: "compact cards", normal: "roomy cards" }
};
function ts(e, n, t) {
  const r = { ...e.appearance, colors: { ...e.appearance?.colors } }, o = { ...n };
  n.emphasis && (o.borders ?? (o.borders = n.emphasis), o.headers ?? (o.headers = n.emphasis), o.fill ?? (o.fill = n.emphasis === "subtle" ? "soft" : n.emphasis));
  const i = [];
  for (const k of Object.keys(fr)) {
    const $ = o[k];
    $ !== void 0 && (i.push(fr[k][String($)]), $ === "normal" || $ === !1 ? delete r[k] : r[k] = $);
  }
  const c = r.colors;
  n.color !== void 0 && t && (n.color === "none" ? (delete c[t.key], i.push(t.label + " in its own color")) : (c[t.key] = n.color, i.push(t.label + " in " + n.color))), Object.keys(c).length || delete r.colors;
  const u = JSON.stringify(e.appearance ?? {}), p = Object.keys(r).length ? r : void 0, C = JSON.stringify(p ?? {}) !== u, I = { ...e, appearance: p };
  p || delete I.appearance;
  const v = i.length < 2 ? i.join("") : i.slice(0, -1).join(", ") + " and " + i.at(-1);
  return { board: I, changed: C, said: C ? "The board now has " + v + "." : "The board already has " + v + "." };
}
function Ma(e, n) {
  const t = e.appearance ?? {}, r = n.appearance ?? {}, o = {};
  for (const c of ["borders", "headers", "headerSize", "fill", "density"]) t[c] !== r[c] && (o[c] = r[c] ?? "normal");
  !!t.lines != !!r.lines && (o.lines = !!r.lines);
  const i = Object.keys(o).length ? [{ kind: "set_appearance", ...o }] : [];
  for (const c of /* @__PURE__ */ new Set([...Object.keys(t.colors ?? {}), ...Object.keys(r.colors ?? {})]))
    t.colors?.[c] !== r.colors?.[c] && i.push({ kind: "set_appearance", lane: { id: c }, color: r.colors?.[c] ?? "none" });
  return i;
}
function Na(e, n) {
  const t = e.appearance ?? {}, r = t.borders === "strong" && t.headers === "strong", o = (c, u, p, C, I) => ({ id: "look:" + c, label: u, on: p, said: C + ". " + u + " now.", edit: { kind: "set_appearance", ...I } }), i = Object.keys(Sn);
  return {
    rail: [
      o("emphasis", r ? "Look: strong" : "Look: standard", r, r ? "Standard columns" : "Stronger columns", { emphasis: r ? "normal" : "strong" }),
      o("density", t.density ? "Cards: compact" : "Cards: roomy", !!t.density, t.density ? "Roomy cards" : "Compact cards", { density: t.density ? "normal" : "compact" }),
      o("lines", t.lines ? "Lines: on" : "Lines: off", !!t.lines, t.lines ? "No grid lines" : "Grid lines", { lines: !t.lines })
    ],
    swatches: n.flatMap((c) => {
      const u = e.lanes.find((I) => I.id === c)?.label ?? xt[c], p = t.colors?.[c], C = i[i.indexOf(p) + 1];
      return u && (e.nest?.layout !== "matrix" || xt[c]) ? [{
        key: c,
        now: p ?? null,
        swatch: p ? Sn[p] : "#ffffff",
        sentence: u + ": " + (p ?? "own color"),
        said: u + " in " + (C ?? "its own color") + ". Now " + (p ?? "its own color") + ".",
        edit: { kind: "set_appearance", lane: { id: c }, color: C ?? "none" }
      }] : [];
    })
  };
}
function dn(e, n) {
  return e.cards.reduce((t, r) => t + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function os(e) {
  const n = new Map(e.cards.map((c) => [c.id, c])), t = new Map(e.lanes.map((c, u) => [c.id, u])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function i(c) {
    if (!r.has(c.id)) {
      if (o.has(c.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(c.id);
      for (const u of c.dependsOn ?? []) {
        const p = n.get(u);
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
    if (dn(e, c.id) > (c.capacity ?? 1 / 0)) throw new Error(`Release "${c.label}" exceeds its point budget.`);
  }
}
function Zn(e, n, t) {
  if (t === n.laneId) return e;
  const r = new Map(e.lanes.map((v, k) => [v.id, k])), o = r.get(t);
  if (o === void 0) return null;
  const i = o < r.get(n.laneId), c = /* @__PURE__ */ new Set([n.id]), u = [n];
  for (; u.length; ) {
    const v = u.pop();
    for (const k of e.cards) {
      if (c.has(k.id)) continue;
      const $ = r.get(k.laneId);
      (i ? $ > o && v.dependsOn?.includes(k.id) : $ < o && k.dependsOn?.includes(v.id)) && (c.add(k.id), u.push(k));
    }
  }
  if (e.cards.filter((v) => c.has(v.id)).some((v) => v.allowedLaneIds && !v.allowedLaneIds.includes(t))) return null;
  const C = { ...e, cards: e.cards.map((v) => c.has(v.id) ? { ...v, laneId: t } : v) }, I = e.lanes[o].capacity;
  return I !== void 0 && dn(C, t) > I ? null : C;
}
const _a = {
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
}, Tt = /* @__PURE__ */ new Map(), rs = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function Ra(e) {
  Tt.set(e.kind, e);
}
function Wa(e) {
  return typeof e == "string" && Tt.has(e);
}
function cn(e, n) {
  const t = e.kind && e.kind !== "release-plan" ? Tt.get(e.kind) : void 0;
  return t ? "New " + t.newCard(e, n) : e.kind === "release-plan" ? "New feature" : e.lanes.some((r) => r.station) ? "New stop" : "New card";
}
function xe(e) {
  const n = Tt.get(e);
  if (!n) throw new Error(`The ${rs[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let It = null;
function ja(e) {
  It = e;
}
function is() {
  return It !== null;
}
function be() {
  if (!It) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return It;
}
const E = (e) => "“" + e.replace(/[“”]/g, '"') + "”", an = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], hr = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Oo = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Lo = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), Fa = (e) => Oo(Lo(e)), ss = [
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
], as = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : ss.indexOf(e.toLowerCase()), ls = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function jr(e, n) {
  const t = /* @__PURE__ */ new Set(), r = (o) => {
    const i = Oo(o);
    i && t.add(i);
  };
  r(e), r(Lo(e));
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
function ds(e, n, t) {
  const r = new RegExp("^(?:the\\s+)?(?:(" + mr.join("|") + "|last)\\s+(?:" + t + ")|(?:" + t + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Oo(Lo(n)));
  if (!r) return null;
  const o = (r[1] ?? r[2]).toLowerCase(), i = o === "last" ? e.length - 1 : r[1] ? mr.indexOf(o) : as(o) - 1;
  return e[i] ?? null;
}
function Xt(e, n, t, r, o) {
  const i = jr(n, t);
  if (i.some((u) => ls.test(u))) {
    const u = r && e.find((p) => p.id === r);
    return u ? { item: u, rank: 0 } : { pointing: !0 };
  }
  for (const u of i) {
    if (!u.startsWith("@")) continue;
    const p = e.find((C) => C.id === u.slice(1));
    if (p) return { item: p, rank: 0 };
  }
  for (const [u, p] of pr.entries())
    for (const C of i) {
      const I = e.filter((v) => p(v.label.toLowerCase(), C.toLowerCase()));
      if (I.length === 1) return { item: I[0], rank: u };
      if (I.length > 1) return { several: I };
    }
  const c = o ? ds(e, n, t) : null;
  return c ? { item: c, rank: pr.length } : {};
}
class yt extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, t, r = []) {
    super(n), this.reason = t, this.candidates = r;
  }
}
function co(e, n, t, r, o = !1) {
  return { find: (p) => {
    const C = Xt(e, p, n, r, o);
    if (C.item) return C.item;
    const I = jr(p, n), v = I[I.length - 1];
    if (C.pointing) throw new yt("Select a " + t + " on the canvas first, or use its name.", "no-selection");
    if (C.several) {
      const $ = [...new Set(C.several.map((b) => b.label))];
      throw new yt($.length === 1 ? C.several.length + " " + t + "s are called " + E($[0]) + ". Select the one you mean on the canvas and say “this " + t + "”." : "More than one " + t + " matches " + E(v) + ": " + an($.slice(0, 6).map(E)) + ". Use the whole name.", "ambiguous", C.several.map((b) => b.id));
    }
    const k = e.map(($) => $.label);
    throw new yt("There is no " + t + " called " + E(v) + " here." + (k.length && k.length <= 6 ? " The " + t + "s are " + an(k.map(E)) + "." : k.length ? "" : " There are no " + t + "s yet."), "unknown", e.map(($) => $.id));
  }, attempt: (p) => Xt(e, p, n, r, o).item ?? null, rank: (p) => Xt(e, p, n, r, o).rank ?? 1 / 0 };
}
const Fr = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Me = [...Fr], yn = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Dr = Fr.slice(5);
function At(e) {
  if (e.lanes[0]?.station) return "map";
  const n = oe(e);
  return n || (e.kind === "release-plan" ? "release-plan" : un(e) ?? "lanes");
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
}, fe = (e, n) => Object.fromEntries(Me.filter((t) => !e.includes(t)).map((t) => [t, n])), ce = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), te = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), se = (e) => ({ type: "ref", of: "card", about: e }), eo = (e) => ({ map: e }), We = fe(["map"], G.notMap), Pe = (e, n = 1e9, t = 0, r = !1) => ({ type: "integer", min: t, max: n, about: e, ...r && { optional: r } }), fo = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ce(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Me,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: te("The lane or step."), label: ce(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Me,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: se("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Me,
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
      duration: Pe("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: Pe("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: Pe("Pipeline or budget: the amount.", 1e9, 0, !0),
      free: { type: "flag", optional: !0, about: "Map: true for a card the paths don’t constrain, as a note dropped on a step becomes; left out, a token." }
    },
    boards: ["lanes", "experiment-budget", "map", ...Dr],
    refusals: { "release-plan": G.releaseCards, "customer-interviews": G.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: se("The card or token.") },
    boards: Me,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: {
      card: se("The card or token."),
      lane: te("Where it goes."),
      override: { type: "flag", optional: !0, about: "True to move it anyway when a rule refuses it, once the person agreed to break that rule (every board but release plans and startup experiences). The card shows who moved it anyway and when." }
    },
    boards: Me,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: se("The token.") },
    boards: ["map"],
    refusals: We
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: te("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Me.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": G.launchLanes, budget: G.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: se("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: yn,
    refusals: { ...eo(G.mapCardLanes), ...fe([...yn, "map"], G.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: se("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...fe(["release-plan"], G.notPoints), map: G.mapPoints }
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
    refusals: { ...fe(["release-plan"], G.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: se("The card."),
      lane: te("The lane."),
      whenPresent: ce(160, "What it says when the card is there."),
      whenAbsent: ce(160, "What it says otherwise."),
      label: ce(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: yn,
    refusals: { ...eo(G.mapOutcome), ...fe([...yn, "map"], G.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: se("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: yn,
    refusals: { ...eo(G.mapOutcome), ...fe([...yn, "map"], G.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: Me,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: te("The lane or step."), before: te("Present it just before this one.", !0), after: te("Present it just after this one.", !0) },
    boards: Me,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: te("The step it follows."), label: ce(80, "The new step’s name."), outcome: ce(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: We
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
    refusals: We
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: te("Where the path starts."), to: te("Where it leads.") },
    boards: ["map"],
    refusals: We
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: te("Where the path starts."), to: te("Where it leads.") },
    boards: ["map"],
    refusals: We
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: te("The step."), outcome: ce(160, "What it says.") },
    boards: ["map"],
    refusals: We
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: te("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: We
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: te("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: We
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: te("The step."), alt: ce(240, "What the picture shows.") },
    boards: ["map"],
    refusals: We
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: se("The card the line starts at."), to: se("The card it points to."), label: ce(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: ft()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: se("One card."), to: se("The other card.") },
    boards: ["lanes"],
    refusals: ft()
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
    refusals: ft()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: se("The card."), note: ce(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: ft()
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
    refusals: fe(["launch-plan"], G.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: se("The task that waits."), waitsOn: se("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], G.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: se("The task that waits."), waitsOn: se("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], G.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: Pe("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: fe(["launch-plan"], G.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: se("The deal or line item."), amount: Pe("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: fe(["pipeline", "budget"], G.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: Pe("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: fe(["pipeline"], G.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: te("The team giving."), to: te("The team receiving."), amount: Pe("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: fe(["budget"], G.notBudget)
  },
  {
    kind: "set_budget_total",
    summary: "Grow or shrink the budget’s total at one edge of the envelope: the team at that edge gains or gives the difference, then the next teams in, each within its cap and never below its floor or what it commits.",
    intent: !1,
    fields: { amount: Pe("The new total, in whole currency units.", 1e9, 1), edge: { type: "choice", values: ["end", "start"], optional: !0, about: "Which edge moves: end (the last team’s side, the default) or start (the first team’s)." } },
    boards: ["budget"],
    refusals: fe(["budget"], G.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: fe(["lanes", "pipeline"], G.noRules)
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
    refusals: fe(["lanes", "pipeline"], G.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: ce(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: fe(["lanes", "pipeline"], G.noRules) },
  {
    kind: "set_appearance",
    summary: "Change how the board looks, on every kind of board; it moves nothing. Give one or more of the looks, or a lane with a color.",
    intent: !0,
    fields: {
      emphasis: on(["subtle", "normal", "strong"], "Borders, headers and fills together."),
      borders: on(["subtle", "normal", "strong"], "The columns’ outlines."),
      headers: on(["subtle", "normal", "strong"], "Column headers: strong is bold with a deeper fill."),
      headerSize: on(["normal", "large"], "Header text size."),
      fill: on(["soft", "normal", "strong"], "The columns’ fills: soft is a softer background."),
      lines: { type: "flag", optional: !0, about: "Grid lines between the columns (a 2 by 2’s quadrant lines)." },
      density: on(["normal", "compact"], "Card size."),
      lane: te("With color: the lane (on a 2 by 2, also a quadrant by name).", !0),
      color: on([...Object.keys(Sn), "none"], "With lane: its color, or none for its own.")
    },
    boards: Me,
    refusals: {}
  }
];
function on(e, n) {
  return { type: "choice", values: e, optional: !0, about: n };
}
function ft() {
  return { ...fe(["lanes"], G.businessLines), "release-plan": G.lines, "customer-interviews": G.lines, "experiment-budget": G.lines, map: G.lines };
}
const cs = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", wr = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, us = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function fs(e, n) {
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
      return { ...r({ type: "integer", minimum: e.min, maximum: us(e.max, n) }, e.nullable), description: e.about };
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
const Br = (e) => "optional" in e && e.optional === !0;
function Da(e) {
  const n = e ? At(Q(e)) : void 0;
  return fo.map((t) => {
    const r = Object.entries(t.fields), o = {
      type: "object",
      additionalProperties: !1,
      description: t.summary,
      required: ["kind", ...r.filter(([, c]) => !Br(c)).map(([c]) => c)],
      properties: { kind: { const: t.kind }, ...Object.fromEntries(r.map(([c, u]) => [c, fs(u, n)])) }
    }, i = { kind: t.kind, summary: t.summary, intent: t.intent, boards: [...t.boards], schema: o };
    return n && (i.accepted = t.boards.includes(n), i.accepted || (i.refusal = t.refusals[n])), i;
  });
}
const ht = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function hs(e, n) {
  const t = !!e.lanes[0]?.station, r = co(e.lanes, t ? ht.step : ht.lane, t ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), o = co(e.cards, t ? ht.token : ht.card, t ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!t) return { lanes: r, cards: o };
  const i = e.cards.filter((u) => !u.free), c = (u) => i.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|piece|marker)$/i.test(u.trim()) ? i[0] : e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?card$/i.test(u.trim()) ? e.cards[0] : null;
  return { lanes: r, cards: {
    find: (u) => c(u) ?? o.find(u),
    attempt: (u) => c(u) ?? o.attempt(u),
    rank: (u) => c(u) ? 0 : o.rank(u)
  } };
}
class z {
  constructor(n, t, r = null, o, i, c) {
    this.reason = n, this.code = t, this.laneId = r, this.cardId = o, this.candidates = i, this.limits = c;
  }
}
function St(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function V(e, n, t = null, r) {
  try {
    return Q(e);
  } catch (o) {
    throw new z(St(o instanceof Error ? o.message : String(o), n), "refused", t, r);
  }
}
function ps(e, n) {
  for (const r of Object.keys(e)) if (r !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, r)) return n.kind + " does not take " + r + ".";
  const t = (r) => typeof r == "string" && r.trim().length > 0 || !!r && typeof r == "object" && !Array.isArray(r) && typeof r.id == "string" && Object.keys(r).length === 1;
  for (const [r, o] of Object.entries(n.fields)) {
    const i = e[r];
    if (i === void 0) {
      if (Br(o)) continue;
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
        if (!i || typeof i != "object" || typeof i.src != "string" || typeof i.alt != "string" || Object.keys(i).some((u) => u !== "src" && u !== "alt")) return c + "{src, alt} or null.";
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
function ms(e, n, t, r, o) {
  const i = structuredClone(e), c = t === "map", u = t === "release-plan", p = hs(i, r), C = { lane: c ? "step" : "lane", card: c ? "token" : "card" };
  function I(l, x, S, A, L = null) {
    if (typeof S == "object") {
      const j = l.find((D) => D.id === S.id);
      if (!j) throw new z("That " + A + " is no longer on the workshop.", "gone", L);
      return j;
    }
    const N = l.find((j) => j.id === S);
    if (N) return N;
    try {
      return x.find(S);
    } catch (j) {
      if (!(j instanceof yt)) throw j;
      const D = j.reason === "ambiguous" ? "ambiguous_reference" : j.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new z(j.message, D, L, void 0, j.candidates.length ? j.candidates : void 0);
    }
  }
  const v = (l, x = null) => I(i.lanes, p.lanes, l, "lane", x), k = (l, x = null) => I(i.cards, p.cards, l, "card", x), $ = (l) => {
    try {
      return v(l);
    } catch {
      return null;
    }
  }, b = (l, x, S = {}, A = !0) => ({ board: l, said: x, changed: A, ...S }), O = (l) => Ze(i, l), F = (l) => c ? "The presentation opens with " + E(l[0].label) + "." : "The presentation now runs " + l.map((x) => E(x.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return be().edit(i, n, o, {
      lane: (l) => v(l),
      card: (l) => k(l),
      done: (l, x, S) => b(l, x, S),
      refuse: (l, x = {}) => {
        throw new z(l, x.code ?? "refused", x.laneId ?? null, x.cardId);
      }
    });
  if (n.kind === "set_appearance") {
    const { kind: l, lane: x, ...S } = n;
    if (!Object.keys(S).length) throw new z("Say how the board should look: stronger borders, bolder headers, grid lines, compact cards or a column’s color.", "invalid_edit");
    if (S.color === void 0 != (x === void 0)) throw new z("A color is for one column: name the column and the color.", "invalid_edit");
    let A;
    if (x !== void 0) {
      const N = typeof x == "string" ? x.trim().toLowerCase().replace(/^the\s+|\s+(?:quadrant|square|column|lane)$/g, "") : "", j = i.kind === "nest" && i.nest?.layout === "matrix" ? Object.entries(xt).find(([M, q]) => (typeof x == "object" ? x.id : N) === M || N === M.slice(2) || N === q.toLowerCase()) : void 0, D = j ? null : v(x);
      A = j ? { key: j[0], label: j[1] } : { key: D.id, label: D.label };
    }
    const L = ts(i, S, A);
    return b(L.board, L.said, A && !A.key.startsWith("q-") ? { laneId: A.key } : {}, L.changed);
  }
  if (Dr.includes(t)) {
    n.kind === "add_card" && gr(n, t, v(n.lane).id);
    const l = {
      card: (S) => k(S),
      lane: (S) => v(S),
      refuse: (S, A = {}) => {
        throw new z(S, A.code ?? "refused", A.laneId ?? null, A.cardId, void 0, A.limits);
      },
      settle: (S, A = null, L) => V(S, t, A, L),
      done: (S, A, L) => b(S, A, L),
      who: { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() }
    }, x = xe(t).edit(i, n, l);
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
      const S = V(i, t, l.id);
      return b(S, "Renamed " + E(x) + " to " + E(S.lanes.find((A) => A.id === l.id).label) + ".", { laneId: l.id });
    }
    case "rename_card": {
      const l = k(n.card), x = l.label;
      l.label = n.label;
      const S = V(i, t, l.laneId, l.id);
      return b(S, "Renamed " + E(x) + " to " + E(S.cards.find((A) => A.id === l.id).label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "add_lane": {
      if (i.lanes.length >= 5) throw new z("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new z("A lane can hold from 1 to 24 cards.", "refused");
      let l;
      try {
        l = ma(i, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (S) {
        throw new z(St(S.message, t), "refused");
      }
      const x = l.lanes[l.lanes.length - 1];
      return b(l, "Added the lane " + E(x.label) + ".", { laneId: x.id });
    }
    case "remove_lane": {
      const l = v(n.lane), x = i.cards.filter((S) => S.laneId === l.id);
      if (c) {
        if (x.length) throw new z(E(x[0].label) + " is at " + E(l.label) + ". Move it to another step first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new z("A map needs at least two steps.", "refused", l.id);
      } else {
        if (x.length) throw new z(E(l.label) + " holds " + x.length + (x.length === 1 ? " card" : " cards") + ". Move or remove " + (x.length === 1 ? "it" : "them") + " first.", "refused", l.id);
        if (i.lanes.length <= 2) throw new z("A workshop needs at least two columns.", "refused", l.id);
      }
      i.lanes = i.lanes.filter((S) => S !== l);
      for (const S of i.lanes) S.station && (S.station.next = S.station.next.filter((A) => A !== l.id));
      i.presentationOrder && (i.presentationOrder = i.presentationOrder.filter((S) => S !== l.id));
      for (const S of i.cards) S.allowedLaneIds && (S.allowedLaneIds = S.allowedLaneIds.filter((A) => A !== l.id));
      return pt(i, (S) => S.laneId === l.id), i.behaviour && (i.behaviour = be().dropLane(i.behaviour, l.id)), b(V(i, t), "Removed the " + C.lane + " " + E(l.label) + ".", { laneId: l.id });
    }
    case "add_card": {
      const l = v(n.lane);
      if (c) {
        if (n.allowedLanes !== void 0) throw new z(G.mapCardLanes, "not_on_this_board", l.id);
        if (n.free) {
          if (i.cards.length >= 24) throw new z("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
          const M = Qn(i, "card");
          i.cards.push({ id: M, label: Mt(n.label?.trim() || cn(i)), laneId: l.id, free: !0 });
          const q = V(i, t, l.id);
          return b(q, "Added " + E(q.cards.find((Ne) => Ne.id === M).label) + " to " + E(l.label) + ".", { laneId: l.id, cardId: M });
        }
        let L = n.label;
        if (L === void 0) {
          let M = i.cards.length + 1;
          for (; i.cards.some((q) => q.label === "Token " + M); ) M++;
          L = "Token " + M;
        }
        const N = new Set([...i.lanes, ...i.cards].map((M) => M.id));
        let j = 1;
        for (; N.has("token-" + j); ) j++;
        i.cards.push({ id: "token-" + j, label: L, laneId: l.id });
        const D = V(i, t, l.id);
        return b(D, "Added " + E(D.cards[D.cards.length - 1].label) + " at " + E(l.label) + ".", { laneId: l.id, cardId: "token-" + j });
      }
      if (gr(n, t, l.id), i.cards.length >= 24) throw new z("A workshop can have up to 24 cards. Remove one first.", "refused", l.id);
      if (l.capacity !== void 0 && O(l.id) >= l.capacity)
        throw new z(E(l.label) + " is full: it holds " + l.capacity + (l.capacity === 1 ? " card" : " cards") + ". Add the card to another column, or raise the limit.", "refused", l.id);
      const x = n.allowedLanes && [...new Set(n.allowedLanes.map((L) => v(L).id))];
      let S;
      try {
        S = wa(i, l.id, { label: n.label?.trim() || cn(i), ...x && { allowedLaneIds: x } });
      } catch (L) {
        throw new z(St(L.message, t), "refused", l.id);
      }
      const A = S.cards[S.cards.length - 1];
      return b(S, "Added " + (A.label ? E(A.label) : "an empty card") + " to " + E(l.label) + ".", { laneId: l.id, cardId: A.id });
    }
    case "remove_card": {
      const l = k(n.card);
      if (c && !l.free && i.cards.filter((x) => !x.free).length === 1) throw new z("A map needs at least one token.", "refused", l.laneId, l.id);
      if (u && i.cards.length === 1) throw new z("A release plan needs at least one feature.", "refused", l.laneId, l.id);
      if (t === "launch-plan" && i.cards.length === 1) throw new z("A launch plan needs at least one task.", "refused", l.laneId, l.id);
      i.cards = i.cards.filter((x) => x !== l);
      for (const x of i.cards)
        x.dependsOn?.includes(l.id) && (x.dependsOn = x.dependsOn.filter((S) => S !== l.id), x.dependsOn.length || delete x.dependsOn);
      return pt(i, (x) => x.cardId === l.id), b(V(fa(i, l.id), t, l.laneId), "Removed the " + C.card + " " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "move_card": {
      const l = typeof n.lane == "object" ? i.lanes.find((A) => A.id === n.lane.id) ?? null : $(n.lane), x = k(n.card, l?.id ?? null), S = v(n.lane, x.laneId);
      return J(x, S, n.override === !0);
    }
    case "advance_card": {
      const l = k(n.card), x = i.lanes.find((A) => A.id === l.laneId), S = x.station.next.map((A) => i.lanes.find((L) => L.id === A)).filter((A) => !!A);
      if (!S.length) throw new z(E(l.label) + " is at " + E(x.label) + ", and no path leads on from there.", "refused", x.id, l.id);
      if (S.length > 1)
        throw new z("From " + E(x.label) + " the path goes to " + S.map((A) => E(A.label)).join(" or ") + ". Say which, such as “Move " + l.label + " to " + S[0].label + "”.", "refused", x.id, l.id);
      return J(l, S[0]);
    }
    case "set_lane_capacity": {
      const l = v(n.lane), x = i.behaviour && be().setLimit(i, l.id, n.capacity, o);
      if (typeof x == "string") throw new z(x, "refused", l.id);
      if (x) return b(x, E(l.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: l.id });
      const S = c ? "token" : u ? "point" : "card";
      if (n.capacity === null)
        return delete l.capacity, b(V(i, t, l.id), c ? "Removed the limit at " + E(l.label) + "." : E(l.label) + " now holds any number of " + S + "s.", { laneId: l.id });
      const A = u ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > A)
        throw new z((c ? "A step" : "A lane") + " can hold from 1 to " + A + " " + S + "s.", "refused", l.id);
      const L = u ? i.cards.reduce((N, j) => N + (j.laneId === l.id ? j.points ?? 1 : 0), 0) : O(l.id);
      if (L > n.capacity)
        throw new z(E(l.label) + " already holds " + L + " " + S + (L === 1 ? "" : "s") + ". Move some " + (c ? "on" : "out") + " first, or choose a higher " + (u ? "budget" : "number") + ".", "refused", l.id);
      return l.capacity = n.capacity, b(V(i, t, l.id), E(l.label) + " now holds up to " + n.capacity + " " + S + (n.capacity === 1 ? "" : "s") + ".", { laneId: l.id });
    }
    case "set_card_lanes": {
      const l = k(n.card);
      if (n.lanes === null)
        return delete l.allowedLaneIds, b(V(i, t, l.laneId, l.id), E(l.label) + " can now go in any lane.", { laneId: l.laneId, cardId: l.id });
      const x = [...new Set(n.lanes.map((A) => v(A)))], S = i.lanes.find((A) => A.id === l.laneId);
      if (!x.includes(S)) throw new z(E(l.label) + " is in " + E(S.label) + " now. Include " + E(S.label) + ", or move the card first.", "refused", S.id, l.id);
      return l.allowedLaneIds = x.map((A) => A.id), b(V(i, t, l.laneId, l.id), E(l.label) + " can now go only in " + an(x.map((A) => E(A.label))) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_points": {
      const l = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new z("A feature takes from 1 to 24 points.", "refused", l.laneId, l.id);
      return l.points = n.points, b(V(i, t, l.laneId, l.id), E(l.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: l.laneId, cardId: l.id });
    }
    case "set_card_dependencies": {
      const l = k(n.card), x = [...new Set(n.dependsOn.map((A) => k(A)))], S = { laneId: l.laneId, cardId: l.id };
      if (n.mode === "remove") {
        const A = x.filter((L) => l.dependsOn?.includes(L.id));
        if (!A.length) throw new z(E(l.label) + " does not depend on " + an(x.map((L) => E(L.label))) + ".", "refused", l.laneId, l.id);
        return l.dependsOn = l.dependsOn.filter((L) => !A.some((N) => N.id === L)), l.dependsOn.length || delete l.dependsOn, b(V(i, t, l.laneId, l.id), E(l.label) + " no longer depends on " + an(A.map((L) => E(L.label))) + ".", S);
      }
      if (!x.length) {
        if (n.mode === "add") throw new z("Name the features " + E(l.label) + " depends on.", "refused", l.laneId, l.id);
        return delete l.dependsOn, b(V(i, t, l.laneId, l.id), E(l.label) + " no longer depends on anything.", S);
      }
      if (x.includes(l)) throw new z("A feature can’t depend on itself.", "refused", l.laneId, l.id);
      return l.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? l.dependsOn ?? [] : [], ...x.map((A) => A.id)])], b(V(i, t, l.laneId, l.id), E(l.label) + " now depends on " + an(x.map((A) => E(A.label))) + ".", S);
    }
    case "set_outcome": {
      const l = k(n.card), x = v(n.lane), S = i.signals ?? (i.signals = []), A = n.label, L = A === void 0 ? S.filter((M) => M.cardId === l.id && M.laneId === x.id) : S.filter((M) => M.cardId === l.id && M.label.toLowerCase() === A.toLowerCase());
      if (A !== void 0 && L.length > 1) throw new z("Two outcomes on this card have that name.", "refused", x.id, l.id);
      if (!L.length && S.length >= 24) throw new z("A workshop can have up to 24 outcomes. Remove one first.", "refused", x.id, l.id);
      let N = 1;
      for (; S.some((M) => M.id === "signal-" + N); ) N++;
      const D = { label: A ?? L[0]?.label ?? (l.label + " in " + x.label).slice(0, 80).trim(), cardId: l.id, laneId: x.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return L.length ? Object.assign(L[0], D) : S.push({ id: "signal-" + N, ...D }), b(V(i, t, x.id, l.id), "When " + E(l.label) + " is in " + E(x.label) + " the workshop says " + E(n.whenPresent) + ". Otherwise it says " + E(n.whenAbsent) + ".", { laneId: x.id, cardId: l.id });
    }
    case "remove_outcome": {
      const l = k(n.card), x = (i.signals ?? []).filter((S) => S.cardId === l.id);
      if (n.outcome === void 0) {
        if (!x.length) throw new z(E(l.label) + " has no outcome to remove.", "refused", l.laneId, l.id);
        pt(i, (S) => S.cardId === l.id);
      } else {
        const S = I(x, co(x, "outcomes?", "outcome"), n.outcome, "outcome", l.laneId);
        pt(i, (A) => A.id === S.id);
      }
      return b(V(i, t, l.laneId, l.id), "Removed the outcome from " + E(l.label) + ".", { laneId: l.laneId, cardId: l.id });
    }
    case "set_presentation_order": {
      const l = n.lanes.map((x) => v(x));
      if (l.length !== i.lanes.length || new Set(l).size !== i.lanes.length) throw new z("Include each scene once in the presentation order.", "refused");
      return i.presentationOrder = l.map((x) => x.id), b(V(i, t), F(l));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new z("Say before or after, not both.", "invalid_edit");
      const l = v(n.lane), x = n.before ?? n.after, S = x === void 0 ? void 0 : v(x);
      if (S && S.id === l.id) throw new z("Choose two different scenes.", "refused", l.id);
      const A = Mo(i).filter((L) => L.id !== l.id);
      return A.splice(S ? A.findIndex((L) => L.id === S.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, l), i.presentationOrder = A.map((L) => L.id), b(V(i, t, l.id), F(A), { laneId: l.id });
    }
    case "add_station": {
      const l = v(n.from);
      let x;
      try {
        x = _r(i, l.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (A) {
        throw new z(A.message, "refused", l.id);
      }
      const S = x.lanes[x.lanes.length - 1];
      return b(x, "Added a path from " + E(l.label) + " to " + E(S.label) + ".", { laneId: S.id });
    }
    case "insert_station": {
      const l = v(n.before), x = n.from === void 0 ? void 0 : v(n.from), S = x ? [x] : i.lanes.filter((N) => N.station.next.includes(l.id));
      if (x && !x.station.next.includes(l.id))
        throw new z("There is no path from " + E(x.label) + " to " + E(l.label) + ". Try “Add " + n.label + " after " + x.label + "”.", "refused", x.id);
      if (!S.length) throw new z("Nothing leads to " + E(l.label) + " yet. Try “Add " + n.label + " after " + l.label + "”.", "refused", l.id);
      let A;
      try {
        A = _r(i, S[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (N) {
        throw new z(N.message, "refused", l.id);
      }
      const L = A.lanes[A.lanes.length - 1];
      for (const N of A.lanes)
        S.some((j) => j.id === N.id) && (N.station.next = [...new Set(N.station.next.map((j) => j === l.id ? L.id : j))]);
      return L.station.next = [l.id], b(V(A, t, L.id), "Added " + E(L.label) + " before " + E(l.label) + ".", { laneId: L.id });
    }
    case "connect_stations": {
      const l = v(n.from), x = v(n.to);
      if (l.id === x.id) throw new z("Connect two different steps.", "refused", l.id);
      return l.station.next.includes(x.id) ? b(i, E(l.label) + " already leads to " + E(x.label) + ".", { laneId: l.id }, !1) : (l.station.next.push(x.id), b(V(i, t, l.id), "Connected " + E(l.label) + " to " + E(x.label) + ".", { laneId: l.id }));
    }
    case "disconnect_stations": {
      const l = v(n.from), x = v(n.to);
      if (!l.station.next.includes(x.id)) throw new z("There is no path between " + E(l.label) + " and " + E(x.label) + ".", "refused", l.id);
      return l.station.next = l.station.next.filter((S) => S !== x.id), b(V(i, t, l.id), "Removed the path from " + E(l.label) + " to " + E(x.label) + ".", { laneId: l.id });
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
      if (!l.station.image) throw new z("Add a station image before changing its description.", "refused", l.id);
      return l.station.image.alt = n.alt, b(V(i, t, l.id), "Updated the image description at " + E(l.label) + ".", { laneId: l.id });
    }
    case "connect_cards":
    case "connect_note": {
      const l = k(n.card);
      let x = l.id, S, A;
      if (n.kind === "connect_cards") {
        const M = k(n.to, l.laneId);
        if (M.id === l.id) throw new z("A line joins two different cards.", "refused", l.laneId, l.id);
        S = M.id, A = E(M.label);
      } else {
        const M = n.note.trim();
        if (i.cards.some((q) => q.id === M) || i.lanes.some((q) => q.id === M))
          throw new z("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", l.laneId, l.id);
        S = M, A = "the note " + M, n.direction === "from_note" && ([x, S] = [S, x]);
      }
      const L = gi(i, x, S, n.label ? { label: n.label } : {}), N = Kn(i, L);
      if (N) throw new z(N, "refused", l.laneId, l.id);
      const j = vt(i, L), D = x === l.id;
      return b(
        j,
        D ? "Drew a line from " + E(l.label) + " to " + A + "." : "Drew a line from " + A + " to " + E(l.label) + ".",
        { laneId: l.laneId, cardId: l.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const l = k(n.card), x = n.kind === "disconnect_cards" ? k(n.to, l.laneId).id : n.note.trim(), S = n.kind === "disconnect_cards" ? E(i.cards.find((N) => N.id === x).label) : "the note " + x, A = (N) => N.parentId === l.id && N.childId === x || N.parentId === x && N.childId === l.id, L = i.lines ?? [];
      return L.some(A) ? (i.lines = L.filter((N) => !A(N)), b(V(i, t, l.laneId, l.id), "Took away the line between " + E(l.label) + " and " + S + ".", { laneId: l.laneId, cardId: l.id })) : b(e, E(l.label) + " and " + S + " are not joined by a line.", { laneId: l.laneId, cardId: l.id }, !1);
    }
  }
  throw new z("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function J(l, x, S = !1) {
    const A = { laneId: x.id, cardId: l.id };
    if (l.laneId === x.id)
      return b(e, E(l.label) + " is already " + (c ? "at " : "in ") + E(x.label) + ".", A, !1);
    const L = ln(e, l.id, x.id);
    if (!L) {
      const N = De(e, l.id, x.id) ?? "That move is not available.", j = Yn(e, l.id, x.id, { by: o?.by ?? "an agent", at: o?.at ?? (/* @__PURE__ */ new Date()).toISOString() });
      if (S && j) return b(V(j, t, x.id, l.id), "Moved " + E(l.label) + " to " + E(x.label) + " anyway. " + N, A);
      const D = new z(N, "refused", x.id, l.id);
      throw j && (D.overridable = !0), D;
    }
    return b(V(L, t, x.id, l.id), "Moved " + E(l.label) + " to " + E(x.label) + ".", A);
  }
}
function gr(e, n, t) {
  const r = ["duration", "lag", "waitsOn", "amount", "band"].find((o) => e[o] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? o !== "amount" && (o !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && o === "amount"));
  if (r) throw new z(r === "amount" ? G.notAmounts : G.notTasks, "not_on_this_board", t);
}
function pt(e, n) {
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
  const i = o, c = [], u = [], p = { by: (t.actor?.by ?? "an agent").slice(0, 80), at: t.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: t.actor?.via ?? "exec" };
  for (const [v, k] of n.entries()) {
    const $ = k?.kind, b = fo.find((L) => L.kind === $);
    if (!k || typeof k != "object" || !b)
      return r({
        index: v,
        kind: typeof $ == "string" ? $ : null,
        code: "invalid_edit",
        reason: "There is no edit called " + E(String($)) + ". The edits are " + an(fo.map((L) => L.kind)) + "."
      });
    const O = ps(k, b);
    if (O) return r({ index: v, kind: b.kind, code: "invalid_edit", reason: O });
    const F = At(o);
    if (!b.boards.includes(F))
      return r({ index: v, kind: b.kind, code: "not_on_this_board", reason: b.refusals[F] ?? "This workshop does not take " + b.kind + "." });
    const J = (k.kind === "move_card" || k.kind === "set_task" || k.kind === "nest_card") && k.override !== !0, l = (L, N) => {
      if (!J || L !== "refused") return { reason: N };
      const j = $e(o, [{ ...k, override: !0 }], t);
      return "refused" in j ? { reason: N } : { reason: j.report.overrides?.[0]?.sentence ?? N, overridable: !0 };
    };
    let x;
    try {
      x = ms(o, k, F, t.selection, p);
    } catch (L) {
      if (!(L instanceof z)) throw L;
      const N = L.overridable ? { reason: L.reason, overridable: !0 } : l(L.code, L.reason);
      return r({
        index: v,
        kind: b.kind,
        ...N,
        code: L.code,
        laneId: L.laneId,
        ...L.cardId && { cardId: L.cardId },
        ...L.candidates && { candidates: L.candidates },
        ...L.limits && { limits: L.limits }
      });
    }
    const S = o.behaviour && !cs(b.kind) && b.kind !== "set_appearance" ? be().check(o, x.board) : null;
    if (S && "refused" in S)
      return r({ index: v, kind: b.kind, ...l("refused", S.refused.sentence), code: "refused", laneId: S.refused.laneId, cardId: S.refused.cardId });
    const A = ys(o, x.board);
    if (A) return r({ index: v, kind: b.kind, reason: A, code: "not_on_this_board", laneId: x.laneId ?? null });
    if (k.override === !0)
      for (const L of x.board.cards)
        L.override && oa(o, L) && u.push({ index: v, cardId: L.id, laneId: L.laneId, fromLaneId: L.override.from, sentence: L.override.sentence });
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
  return { workshop: o, report: { edits: c, movedCards: I, ...u.length && { overrides: u } } };
}
function ws(e, n) {
  const t = oe(e);
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
    const i = xe(t).fixed?.(e, n);
    if (i) return i;
    const c = e.lanes.find((u) => {
      const p = n.lanes.find((C) => C.id === u.id);
      return u.floor !== p.floor || u.cap !== p.cap || u.capacity !== p.capacity;
    });
    if (c) return `${c.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return t === "launch-plan" && e.lanes.some((r) => r.capacity !== n.lanes.find((o) => o.id === r.id).capacity) ? G.launchLanes : t && xe(t).fixed?.(e, n) || null;
}
const gs = {
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
function ys(e, n) {
  const t = Q(e), r = At(t);
  let o;
  try {
    o = Q(n);
  } catch (p) {
    return St(p instanceof Error ? p.message : String(p), r);
  }
  const i = At(o), c = (p, C) => p.lanes.length === C.lanes.length && p.lanes.every((I) => C.lanes.some((v) => v.id === I.id)), u = (p, C) => p.lanes.every((I, v) => C.lanes[v]?.id === I.id);
  if ((r === "customer-interviews" || r === "experiment-budget") && i !== r)
    return c(t, o) ? G.keepsCards : G.keepsLanes;
  if ((r === "customer-interviews" || r === "experiment-budget") && !u(t, o)) return G.keepsOrder;
  if (oe(t) && i === r && !(c(t, o) && u(t, o))) return uo[r];
  if (oe(t) && i === r) {
    const p = ws(t, o);
    if (p) return p;
  }
  if (r === "release-plan" && i === "release-plan") {
    if (!c(t, o)) return G.releaseLanes;
    if (!u(t, o)) return G.releaseOrder;
    if (o.cards.some((p) => !t.cards.some((C) => C.id === p.id))) return G.releaseCards;
  }
  return r !== i ? "This board is a " + gs[r] + ", and it stays one. Put another kind of workshop on a board of its own." : t.behaviour || o.behaviour ? be().replacement(t, o) : null;
}
const Ba = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function za(e) {
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
    let u = i.after;
    for (; u !== null; ) {
      if (c.has(u) || !r.has(u) || o.includes(i.id) && !o.includes(u)) return null;
      c.add(u), u = r.get(u).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: t, hung: o };
}
function ks(e, n) {
  const t = e.panels.find((r) => r.id === n);
  return !!t && !e.hung.includes(n) && (t.after === null || e.hung.includes(t.after));
}
function Ha(e, n) {
  return ks(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const zr = ["firstPrint", "secondPrint", "thirdPrint"], Hr = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Ga(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const t = { ...Hr, route: n.route };
  for (const r of zr) {
    const o = n[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    t[r] = o.trim();
  }
  return t;
}
function qa(e = new URLSearchParams()) {
  const n = { ...Hr };
  for (const r of zr) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (n[r] = o);
  }
  const t = e.get("route");
  return (t === "start" || t === "opener") && (n.route = t), n;
}
function Ua(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function bs(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Is(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), xs(n), n;
}
function vs(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function xs(e) {
  return e && vs(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function no(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function Hn(e) {
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
function Is(e) {
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
function mt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const vn = {
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
}, As = "var(--slatebox-board-font, system-ui, sans-serif)", ho = "http://www.w3.org/2000/svg", yr = (e) => /var\([^,]+,\s*([^)]+)\)/.exec(e)?.[1].trim() ?? e;
function je(e, n, t) {
  const r = document.createElementNS(ho, e);
  for (const [o, i] of Object.entries(n)) r.setAttribute(o, String(i));
  return t?.fill && (r.setAttribute("fill", yr(t.fill)), r.style.setProperty("fill", t.fill)), t?.stroke && (r.setAttribute("stroke", yr(t.stroke)), r.style.setProperty("stroke", t.stroke)), r;
}
function xn(e, n, t, r, o) {
  const i = typeof document < "u" ? document.activeElement : null, c = i && e.contains(i) ? i.getAttribute("data-board-link") : null;
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  const u = [];
  for (const p of n)
    if (p.t === "line")
      e.appendChild(je("line", {
        x1: p.x1,
        y1: p.y1,
        x2: p.x2,
        y2: p.y2,
        "stroke-width": p.width ?? 1,
        ...p.dash ? { "stroke-dasharray": p.dash } : {}
      }, { stroke: p.color }));
    else if (p.t === "rect")
      e.appendChild(je("rect", {
        x: p.x,
        y: p.y,
        width: Math.max(0, p.w),
        height: Math.max(0, p.h),
        rx: p.rx ?? 0,
        ...p.opacity !== void 0 ? { opacity: p.opacity } : {},
        ...p.role ? { "data-board-layer": p.role } : {}
      }, { fill: p.color }));
    else if (p.t === "text") {
      const C = je("text", {
        x: p.x,
        y: p.y,
        "font-size": p.size ?? 13,
        "text-anchor": p.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...p.bold ? { "font-weight": 600 } : {},
        ...p.role ? { "data-board-layer": p.role } : {},
        ...p.halo ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
      }, { fill: p.color, ...p.halo ? { stroke: p.halo } : {} });
      C.style.setProperty("font-family", As), p.lines && p.lines.length > 1 ? p.lines.forEach((I, v) => {
        const k = je("tspan", { x: p.x, dy: v ? p.lineHeight ?? Math.round((p.size ?? 13) * 1.25) : 0 });
        k.textContent = v < p.lines.length - 1 ? I + " " : I, C.appendChild(k);
      }) : C.textContent = p.text, e.appendChild(C);
    } else {
      if (p.unlink && t) {
        const { cardId: C, waitsOn: I, label: v } = p.unlink, k = I + ">" + C, $ = r?.armed === k, b = je("path", {
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
        }, { stroke: $ ? vn.refuse : "transparent" });
        let O = !1;
        b.addEventListener("pointerdown", (F) => {
          F.stopPropagation(), O = F.pointerType === "touch" || F.pointerType === "pen";
        }), b.addEventListener("click", (F) => {
          if (F.stopPropagation(), O && r && r.armed !== k) {
            r.arm(k);
            return;
          }
          r?.arm(null), t(C, I);
        }), b.addEventListener("keydown", (F) => {
          F.key !== "Enter" && F.key !== " " || (F.preventDefault(), F.stopPropagation(), t(C, I));
        }), b.addEventListener("focus", () => {
          b.style.setProperty("stroke", vn.accept), b.setAttribute("opacity", "0.35");
        }), b.addEventListener("blur", () => {
          $ || (b.style.setProperty("stroke", "transparent"), b.removeAttribute("opacity"));
        }), e.appendChild(b), u.push(b);
      } else if (p.pick && o) {
        const { key: C, label: I } = p.pick, v = je("path", {
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
          v.style.setProperty("stroke", vn.accept), v.setAttribute("opacity", "0.35");
        }), v.addEventListener("blur", () => {
          v.style.setProperty("stroke", "transparent"), v.removeAttribute("opacity");
        }), e.appendChild(v), u.push(v);
      }
      if (e.appendChild(je(
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
        e.appendChild(je("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${C} ${I}) rotate(${v})`, "pointer-events": "none" }, { fill: p.color }));
      }
      if (p.unlink && r?.armed === p.unlink.waitsOn + ">" + p.unlink.cardId && p.arrow) {
        const C = je("text", {
          x: p.arrow.x - 6,
          y: p.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: vn.refuse });
        C.textContent = p.unlink.armed ?? "Tap again to remove this link", e.appendChild(C);
      }
    }
  c && u.find((p) => p.getAttribute("data-board-link") === c)?.focus({ preventScroll: !0 });
}
function Ss(e, n) {
  const t = e?.canvas?.node, r = document.createElementNS(ho, "g");
  r.setAttribute("data-board-layer", ""), r.setAttribute("pointer-events", "none");
  const o = document.createElementNS(ho, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let i = !1, c = null, u;
  const p = {
    armed: null,
    arm(I) {
      clearTimeout(u), p.armed = I, I && (u = setTimeout(() => p.arm(null), 5e3), c?.[2].announce?.(c[2].boardFocused && c[0].lanes[0]?.station ? "Path selected. Tap it again to remove it." : "Link selected. Tap it again to remove it.")), c && C.draw(...c);
    }
  }, C = {
    draw(I, v, k) {
      if (i || !t) return;
      c = [I, v, k];
      const { origin: $ } = k, b = n(v ?? I, k, I), O = (l) => l.t === "text" && (l.role === "clamp" || l.role === "refusal") || l.t === "rect" && !!l.role?.startsWith("grip-");
      for (const l of [r, o])
        l.setAttribute("transform", `translate(${$.x} ${$.y})`), l.toggleAttribute("data-workshop-focused", !!k.boardFocused);
      xn(r, b.filter((l) => !O(l)), k.onUnlink, p, k.onPick), xn(o, b.filter(O));
      const F = k.above && k.above.parentNode === t ? k.above : null, J = F ? F.nextSibling : t.firstChild;
      (r.parentNode !== t || r.previousSibling !== F) && t.insertBefore(r, J === r ? r.nextSibling : J), o.firstChild && t.lastChild !== o ? t.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
    },
    destroy() {
      i = !0, clearTimeout(u), r.remove(), o.remove();
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
}, wt = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n, Cs = (e) => e.replace(/\.$/, ""), $s = { amount: "an amount", owner: "an owner", due: "a date", estimate: "an estimate" };
function To(e) {
  if (e.lanes[0]?.station) return [];
  if (e.kind) return Os(e);
  const n = [], t = e.lanes.map((o) => o.id), r = (e.behaviour?.rules ?? []).filter((o) => o.on !== !1);
  for (const o of r) {
    const i = o.severity === "warn" || void 0, c = (u) => n.push(i ? { ...u, warn: i } : u);
    if (o.kind === "bin" && o.lane) c({ icon: "bin", text: wt(e, o.lane) + " is a bin", lane: o.lane });
    else if (o.kind === "gate" && o.into) c({ icon: "gate", text: wt(e, o.into) + " needs " + (o.needs ?? []).map((u) => $s[u] ?? u).join(" and "), lane: o.into });
    else if (o.kind === "path" && o.from)
      if (!o.to) c({ icon: "step", text: "One column at a time", seams: t.slice(1).map((u, p) => [t[p], u]) });
      else {
        const u = o.from, p = o.to.filter((C) => Math.abs(t.indexOf(C) - t.indexOf(u)) === 1).map((C) => [u, C]);
        c({ icon: "oneway", text: wt(e, u) + " → " + o.to.map((C) => wt(e, C)).join(" or ") + " only", seams: p });
      }
  }
  return n;
}
function Os(e) {
  if (!is()) return [];
  let n;
  try {
    n = be().lines(e);
  } catch {
    return [];
  }
  const t = [];
  for (const r of n) {
    const o = Cs(r);
    if (/ holds \d+$/.test(o) || / holds cards not placed yet/.test(o)) continue;
    const i = / \(a warning only\)$/.test(o) || void 0, c = /weekend|working day|whole week/i.test(o) ? "clock" : /slip|push/i.test(o) ? "push" : /hard line|ends by|launch|go-live/i.test(o) ? "flag" : /lock/i.test(o) ? "lock" : /one stage at a time/i.test(o) ? "step" : "rule";
    t.push({ icon: c, text: Ls(o), ...i && { warn: i } });
  }
  return t;
}
function Ls(e) {
  const n = e.replace(/ \(a warning only\)$/, "");
  return /^Days are working days/i.test(n) ? "Weekends skipped" : /^A slip pushes the/i.test(n) ? "A slip pushes what waits" : / is a hard line/i.test(n) ? "Hard line" : /^Every task ends by (.*)$/i.test(n) ? n.replace(/^Every task ends by (.*)$/i, "Ends by $1") : /^Hires snap to whole weeks$/i.test(n) ? "Whole weeks" : /^Deals move one stage at a time$/i.test(n) ? "One stage at a time" : /^A won deal needs an amount$/i.test(n) ? "Won needs an amount" : n.length > 46 ? n.slice(0, 44).replace(/\s+\S*$/, "") + "…" : n;
}
const kt = (e, n, t = !1) => Math.ceil(e.length * n * (t ? 0.58 : 0.52));
function Gr(e, n, t, r, o = 12) {
  const i = o / 12, c = (p) => p.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (C, I, v) => `A${+I * i} ${+v * i}`).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (C, I, v) => `${+(n + +I * i).toFixed(1)},${+(t + +v * i).toFixed(1)}`), u = (p, C = 1.6) => ({ t: "path", d: c(p), color: r, width: C * i });
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
const Po = (e, n, t, r, o) => `M${e + o},${n} H${e + t - o} A${o},${o} 0 0 1 ${e + t},${n + o} V${n + r - o} A${o},${o} 0 0 1 ${e + t - o},${n + r} H${e + o} A${o},${o} 0 0 1 ${e},${n + r - o} V${n + o} A${o},${o} 0 0 1 ${e + o},${n} Z`;
function Ct(e, n, t = !1) {
  return Math.round(10 * n + (e.icon ? 17 * n : 0) + kt(e.text, 13 * n, t) + 10 * n);
}
function gt(e, n, t, r, o = {}) {
  const i = 24 * r, c = 10 * r, u = t.icon ? 17 * r : 0, p = Ct(t, r, o.bold), C = o.ink ?? he.chipInk, I = [{
    t: "path",
    d: Po(e, n, p, i, i / 2),
    color: t.warn ? he.preview : o.line ?? "none",
    width: 1,
    fill: o.fill ?? he.chip,
    ...t.warn && { dash: "3 3" },
    ...o.role && { role: o.role + "-box" }
  }];
  return t.icon && I.push(...Gr(t.icon, e + c, n + 6 * r, C, 12 * r)), I.push({ t: "text", x: e + c + u, y: n + 16.5 * r, text: t.text, color: C, size: 13 * r, role: o.role ?? "legend", ...o.bold && { bold: !0 } }), I;
}
function kr(e, n, t, r) {
  return [
    { t: "path", d: Po(n - 11, t - 11, 22, 22, 11), color: he.badgeLine, width: 1, fill: he.badge, role: r },
    ...Gr(e, n - 6, t - 6, he.badgeInk)
  ];
}
const Ts = "Preview · not added yet", qr = 6, Ps = 2.5, Ur = (e) => Math.round(Math.min(qr, Math.max(1, 0.75 / (e > 0 ? e : 1))) * 20) / 20, po = (e, n = !1, t = 1) => Math.max(t, (n ? 40 / 24 : 1) / (e > 0 ? e : 1));
function Kr(e, n, t = {}) {
  const r = n.x ?? 0, o = n.y ?? 0, i = Math.min(qr, Math.max(1, t.scale ?? 1)), c = i > Ps ? [] : To(e), u = 18 * i, p = 30 * i, C = (N, j) => {
    const D = (t.narrow && j <= 1 ? n.width : Math.max(n.width, t.room ?? 0)) - 4;
    if (kt(N, 18 * j, !0) <= D) return N;
    const M = Math.max(3, Math.floor(D / (18 * j * 0.58)) - 1);
    return N.slice(0, M).replace(/\s+\S*$/, "").replace(/[\s,.;:–-]+$/, "") + "…";
  }, I = C(e.title, i), v = Math.max(n.width, t.narrow ? 0 : Math.min(640, n.width + 120)), k = [], $ = [2 + kt(C(e.title, 1), 18, !0) + 14];
  t.narrow && c.length && ($[0] = 1 / 0, $.push(2));
  for (const N of c) {
    const j = Ct(N, 1);
    let D = $.findIndex((M) => M + j <= v);
    D < 0 && ($.push(2), D = $.length - 1), k.push({ x: $[D], row: D, item: N, width: j }), $[D] += j + 6;
  }
  const b = k.map((N) => ({ x: r + Math.round(N.x * i), row: N.row, item: N.item, width: Ct(N.item, i) })), O = Math.max(1, ...b.map((N) => N.row + 1)), F = o - 14 * i - O * p, J = !!(t.focused || t.draft), l = t.narrow ? 8 : 16, x = J ? { x: r - l, y: F - 18 * i, width: n.width + 2 * l, height: o + n.height + l - (F - 18 * i) } : null, S = Math.max(i, t.tagScale ?? i), A = x ? x.y - 12 * S : F, L = r + 2 + kt(I, u, !0);
  return { k: i, tagK: S, legend: c, placed: b, rows: O, title: I, titleY: F, titleSize: u, titleRight: L, rowH: p, frame: x, top: A };
}
function Jr(e, n, t = {}) {
  const r = Kr(e, n, t), o = r.frame, i = Math.max(n.width, r.titleRight, ...r.placed.map((I) => I.x + I.width)), c = o ? o.x : 0, u = r.top, p = Math.max(o ? o.x + o.width : n.width, i), C = o ? o.y + o.height : n.height;
  return { x: c, y: u, width: p - c, height: C - u };
}
function br(e, n, t = {}) {
  const { k: r, tagK: o, placed: i, title: c, titleY: u, titleSize: p, rowH: C, frame: I } = Kr(e, n, t), v = n.x ?? 0, k = [];
  if (I) {
    const $ = Po(I.x, I.y, I.width, I.height, 18);
    t.focused && k.push({ t: "path", d: $, color: he.focus, width: 12, strokeOpacity: 0.1, fill: he.focusTint, role: "focus-glow" }), k.push({
      t: "path",
      d: $,
      color: t.focused ? he.focus : he.preview,
      width: 2,
      ...!t.focused && { dash: "8 6" },
      role: t.focused ? "focus-frame" : "draft-frame"
    });
  }
  k.push({ t: "text", x: v + 2, y: u + 19 * r, text: c, color: he.title, size: p, bold: !0, role: "board-title" });
  for (const $ of i) k.push(...gt($.x, u + $.row * C + 2 * r, $.item, r));
  if (I) {
    const $ = I.y - 12 * o;
    if (t.focused) {
      const b = { text: "Editing" };
      k.push(...gt(I.x + 18, $, b, o, { fill: he.focus, ink: he.focusInk, bold: !0, role: "focus-tag" })), k.push(...gt(
        I.x + 18 + Ct(b, o, !0) + 6 * o,
        $,
        { text: "Done" },
        o,
        { fill: he.halo, ink: he.focus, line: he.focus, bold: !0, role: "focus-done" }
      ));
    } else
      k.push(...gt(I.x + 18, $, { text: Ts }, o, { fill: he.previewFill, ink: he.previewInk, bold: !0, role: "draft-tag" }));
  }
  return k;
}
function vr(e, n = {}) {
  const t = n.places;
  if (!t?.length || e.kind || e.lanes[0]?.station) return [];
  const r = [], o = (i) => t.find((c) => c.laneId === i);
  for (const i of To(e)) {
    const c = i.lane ? o(i.lane) : void 0;
    c && r.push(...kr(i.icon, c.x + c.width - 22, c.y + 18, "badge-" + i.lane));
    for (const [u, p] of i.seams ?? []) {
      const C = o(u), I = o(p);
      !C || !I || C.row !== I.row || r.push(...kr(i.icon, (C.x + C.width + I.x) / 2, C.y + 35, "seam-" + u + ">" + p));
    }
  }
  return r;
}
function Es(e) {
  const n = To(e).map((t) => t.text);
  return n.length ? e.title + ": " + n.join(", ") : e.title;
}
const Ka = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`, xr = "http://www.w3.org/2000/svg";
function Ir(e) {
  return e ? (e.boardChromes instanceof Set || (e.boardChromes = /* @__PURE__ */ new Set()), e.boardChromes) : /* @__PURE__ */ new Set();
}
function Ms(e) {
  const n = e?.canvas?.node, t = typeof document < "u" ? document.createElementNS(xr, "g") : null, r = typeof document < "u" ? document.createElementNS(xr, "g") : null;
  for (const I of [t, r])
    I?.setAttribute("data-board-chrome", ""), I?.setAttribute("pointer-events", "none");
  r?.setAttribute("data-board-badges", "");
  let o = !1, i = null;
  const c = (I) => ({ layout: I.layout, focused: I.focused, draft: I.draft, scale: I.scale, tagScale: I.tagScale, narrow: I.narrow, places: I.places, room: I.room }), u = (I, v) => {
    const k = Jr(I.board, I.size, v);
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
      const v = Ur(I);
      return u(i, { ...c(i), scale: v, tagScale: po(I, !!(i.narrow && !i.draft), v) });
    },
    plainBox() {
      return i ? u(i, p(i)) : null;
    },
    paintPlain(I, v) {
      if (!i) return;
      const k = p(i);
      I.removeAttribute("data-workshop-focused"), xn(I, br(i.board, { width: i.size.width, height: i.size.height }, k)), v && (v.removeAttribute("data-workshop-focused"), xn(v, vr(i.board, k)));
    }
  };
  return Ir(e).add(C), {
    draw(I) {
      if (o || !n || !t || !r) return;
      i = I;
      const v = c(I);
      for (const b of [t, r])
        b.setAttribute("transform", `translate(${I.origin.x} ${I.origin.y})`), b.toggleAttribute("data-workshop-focused", !!I.focused), b.toggleAttribute("data-workshop-draft", !!I.draft), b.setAttribute("data-board-scope", I.scope ?? "main");
      t.setAttribute("role", "group"), t.setAttribute("aria-label", Es(I.board)), xn(t, br(I.board, { width: I.size.width, height: I.size.height }, v)), xn(r, vr(I.board, v));
      const k = t.querySelector('[data-board-layer="focus-done-box"]');
      if (k && I.onDone) {
        const b = I.onDone;
        k.setAttribute("role", "button"), k.setAttribute("tabindex", "0"), k.setAttribute("aria-label", "Done changing " + I.board.title), k.setAttribute("pointer-events", "all"), k.setAttribute("cursor", "pointer"), k.addEventListener("pointerdown", (O) => O.stopPropagation()), k.addEventListener("click", (O) => {
          O.stopPropagation(), b();
        }), k.addEventListener("keydown", (O) => {
          const F = O.key;
          F !== "Enter" && F !== " " || (O.preventDefault(), O.stopPropagation(), b());
        });
      }
      const $ = I.under && I.under.parentNode === n ? I.under : null;
      $ ? t.nextSibling !== $ && n.insertBefore(t, $) : t.parentNode !== n && n.insertBefore(t, n.firstChild), r.firstChild ? n.lastChild !== r && n.appendChild(r) : r.parentNode && r.remove();
    },
    destroy() {
      o = !0, Ir(e).delete(C), t?.remove(), r?.remove();
    }
  };
}
const mo = "handle-_link-", wo = "handle-_route-", Jn = 40, Yr = 44;
function to(e) {
  const n = Number.isFinite(e) && e > 0 ? e : 1;
  return Math.min(160, Math.max(Jn, Math.ceil(Yr / n)));
}
function Zr(e) {
  if (e.startsWith(mo)) return { kind: "link", from: e.slice(mo.length) };
  if (e.startsWith(wo)) {
    const [n, t] = e.slice(wo.length).split("~");
    return n && t ? { kind: "route", from: n, to: t } : null;
  }
  return null;
}
const Vr = (e) => !!e.lanes[0]?.station, Je = (e, n) => e.lanes.find((t) => t.id === n)?.label ?? n;
function Eo(e) {
  const { places: n } = Fe(e);
  return new Map(n.map((t) => [t.laneId, { x: t.x + 2, y: t.y, width: t.width - 4, height: t.height }]));
}
function Ar(e, n, t = 4) {
  const r = e.x + e.width / 2, o = e.y + e.height / 2, i = n.x - r, c = n.y - o, u = i ? e.width / 2 / Math.abs(i) : 1 / 0, p = c ? e.height / 2 / Math.abs(c) : 1 / 0, C = Math.min(u, p), I = Math.hypot(i, c) || 1;
  return { x: r + i * C + i / I * t, y: o + c * C + c / I * t };
}
function Qr(e) {
  if (!Vr(e)) return [];
  const n = Eo(e), t = [];
  for (const r of e.lanes) {
    const o = n.get(r.id);
    if (o)
      for (const i of r.station.next) {
        const c = n.get(i);
        if (!c) continue;
        const u = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, p = { x: c.x + c.width / 2, y: c.y + c.height / 2 }, C = Ar(o, p, -8), I = Ar(c, u, -8);
        t.push({ key: r.id + ">" + i, from: r.id, to: i, x1: C.x, y1: C.y, x2: I.x, y2: I.y });
      }
  }
  return t;
}
function Ns(e, n) {
  for (const [t, r] of Eo(e))
    if (n.x >= r.x && n.x <= r.x + r.width && n.y >= r.y && n.y <= r.y + r.height) return t;
  return null;
}
function Xr(e, n, t = Jn) {
  if (!Vr(e)) return [];
  const r = Eo(e), o = t / Jn, i = (u, p, C, I, v) => ({ options: {
    id: u,
    name: I,
    text: v ? "+" : "",
    xPos: n.x + p - t / 2,
    yPos: n.y + C - t / 2,
    width: t,
    height: t,
    shapeHint: "rectangle",
    vectorPath: sn(t, t, t / 2),
    backgroundColor: v ? "#2f5fd0" : "#fffef8",
    foregroundColor: v ? "#ffffff" : "#2f5fd0",
    borderColor: v ? "#ffffff" : "#2f5fd0",
    borderWidth: Math.round(3 * o),
    fontSize: Math.round(22 * o)
  }, relationships: { associations: [] } }), c = [];
  for (const u of e.lanes) {
    const p = r.get(u.id);
    p && c.push(i(mo + u.id, p.x + p.width, p.y + p.height, "Draw a path from " + u.label, !0));
  }
  for (const u of Qr(e))
    c.push(i(wo + u.from + "~" + u.to, u.x2, u.y2, "End of the path from " + Je(e, u.from) + " to " + Je(e, u.to), !1));
  return c;
}
function _s(e, n) {
  const t = Zr(n);
  return t ? t.kind === "link" ? `Draw a path from ${Je(e, t.from)}: drag it onto another step.` : `End of the path from ${Je(e, t.from)} to ${Je(e, t.to)}: drag it onto another step to move the path there.` : null;
}
function Rs(e, n, t) {
  if (t === null || n.kind === "route" && t === n.to) return { next: e };
  const r = e.lanes.find((c) => c.id === n.from);
  if (!r?.station || !e.lanes.some((c) => c.id === t)) return { next: e };
  if (t === r.id) return { next: null, refusal: "A path joins two different steps." };
  if (r.station.next.includes(t)) return { next: null, refusal: `${r.label} already leads to ${Je(e, t)}.` };
  const o = n.kind === "route" ? r.station.next.filter((c) => c !== n.to) : r.station.next, i = e.lanes.map((c) => c.id === r.id ? { ...c, station: { ...c.station, next: [...o, t] } } : c);
  return { next: { ...e, lanes: i } };
}
function Ws(e, n) {
  const t = [], r = [];
  for (const o of n.lanes) {
    const i = e.lanes.find((u) => u.id === o.id)?.station?.next ?? [], c = o.station?.next ?? [];
    for (const u of i) c.includes(u) || t.push({ kind: "disconnect_stations", from: { id: o.id }, to: { id: u } });
    for (const u of c) i.includes(u) || r.push({ kind: "connect_stations", from: { id: o.id }, to: { id: u } });
  }
  return [...t, ...r];
}
function js(e, n) {
  const t = [], r = !!n.boardFocused, o = n.gripSize ?? Jn, i = Math.max(24, o * Yr / Jn);
  for (const c of Qr(e)) {
    const u = Je(e, c.from) + " to " + Je(e, c.to), p = `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`, C = !r && n.picked === c.key;
    t.push(r ? { t: "path", d: p, color: "transparent", width: 3, hit: i, unlink: { cardId: c.to, waitsOn: c.from, label: "Remove the path from " + u, armed: "Tap again to remove this path" } } : { t: "path", d: p, color: C ? vn.accept : "transparent", width: C ? 5 : 3, hit: i, pick: { key: c.key, label: "Path from " + u + (C ? ", selected" : "") } });
  }
  if (n.clamp) {
    const c = Xr(e, { x: 0, y: 0 }, o).find((C) => C.options.id === n.clamp.name)?.options, u = c ? c.xPos + o + 6 : 0, p = c ? c.yPos + o / 2 + 5 : 0;
    t.push({ t: "text", x: u, y: p, text: n.clamp.text, color: vn.refuse, size: 13, bold: !0, role: "clamp" });
  }
  return t;
}
let ei = null;
const go = /* @__PURE__ */ new Set();
function Ja(e) {
  ei = e;
  for (const n of go) n();
}
const Sr = "#1f7a5c", Cr = "#5b9a85", oo = "#c2410c", Fs = "#a8761b", Ds = {
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
}, Bs = { canMove: !1, canSelect: !1 }, ro = "A card's line joins notes and cards on its own board.", Gn = /* @__PURE__ */ new WeakMap();
function zs(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function Ya(e, n, t = {}) {
  const r = Xn(t.scope);
  let o = Q(n);
  const i = t.kit, c = (s) => !!oe(s) && !i;
  if (c(o) && !t.readOnly && !t.draft && !t.still) throw new Error(`A ${o.kind} board needs its kit: pass kit: kitFor('${o.kind}') from slateboxjs/boards.`);
  const u = i?.layer(e) ?? (o.lanes[0]?.station ? Ss(e, js) : void 0), p = t.chrome === !1 ? null : Ms(e);
  let C = 1, I = 1, v = null, k = null, $ = /* @__PURE__ */ new Set(), b = null, O = null;
  const F = !!t.draft, J = !!t.still;
  let l = !!t.readOnly || F || J, x = l || c(o), S = !1;
  const A = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let M = null, q = null, Ne = null, ue = null, X = null;
  const Be = /* @__PURE__ */ new Map(), fn = /* @__PURE__ */ new Map(), Ve = /* @__PURE__ */ new Map();
  let re = null, pe = null;
  function ye(s, a) {
    pe && clearTimeout(pe.timer), pe = { name: s, reason: a, timer: setTimeout(() => {
      pe = null, S || B(O ?? o);
    }, 3e3) };
  }
  let Ie = Promise.resolve(), et = null, ae = Or(t.layout), Ae = ae;
  const Rt = { ...t.style };
  let Le = /* @__PURE__ */ new Map(), Wt = /* @__PURE__ */ new Set(), Fo = null, Se = !1, nt = t.controls ?? "off", Qe = null, jt = null;
  const Do = () => wn();
  go.add(Do);
  let Ln = to(1), tt = null, Tn = null, Xe = null, ot = !1;
  const me = /* @__PURE__ */ new Map();
  Ge(o);
  const Y = t.origin ? { x: t.origin.x, y: t.origin.y } : Gs(e), rt = r ? r + ":" : "", ve = (s) => D.get(s) ?? (rt ? s.startsWith(rt) ? s.slice(rt.length) : null : s), Bo = (s) => we(s)?.kind === "column" && !/^column-q-/.test(ve(s) ?? ""), we = (s) => {
    const a = ve(s);
    return a === null ? null : zs(a);
  };
  function le(s) {
    const a = j.get(s);
    if (a) return a;
    const d = rt + s;
    if (A.has(d) && !D.has(d) || !e.nodes.one?.(d)) return d;
    const h = xi(d, (m) => !!e.nodes.one?.(m) || D.has(m));
    return j.set(s, h), D.set(h, s), console.warn(`WORKSHOP: the slate already has a note named "${d}". It stays the slate's own; the workshop draws its note as "${h}".`), h;
  }
  function Pn(s, a = 1) {
    let d = [];
    try {
      d = t.avoid?.() ?? [];
    } catch (h) {
      console.warn("WORKSHOP: avoid threw; the note goes just beside the board", h);
    }
    return d.length ? xa(s, d, a) : { x: s.x, y: s.y };
  }
  function Ai(s) {
    if (!s?.dayWidth) return s;
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (f) {
      console.warn("WORKSHOP: avoid threw; the plan grows as it is held", f);
    }
    const { width: d, height: h } = i ? i.places(o, ae) : Ge(o);
    let m = 1 / 0;
    for (const f of a)
      [f.x, f.y, f.width, f.height].every(Number.isFinite) && f.x >= Y.x + d && f.y < Y.y + h && f.y + f.height > Y.y && (m = Math.min(m, f.x - 32 - Y.x));
    return Number.isFinite(m) ? { ...s, maxWidth: m } : s;
  }
  function Si(s) {
    let a = [];
    try {
      a = t.avoid?.() ?? [];
    } catch (d) {
      console.warn("WORKSHOP: avoid threw; the note stays where it was let go", d);
    }
    return a.some((d) => [d.x, d.y, d.width, d.height].every(Number.isFinite) && s.x < d.x + d.width && s.x + s.width > d.x && s.y < d.y + d.height && s.y + s.height > d.y);
  }
  function Ci(s, a) {
    const d = [...Gn.get(e) ?? []].filter((g) => g !== Dt);
    if (!d.length) return null;
    const { id: h, note: m } = nr(s, a), f = { id: h, options: m }, w = ao(o, s).some((g) => o.cards.some((y) => y.id !== s && (y.id === g.parentId || y.id === g.childId)));
    for (const g of d) {
      let y = null;
      try {
        y = g.verdict(f, a);
      } catch (T) {
        console.warn("WORKSHOP: another board could not say whether it takes the card", T);
      }
      if (y) return { board: g, ...y, reason: w ? ro : y.reason };
    }
    return null;
  }
  function $i(s, a, d, h) {
    const { added: m, answer: f } = at(a, d, "", !0), w = Pn(d), g = () => {
      if (!m || e.nodes.one(m.id) !== m) return;
      let y;
      try {
        y = s.take(m, h, w);
      } catch (_) {
        console.warn("WORKSHOP: another board could not take the card", _);
      }
      if (y === "taken") return;
      const T = Math.round(w.x), P = Math.round(w.y);
      m.position?.(T, P, () => e.updateSelectionResizeRotate?.(), void 0, mt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [no({ ...m.options, x: T, y: P })] });
    };
    !f || typeof f.then != "function" ? g() : f.then((y) => {
      y === !0 && !S && g();
    }, () => {
    });
  }
  const Te = {
    governs(s) {
      if (A.get(s.id) !== s) return null;
      const a = we(s.id)?.kind;
      return a === "card" ? { canMove: !x, canEditText: !x && !O && o.kind !== "release-plan", canConnect: Rn() } : a === "lane" ? { canMove: !1, canEditText: !x && !O } : a === "handle" ? { canMove: !x && !O, canEditText: !1, ...!ae.narrow && { cursor: i ? "ew-resize" : "grab" }, ...ae.narrow && { edgePan: !1 } } : Bs;
    },
    onStart(s, a) {
      const d = we(s.id), h = { x: a.x - (s.options.x ?? 0), y: a.y - (s.options.y ?? 0) };
      if (d.kind === "handle") {
        const w = x || O ? null : i ? i.handleDrag(o, ve(s.id), h, ae) : Yi(ve(s.id));
        return w ? (ie(), He(), pe && (clearTimeout(pe.timer), pe = null), b = { name: ve(s.id), follow: w, last: null }, !0) : !1;
      }
      const m = d.key;
      if (x || O || !o.cards.some((w) => w.id === m)) return !1;
      ie(), He();
      let f = null;
      try {
        f = (i?.chooser ?? t.chooseCandidate)?.(o, m, h, ae) ?? null;
      } catch (w) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", w);
      }
      return M = { cardId: m, evaluate: f, grab: h, outcome: { kind: "home" } }, B(o, { skip: m }), !0;
    },
    onMove(s, a) {
      if (b) {
        b.last = b.follow(nn(a)), B(b.last.next, { grip: b.name, layout: Ai(b.last.layout) }), K(t.onPreview, b.last.next === o ? null : b.last.next);
        return;
      }
      if (!M) return;
      const d = Uo(M.cardId, a, M.evaluate);
      if (Hs(d, M.outcome)) return;
      M.outcome = d;
      const h = d.kind === "candidate" ? d.next : null;
      B(h ?? o, { skip: M.cardId }), K(t.onPreview, h);
    },
    onEnd(s, a) {
      if (b) {
        const { follow: w, name: g } = b, y = w(nn(a));
        if (b = null, K(t.onPreview, null), y.refusal) {
          ye(g, y.refusal), B(o), e.announce?.(y.refusal), K(t.onRefuse, { laneId: null, reason: y.refusal });
          const P = y.override && $r(y.override.edit);
          P && Fn(P, o.cards.find((_) => _.id === P)?.laneId ?? "", y.refusal, y.override);
        } else ct(y.next, {}) || B(o);
        const T = Vt(o, ve(s.id));
        return T ? { accept: !0, settle: T } : { accept: !1 };
      }
      if (!M) return { accept: !1 };
      const { cardId: d, evaluate: h } = M, m = Uo(d, a, h), f = o.cards.find((w) => w.id === d);
      if (M = null, K(t.onPreview, null), m.kind === "candidate" && i) {
        if (!ct(m.next, { cardId: d, laneId: m.laneId }, d))
          return B(o, { skip: d }), { accept: !1 };
        m.said && (ye("card-" + d, m.said), e.announce?.(m.said));
        const w = Vt(o, ve(s.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (m.kind === "candidate") {
        o = m.next, B(o, { skip: d });
        const w = o.lanes.find((y) => y.id === m.laneId);
        e.announce?.(`${Z(f)} moved to ${w.label}. ${Ue(o, w.id)}.`), K(t.onChange, o, { cardId: d, laneId: m.laneId });
        const g = Vt(o, ve(s.id));
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      if (m.kind === "refused") {
        const w = m.override ? m.override.to ?? i?.overrideWords?.(o, m.override.edit) : void 0;
        Hi(Z(f), { cardId: d, laneId: m.laneId, reason: m.reason }, w ?? (i && m.laneId === f.laneId ? "there" : void 0)), m.near && ye("card-" + d, m.reason), i ? m.override && Fn(d, m.laneId, m.reason, m.override) : m.near || Fn(d, m.laneId, m.reason);
      } else if (m.kind === "outside" && so() && !_e()) {
        const w = bt(o, d);
        if (!w) {
          const g = { x: s.options.x ?? 0, y: s.options.y ?? 0, width: s.options.width ?? 228, height: s.options.height ?? 76 }, y = Ci(d, a);
          if (y?.reason)
            return B(o, { skip: d }), y.board.flash(y.laneId, y.reason), e.announce?.(`${Z(f)} can't go in ${y.laneLabel}. ${y.reason} It stays where it was.`), K(t.onRefuse, { cardId: d, laneId: null, reason: y.reason }), { accept: !1 };
          if (y)
            return $i(y.board, d, g, a), { accept: !0 };
          const T = Si(g);
          return at(d, T ? Pn(g) : g, T ? " It was let go on another board, so it waits just past that board." : ""), { accept: !0 };
        }
        B(o, { skip: d }), e.announce?.(w), K(t.onRefuse, { cardId: d, laneId: null, reason: w });
      } else
        B(o, { skip: d }), m.kind === "outside" && (e.announce?.(`${Z(f)} was not dropped on a lane. It stays where it was.`), K(t.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(s) {
      if (b) {
        b = null, K(t.onPreview, null), B(o);
        return;
      }
      const a = M && o.cards.find((d) => d.id === M.cardId);
      M = null, K(t.onPreview, null), B(o, { skip: we(s.id)?.key }), a && e.announce?.(`Move cancelled. ${Z(a)} stays where it was.`);
    },
    onTextCommit(s, a, d) {
      const h = we(s.id);
      if (!h || x || O) return !1;
      const m = h.kind === "card" ? li(o.cards.find((U) => U.id === h.key) ?? {}) : null;
      m && (a = a.split(`
`).filter((U) => U.trim() !== m).join(`
`));
      let f = a.replace(/\s+/g, " ").trim();
      const w = [], g = oe(o), y = g && h.kind === "card" ? xe(g).renamed(o, h.key, f) : null;
      y && (f = y.label, w.push(...y.edits));
      const T = h.kind === "lane" ? { laneId: h.key, label: f } : { cardId: h.key, label: f };
      w.unshift(h.kind === "lane" ? { kind: "rename_lane", lane: { id: h.key }, label: f } : { kind: "rename_card", card: { id: h.key }, label: f });
      const P = $e(o, w);
      if ("refused" in P) {
        const { reason: U } = P.refused;
        return e.announce?.(`${d} keeps its name. ${U}`), K(t.onRefuse, { ...h.kind === "lane" ? { laneId: h.key } : { cardId: h.key }, rename: T, reason: U }), !1;
      }
      if (JSON.stringify(P.workshop) === JSON.stringify(o))
        return B(o), !1;
      const _ = h.kind === "card";
      return _ && e.beginHostStep?.(), o = P.workshop, h.kind === "card" && fn.set(h.key, f), _ && e.endHostStep?.(), B(o), e.announce?.(y ? P.report.edits.map((U) => U.said).join(" ") : `${d} renamed to ${f}.`), K(t.onChange, o, { rename: T, ...i ? { edits: w } : {} }), y ? !1 : f;
    },
    onKeyDown(s, a) {
      const d = we(s.id);
      if (x || O || M || b || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (ue && (ue.node !== s.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== ue.key) && Jo(), ue && a.key === "Escape")
        return a.preventDefault(), Jo(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (ue && a.key === "Enter") {
        a.preventDefault();
        const w = ue.choices[ue.at];
        return ue = null, K(t.onPreview, null), o = w.next, B(o), e.announce?.(w.done), K(t.onChange, o, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: w.edits }), !0;
      }
      const h = i?.keyChoices?.(o, ve(s.id), a.key);
      if (h) {
        a.preventDefault();
        const w = [], g = [];
        for (const P of typeof h == "string" ? [] : h) {
          const _ = $e(o, P.edits);
          "refused" in _ ? g.push(`${P.said}: ${_.refused.reason}`) : w.push({ ...P, next: _.workshop, done: _.report.edits.map((U) => U.said).join(" ") });
        }
        if (!w.length)
          return e.announce?.(typeof h == "string" ? h : g.join(" ")), !0;
        const y = ue && ue.node === s.id ? (ue.at + 1) % w.length : 0;
        ue = { node: s.id, key: a.key.toLowerCase(), choices: w, at: y }, B(w[y].next), K(t.onPreview, w[y].next);
        const T = w.length > 1 ? ` (${y + 1} of ${w.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${w[y].said}${T} Enter to make it, Escape to cancel.`), !0;
      }
      const m = i?.keyEdit?.(o, ve(s.id), { key: a.key, shiftKey: a.shiftKey });
      if (m) {
        a.preventDefault();
        const w = $e(o, m);
        if ("refused" in w) {
          e.announce?.(w.refused.reason), K(t.onRefuse, { laneId: w.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: w.refused.reason });
          const g = m.length === 1 && w.refused.overridable ? $r(m[0]) : null;
          g && Fn(g, o.cards.find((y) => y.id === g)?.laneId ?? "", w.refused.reason, { edit: m[0] });
        } else ct(w.workshop, d?.kind === "card" ? { cardId: d.key } : {});
        return !0;
      }
      if (d?.kind !== "card") return !1;
      const f = o.cards.find((w) => w.id === d.key);
      if (!f) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Ko(f.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Ti())
        return a.preventDefault(), Ko(f.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (q?.cardId !== f.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: w, next: g, spot: y } = q;
        if (q = null, w === null)
          return K(t.onPreview, null), at(f.id, y), !0;
        const T = o;
        o = g, B(o), ze(w), K(t.onPreview, null);
        const P = o.lanes.find((_) => _.id === w);
        return e.announce?.(`${Z(f)} moved to ${P.label}. ${Ue(o, w)}.`), K(t.onChange, o, { cardId: f.id, laneId: w, ...i ? { edits: i.editsBetween(T, o) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), He(), e.announce?.(`Move cancelled. ${Z(f)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const s = (e.getSelectedNodes?.() ?? []).filter((a) => A.get(a.id) === a).map((a) => a.id);
      ot = s.length === 1, A.clear(), L.clear(), N.clear(), me.clear(), j.clear(), D.clear(), M = null, q = null, B(O ?? o, { animate: !1 }), s.length === 1 && (Ie = Ie.then(() => {
        ot = !1;
        const a = A.get(s[0]);
        if (!S && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        hn();
      }));
    }
  };
  Te.onFreeMove = (s, a) => {
    if (!En() || s.options?.isComment) return Bt();
    const d = Mn(a), h = Nn(s), m = _n(s), f = o.lanes.filter((y) => !m && rn(o, y.id, h) === null).map((y) => y.id), w = d && i?.noteUnder?.(o, nn(a), ae);
    w && (h.under = w);
    const g = d ? m ?? rn(o, d, h) : null;
    X && X.noteId === s.id && X.laneId === d && X.refusal === g || (X = { noteId: s.id, laneId: d, refusal: g, open: f }, Re());
  }, Te.onFreeDrop = (s, a, d) => {
    if (Bt(), !En() || s.options?.isComment) return;
    const h = Mn(a);
    if (!h) return;
    const m = Nn(s), f = i?.noteUnder?.(o, nn(a), ae);
    f && (m.under = f), Yt(m, a);
    const w = o.lanes.find((y) => y.id === h), g = _n(s) ?? rn(o, h, m);
    return g ? (ie(!1), re = { laneId: h, reason: g, timer: setTimeout(() => ie(), 1500) }, Re(), e.announce?.(`${zt(m.label)} can't go in ${w.label}. ${g}`), K(t.onRefuse, { noteId: s.id, laneId: h, reason: g }), "refused") : (qt([{ node: s, offer: m, from: d }], h), "taken");
  }, Te.onFreeGroupDrop = (s, a, d) => {
    if (Bt(), !En() || s.some((g) => g.options?.isComment)) return;
    const h = Mn(a);
    if (!h) return;
    const m = o.lanes.find((g) => g.id === h), f = s.map((g) => ({ node: g, offer: Yt(Nn(g), a) })), w = Mi(f, h);
    if (w) {
      ie(!1), re = { laneId: h, reason: w, timer: setTimeout(() => ie(), 1500) }, Re(), e.announce?.(`${Yo(f.map((g) => zt(g.offer.label)))} can't go in ${m.label}. ${w}`);
      for (const { node: g } of f) K(t.onRefuse, { noteId: g.id, laneId: h, reason: w });
      return "refused";
    }
    return qt(f.map((g, y) => ({ ...g, from: d?.[y] })), h), "taken";
  }, Te.onFreeTextCommit = (s) => {
    if (!En() || s.options?.isComment || !e.nodes.one(s.id)) return;
    const a = s.options ?? {}, d = { x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 }, h = Mn(d);
    if (!h) return;
    const m = Yt(Nn(s), d), f = o.lanes.find((_) => _.id === h), w = _n(s) ?? rn(o, h, m);
    if (!w) {
      qt([{ node: s, offer: m }], h);
      return;
    }
    ie(!1), re = { laneId: h, reason: w, timer: setTimeout(() => ie(), 1500) }, Re(), e.announce?.(`${zt(m.label)} can't go in ${f.label}. ${w} It is beside the board.`), K(t.onRefuse, { noteId: s.id, laneId: h, reason: w });
    const { width: g } = Ge(o), y = Pn({ x: Y.x + g + 32, y: a.y ?? Y.y, width: a.width ?? 0, height: a.height ?? 0 }), T = Math.round(y.x), P = Math.round(y.y);
    s.position(T, P, () => e.updateSelectionResizeRotate?.(), void 0, mt() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [no({ ...s.options, x: T, y: P })] });
  }, Te.undoState = () => ({ cards: o.cards.map((s) => ({ ...s })), pairs: [...Be], lines: (o.lines ?? []).map((s) => ({ ...s })) }), Te.onUndoRestore = (s, a) => {
    if (S) return;
    const d = new Map((s?.cards ?? []).map((f) => [f.id, f])), h = new Map(s?.pairs ?? []), m = (f) => Be.get(f) ?? h.get(f) ?? f;
    for (const f of a.added) {
      const w = m(f), g = o.cards.find((T) => T.id === w);
      if (!g || d.has(w)) continue;
      o = Q({ ...o, cards: o.cards.filter((T) => T !== g), lines: kn(o.lines, w, f) }), B(o);
      const y = K(t.onChange, o, { cardId: w, cardToNote: { noteId: f }, via: "undo" });
      e.holdTrade?.(f, y), io(y);
    }
    for (const f of a.removed) {
      const w = m(f), g = d.get(w);
      if (!g || o.cards.some((W) => W.id === w)) continue;
      const y = (s?.lines ?? []).filter((W) => W.parentId === w || W.childId === w), T = Ao(o, g), P = {
        id: w,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...y.length ? { lines: y } : {}
      }, _ = [g.laneId, ...o.lanes.map((W) => W.id)].find((W) => qn(o, W, P));
      if (!_) {
        e.announce?.(`${Z(g)} could not go back on the board: there is no room for it.`);
        continue;
      }
      o = Di(qn(o, _, P), w, s?.cards ?? []), w !== f && Be.set(f, w), B(o);
      const U = o.cards.findIndex((W) => W.id === w), R = o.cards.slice(U + 1).find((W) => W.laneId === _)?.id, H = K(t.onChange, o, { cardId: w, laneId: _, noteToCard: {
        noteId: f,
        label: T,
        ...g.look ? { look: g.look } : {},
        ...g.asNote ? { asNote: g.asNote } : {},
        ...R ? { before: R } : {},
        ...y.length ? { lines: kn(y, w, f) } : {}
      }, via: "undo" });
      e.holdTrade?.(f, H), io(H);
    }
    for (const f of d.values()) {
      const w = o.cards.find((T) => T.id === f.id);
      if (!w || w.label === f.label || fn.get(f.id) !== w.label) continue;
      const g = [{ kind: "rename_card", card: { id: f.id }, label: f.label }], y = $e(o, g);
      "refused" in y || (o = y.workshop, fn.set(f.id, f.label), B(o), e.announce?.(`${Z(w)} is called ${Z(f)} again.`), K(t.onChange, o, { rename: { cardId: f.id, label: f.label }, ...i ? { edits: g } : {}, via: "undo" }));
    }
    Array.isArray(s?.lines) && Fi(s.lines);
  };
  let Ft = !1;
  Te.onNodeAdded = (s) => {
    S || Ft || A.get(s.id) === s || (o.lines ?? []).some((a) => a.parentId === s.id || a.childId === s.id) && (Ft = !0, queueMicrotask(() => {
      Ft = !1, S || Re();
    }));
  }, Te.onLine = (s, a) => {
    S || queueMicrotask(() => {
      S || Wi(s, a);
    });
  };
  const Oi = e.setDragPolicy(Te), Dt = {
    verdict(s, a) {
      if (!En()) return null;
      const d = Mn(a);
      if (!d) return null;
      const h = Nn(s), m = i?.noteUnder?.(o, nn(a), ae);
      return m && (h.under = m), { laneId: d, laneLabel: o.lanes.find((f) => f.id === d).label, reason: _n(s) ?? rn(o, d, h) };
    },
    take: (s, a, d) => Te.onFreeDrop?.(s, a, d),
    flash(s, a) {
      S || !o.lanes.some((d) => d.id === s) || (ie(!1), re = { laneId: s, reason: a, timer: setTimeout(() => ie(), 1500) }, Re());
    }
  };
  Gn.has(e) || Gn.set(e, /* @__PURE__ */ new Set()), Gn.get(e).add(Dt);
  const Li = t.onSelect || u || t.onRuleEdit ? e.onSelectionChange?.(() => {
    hn(), dr(), nt === "selected" && wn();
  }) : void 0;
  let it = null;
  const zo = (s) => {
    const d = s.target?.closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null, h = d && A.has(d) ? ar(d) : null;
    h !== it && (it = h, dr());
  };
  u && e.element?.addEventListener?.("pointerover", zo);
  const Ho = (s) => {
    if (q && He(), k && !s?.target?.closest?.("[data-board-pick]") && (k = null, Ce && gn(Ce), queueMicrotask(hn)), Tn = null, Xe && (clearTimeout(Xe), Xe = null), !s || S || typeof e.clientToWorld != "function" || typeof s.button == "number" && s.button !== 0 || s.target?.closest?.("[data-node-id], [data-connection-id]") || e.getSelectedLine?.()) return;
    const a = new Set(o.lanes.map((f) => le(ee.lane(f.id))));
    if ((e.getSelectedNodes?.() ?? []).some((f) => !a.has(f?.id))) return;
    const d = o.lanes.flatMap((f) => [ee.caption(f.id), ee.column(f.id)]).map((f) => A.get(le(f))).filter(Boolean), h = d.length ? e.hitTestNodes?.(e.clientToWorld({ x: s.clientX, y: s.clientY }), d, { padding: 0 }) : null, m = h ? we(h.id) : null;
    m && (Tn = { pointerId: s.pointerId, laneId: m.key, x: s.clientX, y: s.clientY });
  }, Go = (s) => {
    const a = Tn;
    Tn = null, !(!a || s.pointerId !== a.pointerId || Math.hypot(s.clientX - a.x, s.clientY - a.y) > 6) && (Xe = setTimeout(() => {
      if (Xe = null, S || M || b || !o.lanes.some((h) => h.id === a.laneId) || (e.getSelectedNodes?.() ?? []).length || e.getSelectedLine?.() || e.element?.ownerDocument?.querySelector?.(".sb-inline-editor")) return;
      const d = A.get(le(ee.lane(a.laneId)));
      d && e.selectNodes?.([d]);
    }, 350));
  }, qo = () => {
    Tn = null;
  };
  e.element?.addEventListener?.("pointerdown", Ho, !0), e.element?.ownerDocument?.addEventListener?.("pointerup", Go, !0), e.element?.ownerDocument?.addEventListener?.("pointercancel", qo, !0), Ui(), B(o, { animate: !1 });
  function Uo(s, a, d) {
    const h = o.cards.find((P) => P.id === s);
    if (!h) return { kind: "outside" };
    if (i) {
      const P = nn(a), _ = i.refusalAt(o, s, M?.grab ?? { x: 0, y: 0 }, P, ae);
      if (_ && !_.lands) return { kind: "refused", laneId: _.laneId, reason: _.reason, ..._.override && { override: _.override } };
      const { width: U, height: R } = Ge(o), H = P.y >= 0 && P.y <= R;
      if (_?.override && H && (P.x < -40 || P.x > U + 40)) return { kind: "refused", laneId: _.laneId, reason: _.reason, override: _.override };
      if (P.x < -40 || P.y < -40 || P.x > U + 40 || P.y > R + 40) return { kind: "outside" };
      let W = o;
      try {
        W = d?.(P) ?? o;
      } catch (ne) {
        console.warn("WORKSHOP: the board kit's chooser threw", ne);
      }
      return JSON.stringify(W) === JSON.stringify(o) ? _ ? { kind: "refused", laneId: _.laneId, reason: _.reason, near: !0, ..._.override && { override: _.override } } : { kind: "home" } : { kind: "candidate", laneId: W.cards.find((ne) => ne.id === s)?.laneId ?? h.laneId, next: W, ..._ && { said: _.reason } };
    }
    const m = o.lanes.map((P) => A.get(le(ee.column(P.id)))).filter(Boolean), f = e.hitTestNodes(a, m, { padding: 6 }), w = f ? we(f.id).key : null;
    if (!w) return { kind: "outside" };
    if (w === h.laneId) return { kind: "home" };
    const g = ln(o, s, w);
    if (!g) return { kind: "refused", laneId: w, reason: De(o, s, w) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: w, next: g };
    let y = null;
    try {
      y = d({ x: a.x - Y.x, y: a.y - Y.y });
    } catch (P) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", P), { kind: "candidate", laneId: w, next: g };
    }
    const T = y?.cards.find((P) => P.id === s)?.laneId;
    return !y || !T || T === h.laneId ? { kind: "home" } : { kind: "candidate", laneId: T, next: y };
  }
  function Ti() {
    return i ? !1 : new Set(Fe(o, { layout: ae }).places.map((s) => s.row)).size > 1;
  }
  function Ko(s, a, d = !1) {
    const h = o.cards.find((R) => R.id === s), m = Tr(o, s), f = q?.cardId === s && q.laneId === null ? q.side : void 0;
    if (f !== void 0) {
      if (d || a === f) return;
      const R = f > 0 ? o.lanes[o.lanes.length - 1] : o.lanes[0];
      if (He(), R.id === h.laneId) {
        ze(R.id, O ?? o), e.announce?.(`${Z(h)} is back in ${R.label}.`);
        return;
      }
      if (m.includes(R)) {
        const W = ln(o, s, R.id);
        q = { cardId: s, laneId: R.id, next: W }, B(W), ze(R.id, W), K(t.onPreview, W), e.announce?.(`${Z(h)} to ${R.label}: ${Ue(W, R.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const H = De(o, s, R.id) ?? "That move is not available.";
      ie(), re = { laneId: R.id, reason: H, timer: setTimeout(() => ie(), 1500) }, B(O ?? o), ze(R.id, O ?? o), e.announce?.(`${Z(h)} can't move to ${R.label}. ${H}`), K(t.onRefuse, { cardId: s, laneId: R.id, reason: H });
      return;
    }
    const w = q?.cardId === s ? q.laneId : h.laneId;
    let g;
    if (d) {
      const { places: R } = Fe(o, { layout: ae }), H = R.find((W) => W.laneId === w);
      g = R.filter((W) => W.column === H.column && (W.row - H.row) * a > 0).sort((W, ne) => (W.row - ne.row) * a).map((W) => o.lanes.find((ne) => ne.id === W.laneId));
    } else {
      const R = o.lanes.findIndex((H) => H.id === w);
      g = a > 0 ? o.lanes.slice(R + 1) : o.lanes.slice(0, R).reverse();
    }
    const y = g[0] && !m.includes(g[0]) ? g[0] : null, T = y !== null && Ne?.cardId === s && Ne.laneId === y.id;
    if (Ne = null, y && !T) {
      const R = De(o, s, y.id) ?? "That move is not available.", H = i ? { edit: { kind: "move_card", card: { id: s }, lane: { id: y.id } } } : void 0;
      if (!!t.confirmOverride && !x && !O && !_e() && (i ? !("refused" in $e(o, [{ ...H.edit, override: !0 }], { actor: { by: "check", via: "chat" } })) : Yn(o, s, y.id, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) !== null)) {
        ie(), He(), re = { laneId: y.id, reason: R, timer: setTimeout(() => ie(), 1500) }, B(O ?? o), ze(y.id, O ?? o), e.announce?.(`${Z(h)} can't move to ${y.label} by this board's rules. ${R} Move it anyway? Cancel, then press the arrow again to pass over it.`), Ne = { cardId: s, laneId: y.id }, Fn(s, y.id, R, H);
        return;
      }
    }
    const P = g.find((R) => m.includes(R)), _ = y && P ? `${Z(h)} can't go in ${y.label}: ${De(o, s, y.id) ?? "that move is not available."} ` : "";
    if (ie(), !P) {
      const R = g[0];
      if (!R) {
        if (!d && so()) {
          const W = bt(o, s);
          if (W) {
            e.announce?.(W), K(t.onRefuse, { cardId: s, laneId: null, reason: W });
            return;
          }
          Pi(h, a);
          return;
        }
        e.announce?.(`${Z(h)} has no lane to move to on that side.`);
        return;
      }
      const H = De(o, s, R.id) ?? "That move is not available.";
      re = { laneId: R.id, reason: H, timer: setTimeout(() => ie(), 1500) }, B(q?.next ?? O ?? o), ze(R.id, q?.next ?? O ?? o), e.announce?.(`${Z(h)} can't move to ${R.label}. ${H}`), K(t.onRefuse, { cardId: s, laneId: R.id, reason: H });
      return;
    }
    if (P.id === h.laneId) {
      He(), ze(P.id, O ?? o), e.announce?.(`${Z(h)} is back in ${P.label}.`);
      return;
    }
    const U = ln(o, s, P.id);
    q = { cardId: s, laneId: P.id, next: U }, B(U), ze(P.id, U), K(t.onPreview, U), e.announce?.(`${_}${Z(h)} to ${P.label}: ${Ue(U, P.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function ze(s, a = o) {
    const d = i ? Ki(a, ee.column(s)) : Fe(a, { layout: ae, rows: rr() }).places.find((y) => y.laneId === s), h = e.canvas?.viewbox?.();
    if (!d || !h || !(h.width > 0) || !(h.height > 0)) return;
    const m = 16, f = (y, T, P, _) => T + m * 2 >= _ || y - m < P ? y - m - P : y + T + m > P + _ ? y + T + m - (P + _) : 0, w = f(Y.x + d.x, d.width, h.x, h.width), g = f(Y.y + d.y, d.height, h.y, h.height);
    (w || g) && e.panBy?.({ x: w, y: g });
  }
  function hn() {
    if (!t.onSelect || ot) return;
    const s = S ? [] : e.getSelectedNodes?.() ?? [], a = s.length === 1 && A.get(s[0].id) === s[0] ? we(s[0].id) : null;
    k && s.some((w) => !$.has(w.id)) && (k = null, Ce && gn(Ce));
    const [d, h] = k ? k.split(">") : [], m = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : d && h && !a ? { path: { from: d, to: h } } : null, f = m ? JSON.stringify(m) : null;
    f !== Fo && (Fo = f, K(t.onSelect, m));
  }
  function Jo() {
    ue && (ue = null, B(o), K(t.onPreview, null));
  }
  function He() {
    q && (q = null, K(t.onPreview, null), B(O ?? o));
  }
  function Pi(s, a) {
    const { width: d } = Ge(o), h = A.get(le(ee.card(s.id)))?.options, m = h?.width ?? 228, f = Pn({
      x: a > 0 ? Y.x + d + 32 : Y.x - m - 32,
      y: h?.y ?? Y.y,
      width: m,
      height: h?.height ?? 76
    }, a), w = Mr(o, s.id);
    q = { cardId: s.id, laneId: null, side: a, spot: f, next: o }, B(o), K(t.onPreview, w), e.announce?.(`${Z(s)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function _e() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function En() {
    return !S && !x && !O && !M && !_e() && so();
  }
  function Bt() {
    X && (X = null, S || Re());
  }
  function Mn(s) {
    const a = o.lanes.map((h) => A.get(le(ee.column(h.id)))).filter(Boolean), d = e.hitTestNodes(s, a, { padding: 6 });
    return d ? we(d.id)?.key ?? null : null;
  }
  function Nn(s) {
    const a = s.options ?? {}, d = ri({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), h = String(a.text ?? ""), m = h.replace(/\s+/g, " ").trim(), f = {};
    h.trim() !== m && h.length <= 4e3 && (f.text = h.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (f.shape = a.shape);
    for (const g of ["width", "height"]) Number.isFinite(a[g]) && a[g] >= 10 && a[g] <= 4e3 && (f[g] = Math.round(a[g]));
    if (bo(a.image)) {
      f.image = { src: a.image };
      for (const [g, y] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[y]) && a[y] >= 1 && a[y] <= 2e4 && (f.image[g] = a[y]);
    }
    a.link?.data && Lr({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (f.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const w = Ei(s);
    return { id: s.id, label: m, ...d ? { look: d } : {}, ...Object.keys(f).length ? { asNote: f } : {}, ...w.length ? { lines: w } : {} };
  }
  function Ei(s) {
    const a = /* @__PURE__ */ new Map(), d = (h) => typeof h == "string" && !!A.get(h) && A.get(h) === e.nodes.one(h);
    for (const h of s.relationships?.getAssociations?.() ?? [])
      (h.targetPoint || !d(h.childId)) && a.set(h.id, Wn(h));
    for (const h of e.nodes?.allNodes ?? [])
      if (!(h === s || d(h.id)))
        for (const m of h.relationships?.getAssociations?.() ?? [])
          m.childId === s.id && !m.targetPoint && a.set(m.id, Wn(m));
    for (const h of ao(o, s.id)) a.set(h.id, h);
    return [...a.values()];
  }
  function Yo(s) {
    return s.length > 1 ? s.slice(0, -1).join(", ") + " and " + s.at(-1) : s[0] ?? "";
  }
  function Mi(s, a) {
    for (const { node: f } of s) {
      const w = _n(f);
      if (w) return w;
    }
    const d = o.lanes.find((f) => f.id === a), h = Ze(o, a);
    if (d.capacity !== void 0 && !d.station && h + s.length > d.capacity) {
      const f = d.capacity - h;
      return f > 0 ? `It has room for ${f} more ${f === 1 ? "card" : "cards"}.` : `It already holds ${h} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let m = o;
    for (const { offer: f } of s) {
      const w = rn(m, a, f);
      if (w) return w;
      m = qn(m, a, f);
    }
    return null;
  }
  function _n(s) {
    if (s.options?.image && !bo(s.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = s.options?.link;
    return a?.data && !Lr({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : Ni(s) ? ro : null;
  }
  function pn(s) {
    return !!s && A.get(s.id) !== s && !!e.isDerivedNode?.(s);
  }
  function Ni(s) {
    for (const a of s.relationships?.getAssociations?.() ?? [])
      if (!a.targetPoint && pn(e.nodes.one(a.childId))) return !0;
    for (const a of e.nodes?.allNodes ?? [])
      if (!(a === s || !pn(a))) {
        for (const d of a.relationships?.getAssociations?.() ?? []) if (d.childId === s.id && !d.targetPoint) return !0;
      }
    return !1;
  }
  const zt = (s) => s || "This note", Z = (s) => s.label || "The empty card", Zo = (s) => {
    const a = String(s ?? "").toLowerCase();
    return a === "" || a === "rectangle" || a === "roundedrectangle" ? null : Ds[a] ?? "shape";
  }, Ht = (s) => (/^[aeiou]/i.test(s) ? "an " : "a ") + s, Vo = (s) => {
    const a = s.flatMap((d) => {
      const h = Zo(d.asNote?.shape);
      return h ? [{ card: d, word: h }] : [];
    });
    if (!a.length) return "";
    if (s.length === 1) {
      const { word: d } = a[0];
      return d === "shape" ? " It had its own shape: drag it off the board to get it back." : ` It was ${Ht(d)}: drag it off the board to get its ${d} back.`;
    }
    return " " + a.map(({ card: d, word: h }) => h === "shape" ? `${Z(d)} had its own shape` : `${Z(d)} was ${Ht(h)}`).join("; ") + ": drag a card off the board to get its shape back.";
  }, _i = (s) => {
    const a = Zo(s);
    return a ? a === "shape" ? " It has its shape back." : ` It is ${Ht(a)} again.` : "";
  };
  function Rn() {
    return !S && !x && !O && !_e() && sa(o);
  }
  function Wn(s) {
    const a = { id: s.id, parentId: s.parentId, childId: s.childId };
    for (const h of [
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
      const m = s[h];
      m != null && m !== "" && (a[h] = m);
    }
    for (const h of ["sourceAnchor", "targetAnchor"]) {
      const m = s[h];
      m && Number.isFinite(m.x) && Number.isFinite(m.y) && (a[h] = { x: m.x, y: m.y });
    }
    const d = s.targetPoint;
    return d && Number.isFinite(d.x) && Number.isFinite(d.y) && (a.targetPoint = { x: d.x, y: d.y }, delete a.targetAnchor), a;
  }
  function Qo(s, a) {
    const d = { ...s };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function Xo(s) {
    if (!s || e.nodes.one(s.id) !== s) return null;
    if (A.get(s.id) === s) {
      const a = we(s.id);
      return a?.kind === "card" && o.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return s.options?.isComment || pn(s) ? null : s.id;
  }
  function Gt(s, a) {
    if (s.cards.some((h) => h.id === a)) {
      const h = A.get(le(ee.card(a)));
      return h?.relationships && h.svgGroup ? h : null;
    }
    const d = e.nodes.one(a);
    return d && A.get(a) !== d && !pn(d) && d.svgGroup ? d : null;
  }
  function er(s) {
    const a = [];
    for (const d of s) {
      const h = e.nodes.one(d.parentId);
      if (!h?.relationships || A.get(h.id) === h || h.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const w = h.relationships.addFloatingAssociation(d.targetPoint, Hn(d));
        a.push({ type: "addRelationship", data: { ...w } });
        continue;
      }
      const m = e.nodes.one(d.childId);
      if (!m || A.get(m.id) === m) continue;
      const f = h.relationships.addAssociation(m, Hn(d));
      a.push({ type: "addRelationship", data: { ...f } });
    }
    return a;
  }
  function Ri(s) {
    const a = /* @__PURE__ */ new Set();
    for (const d of s.lines ?? []) {
      if (d.targetPoint) {
        const _ = Gt(s, d.parentId);
        if (!_ || A.get(_.id) !== _) continue;
        const U = { ...d, parentId: _.id }, R = JSON.stringify(U);
        a.add(d.id);
        const H = me.get(d.id);
        if (H && H.key === R && H.holder === _ && !H.other && _.relationships.hasAssociationId?.(d.id)) continue;
        H && e.nodes.one(H.holder.id) === H.holder && H.holder.relationships?.removeAssociation?.(d.id), _.relationships.addFloatingAssociation(d.targetPoint, Hn(U)), me.set(d.id, { holder: _, other: null, swapped: !1, key: R });
        continue;
      }
      const h = Gt(s, d.parentId), m = Gt(s, d.childId);
      if (!h || !m || h === m) continue;
      const f = A.get(h.id) !== h, w = f ? m : h, g = f ? h : m, y = f ? Qo({ ...d, parentId: w.id, childId: g.id }, d) : { ...d, parentId: w.id, childId: g.id }, T = JSON.stringify(y);
      a.add(d.id);
      const P = me.get(d.id);
      P && P.key === T && P.holder === w && P.other === g && w.relationships.hasAssociationId?.(d.id) || (P && e.nodes.one(P.holder.id) === P.holder && P.holder.relationships?.removeAssociation?.(d.id), w.relationships.addAssociation(g, Hn(y)), me.set(d.id, { holder: w, other: g, swapped: f, key: T }));
    }
    for (const [d, h] of [...me])
      a.has(d) || (e.nodes.one(h.holder.id) === h.holder && h.holder.relationships?.hasAssociationId?.(d) && h.holder.relationships.removeAssociation(d), me.delete(d));
  }
  function st(s) {
    const a = s.parentId ? e.nodes.one(s.parentId) : null, d = s.id ?? s.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !s.id) && a.relationships.removeAssociation(d);
    });
  }
  let jn = null;
  function Wi(s, a) {
    if (s === "addRelationship") {
      if (me.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, h = e.nodes.one(a?.parentId), m = d ? null : e.nodes.one(a?.childId), f = Xo(h), w = d ? null : Xo(m);
      if (pn(h)) return;
      const g = jn?.lineId === a?.id ? o.lines?.find((U) => U.id === a?.id) : void 0;
      g && (jn = null);
      const y = (U) => {
        st(a), g && B(O ?? o), e.announce?.(U), K(t.onRefuse, { reason: U, laneId: null });
      };
      if (!Rn()) {
        st(a), g && B(O ?? o);
        return;
      }
      if (pn(m)) return y(ro);
      if (!f || !w && !d) return y(g ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const T = d ? String(a.childId) : w;
      if (g) {
        const U = o.cards.some((ne) => ne.id === f), R = !d && o.cards.some((ne) => ne.id === w);
        if (!U && !R) return en({ remove: g.id });
        const H = { ...Wn(a), id: g.id, parentId: f, childId: T }, W = Kn(o, H);
        if (W) return y(W);
        st(a), en({ set: H });
        return;
      }
      const P = gi(o, f, T, Wn(a)), _ = Kn(o, P);
      if (_) return y(_);
      st(a), en({ set: P });
      return;
    }
    if (s === "removeRelationship") {
      const d = [...me].find(([m, f]) => (m === a?.id || !a?.id && f.other?.id === a?.childId) && f.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const h = me.get(d);
      if (me.delete(d), e.nodes.one(h.holder.id) !== h.holder || h.other && e.nodes.one(h.other.id) !== h.other || !Rn())
        return Rn() || S ? void 0 : B(O ?? o);
      jn = { lineId: d }, queueMicrotask(() => {
        S || jn?.lineId !== d || (jn = null, en({ remove: d }));
      });
      return;
    }
    if (s === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const h = [...me].find(([P, _]) => P === d?.associationId && _.holder.id === d?.id);
        if (!h) continue;
        const [m, f] = h, w = o.lines?.find((P) => P.id === m), g = f.holder.relationships?.getAssociations?.().find((P) => P.id === m);
        if (!w || !g) continue;
        if (!Rn()) {
          B(O ?? o);
          continue;
        }
        const y = Wn(g), T = f.swapped ? Qo({ ...y, id: w.id, parentId: w.parentId, childId: w.childId }, y) : { ...y, id: w.id, parentId: w.parentId, childId: w.childId };
        JSON.stringify(ji(T)) !== JSON.stringify(w) && (me.set(m, { ...f, key: "" }), en({ set: T }));
      }
  }
  function ji(s) {
    return vt({ ...o, lines: [] }, s)?.lines?.[0] ?? null;
  }
  function en(s) {
    const a = o.lines?.find((g) => g.id === ("set" in s ? s.set.id : s.remove)), d = "set" in s ? vt(o, s.set) : Nr(o, s.remove);
    if (!d || d === o) return;
    e.beginHostStep?.(), o = d, e.endHostStep?.(), B(O ?? o);
    const h = "set" in s ? s.set : a, m = [h.parentId, h.childId].map((g) => o.cards.find((y) => y.id === g)?.label ?? e.nodes.one(g)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), f = (g) => m[g] || (g === 1 && h.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in s ? a ? `The line from ${f(0)} to ${f(1)} changed.` : h.targetPoint ? `${f(0)} has a line to a point on the canvas.` : `${f(0)} is joined to ${f(1)}.` : `The line from ${f(0)} to ${f(1)} was taken away.`);
    const w = K(t.onChange, o, { line: s });
    io(w, () => {
      if (S || o !== d) return;
      const g = a ? vt(o, a) : "set" in s ? Nr(o, s.set.id) : null;
      g && (o = g, B(O ?? o));
    });
  }
  function Fi(s) {
    const a = new Map(s.map((h) => [h.id, h])), d = new Map((o.lines ?? []).map((h) => [h.id, h]));
    for (const h of d.keys()) a.has(h) || en({ remove: h });
    for (const [h, m] of a)
      JSON.stringify(d.get(h)) !== JSON.stringify(m) && Kn(o, m) === null && en({ set: m });
  }
  function qt(s, a) {
    let d = o;
    const h = /* @__PURE__ */ new Map(), m = s.map(({ node: y, offer: T, from: P }) => {
      let _ = T.lines;
      for (const [H, W] of h) _ = kn(_, H, W);
      d = qn(d, a, { ...T, ..._ ? { lines: _ } : {} });
      const U = d.cards[d.cards.length - 1];
      U.id !== y.id && h.set(y.id, U.id);
      const R = { ...y.options ?? {}, ...P ? { x: P.x, y: P.y } : {} };
      return { node: y, card: U, kept: R, lines: kn(_ ?? [], y.id, U.id), under: T.under, day: T.day };
    });
    e.beginHostStep?.(), o = d;
    let f = o;
    for (const { node: y, card: T } of m)
      T.id !== y.id && Be.set(y.id, T.id), Ve.set(le(ee.card(T.id)), { x: y.options?.x ?? 0, y: y.options?.y ?? 0 }), mn(() => e.removeNode(y.id));
    e.endHostStep?.(), B(o), Bi(le(ee.card(m[0].card.id)));
    const w = m.length === 1 && Er(o, m[0].card) === "" && m[0].card.label ? m[0].card : null;
    w && zi(le(ee.card(w.id)), w.label);
    const g = o.lanes.find((y) => y.id === a);
    e.announce?.(m.length === 1 ? `${Z(m[0].card)} is now a card in ${g.label}. ${Ue(o, a)}.${Vo([m[0].card])}` : `${Yo(m.map(({ card: y }) => Z(y)))} are now cards in ${g.label}. ${Ue(o, a)}.${Vo(m.map(({ card: y }) => y))}`);
    for (const { node: y, card: T, kept: P, lines: _, under: U, day: R } of m) {
      const H = { cardId: T.id, laneId: a, noteToCard: {
        noteId: y.id,
        label: Ao(o, T),
        ...U && { under: U },
        ...R !== void 0 && { day: R },
        ...T.look ? { look: T.look } : {},
        ...T.asNote ? { asNote: T.asNote } : {},
        ..._.length ? { lines: _ } : {}
      } }, W = () => {
        o !== f || !o.cards.some((ke) => ke.id === T.id) || (o = Q({ ...o, cards: o.cards.filter((ke) => ke.id !== T.id), lines: kn(o.lines, T.id, y.id) }), f = o, B(o));
      }, ne = K(t.onChange, o, H);
      e.holdTrade?.(y.id, ne), tr(ne, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: y.id, isComment: !1 } }]);
      }, () => {
        if (!S) {
          if (W(), !e.nodes.one(P.id)) {
            e.beginHostStep?.();
            const ke = mn(() => e.addNode({ ...P }));
            ke && (ke.announcedByCreator = !0), e.endHostStep?.();
            const Dn = kn(_, T.id, y.id).filter((de) => !o.cards.some((Bn) => Bn.id === de.parentId || Bn.id === de.childId));
            ke?.ready?.then?.(() => {
              S || mn(() => er(Dn));
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
    const d = o.cards.find((P) => P.id === s), h = L.get(le(ee.card(s))) ?? {}, m = ni(d), f = e.nodes.one(m) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : m, w = (Rt.cornerRadius ?? 0) > 0, g = d.asNote, y = Er(o, d), T = {
      id: f,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: g?.width ?? h.width ?? 228,
      height: g?.height ?? h.height ?? 76,
      text: y,
      shape: g?.shape ?? (w ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? h.backgroundColor,
      fontColor: d.look?.textColor ?? h.foregroundColor,
      fontSize: d.look?.fontSize ?? h.fontSize,
      borderColor: d.look?.borderColor ?? h.borderColor,
      borderWidth: d.look?.borderWidth ?? h.borderWidth,
      ...d.look?.fontFamily ?? h.fontFamily ? { fontFamily: d.look?.fontFamily ?? h.fontFamily } : {}
    };
    g?.image && Object.assign(T, {
      image: g.image.src,
      ...g.image.width ? { imageOrigWidth: g.image.width } : {},
      ...g.image.height ? { imageOrigHeight: g.image.height } : {}
    }), g?.link && (T.link = { ...g.link });
    for (const P of Object.keys(T)) T[P] === void 0 && delete T[P];
    return { id: f, note: T };
  }
  function at(s, a, d = "", h = !1) {
    const m = o.cards.find((de) => de.id === s), f = o.lanes.find((de) => de.id === m.laneId), w = o.cards.findIndex((de) => de.id === s), g = o.cards.slice(w + 1).find((de) => de.laneId === m.laneId)?.id, { id: y, note: T } = nr(s, a), P = m.asNote, _ = ao(o, s), { leave: U } = ca(o, s, y), R = Mr(o, s, y);
    e.beginHostStep?.(), o = R;
    const H = o;
    y !== s ? Be.set(y, s) : Be.delete(y);
    const W = mn(() => e.addNode(T));
    W && (W.announcedByCreator = !0), e.endHostStep?.(), B(o);
    const ne = Promise.resolve(W?.ready).then(() => S || !W || e.nodes.one(y) !== W ? [] : mn(() => er(U))).catch(() => []);
    W?.ready?.then?.(() => {
      if (S || e.nodes.one(y) !== W) return;
      const de = () => e.selectNodes?.([W]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(de) : de();
    }), h || e.announce?.(`${Z(m)} is now a note on the canvas.${d} ${f.label}: ${Ue(o, f.id)}.${_i(P?.shape)}`);
    const ke = () => {
      e.nodes.one(y) === W && (e.beginHostStep?.(), mn(() => e.removeNode(y)), e.endHostStep?.());
    }, Dn = K(t.onChange, o, { cardId: s, cardToNote: { noteId: y } });
    return e.holdTrade?.(y, Dn), tr(Dn, () => {
      ne.then((de) => {
        W && e.nodes.one(y) === W && e.sendHeld?.([{ type: "onNodeAdded", data: { id: y, nodeOptions: no(W.options) } }, ...de]);
      });
    }, () => {
      if (!S) {
        if (ke(), o === H && !o.cards.some((de) => de.id === s)) {
          const de = {
            id: s,
            label: m.label,
            ...m.look ? { look: m.look } : {},
            ...m.asNote ? { asNote: m.asNote } : {},
            ..._.length ? { lines: _ } : {}
          }, Bn = qn(o, m.laneId, de, g);
          Bn && (o = Bn, B(o));
        }
        e.announce?.(`${Z(m)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      S || (ke(), e.keepTrade?.(y), e.announce?.(`Someone else took ${Z(m)} off the lanes first.`));
    }), { added: W, answer: Dn };
  }
  function Di(s, a, d) {
    const h = d.map((y) => y.id), m = h.indexOf(a), f = s.cards.find((y) => y.id === a);
    if (m < 0 || !f) return s;
    const w = s.cards.filter((y) => y !== f), g = w.findIndex((y) => h.indexOf(y.id) > m);
    return w.splice(g < 0 ? w.length : g, 0, f), Q({ ...s, cards: w });
  }
  function Bi(s) {
    Ie = Ie.then(() => {
      const a = A.get(s);
      if (S || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function zi(s, a) {
    Ie = Ie.then(() => {
      const d = A.get(s);
      S || x || !d?.editor?.startInline || d.editor.startInline({ text: a, caret: "all" });
    });
  }
  function mn(s) {
    return typeof e.onlyHere == "function" ? e.onlyHere(s) : s();
  }
  function tr(s, a, d, h) {
    if (!s || typeof s.then != "function") return a();
    const m = s.then((f) => {
      f === !0 ? a() : f === !1 ? d() : f === "taken" && h();
    }, () => d());
    e.holdUntil?.(m);
  }
  function Fn(s, a, d, h) {
    if (!t.confirmOverride || x || O || _e()) return;
    const m = { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }, f = (R, H) => {
      if (!h) {
        const ne = Yn(R, s, a, H);
        return ne && { next: ne };
      }
      const W = $e(R, [{ ...h.edit, override: !0 }], { actor: { by: H.by, via: "chat" }, now: H.at });
      return "refused" in W ? null : { next: W.workshop, said: W.report.edits.map((ne) => ne.said).join(" ") };
    }, w = f(o, m);
    if (!w) return;
    const g = o.cards.find((R) => R.id === s), y = o.lanes.find((R) => R.id === a);
    if (!g) return;
    const T = w.next.cards.find((R) => R.id === s)?.override?.sentence ?? d, P = h?.to ?? (h && i?.overrideWords?.(o, h.edit));
    let _;
    const U = { cardId: s, laneId: a, card: g.label, lane: y?.label ?? "", reason: T, ...P && { to: P } };
    try {
      _ = t.confirmOverride(U);
    } catch (R) {
      console.error("WORKSHOP: confirmOverride threw", R);
      return;
    }
    Promise.resolve(_).then((R) => {
      if (R !== !0 || S || x || O || _e()) return;
      const H = o.cards.find((ke) => ke.id === s), W = H && f(o, { by: K(t.overrideBy) || "You", at: (/* @__PURE__ */ new Date()).toISOString() });
      if (!H || !W) {
        e.announce?.(`${H ? Z(H) : "That card"} can't be moved ${P ?? "to " + (y?.label ?? "there")} now.`);
        return;
      }
      o = W.next, B(o), e.announce?.(W.said ?? `${Z(H)} moved to ${y?.label ?? ""} anyway. ${T}`);
      const ne = o.cards.find((ke) => ke.id === s)?.laneId ?? a;
      K(t.onChange, o, { cardId: s, laneId: ne, override: !0, reason: T, ...h && { edits: [{ ...h.edit, override: !0 }] } });
    }, () => {
    });
  }
  function Hi(s, a, d) {
    ie(!1), re = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => ie(), 1500) }, B(o, { skip: a.cardId });
    const h = o.lanes.find((m) => m.id === a.laneId);
    e.announce?.(`${s || "The empty card"} can't move ${d ?? "to " + (h?.label ?? "that lane")}. ${a.reason}`), K(t.onRefuse, a);
  }
  function ie(s = !0) {
    re && (clearTimeout(re.timer), re = null, s && !S && Re());
  }
  function Re() {
    B(M && M.outcome.kind === "candidate" ? M.outcome.next : q?.next ?? O ?? o, { skip: M?.cardId });
  }
  function or(s) {
    const a = cr(s, rr()), d = new Map(a.map((f) => [f.options.id, f.options])), h = (f, w, g, y = !1) => {
      const T = d.get(ee.column(f));
      T && (T.borderColor = w, T.borderWidth = g, delete T.borderStyle);
      const P = y && d.get(ee.lane(f));
      P && (P.borderColor = w, P.borderWidth = g);
    }, m = M?.cardId ?? q?.cardId;
    if (Le = /* @__PURE__ */ new Map(), m) {
      const f = o.cards.find((y) => y.id === m)?.laneId, w = Tr(o, m);
      if (!i || i.laneCues)
        for (const y of w) y.id !== f && (h(y.id, Cr, 2), Le.set(y.id, "open"));
      if (i?.laneCues) {
        for (const y of o.lanes) if (!w.includes(y)) {
          const T = d.get(ee.column(y.id));
          T && (T.backgroundColor = "#e9e8e2"), Le.set(y.id, "closed");
        }
      }
      const g = M ? M.outcome : q?.laneId ? { kind: "candidate", laneId: q.laneId } : null;
      g?.kind === "candidate" && (h(g.laneId, Sr, 3, !0), Le.set(g.laneId, "over")), g?.kind === "refused" && (h(g.laneId, oo, 3), Le.set(g.laneId, "refused"));
    }
    if (X && !m) {
      for (const f of X.open) f !== X.laneId && (h(f, Cr, 2), Le.set(f, "open"));
      X.laneId && !X.refusal && (h(X.laneId, Sr, 3, !0), Le.set(X.laneId, "over")), X.laneId && X.refusal && (h(X.laneId, oo, 3), Le.set(X.laneId, "refused"));
    }
    if (q?.laneId === null && q.spot) {
      const f = d.get(ee.card(q.cardId));
      f && (f.xPos = q.spot.x, f.yPos = q.spot.y);
    }
    if (re) {
      Le.set(re.laneId, "refused"), h(re.laneId, oo, 3, !0);
      const f = d.get(ee.caption(re.laneId));
      if (f && (f.text = re.reason, f.foregroundColor = "#b42318", !i)) {
        const w = d.get(ee.column(re.laneId));
        w && (f.xPos = w.xPos + 6, f.width = w.width - 12, f.height = 30, f.vectorPath = sn(f.width, 30, 0), f.backgroundColor = "transparent");
      }
    }
    if (Wt = /* @__PURE__ */ new Set(), O && s === O) {
      const f = (g, y) => JSON.stringify(g) === JSON.stringify(y), w = (g) => {
        const y = d.get(g);
        y && (y.borderStyle = "dashed", y.borderColor = Fs, y.borderWidth = 2, Wt.add(le(g)));
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
    return M || q ? o.lanes.map((s) => o.cards.filter((a) => a.laneId === s.id).length) : void 0;
  }
  function B(s, a = {}) {
    if (S) return;
    Ae = a.layout ?? ae, et = { model: s, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = or(s), h = [];
    for (const { options: f } of d) {
      const w = f.id;
      if (A.has(w)) continue;
      const g = Ve.get(w);
      Ve.delete(w);
      const y = g && a.animate !== !1 && !mt() ? { ...f, xPos: g.x, yPos: g.y } : f, T = e.nodes.add(bs(y));
      A.set(w, T), L.set(w, { ...y }), T.ready && h.push(T.ready.then(() => {
        if (A.get(w) !== T) return;
        T.applyGovernance?.(), Bo(w) && T.toBack?.(!1), we(w)?.kind === "handle" && T.svgGroup?.front?.();
        const P = ur(et?.model ?? s, w);
        P && T.svgGroup?.node?.setAttribute("aria-label", P);
      }).catch(() => {
      }));
    }
    const m = et;
    Ie = Promise.all([Ie, ...h]).then(() => {
      S || et !== m || Gi(or(m.model), m);
    }).catch((f) => console.warn("WORKSHOP: could not draw the workshop", f));
  }
  function Gi(s, a) {
    const d = new Set(s.map((m) => m.options.id)), h = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [f, w] of [...A]) {
        if (d.has(f)) continue;
        for (const [y, T] of [...N])
          T.parentId !== f && T.childId !== f || (T.parent.relationships?.removeAssociation(y), N.delete(y));
        e.deselectNode?.(w), w.editor?.cancelInline?.(), A.delete(f), L.delete(f);
        const g = D.get(f);
        g && (D.delete(f), j.delete(g)), e.nodes.remove(f);
      }
      for (const { options: f } of s) {
        const w = f.id, g = A.get(w);
        if (!g?.svgGroup) continue;
        const y = L.get(w) ?? {}, T = g.editor?.isInlineEditing?.();
        (f.fontSize !== y.fontSize || f.foregroundColor !== y.foregroundColor || f.fontWeight !== y.fontWeight) && (g.options.fontSize = f.fontSize, g.options.fontColor = f.foregroundColor, g.options.fontWeight = f.fontWeight, g.applyTextStyle?.()), (f.width !== y.width || f.height !== y.height) && (f.vectorPath ? (g.options.width = f.width, g.options.height = f.height, g.setShape?.(g.options.shape, f.vectorPath), Bo(w) && g.toBack?.(!1)) : g.setSize?.(f.width, f.height)), f.text !== y.text && !T && g.setText?.(f.text), f.backgroundColor !== y.backgroundColor && g.setColors?.(f.backgroundColor), (f.borderColor !== y.borderColor || f.borderWidth !== y.borderWidth || f.borderStyle !== y.borderStyle) && (g.options.borderColor = f.borderColor, g.options.borderWidth = f.borderWidth, g.options.borderStyle = f.borderStyle, g.applyBorder?.());
        const P = f.xPos !== y.xPos || f.yPos !== y.yPos || Math.abs((g.options.x ?? 0) - f.xPos) > 0.5 || Math.abs((g.options.y ?? 0) - f.yPos) > 0.5;
        if (w !== (a.skip && le(ee.card(a.skip))) && w !== (a.grip && le(a.grip)) && P) {
          const R = a.animate && !mt() ? 180 : 0, H = h.includes(g) ? () => {
            !S && A.get(w) === g && (e.getSelectedNodes?.() ?? []).includes(g) && e.updateSelectionResizeRotate?.();
          } : void 0;
          H && R && h.length === 1 && g.resizeRotate?.disable?.(), g.position(f.xPos, f.yPos, H, void 0, R);
        }
        const _ = ur(a.model, w);
        _ && g.svgGroup.node.getAttribute("aria-label") !== _ && g.svgGroup.node.setAttribute("aria-label", _), Wt.has(w) ? g.svgGroup.node.setAttribute("data-workshop-proposed", "") : g.svgGroup.node.removeAttribute("data-workshop-proposed"), g.svgGroup.node.toggleAttribute?.("data-workshop-focused", Se), g.svgGroup.node.toggleAttribute?.("data-workshop-draft", F);
        const U = we(w);
        if (U?.kind === "column") {
          const R = Le.get(U.key);
          R ? g.svgGroup.node.setAttribute("data-workshop-drop", R) : g.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        U?.kind === "handle" && g.svgGroup.front?.(), L.set(w, { ...f });
      }
      const m = /* @__PURE__ */ new Map();
      for (const f of s) for (const w of f.relationships.associations) m.set(w.id, w);
      for (const [f, w] of [...N])
        m.has(f) && A.get(w.parentId) === w.parent && A.get(w.childId) === w.child || (w.parent.relationships?.removeAssociation(f), N.delete(f));
      for (const [f, w] of m) {
        if (N.has(f)) continue;
        const g = A.get(w.parentId), y = A.get(w.childId);
        !g?.relationships || !y?.svgGroup || (g.relationships.addAssociation(y, Hn(w)), N.set(f, { parentId: w.parentId, childId: w.childId, parent: g, child: y }));
      }
      Ri(a.model);
    }), gn(a.model), Ut = a.model, Kt(), e.notifyNodeChanged?.();
  }
  let Ut = null;
  function lt() {
    return !!Ae.narrow || Ae.lanesPerRow === 1;
  }
  function ir() {
    let s;
    try {
      s = va(o, {}, i).width;
    } catch {
      s = void 0;
    }
    return { layout: Ae, focused: Se, draft: F, scale: C, tagScale: I, narrow: lt(), room: s };
  }
  function sr() {
    if (J) return [1, 1];
    const s = Zt(), a = Ur(s);
    return [a, Math.round(po(s, lt() && !F, a) * 20) / 20];
  }
  function Kt() {
    if (!p || S) return;
    [C, I] = sr();
    const s = Ut ?? o, a = i ? i.places(s, Ae) : Fe(s, { layout: Ae }), d = i || s.lanes[0]?.station ? void 0 : a.places;
    let h = null;
    for (const f of A.values()) {
      const w = f.svgGroup?.node;
      w?.parentNode && (!h || w.compareDocumentPosition(h) & 4) && (h = w);
    }
    p.draw({
      board: s,
      scope: r,
      origin: Y,
      size: { width: a.width, height: a.height },
      ...ir(),
      places: d,
      under: h,
      ...t.onFocusDone && { onDone: () => K(t.onFocusDone) }
    });
    const m = i ? a.parts.filter((f) => f.name.startsWith("column-")).map((f) => ({ laneId: f.name.slice(7), x: f.x, y: f.y, width: f.width, height: f.height, row: 0 })) : void 0;
    jt = { places: d ?? m, width: a.width, height: a.height }, wn();
  }
  function qi() {
    return (S ? [] : e.getSelectedNodes?.() ?? []).some((a) => A.get(a.id) === a);
  }
  function wn() {
    const s = ei, a = Ut ?? o;
    if (!!!(s && jt && !S && !x && !F && !J && !O && nt !== "off" && (nt === "always" || Se || qi()))) {
      Qe?.remove(), Qe = null;
      return;
    }
    let h;
    try {
      h = s.controls(a, jt, { scale: Math.min(2, C), finger: lt() });
    } catch {
      h = [];
    }
    Qe ? Qe.update(h, Y) : Qe = s.draw(e, r ?? "main", h, {
      origin: Y,
      announce: (m) => e.announce?.(m),
      onRuleEdit: (m, f) => {
        if (S || x || !t.onRuleEdit) return !1;
        const w = K(t.onRuleEdit, m, f);
        return w instanceof Promise ? w.then(Boolean, () => !1) : !!w;
      }
    });
  }
  function Ui() {
    const s = e.canvas?.node, a = sr;
    if ([C, I] = a(), J || !p || !s || typeof MutationObserver > "u") return;
    let d = null;
    const h = new MutationObserver(() => {
      d && clearTimeout(d), d = setTimeout(() => {
        d = null;
        const [m, f] = a();
        S || m === C && f === I || (C = m, I = f, Kt());
      }, 120);
    });
    h.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), v = () => {
      h.disconnect(), d && clearTimeout(d);
    };
  }
  let Ce = null;
  function ar(s) {
    const a = we(s);
    return a ? a.kind === "card" ? a.key : i?.cardOfPart?.(o, ve(s)) ?? null : null;
  }
  function lr() {
    if (b) return i?.cardOfPart?.(o, b.name) ?? null;
    if (M) return M.cardId;
    if (it) return it;
    const s = S ? [] : e.getSelectedNodes?.() ?? [];
    return s.length === 1 && A.get(s[0].id) === s[0] ? ar(s[0].id) : null;
  }
  let Jt = null;
  function dr() {
    S || !u || !Ce || lr() !== Jt && gn(Ce);
  }
  function gn(s) {
    if (u) {
      Ce = s, Jt = lr();
      const a = o.lanes.map((m) => A.get(le(ee.column(m.id)))?.svgGroup?.node).reduce((m, f) => f && (!m || m.compareDocumentPosition(f) & 4) ? f : m, null), d = e.canvas?.viewbox?.(), h = d && [d.x, d.y, d.width, d.height].every(Number.isFinite) ? { x: d.x - Y.x, y: d.y - Y.y, width: d.width, height: d.height } : null;
      u.draw(o, s === o ? null : s, {
        origin: Y,
        layout: Ae,
        above: a,
        view: h,
        announce: (m) => e.announce?.(m),
        focus: Jt,
        boardFocused: Se,
        picked: k,
        onPick: Zi,
        gripSize: Ln,
        clamp: b?.last?.clampedReason ? { name: b.name, text: b.last.clampedReason } : M?.outcome.kind === "candidate" && M.outcome.said ? { name: "card-" + M.cardId, text: M.outcome.said } : !b && pe ? { name: pe.name, text: pe.reason } : null,
        refused: !!b?.last?.refusal || !b && !!pe,
        onUnlink: (m, f) => {
          if (x || O || M || b || _e()) return;
          const w = o.lanes[0]?.station ? { kind: "disconnect_stations", from: { id: f }, to: { id: m } } : { kind: "unlink_tasks", card: { id: m }, waitsOn: { id: f } }, g = $e(o, [w]);
          "refused" in g ? e.announce?.(g.refused.reason) : ct(g.workshop, o.lanes[0]?.station ? { laneId: f } : { cardId: m });
        }
      });
    }
  }
  function nn(s) {
    return { x: s.x - Y.x, y: s.y - Y.y };
  }
  function Yt(s, a) {
    const d = i?.noteDay?.(o, nn(a), Ae);
    return typeof d == "number" && Number.isFinite(d) && (s.day = d), s;
  }
  function Ge(s) {
    return i ? i.places(s, Ae) : { ...Fe(s, { layout: ae }), parts: [] };
  }
  function Ki(s, a) {
    const d = i.places(s, Ae).parts.find((h) => h.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function Zt() {
    try {
      const s = e.getZoom?.();
      return typeof s == "number" && s > 0 ? s : 1;
    } catch {
      return 1;
    }
  }
  function Ji() {
    tt?.(), tt = null, Ln = to(Zt());
    const s = e.canvas?.node;
    if (!dt() || !s || typeof MutationObserver > "u") return;
    let a = null;
    const d = () => {
      if (a = null, S || !dt()) return;
      if (b || M) {
        a = setTimeout(d, 250);
        return;
      }
      const m = to(Zt());
      Math.abs(m - Ln) < 2 || (Ln = m, B(O ?? o));
    }, h = new MutationObserver(() => {
      a && clearTimeout(a), a = setTimeout(d, 200);
    });
    h.observe(s, { attributes: !0, attributeFilter: ["viewBox"] }), tt = () => {
      h.disconnect(), a && clearTimeout(a);
    };
  }
  function dt() {
    return !i && !!o.lanes[0]?.station && Se && !x && !O && !_e();
  }
  function Yi(s) {
    const a = Zr(s);
    if (!a || !dt()) return null;
    const d = o;
    return (h) => {
      const m = Ns(d, h), f = Rs(d, a, a.kind === "link" && m === a.from ? null : m);
      return f.next ? { next: f.next } : { next: d, clampedReason: f.refusal, refusal: f.refusal };
    };
  }
  function Zi(s) {
    if (S || Se) return;
    const a = e.getSelectedNodes?.() ?? [];
    $ = new Set(a.map((f) => f.id)), k = s, a.length && e.clearSelection?.(), Ce && gn(Ce), hn();
    const [d, h] = s.split(">"), m = (f) => o.lanes.find((w) => w.id === f)?.label ?? f;
    e.announce?.(`Path from ${m(d)} to ${m(h)}. A map's paths stay as they are; change this board to edit them.`);
  }
  function cr(s, a) {
    if (!i) {
      const d = ba(s, { native: !0, origin: Y, rows: a, layout: ae, style: Rt }).nodes;
      return dt() ? [...d, ...Xr(o, Y, Ln)] : d;
    }
    return i.notes(s, Ae, Y, Rt);
  }
  function ct(s, a, d) {
    const h = i ? i.editsBetween(o, s) : Ws(o, s);
    if (!h.length) return !1;
    const m = $e(o, h);
    return "refused" in m ? (e.announce?.(m.refused.reason), K(t.onRefuse, { ...a, laneId: m.refused.laneId, reason: m.refused.reason }), !1) : (o = m.workshop, B(o, { skip: d }), e.announce?.(m.report.edits.map((f) => f.said).join(" ")), K(t.onChange, o, { ...a, edits: h }), !0);
  }
  function ur(s, a) {
    const d = we(a);
    if (d?.kind === "lane" || d?.kind === "caption") {
      if (d.kind === "caption" && s.lanes.some((m) => m.station)) return null;
      const h = s.lanes.find((m) => m.id === d.key);
      return h ? `${h.label}, ${Ue(s, h.id)}` : null;
    }
    if (d?.kind === "card") {
      const h = s.cards.find((f) => f.id === d.key), m = h && s.lanes.find((f) => f.id === h.laneId);
      return h && m ? `${h.label || "Empty card"}, in ${m.label}${i?.cardKeys ? ". " + i.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? i ? i.label?.(s, ve(a)) ?? null : _s(s, ve(a)) : null;
  }
  function Vt(s, a) {
    const d = cr(s).find((h) => h.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function tn() {
    (M || b) && e.cancelGovernedDrag?.("host"), M = null, b = null, q && (q = null, K(t.onPreview, null)), ie(!1);
  }
  return {
    toCanvas(s) {
      if (S || x || _e()) return "This workshop is view-only here.";
      if (!o.cards.some((f) => f.id === s)) return "That card is no longer on the board.";
      const a = bt(o, s);
      if (a) return a;
      q && He(), O && (tn(), O = null, B(o), e.refreshGovernance?.());
      const { width: d } = Ge(o), h = A.get(le(ee.card(s)))?.options, m = o.cards.find((f) => f.id === s);
      return at(s, Pn({
        x: Y.x + d + 32,
        y: h?.y ?? Y.y,
        width: m?.asNote?.width ?? h?.width ?? 228,
        height: m?.asNote?.height ?? h?.height ?? 76
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
      const d = Jr(o, { width: s, height: a }, { ...ir(), scale: 1, tagScale: po(1, lt() && !F) });
      return { x: Y.x + d.x, y: Y.y + d.y, width: d.width, height: d.height };
    },
    get focused() {
      return Se;
    },
    setFocused(s) {
      if (S) return;
      const a = Se;
      Se = !!s;
      for (const d of A.values()) d.svgGroup?.node?.toggleAttribute?.("data-workshop-focused", Se);
      a !== Se && (k && (k = null, queueMicrotask(hn)), !i && o.lanes[0]?.station ? (tn(), Ji(), B(O ?? o)) : Ce && gn(Ce), Kt());
    },
    setControls(s) {
      S || (nt = s === "always" || s === "selected" ? s : "off", wn());
    },
    setLayout(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = Or(s);
      i ? i.places(o, a) : Fe(o, { layout: a }), JSON.stringify(a) !== JSON.stringify(ae) && (tn(), ae = a, B(O ?? o));
    },
    whenDrawn: () => Ie,
    update(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = Q(s);
      tn(), o = a;
      const d = x;
      x = l || c(o), B(O ?? o), x !== d && e.refreshGovernance?.();
    },
    preview(s) {
      if (S) throw new Error("This workshop has been detached.");
      const a = s ? Q(s) : null;
      tn(), O = a, wn(), B(O ?? o), e.refreshGovernance?.();
    },
    refuse(s, a) {
      const d = o.lanes.find((h) => h.id === s);
      S || !d || (ie(!1), re = { laneId: s, reason: a, timer: setTimeout(() => ie(), 1500) }, Re(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(s) {
      l = !!s;
      const a = l || c(o);
      S || x === a || (tn(), x = a, wn(), B(O ?? o), e.refreshGovernance?.());
    },
    destroy() {
      S || (tn(), S = !0, Gn.get(e)?.delete(Dt), tt?.(), v?.(), p?.destroy(), go.delete(Do), Qe?.remove(), Qe = null, pe && clearTimeout(pe.timer), e.element?.removeEventListener?.("pointerdown", Ho, !0), Xe && clearTimeout(Xe), e.element?.ownerDocument?.removeEventListener?.("pointerup", Go, !0), e.element?.ownerDocument?.removeEventListener?.("pointercancel", qo, !0), Li?.(), u && e.element?.removeEventListener?.("pointerover", zo), e.withPolicyAuthority(() => {
        for (const [s, a] of me) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(s);
        for (const [s, a] of N) a.parent.relationships?.removeAssociation(s);
        for (const [s, a] of A)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(s) === a && e.nodes.remove(s);
      }), N.clear(), me.clear(), A.clear(), L.clear(), j.clear(), D.clear(), Oi(), u?.destroy(), ot = !1, hn(), e.notifyNodeChanged?.());
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
function io(e, n, t) {
  !e || typeof e.then != "function" || e.then((r) => {
    r === !1 && n?.();
  }, () => {
  });
}
function $r(e) {
  const n = "card" in e ? e.card : null;
  return n && typeof n == "object" && typeof n.id == "string" ? n.id : null;
}
function Hs(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function Or(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function Gs(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let t = -1 / 0, r = 1 / 0;
  for (const o of n)
    t = Math.max(t, (o.options.x ?? 0) + (o.options.width ?? 0)), r = Math.min(r, o.options.y ?? 0);
  return { x: Math.round(t + 80), y: Math.round(r) };
}
const qs = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function oe(e) {
  return qs.includes(e.kind) ? e.kind : void 0;
}
function ge(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Oe(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Us(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Pt(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Pt(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const Et = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function yo(e) {
  if (typeof e != "string" || !Et.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function ni(e) {
  return e.noteId ?? e.id;
}
function Mt(e) {
  const n = Pt(String(e ?? ""));
  if (n.length <= 80) return n;
  const t = n.slice(0, 79), r = t.lastIndexOf(" ");
  return (r > 40 ? t.slice(0, r) : t).trimEnd() + "…";
}
function ti(e) {
  const n = ge(e);
  let t;
  try {
    t = new URL(Oe(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (t.protocol !== "https:" || t.username || t.password || t.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: t.href, alt: Oe(n.alt, 240) };
}
function Ee(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const oi = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Ks = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function ko(e) {
  const n = ge(e), t = {}, r = (i) => {
    if (typeof i != "string" || !oi.test(i)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return i;
  }, o = (i, c, u) => {
    if (typeof i != "number" || !Number.isFinite(i) || i < c || i > u) throw new Error("A card size is out of range.");
    return i;
  };
  if (n.backgroundColor !== void 0 && (t.backgroundColor = r(n.backgroundColor)), n.textColor !== void 0 && (t.textColor = r(n.textColor)), n.borderColor !== void 0 && (t.borderColor = r(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !Ks.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    t.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (t.fontSize = o(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (t.borderWidth = o(n.borderWidth, 0, 20)), Object.keys(t).length ? t : void 0;
}
function ri(e) {
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
function Lr(e) {
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
const Cn = 96, Js = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, Ys = ["solid", "dashed", "dotted"], Zs = 1e7;
function $n(e) {
  const n = ge(e);
  if (typeof n.id != "string" || !Js.test(n.id)) throw new Error("A line needs a short id.");
  const t = { id: n.id, parentId: yo(n.parentId), childId: yo(n.childId) };
  if (t.parentId === t.childId) throw new Error("A line joins two different notes.");
  const r = (o, i, c) => {
    const u = n[o];
    if (u != null) {
      if (typeof u != "number" || !Number.isFinite(u) || u < i || u > c) throw new Error("A line's look is out of range.");
      t[o] = u;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !oi.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    t.lineColor = n.lineColor;
  }
  if (r("lineOpacity", 0, 1), r("lineWidth", 0, 40), r("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!Ys.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
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
    const o = ge(n.targetPoint), i = (c) => typeof c == "number" && Number.isFinite(c) && Math.abs(c) <= Zs;
    if (!i(o.x) || !i(o.y) || Object.keys(o).some((c) => c !== "x" && c !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    t.targetPoint = { x: Math.round(o.x * 100) / 100, y: Math.round(o.y * 100) / 100 };
  }
  for (const o of ["sourceAnchor", "targetAnchor"]) {
    if (o === "targetAnchor" && t.targetPoint) continue;
    const i = n[o];
    if (i == null) continue;
    const c = ge(i), u = (p) => typeof p == "number" && Number.isFinite(p) && p >= 0 && p <= 1;
    if (!u(c.x) || !u(c.y) || Object.keys(c).some((p) => p !== "x" && p !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    t[o] = { x: c.x, y: c.y };
  }
  return t;
}
function Vs(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const t = e.map($n).map((r) => ii(r, n)).filter((r) => r.targetPoint ? n.has(r.parentId) : n.has(r.parentId) || n.has(r.childId));
  if (Ke(t.map((r) => r.id), "line ID"), t.length > Cn) throw new Error(`A workshop holds up to ${Cn} lines.`);
  return t;
}
function ii(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: t, ...r } = e;
  return r;
}
function Ke(e, n) {
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
function Qs(e) {
  return (e.signals ?? []).map((n) => {
    const t = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: t, text: t ? n.whenPresent : n.whenAbsent };
  });
}
const An = (e) => "lane-" + e, Ye = (e) => "card-" + e, Ot = (e) => "image-" + e;
function Za(e, n = {}) {
  const t = Qs(e), r = ee.of(n.scope);
  return Mo(e).map((o) => {
    const i = e.cards.filter((p) => p.laneId === o.id), c = t.filter((p) => p.laneId === o.id), u = [r.lane(o.id)];
    return o.station?.image && u.push(r.image(o.id)), { lane: o, cards: i, signals: c, nodeIds: [...u, ...i.map((p) => r.card(p.id))] };
  });
}
const No = 5, Un = 24, vo = 3;
function Xs(e, n, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A move made anyway says who made it, when, and past which rule.");
  const r = e, o = (c, u) => typeof c == "string" && c.trim().length > 0 && c.length <= u && !/[\u0000-\u001f\u007f<>]/.test(c), i = r.was === void 0 ? void 0 : ea(r.was);
  if (!o(r.by, 80) || !o(r.at, 40) || Number.isNaN(Date.parse(r.at)) || !o(r.sentence, 300) || typeof r.from != "string" || !n.includes(r.from) || r.from === t && !i || Object.keys(r).some((c) => !["by", "at", "sentence", "from", "was"].includes(c)))
    throw new Error("A move made anyway says who made it, when, past which rule, and the lane it came from.");
  return { by: r.by, at: r.at, sentence: r.sentence, from: r.from, ...i && { was: i } };
}
function ea(e) {
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
function Q(e) {
  const n = ge(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !oe(n)) throw new Error("Unsupported workshop kind.");
  const t = n.kind === "release-plan", r = oe(n), o = r ? xe(r) : void 0, i = { id: Ee }, c = Oe(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > No)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const u = o?.cards ?? [Un, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > u[0]) throw new Error(u[1]);
  const p = n.lanes.map((k) => {
    const $ = ge(k), b = { id: Ee($.id), label: Oe($.label) };
    if ($.capacity !== void 0 && r && r !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if ($.capacity !== void 0) {
      const O = t ? 576 : 24;
      if (typeof $.capacity != "number" || !Number.isInteger($.capacity) || $.capacity < 1 || $.capacity > O)
        throw new Error(`Lane capacity must be a whole number from 1 to ${O}.`);
      b.capacity = $.capacity;
    }
    if (o?.readLane?.($, b, i), $.station !== void 0) {
      const O = ge($.station), F = (l) => {
        if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l >= vo)
          throw new Error("Use map coordinates from 0 to 2.");
        return l;
      };
      if (!Array.isArray(O.next) || O.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const J = O.next.map(Ee);
      Ke(J, "onward stop"), b.station = { column: F(O.column), row: F(O.row), next: J, outcome: Oe(O.outcome, 160) }, O.image !== void 0 && (b.station.image = ti(O.image));
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
    const $ = ge(k), b = { id: Ee($.id), label: r ? Oe($.label) : Us($.label), laneId: Ee($.laneId) };
    if (!C.includes(b.laneId)) throw new Error("Card refers to an unknown lane.");
    if ($.override !== void 0) {
      if (t || n.experience !== void 0) throw new Error("A release plan’s and a startup experience’s cards are never moved past a rule.");
      b.override = Xs($.override, C, b.laneId);
    }
    if ($.allowedLaneIds !== void 0) {
      if (!Array.isArray($.allowedLaneIds) || $.allowedLaneIds.length > p.length) throw new Error("Invalid allowed lanes.");
      if (b.allowedLaneIds = $.allowedLaneIds.map(Ee), Ke(b.allowedLaneIds, "allowed lane"), !b.allowedLaneIds.includes(b.laneId) && !b.override || !b.allowedLaneIds.every((O) => C.includes(O)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if ($.look !== void 0) {
      const O = ko($.look);
      O && (b.look = O);
    }
    if ($.asNote !== void 0) {
      const O = $t($.asNote);
      O && (b.asNote = O);
    }
    if ($.noteId !== void 0 && $.noteId !== b.id && (b.noteId = yo($.noteId)), $.free !== void 0) {
      if ($.free !== !0 || !p.some((O) => O.station)) throw new Error("Only a map’s cards can be free of its paths.");
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
      const $ = ge(k), b = Ee($.cardId), O = Ee($.laneId);
      if (!I.some((F) => F.id === b) || !C.includes(O))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: Ee($.id),
        label: Oe($.label),
        cardId: b,
        laneId: O,
        whenPresent: Oe($.whenPresent, 160),
        whenAbsent: Oe($.whenAbsent, 160)
      };
    }), Ke(v.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !r) {
    const k = Vs(n.lines, new Set(I.map(($) => $.id)));
    k.length && (v.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    v.presentationOrder = Mo({ lanes: p, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (v.behaviour = be().validate(n.behaviour, { ...v, kind: n.kind })), n.appearance !== void 0) {
    const k = Qi(n.appearance, Xi({ lanes: p, kind: n.kind, nest: n.nest }));
    k && (v.appearance = k);
  }
  if (t)
    return v.kind = "release-plan", os(v), v;
  if (r && o) {
    v.kind = r, o.readBoard(n, v, i);
    const k = o.validate(v);
    if (k) throw new Error(k);
    return v;
  }
  for (const k of p)
    if (Ze({ cards: I.filter(($) => !$.override) }, k.id) > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return v;
}
function Ze(e, n) {
  return e.cards.filter((t) => t.laneId === n && !t.free).length;
}
const si = 65536;
function Va(e) {
  const n = JSON.stringify(Q(e)), t = "#" + new URLSearchParams({ model: n }).toString();
  if (t.length > si) throw new Error("This workshop is too large to open from a link.");
  return t;
}
function Qa(e) {
  if (e.length > si) throw new Error("This workshop is too large to open from a link.");
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
  return r ? xe(r).planMove(e, n, t) : void 0;
}
function Lt(e, n) {
  if (oe(e)) return e.lanes.filter((r) => _o(e, n.id, r.id));
  if (e.kind === "release-plan") return e.lanes.filter((r) => Zn(e, n, r.id) !== null);
  const t = e.lanes.find((r) => r.id === n.laneId)?.station;
  return t && n.free ? e.lanes : e.lanes.filter((r) => r.id === n.laneId || (!t || t.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && Ze(e, r.id) < (r.capacity ?? 1 / 0));
}
function xo(e, n, t) {
  const r = e.cards.find((i) => i.id === n), o = _o(e, n, t);
  if (o !== void 0) {
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (r && e.kind === "release-plan") {
    const i = Zn(e, r, t);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !Lt(e, r).some((i) => i.id === t)) throw new Error("Move is unavailable.");
  return r.laneId === t ? e : { ...e, cards: e.cards.map((i) => i === r ? Nt({ ...r, laneId: t }) : i) };
}
function na(e, n, t) {
  if (!n.cards.find((u) => u.id === t)?.override) return n;
  const o = { ...n, cards: n.cards.map((u) => u.id === t ? Nt(u) : u) };
  let i = !1;
  try {
    Q(o);
  } catch {
    i = !0;
  }
  const c = oe(e);
  return !i && c && (i = xe(c).pastRule?.(o, t) ?? !1), !i && e.behaviour && (i = "refused" in be().check(e, o)), i ? n : o;
}
function Nt(e) {
  if (!e.override) return e;
  const { override: n, ...t } = e;
  return t;
}
function ln(e, n, t) {
  const r = Ro(e, n, t);
  if (!r || r === e) return r;
  const o = na(e, r, n);
  return e.behaviour && "refused" in be().check(e, o) ? null : o;
}
function ta(e) {
  return e.kind !== "release-plan" && !e.experience;
}
function Xa(e, n) {
  return e.cards.some((t) => t.override) || n.cards.some((t) => t.override);
}
function oa(e, n) {
  if (!n.override) return !1;
  const t = e.cards.find((r) => r.id === n.id)?.override;
  return !t || JSON.stringify(t) !== JSON.stringify(n.override);
}
function el(e, n) {
  const t = e.cards.find((o) => o.id === n.id)?.override;
  if (!t || n.override) return !1;
  const r = t.was ?? {};
  return n.laneId === t.from && (r.lag === void 0 || (n.lag ?? 0) === r.lag) && (r.duration === void 0 || n.duration === r.duration) && (r.parentId === void 0 || (n.parentId ?? null) === r.parentId);
}
function nl(e, n) {
  return e.cards.some((t) => t.laneId === n && t.override !== void 0);
}
function tl(e, n, t) {
  const r = e.cards.find((o) => o.id === n);
  return !r || !e.lanes.some((o) => o.id === t) ? "That card or lane is no longer on the board." : r.laneId === t || ln(e, n, t) || Yn(e, n, t, { by: "check", at: (/* @__PURE__ */ new Date(0)).toISOString() }) ? null : De(e, n, t) ?? "That move is not available.";
}
function ai(e) {
  return { by: String(e.by || "Someone").replace(/[\u0000-\u001f\u007f<>]/g, "").slice(0, 80) || "Someone", at: e.at };
}
function ra(e, n, t, r) {
  return { ...ai(t), sentence: (n || "That move is not available.").slice(0, 300), from: e.laneId, ...r && { was: r } };
}
function Yn(e, n, t, r) {
  const o = e.cards.find((C) => C.id === n);
  if (!o || o.laneId === t || !e.lanes.some((C) => C.id === t) || !ta(e) || ln(e, n, t)) return null;
  const i = De(e, n, t) ?? "That move is not available.", c = Ro(e, n, t), u = c && c !== e ? c : oe(e) ? { ...e, cards: [...e.cards.filter((C) => C.id !== n), o] } : e, p = ra(o, i, r);
  try {
    return Q({ ...u, cards: u.cards.map((C) => C.id === n ? { ...Nt(C), laneId: t, override: p } : C) });
  } catch {
    return null;
  }
}
function ol(e, n, t) {
  const r = new Map(e.cards.map((i) => [i.id, i]));
  if (!n.cards.some((i) => i.override || r.get(i.id)?.override)) return n;
  const o = n.cards.map((i) => {
    const c = r.get(i.id), u = Nt(i);
    if (!c) return u;
    const p = c.laneId !== i.laneId, C = (c.lag ?? 0) !== (i.lag ?? 0) || c.duration !== i.duration || (c.parentId ?? null) !== (i.parentId ?? null);
    if (!p && !C) return c.override ? { ...u, override: c.override } : u;
    if (!i.override) return u;
    if (p && !C) {
      const b = Yn(e, i.id, i.laneId, t)?.cards.find((O) => O.id === i.id)?.override;
      return b ? { ...u, override: b } : u;
    }
    const I = e.kind === "launch-plan" || e.kind === "hiring-plan", v = oe(e) === "nest" ? [{ kind: "nest_card", card: { id: i.id }, ...i.parentId ? { under: { id: i.parentId } } : { lane: { id: i.laneId } }, override: !0 }] : I ? [
      { kind: "set_task", card: { id: i.id }, lag: i.lag ?? 0, duration: i.duration ?? 1, override: !0 },
      ...p ? [{ kind: "move_card", card: { id: i.id }, lane: { id: i.laneId }, override: !0 }] : []
    ] : [];
    if (!v.length) return u;
    const k = $e(e, v, { actor: { by: ai(t).by, via: "chat" }, now: t.at }), $ = "refused" in k ? void 0 : k.workshop.cards.find((b) => b.id === i.id);
    return $?.override && $.laneId === i.laneId && ($.lag ?? 0) === (i.lag ?? 0) && $.duration === i.duration && ($.parentId ?? null) === (i.parentId ?? null) ? { ...u, override: $.override } : u;
  });
  return { ...n, cards: o };
}
const ia = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function li(e) {
  if (!e.override) return null;
  const n = new Date(e.override.at), t = Number.isNaN(n.getTime()) ? "" : " · " + ia[n.getMonth()] + " " + n.getDate();
  return "Moved anyway by " + e.override.by + t;
}
function Ro(e, n, t) {
  const r = e.cards.find((c) => c.id === n);
  if (!r || !e.lanes.some((c) => c.id === t)) return null;
  if (r.laneId === t) return e;
  if (e.kind === "release-plan") return Zn(e, r, t);
  const o = _o(e, n, t);
  if (o !== void 0) return o;
  const i = Ia(e, n, t);
  return i || (t === "prototype" && un(e) === "customer-interviews" ? null : Lt(e, r).some((c) => c.id === t) ? xo(e, n, t) : null);
}
function Tr(e, n) {
  return e.lanes.filter((t) => ln(e, n, t.id) !== null);
}
function De(e, n, t) {
  const r = Ro(e, n, t);
  if (r !== null) {
    const v = r === e || !e.behaviour ? null : be().check(e, r);
    return v && "refused" in v ? v.refused.sentence : null;
  }
  const o = e.cards.find((v) => v.id === n), i = e.lanes.find((v) => v.id === t);
  if (!o || !i) return "That move is not available.";
  const c = oe(e), u = c && xe(c).refusal;
  if (u) return u(e, n, t);
  const p = `This card can't go in ${i.label}.`;
  if (o.allowedLaneIds && !o.allowedLaneIds.includes(t)) return p;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return p;
    const v = dn(e, t), k = { ...e, lanes: e.lanes.map((b) => b === i ? { id: i.id, label: i.label } : b) }, $ = Zn(k, o, t);
    return $ ? `Needs ${dn($, t) - v} points. It already holds ${v} of ${i.capacity} points.` : p;
  }
  const C = e.lanes.find((v) => v.id === o.laneId);
  if (C?.station && !o.free && !C.station.next.includes(t)) return `${i.label} can't be reached from ${C.label}.`;
  const I = Ze(e, t);
  if (i.capacity !== void 0 && I >= i.capacity && !(C?.station && o.free)) {
    const v = C?.station ? i.capacity === 1 ? "token" : "tokens" : i.capacity === 1 ? "card" : "cards";
    return `It already holds ${I} of ${i.capacity} ${v}.`;
  }
  return p;
}
function so(e) {
  return !0;
}
function sa(e) {
  return !e.kind && !e.lanes.some((n) => n.station) && !un(e);
}
function aa(e) {
  const n = un(e);
  return n ? "This workshop keeps the cards it came with: " + (n === "customer-interviews" ? "its cards are its interviews." : "each card is $200 of its budget.") + " Keep the note beside it." : null;
}
function la(e) {
  const n = Pt(e), t = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(n), r = t ? Number(t[2]) : 1;
  return { label: (t ? t[1] : n).trim().slice(0, 80) || "Feature", points: Math.min(24, Math.max(1, r)) };
}
const da = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function On(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  return typeof n == "string" && da.test(n) && !t.has(n) ? n : Qn(e, "card");
}
function rn(e, n, t) {
  const r = e.lanes.find((u) => u.id === n);
  if (!r) return "That lane is no longer on the board.";
  const o = aa(e);
  if (o) return o;
  if (e.kind === "release-plan")
    return e.cards.length >= Un ? `This board is at its size limit of ${Un} cards. Remove a card to make room.` : (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0) ? "A note joined to other notes by lines stays a note on this board." : hi(e, n, t) ? null : De(fi(e, n, t), On(e, t.id), n);
  if (oe(e)) {
    if (Array.isArray(t.lines) ? t.lines.length : t.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const u = pi(e, n, t);
    return typeof u == "string" ? u : Pr(e, u);
  }
  if (e.cards.length >= Un) return `This board is at its size limit of ${Un} cards. Remove a card to make room.`;
  const i = e.lanes.some((u) => u.station);
  if (i && (Array.isArray(t?.lines) ? t.lines.length : t?.lines !== void 0)) return "A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.";
  const c = Ze(e, n);
  if (r.capacity !== void 0 && !i && c >= r.capacity) return `It already holds ${c} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.`;
  if (t.lines !== void 0) {
    const u = ci(t.lines);
    if (!u) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((C) => C.id));
    if ((e.lines?.length ?? 0) + u.filter((C) => !p.has(C.id)).length > Cn)
      return `A workshop holds up to ${Cn} lines.`;
  }
  return Pr(e, { ...e, cards: [...e.cards, { id: On(e, t.id), label: Mt(Wo(t) || cn(e)), laneId: n }] });
}
function Pr(e, n) {
  if (!e.behaviour) return null;
  const t = be().check(e, n);
  return "refused" in t ? t.refused.sentence : null;
}
function di(e) {
  try {
    return e && typeof e == "object" ? ri(e) : void 0;
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
function ci(e) {
  const n = Array.isArray(e) ? e : [e], t = [];
  for (const r of n) {
    let o = null;
    try {
      o = $n(r);
    } catch {
      const i = (u) => {
        const { id: p, parentId: C, childId: I, targetPoint: v } = ge(r);
        return $n({ id: p, parentId: C, childId: I, ...u ? { targetPoint: v } : {} });
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
function _t(e, n, t) {
  return n === t || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? t : e.parentId, childId: e.childId === n ? t : e.childId };
}
function kn(e, n, t) {
  return e && e.map((r) => _t(r, n, t));
}
function ui(e, n) {
  const t = new Map(n.map((r) => [r.id, r]));
  return [...(e.lines ?? []).filter((r) => !t.has(r.id)), ...t.values()];
}
function qn(e, n, t, r) {
  if (rn(e, n, t) !== null) return null;
  if (e.kind === "release-plan") return hi(e, n, t, r);
  if (oe(e)) {
    const O = pi(e, n, t), F = O.cards[O.cards.length - 1], J = r === void 0 ? -1 : e.cards.findIndex((l) => l.id === r && l.laneId === n);
    return J < 0 ? O : { ...O, cards: [...e.cards.slice(0, J), F, ...e.cards.slice(J)] };
  }
  const o = di(t.look), i = Wo(t), c = i || cn(e);
  let u = Io(t.asNote);
  i || (u = { ...u, text: "" }), c.length > 80 && u?.text === void 0 && c.length <= 4e3 && (u = { ...u, text: c });
  const p = On(e, t.id), C = p !== t.id && typeof t.id == "string" && Et.test(t.id) ? t.id : void 0, I = e.lanes.some((O) => O.station), v = {
    id: p,
    label: Mt(c),
    laneId: n,
    ...o ? { look: o } : {},
    ...u ? { asNote: u } : {},
    ...C ? { noteId: C } : {},
    ...I ? { free: !0 } : {}
  }, k = r === void 0 ? -1 : e.cards.findIndex((O) => O.id === r && O.laneId === n), $ = k < 0 ? [...e.cards, v] : [...e.cards.slice(0, k), v, ...e.cards.slice(k)], b = t.lines === void 0 ? void 0 : ui(e, ci(t.lines).map((O) => _t(O, t.id, v.id)));
  return Q({ ...e, cards: $, ...b ? { lines: b } : {} });
}
function fi(e, n, t, r) {
  const { label: o, points: i } = la(typeof t.label == "string" ? t.label : ""), c = On(e, t.id), u = c !== t.id && typeof t.id == "string" && Et.test(t.id) ? t.id : void 0, p = { id: c, label: o, laneId: e.lanes[e.lanes.length - 1].id, points: i, ...u ? { noteId: u } : {} }, C = r === void 0 ? -1 : e.cards.findIndex((I) => I.id === r && I.laneId === n);
  return { ...e, cards: C < 0 ? [...e.cards, p] : [...e.cards.slice(0, C), p, ...e.cards.slice(C)] };
}
function hi(e, n, t, r) {
  const o = fi(e, n, t, r), i = On(e, t.id), c = o.cards.find((p) => p.id === i);
  if (c.laneId === n) return Q(o);
  const u = Zn(o, c, n);
  return u ? Q(u) : null;
}
function pi(e, n, t) {
  const r = Wo(t), o = xe(oe(e)).fromNote(e, r, cn(e, t.under));
  if (typeof o == "string") return o;
  const i = $e(e, [{ kind: "add_card", lane: { id: n }, ...o, ...t.under && { under: { id: t.under } } }]);
  if ("refused" in i) return i.refused.reason;
  const c = i.workshop.cards, u = On(e, t.id), p = u !== t.id && typeof t.id == "string" && Et.test(t.id) ? t.id : void 0, C = di(t.look), I = r ? Io(t.asNote) : { ...Io(t.asNote), text: "" };
  c[c.length - 1] = {
    ...c[c.length - 1],
    id: u,
    ...p ? { noteId: p } : {},
    ...C ? { look: C } : {},
    ...I ? { asNote: I } : {}
  };
  const v = xe(oe(e));
  return typeof t.day == "number" && Number.isFinite(t.day) && v.landNote ? v.landNote(i.workshop, u, t.day) : i.workshop;
}
function Wo(e) {
  return typeof e?.label == "string" ? Pt(e.label) : "";
}
function Er(e, n) {
  const t = n.asNote?.text;
  return t === "" && (n.label === cn(e, n.parentId) || n.label === cn(e)) ? "" : t !== void 0 && t !== "" && Mt(t) === n.label ? t : Ao(e, n);
}
function mi(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const t = oe(e), r = li(n), o = t ? xe(t).cardText(e, n) : n.label;
  return r ? o + `
` + r : o;
}
function Ao(e, n) {
  if (e.kind === "release-plan") return n.label + " · " + n.points + (n.points === 1 ? " point" : " points");
  const t = oe(e);
  return t ? xe(t).noteText(e, n) : n.label;
}
function bt(e, n) {
  const t = e.cards.find((r) => r.id === n);
  if (!t) return "That card is no longer on the board.";
  if (un(e)) return "This card stays on the board.";
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
function Mr(e, n, t = wi(e, n)) {
  if (bt(e, n) !== null) return null;
  const r = e.cards.filter((i) => i.id !== n).map((i) => {
    if (!i.dependsOn?.includes(n)) return i;
    const c = { ...i, dependsOn: i.dependsOn.filter((u) => u !== n) };
    return c.dependsOn.length || delete c.dependsOn, c;
  }), o = e.lines?.map((i) => _t(i, n, t));
  return Q({ ...e, cards: r, ...o ? { lines: o } : {} });
}
function ca(e, n, t = wi(e, n)) {
  const r = new Set(e.cards.filter((c) => c.id !== n).map((c) => c.id)), o = (e.lines ?? []).filter((c) => c.parentId === n || c.childId === n).map((c) => _t(c, n, t)), i = (c) => r.has(c.parentId) || r.has(c.childId);
  return { stay: o.filter(i), leave: o.filter((c) => !i(c)) };
}
function wi(e, n) {
  const t = e.cards.find((r) => r.id === n);
  return t ? ni(t) : n;
}
function ao(e, n) {
  return (e.lines ?? []).filter((t) => t.parentId === n || t.childId === n);
}
function Kn(e, n) {
  if (e.kind) return ua;
  let t;
  try {
    t = $n(n);
  } catch (i) {
    return i instanceof Error ? i.message : "That line can't be drawn.";
  }
  const r = new Set(e.cards.map((i) => i.id));
  return t = ii(t, r), (t.targetPoint ? !r.has(t.parentId) : !r.has(t.parentId) && !r.has(t.childId)) ? "That card is no longer on the board." : e.lanes.some((i) => i.id === t.parentId || i.id === t.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((i) => i.id === t.id) && (e.lines?.length ?? 0) >= Cn ? `A workshop holds up to ${Cn} lines.` : null;
}
const ua = "Lines join the cards of a lane workshop to notes and to each other.";
function vt(e, n) {
  return Kn(e, n) !== null ? null : Q({ ...e, lines: ui(e, [$n(n)]) });
}
function Nr(e, n) {
  return (e.lines ?? []).some((t) => t.id === n) ? Q({ ...e, lines: e.lines.filter((t) => t.id !== n) }) : e;
}
function gi(e, n, t, r = {}) {
  const o = new Set((e.lines ?? []).map((c) => c.id));
  let i = `${n}->${t}`;
  for (let c = 2; o.has(i); c++) i = `${n}->${t}~${c}`;
  return $n({ showChildArrow: !0, ...r, id: i, parentId: n, childId: t });
}
function fa(e, n) {
  const t = (e.lines ?? []).filter((r) => r.parentId !== n && r.childId !== n);
  return t.length === (e.lines?.length ?? 0) ? e : { ...e, lines: t };
}
function ha(e, n) {
  return yi(e, n, !1);
}
function Ue(e, n) {
  return yi(e, n, !0);
}
function yi(e, n, t) {
  const r = e.lanes.find((I) => I.id === n);
  if (!r) return "";
  if (e.kind === "release-plan") {
    const I = dn(e, n);
    return r.capacity ? I + (t ? " of " : " / ") + r.capacity + " points" : I + " points";
  }
  const o = oe(e);
  if (o) return xe(o).caption(e, n);
  const i = Aa(e, n);
  if (i) return "$" + i.amount + " · " + i.description;
  const c = e.cards.filter((I) => I.laneId === n).length, u = e.behaviour ? be().laneLimit(e, n) : r.capacity, p = Ze(e, n), C = (I) => I + (I === 1 ? " card" : " cards");
  return t ? u !== void 0 && p !== c ? p + " of " + u + " · " + C(c - p) : u !== void 0 ? c + " of " + u : C(c) : u !== void 0 && p !== c ? p + " / " + u + " · +" + (c - p) : u !== void 0 ? c + " / " + u : String(c);
}
function pa(e, n) {
  const t = e.lanes.find((o) => o.id === n);
  if (!t || t.station || oe(e) || e.kind === "release-plan") return !1;
  const r = e.behaviour ? be().laneLimit(e, n) : t.capacity;
  return r !== void 0 && Ze(e, n) >= r;
}
const Vn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, bn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function ki(e, n = Vn, t = 28, r) {
  const { pitch: o, row: i, top: c } = n, u = !!e.lanes[0].station, p = e.lanes.map((v) => e.cards.filter((k) => k.laneId === v.id).length), C = c + Math.max(1, ...r ?? p) * i + 36, I = e.lanes.map((v, k) => ({
    x: u ? v.station.column * (o + t) : k * o,
    y: u ? v.station.row * C : 0
  }));
  return {
    points: I,
    width: Math.max(...I.map((v) => v.x)) + o,
    height: Math.max(...I.map((v, k) => v.y + c + (u ? Math.max(1, p[k]) : p[k] + 1) * i))
  };
}
function rl() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Qn(e, n) {
  const t = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; t.has(n + "-" + r); ) r++;
  return n + "-" + r;
}
function bi(e) {
  const n = Q(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function ma(e, n) {
  const t = bi(e), r = Qn(t, "lane");
  return t.lanes.push({ id: r, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), t.presentationOrder?.push(r), Q(t);
}
function wa(e, n, t) {
  const r = bi(e);
  return r.cards.push({
    id: Qn(r, "card"),
    label: t.label,
    laneId: n,
    ...t.allowedLaneIds === void 0 ? {} : { allowedLaneIds: t.allowedLaneIds }
  }), Q(r);
}
function il() {
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
function _r(e, n, t) {
  const r = Q(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((I) => I.id === n);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= No) throw new Error("A map can have up to five stations.");
  const i = Oe(t?.label), c = Oe(t?.outcome, 160), u = Qn(r, "station");
  let p, C = 1 / 0;
  for (let I = 0; I < vo; I++)
    for (let v = 0; v < vo; v++) {
      if (r.lanes.some(($) => $.station.column === v && $.station.row === I)) continue;
      const k = Math.abs(o.station.column - v) + Math.abs(o.station.row - I);
      k < C && (C = k, p = { column: v, row: I });
    }
  if (!p) throw new Error("There is no free station position.");
  return o.station.next.push(u), r.lanes.push({ id: u, label: i, station: { ...p, next: [], outcome: c, ...t.image === void 0 ? {} : { image: ti(t.image) } } }), r.presentationOrder?.push(u), r;
}
const sl = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, So = (e) => "caption-" + e, In = (e) => "column-" + e, Rr = "rules-board";
function Xn(e) {
  if (!(e == null || e === "main")) {
    if (typeof e != "string" || !/^[a-z0-9]{1,12}$/.test(e)) throw new Error("A board scope is 1 to 12 lowercase letters and digits.");
    return e;
  }
}
function al(e, n) {
  const t = Xn(n);
  return t ? t + ":" + e : e;
}
const ee = {
  lane: An,
  card: Ye,
  image: Ot,
  caption: So,
  column: In,
  rules: Rr,
  of(e) {
    const n = Xn(e), t = (r) => n ? n + ":" + r : r;
    return {
      lane: (r) => t(An(r)),
      card: (r) => t(Ye(r)),
      image: (r) => t(Ot(r)),
      caption: (r) => t(So(r)),
      column: (r) => t(In(r)),
      rules: t(Rr)
    };
  }
};
function vi(e, n) {
  if (!n) return;
  const t = (r) => n + ":" + r;
  for (const r of e) {
    r.options.id = t(r.options.id);
    for (const o of r.relationships.associations)
      o.id !== void 0 && (o.id = t(o.id)), o.parentId = t(o.parentId), o.childId = t(o.childId);
  }
}
function xi(e, n) {
  let t = 2;
  for (; n(`${e}--${t}`); ) t++;
  return `${e}--${t}`;
}
function sn(e, n, t) {
  const r = Math.max(0, Math.min(t, e / 2, n / 2)), o = e, i = n;
  return r ? `M ${r} 0 H ${o - r} Q ${o} 0 ${o} ${r} V ${i - r} Q ${o} ${i} ${o - r} ${i} H ${r} Q 0 ${i} 0 ${i - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${o} V ${i} H 0 Z`;
}
function Wr(e, n) {
  const t = (r) => Math.round(parseInt(e.slice(r, r + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function lo(e, n, t, r) {
  for (let o = n; o > 11; o--) {
    const i = Math.max(1, Math.floor(t / (o * 0.55)));
    if (e.split(`
`).reduce((u, p) => u + Math.max(1, Math.ceil(p.length / i)), 0) * o * 1.3 <= r) return o;
  }
  return Math.min(n, 11);
}
const Ii = 152, Co = Ii + 12, ga = 12;
function ya(e, n) {
  const t = e?.lanesPerRow;
  if (t === void 0) return n;
  if (typeof t != "number" || !Number.isInteger(t) || t < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(t, n);
}
function Fe(e, n = {}) {
  const t = Q(e), { pitch: r, row: o, top: i } = Vn, c = t.lanes.map((k) => t.cards.filter(($) => $.laneId === k.id).length), u = (k) => Math.max(c[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), p = !!t.lanes[0].station, C = t.lanes.some((k) => k.station?.image), I = ya(n.layout, t.lanes.length), v = [];
  if (p) {
    const { points: k } = ki(t, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    t.lanes.forEach(($, b) => v.push({
      laneId: $.id,
      x: k[b].x,
      y: k[b].y + (C ? $.station.row * Co : 0),
      width: r,
      height: i + ($.station.image ? Co : 0) + Math.max(1, u(b)) * o,
      column: $.station.column,
      row: $.station.row
    }));
  } else {
    let k = 0;
    for (let $ = 0; $ < t.lanes.length; $ += I) {
      const b = t.lanes.slice($, $ + I), O = i + (Math.max(...b.map((F, J) => u($ + J))) + 1) * o;
      b.forEach((F, J) => v.push({ laneId: F.id, x: J * r, y: k, width: r, height: O, column: J, row: $ / I })), k += O + ga;
    }
  }
  return { places: v, width: Math.max(...v.map((k) => k.x + k.width)), height: Math.max(...v.map((k) => k.y + k.height)) };
}
function ka(e, n) {
  const { pitch: t, width: r, row: o, height: i, top: c } = Vn, u = n.origin ?? { x: 0, y: 0 }, p = !!e.lanes[0].station, { places: C } = Fe(e, n), I = n.style ?? {}, v = I.textColor ?? zn.fontColor, k = I.borderColor ?? zn.borderColor, $ = I.borderWidth ?? zn.borderWidth, b = I.cornerRadius ?? 0, O = I.fontSize ?? zn.fontSize, F = I.laneFontSize ?? O + 2, J = I.captionFontSize ?? Math.max(11, O - 1), l = [], x = (A) => {
    const L = { options: {
      shapeHint: "rectangle",
      vectorPath: sn(A.width, A.height, b),
      foregroundColor: v,
      borderColor: k,
      borderWidth: $,
      ...I.fontFamily ? { fontFamily: I.fontFamily } : {},
      ...A
    }, relationships: { associations: [] } };
    return l.push(L), L;
  };
  if (e.lanes.forEach((A, L) => {
    const N = C[L], j = u.x + N.x, D = u.y + N.y, M = A.station?.image;
    x({
      id: In(A.id),
      text: "",
      name: A.label,
      xPos: j + 2,
      yPos: D,
      width: t - 4,
      height: N.height,
      vectorPath: sn(t - 4, N.height, b ? b + 2 : 0),
      backgroundColor: p ? "#fcf9ed" : Wr(bn[L], 0.6),
      borderColor: p ? "#a8b5aa" : Wr(bn[L], 0.1),
      borderWidth: 1,
      ...p ? { borderStyle: "dashed" } : {}
    }), x({
      id: An(A.id),
      text: A.label,
      name: A.label,
      xPos: j + 8,
      yPos: D + 6,
      width: r,
      height: 58,
      backgroundColor: bn[L],
      fontSize: lo(A.label, F, r - 16, 50)
    });
    const q = p ? "" : ha(e, A.id), Ne = J, ue = p ? r : Math.min(r, Math.max(40, Math.ceil(q.length * Ne * 0.6) + 24));
    x({
      id: So(A.id),
      text: q,
      name: A.label,
      xPos: j + 8 + Math.round((r - ue) / 2),
      yPos: D + 68,
      width: ue,
      height: 22,
      vectorPath: sn(ue, 22, p ? 0 : 11),
      backgroundColor: p ? "transparent" : pa(e, A.id) ? bn[L % bn.length] : "rgba(255,255,255,0.72)",
      borderWidth: 0,
      fontSize: Ne
    }), M && l.push({ options: {
      id: Ot(A.id),
      name: M.alt,
      text: "",
      xPos: j + 8,
      yPos: D + c,
      width: r,
      height: Ii,
      shapeHint: "rectangle",
      image: M.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((X) => X.laneId === A.id).forEach((X, Be) => {
      const fn = mi(e, X), Ve = p ? r - 20 : r, re = p ? i - 6 : i, pe = p && !X.free, ye = pe ? {} : { ...I.card, ...X.look }, Ie = pe ? b : I.card?.cornerRadius ?? b;
      x({
        id: Ye(X.id),
        text: fn,
        name: X.label,
        xPos: j + (p ? 18 : 8),
        yPos: D + c + (M ? Co : 0) + Be * o,
        width: Ve,
        height: re,
        ...Ie !== b ? { vectorPath: sn(Ve, re, Ie) } : {},
        backgroundColor: pe ? "#ffda75" : ye.backgroundColor ?? I.backgroundColor ?? zn.backgroundColor,
        ...ye.textColor ? { foregroundColor: ye.textColor } : {},
        ...ye.fontFamily ? { fontFamily: ye.fontFamily } : {},
        ...ye.borderColor ? { borderColor: ye.borderColor } : {},
        ...ye.borderWidth !== void 0 ? { borderWidth: ye.borderWidth } : {},
        fontSize: lo(fn, ye.fontSize ?? O, Ve - 16, re - 8)
      });
    });
  }), e.appearance) for (const { options: A } of l) {
    const L = ns(e.appearance, A.id, {
      fill: A.backgroundColor,
      line: A.borderColor,
      lineWidth: A.borderWidth,
      fontSize: A.fontSize,
      height: A.height
    });
    L.height !== A.height && (A.vectorPath = sn(A.width, L.height, I.card?.cornerRadius ?? b), L.fontSize = lo(String(A.text ?? ""), L.fontSize ?? O, A.width - 16, L.height - 8)), Object.assign(A, { backgroundColor: L.fill, borderColor: L.line, borderWidth: L.lineWidth, fontSize: L.fontSize, height: L.height }, L.weight && { fontWeight: L.weight });
  }
  const S = new Map(l.map((A) => [A.options.id, A]));
  for (const A of e.lanes)
    A.station && (S.get(In(A.id)).relationships.associations = A.station.next.map((L) => ({
      id: A.id + "-to-" + L,
      parentId: In(A.id),
      childId: In(L),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const A of e.cards)
      for (const L of A.dependsOn ?? []) {
        const N = Ye(L), j = Ye(A.id);
        S.get(N).relationships.associations.push({
          id: `dependency-${L.length}-${L}-${A.id}`,
          parentId: N,
          childId: j,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (vi(l, Xn(n.scope)), n.beside) {
    const A = new Set(n.beside), L = new Set(l.map((D) => D.options.id)), N = /* @__PURE__ */ new Map();
    for (const D of [...L]) {
      if (!A.has(D)) continue;
      const M = xi(D, (q) => A.has(q) || L.has(q));
      L.add(M), N.set(D, M);
    }
    const j = (D) => N.get(D) ?? D;
    for (const D of l) {
      D.options.id = j(D.options.id);
      for (const M of D.relationships.associations)
        M.parentId = j(M.parentId), M.childId = j(M.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: l };
}
function ll(e, n, t = {}) {
  return e.behaviour ? be().note(e, n, t) : null;
}
function ba(e, n) {
  const t = Q(e), r = Xn(n?.scope);
  if (n?.native) return ka(t, n);
  const { width: o, row: i, height: c, top: u } = Vn, p = [];
  function C(b, O, F, J, l, x) {
    p.push({ options: {
      id: b,
      text: O,
      name: O,
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
  const { points: I } = ki(t), v = 152, k = v + 12, $ = t.lanes.some((b) => b.station?.image);
  t.lanes.forEach((b, O) => {
    const F = I[O].x, J = I[O].y + ($ ? (b.station?.row ?? 0) * k : 0), l = b.station?.image, x = t.kind === "release-plan" ? b.label + `
` + (b.capacity ? dn(t, b.id) + " / " + b.capacity + " points" : dn(t, b.id) + " points") : b.label;
    C(An(b.id), x, F, J, u - 12, bn[O]), l && p.push({ options: {
      id: Ot(b.id),
      name: l.alt,
      text: "",
      xPos: F,
      yPos: J + u,
      width: o,
      height: v,
      shapeHint: "rectangle",
      image: l.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((S) => S.laneId === b.id).forEach((S, A) => C(Ye(S.id), mi(t, S), F, J + u + (l ? k : 0) + A * i, c, "#fffdf6"));
  });
  for (const b of t.lanes) {
    if (!b.station) continue;
    const O = p.find((F) => F.options.id === An(b.id));
    O.relationships.associations = b.station.next.map((F) => ({ id: b.id + "-to-" + F, parentId: O.options.id, childId: An(F), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), O.options.text = b.label + `
` + b.station.outcome, O.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const b = new Map(p.map((O) => [O.options.id, O]));
    for (const O of t.cards)
      for (const F of O.dependsOn ?? []) {
        const J = Ye(F), l = Ye(O.id);
        b.get(J).relationships.associations.push({
          id: `dependency-${F.length}-${F}-${O.id}`,
          parentId: J,
          childId: l,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return vi(p, r), { options: { name: t.title }, shareId: "", nodes: p };
}
function va(e, n = {}, t) {
  const r = Q(e), o = n.narrow ? void 0 : n.width;
  if (oe(r)) {
    if (!t) throw new Error(`A ${r.kind} board's room needs its kit: pass kitFor('${r.kind}') from slateboxjs/boards.`);
    const { width: u, height: p } = t.places(r, o !== void 0 ? { width: o } : {});
    return { width: Math.max(u, o ?? 0), height: p };
  }
  const { width: i, height: c } = Fe(r, {});
  return { width: Math.max(No * Vn.pitch, i), height: c };
}
function xa(e, n, t = 1, r = 32) {
  let o = e.x;
  const i = n.filter((c) => [c.x, c.y, c.width, c.height].every(Number.isFinite));
  for (let c = 0; c <= i.length; c++) {
    const u = i.find((p) => o < p.x + p.width + r && o + e.width > p.x - r && e.y < p.y + p.height + r && e.y + e.height > p.y - r);
    if (!u) break;
    o = t > 0 ? u.x + u.width + r : u.x - r - e.width;
  }
  return { x: Math.round(o), y: Math.round(e.y) };
}
const dl = {
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
}, $o = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], jo = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function cl() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: $o.map(({ id: e, who: n, quote: t }) => ({ id: e, label: n + " · " + t, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: $o.map(({ id: e, action: n, signal: t }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: t, whenAbsent: "Still in the interview notes." }))
  };
}
function ul() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...jo.map(({ id: e, label: n, rate: t }) => ({ id: e, label: n + " · " + t }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function un(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const n = e.experience.kind, t = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...jo.map((r) => r.id)];
  if (!(e.lanes.length !== t.length || !e.lanes.every((r) => t.includes(r.id))) && !(n === "customer-interviews" && (!e.cards.every((r) => $o.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return n;
}
function Ia(e, n, t) {
  const r = un(e), o = e.cards.find((c) => c.id === n);
  if (!r || !o || o.laneId === t) return null;
  let i = e;
  if (r === "customer-interviews") {
    if (t !== "prototype") return null;
    const c = e.cards.find((u) => u.laneId === t);
    if (c) {
      if (!Lt(e, c).some((u) => u.id === "interviews")) return null;
      i = xo(e, c.id, "interviews");
    }
  }
  return Lt(i, o).some((c) => c.id === t) ? xo(i, n, t) : null;
}
function Aa(e, n) {
  if (un(e) !== "experiment-budget") return null;
  const t = jo.find((i) => i.id === n), r = e.cards.filter((i) => i.laneId === n).length, o = r * (t?.per ?? 0);
  return { amount: r * 200, description: t ? o + " " + (o === 1 ? t.single : t.unit) : "unallocated" };
}
export {
  Ps as CHROME_CHIPS_MAX_SCALE,
  qr as CHROME_MAX_SCALE,
  zn as DEFAULT_NOTE_STYLE,
  Ts as DRAFT_TAG,
  Fr as WORKSHOP_BOARD_KINDS,
  yt as WorkshopReferenceError,
  _r as addWorkshopBranch,
  wa as addWorkshopCard,
  ma as addWorkshopLane,
  Na as appearanceChips,
  Ma as appearanceEditsBetween,
  Xi as appearanceKeys,
  ns as appearanceLook,
  Sn as appearancePalette,
  xt as appearanceQuadrants,
  $e as applyWorkshopEdits,
  Ya as attachWorkshop,
  Lt as availableLanes,
  ll as behaviourNote,
  qe as blend,
  vr as boardBadgeShapes,
  Jr as boardChromeBox,
  Es as boardChromeLabel,
  Kr as boardChromeLayout,
  br as boardChromeShapes,
  Ka as boardChromeStyles,
  To as boardLegend,
  qs as businessBoardKinds,
  oe as businessKind,
  ks as canHangPanel,
  jo as channels,
  ys as checkWorkshopReplacement,
  he as chromeInk,
  Ur as chromeScaleAt,
  po as chromeTagScaleAt,
  as as countWord,
  Ss as createBoardLayer,
  ul as createBudgetWorkshop,
  cl as createInterviewWorkshop,
  rl as createLaneWorkshop,
  il as createWorkshopMap,
  Qa as decodeWorkshopFragment,
  Ua as describeFocusDarkroom,
  Da as describeWorkshopEdits,
  Va as encodeWorkshopFragment,
  Ta as handoffSummary,
  Ha as hangGalleryPanel,
  dl as industrialWorkshop,
  qa as initialFocusDarkroom,
  $o as interviews,
  cs as isRuleEdit,
  bn as laneColors,
  vn as layerInk,
  an as listed,
  ut as listeningRoom,
  Ea as listeningRoomCaption,
  Un as maxWorkshopCards,
  Cn as maxWorkshopLines,
  Ba as moonGallery,
  xo as moveWorkshopCard,
  Fa as named,
  Qn as nextWorkshopId,
  sl as nightTransfer,
  Ga as normalizeFocusDarkroom,
  Pa as normalizeListeningRoom,
  za as normalizeMoonGallery,
  $a as normalizeOfflineHandoff,
  Ca as offlineHandoff,
  Ia as planStartupMove,
  ls as pointing,
  zr as printFields,
  Qi as readAppearance,
  Ja as registerRuleControls,
  ja as registerRulebook,
  Ra as registerWorkshopRules,
  dn as releaseLoad,
  _a as releasePlan,
  xn as renderLayerShapes,
  La as resolveHandoff,
  Qs as resolveWorkshopSignals,
  Oa as reviewHandoff,
  sn as roundedBox,
  be as rulebook,
  is as rulebookLoaded,
  E as said,
  un as startupExperienceKind,
  Oo as unquoted,
  Q as validateWorkshop,
  ts as withAppearance,
  At as workshopBoardKind,
  Xn as workshopBoardScope,
  Aa as workshopBudgetResult,
  ln as workshopCandidate,
  Mr as workshopCardAsNote,
  bt as workshopCardAsNoteRefusal,
  Mt as workshopCardLabelOf,
  ca as workshopCardLines,
  ri as workshopCardLookOf,
  Ao as workshopCardNoteText,
  Er as workshopCardNoteWords,
  mi as workshopCardText,
  Tr as workshopDestinations,
  fo as workshopEditKinds,
  co as workshopFinder,
  xa as workshopFreeSpot,
  oa as workshopFreshOverride,
  tl as workshopHardLimit,
  Xa as workshopHasMarks,
  Lr as workshopKeepsLink,
  bo as workshopKeepsPicture,
  ha as workshopLaneCaption,
  pa as workshopLaneFull,
  Ze as workshopLaneHeld,
  nl as workshopLaneOverridden,
  Fe as workshopLanePlaces,
  Ue as workshopLaneSpoken,
  Vn as workshopLayout,
  Kn as workshopLineRefusal,
  ao as workshopLinesOf,
  ua as workshopLinesSentence,
  cn as workshopNewCardName,
  gi as workshopNewLine,
  ee as workshopNodeIds,
  qn as workshopNoteCandidate,
  ni as workshopNoteIdOf,
  rn as workshopNoteRefusal,
  Yn as workshopOverrideCandidate,
  li as workshopOverrideLine,
  ra as workshopOverrideMark,
  el as workshopOverrideUndone,
  ki as workshopPositions,
  Mo as workshopPresentationLanes,
  Za as workshopPresentationScenes,
  hs as workshopReferences,
  De as workshopRefusal,
  kn as workshopRenamedLines,
  va as workshopReserve,
  wr as workshopRuleSchema,
  xe as workshopRules,
  Wa as workshopRulesLoaded,
  al as workshopScopedId,
  na as workshopShedMark,
  ol as workshopStampOverrides,
  xi as workshopStandInId,
  sa as workshopTakesLines,
  so as workshopTakesNotes,
  ba as workshopToSlate,
  vt as workshopWithLine,
  fa as workshopWithoutCardLines,
  Nr as workshopWithoutLine
};
