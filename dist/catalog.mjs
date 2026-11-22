const L = "1.0", R = [
  { id: "all", label: "All" },
  { id: "plan", label: "Plan" },
  { id: "decide", label: "Decide" },
  { id: "meetings", label: "Meetings" },
  { id: "track", label: "Track" },
  { id: "map", label: "Map" }
], _ = (e = "Slatebox") => ({ by: e, at: "2026-11-21T00:00:00.000Z", via: "preset" }), S = {
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
}, x = () => ({ version: 1, title: "Decision path", lanes: [
  { id: "question", label: "The question", station: { column: 0, row: 0, next: ["option-a", "option-b"], outcome: "Say what you are deciding." } },
  { id: "option-a", label: "Option A", station: { column: 1, row: 0, next: ["decide"], outcome: "Weigh the first option." } },
  { id: "option-b", label: "Option B", station: { column: 1, row: 1, next: ["decide"], outcome: "Weigh the second option." } },
  { id: "decide", label: "Decide", station: { column: 2, row: 0, next: [], outcome: "Write down what you chose and why." } }
], cards: [{ id: "token", label: "Our choice", laneId: "question" }] }), a = (e, o, s, i) => ({ edit: e, words: o, say: s, ...i && { rule: i } }), m = (e = a("add_rule", "Cards move one lane at a time", "Cards move one lane at a time", "path"), o = []) => [
  a("add_rule", "Limit a lane", "Let {busy} hold 1", "capacity"),
  e,
  ...o,
  a("move_card", "Move a card", "Move {card} to {other}"),
  a("add_card", "Add a card", "Add a card called Snacks to {lane}"),
  a("rename_card", "Rename a card", "Rename {card} to Review notes"),
  a("remove_card", "Remove a card", "Remove {card}"),
  a("rename_lane", "Rename a lane", "Rename {lane} to Blocked"),
  a("rename_workshop", "Rename the board", "Rename the board to Team review"),
  a("set_rule", "Warn instead of refusing", "Just warn me when {ruled} is full"),
  a("remove_rule", "Remove a rule", "Remove the {ruled} rule")
], p = ["One board per slate for now; on a slate that has one, this opens on a new slate.", "Up to 5 lanes and 24 cards."], k = (e) => [...new Set(e.map((o) => o.edit))], f = (e) => [...new Set(e.flatMap((o) => o.rule ? [o.rule] : []))], c = (e, o, s, i, d, r, t, n = {}) => ({
  id: e,
  group: o,
  name: s,
  line: i,
  synonyms: d,
  build: { kind: "lanes" },
  addSay: ["Add " + g(s) + s.toLowerCase(), "Add " + g(s) + s.toLowerCase() + " about {topic}"],
  edits: k(n.moves ?? m()),
  rules: f(n.moves ?? m()),
  moves: m(),
  limits: p,
  loop: { src: "/library/" + e + ".svg", alt: s + ": " + t.join(" "), caption: r, steps: t },
  multiPerSlate: !1,
  ...n
}), u = (e) => ({ moves: e, edits: k(e), rules: f(e) }), M = (e) => e ? [
  a("add_rule", "Let a task slip, in red", "Let things slip past " + e + " but show them in red", "deadline"),
  a("set_rule", "Stop a slip at what waits on it", "Stop me instead of pushing dependent tasks", "cascade"),
  a("add_rule", "Add a freeze", "Nothing ships in code freeze, {dates}", "blackout"),
  a("add_rule", "Keep a team’s tasks apart", "{lane}’s tasks can’t overlap", "overlap"),
  a("add_rule", "Lock a task", "Lock {card}", "locked"),
  a("add_rule", "Snap to weeks", "Snap to weeks", "snap"),
  a("set_task", "Stretch a task", "Make {card} 3 days"),
  a("set_launch_day", "Move " + e, "Move " + e + " to {later}"),
  a("link_tasks", "Make a task wait on another", "{card} waits on {other card}"),
  a("add_card", "Add a task", "Add a task called Docs to {lane}"),
  a("rename_card", "Rename a task", "Rename {card} to Review notes")
] : [
  a("add_rule", "Keep a runway floor", "Never let runway drop below 15 months", "deadline"),
  a("add_rule", "Lock a signed offer", "Lock {card}", "locked"),
  a("set_rule", "Stop a slip at what waits on it", "Stop me instead of pushing dependent hires", "cascade"),
  a("set_task", "Move a hire", "Push {card} to {month}"),
  a("set_band_cost", "Price a role band", "{band} costs $16k a month"),
  a("set_funding", "Move the round", "Move the round to {month}"),
  a("add_card", "Add a hire", "Add a Designer to {lane}"),
  a("rename_card", "Rename a hire", "Rename {card} to Staff eng")
], b = (e, o, s, i, d, r, t = "launch-plan", n = "launch-plan") => ({
  id: e,
  group: "plan",
  name: o,
  line: s,
  synonyms: i,
  build: { kind: n, sample: t },
  addSay: ["Add " + g(o) + o.toLowerCase(), "Add " + g(o) + o.toLowerCase() + " about {topic}"],
  ...u(M(n === "hiring-plan" ? "" : t === "go-live" ? "go-live" : "launch")),
  limits: [n === "hiring-plan" ? "Cost is per role band, never per person. On a phone it is read-only." : "Up to 12 tasks on 2 to 4 teams.", p[0]],
  loop: { src: "/library/" + e + ".svg", alt: o + ": " + r.join(" "), caption: d, steps: r },
  multiPerSlate: !1
}), g = (e) => /^pros/i.test(e) ? "" : /^[aeiou]/i.test(e) ? "an " : "a ", h = [
  c(
    "now-next-later",
    "plan",
    "Now / Next / Later",
    "Order work loosely; Next holds 3",
    ["roadmap", "plan work", "priorities", "order work", "backlog"],
    "Next holds 3.",
    ["Drag a note into a lane: it becomes a card.", "A full lane dims and says why."],
    { addSay: ["Add a Now / Next / Later board", "Add a Now / Next / Later board about {topic}"] }
  ),
  c(
    "pros-cons",
    "decide",
    "Pros and cons",
    "Weigh one decision: pros, cons, questions",
    ["pro con", "pros cons", "weigh a decision", "decide", "tradeoffs", "trade-offs"],
    "No rules: any card goes in any lane.",
    ["Drag a note in: it becomes a point.", "Drag it out: it is a note again."],
    { addSay: ["Add pros and cons", "Add pros and cons for {topic}"] }
  ),
  c(
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
  c(
    "retro",
    "meetings",
    "Retro",
    "Went well, change, try: 3 cards each",
    ["retrospective", "retro", "run a retro", "team meeting", "look back", "lessons"],
    "Try holds 3.",
    ["A note turns into a card and back.", "Each lane holds 3; the fourth is refused."]
  ),
  c(
    "triage",
    "track",
    "Triage",
    "Sort incoming work; Today holds 3",
    ["triage", "inbox", "incoming", "support", "bugs", "sort work", "track work"],
    "Today holds 3.",
    ["A card goes into Today.", "A full Today refuses."],
    { addSay: ["Add a triage board", "Add a triage board about {topic}"] }
  ),
  c(
    "team-board",
    "track",
    "Team board",
    "Your working agreements, enforced: limits, paths, a bin",
    ["kanban", "team board", "working agreements", "wip limit", "to do doing done", "track work", "sprint"],
    "Doing holds 3.",
    ["A full Doing shows 3 of 3 and dims.", "The next card dragged to Doing is refused with that sentence."],
    {
      addSay: ["Add a team board", "Add a team board about {topic}"],
      ...u(m(a("add_rule", "Send cards one way", "From {busy} cards go only to {other}", "path"), [a("add_rule", "Add a bin", "Make {lane} a bin", "bin")]))
    }
  ),
  b(
    "launch-plan",
    "Launch plan",
    "Tasks on real dates toward launch day, with your rules",
    ["launch", "timeline", "gantt", "schedule", "deadline", "release date", "code freeze"],
    "A slip pushes the tasks that wait on it.",
    ["Slide a task: what waits on it follows.", "Past launch it stops."]
  ),
  b(
    "customer-go-live",
    "Customer go-live",
    "Us and the customer, toward one go-live date",
    ["go-live", "onboarding", "implementation", "rollout", "kickoff"],
    "Days are working days: weekends don’t count.",
    ["Slide a task: weekends don’t count.", "Past go-live it stops."],
    "go-live"
  ),
  b(
    "hiring-plan",
    "Hiring plan",
    "Hires over the year, with runway",
    ["hiring", "headcount", "recruiting", "hires", "runway", "burn"],
    "Hires snap to whole weeks.",
    ["Drag a hire later: runway grows.", "Below your floor it stops."],
    "hiring-plan",
    "hiring-plan"
  ),
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
function v(e) {
  return h.find((o) => o.id === e);
}
function T(e = "all") {
  return h.filter((o) => e === "all" || o.group === e);
}
function C(e, o, s = {}) {
  const i = v(e);
  if (!i) throw new Error("There is nothing called " + e + " in the library.");
  const d = (t) => {
    const n = typeof o == "string" ? o.replace(/\s+/g, " ").trim().slice(0, 100) : "";
    return (n ? t + ": " + n : t).slice(0, 120);
  };
  if (i.build.sample) {
    const t = s[i.build.sample];
    if (!t) throw new Error("Load slateboxjs/workshops/rules before adding a " + i.name.toLowerCase() + ".");
    const n = t();
    return { ...n, title: o ? d(i.name) : n.title };
  }
  if (i.build.kind === "map") return { ...x(), title: d("Decision path") };
  const r = S[e];
  return {
    version: 1,
    title: d(r.title),
    lanes: r.lanes.map((t) => ({ ...t })),
    cards: [],
    behaviour: { version: 1, rev: 0, rules: (r.rules ?? []).map((t, n) => ({ id: "rule-" + (n + 1), on: !0, severity: "refuse", set: _(), ...t })) }
  };
}
const y = (e) => e.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9/ ]+/g, " ").replace(/\s+/g, " ").trim();
function D(e) {
  if (typeof e != "string" || e.length > 300) return null;
  const o = e.trim().replace(/[.!]+$/, ""), s = /^(?:please\s+)?(?:add|start|set up|make|create|open)\s+(?:(?:a|an|the|some|our|my)\s+)?(?:new\s+)?/i.exec(o);
  if (!s) return null;
  const i = o.slice(s[0].length);
  for (const d of [...h].sort((r, t) => t.name.length - r.name.length)) {
    const r = [d.name, ...d.addSay.map((t) => t.replace(/^Add (?:an? )?/i, "").replace(/ (?:about|for) \{topic\}$/, ""))];
    for (const t of r) {
      const n = t.toLowerCase().replace(/\s*\/\s*/g, "\\s*/?\\s*").replace(/ /g, "\\s+"), l = new RegExp("^" + n + "(?:\\s+(?:board|component))?(?:\\s+(?:about|for|on)\\s+(.+))?$", "i").exec(i);
      if (l)
        return l[1] && /[:;,→]|->|\$|\d\s*(?:k|m|%)\b|\d{3,}/i.test(l[1]) ? null : l[1] ? { id: d.id, topic: l[1].trim() } : { id: d.id };
    }
  }
  return null;
}
function P(e) {
  const o = y(e);
  if (!o || o.length > 200) return null;
  if (/^(?:what|which)\s+(?:can|could)\s+(?:i|we|you)\s+(?:add|make|build|put)\b|^(?:show|list|browse)\s+(?:me\s+)?(?:the\s+)?(?:library|components|boards|everything)|^what\s+(?:is|s)\s+in\s+the\s+library/.test(o))
    return { all: !0, entries: h.map((t) => t.id) };
  const s = "(?:a |an |some |any )?(?:board|template|component|tool|way|something|anything|starter|preset)s? (?:to|for|that)\\b", i = new RegExp("^(?:(?:something|anything) (?:to|for)\\b|(?:a|an|any) " + s + "|(?:i|we) (?:want|need|would like|d like) " + s + "|(?:is there|do you have|have you got) " + s + "|help (?:me|us) (?:pick|choose|find) " + s + "|how (?:do|can|could|should) (?:i|we) (?:run|track|plan|weigh|prioriti[sz]e|sort|triage|budget|organi[sz]e|decide)\\b)").exec(o);
  if (!i || /\b(?:draw|diagram|chart|flowchart|sketch|mind map)\b/.test(o)) return null;
  const d = new Set(o.slice(i[0].length).split(" ").filter((t) => t.length > 2 && !["the", "and", "for", "our", "with"].includes(t))), r = h.map((t) => {
    const n = [t.name, t.line, ...t.synonyms].map(y).join(" ");
    let l = 0;
    for (const w of d) (n.includes(w) || n.includes(w.replace(/s$/, ""))) && (l += t.synonyms.some((A) => y(A).includes(w.replace(/s$/, ""))) ? 2 : 1);
    return { id: t.id, score: l };
  }).filter((t) => t.score > 0).sort((t, n) => n.score - t.score);
  return r.length ? { all: !1, entries: r.slice(0, 3).map((t) => t.id) } : null;
}
function N(e, o) {
  return v(e) ? o.hasBoard ? { ok: !1, reason: "This slate already has a board, so this opens on a new slate." } : { ok: !0 } : { ok: !1, reason: "That is not in the library." };
}
export {
  h as catalog,
  D as catalogAddRequest,
  v as catalogEntry,
  N as catalogFits,
  R as catalogGroups,
  T as catalogList,
  P as catalogMatch,
  C as catalogPreset,
  L as catalogVersion
};
