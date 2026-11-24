const vn = 3e3;
function fn(e) {
  return e.origin === "invited" && e.invitedBy ? "added by " + tt(e.invitedBy) : e.origin === "visiting" && e.via ? "via " + tt(e.via) : "";
}
function on(e, o = 56) {
  const i = tt(e.label), y = fn(e), f = e.origin === "visiting" && e.via && i.endsWith("· " + tt(e.via));
  return nt(y && !f && !i.includes(y) ? i + " · " + y : i, o);
}
function dn(e) {
  if (typeof e != "string" || e.length > 2e5) return null;
  if (/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(e)) return e;
  try {
    const o = new URL(e);
    return o.protocol === "https:" ? o.href : null;
  } catch {
    return null;
  }
}
function Zt(e, o) {
  const i = tt(e.say ?? ""), y = at(e.sayAt ?? null);
  return !i || y === null || o < y || o >= y + 3e3 ? null : i;
}
const Q = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), sn = 6e3, rn = 600, an = 6, un = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" };
function at(e) {
  if (e == null) return null;
  const o = e instanceof Date ? e.getTime() : typeof e == "number" ? e : Date.parse(e);
  return Number.isFinite(o) ? o : null;
}
const nt = (e, o) => e.length > o ? e.slice(0, o - 1).trimEnd() + "…" : e, tt = (e) => String(e ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function cn(e) {
  const o = e.plan?.steps ?? [];
  if (o.length) {
    const y = o.findIndex((r) => r.status === "doing"), f = o.findIndex((r) => r.status === "stopped");
    if (f >= 0) return "Stopped: " + tt(o[f].text);
    if (o.every((r) => r.status === "done" || r.status === "skipped")) return "Done";
    const h = y >= 0 ? y : Math.min(Math.max(e.plan.current ?? 0, 0), o.length - 1);
    return tt(o[h].text);
  }
  return tt(e.message ?? "") || null;
}
function Vt(e) {
  return (e.plan?.steps ?? []).map((o) => un[o.status] + " " + (o.status === "stopped" ? "Stopped: " : "") + tt(o.text));
}
function qt(e, o, { holdMs: i = sn, fadeMs: y = rn, max: f = an } = {}) {
  const h = [];
  for (const r of e) {
    if (!r || typeof r.agentKey != "string") continue;
    const x = at(r.expiresAt), E = at(r.endedAt);
    if (r.status === "live" && E === null) {
      if (x === null || o >= x) continue;
      h.push({ record: r, opacity: 1, until: x });
      continue;
    }
    const N = (E ?? at(r.updatedAt) ?? o) + i;
    o >= N + y || h.push({ record: r, opacity: o <= N ? 1 : 1 - (o - N) / y, until: N + y });
  }
  return h.sort((r, x) => (at(x.record.updatedAt) ?? 0) - (at(r.record.updatedAt) ?? 0)), h.slice(0, f);
}
function hn(e) {
  const { xPos: o, yPos: i, ...y } = e;
  return { ...y, x: Number(o ?? e.x) || 0, y: Number(i ?? e.y) || 0 };
}
const gn = "ghost-", St = (e) => gn + e;
function Gt(e) {
  const o = [];
  for (const i of Array.isArray(e) ? e : [])
    if (!(!i || typeof i.actionId != "string"))
      for (const y of Array.isArray(i.items) ? i.items : [])
        y && y.state === "pending" && typeof y.id == "string" && o.push({ action: i, item: y });
  return o;
}
const yn = Object.freeze({
  canMove: !1,
  canResize: !1,
  canRotate: !1,
  canDelete: !1,
  canDuplicate: !1,
  canConnect: !1,
  canEditText: !1,
  canSelect: !1,
  persist: !1,
  exportable: !1
}), Ut = "Roboto, Helvetica, Arial, sans-serif", Jt = "#b91c1c";
function Qt(e, o) {
  const i = e.x + e.w / 2, y = e.y + e.h / 2, f = o.x + o.w / 2 - i, h = o.y + o.h / 2 - y;
  if (!f && !h) return { x: i, y };
  const r = f ? e.w / 2 / Math.abs(f) : 1 / 0, x = h ? e.h / 2 / Math.abs(h) : 1 / 0, E = Math.min(r, x, 1);
  return { x: i + f * E, y: y + h * E };
}
function tn(e) {
  const o = e.changes || {};
  if (typeof o.text == "string") return "Suggests: “" + nt(tt(o.text), 48) + "”";
  const i = Object.keys(o), y = i.some((h) => ["xPos", "yPos", "x", "y"].includes(h)), f = i.some((h) => ["width", "height"].includes(h));
  return y && i.every((h) => ["xPos", "yPos", "x", "y"].includes(h)) ? "Suggests moving it here" : f && i.every((h) => ["width", "height"].includes(h)) ? "Suggests resizing it" : "Suggests restyling it";
}
function kn(e, o = {}) {
  const i = e?.v2 && typeof e.v2.canvas?.group == "function" ? e.v2 : e, y = o.toNode ?? hn, f = () => o.canAct ? !!o.canAct() : !1;
  let h = [], r = null, x = !1, E = "";
  const O = /* @__PURE__ */ new Map();
  let N = [];
  const W = typeof i.setDragPolicy == "function" ? i.setDragPolicy({
    governs: (d) => typeof d?.id == "string" && O.has(d.id) ? yn : null,
    onEnd: () => ({ accept: !1 }),
    // A load from the room replaced every note, the ghosts too: draw them again.
    onNotesReplaced() {
      O.clear(), vt();
    }
  }) : () => {
  }, yt = (d) => typeof i.withPolicyAuthority == "function" ? i.withPolicyAuthority(d) : d();
  function ft() {
    return r && r.node?.isConnected !== !1 && r.node?.parentNode || (r = i.canvas.group(), r.attr({ "data-agent-suggestions": "", "data-export-never": "" })), r;
  }
  function Nt() {
    try {
      const d = i.canvas.viewbox(), a = i.canvas.node?.getBoundingClientRect?.();
      if (d?.width && a?.width) return a.width / d.width;
    } catch {
    }
    try {
      const d = i.getZoom?.();
      if (typeof d == "number" && d > 0) return d;
    } catch {
    }
    return 1;
  }
  const st = (d) => d ? i.nodes?.one?.(d) : void 0;
  function dt(d) {
    const a = d?.options;
    return !a || ![a.x, a.y, a.width, a.height].every((p) => typeof p == "number" && Number.isFinite(p)) ? null : { x: a.x, y: a.y, w: a.width, h: a.height };
  }
  const pt = (d) => d ? dt(st(d)) ?? dt(st(St(d))) : null, Ot = (d) => Q[(Number(d.colorIndex) % Q.length + Q.length) % Q.length] || Q[0], Tt = (d) => on(d);
  function Lt() {
    const d = /* @__PURE__ */ new Map();
    for (const { action: a, item: p } of Gt(h))
      p.kind === "add" && p.nodeId && p.node?.options && d.set(St(p.nodeId), { item: p, action: a });
    yt(() => {
      for (const [a, p] of O) {
        const L = d.get(a);
        L && JSON.stringify(L.item.node) === p.json && i.nodes?.one?.(a) === p.node || (i.nodes?.one?.(a) === p.node && i.nodes.remove(a), O.delete(a));
      }
      for (const [a, { item: p, action: L }] of d) {
        if (O.has(a) || p.nodeId && st(p.nodeId)) continue;
        const G = { ...p.node.options, id: a };
        let F;
        try {
          F = i.nodes.add(y(G));
        } catch {
          continue;
        }
        O.set(a, { node: F, json: JSON.stringify(p.node) }), Promise.resolve(F?.ready).then(() => {
          if (x || O.get(a)?.node !== F) return;
          F.applyGovernance?.();
          const X = F.svgGroup?.node;
          X && (X.style.opacity = "0.72", X.style.pointerEvents = "none", X.setAttribute("data-agent-ghost", p.nodeId || ""), X.setAttribute("aria-label", "Suggested by " + Tt(L) + ", not kept yet: " + tt(p.node?.options?.text ?? "")), bt(!0));
        }).catch(() => {
        });
      }
    });
  }
  function Dt(d, a, p, L, G, F, X) {
    const P = Math.round(18 + 6.8 * p.length), g = d.group().attr({
      role: "button",
      tabindex: 0,
      "aria-label": L,
      cursor: "pointer",
      "pointer-events": "all",
      "data-suggestion-button": G ? "keep" : "discard"
    });
    g.rect(P, 22).radius(11).move(a, 0).fill(G ? F : "#ffffff").stroke({ color: F, width: 1.5 }), g.text((R) => R.plain(p)).font({ size: 12, weight: 600, family: Ut, anchor: "middle" }).fill(G ? "#ffffff" : F).attr({ x: a + P / 2, y: 15 });
    const Z = (R) => {
      R.stopPropagation?.(), R.preventDefault?.(), X();
    };
    return g.on("pointerdown", (R) => R.stopPropagation?.()), g.on("mousedown", (R) => R.stopPropagation?.()), g.on("click", Z), g.on("keydown", (R) => {
      (R.key === "Enter" || R.key === " ") && Z(R);
    }), P;
  }
  function Mt(d, a, p, L, G, F, X, P = !1) {
    const g = Ot(L), Z = { actionId: L.actionId, itemId: G.id }, R = d.group().attr({ "data-suggestion-controls": G.id }), z = R.group();
    let U = 0;
    const T = " the suggestion from " + Tt(L).replace(/ · /g, ", ") + ": " + X;
    U += Dt(z, U, F, F + T, !0, g, () => Rt.keep(Z)) + 6, U += Dt(z, U, "Discard", "Discard" + T, !1, g, () => Rt.discard(Z)), R.transform({ translateX: a.x, translateY: a.y, scale: 1 / p, originX: 0, originY: 0 }), z.attr("transform", P ? `translate(${-U / 2} -11)` : `translate(${-U} 6)`);
  }
  function Et(d, a, p, L, G, F) {
    const X = d.group().attr({ "data-suggestion-tag": "", "pointer-events": "none" }), P = nt(G, 64), g = Math.round(28 + 7 * P.length);
    X.rect(g, 22).radius(11).move(0, -28).fill("#ffffff").stroke({ color: F, width: 1.2 }).attr("fill-opacity", 0.95);
    const Z = 6, R = 12, z = -16, U = Array.from({ length: 6 }, (T, J) => {
      const ut = Math.PI / 6 + J * Math.PI / 3;
      return (R + Z * Math.cos(ut)).toFixed(2) + "," + (z + Z * Math.sin(ut)).toFixed(2);
    }).join(" ");
    X.polygon(U).fill(F), X.text((T) => T.plain(P)).font({ size: 12, family: Ut }).fill("#111827").attr({ x: 22, y: -12 }), X.transform({ translateX: a.x, translateY: a.y, scale: 1 / p, originX: 0, originY: 0 });
  }
  function bt(d = !1) {
    if (x) return;
    const a = Nt(), p = Gt(h), L = JSON.stringify([a.toFixed(4), f(), p.map(({ item: P }) => P.id + ":" + P.kind), Pt(p)]);
    if (!d && L === E) return;
    E = L;
    const G = ft();
    G.clear(), G.front?.();
    try {
      const P = i.canvas.node?.querySelector?.("[data-agent-presence]");
      P?.parentNode?.appendChild(P);
    } catch {
    }
    const F = f(), X = [];
    for (const { action: P, item: g } of p) {
      const Z = Ot(P), R = Tt(P), z = G.group().attr({ "data-suggestion": g.id, "data-suggestion-kind": g.kind, "data-action": P.actionId }), U = { color: g.kind === "remove" || g.kind === "unlink" ? Jt : Z, width: 2 / a, dasharray: `${8 / a} ${5 / a}` };
      let T = null, J = null, ut = "Keep", et = "";
      if (g.kind === "add" || g.kind === "update" || g.kind === "remove") {
        if (T = g.kind === "add" ? dt(st(St(g.nodeId || ""))) : dt(st(g.nodeId)), !T) {
          z.remove();
          continue;
        }
        const K = 6 / a;
        z.rect(T.w + 2 * K, T.h + 2 * K).move(T.x - K, T.y - K).radius(6 / a).fill("none").stroke(U).attr({ "pointer-events": "none", "data-suggestion-outline": "" }), J = { x: T.x + T.w + K, y: T.y + T.h + K };
        const ct = tt(g.kind === "add" ? g.node?.options?.text ?? "" : st(g.nodeId)?.options?.text ?? "");
        g.kind === "add" && (et = "add “" + nt(ct, 40) + "”", Et(z, { x: T.x - K, y: T.y - K }, a, P, R, Z)), g.kind === "update" && (et = tn(g).replace(/^Suggests/, "change “" + nt(ct, 24) + "”,").replace(/: “/, " to “"), Et(z, { x: T.x - K, y: T.y - K }, a, P, R + " — " + tn(g), Z)), g.kind === "remove" && (ut = "Remove", et = "remove “" + nt(ct, 40) + "”", Et(z, { x: T.x - K, y: T.y - K }, a, P, R + " — Suggests removing this note", Jt));
      } else {
        const K = g.association || null, ct = pt(g.parentId ?? K?.parentId), kt = pt(K?.childId);
        if (!ct || !kt) {
          z.remove();
          continue;
        }
        const t = Qt(ct, kt), n = Qt(kt, ct);
        z.line(t.x, t.y, n.x, n.y).stroke({ ...U, width: 2.5 / a }).attr({ "pointer-events": "none", "data-suggestion-line": "" });
        const s = { x: (t.x + n.x) / 2, y: (t.y + n.y) / 2 };
        T = { x: Math.min(t.x, n.x), y: Math.min(t.y, n.y), w: Math.abs(n.x - t.x), h: Math.abs(n.y - t.y) }, J = s, g.kind === "unlink" ? (ut = "Remove", et = "remove a line") : et = "draw a line", z.attr({ role: "img", "aria-label": R + (g.kind === "unlink" ? " suggests removing this line" : " suggests this line") });
      }
      F && J && Mt(z, J, a, P, g, ut, et, g.kind === "link" || g.kind === "unlink"), X.push({
        actionId: P.actionId,
        itemId: g.id,
        kind: g.kind,
        nodeId: g.nodeId ?? null,
        ghostId: g.kind === "add" && g.nodeId ? St(g.nodeId) : null,
        label: R,
        box: T,
        controls: !!(F && J)
      });
    }
    N = X, p.length || (r?.remove(), r = null);
  }
  function Pt(d) {
    const a = /* @__PURE__ */ new Set();
    for (const { item: p } of d)
      p.nodeId && (a.add(p.nodeId), a.add(St(p.nodeId))), p.parentId && a.add(p.parentId), p.association?.childId && (a.add(p.association.childId), a.add(St(p.association.childId)));
    return [...a].map((p) => {
      const L = dt(st(p));
      return L ? p + ":" + [L.x, L.y, L.w, L.h].map(Math.round).join(",") : "";
    }).join(";");
  }
  function vt() {
    x || (Lt(), bt(!0));
  }
  const xt = setInterval(() => {
    !x && Gt(h).length && bt(!1);
  }, 250), Rt = {
    set(d) {
      x || (h = Array.isArray(d) ? d.filter((a) => a && typeof a.actionId == "string") : [], vt());
    },
    shown: () => N.map((d) => ({ ...d, box: d.box ? { ...d.box } : null })),
    keep(d) {
      f() && o.onKeep?.(d);
    },
    discard(d) {
      f() && o.onDiscard?.(d);
    },
    destroy() {
      if (!x) {
        x = !0, clearInterval(xt), yt(() => {
          for (const [d, a] of O) i.nodes?.one?.(d) === a.node && i.nodes.remove(d);
        }), O.clear();
        try {
          W();
        } catch {
        }
        r?.remove(), r = null;
      }
    }
  };
  return Rt;
}
function pn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const Ft = 400, zt = 450, An = zt, xn = 5, Yt = 240, mn = 600, $t = 40, Kt = 30, _t = (e, o) => Math.max(0, Math.min(e.x + e.w, o.x + o.w) - Math.max(e.x, o.x)) * Math.max(0, Math.min(e.y + e.h, o.y + o.h) - Math.max(e.y, o.y));
function nn(e, o, i, y, f, h = [], r) {
  const x = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let E = x[0], O = 1 / 0;
  for (const N of x) {
    const W = jt(e, o, i, N, y, f, h, r);
    if (W <= 1e-9) return N;
    W < O && (E = N, O = W);
  }
  return E;
}
function Xt(e, o, i, y) {
  const f = y.right ? $t : -($t + o.w), h = y.down ? Kt : -(Kt + o.h);
  return { x: e.x + f / i, y: e.y + h / i, w: o.w / i, h: o.h / i };
}
function wn(e, o, i, y, f) {
  const h = Xt(e, o, i, y);
  if (!f || e.x < f.x || e.x > f.x + f.w || e.y < f.y || e.y > f.y + f.h) return h;
  const r = 4 / i;
  return h.w <= f.w - 2 * r && (h.x = Math.min(Math.max(h.x, f.x + r), f.x + f.w - r - h.w)), h.h <= f.h - 2 * r && (h.y = Math.min(Math.max(h.y, f.y + r), f.y + f.h - r - h.h)), h;
}
function Ct(e) {
  return on(e);
}
function en(e, o) {
  const i = Ct(e), y = cn(e), f = y ? nt(y, 40) : "", h = Math.max(96, Math.min(Yt, 16 + Math.max(7 * i.length, 6.8 * f.length))), r = f ? 40 : 22, x = o ? (e.plan?.steps ?? []).length : 0;
  return { width: h, height: r, w: Math.max(h, x ? Yt : 0), h: r + (x ? 18 + x * 18 : 0) };
}
function Mn(e, o, i, y, f = [], h) {
  const r = Math.min(8, e.w / 4, e.h / 4), x = [
    { x: e.x + e.w - r, y: e.y + e.h - r, side: { right: !0, down: !0 } },
    { x: e.x + r, y: e.y + e.h - r, side: { right: !1, down: !0 } },
    { x: e.x + e.w - r, y: e.y + r, side: { right: !0, down: !1 } },
    { x: e.x + r, y: e.y + r, side: { right: !1, down: !1 } }
  ];
  let E = x[0], O = 1 / 0;
  for (const N of x) {
    const W = jt(N, o, i, N.side, y, [e], f, h);
    if (W <= 1e-9) return N;
    W < O && (E = N, O = W);
  }
  return E;
}
function jt(e, o, i, y, f, h, r, x) {
  const E = Xt(e, o, i, y), O = f ? (E.w * E.h - _t(E, f)) * 0.5 : 0;
  return bn(wn(e, o, i, y, f), f, h, r, x) + O;
}
function bn(e, o, i, y, f) {
  const h = o ? e.w * e.h - _t(e, o) : 0, r = (x) => x.reduce((E, O) => E + _t(e, O), 0);
  return f?.length ? h * 10 + r(f) * 4 + r(i) + r(y) * 0.05 : h * 10 + r(i) * 3 + r(y);
}
function In(e, o = {}) {
  const i = o.now ?? (() => Date.now()), y = o.reducedMotion ?? pn, f = o.holdMs ?? sn, h = o.fadeMs ?? rn, r = o.maxAgents ?? an, x = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Set();
  let O = [], N = null, W = null, yt = null, ft = !1, Nt = 0;
  const st = () => (N && N.node?.isConnected !== !1 && N.node?.parentNode || (N = e.canvas.group(), N.attr({ "data-agent-presence": "", "data-export-never": "", "pointer-events": "none" })), N);
  function dt() {
    try {
      const t = e.canvas.viewbox(), n = e.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !n?.width || !n?.height) return null;
      const s = String(e.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), l = n.width / t.width, u = n.height / t.height, m = s === "none" ? l : /slice/.test(s) ? Math.max(l, u) : Math.min(l, u), b = n.width / m, I = n.height / m, M = { x: t.x + (t.width - b) / 2, y: t.y + (t.height - I) / 2, w: b, h: I };
      let v = n.left, c = n.top, Y = n.right, k = n.bottom;
      for (let B = e.canvas.node?.parentElement; B && B !== document.body; B = B.parentElement) {
        const H = getComputedStyle(B);
        if (H.overflow === "visible" && H.overflowX === "visible" && H.overflowY === "visible") continue;
        const $ = B.getBoundingClientRect();
        !$.width || !$.height || (v = Math.max(v, $.left), c = Math.max(c, $.top), Y = Math.min(Y, $.right), k = Math.min(k, $.bottom));
      }
      const w = o.insets?.() || {};
      return v += Math.max(0, w.left ?? 0), Y -= Math.max(0, w.right ?? 0), c += Math.max(0, w.top ?? 0), k -= Math.max(0, w.bottom ?? 0), Y - v < 1 || k - c < 1 ? { view: M, scale: m } : { view: { x: M.x + (v - n.left) / m, y: M.y + (c - n.top) / m, w: (Y - v) / m, h: (k - c) / m }, scale: m };
    } catch {
      return null;
    }
  }
  function pt() {
    const t = dt();
    if (t) return t.scale;
    try {
      const n = e.getZoom?.();
      if (typeof n == "number" && n > 0) return n;
    } catch {
    }
    return 1;
  }
  const Ot = () => {
    try {
      return e.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function Tt(t) {
    const s = (e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((l) => l?.options?.name === t))?.options;
    return !s || typeof s.x != "number" || typeof s.y != "number" ? null : { x: s.x + (s.width || 0) / 2, y: s.y + (s.height || 0) / 2 };
  }
  function Lt(t) {
    const n = t?.options;
    return !n || ![n.x, n.y, n.width, n.height].every((s) => typeof s == "number" && Number.isFinite(s)) ? null : { x: n.x, y: n.y, w: n.width, h: n.height };
  }
  const Dt = (t) => e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((n) => n?.options?.name === t), Mt = () => (e.nodes?.allNodes ?? []).map(Lt).filter((t) => !!t), Et = (t, n) => t.x === n.x && t.y === n.y && t.w === n.w && t.h === n.h;
  function bt(t) {
    try {
      const n = e.canvas?.node, s = n?.getScreenCTM?.()?.inverse?.();
      if (!n || !s) return [];
      const l = t ? N?.node?.querySelector?.(`[data-agent="${CSS.escape(t)}"]`) : null, u = [];
      for (const m of n.querySelectorAll("text")) {
        if (l?.contains(m) || !m.textContent?.trim()) continue;
        const b = m.getBoundingClientRect();
        if (b.width < 1 || b.height < 1) continue;
        const I = new DOMPoint(b.left, b.top).matrixTransform(s), M = new DOMPoint(b.right, b.bottom).matrixTransform(s);
        u.push({ x: Math.min(I.x, M.x), y: Math.min(I.y, M.y), w: Math.abs(M.x - I.x), h: Math.abs(M.y - I.y) });
      }
      return u;
    } catch {
      return [];
    }
  }
  function Pt() {
    return Mt().map((t) => [t.x, t.y, t.w, t.h].map(Math.round).join(",")).join(";");
  }
  function vt() {
    const t = xt(), n = pt();
    return t ? [t.x, t.y, t.w, t.h].map((s) => Math.round(s * n / 8)).join(":") : "";
  }
  function xt() {
    const t = dt();
    if (t) return t.view;
    try {
      const n = e.canvas.viewbox();
      if (n && [n.x, n.y, n.width, n.height].every((s) => Number.isFinite(s)) && n.width > 0 && n.height > 0)
        return { x: n.x, y: n.y, w: n.width, h: n.height };
    } catch {
    }
    return null;
  }
  function Rt(t, n = { w: Yt, h: 38 }, s = 1, l = []) {
    const u = xt();
    if (u) {
      const I = 8 / s, M = 16 / s, v = t * 64 / s, c = [
        { x: u.x + I, y: u.y + I + v, side: { right: !0, down: !0 } },
        { x: u.x + u.w - I - M, y: u.y + I + v, side: { right: !1, down: !0 } },
        { x: u.x + I, y: u.y + u.h - I - M - v, side: { right: !0, down: !1 } },
        { x: u.x + u.w - I - M, y: u.y + u.h - I - M - v, side: { right: !1, down: !1 } }
      ], Y = Mt();
      let k = c[0], w = 1 / 0;
      for (const B of c) {
        const H = jt(B, n, s, B.side, u, [], Y, l);
        if (H <= 1e-9) return B;
        H < w && (k = B, w = H);
      }
      return k;
    }
    let m = 1 / 0, b = 1 / 0;
    for (const I of e.nodes?.allNodes ?? []) {
      const M = I?.options;
      typeof M?.x == "number" && typeof M?.y == "number" && (m = Math.min(m, M.x), b = Math.min(b, M.y));
    }
    return Number.isFinite(m) || (m = 100, b = 100), { x: m - 40, y: b - 40 + t * 64, side: null };
  }
  function d(t, n, s) {
    const { record: l } = t, u = Q[(l.colorIndex % Q.length + Q.length) % Q.length], m = cn(l), b = Vt(l), I = b.length > 0 && (t.open || !s), M = Ct(l);
    t.body?.remove();
    const v = t.group.group();
    t.body = v, v.path("M0 0 L14 5 L7 7 L5 14 Z").fill(u).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const c = v.group().attr("data-agent-avatar", ""), Y = 11, k = 24, w = 24, B = Array.from({ length: 6 }, (A, V) => {
      const j = Math.PI / 6 + V * Math.PI / 3;
      return (k + Y * Math.cos(j)).toFixed(2) + "," + (w + Y * Math.sin(j)).toFixed(2);
    }).join(" ");
    c.polygon(B).fill(u).stroke({ color: "#fff", width: 1.5 });
    const H = dn(l.iconUrl);
    if (H) {
      const A = c.clip();
      A.add(c.circle(14).center(k, w)), c.image(H).size(14, 14).move(k - 7, w - 7).attr({ "data-agent-icon": "", preserveAspectRatio: "xMidYMid slice" }).clipWith(A);
    } else
      c.text((A) => A.plain(nt(tt(l.initial).toUpperCase(), 1) || "?")).font({ size: 12, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: k, y: w + 4 });
    c.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: u, width: 0.8 });
    const $ = v.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: b.length ? "pointer" : "default",
      role: "button",
      tabindex: b.length ? 0 : -1,
      "aria-expanded": String(I),
      "aria-label": M + (m ? ": " + m : "")
    }), it = m ? nt(m, 40) : "", S = en(l, I), { width: ot, height: lt } = S, D = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, _ = xt(), Bt = _ && D.x >= _.x && D.x <= _.x + _.w && D.y >= _.y && D.y <= _.y + _.h;
    let C = t.routedSide ?? nn(D, S, n, _, [], Mt(), bt(l.agentKey));
    _ && !Bt && (C = [C, { right: !C.right, down: C.down }, { right: C.right, down: !C.down }, { right: !C.right, down: !C.down }].reduce((V, j) => _t(Xt(D, S, n, j), _) < _t(Xt(D, S, n, V), _) ? j : V));
    let mt = C.right ? $t : -($t + S.w), wt = C.down ? Kt : -(Kt + S.h);
    if (_ && Bt) {
      const V = D, j = (_.x - V.x) * n + 4, rt = (_.x + _.w - V.x) * n - 4, q = (_.y - V.y) * n + 4, gt = (_.y + _.h - V.y) * n - 4;
      S.w <= rt - j && (mt = Math.min(Math.max(mt, j), rt - S.w)), S.h <= gt - q && (wt = Math.min(Math.max(wt, q), gt - S.h));
    }
    t.side = C;
    let ht = C.right, At = C.down;
    if (_ && Bt) {
      const A = 42 / n;
      ht && D.x + A > _.x + _.w ? ht = !1 : !ht && D.x - A < _.x && (ht = !0), At && D.y + A > _.y + _.h ? At = !1 : !At && D.y - A < _.y && (At = !0);
    }
    (!ht || !At) && c.attr("transform", `translate(${ht ? 0 : -2 * k} ${At ? 0 : -2 * w})`), $.attr("data-agent-side", (C.right ? "right" : "left") + "-" + (C.down ? "down" : "up")), $.rect(ot, lt).radius(7).move(mt, wt).fill("#fff").stroke({ color: u, width: 1.5 }), $.text((A) => A.plain(M)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(u).attr({ x: mt + 8, y: wt + 15 }), it && $.text((A) => A.plain(it)).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: mt + 8, y: wt + 32 });
    const Ht = (A) => {
      A.stopPropagation?.(), kt.expand(l.agentKey);
    };
    if ($.on("pointerdown", (A) => A.stopPropagation?.()), $.on("click", Ht), $.on("keydown", (A) => {
      (A.key === "Enter" || A.key === " ") && (A.preventDefault?.(), Ht(A));
    }), I) {
      const A = v.group().attr("data-agent-plan", ""), V = b.length;
      A.rect(Yt, 12 + V * 18).radius(8).move(mt, wt + lt + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), b.forEach((j, rt) => {
        const q = l.plan.steps[rt].status;
        A.text((It) => It.plain(nt(j, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: q === "doing" ? 600 : 400 }).fill(q === "done" || q === "skipped" ? "#6b7280" : "#111827").attr({ x: mt + 10, y: wt + lt + 6 + 20 + rt * 18 }).attr("data-step-status", q);
      });
    }
    const Wt = Zt(l, i());
    if (Wt) {
      const A = nt(Wt, 60), V = Math.max(48, Math.min(260, 16 + 6.6 * A.length)), j = 24, rt = ht ? 8 : -8 - V, q = C.down ? -j - 14 : 46, gt = v.group().attr({ "data-agent-say": "", role: "status", "aria-label": M + " says: " + A });
      gt.rect(V, j).radius(12).move(rt, q).fill("#ffffff").stroke({ color: u, width: 1.5 });
      const It = ht ? rt + 14 : rt + V - 14;
      C.down && (gt.path(`M${It - 5} ${q + j - 0.5} L${It} ${q + j + 7} L${It + 5} ${q + j - 0.5} Z`).fill("#ffffff").stroke({ color: u, width: 1.5 }), gt.rect(12, 3).move(It - 6, q + j - 2).fill("#ffffff")), gt.text((ln) => ln.plain(A)).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#111827").attr({ x: rt + 8, y: q + 16 });
    }
    v.element("title").words(M + (m ? " — " + m : "")), t.compact = s, t.lines = b, t.step = m, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), Nt = n;
  }
  function a(t, n) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function p(t, n, s, l) {
    const u = xt(), m = Mt(), b = bt(t.agentKey), M = t.targets.map((k) => Lt(Dt(k))).filter((k) => !!k).slice(0, xn).map((k) => Mn(k, s, l, u, m.filter((w) => !Et(w, k)), b)), v = G(t);
    if (!M.length) {
      if (v) return { legs: [{ x: v.x, y: v.y, ms: Ft }], side: nn(v, s, l, u, [], m, b) };
      const k = Rt(n, s, l, b);
      return { legs: [{ x: k.x, y: k.y, ms: Ft }], side: k.side };
    }
    const c = M.length === 1 && !v ? Ft : zt, Y = M.map((k) => ({ x: k.x, y: k.y, ms: c }));
    return v && Y.unshift({ x: v.x, y: v.y, ms: zt }), { legs: Y, side: M[M.length - 1].side };
  }
  const L = (t) => t.targets.some((n) => Tt(n) !== null), G = (t) => {
    const n = t.point;
    return n && Number.isFinite(n.x) && Number.isFinite(n.y) ? { x: Number(n.x), y: Number(n.y) } : null;
  }, F = (t) => {
    const n = G(t);
    return t.targets.join("\0") + (n ? "@" + n.x + "," + n.y : "");
  }, X = (t) => 1 - Math.pow(1 - t, 3);
  function P(t) {
    let n = !1;
    for (const s of x.values())
      for (; s.path.length; ) {
        const l = s.path[0];
        if (y() || l.ms <= 0) {
          s.x = l.x, s.y = l.y, s.path.shift(), s.leg = null;
          continue;
        }
        s.leg || (s.leg = { fromX: s.x, fromY: s.y, startedAt: t });
        const u = Math.min(1, (t - s.leg.startedAt) / l.ms), m = X(u);
        if (s.x = s.leg.fromX + (l.x - s.leg.fromX) * m, s.y = s.leg.fromY + (l.y - s.leg.fromY) * m, u < 1) {
          n = !0;
          break;
        }
        s.path.shift(), s.leg = s.path.length ? { fromX: s.x, fromY: s.y, startedAt: t } : null;
      }
    return n;
  }
  const g = /* @__PURE__ */ new Map(), Z = (t) => t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, R = (t, n) => !!n && !(t.x >= n.x && t.x <= n.x + n.w && t.y >= n.y && t.y <= n.y + n.h);
  function z(t, n) {
    const s = t.x < n.x ? -1 : t.x > n.x + n.w ? 1 : 0, l = t.y < n.y ? -1 : t.y > n.y + n.h ? 1 : 0;
    return { "-1,-1": "↖", "0,-1": "↑", "1,-1": "↗", "-1,0": "←", "1,0": "→", "-1,1": "↙", "0,1": "↓", "1,1": "↘" }[`${s},${l}`] || "→";
  }
  function U(t, n) {
    if (o.goTo) return o.goTo(t, n);
    try {
      e.camera?.flyTo?.({ state: { cx: t.x, cy: t.y } }, { reduced: y() })?.catch?.(() => {
      });
    } catch {
    }
  }
  function T(t) {
    const n = xt(), s = /* @__PURE__ */ new Set();
    for (const l of x.values()) {
      const u = Z(l);
      if (!n || l.opacity <= 0 || !R(u, n)) continue;
      s.add(l.key);
      const m = nt(Ct(l.record), 32), b = z(u, n), I = `${m} is working`;
      let M = g.get(l.key);
      if (!M || M.words !== I || M.arrow !== b) {
        M?.group.remove();
        const H = Q[(l.record.colorIndex % Q.length + Q.length) % Q.length], it = b === "←" || b === "↖" || b === "↙" ? `${b} ${I}` : `${I} ${b}`, S = st().group().attr({
          "data-agent-edge": l.key,
          "pointer-events": "all",
          cursor: "pointer",
          role: "button",
          tabindex: 0,
          "aria-label": `${I} out of view. Show where.`
        }), ot = Math.round(20 + 7 * it.length);
        S.rect(ot, 26).radius(13).fill("#ffffff").stroke({ color: H, width: 1.5 }).attr("fill-opacity", 0.97), S.text((D) => D.plain(it)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(H).attr({ x: 10, y: 17 });
        const lt = (D) => {
          D.stopPropagation?.(), U(Z(x.get(l.key) ?? l), l.key);
        };
        S.on("pointerdown", (D) => D.stopPropagation?.()), S.on("click", lt), S.on("keydown", (D) => {
          (D.key === "Enter" || D.key === " ") && (D.preventDefault?.(), lt(D));
        }), M = { group: S, words: I, arrow: b }, M.width = ot, g.set(l.key, M);
      }
      const v = 12 / t, c = M.width / t, Y = 26 / t, k = [...s].indexOf(l.key) * (32 / t), w = Math.min(Math.max(u.x - c / 2, n.x + v), n.x + n.w - c - v), B = Math.min(Math.max(u.y - Y / 2 + k, n.y + v), n.y + n.h - Y - v);
      M.group.transform({ translateX: w, translateY: B, scale: 1 / t, originX: 0, originY: 0 });
    }
    for (const [l, u] of g) s.has(l) || (u.group.remove(), g.delete(l));
  }
  function J() {
    if (ft) return;
    const t = i(), n = qt(O, t, { holdMs: f, fadeMs: h, max: r }), s = new Set(n.map((c) => c.record.agentKey));
    for (const [c, Y] of x) s.has(c) || (Y.group.remove(), x.delete(c));
    if (!n.length) {
      for (const c of g.values()) c.group.remove();
      g.clear(), et(null);
      return;
    }
    const l = st();
    l.front?.();
    const u = pt(), m = n.length >= 2 || Ot() < mn;
    n.forEach(({ record: c, opacity: Y }, k) => {
      let w = x.get(c.agentKey);
      const B = F(c), H = E.has(c.agentKey), $ = en(c, Vt(c).length > 0 && (H || !m)), it = [$.w, $.h, u.toFixed(4), vt(), Pt()].join(",");
      if (w) {
        if (w.targetsKey !== B || !w.found && L(c)) {
          const S = p(c, k, $, u);
          w.path = S.legs, w.leg = null, w.found = L(c), w.routedSide = S.side, w.routedFor = it;
        } else if (w.routedFor !== it && w.found) {
          const S = p(c, k, $, u), ot = S.legs[S.legs.length - 1], lt = w.path.length ? w.path[w.path.length - 1] : { x: w.x, y: w.y };
          (ot.x !== lt.x || ot.y !== lt.y) && (w.path = [{ ...ot, ms: Ft }], w.leg = null), w.routedSide = S.side, w.routedFor = it;
        }
      } else {
        const S = p(c, k, $, u), ot = S.legs[0];
        w = {
          key: c.agentKey,
          group: l.group().attr({ "data-agent": c.agentKey }),
          body: null,
          record: c,
          targetsKey: B,
          found: L(c),
          x: ot.x,
          y: ot.y,
          path: S.legs.slice(1),
          leg: null,
          open: H,
          opacity: Y,
          compact: m,
          lines: [],
          step: null,
          routedSide: S.side,
          routedFor: it
        }, x.set(c.agentKey, w);
      }
      w.targetsKey = B, w.record = c, w.opacity = Math.max(0, Math.min(1, Y)), w.open = E.has(c.agentKey), d(w, u, m);
    });
    const b = P(t);
    for (const c of x.values()) a(c, u);
    T(u);
    const I = n.some((c) => c.opacity < 1), M = n.map((c) => Zt(c.record, t) ? (at(c.record.sayAt ?? null) ?? t) + 3e3 : 1 / 0), v = Math.min(...M, ...n.map((c) => c.record.status === "live" && at(c.record.endedAt) === null ? c.until : (at(c.record.endedAt) ?? at(c.record.updatedAt) ?? t) + f));
    et(b || I ? "frame" : Math.max(16, v - t));
  }
  function ut() {
    if (W = null, ft) return;
    const t = i(), n = P(t), s = pt(), l = qt(O, t, { holdMs: f, fadeMs: h, max: r });
    if (l.some((m) => m.opacity < 1) || x.size !== l.length || Math.abs(s - Nt) > 1e-6) {
      J();
      return;
    }
    for (const m of x.values()) a(m, s);
    n || T(s), n && et("frame");
  }
  function et(t) {
    W !== null && (cancelAnimationFrame(W), W = null), yt !== null && (clearTimeout(yt), yt = null), !(t === null || ft) && (t === "frame" ? W = requestAnimationFrame(ut) : yt = setTimeout(J, Math.min(t, 6e4)));
  }
  let K = null;
  const ct = () => {
    if (K !== null) return;
    let t = vt(), n = Pt(), s = n;
    K = setInterval(() => {
      if (ft || !x.size) return;
      const l = vt(), u = Pt(), m = u === n && u !== s;
      n = u, (Math.abs(pt() - Nt) > 1e-6 || l !== t || m) && (t = l, s = u, J());
    }, 250);
  }, kt = {
    set(t) {
      ft || (O = Array.isArray(t) ? t.filter((n) => n && typeof n.agentKey == "string") : [], J(), ct());
    },
    expand(t, n) {
      const s = n ?? !E.has(t);
      s ? E.add(t) : E.delete(t), o.onToggle?.(t, s), J();
    },
    shown() {
      return [...x.values()].map((t) => ({
        agentKey: t.key,
        label: t.record.label,
        step: t.step,
        x: t.x,
        y: t.y,
        opacity: t.opacity,
        compact: t.compact,
        lines: t.lines,
        side: t.side ?? { right: !0, down: !0 },
        offscreen: g.has(t.key)
      }));
    },
    destroy() {
      ft = !0, et(null), K !== null && clearInterval(K);
      for (const t of x.values()) t.group.remove();
      x.clear(), g.clear(), N?.remove(), N = null;
    }
  };
  return kt;
}
export {
  zt as AGENT_BEAT_MS,
  rn as AGENT_FADE_MS,
  Ft as AGENT_GLIDE_MS,
  sn as AGENT_HOLD_MS,
  an as AGENT_MAX_DRAWN,
  xn as AGENT_MAX_VISITS,
  Q as AGENT_PALETTE,
  vn as AGENT_SAY_MS,
  An as AGENT_VISIT_MS,
  gn as GHOST_PREFIX,
  Mn as agentAnchor,
  Vt as agentChecklist,
  on as agentName,
  fn as agentOrigin,
  Zt as agentSaying,
  cn as agentStepText,
  Xt as agentTagBox,
  wn as agentTagPlaced,
  nn as agentTagSide,
  In as createAgentPresence,
  kn as createAgentSuggestions,
  St as ghostIdOf,
  Gt as pendingItems,
  dn as safeIconUrl,
  qt as visibleAgents
};
