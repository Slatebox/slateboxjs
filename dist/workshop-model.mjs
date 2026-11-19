const pn = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function wn(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, stage: n, choice: r, fieldNote: i, deskNote: d, fallback: h } = e, u = (p) => typeof p == "string" && p.trim().length > 0 && p.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(p);
  return t !== "offline-handoff" || o !== 1 || n !== "queued" && n !== "review" && n !== "resolved" || (n === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !u(i) || !u(d) || !u(h) ? null : { kind: t, version: o, stage: n, choice: r, fieldNote: i.trim(), deskNote: d.trim(), fallback: h.trim() };
}
function mn(e) {
  return { ...e, stage: "review", choice: null };
}
function gn(e, t) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: t } : e;
}
function yn(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const le = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function kn(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, mix: n, leftLabel: r, rightLabel: i } = e, d = (h) => typeof h == "string" && h.trim().length > 0 && h.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(h);
  return t !== "listening-room" || o !== 1 || typeof n != "number" || !Number.isFinite(n) || n < 0 || n > 1 || !d(r) || !d(i) ? null : { kind: t, version: o, mix: n, leftLabel: r.trim(), rightLabel: i.trim() };
}
function bn({ mix: e, leftLabel: t, rightLabel: o }) {
  return e < 0.32 ? t === le.leftLabel ? "Rain ticks on the copper roof." : "You hear " + t + "." : e > 0.68 ? o === le.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : t === le.leftLabel && o === le.rightLabel ? "Rain and glass chimes overlap." : t + " and " + o + " overlap.";
}
function X(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.points ?? 1 : 0), 0);
}
function Je(e) {
  const t = new Map(e.cards.map((d) => [d.id, d])), o = new Map(e.lanes.map((d, h) => [d.id, h])), n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function i(d) {
    if (!n.has(d.id)) {
      if (r.has(d.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(d.id);
      for (const h of d.dependsOn ?? []) {
        const u = t.get(h);
        if (!u) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(u.laneId) > o.get(d.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(u);
      }
      r.delete(d.id), n.add(d.id);
    }
  }
  for (const d of e.cards) i(d);
  for (const d of e.lanes) {
    if (d.station) throw new Error("Release windows cannot also be map stations.");
    if (X(e, d.id) > (d.capacity ?? 1 / 0)) throw new Error(`Release "${d.label}" exceeds its point budget.`);
  }
}
function he(e, t, o) {
  if (o === t.laneId) return e;
  const n = new Map(e.lanes.map((c, b) => [c.id, b])), r = n.get(o);
  if (r === void 0) return null;
  const i = r < n.get(t.laneId), d = /* @__PURE__ */ new Set([t.id]), h = [t];
  for (; h.length; ) {
    const c = h.pop();
    for (const b of e.cards) {
      if (d.has(b.id)) continue;
      const k = n.get(b.laneId);
      (i ? k > r && c.dependsOn?.includes(b.id) : k < r && b.dependsOn?.includes(c.id)) && (d.add(b.id), h.push(b));
    }
  }
  if (e.cards.filter((c) => d.has(c.id)).some((c) => c.allowedLaneIds && !c.allowedLaneIds.includes(o))) return null;
  const p = { ...e, cards: e.cards.map((c) => d.has(c.id) ? { ...c, laneId: o } : c) }, y = e.lanes[r].capacity;
  return y !== void 0 && X(p, o) > y ? null : p;
}
const vn = {
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
}, de = Object.freeze({
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  fontColor: "#000000",
  borderColor: "#cccccc",
  borderWidth: 1
}), In = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function xn(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.kind !== "moon-gallery" || t.version !== 1 || !Array.isArray(t.panels) || t.panels.length !== 3 || !Array.isArray(t.hung)) return null;
  const o = [];
  for (const i of t.panels) {
    if (!i || typeof i.id != "string" || !/^[a-z][\w-]{0,31}$/.test(i.id) || typeof i.label != "string" || !i.label.trim() || i.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(i.artwork) || !(i.after === null || typeof i.after == "string")) return null;
    o.push({ id: i.id, label: i.label.trim(), artwork: i.artwork, after: i.after });
  }
  const n = new Map(o.map((i) => [i.id, i])), r = [...new Set(t.hung)];
  if (n.size !== o.length || r.length !== t.hung.length || r.some((i) => !n.has(i))) return null;
  for (const i of o) {
    const d = /* @__PURE__ */ new Set([i.id]);
    let h = i.after;
    for (; h !== null; ) {
      if (d.has(h) || !n.has(h) || r.includes(i.id) && !r.includes(h)) return null;
      d.add(h), h = n.get(h).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: r };
}
function _e(e, t) {
  const o = e.panels.find((n) => n.id === t);
  return !!o && !e.hung.includes(t) && (o.after === null || e.hung.includes(o.after));
}
function Sn(e, t) {
  return _e(e, t) ? { ...e, hung: [...e.hung, t] } : e;
}
const Ne = ["firstPrint", "secondPrint", "thirdPrint"], Oe = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Pn(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const t = e;
  if (t.kind !== void 0 && t.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (t.version !== 1) throw new Error("Unknown darkroom version.");
  if (t.route !== null && t.route !== "start" && t.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...Oe, route: t.route };
  for (const n of Ne) {
    const r = t[n];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[n] = r.trim();
  }
  return o;
}
function En(e = new URLSearchParams()) {
  const t = { ...Oe };
  for (const n of Ne) {
    const r = e.get(n)?.trim();
    r && r.length <= 48 && (t[n] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (t.route = o), t;
}
function Cn(e) {
  const t = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + t;
}
function Qe(e) {
  const t = { ...e };
  return e.xPos !== void 0 && t.x === void 0 && (t.x = e.xPos, delete t.xPos), e.yPos !== void 0 && t.y === void 0 && (t.y = e.yPos, delete t.yPos), e.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = e.foregroundColor, delete t.foregroundColor), e.shapeHint !== void 0 && t.shape === void 0 && (t.shape = Ye(e.shapeHint), delete t.shapeHint), e.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = e.svgString, delete t.svgString), e.blnStraight !== void 0 && (t.isStraightLine = e.blnStraight, delete t.blnStraight), t;
}
function Ze(e) {
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
function Ye(e) {
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
function Xe() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const en = "#1f7a5c", nn = "#5b9a85", Ae = "#c2410c", tn = { canMove: !1, canSelect: !1 };
function U(e) {
  const t = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return t ? { kind: t[1], key: t[2] } : null;
}
function $n(e, t, o = {}) {
  let n = O(t), r = null, i = !!o.readOnly, d = !1;
  const h = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Set();
  let c = null, b = null, k = null, x = Promise.resolve(), C = null, $ = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const A = { ...o.style };
  let z = null, L = !1;
  Y(n, { layout: $ });
  const N = o.origin ? { x: o.origin.x, y: o.origin.y } : sn(e), S = rn(n);
  for (const l of e.nodes.allNodes)
    if (S.has(l.id))
      throw new Error(`This slate already has a note named "${l.id}". A workshop draws its own lane and card notes.`);
  const T = {
    governs(l) {
      if (h.get(l.id) !== l) return null;
      const s = U(l.id)?.kind;
      return s === "card" ? { canMove: !i, canEditText: !i && !r && n.kind !== "release-plan" } : s === "lane" ? { canMove: !1, canEditText: !i && !r } : tn;
    },
    onStart(l, s) {
      const g = U(l.id).key;
      if (i || r || !n.cards.some((a) => a.id === g)) return !1;
      K(), _();
      const w = { x: s.x - (l.options.x ?? 0), y: s.y - (l.options.y ?? 0) };
      let v = null;
      try {
        v = o.chooseCandidate?.(n, g, w) ?? null;
      } catch (a) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", a);
      }
      return c = { cardId: g, evaluate: v, outcome: { kind: "home" } }, M(n, { skip: g }), !0;
    },
    onMove(l, s) {
      if (!c) return;
      const g = V(c.cardId, s, c.evaluate);
      if (on(g, c.outcome)) return;
      c.outcome = g;
      const w = g.kind === "candidate" ? g.next : null;
      M(w ?? n, { skip: c.cardId }), R(o.onPreview, w);
    },
    onEnd(l, s) {
      if (!c) return { accept: !1 };
      const { cardId: g, evaluate: w } = c, v = V(g, s, w), a = n.cards.find((m) => m.id === g);
      if (c = null, R(o.onPreview, null), v.kind === "candidate") {
        n = v.next, M(n, { skip: g });
        const m = n.lanes.find((I) => I.id === v.laneId);
        e.announce?.(`${a.label} moved to ${m.label}. ${ie(n, m.id)}.`), R(o.onChange, n, { cardId: g, laneId: v.laneId });
        const f = Ve(n, l.id);
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      return v.kind === "refused" ? Ke(a.label, { cardId: g, laneId: v.laneId, reason: v.reason }) : (M(n, { skip: g }), v.kind === "outside" && (e.announce?.(`${a.label} was not dropped on a lane. It stays where it was.`), R(o.onRefuse, { cardId: g, laneId: null, reason: "" }))), { accept: !1 };
    },
    onCancel(l) {
      const s = c && n.cards.find((g) => g.id === c.cardId);
      c = null, R(o.onPreview, null), M(n, { skip: l.id.replace(/^card-/, "") }), s && e.announce?.(`Move cancelled. ${s.label} stays where it was.`);
    },
    onTextCommit(l, s, g) {
      const w = U(l.id);
      if (!w || i || r) return !1;
      const v = s.replace(/\s+/g, " ").trim(), a = w.kind === "lane" ? { laneId: w.key, label: v } : { cardId: w.key, label: v };
      let m;
      try {
        m = O(w.kind === "lane" ? { ...n, lanes: n.lanes.map((f) => f.id === w.key ? { ...f, label: v } : f) } : { ...n, cards: n.cards.map((f) => f.id === w.key ? { ...f, label: v } : f) });
      } catch (f) {
        const I = f instanceof Error ? f.message : "That name is not allowed.";
        return e.announce?.(`${g} keeps its name. ${I}`), R(o.onRefuse, { ...w.kind === "lane" ? { laneId: w.key } : { cardId: w.key }, rename: a, reason: I }), !1;
      }
      return v === g ? !1 : (n = m, M(n), e.announce?.(`${g} renamed to ${v}.`), R(o.onChange, n, { rename: a }), v);
    },
    onKeyDown(l, s) {
      const g = U(l.id);
      if (g?.kind !== "card" || i || r || c || s.ctrlKey || s.metaKey || s.altKey) return !1;
      const w = n.cards.find((v) => v.id === g.key);
      if (!w) return !1;
      if (s.key === "ArrowLeft" || s.key === "ArrowRight")
        return s.preventDefault(), ae(w.id, s.key === "ArrowLeft" ? -1 : 1), !0;
      if ((s.key === "ArrowUp" || s.key === "ArrowDown") && G())
        return s.preventDefault(), ae(w.id, s.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (b?.cardId !== w.id) return !1;
      if (s.key === "Enter") {
        s.preventDefault();
        const { laneId: v, next: a } = b;
        b = null, n = a, M(n), J(v), R(o.onPreview, null);
        const m = n.lanes.find((f) => f.id === v);
        return e.announce?.(`${w.label} moved to ${m.label}. ${ie(n, v)}.`), R(o.onChange, n, { cardId: w.id, laneId: v }), !0;
      }
      return s.key === "Escape" ? (s.preventDefault(), _(), e.announce?.(`Move cancelled. ${w.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const l = (e.getSelectedNodes?.() ?? []).filter((s) => h.get(s.id) === s).map((s) => s.id);
      L = l.length === 1, h.clear(), u.clear(), p.clear(), c = null, b = null, M(r ?? n, { animate: !1 }), l.length === 1 && (x = x.then(() => {
        L = !1;
        const s = h.get(l[0]);
        if (!d && s && !(e.getSelectedNodes?.() ?? []).length) {
          const g = () => e.selectNodes?.([s]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(g) : g();
        }
        ee();
      }));
    }
  }, H = e.setDragPolicy(T), D = o.onSelect && e.onSelectionChange?.(() => ee()), q = () => {
    b && _();
  };
  e.element?.addEventListener?.("pointerdown", q, !0), M(n, { animate: !1 });
  function V(l, s, g) {
    const w = n.cards.find((E) => E.id === l);
    if (!w) return { kind: "outside" };
    const v = n.lanes.map((E) => h.get(re.column(E.id))).filter(Boolean), a = e.hitTestNodes(s, v, { padding: 6 }), m = a ? U(a.id).key : null;
    if (!m) return { kind: "outside" };
    if (m === w.laneId) return { kind: "home" };
    const f = fe(n, l, m);
    if (!f) return { kind: "refused", laneId: m, reason: Le(n, l, m) ?? "That move is not available." };
    if (!g) return { kind: "candidate", laneId: m, next: f };
    let I = null;
    try {
      I = g({ x: s.x - N.x, y: s.y - N.y });
    } catch (E) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", E), { kind: "candidate", laneId: m, next: f };
    }
    const P = I?.cards.find((E) => E.id === l)?.laneId;
    return !I || !P || P === w.laneId ? { kind: "home" } : { kind: "candidate", laneId: P, next: I };
  }
  function G() {
    return new Set(Y(n, { layout: $ }).places.map((l) => l.row)).size > 1;
  }
  function ae(l, s, g = !1) {
    const w = n.cards.find((P) => P.id === l), v = Me(n, l), a = b?.cardId === l ? b.laneId : w.laneId;
    let m;
    if (g) {
      const { places: P } = Y(n, { layout: $ }), E = P.find((W) => W.laneId === a);
      m = P.filter((W) => W.column === E.column && (W.row - E.row) * s > 0).sort((W, ne) => (W.row - ne.row) * s).map((W) => n.lanes.find((ne) => ne.id === W.laneId));
    } else {
      const P = n.lanes.findIndex((E) => E.id === a);
      m = s > 0 ? n.lanes.slice(P + 1) : n.lanes.slice(0, P).reverse();
    }
    const f = m.find((P) => v.includes(P));
    if (K(), !f) {
      const P = m[0];
      if (!P) {
        e.announce?.(`${w.label} has no lane to move to on that side.`);
        return;
      }
      const E = Le(n, l, P.id) ?? "That move is not available.";
      k = { laneId: P.id, reason: E, timer: setTimeout(() => K(), 1500) }, M(b?.next ?? r ?? n), J(P.id, b?.next ?? r ?? n), e.announce?.(`${w.label} can't move to ${P.label}. ${E}`), R(o.onRefuse, { cardId: l, laneId: P.id, reason: E });
      return;
    }
    if (f.id === w.laneId) {
      _(), J(f.id, r ?? n), e.announce?.(`${w.label} is back in ${f.label}.`);
      return;
    }
    const I = fe(n, l, f.id);
    b = { cardId: l, laneId: f.id, next: I }, M(I), J(f.id, I), R(o.onPreview, I), e.announce?.(`${w.label} to ${f.label}: ${ie(I, f.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function J(l, s = n) {
    const g = Y(s, { layout: $, rows: Ee() }).places.find((I) => I.laneId === l), w = e.canvas?.viewbox?.();
    if (!g || !w || !(w.width > 0) || !(w.height > 0)) return;
    const v = 16, a = (I, P, E, W) => P + v * 2 >= W || I - v < E ? I - v - E : I + P + v > E + W ? I + P + v - (E + W) : 0, m = a(N.x + g.x, g.width, w.x, w.width), f = a(N.y + g.y, g.height, w.y, w.height);
    (m || f) && e.panBy?.({ x: m, y: f });
  }
  function ee() {
    if (!o.onSelect || L) return;
    const l = d ? [] : e.getSelectedNodes?.() ?? [], s = l.length === 1 && h.get(l[0].id) === l[0] ? U(l[0].id) : null, g = s?.kind === "card" ? { cardId: s.key } : s?.kind === "lane" ? { laneId: s.key } : null, w = g ? JSON.stringify(g) : null;
    w !== z && (z = w, R(o.onSelect, g));
  }
  function _() {
    b && (b = null, R(o.onPreview, null), M(r ?? n));
  }
  function Ke(l, s) {
    K(!1), k = { laneId: s.laneId, reason: s.reason, timer: setTimeout(() => K(), 1500) }, M(n, { skip: s.cardId });
    const g = n.lanes.find((w) => w.id === s.laneId);
    e.announce?.(`${l} can't move to ${g?.label ?? "that lane"}. ${s.reason}`), R(o.onRefuse, s);
  }
  function K(l = !0) {
    k && (clearTimeout(k.timer), k = null, l && !d && Se());
  }
  function Se() {
    M(c && c.outcome.kind === "candidate" ? c.outcome.next : b?.next ?? r ?? n, { skip: c?.cardId });
  }
  function Pe(l) {
    const s = ke(l, { native: !0, origin: N, rows: Ee(), layout: $, style: A }).nodes, g = new Map(s.map((a) => [a.options.id, a.options])), w = (a, m, f, I = !1) => {
      const P = g.get(re.column(a));
      P && (P.borderColor = m, P.borderWidth = f, delete P.borderStyle);
      const E = I && g.get(re.lane(a));
      E && (E.borderColor = m, E.borderWidth = f);
    }, v = c?.cardId ?? b?.cardId;
    if (v) {
      const a = n.cards.find((f) => f.id === v)?.laneId;
      for (const f of Me(n, v)) f.id !== a && w(f.id, nn, 2);
      const m = c ? c.outcome : b ? { kind: "candidate", laneId: b.laneId } : null;
      m?.kind === "candidate" && w(m.laneId, en, 3, !0), m?.kind === "refused" && w(m.laneId, Ae, 3);
    }
    if (k) {
      w(k.laneId, Ae, 3, !0);
      const a = g.get(re.caption(k.laneId));
      a && (a.text = k.reason, a.foregroundColor = "#b42318");
    }
    return s;
  }
  function Ee() {
    return c || b ? n.lanes.map((l) => n.cards.filter((s) => s.laneId === l.id).length) : void 0;
  }
  function M(l, s = {}) {
    if (d) return;
    C = { model: l, skip: s.skip, animate: s.animate !== !1 };
    const g = Pe(l), w = [];
    for (const { options: a } of g) {
      const m = a.id;
      if (h.has(m)) continue;
      if (e.nodes.one?.(m)) {
        y.has(m) || console.warn(`WORKSHOP: the slate already has a note named "${m}"; the workshop cannot draw its own.`), y.add(m);
        continue;
      }
      y.delete(m);
      const f = e.nodes.add(Qe(a));
      h.set(m, f), u.set(m, { ...a }), f.ready && w.push(f.ready.then(() => {
        if (h.get(m) !== f) return;
        f.applyGovernance?.(), U(m)?.kind === "column" && f.toBack?.(!1);
        const I = Ce(C?.model ?? l, m);
        I && f.svgGroup?.node?.setAttribute("aria-label", I);
      }).catch(() => {
      }));
    }
    const v = C;
    x = Promise.all([x, ...w]).then(() => {
      d || C !== v || je(Pe(v.model), v);
    }).catch((a) => console.warn("WORKSHOP: could not draw the workshop", a));
  }
  function je(l, s) {
    const g = new Set(l.map((v) => v.options.id)), w = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [a, m] of [...h])
        if (!g.has(a)) {
          for (const [f, I] of [...p])
            I.parentId !== a && I.childId !== a || (I.parent.relationships?.removeAssociation(f), p.delete(f));
          e.deselectNode?.(m), m.editor?.cancelInline?.(), h.delete(a), u.delete(a), e.nodes.remove(a);
        }
      for (const { options: a } of l) {
        const m = a.id, f = h.get(m);
        if (!f?.svgGroup) continue;
        const I = u.get(m) ?? {}, P = f.editor?.isInlineEditing?.();
        (a.fontSize !== I.fontSize || a.foregroundColor !== I.foregroundColor) && (f.options.fontSize = a.fontSize, f.options.fontColor = a.foregroundColor, f.applyTextStyle?.()), a.text !== I.text && !P && f.setText?.(a.text), (a.width !== I.width || a.height !== I.height) && (a.vectorPath ? (f.options.width = a.width, f.options.height = a.height, f.setShape?.(f.options.shape, a.vectorPath), U(m)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(a.width, a.height)), a.backgroundColor !== I.backgroundColor && f.setColors?.(a.backgroundColor), (a.borderColor !== I.borderColor || a.borderWidth !== I.borderWidth || a.borderStyle !== I.borderStyle) && (f.options.borderColor = a.borderColor, f.options.borderWidth = a.borderWidth, f.options.borderStyle = a.borderStyle, f.applyBorder?.());
        const E = a.xPos !== I.xPos || a.yPos !== I.yPos || Math.abs((f.options.x ?? 0) - a.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - a.yPos) > 0.5;
        if (m !== (s.skip && re.card(s.skip)) && E) {
          const ne = s.animate && !Xe() ? 180 : 0, $e = w.includes(f) ? () => {
            !d && h.get(m) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          $e && ne && w.length === 1 && f.resizeRotate?.disable?.(), f.position(a.xPos, a.yPos, $e, void 0, ne);
        }
        const W = Ce(s.model, m);
        W && f.svgGroup.node.getAttribute("aria-label") !== W && f.svgGroup.node.setAttribute("aria-label", W), u.set(m, { ...a });
      }
      const v = /* @__PURE__ */ new Map();
      for (const a of l) for (const m of a.relationships.associations) v.set(m.id, m);
      for (const [a, m] of [...p])
        v.has(a) && h.get(m.parentId) === m.parent && h.get(m.childId) === m.child || (m.parent.relationships?.removeAssociation(a), p.delete(a));
      for (const [a, m] of v) {
        if (p.has(a)) continue;
        const f = h.get(m.parentId), I = h.get(m.childId);
        !f?.relationships || !I?.svgGroup || (f.relationships.addAssociation(I, Ze(m)), p.set(a, { parentId: m.parentId, childId: m.childId, parent: f, child: I }));
      }
    }), e.notifyNodeChanged?.();
  }
  function Ce(l, s) {
    const g = U(s);
    if (g?.kind === "lane") {
      const w = l.lanes.find((v) => v.id === g.key);
      return w ? `${w.label}, ${ie(l, w.id)}` : null;
    }
    if (g?.kind === "card") {
      const w = l.cards.find((a) => a.id === g.key), v = w && l.lanes.find((a) => a.id === w.laneId);
      return w && v ? `${w.label}, in ${v.label}` : null;
    }
    return null;
  }
  function Ve(l, s) {
    const g = ke(l, { native: !0, origin: N, layout: $, style: A }).nodes.find((w) => w.options.id === s)?.options;
    return g ? { x: g.xPos, y: g.yPos } : null;
  }
  function oe() {
    c && e.cancelGovernedDrag?.("host"), c = null, b && (b = null, R(o.onPreview, null)), K(!1);
  }
  return {
    get value() {
      return n;
    },
    get origin() {
      return { ...N };
    },
    get layout() {
      return { ...$ };
    },
    get bounds() {
      const { width: l, height: s } = Y(n, { layout: $ });
      return { x: N.x, y: N.y, width: l, height: s };
    },
    setLayout(l) {
      if (d) throw new Error("This workshop has been detached.");
      const s = l?.lanesPerRow === void 0 ? {} : { lanesPerRow: l.lanesPerRow };
      Y(n, { layout: s }), s.lanesPerRow !== $.lanesPerRow && (oe(), $ = s, M(r ?? n));
    },
    whenDrawn: () => x,
    update(l) {
      if (d) throw new Error("This workshop has been detached.");
      const s = O(l);
      oe(), n = s, M(r ?? n);
    },
    preview(l) {
      if (d) throw new Error("This workshop has been detached.");
      const s = l ? O(l) : null;
      oe(), r = s, M(r ?? n), e.refreshGovernance?.();
    },
    refuse(l, s) {
      const g = n.lanes.find((w) => w.id === l);
      d || !g || (K(!1), k = { laneId: l, reason: s, timer: setTimeout(() => K(), 1500) }, Se(), e.announce?.(`${g.label}: ${s}`));
    },
    setReadOnly(l) {
      d || i === !!l || (oe(), i = !!l, M(r ?? n), e.refreshGovernance?.());
    },
    destroy() {
      d || (oe(), d = !0, e.element?.removeEventListener?.("pointerdown", q, !0), D?.(), e.withPolicyAuthority(() => {
        for (const [l, s] of p) s.parent.relationships?.removeAssociation(l);
        for (const [l, s] of h)
          e.deselectNode?.(s), s.editor?.cancelInline?.(), e.nodes.one(l) === s && e.nodes.remove(l);
      }), p.clear(), h.clear(), u.clear(), H(), L = !1, ee(), e.notifyNodeChanged?.());
    }
  };
}
function R(e, ...t) {
  try {
    e?.(...t);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
  }
}
function on(e, t) {
  return e.kind === t.kind && e.laneId === t.laneId;
}
function rn(e) {
  return new Set(ke(e, { native: !0 }).nodes.map((t) => t.options.id));
}
function sn(e) {
  const t = e.nodes?.allNodes ?? [];
  if (!t.length) return { x: 40, y: 40 };
  let o = -1 / 0, n = 1 / 0;
  for (const r of t)
    o = Math.max(o, (r.options.x ?? 0) + (r.options.width ?? 0)), n = Math.min(n, r.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(n) };
}
function Z(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function F(e, t = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > t)
    throw new Error(`Labels must contain 1 to ${t} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function ze(e) {
  const t = Z(e);
  let o;
  try {
    o = new URL(F(t.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: F(t.alt, 240) };
}
function B(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function Q(e, t) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${t}.`);
}
function Fe({ lanes: e, presentationOrder: t }) {
  if (t === void 0) return e.slice();
  if (!Array.isArray(t) || t.length !== e.length || new Set(t).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(t, (o) => {
    const n = e.find((r) => r.id === o);
    if (!n) throw new Error("Presentation order refers to an unknown lane.");
    return n;
  });
}
function an(e) {
  return (e.signals ?? []).map((t) => {
    const o = e.cards.some((n) => n.id === t.cardId && n.laneId === t.laneId);
    return { ...t, present: o, text: o ? t.whenPresent : t.whenAbsent };
  });
}
const te = (e) => "lane-" + e, j = (e) => "card-" + e, pe = (e) => "image-" + e;
function An(e) {
  const t = an(e);
  return Fe(e).map((o) => {
    const n = e.cards.filter((d) => d.laneId === o.id), r = t.filter((d) => d.laneId === o.id), i = [te(o.id)];
    return o.station?.image && i.push(pe(o.id)), { lane: o, cards: n, signals: r, nodeIds: [...i, ...n.map((d) => j(d.id))] };
  });
}
const He = 5, ln = 24, me = 3;
function O(e) {
  const t = Z(e);
  if (t.version !== 1) throw new Error("Unsupported workshop version.");
  if (t.kind !== void 0 && t.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = t.kind === "release-plan", n = F(t.title, 120);
  if (!Array.isArray(t.lanes) || t.lanes.length < 2 || t.lanes.length > He)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(t.cards) || t.cards.length > ln)
    throw new Error("A workshop supports up to 24 cards.");
  const r = t.lanes.map((u) => {
    const p = Z(u), y = { id: B(p.id), label: F(p.label) };
    if (p.capacity !== void 0) {
      const c = o ? 576 : 24;
      if (typeof p.capacity != "number" || !Number.isInteger(p.capacity) || p.capacity < 1 || p.capacity > c)
        throw new Error(`Lane capacity must be a whole number from 1 to ${c}.`);
      y.capacity = p.capacity;
    }
    if (p.station !== void 0) {
      const c = Z(p.station), b = (x) => {
        if (typeof x != "number" || !Number.isInteger(x) || x < 0 || x >= me)
          throw new Error("Use map coordinates from 0 to 2.");
        return x;
      };
      if (!Array.isArray(c.next) || c.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const k = c.next.map(B);
      Q(k, "onward stop"), y.station = { column: b(c.column), row: b(c.row), next: k, outcome: F(c.outcome, 160) }, c.image !== void 0 && (y.station.image = ze(c.image));
    }
    return y;
  }), i = r.map((u) => u.id);
  if (Q(i, "lane ID"), (o || r.some((u) => u.station)) && !t.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (r.some((u) => u.station)) {
    if (!r.every((u) => u.station)) throw new Error("Give every station on the map a position.");
    Q(r.map((u) => u.station.column + "," + u.station.row), "map position");
    for (const u of r)
      if (u.station.next.some((p) => p === u.id || !i.includes(p))) throw new Error("Connect each stop to another station on this map.");
  }
  const d = t.cards.map((u) => {
    const p = Z(u), y = { id: B(p.id), label: F(p.label), laneId: B(p.laneId) };
    if (!i.includes(y.laneId)) throw new Error("Card refers to an unknown lane.");
    if (p.allowedLaneIds !== void 0) {
      if (!Array.isArray(p.allowedLaneIds) || p.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (y.allowedLaneIds = p.allowedLaneIds.map(B), Q(y.allowedLaneIds, "allowed lane"), !y.allowedLaneIds.includes(y.laneId) || !y.allowedLaneIds.every((c) => i.includes(c)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (o) {
      if (typeof p.points != "number" || !Number.isInteger(p.points) || p.points < 1 || p.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (y.points = p.points, p.dependsOn !== void 0) {
        if (!Array.isArray(p.dependsOn) || p.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        y.dependsOn = p.dependsOn.map(B), Q(y.dependsOn, "dependency");
      }
    }
    return y;
  });
  Q(d.map((u) => u.id), "card ID");
  const h = { version: 1, title: n, lanes: r, cards: d };
  if (t.experience !== void 0) {
    const u = Z(t.experience);
    if (u.version !== 1 || u.kind !== "customer-interviews" && u.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    h.experience = { version: 1, kind: u.kind };
  }
  if (t.signals !== void 0) {
    if (!Array.isArray(t.signals) || t.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    h.signals = t.signals.map((u) => {
      const p = Z(u), y = B(p.cardId), c = B(p.laneId);
      if (!d.some((b) => b.id === y) || !i.includes(c))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: B(p.id),
        label: F(p.label),
        cardId: y,
        laneId: c,
        whenPresent: F(p.whenPresent, 160),
        whenAbsent: F(p.whenAbsent, 160)
      };
    }), Q(h.signals.map((u) => u.id), "placement outcome ID");
  }
  if (t.presentationOrder !== void 0) {
    if (!Array.isArray(t.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    h.presentationOrder = Fe({ lanes: r, presentationOrder: t.presentationOrder }).map((u) => u.id);
  }
  if (o)
    return h.kind = "release-plan", Je(h), h;
  for (const u of r)
    if (d.filter((p) => p.laneId === u.id).length > (u.capacity ?? 1 / 0))
      throw new Error(`Lane "${u.label}" exceeds its capacity.`);
  return h;
}
const De = 65536;
function Mn(e) {
  const t = JSON.stringify(O(e)), o = "#" + new URLSearchParams({ model: t }).toString();
  if (o.length > De) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function Ln(e) {
  if (e.length > De) throw new Error("This workshop is too large to open from a link.");
  const t = new URLSearchParams(e.slice(1)), o = t.get("model");
  if (!e.startsWith("#") || !o || Array.from(t.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let n;
  try {
    n = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return O(n);
}
function ue(e, t) {
  if (e.kind === "release-plan") return e.lanes.filter((n) => he(e, t, n.id) !== null);
  const o = e.lanes.find((n) => n.id === t.laneId)?.station;
  return e.lanes.filter((n) => n.id === t.laneId || (!o || o.next.includes(n.id)) && (!t.allowedLaneIds || t.allowedLaneIds.includes(n.id)) && e.cards.filter((r) => r.laneId === n.id).length < (n.capacity ?? 1 / 0));
}
function ge(e, t, o) {
  const n = e.cards.find((r) => r.id === t);
  if (n && e.kind === "release-plan") {
    const r = he(e, n, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!n || !ue(e, n).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return n.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === n ? { ...n, laneId: o } : r) };
}
function fe(e, t, o) {
  const n = e.cards.find((i) => i.id === t);
  if (!n || !e.lanes.some((i) => i.id === o)) return null;
  if (n.laneId === o) return e;
  if (e.kind === "release-plan") return he(e, n, o);
  const r = fn(e, t, o);
  return r || (o === "prototype" && xe(e) === "customer-interviews" ? null : ue(e, n).some((i) => i.id === o) ? ge(e, t, o) : null);
}
function Me(e, t) {
  return e.lanes.filter((o) => fe(e, t, o.id) !== null);
}
function Le(e, t, o) {
  if (fe(e, t, o) !== null) return null;
  const n = e.cards.find((u) => u.id === t), r = e.lanes.find((u) => u.id === o);
  if (!n || !r) return "That move is not available.";
  const i = `This card can't go in ${r.label}.`;
  if (n.allowedLaneIds && !n.allowedLaneIds.includes(o)) return i;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return i;
    const u = X(e, o), p = { ...e, lanes: e.lanes.map((c) => c === r ? { id: r.id, label: r.label } : c) }, y = he(p, n, o);
    return y ? `Needs ${X(y, o) - u} points. Now holds ${u} of ${r.capacity} points.` : i;
  }
  const d = e.lanes.find((u) => u.id === n.laneId);
  if (d?.station && !d.station.next.includes(o)) return `${r.label} can't be reached from ${d.label}.`;
  const h = e.cards.filter((u) => u.laneId === o).length;
  return r.capacity !== void 0 && h >= r.capacity ? `Now holds ${h} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.` : i;
}
function ie(e, t) {
  const o = e.lanes.find((i) => i.id === t);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const i = X(e, t);
    return o.capacity ? i + " / " + o.capacity + " points" : i + " points";
  }
  const n = hn(e, t);
  if (n) return "$" + n.amount + " · " + n.description;
  const r = e.cards.filter((i) => i.laneId === t).length;
  return o.capacity !== void 0 ? r + " of " + o.capacity : r + (r === 1 ? " card" : " cards");
}
const we = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, ce = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Ge(e, t = we, o = 28) {
  const { pitch: n, row: r, top: i } = t, d = !!e.lanes[0].station, h = e.lanes.map((y) => e.cards.filter((c) => c.laneId === y.id).length), u = i + Math.max(1, ...h) * r + 36, p = e.lanes.map((y, c) => ({
    x: d ? y.station.column * (n + o) : c * n,
    y: d ? y.station.row * u : 0
  }));
  return {
    points: p,
    width: Math.max(...p.map((y) => y.x)) + n,
    height: Math.max(...p.map((y, c) => y.y + i + (d ? Math.max(1, h[c]) : h[c] + 1) * r))
  };
}
function Tn() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function ve(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  let n = 1;
  for (; o.has(t + "-" + n); ) n++;
  return t + "-" + n;
}
function Ue(e) {
  const t = O(e);
  if (t.kind || t.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return t;
}
function Wn(e, t) {
  const o = Ue(e), n = ve(o, "lane");
  return o.lanes.push({ id: n, label: t.label, ...t.capacity === void 0 ? {} : { capacity: t.capacity } }), o.presentationOrder?.push(n), O(o);
}
function Rn(e, t, o) {
  const n = Ue(e);
  return n.cards.push({
    id: ve(n, "card"),
    label: o.label,
    laneId: t,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), O(n);
}
function Nn() {
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
function On(e, t, o) {
  const n = O(e);
  if (n.kind || !n.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = n.lanes.find((y) => y.id === t);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (n.lanes.length >= He) throw new Error("A map can have up to five stations.");
  const i = F(o?.label), d = F(o?.outcome, 160), h = ve(n, "station");
  let u, p = 1 / 0;
  for (let y = 0; y < me; y++)
    for (let c = 0; c < me; c++) {
      if (n.lanes.some((k) => k.station.column === c && k.station.row === y)) continue;
      const b = Math.abs(r.station.column - c) + Math.abs(r.station.row - y);
      b < p && (p = b, u = { column: c, row: y });
    }
  if (!u) throw new Error("There is no free station position.");
  return r.station.next.push(h), n.lanes.push({ id: h, label: i, station: { ...u, next: [], outcome: d, ...o.image === void 0 ? {} : { image: ze(o.image) } } }), n.presentationOrder?.push(h), n;
}
const zn = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Be = (e) => "caption-" + e, se = (e) => "column-" + e, re = { lane: te, card: j, image: pe, caption: Be, column: se };
function Te(e, t, o) {
  const n = Math.max(0, Math.min(o, e / 2, t / 2)), r = e, i = t;
  return n ? `M ${n} 0 H ${r - n} Q ${r} 0 ${r} ${n} V ${i - n} Q ${r} ${i} ${r - n} ${i} H ${n} Q 0 ${i} 0 ${i - n} V ${n} Q 0 0 ${n} 0 Z` : `M 0 0 H ${r} V ${i} H 0 Z`;
}
function We(e, t) {
  const o = (n) => Math.round(parseInt(e.slice(n, n + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function Re(e, t, o, n) {
  for (let r = t; r > 11; r--) {
    const i = Math.max(1, Math.floor(o / (r * 0.55)));
    if (e.split(`
`).reduce((h, u) => h + Math.max(1, Math.ceil(u.length / i)), 0) * r * 1.3 <= n) return r;
  }
  return Math.min(t, 11);
}
const qe = 152, ye = qe + 12, dn = 12;
function cn(e, t) {
  const o = e?.lanesPerRow;
  if (o === void 0) return t;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, t);
}
function Y(e, t = {}) {
  const o = O(e), { pitch: n, row: r, top: i } = we, d = o.lanes.map((b) => o.cards.filter((k) => k.laneId === b.id).length), h = (b) => Math.max(d[b], (Array.isArray(t.rows) ? t.rows[b] : t.rows) ?? 0), u = !!o.lanes[0].station, p = o.lanes.some((b) => b.station?.image), y = cn(t.layout, o.lanes.length), c = [];
  if (u) {
    const { points: b } = Ge(o);
    o.lanes.forEach((k, x) => c.push({
      laneId: k.id,
      x: b[x].x,
      y: b[x].y + (p ? k.station.row * ye : 0),
      width: n,
      height: i + (k.station.image ? ye : 0) + Math.max(1, d[x]) * r,
      column: k.station.column,
      row: k.station.row
    }));
  } else {
    let b = 0;
    for (let k = 0; k < o.lanes.length; k += y) {
      const x = o.lanes.slice(k, k + y), C = i + (Math.max(...x.map(($, A) => h(k + A))) + 1) * r;
      x.forEach(($, A) => c.push({ laneId: $.id, x: A * n, y: b, width: n, height: C, column: A, row: k / y })), b += C + dn;
    }
  }
  return { places: c, width: Math.max(...c.map((b) => b.x + b.width)), height: Math.max(...c.map((b) => b.y + b.height)) };
}
function un(e, t) {
  const { pitch: o, width: n, row: r, height: i, top: d } = we, h = t.origin ?? { x: 0, y: 0 }, u = !!e.lanes[0].station, { places: p } = Y(e, t), y = t.style ?? {}, c = y.textColor ?? de.fontColor, b = y.borderColor ?? de.borderColor, k = y.borderWidth ?? de.borderWidth, x = y.cornerRadius ?? 0, C = y.fontSize ?? de.fontSize, $ = y.laneFontSize ?? C + 2, A = y.captionFontSize ?? Math.max(11, C - 1), z = [], L = (S) => {
    const T = { options: {
      shapeHint: "rectangle",
      vectorPath: Te(S.width, S.height, x),
      foregroundColor: c,
      borderColor: b,
      borderWidth: k,
      ...y.fontFamily ? { fontFamily: y.fontFamily } : {},
      ...S
    }, relationships: { associations: [] } };
    return z.push(T), T;
  };
  e.lanes.forEach((S, T) => {
    const H = p[T], D = h.x + H.x, q = h.y + H.y, V = S.station?.image;
    L({
      id: se(S.id),
      text: "",
      name: S.label,
      xPos: D + 2,
      yPos: q,
      width: o - 4,
      height: H.height,
      vectorPath: Te(o - 4, H.height, x ? x + 2 : 0),
      backgroundColor: u ? "#fcf9ed" : We(ce[T], 0.6),
      borderColor: u ? "#a8b5aa" : We(ce[T], 0.1),
      borderWidth: 1,
      ...u ? { borderStyle: "dashed" } : {}
    }), L({
      id: te(S.id),
      text: S.label,
      name: S.label,
      xPos: D + 8,
      yPos: q + 6,
      width: n,
      height: 58,
      backgroundColor: ce[T],
      fontSize: Re(S.label, $, n - 16, 50)
    }), L({
      id: Be(S.id),
      text: ie(e, S.id),
      name: S.label,
      xPos: D + 8,
      yPos: q + 66,
      width: n,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: A
    }), V && z.push({ options: {
      id: pe(S.id),
      name: V.alt,
      text: "",
      xPos: D + 8,
      yPos: q + d,
      width: n,
      height: qe,
      shapeHint: "rectangle",
      image: V.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((G) => G.laneId === S.id).forEach((G, ae) => {
      const J = e.kind === "release-plan" ? G.label + `
` + G.points + " points" : G.label, ee = u ? n - 20 : n, _ = u ? i - 6 : i;
      L({
        id: j(G.id),
        text: J,
        name: G.label,
        xPos: D + (u ? 18 : 8),
        yPos: q + d + (V ? ye : 0) + ae * r,
        width: ee,
        height: _,
        backgroundColor: u ? "#ffda75" : "#fffdf6",
        fontSize: Re(J, C, ee - 16, _ - 8)
      });
    });
  });
  const N = new Map(z.map((S) => [S.options.id, S]));
  for (const S of e.lanes)
    S.station && (N.get(se(S.id)).relationships.associations = S.station.next.map((T) => ({
      id: S.id + "-to-" + T,
      parentId: se(S.id),
      childId: se(T),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const S of e.cards)
      for (const T of S.dependsOn ?? []) {
        const H = j(T), D = j(S.id);
        N.get(H).relationships.associations.push({
          id: `dependency-${T.length}-${T}-${S.id}`,
          parentId: H,
          childId: D,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  return { options: { name: e.title }, shareId: "", nodes: z };
}
function ke(e, t) {
  const o = O(e);
  if (t?.native) return un(o, t);
  const { width: n, row: r, height: i, top: d } = we, h = [];
  function u(k, x, C, $, A, z) {
    h.push({ options: {
      id: k,
      text: x,
      name: x,
      xPos: C,
      yPos: $,
      width: n,
      height: A,
      shapeHint: "rectangle",
      backgroundColor: z,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: p } = Ge(o), y = 152, c = y + 12, b = o.lanes.some((k) => k.station?.image);
  o.lanes.forEach((k, x) => {
    const C = p[x].x, $ = p[x].y + (b ? (k.station?.row ?? 0) * c : 0), A = k.station?.image, z = o.kind === "release-plan" ? k.label + `
` + (k.capacity ? X(o, k.id) + " / " + k.capacity + " points" : X(o, k.id) + " points") : k.label;
    u(te(k.id), z, C, $, d - 12, ce[x]), A && h.push({ options: {
      id: pe(k.id),
      name: A.alt,
      text: "",
      xPos: C,
      yPos: $ + d,
      width: n,
      height: y,
      shapeHint: "rectangle",
      image: A.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((L) => L.laneId === k.id).forEach((L, N) => u(j(L.id), o.kind === "release-plan" ? L.label + `
` + L.points + " points" : L.label, C, $ + d + (A ? c : 0) + N * r, i, "#fffdf6"));
  });
  for (const k of o.lanes) {
    if (!k.station) continue;
    const x = h.find((C) => C.options.id === te(k.id));
    x.relationships.associations = k.station.next.map((C) => ({ id: k.id + "-to-" + C, parentId: x.options.id, childId: te(C), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), x.options.text = k.label + `
` + k.station.outcome, x.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const k = new Map(h.map((x) => [x.options.id, x]));
    for (const x of o.cards)
      for (const C of x.dependsOn ?? []) {
        const $ = j(C), A = j(x.id);
        k.get($).relationships.associations.push({
          id: `dependency-${C.length}-${C}-${x.id}`,
          parentId: $,
          childId: A,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: h };
}
const Fn = {
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
}, be = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Ie = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Hn() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: be.map(({ id: e, who: t, quote: o }) => ({ id: e, label: t + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: be.map(({ id: e, action: t, signal: o }) => ({ id: "test-" + e, label: t, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function Dn() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Ie.map(({ id: e, label: t, rate: o }) => ({ id: e, label: t + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, t) => ({ id: "fund-" + t, label: e + " $200", laneId: t === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function xe(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((n) => n.station)) return;
  const t = e.experience.kind, o = t === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Ie.map((n) => n.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((n) => o.includes(n.id))) && !(t === "customer-interviews" && (!e.cards.every((n) => be.some((r) => r.id === n.id)) || e.cards.filter((n) => n.laneId === "prototype").length > 1)))
    return t;
}
function fn(e, t, o) {
  const n = xe(e), r = e.cards.find((d) => d.id === t);
  if (!n || !r || r.laneId === o) return null;
  let i = e;
  if (n === "customer-interviews") {
    if (o !== "prototype") return null;
    const d = e.cards.find((h) => h.laneId === o);
    if (d) {
      if (!ue(e, d).some((h) => h.id === "interviews")) return null;
      i = ge(e, d.id, "interviews");
    }
  }
  return ue(i, r).some((d) => d.id === o) ? ge(i, t, o) : null;
}
function hn(e, t) {
  if (xe(e) !== "experiment-budget") return null;
  const o = Ie.find((i) => i.id === t), n = e.cards.filter((i) => i.laneId === t).length, r = n * (o?.per ?? 0);
  return { amount: n * 200, description: o ? r + " " + (r === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  On as addWorkshopBranch,
  Rn as addWorkshopCard,
  Wn as addWorkshopLane,
  $n as attachWorkshop,
  ue as availableLanes,
  _e as canHangPanel,
  Ie as channels,
  Dn as createBudgetWorkshop,
  Hn as createInterviewWorkshop,
  Tn as createLaneWorkshop,
  Nn as createWorkshopMap,
  Ln as decodeWorkshopFragment,
  Cn as describeFocusDarkroom,
  Mn as encodeWorkshopFragment,
  yn as handoffSummary,
  Sn as hangGalleryPanel,
  Fn as industrialWorkshop,
  En as initialFocusDarkroom,
  be as interviews,
  ce as laneColors,
  le as listeningRoom,
  bn as listeningRoomCaption,
  ln as maxWorkshopCards,
  In as moonGallery,
  ge as moveWorkshopCard,
  zn as nightTransfer,
  Pn as normalizeFocusDarkroom,
  kn as normalizeListeningRoom,
  xn as normalizeMoonGallery,
  wn as normalizeOfflineHandoff,
  pn as offlineHandoff,
  fn as planStartupMove,
  Ne as printFields,
  X as releaseLoad,
  vn as releasePlan,
  gn as resolveHandoff,
  an as resolveWorkshopSignals,
  mn as reviewHandoff,
  xe as startupExperienceKind,
  O as validateWorkshop,
  hn as workshopBudgetResult,
  fe as workshopCandidate,
  Me as workshopDestinations,
  ie as workshopLaneCaption,
  Y as workshopLanePlaces,
  we as workshopLayout,
  re as workshopNodeIds,
  Ge as workshopPositions,
  Fe as workshopPresentationLanes,
  An as workshopPresentationScenes,
  Le as workshopRefusal,
  ke as workshopToSlate
};
