const et = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), St = 6e3, kt = 600, Tt = 6, Bt = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, E = (n) => {
  if (n == null) return null;
  const r = n instanceof Date ? n.getTime() : typeof n == "number" ? n : Date.parse(n);
  return Number.isFinite(r) ? r : null;
}, H = (n, r) => n.length > r ? n.slice(0, r - 1).trimEnd() + "…" : n, Y = (n) => String(n ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function Nt(n) {
  const r = n.plan?.steps ?? [];
  if (r.length) {
    const x = r.findIndex((l) => l.status === "doing"), M = r.findIndex((l) => l.status === "stopped");
    if (M >= 0) return "Stopped: " + Y(r[M].text);
    if (r.every((l) => l.status === "done" || l.status === "skipped")) return "Done";
    const u = x >= 0 ? x : Math.min(Math.max(n.plan.current ?? 0, 0), r.length - 1);
    return Y(r[u].text);
  }
  return Y(n.message ?? "") || null;
}
function At(n) {
  return (n.plan?.steps ?? []).map((r) => Bt[r.status] + " " + (r.status === "stopped" ? "Stopped: " : "") + Y(r.text));
}
function vt(n, r, { holdMs: m = St, fadeMs: x = kt, max: M = Tt } = {}) {
  const u = [];
  for (const l of n) {
    if (!l || typeof l.agentKey != "string") continue;
    const d = E(l.expiresAt), A = E(l.endedAt);
    if (l.status === "live" && A === null) {
      if (d === null || r >= d) continue;
      u.push({ record: l, opacity: 1, until: d });
      continue;
    }
    const y = (A ?? E(l.updatedAt) ?? r) + m;
    r >= y + x || u.push({ record: l, opacity: r <= y ? 1 : 1 - (r - y) / x, until: y + x });
  }
  return u.sort((l, d) => (E(d.record.updatedAt) ?? 0) - (E(l.record.updatedAt) ?? 0)), u.slice(0, M);
}
function jt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const ut = 400, zt = 250, Pt = 5, nt = 240, Ct = 600, ot = 40, st = 30, dt = (n, r) => Math.max(0, Math.min(n.x + n.w, r.x + r.w) - Math.max(n.x, r.x)) * Math.max(0, Math.min(n.y + n.h, r.y + r.h) - Math.max(n.y, r.y));
function Ht(n, r, m, x, M, u = []) {
  const l = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let d = l[0], A = 1 / 0;
  for (const S of l) {
    const y = gt(ht(n, r, m, S), x, M, u);
    if (y <= 1e-9) return S;
    y < A && (d = S, A = y);
  }
  return d;
}
function ht(n, r, m, x) {
  const M = x.right ? ot : -(ot + r.w), u = x.down ? st : -(st + r.h);
  return { x: n.x + M / m, y: n.y + u / m, w: r.w / m, h: r.h / m };
}
function bt(n, r) {
  const m = H(Y(n.label), 48), x = Nt(n), M = x ? H(x, 40) : "", u = Math.max(96, Math.min(nt, 16 + Math.max(7 * m.length, 6.3 * M.length))), l = M ? 38 : 22, d = r ? (n.plan?.steps ?? []).length : 0;
  return { width: u, height: l, w: Math.max(u, d ? nt : 0), h: l + (d ? 18 + d * 18 : 0) };
}
function Ot(n, r, m, x, M = []) {
  const u = Math.min(8, n.w / 4, n.h / 4), l = [
    { x: n.x + n.w - u, y: n.y + n.h - u, side: { right: !0, down: !0 } },
    { x: n.x + u, y: n.y + n.h - u, side: { right: !1, down: !0 } },
    { x: n.x + n.w - u, y: n.y + u, side: { right: !0, down: !1 } },
    { x: n.x + u, y: n.y + u, side: { right: !1, down: !1 } }
  ];
  let d = l[0], A = 1 / 0;
  for (const S of l) {
    const y = gt(ht(S, r, m, S.side), x, [n], M);
    if (y <= 1e-9) return S;
    y < A && (d = S, A = y);
  }
  return d;
}
function gt(n, r, m, x) {
  return (r ? n.w * n.h - dt(n, r) : 0) * 10 + m.reduce((u, l) => u + dt(n, l), 0) * 3 + x.reduce((u, l) => u + dt(n, l), 0);
}
function Wt(n, r = {}) {
  const m = r.now ?? (() => Date.now()), x = r.reducedMotion ?? jt, M = r.holdMs ?? St, u = r.fadeMs ?? kt, l = r.maxAgents ?? Tt, d = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Set();
  let S = [], y = null, O = null, $ = null, B = !1, rt = 0;
  const Lt = () => (y && y.node?.isConnected !== !1 && y.node?.parentNode || (y = n.canvas.group(), y.attr({ "data-agent-presence": "", "pointer-events": "none" })), y);
  function pt() {
    try {
      const t = n.canvas.viewbox(), e = n.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !e?.width || !e?.height) return null;
      const o = String(n.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), i = e.width / t.width, c = e.height / t.height, f = o === "none" ? i : /slice/.test(o) ? Math.max(i, c) : Math.min(i, c), p = e.width / f, h = e.height / f;
      return { view: { x: t.x + (t.width - p) / 2, y: t.y + (t.height - h) / 2, w: p, h }, scale: f };
    } catch {
      return null;
    }
  }
  function q() {
    const t = pt();
    if (t) return t.scale;
    try {
      const e = n.getZoom?.();
      if (typeof e == "number" && e > 0) return e;
    } catch {
    }
    return 1;
  }
  const It = () => {
    try {
      return n.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function _t(t) {
    const o = (n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((i) => i?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function yt(t) {
    const e = t?.options;
    return !e || ![e.x, e.y, e.width, e.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: e.x, y: e.y, w: e.width, h: e.height };
  }
  const Et = (t) => n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((e) => e?.options?.name === t), U = () => (n.nodes?.allNodes ?? []).map(yt).filter((t) => !!t), Ft = (t, e) => t.x === e.x && t.y === e.y && t.w === e.w && t.h === e.h;
  function it() {
    return U().map((t) => [t.x, t.y, t.w, t.h].map(Math.round).join(",")).join(";");
  }
  function at() {
    const t = W(), e = q();
    return t ? [t.x, t.y, t.w, t.h].map((o) => Math.round(o * e / 8)).join(":") : "";
  }
  function W() {
    const t = pt();
    if (t) return t.view;
    try {
      const e = n.canvas.viewbox();
      if (e && [e.x, e.y, e.width, e.height].every((o) => Number.isFinite(o)) && e.width > 0 && e.height > 0)
        return { x: e.x, y: e.y, w: e.width, h: e.height };
    } catch {
    }
    return null;
  }
  function Dt(t, e = { w: nt, h: 38 }, o = 1) {
    const i = W();
    if (i) {
      const p = 8 / o, h = t * 64 / o, N = [
        { x: i.x + p, y: i.y + p + h, side: { right: !0, down: !0 } },
        { x: i.x + i.w - p, y: i.y + p + h, side: { right: !1, down: !0 } },
        { x: i.x + p, y: i.y + i.h - p - h, side: { right: !0, down: !1 } },
        { x: i.x + i.w - p, y: i.y + i.h - p - h, side: { right: !1, down: !1 } }
      ], s = U();
      let v = N[0], L = 1 / 0;
      for (const a of N) {
        const T = gt(ht(a, e, o, a.side), i, [], s);
        if (T <= 1e-9) return a;
        T < L && (v = a, L = T);
      }
      return v;
    }
    let c = 1 / 0, f = 1 / 0;
    for (const p of n.nodes?.allNodes ?? []) {
      const h = p?.options;
      typeof h?.x == "number" && typeof h?.y == "number" && (c = Math.min(c, h.x), f = Math.min(f, h.y));
    }
    return Number.isFinite(c) || (c = 100, f = 100), { x: c - 40, y: f - 40 + t * 64, side: null };
  }
  function Kt(t, e, o) {
    const { record: i } = t, c = et[(i.colorIndex % et.length + et.length) % et.length], f = Nt(i), p = At(i), h = p.length > 0 && (t.open || !o), N = H(Y(i.label), 48);
    t.body?.remove();
    const s = t.group.group();
    t.body = s, s.path("M0 0 L14 5 L7 7 L5 14 Z").fill(c).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const v = s.group().attr("data-agent-avatar", ""), L = 11, a = 24, T = 24, tt = Array.from({ length: 6 }, (g, _) => {
      const G = Math.PI / 6 + _ * Math.PI / 3;
      return (a + L * Math.cos(G)).toFixed(2) + "," + (T + L * Math.sin(G)).toFixed(2);
    }).join(" ");
    v.polygon(tt).fill(c).stroke({ color: "#fff", width: 1.5 }), v.text((g) => g.plain(H(Y(i.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: a, y: T + 4 }), v.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: c, width: 0.8 });
    const k = s.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: p.length ? "pointer" : "default",
      role: "button",
      tabindex: p.length ? 0 : -1,
      "aria-expanded": String(h),
      "aria-label": N + (f ? ": " + f : "")
    }), F = f ? H(f, 40) : "", w = bt(i, h), { width: I, height: j } = w, z = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, D = t.routedSide ?? Ht(z, w, e, W(), [], U());
    let K = D.right ? ot : -(ot + w.w), R = D.down ? st : -(st + w.h);
    const b = W();
    if (b) {
      const _ = z, G = (b.x - _.x) * e + 4, V = (b.x + b.w - _.x) * e - 4, X = (b.y - _.y) * e + 4, ft = (b.y + b.h - _.y) * e - 4;
      w.w <= V - G && (K = Math.min(Math.max(K, G), V - w.w)), w.h <= ft - X && (R = Math.min(Math.max(R, X), ft - w.h));
    }
    t.side = D;
    let P = D.right, C = D.down;
    if (b) {
      const g = (a + L + 2) / e;
      P && z.x + g > b.x + b.w ? P = !1 : !P && z.x - g < b.x && (P = !0), C && z.y + g > b.y + b.h ? C = !1 : !C && z.y - g < b.y && (C = !0);
    }
    (!P || !C) && v.attr("transform", `translate(${P ? 0 : -2 * a} ${C ? 0 : -2 * T})`), k.attr("data-agent-side", (D.right ? "right" : "left") + "-" + (D.down ? "down" : "up")), k.rect(I, j).radius(7).move(K, R).fill("#fff").stroke({ color: c, width: 1.5 }), k.text((g) => g.plain(N)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(c).attr({ x: K + 8, y: R + 15 }), F && k.text((g) => g.plain(F)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: K + 8, y: R + 31 });
    const Mt = (g) => {
      g.stopPropagation?.(), mt.expand(i.agentKey);
    };
    if (k.on("pointerdown", (g) => g.stopPropagation?.()), k.on("click", Mt), k.on("keydown", (g) => {
      (g.key === "Enter" || g.key === " ") && (g.preventDefault?.(), Mt(g));
    }), h) {
      const g = s.group().attr("data-agent-plan", ""), _ = p.length;
      g.rect(nt, 12 + _ * 18).radius(8).move(K, R + j + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), p.forEach((G, V) => {
        const X = i.plan.steps[V].status;
        g.text((Yt) => Yt.plain(H(G, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: X === "doing" ? 600 : 400 }).fill(X === "done" || X === "skipped" ? "#6b7280" : "#111827").attr({ x: K + 10, y: R + j + 6 + 20 + V * 18 }).attr("data-step-status", X);
      });
    }
    s.element("title").words(N + (f ? " — " + f : "")), t.compact = o, t.lines = p, t.step = f, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), rt = e;
  }
  function xt(t, e) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function lt(t, e, o, i) {
    const c = W(), f = U(), h = t.targets.map((s) => yt(Et(s))).filter((s) => !!s).slice(0, Pt).map((s) => Ot(s, o, i, c, f.filter((v) => !Ft(v, s))));
    if (!h.length) {
      const s = Dt(e, o, i);
      return { legs: [{ x: s.x, y: s.y, ms: ut }], side: s.side };
    }
    const N = h.length === 1 ? ut : zt;
    return { legs: h.map((s) => ({ x: s.x, y: s.y, ms: N })), side: h[h.length - 1].side };
  }
  const ct = (t) => t.targets.some((e) => _t(e) !== null), Rt = (t) => 1 - Math.pow(1 - t, 3);
  function wt(t) {
    let e = !1;
    for (const o of d.values())
      for (; o.path.length; ) {
        const i = o.path[0];
        if (x() || i.ms <= 0) {
          o.x = i.x, o.y = i.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const c = Math.min(1, (t - o.leg.startedAt) / i.ms), f = Rt(c);
        if (o.x = o.leg.fromX + (i.x - o.leg.fromX) * f, o.y = o.leg.fromY + (i.y - o.leg.fromY) * f, c < 1) {
          e = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return e;
  }
  function Z() {
    if (B) return;
    const t = m(), e = vt(S, t, { holdMs: M, fadeMs: u, max: l }), o = new Set(e.map((s) => s.record.agentKey));
    for (const [s, v] of d) o.has(s) || (v.group.remove(), d.delete(s));
    if (!e.length) {
      J(null);
      return;
    }
    const i = Lt();
    i.front?.();
    const c = q(), f = e.length >= 2 || It() < Ct;
    e.forEach(({ record: s, opacity: v }, L) => {
      let a = d.get(s.agentKey);
      const T = s.targets.join("\0"), tt = A.has(s.agentKey), k = bt(s, At(s).length > 0 && (tt || !f)), F = [k.w, k.h, c.toFixed(4), at(), it()].join(",");
      if (a) {
        if (a.targetsKey !== T || !a.found && ct(s)) {
          const w = lt(s, L, k, c);
          a.path = w.legs, a.leg = null, a.found = ct(s), a.routedSide = w.side, a.routedFor = F;
        } else if (a.routedFor !== F && a.found) {
          const w = lt(s, L, k, c), I = w.legs[w.legs.length - 1], j = a.path.length ? a.path[a.path.length - 1] : { x: a.x, y: a.y };
          (I.x !== j.x || I.y !== j.y) && (a.path = [{ ...I, ms: ut }], a.leg = null), a.routedSide = w.side, a.routedFor = F;
        }
      } else {
        const w = lt(s, L, k, c), I = w.legs[0];
        a = {
          key: s.agentKey,
          group: i.group().attr({ "data-agent": s.agentKey }),
          body: null,
          record: s,
          targetsKey: T,
          found: ct(s),
          x: I.x,
          y: I.y,
          path: w.legs.slice(1),
          leg: null,
          open: tt,
          opacity: v,
          compact: f,
          lines: [],
          step: null,
          routedSide: w.side,
          routedFor: F
        }, d.set(s.agentKey, a);
      }
      a.targetsKey = T, a.record = s, a.opacity = Math.max(0, Math.min(1, v)), a.open = A.has(s.agentKey), Kt(a, c, f);
    });
    const p = wt(t);
    for (const s of d.values()) xt(s, c);
    const h = e.some((s) => s.opacity < 1), N = Math.min(...e.map((s) => s.record.status === "live" && E(s.record.endedAt) === null ? s.until : (E(s.record.endedAt) ?? E(s.record.updatedAt) ?? t) + M));
    J(p || h ? "frame" : Math.max(16, N - t));
  }
  function Gt() {
    if (O = null, B) return;
    const t = m(), e = wt(t), o = q(), i = vt(S, t, { holdMs: M, fadeMs: u, max: l });
    if (i.some((f) => f.opacity < 1) || d.size !== i.length || Math.abs(o - rt) > 1e-6) {
      Z();
      return;
    }
    for (const f of d.values()) xt(f, o);
    e && J("frame");
  }
  function J(t) {
    O !== null && (cancelAnimationFrame(O), O = null), $ !== null && (clearTimeout($), $ = null), !(t === null || B) && (t === "frame" ? O = requestAnimationFrame(Gt) : $ = setTimeout(Z, Math.min(t, 6e4)));
  }
  let Q = null;
  const Xt = () => {
    if (Q !== null) return;
    let t = at(), e = it(), o = e;
    Q = setInterval(() => {
      if (B || !d.size) return;
      const i = at(), c = it(), f = c === e && c !== o;
      e = c, (Math.abs(q() - rt) > 1e-6 || i !== t || f) && (t = i, o = c, Z());
    }, 250);
  }, mt = {
    set(t) {
      B || (S = Array.isArray(t) ? t.filter((e) => e && typeof e.agentKey == "string") : [], Z(), Xt());
    },
    expand(t, e) {
      const o = e ?? !A.has(t);
      o ? A.add(t) : A.delete(t), r.onToggle?.(t, o), Z();
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
      B = !0, J(null), Q !== null && clearInterval(Q);
      for (const t of d.values()) t.group.remove();
      d.clear(), y?.remove(), y = null;
    }
  };
  return mt;
}
export {
  kt as AGENT_FADE_MS,
  ut as AGENT_GLIDE_MS,
  St as AGENT_HOLD_MS,
  Tt as AGENT_MAX_DRAWN,
  Pt as AGENT_MAX_VISITS,
  et as AGENT_PALETTE,
  zt as AGENT_VISIT_MS,
  Ot as agentAnchor,
  At as agentChecklist,
  Nt as agentStepText,
  ht as agentTagBox,
  Ht as agentTagSide,
  Wt as createAgentPresence,
  vt as visibleAgents
};
