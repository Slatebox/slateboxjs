const O = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function R(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: r, fieldNote: l, deskNote: d, fallback: i } = e, s = (a) => typeof a == "string" && a.trim().length > 0 && a.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(a);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !s(l) || !s(d) || !s(i) ? null : { kind: n, version: o, stage: t, choice: r, fieldNote: l.trim(), deskNote: d.trim(), fallback: i.trim() };
}
function F(e) {
  return { ...e, stage: "review", choice: null };
}
function W(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function z(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const g = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function G(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: r, rightLabel: l } = e, d = (i) => typeof i == "string" && i.trim().length > 0 && i.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(i);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !d(r) || !d(l) ? null : { kind: n, version: o, mix: t, leftLabel: r.trim(), rightLabel: l.trim() };
}
function U({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === g.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === g.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === g.leftLabel && o === g.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function b(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function P(e) {
  const n = new Map(e.cards.map((d) => [d.id, d])), o = new Map(e.lanes.map((d, i) => [d.id, i])), t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function l(d) {
    if (!t.has(d.id)) {
      if (r.has(d.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(d.id);
      for (const i of d.dependsOn ?? []) {
        const s = n.get(i);
        if (!s) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(s.laneId) > o.get(d.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        l(s);
      }
      r.delete(d.id), t.add(d.id);
    }
  }
  for (const d of e.cards) l(d);
  for (const d of e.lanes) {
    if (d.station) throw new Error("Release windows cannot also be map stations.");
    if (b(e, d.id) > (d.capacity ?? 1 / 0)) throw new Error(`Release "${d.label}" exceeds its point budget.`);
  }
}
function I(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((f, h) => [f.id, h])), r = t.get(o);
  if (r === void 0) return null;
  const l = r < t.get(n.laneId), d = /* @__PURE__ */ new Set([n.id]), i = [n];
  for (; i.length; ) {
    const f = i.pop();
    for (const h of e.cards) {
      if (d.has(h.id)) continue;
      const p = t.get(h.laneId);
      (l ? p > r && f.dependsOn?.includes(h.id) : p < r && h.dependsOn?.includes(f.id)) && (d.add(h.id), i.push(h));
    }
  }
  if (e.cards.filter((f) => d.has(f.id)).some((f) => f.allowedLaneIds && !f.allowedLaneIds.includes(o))) return null;
  const a = { ...e, cards: e.cards.map((f) => d.has(f.id) ? { ...f, laneId: o } : f) }, c = e.lanes[r].capacity;
  return c !== void 0 && b(a, o) > c ? null : a;
}
const $ = {
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
}, j = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function D(e) {
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
    const d = /* @__PURE__ */ new Set([l.id]);
    let i = l.after;
    for (; i !== null; ) {
      if (d.has(i) || !t.has(i) || r.includes(l.id) && !r.includes(i)) return null;
      d.add(i), i = t.get(i).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: r };
}
function M(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function H(e, n) {
  return M(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const E = ["firstPrint", "secondPrint", "thirdPrint"], x = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function q(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...x, route: n.route };
  for (const t of E) {
    const r = n[t];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = r.trim();
  }
  return o;
}
function B(e = new URLSearchParams()) {
  const n = { ...x };
  for (const t of E) {
    const r = e.get(t)?.trim();
    r && r.length <= 48 && (n[t] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function J(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function y(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function k(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function w(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function m(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function v(e) {
  const n = y(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = k(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > 5)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length < 1 || n.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const r = n.lanes.map((i) => {
    const s = y(i), a = { id: w(s.id), label: k(s.label) };
    if (s.capacity !== void 0) {
      const c = o ? 576 : 24;
      if (typeof s.capacity != "number" || !Number.isInteger(s.capacity) || s.capacity < 1 || s.capacity > c)
        throw new Error(`Lane capacity must be a whole number from 1 to ${c}.`);
      a.capacity = s.capacity;
    }
    if (s.station !== void 0) {
      const c = y(s.station), f = (p) => {
        if (typeof p != "number" || !Number.isInteger(p) || p < 0 || p > 2)
          throw new Error("Use map coordinates from 0 to 2.");
        return p;
      };
      if (!Array.isArray(c.next) || c.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const h = c.next.map(w);
      m(h, "onward stop"), a.station = { column: f(c.column), row: f(c.row), next: h, outcome: k(c.outcome, 160) };
    }
    return a;
  }), l = r.map((i) => i.id);
  if (m(l, "lane ID"), r.some((i) => i.station)) {
    if (!r.every((i) => i.station)) throw new Error("Give every station on the map a position.");
    m(r.map((i) => i.station.column + "," + i.station.row), "map position");
    for (const i of r)
      if (i.station.next.some((s) => s === i.id || !l.includes(s))) throw new Error("Connect each stop to another station on this map.");
  }
  const d = n.cards.map((i) => {
    const s = y(i), a = { id: w(s.id), label: k(s.label), laneId: w(s.laneId) };
    if (!l.includes(a.laneId)) throw new Error("Card refers to an unknown lane.");
    if (s.allowedLaneIds !== void 0) {
      if (!Array.isArray(s.allowedLaneIds) || s.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (a.allowedLaneIds = s.allowedLaneIds.map(w), m(a.allowedLaneIds, "allowed lane"), !a.allowedLaneIds.includes(a.laneId) || !a.allowedLaneIds.every((c) => l.includes(c)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (o) {
      if (typeof s.points != "number" || !Number.isInteger(s.points) || s.points < 1 || s.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (a.points = s.points, s.dependsOn !== void 0) {
        if (!Array.isArray(s.dependsOn) || s.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        a.dependsOn = s.dependsOn.map(w), m(a.dependsOn, "dependency");
      }
    }
    return a;
  });
  if (m(d.map((i) => i.id), "card ID"), o) {
    const i = { version: 1, kind: "release-plan", title: t, lanes: r, cards: d };
    return P(i), i;
  }
  for (const i of r)
    if (d.filter((s) => s.laneId === i.id).length > (i.capacity ?? 1 / 0))
      throw new Error(`Lane "${i.label}" exceeds its capacity.`);
  return { version: 1, title: t, lanes: r, cards: d };
}
const L = 65536;
function V(e) {
  const n = JSON.stringify(v(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > L) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function Y(e) {
  if (e.length > L) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return v(t);
}
function N(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => I(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((r) => r.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function Z(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  if (t && e.kind === "release-plan") {
    const r = I(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !N(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
const A = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, T = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function C(e) {
  const { pitch: n, row: o, top: t } = A, r = !!e.lanes[0].station, l = e.lanes.map((s) => e.cards.filter((a) => a.laneId === s.id).length), d = t + Math.max(1, ...l) * o + 36, i = e.lanes.map((s, a) => ({
    x: r ? s.station.column * (n + 28) : a * n,
    y: r ? s.station.row * d : 0
  }));
  return {
    points: i,
    width: Math.max(...i.map((s) => s.x)) + n,
    height: Math.max(...i.map((s, a) => s.y + t + (r ? Math.max(1, l[a]) : l[a] + 1) * o))
  };
}
const _ = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
};
function K(e) {
  const n = v(e), { width: o, row: t, height: r, top: l } = A, d = [];
  function i(a, c, f, h, p, u) {
    d.push({ options: {
      id: a,
      text: c,
      name: c,
      xPos: f,
      yPos: h,
      width: o,
      height: p,
      shapeHint: "rectangle",
      backgroundColor: u,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: s } = C(n);
  n.lanes.forEach((a, c) => {
    const { x: f, y: h } = s[c], p = n.kind === "release-plan" ? a.label + `
` + (a.capacity ? b(n, a.id) + " / " + a.capacity + " points" : b(n, a.id) + " points") : a.label;
    i("lane-" + a.id, p, f, h, l - 12, T[c]), n.cards.filter((u) => u.laneId === a.id).forEach((u, S) => i("card-" + u.id, n.kind === "release-plan" ? u.label + `
` + u.points + " points" : u.label, f, h + l + S * t, r, "#fffdf6"));
  });
  for (const a of n.lanes) {
    if (!a.station) continue;
    const c = d.find((f) => f.options.id === "lane-" + a.id);
    c.relationships.associations = a.station.next.map((f) => ({ id: a.id + "-to-" + f, parentId: c.options.id, childId: "lane-" + f, lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), c.options.text = a.label + `
` + a.station.outcome, c.options.fontSize = 13;
  }
  if (n.kind === "release-plan") {
    const a = new Map(d.map((c) => [c.options.id, c]));
    for (const c of n.cards)
      for (const f of c.dependsOn ?? []) {
        const h = "card-" + f, p = "card-" + c.id;
        a.get(h).relationships.associations.push({
          id: `dependency-${f.length}-${f}-${c.id}`,
          parentId: h,
          childId: p,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: n.title }, shareId: "", nodes: d };
}
const Q = {
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
};
export {
  N as availableLanes,
  M as canHangPanel,
  Y as decodeWorkshopFragment,
  J as describeFocusDarkroom,
  V as encodeWorkshopFragment,
  z as handoffSummary,
  H as hangGalleryPanel,
  Q as industrialWorkshop,
  B as initialFocusDarkroom,
  T as laneColors,
  g as listeningRoom,
  U as listeningRoomCaption,
  j as moonGallery,
  Z as moveWorkshopCard,
  _ as nightTransfer,
  q as normalizeFocusDarkroom,
  G as normalizeListeningRoom,
  D as normalizeMoonGallery,
  R as normalizeOfflineHandoff,
  O as offlineHandoff,
  E as printFields,
  b as releaseLoad,
  $ as releasePlan,
  W as resolveHandoff,
  F as reviewHandoff,
  v as validateWorkshop,
  A as workshopLayout,
  C as workshopPositions,
  K as workshopToSlate
};
