const V = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), wt = 6e3, mt = 600, Mt = 6, Kt = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, _ = (n) => {
  if (n == null) return null;
  const r = n instanceof Date ? n.getTime() : typeof n == "number" ? n : Date.parse(n);
  return Number.isFinite(r) ? r : null;
}, R = (n, r) => n.length > r ? n.slice(0, r - 1).trimEnd() + "…" : n, F = (n) => String(n ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function At(n) {
  const r = n.plan?.steps ?? [];
  if (r.length) {
    const y = r.findIndex((l) => l.status === "doing"), w = r.findIndex((l) => l.status === "stopped");
    if (w >= 0) return "Stopped: " + F(r[w].text);
    if (r.every((l) => l.status === "done" || l.status === "skipped")) return "Done";
    const c = y >= 0 ? y : Math.min(Math.max(n.plan.current ?? 0, 0), r.length - 1);
    return F(r[c].text);
  }
  return F(n.message ?? "") || null;
}
function pt(n) {
  return (n.plan?.steps ?? []).map((r) => Kt[r.status] + " " + (r.status === "stopped" ? "Stopped: " : "") + F(r.text));
}
function yt(n, r, { holdMs: x = wt, fadeMs: y = mt, max: w = Mt } = {}) {
  const c = [];
  for (const l of n) {
    if (!l || typeof l.agentKey != "string") continue;
    const f = _(l.expiresAt), A = _(l.endedAt);
    if (l.status === "live" && A === null) {
      if (f === null || r >= f) continue;
      c.push({ record: l, opacity: 1, until: f });
      continue;
    }
    const p = (A ?? _(l.updatedAt) ?? r) + x;
    r >= p + y || c.push({ record: l, opacity: r <= p ? 1 : 1 - (r - p) / y, until: p + y });
  }
  return c.sort((l, f) => (_(f.record.updatedAt) ?? 0) - (_(l.record.updatedAt) ?? 0)), c.slice(0, w);
}
function Rt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const st = 400, Gt = 250, Xt = 5, $ = 240, Yt = 600, q = 40, U = 30, rt = (n, r) => Math.max(0, Math.min(n.x + n.w, r.x + r.w) - Math.max(n.x, r.x)) * Math.max(0, Math.min(n.y + n.h, r.y + r.h) - Math.max(n.y, r.y));
function Bt(n, r, x, y, w, c = []) {
  const l = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let f = l[0], A = 1 / 0;
  for (const v of l) {
    const p = at(it(n, r, x, v), y, w, c);
    if (p <= 1e-9) return v;
    p < A && (f = v, A = p);
  }
  return f;
}
function it(n, r, x, y) {
  const w = y.right ? q : -(q + r.w), c = y.down ? U : -(U + r.h);
  return { x: n.x + w / x, y: n.y + c / x, w: r.w / x, h: r.h / x };
}
function xt(n, r) {
  const x = R(F(n.label), 48), y = At(n), w = y ? R(y, 40) : "", c = Math.max(96, Math.min($, 16 + Math.max(7 * x.length, 6.3 * w.length))), l = w ? 38 : 22, f = r ? (n.plan?.steps ?? []).length : 0;
  return { width: c, height: l, w: Math.max(c, f ? $ : 0), h: l + (f ? 18 + f * 18 : 0) };
}
function zt(n, r, x, y, w = []) {
  const c = Math.min(8, n.w / 4, n.h / 4), l = [
    { x: n.x + n.w - c, y: n.y + n.h - c, side: { right: !0, down: !0 } },
    { x: n.x + c, y: n.y + n.h - c, side: { right: !1, down: !0 } },
    { x: n.x + n.w - c, y: n.y + c, side: { right: !0, down: !1 } },
    { x: n.x + c, y: n.y + c, side: { right: !1, down: !1 } }
  ];
  let f = l[0], A = 1 / 0;
  for (const v of l) {
    const p = at(it(v, r, x, v.side), y, [n], w);
    if (p <= 1e-9) return v;
    p < A && (f = v, A = p);
  }
  return f;
}
function at(n, r, x, y) {
  return (r ? n.w * n.h - rt(n, r) : 0) * 10 + x.reduce((c, l) => c + rt(n, l), 0) * 3 + y.reduce((c, l) => c + rt(n, l), 0);
}
function Ct(n, r = {}) {
  const x = r.now ?? (() => Date.now()), y = r.reducedMotion ?? Rt, w = r.holdMs ?? wt, c = r.fadeMs ?? mt, l = r.maxAgents ?? Mt, f = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Set();
  let v = [], p = null, G = null, z = null, D = !1, J = 0;
  const bt = () => (p && p.node?.isConnected !== !1 && p.node?.parentNode || (p = n.canvas.group(), p.attr({ "data-agent-presence": "", "pointer-events": "none" })), p);
  function lt() {
    try {
      const t = n.canvas.viewbox(), e = n.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !e?.width || !e?.height) return null;
      const o = String(n.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), i = e.width / t.width, d = e.height / t.height, u = o === "none" ? i : /slice/.test(o) ? Math.max(i, d) : Math.min(i, d), g = e.width / u, h = e.height / u;
      return { view: { x: t.x + (t.width - g) / 2, y: t.y + (t.height - h) / 2, w: g, h }, scale: u };
    } catch {
      return null;
    }
  }
  function P() {
    const t = lt();
    if (t) return t.scale;
    try {
      const e = n.getZoom?.();
      if (typeof e == "number" && e > 0) return e;
    } catch {
    }
    return 1;
  }
  const vt = () => {
    try {
      return n.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function St(t) {
    const o = (n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((i) => i?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function ct(t) {
    const e = t?.options;
    return !e || ![e.x, e.y, e.width, e.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: e.x, y: e.y, w: e.width, h: e.height };
  }
  const kt = (t) => n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((e) => e?.options?.name === t), Q = () => (n.nodes?.allNodes ?? []).map(ct).filter((t) => !!t), Tt = (t, e) => t.x === e.x && t.y === e.y && t.w === e.w && t.h === e.h;
  function tt() {
    const t = C(), e = P();
    return t ? [t.x, t.y, t.w, t.h].map((o) => Math.round(o * e / 8)).join(":") : "";
  }
  function C() {
    const t = lt();
    if (t) return t.view;
    try {
      const e = n.canvas.viewbox();
      if (e && [e.x, e.y, e.width, e.height].every((o) => Number.isFinite(o)) && e.width > 0 && e.height > 0)
        return { x: e.x, y: e.y, w: e.width, h: e.height };
    } catch {
    }
    return null;
  }
  function Lt(t, e = { w: $, h: 38 }, o = 1) {
    const i = C();
    if (i) {
      const g = 8 / o, h = t * 64 / o, T = [
        { x: i.x + g, y: i.y + g + h, side: { right: !0, down: !0 } },
        { x: i.x + i.w - g, y: i.y + g + h, side: { right: !1, down: !0 } },
        { x: i.x + g, y: i.y + i.h - g - h, side: { right: !0, down: !1 } },
        { x: i.x + i.w - g, y: i.y + i.h - g - h, side: { right: !1, down: !1 } }
      ], s = Q();
      let b = T[0], L = 1 / 0;
      for (const a of T) {
        const k = at(it(a, e, o, a.side), i, [], s);
        if (k <= 1e-9) return a;
        k < L && (b = a, L = k);
      }
      return b;
    }
    let d = 1 / 0, u = 1 / 0;
    for (const g of n.nodes?.allNodes ?? []) {
      const h = g?.options;
      typeof h?.x == "number" && typeof h?.y == "number" && (d = Math.min(d, h.x), u = Math.min(u, h.y));
    }
    return Number.isFinite(d) || (d = 100, u = 100), { x: d - 40, y: u - 40 + t * 64, side: null };
  }
  function It(t, e, o) {
    const { record: i } = t, d = V[(i.colorIndex % V.length + V.length) % V.length], u = At(i), g = pt(i), h = g.length > 0 && (t.open || !o), T = R(F(i.label), 48);
    t.body?.remove();
    const s = t.group.group();
    t.body = s, s.path("M0 0 L14 5 L7 7 L5 14 Z").fill(d).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const b = s.group().attr("data-agent-avatar", ""), L = 11, a = 24, k = 24, O = Array.from({ length: 6 }, (m, ot) => {
      const W = Math.PI / 6 + ot * Math.PI / 3;
      return (a + L * Math.cos(W)).toFixed(2) + "," + (k + L * Math.sin(W)).toFixed(2);
    }).join(" ");
    b.polygon(O).fill(d).stroke({ color: "#fff", width: 1.5 }), b.text((m) => m.plain(R(F(i.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: a, y: k + 4 }), b.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: d, width: 0.8 });
    const S = s.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: g.length ? "pointer" : "default",
      role: "button",
      tabindex: g.length ? 0 : -1,
      "aria-expanded": String(h),
      "aria-label": T + (u ? ": " + u : "")
    }), E = u ? R(u, 40) : "", M = xt(i, h), { width: N, height: K } = M, Ft = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, I = t.routedSide ?? Bt(Ft, M, e, C(), [], Q()), Y = I.right ? q : -(q + M.w), B = I.down ? U : -(U + M.h);
    t.side = I, (!I.right || !I.down) && b.attr("transform", `translate(${I.right ? 0 : -2 * a} ${I.down ? 0 : -2 * k})`), S.attr("data-agent-side", (I.right ? "right" : "left") + "-" + (I.down ? "down" : "up")), S.rect(N, K).radius(7).move(Y, B).fill("#fff").stroke({ color: d, width: 1.5 }), S.text((m) => m.plain(T)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(d).attr({ x: Y + 8, y: B + 15 }), E && S.text((m) => m.plain(E)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: Y + 8, y: B + 31 });
    const ht = (m) => {
      m.stopPropagation?.(), dt.expand(i.agentKey);
    };
    if (S.on("pointerdown", (m) => m.stopPropagation?.()), S.on("click", ht), S.on("keydown", (m) => {
      (m.key === "Enter" || m.key === " ") && (m.preventDefault?.(), ht(m));
    }), h) {
      const m = s.group().attr("data-agent-plan", ""), ot = g.length;
      m.rect($, 12 + ot * 18).radius(8).move(Y, B + K + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), g.forEach((W, gt) => {
        const Z = i.plan.steps[gt].status;
        m.text((Dt) => Dt.plain(R(W, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: Z === "doing" ? 600 : 400 }).fill(Z === "done" || Z === "skipped" ? "#6b7280" : "#111827").attr({ x: Y + 10, y: B + K + 6 + 20 + gt * 18 }).attr("data-step-status", Z);
      });
    }
    s.element("title").words(T + (u ? " — " + u : "")), t.compact = o, t.lines = g, t.step = u, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), J = e;
  }
  function ut(t, e) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function et(t, e, o, i) {
    const d = C(), u = Q(), h = t.targets.map((s) => ct(kt(s))).filter((s) => !!s).slice(0, Xt).map((s) => zt(s, o, i, d, u.filter((b) => !Tt(b, s))));
    if (!h.length) {
      const s = Lt(e, o, i);
      return { legs: [{ x: s.x, y: s.y, ms: st }], side: s.side };
    }
    const T = h.length === 1 ? st : Gt;
    return { legs: h.map((s) => ({ x: s.x, y: s.y, ms: T })), side: h[h.length - 1].side };
  }
  const nt = (t) => t.targets.some((e) => St(e) !== null), Nt = (t) => 1 - Math.pow(1 - t, 3);
  function ft(t) {
    let e = !1;
    for (const o of f.values())
      for (; o.path.length; ) {
        const i = o.path[0];
        if (y() || i.ms <= 0) {
          o.x = i.x, o.y = i.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const d = Math.min(1, (t - o.leg.startedAt) / i.ms), u = Nt(d);
        if (o.x = o.leg.fromX + (i.x - o.leg.fromX) * u, o.y = o.leg.fromY + (i.y - o.leg.fromY) * u, d < 1) {
          e = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return e;
  }
  function X() {
    if (D) return;
    const t = x(), e = yt(v, t, { holdMs: w, fadeMs: c, max: l }), o = new Set(e.map((s) => s.record.agentKey));
    for (const [s, b] of f) o.has(s) || (b.group.remove(), f.delete(s));
    if (!e.length) {
      H(null);
      return;
    }
    const i = bt();
    i.front?.();
    const d = P(), u = e.length >= 2 || vt() < Yt;
    e.forEach(({ record: s, opacity: b }, L) => {
      let a = f.get(s.agentKey);
      const k = s.targets.join("\0"), O = A.has(s.agentKey), S = xt(s, pt(s).length > 0 && (O || !u)), E = [S.w, S.h, d.toFixed(4), tt()].join(",");
      if (a) {
        if (a.targetsKey !== k || !a.found && nt(s)) {
          const M = et(s, L, S, d);
          a.path = M.legs, a.leg = null, a.found = nt(s), a.routedSide = M.side, a.routedFor = E;
        } else if (a.routedFor !== E && a.found) {
          const M = et(s, L, S, d), N = M.legs[M.legs.length - 1], K = a.path.length ? a.path[a.path.length - 1] : { x: a.x, y: a.y };
          (N.x !== K.x || N.y !== K.y) && (a.path = [{ ...N, ms: st }], a.leg = null), a.routedSide = M.side, a.routedFor = E;
        }
      } else {
        const M = et(s, L, S, d), N = M.legs[0];
        a = {
          key: s.agentKey,
          group: i.group().attr({ "data-agent": s.agentKey }),
          body: null,
          record: s,
          targetsKey: k,
          found: nt(s),
          x: N.x,
          y: N.y,
          path: M.legs.slice(1),
          leg: null,
          open: O,
          opacity: b,
          compact: u,
          lines: [],
          step: null,
          routedSide: M.side,
          routedFor: E
        }, f.set(s.agentKey, a);
      }
      a.targetsKey = k, a.record = s, a.opacity = Math.max(0, Math.min(1, b)), a.open = A.has(s.agentKey), It(a, d, u);
    });
    const g = ft(t);
    for (const s of f.values()) ut(s, d);
    const h = e.some((s) => s.opacity < 1), T = Math.min(...e.map((s) => s.record.status === "live" && _(s.record.endedAt) === null ? s.until : (_(s.record.endedAt) ?? _(s.record.updatedAt) ?? t) + w));
    H(g || h ? "frame" : Math.max(16, T - t));
  }
  function _t() {
    if (G = null, D) return;
    const t = x(), e = ft(t), o = P(), i = yt(v, t, { holdMs: w, fadeMs: c, max: l });
    if (i.some((u) => u.opacity < 1) || f.size !== i.length || Math.abs(o - J) > 1e-6) {
      X();
      return;
    }
    for (const u of f.values()) ut(u, o);
    e && H("frame");
  }
  function H(t) {
    G !== null && (cancelAnimationFrame(G), G = null), z !== null && (clearTimeout(z), z = null), !(t === null || D) && (t === "frame" ? G = requestAnimationFrame(_t) : z = setTimeout(X, Math.min(t, 6e4)));
  }
  let j = null;
  const Et = () => {
    if (j !== null) return;
    let t = tt();
    j = setInterval(() => {
      if (D || !f.size) return;
      const e = tt();
      (Math.abs(P() - J) > 1e-6 || e !== t) && (t = e, X());
    }, 250);
  }, dt = {
    set(t) {
      D || (v = Array.isArray(t) ? t.filter((e) => e && typeof e.agentKey == "string") : [], X(), Et());
    },
    expand(t, e) {
      const o = e ?? !A.has(t);
      o ? A.add(t) : A.delete(t), r.onToggle?.(t, o), X();
    },
    shown() {
      return [...f.values()].map((t) => ({
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
      D = !0, H(null), j !== null && clearInterval(j);
      for (const t of f.values()) t.group.remove();
      f.clear(), p?.remove(), p = null;
    }
  };
  return dt;
}
export {
  mt as AGENT_FADE_MS,
  st as AGENT_GLIDE_MS,
  wt as AGENT_HOLD_MS,
  Mt as AGENT_MAX_DRAWN,
  Xt as AGENT_MAX_VISITS,
  V as AGENT_PALETTE,
  Gt as AGENT_VISIT_MS,
  zt as agentAnchor,
  pt as agentChecklist,
  At as agentStepText,
  it as agentTagBox,
  Bt as agentTagSide,
  Ct as createAgentPresence,
  yt as visibleAgents
};
