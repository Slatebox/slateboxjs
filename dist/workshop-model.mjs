const q = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function J(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: n, stage: o, choice: r, fieldNote: a, deskNote: s, fallback: c } = e, d = (i) => typeof i == "string" && i.trim().length > 0 && i.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(i);
  return t !== "offline-handoff" || n !== 1 || o !== "queued" && o !== "review" && o !== "resolved" || (o === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !d(a) || !d(s) || !d(c) ? null : { kind: t, version: n, stage: o, choice: r, fieldNote: a.trim(), deskNote: s.trim(), fallback: c.trim() };
}
function V(e) {
  return { ...e, stage: "review", choice: null };
}
function Y(e, t) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: t } : e;
}
function Z(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const v = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function _(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: n, mix: o, leftLabel: r, rightLabel: a } = e, s = (c) => typeof c == "string" && c.trim().length > 0 && c.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(c);
  return t !== "listening-room" || n !== 1 || typeof o != "number" || !Number.isFinite(o) || o < 0 || o > 1 || !s(r) || !s(a) ? null : { kind: t, version: n, mix: o, leftLabel: r.trim(), rightLabel: a.trim() };
}
function K({ mix: e, leftLabel: t, rightLabel: n }) {
  return e < 0.32 ? t === v.leftLabel ? "Rain ticks on the copper roof." : "You hear " + t + "." : e > 0.68 ? n === v.rightLabel ? "Glass chimes ring, then fade." : "You hear " + n + "." : t === v.leftLabel && n === v.rightLabel ? "Rain and glass chimes overlap." : t + " and " + n + " overlap.";
}
function A(e, t) {
  return e.cards.reduce((n, o) => n + (o.laneId === t ? o.points ?? 1 : 0), 0);
}
function G(e) {
  const t = new Map(e.cards.map((s) => [s.id, s])), n = new Map(e.lanes.map((s, c) => [s.id, c])), o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function a(s) {
    if (!o.has(s.id)) {
      if (r.has(s.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(s.id);
      for (const c of s.dependsOn ?? []) {
        const d = t.get(c);
        if (!d) throw new Error("A release dependency refers to an unknown feature.");
        if (n.get(d.laneId) > n.get(s.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        a(d);
      }
      r.delete(s.id), o.add(s.id);
    }
  }
  for (const s of e.cards) a(s);
  for (const s of e.lanes) {
    if (s.station) throw new Error("Release windows cannot also be map stations.");
    if (A(e, s.id) > (s.capacity ?? 1 / 0)) throw new Error(`Release "${s.label}" exceeds its point budget.`);
  }
}
function T(e, t, n) {
  if (n === t.laneId) return e;
  const o = new Map(e.lanes.map((f, l) => [f.id, l])), r = o.get(n);
  if (r === void 0) return null;
  const a = r < o.get(t.laneId), s = /* @__PURE__ */ new Set([t.id]), c = [t];
  for (; c.length; ) {
    const f = c.pop();
    for (const l of e.cards) {
      if (s.has(l.id)) continue;
      const p = o.get(l.laneId);
      (a ? p > r && f.dependsOn?.includes(l.id) : p < r && l.dependsOn?.includes(f.id)) && (s.add(l.id), c.push(l));
    }
  }
  if (e.cards.filter((f) => s.has(f.id)).some((f) => f.allowedLaneIds && !f.allowedLaneIds.includes(n))) return null;
  const i = { ...e, cards: e.cards.map((f) => s.has(f.id) ? { ...f, laneId: n } : f) }, h = e.lanes[r].capacity;
  return h !== void 0 && A(i, n) > h ? null : i;
}
const Q = {
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
}, X = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ee(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.kind !== "moon-gallery" || t.version !== 1 || !Array.isArray(t.panels) || t.panels.length !== 3 || !Array.isArray(t.hung)) return null;
  const n = [];
  for (const a of t.panels) {
    if (!a || typeof a.id != "string" || !/^[a-z][\w-]{0,31}$/.test(a.id) || typeof a.label != "string" || !a.label.trim() || a.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(a.artwork) || !(a.after === null || typeof a.after == "string")) return null;
    n.push({ id: a.id, label: a.label.trim(), artwork: a.artwork, after: a.after });
  }
  const o = new Map(n.map((a) => [a.id, a])), r = [...new Set(t.hung)];
  if (o.size !== n.length || r.length !== t.hung.length || r.some((a) => !o.has(a))) return null;
  for (const a of n) {
    const s = /* @__PURE__ */ new Set([a.id]);
    let c = a.after;
    for (; c !== null; ) {
      if (s.has(c) || !o.has(c) || r.includes(a.id) && !r.includes(c)) return null;
      s.add(c), c = o.get(c).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: n, hung: r };
}
function H(e, t) {
  const n = e.panels.find((o) => o.id === t);
  return !!n && !e.hung.includes(t) && (n.after === null || e.hung.includes(n.after));
}
function te(e, t) {
  return H(e, t) ? { ...e, hung: [...e.hung, t] } : e;
}
const M = ["firstPrint", "secondPrint", "thirdPrint"], N = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function ne(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const t = e;
  if (t.kind !== void 0 && t.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (t.version !== 1) throw new Error("Unknown darkroom version.");
  if (t.route !== null && t.route !== "start" && t.route !== "opener") throw new Error("Unknown return path.");
  const n = { ...N, route: t.route };
  for (const o of M) {
    const r = t[o];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    n[o] = r.trim();
  }
  return n;
}
function oe(e = new URLSearchParams()) {
  const t = { ...N };
  for (const o of M) {
    const r = e.get(o)?.trim();
    r && r.length <= 48 && (t[o] = r);
  }
  const n = e.get("route");
  return (n === "start" || n === "opener") && (t.route = n), t;
}
function re(e) {
  const t = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + t;
}
function I(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function m(e, t = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > t)
    throw new Error(`Labels must contain 1 to ${t} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function W(e) {
  const t = I(e);
  let n;
  try {
    n = new URL(m(t.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (n.protocol !== "https:" || n.username || n.password || n.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: n.href, alt: m(t.alt, 240) };
}
function g(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function k(e, t) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${t}.`);
}
function O({ lanes: e, presentationOrder: t }) {
  if (t === void 0) return e.slice();
  if (!Array.isArray(t) || t.length !== e.length || new Set(t).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(t, (n) => {
    const o = e.find((r) => r.id === n);
    if (!o) throw new Error("Presentation order refers to an unknown lane.");
    return o;
  });
}
function D(e) {
  return (e.signals ?? []).map((t) => {
    const n = e.cards.some((o) => o.id === t.cardId && o.laneId === t.laneId);
    return { ...t, present: n, text: n ? t.whenPresent : t.whenAbsent };
  });
}
const E = (e) => "lane-" + e, x = (e) => "card-" + e, C = (e) => "image-" + e;
function ie(e) {
  const t = D(e);
  return O(e).map((n) => {
    const o = e.cards.filter((s) => s.laneId === n.id), r = t.filter((s) => s.laneId === n.id), a = [E(n.id)];
    return n.station?.image && a.push(C(n.id)), { lane: n, cards: o, signals: r, nodeIds: [...a, ...o.map((s) => x(s.id))] };
  });
}
const R = 5, S = 3;
function L(e) {
  const t = I(e);
  if (t.version !== 1) throw new Error("Unsupported workshop version.");
  if (t.kind !== void 0 && t.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const n = t.kind === "release-plan", o = m(t.title, 120);
  if (!Array.isArray(t.lanes) || t.lanes.length < 2 || t.lanes.length > R)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(t.cards) || t.cards.length < 1 || t.cards.length > 24)
    throw new Error("A workshop needs 1 to 24 cards.");
  const r = t.lanes.map((d) => {
    const i = I(d), h = { id: g(i.id), label: m(i.label) };
    if (i.capacity !== void 0) {
      const f = n ? 576 : 24;
      if (typeof i.capacity != "number" || !Number.isInteger(i.capacity) || i.capacity < 1 || i.capacity > f)
        throw new Error(`Lane capacity must be a whole number from 1 to ${f}.`);
      h.capacity = i.capacity;
    }
    if (i.station !== void 0) {
      const f = I(i.station), l = (u) => {
        if (typeof u != "number" || !Number.isInteger(u) || u < 0 || u >= S)
          throw new Error("Use map coordinates from 0 to 2.");
        return u;
      };
      if (!Array.isArray(f.next) || f.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const p = f.next.map(g);
      k(p, "onward stop"), h.station = { column: l(f.column), row: l(f.row), next: p, outcome: m(f.outcome, 160) }, f.image !== void 0 && (h.station.image = W(f.image));
    }
    return h;
  }), a = r.map((d) => d.id);
  if (k(a, "lane ID"), r.some((d) => d.station)) {
    if (!r.every((d) => d.station)) throw new Error("Give every station on the map a position.");
    k(r.map((d) => d.station.column + "," + d.station.row), "map position");
    for (const d of r)
      if (d.station.next.some((i) => i === d.id || !a.includes(i))) throw new Error("Connect each stop to another station on this map.");
  }
  const s = t.cards.map((d) => {
    const i = I(d), h = { id: g(i.id), label: m(i.label), laneId: g(i.laneId) };
    if (!a.includes(h.laneId)) throw new Error("Card refers to an unknown lane.");
    if (i.allowedLaneIds !== void 0) {
      if (!Array.isArray(i.allowedLaneIds) || i.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (h.allowedLaneIds = i.allowedLaneIds.map(g), k(h.allowedLaneIds, "allowed lane"), !h.allowedLaneIds.includes(h.laneId) || !h.allowedLaneIds.every((f) => a.includes(f)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (n) {
      if (typeof i.points != "number" || !Number.isInteger(i.points) || i.points < 1 || i.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (h.points = i.points, i.dependsOn !== void 0) {
        if (!Array.isArray(i.dependsOn) || i.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        h.dependsOn = i.dependsOn.map(g), k(h.dependsOn, "dependency");
      }
    }
    return h;
  });
  k(s.map((d) => d.id), "card ID");
  const c = { version: 1, title: o, lanes: r, cards: s };
  if (t.signals !== void 0) {
    if (!Array.isArray(t.signals) || t.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    c.signals = t.signals.map((d) => {
      const i = I(d), h = g(i.cardId), f = g(i.laneId);
      if (!s.some((l) => l.id === h) || !a.includes(f))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: g(i.id),
        label: m(i.label),
        cardId: h,
        laneId: f,
        whenPresent: m(i.whenPresent, 160),
        whenAbsent: m(i.whenAbsent, 160)
      };
    }), k(c.signals.map((d) => d.id), "placement outcome ID");
  }
  if (t.presentationOrder !== void 0) {
    if (!Array.isArray(t.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    c.presentationOrder = O({ lanes: r, presentationOrder: t.presentationOrder }).map((d) => d.id);
  }
  if (n)
    return c.kind = "release-plan", G(c), c;
  for (const d of r)
    if (s.filter((i) => i.laneId === d.id).length > (d.capacity ?? 1 / 0))
      throw new Error(`Lane "${d.label}" exceeds its capacity.`);
  return c;
}
const U = 65536;
function se(e) {
  const t = JSON.stringify(L(e)), n = "#" + new URLSearchParams({ model: t }).toString();
  if (n.length > U) throw new Error("This workshop is too large to open from a link.");
  return n;
}
function ae(e) {
  if (e.length > U) throw new Error("This workshop is too large to open from a link.");
  const t = new URLSearchParams(e.slice(1)), n = t.get("model");
  if (!e.startsWith("#") || !n || Array.from(t.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let o;
  try {
    o = JSON.parse(n);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return L(o);
}
function $(e, t) {
  if (e.kind === "release-plan") return e.lanes.filter((o) => T(e, t, o.id) !== null);
  const n = e.lanes.find((o) => o.id === t.laneId)?.station;
  return e.lanes.filter((o) => o.id === t.laneId || (!n || n.next.includes(o.id)) && (!t.allowedLaneIds || t.allowedLaneIds.includes(o.id)) && e.cards.filter((r) => r.laneId === o.id).length < (o.capacity ?? 1 / 0));
}
function le(e, t, n) {
  const o = e.cards.find((r) => r.id === t);
  if (o && e.kind === "release-plan") {
    const r = T(e, o, n);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!o || !$(e, o).some((r) => r.id === n)) throw new Error("Move is unavailable.");
  return o.laneId === n ? e : { ...e, cards: e.cards.map((r) => r === o ? { ...o, laneId: n } : r) };
}
const F = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, j = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function B(e, t = F) {
  const { pitch: n, row: o, top: r } = t, a = !!e.lanes[0].station, s = e.lanes.map((i) => e.cards.filter((h) => h.laneId === i.id).length), c = r + Math.max(1, ...s) * o + 36, d = e.lanes.map((i, h) => ({
    x: a ? i.station.column * (n + 28) : h * n,
    y: a ? i.station.row * c : 0
  }));
  return {
    points: d,
    width: Math.max(...d.map((i) => i.x)) + n,
    height: Math.max(...d.map((i, h) => i.y + r + (a ? Math.max(1, s[h]) : s[h] + 1) * o))
  };
}
function de() {
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
function ce(e, t, n) {
  const o = L(e);
  if (o.kind || !o.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = o.lanes.find((l) => l.id === t);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (o.lanes.length >= R) throw new Error("A map can have up to five stations.");
  const a = m(n?.label), s = m(n?.outcome, 160), c = new Set([...o.lanes, ...o.cards, ...o.signals ?? []].map((l) => l.id));
  let d = 1;
  for (; c.has("station-" + d); ) d++;
  const i = "station-" + d;
  let h, f = 1 / 0;
  for (let l = 0; l < S; l++)
    for (let p = 0; p < S; p++) {
      if (o.lanes.some((w) => w.station.column === p && w.station.row === l)) continue;
      const u = Math.abs(r.station.column - p) + Math.abs(r.station.row - l);
      u < f && (f = u, h = { column: p, row: l });
    }
  if (!h) throw new Error("There is no free station position.");
  return r.station.next.push(i), o.lanes.push({ id: i, label: a, station: { ...h, next: [], outcome: s, ...n.image === void 0 ? {} : { image: W(n.image) } } }), o.presentationOrder?.push(i), o;
}
const he = {
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
function fe(e) {
  const t = L(e), { width: n, row: o, height: r, top: a } = F, s = [];
  function c(l, p, u, w, y, P) {
    s.push({ options: {
      id: l,
      text: p,
      name: p,
      xPos: u,
      yPos: w,
      width: n,
      height: y,
      shapeHint: "rectangle",
      backgroundColor: P,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: d } = B(t), i = 152, h = i + 12, f = t.lanes.some((l) => l.station?.image);
  t.lanes.forEach((l, p) => {
    const u = d[p].x, w = d[p].y + (f ? (l.station?.row ?? 0) * h : 0), y = l.station?.image, P = t.kind === "release-plan" ? l.label + `
` + (l.capacity ? A(t, l.id) + " / " + l.capacity + " points" : A(t, l.id) + " points") : l.label;
    c(E(l.id), P, u, w, a - 12, j[p]), y && s.push({ options: {
      id: C(l.id),
      name: y.alt,
      text: "",
      xPos: u,
      yPos: w + a,
      width: n,
      height: i,
      shapeHint: "rectangle",
      image: y.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((b) => b.laneId === l.id).forEach((b, z) => c(x(b.id), t.kind === "release-plan" ? b.label + `
` + b.points + " points" : b.label, u, w + a + (y ? h : 0) + z * o, r, "#fffdf6"));
  });
  for (const l of t.lanes) {
    if (!l.station) continue;
    const p = s.find((u) => u.options.id === E(l.id));
    p.relationships.associations = l.station.next.map((u) => ({ id: l.id + "-to-" + u, parentId: p.options.id, childId: E(u), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), p.options.text = l.label + `
` + l.station.outcome, p.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const l = new Map(s.map((p) => [p.options.id, p]));
    for (const p of t.cards)
      for (const u of p.dependsOn ?? []) {
        const w = x(u), y = x(p.id);
        l.get(w).relationships.associations.push({
          id: `dependency-${u.length}-${u}-${p.id}`,
          parentId: w,
          childId: y,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: t.title }, shareId: "", nodes: s };
}
const pe = {
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
  ce as addWorkshopBranch,
  $ as availableLanes,
  H as canHangPanel,
  de as createWorkshopMap,
  ae as decodeWorkshopFragment,
  re as describeFocusDarkroom,
  se as encodeWorkshopFragment,
  Z as handoffSummary,
  te as hangGalleryPanel,
  pe as industrialWorkshop,
  oe as initialFocusDarkroom,
  j as laneColors,
  v as listeningRoom,
  K as listeningRoomCaption,
  X as moonGallery,
  le as moveWorkshopCard,
  he as nightTransfer,
  ne as normalizeFocusDarkroom,
  _ as normalizeListeningRoom,
  ee as normalizeMoonGallery,
  J as normalizeOfflineHandoff,
  q as offlineHandoff,
  M as printFields,
  A as releaseLoad,
  Q as releasePlan,
  Y as resolveHandoff,
  D as resolveWorkshopSignals,
  V as reviewHandoff,
  L as validateWorkshop,
  F as workshopLayout,
  B as workshopPositions,
  O as workshopPresentationLanes,
  ie as workshopPresentationScenes,
  fe as workshopToSlate
};
