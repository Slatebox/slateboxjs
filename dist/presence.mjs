const J = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), vt = 6e3, bt = 600, St = 6, Xt = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, E = (n) => {
  if (n == null) return null;
  const r = n instanceof Date ? n.getTime() : typeof n == "number" ? n : Date.parse(n);
  return Number.isFinite(r) ? r : null;
}, z = (n, r) => n.length > r ? n.slice(0, r - 1).trimEnd() + "…" : n, Y = (n) => String(n ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function kt(n) {
  const r = n.plan?.steps ?? [];
  if (r.length) {
    const y = r.findIndex((l) => l.status === "doing"), M = r.findIndex((l) => l.status === "stopped");
    if (M >= 0) return "Stopped: " + Y(r[M].text);
    if (r.every((l) => l.status === "done" || l.status === "skipped")) return "Done";
    const f = y >= 0 ? y : Math.min(Math.max(n.plan.current ?? 0, 0), r.length - 1);
    return Y(r[f].text);
  }
  return Y(n.message ?? "") || null;
}
function mt(n) {
  return (n.plan?.steps ?? []).map((r) => Xt[r.status] + " " + (r.status === "stopped" ? "Stopped: " : "") + Y(r.text));
}
function Mt(n, r, { holdMs: m = vt, fadeMs: y = bt, max: M = St } = {}) {
  const f = [];
  for (const l of n) {
    if (!l || typeof l.agentKey != "string") continue;
    const d = E(l.expiresAt), A = E(l.endedAt);
    if (l.status === "live" && A === null) {
      if (d === null || r >= d) continue;
      f.push({ record: l, opacity: 1, until: d });
      continue;
    }
    const p = (A ?? E(l.updatedAt) ?? r) + m;
    r >= p + y || f.push({ record: l, opacity: r <= p ? 1 : 1 - (r - p) / y, until: p + y });
  }
  return f.sort((l, d) => (E(d.record.updatedAt) ?? 0) - (E(l.record.updatedAt) ?? 0)), f.slice(0, M);
}
function Yt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const lt = 400, Bt = 250, jt = 5, Q = 240, zt = 600, tt = 40, et = 30, ct = (n, r) => Math.max(0, Math.min(n.x + n.w, r.x + r.w) - Math.max(n.x, r.x)) * Math.max(0, Math.min(n.y + n.h, r.y + r.h) - Math.max(n.y, r.y));
function Pt(n, r, m, y, M, f = []) {
  const l = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let d = l[0], A = 1 / 0;
  for (const b of l) {
    const p = ft(ut(n, r, m, b), y, M, f);
    if (p <= 1e-9) return b;
    p < A && (d = b, A = p);
  }
  return d;
}
function ut(n, r, m, y) {
  const M = y.right ? tt : -(tt + r.w), f = y.down ? et : -(et + r.h);
  return { x: n.x + M / m, y: n.y + f / m, w: r.w / m, h: r.h / m };
}
function At(n, r) {
  const m = z(Y(n.label), 48), y = kt(n), M = y ? z(y, 40) : "", f = Math.max(96, Math.min(Q, 16 + Math.max(7 * m.length, 6.3 * M.length))), l = M ? 38 : 22, d = r ? (n.plan?.steps ?? []).length : 0;
  return { width: f, height: l, w: Math.max(f, d ? Q : 0), h: l + (d ? 18 + d * 18 : 0) };
}
function Ct(n, r, m, y, M = []) {
  const f = Math.min(8, n.w / 4, n.h / 4), l = [
    { x: n.x + n.w - f, y: n.y + n.h - f, side: { right: !0, down: !0 } },
    { x: n.x + f, y: n.y + n.h - f, side: { right: !1, down: !0 } },
    { x: n.x + n.w - f, y: n.y + f, side: { right: !0, down: !1 } },
    { x: n.x + f, y: n.y + f, side: { right: !1, down: !1 } }
  ];
  let d = l[0], A = 1 / 0;
  for (const b of l) {
    const p = ft(ut(b, r, m, b.side), y, [n], M);
    if (p <= 1e-9) return b;
    p < A && (d = b, A = p);
  }
  return d;
}
function ft(n, r, m, y) {
  return (r ? n.w * n.h - ct(n, r) : 0) * 10 + m.reduce((f, l) => f + ct(n, l), 0) * 3 + y.reduce((f, l) => f + ct(n, l), 0);
}
function Ht(n, r = {}) {
  const m = r.now ?? (() => Date.now()), y = r.reducedMotion ?? Yt, M = r.holdMs ?? vt, f = r.fadeMs ?? bt, l = r.maxAgents ?? St, d = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Set();
  let b = [], p = null, P = null, W = null, B = !1, nt = 0;
  const Tt = () => (p && p.node?.isConnected !== !1 && p.node?.parentNode || (p = n.canvas.group(), p.attr({ "data-agent-presence": "", "pointer-events": "none" })), p);
  function dt() {
    try {
      const t = n.canvas.viewbox(), e = n.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !e?.width || !e?.height) return null;
      const o = String(n.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), i = e.width / t.width, c = e.height / t.height, u = o === "none" ? i : /slice/.test(o) ? Math.max(i, c) : Math.min(i, c), g = e.width / u, h = e.height / u;
      return { view: { x: t.x + (t.width - g) / 2, y: t.y + (t.height - h) / 2, w: g, h }, scale: u };
    } catch {
      return null;
    }
  }
  function Z() {
    const t = dt();
    if (t) return t.scale;
    try {
      const e = n.getZoom?.();
      if (typeof e == "number" && e > 0) return e;
    } catch {
    }
    return 1;
  }
  const Nt = () => {
    try {
      return n.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function Lt(t) {
    const o = (n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((i) => i?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function ht(t) {
    const e = t?.options;
    return !e || ![e.x, e.y, e.width, e.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: e.x, y: e.y, w: e.width, h: e.height };
  }
  const It = (t) => n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((e) => e?.options?.name === t), V = () => (n.nodes?.allNodes ?? []).map(ht).filter((t) => !!t), _t = (t, e) => t.x === e.x && t.y === e.y && t.w === e.w && t.h === e.h;
  function ot() {
    return V().map((t) => [t.x, t.y, t.w, t.h].map(Math.round).join(",")).join(";");
  }
  function st() {
    const t = C(), e = Z();
    return t ? [t.x, t.y, t.w, t.h].map((o) => Math.round(o * e / 8)).join(":") : "";
  }
  function C() {
    const t = dt();
    if (t) return t.view;
    try {
      const e = n.canvas.viewbox();
      if (e && [e.x, e.y, e.width, e.height].every((o) => Number.isFinite(o)) && e.width > 0 && e.height > 0)
        return { x: e.x, y: e.y, w: e.width, h: e.height };
    } catch {
    }
    return null;
  }
  function Et(t, e = { w: Q, h: 38 }, o = 1) {
    const i = C();
    if (i) {
      const g = 8 / o, h = t * 64 / o, T = [
        { x: i.x + g, y: i.y + g + h, side: { right: !0, down: !0 } },
        { x: i.x + i.w - g, y: i.y + g + h, side: { right: !1, down: !0 } },
        { x: i.x + g, y: i.y + i.h - g - h, side: { right: !0, down: !1 } },
        { x: i.x + i.w - g, y: i.y + i.h - g - h, side: { right: !1, down: !1 } }
      ], s = V();
      let v = T[0], N = 1 / 0;
      for (const a of T) {
        const k = ft(ut(a, e, o, a.side), i, [], s);
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
  function Ft(t, e, o) {
    const { record: i } = t, c = J[(i.colorIndex % J.length + J.length) % J.length], u = kt(i), g = mt(i), h = g.length > 0 && (t.open || !o), T = z(Y(i.label), 48);
    t.body?.remove();
    const s = t.group.group();
    t.body = s, s.path("M0 0 L14 5 L7 7 L5 14 Z").fill(c).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const v = s.group().attr("data-agent-avatar", ""), N = 11, a = 24, k = 24, U = Array.from({ length: 6 }, (w, _) => {
      const G = Math.PI / 6 + _ * Math.PI / 3;
      return (a + N * Math.cos(G)).toFixed(2) + "," + (k + N * Math.sin(G)).toFixed(2);
    }).join(" ");
    v.polygon(U).fill(c).stroke({ color: "#fff", width: 1.5 }), v.text((w) => w.plain(z(Y(i.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: a, y: k + 4 }), v.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: c, width: 0.8 });
    const S = s.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: g.length ? "pointer" : "default",
      role: "button",
      tabindex: g.length ? 0 : -1,
      "aria-expanded": String(h),
      "aria-label": T + (u ? ": " + u : "")
    }), F = u ? z(u, 40) : "", x = At(i, h), { width: I, height: j } = x, xt = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, L = t.routedSide ?? Pt(xt, x, e, C(), [], V());
    let D = L.right ? tt : -(tt + x.w), K = L.down ? et : -(et + x.h);
    const R = C();
    if (R) {
      const _ = xt, G = (R.x - _.x) * e + 4, O = (R.x + R.w - _.x) * e - 4, X = (R.y - _.y) * e + 4, at = (R.y + R.h - _.y) * e - 4;
      x.w <= O - G && (D = Math.min(Math.max(D, G), O - x.w)), x.h <= at - X && (K = Math.min(Math.max(K, X), at - x.h));
    }
    t.side = L, (!L.right || !L.down) && v.attr("transform", `translate(${L.right ? 0 : -2 * a} ${L.down ? 0 : -2 * k})`), S.attr("data-agent-side", (L.right ? "right" : "left") + "-" + (L.down ? "down" : "up")), S.rect(I, j).radius(7).move(D, K).fill("#fff").stroke({ color: c, width: 1.5 }), S.text((w) => w.plain(T)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(c).attr({ x: D + 8, y: K + 15 }), F && S.text((w) => w.plain(F)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: D + 8, y: K + 31 });
    const wt = (w) => {
      w.stopPropagation?.(), yt.expand(i.agentKey);
    };
    if (S.on("pointerdown", (w) => w.stopPropagation?.()), S.on("click", wt), S.on("keydown", (w) => {
      (w.key === "Enter" || w.key === " ") && (w.preventDefault?.(), wt(w));
    }), h) {
      const w = s.group().attr("data-agent-plan", ""), _ = g.length;
      w.rect(Q, 12 + _ * 18).radius(8).move(D, K + j + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), g.forEach((G, O) => {
        const X = i.plan.steps[O].status;
        w.text((Gt) => Gt.plain(z(G, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: X === "doing" ? 600 : 400 }).fill(X === "done" || X === "skipped" ? "#6b7280" : "#111827").attr({ x: D + 10, y: K + j + 6 + 20 + O * 18 }).attr("data-step-status", X);
      });
    }
    s.element("title").words(T + (u ? " — " + u : "")), t.compact = o, t.lines = g, t.step = u, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), nt = e;
  }
  function gt(t, e) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function rt(t, e, o, i) {
    const c = C(), u = V(), h = t.targets.map((s) => ht(It(s))).filter((s) => !!s).slice(0, jt).map((s) => Ct(s, o, i, c, u.filter((v) => !_t(v, s))));
    if (!h.length) {
      const s = Et(e, o, i);
      return { legs: [{ x: s.x, y: s.y, ms: lt }], side: s.side };
    }
    const T = h.length === 1 ? lt : Bt;
    return { legs: h.map((s) => ({ x: s.x, y: s.y, ms: T })), side: h[h.length - 1].side };
  }
  const it = (t) => t.targets.some((e) => Lt(e) !== null), Dt = (t) => 1 - Math.pow(1 - t, 3);
  function pt(t) {
    let e = !1;
    for (const o of d.values())
      for (; o.path.length; ) {
        const i = o.path[0];
        if (y() || i.ms <= 0) {
          o.x = i.x, o.y = i.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const c = Math.min(1, (t - o.leg.startedAt) / i.ms), u = Dt(c);
        if (o.x = o.leg.fromX + (i.x - o.leg.fromX) * u, o.y = o.leg.fromY + (i.y - o.leg.fromY) * u, c < 1) {
          e = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return e;
  }
  function H() {
    if (B) return;
    const t = m(), e = Mt(b, t, { holdMs: M, fadeMs: f, max: l }), o = new Set(e.map((s) => s.record.agentKey));
    for (const [s, v] of d) o.has(s) || (v.group.remove(), d.delete(s));
    if (!e.length) {
      $(null);
      return;
    }
    const i = Tt();
    i.front?.();
    const c = Z(), u = e.length >= 2 || Nt() < zt;
    e.forEach(({ record: s, opacity: v }, N) => {
      let a = d.get(s.agentKey);
      const k = s.targets.join("\0"), U = A.has(s.agentKey), S = At(s, mt(s).length > 0 && (U || !u)), F = [S.w, S.h, c.toFixed(4), st(), ot()].join(",");
      if (a) {
        if (a.targetsKey !== k || !a.found && it(s)) {
          const x = rt(s, N, S, c);
          a.path = x.legs, a.leg = null, a.found = it(s), a.routedSide = x.side, a.routedFor = F;
        } else if (a.routedFor !== F && a.found) {
          const x = rt(s, N, S, c), I = x.legs[x.legs.length - 1], j = a.path.length ? a.path[a.path.length - 1] : { x: a.x, y: a.y };
          (I.x !== j.x || I.y !== j.y) && (a.path = [{ ...I, ms: lt }], a.leg = null), a.routedSide = x.side, a.routedFor = F;
        }
      } else {
        const x = rt(s, N, S, c), I = x.legs[0];
        a = {
          key: s.agentKey,
          group: i.group().attr({ "data-agent": s.agentKey }),
          body: null,
          record: s,
          targetsKey: k,
          found: it(s),
          x: I.x,
          y: I.y,
          path: x.legs.slice(1),
          leg: null,
          open: U,
          opacity: v,
          compact: u,
          lines: [],
          step: null,
          routedSide: x.side,
          routedFor: F
        }, d.set(s.agentKey, a);
      }
      a.targetsKey = k, a.record = s, a.opacity = Math.max(0, Math.min(1, v)), a.open = A.has(s.agentKey), Ft(a, c, u);
    });
    const g = pt(t);
    for (const s of d.values()) gt(s, c);
    const h = e.some((s) => s.opacity < 1), T = Math.min(...e.map((s) => s.record.status === "live" && E(s.record.endedAt) === null ? s.until : (E(s.record.endedAt) ?? E(s.record.updatedAt) ?? t) + M));
    $(g || h ? "frame" : Math.max(16, T - t));
  }
  function Kt() {
    if (P = null, B) return;
    const t = m(), e = pt(t), o = Z(), i = Mt(b, t, { holdMs: M, fadeMs: f, max: l });
    if (i.some((u) => u.opacity < 1) || d.size !== i.length || Math.abs(o - nt) > 1e-6) {
      H();
      return;
    }
    for (const u of d.values()) gt(u, o);
    e && $("frame");
  }
  function $(t) {
    P !== null && (cancelAnimationFrame(P), P = null), W !== null && (clearTimeout(W), W = null), !(t === null || B) && (t === "frame" ? P = requestAnimationFrame(Kt) : W = setTimeout(H, Math.min(t, 6e4)));
  }
  let q = null;
  const Rt = () => {
    if (q !== null) return;
    let t = st(), e = ot(), o = e;
    q = setInterval(() => {
      if (B || !d.size) return;
      const i = st(), c = ot(), u = c === e && c !== o;
      e = c, (Math.abs(Z() - nt) > 1e-6 || i !== t || u) && (t = i, o = c, H());
    }, 250);
  }, yt = {
    set(t) {
      B || (b = Array.isArray(t) ? t.filter((e) => e && typeof e.agentKey == "string") : [], H(), Rt());
    },
    expand(t, e) {
      const o = e ?? !A.has(t);
      o ? A.add(t) : A.delete(t), r.onToggle?.(t, o), H();
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
      B = !0, $(null), q !== null && clearInterval(q);
      for (const t of d.values()) t.group.remove();
      d.clear(), p?.remove(), p = null;
    }
  };
  return yt;
}
export {
  bt as AGENT_FADE_MS,
  lt as AGENT_GLIDE_MS,
  vt as AGENT_HOLD_MS,
  St as AGENT_MAX_DRAWN,
  jt as AGENT_MAX_VISITS,
  J as AGENT_PALETTE,
  Bt as AGENT_VISIT_MS,
  Ct as agentAnchor,
  mt as agentChecklist,
  kt as agentStepText,
  ut as agentTagBox,
  Pt as agentTagSide,
  Ht as createAgentPresence,
  Mt as visibleAgents
};
