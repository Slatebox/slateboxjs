const Zn = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Vn(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, stage: n, choice: i, fieldNote: d, deskNote: f, fallback: w } = e, m = (y) => typeof y == "string" && y.trim().length > 0 && y.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(y);
  return t !== "offline-handoff" || o !== 1 || n !== "queued" && n !== "review" && n !== "resolved" || (n === "resolved" ? i !== "field" && i !== "desk" : i !== null) || i === void 0 || !m(d) || !m(f) || !m(w) ? null : { kind: t, version: o, stage: n, choice: i, fieldNote: d.trim(), deskNote: f.trim(), fallback: w.trim() };
}
function Jn(e) {
  return { ...e, stage: "review", choice: null };
}
function Qn(e, t) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: t } : e;
}
function Yn(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const me = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Xn(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, mix: n, leftLabel: i, rightLabel: d } = e, f = (w) => typeof w == "string" && w.trim().length > 0 && w.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(w);
  return t !== "listening-room" || o !== 1 || typeof n != "number" || !Number.isFinite(n) || n < 0 || n > 1 || !f(i) || !f(d) ? null : { kind: t, version: o, mix: n, leftLabel: i.trim(), rightLabel: d.trim() };
}
function et({ mix: e, leftLabel: t, rightLabel: o }) {
  return e < 0.32 ? t === me.leftLabel ? "Rain ticks on the copper roof." : "You hear " + t + "." : e > 0.68 ? o === me.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : t === me.leftLabel && o === me.rightLabel ? "Rain and glass chimes overlap." : t + " and " + o + " overlap.";
}
function re(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.points ?? 1 : 0), 0);
}
function Pn(e) {
  const t = new Map(e.cards.map((f) => [f.id, f])), o = new Map(e.lanes.map((f, w) => [f.id, w])), n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  function d(f) {
    if (!n.has(f.id)) {
      if (i.has(f.id)) throw new Error("Release dependencies must be acyclic.");
      i.add(f.id);
      for (const w of f.dependsOn ?? []) {
        const m = t.get(w);
        if (!m) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(m.laneId) > o.get(f.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        d(m);
      }
      i.delete(f.id), n.add(f.id);
    }
  }
  for (const f of e.cards) d(f);
  for (const f of e.lanes) {
    if (f.station) throw new Error("Release windows cannot also be map stations.");
    if (re(e, f.id) > (f.capacity ?? 1 / 0)) throw new Error(`Release "${f.label}" exceeds its point budget.`);
  }
}
function xe(e, t, o) {
  if (o === t.laneId) return e;
  const n = new Map(e.lanes.map((v, x) => [v.id, x])), i = n.get(o);
  if (i === void 0) return null;
  const d = i < n.get(t.laneId), f = /* @__PURE__ */ new Set([t.id]), w = [t];
  for (; w.length; ) {
    const v = w.pop();
    for (const x of e.cards) {
      if (f.has(x.id)) continue;
      const g = n.get(x.laneId);
      (d ? g > i && v.dependsOn?.includes(x.id) : g < i && x.dependsOn?.includes(v.id)) && (f.add(x.id), w.push(x));
    }
  }
  if (e.cards.filter((v) => f.has(v.id)).some((v) => v.allowedLaneIds && !v.allowedLaneIds.includes(o))) return null;
  const y = { ...e, cards: e.cards.map((v) => f.has(v.id) ? { ...v, laneId: o } : v) }, I = e.lanes[i].capacity;
  return I !== void 0 && re(y, o) > I ? null : y;
}
const nt = {
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
  borderWidth: 1,
  backgroundColor: "#f0f0f0"
}), tt = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ot(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.kind !== "moon-gallery" || t.version !== 1 || !Array.isArray(t.panels) || t.panels.length !== 3 || !Array.isArray(t.hung)) return null;
  const o = [];
  for (const d of t.panels) {
    if (!d || typeof d.id != "string" || !/^[a-z][\w-]{0,31}$/.test(d.id) || typeof d.label != "string" || !d.label.trim() || d.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(d.artwork) || !(d.after === null || typeof d.after == "string")) return null;
    o.push({ id: d.id, label: d.label.trim(), artwork: d.artwork, after: d.after });
  }
  const n = new Map(o.map((d) => [d.id, d])), i = [...new Set(t.hung)];
  if (n.size !== o.length || i.length !== t.hung.length || i.some((d) => !n.has(d))) return null;
  for (const d of o) {
    const f = /* @__PURE__ */ new Set([d.id]);
    let w = d.after;
    for (; w !== null; ) {
      if (f.has(w) || !n.has(w) || i.includes(d.id) && !i.includes(w)) return null;
      f.add(w), w = n.get(w).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: i };
}
function $n(e, t) {
  const o = e.panels.find((n) => n.id === t);
  return !!o && !e.hung.includes(t) && (o.after === null || e.hung.includes(o.after));
}
function rt(e, t) {
  return $n(e, t) ? { ...e, hung: [...e.hung, t] } : e;
}
const rn = ["firstPrint", "secondPrint", "thirdPrint"], sn = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function it(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const t = e;
  if (t.kind !== void 0 && t.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (t.version !== 1) throw new Error("Unknown darkroom version.");
  if (t.route !== null && t.route !== "start" && t.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...sn, route: t.route };
  for (const n of rn) {
    const i = t[n];
    if (typeof i != "string" || !i.trim() || i.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[n] = i.trim();
  }
  return o;
}
function st(e = new URLSearchParams()) {
  const t = { ...sn };
  for (const n of rn) {
    const i = e.get(n)?.trim();
    i && i.length <= 48 && (t[n] = i);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (t.route = o), t;
}
function at(e) {
  const t = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + t;
}
function An(e) {
  const t = { ...e };
  return e.xPos !== void 0 && t.x === void 0 && (t.x = e.xPos, delete t.xPos), e.yPos !== void 0 && t.y === void 0 && (t.y = e.yPos, delete t.yPos), e.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = e.foregroundColor, delete t.foregroundColor), e.shapeHint !== void 0 && t.shape === void 0 && (t.shape = Ln(e.shapeHint), delete t.shapeHint), e.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = e.svgString, delete t.svgString), e.blnStraight !== void 0 && (t.isStraightLine = e.blnStraight, delete t.blnStraight), Mn(t), t;
}
function En(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.width !== void 0 || t.height !== void 0;
}
function Mn(e) {
  return e && En(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Tn(e) {
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
function Ln(e) {
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
function Ve() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const Je = "#1f7a5c", Qe = "#5b9a85", Ee = "#c2410c", Wn = { canMove: !1, canSelect: !1 };
function Rn(e) {
  const t = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return t ? { kind: t[1], key: t[2] } : null;
}
function lt(e, t, o = {}) {
  let n = F(t), i = null, d = !!o.readOnly, f = !1;
  const w = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  let x = null, g = null, C = null;
  const E = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
  let A = null, O = Promise.resolve(), H = null, B = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const P = { ...o.style };
  let M = /* @__PURE__ */ new Map(), G = null, D = !1;
  X(n, { layout: B });
  const $ = o.origin ? { x: o.origin.x, y: o.origin.y } : On(e), U = (r) => v.get(r) ?? r, W = (r) => Rn(U(r));
  function q(r) {
    const a = I.get(r);
    if (a) return a;
    if (w.has(r) && !v.has(r) || !e.nodes.one?.(r)) return r;
    const l = wn(r, (u) => !!e.nodes.one?.(u) || v.has(u));
    return I.set(r, l), v.set(l, r), console.warn(`WORKSHOP: the slate already has a note named "${r}". It stays the slate's own; the workshop draws its note as "${l}".`), l;
  }
  const Q = {
    governs(r) {
      if (w.get(r.id) !== r) return null;
      const a = W(r.id)?.kind;
      return a === "card" ? { canMove: !d, canEditText: !d && !i && n.kind !== "release-plan" } : a === "lane" ? { canMove: !1, canEditText: !d && !i } : Wn;
    },
    onStart(r, a) {
      const l = W(r.id).key;
      if (d || i || !n.cards.some((s) => s.id === l)) return !1;
      K(), se();
      const u = { x: a.x - (r.options.x ?? 0), y: a.y - (r.options.y ?? 0) };
      let p = null;
      try {
        p = o.chooseCandidate?.(n, l, u) ?? null;
      } catch (s) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", s);
      }
      return x = { cardId: l, evaluate: p, outcome: { kind: "home" } }, T(n, { skip: l }), !0;
    },
    onMove(r, a) {
      if (!x) return;
      const l = ze(x.cardId, a, x.evaluate);
      if (Nn(l, x.outcome)) return;
      x.outcome = l;
      const u = l.kind === "candidate" ? l.next : null;
      T(u ?? n, { skip: x.cardId }), L(o.onPreview, u);
    },
    onEnd(r, a) {
      if (!x) return { accept: !1 };
      const { cardId: l, evaluate: u } = x, p = ze(l, a, u), s = n.cards.find((c) => c.id === l);
      if (x = null, L(o.onPreview, null), p.kind === "candidate") {
        n = p.next, T(n, { skip: l });
        const c = n.lanes.find((k) => k.id === p.laneId);
        e.announce?.(`${s.label} moved to ${c.label}. ${Y(n, c.id)}.`), L(o.onChange, n, { cardId: l, laneId: p.laneId });
        const h = Sn(n, U(r.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (p.kind === "refused")
        xn(s.label, { cardId: l, laneId: p.laneId, reason: p.reason });
      else if (p.kind === "outside" && ke(n) && !He()) {
        const c = We(n, l);
        if (!c)
          return je(l, { x: r.options.x ?? 0, y: r.options.y ?? 0 }), { accept: !0 };
        T(n, { skip: l }), e.announce?.(c), L(o.onRefuse, { cardId: l, laneId: null, reason: c });
      } else
        T(n, { skip: l }), p.kind === "outside" && (e.announce?.(`${s.label} was not dropped on a lane. It stays where it was.`), L(o.onRefuse, { cardId: l, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(r) {
      const a = x && n.cards.find((l) => l.id === x.cardId);
      x = null, L(o.onPreview, null), T(n, { skip: W(r.id)?.key }), a && e.announce?.(`Move cancelled. ${a.label} stays where it was.`);
    },
    onTextCommit(r, a, l) {
      const u = W(r.id);
      if (!u || d || i) return !1;
      const p = a.replace(/\s+/g, " ").trim(), s = u.kind === "lane" ? { laneId: u.key, label: p } : { cardId: u.key, label: p };
      let c;
      try {
        c = F(u.kind === "lane" ? { ...n, lanes: n.lanes.map((h) => h.id === u.key ? { ...h, label: p } : h) } : { ...n, cards: n.cards.map((h) => h.id === u.key ? { ...h, label: p } : h) });
      } catch (h) {
        const k = h instanceof Error ? h.message : "That name is not allowed.";
        return e.announce?.(`${l} keeps its name. ${k}`), L(o.onRefuse, { ...u.kind === "lane" ? { laneId: u.key } : { cardId: u.key }, rename: s, reason: k }), !1;
      }
      return p === l ? !1 : (n = c, T(n), e.announce?.(`${l} renamed to ${p}.`), L(o.onChange, n, { rename: s }), p);
    },
    onKeyDown(r, a) {
      const l = W(r.id);
      if (l?.kind !== "card" || d || i || x || a.ctrlKey || a.metaKey || a.altKey) return !1;
      const u = n.cards.find((p) => p.id === l.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Fe(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && gn())
        return a.preventDefault(), Fe(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (g?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: p, next: s, spot: c } = g;
        if (g = null, p === null)
          return L(o.onPreview, null), je(u.id, c), !0;
        n = s, T(n), te(p), L(o.onPreview, null);
        const h = n.lanes.find((k) => k.id === p);
        return e.announce?.(`${u.label} moved to ${h.label}. ${Y(n, p)}.`), L(o.onChange, n, { cardId: u.id, laneId: p }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), se(), e.announce?.(`Move cancelled. ${u.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const r = (e.getSelectedNodes?.() ?? []).filter((a) => w.get(a.id) === a).map((a) => a.id);
      D = r.length === 1, w.clear(), m.clear(), y.clear(), I.clear(), v.clear(), x = null, g = null, T(i ?? n, { animate: !1 }), r.length === 1 && (O = O.then(() => {
        D = !1;
        const a = w.get(r[0]);
        if (!f && a && !(e.getSelectedNodes?.() ?? []).length) {
          const l = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(l) : l();
        }
        $e();
      }));
    }
  };
  Q.onFreeMove = (r, a) => {
    if (!Be() || r.options?.isComment) return De();
    const l = Ue(a), u = Ge(r), p = n.lanes.filter((c) => !Ae(r) && be(n, c.id, u) === null).map((c) => c.id), s = l ? Ae(r) ?? be(n, l, u) : null;
    C && C.noteId === r.id && C.laneId === l && C.refusal === s || (C = { noteId: r.id, laneId: l, refusal: s, open: p }, ae());
  }, Q.onFreeDrop = (r, a) => {
    if (De(), !Be() || r.options?.isComment) return;
    const l = Ue(a);
    if (!l) return;
    const u = Ge(r), p = n.lanes.find((c) => c.id === l), s = Ae(r) ?? be(n, l, u);
    return s ? (K(!1), A = { laneId: l, reason: s, timer: setTimeout(() => K(), 1500) }, ae(), e.announce?.(`${kn(u.label)} can't go in ${p.label}. ${s}`), L(o.onRefuse, { noteId: r.id, laneId: l, reason: s }), "refused") : (bn(r, l, u), "taken");
  }, Q.undoState = () => ({ cards: n.cards.map((r) => ({ ...r })), pairs: [...E] }), Q.onUndoRestore = (r, a) => {
    if (f) return;
    const l = new Map((r?.cards ?? []).map((s) => [s.id, s])), u = new Map(r?.pairs ?? []), p = (s) => E.get(s) ?? u.get(s) ?? s;
    for (const s of a.added) {
      const c = p(s), h = n.cards.find((k) => k.id === c);
      h && (n = F({ ...n, cards: n.cards.filter((k) => k !== h) }), T(n), ge(L(o.onChange, n, { cardId: c, cardToNote: { noteId: s } }), () => {
      }));
    }
    for (const s of a.removed) {
      const c = p(s), h = l.get(c);
      if (!h || n.cards.some((b) => b.id === c)) continue;
      const k = { id: c, label: h.label, ...h.look ? { look: h.look } : {} }, S = [h.laneId, ...n.lanes.map((b) => b.id)].find((b) => ye(n, b, k));
      if (!S) {
        e.announce?.(`${h.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      n = vn(ye(n, S, k), c, r?.cards ?? []), c !== s && E.set(s, c), T(n), ge(L(o.onChange, n, { cardId: c, laneId: S, noteToCard: { noteId: s, label: h.label, ...h.look ? { look: h.look } : {} } }), () => {
      });
    }
  };
  const pe = e.setDragPolicy(Q), we = o.onSelect && e.onSelectionChange?.(() => $e()), j = () => {
    g && se();
  };
  e.element?.addEventListener?.("pointerdown", j, !0), T(n, { animate: !1 });
  function ze(r, a, l) {
    const u = n.cards.find((b) => b.id === r);
    if (!u) return { kind: "outside" };
    const p = n.lanes.map((b) => w.get(q(_.column(b.id)))).filter(Boolean), s = e.hitTestNodes(a, p, { padding: 6 }), c = s ? W(s.id).key : null;
    if (!c) return { kind: "outside" };
    if (c === u.laneId) return { kind: "home" };
    const h = ue(n, r, c);
    if (!h) return { kind: "refused", laneId: c, reason: Me(n, r, c) ?? "That move is not available." };
    if (!l) return { kind: "candidate", laneId: c, next: h };
    let k = null;
    try {
      k = l({ x: a.x - $.x, y: a.y - $.y });
    } catch (b) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", b), { kind: "candidate", laneId: c, next: h };
    }
    const S = k?.cards.find((b) => b.id === r)?.laneId;
    return !k || !S || S === u.laneId ? { kind: "home" } : { kind: "candidate", laneId: S, next: k };
  }
  function gn() {
    return new Set(X(n, { layout: B }).places.map((r) => r.row)).size > 1;
  }
  function Fe(r, a, l = !1) {
    const u = n.cards.find((b) => b.id === r), p = Ye(n, r), s = g?.cardId === r && g.laneId === null ? g.side : void 0;
    if (s !== void 0) {
      if (l || a === s) return;
      const b = s > 0 ? n.lanes[n.lanes.length - 1] : n.lanes[0];
      if (se(), b.id === u.laneId) {
        te(b.id, i ?? n), e.announce?.(`${u.label} is back in ${b.label}.`);
        return;
      }
      if (p.includes(b)) {
        const N = ue(n, r, b.id);
        g = { cardId: r, laneId: b.id, next: N }, T(N), te(b.id, N), L(o.onPreview, N), e.announce?.(`${u.label} to ${b.label}: ${Y(N, b.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const R = Me(n, r, b.id) ?? "That move is not available.";
      K(), A = { laneId: b.id, reason: R, timer: setTimeout(() => K(), 1500) }, T(i ?? n), te(b.id, i ?? n), e.announce?.(`${u.label} can't move to ${b.label}. ${R}`), L(o.onRefuse, { cardId: r, laneId: b.id, reason: R });
      return;
    }
    const c = g?.cardId === r ? g.laneId : u.laneId;
    let h;
    if (l) {
      const { places: b } = X(n, { layout: B }), R = b.find((N) => N.laneId === c);
      h = b.filter((N) => N.column === R.column && (N.row - R.row) * a > 0).sort((N, V) => (N.row - V.row) * a).map((N) => n.lanes.find((V) => V.id === N.laneId));
    } else {
      const b = n.lanes.findIndex((R) => R.id === c);
      h = a > 0 ? n.lanes.slice(b + 1) : n.lanes.slice(0, b).reverse();
    }
    const k = h.find((b) => p.includes(b));
    if (K(), !k) {
      const b = h[0];
      if (!b) {
        if (!l && ke(n)) {
          const N = We(n, r);
          if (N) {
            e.announce?.(N), L(o.onRefuse, { cardId: r, laneId: null, reason: N });
            return;
          }
          yn(u, a);
          return;
        }
        e.announce?.(`${u.label} has no lane to move to on that side.`);
        return;
      }
      const R = Me(n, r, b.id) ?? "That move is not available.";
      A = { laneId: b.id, reason: R, timer: setTimeout(() => K(), 1500) }, T(g?.next ?? i ?? n), te(b.id, g?.next ?? i ?? n), e.announce?.(`${u.label} can't move to ${b.label}. ${R}`), L(o.onRefuse, { cardId: r, laneId: b.id, reason: R });
      return;
    }
    if (k.id === u.laneId) {
      se(), te(k.id, i ?? n), e.announce?.(`${u.label} is back in ${k.label}.`);
      return;
    }
    const S = ue(n, r, k.id);
    g = { cardId: r, laneId: k.id, next: S }, T(S), te(k.id, S), L(o.onPreview, S), e.announce?.(`${u.label} to ${k.label}: ${Y(S, k.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function te(r, a = n) {
    const l = X(a, { layout: B, rows: Ke() }).places.find((k) => k.laneId === r), u = e.canvas?.viewbox?.();
    if (!l || !u || !(u.width > 0) || !(u.height > 0)) return;
    const p = 16, s = (k, S, b, R) => S + p * 2 >= R || k - p < b ? k - p - b : k + S + p > b + R ? k + S + p - (b + R) : 0, c = s($.x + l.x, l.width, u.x, u.width), h = s($.y + l.y, l.height, u.y, u.height);
    (c || h) && e.panBy?.({ x: c, y: h });
  }
  function $e() {
    if (!o.onSelect || D) return;
    const r = f ? [] : e.getSelectedNodes?.() ?? [], a = r.length === 1 && w.get(r[0].id) === r[0] ? W(r[0].id) : null, l = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, u = l ? JSON.stringify(l) : null;
    u !== G && (G = u, L(o.onSelect, l));
  }
  function se() {
    g && (g = null, L(o.onPreview, null), T(i ?? n));
  }
  function yn(r, a) {
    const { width: l } = X(n, { layout: B }), u = w.get(q(_.card(r.id)))?.options, p = u?.width ?? 228, s = { x: a > 0 ? $.x + l + 32 : $.x - p - 32, y: u?.y ?? $.y }, c = Xe(n, r.id);
    g = { cardId: r.id, laneId: null, side: a, spot: s, next: n }, T(n), L(o.onPreview, c), e.announce?.(`${r.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function He() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Be() {
    return !f && !d && !i && !x && !He() && ke(n);
  }
  function De() {
    C && (C = null, f || ae());
  }
  function Ue(r) {
    const a = n.lanes.map((u) => w.get(q(_.column(u.id)))).filter(Boolean), l = e.hitTestNodes(r, a, { padding: 6 });
    return l ? W(l.id)?.key ?? null : null;
  }
  function Ge(r) {
    const a = r.options ?? {}, l = Hn({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    });
    return { id: r.id, label: String(a.text ?? "").replace(/\s+/g, " ").trim(), ...l ? { look: l } : {} };
  }
  function Ae(r) {
    return (r.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((l) => l !== r && (l.relationships?.associations ?? []).some((u) => u.child === r || u.childId === r.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : r.options?.image ? "A note with a picture stays a note." : null;
  }
  const kn = (r) => r || "This note";
  function bn(r, a, l) {
    const u = ye(n, a, l), p = u.cards[u.cards.length - 1], s = { ...r.options ?? {} }, c = { x: r.options?.x ?? 0, y: r.options?.y ?? 0 };
    e.beginHostStep?.(), n = u, p.id !== r.id && E.set(r.id, p.id), z.set(q(_.card(p.id)), c), e.removeNode(r.id), e.endHostStep?.(), T(n), In(q(_.card(p.id)));
    const h = n.lanes.find((S) => S.id === a);
    e.announce?.(`${p.label} is now a card in ${h.label}. ${Y(n, a)}.`);
    const k = { cardId: p.id, laneId: a, noteToCard: { noteId: r.id, label: p.label, ...p.look ? { look: p.look } : {} } };
    ge(L(o.onChange, n, k), () => {
      if (!f) {
        if (n.cards.some((S) => S.id === p.id) && (n = F({ ...n, cards: n.cards.filter((S) => S.id !== p.id) }), T(n)), !e.nodes.one(s.id)) {
          e.beginHostStep?.();
          const S = e.addNode({ ...s });
          S && (S.announcedByCreator = !0), e.endHostStep?.();
        }
        e.announce?.(`${p.label} could not be saved as a card. It is a note on the canvas again.`);
      }
    });
  }
  function je(r, a) {
    const l = n.cards.find((b) => b.id === r), u = n.lanes.find((b) => b.id === l.laneId), p = Xe(n, r), s = m.get(q(_.card(r))) ?? {}, c = e.nodes.one(r) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : r, h = (P.cornerRadius ?? 0) > 0, k = {
      id: c,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: s.width ?? 228,
      height: s.height ?? 76,
      text: l.label,
      shape: h ? "roundedrectangle" : "rectangle",
      backgroundColor: l.look?.backgroundColor ?? s.backgroundColor,
      fontColor: l.look?.textColor ?? s.foregroundColor,
      fontSize: l.look?.fontSize ?? s.fontSize,
      borderColor: l.look?.borderColor ?? s.borderColor,
      borderWidth: l.look?.borderWidth ?? s.borderWidth,
      ...l.look?.fontFamily ?? s.fontFamily ? { fontFamily: l.look?.fontFamily ?? s.fontFamily } : {}
    };
    for (const b of Object.keys(k)) k[b] === void 0 && delete k[b];
    e.beginHostStep?.(), n = p, c !== r ? E.set(c, r) : E.delete(c);
    const S = e.addNode(k);
    S && (S.announcedByCreator = !0), e.endHostStep?.(), T(n), S?.ready?.then?.(() => {
      if (f || e.nodes.one(c) !== S) return;
      const b = () => e.selectNodes?.([S]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(b) : b();
    }), e.announce?.(`${l.label} is now a note on the canvas. ${u.label}: ${Y(n, u.id)}.`), ge(L(o.onChange, n, { cardId: r, cardToNote: { noteId: c } }), () => {
      if (!f) {
        if (e.nodes.one(c) === S && (e.beginHostStep?.(), e.removeNode(c), e.endHostStep?.()), !n.cards.some((b) => b.id === r)) {
          const b = { id: r, label: l.label, ...l.look ? { look: l.look } : {} }, R = ye(n, l.laneId, b);
          R && (n = R, T(n));
        }
        e.announce?.(`${l.label} could not be saved as a note. It is a card again.`);
      }
    });
  }
  function vn(r, a, l) {
    const u = l.map((k) => k.id), p = u.indexOf(a), s = r.cards.find((k) => k.id === a);
    if (p < 0 || !s) return r;
    const c = r.cards.filter((k) => k !== s), h = c.findIndex((k) => u.indexOf(k.id) > p);
    return c.splice(h < 0 ? c.length : h, 0, s), F({ ...r, cards: c });
  }
  function In(r) {
    O = O.then(() => {
      const a = w.get(r);
      if (f || !a) return;
      const l = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(l) : l();
    });
  }
  function xn(r, a) {
    K(!1), A = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => K(), 1500) }, T(n, { skip: a.cardId });
    const l = n.lanes.find((u) => u.id === a.laneId);
    e.announce?.(`${r} can't move to ${l?.label ?? "that lane"}. ${a.reason}`), L(o.onRefuse, a);
  }
  function K(r = !0) {
    A && (clearTimeout(A.timer), A = null, r && !f && ae());
  }
  function ae() {
    T(x && x.outcome.kind === "candidate" ? x.outcome.next : g?.next ?? i ?? n, { skip: x?.cardId });
  }
  function qe(r) {
    const a = on(r, { native: !0, origin: $, rows: Ke(), layout: B, style: P }).nodes, l = new Map(a.map((s) => [s.options.id, s.options])), u = (s, c, h, k = !1) => {
      const S = l.get(_.column(s));
      S && (S.borderColor = c, S.borderWidth = h, delete S.borderStyle);
      const b = k && l.get(_.lane(s));
      b && (b.borderColor = c, b.borderWidth = h);
    }, p = x?.cardId ?? g?.cardId;
    if (M = /* @__PURE__ */ new Map(), p) {
      const s = n.cards.find((h) => h.id === p)?.laneId;
      for (const h of Ye(n, p)) h.id !== s && (u(h.id, Qe, 2), M.set(h.id, "open"));
      const c = x ? x.outcome : g?.laneId ? { kind: "candidate", laneId: g.laneId } : null;
      c?.kind === "candidate" && (u(c.laneId, Je, 3, !0), M.set(c.laneId, "over")), c?.kind === "refused" && (u(c.laneId, Ee, 3), M.set(c.laneId, "refused"));
    }
    if (C && !p) {
      for (const s of C.open) s !== C.laneId && (u(s, Qe, 2), M.set(s, "open"));
      C.laneId && !C.refusal && (u(C.laneId, Je, 3, !0), M.set(C.laneId, "over")), C.laneId && C.refusal && (u(C.laneId, Ee, 3), M.set(C.laneId, "refused"));
    }
    if (g?.laneId === null && g.spot) {
      const s = l.get(_.card(g.cardId));
      s && (s.xPos = g.spot.x, s.yPos = g.spot.y);
    }
    if (A) {
      M.set(A.laneId, "refused"), u(A.laneId, Ee, 3, !0);
      const s = l.get(_.caption(A.laneId));
      s && (s.text = A.reason, s.foregroundColor = "#b42318");
    }
    for (const s of a) {
      s.options.id = q(s.options.id);
      for (const c of s.relationships.associations)
        c.parentId = q(c.parentId), c.childId = q(c.childId);
    }
    return a;
  }
  function Ke() {
    return x || g ? n.lanes.map((r) => n.cards.filter((a) => a.laneId === r.id).length) : void 0;
  }
  function T(r, a = {}) {
    if (f) return;
    H = { model: r, skip: a.skip, animate: a.animate !== !1 };
    const l = qe(r), u = [];
    for (const { options: s } of l) {
      const c = s.id;
      if (w.has(c)) continue;
      const h = z.get(c);
      z.delete(c);
      const k = h && a.animate !== !1 && !Ve() ? { ...s, xPos: h.x, yPos: h.y } : s, S = e.nodes.add(An(k));
      w.set(c, S), m.set(c, { ...k }), S.ready && u.push(S.ready.then(() => {
        if (w.get(c) !== S) return;
        S.applyGovernance?.(), W(c)?.kind === "column" && S.toBack?.(!1);
        const b = _e(H?.model ?? r, c);
        b && S.svgGroup?.node?.setAttribute("aria-label", b);
      }).catch(() => {
      }));
    }
    const p = H;
    O = Promise.all([O, ...u]).then(() => {
      f || H !== p || Cn(qe(p.model), p);
    }).catch((s) => console.warn("WORKSHOP: could not draw the workshop", s));
  }
  function Cn(r, a) {
    const l = new Set(r.map((p) => p.options.id)), u = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [s, c] of [...w]) {
        if (l.has(s)) continue;
        for (const [k, S] of [...y])
          S.parentId !== s && S.childId !== s || (S.parent.relationships?.removeAssociation(k), y.delete(k));
        e.deselectNode?.(c), c.editor?.cancelInline?.(), w.delete(s), m.delete(s);
        const h = v.get(s);
        h && (v.delete(s), I.delete(h)), e.nodes.remove(s);
      }
      for (const { options: s } of r) {
        const c = s.id, h = w.get(c);
        if (!h?.svgGroup) continue;
        const k = m.get(c) ?? {}, S = h.editor?.isInlineEditing?.();
        (s.fontSize !== k.fontSize || s.foregroundColor !== k.foregroundColor) && (h.options.fontSize = s.fontSize, h.options.fontColor = s.foregroundColor, h.applyTextStyle?.()), s.text !== k.text && !S && h.setText?.(s.text), (s.width !== k.width || s.height !== k.height) && (s.vectorPath ? (h.options.width = s.width, h.options.height = s.height, h.setShape?.(h.options.shape, s.vectorPath), W(c)?.kind === "column" && h.toBack?.(!1)) : h.setSize?.(s.width, s.height)), s.backgroundColor !== k.backgroundColor && h.setColors?.(s.backgroundColor), (s.borderColor !== k.borderColor || s.borderWidth !== k.borderWidth || s.borderStyle !== k.borderStyle) && (h.options.borderColor = s.borderColor, h.options.borderWidth = s.borderWidth, h.options.borderStyle = s.borderStyle, h.applyBorder?.());
        const b = s.xPos !== k.xPos || s.yPos !== k.yPos || Math.abs((h.options.x ?? 0) - s.xPos) > 0.5 || Math.abs((h.options.y ?? 0) - s.yPos) > 0.5;
        if (c !== (a.skip && q(_.card(a.skip))) && b) {
          const V = a.animate && !Ve() ? 180 : 0, Ze = u.includes(h) ? () => {
            !f && w.get(c) === h && (e.getSelectedNodes?.() ?? []).includes(h) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Ze && V && u.length === 1 && h.resizeRotate?.disable?.(), h.position(s.xPos, s.yPos, Ze, void 0, V);
        }
        const R = _e(a.model, c);
        R && h.svgGroup.node.getAttribute("aria-label") !== R && h.svgGroup.node.setAttribute("aria-label", R);
        const N = W(c);
        if (N?.kind === "column") {
          const V = M.get(N.key);
          V ? h.svgGroup.node.setAttribute("data-workshop-drop", V) : h.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        m.set(c, { ...s });
      }
      const p = /* @__PURE__ */ new Map();
      for (const s of r) for (const c of s.relationships.associations) p.set(c.id, c);
      for (const [s, c] of [...y])
        p.has(s) && w.get(c.parentId) === c.parent && w.get(c.childId) === c.child || (c.parent.relationships?.removeAssociation(s), y.delete(s));
      for (const [s, c] of p) {
        if (y.has(s)) continue;
        const h = w.get(c.parentId), k = w.get(c.childId);
        !h?.relationships || !k?.svgGroup || (h.relationships.addAssociation(k, Tn(c)), y.set(s, { parentId: c.parentId, childId: c.childId, parent: h, child: k }));
      }
    }), e.notifyNodeChanged?.();
  }
  function _e(r, a) {
    const l = W(a);
    if (l?.kind === "lane") {
      const u = r.lanes.find((p) => p.id === l.key);
      return u ? `${u.label}, ${Y(r, u.id)}` : null;
    }
    if (l?.kind === "card") {
      const u = r.cards.find((s) => s.id === l.key), p = u && r.lanes.find((s) => s.id === u.laneId);
      return u && p ? `${u.label}, in ${p.label}` : null;
    }
    return null;
  }
  function Sn(r, a) {
    const l = on(r, { native: !0, origin: $, layout: B, style: P }).nodes.find((u) => u.options.id === a)?.options;
    return l ? { x: l.xPos, y: l.yPos } : null;
  }
  function le() {
    x && e.cancelGovernedDrag?.("host"), x = null, g && (g = null, L(o.onPreview, null)), K(!1);
  }
  return {
    get value() {
      return n;
    },
    get origin() {
      return { ...$ };
    },
    get layout() {
      return { ...B };
    },
    get bounds() {
      const { width: r, height: a } = X(n, { layout: B });
      return { x: $.x, y: $.y, width: r, height: a };
    },
    setLayout(r) {
      if (f) throw new Error("This workshop has been detached.");
      const a = r?.lanesPerRow === void 0 ? {} : { lanesPerRow: r.lanesPerRow };
      X(n, { layout: a }), a.lanesPerRow !== B.lanesPerRow && (le(), B = a, T(i ?? n));
    },
    whenDrawn: () => O,
    update(r) {
      if (f) throw new Error("This workshop has been detached.");
      const a = F(r);
      le(), n = a, T(i ?? n);
    },
    preview(r) {
      if (f) throw new Error("This workshop has been detached.");
      const a = r ? F(r) : null;
      le(), i = a, T(i ?? n), e.refreshGovernance?.();
    },
    refuse(r, a) {
      const l = n.lanes.find((u) => u.id === r);
      f || !l || (K(!1), A = { laneId: r, reason: a, timer: setTimeout(() => K(), 1500) }, ae(), e.announce?.(`${l.label}: ${a}`));
    },
    setReadOnly(r) {
      f || d === !!r || (le(), d = !!r, T(i ?? n), e.refreshGovernance?.());
    },
    destroy() {
      f || (le(), f = !0, e.element?.removeEventListener?.("pointerdown", j, !0), we?.(), e.withPolicyAuthority(() => {
        for (const [r, a] of y) a.parent.relationships?.removeAssociation(r);
        for (const [r, a] of w)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(r) === a && e.nodes.remove(r);
      }), y.clear(), w.clear(), m.clear(), I.clear(), v.clear(), pe(), D = !1, $e(), e.notifyNodeChanged?.());
    }
  };
}
function L(e, ...t) {
  try {
    return e?.(...t);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function ge(e, t) {
  !e || typeof e.then != "function" || e.then((o) => {
    o === !1 && t();
  }, () => {
  });
}
function Nn(e, t) {
  return e.kind === t.kind && e.laneId === t.laneId;
}
function On(e) {
  const t = e.nodes?.allNodes ?? [];
  if (!t.length) return { x: 40, y: 40 };
  let o = -1 / 0, n = 1 / 0;
  for (const i of t)
    o = Math.max(o, (i.options.x ?? 0) + (i.options.width ?? 0)), n = Math.min(n, i.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(n) };
}
function ee(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Z(e, t = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > t)
    throw new Error(`Labels must contain 1 to ${t} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function an(e) {
  const t = ee(e);
  let o;
  try {
    o = new URL(Z(t.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: Z(t.alt, 240) };
}
function J(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const zn = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Fn = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function fe(e) {
  const t = ee(e), o = {}, n = (d) => {
    if (typeof d != "string" || !zn.test(d)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return d;
  }, i = (d, f, w) => {
    if (typeof d != "number" || !Number.isFinite(d) || d < f || d > w) throw new Error("A card size is out of range.");
    return d;
  };
  if (t.backgroundColor !== void 0 && (o.backgroundColor = n(t.backgroundColor)), t.textColor !== void 0 && (o.textColor = n(t.textColor)), t.borderColor !== void 0 && (o.borderColor = n(t.borderColor)), t.fontFamily !== void 0) {
    if (typeof t.fontFamily != "string" || !Fn.test(t.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = t.fontFamily;
  }
  return t.fontSize !== void 0 && (o.fontSize = i(t.fontSize, 6, 200)), t.borderWidth !== void 0 && (o.borderWidth = i(t.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Hn(e) {
  const t = {};
  for (const [o, n] of Object.entries(e ?? {}))
    if (n !== void 0)
      try {
        fe({ [o]: n }) && (t[o] = n);
      } catch {
      }
  return fe(t);
}
function oe(e, t) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${t}.`);
}
function ln({ lanes: e, presentationOrder: t }) {
  if (t === void 0) return e.slice();
  if (!Array.isArray(t) || t.length !== e.length || new Set(t).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(t, (o) => {
    const n = e.find((i) => i.id === o);
    if (!n) throw new Error("Presentation order refers to an unknown lane.");
    return n;
  });
}
function Bn(e) {
  return (e.signals ?? []).map((t) => {
    const o = e.cards.some((n) => n.id === t.cardId && n.laneId === t.laneId);
    return { ...t, present: o, text: o ? t.whenPresent : t.whenAbsent };
  });
}
const ie = (e) => "lane-" + e, ne = (e) => "card-" + e, Ce = (e) => "image-" + e;
function dt(e) {
  const t = Bn(e);
  return ln(e).map((o) => {
    const n = e.cards.filter((f) => f.laneId === o.id), i = t.filter((f) => f.laneId === o.id), d = [ie(o.id)];
    return o.station?.image && d.push(Ce(o.id)), { lane: o, cards: n, signals: i, nodeIds: [...d, ...n.map((f) => ne(f.id))] };
  });
}
const dn = 5, cn = 24, Te = 3;
function F(e) {
  const t = ee(e);
  if (t.version !== 1) throw new Error("Unsupported workshop version.");
  if (t.kind !== void 0 && t.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = t.kind === "release-plan", n = Z(t.title, 120);
  if (!Array.isArray(t.lanes) || t.lanes.length < 2 || t.lanes.length > dn)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(t.cards) || t.cards.length > cn)
    throw new Error("A workshop supports up to 24 cards.");
  const i = t.lanes.map((m) => {
    const y = ee(m), I = { id: J(y.id), label: Z(y.label) };
    if (y.capacity !== void 0) {
      const v = o ? 576 : 24;
      if (typeof y.capacity != "number" || !Number.isInteger(y.capacity) || y.capacity < 1 || y.capacity > v)
        throw new Error(`Lane capacity must be a whole number from 1 to ${v}.`);
      I.capacity = y.capacity;
    }
    if (y.station !== void 0) {
      const v = ee(y.station), x = (C) => {
        if (typeof C != "number" || !Number.isInteger(C) || C < 0 || C >= Te)
          throw new Error("Use map coordinates from 0 to 2.");
        return C;
      };
      if (!Array.isArray(v.next) || v.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const g = v.next.map(J);
      oe(g, "onward stop"), I.station = { column: x(v.column), row: x(v.row), next: g, outcome: Z(v.outcome, 160) }, v.image !== void 0 && (I.station.image = an(v.image));
    }
    return I;
  }), d = i.map((m) => m.id);
  if (oe(d, "lane ID"), (o || i.some((m) => m.station)) && !t.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (i.some((m) => m.station)) {
    if (!i.every((m) => m.station)) throw new Error("Give every station on the map a position.");
    oe(i.map((m) => m.station.column + "," + m.station.row), "map position");
    for (const m of i)
      if (m.station.next.some((y) => y === m.id || !d.includes(y))) throw new Error("Connect each stop to another station on this map.");
  }
  const f = t.cards.map((m) => {
    const y = ee(m), I = { id: J(y.id), label: Z(y.label), laneId: J(y.laneId) };
    if (!d.includes(I.laneId)) throw new Error("Card refers to an unknown lane.");
    if (y.allowedLaneIds !== void 0) {
      if (!Array.isArray(y.allowedLaneIds) || y.allowedLaneIds.length > i.length) throw new Error("Invalid allowed lanes.");
      if (I.allowedLaneIds = y.allowedLaneIds.map(J), oe(I.allowedLaneIds, "allowed lane"), !I.allowedLaneIds.includes(I.laneId) || !I.allowedLaneIds.every((v) => d.includes(v)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (y.look !== void 0) {
      const v = fe(y.look);
      v && (I.look = v);
    }
    if (o) {
      if (typeof y.points != "number" || !Number.isInteger(y.points) || y.points < 1 || y.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (I.points = y.points, y.dependsOn !== void 0) {
        if (!Array.isArray(y.dependsOn) || y.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        I.dependsOn = y.dependsOn.map(J), oe(I.dependsOn, "dependency");
      }
    }
    return I;
  });
  oe(f.map((m) => m.id), "card ID");
  const w = { version: 1, title: n, lanes: i, cards: f };
  if (t.experience !== void 0) {
    const m = ee(t.experience);
    if (m.version !== 1 || m.kind !== "customer-interviews" && m.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    w.experience = { version: 1, kind: m.kind };
  }
  if (t.signals !== void 0) {
    if (!Array.isArray(t.signals) || t.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    w.signals = t.signals.map((m) => {
      const y = ee(m), I = J(y.cardId), v = J(y.laneId);
      if (!f.some((x) => x.id === I) || !d.includes(v))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: J(y.id),
        label: Z(y.label),
        cardId: I,
        laneId: v,
        whenPresent: Z(y.whenPresent, 160),
        whenAbsent: Z(y.whenAbsent, 160)
      };
    }), oe(w.signals.map((m) => m.id), "placement outcome ID");
  }
  if (t.presentationOrder !== void 0) {
    if (!Array.isArray(t.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    w.presentationOrder = ln({ lanes: i, presentationOrder: t.presentationOrder }).map((m) => m.id);
  }
  if (o)
    return w.kind = "release-plan", Pn(w), w;
  for (const m of i)
    if (f.filter((y) => y.laneId === m.id).length > (m.capacity ?? 1 / 0))
      throw new Error(`Lane "${m.label}" exceeds its capacity.`);
  return w;
}
const un = 65536;
function ct(e) {
  const t = JSON.stringify(F(e)), o = "#" + new URLSearchParams({ model: t }).toString();
  if (o.length > un) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function ut(e) {
  if (e.length > un) throw new Error("This workshop is too large to open from a link.");
  const t = new URLSearchParams(e.slice(1)), o = t.get("model");
  if (!e.startsWith("#") || !o || Array.from(t.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let n;
  try {
    n = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return F(n);
}
function Ie(e, t) {
  if (e.kind === "release-plan") return e.lanes.filter((n) => xe(e, t, n.id) !== null);
  const o = e.lanes.find((n) => n.id === t.laneId)?.station;
  return e.lanes.filter((n) => n.id === t.laneId || (!o || o.next.includes(n.id)) && (!t.allowedLaneIds || t.allowedLaneIds.includes(n.id)) && e.cards.filter((i) => i.laneId === n.id).length < (n.capacity ?? 1 / 0));
}
function Le(e, t, o) {
  const n = e.cards.find((i) => i.id === t);
  if (n && e.kind === "release-plan") {
    const i = xe(e, n, o);
    if (!i) throw new Error("Move is unavailable.");
    return i;
  }
  if (!n || !Ie(e, n).some((i) => i.id === o)) throw new Error("Move is unavailable.");
  return n.laneId === o ? e : { ...e, cards: e.cards.map((i) => i === n ? { ...n, laneId: o } : i) };
}
function ue(e, t, o) {
  const n = e.cards.find((d) => d.id === t);
  if (!n || !e.lanes.some((d) => d.id === o)) return null;
  if (n.laneId === o) return e;
  if (e.kind === "release-plan") return xe(e, n, o);
  const i = Kn(e, t, o);
  return i || (o === "prototype" && he(e) === "customer-interviews" ? null : Ie(e, n).some((d) => d.id === o) ? Le(e, t, o) : null);
}
function Ye(e, t) {
  return e.lanes.filter((o) => ue(e, t, o.id) !== null);
}
function Me(e, t, o) {
  if (ue(e, t, o) !== null) return null;
  const n = e.cards.find((m) => m.id === t), i = e.lanes.find((m) => m.id === o);
  if (!n || !i) return "That move is not available.";
  const d = `This card can't go in ${i.label}.`;
  if (n.allowedLaneIds && !n.allowedLaneIds.includes(o)) return d;
  if (e.kind === "release-plan") {
    if (i.capacity === void 0) return d;
    const m = re(e, o), y = { ...e, lanes: e.lanes.map((v) => v === i ? { id: i.id, label: i.label } : v) }, I = xe(y, n, o);
    return I ? `Needs ${re(I, o) - m} points. It already holds ${m} of ${i.capacity} points.` : d;
  }
  const f = e.lanes.find((m) => m.id === n.laneId);
  if (f?.station && !f.station.next.includes(o)) return `${i.label} can't be reached from ${f.label}.`;
  const w = e.cards.filter((m) => m.laneId === o).length;
  return i.capacity !== void 0 && w >= i.capacity ? `It already holds ${w} of ${i.capacity} ${i.capacity === 1 ? "card" : "cards"}.` : d;
}
function ke(e) {
  return !e.kind && !e.lanes.some((t) => t.station) && !he(e);
}
const Dn = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Un(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((n) => n.id));
  return typeof t == "string" && Dn.test(t) && !o.has(t) ? t : Pe(e, "card");
}
function be(e, t, o) {
  const n = e.lanes.find((f) => f.id === t);
  if (!n) return "That lane is no longer on the board.";
  if (e.lanes.some((f) => f.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (he(e)) return "This workshop keeps the cards it came with.";
  const i = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!i) return "A card needs some words. Type on the note first.";
  if (i.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(i)) return "A card holds plain words only.";
  if (e.cards.length >= cn) return "A workshop holds up to 24 cards.";
  const d = e.cards.filter((f) => f.laneId === t).length;
  if (n.capacity !== void 0 && d >= n.capacity) return `It already holds ${d} of ${n.capacity} ${n.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      fe(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  return null;
}
function ye(e, t, o) {
  if (be(e, t, o) !== null) return null;
  const n = o.look === void 0 ? void 0 : fe(o.look), i = { id: Un(e, o.id), label: o.label.replace(/\s+/g, " ").trim(), laneId: t, ...n ? { look: n } : {} };
  return F({ ...e, cards: [...e.cards, i] });
}
function We(e, t) {
  const o = e.cards.find((n) => n.id === t);
  if (!o) return "That card is no longer on the board.";
  if (!ke(e)) return e.lanes.some((n) => n.station) ? "The token stays on the map." : "This card stays on the board.";
  if ((e.signals ?? []).some((n) => n.cardId === t)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const n = o.allowedLaneIds.map((d) => e.lanes.find((f) => f.id === d).label), i = n.length > 1 ? n.slice(0, -1).join(", ") + " or " + n.at(-1) : n[0];
    return `${o.label} may only be in ${i}, so it stays a card.`;
  }
  return null;
}
function Xe(e, t) {
  return We(e, t) !== null ? null : F({ ...e, cards: e.cards.filter((o) => o.id !== t) });
}
function Y(e, t) {
  const o = e.lanes.find((d) => d.id === t);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const d = re(e, t);
    return o.capacity ? d + " / " + o.capacity + " points" : d + " points";
  }
  const n = _n(e, t);
  if (n) return "$" + n.amount + " · " + n.description;
  const i = e.cards.filter((d) => d.laneId === t).length;
  return o.capacity !== void 0 ? i + " of " + o.capacity : i + (i === 1 ? " card" : " cards");
}
const Se = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, ve = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function fn(e, t = Se, o = 28) {
  const { pitch: n, row: i, top: d } = t, f = !!e.lanes[0].station, w = e.lanes.map((I) => e.cards.filter((v) => v.laneId === I.id).length), m = d + Math.max(1, ...w) * i + 36, y = e.lanes.map((I, v) => ({
    x: f ? I.station.column * (n + o) : v * n,
    y: f ? I.station.row * m : 0
  }));
  return {
    points: y,
    width: Math.max(...y.map((I) => I.x)) + n,
    height: Math.max(...y.map((I, v) => I.y + d + (f ? Math.max(1, w[v]) : w[v] + 1) * i))
  };
}
function ft() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Pe(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((i) => i.id));
  let n = 1;
  for (; o.has(t + "-" + n); ) n++;
  return t + "-" + n;
}
function hn(e) {
  const t = F(e);
  if (t.kind || t.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return t;
}
function ht(e, t) {
  const o = hn(e), n = Pe(o, "lane");
  return o.lanes.push({ id: n, label: t.label, ...t.capacity === void 0 ? {} : { capacity: t.capacity } }), o.presentationOrder?.push(n), F(o);
}
function pt(e, t, o) {
  const n = hn(e);
  return n.cards.push({
    id: Pe(n, "card"),
    label: o.label,
    laneId: t,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), F(n);
}
function wt() {
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
function mt(e, t, o) {
  const n = F(e);
  if (n.kind || !n.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const i = n.lanes.find((I) => I.id === t);
  if (!i?.station) throw new Error("Choose a station on this map.");
  if (n.lanes.length >= dn) throw new Error("A map can have up to five stations.");
  const d = Z(o?.label), f = Z(o?.outcome, 160), w = Pe(n, "station");
  let m, y = 1 / 0;
  for (let I = 0; I < Te; I++)
    for (let v = 0; v < Te; v++) {
      if (n.lanes.some((g) => g.station.column === v && g.station.row === I)) continue;
      const x = Math.abs(i.station.column - v) + Math.abs(i.station.row - I);
      x < y && (y = x, m = { column: v, row: I });
    }
  if (!m) throw new Error("There is no free station position.");
  return i.station.next.push(w), n.lanes.push({ id: w, label: d, station: { ...m, next: [], outcome: f, ...o.image === void 0 ? {} : { image: an(o.image) } } }), n.presentationOrder?.push(w), n;
}
const gt = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, pn = (e) => "caption-" + e, ce = (e) => "column-" + e, _ = { lane: ie, card: ne, image: Ce, caption: pn, column: ce };
function wn(e, t) {
  let o = 2;
  for (; t(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function en(e, t, o) {
  const n = Math.max(0, Math.min(o, e / 2, t / 2)), i = e, d = t;
  return n ? `M ${n} 0 H ${i - n} Q ${i} 0 ${i} ${n} V ${d - n} Q ${i} ${d} ${i - n} ${d} H ${n} Q 0 ${d} 0 ${d - n} V ${n} Q 0 0 ${n} 0 Z` : `M 0 0 H ${i} V ${d} H 0 Z`;
}
function nn(e, t) {
  const o = (n) => Math.round(parseInt(e.slice(n, n + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function tn(e, t, o, n) {
  for (let i = t; i > 11; i--) {
    const d = Math.max(1, Math.floor(o / (i * 0.55)));
    if (e.split(`
`).reduce((w, m) => w + Math.max(1, Math.ceil(m.length / d)), 0) * i * 1.3 <= n) return i;
  }
  return Math.min(t, 11);
}
const mn = 152, Re = mn + 12, Gn = 12;
function jn(e, t) {
  const o = e?.lanesPerRow;
  if (o === void 0) return t;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, t);
}
function X(e, t = {}) {
  const o = F(e), { pitch: n, row: i, top: d } = Se, f = o.lanes.map((x) => o.cards.filter((g) => g.laneId === x.id).length), w = (x) => Math.max(f[x], (Array.isArray(t.rows) ? t.rows[x] : t.rows) ?? 0), m = !!o.lanes[0].station, y = o.lanes.some((x) => x.station?.image), I = jn(t.layout, o.lanes.length), v = [];
  if (m) {
    const { points: x } = fn(o);
    o.lanes.forEach((g, C) => v.push({
      laneId: g.id,
      x: x[C].x,
      y: x[C].y + (y ? g.station.row * Re : 0),
      width: n,
      height: d + (g.station.image ? Re : 0) + Math.max(1, f[C]) * i,
      column: g.station.column,
      row: g.station.row
    }));
  } else {
    let x = 0;
    for (let g = 0; g < o.lanes.length; g += I) {
      const C = o.lanes.slice(g, g + I), E = d + (Math.max(...C.map((z, A) => w(g + A))) + 1) * i;
      C.forEach((z, A) => v.push({ laneId: z.id, x: A * n, y: x, width: n, height: E, column: A, row: g / I })), x += E + Gn;
    }
  }
  return { places: v, width: Math.max(...v.map((x) => x.x + x.width)), height: Math.max(...v.map((x) => x.y + x.height)) };
}
function qn(e, t) {
  const { pitch: o, width: n, row: i, height: d, top: f } = Se, w = t.origin ?? { x: 0, y: 0 }, m = !!e.lanes[0].station, { places: y } = X(e, t), I = t.style ?? {}, v = I.textColor ?? de.fontColor, x = I.borderColor ?? de.borderColor, g = I.borderWidth ?? de.borderWidth, C = I.cornerRadius ?? 0, E = I.fontSize ?? de.fontSize, z = I.laneFontSize ?? E + 2, A = I.captionFontSize ?? Math.max(11, E - 1), O = [], H = (P) => {
    const M = { options: {
      shapeHint: "rectangle",
      vectorPath: en(P.width, P.height, C),
      foregroundColor: v,
      borderColor: x,
      borderWidth: g,
      ...I.fontFamily ? { fontFamily: I.fontFamily } : {},
      ...P
    }, relationships: { associations: [] } };
    return O.push(M), M;
  };
  e.lanes.forEach((P, M) => {
    const G = y[M], D = w.x + G.x, $ = w.y + G.y, U = P.station?.image;
    H({
      id: ce(P.id),
      text: "",
      name: P.label,
      xPos: D + 2,
      yPos: $,
      width: o - 4,
      height: G.height,
      vectorPath: en(o - 4, G.height, C ? C + 2 : 0),
      backgroundColor: m ? "#fcf9ed" : nn(ve[M], 0.6),
      borderColor: m ? "#a8b5aa" : nn(ve[M], 0.1),
      borderWidth: 1,
      ...m ? { borderStyle: "dashed" } : {}
    }), H({
      id: ie(P.id),
      text: P.label,
      name: P.label,
      xPos: D + 8,
      yPos: $ + 6,
      width: n,
      height: 58,
      backgroundColor: ve[M],
      fontSize: tn(P.label, z, n - 16, 50)
    }), H({
      id: pn(P.id),
      text: Y(e, P.id),
      name: P.label,
      xPos: D + 8,
      yPos: $ + 66,
      width: n,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: A
    }), U && O.push({ options: {
      id: Ce(P.id),
      name: U.alt,
      text: "",
      xPos: D + 8,
      yPos: $ + f,
      width: n,
      height: mn,
      shapeHint: "rectangle",
      image: U.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((W) => W.laneId === P.id).forEach((W, q) => {
      const Q = e.kind === "release-plan" ? W.label + `
` + W.points + " points" : W.label, pe = m ? n - 20 : n, we = m ? d - 6 : d, j = W.look ?? {};
      H({
        id: ne(W.id),
        text: Q,
        name: W.label,
        xPos: D + (m ? 18 : 8),
        yPos: $ + f + (U ? Re : 0) + q * i,
        width: pe,
        height: we,
        backgroundColor: m ? "#ffda75" : j.backgroundColor ?? I.backgroundColor ?? de.backgroundColor,
        ...j.textColor ? { foregroundColor: j.textColor } : {},
        ...j.fontFamily ? { fontFamily: j.fontFamily } : {},
        ...j.borderColor ? { borderColor: j.borderColor } : {},
        ...j.borderWidth !== void 0 ? { borderWidth: j.borderWidth } : {},
        fontSize: tn(Q, j.fontSize ?? E, pe - 16, we - 8)
      });
    });
  });
  const B = new Map(O.map((P) => [P.options.id, P]));
  for (const P of e.lanes)
    P.station && (B.get(ce(P.id)).relationships.associations = P.station.next.map((M) => ({
      id: P.id + "-to-" + M,
      parentId: ce(P.id),
      childId: ce(M),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const P of e.cards)
      for (const M of P.dependsOn ?? []) {
        const G = ne(M), D = ne(P.id);
        B.get(G).relationships.associations.push({
          id: `dependency-${M.length}-${M}-${P.id}`,
          parentId: G,
          childId: D,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (t.beside) {
    const P = new Set(t.beside), M = new Set(O.map(($) => $.options.id)), G = /* @__PURE__ */ new Map();
    for (const $ of [...M]) {
      if (!P.has($)) continue;
      const U = wn($, (W) => P.has(W) || M.has(W));
      M.add(U), G.set($, U);
    }
    const D = ($) => G.get($) ?? $;
    for (const $ of O) {
      $.options.id = D($.options.id);
      for (const U of $.relationships.associations)
        U.parentId = D(U.parentId), U.childId = D(U.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: O };
}
function on(e, t) {
  const o = F(e);
  if (t?.native) return qn(o, t);
  const { width: n, row: i, height: d, top: f } = Se, w = [];
  function m(g, C, E, z, A, O) {
    w.push({ options: {
      id: g,
      text: C,
      name: C,
      xPos: E,
      yPos: z,
      width: n,
      height: A,
      shapeHint: "rectangle",
      backgroundColor: O,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: y } = fn(o), I = 152, v = I + 12, x = o.lanes.some((g) => g.station?.image);
  o.lanes.forEach((g, C) => {
    const E = y[C].x, z = y[C].y + (x ? (g.station?.row ?? 0) * v : 0), A = g.station?.image, O = o.kind === "release-plan" ? g.label + `
` + (g.capacity ? re(o, g.id) + " / " + g.capacity + " points" : re(o, g.id) + " points") : g.label;
    m(ie(g.id), O, E, z, f - 12, ve[C]), A && w.push({ options: {
      id: Ce(g.id),
      name: A.alt,
      text: "",
      xPos: E,
      yPos: z + f,
      width: n,
      height: I,
      shapeHint: "rectangle",
      image: A.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((H) => H.laneId === g.id).forEach((H, B) => m(ne(H.id), o.kind === "release-plan" ? H.label + `
` + H.points + " points" : H.label, E, z + f + (A ? v : 0) + B * i, d, "#fffdf6"));
  });
  for (const g of o.lanes) {
    if (!g.station) continue;
    const C = w.find((E) => E.options.id === ie(g.id));
    C.relationships.associations = g.station.next.map((E) => ({ id: g.id + "-to-" + E, parentId: C.options.id, childId: ie(E), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), C.options.text = g.label + `
` + g.station.outcome, C.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const g = new Map(w.map((C) => [C.options.id, C]));
    for (const C of o.cards)
      for (const E of C.dependsOn ?? []) {
        const z = ne(E), A = ne(C.id);
        g.get(z).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${C.id}`,
          parentId: z,
          childId: A,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: w };
}
const yt = {
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
}, Ne = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Oe = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function kt() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Ne.map(({ id: e, who: t, quote: o }) => ({ id: e, label: t + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Ne.map(({ id: e, action: t, signal: o }) => ({ id: "test-" + e, label: t, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function bt() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Oe.map(({ id: e, label: t, rate: o }) => ({ id: e, label: t + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, t) => ({ id: "fund-" + t, label: e + " $200", laneId: t === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function he(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((n) => n.station)) return;
  const t = e.experience.kind, o = t === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Oe.map((n) => n.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((n) => o.includes(n.id))) && !(t === "customer-interviews" && (!e.cards.every((n) => Ne.some((i) => i.id === n.id)) || e.cards.filter((n) => n.laneId === "prototype").length > 1)))
    return t;
}
function Kn(e, t, o) {
  const n = he(e), i = e.cards.find((f) => f.id === t);
  if (!n || !i || i.laneId === o) return null;
  let d = e;
  if (n === "customer-interviews") {
    if (o !== "prototype") return null;
    const f = e.cards.find((w) => w.laneId === o);
    if (f) {
      if (!Ie(e, f).some((w) => w.id === "interviews")) return null;
      d = Le(e, f.id, "interviews");
    }
  }
  return Ie(d, i).some((f) => f.id === o) ? Le(d, t, o) : null;
}
function _n(e, t) {
  if (he(e) !== "experiment-budget") return null;
  const o = Oe.find((d) => d.id === t), n = e.cards.filter((d) => d.laneId === t).length, i = n * (o?.per ?? 0);
  return { amount: n * 200, description: o ? i + " " + (i === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  mt as addWorkshopBranch,
  pt as addWorkshopCard,
  ht as addWorkshopLane,
  lt as attachWorkshop,
  Ie as availableLanes,
  $n as canHangPanel,
  Oe as channels,
  bt as createBudgetWorkshop,
  kt as createInterviewWorkshop,
  ft as createLaneWorkshop,
  wt as createWorkshopMap,
  ut as decodeWorkshopFragment,
  at as describeFocusDarkroom,
  ct as encodeWorkshopFragment,
  Yn as handoffSummary,
  rt as hangGalleryPanel,
  yt as industrialWorkshop,
  st as initialFocusDarkroom,
  Ne as interviews,
  ve as laneColors,
  me as listeningRoom,
  et as listeningRoomCaption,
  cn as maxWorkshopCards,
  tt as moonGallery,
  Le as moveWorkshopCard,
  gt as nightTransfer,
  it as normalizeFocusDarkroom,
  Xn as normalizeListeningRoom,
  ot as normalizeMoonGallery,
  Vn as normalizeOfflineHandoff,
  Zn as offlineHandoff,
  Kn as planStartupMove,
  rn as printFields,
  re as releaseLoad,
  nt as releasePlan,
  Qn as resolveHandoff,
  Bn as resolveWorkshopSignals,
  Jn as reviewHandoff,
  he as startupExperienceKind,
  F as validateWorkshop,
  _n as workshopBudgetResult,
  ue as workshopCandidate,
  Xe as workshopCardAsNote,
  We as workshopCardAsNoteRefusal,
  Hn as workshopCardLookOf,
  Ye as workshopDestinations,
  Y as workshopLaneCaption,
  X as workshopLanePlaces,
  Se as workshopLayout,
  _ as workshopNodeIds,
  ye as workshopNoteCandidate,
  be as workshopNoteRefusal,
  fn as workshopPositions,
  ln as workshopPresentationLanes,
  dt as workshopPresentationScenes,
  Me as workshopRefusal,
  wn as workshopStandInId,
  ke as workshopTakesNotes,
  on as workshopToSlate
};
