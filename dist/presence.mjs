const $ = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), mt = 6e3, Mt = 600, At = 6, Rt = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, _ = (n) => {
  if (n == null) return null;
  const r = n instanceof Date ? n.getTime() : typeof n == "number" ? n : Date.parse(n);
  return Number.isFinite(r) ? r : null;
}, R = (n, r) => n.length > r ? n.slice(0, r - 1).trimEnd() + "…" : n, F = (n) => String(n ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function vt(n) {
  const r = n.plan?.steps ?? [];
  if (r.length) {
    const y = r.findIndex((l) => l.status === "doing"), w = r.findIndex((l) => l.status === "stopped");
    if (w >= 0) return "Stopped: " + F(r[w].text);
    if (r.every((l) => l.status === "done" || l.status === "skipped")) return "Done";
    const f = y >= 0 ? y : Math.min(Math.max(n.plan.current ?? 0, 0), r.length - 1);
    return F(r[f].text);
  }
  return F(n.message ?? "") || null;
}
function yt(n) {
  return (n.plan?.steps ?? []).map((r) => Rt[r.status] + " " + (r.status === "stopped" ? "Stopped: " : "") + F(r.text));
}
function xt(n, r, { holdMs: x = mt, fadeMs: y = Mt, max: w = At } = {}) {
  const f = [];
  for (const l of n) {
    if (!l || typeof l.agentKey != "string") continue;
    const d = _(l.expiresAt), A = _(l.endedAt);
    if (l.status === "live" && A === null) {
      if (d === null || r >= d) continue;
      f.push({ record: l, opacity: 1, until: d });
      continue;
    }
    const p = (A ?? _(l.updatedAt) ?? r) + x;
    r >= p + y || f.push({ record: l, opacity: r <= p ? 1 : 1 - (r - p) / y, until: p + y });
  }
  return f.sort((l, d) => (_(d.record.updatedAt) ?? 0) - (_(l.record.updatedAt) ?? 0)), f.slice(0, w);
}
function Gt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const rt = 400, Xt = 250, Yt = 5, q = 240, Bt = 600, U = 40, J = 30, it = (n, r) => Math.max(0, Math.min(n.x + n.w, r.x + r.w) - Math.max(n.x, r.x)) * Math.max(0, Math.min(n.y + n.h, r.y + r.h) - Math.max(n.y, r.y));
function jt(n, r, x, y, w, f = []) {
  const l = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let d = l[0], A = 1 / 0;
  for (const b of l) {
    const p = lt(at(n, r, x, b), y, w, f);
    if (p <= 1e-9) return b;
    p < A && (d = b, A = p);
  }
  return d;
}
function at(n, r, x, y) {
  const w = y.right ? U : -(U + r.w), f = y.down ? J : -(J + r.h);
  return { x: n.x + w / x, y: n.y + f / x, w: r.w / x, h: r.h / x };
}
function wt(n, r) {
  const x = R(F(n.label), 48), y = vt(n), w = y ? R(y, 40) : "", f = Math.max(96, Math.min(q, 16 + Math.max(7 * x.length, 6.3 * w.length))), l = w ? 38 : 22, d = r ? (n.plan?.steps ?? []).length : 0;
  return { width: f, height: l, w: Math.max(f, d ? q : 0), h: l + (d ? 18 + d * 18 : 0) };
}
function zt(n, r, x, y, w = []) {
  const f = Math.min(8, n.w / 4, n.h / 4), l = [
    { x: n.x + n.w - f, y: n.y + n.h - f, side: { right: !0, down: !0 } },
    { x: n.x + f, y: n.y + n.h - f, side: { right: !1, down: !0 } },
    { x: n.x + n.w - f, y: n.y + f, side: { right: !0, down: !1 } },
    { x: n.x + f, y: n.y + f, side: { right: !1, down: !1 } }
  ];
  let d = l[0], A = 1 / 0;
  for (const b of l) {
    const p = lt(at(b, r, x, b.side), y, [n], w);
    if (p <= 1e-9) return b;
    p < A && (d = b, A = p);
  }
  return d;
}
function lt(n, r, x, y) {
  return (r ? n.w * n.h - it(n, r) : 0) * 10 + x.reduce((f, l) => f + it(n, l), 0) * 3 + y.reduce((f, l) => f + it(n, l), 0);
}
function Ct(n, r = {}) {
  const x = r.now ?? (() => Date.now()), y = r.reducedMotion ?? Gt, w = r.holdMs ?? mt, f = r.fadeMs ?? Mt, l = r.maxAgents ?? At, d = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Set();
  let b = [], p = null, G = null, j = null, D = !1, Q = 0;
  const bt = () => (p && p.node?.isConnected !== !1 && p.node?.parentNode || (p = n.canvas.group(), p.attr({ "data-agent-presence": "", "pointer-events": "none" })), p);
  function ct() {
    try {
      const t = n.canvas.viewbox(), e = n.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !e?.width || !e?.height) return null;
      const o = String(n.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), i = e.width / t.width, c = e.height / t.height, u = o === "none" ? i : /slice/.test(o) ? Math.max(i, c) : Math.min(i, c), g = e.width / u, h = e.height / u;
      return { view: { x: t.x + (t.width - g) / 2, y: t.y + (t.height - h) / 2, w: g, h }, scale: u };
    } catch {
      return null;
    }
  }
  function z() {
    const t = ct();
    if (t) return t.scale;
    try {
      const e = n.getZoom?.();
      if (typeof e == "number" && e > 0) return e;
    } catch {
    }
    return 1;
  }
  const St = () => {
    try {
      return n.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function kt(t) {
    const o = (n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((i) => i?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function ut(t) {
    const e = t?.options;
    return !e || ![e.x, e.y, e.width, e.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: e.x, y: e.y, w: e.width, h: e.height };
  }
  const Tt = (t) => n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((e) => e?.options?.name === t), P = () => (n.nodes?.allNodes ?? []).map(ut).filter((t) => !!t), Nt = (t, e) => t.x === e.x && t.y === e.y && t.w === e.w && t.h === e.h;
  function tt() {
    return P().map((t) => [t.x, t.y, t.w, t.h].map(Math.round).join(",")).join(";");
  }
  function et() {
    const t = C(), e = z();
    return t ? [t.x, t.y, t.w, t.h].map((o) => Math.round(o * e / 8)).join(":") : "";
  }
  function C() {
    const t = ct();
    if (t) return t.view;
    try {
      const e = n.canvas.viewbox();
      if (e && [e.x, e.y, e.width, e.height].every((o) => Number.isFinite(o)) && e.width > 0 && e.height > 0)
        return { x: e.x, y: e.y, w: e.width, h: e.height };
    } catch {
    }
    return null;
  }
  function Lt(t, e = { w: q, h: 38 }, o = 1) {
    const i = C();
    if (i) {
      const g = 8 / o, h = t * 64 / o, T = [
        { x: i.x + g, y: i.y + g + h, side: { right: !0, down: !0 } },
        { x: i.x + i.w - g, y: i.y + g + h, side: { right: !1, down: !0 } },
        { x: i.x + g, y: i.y + i.h - g - h, side: { right: !0, down: !1 } },
        { x: i.x + i.w - g, y: i.y + i.h - g - h, side: { right: !1, down: !1 } }
      ], s = P();
      let v = T[0], N = 1 / 0;
      for (const a of T) {
        const k = lt(at(a, e, o, a.side), i, [], s);
        if (k <= 1e-9) return a;
        k < N && (v = a, N = k);
      }
      return v;
    }
    let c = 1 / 0, u = 1 / 0;
    for (const g of n.nodes?.allNodes ?? []) {
      const h = g?.options;
      typeof h?.x == "number" && typeof h?.y == "number" && (c = Math.min(c, h.x), u = Math.min(u, h.y));
    }
    return Number.isFinite(c) || (c = 100, u = 100), { x: c - 40, y: u - 40 + t * 64, side: null };
  }
  function It(t, e, o) {
    const { record: i } = t, c = $[(i.colorIndex % $.length + $.length) % $.length], u = vt(i), g = yt(i), h = g.length > 0 && (t.open || !o), T = R(F(i.label), 48);
    t.body?.remove();
    const s = t.group.group();
    t.body = s, s.path("M0 0 L14 5 L7 7 L5 14 Z").fill(c).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const v = s.group().attr("data-agent-avatar", ""), N = 11, a = 24, k = 24, W = Array.from({ length: 6 }, (m, st) => {
      const Z = Math.PI / 6 + st * Math.PI / 3;
      return (a + N * Math.cos(Z)).toFixed(2) + "," + (k + N * Math.sin(Z)).toFixed(2);
    }).join(" ");
    v.polygon(W).fill(c).stroke({ color: "#fff", width: 1.5 }), v.text((m) => m.plain(R(F(i.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: a, y: k + 4 }), v.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: c, width: 0.8 });
    const S = s.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: g.length ? "pointer" : "default",
      role: "button",
      tabindex: g.length ? 0 : -1,
      "aria-expanded": String(h),
      "aria-label": T + (u ? ": " + u : "")
    }), E = u ? R(u, 40) : "", M = wt(i, h), { width: I, height: K } = M, Dt = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, L = t.routedSide ?? jt(Dt, M, e, C(), [], P()), Y = L.right ? U : -(U + M.w), B = L.down ? J : -(J + M.h);
    t.side = L, (!L.right || !L.down) && v.attr("transform", `translate(${L.right ? 0 : -2 * a} ${L.down ? 0 : -2 * k})`), S.attr("data-agent-side", (L.right ? "right" : "left") + "-" + (L.down ? "down" : "up")), S.rect(I, K).radius(7).move(Y, B).fill("#fff").stroke({ color: c, width: 1.5 }), S.text((m) => m.plain(T)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(c).attr({ x: Y + 8, y: B + 15 }), E && S.text((m) => m.plain(E)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: Y + 8, y: B + 31 });
    const gt = (m) => {
      m.stopPropagation?.(), ht.expand(i.agentKey);
    };
    if (S.on("pointerdown", (m) => m.stopPropagation?.()), S.on("click", gt), S.on("keydown", (m) => {
      (m.key === "Enter" || m.key === " ") && (m.preventDefault?.(), gt(m));
    }), h) {
      const m = s.group().attr("data-agent-plan", ""), st = g.length;
      m.rect(q, 12 + st * 18).radius(8).move(Y, B + K + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), g.forEach((Z, pt) => {
        const V = i.plan.steps[pt].status;
        m.text((Kt) => Kt.plain(R(Z, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: V === "doing" ? 600 : 400 }).fill(V === "done" || V === "skipped" ? "#6b7280" : "#111827").attr({ x: Y + 10, y: B + K + 6 + 20 + pt * 18 }).attr("data-step-status", V);
      });
    }
    s.element("title").words(T + (u ? " — " + u : "")), t.compact = o, t.lines = g, t.step = u, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), Q = e;
  }
  function ft(t, e) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function nt(t, e, o, i) {
    const c = C(), u = P(), h = t.targets.map((s) => ut(Tt(s))).filter((s) => !!s).slice(0, Yt).map((s) => zt(s, o, i, c, u.filter((v) => !Nt(v, s))));
    if (!h.length) {
      const s = Lt(e, o, i);
      return { legs: [{ x: s.x, y: s.y, ms: rt }], side: s.side };
    }
    const T = h.length === 1 ? rt : Xt;
    return { legs: h.map((s) => ({ x: s.x, y: s.y, ms: T })), side: h[h.length - 1].side };
  }
  const ot = (t) => t.targets.some((e) => kt(e) !== null), _t = (t) => 1 - Math.pow(1 - t, 3);
  function dt(t) {
    let e = !1;
    for (const o of d.values())
      for (; o.path.length; ) {
        const i = o.path[0];
        if (y() || i.ms <= 0) {
          o.x = i.x, o.y = i.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const c = Math.min(1, (t - o.leg.startedAt) / i.ms), u = _t(c);
        if (o.x = o.leg.fromX + (i.x - o.leg.fromX) * u, o.y = o.leg.fromY + (i.y - o.leg.fromY) * u, c < 1) {
          e = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return e;
  }
  function X() {
    if (D) return;
    const t = x(), e = xt(b, t, { holdMs: w, fadeMs: f, max: l }), o = new Set(e.map((s) => s.record.agentKey));
    for (const [s, v] of d) o.has(s) || (v.group.remove(), d.delete(s));
    if (!e.length) {
      H(null);
      return;
    }
    const i = bt();
    i.front?.();
    const c = z(), u = e.length >= 2 || St() < Bt;
    e.forEach(({ record: s, opacity: v }, N) => {
      let a = d.get(s.agentKey);
      const k = s.targets.join("\0"), W = A.has(s.agentKey), S = wt(s, yt(s).length > 0 && (W || !u)), E = [S.w, S.h, c.toFixed(4), et(), tt()].join(",");
      if (a) {
        if (a.targetsKey !== k || !a.found && ot(s)) {
          const M = nt(s, N, S, c);
          a.path = M.legs, a.leg = null, a.found = ot(s), a.routedSide = M.side, a.routedFor = E;
        } else if (a.routedFor !== E && a.found) {
          const M = nt(s, N, S, c), I = M.legs[M.legs.length - 1], K = a.path.length ? a.path[a.path.length - 1] : { x: a.x, y: a.y };
          (I.x !== K.x || I.y !== K.y) && (a.path = [{ ...I, ms: rt }], a.leg = null), a.routedSide = M.side, a.routedFor = E;
        }
      } else {
        const M = nt(s, N, S, c), I = M.legs[0];
        a = {
          key: s.agentKey,
          group: i.group().attr({ "data-agent": s.agentKey }),
          body: null,
          record: s,
          targetsKey: k,
          found: ot(s),
          x: I.x,
          y: I.y,
          path: M.legs.slice(1),
          leg: null,
          open: W,
          opacity: v,
          compact: u,
          lines: [],
          step: null,
          routedSide: M.side,
          routedFor: E
        }, d.set(s.agentKey, a);
      }
      a.targetsKey = k, a.record = s, a.opacity = Math.max(0, Math.min(1, v)), a.open = A.has(s.agentKey), It(a, c, u);
    });
    const g = dt(t);
    for (const s of d.values()) ft(s, c);
    const h = e.some((s) => s.opacity < 1), T = Math.min(...e.map((s) => s.record.status === "live" && _(s.record.endedAt) === null ? s.until : (_(s.record.endedAt) ?? _(s.record.updatedAt) ?? t) + w));
    H(g || h ? "frame" : Math.max(16, T - t));
  }
  function Et() {
    if (G = null, D) return;
    const t = x(), e = dt(t), o = z(), i = xt(b, t, { holdMs: w, fadeMs: f, max: l });
    if (i.some((u) => u.opacity < 1) || d.size !== i.length || Math.abs(o - Q) > 1e-6) {
      X();
      return;
    }
    for (const u of d.values()) ft(u, o);
    e && H("frame");
  }
  function H(t) {
    G !== null && (cancelAnimationFrame(G), G = null), j !== null && (clearTimeout(j), j = null), !(t === null || D) && (t === "frame" ? G = requestAnimationFrame(Et) : j = setTimeout(X, Math.min(t, 6e4)));
  }
  let O = null;
  const Ft = () => {
    if (O !== null) return;
    let t = et(), e = tt(), o = e;
    O = setInterval(() => {
      if (D || !d.size) return;
      const i = et(), c = tt(), u = c === e && c !== o;
      e = c, (Math.abs(z() - Q) > 1e-6 || i !== t || u) && (t = i, o = c, X());
    }, 250);
  }, ht = {
    set(t) {
      D || (b = Array.isArray(t) ? t.filter((e) => e && typeof e.agentKey == "string") : [], X(), Ft());
    },
    expand(t, e) {
      const o = e ?? !A.has(t);
      o ? A.add(t) : A.delete(t), r.onToggle?.(t, o), X();
    },
    shown() {
      return [...d.values()].map((t) => ({
        agentKey: t.key,
        label: t.record.label,
        step: t.step,
        x: t.x,
        y: t.y,
        opacity: t.opacity,
        compact: t.compact,
        lines: t.lines,
        side: t.side ?? { right: !0, down: !0 }
      }));
    },
    destroy() {
      D = !0, H(null), O !== null && clearInterval(O);
      for (const t of d.values()) t.group.remove();
      d.clear(), p?.remove(), p = null;
    }
  };
  return ht;
}
export {
  Mt as AGENT_FADE_MS,
  rt as AGENT_GLIDE_MS,
  mt as AGENT_HOLD_MS,
  At as AGENT_MAX_DRAWN,
  Yt as AGENT_MAX_VISITS,
  $ as AGENT_PALETTE,
  Xt as AGENT_VISIT_MS,
  zt as agentAnchor,
  yt as agentChecklist,
  vt as agentStepText,
  at as agentTagBox,
  jt as agentTagSide,
  Ct as createAgentPresence,
  xt as visibleAgents
};
