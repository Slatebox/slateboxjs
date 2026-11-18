function m(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new Error("Expected a workshop object.");
  return t;
}
function y(t, e = 80) {
  if (typeof t != "string" || !t.trim() || t.trim().length > e)
    throw new Error(`Labels must contain 1 to ${e} characters.`);
  if (/[<>\u0000-\u001f]/.test(t)) throw new Error("Use plain text without markup or control characters.");
  return t.trim();
}
function w(t) {
  if (typeof t != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(t))
    throw new Error("IDs must be short alphanumeric slugs.");
  return t;
}
function u(t, e) {
  if (new Set(t).size !== t.length) throw new Error(`Duplicate ${e}.`);
}
function b(t) {
  const e = m(t);
  if (e.version !== 1) throw new Error("Unsupported workshop version.");
  const l = y(e.title, 120);
  if (!Array.isArray(e.lanes) || e.lanes.length < 2 || e.lanes.length > 5)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(e.cards) || e.cards.length < 1 || e.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const n = e.lanes.map((r) => {
    const o = m(r), i = { id: w(o.id), label: y(o.label) };
    if (o.capacity !== void 0) {
      if (typeof o.capacity != "number" || !Number.isInteger(o.capacity) || o.capacity < 1 || o.capacity > 24)
        throw new Error("Lane capacity must be a whole number from 1 to 24.");
      i.capacity = o.capacity;
    }
    if (o.station !== void 0) {
      const a = m(o.station), d = (h) => {
        if (typeof h != "number" || !Number.isInteger(h) || h < 0 || h > 2)
          throw new Error("Use map coordinates from 0 to 2.");
        return h;
      };
      if (!Array.isArray(a.next) || a.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const c = a.next.map(w);
      u(c, "onward stop"), i.station = { column: d(a.column), row: d(a.row), next: c, outcome: y(a.outcome, 160) };
    }
    return i;
  }), s = n.map((r) => r.id);
  if (u(s, "lane ID"), n.some((r) => r.station)) {
    if (!n.every((r) => r.station)) throw new Error("Give every station on the map a position.");
    u(n.map((r) => r.station.column + "," + r.station.row), "map position");
    for (const r of n)
      if (r.station.next.some((o) => o === r.id || !s.includes(o))) throw new Error("Connect each stop to another station on this map.");
  }
  const p = e.cards.map((r) => {
    const o = m(r), i = { id: w(o.id), label: y(o.label), laneId: w(o.laneId) };
    if (!s.includes(i.laneId)) throw new Error("Card refers to an unknown lane.");
    if (o.allowedLaneIds !== void 0) {
      if (!Array.isArray(o.allowedLaneIds) || o.allowedLaneIds.length > n.length) throw new Error("Invalid allowed lanes.");
      if (i.allowedLaneIds = o.allowedLaneIds.map(w), u(i.allowedLaneIds, "allowed lane"), !i.allowedLaneIds.includes(i.laneId) || !i.allowedLaneIds.every((a) => s.includes(a)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    return i;
  });
  u(p.map((r) => r.id), "card ID");
  for (const r of n)
    if (p.filter((o) => o.laneId === r.id).length > (r.capacity ?? 1 / 0))
      throw new Error(`Lane "${r.label}" exceeds its capacity.`);
  return { version: 1, title: l, lanes: n, cards: p };
}
function x(t, e) {
  const l = t.lanes.find((n) => n.id === e.laneId)?.station;
  return t.lanes.filter((n) => n.id === e.laneId || (!l || l.next.includes(n.id)) && (!e.allowedLaneIds || e.allowedLaneIds.includes(n.id)) && t.cards.filter((s) => s.laneId === n.id).length < (n.capacity ?? 1 / 0));
}
function A(t, e, l) {
  const n = t.cards.find((s) => s.id === e);
  if (!n || !x(t, n).some((s) => s.id === l)) throw new Error("Move is unavailable.");
  return n.laneId === l ? t : { ...t, cards: t.cards.map((s) => s === n ? { ...n, laneId: l } : s) };
}
const I = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, E = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function L(t) {
  const { pitch: e, row: l, top: n } = I, s = !!t.lanes[0].station, p = t.lanes.map((i) => t.cards.filter((a) => a.laneId === i.id).length), r = n + Math.max(1, ...p) * l + 36, o = t.lanes.map((i, a) => ({
    x: s ? i.station.column * (e + 28) : a * e,
    y: s ? i.station.row * r : 0
  }));
  return {
    points: o,
    width: Math.max(...o.map((i) => i.x)) + e,
    height: Math.max(...o.map((i, a) => i.y + n + (p[a] + 1) * l))
  };
}
const k = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: ["platform"], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
};
function v(t) {
  const e = b(t), { width: l, row: n, height: s, top: p } = I, r = [];
  function o(a, d, c, h, f, g) {
    r.push({ options: {
      id: a,
      text: d,
      name: d,
      xPos: c,
      yPos: h,
      width: l,
      height: f,
      shapeHint: "rectangle",
      backgroundColor: g,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: i } = L(e);
  e.lanes.forEach((a, d) => {
    const { x: c, y: h } = i[d];
    o("lane-" + a.id, a.label, c, h, p - 12, E[d]), e.cards.filter((f) => f.laneId === a.id).forEach((f, g) => o("card-" + f.id, f.label, c, h + p + g * n, s, "#fffdf6"));
  });
  for (const a of e.lanes) {
    if (!a.station) continue;
    const d = r.find((c) => c.options.id === "lane-" + a.id);
    d.relationships.associations = a.station.next.map((c) => ({ id: a.id + "-to-" + c, parentId: d.options.id, childId: "lane-" + c, lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), d.options.text = a.label + `
` + a.station.outcome, d.options.fontSize = 13;
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
const C = {
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
  x as availableLanes,
  C as industrialWorkshop,
  E as laneColors,
  A as moveWorkshopCard,
  k as nightTransfer,
  b as validateWorkshop,
  I as workshopLayout,
  L as workshopPositions,
  v as workshopToSlate
};
