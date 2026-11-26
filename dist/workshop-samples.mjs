import { planSamples as p } from "./workshop-rules.mjs";
import { gridSamples as u } from "./workshop-grid.mjs";
import { orderKeys as m } from "./workshop-nest.mjs";
function r(e, t, o) {
  const i = m(t.length);
  return t.map(([l, s, d], c) => ({ id: l, label: s, laneId: e, order: i[c], ...o && { parentId: o }, ...d }));
}
const a = (e) => ({
  version: 1,
  rev: 0,
  rules: e.map((t, o) => ({ id: "rule-" + (o + 1), on: !0, severity: "refuse", set: { by: "Slatebox", at: "2026-11-21T00:00:00.000Z", via: "preset" }, ...t }))
});
function g() {
  const e = (t, o) => ({ role: "note", source: t, fields: { arr: o } });
  return {
    version: 1,
    kind: "nest",
    title: "Sort the evidence",
    nest: { layout: "clusters", fields: [{ id: "arr", label: "ARR", currency: "$" }] },
    lanes: [{ id: "piles", label: "Piles" }, { id: "unsorted", label: "Unsorted" }],
    cards: [
      ...r("piles", [["onboarding", "Onboarding", { role: "pile" }], ["reporting", "Reporting", { role: "pile" }], ["pricing", "Pricing", { role: "pile" }]]),
      ...r("piles", [
        ["setup-days", "Setup took two days", e("Acme", 24e3)],
        ["where-start", "Didn’t know where to start", e("Globex", 36e3)],
        ["invites", "Invite flow is confusing", e("Initech", 12e3)]
      ], "onboarding"),
      ...r("piles", [["csv-export", "Couldn’t find CSV export", e("Acme", 24e3)], ["finance-match", "Charts don’t match finance", e("Umbrella", 6e4)]], "reporting"),
      ...r("piles", [["seats", "Seats are too expensive", e("Initech", 12e3)], ["annual", "Want annual billing", e("Hooli", 3e4)]], "pricing"),
      ...r("unsorted", [["trust", "I don’t trust the numbers", e("Umbrella", 6e4)], ["mobile", "Mobile app please", e("Hooli", 3e4)]])
    ],
    behaviour: a([{ kind: "nests", role: "note", under: ["pile"] }, { kind: "depth", max: 1 }, { kind: "rank", by: "sources" }, { kind: "emptyDrop", drop: "new-pile" }])
  };
}
function b() {
  return {
    version: 1,
    kind: "nest",
    title: "Discovery tree",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "Discovery tree" }, { id: "parked", label: "Parked ideas" }],
    cards: [
      ...r("tree", [["outcome", "Activation to 40%", { role: "outcome" }]]),
      ...r("tree", [
        ["slow-onboarding", "Onboarding is slow", { role: "opportunity" }],
        ["data-trust", "Data trust", { role: "opportunity" }],
        ["sharing", "Hard to share results", { role: "opportunity" }]
      ], "outcome"),
      ...r("tree", [["guided-setup", "Guided setup", { role: "solution" }], ["csv-import", "CSV import", { role: "solution" }]], "slow-onboarding"),
      ...r("tree", [["reconcile", "Reconcile with finance", { role: "solution" }]], "data-trust"),
      ...r("parked", [["templates", "Templates gallery", { role: "solution" }], ["digest", "Slack digest", { role: "solution" }]])
    ],
    behaviour: a([
      { kind: "nests", role: "opportunity", under: ["outcome"] },
      { kind: "nests", role: "solution", under: ["opportunity"] },
      { kind: "depth", max: 3 },
      { kind: "children", role: "opportunity", max: 4 }
    ])
  };
}
const n = () => a([{ kind: "nests", role: "action", under: ["cause"], severity: "warn" }, { kind: "depth", max: 6, severity: "warn" }]);
function f() {
  return {
    version: 1,
    kind: "nest",
    title: "Break down a problem",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "The problem" }, { id: "parked", label: "Ideas to place" }],
    cards: [
      ...r("tree", [["problem", "Churn rose in Q3", { role: "problem" }]]),
      ...r("tree", [
        ["drop-off", "Onboarding drop-off", { role: "cause" }],
        ["price-rise", "Price rise in July", { role: "cause" }],
        ["free-tier", "A competitor’s free tier", { role: "cause" }]
      ], "problem"),
      ...r("tree", [["needs-engineer", "Setup needs an engineer", { role: "cause" }]], "drop-off"),
      ...r("tree", [["guided", "Ship guided setup", { role: "action" }]], "needs-engineer"),
      ...r("parked", [["survey", "Survey churned accounts", { role: "action" }]])
    ],
    behaviour: n()
  };
}
function v() {
  return {
    version: 1,
    kind: "nest",
    title: "Incident review",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "The incident" }, { id: "parked", label: "Not placed yet" }],
    cards: [
      ...r("tree", [["outage", "Sign-in outage, 14 Nov", { role: "problem" }]]),
      ...r("tree", [["certificate", "Expired certificate", { role: "cause" }], ["rollback", "Slow rollback", { role: "cause" }]], "outage"),
      ...r("tree", [["alert-inbox", "Renewal alert went to an old inbox", { role: "cause" }]], "certificate"),
      ...r("tree", [["rota-alerts", "Send alerts to the on-call rota", { role: "action" }]], "alert-inbox"),
      ...r("tree", [["script-rollback", "Script the rollback", { role: "action" }]], "rollback"),
      ...r("parked", [["status-page", "Status page went up late", { role: "cause" }]])
    ],
    behaviour: n()
  };
}
function k() {
  const e = (t, o) => ({ fields: { effort: t, impact: o } });
  return {
    version: 1,
    kind: "nest",
    title: "Impact × effort",
    nest: { layout: "matrix", fields: [{ id: "effort", label: "Effort" }, { id: "impact", label: "Impact" }], axes: ["effort", "impact"] },
    lanes: [{ id: "matrix", label: "Impact × effort" }, { id: "unscored", label: "Not scored yet" }],
    cards: [
      ...r("matrix", [
        ["search", "Faster search", e(3, 8)],
        ["sso", "SSO", e(4, 9)],
        ["exports", "Exports", e(2, 6)],
        ["mobile", "Mobile app", e(9, 7)],
        ["summaries", "AI summaries", e(7, 6)],
        ["dark-mode", "Dark mode", e(2, 3)],
        ["billing", "Rewrite billing", e(9, 2)]
      ]),
      ...r("unscored", [["alerts", "Slack alerts"], ["audit", "Audit log"]])
    ],
    behaviour: a([{ kind: "quadrant", quadrant: "do-now", max: 3 }])
  };
}
function h() {
  const e = (t, o = !1) => ({ role: t, ...o && { fields: { contractor: 1 } } });
  return {
    version: 1,
    kind: "nest",
    title: "Reorg & hiring sandbox",
    nest: { layout: "tree", fields: [{ id: "contractor", label: "Contractor", flag: !0 }] },
    lanes: [{ id: "org", label: "Org chart" }, { id: "unplaced", label: "Not placed yet" }],
    cards: [
      ...r("org", [["dana", "Dana Ito, CEO", e("manager")]]),
      ...r("org", [["maya", "Maya Chen, VP Product", e("manager")], ["priya", "Priya Rao, VP Eng", e("manager")], ["vp-sales", "VP Sales", e("open role")]], "dana"),
      ...r("org", [["jo", "Jo Park, Growth", e("manager")]], "maya"),
      ...r("org", [["ravi", "Ravi Shah", e("engineer")], ["lena", "Lena Ortiz", e("designer")], ["sam", "Sam Lee", e("engineer", !0)]], "jo"),
      ...r("org", [["kai", "Kai Wong, Platform", e("manager")]], "priya"),
      ...r("org", [["tom", "Tom Berg", e("engineer")], ["ivy", "Ivy Moss", e("engineer")]], "kai"),
      ...r("unplaced", [["ae-1", "Account exec 1", e("open role")], ["ae-2", "Account exec 2", e("open role")]])
    ],
    behaviour: a([
      { kind: "children", role: "manager", max: 6 },
      { kind: "parent", not: "open role" },
      { kind: "parent", not: "contractor" },
      { kind: "contains", role: "manager", of: "designer", atLeast: 1, severity: "warn" },
      { kind: "depth", max: 5 }
    ])
  };
}
function y() {
  const e = (t, o) => ({ role: t, owner: o });
  return {
    version: 1,
    kind: "nest",
    title: "Goals & owners",
    nest: { layout: "tree", owners: [{ id: "growth", label: "Growth" }, { id: "platform", label: "Platform" }, { id: "sales", label: "Sales" }] },
    lanes: [{ id: "goals", label: "Goals" }, { id: "unplaced", label: "Not placed yet" }],
    cards: [
      ...r("goals", [["activation", "Activation to 40%", e("objective", "growth")], ["uptime", "99.9% uptime", e("objective", "platform")]]),
      ...r("goals", [["fast-onboarding", "Onboarding under 10 min", e("key result", "growth")], ["self-serve", "Self-serve upgrades 30%", e("key result", "growth")]], "activation"),
      ...r("goals", [["guided", "Guided setup", e("initiative", "growth")], ["starters", "Starter templates", e("initiative", "growth")]], "fast-onboarding"),
      ...r("goals", [["pricing-page", "New pricing page", e("initiative", "growth")]], "self-serve"),
      ...r("goals", [["latency", "p95 under 300 ms", e("key result", "platform")]], "uptime"),
      ...r("goals", [["cache", "Cache the hot paths", e("initiative", "platform")]], "latency"),
      ...r("unplaced", [["partners", "Partner channel live", e("key result", "sales")]])
    ],
    behaviour: a([
      { kind: "nests", role: "key result", under: ["objective"] },
      { kind: "nests", role: "initiative", under: ["key result"] },
      { kind: "sameOwnerAs", mode: "warn", severity: "warn" },
      { kind: "depth", max: 3 }
    ])
  };
}
const P = {
  ...p,
  "sort-evidence": g,
  "discovery-tree": b,
  "break-down": f,
  "incident-review": v,
  "impact-effort": k,
  reorg: h,
  goals: y,
  ...u
};
export {
  f as breakDownSample,
  P as catalogSamples,
  b as discoveryTreeSample,
  y as goalsSample,
  k as impactEffortSample,
  v as incidentReviewSample,
  h as reorgSample,
  g as sortEvidenceSample
};
