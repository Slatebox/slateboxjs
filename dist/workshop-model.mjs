function f(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function u(e, r = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > r)
    throw new Error(`Labels must contain 1 to ${r} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function p(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function I(e, r) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${r}.`);
}
function g(e) {
  const r = f(e);
  if (r.version !== 1) throw new Error("Unsupported workshop version.");
  const a = u(r.title, 120);
  if (!Array.isArray(r.lanes) || r.lanes.length < 2 || r.lanes.length > 5)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(r.cards) || r.cards.length < 1 || r.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const o = r.lanes.map((t) => {
    const n = f(t), i = { id: p(n.id), label: u(n.label) };
    if (n.capacity !== void 0) {
      if (typeof n.capacity != "number" || !Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24)
        throw new Error("Lane capacity must be a whole number from 1 to 24.");
      i.capacity = n.capacity;
    }
    return i;
  }), s = o.map((t) => t.id);
  I(s, "lane ID");
  const h = r.cards.map((t) => {
    const n = f(t), i = { id: p(n.id), label: u(n.label), laneId: p(n.laneId) };
    if (!s.includes(i.laneId)) throw new Error("Card refers to an unknown lane.");
    if (n.allowedLaneIds !== void 0) {
      if (!Array.isArray(n.allowedLaneIds) || n.allowedLaneIds.length > o.length) throw new Error("Invalid allowed lanes.");
      if (i.allowedLaneIds = n.allowedLaneIds.map(p), I(i.allowedLaneIds, "allowed lane"), !i.allowedLaneIds.includes(i.laneId) || !i.allowedLaneIds.every((l) => s.includes(l)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    return i;
  });
  I(h.map((t) => t.id), "card ID");
  for (const t of o)
    if (h.filter((n) => n.laneId === t.id).length > (t.capacity ?? 1 / 0))
      throw new Error(`Lane "${t.label}" exceeds its capacity.`);
  return { version: 1, title: a, lanes: o, cards: h };
}
function m(e, r) {
  return e.lanes.filter((a) => a.id === r.laneId || (!r.allowedLaneIds || r.allowedLaneIds.includes(a.id)) && e.cards.filter((o) => o.laneId === a.id).length < (a.capacity ?? 1 / 0));
}
function A(e, r, a) {
  const o = e.cards.find((s) => s.id === r);
  if (!o || !m(e, o).some((s) => s.id === a)) throw new Error("Move is unavailable.");
  return o.laneId === a ? e : { ...e, cards: e.cards.map((s) => s === o ? { ...o, laneId: a } : s) };
}
const E = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, L = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function k(e) {
  const r = g(e), { pitch: a, width: o, row: s, height: h, top: t } = E, n = [];
  function i(l, d, c, w, y, b) {
    n.push({ options: {
      id: l,
      text: d,
      name: d,
      xPos: c,
      yPos: w,
      width: o,
      height: y,
      shapeHint: "rectangle",
      backgroundColor: b,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  return r.lanes.forEach((l, d) => {
    i("lane-" + l.id, l.label, d * a, 0, t - 12, L[d]), r.cards.filter((c) => c.laneId === l.id).forEach((c, w) => i("card-" + c.id, c.label, d * a, t + w * s, h, "#fffdf6"));
  }), { options: { name: r.title }, shareId: "", nodes: n };
}
const v = {
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
  m as availableLanes,
  v as industrialWorkshop,
  L as laneColors,
  A as moveWorkshopCard,
  g as validateWorkshop,
  E as workshopLayout,
  k as workshopToSlate
};
