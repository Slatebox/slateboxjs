const W = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function z(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: r, stage: t, choice: i, fieldNote: a, deskNote: s, fallback: f } = e, c = (o) => typeof o == "string" && o.trim().length > 0 && o.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(o);
  return n !== "offline-handoff" || r !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? i !== "field" && i !== "desk" : i !== null) || i === void 0 || !c(a) || !c(s) || !c(f) ? null : { kind: n, version: r, stage: t, choice: i, fieldNote: a.trim(), deskNote: s.trim(), fallback: f.trim() };
}
function G(e) {
  return { ...e, stage: "review", choice: null };
}
function U(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function $(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const g = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function D(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: r, mix: t, leftLabel: i, rightLabel: a } = e, s = (f) => typeof f == "string" && f.trim().length > 0 && f.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(f);
  return n !== "listening-room" || r !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !s(i) || !s(a) ? null : { kind: n, version: r, mix: t, leftLabel: i.trim(), rightLabel: a.trim() };
}
function j({ mix: e, leftLabel: n, rightLabel: r }) {
  return e < 0.32 ? n === g.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? r === g.rightLabel ? "Glass chimes ring, then fade." : "You hear " + r + "." : n === g.leftLabel && r === g.rightLabel ? "Rain and glass chimes overlap." : n + " and " + r + " overlap.";
}
function I(e, n) {
  return e.cards.reduce((r, t) => r + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function O(e) {
  const n = new Map(e.cards.map((s) => [s.id, s])), r = new Map(e.lanes.map((s, f) => [s.id, f])), t = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  function a(s) {
    if (!t.has(s.id)) {
      if (i.has(s.id)) throw new Error("Release dependencies must be acyclic.");
      i.add(s.id);
      for (const f of s.dependsOn ?? []) {
        const c = n.get(f);
        if (!c) throw new Error("A release dependency refers to an unknown feature.");
        if (r.get(c.laneId) > r.get(s.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        a(c);
      }
      i.delete(s.id), t.add(s.id);
    }
  }
  for (const s of e.cards) a(s);
  for (const s of e.lanes) {
    if (s.station) throw new Error("Release windows cannot also be map stations.");
    if (I(e, s.id) > (s.capacity ?? 1 / 0)) throw new Error(`Release "${s.label}" exceeds its point budget.`);
  }
}
function x(e, n, r) {
  if (r === n.laneId) return e;
  const t = new Map(e.lanes.map((d, h) => [d.id, h])), i = t.get(r);
  if (i === void 0) return null;
  const a = i < t.get(n.laneId), s = /* @__PURE__ */ new Set([n.id]), f = [n];
  for (; f.length; ) {
    const d = f.pop();
    for (const h of e.cards) {
      if (s.has(h.id)) continue;
      const p = t.get(h.laneId);
      (a ? p > i && d.dependsOn?.includes(h.id) : p < i && h.dependsOn?.includes(d.id)) && (s.add(h.id), f.push(h));
    }
  }
  if (e.cards.filter((d) => s.has(d.id)).some((d) => d.allowedLaneIds && !d.allowedLaneIds.includes(r))) return null;
  const o = { ...e, cards: e.cards.map((d) => s.has(d.id) ? { ...d, laneId: r } : d) }, l = e.lanes[i].capacity;
  return l !== void 0 && I(o, r) > l ? null : o;
}
const H = {
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
}, q = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function B(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const r = [];
  for (const a of n.panels) {
    if (!a || typeof a.id != "string" || !/^[a-z][\w-]{0,31}$/.test(a.id) || typeof a.label != "string" || !a.label.trim() || a.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(a.artwork) || !(a.after === null || typeof a.after == "string")) return null;
    r.push({ id: a.id, label: a.label.trim(), artwork: a.artwork, after: a.after });
  }
  const t = new Map(r.map((a) => [a.id, a])), i = [...new Set(n.hung)];
  if (t.size !== r.length || i.length !== n.hung.length || i.some((a) => !t.has(a))) return null;
  for (const a of r) {
    const s = /* @__PURE__ */ new Set([a.id]);
    let f = a.after;
    for (; f !== null; ) {
      if (s.has(f) || !t.has(f) || i.includes(a.id) && !i.includes(f)) return null;
      s.add(f), f = t.get(f).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: r, hung: i };
}
function T(e, n) {
  const r = e.panels.find((t) => t.id === n);
  return !!r && !e.hung.includes(n) && (r.after === null || e.hung.includes(r.after));
}
function J(e, n) {
  return T(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const L = ["firstPrint", "secondPrint", "thirdPrint"], A = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function V(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const r = { ...A, route: n.route };
  for (const t of L) {
    const i = n[t];
    if (typeof i != "string" || !i.trim() || i.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    r[t] = i.trim();
  }
  return r;
}
function Y(e = new URLSearchParams()) {
  const n = { ...A };
  for (const t of L) {
    const i = e.get(t)?.trim();
    i && i.length <= 48 && (n[t] = i);
  }
  const r = e.get("route");
  return (r === "start" || r === "opener") && (n.route = r), n;
}
function Z(e) {
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
function P({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (r) => {
    const t = e.find((i) => i.id === r);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
const b = (e) => "lane-" + e, v = (e) => "card-" + e;
function _(e) {
  return P(e).map((n) => {
    const r = e.cards.filter((t) => t.laneId === n.id);
    return { lane: n, cards: r, nodeIds: [b(n.id), ...r.map((t) => v(t.id))] };
  });
}
function E(e) {
  const n = y(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const r = n.kind === "release-plan", t = k(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > 5)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length < 1 || n.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const i = n.lanes.map((c) => {
    const o = y(c), l = { id: w(o.id), label: k(o.label) };
    if (o.capacity !== void 0) {
      const d = r ? 576 : 24;
      if (typeof o.capacity != "number" || !Number.isInteger(o.capacity) || o.capacity < 1 || o.capacity > d)
        throw new Error(`Lane capacity must be a whole number from 1 to ${d}.`);
      l.capacity = o.capacity;
    }
    if (o.station !== void 0) {
      const d = y(o.station), h = (u) => {
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
      if (c.station.next.some((o) => o === c.id || !a.includes(o))) throw new Error("Connect each stop to another station on this map.");
  }
  const s = n.cards.map((c) => {
    const o = y(c), l = { id: w(o.id), label: k(o.label), laneId: w(o.laneId) };
    if (!a.includes(l.laneId)) throw new Error("Card refers to an unknown lane.");
    if (o.allowedLaneIds !== void 0) {
      if (!Array.isArray(o.allowedLaneIds) || o.allowedLaneIds.length > i.length) throw new Error("Invalid allowed lanes.");
      if (l.allowedLaneIds = o.allowedLaneIds.map(w), m(l.allowedLaneIds, "allowed lane"), !l.allowedLaneIds.includes(l.laneId) || !l.allowedLaneIds.every((d) => a.includes(d)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (r) {
      if (typeof o.points != "number" || !Number.isInteger(o.points) || o.points < 1 || o.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (l.points = o.points, o.dependsOn !== void 0) {
        if (!Array.isArray(o.dependsOn) || o.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        l.dependsOn = o.dependsOn.map(w), m(l.dependsOn, "dependency");
      }
    }
    return l;
  });
  m(s.map((c) => c.id), "card ID");
  const f = { version: 1, title: t, lanes: i, cards: s };
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    f.presentationOrder = P({ lanes: i, presentationOrder: n.presentationOrder }).map((c) => c.id);
  }
  if (r)
    return f.kind = "release-plan", O(f), f;
  for (const c of i)
    if (s.filter((o) => o.laneId === c.id).length > (c.capacity ?? 1 / 0))
      throw new Error(`Lane "${c.label}" exceeds its capacity.`);
  return f;
}
const S = 65536;
function K(e) {
  const n = JSON.stringify(E(e)), r = "#" + new URLSearchParams({ model: n }).toString();
  if (r.length > S) throw new Error("This workshop is too large to open from a link.");
  return r;
}
function Q(e) {
  if (e.length > S) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), r = n.get("model");
  if (!e.startsWith("#") || !r || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(r);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return E(t);
}
function C(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => x(e, n, t.id) !== null);
  const r = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!r || r.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((i) => i.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function X(e, n, r) {
  const t = e.cards.find((i) => i.id === n);
  if (t && e.kind === "release-plan") {
    const i = x(e, t, r);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!t || !C(e, t).some((i) => i.id === r)) throw new Error("Move is unavailable.");
  return t.laneId === r ? e : { ...e, cards: e.cards.map((i) => i === t ? { ...t, laneId: r } : i) };
}
const M = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, R = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function F(e, n = M) {
  const { pitch: r, row: t, top: i } = n, a = !!e.lanes[0].station, s = e.lanes.map((o) => e.cards.filter((l) => l.laneId === o.id).length), f = i + Math.max(1, ...s) * t + 36, c = e.lanes.map((o, l) => ({
    x: a ? o.station.column * (r + 28) : l * r,
    y: a ? o.station.row * f : 0
  }));
  return {
    points: c,
    width: Math.max(...c.map((o) => o.x)) + r,
    height: Math.max(...c.map((o, l) => o.y + i + (a ? Math.max(1, s[l]) : s[l] + 1) * t))
  };
}
const ee = {
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
function ne(e) {
  const n = E(e), { width: r, row: t, height: i, top: a } = M, s = [];
  function f(o, l, d, h, p, u) {
    s.push({ options: {
      id: o,
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
  const { points: c } = F(n);
  n.lanes.forEach((o, l) => {
    const { x: d, y: h } = c[l], p = n.kind === "release-plan" ? o.label + `
` + (o.capacity ? I(n, o.id) + " / " + o.capacity + " points" : I(n, o.id) + " points") : o.label;
    f(b(o.id), p, d, h, a - 12, R[l]), n.cards.filter((u) => u.laneId === o.id).forEach((u, N) => f(v(u.id), n.kind === "release-plan" ? u.label + `
` + u.points + " points" : u.label, d, h + a + N * t, i, "#fffdf6"));
  });
  for (const o of n.lanes) {
    if (!o.station) continue;
    const l = s.find((d) => d.options.id === b(o.id));
    l.relationships.associations = o.station.next.map((d) => ({ id: o.id + "-to-" + d, parentId: l.options.id, childId: b(d), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), l.options.text = o.label + `
` + o.station.outcome, l.options.fontSize = 13;
  }
  if (n.kind === "release-plan") {
    const o = new Map(s.map((l) => [l.options.id, l]));
    for (const l of n.cards)
      for (const d of l.dependsOn ?? []) {
        const h = v(d), p = v(l.id);
        o.get(h).relationships.associations.push({
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
const te = {
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
  C as availableLanes,
  T as canHangPanel,
  Q as decodeWorkshopFragment,
  Z as describeFocusDarkroom,
  K as encodeWorkshopFragment,
  $ as handoffSummary,
  J as hangGalleryPanel,
  te as industrialWorkshop,
  Y as initialFocusDarkroom,
  R as laneColors,
  g as listeningRoom,
  j as listeningRoomCaption,
  q as moonGallery,
  X as moveWorkshopCard,
  ee as nightTransfer,
  V as normalizeFocusDarkroom,
  D as normalizeListeningRoom,
  B as normalizeMoonGallery,
  z as normalizeOfflineHandoff,
  W as offlineHandoff,
  L as printFields,
  I as releaseLoad,
  H as releasePlan,
  U as resolveHandoff,
  G as reviewHandoff,
  E as validateWorkshop,
  M as workshopLayout,
  F as workshopPositions,
  P as workshopPresentationLanes,
  _ as workshopPresentationScenes,
  ne as workshopToSlate
};
