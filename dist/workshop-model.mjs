const Qe = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Ze(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: r, fieldNote: i, deskNote: a, fallback: u } = e, l = (h) => typeof h == "string" && h.trim().length > 0 && h.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(h);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !l(i) || !l(a) || !l(u) ? null : { kind: n, version: o, stage: t, choice: r, fieldNote: i.trim(), deskNote: a.trim(), fallback: u.trim() };
}
function Ye(e) {
  return { ...e, stage: "review", choice: null };
}
function _e(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Xe(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const _ = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function en(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: r, rightLabel: i } = e, a = (u) => typeof u == "string" && u.trim().length > 0 && u.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(u);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !a(r) || !a(i) ? null : { kind: n, version: o, mix: t, leftLabel: r.trim(), rightLabel: i.trim() };
}
function nn({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === _.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === _.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === _.leftLabel && o === _.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function J(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function Te(e) {
  const n = new Map(e.cards.map((a) => [a.id, a])), o = new Map(e.lanes.map((a, u) => [a.id, u])), t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function i(a) {
    if (!t.has(a.id)) {
      if (r.has(a.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(a.id);
      for (const u of a.dependsOn ?? []) {
        const l = n.get(u);
        if (!l) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(l.laneId) > o.get(a.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        i(l);
      }
      r.delete(a.id), t.add(a.id);
    }
  }
  for (const a of e.cards) i(a);
  for (const a of e.lanes) {
    if (a.station) throw new Error("Release windows cannot also be map stations.");
    if (J(e, a.id) > (a.capacity ?? 1 / 0)) throw new Error(`Release "${a.label}" exceeds its point budget.`);
  }
}
function te(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((d, v) => [d.id, v])), r = t.get(o);
  if (r === void 0) return null;
  const i = r < t.get(n.laneId), a = /* @__PURE__ */ new Set([n.id]), u = [n];
  for (; u.length; ) {
    const d = u.pop();
    for (const v of e.cards) {
      if (a.has(v.id)) continue;
      const b = t.get(v.laneId);
      (i ? b > r && d.dependsOn?.includes(v.id) : b < r && v.dependsOn?.includes(d.id)) && (a.add(v.id), u.push(v));
    }
  }
  if (e.cards.filter((d) => a.has(d.id)).some((d) => d.allowedLaneIds && !d.allowedLaneIds.includes(o))) return null;
  const h = { ...e, cards: e.cards.map((d) => a.has(d.id) ? { ...d, laneId: o } : d) }, k = e.lanes[r].capacity;
  return k !== void 0 && J(h, o) > k ? null : h;
}
const tn = {
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
}, on = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function rn(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const i of n.panels) {
    if (!i || typeof i.id != "string" || !/^[a-z][\w-]{0,31}$/.test(i.id) || typeof i.label != "string" || !i.label.trim() || i.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(i.artwork) || !(i.after === null || typeof i.after == "string")) return null;
    o.push({ id: i.id, label: i.label.trim(), artwork: i.artwork, after: i.after });
  }
  const t = new Map(o.map((i) => [i.id, i])), r = [...new Set(n.hung)];
  if (t.size !== o.length || r.length !== n.hung.length || r.some((i) => !t.has(i))) return null;
  for (const i of o) {
    const a = /* @__PURE__ */ new Set([i.id]);
    let u = i.after;
    for (; u !== null; ) {
      if (a.has(u) || !t.has(u) || r.includes(i.id) && !r.includes(u)) return null;
      a.add(u), u = t.get(u).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: r };
}
function Me(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function sn(e, n) {
  return Me(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const ke = ["firstPrint", "secondPrint", "thirdPrint"], be = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function an(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...be, route: n.route };
  for (const t of ke) {
    const r = n[t];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = r.trim();
  }
  return o;
}
function ln(e = new URLSearchParams()) {
  const n = { ...be };
  for (const t of ke) {
    const r = e.get(t)?.trim();
    r && r.length <= 48 && (n[t] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function dn(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function We(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Ne(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), n;
}
function Oe(e) {
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
function Ne(e) {
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
function Re() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const ze = "#1f7a5c", He = "#5b9a85", pe = "#c2410c", Ge = { canMove: !1, canSelect: !1 };
function U(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function cn(e, n, o = {}) {
  let t = R(n), r = null, i = !!o.readOnly, a = !1;
  const u = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Set();
  let d = null, v = null, b = null, x = Promise.resolve(), S = null;
  const $ = o.origin ? { x: o.origin.x, y: o.origin.y } : Fe(e), L = Be(t);
  for (const p of e.nodes.allNodes)
    if (L.has(p.id))
      throw new Error(`This slate already has a note named "${p.id}". A workshop draws its own lane and card notes.`);
  const z = {
    governs(p) {
      if (u.get(p.id) !== p) return null;
      const f = U(p.id)?.kind;
      return f === "card" ? { canMove: !i, canEditText: !i && !r && t.kind !== "release-plan" } : f === "lane" ? { canMove: !1, canEditText: !i && !r } : Ge;
    },
    onStart(p, f) {
      const g = U(p.id).key;
      if (i || r || !t.cards.some((m) => m.id === g)) return !1;
      O(), M();
      const y = { x: f.x - (p.options.x ?? 0), y: f.y - (p.options.y ?? 0) };
      let s = null;
      try {
        s = o.chooseCandidate?.(t, g, y) ?? null;
      } catch (m) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", m);
      }
      return d = { cardId: g, evaluate: s, outcome: { kind: "home" } }, C(t, { skip: g }), !0;
    },
    onMove(p, f) {
      if (!d) return;
      const g = E(d.cardId, f, d.evaluate);
      if (De(g, d.outcome)) return;
      d.outcome = g;
      const y = g.kind === "candidate" ? g.next : null;
      C(y ?? t, { skip: d.cardId }), T(o.onPreview, y);
    },
    onEnd(p, f) {
      if (!d) return { accept: !1 };
      const { cardId: g, evaluate: y } = d, s = E(g, f, y), m = t.cards.find((c) => c.id === g);
      if (d = null, T(o.onPreview, null), s.kind === "candidate") {
        t = s.next, C(t, { skip: g });
        const c = t.lanes.find((P) => P.id === s.laneId);
        e.announce?.(`${m.label} moved to ${c.label}. ${Z(t, c.id)}.`), T(o.onChange, t, { cardId: g, laneId: s.laneId });
        const w = Le(t, p.id);
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      return s.kind === "refused" ? K(m.label, { cardId: g, laneId: s.laneId, reason: s.reason }) : (C(t, { skip: g }), s.kind === "outside" && (e.announce?.(`${m.label} was not dropped on a lane. It stays where it was.`), T(o.onRefuse, { cardId: g, laneId: null, reason: "" }))), { accept: !1 };
    },
    onCancel(p) {
      const f = d && t.cards.find((g) => g.id === d.cardId);
      d = null, T(o.onPreview, null), C(t, { skip: p.id.replace(/^card-/, "") }), f && e.announce?.(`Move cancelled. ${f.label} stays where it was.`);
    },
    onTextCommit(p, f, g) {
      const y = U(p.id);
      if (!y || i || r) return !1;
      const s = f.replace(/\s+/g, " ").trim(), m = y.kind === "lane" ? { laneId: y.key, label: s } : { cardId: y.key, label: s };
      let c;
      try {
        c = R(y.kind === "lane" ? { ...t, lanes: t.lanes.map((w) => w.id === y.key ? { ...w, label: s } : w) } : { ...t, cards: t.cards.map((w) => w.id === y.key ? { ...w, label: s } : w) });
      } catch (w) {
        const P = w instanceof Error ? w.message : "That name is not allowed.";
        return e.announce?.(`${g} keeps its name. ${P}`), T(o.onRefuse, { ...y.kind === "lane" ? { laneId: y.key } : { cardId: y.key }, rename: m, reason: P }), !1;
      }
      return s === g ? !1 : (t = c, C(t), e.announce?.(`${g} renamed to ${s}.`), T(o.onChange, t, { rename: m }), s);
    },
    onKeyDown(p, f) {
      const g = U(p.id);
      if (g?.kind !== "card" || i || r || d || f.ctrlKey || f.metaKey || f.altKey) return !1;
      const y = t.cards.find((s) => s.id === g.key);
      if (!y) return !1;
      if (f.key === "ArrowLeft" || f.key === "ArrowRight")
        return f.preventDefault(), H(y.id, f.key === "ArrowLeft" ? -1 : 1), !0;
      if (v?.cardId !== y.id) return !1;
      if (f.key === "Enter") {
        f.preventDefault();
        const { laneId: s, next: m } = v;
        v = null, t = m, C(t), T(o.onPreview, null);
        const c = t.lanes.find((w) => w.id === s);
        return e.announce?.(`${y.label} moved to ${c.label}. ${Z(t, s)}.`), T(o.onChange, t, { cardId: y.id, laneId: s }), !0;
      }
      return f.key === "Escape" ? (f.preventDefault(), M(), e.announce?.(`Move cancelled. ${y.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const p = (e.getSelectedNodes?.() ?? []).filter((f) => u.get(f.id) === f).map((f) => f.id);
      u.clear(), l.clear(), h.clear(), d = null, v = null, C(r ?? t, { animate: !1 }), p.length === 1 && (x = x.then(() => {
        const f = u.get(p[0]);
        if (a || !f || (e.getSelectedNodes?.() ?? []).length) return;
        const g = () => e.selectNodes?.([f]);
        typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(g) : g();
      }));
    }
  }, W = e.setDragPolicy(z), I = () => {
    v && M();
  };
  e.element?.addEventListener?.("pointerdown", I, !0), C(t, { animate: !1 });
  function E(p, f, g) {
    const y = t.cards.find((A) => A.id === p);
    if (!y) return { kind: "outside" };
    const s = t.lanes.map((A) => u.get(Q.column(A.id))).filter(Boolean), m = e.hitTestNodes(f, s, { padding: 2 }), c = m ? U(m.id).key : null;
    if (!c) return { kind: "outside" };
    if (c === y.laneId) return { kind: "home" };
    const w = ne(t, p, c);
    if (!w) return { kind: "refused", laneId: c, reason: me(t, p, c) ?? "That move is not available." };
    if (!g) return { kind: "candidate", laneId: c, next: w };
    let P = null;
    try {
      P = g({ x: f.x - $.x, y: f.y - $.y });
    } catch (A) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", A), { kind: "candidate", laneId: c, next: w };
    }
    const D = P?.cards.find((A) => A.id === p)?.laneId;
    return !P || !D || D === y.laneId ? { kind: "home" } : { kind: "candidate", laneId: D, next: P };
  }
  function H(p, f) {
    const g = t.cards.find((w) => w.id === p), y = we(t, p), s = v?.cardId === p ? v.laneId : g.laneId, m = y[y.findIndex((w) => w.id === s) + f];
    if (O(), !m) {
      const w = t.lanes[t.lanes.findIndex((D) => D.id === s) + f];
      if (!w) {
        e.announce?.(`${g.label} has no lane to move to on that side.`);
        return;
      }
      const P = me(t, p, w.id) ?? "That move is not available.";
      b = { laneId: w.id, reason: P, timer: setTimeout(() => O(), 1500) }, C(v?.next ?? r ?? t), e.announce?.(`${g.label} can't move to ${w.label}. ${P}`), T(o.onRefuse, { cardId: p, laneId: w.id, reason: P });
      return;
    }
    if (m.id === g.laneId) {
      M(), e.announce?.(`${g.label} is back in ${m.label}.`);
      return;
    }
    const c = ne(t, p, m.id);
    v = { cardId: p, laneId: m.id, next: c }, C(c), T(o.onPreview, c), e.announce?.(`${g.label} to ${m.label}: ${Z(c, m.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function M() {
    v && (v = null, T(o.onPreview, null), C(r ?? t));
  }
  function K(p, f) {
    O(!1), b = { laneId: f.laneId, reason: f.reason, timer: setTimeout(() => O(), 1500) }, C(t, { skip: f.cardId });
    const g = t.lanes.find((y) => y.id === f.laneId);
    e.announce?.(`${p} can't move to ${g?.label ?? "that lane"}. ${f.reason}`), T(o.onRefuse, f);
  }
  function O(p = !0) {
    b && (clearTimeout(b.timer), b = null, p && !a && C(d && d.outcome.kind === "candidate" ? d.outcome.next : v?.next ?? r ?? t, { skip: d?.cardId }));
  }
  function G(p) {
    const f = d || v ? Math.max(...t.lanes.map((c) => t.cards.filter((w) => w.laneId === c.id).length)) : 0, g = ae(p, { native: !0, origin: $, rows: f }).nodes, y = new Map(g.map((c) => [c.options.id, c.options])), s = (c, w, P, D = !1) => {
      const A = y.get(Q.column(c));
      A && (A.borderColor = w, A.borderWidth = P, delete A.borderStyle);
      const re = D && y.get(Q.lane(c));
      re && (re.borderColor = w, re.borderWidth = P);
    }, m = d?.cardId ?? v?.cardId;
    if (m) {
      const c = t.cards.find((P) => P.id === m)?.laneId;
      for (const P of we(t, m)) P.id !== c && s(P.id, He, 2);
      const w = d ? d.outcome : v ? { kind: "candidate", laneId: v.laneId } : null;
      w?.kind === "candidate" && s(w.laneId, ze, 3, !0), w?.kind === "refused" && s(w.laneId, pe, 3);
    }
    if (b) {
      s(b.laneId, pe, 3, !0);
      const c = y.get(Q.caption(b.laneId));
      c && (c.text = b.reason, c.foregroundColor = "#b42318");
    }
    return g;
  }
  function C(p, f = {}) {
    if (a) return;
    S = { model: p, skip: f.skip, animate: f.animate !== !1 };
    const g = G(p), y = [];
    for (const { options: m } of g) {
      const c = m.id;
      if (u.has(c)) continue;
      if (e.nodes.one?.(c)) {
        k.has(c) || console.warn(`WORKSHOP: the slate already has a note named "${c}"; the workshop cannot draw its own.`), k.add(c);
        continue;
      }
      k.delete(c);
      const w = e.nodes.add(We(m));
      u.set(c, w), l.set(c, { ...m }), w.ready && y.push(w.ready.then(() => {
        if (u.get(c) !== w) return;
        w.applyGovernance?.(), U(c)?.kind === "column" && w.toBack?.(!1);
        const P = he(S?.model ?? p, c);
        P && w.svgGroup?.node?.setAttribute("aria-label", P);
      }).catch(() => {
      }));
    }
    const s = S;
    x = Promise.all([x, ...y]).then(() => {
      a || S !== s || Ae(G(s.model), s);
    }).catch((m) => console.warn("WORKSHOP: could not draw the workshop", m));
  }
  function Ae(p, f) {
    const g = new Set(p.map((y) => y.options.id));
    e.withPolicyAuthority(() => {
      for (const [s, m] of [...u])
        if (!g.has(s)) {
          for (const [c, w] of [...h])
            w.parentId !== s && w.childId !== s || (w.parent.relationships?.removeAssociation(c), h.delete(c));
          e.deselectNode?.(m), m.editor?.cancelInline?.(), u.delete(s), l.delete(s), e.nodes.remove(s);
        }
      for (const { options: s } of p) {
        const m = s.id, c = u.get(m);
        if (!c?.svgGroup) continue;
        const w = l.get(m) ?? {}, P = c.editor?.isInlineEditing?.();
        (s.fontSize !== w.fontSize || s.foregroundColor !== w.foregroundColor) && (c.options.fontSize = s.fontSize, c.options.fontColor = s.foregroundColor, c.applyTextStyle?.()), s.text !== w.text && !P && c.setText?.(s.text), (s.width !== w.width || s.height !== w.height) && (s.vectorPath ? (c.options.width = s.width, c.options.height = s.height, c.setShape?.(c.options.shape, s.vectorPath), U(m)?.kind === "column" && c.toBack?.(!1)) : c.setSize?.(s.width, s.height)), s.backgroundColor !== w.backgroundColor && c.setColors?.(s.backgroundColor), (s.borderColor !== w.borderColor || s.borderWidth !== w.borderWidth || s.borderStyle !== w.borderStyle) && (c.options.borderColor = s.borderColor, c.options.borderWidth = s.borderWidth, c.options.borderStyle = s.borderStyle, c.applyBorder?.());
        const D = s.xPos !== w.xPos || s.yPos !== w.yPos || Math.abs((c.options.x ?? 0) - s.xPos) > 0.5 || Math.abs((c.options.y ?? 0) - s.yPos) > 0.5;
        m !== (f.skip && Q.card(f.skip)) && D && c.position(s.xPos, s.yPos, void 0, void 0, f.animate && !Re() ? 180 : 0);
        const A = he(f.model, m);
        A && c.svgGroup.node.getAttribute("aria-label") !== A && c.svgGroup.node.setAttribute("aria-label", A), l.set(m, { ...s });
      }
      const y = /* @__PURE__ */ new Map();
      for (const s of p) for (const m of s.relationships.associations) y.set(m.id, m);
      for (const [s, m] of [...h])
        y.has(s) && u.get(m.parentId) === m.parent && u.get(m.childId) === m.child || (m.parent.relationships?.removeAssociation(s), h.delete(s));
      for (const [s, m] of y) {
        if (h.has(s)) continue;
        const c = u.get(m.parentId), w = u.get(m.childId);
        !c?.relationships || !w?.svgGroup || (c.relationships.addAssociation(w, Oe(m)), h.set(s, { parentId: m.parentId, childId: m.childId, parent: c, child: w }));
      }
    }), e.notifyNodeChanged?.();
  }
  function he(p, f) {
    const g = U(f);
    if (g?.kind === "lane") {
      const y = p.lanes.find((s) => s.id === g.key);
      return y ? `${y.label}, ${Z(p, y.id)}` : null;
    }
    if (g?.kind === "card") {
      const y = p.cards.find((m) => m.id === g.key), s = y && p.lanes.find((m) => m.id === y.laneId);
      return y && s ? `${y.label}, in ${s.label}` : null;
    }
    return null;
  }
  function Le(p, f) {
    const g = ae(p, { native: !0, origin: $ }).nodes.find((y) => y.options.id === f)?.options;
    return g ? { x: g.xPos, y: g.yPos } : null;
  }
  function Y() {
    d && e.cancelGovernedDrag?.("host"), d = null, v && (v = null, T(o.onPreview, null)), O(!1);
  }
  return {
    get value() {
      return t;
    },
    get origin() {
      return { ...$ };
    },
    whenDrawn: () => x,
    update(p) {
      if (a) throw new Error("This workshop has been detached.");
      const f = R(p);
      Y(), t = f, C(r ?? t);
    },
    preview(p) {
      if (a) throw new Error("This workshop has been detached.");
      const f = p ? R(p) : null;
      Y(), r = f, C(r ?? t), e.refreshGovernance?.();
    },
    refuse(p, f) {
      const g = t.lanes.find((y) => y.id === p);
      a || !g || (O(!1), b = { laneId: p, reason: f, timer: setTimeout(() => O(), 1500) }, C(r ?? t), e.announce?.(`${g.label}: ${f}`));
    },
    setReadOnly(p) {
      a || i === !!p || (Y(), i = !!p, C(r ?? t), e.refreshGovernance?.());
    },
    destroy() {
      a || (Y(), a = !0, e.element?.removeEventListener?.("pointerdown", I, !0), e.withPolicyAuthority(() => {
        for (const [p, f] of h) f.parent.relationships?.removeAssociation(p);
        for (const [p, f] of u)
          e.deselectNode?.(f), f.editor?.cancelInline?.(), e.nodes.one(p) === f && e.nodes.remove(p);
      }), h.clear(), u.clear(), l.clear(), W(), e.notifyNodeChanged?.());
    }
  };
}
function T(e, ...n) {
  try {
    e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
  }
}
function De(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function Be(e) {
  return new Set(ae(e, { native: !0 }).nodes.map((n) => n.options.id));
}
function Fe(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const r of n)
    o = Math.max(o, (r.options.x ?? 0) + (r.options.width ?? 0)), t = Math.min(t, r.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
function V(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function N(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function ve(e) {
  const n = V(e);
  let o;
  try {
    o = new URL(N(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: N(n.alt, 240) };
}
function B(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function j(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function Ie({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((r) => r.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Ue(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const F = (e) => "lane-" + e, q = (e) => "card-" + e, oe = (e) => "image-" + e;
function un(e) {
  const n = Ue(e);
  return Ie(e).map((o) => {
    const t = e.cards.filter((a) => a.laneId === o.id), r = n.filter((a) => a.laneId === o.id), i = [F(o.id)];
    return o.station?.image && i.push(oe(o.id)), { lane: o, cards: t, signals: r, nodeIds: [...i, ...t.map((a) => q(a.id))] };
  });
}
const xe = 5, qe = 24, ie = 3;
function R(e) {
  const n = V(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = N(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > xe)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > qe)
    throw new Error("A workshop supports up to 24 cards.");
  const r = n.lanes.map((l) => {
    const h = V(l), k = { id: B(h.id), label: N(h.label) };
    if (h.capacity !== void 0) {
      const d = o ? 576 : 24;
      if (typeof h.capacity != "number" || !Number.isInteger(h.capacity) || h.capacity < 1 || h.capacity > d)
        throw new Error(`Lane capacity must be a whole number from 1 to ${d}.`);
      k.capacity = h.capacity;
    }
    if (h.station !== void 0) {
      const d = V(h.station), v = (x) => {
        if (typeof x != "number" || !Number.isInteger(x) || x < 0 || x >= ie)
          throw new Error("Use map coordinates from 0 to 2.");
        return x;
      };
      if (!Array.isArray(d.next) || d.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const b = d.next.map(B);
      j(b, "onward stop"), k.station = { column: v(d.column), row: v(d.row), next: b, outcome: N(d.outcome, 160) }, d.image !== void 0 && (k.station.image = ve(d.image));
    }
    return k;
  }), i = r.map((l) => l.id);
  if (j(i, "lane ID"), (o || r.some((l) => l.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (r.some((l) => l.station)) {
    if (!r.every((l) => l.station)) throw new Error("Give every station on the map a position.");
    j(r.map((l) => l.station.column + "," + l.station.row), "map position");
    for (const l of r)
      if (l.station.next.some((h) => h === l.id || !i.includes(h))) throw new Error("Connect each stop to another station on this map.");
  }
  const a = n.cards.map((l) => {
    const h = V(l), k = { id: B(h.id), label: N(h.label), laneId: B(h.laneId) };
    if (!i.includes(k.laneId)) throw new Error("Card refers to an unknown lane.");
    if (h.allowedLaneIds !== void 0) {
      if (!Array.isArray(h.allowedLaneIds) || h.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (k.allowedLaneIds = h.allowedLaneIds.map(B), j(k.allowedLaneIds, "allowed lane"), !k.allowedLaneIds.includes(k.laneId) || !k.allowedLaneIds.every((d) => i.includes(d)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (o) {
      if (typeof h.points != "number" || !Number.isInteger(h.points) || h.points < 1 || h.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (k.points = h.points, h.dependsOn !== void 0) {
        if (!Array.isArray(h.dependsOn) || h.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        k.dependsOn = h.dependsOn.map(B), j(k.dependsOn, "dependency");
      }
    }
    return k;
  });
  j(a.map((l) => l.id), "card ID");
  const u = { version: 1, title: t, lanes: r, cards: a };
  if (n.experience !== void 0) {
    const l = V(n.experience);
    if (l.version !== 1 || l.kind !== "customer-interviews" && l.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    u.experience = { version: 1, kind: l.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    u.signals = n.signals.map((l) => {
      const h = V(l), k = B(h.cardId), d = B(h.laneId);
      if (!a.some((v) => v.id === k) || !i.includes(d))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: B(h.id),
        label: N(h.label),
        cardId: k,
        laneId: d,
        whenPresent: N(h.whenPresent, 160),
        whenAbsent: N(h.whenAbsent, 160)
      };
    }), j(u.signals.map((l) => l.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    u.presentationOrder = Ie({ lanes: r, presentationOrder: n.presentationOrder }).map((l) => l.id);
  }
  if (o)
    return u.kind = "release-plan", Te(u), u;
  for (const l of r)
    if (a.filter((h) => h.laneId === l.id).length > (l.capacity ?? 1 / 0))
      throw new Error(`Lane "${l.label}" exceeds its capacity.`);
  return u;
}
const Pe = 65536;
function fn(e) {
  const n = JSON.stringify(R(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > Pe) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function hn(e) {
  if (e.length > Pe) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return R(t);
}
function ee(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => te(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((r) => r.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function se(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  if (t && e.kind === "release-plan") {
    const r = te(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !ee(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
function ne(e, n, o) {
  const t = e.cards.find((i) => i.id === n);
  if (!t || !e.lanes.some((i) => i.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return te(e, t, o);
  const r = Ve(e, n, o);
  return r || (o === "prototype" && fe(e) === "customer-interviews" ? null : ee(e, t).some((i) => i.id === o) ? se(e, n, o) : null);
}
function we(e, n) {
  return e.lanes.filter((o) => ne(e, n, o.id) !== null);
}
function me(e, n, o) {
  if (ne(e, n, o) !== null) return null;
  const t = e.cards.find((l) => l.id === n), r = e.lanes.find((l) => l.id === o);
  if (!t || !r) return "That move is not available.";
  const i = `This card can't go in ${r.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return i;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return i;
    const l = J(e, o), h = { ...e, lanes: e.lanes.map((d) => d === r ? { id: r.id, label: r.label } : d) }, k = te(h, t, o);
    return k ? `Needs ${J(k, o) - l} points. Now holds ${l} of ${r.capacity} points.` : i;
  }
  const a = e.lanes.find((l) => l.id === t.laneId);
  if (a?.station && !a.station.next.includes(o)) return `${r.label} can't be reached from ${a.label}.`;
  const u = e.cards.filter((l) => l.laneId === o).length;
  return r.capacity !== void 0 && u >= r.capacity ? `Now holds ${u} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.` : i;
}
function Z(e, n) {
  const o = e.lanes.find((i) => i.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const i = J(e, n);
    return o.capacity ? i + " / " + o.capacity + " points" : i + " points";
  }
  const t = Je(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const r = e.cards.filter((i) => i.laneId === n).length;
  return o.capacity !== void 0 ? r + " of " + o.capacity : r + (r === 1 ? " card" : " cards");
}
const de = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, X = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Se(e, n = de, o = 28) {
  const { pitch: t, row: r, top: i } = n, a = !!e.lanes[0].station, u = e.lanes.map((k) => e.cards.filter((d) => d.laneId === k.id).length), l = i + Math.max(1, ...u) * r + 36, h = e.lanes.map((k, d) => ({
    x: a ? k.station.column * (t + o) : d * t,
    y: a ? k.station.row * l : 0
  }));
  return {
    points: h,
    width: Math.max(...h.map((k) => k.x)) + t,
    height: Math.max(...h.map((k, d) => k.y + i + (a ? Math.max(1, u[d]) : u[d] + 1) * r))
  };
}
function pn() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function ce(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function Ee(e) {
  const n = R(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function wn(e, n) {
  const o = Ee(e), t = ce(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), R(o);
}
function mn(e, n, o) {
  const t = Ee(e);
  return t.cards.push({
    id: ce(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), R(t);
}
function gn() {
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
function yn(e, n, o) {
  const t = R(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = t.lanes.find((k) => k.id === n);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= xe) throw new Error("A map can have up to five stations.");
  const i = N(o?.label), a = N(o?.outcome, 160), u = ce(t, "station");
  let l, h = 1 / 0;
  for (let k = 0; k < ie; k++)
    for (let d = 0; d < ie; d++) {
      if (t.lanes.some((b) => b.station.column === d && b.station.row === k)) continue;
      const v = Math.abs(r.station.column - d) + Math.abs(r.station.row - k);
      v < h && (h = v, l = { column: d, row: k });
    }
  if (!l) throw new Error("There is no free station position.");
  return r.station.next.push(u), t.lanes.push({ id: u, label: i, station: { ...l, next: [], outcome: a, ...o.image === void 0 ? {} : { image: ve(o.image) } } }), t.presentationOrder?.push(u), t;
}
const kn = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Ce = (e) => "caption-" + e, $e = (e) => "column-" + e, Q = { lane: F, card: q, image: oe, caption: Ce, column: $e };
function ge(e, n, o) {
  const t = Math.min(o, e / 2, n / 2), r = e, i = n;
  return `M ${t} 0 H ${r - t} Q ${r} 0 ${r} ${t} V ${i - t} Q ${r} ${i} ${r - t} ${i} H ${t} Q 0 ${i} 0 ${i - t} V ${t} Q 0 0 ${t} 0 Z`;
}
function ye(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function Ke(e) {
  return e.length <= 22 ? 17 : e.length <= 52 ? 14 : 12;
}
function je(e, n, o = 0) {
  const { pitch: t, width: r, row: i, height: a, top: u } = de, l = !!e.lanes[0].station, { points: h } = Se(e), k = e.lanes.map((I) => e.cards.filter((E) => E.laneId === I.id).length), d = 152, v = d + 12, b = e.lanes.some((I) => I.station?.image), x = u + (Math.max(o, ...k) + 1) * i, S = "#18302d", $ = "#667872", L = [], z = (I) => {
    const E = { options: {
      shapeHint: "rectangle",
      vectorPath: ge(I.width, I.height, 12),
      foregroundColor: S,
      borderColor: $,
      borderWidth: 1,
      ...I
    }, relationships: { associations: [] } };
    return L.push(E), E;
  };
  e.lanes.forEach((I, E) => {
    const H = n.x + h[E].x, M = n.y + h[E].y + (b ? (I.station?.row ?? 0) * v : 0), K = I.station?.image, O = l ? u + (K ? v : 0) + Math.max(1, k[E]) * i : x;
    z({
      id: $e(I.id),
      text: "",
      name: I.label,
      xPos: H + 2,
      yPos: M,
      width: t - 4,
      height: O,
      vectorPath: ge(t - 4, O, 14),
      backgroundColor: l ? "#fcf9ed" : ye(X[E], 0.6),
      borderColor: l ? "#a8b5aa" : ye(X[E], 0.1),
      ...l ? { borderStyle: "dashed" } : {}
    }), z({
      id: F(I.id),
      text: I.label,
      name: I.label,
      xPos: H + 8,
      yPos: M + 6,
      width: r,
      height: 58,
      backgroundColor: X[E],
      fontSize: Ke(I.label)
    }), z({
      id: Ce(I.id),
      text: Z(e, I.id),
      name: I.label,
      xPos: H + 8,
      yPos: M + 66,
      width: r,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      foregroundColor: "#3f5750",
      fontSize: 13
    }), K && L.push({ options: {
      id: oe(I.id),
      name: K.alt,
      text: "",
      xPos: H + 8,
      yPos: M + u,
      width: r,
      height: d,
      shapeHint: "rectangle",
      image: K.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((G) => G.laneId === I.id).forEach((G, C) => z({
      id: q(G.id),
      text: e.kind === "release-plan" ? G.label + `
` + G.points + " points" : G.label,
      name: G.label,
      xPos: H + (l ? 18 : 8),
      yPos: M + u + (K ? v : 0) + C * i,
      width: l ? r - 20 : r,
      height: l ? a - 6 : a,
      backgroundColor: l ? "#ffda75" : "#fffdf6",
      fontSize: 15
    }));
  });
  const W = new Map(L.map((I) => [I.options.id, I]));
  for (const I of e.lanes)
    I.station && (W.get(F(I.id)).relationships.associations = I.station.next.map((E) => ({
      id: I.id + "-to-" + E,
      parentId: F(I.id),
      childId: F(E),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const I of e.cards)
      for (const E of I.dependsOn ?? []) {
        const H = q(E), M = q(I.id);
        W.get(H).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${I.id}`,
          parentId: H,
          childId: M,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  return { options: { name: e.title }, shareId: "", nodes: L };
}
function ae(e, n) {
  const o = R(e);
  if (n?.native) return je(o, n.origin ?? { x: 0, y: 0 }, n.rows);
  const { width: t, row: r, height: i, top: a } = de, u = [];
  function l(b, x, S, $, L, z) {
    u.push({ options: {
      id: b,
      text: x,
      name: x,
      xPos: S,
      yPos: $,
      width: t,
      height: L,
      shapeHint: "rectangle",
      backgroundColor: z,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: h } = Se(o), k = 152, d = k + 12, v = o.lanes.some((b) => b.station?.image);
  o.lanes.forEach((b, x) => {
    const S = h[x].x, $ = h[x].y + (v ? (b.station?.row ?? 0) * d : 0), L = b.station?.image, z = o.kind === "release-plan" ? b.label + `
` + (b.capacity ? J(o, b.id) + " / " + b.capacity + " points" : J(o, b.id) + " points") : b.label;
    l(F(b.id), z, S, $, a - 12, X[x]), L && u.push({ options: {
      id: oe(b.id),
      name: L.alt,
      text: "",
      xPos: S,
      yPos: $ + a,
      width: t,
      height: k,
      shapeHint: "rectangle",
      image: L.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((W) => W.laneId === b.id).forEach((W, I) => l(q(W.id), o.kind === "release-plan" ? W.label + `
` + W.points + " points" : W.label, S, $ + a + (L ? d : 0) + I * r, i, "#fffdf6"));
  });
  for (const b of o.lanes) {
    if (!b.station) continue;
    const x = u.find((S) => S.options.id === F(b.id));
    x.relationships.associations = b.station.next.map((S) => ({ id: b.id + "-to-" + S, parentId: x.options.id, childId: F(S), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), x.options.text = b.label + `
` + b.station.outcome, x.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const b = new Map(u.map((x) => [x.options.id, x]));
    for (const x of o.cards)
      for (const S of x.dependsOn ?? []) {
        const $ = q(S), L = q(x.id);
        b.get($).relationships.associations.push({
          id: `dependency-${S.length}-${S}-${x.id}`,
          parentId: $,
          childId: L,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: u };
}
const bn = {
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
}, le = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], ue = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function vn() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: le.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: le.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function In() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...ue.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function fe(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...ue.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => le.some((r) => r.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Ve(e, n, o) {
  const t = fe(e), r = e.cards.find((a) => a.id === n);
  if (!t || !r || r.laneId === o) return null;
  let i = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const a = e.cards.find((u) => u.laneId === o);
    if (a) {
      if (!ee(e, a).some((u) => u.id === "interviews")) return null;
      i = se(e, a.id, "interviews");
    }
  }
  return ee(i, r).some((a) => a.id === o) ? se(i, n, o) : null;
}
function Je(e, n) {
  if (fe(e) !== "experiment-budget") return null;
  const o = ue.find((i) => i.id === n), t = e.cards.filter((i) => i.laneId === n).length, r = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? r + " " + (r === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  yn as addWorkshopBranch,
  mn as addWorkshopCard,
  wn as addWorkshopLane,
  cn as attachWorkshop,
  ee as availableLanes,
  Me as canHangPanel,
  ue as channels,
  In as createBudgetWorkshop,
  vn as createInterviewWorkshop,
  pn as createLaneWorkshop,
  gn as createWorkshopMap,
  hn as decodeWorkshopFragment,
  dn as describeFocusDarkroom,
  fn as encodeWorkshopFragment,
  Xe as handoffSummary,
  sn as hangGalleryPanel,
  bn as industrialWorkshop,
  ln as initialFocusDarkroom,
  le as interviews,
  X as laneColors,
  _ as listeningRoom,
  nn as listeningRoomCaption,
  qe as maxWorkshopCards,
  on as moonGallery,
  se as moveWorkshopCard,
  kn as nightTransfer,
  an as normalizeFocusDarkroom,
  en as normalizeListeningRoom,
  rn as normalizeMoonGallery,
  Ze as normalizeOfflineHandoff,
  Qe as offlineHandoff,
  Ve as planStartupMove,
  ke as printFields,
  J as releaseLoad,
  tn as releasePlan,
  _e as resolveHandoff,
  Ue as resolveWorkshopSignals,
  Ye as reviewHandoff,
  fe as startupExperienceKind,
  R as validateWorkshop,
  Je as workshopBudgetResult,
  ne as workshopCandidate,
  we as workshopDestinations,
  Z as workshopLaneCaption,
  de as workshopLayout,
  Q as workshopNodeIds,
  Se as workshopPositions,
  Ie as workshopPresentationLanes,
  un as workshopPresentationScenes,
  me as workshopRefusal,
  ae as workshopToSlate
};
