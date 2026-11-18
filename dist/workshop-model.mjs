const Q = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function X(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: n, stage: r, choice: o, fieldNote: s, deskNote: i, fallback: d } = e, l = (a) => typeof a == "string" && a.trim().length > 0 && a.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(a);
  return t !== "offline-handoff" || n !== 1 || r !== "queued" && r !== "review" && r !== "resolved" || (r === "resolved" ? o !== "field" && o !== "desk" : o !== null) || o === void 0 || !l(s) || !l(i) || !l(d) ? null : { kind: t, version: n, stage: r, choice: o, fieldNote: s.trim(), deskNote: i.trim(), fallback: d.trim() };
}
function ee(e) {
  return { ...e, stage: "review", choice: null };
}
function te(e, t) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: t } : e;
}
function ne(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const x = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function re(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: n, mix: r, leftLabel: o, rightLabel: s } = e, i = (d) => typeof d == "string" && d.trim().length > 0 && d.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(d);
  return t !== "listening-room" || n !== 1 || typeof r != "number" || !Number.isFinite(r) || r < 0 || r > 1 || !i(o) || !i(s) ? null : { kind: t, version: n, mix: r, leftLabel: o.trim(), rightLabel: s.trim() };
}
function oe({ mix: e, leftLabel: t, rightLabel: n }) {
  return e < 0.32 ? t === x.leftLabel ? "Rain ticks on the copper roof." : "You hear " + t + "." : e > 0.68 ? n === x.rightLabel ? "Glass chimes ring, then fade." : "You hear " + n + "." : t === x.leftLabel && n === x.rightLabel ? "Rain and glass chimes overlap." : t + " and " + n + " overlap.";
}
function A(e, t) {
  return e.cards.reduce((n, r) => n + (r.laneId === t ? r.points ?? 1 : 0), 0);
}
function J(e) {
  const t = new Map(e.cards.map((i) => [i.id, i])), n = new Map(e.lanes.map((i, d) => [i.id, d])), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  function s(i) {
    if (!r.has(i.id)) {
      if (o.has(i.id)) throw new Error("Release dependencies must be acyclic.");
      o.add(i.id);
      for (const d of i.dependsOn ?? []) {
        const l = t.get(d);
        if (!l) throw new Error("A release dependency refers to an unknown feature.");
        if (n.get(l.laneId) > n.get(i.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(l);
      }
      o.delete(i.id), r.add(i.id);
    }
  }
  for (const i of e.cards) s(i);
  for (const i of e.lanes) {
    if (i.station) throw new Error("Release windows cannot also be map stations.");
    if (A(e, i.id) > (i.capacity ?? 1 / 0)) throw new Error(`Release "${i.label}" exceeds its point budget.`);
  }
}
function O(e, t, n) {
  if (n === t.laneId) return e;
  const r = new Map(e.lanes.map((c, h) => [c.id, h])), o = r.get(n);
  if (o === void 0) return null;
  const s = o < r.get(t.laneId), i = /* @__PURE__ */ new Set([t.id]), d = [t];
  for (; d.length; ) {
    const c = d.pop();
    for (const h of e.cards) {
      if (i.has(h.id)) continue;
      const u = r.get(h.laneId);
      (s ? u > o && c.dependsOn?.includes(h.id) : u < o && h.dependsOn?.includes(c.id)) && (i.add(h.id), d.push(h));
    }
  }
  if (e.cards.filter((c) => i.has(c.id)).some((c) => c.allowedLaneIds && !c.allowedLaneIds.includes(n))) return null;
  const a = { ...e, cards: e.cards.map((c) => i.has(c.id) ? { ...c, laneId: n } : c) }, p = e.lanes[o].capacity;
  return p !== void 0 && A(a, n) > p ? null : a;
}
const ie = {
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
}, se = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ae(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.kind !== "moon-gallery" || t.version !== 1 || !Array.isArray(t.panels) || t.panels.length !== 3 || !Array.isArray(t.hung)) return null;
  const n = [];
  for (const s of t.panels) {
    if (!s || typeof s.id != "string" || !/^[a-z][\w-]{0,31}$/.test(s.id) || typeof s.label != "string" || !s.label.trim() || s.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(s.artwork) || !(s.after === null || typeof s.after == "string")) return null;
    n.push({ id: s.id, label: s.label.trim(), artwork: s.artwork, after: s.after });
  }
  const r = new Map(n.map((s) => [s.id, s])), o = [...new Set(t.hung)];
  if (r.size !== n.length || o.length !== t.hung.length || o.some((s) => !r.has(s))) return null;
  for (const s of n) {
    const i = /* @__PURE__ */ new Set([s.id]);
    let d = s.after;
    for (; d !== null; ) {
      if (i.has(d) || !r.has(d) || o.includes(s.id) && !o.includes(d)) return null;
      i.add(d), d = r.get(d).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: n, hung: o };
}
function V(e, t) {
  const n = e.panels.find((r) => r.id === t);
  return !!n && !e.hung.includes(t) && (n.after === null || e.hung.includes(n.after));
}
function le(e, t) {
  return V(e, t) ? { ...e, hung: [...e.hung, t] } : e;
}
const U = ["firstPrint", "secondPrint", "thirdPrint"], R = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function de(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const t = e;
  if (t.kind !== void 0 && t.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (t.version !== 1) throw new Error("Unknown darkroom version.");
  if (t.route !== null && t.route !== "start" && t.route !== "opener") throw new Error("Unknown return path.");
  const n = { ...R, route: t.route };
  for (const r of U) {
    const o = t[r];
    if (typeof o != "string" || !o.trim() || o.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    n[r] = o.trim();
  }
  return n;
}
function ce(e = new URLSearchParams()) {
  const t = { ...R };
  for (const r of U) {
    const o = e.get(r)?.trim();
    o && o.length <= 48 && (t[r] = o);
  }
  const n = e.get("route");
  return (n === "start" || n === "opener") && (t.route = n), t;
}
function pe(e) {
  const t = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + t;
}
function v(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function w(e, t = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > t)
    throw new Error(`Labels must contain 1 to ${t} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function F(e) {
  const t = v(e);
  let n;
  try {
    n = new URL(w(t.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (n.protocol !== "https:" || n.username || n.password || n.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: n.href, alt: w(t.alt, 240) };
}
function m(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function y(e, t) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${t}.`);
}
function $({ lanes: e, presentationOrder: t }) {
  if (t === void 0) return e.slice();
  if (!Array.isArray(t) || t.length !== e.length || new Set(t).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(t, (n) => {
    const r = e.find((o) => o.id === n);
    if (!r) throw new Error("Presentation order refers to an unknown lane.");
    return r;
  });
}
function Y(e) {
  return (e.signals ?? []).map((t) => {
    const n = e.cards.some((r) => r.id === t.cardId && r.laneId === t.laneId);
    return { ...t, present: n, text: n ? t.whenPresent : t.whenAbsent };
  });
}
const E = (e) => "lane-" + e, L = (e) => "card-" + e, z = (e) => "image-" + e;
function he(e) {
  const t = Y(e);
  return $(e).map((n) => {
    const r = e.cards.filter((i) => i.laneId === n.id), o = t.filter((i) => i.laneId === n.id), s = [E(n.id)];
    return n.station?.image && s.push(z(n.id)), { lane: n, cards: r, signals: o, nodeIds: [...s, ...r.map((i) => L(i.id))] };
  });
}
const D = 5, Z = 24, P = 3;
function b(e) {
  const t = v(e);
  if (t.version !== 1) throw new Error("Unsupported workshop version.");
  if (t.kind !== void 0 && t.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const n = t.kind === "release-plan", r = w(t.title, 120);
  if (!Array.isArray(t.lanes) || t.lanes.length < 2 || t.lanes.length > D)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(t.cards) || t.cards.length > Z)
    throw new Error("A workshop supports up to 24 cards.");
  const o = t.lanes.map((l) => {
    const a = v(l), p = { id: m(a.id), label: w(a.label) };
    if (a.capacity !== void 0) {
      const c = n ? 576 : 24;
      if (typeof a.capacity != "number" || !Number.isInteger(a.capacity) || a.capacity < 1 || a.capacity > c)
        throw new Error(`Lane capacity must be a whole number from 1 to ${c}.`);
      p.capacity = a.capacity;
    }
    if (a.station !== void 0) {
      const c = v(a.station), h = (f) => {
        if (typeof f != "number" || !Number.isInteger(f) || f < 0 || f >= P)
          throw new Error("Use map coordinates from 0 to 2.");
        return f;
      };
      if (!Array.isArray(c.next) || c.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const u = c.next.map(m);
      y(u, "onward stop"), p.station = { column: h(c.column), row: h(c.row), next: u, outcome: w(c.outcome, 160) }, c.image !== void 0 && (p.station.image = F(c.image));
    }
    return p;
  }), s = o.map((l) => l.id);
  if (y(s, "lane ID"), (n || o.some((l) => l.station)) && !t.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (o.some((l) => l.station)) {
    if (!o.every((l) => l.station)) throw new Error("Give every station on the map a position.");
    y(o.map((l) => l.station.column + "," + l.station.row), "map position");
    for (const l of o)
      if (l.station.next.some((a) => a === l.id || !s.includes(a))) throw new Error("Connect each stop to another station on this map.");
  }
  const i = t.cards.map((l) => {
    const a = v(l), p = { id: m(a.id), label: w(a.label), laneId: m(a.laneId) };
    if (!s.includes(p.laneId)) throw new Error("Card refers to an unknown lane.");
    if (a.allowedLaneIds !== void 0) {
      if (!Array.isArray(a.allowedLaneIds) || a.allowedLaneIds.length > o.length) throw new Error("Invalid allowed lanes.");
      if (p.allowedLaneIds = a.allowedLaneIds.map(m), y(p.allowedLaneIds, "allowed lane"), !p.allowedLaneIds.includes(p.laneId) || !p.allowedLaneIds.every((c) => s.includes(c)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (n) {
      if (typeof a.points != "number" || !Number.isInteger(a.points) || a.points < 1 || a.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (p.points = a.points, a.dependsOn !== void 0) {
        if (!Array.isArray(a.dependsOn) || a.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        p.dependsOn = a.dependsOn.map(m), y(p.dependsOn, "dependency");
      }
    }
    return p;
  });
  y(i.map((l) => l.id), "card ID");
  const d = { version: 1, title: r, lanes: o, cards: i };
  if (t.experience !== void 0) {
    const l = v(t.experience);
    if (l.version !== 1 || l.kind !== "customer-interviews" && l.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    d.experience = { version: 1, kind: l.kind };
  }
  if (t.signals !== void 0) {
    if (!Array.isArray(t.signals) || t.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    d.signals = t.signals.map((l) => {
      const a = v(l), p = m(a.cardId), c = m(a.laneId);
      if (!i.some((h) => h.id === p) || !s.includes(c))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: m(a.id),
        label: w(a.label),
        cardId: p,
        laneId: c,
        whenPresent: w(a.whenPresent, 160),
        whenAbsent: w(a.whenAbsent, 160)
      };
    }), y(d.signals.map((l) => l.id), "placement outcome ID");
  }
  if (t.presentationOrder !== void 0) {
    if (!Array.isArray(t.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    d.presentationOrder = $({ lanes: o, presentationOrder: t.presentationOrder }).map((l) => l.id);
  }
  if (n)
    return d.kind = "release-plan", J(d), d;
  for (const l of o)
    if (i.filter((a) => a.laneId === l.id).length > (l.capacity ?? 1 / 0))
      throw new Error(`Lane "${l.label}" exceeds its capacity.`);
  return d;
}
const G = 65536;
function ue(e) {
  const t = JSON.stringify(b(e)), n = "#" + new URLSearchParams({ model: t }).toString();
  if (n.length > G) throw new Error("This workshop is too large to open from a link.");
  return n;
}
function fe(e) {
  if (e.length > G) throw new Error("This workshop is too large to open from a link.");
  const t = new URLSearchParams(e.slice(1)), n = t.get("model");
  if (!e.startsWith("#") || !n || Array.from(t.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let r;
  try {
    r = JSON.parse(n);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return b(r);
}
function W(e, t) {
  if (e.kind === "release-plan") return e.lanes.filter((r) => O(e, t, r.id) !== null);
  const n = e.lanes.find((r) => r.id === t.laneId)?.station;
  return e.lanes.filter((r) => r.id === t.laneId || (!n || n.next.includes(r.id)) && (!t.allowedLaneIds || t.allowedLaneIds.includes(r.id)) && e.cards.filter((o) => o.laneId === r.id).length < (r.capacity ?? 1 / 0));
}
function N(e, t, n) {
  const r = e.cards.find((o) => o.id === t);
  if (r && e.kind === "release-plan") {
    const o = O(e, r, n);
    if (!o) throw new Error("Move is unavailable.");
    return o;
  }
  if (!r || !W(e, r).some((o) => o.id === n)) throw new Error("Move is unavailable.");
  return r.laneId === n ? e : { ...e, cards: e.cards.map((o) => o === r ? { ...r, laneId: n } : o) };
}
const B = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, K = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function _(e, t = B, n = 28) {
  const { pitch: r, row: o, top: s } = t, i = !!e.lanes[0].station, d = e.lanes.map((p) => e.cards.filter((c) => c.laneId === p.id).length), l = s + Math.max(1, ...d) * o + 36, a = e.lanes.map((p, c) => ({
    x: i ? p.station.column * (r + n) : c * r,
    y: i ? p.station.row * l : 0
  }));
  return {
    points: a,
    width: Math.max(...a.map((p) => p.x)) + r,
    height: Math.max(...a.map((p, c) => p.y + s + (i ? Math.max(1, d[c]) : d[c] + 1) * o))
  };
}
function we() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function T(e, t) {
  const n = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((o) => o.id));
  let r = 1;
  for (; n.has(t + "-" + r); ) r++;
  return t + "-" + r;
}
function H(e) {
  const t = b(e);
  if (t.kind || t.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return t;
}
function me(e, t) {
  const n = H(e), r = T(n, "lane");
  return n.lanes.push({ id: r, label: t.label, ...t.capacity === void 0 ? {} : { capacity: t.capacity } }), n.presentationOrder?.push(r), b(n);
}
function ge(e, t, n) {
  const r = H(e);
  return r.cards.push({
    id: T(r, "card"),
    label: n.label,
    laneId: t,
    ...n.allowedLaneIds === void 0 ? {} : { allowedLaneIds: n.allowedLaneIds }
  }), b(r);
}
function ke() {
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
function ye(e, t, n) {
  const r = b(e);
  if (r.kind || !r.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const o = r.lanes.find((p) => p.id === t);
  if (!o?.station) throw new Error("Choose a station on this map.");
  if (r.lanes.length >= D) throw new Error("A map can have up to five stations.");
  const s = w(n?.label), i = w(n?.outcome, 160), d = T(r, "station");
  let l, a = 1 / 0;
  for (let p = 0; p < P; p++)
    for (let c = 0; c < P; c++) {
      if (r.lanes.some((u) => u.station.column === c && u.station.row === p)) continue;
      const h = Math.abs(o.station.column - c) + Math.abs(o.station.row - p);
      h < a && (a = h, l = { column: c, row: p });
    }
  if (!l) throw new Error("There is no free station position.");
  return o.station.next.push(d), r.lanes.push({ id: d, label: s, station: { ...l, next: [], outcome: i, ...n.image === void 0 ? {} : { image: F(n.image) } } }), r.presentationOrder?.push(d), r;
}
const ve = {
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
function be(e) {
  const t = b(e), { width: n, row: r, height: o, top: s } = B, i = [];
  function d(h, u, f, g, k, S) {
    i.push({ options: {
      id: h,
      text: u,
      name: u,
      xPos: f,
      yPos: g,
      width: n,
      height: k,
      shapeHint: "rectangle",
      backgroundColor: S,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: l } = _(t), a = 152, p = a + 12, c = t.lanes.some((h) => h.station?.image);
  t.lanes.forEach((h, u) => {
    const f = l[u].x, g = l[u].y + (c ? (h.station?.row ?? 0) * p : 0), k = h.station?.image, S = t.kind === "release-plan" ? h.label + `
` + (h.capacity ? A(t, h.id) + " / " + h.capacity + " points" : A(t, h.id) + " points") : h.label;
    d(E(h.id), S, f, g, s - 12, K[u]), k && i.push({ options: {
      id: z(h.id),
      name: k.alt,
      text: "",
      xPos: f,
      yPos: g + s,
      width: n,
      height: a,
      shapeHint: "rectangle",
      image: k.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), t.cards.filter((I) => I.laneId === h.id).forEach((I, j) => d(L(I.id), t.kind === "release-plan" ? I.label + `
` + I.points + " points" : I.label, f, g + s + (k ? p : 0) + j * r, o, "#fffdf6"));
  });
  for (const h of t.lanes) {
    if (!h.station) continue;
    const u = i.find((f) => f.options.id === E(h.id));
    u.relationships.associations = h.station.next.map((f) => ({ id: h.id + "-to-" + f, parentId: u.options.id, childId: E(f), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), u.options.text = h.label + `
` + h.station.outcome, u.options.fontSize = 13;
  }
  if (t.kind === "release-plan") {
    const h = new Map(i.map((u) => [u.options.id, u]));
    for (const u of t.cards)
      for (const f of u.dependsOn ?? []) {
        const g = L(f), k = L(u.id);
        h.get(g).relationships.associations.push({
          id: `dependency-${f.length}-${f}-${u.id}`,
          parentId: g,
          childId: k,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: t.title }, shareId: "", nodes: i };
}
const Ie = {
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
}, M = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], C = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function xe() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: M.map(({ id: e, who: t, quote: n }) => ({ id: e, label: t + " · " + n, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: M.map(({ id: e, action: t, signal: n }) => ({ id: "test-" + e, label: t, cardId: e, laneId: "prototype", whenPresent: n, whenAbsent: "Still in the interview notes." }))
  };
}
function Ee() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...C.map(({ id: e, label: t, rate: n }) => ({ id: e, label: t + " · " + n }))],
    cards: ["First", "Second", "Third"].map((e, t) => ({ id: "fund-" + t, label: e + " $200", laneId: t === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function q(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((r) => r.station)) return;
  const t = e.experience.kind, n = t === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...C.map((r) => r.id)];
  if (!(e.lanes.length !== n.length || !e.lanes.every((r) => n.includes(r.id))) && !(t === "customer-interviews" && (!e.cards.every((r) => M.some((o) => o.id === r.id)) || e.cards.filter((r) => r.laneId === "prototype").length > 1)))
    return t;
}
function Le(e, t, n) {
  const r = q(e), o = e.cards.find((i) => i.id === t);
  if (!r || !o || o.laneId === n) return null;
  let s = e;
  if (r === "customer-interviews") {
    if (n !== "prototype") return null;
    const i = e.cards.find((d) => d.laneId === n);
    if (i) {
      if (!W(e, i).some((d) => d.id === "interviews")) return null;
      s = N(e, i.id, "interviews");
    }
  }
  return W(s, o).some((i) => i.id === n) ? N(s, t, n) : null;
}
function Ae(e, t) {
  if (q(e) !== "experiment-budget") return null;
  const n = C.find((s) => s.id === t), r = e.cards.filter((s) => s.laneId === t).length, o = r * (n?.per ?? 0);
  return { amount: r * 200, description: n ? o + " " + (o === 1 ? n.single : n.unit) : "unallocated" };
}
export {
  ye as addWorkshopBranch,
  ge as addWorkshopCard,
  me as addWorkshopLane,
  W as availableLanes,
  V as canHangPanel,
  C as channels,
  Ee as createBudgetWorkshop,
  xe as createInterviewWorkshop,
  we as createLaneWorkshop,
  ke as createWorkshopMap,
  fe as decodeWorkshopFragment,
  pe as describeFocusDarkroom,
  ue as encodeWorkshopFragment,
  ne as handoffSummary,
  le as hangGalleryPanel,
  Ie as industrialWorkshop,
  ce as initialFocusDarkroom,
  M as interviews,
  K as laneColors,
  x as listeningRoom,
  oe as listeningRoomCaption,
  Z as maxWorkshopCards,
  se as moonGallery,
  N as moveWorkshopCard,
  ve as nightTransfer,
  de as normalizeFocusDarkroom,
  re as normalizeListeningRoom,
  ae as normalizeMoonGallery,
  X as normalizeOfflineHandoff,
  Q as offlineHandoff,
  Le as planStartupMove,
  U as printFields,
  A as releaseLoad,
  ie as releasePlan,
  te as resolveHandoff,
  Y as resolveWorkshopSignals,
  ee as reviewHandoff,
  q as startupExperienceKind,
  b as validateWorkshop,
  Ae as workshopBudgetResult,
  B as workshopLayout,
  _ as workshopPositions,
  $ as workshopPresentationLanes,
  he as workshopPresentationScenes,
  be as workshopToSlate
};
