const In = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function vn(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: r, fieldNote: a, deskNote: d, fallback: f } = e, u = (w) => typeof w == "string" && w.trim().length > 0 && w.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(w);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !u(a) || !u(d) || !u(f) ? null : { kind: n, version: o, stage: t, choice: r, fieldNote: a.trim(), deskNote: d.trim(), fallback: f.trim() };
}
function xn(e) {
  return { ...e, stage: "review", choice: null };
}
function Sn(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Pn(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const de = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function En(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: r, rightLabel: a } = e, d = (f) => typeof f == "string" && f.trim().length > 0 && f.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(f);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !d(r) || !d(a) ? null : { kind: n, version: o, mix: t, leftLabel: r.trim(), rightLabel: a.trim() };
}
function Cn({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === de.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === de.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === de.leftLabel && o === de.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function Q(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function Xe(e) {
  const n = new Map(e.cards.map((d) => [d.id, d])), o = new Map(e.lanes.map((d, f) => [d.id, f])), t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function a(d) {
    if (!t.has(d.id)) {
      if (r.has(d.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(d.id);
      for (const f of d.dependsOn ?? []) {
        const u = n.get(f);
        if (!u) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(u.laneId) > o.get(d.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        a(u);
      }
      r.delete(d.id), t.add(d.id);
    }
  }
  for (const d of e.cards) a(d);
  for (const d of e.lanes) {
    if (d.station) throw new Error("Release windows cannot also be map stations.");
    if (Q(e, d.id) > (d.capacity ?? 1 / 0)) throw new Error(`Release "${d.label}" exceeds its point budget.`);
  }
}
function pe(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((y, k) => [y.id, k])), r = t.get(o);
  if (r === void 0) return null;
  const a = r < t.get(n.laneId), d = /* @__PURE__ */ new Set([n.id]), f = [n];
  for (; f.length; ) {
    const y = f.pop();
    for (const k of e.cards) {
      if (d.has(k.id)) continue;
      const g = t.get(k.laneId);
      (a ? g > r && y.dependsOn?.includes(k.id) : g < r && k.dependsOn?.includes(y.id)) && (d.add(k.id), f.push(k));
    }
  }
  if (e.cards.filter((y) => d.has(y.id)).some((y) => y.allowedLaneIds && !y.allowedLaneIds.includes(o))) return null;
  const w = { ...e, cards: e.cards.map((y) => d.has(y.id) ? { ...y, laneId: o } : y) }, b = e.lanes[r].capacity;
  return b !== void 0 && Q(w, o) > b ? null : w;
}
const $n = {
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
}, ce = Object.freeze({
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  fontColor: "#000000",
  borderColor: "#cccccc",
  borderWidth: 1
}), An = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Mn(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const a of n.panels) {
    if (!a || typeof a.id != "string" || !/^[a-z][\w-]{0,31}$/.test(a.id) || typeof a.label != "string" || !a.label.trim() || a.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(a.artwork) || !(a.after === null || typeof a.after == "string")) return null;
    o.push({ id: a.id, label: a.label.trim(), artwork: a.artwork, after: a.after });
  }
  const t = new Map(o.map((a) => [a.id, a])), r = [...new Set(n.hung)];
  if (t.size !== o.length || r.length !== n.hung.length || r.some((a) => !t.has(a))) return null;
  for (const a of o) {
    const d = /* @__PURE__ */ new Set([a.id]);
    let f = a.after;
    for (; f !== null; ) {
      if (d.has(f) || !t.has(f) || r.includes(a.id) && !r.includes(f)) return null;
      d.add(f), f = t.get(f).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: r };
}
function en(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function Ln(e, n) {
  return en(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const He = ["firstPrint", "secondPrint", "thirdPrint"], Ge = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Tn(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...Ge, route: n.route };
  for (const t of He) {
    const r = n[t];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = r.trim();
  }
  return o;
}
function Wn(e = new URLSearchParams()) {
  const n = { ...Ge };
  for (const t of He) {
    const r = e.get(t)?.trim();
    r && r.length <= 48 && (n[t] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function Rn(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function nn(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = sn(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), on(n), n;
}
function tn(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function on(e) {
  return e && tn(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function rn(e) {
  return {
    id: e.id || `${e.parentId}->${e.childId}`,
    childId: e.childId,
    parentId: e.parentId,
    isStraightLine: e.isStraightLine ?? e.blnStraight ?? !1,
    lineColor: e.lineColor || "#666666",
    lineEffect: e.lineEffect || "",
    lineOpacity: e.lineOpacity ?? 1,
    lineType: e.lineType || "bezier",
    lineCurveType: e.lineCurveType || "cubic",
    lineCurviness: e.lineCurviness ?? 0.1,
    lineWidth: e.lineWidth ?? 3,
    showParentArrow: e.showParentArrow ?? !1,
    showChildArrow: e.showChildArrow ?? !0,
    sourcePoint: e.sourcePoint ?? null,
    targetPoint: e.targetPoint ?? null,
    sourceAnchor: e.sourceAnchor ?? null,
    targetAnchor: e.targetAnchor ?? null,
    label: e.label ?? ""
  };
}
function sn(e) {
  return {
    rect: "rectangle",
    rectangle: "rectangle",
    roundedrectangle: "roundedrectangle",
    ellipse: "ellipse",
    circle: "circle",
    star: "star",
    trapezium: "trapezium",
    triangle: "triangle",
    pentagon: "pentagon",
    parallelogram: "parallelogram",
    octagon: "octagon",
    hexagon: "hexagon",
    rarrow: "rarrow",
    larrow: "larrow"
  }[e.toLowerCase()] || e;
}
function an() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const ln = "#1f7a5c", dn = "#5b9a85", Te = "#c2410c", cn = { canMove: !1, canSelect: !1 };
function un(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function On(e, n, o = {}) {
  let t = D(n), r = null, a = !!o.readOnly, d = !1;
  const f = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
  let k = null, g = null, v = null, $ = Promise.resolve(), T = null, A = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const F = { ...o.style };
  let W = /* @__PURE__ */ new Map(), K = null, S = !1;
  _(t, { layout: A });
  const E = o.origin ? { x: o.origin.x, y: o.origin.y } : hn(e), H = (i) => y.get(i) ?? i, L = (i) => un(H(i));
  function M(i) {
    const s = b.get(i);
    if (s) return s;
    if (f.has(i) && !y.has(i) || !e.nodes.one?.(i)) return i;
    const m = Je(i, (h) => !!e.nodes.one?.(h) || y.has(h));
    return b.set(i, m), y.set(m, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${m}".`), m;
  }
  const z = {
    governs(i) {
      if (f.get(i.id) !== i) return null;
      const s = L(i.id)?.kind;
      return s === "card" ? { canMove: !a, canEditText: !a && !r && t.kind !== "release-plan" } : s === "lane" ? { canMove: !1, canEditText: !a && !r } : cn;
    },
    onStart(i, s) {
      const m = L(i.id).key;
      if (a || r || !t.cards.some((l) => l.id === m)) return !1;
      q(), le();
      const h = { x: s.x - (i.options.x ?? 0), y: s.y - (i.options.y ?? 0) };
      let I = null;
      try {
        I = o.chooseCandidate?.(t, m, h) ?? null;
      } catch (l) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", l);
      }
      return k = { cardId: m, evaluate: I, outcome: { kind: "home" } }, R(t, { skip: m }), !0;
    },
    onMove(i, s) {
      if (!k) return;
      const m = ee(k.cardId, s, k.evaluate);
      if (fn(m, k.outcome)) return;
      k.outcome = m;
      const h = m.kind === "candidate" ? m.next : null;
      R(h ?? t, { skip: k.cardId }), N(o.onPreview, h);
    },
    onEnd(i, s) {
      if (!k) return { accept: !1 };
      const { cardId: m, evaluate: h } = k, I = ee(m, s, h), l = t.cards.find((p) => p.id === m);
      if (k = null, N(o.onPreview, null), I.kind === "candidate") {
        t = I.next, R(t, { skip: m });
        const p = t.lanes.find((x) => x.id === I.laneId);
        e.announce?.(`${l.label} moved to ${p.label}. ${re(t, p.id)}.`), N(o.onChange, t, { cardId: m, laneId: I.laneId });
        const c = Ye(t, H(i.id));
        return c ? { accept: !0, settle: c } : { accept: !0 };
      }
      return I.kind === "refused" ? Qe(l.label, { cardId: m, laneId: I.laneId, reason: I.reason }) : (R(t, { skip: m }), I.kind === "outside" && (e.announce?.(`${l.label} was not dropped on a lane. It stays where it was.`), N(o.onRefuse, { cardId: m, laneId: null, reason: "" }))), { accept: !1 };
    },
    onCancel(i) {
      const s = k && t.cards.find((m) => m.id === k.cardId);
      k = null, N(o.onPreview, null), R(t, { skip: L(i.id)?.key }), s && e.announce?.(`Move cancelled. ${s.label} stays where it was.`);
    },
    onTextCommit(i, s, m) {
      const h = L(i.id);
      if (!h || a || r) return !1;
      const I = s.replace(/\s+/g, " ").trim(), l = h.kind === "lane" ? { laneId: h.key, label: I } : { cardId: h.key, label: I };
      let p;
      try {
        p = D(h.kind === "lane" ? { ...t, lanes: t.lanes.map((c) => c.id === h.key ? { ...c, label: I } : c) } : { ...t, cards: t.cards.map((c) => c.id === h.key ? { ...c, label: I } : c) });
      } catch (c) {
        const x = c instanceof Error ? c.message : "That name is not allowed.";
        return e.announce?.(`${m} keeps its name. ${x}`), N(o.onRefuse, { ...h.kind === "lane" ? { laneId: h.key } : { cardId: h.key }, rename: l, reason: x }), !1;
      }
      return I === m ? !1 : (t = p, R(t), e.announce?.(`${m} renamed to ${I}.`), N(o.onChange, t, { rename: l }), I);
    },
    onKeyDown(i, s) {
      const m = L(i.id);
      if (m?.kind !== "card" || a || r || k || s.ctrlKey || s.metaKey || s.altKey) return !1;
      const h = t.cards.find((I) => I.id === m.key);
      if (!h) return !1;
      if (s.key === "ArrowLeft" || s.key === "ArrowRight")
        return s.preventDefault(), Ee(h.id, s.key === "ArrowLeft" ? -1 : 1), !0;
      if ((s.key === "ArrowUp" || s.key === "ArrowDown") && se())
        return s.preventDefault(), Ee(h.id, s.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (g?.cardId !== h.id) return !1;
      if (s.key === "Enter") {
        s.preventDefault();
        const { laneId: I, next: l } = g;
        g = null, t = l, R(t), ae(I), N(o.onPreview, null);
        const p = t.lanes.find((c) => c.id === I);
        return e.announce?.(`${h.label} moved to ${p.label}. ${re(t, I)}.`), N(o.onChange, t, { cardId: h.id, laneId: I }), !0;
      }
      return s.key === "Escape" ? (s.preventDefault(), le(), e.announce?.(`Move cancelled. ${h.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((s) => f.get(s.id) === s).map((s) => s.id);
      S = i.length === 1, f.clear(), u.clear(), w.clear(), b.clear(), y.clear(), k = null, g = null, R(r ?? t, { animate: !1 }), i.length === 1 && ($ = $.then(() => {
        S = !1;
        const s = f.get(i[0]);
        if (!d && s && !(e.getSelectedNodes?.() ?? []).length) {
          const m = () => e.selectNodes?.([s]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(m) : m();
        }
        ye();
      }));
    }
  }, G = e.setDragPolicy(z), ge = o.onSelect && e.onSelectionChange?.(() => ye()), X = () => {
    g && le();
  };
  e.element?.addEventListener?.("pointerdown", X, !0), R(t, { animate: !1 });
  function ee(i, s, m) {
    const h = t.cards.find((C) => C.id === i);
    if (!h) return { kind: "outside" };
    const I = t.lanes.map((C) => f.get(M(oe.column(C.id)))).filter(Boolean), l = e.hitTestNodes(s, I, { padding: 6 }), p = l ? L(l.id).key : null;
    if (!p) return { kind: "outside" };
    if (p === h.laneId) return { kind: "home" };
    const c = he(t, i, p);
    if (!c) return { kind: "refused", laneId: p, reason: Re(t, i, p) ?? "That move is not available." };
    if (!m) return { kind: "candidate", laneId: p, next: c };
    let x = null;
    try {
      x = m({ x: s.x - E.x, y: s.y - E.y });
    } catch (C) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", C), { kind: "candidate", laneId: p, next: c };
    }
    const P = x?.cards.find((C) => C.id === i)?.laneId;
    return !x || !P || P === h.laneId ? { kind: "home" } : { kind: "candidate", laneId: P, next: x };
  }
  function se() {
    return new Set(_(t, { layout: A }).places.map((i) => i.row)).size > 1;
  }
  function Ee(i, s, m = !1) {
    const h = t.cards.find((P) => P.id === i), I = We(t, i), l = g?.cardId === i ? g.laneId : h.laneId;
    let p;
    if (m) {
      const { places: P } = _(t, { layout: A }), C = P.find((O) => O.laneId === l);
      p = P.filter((O) => O.column === C.column && (O.row - C.row) * s > 0).sort((O, Z) => (O.row - Z.row) * s).map((O) => t.lanes.find((Z) => Z.id === O.laneId));
    } else {
      const P = t.lanes.findIndex((C) => C.id === l);
      p = s > 0 ? t.lanes.slice(P + 1) : t.lanes.slice(0, P).reverse();
    }
    const c = p.find((P) => I.includes(P));
    if (q(), !c) {
      const P = p[0];
      if (!P) {
        e.announce?.(`${h.label} has no lane to move to on that side.`);
        return;
      }
      const C = Re(t, i, P.id) ?? "That move is not available.";
      v = { laneId: P.id, reason: C, timer: setTimeout(() => q(), 1500) }, R(g?.next ?? r ?? t), ae(P.id, g?.next ?? r ?? t), e.announce?.(`${h.label} can't move to ${P.label}. ${C}`), N(o.onRefuse, { cardId: i, laneId: P.id, reason: C });
      return;
    }
    if (c.id === h.laneId) {
      le(), ae(c.id, r ?? t), e.announce?.(`${h.label} is back in ${c.label}.`);
      return;
    }
    const x = he(t, i, c.id);
    g = { cardId: i, laneId: c.id, next: x }, R(x), ae(c.id, x), N(o.onPreview, x), e.announce?.(`${h.label} to ${c.label}: ${re(x, c.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function ae(i, s = t) {
    const m = _(s, { layout: A, rows: Ae() }).places.find((x) => x.laneId === i), h = e.canvas?.viewbox?.();
    if (!m || !h || !(h.width > 0) || !(h.height > 0)) return;
    const I = 16, l = (x, P, C, O) => P + I * 2 >= O || x - I < C ? x - I - C : x + P + I > C + O ? x + P + I - (C + O) : 0, p = l(E.x + m.x, m.width, h.x, h.width), c = l(E.y + m.y, m.height, h.y, h.height);
    (p || c) && e.panBy?.({ x: p, y: c });
  }
  function ye() {
    if (!o.onSelect || S) return;
    const i = d ? [] : e.getSelectedNodes?.() ?? [], s = i.length === 1 && f.get(i[0].id) === i[0] ? L(i[0].id) : null, m = s?.kind === "card" ? { cardId: s.key } : s?.kind === "lane" ? { laneId: s.key } : null, h = m ? JSON.stringify(m) : null;
    h !== K && (K = h, N(o.onSelect, m));
  }
  function le() {
    g && (g = null, N(o.onPreview, null), R(r ?? t));
  }
  function Qe(i, s) {
    q(!1), v = { laneId: s.laneId, reason: s.reason, timer: setTimeout(() => q(), 1500) }, R(t, { skip: s.cardId });
    const m = t.lanes.find((h) => h.id === s.laneId);
    e.announce?.(`${i} can't move to ${m?.label ?? "that lane"}. ${s.reason}`), N(o.onRefuse, s);
  }
  function q(i = !0) {
    v && (clearTimeout(v.timer), v = null, i && !d && Ce());
  }
  function Ce() {
    R(k && k.outcome.kind === "candidate" ? k.outcome.next : g?.next ?? r ?? t, { skip: k?.cardId });
  }
  function $e(i) {
    const s = Fe(i, { native: !0, origin: E, rows: Ae(), layout: A, style: F }).nodes, m = new Map(s.map((l) => [l.options.id, l.options])), h = (l, p, c, x = !1) => {
      const P = m.get(oe.column(l));
      P && (P.borderColor = p, P.borderWidth = c, delete P.borderStyle);
      const C = x && m.get(oe.lane(l));
      C && (C.borderColor = p, C.borderWidth = c);
    }, I = k?.cardId ?? g?.cardId;
    if (W = /* @__PURE__ */ new Map(), I) {
      const l = t.cards.find((c) => c.id === I)?.laneId;
      for (const c of We(t, I)) c.id !== l && (h(c.id, dn, 2), W.set(c.id, "open"));
      const p = k ? k.outcome : g ? { kind: "candidate", laneId: g.laneId } : null;
      p?.kind === "candidate" && (h(p.laneId, ln, 3, !0), W.set(p.laneId, "over")), p?.kind === "refused" && (h(p.laneId, Te, 3), W.set(p.laneId, "refused"));
    }
    if (v) {
      W.set(v.laneId, "refused"), h(v.laneId, Te, 3, !0);
      const l = m.get(oe.caption(v.laneId));
      l && (l.text = v.reason, l.foregroundColor = "#b42318");
    }
    for (const l of s) {
      l.options.id = M(l.options.id);
      for (const p of l.relationships.associations)
        p.parentId = M(p.parentId), p.childId = M(p.childId);
    }
    return s;
  }
  function Ae() {
    return k || g ? t.lanes.map((i) => t.cards.filter((s) => s.laneId === i.id).length) : void 0;
  }
  function R(i, s = {}) {
    if (d) return;
    T = { model: i, skip: s.skip, animate: s.animate !== !1 };
    const m = $e(i), h = [];
    for (const { options: l } of m) {
      const p = l.id;
      if (f.has(p)) continue;
      const c = e.nodes.add(nn(l));
      f.set(p, c), u.set(p, { ...l }), c.ready && h.push(c.ready.then(() => {
        if (f.get(p) !== c) return;
        c.applyGovernance?.(), L(p)?.kind === "column" && c.toBack?.(!1);
        const x = Me(T?.model ?? i, p);
        x && c.svgGroup?.node?.setAttribute("aria-label", x);
      }).catch(() => {
      }));
    }
    const I = T;
    $ = Promise.all([$, ...h]).then(() => {
      d || T !== I || Ze($e(I.model), I);
    }).catch((l) => console.warn("WORKSHOP: could not draw the workshop", l));
  }
  function Ze(i, s) {
    const m = new Set(i.map((I) => I.options.id)), h = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [l, p] of [...f]) {
        if (m.has(l)) continue;
        for (const [x, P] of [...w])
          P.parentId !== l && P.childId !== l || (P.parent.relationships?.removeAssociation(x), w.delete(x));
        e.deselectNode?.(p), p.editor?.cancelInline?.(), f.delete(l), u.delete(l);
        const c = y.get(l);
        c && (y.delete(l), b.delete(c)), e.nodes.remove(l);
      }
      for (const { options: l } of i) {
        const p = l.id, c = f.get(p);
        if (!c?.svgGroup) continue;
        const x = u.get(p) ?? {}, P = c.editor?.isInlineEditing?.();
        (l.fontSize !== x.fontSize || l.foregroundColor !== x.foregroundColor) && (c.options.fontSize = l.fontSize, c.options.fontColor = l.foregroundColor, c.applyTextStyle?.()), l.text !== x.text && !P && c.setText?.(l.text), (l.width !== x.width || l.height !== x.height) && (l.vectorPath ? (c.options.width = l.width, c.options.height = l.height, c.setShape?.(c.options.shape, l.vectorPath), L(p)?.kind === "column" && c.toBack?.(!1)) : c.setSize?.(l.width, l.height)), l.backgroundColor !== x.backgroundColor && c.setColors?.(l.backgroundColor), (l.borderColor !== x.borderColor || l.borderWidth !== x.borderWidth || l.borderStyle !== x.borderStyle) && (c.options.borderColor = l.borderColor, c.options.borderWidth = l.borderWidth, c.options.borderStyle = l.borderStyle, c.applyBorder?.());
        const C = l.xPos !== x.xPos || l.yPos !== x.yPos || Math.abs((c.options.x ?? 0) - l.xPos) > 0.5 || Math.abs((c.options.y ?? 0) - l.yPos) > 0.5;
        if (p !== (s.skip && M(oe.card(s.skip))) && C) {
          const te = s.animate && !an() ? 180 : 0, Le = h.includes(c) ? () => {
            !d && f.get(p) === c && (e.getSelectedNodes?.() ?? []).includes(c) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Le && te && h.length === 1 && c.resizeRotate?.disable?.(), c.position(l.xPos, l.yPos, Le, void 0, te);
        }
        const O = Me(s.model, p);
        O && c.svgGroup.node.getAttribute("aria-label") !== O && c.svgGroup.node.setAttribute("aria-label", O);
        const Z = L(p);
        if (Z?.kind === "column") {
          const te = W.get(Z.key);
          te ? c.svgGroup.node.setAttribute("data-workshop-drop", te) : c.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        u.set(p, { ...l });
      }
      const I = /* @__PURE__ */ new Map();
      for (const l of i) for (const p of l.relationships.associations) I.set(p.id, p);
      for (const [l, p] of [...w])
        I.has(l) && f.get(p.parentId) === p.parent && f.get(p.childId) === p.child || (p.parent.relationships?.removeAssociation(l), w.delete(l));
      for (const [l, p] of I) {
        if (w.has(l)) continue;
        const c = f.get(p.parentId), x = f.get(p.childId);
        !c?.relationships || !x?.svgGroup || (c.relationships.addAssociation(x, rn(p)), w.set(l, { parentId: p.parentId, childId: p.childId, parent: c, child: x }));
      }
    }), e.notifyNodeChanged?.();
  }
  function Me(i, s) {
    const m = L(s);
    if (m?.kind === "lane") {
      const h = i.lanes.find((I) => I.id === m.key);
      return h ? `${h.label}, ${re(i, h.id)}` : null;
    }
    if (m?.kind === "card") {
      const h = i.cards.find((l) => l.id === m.key), I = h && i.lanes.find((l) => l.id === h.laneId);
      return h && I ? `${h.label}, in ${I.label}` : null;
    }
    return null;
  }
  function Ye(i, s) {
    const m = Fe(i, { native: !0, origin: E, layout: A, style: F }).nodes.find((h) => h.options.id === s)?.options;
    return m ? { x: m.xPos, y: m.yPos } : null;
  }
  function ne() {
    k && e.cancelGovernedDrag?.("host"), k = null, g && (g = null, N(o.onPreview, null)), q(!1);
  }
  return {
    get value() {
      return t;
    },
    get origin() {
      return { ...E };
    },
    get layout() {
      return { ...A };
    },
    get bounds() {
      const { width: i, height: s } = _(t, { layout: A });
      return { x: E.x, y: E.y, width: i, height: s };
    },
    setLayout(i) {
      if (d) throw new Error("This workshop has been detached.");
      const s = i?.lanesPerRow === void 0 ? {} : { lanesPerRow: i.lanesPerRow };
      _(t, { layout: s }), s.lanesPerRow !== A.lanesPerRow && (ne(), A = s, R(r ?? t));
    },
    whenDrawn: () => $,
    update(i) {
      if (d) throw new Error("This workshop has been detached.");
      const s = D(i);
      ne(), t = s, R(r ?? t);
    },
    preview(i) {
      if (d) throw new Error("This workshop has been detached.");
      const s = i ? D(i) : null;
      ne(), r = s, R(r ?? t), e.refreshGovernance?.();
    },
    refuse(i, s) {
      const m = t.lanes.find((h) => h.id === i);
      d || !m || (q(!1), v = { laneId: i, reason: s, timer: setTimeout(() => q(), 1500) }, Ce(), e.announce?.(`${m.label}: ${s}`));
    },
    setReadOnly(i) {
      d || a === !!i || (ne(), a = !!i, R(r ?? t), e.refreshGovernance?.());
    },
    destroy() {
      d || (ne(), d = !0, e.element?.removeEventListener?.("pointerdown", X, !0), ge?.(), e.withPolicyAuthority(() => {
        for (const [i, s] of w) s.parent.relationships?.removeAssociation(i);
        for (const [i, s] of f)
          e.deselectNode?.(s), s.editor?.cancelInline?.(), e.nodes.one(i) === s && e.nodes.remove(i);
      }), w.clear(), f.clear(), u.clear(), b.clear(), y.clear(), G(), S = !1, ye(), e.notifyNodeChanged?.());
    }
  };
}
function N(e, ...n) {
  try {
    e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
  }
}
function fn(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function hn(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const r of n)
    o = Math.max(o, (r.options.x ?? 0) + (r.options.width ?? 0)), t = Math.min(t, r.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
function J(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function B(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function De(e) {
  const n = J(e);
  let o;
  try {
    o = new URL(B(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: B(n.alt, 240) };
}
function U(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function V(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Be({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((r) => r.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function pn(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Y = (e) => "lane-" + e, j = (e) => "card-" + e, we = (e) => "image-" + e;
function Nn(e) {
  const n = pn(e);
  return Be(e).map((o) => {
    const t = e.cards.filter((d) => d.laneId === o.id), r = n.filter((d) => d.laneId === o.id), a = [Y(o.id)];
    return o.station?.image && a.push(we(o.id)), { lane: o, cards: t, signals: r, nodeIds: [...a, ...t.map((d) => j(d.id))] };
  });
}
const Ue = 5, wn = 24, ke = 3;
function D(e) {
  const n = J(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = B(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > Ue)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > wn)
    throw new Error("A workshop supports up to 24 cards.");
  const r = n.lanes.map((u) => {
    const w = J(u), b = { id: U(w.id), label: B(w.label) };
    if (w.capacity !== void 0) {
      const y = o ? 576 : 24;
      if (typeof w.capacity != "number" || !Number.isInteger(w.capacity) || w.capacity < 1 || w.capacity > y)
        throw new Error(`Lane capacity must be a whole number from 1 to ${y}.`);
      b.capacity = w.capacity;
    }
    if (w.station !== void 0) {
      const y = J(w.station), k = (v) => {
        if (typeof v != "number" || !Number.isInteger(v) || v < 0 || v >= ke)
          throw new Error("Use map coordinates from 0 to 2.");
        return v;
      };
      if (!Array.isArray(y.next) || y.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const g = y.next.map(U);
      V(g, "onward stop"), b.station = { column: k(y.column), row: k(y.row), next: g, outcome: B(y.outcome, 160) }, y.image !== void 0 && (b.station.image = De(y.image));
    }
    return b;
  }), a = r.map((u) => u.id);
  if (V(a, "lane ID"), (o || r.some((u) => u.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (r.some((u) => u.station)) {
    if (!r.every((u) => u.station)) throw new Error("Give every station on the map a position.");
    V(r.map((u) => u.station.column + "," + u.station.row), "map position");
    for (const u of r)
      if (u.station.next.some((w) => w === u.id || !a.includes(w))) throw new Error("Connect each stop to another station on this map.");
  }
  const d = n.cards.map((u) => {
    const w = J(u), b = { id: U(w.id), label: B(w.label), laneId: U(w.laneId) };
    if (!a.includes(b.laneId)) throw new Error("Card refers to an unknown lane.");
    if (w.allowedLaneIds !== void 0) {
      if (!Array.isArray(w.allowedLaneIds) || w.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (b.allowedLaneIds = w.allowedLaneIds.map(U), V(b.allowedLaneIds, "allowed lane"), !b.allowedLaneIds.includes(b.laneId) || !b.allowedLaneIds.every((y) => a.includes(y)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (o) {
      if (typeof w.points != "number" || !Number.isInteger(w.points) || w.points < 1 || w.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (b.points = w.points, w.dependsOn !== void 0) {
        if (!Array.isArray(w.dependsOn) || w.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        b.dependsOn = w.dependsOn.map(U), V(b.dependsOn, "dependency");
      }
    }
    return b;
  });
  V(d.map((u) => u.id), "card ID");
  const f = { version: 1, title: t, lanes: r, cards: d };
  if (n.experience !== void 0) {
    const u = J(n.experience);
    if (u.version !== 1 || u.kind !== "customer-interviews" && u.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    f.experience = { version: 1, kind: u.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    f.signals = n.signals.map((u) => {
      const w = J(u), b = U(w.cardId), y = U(w.laneId);
      if (!d.some((k) => k.id === b) || !a.includes(y))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: U(w.id),
        label: B(w.label),
        cardId: b,
        laneId: y,
        whenPresent: B(w.whenPresent, 160),
        whenAbsent: B(w.whenAbsent, 160)
      };
    }), V(f.signals.map((u) => u.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    f.presentationOrder = Be({ lanes: r, presentationOrder: n.presentationOrder }).map((u) => u.id);
  }
  if (o)
    return f.kind = "release-plan", Xe(f), f;
  for (const u of r)
    if (d.filter((w) => w.laneId === u.id).length > (u.capacity ?? 1 / 0))
      throw new Error(`Lane "${u.label}" exceeds its capacity.`);
  return f;
}
const qe = 65536;
function zn(e) {
  const n = JSON.stringify(D(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > qe) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function Fn(e) {
  if (e.length > qe) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return D(t);
}
function fe(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => pe(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((r) => r.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function be(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  if (t && e.kind === "release-plan") {
    const r = pe(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !fe(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
function he(e, n, o) {
  const t = e.cards.find((a) => a.id === n);
  if (!t || !e.lanes.some((a) => a.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return pe(e, t, o);
  const r = kn(e, n, o);
  return r || (o === "prototype" && Pe(e) === "customer-interviews" ? null : fe(e, t).some((a) => a.id === o) ? be(e, n, o) : null);
}
function We(e, n) {
  return e.lanes.filter((o) => he(e, n, o.id) !== null);
}
function Re(e, n, o) {
  if (he(e, n, o) !== null) return null;
  const t = e.cards.find((u) => u.id === n), r = e.lanes.find((u) => u.id === o);
  if (!t || !r) return "That move is not available.";
  const a = `This card can't go in ${r.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return a;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return a;
    const u = Q(e, o), w = { ...e, lanes: e.lanes.map((y) => y === r ? { id: r.id, label: r.label } : y) }, b = pe(w, t, o);
    return b ? `Needs ${Q(b, o) - u} points. Now holds ${u} of ${r.capacity} points.` : a;
  }
  const d = e.lanes.find((u) => u.id === t.laneId);
  if (d?.station && !d.station.next.includes(o)) return `${r.label} can't be reached from ${d.label}.`;
  const f = e.cards.filter((u) => u.laneId === o).length;
  return r.capacity !== void 0 && f >= r.capacity ? `Now holds ${f} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.` : a;
}
function re(e, n) {
  const o = e.lanes.find((a) => a.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const a = Q(e, n);
    return o.capacity ? a + " / " + o.capacity + " points" : a + " points";
  }
  const t = bn(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const r = e.cards.filter((a) => a.laneId === n).length;
  return o.capacity !== void 0 ? r + " of " + o.capacity : r + (r === 1 ? " card" : " cards");
}
const me = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, ue = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function je(e, n = me, o = 28) {
  const { pitch: t, row: r, top: a } = n, d = !!e.lanes[0].station, f = e.lanes.map((b) => e.cards.filter((y) => y.laneId === b.id).length), u = a + Math.max(1, ...f) * r + 36, w = e.lanes.map((b, y) => ({
    x: d ? b.station.column * (t + o) : y * t,
    y: d ? b.station.row * u : 0
  }));
  return {
    points: w,
    width: Math.max(...w.map((b) => b.x)) + t,
    height: Math.max(...w.map((b, y) => b.y + a + (d ? Math.max(1, f[y]) : f[y] + 1) * r))
  };
}
function Hn() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function xe(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Ke(e) {
  const n = D(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Gn(e, n) {
  const o = Ke(e), t = xe(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), D(o);
}
function Dn(e, n, o) {
  const t = Ke(e);
  return t.cards.push({
    id: xe(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), D(t);
}
function Bn() {
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
function Un(e, n, o) {
  const t = D(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = t.lanes.find((b) => b.id === n);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= Ue) throw new Error("A map can have up to five stations.");
  const a = B(o?.label), d = B(o?.outcome, 160), f = xe(t, "station");
  let u, w = 1 / 0;
  for (let b = 0; b < ke; b++)
    for (let y = 0; y < ke; y++) {
      if (t.lanes.some((g) => g.station.column === y && g.station.row === b)) continue;
      const k = Math.abs(r.station.column - y) + Math.abs(r.station.row - b);
      k < w && (w = k, u = { column: y, row: b });
    }
  if (!u) throw new Error("There is no free station position.");
  return r.station.next.push(f), t.lanes.push({ id: f, label: a, station: { ...u, next: [], outcome: d, ...o.image === void 0 ? {} : { image: De(o.image) } } }), t.presentationOrder?.push(f), t;
}
const qn = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Ve = (e) => "caption-" + e, ie = (e) => "column-" + e, oe = { lane: Y, card: j, image: we, caption: Ve, column: ie };
function Je(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Oe(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), r = e, a = n;
  return t ? `M ${t} 0 H ${r - t} Q ${r} 0 ${r} ${t} V ${a - t} Q ${r} ${a} ${r - t} ${a} H ${t} Q 0 ${a} 0 ${a - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${r} V ${a} H 0 Z`;
}
function Ne(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function ze(e, n, o, t) {
  for (let r = n; r > 11; r--) {
    const a = Math.max(1, Math.floor(o / (r * 0.55)));
    if (e.split(`
`).reduce((f, u) => f + Math.max(1, Math.ceil(u.length / a)), 0) * r * 1.3 <= t) return r;
  }
  return Math.min(n, 11);
}
const _e = 152, Ie = _e + 12, mn = 12;
function gn(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function _(e, n = {}) {
  const o = D(e), { pitch: t, row: r, top: a } = me, d = o.lanes.map((k) => o.cards.filter((g) => g.laneId === k.id).length), f = (k) => Math.max(d[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), u = !!o.lanes[0].station, w = o.lanes.some((k) => k.station?.image), b = gn(n.layout, o.lanes.length), y = [];
  if (u) {
    const { points: k } = je(o);
    o.lanes.forEach((g, v) => y.push({
      laneId: g.id,
      x: k[v].x,
      y: k[v].y + (w ? g.station.row * Ie : 0),
      width: t,
      height: a + (g.station.image ? Ie : 0) + Math.max(1, d[v]) * r,
      column: g.station.column,
      row: g.station.row
    }));
  } else {
    let k = 0;
    for (let g = 0; g < o.lanes.length; g += b) {
      const v = o.lanes.slice(g, g + b), $ = a + (Math.max(...v.map((T, A) => f(g + A))) + 1) * r;
      v.forEach((T, A) => y.push({ laneId: T.id, x: A * t, y: k, width: t, height: $, column: A, row: g / b })), k += $ + mn;
    }
  }
  return { places: y, width: Math.max(...y.map((k) => k.x + k.width)), height: Math.max(...y.map((k) => k.y + k.height)) };
}
function yn(e, n) {
  const { pitch: o, width: t, row: r, height: a, top: d } = me, f = n.origin ?? { x: 0, y: 0 }, u = !!e.lanes[0].station, { places: w } = _(e, n), b = n.style ?? {}, y = b.textColor ?? ce.fontColor, k = b.borderColor ?? ce.borderColor, g = b.borderWidth ?? ce.borderWidth, v = b.cornerRadius ?? 0, $ = b.fontSize ?? ce.fontSize, T = b.laneFontSize ?? $ + 2, A = b.captionFontSize ?? Math.max(11, $ - 1), F = [], W = (S) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: Oe(S.width, S.height, v),
      foregroundColor: y,
      borderColor: k,
      borderWidth: g,
      ...b.fontFamily ? { fontFamily: b.fontFamily } : {},
      ...S
    }, relationships: { associations: [] } };
    return F.push(E), E;
  };
  e.lanes.forEach((S, E) => {
    const H = w[E], L = f.x + H.x, M = f.y + H.y, z = S.station?.image;
    W({
      id: ie(S.id),
      text: "",
      name: S.label,
      xPos: L + 2,
      yPos: M,
      width: o - 4,
      height: H.height,
      vectorPath: Oe(o - 4, H.height, v ? v + 2 : 0),
      backgroundColor: u ? "#fcf9ed" : Ne(ue[E], 0.6),
      borderColor: u ? "#a8b5aa" : Ne(ue[E], 0.1),
      borderWidth: 1,
      ...u ? { borderStyle: "dashed" } : {}
    }), W({
      id: Y(S.id),
      text: S.label,
      name: S.label,
      xPos: L + 8,
      yPos: M + 6,
      width: t,
      height: 58,
      backgroundColor: ue[E],
      fontSize: ze(S.label, T, t - 16, 50)
    }), W({
      id: Ve(S.id),
      text: re(e, S.id),
      name: S.label,
      xPos: L + 8,
      yPos: M + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: A
    }), z && F.push({ options: {
      id: we(S.id),
      name: z.alt,
      text: "",
      xPos: L + 8,
      yPos: M + d,
      width: t,
      height: _e,
      shapeHint: "rectangle",
      image: z.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((G) => G.laneId === S.id).forEach((G, ge) => {
      const X = e.kind === "release-plan" ? G.label + `
` + G.points + " points" : G.label, ee = u ? t - 20 : t, se = u ? a - 6 : a;
      W({
        id: j(G.id),
        text: X,
        name: G.label,
        xPos: L + (u ? 18 : 8),
        yPos: M + d + (z ? Ie : 0) + ge * r,
        width: ee,
        height: se,
        backgroundColor: u ? "#ffda75" : "#fffdf6",
        fontSize: ze(X, $, ee - 16, se - 8)
      });
    });
  });
  const K = new Map(F.map((S) => [S.options.id, S]));
  for (const S of e.lanes)
    S.station && (K.get(ie(S.id)).relationships.associations = S.station.next.map((E) => ({
      id: S.id + "-to-" + E,
      parentId: ie(S.id),
      childId: ie(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const S of e.cards)
      for (const E of S.dependsOn ?? []) {
        const H = j(E), L = j(S.id);
        K.get(H).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${S.id}`,
          parentId: H,
          childId: L,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const S = new Set(n.beside), E = new Set(F.map((M) => M.options.id)), H = /* @__PURE__ */ new Map();
    for (const M of [...E]) {
      if (!S.has(M)) continue;
      const z = Je(M, (G) => S.has(G) || E.has(G));
      E.add(z), H.set(M, z);
    }
    const L = (M) => H.get(M) ?? M;
    for (const M of F) {
      M.options.id = L(M.options.id);
      for (const z of M.relationships.associations)
        z.parentId = L(z.parentId), z.childId = L(z.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: F };
}
function Fe(e, n) {
  const o = D(e);
  if (n?.native) return yn(o, n);
  const { width: t, row: r, height: a, top: d } = me, f = [];
  function u(g, v, $, T, A, F) {
    f.push({ options: {
      id: g,
      text: v,
      name: v,
      xPos: $,
      yPos: T,
      width: t,
      height: A,
      shapeHint: "rectangle",
      backgroundColor: F,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: w } = je(o), b = 152, y = b + 12, k = o.lanes.some((g) => g.station?.image);
  o.lanes.forEach((g, v) => {
    const $ = w[v].x, T = w[v].y + (k ? (g.station?.row ?? 0) * y : 0), A = g.station?.image, F = o.kind === "release-plan" ? g.label + `
` + (g.capacity ? Q(o, g.id) + " / " + g.capacity + " points" : Q(o, g.id) + " points") : g.label;
    u(Y(g.id), F, $, T, d - 12, ue[v]), A && f.push({ options: {
      id: we(g.id),
      name: A.alt,
      text: "",
      xPos: $,
      yPos: T + d,
      width: t,
      height: b,
      shapeHint: "rectangle",
      image: A.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((W) => W.laneId === g.id).forEach((W, K) => u(j(W.id), o.kind === "release-plan" ? W.label + `
` + W.points + " points" : W.label, $, T + d + (A ? y : 0) + K * r, a, "#fffdf6"));
  });
  for (const g of o.lanes) {
    if (!g.station) continue;
    const v = f.find(($) => $.options.id === Y(g.id));
    v.relationships.associations = g.station.next.map(($) => ({ id: g.id + "-to-" + $, parentId: v.options.id, childId: Y($), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), v.options.text = g.label + `
` + g.station.outcome, v.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const g = new Map(f.map((v) => [v.options.id, v]));
    for (const v of o.cards)
      for (const $ of v.dependsOn ?? []) {
        const T = j($), A = j(v.id);
        g.get(T).relationships.associations.push({
          id: `dependency-${$.length}-${$}-${v.id}`,
          parentId: T,
          childId: A,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: f };
}
const jn = {
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
}, ve = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Se = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Kn() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: ve.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: ve.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function Vn() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Se.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Pe(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Se.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => ve.some((r) => r.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function kn(e, n, o) {
  const t = Pe(e), r = e.cards.find((d) => d.id === n);
  if (!t || !r || r.laneId === o) return null;
  let a = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const d = e.cards.find((f) => f.laneId === o);
    if (d) {
      if (!fe(e, d).some((f) => f.id === "interviews")) return null;
      a = be(e, d.id, "interviews");
    }
  }
  return fe(a, r).some((d) => d.id === o) ? be(a, n, o) : null;
}
function bn(e, n) {
  if (Pe(e) !== "experiment-budget") return null;
  const o = Se.find((a) => a.id === n), t = e.cards.filter((a) => a.laneId === n).length, r = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? r + " " + (r === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  Un as addWorkshopBranch,
  Dn as addWorkshopCard,
  Gn as addWorkshopLane,
  On as attachWorkshop,
  fe as availableLanes,
  en as canHangPanel,
  Se as channels,
  Vn as createBudgetWorkshop,
  Kn as createInterviewWorkshop,
  Hn as createLaneWorkshop,
  Bn as createWorkshopMap,
  Fn as decodeWorkshopFragment,
  Rn as describeFocusDarkroom,
  zn as encodeWorkshopFragment,
  Pn as handoffSummary,
  Ln as hangGalleryPanel,
  jn as industrialWorkshop,
  Wn as initialFocusDarkroom,
  ve as interviews,
  ue as laneColors,
  de as listeningRoom,
  Cn as listeningRoomCaption,
  wn as maxWorkshopCards,
  An as moonGallery,
  be as moveWorkshopCard,
  qn as nightTransfer,
  Tn as normalizeFocusDarkroom,
  En as normalizeListeningRoom,
  Mn as normalizeMoonGallery,
  vn as normalizeOfflineHandoff,
  In as offlineHandoff,
  kn as planStartupMove,
  He as printFields,
  Q as releaseLoad,
  $n as releasePlan,
  Sn as resolveHandoff,
  pn as resolveWorkshopSignals,
  xn as reviewHandoff,
  Pe as startupExperienceKind,
  D as validateWorkshop,
  bn as workshopBudgetResult,
  he as workshopCandidate,
  We as workshopDestinations,
  re as workshopLaneCaption,
  _ as workshopLanePlaces,
  me as workshopLayout,
  oe as workshopNodeIds,
  je as workshopPositions,
  Be as workshopPresentationLanes,
  Nn as workshopPresentationScenes,
  Re as workshopRefusal,
  Je as workshopStandInId,
  Fe as workshopToSlate
};
