const z = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function G(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: r, choice: i, fieldNote: s, deskNote: a, fallback: f } = e, d = (t) => typeof t == "string" && t.trim().length > 0 && t.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(t);
  return n !== "offline-handoff" || o !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? i !== "field" && i !== "desk" : i !== null) || i === void 0 || !d(s) || !d(a) || !d(f) ? null : { kind: n, version: o, stage: r, choice: i, fieldNote: s.trim(), deskNote: a.trim(), fallback: f.trim() };
}
function U(e) {
  return { ...e, stage: "review", choice: null };
}
function D(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function $(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const k = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function j(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: r, leftLabel: i, rightLabel: s } = e, a = (f) => typeof f == "string" && f.trim().length > 0 && f.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(f);
  return n !== "listening-room" || o !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !a(i) || !a(s) ? null : { kind: n, version: o, mix: r, leftLabel: i.trim(), rightLabel: s.trim() };
}
function H({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === k.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === k.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === k.leftLabel && o === k.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function v(e, n) {
  return e.cards.reduce((o, r) => o + (r.laneId === n ? r.points ?? 1 : 0), 0);
}
function O(e) {
  const n = new Map(e.cards.map((a) => [a.id, a])), o = new Map(e.lanes.map((a, f) => [a.id, f])), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  function s(a) {
    if (!r.has(a.id)) {
      if (i.has(a.id)) throw new Error("Release dependencies must be acyclic.");
      i.add(a.id);
      for (const f of a.dependsOn ?? []) {
        const d = n.get(f);
        if (!d) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(d.laneId) > o.get(a.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(d);
      }
      i.delete(a.id), r.add(a.id);
    }
  }
  for (const a of e.cards) s(a);
  for (const a of e.lanes) {
    if (a.station) throw new Error("Release windows cannot also be map stations.");
    if (v(e, a.id) > (a.capacity ?? 1 / 0)) throw new Error(`Release "${a.label}" exceeds its point budget.`);
  }
}
function x(e, n, o) {
  if (o === n.laneId) return e;
  const r = new Map(e.lanes.map((c, h) => [c.id, h])), i = r.get(o);
  if (i === void 0) return null;
  const s = i < r.get(n.laneId), a = /* @__PURE__ */ new Set([n.id]), f = [n];
  for (; f.length; ) {
    const c = f.pop();
    for (const h of e.cards) {
      if (a.has(h.id)) continue;
      const p = r.get(h.laneId);
      (s ? p > i && c.dependsOn?.includes(h.id) : p < i && h.dependsOn?.includes(c.id)) && (a.add(h.id), f.push(h));
    }
  }
  if (e.cards.filter((c) => a.has(c.id)).some((c) => c.allowedLaneIds && !c.allowedLaneIds.includes(o))) return null;
  const t = { ...e, cards: e.cards.map((c) => a.has(c.id) ? { ...c, laneId: o } : c) }, l = e.lanes[i].capacity;
  return l !== void 0 && v(t, o) > l ? null : t;
}
const q = {
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
}, B = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function J(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const s of n.panels) {
    if (!s || typeof s.id != "string" || !/^[a-z][\w-]{0,31}$/.test(s.id) || typeof s.label != "string" || !s.label.trim() || s.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(s.artwork) || !(s.after === null || typeof s.after == "string")) return null;
    o.push({ id: s.id, label: s.label.trim(), artwork: s.artwork, after: s.after });
  }
  const r = new Map(o.map((s) => [s.id, s])), i = [...new Set(n.hung)];
  if (r.size !== o.length || i.length !== n.hung.length || i.some((s) => !r.has(s))) return null;
  for (const s of o) {
    const a = /* @__PURE__ */ new Set([s.id]);
    let f = s.after;
    for (; f !== null; ) {
      if (a.has(f) || !r.has(f) || i.includes(s.id) && !i.includes(f)) return null;
      a.add(f), f = r.get(f).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: i };
}
function T(e, n) {
  const o = e.panels.find((r) => r.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function V(e, n) {
  return T(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const A = ["firstPrint", "secondPrint", "thirdPrint"], L = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Y(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...L, route: n.route };
  for (const r of A) {
    const i = n[r];
    if (typeof i != "string" || !i.trim() || i.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[r] = i.trim();
  }
  return o;
}
function Z(e = new URLSearchParams()) {
  const n = { ...L };
  for (const r of A) {
    const i = e.get(r)?.trim();
    i && i.length <= 48 && (n[r] = i);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function _(e) {
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
function P({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const r = e.find((i) => i.id === o);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function C(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((r) => r.id === n.cardId && r.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const b = (e) => "lane-" + e, I = (e) => "card-" + e;
function K(e) {
  const n = C(e);
  return P(e).map((o) => {
    const r = e.cards.filter((s) => s.laneId === o.id), i = n.filter((s) => s.laneId === o.id);
    return { lane: o, cards: r, signals: i, nodeIds: [b(o.id), ...r.map((s) => I(s.id))] };
  });
}
function E(e) {
  const n = y(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", r = m(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > 5)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length < 1 || n.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const i = n.lanes.map((d) => {
    const t = y(d), l = { id: w(t.id), label: m(t.label) };
    if (t.capacity !== void 0) {
      const c = o ? 576 : 24;
      if (typeof t.capacity != "number" || !Number.isInteger(t.capacity) || t.capacity < 1 || t.capacity > c)
        throw new Error(`Lane capacity must be a whole number from 1 to ${c}.`);
      l.capacity = t.capacity;
    }
    if (t.station !== void 0) {
      const c = y(t.station), h = (u) => {
        if (typeof u != "number" || !Number.isInteger(u) || u < 0 || u > 2)
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
      if (d.station.next.some((t) => t === d.id || !s.includes(t))) throw new Error("Connect each stop to another station on this map.");
  }
  const a = n.cards.map((d) => {
    const t = y(d), l = { id: w(t.id), label: m(t.label), laneId: w(t.laneId) };
    if (!s.includes(l.laneId)) throw new Error("Card refers to an unknown lane.");
    if (t.allowedLaneIds !== void 0) {
      if (!Array.isArray(t.allowedLaneIds) || t.allowedLaneIds.length > i.length) throw new Error("Invalid allowed lanes.");
      if (l.allowedLaneIds = t.allowedLaneIds.map(w), g(l.allowedLaneIds, "allowed lane"), !l.allowedLaneIds.includes(l.laneId) || !l.allowedLaneIds.every((c) => s.includes(c)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (o) {
      if (typeof t.points != "number" || !Number.isInteger(t.points) || t.points < 1 || t.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (l.points = t.points, t.dependsOn !== void 0) {
        if (!Array.isArray(t.dependsOn) || t.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        l.dependsOn = t.dependsOn.map(w), g(l.dependsOn, "dependency");
      }
    }
    return l;
  });
  g(a.map((d) => d.id), "card ID");
  const f = { version: 1, title: r, lanes: i, cards: a };
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    f.signals = n.signals.map((d) => {
      const t = y(d), l = w(t.cardId), c = w(t.laneId);
      if (!a.some((h) => h.id === l) || !s.includes(c))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: w(t.id),
        label: m(t.label),
        cardId: l,
        laneId: c,
        whenPresent: m(t.whenPresent, 160),
        whenAbsent: m(t.whenAbsent, 160)
      };
    }), g(f.signals.map((d) => d.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    f.presentationOrder = P({ lanes: i, presentationOrder: n.presentationOrder }).map((d) => d.id);
  }
  if (o)
    return f.kind = "release-plan", O(f), f;
  for (const d of i)
    if (a.filter((t) => t.laneId === d.id).length > (d.capacity ?? 1 / 0))
      throw new Error(`Lane "${d.label}" exceeds its capacity.`);
  return f;
}
const S = 65536;
function Q(e) {
  const n = JSON.stringify(E(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > S) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function X(e) {
  if (e.length > S) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let r;
  try {
    r = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return E(r);
}
function R(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((r) => x(e, n, r.id) !== null);
  const o = e.lanes.find((r) => r.id === n.laneId)?.station;
  return e.lanes.filter((r) => r.id === n.laneId || (!o || o.next.includes(r.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(r.id)) && e.cards.filter((i) => i.laneId === r.id).length < (r.capacity ?? 1 / 0));
}
function ee(e, n, o) {
  const r = e.cards.find((i) => i.id === n);
  if (r && e.kind === "release-plan") {
    const i = x(e, r, o);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!r || !R(e, r).some((i) => i.id === o)) throw new Error("Move is unavailable.");
  return r.laneId === o ? e : { ...e, cards: e.cards.map((i) => i === r ? { ...r, laneId: o } : i) };
}
const M = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, W = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function F(e, n = M) {
  const { pitch: o, row: r, top: i } = n, s = !!e.lanes[0].station, a = e.lanes.map((t) => e.cards.filter((l) => l.laneId === t.id).length), f = i + Math.max(1, ...a) * r + 36, d = e.lanes.map((t, l) => ({
    x: s ? t.station.column * (o + 28) : l * o,
    y: s ? t.station.row * f : 0
  }));
  return {
    points: d,
    width: Math.max(...d.map((t) => t.x)) + o,
    height: Math.max(...d.map((t, l) => t.y + i + (s ? Math.max(1, a[l]) : a[l] + 1) * r))
  };
}
const ne = {
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
function te(e) {
  const n = E(e), { width: o, row: r, height: i, top: s } = M, a = [];
  function f(t, l, c, h, p, u) {
    a.push({ options: {
      id: t,
      text: l,
      name: l,
      xPos: c,
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
  const { points: d } = F(n);
  n.lanes.forEach((t, l) => {
    const { x: c, y: h } = d[l], p = n.kind === "release-plan" ? t.label + `
` + (t.capacity ? v(n, t.id) + " / " + t.capacity + " points" : v(n, t.id) + " points") : t.label;
    f(b(t.id), p, c, h, s - 12, W[l]), n.cards.filter((u) => u.laneId === t.id).forEach((u, N) => f(I(u.id), n.kind === "release-plan" ? u.label + `
` + u.points + " points" : u.label, c, h + s + N * r, i, "#fffdf6"));
  });
  for (const t of n.lanes) {
    if (!t.station) continue;
    const l = a.find((c) => c.options.id === b(t.id));
    l.relationships.associations = t.station.next.map((c) => ({ id: t.id + "-to-" + c, parentId: l.options.id, childId: b(c), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), l.options.text = t.label + `
` + t.station.outcome, l.options.fontSize = 13;
  }
  if (n.kind === "release-plan") {
    const t = new Map(a.map((l) => [l.options.id, l]));
    for (const l of n.cards)
      for (const c of l.dependsOn ?? []) {
        const h = I(c), p = I(l.id);
        t.get(h).relationships.associations.push({
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
const oe = {
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
  R as availableLanes,
  T as canHangPanel,
  X as decodeWorkshopFragment,
  _ as describeFocusDarkroom,
  Q as encodeWorkshopFragment,
  $ as handoffSummary,
  V as hangGalleryPanel,
  oe as industrialWorkshop,
  Z as initialFocusDarkroom,
  W as laneColors,
  k as listeningRoom,
  H as listeningRoomCaption,
  B as moonGallery,
  ee as moveWorkshopCard,
  ne as nightTransfer,
  Y as normalizeFocusDarkroom,
  j as normalizeListeningRoom,
  J as normalizeMoonGallery,
  G as normalizeOfflineHandoff,
  z as offlineHandoff,
  A as printFields,
  v as releaseLoad,
  q as releasePlan,
  D as resolveHandoff,
  C as resolveWorkshopSignals,
  U as reviewHandoff,
  E as validateWorkshop,
  M as workshopLayout,
  F as workshopPositions,
  P as workshopPresentationLanes,
  K as workshopPresentationScenes,
  te as workshopToSlate
};
