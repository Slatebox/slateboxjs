const q = "1.0", O = [
  { id: "all", label: "All" },
  { id: "plan", label: "Plan" },
  { id: "decide", label: "Decide" },
  { id: "meetings", label: "Meetings" },
  { id: "track", label: "Track" },
  { id: "map", label: "Map" }
], D = (a = "Slatebox") => ({ by: a, at: "2026-11-21T00:00:00.000Z", via: "preset" }), L = {
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
}, P = () => ({ version: 1, title: "Decision path", lanes: [
  { id: "question", label: "The question", station: { column: 0, row: 0, next: ["option-a", "option-b"], outcome: "Say what you are deciding." } },
  { id: "option-a", label: "Option A", station: { column: 1, row: 0, next: ["decide"], outcome: "Weigh the first option." } },
  { id: "option-b", label: "Option B", station: { column: 1, row: 1, next: ["decide"], outcome: "Weigh the second option." } },
  { id: "decide", label: "Decide", station: { column: 2, row: 0, next: [], outcome: "Write down what you chose and why." } }
], cards: [{ id: "token", label: "Our choice", laneId: "question" }] }), e = (a, t, n, s) => ({ edit: a, words: t, say: n, ...s && { rule: s } }), y = (a = e("add_rule", "Cards move one lane at a time", "Cards move one lane at a time", "path"), t = []) => [
  e("add_rule", "Limit a lane", "Let {busy} hold 1", "capacity"),
  a,
  ...t,
  e("move_card", "Move a card", "Move {card} to {other}"),
  e("add_card", "Add a card", "Add a card called Snacks to {lane}"),
  e("rename_card", "Rename a card", "Rename {card} to Review notes"),
  e("remove_card", "Remove a card", "Remove {card}"),
  e("rename_lane", "Rename a lane", "Rename {lane} to Blocked"),
  e("rename_workshop", "Rename the board", "Rename the board to Team review"),
  e("set_rule", "Warn instead of refusing", "Just warn me when {ruled} is full"),
  e("remove_rule", "Remove a rule", "Remove the {ruled} rule")
], p = ["Up to 8 boards on one slate, side by side; past that, it opens on a new slate.", "Up to 5 lanes and 24 cards."], M = (a) => [...new Set(a.map((t) => t.edit))], x = (a) => [...new Set(a.flatMap((t) => t.rule ? [t.rule] : []))], h = (a, t, n, s, d, i, o, r = {}) => ({
  id: a,
  group: t,
  name: n,
  line: s,
  synonyms: d,
  build: { kind: "lanes" },
  addSay: ["Add " + m(n) + n.toLowerCase(), "Add " + m(n) + n.toLowerCase() + " about {topic}"],
  edits: M(r.moves ?? y()),
  rules: x(r.moves ?? y()),
  moves: y(),
  limits: p,
  loop: { src: "/library/" + a + ".svg", alt: n + ": " + o.join(" "), caption: i, steps: o },
  multiPerSlate: !0,
  ...r
}), u = (a) => ({ moves: a, edits: M(a), rules: x(a) }), T = (a) => a ? [
  e("add_rule", "Let a task slip, in red", "Let things slip past " + a + " but show them in red", "deadline"),
  e("set_rule", "Stop a slip at what waits on it", "Stop me instead of pushing dependent tasks", "cascade"),
  e("add_rule", "Add a freeze", "Nothing ships in code freeze, {dates}", "blackout"),
  e("add_rule", "Keep a team’s tasks apart", "{lane}’s tasks can’t overlap", "overlap"),
  e("add_rule", "Lock a task", "Lock {card}", "locked"),
  e("add_rule", "Snap to weeks", "Snap to weeks", "snap"),
  e("set_task", "Stretch a task", "Make {card} 3 days"),
  e("set_launch_day", "Move " + a, "Move " + a + " to {later}"),
  e("link_tasks", "Make a task wait on another", "{card} waits on {other card}"),
  e("add_card", "Add a task", "Add a task called Docs to {lane}"),
  e("rename_card", "Rename a task", "Rename {card} to Review notes")
] : [
  e("add_rule", "Keep a runway floor", "Never let runway drop below 15 months", "deadline"),
  e("add_rule", "Lock a signed offer", "Lock {card}", "locked"),
  e("set_rule", "Stop a slip at what waits on it", "Stop me instead of pushing dependent hires", "cascade"),
  e("set_task", "Move a hire", "Push {card} to {month}"),
  e("set_band_cost", "Price a role band", "{band} costs $16k a month"),
  e("set_funding", "Move the round", "Move the round to {month}"),
  e("add_card", "Add a hire", "Add a Designer to {lane}"),
  e("rename_card", "Rename a hire", "Rename {card} to Staff eng")
], k = (a, t, n, s, d, i, o = "launch-plan", r = "launch-plan") => ({
  id: a,
  group: "plan",
  name: t,
  line: n,
  synonyms: s,
  build: { kind: r, sample: o },
  addSay: ["Add " + m(t) + t.toLowerCase(), "Add " + m(t) + t.toLowerCase() + " about {topic}"],
  ...u(T(r === "hiring-plan" ? "" : o === "go-live" ? "go-live" : "launch")),
  limits: [r === "hiring-plan" ? "Cost is per role band, never per person. On a phone it is read-only." : "Up to 12 tasks on 2 to 4 teams.", p[0]],
  loop: { src: "/library/" + a + ".svg", alt: t + ": " + i.join(" "), caption: d, steps: i },
  multiPerSlate: !0
}), w = (a, t) => [...a ? [
  e("add_rule", "Weight piles by ARR", "Weight by ARR", "rank"),
  e("add_rule", "Cap a pile", "Piles hold at most 2", "children"),
  e("add_rule", "Send far drops to Unsorted", "Drops in empty space go to Unsorted", "emptyDrop"),
  e("add_rule", "Group piles into themes", "Group {pile} and {other pile} into Product", "depth"),
  e("nest_card", "Move a note to a pile", "Move {item} to {pile}"),
  e("merge_cards", "Merge two piles", "Merge {other pile} into {pile}"),
  e("set_layout", "Hand the top piles to a discovery tree", "Turn the top 3 piles into a discovery tree"),
  e("add_card", "Add a note", "Add a note called Slow exports to {pile}"),
  e("set_source", "Say who said it", "{item} came from Initech")
] : [
  ...t,
  e("nest_card", "Move a card under another", "Move {item} under {parent}")
], e("rename_card", "Rename a card", "Rename {item} to Self-serve import"), e("remove_card", "Remove a card", "Remove {item}")], A = [e("set_rule", "Make a warning a rule", "Stop me when an action is not under a cause", "nests"), e("add_card", "Ask why once more", "Add a cause called Unclear pricing page under {parent}")], b = (a, t, n, s, d, i, o, r, l) => (
  // A name that is a verb ("Sort the evidence") is added as a board to do it.
  {
    id: a,
    group: t,
    name: n,
    line: s,
    synonyms: d,
    build: { kind: "nest", sample: i },
    addSay: [0, 1].map((c) => "Add " + (/^(?:sort|break)\b/i.test(n) ? "a board to " : m(n)) + n.toLowerCase() + (c ? " about {topic}" : "")),
    ...u(l),
    limits: ["Up to 40 cards. On a phone it is an outline.", p[0]],
    loop: { src: "/library/" + a + ".svg", alt: n + ": " + r.join(" "), caption: o, steps: r },
    multiPerSlate: !0
  }
), C = [
  e("add_rule", "Limit a square", "Plan it holds 2", "quadrant"),
  e("set_rule", "Make room in Do now", "Do now holds 4", "quadrant"),
  e("score_card", "Move an idea to a square", "Move {scored} to Later"),
  e("score_card", "Score an idea", "Score {waiting} impact 7, effort 8"),
  e("rename_field", "Rename the axes", "Rename the axes Reach and Confidence"),
  e("add_card", "Add an idea", "Add a card called Webhooks"),
  e("rename_card", "Rename an idea", "Rename {scored} to Self-serve import"),
  e("remove_card", "Remove an idea", "Remove {scored}")
], W = [
  e("set_rule", "Change the span of control", "No manager over 3 reports", "children"),
  e("add_rule", "Keep a role from managing", "Engineers don’t manage", "parent"),
  e("set_rule", "Make a warning a rule", "Stop me when a manager has no designer", "contains"),
  e("nest_card", "Move someone, with their team", "Move {manager} under {other manager}"),
  e("set_role", "Fill an open role", "Make {open} a manager"),
  e("add_card", "Add a hire", "Add a designer called Mia Holt under {manager}"),
  e("add_field", "Track a yes/no field", "Track remote as yes or no"),
  e("set_field", "Mark a contractor", "{person} is a contractor"),
  e("rename_card", "Rename someone", "Rename {person} to Ravi Shah, Staff"),
  e("remove_card", "Remove someone", "Remove {person}")
], N = [
  e("set_rule", "Bring what is under a card along", "When I move a key result, bring its initiatives along", "sameOwnerAs"),
  e("set_rule", "Refuse a cross-team owner", "Stop me when a key result is owned outside its objective’s team", "sameOwnerAs"),
  e("set_rule", "Ask about what is under it", "Ask before moving what is under a card"),
  e("set_owner", "Give a card to a team", "Give {kr} to {owner}"),
  e("add_owner", "Add a team", "Add Data as a team"),
  e("nest_card", "Move a card under another", "Move {kr} under {parent}"),
  e("add_card", "Add an initiative", "Add an initiative called Status page under {kr}"),
  e("rename_card", "Rename a card", "Rename {kr} to Activation in a week"),
  e("remove_card", "Remove a card", "Remove {kr}")
], v = (a, t, n, s, d, i, o, r, l, c, f) => ({
  id: a,
  group: t,
  name: n,
  line: s,
  synonyms: d,
  build: { kind: "nest", sample: i },
  addSay: [c, c + " about {topic}"],
  ...u(l),
  limits: [f, p[0]],
  loop: { src: "/library/" + a + ".svg", alt: n + ": " + r.join(" "), caption: o, steps: r },
  multiPerSlate: !0
}), m = (a) => /^pros/i.test(a) ? "" : /^[aeiou]/i.test(a) ? "an " : "a ", g = [
  h(
    "now-next-later",
    "plan",
    "Now / Next / Later",
    "Order work loosely; Next holds 3",
    ["roadmap", "plan work", "priorities", "order work", "backlog"],
    "Next holds 3.",
    ["Drag a note into a lane: it becomes a card.", "A full lane dims and says why."],
    { addSay: ["Add a Now / Next / Later board", "Add a Now / Next / Later board about {topic}"] }
  ),
  h(
    "pros-cons",
    "decide",
    "Pros and cons",
    "Weigh one decision: pros, cons, questions",
    ["pro con", "pros cons", "weigh a decision", "decide", "tradeoffs", "trade-offs"],
    "No rules: any card goes in any lane.",
    ["Drag a note in: it becomes a point.", "Drag it out: it is a note again."],
    { addSay: ["Add pros and cons", "Add pros and cons for {topic}"] }
  ),
  h(
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
      e("add_station", "Add a step", "Add Follow-up after {lane}"),
      e("connect_stations", "Connect two steps", "Connect {lane} to {other}"),
      e("move_card", "Move the token", "Move {card} to {other}"),
      e("rename_lane", "Rename a step", "Rename {lane} to Build it")
    ]),
    limits: ["Up to 5 steps on a 3 by 3 grid.", p[0]],
    loop: { src: "/library/decision-path.svg", alt: "Decision path: the token moves only along connected steps.", caption: "Not connected", steps: ["Drag the token along a path.", "A step with no path to it dims."] },
    multiPerSlate: !0
  },
  h(
    "retro",
    "meetings",
    "Retro",
    "Went well, change, try: 3 cards each",
    ["retrospective", "retro", "run a retro", "team meeting", "look back", "lessons"],
    "Try holds 3.",
    ["A note turns into a card and back.", "Each lane holds 3; the fourth is refused."]
  ),
  h(
    "triage",
    "track",
    "Triage",
    "Sort incoming work; Today holds 3",
    ["triage", "inbox", "incoming", "support", "bugs", "sort work", "track work"],
    "Today holds 3.",
    ["A card goes into Today.", "A full Today refuses."],
    { addSay: ["Add a triage board", "Add a triage board about {topic}"] }
  ),
  h(
    "team-board",
    "track",
    "Team board",
    "Your working agreements, enforced: limits, paths, a bin",
    ["kanban", "team board", "working agreements", "wip limit", "to do doing done", "track work", "sprint"],
    "Doing holds 3.",
    ["A full Doing shows 3 of 3 and dims.", "The next card dragged to Doing is refused with that sentence."],
    {
      addSay: ["Add a team board", "Add a team board about {topic}"],
      ...u(y(e("add_rule", "Send cards one way", "From {busy} cards go only to {other}", "path"), [e("add_rule", "Add a bin", "Make {lane} a bin", "bin")]))
    }
  ),
  k(
    "launch-plan",
    "Launch plan",
    "Tasks on real dates toward launch day, with your rules",
    ["launch", "timeline", "gantt", "schedule", "deadline", "release date", "code freeze"],
    "A slip pushes the tasks that wait on it.",
    ["Slide a task: what waits on it follows.", "Past launch it stops."]
  ),
  k(
    "customer-go-live",
    "Customer go-live",
    "Us and the customer, toward one go-live date",
    ["go-live", "onboarding", "implementation", "rollout", "kickoff"],
    "Days are working days: weekends don’t count.",
    ["Slide a task: weekends don’t count.", "Past go-live it stops."],
    "go-live"
  ),
  k(
    "hiring-plan",
    "Hiring plan",
    "Hires over the year, with runway",
    ["hiring", "headcount", "recruiting", "hires", "runway", "burn"],
    "Hires snap to whole weeks.",
    ["Drag a hire later: runway grows.", "Below your floor it stops."],
    "hiring-plan",
    "hiring-plan"
  ),
  b(
    "sort-evidence",
    "decide",
    "Sort the evidence",
    "Pile up what customers said; piles rank as you sort",
    ["affinity", "synthesis", "interviews", "research", "feedback", "themes", "feature requests", "cluster"],
    "sort-evidence",
    "Piles rank by number of customers.",
    ["Drag a note to another pile: the counts change and the piles re-rank.", "Let go in empty space: a new pile."],
    w(!0, [])
  ),
  b(
    "discovery-tree",
    "decide",
    "Discovery tree",
    "Outcome, opportunities, solutions: what to build next",
    ["opportunity solution tree", "discovery", "outcome", "what to build", "product discovery", "opportunities"],
    "discovery-tree",
    "Solutions sit under an opportunity.",
    ["Drag a solution under the outcome: refused, in the rule’s words.", "Say “Let solutions sit under the outcome for now”: it lands."],
    w(!1, [
      e("add_rule", "Let a card sit elsewhere", "Let solutions sit under the outcome for now", "nests"),
      e("set_rule", "Warn instead of blocking", "Warn instead of blocking", "nests"),
      e("add_rule", "Cap an opportunity", "An opportunity holds at most 2 solutions", "children"),
      e("add_card", "Add a solution", "Add a solution called Sample data under {opportunity}")
    ])
  ),
  b(
    "break-down-problem",
    "decide",
    "Break down a problem",
    "Ask why until you reach causes you can act on",
    ["issue tree", "root cause", "5 whys", "five whys", "problem", "why", "diagnose"],
    "break-down",
    "Actions sit under a cause (a warning only).",
    ["Drag a cause under another: why, once more.", "An action off a cause is flagged, never refused."],
    w(!1, A)
  ),
  b(
    "incident-review",
    "meetings",
    "Incident review",
    "What broke, why, and what to fix",
    ["incident", "postmortem", "post-mortem", "outage", "retro", "root cause"],
    "incident-review",
    "Actions sit under a cause (a warning only).",
    ["Drag a cause under the incident.", "An action off a cause is flagged."],
    w(!1, A)
  ),
  v(
    "impact-effort",
    "decide",
    "Impact × effort",
    "Score ideas on two axes; Do now holds 3",
    ["2x2", "impact effort", "prioritise", "prioritize", "quick wins", "grooming", "bets", "value effort", "matrix"],
    "impact-effort",
    "Do now holds 3.",
    ["Drag an idea across the square: its scores follow.", "A fourth into Do now is refused, naming the weakest there."],
    C,
    "Add an impact × effort board",
    "Up to 40 cards, scored 0 to 10. On a phone it is a 358 px square."
  ),
  v(
    "reorg-sandbox",
    "plan",
    "Reorg & hiring sandbox",
    "Try who reports to whom before you announce it",
    ["org chart", "reorg", "reporting lines", "team structure", "span of control", "managers", "headcount", "hiring"],
    "reorg",
    "Open roles don’t manage.",
    ["Drag a manager: the whole team comes along.", "Under an open role it is refused."],
    W,
    "Add a reorg & hiring sandbox",
    "Up to 40 people. Roles and yes/no fields only, never salaries. Paste a list of name, role, manager to fill it. On a phone it is an outline; move people by chat."
  ),
  v(
    "goals-owners",
    "plan",
    "Goals & owners",
    "Objectives, key results and the teams that own them",
    ["okr", "okrs", "goals", "objectives", "key results", "quarterly planning", "ownership", "owners"],
    "goals",
    "A card is owned by the team that owns what it sits under (a warning only).",
    ["Drop a key result on another team.", "It lands, flagged cross-team."],
    N,
    "Add a goals & owners board",
    "Up to 40 cards and 8 teams. On a phone it is an outline; change teams by chat."
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
      e("move_card", "Carry a deal on", "Move {card} to {other}"),
      e("set_amount", "Price a deal", "Make {card} $40k"),
      e("set_target", "Set the target", "Set the target to $300k"),
      e("add_card", "Add a deal", "Add a deal called Initech to {lane}"),
      e("add_rule", "Ask for an amount", "{lane} needs an amount", "gate"),
      e("add_rule", "Limit a stage", "Let {busy} hold 1", "capacity")
    ]),
    limits: ["Up to 16 deals.", p[0]],
    loop: { src: "/library/sales-pipeline.svg", alt: "Sales pipeline: carry a deal on; stages it cannot skip dim; the forecast moves.", caption: "Proposal holds 3.", steps: ["Carry a deal to the next stage.", "A full stage refuses."] },
    multiPerSlate: !0
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
      e("shift_budget", "Move money between teams", "Move $10k from {lane} to {other}"),
      e("set_amount", "Price a line item", "Make {card} $20k"),
      e("add_card", "Add a line item", "Add a line item called Events for $10k to {lane}")
    ]),
    limits: ["The total stays fixed.", p[0]],
    loop: { src: "/library/budget.svg", alt: "Budget: move money between teams; the total stays fixed.", caption: "The total stays fixed.", steps: ["Move a divider between teams.", "The total stays the same."] },
    multiPerSlate: !0
  }
];
function R(a) {
  return g.find((t) => t.id === a);
}
function U(a = "all") {
  return g.filter((t) => a === "all" || t.group === a);
}
function $(a, t, n = {}) {
  const s = R(a);
  if (!s) throw new Error("There is nothing called " + a + " in the library.");
  const d = (o) => {
    const r = typeof t == "string" ? t.replace(/\s+/g, " ").trim().slice(0, 100) : "";
    return (r ? o + ": " + r : o).slice(0, 120);
  };
  if (s.build.sample) {
    const o = n[s.build.sample];
    if (!o) throw new Error("Load slateboxjs/workshops/rules before adding a " + s.name.toLowerCase() + ".");
    const r = o();
    return { ...r, title: t ? d(s.name) : r.title };
  }
  if (s.build.kind === "map") return { ...P(), title: d("Decision path") };
  const i = L[a];
  return {
    version: 1,
    title: d(i.title),
    lanes: i.lanes.map((o) => ({ ...o })),
    cards: [],
    behaviour: { version: 1, rev: 0, rules: (i.rules ?? []).map((o, r) => ({ id: "rule-" + (r + 1), on: !0, severity: "refuse", set: D(), ...o })) }
  };
}
const _ = (a) => a.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9/ ]+/g, " ").replace(/\s+/g, " ").trim();
function B(a) {
  if (typeof a != "string" || a.length > 300) return null;
  const t = a.trim().replace(/[.!]+$/, ""), n = /^(?:please\s+)?(?:add|start|set up|make|create|open)\s+(?:(?:a|an|the|some|our|my)\s+)?(?:new\s+)?/i.exec(t);
  if (!n) return null;
  const s = t.slice(n[0].length);
  for (const d of [...g].sort((i, o) => o.name.length - i.name.length)) {
    const i = [d.name, ...d.addSay.map((o) => o.replace(/^Add (?:an? )?/i, "").replace(/ (?:about|for) \{topic\}$/, ""))];
    for (const o of i) {
      const r = o.toLowerCase().replace(/\s*\/\s*/g, "\\s*/?\\s*").replace(/ /g, "\\s+"), l = new RegExp("^" + r + "(?:\\s+(?:board|component))?(?:\\s+(?:about|for|on)\\s+(.+))?$", "i").exec(s);
      if (l)
        return l[1] && /[:;,→]|->|\$|\d\s*(?:k|m|%)\b|\d{3,}/i.test(l[1]) ? null : l[1] ? { id: d.id, topic: l[1].trim() } : { id: d.id };
    }
  }
  return null;
}
function E(a) {
  const t = _(a);
  if (!t || t.length > 200) return null;
  if (/^(?:what|which)\s+(?:can|could)\s+(?:i|we|you)\s+(?:add|make|build|put)\b|^(?:show|list|browse)\s+(?:me\s+)?(?:the\s+)?(?:library|components|boards|everything)|^what\s+(?:is|s)\s+in\s+the\s+library/.test(t))
    return { all: !0, entries: g.map((o) => o.id) };
  const n = "(?:a |an |some |any )?(?:board|template|component|tool|way|something|anything|starter|preset)s? (?:to|for|that)\\b", s = new RegExp("^(?:(?:something|anything) (?:to|for)\\b|(?:a|an|any) " + n + "|(?:i|we) (?:want|need|would like|d like) " + n + "|(?:is there|do you have|have you got) " + n + "|help (?:me|us) (?:pick|choose|find) " + n + "|how (?:do|can|could|should) (?:i|we) (?:run|track|plan|weigh|prioriti[sz]e|sort|triage|budget|organi[sz]e|decide)\\b)").exec(t);
  if (!s || /\b(?:draw|diagram|chart|flowchart|sketch|mind map)\b/.test(t)) return null;
  const d = new Set(t.slice(s[0].length).split(" ").filter((o) => o.length > 2 && !["the", "and", "for", "our", "with"].includes(o))), i = g.map((o) => {
    const r = [o.name, o.line, ...o.synonyms].map(_).join(" ");
    let l = 0;
    for (const c of d) (r.includes(c) || r.includes(c.replace(/s$/, ""))) && (l += o.synonyms.some((f) => _(f).includes(c.replace(/s$/, ""))) ? 2 : 1);
    return { id: o.id, score: l };
  }).filter((o) => o.score > 0).sort((o, r) => r.score - o.score);
  return i.length ? { all: !1, entries: i.slice(0, 3).map((o) => o.id) } : null;
}
const S = 8;
function j(a, t) {
  return R(a) ? t.many ? (t.boards ?? (t.hasBoard ? 1 : 0)) >= S ? { ok: !1, reason: `This slate holds ${S} boards, the most for now. Add it on a new slate?` } : { ok: !0 } : t.hasBoard ? { ok: !1, reason: "This slate already has a board, so this opens on a new slate." } : { ok: !0 } : { ok: !1, reason: "That is not in the library." };
}
export {
  g as catalog,
  B as catalogAddRequest,
  R as catalogEntry,
  j as catalogFits,
  O as catalogGroups,
  U as catalogList,
  E as catalogMatch,
  $ as catalogPreset,
  q as catalogVersion,
  S as maxBoardsPerSlate
};
