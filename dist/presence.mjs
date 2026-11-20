const W = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), xt = 6e3, wt = 600, mt = 6, Dt = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, _ = (e) => {
  if (e == null) return null;
  const r = e instanceof Date ? e.getTime() : typeof e == "number" ? e : Date.parse(e);
  return Number.isFinite(r) ? r : null;
}, G = (e, r) => e.length > r ? e.slice(0, r - 1).trimEnd() + "…" : e, F = (e) => String(e ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function Mt(e) {
  const r = e.plan?.steps ?? [];
  if (r.length) {
    const y = r.findIndex((l) => l.status === "doing"), w = r.findIndex((l) => l.status === "stopped");
    if (w >= 0) return "Stopped: " + F(r[w].text);
    if (r.every((l) => l.status === "done" || l.status === "skipped")) return "Done";
    const c = y >= 0 ? y : Math.min(Math.max(e.plan.current ?? 0, 0), r.length - 1);
    return F(r[c].text);
  }
  return F(e.message ?? "") || null;
}
function gt(e) {
  return (e.plan?.steps ?? []).map((r) => Dt[r.status] + " " + (r.status === "stopped" ? "Stopped: " : "") + F(r.text));
}
function pt(e, r, { holdMs: x = xt, fadeMs: y = wt, max: w = mt } = {}) {
  const c = [];
  for (const l of e) {
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
const ot = 400, Gt = 250, Kt = 5, Z = 240, Xt = 600, V = 40, $ = 30, st = (e, r) => Math.max(0, Math.min(e.x + e.w, r.x + r.w) - Math.max(e.x, r.x)) * Math.max(0, Math.min(e.y + e.h, r.y + r.h) - Math.max(e.y, r.y));
function Yt(e, r, x, y, w, c = []) {
  const l = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let f = l[0], A = 1 / 0;
  for (const v of l) {
    const p = it(rt(e, r, x, v), y, w, c);
    if (p <= 1e-9) return v;
    p < A && (f = v, A = p);
  }
  return f;
}
function rt(e, r, x, y) {
  const w = y.right ? V : -(V + r.w), c = y.down ? $ : -($ + r.h);
  return { x: e.x + w / x, y: e.y + c / x, w: r.w / x, h: r.h / x };
}
function yt(e, r) {
  const x = G(F(e.label), 48), y = Mt(e), w = y ? G(y, 40) : "", c = Math.max(96, Math.min(Z, 16 + Math.max(7 * x.length, 6.3 * w.length))), l = w ? 38 : 22, f = r ? (e.plan?.steps ?? []).length : 0;
  return { width: c, height: l, w: Math.max(c, f ? Z : 0), h: l + (f ? 18 + f * 18 : 0) };
}
function Bt(e, r, x, y, w = []) {
  const c = Math.min(8, e.w / 4, e.h / 4), l = [
    { x: e.x + e.w - c, y: e.y + e.h - c, side: { right: !0, down: !0 } },
    { x: e.x + c, y: e.y + e.h - c, side: { right: !1, down: !0 } },
    { x: e.x + e.w - c, y: e.y + c, side: { right: !0, down: !1 } },
    { x: e.x + c, y: e.y + c, side: { right: !1, down: !1 } }
  ];
  let f = l[0], A = 1 / 0;
  for (const v of l) {
    const p = it(rt(v, r, x, v.side), y, [e], w);
    if (p <= 1e-9) return v;
    p < A && (f = v, A = p);
  }
  return f;
}
function it(e, r, x, y) {
  return (r ? e.w * e.h - st(e, r) : 0) * 10 + x.reduce((c, l) => c + st(e, l), 0) * 3 + y.reduce((c, l) => c + st(e, l), 0);
}
function Pt(e, r = {}) {
  const x = r.now ?? (() => Date.now()), y = r.reducedMotion ?? Rt, w = r.holdMs ?? xt, c = r.fadeMs ?? wt, l = r.maxAgents ?? mt, f = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Set();
  let v = [], p = null, K = null, z = null, D = !1, q = 0;
  const At = () => (p && p.node?.isConnected !== !1 && p.node?.parentNode || (p = e.canvas.group(), p.attr({ "data-agent-presence": "", "pointer-events": "none" })), p);
  function at() {
    try {
      const t = e.canvas.viewbox(), n = e.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !n?.width || !n?.height) return null;
      const o = String(e.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), i = n.width / t.width, d = n.height / t.height, u = o === "none" ? i : /slice/.test(o) ? Math.max(i, d) : Math.min(i, d), g = n.width / u, h = n.height / u;
      return { view: { x: t.x + (t.width - g) / 2, y: t.y + (t.height - h) / 2, w: g, h }, scale: u };
    } catch {
      return null;
    }
  }
  function U() {
    const t = at();
    if (t) return t.scale;
    try {
      const n = e.getZoom?.();
      if (typeof n == "number" && n > 0) return n;
    } catch {
    }
    return 1;
  }
  const bt = () => {
    try {
      return e.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function vt(t) {
    const o = (e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((i) => i?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function lt(t) {
    const n = t?.options;
    return !n || ![n.x, n.y, n.width, n.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: n.x, y: n.y, w: n.width, h: n.height };
  }
  const St = (t) => e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((n) => n?.options?.name === t), J = () => (e.nodes?.allNodes ?? []).map(lt).filter((t) => !!t), kt = (t, n) => t.x === n.x && t.y === n.y && t.w === n.w && t.h === n.h;
  function Q() {
    const t = at();
    if (t) return t.view;
    try {
      const n = e.canvas.viewbox();
      if (n && [n.x, n.y, n.width, n.height].every((o) => Number.isFinite(o)) && n.width > 0 && n.height > 0)
        return { x: n.x, y: n.y, w: n.width, h: n.height };
    } catch {
    }
    return null;
  }
  function Tt(t, n = { w: Z, h: 38 }, o = 1) {
    const i = Q();
    if (i) {
      const g = 8 / o, h = t * 64 / o, T = [
        { x: i.x + g, y: i.y + g + h, side: { right: !0, down: !0 } },
        { x: i.x + i.w - g, y: i.y + g + h, side: { right: !1, down: !0 } },
        { x: i.x + g, y: i.y + i.h - g - h, side: { right: !0, down: !1 } },
        { x: i.x + i.w - g, y: i.y + i.h - g - h, side: { right: !1, down: !1 } }
      ], s = J();
      let b = T[0], L = 1 / 0;
      for (const a of T) {
        const k = it(rt(a, n, o, a.side), i, [], s);
        if (k <= 1e-9) return a;
        k < L && (b = a, L = k);
      }
      return b;
    }
    let d = 1 / 0, u = 1 / 0;
    for (const g of e.nodes?.allNodes ?? []) {
      const h = g?.options;
      typeof h?.x == "number" && typeof h?.y == "number" && (d = Math.min(d, h.x), u = Math.min(u, h.y));
    }
    return Number.isFinite(d) || (d = 100, u = 100), { x: d - 40, y: u - 40 + t * 64, side: null };
  }
  function Lt(t, n, o) {
    const { record: i } = t, d = W[(i.colorIndex % W.length + W.length) % W.length], u = Mt(i), g = gt(i), h = g.length > 0 && (t.open || !o), T = G(F(i.label), 48);
    t.body?.remove();
    const s = t.group.group();
    t.body = s, s.path("M0 0 L14 5 L7 7 L5 14 Z").fill(d).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const b = s.group().attr("data-agent-avatar", ""), L = 11, a = 24, k = 24, H = Array.from({ length: 6 }, (m, nt) => {
      const O = Math.PI / 6 + nt * Math.PI / 3;
      return (a + L * Math.cos(O)).toFixed(2) + "," + (k + L * Math.sin(O)).toFixed(2);
    }).join(" ");
    b.polygon(H).fill(d).stroke({ color: "#fff", width: 1.5 }), b.text((m) => m.plain(G(F(i.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: a, y: k + 4 }), b.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: d, width: 0.8 });
    const S = s.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: g.length ? "pointer" : "default",
      role: "button",
      tabindex: g.length ? 0 : -1,
      "aria-expanded": String(h),
      "aria-label": T + (u ? ": " + u : "")
    }), E = u ? G(u, 40) : "", M = yt(i, h), { width: N, height: R } = M, Et = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, I = t.routedSide ?? Yt(Et, M, n, Q(), [], J()), Y = I.right ? V : -(V + M.w), B = I.down ? $ : -($ + M.h);
    t.side = I, (!I.right || !I.down) && b.attr("transform", `translate(${I.right ? 0 : -2 * a} ${I.down ? 0 : -2 * k})`), S.attr("data-agent-side", (I.right ? "right" : "left") + "-" + (I.down ? "down" : "up")), S.rect(N, R).radius(7).move(Y, B).fill("#fff").stroke({ color: d, width: 1.5 }), S.text((m) => m.plain(T)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(d).attr({ x: Y + 8, y: B + 15 }), E && S.text((m) => m.plain(E)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: Y + 8, y: B + 31 });
    const dt = (m) => {
      m.stopPropagation?.(), ft.expand(i.agentKey);
    };
    if (S.on("pointerdown", (m) => m.stopPropagation?.()), S.on("click", dt), S.on("keydown", (m) => {
      (m.key === "Enter" || m.key === " ") && (m.preventDefault?.(), dt(m));
    }), h) {
      const m = s.group().attr("data-agent-plan", ""), nt = g.length;
      m.rect(Z, 12 + nt * 18).radius(8).move(Y, B + R + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), g.forEach((O, ht) => {
        const j = i.plan.steps[ht].status;
        m.text((Ft) => Ft.plain(G(O, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: j === "doing" ? 600 : 400 }).fill(j === "done" || j === "skipped" ? "#6b7280" : "#111827").attr({ x: Y + 10, y: B + R + 6 + 20 + ht * 18 }).attr("data-step-status", j);
      });
    }
    s.element("title").words(T + (u ? " — " + u : "")), t.compact = o, t.lines = g, t.step = u, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), q = n;
  }
  function ct(t, n) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function tt(t, n, o, i) {
    const d = Q(), u = J(), h = t.targets.map((s) => lt(St(s))).filter((s) => !!s).slice(0, Kt).map((s) => Bt(s, o, i, d, u.filter((b) => !kt(b, s))));
    if (!h.length) {
      const s = Tt(n, o, i);
      return { legs: [{ x: s.x, y: s.y, ms: ot }], side: s.side };
    }
    const T = h.length === 1 ? ot : Gt;
    return { legs: h.map((s) => ({ x: s.x, y: s.y, ms: T })), side: h[h.length - 1].side };
  }
  const et = (t) => t.targets.some((n) => vt(n) !== null), It = (t) => 1 - Math.pow(1 - t, 3);
  function ut(t) {
    let n = !1;
    for (const o of f.values())
      for (; o.path.length; ) {
        const i = o.path[0];
        if (y() || i.ms <= 0) {
          o.x = i.x, o.y = i.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const d = Math.min(1, (t - o.leg.startedAt) / i.ms), u = It(d);
        if (o.x = o.leg.fromX + (i.x - o.leg.fromX) * u, o.y = o.leg.fromY + (i.y - o.leg.fromY) * u, d < 1) {
          n = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return n;
  }
  function X() {
    if (D) return;
    const t = x(), n = pt(v, t, { holdMs: w, fadeMs: c, max: l }), o = new Set(n.map((s) => s.record.agentKey));
    for (const [s, b] of f) o.has(s) || (b.group.remove(), f.delete(s));
    if (!n.length) {
      P(null);
      return;
    }
    const i = At();
    i.front?.();
    const d = U(), u = n.length >= 2 || bt() < Xt;
    n.forEach(({ record: s, opacity: b }, L) => {
      let a = f.get(s.agentKey);
      const k = s.targets.join("\0"), H = A.has(s.agentKey), S = yt(s, gt(s).length > 0 && (H || !u)), E = [S.w, S.h, d.toFixed(4)].join(",");
      if (a) {
        if (a.targetsKey !== k || !a.found && et(s)) {
          const M = tt(s, L, S, d);
          a.path = M.legs, a.leg = null, a.found = et(s), a.routedSide = M.side, a.routedFor = E;
        } else if (a.routedFor !== E && a.found) {
          const M = tt(s, L, S, d), N = M.legs[M.legs.length - 1], R = a.path.length ? a.path[a.path.length - 1] : { x: a.x, y: a.y };
          (N.x !== R.x || N.y !== R.y) && (a.path = [{ ...N, ms: ot }], a.leg = null), a.routedSide = M.side, a.routedFor = E;
        }
      } else {
        const M = tt(s, L, S, d), N = M.legs[0];
        a = {
          key: s.agentKey,
          group: i.group().attr({ "data-agent": s.agentKey }),
          body: null,
          record: s,
          targetsKey: k,
          found: et(s),
          x: N.x,
          y: N.y,
          path: M.legs.slice(1),
          leg: null,
          open: H,
          opacity: b,
          compact: u,
          lines: [],
          step: null,
          routedSide: M.side,
          routedFor: E
        }, f.set(s.agentKey, a);
      }
      a.targetsKey = k, a.record = s, a.opacity = Math.max(0, Math.min(1, b)), a.open = A.has(s.agentKey), Lt(a, d, u);
    });
    const g = ut(t);
    for (const s of f.values()) ct(s, d);
    const h = n.some((s) => s.opacity < 1), T = Math.min(...n.map((s) => s.record.status === "live" && _(s.record.endedAt) === null ? s.until : (_(s.record.endedAt) ?? _(s.record.updatedAt) ?? t) + w));
    P(g || h ? "frame" : Math.max(16, T - t));
  }
  function Nt() {
    if (K = null, D) return;
    const t = x(), n = ut(t), o = U(), i = pt(v, t, { holdMs: w, fadeMs: c, max: l });
    if (i.some((u) => u.opacity < 1) || f.size !== i.length || Math.abs(o - q) > 1e-6) {
      X();
      return;
    }
    for (const u of f.values()) ct(u, o);
    n && P("frame");
  }
  function P(t) {
    K !== null && (cancelAnimationFrame(K), K = null), z !== null && (clearTimeout(z), z = null), !(t === null || D) && (t === "frame" ? K = requestAnimationFrame(Nt) : z = setTimeout(X, Math.min(t, 6e4)));
  }
  let C = null;
  const _t = () => {
    C === null && (C = setInterval(() => {
      D || !f.size || Math.abs(U() - q) > 1e-6 && X();
    }, 250));
  }, ft = {
    set(t) {
      D || (v = Array.isArray(t) ? t.filter((n) => n && typeof n.agentKey == "string") : [], X(), _t());
    },
    expand(t, n) {
      const o = n ?? !A.has(t);
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
      D = !0, P(null), C !== null && clearInterval(C);
      for (const t of f.values()) t.group.remove();
      f.clear(), p?.remove(), p = null;
    }
  };
  return ft;
}
export {
  wt as AGENT_FADE_MS,
  ot as AGENT_GLIDE_MS,
  xt as AGENT_HOLD_MS,
  mt as AGENT_MAX_DRAWN,
  Kt as AGENT_MAX_VISITS,
  W as AGENT_PALETTE,
  Gt as AGENT_VISIT_MS,
  Bt as agentAnchor,
  gt as agentChecklist,
  Mt as agentStepText,
  rt as agentTagBox,
  Yt as agentTagSide,
  Pt as createAgentPresence,
  pt as visibleAgents
};
