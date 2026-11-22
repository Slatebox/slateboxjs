const S = "1.0", x = [
  { id: "all", label: "All" },
  { id: "plan", label: "Plan" },
  { id: "decide", label: "Decide" },
  { id: "meetings", label: "Meetings" },
  { id: "track", label: "Track" },
  { id: "map", label: "Map" }
], k = (e = "Slatebox") => ({ by: e, at: "2026-11-21T00:00:00.000Z", via: "preset" }), v = {
  "now-next-later": {
    title: "Now, next, later",
    lanes: [{ id: "now", label: "Now" }, { id: "next", label: "Next" }, { id: "later", label: "Later" }],
    rules: [{ kind: "capacity", where: "next", max: 3 }]
  },
  "pros-cons": { title: "Pros and cons", lanes: [{ id: "pros", label: "Pros" }, { id: "cons", label: "Cons" }, { id: "questions", label: "Questions" }], rules: [] },
  "must-should-could": { title: "Must, should, could", lanes: [
    { id: "must", label: "Must" },
    { id: "should", label: "Should" },
    { id: "could", label: "Could" },
    { id: "wont", label: "Won't" }
  ], rules: [{ kind: "capacity", where: "must", max: 3 }, { kind: "capacity", where: "could", max: 2 }, { kind: "bin", lane: "wont" }] },
  retro: {
    title: "Retro",
    lanes: [{ id: "well", label: "Went well" }, { id: "change", label: "Change" }, { id: "try", label: "Try" }],
    rules: [{ kind: "capacity", where: "well", max: 3 }, { kind: "capacity", where: "change", max: 3 }, { kind: "capacity", where: "try", max: 3 }]
  },
  triage: {
    title: "Triage",
    lanes: [{ id: "new", label: "New" }, { id: "today", label: "Today" }, { id: "waiting", label: "Waiting" }, { id: "done", label: "Done" }],
    rules: [{ kind: "capacity", where: "today", max: 3 }]
  },
  "team-board": {
    title: "Team board",
    lanes: [
      { id: "todo", label: "To do" },
      { id: "doing", label: "Doing" },
      { id: "review", label: "Review" },
      { id: "done", label: "Done" },
      { id: "wont", label: "Won't do" }
    ],
    rules: [{ kind: "path", from: "any", noSkip: !0 }, { kind: "capacity", where: "doing", max: 3 }, { kind: "bin", lane: "wont" }]
  }
}, A = () => ({ version: 1, title: "Decision path", lanes: [
  { id: "question", label: "The question", station: { column: 0, row: 0, next: ["option-a", "option-b"], outcome: "Say what you are deciding." } },
  { id: "option-a", label: "Option A", station: { column: 1, row: 0, next: ["decide"], outcome: "Weigh the first option." } },
  { id: "option-b", label: "Option B", station: { column: 1, row: 1, next: ["decide"], outcome: "Weigh the second option." } },
  { id: "decide", label: "Decide", station: { column: 2, row: 0, next: [], outcome: "Write down what you chose and why." } }
], cards: [{ id: "token", label: "Our choice", laneId: "question" }] }), a = (e, t, d, l) => ({ edit: e, words: t, say: d, ...l && { rule: l } }), m = (e = a("add_rule", "Cards move one lane at a time", "Cards move one lane at a time", "path"), t = []) => [
  a("add_rule", "Limit a lane", "Let {busy} hold 1", "capacity"),
  e,
  ...t,
  a("move_card", "Move a card", "Move {card} to {other}"),
  a("add_card", "Add a card", "Add a card called Snacks to {lane}"),
  a("rename_card", "Rename a card", "Rename {card} to Review notes"),
  a("remove_card", "Remove a card", "Remove {card}"),
  a("rename_lane", "Rename a lane", "Rename {lane} to Blocked"),
  a("rename_workshop", "Rename the board", "Rename the board to Team review"),
  a("set_rule", "Warn instead of refusing", "Just warn me when {ruled} is full"),
  a("remove_rule", "Remove a rule", "Remove the {ruled} rule")
], p = ["One board per slate for now; on a slate that has one, this opens on a new slate.", "Up to 5 lanes and 24 cards."], g = (e) => [...new Set(e.map((t) => t.edit))], y = (e) => [...new Set(e.flatMap((t) => t.rule ? [t.rule] : []))], r = (e, t, d, l, o, i, n, s = {}) => ({
  id: e,
  group: t,
  name: d,
  line: l,
  synonyms: o,
  build: { kind: "lanes" },
  addSay: ["Add " + w(d) + d.toLowerCase(), "Add " + w(d) + d.toLowerCase() + " about {topic}"],
  edits: g(s.moves ?? m()),
  rules: y(s.moves ?? m()),
  moves: m(),
  limits: p,
  loop: { src: "/library/" + e + ".svg", alt: d + ": " + n.join(" "), caption: i, steps: n },
  multiPerSlate: !1,
  ...s
}), u = (e) => ({ moves: e, edits: g(e), rules: y(e) }), w = (e) => /^pros/i.test(e) ? "" : /^[aeiou]/i.test(e) ? "an " : "a ", h = [
  r(
    "now-next-later",
    "plan",
    "Now / Next / Later",
    "Order work loosely; Next holds 3",
    ["roadmap", "plan work", "priorities", "order work", "backlog"],
    "Next holds 3.",
    ["Drag a note into a lane: it becomes a card.", "A full lane dims and says why."],
    { addSay: ["Add a Now / Next / Later board", "Add a Now / Next / Later board about {topic}"] }
  ),
  r(
    "pros-cons",
    "decide",
    "Pros and cons",
    "Weigh one decision: pros, cons, questions",
    ["pro con", "pros cons", "weigh a decision", "decide", "tradeoffs", "trade-offs"],
    "2 pros, 1 con",
    ["Drag a note in: it becomes a point.", "Drag it out: it is a note again."],
    { addSay: ["Add pros and cons", "Add pros and cons for {topic}"] }
  ),
  r(
    "must-should-could",
    "decide",
    "Must / Should / Could",
    "Prioritise with limits",
    ["moscow", "prioritise", "prioritize", "priorities", "features", "scope"],
    "Could holds 2.",
    ["Drop a card in Must or Could.", "A full lane refuses, in its own words."],
    { addSay: ["Add a Must / Should / Could board", "Add a Must / Should / Could board about {topic}"] }
  ),
  {
    id: "decision-path",
    group: "decide",
    name: "Decision path",
    line: "Walk through a choice step by step",
    synonyms: ["decision tree", "walk through", "flow", "choice", "path", "decide"],
    build: { kind: "map" },
    addSay: ["Add a decision path", "Add a decision path about {topic}"],
    ...u([
      a("add_station", "Add a step", "Add Follow-up after {lane}"),
      a("connect_stations", "Connect two steps", "Connect {lane} to {other}"),
      a("move_card", "Move the token", "Move {card} to {other}"),
      a("rename_lane", "Rename a step", "Rename {lane} to Build it")
    ]),
    limits: ["Up to 5 steps on a 3 by 3 grid.", p[0]],
    loop: { src: "/library/decision-path.svg", alt: "Decision path: the token moves only along connected steps.", caption: "Not connected", steps: ["Drag the token along a path.", "A step with no path to it dims."] },
    multiPerSlate: !1
  },
  r(
    "retro",
    "meetings",
    "Retro",
    "Went well, change, try: 3 cards each",
    ["retrospective", "retro", "run a retro", "team meeting", "look back", "lessons"],
    "Try holds 3.",
    ["A note turns into a card and back.", "Each lane holds 3; the fourth is refused."]
  ),
  r(
    "triage",
    "track",
    "Triage",
    "Sort incoming work; Today holds 3",
    ["triage", "inbox", "incoming", "support", "bugs", "sort work", "track work"],
    "Today holds 3.",
    ["A card goes into Today.", "A full Today refuses."],
    { addSay: ["Add a triage board", "Add a triage board about {topic}"] }
  ),
  r(
    "team-board",
    "track",
    "Team board",
    "Your working agreements, enforced: limits, paths, a bin",
    ["kanban", "team board", "working agreements", "wip limit", "to do doing done", "track work", "sprint"],
    "Review holds 2. It has 3.",
    ["Say “Let Review hold 2”: the board shows 3 of 2.", "The next card dragged to Review is refused with that sentence."],
    {
      addSay: ["Add a team board", "Add a team board about {topic}"],
      ...u(m(a("add_rule", "Send cards one way", "From {busy} cards go only to {other}", "path"), [a("add_rule", "Add a bin", "Make {lane} a bin", "bin")]))
    }
  ),
  {
    id: "launch-plan",
    group: "plan",
    name: "Launch plan",
    line: "Tasks over days, with a launch date",
    synonyms: ["launch", "timeline", "gantt", "schedule", "deadline", "release date"],
    build: { kind: "launch-plan", sample: "launch-plan" },
    addSay: ["Add a launch plan", "Add a launch plan about {topic}"],
    ...u([
      a("set_task", "Stretch a task", "Make {card} 3 days"),
      a("set_launch_day", "Move launch", "Move launch to day 30"),
      a("link_tasks", "Make a task wait on another", "{card} waits on {other card}"),
      a("add_card", "Add a task", "Add a task called Docs to {lane}"),
      a("rename_card", "Rename a task", "Rename {card} to Review notes")
    ]),
    limits: ["Every task ends by launch day.", p[0]],
    loop: { src: "/library/launch-plan.svg", alt: "Launch plan: stretch a task, slide it past launch and get refused.", caption: "That pushes QA past launch.", steps: ["Stretch a task.", "Slide it past launch: refused."] },
    multiPerSlate: !1
  },
  {
    id: "sales-pipeline",
    group: "track",
    name: "Sales pipeline",
    line: "Move deals through stages toward a target",
    synonyms: ["deals", "sales", "pipeline", "crm", "track deals", "forecast", "customers"],
    build: { kind: "pipeline", sample: "pipeline" },
    addSay: ["Add a sales pipeline", "Add a sales pipeline about {topic}"],
    ...u([
      a("move_card", "Carry a deal on", "Move {card} to {other}"),
      a("set_amount", "Price a deal", "Make {card} $40k"),
      a("set_target", "Set the target", "Set the target to $300k"),
      a("add_card", "Add a deal", "Add a deal called Initech to {lane}"),
      a("add_rule", "Ask for an amount", "{lane} needs an amount", "gate"),
      a("add_rule", "Limit a stage", "Let {busy} hold 1", "capacity")
    ]),
    limits: ["Up to 16 deals.", p[0]],
    loop: { src: "/library/sales-pipeline.svg", alt: "Sales pipeline: carry a deal on; stages it cannot skip dim; the forecast moves.", caption: "Proposal holds 3.", steps: ["Carry a deal to the next stage.", "A full stage refuses."] },
    multiPerSlate: !1
  },
  {
    id: "budget",
    group: "plan",
    name: "Budget",
    line: "Split a fixed total across teams",
    synonyms: ["budget", "money", "spend", "allocate", "costs"],
    build: { kind: "budget", sample: "budget" },
    addSay: ["Add a budget", "Add a budget about {topic}"],
    ...u([
      a("shift_budget", "Move money between teams", "Move $10k from {lane} to {other}"),
      a("set_amount", "Price a line item", "Make {card} $20k"),
      a("add_card", "Add a line item", "Add a line item called Events for $10k to {lane}")
    ]),
    limits: ["The total stays fixed.", p[0]],
    loop: { src: "/library/budget.svg", alt: "Budget: move money between teams; the total stays fixed.", caption: "The total stays fixed.", steps: ["Move a divider between teams.", "The total stays the same."] },
    multiPerSlate: !1
  }
];
function f(e) {
  return h.find((t) => t.id === e);
}
function _(e = "all") {
  return h.filter((t) => e === "all" || t.group === e);
}
function M(e, t, d = {}) {
  const l = f(e);
  if (!l) throw new Error("There is nothing called " + e + " in the library.");
  const o = (n) => {
    const s = typeof t == "string" ? t.replace(/\s+/g, " ").trim().slice(0, 100) : "";
    return (s ? n + ": " + s : n).slice(0, 120);
  };
  if (l.build.sample) {
    const n = d[l.build.sample];
    if (!n) throw new Error("Load slateboxjs/workshops/rules before adding a " + l.name.toLowerCase() + ".");
    const s = n();
    return { ...s, title: t ? o(l.name) : s.title };
  }
  if (l.build.kind === "map") return { ...A(), title: o("Decision path") };
  const i = v[e];
  return {
    version: 1,
    title: o(i.title),
    lanes: i.lanes.map((n) => ({ ...n })),
    cards: [],
    behaviour: { version: 1, rev: 0, rules: (i.rules ?? []).map((n, s) => ({ id: "rule-" + (s + 1), on: !0, severity: "refuse", set: k(), ...n })) }
  };
}
const b = (e) => e.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9/ ]+/g, " ").replace(/\s+/g, " ").trim();
function T(e) {
  if (typeof e != "string" || e.length > 300) return null;
  const t = e.trim().replace(/[.!]+$/, ""), d = /^(?:please\s+)?(?:add|start|set up|make|create|open)\s+(?:(?:a|an|the|some|our|my)\s+)?(?:new\s+)?/i.exec(t);
  if (!d) return null;
  const l = t.slice(d[0].length);
  for (const o of [...h].sort((i, n) => n.name.length - i.name.length)) {
    const i = [o.name, ...o.addSay.map((n) => n.replace(/^Add (?:an? )?/i, "").replace(/ (?:about|for) \{topic\}$/, ""))];
    for (const n of i) {
      const s = n.toLowerCase().replace(/\s*\/\s*/g, "\\s*/?\\s*").replace(/ /g, "\\s+"), c = new RegExp("^" + s + "(?:\\s+(?:board|component))?(?:\\s+(?:about|for|on)\\s+(.+))?$", "i").exec(l);
      if (c) return c[1] ? { id: o.id, topic: c[1].trim() } : { id: o.id };
    }
  }
  return null;
}
function R(e) {
  const t = b(e);
  if (!t || t.length > 200) return null;
  if (/^(?:what|which)\s+(?:can|could)\s+(?:i|we|you)\s+(?:add|make|build|put)\b|^(?:show|list|browse)\s+(?:me\s+)?(?:the\s+)?(?:library|components|boards|everything)|^what\s+(?:is|s)\s+in\s+the\s+library/.test(t))
    return { all: !0, entries: h.map((o) => o.id) };
  if (!/^(?:something|anything|a (?:board|way|tool)|how (?:do|can|could) (?:i|we)|i (?:want|need)|we (?:want|need)|help (?:me|us))\b/.test(t)) return null;
  const d = new Set(t.split(" ").filter((o) => o.length > 2 && !["something", "anything", "how", "can", "could", "the", "and", "for", "want", "need", "help", "way", "run", "our", "with"].includes(o))), l = h.map((o) => {
    const i = [o.name, o.line, ...o.synonyms].map(b).join(" ");
    let n = 0;
    for (const s of d) (i.includes(s) || i.includes(s.replace(/s$/, ""))) && (n += o.synonyms.some((c) => b(c).includes(s.replace(/s$/, ""))) ? 2 : 1);
    return { id: o.id, score: n };
  }).filter((o) => o.score > 0).sort((o, i) => i.score - o.score);
  return l.length ? { all: !1, entries: l.slice(0, 3).map((o) => o.id) } : null;
}
function C(e, t) {
  return f(e) ? t.hasBoard ? { ok: !1, reason: "This slate already has a board, so this opens on a new slate." } : { ok: !0 } : { ok: !1, reason: "That is not in the library." };
}
export {
  h as catalog,
  T as catalogAddRequest,
  f as catalogEntry,
  C as catalogFits,
  x as catalogGroups,
  _ as catalogList,
  R as catalogMatch,
  M as catalogPreset,
  S as catalogVersion
};
