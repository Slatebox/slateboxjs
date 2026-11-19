const Ke = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Ve(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: r, fieldNote: s, deskNote: a, fallback: d } = e, l = (f) => typeof f == "string" && f.trim().length > 0 && f.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(f);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? r !== "field" && r !== "desk" : r !== null) || r === void 0 || !l(s) || !l(a) || !l(d) ? null : { kind: n, version: o, stage: t, choice: r, fieldNote: s.trim(), deskNote: a.trim(), fallback: d.trim() };
}
function Je(e) {
  return { ...e, stage: "review", choice: null };
}
function Qe(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Ze(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Z = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function Ye(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: r, rightLabel: s } = e, a = (d) => typeof d == "string" && d.trim().length > 0 && d.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(d);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !a(r) || !a(s) ? null : { kind: n, version: o, mix: t, leftLabel: r.trim(), rightLabel: s.trim() };
}
function _e({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === Z.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === Z.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === Z.leftLabel && o === Z.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function j(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function $e(e) {
  const n = new Map(e.cards.map((a) => [a.id, a])), o = new Map(e.lanes.map((a, d) => [a.id, d])), t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  function s(a) {
    if (!t.has(a.id)) {
      if (r.has(a.id)) throw new Error("Release dependencies must be acyclic.");
      r.add(a.id);
      for (const d of a.dependsOn ?? []) {
        const l = n.get(d);
        if (!l) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(l.laneId) > o.get(a.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(l);
      }
      r.delete(a.id), t.add(a.id);
    }
  }
  for (const a of e.cards) s(a);
  for (const a of e.lanes) {
    if (a.station) throw new Error("Release windows cannot also be map stations.");
    if (j(e, a.id) > (a.capacity ?? 1 / 0)) throw new Error(`Release "${a.label}" exceeds its point budget.`);
  }
}
function ee(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((h, I) => [h.id, I])), r = t.get(o);
  if (r === void 0) return null;
  const s = r < t.get(n.laneId), a = /* @__PURE__ */ new Set([n.id]), d = [n];
  for (; d.length; ) {
    const h = d.pop();
    for (const I of e.cards) {
      if (a.has(I.id)) continue;
      const b = t.get(I.laneId);
      (s ? b > r && h.dependsOn?.includes(I.id) : b < r && I.dependsOn?.includes(h.id)) && (a.add(I.id), d.push(I));
    }
  }
  if (e.cards.filter((h) => a.has(h.id)).some((h) => h.allowedLaneIds && !h.allowedLaneIds.includes(o))) return null;
  const f = { ...e, cards: e.cards.map((h) => a.has(h.id) ? { ...h, laneId: o } : h) }, c = e.lanes[r].capacity;
  return c !== void 0 && j(f, o) > c ? null : f;
}
const Xe = {
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
}, en = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function nn(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const s of n.panels) {
    if (!s || typeof s.id != "string" || !/^[a-z][\w-]{0,31}$/.test(s.id) || typeof s.label != "string" || !s.label.trim() || s.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(s.artwork) || !(s.after === null || typeof s.after == "string")) return null;
    o.push({ id: s.id, label: s.label.trim(), artwork: s.artwork, after: s.after });
  }
  const t = new Map(o.map((s) => [s.id, s])), r = [...new Set(n.hung)];
  if (t.size !== o.length || r.length !== n.hung.length || r.some((s) => !t.has(s))) return null;
  for (const s of o) {
    const a = /* @__PURE__ */ new Set([s.id]);
    let d = s.after;
    for (; d !== null; ) {
      if (a.has(d) || !t.has(d) || r.includes(s.id) && !r.includes(d)) return null;
      a.add(d), d = t.get(d).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: r };
}
function Ae(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function tn(e, n) {
  return Ae(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const me = ["firstPrint", "secondPrint", "thirdPrint"], ge = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function on(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...ge, route: n.route };
  for (const t of me) {
    const r = n[t];
    if (typeof r != "string" || !r.trim() || r.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = r.trim();
  }
  return o;
}
function rn(e = new URLSearchParams()) {
  const n = { ...ge };
  for (const t of me) {
    const r = e.get(t)?.trim();
    r && r.length <= 48 && (n[t] = r);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function sn(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function Le(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = Me(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), n;
}
function Te(e) {
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
function Me(e) {
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
const We = "#1f7a5c", Ne = "#5b9a85", fe = "#c2410c", Oe = { canMove: !1, canSelect: !1 };
function D(e) {
  const n = /^(lane|card|caption|column|image)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function an(e, n, o = {}) {
  let t = O(n), r = null, s = !!o.readOnly, a = !1;
  const d = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
  let c = null, h = null, I = null, b = Promise.resolve(), x = null;
  const E = o.origin ? { x: o.origin.x, y: o.origin.y } : He(e), M = ze(t);
  for (const p of e.nodes.allNodes)
    if (M.has(p.id))
      throw new Error(`This slate already has a note named "${p.id}". A workshop draws its own lane and card notes.`);
  const A = {
    governs(p) {
      if (d.get(p.id) !== p) return null;
      const w = D(p.id)?.kind;
      return w === "card" ? { canMove: !s, canEditText: !s && !r && t.kind !== "release-plan" } : w === "lane" ? { canMove: !1, canEditText: !s && !r } : Oe;
    },
    onStart(p, w) {
      const k = D(p.id).key;
      if (s || r || !t.cards.some((m) => m.id === k)) return !1;
      T(), L();
      const y = { x: w.x - (p.options.x ?? 0), y: w.y - (p.options.y ?? 0) };
      let i = null;
      try {
        i = o.chooseCandidate?.(t, k, y) ?? null;
      } catch (m) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", m);
      }
      return c = { cardId: k, evaluate: i, outcome: { kind: "home" } }, P(t, { skip: k }), !0;
    },
    onMove(p, w) {
      if (!c) return;
      const k = v(c.cardId, w, c.evaluate);
      if (Re(k, c.outcome)) return;
      c.outcome = k;
      const y = k.kind === "candidate" ? k.next : null;
      P(y ?? t, { skip: c.cardId }), o.onPreview?.(y);
    },
    onEnd(p, w) {
      if (!c) return { accept: !1 };
      const { cardId: k, evaluate: y } = c, i = v(k, w, y), m = t.cards.find((u) => u.id === k);
      if (c = null, o.onPreview?.(null), i.kind === "candidate") {
        t = i.next, P(t, { skip: k });
        const u = t.lanes.find((S) => S.id === i.laneId);
        e.announce?.(`${m.label} moved to ${u.label}. ${J(t, u.id)}.`), o.onChange?.(t, { cardId: k, laneId: i.laneId });
        const g = Ce(t, p.id);
        return g ? { accept: !0, settle: g } : { accept: !0 };
      }
      return i.kind === "refused" ? z(m.label, { cardId: k, laneId: i.laneId, reason: i.reason }) : (P(t, { skip: k }), i.kind === "outside" && (e.announce?.(`${m.label} was not dropped on a lane. It stays where it was.`), o.onRefuse?.({ cardId: k, laneId: null, reason: "" }))), { accept: !1 };
    },
    onCancel(p) {
      const w = c && t.cards.find((k) => k.id === c.cardId);
      c = null, o.onPreview?.(null), P(t, { skip: p.id.replace(/^card-/, "") }), w && e.announce?.(`Move cancelled. ${w.label} stays where it was.`);
    },
    onTextCommit(p, w, k) {
      const y = D(p.id);
      if (!y || s || r) return !1;
      const i = w.replace(/\s+/g, " ").trim(), m = y.kind === "lane" ? { laneId: y.key, label: i } : { cardId: y.key, label: i };
      let u;
      try {
        u = O(y.kind === "lane" ? { ...t, lanes: t.lanes.map((g) => g.id === y.key ? { ...g, label: i } : g) } : { ...t, cards: t.cards.map((g) => g.id === y.key ? { ...g, label: i } : g) });
      } catch (g) {
        const S = g instanceof Error ? g.message : "That name is not allowed.";
        return e.announce?.(`${k} keeps its name. ${S}`), o.onRefuse?.({ ...y.kind === "lane" ? { laneId: y.key } : { cardId: y.key }, rename: m, reason: S }), !1;
      }
      return i === k ? !1 : (t = u, P(t), e.announce?.(`${k} renamed to ${i}.`), o.onChange?.(t, { rename: m }), i);
    },
    onKeyDown(p, w) {
      const k = D(p.id);
      if (k?.kind !== "card" || s || r || c || w.ctrlKey || w.metaKey || w.altKey) return !1;
      const y = t.cards.find((i) => i.id === k.key);
      if (!y) return !1;
      if (w.key === "ArrowLeft" || w.key === "ArrowRight")
        return w.preventDefault(), C(y.id, w.key === "ArrowLeft" ? -1 : 1), !0;
      if (h?.cardId !== y.id) return !1;
      if (w.key === "Enter") {
        w.preventDefault();
        const { laneId: i, next: m } = h;
        h = null, t = m, P(t), o.onPreview?.(null);
        const u = t.lanes.find((g) => g.id === i);
        return e.announce?.(`${y.label} moved to ${u.label}. ${J(t, i)}.`), o.onChange?.(t, { cardId: y.id, laneId: i }), !0;
      }
      return w.key === "Escape" ? (w.preventDefault(), L(), e.announce?.(`Move cancelled. ${y.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      d.clear(), l.clear(), f.clear(), c = null, h = null, P(r ?? t, { animate: !1 });
    }
  }, R = e.setDragPolicy(A), W = () => {
    h && L();
  };
  e.element?.addEventListener?.("pointerdown", W, !0), P(t, { animate: !1 });
  function v(p, w, k) {
    const y = t.cards.find(($) => $.id === p);
    if (!y) return { kind: "outside" };
    const i = t.lanes.map(($) => d.get(V.column($.id))).filter(Boolean), m = e.hitTestNodes(w, i, { padding: 2 }), u = m ? D(m.id).key : null;
    if (!u) return { kind: "outside" };
    if (u === y.laneId) return { kind: "home" };
    const g = X(t, p, u);
    if (!g) return { kind: "refused", laneId: u, reason: Be(t, p, u) ?? "That move is not available." };
    if (!k) return { kind: "candidate", laneId: u, next: g };
    let S = null;
    try {
      S = k({ x: w.x - E.x, y: w.y - E.y });
    } catch ($) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", $), { kind: "candidate", laneId: u, next: g };
    }
    const F = S?.cards.find(($) => $.id === p)?.laneId;
    return !S || !F || F === y.laneId ? { kind: "home" } : { kind: "candidate", laneId: F, next: S };
  }
  function C(p, w) {
    const k = t.cards.find((g) => g.id === p), y = he(t, p), i = h?.cardId === p ? h.laneId : k.laneId, m = y[y.findIndex((g) => g.id === i) + w];
    if (T(), !m) {
      e.announce?.(`${k.label} has no lane to move to on that side.`);
      return;
    }
    if (m.id === k.laneId) {
      L(), e.announce?.(`${k.label} is back in ${m.label}.`);
      return;
    }
    const u = X(t, p, m.id);
    h = { cardId: p, laneId: m.id, next: u }, P(u), o.onPreview?.(u), e.announce?.(`${k.label} to ${m.label}: ${J(u, m.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function L() {
    h && (h = null, o.onPreview?.(null), P(r ?? t));
  }
  function z(p, w) {
    T(!1), I = { laneId: w.laneId, reason: w.reason, timer: setTimeout(() => T(), 1500) }, P(t, { skip: w.cardId });
    const k = t.lanes.find((y) => y.id === w.laneId);
    e.announce?.(`${p} can't move to ${k?.label ?? "that lane"}. ${w.reason}`), o.onRefuse?.(w);
  }
  function T(p = !0) {
    I && (clearTimeout(I.timer), I = null, p && !a && P(c && c.outcome.kind === "candidate" ? c.outcome.next : h?.next ?? r ?? t, { skip: c?.cardId }));
  }
  function K(p) {
    const w = c || h ? Math.max(...t.lanes.map((u) => t.cards.filter((g) => g.laneId === u.id).length)) : 0, k = se(p, { native: !0, origin: E, rows: w }).nodes, y = new Map(k.map((u) => [u.options.id, u.options])), i = (u, g, S, F = !1) => {
      const $ = y.get(V.column(u));
      $ && ($.borderColor = g, $.borderWidth = S, delete $.borderStyle);
      const oe = F && y.get(V.lane(u));
      oe && (oe.borderColor = g, oe.borderWidth = S);
    }, m = c?.cardId ?? h?.cardId;
    if (m) {
      const u = t.cards.find((S) => S.id === m)?.laneId;
      for (const S of he(t, m)) S.id !== u && i(S.id, Ne, 2);
      const g = c ? c.outcome : h ? { kind: "candidate", laneId: h.laneId } : null;
      g?.kind === "candidate" && i(g.laneId, We, 3, !0), g?.kind === "refused" && i(g.laneId, fe, 3);
    }
    if (I) {
      i(I.laneId, fe, 3, !0);
      const u = y.get(V.caption(I.laneId));
      u && (u.text = I.reason, u.foregroundColor = "#b42318");
    }
    return k;
  }
  function P(p, w = {}) {
    if (a) return;
    x = { model: p, skip: w.skip, animate: w.animate !== !1 };
    const k = K(p), y = [];
    for (const { options: m } of k) {
      const u = m.id;
      if (d.has(u)) continue;
      const g = e.nodes.add(Le(m));
      d.set(u, g), l.set(u, { ...m }), g.ready && y.push(g.ready.then(() => {
        if (d.get(u) !== g) return;
        g.applyGovernance?.(), D(u)?.kind === "column" && g.toBack?.(!1);
        const S = ue(x?.model ?? p, u);
        S && g.svgGroup?.node?.setAttribute("aria-label", S);
      }).catch(() => {
      }));
    }
    const i = x;
    b = Promise.all([b, ...y]).then(() => {
      a || x !== i || te(K(i.model), i);
    }).catch((m) => console.warn("WORKSHOP: could not draw the workshop", m));
  }
  function te(p, w) {
    const k = new Set(p.map((y) => y.options.id));
    e.withPolicyAuthority(() => {
      for (const [i, m] of [...d])
        if (!k.has(i)) {
          for (const [u, g] of [...f])
            g.parentId !== i && g.childId !== i || (g.parent.relationships?.removeAssociation(u), f.delete(u));
          e.deselectNode?.(m), m.editor?.cancelInline?.(), d.delete(i), l.delete(i), e.nodes.remove(i);
        }
      for (const { options: i } of p) {
        const m = i.id, u = d.get(m);
        if (!u?.svgGroup) continue;
        const g = l.get(m) ?? {}, S = u.editor?.isInlineEditing?.();
        (i.fontSize !== g.fontSize || i.foregroundColor !== g.foregroundColor) && (u.options.fontSize = i.fontSize, u.options.fontColor = i.foregroundColor, u.applyTextStyle?.()), i.text !== g.text && !S && u.setText?.(i.text), (i.width !== g.width || i.height !== g.height) && (i.vectorPath ? (u.options.width = i.width, u.options.height = i.height, u.setShape?.(u.options.shape, i.vectorPath), D(m)?.kind === "column" && u.toBack?.(!1)) : u.setSize?.(i.width, i.height)), i.backgroundColor !== g.backgroundColor && u.setColors?.(i.backgroundColor), (i.borderColor !== g.borderColor || i.borderWidth !== g.borderWidth || i.borderStyle !== g.borderStyle) && (u.options.borderColor = i.borderColor, u.options.borderWidth = i.borderWidth, u.options.borderStyle = i.borderStyle, u.applyBorder?.());
        const F = i.xPos !== g.xPos || i.yPos !== g.yPos || Math.abs((u.options.x ?? 0) - i.xPos) > 0.5 || Math.abs((u.options.y ?? 0) - i.yPos) > 0.5;
        m !== (w.skip && V.card(w.skip)) && F && u.position(i.xPos, i.yPos, void 0, void 0, w.animate ? 180 : 0);
        const $ = ue(w.model, m);
        $ && u.svgGroup.node.getAttribute("aria-label") !== $ && u.svgGroup.node.setAttribute("aria-label", $), l.set(m, { ...i });
      }
      const y = /* @__PURE__ */ new Map();
      for (const i of p) for (const m of i.relationships.associations) y.set(m.id, m);
      for (const [i, m] of [...f])
        y.has(i) && d.get(m.parentId) === m.parent && d.get(m.childId) === m.child || (m.parent.relationships?.removeAssociation(i), f.delete(i));
      for (const [i, m] of y) {
        if (f.has(i)) continue;
        const u = d.get(m.parentId), g = d.get(m.childId);
        !u?.relationships || !g?.svgGroup || (u.relationships.addAssociation(g, Te(m)), f.set(i, { parentId: m.parentId, childId: m.childId, parent: u, child: g }));
      }
    }), e.notifyNodeChanged?.();
  }
  function ue(p, w) {
    const k = D(w);
    if (k?.kind === "lane") {
      const y = p.lanes.find((i) => i.id === k.key);
      return y ? `${y.label}, ${J(p, y.id)}` : null;
    }
    if (k?.kind === "card") {
      const y = p.cards.find((m) => m.id === k.key), i = y && p.lanes.find((m) => m.id === y.laneId);
      return y && i ? `${y.label}, in ${i.label}` : null;
    }
    return null;
  }
  function Ce(p, w) {
    const k = se(p, { native: !0, origin: E }).nodes.find((y) => y.options.id === w)?.options;
    return k ? { x: k.xPos, y: k.yPos } : null;
  }
  function Q() {
    c && e.cancelGovernedDrag?.("host"), c = null, h && (h = null, o.onPreview?.(null)), T(!1);
  }
  return {
    get value() {
      return t;
    },
    get origin() {
      return { ...E };
    },
    whenDrawn: () => b,
    update(p) {
      if (a) throw new Error("This workshop has been detached.");
      const w = O(p);
      Q(), t = w, P(r ?? t);
    },
    preview(p) {
      if (a) throw new Error("This workshop has been detached.");
      const w = p ? O(p) : null;
      Q(), r = w, P(r ?? t), e.refreshGovernance?.();
    },
    refuse(p, w) {
      const k = t.lanes.find((y) => y.id === p);
      a || !k || (T(!1), I = { laneId: p, reason: w, timer: setTimeout(() => T(), 1500) }, P(r ?? t), e.announce?.(`${k.label}: ${w}`));
    },
    setReadOnly(p) {
      a || s === !!p || (Q(), s = !!p, P(r ?? t), e.refreshGovernance?.());
    },
    destroy() {
      a || (Q(), a = !0, e.element?.removeEventListener?.("pointerdown", W, !0), e.withPolicyAuthority(() => {
        for (const [p, w] of f) w.parent.relationships?.removeAssociation(p);
        for (const [p, w] of d)
          e.deselectNode?.(w), w.editor?.cancelInline?.(), e.nodes.one(p) === w && e.nodes.remove(p);
      }), f.clear(), d.clear(), l.clear(), R(), e.notifyNodeChanged?.());
    }
  };
}
function Re(e, n) {
  return e.kind === n.kind && e.laneId === n.laneId;
}
function ze(e) {
  return new Set(se(e, { native: !0 }).nodes.map((n) => n.options.id));
}
function He(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const r of n)
    o = Math.max(o, (r.options.x ?? 0) + (r.options.width ?? 0)), t = Math.min(t, r.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
function q(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function N(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function ye(e) {
  const n = q(e);
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
function H(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
function U(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function ke({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((r) => r.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function Ge(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const G = (e) => "lane-" + e, B = (e) => "card-" + e, ne = (e) => "image-" + e;
function ln(e) {
  const n = Ge(e);
  return ke(e).map((o) => {
    const t = e.cards.filter((a) => a.laneId === o.id), r = n.filter((a) => a.laneId === o.id), s = [G(o.id)];
    return o.station?.image && s.push(ne(o.id)), { lane: o, cards: t, signals: r, nodeIds: [...s, ...t.map((a) => B(a.id))] };
  });
}
const be = 5, De = 24, re = 3;
function O(e) {
  const n = q(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan") throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = N(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > be)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(n.cards) || n.cards.length > De)
    throw new Error("A workshop supports up to 24 cards.");
  const r = n.lanes.map((l) => {
    const f = q(l), c = { id: H(f.id), label: N(f.label) };
    if (f.capacity !== void 0) {
      const h = o ? 576 : 24;
      if (typeof f.capacity != "number" || !Number.isInteger(f.capacity) || f.capacity < 1 || f.capacity > h)
        throw new Error(`Lane capacity must be a whole number from 1 to ${h}.`);
      c.capacity = f.capacity;
    }
    if (f.station !== void 0) {
      const h = q(f.station), I = (x) => {
        if (typeof x != "number" || !Number.isInteger(x) || x < 0 || x >= re)
          throw new Error("Use map coordinates from 0 to 2.");
        return x;
      };
      if (!Array.isArray(h.next) || h.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const b = h.next.map(H);
      U(b, "onward stop"), c.station = { column: I(h.column), row: I(h.row), next: b, outcome: N(h.outcome, 160) }, h.image !== void 0 && (c.station.image = ye(h.image));
    }
    return c;
  }), s = r.map((l) => l.id);
  if (U(s, "lane ID"), (o || r.some((l) => l.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (r.some((l) => l.station)) {
    if (!r.every((l) => l.station)) throw new Error("Give every station on the map a position.");
    U(r.map((l) => l.station.column + "," + l.station.row), "map position");
    for (const l of r)
      if (l.station.next.some((f) => f === l.id || !s.includes(f))) throw new Error("Connect each stop to another station on this map.");
  }
  const a = n.cards.map((l) => {
    const f = q(l), c = { id: H(f.id), label: N(f.label), laneId: H(f.laneId) };
    if (!s.includes(c.laneId)) throw new Error("Card refers to an unknown lane.");
    if (f.allowedLaneIds !== void 0) {
      if (!Array.isArray(f.allowedLaneIds) || f.allowedLaneIds.length > r.length) throw new Error("Invalid allowed lanes.");
      if (c.allowedLaneIds = f.allowedLaneIds.map(H), U(c.allowedLaneIds, "allowed lane"), !c.allowedLaneIds.includes(c.laneId) || !c.allowedLaneIds.every((h) => s.includes(h)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (o) {
      if (typeof f.points != "number" || !Number.isInteger(f.points) || f.points < 1 || f.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (c.points = f.points, f.dependsOn !== void 0) {
        if (!Array.isArray(f.dependsOn) || f.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        c.dependsOn = f.dependsOn.map(H), U(c.dependsOn, "dependency");
      }
    }
    return c;
  });
  U(a.map((l) => l.id), "card ID");
  const d = { version: 1, title: t, lanes: r, cards: a };
  if (n.experience !== void 0) {
    const l = q(n.experience);
    if (l.version !== 1 || l.kind !== "customer-interviews" && l.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    d.experience = { version: 1, kind: l.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    d.signals = n.signals.map((l) => {
      const f = q(l), c = H(f.cardId), h = H(f.laneId);
      if (!a.some((I) => I.id === c) || !s.includes(h))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: H(f.id),
        label: N(f.label),
        cardId: c,
        laneId: h,
        whenPresent: N(f.whenPresent, 160),
        whenAbsent: N(f.whenAbsent, 160)
      };
    }), U(d.signals.map((l) => l.id), "placement outcome ID");
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    d.presentationOrder = ke({ lanes: r, presentationOrder: n.presentationOrder }).map((l) => l.id);
  }
  if (o)
    return d.kind = "release-plan", $e(d), d;
  for (const l of r)
    if (a.filter((f) => f.laneId === l.id).length > (l.capacity ?? 1 / 0))
      throw new Error(`Lane "${l.label}" exceeds its capacity.`);
  return d;
}
const ve = 65536;
function dn(e) {
  const n = JSON.stringify(O(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > ve) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function cn(e) {
  if (e.length > ve) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return O(t);
}
function _(e, n) {
  if (e.kind === "release-plan") return e.lanes.filter((t) => ee(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((r) => r.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function ie(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  if (t && e.kind === "release-plan") {
    const r = ee(e, t, o);
    if (!r) throw new Error("Move is unavailable.");
    return r;
  }
  if (!t || !_(e, t).some((r) => r.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((r) => r === t ? { ...t, laneId: o } : r) };
}
function X(e, n, o) {
  const t = e.cards.find((r) => r.id === n);
  return !t || !e.lanes.some((r) => r.id === o) ? null : t.laneId === o ? e : e.kind === "release-plan" ? ee(e, t, o) : qe(e, n, o) ?? (_(e, t).some((r) => r.id === o) ? ie(e, n, o) : null);
}
function he(e, n) {
  return e.lanes.filter((o) => X(e, n, o.id) !== null);
}
function Be(e, n, o) {
  if (X(e, n, o) !== null) return null;
  const t = e.cards.find((l) => l.id === n), r = e.lanes.find((l) => l.id === o);
  if (!t || !r) return "That move is not available.";
  const s = `This card can't go in ${r.label}.`;
  if (t.allowedLaneIds && !t.allowedLaneIds.includes(o)) return s;
  if (e.kind === "release-plan") {
    if (r.capacity === void 0) return s;
    const l = j(e, o), f = { ...e, lanes: e.lanes.map((h) => h === r ? { id: r.id, label: r.label } : h) }, c = ee(f, t, o);
    return c ? `Needs ${j(c, o) - l} points. Now holds ${l} of ${r.capacity} points.` : s;
  }
  const a = e.lanes.find((l) => l.id === t.laneId);
  if (a?.station && !a.station.next.includes(o)) return `${r.label} can't be reached from ${a.label}.`;
  const d = e.cards.filter((l) => l.laneId === o).length;
  return r.capacity !== void 0 && d >= r.capacity ? `Now holds ${d} of ${r.capacity} ${r.capacity === 1 ? "card" : "cards"}.` : s;
}
function J(e, n) {
  const o = e.lanes.find((s) => s.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const s = j(e, n);
    return o.capacity ? s + " / " + o.capacity + " points" : s + " points";
  }
  const t = je(e, n);
  if (t) return "$" + t.amount + " · " + t.description;
  const r = e.cards.filter((s) => s.laneId === n).length;
  return o.capacity !== void 0 ? r + " of " + o.capacity : r + (r === 1 ? " card" : " cards");
}
const le = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, Y = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Ie(e, n = le, o = 28) {
  const { pitch: t, row: r, top: s } = n, a = !!e.lanes[0].station, d = e.lanes.map((c) => e.cards.filter((h) => h.laneId === c.id).length), l = s + Math.max(1, ...d) * r + 36, f = e.lanes.map((c, h) => ({
    x: a ? c.station.column * (t + o) : h * t,
    y: a ? c.station.row * l : 0
  }));
  return {
    points: f,
    width: Math.max(...f.map((c) => c.x)) + t,
    height: Math.max(...f.map((c, h) => c.y + s + (a ? Math.max(1, d[h]) : d[h] + 1) * r))
  };
}
function un() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function de(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((r) => r.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function xe(e) {
  const n = O(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function fn(e, n) {
  const o = xe(e), t = de(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), O(o);
}
function hn(e, n, o) {
  const t = xe(e);
  return t.cards.push({
    id: de(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), O(t);
}
function pn() {
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
function wn(e, n, o) {
  const t = O(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const r = t.lanes.find((c) => c.id === n);
  if (!r?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= be) throw new Error("A map can have up to five stations.");
  const s = N(o?.label), a = N(o?.outcome, 160), d = de(t, "station");
  let l, f = 1 / 0;
  for (let c = 0; c < re; c++)
    for (let h = 0; h < re; h++) {
      if (t.lanes.some((b) => b.station.column === h && b.station.row === c)) continue;
      const I = Math.abs(r.station.column - h) + Math.abs(r.station.row - c);
      I < f && (f = I, l = { column: h, row: c });
    }
  if (!l) throw new Error("There is no free station position.");
  return r.station.next.push(d), t.lanes.push({ id: d, label: s, station: { ...l, next: [], outcome: a, ...o.image === void 0 ? {} : { image: ye(o.image) } } }), t.presentationOrder?.push(d), t;
}
const mn = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Pe = (e) => "caption-" + e, Ee = (e) => "column-" + e, V = { lane: G, card: B, image: ne, caption: Pe, column: Ee };
function pe(e, n, o) {
  const t = Math.min(o, e / 2, n / 2), r = e, s = n;
  return `M ${t} 0 H ${r - t} Q ${r} 0 ${r} ${t} V ${s - t} Q ${r} ${s} ${r - t} ${s} H ${t} Q 0 ${s} 0 ${s - t} V ${t} Q 0 0 ${t} 0 Z`;
}
function we(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function Fe(e) {
  return e.length <= 22 ? 17 : e.length <= 52 ? 14 : 12;
}
function Ue(e, n, o = 0) {
  const { pitch: t, width: r, row: s, height: a, top: d } = le, l = !!e.lanes[0].station, { points: f } = Ie(e), c = e.lanes.map((v) => e.cards.filter((C) => C.laneId === v.id).length), h = 152, I = h + 12, b = e.lanes.some((v) => v.station?.image), x = d + (Math.max(o, ...c) + 1) * s, E = "#18302d", M = "#667872", A = [], R = (v) => {
    const C = { options: {
      shapeHint: "rectangle",
      vectorPath: pe(v.width, v.height, 12),
      foregroundColor: E,
      borderColor: M,
      borderWidth: 1,
      ...v
    }, relationships: { associations: [] } };
    return A.push(C), C;
  };
  e.lanes.forEach((v, C) => {
    const L = n.x + f[C].x, z = n.y + f[C].y + (b ? (v.station?.row ?? 0) * I : 0), T = v.station?.image, K = l ? d + (T ? I : 0) + Math.max(1, c[C]) * s : x;
    R({
      id: Ee(v.id),
      text: "",
      name: v.label,
      xPos: L + 2,
      yPos: z,
      width: t - 4,
      height: K,
      vectorPath: pe(t - 4, K, 14),
      backgroundColor: l ? "#fcf9ed" : we(Y[C], 0.6),
      borderColor: l ? "#a8b5aa" : we(Y[C], 0.1),
      ...l ? { borderStyle: "dashed" } : {}
    }), R({
      id: G(v.id),
      text: v.label,
      name: v.label,
      xPos: L + 8,
      yPos: z + 6,
      width: r,
      height: 58,
      backgroundColor: Y[C],
      fontSize: Fe(v.label)
    }), R({
      id: Pe(v.id),
      text: J(e, v.id),
      name: v.label,
      xPos: L + 8,
      yPos: z + 66,
      width: r,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      foregroundColor: "#3f5750",
      fontSize: 13
    }), T && A.push({ options: {
      id: ne(v.id),
      name: T.alt,
      text: "",
      xPos: L + 8,
      yPos: z + d,
      width: r,
      height: h,
      shapeHint: "rectangle",
      image: T.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((P) => P.laneId === v.id).forEach((P, te) => R({
      id: B(P.id),
      text: e.kind === "release-plan" ? P.label + `
` + P.points + " points" : P.label,
      name: P.label,
      xPos: L + (l ? 18 : 8),
      yPos: z + d + (T ? I : 0) + te * s,
      width: l ? r - 20 : r,
      height: l ? a - 6 : a,
      backgroundColor: l ? "#ffda75" : "#fffdf6",
      fontSize: 15
    }));
  });
  const W = new Map(A.map((v) => [v.options.id, v]));
  for (const v of e.lanes)
    v.station && (W.get(G(v.id)).relationships.associations = v.station.next.map((C) => ({
      id: v.id + "-to-" + C,
      parentId: G(v.id),
      childId: G(C),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const v of e.cards)
      for (const C of v.dependsOn ?? []) {
        const L = B(C), z = B(v.id);
        W.get(L).relationships.associations.push({
          id: `dependency-${C.length}-${C}-${v.id}`,
          parentId: L,
          childId: z,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  return { options: { name: e.title }, shareId: "", nodes: A };
}
function se(e, n) {
  const o = O(e);
  if (n?.native) return Ue(o, n.origin ?? { x: 0, y: 0 }, n.rows);
  const { width: t, row: r, height: s, top: a } = le, d = [];
  function l(b, x, E, M, A, R) {
    d.push({ options: {
      id: b,
      text: x,
      name: x,
      xPos: E,
      yPos: M,
      width: t,
      height: A,
      shapeHint: "rectangle",
      backgroundColor: R,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: f } = Ie(o), c = 152, h = c + 12, I = o.lanes.some((b) => b.station?.image);
  o.lanes.forEach((b, x) => {
    const E = f[x].x, M = f[x].y + (I ? (b.station?.row ?? 0) * h : 0), A = b.station?.image, R = o.kind === "release-plan" ? b.label + `
` + (b.capacity ? j(o, b.id) + " / " + b.capacity + " points" : j(o, b.id) + " points") : b.label;
    l(G(b.id), R, E, M, a - 12, Y[x]), A && d.push({ options: {
      id: ne(b.id),
      name: A.alt,
      text: "",
      xPos: E,
      yPos: M + a,
      width: t,
      height: c,
      shapeHint: "rectangle",
      image: A.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((W) => W.laneId === b.id).forEach((W, v) => l(B(W.id), o.kind === "release-plan" ? W.label + `
` + W.points + " points" : W.label, E, M + a + (A ? h : 0) + v * r, s, "#fffdf6"));
  });
  for (const b of o.lanes) {
    if (!b.station) continue;
    const x = d.find((E) => E.options.id === G(b.id));
    x.relationships.associations = b.station.next.map((E) => ({ id: b.id + "-to-" + E, parentId: x.options.id, childId: G(E), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), x.options.text = b.label + `
` + b.station.outcome, x.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const b = new Map(d.map((x) => [x.options.id, x]));
    for (const x of o.cards)
      for (const E of x.dependsOn ?? []) {
        const M = B(E), A = B(x.id);
        b.get(M).relationships.associations.push({
          id: `dependency-${E.length}-${E}-${x.id}`,
          parentId: M,
          childId: A,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: d };
}
const gn = {
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
}, ae = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], ce = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function yn() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: ae.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: ae.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function kn() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...ce.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Se(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...ce.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => ae.some((r) => r.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function qe(e, n, o) {
  const t = Se(e), r = e.cards.find((a) => a.id === n);
  if (!t || !r || r.laneId === o) return null;
  let s = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const a = e.cards.find((d) => d.laneId === o);
    if (a) {
      if (!_(e, a).some((d) => d.id === "interviews")) return null;
      s = ie(e, a.id, "interviews");
    }
  }
  return _(s, r).some((a) => a.id === o) ? ie(s, n, o) : null;
}
function je(e, n) {
  if (Se(e) !== "experiment-budget") return null;
  const o = ce.find((s) => s.id === n), t = e.cards.filter((s) => s.laneId === n).length, r = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? r + " " + (r === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  wn as addWorkshopBranch,
  hn as addWorkshopCard,
  fn as addWorkshopLane,
  an as attachWorkshop,
  _ as availableLanes,
  Ae as canHangPanel,
  ce as channels,
  kn as createBudgetWorkshop,
  yn as createInterviewWorkshop,
  un as createLaneWorkshop,
  pn as createWorkshopMap,
  cn as decodeWorkshopFragment,
  sn as describeFocusDarkroom,
  dn as encodeWorkshopFragment,
  Ze as handoffSummary,
  tn as hangGalleryPanel,
  gn as industrialWorkshop,
  rn as initialFocusDarkroom,
  ae as interviews,
  Y as laneColors,
  Z as listeningRoom,
  _e as listeningRoomCaption,
  De as maxWorkshopCards,
  en as moonGallery,
  ie as moveWorkshopCard,
  mn as nightTransfer,
  on as normalizeFocusDarkroom,
  Ye as normalizeListeningRoom,
  nn as normalizeMoonGallery,
  Ve as normalizeOfflineHandoff,
  Ke as offlineHandoff,
  qe as planStartupMove,
  me as printFields,
  j as releaseLoad,
  Xe as releasePlan,
  Qe as resolveHandoff,
  Ge as resolveWorkshopSignals,
  Je as reviewHandoff,
  Se as startupExperienceKind,
  O as validateWorkshop,
  je as workshopBudgetResult,
  X as workshopCandidate,
  he as workshopDestinations,
  J as workshopLaneCaption,
  le as workshopLayout,
  V as workshopNodeIds,
  Ie as workshopPositions,
  ke as workshopPresentationLanes,
  ln as workshopPresentationScenes,
  Be as workshopRefusal,
  se as workshopToSlate
};
