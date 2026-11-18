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
  const { kind: n, version: r, stage: o, choice: t, fieldNote: l, deskNote: d, fallback: i } = e, s = (a) => typeof a == "string" && a.trim().length > 0 && a.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(a);
  return n !== "offline-handoff" || r !== 1 || o !== "queued" && o !== "review" && o !== "resolved" || (o === "resolved" ? t !== "field" && t !== "desk" : t !== null) || t === void 0 || !s(l) || !s(d) || !s(i) ? null : { kind: n, version: r, stage: o, choice: t, fieldNote: l.trim(), deskNote: d.trim(), fallback: i.trim() };
}
function T(e) {
  return { ...e, stage: "review", choice: null };
}
function z(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function F(e) {
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
  const { kind: n, version: r, mix: o, leftLabel: t, rightLabel: l } = e, d = (i) => typeof i == "string" && i.trim().length > 0 && i.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(i);
  return n !== "listening-room" || r !== 1 || typeof o != "number" || !Number.isFinite(o) || o < 0 || o > 1 || !d(t) || !d(l) ? null : { kind: n, version: r, mix: o, leftLabel: t.trim(), rightLabel: l.trim() };
}
function W({ mix: e, leftLabel: n, rightLabel: r }) {
  return e < 0.32 ? n === g.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? r === g.rightLabel ? "Glass chimes ring, then fade." : "You hear " + r + "." : n === g.leftLabel && r === g.rightLabel ? "Rain and glass chimes overlap." : n + " and " + r + " overlap.";
}
function k(e, n) {
  return e.cards.reduce((r, o) => r + (o.laneId === n ? o.points ?? 1 : 0), 0);
}
function A(e) {
  const n = new Map(e.cards.map((d) => [d.id, d])), r = new Map(e.lanes.map((d, i) => [d.id, i])), o = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
  function l(d) {
    if (!o.has(d.id)) {
      if (t.has(d.id)) throw new Error("Release dependencies must be acyclic.");
      t.add(d.id);
      for (const i of d.dependsOn ?? []) {
        const s = n.get(i);
        if (!s) throw new Error("A release dependency refers to an unknown feature.");
        if (r.get(s.laneId) > r.get(d.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        l(s);
      }
      t.delete(d.id), o.add(d.id);
    }
  }
  for (const d of e.cards) l(d);
  for (const d of e.lanes) {
    if (d.station) throw new Error("Release windows cannot also be map stations.");
    if (k(e, d.id) > (d.capacity ?? 1 / 0)) throw new Error(`Release "${d.label}" exceeds its point budget.`);
  }
}
function v(e, n, r) {
  if (r === n.laneId) return e;
  const o = new Map(e.lanes.map((f, h) => [f.id, h])), t = o.get(r);
  if (t === void 0) return null;
  const l = t < o.get(n.laneId), d = /* @__PURE__ */ new Set([n.id]), i = [n];
  for (; i.length; ) {
    const f = i.pop();
    for (const h of e.cards) {
      if (d.has(h.id)) continue;
      const p = o.get(h.laneId);
      (l ? p > t && f.dependsOn?.includes(h.id) : p < t && h.dependsOn?.includes(f.id)) && (d.add(h.id), i.push(h));
    }
  }
  if (e.cards.filter((f) => d.has(f.id)).some((f) => f.allowedLaneIds && !f.allowedLaneIds.includes(r))) return null;
  const a = { ...e, cards: e.cards.map((f) => d.has(f.id) ? { ...f, laneId: r } : f) }, c = e.lanes[t].capacity;
  return c !== void 0 && k(a, r) > c ? null : a;
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
}, U = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function j(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const r = [];
  for (const l of n.panels) {
    if (!l || typeof l.id != "string" || !/^[a-z][\w-]{0,31}$/.test(l.id) || typeof l.label != "string" || !l.label.trim() || l.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(l.artwork) || !(l.after === null || typeof l.after == "string")) return null;
    r.push({ id: l.id, label: l.label.trim(), artwork: l.artwork, after: l.after });
  }
  const o = new Map(r.map((l) => [l.id, l])), t = [...new Set(n.hung)];
  if (o.size !== r.length || t.length !== n.hung.length || t.some((l) => !o.has(l))) return null;
  for (const l of r) {
    const d = /* @__PURE__ */ new Set([l.id]);
    let i = l.after;
    for (; i !== null; ) {
      if (d.has(i) || !o.has(i) || t.includes(l.id) && !t.includes(i)) return null;
      d.add(i), i = o.get(i).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: r, hung: t };
}
function M(e, n) {
  const r = e.panels.find((o) => o.id === n);
  return !!r && !e.hung.includes(n) && (r.after === null || e.hung.includes(r.after));
}
function D(e, n) {
  return M(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const I = ["firstPrint", "secondPrint", "thirdPrint"], E = {
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function H(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const r = { ...E, route: n.route };
  for (const o of I) {
    const t = n[o];
    if (typeof t != "string" || !t.trim() || t.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    r[o] = t.trim();
  }
  return r;
}
function q(e = new URLSearchParams()) {
  const n = { ...E };
  for (const o of I) {
    const t = e.get(o)?.trim();
    t && t.length <= 48 && (n[o] = t);
  }
  const r = e.get("route");
  return (r === "start" || r === "opener") && (n.route = r), n;
}
function B(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function y(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function b(e, n = 80) {
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
function P(e) {
  const n = y(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const r = n.kind === "release-plan", o = b(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > 5)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length < 1 || n.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const t = n.lanes.map((i) => {
    const s = y(i), a = { id: w(s.id), label: b(s.label) };
    if (s.capacity !== void 0) {
      const c = r ? 576 : 24;
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
      m(h, "onward stop"), a.station = { column: f(c.column), row: f(c.row), next: h, outcome: b(c.outcome, 160) };
    }
    return a;
  }), l = t.map((i) => i.id);
  if (m(l, "lane ID"), t.some((i) => i.station)) {
    if (!t.every((i) => i.station)) throw new Error("Give every station on the map a position.");
    m(t.map((i) => i.station.column + "," + i.station.row), "map position");
    for (const i of t)
      if (i.station.next.some((s) => s === i.id || !l.includes(s))) throw new Error("Connect each stop to another station on this map.");
  }
  const d = n.cards.map((i) => {
    const s = y(i), a = { id: w(s.id), label: b(s.label), laneId: w(s.laneId) };
    if (!l.includes(a.laneId)) throw new Error("Card refers to an unknown lane.");
    if (s.allowedLaneIds !== void 0) {
      if (!Array.isArray(s.allowedLaneIds) || s.allowedLaneIds.length > t.length) throw new Error("Invalid allowed lanes.");
      if (a.allowedLaneIds = s.allowedLaneIds.map(w), m(a.allowedLaneIds, "allowed lane"), !a.allowedLaneIds.includes(a.laneId) || !a.allowedLaneIds.every((c) => l.includes(c)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (r) {
      if (typeof s.points != "number" || !Number.isInteger(s.points) || s.points < 1 || s.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (a.points = s.points, s.dependsOn !== void 0) {
        if (!Array.isArray(s.dependsOn) || s.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        a.dependsOn = s.dependsOn.map(w), m(a.dependsOn, "dependency");
      }
    }
    return a;
  });
  if (m(d.map((i) => i.id), "card ID"), r) {
    const i = { version: 1, kind: "release-plan", title: o, lanes: t, cards: d };
    return A(i), i;
  }
  for (const i of t)
    if (d.filter((s) => s.laneId === i.id).length > (i.capacity ?? 1 / 0))
      throw new Error(`Lane "${i.label}" exceeds its capacity.`);
  return { version: 1, title: o, lanes: t, cards: d };
}
function S(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((o) => v(e, n, o.id) !== null);
  const r = e.lanes.find((o) => o.id === n.laneId)?.station;
  return e.lanes.filter((o) => o.id === n.laneId || (!r || r.next.includes(o.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(o.id)) && e.cards.filter((t) => t.laneId === o.id).length < (o.capacity ?? 1 / 0));
}
function V(e, n, r) {
  const o = e.cards.find((t) => t.id === n);
  if (o && e.kind === "release-plan") {
    const t = v(e, o, r);
    if (!t) throw new Error("Move is unavailable.");
    return t;
  }
  if (!o || !S(e, o).some((t) => t.id === r)) throw new Error("Move is unavailable.");
  return o.laneId === r ? e : { ...e, cards: e.cards.map((t) => t === o ? { ...o, laneId: r } : t) };
}
const x = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, C = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function N(e) {
  const { pitch: n, row: r, top: o } = x, t = !!e.lanes[0].station, l = e.lanes.map((s) => e.cards.filter((a) => a.laneId === s.id).length), d = o + Math.max(1, ...l) * r + 36, i = e.lanes.map((s, a) => ({
    x: t ? s.station.column * (n + 28) : a * n,
    y: t ? s.station.row * d : 0
  }));
  return {
    points: i,
    width: Math.max(...i.map((s) => s.x)) + n,
    height: Math.max(...i.map((s, a) => s.y + o + (t ? Math.max(1, l[a]) : l[a] + 1) * r))
  };
}
const Y = {
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
function Z(e) {
  const n = P(e), { width: r, row: o, height: t, top: l } = x, d = [];
  function i(a, c, f, h, p, u) {
    d.push({ options: {
      id: a,
      text: c,
      name: c,
      xPos: f,
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
  const { points: s } = N(n);
  n.lanes.forEach((a, c) => {
    const { x: f, y: h } = s[c], p = n.kind === "release-plan" ? a.label + `
` + (a.capacity ? k(n, a.id) + " / " + a.capacity + " points" : k(n, a.id) + " points") : a.label;
    i("lane-" + a.id, p, f, h, l - 12, C[c]), n.cards.filter((u) => u.laneId === a.id).forEach((u, L) => i("card-" + u.id, n.kind === "release-plan" ? u.label + `
` + u.points + " points" : u.label, f, h + l + L * o, t, "#fffdf6"));
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
const _ = {
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
  S as availableLanes,
  M as canHangPanel,
  B as describeFocusDarkroom,
  F as handoffSummary,
  D as hangGalleryPanel,
  _ as industrialWorkshop,
  q as initialFocusDarkroom,
  C as laneColors,
  g as listeningRoom,
  W as listeningRoomCaption,
  U as moonGallery,
  V as moveWorkshopCard,
  Y as nightTransfer,
  H as normalizeFocusDarkroom,
  G as normalizeListeningRoom,
  j as normalizeMoonGallery,
  R as normalizeOfflineHandoff,
  O as offlineHandoff,
  I as printFields,
  k as releaseLoad,
  $ as releasePlan,
  z as resolveHandoff,
  T as reviewHandoff,
  P as validateWorkshop,
  x as workshopLayout,
  N as workshopPositions,
  Z as workshopToSlate
};
