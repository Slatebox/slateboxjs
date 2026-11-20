const W = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), gt = 6e3, pt = 600, yt = 6, Ft = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, L = (e) => {
  if (e == null) return null;
  const s = e instanceof Date ? e.getTime() : typeof e == "number" ? e : Date.parse(e);
  return Number.isFinite(s) ? s : null;
}, K = (e, s) => e.length > s ? e.slice(0, s - 1).trimEnd() + "…" : e, E = (e) => String(e ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function xt(e) {
  const s = e.plan?.steps ?? [];
  if (s.length) {
    const h = s.findIndex((i) => i.status === "doing"), y = s.findIndex((i) => i.status === "stopped");
    if (y >= 0) return "Stopped: " + E(s[y].text);
    if (s.every((i) => i.status === "done" || i.status === "skipped")) return "Done";
    const c = h >= 0 ? h : Math.min(Math.max(e.plan.current ?? 0, 0), s.length - 1);
    return E(s[c].text);
  }
  return E(e.message ?? "") || null;
}
function ft(e) {
  return (e.plan?.steps ?? []).map((s) => Ft[s.status] + " " + (s.status === "stopped" ? "Stopped: " : "") + E(s.text));
}
function dt(e, s, { holdMs: p = gt, fadeMs: h = pt, max: y = yt } = {}) {
  const c = [];
  for (const i of e) {
    if (!i || typeof i.agentKey != "string") continue;
    const u = L(i.expiresAt), m = L(i.endedAt);
    if (i.status === "live" && m === null) {
      if (u === null || s >= u) continue;
      c.push({ record: i, opacity: 1, until: u });
      continue;
    }
    const d = (m ?? L(i.updatedAt) ?? s) + p;
    s >= d + h || c.push({ record: i, opacity: s <= d ? 1 : 1 - (s - d) / h, until: d + h });
  }
  return c.sort((i, u) => (L(u.record.updatedAt) ?? 0) - (L(i.record.updatedAt) ?? 0)), c.slice(0, y);
}
function Dt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const tt = 400, Gt = 250, Kt = 5, nt = 240, Rt = 600, Z = 40, V = 30, et = (e, s) => Math.max(0, Math.min(e.x + e.w, s.x + s.w) - Math.max(e.x, s.x)) * Math.max(0, Math.min(e.y + e.h, s.y + s.h) - Math.max(e.y, s.y));
function Xt(e, s, p, h, y, c = []) {
  const i = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let u = i[0], m = 1 / 0;
  for (const M of i) {
    const d = mt(wt(e, s, p, M), h, y, c);
    if (d <= 1e-9) return M;
    d < m && (u = M, m = d);
  }
  return u;
}
function wt(e, s, p, h) {
  const y = h.right ? Z : -(Z + s.w), c = h.down ? V : -(V + s.h);
  return { x: e.x + y / p, y: e.y + c / p, w: s.w / p, h: s.h / p };
}
function ht(e, s) {
  const p = K(E(e.label), 48), h = xt(e), y = h ? K(h, 40) : "", c = Math.max(96, Math.min(nt, 16 + 6.6 * Math.max(p.length, y.length))), i = y ? 38 : 22, u = s ? (e.plan?.steps ?? []).length : 0;
  return { width: c, height: i, w: Math.max(c, u ? nt : 0), h: i + (u ? 18 + u * 18 : 0) };
}
function Yt(e, s, p, h, y = []) {
  const c = Math.min(8, e.w / 4, e.h / 4), i = [
    { x: e.x + e.w - c, y: e.y + e.h - c, side: { right: !0, down: !0 } },
    { x: e.x + c, y: e.y + e.h - c, side: { right: !1, down: !0 } },
    { x: e.x + e.w - c, y: e.y + c, side: { right: !0, down: !1 } },
    { x: e.x + c, y: e.y + c, side: { right: !1, down: !1 } }
  ];
  let u = i[0], m = 1 / 0;
  for (const M of i) {
    const d = mt(wt(M, s, p, M.side), h, [e], y);
    if (d <= 1e-9) return M;
    d < m && (u = M, m = d);
  }
  return u;
}
function mt(e, s, p, h) {
  return (s ? e.w * e.h - et(e, s) : 0) * 10 + p.reduce((c, i) => c + et(e, i), 0) * 3 + h.reduce((c, i) => c + et(e, i), 0);
}
function Bt(e, s = {}) {
  const p = s.now ?? (() => Date.now()), h = s.reducedMotion ?? Dt, y = s.holdMs ?? gt, c = s.fadeMs ?? pt, i = s.maxAgents ?? yt, u = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set();
  let M = [], d = null, R = null, B = null, F = !1, $ = 0;
  const Mt = () => (d && d.node?.isConnected !== !1 && d.node?.parentNode || (d = e.canvas.group(), d.attr({ "data-agent-presence": "", "pointer-events": "none" })), d);
  function q() {
    try {
      const t = e.canvas.viewbox(), n = e.canvas.node?.getBoundingClientRect?.().width || 0;
      if (t?.width && n) return n / t.width;
    } catch {
    }
    try {
      const t = e.getZoom?.();
      if (typeof t == "number" && t > 0) return t;
    } catch {
    }
    return 1;
  }
  const At = () => {
    try {
      return e.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function bt(t) {
    const o = (e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((a) => a?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function ot(t) {
    const n = t?.options;
    return !n || ![n.x, n.y, n.width, n.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: n.x, y: n.y, w: n.width, h: n.height };
  }
  const vt = (t) => e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((n) => n?.options?.name === t), st = () => (e.nodes?.allNodes ?? []).map(ot).filter((t) => !!t), St = (t, n) => t.x === n.x && t.y === n.y && t.w === n.w && t.h === n.h;
  function rt() {
    try {
      const t = e.canvas.viewbox();
      if (t && [t.x, t.y, t.width, t.height].every((n) => Number.isFinite(n)) && t.width > 0 && t.height > 0)
        return { x: t.x, y: t.y, w: t.width, h: t.height };
    } catch {
    }
    return null;
  }
  function kt(t) {
    let n = 1 / 0, o = 1 / 0;
    for (const a of e.nodes?.allNodes ?? []) {
      const f = a?.options;
      typeof f?.x == "number" && typeof f?.y == "number" && (n = Math.min(n, f.x), o = Math.min(o, f.y));
    }
    if (!Number.isFinite(n))
      try {
        const a = e.canvas.viewbox();
        n = a.x + a.width * 0.25, o = a.y + a.height * 0.25;
      } catch {
        n = 100, o = 100;
      }
    return { x: n - 40, y: o - 40 + t * 64 };
  }
  function Tt(t, n, o) {
    const { record: a } = t, f = W[(a.colorIndex % W.length + W.length) % W.length], g = xt(a), S = ft(a), b = S.length > 0 && (t.open || !o), N = K(E(a.label), 48);
    t.body?.remove();
    const r = t.group.group();
    t.body = r, r.path("M0 0 L14 5 L7 7 L5 14 Z").fill(f).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const v = r.group().attr("data-agent-avatar", ""), D = 11, l = 24, I = 24, H = Array.from({ length: 6 }, (x, Q) => {
      const O = Math.PI / 6 + Q * Math.PI / 3;
      return (l + D * Math.cos(O)).toFixed(2) + "," + (I + D * Math.sin(O)).toFixed(2);
    }).join(" ");
    v.polygon(H).fill(f).stroke({ color: "#fff", width: 1.5 }), v.text((x) => x.plain(K(E(a.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: l, y: I + 4 }), v.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: f, width: 0.8 });
    const A = r.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: S.length ? "pointer" : "default",
      role: "button",
      tabindex: S.length ? 0 : -1,
      "aria-expanded": String(b),
      "aria-label": N + (g ? ": " + g : "")
    }), _ = g ? K(g, 40) : "", w = ht(a, b), { width: T, height: G } = w, _t = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, k = t.routedSide ?? Xt(_t, w, n, rt(), [], st()), Y = k.right ? Z : -(Z + w.w), z = k.down ? V : -(V + w.h);
    t.side = k, (!k.right || !k.down) && v.attr("transform", `translate(${k.right ? 0 : -2 * l} ${k.down ? 0 : -2 * I})`), A.attr("data-agent-side", (k.right ? "right" : "left") + "-" + (k.down ? "down" : "up")), A.rect(T, G).radius(7).move(Y, z).fill("#fff").stroke({ color: f, width: 1.5 }), A.text((x) => x.plain(N)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(f).attr({ x: Y + 8, y: z + 15 }), _ && A.text((x) => x.plain(_)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: Y + 8, y: z + 31 });
    const ct = (x) => {
      x.stopPropagation?.(), lt.expand(a.agentKey);
    };
    if (A.on("pointerdown", (x) => x.stopPropagation?.()), A.on("click", ct), A.on("keydown", (x) => {
      (x.key === "Enter" || x.key === " ") && (x.preventDefault?.(), ct(x));
    }), b) {
      const x = r.group().attr("data-agent-plan", ""), Q = S.length;
      x.rect(nt, 12 + Q * 18).radius(8).move(Y, z + G + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), S.forEach((O, ut) => {
        const j = a.plan.steps[ut].status;
        x.text((Et) => Et.plain(K(O, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: j === "doing" ? 600 : 400 }).fill(j === "done" || j === "skipped" ? "#6b7280" : "#111827").attr({ x: Y + 10, y: z + G + 6 + 20 + ut * 18 }).attr("data-step-status", j);
      });
    }
    r.element("title").words(N + (g ? " — " + g : "")), t.compact = o, t.lines = S, t.step = g, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), $ = n;
  }
  function it(t, n) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function U(t, n, o, a) {
    const f = rt(), g = st(), b = t.targets.map((r) => ot(vt(r))).filter((r) => !!r).slice(0, Kt).map((r) => Yt(r, o, a, f, g.filter((v) => !St(v, r))));
    if (!b.length)
      return { legs: [{ ...kt(n), ms: tt }], side: null };
    const N = b.length === 1 ? tt : Gt;
    return { legs: b.map((r) => ({ x: r.x, y: r.y, ms: N })), side: b[b.length - 1].side };
  }
  const J = (t) => t.targets.some((n) => bt(n) !== null), Lt = (t) => 1 - Math.pow(1 - t, 3);
  function at(t) {
    let n = !1;
    for (const o of u.values())
      for (; o.path.length; ) {
        const a = o.path[0];
        if (h() || a.ms <= 0) {
          o.x = a.x, o.y = a.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const f = Math.min(1, (t - o.leg.startedAt) / a.ms), g = Lt(f);
        if (o.x = o.leg.fromX + (a.x - o.leg.fromX) * g, o.y = o.leg.fromY + (a.y - o.leg.fromY) * g, f < 1) {
          n = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return n;
  }
  function X() {
    if (F) return;
    const t = p(), n = dt(M, t, { holdMs: y, fadeMs: c, max: i }), o = new Set(n.map((r) => r.record.agentKey));
    for (const [r, v] of u) o.has(r) || (v.group.remove(), u.delete(r));
    if (!n.length) {
      P(null);
      return;
    }
    const a = Mt();
    a.front?.();
    const f = q(), g = n.length >= 2 || At() < Rt;
    n.forEach(({ record: r, opacity: v }, D) => {
      let l = u.get(r.agentKey);
      const I = r.targets.join("\0"), H = m.has(r.agentKey), A = ht(r, ft(r).length > 0 && (H || !g)), _ = [A.w, A.h, f.toFixed(4)].join(",");
      if (l) {
        if (l.targetsKey !== I || !l.found && J(r)) {
          const w = U(r, D, A, f);
          l.path = w.legs, l.leg = null, l.found = J(r), l.routedSide = w.side, l.routedFor = _;
        } else if (l.routedFor !== _ && l.found) {
          const w = U(r, D, A, f), T = w.legs[w.legs.length - 1], G = l.path.length ? l.path[l.path.length - 1] : { x: l.x, y: l.y };
          (T.x !== G.x || T.y !== G.y) && (l.path = [{ ...T, ms: tt }], l.leg = null), l.routedSide = w.side, l.routedFor = _;
        }
      } else {
        const w = U(r, D, A, f), T = w.legs[0];
        l = {
          key: r.agentKey,
          group: a.group().attr({ "data-agent": r.agentKey }),
          body: null,
          record: r,
          targetsKey: I,
          found: J(r),
          x: T.x,
          y: T.y,
          path: w.legs.slice(1),
          leg: null,
          open: H,
          opacity: v,
          compact: g,
          lines: [],
          step: null,
          routedSide: w.side,
          routedFor: _
        }, u.set(r.agentKey, l);
      }
      l.targetsKey = I, l.record = r, l.opacity = Math.max(0, Math.min(1, v)), l.open = m.has(r.agentKey), Tt(l, f, g);
    });
    const S = at(t);
    for (const r of u.values()) it(r, f);
    const b = n.some((r) => r.opacity < 1), N = Math.min(...n.map((r) => r.record.status === "live" && L(r.record.endedAt) === null ? r.until : (L(r.record.endedAt) ?? L(r.record.updatedAt) ?? t) + y));
    P(S || b ? "frame" : Math.max(16, N - t));
  }
  function Nt() {
    if (R = null, F) return;
    const t = p(), n = at(t), o = q(), a = dt(M, t, { holdMs: y, fadeMs: c, max: i });
    if (a.some((g) => g.opacity < 1) || u.size !== a.length || Math.abs(o - $) > 1e-6) {
      X();
      return;
    }
    for (const g of u.values()) it(g, o);
    n && P("frame");
  }
  function P(t) {
    R !== null && (cancelAnimationFrame(R), R = null), B !== null && (clearTimeout(B), B = null), !(t === null || F) && (t === "frame" ? R = requestAnimationFrame(Nt) : B = setTimeout(X, Math.min(t, 6e4)));
  }
  let C = null;
  const It = () => {
    C === null && (C = setInterval(() => {
      F || !u.size || Math.abs(q() - $) > 1e-6 && X();
    }, 250));
  }, lt = {
    set(t) {
      F || (M = Array.isArray(t) ? t.filter((n) => n && typeof n.agentKey == "string") : [], X(), It());
    },
    expand(t, n) {
      const o = n ?? !m.has(t);
      o ? m.add(t) : m.delete(t), s.onToggle?.(t, o), X();
    },
    shown() {
      return [...u.values()].map((t) => ({
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
      F = !0, P(null), C !== null && clearInterval(C);
      for (const t of u.values()) t.group.remove();
      u.clear(), d?.remove(), d = null;
    }
  };
  return lt;
}
export {
  pt as AGENT_FADE_MS,
  tt as AGENT_GLIDE_MS,
  gt as AGENT_HOLD_MS,
  yt as AGENT_MAX_DRAWN,
  Kt as AGENT_MAX_VISITS,
  W as AGENT_PALETTE,
  Gt as AGENT_VISIT_MS,
  Yt as agentAnchor,
  ft as agentChecklist,
  xt as agentStepText,
  wt as agentTagBox,
  Xt as agentTagSide,
  Bt as createAgentPresence,
  dt as visibleAgents
};
