const ot = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function rt(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, stage: n, choice: s, fieldNote: u, deskNote: h, fallback: m } = e, g = (k) => typeof k == "string" && k.trim().length > 0 && k.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(k);
  return t !== "offline-handoff" || o !== 1 || n !== "queued" && n !== "review" && n !== "resolved" || (n === "resolved" ? s !== "field" && s !== "desk" : s !== null) || s === void 0 || !g(u) || !g(h) || !g(m) ? null : { kind: t, version: o, stage: n, choice: s, fieldNote: u.trim(), deskNote: h.trim(), fallback: m.trim() };
}
function it(e) {
  return { ...e, stage: "review", choice: null };
}
function st(e, t) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: t } : e;
}
function at(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const $e = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function lt(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, mix: n, leftLabel: s, rightLabel: u } = e, h = (m) => typeof m == "string" && m.trim().length > 0 && m.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(m);
  return t !== "listening-room" || o !== 1 || typeof n != "number" || !Number.isFinite(n) || n < 0 || n > 1 || !h(s) || !h(u) ? null : { kind: t, version: o, mix: n, leftLabel: s.trim(), rightLabel: u.trim() };
}
function dt({ mix: e, leftLabel: t, rightLabel: o }) {
  return e < 0.32 ? t === $e.leftLabel ? "Rain ticks on the copper roof." : "You hear " + t + "." : e > 0.68 ? o === $e.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : t === $e.leftLabel && o === $e.rightLabel ? "Rain and glass chimes overlap." : t + " and " + o + " overlap.";
}
function ae(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.points ?? 1 : 0), 0);
}
function Wn(e) {
  const t = new Map(e.cards.map((h) => [h.id, h])), o = new Map(e.lanes.map((h, m) => [h.id, m])), n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set();
  function u(h) {
    if (!n.has(h.id)) {
      if (s.has(h.id)) throw new Error("Release dependencies must be acyclic.");
      s.add(h.id);
      for (const m of h.dependsOn ?? []) {
        const g = t.get(m);
        if (!g) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(g.laneId) > o.get(h.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        u(g);
      }
      s.delete(h.id), n.add(h.id);
    }
  }
  for (const h of e.cards) u(h);
  for (const h of e.lanes) {
    if (h.station) throw new Error("Release windows cannot also be map stations.");
    if (ae(e, h.id) > (h.capacity ?? 1 / 0)) throw new Error(`Release "${h.label}" exceeds its point budget.`);
  }
}
function Te(e, t, o) {
  if (o === t.laneId) return e;
  const n = new Map(e.lanes.map((b, I) => [b.id, I])), s = n.get(o);
  if (s === void 0) return null;
  const u = s < n.get(t.laneId), h = /* @__PURE__ */ new Set([t.id]), m = [t];
  for (; m.length; ) {
    const b = m.pop();
    for (const I of e.cards) {
      if (h.has(I.id)) continue;
      const y = n.get(I.laneId);
      (u ? y > s && b.dependsOn?.includes(I.id) : y < s && I.dependsOn?.includes(b.id)) && (h.add(I.id), m.push(I));
    }
  }
  if (e.cards.filter((b) => h.has(b.id)).some((b) => b.allowedLaneIds && !b.allowedLaneIds.includes(o))) return null;
  const k = { ...e, cards: e.cards.map((b) => h.has(b.id) ? { ...b, laneId: o } : b) }, v = e.lanes[s].capacity;
  return v !== void 0 && ae(k, o) > v ? null : k;
}
const ct = {
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
}, we = Object.freeze({
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  fontColor: "#000000",
  borderColor: "#cccccc",
  borderWidth: 1,
  backgroundColor: "#f0f0f0"
}), ft = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ut(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.kind !== "moon-gallery" || t.version !== 1 || !Array.isArray(t.panels) || t.panels.length !== 3 || !Array.isArray(t.hung)) return null;
  const o = [];
  for (const u of t.panels) {
    if (!u || typeof u.id != "string" || !/^[a-z][\w-]{0,31}$/.test(u.id) || typeof u.label != "string" || !u.label.trim() || u.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(u.artwork) || !(u.after === null || typeof u.after == "string")) return null;
    o.push({ id: u.id, label: u.label.trim(), artwork: u.artwork, after: u.after });
  }
  const n = new Map(o.map((u) => [u.id, u])), s = [...new Set(t.hung)];
  if (n.size !== o.length || s.length !== t.hung.length || s.some((u) => !n.has(u))) return null;
  for (const u of o) {
    const h = /* @__PURE__ */ new Set([u.id]);
    let m = u.after;
    for (; m !== null; ) {
      if (h.has(m) || !n.has(m) || s.includes(u.id) && !s.includes(m)) return null;
      h.add(m), m = n.get(m).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: s };
}
function On(e, t) {
  const o = e.panels.find((n) => n.id === t);
  return !!o && !e.hung.includes(t) && (o.after === null || e.hung.includes(o.after));
}
function ht(e, t) {
  return On(e, t) ? { ...e, hung: [...e.hung, t] } : e;
}
const mn = ["firstPrint", "secondPrint", "thirdPrint"], wn = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function pt(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const t = e;
  if (t.kind !== void 0 && t.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (t.version !== 1) throw new Error("Unknown darkroom version.");
  if (t.route !== null && t.route !== "start" && t.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...wn, route: t.route };
  for (const n of mn) {
    const s = t[n];
    if (typeof s != "string" || !s.trim() || s.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[n] = s.trim();
  }
  return o;
}
function mt(e = new URLSearchParams()) {
  const t = { ...wn };
  for (const n of mn) {
    const s = e.get(n)?.trim();
    s && s.length <= 48 && (t[n] = s);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (t.route = o), t;
}
function wt(e) {
  const t = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + t;
}
function zn(e) {
  const t = { ...e };
  return e.xPos !== void 0 && t.x === void 0 && (t.x = e.xPos, delete t.xPos), e.yPos !== void 0 && t.y === void 0 && (t.y = e.yPos, delete t.yPos), e.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = e.foregroundColor, delete t.foregroundColor), e.shapeHint !== void 0 && t.shape === void 0 && (t.shape = Bn(e.shapeHint), delete t.shapeHint), e.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = e.svgString, delete t.svgString), e.blnStraight !== void 0 && (t.isStraightLine = e.blnStraight, delete t.blnStraight), Hn(t), t;
}
function Fn(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.width !== void 0 || t.height !== void 0;
}
function Hn(e) {
  return e && Fn(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function sn(e) {
  const t = { ...e };
  return t.xPos = e.x, t.yPos = e.y, t.foregroundColor = e.fontColor, e.shape && (t.shapeHint = e.shape), e.svgContent && (t.svgString = e.svgContent), t;
}
function Dn(e) {
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
function Bn(e) {
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
function Be() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const an = "#1f7a5c", ln = "#5b9a85", Ge = "#c2410c", Gn = { canMove: !1, canSelect: !1 };
function Un(e) {
  const t = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return t ? { kind: t[1], key: t[2] } : null;
}
function gt(e, t, o = {}) {
  let n = D(t), s = null, u = !!o.readOnly, h = !1;
  const m = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  let I = null, y = null, C = null;
  const M = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
  let N = null, O = Promise.resolve(), B = null, z = o.layout?.lanesPerRow === void 0 ? {} : { lanesPerRow: o.layout.lanesPerRow };
  const $ = { ...o.style };
  let R = /* @__PURE__ */ new Map(), q = null, G = !1;
  X(n, { layout: z });
  const A = o.origin ? { x: o.origin.x, y: o.origin.y } : qn(e), j = (r) => b.get(r) ?? r, W = (r) => Un(j(r));
  function K(r) {
    const a = v.get(r);
    if (a) return a;
    if (m.has(r) && !b.has(r) || !e.nodes.one?.(r)) return r;
    const l = Sn(r, (c) => !!e.nodes.one?.(c) || b.has(c));
    return v.set(r, l), b.set(l, r), console.warn(`WORKSHOP: the slate already has a note named "${r}". It stays the slate's own; the workshop draws its note as "${l}".`), l;
  }
  const Y = {
    governs(r) {
      if (m.get(r.id) !== r) return null;
      const a = W(r.id)?.kind;
      return a === "card" ? { canMove: !u, canEditText: !u && !s && n.kind !== "release-plan" } : a === "lane" ? { canMove: !1, canEditText: !u && !s } : Gn;
    },
    onStart(r, a) {
      const l = W(r.id).key;
      if (u || s || !n.cards.some((i) => i.id === l)) return !1;
      U(), le();
      const c = { x: a.x - (r.options.x ?? 0), y: a.y - (r.options.y ?? 0) };
      let p = null;
      try {
        p = o.chooseCandidate?.(n, l, c) ?? null;
      } catch (i) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", i);
      }
      return I = { cardId: l, evaluate: p, outcome: { kind: "home" } }, T(n, { skip: l }), !0;
    },
    onMove(r, a) {
      if (!I) return;
      const l = pe(I.cardId, a, I.evaluate);
      if (jn(l, I.outcome)) return;
      I.outcome = l;
      const c = l.kind === "candidate" ? l.next : null;
      T(c ?? n, { skip: I.cardId }), L(o.onPreview, c);
    },
    onEnd(r, a) {
      if (!I) return { accept: !1 };
      const { cardId: l, evaluate: c } = I, p = pe(l, a, c), i = n.cards.find((d) => d.id === l);
      if (I = null, L(o.onPreview, null), p.kind === "candidate") {
        n = p.next, T(n, { skip: l });
        const d = n.lanes.find((w) => w.id === p.laneId);
        e.announce?.(`${i.label} moved to ${d.label}. ${ne(n, d.id)}.`), L(o.onChange, n, { cardId: l, laneId: p.laneId });
        const f = Ln(n, j(r.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (p.kind === "refused")
        Mn(i.label, { cardId: l, laneId: p.laneId, reason: p.reason });
      else if (p.kind === "outside" && Pe(n) && !Oe()) {
        const d = Ae(n, l);
        if (!d)
          return De(l, { x: r.options.x ?? 0, y: r.options.y ?? 0 }), { accept: !0 };
        T(n, { skip: l }), e.announce?.(d), L(o.onRefuse, { cardId: l, laneId: null, reason: d });
      } else
        T(n, { skip: l }), p.kind === "outside" && (e.announce?.(`${i.label} was not dropped on a lane. It stays where it was.`), L(o.onRefuse, { cardId: l, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(r) {
      const a = I && n.cards.find((l) => l.id === I.cardId);
      I = null, L(o.onPreview, null), T(n, { skip: W(r.id)?.key }), a && e.announce?.(`Move cancelled. ${a.label} stays where it was.`);
    },
    onTextCommit(r, a, l) {
      const c = W(r.id);
      if (!c || u || s) return !1;
      const p = a.replace(/\s+/g, " ").trim(), i = c.kind === "lane" ? { laneId: c.key, label: p } : { cardId: c.key, label: p };
      let d;
      try {
        d = D(c.kind === "lane" ? { ...n, lanes: n.lanes.map((f) => f.id === c.key ? { ...f, label: p } : f) } : { ...n, cards: n.cards.map((f) => f.id === c.key ? { ...f, label: p } : f) });
      } catch (f) {
        const w = f instanceof Error ? f.message : "That name is not allowed.";
        return e.announce?.(`${l} keeps its name. ${w}`), L(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: i, reason: w }), !1;
      }
      return p === l ? !1 : (n = d, T(n), e.announce?.(`${l} renamed to ${p}.`), L(o.onChange, n, { rename: i }), p);
    },
    onKeyDown(r, a) {
      const l = W(r.id);
      if (l?.kind !== "card" || u || s || I || a.ctrlKey || a.metaKey || a.altKey) return !1;
      const c = n.cards.find((p) => p.id === l.key);
      if (!c) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), Qe(c.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && Pn())
        return a.preventDefault(), Qe(c.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (y?.cardId !== c.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: p, next: i, spot: d } = y;
        if (y = null, p === null)
          return L(o.onPreview, null), De(c.id, d), !0;
        n = i, T(n), re(p), L(o.onPreview, null);
        const f = n.lanes.find((w) => w.id === p);
        return e.announce?.(`${c.label} moved to ${f.label}. ${ne(n, p)}.`), L(o.onChange, n, { cardId: c.id, laneId: p }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), le(), e.announce?.(`Move cancelled. ${c.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const r = (e.getSelectedNodes?.() ?? []).filter((a) => m.get(a.id) === a).map((a) => a.id);
      G = r.length === 1, m.clear(), g.clear(), k.clear(), v.clear(), b.clear(), I = null, y = null, T(s ?? n, { animate: !1 }), r.length === 1 && (O = O.then(() => {
        G = !1;
        const a = m.get(r[0]);
        if (!h && a && !(e.getSelectedNodes?.() ?? []).length) {
          const l = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(l) : l();
        }
        We();
      }));
    }
  };
  Y.onFreeMove = (r, a) => {
    if (!Ie() || r.options?.isComment) return ze();
    const l = xe(a), c = Ce(r), p = n.lanes.filter((d) => !me(r) && ce(n, d.id, c) === null).map((d) => d.id), i = l ? me(r) ?? ce(n, l, c) : null;
    C && C.noteId === r.id && C.laneId === l && C.refusal === i || (C = { noteId: r.id, laneId: l, refusal: i, open: p }, ie());
  }, Y.onFreeDrop = (r, a, l) => {
    if (ze(), !Ie() || r.options?.isComment) return;
    const c = xe(a);
    if (!c) return;
    const p = Ce(r), i = n.lanes.find((f) => f.id === c), d = me(r) ?? ce(n, c, p);
    return d ? (U(!1), N = { laneId: c, reason: d, timer: setTimeout(() => U(), 1500) }, ie(), e.announce?.(`${Fe(p.label)} can't go in ${i.label}. ${d}`), L(o.onRefuse, { noteId: r.id, laneId: c, reason: d }), "refused") : (He([{ node: r, offer: p, from: l }], c), "taken");
  }, Y.onFreeGroupDrop = (r, a, l) => {
    if (ze(), !Ie() || r.some((f) => f.options?.isComment)) return;
    const c = xe(a);
    if (!c) return;
    const p = n.lanes.find((f) => f.id === c), i = r.map((f) => ({ node: f, offer: Ce(f) })), d = En(i, c);
    if (d) {
      U(!1), N = { laneId: c, reason: d, timer: setTimeout(() => U(), 1500) }, ie(), e.announce?.(`${Ye(i.map((f) => Fe(f.offer.label)))} can't go in ${p.label}. ${d}`);
      for (const { node: f } of i) L(o.onRefuse, { noteId: f.id, laneId: c, reason: d });
      return "refused";
    }
    return He(i.map((f, w) => ({ ...f, from: l?.[w] })), c), "taken";
  }, Y.onFreeTextCommit = (r) => {
    if (!Ie() || r.options?.isComment || !e.nodes.one(r.id)) return;
    const a = r.options ?? {}, l = xe({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!l) return;
    const c = Ce(r), p = n.lanes.find((S) => S.id === l), i = me(r) ?? ce(n, l, c);
    if (!i) {
      He([{ node: r, offer: c }], l);
      return;
    }
    U(!1), N = { laneId: l, reason: i, timer: setTimeout(() => U(), 1500) }, ie(), e.announce?.(`${Fe(c.label)} can't go in ${p.label}. ${i} It is beside the board.`), L(o.onRefuse, { noteId: r.id, laneId: l, reason: i });
    const { width: d } = X(n, { layout: z }), f = Math.round(A.x + d + 32), w = Math.round(a.y ?? A.y);
    r.position(f, w, () => e.updateSelectionResizeRotate?.(), void 0, Be() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [sn({ ...r.options, x: f, y: w })] });
  }, Y.undoState = () => ({ cards: n.cards.map((r) => ({ ...r })), pairs: [...M] }), Y.onUndoRestore = (r, a) => {
    if (h) return;
    const l = new Map((r?.cards ?? []).map((i) => [i.id, i])), c = new Map(r?.pairs ?? []), p = (i) => M.get(i) ?? c.get(i) ?? i;
    for (const i of a.added) {
      const d = p(i), f = n.cards.find((w) => w.id === d);
      f && (n = D({ ...n, cards: n.cards.filter((w) => w !== f) }), T(n), dn(L(o.onChange, n, { cardId: d, cardToNote: { noteId: i } })));
    }
    for (const i of a.removed) {
      const d = p(i), f = l.get(d);
      if (!f || n.cards.some((P) => P.id === d)) continue;
      const w = { id: d, label: f.label, ...f.look ? { look: f.look } : {}, ...f.asNote ? { asNote: f.asNote } : {} }, S = [f.laneId, ...n.lanes.map((P) => P.id)].find((P) => ge(n, P, w));
      if (!S) {
        e.announce?.(`${f.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      n = Nn(ge(n, S, w), d, r?.cards ?? []), d !== i && M.set(i, d), T(n);
      const x = n.cards.findIndex((P) => P.id === d), E = n.cards.slice(x + 1).find((P) => P.laneId === S)?.id;
      dn(L(o.onChange, n, { cardId: d, laneId: S, noteToCard: {
        noteId: i,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...E ? { before: E } : {}
      } }));
    }
  };
  const ue = e.setDragPolicy(Y), he = o.onSelect && e.onSelectionChange?.(() => We()), _ = () => {
    y && le();
  };
  e.element?.addEventListener?.("pointerdown", _, !0), T(n, { animate: !1 });
  function pe(r, a, l) {
    const c = n.cards.find((x) => x.id === r);
    if (!c) return { kind: "outside" };
    const p = n.lanes.map((x) => m.get(K(Z.column(x.id)))).filter(Boolean), i = e.hitTestNodes(a, p, { padding: 6 }), d = i ? W(i.id).key : null;
    if (!d) return { kind: "outside" };
    if (d === c.laneId) return { kind: "home" };
    const f = ke(n, r, d);
    if (!f) return { kind: "refused", laneId: d, reason: Ue(n, r, d) ?? "That move is not available." };
    if (!l) return { kind: "candidate", laneId: d, next: f };
    let w = null;
    try {
      w = l({ x: a.x - A.x, y: a.y - A.y });
    } catch (x) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", x), { kind: "candidate", laneId: d, next: f };
    }
    const S = w?.cards.find((x) => x.id === r)?.laneId;
    return !w || !S || S === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: S, next: w };
  }
  function Pn() {
    return new Set(X(n, { layout: z }).places.map((r) => r.row)).size > 1;
  }
  function Qe(r, a, l = !1) {
    const c = n.cards.find((x) => x.id === r), p = cn(n, r), i = y?.cardId === r && y.laneId === null ? y.side : void 0;
    if (i !== void 0) {
      if (l || a === i) return;
      const x = i > 0 ? n.lanes[n.lanes.length - 1] : n.lanes[0];
      if (le(), x.id === c.laneId) {
        re(x.id, s ?? n), e.announce?.(`${c.label} is back in ${x.label}.`);
        return;
      }
      if (p.includes(x)) {
        const P = ke(n, r, x.id);
        y = { cardId: r, laneId: x.id, next: P }, T(P), re(x.id, P), L(o.onPreview, P), e.announce?.(`${c.label} to ${x.label}: ${ne(P, x.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const E = Ue(n, r, x.id) ?? "That move is not available.";
      U(), N = { laneId: x.id, reason: E, timer: setTimeout(() => U(), 1500) }, T(s ?? n), re(x.id, s ?? n), e.announce?.(`${c.label} can't move to ${x.label}. ${E}`), L(o.onRefuse, { cardId: r, laneId: x.id, reason: E });
      return;
    }
    const d = y?.cardId === r ? y.laneId : c.laneId;
    let f;
    if (l) {
      const { places: x } = X(n, { layout: z }), E = x.find((P) => P.laneId === d);
      f = x.filter((P) => P.column === E.column && (P.row - E.row) * a > 0).sort((P, J) => (P.row - J.row) * a).map((P) => n.lanes.find((J) => J.id === P.laneId));
    } else {
      const x = n.lanes.findIndex((E) => E.id === d);
      f = a > 0 ? n.lanes.slice(x + 1) : n.lanes.slice(0, x).reverse();
    }
    const w = f.find((x) => p.includes(x));
    if (U(), !w) {
      const x = f[0];
      if (!x) {
        if (!l && Pe(n)) {
          const P = Ae(n, r);
          if (P) {
            e.announce?.(P), L(o.onRefuse, { cardId: r, laneId: null, reason: P });
            return;
          }
          An(c, a);
          return;
        }
        e.announce?.(`${c.label} has no lane to move to on that side.`);
        return;
      }
      const E = Ue(n, r, x.id) ?? "That move is not available.";
      N = { laneId: x.id, reason: E, timer: setTimeout(() => U(), 1500) }, T(y?.next ?? s ?? n), re(x.id, y?.next ?? s ?? n), e.announce?.(`${c.label} can't move to ${x.label}. ${E}`), L(o.onRefuse, { cardId: r, laneId: x.id, reason: E });
      return;
    }
    if (w.id === c.laneId) {
      le(), re(w.id, s ?? n), e.announce?.(`${c.label} is back in ${w.label}.`);
      return;
    }
    const S = ke(n, r, w.id);
    y = { cardId: r, laneId: w.id, next: S }, T(S), re(w.id, S), L(o.onPreview, S), e.announce?.(`${c.label} to ${w.label}: ${ne(S, w.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function re(r, a = n) {
    const l = X(a, { layout: z, rows: nn() }).places.find((w) => w.laneId === r), c = e.canvas?.viewbox?.();
    if (!l || !c || !(c.width > 0) || !(c.height > 0)) return;
    const p = 16, i = (w, S, x, E) => S + p * 2 >= E || w - p < x ? w - p - x : w + S + p > x + E ? w + S + p - (x + E) : 0, d = i(A.x + l.x, l.width, c.x, c.width), f = i(A.y + l.y, l.height, c.y, c.height);
    (d || f) && e.panBy?.({ x: d, y: f });
  }
  function We() {
    if (!o.onSelect || G) return;
    const r = h ? [] : e.getSelectedNodes?.() ?? [], a = r.length === 1 && m.get(r[0].id) === r[0] ? W(r[0].id) : null, l = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = l ? JSON.stringify(l) : null;
    c !== q && (q = c, L(o.onSelect, l));
  }
  function le() {
    y && (y = null, L(o.onPreview, null), T(s ?? n));
  }
  function An(r, a) {
    const { width: l } = X(n, { layout: z }), c = m.get(K(Z.card(r.id)))?.options, p = c?.width ?? 228, i = { x: a > 0 ? A.x + l + 32 : A.x - p - 32, y: c?.y ?? A.y }, d = fn(n, r.id);
    y = { cardId: r.id, laneId: null, side: a, spot: i, next: n }, T(n), L(o.onPreview, d), e.announce?.(`${r.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Oe() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ie() {
    return !h && !u && !s && !I && !Oe() && Pe(n);
  }
  function ze() {
    C && (C = null, h || ie());
  }
  function xe(r) {
    const a = n.lanes.map((c) => m.get(K(Z.column(c.id)))).filter(Boolean), l = e.hitTestNodes(r, a, { padding: 6 });
    return l ? W(l.id)?.key ?? null : null;
  }
  function Ce(r) {
    const a = r.options ?? {}, l = Vn({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), p = c.replace(/\s+/g, " ").trim(), i = {};
    c.trim() !== p && c.length <= 400 && (i.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (i.shape = a.shape);
    for (const d of ["width", "height"]) Number.isFinite(a[d]) && a[d] >= 10 && a[d] <= 4e3 && (i[d] = Math.round(a[d]));
    return { id: r.id, label: p, ...l ? { look: l } : {}, ...Object.keys(i).length ? { asNote: i } : {} };
  }
  function Ye(r) {
    return r.length > 1 ? r.slice(0, -1).join(", ") + " and " + r.at(-1) : r[0] ?? "";
  }
  function En(r, a) {
    for (const { node: i } of r) {
      const d = me(i);
      if (d) return d;
    }
    const l = n.lanes.find((i) => i.id === a), c = n.cards.filter((i) => i.laneId === a).length;
    if (l.capacity !== void 0 && c + r.length > l.capacity) {
      const i = l.capacity - c;
      return i > 0 ? `It has room for ${i} more ${i === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${l.capacity} ${l.capacity === 1 ? "card" : "cards"}.`;
    }
    let p = n;
    for (const { offer: i } of r) {
      const d = ce(p, a, i);
      if (d) return d;
      p = ge(p, a, i);
    }
    return null;
  }
  function me(r) {
    return (r.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((l) => l !== r && (l.relationships?.associations ?? []).some((c) => c.child === r || c.childId === r.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : r.options?.image ? "A note with a picture stays a note." : r.options?.link?.show && r.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const Fe = (r) => r || "This note";
  function He(r, a) {
    let l = n;
    const c = r.map(({ node: d, offer: f, from: w }) => {
      l = ge(l, a, f);
      const S = { ...d.options ?? {}, ...w ? { x: w.x, y: w.y } : {} };
      return { node: d, card: l.cards[l.cards.length - 1], kept: S };
    });
    e.beginHostStep?.(), n = l;
    let p = n;
    for (const { node: d, card: f } of c)
      f.id !== d.id && M.set(d.id, f.id), F.set(K(Z.card(f.id)), { x: d.options?.x ?? 0, y: d.options?.y ?? 0 }), Se(() => e.removeNode(d.id));
    e.endHostStep?.(), T(n), Tn(K(Z.card(c[0].card.id)));
    const i = n.lanes.find((d) => d.id === a);
    e.announce?.(c.length === 1 ? `${c[0].card.label} is now a card in ${i.label}. ${ne(n, a)}.` : `${Ye(c.map(({ card: d }) => d.label))} are now cards in ${i.label}. ${ne(n, a)}.`);
    for (const { node: d, card: f, kept: w } of c) {
      const S = { cardId: f.id, laneId: a, noteToCard: {
        noteId: d.id,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {}
      } }, x = () => {
        n !== p || !n.cards.some((E) => E.id === f.id) || (n = D({ ...n, cards: n.cards.filter((E) => E.id !== f.id) }), p = n, T(n));
      };
      Xe(L(o.onChange, n, S), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: d.id, isComment: !1 } }]);
      }, () => {
        if (!h) {
          if (x(), !e.nodes.one(w.id)) {
            e.beginHostStep?.();
            const E = Se(() => e.addNode({ ...w }));
            E && (E.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${f.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        h || (x(), e.announce?.(`Someone else put ${f.label} on the board first.`));
      });
    }
  }
  function De(r, a) {
    const l = n.cards.find((H) => H.id === r), c = n.lanes.find((H) => H.id === l.laneId), p = n.cards.findIndex((H) => H.id === r), i = n.cards.slice(p + 1).find((H) => H.laneId === l.laneId)?.id, d = fn(n, r), f = g.get(K(Z.card(r))) ?? {}, w = e.nodes.one(r) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : r, S = ($.cornerRadius ?? 0) > 0, x = l.asNote, E = x?.text !== void 0 && x.text.replace(/\s+/g, " ").trim() === l.label ? x.text : l.label, P = {
      id: w,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: x?.width ?? f.width ?? 228,
      height: x?.height ?? f.height ?? 76,
      text: E,
      shape: x?.shape ?? (S ? "roundedrectangle" : "rectangle"),
      backgroundColor: l.look?.backgroundColor ?? f.backgroundColor,
      fontColor: l.look?.textColor ?? f.foregroundColor,
      fontSize: l.look?.fontSize ?? f.fontSize,
      borderColor: l.look?.borderColor ?? f.borderColor,
      borderWidth: l.look?.borderWidth ?? f.borderWidth,
      ...l.look?.fontFamily ?? f.fontFamily ? { fontFamily: l.look?.fontFamily ?? f.fontFamily } : {}
    };
    for (const H of Object.keys(P)) P[H] === void 0 && delete P[H];
    e.beginHostStep?.(), n = d;
    const J = n;
    w !== r ? M.set(w, r) : M.delete(w);
    const V = Se(() => e.addNode(P));
    V && (V.announcedByCreator = !0), e.endHostStep?.(), T(n), V?.ready?.then?.(() => {
      if (h || e.nodes.one(w) !== V) return;
      const H = () => e.selectNodes?.([V]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(H) : H();
    }), e.announce?.(`${l.label} is now a note on the canvas. ${c.label}: ${ne(n, c.id)}.`);
    const on = () => {
      e.nodes.one(w) === V && (e.beginHostStep?.(), Se(() => e.removeNode(w)), e.endHostStep?.());
    };
    Xe(L(o.onChange, n, { cardId: r, cardToNote: { noteId: w } }), () => {
      V && e.nodes.one(w) === V && e.sendHeld?.([{ type: "onNodeAdded", data: { id: w, nodeOptions: sn(V.options) } }]);
    }, () => {
      if (!h) {
        if (on(), n === J && !n.cards.some((H) => H.id === r)) {
          const H = { id: r, label: l.label, ...l.look ? { look: l.look } : {}, ...l.asNote ? { asNote: l.asNote } : {} }, rn = ge(n, l.laneId, H, i);
          rn && (n = rn, T(n));
        }
        e.announce?.(`${l.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      h || (on(), e.announce?.(`Someone else took ${l.label} off the lanes first.`));
    });
  }
  function Nn(r, a, l) {
    const c = l.map((w) => w.id), p = c.indexOf(a), i = r.cards.find((w) => w.id === a);
    if (p < 0 || !i) return r;
    const d = r.cards.filter((w) => w !== i), f = d.findIndex((w) => c.indexOf(w.id) > p);
    return d.splice(f < 0 ? d.length : f, 0, i), D({ ...r, cards: d });
  }
  function Tn(r) {
    O = O.then(() => {
      const a = m.get(r);
      if (h || !a) return;
      const l = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(l) : l();
    });
  }
  function Se(r) {
    return typeof e.onlyHere == "function" ? e.onlyHere(r) : r();
  }
  function Xe(r, a, l, c) {
    if (!r || typeof r.then != "function") return a();
    const p = r.then((i) => {
      i === !0 ? a() : i === !1 ? l() : i === "taken" && c();
    }, () => l());
    e.holdUntil?.(p);
  }
  function Mn(r, a) {
    U(!1), N = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => U(), 1500) }, T(n, { skip: a.cardId });
    const l = n.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${r} can't move to ${l?.label ?? "that lane"}. ${a.reason}`), L(o.onRefuse, a);
  }
  function U(r = !0) {
    N && (clearTimeout(N.timer), N = null, r && !h && ie());
  }
  function ie() {
    T(I && I.outcome.kind === "candidate" ? I.outcome.next : y?.next ?? s ?? n, { skip: I?.cardId });
  }
  function en(r) {
    const a = pn(r, { native: !0, origin: A, rows: nn(), layout: z, style: $ }).nodes, l = new Map(a.map((i) => [i.options.id, i.options])), c = (i, d, f, w = !1) => {
      const S = l.get(Z.column(i));
      S && (S.borderColor = d, S.borderWidth = f, delete S.borderStyle);
      const x = w && l.get(Z.lane(i));
      x && (x.borderColor = d, x.borderWidth = f);
    }, p = I?.cardId ?? y?.cardId;
    if (R = /* @__PURE__ */ new Map(), p) {
      const i = n.cards.find((f) => f.id === p)?.laneId;
      for (const f of cn(n, p)) f.id !== i && (c(f.id, ln, 2), R.set(f.id, "open"));
      const d = I ? I.outcome : y?.laneId ? { kind: "candidate", laneId: y.laneId } : null;
      d?.kind === "candidate" && (c(d.laneId, an, 3, !0), R.set(d.laneId, "over")), d?.kind === "refused" && (c(d.laneId, Ge, 3), R.set(d.laneId, "refused"));
    }
    if (C && !p) {
      for (const i of C.open) i !== C.laneId && (c(i, ln, 2), R.set(i, "open"));
      C.laneId && !C.refusal && (c(C.laneId, an, 3, !0), R.set(C.laneId, "over")), C.laneId && C.refusal && (c(C.laneId, Ge, 3), R.set(C.laneId, "refused"));
    }
    if (y?.laneId === null && y.spot) {
      const i = l.get(Z.card(y.cardId));
      i && (i.xPos = y.spot.x, i.yPos = y.spot.y);
    }
    if (N) {
      R.set(N.laneId, "refused"), c(N.laneId, Ge, 3, !0);
      const i = l.get(Z.caption(N.laneId));
      i && (i.text = N.reason, i.foregroundColor = "#b42318");
    }
    for (const i of a) {
      i.options.id = K(i.options.id);
      for (const d of i.relationships.associations)
        d.parentId = K(d.parentId), d.childId = K(d.childId);
    }
    return a;
  }
  function nn() {
    return I || y ? n.lanes.map((r) => n.cards.filter((a) => a.laneId === r.id).length) : void 0;
  }
  function T(r, a = {}) {
    if (h) return;
    B = { model: r, skip: a.skip, animate: a.animate !== !1 };
    const l = en(r), c = [];
    for (const { options: i } of l) {
      const d = i.id;
      if (m.has(d)) continue;
      const f = F.get(d);
      F.delete(d);
      const w = f && a.animate !== !1 && !Be() ? { ...i, xPos: f.x, yPos: f.y } : i, S = e.nodes.add(zn(w));
      m.set(d, S), g.set(d, { ...w }), S.ready && c.push(S.ready.then(() => {
        if (m.get(d) !== S) return;
        S.applyGovernance?.(), W(d)?.kind === "column" && S.toBack?.(!1);
        const x = tn(B?.model ?? r, d);
        x && S.svgGroup?.node?.setAttribute("aria-label", x);
      }).catch(() => {
      }));
    }
    const p = B;
    O = Promise.all([O, ...c]).then(() => {
      h || B !== p || Rn(en(p.model), p);
    }).catch((i) => console.warn("WORKSHOP: could not draw the workshop", i));
  }
  function Rn(r, a) {
    const l = new Set(r.map((p) => p.options.id)), c = e.getSelectedNodes?.() ?? [];
    e.withPolicyAuthority(() => {
      for (const [i, d] of [...m]) {
        if (l.has(i)) continue;
        for (const [w, S] of [...k])
          S.parentId !== i && S.childId !== i || (S.parent.relationships?.removeAssociation(w), k.delete(w));
        e.deselectNode?.(d), d.editor?.cancelInline?.(), m.delete(i), g.delete(i);
        const f = b.get(i);
        f && (b.delete(i), v.delete(f)), e.nodes.remove(i);
      }
      for (const { options: i } of r) {
        const d = i.id, f = m.get(d);
        if (!f?.svgGroup) continue;
        const w = g.get(d) ?? {}, S = f.editor?.isInlineEditing?.();
        (i.fontSize !== w.fontSize || i.foregroundColor !== w.foregroundColor) && (f.options.fontSize = i.fontSize, f.options.fontColor = i.foregroundColor, f.applyTextStyle?.()), i.text !== w.text && !S && f.setText?.(i.text), (i.width !== w.width || i.height !== w.height) && (i.vectorPath ? (f.options.width = i.width, f.options.height = i.height, f.setShape?.(f.options.shape, i.vectorPath), W(d)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(i.width, i.height)), i.backgroundColor !== w.backgroundColor && f.setColors?.(i.backgroundColor), (i.borderColor !== w.borderColor || i.borderWidth !== w.borderWidth || i.borderStyle !== w.borderStyle) && (f.options.borderColor = i.borderColor, f.options.borderWidth = i.borderWidth, f.options.borderStyle = i.borderStyle, f.applyBorder?.());
        const x = i.xPos !== w.xPos || i.yPos !== w.yPos || Math.abs((f.options.x ?? 0) - i.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - i.yPos) > 0.5;
        if (d !== (a.skip && K(Z.card(a.skip))) && x) {
          const J = a.animate && !Be() ? 180 : 0, V = c.includes(f) ? () => {
            !h && m.get(d) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          V && J && c.length === 1 && f.resizeRotate?.disable?.(), f.position(i.xPos, i.yPos, V, void 0, J);
        }
        const E = tn(a.model, d);
        E && f.svgGroup.node.getAttribute("aria-label") !== E && f.svgGroup.node.setAttribute("aria-label", E);
        const P = W(d);
        if (P?.kind === "column") {
          const J = R.get(P.key);
          J ? f.svgGroup.node.setAttribute("data-workshop-drop", J) : f.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        g.set(d, { ...i });
      }
      const p = /* @__PURE__ */ new Map();
      for (const i of r) for (const d of i.relationships.associations) p.set(d.id, d);
      for (const [i, d] of [...k])
        p.has(i) && m.get(d.parentId) === d.parent && m.get(d.childId) === d.child || (d.parent.relationships?.removeAssociation(i), k.delete(i));
      for (const [i, d] of p) {
        if (k.has(i)) continue;
        const f = m.get(d.parentId), w = m.get(d.childId);
        !f?.relationships || !w?.svgGroup || (f.relationships.addAssociation(w, Dn(d)), k.set(i, { parentId: d.parentId, childId: d.childId, parent: f, child: w }));
      }
    }), e.notifyNodeChanged?.();
  }
  function tn(r, a) {
    const l = W(a);
    if (l?.kind === "lane") {
      const c = r.lanes.find((p) => p.id === l.key);
      return c ? `${c.label}, ${ne(r, c.id)}` : null;
    }
    if (l?.kind === "card") {
      const c = r.cards.find((i) => i.id === l.key), p = c && r.lanes.find((i) => i.id === c.laneId);
      return c && p ? `${c.label}, in ${p.label}` : null;
    }
    return null;
  }
  function Ln(r, a) {
    const l = pn(r, { native: !0, origin: A, layout: z, style: $ }).nodes.find((c) => c.options.id === a)?.options;
    return l ? { x: l.xPos, y: l.yPos } : null;
  }
  function de() {
    I && e.cancelGovernedDrag?.("host"), I = null, y && (y = null, L(o.onPreview, null)), U(!1);
  }
  return {
    toCanvas(r) {
      if (h || u || Oe()) return "This workshop is view-only here.";
      if (!n.cards.some((p) => p.id === r)) return "That card is no longer on the board.";
      const a = Ae(n, r);
      if (a) return a;
      y && le(), s && (de(), s = null, T(n), e.refreshGovernance?.());
      const { width: l } = X(n, { layout: z }), c = m.get(K(Z.card(r)))?.options;
      return De(r, { x: A.x + l + 32, y: c?.y ?? A.y }), null;
    },
    get value() {
      return n;
    },
    get origin() {
      return { ...A };
    },
    get layout() {
      return { ...z };
    },
    get bounds() {
      const { width: r, height: a } = X(n, { layout: z });
      return { x: A.x, y: A.y, width: r, height: a };
    },
    setLayout(r) {
      if (h) throw new Error("This workshop has been detached.");
      const a = r?.lanesPerRow === void 0 ? {} : { lanesPerRow: r.lanesPerRow };
      X(n, { layout: a }), a.lanesPerRow !== z.lanesPerRow && (de(), z = a, T(s ?? n));
    },
    whenDrawn: () => O,
    update(r) {
      if (h) throw new Error("This workshop has been detached.");
      const a = D(r);
      de(), n = a, T(s ?? n);
    },
    preview(r) {
      if (h) throw new Error("This workshop has been detached.");
      const a = r ? D(r) : null;
      de(), s = a, T(s ?? n), e.refreshGovernance?.();
    },
    refuse(r, a) {
      const l = n.lanes.find((c) => c.id === r);
      h || !l || (U(!1), N = { laneId: r, reason: a, timer: setTimeout(() => U(), 1500) }, ie(), e.announce?.(`${l.label}: ${a}`));
    },
    setReadOnly(r) {
      h || u === !!r || (de(), u = !!r, T(s ?? n), e.refreshGovernance?.());
    },
    destroy() {
      h || (de(), h = !0, e.element?.removeEventListener?.("pointerdown", _, !0), he?.(), e.withPolicyAuthority(() => {
        for (const [r, a] of k) a.parent.relationships?.removeAssociation(r);
        for (const [r, a] of m)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(r) === a && e.nodes.remove(r);
      }), k.clear(), m.clear(), g.clear(), v.clear(), b.clear(), ue(), G = !1, We(), e.notifyNodeChanged?.());
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
function dn(e, t, o) {
  !e || typeof e.then != "function" || e.then((n) => {
  }, () => {
  });
}
function jn(e, t) {
  return e.kind === t.kind && e.laneId === t.laneId;
}
function qn(e) {
  const t = e.nodes?.allNodes ?? [];
  if (!t.length) return { x: 40, y: 40 };
  let o = -1 / 0, n = 1 / 0;
  for (const s of t)
    o = Math.max(o, (s.options.x ?? 0) + (s.options.width ?? 0)), n = Math.min(n, s.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(n) };
}
function te(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function Q(e, t = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > t)
    throw new Error(`Labels must contain 1 to ${t} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function gn(e) {
  const t = te(e);
  let o;
  try {
    o = new URL(Q(t.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: Q(t.alt, 240) };
}
function ee(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Kn = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, _n = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function be(e) {
  const t = te(e), o = {}, n = (u) => {
    if (typeof u != "string" || !Kn.test(u)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return u;
  }, s = (u, h, m) => {
    if (typeof u != "number" || !Number.isFinite(u) || u < h || u > m) throw new Error("A card size is out of range.");
    return u;
  };
  if (t.backgroundColor !== void 0 && (o.backgroundColor = n(t.backgroundColor)), t.textColor !== void 0 && (o.textColor = n(t.textColor)), t.borderColor !== void 0 && (o.borderColor = n(t.borderColor)), t.fontFamily !== void 0) {
    if (typeof t.fontFamily != "string" || !_n.test(t.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = t.fontFamily;
  }
  return t.fontSize !== void 0 && (o.fontSize = s(t.fontSize, 6, 200)), t.borderWidth !== void 0 && (o.borderWidth = s(t.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Vn(e) {
  const t = {};
  for (const [o, n] of Object.entries(e ?? {}))
    if (n !== void 0)
      try {
        be({ [o]: n }) && (t[o] = n);
      } catch {
      }
  return be(t);
}
function Ze(e) {
  const t = te(e), o = {};
  if (t.text !== void 0) {
    if (typeof t.text != "string" || t.text.length > 400 || /[<>\u0000-\u0009\u000b-\u001f]/.test(t.text)) throw new Error("A card keeps plain words only.");
    o.text = t.text;
  }
  if (t.shape !== void 0) {
    if (typeof t.shape != "string" || !/^[a-z]{1,24}$/i.test(t.shape)) throw new Error("A card keeps a shape by its name only.");
    o.shape = t.shape;
  }
  for (const n of ["width", "height"]) {
    const s = t[n];
    if (s !== void 0) {
      if (typeof s != "number" || !Number.isFinite(s) || s < 10 || s > 4e3) throw new Error("A note size is out of range.");
      o[n] = s;
    }
  }
  return Object.keys(o).length ? o : void 0;
}
function se(e, t) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${t}.`);
}
function yn({ lanes: e, presentationOrder: t }) {
  if (t === void 0) return e.slice();
  if (!Array.isArray(t) || t.length !== e.length || new Set(t).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(t, (o) => {
    const n = e.find((s) => s.id === o);
    if (!n) throw new Error("Presentation order refers to an unknown lane.");
    return n;
  });
}
function Zn(e) {
  return (e.signals ?? []).map((t) => {
    const o = e.cards.some((n) => n.id === t.cardId && n.laneId === t.laneId);
    return { ...t, present: o, text: o ? t.whenPresent : t.whenAbsent };
  });
}
const fe = (e) => "lane-" + e, oe = (e) => "card-" + e, Me = (e) => "image-" + e;
function yt(e) {
  const t = Zn(e);
  return yn(e).map((o) => {
    const n = e.cards.filter((h) => h.laneId === o.id), s = t.filter((h) => h.laneId === o.id), u = [fe(o.id)];
    return o.station?.image && u.push(Me(o.id)), { lane: o, cards: n, signals: s, nodeIds: [...u, ...n.map((h) => oe(h.id))] };
  });
}
const kn = 5, bn = 24, qe = 3;
function D(e) {
  const t = te(e);
  if (t.version !== 1) throw new Error("Unsupported workshop version.");
  if (t.kind !== void 0 && t.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = t.kind === "release-plan", n = Q(t.title, 120);
  if (!Array.isArray(t.lanes) || t.lanes.length < 2 || t.lanes.length > kn)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(t.cards) || t.cards.length > bn)
    throw new Error("A workshop supports up to 24 cards.");
  const s = t.lanes.map((g) => {
    const k = te(g), v = { id: ee(k.id), label: Q(k.label) };
    if (k.capacity !== void 0) {
      const b = o ? 576 : 24;
      if (typeof k.capacity != "number" || !Number.isInteger(k.capacity) || k.capacity < 1 || k.capacity > b)
        throw new Error(`Lane capacity must be a whole number from 1 to ${b}.`);
      v.capacity = k.capacity;
    }
    if (k.station !== void 0) {
      const b = te(k.station), I = (C) => {
        if (typeof C != "number" || !Number.isInteger(C) || C < 0 || C >= qe)
          throw new Error("Use map coordinates from 0 to 2.");
        return C;
      };
      if (!Array.isArray(b.next) || b.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const y = b.next.map(ee);
      se(y, "onward stop"), v.station = { column: I(b.column), row: I(b.row), next: y, outcome: Q(b.outcome, 160) }, b.image !== void 0 && (v.station.image = gn(b.image));
    }
    return v;
  }), u = s.map((g) => g.id);
  if (se(u, "lane ID"), (o || s.some((g) => g.station)) && !t.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (s.some((g) => g.station)) {
    if (!s.every((g) => g.station)) throw new Error("Give every station on the map a position.");
    se(s.map((g) => g.station.column + "," + g.station.row), "map position");
    for (const g of s)
      if (g.station.next.some((k) => k === g.id || !u.includes(k))) throw new Error("Connect each stop to another station on this map.");
  }
  const h = t.cards.map((g) => {
    const k = te(g), v = { id: ee(k.id), label: Q(k.label), laneId: ee(k.laneId) };
    if (!u.includes(v.laneId)) throw new Error("Card refers to an unknown lane.");
    if (k.allowedLaneIds !== void 0) {
      if (!Array.isArray(k.allowedLaneIds) || k.allowedLaneIds.length > s.length) throw new Error("Invalid allowed lanes.");
      if (v.allowedLaneIds = k.allowedLaneIds.map(ee), se(v.allowedLaneIds, "allowed lane"), !v.allowedLaneIds.includes(v.laneId) || !v.allowedLaneIds.every((b) => u.includes(b)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (k.look !== void 0) {
      const b = be(k.look);
      b && (v.look = b);
    }
    if (k.asNote !== void 0) {
      const b = Ze(k.asNote);
      b && (v.asNote = b);
    }
    if (o) {
      if (typeof k.points != "number" || !Number.isInteger(k.points) || k.points < 1 || k.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (v.points = k.points, k.dependsOn !== void 0) {
        if (!Array.isArray(k.dependsOn) || k.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        v.dependsOn = k.dependsOn.map(ee), se(v.dependsOn, "dependency");
      }
    }
    return v;
  });
  se(h.map((g) => g.id), "card ID");
  const m = { version: 1, title: n, lanes: s, cards: h };
  if (t.experience !== void 0) {
    const g = te(t.experience);
    if (g.version !== 1 || g.kind !== "customer-interviews" && g.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    m.experience = { version: 1, kind: g.kind };
  }
  if (t.signals !== void 0) {
    if (!Array.isArray(t.signals) || t.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    m.signals = t.signals.map((g) => {
      const k = te(g), v = ee(k.cardId), b = ee(k.laneId);
      if (!h.some((I) => I.id === v) || !u.includes(b))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ee(k.id),
        label: Q(k.label),
        cardId: v,
        laneId: b,
        whenPresent: Q(k.whenPresent, 160),
        whenAbsent: Q(k.whenAbsent, 160)
      };
    }), se(m.signals.map((g) => g.id), "placement outcome ID");
  }
  if (t.presentationOrder !== void 0) {
    if (!Array.isArray(t.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    m.presentationOrder = yn({ lanes: s, presentationOrder: t.presentationOrder }).map((g) => g.id);
  }
  if (o)
    return m.kind = "release-plan", Wn(m), m;
  for (const g of s)
    if (h.filter((k) => k.laneId === g.id).length > (g.capacity ?? 1 / 0))
      throw new Error(`Lane "${g.label}" exceeds its capacity.`);
  return m;
}
const vn = 65536;
function kt(e) {
  const t = JSON.stringify(D(e)), o = "#" + new URLSearchParams({ model: t }).toString();
  if (o.length > vn) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function bt(e) {
  if (e.length > vn) throw new Error("This workshop is too large to open from a link.");
  const t = new URLSearchParams(e.slice(1)), o = t.get("model");
  if (!e.startsWith("#") || !o || Array.from(t.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let n;
  try {
    n = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return D(n);
}
function Ne(e, t) {
  if (e.kind === "release-plan") return e.lanes.filter((n) => Te(e, t, n.id) !== null);
  const o = e.lanes.find((n) => n.id === t.laneId)?.station;
  return e.lanes.filter((n) => n.id === t.laneId || (!o || o.next.includes(n.id)) && (!t.allowedLaneIds || t.allowedLaneIds.includes(n.id)) && e.cards.filter((s) => s.laneId === n.id).length < (n.capacity ?? 1 / 0));
}
function Ke(e, t, o) {
  const n = e.cards.find((s) => s.id === t);
  if (n && e.kind === "release-plan") {
    const s = Te(e, n, o);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!n || !Ne(e, n).some((s) => s.id === o)) throw new Error("Move is unavailable.");
  return n.laneId === o ? e : { ...e, cards: e.cards.map((s) => s === n ? { ...n, laneId: o } : s) };
}
function ke(e, t, o) {
  const n = e.cards.find((u) => u.id === t);
  if (!n || !e.lanes.some((u) => u.id === o)) return null;
  if (n.laneId === o) return e;
  if (e.kind === "release-plan") return Te(e, n, o);
  const s = nt(e, t, o);
  return s || (o === "prototype" && ve(e) === "customer-interviews" ? null : Ne(e, n).some((u) => u.id === o) ? Ke(e, t, o) : null);
}
function cn(e, t) {
  return e.lanes.filter((o) => ke(e, t, o.id) !== null);
}
function Ue(e, t, o) {
  if (ke(e, t, o) !== null) return null;
  const n = e.cards.find((g) => g.id === t), s = e.lanes.find((g) => g.id === o);
  if (!n || !s) return "That move is not available.";
  const u = `This card can't go in ${s.label}.`;
  if (n.allowedLaneIds && !n.allowedLaneIds.includes(o)) return u;
  if (e.kind === "release-plan") {
    if (s.capacity === void 0) return u;
    const g = ae(e, o), k = { ...e, lanes: e.lanes.map((b) => b === s ? { id: s.id, label: s.label } : b) }, v = Te(k, n, o);
    return v ? `Needs ${ae(v, o) - g} points. It already holds ${g} of ${s.capacity} points.` : u;
  }
  const h = e.lanes.find((g) => g.id === n.laneId);
  if (h?.station && !h.station.next.includes(o)) return `${s.label} can't be reached from ${h.label}.`;
  const m = e.cards.filter((g) => g.laneId === o).length;
  return s.capacity !== void 0 && m >= s.capacity ? `It already holds ${m} of ${s.capacity} ${s.capacity === 1 ? "card" : "cards"}.` : u;
}
function Pe(e) {
  return !e.kind && !e.lanes.some((t) => t.station) && !ve(e);
}
const Jn = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Qn(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((n) => n.id));
  return typeof t == "string" && Jn.test(t) && !o.has(t) ? t : Le(e, "card");
}
function ce(e, t, o) {
  const n = e.lanes.find((h) => h.id === t);
  if (!n) return "That lane is no longer on the board.";
  if (e.lanes.some((h) => h.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (ve(e)) return "This workshop keeps the cards it came with.";
  const s = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!s) return "A card needs some words. Type on the note first.";
  if (s.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(s)) return "A card holds plain words only.";
  if (e.cards.length >= bn) return "A workshop holds up to 24 cards.";
  const u = e.cards.filter((h) => h.laneId === t).length;
  if (n.capacity !== void 0 && u >= n.capacity) return `It already holds ${u} of ${n.capacity} ${n.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      be(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  if (o.asNote !== void 0)
    try {
      Ze(o.asNote);
    } catch {
      return "This note's shape or words can't be kept on a card.";
    }
  return null;
}
function ge(e, t, o, n) {
  if (ce(e, t, o) !== null) return null;
  const s = o.look === void 0 ? void 0 : be(o.look), u = o.asNote === void 0 ? void 0 : Ze(o.asNote), h = {
    id: Qn(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: t,
    ...s ? { look: s } : {},
    ...u ? { asNote: u } : {}
  }, m = n === void 0 ? -1 : e.cards.findIndex((k) => k.id === n && k.laneId === t), g = m < 0 ? [...e.cards, h] : [...e.cards.slice(0, m), h, ...e.cards.slice(m)];
  return D({ ...e, cards: g });
}
function Ae(e, t) {
  const o = e.cards.find((n) => n.id === t);
  if (!o) return "That card is no longer on the board.";
  if (!Pe(e)) return e.lanes.some((n) => n.station) ? "The token stays on the map." : "This card stays on the board.";
  if ((e.signals ?? []).some((n) => n.cardId === t)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const n = o.allowedLaneIds.map((u) => e.lanes.find((h) => h.id === u).label), s = n.length > 1 ? n.slice(0, -1).join(", ") + " or " + n.at(-1) : n[0];
    return `${o.label} may only be in ${s}, so it stays a card.`;
  }
  return null;
}
function fn(e, t) {
  return Ae(e, t) !== null ? null : D({ ...e, cards: e.cards.filter((o) => o.id !== t) });
}
function ne(e, t) {
  const o = e.lanes.find((u) => u.id === t);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const u = ae(e, t);
    return o.capacity ? u + " / " + o.capacity + " points" : u + " points";
  }
  const n = tt(e, t);
  if (n) return "$" + n.amount + " · " + n.description;
  const s = e.cards.filter((u) => u.laneId === t).length;
  return o.capacity !== void 0 ? s + " of " + o.capacity : s + (s === 1 ? " card" : " cards");
}
const Re = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Ee = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function In(e, t = Re, o = 28) {
  const { pitch: n, row: s, top: u } = t, h = !!e.lanes[0].station, m = e.lanes.map((v) => e.cards.filter((b) => b.laneId === v.id).length), g = u + Math.max(1, ...m) * s + 36, k = e.lanes.map((v, b) => ({
    x: h ? v.station.column * (n + o) : b * n,
    y: h ? v.station.row * g : 0
  }));
  return {
    points: k,
    width: Math.max(...k.map((v) => v.x)) + n,
    height: Math.max(...k.map((v, b) => v.y + u + (h ? Math.max(1, m[b]) : m[b] + 1) * s))
  };
}
function vt() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Le(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((s) => s.id));
  let n = 1;
  for (; o.has(t + "-" + n); ) n++;
  return t + "-" + n;
}
function xn(e) {
  const t = D(e);
  if (t.kind || t.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return t;
}
function It(e, t) {
  const o = xn(e), n = Le(o, "lane");
  return o.lanes.push({ id: n, label: t.label, ...t.capacity === void 0 ? {} : { capacity: t.capacity } }), o.presentationOrder?.push(n), D(o);
}
function xt(e, t, o) {
  const n = xn(e);
  return n.cards.push({
    id: Le(n, "card"),
    label: o.label,
    laneId: t,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), D(n);
}
function Ct() {
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
function St(e, t, o) {
  const n = D(e);
  if (n.kind || !n.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const s = n.lanes.find((v) => v.id === t);
  if (!s?.station) throw new Error("Choose a station on this map.");
  if (n.lanes.length >= kn) throw new Error("A map can have up to five stations.");
  const u = Q(o?.label), h = Q(o?.outcome, 160), m = Le(n, "station");
  let g, k = 1 / 0;
  for (let v = 0; v < qe; v++)
    for (let b = 0; b < qe; b++) {
      if (n.lanes.some((y) => y.station.column === b && y.station.row === v)) continue;
      const I = Math.abs(s.station.column - b) + Math.abs(s.station.row - v);
      I < k && (k = I, g = { column: b, row: v });
    }
  if (!g) throw new Error("There is no free station position.");
  return s.station.next.push(m), n.lanes.push({ id: m, label: u, station: { ...g, next: [], outcome: h, ...o.image === void 0 ? {} : { image: gn(o.image) } } }), n.presentationOrder?.push(m), n;
}
const $t = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Cn = (e) => "caption-" + e, ye = (e) => "column-" + e, Z = { lane: fe, card: oe, image: Me, caption: Cn, column: ye };
function Sn(e, t) {
  let o = 2;
  for (; t(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function je(e, t, o) {
  const n = Math.max(0, Math.min(o, e / 2, t / 2)), s = e, u = t;
  return n ? `M ${n} 0 H ${s - n} Q ${s} 0 ${s} ${n} V ${u - n} Q ${s} ${u} ${s - n} ${u} H ${n} Q 0 ${u} 0 ${u - n} V ${n} Q 0 0 ${n} 0 Z` : `M 0 0 H ${s} V ${u} H 0 Z`;
}
function un(e, t) {
  const o = (n) => Math.round(parseInt(e.slice(n, n + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function hn(e, t, o, n) {
  for (let s = t; s > 11; s--) {
    const u = Math.max(1, Math.floor(o / (s * 0.55)));
    if (e.split(`
`).reduce((m, g) => m + Math.max(1, Math.ceil(g.length / u)), 0) * s * 1.3 <= n) return s;
  }
  return Math.min(t, 11);
}
const $n = 152, _e = $n + 12, Yn = 12;
function Xn(e, t) {
  const o = e?.lanesPerRow;
  if (o === void 0) return t;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, t);
}
function X(e, t = {}) {
  const o = D(e), { pitch: n, row: s, top: u } = Re, h = o.lanes.map((I) => o.cards.filter((y) => y.laneId === I.id).length), m = (I) => Math.max(h[I], (Array.isArray(t.rows) ? t.rows[I] : t.rows) ?? 0), g = !!o.lanes[0].station, k = o.lanes.some((I) => I.station?.image), v = Xn(t.layout, o.lanes.length), b = [];
  if (g) {
    const { points: I } = In(o);
    o.lanes.forEach((y, C) => b.push({
      laneId: y.id,
      x: I[C].x,
      y: I[C].y + (k ? y.station.row * _e : 0),
      width: n,
      height: u + (y.station.image ? _e : 0) + Math.max(1, h[C]) * s,
      column: y.station.column,
      row: y.station.row
    }));
  } else {
    let I = 0;
    for (let y = 0; y < o.lanes.length; y += v) {
      const C = o.lanes.slice(y, y + v), M = u + (Math.max(...C.map((F, N) => m(y + N))) + 1) * s;
      C.forEach((F, N) => b.push({ laneId: F.id, x: N * n, y: I, width: n, height: M, column: N, row: y / v })), I += M + Yn;
    }
  }
  return { places: b, width: Math.max(...b.map((I) => I.x + I.width)), height: Math.max(...b.map((I) => I.y + I.height)) };
}
function et(e, t) {
  const { pitch: o, width: n, row: s, height: u, top: h } = Re, m = t.origin ?? { x: 0, y: 0 }, g = !!e.lanes[0].station, { places: k } = X(e, t), v = t.style ?? {}, b = v.textColor ?? we.fontColor, I = v.borderColor ?? we.borderColor, y = v.borderWidth ?? we.borderWidth, C = v.cornerRadius ?? 0, M = v.fontSize ?? we.fontSize, F = v.laneFontSize ?? M + 2, N = v.captionFontSize ?? Math.max(11, M - 1), O = [], B = ($) => {
    const R = { options: {
      shapeHint: "rectangle",
      vectorPath: je($.width, $.height, C),
      foregroundColor: b,
      borderColor: I,
      borderWidth: y,
      ...v.fontFamily ? { fontFamily: v.fontFamily } : {},
      ...$
    }, relationships: { associations: [] } };
    return O.push(R), R;
  };
  e.lanes.forEach(($, R) => {
    const q = k[R], G = m.x + q.x, A = m.y + q.y, j = $.station?.image;
    B({
      id: ye($.id),
      text: "",
      name: $.label,
      xPos: G + 2,
      yPos: A,
      width: o - 4,
      height: q.height,
      vectorPath: je(o - 4, q.height, C ? C + 2 : 0),
      backgroundColor: g ? "#fcf9ed" : un(Ee[R], 0.6),
      borderColor: g ? "#a8b5aa" : un(Ee[R], 0.1),
      borderWidth: 1,
      ...g ? { borderStyle: "dashed" } : {}
    }), B({
      id: fe($.id),
      text: $.label,
      name: $.label,
      xPos: G + 8,
      yPos: A + 6,
      width: n,
      height: 58,
      backgroundColor: Ee[R],
      fontSize: hn($.label, F, n - 16, 50)
    }), B({
      id: Cn($.id),
      text: ne(e, $.id),
      name: $.label,
      xPos: G + 8,
      yPos: A + 66,
      width: n,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: N
    }), j && O.push({ options: {
      id: Me($.id),
      name: j.alt,
      text: "",
      xPos: G + 8,
      yPos: A + h,
      width: n,
      height: $n,
      shapeHint: "rectangle",
      image: j.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((W) => W.laneId === $.id).forEach((W, K) => {
      const Y = e.kind === "release-plan" ? W.label + `
` + W.points + " points" : W.label, ue = g ? n - 20 : n, he = g ? u - 6 : u, _ = g ? {} : { ...v.card, ...W.look }, pe = g ? C : v.card?.cornerRadius ?? C;
      B({
        id: oe(W.id),
        text: Y,
        name: W.label,
        xPos: G + (g ? 18 : 8),
        yPos: A + h + (j ? _e : 0) + K * s,
        width: ue,
        height: he,
        ...pe !== C ? { vectorPath: je(ue, he, pe) } : {},
        backgroundColor: g ? "#ffda75" : _.backgroundColor ?? v.backgroundColor ?? we.backgroundColor,
        ..._.textColor ? { foregroundColor: _.textColor } : {},
        ..._.fontFamily ? { fontFamily: _.fontFamily } : {},
        ..._.borderColor ? { borderColor: _.borderColor } : {},
        ..._.borderWidth !== void 0 ? { borderWidth: _.borderWidth } : {},
        fontSize: hn(Y, _.fontSize ?? M, ue - 16, he - 8)
      });
    });
  });
  const z = new Map(O.map(($) => [$.options.id, $]));
  for (const $ of e.lanes)
    $.station && (z.get(ye($.id)).relationships.associations = $.station.next.map((R) => ({
      id: $.id + "-to-" + R,
      parentId: ye($.id),
      childId: ye(R),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const $ of e.cards)
      for (const R of $.dependsOn ?? []) {
        const q = oe(R), G = oe($.id);
        z.get(q).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${$.id}`,
          parentId: q,
          childId: G,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (t.beside) {
    const $ = new Set(t.beside), R = new Set(O.map((A) => A.options.id)), q = /* @__PURE__ */ new Map();
    for (const A of [...R]) {
      if (!$.has(A)) continue;
      const j = Sn(A, (W) => $.has(W) || R.has(W));
      R.add(j), q.set(A, j);
    }
    const G = (A) => q.get(A) ?? A;
    for (const A of O) {
      A.options.id = G(A.options.id);
      for (const j of A.relationships.associations)
        j.parentId = G(j.parentId), j.childId = G(j.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: O };
}
function pn(e, t) {
  const o = D(e);
  if (t?.native) return et(o, t);
  const { width: n, row: s, height: u, top: h } = Re, m = [];
  function g(y, C, M, F, N, O) {
    m.push({ options: {
      id: y,
      text: C,
      name: C,
      xPos: M,
      yPos: F,
      width: n,
      height: N,
      shapeHint: "rectangle",
      backgroundColor: O,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: k } = In(o), v = 152, b = v + 12, I = o.lanes.some((y) => y.station?.image);
  o.lanes.forEach((y, C) => {
    const M = k[C].x, F = k[C].y + (I ? (y.station?.row ?? 0) * b : 0), N = y.station?.image, O = o.kind === "release-plan" ? y.label + `
` + (y.capacity ? ae(o, y.id) + " / " + y.capacity + " points" : ae(o, y.id) + " points") : y.label;
    g(fe(y.id), O, M, F, h - 12, Ee[C]), N && m.push({ options: {
      id: Me(y.id),
      name: N.alt,
      text: "",
      xPos: M,
      yPos: F + h,
      width: n,
      height: v,
      shapeHint: "rectangle",
      image: N.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((B) => B.laneId === y.id).forEach((B, z) => g(oe(B.id), o.kind === "release-plan" ? B.label + `
` + B.points + " points" : B.label, M, F + h + (N ? b : 0) + z * s, u, "#fffdf6"));
  });
  for (const y of o.lanes) {
    if (!y.station) continue;
    const C = m.find((M) => M.options.id === fe(y.id));
    C.relationships.associations = y.station.next.map((M) => ({ id: y.id + "-to-" + M, parentId: C.options.id, childId: fe(M), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), C.options.text = y.label + `
` + y.station.outcome, C.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const y = new Map(m.map((C) => [C.options.id, C]));
    for (const C of o.cards)
      for (const M of C.dependsOn ?? []) {
        const F = oe(M), N = oe(C.id);
        y.get(F).relationships.associations.push({
          id: `dependency-${M.length}-${M}-${C.id}`,
          parentId: F,
          childId: N,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: m };
}
const Pt = {
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
}, Ve = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Je = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function At() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Ve.map(({ id: e, who: t, quote: o }) => ({ id: e, label: t + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Ve.map(({ id: e, action: t, signal: o }) => ({ id: "test-" + e, label: t, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function Et() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Je.map(({ id: e, label: t, rate: o }) => ({ id: e, label: t + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, t) => ({ id: "fund-" + t, label: e + " $200", laneId: t === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function ve(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((n) => n.station)) return;
  const t = e.experience.kind, o = t === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Je.map((n) => n.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((n) => o.includes(n.id))) && !(t === "customer-interviews" && (!e.cards.every((n) => Ve.some((s) => s.id === n.id)) || e.cards.filter((n) => n.laneId === "prototype").length > 1)))
    return t;
}
function nt(e, t, o) {
  const n = ve(e), s = e.cards.find((h) => h.id === t);
  if (!n || !s || s.laneId === o) return null;
  let u = e;
  if (n === "customer-interviews") {
    if (o !== "prototype") return null;
    const h = e.cards.find((m) => m.laneId === o);
    if (h) {
      if (!Ne(e, h).some((m) => m.id === "interviews")) return null;
      u = Ke(e, h.id, "interviews");
    }
  }
  return Ne(u, s).some((h) => h.id === o) ? Ke(u, t, o) : null;
}
function tt(e, t) {
  if (ve(e) !== "experiment-budget") return null;
  const o = Je.find((u) => u.id === t), n = e.cards.filter((u) => u.laneId === t).length, s = n * (o?.per ?? 0);
  return { amount: n * 200, description: o ? s + " " + (s === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  we as DEFAULT_NOTE_STYLE,
  St as addWorkshopBranch,
  xt as addWorkshopCard,
  It as addWorkshopLane,
  gt as attachWorkshop,
  Ne as availableLanes,
  On as canHangPanel,
  Je as channels,
  Et as createBudgetWorkshop,
  At as createInterviewWorkshop,
  vt as createLaneWorkshop,
  Ct as createWorkshopMap,
  bt as decodeWorkshopFragment,
  wt as describeFocusDarkroom,
  kt as encodeWorkshopFragment,
  at as handoffSummary,
  ht as hangGalleryPanel,
  Pt as industrialWorkshop,
  mt as initialFocusDarkroom,
  Ve as interviews,
  Ee as laneColors,
  $e as listeningRoom,
  dt as listeningRoomCaption,
  bn as maxWorkshopCards,
  ft as moonGallery,
  Ke as moveWorkshopCard,
  $t as nightTransfer,
  pt as normalizeFocusDarkroom,
  lt as normalizeListeningRoom,
  ut as normalizeMoonGallery,
  rt as normalizeOfflineHandoff,
  ot as offlineHandoff,
  nt as planStartupMove,
  mn as printFields,
  ae as releaseLoad,
  ct as releasePlan,
  st as resolveHandoff,
  Zn as resolveWorkshopSignals,
  it as reviewHandoff,
  ve as startupExperienceKind,
  D as validateWorkshop,
  tt as workshopBudgetResult,
  ke as workshopCandidate,
  fn as workshopCardAsNote,
  Ae as workshopCardAsNoteRefusal,
  Vn as workshopCardLookOf,
  cn as workshopDestinations,
  ne as workshopLaneCaption,
  X as workshopLanePlaces,
  Re as workshopLayout,
  Z as workshopNodeIds,
  ge as workshopNoteCandidate,
  ce as workshopNoteRefusal,
  In as workshopPositions,
  yn as workshopPresentationLanes,
  yt as workshopPresentationScenes,
  Ue as workshopRefusal,
  Sn as workshopStandInId,
  Pe as workshopTakesNotes,
  pn as workshopToSlate
};
