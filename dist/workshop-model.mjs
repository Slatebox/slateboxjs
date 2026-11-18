const U = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function D(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: r, stage: t, choice: i, fieldNote: s, deskNote: a, fallback: f } = e, d = (o) => typeof o == "string" && o.trim().length > 0 && o.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(o);
  return n !== "offline-handoff" || r !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? i !== "field" && i !== "desk" : i !== null) || i === void 0 || !d(s) || !d(a) || !d(f) ? null : { kind: n, version: r, stage: t, choice: i, fieldNote: s.trim(), deskNote: a.trim(), fallback: f.trim() };
}
function $(e) {
  return { ...e, stage: "review", choice: null };
}
function j(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function B(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const b = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function H(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: r, mix: t, leftLabel: i, rightLabel: s } = e, a = (f) => typeof f == "string" && f.trim().length > 0 && f.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(f);
  return n !== "listening-room" || r !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !a(i) || !a(s) ? null : { kind: n, version: r, mix: t, leftLabel: i.trim(), rightLabel: s.trim() };
}
function q({ mix: e, leftLabel: n, rightLabel: r }) {
  return e < 0.32 ? n === b.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? r === b.rightLabel ? "Glass chimes ring, then fade." : "You hear " + r + "." : n === b.leftLabel && r === b.rightLabel ? "Rain and glass chimes overlap." : n + " and " + r + " overlap.";
}
function E(e, n) {
  return e.cards.reduce((r, t) => r + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function O(e) {
  const n = new Map(e.cards.map((a) => [a.id, a])), r = new Map(e.lanes.map((a, f) => [a.id, f])), t = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  function s(a) {
    if (!t.has(a.id)) {
      if (i.has(a.id)) throw new Error("Release dependencies must be acyclic.");
      i.add(a.id);
      for (const f of a.dependsOn ?? []) {
        const d = n.get(f);
        if (!d) throw new Error("A release dependency refers to an unknown feature.");
        if (r.get(d.laneId) > r.get(a.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(d);
      }
      i.delete(a.id), t.add(a.id);
    }
  }
  for (const a of e.cards) s(a);
  for (const a of e.lanes) {
    if (a.station) throw new Error("Release windows cannot also be map stations.");
    if (E(e, a.id) > (a.capacity ?? 1 / 0)) throw new Error(`Release "${a.label}" exceeds its point budget.`);
  }
}
function L(e, n, r) {
  if (r === n.laneId) return e;
  const t = new Map(e.lanes.map((c, h) => [c.id, h])), i = t.get(r);
  if (i === void 0) return null;
  const s = i < t.get(n.laneId), a = /* @__PURE__ */ new Set([n.id]), f = [n];
  for (; f.length; ) {
    const c = f.pop();
    for (const h of e.cards) {
      if (a.has(h.id)) continue;
      const p = t.get(h.laneId);
      (s ? p > i && c.dependsOn?.includes(h.id) : p < i && h.dependsOn?.includes(c.id)) && (a.add(h.id), f.push(h));
    }
  }
  if (e.cards.filter((c) => a.has(c.id)).some((c) => c.allowedLaneIds && !c.allowedLaneIds.includes(r))) return null;
  const o = { ...e, cards: e.cards.map((c) => a.has(c.id) ? { ...c, laneId: r } : c) }, l = e.lanes[i].capacity;
  return l !== void 0 && E(o, r) > l ? null : o;
}
const J = {
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
}, V = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Y(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const r = [];
  for (const s of n.panels) {
    if (!s || typeof s.id != "string" || !/^[a-z][\w-]{0,31}$/.test(s.id) || typeof s.label != "string" || !s.label.trim() || s.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(s.artwork) || !(s.after === null || typeof s.after == "string")) return null;
    r.push({ id: s.id, label: s.label.trim(), artwork: s.artwork, after: s.after });
  }
  const t = new Map(r.map((s) => [s.id, s])), i = [...new Set(n.hung)];
  if (t.size !== r.length || i.length !== n.hung.length || i.some((s) => !t.has(s))) return null;
  for (const s of r) {
    const a = /* @__PURE__ */ new Set([s.id]);
    let f = s.after;
    for (; f !== null; ) {
      if (a.has(f) || !t.has(f) || i.includes(s.id) && !i.includes(f)) return null;
      a.add(f), f = t.get(f).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: r, hung: i };
}
function C(e, n) {
  const r = e.panels.find((t) => t.id === n);
  return !!r && !e.hung.includes(n) && (r.after === null || e.hung.includes(r.after));
}
function Z(e, n) {
  return C(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const S = ["firstPrint", "secondPrint", "thirdPrint"], P = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function _(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const r = { ...P, route: n.route };
  for (const t of S) {
    const i = n[t];
    if (typeof i != "string" || !i.trim() || i.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    r[t] = i.trim();
  }
  return r;
}
function K(e = new URLSearchParams()) {
  const n = { ...P };
  for (const t of S) {
    const i = e.get(t)?.trim();
    i && i.length <= 48 && (n[t] = i);
  }
  const r = e.get("route");
  return (r === "start" || r === "opener") && (n.route = r), n;
}
function Q(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function y(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function m(e, n = 80) {
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
function g(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function M({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (r) => {
    const t = e.find((i) => i.id === r);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function R(e) {
  return (e.signals ?? []).map((n) => {
    const r = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: r, text: r ? n.whenPresent : n.whenAbsent };
  });
}
const I = (e) => "lane-" + e, v = (e) => "card-" + e;
function X(e) {
  const n = R(e);
  return M(e).map((r) => {
    const t = e.cards.filter((s) => s.laneId === r.id), i = n.filter((s) => s.laneId === r.id);
    return { lane: r, cards: t, signals: i, nodeIds: [I(r.id), ...t.map((s) => v(s.id))] };
  });
}
const T = 5, A = 3;
function x(e) {
  const n = y(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const r = n.kind === "release-plan", t = m(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > T)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length < 1 || n.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const i = n.lanes.map((d) => {
    const o = y(d), l = { id: w(o.id), label: m(o.label) };
    if (o.capacity !== void 0) {
      const c = r ? 576 : 24;
      if (typeof o.capacity != "number" || !Number.isInteger(o.capacity) || o.capacity < 1 || o.capacity > c)
        throw new Error(`Lane capacity must be a whole number from 1 to ${c}.`);
      l.capacity = o.capacity;
    }
    if (o.station !== void 0) {
      const c = y(o.station), h = (u) => {
        if (typeof u != "number" || !Number.isInteger(u) || u < 0 || u >= A)
          throw new Error("Use map coordinates from 0 to 2.");
        return u;
      };
      if (!Array.isArray(c.next) || c.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const p = c.next.map(w);
      g(p, "onward stop"), l.station = { column: h(c.column), row: h(c.row), next: p, outcome: m(c.outcome, 160) };
    }
    return l;
  }), s = i.map((d) => d.id);
  if (g(s, "lane ID"), i.some((d) => d.station)) {
    if (!i.every((d) => d.station)) throw new Error("Give every station on the map a position.");
    g(i.map((d) => d.station.column + "," + d.station.row), "map position");
    for (const d of i)
      if (d.station.next.some((o) => o === d.id || !s.includes(o))) throw new Error("Connect each stop to another station on this map.");
  }
  const a = n.cards.map((d) => {
    const o = y(d), l = { id: w(o.id), label: m(o.label), laneId: w(o.laneId) };
    if (!s.includes(l.laneId)) throw new Error("Card refers to an unknown lane.");
    if (o.allowedLaneIds !== void 0) {
      if (!Array.isArray(o.allowedLaneIds) || o.allowedLaneIds.length > i.length) throw new Error("Invalid allowed lanes.");
      if (l.allowedLaneIds = o.allowedLaneIds.map(w), g(l.allowedLaneIds, "allowed lane"), !l.allowedLaneIds.includes(l.laneId) || !l.allowedLaneIds.every((c) => s.includes(c)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (r) {
      if (typeof o.points != "number" || !Number.isInteger(o.points) || o.points < 1 || o.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (l.points = o.points, o.dependsOn !== void 0) {
        if (!Array.isArray(o.dependsOn) || o.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        l.dependsOn = o.dependsOn.map(w), g(l.dependsOn, "dependency");
      }
    }
    return l;
  });
  g(a.map((d) => d.id), "card ID");
  const f = { version: 1, title: t, lanes: i, cards: a };
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    f.signals = n.signals.map((d) => {
      const o = y(d), l = w(o.cardId), c = w(o.laneId);
      if (!a.some((h) => h.id === l) || !s.includes(c))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: w(o.id),
        label: m(o.label),
        cardId: l,
        laneId: c,
        whenPresent: m(o.whenPresent, 160),
        whenAbsent: m(o.whenAbsent, 160)
      };
    }), g(f.signals.map((d) => d.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    f.presentationOrder = M({ lanes: i, presentationOrder: n.presentationOrder }).map((d) => d.id);
  }
  if (r)
    return f.kind = "release-plan", O(f), f;
  for (const d of i)
    if (a.filter((o) => o.laneId === d.id).length > (d.capacity ?? 1 / 0))
      throw new Error(`Lane "${d.label}" exceeds its capacity.`);
  return f;
}
const N = 65536;
function ee(e) {
  const n = JSON.stringify(x(e)), r = "#" + new URLSearchParams({ model: n }).toString();
  if (r.length > N) throw new Error("This workshop is too large to open from a link.");
  return r;
}
function ne(e) {
  if (e.length > N) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), r = n.get("model");
  if (!e.startsWith("#") || !r || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(r);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return x(t);
}
function F(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => L(e, n, t.id) !== null);
  const r = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!r || r.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((i) => i.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function te(e, n, r) {
  const t = e.cards.find((i) => i.id === n);
  if (t && e.kind === "release-plan") {
    const i = L(e, t, r);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!t || !F(e, t).some((i) => i.id === r)) throw new Error("Move is unavailable.");
  return t.laneId === r ? e : { ...e, cards: e.cards.map((i) => i === t ? { ...t, laneId: r } : i) };
}
const W = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, z = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function G(e, n = W) {
  const { pitch: r, row: t, top: i } = n, s = !!e.lanes[0].station, a = e.lanes.map((o) => e.cards.filter((l) => l.laneId === o.id).length), f = i + Math.max(1, ...a) * t + 36, d = e.lanes.map((o, l) => ({
    x: s ? o.station.column * (r + 28) : l * r,
    y: s ? o.station.row * f : 0
  }));
  return {
    points: d,
    width: Math.max(...d.map((o) => o.x)) + r,
    height: Math.max(...d.map((o, l) => o.y + i + (s ? Math.max(1, a[l]) : a[l] + 1) * t))
  };
}
function oe() {
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
function re(e, n, r) {
  const t = x(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const i = t.lanes.find((h) => h.id === n);
  if (!i?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= T) throw new Error("A map can have up to five stations.");
  const s = m(r?.label), a = m(r?.outcome, 160), f = new Set([...t.lanes, ...t.cards, ...t.signals ?? []].map((h) => h.id));
  let d = 1;
  for (; f.has("station-" + d); ) d++;
  const o = "station-" + d;
  let l, c = 1 / 0;
  for (let h = 0; h < A; h++)
    for (let p = 0; p < A; p++) {
      if (t.lanes.some((k) => k.station.column === p && k.station.row === h)) continue;
      const u = Math.abs(i.station.column - p) + Math.abs(i.station.row - h);
      u < c && (c = u, l = { column: p, row: h });
    }
  if (!l) throw new Error("There is no free station position.");
  return i.station.next.push(o), t.lanes.push({ id: o, label: s, station: { ...l, next: [], outcome: a } }), t.presentationOrder?.push(o), t;
}
const ie = {
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
function se(e) {
  const n = x(e), { width: r, row: t, height: i, top: s } = W, a = [];
  function f(o, l, c, h, p, u) {
    a.push({ options: {
      id: o,
      text: l,
      name: l,
      xPos: c,
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
  const { points: d } = G(n);
  n.lanes.forEach((o, l) => {
    const { x: c, y: h } = d[l], p = n.kind === "release-plan" ? o.label + `
` + (o.capacity ? E(n, o.id) + " / " + o.capacity + " points" : E(n, o.id) + " points") : o.label;
    f(I(o.id), p, c, h, s - 12, z[l]), n.cards.filter((u) => u.laneId === o.id).forEach((u, k) => f(v(u.id), n.kind === "release-plan" ? u.label + `
` + u.points + " points" : u.label, c, h + s + k * t, i, "#fffdf6"));
  });
  for (const o of n.lanes) {
    if (!o.station) continue;
    const l = a.find((c) => c.options.id === I(o.id));
    l.relationships.associations = o.station.next.map((c) => ({ id: o.id + "-to-" + c, parentId: l.options.id, childId: I(c), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), l.options.text = o.label + `
` + o.station.outcome, l.options.fontSize = 13;
  }
  if (n.kind === "release-plan") {
    const o = new Map(a.map((l) => [l.options.id, l]));
    for (const l of n.cards)
      for (const c of l.dependsOn ?? []) {
        const h = v(c), p = v(l.id);
        o.get(h).relationships.associations.push({
          id: `dependency-${c.length}-${c}-${l.id}`,
          parentId: h,
          childId: p,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: n.title }, shareId: "", nodes: a };
}
const ae = {
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
  re as addWorkshopBranch,
  F as availableLanes,
  C as canHangPanel,
  oe as createWorkshopMap,
  ne as decodeWorkshopFragment,
  Q as describeFocusDarkroom,
  ee as encodeWorkshopFragment,
  B as handoffSummary,
  Z as hangGalleryPanel,
  ae as industrialWorkshop,
  K as initialFocusDarkroom,
  z as laneColors,
  b as listeningRoom,
  q as listeningRoomCaption,
  V as moonGallery,
  te as moveWorkshopCard,
  ie as nightTransfer,
  _ as normalizeFocusDarkroom,
  H as normalizeListeningRoom,
  Y as normalizeMoonGallery,
  D as normalizeOfflineHandoff,
  U as offlineHandoff,
  S as printFields,
  E as releaseLoad,
  J as releasePlan,
  j as resolveHandoff,
  R as resolveWorkshopSignals,
  $ as reviewHandoff,
  x as validateWorkshop,
  W as workshopLayout,
  G as workshopPositions,
  M as workshopPresentationLanes,
  X as workshopPresentationScenes,
  se as workshopToSlate
};
