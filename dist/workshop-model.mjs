const R = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function F(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: r, stage: o, choice: i, fieldNote: a, deskNote: s, fallback: f } = e, c = (t) => typeof t == "string" && t.trim().length > 0 && t.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(t);
  return n !== "offline-handoff" || r !== 1 || o !== "queued" && o !== "review" && o !== "resolved" || (o === "resolved" ? i !== "field" && i !== "desk" : i !== null) || i === void 0 || !c(a) || !c(s) || !c(f) ? null : { kind: n, version: r, stage: o, choice: i, fieldNote: a.trim(), deskNote: s.trim(), fallback: f.trim() };
}
function W(e) {
  return { ...e, stage: "review", choice: null };
}
function z(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function G(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const g = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function U(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: r, mix: o, leftLabel: i, rightLabel: a } = e, s = (f) => typeof f == "string" && f.trim().length > 0 && f.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(f);
  return n !== "listening-room" || r !== 1 || typeof o != "number" || !Number.isFinite(o) || o < 0 || o > 1 || !s(i) || !s(a) ? null : { kind: n, version: r, mix: o, leftLabel: i.trim(), rightLabel: a.trim() };
}
function $({ mix: e, leftLabel: n, rightLabel: r }) {
  return e < 0.32 ? n === g.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? r === g.rightLabel ? "Glass chimes ring, then fade." : "You hear " + r + "." : n === g.leftLabel && r === g.rightLabel ? "Rain and glass chimes overlap." : n + " and " + r + " overlap.";
}
function b(e, n) {
  return e.cards.reduce((r, o) => r + (o.laneId === n ? o.points ?? 1 : 0), 0);
}
function S(e) {
  const n = new Map(e.cards.map((s) => [s.id, s])), r = new Map(e.lanes.map((s, f) => [s.id, f])), o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  function a(s) {
    if (!o.has(s.id)) {
      if (i.has(s.id)) throw new Error("Release dependencies must be acyclic.");
      i.add(s.id);
      for (const f of s.dependsOn ?? []) {
        const c = n.get(f);
        if (!c) throw new Error("A release dependency refers to an unknown feature.");
        if (r.get(c.laneId) > r.get(s.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        a(c);
      }
      i.delete(s.id), o.add(s.id);
    }
  }
  for (const s of e.cards) a(s);
  for (const s of e.lanes) {
    if (s.station) throw new Error("Release windows cannot also be map stations.");
    if (b(e, s.id) > (s.capacity ?? 1 / 0)) throw new Error(`Release "${s.label}" exceeds its point budget.`);
  }
}
function I(e, n, r) {
  if (r === n.laneId) return e;
  const o = new Map(e.lanes.map((d, h) => [d.id, h])), i = o.get(r);
  if (i === void 0) return null;
  const a = i < o.get(n.laneId), s = /* @__PURE__ */ new Set([n.id]), f = [n];
  for (; f.length; ) {
    const d = f.pop();
    for (const h of e.cards) {
      if (s.has(h.id)) continue;
      const p = o.get(h.laneId);
      (a ? p > i && d.dependsOn?.includes(h.id) : p < i && h.dependsOn?.includes(d.id)) && (s.add(h.id), f.push(h));
    }
  }
  if (e.cards.filter((d) => s.has(d.id)).some((d) => d.allowedLaneIds && !d.allowedLaneIds.includes(r))) return null;
  const t = { ...e, cards: e.cards.map((d) => s.has(d.id) ? { ...d, laneId: r } : d) }, l = e.lanes[i].capacity;
  return l !== void 0 && b(t, r) > l ? null : t;
}
const D = {
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
function H(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const r = [];
  for (const a of n.panels) {
    if (!a || typeof a.id != "string" || !/^[a-z][\w-]{0,31}$/.test(a.id) || typeof a.label != "string" || !a.label.trim() || a.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(a.artwork) || !(a.after === null || typeof a.after == "string")) return null;
    r.push({ id: a.id, label: a.label.trim(), artwork: a.artwork, after: a.after });
  }
  const o = new Map(r.map((a) => [a.id, a])), i = [...new Set(n.hung)];
  if (o.size !== r.length || i.length !== n.hung.length || i.some((a) => !o.has(a))) return null;
  for (const a of r) {
    const s = /* @__PURE__ */ new Set([a.id]);
    let f = a.after;
    for (; f !== null; ) {
      if (s.has(f) || !o.has(f) || i.includes(a.id) && !i.includes(f)) return null;
      s.add(f), f = o.get(f).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: r, hung: i };
}
function M(e, n) {
  const r = e.panels.find((o) => o.id === n);
  return !!r && !e.hung.includes(n) && (r.after === null || e.hung.includes(r.after));
}
function q(e, n) {
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
function B(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const r = { ...x, route: n.route };
  for (const o of E) {
    const i = n[o];
    if (typeof i != "string" || !i.trim() || i.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    r[o] = i.trim();
  }
  return r;
}
function J(e = new URLSearchParams()) {
  const n = { ...x };
  for (const o of E) {
    const i = e.get(o)?.trim();
    i && i.length <= 48 && (n[o] = i);
  }
  const r = e.get("route");
  return (r === "start" || r === "opener") && (n.route = r), n;
}
function V(e) {
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
function N({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (r) => {
    const o = e.find((i) => i.id === r);
    if (!o) throw new Error("Presentation order refers to an unknown lane.");
    return o;
  });
}
function v(e) {
  const n = y(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const r = n.kind === "release-plan", o = k(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > 5)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length < 1 || n.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const i = n.lanes.map((c) => {
    const t = y(c), l = { id: w(t.id), label: k(t.label) };
    if (t.capacity !== void 0) {
      const d = r ? 576 : 24;
      if (typeof t.capacity != "number" || !Number.isInteger(t.capacity) || t.capacity < 1 || t.capacity > d)
        throw new Error(`Lane capacity must be a whole number from 1 to ${d}.`);
      l.capacity = t.capacity;
    }
    if (t.station !== void 0) {
      const d = y(t.station), h = (u) => {
        if (typeof u != "number" || !Number.isInteger(u) || u < 0 || u > 2)
          throw new Error("Use map coordinates from 0 to 2.");
        return u;
      };
      if (!Array.isArray(d.next) || d.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const p = d.next.map(w);
      m(p, "onward stop"), l.station = { column: h(d.column), row: h(d.row), next: p, outcome: k(d.outcome, 160) };
    }
    return l;
  }), a = i.map((c) => c.id);
  if (m(a, "lane ID"), i.some((c) => c.station)) {
    if (!i.every((c) => c.station)) throw new Error("Give every station on the map a position.");
    m(i.map((c) => c.station.column + "," + c.station.row), "map position");
    for (const c of i)
      if (c.station.next.some((t) => t === c.id || !a.includes(t))) throw new Error("Connect each stop to another station on this map.");
  }
  const s = n.cards.map((c) => {
    const t = y(c), l = { id: w(t.id), label: k(t.label), laneId: w(t.laneId) };
    if (!a.includes(l.laneId)) throw new Error("Card refers to an unknown lane.");
    if (t.allowedLaneIds !== void 0) {
      if (!Array.isArray(t.allowedLaneIds) || t.allowedLaneIds.length > i.length) throw new Error("Invalid allowed lanes.");
      if (l.allowedLaneIds = t.allowedLaneIds.map(w), m(l.allowedLaneIds, "allowed lane"), !l.allowedLaneIds.includes(l.laneId) || !l.allowedLaneIds.every((d) => a.includes(d)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (r) {
      if (typeof t.points != "number" || !Number.isInteger(t.points) || t.points < 1 || t.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (l.points = t.points, t.dependsOn !== void 0) {
        if (!Array.isArray(t.dependsOn) || t.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        l.dependsOn = t.dependsOn.map(w), m(l.dependsOn, "dependency");
      }
    }
    return l;
  });
  m(s.map((c) => c.id), "card ID");
  const f = { version: 1, title: o, lanes: i, cards: s };
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    f.presentationOrder = N({ lanes: i, presentationOrder: n.presentationOrder }).map((c) => c.id);
  }
  if (r)
    return f.kind = "release-plan", S(f), f;
  for (const c of i)
    if (s.filter((t) => t.laneId === c.id).length > (c.capacity ?? 1 / 0))
      throw new Error(`Lane "${c.label}" exceeds its capacity.`);
  return f;
}
const L = 65536;
function Y(e) {
  const n = JSON.stringify(v(e)), r = "#" + new URLSearchParams({ model: n }).toString();
  if (r.length > L) throw new Error("This workshop is too large to open from a link.");
  return r;
}
function Z(e) {
  if (e.length > L) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), r = n.get("model");
  if (!e.startsWith("#") || !r || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let o;
  try {
    o = JSON.parse(r);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return v(o);
}
function O(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((o) => I(e, n, o.id) !== null);
  const r = e.lanes.find((o) => o.id === n.laneId)?.station;
  return e.lanes.filter((o) => o.id === n.laneId || (!r || r.next.includes(o.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(o.id)) && e.cards.filter((i) => i.laneId === o.id).length < (o.capacity ?? 1 / 0));
}
function _(e, n, r) {
  const o = e.cards.find((i) => i.id === n);
  if (o && e.kind === "release-plan") {
    const i = I(e, o, r);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!o || !O(e, o).some((i) => i.id === r)) throw new Error("Move is unavailable.");
  return o.laneId === r ? e : { ...e, cards: e.cards.map((i) => i === o ? { ...o, laneId: r } : i) };
}
const A = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, T = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function C(e, n = A) {
  const { pitch: r, row: o, top: i } = n, a = !!e.lanes[0].station, s = e.lanes.map((t) => e.cards.filter((l) => l.laneId === t.id).length), f = i + Math.max(1, ...s) * o + 36, c = e.lanes.map((t, l) => ({
    x: a ? t.station.column * (r + 28) : l * r,
    y: a ? t.station.row * f : 0
  }));
  return {
    points: c,
    width: Math.max(...c.map((t) => t.x)) + r,
    height: Math.max(...c.map((t, l) => t.y + i + (a ? Math.max(1, s[l]) : s[l] + 1) * o))
  };
}
const K = {
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
function Q(e) {
  const n = v(e), { width: r, row: o, height: i, top: a } = A, s = [];
  function f(t, l, d, h, p, u) {
    s.push({ options: {
      id: t,
      text: l,
      name: l,
      xPos: d,
      yPos: h,
      width: r,
      height: p,
      shapeHint: "rectangle",
      backgroundColor: u,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: c } = C(n);
  n.lanes.forEach((t, l) => {
    const { x: d, y: h } = c[l], p = n.kind === "release-plan" ? t.label + `
` + (t.capacity ? b(n, t.id) + " / " + t.capacity + " points" : b(n, t.id) + " points") : t.label;
    f("lane-" + t.id, p, d, h, a - 12, T[l]), n.cards.filter((u) => u.laneId === t.id).forEach((u, P) => f("card-" + u.id, n.kind === "release-plan" ? u.label + `
` + u.points + " points" : u.label, d, h + a + P * o, i, "#fffdf6"));
  });
  for (const t of n.lanes) {
    if (!t.station) continue;
    const l = s.find((d) => d.options.id === "lane-" + t.id);
    l.relationships.associations = t.station.next.map((d) => ({ id: t.id + "-to-" + d, parentId: l.options.id, childId: "lane-" + d, lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), l.options.text = t.label + `
` + t.station.outcome, l.options.fontSize = 13;
  }
  if (n.kind === "release-plan") {
    const t = new Map(s.map((l) => [l.options.id, l]));
    for (const l of n.cards)
      for (const d of l.dependsOn ?? []) {
        const h = "card-" + d, p = "card-" + l.id;
        t.get(h).relationships.associations.push({
          id: `dependency-${d.length}-${d}-${l.id}`,
          parentId: h,
          childId: p,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: n.title }, shareId: "", nodes: s };
}
const X = {
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
  O as availableLanes,
  M as canHangPanel,
  Z as decodeWorkshopFragment,
  V as describeFocusDarkroom,
  Y as encodeWorkshopFragment,
  G as handoffSummary,
  q as hangGalleryPanel,
  X as industrialWorkshop,
  J as initialFocusDarkroom,
  T as laneColors,
  g as listeningRoom,
  $ as listeningRoomCaption,
  j as moonGallery,
  _ as moveWorkshopCard,
  K as nightTransfer,
  B as normalizeFocusDarkroom,
  U as normalizeListeningRoom,
  H as normalizeMoonGallery,
  F as normalizeOfflineHandoff,
  R as offlineHandoff,
  E as printFields,
  b as releaseLoad,
  D as releasePlan,
  z as resolveHandoff,
  W as reviewHandoff,
  v as validateWorkshop,
  A as workshopLayout,
  C as workshopPositions,
  N as workshopPresentationLanes,
  Q as workshopToSlate
};
